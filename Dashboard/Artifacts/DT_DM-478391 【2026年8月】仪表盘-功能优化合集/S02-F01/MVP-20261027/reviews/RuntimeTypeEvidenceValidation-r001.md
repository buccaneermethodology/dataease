# C/G/S 原始运行证据分层独立验证 r001

- reviewed_at：2026-10-30T16:46:59.130182+00:00。
- snapshot_id：`S02-RUNTIME-TYPE-EVIDENCE-VALIDATION-r001`；as_of_state：Topology-r560及下列冻结输入。
- verdict：`PARTIAL_EVIDENCE_RECOMPUTED`（已有数值、完整记录树可复用；缺原件的列保留unknown，不是原实现失败结论）。本原始runtime包首次独立离线验证第1/3轮。
- card canonical SHA-256：`790585c887bbe02d1282686eb8d3437759ae1895884eff40e1f1e4c40c56a69b`。

**81份原paste行投影及4个新时点双轴记录的8侧数据均与独立CSV计算一致，没有发现数学差异。** 17条完整reopenTree覆盖16类型，逐项相等；其余保存记录不按布尔升级。41类型在本C/G/S包有角色记录，8类型明确另包未本轮核。完整类型仍0/49，不将角色或数值观察等同完整验收；P1 12+P2 26=38义务、真实权限BLOCKED/NOT_RUN、插件installed unknown均保留。

## 输入、输出与复算方法

接收端card validate/render均退出0；17处引用含重复Goal，对应16个唯一输入，逐项原字节摘要匹配：

| 输入 | SHA-256 |
| --- | --- |
| `Goal.final.json` | `4db931a6764a8c48345e7e8358e579550a9bc98594bf1654647716d72b9678c4` |
| `TSP.md` | `ae03f58a18373d41a139f8831101e3294b9c80e7252ad48cefb779a4a878acae` |
| `SupportedCharts.json` | `163edf6b7f0a03f99256d02bb10f77c993847513f953a3e4fc743d0500c8dec4` |
| `RuntimeUiProgress-r009.json` | `a87ecfb722413c410d1a72350e1860983b795f362ca37acf5090da75793c773d` |
| `MvpAcceptanceReadinessReview-r001.md` | `fba3b6ad368e085b787cd9a69497f5fb51163397559d718f7596dd014a06d9af` |
| `TeaMaterialExtended-r001.csv` | `abc8bed0862129d58724bcefff2563862e48d1ea057365ae8d5d2c853e64472b` |
| `RuntimeOracle-r001.json` | `4caa318b01266011c27eedefdf6df7c597fde6f5ad7879668fdbbc00016c9fb8` |
| `RuntimeGroupedIndependentOracle-r001.json` | `8bccbb79ea2e85be42587825aff9df386354f5e131b5fc6e9c02622cd6a66421` |
| `RuntimeSpecialIndependentOracle-r001.json` | `1d2be7a22be311e21dbe4d5466cece85a181d7cb642ea63fa14438b3ce9dad98` |
| `Topology-actual-r560.json` | `d0d4b35e90a9e1d8f23cb53de871c61c2765e47ac1760918135bd10378bb6fbf` |
| `RuntimeCartesianBatch-r001.json` | `e6ff8d411a09aab4a842a2fc7df5077711a398ac47be87505f8289c5d7bde8d3` |
| `RuntimeCartesianBatch-events-r001.jsonl` | `9a041d4edeec9d43a8f19d76b17aa64240d41b4c1e212952902042ecee97f8e1` |
| `RuntimeGroupedBatch-r001.json` | `1febfb2e31de74c0421a778593fdb04bef910221d3a89a4be7400230598b96d5` |
| `RuntimeGroupedBatch-events-r001.jsonl` | `312c0ce1f5545a976b1ff62accb3c2a2bd070bd7f761429e9385042d66e3c935` |
| `RuntimeSpecialBatch-r001.json` | `2ffbc700e7e03fabf6f340e42c3ded180d330cdababbb0a7d0592758f30fca66` |
| `RuntimeSpecialBatch-events-r001.jsonl` | `bac70380777e6fead9235d587d58a0dec88efc96a61a1df7d976663f4d057169` |

为保留Grouped引用的原路径事故与console失败，追加读取并复验两份incident及其原始事故副本；不读认证、XPack或私密配置：

