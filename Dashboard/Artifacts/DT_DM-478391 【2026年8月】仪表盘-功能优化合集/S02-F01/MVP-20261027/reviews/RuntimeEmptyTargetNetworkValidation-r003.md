# 空目标 API 观察窗口独立审查 r003

- reviewed_at：2026-10-30T15:23:31.759149+00:00
- snapshot_id：`S02-RUNTIME-EMPTY-TARGET-NETWORK-VALIDATION-r003`。
- as_of_state：Topology-r552、预冻结 driver、invocation 与下列绑定输入；同一空源／空目标交付物最终第 3/3 轮。
- verdict：`PASS_WITH_LIMITATIONS`（本次新 indicator 页面窗口有界通过）。F3 在“本 page 已观察的非认证 `/api/` 请求窗口，未见 save/saveCanvas/updateCanvas”这一层关闭；不追认 r001/r002 旧未观察窗口，也不证明任意来源数据库无写。
- lane card canonical SHA-256：`4b2ae9c5d4d74e542556e7b8d41707ec5f381632836f07e8c144b414014fd0a9`。

本轮检查 source 地图复制500树、indicator目标正常UI清空／粘贴、成功后延迟观察、正常退出及重开的新运行。独立审查只读取文件，在 `/tmp` 复算，仅新增本报告；没有执行 driver、UI、数据库、服务或源码修改。旧 r001/r002、负向证据旧3/3、地图3/3及C2预算均不改。

## 输入、冻结与复验方法

以下 14 项摘要均逐一等于 card；输出在审查开始时不存在。card validate/render 及原 builder action／canonical target 的 execution_admission 只读复验均退出0；准入五类引用摘要一致。

| 输入 | SHA-256 |
| --- | --- |
| `Goal.final.json` | `4db931a6764a8c48345e7e8358e579550a9bc98594bf1654647716d72b9678c4` |
| `RuntimeEmptySourceTargetValidation-r001.md` | `949f46b7ef144e50c59a9818b91d3678f0b7211b8fc7c035eeed1fe3aaa4cd4b` |
| `RuntimeEmptySourceTargetValidation-r002.md` | `6a8440d0911488a06ed7720f76350679cd7b5c2a1c5cfbd0bd4b2eae2a32d617` |
| `RuntimeEmptyTargetNetwork-r003.json` | `21b11add8f7e72644a47bcbb10490f02d1031fe5c3d40f7872bba009f0f9d696` |
| `RuntimeEmptyTargetNetwork-events-r003.json` | `70c4a8b95d51f2e88aac1d8c7eb151645df65649bb5ade2244066af92c7bbe9d` |
| `RuntimeEmptyTargetNetwork-invocation-r003.jsonl` | `6e74128fa05f6b984213e43b2e7d7476c417bd0925e549fe72f7ab4906267024` |
| `RuntimeEmptyTargetNetworkToolFreeze-r003.json` | `5aca6fb47ad421deb3fb28de9c8ae842c4ae366a29bf036070308b22c9d177d0` |
| `RuntimeEmptyTargetNetworkPlan-r003.json` | `259e12793ea2b9bd97e2613dc1b46dd7abaad703b84f2d47484b22a99f04ce41` |
| `observe-empty-target-network-r003.js` | `fc3b59c875965a8a1c4beddcd1d54ed8d1f80e65ef4a9004f1f4df351e68896f` |
| `runtime-empty-target-network-execution-admission-r003.json` | `829fef1086f311f02dcaee9a73274e9741e65e17302309f646cd546e10141344` |
| `Topology-actual-r552.json` | `07eb0a0d335a29a51f988c15229a10420469f094989211ca752e854dee293dff` |
| `UiIntegrationCases-r002.json` | `e365ef111582ef84f20f26e6136854409b7fc66bb0931cae40a9df5318036d55` |
| `TeaMaterialExtended-r001.csv` | `abc8bed0862129d58724bcefff2563862e48d1ea057365ae8d5d2c853e64472b` |
| `dataVisualization.ts` | `dc0a75b7a4abf308a41473de710c7d137b294c8b4915fe94f859744541cd4082` |

冻结记录时间 15:07:10.244418Z，早于 invocation started 15:07:36.186Z。freeze、driver当前字节、events.driverSha256、invocation开始／结束的 driver SHA 均为 `fc3b59c875965a8a1c4beddcd1d54ed8d1f80e65ef4a9004f1f4df351e68896f`。finished 15:07:48.347Z 的 outputSha256 与原始 events SHA `70c4a8b95d51f2e88aac1d8c7eb151645df65649bb5ade2244066af92c7bbe9d` 一致。invocation恰两行，开始／结束时间与events相同，executionFailure为null，events无executionFailure/restorationFailure，errors为空，recordingStopped=true。没有用mtime估计冻结或运行耗时；本轮是新运行前冻结，和r002的旧运行后原生提取明确区分。

