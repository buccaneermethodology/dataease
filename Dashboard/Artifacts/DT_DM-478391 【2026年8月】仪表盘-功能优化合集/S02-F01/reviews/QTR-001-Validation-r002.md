# QTR-001 Delta Validation r002

## Verdict

- **QTR package：PASS_WITH_BOUNDS_FOR_QTR。** r001 报告中的两项实现问题已修复；8 项冻结identity和7项防御检查通过，当前实现及runner的定向 ESLint 通过。本结论只覆盖离线纯树关系重绑函数。
- **Goal conformance：PARTIAL；S02 Goal 仍开放。** 原 Goal ledger 为26项：10项 S02 AC、14项 F01 义务及2项 Q066/Q067；复核时26项仍为 pending。QTR 结果不关闭产品级AC或完整 Goal。
- 真实权限验收仍 **BLOCKED / NOT_RUN**。QTR 未接入产品复制入口，不证明只读用户限制、权限撤销/恢复、目录授权、树查询/SQL、完整 query payload、保存/undo 或产品回归。

## Delta 输入与绑定复算

当前 Validation card SP-010 校验通过，canonical digest：`ea998a7bc05949eee9ff12fbf3c18eaa80ffda8210cbbb999b373be1041ac423`。Context Bootstrap 校验通过，SHA-256：`1fe25fed9993aed76601c7b90f73b9838155845b6bd8caa92c783b70ece138d8`；required read set 的30项摘要全部匹配，card 的 base references 也均匹配。card 与 Context 的最大声明均为8项冻结identity加7项防御检查，Topology 基线均指向 `Topology-actual-r042.json`。当前状态记录在 `Topology-actual-r043.json`（SHA-256 `2c880c14cdfba392fa8ba5ebb242264d3b0d6748d35abf87b8a544b326420512`），记录本轮修复后独立复跑及待报告状态。

按 delta read set 复核 r001 Validation findings、修复后的实现/runner、Builder execution evidence、GREEN证据、lint退出码与拓扑。r001 中的 QTR-V01、QTR-V02 已按报告要求修复；QTR-V03 的六层拒绝和重复 `treeFieldIds` 拒绝已加入runner并通过；QTR-V04 的当前状态面纳入本轮 Context/card 所绑定的 r042基线，r043记录了本轮当前复验状态。

## 独立复跑

独立运行 `node tests/filter-copy-query-tree-relation-rebinding/rebind.test.mjs`，输出 `PASS: 8 frozen QTR identities plus 7 defensive checks`。独立对 `query-tree-relation-rebinding.ts` 与对应runner执行定向 ESLint，退出码为0。

8项冻结identity的精确输出/错误断言均通过；runner检查输入未变、失败结果不含 partial `value`，成功结果的层数组、选择数组和映射对象均为新对象。7项防御检查分别覆盖：五层保留、忽略未选择映射键、FIELD_MISMATCH先于后续歧义、`__proto__`作为自有键保留、共享层对象按数组位置校验、六层拒绝、重复树字段ID拒绝。

- **QTR-V01 closed：** 目标ID `__proto__` 通过 `Object.defineProperty` 写为自有且可枚举属性；runner断言其映射值准确为当前层field ID。
- **QTR-V02 closed：** 字段匹配按显式 `levelIndex` 逐位置核验，并要求被选source在field map中为自有键。共享level对象出现在两个数组位置时，第二层与不同field ID不一致，返回 `FIELD_MISMATCH`。
- **QTR-V03 closed：** 六层输入和重复 `treeFieldIds` 均返回 `INVALID_INPUT`，两项均有独立防御断言。
- **QTR-V04 reconciled for this delta：** Validation Context/card绑定的Topology基线为r042，实际复验状态由当前r043记录。r001的错误runner路径/缺失RED snapshot/六项声明属于前置包缺陷，已在r002包中修订；未将此前错误路径导致的 `MODULE_NOT_FOUND` 当成测试结果。本轮只使用修订后的真实runner路径和绑定摘要。

## 后续边界

QTR 可作为已验证的有限纯变换候选交给后续组合设计使用，但不能单独用于粘贴，也不代表完整 adapter 已有。完整条件树、真实QMAP目录及授权、产品入口与交互、保存/撤销、历史配置兼容、必需回归测试和独立最终验收仍开放。QPREP 历史 package verdict 保持 `PARTIAL_PASS / BLOCKED_FOR_PACKAGE_ACCEPTANCE`；本次不追认或解除该限制。S02 最终仍须完成原 Goal 的全部 AC、16项产品义务和 Stop Gate 对账。
