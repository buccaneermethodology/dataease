# 气泡地图候选完成修复方案独立审查 r001

- reviewed_at：2026-10-29T08:45:05.664078+00:00；reviewer：`/root/resource_environment_reviewer`。
- 本实际实现缺陷交付物设计审查第 **1/3** 轮；不重开、不重置 C234 已耗尽的 3/3。
- snapshot：`bubble-map-ready-review-r001`；卡 canonical SHA `e9d0a36cabb7fc14a2eddf345dab04006e30e4953aabdeda5ec02017937767fd`；接收端验证 exit0/PASS，Goal+7 base refs共8项摘要在入口及报告写前均一致。
- 本轮严格只读源码、依赖及冻结证据；不操作UI、不执行构建/测试、不改产品或依赖。唯一新文件为本报告，写前不存在。

## 双裁决

**Design Freeze Validity：PASS WITH FINDINGS（范围及声明边界成立，事实和实施路线须修正）。Implementation Entry Readiness：FAIL。Overall Verdict：BLOCKED（当前方案不可直接进入生产 Builder）。**

方案识别的“Dot不发顶层add事件”在当前真实库调用链中成立，但并非完整原因。生产代码在addToScene前调用`errors(dotLayer)`，其中destroy注册会先访问尚不存在的Dot.scene。现方案保留这一步，单纯删除add等待无法修复。拟定RED也要求“仅bubble polygon超时”，与真实更早异常和点几何同类缺陷不符。应先修正方案及新测试合同，再用同身份RED/GREEN决定生产准入，不可用新plain emitter mock制造GREEN。

本报告不证明用户UI这次失败的唯一运行异常来源；错误在上层被统一折叠为paste_render_failed。这里直接证明的是依赖实现与拟定方案存在静态冲突。

## 全部发现

### B1｜P1阻断：addToScene前注册Dot destroy将访问undefined scene

证据链：

1. `bubble-map.ts:252–279`创建`new Dot(options)`，afterLoaded在addToScene前调用`filterPaste.errors(dotLayer)`。
2. `filter-paste-ready.ts:54–57`的errors先注册error，再注册destroy。
3. `@antv/l7plot/dist/esm/core/map/constants.js:7`把destroy列为SceneEvent；`core/map/index.js:206–225`的proxyEventHander对它执行`this.scene[type](...)`。
4. Dot继承Plot，options-only构造只调用Map构造；Map构造初始化flags/options/layerGroup，没有scene。`core/plot/index.js:138–144`的attachToScene才赋值scene，addToScene才调用它。
5. 相同逻辑存在CJS入口及当前Vite预构建chunk-KU372PWY.js:2939；不是仅源码分支推测。

因此`errors(dotLayer)`中的第二次listen会在挂载前抛错，ready.callback捕获后fail，后续add等待和addToScene尚未执行。现计划“保持error/destroy/loaded全部在addToScene前注册”不符合真实SDK。上层ChartComponentG2Plot.vue:1680附近catch统一返回paste_render_failed，冻结UI未记录原始异常，不能仅凭该reason判成30秒超时。

**必要修正**：把Dot局部error与scene生命周期订阅分开；已有view.scene error/destroy观察已先于view.loaded建立，可作为该共享scene的显式观察位置。Dot.loaded必须在addToScene前订阅，且不要为规避代理而手工提前赋值SDK内部scene。具体最小生产差异需要超出原“只删合并两行”的限定，在新设计中明确；不得静默改公共ready或所有地图框架。

### B2｜P1阻断：新测试只删add发射仍会延续事件代理盲区

旧`check.mjs:297–334`让Dot/Plot继承同一个plain Events；`417–430`的Dot没有真实Map.proxyEventHander，`addHadListeners`还要求add与loaded同时存在；`788–789、820–821、934–935`人为发add再loaded。该模型同时掩盖了不存在add与挂载前destroy代理异常。计划仅“修Dot事件模型、改成只发loaded”没有明确恢复on/off/once的真实分层代理，且固定“旧source仅bubble polygon预期timeout”会把真实业务异常排除成非可信RED。

