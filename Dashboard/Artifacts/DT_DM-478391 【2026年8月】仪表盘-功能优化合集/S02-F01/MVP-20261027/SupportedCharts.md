# MVP 受支持图表源码清单 r001

本清单按已验证的新范围授权整理：开发环境、同页同编辑会话、内存复制、明确权限测试桩、真实 query/save/reopen。通用迟到响应和渲染资源清理已按人类授权迁后续，不在这里启动框架改造。这里只写源码清单与验证计划；全部运行/E2E状态均为 **NOT_RUN**。

从 ChartViewManager 的实际 glob、导出子类、无参 constructor 及 render/name 注册路径，找到 **49 个内建类型**：G2 38、S2 3、L7 3、L7Plot 2、custom 3。与 palette 的49项逐项对应，47项可见；rich-text/picture-group所在other类display=hidden但已注册。49项均在自身或继承axis显式含filter，未发现可按无过滤能力排除的内建类型。历史g2plot目录未被当前glob纳入；helper导出不算图表。详见JSON逐文件scan、逐type SHA/行锚和继承链。

## 全量类型与分层验证

| 稳定 type | render / library | class | 面板 | filter静态能力 | 验证分层 |
|---|---|---|---|---|---|
| `area` | antv / g2 | Area | 可见 | 声明支持 | g2-cartesian；组件/运行 NOT_RUN |
| `area-stack` | antv / g2 | StackArea | 可见 | 声明支持 | g2-cartesian；组件/运行 NOT_RUN |
| `bar` | antv / g2 | Bar | 可见 | 声明支持 | g2-cartesian；组件/运行 NOT_RUN |
| `bar-group` | antv / g2 | GroupBar | 可见 | 声明支持 | g2-cartesian；组件/运行 NOT_RUN |
| `bar-group-stack` | antv / g2 | GroupStackBar | 可见 | 声明支持 | g2-cartesian；组件/运行 NOT_RUN |
| `bar-horizontal` | antv / g2 | HorizontalBar | 可见 | 声明支持 | g2-cartesian；组件/运行 NOT_RUN |
| `bar-range` | antv / g2 | RangeBar | 可见 | 声明支持 | g2-cartesian；组件/运行 NOT_RUN |
| `bar-stack` | antv / g2 | StackBar | 可见 | 声明支持 | g2-cartesian；组件/运行 NOT_RUN |
| `bar-stack-horizontal` | antv / g2 | HorizontalStackBar | 可见 | 声明支持 | g2-cartesian；组件/运行 NOT_RUN |
| `bidirectional-bar` | antv / g2 | BidirectionalHorizontalBar | 可见 | 声明支持 | g2-cartesian；组件/运行 NOT_RUN |
| `box-plot` | antv / g2 | BoxPlot | 可见 | 声明支持 | g2-relation-distribution；组件/运行 NOT_RUN |
| `bubble-map` | antv / l7plot | BubbleMap | 可见 | 声明支持 | l7plot-map；组件/运行 NOT_RUN |
| `bullet-graph` | antv / g2 | BulletGraph | 可见 | 声明支持 | g2-cartesian；组件/运行 NOT_RUN |
| `chart-mix` | antv / g2 | ColumnLineMix | 可见 | 声明支持 | g2-mix；组件/运行 NOT_RUN |
| `chart-mix-dual-line` | antv / g2 | GroupLineMix | 可见 | 声明支持 | g2-mix；组件/运行 NOT_RUN |
| `chart-mix-group` | antv / g2 | GroupLineMix | 可见 | 声明支持 | g2-mix；组件/运行 NOT_RUN |
| `chart-mix-stack` | antv / g2 | StackLineMix | 可见 | 声明支持 | g2-mix；组件/运行 NOT_RUN |
| `circle-packing` | antv / g2 | CirclePacking | 可见 | 声明支持 | g2-relation-distribution；组件/运行 NOT_RUN |
| `flow-map` | antv / l7 | FlowMap | 可见 | 声明支持 | l7-map；组件/运行 NOT_RUN |
| `funnel` | antv / g2 | Funnel | 可见 | 声明支持 | g2-relation-distribution；组件/运行 NOT_RUN |
| `gauge` | antv / g2 | Gauge | 可见 | 声明支持 | g2-numeric；组件/运行 NOT_RUN |
| `heat-map` | antv / l7 | HeatMap | 可见 | 声明支持 | l7-map；组件/运行 NOT_RUN |
| `indicator` | custom / indicator | IndicatorChartView | 可见 | 声明支持 | custom-indicator；组件/运行 NOT_RUN |
| `line` | antv / g2 | Line | 可见 | 声明支持 | g2-cartesian；组件/运行 NOT_RUN |
| `liquid` | antv / g2 | Liquid | 可见 | 声明支持 | g2-numeric；组件/运行 NOT_RUN |
| `map` | antv / l7plot | Map | 可见 | 声明支持 | l7plot-map；组件/运行 NOT_RUN |
| `multi-scatter` | antv / g2 | MultiScatter | 可见 | 声明支持 | g2-relation-distribution；组件/运行 NOT_RUN |
| `percentage-bar-stack` | antv / g2 | PercentageStackBar | 可见 | 声明支持 | g2-cartesian；组件/运行 NOT_RUN |
| `percentage-bar-stack-horizontal` | antv / g2 | PercentageStackBar | 可见 | 声明支持 | g2-cartesian；组件/运行 NOT_RUN |
| `picture-group` | custom / picture-group | PictureGroupView | 隐藏但注册 | 声明支持 | custom-picture-group；组件/运行 NOT_RUN |
| `pie` | antv / g2 | Pie | 可见 | 声明支持 | g2-relation-distribution；组件/运行 NOT_RUN |
| `pie-donut` | antv / g2 | PieDonut | 可见 | 声明支持 | g2-relation-distribution；组件/运行 NOT_RUN |
| `pie-donut-rose` | antv / g2 | RoseDonut | 可见 | 声明支持 | g2-relation-distribution；组件/运行 NOT_RUN |
| `pie-rose` | antv / g2 | Rose | 可见 | 声明支持 | g2-relation-distribution；组件/运行 NOT_RUN |
| `progress-bar` | antv / g2 | ProgressBar | 可见 | 声明支持 | g2-cartesian；组件/运行 NOT_RUN |
| `quadrant` | antv / g2 | Quadrant | 可见 | 声明支持 | g2-relation-distribution；组件/运行 NOT_RUN |
| `radar` | antv / g2 | Radar | 可见 | 声明支持 | g2-relation-distribution；组件/运行 NOT_RUN |
| `rich-text` | custom / rich-text | RichTextChartView | 隐藏但注册 | 声明支持 | custom-rich-text；组件/运行 NOT_RUN |
| `sankey` | antv / g2 | G2ChartBar | 可见 | 声明支持 | g2-relation-distribution；组件/运行 NOT_RUN |
| `scatter` | antv / g2 | Scatter | 可见 | 声明支持 | g2-relation-distribution；组件/运行 NOT_RUN |
| `stock-line` | antv / g2 | StockLine | 可见 | 声明支持 | g2-stock；组件/运行 NOT_RUN |
| `symbolic-map` | antv / l7 | SymbolicMap | 可见 | 声明支持 | l7-map；组件/运行 NOT_RUN |
| `t-heatmap` | antv / g2 | TableG2Chart | 可见 | 声明支持 | g2-heatmap；组件/运行 NOT_RUN |
| `table-info` | antv / s2 | TableInfo | 可见 | 声明支持 | s2-table；组件/运行 NOT_RUN |
| `table-normal` | antv / s2 | TableNormal | 可见 | 声明支持 | s2-table；组件/运行 NOT_RUN |
| `table-pivot` | antv / s2 | TablePivot | 可见 | 声明支持 | s2-table；组件/运行 NOT_RUN |
| `treemap` | antv / g2 | Treemap | 可见 | 声明支持 | g2-relation-distribution；组件/运行 NOT_RUN |
| `waterfall` | antv / g2 | Waterfall | 可见 | 声明支持 | g2-cartesian；组件/运行 NOT_RUN |
| `word-cloud` | antv / g2 | WordCloud | 可见 | 声明支持 | g2-relation-distribution；组件/运行 NOT_RUN |

