#!/usr/bin/env python3
"""Fail-closed, redacting JSON-RPC adapter for the RGC local App Server profile."""
from __future__ import annotations

import hashlib
import json
import os
import queue
import re
import subprocess
import threading
import time
import uuid
from dataclasses import dataclass
from datetime import datetime, timezone
from pathlib import Path
from typing import Any, Callable, TextIO

# 载入时记录源码身份；不改变业务状态或执行权限。
_LOADED_SOURCE_PATH = Path(__file__).absolute()
_LOADED_SOURCE_SHA256 = hashlib.sha256(_LOADED_SOURCE_PATH.read_bytes()).hexdigest()
def loaded_source_identity():
    return {'path': str(_LOADED_SOURCE_PATH), 'sha256': _LOADED_SOURCE_SHA256}



ERROR_CLASSES = frozenset({
    "BINARY_NOT_FOUND", "RUNTIME_IDENTITY_DRIFT", "PROCESS_EXITED", "MALFORMED_JSON",
    "PROTOCOL_SCHEMA_MISMATCH", "INITIALIZE_TIMEOUT", "REQUEST_TIMEOUT",
    "TURN_COMPLETION_TIMEOUT", "MODEL_UNAVAILABLE", "AUTH_REQUIRED", "USAGE_LIMIT",
    "NETWORK_UNAVAILABLE", "ACTIVE_TURN_NOT_STEERABLE", "THREAD_NOT_FOUND",
    "TURN_NOT_FOUND", "SERVER_REQUEST_UNHANDLED", "RECONNECT_GAP_UNRESOLVED",
    "CORRELATION_MISMATCH", "STALE_ACTION_TOKEN", "STALE_CONTROL_REVISION",
    "STALE_FENCING_TOKEN", "DUPLICATE_OR_LATE_EVENT", "USER_CONTROL_ACTIVE",
    "HUMAN_AUTHORITY_REQUIRED", "UNKNOWN_HOST_ERROR",
})
KNOWN_NOTIFICATIONS = frozenset({
    "thread/started", "thread/status/changed", "turn/started", "turn/completed",
    "item/started", "item/completed", "error",
})
SENSITIVE_KEYS = frozenset({
    "input", "text", "message", "messages", "prompt", "reasoning", "output", "content",
    "command", "stdout", "stderr", "token", "credential", "authorization", "environment",
})
KNOWN_IDENTIFIER_FIELDS = {
    "thread/started": (("thread", "id", "threadId"),),
    "thread/status/changed": ((None, "threadId", "threadId"), ("thread", "id", "threadId")),
    "turn/started": ((None, "threadId", "threadId"), ("turn", "id", "turnId")),
    "turn/completed": ((None, "threadId", "threadId"), ("turn", "id", "turnId")),
    "item/started": ((None, "threadId", "threadId"), (None, "turnId", "turnId"), ("item", "id", "itemId")),
    "item/completed": ((None, "threadId", "threadId"), (None, "turnId", "turnId"), ("item", "id", "itemId")),
}
IDENTIFIER_RE = re.compile(r"^[A-Za-z0-9][A-Za-z0-9._:-]{0,255}$")


class AdapterError(RuntimeError):
    def __init__(self, error_class: str, detail: str = ""):
        if error_class not in ERROR_CLASSES:
            error_class = "UNKNOWN_HOST_ERROR"
        self.error_class = error_class
        self.detail = detail
        super().__init__(f"{error_class}:{detail}" if detail else error_class)


@dataclass(frozen=True)
class RuntimeProfile:
    binary_path: str
    binary_sha256: str
    protocol_bundle_path: str
    protocol_bundle_sha256: str
    cwd: str
    required_model_id: str = "gpt-6-astra"
    initialize_timeout: float = 15.0
    request_timeout: float = 30.0


@dataclass(frozen=True)
class RequestContext:
    logical_action_id: str
    action_token: str
    authority_revision: int
    control_revision: int
    record_revision: int
    request_sha256: str

    def validate(self) -> None:
        if not all((self.logical_action_id, self.action_token, self.request_sha256)):
            raise AdapterError("CORRELATION_MISMATCH", "missing governance correlation")
        if min(self.authority_revision, self.control_revision, self.record_revision) < 0:
            raise AdapterError("CORRELATION_MISMATCH", "invalid governance revision")


def _sha256_bytes(data: bytes) -> str:
    return hashlib.sha256(data).hexdigest()


def _canonical(value: Any) -> bytes:
    return json.dumps(value, ensure_ascii=False, sort_keys=True, separators=(",", ":")).encode("utf-8")


