# 手工文本单选来源与 oracle 候选 r001

**candidate / frozen_for_builder=false；Scope Delta none。** 原10 Goal AC /26 must-have /16产品义务不变，16项全部NOT_RUN；S01 F01 Packet NOT_AVAILABLE，真实权限BLOCKED / NOT_RUN。只补来源与候选，不发放Builder准入。

## 首要语义校正

当前源码 UI 明确 `optionValueSource=0` 为自动、`1` 为选择数据集、`2` 为手工输入（QueryConditionConfiguration.vue:3224–3233）。Select.vue:988–1039与之相符。本候选按父控制面确认将普通手工文本单选定义为displayType="0"、multiple=false、optionValueSource=2。旧Design r006 / Fixtures r007固定source0，即使标题写“手工”，18个旧用例也不能计入手工2覆盖。原件不改、旧纯helper结果不重判、无历史/跨版本枚举推论。

当前有界候选另要求字符串valueSource、firstItem=false、非参数/级联/树/日期、required=false、showEmpty=false。其他组合不自动判产品非法。身份/数据集/目标重绑不在纯值态子投影内；此边界不缩减完整10/26/16。

## 来源链与owner

|ID/阶段|路径与行|owner及已观察事实|证据上限|
|---|---|---|---|
|SRC-01/producer|core/core-frontend/src/custom-component/v-query/options.ts:6–77|infoFormat/addQueryCriteriaConfig：创建默认 displayType=0、multiple=false、optionValueSource=0、defaultValue/selectValue=undefined、defaultMapValue/mapValue=[]、valueSource=[]。|这是创建初态，不是手工2确认态；attributes补齐另经配置函数。|
|SRC-02/config-shape|core/core-frontend/src/custom-component/v-query/QueryConditionConfiguration.vue:3224–3233|optionValueSource radio：0=auto、1=select_dataset、2=manual_input。|当前源码结论，不推断历史版本枚举值。|
|SRC-03/config-manual-confirm|core/core-frontend/src/custom-component/v-query/QueryConditionConfiguration.vue:1725–1748|confirmValueSource：任意string.trim()为空则返回；否则深拷贝过滤后列表；trim只用作布尔条件，不修剪保存字符串；继而handleValueSourceChange。|函数后续重置行为需独立完整跟踪；本次不得声称所有确认副作用为0。|
|SRC-04/config-validation|core/core-frontend/src/custom-component/v-query/QueryConditionConfiguration.vue:1261–1283|validate：非auto须有checkedFields且每项有Map；文本默认开启且空/缺默认时，source2直接拒绝。|无本局部事实缺口；产品行为未运行|
|SRC-05/config-validation|core/core-frontend/src/custom-component/v-query/QueryConditionConfiguration.vue:1559–1566|validate：source2 valueSource过滤truthy后为空会拒绝。|这不是严格string[]验证，不把所有非string输入称为产品必拒。|
|SRC-06/config-confirm|core/core-frontend/src/custom-component/v-query/QueryConditionConfiguration.vue:1592–1705|confirmClick：managed时prepare/commit通过Store owner发布，失败不走legacy；legacy清propValue后nextTick重写并记snapshot/发query。|不能从局部代码证明shape2进入managed；上游生命周期实现不在本read-set。|
|SRC-07/config-default-write|core/core-frontend/src/custom-component/v-query/Select.vue:252–286|选择变更isConfig分支：isConfig=false写selectValue/mapValue并触发查询；true写defaultValue/defaultMapValue；source非1时setDefaultMapValue返回[]。|保持阶段隔离；不能把live对象的default前缀当来源认证。|
|SRC-08/map-value|core/core-frontend/src/custom-component/v-query/Select.vue:130–152|setDefaultMapValue/disabledFirstItem：defaultValueFirstItem只有source1才用于disabledFirstItem；非source1的setDefaultMapValue返回[]。|不能证明手工2所有历史非空defaultMapValue可安全删除；异常来源保留NOT_READY。|
|SRC-09/runtime-options|core/core-frontend/src/custom-component/v-query/Select.vue:976–1039|setOptions：0按绑定字段请求；1按dataset field请求；2由valueSource去null、按optionFilter筛选、stringify为label/value并调用requiredComp/setEmptyData。|本候选只冻结纯字符串、required=false/showEmpty=false的值态与列表投影；全组件副作用未测。|
|SRC-10/runtime-hydrate|core/core-frontend/src/custom-component/v-query/Select.vue:1047–1059|init：默认开启复制defaultValue到selectValue；关闭时单选undefined；随后nextTick/debounceOptions。|纯hydrate oracle不包括mount定时器、UI或网络；不得真实mount作零副作用证明。|
|SRC-11/query-consumer|core/core-frontend/src/hooks/web/useFilter.ts:116–155|getValueByDefaultValueCheckOrFirstLoad：source2使用普通分支：firstLoad取默认或空；非firstLoad取selectValue或空。defaultMapValue仅source1特例读取。|无本局部事实缺口；产品行为未运行|
|SRC-12/query-option-filter|core/core-frontend/src/hooks/web/useFilter.ts:316–395|searchQuery：目标关联匹配后 if(optionFilter) 追加in过滤；[]在JS为truthy，缺失与[]产生不同filter数组。|这里只证明请求投影；空in的后端结果语义未读取/运行。|
|SRC-13/query-result|core/core-frontend/src/hooks/web/useFilter.ts:467–604|searchQuery/forMatterValue/getOperator：非空字符串单选产生一个in条件、value=[字符串]；空值跳过；普通字段parameters=[]、isTree=false。|字段必须普通无|DE|且无range Map；此投影不证明SQL或命中记录ID。|
|SRC-14/save|core/core-frontend/src/utils/canvasUtils.ts:844–935|canvasSaveWithParams：managed分支读取设计overlay、深拷贝capture、校验目标并调用API，未知写入结果标unknown。|captureSave/lifecycle具体实现未纳入读集；shape2资格、持久schema、响应竞态尚NOT_READY。|
|SRC-15/load|core/core-frontend/src/utils/canvasUtils.ts:615–681|initCanvasDataPrepare/initCanvasData：从响应JSON.parse componentData，经historyAdaptor后setComponentData。|读取到的JSON不自动成为经过认证设计快照；未取得shape2 saved revision绑定与fixture。|
|SRC-16/history-migration|core/core-frontend/src/utils/canvasUtils.ts:455–489|historyAdaptor：按resourceTable和版本执行适配，当前版本且无reportFilter可早退。|未证明shape2旧载荷迁移；不可用早退推定所有旧值可信。|
|SRC-17/history-record|core/core-frontend/src/store/modules/data-visualization/snapshot.ts:213–239|recordSnapshot：快照deepCopy当前componentData，记录manifest；部分情况下写本地cache。|deepCopy运行树本身不证明默认来源，manifest内部shape2语义未验证。|
|SRC-18/undo-redo|core/core-frontend/src/store/modules/data-visualization/snapshot.ts:98–145|restoreHistorySnapshot/snapshotPublish：managed prepare/commit history；缺manifest允许fallback；legacy深拷贝后发布多Store。|不声明完整历史失败原子性；新carrier/旧历史与shape2精确oracle未取得。|
|SRC-19/owner-bridge|core/core-frontend/src/store/modules/data-visualization/dvMain.ts:530–582|querySingleSelectLifecycle bridge：确认/读取设计/保存/历史都委托生命周期owner。|桥接名称不是shape2受支持或认证完成证据；需要扩读具体owner实现。|
|SRC-20/saved-owner|core/core-frontend/src/custom-component/filter-copy/query-single-select-saved-canvas-owner.ts:118–210|createSavedCanvasOwnerLifecycle：有ready/edit/resource/route/dvInfo/画布root同一性与代际检查；返回WeakMap登记handle。|该owner不同于dvMain导入的生命周期owner；当前未证明已用于生产shape2来源认证，不混同二者。|
|SRC-21/save-api|core/core-frontend/src/api/visualization/dataVisualization.ts:66–96|saveCanvas/updateCanvas：POST保存与更新端点，更新先cloneDeep再转换图表字段。|前端请求不等于服务端写入/权限行为验收。|
|SRC-22/dashboard-create|core/core-frontend/src/views/dashboard/index.vue:299–315|dashboard createInit：新建dashboard启动querySingleSelect session；模板随后替换root。|不能把新建入口当已存资源恢复owner。|
|SRC-23/dataV-create|core/core-frontend/src/views/data-visualization/indexV3.vue:465–478|dataV createInit：本段创建/模板替换/快照，未出现dashboard同样session调用。|仅本段观察，不对全文件/全产品宣称缺实现。|
|SRC-24/toolbar-save|core/core-frontend/src/components/dashboard/DbToolbar.vue:227–245|saveCanvasWithCheck：保存前做组织一致性与prepare分支检查。|UI检查不是真实后端授权。|
|SRC-25/toolbar-save|core/core-frontend/src/components/data-visualization/DvToolbar.vue:149–170|saveCanvasWithCheck：保存前做组织一致性与prepare分支检查。|UI检查不是真实后端授权。|

