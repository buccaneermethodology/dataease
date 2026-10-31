# MissingColumnsBatch1 四型补列证据独立验证 r001

- reviewed_at：`2026-10-30T18:05:12.399169+00:00`。
- snapshot_id：`S02-MISSING-COLUMNS-BATCH1-VALIDATION-r001`；as_of_state：卡绑定四型原件、Context与准入，运行窗口17:51—17:54Z。
- verdict：**PASS_WITH_LIMITATIONS（四型本次基本配置补列有界通过，附限制）**；新增阻断0。
- 本批新补列证据首轮 **1/3**，不是重开旧类型实现/设计。范围仅area-stack r002、bar-stack r001、bar-horizontal r001、bar-stack-horizontal r001；line和area r007均不纳入本次重新判定。

**四型本次完整source/clip/target、独立结果、一次candidate、显式保存/find读回、正常panel退出/editor0及重开结果列均可核。四个新Context各8条required_read_set真实存在且SHA匹配，没有复现area r007内部清单漂移。** 结果只到每型一个单系列shop+SUM(amount)基本配置；多系列变体、金额显示格式是否合适、完整类型和原38义务不由此关闭。

## 基线、输入与方法

接收端card validate/render退出0，canonical digest `a0deacea4def1d593c1ab391665b4a4841bc211a1c2d1fd806af5136a99f124c`；指定prompt与renderer输出逐字相同。39处卡引用含重复Goal，折叠为38唯一输入，逐项原字节摘要匹配；批次wrapper的32条原件引用也匹配，不以其candidate_count/driver_unchanged等布尔代替判断。

本lane直接读四driver（与已审area协议的实际差异）、四Context/admission、全部36条wire原始request/body、160条api、52条字段目录、diagnostic、CSV及12PNG；不操作UI/DB/应用HTTP/安装/构建/测试。写前报告不存在，HEAD `1e84e7438462e5d6fc371358da3bdad7d24a5c1a`、porcelain既有记录4883项，未暂存、回退或整理它们；唯一仓库写入为本报告。

本卡未绑定当前64源码；审阅期间其它授权任务可能修改三角色端口等源码，因此本报告只绑定这些历史运行原件/协议，不把当前源码或之后的测试倒灌成当时执行证据，也不声称当前源码已由本轮回归。

独立脚本 `/tmp/review_missing_columns_batch1_r001.py` SHA-256 `9d9326e1f132499a812005fc35ae285e715104c3915cd69366000d80329c590f`，结果 `/tmp/review_missing_columns_batch1_r001.result.json` SHA-256 `af0bce4a3ce2ca15b96140dce8a6f8d5fcd480da3f1953633430290e1f5d8696`，执行退出0。复用reviewer既有严格descriptor比较，金额投影用Decimal精确比较；JS诊断整数与HTTP的`.0`数字表示差异不被当成金额不同，树/descriptor没有归一化。临时脚本不是长期唯一证据，必要结果与定位保存在下文。