独立 checker `/tmp/review_empty_target_network_r003.py` SHA-256 `d208235769ceab46b55134e40dbc31ee8789956374f8cc55799e3e1080f49aaf`，结果 `/tmp/review_empty_target_network_r003.result.json` SHA-256 `86709a22b315e918d7209d1b07f32faad599acc6980e4a0129f384ee052c27fa`；执行 `python3 /tmp/review_empty_target_network_r003.py` 退出0。没有调用 producer summary checker，关键结果写于本报告。

## 全部发现与 F3 最终结论

本轮没有新的阻断性发现。driver在source选择与copy之前订阅同一page的request/response/pageerror；在退出重开并读取最终诊断后才撤销。onRequest记录以 `/api/` 起始且不匹配 login/logout/auth 路径的请求method/path，而非只订阅getData。认证头、cookie、登录响应不在该记录中。getData另留完整body；getData/findById另留响应，以核对查询和恢复。没有在driver中合成业务response或主动执行保存。

14项绑定输入中的 `dataVisualization.ts` 实际定义了 `/dataVisualization/save`、`/saveCanvas`、`/updateCanvas` 三条POST路径。独立检查全部31个已记录method/path，三者均为0；不是只对测试子数组计数，也不是从最终500树相同反推没有保存。31条合计21 POST、10 GET，逐路径清单如下。

| Method | 原始 path | 次数 |
| --- | --- | --- |
| POST | `/api/chart/listByDQ/1312472054565572608/7520741153101058048` | 2 |
| POST | `/api/chart/listByDQ/1312472054565572608/7520752064427724800` | 4 |
| POST | `/api/datasetField/multFieldValuesForPermissions` | 1 |
| POST | `/api/chartData/getData` | 5 |
| POST | `/api/typeface/listFont` | 2 |
| GET | `/api/static-resource/7521416492009656320.svg` | 2 |
| GET | `/api/sysParameter/defaultSettings` | 2 |
| POST | `/api/dataVisualization/tree` | 1 |
| GET | `/api/sysParameter/shareBase` | 1 |
| GET | `/api/license/version` | 1 |
| POST | `/api/license/validate` | 1 |
| GET | `/api/aiBase/findTargetUrl` | 1 |
| POST | `/api/msg-center/count` | 1 |
| POST | `/api/visualizationSubject/querySubjectWithGroup` | 1 |
| POST | `/api/datasetTree/tree` | 2 |
| POST | `/api/dataVisualization/findById` | 1 |
| GET | `/api/linkage/getVisualizationAllLinkageInfo/1312476889213964288/snapshot` | 1 |
| GET | `/api/linkJump/queryVisualizationJumpInfo/1312476889213964288/snapshot` | 1 |
| GET | `/api/visualizationBackground/findAll` | 1 |

因此本次可以比r002更强地表述：“15:07:36.186Z至15:07:48.347Z对应的本page已观察非认证 `/api/` 请求中，三条指定保存接口未出现；覆盖source选择/copy、目标清空、paste、成功后延迟观察、退出及重开。”监听实际在started之后、source操作之前安装，在finished之前、恢复诊断之后撤销；起止外壳时间不代表安装／撤销的精确微秒。

本结论仍是**客户端指定保存API未观察到**：不审计其他page/context、Service Worker独立请求、其他前缀／通道、认证端点副作用、后台任务或直接数据库写入；其他API的服务器内部副作用也未由method/path证明不存在。F3旧窗口仍保持未独立证实。此边界与原AC完整义务并存，没有删除或重新定义原分母。

## 已检查无问题的维度

