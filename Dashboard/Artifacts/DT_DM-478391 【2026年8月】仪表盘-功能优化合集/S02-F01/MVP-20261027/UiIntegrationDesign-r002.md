# UI 集成设计 r002：共同候选接口与分组件直接实施

**本交付物第2/3轮输入，Design候选，未实现/未执行测试/未独立验收。** r001 Design/Cases与两份第1轮报告字节冻结；本次只新增r002两文件。A/B已获各自准入并在真实实现，本设计不回退、不重做、不使其等待C。

## Authority与修订处置

authority仍为planning/MvpScopeAuthority-20261027.json，SHA `641dfa78e63b1d53e25c08ea5c71c4458c272399c749aa84f0dea63ab89023a4`；canonical Goal.final当前22项/历史16 approved_deferred、TSP与49内建分母保持。Card SHA `8a9c9620a2b025859f2fb93a1d563fe2fde56026cc8130bce3815c83367e6ec9`、Context原字节SHA `b14eaf7c1c1586615c3f6b80abff5d5536f811d7e80ce94313b4425735549532`已复验通过，20项required-read字节一致。Topology-actual-r428是本lane依据。A并发源码不作不变字节绑定；C启动前绑定当时真实源码与差异/admission。

r002替换r001关于C、图片组入口/请求分支及逐type终态计划的对应内容；A的完整持久树/未知拒绝/DEV桩/内存TTL要求继续有效。旧55/29矩阵、通用资源/乱序框架不进入本包。

| Finding | 本次具体处置 | 实施切片/当前证据 |
|---|---|---|
| UIR-001 | picture-group真实Attr内复用共用服务/小按钮区；独立getFieldByDQ目录，不调用onDatasetUpdate | C4；源码设计，未运行 |
| UIR-002 | 五map类真实layer/plot完成桥、loaded前订阅、错误/超时与预热边界 | C2；未运行 |
| UIR-003 | TinyMCE init+SetContent真实内容确认；私有channel/候选禁注册 | C3；未运行 |
| UIR-004 | assignment的appearance写与document全p timer收敛为候选局部root、局部存活timer；失败不越界 | C3；未运行 |
| UIR-005 | 下述共同handle、同keycanonical binding、精确setter/dirty、普通编辑和undo/redo | C1先落G2/S2/indicator；未运行 |
| UIR-006 | needsQuery显式联合；picture threshold关闭0 query；开启真实数据正向见证 | C4；未运行 |
| UIR-007 | Cases07/14按每eligible type真实source、target、query/画面/save/leave/reopen运行 | D分批，49全量保留 |
| UIR-008 | 15主ID保留；08–11稳定必要子案、fixture/事件序/故障点/独立旧态投影 | r002 Cases，全部设计态 |

## A/B已落接口与本次C1精确边界

A的 `src/custom-component/filter-copy/mvp-chart-filter-copy.ts` 已有 `getMvpFilterClipboard()`、`checkMvpFilterTarget(target,now)`、`getMvpFilterSessionToken()`，clip内tree/tableId/fields/createdAt/identityEpoch/editSessionId/revision；单调有效[0,1800000)。`useChartFilterCopyMvp(view)`暂以`preparation_unavailable`拒绝paste，copy/permission/fields/session在真实组件。C按这些API接线，允许增量扩展composable的prepare callback/busy/reason，不重写A。不读/输出token/secret。

B稳定API：`getData<T=IResponse>(data:object,{reportOutcome:true}):Promise<ChartDataOutcome<T>>`，返回 `{ok:true,value:T}|{ok:false,error:IResponse<unknown>}`；正常无options保legacy。严格模式在clone删data，原输入不被改；由既有envelope/code与解码产生outcome。C必须直接调用该API一次，不新axios、不再猜DTO code、不重复其实现。