| 卡输入（相对于工作区） | SHA-256 |
| --- | --- |
| `Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/Goal.final.json` | `4db931a6764a8c48345e7e8358e579550a9bc98594bf1654647716d72b9678c4` |
| `Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/MVP-20261027/UiIntegrationCases-r002.json` | `e365ef111582ef84f20f26e6136854409b7fc66bb0931cae40a9df5318036d55` |
| `Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/MVP-20261027/runtime-fixtures/TeaMaterialExtended-r001.csv` | `abc8bed0862129d58724bcefff2563862e48d1ea057365ae8d5d2c853e64472b` |
| `Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/MVP-20261027/reviews/MvpAcceptanceReadinessReview-r001.md` | `fba3b6ad368e085b787cd9a69497f5fb51163397559d718f7596dd014a06d9af` |
| `Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/MVP-20261027/evidence/MissingColumnsBatch1-r001.json` | `48df5572c7f0c0df7a72b124c11d220a5b7930f9ac361a3585c31160f16184b1` |
| `Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/planning/Topology-actual-r572.json` | `e59ed5fe32fb4eb39945552c5ca43d3a0b4585421d4557f7ff7a1cd1b154eda1` |
| `Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/MVP-20261027/evidence/AreaStackMissingColumns-events-r002.json` | `5ab12a5d4cd81d3b4403f8693428496889a685bbb6c81074fe6256e0fead10a2` |
| `Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/MVP-20261027/evidence/AreaStackMissingColumnsToolFreeze-r002.json` | `b93608d362e3ebcf6bf4b1936e0640be7a6b102bfda2dd316e74a4ea6b913d12` |
| `Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/MVP-20261027/runtime-state-tools/observe-area-stack-missing-columns-r002.js` | `d2e16fa45085823de1a03a74ca19110c0c05963b3df68246b9d584e7622fc98a` |
| `Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/planning/ContextBootstrap-AreaStackMissingColumnsRuntime-r002.json` | `0c7677b1ae90dc3ccd4b396f6cb61d4b2c267be1ec45d199b2bc641a0c72207a` |
| `Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/planning/area-stack-missing-columns-runtime-admission-r002.json` | `e415e2c6b936f95134b6b71e7f56e87449396ea8693b147e9a7f9edf7ac14d0b` |
| `Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/MVP-20261027/evidence/AreaStackMissingColumns-before-r002.png` | `69508fbfb19935e5f12d7384ffa4413e0f93357eb882af19e8ae5b0f02983ff3` |
| `Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/MVP-20261027/evidence/AreaStackMissingColumns-after-r002.png` | `6d539b8d8d95f018bebf26a9e221086e86da5197ee9433b34969b146e5f1b5af` |
| `Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/MVP-20261027/evidence/AreaStackMissingColumns-reopened-r002.png` | `c936a431c6ada300b05f647fc0da633ec22eee51f71c910566f594e84e19904a` |
| `Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/MVP-20261027/evidence/BarStackMissingColumns-events-r001.json` | `1912ddd6eb9946c38dc62b07f250fc57a2678854d1e56c49f8c4202cabd7038a` |
| `Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/MVP-20261027/evidence/BarStackMissingColumnsToolFreeze-r001.json` | `93a7fbdca281fa4ca01677ed938f61a34b497481f453acd541c3a822350cb757` |
| `Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/MVP-20261027/runtime-state-tools/observe-bar-stack-missing-columns-r001.js` | `7d5f81b277cdba0e1e5760bb41e7a8d66490dd9edd290418996f9a113fa7f46c` |
| `Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/planning/ContextBootstrap-BarStackMissingColumnsRuntime-r001.json` | `222996073fe141887a2fb9aa1231bce76a941f0d9da770bc55dcbb1e9424accf` |
| `Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/planning/bar-stack-missing-columns-runtime-admission-r001.json` | `62a657a0461109304a2dd855a354e1dadadfcfc9484210d54b8ecd945c3ab65c` |
| `Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/MVP-20261027/evidence/BarStackMissingColumns-before-r001.png` | `7d9872b0e31e2570c0bfb8eaca3880ff508781bc97ce6e47234de66e9a680d9f` |
| `Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/MVP-20261027/evidence/BarStackMissingColumns-after-r001.png` | `12b7d179d81ba0fa06165f294412ff618a5d60f7d9258763865606a9bb81cd9f` |
| `Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/MVP-20261027/evidence/BarStackMissingColumns-reopened-r001.png` | `7bf42709d6d797ca8dd490949a75c4499d9fde539752c4a5180624718bc6fff3` |
| `Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/MVP-20261027/evidence/BarHorizontalMissingColumns-events-r001.json` | `f34bc21968a31aa5eb0dcba66aa6856d4a6b151f37d61486f86dc923dadc8a35` |
| `Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/MVP-20261027/evidence/BarHorizontalMissingColumnsToolFreeze-r001.json` | `893cede9aece80df350ee1dd14c6fb587448330689c6eaf657a3cc30b7382607` |
| `Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/MVP-20261027/runtime-state-tools/observe-bar-horizontal-missing-columns-r001.js` | `427467dba8236f29b93be8d106be01252758381b56ef7fdc90d21abdea20916c` |
| `Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/planning/ContextBootstrap-BarHorizontalMissingColumnsRuntime-r001.json` | `a7282a97530034f1a568adedc3b344dc73574996f5d24e67321cf0f763f9415b` |
| `Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/planning/bar-horizontal-missing-columns-runtime-admission-r001.json` | `be4fb7caec1ec8204df4e340cd613e6fae0585050a08c8b4fc163acd6f8e194d` |
| `Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/MVP-20261027/evidence/BarHorizontalMissingColumns-before-r001.png` | `122d8b5f50f312831956463e4b1dc6a0a96b8d6e782835226f9c1aafb345b96d` |
| `Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/MVP-20261027/evidence/BarHorizontalMissingColumns-after-r001.png` | `78efbda4bbf29a31920c4a9f63333c9d273c0219f273c1e6e15efc854f23b0aa` |
| `Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/MVP-20261027/evidence/BarHorizontalMissingColumns-reopened-r001.png` | `9256cc6119b7dd470515cf5bd5da78cd2422eca28132474a0e98bbe264d62b70` |
| `Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/MVP-20261027/evidence/BarStackHorizontalMissingColumns-events-r001.json` | `b51b1fdd9cce7b312f4aac190b9d8d512fe0e24cdca8fc72f7891d3d4c3abcde` |
| `Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/MVP-20261027/evidence/BarStackHorizontalMissingColumnsToolFreeze-r001.json` | `7c14ad9f2915fe6a513dd7d25a29d320c807160b116ead677097a4c89e4b5b2e` |
| `Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/MVP-20261027/runtime-state-tools/observe-bar-stack-horizontal-missing-columns-r001.js` | `5b481af7a7014502cd284adca3c634a9d9864d4ef00700b704a1f7d536f959a7` |
| `Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/planning/ContextBootstrap-BarStackHorizontalMissingColumnsRuntime-r001.json` | `d3ce4f7ca7fc78906469c660e2b65e77d1cb6fa5e21ef6918958bcc1bb99211e` |
| `Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/planning/bar-stack-horizontal-missing-columns-runtime-admission-r001.json` | `f936191abc68ca769b6725bb5e3910978901c49ebbb90f48f992c1684a1eff4b` |
| `Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/MVP-20261027/evidence/BarStackHorizontalMissingColumns-before-r001.png` | `667984e9a52588cda39fe0b5fd2c9ccc21b6ead8b755e193042d1be354825c32` |
| `Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/MVP-20261027/evidence/BarStackHorizontalMissingColumns-after-r001.png` | `adfc18c3f128fdf4f13c909e09a9b2b1e8b213482b0f4c748b0850041b2e2484` |
| `Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/MVP-20261027/evidence/BarStackHorizontalMissingColumns-reopened-r001.png` | `75d6fa4e1d793146db568f0cd360dfdcf83b3be055ff4bf71841b3713557182e` |

