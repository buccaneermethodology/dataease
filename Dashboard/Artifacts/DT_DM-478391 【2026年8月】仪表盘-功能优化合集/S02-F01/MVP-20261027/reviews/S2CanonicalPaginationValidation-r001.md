# S2 canonical 分页独立验证 r001

- reviewer/source：`/root/local_basemap_reviewer`；reviewed_at：`2026-10-30T21:12:26.143220+00:00`。
- 唯一交付物：本报告；本 lane 只读核查既有运行原件，未操作 UI/DB，未修改源码、driver、旧证据，未运行产品测试。
- 卡：`s2-canonical-pagination-validation-r001-card.json`；canonical SHA `f74d3d9387867a33854879406b877de15695cbb365a219743a80ebe550510f45`。接收端 validate/render 均 exit0，直接消费 render stdout；未另落同名 prompt。
- **结论：PARTIAL。** 本次本地 DEV 正常控件配置、paste 单请求、S2 第2页请求与两页原始结果、正常过滤编辑300后的新请求及原始结果、无save恢复链可核。第2页与300的最终可见表格尚缺完成渲染后的采样；不得用 HTTP/JSON 通过替代视觉通过，也不能由两张早采样图推断产品缺陷。

## 原始范围与轮次

归属 S039 U1，新共享 runtime 验证第 **1/3** 轮；卡 session_id 为 `DE-EXEC-S038`，这是元数据归属文字，实际限定以卡 execution_command、maximum_claim 与已释放 S039 U1 为准。本轮对应原 `AC-MVP-F01-11`、`MVP-UI-11-CANONICAL / S2_PAGE_ACTION`，没有重开已耗尽3/3的 C1/C2 实现预算。

原38义务（P1=12、P2=26）、49内置类型分母、完整 **0/49** 保持。真实权限 BLOCKED/NOT_RUN、插件 installed unknown、C2V-005/旧ubo及其它冻结残余不升级；C1V002既有撤销决定保持。既有 table-info 新r002基本链沿用原独立报告，不追认旧r001未准入执行，不在本轮重审。本报告不关闭完整 AC11、P1、49型或 Goal。

## 入场、冻结与证据身份

卡13项主绑定、Context13项 required refs、九域（authority/scope/acceptance/implementation/identity/validation/dependency/claim_ceiling/topology）、admission5项 refs 均逐项核对当前摘要；Context validate 与 execution_admission 检查均 exit0。Read Manifest 见末尾；这是摘要/上下文核查，不是不存在的 Session registry 程序化校验。

admission issued_at 与 ToolFreeze 为 `2026-10-30T21:02:59.731698Z`；运行 `21:03:11.298Z` → `21:03:22.518Z`。driver freeze/start/end/current SHA 均为 `57549e2ba4f07762c057acb414ebf60e112a2454f5a4153655bc052fafd2b96b`；events SHA `44ca1cb7b4b382587cb435ffc46492f6a12f96dd78182c005e53f1a39c71f2cc`。未见 executionFailure，wireCaptureFailures=[]、pageErrors=[]，旧 runtimeErrors 1→1；这不等于所有 console/resource/SDK 错误都已检查或旧ubo已关闭。

实际目标 `7520752064427724800`，dataset `1312472054565572608`，resource `1312476889213964288`，复制源为 rich-text200 `7521402539875504128`。事件 schema、header、limits 仍有 area 等旧模板残字，其中“保留area200”与本次实际末态不符；依据 stage、正常控件、真实 request/response 与 finalDiagnostic 定界，实际为临时 table-info 后恢复已保存 bubble-map200。

## 已检查无问题：真实动作、请求与独立数据 oracle

临时真 `table-info` 的 xAxis 仅 shop（`1793083721149 / f_a392ef5e59f0e162`），yAxis 等可选轴为空；amount只参与过滤，不强加 amount 输出列。正常 UI 选择“翻页 / 精简 / 10条/页”，真实 `customAttr.basicStyle` 为 `tablePageMode=page / tablePageStyle=simple / tablePageSize=10`；未虚构size5、未注入Store或强制remount。

