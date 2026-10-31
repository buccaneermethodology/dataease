# ST-SRC-006 首项默认值/级联回调局部 harness 设计候选 r001

## 状态

`candidate / NOT_FROZEN / NOT_RUN`。本文件定义局部源码 harness 的候选边界，不是产品设计冻结或 Builder 准入。

## Authority 与目标

维持 `Goal.final.json` 原始 10 项 Goal AC、26 项 must-have、16 项产品义务及 `Scope Delta: none`。目标是为 ST-SRC-006 的源代码路径形成可复核的局部 oracle，帮助后续实现/验证前识别 Select.vue 首项默认选择与其回调 owner 的状态变化。

## Source owner 路径

- `core/core-frontend/src/custom-component/v-query/Select.vue:533-562`：`setDefaultValueFirstItem`。空 options 直接返回；运行态从首个 option 写入 `selectValue` / `config.selectValue` / `config.mapValue`，回写级联值、触发级联，再经 `nextTick` 调 `isConfirmSearch(id, !isFromFromCascade)` 并清标记；配置态改写默认值与映射并调用 `setCascadeDefault`。
- `Select.vue:358-521`：枚举异步成功处理，在 `finally` 中对 `disabledFirstItem && defaultValueCheck` 设置 300ms timer 后调用首项默认处理；其余成功路径处理默认值校验、映射回写和查询触发。此函数具有请求状态、异常、观察请求等多重依赖，不进入本候选 harness。
- `Select.vue:105-110, 184-210`：`isConfirmSearch`、`setCascadeDefault` 等均为注入回调；其父级 provider 需要分别定位，mock callback 不能冒充真实组件树。
- `Select.vue:134-157, 160-194`：首项主 helper 的本地依赖 `setDefaultMapValue`、`setCascadeValueBack` 与 `emitCascade`。若目标是断言真实局部映射/级联序列，harness 必须 AST 提取这些实际 helper；不得替换成 mock 后再声称已测级联副作用。
- `core/core-frontend/src/custom-component/v-query/QueryConditionConfiguration.vue:165-186`：`setCascadeDefault` owner，按级联条件清空 select/default/map 字段。
- `core/core-frontend/src/custom-component/v-query/Component.vue:484-487`：`isConfirmSearch` owner；有确认按钮且未禁用首项时阻止查询，否则转发 `queryDataForId(id)`。
- `Component.vue:387-431`：`queryDataForId` 执行必填校验、首载状态与 emitter 派发；由于其依赖组件/store/context，本地回调记录不证明此完整行为。

## 候选范围与非目标

候选 harness AST 提取真实 `setDefaultValueFirstItem`、`setDefaultMapValue`、`setCascadeValueBack`、`emitCascade`、`emitCascadeConfig`、`QueryConditionConfiguration.vue:setCascadeDefault` 与 `Component.vue:isConfirmSearch` 函数 initializer，在隔离 JS scope 中注入响应式 ref 的最小替身、必要静态来源数据和可记录的 emitter/nextTick。实际提取并执行 `Component.vue:isConfirmSearch`，以 fixture `componentWithSure` 验证守卫；其下游 `queryDataForId` 明确是记录调用的外部 stub，不声称已覆盖完整查询校验/emitter 行为。只有与 Vue injection、Pinia/DOM 连接无关的边界可 stub。候选检查：

1. 运行态单选、非空 options：首项成为选择值；map 回写、级联回写与 emit 顺序正确；查询回调发生在 nextTick 队列释放之后。
2. 运行态多选、非空 options：首项成为长度为 1 的数组，并检查复制隔离及 map 回写。
3. 运行态来自级联时：`isConfirmSearch` 接收 `(id, false)`，且级联来源标志随后复位。
4. 空 options：函数不修改任何状态且不调回调。
5. 配置态：默认值/映射更新并调用实际提取的 `setCascadeDefault`；其 owner 只清理符合 `optionValueSource/displayType/id` 谓词的下游条件。
6. `isConfirmSearch` owner：确认按钮守卫阻止/允许转发的局部返回与调用快照。

完整快照应包括 cascade tuple 中每个 target 的 `selectValue/currentSelectValue`、映射字段、动态 cascade event 名称及顺序、`isConfirmSearch` 的参数、nextTick 队列状态；配置态还需覆盖真实 `setCascadeDefault` 所清空的字段。

不测试 300ms timer 与完整 `handleFieldIdChange`、Vue watcher、DOM、UI/API/Store 网络调用、真实 cascade provider wiring、query emitter 实际订阅、数据库保存/重开/history、权限及用户行为。若后续确定必须覆盖这些路径，应另建合同和准入，不将 mock 结果外推。

## Oracle / 防止过度声明

每 case 比较完整受限状态（选择值、配置值、map/default map、级联条件、回调记录和 nextTick 调度队列）；nextTick 用可控队列，不用墙钟等待。源 AST 只读抽取已列函数；不执行 SFC 模块。具体 before/expected/checkpoint 在 `ST-SRC-006-SourceHandlerHarnessCases-candidate-r001.json` 逐 case 记录；重点检查 nextTick flush 前后、配置态级联条件的合格/不合格分支。Case identity 需与 ST-SRC-006 原候选一一映射。可信 RED/GREEN 要求：保持 case_id/variant_id 与 runner identity 不变，只变异一处 expected full-snapshot leaf；失败须命中同一身份的确切快照断言；恢复 fixture 原字节后同一 identity GREEN，再记录 hashes。

此候选若最终执行，只支持这些真实函数（含四个 Select 本地 helper）在隔离输入/注入外部依赖下满足局部状态 oracle，不支持完整级联产品行为或 Goal AC。

## 风险与准入

- 当前工作树存在 Select.vue、Component.vue、QueryConditionConfiguration.vue 既有产品差异；实现前必须为抽取的每个函数核对工作树与 HEAD 差异，说明其来源。
- `nextTick`/`isFromFromCascade` 的变化顺序属于语义风险；contract/cases 需要独立 Review 后才可冻结。
- `setCascadeDefault` 与 `isConfirmSearch` 是跨组件 owner，单独测真实函数仍不代表 provide/inject 连线；claim ceiling 必须写入 contract/handoff。
- 用户此前明确不准用 standalone 权限作替代；本合同不含权限判断，相关 Goal obligations 继续 `BLOCKED / NOT_RUN`。

## 建议实现顺序

1. Review 本候选及最小输入/完整快照，特别核对注入边界与跨组件 claim ceiling。
2. 若 Review 通过，冻结 machine-readable Contract/Cases 并保存可信 RED。
3. 由 Builder 实现 AST harness；同 identity GREEN、RED、定向 ESLint 与 diff-check。
4. 独立 Validation 复跑后，才把这项局部结果作为有限证据绑定到相关 Goal AC；产品/权限验收仍各自未验证。
