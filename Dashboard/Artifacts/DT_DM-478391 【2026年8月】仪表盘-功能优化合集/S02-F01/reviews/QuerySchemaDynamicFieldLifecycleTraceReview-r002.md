# VQuery 动态字段生命周期来源追踪 r002 独立审查

## 轮次与结论

**第 2/3 轮。Verdict：`PASS_WITH_BOUNDS`。** r002 已在有界静态来源追踪范围内充分修正 r001 的 F-DFFLT-001 与 F-DFFLT-002；本轮重新全量核对字段路径、生命周期阶段、配置/运行态、组合关系、保存捕获与声明上限，未发现新的 blocking 或 non-blocking finding，也没有需要维护者裁定的问题。

此结论只接受 r002 作为**当前 checkout 的静态来源索引**，不构成完整 lifecycle/schema 合同，不冻结产品设计。**Design Freeze：`NOT_READY`；产品 Builder Entry：`NOT_ADMITTED`。** 不关闭 QSLR-02 或任何 Goal 义务，不证明产品运行、权限、后端保存/重开或 Goal AC 通过。原分母保持 10 项 Goal AC、26 项 must-have、16 项产品义务，`Scope Delta: none`；真实权限为 `BLOCKED / NOT_RUN`，S01 F01 为 `CONDITIONAL`。

## 入口与绑定

lane card `S02-F01-query-schema-dynamic-field-lifecycle-trace-review-r002` canonical SHA-256 `3eb831b9e33e35840e6ad89fb7d0898b4d55c4a0ba0a31bd46a9bcd50d4f3ffe`，验证结果 `pass`。Context Bootstrap validation 通过且 `skipped_reads=[]`。Goal、r001 review、r002 candidate、QSLR r003、其 review 及六个源码文件均按 Context 核对；固定摘要全部匹配，标记为 `current` 的材料以本次工作树字节为准。源码存在任务开始前的未提交改动；本结论不代表 HEAD、发布构建或其他版本。

本轮复核仅写本报告；未改候选、源码、Goal、QSLR 或其他 Dashboard 文件。未执行产品 UI、浏览器、服务端、数据库或权限测试。

## r001 finding 逐项处置

| Finding | 处置 | 复核依据 |
|---|---|---|
| F-DFFLT-001 — `mapValue` 不应被简单归为运行态 | `CLOSED_WITH_BOUNDS` | r002 第 32 行将 `mapValue` 明确标为阶段相关的派生映射字段；列出 `Select.vue:264–289` 运行与配置入口，并说明两者均可写 `mapValue`。同时将 `defaultMapValue` 与外部参数回填的影响单独列出；未决定 copy 的 KEEP/RESET/RECOMPUTE，明确保持 `UNKNOWN / NOT_DECIDED`。未发现其余章节再将 `mapValue` 当成固定的纯运行态字段。 |
| F-DFFLT-002 — JSON round-trip 不是对象形状不变的保存证明 | `CLOSED_WITH_BOUNDS` | r002 第 31 行准确称其为 JSON 序列化投影，声明对象身份与精确 JS 值类型不保留，并分别说明对象属性 `undefined` 会省略、`Date` 会序列化成字符串。第 47 行要求这些差异进入精确保存合同；第 31、48 行继续否认服务端 schema、历史保存、重开和回显等价证据。 |

上述关闭仅指 r001 两项文档 finding 在 r002 的文字与边界得到修正，不代表静态源码或保存行为本身已运行验证。

## Acceptance criteria disposition