来源链已定位至producer、config confirmation、runtime consumer、save/load、history/undo入口；这不等于每条链已闭合。dvMain桥接的lifecycle实现与独立saved-canvas-owner不是同一模块；未读到前者的完整资格规则，也没有真实保存revision绑定fixture，故shape2可信设计producer仍NOT_READY。不能重复旧文档的“当前仓库完全没有owner”，也不能反向凭owner文件存在宣布接入完成。

## 合法组合和拒绝组合

“源码支持”仅指列出的当前局部分支，非完整产品验收；局部拒绝不夸大为严格schema验证。

|ID|分类|精确条件|oracle|
|---|---|---|---|
|C01|源码支持的局部路径|`{"displayType": "0", "multiple": false, "optionValueSource": 2, "defaultValueCheck": false, "defaultValueFirstItem": false, "valueSource": ["A", "B"]}`|无默认，初始化undefined，first/subsequent均无主过滤项；需无optionFilter才完全空。 来源SRC-02,SRC-05,SRC-09,SRC-10,SRC-11|
|C02|源码支持的局部路径|`{"displayType": "0", "multiple": false, "optionValueSource": 2, "defaultValueCheck": true, "defaultValueFirstItem": false, "defaultValue": "A", "valueSource": ["A", "B"]}`|显式默认A；hydrate后first/subsequent均in[A]。 来源SRC-04,SRC-07,SRC-09,SRC-10,SRC-11|
|C03|产品配置局部拒绝|`{"optionValueSource": 2, "valueSource": []}`|validate返回true；不会进入confirmClick发布主体。 来源SRC-05|
|C04|产品手工编辑局部拒绝|`{"valueSource": ["A", "   "]}`|confirmValueSource提示并返回，不写新valueSource；不推断整个弹窗所有状态未变。 来源SRC-03|
|C05|产品配置局部拒绝|`{"displayType": "0", "optionValueSource": 2, "defaultValueCheck": true, "defaultValue": ""}`|validate返回true。 来源SRC-04|
|C06|本切片不承载而非产品非法|`{"optionValueSource": 0}`|既有r006/r007的shape；不算手工2覆盖。 来源SRC-02,SRC-09|
|C07|本切片不承载而非产品非法|`{"optionValueSource": 1}`|dataset enum，独立来源/映射语义。 来源SRC-02,SRC-08|
|C08|NOT_READY|`{"optionValueSource": 2, "defaultValueFirstItem": true}`|只看到首项机制主要受source1控制；不把2+true历史对象称为永久非法。 来源SRC-08|
|C09|NOT_READY|`{"optionValueSource": 2, "valueSource": [7, null, false]}`|UI validator不是严格string[]，runtime有stringify；数值/null历史数据不得套用字符串候选限制认定产品拒绝。 来源SRC-03,SRC-05,SRC-09|
|C10|运行consumer事实，来源NOT_READY|`{"optionFilter": []}`|选项展示不过滤但searchQuery生成value=[]的in项；不得归一化为缺失。 来源SRC-09,SRC-12|
|C11|运行consumer事实，来源NOT_READY|`{"optionFilter": ["A"]}`|手工列表可被筛选，另增加in[A]项；来源是设计还是运行结果未证据化。 来源SRC-09,SRC-12|
|C12|NOT_READY|`{"multiple": true}`|多选另切片，不能从当前单选推广。 来源SRC-10|

