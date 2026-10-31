# 普通折线图双 sibling host 渲染工程设计 r001

## 本轮性质、授权与证据上限

本件是 `LINE-SIBLING-HOST-RENDER-DESIGN-r001` 首轮设计候选（本独立交付物第1/3轮），不发放 Builder 准入，不修改生产代码。对应 Goal 的10项AC、26项must-have、16项产品义务全部保留；Scope Delta 对原Goal为 none。用户授权“先完成界面 MVP，再补齐复杂场景”只调整实施顺序。普通line双host是界面MVP的渲染前置工程，缺少专用复制/粘贴入口、staged query、业务树/Store提交、正常保存重开和真实权限证据，不能声明界面MVP完成。

旧 `ChartFilterCopyProductIntegrationDesignReview-r003.md` 与 `ChartPasteTransactionalPreviewDesignReview-r003.md` 各3/3、NEEDS_REVISION及所有未决项继续有效；本件不重开其预算、不修订旧合同，也不将其结论翻转。本件承接其中明确有界的host/renderer依赖。AM-09 NEEDS_REVISION、S01 F01 CONDITIONAL、真实权限 BLOCKED/NOT_RUN 均保留；不以standalone/admin/mock替代，不因缺权限停止无权限工程。

Card canonical SHA-256为 `c52ecf11b37281765cefe8b689e720da4d04894b730397727d305dd9e805b21f`，复验pass；Context字节SHA-256为 `6e27123626ff8f1c39c0ddde80175307eb6922919b1c1df41f652e87bda7681a`，17项required输入逐字节摘要匹配，context validator成功。Goal字节摘要 `28c94d3c35d4ce0a891ce77ecc915932d67f88ef813f3d2815dc0dce11f91b64`。写前HEAD为 `1e84e7438462e5d6fc371358da3bdad7d24a5c1a`，工作树存在大量其他任务修改；本件两个输出写前均不存在，未触及其他文件。

父Orchestrator在本lane中追加的工程决策：carousel开启输入本工程先明确unsupported；不能接受已知全局tooltip污染，允许设计必要的可选前端gate契约增量，默认入口行为保持。该决定只扩展本设计的未来源码候选清单；本lane实际写范围仍只有本Design/Cases。Card原“新helper+SFC、不动Line”的候选限制与该追加决定存在增量，未来Review/Builder必须绑定新Context/Card，不能沿用本Card直接写这些源码。

## 源码事实与必须解决的问题

| 已读入口 | 当前事实 | 本件处理 |
|---|---|---|
| ChartComponentG2Plot.vue:548-610 | calcData回包在render前写chartData、drill、details/origin和emitter；请求链不是可等待的隔离事务 | stage禁止调用calcData/getData和这些副作用；后续单独合同 |
| 同文件:616-654、742-995 | renderChart先写curView/defaultsDeep输入；renderG2 owned line在新draw/render前dispose旧实例、清活动空态；catch后resolve | stage不复用此破坏性入口；有界普通line完整重绘改接新controller，返回明确失败，不吞为ready |
| 同文件:160、773-795、845-895、1451-1534 | 一个固定containerId贯穿draw/tooltip/legend/resize；scope/version与全局myChart绑定 | 两真实sibling host；每个owner自带固定hostId/element，采用后所有owned-line路径取activeRecord.hostId |
| 同文件:1438-1443 | defineExpose已有calcData/renderChart/trackMenu/clearLinkage | 保留四项，增加prepareLineStage/adoptLineStage/abortLineStage |
| Line.drawChart:107-151 | 在返回前创建G2、legend/refresh、point action、Carousel、extremum；stage没有交互开关 | 新可选guard，stage不构造Carousel，直接注册同一guard的tooltip listener；前置构造清理另单元交付 |
| G2TooltipCarousel.ts:91-137、339-353 | 即使carousel false也先listenerTooltipShow；enabled时初始化可stop其它图表 | stage不进入该构造；enabled输入在任何分配前拒绝，不能调用paused/destroy全局清理 |
| barUtil.ts:394-513、981-1071 | tooltip wrapper按container分键但放body；show会activateHoverTooltip并隐藏其它活动hover | 唯一wrapper+stage隐藏+首次注册guard；隐藏DOM或未start均不能替代guard |
| common_antv.ts:1133-1226、3310-3355 | slider捕获pointerdown后可装document监听；轴标题事件可创建body tooltip | callback入口检查interactive；已登记disposer处理本owner；不得在stage开启document拖动 |
| assist/tiled/pagination三个installer | instance listener、ResizeObserver、navigation patch及清理句柄；安装返回前失败仍可能只有部分资源 | alive gate与登记后的逆序cleanup；返回前异常保留Unknown边界，不伪造完整清理 |

