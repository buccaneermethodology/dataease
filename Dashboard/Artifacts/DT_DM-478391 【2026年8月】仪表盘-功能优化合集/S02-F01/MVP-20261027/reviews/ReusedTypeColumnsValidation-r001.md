# 剩11类既有证据逐列复用独立验证 r001

- reviewed_at：`2026-10-30T20:31:00.768769+00:00`；reviewer/source：`/root/bubble_ready_validator_resumed`。
- snapshot_id：`S02-REUSED-11-TYPE-COLUMNS-VALIDATION-r001`；full_baseline；新汇总交付首轮 **1/3**，不重开已耗尽的实施/设计预算。
- card canonical SHA：`eb00147ecadfd365de6e7711aa5a30f7055ab5ef0796169d1d783722000fa455`，接收端validate exit0、消费同名prompt；28处卡引用、27唯一文件逐项SHA匹配，写前再次无漂移。
- 唯一输出本报告与`evidence/ReusedTypeColumnsMatrix-r001.json`，后者SHA `3c3c77e2f7ef1f30e7a42de01c813948b072d886eb562a7f93064639959d9060`。旧矩阵/证据/源码/状态均未修改；本轮 **新增runtime=0**，未操作UI/DB/应用HTTP、安装、构建、测试或认证/XPack内容。

## 裁决与边界

**PASS_WITH_BOUNDS_FOR_EVIDENCE_REUSE（既有证据逐列复用的新汇总有界通过），新增产品阻断0。** 11行矩阵完整列出可复用层、严格差异、unknown及最小后续；这不是11类型全部通过。原38义务（P1=12、P2=26）、49类型、完整 **0/49** 不变，真实权限BLOCKED/NOT_RUN、插件installed unknown；C1/C2/图片等已消耗预算不重置。

直接复算 **383项提取/数据/关系断言**，最终无未解释断言失败；含 **74个旧query/结果投影、175份descriptor自洽检查**，不是74次新运行/175个独立样本。map严格保存形状比较仍有 **19处差异**，矩阵明确mismatch；“断言满足”包括确认/保留这项差异，不等于所有树严格相等。第一次检查器漏初始化无指标的symbolic坐标组，导致三条metricless响应投影不匹配；只纠正检查器，原件未改、失败诊断保留在矩阵说明，不计产品RED。

所有字段都同时标注证据层及窗口。`verified`只表示所列原件的该列可复核；`reused_independent`复用已释放裁决；`recorded`为旧实际执行/数值记录；`partial/unknown`保留缺列；`mismatch`明确严格不相等。没有把wrapper bool、hash、logical1或其它类型显示替代缺失原件。

## 11类可复用结果与真正缺列

| 类型 | 主要已核复用 | 当前缺口/保留边界 |
| --- | --- | --- |
| gauge | 0–10000合法量程6761→5093、全树、物理/逻辑候选、显式保存/panel0/重开5093 | source配对属旧Grouped配置；不倒写成新固定量程source轨迹；其余变体未验 |
| liquid | fixed max10000、67.61%→50.93%、全树、保存/panel0/重开5093 | 同上；动画相位和旧饱和观察不改成源码修复 |
| picture-group | r003树200/id23金额277、r004树500/id25金额546；raw save/find/query、120×80指定时点；旧source反向descriptor | 查询DTO虽table-info，实际节点picture-group；冷资源重新取得/恢复未验，旧视觉错误保留 |
| symbolic-map | 新8110真实JAR/同clone保存连续性、正常工具栏panel0、新find与3坐标组5093；新source-copy完整 | 旧8100三树与新8110分开；Panel包无新save/paste；不拼旧8100保存或推全details |
| indicator | BubbleRepair源/目标/完整反向descriptor；r004整画布真实indicator500 save=find=reopen request及值5093 | 历史candidate仅logical1；r004是重开原HTTP，不冒充同次新paste |
| rich-text | 原生填文本后成功target/反向；r004真实rich200节点save/find/query，resultCount1果元3218；新area源copy可复用 | 历史rich目标同次输入source三副本未全绑定；不能用失败63或后来area源倒填；物理候选unknown |
| map | source/clip/target严格相等，province三组5093；实际保存/数据集页退出/重开 | 重开descriptor严格19差异；本型重开新rows和save/find物理链未捕获 |
| bubble-map | 纠正角色后source/clip/target、province5093；严格重开树相等、clip空 | 本型重开新rows/物理链缺；旧workbranch瞬跳没有独立中间页落地，verified重开与旧等待失败分开 |
| flow-map | 双向原诊断三树、实际坐标/金额；corrected flow新save/panel0/find/reopen三组5093及可见线原释放 | 首次只有点/标签不追认；hidden yaxisExt大小写alias差异保留；不升全部渲染治理 |
| heat-map | 双向原诊断三树、坐标金额、真实save/panel0/find/reopen5093；热斑原释放 | 两个主要热斑不等于必须3独立热斑；旧hidden轴/ubo/全部生命周期不关闭 |
| table-info | 原生真明细表target200；shop14行多重集；正常源copy副本；保存成功/panel实际落地/重开完整树 | 无本型重开新rows/物理save-find；原目标同次输入源副本缺；不能用图片DTO或后来的area反向轨迹补成table配对 |

