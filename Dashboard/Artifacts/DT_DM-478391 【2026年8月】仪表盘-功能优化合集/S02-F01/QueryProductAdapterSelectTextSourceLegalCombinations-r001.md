# SH-SELECT-TEXT 来源与组合候选 r001

candidate / frozen_for_builder=false。Scope Delta none；10 Goal AC /26 must-have /16产品义务不变。S01 CONDITIONAL；真实权限BLOCKED / NOT_RUN。本标题中的“组合”是当前源码可证明的局部分支清单，不是完整产品合法组合全集。

## 合法性层级

逐行使用LOCAL_VALIDATOR_ACCEPTS、LOCAL_VALIDATOR_REJECTS、SOURCE_STAGE_OBSERVATION或NOT_READY。所有行的product_legality仍NOT_READY：validate不拒绝不等于配置可被真实字段、权限、异步枚举、查询与持久化完整承载。当前不能定义一个权威的产品合法schema，也不能把不在清单中的组合永久禁止。

## 输入与状态域

新增validator行以r003 ST-SRC-005/VALID完整输入为基础，在JSON内展开每行独立input/expected_after；每行condition与conditions[0]恢复同一对象身份，fields=[]明示只是局部fixture而非真实字段证明。validate返回值、消息key、default/select变化与完整目标域必须精确比较，不只比较boolean。全部保持NOT_RUN。

复用来源阶段行逐对象复制r003的before/expected_after/steps/assertions并绑定原SHA。ST-SRC-001 Date只统计AST提取infoFormat单次同步调用，不求值模块；ST-SRC-004取消只记录取消信号、不调用onFulfilled，不reject原生Promise。已有局部harness验证仅为历史有界证据，不作为本候选的执行结果。

## 逐行组合目录

