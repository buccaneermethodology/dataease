# 缺列补证第五批：六日期类型独立验证 r001

**结论：PASS_WITH_BOUNDS（六个日期类型本次合法基本配置的缺列补证有界通过），新增阻断 0。** 六型的18个目标查询窗口均已按各自实际数据协议逐项与CSV严格比较，18张原图已逐张查看，正常采用、显式保存、真正离开与重开链相互吻合。仅覆盖本次配置与场景，不提高完整类型验收计数，不宣称38项或Goal完成。

这是该批**新运行交付第1/3轮**。本lane曾编写静态 `DateAxisUiProtocol-r001.json`，因此**不评该helper的设计正确性，也不给自己写的候选菜单selector独立通过**；本结论直接来自独立源码读取、原HTTP、CSV、完整descriptor和截图。C1仍为原累计第3/3的既有有界决定，本轮不重审C1；C2原第3/3 `BLOCKED / C2V-005` 保持。

- reviewed_at：`2026-10-30T19:58:00.612715+00:00`；reviewer/source：`/root/local_basemap_reviewer`，未编写本批六份运行driver、运行结果、CSV或图表源码。
- snapshot_id：`S02-MISSING-COLUMNS-BATCH5-VALIDATION-r001`；as_of_state：Topology r578、第五批handoff及以下57项卡绑定输入。
- Card canonical SHA：`45f3dbbe1fdacc1bcf55c06c41718803e71d9af107b375d5d52972f8d86b1f9b`。接收端validate/render均exit0，render与同名冻结prompt逐字相同；57项摘要入场/写前均匹配。
- 唯一持久输出为本报告，写前不存在。未改源码、driver、fixture、合同、旧报告、Dashboard或KB，未操作UI/DB、安装、构建、启动应用、提交或推送。没有把源码静态阅读当作本lane实际操作浏览器。

## 原始范围和实际配置

原Goal仍是先完成开发权限测试桩下全部受支持图表的基本界面MVP，再补原复杂场景；原38项（P1=12、P2=26）和49内置类型分母不减，完整类型仍0/49。真实权限 `BLOCKED/NOT_RUN`，插件installed unknown。本批补的是冻结计划已缺的基本配置证据列，不新增负向必测全集，也不以基本正向链替代所有变体。

六个driver内的axisConfiguration均与 `RuntimeMissingColumnsPlan-r001.json` 对应configuration逐对象相同。本lane另直接读实际六类renderer及SDK日期字段语义，未依赖自著helper来判定响应数学。

| type | 冻结配置及实际请求 | 本次方向 |
| --- | --- | --- |
| bar-range | x=date；开始amount、结束target，各sum | 500→200 |
| bidirectional-bar | x=date；两侧amount/target各sum | 200→500 |
| bullet-graph | x=date；实际open、目标target各sum | 500→200 |
| multi-scatter | x=date；y=amount、明暗=amount；颜色shop；原始点 | 200→500 |
| quadrant | 类别date；横/纵同amount各sum | 500→200 |
| stock-line | x=date；四指标最终顺序open/close/low/high，各sum | 200→500 |

共同resource=`1312476889213964288`、dataset=`1312472054565572608`、target=`7520752064427724800`。输入source200为`7521402539875504128`，source500为`7520741153101058048`；本批source/target身份由stage、实际请求和save/find联合核，不靠图标题“指标卡”推断类型。

## 18个查询的日期与数学核对

每型baseline/candidate/reopen三次目标请求的xAxis均只有date字段 `1793083721147 / f_e7365583a5389143`，实际`deType=1`、`groupType=d`、`dateStyle=y_M_d`、`datePattern=date_sub`；`dateShowFormat`实际也均为`y_M_d`，这里只记录观察，不把它新增成粒度开关要求。SDK明确区分后端聚合dateStyle和前端显示dateShowFormat。所有非日期字段、轴顺序、dataeaseName/deType和冻结sum要求逐项符合；其它未用轴为空。

**本次默认值已满足日粒度，六份driver都没有日期菜单操作。** 本批不证明“点击日期显示→年月日”的当前DOM路径、悬停、portal或selector已运行；静态helper中的候选locator继续待DOM核验。

复算从CSV原始amount>threshold与实际树内shop枚举开始，随后按各型规则处理。阈值200命中ID为3,5,11,12,13,14,15,16,17,18,20,21,23,25（14条）；阈值500为3,5,11,13,16,18,21,25（8条）。聚合型按CSV日期前10位逐日求和，200得到13日、500得到8日；没有用完整timestamp代替日oracle。2024-03-25的200条件有两条记录，amount=568、target=768，实际响应确为一日合并；多维散点仍保留这两条独立点。

所有六型的三个目标响应位于各自event的wire[0]/sequence7、wire[1]/sequence12、wire[5]/sequence31；分别为baseline、candidate、reopen，均HTTP200/business code0、身份与type/dataset正确。