| Criterion | 处置 | 依据与边界 |
|---|---|---|
| `TRACE-SOURCE-ACCURACY` | `PASS` | 六份绑定源码摘要均匹配；复核中主要行号、字段事实、managed/legacy 路径与配置/运行分支相符。r001 两项精度问题已修正。 |
| `TRACE-LIFECYCLE-COVERAGE` | `PASS_WITH_BOUNDS` | 普通字段映射、时间/数值复合关系、tree 层级映射、cascade、保存捕获与外部参数回填均有来源入口；完整动态键闭包、版本迁移、服务端存储及重开仍明示为未知。 |
| `TRACE-STATE-SEPARATION` | `PASS_WITH_BOUNDS` | `mapValue` 被列为阶段相关派生映射态；`defaultMapValue` 外部回填影响明示。`selectValue`、`currentSelectValue` 按入口区分并保留具体 copy 动作待定。 |
| `TRACE-PERSISTENCE-BOUNDARY` | `PASS_WITH_BOUNDS` | JSON round-trip 的 undefined/Date 变换已精确标明；query overlay 是待验捕获入口，不冒充落库、重开或历史兼容证据。 |
| `TRACE-UNKNOWN-PRESERVATION` | `PASS` | 动态键、历史编码、shape/schema、迁移、权限和保存重开缺口继续保持 unknown；候选策略没有被写成已实现行为。 |
| `TRACE-CLAIM-CEILING` | `PASS` | r002 保持 candidate、未冻结、未准入；不关闭 QSLR-02，不宣称完整 schema、产品行为、权限或 Goal 完成。 |

## 全量来源与边界复核

- **普通条件与组件字段映射：** `options.ts:8–65,80–137` 与 `Component.vue:556–590,609–632` 支持新建对象、auto 条件映射生成、普通条件失效映射修剪，以及拖入字段时形成映射并更新 `propValue`/snapshot。`Select.vue:679–684,978–1015` 支持配置字段映射或按字段来源生成 options 的局部消费路径。追踪没有据此推定所有 shape 的映射闭包或把字段名作为身份。
- **时间/数值映射：** `QueryConditionConfiguration.vue:363–422,434–494,535–640` 支持单值/范围数组、起止字段及派生参数列表的联动；`:1261–1377` 覆盖映射完整性、范围长度、数值默认边界和相应类型组合校验。r002 把时间与数值键分列，并保留空值、历史编码及版本迁移未知；没有声称这是所有形态的完整 oracle。
- **tree：** `QueryConditionConfiguration.vue:497–533,1187–1213,1290–1317,2060–2095,2393–2425` 支持 tree dataset/字段配置、每层 `treeCheckedList` 映射、顶层当前层投影，以及树结构和字段映射校验。r002 保留 `oldTreeLoad` 的来源/历史迁移边界；未把 `treeCheckedList` 误称为运行选择值。
- **cascade 与选择值：** `Select.vue:160–181,214–246,249–289` 区分 cascade 配置值与运行当前值的消费；`QueryConditionConfiguration.vue:1605–1625,1680–1696` 展示 managed 与 legacy 确认分支对 cascade/propValue 的处理；`dvMain.ts:1596–1619` 可按外部参数更新级联选择字段。r002 明确复合 `datasetId` 的版本化解析仍未证明，且未主张这些静态调用证明运行原子性。
- **`mapValue/defaultMapValue`：** `Select.vue:264–289` 与 `dvMain.ts:1498–1620,1744–1790` 支持跨配置、运行和外部参数入口写入映射/默认字段。r002 现在按阶段描述，不给跨入口统一 copy 动作。
- **保存捕获与 JSON 投影：** `canvasUtils.ts:844–881` 在 `lifecycle.phase === 'open'` 路径构造 round-trip 值、`componentData` 与 `queryDesignOverlay`，并传给 `captureQuerySingleSelectSave`。`JSON.stringify/parse` 对对象属性 `undefined` 与 `Date` 的影响描述准确。候选没有声称 HTTP/服务端实际落库、旧载荷读取、重开恢复或保存回显完整。
- **Claim ceiling：** r002 第 1、3、45–48 行持续说明这是当前工作树来源索引，未获得历史 schema、完整字段生产者/消费者、权限实例、exact copy contract 或保存/重开 authority 时不得把未知字段转换为产品写入政策。所有限制均与 Goal 和 QSLR r003 保持一致。

## Finding、问题与结论边界

**Blocking findings：无。Non-blocking findings：无。需维护者回答的问题：无。** 本轮确认前轮发现已被有界修正；剩余未知属于候选明确列出的独立证据/设计工作，不在本来源追踪的声明范围内，不据此关闭或永久判定 unsupported。

QSLR-02 仍开放；Goal 原分母与 `Scope Delta: none` 不变；S01 F01 `CONDITIONAL`、真实权限 `BLOCKED / NOT_RUN` 保持。当前审查不准入产品 Builder，不证明产品行为、权限、数据库保存/重开或任一 Goal AC 完成。
