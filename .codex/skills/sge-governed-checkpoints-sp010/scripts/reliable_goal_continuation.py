#!/usr/bin/env python3
"""Host-independent Reliable Goal Continuation decision core.

The public functions accept only runner-materialized typed requests.  They do
not receive case identity, expected results, or semantic authority.
"""
from __future__ import annotations

import hashlib
import json
from pathlib import Path
from typing import Any

import jsonschema

# 载入时记录源码身份；不改变业务状态或执行权限。
_LOADED_SOURCE_PATH = Path(__file__).absolute()
_LOADED_SOURCE_SHA256 = hashlib.sha256(_LOADED_SOURCE_PATH.read_bytes()).hexdigest()
def loaded_source_identity():
    return {'path': str(_LOADED_SOURCE_PATH), 'sha256': _LOADED_SOURCE_SHA256}



FORBIDDEN_SEMANTIC_FIELDS = {
    "goal_definition", "scope_definition", "completion_expression",
    "must_have_status_override", "semantic_verdict", "goal_complete_assertion",
}
MEANINGFUL_PROGRESS = {
    "new_finding", "new_command_result", "new_artifact", "new_code_delta",
    "new_test_result", "new_decision", "new_blocker", "next_action_convergence",
}
SEMANTIC_PROGRESS = {"new_finding", "new_decision", "new_blocker", "next_action_convergence"}
NON_PROGRESS = {"still_running", "waiting", "checking", "thinking", "status_report"}
CONTROL_INTENTS = {
    "暂停": "control_pause", "停止": "control_stop", "先不要继续": "control_pause",
    "取消这个 Goal": "control_cancel", "修改 Goal": "control_goal_change",
    "先等我确认": "control_wait_confirm", "继续": "control_resume",
}
ALLOWED_SUPERVISOR_ACTIONS = {
    "observe", "checkpoint", "classify_progress", "detect_stall",
    "evaluate_continuation", "dispatch_current_authorized_action", "resume",
    "same_role_handoff", "report",
}
RECOVERY_STEPS = [
    "READ_AND_VALIDATE_RESUME_RECORD", "VERIFY_GOAL_IDENTITY",
    "VERIFY_AUTHORITY_AND_CONTROL_REVISION", "VERIFY_GOAL_NOT_COMPLETE",
    "VERIFY_REPOSITORY_AND_RUNTIME_IDENTITY", "VERIFY_LAST_PROGRESS_EVIDENCE",
    "VERIFY_NO_CONFLICTING_EXECUTOR_OR_ACQUIRE_FENCED_OWNERSHIP",
    "REEVALUATE_ACTION_SPECIFIC_PREDICATE",
]


def _params(request: dict[str, Any]) -> dict[str, Any]:
    if not isinstance(request, dict) or not isinstance(request.get("parameters"), dict):
        raise ValueError("RGC_TYPED_REQUEST_INVALID")
    return request["parameters"]


def _context(request: dict[str, Any]) -> dict[str, Any]:
    context = request.get("context") if isinstance(request, dict) else None
    if not isinstance(context, dict):
        raise ValueError("RGC_TYPED_CONTEXT_INVALID")
    return context


def _digest(value: Any) -> str:
    blob = json.dumps(value, ensure_ascii=False, sort_keys=True, separators=(",", ":")).encode()
    return hashlib.sha256(blob).hexdigest()


