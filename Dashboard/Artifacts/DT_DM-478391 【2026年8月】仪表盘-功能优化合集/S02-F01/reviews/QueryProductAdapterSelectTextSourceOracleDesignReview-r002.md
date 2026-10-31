# SH-SELECT-TEXT 来源 oracle 设计 r002 独立复核

## 双结论

- **Design Freeze Validity：PARTIAL PASS WITH FINDING。** ST-SRC-002..005 的声明入口、状态域、expected 与当前源码相符；ST-SRC-004 的取消适配器符合维护者选定的方案 2，前提是它只表示“取消信号且不进入确认回调”。ST-SRC-001 的 `dateConstructorCalls: 2` 缺少明确观测窗口：`options.ts` 在模块求值时还会创建两个 Date，故本轮不能把 001..005 整组冻结为唯一 oracle。
- **Implementation Entry Readiness：NOT READY（整组 001..005）；有限通过（002..005 的隔离 handler harness）。** 修正并独立复核 001 的 Date 计数协议后，才可评估把 001 纳入同一批 harness。当前最多允许单独实现 002..005 的纯 handler harness；不得接入产品 UI/Store/API、权限、保存或历史路径。
- **范围与权威：** Goal 分母保持 10 项 AC、26 项 must-have、16 项产品义务，`Scope Delta: none`。16 项产品义务仍 `NOT_RUN`；S01 F01 仍为 `CONDITIONAL`，真实权限仍 `BLOCKED / NOT_RUN`。006/007 仍 `NOT_READY / NOT_RUN`。本报告不改变这些状态。

## 输入绑定与审查边界

当前审查入口绑定 `SH-SELECT-TEXT-SOURCE-ORACLE-DESIGN-REVIEW-r002`：Context 的 required read set 共 14 项且 `skipped_reads` 为空；r283 记载该 Context、卡片 canonical digest 和 `semantic_review` route 已物化，入口状态为 `ready_for_independent_review`。前一 Delta Validation 所记录的旧 Context route 差异属于历史入口，不作为本轮新的阻断；当前审查仍按只读验证任务执行。Goal、Design/Cases r002、源码、前次 Review、Delta Validation、QOBS 裁定、S01/权限状态及 Sessions 均已复核。

本轮只做静态设计与源码核对，未运行 runner、编译、浏览器、网络、保存/历史或权限场景，未修改被审 Design/Cases、源码、Goal 或 Dashboard 状态面。所有 ST-SRC 用例仍为 `NOT_RUN`。文档结构或静态来源一致不能替代行为执行。

## ST-SRC-001..005 复核

| Case | 结论 | 来源核对与边界 |
|---|---|---|
| ST-SRC-001 CREATE | **有条件支持；有 P2。** | `options.ts:6-66` 的 `infoFormat` 返回值与输入字段、GUID、两个 `new Date()` 及其余常量字段相符；`defaultValueFirstItem` 不在该返回值中，缺键与 own-property undefined 的区分也保留正确。但 `options.ts:103,111` 的 `attributes` 在模块求值时另外调用两次 `new Date()`。候选只写“安装 fixed Date 与 guid 依赖后调用一次”，没有界定计数在模块加载前后开始；同一 expected 可以因此得到 2 或 4 次 Date 构造。详见 F-ST-SRC-ORACLE-002。 |
| ST-SRC-002 DATASET-CHANGE / SOURCE-SWITCH-DATASET-ALREADY-SET | **支持。** | `QueryConditionConfiguration.vue:987-1006` 的 `handleDatasetChange` 清 `field.id`、`displayId`、`sortId` 并请求字段；`getOptions` fulfillment 写入同一 `condition.dataset.fields`（:2017-2021）。已选 dataset 的 `handleValueSourceChange`（:1024-1064）仅重置 default/select 并经 `multipleChange`，不清字段、不发请求。pending 与 resolve 检查点表达了旧 fields 保留及响应后写回。 |
| ST-SRC-003 ONE / MULTI-LAST / EMPTY | **支持，限当前循环行为。** | 缺 dataset 时按 `checkedFieldsMap` 枚举顺序选最后一个 truthy 映射，再由匹配 `fields` 的最后项写 dataset id（:1027-1045）。没有映射时仍以空 dataset id 调用 `getOptions`；该 API 是否接受空 ID 未知。用例把这些限定为当前源码行为，没有宣称是合法映射规则。 |
| ST-SRC-004 CONFIRM / CANCEL | **状态 oracle 支持，有界。** | `handleCurrentChange` 记录旧/新 dataset（:964-977）；确认回调更新 dataset、按旧 dataset 清 cascade、清缓冲后进入字段清理/请求路径（:979-1005；:1216-1225）。取消分支只用 test adapter 发出取消信号且不调用 `onFulfilled`，用来验证 handler 未执行确认回调。它不创建真实 JS Promise rejection，因此不验证真实 Element UI 的 reject、未处理拒绝或错误提示。这个边界符合维护者选择的方案 2，不构成产品取消验收。 |
| ST-SRC-005 MISSING / EMPTY / WHITESPACE / VALID / MANUAL-BUFFER-WHITESPACE | **支持，限声明前置。** | `validate` 在检查 manual source 前可能先清 `selectValue/defaultValue`（:1452-1456），随后用 truthy filter 检查非空值（:1559-1565）；故缺失/空数组可在已有清理副作用后拒绝，全空白字符串仍 truthy。`confirmValueSource` 则 trim 后拒绝空白，并在赋值前返回（:1725-1747）。快照保留了这两条入口及其副作用差异；未扩展到任意 required、参数或其他 displayType 组合。 |