补充源码索引为 `ChartPreviewStateIsolationTrace-r001.json`（SHA `d3f434a4f6155a86899b577cb402b1235161a746ed91596abf0223a5189d4524`）及同名md（SHA `fa52cad08832ede25d3e4b58ce52ed47d772511767c2b56a297d42aecab0d528`）。它是静态索引，不是产品合同或运行证明。本文不靠新开完整ChartComponent挂载作为stage，避免mount query和同viewId事件重复注册。

## 有界输入与精确源码候选

显式stage只接受已取得的普通G2 `line` response chart，`data.data`必须为数组；空数组为empty。输入必须与当前target的id/tableId/render/type匹配，carousel.enable不是true，活动记录也必须是carousel禁用的ordinary line且当前无error。未初始化、legacy/L7、其它图表、开启carousel、缺失/非法rows、无可用非零尺寸均结构化拒绝，活动记录和query/组件状态不变。carousel缺省等价禁用；非法配置不能通过真值强转获得允许。拒绝的是本工程API能力，不删除原Goal相应义务。

生产候选按依赖顺序为：

1. `src/views/chart/components/views/components/line-sibling-host-render.ts`（新增）：两slot的owner/controller、阶段调度、token/guard、prepare/adopt/abort/dispose；可直接导入完整模块测试，不创建平行业务状态模型。
2. `src/views/chart/components/views/components/ChartComponentG2Plot.vue`：真实双host template/CSS；上述API与defineExpose；owned-line普通完整重绘接controller；activeHostId/activeRecord接入draw/resize/tooltip/action/cleanup；保留G2其它类型、L7和autoRefresh语义。
3. `src/views/chart/components/js/panel/types/impl/g2.ts`：只在G2DrawOptions增加可选 `interactionGuard?: G2InteractionGuard`；type含 `isAlive(): boolean`、`isInteractive(): boolean`。不改SDK/API/Store。
4. `src/views/chart/components/js/panel/charts/g2/line/line.ts`：仅ordinary line新可选guard分支；带guard时先拒绝carousel true、point callback门控，绕过Carousel构造并首次调用带guard的listenerTooltipShow；无guard仍原生产入口。沿用已修复的构造try/finally资源安全，不覆盖该并行单元成果。
5. `src/views/chart/components/js/panel/charts/g2/bar/barUtil.ts`：listenerTooltipShow可选guard，默认always true；show/hide/afterdestroy分开处理，详情见hook表。不能猴补Chart.emit/on或改全局原型。
6. `src/views/chart/components/js/panel/common/common_antv.ts`：configAxisTitleOverflowTooltip、installG2SliderAdapter增加可选guard；不改旧调用缺省语义。
7. `src/views/chart/components/js/panel/types/impl/g2-assist-line.ts`、`g2-legend-tile.ts`、`g2-legend-pagination.ts`：installer的可选isAlive回调用于已经捕获的listener/observer回调，默认always true；自身dispose始终执行。tiled legend向instance emit的交互回调由新helper包guard，布局回调只需alive。

