# Query Product Adapter 全形态设计候选 r003

状态：candidate；`frozen_for_builder=false`。Scope Delta：none。保留 10 Goal AC / 26 must-have / 16 产品义务；16 项全部 NOT_RUN。S01 独立；S01 F01 Entry Packet 当前为 CONDITIONAL，尚无独立终态证据；真实多用户权限环境 BLOCKED / NOT_RUN。当前不是 Design Freeze、产品通过或 Builder 准入。

本文件与同目录 QueryProductAdapterFullShapeCases-r001.json 配套。JSON包含source_manifest、逐字段矩阵、九项disposition、32项候选Cases和全分母映射；manifest 中 Sessions.md 与 Select.vue 的历史摘要已确认过期，不作为当前字节身份绑定。32项仍为候选，所有fixture_payload=null、oracle_status=NOT_READY，无执行证据。

## 来源与边界

绑定 card canonical SHA `efb76498cad3b962bcd5699396fe719340c6975afff455fbc668cadcc76c1bc5`；Context raw SHA `5f8056a4db0b44e5e54a6bdf800bd3be861a603aa50339d36d1229f2fa0c6464`。写前复核全部required-read摘要一致。源码证据只覆盖卡片列明七文件及既有设计/AC来源，未自行扩大到时间工具、参数DTO、目录遍历、保存owner。以下未决项是具体取证待办，不是对合法形态的永久禁止。

QueryCascade.vue:142–148 创建节点只有 datasetId/fieldId/placeholder/id；47–59 确认时增加 selectValue=[]。DynamicTimeRange.vue:95–100 同时回写 defaultValue/selectValue。TextSearch.vue:81–91 从默认字段拷贝运行字段。QueryConditionConfiguration.vue:599–635 根据 componentId 与双端Map选取参数，仍不足以定义完整DTO。这些反例说明不能按字段前缀或某一阶段对象构造统一schema。

## 来源阶段与隔离协议

候选流水线：可信配置原件＋阶段＋版本＋owner → 纯extract与schema检查 → 完整目录闭包校验/重绑 → 隔离runtime hydrate → 逐次权限与代际重验 → 单aggregate发布 → 一次逻辑预览 → 用户正常保存。每个箭头仍需产品owner和测试证明。live propValue被运行consumer污染时不可作为可信设计原件；不能通过清空运行字段后保留其他JSON冒充extract。

KEEP保留规则；REBIND仅转换有类型证据的引用；RESET仅在运行副本按shape初始化；REMOVE仅从新carrier排除已确认非设计数据；NOT_READY保留原输入并阻止整次发布。多动作行是条件分支，不授权任意选一个动作。所有未知字段/未知版本/缺失历史来源须报告具体路径，不静默剥离或补默认；不得调用带状态写入的parameterCompletion当迁移。

## 全形态及跨轴矩阵

|形态|displayType / 变化轴|来源|尚未冻结|
|---|---|---|---|
|SH-SELECT-TEXT|0；single/multiple / default off/explicit/first-item / manual/field optionValueSource|core/core-frontend/src/custom-component/v-query/Select.vue:476-560,1048-1084|首项回写来源、remote/optionFilter与手工值编码；optionValueSource全枚举及缺省未冻结|
|SH-SELECT-NUM|2,5；single/multiple / default off/explicit/first-item / manual/field optionValueSource|core/core-frontend/src/custom-component/v-query/Select.vue:476-560,1084|数值类型、0/空值/字符串数字及两种显示类型差异的完整schema|
|SH-TEXT|8；conditionType 0/1/2 / F/S eq/like / default/current|core/core-frontend/src/custom-component/v-query/TextSearch.vue:18-32,58-91,179|连接语义与全部操作符由生产查询consumer补证；不可仅凭两个UI选项冻结完整schema|
|SH-NUM-RANGE|22；start/end/both / 0/负值/空值 / parameter/nonparameter|core/core-frontend/src/custom-component/v-query/QueryConditionConfiguration.vue:219-247,364-386|范围开闭及缺端语义、默认到运行值映射的完整consumer证据|
|SH-FIXED-TIME|1,7；single/range / year/month/date/datetime / fixed|core/core-frontend/src/custom-component/v-query/FilterTime.vue:54-66|固定值序列化、时区、端点粒度与显示类型组合合法性|
|SH-DYNAMIC-TIME|1,7；today/custom/relative window / single/range / year/month/date/datetime|core/core-frontend/src/custom-component/v-query/DynamicTimeRange.vue:8-46,95-155|time-format与time-format-dayjs真实计算、单日期consumer、首次查询回写与时区oracle|
|SH-TREE|9；1/2/3/4/5层 / single/multiple / 混深/分隔符/空值 / optionFilter缺失/[]/非空|core/core-frontend/src/custom-component/v-query/Tree.vue:95-147|路径编码/解码、混深选择及自过滤结果集oracle；不得以层关系验证替代|
|AX-TIME-RESTRICTION|1,7；setTimeRange / timeRange fixed/dynamic / start/end/timeInterval|core/core-frontend/src/custom-component/v-query/FilterTime.vue:40-64,78-175|限制规则与默认规则区分、边界日期/Date与dayjs转换|
|AX-PARAMETER|；scalar/time range/numeric range / mixed field+parameter / duplicate/multi-target / searchQuery|core/core-frontend/src/custom-component/v-query/QueryConditionConfiguration.vue:364-475,599-635|完整SqlVariableDetails DTO、|DE|身份编码、端点方向和类型兼容|
|AX-CASCADE|；same-dataset/cross-dataset internal edge / 多链/共享节点/环/悬空|core/core-frontend/src/custom-component/v-query/QueryCascade.vue:47-81,142-164|跨dataset连接字段身份和消费语义、缺省selectValue=[]是否为确认阶段专属|
|AX-OPTIONS|；remote/field/manual / optionFilter/firstItem/sortList|core/core-frontend/src/custom-component/v-query/Select.vue:476-560,731-751,848-877,1084|选项provider、迟回包、排序字段是否过滤语义及完整白名单|
|AX-HISTORY-NESTING|；new carrier/legacy absent/unknown version / Group/DeTabs/multiplexing / save/load/undo/redo|Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/QueryProductAdapterDesign-r004.md#R4-06/R4-08|完整画布路径目录、迁移策略、绑定代际与持久化owner尚需证据|

所有行均覆盖创建、确认、运行、保存、恢复五阶段，当前只有局部源码证据；阶段完整性均NOT_READY。没有声明上述轴的笛卡尔积全部合法，合法组合和schema必须由生产路径证明。

## 逐字段责任矩阵

