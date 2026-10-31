# Context Bootstrap: S02-query-product-adapter-contract-design-r004

Task profile: read_only
Raw intent authority: 继续推进S02 F01完整Goal；不干扰S01。先补全DG-03查询配置适配设计，必须保留原始Goal分母与所有查询形态，不以已通过窄模块代替完整支持。只有权限/Entry Packet等前置满足后才进入产品Builder。
Intake projection: 源代码追踪所有查询配置形态的字段处理矩阵、完整候选schema/oracle、转换责任链及原子粘贴提交边界；只写设计与fixtures，不实施产品代码。
Maximum claim: 仅完整适配设计与合成fixtures候选；不冻结、不代表产品/权限/Goal验收。
Write scope: Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/QueryProductAdapterDesign-r004.md, Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/QueryProductAdapterFixtures-r004.json

## Required Read Set
- Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/Goal.final.json@f562da2eb14b84dc8083e138dd2eb8718a58041f01d08163eddf5fb2c71daef0 — 完整查询适配设计r004; 权威、字段语义、既有有界合同或真实源码依据
- Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/Design.md@17dbf0cbc6fb9f6f4c7fcce958bd5e80a532844fe2aef684ac6de634584747c1 — 完整查询适配设计r004; 权威、字段语义、既有有界合同或真实源码依据
- Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/DesignGaps.json@0a6e1718b0cad911c479ed7faef73664d0bf9d565383d36e226df23f93ec410c — 完整查询适配设计r004; 权威、字段语义、既有有界合同或真实源码依据
- Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/DesignGapReconciliation-r001.md@3a6668aad38a2ee40fe695de2cda77f031d6968255d5b2005c4046255869455d — 完整查询适配设计r004; 权威、字段语义、既有有界合同或真实源码依据
- Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/QueryProductAdapterDesign-r003.md@4c21dbcc99a9add2aecff52f847fbb708df17ccf8eea21c3e4a1c7adb67cd4e5 — 完整查询适配设计r004; 权威、字段语义、既有有界合同或真实源码依据
- Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/QueryProductAdapterFixtures-r003.json@0b0bc78a268f057356ae4354698949541a450f8ff18ec7b62614fe8474e5edbf — 完整查询适配设计r004; 权威、字段语义、既有有界合同或真实源码依据
- Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/QueryAdapterDesign-r007.md@bf67232e7a54d7a92e7eff866182298fe0b151f01edec5293286add96aeee47f — 完整查询适配设计r004; 权威、字段语义、既有有界合同或真实源码依据
- Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/QueryAdapterShapeMatrix-r002.md@04656b366beffab8f99826efcf2a835d24c7a6ee1f53ea911896b9702a046804 — 完整查询适配设计r004; 权威、字段语义、既有有界合同或真实源码依据
- Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/QuerySchemaDiscovery-r002.md@f3cdef883e90eea8750f97c511a6a1960868296d7dc28355c0e471c89045afb9 — 完整查询适配设计r004; 权威、字段语义、既有有界合同或真实源码依据
- Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/QuerySingleSelectRebuildDesign-r001.md@6142d2605d596585d8dfb4859a6ffbfefdf0defe2ac9fc0cf1f5da12ed30c7a6 — 完整查询适配设计r004; 权威、字段语义、既有有界合同或真实源码依据
- Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/QuerySingleSelectDefaultRebuildDesign-r003.md@d6fb3d4e78c60b2250635d6e88766ee8d7dc90d6f556630dd9bd0a49a912e5eb — 完整查询适配设计r004; 权威、字段语义、既有有界合同或真实源码依据
- Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/QueryTreeRelationRebindingDesign-r001.md@1b41b4e4902bc51d120be54794514a03fade61f4157b56fa2713d641f2823b64 — 完整查询适配设计r004; 权威、字段语义、既有有界合同或真实源码依据
- Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/QueryReferencePipelineDesign-r001.md@7269824ad1d0c3559e144ddf8bb65c379a6e75d08454e586b2eb7cbf4c4da93f — 完整查询适配设计r004; 权威、字段语义、既有有界合同或真实源码依据
- Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/Sessions.md@7d0ab03260365f6dcaaf958bea509f64c1b7ccd96ff0b768d1b352df5aca2a0c — 完整查询适配设计r004; 权威、字段语义、既有有界合同或真实源码依据
- core/core-frontend/src/custom-component/v-query/QueryConditionConfiguration.vue@49f3d636af50e900cbdd23f250470da455b3392117a0d934255fd19680df09de — 完整查询适配设计r004; 权威、字段语义、既有有界合同或真实源码依据
- core/core-frontend/src/custom-component/v-query/QueryCascade.vue@7c4139e8980c38420b5106e493524c8ff72e2571777d2c9a0b539af228433010 — 完整查询适配设计r004; 权威、字段语义、既有有界合同或真实源码依据
- core/core-frontend/src/custom-component/v-query/Select.vue@0aef2907019552e4b00a2762cd69fc60b8a13d6b3941a3e5b9b19a5667125bb4 — 完整查询适配设计r004; 权威、字段语义、既有有界合同或真实源码依据
- core/core-frontend/src/custom-component/v-query/Component.vue@70e15c5f8c2fbb591e9ca975f0b335eff183df3c677116682e354211d941b6a9 — 完整查询适配设计r004; 权威、字段语义、既有有界合同或真实源码依据
- core/core-frontend/src/custom-component/v-query/options.ts@4be7d37dd75cf8a3759e807e1fd996194be2f35a829ad2f1306dc3a8ec061fc4 — 完整查询适配设计r004; 权威、字段语义、既有有界合同或真实源码依据
- core/core-frontend/src/hooks/web/useFilter.ts@d2db975ae988218a921a5e3a76869e1a66d234eeebeedb1bfcf71e847e90416a — 完整查询适配设计r004; 权威、字段语义、既有有界合同或真实源码依据

## Conditional Read Set
- shape-not-covered [evidence_backed_agent_evaluated]: 发现Goal要求的查询形态没有源码或完整oracle支持 -> 扩读相邻消费者并将精确缺口记录NOT_READY，不猜测也不永久拒绝
- missing-contract-authority [deterministic]: 发现字段、值语义或复制边界与冻结Goal/AC无法一致解释 -> 停止该形态结论并记录精确待裁定项；不得猜测或弱化Goal

## Semantic Refresh
- Required even when digest is unchanged: yes
- Anchors: objective, authority, claim_ceiling, critical_dependencies

## Epistemic Search Space
- Required domains: scope, acceptance, dependency, implementation, validation
- Missing evidence: expand reads or report an evidence gap

## Topology
- independent_design_lane_then_semantic_review (basis=change_impact): 完整查询适配设计为高语义风险；当前只写候选设计，产品Builder仍受原Goal前置门控。
