# 普通折线构造阶段资源所有权设计 r001

## 当前交付与冻结边界

工程单元：`S02-F01-LINE-STAGE-CONSTRUCTION-OWNERSHIP`，新单元设计第 **1/3** 轮。本文件及 `LineStageConstructionCases-r001.json` 仅为独立审查候选，尚未冻结、未执行 RED、未给 Builder 准入。它精确承接已独立收尾的 G2 ownership 工程遗留 `G2OWN-027` 中 **普通 line.drawChart 获得 G2 实例后、返回前** 的应用资源异常安全，以及共用 Carousel 构造/销毁的必要前置；不重开旧产品接线、事务、所有权 Design r003，不将此新预算用于旧交付物第 4 轮。

原始用户授权仍为先界面 MVP、后复杂场景；10 项 Goal AC、26 项 must-have、16 项产品义务及完整完成谓词保留，`Scope Delta: none`（仅实施顺序调整）。影响 AC-F01-Q014、AC-S02-03/08/09 的必要工程前置，不关闭这些完整 AC。真实 source READ、多用户拒绝/撤权/组织隔离仍 `BLOCKED / NOT_RUN`。该工程单元不需要新增权限 API，也不把 standalone/admin/mock 当真实权限证据。

接收端实际复验 canonical Card `fa201efc21c805a1aa4c82e50d5667392ec0bdca6e6d589bf980078058283588` 为 pass；Context 原字节 `87e01f95f860ca4291484a913fe9712fc8a35305de283070cb87b866e1df48fc` 结构验证 exit 0，20 项 required-read 原字节摘要全部匹配。源码绑定逐项保存在 Cases 的 `authority.source_refs`。当前 dirty 工作区有大量既有变更；本 lane 仅新增这两个文件，不归属或改写其它变更。采用项目 SGE kernel 与卡片绑定的 SP-010 设计路由；父 Orchestrator 负责实际拓扑、测量记录、独立审查与 Stop Gate，不以本候选代替它们。

## 真实调用链、故障面与边界

1. `line/line.ts:102–152`：空数据返回 undefined；clone/initOptions 后 `new G2Chart`；`bindLineLegendState` 三次 on（common.ts:112）；setupOptions；handleChartDashboardHidden；configureDataRefresh（g2.ts:782，WeakMap 按 G2 实例持有）；options；point:click；`new Carousel(...).start()`；extremumEvt；return。当前没有 catch，helper 在 create 返回后才接到实例，不能回收本段失败。
2. `Carousel.ts:91–136`：listenerTooltipShow 将 tooltip:show hook 挂在 G2 实例；销毁旧容器 owner；setCarouselData/parse/host/停止其它 view；init→addEventListeners；**最后才 cache.set 和 ensurePageScrollListener**。addEventListeners:474–486 顺序为 document visibility、host enter、host leave、wrapper hover-leave、new Observer、observe。cache 前任何失败都不能由 destroyByContainer 找到 this。
3. listenerTooltipShow（barUtil.ts:981）的 chart hook、legend hooks、point handler、extremumEvt（extremumUitl.ts:230/441–449）的 afterchangesize/afterrender/beforedestroy 均由 **G2 实例** 持有；line 在失败时销毁 G2。Carousel 不擅自解绑共享且以 WeakSet 去重的 tooltip:show hook。extremum 首次 render 尚未发生时不会启动布局 RAF；若未来在 drawChart 内主动 render，必须重新设计此边界。
4. 当前 destroy:1410 调 stop→clearTimer/hideTooltip，再移监听、disconnect、dequeue、无条件 cache.delete、releasePageScrollListener。cancelTooltipScroll/一个 clearTimeout/一个 remove/一个 emit 早抛可阻断后续；frame 取消没有纳入最终 destroy；背景引用在 remove 后才清；监听销毁时重新查询 wrapper，可能解绑新 target。旧实例再 destroy 可删除同容器新 owner。
5. 全局 startQueue 存实例引用；clearTimer 会 dequeue，destroy 又 dequeue；startQueueTimer 是共享节流 timer。ensurePageScrollListener 在 add 后置 ready；add 若已生效再抛，ready=false 会漏清。releasePageScrollListener 只有 cache 空才释放，但 remove/clear 前未消费 flags/timers。resizeQueue 是 SFC 按容器调度的独立任务，不属于某个 Carousel 构造资源，**不在 Carousel.destroy 中按容器删除**，否则可能删除新 owner 的任务。

