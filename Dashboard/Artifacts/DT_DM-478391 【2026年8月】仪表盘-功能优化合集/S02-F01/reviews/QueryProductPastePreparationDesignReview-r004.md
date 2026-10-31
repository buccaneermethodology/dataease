# QPP Preparation r004 独立增量审查

## 双结论

**Design Freeze Validity：NEEDS_REVISION；Implementation Entry Readiness：NOT_READY。** 本版修复了JSON Patch操作，但基础成功输入超出了当前真实QCARRIER支持域，不能按现有依赖实现所冻结的成功oracle。仅一项当前blocking，不要求扩大权限或产品生命周期。

## 接收与绑定

Card validate exit 0，canonical SHA `a332f074e3e6e7e4d403ecc4bf821946e902bf9a6fee9161f4f86341798b0e84`；已读取绑定renderer。Context validate exit 0，raw SHA `a58b128c12bc36222acdeed64053e5396e36aadf3549caa075efc31844c87968`；19项required-read摘要逐项复算一致。

Design-r004 raw SHA `622cc9073c4d743773ab5ea3fc49e645dcf78964c7ee0e4dad8c19a0aea8c240`；Fixtures-r004 raw SHA `60ee481389712e66515a516c39968963737fe172b9b6a790abfb2b9feef80aae`。Goal、QTARGET/QCARRIER依赖及其原有支持域未改，不将fixture的allowed_transform当作依赖能力变更。

## 原finding处置与静态检查

- **QPPR3-01：CLOSED。** QPP-021新增unsupported键已使用标准add；31个case ID唯一，所有标准add/remove/replace路径可按基础输入解释，未再发现replace不存在键。
- **QPPR3-02：NOT_CLOSED（修正方向改变但引入上游支持域冲突）。** 分列请求在一般Select/枚举端点层面能产生A/A-code同行值，但它不属于本切片承诺复用的QCARRIER/QTARGET窄域，见唯一blocking。
- 原QPPR2-01映射责任及DIRECTORY透传的文字修订保持；原QPPR2-02总阶段顺序、sourceComponents快照职责、current精确API、无效handle优先、内部独立副本和外部candidate污染复验要求保持；原QPPR2-03配对、mode0完整性拒绝及mode1完整缺项规则保持。它们的规则方向不重新打开，但依赖基础准备成功的复验case目前无法到达。
- 基础及各完整性用例中非故意错误的冻结requestKey均复算一致；RECOMPUTE_FROM_MUTATED_REQUEST有显式runner规则。QPP-031自洽key仍需匹配候选请求的断言方向正确。
- 所有失败保留无目标/owner/history/cache/preview/query/save副作用约束。本轮检查是JSON/源码静态核对，不是执行helper或验证这些运行效果。

## QPPR4-01 / P1 / Blocking：基础分列成功输入被真实QCARRIER确定拒绝

**证据：** r004基础条件field.id为province，displayId改为province_name。`core/core-frontend/src/custom-component/filter-copy/query-single-select-carrier.ts:305–311` 明确检查 `condition.displayId !== fieldValue.id` 时返回false；后续validateShape失败返回 `UNSUPPORTED_SHAPE`。`query-single-select-target-rebuild.ts`在PLAN/DIRECTORY之前真实调用carrier并将失败包装为 `QCARRIER/UNSUPPORTED_SHAPE`。QTARGET r008冻结合同同样规定displayId等field.id。

r004的dependency_refs.allowed_transform仅修改源/期望的displayId，未也不能修改依赖支持谓词。因此QPP-001/023不会成功；QPP-007也先在QCARRIER失败，QPP-006不会到DIRECTORY，QPP-004/025/026/027/031等不会到DEFAULT_ENUM。复验用例无法取得其真实签发的基础handle。完整候选和正确requestKey不能覆盖这一更早的失败。

**影响：** Builder若不改既有依赖就无法通过冻结oracle；若为了绿测绕过QCARRIER、mock其成功或扩大其shape，则违反本轮写入范围与既有合同。不应创建当前Builder admission。

**最小disposition：** 回到QCARRIER支持的同字段shape：field.id/displayId/queryId保持province，使defaultValue/defaultMapValue及同一行投影采用A/A（运行B/B可对应），明确这是从r008合成基例派生的新输入，并给真实QTARGET应生成的完整输出。只修QPP新版本Design/Fixtures，不改QTARGET r008或产品源码。若需要继续保留A/A-code关系算法测试，应明确其只是独立合成配对谓词witness，不作为当前真实QTARGET端到端准备成功例。扩展QCARRIER支持不同display字段是更大独立合同，当前不推荐作为最小修复。

修正基础后定向重新核对所有依赖该基础的case首错阶段、完整候选、requestKey及handle签发路径即可；无需再全域研究或要求真实权限环境。

## 非阻断与声明边界

fixture_resolution及oracle_limits的说明仍写revision r003，可同步修正文案，文件revision/design_ref实际为r004，不另作blocking。

原10项Goal AC、26 must-have、16产品义务不变；S01状态不变；真实权限BLOCKED / NOT_RUN保持。C只追加一次核对、结束loading、仍缺保留无效选择的裁定未改变。纯helper即使后续准入，也不证明身份授权、枚举端点完整性、UI/Store、快照/预览/保存重开或Goal完成。

本轮仅新增本报告，未改候选、源码、测试、Goal或旧证据；未运行构建、应用或网络验证。
