# G2 渲染实例所有权实施设计 r003

## 目标与交付物身份

交付物 `S02-F01-G2-STAGE-LIFECYCLE-OWNERSHIP`，第3/3轮设计输入。用户授权先完成界面MVP，再补齐复杂场景；原10项Goal AC、26项must-have、16项产品义务和最终谓词保留。该实现单元提供界面MVP所需的按实例资源所有权，承接产品接线终审 CFPI-002/010/011 的一部分工程依赖；不重开产品接线r003，不修改其Design/Cases，不声称关闭其全部findings。

具体交付是新的 `g2-render-attempt.ts` 与现有 `ChartComponentG2Plot.vue` 的真实活动G2全量渲染/cleanup接线。它让返回的G2实例及其adapter cleanup属于一次尝试，对create已经返回的实例，迟到/卸载/渲染失败时按合同释放，空数据返回显式empty结果。后续双host stage可复用同一所有权对象；本交付不创建Copy/Paste UI、隐藏host、query stage或Store事务，不授予产品Paste入口准入。

## 当前源码基线

`ChartComponentG2Plot.vue` 的 `renderG2` 用g2RenderQueue串行调度，以g2RenderVersion和chartComponentUnmounted判定时效。full render会清除tooltip和四类adapter、destroy旧myChart，随后await drawChart；得到实例后配置tooltip/字体/大数据/tiled legend/assist，await render和afterRender，再安装slider/pagination并回放联动。cleanup目前分别在全局变量中。autoRefresh的updateData会更换assist adapter。resize使用myChart；unmount释放所有资源。

`line.ts:drawChart`在无行数据时返回undefined；有数据时new G2Chart、line legend state、point click、TooltipCarousel与extremum事件在返回前建立。Carousel以字符串containerId作实例key，必须按该ID释放。其他G2类型沿用同一活动入口，不修改其drawChart内部逻辑。

## 接口和状态合同

新增文件为 `core/core-frontend/src/views/chart/components/views/components/g2-render-attempt.ts`。不新增依赖；泛型只要求实例具有destroy方法，render由回调提供。

- `createG2RenderAttempt({create,isCurrent,setup,render,afterRender,initialCleanups})`返回Promise，结果为 `{status:'ready',scope}`、`{status:'empty'}` 或 `{status:'stale'}`。create返回显式{kind:instance,instance}或{kind:empty}；意外undefined按G2_RENDER_INSTANCE_MISSING失败；在create前已经stale则不调用create。create/安装/render/afterRender抛错时，释放可见的所有权资源后以G2RenderAttemptFailure携带原异常引用和cleanupErrors reject。
- scope有只读instance，`replaceCleanup(key,cleanup)`、`removeCleanup(key)`、`dispose()`。key唯一。replace先运行旧cleanup一次，再登记新cleanup；相同函数可以作为新生命周期的cleanup被再次登记，但同一登记只执行一次。remove先删除登记再调用，重入安全。
- dispose先标closed，逆登记顺序清理全部资源，再destroy返回的实例一次；某cleanup/destroy抛错不阻止其余清理，错误作为数组返回给调用者记录。重复dispose返回空数组，不再次操作实例。dispose之后登记cleanup立即执行一次，不留资源。
- initialCleanups在create前登记，用于container tooltip/resize队列清理；不依赖已返回实例。create返回显式empty时释放initialCleanups并返回empty，不调用setup/render/afterRender。
- 每个await(create、render、afterRender)之后以及setup之后重新isCurrent；失效则dispose返回stale。setup/afterRender获得scope并只操作scope.instance，不读取另一次尝试的全局myChart。ready之前不向活动指针发布新实例。
- helper只保证create已返回实例的destroy，以及initialCleanups可见资源的释放。renderer内部new Chart后尚未return就抛错而未提供实例句柄的泄漏，不由此helper伪称解决，保留为完整stage后续缺口。

## 真实组件接线

保留现有300ms防抖、g2RenderQueue、version、autoRefresh updateData及非G2渲染分支。新增activeG2Scope。full render开始时dispose此前scope；此前非scope持有的myChart沿既有分支destroy，随后myChart=null。将现有drawChart→公共配置→render→afterRender的相同顺序传入helper，局部chartInstance固定为scope.instance。initialCleanups以本containerId关闭carousel和出队resize。adapter的返回disposer登记为assist/tiled/slider/pagination四个key；不为不会返回disposer的既有tooltip/theme API编造cleanup，依赖chart.destroy和container cleanup。