候选测试目录 `tests/line-sibling-host-render/` 新增完整模块runner、actual-SFC runner、真实G2静态夹具（复用已安装依赖）；不覆盖旧23例/6例合同和runner，不新增依赖。既有G2 ownership suites作为回归。新Cases是候选，须独立Review冻结后生成RED/harness admission，再生成Builder admission。生产write候选扩展必须在Line/Carousel前置工程build/review落盘后串行重新绑定其SHA、完整diff及Context/Topology；不在两个lane并行修改Line。

## 两个真实host与不变身份

保留逻辑 `containerId` 供既有legacy/L7访问及兼容；新增固定尺寸shell。legacy host与lineHostPair在shell内分层；lineHostPair内A/B是同一父节点下两个真实div sibling。A/B均在组件挂载时存在；通过组件uid加逻辑containerId产生唯一string id（同viewId两个组件也不碰撞）。host id一经创建在该组件生命期内不变，采用B后不把B重命名成A，不把canvas移到旧host，也不销毁旧图后重画N。

A/B样式均为absolute、inset:0、width/height:100%、box-sizing相同；pair占shell实际内容区，和legacy层边界一致。隐藏slot使用visibility:hidden/opacity:0/pointer-events:none/inert/aria-hidden，禁止display:none、detach或零尺寸占位；其getBoundingClientRect/clientWidth/clientHeight必须与active等价。无active初始line创建在A；之后只在空闲另一slot准备。常驻DOM host数为2，活跃owner最多1、pending/ready stage最多1。

每次分配用document.getElementById(hostId)解析并严格等于SFC ref、属于当前pair、连接到document、ID唯一；要求宽高>1且两slot逻辑尺寸相等。异常返回HOST_IDENTITY_INVALID/HOST_SIZE_UNAVAILABLE，不触碰活动图。记录layoutEpoch与width/height；resize导致epoch变化即使尺寸后来回到原值也使旧stage失效。preSize仍属shell而不是临时B。

tooltip wrapper使用现有导出的tooltipWrapperId(hostId)，只拥有该id节点；draw前登记按节点引用删除的cleanup并预建隐藏wrapper。Line configTooltip的createTooltipWrapper仍可能把它放body，这是已知portal位置，不移动canvas。stage wrapper显式display:none；采用后解除本wrapper的display限制。清理只删自己预建/拥有的wrapper及自己的AXIS_TITLE_TIP-<hostId>；不得删共享G2-TOOLTIP-WRAPPER根、其它host wrapper或按chartId扫全局DOM。tooltip gate必须在DOM查找/activateHoverTooltip之前返回，所以stage synthetic tooltip:show不会隐藏O/其它图的hover，也不会加全局pointercancel。轴标题gate同理；stage不创建全局轴提示子节点。

## 可直接实现的API与状态

```ts
interface LineStageHandle { readonly token: string } // 外部不可修改的opaque handle
// ViewWithQueryResponse是包含已返回data的独立chart DTO；不是query函数/Store引用。
prepareLineStage(viewWithQueryResponse: ChartObj): Promise<
  | { status: 'ready' | 'empty'; handle: LineStageHandle; hostId: string }
  | { status: 'stale' | 'rejected' | 'failed'; code: string; cause?: unknown; cleanupErrors: Error[] }
>
adoptLineStage(handle: LineStageHandle):
  | { status: 'adopted'; hostId: string; kind: 'ready' | 'empty'; retirementErrors: Error[] }
  | { status: 'already_adopted'; hostId: string }
  | { status: 'stale' | 'rejected'; code: string; cleanupErrors: Error[] }
abortLineStage(handle: LineStageHandle):
  { status: 'aborted' | 'already_aborted' | 'already_adopted' | 'unknown_handle'; cleanupErrors: Error[] }
```

