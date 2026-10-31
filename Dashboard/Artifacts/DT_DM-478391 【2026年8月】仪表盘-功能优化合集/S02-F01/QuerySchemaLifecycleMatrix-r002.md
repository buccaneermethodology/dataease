# VQuery 字段生命周期与提交边界矩阵 r002

状态：源码派生设计候选；r001 独立审查发现项的增量修订，待重新独立 Semantic Review。仅覆盖当前 checkout 可见的 VQuery `propValue` / `cascade` 生命周期；不是完整产品 schema 冻结、实现证据或产品验收。Goal 原 10 项 AC、26 项 must-have、16 项产品义务保持不变。真实权限模块与隔离多用户实例仍不可用；只读查看/复制/粘贴、撤权/恢复均为 `BLOCKED / NOT_RUN`。

## r001 独立审查 finding 的处置

- **QSLR-01：部分处置。** `showError`、`auto`、`valueSource`、参数边界及 `options.ts` 初始对象的每个字段现列入逐项清单；`attributes.timeRange` 内部也逐键列出。可见默认字段已逐项赋予候选动作或明确的 `unknown → reject before write`；动态字段并集/历史版本仍未被证明，不能冻结完整白名单。
- **QSLR-02：未由本矩阵关闭。** 本文件继续是广域发现矩阵；没有把所有合法查询形态压成一个永久拒绝域。实现精确子合同须另建唯一 shape、完整输入/输出、目标能力、ID 映射及提交 oracle，并单独复审和准入。
- **QSLR-03：按边界拆分。** 用户已裁定的迟到枚举选择 C 行为固定为：初始成功响应不含用户新选的 C 时，仍保持一次验证请求/loading；验证响应到达即结束 loading；若 C 仍不存在，保留选择并显示无效，不静默清值。复制源默认值在目标枚举中缺失则保留为无效候选，并阻止确认直到用户解决；目标配置不发生部分提交。
- **QSLR-04：已统一执行 oracle。** 未登记 schema/key 的结果是 `UNKNOWN_SCHEMA_OR_KEY`，并在任何目标写入前 `REJECT`；fixture 必须同时断言目标值、级联、历史游标、预览和查询效应不变。已证明的旧版本规则须走版本化映射，不能让 `unknown` 成为可写入结果。

完整独立 review 报告保留于 [r001 review](reviews/QuerySchemaLifecycleMatrixDesignReview-r001.md)。

## 范围与可见调用链

本矩阵以 `options.ts` 的新建条件和 `attributes` 为字段发现入口，以 `QueryConditionConfiguration.vue` 的编辑/确认保存为配置写入路径，以 `Select.vue`、`Component.vue`、`useFilter.ts` 为配置消费、运行值和查询过滤路径，以 `QueryCascade.vue` 为级联编辑路径。组件级 `copy.ts` 的递归收集及 JSON 字符串 ID 替换是现有“整组件复制”实现，不构成查询过滤 payload 的白名单或类型安全适配器。

源码直接可见的最小事实：

- `options.ts:8-65,80-137` 生成条件身份、数据集/字段、显示与排序、单双选、默认/当前值、条件表达式、时间/数值/树/参数及展示属性。
- `QueryConditionConfiguration.vue:1750-1784` 从持久 `propValue` 深拷贝并执行 `parameterCompletion`；`1592-1668` 有 managed confirmation 分支；`1680-1702` 仍保留旧的多阶段空写入、nextTick 回填、snapshot 和后续预览路径。确认具体分支须按真实生命周期状态判定，不能把任一分支描述为所有入口的原子事务。
- `Select.vue:160-181,214-246,531-560,586-683` 在运行选择、默认值、映射值和级联值间读写；`useFilter.ts:231-300,318-604` 将不同显示类型配置投影成查询 filter。
- `QueryCascade.vue:47-88,142-174` 校验/清理 cascade 配置；其中 `datasetId` 选项值编码为 `datasetId--queryId--fieldId`，`id` 为独立 cascade 节点 ID，placeholder 会随节点位置与字段关系重建。
- `Component.vue:312-340,465-475,631-664` 会同步列表/级联当前值并在配置确认中改变组件数据；运行时列表、`currentSelectValue` 及配置历史不得在载荷重建时被误当作持久规则。