**C1可在r002独立Review后立刻单独Builder**：共同局部handle/编辑receiver/query context/同key提升/metadata，以及G2、S2、indicator三个实际SFC。它不等待地图SDK或TinyMCE资产、不等待C2–C4/49全运行。但C1只提升已接部分证据，bar→line/table/indicator只是先行见证，不是S037/S038或Goal终态。其余类型显示具体preparation_unavailable并留未完成，不从49分母删除。A/B已完成部分不作为C1重新准入前置。

C1生产候选路径：views/index.vue；ChartComponentG2Plot.vue（先限G2分支，L7旧分支保持）；ChartComponentS2.vue；indicator/DeIndicator.vue；新 `filter-copy/mvp-chart-filter-paste.ts`（仅类型、局部operation及handle小函数，非全局调度器）；必要局部 `views/components/FilterPasteRenderer.vue`；现useChartFilterCopyMvp.ts的调用端接线。API B只消费不改。精确路径以控制面admission为准；不带旧runner/Goal/冻结文件。C2–C4各自补路径后独立准入。

## 共同handle：一个target、一个candidate、一次query

只在当前资源编辑画布wrapper注册 `paste-chart-filter-${targetId}` request/reply（含editSessionId、operationId）；同ID panel/移动/预览不注册。返回Promise并有限receiver超时；未接入类型直接返回具体不可用，无query/target写。composable在已有guards通过和覆盖确认后设置busy/发请求，按钮禁重复；cancel无query。receiver只从当前canonical wrapper读取原view、element和filter(false)；不挂完整wrapper作candidate。

下面是**待实现的固定专用接口**，非声称已存在：

```ts
type PasteInputs = { phase: 'candidate' | 'active'; view: ChartObj; element: ComponentInfo }
type PasteBinding = { current: ShallowRef<PasteInputs> }
type QueryPlan =
  | { needsQuery: true; request: ChartObj }
  | { needsQuery: false; reason: 'picture_threshold_disabled'; local: ChartObj }
type PreparedQuery =
  | { kind: 'queried'; response: ChartObj; request: ChartObj }
  | { kind: 'static-picture'; local: ChartObj }
type PasteReady =
  | { ok: true; handle: PreparedFilterPaste }
  | { ok: false; reason: string }
interface PreparedFilterPaste {
  readonly key: string
  readonly binding: PasteBinding
  readonly metadata: PreparedMetadata // 下表的显式可选分支，不是随意Store写闭包
  readonly instance: unknown          // 仅局部已有库实例，不序列化到树/保存
  dispose(): void                    // 幂等，作废timer/回调/已知实例/候选DOM
}
// 暴露在真实下层SFC（可由极薄FilterPasteRenderer转发）：
prepareFilterPaste(input: PreparedQuery, binding: PasteBinding,
  isCurrent: () => boolean): Promise<PasteReady>
```

ComponentInfo采用仓库实际element类型名，unknown实例在各SFC内收窄为G2/S2等现类型；不让unknown透传业务payload。接口可合并在同一小文件，不新增状态机/controller/host registry。只有wrapper持有一个operation记录与两个局部keyed node（old+candidate）。

`binding.current`是父/子共享同一个shallowRef包装对象；子内有效view/element用computed实时读取它，默认无binding时仍读旧props。父模板的`:view/:element`也绑定该输入，publish设成canonical引用，Vue下一patch保同key；共享ref让同步publish之后、patch之前闭包也立即读canonical。**不能只切可见性和chartComponent ref，更不能长期让props留stageclone。** action、分页、参数、样式/过滤交互均读取此有效binding，不把clone/旧element解构到长期闭包；curView/actualChart作为当前已绘数据快照可保留，但后续render要按新canonical输入构建。

### 有限顺序与同步publish清单