|ID|阶段/分类|精确轴或来源|局部oracle|产品边界|
|---|---|---|---|---|
|LC-0-0-0|LOCAL_VALIDATOR_ACCEPTS|{"displayType": "0", "optionValueSource": 0, "multiple": false, "defaultValueCheck": false, "defaultValueFirstItem": false, "required": false, "auto": false}|return=False；完整状态见JSON|validate返回false仅表示该局部前置下未拒绝；没有证明实际选项、字段、身份、查询或保存可用。|
|LC-0-0-1|LOCAL_VALIDATOR_ACCEPTS|{"displayType": "0", "optionValueSource": 0, "multiple": false, "defaultValueCheck": true, "defaultValueFirstItem": false, "required": false, "auto": false}|return=False；完整状态见JSON|validate返回false仅表示该局部前置下未拒绝；没有证明实际选项、字段、身份、查询或保存可用。|
|LC-0-1-0|LOCAL_VALIDATOR_ACCEPTS|{"displayType": "0", "optionValueSource": 0, "multiple": true, "defaultValueCheck": false, "defaultValueFirstItem": false, "required": false, "auto": false}|return=False；完整状态见JSON|validate返回false仅表示该局部前置下未拒绝；没有证明实际选项、字段、身份、查询或保存可用。|
|LC-0-1-1|LOCAL_VALIDATOR_ACCEPTS|{"displayType": "0", "optionValueSource": 0, "multiple": true, "defaultValueCheck": true, "defaultValueFirstItem": false, "required": false, "auto": false}|return=False；完整状态见JSON|validate返回false仅表示该局部前置下未拒绝；没有证明实际选项、字段、身份、查询或保存可用。|
|LC-1-0-0|LOCAL_VALIDATOR_ACCEPTS|{"displayType": "0", "optionValueSource": 1, "multiple": false, "defaultValueCheck": false, "defaultValueFirstItem": false, "required": false, "auto": false}|return=False；完整状态见JSON|validate返回false仅表示该局部前置下未拒绝；没有证明实际选项、字段、身份、查询或保存可用。|
|LC-1-0-1|LOCAL_VALIDATOR_ACCEPTS|{"displayType": "0", "optionValueSource": 1, "multiple": false, "defaultValueCheck": true, "defaultValueFirstItem": false, "required": false, "auto": false}|return=False；完整状态见JSON|validate返回false仅表示该局部前置下未拒绝；没有证明实际选项、字段、身份、查询或保存可用。|
|LC-1-1-0|LOCAL_VALIDATOR_ACCEPTS|{"displayType": "0", "optionValueSource": 1, "multiple": true, "defaultValueCheck": false, "defaultValueFirstItem": false, "required": false, "auto": false}|return=False；完整状态见JSON|validate返回false仅表示该局部前置下未拒绝；没有证明实际选项、字段、身份、查询或保存可用。|
|LC-1-1-1|LOCAL_VALIDATOR_ACCEPTS|{"displayType": "0", "optionValueSource": 1, "multiple": true, "defaultValueCheck": true, "defaultValueFirstItem": false, "required": false, "auto": false}|return=False；完整状态见JSON|validate返回false仅表示该局部前置下未拒绝；没有证明实际选项、字段、身份、查询或保存可用。|
|LC-2-0-0|LOCAL_VALIDATOR_ACCEPTS|{"displayType": "0", "optionValueSource": 2, "multiple": false, "defaultValueCheck": false, "defaultValueFirstItem": false, "required": false, "auto": false}|return=False；完整状态见JSON|validate返回false仅表示该局部前置下未拒绝；没有证明实际选项、字段、身份、查询或保存可用。|
|LC-2-0-1|LOCAL_VALIDATOR_ACCEPTS|{"displayType": "0", "optionValueSource": 2, "multiple": false, "defaultValueCheck": true, "defaultValueFirstItem": false, "required": false, "auto": false}|return=False；完整状态见JSON|validate返回false仅表示该局部前置下未拒绝；没有证明实际选项、字段、身份、查询或保存可用。|
|LC-2-1-0|LOCAL_VALIDATOR_ACCEPTS|{"displayType": "0", "optionValueSource": 2, "multiple": true, "defaultValueCheck": false, "defaultValueFirstItem": false, "required": false, "auto": false}|return=False；完整状态见JSON|validate返回false仅表示该局部前置下未拒绝；没有证明实际选项、字段、身份、查询或保存可用。|
|LC-2-1-1|LOCAL_VALIDATOR_ACCEPTS|{"displayType": "0", "optionValueSource": 2, "multiple": true, "defaultValueCheck": true, "defaultValueFirstItem": false, "required": false, "auto": false}|return=False；完整状态见JSON|validate返回false仅表示该局部前置下未拒绝；没有证明实际选项、字段、身份、查询或保存可用。|
|LC-REJECT-EMPTY-DEFAULT-0|LOCAL_VALIDATOR_REJECTS|{"displayType": "0", "optionValueSource": 0, "multiple": false, "defaultValueCheck": true, "defaultValueFirstItem": true, "required": false, "auto": false}|return=True；完整状态见JSON|validate返回false仅表示该局部前置下未拒绝；没有证明实际选项、字段、身份、查询或保存可用。|
|LC-REJECT-EMPTY-DEFAULT-2|LOCAL_VALIDATOR_REJECTS|{"displayType": "0", "optionValueSource": 2, "multiple": false, "defaultValueCheck": true, "defaultValueFirstItem": true, "required": false, "auto": false}|return=True；完整状态见JSON|validate返回false仅表示该局部前置下未拒绝；没有证明实际选项、字段、身份、查询或保存可用。|
|LC-FIRST-ITEM-1|LOCAL_VALIDATOR_ACCEPTS|{"displayType": "0", "optionValueSource": 1, "multiple": false, "defaultValueCheck": true, "defaultValueFirstItem": true, "required": false, "auto": false}|return=False；完整状态见JSON|仅配置validate放过；首项实际值、异步运行写回仍ST-SRC-006 NOT_READY。|
|LC-REJECT-EMPTY-DEFAULT-1|LOCAL_VALIDATOR_REJECTS|{"displayType": "0", "optionValueSource": 1, "multiple": false, "defaultValueCheck": true, "defaultValueFirstItem": false, "required": false, "auto": false}|return=True；完整状态见JSON|validate返回false仅表示该局部前置下未拒绝；没有证明实际选项、字段、身份、查询或保存可用。|
|LC-REJECT-MANUAL-EMPTY|LOCAL_VALIDATOR_REJECTS|{"displayType": "0", "optionValueSource": 2, "multiple": false, "defaultValueCheck": false, "defaultValueFirstItem": false, "required": false, "auto": false}|return=True；完整状态见JSON|拒绝发生前default/select已经清空，局部失败不是输入不变。|
|LC-MANUAL-WHITESPACE|LOCAL_VALIDATOR_ACCEPTS|{"displayType": "0", "optionValueSource": 2, "multiple": false, "defaultValueCheck": false, "defaultValueFirstItem": false, "required": false, "auto": false}|return=False；完整状态见JSON|validate用truthy故未拒；confirmValueSource用trim会拒。两个入口不能合并为合法手工输入结论。|
|LC-REJECT-REQUIRED-OFF|LOCAL_VALIDATOR_REJECTS|{"displayType": "0", "optionValueSource": 2, "multiple": false, "defaultValueCheck": false, "defaultValueFirstItem": false, "required": true, "auto": false}|return=True；完整状态见JSON|validate返回false仅表示该局部前置下未拒绝；没有证明实际选项、字段、身份、查询或保存可用。|
|LC-REQUIRED-ON|LOCAL_VALIDATOR_ACCEPTS|{"displayType": "0", "optionValueSource": 2, "multiple": false, "defaultValueCheck": true, "defaultValueFirstItem": false, "required": true, "auto": false}|return=False；完整状态见JSON|validate返回false仅表示该局部前置下未拒绝；没有证明实际选项、字段、身份、查询或保存可用。|
|LC-REJECT-NO-FIELD|LOCAL_VALIDATOR_REJECTS|{"displayType": "0", "optionValueSource": 1, "multiple": false, "defaultValueCheck": false, "defaultValueFirstItem": false, "required": false, "auto": false}|return=True；完整状态见JSON|validate返回false仅表示该局部前置下未拒绝；没有证明实际选项、字段、身份、查询或保存可用。|
|LC-AUTO-SKIPS|LOCAL_VALIDATOR_ACCEPTS|{"displayType": "0", "optionValueSource": 2, "multiple": false, "defaultValueCheck": true, "defaultValueFirstItem": false, "required": false, "auto": true}|return=False；完整状态见JSON|auto=true在第一条直接skip；不是配置合法证明。Component.drop当前生成auto/source1，任意auto/source2输入的实际生产来源未证。|
|LC-ST-001-CREATE|SOURCE_STAGE_OBSERVATION|infoFormat，仅创建返回；不隐式调用parameterCompletion|return={'id': 'guid-fixed-1', 'name': '字段一', 'showError': True, 'timeGranularity': 'date', 'timeGranularityMultiple': 'datetimerange', 'field': {'id': 'f1', 'type': 'VARCHAR', 'name': '字段一', 'deType': 0}, 'displayId': 'f1', 'sortId': '', 'sort': 'asc', 'defaultMapValue': [], 'mapValue': [], 'conditionType': 0, 'conditionValueOperatorF': 'eq', 'conditionValueF': '', 'conditionValueOperatorS': 'like', 'conditionValueS': '', 'defaultConditionValueOperatorF': 'eq', 'defaultConditionValueF': '', 'defaultConditionValueOperatorS': 'like', 'defaultConditionValueS': '', 'timeType': 'fixed', 'relativeToCurrent': 'custom', 'required': False, 'timeNum': 0, 'relativeToCurrentType': 'date', 'around': 'f', 'parametersStart': None, 'parametersEnd': None, 'arbitraryTime': {'$date': '2026-10-20T00:00:00.000Z'}, 'timeNumRange': 0, 'relativeToCurrentTypeRange': 'date', 'aroundRange': 'f', 'arbitraryTimeRange': {'$date': '2026-10-20T00:00:00.000Z'}, 'auto': False, 'defaultValue': {'$js': 'undefined'}, 'selectValue': {'$js': 'undefined'}, 'optionValueSource': 0, 'valueSource': [], 'dataset': {'id': 'D1', 'name': '', 'fields': []}, 'visible': True, 'defaultValueCheck': False, 'multiple': False, 'displayType': '0', 'checkedFields': [], 'parameters': [], 'parametersCheck': False, 'parametersList': [], 'checkedFieldsMap': {}}；完整状态见JSON|attributes补全与setToDefault是不同阶段；本case不据此推断所有创建者/历史对象。|
|LC-ST-002-DATASET-CHANGE|SOURCE_STAGE_OBSERVATION|必须区分handleDatasetChange与handleValueSourceChange|return=None；完整状态见JSON|“source切换且dataset已选会清field并getOptions”并非1024分支行为；清字段来自987入口。本候选保留这个来源表述差异，不修改r002原件。|
|LC-ST-002-SOURCE-SWITCH-DATASET-ALREADY-SET|SOURCE_STAGE_OBSERVATION|必须区分handleDatasetChange与handleValueSourceChange|return=None；完整状态见JSON|“source切换且dataset已选会清field并getOptions”并非1024分支行为；清字段来自987入口。本候选保留这个来源表述差异，不修改r002原件。|
|LC-ST-003-ONE|SOURCE_STAGE_OBSERVATION|handleValueSourceChange缺dataset自动回填|return=None；完整状态见JSON|MULTI-LAST只是当前forEach最后非空映射及最后匹配fields项胜出的源码事实，不是业务合法映射规则；空id仍调用依赖，真实API是否接受未知。|
|LC-ST-003-MULTI-LAST|SOURCE_STAGE_OBSERVATION|handleValueSourceChange缺dataset自动回填|return=None；完整状态见JSON|MULTI-LAST只是当前forEach最后非空映射及最后匹配fields项胜出的源码事实，不是业务合法映射规则；空id仍调用依赖，真实API是否接受未知。|
|LC-ST-003-EMPTY|SOURCE_STAGE_OBSERVATION|handleValueSourceChange缺dataset自动回填|return=None；完整状态见JSON|MULTI-LAST只是当前forEach最后非空映射及最后匹配fields项胜出的源码事实，不是业务合法映射规则；空id仍调用依赖，真实API是否接受未知。|
|LC-ST-004-CONFIRM|SOURCE_STAGE_OBSERVATION|handleDatasetChange确认框回调；输入已完成handleCurrentChange记录|return=None；完整状态见JSON|取消局部语句没有重置newDatasetId/oldDatasetId；后续事件如何处理仍未知。Element全局拒绝处理不在读集，不能声称UI取消无未处理拒绝；测试依赖只隔离Promise，不模拟权限。|
|LC-ST-004-CANCEL|SOURCE_STAGE_OBSERVATION|handleDatasetChange确认框回调；输入已完成handleCurrentChange记录|return=None；完整状态见JSON|取消局部语句没有重置newDatasetId/oldDatasetId；后续事件如何处理仍未知。Element全局拒绝处理不在读集，不能声称UI取消无未处理拒绝；测试依赖只隔离Promise，不模拟权限。|
|LC-ST-005-MISSING|SOURCE_STAGE_OBSERVATION|validate vs confirmValueSource不同入口|return=True；完整状态见JSON|validate使用truthy而非trim：全空白数组在这些前置下返回false；弹窗confirmValueSource会拒绝空白。拒绝前validate已清default/select；不能统一断言目标不变。未覆盖任意多条件或其他参数/required形态。|
|LC-ST-005-EMPTY|SOURCE_STAGE_OBSERVATION|validate vs confirmValueSource不同入口|return=True；完整状态见JSON|validate使用truthy而非trim：全空白数组在这些前置下返回false；弹窗confirmValueSource会拒绝空白。拒绝前validate已清default/select；不能统一断言目标不变。未覆盖任意多条件或其他参数/required形态。|
|LC-ST-005-WHITESPACE|SOURCE_STAGE_OBSERVATION|validate vs confirmValueSource不同入口|return=False；完整状态见JSON|validate使用truthy而非trim：全空白数组在这些前置下返回false；弹窗confirmValueSource会拒绝空白。拒绝前validate已清default/select；不能统一断言目标不变。未覆盖任意多条件或其他参数/required形态。|
|LC-ST-005-VALID|SOURCE_STAGE_OBSERVATION|validate vs confirmValueSource不同入口|return=False；完整状态见JSON|validate使用truthy而非trim：全空白数组在这些前置下返回false；弹窗confirmValueSource会拒绝空白。拒绝前validate已清default/select；不能统一断言目标不变。未覆盖任意多条件或其他参数/required形态。|
|LC-ST-005-MANUAL-BUFFER-WHITESPACE|SOURCE_STAGE_OBSERVATION|validate vs confirmValueSource不同入口|return=None；完整状态见JSON|validate使用truthy而非trim：全空白数组在这些前置下返回false；弹窗confirmValueSource会拒绝空白。拒绝前validate已清default/select；不能统一断言目标不变。未覆盖任意多条件或其他参数/required形态。|
|LC-NR-ASYNC-FIRST|NOT_READY|source1 firstItem true/false × isConfig true/false|NOT_READY；expected_after=null|Select.vue已有分支；Component.vue已定位isConfirmSearch/queryDataForId注入，但事件接收者/Store及watch代际仍未闭合|
|LC-NR-REQUIRED-MAP|NOT_READY|required + source1 + defaultMapValue/displayId|NOT_READY；expected_after=null|Component.fillRequireVal可能将mapValue别名绑定defaultMapValue；完整触发链未证|
|LC-NR-DROP-URL|NOT_READY|拖入URL deType7生成displayType数值0|NOT_READY；expected_after=null|Component.drop使用deType===7 ? 0 : 字符串，和部分严格字符串比较存在入口差异|
|LC-NR-HISTORY|NOT_READY|保存恢复/undo/旧缺省|NOT_READY；expected_after=null|本read-set无完整持久化与历史owner|
|LC-NR-ENUM-TYPES|NOT_READY|重复值/空值/非string/optionFilter三态/远程|NOT_READY；expected_after=null|Select的选项表达式或validate放过不能定义合法schema|
|LC-NR-BINDINGS|NOT_READY|跨目标字段/多dataset/cascade/parameter|NOT_READY；expected_after=null|局部fields=[]未证明类型和权限；自动取最后映射不是兼容政策|

