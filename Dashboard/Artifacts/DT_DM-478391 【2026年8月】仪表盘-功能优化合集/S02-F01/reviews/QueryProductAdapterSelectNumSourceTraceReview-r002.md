# SH-SELECT-NUM 来源阶段追踪独立评审 r002

## 结论

**`PASS_WITH_FINDINGS / STATIC_SOURCE_INDEX_ONLY`；`NOT_READY_FOR_NUMERIC_ORACLE_OR_FREEZE`。** r002 对 SNTR-R1-001、002、004、005 的补充与当前源码相符，数值 2/5 的控制流与比较差异也没有被推成产品规则或 bug。SNTR-R1-003 已增加展示键到 `field.id` 映射的来源，但写入对象/阶段仍有一句概括过宽。下一阶段清单还应明确配置确认阶段的持久化 owner，以及本地枚举响应的迟到/验证路径仍未完整追踪。以上是来源索引的非阻断精度与完整度 finding；不会阻止其作为有界导航索引使用。

本 Review 只判断静态来源追踪，不裁定合法 numeric schema、合法组合、运行语义、产品缺陷、权限或 Goal AC。Goal 保持 10 项 AC、26 项 must-have、16 项产品义务、`Scope Delta: none`；16 项义务仍 `NOT_RUN`。R4FS-001..004 仍 OPEN，R4FS-005 仍 `BLOCKED / NOT_RUN`；S01 F01 为 `CONDITIONAL`，真实多用户权限未验证。

## 范围与绑定

按 Lane Card renderer prompt 执行，只审查 r002、r001 与 r001 Review、Context 绑定材料及当前源码；未改候选、源码、Goal、Cases、Sessions 或权限配置。Card canonical SHA-256 为 `3a1b63b6c5b9617dfdea260cfac6c31d6f41092536e845476d3d3bd273abb6e0`，`lane_task_card.py validate` 结果 `pass`。Context SHA-256 为 `de8e9d175357dcb79eaaaff9366df7154585516c353591e2f8f82b646531d930`；`context_bootstrap.py validate` 成功，24 项 required-read 全部存在且摘要匹配，`skipped_reads=[]`。被审候选 `QueryProductAdapterSelectNumSourceTrace-r002.md` SHA-256 为 `e97d44834dfb0fb3a35aeeb9003a801e0e147ca2a634abbedff46685346fc39a`；r001 Review 为 `ee5f0d2342538d660c4d37ebc8aae138ebea0f686469ef0e70e8467226342aec`。

复算主要源码摘要与绑定一致：`QueryConditionConfiguration.vue` `0b88bcdf92d15aceae52ca2992e7a8b4165e3f5cfc3f9cb7435296d7c7e9e047`；`Select.vue` `30efd4a571a8146a68c8a57e64dfee93208670db4155b8f9257a4553efcfcac8`；`Component.vue` `152703881a926e747e4e42f7c593a1558708efa73a3138cdb823cc519b01d081`；`options.ts` `4be7d37dd75cf8a3759e807e1fd996194be2f35a829ad2f1306dc3a8ec061fc4`；`dataset.ts` `8d5be0a3e1b0c9fe7ef46c59007e8ed6cf39993b54008a52db54619350d370d4`。Card 所指当前拓扑 r345 保留相同 10/26/16 分母、`Scope Delta: none`、R4FS 状态及 S01/权限边界；不改变本 Review 的静态 claim ceiling。

## 五项历史 finding 的处置

| Finding | Disposition | 复核依据 |
|---|---|---|
| SNTR-R1-001 / P2 | **已准确补充** | `QueryConditionConfiguration.vue:1261-1264` 是 `some` 控制流；type 2 来源 1 的 `field.id` 检查先于 `defaultValueCheck` 短路（`1468-1483`），短路后不会继续到通用手工 truthy 检查（`1559-1565`）和数据集字段检查（`1568-1577`）。仅 type 2 手工输入用 `.number`（`3492-3501`），专用默认值检查不拒绝数值 `0`，但会拒绝 `''/undefined/null`；type 5 没有相同专门分支，未 `.number`。r002 保留了这些分支事实，不把 `'0'` 与 `0` 合并为产品语义。 |
| SNTR-R1-002 / P2 | **已准确补充** | 配置 required/default 检查在 `QueryConditionConfiguration.vue:1412-1445`，先要求 `defaultValueCheck`，再检查配置默认值（显示类型 8、22 有单独处理）；运行 required 检查在 `Component.vue:815-847`，另检查 `selectValue` 并显式允许数值 `0`。r002 将两个 owner 分开，没有把静态检查说成真实查询验收。 |
| SNTR-R1-003 / P2 | **部分补充；P2 非阻断** | `Select.vue:134-152` 按 `displayId || field.id` 定位枚举行，再取 `field.id` 的值；调用处显示运行态 `handleValueChange` 写 `config.value.mapValue` 并级联（`264-289`），配置态写 `mapValue` 与 `defaultMapValue`（`279-288`），另有枚举变更路径写两个 map 字段（`439-447`）。r002 已列出映射 helper，但“运行态与配置态各自写入 `mapValue/defaultMapValue` 或级联回写”仍可能被读成两态写入同一组字段。建议表述精确拆成：运行态此路径写 `mapValue`；配置态此路径写 `mapValue/defaultMapValue`；两态还会调用级联回写。原始类型、空值、精度和下游 consumer 仍未验证。 |
| SNTR-R1-004 / P3 | **已准确补充** | `Select.vue:264-289` 运行态写 `config.value.selectValue`；配置态更新本地 `selectValue` 与 `config.value.defaultValue/mapValue/defaultMapValue`，该分支没有写 `config.value.selectValue`。`displayTypeChange`（`291-296`）重置配置 `defaultValue`、本地值及 `defaultValueFirstItem`，不能当作已重置持久 `selectValue`。r002 的对象与阶段区分准确。 |
| SNTR-R1-005 / P3 | **已准确补充** | 手工 option 的 `label/value` 字符串化，单选对原始 `ele` 比较、多选与字符串化值比较，均见 `Select.vue:1016-1041`；type 2 `.number` 与其他普通 `v-model` 见 `QueryConditionConfiguration.vue:3488-3501`。r002 保留 `checked` 消费关系和产品缺陷为未知，未过度下结论。 |