def evaluate_continuation(request: dict[str, Any]) -> dict[str, Any]:
    p = _params(request)
    c = _context(request)
    goal = c.get("goal", {})
    authority_context = c.get("authority", {})
    control = c.get("control", {})
    execution_unit = c.get("execution_unit", {})
    runtime = c.get("runtime", {})
    repository = c.get("repository", {})
    evidence = c.get("evidence", {})
    ownership = c.get("ownership", {})
    admission = c.get("admission", {})

    parameter_goal = p.get("goal_state")
    control_reason = {
        "control_pause": "USER_PAUSE_ACTIVE",
        "control_stop": "USER_STOP_ACTIVE",
        "control_wait_confirm": "USER_WAIT_CONFIRM_ACTIVE",
        "control_cancel": "USER_STOP_ACTIVE",
        "control_goal_change": "USER_STOP_ACTIVE",
    }
    parameter_intent = p.get("user_intent")
    context_intent = control.get("user_intent")
    if parameter_goal == "stopped":
        return {"eligible": False, "action": "STOP_USER_CONTROL", "invalidate_prior_tokens": True, "reason_codes": ["GOAL_STOPPED"]}
    if parameter_goal == "paused" or p.get("user_pause") is True or control.get("pause_active") is True or parameter_intent in control_reason or context_intent in control_reason:
        reason = control_reason.get(parameter_intent) or control_reason.get(context_intent) or "USER_PAUSE_ACTIVE"
        return {"eligible": False, "action": "STOP_USER_CONTROL", "invalidate_prior_tokens": True, "reason_codes": [reason]}
    authority = p.get("authority")
    context_authority = authority_context.get("status")
    restrictive_authority = context_authority if context_authority in {"revoked", "expired"} else authority
    if restrictive_authority in {"revoked", "expired"}:
        reason = "AUTHORITY_REVOKED" if restrictive_authority == "revoked" else "AUTHORITY_EXPIRED"
        return {"eligible": False, "action": "BLOCK_AUTHORITY", "reason_codes": [reason]}
    if p.get("complete") is True or parameter_goal == "complete" or goal.get("completion_predicate_satisfied") is True:
        return {"eligible": False, "action": "STOP_COMPLETE", "completion_declaration_owner": "external"}
    if parameter_goal not in {None, "active"} or goal.get("state") not in {None, "active"}:
        return {"eligible": False, "action": "REBUILD_STATE", "reason_codes": ["GOAL_STATE_UNKNOWN" if "unknown" in {parameter_goal, goal.get("state")} else "GOAL_NOT_ACTIVE"]}
    if authority != "valid_for_action" or context_authority != "valid_for_requested_action" or authority_context.get("scope_allows_action") is not True:
        if authority_context.get("scope_allows_action") is False:
            reason = "AUTHORITY_SCOPE_MISMATCH"
        elif "expired" in {authority, context_authority}:
            reason = "AUTHORITY_EXPIRED"
        elif "revoked" in {authority, context_authority}:
            reason = "AUTHORITY_REVOKED"
        else:
            reason = "AUTHORITY_UNKNOWN"
        return {"eligible": False, "action": "BLOCK_AUTHORITY", "reason_codes": [reason]}
    if p.get("control_revision_current") is False or authority_context.get("revision") != authority_context.get("current_revision") or control.get("revision") != control.get("current_revision"):
        return {"eligible": False, "action": "BLOCK_AUTHORITY", "reason_codes": ["CONTROL_REVISION_STALE"]}
    if p.get("admission_valid") is False or (admission.get("required") is True and admission.get("validated") is not True):
        return {"eligible": False, "action": "BLOCK_AUTHORITY", "reason_codes": ["ADMISSION_SCHEMA_INVALID"]}
    if p.get("identity_fresh") is False or runtime.get("identity_fresh") is not True or repository.get("identity_fresh") is not True:
        return {"eligible": False, "action": "REBUILD_STATE", "reason_codes": ["IDENTITY_STALE"]}
    if evidence.get("fresh") is not True or evidence.get("readable") is not True or evidence.get("digest_verified") is not True:
        return {"eligible": False, "action": "REBUILD_STATE", "reason_codes": ["EVIDENCE_STALE"]}
    if ownership.get("conflicting_executor") is True:
        return {"eligible": False, "action": "OBSERVE_EXISTING", "new_executor": False, "reason_codes": ["OWNERSHIP_CONFLICT"]}
    if not p.get("unit_ready", False):
        return {"eligible": False, "action": "WAIT_UNIT_NOT_READY", "reason_codes": ["UNIT_NOT_READY"]}
    if execution_unit.get("ready") is not True or execution_unit.get("state") not in {"ready", "executing"}:
        return {"eligible": False, "action": "WAIT_UNIT_NOT_READY", "reason_codes": ["UNIT_NOT_READY"]}
    dependencies = p.get("dependencies", []) or execution_unit.get("blocking_dependency_ids", [])
    if dependencies:
        return {"eligible": False, "action": "WAIT_DEPENDENCY", "reason_codes": [f"BLOCKING_DEPENDENCY:{dependencies[0]}"]}
    executor = p.get("executor")
    if executor == "unknown":
        return {"eligible": False, "action": "REBUILD_STATE", "reason_codes": ["OWNERSHIP_UNKNOWN"]}
    if isinstance(executor, dict) and executor.get("state") == "running":
        same = executor.get("owner_id") == p.get("request_owner_id")
        result = {"eligible": same, "action": "OBSERVE_EXISTING", "new_executor": False}
        if not same:
            result["reason_codes"] = ["OWNERSHIP_CONFLICT"]
        return result
    return {"eligible": True, "action": "ACQUIRE_AND_DISPATCH", "reason_codes": ["RGC_ELIGIBLE"]}


