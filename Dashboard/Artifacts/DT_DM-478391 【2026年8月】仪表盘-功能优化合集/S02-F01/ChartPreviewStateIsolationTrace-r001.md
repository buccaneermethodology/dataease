# 图表预览状态隔离源码追踪 r001

仅为下一份 MVP staged query/render Design 提供静态输入。未改源码、合同或台账，不构成新产品合同、权限/运行验证或 MVP/Goal 完成。完整验收分母保持，旧产品/事务 r003 的 3/3 预算未重启。

Card canonical SHA `e11f3b19438765399c5a1169fb29ae6afe8b688e73a32f4db378ec6edfb49c9a` 接收端 validate pass；Context validate exit 0，14 项绑定摘要全部匹配。按项目 SGE 与绑定 SP-010 lane/Card 边界执行。完整 SHA、逐事实行锚/范围摘要、before/after、owner、读者见同名 JSON。

## 下一设计关键输入

1. `calcData` 请求分支 fire-and-forget，async 自身未 await/return getData 链，等待其 Promise 不能证明查询或渲染完成。
2. 回包先写 data/drill/map/Store/events，再 render；details 还会原地改 response.calParams 并写活动 view。render 失败不会自动回滚。
3. `defaultsDeep(view,...)` 在 deepCopy 前原地补默认值，curView 也先写；G2 catch 吞错仍 resolve/callback；L7 async 只排 timer，callback 可能重复。
4. 当前 full render 先释放旧图，共享 hooks/observer/carousel/queue 都是单 host；双 host 应在 SFC 内部设计资源槽，复制完整 Chart 会额外挂载查询和相同 ID 监听。
5. clone 不能隔离 axios 的 Token/cancelMap/linkToken/version/cache/toast/导航/HMAC 等效果。HTTP 实际 dispatch 本轮未观测。

## 调用与异步顺序

```text
Editor 更新 → resetDrill-id → nextTick drillJump → 外壳calcData
query-data-id → cancel + loading=false → debounce queryData → clone/filter
外壳calcData → lastRequest + loading=true → 子calcData（不等待）
子calcData → error reset → JSON clone → getData → axios interceptors → HTTP adapter
同请求回包 → chartData → 父drill → map → details → 条件origin/事件
           → curView/defaultsDeep → renderer → callback（不代表成功）
render-id/all → nextTick → G2 queue300ms / L7 timer500ms（无getData）
联动/用户drill/mount/timer/保存appData重载 → 可能的新query触发
```

## 当前源码事实

下表是 JSON facts 的 reader projection。路径省略公共前缀 `core/core-frontend/src/`；行号 1-based inclusive。

