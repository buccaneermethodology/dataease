# SH-SELECT-NUM 来源阶段追踪候选 r001

状态：`candidate / NOT_REVIEWED`。范围是 Select Number 候选 shape 的当前前端静态来源路径；不是合法组合合同、行为 oracle、可运行 Cases、Builder 准入或产品验收。保留 Goal 10 项 AC、26 项 must-have、16 项产品义务与 `Scope Delta: none`；16 项仍 `NOT_RUN`。S01 F01 为 `CONDITIONAL`，真实权限环境为 `BLOCKED / NOT_RUN`。

## 范围和 source identity

本追踪限定 `displayType` 数值选择路径 2 与 5，且只覆盖本次读取的当前工作树源码。二者分别处理；本文件不预设两种 display type 的值域、数据类型、兼容关系或完整合法配置。来源类型 `optionValueSource=0/1/2` 也分别保留，不推断其笛卡尔积均合法。

主要来源：

| 阶段/职责 | 当前源码定位 | 可观察事实 |
|---|---|---|
| 初始配置对象 | `core/core-frontend/src/custom-component/v-query/options.ts:6-66` | 新配置包含 `field`、`displayId`、`sortId`、`defaultValue`、`selectValue`、`optionValueSource=0`、`valueSource=[]`、`defaultValueCheck=false`、`multiple=false`、`displayType='0'` 等字段。该对象只证明初始 shape，不代表历史加载/default 注入结果。 |
| 字段选择候选 | `QueryConditionConfiguration.vue:3300-3310` | 数据集字段候选包含 `deType===displayType`；displayType 2 另允许 deType 3/4。displayType 5 未见此处跨类型放宽。候选可见不等于已验证保存值或完整服务端合法性。 |
| displayType 变更 | `Select.vue:291-296` | 配置态变更会把 `defaultValue`、本地 `selectValue` 重设为空（依 `multiple` 取 `[]` 或 `undefined`），并关闭 `defaultValueFirstItem`。未在该函数内清理所有关联字段。 |
| 自动来源选项 | `Select.vue:978-1000` | `optionValueSource=0` 使用 `checkedFieldsMap`/`checkedFields` 形成 field IDs；两者有值时调用 `handleFieldIdDefaultChange`，否则清空 options。 |
| 数据集来源选项 | `Select.vue:1001-1015`、`358-448` | `optionValueSource=1` 且 `field.id` 有值时构造 enum 请求；响应列通过 `displayId || queryId` 取值并转成字符串作为 option label/value，再按 `optionFilter` 和自定义排序处理。响应缺项时可能清除所选值并写 `defaultValue`/map。不能据此推出原始后端数值的类型保留。 |
| enum API 边界 | `core/core-frontend/src/api/dataset.ts:114-117` | `enumValueObj` POST `/datasetData/enumValueObj` 并返回 `res?.data`。该封装未说明 numeric schema、完整性或后端权限语义。 |
| 手工来源 | `Select.vue:1016-1041`; `QueryConditionConfiguration.vue:3488-3501` | `optionValueSource=2` 过滤 null/optionFilter 后把条目 stringify 为 label/value；配置 UI 仅 `displayType==='2'` 的输入使用 `v-model.number`，其他类型使用普通 `v-model`。不能把此处转换推为保存、API 或全部编辑态转换规则。 |
| 默认初值 | `Select.vue:1049-1062` | `init()` 按 `defaultValueCheck` 从 `defaultValue` 拷贝为 `selectValue`；否则按 `multiple` 设成 `[]` 或 `undefined`，再 debounce 设置选项。具体调用/加载先后及历史缺省未在本次追踪中闭合。 |
| 用户选择与级联 | `Select.vue:249-289,533-563,1085-1094,1164-1200` | 变更会回写 `selectValue`、`mapValue`、级联值，并区分配置态/运行态；首项默认逻辑和 cascade reload 有额外分支。`getOptionFromCascade` 对 displayType 0/2/5 放行数据集来源。静态分支不证明目标字段语义正确或完整链路。 |
| 通用 required 检查 | `Component.vue:815-847` | required 对数组空值或 falsy 值提示；明确豁免数值 `0`。Select 当前生成的 option value 是字符串，因此这里的 numeric 0 例外不能直接等同字符串 `'0'` 或控件实际行为。 |
| 配置校验 | `QueryConditionConfiguration.vue:1468-1483,1559-1577` | `displayType==='2'` 有单独的 defaultValue 空值检查；一般选项来源校验会要求手工来源至少一项 truthy 值，以及数据集来源字段 id。未看到同构的 displayType 5 defaultValue 分支。代码存在差异不等于产品规定 5 应复用/不复用 2。 |

## 当前证据不足

1. **合法 shape 分母未冻结。** `displayType` 2/5 × single/multiple × option source × default on/off × field/value metadata 的合法组合未知；不可用上述候选控件选项推定组合完整。
2. **Numeric identity/serialization 未闭合。** 数据集 enum 行的原始字段值与 display value 的配对，stringify 后选中值、`mapValue/defaultMapValue` 中 field ID 的类型，以及 `0`、负值、小数、精度、空字符串、字符串数字和 `null` 的保存/恢复行为均未形成端到端证据。
3. **type 2 与 type 5 的分歧未裁定。** 当前可见的手工输入转换和 defaultValue 校验分支并不对称。尚无产品规则说明这属于预期差异、遗漏或不同类型语义；不能自行统一。
4. **消费者和持久化链缺失。** 本次仅定位 query-component UI/configuration 和部分运行态回写；尚未逐项追踪两种 shape 的查询 filter consumer、API payload、Store 保存/加载、模板/复制、撤销/重做与旧版本缺省。
5. **权限/产品行为未测。** 静态源码和当前已知本地环境不能验证只读拒绝、撤权、恢复、真实身份边界或 Goal AC。

## 候选后续工作

先在现有冻结 Goal/AC 范围内建立 type 2 与 type 5 各自的最小 consumer / serialization 来源图，明确所有观察到的原始类型和转换点；遇到没有 authority 的产品策略保持 `NOT_READY`，再形成逐轴候选矩阵和需要的产品 owner 问题。任何合同/Cases 冻结、离线 Builder 或产品接线均需自己的 Context/Card、可信 RED（若启用 ERBE）、设计审查及 action/target 精确匹配的 execution admission。禁止接触产品 UI/Store/source-read/target-commit 或真实权限验收，除非相应前置被独立满足。
