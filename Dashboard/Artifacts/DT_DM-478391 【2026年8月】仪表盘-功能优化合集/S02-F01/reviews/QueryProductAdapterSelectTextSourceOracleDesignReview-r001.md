# SH-SELECT-TEXT 来源 oracle 设计候选 r001 独立语义复核

## 双结论

- **Design Freeze Validity：PASS WITH FINDINGS（仅 ST-SRC 来源阶段 oracle 候选；需补明一项 Promise 拒绝观测协议后再冻结）。** ST-SRC-001..005 的输入、声明状态域及局部 expected_after 总体与当前静态源码相符；入口差异和 validate 的清理副作用被如实保留。候选没有把这些局部状态转移扩成合法组合全集、完整组件 schema、产品运行结果或权限行为。
- **Implementation Entry Readiness：WEAK（仅局部 handler harness）；FAIL（产品 Builder）。** 001..005 可作为窄测试 harness 的准备输入，但 ST-SRC-004 CANCEL 对派生 Promise rejection 的观测机制尚未定义，当前不宜冻结该用例。即使修复，也只可考虑离线/局部 harness；不能据此准入产品 UI/Store/API、权限或保存接线。
- **范围/权威：** 保留 Goal 10 项 AC、26 项 must-have、16 项产品义务，`Scope Delta: none`。所有产品义务仍 `NOT_RUN`；S01 F01 Packet 为 `CONDITIONAL`，真实多用户权限为 `BLOCKED / NOT_RUN`。本报告不改变这些状态。

## 输入绑定与审查边界