| type | baseline：阈值 / tableRow数 | candidate及reopen：阈值 / tableRow数 | 逐项复算结果 |
| --- | --- | --- | --- |
| bar-range | 500 / 8 | 200 / 13 | amount 5093→6761；target 5893→8161；每日期两端点与gap严格相符 |
| bidirectional-bar | 200 / 13 | 500 / 8 | amount 6761→5093；target 8161→5893；两侧各自每日期值严格相符 |
| bullet-graph | 500 / 8 | 200 / 13 | open 5093→6761；target 5893→8161；每日期实际/目标严格相符 |
| multi-scatter | 200 / 14 | 500 / 8 | 原始点多重集逐点相符；amount校验和6761→5093；未按日合并成13 |
| quadrant | 500 / 8 | 200 / 13 | 每日期横纵值都等amount日和；两轴校验和均5093→6761 |
| stock-line | 200 / 13 | 500 / 8 | 四指标逐日相符；见下文四列值和排序 |

上表“相符”是每组/每点严格比较，包含数量和重复项，并非只比较合计。每个reopen响应重新按对应树复算，再与candidate比较，未借用前一窗口的成功状态。

针对renderer实际消费结构另分别核验：

- **range**：辅助`data`有8→13条，每条`values=[amount日和,target日和]`、`gap=结束-开始`。真实range-bar使用values构造startValue/endValue；本配置两数值端点，不是两时间端点。
- **bidirectional**：辅助data保持两个独立系列amount/target，各有13→8个日期条目，分别进入renderer的firstData/secondData；没有把双侧合计混成单轴。
- **bullet**：辅助data按日期和quotaId展开，8日为16条、13日为26条；open字段映射measures，target字段映射目标线。未将两者顺序或含义互换。
- **multi-scatter**：tableRow与辅助data均为14→8条。以`(day,shop,amount)`的Counter逐点比CSV，不丢重复项；真实辅助`xLabel=day`、`y=value=lightness=amount`、`category=shop`。renderer沿xLabel日期路径、shop颜色路径及lightness处理；本次真实请求指标summary虽为sum、aggregate=null，响应仍是未合并点，不从summary字样误推按日SUM。本报告不改原raw规格。
- **quadrant**：每日期辅助data的value/extValue均为同一amount日和，符合横/纵冻结配置；画面位于x=y对角线属于本配置预期，不扩大为任意异指标象限正确性。
- **stock**：每日期tableRow四值及辅助4项quotaId/value均逐CSV复算；200有52项辅助记录，500有32项。四轴不是依字段名排序推断，而是读取真实数组顺序。

stock的200日和总计为open6761、close6831、low6621、high6901；500及重开为open5093、close5133、low5013、high5173。最终HTTP yAxis三次均为`1158/1159/1161/1160`完整ID后缀顺序，即open/close/low/high。HTTP xAxis sort均desc，tableRow也按日期降序；源码`getData`会强制desc，renderer再升序绘制。没有把HTTP desc误判成失败。

stock的DOM顺序原件逐步记录date、open、close、low、high追加；last-chip正常拖拽首次就得到expectedIds。stockOrderCalibration的firstIds/firstInputIds/expectedIds相同、attempts=1，无secondIds；**逆置校准重拖分支未走，不是本批已验证能力**。本fixture按日SUM模拟四值，不扩称真实金融开收盘聚合语义。

## 复制、采用、保存及重开

六型均独立核得以下事实：

| 检查面 | 本轮实际原件与比较 |
| --- | --- |
| 完整树与descriptor | sourceBeforeCopy.source、copied.clipboard、after.source、reopened.source、采用后本型source及再次copy的clipboard完整tree/ownKeys/undefinedPaths相同；13个递归ownKeys节点重新枚举相同，undefinedPaths=[] |
| 采用前差异 | baseline/before整descriptor相同；采用前后threshold确由500↔200改变，不是同值粘贴 |
| clipboard不变与本型导出 | 粘贴后clipboard descriptor/revision不变；采用后正常copy本型，revision由5→6、7→8、9→10、11→12、13→14、15→16，tableId保持正确dataset |
| 请求与结果 | candidate窗口[12,13)恰1个真实target getData；diagnostic logicalGetDataCalls=1且outcome=success；完整responseData等于raw响应data |
| 显式保存 | 每型wire[2]恰1次updateCanvas、业务码0；不是自动保存或多次重试save |
| 真正离开与重开 | 每型正常退出panel、editorCount=0，再find同resource；wire[3]的目标type/完整过滤树正确，wire[5]的实际重新查询逐项通过 |
| 会话清空 | 重开clipboard=null、pasteReason=clipboard_empty，fieldsReady=true；不把重开视为旧clip续期 |
| 运行保全 | driver起止摘要等冻结摘要；截图内容摘要等stage记录；无本批executionFailure/wireCaptureFailure/pageError |