矩阵每列均有path/SHA/pointer或native行/call_id/行SHA，配置、来源版本、时点和方向分开。后续无需从本表摘要推断矩阵中没有的强结论。

## CSV与整画布HTTP复用：不浪费已经取得的证据

固定CSV SHA `abc8bed0862129d58724bcefff2563862e48d1ea057365ae8d5d2c853e64472b`。按实际AND/OR整树递归筛选、Decimal数值及键值多重集比较，不假定SQL顺序。T200命中14行/6761；T500命中8行/5093。省分组500为江苏1982/浙江1243/广东1868；坐标组对应南京(118.7969,32.0603)=1982、杭州(120.1551,30.2741)=1243、深圳(114.0579,22.5434)=1868；flow还核起终点城市/经纬度。

`RuntimePictureSaveWire-events-r004.json`的wire1 updateCanvas和wire2 findById保存**整画布**。实际指针：
- indicator `7520752064427724800` type=indicator、树500，save/find完整customFilter相等；wire3重开真实SUM(amount)=5093。
- rich-text `7521402539875504128` type=rich-text、树200，save/find与wire5重开请求完整树相等；resultCount=1的果元shop金额3218正确，不增加“必须回5组”要求。
- picture `7521406441329004544` 保存type=picture-group、树500；wire0/6 query DTO=table-info、resultCount1，id25/546/shop果元及实际返回字段逐CSV相符。**不能因此填真table-info重开结果列**。

三者复用同一个真实16:15:17.655保存响应、16:15:19.048 panel/editorCount0、16:15:19.220 find及随后的各自类型query；这是一份已执行整画布链，不是三次新save/runtime，也不是仅hash。表信息原真target为另一个ID `7520741153101058048`，shop14行是合法配置：果元6、南都2、乐园1、水围3、香橙2；amountSum=null，不强迫amount/ID。

gauge/liquid直接复算各正式raw三阶段单值6761→5093→5093，复用量程独立报告；不重新跑量程配置或六图。symbolic新8110的两份find、先前同clone/JAR的FreshUi save及新Panel正常退出重开分层绑定；新Panel没有save/paste，不能用旧8100上的保存补充。顶层坐标/金额已核，全部details内容与环境停止/reap身份按原已释放报告边界复用。

## 实际导航与原生窗口

只扩读精确非认证任务窗口的js code及对应文本，不读取/导出login、headers、凭据或图片base64；native全文件持续append，不以全文件hash作冻结输入。矩阵保存行SHA（含换行）/call_id及所需导航属性，不复制整段聊天。

- map：原生 **92137→92140** 执行`await leaveDashboard()`后正常返回并重开；helper **88716** 明确导航数据集页并等待独有文案“请在左侧选择数据集”visible。88716至92140窗口仅这一处helper赋值。可确认此真实正常退出执行，不能降为“只核hash”，也不要求为了新格式重跑editorCount0。
- rich-text：**89567→89570** 在正常填内容后target success/calls1；**89574→89577** 反向成功、保存并实际await同helper离开重开；89582原输出可见文本。63默认内容失败与后64成功分别保留。
- table-info：**87379→87382** 确认panel实际落地；早期87047即时返回仍旧editor不算成功退出。**87050→87403**完整descriptor严格相等且clip空，qobs=null保留。
- table-info source：**87587→87590** 正常copy后完整source=clip；从先前明细表状态延续，后87594才显式切area。可补“本型源copy副本”这一列；后来的area→indicator操作**不可**因wrapper文字而算作真table-info→indicator同次三树。
- bubble：旧goto workbranch后立即重入并发生等待未完；只用后14/15 verified重开。没有独立中间页DOM0或独有文本，不能和map的await-helper证明混用。

## 必须保留的差异、历史与证据上限

**RTC-N01：map严格形状19差异。** MapBatch第5→11行的group fieldId空串→null、两处timeValue的undefinedPaths变化，以及field/valueType/dynamicTimeSetting默认键和ownKeys变化均原样保存于JSON `/independent_checks/comparisons/map/differences`。两树递归选中的CSV ID相同、金额5093，但严格列仍mismatch；不能删键/默认补值后写严格相等，也不自动宣布原AC09业务失败已成立。由原合同判断其影响，不新增字节级must-have。