| 精确追加输入 | SHA-256 |
| --- | --- |
| `Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/MVP-20261027/reviews/UiIntegrationDesignReview-r003-C234.md` | `5d4c26ebda1ba9847e19ea1d04caa82d26a54cee01685a167d8313aa3114f4b2` |
| `Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/MVP-20261027/RuntimeMissingColumnsPlan-r001.json` | `1c80cfa3da6a2a319d200f1cea356176eccd5cc0389546013d52ff204ac5c8cc` |
| `Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/MVP-20261027/evidence/AreaStackMissingColumns-events-r001.json` | `db6d4164b5ab067e6fc44c8ab6196ef0b31fd1064755e81389f4e2231921e4fd` |
| `Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/MVP-20261027/evidence/AreaStackMissingColumnsToolFreeze-r001.json` | `9dc6ebcfc3357a774a2c3e6b6c8682d0c0fc05c3bece1e1be43cf7a447002958` |
| `Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/MVP-20261027/runtime-state-tools/observe-area-stack-missing-columns-r001.js` | `2a7b02f7524fb4c06c52897eaea4ea69c04279b26fb826d5659912e02bd298a9` |
| `Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/MVP-20261027/evidence/AreaStackMissingColumns-before-r001.png` | `69508fbfb19935e5f12d7384ffa4413e0f93357eb882af19e8ae5b0f02983ff3` |
| `Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/planning/missing-columns-batch1-validation-r001-prompt.md` | `a258569ab2da8880a6d4c5526ecad6c2220cd5592c938e7d39d46df67ed2d152` |

## 四个新Context与准入逐层核对

四Context分别有8条required_read_set：固定Goal、UiIntegrationCases-r002、UiIntegrationDesignReview-r003-C234、准备审查、最小补列计划、本型driver、本型freeze和Topology-r572。32/32逐项真实路径与revision摘要匹配；没有把observer版本号替换进固定合同/设计路径。四admission各5个顶层Goal/contract/context/design/topology摘要均匹配，action=builder、target为同一隔离本地资源入口，与本次实际操作范围一致；Context目标与各自输出路径、类型和阈值对应。四个schema校验、四个execution_admission复验均退出0，结论仍以以上人工/独立逐项对账为依据。