controller依赖只有真实hosts、readCapture、drawChart和hooks/render资源端口、cleanup错误sink；没有getData/Store/snapshot/emitter/业务树writer。SFC传入实际chartView及实际hooks，不把controller退化为未接线纯reducer。viewWithQueryResponse先cloneDeep再defaultsDeep到另一份BASE_VIEW_CONFIG；data直接来自该独立response，不读活动chartData。scale/terminal/fontFamily/theme/tScale/dashboardHidden等显示上下文取已建立activeRecord的不可变displayContext；不调用Store方法；readCapture同时比较当前显示上下文投影，变化则拒绝旧stage。递归样式转换仅改本次clone，不对业务过滤tree作正规化、剪枝或重写。

每个owner包含slot/hostId/element、scope/instance或empty、独立深拷贝displayChart/responseData、capture、phase、closed、layoutEpoch、cleanup ledger。状态只在allocating→preparing→ready|empty→adopted，或任一步→aborted|failed|stale；终态不可复活。empty同样获得handle并保有自己slot的placeholder DOM，但没有scope/instance。外部不能拿到可变record来篡改readiness。

prepare只增加stageEpoch，不递增活动owner epoch、不清O的resize/timers、不设isError/errMsg/curView/chartData、pointParam/linkage状态；也不调用onDrillFilters/resetLoading/任何emitter。所有await前后检查mounted、stage token、queue epoch和capture。stage不可采用前不会写活动myChart/scope或host可见性。createG2RenderAttempt.isCurrent使用record.isAlive，采用后转由activeRecord身份维持，不可永远绑定stageEpoch导致下一次prepare误判已采用B为stale。失败返回主cause独立保留cleanupErrors，不能renderG2 catch后仍报ready。

普通owned-line完整重绘且carousel禁用时也走controller内部prepare→ready→adopt；允许初始无owner从A建立。已有public renderChart完整重绘仍按普通请求入口，保留原callback完成时机；新stage API不调用它。非eligible普通渲染沿旧分支；explicit stage不以legacy fallback绕过拒绝。autoRefresh true的原updateData仍先尝试，返回true保持原实例；false才完整双host重绘，不把in-place updateData冒充隔离stage。

## hook安装、门控与资源表

G2InteractionGuard由record捕获，引用对象固定：isAlive在preparing/ready/empty/current active为真，invalidated/disposed/unmounted为假；isInteractive仅当前activeRecord===record且mounted/未closed时为真。不得仅比较latest request version。stage pending时O的guard仍interactive；adopt B后所有B捕获回调使用原B hostId与guard自动转为interactive，O立即失效。

| 顺序/操作 | stage可执行动作 | 登记与释放 | 部分失败/迟到界限 |
|---|---|---|---|
| host/portal预分配 | 校验真实B；预建自己隐藏wrapper，登记节点引用 | stage外层finally负责own-node cleanup，采用后转交owner | 分配失败先清自己，O不变 |
| Line.drawChart | chartObj必须undefined；container和chart.container都为B string；保留真实options/refresh/legend/extremum | 新instance返回即交createG2RenderAttempt；构造前资源由Line前置单元负责 | draw返回前异常必须消费前置单元最新证据；本helper不能找回未返回的instance |
| Line内部tooltip/action | 有guard且carousel false时跳过Carousel构造；首次注册listenerTooltipShow(instance, chart, guard)；point动作先interactive再调用SFC捕获action | instance destroy清其监听；guard closed先阻断晚回调 | 同instance WeakSet第一次必须携带正确guard；SFC重复注册不得绕过；不能用设置carousel=false却仍进构造 |
| tooltip/axis-title | 所有show/point入口先interactive；tooltip hide只允许本owner正常活动清理；afterdestroy始终releaseActiveHoverTooltip(instance)，该函数按instance精确释放 | wrapper节点转交owner；轴提示仅自己hostId | afterdestroy不能被isAlive=false整段跳过而遗留活动global hover；不得清其它chart |
| theme font/large data/apply tiled options | 只操作stage instance/options，用B尺寸和捕获theme | instance销毁；tiled交互emit closure先interactive | options异常由attempt回收stage |
| assist/tiled installer | 可安装本instance listener、局部legend DOM/observer；布局与legend语义回调先alive，交互发射先interactive | 返回disposer立即scope.replaceCleanup(key, disposer) | 返回disposer之前的throw，无外部句柄部分allocation不保证；不得记成fully cleaned |
| render/afterRender/SVG scale | await真实instance.render和chartView.afterRender；前后revalidate；SVG仅改自己节点 | scope owner唯一dispose | stale promise只允许settle并释放，不发布/回放活动状态 |
| slider | 安装本instance/layout监听；pointerdown入口先interactive；disposed/afterrender晚回调先alive | disposer结束本owner拖动、off AFTER_RENDER；已捕获pointerdown也必须guard | 不在stage注册document pointermove/up/cancel，禁止用临时立即dispose掩盖安装副作用 |
| side legend pagination | 本instance navigator可预适配；afterPageLayout只有interactive且same owner才replay | disposer恢复自己navigator；迟到adapt/page-layout回调检查alive | 返回前异常同上；不能callback里读取活动myChart代替捕获instance |
| linkage replay | stage禁止replayLinkageActive、track动作、parent emit；adopt后的捕获callback仅当前owner可做既有replay | 无独立全局stage状态 | adopt成功后的replay是fallible postcommit项；报错误不回滚到已retire的O |

