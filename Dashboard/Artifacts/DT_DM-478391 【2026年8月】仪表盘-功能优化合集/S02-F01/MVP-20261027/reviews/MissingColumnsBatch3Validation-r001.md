# MissingColumnsBatch3 六类型新运行证据独立验证 r001

- reviewed_at：2026-10-30T18:37:27.207496+00:00；reviewer/source：`/root/bubble_ready_validator_resumed`。
- snapshot_id：`S02-MISSING-COLUMNS-BATCH3-VALIDATION-r001`；mode：`full_baseline`；as_of_state：本卡冻结的六型 r003 事件、driver、freeze、Context、admission、18张原PNG与旧r002失败原件，写报告前再次核对引用摘要无漂移。
- **本局部新运行交付首次第1/3轮**。r003是运行文件修订号，不是第三轮审查；不重开旧实现、设计、原负向、Slice A或其它已耗尽的三轮预算。
- 卡canonical SHA：`1eee15f926d8475d861d23b212611f2e5927d83e7ba901f47bcac06a6e336688`；接收端已validate/render并消费prompt。本轮沿用项目内 sge-governed-checkpoints 的Validation路由。
- 唯一持久输出为本报告；未执行产品UI、HTTP、DB、构建、安装或产品测试，未修改源码/driver/Context/admission/旧证据；未访问认证信息或XPack实现。

## 裁决与独立性

**PASS_WITH_BOUNDS（六类型这一次正常补列运行证据有界通过），新增阻断0，保留3项非阻断发现及历史残余。** 可以把 scatter、circle-packing、funnel、radar、treemap、table-normal 的本轮实际类型、正常source复制/target粘贴、CSV分组结果、显式保存、panel退出再重开等已核列，吸收到对应执行证据表。不能把此裁决升级为六型全部AC完成、P1通过或Goal完成。

独立只读复算共 **696项证据断言：693满足、3处全量配置相等断言不满足**；三处均是scatter/funnel/radar的yAxis在save→find省略两个前端附加键，下面逐项保留。没有通过删键归一化把初次结果改成696全绿。CSV、筛选整树、结果、实际类型、保存离开重开链未发现新的实质失败。

Reviewer此前参与首型area观察器候选编写；这六型r003由root修改、执行和采集。本报告独立核查新CSV/原HTTP/descriptor/截图/绑定材料，不对自己旧observer基础进行独立实现验收，也不把日志复算称为本Reviewer亲自执行的独立runtime。

原始义务 **38项（P1=12、P2=26）**、49内置类型分母保持；完整类型仍 **0/49**。真实权限仍`BLOCKED/NOT_RUN`，插件installed总数unknown。本报告不改Goal、Dashboard生命周期、Coverage或已冻结结论。

## 原合同与证据入口

本卡只覆盖原AC01和AC09的本次正常路径局部：

- AC-MVP-F01-01：全部eligible类型均能作为source复制、target粘贴同dataset有效基本多条件整树；本轮六型是原分母中的补列，不以六型替换49。
- AC-MVP-F01-09：既有显式正常保存后离开编辑器再重开，完整基本树/分组/运算符/值与实际结果一致；本轮不涉及保存失败的拒绝/恢复路径，不据此关闭该AC全部范围。

读取并复用Goal、UiIntegrationCases-r002、准备审查r001、Slice A最终r003及卡内全部原件；没有把Builder handoff的布尔、文件名或旧stage名当作oracle。`MissingColumnsBatch3-r001.json` SHA为`16b65721b408c95fc0bd4d78d7633f20b12009566b011a13877567f3ff51b7fd`，仅作交接索引。

卡58处引用、57个唯一文件全部SHA匹配；逐型Context内11个required refs，共66次path+SHA匹配；逐型admission的Goal/Contract/Context/Design/Topology五依赖，共30次匹配。6份均approved/action=builder，target均为`local://127.0.0.1:7070/dataeasev3/S02_MVP_Runtime_20261027`；freeze/admission早于对应运行，freeze/start/end/current driver SHA一致。摘要匹配只证明绑定未漂移，不自动证明全部topology文字准确。

本次实际同一专用fixture身份：resource=`1312476889213964288`、dataset=`1312472054565572608`、target=`7520752064427724800`；source500=`7520741153101058048`、source200=`7521402539875504128`。截图标题仍为“指标卡”，实际类型以原getData/save/find中的type及渲染形态交叉判断。

## CSV与树的独立oracle

CSV为`runtime-fixtures/TeaMaterialExtended-r001.csv`，SHA `abc8bed0862129d58724bcefff2563862e48d1ea057365ae8d5d2c853e64472b`。以Decimal独立递归解释实际AND/OR树，按shop分组并对amount求和，以键值多重集比对，不假定SQL排序。条件为amount大于200或500，并与shop在{果元店、南都店、香橙店、乐园店、红叶店、水围店}的分组树相与。

| threshold | CSV命中行ID | 行数 | 总额 | shop分组金额 |
| --- | --- | ---: | ---: | --- |
| 200 | 3,5,11,12,13,14,15,16,17,18,20,21,23,25 | 14 | 6761 | 果元店3218、南都店1284、乐园店563、水围店1141、香橙店555 |
| 500 | 3,5,11,13,16,18,21,25 | 8 | 5093 | 果元店2670、南都店1284、乐园店563、水围店576 |

独立重建66个实际diagnostic stage capture中的96份source/clipboard descriptor，tree、ownKeys、undefinedPaths逐项核对，undefinedPaths均为空。source复制前后整树不变、clip整树等于source；baseline目标等于paste前目标；paste后target等于clip，clip本身及其生命周期字段不变；再正常复制该类型作为source时，source/clip完整descriptor一致且revision递增；重开source等于采用后树，clip=null且`clipboard_empty`。

每型原HTTP候选responseData完整等于诊断queryObservation.responseData；再分别核各型渲染投影，不能仅凭诊断的outcome=success。正式baseline、candidate、reopen均为shop字段`1793083721149`分组、amount字段`1793083721146`的sum，结果符合上表。

第一次独立检查器把所有configuration自动query也假定有shop，遇table-normal切型后的空xAxis查询而KeyError。保留此检查器失败：该配置阶段返回单聚合5093、data field为空，并非正式baseline/candidate。仅修正检查器按实际xAxis重算配置期查询，原始证据未改；正式三阶段仍严格要求shop/amount字段及sum。此处不误报产品失败，也不把配置自动query算成candidate重复请求。