def _utc_now() -> str:
    return datetime.now(timezone.utc).isoformat().replace("+00:00", "Z")


def _redacted(value: Any) -> dict[str, Any]:
    raw = _canonical(value)
    return {"redacted": True, "sha256": _sha256_bytes(raw), "byte_length": len(raw)}


def _safe_identifiers(method: Any, value: Any) -> dict[str, str]:
    """Extract only schema-known, format-constrained lifecycle identities.

    Unknown methods and response payloads retain no plaintext fields, even if
    they happen to contain keys named id/status/threadId.
    """
    fields = KNOWN_IDENTIFIER_FIELDS.get(method)
    if fields is None or not isinstance(value, dict):
        return {}
    safe: dict[str, str] = {}
    for container, source_key, output_key in fields:
        source = value if container is None else value.get(container)
        item = source.get(source_key) if isinstance(source, dict) else None
        if isinstance(item, str) and IDENTIFIER_RE.fullmatch(item):
            safe[output_key] = item
    return safe


class JournalWriter:
    def __init__(self, raw_path: Path | None, normalized_path: Path | None):
        self.raw_path = Path(raw_path) if raw_path else None
        self.normalized_path = Path(normalized_path) if normalized_path else None
        self._lock = threading.Lock()

    def _append(self, path: Path | None, value: dict[str, Any]) -> None:
        if path is None:
            return
        path.parent.mkdir(parents=True, exist_ok=True)
        with path.open("a", encoding="utf-8") as handle:
            handle.write(json.dumps(value, ensure_ascii=False, sort_keys=True) + "\n")

    def raw(self, *, sequence: int, direction: str, frame: dict[str, Any], raw_bytes: bytes) -> None:
        payload = frame.get("params", frame.get("result", frame.get("error")))
        entry = {
            "schema_version": "rgc_raw_event_v1", "adapter_sequence": sequence,
            "observed_at_utc": _utc_now(), "direction": direction,
            "jsonrpc_id": frame.get("id"), "method": frame.get("method"),
            "envelope_keys": sorted(frame), "safe_identifiers": _safe_identifiers(frame.get("method"), payload),
            "payload": _redacted(payload), "frame_sha256": _sha256_bytes(raw_bytes),
            "frame_byte_length": len(raw_bytes), "sensitive_content_retained": False,
        }
        with self._lock:
            self._append(self.raw_path, entry)

    def normalized(self, value: dict[str, Any]) -> None:
        with self._lock:
            self._append(self.normalized_path, value)


