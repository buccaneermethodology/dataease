# Context Bootstrap: S02-F01-CHART-PASTE-TRANSACTIONAL-PREVIEW-DESIGN-REVIEW-r001

Task profile: read_only
Raw intent authority: 审阅事务式图表过滤预览/提交候选 Design 与 Cases r001。完整检查 Q014/Q009、当前 editor/query/render 调用链、权限门槛、并发迟到响应及纯状态模型边界；一次列齐 findings，分别给出合同冻结与纯模型 Builder 入口 verdict。只写指定 review 报告。
Intake projection: 以原 Goal/F01 AC 为权威，审查事务候选状态机、权限前置顺序、Q014失败原子性、stale request/target 身份和 Cases 可判定性。
Maximum claim: 仅审查事务式预览/提交合同与纯模型 Builder 入场，不证明产品调用、UI、权限、保存重开或 Goal 完成。
Write scope: Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/reviews/ChartPasteTransactionalPreviewDesignReview-r001.md

## Required Read Set
- .codex/skills/sge-governed-checkpoints-sp010/SKILL.md@b3e5d00193f88608e8deb3214071444ce89fa66431daf115b35f72fedbecbe3f — S02-F01-CHART-PASTE-TRANSACTIONAL-PREVIEW-DESIGN-REVIEW-r001; 审查事务式预览候选合同、原始 AC、当前实际调用链与权限边界。
- AGENTS.md@270940a30f462f2fb0c9a8cf2bbc1dd11750513d8f063ffc376e0e0a2640466e — S02-F01-CHART-PASTE-TRANSACTIONAL-PREVIEW-DESIGN-REVIEW-r001; 审查事务式预览候选合同、原始 AC、当前实际调用链与权限边界。
- Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/Goal.final.json@28c94d3c35d4ce0a891ce77ecc915932d67f88ef813f3d2815dc0dce11f91b64 — S02-F01-CHART-PASTE-TRANSACTIONAL-PREVIEW-DESIGN-REVIEW-r001; 审查事务式预览候选合同、原始 AC、当前实际调用链与权限边界。
- Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/SP-004/Resume-r004/AcceptanceCriteria.md@e07eba2e04340d2aecb97ab063bcbc4a9efe81d5026f30ea04fe1aee74f3cab0 — S02-F01-CHART-PASTE-TRANSACTIONAL-PREVIEW-DESIGN-REVIEW-r001; 审查事务式预览候选合同、原始 AC、当前实际调用链与权限边界。
- Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/ChartPasteTransactionalPreviewDesign-r001.md@e38f0fef537799af82ad2292256481d47661464f95a416140193be6e28d21648 — S02-F01-CHART-PASTE-TRANSACTIONAL-PREVIEW-DESIGN-REVIEW-r001; 审查事务式预览候选合同、原始 AC、当前实际调用链与权限边界。
- Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/ChartPasteTransactionalPreviewCases-r001.json@6acd9ca5bc6dd1bad314a26ed267941a46ef571cf3348c4b8fe141270b608ad0 — S02-F01-CHART-PASTE-TRANSACTIONAL-PREVIEW-DESIGN-REVIEW-r001; 审查事务式预览候选合同、原始 AC、当前实际调用链与权限边界。
- Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/reviews/ChartToChartFilterCopyProductSliceReview-r003.md@21000696bf62b6be2755e264c69ac7c905e7fc2818a764d867ff63c49a67b1b1 — S02-F01-CHART-PASTE-TRANSACTIONAL-PREVIEW-DESIGN-REVIEW-r001; 审查事务式预览候选合同、原始 AC、当前实际调用链与权限边界。
- Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/PermissionEnvironment.md@bf1498aa23f4f864e2c5c3d999b6b1a6044849ba25a9cd7d7d85104b6f233b9d — S02-F01-CHART-PASTE-TRANSACTIONAL-PREVIEW-DESIGN-REVIEW-r001; 审查事务式预览候选合同、原始 AC、当前实际调用链与权限边界。
- Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/SP-005/S02-S09_EntryPacket.md@4598a5d74567e1e1d3de81ce263909231dc054d8102535bc0d917238c412c658 — S02-F01-CHART-PASTE-TRANSACTIONAL-PREVIEW-DESIGN-REVIEW-r001; 审查事务式预览候选合同、原始 AC、当前实际调用链与权限边界。
- core/core-frontend/src/views/chart/components/editor/index.vue@0a8d78ffce297d941cd2d42c4240d0f266bac53926360d2bf83c6134a641f39d — S02-F01-CHART-PASTE-TRANSACTIONAL-PREVIEW-DESIGN-REVIEW-r001; 审查事务式预览候选合同、原始 AC、当前实际调用链与权限边界。
- core/core-frontend/src/views/chart/components/views/index.vue@2b0b1794737e35331a59569cd516078da898435e3f9c3db31d0287847240b1bd — S02-F01-CHART-PASTE-TRANSACTIONAL-PREVIEW-DESIGN-REVIEW-r001; 审查事务式预览候选合同、原始 AC、当前实际调用链与权限边界。
- core/core-frontend/src/views/chart/components/views/components/ChartComponentG2Plot.vue@e9429bf59915e5a23d4f9d70987b126ca8b8329863be3208c625367e71f607e5 — S02-F01-CHART-PASTE-TRANSACTIONAL-PREVIEW-DESIGN-REVIEW-r001; 审查事务式预览候选合同、原始 AC、当前实际调用链与权限边界。
- core/core-frontend/src/api/visualization/dataVisualization.ts@dc0a75b7a4abf308a41473de710c7d137b294c8b4915fe94f859744541cd4082 — S02-F01-CHART-PASTE-TRANSACTIONAL-PREVIEW-DESIGN-REVIEW-r001; 审查事务式预览候选合同、原始 AC、当前实际调用链与权限边界。
- core/core-frontend/src/api/chart.ts@6dbe0684c95f0c2be625a7a0094db894a0d431f003c8d7613145279dc3f218a7 — S02-F01-CHART-PASTE-TRANSACTIONAL-PREVIEW-DESIGN-REVIEW-r001; 审查事务式预览候选合同、原始 AC、当前实际调用链与权限边界。
- core/core-backend/src/main/java/io/dataease/chart/manage/ChartDataManage.java@eb99db6b91253147acd40bccea0c329eebf859e6dcf9df6d12f6aeeca2d8fcf6 — S02-F01-CHART-PASTE-TRANSACTIONAL-PREVIEW-DESIGN-REVIEW-r001; 审查事务式预览候选合同、原始 AC、当前实际调用链与权限边界。

## Conditional Read Set
- source-drift [deterministic]: 任一必读摘要变化 -> 停止评审并重建Context/Card。
- new-source-gap [evidence_backed_agent_evaluated]: 审查发现当前绑定读集不足以支持一个结论 -> 扩展读取精确的权威或源码证据，并在报告中限定结论。

## Semantic Refresh
- Required even when digest is unchanged: yes
- Anchors: objective, authority, claim_ceiling, critical_dependencies

## Epistemic Search Space
- Required domains: authority, scope, acceptance, implementation, identity, validation, dependency, claim_ceiling, topology
- Missing evidence: expand reads or report an evidence gap

## Topology
- single_independent_semantic_review (basis=change_impact): 独立审查事务式预览/提交候选合同与纯模型入口，只读。