## 生命周期矩阵（源码发现，不是已冻结白名单）

| 字段/字段组 | 当前可见用途 | 候选动作 | 绑定/验证规则与限制 |
|---|---|---|---|
| 条件 `id` | `propValue` 条件身份；级联编码引用它 | `REBIND` | 为每个新目标条件生成唯一 ID；更新所有同一闭包内的 query 引用。缺失/重复/歧义拒绝整份候选。 |
| `name` | 用户可见条件名称 | `KEEP` | 作为业务配置保留；不能用名称作为字段或组件身份匹配键。 |
| `showError` | 配置/运行时错误提示控制（`options.ts:11`） | `unknown → REJECT` | 当前可见消费者不足以证明所有形态的持久语义；shape-specific authority 明确前返回 `UNKNOWN_SCHEMA_OR_KEY`，写前拒绝。 |
| `dataset`、`field` 对象 | 数据集、字段及类型/名称等元数据 | `REBIND` | 仅以权威目录中的不可变 ID 建立映射，再以目标目录对象重建完整对象；缺任一 ID、重复映射或目标不支持整次拒绝。对象完整持久字段尚未冻结。 |
| `displayId`、`sortId`、`displayType`、`deType`、`type` | 展示字段、排序字段及查询/控件形态 | `REBIND` / `KEEP` | `displayId`、`sortId` 按目标字段 ID 重绑；仅在目标形态兼容时保留 `displayType`、`deType`、`type`。未知兼容关系拒绝，不能降级成普通下拉。 |
| `sort`、`sortList`、`resultMode`、`showEmpty`、`displayFormat`、`hideConditionSwitching`、`visible`、`required`、`queryConditionWidth` | 选项顺序、结果模式、显示及校验规则 | `KEEP` | 配置语义可保留；若所选目标字段/控件不支持，则 `REJECT`，不静默删除。`sortList` 完整 schema 尚 unknown。 |
| `auto` | 新建条件默认对象中的自动行为标记（`options.ts:47`） | `unknown → REJECT` | 已知键必须进入 matrix；当前可见消费者不足以证明所有形态的写入/恢复语义。找到其 shape-specific authority 前遇到该键时返回 `UNKNOWN_SCHEMA_OR_KEY` 并写前拒绝。 |
| `multiple`、`optionValueSource`、`defaultValueFirstItem` | 选择模式、枚举来源与首项策略 | `KEEP_IF_COMPATIBLE` | 目标枚举来源与其字段依赖须重新验证。首项策略依赖目标枚举，不能将源选项首值固化成默认值。 |
| `valueSource` | 来源描述对象/数组 | `unknown → REJECT` | 当前 schema/读写版本未证；遇到时返回 `UNKNOWN_SCHEMA_OR_KEY` 并写前拒绝。 |
| `defaultValueCheck`、`defaultValue`、`defaultMapValue` | 用户配置的默认规则/映射 | `KEEP` / `REBIND` | 保留默认意图；值引用目标字段或枚举映射时按目标权威目录/枚举重建并验证。选项缺失按未决策略显式显示无效或拒绝确认；不得静默清空。 |
| `selectValue`、`mapValue` | 当前选择/运行映射；用于生成过滤值 | `RESET` | 从复制载荷剥离源运行状态，并依目标规则重新初始化；`mapValue` 是目标选择与映射的派生结果。不得把源运行值写进目标。 |
| `currentSelectValue`、cascade item `currentSelectValue` | 运行态选择值 | `REMOVE` / `RESET` | 不进入持久设计载荷；目标运行时按目标默认规则重新建立。若序列化存量中出现，按明确迁移版本重置，不作为用户规则。 |
| `conditionType`、`conditionValueOperatorF/S`、`conditionValueF/S`、`defaultConditionValueOperatorF/S`、`defaultConditionValueF/S` | 文本/条件型过滤规则 | `KEEP` | 保留运算符、条件值及默认规则；校验形态/运算符和值组合。`useFilter.ts` 的首次加载与后续加载选择不同属性，不得混淆。 |
| `defaultNumValueStart/End`、`numValueStart/End`、`conditionValue*` 的数值专属字段 | 数值范围条件及当前输入 | 配置规则 `KEEP`；运行输入 `RESET` | 区分默认边界与当前交互值；只允许完整、合法范围。边界字段适用类型及空值迁移仍需精确 schema。 |
| `timeType`、`timeGranularity`、`timeGranularityMultiple`、`timeNum`、`timeNumRange`、`relativeToCurrent`、`relativeToCurrentRange`、`relativeToCurrentType`、`relativeToCurrentTypeRange`、`around`、`aroundRange`、`arbitraryTime`、`arbitraryTimeRange`、`timeRange`、`setTimeRange` | 固定/动态时间规则及时间范围配置 | 配置规则 `KEEP`；计算值 `RESET` | 保留动态规则及其单位、方向、窗口；不能将复制时刻计算出的绝对日期冒充动态规则。`timeRange.intervalType`、`dynamicWindow`、`maximumSingleQuery`、`regularOrTrends`、`regularOrTrendsValue` 与同组相对规则均逐键参与候选 schema；其多版本消费者覆盖仍待复核。 |
| `treeDatasetId`、`treeCheckedList`、`treeFieldList`、`oldTreeLoad`、`defaultValueFirstItem`（树形） | 树目标/字段/选择和旧加载兼容状态 | `REBIND` / `RESET` / `REJECT` | 字段与数据集用 ID 重绑；树运行选择重置；目标树字段闭包不完整、层级/编码不兼容或历史兼容状态不明则整次拒绝/标 unknown，不按普通树永久拒绝。 |
| `checkedFields`、`checkedFieldsMap`、`checkedFieldsMapArr*`、`checkedFieldsMapStart/End*`、`checkedFieldsMapArrNum*`、`checkedFieldsMapEndNum*` | 组件映射字段及多字段/范围字段关系 | `REBIND` | map 的键若为目标组件 ID 必须通过目标组件映射重绑；value 必须是目标字段 ID。键值闭包、数组顺序或任一映射不唯一则拒绝。动态后缀字段完整并集尚未证明。 |
| `parameters`、`parametersList`、`parametersStart/End` | 参数绑定与参数配置 | `unknown → REJECT` | 参数对象内部持久字段、显示类型交叉与迁移版本仍 `unknown`。不可用空数组替代未知，不能据 `displayType=8` 推断全部参数。 |
| `parametersCheck` | 参数配置开关 | `KEEP_IF_COMPATIBLE` | 只有参数 shape 获得 schema 证据后才保留；当前出现未识别参数载体仍整次拒绝。 |
| cascade 顶层数组/分组与顺序 | 有序级联闭包 | `KEEP` | 保持分组、顺序、边关系；对每个节点做完整引用闭包检查，重复边、断边、环或不支持组合整次拒绝。 |
| cascade item `datasetId` 复合字符串 | `dataset--query--field` 引用 | `REBIND` | 需解析三段身份并按 ID 分段映射后重新编码；禁止 JSON 全文字符串替换或名称回退。分隔符冲突/格式不唯一拒绝。 |
| cascade item `fieldId` | 节点关联字段 | `REBIND` / `KEEP` | 按字段 ID 重绑；同数据集占位节点可无独立 fieldId，但需由结构位点和完整编码引用证明；未知空值组合拒绝。 |
| cascade item `id` | 编辑节点 Vue/配置身份 | `REBIND` | 为每个目标级联节点生成新唯一 ID；与 dataset/query/field 业务引用分离。 |
| cascade item `name`、`deType`、`isTree` | 显示/控件类型提示 | `REBIND` / `KEEP` | `name` 从权威目标字段重建；类型值由目标 schema 重建/校验。不能依赖复制来的显示文本确认目标能力。 |
| cascade item `placeholder`、`defaultValueFirstItem` | 编辑提示及规则派生值 | `RESET` / `REMOVE` | placeholder 按目标节点位置重建；首项策略来源为目标条件配置，不能从级联运行状态复制。 |
| cascade item `selectValue` | 配置态/运行态级联值（`Select.vue` 分支不同） | `RESET` | 复制 payload 中重置为空/目标默认值；不得把源 cascade 选择状态迁移为目标状态。具体空值形态需按调用模式复验。 |
| `optionFilter`、`options`、`optionFilter` 类远程结果 | 选项过滤或来源/远程查询结果 | `REBIND` / `REMOVE` / `REJECT` | 用户配置的筛选规则只有在源码确认其持久语义后才能保留并重绑；从 API 返回的 options/enum rows 一律重取。字段全集及版本语义目前 unknown。 |
| 新旧版本未登记键、类型不匹配键、未知嵌套对象 | 无法证明的存量/扩展载荷 | `REJECT` | 失败前不得变更任何目标状态、快照、预览或查询；不能用字段名猜测 KEEP/REMOVE，也不能静默透传未审未知键。 |

