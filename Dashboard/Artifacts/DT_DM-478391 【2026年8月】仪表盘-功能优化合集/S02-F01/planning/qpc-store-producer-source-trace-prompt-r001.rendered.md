Lane Task Card: Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/planning/qpc-store-producer-source-trace-card-r001.json
Card SHA-256: f28a378cf47c019847f2d0d5b3886ab5cd7ebe6a19c264f4d652052187d3a6f8
Verify: python3 .codex/skills/sge-governed-checkpoints-sp010/scripts/lane_task_card.py validate Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/planning/qpc-store-producer-source-trace-card-r001.json --repo . --expected-card-sha256 f28a378cf47c019847f2d0d5b3886ab5cd7ebe6a19c264f4d652052187d3a6f8
Lane: qpc_store_producer_source_trace | Session: DE-S02-F01 | Role: design
Mode: delta
Working directory: .
Execute: 按冻结读集只读追踪 dashboard Store saved context 的实际来源、dashboard load 与 setComponentData/setCanvasViewInfo/updateCurDvInfo 发布顺序、缓存恢复/模板/copy分支、canvas和Q-VQuery组件消费、raw/proxy身份、卸载/资源切换失效。逐项给文件行号和状态，区分source fact/unknown/runtime not observed。只输出一份 trace；不得修改代码、测试、Design/Cases或执行产品运行。
