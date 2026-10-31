# SH-SELECT-TEXT 局部 validator harness Validation Handoff r001

## 目标与范围
只读独立复核 22 个 `LOCAL_VALIDATOR_ACCEPTS/REJECTS` case 的冻结副本、AST 提取的函数边界、完整 expected snapshot、真实 RED/GREEN、定向 lint/diff-check、完整当前 diff 及 claim ceiling。报告只能覆盖当前合同中的局部 validator 行为。

## 必读
- `Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/Goal.final.json`
- `Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/QueryProductAdapterSelectTextLocalValidatorHarnessContract-r001.json`
- `Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/QueryProductAdapterSelectTextSourceLegalCombinationsCases-r001.json`
- `Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/QueryProductAdapterSelectTextLegalCombinations-r001.md`
- `Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/reviews/QueryProductAdapterSelectTextLegalCombinationsDesignReview-r001.md`
- `Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/planning/evidence/SH-SELECT-TEXT-LOCAL-VALIDATOR-HARNESS-r001.md`
- `core/core-frontend/tests/filter-copy-query-select-text-source/validator-harness.mjs` 与其源码 `QueryConditionConfiguration.vue`
- `PermissionEnvironment.md`、`SP-005/S02-S09_EntryPacket.md`、`planning/Topology-actual-r296.json`、当前完整相关 diff。

## 验证要求
独立重算文件摘要、22 个唯一 case identity、输入/期望快照及别名恢复；复跑同一 runner、定向 ESLint 和 diff-check；审计 RED 是否对同一 identity 命中断言、有没有导入整个 Vue 模块或超出 runner 范围。分类仍须保留为局部 validator 接受/拒绝；6 个 NOT_READY、13 个来源阶段观察不在本 runner 覆盖中。

## 禁止
不得修改 Builder 产物或候选 Cases；不得将 runner 结果称为产品合法性、Goal AC 通过、真实权限验证或 Goal 完成。S01 F01 CONDITIONAL 与真实权限 BLOCKED / NOT_RUN 必须保留。若发现 finding，只写报告并提出具体处置，保持只读。