## 六型实际运行与保存链

所有时间为2026-10-30 UTC。每型api数组有40条非认证请求；wire有9条：configuration1、baseline1、candidate1、save1、find1、重开getData4（target1与其它view3），共getData7。各正式candidate窗口均`[13,14)`，目标物理getData=1、logicalGetDataCalls=1，target/type/operation identity正确。HTTP200且业务code0；每型saveRequestCount=1，未把其它view重开请求归到目标candidate。

| type | baseline→candidate（threshold/总额） | baseline / candidate / reopened target HTTP时间 |
| --- | --- | --- |
| scatter | 200/6761 → 500/5093 | 18:17:13.356 / 18:17:16.103 / 18:17:18.261 |
| circle-packing | 500/5093 → 200/6761 | 18:20:13.871 / 18:20:16.397 / 18:20:18.503 |
| funnel | 200/6761 → 500/5093 | 18:20:22.588 / 18:20:25.171 / 18:20:27.317 |
| radar | 500/5093 → 200/6761 | 18:20:31.801 / 18:20:34.368 / 18:20:36.492 |
| treemap | 200/6761 → 500/5093 | 18:20:40.922 / 18:20:43.505 / 18:20:45.633 |
| table-normal | 500/5093 → 200/6761 | 18:20:50.028 / 18:20:51.328 / 18:20:53.363 |

保存使用原`/api/dataVisualization/updateCanvas`，同resource/snapshot的`findById`读回实际类型及完整customFilter，再检查重开的目标getData。退出使用driver正常`page.goto`到panel路由并等editor诊断/back-icon隐藏，editorCount=0；**这不是工具栏back点击**，不套用旧area helper的描述。实际时序为save响应→panel0→新find请求→新target query：

| type | save请求 / 响应 | panel0 | 新find请求 | 新target query |
| --- | --- | --- | --- | --- |
| scatter | 18:17:17.373 / 18:17:17.482 | 18:17:17.696 | 18:17:17.859 | 18:17:18.261 |
| circle-packing | 18:20:17.629 / 18:20:17.734 | 18:20:17.947 | 18:20:18.105 | 18:20:18.503 |
| funnel | 18:20:26.428 / 18:20:26.540 | 18:20:26.753 | 18:20:26.907 | 18:20:27.317 |
| radar | 18:20:35.611 / 18:20:35.723 | 18:20:35.939 | 18:20:36.094 | 18:20:36.492 |
| treemap | 18:20:44.727 / 18:20:44.855 | 18:20:45.071 | 18:20:45.231 | 18:20:45.633 |
| table-normal | 18:20:52.461 / 18:20:52.577 | 18:20:52.792 | 18:20:52.942 | 18:20:53.363 |

每型driver起止时间也核对如下；6型的pageErrors=[]，共享runtimeErrors计数均1→1，不能写成“全局console零错误”。

| type | startedAt | finishedAt |
| --- | --- | --- |
| scatter | 2026-10-30T18:17:10.618Z | 2026-10-30T18:17:20.261Z |
| circle-packing | 2026-10-30T18:20:11.256Z | 2026-10-30T18:20:20.107Z |
| funnel | 2026-10-30T18:20:20.120Z | 2026-10-30T18:20:29.219Z |
| radar | 2026-10-30T18:20:29.227Z | 2026-10-30T18:20:38.420Z |
| treemap | 2026-10-30T18:20:38.429Z | 2026-10-30T18:20:47.522Z |
| table-normal | 2026-10-30T18:20:47.537Z | 2026-10-30T18:20:54.751Z |

## 18张原图的实际观察

已查看每型before/after/reopened原PNG，不以摘要校验替代视觉查看。18张签名、CRC、zlib和SHA均有效，均419×316、8-bit RGB。观察范围为目标裁图，不是整页所有视觉AC；重开图偶有toast/选择柄裁边，不把前后PNG字节差异当成结果不一致。

| type | before→after及reopened观察 | 证据上限 |
| --- | --- | --- |
| scatter | 5点→4点，金额轴与分组变化对应6761→5093，重开保持 | 标签是金额×100后的百分号格式，详见NB02；未验证普通金额标签 |
| circle-packing | 4圆→5圆；2670/1284/576/563变为3218/1284/1141/563/555，重开保持 | 未量测圆面积的精确像素比例 |
| funnel | 5层→4层，金额标签与分组匹配，重开保持 | 未做空数据/长文本/尺寸回归 |
| radar | 4轴→5轴，金额标签和轮廓变化，重开保持 | 未逐项量测类别角度和像素位置 |
| treemap | 5块→4块，金额与占比相符；3218/6761约47.60%，2670/5093约52.42%，重开保持 | 未量测精确矩形面积 |
| table-normal | 真实S2的shop/amount两列，4行→5行，各值符合CSV，重开保持 | 按表格协议检查，不能硬套折线或通用G2画面证明 |

## 全部发现与处置

### NB01：三型yAxis的两个UI附加键读回省略（非阻断，保留原始差异）

scatter/funnel/radar的baseline yAxis=candidate yAxis=save yAxis；save→find仅有：

| 路径 | save值 | find/reopened请求 |
| --- | --- | --- |
| yAxis[0].axisType | `yAxis` | 缺键 |
| yAxis[0].seriesId | `1793083721146-yAxis` | 缺键 |

find yAxis与reopened请求yAxis相等；字段id、originName、deType、summary=sum等其余键值保持，筛选整树及结果不变。circle-packing/treemap/table-normal的yAxis全量相等。所有六型的customAttr/customStyle/xAxis及其它轴在baseline→candidate→save→find→reopen全量相等。

公开源码给出有界解释：LabelSelector.vue:60–84映射追加axisType/seriesId，TooltipSelector.vue:398–408会直接附加这两个键；ChartViewBaseDTO.java:83–84的yAxis为List<ChartViewFieldDTO>，该DTO及ChartViewFieldBaseDTO、DatasetTableFieldDTO均没有这两个字段；ChartViewManege.java:453–460/520–525/550–558的读写经过typed DTO/JSON转换，JsonUtil.java:26容忍未知属性。这个静态链与观察的省略相符，未验证运行后端二进制与当前源码逐文件相同，不冒充因果定位或所有保存实现审计。

原AC09要求完整基本筛选树和实际结果保持，本次无这两者损失，因此本局部不阻断。**不得改写成全部配置逐键/逐字节持久恢复**；如未来合同要求UI附加键也持久化，再另行界定，不在本轮代修。