完整descriptor结论限于真实diagnostic导出的tree/ownKeys/undefinedPaths及已导出的clip元信息，**不声称内部fields全集已导出**，也不从JSON推造未传输undefined。

保存/重开的过滤树逐对象完全相同；轴对象存在下述明确差异，不宣称全轴字节相同：

| type | save请求中存在、find中被省去的字段 |
| --- | --- |
| bar-range / stock-line | 没有本次所比轴字段差异，整轴对象相同 |
| bidirectional-bar / bullet-graph / quadrant | yAxis、yAxisExt中各字段的axisType/seriesId |
| multi-scatter | xAxis、yAxis、yAxisExt中各字段的axisType/seriesId |

深层diff一次列全，只出现上述两键缺失；其它字段、日期/summary/id/顺序、清空项相同，实际重开请求和数据/画面也正确。SDK字段DTO/父DTO未声明这两个前端键。本报告接受原冻结契约要求的保存/重开树与基本轴配置证据，不把这项事实扩大为任意未知轴属性都可丢弃，也不新增全轴序列化业务要求。初次独立核读脚本按“全轴对象必须逐字相等”断言失败后，已保留该差异并逐键诊断；没有静默过滤差异以制造原始全同结论。

## 图像、执行入口及全部发现

18张before/after/reopened PNG均已直接查看，摘要匹配原件。range可见区间端点随8日→13日改变；bidirectional两侧条带13日→8日；bullet实际条与目标线8日→13日；multi-scatter原始点14→8；quadrant同amount两轴8日→13日；stock13日→8日K线及既有均线。六型重开画面与对应after相符，未见采用空白/NoData。图中仍有“指标卡”标题，与type判断无关。

**新增行为阻断0；以下为全部非阻断观察与证据上限：**

1. **B5-N01 / P3 / 声明精度**：四型save/find的axisType/seriesId差异如上。只允许声明实际比较通过的字段与树，不允许写“六型完整轴对象逐字保存一致”。本基本链无错误结果或画面反例，不要求代修。
2. **B5-N02 / P3 / 冻结原件的陈旧标签**：schema/部分stage/limits沿用area或area-stack、initial_target_liquid500_reported等旧模板名。driver实际选型、HTTP type、轴、stage typeControlText与save/find相符，应以这些证据为准，不把标签当真实area样本或恢复liquid证明；不改写旧冻结原件。
3. **既有显示上限**：range/bullet等截图仍有百分比格式（例如80200.00%），本批未改格式。截图只支持图形出现和状态变化；数值/单位正确性不能单凭标签宣告，数学仅以上述raw/CSV匹配负责。不是本批发现并修复了百分比配置。
4. **未执行路径**：日期菜单、stock校准重拖均未操作；没有取消/拒绝/保存失败/多权限、跨数据集、跨页、所有变体或所有反向配对的新证据。本批source role只证明采用后本型可正常导出，与新目标之间的所有配对无关。
5. **环境旧异常和最终fixture**：每型pageErrors为空，但preexisting/end runtime error count均1；不能据此关闭旧ubo、console/resource或C2。每型明确未恢复原liquid；本批最后保留stock-line500，原计划最终恢复要求仍由root后续按实际动作处理，不在本报告关闭。

六个Context各15处内层SHA逐项复算一致，`context_bootstrap.py validate`六次exit0；六个admission按实际action/target运行`execution_admission.py`六次exit0，issued_at与各ToolFreeze时间都早于相应运行。不是追认无准入动作，也不把脚本验证说成语义/产品验收。driver配置等冻结计划；正常选择/拖轴/copy/paste/确认/save/离开/重开，没有源码/DB/Store或response route注入。stock的evaluateAll仅读取DOM节点data-id；日期guard是请求读回比较，未直接给dateStyle/datePattern赋值。

C1格式固定槽位另只读核得：当前runner SHA等已审候选`b8dbb5e47463960fe5ae59bda68a2c29b56b1d90baa88dda745b885554f6bc3f`，landed记录绑定原第3/3报告，两个新日志摘要匹配，记录31/0/0和双文件lint0。本lane未重跑C1测试、未改旧报告，也不将此确定性读回包装成C1第四轮。

未执行新的浏览器、SQL/DB或构建/测试suite；原因是本lane只读运行证据验证，当前任务无源码改动。未验真实用户/组织权限、所有SDK事件和资源清理、全部数据库方言、移动/panel/lib所有入口、完整undo/redo、其它类型和插件安装数；原38/49和C2阻断保持。本人自著日期helper的设计/selector独立评价完全不在本结论内。无须为本批已通过的基本正向链重复运行；后续按原矩阵吸收实际证据列，继续原剩余义务，不能提升整型全验收。

## 冻结阅读清单与最终绑定

57项卡输入如下；本lane只对其中真实运行交付与原始范围作独立裁决，日期helper只核引用身份，C1原报告只沿用其历史决定。补充直接源码另列。项目无Session registry/reconcile工具，不声称程序化注册表校验；本报告不是最终Goal Stop Gate。