**RTC-N02：三个type的重开新结果原件缺失。** map/bubble/table-info重开qobs=null，没有本型新rows。qobs=null不等于应用未发query；只说明本包没捕获相应数据。不能用indicator显示、图片DTO或hash推补。其它类型真实重开HTTP已经足够，不重复采样。

**RTC-N03：跨时点/源码/协议不拼接。** gauge/liquid旧source配对≠新量程source操作；rich新area源副本≠旧rich target输入前态；symbolic旧8100≠新8110；indicator旧logical候选≠r004新重开rawHTTP。flow/heat的旧paste响应body与logical1可复用，但完整request物理计数并未因此普遍闭合；stable配置/重开HTTP不能冒充新的唯一paste。

**RTC-N04：历史产品/显示残余不抹去。** bubble最初四条自复制、旧paste_render_failed、旧等待失败；rich默认内容失败；图片24×24/错误资源、未经请求reload、后指定时点120×80但冷资源恢复未验；flow首次无清楚线及清hidden轴后另一个成功窗口；heat热斑/clip裁边；旧symbolic details错误与新JAR修复环境、旧ubo/C2V-005/权限未决均保留。原地图r002/restore r003与C1/C2/图片等累计预算不重开。

## 真正最小后续与准入预测

1. **已释放gauge/liquid/picture/symbolic、indicator/rich整画布save/find/query、heat/flow保存重开直接复用，不新增运行。**
2. **map/bubble/table-info**先只定位各自旧重开后的未截断结果记录；确无原件且原AC需要时，仅补同基本配置的一次保存离开重开新结果。bubble可在该最小样本同时记录中间导航实际落地；table保留shop列即可。物理raw字段unknown本身不自动触发新必跑。
3. **rich历史target三树/真table同次输入源副本**若最终还需，应只找对应成功窗口specialPaste/indicator copy的未截断源导出；找不到时将一次最小不同树目标样本同时采源/clip/target。不重做已经核过的数值、图片、共享负向、重复paste或undo/redo。
4. **map严格差异**交原AC09/原生形状合同判定；**symbolic**同次新input preimage若确属终态必读，先查已冻结FreshUi复制时点，不能拼旧8100。禁止换名重开已经用满的实现/设计审查。

这份新汇总当前可以吸收，无需机械第二轮；它给出证据复用与未核列，不代替最终完整类型/38义务/P1/Goal验收。新matrix不修改旧行，也不改变0/49。

## 已查无问题与未查

已查：28卡引用/27唯一摘要，额外原件摘要；74个query/结果投影逐CSV、175份descriptor及undefined自洽；三树已有原件关系；raw整画布各真实type的保存读回；heat/flow坐标/起终点/新find后数据；symbolic同JAR/clone分层；map19差异；table真实shop配置/native源copy/实际panel；有明确await-visible的正常导航实际执行；错误角色/失败/恢复分离。全部发现与缺列一次给出，未知未变成新增产品要求。

未查：没有新控制UI/发应用HTTP/连DB或独立重跑产品；未重审全部实现、通用observer、图库生命周期、全源码diff/构建身份；未核真实多用户/组织/撤权、所有数据库/Profile/移动/嵌入、插件census、全尺寸/交互/资源恢复；未承担最终KB/Dashboard/full diff/reconciliation/Stop Gate。截图显示只复用已释放独立报告原观察，本轮未重新查看所有旧图，不能当新视觉验收。项目无Session registry工具，不声称程序化注册表校验。

## 冻结输入与输出

矩阵绑定全部卡输入及实际扩读文件SHA，native仅绑定精确行。其完整可机器读取清单位于matrix `/inputs` 和 `/native_read_manifest`。卡28处/27唯一输入列于下表，重复Goal只列一次：