**必要修正**：新runner须绑定实际package/ESM/CJS/代理常量与构造时序，用真实方法或有来源校验且保留关键语义的模块替身证明：options-only无scene；destroy代理scene；error/loaded为Dot自身emitter；addToScene先赋scene后可能同步loaded；Dot顶层不发add。旧源码的预期业务失败应允许准确的挂载前订阅异常，而非强迫timeout；缺依赖、编译错误依旧不能作RED。无add的等待缺陷应有单独可定位断言/事件合同，不能因先触发B1便声称两个缺陷都已运行复现。

需在新同身份测试中保留并明确列出：view loaded前pending、Dot loaded前pending、同步loaded（先订阅后挂载）、callback抛错、scene/Dot各自error、取消/卸载/超时、晚到loaded零callback副作用、重复loaded只完成一次、loaded后同turn及microtask失败、handle返回后metadata采用前失败、dispose后清理和元数据拒绝。旧扩展case不自动等于新SDK事件模型已覆盖；逐项给真实层级和注入位置。

## 非阻断发现、完整影响面及同类残余

### N1｜版本事实错误

安装包和前端package.json均为`@antv/l7plot 0.5.11`，不是方案写的“2.1系列”；其peer dependency `@antv/l7 ^2.21.0`不能当l7plot版本。main=`dist/lib/index.js`，module=`dist/esm/index.js`，两者均导出同源Dot→Plot。Vite `_metadata.json:925`指向dist/esm/index.js，预构建也保留相同proxy与attach逻辑。新设计应纠正并冻结所读依赖文件摘要。

### N2｜point-fallback有完全相同的两个缺陷

`point-fallback.ts:314–327`也先errors(Dot)、等待顶层add与loaded，再addToScene；它被`map.ts:188`和`bubble-map.ts:169`的点几何分支共同使用。因此至少涉及`bubble-map-polygon`、`bubble-map-point`、`map-point`。当前新方案只准改bubble-map.ts候选polygon分支，可以保持这个最小切片，但必须将point两例列为**已知旧缺陷/未修复**，不能写“其余地图全GREEN”。如要同轮修传播，先更新精确写域/计划并重新绑定，不能默默扩大。本发现不重开C234总体设计。

其他三个L7地图flow/heat/symbolic使用不同层/scene路径；map-polygon无需Dot，未发现同一add等待。未据此宣布这些类型全产品通过。custom区域目前受canPrepareFilterPasteMap拒绝，legacy与模板/移动/嵌入尚有各自未验边界。

### N3｜Dot.destroy并非仅释放Dot，测试必须识别共享scene

`bubble-map.ts:252–254`分别登记view.destroy和dotLayer.destroy；实际Dot继承`core/map/index.js:545–554`，destroy最终执行this.scene.destroy。挂载后两者是同一scene，会产生两次scene.destroy调用；挂载前Dot.destroy还会访问undefined scene。FilterPasteMapReady.release按登记顺序执行并吞清理异常，旧mock只计各对象destroyCount=1，无法表达共享scene调用或预挂载清理错误。

同时核实`@antv/l7-core/es/services/scene/SceneService.js:279–310`有`if (!inited)`早退且首次销毁会将inited=false，故**不能仅凭两次调用就宣称真实GPU重复释放或已经发生泄漏**。这是具体ownership/证据缺口，不是在本轮重新设计生命周期框架。新方案须说明谁拥有共享scene、预挂载资源如何释放，并在成功/失败/取消/超时/重复dispose中按实际共享scene身份记录清理；若选择保留现有清理作为已知残余，禁止宣称真实SDK exactly-once destruction通过。

### N4｜实际error/destroy层级与手动emit不是一回事

Dot.error/loaded走自身EventEmitter，Dot.destroy代理scene；`Scene.on('error')`不在l7-core SceneEventList，走mapService，不能假定任意layer错误会自动冒泡至Dot或scene。DotLayer底层事件还有自己的LayerEventList代理，顶层add与dotLayer:add不可混同。