| 卡索引与文件 | SHA-256 |
| --- | --- |
| 0: [Goal.final.json](</Users/xiaomei/Documents/projects/dataease/Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/Goal.final.json>) | `4db931a6764a8c48345e7e8358e579550a9bc98594bf1654647716d72b9678c4` |
| 1: [UiIntegrationCases-r002.json](</Users/xiaomei/Documents/projects/dataease/Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/MVP-20261027/UiIntegrationCases-r002.json>) | `e365ef111582ef84f20f26e6136854409b7fc66bb0931cae40a9df5318036d55` |
| 2: [RuntimeMissingColumnsPlan-r001.json](</Users/xiaomei/Documents/projects/dataease/Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/MVP-20261027/RuntimeMissingColumnsPlan-r001.json>) | `1c80cfa3da6a2a319d200f1cea356176eccd5cc0389546013d52ff204ac5c8cc` |
| 3: [DateAxisUiProtocol-r001.json](</Users/xiaomei/Documents/projects/dataease/Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/MVP-20261027/DateAxisUiProtocol-r001.json>) | `25bca29d706f52ff0c1157df6516bcbb90bf4ccee4ad459e28bf393cde70ac77` |
| 4: [TeaMaterialExtended-r001.csv](</Users/xiaomei/Documents/projects/dataease/Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/MVP-20261027/runtime-fixtures/TeaMaterialExtended-r001.csv>) | `abc8bed0862129d58724bcefff2563862e48d1ea057365ae8d5d2c853e64472b` |
| 5: [C1THeatmapPrimaryDataValidation-r003.md](</Users/xiaomei/Documents/projects/dataease/Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/MVP-20261027/reviews/C1THeatmapPrimaryDataValidation-r003.md>) | `be82d391287f64f6c29e51f3c2660d9d695cc3131629a9d55937c2620ff80e04` |
| 6: [THeatmapPrimaryData-runner-format-landed-r001.json](</Users/xiaomei/Documents/projects/dataease/Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/MVP-20261027/evidence/THeatmapPrimaryData-runner-format-landed-r001.json>) | `fb2a000dc5880cafbe472a44da302b94a74cdac23fbd23c9fc6298625dbdd757` |
| 7: [MissingColumnsBatch5-r001.json](</Users/xiaomei/Documents/projects/dataease/Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/MVP-20261027/evidence/MissingColumnsBatch5-r001.json>) | `2ef3f9349e3292634ad767c24b944f612cacfaa933ca3b12862e928d1a5ec65c` |
| 8: [Topology-actual-r578.json](</Users/xiaomei/Documents/projects/dataease/Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/planning/Topology-actual-r578.json>) | `7163e3e63e80d03f77db2009cf376e6e4c5830becb2a3437676f61f05169ab2d` |
| 9: [BarRangeMissingColumns-events-r001.json](</Users/xiaomei/Documents/projects/dataease/Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/MVP-20261027/evidence/BarRangeMissingColumns-events-r001.json>) | `e9b14e1bacc0de40637b829cae9881ee87a043dbee69938957b9773da15b3fd2` |
| 10: [BarRangeMissingColumnsToolFreeze-r001.json](</Users/xiaomei/Documents/projects/dataease/Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/MVP-20261027/evidence/BarRangeMissingColumnsToolFreeze-r001.json>) | `434b3b01391ad92f8af6a9a4ea89b8e82371392d4f99257ed344cc9c82edb729` |
| 11: [observe-bar-range-missing-columns-r001.js](</Users/xiaomei/Documents/projects/dataease/Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/MVP-20261027/runtime-state-tools/observe-bar-range-missing-columns-r001.js>) | `6329a0b0d89cff1e03e59ecaa670dba5360713ff2dcc7c27a6df76483ad24035` |
| 12: [ContextBootstrap-BarRangeMissingColumnsRuntime-r001.json](</Users/xiaomei/Documents/projects/dataease/Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/planning/ContextBootstrap-BarRangeMissingColumnsRuntime-r001.json>) | `9edef154507748ebc9ce9f71f778be4c84efea8795377f0493d8202f45a73c31` |
| 13: [bar-range-missing-columns-runtime-admission-r001.json](</Users/xiaomei/Documents/projects/dataease/Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/planning/bar-range-missing-columns-runtime-admission-r001.json>) | `bbf8ba9c09136f2284f797d79299186247b79ea322ad422fc5c351a4452e19c3` |
| 14: [BarRangeMissingColumns-before-r001.png](</Users/xiaomei/Documents/projects/dataease/Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/MVP-20261027/evidence/BarRangeMissingColumns-before-r001.png>) | `0dddf43e9c9de00cdfd60bdede79d62cbbe3c515cfd24f4a43af9a1f350e5657` |
| 15: [BarRangeMissingColumns-after-r001.png](</Users/xiaomei/Documents/projects/dataease/Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/MVP-20261027/evidence/BarRangeMissingColumns-after-r001.png>) | `fbc8c528474da9bace85e24fed48fd97eca46aebca298f6a1b90e6e66a6096fb` |
| 16: [BarRangeMissingColumns-reopened-r001.png](</Users/xiaomei/Documents/projects/dataease/Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/MVP-20261027/evidence/BarRangeMissingColumns-reopened-r001.png>) | `078d53bbed85a3492401dc4717bd9128c7a176a9e642207ae6fe07f9a357261a` |
| 17: [BidirectionalBarMissingColumns-events-r001.json](</Users/xiaomei/Documents/projects/dataease/Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/MVP-20261027/evidence/BidirectionalBarMissingColumns-events-r001.json>) | `4575f121e1646367fc74a6aa56f6e3b612b34b245ae0f86857e0ce033847be40` |
| 18: [BidirectionalBarMissingColumnsToolFreeze-r001.json](</Users/xiaomei/Documents/projects/dataease/Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/MVP-20261027/evidence/BidirectionalBarMissingColumnsToolFreeze-r001.json>) | `8de27a57be326f88e8f57aaaa88a3240f11feb99deaeb24613e1df9107e89620` |
| 19: [observe-bidirectional-bar-missing-columns-r001.js](</Users/xiaomei/Documents/projects/dataease/Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/MVP-20261027/runtime-state-tools/observe-bidirectional-bar-missing-columns-r001.js>) | `b5f18e815abe6d00d300d127c43b8cbd6eeec90e8f8c7973d8c0780f9848a534` |
| 20: [ContextBootstrap-BidirectionalBarMissingColumnsRuntime-r001.json](</Users/xiaomei/Documents/projects/dataease/Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/planning/ContextBootstrap-BidirectionalBarMissingColumnsRuntime-r001.json>) | `9961e49d6074afbd3474b729d07fe1da1ce50d6e457c473510195a161c8f2f43` |
| 21: [bidirectional-bar-missing-columns-runtime-admission-r001.json](</Users/xiaomei/Documents/projects/dataease/Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/planning/bidirectional-bar-missing-columns-runtime-admission-r001.json>) | `723c650875bfa09794399b4257616528fa194e5ce5ed373c29241849ecd2ca39` |
| 22: [BidirectionalBarMissingColumns-before-r001.png](</Users/xiaomei/Documents/projects/dataease/Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/MVP-20261027/evidence/BidirectionalBarMissingColumns-before-r001.png>) | `5d0bf92d6d8f3bad555d3a17dadc0c25c643dde2235fcd65222dea48260ca545` |
| 23: [BidirectionalBarMissingColumns-after-r001.png](</Users/xiaomei/Documents/projects/dataease/Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/MVP-20261027/evidence/BidirectionalBarMissingColumns-after-r001.png>) | `150f2d3d7b8bf53f27b71b4408c89394af2011f9c6e9c1b9e106fc7465aa2c0a` |
| 24: [BidirectionalBarMissingColumns-reopened-r001.png](</Users/xiaomei/Documents/projects/dataease/Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/MVP-20261027/evidence/BidirectionalBarMissingColumns-reopened-r001.png>) | `0ceb1b3041115b686eb2d2aca1385afe0fde1c0c2ec752db5831152e04d1783d` |
| 25: [BulletGraphMissingColumns-events-r001.json](</Users/xiaomei/Documents/projects/dataease/Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/MVP-20261027/evidence/BulletGraphMissingColumns-events-r001.json>) | `c1b51dd2e238eca0914273eb886bc8a2dc3cdd9df76f63e4ba83b3f15c38a6f3` |
| 26: [BulletGraphMissingColumnsToolFreeze-r001.json](</Users/xiaomei/Documents/projects/dataease/Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/MVP-20261027/evidence/BulletGraphMissingColumnsToolFreeze-r001.json>) | `e372db939db9a60d303059df109d72062db03e5682fa0208c66c9957702f873d` |
| 27: [observe-bullet-graph-missing-columns-r001.js](</Users/xiaomei/Documents/projects/dataease/Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/MVP-20261027/runtime-state-tools/observe-bullet-graph-missing-columns-r001.js>) | `a173ced6aa2f9d08caf45b09acf20e1aa648c25bab326d5cfaf20aa17d9f14f4` |
| 28: [ContextBootstrap-BulletGraphMissingColumnsRuntime-r001.json](</Users/xiaomei/Documents/projects/dataease/Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/planning/ContextBootstrap-BulletGraphMissingColumnsRuntime-r001.json>) | `2f1c0747f959ea465363ca0745a3881b2fec2a5938690e996f9ec9b9f4244659` |
| 29: [bullet-graph-missing-columns-runtime-admission-r001.json](</Users/xiaomei/Documents/projects/dataease/Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/planning/bullet-graph-missing-columns-runtime-admission-r001.json>) | `fcf7a621494f8c383247a7a204e9762c382bbdca6a3e53c18b9ee9599c9613d0` |
| 30: [BulletGraphMissingColumns-before-r001.png](</Users/xiaomei/Documents/projects/dataease/Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/MVP-20261027/evidence/BulletGraphMissingColumns-before-r001.png>) | `5889674455262e63c16652750102739619553a11ff5f50bf47abf9011bad0222` |
| 31: [BulletGraphMissingColumns-after-r001.png](</Users/xiaomei/Documents/projects/dataease/Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/MVP-20261027/evidence/BulletGraphMissingColumns-after-r001.png>) | `7c28331b09a308008e154736435855404eded889e8f0b774fef7ccd91b6060e6` |
| 32: [BulletGraphMissingColumns-reopened-r001.png](</Users/xiaomei/Documents/projects/dataease/Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/MVP-20261027/evidence/BulletGraphMissingColumns-reopened-r001.png>) | `8f96d5002bb2dc906d5554f60c4726e774d155647cfd4cea6ee4eecb5f6eb7b2` |
| 33: [MultiScatterMissingColumns-events-r001.json](</Users/xiaomei/Documents/projects/dataease/Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/MVP-20261027/evidence/MultiScatterMissingColumns-events-r001.json>) | `44bdbb46f033e5c14c58be8908d1eb153765a4e16a45aab1d7165ba933b83025` |
| 34: [MultiScatterMissingColumnsToolFreeze-r001.json](</Users/xiaomei/Documents/projects/dataease/Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/MVP-20261027/evidence/MultiScatterMissingColumnsToolFreeze-r001.json>) | `cdb12e0a94aebaa17db9c90d779d6a1836663ba7d74de6a1a576bb4d34d31e6a` |
| 35: [observe-multi-scatter-missing-columns-r001.js](</Users/xiaomei/Documents/projects/dataease/Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/MVP-20261027/runtime-state-tools/observe-multi-scatter-missing-columns-r001.js>) | `d421a356b4fc60610eb7144a87562f268b4e98b562b2f8811a0aee70e026dc3e` |
| 36: [ContextBootstrap-MultiScatterMissingColumnsRuntime-r001.json](</Users/xiaomei/Documents/projects/dataease/Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/planning/ContextBootstrap-MultiScatterMissingColumnsRuntime-r001.json>) | `72f2c09ee5f02a5f7c64827ef0499e7ce3b714628b2fd8d54bd3921f602dd31e` |
| 37: [multi-scatter-missing-columns-runtime-admission-r001.json](</Users/xiaomei/Documents/projects/dataease/Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/planning/multi-scatter-missing-columns-runtime-admission-r001.json>) | `686a8f6d85f121a523e4390a65f33fcc24c42ff4b0d5a5880ea4239ce6259c99` |
| 38: [MultiScatterMissingColumns-before-r001.png](</Users/xiaomei/Documents/projects/dataease/Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/MVP-20261027/evidence/MultiScatterMissingColumns-before-r001.png>) | `e215354f04729a30909936b5e7c7050cbad58b34e3fe8f0f2af8da277e4667cd` |
| 39: [MultiScatterMissingColumns-after-r001.png](</Users/xiaomei/Documents/projects/dataease/Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/MVP-20261027/evidence/MultiScatterMissingColumns-after-r001.png>) | `5177396cc1c7480401a3478b7b407150644971df2814745fdd0d62e323d31b92` |
| 40: [MultiScatterMissingColumns-reopened-r001.png](</Users/xiaomei/Documents/projects/dataease/Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/MVP-20261027/evidence/MultiScatterMissingColumns-reopened-r001.png>) | `c15a7dcdd728ca9380b7256f2e3054692e6122a6c56e20c9cd26803cb6ab4f25` |
| 41: [QuadrantMissingColumns-events-r001.json](</Users/xiaomei/Documents/projects/dataease/Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/MVP-20261027/evidence/QuadrantMissingColumns-events-r001.json>) | `a628ead276b9e8bb5052dc55c3d0007aad8b58adab19a57e73d9b8f547eea92d` |
| 42: [QuadrantMissingColumnsToolFreeze-r001.json](</Users/xiaomei/Documents/projects/dataease/Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/MVP-20261027/evidence/QuadrantMissingColumnsToolFreeze-r001.json>) | `1453223f3850bd15fd446ab4366fc6e0b2025a7a2e47e0833d14ac10c204043d` |
| 43: [observe-quadrant-missing-columns-r001.js](</Users/xiaomei/Documents/projects/dataease/Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/MVP-20261027/runtime-state-tools/observe-quadrant-missing-columns-r001.js>) | `4c624724dfdc51660508dc80bcbe7ef3ed187a6bcb23bec8bfdb3e1ef226da0f` |
| 44: [ContextBootstrap-QuadrantMissingColumnsRuntime-r001.json](</Users/xiaomei/Documents/projects/dataease/Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/planning/ContextBootstrap-QuadrantMissingColumnsRuntime-r001.json>) | `ee24cf6d1d6f8fbd4a2ff3b6cd54095697ae23c862430d8fa939952027987beb` |
| 45: [quadrant-missing-columns-runtime-admission-r001.json](</Users/xiaomei/Documents/projects/dataease/Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/planning/quadrant-missing-columns-runtime-admission-r001.json>) | `2af7bfc71e90cd18750efdaa65f483add7b379a987f966e24fa0396ae9f9ec92` |
| 46: [QuadrantMissingColumns-before-r001.png](</Users/xiaomei/Documents/projects/dataease/Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/MVP-20261027/evidence/QuadrantMissingColumns-before-r001.png>) | `68945c1cb0c9e8c21723f6fc7e386f9c71c5a6ac4ea33dd7e5deaad1f0899977` |
| 47: [QuadrantMissingColumns-after-r001.png](</Users/xiaomei/Documents/projects/dataease/Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/MVP-20261027/evidence/QuadrantMissingColumns-after-r001.png>) | `ebae279645a2d450278a1570dbc68f3a0088f95697ffb9bc0d87ef7b664753a5` |
| 48: [QuadrantMissingColumns-reopened-r001.png](</Users/xiaomei/Documents/projects/dataease/Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/MVP-20261027/evidence/QuadrantMissingColumns-reopened-r001.png>) | `be4b036288e48588a0d150b3efaf0dc6ca7c9de7814a2f0d049d6966926175db` |
| 49: [StockLineMissingColumns-events-r001.json](</Users/xiaomei/Documents/projects/dataease/Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/MVP-20261027/evidence/StockLineMissingColumns-events-r001.json>) | `2b19fd8df653afba846c8ab35c40934b4d29011c773da574d69a83271f87772b` |
| 50: [StockLineMissingColumnsToolFreeze-r001.json](</Users/xiaomei/Documents/projects/dataease/Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/MVP-20261027/evidence/StockLineMissingColumnsToolFreeze-r001.json>) | `12cdde6abae4b76c0dae0d1dde9107973bb76ce4a5c890e80a758b0a1ddcd5d7` |
| 51: [observe-stock-line-missing-columns-r001.js](</Users/xiaomei/Documents/projects/dataease/Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/MVP-20261027/runtime-state-tools/observe-stock-line-missing-columns-r001.js>) | `30f9dc2824546abc5ab9ed8453192ce07004df8cc19bca30e224e45f43768e96` |
| 52: [ContextBootstrap-StockLineMissingColumnsRuntime-r001.json](</Users/xiaomei/Documents/projects/dataease/Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/planning/ContextBootstrap-StockLineMissingColumnsRuntime-r001.json>) | `7b386f61bba5676031883506384aab1217871cca0b0616dbb055d6f99dd4a540` |
| 53: [stock-line-missing-columns-runtime-admission-r001.json](</Users/xiaomei/Documents/projects/dataease/Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/planning/stock-line-missing-columns-runtime-admission-r001.json>) | `91fe4d43326b8835df09f25cea5ef2093b28f9f8a702c2e55378e47922ab9f2f` |
| 54: [StockLineMissingColumns-before-r001.png](</Users/xiaomei/Documents/projects/dataease/Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/MVP-20261027/evidence/StockLineMissingColumns-before-r001.png>) | `c3ce66b08a9fbe2b81cfb950a260bc19bace2bf738993cd51dc94ac7561c596e` |
| 55: [StockLineMissingColumns-after-r001.png](</Users/xiaomei/Documents/projects/dataease/Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/MVP-20261027/evidence/StockLineMissingColumns-after-r001.png>) | `5bc600ba0447c3255c3d389618adc4c432941b034550a5b11f25fd2c0e34e1b5` |
| 56: [StockLineMissingColumns-reopened-r001.png](</Users/xiaomei/Documents/projects/dataease/Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/MVP-20261027/evidence/StockLineMissingColumns-reopened-r001.png>) | `a148af83fd3d5ab64e9d046b53e4d9793d8588629bcd02a54952d0e41ec8a42e` |

