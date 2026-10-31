# C2 普通刷新完成后清理交接修订设计 r002

状态：候选待本设计第2/3轮独立审查，未准入Builder。原C2实现终轮BLOCKED与三轮预算均不改。本修订只响应新设计r001 F001–004，不是原实现第4轮。38项完整验收与49类型分母不减，真实权限未验证。

## 精确范围与残余

处理普通刷新已经完成、myChart已经稳定替换后的两入口清理；不处理卸载跨异步draw完成后重新赋myChart（原设计F004），不声称所有异步/所有清理顺序、真实SDK/GPU或浏览器可达性通过。旧ubo错误也不从本设计自动关闭。

选择明确的**组件通用非activeG2Scope释放操作**，承认它影响地图及共用此分支的G2 legacy等图表；不再声称仅地图局部。activeG2Scope原独立dispose分支保持。myChart是本SFC独占的当前wrapper引用；不向外部registry或Store加所有权。

## 最小实现方向

1. 新组件局部releaseCurrentChart：保存myChart到局部，先myChart=null，再对保存wrapper执行destroy。无catch，不改错误类型或错误上报。
2. prepareFilterPaste.dispose现有非activeG2Scope分支以及onBeforeUnmount现有对应分支调用它，顺序和其它timer/adapter清理不变。handle的alive仍先false；onBeforeUnmount现有cleanup捕获上报边界保留。
3. releaseMapPreparation若当前引用等于mapPasteInstance，先myChart=null，再调用cancelMapPreparation。这使准备期旧实例的清理入口也看不到仍受组件持有的引用。取消ready仍沿用原桥内部release的既有catch语义，不新增吞错或把其称为传播。普通新实例不等于mapPasteInstance，不能提前清空或销毁。
4. 不改地图类、ready helper、metadata、Store发布/查询/保存和G2 active scope。若实现需要越界则停止并登记，不顺带重构。

## 可执行oracle与反例

新的Cases-r002保留原28个ID/正常实例计数，并在**实际SFC编译的测试入口**只读暴露myChart getter（仅harness transform，不改产品expose）。每个SDK wrapper destroy入口同步调用此getter，记录refBeforeDestroy。禁止只测复制出的helper。准备期wrapper和正常刷新wrapper分别断言该值===null、最终ref===null，重复两个入口计数不增加。原r001只看最终null的不足由这些同步采样关闭。

增加七地图×两个清理顺序的正常新wrapper同步throw用例。throw点选普通刷新后当前wrapper，调用计数先加1并捕获调用前ref，然后抛固定sentinel。unmount先发生时：现有cleanup记录sentinel一次、handle不再throw/重试；handle先发生时：第一次handle.dispose向调用者抛同一sentinel，后续unmount不再次记录或重试。老strict instance早已正常释放一次。严格桥自身资源throw仍由原helper既有catch处理，仅作为旧通道对照，不冒称其错误已上报。

共享调用点非地图对照：真实SFC的G2 legacy无activeG2Scope和activeG2Scope分别覆盖正常/throw、两个入口顺序。legacy用真实组件调度/draw路径及显式SDK double，getter仍取同一SFC；不能仅用map wrapper冒充G2。active分支保持disposeActiveG2Scope先activeG2Scope=null、myChart=null，再scope.dispose。实际g2-render-attempt.dispose先closed=true并取出instance/cleanup，runCleanup把destroy同步错误放Error[]返回；组件reportG2CleanupErrors记录console.warn一次，handle不向外抛该SDK sentinel，第二入口不重试。此期望来自当前实际源码，不是待后续猜测。

所有case各自独立加载；副作用query/Store/发布均0。destroy调用次数只证明调用协议，不证明vendor资源释放成功。正常refresh已完成是硬前提，延迟draw交错显式NOT_RUN。

## 推进与预算

设计r002和案例仍是candidate；本设计交付物第1轮已有报告、第2轮独立审查将查全部修订，不重开C2原实现。设计冻结后先落harness/driver与摘要，可信RED必须execution0且按具体断言指纹失败，不能预写精确失败总数（新增同步前置/throw探针在写前可能同时失败）。Builder不能改冻结case期望；源码仅上述SFC局部改动。GREEN复用全部case身份，完整原maps317、renderer/tooltip/paste回归和定向lint/局部类型基线差异。新窄修复实现有独立交付验证预算，不改变原C2 r003历史结论，不借新包复审原整包。

未观察或仍开放：真实浏览器child独立卸载、真实SDK/GPU、旧ubo根因、卸载跨异步draw、普通非paste地图所有生命周期；权限、49类型完整验收、P1/Goal完成。

## r002入审前采样细化

strict桥释放直接调用scene/plot.destroy，不保证调用L7Wrapper.destroy，因此同步采样必须插在**实际SDK seam的主要scene/plot destroy入口**以及正常当前wrapper.destroy入口，读取同一SFC getter。断言窗口限定本case teardown（及普通刷新首次release旧strict owner）期间；不把正常draw中的layer重建或内部资源销毁都错误要求为myChart=null。每个distinct主要scene/plot身份计数与对应wrapper身份关联，主资源与内部layers不混合计数。同步throw注入正常刷新后wrapper入口（不是ready内部catch的scene内部），并明确包装层/SDK层调用计数各自记录，不把throw前终止当SDK成功释放。
