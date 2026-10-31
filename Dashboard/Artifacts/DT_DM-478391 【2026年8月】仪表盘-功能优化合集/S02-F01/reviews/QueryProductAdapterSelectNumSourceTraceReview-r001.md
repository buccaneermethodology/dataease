# SH-SELECT-NUM 来源阶段追踪独立评审 r001

## 结论

**`PASS_WITH_FINDINGS / STATIC_SOURCE_INDEX_ONLY`；`NOT_READY_FOR_NUMERIC_ORACLE_OR_FREEZE`。** 候选准确地把 displayType 2 与 5 分开，未将现有代码差异升级为产品策略；对合法组合、数值序列化、保存恢复、权限和 Goal 验收也保留了未决边界。它可作为进一步取证的导航索引，但尚有四处需补充/收窄：数值类型 2 的校验提前返回路径、配置 required 与运行 required 的区别、数据集选项至级联映射的转换 owner、配置态与运行态 `selectValue` 持久字段 owner。局部手工选项还有单选/多选 `checked` 比较不对称，不能在后续 oracle 中忽略。

Goal 保持 10 项 AC、26 项 must-have、16 项产品义务及 `Scope Delta: none`；16 项产品义务仍 `NOT_RUN`。本 Review 不表示 shape 合法、数字值语义已裁定、运行行为通过、产品/权限验证完成、Design Freeze 或 Goal 完成。

## 评审范围与绑定

只评审 `QueryProductAdapterSelectNumSourceTrace-r001.md` 与其绑定源码，未改候选、源码、Goal、Cases 或其他状态。Lane Card `S02-F01-SH-SELECT-NUM-SOURCE-TRACE-REVIEW-r001` canonical SHA-256 为 `3133b2e236c65dfa0b7d60545be2bc01d6710e273f92b764e7dd7bf814b9474f`，脚本验证 `pass`。重基线后的 Context Bootstrap SHA-256 为 `31ac15d2786e001bfcda6664c1b49505858675c3bc32dfec6c0b218f3145bdf6`，验证通过；19 项 required-read 摘要全部匹配，`skipped_reads=[]`。当前 `Sessions.md` SHA-256 为 `8a19b7304102a98755f8487dfa7a321501595f13ca07b1d56fb1b2cfc1c97293`，已与 Context 绑定值逐字节重算一致；最新 r128/r129 台账继续确认本候选为静态来源追踪、R4FS OPEN/BLOCKED 和完整生命周期缺口。被审候选 SHA-256 为 `f1ceee5e07eae376d49fbce84a8b424aa7886ce7b0641df2694eaaa9881f1fa9`。

本次重算主要源码摘要均与 Context 绑定一致：`Select.vue` `30efd4a571a8146a68c8a57e64dfee93208670db4155b8f9257a4553efcfcac8`；`QueryConditionConfiguration.vue` `0b88bcdf92d15aceae52ca2992e7a8b4165e3f5cfc3f9cb7435296d7c7e9e047`；`Component.vue` `152703881a926e747e4e42f7c593a1558708efa73a3138cdb823cc519b01d081`；`options.ts` `4be7d37dd75cf8a3759e807e1fd996194be2f35a829ad2f1306dc3a8ec061fc4`；`dataset.ts` `8d5be0a3e1b0c9fe7ef46c59007e8ed6cf39993b54008a52db54619350d370d4`。

## Findings