## 源码支持的结论与不能合并的入口

- options.infoFormat创建source0，但Component.drop会覆盖为auto=true/source1；QueryConditionConfiguration UI source0/1/2分别为auto/dataset/manual。创建入口不唯一，不能以infoFormat快照定义所有新对象。
- validator有auto早退，因此auto对象未拒绝不能证明其shape合法；显式auto=false的关联绑定检查与required/default/source检查必须分开。
- source0/2默认开启但空值会被局部拒；source1首项开启可越过空默认检查，仍不证明异步首项结果或完整配置合法。
- source1缺field时，在默认关闭路径已先清default/select，再返回错误；source2空valueSource同样可能先发生清值。不要套用复制失败零变更到现有配置validate函数。
- 手工空白在validate的truthy检查和confirmValueSource的trim检查结果不同；原入口及阶段必须保留。
- 单/多选默认关闭分别清undefined/[]；默认开启保持给定输入。12行基础组合只是指定局部例子，不宣称所有值类型或default组合合法。

## 新定位的consumer边界

Component.vue:345–386的fillRequireVal读取defaultMapValue/defaultValue并可能复用数组引用；:484–487的isConfirmSearch受componentWithSure门控；:534–540提供注入回调。它们补充owner定位，但真实事件接收者、Store生命周期和完整查询仍在读集外，因此ST-SRC-006保持NOT_READY。Component.vue:608–634的drop还对URL类型写数值0，与字符串0需单独追踪，不臆断为bug或自动规范化。

