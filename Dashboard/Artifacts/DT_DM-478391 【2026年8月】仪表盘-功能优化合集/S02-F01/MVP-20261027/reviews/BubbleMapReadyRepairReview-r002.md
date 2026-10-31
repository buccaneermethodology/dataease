# 气泡与点几何候选修复方案第二轮独立审查

- reviewed_at：2026-10-29T08:57:04.444207+00:00；reviewer：`/root/resource_environment_reviewer`。
- 同一实际缺陷设计审查累计 **2/3**，余1轮；不重开C234或图片代码3/3。
- 卡canonical SHA：`e6399d2b029ffe80958c82d3537edb3e4a3f897d29e5ac21ab1a61c0feb5d613`；接收端validate exit0/PASS，Goal与7个base refs共8项摘要在写前仍一致。
- as_of_state：r002方案已写、生产两文件和共享ready/SFC均未改变；新测试未实施。本lane只读源码/依赖/方案，仅写本报告（写前不存在）。

## 裁决

**Design Freeze Validity：PASS WITH FINDINGS。Implementation Entry Readiness：FAIL。Overall Verdict：BLOCKED。**

前轮B1“挂载前destroy代理访问空scene”已由r002的设计改法关闭；B2真实事件契约、版本和同类point传播也已得到实质补充。然而新清理步骤把`off('*')`误认为清空所有监听，并把内部丢弃Promise的`removeFromScene`当作可由finally兜住的完整清理。还有同步loaded失败后继续运行外层afterLoaded的问题。它们都落在本方案明确承诺的部分失败/取消清理与同步loaded边界，须在生产准入前修正。

本轮不以“将来可以更严格”为由增加通用地图框架或全SDK异常恢复要求；下面只要求具体可达路径的事实正确、失败可观察和已知资源处理清楚。剩余SDK内部未知资源应明确保留，不得靠catch后宣称无泄漏。

## 前轮逐项 disposition

| 前轮项 | 当前结论 | 理由 |
|---|---|---|
| B1 挂载前destroy代理 | **设计层关闭** | Dot只订阅局部error和loaded，共享scene观察沿用view/scene，不手工赋SDK.scene；loaded在addToScene前注册。待可信RED/GREEN及UI确认实现。 |
| B2 假事件模型/错误RED指纹 | **大部分修正，仍须本轮R2-F01至F03精确化** | 使用真实Map/Plot/LayerGroup方法与常量、三fixture、异常分层、无add单独指纹成立；但受控Events未绑定实际off语义，清理链亦未进入真实方法合同。 |
| N1 包版本 | **关闭** | 正确为l7plot0.5.11；ESM/CJS/version与peer分离。 |
| N2 point同类遗漏 | **关闭** | 显式新增point-fallback.ts候选写域，涵盖map-point、bubble-map-point；取消两行限制属于可追溯实施差异，不删Goal AC。 |
| N3 共享scene重复销毁 | **单一owner方向成立，清理细节未关闭** | 去Dot.destroy并指定Choropleth唯一scene owner正确；removeFromScene的异步拒绝与off语义有R2-F01/F03。 |
| N4 错误/销毁传播层级 | **声明边界关闭** | 自主Scene.destroy通知限制保留，controlled error/destroy不冒充SDK自主事件，不承诺所有layer错误自动冒泡。 |
| N5 legacy残余 | **正确保留** | legacy顶层add和carousel同步时序仍未修；本方案不声称统一修复。 |
| N6 同步/后置失败 | **矩阵补齐，控制流仍有R2-F02** | 计划列出同turn、微任务、handle metadata前失败，但同步loaded失败后外层回调继续执行仍未定义。 |

## 全部阻断发现

### R2-F01｜P1：removeFromScene不会把异步层移除失败交给外层finally

r002第4步明确以`dotLayer.removeFromScene()`再finally `view.destroy()`作为部分失败资源处理。实际链条：

