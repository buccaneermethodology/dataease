#!/usr/bin/env python3
"""Deterministic default-read, conditional-reread and gate coverage measurement."""
from __future__ import annotations

import argparse
import hashlib
import json
import re
from pathlib import Path
from typing import Any

SCHEMA_VERSION="context_measurement_v1"


def evaluate_case(payload:dict[str,Any])->dict[str,Any]:
    reduced=payload.get("injected_bytes_reduced") is True
    reread=payload.get("conditional_reread_increased") is True
    coverage=payload.get("coverage_state")
    return {"schema_version":SCHEMA_VERSION,"material_improvement":bool(reduced and not reread and coverage=="preserved")}


def _sha(path:Path)->str: return hashlib.sha256(path.read_bytes()).hexdigest()


def _norm(value:str)->str:
    return re.sub(r"[^a-z0-9]+","",value.casefold())


def _coverage_errors(manifest:dict[str,Any],repo:Path,kernel_text:str)->list[str]:
    errors=[]
    table_rows={}
    for line in kernel_text.splitlines():
        if re.match(r"^\|\s*G\d{2}\s*\|",line):
            cells=[cell.strip().strip("`") for cell in line.strip().strip("|").split("|")]
            if cells:
                table_rows[cells[0]]=cells
    recipe_texts={}
    for row in manifest.get("coverage",[]):
        gate_id=row.get("id")
        for key in ("kernel_anchor","recipe","trigger","kernel_trigger_terms"):
            if not row.get(key): errors.append(f"COVERAGE_MAPPING_MISSING:{gate_id}:{key}")
        cells=table_rows.get(gate_id)
        if not cells or len(cells)<4:
            errors.append(f"KERNEL_STRUCTURAL_ROW_MISSING:{gate_id}")
        else:
            gate_terms=[_norm(term) for term in re.findall(r"[A-Za-z0-9]+",str(row.get("gate",""))) if term.casefold() not in {"and","v1"}]
            if gate_terms and not all(term in _norm(cells[1]) for term in gate_terms):
                errors.append(f"KERNEL_GATE_IDENTITY_MISMATCH:{gate_id}")
            recipe_route=str(row.get("kernel_recipe_route",Path(str(row.get("recipe",""))).name))
            if recipe_route not in cells[3]: errors.append(f"KERNEL_RECIPE_ROUTE_MISMATCH:{gate_id}")
            row_text=" ".join(cells)
            for term in row.get("kernel_trigger_terms",[]):
                if _norm(str(term)) not in _norm(row_text): errors.append(f"KERNEL_TRIGGER_REMOVED:{gate_id}:{term}")
        recipe=repo/str(row.get("recipe",""))
        if not recipe.is_file(): recipe=repo/".codex/skills/sge-governed-checkpoints-sp010"/str(row.get("recipe",""))
        if not recipe.is_file():
            errors.append(f"RECIPE_PATH_MISSING:{gate_id}")
        else:
            text=recipe.read_text(encoding="utf-8")
            recipe_texts[str(recipe.resolve())]=text
            if len(text.strip())<100 or not re.search(r"(?m)^1\.\s",text): errors.append(f"RECIPE_NOT_EXECUTABLE:{gate_id}")
    fallback=str(manifest.get("fallback",""))
    if not fallback or not all(term in fallback.casefold() for term in ("unknown","expand","rebaseline")):
        errors.append("FALLBACK_IDENTITY_INVALID")
    default_reads={raw for fixture in manifest.get("fixtures",[]) for raw in fixture.get("default_reads",[])}
    for raw in default_reads:
        if "/recipes/" in raw:
            path=(repo/raw).resolve()
            text=recipe_texts.get(str(path),"")
            if re.search(r"(?:must|required|default).{0,40}SKILL\.md",text,re.IGNORECASE):
                errors.append(f"DEFAULT_READ_CYCLE:{raw}")
    return errors