`options.ts:8-65` 新建对象的精确键并集为：`id`, `name`, `showError`, `timeGranularity`, `timeGranularityMultiple`, `field`, `displayId`, `sortId`, `sort`, `defaultMapValue`, `mapValue`, `conditionType`, `conditionValueOperatorF`, `conditionValueF`, `conditionValueOperatorS`, `conditionValueS`, `defaultConditionValueOperatorF`, `defaultConditionValueF`, `defaultConditionValueOperatorS`, `defaultConditionValueS`, `timeType`, `relativeToCurrent`, `required`, `timeNum`, `relativeToCurrentType`, `around`, `parametersStart`, `parametersEnd`, `arbitraryTime`, `timeNumRange`, `relativeToCurrentTypeRange`, `aroundRange`, `arbitraryTimeRange`, `auto`, `defaultValue`, `selectValue`, `optionValueSource`, `valueSource`, `dataset`, `visible`, `defaultValueCheck`, `multiple`, `displayType`, `checkedFields`, `parameters`, `parametersCheck`, `parametersList`, `checkedFieldsMap`。`attributes` 还声明 `hideConditionSwitching`, `resultMode`, `relativeToCurrentRange`, `timeRange`, `setTimeRange`, `showEmpty`, `defaultNumValueStart`, `defaultNumValueEnd`, `numValueEnd`, `numValueStart`, `displayFormat`, `oldTreeLoad`, `treeDatasetId`, `treeCheckedList`, `defaultValueFirstItem`, `treeFieldList`；嵌套 `timeRange` 的键在上行逐项列出。被重复声明的键属于同一 JSON 属性，但不同形态消费者仍须复核。