def validate_snapshot(request: dict[str, Any]) -> dict[str, Any]:
    p = _params(request)
    reasons: list[str] = []
    if p.get("goal_state") == "paused" and p.get("continuation_state") == "eligible":
        return {"valid": False, "reason_codes": ["PAUSED_GOAL_CANNOT_BE_CONTINUATION_ELIGIBLE"]}
    elif p.get("goal_state") in {"complete", "stopped"} and p.get("continuation_state") == "eligible":
        reasons.append("TERMINAL_GOAL_CONTINUATION_ELIGIBLE")
    if p.get("execution_unit_state") == "completed":
        if p.get("executor_state") in {"running", "ready", "executing"}:
            reasons.append("COMPLETED_UNIT_HAS_WRITABLE_EXECUTOR")
        if p.get("continuation_state") == "eligible":
            reasons.append("TERMINAL_UNIT_CONTINUATION_ELIGIBLE")
    if str(p.get("user_intent", "")).startswith("control_") and p.get("continuation_state") == "eligible":
        reasons.append("EXPLICIT_CONTROL_CONTINUATION_ELIGIBLE")
    required_axes = ("goal_state", "turn_state", "execution_unit_state", "executor_state", "progress_state", "continuation_state", "user_intent")
    if p.get("continuation_state") == "eligible" and any(p.get(axis) == "unknown" for axis in required_axes):
        reasons.append("UNKNOWN_REQUIRED_AXIS_CONTINUATION_ELIGIBLE")
    return {"valid": not reasons, "reason_codes": reasons}


def validate_resume_record(request: dict[str, Any]) -> dict[str, Any]:
    p = _params(request)
    record = p.get("record", {})
    if any(field in record for field in FORBIDDEN_SEMANTIC_FIELDS):
        return {"valid": False, "reason_codes": ["FORBIDDEN_SEMANTIC_FIELD"]}
    if not p.get("checksum_valid", False):
        return {"valid": False, "reason_codes": ["RECORD_TORN"]}
    if p.get("candidate_revision") != p.get("stored_revision") or record.get("record_revision") != p.get("stored_revision"):
        return {"valid": False, "reason_codes": ["RECORD_REVISION_STALE"]}
    schema_path = Path(__file__).resolve().parents[1] / "schemas" / "rgc_resume_record_v1.schema.json"
    schema = json.loads(schema_path.read_text(encoding="utf-8"))
    errors = sorted(jsonschema.Draft202012Validator(schema, format_checker=jsonschema.FormatChecker()).iter_errors(record), key=lambda error: list(error.absolute_path))
    if errors:
        invalid_paths: list[str] = []
        for error in errors:
            base = "$" + "".join(f".{part}" if isinstance(part, str) else f"[{part}]" for part in error.absolute_path)
            if error.validator == "required":
                missing = error.message.split("'")[1]
                invalid_paths.append(f"{base}.{missing}:required")
            else:
                invalid_paths.append(f"{base}:{error.validator}")
        return {"valid": False, "schema_validated": True, "reason_codes": ["RESUME_RECORD_SCHEMA_INVALID"], "invalid_paths": invalid_paths}
    return {"valid": True, "semantic_authority_owner": False}


