# 查询适配器字段、引用与提交设计 r003

状态：候选补证，未解除DG-03；不授权Builder。仅创建本文件及QueryAdapterFixtures-r003.json，写前不存在。新card摘要复验通过。原审查、冻结合同、Goal和产品代码均不改。

## 来源证据

- E01：`core/core-frontend/src/custom-component/v-query/options.ts:6-65`。
- E02：`core/core-frontend/src/custom-component/v-query/options.ts:80-136`。
- E03：`core/core-frontend/src/custom-component/v-query/Select.vue:132-150`。
- E04：`core/core-frontend/src/custom-component/v-query/Select.vue:158-166,248-273`。
- E05：`core/core-frontend/src/custom-component/v-query/QueryConditionConfiguration.vue:1591-1629`。
- E06：`core/core-frontend/src/custom-component/v-query/QueryConditionConfiguration.vue:1676-1684,1769-1783,1836-1908`。
- E07：`core/core-frontend/src/store/modules/data-visualization/dvMain.ts:1437-1501`。
- E08：`core/core-frontend/src/utils/canvasUtils.ts:843-864,887-904,643-667`。
- E09：`core/core-frontend/src/custom-component/v-query/Component.vue:330-338,660-747`。
- E10：`core/core-frontend/src/custom-component/v-query/QueryConditionConfiguration.vue:362-420,534-550,1730-1755`。
- E11：`core/core-frontend/src/hooks/web/useFilter.ts:515-586`。
- E12：`core/core-frontend/src/custom-component/v-query/QueryCascade.vue:74-78,142-165`。
- E13：`core/core-frontend/src/custom-component/v-query/Tree.vue:280-285,363-364`。
- E14：`core/core-frontend/src/custom-component/v-query/Select.vue:294-298,405-443`。

## 生成、保存、恢复、消费链

E01/E02构造查询条件；E10动态生成字段/参数映射；E05确认将conditions/cascade写回queryElement。E08保存cloneDeep(componentData)并JSON序列化，选择updateCanvas/saveCanvas；恢复JSON.parse后historyAdaptor再setComponentData。E06进入配置面板在副本上补全缺省；E09挂载从cascade.selectValue恢复current，重置默认并重算动态时间；E03/E04/E11/E13消费映射、参数及树。此链证明字段可随组件JSON保存，**不能证明每个保存对象均为纯设计态**。

特别是E07外部参数filter模式写optionFilter并可能改defaultValue，其他模式改defaultValueCheck/timeType/defaultMapValue。E08未见VQuery专项清洗，因而“optionFilter不在初始属性中”不能推出不会保存，也不能把它升格为用户持久自过滤规则。

## QAR-01：复制入口与默认值来源

工程提案：复制入口必须读取未受运行注入污染的编辑配置快照；未保存编辑可用配置面板自己的候选副本，但必须确认它的初始化来源未污染。查看态运行config、外部参数注入后的Store对象不能直接当来源；不能靠删除optionFilter修复已被改写的defaultValue。权威设计副本的确切获得路径仍需补证，不虚构现有API。

E04非isConfig只改selectValue/mapValue；isConfig同时改defaultValue/defaultMapValue。故mapValue一律不作为持久默认权威，来源为可信default规则和目标枚举映射。E03映射按displayId显示值查field.id实际值；FirstItem须按目标可用集合求值。defaultValueCheck=false不传播当前选中。级联select/current须分别由默认派生，不能统一清空。JSON F01–F03给精确输入输出片段；运行选择华南而设计默认华东，目标默认及级联必须为华东/E。

## QAR-02：按形态处理表

| 形态 | 字段 | 处理及证据 |
|---|---|---|
| 普通/枚举 | `defaultValueCheck/defaultValueFirstItem/defaultValue/defaultMapValue` | 复制未污染设计态默认规则；FirstItem为规则，不能冻结源当时第一项；目标合法候选确定后按E03重算映射（E01,E03,E04,E14） |
| 全部 | `mapValue/selectValue` | 剥离源运行值；在候选中依据默认规则重建。defaultValueCheck=false时不得保留源运行选择；具体空值形态保留控件既有约定（E04,E09） |
| 级联 | `selectValue/currentSelectValue` | 不直接复制；候选默认派生完成后两者各自深拷贝默认映射值。配置态改select且current，运行态仅current；不能统一清空丢失默认（E04,E05,E09） |
| 外部注入 | `optionFilter` | 不是已证持久自过滤规则：E07运行时注入，E08序列化没有VQuery专门清洗。只从注入前设计快照提取；目标运行上下文重新应用自己的限制，禁止传播源注入值。无法确认快照来源时停止复制并报告来源不明（E07,E08,E13,E14） |
| 数据集枚举 | `optionValueSource/field.id/dataset.id/displayId/sortId/sort` | 保留条件语义与ID；名称/type/deType/dataset.fields按目标当前授权元数据校验重建，不用名称映射；排序影响FirstItem，不能误作无关图表样式删除（E01,E03,E14） |
| 手工枚举 | `valueSource/multiple/displayType/required` | 保留合法配置；optionValueSource!=1时E03映射为空，不从源mapValue恢复（E01,E03） |
| 参数/范围 | `checkedFields/checkedFieldsMap/checkedFieldsMapArr/Start/End及Num系列` | typed重绑定组件键，数组/值仍是精确参数或字段ID；不能删除Arr只留主字段。缺端点或端点不在数组中拒绝（E10,E11） |
| 参数 | `parameters/parametersArr/parametersStart/End/parametersCheck/parametersList` | parametersArr按组件键重绑定；参数定义从目标当前getSqlParams结果精确核对，不能仅凭参数同名替换。内部参数完整schema尚未证实，未知结构保留待核实，不将任意对象透传认作完成（E01,E10,E11） |
| 文本/数值范围 | `defaultConditionValueF/S及OperatorF/S、conditionType、defaultNumValueStart/End` | 复制默认；conditionValue及numValue运行值由默认重派生；0不得当空。范围上下端及类型需校验（E01,E02,E09） |
| 日期1/日期范围7 | `timeType/timeGranularity/timeGranularityMultiple/relativeToCurrent及Range/timeNum及Range/relativeToCurrentType及Range/around及Range/arbitraryTime及Range` | 复制规则；dynamic时不用源defaultValue/selectValue计算日期结果，按目标固定时钟/时区调用既有求值。fixed日期编码转换和时区完整oracle待核实（E01,E02,E09） |
| 日期窗口 | `timeRange/setTimeRange` | 保留规则对象深拷贝；不能以当前new Date补历史缺值而宣称保持旧语义，部分历史缺省仍待核实（E02,E06） |
| 树9 | `treeDatasetId/treeFieldList/treeCheckedList/oldTreeLoad` | 保持dataset/field ID与层级顺序，元数据重建；treeCheckedList具体默认/运行分类尚未完整追清，完整树适配器仍待核实。optionFilter按外部注入规则处理（E02,E06,E13） |
| 展示/实例 | `id/name/showError/visible/hideConditionSwitching/displayFormat/resultMode` | id重生；目标样式布局不覆盖。name及其余混合字段尚需逐消费点区分配置UI与查询语义，不能按名字直接剥离或透传（E01,E02） |
| 历史缺省 | `attributes新增键、treeDatasetId、timeRange.relativeToCurrentRange、映射字典` | 仅按当前实际parameterCompletion/handleCondition在独立副本恢复；已有值不覆盖；时间对象深拷贝。缺dataset/timeRange等会触发当前代码前提，未证可恢复不能臆造（E06） |

