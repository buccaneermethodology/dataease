# C2/C3/C4 具体组件 fixture 设计补齐 r001

本包补齐第2轮报告 UIR-008 保留的具体输入。**这是 fixture 设计作者的交付，不是新增独立评审轮，也不是可信 RED、实现完成或产品验收。** C1 继续并行，不等待本包。r001/r002 Design/Cases、既有报告、Goal、源码均未修改；原15主例、25子例及49内建type分母保持。

## 输入绑定与交付

- Card：`S02-MVP-C234-CONCRETE-FIXTURES-r001`，canonical SHA `6ed68ef03cf9dcae0fae9fca4032920a3042ebf5debf67e461e096576ae6f419`；实跑 validate 退出0、pass。
- Context 原字节 SHA：`f7127c142e09a3a7f3dfb00969523f4525a0da10ab99166b12de8d1602f7b9aa`；Topology r435；28项 required-read 入场摘要一致，交付时再复验。
- JSON：`UiC234ConcreteFixtures-r001.json`，SHA `cdec6ed17380d4cc62eba495c4edd785d12178fd4758a5cfb993dd530426f4d5`；其中 `required_read_manifest` 和 `expanded_read_manifest` 绑定具体来源。
- 写前两个交付文件都不存在。本 lane 只新增该 JSON 与本文，不新增图片文件、测试、状态记录或生产实现。
- `as_of`：2026-10-27T05:22:23.867658+00:00。所有fixture和6个子案绑定的执行状态为 `DESIGN_NOT_RUN`。

## 确定构造方式

JSON `construction.javascript` 是可直接搬入组件harness的纯输入构造器。Vue/i18n/Pinia先按产品入口初始化，然后导入绑定SHA的 `BASE_VIEW_CONFIG`；cloneDeep 后按 `view_assignments` 的完整path逐项赋值，数组整体替换，不使用数组索引merge。`element`、`response_data` 与 `response_assignments` 均给了实际值，无需runner选择轴/字段/经纬/正文/映射。

构造器返回 old target 的 `view/element`、应用原两条件的 `request`、B strict前的 `wireResponse`、严格prepared union和选定geo。axios transport需要 `{code:0,data:clone(wireResponse)}`，由真实B解码/包装；不能用 `{ok:true,value}` 替代B实现。图片组 wire 是 `table-info/antv`，prepared response恢复 `picture-group/custom`；OFF分支明确 `static-picture`，无getData和伪响应metadata。所有合成field的 `extField=0`，不会触发originName编码；字段type是数据库类型，groupType为d/q。

`source_tree_persisted.value` 原样保留绑定DB树，金额>200与六店enum。`source_runtime_shape` 另绑定实际RowAuth采样、ownKeys与两处own undefined `timeValue`，附恢复代码；不得把JSON省略值当作原始own-key。两种产品shape独立保留。合成9901开头地理字段和DTO仅用于组件harness，不向真实数据集发送；它们不是SQL14行/6761参考结果的替代。

## 11 个具体 fixture 与源码对应

| fixture ID | 实际输入与独立预期 |
|---|---|
| map-flow | xAxis f_lng/f_lat，xAxisExt f_end_lng/f_end_lat，起终点名称轴，yAxis f_amount；两条113,22↔114,23流线。真实class形成line、start-name、end-name、from-point、to-point共5layer，全部inited/回调完成才ready |
| map-heat | 双经纬轴与金额；tableRow明确，data.data另给 `{x:113,y:22,value:301}`、`{x:114,y:23,value:502}`，匹配HeatmapLayer真实parser x/y/value。不是把tableRow误当heat输入 |
| map-symbolic | 双经纬、门店颜色维度、金额extBubble；symbolic+label两layer；尺寸301/502，标签固定“门店：合成店A/B”，details为空数组避免mergeDetails缺形状 |
| map-polygon | 两个闭环Polygon、name/adcode/center/centroid；field/name对应“合成区A/B”，value301/502；真实Choropleth source join与loaded callback/首次label draw，不要求该分支不存在的dot |
| bubble-map-polygon | 同polygon与真实bubble source；两dot，dot add/loaded及配置完成不可只用plot loaded替代 |
| map-point | 两Point；走真实point-fallback，坐标113,22与114,23，hasData均true，size301/502，bbox ring明确闭环 |
| bubble-map-point | 同point-fallback，保bubble所需size配置；dot add/loaded必须先订阅，point branch不由polygon通过回填 |
| tiny-normal | 具体p/a正文含[金额]/[门店]，字段id/name/dataeaseName、tableRow/series都有值。formatter value/decimal0/no separator得到6761；移除data-mce-content/base-selected，链接#/fixture改/#/fixture。无compare强制request1/custom |
| tiny-compare | 同正文及独立字段值，金额compareCalc month_yoy/pre+确定日期字段；保request77/all。正文与DOM oracle不由被测assignment生成 |
| picture-off | threshold关闭，withInit选urlList[0]确定green data SVG；getData0，不伪造details/lastRequest。urlList空的静态empty另有确定输入 |
| picture-on | threshold开启，真实mappingColorCustom数值gt200→green、le200→red、default→gray；raw default放首位以检验conditionAdaptor移至末位。6761/200/0/null各自有expected；去default且null产生合法无匹配empty |

