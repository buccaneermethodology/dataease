# Context Bootstrap: S02-QPC-STORE-PRODUCER-TRACE-r001

Task profile: read_only
Raw intent authority: 根据QPC r006独立复核获准范围，只读追踪 dashboard Store 中 saved canvas context 的生产者、读取与状态发布顺序、raw/代理引用、恢复路径和生命周期失效事件；形成源引用清晰的 trace，不写产品代码或测试，不触发产品运行或权限读取。
Intake projection: 定位helper调用方及Store producer缺口，以当前源码明确哪些状态可得、何时发布、raw/代理引用、恢复/复制分支和何种变更会失效。
Maximum claim: 只读静态源追踪候选；不证明运行时producer、真实身份/权限或产品行为。
Write scope: Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/QueryProductCommitStoreProducerTrace-r001.md

## Required Read Set
- AGENTS.md@270940a30f462f2fb0c9a8cf2bbc1dd11750513d8f063ffc376e0e0a2640466e — S02-QPC-STORE-PRODUCER-TRACE-r001; 追踪已保存画布Store上下文的真实生产/发布/失效来源及当前实现边界。
- .codex/skills/sge-governed-checkpoints-sp010/SKILL.md@b3e5d00193f88608e8deb3214071444ce89fa66431daf115b35f72fedbecbe3f — S02-QPC-STORE-PRODUCER-TRACE-r001; 追踪已保存画布Store上下文的真实生产/发布/失效来源及当前实现边界。
- Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/Goal.final.json@f562da2eb14b84dc8083e138dd2eb8718a58041f01d08163eddf5fb2c71daef0 — S02-QPC-STORE-PRODUCER-TRACE-r001; 追踪已保存画布Store上下文的真实生产/发布/失效来源及当前实现边界。
- Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/QueryProductCommitDesign-r005.md@ddef9ea1e00dcd1cffee040b51e3632cca85d7166fd9782c9ff4246b2ccd3d69 — S02-QPC-STORE-PRODUCER-TRACE-r001; 追踪已保存画布Store上下文的真实生产/发布/失效来源及当前实现边界。
- Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/QueryProductCommitCases-r005.json@388f0719d018b7cd444b6232d8601e0825513f99d0dee98ca68cf89dd3240728 — S02-QPC-STORE-PRODUCER-TRACE-r001; 追踪已保存画布Store上下文的真实生产/发布/失效来源及当前实现边界。
- Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/QueryProductCommitDesignDelta-r006.md@026983613a8feec703be574888e48695b344bc9260db08ef42284fcaab0a8cfc — S02-QPC-STORE-PRODUCER-TRACE-r001; 追踪已保存画布Store上下文的真实生产/发布/失效来源及当前实现边界。
- Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/reviews/QueryProductCommitDesignDeltaReview-r006.md@407c08a7d623f68fd7dd8d18a89543618a93e7675318bcccf4804eafbe3e7b79 — S02-QPC-STORE-PRODUCER-TRACE-r001; 追踪已保存画布Store上下文的真实生产/发布/失效来源及当前实现边界。
- Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/QuerySingleSelectSavedCanvasOwnerDesign-r004.md@f7d430ed4801b647efd44499b37d86677563e466d3e216380aba6261ab9e4d59 — S02-QPC-STORE-PRODUCER-TRACE-r001; 追踪已保存画布Store上下文的真实生产/发布/失效来源及当前实现边界。
- Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/reviews/SAVED-CANVAS-OWNER-source-Validation-r002.md@83a2c649d3d2281616116da5387fa9e2303418140f67ffa6ccf4dfa7848b2070 — S02-QPC-STORE-PRODUCER-TRACE-r001; 追踪已保存画布Store上下文的真实生产/发布/失效来源及当前实现边界。
- Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/PermissionEnvironment.md@bf1498aa23f4f864e2c5c3d999b6b1a6044849ba25a9cd7d7d85104b6f233b9d — S02-QPC-STORE-PRODUCER-TRACE-r001; 追踪已保存画布Store上下文的真实生产/发布/失效来源及当前实现边界。
- Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/Sessions.md@75afa6dbcbbd9f76fdb1731af1592c78b923b205bbe280b1fa5be3d38774a1d8 — S02-QPC-STORE-PRODUCER-TRACE-r001; 追踪已保存画布Store上下文的真实生产/发布/失效来源及当前实现边界。
- Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/planning/Topology-actual-r213.json@3a5462257c702e8500d0b48de50cf6c001e895e7adffa0f2f45a14f5907cb6f7 — S02-QPC-STORE-PRODUCER-TRACE-r001; 追踪已保存画布Store上下文的真实生产/发布/失效来源及当前实现边界。
- core/core-frontend/src/store/modules/data-visualization/dvMain.ts@2ca7f626c2c31f3c6e5db547cae600cfcf30cf26ed64d8f183a33943751752a2 — S02-QPC-STORE-PRODUCER-TRACE-r001; 追踪已保存画布Store上下文的真实生产/发布/失效来源及当前实现边界。
- core/core-frontend/src/views/dashboard/index.vue@75c0550afc403cf06ab0ce62cf459dc22d1676842293f73e575bc351b333dddd — S02-QPC-STORE-PRODUCER-TRACE-r001; 追踪已保存画布Store上下文的真实生产/发布/失效来源及当前实现边界。
- core/core-frontend/src/views/canvas/DeCanvas.vue@6f512a5d714efe5a64746fb8f7d3d78b8e3f7bcc46d74fb362ef5948704db72e — S02-QPC-STORE-PRODUCER-TRACE-r001; 追踪已保存画布Store上下文的真实生产/发布/失效来源及当前实现边界。
- core/core-frontend/src/custom-component/v-query/Component.vue@152703881a926e747e4e42f7c593a1558708efa73a3138cdb823cc519b01d081 — S02-QPC-STORE-PRODUCER-TRACE-r001; 追踪已保存画布Store上下文的真实生产/发布/失效来源及当前实现边界。
- core/core-frontend/src/custom-component/v-query/Select.vue@eadbdba2b61aaeaf7abc58f83e75e82595c4a0812ceb1ac971f6739e4e4212a2 — S02-QPC-STORE-PRODUCER-TRACE-r001; 追踪已保存画布Store上下文的真实生产/发布/失效来源及当前实现边界。
- core/core-frontend/src/custom-component/v-query/QueryConditionConfiguration.vue@0b88bcdf92d15aceae52ca2992e7a8b4165e3f5cfc3f9cb7435296d7c7e9e047 — S02-QPC-STORE-PRODUCER-TRACE-r001; 追踪已保存画布Store上下文的真实生产/发布/失效来源及当前实现边界。
- core/core-frontend/src/custom-component/filter-copy/query-single-select-saved-canvas-owner.ts@f475e94fd51c70a6d634ff80caf0cc35d5430556bedf5e5312b8d09f1dd94130 — S02-QPC-STORE-PRODUCER-TRACE-r001; 追踪已保存画布Store上下文的真实生产/发布/失效来源及当前实现边界。
- core/core-frontend/src/custom-component/filter-copy/query-single-select-session.ts@ebda5b9ac14425e9ed3a08ff489150197222f1900949b62209493341c6948189 — S02-QPC-STORE-PRODUCER-TRACE-r001; 追踪已保存画布Store上下文的真实生产/发布/失效来源及当前实现边界。
- core/core-frontend/src/custom-component/filter-copy/query-single-select-created-lifecycle.ts@34628b936fccd746e949e29bc28c201e66a86a98ef7ba265cc34428c6cadd990 — S02-QPC-STORE-PRODUCER-TRACE-r001; 追踪已保存画布Store上下文的真实生产/发布/失效来源及当前实现边界。
- core/core-frontend/src/utils/canvasUtils.ts@f9c68f5c96a716ed451206ef6efcbda27158cc828b578920ed5a15167bbc8282 — S02-QPC-STORE-PRODUCER-TRACE-r001; 扩展到真实服务载入与快照恢复生产路径，避免只依据Store setter推断producer。
- core/core-frontend/src/store/modules/data-visualization/snapshot.ts@5ffd11d4740efbd8570e31c42cffb8870a879eaf309bb4f31b00e40cc57c2e30 — S02-QPC-STORE-PRODUCER-TRACE-r001; 扩展到真实服务载入与快照恢复生产路径，避免只依据Store setter推断producer。
- core/core-frontend/src/components/visualization/CanvasCacheDialog.vue@6f6d4c1db4448606ca3c8d04470f5d8bb695e1db7a4eca5b826f836e985be7a3 — S02-QPC-STORE-PRODUCER-TRACE-r001; 核实缓存恢复对话框是否是状态生产者，以及其事件边界。

## Conditional Read Set
- context-producer-source-gap [evidence_backed_agent_evaluated]: 若在指定调用链内未找到完整生产者/发布顺序或身份失效事件 -> 明确标记unknown并给出精确缺口，不推断不存在或已支持。
- source-drift [deterministic]: 若读集摘要变化 -> 停止并重建本次Context与Card。

## Semantic Refresh
- Required even when digest is unchanged: yes
- Anchors: objective, authority, claim_ceiling, critical_dependencies

## Epistemic Search Space
- Required domains: authority, scope, acceptance, implementation, identity, validation, dependency, claim_ceiling, topology
- Missing evidence: expand reads or report an evidence gap

## Topology
- single_read_only_source_trace_then_independent_review_if_admission_requested (basis=change_impact): r006只授权静态追踪和入口设计；不允许产品接线或权限动作。
