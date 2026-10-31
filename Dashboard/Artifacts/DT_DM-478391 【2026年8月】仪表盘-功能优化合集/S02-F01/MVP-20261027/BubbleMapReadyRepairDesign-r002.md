# 气泡与点几何候选事件修复设计 r002

同一实现缺陷交付物第2/3轮，承接r001全部发现。原C2343/3及图片3/3不重开；38义务、49分母不变。修复具体真实库契约冲突，不引入通用地图框架。

## 事实与范围差异
安装l7plot为0.5.11；peer l7版本不代替包版本。Dot options-only无scene，Map.proxyEventHander将destroy代理scene；error/loaded走自身emitter。不存在Dot顶层add；真实loaded在全部LayerGroup inited-all及initComponents后。旧runner缺代理并人工发add，历史GREEN不证明这些点。
本轮精确生产写域从bubble-map.ts扩大到point-fallback.ts对应候选分支，因为map-point/bubble-point完全同类。原两行限制取消并明确记录；不改共享ready、SFC、legacy正常分支、第三方包。

## 确定修复步骤
1. 两路径仍先创建Choropleth；其view.scene已存在，既有errors(view)、errors(view.scene)在view.loaded前观察共享scene。保留这些订阅与外层pending。
2. Dot创建后，不在挂载前调用errors(dotLayer)。仅listen(dotLayer,'error',error=>ready.fail(error || new Error('paste_map_error')))订阅局部error；wait(dotLayer,'loaded',()=>mapRendered(container))在addToScene之前。删除Dot顶层add等待。不得给SDK.scene手工赋值。
3. point路径候选不提前mapRendered；移到Dot loaded callback。legacy保留原位置与行为。view loaded回调内部随后所需label/fitBounds/键盘/点击安装仍必须正常完成；同步Dot loaded不会绕过外层view pending。
4. 候选局部共享scene只有Choropleth拥有。每路径在view创建后声明let dotLayer: Dot | undefined，登记一个cleanup闭包：先dotLayer?.off('*')清其局部loaded/error，再dotLayer?.removeFromScene()移其图层和控件，finally view.destroy()。之后才赋dotLayer=new Dot(...)，不再登记dotLayer.destroy。挂载前Dot layerGroup为空；removeFromScene不销毁共享scene。构造/挂载部分失败亦由已登记闭包清已知资源。ready.release幂等，SFC releaseMapPreparation把myChart置空的原机制保持。必须检验该公开方法实际实现与异常清理；若有未处理子资源不得以try吞掉后称无泄漏。
5. resolve后监听保留，已知error/取消仍可closed，SFC采用前和metadata getter仍check。真实Scene.destroy是否自主发到监听存在库限制，记录未知；不能用手工emit宣称自主事件完整。legacy add/carousel时序保留已知残余。

## 新测试合同及可信RED
新增check-dot-loaded-r001.mjs，旧check和冻结fixture不改。复用真实SFC及五地图类装载前缀，换Dot测试模型。绑定package.json、ESM/CJS Map/Plot及constants摘要：使用实际Map on/off/once/proxyEventHander的方法体与真实常量，在VM类继承受控Events运行（保留super），而非重写等价规则。实际Plot addToScene/attachToScene/render/onSceneLoaded/onLayersLoaded与LayerGroup流程使用提取的真实方法体，底层source/layer/WebGL设施是显式受控stub；其状态和顺序必须在测试输出说明。options-only无scene；addToScene先赋scene，scene loaded后LayerGroup初始化，所有层inited后发loaded；绝不人工发Dot顶层add。
固定三fixture：bubble-map-polygon/map-point/bubble-map-point；七fixture保留基础回归。每三fixture分别normal异步层、sync全部层、callback抛错、Dot局部error、scene受控error、scene受控destroy、timeout、unmount、晚到loaded、重复loaded、loaded同turnerror、loaded微任务error、handle返回后metadata前error、dispose后重放与重复dispose。标记哪些是受控注入/真实方法链，不将SDK替身升级为浏览器GPU。正常必须等view和Dot全部层；mapRendered抛错不能ok。共享scene destroy计1、Dot层remove与off计数核验，包括挂载前、部分构造和成功后刷新清理；不要求Dot.destroyCount1。
旧source同identity RED：准确记录pre-attach destroy代理访问undefined scene为预期业务失败；无add等待另以实际代理已挂载的直接production方法场景复现timeout或静态契约违反，明确其层次，不将更早异常冒充其运行复现。语法/依赖加载失败execution错误不得算RED。新增测试及依赖摘要freeze后，生产只在上述两写域修改；同测试SHA同fixture重跑GREEN，再旧回归对比（旧测试若期望虚假add，须报告模型过时，不改冻结输出）。

## 真实UI与结束边界
三类点fixture组件成功不等真实地图全通过。真实中国bubble200→500重测一次query、CSV三省、完整树即时相等、画面、显式保存/离开重开，并保留源角色。坐标地图UI另走已审地理fixture。失败保留旧态，未知错误传播、legacy、权限仍显式列为未验；不能靠本修复减少分母或称Goal完成。
