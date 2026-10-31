# DE-REQ-001 收尾候选

## 交付范围

候选真源记录 DataEase 仪表盘 F01–F08、Q01–Q156，权威优先级、来源摘要、验收条目、开放事项、流程图与版本边界。JSON 是真源；Markdown 由专用 renderer 生成；KB README 增加阅读入口。产品实现状态标记为 `not_assessed`。

## 排除范围

未修改产品代码、API、数据库、运行配置或输入需求文件；未执行构建、部署、业务数据库访问或外部发布。Q157、跨功能冲突裁定、技术可行/性能、安全合规和产品验收均不在此候选的完成声明内。

## 验证证据

候选文件及 SHA-256 清单见 [candidate-manifest.json](evidence/candidate-manifest.json)；清单文件自身不包含在其文件摘要列表中。

- `python3 -m py_compile kb/tools/render_requirement_kb.py`：语法检查通过。
- `python3 kb/tools/render_requirement_kb.py validate`：schema、来源摘要、8 个功能及 Q01–Q156 覆盖检查通过。
- `python3 kb/tools/render_requirement_kb.py render` 后 `check-render`：投影与 JSON 字节一致。
- [来源逐段对照记录](evidence/source-extraction-audit.json)证明 8 个功能的 TSP、决策、验收、开放项和流程图均与权威源抽取一致，且 Q01–Q156 编号覆盖无遗漏；该确定性对照不是独立语义审阅。
- 写入顺序偏差：首次 JSON 提取发生在 Goal/合同冻结前，也未先形成 execution admission。该偏差已如实记录；后续 schema、渲染、对照及收尾材料在 Goal 冻结后完成。未把治理顺序称为完全符合。
- [独立验收项抽取器调用记录](evidence/acceptance-extractor-check.json)：工具成功返回但抽取 0 条；因此不将其作为验收证据，也不据此改变需求分母。
- 尚未完成独立语义 Validation；本轮系统禁止创建子 Agent，执行者自检不能替代独立审阅。因此该结果仍是候选，不能声明最终 Goal 通过。

## 状态与下一步

实现候选已形成；独立审阅、完整 diff 冻结、最终 Stop Gate/只读读回尚未完成。下一步由独立 reviewer 检查原意、F01–F08/Q01–Q156 覆盖、来源冲突边界、JSON/投影和实际 diff；确认后再按 SGE closeout 更新终态。当前不声称 `GOAL_COMPLETE`。