| type | pre-freeze时间 | admission issued_at | freeze/start/end/current一致的driver SHA-256 |
| --- | --- | --- | --- |
| `area-stack` | 2026-10-30T17:51:03.005323+00:00 | 2026-10-30T17:51:03.005323+00:00 | `d2e16fa45085823de1a03a74ca19110c0c05963b3df68246b9d584e7622fc98a` |
| `bar-stack` | 2026-10-30T17:52:36.895183+00:00 | 2026-10-30T17:52:36.895183+00:00 | `7d5f81b277cdba0e1e5760bb41e7a8d66490dd9edd290418996f9a113fa7f46c` |
| `bar-horizontal` | 2026-10-30T17:53:23.884877+00:00 | 2026-10-30T17:53:23.884877+00:00 | `427467dba8236f29b93be8d106be01252758381b56ef7fdc90d21abdea20916c` |
| `bar-stack-horizontal` | 2026-10-30T17:54:21.323144+00:00 | 2026-10-30T17:54:21.323144+00:00 | `5b481af7a7014502cd284adca3c634a9d9864d4ef00700b704a1f7d536f959a7` |

冻结和准入都早于各自执行。此处只证明当前四个新Context引用完整及执行时driver文件起止摘要一致，不追认旧area r007准入，不证明浏览器bundle或宿主全过程完整性。

**拓扑文字上限：** 卡实际绑定r572，但它的正文仍是旧area审阅前节点；卡rebaseline_ref还指r571。它们作为既有可追溯节点保留，不冒充四型的final topology或Goal最终状态。当前四型的具体任务身份、时间、原件和输出范围由本卡及各自Context/admission明确区分。

## 实际四型和完整CSV结果

共享resource=`1312476889213964288`、dataset=`1312472054565572608`、target=`7520752064427724800`。source500为`7520741153101058048`的symbolic-map，source200为`7521402539875504128`的rich-text；正常选择ID、实际类型控件和保存/find中的源type互相对应。目标真实type以每条request.type、query响应type、save/find目标type为准。

| type / 版本 | 基线→候选阈值 | 实际复制源type | baseline→candidate→reopen金额 | 实际执行窗口UTC |
| --- | --- | --- | --- | --- |
| `area-stack` / r002 | 200→500 | symbolic-map | 6761→5093→5093 | 2026-10-30T17:51:26.809Z—2026-10-30T17:51:38.942Z |
| `bar-stack` / r001 | 500→200 | rich-text | 5093→6761→6761 | 2026-10-30T17:52:40.705Z—2026-10-30T17:52:52.790Z |
| `bar-horizontal` / r001 | 200→500 | symbolic-map | 6761→5093→5093 | 2026-10-30T17:53:27.353Z—2026-10-30T17:53:37.132Z |
| `bar-stack-horizontal` / r001 | 500→200 | rich-text | 5093→6761→6761 | 2026-10-30T17:54:24.796Z—2026-10-30T17:54:36.968Z |

四型都正常点类型、清所需轴、原生dragTo拖shop和amount，明确“更新图表数据”后再执行一次粘贴和覆盖确认。所有本型query的xAxis只有shop字段`1793083721149`，yAxis只有amount字段`1793083721146`且summary=sum；xAxisExt/yAxisExt/extStack/extBubble/extLabel/extTooltip/drillFields为空。因此这是单系列基本配置，不替代旧G包的city/series多系列堆叠配置。

CSV30行、19字段、30唯一id。对真实完整and/or树、amount gt和六店枚举递归求值，再按shop逐组求和，不只比较总和，不假定SQL排序：

- T200：14行，id=`3,5,11,12,13,14,15,16,17,18,20,21,23,25`；果元3218、南都1284、乐园563、水围1141、香橙555，合6761。
- T500：8行，id=`3,5,11,13,16,18,21,25`；果元2670、南都1284、乐园563、水围576，合5093。