| 补充源码/原件与用途 | SHA-256 |
| --- | --- |
| [chart.ts](</Users/xiaomei/Documents/projects/dataease/core/core-frontend/src/api/chart.ts>)：100–102：stock请求横轴强制desc | `9f160c78f24bf50be80c9510529682267530dcc28d203478074af4add865c74b` |
| [range-bar.ts](</Users/xiaomei/Documents/projects/dataease/core/core-frontend/src/views/chart/components/js/panel/charts/g2/bar/range-bar.ts>)：135–179：区间values转startValue/endValue | `8b848e9567b77645d9dd6da99e4f9014fe0f1500a4faa8cd5dfcc219c2a5cdac` |
| [bidirectional-bar.ts](</Users/xiaomei/Documents/projects/dataease/core/core-frontend/src/views/chart/components/js/panel/charts/g2/bar/bidirectional-bar.ts>)：235–288：分两侧data系列分别绘制 | `53fa36fa169dce1b5abe7267131cb152b6a053bde058018f255e9c71d825decb` |
| [bullet-graph.ts](</Users/xiaomei/Documents/projects/dataease/core/core-frontend/src/views/chart/components/js/panel/charts/g2/bar/bullet-graph.ts>)：796–850：按field和quotaId分measures/target | `e42033748ec98acf0a4dc44c8b76bf3583a2d74ba2efd48298f2489fb06d76e8` |
| [scatter-multi.ts](</Users/xiaomei/Documents/projects/dataease/core/core-frontend/src/views/chart/components/js/panel/charts/g2/relation/scatter-multi.ts>)：764–813：日期xLabel、y、category颜色与lightness | `7398414d810640f456317f043f4b316a00005f78e2a6b0f58777b54e71911c05` |
| [quadrant.ts](</Users/xiaomei/Documents/projects/dataease/core/core-frontend/src/views/chart/components/js/panel/charts/g2/relation/quadrant.ts>)：135–170、195：value/extValue二维坐标 | `d4699193ea9cb4e98f3458c9663ed7a71cd43f4dad9f8666eb7b47b406476628` |
| [stock-line.ts](</Users/xiaomei/Documents/projects/dataease/core/core-frontend/src/views/chart/components/js/panel/charts/g2/bar/stock-line.ts>)：289–315、703–712：tableRow、升序绘制和四轴位置 | `fbbc31c1f88c5a7999940d7ed798542d0e158d0eaddedd40de1d848e8322a413` |
| [ChartViewFieldDTO.java](</Users/xiaomei/Documents/projects/dataease/sdk/extensions/extensions-view/src/main/java/io/dataease/extensions/view/dto/ChartViewFieldDTO.java>)：字段DTO，未声明axisType/seriesId | `719a8da60b02a7dd0b1dcc9e4580367d3693a7263452cb7d5192c51fa14dc8cf` |
| [ChartViewFieldBaseDTO.java](</Users/xiaomei/Documents/projects/dataease/sdk/extensions/extensions-view/src/main/java/io/dataease/extensions/view/dto/ChartViewFieldBaseDTO.java>)：dateStyle后端聚合、datePattern分隔、dateShowFormat前端格式化 | `c482bb69b96029e5341bdfd08a3c9750097c22ca194f8ed9ea1d65a634150616` |
| [DatasetTableFieldDTO.java](</Users/xiaomei/Documents/projects/dataease/sdk/extensions/extensions-datasource/src/main/java/io/dataease/extensions/datasource/dto/DatasetTableFieldDTO.java>)：父DTO未检出axisType/seriesId | `a868069e681f53bf5d7bbfbd2439cce160f3f845015165d8313c0441f7073572` |
| [SliceC2Validation-r003.md](</Users/xiaomei/Documents/projects/dataease/Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/MVP-20261027/reviews/SliceC2Validation-r003.md>)：原C2累计3/3 BLOCKED，不重审 | `17e6566b99fe25194bf957abaf58c95e4398df4d1edf5aee6aec9e3470575ee6` |
| [MvpAcceptanceReadinessHandoff-r001.md](</Users/xiaomei/Documents/projects/dataease/Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/MVP-20261027/MvpAcceptanceReadinessHandoff-r001.md>)：原38/49及非最终准备声明 | `663cba05b5bbe6c2e1f9abd09353fbde103638b14b6190bb25f0232e61ba5b1b` |
| [FullAcceptancePhaseCrosswalk-r001.json](</Users/xiaomei/Documents/projects/dataease/Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/MVP-20261027/FullAcceptancePhaseCrosswalk-r001.json>)：原P1=12/P2=26/38分母 | `e0a5d2aee17d9d11354d32de02b68debc4b0e7d6cc20b9b0899c55c400e284cf` |
| [check.mjs](</Users/xiaomei/Documents/projects/dataease/core/core-frontend/tests/filter-copy-mvp-renderers/check.mjs>)：已审格式候选实际落盘字节，仅核固定槽位不重审C1 | `b8dbb5e47463960fe5ae59bda68a2c29b56b1d90baa88dda745b885554f6bc3f` |
| [THeatmapPrimaryData-format-landed-green-r001.log](</Users/xiaomei/Documents/projects/dataease/Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/MVP-20261027/evidence/THeatmapPrimaryData-format-landed-green-r001.log>)：C1固定槽位原始确定性复验日志，非本lane重跑 | `aef8cd0c78fdb2f09ca262f066dd23c987323b00d019c2681d5d481f2e8f6af5` |
| [THeatmapPrimaryData-format-landed-eslint-r001.log](</Users/xiaomei/Documents/projects/dataease/Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/MVP-20261027/evidence/THeatmapPrimaryData-format-landed-eslint-r001.log>)：C1固定槽位原始确定性复验日志，非本lane重跑 | `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855` |

写报告前后重新核对57项卡输入和补充材料，摘要均与本报告一致。本报告没有更新运行矩阵、Dashboard、Coverage或Goal终态；由root依据本次有界结论继续原计划。