### NB02：scatter标签按继承percent配置显示（非阻断，限制可见语义声明）

scatter原保存customAttr.label.labelFormatter.type=percent、decimalCount=2、thousandSeparator=true。实际标签如3218显示321800.00%（可带千分位），不是普通金额，也不是店铺占总额比例。公开G2 scatter.ts:242–253把d.value交给valueFormatter；formatter.ts:95–97将percent值乘100、151–154追加百分号。画面与这份真实配置和公式相符，CSV金额/点数变化仍可核对。

本轮不宣称scatter普通金额标签或占比标签通过；不把继承显示配置自动归因为新源码缺陷，也不把新增普通金额标签验收设为本局部的额外前置。

### NB03：driver/Context/topology描述残留（非阻断，不能按stage名提升语义）

六个driver实际case_id/type/selector/目标匹配器及save/find type已按新类型，Context objective/write_scope与实际类型相符；仍有schema_version=`s02_area_missing_columns_observation_v1`、“仅首型area/切area/area-stack”、`AREA_*`错误码、`initial_target_liquid500_reported`等旧stage/notes/limits。Context forbidden_actions仍有“当前area200…”旧措辞，reason保留前作者仅syntax校正等历史文字。不能依这些名字把本轮错记为area、liquid500或其它threshold；本报告采用原请求、整树、实际finalState和原图判断。

各Context与admission绑定Topology-r574，摘要正确；其文字仍是role final/four-type prevalidation，未单列本Batch3 checkpoint。因此不宣称“SHA匹配即证明实际topology记录已完整”。建议后续执行台账准确吸收本报告与实际执行者，历史原件保持冻结；这不是追溯改写准入或另开旧实现审查的理由。本轮只判断同一已声明专用fixture的六型补列，未见由这些描述残留导致UI/DB范围扩大。

## 旧失败、恢复与同类残余

- scatter r002：18:14:35.744–18:14:38.458，configuration中的`getByText('数据集', exact:true)`命中2元素strict violation；save=0，未到candidate。其恢复panel0后读回lastsaved200，completed=true。旧case_id为AREA-r001不能提升为六型成功样本。r003是另一次完整成功运行，不能覆盖首次失败事实。
- circle-packing r002：18:17:20.273–18:17:33.161，configuration等`.chart-type-style-light:visible`隐藏超时10秒；save=0，未到candidate。恢复panel0读回lastsaved scatter500、completed=true。r003使用已有类型trigger正常toggle关闭菜单后独立完成。首次失败不删除、不合并成“从未失败”。
- r001 preflight-only及未实际执行的其它r002均不计产品运行或成功样本，不按文件版本号累计产品覆盖。
- 既有circle trackClick console TypeError仍独立未决；本6型pageErrors空、runtimeErrors1→1仅说明本次未新增该数组计数，不能关闭历史异常，也不与C2V-005/ubo建立未经证明的因果。
- 本批最终专用target明确保存为**table-normal200**。各中间类型有各自显式保存并重开；未恢复原liquid、全部hidden配置或原用户状态。
- C2/地图/图片/旧负向/Slice A等既有预算与残余按原冻结结论保留；本报告不要求额外机械下一轮，不借本批重开它们。

## 已查无问题维度、未查及准入预测

已查未见本局部新增问题：原Goal/AC不缩分母；57个唯一卡输入与96次Context/admission引用未漂移；6 driver冻结/执行hash稳定；真实type和fixture身份相符；CSV独立聚合；整树/descriptor复制与生命周期；候选物理1/logical1；正常source再复制；save1与同snapshot find；panel0后重开空clip；正式结果与各自渲染投影；18张原图与格式；失败原件和恢复可追溯。发现NB01–03均已完整列出，未要求Builder代修。

未查及原因：本lane只读原件，未独立运行浏览器/HTTP/DB；未重新审计全部源码diff、通用observer实现或后端构建身份；未验证所有尺寸、空数据、长文本、销毁事件、移动端、嵌入、所有数据库/Profile；未重复其它43型、所有source-target配对及所有负向；未验真实权限多身份/撤权、插件安装清单；未承担最终KB/Dashboard/full diff/post-closeout reconciliation/Stop Gate。它们不因局部数据链通过而自动满足。

准入预测：**当前即可在保留NB01–03与历史残余的前提下吸收这六型已核正常列；无需为本包机械发起第二轮。** 若交付者后续修改证据或提出更强声明，按实际delta及剩余预算处理；本轮并不保证更广AC或完整类型验收准入。下一步应复用本报告继续核原分母的剩余缺列，不能由本lane更新完整0/49或自行关闭原38项。

## 冻结Read Manifest

以下基于报告写前再次实际SHA读回；路径相对于仓库根，重复Goal引用只列一次（58处/57唯一）。未把文件散列或此manifest本身充当运行通过证据。

