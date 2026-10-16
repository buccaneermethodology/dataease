#!/usr/bin/env python3
"""Ordered external supervisor for the RGC App Server adapter."""
from __future__ import annotations

import hashlib
import heapq
import json
import time
import uuid
from dataclasses import dataclass, field
from pathlib import Path
from typing import Any, Callable

from reliable_goal_continuation import (
    advance_checkpoint,
    authorize_supervisor_action,
    build_recovery_plan,
    classify_intent,
    evaluate_continuation,
)
from rgc_app_server_adapter import AppServerAdapter, RequestContext
from rgc_resume_store import ResumeStore, StoreConflict

# 载入时记录源码身份；不改变业务状态或执行权限。
_LOADED_SOURCE_PATH = Path(__file__).absolute()
_LOADED_SOURCE_SHA256 = hashlib.sha256(_LOADED_SOURCE_PATH.read_bytes()).hexdigest()
def loaded_source_identity():
    return {'path': str(_LOADED_SOURCE_PATH), 'sha256': _LOADED_SOURCE_SHA256}



CONTROL_KINDS = frozenset({"pause", "stop", "cancel", "goal_change", "wait_confirm"})
PRIORITY = {"control": 0, "host_event": 1, "store_change": 2, "observation": 3, "timer": 4, "administrative": 5}
RECOVERY_STEPS = (
    "READ_AND_VALIDATE_RESUME_RECORD", "VERIFY_GOAL_IDENTITY",
    "VERIFY_AUTHORITY_AND_CONTROL_REVISION", "VERIFY_GOAL_NOT_COMPLETE",
    "VERIFY_REPOSITORY_AND_RUNTIME_IDENTITY", "VERIFY_LAST_PROGRESS_EVIDENCE",
    "VERIFY_NO_CONFLICTING_EXECUTOR_OR_ACQUIRE_FENCED_OWNERSHIP",
    "REEVALUATE_ACTION_SPECIFIC_PREDICATE",
)


def _digest(value: Any) -> str:
    return hashlib.sha256(json.dumps(value, sort_keys=True, separators=(",", ":")).encode()).hexdigest()


@dataclass(order=True)
class Ingress:
    sort_key: tuple[int, int] = field(init=False, repr=False)
    source_sequence: int
    category: str
    kind: str
    payload: dict[str, Any] = field(default_factory=dict, compare=False)

    def __post_init__(self) -> None:
        if self.category not in PRIORITY:
            raise ValueError("UNKNOWN_INGRESS_CATEGORY")
        self.sort_key = (PRIORITY[self.category], self.source_sequence)


