# C1 实现独立 Validation 第1轮

**结论：NEEDS_REVISION（需有限修复），本轮有1项确定P2阻断 C1V-001。** C1共同接线与三个renderer的大部分局部实现及聚焦检查成立，但候选G2仍能经图库内部共享tooltip路径影响候选外DOM/旧hover，尚不满足准备失败保旧及候选事件隔离。疑似S2分页问题C1V-002经真实Store引用语义复核已撤销，不要求修码。C2/C4已获本轮前后摘要一致后的写入释放，这不是最终C1通过。

## 1. 审阅对象、身份与时点

- reviewer：`/root/g2_closeout_reviewer`；独立于C1 integration/renderer两个Builder。本轮为**实现交付物第1/3轮**，不重置UI设计已用第3/3轮预算。
- `reviewed_at`：2026-10-27T05:55:49.399775+00:00；`snapshot_id`：`S02-MVP-C1-INDEPENDENT-VALIDATION-r001`；`as_of_state`：Topology r438、c1-final-snapshot-r001及绑定证据。
- Card canonical SHA：`24547610a7d4de3ad9db5c55e01853cbc2b0d4c051ed3e03b59e9f32b41786fa`；Context字节SHA：`641befdec5307efebda7d29e650b460e304ce8d7a3e1c8e7837f93a044b913c4`；实际lane-card validate退出0/pass，15项required-read全部字节一致。
- `c1-final-snapshot-r001/manifest.json` SHA：`793578f6d860f277b8fec7376f8bfc30db89d45ef2cc18a44274bd696daf09e3`。运行前与运行后18/18 current源码/runner=冻结snapshot=manifest；post时点 `2026-10-27T05:37:30.153564+00:00`，已立即通知root可释放C2/C4写入。
- 释放后的C2/C4对current wrapper/G2等有合法变化；本报告随后源码审读以冻结snapshot为准，不把后续current内容偷换进C1 verdict。共享tooltip/Store等必要扩读另绑定摘要。
- 本lane仅新增本报告；未修改源码、冻结合同、fixture或已有报告，未安装、构建、启动服务、访问DB、提交或推送。报告写前不存在。
- 本reviewer此前写过C234 fixture设计，本次**不自审该fixture**；已只读root独立 `UiIntegrationDesignReview-r003-C234.md`（第3/3轮），其准入不被本C1实现审查替代。Goal22项/49type、历史approved_deferred责任均保留。

## 2. 实际独立执行结果

命令在 `core/core-frontend` 执行，依赖已存在，无--fix/安装；以下四项绿色检查在C2/C4释放前完成，前后18项SHA相同。

| 命令 | 实际结果 | 证明层级 |
|---|---|---|
| `node tests/filter-copy-mvp-paste/check.mjs` | exit0，8组PASS | 真实wrapper script setup编译/mount、真实composable/A service/helper/emitter、薄SFC父错误边界；Store/API/下层renderer ports有明确doubles |
| `node tests/filter-copy-mvp-renderers/check.mjs` | exit0，24 PASS；semantic_failures0/execution_errors0/unhandled[] | 三真实完整SFC编译及inline template在Vue custom host运行；G2/S2库、DOM测量/Provider为doubles；非真实SDK像素 |
| `node tests/filter-copy-mvp/check.mjs` | exit0，14/14 | 当前A公共服务/composable及production编译分支回归；无receiver环境的unavailable不冒充真实页面仍禁用 |
| `node tests/filter-copy-mvp-api/check.mjs` | exit0，9/9，0断言失败/0执行错误 | 真实API与decoder；网络envelope为double；API源码仍9f160c78…；非真实后端 |
| 定向ESLint，见下清单 | exit0，无输出 | 15个生产/runner文件，不自动修复 |
| `./node_modules/.bin/stylelint src/views/chart/components/views/index.vue src/views/chart/components/views/components/FilterPasteRenderer.vue` | exit0，仅3条既有rule deprecated提示 | 只检查本次新增宿主/薄SFC样式，不代表全部UI或全量构建 |

ESLint实际清单：`src/views/chart/components/views/index.vue`、`src/custom-component/filter-copy/mvp-chart-filter-paste.ts`、`src/views/chart/components/views/components/FilterPasteRenderer.vue`、`src/views/chart/components/editor/filter/useChartFilterCopyMvp.ts`、`src/custom-component/filter-copy/mvp-chart-filter-copy.ts`、`src/locales/{zh-CN,en,tw}.ts`、`src/views/chart/components/views/components/{ChartComponentG2Plot,ChartComponentS2}.vue`、`src/custom-component/indicator/DeIndicator.vue`、`tests/{filter-copy-mvp-paste,filter-copy-mvp-renderers,filter-copy-mvp,filter-copy-mvp-api}/check.mjs`，使用 `./node_modules/.bin/eslint`，未加--fix。

