Lane Task Card: Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/planning/qsingle-default-copy-001-builder-card-r001.json
Card SHA-256: 84f29fa838b43583515139dd53dbac51dd6d7af3461d6634070b88dffe9709fb
Verify: python3 .codex/skills/sge-governed-checkpoints-sp010/scripts/lane_task_card.py validate Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/planning/qsingle-default-copy-001-builder-card-r001.json --repo . --expected-card-sha256 84f29fa838b43583515139dd53dbac51dd6d7af3461d6634070b88dffe9709fb
Lane: builder | Session: S02.1 | Role: builder
Mode: full_baseline
Working directory: .
Execute: 先接收端复验card/context以及 execution_admission action=builder、target=精确源模块路径。按通过复审的r003 Design/Fixtures实现独立新纯函数；不得调用、修改或包装无默认候选QSINGLE模块。实现必须精确校验支持shape和错误优先级，除 condition.id/checkedFields/checkedFieldsMap 与 cascade node.id/datasetId 之外，对所有字段和值深拷贝保持源JSON状态原样（缺键仍缺键）；不重算defaultMapValue/mapValue，不补defaultValue或清理运行字段，不查询枚举。RED必须同runner断言级失败而非import/parse失败；GREEN用同一冻结12 identity，逐项完整deepEqual；补充合同允许的深冻结/无共享引用/输入不变/确定性/JSON roundtrip。记录专属stdout/stderr/exit code和摘要，只lint两个本次文件。不得连接产品入口、UI、Store、网络、权限、保存或数据库。