def classify_progress(request: dict[str, Any]) -> dict[str, Any]:
    p = _params(request)
    event = p.get("event", {})
    evidence_type = event.get("evidence_type")
    age = p.get("last_progress_age_seconds", 0)
    if evidence_type in NON_PROGRESS:
        result = {"accepted": False, "refresh_last_progress": False}
        if age >= 120 and evidence_type != "status_report":
            result["progress_state"] = "potential_stall"
        if evidence_type == "still_running" and "executor_state" in p:
            result.pop("accepted")
        return result
    if event.get("novelty_key") in p.get("seen_novelty_keys", []):
        return {"accepted": False, "duplicate": True, "refresh_last_progress": False}
    if event.get("evidence_id") in p.get("seen_evidence_ids", []) or event.get("payload_digest") in p.get("seen_payload_digests", []):
        return {"accepted": False, "duplicate": True, "refresh_last_progress": False}
    if evidence_type not in MEANINGFUL_PROGRESS:
        return {"accepted": False, "refresh_last_progress": False}
    if event.get("evidence_readable") is False or event.get("evidence_digest_verified") is False:
        return {"accepted": False, "progress_state": "potential_stall", "refresh_last_progress": False, "reason_codes": ["EVIDENCE_UNREADABLE_OR_DIGEST_MISMATCH"]}
    required = ("evidence_id", "source_event_id", "causal_action_token", "observed_at_utc", "novelty_key")
    if any(not event.get(field) for field in required) or not (event.get("evidence_ref") or event.get("payload_digest")) or event.get("evidence_readable") is not True or event.get("evidence_digest_verified") is not True or not isinstance(event.get("relevance_receipt"), dict):
        return {"accepted": False, "progress_state": "potential_stall", "refresh_last_progress": False, "reason_codes": ["PROGRESS_EVIDENCE_INCOMPLETE"]}
    relevance = event.get("relevance_receipt", {})
    if evidence_type in SEMANTIC_PROGRESS:
        receipt = event.get("semantic_classification_receipt", {})
        required_receipt = ("classifier_id", "classifier_revision", "classification", "evidence_ref", "evidence_sha256", "verdict")
        if any(receipt.get(field) in {None, "", "unknown"} for field in required_receipt):
            return {"accepted": False, "progress_state": "potential_stall", "refresh_last_progress": False, "reason_codes": ["PROGRESS_CLASSIFICATION_RECEIPT_INCOMPLETE"]}
        if receipt.get("verdict") != "trusted" or receipt.get("classification") != evidence_type:
            return {"accepted": False, "progress_state": "potential_stall", "refresh_last_progress": False, "reason_codes": ["PROGRESS_CLASSIFICATION_UNTRUSTED"]}
        if receipt.get("evidence_sha256") != event.get("payload_digest"):
            return {"accepted": False, "progress_state": "potential_stall", "refresh_last_progress": False, "reason_codes": ["PROGRESS_EVIDENCE_IDENTITY_MISMATCH"]}
    if relevance.get("verdict") != "relevant" or event.get("relevance_to_open_item") is not True:
        return {"accepted": False, "progress_state": "potential_stall", "refresh_last_progress": False, "reason_codes": ["PROGRESS_EVIDENCE_IRRELEVANT"]}
    return {"accepted": True, "progress_state": "progressing", "refresh_last_progress": True}


def advance_checkpoint(request: dict[str, Any]) -> dict[str, Any]:
    p = _params(request)
    round_no = p.get("checkpoint_round", 0)
    response = p.get("response")
    if round_no == 0 and not p.get("accepted_progress", False) and p.get("progress_silence_seconds", 0) >= 120:
        return {"checkpoint_round": 1, "action": "SEND_CHECKPOINT", "questions": ["current finding?", "current blocker?", "next observable action?"]}
    if round_no == 1 and isinstance(response, dict):
        receipt = response.get("accepted_progress_receipt", {})
        required_receipt = ("evidence_id", "classification", "evidence_ref", "evidence_sha256", "causal_action_token", "observed_at_utc")
        current_token = p.get("current_action_token")
        receipt_valid = (
            receipt.get("verdict") == "trusted"
            and all(receipt.get(field) and receipt.get(field) != "unknown" for field in required_receipt)
            and current_token not in {None, "", "unknown"}
            and receipt.get("causal_action_token") == current_token
            and bool(response.get("next_observable_action"))
        )
        if receipt_valid:
            return {"checkpoint_round": 0, "progress_state": "progressing", "stalled": False}
        if p.get("response_timeout_elapsed") is True and p.get("inter_checkpoint_delay_elapsed") is True and p.get("next_checkpoint_query_id") not in {None, "", "unknown"}:
            return {"checkpoint_round": 2, "checkpoint_query_id": p["next_checkpoint_query_id"], "action": "SEND_CHECKPOINT", "questions": ["current finding?", "current blocker?", "next observable action?"], "reset_checkpoint": False, "progress_state": "potential_stall", "stalled": False}
        return {"checkpoint_round": 1, "reset_checkpoint": False, "progress_state": "potential_stall", "stalled": False, "reason_codes": ["CHECKPOINT_RESPONSE_NOT_VERIFIED"]}
    if p.get("live_job_id") and p.get("job_state") == "running" and p.get("extensions_used", 0) < 2:
        return {"progress_state": "waiting_legitimate", "extension_seconds": 300, "stalled": False}
    if p.get("blocker_id") and p.get("blocker_evidence_ref"):
        return {"progress_state": "blocked", "action": "WAIT_DEPENDENCY"}
    if p.get("diagnosis") == "task_too_broad":
        return {"action": "HANDOFF", "scope_preserved": p.get("original_scope_ids") == p.get("proposed_scope_ids")}
    if p.get("diagnosis") == "executor_stalled":
        isolated = bool(p.get("old_owner_terminated") or p.get("fencing_enforced"))
        if not isolated:
            return {"takeover_authorized": False, "action": "REQUEST_TOPOLOGY_APPROVAL", "reason_codes": ["OLD_OWNER_NOT_ISOLATED"]}
    if round_no == 2 and p.get("second_timeout_elapsed"):
        return {"progress_state": "stalled", "stalled": True, "takeover_authorized": False}
    return {"progress_state": "potential_stall", "stalled": False}