无句柄边界明确保留：`new G2Chart` 自身尚未返回便失败时，应用没有 G2 handle，不能承诺清理库内部已分配对象。IO constructor 返回前的 opaque 内部异常同理；本合同验证的是已取得 IO 后 observe 的失败清理。资源 API throw-before-effect 时只证明已尝试且错误可见，物理残留保持 Unknown/明确列出；不保证任意第三方 destroy 一定成功。不处理后续 Promise/render 回调、静态 paused/resume/closeEnlarge 延迟任务的全面取消，也不处理后续 installer 返回 disposer 前的全部 partial allocation；G2OWN-027 全部义务继续开放。

## 最小实现切片与精确错误合同

生产允许变更仅 `line/line.ts`、`G2TooltipCarousel.ts`；不改 G2DrawOptions、SDK、公共 chart type、依赖、SFC、既有 helper。测试允许新建 `tests/line-stage-construction/check.mjs` 及有限具名 double 模块。无新依赖、无运行时测试开关。

**Line 的局部构造 owner。** 保留所有正常语句及顺序；`new G2Chart` 取得 handle 后立即进入 try，`let carousel` 存本次直接引用。将链式 `new C(...).start()` 拆成 `carousel = new C(...)` 后 `carousel.start()`。return 为所有权移交点：成功不清理，交给现有 caller/helper。catch 先仅销毁本次 carousel 引用，后尝试 newChart.destroy 各一次，最后 `throw originalError`。constructor 抛时赋值未完成，局部 carousel 仍 undefined；它自己的 catch 必须先完成 partial cleanup，line 只负责 G2。严禁 catch 内 destroyByContainer，它可能找不到 partial this 或命中新 owner。

业务异常合同固定为 **重新 throw 同一原对象/值**，不加 wrapper、不替换 message、不转 Error；即使 throw 非 Error token 也保真。所有 cleanup 错误与业务异常分通道，清理错误不能遮蔽业务异常。

**Carousel 公开 destroy 保持 void/throw 形态。** 内部一个 collector 收每次 cleanup 的原始 throw 值（不去重）；所有动作完成后，若有错，先按尝试顺序 `console.warn('G2 carousel cleanup failed:', error)` 输出第 2..n 个原对象，然后 throw 第 1 个原对象；无错返回 undefined。单错误没有内部日志。调用 destroy 的 constructor/line catch 消费这个首错后仅 warn 一次，再 throw 业务原错。因此业务失败时复合 warning 严格顺序为 **C.cleanup[1:] → C.cleanup[0] → G.destroy 错误**，业务原错只在 rejection 通道。直接公开 destroy 的调用方收到首个原 cleanup 对象，其余错误只走 warning；没有同一 occurrence 在日志和 wrapper 双重上报。相同错误对象被两个 primitive 抛出仍是两次 occurrence，必须保留两次；禁止集合化或聚合去重。日志器自身失败 best-effort 吞掉，不递归记录、不改变业务/清理首错。

私有 `attempt(fn)` 逐动作捕获，私有 finalizer 只在最外层 stop/destroy 结束执行一次。destroy 调内部 stopResources 而非会提前 throw 的 public stop，避免嵌套 finalizer 重复通道。独立 public stop 也可复用同一内部动作，保持正常暂停/隐藏顺序，失败时等所有适用动作尝试后再处理错误。已 destroyed 的 public stop/start 对 owned resources 无操作，避免遗留延迟 stop 再触碰新活动 host；不声称已取消那些延迟任务。

## 构造、清理与重入的执行合同

**安全构造。** chart/newChart、计时器对象、空 listener ledger、空 frame 数组、isDestroyed=false、isPaused/index/其它基础字段必须先初始化，再调用任何可能抛错的 setCarouselData/listenerTooltipShow/旧 owner destroy 等可抛代码。原 listenerTooltipShow→替换旧 owner→setData/eligibility→init 的健康顺序保持；数据分组不重写。整个副作用构造段 try/catch，catch 调 this.destroy，消费首 cleanup 错误后原样 throw 构造错误。tooltip 关闭、禁用、不支持类型、无 host 仍返回惰性 this；JS new 忽略原 return null，不应错误声称返回 null。它们的 start 是 cache identity no-op；销毁时空账本不得访问 undefined chartElement。