| 文件 | SHA-256 |
| --- | --- |
| Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/Goal.final.json | 4db931a6764a8c48345e7e8358e579550a9bc98594bf1654647716d72b9678c4 |
| Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/MVP-20261027/UiIntegrationCases-r002.json | e365ef111582ef84f20f26e6136854409b7fc66bb0931cae40a9df5318036d55 |
| Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/MVP-20261027/RuntimeMissingColumnsPlan-r001.json | 1c80cfa3da6a2a319d200f1cea356176eccd5cc0389546013d52ff204ac5c8cc |
| Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/MVP-20261027/runtime-fixtures/TeaMaterialExtended-r001.csv | abc8bed0862129d58724bcefff2563862e48d1ea057365ae8d5d2c853e64472b |
| Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/MVP-20261027/reviews/NumericRangeRuntimeValidation-r001.md | 2997528775621296d8546280aad2407754e3af7b9374c4bc7ab59dc7b7e0301d |
| Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/MVP-20261027/reviews/SymbolicFreshRuntimeValidation-r002.md | 58d8cb42f0f449b64856c8a9c6da19b9f6a6039a851869bf4a2adec254b7ae76 |
| Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/MVP-20261027/reviews/CoordinateMapStableEvidenceValidation-r002.md | 0a46e78e3209dfa62e30c81e654ab76e9765aae1c405785262f4f6e1f29ee2d1 |
| Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/MVP-20261027/reviews/CoordinateMapFixtureRestoreValidation-r003.md | 696125320608bd4b172bd0caae8d99cbb1354209ea4ddba2687be3f808499e02 |
| Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/MVP-20261027/reviews/RuntimeTypeEvidenceValidation-r002.md | 82b3f1e43f75f643878af66162ef24e0f4365c7b8bb45742e77eeea1c2209097 |
| Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/MVP-20261027/reviews/MvpAcceptanceReadinessReview-r001.md | fba3b6ad368e085b787cd9a69497f5fb51163397559d718f7596dd014a06d9af |
| Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/planning/Topology-actual-r578.json | 7163e3e63e80d03f77db2009cf376e6e4c5830becb2a3437676f61f05169ab2d |
| Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/MVP-20261027/evidence/RuntimePictureSaveWire-events-r004.json | a912a8e990c63a69855baea8189a6598d0772d30ad9eaed82910b1b010f2cf13 |
| Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/MVP-20261027/evidence/RuntimePictureSaveWire-r004.json | 9df104e4e5acc5f4ee07d2d6804d77ec9d6bb6de9d88b9ea4798a256c255eae8 |
| Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/MVP-20261027/evidence/NumericRangeRuntime-r001.json | 66f14a1e6f598a1cc8f60149febe4bfa5fbc7c6c897b7fd894b0d509096db503 |
| Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/MVP-20261027/evidence/NumericRangeGauge-events-r001.json | 8e336c2ac48c78565838c68629b471e8f52662c1246b97c3001818d421e70e5a |
| Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/MVP-20261027/evidence/NumericRangeLiquid-events-r001.json | c3a5e3a58d2bf04b12d5ffd37855766d5aca8585a69c7049433e95d2ed13f128 |
| Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/MVP-20261027/evidence/SymbolicPanelReopen-events-r001.json | be500587f14a2ca2c1ddf38ad81b82e14093e8546e5efe9255a89bd4ac03a62f |
| Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/MVP-20261027/evidence/SymbolicPanelReopen-r001.json | 77c7e111e4c2daa97001b0b4c95180cda7ef04a2ade64c5aa59bf48354e0c8ba |
| Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/MVP-20261027/evidence/RuntimeMapStable-events-r001.json | 4c7b28fb4289fc3064eba3d0780a99bd1673b720ff3be1d2485698eb0444464b |
| Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/MVP-20261027/evidence/RuntimeMapStable-r001.json | 5dfa466a10e7e75273f5a67dbd14c537f16c4377ede1d7810890df51a8bbd727 |
| Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/MVP-20261027/evidence/RuntimeCoordinateMap-r003.json | 9cd07dd4a39bd8404eabaec76323ab7ae31f49ccc4bc25677d02aa8cec38cf47 |
| Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/MVP-20261027/evidence/RuntimeMapBatch-events-r001.jsonl | 2319b3bb3becf8105c1a50cfd5a3f8de275b2f4e8256630253b1c6f1fbe29d2c |
| Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/MVP-20261027/evidence/RuntimeMapBatch-r001.json | 5e378d780c027c78e3bf4d12946e3ef94e30afea25379ead391c2873078e14b3 |
| Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/MVP-20261027/evidence/RuntimeBubbleRepair-events-r002.jsonl | 6e1d5ffc49a3a7318bec17fd5dd02880b9235dd08c4405f17e7adca914d8a84b |
| Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/MVP-20261027/evidence/RuntimeBubbleRepair-r002.json | f39041602a95be36b7df24102aaf7b8b3c9ade39c8bf1a7e1d1f863dca20d58c |
| Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/MVP-20261027/evidence/RuntimeTypeEvidenceMatrix-r002.json | e52404a6f422d1f2897c7febb5c5baccc6315d8646e719156696b8b1134337a9 |
| Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/MVP-20261027/evidence/RuntimeUiProgress-r013.json | 0a2bc5114b43818f35521747dc817b2ae124dc77a26cb33d27e18c069f4a38a2 |