全部9条业务 wire 均 HTTP200/code0。下表仅列目标主链，seq32/34/35分别为恢复时其它 view（symbolic-map、rich-text、picture的table-info DTO），不可混认成目标表分页或paste重复。

| wire / seq | 实际动作 | 过滤与分页 | raw tableRow / totalItems / totalPage |
| --- | --- | --- | --- |
| 0 / 9 | setup正常过滤500并更新 | table-info500 | 8 / 8 / 1 |
| 1 / 14 | richtext200复制粘贴采用 | table-info200，第1页 | 10 / 14 / 2 |
| 2 / 15 | 正常下一页 | table-info200，chartExtRequest.goPage=2，size10 | 4 / 14 / 2 |
| 3 / 17 | 正常过滤编辑300并“更新图表数据” | table-info300，goPage未传 | 10 / 10 / 1 |
| 4 / 29 | 恢复时findById | 保存的目标为bubble-map200 | saved tree与恢复诊断完全相符 |
| 6 / 33 | 恢复目标的新getData | bubble-map200 | 三省新聚合rows，sum6761 |

独立读取 CSV（SHA `abc8bed0862129d58724bcefff2563862e48d1ea057365ae8d5d2c853e64472b`），按原 AND(amount>阈值，OR六店枚举) 逐行过滤、投影shop并比较多重集，保留重复：

| 条件/页 | 乐园店 | 南都店 | 果元店 | 水围店 | 香橙店 | 总行数 |
| --- | --- | --- | --- | --- | --- | --- |
| 500 | 1 | 2 | 4 | 1 | 0 | 8 |
| 200 第1页 | 1 | 2 | 6 | 1 | 0 | 10 |
| 200 第2页 | 0 | 0 | 0 | 2 | 2 | 4 |
| 200 两页合并 | 1 | 2 | 6 | 3 | 2 | 14 |
| 300 | 1 | 2 | 5 | 2 | 0 | 10 |

500、200两页合并、300均与CSV对应投影严格一致；响应fields和rows均只shop。xAxis.sort实际为none，本时点返回顺序恰与shop排序分页一致，不能声称none承诺稳定排序。仅shop输出也不能建立每页唯一CSV ID对应关系；本结论限两页合并多重集，不数合并单元格边框作raw行数。

paste窗口 `[14,15)` 只有seq14一个目标物理getData；queryObservation为operationId1、logicalGetDataCalls1、queried/success。seq15分页和seq17正常编辑属于后续普通用户query，不能算paste重复。分页/编辑后的 queryObservation仍保留op1的200响应，只描述paste观察窗口，不代表普通刷新最新结果。

page2请求的旧pageInfo仍为 `{total:14,pageSize:10,currentPage:1}`，但实际发出了goPage2；300请求的旧pageInfo仍为 `{total:14,pageSize:10,currentPage:2}`，goPage未传，返回10/10/1。保留这些真实字段，不单凭旧pageInfo认定产品bug或宣称页面已切回1。

## descriptor与canonical读数

sourceBeforeCopy.source、copied.clipboard的完整descriptor、after.source、page1/source与page2/source严格一致为200；paste与分页未改剪贴板。after/分页/编辑期间clipboard仍为200，session为 identityEpoch35/editSessionId35/revision34。

正常编辑前后不可声称“只改value，其它字节不变”：编辑器真实导出300时，叶子field/valueType等null键被省去，group.fieldId由null变空串，group.timeValue为空串，group.dynamicTimeSetting由六null键变{}，ownKeys次序改变；两叶timeValue为own undefined，对应 `$.items.0.timeValue`、`$.items.1.subTree.items.0.timeValue`，JSON依法省略。这同样出现在setup/baseline500，不是本轮证明的paste特有现象。