listener ledger 每项固定 `(target,event,handler,capture)`，**在 addEventListener 调用前 push 注册意图**，因为 add 可能生效后才抛；失败后尝试 remove 无副作用的未成功注册项是允许且必要的。wrapper 必须保存 add 时原 DOM target；不能 destroy 时再 getTooltipWrapper。Observer handle 赋值后才 observe；observe 失败仍断开已取得 handle。

缓存仍只在 init 成功后登记。登记前若 cache 当前有不是本次 this 的 owner（例如旧清理/observe 同步重入构造了更新实例），生成 code 为 `G2_CAROUSEL_OWNER_REPLACED` 的 Error，走本次自清理并失败，不覆盖新 owner。错误实例本身由当次生产 guard 创建；oracle 校验 code 和 throw 引用与 constructor catch 所见同一对象。cache.set 生效后失败也用 `cache.get(container)===this` 清理。保留构造替换旧 owner 的既有策略，旧 owner 已销毁时不承诺恢复；这不是 stage/active 双 host 事务。

**资源取得前登记、释放前消费。** destroy 首句检查 isDestroyed，随即置 true/paused、不执行；取消 pendingDataUpdateAction。任何可重入外部清理之前取出待释放句柄并清空字段/账本。listener 数组 splice 成本地快照；frame 数组换空；timers/cancel/background/observer 清空；缓存在入口只比较 this identity后立即摘除，尾部不再按container删除。所有释放尽力继续，各项原错误独立收集。

同一 owner 的释放投影固定如下（无资源的项不调用外部 primitive；queue.remove 为一次固定尝试）：

1. 在第一项可重入外部清理前，若cache.get(container)===this立即delete摘除owner；若已是新owner则不删。然后dequeueStart(this) 一次；取出取消器后调用；依次 clear interval、nextItem、hoverLeave；逐个 cancelAnimationFrame；取出 carouselBackground 后 remove。
2. 若曾进入有效 start，执行 tooltip:hide、按类型 unselect/column restore/selected=false/unselected=false、unhighlight、原有交互背景清理。每个独立 emit/setState/background removal 均 attempt，不以一个大 stop/hide try 代替。partial constructor 未 start 不做 UI restore。每步前检查 host owner：cache 是 this 或无 owner才允许触及共享视觉；一旦重入发布新 owner，跳过后续共享视觉步骤。直接持有的旧 background/旧 target/旧 observer仍清理。`clearInteractionBackgrounds` 使用同一 collector 模式逐项处理，不再由其原 catch 另行 warn；正常 hover/stop 调用保持原行为。
3. 原 target 的 listener 逆取得顺序：wrapper hover-leave → host leave → host enter → document visibility；再 disconnect Observer。remove 某项失败不跳过余项。
4. 缓存owner已在入口消费，尾部不再按container delete；这样旧tooltip:hide重入创建的新owner能登记。若已有新owner，不按容器dequeueResize、不切换新wrapper。多次destroy无第二次清理。
5. cache 空才释放全局 scroll listener。**先消费** ready=false/pageScrolling=false、scrollEndTimer/startQueueTimer 引用与 startQueue 快照，再执行 remove scroll→clear scrollEndTimer→clear startQueueTimer，各自 attempt。确保重入新构造产生的新 listener/timer不会被旧尾部再清；cache 非空保留共享资源。ensurePageScrollListener 在 add 前置登记意图，add 后抛仍可被构造 rollback释放；若有现存共享 listener则不重绑。

stopResources/clearTimer 私有 collector 路径保证 cancelTooltipScroll 抛错后仍清三个 timer、frame、listener/observer/cache。清理原语 throw-before-effect 后不重试同一 owner 已消费句柄，防重入和重复副作用；oracle明确残留而不是虚称零泄漏。UI reset失败与内存/DOM owner释放分开记录。

## 调用方兼容核查

本次 `rg` 找到 10 个生产 new Carousel 入口：普通 line、area、bar、pie、rose、mix/mix-group/mix-stack/mix-dual-line，以及 common_antv.configCarouselTooltip 的 afterrender callback。全部仍接受三参数 constructor、随后无参 start，不接收新返回值；支持类型、eligibility、数据分组、hover/轮播、正常 start 节流逻辑保持。仅普通 line.drawChart 加应用级 G2 rollback；不能据此宣称其它 drawChart 返回前异常安全。非 line 的共用构造 rollback/安全 destroy 是本次有意影响，须用 bar/area/pie/mix四种实际 Carousel class 形态作兼容控制。

