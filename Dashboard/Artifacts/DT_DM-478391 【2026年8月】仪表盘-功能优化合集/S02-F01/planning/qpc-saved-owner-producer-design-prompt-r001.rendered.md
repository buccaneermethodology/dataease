Lane Task Card: Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/planning/qpc-saved-owner-producer-design-card-r001.json
Card SHA-256: a16ccc18ad667b6ce6ebd483b701726e88ffbfc485c0b6d574e217b6fa87007e
Verify: python3 .codex/skills/sge-governed-checkpoints-sp010/scripts/lane_task_card.py validate Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/planning/qpc-saved-owner-producer-design-card-r001.json --repo . --expected-card-sha256 a16ccc18ad667b6ce6ebd483b701726e88ffbfc485c0b6d574e217b6fa87007e
Lane: qpc_saved_owner_producer_design | Session: DE-S02-F01 | Role: design
Mode: delta
Working directory: .
Execute: 基于readset设计 saved Dashboard owner producer。明确标准已保存编辑、cache恢复、copy-as-new、模板新建、普通新建的不同路径和允许状态；为资源 ID 三方一致、Store发布完成、canvas/root/raw target唯一性定义绑定条件；区分页面卸载/资源重载/主体组织变更的失效触发；给出授权provider缺失下source-read和target-commit的禁止门槛、完整成功/拒绝oracle、实现梯级和下一Session。不得假定setter原子、不得把QSSDH代次当主体/授权、不改Cases/源码。输出仅指定Design候选，随后需独立语义复核。