|字段路径（条件对象内，另注除外）|动作|来源阶段/形态|处理与历史缺省|
|---|---|---|---|
|id|REBIND|可信设计条件/级联节点；ALL|生成新条件/级联节点身份并建立全图映射；目标组件自身id保持。所有引用解析完毕后才发布。 目标/条件身份类型不明则NOT_READY 来源：core/core-frontend/src/custom-component/v-query/QueryCascade.vue:142-148|
|checkedFields|REBIND|可信设计绑定；ALL,AX-PARAMETER|以componentId目录重绑组件引用；dataset/field/parameter精确身份分别核对，双端方向保留，禁止按名称猜映射。 不可把缺Map自动补{}；历史版本迁移证据不足则NOT_READY 来源：core/core-frontend/src/custom-component/v-query/QueryConditionConfiguration.vue:364-475,599-635|
|checkedFieldsMap|REBIND|可信设计绑定；ALL,AX-PARAMETER|以componentId目录重绑组件引用；dataset/field/parameter精确身份分别核对，双端方向保留，禁止按名称猜映射。 不可把缺Map自动补{}；历史版本迁移证据不足则NOT_READY 来源：core/core-frontend/src/custom-component/v-query/QueryConditionConfiguration.vue:364-475,599-635|
|treeCheckedList|REBIND|可信设计绑定；ALL,AX-PARAMETER|以componentId目录重绑组件引用；dataset/field/parameter精确身份分别核对，双端方向保留，禁止按名称猜映射。 不可把缺Map自动补{}；历史版本迁移证据不足则NOT_READY 来源：core/core-frontend/src/custom-component/v-query/QueryConditionConfiguration.vue:364-475,599-635|
|checkedFieldsMapArr|REBIND|可信设计绑定；ALL,AX-PARAMETER|以componentId目录重绑组件引用；dataset/field/parameter精确身份分别核对，双端方向保留，禁止按名称猜映射。 不可把缺Map自动补{}；历史版本迁移证据不足则NOT_READY 来源：core/core-frontend/src/custom-component/v-query/QueryConditionConfiguration.vue:364-475,599-635|
|checkedFieldsMapStart|REBIND|可信设计绑定；ALL,AX-PARAMETER|以componentId目录重绑组件引用；dataset/field/parameter精确身份分别核对，双端方向保留，禁止按名称猜映射。 不可把缺Map自动补{}；历史版本迁移证据不足则NOT_READY 来源：core/core-frontend/src/custom-component/v-query/QueryConditionConfiguration.vue:364-475,599-635|
|checkedFieldsMapEnd|REBIND|可信设计绑定；ALL,AX-PARAMETER|以componentId目录重绑组件引用；dataset/field/parameter精确身份分别核对，双端方向保留，禁止按名称猜映射。 不可把缺Map自动补{}；历史版本迁移证据不足则NOT_READY 来源：core/core-frontend/src/custom-component/v-query/QueryConditionConfiguration.vue:364-475,599-635|
|checkedFieldsMapArrNum|REBIND|可信设计绑定；ALL,AX-PARAMETER|以componentId目录重绑组件引用；dataset/field/parameter精确身份分别核对，双端方向保留，禁止按名称猜映射。 不可把缺Map自动补{}；历史版本迁移证据不足则NOT_READY 来源：core/core-frontend/src/custom-component/v-query/QueryConditionConfiguration.vue:364-475,599-635|
|checkedFieldsMapStartNum|REBIND|可信设计绑定；ALL,AX-PARAMETER|以componentId目录重绑组件引用；dataset/field/parameter精确身份分别核对，双端方向保留，禁止按名称猜映射。 不可把缺Map自动补{}；历史版本迁移证据不足则NOT_READY 来源：core/core-frontend/src/custom-component/v-query/QueryConditionConfiguration.vue:364-475,599-635|
|checkedFieldsMapEndNum|REBIND|可信设计绑定；ALL,AX-PARAMETER|以componentId目录重绑组件引用；dataset/field/parameter精确身份分别核对，双端方向保留，禁止按名称猜映射。 不可把缺Map自动补{}；历史版本迁移证据不足则NOT_READY 来源：core/core-frontend/src/custom-component/v-query/QueryConditionConfiguration.vue:364-475,599-635|
|parametersArr|REBIND|可信设计绑定；ALL,AX-PARAMETER|以componentId目录重绑组件引用；dataset/field/parameter精确身份分别核对，双端方向保留，禁止按名称猜映射。 不可把缺Map自动补{}；历史版本迁移证据不足则NOT_READY 来源：core/core-frontend/src/custom-component/v-query/QueryConditionConfiguration.vue:364-475,599-635|
|datasetId|KEEP/REBIND|设计身份/树层序；ALL,SH-TREE,AX-CASCADE|dataset/field身份KEEP，仅明确组件/query引用REBIND；树层序完整保留。cascade复合dataset引用需分段类型模型后才转换。 复合编码或缺字段无法证明完整性则NOT_READY；不得删除合法跨dataset边 来源：core/core-frontend/src/custom-component/v-query/QueryCascade.vue:68-81,142-164；core/core-frontend/src/custom-component/v-query/Tree.vue:127-147|
|fieldId|KEEP/REBIND|设计身份/树层序；ALL,SH-TREE,AX-CASCADE|dataset/field身份KEEP，仅明确组件/query引用REBIND；树层序完整保留。cascade复合dataset引用需分段类型模型后才转换。 复合编码或缺字段无法证明完整性则NOT_READY；不得删除合法跨dataset边 来源：core/core-frontend/src/custom-component/v-query/QueryCascade.vue:68-81,142-164；core/core-frontend/src/custom-component/v-query/Tree.vue:127-147|
|treeDatasetId|KEEP/REBIND|设计身份/树层序；ALL,SH-TREE,AX-CASCADE|dataset/field身份KEEP，仅明确组件/query引用REBIND；树层序完整保留。cascade复合dataset引用需分段类型模型后才转换。 复合编码或缺字段无法证明完整性则NOT_READY；不得删除合法跨dataset边 来源：core/core-frontend/src/custom-component/v-query/QueryCascade.vue:68-81,142-164；core/core-frontend/src/custom-component/v-query/Tree.vue:127-147|
|treeFieldList|KEEP/REBIND|设计身份/树层序；ALL,SH-TREE,AX-CASCADE|dataset/field身份KEEP，仅明确组件/query引用REBIND；树层序完整保留。cascade复合dataset引用需分段类型模型后才转换。 复合编码或缺字段无法证明完整性则NOT_READY；不得删除合法跨dataset边 来源：core/core-frontend/src/custom-component/v-query/QueryCascade.vue:68-81,142-164；core/core-frontend/src/custom-component/v-query/Tree.vue:127-147|
|displayType|KEEP|可信设计规则；ALL|按已识别shape保持规则；首项默认保存规则，不捕获首项运行结果。 未枚举合法值/历史缺省NOT_READY，不按truthy或统一默认转换 来源：core/core-frontend/src/custom-component/v-query/Select.vue:476-560,1048-1084；core/core-frontend/src/custom-component/v-query/TextSearch.vue:18-32|
|multiple|KEEP|可信设计规则；ALL|按已识别shape保持规则；首项默认保存规则，不捕获首项运行结果。 未枚举合法值/历史缺省NOT_READY，不按truthy或统一默认转换 来源：core/core-frontend/src/custom-component/v-query/Select.vue:476-560,1048-1084；core/core-frontend/src/custom-component/v-query/TextSearch.vue:18-32|
|optionValueSource|KEEP|可信设计规则；ALL|按已识别shape保持规则；首项默认保存规则，不捕获首项运行结果。 未枚举合法值/历史缺省NOT_READY，不按truthy或统一默认转换 来源：core/core-frontend/src/custom-component/v-query/Select.vue:476-560,1048-1084；core/core-frontend/src/custom-component/v-query/TextSearch.vue:18-32|
|defaultValueCheck|KEEP|可信设计规则；ALL|按已识别shape保持规则；首项默认保存规则，不捕获首项运行结果。 未枚举合法值/历史缺省NOT_READY，不按truthy或统一默认转换 来源：core/core-frontend/src/custom-component/v-query/Select.vue:476-560,1048-1084；core/core-frontend/src/custom-component/v-query/TextSearch.vue:18-32|
|defaultValueFirstItem|KEEP|可信设计规则；ALL|按已识别shape保持规则；首项默认保存规则，不捕获首项运行结果。 未枚举合法值/历史缺省NOT_READY，不按truthy或统一默认转换 来源：core/core-frontend/src/custom-component/v-query/Select.vue:476-560,1048-1084；core/core-frontend/src/custom-component/v-query/TextSearch.vue:18-32|
|conditionType|KEEP|可信设计规则；ALL|按已识别shape保持规则；首项默认保存规则，不捕获首项运行结果。 未枚举合法值/历史缺省NOT_READY，不按truthy或统一默认转换 来源：core/core-frontend/src/custom-component/v-query/Select.vue:476-560,1048-1084；core/core-frontend/src/custom-component/v-query/TextSearch.vue:18-32|
|defaultValue|KEEP/REMOVE/NOT_READY|必须区分配置编辑确认与运行consumer回写；SH-SELECT-TEXT,SH-SELECT-NUM,SH-FIXED-TIME,SH-DYNAMIC-TIME,SH-TREE|可信显式默认KEEP；动态/首项派生值从新carrier中REMOVE但原输入不修改；仅有live propValue且无法区分来源时NOT_READY。 不能由default前缀推定是设计值；迁移不得从current反推default 来源：core/core-frontend/src/custom-component/v-query/Select.vue:476-560；core/core-frontend/src/custom-component/v-query/DynamicTimeRange.vue:95-100；core/core-frontend/src/custom-component/v-query/Tree.vue:95-143|
|defaultMapValue|KEEP/REMOVE/NOT_READY|必须区分配置编辑确认与运行consumer回写；SH-SELECT-TEXT,SH-SELECT-NUM,SH-FIXED-TIME,SH-DYNAMIC-TIME,SH-TREE|可信显式默认KEEP；动态/首项派生值从新carrier中REMOVE但原输入不修改；仅有live propValue且无法区分来源时NOT_READY。 不能由default前缀推定是设计值；迁移不得从current反推default 来源：core/core-frontend/src/custom-component/v-query/Select.vue:476-560；core/core-frontend/src/custom-component/v-query/DynamicTimeRange.vue:95-100；core/core-frontend/src/custom-component/v-query/Tree.vue:95-143|
|selectValue|RESET|运行副本；ALL|不进入设计carrier；在隔离runtime副本按可信默认/规则hydrate；RESET不是统一赋[]，须shape专属空态。 空态undefined/[]/空字符串/0按shape取证；不明确则NOT_READY 来源：core/core-frontend/src/custom-component/v-query/TextSearch.vue:81-91；core/core-frontend/src/custom-component/v-query/Select.vue:1048-1054；core/core-frontend/src/custom-component/v-query/QueryCascade.vue:58|
|mapValue|RESET|运行副本；ALL|不进入设计carrier；在隔离runtime副本按可信默认/规则hydrate；RESET不是统一赋[]，须shape专属空态。 空态undefined/[]/空字符串/0按shape取证；不明确则NOT_READY 来源：core/core-frontend/src/custom-component/v-query/TextSearch.vue:81-91；core/core-frontend/src/custom-component/v-query/Select.vue:1048-1054；core/core-frontend/src/custom-component/v-query/QueryCascade.vue:58|
|conditionValueF|RESET|运行副本；ALL|不进入设计carrier；在隔离runtime副本按可信默认/规则hydrate；RESET不是统一赋[]，须shape专属空态。 空态undefined/[]/空字符串/0按shape取证；不明确则NOT_READY 来源：core/core-frontend/src/custom-component/v-query/TextSearch.vue:81-91；core/core-frontend/src/custom-component/v-query/Select.vue:1048-1054；core/core-frontend/src/custom-component/v-query/QueryCascade.vue:58|
|conditionValueS|RESET|运行副本；ALL|不进入设计carrier；在隔离runtime副本按可信默认/规则hydrate；RESET不是统一赋[]，须shape专属空态。 空态undefined/[]/空字符串/0按shape取证；不明确则NOT_READY 来源：core/core-frontend/src/custom-component/v-query/TextSearch.vue:81-91；core/core-frontend/src/custom-component/v-query/Select.vue:1048-1054；core/core-frontend/src/custom-component/v-query/QueryCascade.vue:58|
|conditionValueOperatorF|RESET|运行副本；ALL|不进入设计carrier；在隔离runtime副本按可信默认/规则hydrate；RESET不是统一赋[]，须shape专属空态。 空态undefined/[]/空字符串/0按shape取证；不明确则NOT_READY 来源：core/core-frontend/src/custom-component/v-query/TextSearch.vue:81-91；core/core-frontend/src/custom-component/v-query/Select.vue:1048-1054；core/core-frontend/src/custom-component/v-query/QueryCascade.vue:58|
|conditionValueOperatorS|RESET|运行副本；ALL|不进入设计carrier；在隔离runtime副本按可信默认/规则hydrate；RESET不是统一赋[]，须shape专属空态。 空态undefined/[]/空字符串/0按shape取证；不明确则NOT_READY 来源：core/core-frontend/src/custom-component/v-query/TextSearch.vue:81-91；core/core-frontend/src/custom-component/v-query/Select.vue:1048-1054；core/core-frontend/src/custom-component/v-query/QueryCascade.vue:58|
|numValueStart|RESET|运行副本；ALL|不进入设计carrier；在隔离runtime副本按可信默认/规则hydrate；RESET不是统一赋[]，须shape专属空态。 空态undefined/[]/空字符串/0按shape取证；不明确则NOT_READY 来源：core/core-frontend/src/custom-component/v-query/TextSearch.vue:81-91；core/core-frontend/src/custom-component/v-query/Select.vue:1048-1054；core/core-frontend/src/custom-component/v-query/QueryCascade.vue:58|
|numValueEnd|RESET|运行副本；ALL|不进入设计carrier；在隔离runtime副本按可信默认/规则hydrate；RESET不是统一赋[]，须shape专属空态。 空态undefined/[]/空字符串/0按shape取证；不明确则NOT_READY 来源：core/core-frontend/src/custom-component/v-query/TextSearch.vue:81-91；core/core-frontend/src/custom-component/v-query/Select.vue:1048-1054；core/core-frontend/src/custom-component/v-query/QueryCascade.vue:58|
|defaultConditionValueF|KEEP|配置默认规则；SH-TEXT,SH-NUM-RANGE|保持可信默认值与操作符；数值0有效，不用||替换。运行编辑与设计默认分离。 缺失和空值不能合并；数值完整consumer尚待取证 来源：core/core-frontend/src/custom-component/v-query/TextSearch.vue:18-32,81-91；Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/QueryProductAdapterDesign-r004.md|
|defaultConditionValueS|KEEP|配置默认规则；SH-TEXT,SH-NUM-RANGE|保持可信默认值与操作符；数值0有效，不用||替换。运行编辑与设计默认分离。 缺失和空值不能合并；数值完整consumer尚待取证 来源：core/core-frontend/src/custom-component/v-query/TextSearch.vue:18-32,81-91；Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/QueryProductAdapterDesign-r004.md|
|defaultConditionValueOperatorF|KEEP|配置默认规则；SH-TEXT,SH-NUM-RANGE|保持可信默认值与操作符；数值0有效，不用||替换。运行编辑与设计默认分离。 缺失和空值不能合并；数值完整consumer尚待取证 来源：core/core-frontend/src/custom-component/v-query/TextSearch.vue:18-32,81-91；Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/QueryProductAdapterDesign-r004.md|
|defaultConditionValueOperatorS|KEEP|配置默认规则；SH-TEXT,SH-NUM-RANGE|保持可信默认值与操作符；数值0有效，不用||替换。运行编辑与设计默认分离。 缺失和空值不能合并；数值完整consumer尚待取证 来源：core/core-frontend/src/custom-component/v-query/TextSearch.vue:18-32,81-91；Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/QueryProductAdapterDesign-r004.md|
|defaultNumValueStart|KEEP|配置默认规则；SH-TEXT,SH-NUM-RANGE|保持可信默认值与操作符；数值0有效，不用||替换。运行编辑与设计默认分离。 缺失和空值不能合并；数值完整consumer尚待取证 来源：core/core-frontend/src/custom-component/v-query/TextSearch.vue:18-32,81-91；Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/QueryProductAdapterDesign-r004.md|
|defaultNumValueEnd|KEEP|配置默认规则；SH-TEXT,SH-NUM-RANGE|保持可信默认值与操作符；数值0有效，不用||替换。运行编辑与设计默认分离。 缺失和空值不能合并；数值完整consumer尚待取证 来源：core/core-frontend/src/custom-component/v-query/TextSearch.vue:18-32,81-91；Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/QueryProductAdapterDesign-r004.md|
|timeType|KEEP|动态表达式设计规则；SH-DYNAMIC-TIME|保持相对规则及显式锚点，运行计算写runtime副本；固定now/timezone计算预期值。 Date/字符串的序列化与历史迁移未证据化则NOT_READY 来源：core/core-frontend/src/custom-component/v-query/DynamicTimeRange.vue:8-46,54-82,110-155|
|timeGranularity|KEEP|动态表达式设计规则；SH-DYNAMIC-TIME|保持相对规则及显式锚点，运行计算写runtime副本；固定now/timezone计算预期值。 Date/字符串的序列化与历史迁移未证据化则NOT_READY 来源：core/core-frontend/src/custom-component/v-query/DynamicTimeRange.vue:8-46,54-82,110-155|
|timeGranularityMultiple|KEEP|动态表达式设计规则；SH-DYNAMIC-TIME|保持相对规则及显式锚点，运行计算写runtime副本；固定now/timezone计算预期值。 Date/字符串的序列化与历史迁移未证据化则NOT_READY 来源：core/core-frontend/src/custom-component/v-query/DynamicTimeRange.vue:8-46,54-82,110-155|
|relativeToCurrentRange|KEEP|动态表达式设计规则；SH-DYNAMIC-TIME|保持相对规则及显式锚点，运行计算写runtime副本；固定now/timezone计算预期值。 Date/字符串的序列化与历史迁移未证据化则NOT_READY 来源：core/core-frontend/src/custom-component/v-query/DynamicTimeRange.vue:8-46,54-82,110-155|
|timeNum|KEEP|动态表达式设计规则；SH-DYNAMIC-TIME|保持相对规则及显式锚点，运行计算写runtime副本；固定now/timezone计算预期值。 Date/字符串的序列化与历史迁移未证据化则NOT_READY 来源：core/core-frontend/src/custom-component/v-query/DynamicTimeRange.vue:8-46,54-82,110-155|
|relativeToCurrentType|KEEP|动态表达式设计规则；SH-DYNAMIC-TIME|保持相对规则及显式锚点，运行计算写runtime副本；固定now/timezone计算预期值。 Date/字符串的序列化与历史迁移未证据化则NOT_READY 来源：core/core-frontend/src/custom-component/v-query/DynamicTimeRange.vue:8-46,54-82,110-155|
|around|KEEP|动态表达式设计规则；SH-DYNAMIC-TIME|保持相对规则及显式锚点，运行计算写runtime副本；固定now/timezone计算预期值。 Date/字符串的序列化与历史迁移未证据化则NOT_READY 来源：core/core-frontend/src/custom-component/v-query/DynamicTimeRange.vue:8-46,54-82,110-155|
|arbitraryTime|KEEP|动态表达式设计规则；SH-DYNAMIC-TIME|保持相对规则及显式锚点，运行计算写runtime副本；固定now/timezone计算预期值。 Date/字符串的序列化与历史迁移未证据化则NOT_READY 来源：core/core-frontend/src/custom-component/v-query/DynamicTimeRange.vue:8-46,54-82,110-155|
|timeNumRange|KEEP|动态表达式设计规则；SH-DYNAMIC-TIME|保持相对规则及显式锚点，运行计算写runtime副本；固定now/timezone计算预期值。 Date/字符串的序列化与历史迁移未证据化则NOT_READY 来源：core/core-frontend/src/custom-component/v-query/DynamicTimeRange.vue:8-46,54-82,110-155|
|relativeToCurrentTypeRange|KEEP|动态表达式设计规则；SH-DYNAMIC-TIME|保持相对规则及显式锚点，运行计算写runtime副本；固定now/timezone计算预期值。 Date/字符串的序列化与历史迁移未证据化则NOT_READY 来源：core/core-frontend/src/custom-component/v-query/DynamicTimeRange.vue:8-46,54-82,110-155|
|aroundRange|KEEP|动态表达式设计规则；SH-DYNAMIC-TIME|保持相对规则及显式锚点，运行计算写runtime副本；固定now/timezone计算预期值。 Date/字符串的序列化与历史迁移未证据化则NOT_READY 来源：core/core-frontend/src/custom-component/v-query/DynamicTimeRange.vue:8-46,54-82,110-155|
|arbitraryTimeRange|KEEP|动态表达式设计规则；SH-DYNAMIC-TIME|保持相对规则及显式锚点，运行计算写runtime副本；固定now/timezone计算预期值。 Date/字符串的序列化与历史迁移未证据化则NOT_READY 来源：core/core-frontend/src/custom-component/v-query/DynamicTimeRange.vue:8-46,54-82,110-155|
|setTimeRange|KEEP|可选时间限制规则；AX-TIME-RESTRICTION|限制与默认规则独立建模，限制内每个键仍需schema和时间consumer证明。 缺失≠关闭；不能默默移除不理解的限制 来源：core/core-frontend/src/custom-component/v-query/FilterTime.vue:40-64,78-175|
|timeRange|KEEP|可选时间限制规则；AX-TIME-RESTRICTION|限制与默认规则独立建模，限制内每个键仍需schema和时间consumer证明。 缺失≠关闭；不能默默移除不理解的限制 来源：core/core-frontend/src/custom-component/v-query/FilterTime.vue:40-64,78-175|
|optionFilter|NOT_READY|规则/运行缓存混合需逐shape确认；AX-OPTIONS,SH-TREE|缺失、[]、非空分别建fixture；只有确认语义后KEEP规则、REMOVE运行缓存。 当前不能统一清空或透传 来源：core/core-frontend/src/custom-component/v-query/Select.vue:731-751,848-877；core/core-frontend/src/custom-component/v-query/Tree.vue|
|remote|NOT_READY|规则/运行缓存混合需逐shape确认；AX-OPTIONS,SH-TREE|缺失、[]、非空分别建fixture；只有确认语义后KEEP规则、REMOVE运行缓存。 当前不能统一清空或透传 来源：core/core-frontend/src/custom-component/v-query/Select.vue:731-751,848-877；core/core-frontend/src/custom-component/v-query/Tree.vue|
|sortList|NOT_READY|规则/运行缓存混合需逐shape确认；AX-OPTIONS,SH-TREE|缺失、[]、非空分别建fixture；只有确认语义后KEEP规则、REMOVE运行缓存。 当前不能统一清空或透传 来源：core/core-frontend/src/custom-component/v-query/Select.vue:731-751,848-877；core/core-frontend/src/custom-component/v-query/Tree.vue|
|field|NOT_READY|元数据或加载缓存；ALL|签名目录提供完整身份与类型；只能在白名单证明后重建元数据或移除缓存。 元数据白名单未冻结，禁止凭UI字段集合认定完整 来源：core/core-frontend/src/custom-component/v-query/QueryConditionConfiguration.vue；core/core-frontend/src/custom-component/v-query/Tree.vue:147|
|dataset.fields|NOT_READY|元数据或加载缓存；ALL|签名目录提供完整身份与类型；只能在白名单证明后重建元数据或移除缓存。 元数据白名单未冻结，禁止凭UI字段集合认定完整 来源：core/core-frontend/src/custom-component/v-query/QueryConditionConfiguration.vue；core/core-frontend/src/custom-component/v-query/Tree.vue:147|
|parametersList|NOT_READY|元数据或加载缓存；ALL|签名目录提供完整身份与类型；只能在白名单证明后重建元数据或移除缓存。 元数据白名单未冻结，禁止凭UI字段集合认定完整 来源：core/core-frontend/src/custom-component/v-query/QueryConditionConfiguration.vue；core/core-frontend/src/custom-component/v-query/Tree.vue:147|
|oldTreeLoad|NOT_READY|元数据或加载缓存；ALL|签名目录提供完整身份与类型；只能在白名单证明后重建元数据或移除缓存。 元数据白名单未冻结，禁止凭UI字段集合认定完整 来源：core/core-frontend/src/custom-component/v-query/QueryConditionConfiguration.vue；core/core-frontend/src/custom-component/v-query/Tree.vue:147|
|name|NOT_READY|条件语义与展示边界未完全裁决；ALL|外层样式布局不复制；条件内字段逐项判断是否影响过滤/顺序/必填，不能统一剥离。 保留原输入，阻止全形态发布，待source/业务边界审查 来源：core/core-frontend/src/custom-component/v-query/TextSearch.vue:22-26,96-107；core/core-frontend/src/custom-component/v-query/QueryCascade.vue:142-164|
|visible|NOT_READY|条件语义与展示边界未完全裁决；ALL|外层样式布局不复制；条件内字段逐项判断是否影响过滤/顺序/必填，不能统一剥离。 保留原输入，阻止全形态发布，待source/业务边界审查 来源：core/core-frontend/src/custom-component/v-query/TextSearch.vue:22-26,96-107；core/core-frontend/src/custom-component/v-query/QueryCascade.vue:142-164|
|showError|NOT_READY|条件语义与展示边界未完全裁决；ALL|外层样式布局不复制；条件内字段逐项判断是否影响过滤/顺序/必填，不能统一剥离。 保留原输入，阻止全形态发布，待source/业务边界审查 来源：core/core-frontend/src/custom-component/v-query/TextSearch.vue:22-26,96-107；core/core-frontend/src/custom-component/v-query/QueryCascade.vue:142-164|
|sort|NOT_READY|条件语义与展示边界未完全裁决；ALL|外层样式布局不复制；条件内字段逐项判断是否影响过滤/顺序/必填，不能统一剥离。 保留原输入，阻止全形态发布，待source/业务边界审查 来源：core/core-frontend/src/custom-component/v-query/TextSearch.vue:22-26,96-107；core/core-frontend/src/custom-component/v-query/QueryCascade.vue:142-164|
|sortId|NOT_READY|条件语义与展示边界未完全裁决；ALL|外层样式布局不复制；条件内字段逐项判断是否影响过滤/顺序/必填，不能统一剥离。 保留原输入，阻止全形态发布，待source/业务边界审查 来源：core/core-frontend/src/custom-component/v-query/TextSearch.vue:22-26,96-107；core/core-frontend/src/custom-component/v-query/QueryCascade.vue:142-164|
|placeholder|NOT_READY|条件语义与展示边界未完全裁决；ALL|外层样式布局不复制；条件内字段逐项判断是否影响过滤/顺序/必填，不能统一剥离。 保留原输入，阻止全形态发布，待source/业务边界审查 来源：core/core-frontend/src/custom-component/v-query/TextSearch.vue:22-26,96-107；core/core-frontend/src/custom-component/v-query/QueryCascade.vue:142-164|
|queryConditionWidth|NOT_READY|条件语义与展示边界未完全裁决；ALL|外层样式布局不复制；条件内字段逐项判断是否影响过滤/顺序/必填，不能统一剥离。 保留原输入，阻止全形态发布，待source/业务边界审查 来源：core/core-frontend/src/custom-component/v-query/TextSearch.vue:22-26,96-107；core/core-frontend/src/custom-component/v-query/QueryCascade.vue:142-164|
|查询结果|REMOVE|非过滤配置；ALL|仅从新carrier排除，不修改源对象；目标样式布局保持。 未知键不自动归为此类 来源：Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/Goal.final.json#sections.scope|
|外层样式|REMOVE|非过滤配置；ALL|仅从新carrier排除，不修改源对象；目标样式布局保持。 未知键不自动归为此类 来源：Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/Goal.final.json#sections.scope|
|外层布局|REMOVE|非过滤配置；ALL|仅从新carrier排除，不修改源对象；目标样式布局保持。 未知键不自动归为此类 来源：Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/Goal.final.json#sections.scope|
|未知字段|NOT_READY|未识别来源；ALL|保留输入原件；整次不发布并报告具体路径；后续扩展/迁移可解除，非永久unsupported。 不得执行会写状态的parameterCompletion作为迁移；不得JSON序列化静默丢undefined后宣称等价 来源：Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/QueryProductAdapterDesign-r004.md#R4-02|
|未知schema版本|NOT_READY|未识别来源；ALL|保留输入原件；整次不发布并报告具体路径；后续扩展/迁移可解除，非永久unsupported。 不得执行会写状态的parameterCompletion作为迁移；不得JSON序列化静默丢undefined后宣称等价 来源：Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/QueryProductAdapterDesign-r004.md#R4-02|
|无版本历史对象|NOT_READY|未识别来源；ALL|保留输入原件；整次不发布并报告具体路径；后续扩展/迁移可解除，非永久unsupported。 不得执行会写状态的parameterCompletion作为迁移；不得JSON序列化静默丢undefined后宣称等价 来源：Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/QueryProductAdapterDesign-r004.md#R4-02|

