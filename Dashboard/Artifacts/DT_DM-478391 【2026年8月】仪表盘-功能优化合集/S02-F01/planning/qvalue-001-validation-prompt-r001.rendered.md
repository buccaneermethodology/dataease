Lane Task Card: Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/planning/qvalue-001-validation-card-r001.json
Card SHA-256: b045975893a124ac47adb04825f990c3b2a496d9a9dcf722443bc951e86068c0
Verify: python3 .codex/skills/sge-governed-checkpoints-sp010/scripts/lane_task_card.py validate Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/planning/qvalue-001-validation-card-r001.json --repo . --expected-card-sha256 b045975893a124ac47adb04825f990c3b2a496d9a9dcf722443bc951e86068c0
Lane: validation | Session: S02.1 | Role: validation
Mode: full_baseline
Working directory: .
Execute: 执行 SP010 validation-agent guardrail。只读核对用户原始意图、Goal原始AC/16义务、设计与review、卡/Context/准入摘要、实现与冻结用例、完整限定差异及RED/GREEN/lint原始证据；独立重算全部17项和数组隔离/拒绝语义，检查越界及遗留权限NOT_RUN。先出中文任务理解和Read Manifest，再分阻断/非阻断/findings/修复要求/verdict。只写指定报告，不修Builder文件。只允许QVALUE-001有界通过，绝不可判定完整S02完成。 阅读清单还必须核对 CoverageMatrix、Sessions、PreparationStatus、DevelopmentHandoff、SGC-and-Scope、当前实际Topology，并将缺失的OPCM/Scope Delta/closeout正式证据作为完整性finding，不可假设不存在。