## 全 source × target 的兼容规则

同一规则覆盖49×49=2401个静态组合；这是规则分母，不是2401次运行通过。不按bar→line或G2类型白名单缩小范围。所有类型共用view.customFilter、Editor FilterTree和后端CustomWhere2Str链；渲染库差别留给真实family验证。

- **MVP-COMPAT-01**：source/target is VQuery or ordinary non-chart Picture/decoration → `REJECT_OUT_OF_CURRENT_CHART_SCOPE`。反馈：当前仅支持图表过滤条件，查询组件复制粘贴在后续任务处理。
- **MVP-COMPAT-02**：plugin flag true, missing registered render/type, or filter capability unknown/absent → `REJECT_UNKNOWN_OR_NO_FILTER`。反馈：该图表尚未确认支持过滤条件复制粘贴，请使用已支持图表。
- **MVP-COMPAT-03**：source.tableId or target.tableId missing, or not exactly equal by existing ID representation → `REJECT_DATASET_MISMATCH`。反馈：仅支持同一数据集的图表；请切换为相同数据集。
- **MVP-COMPAT-04**：leaf fieldId not in target resolved dataset/chart field catalog, sentinel count/-1, deleted field, deType changed, source chart-only calculated field unavailable → `REJECT_FIELD_INCOMPATIBLE`。反馈：目标图表缺少过滤字段或字段类型不兼容；未粘贴任何条件。
- **MVP-COMPAT-05**：unsupported dynamicDate/sysParams/calendar/empty group/unknown key or unvalidated complex structure → `REJECT_UNSUPPORTED_SHAPE`。反馈：包含当前版本暂不支持的过滤条件结构；请使用基本固定条件。
- **MVP-COMPAT-06**：development same-page same-editor session, known built-ins, sameDataset, all fields compatible, actual serializer basic shape accepted, permission stub allow → `ELIGIBLE_CANDIDATE`。反馈：完整复制/替换全部过滤条件，包括现有两个条件与root logic；不对图表type pair设置bar-line白名单。
- **MVP-COMPAT-07**：permission stub deny/unknown, clipboard empty/expired, editor session changed or target paste busy/changed → `REJECT_WITH_EXPLICIT_FEEDBACK`。反馈：说明无可用条件、会话失效、无权限或目标正在处理；保持原条件与原数据。

