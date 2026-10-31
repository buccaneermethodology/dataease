# 查询组件字段与引用发现（只读）

状态：静态源码发现，非冻结白名单、非实现合同；依据当前工作区源码阅读。该文档用于收敛 DR-03，不授权 Builder 猜测未知字段、重绑定规则或原子提交实现。

## 读取证据

| 来源 | 观察 | 对复制契约的含义 |
|---|---|---|
| `core/core-frontend/src/custom-component/v-query/options.ts:1-65` | 初始条件含组件 `id/name`、field（id/type/name/deType）、数据集 id、显示/排序配置、默认值/条件运算符和值、时间规则、valueSource、checkedFields/checkedFieldsMap 等 | 字段集合是配置与运行/展示混合模型；需按字段用途分类，不可整对象盲拷 |
| `.../options.ts:68-137` | 默认属性含时间参数、树数据集、treeCheckedList/treeFieldList、timeRange 等 | 动态时间和树形选择存在独立子结构；不得因通用过滤模型而丢失 |
| `QueryConditionConfiguration.vue:1769-1795` | `parameterCompletion` 对缺失项应用 `attributes` 默认值，并以 `dataset.id` 补 treeDatasetId | 历史配置可能省略字段；对缺项无证据时不能把 UI 补全行为当成复制白名单或原始值 |
| `QueryConditionConfiguration.vue:1185-1212` | 级联节点映射使用查询条件 id、dataset id、字段 id、展示类型；键由 `${datasetId}--${queryId}--${fieldId}` 组成 | 级联引用同时绑定组件、数据集、字段。目标ID重绑定需要一份显式双向映射与全闭包检查 |
| `QueryCascade.vue:11-17,55-82` | Cascade 形状含 datasetId/name/queryId/deType/fieldId/isTree；保存时校验 datasetId/fieldId，cloneDeep，并清空配置节点的 `selectValue` | `name` 是展示信息，不能作为身份；级联选择值需要结合 Select.vue 和默认值写回逻辑判定，不能从本文件单独归类 |
| `QueryCascade.vue:142-148, template:233` | 每个级联节点由 `guid()` 创建独立 `id` 和 placeholder；当前 UI 的单条配置行按钮限制 `item.length === 2` | 复制时需判断哪些稳定节点ID必须重生成、哪些占位信息由目标重算；当前证据不能决定最终算法 |
| `QueryConditionConfiguration.vue:1591-1629` | confirmClick 先令 propValue=[]，随后 nextTick 写 cascade、propValue、snapshot 并触发 reRenderAll/queryData；defaultValueCheck时由 mapValue重建cascade的selectValue/currentSelectValue | 现有确认路径是多阶段更新；不能直接当作整树粘贴的原子提交连接点；级联默认选择应由复制后的目标配置重新派生 |
| `Select.vue:159-165,217-238` | `isConfig`路径读写cascade `selectValue`，运行路径读写`currentSelectValue`；配置查询条件生成时依据对应分支将该值组装为级联`in`条件 | 两者不是可互换的临时字段；复制需保留默认过滤配置来源，同时清除源运行态并由目标默认映射重建，不应原样带入运行时选择 |
| `QueryConditionConfiguration.vue:1261-1380` | validate 遍历查询条件，检查字段、dataset、checkedFields/map、treeDatasetId、treeFieldList及映射 | 现有校验依赖运行时元数据与组件字段能力；静态合同必须将目标不支持任一项规定为整次拒绝 |

## 已观察字段分区（候选）

1. 条件语义候选：`displayType`、`field.id`、`dataset.id`、`conditionType`、F/S 运算符和值、`timeType`、相对时间参数、`timeRange`、默认过滤规则和必要的 checked-fields 映射。必须逐显示类型确认白名单与值类型。
2. 需元数据解析后重建/复核：`dataset.fields`、字段对象中的 name/type/deType、`checkedFieldsMap`、`checkedFieldsMapArr*`、`treeDatasetId`、`treeFieldList`、`treeCheckedList`、`displayId`、`sortId`。字段名只展示，不作身份回退。
3. 与组件/交互实例绑定：条件 `id`、cascade 节点 `id`、`placeholder`、`name`。需另行确定重生成、保留或按语义重算；不得直接沿用会串联源目标的内部标识。
4. 运行状态/不复制候选：查询结果、源目标运行期间的 `currentSelectValue`、临时组件 field 对象、样式布局。级联 `selectValue` 是配置态分支使用的选择值，不可简单归为运行状态；候选要求从过滤条件的默认映射重新派生目标级联的 `selectValue/currentSelectValue`，而不是沿用源快照值。条件默认值与规则值是配置，必须保留。

## 级联图与事务边界

- 当前候选边的引用键编码 dataset/query/field 三个身份，不是纯组件名；边结构仍带自有 `id`、`placeholder`、`isTree`、`deType` 等字段。
- 复制前先构造源过滤条件与级联边闭包；每个引用必须精确解析至唯一源条件和字段。目标映射必须按 ID/经权威元数据确认后的显式映射执行。任一缺失、歧义、字段能力不兼容或成环则拒绝整次，保持目标及预览不变。
- 本次调查未证明允许跨 dataset 重绑定；业务验收要求相同 dataset 身份并拒绝同名异 ID。因此默认只定义精确同 dataset/field ID 的路径；任何别的映射保持未支持并拒绝。
- 尚未确定所有 query condition 字段的固定白名单、nested shapes 的深度/值域、历史版本转换策略、所有 ID 的重生成规则，以及能对现有 queryElement 一次提交的公开事务连接点。这些项继续阻塞 AC-F04-Q066/Q067 的产品代码准入。

## 增量复核修订

- `TC-Q006-03` 现在显式区分相同字符串ID但目标元数据已不存在；`TC-Q006-04` 覆盖权限拒绝/不可用的 fail-closed 行为，后者仍需真实权限环境运行。
- TTL边界输入只给 `created_at_ms` 与 `now_ms`，测试helper须自行计算年龄；未把外部提供的 `age_ms` 当可信输入。
- 容量向量定义可复现的 ASCII 与 `猫🙂`（7 UTF-8 bytes）加 padding 构造，冻结 byte counter 阈值；它仍不等于最终 envelope serializer 通过。另有实际50/51叶子语义树构造器。
- “最多两级”定位限定为 QueryCascade 单条编辑行按钮（233），不是整个依赖图或业务限制。

## 结论

DR-03 的“源码字段及引用形状未查”子项已有只读证据；完整查询适配器合同仍未冻结。下步需用该映射细化候选用例并对设计增量做独立复审。禁止据本文件把 Q066/Q067 改成通过或缩小验收分母。
