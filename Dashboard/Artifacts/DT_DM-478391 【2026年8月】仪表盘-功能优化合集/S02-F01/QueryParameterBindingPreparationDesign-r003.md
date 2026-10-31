# 查询参数引用准备器设计候选 r003

状态：`candidate / NOT_REVIEWED / NOT_FROZEN`。这是 R4-04 中一个离线纯子合同：按调用方给出的精确 source→target ID 映射，从目标组件参数目录复制一组 opaque JSON 参数记录。它不选择/认证映射，不从源配置推导引用，不连接产品入口，也不改变 Goal 或冻结案例。

## 权威范围与产品边界

Goal 分母保持 10 项 AC、26 项 must-have、16 项产品义务，`Scope Delta: none`。本切片仅支持 AC-F01-Q006 和 AC-F04-Q066/Q067 的后续参数引用准备，不关闭任何 AC。

产品分流已由当前源码确认：普通选择路径写入 `parameters`；时间/数值范围引用列表写入 `parametersArr[componentId]`。本 helper 只返回通用 `parameters` 数组值，调用方按明确产品上下文接入上述其中一个位置。调用方必须自行从普通参数引用或范围端点 Map 提取 ID；范围方向由现有 Start/End Maps 及消费者负责。本 helper 不返回端点 Map，不声称端点方向或查询结果正确。

权威源码为 `SqlVariableDetails.java`（14 个字段、ID 有字符串语义）、`QueryConditionConfiguration.vue`（普通与 range 参数生成）及 `useFilter.ts`（普通和 range 参数消费）。静态源码不能证明候选目录获授权、跨数据集兼容或真实运行行为。

## 函数合同与运行时输入域

预期导出 `prepareQueryParameterBindings(input: unknown): QueryParameterBindingPreparationResult`。成功形状严格为 `{ ok: true, targetComponentId, parameters }`；失败形状严格为 `{ ok: false, reason }`。reason 集合固定为 `invalid_input | parameter_mapping_missing | target_parameter_missing | target_parameter_ambiguous | target_parameter_collision`，不返回 partial。

运行时接受的根和记录均须是 plain record：原型精确为 `Object.prototype` 或 `null`；拒绝 null、数组、函数、Date/Map/Set/class instance 等 exotic object。输入字段须是根对象自有属性：`targetComponentId` 为非空字符串；`sourceParameterIds` 为数组且每项非空字符串；`targetIdBySourceId` 为 plain record；`targetParameterCatalog` 为数组且每项 plain record 并带自有非空字符串 `id`。source ID 空数组合法，返回空参数列表。

映射仅从 `targetIdBySourceId` 的自有可枚举键读取，值必须为非空字符串；必须使用 `Object.hasOwn` 或等价自有属性检查，不得接受原型继承属性。合法但未被引用的映射键忽略，但它们的值仍参加输入形状校验。

目录记录是 JSON-safe opaque 数据：递归只允许 null、string、boolean、有限 number、数组及 plain record；拒绝 undefined、bigint、symbol、function、NaN/Infinity、accessor、exotic prototype 和循环引用。未知自有可枚举键及嵌套 JSON 值原样保留。此规则只定义可复制数据域，不验证 `SqlVariableDetails` 的完整14字段 DTO schema，也不区分参数与普通字段。

准备器必须深拷贝目标记录，输入全程保持不变。返回的任何可变对象/数组均不得与输入图共享对象身份；不要求冻结输出。

## 失败优先级和重复策略

稳定校验顺序：

1. `invalid_input`：检查根/字段形状、全部 source ID、映射所有自有值、目录所有记录及 ID、所有 opaque 值的递归 JSON-safe 合法性。遇到此类问题先于映射解析失败。
2. `target_parameter_ambiguous`：目标目录任意重复 ID 均拒绝，包括未引用记录。
3. 按 source ID 首次出现顺序去重后逐项检查：无自有映射为 `parameter_mapping_missing`；目标 ID 不在目录为 `target_parameter_missing`；目标已由另一不同 source ID 占用为 `target_parameter_collision`。多项同优先级问题时，以首次出现的 source ID 决定结果。

相同 source ID 重复仅保留首次并按首次出现顺序输出。不同 source ID 映射同一目标及重复目录 ID 的拒绝，只界定本 helper 的局部无歧义支持范围，不是产品永久规则。

## 可执行 oracle

Fixtures 保留 PBP-001..010 原身份并新增覆盖输入边界、全目录重复、冲突优先级、交错去重、prototype-looking ID 和继承属性的用例。运行时构造用例另以受限 DSL 在调用前构造 undefined、函数、NaN、循环、继承原型及 accessor；DSL 是测试指令，不是传给 helper 的 JSON 数据，不得执行 fixture 文本或 eval。

操作级断言按结果分类：

- 所有调用：调用前冻结输入可达对象图；调用后校验输入与快照深相等。
- 成功且 parameters 非空：检查完整 expected；枚举输出可变节点并与所有输入节点比对引用身份；对有明确 mutation path 的用例，修改输出值、确认输出确实改变，并确认输入快照不变。
- 成功且 parameters 为空：检查精确空列表形状；引用隔离为真空条件，不做不存在的嵌套变异。
- 失败：仅允许精确 `{ok:false,reason}`，确认没有 targetComponentId、parameters 或 partial payload；不对失败结果执行输出变异。

r002 的 PBP-R2-01 由严格 plain-record/递归 JSON-safe 域和显式 runtime construction DSL 处置；R2-02 由按 success-nonempty/success-empty/failure 分类的 mutation oracle 矩阵处置；R2-03 通过新候选 r003 文件、Fixtures v3 与对应 digest 作为新审查身份处置。原 r001/r002 和两份审查报告均保留，不覆盖历史。

## 调用方前提与非目标

调用方必须提供：已从当前组件配置中验证提取的 source ID 列表、由独立规则校验的精确映射、已确认属于目标组件的目录以及真实 target component ID。PBP-010 中 `|DE|...` 仅是不透明合成字符串例子，不能证明跨数据集兼容或映射授权。helper 不推断名称、alias、type、datasetTableId/groupId 或 `|DE|` 语义。

不处理六个 range Map、scalar/range 来源识别、完整 DTO schema/version 兼容、searchQuery、Vue/API/Store、权限、SQL、保存/预览、产品错误文案或持久化。产品 Builder 仍须满足 S01 F01 Entry Packet 中与该切片相关的 CONDITIONAL 进入条件；Packet 可读，不应称不可用。真实权限实例目前 `BLOCKED / NOT_RUN`。

## 实施及声明边界

本轮是该设计交付物第 3/3 轮审查。只有 r003 审查给出明确 `READY_FOR_BOUNDED_ADMISSION` 或等价有界准入，才可冻结专属 Contract/Cases、可信断言级 RED、Builder card/Context，并验证绑定精确模块与测试 target 的 admission。Builder 只新增 `core/core-frontend/src/custom-component/filter-copy/query-parameter-binding-preparation.ts`、`core/core-frontend/tests/filter-copy-query-parameter-binding-preparation/` 下定向 harness/cases 和 `Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/evidence/` 下 RED/GREEN 记录。冻结文件不在 Builder write scope；不得修改产品接线文件、QPIPE/QPAD 或现有组件入口。

即使 helper 的 RED/GREEN/独立 Validation 通过，也只证明以上离线子合同，不证明产品接线、真实权限、AC 通过、R4-04 或 Goal 完成。只读不可查看/复制/粘贴、权限撤销及恢复在真实多用户隔离实例就绪前保持 `BLOCKED / NOT_RUN`；不以 standalone/admin/mock 替代。
