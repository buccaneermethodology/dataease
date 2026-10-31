# VQuery 动态字段生命周期来源追踪 r001 独立审查

## 轮次与结论

**第 1/3 轮。Verdict：`PASS_WITH_FINDINGS`，仅限当前 checkout 的有界静态来源索引；不是完整生命周期合同。** 本轮未发现足以否定追踪主体用途的 P1/blocking finding；发现 2 项应在后续修订或使用说明中处理的 non-blocking findings。当前候选可以作为继续做 shape-specific 设计取证的入口，但对 `mapValue` 的分类与 JSON 保存捕获语义不可直接用作字段策略或持久化 oracle。

**设计冻结：`NOT_READY`。产品 Builder 准入：`NOT_ADMITTED`。** 本报告不关闭 QSLR-02，不证明产品运行、权限、数据库保存/重开或 Goal AC 通过，也不改变 10 项 Goal AC、26 项 must-have、16 项产品义务及 `Scope Delta: none`。真实权限仍 `BLOCKED / NOT_RUN`；S01 F01 仍 `CONDITIONAL`。

## 入口、绑定与范围

lane card `S02-F01-query-schema-dynamic-field-lifecycle-trace-review-r001` canonical SHA-256 为 `81423f13deccf20d2ba55dba3729e7625764974b87e2a7e8ad236ce16d83f546`；`lane_task_card.py validate` 通过。Context Bootstrap 校验通过，`skipped_reads=[]`。Goal、SP-010 Skill、追踪、QSLR r003、QSLR r003 review 与六个绑定源码摘要均按 Context 核对；六个源码文件 SHA-256 与绑定值全部匹配。Context 中标记为 `current` 的 QSLR/追踪文件按当前工作树读取。工作树本来已有未提交改动；结论仅针对所绑定的当前 checkout 字节，不代表 HEAD、发布构建或支持版本。

审查逐项核对了追踪中的来源声明、字段组、状态分类、保存捕获路径、未知项和 claim ceiling；按候选提供的引用复读 `options.ts`、`Component.vue`、`QueryConditionConfiguration.vue`、`Select.vue`、`canvasUtils.ts`、`dvMain.ts` 对应实现。未运行产品 UI、浏览器、服务端、权限或数据库场景，也未修改候选或源码。本报告是唯一写入物。

## Acceptance criteria disposition

| Criterion | 处置 | 依据与边界 |
|---|---|---|
| `TRACE-SOURCE-ACCURACY` | `PASS_WITH_FINDINGS` | 追踪所列主要生产、编辑、消费与外部回填路径能在绑定源码找到；下列两项对状态分类和 JSON round-trip 描述的精度需要保留。未发现引用摘要与绑定文件不符。 |
| `TRACE-LIFECYCLE-COVERAGE` | `PASS_WITH_BOUNDS` | 普通字段映射、时间/数值参数复合关系、tree 分层映射、cascade、保存捕获及外部参数回填均被触及。它明确将后端保存/重开、复制白名单、历史迁移与完整动态键集合留为未知，故只满足来源调查切片，不等同于完整字段闭包。 |
| `TRACE-STATE-SEPARATION` | `PASS_WITH_FINDINGS` | `checkedFieldsMap`、时间/数值复合关系、`treeCheckedList` 与 cascade 选择总体区分准确；但 `mapValue` 在配置编辑和运行路径均有写入，不能归入纯运行态。 |
| `TRACE-PERSISTENCE-BOUNDARY` | `PASS_WITH_FINDINGS` | `canvasSaveWithParams` 的 JSON round-trip 及 query overlay 捕获入口定位准确，并明确服务端持久化/重开未知；须避免将 round-trip 描述成保持原对象形状。 |
| `TRACE-UNKNOWN-PRESERVATION` | `PASS` | 历史 schema、未登记键、参数对象、动态后缀、迁移规则、授权与复制/重开入口均保留未知，没有把未知提升为已验证事实。 |
| `TRACE-CLAIM-CEILING` | `PASS` | 文件明确为候选、未冻结、未准入；不声称运行验收、权限通过、完整 schema 或 Goal 完成，也明确不关闭 QSLR-02。 |

## 完整 findings

### F-DFFLT-001 — P2，non-blocking：`mapValue` 的状态分类不够精确

**位置：** 追踪第 28、35 行，尤其第 35 行将 `mapValue` 与 `selectValue`、`currentSelectValue` 并列归入“运行态”。

**证据：** `Select.vue:264–276` 是运行选择分支，写 `selectValue`、`mapValue` 并更新 cascade 当前值；而配置分支 `Select.vue:279–289` 会写 `defaultValue`、`mapValue`、`defaultMapValue`，并回填配置态 cascade 值。绑定源码 `dvMain.ts:1511–1522,1543–1553` 的外部参数路径也会修改 `mapValue/defaultMapValue`。因此 `mapValue` 是依入口同时参与配置编辑和运行结果的派生/映射值。第 28 行虽提醒字段状态会因入口变化，但第 35 行的分类仍可能让后续设计者把它当成仅运行态字段。