| type | 阶段 | wire / sequence | request→response UTC | 阈值 / CSV行数 / 金额 |
| --- | --- | --- | --- | --- |
| `area-stack` | configuration | 0 / 7 | 17:51:27.766Z→17:51:27.793Z | 200 / 14 / 6761 |
| `area-stack` | baseline | 1 / 8 | 17:51:32.078Z→17:51:32.104Z | 200 / 14 / 6761 |
| `area-stack` | candidate | 2 / 13 | 17:51:34.749Z→17:51:34.797Z | 500 / 8 / 5093 |
| `area-stack` | reopen | 6 / 32 | 17:51:36.928Z→17:51:36.947Z | 500 / 8 / 5093 |
| `bar-stack` | configuration | 0 / 7 | 17:52:41.585Z→17:52:41.618Z | 500 / 8 / 5093 |
| `bar-stack` | baseline | 1 / 8 | 17:52:45.913Z→17:52:45.942Z | 500 / 8 / 5093 |
| `bar-stack` | candidate | 2 / 13 | 17:52:48.565Z→17:52:48.602Z | 200 / 14 / 6761 |
| `bar-stack` | reopen | 6 / 32 | 17:52:50.696Z→17:52:50.726Z | 200 / 14 / 6761 |
| `bar-horizontal` | configuration | 0 / 7 | 17:53:28.334Z→17:53:28.368Z | 200 / 14 / 6761 |
| `bar-horizontal` | baseline | 1 / 8 | 17:53:30.158Z→17:53:30.187Z | 200 / 14 / 6761 |
| `bar-horizontal` | candidate | 2 / 13 | 17:53:32.892Z→17:53:32.930Z | 500 / 8 / 5093 |
| `bar-horizontal` | reopen | 6 / 32 | 17:53:35.054Z→17:53:35.078Z | 500 / 8 / 5093 |
| `bar-stack-horizontal` | configuration | 0 / 7 | 17:54:25.782Z→17:54:25.814Z | 500 / 8 / 5093 |
| `bar-stack-horizontal` | baseline | 1 / 8 | 17:54:30.109Z→17:54:30.149Z | 500 / 8 / 5093 |
| `bar-stack-horizontal` | candidate | 2 / 13 | 17:54:32.745Z→17:54:32.776Z | 200 / 14 / 6761 |
| `bar-stack-horizontal` | reopen | 6 / 32 | 17:54:34.933Z→17:54:34.951Z | 200 / 14 / 6761 |

16条本型query完整分组均匹配CSV。36条business wire全HTTP200/code0；每型有9条wire，其中4条本型query（configuration、baseline、candidate、reopen），另有1 save、1 find、3条其它view自动重开query。每型40条api（31 POST、9 GET）、13条目录响应，合计160 api、52目录响应；目录也均200/code0。

**configuration自动查询与candidate分开：** 每个type切换后都有一次configuration query，之后显式更新又有baseline query；二者均独立复算，但都不是粘贴。正式candidate窗口每型api `[13,14)` 只有一个target本型getData，qobs为operation1/success/logicalGetDataCalls1。物理candidate一次由独立请求监听及raw wire核实，不从logical计数泛推全部HTTP。重开3个其它view查询也不混入candidate。

其它view的symbolic只核顶层坐标分组，rich-text只核实际一组；picture的query DTO为table-info、实际保存canvas type为picture-group，id25明细投影匹配CSV，不当table-info新增target样本，也不关闭details/tooltip/地理精度等旧问题。

## 完整descriptor、source输出与保存重开

每型11个diagnostic时点，共16份非空source/clip descriptor；本批64份均独立重建ownKeys路径、键顺序与undefinedPaths对应关系，自洽通过。完整树严格区分类型、null、空串、缺键及数组次序。

每型均可直接重算sourceBeforeCopy.source→copied.source/clipboard→after.source的完整tree/ownKeys/undefinedPaths相等；candidate HTTP.customFilter严格等于该树。copied/before/after/areaBeforeSourceCopy的整个已导出clip投影（tree/ownKeys/undefinedPaths/tableId/createdAt/revision）不变。其后本型再次正常copy使revision加1、createdAt变新，完整source export descriptor匹配；该步qobs仍是旧candidate，没有新getData。

| type | 正式来源copy revision / createdAt | 本型source export revision / createdAt | 实际panel退出UTC / editorCount |
| --- | --- | --- | --- |
| `area-stack` | 4 / 515110.1999999881 | 5 / 517026.39999997616 | 17:51:36.404Z / 0 |
| `bar-stack` | 6 / 588877.8999999762 | 7 / 590824.1000000238 | 17:52:50.179Z / 0 |
| `bar-horizontal` | 8 / 633222.1999999881 | 9 / 635171.1000000238 | 17:53:34.533Z / 0 |
| `bar-stack-horizontal` | 10 / 693072.1999999881 | 11 / 695020.1000000238 | 17:54:34.372Z / 0 |