只有ready且当前version仍有效时赋activeG2Scope、myChart并回放联动；empty保持myChart=null和既有空数据UI，不新增查询或保存；stale不发布、不回放。autoRefresh只对当前activeG2Scope替换assist disposer，避免旧异步完成覆盖新scope。现有清理函数改为删除scope对应key。unmount先置unmounted/递增version/清调度，再dispose active scope；pending尝试在await返回后自清理，resize和intersection仍按组件归属disconnect。非G2分支保持原实现。

不改变calcData的chartData、drill、details、origin、chart-data-change副作用。完整stage commit与这些状态的同步仍是未解决产品义务；不得以本helper接线通过冒充其原子发布已实现。

## r001全量发现的r002处置

R001/R002：本版固定唯一RED流程与下方可执行案例描述，移除“若Skill需要”的分支。R003：create返回显式 `{kind:'empty'}` 或 `{kind:'instance',instance}`，普通undefined抛 `G2_RENDER_INSTANCE_MISSING`；组件仅在 `chart.type==='line' && Array.isArray(chart.data?.data) && chart.data.data.length===0` 时自行返回empty，drawChart非空分支返回undefined必须失败。对其它G2 renderer，保持原有空态判定方式并仅将有实例返回的分支接入scope，不把其它类型undefined新解释为空数据。

R004：见异步当前身份合同。R005/R006：按用户“未决问题记录后继续设计/build”的授权明确本单元边界：只管理create已返回实例与已登记disposer；不会修复或保证任意renderer/adapter在return disposer前的内部partial allocation。当前原路径也没有这项保证；本次refactor不得引入新的任意factory或把它包装成异常安全安装API。G2OWN-027记录具有稳定owner的遗留义务：完整stage renderer后续必须修复Line.drawChart partial construction、tiled/pagination installer partial failure（owner=后续G2 stage产品实施单元，authority=CFPI-002）。这些风险继续阻断完整stage/失败原子性验收；不用于否定本returned-instance ownership单元的可实现边界，也不能被后续引用为已关闭。R007：见唯一cleanup错误上报。R008：见资源归属表。

## 异步当前身份、错误与接线合同

新增helper仍名createG2RenderAttempt，scope增加readonly closed字段、`isCurrent()`由该次捕获版本和组件unmounted闭包决定。`replaceCleanup/removeCleanup/dispose`均返回Error[]，cleanup旧项抛错时仍移除旧项并完成新项登记，异常不逃逸破坏剩余清理。同步cleanup是唯一支持的disposer形式；不承诺等待异步cleanup。ready/stale/empty结果带 `cleanupErrors`；所有内部自动dispose以及replace/remove产生的cleanup error还通过唯一可选onCleanupErrors(errors)同步通知一次。若通知函数抛错，该通知错误被保留到结果错误数组，原业务异常保持主reject，不因此改写；失败路径用 `G2RenderAttemptFailure` 承载originalError和cleanupErrors，cause/原对象引用可核对，组件catch分别输出primary和cleanup errors。success后手动scope.dispose由调用者观察返回错误，helper不重复通知。

组件每次async活动捕获 `{version,scope,instance}`，统一 `isActive= !unmounted && version===g2RenderVersion && activeG2Scope===scope && myChart===instance && !scope.closed`。autoRefresh调用updateData前捕获当前scope/instance；其callback在替换assist disposer前核验isActive；await结束后回放前再次核验。若false只结束本轮，不触碰其它scope。

Resize task在入队时捕获版本/scope/instance，在出队后第一次options/forceFit前检查isActive，await forceFit之后在replay前再检查。unmount同步使所有闭包失效；已在forceFit内部执行的库工作不能由应用取消，明确不承诺物理中止它，但unmount后应用代码不再调用options/forceFit/replay。unmount中先失效并清队列，再dispose；已经开始的库Promise仅允许settle，不发布。full-render替换同样先使旧版本失效、清待执行resize，随后dispose旧scope并myChart=null。新scope在helper ready且版本有效之后一次性发布；若helper返回到发布间已失效则dispose该scope，不回放。

## 资源归属与顺序