## R4-01..09 disposition

九项均已拆为责任和证据请求，均未宣称语义缺口关闭。

### R4-01 提取与runtime隔离

可信设计来源必须带阶段/版本/owner；提取不读被consumer污染的live默认；runtime深副本hydrate。

尚需：来源阶段证明；显式默认/首项/动态回写的差异fixture；保存重开保真。

映射：AC-F01-Q012, AC-F04-Q066, AC-F04-Q067；Goal AC-S02-02/03/04/05/06/07/08/09。状态：候选责任已分解；语义缺口仍NOT_READY。

### R4-02 全shape与schema

每shape×optionValueSource×创建/确认/保存/恢复独立schema；不把options并集当schema。

尚需：全部创建工厂、保存/恢复路径、元数据白名单、缺省迁移和undefined口径。

映射：AC-F01-Q012, AC-F04-Q066；Goal AC-S02-02/03/04/05/06/07/08/09。状态：候选责任已分解；语义缺口仍NOT_READY。

### R4-03 树与内部跨dataset级联

源目标复制兼容dataset ID必须相同；合法级联内部跨dataset边独立验证完整连接图，不全局禁止。

尚需：树编码及混深/空值/分隔符消费者；跨dataset字段关系/闭环检测与查询结果。

映射：AC-F01-Q006, AC-F04-Q066, AC-F04-Q067；Goal AC-S02-02/03/04/05/06/07/08/09。状态：候选责任已分解；语义缺口仍NOT_READY。