| 追加输入 | SHA-256 |
| --- | --- |
| `RuntimeBatchRecorderPathIncident-r001.json` | `9671698954a5566124fd584f838e1a4a3f83d34c30851f6c3dabbb0974c0dd29` |
| `RuntimeGrouped-console-errors-r001.json` | `931ea0f72e3e10bceb1c9a23c21d5e8e808a87564b5ea5e51587805dc8a22d52` |
| `RuntimeBatchRecorderPathIncident-raw-r001.jsonl` | `174adcba86b5939b4f5fd0ff2f32d562a9888af99039f122a2bcada7c1d1668a` |

输出矩阵为 `evidence/RuntimeTypeEvidenceMatrix-r001.json`，SHA-256 `7fea5b5cefad88e8b4c26dc85b1a721ca1c07bb5c8a15f7d0dd9a8f1cc99d468`，恰49个唯一type行。每列有status、layer、原路径/行或JSON pointer，另有153个事件核查索引、独立数学值、历史和按缺列给出的最小动作。known只表示该列指定时点/层次已核；不表示其它变体或相邻更强列已通过。unknown不等于未执行或失败，other_package_not_reviewed不等于当前失败。

独立脚本 `/tmp/validate_runtime_type_evidence_r001.py` SHA-256 `3688bc6e68e64451c0f810cd2743569c86065ba87bfa927bd3cd4d5d164251d8`，执行退出0，候选矩阵结构与摘要另行读回。脚本未调用producer、未执行UI/DB/构建/源码测试，只持久新增本报告和矩阵；临时脚本不作长期唯一证据。未改旧wrapper/events/Goal，也不冒称Session registry或全局Stop Gate校验。

CSV独立解析30行、19列、30唯一id。对真实记录的完整and→amount gt200、嵌套or→六店枚举递归求值，用Decimal计金额；命中ID为3,5,11,12,13,14,15,16,17,18,20,21,23,25，共14行，amount=6761。按shop得到3218/1284/563/1141/555，日期13组及逐组count也与RuntimeOracle一致。未使用响应数值构造expected；G/S已有oracle仅提供冻结轴/聚合规格，全部expected_rows又从CSV重算后交叉核对。

数学行按完整键值多重集比较（保留重复行数量，不只对总和），不假定未记录的SQL排序。过滤树则严格比较类型、null/空串/缺失、分组和数组次序，不做归一化。93个原filterTree（89 paste+4 dual记录）均严格等于完整T200树；5份diagnostic中的10个source/clipboard descriptor重建ownKeys及undefinedPaths均匹配。

## 全部发现与证据上限

### F-T01：大部分source/clipboard/target整树等式仍只有自报布尔

89个paste记录通常只有一份filterTree与treeEqualsClipboard=true。可复核该完整树与冻结条件一致，不能凭这一布尔独立重建三份实际对象，更不能证明深拷贝、引用隔离或所有字段的原生缺失语义。逐行矩阵保持full_source_clip_target_equality=unknown。

例外可复用的是Grouped第36行成功diagnostic：完整request.customFilter、clipboard.tree及成功后当前target source.tree能够逐项比较，clip/target相等已核；该记录与第37行paste投影属于同一恢复后观察，不重复计为两个独立成功操作。即使这里clip/target已核，原source图表复制前原件仍未在本包单独落盘。10个descriptor通过不扩大为89次都具备ownKeys捕获。

最小动作：先查既有完整source/clip/target原件，缺原件时只补树对账列，不重跑已核数值或完整两向批次。独立slice既有深拷贝测试可按其层次复用，但不冒充本事件三树的原始实测副本。

### F-T02：保存标记存在，完整重开树仅17事件／16类型，且不能跨配置变体补列

C有13条完整reopenTree；G只有第6/9/12/15行4条（percentage-bar-stack/bar-group/bar-group-stack/bar-stack-horizontal）。合计17事件，bar-stack-horizontal重复，因此16类型。全部整树逐项等于完整T200，包括field:null、valueType:null、dynamicTimeSetting六null键和六店数组次序。

另25个保存事件没有reopenTree：G第3/18/25/29/32/38/42/45行，以及S第3/6/9/12/15/18/21/24/27/30/33/36/39/42/45/48/66行。它们保留savedViaNormalUi/datasetPageObserved/treeMatches、clipboard:null等观察，不能写“从未保存”，也不能凭treeMatches=true算整树已独立核。