已登记cleanup逆序、幂等、先closed再释放，单个throw不阻断后续；instance.destroy最后尝试且最多一次，主cause与cleanupErrors分开。cleanup错误回调自身错误也保留。禁止把cleanup吞掉或因清理异常改活动error UI。返回句柄前installer异常的完整资源回收仍Unknown：本工程只保证已登记资源和已返回instance；Cases明确negative witness，禁止其结果升级为zero leak。该残余不准删除，并行Line/Carousel前置只解决它实际证明的边界。

## 队列、版本、resize与卸载

一个组件复用一条G2串行队列，普通重绘与stage prepare都入队；不得开第二完整组件。新stage请求使旧stage token失效并立即关闭其interaction guard，但不能占用尚有未settle任务的B，必须等旧attempt settle/释放后再复用slot。同一组件最多O+N两个真实instance。队列每项finally settle自己的Promise，失败不毒化后续链。

区分requestVersion（已有render调度的最新请求）、stageEpoch（明确stage的最新请求）、activeOwnerEpoch（当前owner）和layoutEpoch；普通calcData/renderChart新请求在入口使pending stage失效，但不会仅因准备新图使O的owner guard失效。autoRefresh及普通active resize是外部活动变化，需在写活动instance前失效stage并更新activityRevision；同target变更不能回滚到旧P0。原updateData的in-place失败并不因本件自动得到事务回滚保证。

ResizeObserver观察稳定shell；stage存在时尺寸变化先使stage stale，取消stage自有尺寸队列，活动resize照既有流程处理。不要在同一个G2 instance render pending时再并发forceFit；本版不原地追平stage，而是abort后由调用者重prepare。active forceFit的任务键为捕获activeRecord.hostId；options/tiled尺寸、Carousel.get/dequeue/enqueue、forceFit完成后的回放都检查捕获owner及instance。adopt后用B，不用逻辑containerId/A。旧resize已开始时只允许库Promise settle，其后不能options/replay新owner。active resize开始即使未改变尺寸也更新activityRevision，从而不能在它pending时采用旧stage。

卸载先同步mounted=false、失效request/stage/owner版本、关闭所有guards，再清render debounce/resolve待调度Promise、按两个owned hostId dequeue resize、释放active和已返回stage scopes、disconnect shell两个observers。pending create/render/afterRender迟到后只dispose自己，不能写DOM/refs、发布或replay。Vue可移除host；迟到finally删除own wrapper前仍验证节点引用，不按旧id删除后来同id节点。永不settle的第三方Promise资源上限仍未知，不凭超时虚构已销毁。

## 采用前独立revalidation与同步发布