### R4-04 参数与双端

field和parameter分型；六range Map与parametersArr联动重绑；保持start/end方向及完整参数对象。

尚需：SqlVariableDetails DTO、|DE|编码、端点类型范围、混合目标/searchQuery消费路径。

映射：AC-F01-Q006, AC-F04-Q066；Goal AC-S02-02/03/04/05/06/07/08/09。状态：候选责任已分解；语义缺口仍NOT_READY。

### R4-05 动态日期与限制

规则KEEP，计算值仅runtime；固定时钟/时区/粒度比较命中ID；限制规则单独校验。

尚需：真实时间函数、DST/月末/闰日边界精确oracle；Date/dayjs序列化。

映射：AC-F01-Q012, AC-F01-Q014；Goal AC-S02-02/03/04/05/06/07/08/09。状态：候选责任已分解；语义缺口仍NOT_READY。

### R4-06 目标目录与闭包

签名目录绑定画布/组件/数据集/字段/参数/版本/身份代际；嵌套路径和全部活动引用保持。

尚需：Group/DeTabs/multiplexing遍历；重名/重复/多目标/编辑变更检测；权限授权来源。

映射：AC-F01-Q006, AC-F04-Q066；Goal AC-S02-02/03/04/05/06/07/08/09。状态：候选责任已分解；语义缺口仍NOT_READY。