- l7plot `core/plot/index.js:164–172`：removeFromScene调用removeAllLayer、各control.remove和tooltip.destroy，未返回Promise。
- l7plot `core/map/index.js:290–292`→`core/layer/layer-group.js:91–98`：逐层调用layer.remove(scene)，清空数组；不保留结果。
- l7plot `core/layer/plot-layer.js:28–30`：remove调用scene.removeLayer(this.layer)，不return。
- l7-scene `es/index.js:200–203`：removeLayer为async包装，等待layerService.remove。
- l7-core `services/layer/LayerService.js:93–113`：remove先从scene拥有的layers列表splice，再layer.destroy、reRender。内部异常会变成Promise rejection。

因此底层destroy/reRender失败时，外层同步try/finally既看不到也无法消费该拒绝；层已从scene列表移除，随后view.destroy并不必然再收回该部分失败层。L7 BaseLayer.destroy在完成前可能因内部hook/service抛错，isDestroyed仅尾部才置true。方案所述“异常清理、不能吞掉后称无泄漏”尚无具体可执行步骤，现测试只计remove/off次数亦证明不了。

**修正要求**：选择一个在当前两文件局部可实现的清理政策，明确可等待/可观察的返回边界、资源owner、异常继续清理顺序，以及异步拒绝如何被消费并记录。不得把对removeFromScene包try/catch当作解决，也不要为了消除失败把拒绝转换为成功。可以调整对公开API的选择或显式保留有证据支持的SDK限制；不得继续承诺未经证明的“所有部分失败无泄漏”。新测试必须实际经过相关remove/事件语义，注入一层移除拒绝或销毁故障，核无未处理Promise、其余已知资源仍尝试清理、错误/残余如实可见。旧源与修复测试角色清晰，不扩大到任意SDK故障自动恢复。

### R2-F02｜P1：同步loaded失败关闭候选后，afterLoaded仍继续安装资源

r002把mapRendered放入Dot.loaded callback，并要求同步loaded与callback抛错都受保护。真实共享ready的callback捕获异常后调用fail并返回，不重新抛出；因此如下计划内序列成立：

`afterLoaded → dot.addToScene → 同步Dot.loaded → mapRendered抛错 / 已知局部error → ready.fail执行清理 → addToScene返回 → afterLoaded继续后半段`。

bubble-map现后半段会disable键盘并注册`dotLayer:click`；point-fallback现后半段会attach labels、fitBounds和注册交互。dot/scene已被清理，之后新增的委托监听可能不在已经耗尽的清理表中；此时最终返回false仍不能等价“失败后零新副作用”。外层view pending保证不会过早resolve，但不自动停止这些剩余语句。

**修正要求**：在addToScene返回后、进入其余副作用前明确检查候选仍current/open；同步错误、回调失败、取消造成closed后立即退出，并保持已获得资源的晚到清理。旧legacy不得套用新的candidate检查。把`sync loaded + callback throw`、`sync loaded + error/cancel`作为组合case：失败、共享scene释放符合政策、之后不安装click/labels/keyboard等新效果；不能只分开测“sync成功”与“异步callback失败”。同turn/microtask/metadata前错误矩阵继续保留。

## 其他全部发现及修正建议

### R2-F03｜P2、必须纠正事实和测试模型：off('*')只清通配符

已读安装的`@antv/event-emitter 0.1.3` ESM/CJS实现。`off(evt)`无callback只执行`delete this._events[evt]`；`off('*')`仅删除通配符频道，不清loaded/error，更不清`dotLayer:click`委托到真实layer的监听。Map.off通过proxyEventHander调用super.off，并未改变这个语义。

共享ready.release后续确实有各listen的精确off清理，所以不能据此单独断言目前自有loaded/error永久泄漏；但它们不是由方案第4步的off('*')清除。r002“先off('*')清局部loaded/error”的描述与测试oracle必须修正。不要直接改成`Dot.off()`：Map.proxyEventHander会对undefined名字走name.includes而报错。可利用既有精确listener cleanup，或明确订阅事件/回调并用SDK支持的命名off，不凭空调用错误的“全清”。

新runner将真实Map方法挂到受控Events上时，仍可在super这一层失真。必须消费真实EventEmitter方法/实现或对受控实现做有来源的等价断言；尤其覆盖off('*')、具名off和委托layer事件，不只冻结Map/Plot字节。

### R2-N01｜构造部分失败的可观察边界须准确

