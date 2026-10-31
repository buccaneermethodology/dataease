# Context Bootstrap: S02-QPC-saved-owner-design-review-r006

Task profile: read_only
Raw intent authority: 独立语义复核 QPC saved-canvas owner 与效果边界设计增量 r006；核对其与 QPC r005、owner contract/source validation、Goal authority 和真实权限阻塞是否一致。不得修改产品源码、测试、设计或 cases。
Intake projection: 裁定QPC r006设计澄清是否准确；保持Goal完整分母及产品/权限未准入状态。
Maximum claim: 仅独立语义复核；不证明产品行为、权限、产品接线或Goal完成。
Write scope: Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/reviews/QueryProductCommitDesignDeltaReview-r006.md

## Required Read Set
- AGENTS.md@270940a30f462f2fb0c9a8cf2bbc1dd11750513d8f063ffc376e0e0a2640466e — S02-QPC-saved-owner-design-review-r006; 独立复核QPC r006的边界、证据绑定及准入上限。
- .codex/skills/sge-governed-checkpoints-sp010/SKILL.md@b3e5d00193f88608e8deb3214071444ce89fa66431daf115b35f72fedbecbe3f — S02-QPC-saved-owner-design-review-r006; 独立复核QPC r006的边界、证据绑定及准入上限。
- Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/Goal.final.json@f562da2eb14b84dc8083e138dd2eb8718a58041f01d08163eddf5fb2c71daef0 — S02-QPC-saved-owner-design-review-r006; 独立复核QPC r006的边界、证据绑定及准入上限。
- Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/QueryProductCommitDesign-r005.md@ddef9ea1e00dcd1cffee040b51e3632cca85d7166fd9782c9ff4246b2ccd3d69 — S02-QPC-saved-owner-design-review-r006; 独立复核QPC r006的边界、证据绑定及准入上限。
- Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/QueryProductCommitCases-r005.json@388f0719d018b7cd444b6232d8601e0825513f99d0dee98ca68cf89dd3240728 — S02-QPC-saved-owner-design-review-r006; 独立复核QPC r006的边界、证据绑定及准入上限。
- Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/reviews/QueryProductCommitDesignReview-r005.md@c9ab8212e34a86eabdeb8fc9159b59336320a8d7e13ad1f4dbd682ebbdee117a — S02-QPC-saved-owner-design-review-r006; 独立复核QPC r006的边界、证据绑定及准入上限。
- Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/QueryProductCommitDesignDelta-r006.md@026983613a8feec703be574888e48695b344bc9260db08ef42284fcaab0a8cfc — S02-QPC-saved-owner-design-review-r006; 独立复核QPC r006的边界、证据绑定及准入上限。
- Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/QuerySingleSelectSavedCanvasOwnerDesign-r004.md@f7d430ed4801b647efd44499b37d86677563e466d3e216380aba6261ab9e4d59 — S02-QPC-saved-owner-design-review-r006; 独立复核QPC r006的边界、证据绑定及准入上限。
- Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/reviews/SAVED-CANVAS-OWNER-source-Validation-r002.md@83a2c649d3d2281616116da5387fa9e2303418140f67ffa6ccf4dfa7848b2070 — S02-QPC-saved-owner-design-review-r006; 独立复核QPC r006的边界、证据绑定及准入上限。
- core/core-frontend/src/custom-component/filter-copy/query-single-select-saved-canvas-owner.ts@f475e94fd51c70a6d634ff80caf0cc35d5430556bedf5e5312b8d09f1dd94130 — S02-QPC-saved-owner-design-review-r006; 独立复核QPC r006的边界、证据绑定及准入上限。
- Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/PermissionEnvironment.md@bf1498aa23f4f864e2c5c3d999b6b1a6044849ba25a9cd7d7d85104b6f233b9d — S02-QPC-saved-owner-design-review-r006; 独立复核QPC r006的边界、证据绑定及准入上限。
- Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/Sessions.md@35a054bb2678cb6b2324799322e2b1ffaedf9b473da7cf49ff3ddcd6ac6e9150 — S02-QPC-saved-owner-design-review-r006; 独立复核QPC r006的边界、证据绑定及准入上限。
- Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/planning/Topology-actual-r212.json@b765e6dd5abf0f4ba6522f05433bbe7a3248e835604c1d324d954694faab7311 — S02-QPC-saved-owner-design-review-r006; 独立复核QPC r006的边界、证据绑定及准入上限。

## Conditional Read Set
- source_or_authority_drift [deterministic]: 若读集摘要变化或发现新权威裁定/实际产品源冲突 -> 停止并记录漂移，要求重建Context/Card；不推断准入。
- semantic_scope_gap [evidence_backed_agent_evaluated]: 若设计把detached helper、模型输入、dirty计数、preview、history或权限合并成单一结论 -> 按具体合同/源证据报告边界缺口与处置。

## Semantic Refresh
- Required even when digest is unchanged: yes
- Anchors: objective, authority, claim_ceiling, critical_dependencies

## Epistemic Search Space
- Required domains: authority, scope, acceptance, design, identity, validation, dependency, claim_ceiling, topology
- Missing evidence: expand reads or report an evidence gap

## Topology
- independent_source_grounded_semantic_review (basis=change_impact): 复核r006的身份域、缓存dirty与preview/history区别、维护者裁定和准入边界。