### R4-07 单次发布与副作用

prepare纯函数；授权后再验代际；单aggregate publish与watch门控候选；不能把多个setter叫原子事务。

尚需：产品真实publish owner、watch/nextTick边界；预览异常时回滚范围与成功提示时点须审查。

映射：AC-F01-Q007, AC-F01-Q014；Goal AC-S02-02/03/04/05/06/07/08/09。状态：候选责任已分解；语义缺口仍NOT_READY。

### R4-08 保存与历史carrier

只正常保存持久化，既有undo/redo回归；旧历史无carrier不从live猜建；保存失败保留旧已存版本。

尚需：旧历史迁移、嵌套定位、样式编辑与并发保存冲突、迟回包/undo/redo owner。

映射：AC-F01-Q014, AC-F04-Q067；Goal AC-S02-02/03/04/05/06/07/08/09。状态：候选责任已分解；语义缺口仍NOT_READY。

### R4-09 权限时钟外部前置

DG-01/02保持真实环境阻塞；每次权限重验/撤权/身份换代；S01独立。

尚需：真实角色与数据集权限、跨标签失效/可信时钟；S01 F01 Packet NOT_AVAILABLE；禁止mock替代。

映射：AC-F01-Q005, AC-F01-Q008, AC-F01-Q009, AC-F01-ORIG-01, AC-F01-ORIG-02；Goal AC-S02-02/03/04/05/06/07/08/09。状态：候选责任已分解；语义缺口仍NOT_READY。