readCapture每次从当前SFC/props读取，不能拿response中的捕获字段与自身比较：target(id/tableId/type/render/suffix/showPosition)、props完整渲染输入投影（customFilter、chartExtRequest、轴/attr/style、font/scale/terminal及显示上下文）、活动record身份/instance/scope、activeOwnerEpoch、activityRevision、requestVersion、query chartData引用及内容、curView引用及内容、isError/errMsg、pointParam/linkage/boxPlot状态、layoutEpoch与实际两个host尺寸。只在active tuple等于prepare起点且stage token唯一/current、状态ready|empty、scope未closed、DOM identity仍匹配时允许采用。

显式采用前读取所有值并预先构造nextRecord/返回结果、检查DOM写目标为现有普通div。任一比较失败先stale/abort stage并早返回，保留现场P1，禁止恢复旧快照。独立Cases按target、业务filter/config、活动query数据、error、layout、owner六轴逐项改当前状态，不能只测响应binding错配。

同步critical section没有await、query、Store/snapshot/emitter、Vue响应式写入、hook安装、G2 render/forceFit/replay/destroy或用户回调。原生visibility:hidden阻止预备B的用户命中，仍需guard拒绝程序性捕获回调；不能把opacity:0当作交互屏障：

1. 使用预先验证的pair普通div，对固定data-active-slot做一次原生属性写入；CSS让B可见/可交互、A隐藏/不可交互。stage portal的解除display限制、B.inert=false及B.aria-hidden=false在此之前预备（B仍visibility:hidden且guard=false，故不接受交互）；A的inert仍false，属性写失败时清stage并保留O指针/原属性。stage创建时仍inert=true；不能以CSS选择器假定能够改变原生inert属性。
2. 仅普通私有变量指针赋值：activeRecord=next；myChart=next.instance|null；activeG2Scope=next.scope|null；activeG2Version/owner epoch更新；token phase=adopted；原owner逻辑closed。单线程区段不调用可重入代码。
3. 返回状态固定为adopted；段后才把隐藏A的inert/aria-hidden恢复为true并retire O（逐项cleanup、destroy、clear own slot/portal）并收集retirementErrors。empty也同样采用B placeholder、myChart/scope=null。重复adopt返回already_adopted，不重画/不二次销毁；abort已adopted只返回already_adopted，不销毁活动N。

原生DOM固定属性写是唯一可失败发布操作，先于私有owner赋值。测试注入属性写前throw必须保留旧属性和O；不声称抵御任意外部猴补DOM原生方法后“先写再throw”的破坏。预备portal操作失败仍是precommit失败并abort。本合同保证浏览器同一JS task内完成视觉/owner交换，不声称数据库/Store/业务树事务原子性。禁止在critical section写shallowRef以引发同步watcher；组件查询层chartData/curView/isError/errMsg维持原值，采用后的显示数据来自activeRecord.displayChart/responseData，所有owned-line动作与resize改读该record。普通后续query完成仍走既有query publication，入场即失效stage；完整产品同步发布接口后补。

retirement cleanup、解除旧hover、联动回放或错误sink失败是采用后的已提交附加错误；adopt结果仍是adopted且列retirementErrors，不能虚报abort并试图复活已经销毁的O。工程调用方必须记录它们，不把本结果直接转成产品“过滤条件已应用”。

## 测试seam与可信RED

Cases r001定义唯一shared initial_state、完整observable字段、每案完整expected_state；无省略字段/事件后继承猜测。variants显式展开为独立case，含完整external_state_fixture；不把variants塞进expected。事件DSL是测试调度指令，oracle来自actual module/SFC观察和事件日志，不能由同一个reducer算expected。

