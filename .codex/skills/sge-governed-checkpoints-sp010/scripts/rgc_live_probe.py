#!/usr/bin/env python3
"""Bounded P3 live probe. It only creates and operates its own ephemeral thread."""
from __future__ import annotations

import argparse
import hashlib
import importlib.util
import json
import subprocess
import sys
import tempfile
import time
import uuid
from datetime import datetime, timezone
from pathlib import Path
from typing import Any

_LOADED_SOURCE_PATH=Path(__file__).absolute()
_LOADED_SOURCE_SHA256=hashlib.sha256(_LOADED_SOURCE_PATH.read_bytes()).hexdigest()
def loaded_source_identity(): return {'path':str(_LOADED_SOURCE_PATH),'sha256':_LOADED_SOURCE_SHA256}

SCRIPT_DIR = Path(__file__).resolve().parent
REPO = SCRIPT_DIR.parents[3]
sys.path.insert(0, str(SCRIPT_DIR))

from rgc_app_server_adapter import AdapterError, AppServerAdapter, RuntimeProfile  # noqa: E402
from rgc_resume_store import ResumeStore, StoreConflict  # noqa: E402
from rgc_supervisor import Supervisor  # noqa: E402

EXPECTED = {
    "binary_sha256": "a30ec314bbd0e3721632234d07db7c99855db3b9f1e32dbe8c791947f07e7629",
    "protocol_bundle_sha256": "d3eace08be5dca386bfd1f1e8df650058b4113f1e10870a284d775d75517576a",
    "client_request_sha256": "25bc001b5dfe3b35785597b8f9ad9e5aaf7e437331fa9921f041c9e0e03fc9f3",
    "server_notification_sha256": "b3e76cf11842f3e8b3270c05e000212b56eabafb0152fc38e8f920e2ef902991",
}
OUTPUT_DIR = REPO / "Dashboard/Artifacts/Stage-Plan-SP-010"
ATTEMPTS_DIR = OUTPUT_DIR / "P3_LiveProbeAttempts"
FIXED_PROMPT = "Reply with exactly: P3_EPHEMERAL_OK"


def digest(path: Path) -> str:
    return hashlib.sha256(path.read_bytes()).hexdigest()


def utc_now() -> str:
    return datetime.now(timezone.utc).isoformat().replace("+00:00", "Z")


def result(verdict: str, **details: Any) -> dict[str, Any]:
    return {"verdict": verdict, **details}


def load_module(path: Path, name: str):
    spec = importlib.util.spec_from_file_location(name, path)
    assert spec and spec.loader
    module = importlib.util.module_from_spec(spec)
    sys.modules[name] = module
    spec.loader.exec_module(module)
    return module


def make_record(path: Path) -> dict[str, Any]:
    runner = load_module(OUTPUT_DIR / "P1_ERBE_RedRunner.py", "p3_live_runner")
    cases = json.loads((OUTPUT_DIR / "P1_ERBE_Cases.json").read_text(encoding="utf-8"))
    case = next(item for item in cases["cases"] if item["case_id"] == "RGC-C012")
    record = runner.materialize_invocation(cases, case)["request"]["parameters"]["record"]
    ResumeStore(path).create(record)
    return record


def _file_identity(path: Path) -> dict[str, Any]:
    if not path.is_file():
        return {"exists": False, "sha256": None, "byte_length": 0, "line_count": 0}
    raw = path.read_bytes()
    return {
        "exists": True, "sha256": hashlib.sha256(raw).hexdigest(), "byte_length": len(raw),
        "line_count": len(raw.splitlines()),
    }


