#!/usr/bin/env python3
"""Crash-safe local store for RGC resume records.

Writes are serialized with an advisory lock, compare record_revision, validate
the writer's control/fencing generation, fsync a canonical JSON temp file,
atomically replace the record, and fsync the parent directory.
"""
from __future__ import annotations

import copy
import fcntl
import hashlib
import json
import os
import tempfile
from pathlib import Path
from typing import Any, Callable

import jsonschema

# 载入时记录源码身份；不改变业务状态或执行权限。
_LOADED_SOURCE_PATH = Path(__file__).absolute()
_LOADED_SOURCE_SHA256 = hashlib.sha256(_LOADED_SOURCE_PATH.read_bytes()).hexdigest()
def loaded_source_identity():
    return {'path': str(_LOADED_SOURCE_PATH), 'sha256': _LOADED_SOURCE_SHA256}



class StoreConflict(ValueError):
    """A stale revision, control generation, or fencing token attempted a write."""


def canonical_bytes(value: Any) -> bytes:
    return (json.dumps(value, ensure_ascii=False, sort_keys=True, separators=(",", ":")) + "\n").encode("utf-8")


class ResumeStore:
    def __init__(self, path: Path, schema_path: Path | None = None):
        self.path = Path(path)
        self.schema_path = schema_path or Path(__file__).resolve().parents[1] / "schemas" / "rgc_resume_record_v1.schema.json"
        self._schema = json.loads(self.schema_path.read_text(encoding="utf-8"))
        jsonschema.Draft202012Validator.check_schema(self._schema)

    def _validate(self, record: dict[str, Any]) -> None:
        errors = list(jsonschema.Draft202012Validator(self._schema, format_checker=jsonschema.FormatChecker()).iter_errors(record))
        if errors:
            raise ValueError("RESUME_RECORD_SCHEMA_INVALID:" + errors[0].message)

    def read(self) -> dict[str, Any]:
        try:
            record = json.loads(self.path.read_text(encoding="utf-8"))
        except (OSError, json.JSONDecodeError) as exc:
            raise ValueError("RESUME_RECORD_UNREADABLE") from exc
        if not isinstance(record, dict):
            raise ValueError("RESUME_RECORD_SCHEMA_INVALID")
        self._validate(record)
        return record

    def _lock(self):
        self.path.parent.mkdir(parents=True, exist_ok=True)
        lock_path = self.path.with_name(self.path.name + ".lock")
        handle = lock_path.open("a+b")
        fcntl.flock(handle.fileno(), fcntl.LOCK_EX)
        return handle

    def _atomic_replace(self, record: dict[str, Any]) -> None:
        payload = canonical_bytes(record)
        fd, raw_temp = tempfile.mkstemp(prefix=f".{self.path.name}.", suffix=".tmp", dir=self.path.parent)
        temp_path = Path(raw_temp)
        try:
            with os.fdopen(fd, "wb") as handle:
                handle.write(payload)
                handle.flush()
                os.fsync(handle.fileno())
            os.replace(temp_path, self.path)
            dir_fd = os.open(self.path.parent, os.O_RDONLY)
            try:
                os.fsync(dir_fd)
            finally:
                os.close(dir_fd)
        finally:
            if temp_path.exists():
                temp_path.unlink()

    def create(self, record: dict[str, Any]) -> dict[str, Any]:
        candidate = copy.deepcopy(record)
        self._validate(candidate)
        lock = self._lock()
        try:
            if self.path.exists():
                raise StoreConflict("RECORD_ALREADY_EXISTS")
            self._atomic_replace(candidate)
            return candidate
        finally:
            lock.close()

    def compare_and_swap(
        self,
        expected_revision: int,
        mutate: Callable[[dict[str, Any]], dict[str, Any] | None],
        *,
        fencing_token: str | None = None,
        control_revision: int | None = None,
    ) -> dict[str, Any]:
        missing: list[str] = []
        if fencing_token is None:
            missing.append("FENCING_TOKEN_REQUIRED")
        if control_revision is None:
            missing.append("CONTROL_REVISION_REQUIRED")
        if missing:
            raise StoreConflict("+".join(missing))
        lock = self._lock()
        try:
            current = self.read()
            if current.get("record_revision") != expected_revision:
                raise StoreConflict("CAS_REVISION_MISMATCH")
            lease = current.get("executor_lease", {})
            binding = current.get("goal_binding", {})
            if lease.get("fencing_token") != fencing_token:
                raise StoreConflict("STALE_FENCING_TOKEN")
            if binding.get("control_revision") != control_revision:
                raise StoreConflict("STALE_CONTROL_REVISION")
            candidate = copy.deepcopy(current)
            replacement = mutate(candidate)
            if replacement is not None:
                candidate = replacement
            if not isinstance(candidate, dict):
                raise ValueError("RESUME_RECORD_MUTATOR_INVALID")
            candidate["record_revision"] = expected_revision + 1
            self._validate(candidate)
            self._atomic_replace(candidate)
            return candidate
        finally:
            lock.close()

    def pause(self, expected_revision: int, *, reason: str, fencing_token: str, control_revision: int) -> dict[str, Any]:
        def mutate(record: dict[str, Any]) -> None:
            next_control = control_revision + 1
            record["goal_binding"]["control_revision"] = next_control
            record["executor_lease"]["state"] = "fenced"
            record["continuation"].update({
                "eligible": False,
                "state": "ineligible",
                "reason_codes": ["USER_PAUSE_ACTIVE"],
                "action_token": None,
                "token_control_revision": next_control,
                "token_record_revision": expected_revision + 1,
                "stop_reason": reason,
            })
        return self.compare_and_swap(expected_revision, mutate, fencing_token=fencing_token, control_revision=control_revision)

    def acquire_lease(
        self,
        expected_revision: int,
        *,
        owner_id: str,
        owner_role: str,
        issued_at_utc: str,
        expires_at_utc: str,
        control_revision: int,
    ) -> dict[str, Any]:
        """Atomically acquire an absent/expired lease and mint a new fence."""
        lock = self._lock()
        try:
            current = self.read()
            if current.get("record_revision") != expected_revision:
                raise StoreConflict("CAS_REVISION_MISMATCH")
            if current.get("goal_binding", {}).get("control_revision") != control_revision:
                raise StoreConflict("STALE_CONTROL_REVISION")
            lease = current.get("executor_lease", {})
            if (
                lease.get("state") == "active"
                and lease.get("owner_id") == owner_id
                and lease.get("owner_role") == owner_role
            ):
                return current
            if lease.get("state") not in {"expired", "released"}:
                raise StoreConflict("LEASE_NOT_EXPIRED")
            epoch = int(lease.get("owner_epoch", 0)) + 1
            fence = hashlib.sha256(canonical_bytes({
                "record_id": current.get("record_id"),
                "record_revision": expected_revision + 1,
                "owner_id": owner_id,
                "owner_epoch": epoch,
                "control_revision": control_revision,
                "issued_at_utc": issued_at_utc,
            })).hexdigest()
            candidate = copy.deepcopy(current)
            candidate["executor_lease"] = {
                "owner_id": owner_id,
                "owner_role": owner_role,
                "lease_id": f"lease-{fence[:24]}",
                "owner_epoch": epoch,
                "fencing_token": fence,
                "issued_at_utc": issued_at_utc,
                "expires_at_utc": expires_at_utc,
                "state": "active",
            }
            candidate["record_revision"] = expected_revision + 1
            self._validate(candidate)
            self._atomic_replace(candidate)
            return candidate
        finally:
            lock.close()

    def renew_lease(
        self,
        expected_revision: int,
        *,
        owner_id: str,
        owner_epoch: int,
        fencing_token: str,
        control_revision: int,
        expires_at_utc: str,
    ) -> dict[str, Any]:
        def mutate(record: dict[str, Any]) -> None:
            lease = record["executor_lease"]
            if lease.get("state") != "active":
                raise StoreConflict("LEASE_NOT_ACTIVE")
            if lease.get("owner_id") != owner_id or lease.get("owner_epoch") != owner_epoch:
                raise StoreConflict("LEASE_OWNER_MISMATCH")
            lease["expires_at_utc"] = expires_at_utc

        return self.compare_and_swap(
            expected_revision,
            mutate,
            fencing_token=fencing_token,
            control_revision=control_revision,
        )

    def record_logical_action(
        self,
        expected_revision: int,
        logical_action_id: str,
        value: dict[str, Any],
        *,
        fencing_token: str,
        control_revision: int,
    ) -> dict[str, Any]:
        def mutate(record: dict[str, Any]) -> None:
            actions = record["idempotency_state"].setdefault("logical_actions", {})
            existing = actions.get(logical_action_id)
            if existing and existing.get("execution_state") in {"acknowledged", "completed"} and value.get("execution_state") != existing.get("execution_state"):
                raise StoreConflict("LOGICAL_ACTION_STATE_REGRESSION")
            actions[logical_action_id] = copy.deepcopy(value)
        return self.compare_and_swap(expected_revision, mutate, fencing_token=fencing_token, control_revision=control_revision)

    def reconcile_logical_action(
        self,
        expected_revision: int,
        logical_action_id: str,
        *,
        observation: dict[str, Any],
        fencing_token: str,
        control_revision: int,
    ) -> dict[str, Any]:
        def mutate(record: dict[str, Any]) -> None:
            actions = record["idempotency_state"].setdefault("logical_actions", {})
            action = actions.get(logical_action_id)
            if not isinstance(action, dict):
                raise StoreConflict("LOGICAL_ACTION_NOT_FOUND")
            if action.get("execution_state") in {"acknowledged", "completed"}:
                return
            if observation.get("status") != "completed" or not observation.get("result_ref") or not observation.get("result_sha256"):
                raise StoreConflict("ACTION_RECONCILIATION_UNAVAILABLE")
            action.update({
                "execution_state": "completed",
                "result_ref": observation["result_ref"],
                "result_sha256": observation["result_sha256"],
            })

        return self.compare_and_swap(
            expected_revision,
            mutate,
            fencing_token=fencing_token,
            control_revision=control_revision,
        )

    def claim_logical_action(
        self,
        expected_revision: int,
        logical_action_id: str,
        *,
        logical_action_request_sha256: str,
        owner_attempt_token: str,
        fencing_token: str,
        control_revision: int,
    ) -> dict[str, Any]:
        """Persist one started claim before returning first-dispatch permission.

        A concurrent retry for the same durable logical action observes the
        already-started claim and is routed to reconciliation without a second
        revision increment or dispatch permission.
        """
        lock = self._lock()
        try:
            current = self.read()
            lease = current.get("executor_lease", {})
            binding = current.get("goal_binding", {})
            if lease.get("fencing_token") != fencing_token:
                raise StoreConflict("STALE_FENCING_TOKEN")
            if binding.get("control_revision") != control_revision:
                raise StoreConflict("STALE_CONTROL_REVISION")
            if lease.get("state") != "active" or current.get("continuation", {}).get("eligible") is not True:
                return {"dispatch_allowed": False, "decision": "BLOCK_USER_PAUSE", "reason_codes": ["LEASE_NOT_ACTIVE"]}

            state = current.get("idempotency_state", {})
            actions = state.get("logical_actions", {})
            existing = actions.get(logical_action_id)
            if isinstance(existing, dict):
                execution_state = existing.get("execution_state")
                if execution_state in {"acknowledged", "completed"}:
                    return {"dispatch_allowed": False, "decision": "REUSE_DURABLE_RESULT", "logical_action": copy.deepcopy(existing)}
                return {"dispatch_allowed": False, "decision": "RECONCILE_BEFORE_RETRY", "logical_action": copy.deepcopy(existing)}

            if current.get("record_revision") != expected_revision:
                raise StoreConflict("CAS_REVISION_MISMATCH")
            candidate = copy.deepcopy(current)
            candidate_state = candidate["idempotency_state"]
            candidate_state.setdefault("logical_actions", {})[logical_action_id] = {
                "execution_state": "started",
                "owner_attempt_token": owner_attempt_token,
            }
            candidate_state.update({
                "logical_action_id": logical_action_id,
                "logical_action_request_sha256": logical_action_request_sha256,
                "execution_state": "started",
                "current_owner_attempt_id": owner_attempt_token,
                "ack_id": None,
                "result_ref": None,
                "result_sha256": None,
                "reconciliation_status": "started",
            })
            candidate["record_revision"] = expected_revision + 1
            self._validate(candidate)
            self._atomic_replace(candidate)
            return {
                "dispatch_allowed": True,
                "decision": "DISPATCH_CURRENT_FENCED_ATTEMPT",
                "record_revision": candidate["record_revision"],
                "logical_action": copy.deepcopy(candidate_state["logical_actions"][logical_action_id]),
            }
        finally:
            lock.close()

    def refresh_repository_identity(
        self,
        expected_revision: int,
        *,
        new_repository: dict[str, Any],
        mutation_evidence: dict[str, Any],
        fencing_token: str,
        control_revision: int,
    ) -> dict[str, Any]:
        def mutate(record: dict[str, Any]) -> None:
            old_repository = record["repository"]
            continuation = record["continuation"]
            valid = (
                mutation_evidence.get("verdict") == "trusted"
                and mutation_evidence.get("action_token") == continuation.get("action_token")
                and mutation_evidence.get("old_worktree_state_sha256") == old_repository.get("worktree_state_sha256")
                and mutation_evidence.get("new_worktree_state_sha256") == new_repository.get("worktree_state_sha256")
            )
            if not valid:
                raise StoreConflict("REPOSITORY_IDENTITY_STALE")
            record["repository"] = copy.deepcopy(new_repository)
            continuation.update({
                "eligible": False,
                "state": "recovering",
                "reason_codes": ["REPOSITORY_IDENTITY_REFRESHED"],
                "action_token": None,
                "token_control_revision": control_revision,
                "token_record_revision": expected_revision + 1,
                "stop_reason": None,
            })

        return self.compare_and_swap(
            expected_revision,
            mutate,
            fencing_token=fencing_token,
            control_revision=control_revision,
        )