尤其area-stack/bar-stack的C单系列保存有整树，G多系列对应保存只有标记；矩阵标成some_recorded_variants_only，并逐行列recorded_only_markers，不把同type的另一次保存倒填当前配置。39类型有保存记录，line/indicator本包无专属保存事件；先查r009引用的已有base包，而非要求重做。

保存HTTP请求、findById完整响应、明确panel/editor DOM0退出及重开结果行在这些C/G/S记录中均不足。矩阵将“UI记录标记”“完整reopenTree”“重开结果”“原始HTTP链”分列。**HTTP链列unknown不是追加每类型必须重新抓HTTP的验收要求**；可用已存在的真实UI/读回原件补相应列，缺什么补什么。

### F-T03：四类mix后补数据通过，但不追认旧8条缺rows事件

S第37/40/43/46行旧paste及第55/57/59/61行新paste均没有rows。新第56/58/60/62行dual_axis_query分别对应chart-mix-dual-line/chart-mix/chart-mix-group/chart-mix-stack，左右轴8个投影独立核对通过：左侧open按shop或shop+series/city分组，右侧target按shop分组。

每个后补记录与紧邻新paste的type、operationId(1/2/3/4)、完整filterTree相同且时间后继，矩阵记录此关联；operationId在旧会话可重用，不能仅因id=1把02:46新记录拼到02:39–40旧记录。后补原件没有独立HTTP targetId/session全绑定，因此只称新时点诊断/查询投影，不补成历史原请求response。

该4型已有新时点双轴数值证据，**无需再采数值**；旧rows缺失保持unknown，另有保存树或重开结果缺列才最小补齐。

### F-T04：queryType/逻辑次数与结果投影通过，不冒充物理HTTP完整链

89个paste投影的queryType均等于targetType、logicalGetDataCalls=1、outcome=success；81份带rows的事件完整数学多重集通过，覆盖36个target类型；4个mix另有后补双轴数值，合计40个target类型有本包某时点数值。line在C第1行仅作为source，target记录在r009所指其它base包，本轮不伪造其target列。

记录是应用诊断/Builder运行投影，没有独立物理request/response/header/status链，不能从logical=1推出physical HTTP=1或HTTP200/code0。89个paste日志也不是89个独立用户/数据样本；同operation的diagnostic、paste与dual记录可为同一操作多种投影。本报告统计记录数，不相加制造query总数。

### F-T05：首次失败与后续恢复、交互错误及截图事故均保留

- G33/G34：progress-bar operation1/2均preparation_unavailable、逻辑0；正常应用轴并更新后G36 operation4 success、逻辑1，G37为同一成功的paste投影。恢复不写成首次成功，也不声称改源码修复。
- G39：gauge早于renderer ready的诊断为failure/paste_busy；G40/41随后成功。amount6761的数值已核，但默认量程/饱和显示尚不能由此判对；root正在另包补gauge/liquid的新时点，本轮不等待或纳入。
- S63：rich-text默认空内容一次paste_render_failed、逻辑1，target树为空对象、clip保留；S64/65非空内容双向成功另计，S66保存标记不反证空内容问题已修。
- G24/G28：area-stack/waterfall草稿恢复提示，选择否；只保留当时恢复观察，不统一归因产品缺陷。
- 实际console原件有circle-packing（02:11:47.481Z）和progress-bar（02:17:30.184Z）各一条trackClick读取undefined.type，矩阵在对应type保留recorded_console_error。不能只保留圆形填充一条，也不能把它们归因为paste或由数值正确关闭交互残余。
- 路径事故原件55行中前41行字节摘要与当前C完全相同；14个迁移事件逐项在G第1/2/4/5/6/7/8/9/10/11/12/13/14/15行找到完全相同对象，原C数据与迁移内容可追溯。旧bar-stack-horizontal单系列spinner截图曾被多系列同名文件覆盖，不再作为原图证明；C17另有render_observation及独立最终绘制图指针。本轮没有查看这些图片或把可覆盖路径当冻结图像。

## 类型专属oracle及未覆盖语义

Grouped逐事件独立按shop、shop+series、shop+city或三维分组，progress-bar另核target求和；百分比堆叠这里只核原始金额投影，不证明渲染归一化百分比正确。Special还独立核：multi-scatter原始14行日粒度投影；quadrant/range/bidirectional按13日求和；stock-line的open/close/low/high四合成指标按日SUM；bullet的open/target；box-plot按shop+series计算open中位数。没有将箱线图中位数当全四分位/whisker视觉验证，也没有把合成OHLC的SUM当真实金融OHLC语义。