## 失败原子性与副作用oracle

每个案例记录发布前目标完整树、carrier、运行副本、已存版本、预览记录ID、身份/目录代际，以及publish/preview意图/新过滤请求/快照/保存/成功提示计数。prepare或授权等待中故障、撤权、代际改变、缺字段、环、未知shape、确认取消均应零发布且上述状态不变；错误提示不计成功副作用。复制失败也须保留上次有效内部共享树；不接触系统剪贴板。

成功候选oracle：完整替换而非逐片段应用，旧条件消失；源对象与目标无共享引用；仅一次逻辑预览意图，不能要求只有一次底层网络请求；不自动保存。多Pinia setter、nextTick前清空、validate写runtime都不能直接证明此原子边界。预览在发布后失败的回滚/补偿范围尚未裁定；不能声称已发网络请求可抹除，也不能把错误结果包装成成功。需先确定真实owner和watch门控，再冻结产品oracle。

时间fixture必须同时给now、timezone、粒度、完整规则、预期起止和命中记录ID；DST/月末/闰日不得只断言“结果存在”。树fixture必须有层序、原始路径值、编码、选项过滤与预期记录ID。参数fixture必须有完整DTO及双端身份/类型/方向。当前这些精确payload/结果未取得，因此均NOT_READY。

## Cases与完整分母