地图各GeoJSON直接内嵌，areaId固定156，getGeoJsonFile只返本包选定clone，不依赖网络/未知地理资产。data SVG直接内嵌base64，均64×32，green/red/gray/old_blue四种确定颜色；不经外部图片服务，真实imgUrlTrans对非static-resource data URL保持直通。实际解码仍未执行。

## 原稳定子案绑定与故障入口

只补原有以下6个subcase输入，variants仍归各原ID，不给新增主/子ID、不重置评审预算。

| 原子案 | 精确消费与事件/故障边界 |
|---|---|
| MVP-UI-10-L7 | map-flow/heat/symbolic；SCENE_READY与WAIT，query1、真实300ms/queue后逐layer inited；最后必要layer前pending；真实mapRendered/qqMapRendered回调throw、layer error或30s timeout独立；迟到事件不提升 |
| MVP-UI-10-L7PLOT | map/bubble polygon/point四输入；先真实drawChart构造，再plot.loaded、真实callback与标签同步draw；dot分支add/loaded独立defer；callback error/30s timeout/late各自断言 |
| MVP-UI-10-TINY | normal/compare两个正文输入；init未到nextTick仍pending，SetContent同步/异步明确事件；检查editor专属body内容、公开fieldSelect候选不接收、OldFont与无关p不变；init/content错误、10s timeout与discard late |
| MVP-UI-10-PICTURE | query/type恢复→真实字段映射命中green→先挂load/error再src；load到达decode未完成仍pending；resolve成功，reject/error/10s timeout失败；null无default走实际ChartEmptyInfo，非资产失败伪empty |
| MVP-UI-08-PICTURE | 真Attr入口与纯目录；目录transport/resolved API两层具体；OFF0query与ON1query分别检查，禁止onDatasetUpdate清轴/dirty；边界200、0、null有确定图片 |
| MVP-UI-08-ADAPTER | rich compare/no compare具体输入与请求expected；stock/S2继续原r002 component_C1，不由本补包重定义 |

B API只在axios边界供应code0/envelope，真实SFC prepared消费链、wrapper publish、真实map class drawChart、富文本assignment/字段映射、图片conditionAdaptor/mappingColorCustom均不得整体替身化。故障在声明的库/初始化事件处触发，不用缺新方法、模块或编译错误充作RED。

本包使用SDK/TinyMCE协议double使故障顺序可控：FakeScene/layer/plot方法与事件账本、TinyMCE get/setContent/body/channel等均有明确协议；构造器不自动发ready。真实label-layout继续执行，优先真实浏览器SVG getBBox；Node harness若用明确getBBox测量seam，记录层级，不冒充字体渲染。任何缺方法或DOM能力导致的TypeError均是execution_error，不能修expected来凑RED。此层只验证组件完成桥与副作用边界，**不证明真实SDK/WebGL/供应商地图或真实TinyMCE加载成功**。

## 独立旧态与失败 oracle

JSON `old_state` 给出旧树amount>100、旧行amount7/OLD_ACTIVE_SHOP、四类Store marker、lastRequest marker、旧page、wrapper drill/context、FixtureOldFont、old与无关p的完整onclick/outerHTML、old_blue图片。每variant独立初始化、渲染old至完成后设置必要sentinel并直接从真实Store/DOM/实例capture；old与candidate身份不同。不能调用被测投影helper算expected。

失败时完整canonical view/element/filter own-key、metadata、snapshot/dirty、可见DOM/实例身份、old destroy/remove/repaint、paragraph与appearance均与capture一致，成功event0；query分支只允许dispatch log1，静态分支0。候选本地timer/listener/已知实例被清理，late init/SetContent/inited/loaded/load/decode不提升。合法外部用户改动与candidate增量分开比较。本包不声称任意Store异常的全局事务或所有SDK内部资源泄漏均已解决。

## 已做静态检查与仍需验证

已检查JSON可解析、11fixture所有view/element/response id一致，字段dataeaseName/axis/tableRow关联、15主/25子身份唯一、6绑定均来自原25、polygon闭环与point坐标、data SVG base64/UTF-8 hash/64×32声明、具体值映射与HTML替换预期，并在交付时复验28项required输入和扩读SHA。没有执行SFC挂载、unit测试、RED/GREEN、SDK init、图片decode、真实后端或保存。

后续root按本包/r002/消歧与当时源码摘要签发对应切片精确admission，Builder只读fixture。真实SFC先成功加载再用相同case identity产生可信语义RED；GREEN再独立验证。真实业务依然须真实fields/DTO/SDK/图片、独立业务oracle、49逐type source与target/query/可见画面/正常toolbar保存/离开/重开。合成protocol通过不回填这些产品状态，真实资产不足只保留对应type BLOCKED，C1和其它独立工作继续。

已知路径勘误：第2轮报告第7项把composable目录误列在custom-component/filter-copy；真实路径为 `views/chart/components/editor/filter/useChartFilterCopyMvp.ts`，已即时报root，root已用真实路径准入，没有误建文件。本lane保留旧报告原字节。
