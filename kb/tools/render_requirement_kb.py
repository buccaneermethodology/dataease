#!/usr/bin/env python3
"""Validate and render the requirement-baseline JSON source to Markdown."""
from __future__ import annotations

import argparse
import hashlib
import json
import re
import sys
from datetime import date
from pathlib import Path
from typing import Any

ROOT = Path(__file__).resolve().parents[2]
SOURCE = ROOT / "kb/requirements/DT_DM-478391.v1.json"
OUTPUT = ROOT / "kb/generated/dashboard-requirements-DT_DM-478391-v1.md"
SCHEMA = ROOT / "kb/schema/requirement-baseline-v1.schema.json"


def sha256(path: Path) -> str:
    return hashlib.sha256(path.read_bytes()).hexdigest()


def validate(data: dict[str, Any]) -> list[str]:
    errors: list[str] = []
    try:
        import jsonschema  # type: ignore[import-not-found]
        jsonschema.validate(data, json.loads(SCHEMA.read_text(encoding="utf-8")))
    except ImportError:
        errors.append("依赖 jsonschema 未安装；不自动安装")
    except Exception as exc:  # schema validation diagnostics
        errors.append(f"schema 校验失败：{exc}")
    features = data.get("features", [])
    ids = [item.get("id") for item in features]
    if ids != [f"F{i:02}" for i in range(1, 9)]:
        errors.append("功能分母必须按顺序完整覆盖 F01–F08")
    coverage: set[int] = set(data.get("scope", {}).get("global_decision_ids", []))
    for feature in features:
        for decision in feature.get("decisions", []):
            coverage.update(decision.get("ids", []))
    expected = set(range(1, 157))
    if coverage != expected:
        errors.append(f"决策编号覆盖不完整：缺失={sorted(expected-coverage)}，越界={sorted(coverage-expected)}")
    if data.get("scope", {}).get("decision_id_coverage") != sorted(coverage):
        errors.append("decision_id_coverage 与逐项编号重算不一致")
    if data.get("scope", {}).get("decision_ids_missing_from_feature_bullets") != []:
        errors.append("Q01–Q156 决策覆盖存在遗漏")
    if data.get("implementation_status") != "not_assessed":
        errors.append("需求 KB 不得声明实现状态已核实")
    primary = ROOT / data.get("authority", {}).get("primary_source", "")
    if not primary.is_file():
        errors.append("权威需求源不存在")
    elif sha256(primary) != data.get("provenance", {}).get("primary_source_sha256"):
        errors.append("权威需求源摘要与 JSON provenance 不一致")
    for source in data.get("authority", {}).get("reference_sources", []):
        path = ROOT / source.get("path", "")
        if not path.is_file():
            errors.append(f"参考源不存在：{source.get('path')}")
        elif sha256(path) != source.get("sha256"):
            errors.append(f"参考源摘要不一致：{source.get('path')}")
    return errors


def render(data: dict[str, Any]) -> str:
    meta = data["metadata"]
    authority = data["authority"]
    lines = [
        f"# {data['title']}（{data['version']}）",
        "",
        "> 本页由 `kb/requirements/DT_DM-478391.v1.json` 生成。需求基线不表示产品实现或运行验收已验证。",
        "",
        "## 来源与权威边界",
        "",
        f"- 状态：`{data['status']}`；实现状态：`{data['implementation_status']}`。",
        f"- 范围：{meta['source_scope']}",
        f"- 权威来源：[{authority['primary_source']}](../../{authority['primary_source']})（Q01–Q156）。",
        f"- 冲突规则：{authority['conflict_rule']}",
        "- 参考来源：",
    ]
    for src in authority["reference_sources"]:
        lines.append(f"  - `{src['path']}`（{src['role']}；SHA-256 `{src['sha256']}`）。" + (f" {src['note']}" if src.get("note") else ""))
    global_ids = ", ".join(f"Q{x:02}" for x in data["scope"]["global_decision_ids"])
    lines += ["", "## 总体范围与边界", "", f"全局决策：{global_ids}。", "", data["cross_cutting_context"]["source_section_0"], ""]
    for feature in data["features"]:
        lines += [f"## {feature['id']}｜{feature['title']}", "", "### TSP 概要", "", feature["tsp"], "", "### 业务规则与功能决策", ""]
        for item in feature["decisions"]:
            if item["ids"]:
                source_lines = item["text"].splitlines()
                first_line = re.sub(r"^- \*\*Q[^*]+\*\*[：:]\s*", "", source_lines[0])
                lines.append(f"- **{', '.join(f'Q{x:02}' for x in item['ids'])}：** {first_line}")
                lines.extend(source_lines[1:])
            else:
                lines.extend(item["text"].splitlines())
        lines += ["", "### 验收条件", ""]
        lines.extend(feature["acceptance"])
        lines += ["", "### 待证与未裁定事项", ""]
        lines.extend(feature["open_items"])
        if feature["workflow"]:
            lines += ["", "### 业务流程图", "", feature["workflow"]]
        lines.append("")
    labels = [
        ("source_section_9", "原始需求附加事项与未裁定内容"),
        ("source_section_10", "技术验证与验收准备清单"),
        ("source_section_11", "决策索引与版本边界"),
    ]
    for key, title in labels:
        lines += [f"## {title}", "", data["cross_cutting_context"][key], ""]
    lines += ["## Provenance", "", f"- 真源版本：`{data['version']}`；更新日期：{meta['updated_at']}。", f"- 捕获基线：`{data['provenance']['repository_head_at_capture']}`。", f"- 权威源 SHA-256：`{data['provenance']['primary_source_sha256']}`。", "- 决策编号复核：Q01–Q156 全覆盖；Q157 不在本版本。", "", "## 变更记录", ""]
    for entry in data["change_log"]:
        lines.append(f"- **{entry['version']}（{entry['date']}）：** {entry['change']}" + (f"（替代 {entry['supersedes']}）" if entry.get("supersedes") else ""))
    lines += ["", "后续变更应先更新 JSON 真源和版本/替代关系，再重新生成本页。", ""]
    return "\n".join(lines)


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("command", choices=("validate", "render", "check-render"))
    args = parser.parse_args()
    try:
        data = json.loads(SOURCE.read_text(encoding="utf-8"))
        errors = validate(data)
        if errors:
            print(json.dumps({"verdict": "fail", "errors": errors}, ensure_ascii=False, indent=2))
            return 1
        if args.command == "validate":
            print(json.dumps({"verdict": "pass", "features": 8, "decision_ids": 156}, ensure_ascii=False))
            return 0
        rendered = render(data)
        if args.command == "render":
            OUTPUT.parent.mkdir(parents=True, exist_ok=True)
            OUTPUT.write_text(rendered, encoding="utf-8")
            print(OUTPUT)
            return 0
        if not OUTPUT.is_file() or OUTPUT.read_text(encoding="utf-8") != rendered:
            print(json.dumps({"verdict": "fail", "reason": "rendered_markdown_out_of_sync"}, ensure_ascii=False))
            return 1
        print(json.dumps({"verdict": "pass", "render_matches_source": True}, ensure_ascii=False))
        return 0
    except (OSError, json.JSONDecodeError, KeyError, TypeError) as exc:
        print(json.dumps({"verdict": "fail", "reason": str(exc)}, ensure_ascii=False))
        return 1


if __name__ == "__main__":
    raise SystemExit(main())