| 路径 | SHA-256 |
| --- | --- |
| Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/Goal.final.json | 4db931a6764a8c48345e7e8358e579550a9bc98594bf1654647716d72b9678c4 |
| Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/MVP-20261027/UiIntegrationCases-r002.json | e365ef111582ef84f20f26e6136854409b7fc66bb0931cae40a9df5318036d55 |
| Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/MVP-20261027/runtime-fixtures/TeaMaterialExtended-r001.csv | abc8bed0862129d58724bcefff2563862e48d1ea057365ae8d5d2c853e64472b |
| Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/MVP-20261027/reviews/MvpAcceptanceReadinessReview-r001.md | fba3b6ad368e085b787cd9a69497f5fb51163397559d718f7596dd014a06d9af |
| Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/MVP-20261027/reviews/SliceARolePortsValidation-r003.md | 726720f12d85ec48a459d53058351d9e7580a267f3a696fa7f08587e73d58e28 |
| Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/MVP-20261027/evidence/MissingColumnsBatch3-r001.json | 16b65721b408c95fc0bd4d78d7633f20b12009566b011a13877567f3ff51b7fd |
| Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/planning/Topology-actual-r574.json | ae94415311da84c84989f93cb16c26d6db7fcdc0052498d7b49718a0b2f352e5 |
| Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/MVP-20261027/evidence/ScatterMissingColumns-events-r003.json | eeed02bf749150e9da0fe508b25b61d59ad148862171d987442f48b9b6fbfbf0 |
| Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/MVP-20261027/evidence/ScatterMissingColumnsToolFreeze-r003.json | a02c469ea84468ad31567055437d463079ee4954d701ecfbedc186df761ee5f8 |
| Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/MVP-20261027/runtime-state-tools/observe-scatter-missing-columns-r003.js | 77ffc84a5079028e39c438b734dac4945f9b0723e63986622197c364bc21b8a5 |
| Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/planning/ContextBootstrap-ScatterMissingColumnsRuntime-r003.json | 335e80c8251df19ccd99ae71887b1ab02e5f416833d19c03aabdb241f53522e7 |
| Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/planning/scatter-missing-columns-runtime-admission-r003.json | e68c143ee1e75950634704248b795de6344879dd837cb541fcb840659584146e |
| Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/MVP-20261027/evidence/ScatterMissingColumns-before-r003.png | 498bdafa1ad023ad269b7e2945a7eb0221a41ea7e9e6cb648229040d97f111cb |
| Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/MVP-20261027/evidence/ScatterMissingColumns-after-r003.png | 636b87ddf35e1b39fd856db5a595dfadb9c325fc3aa2a6f808acfa6a89f1700f |
| Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/MVP-20261027/evidence/ScatterMissingColumns-reopened-r003.png | 79b80111d0d293ba4c8250ec9b9ca2cdb0e3eca2f94081f58e9867ece68fad0e |
| Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/MVP-20261027/evidence/CirclePackingMissingColumns-events-r003.json | 524f168aecb39fa8165ed9ed8dfda6f7c8ef1755dfc29abb32b4377cd90cc3ca |
| Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/MVP-20261027/evidence/CirclePackingMissingColumnsToolFreeze-r003.json | 897ecb685491a4448bac4cf6cf69721830ddf569a5bcd9aa8c794242f6161a3e |
| Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/MVP-20261027/runtime-state-tools/observe-circle-packing-missing-columns-r003.js | adbc1502bec886c2e9ba288c7b7a02506f11b5fc75b46e2c13914953f61352d4 |
| Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/planning/ContextBootstrap-CirclePackingMissingColumnsRuntime-r003.json | 8e6d39c3b05c4a0cdcc1c0495b238111d555f1fc92518da99e3087506b15f118 |
| Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/planning/circle-packing-missing-columns-runtime-admission-r003.json | 49b6b81c1405d15194b6c409bd5769b6bda31d2af927dd5705ad1ccdd507e018 |
| Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/MVP-20261027/evidence/CirclePackingMissingColumns-before-r003.png | 7ef6f34a44870881860df6fbc6f99bc89b7cfd0aa194e9bc4d0caa39c12cba70 |
| Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/MVP-20261027/evidence/CirclePackingMissingColumns-after-r003.png | 47ead115a273c61cdaa6775cb2d96cb5d352b5d7933b2fc382d31658a3384f36 |
| Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/MVP-20261027/evidence/CirclePackingMissingColumns-reopened-r003.png | 72fd214a9b749c622350e703a709359a8ddfea18d6977f1d0c4ea39cac39a054 |
| Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/MVP-20261027/evidence/FunnelMissingColumns-events-r003.json | bb8f05df5f6875f2f2c33f6a097da9c6496178ffbf08659b68c810b0de23a41c |
| Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/MVP-20261027/evidence/FunnelMissingColumnsToolFreeze-r003.json | 266375cde0bc068ac584eb9cd40d5254924c0253f473906474ded5495692ee00 |
| Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/MVP-20261027/runtime-state-tools/observe-funnel-missing-columns-r003.js | a44adc6e87af7d3853d30b19215a4367bad5690830a388d0828aee84042b03c0 |
| Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/planning/ContextBootstrap-FunnelMissingColumnsRuntime-r003.json | 60ae82169a5804958b0bb5d8e0d3e691710afd37d67d349962b1351e6c7f1843 |
| Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/planning/funnel-missing-columns-runtime-admission-r003.json | 1b011d97b2a54c11a697921b5257827c560931042cffd7a6931fe3870ba79283 |
| Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/MVP-20261027/evidence/FunnelMissingColumns-before-r003.png | ca0b2dc882ee68b6705ec210fc58b5560e6cbd814bee1473fb805d52ef1668ac |
| Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/MVP-20261027/evidence/FunnelMissingColumns-after-r003.png | 91e2136647de6d1be42d102dcdff07ba927c6922a9de4edbcab0823d1fd043ef |
| Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/MVP-20261027/evidence/FunnelMissingColumns-reopened-r003.png | 79f524cad02805b9f2bf06b395ea34efadfa9b85779f11a11ec4286b94416f4c |
| Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/MVP-20261027/evidence/RadarMissingColumns-events-r003.json | 6dd530c44532fb59bdc41e9d097c3bb9a1ed677d3d0740b393587dde86725101 |
| Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/MVP-20261027/evidence/RadarMissingColumnsToolFreeze-r003.json | 1ecfe722283e25bf947f87f0759a353a4cc565bf1cc4889b355ce6b2e7958578 |
| Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/MVP-20261027/runtime-state-tools/observe-radar-missing-columns-r003.js | d209d8154d977a0f38f428ae9fe37b6f4f1fc62b54a6f510aa23aad91275c876 |
| Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/planning/ContextBootstrap-RadarMissingColumnsRuntime-r003.json | 08d5b18407be2bc35b2650f7b010f80fcb2c43cb2bdd4c897917fea983a0d8c9 |
| Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/planning/radar-missing-columns-runtime-admission-r003.json | 3355dcfc5ded5846ff1b8b7bb0c0cf62a6eab31be949dabc07b827691d0e522e |
| Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/MVP-20261027/evidence/RadarMissingColumns-before-r003.png | eab4c25e15c591a8cf59d00726283b5957129b276b3138dccfc89b8bde023187 |
| Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/MVP-20261027/evidence/RadarMissingColumns-after-r003.png | fdd6c3107f154db50485c11c8c7167ba4b728bf4548ebe68e1168d1daaccecc5 |
| Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/MVP-20261027/evidence/RadarMissingColumns-reopened-r003.png | 160fa80d8c9996de2f14717978d3acb4bd923b699d2f0313c56bb25ef674bcc0 |
| Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/MVP-20261027/evidence/TreemapMissingColumns-events-r003.json | 929d8f06db3c8e11429fbef5475aa6b8d54e889732d052ef61e73fec2de6ac17 |
| Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/MVP-20261027/evidence/TreemapMissingColumnsToolFreeze-r003.json | a314ad0f6dee0e7e9ecedc6d0e38df89ea5370dedfdf6ed246a054c2be83dc6f |
| Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/MVP-20261027/runtime-state-tools/observe-treemap-missing-columns-r003.js | 2c1a2eba079665d80cc1095add2963fdc76470418eb0798b2e4969e24a1735f9 |
| Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/planning/ContextBootstrap-TreemapMissingColumnsRuntime-r003.json | b6f8c7183924cf1639f66ee635582df4f10e6be73b3a827c240f4df7bb74f5af |
| Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/planning/treemap-missing-columns-runtime-admission-r003.json | af06ff65db4a96d912038299029ed8dafcd58ace82ca9fd746686de1899c5a35 |
| Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/MVP-20261027/evidence/TreemapMissingColumns-before-r003.png | 723e2423593763f3f897e9009a85982bd1a604d85a97d40c2fb2ec43085af078 |
| Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/MVP-20261027/evidence/TreemapMissingColumns-after-r003.png | 2ba2921002b86dc1fe0ed7b97763f38133a716c7dac4e8c8b6676efe5c7a7099 |
| Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/MVP-20261027/evidence/TreemapMissingColumns-reopened-r003.png | 16b209f0c9ad5cb0ea540e0414ac68ff81fe150c8911641bc093a0b6295f5d69 |
| Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/MVP-20261027/evidence/TableNormalMissingColumns-events-r003.json | cfd629167418207fe5e9019154060a2e7bec76abae2983f865996a02bef7f761 |
| Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/MVP-20261027/evidence/TableNormalMissingColumnsToolFreeze-r003.json | 0c7999ff82609bd860e5e2d6cb46bbd32f6210d71b55b96e01b82518a9a5166d |
| Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/MVP-20261027/runtime-state-tools/observe-table-normal-missing-columns-r003.js | bff4308ecc39f1ca3fa2d18a3a7ec706a37963240176783a498b9270e08ed61e |
| Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/planning/ContextBootstrap-TableNormalMissingColumnsRuntime-r003.json | 336503d85c566764ef52568f079fb75c1c083d5db9f5893a0734d3fa804f020c |
| Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/planning/table-normal-missing-columns-runtime-admission-r003.json | 8f55d0977a058d233a987c4bb87bce782c8a0c4c710601866a52a5ab3cb73635 |
| Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/MVP-20261027/evidence/TableNormalMissingColumns-before-r003.png | 8f7236f1ed84e98e501208cb608d7aea505962dc9fe8d73bf01eebaf00c5e8f4 |
| Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/MVP-20261027/evidence/TableNormalMissingColumns-after-r003.png | 3a78d9ab2e2c21ec2d461c010205b3abbc94718f67ac4e4c5e79cc4d34d1576f |
| Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/MVP-20261027/evidence/TableNormalMissingColumns-reopened-r003.png | 55a81b5ebfd5cce1643c1b453199b51a9c7356765e3a340e0953554675e57e97 |
| Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/MVP-20261027/evidence/ScatterMissingColumns-events-r002.json | d02279139d3ea0358a577f6cb8d8470bd010b6892a63a46ac65361cba20634db |
| Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/MVP-20261027/evidence/CirclePackingMissingColumns-events-r002.json | ab26d621a1aab7428fa4861f03a90c31fe363b6b8393c85b57764f35eb45a14a |