首RED只要求冻结 `LSH-001`：使用当前真实SFC、现有public renderChart（不是缺失API），先建立O，再令新N的draw/render可控延迟；真正进入draw await后断言O仍是活动myChart、O未destroy、O host仍可见。当前源码先dispose O，会以 `LSH-001: ACTIVE_DESTROYED_BEFORE_STAGE_READY` 在assertion层失败；编译/导入/环境错误不是RED。该案在GREEN用同一入口和case identity复跑；不能换成NOT_IMPLEMENTED、导出不存在或仅查helper字样。该普通renderChart案允许其既有curView赋值，并沿用chartData作为数据源；其N代表新渲染实例，非新query数据。只有显式prepare案例要求组件query tuple完全不变。

actual-SFC harness复用compiler-sfc→compileScript→Babel AST定位setup return→只插入只读snapshot getter→esbuild内存编译；原源码bytes顺序不变、记录前后SHA。新增helper和guard相关真实module完整加载；具名doubles仅在G2库/API/DOM/Store边界，真实Line/shared tooltip模块的guard负例必须执行其源码，不能mock成“guard正确”的函数。编译template并用实际Vue renderer/custom host records（或已安装真实浏览器）核验两个div sibling、attrs/style、defineExpose。仅script getter不能证明template host存在；要另记录template编译和mounted refs。不得复制renderG2控制流、万能Proxy、substring通过或用模型代替SFC。

GREEN要求全部Cases和具体外部变化子案执行，execution_errors=0、assertions全通过、完整source/case/runner SHA可对账；API/Store/snapshot/emitter阶段调用均0。SFC公开API使用defineExpose实际传出的对象，从parent chartComponent ref形状调用；module-only通过不能代替入口接线。现有所有权23例、重入10例、SFC6例+8输入回归以及legacy/L7/autoRefresh路径保持证据边界。

需真实浏览器另验：两host相同非零尺寸，active可见stage不可点，真实G2 N ready前O画布/tooltip可交互；ready/empty采用不重画，失败/abort旧画布可交互；B采用后tooltip、tile/side legend、slider、760→520 resize、多组件、重复prepare/adopt/abort、unmount零已知资源残留。浏览器必须使用真实Line、真实guard tooltip installer、真实template；静态组件double通过只证明控制流。构造前置未合入前不宣称真实zero-leak。这里定义门槛，没有运行它们。

## 后续明确handoff与保留义务

父views/index.vue当前chartComponent ref已调用calcData/renderChart/clearLinkage/trackMenu；本件只在G2 SFC暴露新低层API，测试从该公开边界调用，不在editor新增复制/粘贴入口。产品调用方未来流程必须另冻结：授权且无副作用的stage query取得完整response → prepareLineStage(response) → 重新验证当前身份/权限、target、业务树及query capture → 在独立事务合同中publish业务树/query局部状态/Store → 与adopt的失败/顺序处理 → 成功提示 → 仅正常保存后离开重开。当前不得把它简化为先view.customFilter赋值再calcData，或凭adopted直接提示成功。

后续query/commit合同必须逐项处理：isError/errMsg、chartData/curView、onDrillFilters及父drillFilters、地图dynamicAreaId/scope/gadmName/country、setViewDataDetails对calParams/view的合并、setViewOriginData条件、chart-data-change、snapshot、callback/resetLoading及loading/request terminal、相同chartId取消/late响应、axios auth/HMAC/cache/toast导航、filter tree/target revision、一条dispatch一个终态以及mount/重开query计数。本件计数0仅指stage API，没有裁定旧r003产品query计数。原filter serializer、TTL/byte上限、SharedWorker时钟/会话、非空目标确认、复杂图/Query→Query和真实权限全部pending。

本轮未执行构建、服务、API/数据库、浏览器或工程测试；仅完成文档/JSON自检。现阶段状态为Design/Cases候选，必须独立审查后才可冻结。未知包括installer返回句柄前allocation、前置Line/Carousel最新实现及其运行结论、真实G2事件/DOM浏览器效果；已知tooltip全局污染已在合同中要求guard修复，不留作可接受Unknown。若Review证实仍有某hook全局写入，先补精确gate/资源合同，再由授权lane实现；不能降低本件隔离predicate。
