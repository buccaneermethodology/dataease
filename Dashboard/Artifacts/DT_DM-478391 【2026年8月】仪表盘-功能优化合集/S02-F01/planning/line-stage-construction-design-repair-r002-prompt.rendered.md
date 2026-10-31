Lane Task Card: Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/planning/line-stage-construction-design-repair-r002-card.json
Card SHA-256: a836fb68d93e5bbbce555a2de514d13880bbde47764f65f2a29cd1ac5937d8fe
Verify: python3 .codex/skills/sge-governed-checkpoints-sp010/scripts/lane_task_card.py validate Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/planning/line-stage-construction-design-repair-r002-card.json --repo . --expected-card-sha256 a836fb68d93e5bbbce555a2de514d13880bbde47764f65f2a29cd1ac5937d8fe
Lane: design | Session: DE-S02-F01 | Role: design
Mode: full_baseline
Working directory: .
Execute: 复验Card/Context，读取完整首轮Review和真实Carousel源码；仅新增r002 Design/Cases。一次修LSCD-001：bar/mix真实健康start产生160ms nextItem，明确实际ledger、句柄、释放先后、registry，不设置私有firstFrameReady跳过。LSCD-002：LSC037/038/040/052/053明确所有owner的constructed/started/paused/destroyed/cache身份、初始startQueue顺序、TQ取得者/句柄/clock，038固定旧TQ+新C排队或无TQ即时启动一个真实流程；重入独立Chart/host/wrapper/observer身份完整，断言新owner queue/timer/cache/视觉。N001内部Error生成只做code+非包装或明确构造观察，不用caught反设expected自证。检查55例其它同类启动/timer/trace一次修齐；错误通道顺序、正常流程、10/26/16、原RED首fingerprint不变。文档写清r002是第2/3轮候选（首轮report保留），新增source refs绑定旧Review。自检完整Case身份、counts/trace/fields约束。不实现，不给生产准入；尽快返回两SHA及修订清单。