## 新增非阻断 finding

| ID / 严重性 | 发现 | 影响与处置 |
|---|---|---|
| SNTR-R2-001 / P3 | **映射行的阶段/字段 owner 仍需收窄表述。** r002 的 SNTR-R1-003 行把 `mapValue/defaultMapValue` 合并写成运行态与配置态各自“或”写入；当前 `Select.vue:264-289,439-447` 显示不同代码路径写入的字段并不相同。 | 不影响索引导航或整体 claim ceiling，但可能令下游错误理解配置对象字段。按上表 disposition 拆分运行态与配置态字段；静态 map 不能证明序列化 schema。 |
| SNTR-R2-002 / P3 | **下一阶段未明确列出配置确认的持久化边界。** 候选列有 query consumer/API payload、Store 保存/加载、复制/模板、撤销/重做和历史缺省，但没有单列从配置校验/确认到实际被保存配置对象的 owner。 | r002 没有声称生命周期闭环，故非阻断；后续若扩展来源图，需把配置确认与保存 owner 分开定位，不以 `validate()` 或局部 `config` 写入代替。 |
| SNTR-R2-003 / P3 | **枚举请求的迟到响应/验证子路径没有进入未决清单。** `Select.vue:358-380,449-469` 对 observation 请求检查请求代际，并对迟到成功响应进入映射/验证或发起 verification；普通响应路径在 `382-447` 和 `478-519` 更新 options、所选值与级联。r002 讨论展示值映射，但没有标明这些不同路径的全量时序/落点仍未追踪。 | 本 Review 不裁定该路径正确与否，也不把源码标记解释为产品验收。建议把异步响应/迟到验证和级联时序明确列入后续静态来源缺口；合法选项与数值 oracle 仍需另行 authority。 |

## 全量未决项与 claim ceiling

- **Numeric / shape：** type 2/5 × single/multiple × option source × default/check × field/value metadata 的合法分母仍未定义；`0`、负数、小数、精度/大数、字符串数字、空字符串、`null` 的端到端值 identity/序列化仍无 oracle。当前字段候选、枚举转换与 validator 差异是源码事实，不是合法组合或产品规则。
- **消费者和生命周期：** query filter consumer 与 API payload 数值 schema、配置确认 owner、Store 保存/加载、模板/复制、保存/重开及 undo/redo/历史缺省未形成完整来源链。异步 enum 响应、迟到验证和级联时序也没有在本切片闭合。
- **全形态：** R4FS-001（合法组合分母）、R4FS-002（全链/生命周期）、R4FS-003（全形态 Cases/oracle）及 R4FS-004（跨 shape 身份字段/条件动作）仍 OPEN；本地来源图不关闭其中任何一项。
- **前置与权限：** R4FS-005 为 `BLOCKED / NOT_RUN`；S01 F01 `CONDITIONAL`。只读查看/复制/粘贴、撤权/恢复未验证；standalone/admin、静态来源图或局部 harness 均不能替代真实权限隔离实例。
- **Goal：** 10 项 AC、26 项 must-have、16 项产品义务、`Scope Delta: none` 保持不变；16 项义务仍 `NOT_RUN`。本 Review 不构成 Design Freeze、Builder 准入、产品行为、权限或 Goal 完成证据。

因此 r002 可作为**有界静态来源索引**继续引用；引用时须保留以上字段 owner 和未决边界。后续设计/合同/Cases/实现/验收须各自绑定 authority、合法分母、Context/Card 和独立验证，不由本 Review 代替。