同数据集还不够：逐leaf检查目标真实可选字段目录、fieldId及deType，不能仅检查目标已选axis，也不能按字段显示名匹配。chart专属计算字段、已删字段、count/-1等不兼容时整包拒绝；不得静默丢掉一个条件。插件installed清单Unknown，未确认的能力明确拒绝并留运行补查。VQuery单列后续，不属于这49个普通图表。

## 真实两个条件与序列化入口

`RowAuth.submit → dfsSubmit → save → FilterTree.changeFilter → filter-data → Editor.changeFilterData` 直接复用现有输出。root是`{logic,items}`；叶子的全部输出键为`enumValue,fieldId,timeValue,filterType,filterTypeTime,dynamicTimeSetting,term,timeType,value,type,subTree`，其中type=item、subTree=null。group保留RowAuth实际输出的空字段、`type=tree`与`subTree:{logic,items}`；不能另造精简树。`field/name/deType`不是落地leaf字段；init会按fieldId补field，再取name/deType，兼容元数据应与canonical树分开。

缺键、own-key值undefined、null、空串、[]和{}不同。dfsInit/dfsSubmit可能保留undefined键；cloneDeep保留它们，真实JSON请求/保存会省略undefined对象键。动态timeValue可能undefined，不能都改成空字符串或空对象。前传输对象与真实请求/保存JSON边界分别断言；动态日期/系统参数/未覆盖复杂形态明确拒绝并交后续。

**已有两个条件的实际字段/值本lane未捕获**，不能把手写样本称golden。UI任务先打开现有源FilterTree，捕获真实save/filter-data/view.customFilter（含own-key与undefined清单），绑定完整两个leaf和分组/logic，再捕获真实query payload与保存的canvasViewInfo。保存→离开→findById重开后完整树、两个条件、值/运算符及结果画面一起核对；不能只比较首leaf或靠截图推断树。

## Editor 专用交互与真实链路

复制/粘贴候选入口放在Editor非插件数据面板“结果过滤”块（index.vue:3366），复用当前view和现有openTreeFilter/changeFilterData；所有49type走同一路径。复制完整customFilter，仅内存保存；目标字段/权限stub/结构先整包校验。粘贴候选查询成功再采用，单目标只允许一操作；失败/未知/失效反馈明确，原条件与数据保留。`changeFilterData`自身只clone赋值，FilterTree随后recordSnapshotCache(changeFilter)，UI任务必须接现有刷新信号并核对真实query次数，不能把局部赋值当刷新完成。