1. 对当前A guard、权限、clip/TTL/field目录复核；创建operationId=递增本地数，捕获targetId/同资源editSession、A session token三字段、clip revision、target view+element深克隆、请求上下文与configGeneration。capture前确认目标非loading；在busy期间wrapper普通query/刷新入口先使paste失效再沿原流程执行。deep watch `flush:sync`对canonical view/element的用户修改递增generation，target/context/身份/clip/TTL分别复核；内部stageclone变更不计。外部context由纯filter构造结果比较，并用相关响应式输入watch检出改回。
2. 复用wrapper完整chartExtRequest：user/filter/linkage/outer/web/drill/resultCount/mode；编辑路由无report分支，不提前setLastViewRequestInfo。queryPlan在clone上按现SFC参数适配，调用B严格getData一次，业务失败/异常即返回。DTO来自B.value，是chart DTO本身，不是再解一层envelope。
3. 深克隆成功DTO，预合并calParams（逐id保留旧value，仅保持现setter的truthy保留语义，不顺带修旧falsy行为）。候选view.customFilter是clip tree，response id/type/render必须与plan期望匹配（picture恢复类型分支见后）；合法空数据走实际空态。prepare数据/页/钻取/map本地派生，不调用共享setter。
4. mount非零尺寸candidate（unique suffix/key、inert/aria-hidden/不可见但有布局）；实际下层SFC消费PreparedQuery，不调用calcData。候选所有业务emit/共享tooltip/carousel/Store/全局channel/自动刷新/resize重画都guard，不以CSS代替；active旧实例保持。先prepare并等待下表真实ready，成功返回handle。定时ready/error处理在创建前注册；每一异步回调检查alive/isCurrent。
5. handle ready后重新比较operation/target/configGeneration/deep输入/context/A token+clipRevision/TTL/权限。任何不同或已unmount都dispose，无target写无dirty。与准备同时发生的普通刷新已使operation无效，不覆盖其最新状态。
6. **单个同步段，无await/noquery/nodraw**：先设局部`publishingOperationId=当前operationId`，仅在此同步段让target/config watcher识别本次内部写入而不自作废；finally清该标记。标记不跨await/timer，不屏蔽其它operation/会话清除或后续真实用户编辑。把canonical target.customFilter赋完整clone；将handle.binding.current设为 `{phase:'active',view:canonicalView,element:canonicalElement}`；wrapper chartExtRequest赋prepared clone；按metadata表调用适用setter并设置wrapper钻取/页等；activeKey与chartComponent ref切handle同一node/instance（不改key/suffix/id）；`snapshotStore.recordSnapshotCache('calcData',targetId)`一次。所有必要library初始化已完成，不在这里调用init/render/setContent。完成同步写入后解除该本地发布标记、结清当前operation/busy；随后返回/反馈成功并释放old node（既有unmount清理）；通知性业务事件在状态完成后发，不承担ready判定。
7. 非关键交互（轮播/自动滚动等）只在active启用，错误可显式降级关闭，不反向声称候选未绘；必要可失败adapter在prepare已就绪且回调仍phase guard。激活不是重新注册一个可能失败的必要renderer。后续编辑/刷新读取新canonical；undo/redo沿原snapshotChangeToView重算，属于后续独立query，计数不混到首次paste。

metadata预先计算/引用均独立，不将共享DTO给prepare setter。publish清单不可用“原子函数”替代；这里只保证准备失败不写旧态，不声称浏览器/Store任意异常的全局事务回滚。

## 按实际SFC列派生metadata与ready

共同wrapper：`chartExtRequest`本地ref、`dv.setLastViewRequestInfo(targetId,request)`；有query时按对应分支`setViewDataDetails(targetId,commitDto)`（实际存`commitDto.data`到canvasViewDataInfo，合并calParams并写canonical calParams）。copy不走此链，static-picture不凭空生成DTO/details。