额外独立回放RED：释放后在内存读取**冻结runner**，仅重定向root/source定位到固定快照/原项目依赖，不修改函数或断言。renderer `--baseline --before`读取c1-before三真实SFC，SHA与原manifest相同：子进程exit1，5项语义失败、execution_errors0，G2 draw/render/afterRender trace实到对应库故障；S2 render拒绝/fulfilled无layout两项也实到draw→render，原未消费Promise拒绝记在unhandled为`Error: fixture:render`。不是missing method/编译错误RED。GREEN已复用同一前5个案例身份；runner的AFTERRENDER/S2-RENDER/S2-LAYOUT名称是原稳定子案下细分见证，不能声称原25子案全部执行。

wrapper frozen `--baseline`也成功编译后从实际AST抽取仍保留的legacy calcData体，实到受控renderer throw，metadata expected0/actual1，指纹 `C1-OLD-ENTRY-PUBLISHES-BEFORE-READY`，子进程exit1、execution_errors0。**该legacy路径为兼容仍保留，新的paste走专用入口；它不是同函数RED→GREEN或完整冻结MVP故障案。** 只能作为旧行为对照，不能独自承担本轮全部ERBE证明。

内存回放时首个Node stdin参数拼接曾误把--baseline当模块名，修正为 `node --input-type=module - --baseline …` 后才得到上述语义结果；该启动错误不计RED。附加分页见证首次snapshot依赖解析缺vue/lodash，明确指定原node_modules路径后成功；此工具路径错误同样不计产品发现或RED。

## 3. 全部确定发现

### C1V-001 / P2 / OPEN：候选G2的库内共享tooltip绕过phase guard

**触发条件：** 候选为有tooltip的G2类型，在真实drawChart内部安装共享tooltip后、仍处candidate或准备随后失败时，触发该实例的tooltip:show；配置轴标签lengthLimit时还存在axis-label-item:pointermove同类入口。Cases10已要求主动触发候选tooltip/事件检查无对外效果，因此不属于迁出的通用资源工程，也不能以“非关键交互可降级”免除隔离。

冻结G2 SFC `1538–1540`只关闭response.customAttr.tooltip.carousel.enable，`989–998`/owned分支只跳过SFC自己调用的listenerTooltipShow与axis-title tooltip。实际 `bar.ts:162`、`line.ts:149`和area/mix/pie等drawChart内部仍调用 `new G2TooltipCarousel(...).start()`；构造器 `G2TooltipCarousel.ts:91–94`在检查carousel.enable之前无条件listenerTooltipShow。真实 `barUtil.ts:981–1071` 的listener没有phase/isCurrent输入：会把候选tooltip设visible并调用共享activateHoverTooltip，该函数会隐藏先前old图表hover并改document pointercancel监听。

**独立有限函数体见证已执行：** 由TypeScript AST原样提取当前绑定barUtil的 `listenerTooltipShow/releaseActiveHoverTooltip/hideActiveHoverTooltip/activateHoverTooltip` 四个真实函数体，transpile到VM；仅给DOM/layout/实例事件明确double，预置old活跃hover后触发candidate tooltip:show。实际：

```json
{"tooltip_visibility":"visible","global_effects":[["doc-remove","pointercancel"],["oldchart","tooltip:hide"],["doc-add","pointercancel"]],"phaseGuardProvided":false}
```

加载函数来源SHA `b04dfb0a14594e78ee5d131b3c18aab581edfb065a32e80f97ec939f983991b2`。该见证直接执行真实共享函数体，证明条件事件下的外部效果；**未冒称整个真实G2/浏览器自动会触发该事件**。安装该listener的真实调用链已源码确认，inert/visibility:hidden并不约束库事件。

**同类残余一次列齐：** 除carousel构造路径，range-bar/waterfall/stock-line/progress-bar/bullet-graph真实drawChart还直接调用listenerTooltipShow；多个G2 handler的tooltip配置通过createTooltipWrapper挂到document.body。`bar.drawChart→configLengthLimitTooltip→common_antv.ts:3357+ configAxisLengthLimit`直接注册axis-label-item:pointermove并调用getAxisTooltipDom/showAxisTooltip，同样无phase判断；跳过SFC的axis-title安装不覆盖axis-label。此轴标签路径为源码确定的同类风险，本轮未单独动态触发，不伪装为已运行通过/失败。

