Lane Task Card: Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/planning/s02-mvp-c4-harness-delta-r001-card.json
Card SHA-256: 68dfe6ceccc1d06a9772b53cf80afa88f11542ecbd468c12be4b14c628b7b346
Verify: python3 .codex/skills/sge-governed-checkpoints-sp010/scripts/lane_task_card.py validate Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/planning/s02-mvp-c4-harness-delta-r001-card.json --repo . --expected-card-sha256 68dfe6ceccc1d06a9772b53cf80afa88f11542ecbd468c12be4b14c628b7b346
Lane: builder | Session: DE-S02-F01 | Role: builder
Mode: full_baseline
Working directory: .
Execute: 复验卡/admission，更新当前paste/check.mjs的精确providers和已扩支持分支。原未接map恢复legacy分派测试改为实际仍不支持plugin/unknown，保留拒绝/旧路径兼容的原目的；新增picture OFF/ON、rich/map请求adapter/metadata/基础设施拒绝，测试不改冻结C1快照或旧独立报告。保持原C1全部行为断言，不把改预期当新实现通过。按第三轮既有fixture身份，不自选新contract值；报告cases数量与层级，非真实地图/Tiny/图片/后端/save验收。