## 路径化字段责任

|完整路径|shape/阶段/owner|条件动作|规则|
|---|---|---|---|
|canvas.componentData[*].id|SH-SELECT-TEXT-MANUAL-2 / source/target binding / 上层画布目录|KEEP：本切片仅值态投影|组件身份必须由目录定位；不因条件复制改目标组件id。 来源SRC-19,SRC-20|
|VQuery.propValue[i].id|SH-SELECT-TEXT-MANUAL-2 / 配置确认/复制 / 完整adapter（本轮未实现）|REBIND：已认证完整配置复制且有全引用映射|此为条件身份，不等同component.id；值态oracle不重绑它。 来源SRC-01,SRC-13|
|VQuery.propValue[i].displayType|SH-SELECT-TEXT-MANUAL-2 / config-confirmed / 配置owner|KEEP：精确manual2候选且可信设计阶段|保持字段；valueSource逐元素保留字符串（含边缘空格），不去重不排序；false firstItem固定于此候选。 来源SRC-02,SRC-03,SRC-09|
|VQuery.propValue[i].multiple|SH-SELECT-TEXT-MANUAL-2 / config-confirmed / 配置owner|KEEP：精确manual2候选且可信设计阶段|保持字段；valueSource逐元素保留字符串（含边缘空格），不去重不排序；false firstItem固定于此候选。 来源SRC-02,SRC-03,SRC-09|
|VQuery.propValue[i].optionValueSource|SH-SELECT-TEXT-MANUAL-2 / config-confirmed / 配置owner|KEEP：精确manual2候选且可信设计阶段|保持字段；valueSource逐元素保留字符串（含边缘空格），不去重不排序；false firstItem固定于此候选。 来源SRC-02,SRC-03,SRC-09|
|VQuery.propValue[i].valueSource|SH-SELECT-TEXT-MANUAL-2 / config-confirmed / 配置owner|KEEP：精确manual2候选且可信设计阶段|保持字段；valueSource逐元素保留字符串（含边缘空格），不去重不排序；false firstItem固定于此候选。 来源SRC-02,SRC-03,SRC-09|
|VQuery.propValue[i].defaultValueCheck|SH-SELECT-TEXT-MANUAL-2 / config-confirmed / 配置owner|KEEP：精确manual2候选且可信设计阶段|保持字段；valueSource逐元素保留字符串（含边缘空格），不去重不排序；false firstItem固定于此候选。 来源SRC-02,SRC-03,SRC-09|
|VQuery.propValue[i].defaultValueFirstItem|SH-SELECT-TEXT-MANUAL-2 / config-confirmed / 配置owner|KEEP：精确manual2候选且可信设计阶段|保持字段；valueSource逐元素保留字符串（含边缘空格），不去重不排序；false firstItem固定于此候选。 来源SRC-02,SRC-03,SRC-09|
|VQuery.propValue[i].defaultValue|SH-SELECT-TEXT-MANUAL-2 / config-confirmed / isConfig选择提交|KEEP：defaultValueCheck=true且非空string且来源已认证|保持A；不回退运行B；列表是否包含A作为本候选前置，历史不在列表的值NOT_READY。 来源SRC-04,SRC-07|
|VQuery.propValue[i].defaultValue|SH-SELECT-TEXT-MANUAL-2 / 设计carrier投影 / 候选extractor|REMOVE：defaultValueCheck=false且值为string或缺失/undefined|仅从新carrier移除；原件保留。null/非string的生产意义未证明，不套用旧0合同为产品规则。 来源SRC-10,SRC-11|
|VQuery.propValue[i].defaultValue|SH-SELECT-TEXT-MANUAL-2 / live/runtime/unknown / 未认证owner|NOT_READY：仅有live JSON或阶段不明|default前缀不提供认证；禁止将B当设计默认。 来源SRC-07,SRC-15,SRC-17|
|VQuery.propValue[i].defaultMapValue|SH-SELECT-TEXT-MANUAL-2 / config-confirmed / Select.setDefaultMapValue|REMOVE：manual2、来源可信且值严格[]|当前配置writer与producer都产生[]，纯值态carrier不含该冗余映射；不改源[]。 来源SRC-01,SRC-07,SRC-08,SRC-11|
|VQuery.propValue[i].defaultMapValue|SH-SELECT-TEXT-MANUAL-2 / historical/unknown / 上层迁移|NOT_READY：缺失/null/非空数组/非数组|不能以query不读就断定完整历史配置可删除；需迁移与字段来源。 来源SRC-08,SRC-15,SRC-16|
|VQuery.propValue[i].optionFilter|SH-SELECT-TEXT-MANUAL-2 / source-query observation / searchQuery|KEEP：只做consumer事实测试（缺失/[]/非空分别保留）|消费投影必须按原存在性；[]有独立in条件。 来源SRC-09,SRC-12|
|VQuery.propValue[i].optionFilter|SH-SELECT-TEXT-MANUAL-2 / copy/extract / 未证据化producer|NOT_READY：字段存在（含[]）|当前复制候选仅接受缺失；不能REMOVE/清空；需证明生产者与阶段再决定KEEP规则或隔离runtime。 来源SRC-12|
|VQuery.propValue[i].selectValue|SH-SELECT-TEXT-MANUAL-2 / runtime-hydrate / detached runtime|RESET：可信设计且shape精确|selectValue默认开=A/关=undefined；mapValue=[]；不拷贝旧B。 来源SRC-07,SRC-08,SRC-10|
|VQuery.propValue[i].mapValue|SH-SELECT-TEXT-MANUAL-2 / runtime-hydrate / detached runtime|RESET：可信设计且shape精确|selectValue默认开=A/关=undefined；mapValue=[]；不拷贝旧B。 来源SRC-07,SRC-08,SRC-10|
|VQuery.propValue[i].checkedFields/checkedFieldsMap|SH-SELECT-TEXT-MANUAL-2 / 关联绑定 / 上层目录adapter|NOT_READY：完整产品复制|consumer fixture给固定chart1→field1普通字段；不代表已完成身份/数据集/权限重绑。 来源SRC-04,SRC-12|