1. **真实UI协议与空源状态。** 预冻结driver通过正常图表选择、allow测试桩、复制按钮、过滤dialog中的OR hover／group删除／leaf删除／确认，取得 `{"logic":"and","items":[]}`；target_empty mark为15:07:38.087Z，copyReason=empty_source、copyDisabled=true、pasteReason=null。driver只有一次实际paste点击，无覆盖确认点击、强制禁用按钮点击或Store/clipboard直接赋值。这里仍是本地allow测试桩，不是真实权限。
2. **完整树与剪贴板。** 9份source／clipboard三字段descriptor均逐节点重建ownKeys相同、undefinedPaths为空；过滤树比较保留null、空串、缺失和数组顺序，不删字段。source_copied、target_empty、paste_settled、after_snapshot_window四份整个clip完全相等，包含tableId=`1312472054565572608`、createdAt=`3816580.9000000358`、revision=3。成功及6507ms之后source descriptor均严格等于原clip对应descriptor；此窗口不消费、不续期。
3. **唯一候选实际请求。** testRequestStart=5、testRequestEnd=6，为零基半开区间 `[5,6)`，唯一entry是15:07:38.142Z的POST getData，目标=`7520752064427724800`、type=indicator、render=custom、dataset=`1312472054565572608`。raw request.customFilter及qobs.request.customFilter严格等于完整clip树。15:07:38.192Z响应的request文本与该body相同，HTTP200/code0；逻辑计数1只作交叉核验。整个31请求中另有4次getData，均发生于15:07:45.111Z退出mark之后的重开加载，未误归类为paste二次查询。
4. **响应与独立数值oracle。** qobs.responseData完整等于HTTP `body.data.data`（JSON数字按数值比较，5093.0与5093等值）；响应DTO.customFilter和request并不严格相同，后端field补全／枚举null→空串等回显差异没有被归一化后冒充相等。采用后的source诊断仍保持原clip。独立CSV为30行、19字段、30唯一id，按整棵and/or树、响应字段ID映射和Decimal递归筛选，命中 `3,5,11,13,16,18,21,25` 八行，amount合计5093；HTTP indicator单行amount与series amount.data[0]均为5093。
5. **DOM窗口与延迟观察。** 初始sample后安装observer，selector为`[role="dialog"]`，可见条件width>0且visibility!=hidden，监听body childList/subtree/attributes；安装15:07:38.103Z、停止15:07:44.717Z，单调时间差精确6613.5ms，起止seen均为空。唯一候选请求／响应位于该窗内；paste_settled为15:07:38.201Z，after_snapshot_window为15:07:44.708Z，间隔6507ms，整个诊断对象严格相等，期间没有第二次getData。
6. **实际退出与重开。** 15:07:45.111Z panel URL、editorCount=0；15:07:45.262Z发出findById、15:07:45.288Z HTTP200/code0，其请求为dashboard/main-edit/snapshot，读回indicator完整500树等于原clip；15:07:48.341Z restored也为同树、clipboard=null、pasteReason=clipboard_empty、qobs=null、dialogs=0，editSessionId/identityEpoch从5变7。读回相等仅核恢复内容；无保存接口结论来自独立method/path观察，不偷换两类证据。

## 未检查原因、同类残余与最终准入

补查当前snapshot静态入口仅用于解释时间窗：`core/core-frontend/src/components/data-visualization/canvas/CanvasCore.vue`约1525行的实际setInterval为1000ms，当前SHA `90e7a4f6ec06c8a837043a8bbb8f7b297f9238c99a848d68278595ce3abc79cd`；`snapshot.ts`中旧注释写5秒，当前SHA `5ffd11d4740efbd8570e31c42cffb8870a879eaf309bb4f31b00e40cc57c2e30`。6507ms长于该静态名义周期，但events没有实际callback/flush计数，前端加载代码身份也未在本包逐字节绑定；因此不把“时间已过、无第二查询”写成“实际snapshot flush已验证”，不关闭snapshot一次、undo/redo等原案义务。

DOM采样仍可能漏掉同一回调前插入又移除的瞬态元素或非role=dialog实现；不证明所有确认竞态。没有记录prepared实例身份、adoption/销毁次数、完整Store old-state、样式/轴/全部派生metadata、普通刷新/undo redo或另一种persisted logic:null/items:null空shape。没有把diag成功替代地图视觉、details、所有图表native入口或真正权限。原38义务／49类型、独立TTL上下文和8100/8110各自明细证据边界均保留。

同类残余为观察范围与声明范围的对应关系：path0计数只能关闭同一监听范围的对应API；成功前后树相同不能独立证明中间无写；时间跨周期不能替代实际回调证据。本轮已查全部31请求、6响应、6个mark、9个descriptor、freeze/invocation和恢复，没有发现另一项需在本包修复的矛盾。

最终准入：本次新indicator空目标窗口可作为AC-MVP-F01-03/06/08/12相关局部证据，和r002已关闭的F1/F2来历检查并列引用。F3仅在本新page的三条保存API观察层关闭，旧历史不追认；完整MVP、真实权限和Goal不得由此升级通过。本交付物累计3/3预算已耗尽，**不开第4轮、不换名重置、不要求继续UI重跑**；仅将以上未观察义务交父Agent继续按原Goal安排独立工作，本lane不执行全局Stop Gate或收束Goal。