def validate_before_side_effect(
    store: ResumeStore,
    *,
    expected_revision: int,
    fencing_token: str,
    control_revision: int,
    logical_action_id: str,
) -> dict[str, Any]:
    record = store.read()
    if record.get("record_revision") != expected_revision:
        raise StoreConflict("CAS_REVISION_MISMATCH")
    if record.get("executor_lease", {}).get("fencing_token") != fencing_token:
        raise StoreConflict("STALE_FENCING_TOKEN")
    if record.get("goal_binding", {}).get("control_revision") != control_revision:
        raise StoreConflict("STALE_CONTROL_REVISION")
    lease = record.get("executor_lease", {})
    continuation = record.get("continuation", {})
    if lease.get("state") != "active" or continuation.get("eligible") is not True:
        return {"dispatch_allowed": False, "decision": "BLOCK_USER_PAUSE", "reason_codes": ["LEASE_NOT_ACTIVE"]}
    action = record.get("idempotency_state", {}).get("logical_actions", {}).get(logical_action_id)
    if action and action.get("execution_state") in {"acknowledged", "completed"}:
        return {"dispatch_allowed": False, "decision": "REUSE_DURABLE_RESULT", "logical_action": action}
    if action and action.get("execution_state") in {"started", "uncertain"}:
        return {"dispatch_allowed": False, "decision": "RECONCILE_BEFORE_RETRY", "logical_action": action}
    return {"dispatch_allowed": True, "decision": "DISPATCH_CURRENT_FENCED_ATTEMPT", "logical_action": action}
