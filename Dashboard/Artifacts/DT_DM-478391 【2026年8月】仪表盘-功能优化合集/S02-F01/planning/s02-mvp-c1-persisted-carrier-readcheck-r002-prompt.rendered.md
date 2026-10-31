Lane Task Card: Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/planning/s02-mvp-c1-persisted-carrier-readcheck-r002-card.json
Card SHA-256: c8148615803c618112e4ecacd32f25bd4b27fb0da99a9097773491dae121cfac
Verify: python3 .codex/skills/sge-governed-checkpoints-sp010/scripts/lane_task_card.py validate Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/planning/s02-mvp-c1-persisted-carrier-readcheck-r002-card.json --repo . --expected-card-sha256 c8148615803c618112e4ecacd32f25bd4b27fb0da99a9097773491dae121cfac
Lane: validation | Session: DE-S02-F01 | Role: validation
Mode: full_baseline
Working directory: .
Execute: 扩读实际save->updateCanvas->saveChartViewFromVisualization->ChartViewManege.save的snapshot repository；只读三个测试chart在published与draft两表的过滤，普通保存按snapshot三树应相等。初探published失配记录为错误carrier假设，未正常发布故不要求published更新；不改变Goal或执行发布。只写原尚未生成的UiC1PersistedDbCheck-r001.json，若断言失败仍记录实测且不写pass。
