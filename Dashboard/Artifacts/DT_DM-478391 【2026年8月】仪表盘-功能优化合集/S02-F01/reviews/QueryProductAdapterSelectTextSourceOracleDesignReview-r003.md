# SH-SELECT-TEXT 来源 oracle 设计 r003 独立复核

## 结论

**F-ST-SRC-ORACLE-002 已在候选文档层面消除，建议进入仅针对 ST-SRC-001 的有界 Delta Validation。** r003 将 Date 计数范围定义为单次同步 `infoFormat(input)` 调用，规定只解析 TypeScript AST 并提取函数 initializer，不导入或执行模块主体；计数器在调用前重置并立即启动、同步返回后立即停止。该边界排除了 `attributes` 的模块顶层初始化，形成唯一的两次构造计数 oracle。

本结论只认可设计文本对原 P2 的修订，不是 ST-SRC-001 用例执行结果，也不创建或声称任何 validation admission。候选仍是 `candidate / frozen_for_builder=false`，该用例仍 `NOT_RUN`；是否采取后续治理动作交由已有流程处理。

## 绑定和读取核验

- Lane Card `S02-F01-ST-SRC-001-DATE-ORACLE-DESIGN-REPAIR-REVIEW-r001` canonical SHA-256 与指定值 `e2924b9059905ffdb2843d2c39d6b88f6bfb17239e78eb0c292a4462672f2614` 一致，`lane_task_card.py validate` 返回 `pass`。Card 与 Context 的写范围均仅包含本报告。
- Context Bootstrap validation 通过，20 项 required-read set 的路径均存在、实算 SHA-256 全部匹配声明值，`skipped_reads` 为空。`Topology-actual-r288` 记载的是 ST-SRC-002..005 的有界 harness Validation，且明确 ST-SRC-001 finding 仍待修订/复核；本报告不把其局部 PASS 扩展为 ST-SRC-001 证据。
- `options.ts` 未作为本 Context 的独立 required-read 项；Cases r002 的 `source_manifest` 绑定该文件 SHA-256 `4be7d37dd75cf8a3759e807e1fd996194be2f35a829ad2f1306dc3a8ec061fc4`，当前文件摘要与其一致。本轮读取了该源码并用 TypeScript AST parser 只解析源码、抽取 `infoFormat` initializer，未导入或执行 `options.ts`。因此该来源摘要缺席 Context 直接列表不阻断本次复核：候选内已有摘要绑定，且本轮对当前源文件作了独立摘要复核。

## ST-SRC-001 修订核对

源码 `core/core-frontend/src/custom-component/v-query/options.ts` 中，`infoFormat` 是 `ArrowFunction` initializer（第 6 行起）；其函数体含两处 `new Date()`（第 42、46 行）和一次 `guid()`（第 9 行）。模块顶层另有 `useI18n()` 求值和 `attributes` 初始化，其中还有两处 `new Date()`（第 103、111 行）。它们位于函数 initializer 之外。TypeScript AST 静态遍历得到的函数 initializer 内计数为 Date 构造 2 次、guid 调用 1 次；本次没有执行函数或模块代码。

Cases r003 对 CREATE 明确规定：

1. 解析 TypeScript AST，仅提取 `infoFormat` initializer；不导入或求值模块主体/`attributes` 初始化。
2. 在隔离函数作用域注入 fixed Date 与固定 guid。计数器在调用前归零并开始，`infoFormat(input)` 同步返回后立即停止。
3. 断言该窗口内 Date 构造 2 次、guid 调用 1 次；expected 快照分别断言 `arbitraryTime` 与 `arbitraryTimeRange` 为固定时刻 `2026-10-20T00:00:00.000Z`。

因此原 r002 中“模块导入前后及计数开始点未定”的歧义已被消除。AST 提取器的实际执行、注入器及返回快照比较仍属于后续 Delta Validation/harness 验证；本报告未执行它们。

## r002 → r003 差异与范围保持

- 七个 Case ID 及全部 variant ID 保持一致：001 `CREATE`；002 两个变体；003 三个变体；004 两个变体；005 五个变体；006 一个候选变体；007 无变体。
- ST-SRC-001 的 `before` 与 `expected_after` 完全未变；仅 `steps` 和 `assertions.dateObservationWindow` 增加计数窗口协议。ST-SRC-002..007 的 Case 对象与 r002 完全一致。
- Goal 分母仍为 10 项 Goal AC、26 项 must-have、16 项 product obligations，`Scope Delta: none`；产品义务执行状态未变。S01 F01 Packet 仍 `CONDITIONAL`，真实权限仍 `BLOCKED / NOT_RUN`；006/007 仍 `NOT_READY / NOT_RUN`。
- CANCEL 仍只记录 test adapter 的取消信号且不调用 `onFulfilled`，不主张真实 JS Promise rejection 或 Element/UI 错误处理。QOBS-ASYNC-01、产品 UI/Store/API、权限、保存/历史均不在本次修订或验证范围。

## 范围和下一步

设计层可关闭 F-ST-SRC-ORACLE-002。建议下一步仅对 ST-SRC-001 的 r002→r003 局部差异进行 Delta Validation，复核 AST 抽取、窗口内计数及两个固定日期值；执行证据须与本设计复核分开记录。不得把 AST 静态计数当成用例运行或产品验收，也不得由本报告声称任何 schema 未支持的 admission action。

**Claim ceiling：** 仅判断 r003 的 Date 观测窗口规格与当前 `infoFormat` 源码结构一致且原 P2 在候选文档中得到唯一化；不证明 ST-SRC-001 已运行、完整 001..005 harness 已获准、产品行为/权限已验收或 Goal 已完成。