|Case|目标|R4|状态|
|---|---|---|---|
|FS-001|可信默认与runtime污染对照|R4-01|candidate / NOT_READY / NOT_RUN|
|FS-002|全部选择组合|R4-02|candidate / NOT_READY / NOT_RUN|
|FS-003|文本F/S和数值双端|R4-01,R4-02|candidate / NOT_READY / NOT_RUN|
|FS-004|树路径完整矩阵|R4-03|candidate / NOT_READY / NOT_RUN|
|FS-005|内部跨dataset合法级联|R4-03|candidate / NOT_READY / NOT_RUN|
|FS-006|级联失败原子性|R4-03,R4-07|candidate / NOT_READY / NOT_RUN|
|FS-007|参数双端和混合目录|R4-04,R4-06|candidate / NOT_READY / NOT_RUN|
|FS-008|固定日期与时间限制|R4-05|candidate / NOT_READY / NOT_RUN|
|FS-009|动态today/custom和日历边界|R4-01,R4-05|candidate / NOT_READY / NOT_RUN|
|FS-010|创建确认保存恢复全阶段|R4-02,R4-08|candidate / NOT_READY / NOT_RUN|
|FS-011|目录嵌套与代际|R4-06|candidate / NOT_READY / NOT_RUN|
|FS-012|prepare和授权等待注入|R4-07,R4-09|candidate / NOT_READY / NOT_RUN|
|FS-013|单次发布和preview故障|R4-07|candidate / NOT_READY / NOT_RUN|
|FS-014|正常保存与失败重开|R4-08|candidate / NOT_READY / NOT_RUN|
|FS-015|独立副本与既有undo/redo|R4-01,R4-08|candidate / NOT_READY / NOT_RUN|
|FS-016|跨标签身份权限有效期|R4-09|candidate / NOT_READY / NOT_RUN|
|FS-BASE-AC-F01-Q004|原始产品义务保留：AC-F01-Q004||candidate / NOT_READY / NOT_RUN|
|FS-BASE-AC-F01-Q005|原始产品义务保留：AC-F01-Q005|R4-09|candidate / NOT_READY / NOT_RUN|
|FS-BASE-AC-F01-Q006|原始产品义务保留：AC-F01-Q006|R4-03,R4-04,R4-06|candidate / NOT_READY / NOT_RUN|
|FS-BASE-AC-F01-Q007|原始产品义务保留：AC-F01-Q007|R4-07|candidate / NOT_READY / NOT_RUN|
|FS-BASE-AC-F01-Q008|原始产品义务保留：AC-F01-Q008|R4-09|candidate / NOT_READY / NOT_RUN|
|FS-BASE-AC-F01-Q009|原始产品义务保留：AC-F01-Q009|R4-09|candidate / NOT_READY / NOT_RUN|
|FS-BASE-AC-F01-Q010|原始产品义务保留：AC-F01-Q010||candidate / NOT_READY / NOT_RUN|
|FS-BASE-AC-F01-Q011|原始产品义务保留：AC-F01-Q011||candidate / NOT_READY / NOT_RUN|
|FS-BASE-AC-F01-Q012|原始产品义务保留：AC-F01-Q012|R4-01,R4-02,R4-05|candidate / NOT_READY / NOT_RUN|
|FS-BASE-AC-F01-Q013|原始产品义务保留：AC-F01-Q013||candidate / NOT_READY / NOT_RUN|
|FS-BASE-AC-F01-Q014|原始产品义务保留：AC-F01-Q014|R4-05,R4-07,R4-08|candidate / NOT_READY / NOT_RUN|
|FS-BASE-AC-F01-Q015|原始产品义务保留：AC-F01-Q015||candidate / NOT_READY / NOT_RUN|
|FS-BASE-AC-F01-ORIG-01|原始产品义务保留：AC-F01-ORIG-01|R4-09|candidate / NOT_READY / NOT_RUN|
|FS-BASE-AC-F01-ORIG-02|原始产品义务保留：AC-F01-ORIG-02|R4-09|candidate / NOT_READY / NOT_RUN|
|FS-BASE-AC-F04-Q066|原始产品义务保留：AC-F04-Q066|R4-01,R4-02,R4-03,R4-04,R4-06|candidate / NOT_READY / NOT_RUN|
|FS-BASE-AC-F04-Q067|原始产品义务保留：AC-F04-Q067|R4-01,R4-03,R4-08|candidate / NOT_READY / NOT_RUN|

Goal十项逐一保留：AC-S02-01, AC-S02-02, AC-S02-03, AC-S02-04, AC-S02-05, AC-S02-06, AC-S02-07, AC-S02-08, AC-S02-09, AC-S02-10。26项must-have直接投影自Goal.final.json，不修改其pending状态。16项产品义务各有FS-BASE行，包含图表路径、只读、系统剪贴板、容量、原组件复制/改类型回归；这些保留行不能计为已覆盖执行。完整原始期望见JSON oracle及其source_manifest。

Q013保持50叶子/1MB与1001枚举合法条件，不另加1000枚举限制；恰30min和字节口径遵循现有工程提案及待裁状态，本候选不独立冻结。Q066/Q067保留完整自过滤/动态/级联和独立副本，不扩建F04规则引擎。ORIG-02不把历史线索变新入口，S01 Packet仍NOT_AVAILABLE。

## 后续准入

1. 对每个NOT_READY补齐指定来源、完整版本/阶段fixture、精确oracle；需要扩大read-set时由控制面显式更新卡片与Context。
2. 独立review核对全形态责任、参数/树/级联闭包、unknown迁移及发布后失败语义。
3. 合同/Cases冻结、可信RED、真实权限/S01前置与产品admission有效后，才允许Builder写产品入口。
4. 本轮仅JSON解析、唯一ID、九项/形态/10-26-16分母等静态校验；它们不构成行为测试或独立验收。


---

## r002 历史证据增量与处置覆盖（保留为历史快照）

本文完整保留 r001 的设计基线、Goal 分母、字段候选矩阵及 32 个原始 Cases；本节是后续证据和评审状态的当前权威增量。若基线叙述与本节的现态冲突，以本节为准。r002 仍是 `candidate / design-only`，`frozen_for_builder=false`，不授权产品 UI、Store、source-read 或 target-commit。

### Authority、分母与前置条件

- 权威仍为 `Goal.final.json` 和原始用户意图；保持 10 项 Goal AC、26 项 must-have、16 项产品义务，`Scope Delta: none`。16 项产品义务仍为 `NOT_RUN`；本版没有新增、删减或替换 Goal 义务。
- S01 F01 Entry Packet 为 `CONDITIONAL`，尚无可复核的独立终态证据包；真实多用户权限模块/隔离环境为 `BLOCKED / NOT_RUN`。只读用户禁止查看、复制、粘贴，以及撤权、恢复、跨标签失效均未验证。standalone/admin/mock 不可替代。
- Authority Materials 主包第 3/3 轮仍为 `NEEDS_REVISION`（AM-09）。主包的评审轮次已耗尽，不开启第 4 轮；审后更正 r002 的 `PASS_WITH_BOUNDS` 仅适用于更正说明，不改变主包结论，也不停止不依赖其缺口的 S02 工作。

### 采用的后续局部来源及其边界

| 切片 | 已有增量材料 | 本版允许的结论 | 未解除的边界 |
|---|---|---|---|
| SH-SELECT-TEXT | `QueryProductAdapterSelectTextSourceTrace-r003.md`、`QueryProductAdapterSelectTextSourceLegalCombinations-r001.md` 与对应 Cases | 记录当前 checkout 的局部创建/配置/校验分支及 41 条候选输入分类；区分 validator 接受、拒绝、来源观察与 NOT_READY | 每一行 `product_legality=NOT_READY`；不是产品合法 shape 分母；source trace r003 保留其 Review 标出的开放项；不证明完整消费者、持久化或运行合法性 |
| SH-SELECT-NUM | `QueryProductAdapterSelectNumSourceTrace-r003.md` 与 `QueryProductAdapterSelectNumConsumerPersistenceTrace-r002.md` | 对数值 select 局部配置/值写入路径、候选消费者与有限持久化证据建立引用 | type 2/5 × 单多选 × option source/default/field/value 的合法分母仍 UNKNOWN；端到端数值类型、完整保存重开、模板/历史/权限和查询契约未闭合 |
| 原 32 项全形态 Cases | `QueryProductAdapterFullShapeCases-r001.json` | 保持原候选身份与原义务关联，供后续逐项补 fixture/oracle | 32/32 仍 `fixture_payload=null`、`oracle_status=NOT_READY`、`execution_status=NOT_RUN`；没有可信全形态 RED/GREEN 或产品执行证据 |

以上局部材料均不能继承为全形态冻结证据。来源 trace 仅支持其各自声明的当前 checkout 静态分支；局部 harness/validator 观察不等于产品行为、产品 schema、保存回读或 Goal AC 验收。

### R4FS-001..005 当前 disposition