001 的返回字段和 002..005 的状态域均为局部合同，不是整个 Vue 组件、Store、持久化或产品快照。JSON 保留完整输入/expected 和零网络/Store/权限声明，适合在范围收窄后实现独立 harness；它们目前不是行为执行证据。

## Finding

### F-ST-SRC-ORACLE-002（P2）：ST-SRC-001 的 Date 构造次数没有固定观测窗口

**证据：** `infoFormat` 在 `options.ts:42,46` 两次调用 `new Date()`。同一模块的 `attributes` 在顶层初始化时还在 `options.ts:103,111` 两次调用 `new Date()`。ST-SRC-001 expected 写 `dateConstructorCalls: 2`，步骤要求先安装 fixed Date 再调用 `infoFormat`，但没有说明模块何时导入、计数何时开始/重置，或该字段只计 `infoFormat` 调用范围。

**影响：** 若测试在装好 Date shim 后导入模块并累计从导入开始的调用，会观测到 4 次；若先导入再安装 spy，或在调用前重置计数，则会得到 2 次。当前文本没有唯一、可复现的计数 oracle。固定返回日期仍可实现，但调用次数断言不能直接冻结。

**最小处置：** 在候选修订中明确稳定的模块加载顺序和计数边界，例如先加载模块，再安装/重置仅作用于 `infoFormat` 调用的计数器，并断言其返回的两个日期；或把模块初始化的两个调用单独计数并纳入预期。修改后仅需对 ST-SRC-001 做有界 Delta Validation。无需改产品源码。

## 分母、遗留边界与后续准入

- **分母与产品义务：** 10/26/16 与 `Scope Delta: none` 保留，全部 16 项产品义务仍未运行；不能把 AC-S02-02/03 在这些局部快照中的覆盖写成产品验收。
- **QOBS-ASYNC-01：** 维护者已选择迟到成功响应不含 C 时重新请求核对 C；该语义只用于异步枚举相关边界。本轮不复核或扩大它，也不因这些 source-stage case 声称该竞态已通过测试。
- **ST-SRC-006/007：** 006 因异步 owner、watch/nextTick/observation 调度及 callback 副作用目标域未冻结，007 因保存/重开/history owner 缺失，均保持 `NOT_READY / NOT_RUN`，不加入本轮 harness。
- **遗留 finding：** 全形态合法组合分母、完整 producer-to-consumer/source-read/target-commit 链、字段动作、保存恢复/history 与真实权限仍开放；本报告不关闭 R4FS 类 finding，不解除 S01 或权限阻塞。
- **有限 harness 边界：** 002..005 可实现纯 handler harness，只使用受控 Promise、消息记录器和局部对象；必须维持指定 identity、pending/resolved checkpoint、零真实网络/Store/权限/发布/保存副作用。001 待 F-ST-SRC-ORACLE-002 修订并复核。不得接入产品 UI、Store、API、权限、真实查询、保存/恢复/history；不得把 test adapter 的取消信号描述成真实 Promise rejection 验证。

**Claim ceiling：** 本报告只支持 002..005 的有界局部 handler 设计，并指出 001 的 Date 计数协议缺口；不证明任何用例已执行、产品行为/权限已验收、完整 F01 设计已冻结或 Goal 已完成。EOF

git diff --check -- 'Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/reviews/QueryProductAdapterSelectTextSourceOracleDesignReview-r002.md'
sha256sum 'Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/reviews/QueryProductAdapterSelectTextSourceOracleDesignReview-r002.md'