完整初始字段并集不等于全量白名单。本表明确没有证明的参数内部字段、treeCheckedList、混合展示字段及日期编码，继续作为补证项，不授权Builder透传、删除或长期拒绝已要求支持的形态。当前JSON使用真实源码键和构造形态的合成片段，**不是实际运行实例导出，不声称完整可挂载**。F04/F05正例只冻结身份投影，不能当完整树/参数验收；F06日期只冻结规则保留，不伪造日期结果。F07覆盖当前可见历史恢复分支，不泛化所有历史版本。首次补全new Date或对象引用须在独立候选副本中深拷贝；不能改变历史语义后称兼容。

## QAR-03：typed引用和闭包

引用分四类：条件id、级联节点id均预分配新ID；dataset/field ID保持；checkedFields及各Map/parametersArr的键为目标图表组件ID，必须由明确的目标绑定唯一解析。复合datasetId只拆为三段typed元组再重组，不能全JSON字符串替换。E12证明queryId与node id不同，node.fieldId还是独立字段，不可盲目与复合末段互换；跨数据集级联边fieldId的完整语义仍待核实，本次同D1例保留空值。

闭包算法提案：先收集全部条件ID及typed引用，拒绝重复ID；解析每个数据集、字段和组件绑定，要求恰一匹配；所有级联条件必须存在于候选闭包，禁止静默删边；按相邻节点构有向边检查自环/直接及间接环；生成全部新ID后一次重写typed路径。图表外部绑定无显式对应关系时报告缺口，不能凭名称或“第一个相同数据集”自动绑定。此映射是候选技术机制，尚未证明跨仪表盘UI如何提供绑定，不将拒绝替代最终Q066完整交付。

JSON C1含实际复合键输入输出，C2缺引用、C3多义、C4/C5环和C6双向独立性。C1只表示图闭包例，不是带真实权限的完整配置运行成功。

## prepare/commit状态契约

Prepare只接收不可变源配置、目标配置快照及已取得元数据，纯构造候选和诊断；网络取权限/元数据属于prepare前的read阶段，不得在prepare调用现有会改curComponent/conditions的处理函数。取消、解析/映射/验证失败时目标、预览、P0、快照和过滤请求计数保持。确认弹窗期间变化则候选作废重做。

Commit前异步重验身份代际/权限后，再同步比较目标版本及候选摘要；之后同步区段不得await。提案先完整构造新目标组件（保留目标布局/样式），一次替换组件Store引用，而非E05先清propValue再nextTick。发布成功后只发一次快照/逻辑刷新通知，沿既有正常保存。不调用确认函数冒充原子提交。

**尚未证明的事务接缝**：实际Store引用替换与同步watch是否触发中间观察、快照异常能否恢复、通知重复与组件重挂载副作用，仍需独立设计补证/后续有界测试。不能宣称一次赋值天然保证全部副作用原子性。提交前异常必须零变更；提交后的网络预览失败属于已提交配置的预览错误，不伪装为粘贴拒绝并自动回滚持久配置。此错误分类需预审，与Q014取消/校验失败零刷新分别记录。

## 验证与剩余结论

仅完成card摘要校验、源码定向读取、JSON解析与引用ID/fixture标识自检；所有产品执行为NOT_RUN。QAR-01已明确污染与默认规则分离，但纯设计副本来源仍待确认；QAR-02追到optionFilter注入和保存链，完整树/参数/日期及部分混合字段仍unknown；QAR-03提供typed转换和具体反例，但完整事务接缝与跨仪表盘外部绑定尚未证明。三项不能由本lane自行标关闭，交独立审查决定可接收部分与最小后续补证。真实权限阻塞不被standalone替代；16项产品义务保持。