影响：准备阶段或失败候选可以显示候选外tooltip、关闭old hover/修改全局listener；8组/24组现有tests把真实图库draw/tooltip helper替换，因此其零effects断言无法排除此路径。tree与业务Store未先写不等于旧画面完全保持。

**最小修复建议：** 将本局部paste的opt-in phase/isCurrent能力沿drawOptions或临时chart配置传至共享tooltip mount/listener/carousel与axis-label配置；candidate不接入body共享host或不允许其show/外部hover/document效果，discard后迟到事件也无效。实际legacy默认保持；active同实例继续按canonical binding读取，非关键交互可以显式降级，但不能放过candidate越界事件。不要仅在SFC再加一个guard而遗漏库内构造器/直接listener。root给精确增域后Builder实施，不建立全局资源框架。

修后验证：真实bar/line draw安装链或至少真实公共模块的候选事件见证，预置old hover/无关DOM，分别触发tooltip:show与axis-label move、失败/discard后late；要求old hover/可见DOM/global listener不变，候选不出现在body可见层。再验证active与无binding legacy仍按原能力工作，及原8/24/A14/B9回归。

## 4. 已推翻的疑似发现，不纳入待修分母

### C1V-002 / WITHDRAWN：S2分页期间pending paste疑似未失效

初查冻结S2 `538–545`：handleCurrentChange直接本地calcData/getData，没有调用wrapper invalidatePaste。在原wrapper runner的“只记录setViewPageInfo”Store double下，追加实际冻结S2这两个AST函数体，模拟page2 query pending，候选随后仍publish=true、page metadata=1。该输出只证明所构造double组合，没有真实Store别名语义。

继续读取真实 `dvMain.ts:2019` 发现setViewPageInfo把**同一pageInfo对象**赋到canonical view.pageInfo；真实S2 setupPage `434`传其reactive state.pageInfo，真实模板 `1042–1053` v-model页码会改该同一对象。general页大小另经真实Editor onTablePageSizeChange写canonical basicStyle.tablePageSize。因此wrapper deep watch应检出，初步“确定bug”判断不成立，已立即通知root撤回且root尚未派修。

**纠正见证实际执行：** 原冻结wrapper setup+实际dvMain.setViewPageInfo AST方法+共享reactive pageInfo，先以真实setter建立引用，pending paste后模拟v-model currentPage1→2。得到：

```json
{"page_ref_equal":true,"page":2,"paste_published":false,"reason":"paste_stale","metadata_writes":0,"withdraw_prior_store_double_counterexample":true}
```

裁定：撤销，不要求改码；真实分页完整浏览器交互本轮仍未重播。缺真实引用语义的Provider double不能推翻实际产品链；保留两次观察与撤销原因，避免无依据扩写域。

## 5. 已查未见新增阻断的维度

| 维度 | 实际检查与上限 |
|---|---|
| 完整树/字段/权限/TTL | A14真实服务/composable，own undefined和缺键不等、成功clone/失败保旧、同dataset字段id/deType、DEV flag/权限unknown拒绝、单调TTL及会话清空；真实权限仍未验 |
| B strict与once query | 真B9验证envelope解码/默认兼容；wrapper8中直接消费B.value并验证id/type/render，不再猜DTO code；每次成功/失败派发1，拒绝/取消0；真实浏览器次数未观测 |
| 候选ready/失败/late | 真三SFC：G2 timer/queue/draw/render/afterRender严格错误；S2 Promise+本次layout双条件、两顺序/timeout/unmount；indicator真实Vue节点内容与父error boundary；已知晚到实例dispose；真实图库完整事件未验 |
| 同key/public proxy/canonical | helper小接口与binding shared shallowRef；wrapper采用真实child public proxy而非库instance；same node/key未换；native renderer后续canonical名字重绘、indicator文本更新。wrapper8不执行完整生产template，不能单凭手工renderer port当全模板DOM证据 |
| 发布与metadata | 冻结wrapper689–716单同步段、finally清publishingOperationId；tree、binding、request.chartExtRequest两份独立clone、details与g2 origin/s2 pure-page-instance/indicator分支；snapshot calcData一次，无发布期query/draw；普通用户后续编辑仍可使操作失效 |
| 真Store语义 | 实读dvMain details存.data、calParams truthy保留、pure存.data、pageInfo写canonical及instance/last/origin映射；helper不借任务修0/false/空串。测试多数仍为setter port double，实际多setter联合回滚不在本包承诺 |
| 当前局部失效 | 实跑view改回/context/identity/newcopy/TTL/unmount/普通wrapper刷新拒绝late；真实S2pageInfo共享引用纠正见证也拒绝。不是通用所有异步查询/旧响应治理 |
| undo/redo路径 | 实读snapshot recordSnapshotCache('calcData',id)将id入cache并增计数，restore发snapshotChangeToView重算；不把cache写当query。**真实历史flush/undo/redo、画面恢复仍NOT_RUN** |
| 默认兼容/入口 | 有binding才candidate守卫，无binding原calcData/render仍在；未接地图/Tiny/图片的旧普通换类型恢复旧分派，plugin仍拒绝；DEV关闭/权限三态A回归成立，不建立默认allow |
| 元数据之外事件 | SFC action/default-range/quadrant/resize/滚动与薄SFC业务emit有phase guard；G2共享tooltip缺口明确由C1V-001覆盖，未把本栏泛称全部隔离通过 |
| i18n/格式 | zh-CN/en/tw新增reason键对应且局部lint通过。全项目ts:check/构建未执行，Builder30→30类型multiset只是其原报告，不冒称本review独立全项目类型绿 |