每型真实`updateCanvas`只有一次（wire3 / sequence16），HTTP200/code0；checkCanvasChange/nameCheck为辅助检查，不计额外保存。save/saveCanvas路径均0。save载荷canvasViewInfo中的目标type和完整customFilter与copied/after相同；findById为wire4 / sequence28，request为同资源、dashboard/main-edit/snapshot，读回目标完整树相等。find目标对象也与reopenedResponseIdentity所记录对象一致。

四次实际退出都到 `#/panel/index` 且editorCount=0，并等待diagnostic/back-icon隐藏；这是正常导航，不是点击后退按钮。其后才find和本型重开query。四型after.source与reopened.source完整descriptor严格相等，reopened clipboard=null/pasteReason=clipboard_empty/qobs=null；qobs为空不否定已捕获的新HTTP重开结果。

这些基本配置的保存重开列通过，不包括所有变体、深拷贝/引用隔离、内部fields全集、TTL、多身份或所有Store。每个step明确保存并保留本型目标供下一批，不声明恢复原liquid500或全部hidden配置；本卡也不推断之后其它任务执行后的当前全局UI状态。

## 全部发现与12PNG直接视觉核查

**F-B01：数值标签格式存在可见边界，不扩大为全部视觉语义通过。** 已直接看全部12张419×316原PNG，实际轮廓与分组数按T200五组/T500四组改变，保存重开与after一致；未见这些局部截图空白或loading遮挡。但area-stack/bar-stack/bar-stack-horizontal三个堆叠型标签显示amount×100%的文字，例如3218显示321,800.00%、2670显示267,000.00%；bar-horizontal标签为3,218/2,670等原金额。四型全部原request/response的`customAttr.label.labelFormatter.type`均为percent，且从configuration、baseline、candidate到reopen保持，说明该设置在paste前已经存在；相同DTO设置在不同renderer的实际显示不能只凭配置对象推断。

本报告不把上述现象直接归因为本轮copy/paste缺陷，也不声明金额使用百分号的业务适用性、标签格式/全部renderer语义已通过。已核的原始金额、source/clip/保存/重开列可用；若后续原AC需要正确金额格式的可见见证，先正常UI核既有格式设置，只补该显示列，不重做已核数值/保存链或重开旧实现轮次。

**F-B02：复用文字和case_id残留，不能用于跨包唯一身份。** 四份事件都写`case_id=S02-AREA-MISSING-COLUMNS-r001`，schema名和部分注释/错误码/declaredWriteScope仍是area；initial_target_liquid500_reported不是其当时真实type。bar-stack/bar-stack-horizontal的stage和final note仍写area200，bar-horizontal仍写area-stack500。它们有误导下游映射的风险，但raw request/response/save/find type及阈值、类型控件、各独立路径/SHA/时间明确且一致，能够识别本次四型；本报告不据旧字符串认类型或拼接operationId=1为同一操作。

最小动作是在后续新记录中准确填写类型/版本身份；冻结旧件保留原样，消费者按type+原件路径+SHA+时间定位，不根据重复case_id或stage文本自动升级覆盖。此处不要求重跑四个已核case来修字面标签。

**F-B03：治理与源码边界保留。** 当前四个新Context引用正确不修复或追认area r007原内部漂移；原r572/r571是历史节点，不冒称新终态。运行证据不证明之后三角色端口源码行为，也不以当前源码改动反推这些历史case失败。

**F-B04：area-stack r001控制器失败与恢复不是产品RED。** 原件17:49:21.090Z—17:49:35.817Z；已经发生configuration/baseline area-stack200查询并有before PNG。17:49:33.927Z在copy_source500阶段选择target时，点击角落被相邻symbolic-map工具栏path截获，click8000ms超时，正式candidate窗口尚未开始，save0。随后17:49:34.156Z正常panel退出/editor0，重开last-saved **area200**、clip空，recovery.completed=true；本次与此前area r006恢复超时是不同事件。后续r002把非richtext目标点击改到100,20并成功运行，是新时点恢复观察，不把r001改成首次成功，不声称修了产品源码，也不把它充当可信产品RED。旧before PNG保留但不当本轮12PNG之一或正式candidate成功。