矩阵逐项覆盖已知默认键与上述 `attributes` 并集；以下字段按 `unknown → UNKNOWN_SCHEMA_OR_KEY → REJECT before write` 处理：所有不在当前已审 schema 中的扩展键、动态生成的 `checkedFieldsMap*` 后缀及参数对象内部未知键、没有版本识别的历史键。该覆盖只证明“发现清单可对照”，不证明所有动态字段都已找到生产者/消费者。源码可见字段以外仍需扩大调查，完整字段 schema、旧存量版本与所有参数字段尚未证明，因此当前矩阵不可作为实现白名单。

## 已知新建对象与 attributes 的逐键候选分类

以下逐项与 `options.ts:8-65,80-137` 的当前可见字段对照。动作表达候选政策；`KEEP_IF_COMPATIBLE` 的 shape 兼容仍须由目标 schema 证据决定。嵌套对象子键单独列出；未知动态后缀统一采用 `UNKNOWN_SCHEMA_OR_KEY` 后写前拒绝。

| 字段 | 源码可见语义 | 候选动作 |
|---|---|---|
| `id` | condition identity | `REBIND` |
| `name` | user-facing label | `KEEP` |
| `showError` | error display control | `UNKNOWN_SCHEMA_OR_KEY → REJECT` |
| `timeGranularity` | time granularity | `KEEP_IF_COMPATIBLE` |
| `timeGranularityMultiple` | time range granularity | `KEEP_IF_COMPATIBLE` |
| `field` | dataset field object | `REBIND` |
| `displayId` | display field id | `REBIND` |
| `sortId` | sort field id | `REBIND` |
| `sort` | sort rule | `KEEP_IF_COMPATIBLE` |
| `defaultMapValue` | configured default mapping | `KEEP_AND_REVALIDATE` |
| `mapValue` | derived mapping value | `RESET` |
| `conditionType` | condition subtype | `KEEP_IF_COMPATIBLE` |
| `conditionValueOperatorF / conditionValueF` | first operator and value | `KEEP_IF_COMPATIBLE` |
| `conditionValueOperatorS / conditionValueS` | second operator and value | `KEEP_IF_COMPATIBLE` |
| `defaultConditionValueOperatorF / defaultConditionValueF` | first default operator and value | `KEEP_IF_COMPATIBLE` |
| `defaultConditionValueOperatorS / defaultConditionValueS` | second default operator and value | `KEEP_IF_COMPATIBLE` |
| `timeType` | fixed/dynamic time mode | `KEEP_IF_COMPATIBLE` |
| `relativeToCurrent / relativeToCurrentRange` | relative time rules | `KEEP_IF_COMPATIBLE` |
| `required` | required validation rule | `KEEP_IF_COMPATIBLE` |
| `timeNum / timeNumRange` | relative time amounts | `KEEP_IF_COMPATIBLE` |
| `relativeToCurrentType / relativeToCurrentTypeRange` | relative units | `KEEP_IF_COMPATIBLE` |
| `around / aroundRange` | relative boundaries | `KEEP_IF_COMPATIBLE` |
| `parametersStart / parametersEnd` | parameter boundary state | `UNKNOWN_SCHEMA_OR_KEY → REJECT` |
| `arbitraryTime / arbitraryTimeRange` | fixed time rule inputs | `KEEP_IF_COMPATIBLE` |
| `auto` | automatic behavior flag | `UNKNOWN_SCHEMA_OR_KEY → REJECT` |
| `defaultValue` | configured default intent | `KEEP_AND_REVALIDATE` |
| `selectValue` | runtime selected value | `RESET` |
| `optionValueSource` | enum/value source mode | `KEEP_IF_COMPATIBLE` |
| `valueSource` | source descriptor | `UNKNOWN_SCHEMA_OR_KEY → REJECT` |
| `dataset` | dataset descriptor | `REBIND` |
| `visible` | visibility | `KEEP_IF_COMPATIBLE` |
| `defaultValueCheck` | default enabled flag | `KEEP_IF_COMPATIBLE` |
| `multiple` | single/multiple mode | `KEEP_IF_COMPATIBLE` |
| `displayType` | control shape | `KEEP_IF_COMPATIBLE` |
| `checkedFields` | component field mapping | `REBIND` |
| `parameters` | nested parameter object | `UNKNOWN_SCHEMA_OR_KEY → REJECT` |
| `parametersCheck` | parameter enabled flag | `KEEP_IF_COMPATIBLE` |
| `parametersList` | nested parameter list | `UNKNOWN_SCHEMA_OR_KEY → REJECT` |
| `checkedFieldsMap` | component key to field map | `REBIND` |
| `hideConditionSwitching` | control display rule | `KEEP_IF_COMPATIBLE` |
| `resultMode` | enum result mode | `KEEP_IF_COMPATIBLE` |
| `timeRange.intervalType` | time window interval | `KEEP_IF_COMPATIBLE` |
| `timeRange.dynamicWindow` | dynamic window switch | `KEEP_IF_COMPATIBLE` |
| `timeRange.maximumSingleQuery` | maximum single query window | `KEEP_IF_COMPATIBLE` |
| `timeRange.regularOrTrends` | time window mode | `KEEP_IF_COMPATIBLE` |
| `timeRange.regularOrTrendsValue` | time window value | `KEEP_IF_COMPATIBLE` |
| `setTimeRange` | time range config flag | `KEEP_IF_COMPATIBLE` |
| `showEmpty` | empty option display | `KEEP_IF_COMPATIBLE` |
| `defaultNumValueStart / defaultNumValueEnd` | default numeric bounds | `KEEP_IF_COMPATIBLE` |
| `numValueStart / numValueEnd` | runtime numeric inputs | `RESET` |
| `displayFormat` | value display format | `KEEP_IF_COMPATIBLE` |
| `oldTreeLoad` | legacy tree compatibility flag | `UNKNOWN_SCHEMA_OR_KEY → REJECT` |
| `treeDatasetId` | tree dataset identity | `REBIND` |
| `treeCheckedList` | runtime tree selection | `RESET` |
| `defaultValueFirstItem` | default-first-item policy | `KEEP_AND_REVALIDATE` |
| `treeFieldList` | tree field identities | `REBIND` |