所有外部 destroyByContainer 调用点：SFC ChartComponentG2Plot.vue:748（禁用并restoreHover）、822/834（owned attempt cleanup）、923（legacy redraw）、1563（legacy unmount）；common_antv.ts:2906（tooltip关闭）。另有 constructor 内替换旧 owner/旧禁用分支；后两禁用分支可在已有旧 owner替换成功后保留无操作或删重复调用，不能误删更新 owner。所有调用方均忽略返回值；没有依赖 boolean/数组。公开签名不变，首清理错误仍直接 throw 原对象，新增的后续错误只日志，健康路径返回 undefined。SFC helper/dispose/unmount 已有 catch；禁用/legacy/common原来允许 cleanup 抛出，现在仍可能抛，但会在必要释放全尝试之后抛，不静默转成功。restoreHover只有 destroy成功才执行；destroy失败保持原来不会切换的行为。

其他公共调用：g2.ts updateData get/begin/finish；SFC get/enqueue/dequeueResize；layer.ts/de-screen paused/resume；DeFullscreen suspend/resume；UserViewEnlarge/MultiplexingCanvas closeEnlargeDialogDestroy。它们不依赖 destroy新返回值；static fullscreen/resize业务不改写。所有 `destroy()` 内部入口（closeEnlargeDialogDestroy及旧实例替换）仍按原首错失败通道；幂等与same-owner cache guard使旧引用不再删除新实例。健康 stop与数据刷新不改语义，故障释放的有限变化由本候选明确承诺。

## 真实生产模块 RED harness 与 55 个 Cases

新增 runner 目标 `core/core-frontend/tests/line-stage-construction/check.mjs`；本设计 lane **没有创建或运行它**。使用已安装 esbuild.transform 将磁盘 **完整** line.ts、G2TooltipCarousel.ts、line/common.ts 分别编译 CJS，在同一新 vm realm 通过显式 require allowlist装载。不得摘录方法、复制 drawChart/constructor/destroy/stop/clearTimer，不能将生产方法替换为测试实现。仅三个观察spy允许透明包裹dequeueStart、restoreColumnSelectionAttributes、clearInteractionBackgrounds：记录入口后以原this/参数调用保存的生产原函数一次，保留返回/throw，不注入故障；Cases明确其标记是Carousel私有helper而非虚构G2方法。被测constructor/start/destroy/stop/clearTimer本体保持未包裹。每例全新模块静态状态；记录输入原字节/编译字节摘要。转换只做 TypeScript去除/模块转换，不插入测试分支。

明确注入 seam：`@antv/g2.Chart` 为带显式 on/options/getContainer/getContext/emit/setState/destroy 的 NamedChart；`../../../types/impl/g2.G2ChartView` 为只提供构造/name/configureDataRefresh 的具名边界；`setupOptions` 在测试实例上设具名依赖 double（这是本合同允许的配置边界，不是被测控制流）；common.ts整体实编，真实 bindLineLegendState 的三次on由 NamedChart某次on故障；util.parseJson、common_antv的renderer/hidden、extremumEvt、barUtil listenerTooltipShow/wrapper/helpers、scheduleTooltipCarousel、useI18n 均采用 **列明导出** 的 double。lodash使用已安装实际库。禁止未知属性自动返回函数；未知模块或导出立即 execution_error。生产 Line构造模块底部的 registerChartRefreshAdapter 用具名 no-op记录，不能漏掉模块初始化。

Carousel使用真实类，DOM document/host/wrapper的具名 Target记录实际 handler/capture，每个add可选择先真实登记后throw；Observer double产生具体O、记录observe/disconnect；fake timer/frame registry返回唯一具体handle。全局 Map/queue及 TS-private资源字段通过编译后的 bracket access仅做 Cases声明的安排/只读快照，不替换生产控制流。setCarouselData失败由实际specialChartTypes调用的NamedChart.encode抛出；getChartElement由NamedChart.getContainer抛；checkStopOnViewChange由其它既有owner真实stop中的具名Chart.emit抛。cache.set fault可在该实例Cache的set方法上精确包装原Map.set；不能替换所有Map或使用万能Proxy。wrapper替换是W_old/W_new两个对象。故障发生在 add/observe/emit/getContext 等具体边界，不靠编译失败。