def measure(manifest:dict[str,Any],repo:Path,repeat_count:int=3,kernel_override:str|None=None)->dict[str,Any]:
    gates=manifest.get("coverage",[]); ids=[row.get("id") for row in gates]
    expected=[f"G{i:02d}" for i in range(1,13)]
    errors=[]
    if ids!=expected: errors.append("COVERAGE_DENOMINATOR_INVALID")
    kernel_path = repo / (kernel_override or ".codex/skills/sge-governed-checkpoints-sp010/SKILL.md")
    kernel_text = kernel_path.read_text(encoding="utf-8") if kernel_path.is_file() else ""
    errors.extend(_coverage_errors(manifest,repo,kernel_text))
    fixtures=[]
    for fixture in manifest.get("fixtures",[]):
        required=fixture.get("default_reads",[]); conditional=fixture.get("conditional_reads",[])
        if len(required)!=len(set(required)) or set(required)&set(conditional): errors.append(f"READ_SET_INVALID:{fixture.get('fixture_id')}")
        rows=[]
        for _ in range(repeat_count):
            sizes=[]
            for raw in required:
                if kernel_override and raw == ".codex/skills/sge-governed-checkpoints-sp010/SKILL.md":
                    raw = kernel_override
                path=repo/raw
                if not path.is_file(): errors.append(f"READ_PATH_MISSING:{raw}"); continue
                sizes.append({"path":raw,"bytes":len(path.read_bytes()),"sha256":_sha(path)})
            rows.append({"required_bytes":sum(row["bytes"] for row in sizes),"required_reads":len(sizes),"surfaces":sizes})
        totals=[row["required_bytes"] for row in rows]; noise=max(totals)-min(totals) if totals else 0
        cond_sizes=[]
        for raw in conditional:
            path=repo/raw
            if not path.is_file(): errors.append(f"CONDITIONAL_PATH_MISSING:{raw}"); continue
            cond_sizes.append({"path":raw,"bytes":len(path.read_bytes()),"sha256":_sha(path)})
        current=totals[0] if totals else 0
        baseline=fixture.get("baseline_bytes",0); cond_total=sum(row["bytes"] for row in cond_sizes)
        coverage_ids=fixture.get("coverage_ids",[]); coverage_preserved=set(coverage_ids)==set(expected)
        improved=(current < baseline and baseline-current>noise and current+cond_total<baseline and coverage_preserved)
        fixtures.append({"fixture_id":fixture.get("fixture_id"),"repeat_measurements":rows,"measurement_noise_bytes":noise,"before_bytes":baseline,"after_bytes":current,"delta_bytes":current-baseline,"before_default_reads":fixture.get("baseline_default_reads",3),"after_default_reads":len(required),"conditional_reread_bytes":cond_total,"conditional_reread_count":len(cond_sizes),"coverage_state":"preserved" if coverage_preserved else "regressed","coverage_ids":coverage_ids,"material_improvement":improved,"derived_token_estimate":current/4})
    return {"schema_version":SCHEMA_VERSION,"manifest_revision":manifest.get("revision"),"repeat_count":repeat_count,"coverage_denominator":expected,"fixtures":fixtures,"errors":errors,"verdict":"pass" if not errors and fixtures and all(row["material_improvement"] for row in fixtures) else "fail","claim_boundary":"UTF-8 bytes/4 is a derived comparison metric, not provider token usage or billing"}


def compare(report:dict[str,Any])->dict[str,Any]:
    return {"schema_version":SCHEMA_VERSION,"material_improvement":report.get("verdict")=="pass","fixtures":[{"fixture_id":x.get("fixture_id"),"material_improvement":x.get("material_improvement"),"coverage_state":x.get("coverage_state"),"delta_bytes":x.get("delta_bytes"),"conditional_reread_bytes":x.get("conditional_reread_bytes")} for x in report.get("fixtures",[])],"claim_boundary":report.get("claim_boundary")}


def main()->int:
    p=argparse.ArgumentParser(); sub=p.add_subparsers(dest="command",required=True)
    m=sub.add_parser("measure"); m.add_argument("manifest"); m.add_argument("--repo",default="."); m.add_argument("--repeat",type=int,default=3); m.add_argument("--kernel-override")
    c=sub.add_parser("compare"); c.add_argument("report")
    a=p.parse_args()
    try:
        data=json.loads(Path(a.manifest if a.command=="measure" else a.report).read_text(encoding="utf-8"))
        result=measure(data,Path(a.repo).resolve(),a.repeat,a.kernel_override) if a.command=="measure" else compare(data)
        print(json.dumps(result,ensure_ascii=False,indent=2,sort_keys=True)); return 0 if result.get("verdict", "pass" if result.get("material_improvement") else "fail")=="pass" else 1
    except (OSError,json.JSONDecodeError,ValueError) as exc:
        print(json.dumps({"verdict":"fail","fingerprint":str(exc)},ensure_ascii=False)); return 1


if __name__=="__main__": raise SystemExit(main())
