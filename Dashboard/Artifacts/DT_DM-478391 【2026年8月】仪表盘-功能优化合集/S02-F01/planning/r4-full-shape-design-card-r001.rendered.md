Lane Task Card: Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/planning/r4-full-shape-design-card-r001.json
Card SHA-256: efb76498cad3b962bcd5699396fe719340c6975afff455fbc668cadcc76c1bc5
Verify: python3 .codex/skills/sge-governed-checkpoints-sp010/scripts/lane_task_card.py validate Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/planning/r4-full-shape-design-card-r001.json --repo . --expected-card-sha256 efb76498cad3b962bcd5699396fe719340c6975afff455fbc668cadcc76c1bc5
Lane: s02_f01_r4_full_shape_design | Session: S02.1 | Role: design
Mode: delta
Working directory: .
Execute: 只读取卡片/Context限定的当前V3代码与设计来源，产出全形态Query Product Adapter责任矩阵设计及candidate Cases。逐项处置Review r003的R4-01..09，列明source path/字段、shape与version、KEEP/REBIND/RESET/REMOVE/NOT_READY、来源阶段、runtime隔离、未知字段与历史缺省策略、跨数据集/cascade/参数闭包、原子失败和副作用oracle、fixture及Goal AC映射。不得把NOT_READY改成永久unsupported，不得猜测权限或业务策略；未证据化的语义列出具体待裁决/待来源项。Cases保持candidate/frozen_for_builder=false、无运行结果/验收证据；不改源码、Goal、CoverageMatrix、原Cases或任何产品入口。保留10/26/16及Scope Delta none。