### Context/admission逐层绑定

以下是额外逐层复算的66个required refs与30个admission依赖引用；它们可能复用上述文件，按实际引用次数保留。

| type | 来源 | 路径 | SHA-256 |
| --- | --- | --- | --- |
| scatter | Context | Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/Goal.final.json | 4db931a6764a8c48345e7e8358e579550a9bc98594bf1654647716d72b9678c4 |
| scatter | Context | Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/MVP-20261027/UiIntegrationCases-r002.json | e365ef111582ef84f20f26e6136854409b7fc66bb0931cae40a9df5318036d55 |
| scatter | Context | Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/MVP-20261027/reviews/UiIntegrationDesignReview-r003-C234.md | 5d4c26ebda1ba9847e19ea1d04caa82d26a54cee01685a167d8313aa3114f4b2 |
| scatter | Context | Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/MVP-20261027/reviews/MvpAcceptanceReadinessReview-r001.md | fba3b6ad368e085b787cd9a69497f5fb51163397559d718f7596dd014a06d9af |
| scatter | Context | Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/MVP-20261027/RuntimeMissingColumnsPlan-r001.json | 1c80cfa3da6a2a319d200f1cea356176eccd5cc0389546013d52ff204ac5c8cc |
| scatter | Context | /Users/xiaomei/Documents/projects/dataease/Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/MVP-20261027/runtime-state-tools/observe-scatter-missing-columns-r003.js | 77ffc84a5079028e39c438b734dac4945f9b0723e63986622197c364bc21b8a5 |
| scatter | Context | Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/MVP-20261027/evidence/ScatterMissingColumnsToolFreeze-r003.json | a02c469ea84468ad31567055437d463079ee4954d701ecfbedc186df761ee5f8 |
| scatter | Context | Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/planning/Topology-actual-r574.json | ae94415311da84c84989f93cb16c26d6db7fcdc0052498d7b49718a0b2f352e5 |
| scatter | Context | Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/MVP-20261027/evidence/SliceARolePortsBuild-r001.json | 6971a8970229b4e2d3e8690b8e4ac78a3dd139b8446e456ac940ba04d64289d1 |
| scatter | Context | core/core-frontend/src/views/chart/components/editor/filter/useChartFilterCopyMvp.ts | b760fffb47db4a8a187cc3dc996d6ddffb5f2b187038da625c5c8e0839d87e5d |
| scatter | Context | core/core-frontend/src/views/chart/components/editor/index.vue | 9c64555a38982216c1688012fdf7fa02433fce3b25553bd6e4ab9dffd12381fd |
| scatter | admission:goal | Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/Goal.final.json | 4db931a6764a8c48345e7e8358e579550a9bc98594bf1654647716d72b9678c4 |
| scatter | admission:completion_contract | Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/MVP-20261027/UiIntegrationCases-r002.json | e365ef111582ef84f20f26e6136854409b7fc66bb0931cae40a9df5318036d55 |
| scatter | admission:context | Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/planning/ContextBootstrap-ScatterMissingColumnsRuntime-r003.json | 335e80c8251df19ccd99ae71887b1ab02e5f416833d19c03aabdb241f53522e7 |
| scatter | admission:design_review | Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/MVP-20261027/reviews/UiIntegrationDesignReview-r003-C234.md | 5d4c26ebda1ba9847e19ea1d04caa82d26a54cee01685a167d8313aa3114f4b2 |
| scatter | admission:topology | Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/planning/Topology-actual-r574.json | ae94415311da84c84989f93cb16c26d6db7fcdc0052498d7b49718a0b2f352e5 |
| circle-packing | Context | Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/Goal.final.json | 4db931a6764a8c48345e7e8358e579550a9bc98594bf1654647716d72b9678c4 |
| circle-packing | Context | Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/MVP-20261027/UiIntegrationCases-r002.json | e365ef111582ef84f20f26e6136854409b7fc66bb0931cae40a9df5318036d55 |
| circle-packing | Context | Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/MVP-20261027/reviews/UiIntegrationDesignReview-r003-C234.md | 5d4c26ebda1ba9847e19ea1d04caa82d26a54cee01685a167d8313aa3114f4b2 |
| circle-packing | Context | Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/MVP-20261027/reviews/MvpAcceptanceReadinessReview-r001.md | fba3b6ad368e085b787cd9a69497f5fb51163397559d718f7596dd014a06d9af |
| circle-packing | Context | Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/MVP-20261027/RuntimeMissingColumnsPlan-r001.json | 1c80cfa3da6a2a319d200f1cea356176eccd5cc0389546013d52ff204ac5c8cc |
| circle-packing | Context | /Users/xiaomei/Documents/projects/dataease/Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/MVP-20261027/runtime-state-tools/observe-circle-packing-missing-columns-r003.js | adbc1502bec886c2e9ba288c7b7a02506f11b5fc75b46e2c13914953f61352d4 |
| circle-packing | Context | Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/MVP-20261027/evidence/CirclePackingMissingColumnsToolFreeze-r003.json | 897ecb685491a4448bac4cf6cf69721830ddf569a5bcd9aa8c794242f6161a3e |
| circle-packing | Context | Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/planning/Topology-actual-r574.json | ae94415311da84c84989f93cb16c26d6db7fcdc0052498d7b49718a0b2f352e5 |
| circle-packing | Context | Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/MVP-20261027/evidence/SliceARolePortsBuild-r001.json | 6971a8970229b4e2d3e8690b8e4ac78a3dd139b8446e456ac940ba04d64289d1 |
| circle-packing | Context | core/core-frontend/src/views/chart/components/editor/filter/useChartFilterCopyMvp.ts | b760fffb47db4a8a187cc3dc996d6ddffb5f2b187038da625c5c8e0839d87e5d |
| circle-packing | Context | core/core-frontend/src/views/chart/components/editor/index.vue | 9c64555a38982216c1688012fdf7fa02433fce3b25553bd6e4ab9dffd12381fd |
| circle-packing | admission:goal | Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/Goal.final.json | 4db931a6764a8c48345e7e8358e579550a9bc98594bf1654647716d72b9678c4 |
| circle-packing | admission:completion_contract | Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/MVP-20261027/UiIntegrationCases-r002.json | e365ef111582ef84f20f26e6136854409b7fc66bb0931cae40a9df5318036d55 |
| circle-packing | admission:context | Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/planning/ContextBootstrap-CirclePackingMissingColumnsRuntime-r003.json | 8e6d39c3b05c4a0cdcc1c0495b238111d555f1fc92518da99e3087506b15f118 |
| circle-packing | admission:design_review | Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/MVP-20261027/reviews/UiIntegrationDesignReview-r003-C234.md | 5d4c26ebda1ba9847e19ea1d04caa82d26a54cee01685a167d8313aa3114f4b2 |
| circle-packing | admission:topology | Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/planning/Topology-actual-r574.json | ae94415311da84c84989f93cb16c26d6db7fcdc0052498d7b49718a0b2f352e5 |
| funnel | Context | Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/Goal.final.json | 4db931a6764a8c48345e7e8358e579550a9bc98594bf1654647716d72b9678c4 |
| funnel | Context | Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/MVP-20261027/UiIntegrationCases-r002.json | e365ef111582ef84f20f26e6136854409b7fc66bb0931cae40a9df5318036d55 |
| funnel | Context | Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/MVP-20261027/reviews/UiIntegrationDesignReview-r003-C234.md | 5d4c26ebda1ba9847e19ea1d04caa82d26a54cee01685a167d8313aa3114f4b2 |
| funnel | Context | Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/MVP-20261027/reviews/MvpAcceptanceReadinessReview-r001.md | fba3b6ad368e085b787cd9a69497f5fb51163397559d718f7596dd014a06d9af |
| funnel | Context | Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/MVP-20261027/RuntimeMissingColumnsPlan-r001.json | 1c80cfa3da6a2a319d200f1cea356176eccd5cc0389546013d52ff204ac5c8cc |
| funnel | Context | /Users/xiaomei/Documents/projects/dataease/Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/MVP-20261027/runtime-state-tools/observe-funnel-missing-columns-r003.js | a44adc6e87af7d3853d30b19215a4367bad5690830a388d0828aee84042b03c0 |
| funnel | Context | Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/MVP-20261027/evidence/FunnelMissingColumnsToolFreeze-r003.json | 266375cde0bc068ac584eb9cd40d5254924c0253f473906474ded5495692ee00 |
| funnel | Context | Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/planning/Topology-actual-r574.json | ae94415311da84c84989f93cb16c26d6db7fcdc0052498d7b49718a0b2f352e5 |
| funnel | Context | Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/MVP-20261027/evidence/SliceARolePortsBuild-r001.json | 6971a8970229b4e2d3e8690b8e4ac78a3dd139b8446e456ac940ba04d64289d1 |
| funnel | Context | core/core-frontend/src/views/chart/components/editor/filter/useChartFilterCopyMvp.ts | b760fffb47db4a8a187cc3dc996d6ddffb5f2b187038da625c5c8e0839d87e5d |
| funnel | Context | core/core-frontend/src/views/chart/components/editor/index.vue | 9c64555a38982216c1688012fdf7fa02433fce3b25553bd6e4ab9dffd12381fd |
| funnel | admission:goal | Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/Goal.final.json | 4db931a6764a8c48345e7e8358e579550a9bc98594bf1654647716d72b9678c4 |
| funnel | admission:completion_contract | Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/MVP-20261027/UiIntegrationCases-r002.json | e365ef111582ef84f20f26e6136854409b7fc66bb0931cae40a9df5318036d55 |
| funnel | admission:context | Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/planning/ContextBootstrap-FunnelMissingColumnsRuntime-r003.json | 60ae82169a5804958b0bb5d8e0d3e691710afd37d67d349962b1351e6c7f1843 |
| funnel | admission:design_review | Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/MVP-20261027/reviews/UiIntegrationDesignReview-r003-C234.md | 5d4c26ebda1ba9847e19ea1d04caa82d26a54cee01685a167d8313aa3114f4b2 |
| funnel | admission:topology | Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/planning/Topology-actual-r574.json | ae94415311da84c84989f93cb16c26d6db7fcdc0052498d7b49718a0b2f352e5 |
| radar | Context | Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/Goal.final.json | 4db931a6764a8c48345e7e8358e579550a9bc98594bf1654647716d72b9678c4 |
| radar | Context | Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/MVP-20261027/UiIntegrationCases-r002.json | e365ef111582ef84f20f26e6136854409b7fc66bb0931cae40a9df5318036d55 |
| radar | Context | Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/MVP-20261027/reviews/UiIntegrationDesignReview-r003-C234.md | 5d4c26ebda1ba9847e19ea1d04caa82d26a54cee01685a167d8313aa3114f4b2 |
| radar | Context | Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/MVP-20261027/reviews/MvpAcceptanceReadinessReview-r001.md | fba3b6ad368e085b787cd9a69497f5fb51163397559d718f7596dd014a06d9af |
| radar | Context | Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/MVP-20261027/RuntimeMissingColumnsPlan-r001.json | 1c80cfa3da6a2a319d200f1cea356176eccd5cc0389546013d52ff204ac5c8cc |
| radar | Context | /Users/xiaomei/Documents/projects/dataease/Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/MVP-20261027/runtime-state-tools/observe-radar-missing-columns-r003.js | d209d8154d977a0f38f428ae9fe37b6f4f1fc62b54a6f510aa23aad91275c876 |
| radar | Context | Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/MVP-20261027/evidence/RadarMissingColumnsToolFreeze-r003.json | 1ecfe722283e25bf947f87f0759a353a4cc565bf1cc4889b355ce6b2e7958578 |
| radar | Context | Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/planning/Topology-actual-r574.json | ae94415311da84c84989f93cb16c26d6db7fcdc0052498d7b49718a0b2f352e5 |
| radar | Context | Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/MVP-20261027/evidence/SliceARolePortsBuild-r001.json | 6971a8970229b4e2d3e8690b8e4ac78a3dd139b8446e456ac940ba04d64289d1 |
| radar | Context | core/core-frontend/src/views/chart/components/editor/filter/useChartFilterCopyMvp.ts | b760fffb47db4a8a187cc3dc996d6ddffb5f2b187038da625c5c8e0839d87e5d |
| radar | Context | core/core-frontend/src/views/chart/components/editor/index.vue | 9c64555a38982216c1688012fdf7fa02433fce3b25553bd6e4ab9dffd12381fd |
| radar | admission:goal | Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/Goal.final.json | 4db931a6764a8c48345e7e8358e579550a9bc98594bf1654647716d72b9678c4 |
| radar | admission:completion_contract | Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/MVP-20261027/UiIntegrationCases-r002.json | e365ef111582ef84f20f26e6136854409b7fc66bb0931cae40a9df5318036d55 |
| radar | admission:context | Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/planning/ContextBootstrap-RadarMissingColumnsRuntime-r003.json | 08d5b18407be2bc35b2650f7b010f80fcb2c43cb2bdd4c897917fea983a0d8c9 |
| radar | admission:design_review | Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/MVP-20261027/reviews/UiIntegrationDesignReview-r003-C234.md | 5d4c26ebda1ba9847e19ea1d04caa82d26a54cee01685a167d8313aa3114f4b2 |
| radar | admission:topology | Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/planning/Topology-actual-r574.json | ae94415311da84c84989f93cb16c26d6db7fcdc0052498d7b49718a0b2f352e5 |
| treemap | Context | Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/Goal.final.json | 4db931a6764a8c48345e7e8358e579550a9bc98594bf1654647716d72b9678c4 |
| treemap | Context | Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/MVP-20261027/UiIntegrationCases-r002.json | e365ef111582ef84f20f26e6136854409b7fc66bb0931cae40a9df5318036d55 |
| treemap | Context | Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/MVP-20261027/reviews/UiIntegrationDesignReview-r003-C234.md | 5d4c26ebda1ba9847e19ea1d04caa82d26a54cee01685a167d8313aa3114f4b2 |
| treemap | Context | Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/MVP-20261027/reviews/MvpAcceptanceReadinessReview-r001.md | fba3b6ad368e085b787cd9a69497f5fb51163397559d718f7596dd014a06d9af |
| treemap | Context | Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/MVP-20261027/RuntimeMissingColumnsPlan-r001.json | 1c80cfa3da6a2a319d200f1cea356176eccd5cc0389546013d52ff204ac5c8cc |
| treemap | Context | /Users/xiaomei/Documents/projects/dataease/Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/MVP-20261027/runtime-state-tools/observe-treemap-missing-columns-r003.js | 2c1a2eba079665d80cc1095add2963fdc76470418eb0798b2e4969e24a1735f9 |
| treemap | Context | Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/MVP-20261027/evidence/TreemapMissingColumnsToolFreeze-r003.json | a314ad0f6dee0e7e9ecedc6d0e38df89ea5370dedfdf6ed246a054c2be83dc6f |
| treemap | Context | Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/planning/Topology-actual-r574.json | ae94415311da84c84989f93cb16c26d6db7fcdc0052498d7b49718a0b2f352e5 |
| treemap | Context | Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/MVP-20261027/evidence/SliceARolePortsBuild-r001.json | 6971a8970229b4e2d3e8690b8e4ac78a3dd139b8446e456ac940ba04d64289d1 |
| treemap | Context | core/core-frontend/src/views/chart/components/editor/filter/useChartFilterCopyMvp.ts | b760fffb47db4a8a187cc3dc996d6ddffb5f2b187038da625c5c8e0839d87e5d |
| treemap | Context | core/core-frontend/src/views/chart/components/editor/index.vue | 9c64555a38982216c1688012fdf7fa02433fce3b25553bd6e4ab9dffd12381fd |
| treemap | admission:goal | Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/Goal.final.json | 4db931a6764a8c48345e7e8358e579550a9bc98594bf1654647716d72b9678c4 |
| treemap | admission:completion_contract | Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/MVP-20261027/UiIntegrationCases-r002.json | e365ef111582ef84f20f26e6136854409b7fc66bb0931cae40a9df5318036d55 |
| treemap | admission:context | Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/planning/ContextBootstrap-TreemapMissingColumnsRuntime-r003.json | b6f8c7183924cf1639f66ee635582df4f10e6be73b3a827c240f4df7bb74f5af |
| treemap | admission:design_review | Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/MVP-20261027/reviews/UiIntegrationDesignReview-r003-C234.md | 5d4c26ebda1ba9847e19ea1d04caa82d26a54cee01685a167d8313aa3114f4b2 |
| treemap | admission:topology | Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/planning/Topology-actual-r574.json | ae94415311da84c84989f93cb16c26d6db7fcdc0052498d7b49718a0b2f352e5 |
| table-normal | Context | Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/Goal.final.json | 4db931a6764a8c48345e7e8358e579550a9bc98594bf1654647716d72b9678c4 |
| table-normal | Context | Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/MVP-20261027/UiIntegrationCases-r002.json | e365ef111582ef84f20f26e6136854409b7fc66bb0931cae40a9df5318036d55 |
| table-normal | Context | Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/MVP-20261027/reviews/UiIntegrationDesignReview-r003-C234.md | 5d4c26ebda1ba9847e19ea1d04caa82d26a54cee01685a167d8313aa3114f4b2 |
| table-normal | Context | Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/MVP-20261027/reviews/MvpAcceptanceReadinessReview-r001.md | fba3b6ad368e085b787cd9a69497f5fb51163397559d718f7596dd014a06d9af |
| table-normal | Context | Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/MVP-20261027/RuntimeMissingColumnsPlan-r001.json | 1c80cfa3da6a2a319d200f1cea356176eccd5cc0389546013d52ff204ac5c8cc |
| table-normal | Context | /Users/xiaomei/Documents/projects/dataease/Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/MVP-20261027/runtime-state-tools/observe-table-normal-missing-columns-r003.js | bff4308ecc39f1ca3fa2d18a3a7ec706a37963240176783a498b9270e08ed61e |
| table-normal | Context | Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/MVP-20261027/evidence/TableNormalMissingColumnsToolFreeze-r003.json | 0c7999ff82609bd860e5e2d6cb46bbd32f6210d71b55b96e01b82518a9a5166d |
| table-normal | Context | Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/planning/Topology-actual-r574.json | ae94415311da84c84989f93cb16c26d6db7fcdc0052498d7b49718a0b2f352e5 |
| table-normal | Context | Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/MVP-20261027/evidence/SliceARolePortsBuild-r001.json | 6971a8970229b4e2d3e8690b8e4ac78a3dd139b8446e456ac940ba04d64289d1 |
| table-normal | Context | core/core-frontend/src/views/chart/components/editor/filter/useChartFilterCopyMvp.ts | b760fffb47db4a8a187cc3dc996d6ddffb5f2b187038da625c5c8e0839d87e5d |
| table-normal | Context | core/core-frontend/src/views/chart/components/editor/index.vue | 9c64555a38982216c1688012fdf7fa02433fce3b25553bd6e4ab9dffd12381fd |
| table-normal | admission:goal | Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/Goal.final.json | 4db931a6764a8c48345e7e8358e579550a9bc98594bf1654647716d72b9678c4 |
| table-normal | admission:completion_contract | Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/MVP-20261027/UiIntegrationCases-r002.json | e365ef111582ef84f20f26e6136854409b7fc66bb0931cae40a9df5318036d55 |
| table-normal | admission:context | Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/planning/ContextBootstrap-TableNormalMissingColumnsRuntime-r003.json | 336503d85c566764ef52568f079fb75c1c083d5db9f5893a0734d3fa804f020c |
| table-normal | admission:design_review | Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/MVP-20261027/reviews/UiIntegrationDesignReview-r003-C234.md | 5d4c26ebda1ba9847e19ea1d04caa82d26a54cee01685a167d8313aa3114f4b2 |
| table-normal | admission:topology | Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/planning/Topology-actual-r574.json | ae94415311da84c84989f93cb16c26d6db7fcdc0052498d7b49718a0b2f352e5 |