## 最小补证清单

- LC-NR-ASYNC-FIRST：Select.vue已有分支；Component.vue已定位isConfirmSearch/queryDataForId注入，但事件接收者/Store及watch代际仍未闭合；最小补证：补齐事件接收者、生命周期owner与完整受控Promise/300ms/nextTick快照；不以空stub替代。
- LC-NR-REQUIRED-MAP：Component.fillRequireVal可能将mapValue别名绑定defaultMapValue；完整触发链未证；最小补证：固定完整element、emitterList、map数组身份及触发时序。
- LC-NR-DROP-URL：Component.drop使用deType===7 ? 0 : 字符串，和部分严格字符串比较存在入口差异；最小补证：独立证明drop到配置补全是否规范化，提供数值0与字符串0双fixture；不能自行改代码或推定bug。
- LC-NR-HISTORY：本read-set无完整持久化与历史owner；最小补证：保存revision、序列化/恢复与旧配置fixture；保留ST-SRC-007。
- LC-NR-ENUM-TYPES：Select的选项表达式或validate放过不能定义合法schema；最小补证：逐来源producer与consumer、历史持久化证据，不从字段并集推schema。
- LC-NR-BINDINGS：局部fields=[]未证明类型和权限；自动取最后映射不是兼容政策；最小补证：精确数据集/字段/参数目录、闭包和实际授权；不按名称补映射。

## 静态核对与主张上限

写前复验Card expected digest与全部Context required-read摘要。JSON解析、唯一ID、每行确定input/expected_after、NOT_READY空oracle、原10/26/16与未运行状态已静态检查；未运行产品或新case，未改源码/Goal/CoverageMatrix/原Cases/合同/Session/Stop Gate。没有Builder准入或独立审查结论。