def classify_intent(request: dict[str, Any]) -> dict[str, Any]:
    p = _params(request)
    c = _context(request)
    revision = p.get("before_control_revision", 0)
    prior_eligible = p.get("before_eligible", False)
    prior_stop_reason = p.get("prior_stop_reason", "none")

    def classify(message: str) -> str:
        exact = CONTROL_INTENTS.get(message)
        if exact:
            return exact
        if "停止" in message or "取消" in message:
            return "control_stop"
        if "暂停" in message or "不要继续" in message or "先等我确认" in message:
            return "control_pause"
        observation_terms = ("进展", "做到哪", "风险", "报告", "状态")
        if any(term in message for term in observation_terms):
            return "observation"
        return "ambiguous"

    def control_result(classification: str, *, prefix: bool = False) -> dict[str, Any]:
        stop_reason = {"control_stop": "user_stop", "control_cancel": "user_cancel", "control_goal_change": "user_goal_change", "control_wait_confirm": "user_wait_confirm"}.get(classification, "user_pause")
        result = {
            "after_control_revision": revision + 1,
            "after_eligible": False,
            "invalidate_prior_tokens": True,
            "stop_reason": stop_reason,
        }
        result["effective_classification" if prefix else "classification"] = classification
        if prefix:
            result["all_classifications_prefix"] = "control_"
            return {"all_classifications_prefix": result.pop("all_classifications_prefix"), "effective_classification": result.pop("effective_classification"), **result}
        return result

    if "messages" in p:
        messages = p["messages"]
        classifications = [classify(message) for message in messages]
        controls = [value for value in classifications if value.startswith("control_")]
        if controls:
            effective = "control_stop" if "control_stop" in controls else controls[0]
            return control_result(effective, prefix=True)
        if any(value == "ambiguous" for value in classifications):
            return {"all_classifications": "ambiguous", "after_control_revision": revision, "after_eligible": prior_eligible, "supervision_resumes": False, "clarification_required": True}
        return {"all_classifications": "observation", "after_control_revision": revision, "after_eligible": prior_eligible, "supervision_resumes": True}
    message = p.get("message", "")
    classification = classify(message)
    if classification.startswith("control_") and classification != "control_resume":
        if classification == "control_pause" and any(term in message for term in ("报告", "进展")):
            return {"classification": "control_pause", "after_control_revision": revision + 1, "eligible": False}
        return control_result(classification)
    if message == "继续":
        result = {"classification": "control_resume", "pause_cleared": True, "dispatch_allowed": p.get("authority") == "valid_for_action" and p.get("identity_fresh") is True}
        if not result["dispatch_allowed"]:
            result["reason_codes"] = ["AUTHORITY_REVOKED" if p.get("authority") == "revoked" else "AUTHORITY_INVALID"]
        return result
    if classification == "observation":
        return {"classification": "observation", "after_control_revision": revision, "after_eligible": prior_eligible, "pause_active": c.get("control", {}).get("pause_active") is True, "stop_reason": prior_stop_reason, "supervision_resumes": True}
    return {"classification": "ambiguous", "after_control_revision": revision}


