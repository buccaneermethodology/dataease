# S2 canonical 分页独立验证 r002

- reviewer/source：`/root/local_basemap_reviewer`；reviewed_at：`2026-10-30T21:15:47.124635+00:00`。
- 卡：`s2-canonical-pagination-validation-r002-card.json`；canonical SHA `f0611aaaa090df6cdb437fe75e5499ba93c53c2ea47d6c4589560cbeab3c5bd8`。接收端复验 validate/render 均 exit0，直接消费 render stdout。
- **结论：U1本次具体共享runtime场景有界通过。** 新r002的正常10条分页、200第2页、正常过滤编辑300后更新、对应raw数据和最终截图，以及save0恢复链均可核。此结论不等于完整AC11、全S2 variant、P1或Goal通过。
- 唯一新写入文件为本报告；本lane未操作UI/DB、未修改生产源码/driver/旧证据，未运行产品测试。

## 原始范围、历史与预算

同S039 U1交付物累计第 **2/3** 轮，继承原 `AC-MVP-F01-11 / MVP-UI-11-CANONICAL / S2_PAGE_ACTION`；卡session_id仍为DE-EXEC-S038，实际范围以maximum_claim/execution_command中释放的S039 U1定界。没有重开C1/C2等已耗尽3/3实现预算，不通过新编号重置审查预算。

原r001报告（SHA `5e0c8bd3eeb9586a45ad591aee1e5f901bcc6f4e621bbae627a433c4fbc4f272`）保持 **PARTIAL**，两张旧图仍为早采样缺口；新r002不能追认旧图正确，也不能倒推曾修复产品bug。本轮driver除输出/版本标识外，行为差异仅两处HTTP后等mask隐藏、1200ms与两帧300ms采样，再留最终PNG，未改生产代码或原合同。定时不称S2 ready事件。

原38义务（P1=12、P2=26）、49内置类型、完整 **0/49** 保持。真实权限BLOCKED/NOT_RUN、插件installed unknown、C2V-005/旧ubo等冻结残余不升级，C1V002既有撤销裁决保持。新table-info基本链沿用既有独立报告，不追认其旧r001未准入历史，不在本包重审。

## 入场与冻结

卡15项绑定、Context14项required refs及九域、admission5项refs逐项摘要匹配；Context validate与execution_admission检查均exit0。九域为authority、scope、acceptance、implementation、identity、validation、dependency、claim_ceiling、topology；末尾保留逐层Read Manifest。不存在Session registry工具，未声称程序化注册表校验。

新freeze/admission为 `2026-10-30T21:07:00.405097Z`，运行 `21:07:12.299Z` → `21:07:26.362Z`；driver freeze/start/end/current摘要均 `03a5ad6831a41f5c57abcd5d804f29705c54f079b59f36bd0a405c01d4f8f580`，events摘要 `7eb64a3349cfeddaa36349079c1ccf676e7a9b5d3171155b40a80a51cce72119`。未见executionFailure，wireCaptureFailures=[]、pageErrors=[]，旧runtimeErrors1→1；不等于全console/resource/SDK检查通过或旧ubo关闭。

实际目标 `7520752064427724800`，dataset `1312472054565572608`，resource `1312476889213964288`，source rich-text200 `7521402539875504128`。schema/header/limits中的area旧模板文字仍存在，不能按残字判断实际type/末态；本次实际为临时table-info，无save恢复既有bubble-map200。

## 已检查无问题：动作、请求、数据

正常UI切真table-info；xAxis只shop（`1793083721149 / f_a392ef5e59f0e162`），yAxis等可选轴为空。正常控件选择“翻页 / 精简 / 10条/页”，原始basicStyle为page/simple/10；没有size5、Store注入、强制remount，amount只作过滤不强加输出列。