| Finding | r002 disposition | 依据及尚缺证据 |
|---|---|---|
| R4FS-001 合法 shape/axis 分母 | `PARTIALLY_ADDRESSED / OPEN` | Select-Text 有 41 项局部候选分类，但全行仍为 `product_legality=NOT_READY`，且其它 shape、跨轴交集、历史兼容与创建/消费共同支持的完整分母未定义。数值 trace 明确保留 type 2/5 组合 UNKNOWN。不得用轴的笛卡尔积推导支持范围。 |
| R4FS-002 完整 producer→config→consumer→save/load/history 链 | `PARTIALLY_ADDRESSED / OPEN` | 文本/数值局部阶段和有限消费者/持久化索引已补充；仍未证明每一 shape 的创建 owner、配置确认、实际查询消费、画布 durable save/load、历史/undo/redo 的完整匹配链。数值 trace 也明确指出部分保存/恢复 owner 未闭合。 |
| R4FS-003 可执行全形态 Cases 与精确 oracle | `OPEN` | 原 32 项仍全部未就绪/未运行。局部 Select-Text 候选与 harness 不能替代完整输入/输出、拒绝状态、零副作用、保存重开和 Goal 义务的同一身份 Cases。权限及 S01 相关用例保持 BLOCKED / NOT_RUN。 |
| R4FS-004 路径化身份字段与条件动作 | `OPEN` | 本版引用的局部来源没有建立覆盖所有 shape、对象容器、阶段、owner 和条件谓词的路径化合同。`id` 等通用名称、`defaultValue`、`defaultMapValue`、`optionFilter` 的混合规则仍不可按字段名全局归类；需逐路径和反例案例。 |
| R4FS-005 S01/真实权限与产品准入 | `BLOCKED / NOT_RUN` | S01 Entry Packet `CONDITIONAL`，未取得经授权权限实现及真实多用户隔离环境。不能执行或声称只读限制、撤权恢复、跨身份及目标授权验证；本设计不发准入。 |

### 对 AC 与实现准入的影响

- AC-S02-02 保持 pending：原 16 项义务仍在 denominator 中，但完整测试、合法 shape 分母和关键未决项未闭合。
- AC-S02-03 保持 pending：可继续不依赖 S01/权限环境的静态来源补充、纯设计和有独立准入的 detached building block；产品 UI/Store/source-read/target-commit 仍 `NOT_READY`。
- 本版不是完整 Design Freeze，也不是 Builder admission、Validation、产品验收或 Goal closeout。后续任何离线 Builder 仍必须有被冻结的子合同、同一身份可信 RED/GREEN、目标精确 admission，并排除其冻结输入写权限；本版未提供上述许可。

### 下一切片

按 dependency 继续逐 shape 来源链和精确 fixture/oracle；先复核 Select-Text 41 项候选中的来源阶段与真实创建/消费交叉，再补保存/重开 owner。每项必须能追至源码版本、对象路径、阶段和行为见证；找不到时保留 `NOT_READY`。此后继续数值、时间、树/级联/参数和历史 shape。每个独立交付物各自最多三轮评审；不因本设计或 Authority Materials 的轮次耗尽而限制整个 S02。产品切片仅在 S01、真实权限以及对应 Contract/Cases/RED/Design Review/精确 admission 都满足后进入 Builder。

### r002 修改范围

只创建本设计的 r002 版本化候选；未修改 r001、Goal、原 Cases、CoverageMatrix、产品源码、S01 材料或权限环境。本文将局部来源证据作为带边界的引用，不把它们复制为新的产品事实。


## r003 审查后更新：版本身份与来源摘要边界

本节响应 `QueryProductAdapterFullShapeDesignReview-r002.md` 的 R4R2-003 / R4R2-004。r003 是 r001 全部设计基线与 r002 证据增量之上的当前候选版本。此前 r002 节保留为历史快照；本节负责当前版本号、来源字节身份与摘要漂移处置。

### 版本身份

当前文件名及首行均为 `QueryProductAdapterFullShapeDesign-r003.md` / “全形态设计候选 r003”。r002 审查所报“首行仍写 r001”已修复。本文件仍是候选，不能由版本修正文案推导设计冻结或 Builder 准入。

### 历史 manifest 摘要漂移：明确隔离，不追认旧字节

原 `QueryProductAdapterFullShapeCases-r001.json` 保持不可变；其 `source_manifest` 有历史摘要漂移，本文不静默改写、不把旧摘要追认为当前摘要。当前值按此次独立审查 Context 直接绑定如下：

| 来源 | Cases-r001 manifest 中的历史摘要 | 当前摘要 | 当前处置 |
|---|---|---|---|
| `Sessions.md` | `a244e45d9a425ac4903c0b94ca4401fc13876452ef306801d56db80f850ddb1c` | `ffa662a1b204691dc3ffc2dcdff7bef79ec46e6744741b1d287f2f65f5a6f7d5` | 历史 manifest 项不绑定当前 Sessions 字节；r003 Context 直接绑定当前文件。 |
| `core/core-frontend/src/custom-component/v-query/Select.vue` | `eadbdba2b61aaeaf7abc58f83e75e82595c4a0812ceb1ac971f6739e4e4212a2` | `30efd4a571a8146a68c8a57e64dfee93208670db4155b8f9257a4553efcfcac8` | 历史 manifest 项不绑定当前源码字节；r003 Context 直接绑定当前文件。 |

`QueryProductAdapterFullShapeEvidenceReconciliation-r002.md` 中提到的 Sessions 摘要 `5dd977...` 是该对账当时使用的摘要，不是当前值；Review r002 所绑定的 `ffa662...` 才是本次复核看到的当前字节。后续若需要把 Cases JSON 用作字节级来源权威，应创建新的版本化 Cases/manifest，重新绑定完整读集并独立验证；本版不把这项未来工作伪装成已完成。

**处置：** R4R2-003 对“当前摘要不可由历史 manifest/旧对账直接证明”的问题记为 `CONTAINED_FOR_R003 / HISTORICAL_MANIFEST_STALE`；旧 Cases manifest 本身仍含陈旧值，不能将其描述为已修复或当前有效。后续 Context/Card 必须绑定当时读取到的最新 Sessions、源码和 Cases 摘要；任何摘要变化都需重算并刷新状态回执。

### R4FS finding 状态与分母复核

R4FS-001..005 沿用 r002 的 disposition：R4FS-001/002 `PARTIALLY_ADDRESSED / OPEN`，R4FS-003/004 `OPEN`，R4FS-005 `BLOCKED / NOT_RUN`。原始 10 项 Goal AC、26 项 must-have、16 项产品义务及 `Scope Delta: none` 不变。32 个 FullShape Cases 仍为候选、未冻结、未运行；16 项产品义务仍为 `NOT_RUN`。本版只修复设计文件版本标题并把旧摘要边界写明，不改变任何 case、产品契约、AC 状态或权限前置条件。

### Builder 与 Goal 边界

设计冻结仍为 `FULL_R4_FREEZE_NOT_READY`；产品 UI、Store、source-read、target-commit 仍 `NOT_READY`。S01 F01 Entry Packet `CONDITIONAL`，无独立终态证据；真实权限实现/隔离多用户环境 `BLOCKED / NOT_RUN`。即便 R4R2-003 的历史摘要使用边界得到隔离，也没有获得产品准入；可继续的仍是缺口内静态来源补充、纯设计或具备各自有效 Contract/Cases、可信 RED/GREEN 与 action-target admission 的非权限 detached block。