真实取数：API chart.ts:getData → /chartData/getData → ChartDataServer → ChartDataManage.calcData → handler + dataset/READ/字段目录 → view.customFilter → ChartFilterTreeService → CustomWhere2Str。S2/G2/L7/custom组件均有getData调用，views/index按library分发renderer。真实仪表板保存走DbToolbar → canvasSaveWithParams → saveCanvas/updateCanvas；重开为findById。`/chart/save`在源码标为单图保存测试，不能替代仪表板保存重开。后端真实权限仍存在，dev stub结果不算真实权限验收。

**图片组特例**：Editor tableId watcher显式跳过picture-group的getFields；虽然axis含filter、DePictureGroup确有真实getData，实际可用字段目录及Editor入口仍待运行确认。不能静态排除，也不能静态声称已可粘贴。rich-text/picture-group在切换palette隐藏，不等于不注册或无过滤。

## 验证任务可直接复用

- **g2-cartesian**（全部NOT_RUN）：bar, line, area, bar-stack, bar-range, bidirectional-bar, bullet-graph, progress-bar, waterfall。同数据集两个真实条件源/目标双向；空目标与已有目标过滤树替换；查询结果/图面对应；保存重开完整树。
- **g2-stock**（全部NOT_RUN）：stock-line。共用过滤树保真；getData对xAxis sort=desc不改过滤树；重开排序/两个条件仍在。
- **g2-relation-distribution**（全部NOT_RUN）：pie, scatter, multi-scatter, quadrant, sankey, funnel, box-plot, radar, treemap, word-cloud, circle-packing。不同axis布局仍走共用customFilter；值/运算符/分组不变；空数据/查询失败明确反馈。
- **g2-heatmap**（全部NOT_RUN）：t-heatmap。x/xExt/extColor配置不替代过滤字段目录；热力图两个条件查询结果；保存重开。
- **g2-mix**（全部NOT_RUN）：chart-mix, chart-mix-group, chart-mix-stack, chart-mix-dual-line。左右数据结果均受过滤树约束；不得只验证left返回；Editor公共入口与保存重开。
- **g2-numeric**（全部NOT_RUN）：gauge, liquid。无xAxis仍可接受数据集过滤字段；数值随两个条件真实变化；保存重开。
- **s2-table**（全部NOT_RUN）：table-info, table-normal, table-pivot。三种S2类各跑真实查询/表格/保存重开；分页/聚合/透视字段不被复制改变；完整两个条件树与query payload核对。
- **l7plot-map**（全部NOT_RUN）：map, bubble-map。共用customFilter；有效区域数据条件后地图数据与视觉；地图资产/网络不可用记BLOCKED不记PASS；保存重开。
- **l7-map**（全部NOT_RUN）：flow-map, heat-map, symbolic-map。地图专属起终点/经纬字段不受过滤复制修改；真实数据与L7图层代表E2E；无地理测试资产明确BLOCKED。
- **custom-indicator**（全部NOT_RUN）：indicator。DeIndicator真实getData结果；无xAxis仍能设置过滤；两个条件及保存重开。
- **custom-rich-text**（全部NOT_RUN）：rich-text。使用已有/新建合法富文本组件而非隐藏切换菜单；DeRichTextView真实getData；两个条件与动态内容/保存重开。
- **custom-picture-group**（全部NOT_RUN）：picture-group。字段加载watch主动跳过该type，先核验实际field目录取得途径；DePictureGroup真实getData；两个条件与图片组数据/保存重开，若目录不可得明确拒绝并记录缺口。

每个type仍需单独的Editor/字段目录/payload组件检查；family代表通过不会把其余类型自动改为PASS。地图缺地理资产或网络、插件未加载、实际双条件未捕获均保留NOT_RUN/Unknown/Blocked。没有运行服务、DB、构建或生产写入。

本清单只新增SupportedCharts.json/md；Goal/TSP由父控制面另行按新人类授权更新。旧10/26/16材料及通用资源工程历史不被本清单改写或追认。完整Source SHA、行锚、全文件扫描、限制和验证计划以同目录JSON为准。