另实际SceneService.destroy在emit destroy前调用removeAllListeners；Scene.on('destroy')订阅的也是sceneService。该源码顺序说明测试直接`.emit('destroy')`不能替代真实`.destroy()`的通知证据。本轮没有执行SDK destroy，也没有证明全部错误类型传播。新测试与报告应分别写“受控注入的已知error/destroy拒绝”和“真实SDK自主生命周期行为”；后者未知则保留，不将模拟事件提升为全层错误处理保证。项目自己的isCurrent/取消仍应在其已知边界正常生效。

### N5｜legacy同名add与事件时序仍有残余

legacy `bubble-map.ts:280–283`仍在addToScene后once('add')，并在后面once('loaded')配置carousel；它既等待未见由Plot发出的顶层add，又可能错过同步loaded。当前计划明确只修候选分支，可以不改legacy，但必须保留已知残余，不能称所有气泡地图ready统一修好。mapRendered本身仅添加CSS class，不证明GPU视觉帧完成。

### N6｜后置失败与清理证据须按新真实模型重验

共享ready在resolve后仍保留监听，fail会closed/release，SFC在await后与metadata getter再次check；静态上为“最后loaded以后、真正采用前失败”留有保护，不应在最小修复中拆掉。同步loaded可能发生在afterLoaded内部；外层view等待仍占pending，只有callback正常返回并done后才可resolve。callback内抛错会fail。新runner不能只测loaded前error，或只沿用旧plain-emitter的绿色历史；否则B2仍未关闭。

## 已检查无问题维度

- Goal仍38项，49类型及真实权限分母不变；新交付物来源于新的实际失败记录，不通过新命名重置C234设计3/3。
- 冻结事件记录目标旧树200，query响应三省1982/1243/1868，最终失败仍为旧树；可支持“查询有响应但准备失败”，不把该记录当已证根因或可信RED。
- 已检查完整候选调用链：ChartComponentG2Plot.prepareFilterPaste→renderPreparedMap→drawChart→ready.ready→采用前/metadata check；30秒ready与31秒外层超时现状清晰。
- Plot.onSceneLoaded等待LayerGroup所有层inited-all，onLayersLoaded先initComponents再emit loaded；Dot正常createLayers至少含DotLayer，也可能含label layer。等待Dot.loaded比scene loaded/void addToScene有更强局部初始化语义，计划不降级完成门槛的方向正确。
- loaded callback负责mapRendered、异常进入ready.fail的方向正确；仍需B1修复和B2实际语义测试才能准入。
- 生产范围小、不改第三方、保留冻结旧runner/fixtures与历史输出、新runner冻结后同身份RED/GREEN、随后真实UI/CSV/save-reopen的流程方向成立；本轮不因能更严格而新增框架或恢复旧通用工程。

## 未检查与原因

本 lane 未操作浏览器，未执行runner、TypeScript/lint/build或真实SDK/GPU运行，不生成RED/GREEN。未下载/安装依赖、未读取业务凭据。UI截图没有在本卡提供，仅读冻结事件与DOM描述；根因运行异常栈仍未观察。未做真实权限、全49类型、生产部署或最终KB/Dashboard收尾，均不由方案审查代替。

## 修正后准入预测与下一步

1. 在新设计版本纠正0.5.11与代理层级，解决B1，明确polygon最小修复与point残余；修订“只有timeout”的错误RED假定，补齐B2模型合同和N3清理声明边界。
2. 新测试冻结时绑定真实依赖方法/常量与生产写前快照；先获得准确业务指纹RED，再进入生产Builder；相同用例/输入/期望GREEN，编译或依赖失败不计业务RED。
3. 有界代码验证后，真实中国省份200→500复测query/CSV/完整树/画面，并明确点击保存与重开；记录双向来源和不同树失败旧态保持。点几何和legacy仍按原分母继续，不能从polygon成功推全类型通过。

预计B1+B2修正后可重新评估该最小切片的生产准入；当前不能直接按两行方案修改生产。当前报告完成的是第1/3轮审查，不是实现、独立运行验收或Goal关闭。下一轮必须沿用同一交付物累计预算。
