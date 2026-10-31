# 查询参数引用准备器设计候选 r002

状态：`candidate / NOT_REVIEWED / NOT_FROZEN`。这是 R4-04 中一个离线纯子合同：按调用方给出的精确 source→target ID 映射，从目标组件参数目录复制一组 opaque JSON 参数记录。它不选择/认证映射，不从源配置推导引用，不连接产品入口，也不改变 Goal 或冻结案例。

## 权威范围与产品边界

Goal 分母保持 10 项 AC、26 项 must-have、16 项产品义务，`Scope Delta: none`。本切片仅支持 AC-F01-Q006 和 AC-F04-Q066/Q067 的后续参数引用准备，不关闭任何 AC。

产品分流已由当前源码确认：普通选择路径写入 `parameters`；时间/数值范围引用列表写入 `parametersArr[componentId]`。本 helper 只返回通用 `parameters` 数组值，调用方按其明确产品上下文接入上述其中一个位置。调用方必须自行从普通参数引用或范围端点 Map 提取 ID；范围方向由现有 Start/End Maps 及消费者负责。本 helper 不返回端点 Map，不声称端点方向/查询结果正确。

权威源码为 `SqlVariableDetails.java`（14 个字段、ID 有字符串语义）、`QueryConditionConfiguration.vue`（普通与 range 参数生成）及 `useFilter.ts`（普通和 range 参数消费）。静态源码不能证明候选目录获授权、跨数据集兼容或真实运行行为。

## 函数合同

预期导出 `prepareQueryParameterBindings(input: unknown): QueryParameterBindingPreparationResult`。成功形状为 `{ ok: true, targetComponentId, parameters }`；失败形状严格为 `{ ok: false, reason }`。reason 集合固定为 `invalid_input | parameter_mapping_missing | target_parameter_missing | target_parameter_ambiguous | target_parameter_collision`，不返回 partial。

输入为普通对象：

- `targetComponentId`：非空字符串。调用方负责证明目标组件存在且该目录属于该组件。
- `sourceParameterIds`：字符串数组，每项非空。空数组合法，返回空 parameters。重复源 ID 仅保留首次出现，并按首次出现顺序产生结果。
- `targetIdBySourceId`：普通对象；每个自有可枚举值必须是非空字符串，键按精确源 ID 查找。结构正确但未引用的映射键忽略。
- `targetParameterCatalog`：数组，每项为普通对象且有自有非空字符串 `id`。所有目录项必须是 JSON-safe opaque 记录；不校验 14 字段 DTO、参数/普通字段类别或值语义。

JSON-safe opaque 内容限 null、string、boolean、有限 number、数组及普通对象。未知字段和嵌套结构完整保留。目标记录必须深拷贝；输出任一可变节点均不得与输入共享对象身份。helper 不改变输入。Fixtures 明确要求先递归冻结输入，调用后核对深相等与引用不共享，再修改输出嵌套值并确认输入不变；该语义不要求冻结输出。

全目录重复 `id`（包括本次未引用项）均以 `target_parameter_ambiguous` 拒绝。不同源 ID 映射到同一目标 ID 以 `target_parameter_collision` 拒绝；重复目录与多对一拒绝只定义本 helper 的无歧义局部支持域，不代表产品永久规则。相同源 ID 重复时按首次出现折叠。

稳定校验次序：

1. `invalid_input`：依次校验顶层形状/目标组件 ID、source ID 列表全部元素、映射所有自有可枚举值、目录所有对象及 ID、全部 opaque JSON-safe 值。
2. `target_parameter_ambiguous`：目标目录任意重复 ID。
3. 按去重后的 source ID 首次出现顺序逐项检查：缺映射 `parameter_mapping_missing`；映射目标目录缺失 `target_parameter_missing`；映射目标已由另一 source 占用 `target_parameter_collision`。先遇到的 source 决定同级失败。

## 调用方前提与非目标

调用方必须提供：已从当前组件配置中验证提取的 source ID 列表、由独立规则校验的精确映射、已确认属于目标组件的目录以及真实 target component ID。PBP-010 中 `|DE|...` 仅是不透明合成字符串例子，不能证明跨数据集兼容或映射授权。helper 不推断名称、alias、type、datasetTableId/groupId 或 `|DE|` 语义。

不处理六个 range Map、scalar/range 的来源识别、完整 `SqlVariableDetails` schema/version 兼容、searchQuery、Vue/API/Store、权限、SQL、保存/预览、产品错误文案或持久化。产品 Builder 仍必须另外满足 S01 F01 Entry Packet 中与该切片相关的 CONDITIONAL 进入条件；Packet 可读，不应称不可用。真实权限实例目前 `BLOCKED / NOT_RUN`。

## 第 1 轮 findings 的处置

- PBP-R1-01：改为通用列表值，说明接入 `parameters` 或 `parametersArr[componentId]` 由 caller 选择；六个 Maps/端点方向排除。
- PBP-R1-02：冻结输入域、空列表规则、全目录重复 ID 范围、错误枚举和优先级；新增冲突优先级 case。
- PBP-R1-03：新增递归冻结、前后深等价、输出节点无共享身份、修改输出不污染输入的操作级 oracle。
- PBP-R1-04：明确 JSON-safe opaque 边界而非 DTO 校验；成功 case 含 DTO 14 字段、枚举及未知嵌套值的保真样本。
- PBP-R1-05：重复目录与多对一仅为 helper 局部拒绝边界，不提升成产品策略。
- PBP-R1-06：明确 caller 的 source 提取、映射有效性、目标目录归属前提；PBP-010 仅为 opaque 样本。
- PBP-R1-07：纠正 S01 Packet 可读、进入条件 CONDITIONAL。
- PBP-R1-08：后续 Builder 需独立冻结 Contract/Cases、可信 RED，并列明文件/测试/证据路径和 target-bound admission；不沿用设计 lane admission。

## 实施和声明边界

设计独立审查通过后，建立独立实现卡及有效 admission；实现只新增 `core/core-frontend/src/custom-component/filter-copy/query-parameter-binding-preparation.ts`、`core/core-frontend/tests/filter-copy-query-parameter-binding-preparation/` 下定向 harness/cases 和 `Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/evidence/` 下 RED/GREEN 记录。冻结文件不在 Builder write scope。不得修改产品接线文件、QPIPE/QPAD 或既有组件入口。

本 helper 的 RED/GREEN/独立 Validation 至多证明上列离线子合同，不证明真实权限、产品接线、AC 通过或 R4-04/Goal 完成。权限要求（只读不可查看/复制/粘贴、撤权及恢复）在真实多用户隔离实例就绪前保持 `BLOCKED / NOT_RUN`；不以 standalone/admin/mock 替代。
