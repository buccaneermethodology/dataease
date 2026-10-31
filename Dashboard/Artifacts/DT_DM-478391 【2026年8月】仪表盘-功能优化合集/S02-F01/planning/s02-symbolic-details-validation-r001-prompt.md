Lane Task Card: Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/planning/s02-symbolic-details-validation-r001-card.json
Card SHA-256: 8323a3401c4bcb09602bf045ee790060dd197e77ea7cc30f3aa0c0efb7664719
Verify: python3 .codex/skills/sge-governed-checkpoints/scripts/lane_task_card.py validate Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/planning/s02-symbolic-details-validation-r001-card.json --repo . --expected-card-sha256 8323a3401c4bcb09602bf045ee790060dd197e77ea7cc30f3aa0c0efb7664719
Lane: validation | Session: DE-EXEC-S038 | Role: validation
Mode: full_baseline
Working directory: .
Execute: 本backend实现首轮1/3独立验证，完整读取交接和源diff/冻结输入，核设计两项P1、11case独立oracle、来源seam和同identityRED/GREEN；独立/tmp重跑GREEN及精确beforeRED，允许临时类编译/H2内存，不启动Spring/真实DB/UI，不改冻结/生产文件。复验no-filter/empty/三map占位/cross直接返回、恰一同组代表及聚合amount、输入不污染与SQL实际执行。可补有界独立负向probe，但不要替Builder修复；一次查全全部发现/无问题/未查原因/同类残余/准入预测，不首阻断返回。只写唯一报告。当前8100旧jar未加载修复，完整Maven/真实后端UI仍NOT_RUN；不得把合成row片段当真实鉴权或重开C2三轮预算。