| 资源 | owner | full-render替换 | unmount |
|---|---|---|---|
| g2Timer/finishG2Schedule | Vue组件 | 取消上一调度/完成其promise，版本递增 | 先unmounted+version，再clearTimer并完成schedule |
| g2RenderQueue | Vue组件 | 串行；每项开始复核version | 不物理取消进行中的库Promise，所有后续应用操作须guard |
| g2ResizeTimer/container resize queue | Vue组件 | 清timer、dequeue待执行项；已出队回调guard | 与full render相同，执行中Promise settle后不回放 |
| Carousel注册表/内部timers/observer | 对应container的图表尝试 | scope initialCleanup调用destroyByContainer | scope cleanup先于instance.destroy；container唯一且不并发复用 |
| assist/tiled/slider/pagination返回的disposer | 对应instance scope | 逆登记顺序一次调用 | 同左；旧scope不引用新scope变量 |
| create已返回的G2 instance | 对应scope | disposer后destroy一次 | 同左，即使前面cleanup失败也执行 |
| ResizeObserver/IntersectionObserver | Vue组件 | 不disconnect，继续观察同一DOM | 在finally分别disconnect，即使dispose抛错也执行 |
| L7/nonG2 instance | 原组件路径 | 原逻辑 | 仍按原逻辑destroy，不交给G2 scope |

component scoped cleanup只注册当前已返回的真实disposer。所有cleanup错误可观察并继续；不能添加全局catch忽略。key登记顺序由实际setup调用顺序决定，replace先清旧项不改变其它key顺序。

## 唯一可信RED、Builder和验证流程

1. 这轮设计预审可准许**RED准备**，不直接声称主Builder READY。RED准备的写范围仅新生产helper的最小API stub、测试runner及fixture；精确execution admission分别绑定这些target，独立Builder身份执行。stub导出createG2RenderAttempt，函数返回rejected Promise，其唯一错误码为 `G2_RENDER_ATTEMPT_NOT_IMPLEMENTED`，编译/导入必须成功；不修改ChartComponentG2Plot。
2. runner路径固定 `core/core-frontend/tests/g2-render-ownership/check.mjs`，命令在frontend根目录 `node tests/g2-render-ownership/check.mjs --mode red`。runner实际bundle/import生产TS，Cases r002中的每个helper identity都调用它。只把该确切NOT_IMPLEMENTED码投影成本identity的合同断言失败（`G2OWN-xxx: NOT_IMPLEMENTED`），所有其它模块/编译/异常为execution_error。RED有效条件：contract_valid=true、helper_cases_executed=23、assertion_failures=23、execution_errors=0、首fingerprint=`G2OWN-001: NOT_IMPLEMENTED`；不得将缺模块/编译失败算RED。component案例暂为NOT_RUN，因为RED准备禁止改组件；不得因此声称集成RED通过。
3. 有界主Builder入口只在上一步原始日志、Cases和stub摘要经独立Validator核对后，消费新的source/组件action-target admission。主Builder只能替换stub和接线组件，不改冻结Cases/Design/runner oracle。helper同identity GREEN需23/23；fixture/implementation mode不允许换expected。component新增实际脚本测试G2OWN-C01..C06，基线真实组件不含helper时应以 `G2OWN-C01: HELPER_NOT_CONNECTED`失败；该组件RED用实际SFC脚本编译/执行，不能只搜索字符串。
4. 组件测试使用项目已安装@vue/compiler-sfc与esbuild编译实际script setup，以依赖注入的chartView/Store/observer/timer双件驱动公开renderChart及卸载hook，运行真实组件控制流；不复制renderG2源码。源码stub只替代外部G2渲染或网络边界，不代表真实库/鉴权通过。component全部测试接线前可信RED、接线后6/6 GREEN，helper23/23 GREEN，定向ESLint与SFC编译通过后才给实现candidate。
5. 真实G2 line/tooltip/legend/resize通过独立Vite页和已有CUA浏览器检查；无后端/数据库。不安装Playwright。真实浏览器尚未运行则明确NOT_RUN，生命周期行为candidate与真实渲染验收分列。权限环境缺失不阻断本单元，但仍阻断真实权限AC及完整Goal。

日志持久化在本S02 planning/evidence/G2OWN-RED-*.{stdout,stderr,exitcode}.txt和G2OWN-GREEN-*，身份/摘要另记同目录G2OWN-ExecutionEvidence-r001.json。三轮上限适用于此交付物；旧r001、产品r003及失败结果保留原字节。


## r002发现的最终接线裁定（本节取代任何宽泛的“所有G2迁移”措辞）

**R009：只迁移普通line。** owned分支的精确条件是 `chart.type === 'line' && chartView.library === ChartLibraryType.G2`。其它G2类型完全保持当前full-render/updateData/undefined空态legacy分支。不是将其它类型的undefined送入helper后再猜测empty。普通line只有明确 `Array.isArray(chart.data?.data) && chart.data.data.length === 0` 才返回 `{kind:'empty'}`；其它line输入仍调用原drawChart，如果返回undefined是missing-instance失败。shared renderG2保留debounce+串行queue，在合法本轮项内部选择owned line或原legacy路径；不会修改renderL7/renderL7Plot函数或图表类型实现文件。

