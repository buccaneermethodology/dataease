# 查询引用窄投影设计 r001

候选；card摘要d37e33836f172c2253bb4934c0f5c8585d81da4099f850cd02e1af64fb34b574复验通过。仅新增本文和QuerySchemaProjectionFixtures-r001.json，写前不存在。不完善全字段白名单，不改源码/合同/Goal，不授予Builder。

## 源码依据及支持域

前端路径前缀core/core-frontend/src/。v-query/options.ts:8–65新建条件包含id、dataset.id、field.id、displayType、optionValueSource、checkedFields/Map。QueryConditionConfiguration.vue:1184–1208仅普通0/2/5且optionValueSource=1、已绑定字段的条件或树形可进入级联目录；普通条件使用dataset.id/field.id，树使用treeFieldList[0]。本切片只支持该普通0/2/5分支，不处理树/参数/范围引用，拒绝的是窄函数输入域，不是产品永久拒绝这些功能。

QueryConditionConfiguration.vue:147–162从canvasViewInfo中提取图表id/tableId；因此checkedFields中的组件ID不能直接当datasetId，也不能把源条件dataset.id直接套到每个targetRef。调用方须显式提供sourceComponents目录，每项包含componentId/datasetId/fieldIds，分别来自真实组件目录和已取得字段元数据。本函数只验证输入一致性，不证明元数据服务/权限。

QueryCascade.vue:68–78把dataset/query/field串成三段datasetId；142–148另生成节点id；151–165同数据集后继节点可fieldId为空而placeholder派生。独立node.fieldId不是复合串末段。本窄域要求所有链相邻节点dataset相同且独立fieldId为空（或缺省）；独立fieldId非空、跨数据集关系明确UNSUPPORTED_REFERENCE_SHAPE，不能悄悄丢掉该引用。placeholder不当身份、不判断中文文案，不输出展示态。

Select.vue:248–273配置和运行分支分别写默认/运行选择；投影完全不读这些值。copy.ts:50–82预生成组件和条件映射，126–145对完整JSON替换引用；本切片不调用该字符串替换，不复制任何值/样式，也不产生GUID。新ID/maps由调用者提供，后续由QPREP检查完整性/单射。

## 精确接口和算法

接口见JSON；输入数据视为unknown先验证。propValue必须数组且至少一个条件，cascade缺省视为空（配置初始化QueryConditionConfiguration.vue:1708附近使用cascade||[]）；显式null/非数组拒绝，不能把错误输入当无链。所有被读取ID必须非空字符串且不含--，不把数字Long强转字符串。普通配置其他非引用字段允许存在但不读取/输出，不因此宣称完整结构合法。

对每个条件：要求displayType字符串为0/2/5、optionValueSource严格数字1、dataset.id/field.id、checkedFields非空不重复数组和checkedFieldsMap对象；每个checkedFields键须有非空字段ID。只对已选checkedFields构建targetRefs，其datasetId取sourceComponents唯一componentId对应项，fieldId取checkedFieldsMap值且须在该元数据fieldIds中。sourceComponents缺失/重复匹配或字段无法确认→SOURCE_COMPONENT_UNRESOLVED。未选中的Map多余键不投影，因为当前使用checkedFields决定是否查询（useFilter.ts:335–336）；不删除源原键。

显式检测复杂引用：treeFieldList/treeCheckedList、parameters、parametersList、parametersArr、checkedFieldsMapArr/Start/End及Num系列只允许缺省、null或结构正确的空容器；发现任何非空引用→UNSUPPORTED_REFERENCE_SHAPE。parametersStart/End仅缺省/null/空字符串允许。这些检查只防静默遗漏本切片未知引用，不是全字段白名单；其他未知字段不能被当作已证明无引用，调用方仅在已确认该普通参考形态时使用本函数，未知版本/字段由完整适配层保持未就绪。

级联逐节点读取id和datasetId。后者必须恰三段均符合ID约束，输出nodeId/conditionId/datasetId/fieldId（末段）；不根据placeholder或名称推断。空chain拒绝INVALID_INPUT；缺省cascade输出[]。额外的selectValue/currentSelectValue不读不写。节点所引条件是否存在/同身份、ID重复、映射完整性和环交给QPREP，不在projection制造另一个判定authority。maps仅复制conditionMap/nodeMap/componentMap三个命名结构，检查对象形态；精确映射语义仍由QPREP决定。

输出严格为当前query-reference-plan.ts的5个键conditions/chains/conditionMap/nodeMap/componentMap，conditions和nodes也只输出其接口定义字段。全部新对象，无partial value。验证顺序按JSON error_order，遍历按原数组次序；失败不改输入，不调用Store/事件/网络/Date/随机ID。

## 与QPREP及copy入口组合

拟新增纯模块query-schema-projection.ts；调用顺序projectQueryReferenceInput(raw)→成功后prepareQueryReferences(value)。projection不会重写原propValue/cascade；QPREP成功也只给typed引用计划。后续copy入口必须在独立准入的完整适配器获得可信设计配置、合法元数据及maps后调用，不能把该计划JSON整体替换原过滤配置。现有copy.ts整组件复制路径保持不变，本切片不挂UI、不改其默认行为。

TC-QPROJ-001普通两条件成功给精确typed输出；002缺省cascade；003缺组件目录；004非法复合串；005树形越出窄域；006缺闭包由QPREP明确拒绝。样本为源码形态合成，不是运行配置；无名称映射、无权限断言。003保证不会默认数据集，006保证projection成功不被误解为可粘贴。

## 执行准备与精确缺口

实现拟写scope及runner候选见JSON。现有core/core-frontend/tests/filter-copy-query-reference/query-reference-plan.test.ts可作runner模式参考；运行工具实际可用性由Builder预检，不安装依赖。独立复核后冻结这6项identity，新card/admission后记录可信RED及同identity GREEN。不得将本设计自检写成产品验证。

缺口：完整复杂query版本识别、跨数据集独立node.fieldId语义、树逐层引用和参数端点、payload反向投影、可信来源及目标权限均不在本窄域内；保留完整Q066/Q067分母，不能以UNSUPPORTED长期替代其最终成功路径。本轮只交可实现的纯投影准备输入，不再扩设计范围。