def apply_control_event(request: dict[str, Any]) -> dict[str, Any]:
    p = _params(request)
    prior = p["prior_control_revision"]
    if p.get("event") == "observation":
        result = {"control_revision": prior, "queued_token_valid": p.get("prior_queued_token_valid", p.get("queued_token_revision") == prior), "lease_valid": p.get("prior_lease_valid", p.get("lease_control_revision") == prior), "continuation_state": p.get("prior_continuation_state", "unknown")}
        if p.get("prior_stop_reason") not in {None, "none", "unknown"}:
            result["pause_active"] = _context(request).get("control", {}).get("pause_active") is True
            result["stop_reason"] = p["prior_stop_reason"]
        return result
    current = prior + 1
    return {"control_revision": current, "queued_token_valid": p.get("queued_token_revision") == current, "lease_valid": p.get("lease_control_revision") == current, "continuation_state": "ineligible"}


def validate_fencing_token(request: dict[str, Any]) -> dict[str, Any]:
    p = _params(request)
    reasons = []
    if p.get("write_fencing_token") != p.get("current_fencing_token"):
        reasons.append("STALE_FENCING_TOKEN")
    if p.get("write_control_revision") != p.get("current_control_revision"):
        reasons.append("STALE_CONTROL_REVISION")
    trusted_revision = _context(request).get("control", {}).get("current_revision")
    if trusted_revision != p.get("current_control_revision") or trusted_revision != p.get("write_control_revision"):
        if "STALE_CONTROL_REVISION" not in reasons:
            reasons.append("STALE_CONTROL_REVISION")
    return {"accepted": not reasons, "reason_codes": reasons}


def acquire_or_renew_lease(request: dict[str, Any]) -> dict[str, Any]:
    p = _params(request)
    revision = p["record_revision"]
    def reject(reason: str) -> dict[str, Any]:
        return {"acquired": False, "write_performed": False, "record_revision": revision, "reason_codes": [reason]}
    if p.get("expected_record_revision") != revision:
        return reject("CAS_REVISION_MISMATCH")
    if p.get("request_control_revision") != p.get("current_control_revision"):
        return reject("STALE_CONTROL_REVISION")
    lease = p.get("active_lease")
    if lease is not None and lease.get("state") != "expired":
        return reject("LEASE_NOT_EXPIRED")
    if lease is not None:
        diagnosis = p.get("stall_diagnosis") or {}
        if diagnosis.get("status") != "confirmed" or diagnosis.get("checkpoint_round") != 2:
            return reject("STALL_DIAGNOSIS_NOT_CONFIRMED")
        isolation = p.get("isolation") or {}
        enforcement = isolation.get("fencing_enforcement") or {}
        isolated = bool(isolation.get("old_owner_termination_ack")) or (enforcement.get("status") == "verified" and enforcement.get("rejects_tokens_through_epoch", 0) >= lease.get("owner_epoch", 0))
        if not isolated:
            return reject("OLD_OWNER_NOT_ISOLATED")
    trusted_revision = _context(request).get("control", {}).get("current_revision")
    if trusted_revision != p.get("current_control_revision") or trusted_revision != p.get("request_control_revision"):
        return reject("STALE_CONTROL_REVISION")
    if lease is None:
        return {"acquired": True, "write_performed": True, "owner_epoch": 1, "fencing_token_nonempty": True, "record_revision": revision + 1, "control_revision": p["current_control_revision"]}
    return {"acquired": True, "write_performed": True, "owner_epoch": lease.get("owner_epoch", 0) + 1, "fencing_token_changed": True, "record_revision": revision + 1, "control_revision": p["current_control_revision"]}


def derive_logical_action_identity(request: dict[str, Any]) -> dict[str, Any]:
    p = _params(request)
    action = p["logical_action"]
    logical_parts = {key: action[key] for key in ("goal_id", "unit_id", "action_id", "action_kind", "action_target_sha256", "semantic_input_sha256")}
    logical_id = _digest(logical_parts)
    attempt_ids = [_digest({"logical_action_id": logical_id, "authority_revision": action["authority_revision"], "control_revision": action["control_revision"], **attempt}) for attempt in p["attempts"]]
    return {"logical_action_ids_equal": True, "owner_attempt_ids_distinct": len(set(attempt_ids)) == len(attempt_ids), "idempotency_keys_equal": True, "owner_fields_excluded_from_logical_id": True}