class AppServerAdapter:
    def __init__(
        self,
        *,
        raw_journal: Path | None = None,
        normalized_journal: Path | None = None,
        process_factory: Callable[..., subprocess.Popen[str]] = subprocess.Popen,
        monotonic: Callable[[], float] = time.monotonic,
    ):
        self.session_id = f"adapter-{uuid.uuid4().hex}"
        self.journal = JournalWriter(raw_journal, normalized_journal)
        self.process_factory = process_factory
        self.monotonic = monotonic
        self.process: subprocess.Popen[str] | None = None
        self.profile: RuntimeProfile | None = None
        self._incoming: queue.Queue[str | None] = queue.Queue()
        self._events: queue.Queue[dict[str, Any]] = queue.Queue()
        self._sequence = 0
        self._next_id = 0
        self._pending: dict[int, dict[str, Any]] = {}
        self._initialized = False
        self.gap_state = "none"
        self.stderr_evidence: list[dict[str, Any]] = []

    @property
    def last_sequence(self) -> int:
        return self._sequence

    def _next_sequence(self) -> int:
        self._sequence += 1
        return self._sequence

    def _verify_identity(self, profile: RuntimeProfile) -> None:
        binary = Path(profile.binary_path).resolve()
        protocol = Path(profile.protocol_bundle_path).resolve()
        if not binary.is_file():
            raise AdapterError("BINARY_NOT_FOUND", str(binary))
        for path, expected in ((binary, profile.binary_sha256), (protocol, profile.protocol_bundle_sha256)):
            try:
                actual = _sha256_bytes(path.read_bytes())
            except OSError as exc:
                raise AdapterError("RUNTIME_IDENTITY_DRIFT", str(path)) from exc
            if actual != expected:
                raise AdapterError("RUNTIME_IDENTITY_DRIFT", f"{path}:{actual}")

    def _reader(self, stream: TextIO) -> None:
        try:
            for line in stream:
                self._incoming.put(line)
        finally:
            self._incoming.put(None)

    def _stderr_reader(self, stream: TextIO) -> None:
        for line in stream:
            raw = line.encode("utf-8")
            lowered = line.lower()
            classification = "stderr_other"
            if "sqlite" in lowered and ("permission" in lowered or "operation not permitted" in lowered):
                classification = "sandbox_state_write_restricted"
            elif "operation not permitted" in lowered or "permission denied" in lowered:
                classification = "sandbox_permission_restricted"
            elif "sqlite state runtime" in lowered or "state runtime" in lowered:
                classification = "sqlite_state_init_failed"
            elif "auth" in lowered or "oauth" in lowered:
                classification = "auth_required"
            elif "usage" in lowered or "limit" in lowered:
                classification = "usage_limit"
            elif "network" in lowered or "resolve host" in lowered:
                classification = "network_unavailable"
            self.stderr_evidence.append({"classification": classification, "sha256": _sha256_bytes(raw), "byte_length": len(raw)})

    def start(self, profile: RuntimeProfile) -> dict[str, Any]:
        if self.process is not None:
            raise AdapterError("PROTOCOL_SCHEMA_MISMATCH", "adapter already started")
        self._verify_identity(profile)
        self.profile = profile
        try:
            self.process = self.process_factory(
                [str(Path(profile.binary_path).resolve()), "app-server", "--stdio"],
                cwd=str(Path(profile.cwd).resolve()), stdin=subprocess.PIPE, stdout=subprocess.PIPE,
                stderr=subprocess.PIPE, text=True, bufsize=1,
            )
        except FileNotFoundError as exc:
            raise AdapterError("BINARY_NOT_FOUND", profile.binary_path) from exc
        assert self.process.stdout is not None
        threading.Thread(target=self._reader, args=(self.process.stdout,), daemon=True).start()
        if self.process.stderr is not None:
            threading.Thread(target=self._stderr_reader, args=(self.process.stderr,), daemon=True).start()
        result = self._request("initialize", {
            "clientInfo": {"name": "sge-rgc-supervisor", "title": "SGE RGC Supervisor", "version": "1"},
            "capabilities": {"experimentalApi": True},
        }, timeout=profile.initialize_timeout, preinitialize=True)
        self._send_frame({"jsonrpc": "2.0", "method": "initialized", "params": {}})
        self._initialized = True
        return result

    def _send_frame(self, frame: dict[str, Any]) -> None:
        if self.process is None or self.process.stdin is None or self.process.poll() is not None:
            raise AdapterError("PROCESS_EXITED")
        raw = _canonical(frame) + b"\n"
        sequence = self._next_sequence()
        self.journal.raw(sequence=sequence, direction="client_to_server", frame=frame, raw_bytes=raw)
        try:
            self.process.stdin.write(raw.decode("utf-8"))
            self.process.stdin.flush()
        except (BrokenPipeError, OSError) as exc:
            self._mark_pending_uncertain()
            raise AdapterError("PROCESS_EXITED") from exc

    def _read_frame(self, deadline: float) -> tuple[dict[str, Any], int]:
        remaining = deadline - self.monotonic()
        if remaining <= 0:
            raise AdapterError("REQUEST_TIMEOUT")
        try:
            line = self._incoming.get(timeout=remaining)
        except queue.Empty as exc:
            raise AdapterError("REQUEST_TIMEOUT") from exc
        if line is None:
            self._mark_pending_uncertain()
            classes = {item["classification"] for item in self.stderr_evidence}
            if {"sandbox_permission_restricted", "sqlite_state_init_failed"}.issubset(classes):
                detail = "sandbox_state_write_restricted"
            else:
                detail = self.stderr_evidence[-1]["classification"] if self.stderr_evidence else "no_stderr_evidence"
            raise AdapterError("PROCESS_EXITED", detail)
        raw = line.encode("utf-8")
        try:
            frame = json.loads(line)
        except json.JSONDecodeError as exc:
            sequence = self._next_sequence()
            self.journal.raw(sequence=sequence, direction="server_to_client", frame={}, raw_bytes=raw)
            raise AdapterError("MALFORMED_JSON", _sha256_bytes(raw)) from exc
        if not isinstance(frame, dict):
            raise AdapterError("PROTOCOL_SCHEMA_MISMATCH", "frame is not object")
        sequence = self._next_sequence()
        self.journal.raw(sequence=sequence, direction="server_to_client", frame=frame, raw_bytes=raw)
        return frame, sequence

    def _normalized(self, frame: dict[str, Any], sequence: int) -> dict[str, Any]:
        params = frame.get("params") if isinstance(frame.get("params"), dict) else {}
        method = frame.get("method")
        event = {
            "schema_version": "rgc_normalized_event_v1", "event_id": f"{self.session_id}-{sequence}",
            "adapter_session_id": self.session_id, "adapter_sequence": sequence,
            "observed_at_utc": _utc_now(), "monotonic_ns": int(self.monotonic() * 1_000_000_000),
            "direction": "server_to_client", "method": method, "jsonrpc_id": frame.get("id"),
            "event_kind": method if method in KNOWN_NOTIFICATIONS else ("server_request" if method and "id" in frame else "unmapped_notification"),
            "thread_id": _safe_identifiers(method, params).get("threadId"),
            "turn_id": _safe_identifiers(method, params).get("turnId"),
            "item_id": _safe_identifiers(method, params).get("itemId"),
            "logical_action_id": "unknown", "action_token": "unknown", "authority_revision": "unknown",
            "control_revision": "unknown", "record_revision": "unknown", "request_sha256": "unknown",
            "payload_sha256": _sha256_bytes(_canonical(params)), "correlation_state": "unknown",
            "ack_state": "not_applicable", "error_class": None, "gap_state": self.gap_state,
            "sensitive_content_retained": False,
        }
        self.journal.normalized(event)
        return event

    def _request(self, method: str, params: dict[str, Any], *, timeout: float | None = None, context: RequestContext | None = None, preinitialize: bool = False) -> dict[str, Any]:
        if not preinitialize and not self._initialized:
            raise AdapterError("PROTOCOL_SCHEMA_MISMATCH", "initialize not complete")
        if context is not None:
            context.validate()
        self._next_id += 1
        request_id = self._next_id
        request_digest = _sha256_bytes(_canonical({"method": method, "params": params}))
        if context is not None and request_digest != context.request_sha256:
            raise AdapterError("CORRELATION_MISMATCH", "request digest mismatch")
        self._pending[request_id] = {"method": method, "context": context, "state": "sent", "request_sha256": request_digest}
        self._send_frame({"jsonrpc": "2.0", "id": request_id, "method": method, "params": params})
        budget = timeout if timeout is not None else (self.profile.request_timeout if self.profile else 30.0)
        deadline = self.monotonic() + budget
        while True:
            try:
                frame, sequence = self._read_frame(deadline)
            except AdapterError as exc:
                if exc.error_class == "REQUEST_TIMEOUT" and method == "initialize":
                    raise AdapterError("INITIALIZE_TIMEOUT") from exc
                raise
            if frame.get("id") == request_id and "method" not in frame:
                pending = self._pending.pop(request_id)
                if "error" in frame:
                    raise AdapterError(self._classify_error(frame["error"]), _sha256_bytes(_canonical(frame["error"])))
                result = frame.get("result")
                if not isinstance(result, dict):
                    raise AdapterError("PROTOCOL_SCHEMA_MISMATCH", f"{method} result")
                if pending["context"] is not None:
                    self._journal_ack(frame, sequence, pending)
                return result
            event = self._normalized(frame, sequence)
            self._events.put({"frame": frame, "event": event})
            if frame.get("method") and "id" in frame:
                self._send_frame({
                    "jsonrpc": "2.0", "id": frame["id"],
                    "error": {"code": -32001, "message": "SERVER_REQUEST_UNHANDLED"},
                })
                self._pending[request_id]["state"] = "uncertain"
                raise AdapterError("SERVER_REQUEST_UNHANDLED", str(frame.get("method")))

    def _journal_ack(self, frame: dict[str, Any], sequence: int, pending: dict[str, Any]) -> None:
        context: RequestContext = pending["context"]
        event = {
            "schema_version": "rgc_normalized_event_v1", "event_id": f"{self.session_id}-{sequence}-ack",
            "adapter_session_id": self.session_id, "adapter_sequence": sequence,
            "observed_at_utc": _utc_now(), "monotonic_ns": int(self.monotonic() * 1_000_000_000),
            "direction": "server_to_client", "method": pending["method"], "jsonrpc_id": frame.get("id"),
            "event_kind": "request_ack", "thread_id": None, "turn_id": None, "item_id": None,
            "logical_action_id": context.logical_action_id, "action_token": context.action_token,
            "authority_revision": context.authority_revision, "control_revision": context.control_revision,
            "record_revision": context.record_revision, "request_sha256": context.request_sha256,
            "payload_sha256": _sha256_bytes(_canonical(frame.get("result"))), "correlation_state": "matched",
            "ack_state": "acknowledged", "error_class": None, "gap_state": self.gap_state,
            "sensitive_content_retained": False,
        }
        self.journal.normalized(event)

    @staticmethod
    def _classify_error(error: Any) -> str:
        text = json.dumps(error, ensure_ascii=False).lower()
        for needle, classification in (
            ("usage", "USAGE_LIMIT"), ("limit", "USAGE_LIMIT"), ("auth", "AUTH_REQUIRED"),
            ("network", "NETWORK_UNAVAILABLE"), ("active turn", "ACTIVE_TURN_NOT_STEERABLE"),
            ("thread", "THREAD_NOT_FOUND"), ("turn", "TURN_NOT_FOUND"),
        ):
            if needle in text:
                return classification
        return "UNKNOWN_HOST_ERROR"

    def list_models(self, *, max_pages: int = 100) -> list[dict[str, Any]]:
        cursor: str | None = None
        models: list[dict[str, Any]] = []
        seen: set[str] = set()
        for _ in range(max_pages):
            result = self._request("model/list", {"cursor": cursor, "includeHidden": False, "limit": 100})
            page = result.get("data", result.get("models", []))
            if not isinstance(page, list):
                raise AdapterError("PROTOCOL_SCHEMA_MISMATCH", "model/list page")
            models.extend(item for item in page if isinstance(item, dict))
            cursor = result.get("nextCursor")
            if cursor is None:
                break
            if not isinstance(cursor, str) or cursor in seen:
                raise AdapterError("PROTOCOL_SCHEMA_MISMATCH", "model/list cursor loop")
            seen.add(cursor)
        else:
            raise AdapterError("PROTOCOL_SCHEMA_MISMATCH", "model/list page limit")
        return models

    def require_model(self, model_id: str) -> dict[str, Any]:
        for model in self.list_models():
            if model.get("id") == model_id or model.get("model") == model_id:
                return model
        raise AdapterError("MODEL_UNAVAILABLE", model_id)

    def start_thread(self, spec: dict[str, Any]) -> dict[str, Any]:
        return self._request("thread/start", spec)

    def read_thread(self, thread_id: str, *, include_turns: bool = False) -> dict[str, Any]:
        return self._request("thread/read", {"threadId": thread_id, "includeTurns": include_turns})

    def resume_thread(self, spec: dict[str, Any]) -> dict[str, Any]:
        return self._request("thread/resume", spec)

    def start_turn(self, action: dict[str, Any], context: RequestContext) -> dict[str, Any]:
        return self._request("turn/start", action, context=context)

    def steer_turn(self, action: dict[str, Any], context: RequestContext) -> dict[str, Any]:
        if not action.get("expectedTurnId"):
            raise AdapterError("TURN_NOT_FOUND", "expectedTurnId required")
        return self._request("turn/steer", action, timeout=15.0, context=context)

    def interrupt_turn(self, action: dict[str, Any], context: RequestContext) -> dict[str, Any]:
        if not action.get("threadId") or not action.get("turnId"):
            raise AdapterError("TURN_NOT_FOUND", "threadId and turnId required")
        return self._request("turn/interrupt", action, timeout=15.0, context=context)

    def next_event(self, deadline: float) -> dict[str, Any]:
        try:
            return self._events.get_nowait()
        except queue.Empty:
            frame, sequence = self._read_frame(deadline)
            if "method" not in frame:
                raise AdapterError("CORRELATION_MISMATCH", "unsolicited response")
            return {"frame": frame, "event": self._normalized(frame, sequence)}

    def respond_server_request(self, request: dict[str, Any], decision: dict[str, Any]) -> None:
        if "id" not in request or not request.get("method"):
            raise AdapterError("PROTOCOL_SCHEMA_MISMATCH", "server request identity")
        if decision.get("validated") is not True or decision.get("outcome") not in {"deny", "cancel"}:
            raise AdapterError("HUMAN_AUTHORITY_REQUIRED", str(request.get("method")))
        self._send_frame({"jsonrpc": "2.0", "id": request["id"], "result": {"decision": decision["outcome"]}})

    def _mark_pending_uncertain(self) -> None:
        for pending in self._pending.values():
            pending["state"] = "uncertain"
        if self._pending:
            self.gap_state = "unresolved"

    def close(self, reason: str = "normal") -> dict[str, Any]:
        self._mark_pending_uncertain()
        process = self.process
        if process is not None and process.poll() is None:
            process.terminate()
            try:
                process.wait(timeout=5)
            except subprocess.TimeoutExpired:
                process.kill()
                process.wait(timeout=5)
        self.process = None
        return {"reason": reason, "last_sequence": self.last_sequence, "gap_state": self.gap_state}


__all__ = ["AdapterError", "AppServerAdapter", "RequestContext", "RuntimeProfile"]