default健康start让生产 next执行并取得共享cooldown TQ；非S场景 scheduleTooltipCarousel具名依赖不产生独立取消资源；S场景明确取得S。start失败例在生产next的getContext抛，处于cooldown取得前，避免虚构setTimeout未返回handle的可清理能力。extremum具名依赖允许先在G真实事件表安装部分hook再抛；只证明line owner清理边界，不验证extremum算法自身语义。每个fixture都记录初始owner/资源、fault stage、精确cleanup顺序/次数、主错误引用、逐通道warning原引用、return/reject、cache/queue/global与未释放资源；无聚合去重。

Cases `LSC-001..055` 覆盖：首个setup失败RED；empty/成功/第三方无handle；三段legend、hidden/configure/options/point；Carousel五个前置阶段；四项partial DOM add、IO ctor/observe/cache/全局scroll；start/extremum partial；四种惰性分支；重复dispose；scroll/timer/frame/background/emit/listener/observer/G2复合错误；cache old/new及两类同步重入；共享全局owner/timer；bar/area/pie/mix；wrapper target identity；public destroy首错/额外warning；同原错误两次occurrence；非Error业务值；no-host清理；取消器重入；旧owner释放失败；restoreHover；三个timer分别失败。Cases给出的ID/安排/trace均完整展开，runner不能根据当前source调整expected。

首个可信RED必须是 `LSC-001: chart_destroy_count expected=1 actual=0`：NamedChart成功返回，真实Line执行到setupOptions抛E，当前source没有catch所以漏destroy。编译/import/unknown export/超时/frozen mismatch属于execution_error，不能算RED。保存stdout/stderr/exitcode、每例assertion failure与execution error分离、绑定runner/Cases/source/编译bundle摘要；独立Validator需重放首例与constructor-before-cache例，确认不是模拟drawChart。`--mode red`仍执行所有case，不在首失败停；兼容控制不能因红例存在被跳过。

## 审查、准入与后续验证路线

独立Design Review一次穷举检查本文件/Cases/真实源码、全部发现与已检查无问题维度。最多3轮，仅修当前单元合同内问题；第3轮残余逐条保留，不开r004、不重置旧预算。审查通过后由控制面冻结最终Cases原字节及canonical case identity，再给**只限runner的新建准入**；不得给生产Builder先行绿灯。runner RED由独立Validation确认 contract valid / execution ok / fingerprint exact及无错误通道丢失；必要修runner必须保留旧RED历史并重新绑定。

生产Builder入口需要精确 execution_admission_v1，绑定当前Goal、该单元Contract/Cases/Design、独立Pre-review、Context、Topology、已验证RED与action/两个canonical source targets；源摘要漂移先rebaseline。Builder write exclusions包含所有冻结Design/Cases/Goal/旧r003/旧reviews/现有helper/SFC/SDK/de-xpack/KB/依赖。实现后同runner同Cases identity GREEN，55例完整执行；不得调整期望追绿。

独立实现Validation核对完整本单元diff与当前原始目标，复跑55例及现有所有权helper23/重入10/SFC6+输入8回归，定向ESLint与模块编译；这些是控制流工程证据。再用现有真实G2浏览器夹具观察line成功、hover/legend、重复render/resize/卸载和开启/禁用Carousel，补实际line renderer的fault cleanup观察如环境可行，明确主代理/独立来源及未覆盖项。无需新增依赖、整包构建、数据库或真实权限环境。现有前端旧TypeScript/依赖声明兼容基线问题继续区分，不能用bundle成功冒充整包ts:check。

收尾仅允许有界工程结果：原10/26/16、真实权限、stage独立host/adopt/abort、query/Store原子提交、产品Copy/Paste/保存重开全部保留pending。G2OWN-027的本次子范围是否关闭须独立验证，不关闭其后续installer/第三方无句柄/完整stage义务。下一必要独立工程入口仍是string host→独立容器、显式empty stage、双host、active/stage queue/resize/unmount/adopt-abort，再冻结query/Store隔离；不得以本单元名字替换旧事务合同要求。