| 实际组件分组 | prepare本地和真实ready | publish metadata与业务事件（仅对应原分支） |
|---|---|---|
| G2（G2Plot SFC） | chartData/curView仅候选；等待300ms timer实际body→queue→drawChart→instance.render→afterRender及必要adapter；每步reject显式failure；合法空data依现configEmptyDataStyle生成空态DOM并无实例也可ok；不能空态冒充draw测试 | details/calParams；drillFilters赋wrapper；map派生仅该组件本地（G2一般为空）；当`!res.drill && !res.chartExtRequest?.linkageFilters?.length`时`setViewOriginData(id,chartData)`并在publish后发`chart-data-change`。不新增setViewInstanceInfo（原G2无此写） |
| S2（3type） | normalizeChartData、totalItems、pageInfo/currentPageSize/actualChart独立；setupPage在candidate模式不setStore；draw前挂本次LAYOUT_AFTER_RENDER监听，await真实myChart.render():Promise<void>并见该layout、node连接/尺寸合法/isCurrent。destroy/disconnect导致fulfilled但无有效layout必须失败；finally仅清理不ok；不启动active滚动 | details/calParams；`!res.drill`时`setPureCanvasViewDataInfo(id,res)`（实际.data）；drillFilters；`setViewPageInfo(id,preparedPage)`；`setViewInstanceInfo(id,candidateS2)`，page与currentPageSize保留在同实例 |
| indicator | local chartData/styles；Vue error boundary捕获真实渲染错误；await nextTick并核该node实际指标值/格式、合法空态与DOM连接，无外库；正常data.series[0].data[0]为本例值；错误不ok | details/calParams与drillFilters。无origin/purecanvas/page/instance额外写；交互闭包读新canonical |
| L7/L7Plot（同G2Plot SFC） | map params仅候选；timer实际body+下节各真实map ready Promise；timeout30s，旧画面不动 | 同G2原分支details/origin/钻取；dynamicAreaId/scope/gadmName/country本地按原calcData请求drill extra预算。map SDK预热不属于target metadata |
| rich-text | local data/viewDataInfo/totalItems、field映射、myValue/内容净化；真正TinyMCE init+本次内容set/DOM确认，见后 | details/calParams；canonical `curFields=prepared fields`；仅按原initCurFields所写element.propValue.innerType/render赋值；最后业务`initCurFields-${id}`通知。准备时这些全部clone/local，不提前改canonical |
| picture-group | threshold关：原withInit静态选择，无query；开且dataset：真实query/type恢复、local data/viewDataInfo/totalItems/field映射/showUrl，真实img load+decode成功或明确合法空态；失败返回；本地timer存活检查 | 有query时details/calParams与canonical curFields；逐源码原有element字段若无写则不新增；static分支不写details/lastRequest、不伪造calParams；轮播/内刷新仅active。全分支snapshot仅成功采用一次 |

G2/S2严格mode是opt-in，不改旧calcData的默认callback/兼容错误语义。候选调度被取消/超时/销毁也必须settle失败，不能留下永不完成Promise。组件harness故障注入直接拦真实draw/render/afterRender或render Promise；纯helper绿不能替代真实SFC。

## C2地图：5类实际完成桥与精确最小写域

地图基础设施冷启动（getMapKey→mapStore缓存/window SDK配置/SDK脚本）在capture old-target投影之前预热，等成功后再capture；失败明确该type BLOCKED，不读取/输出secret。target-state oracle不将这些预热缓存伪称candidate纯局部；预热不改树/数据/画面，也不算query成功。query/候选过程中不能再隐式冷初始化写全局，未预热拒绝进入map prepare。

新增opt-in `filterPasteReady`通知参数（含isCurrent、done/fail，调用局部Promise）沿现drawOptions传到下列实际drawChart；或L7Wrapper新增只在此模式调用的`renderPrepared():Promise<void>`，内部订阅真实scene/layer；legacy render():void保持。**不假设L7Wrapper存在once/ready。** 创建前注册scene error、必要layer/plot事件/30s超时与dispose清理，done在本次全部必要配置callback完成之后。scene已loaded/未loaded两条都走相同layer集合，监听在addLayer/addToScene前挂，不能先add后once。回调body异常调用fail。