rich-text仅一组结果，独立核该行属于全部5组CSV聚合，不能在无排序承诺下硬写首组选择或全量6761输出。gauge/liquid查询6761只到数据层，量程显示与单位保留E3。所有树值与金额投影已核不代表styles/axes/hidden轴/事件/SDK生命周期都正确；stock-line继承隐藏轴额外线条等旧残余继续。

## 49行分层矩阵摘要

S/T仅表示原日志记录了该角色，不表示三树副本或完整类型通过。表中“整树”仅指对应列列出的实际时点；具体行/层/变体及最小动作见JSON。

| type | 角色记录 | target数值层 | 正常保存离开重开记录 | 完整reopenTree |
| --- | --- | --- | --- | --- |
| `area` | S/T | 原paste行已核 | 有记录标记 | 有完整整树 |
| `area-stack` | S/T | 原paste行已核 | 有记录标记 | 部分变体有整树 |
| `bar` | 另包未本轮核 | 另包未本轮核 | 另包未本轮核 | 另包未本轮核 |
| `bar-group` | S/T | 原paste行已核 | 有记录标记 | 有完整整树 |
| `bar-group-stack` | S/T | 原paste行已核 | 有记录标记 | 有完整整树 |
| `bar-horizontal` | S/T | 原paste行已核 | 有记录标记 | 有完整整树 |
| `bar-range` | S/T | 原paste行已核 | 有记录标记 | 仅标记缺整树 |
| `bar-stack` | S/T | 原paste行已核 | 有记录标记 | 部分变体有整树 |
| `bar-stack-horizontal` | S/T | 原paste行已核 | 有记录标记 | 有完整整树 |
| `bidirectional-bar` | S/T | 原paste行已核 | 有记录标记 | 仅标记缺整树 |
| `box-plot` | S/T | 原paste行已核 | 有记录标记 | 仅标记缺整树 |
| `bubble-map` | 另包未本轮核 | 另包未本轮核 | 另包未本轮核 | 另包未本轮核 |
| `bullet-graph` | S/T | 原paste行已核 | 有记录标记 | 仅标记缺整树 |
| `chart-mix` | S/T | 新时点双轴已核；旧行缺失 | 有记录标记 | 仅标记缺整树 |
| `chart-mix-dual-line` | S/T | 新时点双轴已核；旧行缺失 | 有记录标记 | 仅标记缺整树 |
| `chart-mix-group` | S/T | 新时点双轴已核；旧行缺失 | 有记录标记 | 仅标记缺整树 |
| `chart-mix-stack` | S/T | 新时点双轴已核；旧行缺失 | 有记录标记 | 仅标记缺整树 |
| `circle-packing` | S/T | 原paste行已核 | 有记录标记 | 仅标记缺整树 |
| `flow-map` | 另包未本轮核 | 另包未本轮核 | 另包未本轮核 | 另包未本轮核 |
| `funnel` | S/T | 原paste行已核 | 有记录标记 | 有完整整树 |
| `gauge` | S/T | 原paste行已核 | 有记录标记 | 仅标记缺整树 |
| `heat-map` | 另包未本轮核 | 另包未本轮核 | 另包未本轮核 | 另包未本轮核 |
| `indicator` | S/T | 原paste行已核 | 本包未留 | 本包未留 |
| `line` | 仅S（target另包） | 本包无target数值 | 本包未留 | 本包未留 |
| `liquid` | S/T | 原paste行已核 | 有记录标记 | 仅标记缺整树 |
| `map` | 另包未本轮核 | 另包未本轮核 | 另包未本轮核 | 另包未本轮核 |
| `multi-scatter` | S/T | 原paste行已核 | 有记录标记 | 仅标记缺整树 |
| `percentage-bar-stack` | S/T | 原paste行已核 | 有记录标记 | 有完整整树 |
| `percentage-bar-stack-horizontal` | S/T | 原paste行已核 | 有记录标记 | 仅标记缺整树 |
| `picture-group` | 另包未本轮核 | 另包未本轮核 | 另包未本轮核 | 另包未本轮核 |
| `pie` | S/T | 原paste行已核 | 有记录标记 | 有完整整树 |
| `pie-donut` | S/T | 原paste行已核 | 有记录标记 | 有完整整树 |
| `pie-donut-rose` | S/T | 原paste行已核 | 有记录标记 | 有完整整树 |
| `pie-rose` | S/T | 原paste行已核 | 有记录标记 | 有完整整树 |
| `progress-bar` | S/T | 原paste行已核 | 有记录标记 | 仅标记缺整树 |
| `quadrant` | S/T | 原paste行已核 | 有记录标记 | 仅标记缺整树 |
| `radar` | S/T | 原paste行已核 | 有记录标记 | 有完整整树 |
| `rich-text` | S/T | 原paste行已核 | 有记录标记 | 仅标记缺整树 |
| `sankey` | S/T | 原paste行已核 | 有记录标记 | 仅标记缺整树 |
| `scatter` | S/T | 原paste行已核 | 有记录标记 | 仅标记缺整树 |
| `stock-line` | S/T | 原paste行已核 | 有记录标记 | 仅标记缺整树 |
| `symbolic-map` | 另包未本轮核 | 另包未本轮核 | 另包未本轮核 | 另包未本轮核 |
| `t-heatmap` | S/T | 原paste行已核 | 有记录标记 | 仅标记缺整树 |
| `table-info` | 另包未本轮核 | 另包未本轮核 | 另包未本轮核 | 另包未本轮核 |
| `table-normal` | S/T | 原paste行已核 | 有记录标记 | 仅标记缺整树 |
| `table-pivot` | S/T | 原paste行已核 | 有记录标记 | 仅标记缺整树 |
| `treemap` | S/T | 原paste行已核 | 有记录标记 | 有完整整树 |
| `waterfall` | S/T | 原paste行已核 | 有记录标记 | 仅标记缺整树 |
| `word-cloud` | S/T | 原paste行已核 | 有记录标记 | 有完整整树 |