## 引用身份与失败边界

身份至少分为：仪表板/画布组件 ID、VQuery 条件 ID、数据集 ID、query ID、字段 ID、cascade 节点 ID、以及 `checkedFieldsMap` 等映射中作为 key 的目标组件 ID。每一种都要声明唯一性域并由 authority source 提供映射；显示名称不参与身份解析。复合 `datasetId` 不是单一字符串身份，而是三段引用的编码。

转换采用两阶段：先读取并冻结来源 payload、目标 schema/能力快照与完整 ID 映射；生成深拷贝候选及诊断，不写目标 Store。提交前重新检查目标组件仍存在且唯一、目标绑定/版本仍等于准备时签名、引用映射唯一、权限调用结果仍对当前用户/资源有效。任何条件失败均返回可分类原因，目标 propValue/cascade、历史游标、快照、预览和查询调用保持原样。

权限拒绝必须由实际权限实现对真实当前身份验证；候选计划、静态目录、UI 隐藏、测试假对象均不是授权凭证。当前没有已授权的真实权限模块来源或隔离多用户实例，故此项只定义边界，产品权限验收保持 `BLOCKED / NOT_RUN`。

## 原子提交候选

已见确认路径包含 managed lifecycle 与 legacy fallback。managed `confirmClick()` 会将候选 query root 交给 `prepareQuerySingleSelectConfirmation`，再由 `commitQuerySingleSelectConfirmation` 检查 revision 并通过 callbacks 发布 Root/当前组件/快照和 nextTick 后的重渲染、查询；legacy fallback 先清空 `propValue`，再 nextTick 写 `cascade` 与 `propValue`、记录快照并继续预览。这些静态路径证明存在分支差异，不证明所有状态都走 managed 路径或发布具备 Vue 运行原子性。

