# VQuery 动态字段生命周期来源追踪 r002

状态：源码派生的设计输入候选，第 2 轮修订版，尚未独立复审、未冻结、未准入产品 Builder。它补充 `QuerySchemaLifecycleMatrix-r003.md` 的动态字段来源追踪，不改写、不替代 r003，也不关闭其未决 QSLR-02。Goal 原 10 项 AC、26 项 must-have、16 项产品义务保持不变，`Scope Delta: none`。真实权限环境仍 `BLOCKED / NOT_RUN`；只读用户限制、撤权/恢复未验证；S01 F01 仍须单独满足 Goal 入口条件。

## r001 review findings 的处置

独立审查 r001 为 `PASS_WITH_FINDINGS`，只接受为有界静态来源索引，并记录 F-DFFLT-001（`mapValue` 同时出现在配置编辑与运行更新）及 F-DFFLT-002（JSON round-trip 会改变部分值形态）。本版本仅针对这两处提高来源描述精度；不把它们扩大成已冻结复制策略或产品行为结论。

## 绑定快照

以下 SHA-256 绑定审查时当前 checkout 工作树，不代表 HEAD、发布构建或受支持历史版本。

| 来源 | SHA-256 | 读取边界 |
|---|---|---|
| `core/core-frontend/src/custom-component/v-query/options.ts` | `4be7d37dd75cf8a3759e807e1fd996194be2f35a829ad2f1306dc3a8ec061fc4` | 当前新建普通查询条件对象及默认 attributes |
| `core/core-frontend/src/custom-component/v-query/Component.vue` | `152703881a926e747e4e42f7c593a1558708efa73a3138cdb823cc519b01d081` | 加入/拖入普通与自动查询条件及基础字段映射 |
| `core/core-frontend/src/custom-component/v-query/QueryConditionConfiguration.vue` | `0b88bcdf92d15aceae52ca2992e7a8b4165e3f5cfc3f9cb7435296d7c7e9e047` | 动态字段映射、配置编辑、校验与确认路径 |
| `core/core-frontend/src/custom-component/v-query/Select.vue` | `30efd4a571a8146a68c8a57e64dfee93208670db4155b8f9257a4553efcfcac8` | 配置值、运行选择、级联值与选项消费路径 |
| `core/core-frontend/src/utils/canvasUtils.ts` | `f9c68f5c96a716ed451206ef6efcbda27158cc828b578920ed5a15167bbc8282` | 保存时 JSON round-trip 与 query overlay 捕获 |
| `core/core-frontend/src/store/modules/data-visualization/dvMain.ts` | `2ca7f626c2c31f3c6e5db547cae600cfcf30cf26ed64d8f183a33943751752a2` | 外部参数修改默认值、映射值及级联运行值 |

## 发现到的生命周期

| 字段组/来源 | 生产或变更路径 | 消费/保存路径 | 可支持的判断 | 未知与禁止外推 |
|---|---|---|---|---|
| `checkedFields`, `checkedFieldsMap` | `options.ts:8-65,80-137` 提供初始字段；`Component.vue:556-590,609-632` 根据拖入组件和当前 dataset 字段集合生成或修剪列表、映射。 | 配置编辑及 `Select.vue:679-684,978-1015` 使用字段列表/映射生成选项。 | 两者是映射配置的一部分；Map 键和值都涉及 ID 关系，名称不能代替 ID。 | 不能据普通一对一映射推断所有组件形态均相同；动态参数、关系图/tree、多选和历史 schema 的闭包未知。 |
| 时间参数映射：`checkedFieldsMapArr`, `checkedFieldsMapStart/End`, `parametersArr` | `QueryConditionConfiguration.vue:363-422,434-494,617-630` 通过配置操作更新单值/范围数组、起止字段与参数字段列表。 | 同文件 `:1319-1375` 校验数值/时间范围组合；`:1592-1678` managed confirmation 或 `:1680-1704` legacy fallback 处理确认。 | 数组、起止 ID 和参数数组由相同配置操作联动；必须作为一组复合关系验证，不能只重绑主 Map。 | 起止顺序的全部历史编码、空值兼容形态以及所有版本迁移规则未确认。 |
| 数值参数映射：`checkedFieldsMapArrNum`, `checkedFieldsMapStartNum/EndNum`, `parametersArr` | `QueryConditionConfiguration.vue:363-390,535-615` 更新数字参数起止与数组并从字段数据重建参数列表。 | 同文件 `:1319-1369` 验证默认数值范围与单字段非法形态。 | 数值范围字段与时间参数使用相似但不同键，不能跨类型复用映射规则。 | 映射为空时的存量类型、跨类型切换的所有旧载荷状态仍需真实样本与版本证据。 |
| tree：`treeDatasetId`, `treeFieldList`, `treeCheckedList`, `oldTreeLoad` | `QueryConditionConfiguration.vue:497-533,2060-2095` 设置默认 dataset、层级字段与每层映射；`:2395-2425` 在层级切换时加载/重建每层 checked map。 | 同文件 `:1187-1213,1290-1317` 生成 cascade 候选并校验树结构及字段映射。 | `treeCheckedList` 是按层级保存的映射集合；顶层 `checkedFields/checkedFieldsMap` 还会投影当前关系图层，不能与所有层级配置混为一谈。 | `oldTreeLoad` 代表历史兼容分支，但完整历史版本与迁移来源未知；不能把 tree 永久排除，也不能未经映射直接透传。 |
| cascade：顶层 `cascade` 及 item `datasetId`, `selectValue`, `currentSelectValue` | 查询条件确认时从 `cascadeArr` 写入；default-value 可能填入每个级联项。`dvMain.ts:1596-1619` 可从外部参数重设级联运行值。 | `Select.vue:160-181,249-289` 消费/回填级联值；配置提交见 `QueryConditionConfiguration.vue:1605-1625,1680-1696`。 | 必须区分持久关系、配置态 selection、运行态 current selection；值字段本身不等于引用身份。 | `datasetId` 复合编码在本追踪中未建立完整版本化解析证明；不得依靠文本全局替换。 |
| 保存捕获：整个组件 `propValue/cascade` | `canvasUtils.ts:844-879` 在 lifecycle open 时构造 JSON round-trip 的组件快照和 `queryDesignOverlay`。 | 同文件 `:881` 起交给 save lifecycle；后续落库与重开恢复需继续追踪真实端到端入口。 | 保存入口捕获的是 `JSON.parse(JSON.stringify(value))` 产生的**JSON 序列化投影**；它不保留原对象身份或精确 JS 值类型。JSON 对象属性值为 `undefined` 时会省略该属性；`Date` 会序列化为字符串。 | 此转换不证明服务端落库 schema、历史保存版本、重开迁移或保存回显等价；需区分 round-trip 输入值与服务端持久化结果。 |
| 外部参数回填：`selectValue`, `defaultValue`, `defaultMapValue`, `mapValue`, cascade selection | `dvMain.ts:1498-1620,1744-1790` 按显示类型写入条件值、默认值/映射值及级联运行值；`Select.vue:264-289` 的运行与配置操作均会修改 `mapValue`，但处于不同入口阶段。 | 查询运行时据映射字段和默认规则产生 filter/级联值。 | `mapValue` 是**阶段相关的派生映射字段**：运行选择可更新它，配置操作也可写它并伴随 `defaultMapValue/defaultValue` 更新。它不能仅凭字段名归为运行态或持久用户规则。 | 本追踪不能裁决复制载荷中的 `mapValue` 应 KEEP、RESET 或 RECOMPUTE；未取得 shape-specific contract 前，复制动作 `UNKNOWN / NOT_DECIDED`。 |

