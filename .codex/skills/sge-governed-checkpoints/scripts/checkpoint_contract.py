#!/usr/bin/env python3
"""Validate and render five durable, reader-visible checkpoint categories."""
from __future__ import annotations

import argparse
import json
import sys
from datetime import datetime
import hashlib
from pathlib import Path
from typing import Any

SCHEMA_VERSION="checkpoint_event_v1"
CATEGORIES=("intake","plan","frozen_handoff","validation_binding","final_receipt")
OBSERVED_STATES={
    "intake":{"classified"},
    "plan":{"ready","blocked"},
    "frozen_handoff":{"evidence_bound"},
    "validation_binding":{"pre_closeout_only","final_state_bound","blocked"},
    "final_receipt":{"candidate","pass","blocked"},
}
PAYLOAD_FIELDS={
    "intake":{"objective","route","authority","boundary","maximum_claim"},
    "plan":{"goal_ref","session_ref","lanes","readiness","human_decision_required"},
    "frozen_handoff":{"design_ref","contract_ref","cases_ref","red_ref","card_ref","write_exclusions"},
    "validation_binding":{"reviewer_source","read_manifest_ref","binding_state","blockers","repair_state"},
    "final_receipt":{"receipt_verdict","closeout_ref","reconciliation_ref","non_goals","unproved_claims"},
}


def _sha(path:Path)->str:
    return hashlib.sha256(path.read_bytes()).hexdigest()


def _valid_timestamp(value:Any)->bool:
    if not isinstance(value,str) or not value.endswith("Z"):
        return False
    try:
        datetime.fromisoformat(value[:-1]+"+00:00")
        return True
    except ValueError:
        return False


def evaluate_case(payload: dict[str,Any])->dict[str,Any]:
    categories=payload.get("visible_checkpoint_categories")
    if not isinstance(categories,list): raise ValueError("CHECKPOINT_CATEGORIES_INVALID")
    return {"schema_version":SCHEMA_VERSION,"complete":set(categories)==set(CATEGORIES) and len(categories)==len(CATEGORIES),"verbatim_template_required":False}


def validate_series(payload: dict[str,Any],repo:Path|None=None)->dict[str,Any]:
    events=payload.get("events",[])
    failures=[]; seen=[]; orders=[]
    for event in events:
        required={"schema_version","task_id","session_id","category","observed_state","payload","evidence_refs","reader_explanation_zh","timestamp","order"}
        if not required.issubset(event) or event.get("schema_version")!=SCHEMA_VERSION: failures.append("event_shape_invalid"); continue
        cat=event["category"]; seen.append(cat); orders.append(event["order"])
        explanation=event.get("reader_explanation_zh","")
        typed=event.get("payload")
        if cat not in CATEGORIES or not event["evidence_refs"] or not isinstance(explanation,str) or len(explanation.strip())<8 or not any("\u4e00"<=ch<="\u9fff" for ch in explanation): failures.append(f"event_invalid:{cat}")
        if cat in CATEGORIES and event.get("observed_state") not in OBSERVED_STATES[cat]: failures.append(f"observed_state_invalid:{cat}")
        if cat in CATEGORIES and (not isinstance(typed,dict) or not PAYLOAD_FIELDS[cat].issubset(typed) or any(value in (None,"",[]) for value in typed.values() if not isinstance(value,bool))): failures.append(f"typed_payload_invalid:{cat}")
        if not _valid_timestamp(event.get("timestamp")): failures.append(f"timestamp_invalid:{cat}")
        if repo:
            for ref in event["evidence_refs"]:
                raw=ref.get("path",""); path=repo/raw
                if not raw or Path(raw).is_absolute() or ".." in Path(raw).parts or not path.is_file(): failures.append(f"dangling_ref:{cat}")
                elif ref.get("sha256") != _sha(path): failures.append(f"ref_identity_invalid:{cat}")
    if seen!=list(CATEGORIES): failures.append("category_order_or_completeness_invalid")
    if orders!=sorted(orders) or len(orders)!=len(set(orders)): failures.append("event_order_invalid")
    if seen==list(CATEGORIES):
        binding=events[3].get("payload",{}).get("binding_state")
        receipt=events[4].get("payload",{}).get("receipt_verdict")
        if receipt=="pass" and binding!="final_state_bound": failures.append("receipt_lifecycle_mismatch")
    return {"schema_version":"checkpoint_series_v1","complete":not failures,"verbatim_template_required":False,"failures":failures,"categories":seen}


def render(payload:dict[str,Any])->str:
    result=validate_series(payload)
    if not result["complete"]: raise ValueError("CHECKPOINT_SERIES_INVALID:"+",".join(result["failures"]))
    lines=["# 受治理执行 Checkpoints",""]
    for event in payload["events"]:
        lines.extend([f"## {event['order']}. {event['category']}","",event["reader_explanation_zh"],"",f"观察状态：`{event['observed_state']}`。证据引用："+", ".join(ref["path"] for ref in event["evidence_refs"])+"。",""])
    lines.append("这些 checkpoint 只证明对应时点的信息可定位，不替代独立 Validation 或最终完成判定。")
    return "\n".join(lines)+"\n"


def main()->int:
    p=argparse.ArgumentParser(); sub=p.add_subparsers(dest="command",required=True)
    for name in ("validate-series","render"):
        cmd=sub.add_parser(name); cmd.add_argument("input"); cmd.add_argument("--repo",default=".")
    a=p.parse_args()
    try:
        data=json.load(sys.stdin) if a.input=="-" else json.loads(Path(a.input).read_text(encoding="utf-8"))
        if a.command=="render": print(render(data),end=""); return 0
        result=validate_series(data,Path(a.repo).resolve()); print(json.dumps(result,ensure_ascii=False,indent=2)); return 0 if result["complete"] else 1
    except (OSError,json.JSONDecodeError,ValueError) as exc:
        print(json.dumps({"complete":False,"fingerprint":str(exc)},ensure_ascii=False)); return 1


if __name__=="__main__": raise SystemExit(main())
