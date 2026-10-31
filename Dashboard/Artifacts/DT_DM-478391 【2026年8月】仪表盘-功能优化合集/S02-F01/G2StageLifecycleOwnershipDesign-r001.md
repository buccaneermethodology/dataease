# G2 渲染实例所有权实施设计 r001

## 目标与交付物身份

交付物 `S02-F01-G2-STAGE-LIFECYCLE-OWNERSHIP`，第1/3轮设计输入。用户授权先完成界面MVP，再补齐复杂场景；原10项Goal AC、26项must-have、16项产品义务和最终谓词保留。该实现单元提供界面MVP所需的按实例资源所有权，承接产品接线终审 CFPI-002/010/011 的一部分工程依赖；不重开产品接线r003，不修改其Design/Cases，不声称关闭其全部findings。

具体交付是新的 `g2-render-attempt.ts` 与现有 `ChartComponentG2Plot.vue` 的真实活动G2全量渲染/cleanup接线。它让返回的G2实例及其adapter cleanup属于一次尝试，迟到/卸载/渲染失败时可靠释放，空数据返回显式empty结果。后续双host stage可复用同一所有权对象；本交付不创建Copy/Paste UI、隐藏host、query stage或Store事务，不授予产品Paste入口准入。

## 当前源码基线

`ChartComponentG2Plot.vue` 的 `renderG2` 用g2RenderQueue串行调度，以g2RenderVersion和chartComponentUnmounted判定时效。full render会清除tooltip和四类adapter、destroy旧myChart，随后await drawChart；得到实例后配置tooltip/字体/大数据/tiled legend/assist，await render和afterRender，再安装slider/pagination并回放联动。cleanup目前分别在全局变量中。autoRefresh的updateData会更换assist adapter。resize使用myChart；unmount释放所有资源。

`line.ts:drawChart`在无行数据时返回undefined；有数据时new G2Chart、line legend state、point click、TooltipCarousel与extremum事件在返回前建立。Carousel以字符串containerId作实例key，必须按该ID释放。其他G2类型沿用同一活动入口，不修改其drawChart内部逻辑。

## 接口和状态合同

新增文件为 `core/core-frontend/src/views/chart/components/views/components/g2-render-attempt.ts`。不新增依赖；泛型只要求实例具有destroy方法，render由回调提供。

- `createG2RenderAttempt({create,isCurrent,setup,render,afterRender,initialCleanups})`返回Promise，结果为 `{status:'ready',scope}`、`{status:'empty'}` 或 `{status:'stale'}`。create返回实例或undefined；在create前已经stale则不调用create。create/安装/render/afterRender抛错时，释放可见的所有权资源后原异常继续reject。
- scope有只读instance，`replaceCleanup(key,cleanup)`、`removeCleanup(key)`、`dispose()`。key唯一。replace先运行旧cleanup一次，再登记新cleanup；相同函数可以作为新生命周期的cleanup被再次登记，但同一登记只执行一次。remove先删除登记再调用，重入安全。
- dispose先标closed，逆登记顺序清理全部资源，再destroy返回的实例一次；某cleanup/destroy抛错不阻止其余清理，错误作为数组返回给调用者记录。重复dispose返回空数组，不再次操作实例。dispose之后登记cleanup立即执行一次，不留资源。
- initialCleanups在create前登记，用于container tooltip/resize队列清理；不依赖已返回实例。create返回undefined时释放initialCleanups并返回empty，不调用setup/render/afterRender。
- 每个await(create、render、afterRender)之后以及setup之后重新isCurrent；失效则dispose返回stale。setup/afterRender获得scope并只操作scope.instance，不读取另一次尝试的全局myChart。ready之前不向活动指针发布新实例。
- helper只保证create已返回实例的destroy，以及initialCleanups可见资源的释放。renderer内部new Chart后尚未return就抛错而未提供实例句柄的泄漏，不由此helper伪称解决，保留为完整stage后续缺口。

## 真实组件接线

保留现有300ms防抖、g2RenderQueue、version、autoRefresh updateData及非G2渲染分支。新增activeG2Scope。full render开始时dispose此前scope；此前非scope持有的myChart沿既有分支destroy，随后myChart=null。将现有drawChart→公共配置→render→afterRender的相同顺序传入helper，局部chartInstance固定为scope.instance。initialCleanups以本containerId关闭carousel和出队resize。adapter的返回disposer登记为assist/tiled/slider/pagination四个key；不为不会返回disposer的既有tooltip/theme API编造cleanup，依赖chart.destroy和container cleanup。

只有ready且当前version仍有效时赋activeG2Scope、myChart并回放联动；empty保持myChart=null和既有空数据UI，不新增查询或保存；stale不发布、不回放。autoRefresh只对当前activeG2Scope替换assist disposer，避免旧异步完成覆盖新scope。现有清理函数改为删除scope对应key。unmount先置unmounted/递增version/清调度，再dispose active scope；pending尝试在await返回后自清理，resize和intersection仍按组件归属disconnect。非G2分支保持原实现。

不改变calcData的chartData、drill、details、origin、chart-data-change副作用。完整stage commit与这些状态的同步仍是未解决产品义务；不得以本helper接线通过冒充其原子发布已实现。

## 验证、RED和准入

冻结机器Cases为 `G2StageLifecycleOwnershipCases-r001.json`，身份G2OWN-001..018。先添加消费生产TS的独立runner，以缺失module作为构建前基线只记MODULE_NOT_IMPLEMENTED，不能冒充可信RED；再使用同一公开API的受控缺陷stub，确认测试执行完毕且预期断言fingerprint失败，并保留该后补control的真实性质。若Skill要求可执行生产RED，则在正式Builder前安排只含接口且明确throw NOT_IMPLEMENTED的生产stub及精确admission，运行同identity cases到断言失败；缺模块/编译失败不算可信RED。

Builder必须独立委派，排除冻结Design/Cases，绑定当前Goal/Context/Review/Topology/action/target的admission。实现后runner必须18/18同identity GREEN、定向ESLint、组件编译。集成核验须至少检查真实组件调用该helper、full render/autoRefresh/unmount调用链和空数据边界。Node doubles仅证明资源/异步调度合同；实际G2 line/legend/tooltip/resize浏览器行为另须真实renderer验证，未执行则明确NOT_RUN，不能提升界面MVP验收。

本交付Review分别裁定Design Freeze及有界ownership Builder Entry；产品Copy/Paste入口、真实权限和全Goal仍NOT_READY。所有源变动须重基线，最多3轮/本交付物。