defaultMapValue 在手工2的consumer分支不参与主过滤值，且当前配置writer产生[]；这只支持**可信配置阶段、严格空数组**时从值态carrier排除，不授权丢弃任意历史非空值。optionFilter则完全不同：缺失不生成额外条件，[]会生成空in，非空会生成独立in项；其来源producer未证据化，因此复制候选遇到任何存在的optionFilter（含[]）保持NOT_READY，consumer事实用例仍分别保留，不静默删除。

## 确定 fixtures、oracle 与可执行边界

配套JSON共27个case。M2-Q01..Q10给完整queryComponentList、curComponentId、firstLoad和完整filter数组，可由现有导出searchQuery直接消费。M2-Q02专门展示未经hydrate的旧运行B确实被非firstLoad消费；M2-Q03再显示新运行A的结果，防止用首次路径掩盖运行污染。Q06/Q09保留空optionFilter的额外in项，Q08仅证明该consumer忽略手工2的defaultMapValue，不把它视为安全extract授权。

M2-O01..O04是Select中已标行filter/map表达式的确定oracle，未调用整个组件/requiredComp/setEmptyData。M2-E01..E07是新的手工2 detached候选接口，输入输出完全给定，但接口尚不存在，需独立review后才能建runner；不调用或修改旧source0 helper。M2-C01/C02是局部配置拒绝分支oracle。M2-P01..P04的产品来源、保存重开、历史和真实命中ID缺口明确NOT_READY，expected=null。