class Supervisor:
    """Combines the P2 pure core/store with one adapter actuator.

    Goal and authority readers are injected because the Resume Record is only
    an index. Every evaluation therefore reloads trusted authorities.
    """

    def __init__(
        self,
        *,
        store_path: Path,
        adapter: AppServerAdapter,
        owner_id: str,
        authority_reader: Callable[[], dict[str, Any]],
        runtime_reader: Callable[[], dict[str, Any]],
        repository_reader: Callable[[], dict[str, Any]],
        admission_reader: Callable[[], dict[str, Any]],
        monotonic: Callable[[], float] = time.monotonic,
    ):
        self.store_path = Path(store_path)
        self.adapter = adapter
        self.owner_id = owner_id
        self.authority_reader = authority_reader
        self.runtime_reader = runtime_reader
        self.repository_reader = repository_reader
        self.admission_reader = admission_reader
        self.monotonic = monotonic
        self._ingress: list[Ingress] = []
        self._sequence = 0
        self.audit: list[dict[str, Any]] = []
        self.last_progress_monotonic = monotonic()
        self.checkpoint_round = 0
        self.checkpoint_query_id: str | None = None
        self.restart_actor: str | None = None

    def _store(self) -> ResumeStore:
        return ResumeStore(self.store_path)

    def enqueue(self, category: str, kind: str, payload: dict[str, Any] | None = None) -> int:
        self._sequence += 1
        ingress = Ingress(self._sequence, category, kind, payload or {})
        heapq.heappush(self._ingress, ingress)
        return self._sequence

    def drain_batch(self) -> list[dict[str, Any]]:
        batch: list[Ingress] = []
        while self._ingress:
            batch.append(heapq.heappop(self._ingress))
        results = []
        for ingress in batch:
            if ingress.category == "control" or ingress.kind in CONTROL_KINDS:
                result = self._apply_control(ingress)
            elif ingress.category == "observation":
                result = self._observe(ingress)
            elif ingress.category == "timer":
                result = self._timer(ingress)
            else:
                result = {"action": "recorded", "kind": ingress.kind}
            entry = {"source_sequence": ingress.source_sequence, "category": ingress.category, "kind": ingress.kind, "result": result}
            self.audit.append(entry)
            results.append(entry)
        return results

    def _trusted_context(self) -> dict[str, Any]:
        authority = self.authority_reader()
        runtime = self.runtime_reader()
        repository = self.repository_reader()
        admission = self.admission_reader()
        if admission.get("action") != "builder" or admission.get("target") != "SP-010/P3":
            raise StoreConflict("ADMISSION_INVALID")
        return {"authority": authority, "runtime": runtime, "repository": repository, "admission": admission}

    def _apply_control(self, ingress: Ingress) -> dict[str, Any]:
        record = self._store().read()
        control_revision = record["goal_binding"]["control_revision"]
        fence = record["executor_lease"]["fencing_token"]
        classified = classify_intent({
            "parameters": {
                "message": ingress.payload.get("message", "暂停"),
                "before_control_revision": control_revision,
                "before_eligible": record["continuation"]["eligible"],
                "prior_stop_reason": record["continuation"].get("stop_reason") or "none",
            },
            "context": {"control": {"pause_active": True}},
        })
        if not str(classified.get("classification", ingress.kind)).startswith("control_") and ingress.kind not in CONTROL_KINDS:
            return {"applied": False, "reason": "NOT_CONTROL"}
        paused = self._store().pause(
            record["record_revision"], reason=f"user_{ingress.kind}", fencing_token=fence,
            control_revision=control_revision,
        )
        return {
            "applied": True, "record_revision": paused["record_revision"],
            "control_revision": paused["goal_binding"]["control_revision"],
            "old_action_token_valid": False, "lease_state": paused["executor_lease"]["state"],
        }

    def _observe(self, ingress: Ingress) -> dict[str, Any]:
        record = self._store().read()
        return {
            "observation_only": True, "control_revision": record["goal_binding"]["control_revision"],
            "eligible": record["continuation"]["eligible"], "snapshot_digest": _digest(ingress.payload),
        }

    def _timer(self, ingress: Ingress) -> dict[str, Any]:
        silence = ingress.payload.get("silence_seconds", self.monotonic() - self.last_progress_monotonic)
        request = {"parameters": {"checkpoint_round": self.checkpoint_round, "accepted_progress": False, "progress_silence_seconds": silence}}
        if self.checkpoint_round == 1:
            request["parameters"].update({
                "response": ingress.payload.get("response", {}),
                "response_timeout_elapsed": ingress.payload.get("response_timeout_elapsed", False),
                "inter_checkpoint_delay_elapsed": ingress.payload.get("inter_checkpoint_delay_elapsed", False),
                "next_checkpoint_query_id": ingress.payload.get("next_checkpoint_query_id"),
            })
        elif self.checkpoint_round == 2:
            request["parameters"]["second_timeout_elapsed"] = ingress.payload.get("second_timeout_elapsed", False)
        result = advance_checkpoint(request)
        self.checkpoint_round = result.get("checkpoint_round", self.checkpoint_round)
        if result.get("action") == "SEND_CHECKPOINT":
            self.checkpoint_query_id = result.get("checkpoint_query_id") or f"checkpoint-{uuid.uuid4().hex}"
            result["checkpoint_query_id"] = self.checkpoint_query_id
        return result

    def evaluate(self, facts: dict[str, Any]) -> dict[str, Any]:
        trusted = self._trusted_context()
        record = self._store().read()
        parameters = dict(facts)
        parameters.update({
            "authority": trusted["authority"], "runtime": trusted["runtime"],
            "repository": trusted["repository"], "admission": {**trusted["admission"], "required": True, "validated": True},
            "control": {"pause_active": not record["continuation"]["eligible"]},
            "identity_fresh": True,
        })
        return evaluate_continuation({"parameters": parameters, "context": {"control": {"current_revision": record["goal_binding"]["control_revision"]}}})

    def dispatch_authorized_action(
        self,
        *,
        method: str,
        params: dict[str, Any],
        logical_action_id: str,
        action_token: str,
        authority_revision: int,
        owner_attempt_token: str,
    ) -> dict[str, Any]:
        if not authorize_supervisor_action({"parameters": {"action": "dispatch_current_authorized_action"}}).get("allowed"):
            raise StoreConflict("SEMANTIC_AUTHORITY_FORBIDDEN")
        trusted = self._trusted_context()
        record = self._store().read()
        if trusted["authority"].get("revision") != authority_revision or trusted["authority"].get("status") != "valid_for_action":
            raise StoreConflict("AUTHORITY_INVALID")
        if trusted["runtime"].get("identity_fresh") is not True or trusted["repository"].get("identity_fresh") is not True:
            raise StoreConflict("IDENTITY_STALE")
        lease = record["executor_lease"]
        control_revision = record["goal_binding"]["control_revision"]
        request_sha = _digest({"method": method, "params": params})
        claim = self._store().claim_logical_action(
            record["record_revision"], logical_action_id,
            logical_action_request_sha256=request_sha, owner_attempt_token=owner_attempt_token,
            fencing_token=lease["fencing_token"], control_revision=control_revision,
        )
        if claim.get("dispatch_allowed") is not True:
            return {"dispatch_granted": False, **claim}

        # Production grant: reopen the durable store, then verify every bound field.
        reopened = ResumeStore(self.store_path).read()
        action = reopened["idempotency_state"]["logical_actions"].get(logical_action_id, {})
        checks = {
            "revision": reopened["record_revision"] == claim["record_revision"],
            "state": action.get("execution_state") == "started",
            "owner": action.get("owner_attempt_token") == owner_attempt_token,
            "request": reopened["idempotency_state"].get("logical_action_request_sha256") == request_sha,
            "fence": reopened["executor_lease"].get("fencing_token") == lease["fencing_token"],
            "control": reopened["goal_binding"].get("control_revision") == control_revision,
            "token": reopened["continuation"].get("action_token") == action_token,
        }
        self.audit.append({"event": "durable_readback", "checks": checks, "record_revision": reopened["record_revision"]})
        if not all(checks.values()):
            raise StoreConflict("PRE_DISPATCH_READBACK_FAILED:" + ",".join(key for key, ok in checks.items() if not ok))
        context = RequestContext(
            logical_action_id=logical_action_id, action_token=action_token,
            authority_revision=authority_revision, control_revision=control_revision,
            record_revision=reopened["record_revision"], request_sha256=request_sha,
        )
        if method == "turn/start":
            response = self.adapter.start_turn(params, context)
        elif method == "turn/steer":
            response = self.adapter.steer_turn(params, context)
        elif method == "turn/interrupt":
            response = self.adapter.interrupt_turn(params, context)
        else:
            raise StoreConflict("ACTION_METHOD_NOT_ALLOWED")
        ack_id = _digest({"logical_action_id": logical_action_id, "response": response})

        def persist_ack(candidate: dict[str, Any]) -> None:
            current_action = candidate["idempotency_state"]["logical_actions"][logical_action_id]
            if current_action.get("execution_state") != "started" or current_action.get("owner_attempt_token") != owner_attempt_token:
                raise StoreConflict("LOGICAL_ACTION_ACK_MISMATCH")
            current_action.update({"execution_state": "acknowledged", "ack_id": ack_id, "side_effect_count": 1})
            candidate["idempotency_state"].update({
                "execution_state": "acknowledged", "ack_id": ack_id,
                "reconciliation_status": "acknowledged",
            })

        acknowledged = self._store().compare_and_swap(
            reopened["record_revision"], persist_ack,
            fencing_token=lease["fencing_token"], control_revision=control_revision,
        )
        return {
            "dispatch_granted": True, "durable_started_before_grant": True,
            "readback_checks": checks, "record_revision": reopened["record_revision"],
            "ack_record_revision": acknowledged["record_revision"], "ack_id": ack_id,
            "ack_state": "acknowledged", "response": response,
        }

    def recover(self, *, next_action: str, observed: dict[str, Any]) -> dict[str, Any]:
        record = self._store().read()
        trusted = self._trusted_context()
        checks = {
            "READ_AND_VALIDATE_RESUME_RECORD": True,
            "VERIFY_GOAL_IDENTITY": observed.get("goal_sha256") == record["goal_binding"]["goal_sha256"],
            "VERIFY_AUTHORITY_AND_CONTROL_REVISION": trusted["authority"].get("revision") == record["goal_binding"]["authority_revision"],
            "VERIFY_GOAL_NOT_COMPLETE": observed.get("unfinished") is True,
            "VERIFY_REPOSITORY_AND_RUNTIME_IDENTITY": trusted["repository"].get("identity_fresh") is True and trusted["runtime"].get("identity_fresh") is True,
            "VERIFY_LAST_PROGRESS_EVIDENCE": observed.get("last_evidence_verified") is True,
            "VERIFY_NO_CONFLICTING_EXECUTOR_OR_ACQUIRE_FENCED_OWNERSHIP": record["executor_lease"].get("state") == "active" and observed.get("owner_conflict") is not True,
            "REEVALUATE_ACTION_SPECIFIC_PREDICATE": observed.get("predicate_recomputed") is True,
        }
        result = build_recovery_plan({"parameters": {"checks": checks, "next_action": next_action}})
        result["ordered_steps"] = list(RECOVERY_STEPS)
        result["checks"] = checks
        return result

    def restart_reentry(self, actor: str, *, next_action: str, observed: dict[str, Any]) -> dict[str, Any]:
        self.restart_actor = actor
        result = self.recover(next_action=next_action, observed=observed)
        result["restart_actor"] = actor
        result["utc_elapsed_used_for_stall"] = False
        return result


__all__ = ["CONTROL_KINDS", "Ingress", "Supervisor"]