| wire / seq | 动作与请求 | raw结果 |
| --- | --- | --- |
| 0 / 9 | 正常过滤500、更新 | table-info500，8行/total8/page1 |
| 1 / 14 | source200复制→paste采用 | table-info200，第1页10行/total14/pages2 |
| 2 / 15 | 正常下一页 | table-info200，chartExtRequest.goPage2、size10；4行/total14/pages2 |
| 3 / 17 | 正常过滤编辑300→更新图表数据 | table-info300，goPage未传；10行/total10/page1 |
| 4 / 29 | 恢复findById | 保存目标bubble-map200，完整JSON树一致 |
| 6 / 37 | 恢复目标新getData | bubble-map200，新三省rows合计6761 |

全部9条business wire均HTTP200/code0，主链目标id/dataset匹配。恢复其它seq36/38/39分别为symbolic-map500、rich-text200、picture的table-info DTO500，不当作目标临时表或paste重复。

独立读取原CSV，按原完整AND amount>阈值与OR六店子树逐行执行，金额用Decimal，投影shop保留重复后比较多重集：

| 条件/页 | 乐园 | 南都 | 果元 | 水围 | 香橙 | 行数 |
| --- | --- | --- | --- | --- | --- | --- |
| 500 | 1 | 2 | 4 | 1 | 0 | 8 |
| 200第1页 | 1 | 2 | 6 | 1 | 0 | 10 |
| 200第2页 | 0 | 0 | 0 | 2 | 2 | 4 |
| 200两页合并 | 1 | 2 | 6 | 3 | 2 | 14 |
| 300 | 1 | 2 | 5 | 2 | 0 | 10 |

500、200合并、300均严格等独立CSV投影；响应fields和rows只shop，未按合并单元格边框计算行数。xAxis.sort=none，本时点顺序恰匹配shop排序但不承诺稳定排序；仅shop输出不能映射每页唯一CSV ID，本结论限本次结果与两页合并多重集。

paste窗口 `[14,15)` 的目标物理getData只有seq14一个，queryObservation为operationId1、logicalGetDataCalls1、queried/success。后续seq15分页与seq17普通编辑query分开计数，不算paste重复。后续诊断保留op1的200响应仅为paste观察，不冒充最新普通刷新结果。

真实page2请求pageInfo仍 `{total:14,pageSize:10,currentPage:1}`，实际goPage2；300请求pageInfo仍 `{total:14,pageSize:10,currentPage:2}`、goPage未传，但raw回10/10/1且新截图显示300结果。保留字段事实，不以旧pageInfo直接推产品bug或猜测未见的分页状态。

## 已检查无问题：完整descriptor与canonical新查询

sourceBeforeCopy.source、copied.clipboard的完整descriptor、after.source、page1/source、page2/source严格一致为200，clipboard在分页及编辑后仍完整保留200。after/page2/edited300的session均identityEpoch37/editSessionId37/revision35。

canonicalEditedBeforeQuery与canonicalEdited.diagnostic完整descriptor相等，seq17的customFilter严格等该300 JSON树。保留正常编辑造成的真实shape变化：叶子field/valueType等null键被省去、group.fieldId由null变空串、group.timeValue为空串、group.dynamicTimeSetting由六null键变{}、ownKeys顺序变化；两叶timeValue是own undefined，路径为 `$.items.0.timeValue`、`$.items.1.subTree.items.0.timeValue`，JSON正确省略。setup500同样有该编辑器导出形状，不能称“只改value其它字节不变”。

本轮33处descriptor独立自洽检查通过：逐node剔除明确undefinedPaths的own键后，ownKeys顺序严格等JSON实际键；undefined路径父node存在、ownKeys含键、JSON不含键。没有清洗/补null掩盖原件。原过滤语义AND amount>300与OR六店完整，不能据此升级为所有原生shape不变或产品缺陷判断。

S2源码摘要与r001相同：112–114通过filterPasteBinding.current.value取canonical引用，420–435读取simple分页size并处理reset，538–546正常下一页入口active guard、goPage合并及当前view spread调用calcData。该静态核查不证明全部实例同一对象或全Store零写，不重开原C1V002。

## 全部发现与四张PNG的独立判读

四张新PNG均独立实际查看，不能用Builder说明替代看图：