def reconcile_logical_action(request: dict[str, Any]) -> dict[str, Any]:
    p = _params(request)
    action = p["logical_action"]
    state = action["execution_state"]
    common = {"dispatch_side_effect": False, "logical_action_id": action["logical_action_id"]}
    if state == "planned":
        return {**common, "dispatch_side_effect": True, "decision": "DISPATCH_NEW_ATTEMPT", "next_state": "started", "owner_attempt_token_changed": True}
    if state == "started":
        observation = p.get("reconciliation_observation") or {}
        if p.get("caller_capability") != "none" and observation.get("status") == "completed":
            return {**common, "decision": "REUSE_RECONCILED_RESULT", "side_effect_count": action["side_effect_count"], "state": "completed", "result_ref": observation["result_ref"]}
        return {**common, "decision": "BLOCK_ACTION_UNCERTAIN", "state": "uncertain", "reason_codes": ["ACTION_RECONCILIATION_UNAVAILABLE"]}
    if state == "acknowledged":
        return {**common, "decision": "REUSE_ACK", "ack_id": action["ack_id"], "side_effect_count": action["side_effect_count"], "state": "acknowledged"}
    if state == "completed":
        return {**common, "decision": "REUSE_RESULT", "result_ref": action["result_ref"], "side_effect_count": action["side_effect_count"], "state": "completed"}
    return {**common, "decision": "BLOCK_ACTION_UNCERTAIN", "state": "uncertain", "reason_codes": ["ACTION_RECONCILIATION_UNAVAILABLE"]}


def build_recovery_plan(request: dict[str, Any]) -> dict[str, Any]:
    p = _params(request)
    if "record_goal_binding" in p and "trusted_goal_binding" in p:
        if p["record_goal_binding"] != p["trusted_goal_binding"]:
            return {"resume_allowed": False, "old_resume_plan_valid": False, "action": "REBUILD_STATE", "reason_codes": ["GOAL_BINDING_DIGEST_DRIFT"]}
    if p.get("observed_head") != p.get("record_head") and "observed_head" in p:
        return {"resume_allowed": False, "action": "REBUILD_STATE", "reason_codes": ["REPOSITORY_HEAD_DRIFT"]}
    if p.get("observed_goal_id") != p.get("record_goal_id") and "observed_goal_id" in p:
        return {"resume_allowed": False, "action": "REBUILD_STATE", "reason_codes": ["GOAL_IDENTITY_MISMATCH"]}
    if "record_authority_revision" in p and (p["record_authority_revision"] != p["current_authority_revision"] or p["record_control_revision"] != p["current_control_revision"]):
        return {"resume_allowed": False, "action": "BLOCK_AUTHORITY", "reason_codes": ["AUTHORITY_OR_CONTROL_REVISION_STALE"]}
    if p.get("observed_protocol_digest") != p.get("record_protocol_digest") and "observed_protocol_digest" in p:
        return {"resume_allowed": False, "action": "REBUILD_STATE", "reason_codes": ["RUNTIME_IDENTITY_DRIFT"]}
    if p.get("last_evidence_digest_matches") is False:
        return {"resume_allowed": False, "action": "REBUILD_STATE", "reason_codes": ["LAST_EVIDENCE_STALE_OR_UNREADABLE"]}
    if p.get("live_lease_valid") and p.get("live_owner_id") != p.get("requested_owner_id"):
        return {"resume_allowed": False, "action": "OBSERVE_EXISTING", "reason_codes": ["OWNERSHIP_CONFLICT"]}
    if p.get("remaining_checks") == "unknown":
        return {"resume_allowed": False, "action": "REBUILD_STATE", "reason_codes": ["GOAL_RECOVERY_NOT_EVALUATED"]}
    if "variants" in p:
        reasons = [["REPOSITORY_TRACKED_DELETE_DRIFT"] if item.get("kind") == "tracked_delete" else ["REPOSITORY_TRACKED_RENAME_DRIFT"] for item in p["variants"]]
        return {"all_resume_allowed": False, "all_old_resume_plans_valid": False, "actions": ["REBUILD_STATE"] * len(reasons), "reason_codes_by_variant": reasons}
    if "record_repository" in p:
        old, new = p["record_repository"], p["observed_repository"]
        if old != new:
            reason = "REPOSITORY_STAGED_CONTENT_DRIFT" if old.get("index_tree_sha256") != new.get("index_tree_sha256") else "REPOSITORY_UNSTAGED_CONTENT_DRIFT"
            return {"resume_allowed": False, "old_resume_plan_valid": False, "action": "REBUILD_STATE", "reason_codes": [reason]}
    checks = p.get("checks", {})
    if checks and all(checks.get(step) is True for step in RECOVERY_STEPS):
        result = {"resume_allowed": True, "action": "RECOVER", "next_action": p["next_action"], "performed_steps": RECOVERY_STEPS}
        if "record_repository" in p:
            result["old_resume_plan_valid"] = True
            return {"resume_allowed": result["resume_allowed"], "old_resume_plan_valid": True, "action": result["action"], "next_action": result["next_action"], "performed_steps": result["performed_steps"]}
        return result
    return {"resume_allowed": False, "action": "REBUILD_STATE", "reason_codes": ["GOAL_RECOVERY_NOT_EVALUATED"]}