| ID | 源码/符号 | 结果及外部作用 | 顺序/候选隔离边界 |
|---|---|---|---|
| Q01 | `views/chart/components/views/components/ChartComponentG2Plot.vue:548–560` `calcData query entry` | isError=false；JSON往返克隆v；调用getData(v)；逻辑查询调用，经过拦截器后才可能到HTTP adapter | async本身未return/await getData.then链；其Promise可在回包前fulfilled；需内部真实query-settle Promise；不能await现有calcData判完成 |
| Q02 | `api/chart.ts:79–116` `getData` | 先delete data.data再cloneDeep；stock-line首xAxis降序；名称转码；POST /chartData/getData；同response解码；函数有入参修改，SFC传入的是独立JSON clone；不构成整个网络沙盒 | 返回request.post.then链；response decode不发第二次chartData请求；可复用getData但仅传candidate；不能称纯函数 |
| Q03 | `views/chart/components/views/components/ChartComponentG2Plot.vue:552–604` `calcData then/catch` | 非0业务码写isError/errMsg并callback；成功先发布再await render；catch仅callback；catch不恢复局部/Store；render或callback抛错也可落同catch | 异步then await render；整链未链接外层calcData Promise；需typed成功/失败结果；fulfilled和callback不是成功receipt |
| Q04 | `views/chart/components/views/components/ChartComponentG2Plot.vue:605–610` `calcData no-table branch` | 四种地图await renderChart(view,callback)后无条件callback；其他无query直接callback；地图可出现render callback加这里callback两次 | L7 async只排timer，await不等绘图完成；下一Design处理一次settle；不推广callback作为query终态 |
| Q05 | `views/chart/components/views/index.vue:655–714` `queryDataFromSelect/queryData/calcData` | 先cancelBatch同chartId、loading=false；debounce300ms后filter+clone，chartExtRequest赋值；lastRequest写Store、loading=true、调用子calcData；取消不等于从未派发；lastRequest/loading在查询前写；插件另走invokeMethod | 父不await子Promise；callback释放loading；stage应独立candidate lastRequest/loading，不能整段复用外壳prepare |
| Q06 | `views/chart/components/views/index.vue:832–841` `onMounted initial query` | 恢复drillClickDimensionList，queryData(firstLoad)；新增完整Chart副本可能多一次mount query，不是单纯host | debounce与门控后才真实dispatch；候选双host放SFC renderer内部，避免第二外壳query监听 |
| S01 | `views/chart/components/views/components/ChartComponentG2Plot.vue:131–158` `isError/errMsg/chartData` | 请求前只reset isError；业务错误errMsg=res.msg；成功chartData=res.data；error v-if换DOM；旧errMsg成功时未清 | 写数据先于render；三个值需candidate隔离；error reset不能提前影响活动host |
| S02 | `views/chart/components/views/components/ChartComponentG2Plot.vue:563–574` `drillFilters/dynamicAreaId/scope/gadmName` | 先emit onDrillFilters；空drill清dynamicAreaId/scope/gadmName，非空从入参chartExtRequest.drill[last].extra赋值；父同步写state.drillFilters；数组缺对象时.extra仍可能抛错 | emit先于map/Store/render；异常进入链catch；prepare收集候选drill/map；commit再emit |
| S03 | `views/chart/components/views/components/ChartComponentG2Plot.vue:575–592` `country/map normalization` | 有map更新country/prefix；dynamicAreaId补国家前缀；空drill不清country；影响地图areaId | Store/render之前同步；须保留继承/覆盖语义，不能统一清空所有地图字段 |
| S04 | `views/chart/components/views/components/ChartComponentG2Plot.vue:594–599` `standard success publication` | details；条件!res.drill且无linkageFilters时origin+chart-data-change；最后render；render失败前Store与监听者可见，标准路径非事务 | 全部publication先于render settle；需分离prepare和commit effects，不能直接复用成功块做stage |
| S05 | `views/chart/components/views/components/ChartComponentG2Plot.vue:612–630` `curView/defaultsDeep` | curView=view；defaultsDeep(view,cloneDeep(BASE_VIEW_CONFIG))原地补默认后才deepCopy chart；纯render也可能改传入view和交互上下文 | 发生于任何await之前；candidate view独立做defaults；candidate curView提交后发布 |
| S06 | `views/chart/components/views/components/ChartComponentG2Plot.vue:133–154` `linkage/point/menu state` | 点击改point/linkageParam/菜单位置；linkage提交保存boxPlot deepclone；clear清history/boxPlot；state.data与trackBarStyleMobile本文件搜索仅声明；可触发父点击/跳转/Store联动；图元选中样式写DOM/canvas | 点击→nextTick/rAF；与render可交织；stage禁用活动action/replay闭包；不替换活动交互态 |
| S07 | `views/chart/components/views/components/ChartComponentG2Plot.vue:276–441` `shape style/cache` | backup/reset/apply写shape属性及LINKAGE_STYLE_CACHE，flush canvas；不是只有Vue对象变更；绑定当前instance | render后rAF replay；参数化instance/host，不能用活动myChart闭包作用候选 |
| S08 | `views/chart/components/views/components/ChartComponentG2Plot.vue:655–686` `active instance/scope/version/queue/timers/cleanup slots` | render/resize/unmount修改活动指针、versions、timer/finish、4个legacy cleanup refs；dispose销毁实例/adapter/carousel；单队列 | 300ms schedule+Promise queue+stale guards；双host需独立资源槽/owner；候选不能占活动scope |
| S09 | `views/chart/components/views/components/ChartComponentG2Plot.vue:998–1004` `map refs/host/map timers` | L7读取上下文、销毁myChart、清chartContainer.textContent；另mapL7Timer；同一个containerId和DOM host | 500ms timer，独立于G2队列；非普通line MVP残余；不能推广全部renderer安全 |
| S10 | `views/chart/components/views/components/ChartComponentG2Plot.vue:1444–1453` `observers/resize/unmount` | mount绑定containerId DOM；resize preSize/定时forceFit或render；intersection tooltip:hidden；卸载失效/释放/disconnect；真实DOM observer/resize queue/实例资源 | resize300ms；unmount先同步invalidates再cleanup finally disconnect；交换host需定义observer节点/preSize；error v-if重建节点的runtime行为Unknown |
| D01 | `store/modules/data-visualization/dvMain.ts:1859–1877` `setViewDataDetails` | 直接赋chartDataInfo.data；旧truthy参数值原地合并进response.calParams，再写活动view.calParams||null；同时改cache/响应/活动图表；旧0/false/空串不被truthy规则保留 | 同步，在render前；prepare不得调用；commit需重验当前calParams并明确现行语义 |
| D02 | `store/modules/data-visualization/dvMain.ts:1879–1886` `details/origin getters/setter` | getter返回原引用；origin直接赋dataInfo，无clone；提前赋值会外溢到明细、导出、颜色 | 同步；candidate cache隔离，commit保持origin条件 |
| D03 | `utils/imgUtils.ts:47–50` `download2AppTemplate` | clone views后每view.data附details缓存；提前publication影响模板下载 | 读取时消费缓存；导出读者需commit边界；未验证导出文件 |
| D04 | `store/modules/data-visualization/dvMain.ts:1894–1898` `lastRequest cache` | 直接存取引用；外壳query前写；自动刷新/放大/导出读取 | 同步；候选request独存，发布时点需Design定义 |
| D05 | `views/chart/components/editor/editor-style/components/CustomColorStyleSelect.vue:115–166` `setupSeriesColor` | 构造seriesColorState和nextTick picker状态；chart-data-change无payload，对所有已挂载listener调用其自身chart.id读取；该函数没有getData | mitt同步主体，再nextTick UI；stage抑制事件；commit事件不是第二HTTP dispatch |
| R01 | `views/chart/components/views/components/ChartComponentG2Plot.vue:616–653` `renderChart library dispatch` | curView/default/style转换；离开ownedLine失效G2；分发G2/L7；无getData，但有局部/DOM/实例/事件副作用 | G2 await完成后callback；L7只await排timer；内部stage renderer需结果通道；pure render仅指无query调用 |
| R02 | `views/chart/components/views/components/ChartComponentG2Plot.vue:742–772` `renderG2 scheduling` | 关闭carousel立即destroy/replay；++version、clear timer/finish；300ms queue stale检查；复用原renderG2会影响活动轮播/调度 | 取消schedule resolve旧Promise，不代表成功；参数化host scope+schedule槽，不能直接当无副作用stage |
| R03 | `views/chart/components/views/components/ChartComponentG2Plot.vue:773–795` `drawOptions` | chartObj=myChart，container/chart.container=containerId，action/quadrant闭包，主题/移动DOM/tScale；queue执行时读取Store/DOM，不是只靠view的函数 | queue主体同步；显式传hostId/instance/chart/theme/interaction sink候选 |
| R04 | `views/chart/components/views/components/ChartComponentG2Plot.vue:798–907` `owned line renderer hooks` | autoRefresh可原地updateData；full先释放旧，再attempt create/setup/render/afterRender，ready后发布；当前full不是保留旧预览双host；setup含tooltip/axis/font/performance/tiled/assist，after含SVG/afterRender/slider/pagination | setup→await render→await afterRender→isCurrent→发布myChart/scope→replay；共享hook候选精确段839-895；candidate保持独立scope，不能先dispose活动图 |
| R05 | `views/chart/components/views/components/ChartComponentG2Plot.vue:909–995` `legacy renderer/failure channel` | legacy updateData/destroy+draw/hooks/render；catch只console与cleanup errors，finally resolve；owned和legacy错误都可能fulfilled，G2 callback仍执行；无结构化render成功结果 | await后的部分guard仅instance==myChart；stage要暴露失败结果；不推广全G2所有权 |
| R06 | `views/chart/components/views/components/g2-render-attempt.ts:20–32` `createG2RenderAttempt` | ready scope、empty、stale区分；异常带主错误+cleanupErrors；只拥有已返回instance生命周期；不含query/Store/host切换 | 169-174依序await/check current；可复用生命周期；不是现成产品stage handle |
| R07 | `views/chart/components/js/panel/charts/g2/line/line.ts:102–151` `Line.drawChart` | 无data length直接undefined；chart.container赋值；new G2→legend/setup/refresh/options/click/carousel.start/extremum→return；return前已产生资源；返回前异常安全由平行lane处理 | async函数内部安装先于SFC helper接管；stage需唯一host和非活动actions；构造异常资源Unknown，不能冒称已修 |
| R08 | `views/chart/components/js/panel/types/impl/g2.ts:802–834` `G2ChartView.updateData` | 改options→prepare→await render→空态DOM→WeakMap；carousel begin/finish；直接改已有instance；数据相等true可不render；不发HTTP | finally结束carousel update；candidate不得用活动myChart updateData |
| R09 | `views/chart/components/views/components/ChartComponentG2Plot.vue:1005–1065` `L7 render timers` | clear旧timer，500ms后draw；L7Plot destroy/textContent；L7不await render；callback及finally resetLoading；函数Promise排timer后已fulfilled，callback不保证唯一 | 定时器异步；卸载段未显式clear两个map timer；记录复杂renderer残余；runtime影响Unknown |
| R10 | `views/chart/components/views/components/ChartComponentG2Plot.vue:1074–1083` `actionDefault and quadrant emitter` | emit map/word-cloud/gauge-liquid；quadrant另在1348-1350 emit；接收Editor表单变更；gauge可changeMisc；非HTTP直接调用 | mitt同步→可能Vue/父链；stage事件缓冲/禁用；完整后续watch计数Unknown |
| R11 | `views/chart/components/views/components/ChartComponentG2Plot.vue:1352–1436` `preparePicture/unPreparePicture` | 地图异步导出后隐藏scene/map并append img；反操作恢复节点；以viewId筛选，仍操作单host | export Promise迟到可写DOM；交换host须明确导出活动host；未运行导出 |
| E01 | `views/chart/components/editor/filter/FilterTree.vue:22–45` `FilterTree submit/close/changeFilter` | 错误toast；成功删field→emit filter-data→snapshot changeFilter→close；取消仅close；emit同步让Editor替换活动tree，snapshot type非calc/render | emit先父写，再record cache；复用serializer结果但stage不可提前父写/dirty |
| E02 | `views/chart/components/editor/index.vue:1594–1601` `changeFilterData/openTreeFilter` | cloneDeep新filter赋view；open时clone旧filter给init；函数本身不query/render/save；没有customFilter watcher自动query证据 | 同步；commit最小接点候选；prepare不能先调用此函数 |
| E03 | `views/chart/components/editor/index.vue:1024–1068` `Editor update/calc/render` | resetDrill或calc/mobile事件；snapshot calc/render；updateQueryCriteria；updateChartData写ready/checkShowEmpty；resetDrill→drillJump→query；render事件只render；queryCriteria listener只映射字段 | emit+nextTick/debounce；stage独立入口，不能复用更新图表整链 |
| E04 | `views/chart/components/editor/index.vue:395–398` `recordSnapshotInfo/removeItems` | dataFrom=calc并record；removeItems先记录calcData再customFilter={}；clear filter改dirty/cache，非立即HTTP | 同步cache供未来undo；取消/失败不得调用；成功dirty/snapshot策略待Design |
| E05 | `store/modules/data-visualization/snapshot.ts:87–96` `recordSnapshotCache` | markQuerySingleSelectDocumentEdited；按calc/render追加ID；任何type snapshotCacheTimes++；S01生命周期有写副作用；非query dispatch | 定时snapshotCatchToStore另层；stage不记dirty；S01只读不改 |
| E06 | `store/modules/data-visualization/snapshot.ts:139–193` `snapshotPublish/undo events` | 替换dv/components/style/views/track/jump/selection；合并calc/render IDs→emit snapshotChangeToView；接收calc列表query，render列表只render | emit可defer，接收nextTick；成功commit undo行为需实测，cache次数不是查询次数 |
| E07 | `components/dashboard/DbToolbar.vue:271–319` `dashboard saveResource` | matrixSizeAdaptor/updateQueryCriteria→canvasSaveWithParams；成功清dirty/router；仅appData重载回调calcData-all；保存HTTP与chartData分开；不能泛化每save都query | save回调后app分支才query事件；必须只捕获已commit活动canvasViewInfo；保留S01 capture |
| E08 | `components/data-visualization/DvToolbar.vue:193–234` `DataV saveResource` | nextTick保存；成功cache/router；仅appData重载后calcData-all；独立DataV保存入口；不等于paste实现 | save回调后；两宿主保存都需后续验证；本轮未保存重开 |
| C01 | `views/chart/components/views/index.vue:864–984` `calc/render/resetDrill routing` | calc-id/all nextTick query；render-id/all await renderer和paint；resetDrill→drillJump；renderAll finish不是getData；calc-id无suffix，renderAll item身份含suffix | mitt同步，nextTick后查询/绘制；emit无聚合Promise；双host不新增相同query监听；真实监听数/dispatch Unknown |
| C02 | `views/chart/components/views/components/ChartComponentG2Plot.vue:1264–1284` `trackClick fanout` | linkage写dvMain，drill emit父chartClick，jump/point向父；联动对目标view emit query-data；drill父calcData；这些是后续触发，不是原response | 用户动作→Store/emit→debounce；stage禁活动actions；一个emit不等于一次HTTP |
| C03 | `custom-component/user-view/Component.vue:104–120` `UserView shared Chart` | Chart接props后单G2/L7子组件；主应用和预览复用同SFC | mount会query；双host在SFC内部，不能mount第二UserView |
| C04 | `pages/panel/ViewWrapper.vue:212–225` `panel ViewWrapper` | ComponentWrapper→UserView→Chart，suffix传入；iframe/div点击回调、axios嵌入token仍生效 | 共享mount query链；已查静态共享链；真实panel/分享权限未运行 |
| C05 | `pages/lib/dashboard/index.ts:1–6` `lib DeDashboard` | withInstall(Dashboard)导出主Dashboard；无独立lib renderer；宿主兼容Unknown | 安装i18n后store/UI；共享SFC会影响lib；未跑宿主双实例 |
| C06 | `views/dashboard/MobileConfigPanel.vue:30–44` `mobile bridge` | PC postMessage到iframe，移动panel切style后emit calc/render-id；跨文档独立store/mitt/HTTP，不按同一JS事件猜总数 | postMessage异步→mitt→nextTick；已查消息路由；移动真实DOM/权限未运行 |
| C07 | `views/chart/components/views/index.vue:305–349` `timer/scale/result watchers` | timer clearViewLinkage并query；searchCount无内timer则query；resultMode/count query；scale仅render；clearViewLinkage可能触发其他图query，具体数Unknown | timer→debounce；timer内部策略未逐行查；requestId按原因区分；不假设总次数 |
| C08 | `components/data-visualization/canvas/DePreview.vue:622–649` `DePreview ComponentWrapper` | 配置与view-info/suffix等传ComponentWrapper；复用动态UserView共享Chart | mount可能query；已查共享绑定，未全查XPack/所有宿主组合 |
| A01 | `config/axios/index.ts:7–41` `request wrapper` | 组service config默认headers；wrapper支持signal等但getData未传；参数clone不隔离全局axios | axios request interceptors之前；复用认证链；任何local-error选项是新内部候选 |
| A02 | `config/axios/service.ts:104–167` `request interceptor` | await configHandler/securityConfig；移动/link/embed/proxy/lang头；chartId cancelMap覆盖登记；可showLoading；同id stage/live取消key冲突；认证/签名外部写 | 拦截器可wait/reject，request.post不证明adapter已dispatch；实际HTTP需adapter观测；stage取消身份未存在 |
| A03 | `config/axios/refresh.ts:52–92` `configHandler` | 可refreshApi，写token/exp/time/global标记；缓存request回调再release config；login/refresh是另一HTTP类型；refresh失败仅console且队列settle依路径 | axios等待retry Promise，原请求延迟；不能chart clone回滚认证副作用；失败runtime未测 |
| A04 | `config/axios/service.ts:175–228` `response interceptor` | version/cache/confirm；linkToken；hideLoading；业务码toast/cache/router/reject；这些全局动作先于SFC then，getData无local处理配置 | code0/50002继续，否则reject等；stage网络不是无副作用沙盒，需列允许UI策略并保留鉴权 |
| A05 | `config/axios/service.ts:230–307` `transport error interceptor` | timeout loadingMap/toast；无response reject；413 undefined；400 reject；其他可toast/cache/permission dialog后resolve undefined；API读取res.code可能再throw；callback不能判成功 | 同请求错误观察；确认框reload可能后续mount query；区分真实reject/normalized undefined；不可把失败记从未dispatch |
| A06 | `views/tools/HmacTool.ts:3–50` `HMAC/timeout auxiliary network` | 同步XHR /perSetting/hmac/info并cache；签名写headers；模块timeout也同步XHR/window赋值；额外配置HTTP非chartData；只读代码未读运行密钥值 | axios await签名，模块求值timeout请求独立；candidate继承这些网络effects；不能宣称均可回滚 |