## 6. root真实UI证据的独立核读

已实际阅读 `UiC1FirstQuerySaveChain-r001.json`，字节SHA `c1841f3a6252086e6bcfac9858c1f70da9eb4f1f2b2dab9796d8932c4eaf6c46`，并用view_image实际查看三张截图：`UiC1LinePaste-r001.png`、`UiC1TablePaste-r001.png`、`UiC1SavedReopened-r001.png`。能看到真实编辑器copy/paste、权限测试allow与“过滤条件已粘贴”、折线/明细表画面，以及新开页权限unknown/禁用状态；截图不能单独证明完整行/每天聚合。

本reviewer重新计算源source与两target.after/reopened的 tree、ownKeys、undefinedPaths，均一致；line.before为空。真实操作（bar→line/table paste、table普通刷新、显式保存、离开列表和产品编辑重开）归root观察，不是本lane浏览器重演。数据文件明确query_count为NOT_OBSERVED，SQL14行/6761/13days全response逐项比较NOT_RUN；不把组件query1映射到浏览器，也不从截图补齐exact数据验收。没有indicator真实首链证据、没有保存失败回归或所有49type；均保留未完成。

## 7. 全量差异、未检原因和修后准入预测

按c1-before9项与final18项对照：wrapper新增共同receiver/publish/template节点及原query解绑；三renderer增prepared/phase/canonical/ready；composable增busy/confirm/request；新helper与薄SFC；三locale只增本次状态文案。A service字节完全未变；API B仍原独立通过SHA。新增runner/README明确doubles；A runner当前C1 provider适配另有精确补卡证据。final-only不等于新生产代码（A/B runner/API只是纳入本次冻结），未据此混入其它改动。旧快照9项摘要已核；报告不拿整个脏工作树Git diff冒充只属C1。

未执行全量产品回归、真实G2/S2/indicator像素、所有库adapter/event、完整真实Store/Snapshot联合undo/redo、跨入口移动/panel/lib、真实权限组织/身份拒绝、后端数据库方言、保存失败、49type/plugin清点、完整tscheck/build。原因分别是本lane精确C1边界、Provider/library doubles与未有对应真实证据，不是默认通过。旧迁出通用双host/资源框架/复杂动态filter未重新作前置。

**修后预测：** C1V-001有限隔离修复并按同冻结语义复验后，可进入下一轮实现Validation；其余已通过域可按字节delta复用。后续native真实UI与undo/redo、每type query/画面/save/reopen仍须补证，不能因修掉该bug就称当前22项或全MVP完成。C1V-002不派修；继续C2/C4安全独立工作。此报告不更新KB/Coverage/Session终态，不代替root的Stop Gate。

## 8. 最终绑定

写后再次核验15项required-read和18项冻结snapshot均一致；current后续合法变化已排除。报告只绑定下表冻结C1字节及扩读共享依赖，不声称后续C2/C4已验证。