过滤粘贴不得调用配置弹窗 `confirmClick()` 复用其多阶段副作用。候选协议为 `prepare → revalidate → synchronous commit → preview`：

1. `prepare` 生成不可变的 `nextPropValue`、`nextCascade`、target binding signature、来源身份映射与完整诊断；未知 schema/key 返回 `UNKNOWN_SCHEMA_OR_KEY`，不触 Store、不发请求。
2. `revalidate` 检查授权、目标 revision、组件身份/类型、目标数据集/字段闭包、查询版本及来源/目标快照仍有效。
3. 同一同步 action 一次发布目标 `propValue` 与 `cascade`，并发布唯一 query revision/commitId；发布前失败零副作用，发布中异常须有同步回滚能力或证明 callback 不会抛错。
4. 只有成功 commit 后记录一次历史快照，再按相同 commitId 调度一次预览/查询；重复/迟到回调不得重复提交或重复查询。

该协议仍需独立复核 Pinia action 的真实写入次序、组件嵌套路径、保存与撤销入口、回调异常回滚能力。当前 S02 已有局部新建单选 lifecycle 候选，不能推及完整粘贴适配器。具体操作与失败 oracle 见 [fixtures r002](QuerySchemaLifecycleMatrixFixtures-r002.json)。

## 设计结论与待补证

可进入独立审查的内容：字段语义分层、身份域、动态字段/历史未知项的失败关闭、不得借窄 helper 永久拒绝合法形态、prepare/commit/preview 的候选边界。

仍须保留为 unknown 或准入条件：完整多形态字段 schema；参数对象版本；时间/数值/树分支合法输入与输出；未知字段的历史迁移策略；远程 enum/`optionFilter` 持久语义；各类字段映射 authority；受保护只读/撤权验证；managed/legacy 入口覆盖；保存/重开、撤销/重做和真实预览运行结果。任何实质性字段 policy 若找不到当前维护者意图，先回到独立 review 与原 AC，不推断关闭。

无产品源文件或测试代码在本设计 lane 中修改。当前结论是 `CANDIDATE_FOR_INDEPENDENT_REVIEW`；不授予产品 Builder 准入，也不关闭父 Goal 的任一 AC。
