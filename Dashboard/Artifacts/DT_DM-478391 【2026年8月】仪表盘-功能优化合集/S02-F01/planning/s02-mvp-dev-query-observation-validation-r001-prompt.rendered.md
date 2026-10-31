Lane Task Card: Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/planning/s02-mvp-dev-query-observation-validation-r001-card.json
Card SHA-256: 763f171b4d444f94eab09afb239f5aedaf20243c9a71e484e71bac57ed4a8639
Verify: python3 .codex/skills/sge-governed-checkpoints-sp010/scripts/lane_task_card.py validate Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/planning/s02-mvp-dev-query-observation-validation-r001-card.json --repo . --expected-card-sha256 763f171b4d444f94eab09afb239f5aedaf20243c9a71e484e71bac57ed4a8639
Lane: validation | Session: DE-S02-F01 | Role: validation
Mode: full_baseline
Working directory: .
Execute: 复验卡与输入摘要；在作者冻结源码上重跑paste20/A14/定向lint及前后文件SHA。完整审5路径前后diff：显式DEV flag false/production零采集；只记录最小请求及完整data不得含token/HMAC/代理等敏感上下文；仅记录一次逻辑getData而非物理HTTP；target/opId关联与外层timeout、前置拒绝/取消/static零调用、stale和session invalidation清除；克隆隔离、订阅及任何异常不改变业务成功失败、时序、权限或存储。独立补测同类空对象/过时及交错场景，结果细分发现/无问题/未查/残余/修后预测；不写源码/runner，单独交付物第1/3轮。真实UI由root运行，不能自报用户验收。