| type / 实际路径（panel/charts/map/） | 必需ready与具体修改接点 |
|---|---|
| flow-map / flow-map.ts | configList主流线、起终点文字、点等实际全部layer均inited；等待configList[0]的mapRendered及各qqMapRendered callback完成；L7Wrapper.renderPrepared跟踪该次configList集合，scene loaded仅允许addLayer，不算done |
| heat-map / heat-map.ts | HeatmapLayer inited后既有mapRendered/qqMapRendered完成；await本次单layer，axis配置不足不是合法空态 |
| symbolic-map / symbolic-map.ts | symbolicLayer与buildLabel推入configList的label layers均inited；tooltip popup/qq zIndex与本地必要配置完成；configCarouselTooltip候选阶段关闭/phase guard，不允许隐藏图影响old tooltip |
| map / map.ts | Choropleth真实loaded callback内mapRendered、attachMapLabels（函数当前同步draw完成再返回cleanup）、keyboard/click必要绑定完成；候选click闭包guard；missing areaId/无geojson分别是配置/资产失败，不能都ok。Point-only分支进入point-fallback.ts，须同样通知真实dot已add/loaded及配置完成 |
| bubble-map / bubble-map.ts | plot loaded callback与dotLayer add、dotLayer loaded及必要tooltip/本地初始化都完成；把dotLayer add/loaded订阅移到addToScene之前。point-only同point-fallback实际dot ready。不能plot loaded单独done |

最小额外路径：types/impl/l7.ts、必要opt-in options类型位置（impl/l7plot.ts或现AntVDrawOptions扩展）；上述5个map类、point-fallback.ts以及G2Plot SFC地图严格分支。label-layout.ts当前attachMapLabels首次draw同步完成可直接复用返回cleanup，除非实际证明需改则单独增域，不预先扩框架。空data且合法地图配置/资产可显式空态成功；缺container/零尺寸/缺axis/area/assets不得把`L7Wrapper(scene,[])`或undefined当空成功。每个ready/error/timeout都核当前candidate存活，迟到ready只丢弃已知实例，不提升。

## C3富文本：真实TinyMCE与越界副作用

DeRichTextView真正async Editor init是ready前置。candidate唯一tinymceId（资源ID不变+suffix），canEdit=false。setup在创建前注册init/本次SetContent/LoadContent或可用等价事件/error+timeout10s；init到达后才调用本次净化/assignment纯替换→setContent，取editor.getContent和editor body实际DOM核本次内容/占位值；随后nextTick仅用于Vue flush。SetContent可能同步触发，先监听再setContent；内容相等且本次完成才ready，禁止nextTick替代init。Vue error capture与TinyMCE init reject/error/timeout明确失败。

`fieldSelect-${element.id}`/`initCurFields-${id}`候选不注册公开channel，采用private suffix channel或纯本地调用；activate之后同key改canonical binding，注册既有业务channel的轻量handler时必须无可能失败的内容初始化。vertical-change带唯一tinymceId仍要alive/phase检查。discard/unmount注销所有当前candidate channel和editor listeners。

assignment拆为内容替换纯部分（沿现净化规则）与局部DOM整理。candidate watcher/viewInit/initCurFieldsChange/myValue watcher不得appearanceStore.setCurrentFont；字体仅读并用candidate局部style，active字体选择仍沿既有用户编辑意图，不能publish后偷偷补一次全局选择。resetSelect只作用当前editor DOM；jumpTargetAdaptor改为当前editor.getBody()/候选root.querySelectorAll('p')，不再document.querySelectorAll；其1s timer保存在此实例、回调先alive/isCurrent、discard/unmount clearTimeout。全应用p节点和old active onclick/outerHTML/appearance font从capture至失败及推进timer之后都不变。clone不是隔离论据。

