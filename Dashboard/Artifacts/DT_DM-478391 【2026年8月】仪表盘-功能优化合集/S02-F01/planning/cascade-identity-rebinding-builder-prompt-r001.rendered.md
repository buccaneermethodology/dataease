Lane Task Card: Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/planning/cascade-identity-rebinding-builder-card-r001.json
Card SHA-256: ca989b9ca69def7428e60e43efa2dcfbd255612289b163a2ef67d04732cb1da3
Verify: python3 .codex/skills/sge-governed-checkpoints-sp010/scripts/lane_task_card.py validate Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/planning/cascade-identity-rebinding-builder-card-r001.json --repo . --expected-card-sha256 ca989b9ca69def7428e60e43efa2dcfbd255612289b163a2ef67d04732cb1da3
Lane: builder | Session: S02.1 | Role: builder
Mode: full_baseline
Working directory: .
Execute: 先验证本card/Context/设计复核与admission摘要；先只写独立测试runner，运行可信RED并保存原始输出、退出码和冻结fixture/源码摘要。然后实现纯函数 rebindQueryCascadeIdentities：严格按六项冻结oracle；全局输入结构检查后对复合串安全分段，非三段报INVALID_COMPOSITE_REFERENCE、三段空ID及非空非法ID报INVALID_ID；空独立fieldId是允许哨兵；映射覆盖和query/node目标单射分别检查；同数据集后继仅要求独立fieldId为空。运行同六identity GREEN、输入不变/无partial/独立空数组防御检查、定向ESLint，记录证据。注意QCR-001首级空placeholder样本只验证纯字符串变换，不表示产品级联合法配置。严格不修改任何其他产品源码或完整查询适配入口，不安装依赖；完整Goal和权限验收保持NOT_RUN。