### 本轮差异触发的公开源码扩读

为解释NB01/NB02扩读，以下并非原卡预先绑定；只作为当前checkout静态解释，不证明运行后端二进制身份。

| 路径 | 当前SHA-256 |
| --- | --- |
| core/core-frontend/src/views/chart/components/editor/editor-style/components/LabelSelector.vue | aee27a2bb636d1581b686dececc7f1446489bae1390d8a558d2276b70fa569b1 |
| core/core-frontend/src/views/chart/components/editor/editor-style/components/TooltipSelector.vue | 2e17ef442ae9ba1f32581e58fe939fe8357e75ca2724feff6ec398a30b2f1c1f |
| core/core-frontend/src/views/chart/components/js/panel/charts/g2/relation/scatter.ts | d86162ef9601655637a45bc29f2d171dfa68a4a620bc52d6f943d0e19d628224 |
| core/core-frontend/src/views/chart/components/js/formatter.ts | 753c34fc2bae2bc0ddd6f5b9eb20c0876910126386fce6c1f5b1009adb53cc11 |
| sdk/extensions/extensions-view/src/main/java/io/dataease/extensions/view/dto/ChartViewBaseDTO.java | 272bdfa254850e4a4a64ab8ba16c2a36bb7db0438a09047b6d8dd66476c465a4 |
| sdk/extensions/extensions-view/src/main/java/io/dataease/extensions/view/dto/ChartViewFieldDTO.java | 719a8da60b02a7dd0b1dcc9e4580367d3693a7263452cb7d5192c51fa14dc8cf |
| sdk/extensions/extensions-view/src/main/java/io/dataease/extensions/view/dto/ChartViewFieldBaseDTO.java | c482bb69b96029e5341bdfd08a3c9750097c22ca194f8ed9ea1d65a634150616 |
| sdk/extensions/extensions-datasource/src/main/java/io/dataease/extensions/datasource/dto/DatasetTableFieldDTO.java | a868069e681f53bf5d7bbfbd2439cce160f3f845015165d8313c0441f7073572 |
| core/core-backend/src/main/java/io/dataease/chart/manage/ChartViewManege.java | 82e680456f5490e2ffb6a3cb858fd2debe635f500d61242205443b83d931598c |
| sdk/common/src/main/java/io/dataease/utils/JsonUtil.java | 95d0c21439247071afacc56f612bef37847eefe8a15fa40ff47528c35a8dd6a0 |
| sdk/common/src/main/java/io/dataease/jackson/JacksonConfig.java | 29c67959dda309f51db40f67c156095ce9ec66f1058f79a331e6a11b62b28f2f |