纯detached成功/失败均要求source深相等、零网络/Store/snapshot/保存/预览意图/成功提示；失败carrier/runtime=null且无部分输出。searchQuery只允许传入的output数组追加，不允许更改source；不能把真实Select挂载、confirmClick、保存或undo称为零副作用操作。配置拒绝允许错误提示，禁止成功发布；完整UI观察器行为另验。

JSON里的bindingFixture/sourceStageFixture仅为测试前置，不是普通JSON来源认证；undefined用测试codec标记且运行JSON往返省略字段。所有case均NOT_RUN，执行证据为空。当前“确定”仅指输入/预期可比较，不代表runner已存在、RED/GREEN已跑或产品权限可信。

## 剩余缺口与最小下一步

- M2-G01：shape2可信来源工厂与实际lifecycle实现需要补读，绑定保存revision/resource/component/condition与generation；当前桥接和独立saved owner不能合成认证证明。
- M2-G02：optionFilter生产者与阶段未明确，禁止删除/等同缺失；defaultMapValue历史缺失/null/非空需单独迁移。
- M2-G03：真实capture payload、服务端保存恢复、历史manifest/缺manifest/fallback/undo与shape2资格未闭合。
- M2-G04：手工值非string、重复值、trim空白、默认不在选项内、firstItem=true的合法历史组合未全部取证，不永久禁止。
- M2-G05：新manual2值态候选的schema/守卫优先级/runner需独立审查；当前新增案例不是旧18case的同identity GREEN。
- M2-G06：真实权限、S01前置、实际数据集命中记录、产品发布原子性仍未验证；不得以静态投影/零副作用候选替代。

后续先独立review本候选与命名差异；需要扩大read-set时由控制面重基线。不得直接启动产品Builder或关闭AC-S02-02/03。