options-only Dot构造只建立options和空layerGroup，无scene；赋值后attach阶段已有闭包能追踪Dot，这是改善。Choropleth构造在登记cleanup闭包之前执行；若new Choropleth内部创建scene后直接抛错，调用方没有返回句柄，当前闭包不能回收这个未知实例。Dot.createLayers也可能在创建部分内部layer、尚未发布layerGroup前失败。此类SDK构造内部资源没有本轮运行证据，不得写“任何构造部分失败都已清理”；区分“已获得句柄的已知资源”与“构造未返回/未发布的SDK内部资源”。不要求本轮为未知句柄新增SDK框架或改第三方。

### R2-N02｜removeFromScene的正常路径与故障路径不可混算

正常已初始化layer：scene.removeLayer先移除再destroy，BaseLayer通常有isDestroyed守卫；control.remove以存在性检查执行；tooltip.destroy会解绑交互、清emitter、移marker和销毁组件。单一Choropleth owner因此可以减少重复scene.destroy。挂载前Dot空layerGroup、未建controls/tooltip，removeFromScene通常不会碰scene。但LayerGroup.addTo可能先赋scene并只加入部分layer，removeAllLayer仍遍历全部成员；未初始化layer的destroy并无“未初始化就直接成功”承诺。新增测试必须区分正常、预挂载、部分加入、移除异常，不能以正常路径通过覆盖故障路径。

### R2-N03｜既有计时测试不能升级为精确30秒边界

旧runner把>=10000毫秒timer缩为80毫秒，原30秒ready与31秒外层会映成同长；复用前缀的timeout用例只能证明受控超时失败/晚到无采用，除非新runner明确保留逻辑顺序，否则不能声明已实测30秒与31秒竞争或真实墙钟边界。r002未修改生产timer，保持原行为即可，不必为了本缺陷扩大为计时框架；报告准确标替身即可。

## 已检查无问题维度

- 两个生产候选分支写域明确；不改shared ready、SFC、第三方、legacy、冻结旧fixtures。修复真实事件契约而非减少38项或49类型分母。
- 原挂载前destroy订阅已移除，Dot.error与loaded留在自身emitter；view/scene观察的订阅时序未降级。未要求手工赋SDK.scene。
- Polygon和point的mapRendered均在真实Dot.loaded才执行；该事件经LayerGroup全部inited后、initComponents完成发出，不退化为scene loaded或addToScene返回。
- 保留outer view pending、30秒ready与31秒外层、isCurrent、取消、元数据采用前检查；生产无改动，现阶段不声称GREEN。
- 新测试要求真实SFC和五地图类、三受影响fixture及七地图基础回归、受控错误层级说明、same identity RED/GREEN。旧虚假add runner输出保留并明确过时模型，不篡改历史。
- 前轮失败UI冻结为实际query有响应但候选失败，未当作唯一根因；root后续地理fixture独立工作不进入本报告结论。
- 完整读取r002、前轮报告、冻结失败记录、两生产路径、shared ready、SFC；复核实际Map/Plot/LayerGroup/PlotLayer/EventEmitter、Scene/LayerService/BaseLayer及tooltip清理链。当前ESM/CJS关键规则一致，沿用前轮确认的Vite依赖入口。

## 未检查、同类残余和准入预测

未运行源码/SDK、runner或UI，不模拟/写入依赖；所述失败路径是直接源码约束与计划内时序分析，不冒称已产生RED或GPU泄漏复现。真实SDK自主error/destroy传播、未返回构造句柄资源、legacy时序、地图完整视觉质量和权限保持原未验边界。未检查或修改最终KB/Dashboard/Goal收尾。

R2-F01与R2-F02修正后，R2-F03事实及super emitter契约一并落实，预计可进行第3/3轮最终设计准入审查。建议最后一轮提交前由Builder候选作者逐项自查本报告全部分支，避免只修首个错误。随后先冻结新测试并拿准确业务RED，再按批准两文件最小改动、同身份GREEN、独立代码/运行证据；本报告不授权跳过这些门。

当前不能按r002进入生产Builder。并行不依赖本阻断的真实地理fixture工作可继续；本次方案审查阻断不意味着整个Goal停止，也不重置旧交付物轮次。