| ID / 严重性 | 发现与源码证据 | 影响与处置 |
|---|---|---|
| SNTR-R1-001 / P2 | **type 2 validator 的提前返回使“通用来源校验”并非总会执行，且数值 0 的处理不同。** `QueryConditionConfiguration.vue:1261-1263` 使用 `conditions.value.some`。对 `displayType==='2'`，`1468-1475` 先检查来源 1 的 `field.id`，但在 `defaultValueCheck=false` 时直接 `return false`；后面的手工选项非空检查 `1559-1565` 和通用数据集字段检查 `1568-1577` 不再处理该条件。`displayType=2` 手工输入用 `v-model.number`（`3488-3501`），因此值 `0` 是 falsy；如进入通用手工来源检查会被 `filter(ele => !!ele)` 排除，而 `displayType=2` 专用默认值检查 `1475-1482` 只拒绝空数组、`''`、`undefined`、`null`，会接受数值 `0`。type 5 没有对应的 2 专属提前返回，继续走通用检查；其手工输入未使用 `.number`，字符串 `'0'` 为 truthy。 | 候选写“通用选项来源校验会要求手工来源至少一项 truthy 值，以及数据集来源字段 id”，若没有注明控制流和值类型，会让下游误认为 type 2/5 对称且均检查。修订或后续引用应写明 2/off 的短路、type 2 手工 numeric 0 与 type 5 字符串 `'0'` 的代码差异，以及 type 2 已提前检查的数据集字段项；这些差异只是静态代码事实，不能据此推断产品设计意图或缺陷修复，也不代表运行验证。 |
| SNTR-R1-002 / P2 | **required 被分为配置准入与运行查询两条路径，候选只列出后者。** 配置验证 `QueryConditionConfiguration.vue:1412-1445` 中，`ele.required` 时先要求 `defaultValueCheck`，之后检查配置默认值；这会影响 type 2/5 是否可确认。运行侧 `Component.vue:815-847` 在 required 条件下另检 `defaultValueCheck` 和 `selectValue`，并显式允许数字 `0`。 | 单独引用 `Component.vue` 不能说明编辑配置时 required/default 的准入条件；反过来也不能把配置阶段检查当作运行查询已经验证。建议来源表分别列出两个 owner，并保持数字 `0` 与字符串 `'0'` 的区别以及 type 2/5 的边界。 |
| SNTR-R1-003 / P2 | **数据集来源的展示值到级联 map 值转换 owner 未被路径化。** 候选覆盖 enum 请求与响应值字符串化，但 `Select.vue:134-152` 的 `setDefaultMapValue` 才按 `displayId || field.id` 查找 enum 行，再取 `field.id` 对应的原始值并汇总；结果由 `Select.vue:268-288,440-446,494-519,541-562` 等路径写入 `mapValue/defaultMapValue` 或回写级联。候选当前只把这些值的 numeric type 列为未知。 | 该 helper 是区分展示键与查询/级联键的重要来源，不应只用“值类型未闭合”概括。补录这条静态映射路径及其来源/阶段后，仍须保留 API 实际类型、空值、精度、持久化和下游 consumer 为未验证；不能将 helper 推成完整 numeric serialization contract。 |
| SNTR-R1-004 / P3 | **配置态与运行态的 `selectValue` owner 表述容易合并。** `Select.vue:264-289` 的运行分支会写 `config.value.selectValue`、`mapValue` 并触发查询/级联；配置分支则更新组件本地 `selectValue` 和 `config.value.defaultValue/mapValue/defaultMapValue`，此处没有写 `config.value.selectValue`。另 `displayTypeChange` `291-296` 重置的也是 `defaultValue` 与本地 `selectValue`，不代表持久 config 的 `selectValue` 已被重置。 | 候选说“变更会回写 `selectValue`、`mapValue`、级联值，并区分配置态/运行态”概括过宽，容易把局部响应式变量当作配置对象字段。建议明确对象路径和阶段，避免对复制/保存时实际落盘字段作推断。 |
| SNTR-R1-005 / P3 | **手工选项的 stringify 与单选/多选比较方式不对称。** `Select.vue:1016-1041` 将 `valueSource` 项转为字符串 `label/value`；但 `1033-1036` 的多选 `checked` 用 `` `${ele}` `` 比较，单选则用 `selectValue.value === ele` 与原始 `ele` 比较。配置端 `QueryConditionConfiguration.vue:3488-3501` 又只对 displayType 2 使用 `v-model.number`。 | 候选准确标注了 `v-model.number` 的差异和整体 numeric identity 未闭合，但尚未列出这组局部比较差异。应作为后续取证点，不根据静态差异宣称有/无产品 bug；还要确认此 `checked` 属性在各控件模式中的消费关系。 |

## 逐项确认与边界

- **displayType 2 vs 5：** 候选对字段选择的说法正确：`QueryConditionConfiguration.vue:3300-3310` 允许字段 `deType===displayType`，并仅在 displayType 2 时放宽到 deType 3/4。`Select.vue:1085-1094` 的级联 reload 白名单包含 0/2/5。配置表单中仅 2 走 `v-model.number`（`QueryConditionConfiguration.vue:3492-3501`），`validate()` 也仅有 2 的专门默认值校验（`1468-1483`）。这些代码差异不能裁定 5 的预期语义，也没有形成合法组合分母。
- **选项来源：** `optionValueSource=0/1/2` 的候选分流定位大体准确。source 0 通过 `checkedFields/checkedFieldsMap` 生成字段 ID 并调用枚举 helper（`Select.vue:978-1000,298-336`）；source 1 由 `field.id` 构造 enum 请求，按 `displayId || queryId` 生成字符串 option（`358-448`）；source 2 根据 `valueSource` 本地构造 option（`1016-1041`）。`enumValueObj` 只封装 `/datasetData/enumValueObj` 并返回 `res?.data`（`dataset.ts:114-117`），不能证明后端 numeric schema、权限或完整性。
- **数值边界：** 当前源码有明确字符串化和 `v-model.number` 位置，但没有覆盖 numeric zero、负数、小数、精度/大数、字符串数字、空字符串、`null` 的端到端持久化语义。`Component.vue:842-846` 的运行 required 检查只显式豁免数值 `0`，不得把它等同于字符串 `'0'`。候选对未知项的保留恰当。
- **默认与异步：** `init()` 按 `defaultValueCheck` 将 `defaultValue` 拷贝到本地 `selectValue`，否则按 `multiple` 清空（`Select.vue:1049-1062`）；response、首项默认与 cascade 有其他独立路径。候选明确调用/加载时序和历史缺省未闭合，没有把单函数路径提升为完整初始化合同。
- **生命周期：** 查询 filter consumer、API payload 的 numeric schema、Store 保存/加载、模板/复制、保存/重开、undo/redo 与历史缺省都仍缺端到端追踪。候选对此标明缺口正确；本 Review 不授权产品接线或 Builder。
- **Goal/权限边界：** 10/26/16、`Scope Delta: none` 均保留；S01 F01 `CONDITIONAL`，真实多用户权限 `BLOCKED / NOT_RUN`。只读查看/复制/粘贴、撤权/恢复未验证，不得由 standalone/admin、静态 source trace 或局部 harness 替代。

## 后续处置

候选作为静态导航资料可继续使用，但引用 `validate()` 时必须带上 short-circuit/required 上下文；numeric option source 到 map/cascade 的转换和 config/runtime 持久字段需继续从当前源码取证。后续合同或 Cases 冻结前，仍应建立 2 与 5 各自的合法组合 authority 与完整 consumer/serialization oracle，并独立复核。原 Goal 分母和所有未验证职责保持不变。