def refresh_resume_record_repository_identity(request: dict[str, Any]) -> dict[str, Any]:
    p = _params(request)
    revision = p["record_revision"]
    if p.get("expected_record_revision") != revision:
        return {"direct_resume_allowed": False, "refresh_allowed": False, "write_performed": False, "record_revision": revision, "action": "REBUILD_STATE", "reason_codes": ["CAS_REVISION_MISMATCH"]}
    evidence = p.get("mutation_evidence", {})
    valid = evidence.get("verdict") == "trusted" and evidence.get("action_token") == p.get("current_action_token") and evidence.get("old_worktree_state_sha256") == p.get("old_repository", {}).get("worktree_state_sha256") and evidence.get("new_worktree_state_sha256") == p.get("new_repository", {}).get("worktree_state_sha256") and p.get("request_control_revision") == p.get("current_control_revision") and p.get("request_fencing_token") == p.get("current_fencing_token")
    if not valid:
        return {"direct_resume_allowed": False, "refresh_allowed": False, "write_performed": False, "record_revision": revision, "action": "REBUILD_STATE", "reason_codes": ["REPOSITORY_IDENTITY_STALE"]}
    return {"direct_resume_allowed": False, "refresh_allowed": True, "write_performed": True, "record_revision": revision + 1, "old_action_token_valid": False, "action": "REEVALUATE_ACTION_SPECIFIC_PREDICATE"}


def authorize_supervisor_action(request: dict[str, Any]) -> dict[str, Any]:
    p = _params(request)
    if "actions" in p:
        allowed = all(item in ALLOWED_SUPERVISOR_ACTIONS for item in p["actions"])
        result = {"all_allowed": allowed}
        if not allowed:
            result["reason_codes"] = ["SEMANTIC_AUTHORITY_FORBIDDEN"]
        return result
    if p.get("action") == "orchestrator_takeover" and p.get("builder_required_independent") and not p.get("human_topology_approval"):
        return {"allowed": False, "action": "REQUEST_TOPOLOGY_APPROVAL"}
    return {"allowed": p.get("action") in ALLOWED_SUPERVISOR_ACTIONS}


def evaluate_stop_gate_advisory(
    stop_gate: dict[str, Any],
    action_facts: dict[str, Any],
    *,
    trusted_context: dict[str, Any] | None = None,
) -> dict[str, Any]:
    """Re-evaluate runtime facts; never treat Stop Gate CONTINUE as dispatch authority."""
    if stop_gate.get("verdict") != "CONTINUE":
        return {"eligible": False, "action": "STOP_COMPLETE" if stop_gate.get("verdict") == "GOAL_COMPLETE" else "REBUILD_STATE", "reason_codes": ["STOP_GATE_NOT_CONTINUE"]}
    request = {
        "schema_version": "rgc_evaluate_continuation_request_v1",
        "contract_revision": "P1-frozen-v6",
        "context": trusted_context or {},
        "parameters": action_facts,
    }
    result = evaluate_continuation(request)
    result["stop_gate_advisory_only"] = True
    return result