bar/bubble-map/flow-map/heat-map/map/picture-group/symbolic-map/table-info八行明确other_package_not_reviewed，并引用已绑定准备报告的对应类型行。Special旧配置404、经纬度不足或图片入口中断只是该旧包历史，不能覆盖这些类型之后其它包已有成果，也不能当本轮当前失败。矩阵没有读取其它包原始数据，亦不替其独立报告重新发判决。

## 已查无问题、未查原因、同类残余与准入

已查无问题：16唯一绑定输入、wrapper→event/oracle引用摘要、153原事件完整盘点、89paste的type/逻辑计数/状态、81原rows与4双轴8侧、原oracle全部expected_rows与CSV重算、14行命中IDs及shop/day金额和count、93整filterTree严格比较、17完整reopenTree、10个lossless descriptor、路径事故前缀/迁移内容及两条console原件、49类型集合与8另包边界。没有发现本次已捕获数值、整树或独立oracle自身矛盾。

未查：原生动作日志独立复演、未留三树/完整保存读回/重开结果、物理HTTP、图片当前字节/视觉QA、真实权限、插件实现/installed全数、其它8型原包、全部负向或2401配对、产品最终diff/完整P1验收。当前任务只授权已有C/G/S离线核证；未检查不转成失败，不新增每类型全负向要求，不因记录工作倒退已发生操作。

同类残余是投影、原始载荷和运行验收之间的边界：一个布尔不能代多份原对象；同type不同配置、后补新时点和早失败不能互相倒填；聚合相等不独立证明服务器实际matched ID全量相同；诊断逻辑计数不等于完整网络。expected命中ID由CSV独立得出，不声称每个聚合响应都返回实际record id。

最小下一动作依序：先复用本轮已经通过的数值及17整树，4mix不再重查数值；再按矩阵具体缺行定位已存在source/clip/target原件、25个仅标记保存变体及重开结果，确无原件才在必要的同一次正常读回中补对应列；line/indicator和八另包先交叉引用既有原件，不重跑两向。量程由正在执行的独立新包处理；S039准备、C2/图片/原负向等旧实现审查均不重开。

本报告可用作有界证据复用与缺列清单，不能作为49类型或P1最终通过。当前数值层无新实现阻断，主要是证据列未知与已存在交互/共享残余。此原始runtime包首次独立审查1/3，剩余2/3不强制用完；后续有实质新差异才另行安排，不制造整包重跑。没有修改Dashboard/KB、发布、提交或Goal终态。
