# SH-SELECT-TEXT 来源 Oracle 修复 Delta Validation r001

## 结论

**局部结论：PASS WITH BOUNDS（有界通过）。** 候选 `QueryProductAdapterSelectTextSourceOracleDesign-r002.md` 与 `QueryProductAdapterSelectTextSourceCases-r002.json` 已局部关闭 `F-ST-SRC-ORACLE-001`：ST-SRC-004 CANCEL 不再把真实 JavaScript Promise rejection 或其处理结果作为 oracle；只记录 test adapter 的取消信号并检查 handler 状态快照。真实 Promise rejection、Element/UI 错误处理明确保留为 `NOT_RUN / UNKNOWN`。

**下游准入限制：存在一项阻断下一步 Builder 准入的治理差异。** 本验证 Context 的 `task_profile` 是 `validation`，入口 Card 的 `role` 是 `validation`，但 Context `topology.route` 仍为 `independent_bounded_design_review`。本报告不修改 Context、Topology 或其他状态；在治理者澄清/重建对应 Validation topology 前，本结论只证明候选文档中的局部修订，不构成测试 harness 或产品 Builder 准入。

## 验证范围与声明上限

本 lane 独立核验设计/Cases r001→r002 的局部差异、ST-SRC-004 CANCEL 的拒绝观测边界、其他 case identity/expected 的稳定性，以及候选声明的分母和依赖状态。只读核对源码分支、Goal、权限环境、S01 EntryPacket 和 Topology。

本报告不证明任何测试已执行，不验证产品 UI、Store、API、权限、保存/恢复或完整 F01 行为；不冻结全量 Cases，不批准产品接线，不宣称 Goal AC 通过或 Goal 完成。

## 输入绑定与基线

- Lane Card：`S02-F01-SH-SELECT-TEXT-SOURCE-ORACLE-REPAIR-DELTA-VALIDATION-r001`；`lane_task_card.py validate` 对期望 canonical SHA-256 `54ca0d4979bb98297075c5e12c77bb5f7facaf1c7b5149adbca5c696cf4fcce6` 返回 `verdict: pass`。
- Context Bootstrap：`context_bootstrap.py validate` 成功；原始文件 SHA-256 为 `c9ab3e369dbc10dccb13d0f8c8020bbc62ea282b362055e7625055c039a1620b`，与 Card 的 base context ref 一致。
- Context required-read set：11 项摘要逐项重算全部匹配，包括 Goal、设计/Cases r001/r002、来源 Review、修订记录、源码、权限环境、S01 EntryPacket 和 Topology r280。未跳读。
- 有界差异检查：Cases JSON 可解析；r001/r002 的 case 列表、variant ID、Goal AC ID、must-have ID、分母、产品义务、依赖对象及所有非 CANCEL expected/identity 均一致。Cases r002 仅新增修订说明及入口绑定更新；在 ST-SRC-004 CANCEL 中，差异限于步骤、取消状态表达和明确的 rejection 边界。

Context 中的治理差异：其 `topology.route` 值为 `independent_bounded_design_review`，与本卡的 Validation lane 不一致；虽然 Context schema 校验成功且全部 read digest 匹配，该 route 值不能由本报告自行改写或视为自动消除。

## Finding 核验

### F-ST-SRC-ORACLE-001（P2）：局部关闭

r001 CANCEL 步骤要求 reject C1、观测派生 then 链 rejection，并将 rejection 记录为 expected。r002 已将其改为：

- 测试适配器记录 `cancelled signal`；不调用 `onFulfilled`，不 reject JavaScript Promise。
- expected confirmation state 为 `cancelled_signal_without_js_rejection`；不再含 rejection 结果。
- expected 只断言 dataset 回到旧值、cascade/new-old 缓冲保持，以及零请求/发布/保存等 handler 快照。
- `promise_rejection_handling` 标为 `NOT_RUN / UNKNOWN; excluded from this oracle`；`cancel_signal_observer` 限定为 test adapter，不主张产品/UI 错误处理。

这符合 r001 独立 Review 给出的方案 2。源码只用于确认 handler 来源/边界；静态来源核对不等于执行该路径。

### 其他 case、分母和依赖保持

- ST-SRC-001..005 的 identity、variant identity 与 expected 未变，唯一局部 expected 差异在 ST-SRC-004/CANCEL 的取消表达和 rejection 移除。
- ST-SRC-006、ST-SRC-007 均仍为 `NOT_READY / NOT_RUN`，`expected_after` 仍为 null；没有被提升为可执行或已验证。
- Goal AC 10、must-have 26、product obligations 16；`Scope Delta: none`。16 项产品义务均未运行。源 Goal 权威文件摘要与 Context 声明匹配。
- S01 F01 Packet 仍为 `CONDITIONAL`；真实权限仍为 `BLOCKED / NOT_RUN`。权限环境记录明确指出 standalone/admin 不能替代真实多用户鉴权验证。只读用户限制、权限撤销和恢复继续未验证。

## 阻断、非阻断与后续

- **阻断下一步准入：** Context topology route 与 validation lane/card role 不一致。请治理者在后续 lane 入口中修正/重建 topology 绑定，并按其验证规则重新检查；本报告不能作为 harness Builder admission。
- **本局部修复无新增阻断 finding：** CANCEL rejection oracle 已按选定方案移除，其他冻结身份和 expected 未见漂移。
- **保留的未验证范围：** ST-SRC-001..005 仍为候选且 `NOT_RUN`；006/007 `NOT_READY / NOT_RUN`；产品 UI、权限、保存恢复和 S01 进入依赖不变。

**Claim ceiling：** 仅对 F-ST-SRC-ORACLE-001 在候选设计/Cases 文档中的局部关闭给出有界判断；不证明测试执行、产品或权限验收，不据此解除任何既有阻塞或扩大分母。