## 双 host 与 stage API 候选

- **H01 内部query candidate bundle**：`SFC calcData 548-604 + api/chart.ts getData 79-116`。抽出真正返回getData settle的内部prepare，独立candidate view/request/token，输出response/data/drill/map/error；不改活动状态/Store/events/snapshot/loading；保留认证网络链和可观察副作用。（Q01, Q02, Q03, S01, S02, S03, S04, D01, D04, A02）
- **H02 共享renderer hooks**：`SFC drawOptions 773-795 / setup-afterRender 839-895 / helper 20-32,159-185`。参数化hostId/instance/chart/scale/theme/interaction sink/scope；复用attempt与当前hooks；prepare前不dispose活动scope；stage禁活动action/default事件/replay；返回前异常安全消费平行lane。（R03, R04, R06, R07, R08）
- **H03 SFC内双host资源槽**：`containerId 160 / template 1586-1593 / observer 1451-1534`。唯一string id的可测量sibling stage host；SFC内部独立slot/queue/timer/observer/cleanup owner；不再mount完整Chart，不新增相同viewId query监听；具体DOM交换及重绑待Design。（Q06, S08, S10, R02, R11, C01, C03）
- **H04 prepare/commit/abort内部接点**：`SFC defineExpose 1438-1442；Editor changeFilterData 1594-1595；FilterTree binding 4288`。prepare返回candidate/abort仅释放candidate；重验后commit tree/data/error/drill/map/curView/details/origin/lastRequest/host/dirty/snapshot/event；发布次序、失败/事件再入/回滚由下一Design冻结；禁止先写活动树再calcData。（E01, E02, E03, E05, E06, E07, S04, S05, D01, D02, D04, R05）