Card `S02-F01-SH-SELECT-TEXT-SOURCE-ORACLE-DESIGN-REVIEW-r001` canonical SHA-256 `02d7c34fb3604e13cf21f64689197e77970666fd67d85d7a5ec2c22be439ec4d`，`lane_task_card.py validate` verdict `pass`。Context Bootstrap validation 通过，required read set 无跳读。审查对象摘要：设计 `92cdffa883d38bfd9bcf72c6ea6771c8e492070129eabab568a90f4125f4147c`；Cases `ccfbb1e91853d5581be9b24db954473fb986bbf5672026bda1acbed256eab6cc`。来源候选 r002 摘要为 `f0c62881696554ced04ce9c1587edac899258f24abb14e5b88360a2a2cf13151)，前次 Trace Review 摘要为 `fb9bf729306b8bce54e32579048ea81678ca2dfe886f31aba3b57aabdad60ae1`。

Topology r279 将本设计记录为待独立语义复核，ST-SRC-001..005 是未运行的局部 handler 候选，006/007 为 `NOT_READY`，没有 Builder 授权。Stop Gate r182 按本任务入口记录为有效 `CONTINUE`；这允许继续下一项工作，不是 Goal 终态。

本轮仅做设计、JSON 与源码静态核对；未执行 runner、UI、浏览器、网络、保存恢复或权限行为，也未修改候选、Cases、Goal、源码或其他 Dashboard 状态。JSON 的静态结构通过/完整快照声明不等于 oracle 已执行或行为已验证。

## 001..005 的局部状态域与源码支持

| Case | 复核结论 | 源码支持及边界 |
|---|---|---|
| ST-SRC-001 CREATE | **支持，候选完整度足够。** | `options.ts:6-66` 的 `infoFormat` 对指定输入生成完整返回对象；两个 `new Date()` 和 `guid()` 调用可通过 fixture 依赖固定。`defaultValueFirstItem` 不属于该返回对象，属性缺失与 own-property undefined 需区分。顶层 `useI18n()` 在导入时会读取全局 i18n，但本 case 不调用 `t`；fixture runner 需能解析/隔离依赖，不应因此把属性补全隐式加入创建阶段。 |
| ST-SRC-002 DATASET-CHANGE / SOURCE-SWITCH-DATASET-ALREADY-SET | **入口分开后 oracle 一致。** | `QueryConditionConfiguration.vue:987-1006` 的 `handleDatasetChange` 清 field/display/sort id 并调用 `getOptions`；`:1024-1045` 的 `handleValueSourceChange` 在 dataset 已有时只清 default/select 并调用 `multipleChange`，不清 field、不重新请求。:2017-2021 的 options Promise fulfillment 将 `res.data` 写到同一 condition 的 `dataset.fields`。pending 与 resolve 两个检查点能区分旧 fields 和响应字段。候选没有把这两个入口揉成一个状态转移。 |
| ST-SRC-003 ONE / MULTI-LAST / EMPTY | **局部 oracle 与代码顺序一致；不表达业务映射合法性。** | `:1027-1044` 先按对象键序选择最后一个 truthy checkedFieldsMap 映射，再遍历 fields；多条 componentId 匹配时后写覆盖前写。没有映射仍以空 dataset id 调用 `getOptions`，其真实 API 接受与否未知。候选把 MULTI-LAST 限定为当前循环顺序的代码事实，并记录空 id 请求，不把它写成业务映射规则。受控 Promise 对 `dataset.fields` 的回写也与 :2017-2021 相符。 |
| ST-SRC-004 CONFIRM / CANCEL | **确认分支基本可判定；取消分支存在下述 P2。** | `:964-977` 的 `handleCurrentChange` 记录 cascade 命中后的 old/new dataset；`:987-1005` 重置 dataset 并触发确认。确认回调 `:979-985` 变更 dataset、按旧 dataset 清理 cascade、清除缓冲，再进入字段清理与 options 请求。候选的确认、级联局部状态和一次 P1 请求预期与这些语句相符。取消时 dataset 回到旧值、级联和缓冲保留，也与 source handler 的路径一致。源码对确认 Promise 没有 catch；候选没有宣称 Element UI 已处理拒绝，这是恰当边界。 |
| ST-SRC-005 MISSING / EMPTY / WHITESPACE / VALID / MANUAL-BUFFER-WHITESPACE | **拒绝语义及副作用区分准确。** | `:1261-1283` 先做 checkedFields/默认校验；`:1452-1456` 在非 defaultValueCheck 时将 default/select 重置为空值，之后 :1559-1565 才用 truthy filter 判 manual valueSource 是否为空。因此缺失/空数组拒绝前有清理副作用，而 `['   ']` 为 truthy、该 validate 分支返回 false。弹窗 `:1725-1747` 对 manualBuffer string trim 判空，在写入 `valueSource` 前报错返回。Cases 同时记录条件完整对象、共享 identity、消息、返回值及计数；没有错误地断言整目标完全不变。未覆盖任意 required/参数形态的限制也已明示。 |

上述完整度是“声明的局部 handler 状态域”完整，不是整个 Vue 组件、Store、持久化或产品行为快照。候选明示这一界限；runner 尚未实现且所有这些 case 均 `NOT_RUN`。代码静态支持不代表实现者已执行这些转移。

## Finding

### F-ST-SRC-ORACLE-001（P2）：CANCEL 将派生 Promise 拒绝列入 oracle，但没有规定可重复的观测协议

**证据：** `handleDatasetChange` 在 `QueryConditionConfiguration.vue:990-1000` 调用 `ElMessageBox.confirm(...).then(() => confirmIdChange())`，不返回该 then 链，也没有 catch。ST-SRC-004 CANCEL 的步骤写为“reject C1；受控 Promise 记录派生 then 链 rejection”；expected 之外另列 `derivedPromiseRejection: 'cancel'`，同时指出源码无 catch、不能声称 UI 已处理错误。当前 Protocol 仅指定 runner 持有 C1 的 resolve/reject、flush 微任务，并没有说明如何获取未被 handler 保存的 `.then()` 派生 Promise，或怎样确定 unhandled-rejection 观测/排空边界。

**影响：** dataset 与 cascade 的取消状态转移可由输入快照判定，但测试实现者仍需自行选择 Promise 包装、全局 rejection observer 或改造 mock 的 thenable；不同选择可能改变拒绝是否“被处理”的行为。故该子用例的 Promise 结果观测尚不是唯一可复现 oracle，且不能把 test harness 观测冒充产品 UI 的异常处理。

**处置：** OPEN。修改前冻结下列一项方案并写入 fixture protocol：
1. 明确一个不会改变产品路径的 test-only observer，捕获 C1 的派生 Promise 拒绝，并固定任务/微任务排空边界；报告字段标注为 runner 观测，不属于 handler 返回值或产品副作用；或
2. 若该 case 只审查 handler 状态转移，则移除派生 rejection 作为 oracle 的要求，将 rejection/UI 错误处理留为未验证，不声称 CANCEL Promise 完整性。
修订后复核该 variant 的 before/expected 与 observer 约定，再准入局部测试 harness；不要求修改产品代码。

## 006/007、分母及越界审查

- **ST-SRC-006 保留 `NOT_READY / NOT_RUN` 是充分且必要的。** `Select.vue:358-521` 有枚举 Promise、观察代际分支、loading/finally、300ms timer 与若干状态写入；:533-563 写首项默认值/cascade/事件，:743-783 还有 observation request 前置和身份有效性检查。当前目标域尚未绑定 `isConfirmSearch`、`setCascadeDefault`、`queryDataForId` 的 owner/回调副作用及完整 watch/nextTick/observation 生命周期。候选不给 `expected_after`，比用空 stub 猜完整目标更稳妥；不重判既有 QOBS-ASYNC-01 窄结论。
- **ST-SRC-007 保留 `NOT_READY / NOT_RUN` 合理。** 当前 Read Set 没有完整保存捕获、刷新重开、undo/redo owner。不给 fixture 成功输入输出，不从 JSON 往返或局部值态推断产品恢复行为，claim ceiling 正确。
- **没有扩成合法组合全集或完整 schema。** 五组确定候选仅是来源阶段切片；候选多次声明不覆盖所有 source × shape × defaults 组合，也不关闭完整 producer/runtime/save/load/history 链。R4FS-001 合法组合分母、R4FS-002 完整来源链与 R4FS-004 路径化动作仍开放。
- **没有越过权限/产品范围。** fixtures 把网络、Store 和权限声明限定为零；dependency stub 是隔离依赖，不是 mock 权限验证。Topology r279 和依赖文件保持 S01 `CONDITIONAL`、真实权限 `BLOCKED / NOT_RUN`；不能据此验证只读用户禁止查看/复制/粘贴、权限撤销或产品端到端行为。

## 最小下一步与防误用

1. 先关闭 F-ST-SRC-ORACLE-001，明确 CANCEL 的 test-only rejection observer 与排空边界，或从该局部 oracle 移除 Promise rejection 主张。
2. 之后只准入受限 handler harness：按冻结的 case identity 执行 001..005 的完整声明快照、异步 pending/resolved checkpoint 和零越界写入断言；RED/GREEN 使用同一 Case ID。执行结果另由独立 Validation 核验，不能把本设计复核当成运行通过。
3. ST-SRC-006 需绑定/隔离异步 owner 的完整目标域；007 需补齐保存恢复/history owner。两者未就绪时保持未知。
4. 全形态设计、合法组合分母、端到端产品接线、真实权限和 S01 进入条件仍走各自独立 gate。

未来只保留一行“5 个 source cases ready/covered”会被误读为五项已运行或完整设计已关闭。应继续写明“001..005 为未运行的局部 oracle 候选；004 CANCEL observer 尚待冻结；006/007 NOT_READY；产品 Builder 不准入”。

典型误用：把 MULTI-LAST 当成产品合法映射规则；把局部 handler 快照说成整组件无副作用；把隔离 Promise/依赖替身说成真实 UI 或权限验证。防护是保留源码路径和局部状态域、显式记入未捕获 rejection 边界、将所有行为执行与权限状态继续标为未运行/阻塞。

**最终声明：** 本报告仅判断测试设计候选的静态语义和范围，不证明测试执行、产品行为、完整 F01 设计冻结、权限、AC 通过或 Goal 完成。不得据此准入产品 Builder。
