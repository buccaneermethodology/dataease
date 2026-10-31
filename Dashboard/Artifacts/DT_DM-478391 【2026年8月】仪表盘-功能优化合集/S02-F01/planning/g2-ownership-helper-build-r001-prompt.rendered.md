Lane Task Card: Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/planning/g2-ownership-helper-build-r001-card.json
Card SHA-256: 122e324b4a271c66c18e6824a071d9f4d46813e49528be9b34c891e147ed2556
Verify: python3 .codex/skills/sge-governed-checkpoints-sp010/scripts/lane_task_card.py validate Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/planning/g2-ownership-helper-build-r001-card.json --repo . --expected-card-sha256 122e324b4a271c66c18e6824a071d9f4d46813e49528be9b34c891e147ed2556
Lane: builder | Session: DE-S02-F01 | Role: builder
Mode: full_baseline
Working directory: .
Execute: 复验Card/Context并消费本stem admission-0 source/-1 evidence。只有RED独立Validation-r002准入通过才实现。严格按Design r003实现createG2RenderAttempt及必要错误class/types：只管理已返回实例/已登记同步cleanup；每个await及setup后current检查；显式empty；逆序幂等reentrant cleanup；replace/remove返回逐通道error且按合同唯一通知；失败保留originalError/cause原引用，通知抛错不能盖业务异常；意外undefined精确missing码。不得抄runner作为实现或硬编码caseID；不改runner。执行23同身份GREEN、self-test-oracle、定向ESLint、生产TS bundle编译及git diff --check，持久化GREEN原始日志/exitcode和摘要及Build报告。G2OWN-027保持OPEN，不把helper完成当UI完成。