## 计数层与未决项

逻辑 getData 调用、adapter HTTP dispatch、同请求 resolve/reject、纯 render、callback、emitter 后续查询分层。已派发请求失败/取消/迟到，不能用“失败不刷新”改写成从未发出；response 与 late-ignore 不能凭名称再算一次 dispatch。callback 只是现有 loading 通知。chart-data-change 的已查 listener 是颜色 UI，updateQueryCriteria 是字段映射，两者不能直接记作新 getData。保存、refresh、HMAC、timeout 是别的 HTTP 类型。最终产品计数语义保留 Unknown，不修改原 Goal/AC/Cases。

- **U01**：产品最终query计数语义、尝试/adapter dispatch/response/late-ignore/取消的terminal归并。Unknown；本Trace不修改Goal/Cases，由下一Design保留原AC裁定。
- **U02**：同chartId candidate/live取消身份与axios全局UI/auth/cache外溢隔离。Unknown；参数clone不隔离transport。
- **U03**：双host测量/可见性交换、hooks重绑、observer/preSize与唯一dispose。Unknown；须绑定实际DOM/renderer并验证。
- **U04**：query迟到/目标变化/卸载是否继续写局部/Store。Unknown runtime；calcData无query version/unmount guard，render guard不保护此前publication。
- **U05**：Line return前构造失败资源安全。Unknown in this lane；消费平行Line/Carousel lane最终证据，不能猜为已修。
- **U06**：真实权限/多用户/组织/撤权/分享/嵌入。NOT_RUN；不作为本静态非权限工程停止理由；完整权限验收未减。
- **U07**：真实主应用/panel/lib/mobile渲染、导出、保存重开、全部复杂图与XPack。NOT_RUN / not exhaustively traced。
- **U08**：非line G2/L7 empty/timer/callback staging及所有权。Unknown generalized staging；普通line MVP以外仍保留原验收。
- **U09**：所有Vue watcher传播/跨宿主listener数/后续query multiplicity。Unknown；只证精确已查listener和写入，不猜总dispatch。

## 已查与未查

已查：绑定Context 14项摘要全部重算；SFC全部顶层可变状态及query/render/action/resize/unmount；API/axios/request-response/cancel/auth refresh/HMAC公共前端；Editor FilterTree/clear/刷新/保存与snapshot undo事件；details/origin/lastRequest读者：明细/导出/模板/联动跳转/颜色；UserView共享Chart及主Dashboard/DePreview/panel/lib/mobile消息路由。

未查/未运行：浏览器/HTTP dispatch实际计数/数据库/权限/保存重开；全部非line renderer内部、XPack实现；全部Vue watcher传递闭包、所有宿主组合；useChartRefreshTimer内部与后台计时策略。

只执行 Card/Context 校验、静态追踪与 SHA/行锚自检；未安装、构建、启动数据库、请求权限或运行产品。写入前源摘要无漂移，消费时须重算 JSON source_manifest。Line/Carousel 构造异常安全由平行 lane 提供，不能据本 Trace 宣称修复。下一 Design 可直接消费本静态证据索引，父 Goal 继续。