## 分层分类（候选，不是完整白名单）

- **候选持久配置：** 条件 identity/name、字段与 dataset 引用、显示/筛选类型、用户设定的默认规则、字段映射规则、tree 层级定义、cascade 关系。必须以目标 ID map 重建引用；未建立完整 schema 的形态不得进入提交。
- **由持久配置可重建的元数据：** `parametersArr` 中经字段 ID 推导的参数字段、目标选项列表、目标字段类型/名称、随 tree/cascade 目标关系派生的展示信息。可重建不代表可在尚未取得目标目录/权限结果时自行补值。
- **展示/编辑临时态：** 当前配置对话框选中的关系图层、活动 tab、校验提示和表单临时数据。当前来源只证明部分局部变量和 active index 的用法；其完整序列化边界仍未知。
- **运行态候选：** `selectValue` 与 `currentSelectValue` 在所引运行分支表达当前选择；远程 options/enum rows 是查询结果。字段出现也可因配置/默认值流程而改变，复制时必须按具体入口和 Goal 合同裁决。
- **阶段相关的派生映射态：** `mapValue` 跨运行选择、配置编辑和外部参数回填使用；`defaultMapValue` 更接近默认映射意图但当前来源仍显示它可能被外部参数流程改写。没有字段级 copy contract 时两者都不适用固定 KEEP/RESET 白名单。
- **未分类/版本未知：** 所有未审键、嵌套参数结构、动态生成后缀、历史 tree 标记和不匹配类型。安全策略候选为 `UNKNOWN_SCHEMA_OR_KEY` 并在写入前拒绝；尚未作为已实现行为或完整迁移政策。

## 可用于后续设计的有限结论

1. 动态映射需按复合关系组建模：普通 Map、时间范围、数值范围、tree 每层映射、cascade 关系分开；由同一 ID map 贯穿验证，拒绝缺失/重复/歧义映射。
2. 生命周期观察必须同时检查目标 `propValue`、`cascade`、undo/snapshot/history、预览与 query 调用是否保持不变；当前实现路径存在 managed confirmation 与 legacy 多阶段写入两种分支，不能把一种原子性结论推及另一分支。
3. `canvasSaveWithParams` 的 JSON 序列化投影可作待验入口，但需将省略/字符串化差异纳入精确保存合同；这不构成服务端存储/重开证据。产品保存回显义务仍未关闭。
4. 此追踪适合作为一个新设计交付物的来源集；不得改写 QSLR-02 的历史 verdict，也不得将当前工作树摘要冒充 HEAD 或权威 schema。

## 下一步与约束

建议建立独立精确的动态字段子合同：仅选择一个已冻结且可由真实样本确认的配置形态，写明源版本、完整输入/输出、可接受 ID map、失败无副作用 oracle、版本策略与排除范围；先完成全量 design review，再建 frozen cases/可信 RED 和精确 execution admission。若无法获得样本或稳定 schema，保留 `UNKNOWN`，不准入相关 Builder。

本追踪未执行产品运行验证、权限验证或数据库写入。源码摘要绑定读取时工作树；已有未提交代码改动不归因于本轮文档修订。