| C1 final source / snapshot相同后缀 | SHA-256 |
|---|---|
| `core/core-frontend/src/views/chart/components/views/index.vue` | `f08ff2f6800eba2d07b2c8f4f161fce4c09f4bb7e9f6fabf73ad7ebac6f98e9d` |
| `core/core-frontend/src/custom-component/filter-copy/mvp-chart-filter-paste.ts` | `b27d772ab4db73e50522561afa19f95deb74b1e1b1e02d98bd5814de05614331` |
| `core/core-frontend/src/views/chart/components/views/components/FilterPasteRenderer.vue` | `be1677c8b16ad3486aba08ebf5b6da19e169108b2caa774b27fc577ba9c11c78` |
| `core/core-frontend/src/views/chart/components/editor/filter/useChartFilterCopyMvp.ts` | `fa77449b9888f7b4763c326aa05c115bd44a04a205703b5f5987b81f90a42cf1` |
| `core/core-frontend/src/custom-component/filter-copy/mvp-chart-filter-copy.ts` | `ca144eb978ba334c9ba71fc4c6c5d6cefcb4c025ecac15ff2a446f54e8c8cc79` |
| `core/core-frontend/src/locales/zh-CN.ts` | `0d84476059c64593f09cc9a21ec948978c0ffb89de5f1a4de010b94f8aef0aa6` |
| `core/core-frontend/src/locales/en.ts` | `9268f06433a52661d0239ac83fff84965390f9f95058446bf21be91d3b604289` |
| `core/core-frontend/src/locales/tw.ts` | `1076aa0aaf227de06ee2ffa2ae3b208254b5d02b053e0b346e65729e662ccff2` |
| `core/core-frontend/tests/filter-copy-mvp-paste/check.mjs` | `ce2204514462fe08ccc8500e0cdd80c30c93c2314040d13e21d1af76ccc01a5c` |
| `core/core-frontend/tests/filter-copy-mvp-paste/README.md` | `a1e9e007b3841c3323a1c47c500a2f1c4c07fdbdabee995f38650e339f5aaf3a` |
| `core/core-frontend/src/views/chart/components/views/components/ChartComponentG2Plot.vue` | `f4d6b840018f429c3fc3cd94a5ec9df76e2a387c0085459d044ac56a29428549` |
| `core/core-frontend/src/views/chart/components/views/components/ChartComponentS2.vue` | `50d57d96d863d407e84a6516e958ce06cd8ef144899a05642a0a3343c41bb2f2` |
| `core/core-frontend/src/custom-component/indicator/DeIndicator.vue` | `9429ff118457c38616ceb801d9d89b2f70a034b72c948b9c155805e6db60150b` |
| `core/core-frontend/tests/filter-copy-mvp-renderers/check.mjs` | `7d00e3274b48c6629336c083bdb9029cd82bc2202ed89bf54f949f48ea59745f` |
| `core/core-frontend/tests/filter-copy-mvp-renderers/README.md` | `ce3dc4d7b2bdb0365d4e902cd8cf6514228be06e2fc41b34a466f2a67b0f9458` |
| `core/core-frontend/tests/filter-copy-mvp/check.mjs` | `9409e6388d9989b2476f0b0f679cad5d60247741e82af2d5932d542b899a6989` |
| `core/core-frontend/tests/filter-copy-mvp-api/check.mjs` | `68dbed66d3e09a25c21efda154f091760a5c9118ea1f4034153c356ccf10091e` |
| `core/core-frontend/src/api/chart.ts` | `9f160c78f24bf50be80c9510529682267530dcc28d203478074af4add865c74b` |

扩读共享依赖：

| path | SHA-256 |
|---|---|
| `core/core-frontend/src/views/chart/components/js/G2TooltipCarousel.ts` | `f3a1d565701da75bc027edca263e18e7e08b0096b08523d2cfcc3b0ce0860389` |
| `core/core-frontend/src/views/chart/components/js/panel/charts/g2/bar/barUtil.ts` | `b04dfb0a14594e78ee5d131b3c18aab581edfb065a32e80f97ec939f983991b2` |
| `core/core-frontend/src/views/chart/components/js/panel/common/common_antv.ts` | `c6c5c643db10966e098aede11b53faf2098f8a9e16e1ce113888a5707edd4f1e` |
| `core/core-frontend/src/views/chart/components/editor/index.vue` | `0a9b782b8b72f3f6ac95148187d49e09a8d24f1610ea43b18e9e7002db06d5ee` |
| `core/core-frontend/src/store/modules/data-visualization/dvMain.ts` | `2ca7f626c2c31f3c6e5db547cae600cfcf30cf26ed64d8f183a33943751752a2` |
| `core/core-frontend/src/store/modules/data-visualization/snapshot.ts` | `5ffd11d4740efbd8570e31c42cffb8870a879eaf309bb4f31b00e40cc57c2e30` |
| `core/core-frontend/src/views/chart/components/js/panel/charts/g2/bar/bar.ts` | `a66b6f5f6681759b86b639f69e29489fe18da391c25ce2eb012a350eaca0e14f` |
| `core/core-frontend/src/views/chart/components/js/panel/charts/g2/line/line.ts` | `acacb1ae0fde128a1cb894f06ce073454da04205e9225633168e5f67cc8b4311` |
