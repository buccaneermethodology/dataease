# SH-SELECT-NUM 来源阶段追踪独立评审 r003

## 结论

**`PASS_WITH_FINDINGS / STATIC_SOURCE_INDEX_ONLY`；`NOT_READY_FOR_NUMERIC_ORACLE_OR_FREEZE`。** 第 3/3 轮的 r003 已准确吸收 r001 五项及 r002 三项 findings：数值来源映射字段已按运行态/配置态分开；配置确认入口已与 durable save 缺口分开；枚举迟到选择的验证路径已加入静态索引。当前源码支持其所述的“缺 C 时发起一次核对、核对后结束 loading、缺失时呈现 invalid”局部控制流，但未证明整个维护者决策已在全部必要门控下实现或产品行为通过。决策规定的 request/token generation 和 design revision 门控，与当前 `ObservationRequest` 中可见的字段并非显式一一对应；r003 对裁定结果的摘要也未逐项复述 C 存在、核对失败、保留旧 options、无过滤查询等条件。这些属于非阻断的来源边界/澄清项：候选明确保留异步验证未闭合，不越权宣称实现符合裁定。

本 Review 只判断静态来源索引与未决清单。它不裁定 type 2/5 的合法组合、numeric schema、产品语义或 bug，也不证明保存/恢复、权限或 Goal AC。Goal 保持 10 项 AC、26 项 must-have、16 项产品义务与 `Scope Delta: none`；16 项产品义务仍 `NOT_RUN`。R4FS-001..004 仍 OPEN，R4FS-005 `BLOCKED / NOT_RUN`；S01 F01 `CONDITIONAL`，真实多用户权限仍未验证。

## 审查绑定

按最终 r003 Lane Card 的 renderer prompt 完成全量审查。Lane Card canonical SHA-256 `ce8ac706d2fbdfd566fb1d7dfd2cdc5ab58f5f4258c6c7445afea602aaae7114`，`lane_task_card.py validate` 为 `pass`；renderer 输出与 Card execution prompt 一致。Context SHA-256 `b37b5938a5fa69964bbcd28d89d1d4dc92cc471a85d78b7d9313182667916554`，验证通过，27 项 required-read 全部存在且摘要匹配，`skipped_reads=[]`。Topology-actual-r347 记录本次独立审查 dispatch，分母及权限/S01阻塞保持不变。

被审 r003 SHA-256 `192a09534d6a72e3c2e348cc48d3539641bbe7ce56afa3d4fd623d47ac9e7f64`；r002 Review `f785ab9810c743b99f753b53e34b8f69f6f949aff240bbca181a0fc0286ae300`；维护者裁定 `MaintainerDecision-QOBS-ASYNC-01-r001.md` SHA-256 `d85931cea91604e95c5c97f30a041c42d30df81953f03a7ab564ed81f85f9761`。当前源码摘要复算与 Context 一致：`Select.vue` `30efd4a571a8146a68c8a57e64dfee93208670db4155b8f9257a4553efcfcac8`；`QueryConditionConfiguration.vue` `0b88bcdf92d15aceae52ca2992e7a8b4165e3f5cfc3f9cb7435296d7c7e9e047`；`Component.vue` `152703881a926e747e4e42f7c593a1558708efa73a3138cdb823cc519b01d081`；`options.ts` `4be7d37dd75cf8a3759e807e1fd996194be2f35a829ad2f1306dc3a8ec061fc4`；`dataset.ts` `8d5be0a3e1b0c9fe7ef46c59007e8ed6cf39993b54008a52db54619350d370d4`。

## 历史 findings disposition

