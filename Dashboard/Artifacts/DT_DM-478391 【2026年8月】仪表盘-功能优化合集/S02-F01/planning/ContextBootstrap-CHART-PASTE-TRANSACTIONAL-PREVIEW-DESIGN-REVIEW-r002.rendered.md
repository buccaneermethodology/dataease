# Context Bootstrap: S02-F01-CHART-PASTE-TRANSACTIONAL-PREVIEW-DESIGN-REVIEW-r002

Task profile: read_only
Raw intent authority: 对事务式图表过滤预览/提交 Design 与 Cases r002 做第2轮独立全量Review；核对 r001 的 CTPR-001..003 是否全部解决，以及所有原始 AC、当前实现调用链、纯模型边界和未决权限限制。一次列齐全量 finding，分别给合同冻结与纯模型 Builder Entry verdict，只写指定 review 报告。
Intake projection: 全量核对CTPR-001组件P0/错误态/预览发布失败、CTPR-002目标外写现态保留、CTPR-003取消与完整response tuple，并审查r002整体。
Maximum claim: 仅审查事务式预览/提交合同与纯模型 Builder 入场，不证明产品调用、UI、权限、保存重开或 Goal 完成。
Write scope: Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/reviews/ChartPasteTransactionalPreviewDesignReview-r002.md

## Required Read Set
- .codex/skills/sge-governed-checkpoints-sp010/SKILL.md@b3e5d00193f88608e8deb3214071444ce89fa66431daf115b35f72fedbecbe3f — S02-F01-CHART-PASTE-TRANSACTIONAL-PREVIEW-DESIGN-REVIEW-r001; 审查事务式预览候选合同、原始 AC、当前实际调用链与权限边界。
- AGENTS.md@270940a30f462f2fb0c9a8cf2bbc1dd11750513d8f063ffc376e0e0a2640466e — S02-F01-CHART-PASTE-TRANSACTIONAL-PREVIEW-DESIGN-REVIEW-r001; 审查事务式预览候选合同、原始 AC、当前实际调用链与权限边界。
- Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/Goal.final.json@28c94d3c35d4ce0a891ce77ecc915932d67f88ef813f3d2815dc0dce11f91b64 — S02-F01-CHART-PASTE-TRANSACTIONAL-PREVIEW-DESIGN-REVIEW-r001; 审查事务式预览候选合同、原始 AC、当前实际调用链与权限边界。
- Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/SP-004/Resume-r004/AcceptanceCriteria.md@e07eba2e04340d2aecb97ab063bcbc4a9efe81d5026f30ea04fe1aee74f3cab0 — S02-F01-CHART-PASTE-TRANSACTIONAL-PREVIEW-DESIGN-REVIEW-r001; 审查事务式预览候选合同、原始 AC、当前实际调用链与权限边界。
- Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/reviews/ChartToChartFilterCopyProductSliceReview-r003.md@21000696bf62b6be2755e264c69ac7c905e7fc2818a764d867ff63c49a67b1b1 — S02-F01-CHART-PASTE-TRANSACTIONAL-PREVIEW-DESIGN-REVIEW-r001; 审查事务式预览候选合同、原始 AC、当前实际调用链与权限边界。
- Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/PermissionEnvironment.md@bf1498aa23f4f864e2c5c3d999b6b1a6044849ba25a9cd7d7d85104b6f233b9d — S02-F01-CHART-PASTE-TRANSACTIONAL-PREVIEW-DESIGN-REVIEW-r001; 审查事务式预览候选合同、原始 AC、当前实际调用链与权限边界。
- Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/SP-005/S02-S09_EntryPacket.md@4598a5d74567e1e1d3de81ce263909231dc054d8102535bc0d917238c412c658 — S02-F01-CHART-PASTE-TRANSACTIONAL-PREVIEW-DESIGN-REVIEW-r001; 审查事务式预览候选合同、原始 AC、当前实际调用链与权限边界。
- core/core-frontend/src/views/chart/components/editor/index.vue@0a8d78ffce297d941cd2d42c4240d0f266bac53926360d2bf83c6134a641f39d — S02-F01-CHART-PASTE-TRANSACTIONAL-PREVIEW-DESIGN-REVIEW-r001; 审查事务式预览候选合同、原始 AC、当前实际调用链与权限边界。
- core/core-frontend/src/views/chart/components/views/index.vue@2b0b1794737e35331a59569cd516078da898435e3f9c3db31d0287847240b1bd — S02-F01-CHART-PASTE-TRANSACTIONAL-PREVIEW-DESIGN-REVIEW-r001; 审查事务式预览候选合同、原始 AC、当前实际调用链与权限边界。
- core/core-frontend/src/views/chart/components/views/components/ChartComponentG2Plot.vue@e9429bf59915e5a23d4f9d70987b126ca8b8329863be3208c625367e71f607e5 — S02-F01-CHART-PASTE-TRANSACTIONAL-PREVIEW-DESIGN-REVIEW-r001; 审查事务式预览候选合同、原始 AC、当前实际调用链与权限边界。
- core/core-frontend/src/api/visualization/dataVisualization.ts@dc0a75b7a4abf308a41473de710c7d137b294c8b4915fe94f859744541cd4082 — S02-F01-CHART-PASTE-TRANSACTIONAL-PREVIEW-DESIGN-REVIEW-r001; 审查事务式预览候选合同、原始 AC、当前实际调用链与权限边界。
- core/core-frontend/src/api/chart.ts@6dbe0684c95f0c2be625a7a0094db894a0d431f003c8d7613145279dc3f218a7 — S02-F01-CHART-PASTE-TRANSACTIONAL-PREVIEW-DESIGN-REVIEW-r001; 审查事务式预览候选合同、原始 AC、当前实际调用链与权限边界。
- core/core-backend/src/main/java/io/dataease/chart/manage/ChartDataManage.java@eb99db6b91253147acd40bccea0c329eebf859e6dcf9df6d12f6aeeca2d8fcf6 — S02-F01-CHART-PASTE-TRANSACTIONAL-PREVIEW-DESIGN-REVIEW-r001; 审查事务式预览候选合同、原始 AC、当前实际调用链与权限边界。
- Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/ChartPasteTransactionalPreviewDesign-r002.md@0a86c3ca6f642ffb027b1b295fdbe493a4d7317a8e54e5b70bd47f1c2f9aef1d — S02-F01-CHART-PASTE-TRANSACTIONAL-PREVIEW-DESIGN-REVIEW-r002; 评估r001 findings和本轮candidate修订的完整性。
- Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/ChartPasteTransactionalPreviewCases-r002.json@24959d618a5a2ef2f0189576820e709f412be83f4ee48e88b6bbc5c22a9405ad — S02-F01-CHART-PASTE-TRANSACTIONAL-PREVIEW-DESIGN-REVIEW-r002; 评估r001 findings和本轮candidate修订的完整性。
- Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/reviews/ChartPasteTransactionalPreviewDesignReview-r001.md@dd7c45a6ab801a8d8570012bcd50324d54dcf0a9b9f0fc76e371bbf32dc62464 — S02-F01-CHART-PASTE-TRANSACTIONAL-PREVIEW-DESIGN-REVIEW-r002; 评估r001 findings和本轮candidate修订的完整性。

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