切换legacy→owned line：按现有顺序清旧carousel、四类legacy adapter并destroy旧实例，myChart=null，然后创建owned尝试。owned line→legacy：先使旧version失效，读取并记录scope.dispose返回错误，再activeG2Scope=null、myChart=null，然后运行原legacy路径；不能让legacy再次destroy owned实例。owned line→owned line同样先释放old scope再创建new。clearG2SliderAdapter/clearG2LegendPaginationAdapter仅在有activeG2Scope时删除该scope的keys，legacy时保留原变量cleanup；owned setup不再写legacy cleanup变量。autoRefresh/resize在owned line时使用scope身份guard，legacy类型保持原逻辑。

**R010：SFC harness与观测 seam固定。** runner为同目录 `component-check.mjs`，始终读取磁盘实际ChartComponentG2Plot.vue，用已安装@vue/compiler-sfc.compileScript编译。@babel/parser对其输出解析，仅在setup函数唯一的 `return __returned__` 之前注入一个只读getter `__g2OwnershipSnapshot`（返回myChart、`typeof activeG2Scope==='undefined'?null:activeG2Scope`、g2RenderVersion、chartComponentUnmounted）。仅新增测试可观察性，不能改变既有分支、await、函数体或赋值；找不到唯一锚点即execution_error。esbuild编译同一script，source import和getData/chartView/store/observer/timer依赖用具名、显式module doubles注入；Vue ref/reactive/computed使用真实Vue语义，生命周期hook收集后由测试触发。禁止兜底万能Proxy、源码字符串通过、复制renderG2控制流或为green替换被测SFC。测试只调用实际setup返回/defineExpose的calcData/renderChart与登记的mount/unmount/observer hooks，getter只读比较，不通过它给私有状态赋值。

C01先通过真实calcData+已完成render建立old实例O（origin请求/响应fixture确定），后发第二次普通line数据给new实例N，create/render/afterRender分别defer。baseline getter在drawChart resolve而render未resolve时可观察myChart===N，违反“新实例ready之前不得发布”，fingerprint固定为`G2OWN-C01: HELPER_NOT_CONNECTED`。GREEN同一SFC/runner/case应观察该阶段myChart===null（O已清理），afterRender完成后myChart===N且scope.instance===N，O destroy一次。此为实际行为失败，不检查helper字样存在性。

C02先建立O并令updateData待定；另一次full-render调用使version递增（N尚排队）。触发old callback，断言无assist安装。完成old update后N完成；再次触发保留的old callback，断言N的keys/cleanup不变、无old replay。所有计数记录instance IDs。C03分别模拟queued resize后unmount与forceFit已经开始后unmount；只断言应用调用不在失效后开始/回放，不把库内Promise物理取消当要求。C04建立O并使资源`assist:O`清理抛具有identity `cleanup-assist-O` 的错误，再触发unmount；日志应包含该对象，其他资源清理/destroy以及两个observer disconnect仍完成。

**R011：新增C05替换错误观察。** 建立O，令`assist:O`的cleanup抛`cleanup-assist-O`，再full-render N；必须恰一次console.warn或唯一错误callback包含此对象、O剩余清理与destroy继续、N最终ready、observer不在替换路径被断开，helper不重复上报同次手动dispose。C06为legacy兼容与empty子矩阵：area、mix-dual-line、bidirectional-bar合法undefined仍按原行为结束不新增missing-instance错误；普通line显式空数据不调用drawChart，普通line非空+undefined报告missing-instance且不发布。不是用一个line场景代表其它类型。

## 最终候选、RED与各层准入声明

本交付物第3/3轮；helper Cases与r002的23条data对象逐字节canonical相同，r002准许的helper-only RED准备可独立完成，不因本版component案例细化改其oracle。RED准备仍严格限已签发精确admission下的stub/runner，main helper与component写入各自需要独立Validator核对RED及新的精确admission。

Reviewer请分别裁定：①helper返回资源所有权合同冻结/仅helper实现条件准入；②普通line实际SFC接线合同冻结/条件准入；③其它G2、G2OWN-027、stage/query/Store/权限/全MVP持续不被覆盖。任一层不足不能虚称pass，也不能将其它层已明确保留的产品义务反向伪作本helper scope内新缺陷。第3轮后不r004，不改名重置本单元预算；全部发现以编号保留。