本lane最初辅助核读曾错误假定undefinedPaths全空，断言在baseline失败；改按真实descriptor语义检查后，33处descriptor全部自洽：逐node从ownKeys仅移除已记录undefined键后，严格等JSON实际键及次序；每条undefined路径的父node存在、ownKeys含键、JSON不含键。该核读纠正没有改动原件。canonicalEditedBeforeQuery与canonicalEdited.diagnostic完整descriptor相等，seq17真实customFilter严格等该300 JSON树；过滤语义保持AND amount>300与OR六店。本报告不将编辑器形状变化清洗掉，也不由此宣布全原生shape保持或产品缺陷。

静态核读 `ChartComponentS2.vue`：112–114从filterPasteBinding.current.value取当前view/element（fallback props）；420–435 simple分页读tablePageSize，reset时currentPage=1；538–546正常分页入口有active guard，写extReq.goPage并合并chartExtRequest，以当前view的spread调用calcData。该读数支持本路径入口解释，不证明所有运行实例均同一对象或全Store零写，不翻案原C1V002。

## 全部发现：两张图缺最终渲染完成采样

四PNG均已实际查看，且摘要与原件一致：

| 图 | 实际画面 | 本轮结论 |
| --- | --- | --- |
| before | setup500的8条明细，存在合并单元格 | 基线可见，不能按边框计8行 |
| after | 200第1页内容；pager共14条、1/2 | paste后第1页可见 |
| page2 | 页码2高亮，canvas仍显示第1页乐/南/果/水 | 第2页最终四行画面未证实 |
| edited300 | canvas显示第2页水围/香橙 | 300最终十行画面未证实 |

driver before/after使用helper等待canvas可见、loading mask隐藏并再400ms；page2与edited300在HTTP完成后直接tile.screenshot，没有绑定本次S2布局/帧/新内容完成的屏障。page2响应 `21:03:18.684Z`、诊断采样at `18.687Z`；300响应 `21:03:19.704Z`、采样at `19.714Z`。这些时点及旧画面说明本包采样不足，不能推断最终渲染失败；固定延时本身也不等同S2 ready。

## 无save退出与恢复

整个API记录无updateCanvas，saveRequestCount=0。`21:03:20.005Z` 已退出到panel/index、editorCount0；重开后 `20.685Z` 弹出“存在未保存的修改，立即恢复？ 否 是”，driver明确点击“否”并等待hidden，`21.620Z` 记录隐藏。迟到草稿动作与时点没有省略。

seq29原始findById中目标type=bubble-map、tree200；seq33为相同目标与dataset的新bubble-map200请求/响应，独立按CSV复算江苏2676、浙江2217、广东1868，sum6761，与raw tableRow严格相同。restored.typeControlText为“气泡地图”，完整descriptor与initialTarget保存树相等、fieldsReady=true、clipboard=null。最后真实diagnostic的read-source/read-dataset/edit-target均unknown，clipboard=null、queryObservation=null；session为identityEpoch37/editSessionId37/revision34。

因此末态是恢复既有已保存 **bubble-map200**，临时table-info/分页/300未保存，不能称保存临时表、恢复liquid或保留area。driver中旧openSaved()期待table-info，但正常成功路径实际走318–333专用恢复逻辑，本轮没有调用旧函数。

## 未检查、同类残余与准入预测

未操作新的UI、未重跑产品测试、未对未知最终帧补猜、未重开耗尽预算。真实后端授权/拒绝、多组织、分享/嵌入、全部canonical variant、全49型与完整38义务均未在本包验证；DEV允许测试桩不等于真实权限。未对所有console/resource错误作全覆盖，旧ubo/C2等沿原裁决。单次两页数据相符不证明所有并发、所有尺寸和任意排序稳定性。

同类残余是“HTTP先完成、canvas后完成”时证据driver直接截图可能采旧帧，普通刷新后paste诊断也可能仍指向旧operation。应分别绑定本次动作、新响应与渲染完成后的可见结果；不以任意等待直接命名S2 ready，不将后续普通query算成paste重复。