| PNG | 实际内容 | 本轮证据结论 |
| --- | --- | --- |
| before | 500下乐园/南都/果元/水围合并单元格 | 基线可见；raw8行由response确认 |
| after | 200第1页乐园/南都/果元/水围，共14条，页1高亮 | paste第1页可见；raw10行另核 |
| page2 | 水围/香橙两组，共14条，页2高亮 | 与新raw的水围2+香橙2对应；不数边框推4行 |
| edited300 | 乐园/南都/果元/水围，pager未显示 | 与300新raw10行的店铺投影对应；未复用page2旧画面 |

第2页HTTP响应 `21:07:19.357Z`，采样开始19.363，两帧20.653/21.037，结束21.340；两帧及最终PNG摘要均 `dab564c8bb9f472863aee6495b47c66315bc7e6a03f13bc8b98db10fea208ea8`。300响应 `21:07:22.381Z`，采样开始22.396，两帧23.754/24.137，结束24.440；两帧及最终PNG摘要均 `2d31b72baadde61b8b1922175ce6549b2f4ed8a0ae4b64bca3fbab8c64b6a4b0`。

中间两帧仅记录时间与摘要、无独立PNG文件；可复核其摘要等于已实际查看最终原件，不能宣称另有可独立打开的两帧文件。两组帧摘要各自一致且新最终图内容符合本次新raw，支持本场景可见结果。1200ms/300ms不是S2 ready事件或对任意设备/布局的完成保证；本包不证明通用渲染同步机制。r001早采样事实与PARTIAL完整保留，新r002是补采样观察，未修生产代码，不作产品bug修复结论。

## 无save恢复与最终状态

API全程无updateCanvas，saveRequestCount0；`21:07:24.732Z` 到panel/index、editorCount0。重开后 `25.407Z` 出现“存在未保存的修改，立即恢复？ 否 是”，driver明确点“否”并等待hidden，`25.877Z` 隐藏，保留迟到draft处理时序。

seq29原始findById确认保存目标bubble-map200；seq37相同目标的新bubble-map200请求响应与保存树一致。独立CSV聚合江苏2676、浙江2217、广东1868，sum6761，与raw tableRow严格相符。restored.typeControlText为气泡地图、fieldsReady=true，完整descriptor严格等initialTarget与finalDiagnostic，clipboard=null。

最终真实导出read-source/read-dataset/edit-target三unknown、clipboard=null、queryObservation=null；session变为identityEpoch39/editSessionId39/revision35。末态为恢复既有保存bubble-map200；临时table-info/分页/300不保存，不称保存表、恢复liquid或保留area。旧openSaved()期待table-info的函数仍不在本次正常恢复路径，实际为新driver328–343专用恢复。

## 未查原因、同类残余与准入预测

未查全部S2 variant、49型、完整38义务、真实后端允许/拒绝、多用户/组织、分享/嵌入及全console/resource；这些均不属于已释放的本次正常分页/canonical编辑短链，DEV权限测试桩不能替代真实权限。未重新执行UI、DB、产品测试或耗尽预算的C1/C2。单次正确采样不证明任意帧、并发、尺寸和排序稳定性。

同类残余：其它HTTP后立即截图的driver仍可能采旧canvas；任意定时等待不能当通用ready；普通query后paste诊断仍可能指向旧operation；模板残字与旧pageInfo不能替代真实type/HTTP/画面判读。本轮无新增阻断本具体场景的发现，上述限制需随结论保留。

**准入预测：可用新r002有界补齐U1本次“正常S2合法分页→200第2页→canonical编辑300后新query及可见结果”的原缺列，连同本轮save0恢复链接纳，无需机械第三轮或扩全variant。** 累计预算保持2/3，不重开C1实现，不升级完整AC11/P1/Goal。r001 PARTIAL不覆盖、不追认；完整0/49和真实权限/ubo等其它残余不变。

## Read Manifest

卡15 refs、Context14 refs与admission5 refs重复项按绑定层保留；摘要核对不冒充所有文件的全量行为审计。