下面按各型before/after/reopened保留所直接查看的原图；实际文件摘要已在输入manifest及事件PNG stage中复核。选中边框和像素差异不要求字节相等，局部PNG不是整个页面/缩放/交互回归。

**area-stack：before / after / reopened**

![area-stack before](/Users/xiaomei/Documents/projects/dataease/Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/MVP-20261027/evidence/AreaStackMissingColumns-before-r002.png)

![area-stack after](/Users/xiaomei/Documents/projects/dataease/Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/MVP-20261027/evidence/AreaStackMissingColumns-after-r002.png)

![area-stack reopened](/Users/xiaomei/Documents/projects/dataease/Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/MVP-20261027/evidence/AreaStackMissingColumns-reopened-r002.png)

**bar-stack：before / after / reopened**

![bar-stack before](/Users/xiaomei/Documents/projects/dataease/Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/MVP-20261027/evidence/BarStackMissingColumns-before-r001.png)

![bar-stack after](/Users/xiaomei/Documents/projects/dataease/Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/MVP-20261027/evidence/BarStackMissingColumns-after-r001.png)

![bar-stack reopened](/Users/xiaomei/Documents/projects/dataease/Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/MVP-20261027/evidence/BarStackMissingColumns-reopened-r001.png)

**bar-horizontal：before / after / reopened**

![bar-horizontal before](/Users/xiaomei/Documents/projects/dataease/Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/MVP-20261027/evidence/BarHorizontalMissingColumns-before-r001.png)

![bar-horizontal after](/Users/xiaomei/Documents/projects/dataease/Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/MVP-20261027/evidence/BarHorizontalMissingColumns-after-r001.png)

![bar-horizontal reopened](/Users/xiaomei/Documents/projects/dataease/Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/MVP-20261027/evidence/BarHorizontalMissingColumns-reopened-r001.png)

**bar-stack-horizontal：before / after / reopened**

![bar-stack-horizontal before](/Users/xiaomei/Documents/projects/dataease/Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/MVP-20261027/evidence/BarStackHorizontalMissingColumns-before-r001.png)

![bar-stack-horizontal after](/Users/xiaomei/Documents/projects/dataease/Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/MVP-20261027/evidence/BarStackHorizontalMissingColumns-after-r001.png)

![bar-stack-horizontal reopened](/Users/xiaomei/Documents/projects/dataease/Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/MVP-20261027/evidence/BarStackHorizontalMissingColumns-reopened-r001.png)

## 已查无问题、未查原因、同类残余与准入预测

**已查无问题：** 38卡输入、批次32原件引用；4 Context内32路径/摘要及4 admission各5顶层ref、实际action/target/输出范围；freeze/start/end/current driver一致；正常类型/轴/source身份；16条本型query完整CSV分组、36wire/52目录状态；64descriptor、4次候选物理1/逻辑1、4次本型source输出、4次save/find整树、panel0、空clip、重开结果；12PNG直接视觉；area-stack r001失败前查询、无candidate/save及真实last-saved恢复按原迹保留。

**未检查与原因：** 本lane只读四型补列原件，不审当前变动中的64源码或三角色端口、不跑新UI/DB/HTTP/构建/测试；未完成多系列/百分比堆叠/全部style、全console/resource/pageerror/实例销毁、全部数据库/入口/权限/异常/TTL/撤销分页等验证。pageErrors=[]及runtimeErrorsCount起止0只到各监听/数组，不等全局无异常。完整diff/最终KB/Dashboard/closeout/Stop Gate非本卡输出；项目无Session registry工具，不声称程序化注册表校验。

**同类残余：** 旧CGS多系列变体、area r007历史准入问题、C2V-005/ubo、真实权限以及其它原AC继续在各自原范围和预算内。仅四型基本配置证据列补齐，原49类型与P1 12+P2 26=38义务不减少，完整类型计数不由本报告推进。line未读未判，不借它刚发生的运行扩大本轮分母。

**准入预测：** 四型本次source/clip/target/query/save/find/panel/reopen基本列可直接进入后续映射并复用，无新增阻断需要修复、无需为文字残留或已核数学机械再跑。百分比标签保留为显示语义限制，后续确需该列时只补正确格式的可见见证；旧area准入仍单列。当前报告不允许“全部配置/完整type/49完成/38完成/真实权限通过/P1或S02完成”的声明，也不生成Goal终态。