**准入预测：本r001只能有界接纳正常分页/canonical编辑的动作、请求、原始结果及恢复层；U1最终视觉列保持未满足，整体PARTIAL。** 若后续在同交付物第2/3轮新增完成帧证据，应保留本r001初始采样限制并独立核新包，不覆盖本报告、不自动升级完整AC/P1/Goal。本轮不要求新设计review或机械重复已通过的基本table-info链；本报告不混入未来r002事实。

## Read Manifest

下表为本次使用原件及逐项复核的摘要。卡13 refs、Context13 refs与admission5 refs重复项保留，以便查明各层绑定；Context额外组件/工具文件的摘要核对不冒充其全量行为审计。

| 来源 | 原件路径 | SHA-256 |
| --- | --- | --- |
| 卡输入 | `Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/Goal.final.json` | `4db931a6764a8c48345e7e8358e579550a9bc98594bf1654647716d72b9678c4` |
| 卡输入 | `Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/planning/ContextBootstrap-S2CanonicalPagination-r001.json` | `4cb20dd8d92893c2f6287d98ce9bfe66a32249476f3688d7c59d51e62fc8b81c` |
| 卡输入 | `Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/planning/s2-canonical-pagination-admission-r001.json` | `69123f778598898121ce5cc606fae69eec472a12aff61f7046bbe203718cd555` |
| 卡输入 | `Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/planning/Topology-actual-r581.json` | `228ff62795c40a0b1b926f4026818270baa7877fd80a2b1eea31eeeccf722346` |
| 卡输入 | `Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/MVP-20261027/UiIntegrationCases-r002.json` | `e365ef111582ef84f20f26e6136854409b7fc66bb0931cae40a9df5318036d55` |
| 卡输入 | `Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/MVP-20261027/reviews/MvpAcceptanceReadinessReview-r002.md` | `d3f97246db43f9dc705829d94ede73891694b13f21f7f3a9f4a03d748574fbe7` |
| 卡输入 | `Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/MVP-20261027/reviews/TableInfoMissingColumnsValidation-r001.md` | `58900612918bc2f77fd487150893236ab0c999df09e6118b4633d5cfb615a3c2` |
| 卡输入 | `Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/MVP-20261027/runtime-fixtures/TeaMaterialExtended-r001.csv` | `abc8bed0862129d58724bcefff2563862e48d1ea057365ae8d5d2c853e64472b` |
| 卡输入 | `Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/MVP-20261027/runtime-state-tools/observe-s2-canonical-pagination-r001.js` | `57549e2ba4f07762c057acb414ebf60e112a2454f5a4153655bc052fafd2b96b` |
| 卡输入 | `Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/MVP-20261027/evidence/S2CanonicalPaginationToolFreeze-r001.json` | `532a2d76e5f3772d3b70debfcffc55210e700b3e0add5125ba4397f436c86369` |
| 卡输入 | `Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/MVP-20261027/evidence/S2CanonicalPagination-events-r001.json` | `44ca1cb7b4b382587cb435ffc46492f6a12f96dd78182c005e53f1a39c71f2cc` |
| 卡输入 | `core/core-frontend/src/views/chart/components/views/components/ChartComponentS2.vue` | `50d57d96d863d407e84a6516e958ce06cd8ef144899a05642a0a3343c41bb2f2` |
| 卡输入 | `core/core-frontend/src/views/chart/components/views/index.vue` | `dd88f2ac4f7c5e35f0b07822c72cae0764a3bad11be4a19f23a86d9fb9de3c7b` |
| Context内层 | `Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/Goal.final.json` | `4db931a6764a8c48345e7e8358e579550a9bc98594bf1654647716d72b9678c4` |
| Context内层 | `Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/MVP-20261027/UiIntegrationCases-r002.json` | `e365ef111582ef84f20f26e6136854409b7fc66bb0931cae40a9df5318036d55` |
| Context内层 | `Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/MVP-20261027/reviews/MvpAcceptanceReadinessReview-r002.md` | `d3f97246db43f9dc705829d94ede73891694b13f21f7f3a9f4a03d748574fbe7` |
| Context内层 | `Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/MVP-20261027/reviews/TableInfoMissingColumnsValidation-r001.md` | `58900612918bc2f77fd487150893236ab0c999df09e6118b4633d5cfb615a3c2` |
| Context内层 | `Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/MVP-20261027/reviews/MapBubbleMissingColumnsValidation-r001.md` | `913b303da557944e6646073788340b63e1c3c18c96835fd8c98c20c451794e56` |
| Context内层 | `Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/MVP-20261027/runtime-fixtures/TeaMaterialExtended-r001.csv` | `abc8bed0862129d58724bcefff2563862e48d1ea057365ae8d5d2c853e64472b` |
| Context内层 | `Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/planning/Topology-actual-r581.json` | `228ff62795c40a0b1b926f4026818270baa7877fd80a2b1eea31eeeccf722346` |
| Context内层 | `Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/MVP-20261027/runtime-state-tools/observe-s2-canonical-pagination-r001.js` | `57549e2ba4f07762c057acb414ebf60e112a2454f5a4153655bc052fafd2b96b` |
| Context内层 | `Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/MVP-20261027/evidence/S2CanonicalPaginationToolFreeze-r001.json` | `532a2d76e5f3772d3b70debfcffc55210e700b3e0add5125ba4397f436c86369` |
| Context内层 | `core/core-frontend/src/views/chart/components/views/components/ChartComponentS2.vue` | `50d57d96d863d407e84a6516e958ce06cd8ef144899a05642a0a3343c41bb2f2` |
| Context内层 | `core/core-frontend/src/views/chart/components/views/index.vue` | `dd88f2ac4f7c5e35f0b07822c72cae0764a3bad11be4a19f23a86d9fb9de3c7b` |
| Context内层 | `core/core-frontend/src/views/chart/components/editor/editor-style/components/BasicStyleSelector.vue` | `e47191f0772b0458b7ac765d22e5dce2563b0c25c954cc310fb54885a1ca4dcc` |
| Context内层 | `core/core-frontend/src/views/chart/components/editor/filter/useChartFilterCopyMvp.ts` | `b760fffb47db4a8a187cc3dc996d6ddffb5f2b187038da625c5c8e0839d87e5d` |
| admission goal | `Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/Goal.final.json` | `4db931a6764a8c48345e7e8358e579550a9bc98594bf1654647716d72b9678c4` |
| admission completion_contract | `Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/MVP-20261027/UiIntegrationCases-r002.json` | `e365ef111582ef84f20f26e6136854409b7fc66bb0931cae40a9df5318036d55` |
| admission context | `Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/planning/ContextBootstrap-S2CanonicalPagination-r001.json` | `4cb20dd8d92893c2f6287d98ce9bfe66a32249476f3688d7c59d51e62fc8b81c` |
| admission design_review | `Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/MVP-20261027/reviews/MvpAcceptanceReadinessReview-r002.md` | `d3f97246db43f9dc705829d94ede73891694b13f21f7f3a9f4a03d748574fbe7` |
| admission topology | `Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/planning/Topology-actual-r581.json` | `228ff62795c40a0b1b926f4026818270baa7877fd80a2b1eea31eeeccf722346` |
| 实际查看PNG | `Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/MVP-20261027/evidence/S2CanonicalPagination-after-r001.png` | `5de97178452a2e6b702082b50f723fd44b43a9770613b361c36d54db51a751e2` |
| 实际查看PNG | `Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/MVP-20261027/evidence/S2CanonicalPagination-before-r001.png` | `1767972d2262cd5a537679b35e3f6b3441f92ed9b2af12e5a9682fa0816c9c8d` |
| 实际查看PNG | `Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/MVP-20261027/evidence/S2CanonicalPagination-edited300-r001.png` | `5733c9f5fe5faeda90069d771494e020f19c295d7e3248a52cb3c719e7e94ec5` |
| 实际查看PNG | `Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/MVP-20261027/evidence/S2CanonicalPagination-page2-r001.png` | `4f30ae66f637d4e4b26802b23f4fca7c7874c47bc9ec8443f657efe8c9cb059a` |