**影响：** 若直接将该分类转换为复制策略，可能无条件 reset `mapValue`，或错误地将其当作可持久用户意图；本追踪自己也指出最终动作需要按目标合同裁决。

**建议 disposition：** 后续修订将 `mapValue` 列为跨配置/运行阶段的派生映射字段，并绑定入口条件；在获得 shape-specific contract 前，复制动作维持 `UNKNOWN / NOT_DECIDED`。此 finding 不推翻其余来源行，也不授权实现。

### F-DFFLT-002 — P3，non-blocking：JSON round-trip 的值变换边界未点明

**位置：** 追踪第 27 行称 JSON round-trip 保留“JSON 可表达的当前数据形状”。

**证据：** `canvasUtils.ts:859–879` 的 `JSON.parse(JSON.stringify(value))` 对 `componentData`、`canvasStyleData`、`canvasViewInfo`、`appData`、overlay 的 `propValue/cascade` 等进行捕获。该操作不是对象身份或字段形状的原样复制：`options.ts:42,48–49` 可见 `Date` 与 `undefined` 初值；JSON 序列化会把日期序列化为字符串，并省略对象属性中的 `undefined`。追踪没有宣称服务端持久化成功或重开等价，因此这是捕获语义精度问题，而非对后端结果的反证。

**影响：** 下游若把 overlay 捕获结果直接当作原对象 schema/值快照，可能遗漏属性缺省与日期类型变化；也无法凭 round-trip 推导历史保存载荷兼容性。

**建议 disposition：** 将表述限定为“JSON 序列化投影后的当前捕获值”，并提示 `undefined` 省略、`Date` 字符串化；保存回显、落库和重开仍需独立追踪与验证。

## 逐域复核记录

- **普通字段与组件映射：** `options.ts:8–65,80–137` 确实提供新建对象/默认 attributes；`Component.vue:556–590` 的 auto 条件根据 dataset 字段重建列表和 map，普通条件分支清除失效映射并裁剪 checked field；`:609–632` 的拖入路径生成 `checkedFields`/`checkedFieldsMap` 并写入 `propValue`、记录 snapshot。追踪称这些键涉及 ID 关系而非名称映射，符合当前来源；尚未证明全形态键和值的唯一身份语义。
- **时间/数值参数复合关系：** `QueryConditionConfiguration.vue:363–422,434–494,535–615,617–640` 显示数组、起止 ID、显示类型和 `parametersArr` 会联动；`:1261–1377` 的校验覆盖 tree/default、数值/时间参数组合等路径。候选将时间/数字键分开，且把历史编码、空值与版本规则留为未知，未推断完整合法形态。
- **tree 与 cascade：** `QueryConditionConfiguration.vue:2060–2095,2393–2425` 支持 `treeFieldList` 按层级维护映射，并将当前层投影至顶层 `checkedFields/checkedFieldsMap`；`:1187–1213,1290–1317` 构造级联候选并校验树结构/映射。`Select.vue:160–181,214–246,249–289` 区分配置与运行级联消费。候选保留复合 `datasetId` 编码解析和旧版 tree 迁移未知，未把 tree 永久排除或误称可直接透传。
- **确认路径：** `QueryConditionConfiguration.vue:1592–1678` 可见 managed lifecycle prepare/commit 路径；`:1680–1704` 是非 managed 的 legacy 多阶段写入及后续 snapshot/preview/query。追踪没有把原子性扩展到所有入口，结论有界。
- **保存与重开：** `canvasUtils.ts:844–881` 在 lifecycle open 时构造 JSON 捕获及 query overlay，再交给 save lifecycle；候选明确该入口不证明服务端落库、历史版本迁移或重开恢复。没有将捕获入口升级为端到端持久化证明。
- **外部参数回填：** `dvMain.ts:1498–1620,1744–1790` 存在按显示类型更新 query 条件值以及级联选择值的路径。候选保留复制时这些字段的 KEEP/RESET 判定未知，符合证据上限。

未发现需要以问题形式返回维护者裁定的业务语义；本追踪已把所需历史样本、授权来源、完整动态 schema、真实权限与保存/重开链路作为后续证据缺口，而非默认为空或通过。

## 结论与禁止外推

本轮接受该文档作为**有 findings 的当前工作树来源索引**，不冻结字段合同。F-DFFLT-001/002 应在后续设计使用前消除歧义或明确其处置。QSLR-02 仍开放；Goal 10/26/16 分母和 `Scope Delta: none` 保持；S01 F01 `CONDITIONAL`、真实多用户权限 `BLOCKED / NOT_RUN` 保持。当前静态源码 review 不证明产品行为、权限、保存重开、Builder 准入或任一 Goal AC 完成。
