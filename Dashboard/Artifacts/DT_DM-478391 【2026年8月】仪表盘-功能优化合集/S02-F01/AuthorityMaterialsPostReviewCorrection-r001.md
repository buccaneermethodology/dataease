# 权威材料包审查后更正记录

- Canonical artifact：`S02-F01-authority-materials-package`，评审预算已用完（3/3），未启动第4轮。
- 更正对象：[AuthorityMaterialsRequest-r003.md](AuthorityMaterialsRequest-r003.md)、[intake模板](planning/AuthorityMaterialIntakeTemplate-r003.json)。
- 原独立审查：[第3轮报告](reviews/AuthorityMaterialsRequestReview-r003.md)，该报告绑定更正前快照，结论 `NEEDS_REVISION`，保持不变。
- 本次修正：将即时预览及拒绝成功反馈定位到 Goal `/must_have_ledger/20/requirement`（AC-F01-Q014）；服务端权限定位到 `/must_have_ledger/22/requirement`（AC-F01-ORIG-01）；统一 MD/JSON 对未决规则的表述；区分历史准备 Context 与当前审查 Context；把 candidate preview 引用改为真实章节锚点及可搜索原文。
- 静态自检：Goal SHA-256 `f562da2eb14b84dc8083e138dd2eb8718a58041f01d08163eddf5fb2c71daef0`；相关 JSON Pointer 均可解析并命中对应 `requirement_id`；JSON 可解析。
- 声明边界：上述为审查后定向更正，**未独立复核**；不得引用第3轮报告作为更正后字节的 review。权限模块/隔离环境、S01 条件与产品验证状态不变。
