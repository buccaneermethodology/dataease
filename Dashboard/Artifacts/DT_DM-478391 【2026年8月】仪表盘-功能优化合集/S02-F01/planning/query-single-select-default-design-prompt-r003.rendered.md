Lane Task Card: Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/planning/query-single-select-default-design-card-r003.json
Card SHA-256: 6201c937506ffed7f580ad8872ab604e2d7bebe1318cd8192624048d1ea0f752
Verify: python3 .codex/skills/sge-governed-checkpoints-sp010/scripts/lane_task_card.py validate Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/planning/query-single-select-default-design-card-r003.json --repo . --expected-card-sha256 6201c937506ffed7f580ad8872ab604e2d7bebe1318cd8192624048d1ea0f752
Lane: design | Session: S02.1 | Role: design
Mode: delta
Working directory: .
Execute: 按QSD-01/02以明确纯转换合同修订单选默认值重建。唯一输出是复制源完整JSON状态的重绑定候选；逐字段列出KEEP深拷贝、REGENERATE身份与REMOVE字段，完整保留defaultValueCheck/defaultValue/defaultMapValue/selectValue/mapValue及cascade selectValue/currentSelectValue原值且不重算、不规范化、不查询枚举或声称目标存在性。限定一致dataset/field普通VARCHAR单选、非required、非首项/非树/非参数/非动态日期。成功fixture必须完整输入和完整JSON expected，故意区分显示默认值、映射值、运行值及节点current来证明不回填；失败类别每项给准确reason和优先级；补齐输入隔离、无共享引用、JSON往返确定性oracle。若“复制源JSON状态”及字段规则不能兼容原始Goal，则报告NOT_READY，不猜产品行为。只写r003 Design/Fixtures，不改r002或源码。
