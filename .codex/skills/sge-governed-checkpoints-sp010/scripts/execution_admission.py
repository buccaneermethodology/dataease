#!/usr/bin/env python3
"""Validate the pre-execution admission consumed by mutating entry points."""
from __future__ import annotations
import argparse, hashlib, json
from datetime import datetime
from pathlib import Path
from typing import Any

import jsonschema

# 载入时记录源码身份；不改变业务状态或执行权限。
_LOADED_SOURCE_PATH = Path(__file__).absolute()
_LOADED_SOURCE_SHA256 = hashlib.sha256(_LOADED_SOURCE_PATH.read_bytes()).hexdigest()
def loaded_source_identity():
    return {'path': str(_LOADED_SOURCE_PATH), 'sha256': _LOADED_SOURCE_SHA256}


REQUIRED_REFS = ("goal", "completion_contract", "context", "design_review", "topology")
SCHEMA_VERSION = "execution_admission_v1"
SCHEMA_PATH = Path(__file__).resolve().parents[1] / "schemas" / "execution_admission_v1.schema.json"

def _sha(path: Path) -> str: return hashlib.sha256(path.read_bytes()).hexdigest()
def _path(root: Path, raw: str) -> Path:
    candidate = Path(raw)
    if candidate.is_absolute() or ".." in candidate.parts: raise ValueError("ADMISSION_PATH_INVALID")
    try:
        resolved = (root / candidate).resolve(strict=True)
    except OSError as exc:
        raise ValueError("ADMISSION_REFERENCE_UNREADABLE") from exc
    try:
        resolved.relative_to(root.resolve(strict=True))
    except ValueError as exc:
        raise ValueError("ADMISSION_REFERENCE_OUTSIDE_TRUSTED_ROOT") from exc
    if not resolved.is_file(): raise ValueError("ADMISSION_REFERENCE_UNREADABLE")
    return resolved
def _ref(root: Path, value: Any, name: str) -> dict[str, str]:
    if not isinstance(value, dict) or set(value) != {"path", "sha256"}: raise ValueError(f"ADMISSION_{name.upper()}_REF_INVALID")
    path = _path(root, value["path"])
    if _sha(path) != value["sha256"]: raise ValueError(f"ADMISSION_{name.upper()}_DIGEST_MISMATCH")
    return {"path": value["path"], "sha256": value["sha256"]}
def validate(payload: dict[str, Any], root: Path, *, expected_action: str | None = None, expected_target: str | None = None) -> dict[str, Any]:
    if not isinstance(payload, dict): raise ValueError("ADMISSION_SCHEMA_INVALID")
    try:
        schema = json.loads(SCHEMA_PATH.read_text(encoding="utf-8"))
        errors = list(jsonschema.Draft202012Validator(schema, format_checker=jsonschema.FormatChecker()).iter_errors(payload))
    except (OSError, json.JSONDecodeError, jsonschema.SchemaError) as exc:
        raise ValueError("ADMISSION_SCHEMA_UNAVAILABLE") from exc
    if errors: raise ValueError("ADMISSION_SCHEMA_INVALID")
    if payload.get("status") != "approved": raise ValueError("ADMISSION_NOT_APPROVED")
    if expected_action is not None and payload.get("action") != expected_action: raise ValueError("ADMISSION_ACTION_MISMATCH")
    if expected_target is not None and payload.get("target") != expected_target: raise ValueError("ADMISSION_TARGET_MISMATCH")
    try: datetime.fromisoformat(str(payload["issued_at"]).replace("Z", "+00:00"))
    except (KeyError, ValueError): raise ValueError("ADMISSION_TIMESTAMP_INVALID")
    refs = {name: _ref(root, payload.get(name), name) for name in REQUIRED_REFS}
    return {"schema_version": SCHEMA_VERSION, "admission_id": payload["admission_id"], "action": payload["action"], "target": payload["target"], "references": refs}
def main() -> int:
    parser = argparse.ArgumentParser(); parser.add_argument("admission", type=Path); parser.add_argument("--root", type=Path, required=True); parser.add_argument("--action"); parser.add_argument("--target"); args = parser.parse_args()
    try:
        payload = json.loads(args.admission.read_text(encoding="utf-8")); print(json.dumps(validate(payload, args.root.resolve(), expected_action=args.action, expected_target=args.target), ensure_ascii=False, indent=2)); return 0
    except (OSError, json.JSONDecodeError, ValueError) as exc:
        print(json.dumps({"verdict": "blocked", "fingerprint": str(exc)}, ensure_ascii=False)); return 1
if __name__ == "__main__": raise SystemExit(main())
