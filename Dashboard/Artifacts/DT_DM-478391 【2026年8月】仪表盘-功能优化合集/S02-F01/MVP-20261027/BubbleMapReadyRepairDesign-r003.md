# 气泡与点几何候选事件修复设计 r003

同一实现缺陷交付物第3/3轮，承接r001/r002全部发现。原C2343/3及图片3/3不重开；38义务、49分母不变。修复具体真实库契约冲突，不引入通用地图框架。

## 事实与范围差异
安装l7plot为0.5.11；peer l7版本不代替包版本。Dot options-only无scene，Map.proxyEventHander将destroy代理scene；error/loaded走自身emitter。不存在Dot顶层add；真实loaded在全部LayerGroup inited-all及initComponents后。旧runner缺代理并人工发add，历史GREEN不证明这些点。
本轮精确生产写域从bubble-map.ts扩大到point-fallback.ts对应候选分支，因为map-point/bubble-point完全同类。原两行限制取消并明确记录；不改共享ready、SFC、legacy正常分支、第三方包。

## 确定修复步骤
1. 两路径仍先创建Choropleth；其view.scene已存在，既有errors(view)、errors(view.scene)在view.loaded前观察共享scene。保留这些订阅与外层pending。
2. Dot创建后，不在挂载前调用errors(dotLayer)。仅listen(dotLayer,'error',error=>ready.fail(error || new Error('paste_map_error')))订阅局部error；wait(dotLayer,'loaded',()=>mapRendered(container))在addToScene之前。删除Dot顶层add等待。不得给SDK.scene手工赋值。
3. point路径候选不提前mapRendered；移到Dot loaded callback。legacy保留原位置与行为。view loaded回调内部随后所需label/fitBounds/键盘/点击安装仍必须正常完成；同步Dot loaded不会绕过外层view pending。
4. 不引入r002提出的off('*')/removeFromScene清理改造，保持现有view.destroy和dot.destroy各自已登记的cleanup。off('*')只清通配符；局部loaded/error由ready.release的具名off逐项清。共享scene可能收到两次destroy调用，实际SceneService幂等早退；这是既有N3未决项，不承诺exactly-once、GPU无泄漏或异步层移除失败恢复。当前修复不新增removeFromScene，因此r002的异步Promise丢失风险不引入产品。既有cleanup吞掉单项异常以继续清理，错误可见性不足亦保留。只断言已登记的两个句柄均尝试cleanup、重复dispose不重复调用cleanup；构造未返回/内部未发布句柄不在已证明范围。
5. 两路径dotLayer.addToScene(view.scene)紧接着增加候选专属检查：if (drawOption.filterPaste && !drawOption.filterPaste.check()) return。必须先检查再进行键盘/label/fitBounds/click等剩余副作用。同步loaded回调抛错、局部error或取消会关闭ready，返回后立即退出。legacy不改变。同步成功仍受外层view pending保护；此检查不能承诺SDK addToScene内部在关闭后自行停止，内部未知资源保留。
6. resolve后监听保留，已知error/取消仍可closed，SFC采用前和metadata getter仍check。真实Scene.destroy是否自主发到监听存在库限制，记录未知；不能用手工emit宣称自主事件完整。legacy add/carousel时序保留已知残余。

## 新测试合同及可信RED
新增check-dot-loaded-r001.mjs，旧check和冻结fixture不改。复用真实SFC及五地图类装载前缀，换Dot测试模型。绑定package.json、ESM/CJS Map/Plot及constants摘要：使用实际Map on/off/once/proxyEventHander的方法体与真实常量，在VM类继承受控Events运行（保留super），而非重写等价规则。实际Plot addToScene/attachToScene/render/onSceneLoaded/onLayersLoaded与LayerGroup流程使用提取的真实方法体，底层source/layer/WebGL设施是显式受控stub；其状态和顺序必须在测试输出说明。options-only无scene；addToScene先赋scene，scene loaded后LayerGroup初始化，所有层inited后发loaded；绝不人工发Dot顶层add。
固定三fixture：bubble-map-polygon/map-point/bubble-map-point；七fixture保留基础回归。每三fixture分别normal异步层、sync全部层、callback抛错、Dot局部error、scene受控error、scene受控destroy、timeout、unmount、晚到loaded、重复loaded、loaded同turnerror、loaded微任务error、handle返回后metadata前error、dispose后重放与重复dispose。标记哪些是受控注入/真实方法链，不将SDK替身升级为浏览器GPU。正常必须等view和Dot全部层；mapRendered抛错不能ok。逐个登记句柄cleanup最多调用一次；shared scene destroy调用两次可能是既有残余，不能断言scene exactly-once。使用真实EventEmitter 0.1.3实现或逐项等价断言（具名off、off星号、once与委托layer事件）；保留实际SDK方法来源。sync loaded+callback throw/error/cancel组合用例必须检查closed后没有新keyboard/label/fitBounds/click副作用。timeout缩放只证明受控失败与迟到不采用，不声称30/31秒真实竞争。
旧source同identity RED：准确记录pre-attach destroy代理访问undefined scene为预期业务失败；无add等待另以实际代理已挂载的直接production方法场景复现timeout或静态契约违反，明确其层次，不将更早异常冒充其运行复现。语法/依赖加载失败execution错误不得算RED。新增测试及依赖摘要freeze后，生产只在上述两写域修改；同测试SHA同fixture重跑GREEN，再旧回归对比（旧测试若期望虚假add，须报告模型过时，不改冻结输出）。

## 真实UI与结束边界
三类点fixture组件成功不等真实地图全通过。真实中国bubble200→500重测一次query、CSV三省、完整树即时相等、画面、显式保存/离开重开，并保留源角色。坐标地图UI另走已审地理fixture。失败保留旧态，未知错误传播、legacy、权限仍显式列为未验；不能靠本修复减少分母或称Goal完成。

## r002全部发现 disposition 与保留项
- R2-F01：撤回新removeFromScene方案及完整异常清理承诺；不引入该异步拒绝路径。N3既有双destroy和已知cleanup异常可见性仍未决，不阻挡修复挂载前异常与虚假add门；完整生命周期AC仍未通过。
- R2-F02：addToScene后检查closed/current并提前return；组合测试约束所有后续副作用。
- R2-F03：纠正off星号事实，保留ready具名off；测试绑定实际EventEmitter，不能继续使用不等价的super。
- R2-N01/N02：未返回构造句柄/SDK内部部分资源未验证；不新增remove清理路线，不声明无泄漏。
- R2-N03：不修改生产timer；缩放测试明确层次。
- r001 B1/B2/N1/N2/N4/N6按本轮步骤与新测试继续核验；N3及N5 legacy add/同步carousel仍未决。本轮缺陷修复不是全生命周期验收，原AC及残余在后续build继续，不删除。