| 来源 | 原件路径 | SHA-256 |
| --- | --- | --- |
| 卡输入 | `Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/Goal.final.json` | `4db931a6764a8c48345e7e8358e579550a9bc98594bf1654647716d72b9678c4` |
| 卡输入 | `Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/planning/ContextBootstrap-S2CanonicalPagination-r002.json` | `57d018e0cc785ca4de92a73746ae13ea318ecf3e62cc3dba06067a0e37a0463e` |
| 卡输入 | `Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/planning/s2-canonical-pagination-admission-r002.json` | `f04026b2f6a8b83f574d23f39bfa9815534a2cc965b5a34fbec1d6ac0eeaa052` |
| 卡输入 | `Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/planning/Topology-actual-r581.json` | `228ff62795c40a0b1b926f4026818270baa7877fd80a2b1eea31eeeccf722346` |
| 卡输入 | `Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/MVP-20261027/UiIntegrationCases-r002.json` | `e365ef111582ef84f20f26e6136854409b7fc66bb0931cae40a9df5318036d55` |
| 卡输入 | `Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/MVP-20261027/reviews/MvpAcceptanceReadinessReview-r002.md` | `d3f97246db43f9dc705829d94ede73891694b13f21f7f3a9f4a03d748574fbe7` |
| 卡输入 | `Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/MVP-20261027/reviews/TableInfoMissingColumnsValidation-r001.md` | `58900612918bc2f77fd487150893236ab0c999df09e6118b4633d5cfb615a3c2` |
| 卡输入 | `Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/MVP-20261027/runtime-fixtures/TeaMaterialExtended-r001.csv` | `abc8bed0862129d58724bcefff2563862e48d1ea057365ae8d5d2c853e64472b` |
| 卡输入 | `Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/MVP-20261027/runtime-state-tools/observe-s2-canonical-pagination-r002.js` | `03a5ad6831a41f5c57abcd5d804f29705c54f079b59f36bd0a405c01d4f8f580` |
| 卡输入 | `Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/MVP-20261027/evidence/S2CanonicalPaginationToolFreeze-r002.json` | `c67f55eee7d37766622f65508b1069f84a4c4e17d8d777bc3825a756177bc773` |
| 卡输入 | `Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/MVP-20261027/evidence/S2CanonicalPagination-events-r002.json` | `7eb64a3349cfeddaa36349079c1ccf676e7a9b5d3171155b40a80a51cce72119` |
| 卡输入 | `core/core-frontend/src/views/chart/components/views/components/ChartComponentS2.vue` | `50d57d96d863d407e84a6516e958ce06cd8ef144899a05642a0a3343c41bb2f2` |
| 卡输入 | `core/core-frontend/src/views/chart/components/views/index.vue` | `dd88f2ac4f7c5e35f0b07822c72cae0764a3bad11be4a19f23a86d9fb9de3c7b` |
| 卡输入 | `Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/MVP-20261027/reviews/S2CanonicalPaginationValidation-r001.md` | `5e0c8bd3eeb9586a45ad591aee1e5f901bcc6f4e621bbae627a433c4fbc4f272` |
| 卡输入 | `Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/MVP-20261027/evidence/S2CanonicalPagination-events-r001.json` | `44ca1cb7b4b382587cb435ffc46492f6a12f96dd78182c005e53f1a39c71f2cc` |
| Context内层 | `Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/Goal.final.json` | `4db931a6764a8c48345e7e8358e579550a9bc98594bf1654647716d72b9678c4` |
| Context内层 | `Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/MVP-20261027/UiIntegrationCases-r002.json` | `e365ef111582ef84f20f26e6136854409b7fc66bb0931cae40a9df5318036d55` |
| Context内层 | `Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/MVP-20261027/reviews/MvpAcceptanceReadinessReview-r002.md` | `d3f97246db43f9dc705829d94ede73891694b13f21f7f3a9f4a03d748574fbe7` |
| Context内层 | `Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/MVP-20261027/reviews/TableInfoMissingColumnsValidation-r001.md` | `58900612918bc2f77fd487150893236ab0c999df09e6118b4633d5cfb615a3c2` |
| Context内层 | `Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/MVP-20261027/reviews/MapBubbleMissingColumnsValidation-r001.md` | `913b303da557944e6646073788340b63e1c3c18c96835fd8c98c20c451794e56` |
| Context内层 | `Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/MVP-20261027/runtime-fixtures/TeaMaterialExtended-r001.csv` | `abc8bed0862129d58724bcefff2563862e48d1ea057365ae8d5d2c853e64472b` |
| Context内层 | `Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/planning/Topology-actual-r581.json` | `228ff62795c40a0b1b926f4026818270baa7877fd80a2b1eea31eeeccf722346` |
| Context内层 | `core/core-frontend/src/views/chart/components/views/components/ChartComponentS2.vue` | `50d57d96d863d407e84a6516e958ce06cd8ef144899a05642a0a3343c41bb2f2` |
| Context内层 | `core/core-frontend/src/views/chart/components/views/index.vue` | `dd88f2ac4f7c5e35f0b07822c72cae0764a3bad11be4a19f23a86d9fb9de3c7b` |
| Context内层 | `core/core-frontend/src/views/chart/components/editor/editor-style/components/BasicStyleSelector.vue` | `e47191f0772b0458b7ac765d22e5dce2563b0c25c954cc310fb54885a1ca4dcc` |
| Context内层 | `core/core-frontend/src/views/chart/components/editor/filter/useChartFilterCopyMvp.ts` | `b760fffb47db4a8a187cc3dc996d6ddffb5f2b187038da625c5c8e0839d87e5d` |
| Context内层 | `Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/MVP-20261027/runtime-state-tools/observe-s2-canonical-pagination-r002.js` | `03a5ad6831a41f5c57abcd5d804f29705c54f079b59f36bd0a405c01d4f8f580` |
| Context内层 | `Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/MVP-20261027/evidence/S2CanonicalPaginationToolFreeze-r002.json` | `c67f55eee7d37766622f65508b1069f84a4c4e17d8d777bc3825a756177bc773` |
| Context内层 | `Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/MVP-20261027/evidence/S2CanonicalPagination-events-r001.json` | `44ca1cb7b4b382587cb435ffc46492f6a12f96dd78182c005e53f1a39c71f2cc` |
| admission goal | `Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/Goal.final.json` | `4db931a6764a8c48345e7e8358e579550a9bc98594bf1654647716d72b9678c4` |
| admission completion_contract | `Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/MVP-20261027/UiIntegrationCases-r002.json` | `e365ef111582ef84f20f26e6136854409b7fc66bb0931cae40a9df5318036d55` |
| admission context | `Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/planning/ContextBootstrap-S2CanonicalPagination-r002.json` | `57d018e0cc785ca4de92a73746ae13ea318ecf3e62cc3dba06067a0e37a0463e` |
| admission design_review | `Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/MVP-20261027/reviews/MvpAcceptanceReadinessReview-r002.md` | `d3f97246db43f9dc705829d94ede73891694b13f21f7f3a9f4a03d748574fbe7` |
| admission topology | `Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/planning/Topology-actual-r581.json` | `228ff62795c40a0b1b926f4026818270baa7877fd80a2b1eea31eeeccf722346` |
| 实际查看PNG | `Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/MVP-20261027/evidence/S2CanonicalPagination-after-r002.png` | `5de97178452a2e6b702082b50f723fd44b43a9770613b361c36d54db51a751e2` |
| 实际查看PNG | `Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/MVP-20261027/evidence/S2CanonicalPagination-before-r002.png` | `1767972d2262cd5a537679b35e3f6b3441f92ed9b2af12e5a9682fa0816c9c8d` |
| 实际查看PNG | `Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/MVP-20261027/evidence/S2CanonicalPagination-edited300-r002.png` | `2d31b72baadde61b8b1922175ce6549b2f4ed8a0ae4b64bca3fbab8c64b6a4b0` |
| 实际查看PNG | `Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/MVP-20261027/evidence/S2CanonicalPagination-page2-r002.png` | `dab564c8bb9f472863aee6495b47c66315bc7e6a03f13bc8b98db10fea208ea8` |
