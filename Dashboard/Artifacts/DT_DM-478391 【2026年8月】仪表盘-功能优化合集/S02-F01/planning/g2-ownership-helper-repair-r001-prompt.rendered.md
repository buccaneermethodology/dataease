Lane Task Card: Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/planning/g2-ownership-helper-repair-r001-card.json
Card SHA-256: 1a29d4099f47b0d4ad634aac9565156bb8d4b837ac90d8f44fc18121c6f9d91d
Verify: python3 .codex/skills/sge-governed-checkpoints-sp010/scripts/lane_task_card.py validate Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/planning/g2-ownership-helper-repair-r001-card.json --repo . --expected-card-sha256 1a29d4099f47b0d4ad634aac9565156bb8d4b837ac90d8f44fc18121c6f9d91d
Lane: builder | Session: DE-S02-F01 | Role: builder
Mode: full_baseline
Working directory: .
Execute: 复验Card/Context及source/-test/-evidence精确admission。先备份当前source原字节到before.ts.txt。新建独立supplemental reentrant-replace-check.mjs，真实esbuild导入生产helper，不改冻结23case或旧runner。复现old cleanup在相同key内登记inner，然后外层替换outer，inner必须正好一次清理且outer最终dispose一次；同时覆盖inner清理抛原对象错误可观察、至少两层nested登记及close/dispose重入。先对当前source运行可信断言RED保存原始三件证据，再窄修replace同key处理，不能把新登记cleanup无清理覆盖；按现有合同每项仍可见且errors有出口。新回归GREEN、原23GREEN、oracle selftests、定向lint/严格tsc和diff check；保存GREEN日志/新source和所有input摘要/补丁说明。失败不改Cases/Design或expected。不得用生产caseID硬编码。