def migrate_legacy_evidence(
    *,
    results_path: Path,
    attempts_dir: Path,
    raw_path: Path,
    normalized_path: Path,
    trace_path: Path,
    repo: Path = REPO,
) -> dict[str, Any]:
    """Truthfully migrate legacy duplicate rows without inventing source bytes."""
    payload = json.loads(results_path.read_text(encoding="utf-8"))
    if payload.get("legacy_migration", {}).get("status") == "complete" and payload.get("legacy_migration", {}).get("migration_version") == 2:
        return payload
    if payload.get("legacy_migration", {}).get("migration_version") is None and payload.get("legacy_migration", {}).get("status") == "complete":
        legacy_rows = [row for ref in payload.get("attempt_history", []) for row in json.loads((repo / ref["path"]).read_text(encoding="utf-8")).get("original_rows", [])]
    else:
        legacy_rows = payload.get("attempt_history", [])
    groups: dict[tuple[Any, Any, Any], list[tuple[int, dict[str, Any]]]] = {}
    for index, row in enumerate(legacy_rows, 1):
        key = (
            row.get("observed_at_utc"),
            row.get("raw_journal", {}).get("sha256"),
            row.get("normalized_journal", {}).get("sha256"),
        )
        groups.setdefault(key, []).append((index, row))
    attempts_dir.mkdir(parents=True, exist_ok=True)
    current_raw = _file_identity(raw_path)
    current_normalized = _file_identity(normalized_path)
    refs: list[dict[str, Any]] = []
    duplicate_groups: list[list[int]] = []
    for group_number, (key, rows) in enumerate(groups.items(), 1):
        legacy_indices = [index for index, _ in rows]
        if len(rows) > 1:
            duplicate_groups.append(legacy_indices)
        stable_key = hashlib.sha256(json.dumps(key, sort_keys=True).encode()).hexdigest()[:12]
        attempt_id = f"legacy-v2-evidence-group-{group_number:03d}-{stable_key}"
        attempt_dir = attempts_dir / attempt_id
        attempt_dir.mkdir(exist_ok=False)
        representative = rows[0][1]
        raw_available = key[1] is not None and key[1] == current_raw["sha256"]
        is_current = representative.get("observed_at_utc") == payload.get("observed_at_utc") and raw_available
        normalized_available = is_current and key[2] is not None and key[2] == current_normalized["sha256"]
        artifacts: dict[str, Any] = {}
        if is_current:
            target = attempt_dir / "raw.jsonl"
            target.write_bytes(raw_path.read_bytes())
            artifacts["raw_journal"] = _file_identity(target) | {"path": str(target.relative_to(repo))}
        if normalized_available:
            target = attempt_dir / "normalized.jsonl"
            target.write_bytes(normalized_path.read_bytes())
            artifacts["normalized_journal"] = _file_identity(target) | {"path": str(target.relative_to(repo))}
        if is_current and trace_path.is_file():
            target = attempt_dir / "trace.json"
            target.write_bytes(trace_path.read_bytes())
            artifacts["trace"] = _file_identity(target) | {"path": str(target.relative_to(repo))}
        provenance = {
            "schema_version": "sp010_p3_legacy_attempt_provenance_v1",
            "attempt_id": attempt_id,
            "provenance_status": "legacy_source_bytes_partial" if artifacts else "legacy_source_bytes_unavailable",
            "legacy_row_indices": legacy_indices,
            "duplicate_rows_same_evidence": len(rows) > 1,
            "original_observed_at_utc": key[0],
            "original_raw_identity": representative.get("raw_journal"),
            "original_normalized_identity": representative.get("normalized_journal"),
            "source_bytes_available": sorted(artifacts),
            "artifacts": artifacts,
            "original_rows": [row for _, row in rows],
        }
        manifest_path = attempt_dir / "attempt.json"
        manifest_path.write_text(json.dumps(provenance, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
        refs.append({
            "attempt_id": attempt_id, "path": str(manifest_path.relative_to(repo)),
            "sha256": digest(manifest_path), "byte_length": manifest_path.stat().st_size,
            "provenance_status": provenance["provenance_status"],
        })
    probes = payload.get("probes", {})
    if "P3-LIVE-08" in probes:
        probes["P3-LIVE-08"].update({
            "verdict": "partial", "real_wait_elided": True,
            "evidence_layer": "test_bound_state_transition",
            "timer_source": "injected_monotonic_boundary_facts_without_wall_clock_wait",
            "observed_elapsed_seconds": "not_recorded_legacy",
            "frozen_wall_clock_budget_seconds": 330,
        })
    classifier = Probe(Path("/Applications/ChatGPT.app/Contents/Resources/codex"))
    classifier.probes = probes
    payload["p3_exit_conditions"] = classifier.exit_conditions()
    payload["overall"] = "partial"
    payload["attempt_history"] = refs
    payload["legacy_migration"] = {
        "status": "complete", "migration_version": 2, "legacy_row_count": len(legacy_rows),
        "unique_evidence_group_count": len(groups), "duplicate_row_groups": duplicate_groups,
        "claim": "Rows sharing observed time and journal identities are retained as duplicate provenance, not independent attempts.",
    }
    results_path.write_text(json.dumps(payload, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    return payload


class Probe:
    def __init__(self, binary: Path):
        self.binary = binary.resolve()
        self.schema_root = Path(tempfile.mkdtemp(prefix="sp010-p3-schema-"))
        self.results_path = OUTPUT_DIR / "P3_LiveProbeResults.json"
        self.attempt_id = datetime.now(timezone.utc).strftime("%Y%m%dT%H%M%S.%fZ") + "-" + uuid.uuid4().hex[:12]
        self.attempt_dir = ATTEMPTS_DIR / self.attempt_id
        self.raw_path = self.attempt_dir / "raw.jsonl"
        self.normalized_path = self.attempt_dir / "normalized.jsonl"
        self.e2e_path = self.attempt_dir / "trace.json"
        self.probes: dict[str, Any] = {}
        self.adapter: AppServerAdapter | None = None
        self.thread_id: str | None = None
        self.turn_id: str | None = None
        self.model_id = "gpt-6-astra"
        self.reconnect_evidence: dict[str, Any] = {}
        self.e2e: dict[str, Any] = {"schema_version": "sp010_p3_e2e_trace_v1", "events": [], "checkpoint_trace": []}

    def prepare_attempt(self) -> None:
        self.attempt_dir.mkdir(parents=True, exist_ok=False)
        self.raw_path.write_text("", encoding="utf-8")
        self.normalized_path.write_text("", encoding="utf-8")

    @staticmethod
    def _journal_identity(path: Path) -> dict[str, Any]:
        if not path.is_file():
            return {"exists": False, "line_count": 0, "sha256": None}
        raw = path.read_bytes()
        return {"exists": True, "line_count": len(raw.splitlines()), "sha256": hashlib.sha256(raw).hexdigest()}

    def identity(self) -> RuntimeProfile | None:
        try:
            completed = subprocess.run(
                [str(self.binary), "app-server", "generate-json-schema", "--out", str(self.schema_root)],
                cwd=REPO, text=True, capture_output=True, timeout=30, check=False,
            )
            files = {
                "binary_sha256": self.binary,
                "protocol_bundle_sha256": self.schema_root / "codex_app_server_protocol.v2.schemas.json",
                "client_request_sha256": self.schema_root / "ClientRequest.json",
                "server_notification_sha256": self.schema_root / "ServerNotification.json",
            }
            actual = {key: digest(path) if path.is_file() else None for key, path in files.items()}
            matches = {key: actual[key] == EXPECTED[key] for key in EXPECTED}
            verdict = "pass" if completed.returncode == 0 and all(matches.values()) else "blocked"
            self.probes["P3-LIVE-00"] = result(verdict, command_exit=completed.returncode, actual=actual, matches=matches, mutation_performed=False)
            if verdict != "pass":
                return None
            return RuntimeProfile(
                binary_path=str(self.binary), binary_sha256=EXPECTED["binary_sha256"],
                protocol_bundle_path=str(files["protocol_bundle_sha256"]),
                protocol_bundle_sha256=EXPECTED["protocol_bundle_sha256"], cwd=str(REPO),
            )
        except (OSError, subprocess.TimeoutExpired) as exc:
            self.probes["P3-LIVE-00"] = result("blocked", error_class="BINARY_NOT_FOUND", fingerprint=type(exc).__name__, mutation_performed=False)
            return None

    def new_adapter(self, profile: RuntimeProfile) -> AppServerAdapter:
        adapter = AppServerAdapter(raw_journal=self.raw_path, normalized_journal=self.normalized_path)
        self.adapter = adapter
        adapter.start(profile)
        return adapter

    @staticmethod
    def identity_from_response(value: dict[str, Any], kind: str) -> str | None:
        candidate = value.get(kind)
        if isinstance(candidate, dict) and isinstance(candidate.get("id"), str):
            return candidate["id"]
        for key in (f"{kind}Id", "id"):
            if isinstance(value.get(key), str):
                return value[key]
        return None

    def initialize_and_model(self, profile: RuntimeProfile) -> bool:
        try:
            self.adapter = self.new_adapter(profile)
            selected = self.adapter.require_model(self.model_id)
            self.probes["P3-LIVE-01"] = result("pass", model_id=self.model_id, model_inventory_match=True, adapter_session_id=self.adapter.session_id)
            return selected is not None
        except AdapterError as exc:
            self.probes["P3-LIVE-01"] = result(
                "blocked", error_class=exc.error_class, fingerprint=exc.detail,
                stderr_evidence=self.adapter.stderr_evidence if self.adapter else [],
            )
            return False

    def successful_turn(self) -> None:
        assert self.adapter is not None
        try:
            thread = self.adapter.start_thread({
                "model": self.model_id, "cwd": str(REPO), "approvalPolicy": "never",
                "sandbox": "read-only", "ephemeral": True,
            })
            self.thread_id = self.identity_from_response(thread, "thread")
            if not self.thread_id:
                raise AdapterError("PROTOCOL_SCHEMA_MISMATCH", "thread/start identity")
            with tempfile.TemporaryDirectory(prefix="sp010-p3-live-store-") as td:
                store_path = Path(td) / "resume.json"
                make_record(store_path)
                supervisor = Supervisor(
                    store_path=store_path, adapter=self.adapter, owner_id="builder-alpha",
                    authority_reader=lambda: {"revision": 7, "status": "valid_for_action"},
                    runtime_reader=lambda: {"identity_fresh": True},
                    repository_reader=lambda: {"identity_fresh": True},
                    admission_reader=lambda: {"action": "builder", "target": "SP-010/P3"},
                )
                params = {
                    "threadId": self.thread_id, "model": self.model_id,
                    "input": [{"type": "text", "text": FIXED_PROMPT}],
                    "cwd": str(REPO), "approvalPolicy": "never", "sandboxPolicy": {"type": "readOnly"},
                }
                dispatched = supervisor.dispatch_authorized_action(
                    method="turn/start", params=params, logical_action_id="p3-live-turn",
                    action_token="attempt-alpha", authority_revision=7, owner_attempt_token="p3-live-owner",
                )
                self.turn_id = self.identity_from_response(dispatched["response"], "turn")
                if not self.turn_id:
                    raise AdapterError("PROTOCOL_SCHEMA_MISMATCH", "turn/start identity")
                lifecycle: list[str] = []
                correlated_started = False
                terminal: dict[str, Any] | None = None
                deadline = time.monotonic() + 180
                while time.monotonic() < deadline:
                    event = self.adapter.next_event(deadline)
                    frame = event["frame"]
                    method = frame.get("method")
                    lifecycle.append(method)
                    if "id" in frame:
                        self.adapter.respond_server_request(frame, {"validated": True, "outcome": "deny"})
                    params = frame.get("params", {})
                    turn = params.get("turn", {})
                    correlated = params.get("threadId") == self.thread_id and turn.get("id") == self.turn_id
                    if method == "turn/started" and correlated:
                        correlated_started = True
                    if method == "turn/completed":
                        if correlated:
                            terminal = turn
                            break
                if terminal is None:
                    raise AdapterError("TURN_COMPLETION_TIMEOUT")
                status = terminal.get("status")
                self.probes["P3-LIVE-02"] = result(
                    "pass" if status == "completed" and correlated_started else "blocked",
                    terminal_status=status if status in {"completed", "failed", "interrupted", "inProgress"} else "unknown",
                    correlated_started_observed=correlated_started,
                    evidence_layer="live_host", thread_created_by_probe=True, explicit_model=self.model_id,
                    turn_id_present=bool(self.turn_id), lifecycle=lifecycle,
                    durable_started_before_grant=dispatched["durable_started_before_grant"],
                    readback_checks=dispatched["readback_checks"], sensitive_content_retained=False,
                )
                self._local_vertical(supervisor, store_path)
        except (AdapterError, StoreConflict, ValueError) as exc:
            error_class = exc.error_class if isinstance(exc, AdapterError) else type(exc).__name__
            self.probes["P3-LIVE-02"] = result("blocked", error_class=error_class, fingerprint=str(exc)[:240], thread_created_by_probe=bool(self.thread_id))

    def _local_vertical(self, supervisor: Supervisor, store_path: Path) -> None:
        try:
            supervisor.enqueue("observation", "status", {"message": "状态"})
            observation = supervisor.drain_batch()
            observed = {"goal_sha256": "a" * 64, "unfinished": True, "last_evidence_verified": True, "owner_conflict": False, "predicate_recomputed": True}
            recovery = supervisor.restart_reentry("app_server_child_or_client_transport", next_action="resume", observed=observed)
            supervisor.enqueue("control", "pause", {"message": "暂停"})
            pause = supervisor.drain_batch()
            record = ResumeStore(store_path).read()
            late_writer = "not_attempted"
            try:
                ResumeStore(store_path).compare_and_swap(8, lambda value: value, fencing_token="fence-alpha", control_revision=11)
            except StoreConflict as exc:
                late_writer = str(exc)
            self.e2e["events"].extend([{"observation": observation}, {"recovery": recovery}, {"pause": pause}, {"late_writer": late_writer}])
            self.probes["P3-LIVE-07"] = result(
                "partial", evidence_layer="test_bound_local_recovery_with_live_dispatch",
                recovery_observations_injected=True, live_host_dispatch=True,
                actual_child_restart_observed=False,
                observation_preserved_control=True, recovery_steps=recovery.get("performed_steps", []),
                restart_actor=recovery.get("restart_actor"), paused=record["continuation"]["eligible"] is False,
                late_writer_rejected=late_writer != "not_attempted", goal_complete_emitted=False,
            )
        except Exception as exc:  # evidence must preserve exact bounded dependency result
            self.probes["P3-LIVE-07"] = result("blocked", error_class=type(exc).__name__, fingerprint=str(exc)[:240])

    def resume(self, profile: RuntimeProfile) -> None:
        if not self.thread_id:
            self.probes["P3-LIVE-03"] = result("blocked", error_class="THREAD_NOT_FOUND", dependency="P3-LIVE-02")
            return
        previous_session = self.adapter.session_id if self.adapter else None
        # This additional observation cannot satisfy the frozen cross-restart
        # P3-LIVE-03 requirement. Both layers retain their exact failure facts.
        same_child_calls = self._resume_operations() if self.adapter else {}
        same_child = result(
            "pass" if len(same_child_calls) == 2 and all(value["verdict"] == "pass" for value in same_child_calls.values()) else "blocked",
            operations=same_child_calls, adapter_session_id=previous_session,
            child_restarted=False, meaningful_progress_claimed=False,
        )
        if self.adapter:
            self.reconnect_evidence["close"] = self.adapter.close("resume_reconnect")
        calls: dict[str, Any] = {}
        try:
            self.adapter = self.new_adapter(profile)
            self.reconnect_evidence.update({"previous_session": previous_session, "new_session": self.adapter.session_id, "initialize_acknowledged": True})
            calls = self._resume_operations()
            matched = all(value["verdict"] == "pass" for value in calls.values())
            failure = next((value for value in calls.values() if value["verdict"] != "pass"), {})
            self.probes["P3-LIVE-03"] = result(
                "pass" if matched else "blocked", evidence_layer="live_host",
                identity_matches=matched, operations=calls, ephemeral=True,
                child_restarted=True, error_class=failure.get("error_class"),
                same_child_observation=same_child,
                acceptance_scope="cross_restart_same_ephemeral_thread",
                history_gap="unresolved", meaningful_progress_claimed=False, mock_pass=False,
            )
        except AdapterError as exc:
            self.probes["P3-LIVE-03"] = result("blocked", error_class=exc.error_class, fingerprint=exc.detail, operations=calls, same_child_observation=same_child, acceptance_scope="cross_restart_same_ephemeral_thread", mock_pass=False)
        self.reconnect_evidence["operations"] = calls

    def _resume_operations(self) -> dict[str, Any]:
        assert self.adapter is not None and self.thread_id is not None
        calls: dict[str, Any] = {}
        # A read failure must not hide the independently requested resume result.
        for method, operation in (
            ("thread/read", lambda: self.adapter.read_thread(self.thread_id)),
            ("thread/resume", lambda: self.adapter.resume_thread({"threadId": self.thread_id, "model": self.model_id, "cwd": str(REPO), "approvalPolicy": "never", "sandbox": "read-only"})),
        ):
            try:
                value = operation()
                matched = self.identity_from_response(value, "thread") == self.thread_id
                calls[method] = result("pass" if matched else "blocked", identity_matches=matched, response_acknowledged=True)
            except AdapterError as exc:
                calls[method] = result("blocked", error_class=exc.error_class, fingerprint=exc.detail, response_acknowledged=False)
        return calls

    def _dispatch(self, method: str, params: dict[str, Any], action: str) -> dict[str, Any]:
        # Each real action has its own durable claim and read-back. No request
        # is replayed after an uncertain dispatch or reconnect.
        with tempfile.TemporaryDirectory(prefix="sp010-p3-control-store-") as td:
            path = Path(td) / "resume.json"
            make_record(path)
            supervisor = Supervisor(
                store_path=path, adapter=self.adapter, owner_id="builder-alpha",
                authority_reader=lambda: {"revision": 7, "status": "valid_for_action"},
                runtime_reader=lambda: {"identity_fresh": True}, repository_reader=lambda: {"identity_fresh": True},
                admission_reader=lambda: {"action": "builder", "target": "SP-010/P3"},
            )
            value = supervisor.dispatch_authorized_action(
                method=method, params=params, logical_action_id=f"p3-live-{action}",
                action_token="attempt-alpha", authority_revision=7, owner_attempt_token=f"p3-live-{action}-owner",
            )
            self.e2e["events"].append({"action": action, "method": method, "durable_readback_checks": value["readback_checks"], "ack_state": value["ack_state"]})
            return value

    def _turn_event(self, turn_id: str, wanted: str, deadline: float, lifecycle: list[str]) -> dict[str, Any]:
        assert self.adapter is not None
        while True:
            value = self.adapter.next_event(deadline)
            frame = value["frame"]
            method = frame.get("method")
            lifecycle.append(method)
            if "id" in frame:
                self.adapter.respond_server_request(frame, {"validated": True, "outcome": "deny"})
            params = frame.get("params", {})
            turn = params.get("turn", {})
            if params.get("threadId") != self.thread_id or turn.get("id") != turn_id:
                continue
            if method == wanted:
                return turn
            if method == "turn/completed":
                raise AdapterError("ACTIVE_TURN_NOT_STEERABLE", "fresh turn completed before control dispatch")

    def _active_turn_control(self, method: str, probe_id: str) -> None:
        lifecycle: list[str] = []
        facts: dict[str, Any] = {"ephemeral": True, "same_probe_thread": True, "mock_pass": False, "evidence_layer": "live_host", "control_dispatched": False}
        try:
            started = self._dispatch("turn/start", {
                "threadId": self.thread_id, "model": self.model_id,
                "input": [{"type": "text", "text": FIXED_PROMPT}], "cwd": str(REPO),
                "approvalPolicy": "never", "sandboxPolicy": {"type": "readOnly"},
            }, f"{probe_id}-start")
            turn_id = self.identity_from_response(started["response"], "turn")
            if not turn_id:
                raise AdapterError("PROTOCOL_SCHEMA_MISMATCH", "fresh turn identity missing")
            facts["turn_id"] = turn_id
            self._turn_event(turn_id, "turn/started", time.monotonic() + 180, lifecycle)
            facts["fresh_active_turn_started"] = True
            params = {"threadId": self.thread_id}
            if method == "turn/steer":
                params.update({"expectedTurnId": turn_id, "input": [{"type": "text", "text": FIXED_PROMPT}]})
            else:
                params["turnId"] = turn_id
            facts["control_dispatched"] = True
            controlled = self._dispatch(method, params, f"{probe_id}-control")
            facts.update({"control_acknowledged": controlled["ack_state"] == "acknowledged", "durable_started_before_grant": controlled["durable_started_before_grant"], "readback_checks": controlled["readback_checks"]})
            if method == "turn/steer" and controlled["response"].get("turnId") != turn_id:
                raise AdapterError("CORRELATION_MISMATCH", "steer response turn identity")
            terminal = self._turn_event(turn_id, "turn/completed", time.monotonic() + 180, lifecycle)
            status = terminal.get("status")
            facts["terminal_status"] = status if status in {"completed", "failed", "interrupted", "inProgress"} else "unknown"
            expected = "completed" if method == "turn/steer" else "interrupted"
            self.probes[probe_id] = result("pass" if status == expected else "blocked", lifecycle=lifecycle, **facts)
        except (AdapterError, StoreConflict, ValueError) as exc:
            self.probes[probe_id] = result("blocked", error_class=exc.error_class if isinstance(exc, AdapterError) else type(exc).__name__, fingerprint=exc.detail if isinstance(exc, AdapterError) else type(exc).__name__, lifecycle=lifecycle, **facts)

    def steer_interrupt(self) -> None:
        if not self.thread_id or self.probes.get("P3-LIVE-02", {}).get("verdict") != "pass":
            for probe_id in ("P3-LIVE-04", "P3-LIVE-05"):
                self.probes[probe_id] = result("blocked", error_class="TURN_NOT_FOUND", dependency="P3-LIVE-02", mock_pass=False)
            return
        # Ephemeral identity is valid in this child; controls precede its restart.
        self._active_turn_control("turn/steer", "P3-LIVE-04")
        self._active_turn_control("turn/interrupt", "P3-LIVE-05")

    def reconnect_gap(self) -> None:
        gap = self.adapter.gap_state if self.adapter else "unresolved"
        sequences: dict[str, list[int]] = {}
        started_turns: set[tuple[str, str, str]] = set()
        completed_turns: set[tuple[str, str, str]] = set()
        lifecycle_valid = True
        invalid_rows = 0
        if self.normalized_path.is_file():
            for line in self.normalized_path.read_text(encoding="utf-8").splitlines():
                row = json.loads(line)
                session, sequence = row.get("adapter_session_id"), row.get("adapter_sequence")
                if not isinstance(session, str) or not session or type(sequence) is not int or sequence < 1:
                    invalid_rows += 1
                    continue
                sequences.setdefault(session, []).append(sequence)
                method = row.get("event_kind")
                if method in {"turn/started", "turn/completed"}:
                    thread_id, turn_id = row.get("thread_id"), row.get("turn_id")
                    if not isinstance(thread_id, str) or not thread_id or not isinstance(turn_id, str) or not turn_id:
                        lifecycle_valid = False
                        continue
                    key = (session, thread_id, turn_id)
                    if method == "turn/started":
                        if key in started_turns or key in completed_turns:
                            lifecycle_valid = False
                        started_turns.add(key)
                    else:
                        if key not in started_turns or key in completed_turns:
                            lifecycle_valid = False
                        completed_turns.add(key)
        increasing = invalid_rows == 0 and bool(sequences) and all(all(right > left for left, right in zip(values, values[1:])) for values in sequences.values())
        self.probes["P3-LIVE-06"] = result(
            "partial", adapter_sequence_strictly_increasing=increasing,
            turn_lifecycle_ordering_valid=lifecycle_valid and bool(completed_turns),
            completed_turn_count=len(completed_turns), invalid_sequence_row_count=invalid_rows,
            sequence_scope="per_adapter_session", adapter_session_count=len(sequences),
            ordering_recomputed_from="attempt/normalized.jsonl", reconnect=self.reconnect_evidence,
            restart_actor="app_server_child_or_client_transport", unanswered_requests="uncertain",
            gap_state="unresolved" if gap in {"none", "unresolved"} else gap, blind_replay=False,
        )

    def checkpoints(self) -> None:
        try:
            started = time.monotonic()
            with tempfile.TemporaryDirectory(prefix="sp010-p3-checkpoint-") as td:
                path = Path(td) / "resume.json"
                make_record(path)
                supervisor = Supervisor(
                    store_path=path, adapter=self.adapter, owner_id="builder-alpha",
                    authority_reader=lambda: {"revision": 7, "status": "valid_for_action"},
                    runtime_reader=lambda: {"identity_fresh": True}, repository_reader=lambda: {"identity_fresh": True},
                    admission_reader=lambda: {"action": "builder", "target": "SP-010/P3"}, monotonic=time.monotonic,
                )
                rows = []
                for payload in (
                    {"silence_seconds": 119}, {"silence_seconds": 120},
                    {"response_timeout_elapsed": True, "inter_checkpoint_delay_elapsed": True, "next_checkpoint_query_id": "checkpoint-live-q2"},
                    {"second_timeout_elapsed": True},
                ):
                    supervisor.enqueue("timer", "tick", payload)
                    rows.append(supervisor.drain_batch()[0]["result"])
                self.e2e["checkpoint_trace"] = rows
                valid = rows[0].get("stalled") is False and rows[1].get("checkpoint_round") == 1 and rows[2].get("checkpoint_round") == 2 and rows[2].get("stalled") is False and rows[3].get("stalled") is True
                elapsed = time.monotonic() - started
                self.probes["P3-LIVE-08"] = result(
                    "partial" if valid else "blocked", trace=rows, real_wait_elided=True,
                    evidence_layer="test_bound_state_transition", observed_elapsed_seconds=elapsed,
                    frozen_wall_clock_budget_seconds=330,
                    timer_source="injected_monotonic_boundary_facts_without_wall_clock_wait",
                )
        except Exception as exc:
            self.probes["P3-LIVE-08"] = result("blocked", error_class=type(exc).__name__, fingerprint=str(exc)[:240])

    def local_vertical_when_host_blocked(self) -> None:
        if "P3-LIVE-07" in self.probes:
            return

        class LocalAckAdapter:
            def start_turn(self, params, context):
                return {"turn": {"id": "local-test-bound-turn"}}

        try:
            with tempfile.TemporaryDirectory(prefix="sp010-p3-local-vertical-") as td:
                store_path = Path(td) / "resume.json"
                make_record(store_path)
                supervisor = Supervisor(
                    store_path=store_path, adapter=LocalAckAdapter(), owner_id="builder-alpha",
                    authority_reader=lambda: {"revision": 7, "status": "valid_for_action"},
                    runtime_reader=lambda: {"identity_fresh": True}, repository_reader=lambda: {"identity_fresh": True},
                    admission_reader=lambda: {"action": "builder", "target": "SP-010/P3"},
                )
                dispatched = supervisor.dispatch_authorized_action(
                    method="turn/start", params={"threadId": "local-test-bound-thread", "input": [], "model": self.model_id},
                    logical_action_id="p3-local-vertical", action_token="attempt-alpha",
                    authority_revision=7, owner_attempt_token="p3-local-owner",
                )
                self._local_vertical(supervisor, store_path)
                live = self.probes["P3-LIVE-07"]
                live.update({
                    "verdict": "partial", "evidence_layer": "test_bound_local_vertical",
                    "host_dispatch_substituted": True, "durable_started_before_grant": dispatched["durable_started_before_grant"],
                    "live_host_dispatch": False,
                    "live_dependency": self.probes.get("P3-LIVE-01", {}).get("error_class", "host_not_reached"),
                    "mock_pass": False,
                })
        except Exception as exc:
            self.probes["P3-LIVE-07"] = result("blocked", error_class=type(exc).__name__, fingerprint=str(exc)[:240], mock_pass=False)

    @staticmethod
    def _condition(status: str, evidence_layer: str, *refs: str) -> dict[str, Any]:
        return {"status": status, "evidence_layer": evidence_layer, "evidence_refs": list(refs)}

    def exit_conditions(self) -> dict[str, dict[str, Any]]:
        live07 = self.probes["P3-LIVE-07"]
        live08 = self.probes["P3-LIVE-08"]
        def live_pass(probe_id: str) -> bool:
            value = self.probes[probe_id]
            return value.get("verdict") == "pass" and value.get("evidence_layer") == "live_host" and value.get("host_dispatch_substituted") is not True and value.get("recovery_observations_injected") is not True

        return {
            "identity_rebaseline_passed": self._condition("pass" if self.probes["P3-LIVE-00"]["verdict"] == "pass" else "blocked", "execution_bound_identity", "P3-LIVE-00"),
            "explicit_model_successful_turn_passed": self._condition("pass" if live_pass("P3-LIVE-02") else "blocked", "live_host" if live_pass("P3-LIVE-02") else "missing_live", "P3-LIVE-02"),
            "thread_resume_live_result_passed": self._condition("pass" if live_pass("P3-LIVE-03") else "blocked", "live_host" if live_pass("P3-LIVE-03") else "missing_live", "P3-LIVE-03"),
            "turn_steer_live_result_passed": self._condition("pass" if live_pass("P3-LIVE-04") else "blocked", "live_host" if live_pass("P3-LIVE-04") else "missing_live", "P3-LIVE-04"),
            "turn_interrupt_live_result_passed": self._condition("pass" if live_pass("P3-LIVE-05") else "blocked", "live_host" if live_pass("P3-LIVE-05") else "missing_live", "P3-LIVE-05"),
            "event_ordering_recomputed": self._condition("pass" if live_pass("P3-LIVE-06") and self.probes["P3-LIVE-06"].get("adapter_sequence_strictly_increasing") is True and self.probes["P3-LIVE-06"].get("turn_lifecycle_ordering_valid") is True else "blocked", "live_host" if live_pass("P3-LIVE-06") else "missing_live", "P3-LIVE-06"),
            "reconnect_gap_explicit_and_no_blind_replay": self._condition("pass" if live_pass("P3-LIVE-06") and self.probes["P3-LIVE-06"].get("gap_state") == "resolved" and self.probes["P3-LIVE-06"].get("blind_replay") is False else "partial", "live_host" if live_pass("P3-LIVE-06") and self.probes["P3-LIVE-06"].get("gap_state") == "resolved" else "dependency_bound_no_blind_replay_only", "P3-LIVE-06"),
            "production_caller_persist_before_grant_readback_proved": self._condition("pass" if live_pass("P3-LIVE-02") and self.probes["P3-LIVE-02"].get("durable_started_before_grant") is True else "partial", "live_host" if live_pass("P3-LIVE-02") and self.probes["P3-LIVE-02"].get("durable_started_before_grant") is True else "test_bound_host_dispatch_substituted", "P3-LIVE-02", "P3-LIVE-07"),
            "observation_control_ordering_proved": self._condition("pass" if live_pass("P3-LIVE-07") else "partial", "live_host" if live_pass("P3-LIVE-07") else "test_bound", "P3-LIVE-07"),
            "pause_fence_and_single_owner_proved": self._condition("pass" if live_pass("P3-LIVE-07") else "partial", "live_host" if live_pass("P3-LIVE-07") else "test_bound", "P3-LIVE-07"),
            "two_checkpoint_protocol_proved": self._condition("pass" if live08.get("verdict") == "pass" and live08.get("real_wait_elided") is False else "partial", "live_wall_clock" if live08.get("verdict") == "pass" and live08.get("real_wait_elided") is False else "test_bound_real_wait_elided", "P3-LIVE-08"),
            "continue_recover_pause_vertical_trace_proved": self._condition("pass" if live_pass("P3-LIVE-07") else "blocked", "live_host" if live_pass("P3-LIVE-07") else live07.get("evidence_layer", "host_dispatch_substituted"), "P3-LIVE-07"),
            "independent_validation_passed": self._condition("blocked", "pending_independent_delta_validation"),
            "scope_delta_none_or_human_approved": self._condition("pass", "goal_conformance_review"),
        }

    def write(self) -> None:
        if (self.attempt_dir / "attempt.json").exists():
            raise ValueError("ATTEMPT_ALREADY_APPENDED")
        for probe_id in [f"P3-LIVE-{index:02d}" for index in range(9)]:
            self.probes.setdefault(probe_id, result("blocked", error_class="DEPENDENCY_NOT_REACHED"))
        exit_conditions = self.exit_conditions()
        overall = "candidate" if all(value["status"] == "pass" for key, value in exit_conditions.items() if key != "independent_validation_passed") else "partial"
        payload = {
            "schema_version": "sp010_p3_live_probe_results_v1", "observed_at_utc": utc_now(),
            "profile_id": "RGC-CODEX-APP-SERVER-LOCAL-V1", "overall": overall,
            "probes": self.probes, "p3_exit_conditions": exit_conditions,
            "claim_ceiling": "P3 live probe result only; no P4, RGC-01..06, release/deploy or Goal completion claim.",
            "sensitive_content_retained": False,
        }
        self.e2e_path.write_text(json.dumps(self.e2e, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
        attempt_results = self.attempt_dir / "results.json"
        attempt_results.write_text(json.dumps(payload, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
        manifest = {
            "schema_version": "sp010_p3_attempt_manifest_v1", "attempt_id": self.attempt_id,
            "created_at_utc": payload["observed_at_utc"], "provenance_status": "native_append_only",
            "results": self._artifact_ref(attempt_results), "raw_journal": self._artifact_ref(self.raw_path),
            "normalized_journal": self._artifact_ref(self.normalized_path), "trace": self._artifact_ref(self.e2e_path),
        }
        manifest_path = self.attempt_dir / "attempt.json"
        manifest_path.write_text(json.dumps(manifest, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
        attempt_ref = self._artifact_ref(manifest_path)
        attempt_ref["attempt_id"] = self.attempt_id
        prior: dict[str, Any] = {}
        if self.results_path.is_file():
            prior = json.loads(self.results_path.read_text(encoding="utf-8"))
        history = list(prior.get("attempt_history", []))
        if any(item.get("attempt_id") == self.attempt_id for item in history):
            raise ValueError("ATTEMPT_ALREADY_APPENDED")
        payload["attempt_history"] = [*history, attempt_ref]
        if "legacy_migration" in prior:
            payload["legacy_migration"] = prior["legacy_migration"]
        self.results_path.write_text(json.dumps(payload, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")

    @staticmethod
    def _artifact_ref(path: Path) -> dict[str, Any]:
        raw = path.read_bytes()
        return {"path": str(path.relative_to(REPO)), "sha256": hashlib.sha256(raw).hexdigest(), "byte_length": len(raw)}

    def run(self) -> int:
        self.prepare_attempt()
        profile = self.identity()
        if profile and self.initialize_and_model(profile):
            self.successful_turn()
            self.steer_interrupt()
            self.resume(profile)
            self.reconnect_gap()
        else:
            dependency = self.probes.get("P3-LIVE-01", {}).get("error_class", "DEPENDENCY_NOT_REACHED")
            for probe_id, error_class in (("P3-LIVE-02", dependency), ("P3-LIVE-03", "THREAD_NOT_FOUND"), ("P3-LIVE-04", "ACTIVE_TURN_NOT_STEERABLE"), ("P3-LIVE-05", "TURN_NOT_FOUND")):
                self.probes[probe_id] = result("blocked", error_class=error_class, dependency="P3-LIVE-01", mock_pass=False)
            self.probes["P3-LIVE-06"] = result("partial", error_class="RECONNECT_GAP_UNRESOLVED", gap_state="unresolved", blind_replay=False, dependency="P3-LIVE-01")
        self.local_vertical_when_host_blocked()
        self.checkpoints()
        if self.adapter:
            self.adapter.close("probe_complete")
        self.write()
        return 0


class ApprovedLocalProbe:
    """Explicit v15 profile path; never enters the legacy ephemeral host probe."""
    def __init__(self,profile_path: Path,repo: Path=REPO):
        import rgc_runtime_consumer as consumer
        self.consumer_module=consumer;self.repo=repo.resolve()
        self.frozen=self.repo/"Dashboard/Artifacts/Stage-Plan-SP-010/P3_CurrentProfileFreeze_v15"
        self.profile_path=consumer.confined(self.repo,profile_path)
        if self.profile_path!=self.frozen/'Profile.json': raise consumer.ConsumerError('APPROVED_PROFILE_PATH_MISMATCH')
        package=json.loads(consumer.read_bytes(self.repo,self.frozen/'PackageManifest.json'))
        pins={r['path']:r['sha256'] for r in package['files']}
        rel=str(self.profile_path.relative_to(self.repo))
        if rel not in pins: raise consumer.ConsumerError('PROFILE_PACKAGE_PIN_MISSING')
        self.profile_ref={'path':rel,'sha256':pins[rel]}
        self.profile=json.loads(consumer.read_ref(self.repo,self.profile_ref))
        authority=json.loads(consumer.read_ref(self.repo,self.profile['approved_authority']))
        if authority.get('status')!='approved': raise consumer.ConsumerError('AUTHORITY_NOT_APPROVED')
    def run_runtime_local(self,config):
        from rgc_runtime_driver import RuntimeDriver
        R=self.consumer_module
        required={'source_root','evidence_root','admission_ref','source_manifest_ref','origin_sources','operation','event_payloads'}
        if not isinstance(config,dict) or set(config)!=required: raise R.ConsumerError('RUNTIME_LOCAL_CONFIG_NOT_CLOSED')
        driver=RuntimeDriver(self.repo,config['source_root'],config['evidence_root'],config['admission_ref'],self.profile_ref,config['source_manifest_ref'])
        source_map={}
        for source in config['origin_sources']:
            if set(source)!={'path','role'}: raise R.ConsumerError('RUNTIME_LOCAL_SOURCE_CONFIG_NOT_CLOSED')
            origin=R.confined(driver.root,source['path'])
            original={'path':str(origin),'sha256':R.sha(R.read_bytes(driver.root,origin))}
            source_map[R.canonical(original)]=driver.register_source(origin,source['role'])
        def bind(value):
            if isinstance(value,dict):
                if set(value)=={'path','sha256'}:
                    if R.canonical(value) not in source_map: raise R.ConsumerError('LOCAL_EVENT_SOURCE_NOT_IN_ORIGIN_SET')
                    return source_map[R.canonical(value)]
                return {key:bind(item) for key,item in value.items()}
            if isinstance(value,list): return [bind(item) for item in value]
            return value
        # Event refs must address the driver-created snapshots. Passing arbitrary
        # producer refs fails observer registration rather than creating trust.
        control_path=driver.root/'local-control.json'
        control_path.write_bytes(R.canonical({'operation':config['operation'],'event_payloads':bind(config['event_payloads'])}))
        reference={'path':str(control_path),'sha256':R.sha(control_path.read_bytes())}
        try: return driver.run_local_source_control(reference)
        finally: driver.cleanup_owned(driver.run_id)

    def run_local(self,config=None):
        R=self.consumer_module
        base={'schema_version':'sp010_approved_local_probe_v18','verdict':'candidate_local_only','profile_ref':self.profile_ref,'profile_id':self.profile['profile_id'],'host_started':False,'model_started':False,'fault_workers_started':False,'thread_parameter_acceptance':self.profile['thread_parameter_acceptance'],'runtime_acceptance':'not_evaluated'}
        if config is None:
            return base|{'next_dependency':'independent source documents and token registry; frozen consumer/observer source; independent Validation; new runtime admission'}
        required={'source_root','evidence_root','trusted_sources','token_registry_path','spec','independent_sources','known_token_registry','consumer_source_ref','observer_source_ref','admission_ref'}
        if not isinstance(config,dict) or set(config)!=required: raise R.ConsumerError('LOCAL_CONFIG_NOT_CLOSED')
        from rgc_runtime_driver import RuntimeDriver
        admission_gate=RuntimeDriver.__new__(RuntimeDriver)
        admission_gate.repo=self.repo
        admission_gate.admission_ref=config['admission_ref']
        admission_gate._admit_local()
        instance=R.RuntimeConsumer(self.frozen,self.repo,config['source_root'],config['evidence_root'],config['trusted_sources'],config['token_registry_path'])
        if instance.profile_ref!=self.profile_ref: raise R.ConsumerError('LOCAL_CONFIG_PROFILE_MISMATCH')
        frozen=instance.freeze_invocation(config['spec'],config['independent_sources'],self.profile_ref,config['known_token_registry'],config['consumer_source_ref'],config['observer_source_ref'])
        observed=instance.consume_frozen(frozen['audit_ref'])
        return base|{'audit_ref':frozen['audit_ref'],'invocation_identity_sha256':frozen['invocation_identity_sha256'],'local_primitive_result':observed,'runtime_dispatch_granted':False}


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--binary", default="/Applications/ChatGPT.app/Contents/Resources/codex")
    parser.add_argument("--repair-existing-evidence", action="store_true")
    parser.add_argument("--approved-profile", type=Path)
    parser.add_argument("--local-source-config", type=Path)
    parser.add_argument("--runtime-driver-config", type=Path)
    parser.add_argument("--phase", choices=("local", "runtime"), default="local")
    parser.add_argument("--invocation-ref", type=Path)
    parser.add_argument("--invocation-sha256")
    parser.add_argument("--package-manifest-sha256")
    args = parser.parse_args()
    if args.phase == "runtime":
        if (not args.approved_profile or not args.invocation_ref or
                not args.invocation_sha256 or not args.package_manifest_sha256 or
                args.local_source_config or args.runtime_driver_config or
                args.repair_existing_evidence):
            parser.error("runtime phase requires pinned invocation/profile/package without local or legacy input")
        try:
            import rgc_runtime_consumer as consumer
            profile = consumer.confined(REPO, args.approved_profile)
            frozen = REPO / "Dashboard/Artifacts/Stage-Plan-SP-010/P3_CurrentProfileFreeze_v15"
            current_frozen=REPO / consumer.CURRENT_HOST_PACKAGE
            if profile == current_frozen / "Profile.json":frozen=current_frozen
            if profile != frozen / "Profile.json":
                raise consumer.ConsumerError("APPROVED_PROFILE_PATH_MISMATCH")
            entry = consumer.ApprovedRuntimeInvocation(
                REPO, {"path": str(args.invocation_ref), "sha256": args.invocation_sha256},
                {"path": str(frozen / "PackageManifest.json"), "sha256": args.package_manifest_sha256})
            observed = entry.run()
            print(json.dumps(observed, ensure_ascii=False, indent=2))
            return 0
        except (ValueError, OSError) as exc:
            # A runtime error may happen after a send; never claim host_started=false.
            print(json.dumps({"verdict": "runtime_error", "host_started": "unknown",
                              "runtime_acceptance": "not_evaluated", "error": str(exc)}, ensure_ascii=False))
            return 2
    if args.invocation_ref or args.invocation_sha256 or args.package_manifest_sha256:
        parser.error("runtime invocation pins require runtime phase")
    if args.approved_profile:
        if args.runtime_driver_config and args.local_source_config:
            parser.error("two local source namespaces cannot be mixed")
        if args.repair_existing_evidence:
            parser.error("approved-profile cannot mix with historical evidence repair")
        config=json.loads(args.local_source_config.read_text(encoding="utf-8")) if args.local_source_config else None
        try:
            probe=ApprovedLocalProbe(args.approved_profile)
            observed=probe.run_runtime_local(json.loads(args.runtime_driver_config.read_text())) if args.runtime_driver_config else probe.run_local(config)
            print(json.dumps(observed,ensure_ascii=False,indent=2))
            return 0
        except (ValueError,OSError) as exc:
            print(json.dumps({"verdict":"blocked_local_only","host_started":False,"error":str(exc)},ensure_ascii=False))
            return 2
    if args.local_source_config or args.runtime_driver_config:
        parser.error("local-source-config requires approved-profile")
    if args.repair_existing_evidence:
        migrate_legacy_evidence(
            results_path=OUTPUT_DIR / "P3_LiveProbeResults.json",
            attempts_dir=ATTEMPTS_DIR,
            raw_path=OUTPUT_DIR / "P3_RawEventJournal.jsonl",
            normalized_path=OUTPUT_DIR / "P3_NormalizedEventJournal.jsonl",
            trace_path=OUTPUT_DIR / "P3_E2ETrace.json",
        )
        return 0
    parser.error("legacy host probe has no current runtime admission; use an approved pinned phase")


if __name__ == "__main__":
    raise SystemExit(main())