新增必要路径仅rich-text/DeRichTextView.vue及其薄包装/类型，未证明需改则不扩TinyMCE库。不可用资产具体BLOCKED富文本C3，不阻C1。TinyMCE所有必要内容初始化都在publish前完成；同实例激活后使用canonical输入，不能setContent第二次才得到正确结果。

## C4图片组真实Attr与query分支

dashboard和dataV真实父路由把picture-group送Attr并隐藏通用Editor；因此在`picture-group/Attr.vue`的实际属性面板加共用小过滤操作区，view=`canvasViewInfo[curComponent.id]`，复用useChartFilterCopyMvp/同一内存服务与FilterTree（可新增小共用按钮组件，不能再造clipboard）。选中真实图片组时可见，并在DEV双开关/三态边界内工作；上传/轮播/threshold原区保留。

纯目录调用现`getFieldByDQ(tableId,id,{type:'table-info'})`拿独立dimension/quota目录，字段type同query adapter校准。**不得调用PictureGroupDatasetSelect.onDatasetUpdate**：它会清空重建轴并发calcData。只读目录请求不改变xAxis、目标配置、dirty或画面。需要时仅扩composable的directoryType参数给picture-group，普通type不变。

`QueryPlan`明确：threshold.enable=false走原withInit/static显示，不调用getData，不伪造DTO；query=0是该分支兼容期望，但不算图片组过滤数据验收。threshold=true且有dataset才needsQuery=true，clone request强制type table-info/render antv/resultCount1，成功后clone响应还原picture-group/custom，再消费prepared local映射。无dataset/无有效目录的动态过滤请求明确拒绝。图片组正向type证据必须用threshold开启、真实dataset、可断言图片选择映射，完成实际query/过滤结果/正常保存重开。静态分支单列compat，不代替该type正向。

现picture组自有轮播/innerRefresh timer在candidate不开启，discard/unmount清本实例timer，watch不会触发重复query；真实img先注册load/error再赋src，complete时检查naturalWidth并await decode（若浏览器支持），解码异常失败；无图片/无匹配按产品确有合法空态才ok。

## Cases、每type执行与立即交接

15个主ID沿用；r002 Cases08–11增加稳定子案与显式组件fixture、独立旧state投影和分轴事件。synthetic DTO只用于真实SFC故障harness，绝不称runtime golden；真实业务E2E调用getData/B真实服务。绑定现DB持久样本、SQL oracle（匹配14行、amount合计6761以及实际bar/line轴/聚合）；UI前传输own-key/undefined另采，不从DB/AX猜造。

Case07/14按49稳定type各做source与target：可采用轮转配对type[i]→type[(i+1)%49]并在每一步记录两端type身份，确保每type至少一次source/target真实UI、query、可见结果、正常保存、离开、重开；不要求2401次E2E。必须为不同轴/地理/富文本/图片配置准备合法可验证view；不能硬把同一bar配置改type当真图。12families只是优先排序/故障复用。任何type缺资产/入口/字段/ready/数据oracle保持其NOT_RUN/BLOCKED与具体下一步，不能删除或由代表PASS回填。若确认installed plugin应支持，显式追加分母/验收；未知不填0。

C1先行必要checks：真实SFC故障（draw/render/afterRender、S2 Promise+layout、indicator flush/error）、新旧metadata独立投影、同key提升+canonical后续编辑、一次paste query=1/snapshot calcData一次、undo/redo真实重算。RED应是现有真实入口行为不满足契约（如render失败仍吞掉/缺prepared消费），harness能成功加载再断言；缺新module/编译失败不是RED。已有MVP-UI-01首按钮可信RED不冒充C子案RED。

A/B无需等待本修订；r002Review通过共同handle/G2/S2/indicator后立即发C1精确admission并实施，继而走首条真实UI D链，C2/C3/C4继续独立完成，最后补足全部49。未完成的map/rich/picture仍是当前MVP义务，不迁后续。Builder不修改本Design/Cases或旧冻结文件；本lane未运行产品/DB/测试，仅作源码与材料读取及结构检查。