| Finding | Disposition | 复核结果 |
|---|---|---|
| SNTR-R1-001 / P2 | **已准确处置** | r003 保留 `validate().some`、type 2 的 `field.id` 优先校验及 `defaultValueCheck=false` 提前返回；该返回会跳过后续通用来源检查。type 2 手工输入 `.number`、专门默认值分支接受 numeric `0`；type 5 无同样专门分支且未用 `.number`。静态差异未被推为 5 的策略或产品缺陷。源码：`QueryConditionConfiguration.vue:1261-1264,1468-1483,1559-1578,3492-3501`。 |
| SNTR-R1-002 / P2 | **已准确处置** | 配置 required/default owner `QueryConditionConfiguration.vue:1412-1445` 与运行 required owner `Component.vue:815-847` 分列；前者检查 `defaultValueCheck`/配置默认值，后者检查 `selectValue` 且显式允许数值 `0`。不把配置校验当作查询行为验证。 |
| SNTR-R1-003 / P2 | **已准确收窄** | `Select.vue:134-152` 以 `displayId || field.id` 查枚举行并提取 `field.id` 值。运行态 `handleValueChange` 写 `config.value.selectValue/mapValue`；配置态写本地 `selectValue` 及 `config.value.defaultValue/mapValue/defaultMapValue`，不在该分支写 `config.value.selectValue`，两者均有 cascade 回写（`264-289`）。枚举变更路径另写两个 map 字段（`439-447`）。原始类型、精度及持久化仍未知。 |
| SNTR-R1-004 / P3 | **已准确处置** | `Select.vue:264-296` 正确区分运行态配置对象字段与配置态本地值；类型切换重置本地 `selectValue` 和 `defaultValue`，不等于清理持久配置对象 `selectValue`。 |
| SNTR-R1-005 / P3 | **已准确处置** | `Select.vue:1016-1041` 字符串化 option 值，多选 `checked` 用字符串化比较、单选与原始 `ele` 比较；输入端只在 type 2 使用 `.number`（`QueryConditionConfiguration.vue:3488-3501`）。消费关系/运行影响仍不作产品结论。 |
| SNTR-R2-001 / P3 | **已准确处置** | r003 明确分开运行态 `mapValue`、配置态 `mapValue/defaultMapValue` 和级联写回，消除了 r002 的字段 owner 歧义。 |
| SNTR-R2-002 / P3 | **已准确处置并保留缺口** | `QueryConditionConfiguration.vue:1592-1704` 的 `confirmClick()` 分出受管理 prepare/commit 与旧直写路径，更新 query `propValue/cascade` 并记录 snapshot、发出事件。r003 明示这些是编辑确认/状态提交，不等同 dashboard/canvas durable payload、后端保存或重载。 |
| SNTR-R2-003 / P3 | **已准确补充并保留缺口** | r003 加入 observation request、迟到成功映射/verification、迟到失败 unverified、普通路径与 `finally` 差异；未将局部控制流声称为完整异步或级联验证。 |

## r003 静态断言和维护者决策映射

- **配置确认：** `confirmClick()` 在 `1592-1704` 先校验，再处理 cascade；managed path 准备和提交替换根、选择组件并发布事件，legacy path 更新 `queryElement.value.propValue/cascade` 并记录 snapshot。候选没有据此声称保存完成。配置确认到 durable save payload、后端保存、载入/重开 owner 未被本 Context 的源码绑定，缺口保留得当。
- **迟到 C 的可见路径：** `ObservationRequest` 和其 `phase/runtimeGeneration/sourceGeneration/selectedValue/requestInputKey` 位于 `Select.vue:691-716`；支持条件由 `743-757` 限定。普通请求在 `358-364` 发出；`isLateSelectionObservation()` 在 `875-883` 识别选择已改变。迟到成功结果若包含当前 C，`370-376` 交给 `setObservationState(valid, rows)` 更新 option 并关闭 loading；若不包含，`378` 启动 verification。verification 发出一次 `enumValueObj()`（`848-869`），成功按是否找到 C 设置 valid/invalid；失败设为 unverified（`870-872`）。`setObservationState()` 更新 options（有 rows 时）、渲染 invalid/unverified disabled option 并关 loading（`818-845`）。专门 observation 分支将 `observationHandled=true`，普通 `finally` 会提前返回（`370-380,449-469`），不走普通路径重置默认值或 queryData；这是静态控制流事实，不证明终端 UI/产品行为。维护者决策与上述有限路径相符。
- **决策范围与门控：** 维护者原裁定还规定首次响应加一次核对共两次枚举请求、不额外触发 filter query、核对成功包含 C 时保留并显示为有效、核对失败保留 C/先前 options 并标未核实且不自动重试；这些与源码的单次 verification、无 query 调用、保留现有 selectedValue/options、`unverified` state 可静态对应，但 r003 对裁定的摘要没有逐条复述这些条件。更重要的是，裁定要求 raw/design revision/token generation/request identity 等门控；源码可见 `request id` 通过 active-request 对象身份、`configRaw`、condition id、source generation、输入签名及 `queryLifecycleAllowed()` 检查（`759-783`），但 `ObservationRequest` 没有显式 `tokenGeneration` 或 design revision 字段。`queryLifecycleAllowed()` 由 `Component.vue:72` 提供为 Store 的 `querySingleSelectAllows(element)`；该 owner 源文件不在 Context 的 27 项 required-read 中。本 Review 为理解此布尔门控作了额外只读点查，文件 SHA-256 `ebda5b9ac14425e9ed3a08ff489150197222f1900949b62209493341c6948189`；其中 `allowsQuery()` 只判断 session phase 与 current component identity（`query-single-select-session.ts:560-563`），没有把 token generation/revision 暴露给观察请求。不得从对象身份等价推出维护者要求的 token-generation/design-revision fencing 已满足；此点仍是来源绑定缺口，而非产品行为判定。

