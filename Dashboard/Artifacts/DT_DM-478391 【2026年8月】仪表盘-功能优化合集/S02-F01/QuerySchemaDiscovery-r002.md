# 查询组件字段与引用发现 r002（静态补充）

状态：只读源码调查。相比r001增加查询条件构造的字段并集与现有复制适用性；未冻结payload白名单、历史兼容或提交事务，不授予产品Builder准入。

## 新增的源码直接证据

| 源文件 | 观察 | 可支持的结论 |
|---|---|---|
| `core/core-frontend/src/custom-component/v-query/options.ts:8-65` | `infoFormat()`新建条件时同时产生条件`id/name`、字段对象、dataset对象、显示/排序/多选状态、条件F/S运算和值、时间规则、parameters、default/select/map值、checkedFields与checkedFieldsMap | 初始配置是混合语义/展示/运行字段对象；不能仅复制一个查询表达式字段 |
| `options.ts:68-137` | `attributes`补充`resultMode`、相对时间范围、数值范围、treeDatasetId/treeCheckedList/treeFieldList、动态timeRange对象及兼容属性 | 有额外树形、参数、动态时间/数值配置；仅按普通下拉过滤构造白名单会遗漏现存配置形态 |
| `QueryConditionConfiguration.vue:1769-1795, 2390-2410` | `parameterCompletion()`按当前默认属性补缺省，并由addQueryCriteriaConfig创建初始条件 | UI恢复/创建会补配置；不能据此认定旧保存数据已具有所有字段，也不能将补全值当成来源白名单 |
| `QueryConditionConfiguration.vue:1591-1629` | 提交最终保存`conditions.value`到`propValue`与`cascadeArr`；提交期间存在多个nextTick及清空/回填阶段 | 粘贴目标需要独立的候选状态与单次可观察提交点；已有确认流程本身不是原子替换实现 |
| `Select.vue:29-60, 500-569, 618-680` | Select配置接口显式使用`selectValue/defaultValue/defaultMapValue/mapValue`、checkedFields/Map、displayType、dataset/field、optionValueSource及默认值选项；运行还会读写`currentSelectValue` | 配置默认、映射和值选择属于不同用途；不能把所有value字段统一删除或原样带入 |
| `QueryCascade.vue:11-20, 43-82, 141-148` | Cascade接口含`datasetId/name/queryId/deType/fieldId/isTree`；运行列表含独立node `id`、placeholder、selectValue/currentSelectValue等 | 复合引用键绑定dataset/query/field；node ID和展示占位不等同业务身份 |

## 初始字段并集（候选，未冻结）

从`infoFormat()`与`attributes`观察到以下条件字段：`id`, `name`, `showError`, `timeGranularity`, `timeGranularityMultiple`, `field`, `displayId`, `sortId`, `sort`, `defaultMapValue`, `mapValue`, `conditionType`, `conditionValueOperatorF`, `conditionValueF`, `conditionValueOperatorS`, `conditionValueS`, `defaultConditionValueOperatorF`, `defaultConditionValueF`, `defaultConditionValueOperatorS`, `defaultConditionValueS`, `timeType`, `relativeToCurrent`, `required`, `timeNum`, `relativeToCurrentType`, `around`, `parametersStart`, `parametersEnd`, `arbitraryTime`, `timeNumRange`, `relativeToCurrentTypeRange`, `aroundRange`, `auto`, `defaultValue`, `selectValue`, `optionValueSource`, `valueSource`, `dataset`, `visible`, `defaultValueCheck`, `multiple`, `displayType`, `checkedFields`, `parameters`, `parametersCheck`, `parametersList`, `checkedFieldsMap`，并由`attributes`补充`hideConditionSwitching`, `resultMode`, `relativeToCurrentRange`, `timeRange`, `setTimeRange`, `showEmpty`, `defaultNumValueStart`, `defaultNumValueEnd`, `numValueStart`, `numValueEnd`, `displayFormat`, `oldTreeLoad`, `treeDatasetId`, `treeCheckedList`, `defaultValueFirstItem`, `treeFieldList`。

该并集只描述新建/默认对象出现的键。源码中另有按控件和参数动态产生的`checkedFieldsMapArr*`、`checkedFieldsMapStart/End*`、参数对象内部字段、options/labels和历史兼容字段。没有完整扫描并证明所有显示类型、参数类型、查询模式及旧存量版本；因此当前不能把这份清单叫作完整白名单。

## 身份和变换边界

1. 条件 `id` 和 cascade node `id` 属组件实例标识；复制后重生成候选。
2. 字段身份至少涉及 `field.id`、`dataset.id`、`displayId`、`checkedFieldsMap`及其条件映射；字段展示名称不能回退充当身份。
3. cascade `datasetId`字符串包含`datasetId--queryId--fieldId`复合引用。现有`copy.ts`对VQuery `propValue`/`cascade`做字符串替换以便整组件复用；该做法不能直接作为新过滤payload规范，因为它不是结构化的引用闭包校验，且可能触及展示/数据字段。
4. `selectValue`和`currentSelectValue`均有配置/运行分支用途。须依同一目标的默认过滤规则重算，禁止复制源运行态快照；`defaultValue`、`mapValue`及默认映射属于条件语义候选，不能一概剥除。
5. 任何字段未解析、引用多义、目标组件不支持、级联闭包不完整或出现环都应整次拒绝；原目标配置、预览和查询状态保持不变。

## 冻结前剩余工作

- 将动态字段追至所有生成/保存/恢复路径，区分持久化语义、可重建元数据、展示态、运行态和明确禁止项。
- 为各displayType、optionValueSource、树形、参数、动态时间和历史存量版本建出引用闭包及正负例；不按名字映射。
- 用真实目标queryElement确认可支持的完整属性闭包和内部ID重绑定，确定不会覆盖用户未提交编辑；为旧目标确认及取消/失败定唯一原子提交点。
- 独立复审精确白名单、迁移策略与case后，才能解除DG-03。权限拒绝/只读保密仍必须待真实权限模块/隔离实例独立验收。
