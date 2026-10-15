# 需求型 KB 真源

需求型规范知识采用独立于 `kb/data/*.json` 静态实现知识的 schema，避免把产品需求描述误标为代码事实。

- 真源：[`DT_DM-478391.v1.json`](DT_DM-478391.v1.json)
- 阅读投影：[`../generated/dashboard-requirements-DT_DM-478391-v1.md`](../generated/dashboard-requirements-DT_DM-478391-v1.md)
- 合同：[`../schema/requirement-baseline-v1.schema.json`](../schema/requirement-baseline-v1.schema.json)
- 渲染与校验：[`../tools/render_requirement_kb.py`](../tools/render_requirement_kb.py)

在仓库根目录运行 `python3 kb/tools/render_requirement_kb.py validate`、`render`、`check-render`。只编辑 JSON 真源，随后生成 Markdown；不要手工编辑投影。新的决策应增加版本和变更记录，保留旧值及其被替代关系。原始需求资料中未被权威决策源采纳的建议仍为待裁事项。