## 非阻断 findings 与待澄清项

| ID / 严重性 | Finding | Disposition |
|---|---|---|
| SNTR-R3-001 / P2 | **维护者裁定要求的 fencing 字段与源码可见 request gate 未形成显式映射。** 裁定要求 token generation 和 design revision；观察请求目前记录 runtime/source generation、raw/component identity、input key 和 active-request identity，没有显式 token generation/design revision。 | r003 未声称这些门控已实现或验证，且保留 async 未闭合，因此不阻断有界静态索引；后续实现/行为验证必须明确此映射或保留为缺口，不能用当前身份检查推断字段等价。 |
| SNTR-R3-002 / P3 | **维护者裁定摘要没有完整列出结果矩阵。** r003 的静态实现段提到 C 仍存在时 valid，也描述了缺失时核对和 invalid；但其决策摘要没有逐项呈现核对失败时保留先前 options/标 unverified/停止自动重试、总计两次 enum 请求及零 filter query 等约束。 | 决策原文在绑定文件中，候选也保留“未证明符合策略”；这不导致错误结论。后续若把 r003 单独作为决策导航，引用原裁定并带出完整矩阵。 |
| SNTR-R3-003 / P3 | **late-observation 仅覆盖受限 eligibility。** `observationSupported()` 只对运行态、单选、非 mobile、数据集来源、非 required、无 optionFilter、非首项默认等情形启用（`743-757`）；不适用于所有 displayType 2/5 或所有来源/模式。 | 候选总体范围写为静态来源索引，没有将这段行为推广到所有 shape；建议在引用维护者决策时一并说明适用的实现分支边界。产品 authority 是否意图覆盖其他组合仍未知。 |

上述项均不要求重开 r003 的第 3/3 轮；任何后续决策细化、consumer/persistence 来源图、合同/Cases 或实现应作为独立交付物绑定各自 authority 和验收。当前没有阻断 r003 作为有界静态来源索引使用的问题。

## 全量未决项与 claim ceiling

- **Numeric / shape：** type 2/5 × single/multiple × option source × default/check × field/value metadata 的合法分母仍未定义；numeric `0`、负数、小数、精度/大数、字符串数字、空字符串、`null` 的端到端 identity/序列化仍无 oracle。
- **消费者和生命周期：** query filter consumer/API payload 数值 schema、配置确认到 durable save、Store 保存/加载、模板/复制、保存/重开、undo/redo/历史缺省仍未形成完整来源链。
- **异步裁定：** C 存在/缺失/核对失败、重复/过期响应、token generation/design revision fencing、loading、query/cascade/default 副作用和实际 invalid/unverified 呈现仍没有绑定裁定的产品级验证。静态实现映射不等于行为通过。
- **全形态与前置：** R4FS-001..004 仍 OPEN；R4FS-005 为 `BLOCKED / NOT_RUN`。S01 F01 `CONDITIONAL`；真实多用户权限缺少隔离环境。只读查看/复制/粘贴、撤权/恢复未验证。
- **Goal：** Goal 10 项 AC、26 项 must-have、16 项产品义务、`Scope Delta: none` 均保持；16 项产品义务仍 `NOT_RUN`。本 Review 不构成合法组合判定、Numeric oracle、Design Freeze、Builder 准入、产品/权限验收或 Goal 完成证据。

r003 可作为**第 3/3 轮、有边界的静态来源索引**使用；不得以改名或新 revision 重置本交付物轮次。继续工作应新建独立、绑定完整 authority/合法分母/匹配准入的后续设计或 build 交付物。
