# U3保存传输失败loading清理：独立最小设计审查 r001

**Design Freeze Validity：PASS_WITH_BOUNDS（本次有界设计可冻结）。Implementation Entry Readiness：READY_FOR_RED_THEN_MINIMAL_PATCH（可按下列前提进入可信RED，再作最小修复）。新增阻断0，无需扩大为全HTTP重构。** 这两个结论只评价设计与进入实施的准备，不表示RED/GREEN、实际修复、U3完整恢复、AC09或P1已经通过。

本单元来自S039原U3保存失败共享要求中新观察到的Axios loading滞留，当前累计第**1/3轮（设计审查）**。它与C2实例cleanup没有同一根因/写域，不借新包重开C2、C1或Slice A耗尽预算。后续实施验证与运行复核沿本新单元累计预算安排，不能重新各起一套3轮。

- reviewed_at：`2026-10-30T21:23:57.508003+00:00`；reviewer/source：`/root/bubble_ready_validator_resumed`，未编写本Design/Cases/driver、未采集本次UI、未修改Axios源码。
- snapshot_id：`S02-SAVE-TRANSPORT-LOADING-DESIGN-REVIEW-r001`；as_of_state：Topology-r582、Design/Cases-r001、service.ts.before与当前同SHA源码、原失败和独立正常reload恢复原件。
- card canonical SHA：`a8489424533241b97ce55d034c5a367f7fb3c35bc7dadf5034d2367432cb89c5`；接收端validate/render实际均exit0，完整消费execution_command。15处卡引用、14个唯一输入SHA全部一致，写前再核无漂移。
- 唯一写入本报告，写前不存在。未操作UI/HTTP/DB、测试/RED/GREEN/构建/安装、修改源码/runner/Design/Cases/旧证据或共享状态；未提交/推送。图片只通过view_image查看原文件，没有重跑浏览器。

## 原predicate、真实发现与机制边界

原AC-MVP-F01-09要求只走正常显式保存，未保存/保存失败不能伪称持久化；保存后正常离开重开完整树及结果保持。准备r002中U3明确要验证正常save受控失败，保留当前编辑状态并读回旧保存快照。loading不释放阻碍正常重新选择，是该原动作链中的具体新发现，不是新增保存功能或削减原验收。

原events为`FAILED_OBSERVATION_PRESERVED`，不能改成完整U3 PASS。独立读取driver和全部11条wire、56条API metadata、saveRoute/failed各1条及相关完整descriptor，事实为：

| 原时点/原件 | 可独立确认的事实 |
| --- | --- |
| 21:09:38.020Z initialExit | 正常panel/index且editorCount=0 |
| wire0，21:09:38.262Z | findById HTTP200/code0，真bubble-map目标保存树200 |
| wire5，21:09:41.284Z | 真bubble-map500 query HTTP200/code0；afterPaste诊断success/logical1，真实返回3省1982/1243/1868；不是save响应 |
| 21:09:42.195Z beforeSave | messages=[]，正常保存按钮可用 |
| 21:09:42.225Z显式save→21:09:42.320Z requestfailed | route仅1个updateCanvas，资源ID正确，正常按钮触发；浏览器abort('failed')，实际net::ERR_FAILED。未送服务端，不证明后端事务故障或回滚 |
| 21:09:43.122Z afterFailedSave | saveSuccessVisible=false、messages=[]、保存按钮仍可用；与afterPaste的完整source descriptor、clipboard、session分别严格相同，仍500。无成功提示限driver等待800ms后的采样，不称全时间窗DOM监控 |
| 21:09:43.269Z exitAfterFailure | panel/index、editorCount=0；不因为这一步成功就认为loading已清 |
| 21:09:43.962–44.881Z | 正常“存在未保存的修改，立即恢复？”对话框选择否并隐藏，原件保留 |
| wire6，21:09:44.116Z及wire7 | 新find HTTP200/code0，完整保存customFilter仍等wire0的bubble200；随后有本型200新query。成功读旧快照不等于已能正常选择target |
| 21:09:52.896Z落盘 | target正常点击8秒超时，原Call log反复明确ed-loading-mask intercepts pointer events；没有savedAfter/finalDiagnostic字段，不能补造这些末态 |

`SaveFailure-after-abort-r001.png` SHA=`e2e96743ada35512ab93685e27c5622f1d77ddb170a8258184c7e1136245012c`与events一致，实际已查看1280×900原图：编辑器被全页白色遮罩覆盖，中部spinner可见，气泡地图和右侧控件在遮罩后。不能从此图反算金额、内部loadingMap计数或整个编辑器Store。

原正常reload恢复是另一个时点：21:12:46.329Z记录全页loading mask及其parent=`dv-common-layout dv-teleport-query ed-loading-parent--relative`；21:12:49.663Z读回maskCount0、气泡地图、完整保存树200、clip=null、三角色unknown。恢复树与原保存树严格相同。该原件没有连续原reload动作/所有HTTP和driver attestation，故只接受其前后读回与作者标明的正常重载恢复，不将其当修复成功或重新验证U3完整链。

## 从正常保存到遮罩的真实源码链

1. DbToolbar.vue正常`saveCanvasWithCheck→saveResource→canvasSaveWithParams`；正常成功消息在保存成功回调中，未改为失败也报成功。
2. canvasUtils.ts约981–1005选择既有updateCanvas/saveCanvas，`method(canvasInfo).then(...)`后才更新保存状态、resetStyleChangeTimes并调用成功回调。其Promise/错误处理的全部旧行为不由本局部设计重新认证。
3. dataVisualization.ts:79–96 updateCanvas沿现有request.post，明确`loading:true`；axios/index.ts保留loading并交给同service，没有另建Axios实例。
4. service.ts请求拦截器约166在正常发送前`config.loading && tryShowLoading(permissionStore.getCurrentPath)`。tryShowLoading以当前path调用requestStore.addLoading。
5. 原response rejection callback约233先保留handleErrorLocally早退，随后原timeout判断；`!error?.response`直接`Promise.reject(error)`，因此到不了后面约274的`error.config.loading && tryHideLoading(...)`。
6. loading.ts真实tryHideLoading对空identification直接return，且只有loadingMap[key]>0才reduceLoading一次；requestStore.reduceLoading只减指定key。dashboard/index.vue约84的pageLoading为当前path计数或renderChartAllLoading，根layout以v-loading消费。

因此“无response时跳过已开启的同路由loading释放”有直接源码机制，真实save abort/无响应与遮罩滞留和该机制相符。原件未直接instrument浏览器error.config、response callback或loadingMap具体数值；不把此静态关联夸成全堆栈动态逐步追踪，也不排除另有render loading。后续真实U3复验应同时观察新分支修复后的遮罩与正常选择链，不能只凭unit计数宣布runtime修复。

service.ts.before与当前service.ts逐字节相同，SHA均`5651f057658c8dd25adbcc73c7625f06834074069e6a5342cd92beb07f7d1f7c`。本审阅时尚无产品改码、RED或runner执行证据。

## 最小修复边界与共享影响

设计把已有`tryHideLoading(permissionStore.getCurrentPath)`放入**既有无response分支的reject之前**，以`error.config?.loading`为条件；保留原错误对象reject。这个位置可修复同路由、该请求已完成loading登记的真实U3，而不改变fulfilled分支、已有有response分支、图片/local错误所有权或timeout reset逻辑。

允许的生产写域仅service.ts该分支数行；loading helper/Store、保存入口/API、权限、重试、缓存、所有业务response均无需改动。新runner/日志/实施报告可按精确admission登记，但Design/Cases、service.before及原events/recovery不得随GREEN修改期望。若观察到别的根因，应保留新反例并反馈Scope Delta候选/后续入口，不能静默扩大本设计。

“释放当前路由一个正引用”是本实现精确效果，不是全请求引用所有权协议。生产修改位于全局Axios回调，实际会作用于其它满足同一分支条件的请求，而非仅updateCanvas；本设计接受沿项目既有路径key语义的一致最小修复。**不能声称所有请求、所有路由切换都归还其发起时占用的那个引用。**

路由在请求期间变化时，当前key可能已不是发起key；setup在tryShowLoading前失败时也不能单靠error.config.loading推断取得过引用。它们是当前计数/所有权设计的更广边界，没有本包实际反例证明需扩为本次实现前置。既有fulfilled/有response分支也使用当前key；不在此偷偷增加origin-key字段、每请求owner或全局重构。若后续新runtime证明本修复在实际支持场景引入跨key误减，须作为具体candidate反馈并重新界定安全最小切片，不能以“已知排除”覆盖新反例。

## 8个冻结Cases逐项审查

| case | 实际输入/预期 | 设计判断与声明上限 |
| --- | --- | --- |
| STL01 | loading=true、当前1、无response→当前0/reduce1/reset0/同error reject | 本次直接根因见证，修复前应计数语义失败 |
| STL02 | loading=true、当前2、另一path7、无response→当前1/其它7/reduce1/reset0/同error | 证明不全局reset、不把同path其它未完成引用一并清空。这里只是seeded map/provider；不等于两真实并发HTTP的全生命周期 |
| STL03 | loading=false、当前2→2/reduce0/reset0 | 必要不偷减边界，沿真实helper而非复制判断 |
| STL04 | loading=null、当前2→2/reduce0/reset0 | 明确未开loading时不减，不将缺值默认为true |
| STL05 | config缺失、当前2、无response→原样拒绝/不减 | 拟用config?.loading可覆盖，缺config不得把执行TypeError算产品RED |
| STL06 | handleErrorLocally=true、loading=false、当前2→2/reduce0/reset0/同error | 必须保留现有最前面的local早退。当前真实图片请求及login status请求都未启loading；本case不证明local=true+loading=true清理，原早退行为保持 |
| STL07 | 标准shape ERR_CANCELED、loading=true、当前1、无response→0/reduce1/reset0/同error | 覆盖同一无response分支的正常取消shape。不能单凭code宣称cancelRequestBatch/cancelAllRequest所有message形态/前置时序都验；原cancelMap与非字符串message问题未在此修复 |
| STL08 | HTTP400、loading=true、当前1→0/reduce1/reset0/同error，既有错误消息1次 | 回归已有有response分支；headers必须是可执行has/get的合法对象且无鉴权flag，url为普通非插件路径，msg/message为合法值，否则依赖错误不是RED |

8个case足够约束当前最小分支及主要不变性，无需为本设计追加全HTTP状态矩阵。oracle中“零loading不减”未单列一个第9case；它由未改动真实helper的count>0静态语义约束，不将它虚记为本8条已执行的独立case。若未来要把count0/空key实际执行计入结果，应明确作为辅助helper见证，不能回写冻结8条或增造验收分母。

原timeout先resetLoadingMap再进入无response拒绝；本修复后helper看到原reset后的0不会再reduce，原提示/reset副作用保持。没有timeout输入的STL01/02/07应reset0；不能拿其reset0期望套到timeout分支，或称timeout并发行为已正确。

## AST真实callback单元层：可信RED的可执行条件

方案可用，但必须保留下面边界，不能把提取后的函数单测称为完整Axios初始化或真实传输验证。

1. 从service.ts.before/current的TypeScript AST按`service.interceptors.response.use`唯一调用定位**第二个参数callback**，校验目标唯一/节点类型/参数数及选中source span；不得错取request.use第二回调，不用字符串搜索某段后手抄逻辑。记录before/current/source span与提取文本SHA。
2. tryHideLoading从loading.ts真实声明提取，注入同一个requestStore provider；不在runner另写`if(config.loading)...`替代被测代码。requestStore可用最小计数provider（fresh map/reduce/reset spy），oracle独立读取map和spy；provider不得主动按case制造expected结果。
3. callback外部依赖显式注入；未预期的router/clearCache/wsCache/showMsg等副作用应能被发现，普通无response不得被helper遮蔽或意外调用这些分支。STL08需具备真实形状headers及既有消息provider，字符串message/URL需在runner中明确，缺方法/编译错误不能计语义失败。
4. runner实现后**先冻结runner、Cases与before及helper摘要，再跑RED**；当前只有Design/Cases/before，不能宣称runner已冻结或RED已完成。同runner/同case identities复用到GREEN，禁止为修复修改oracle来迁就实现。TS transpile/函数加载/依赖执行首先必须成功。
5. baseline可信fingerprint应为STL01/02/07各自current_count仍1/2/1、reduce0，违背0/1/0与reduce1，而原error identity拒绝仍成立；其它5案应能按原代码通过。runner崩溃、参数缺失、wrong AST node或headers缺has不是产品RED。不要仅“整体exit1”就记3个可信RED，应逐case区分semantic fail与execution error。
6. GREEN仍断言same error对象、单次reduce、其它key保持、reset0和既有400消息路径；记录所有8条。只有source最小patch后原cases的预期失败闭合，才可称本unit层修复；原U3浏览器链随后另验。

当前不要求运行整个service模块，因为它包含模块求值时同步XHR取timeout、store/router、HMAC/i18n等初始化。绕过这些仅是**callback+helper单元层的显式边界**，不是伪装所有Axios调用/鉴权/启动均已验证。若AST无法唯一定位或真实helper不可加载，先报告执行前提失败并修runner，不以“缺环境”跳过必要见证。

## 全部发现、剩余风险与Scope Delta判断

**新增blocking=0；Builder必须修复项仅原无response loading泄漏，不另增源码范围。** 无新增human authority问题，已有原U3可继续；语义卡本身不是Builder写入或runtime副作用admission。

1. **STLD-N01 / P2 / 引用归属的声明上限。** 拟实现只按当前key减一个正计数。STL02约束同path并发引用，不证明跨route或request setup前失败归属；不能使用“所有失败只释放本请求所有权”字样。当前不要求扩写request config/Store；若出现具体新反例再反馈trigger/impact/recommendation。
2. **STLD-N02 / P2 / 原错误分支残余。** HTTP413原早return、HTTP500等原resolve、timeout原全局reset、request interceptor错误handler未return Promise.reject等旧行为未由本修复解决；本lane未验证它们在真实保存上的具体后果，不借静态线索直接扩判新的产品发现。严禁把HTTP400一个回归推广所有response错误或所有失败不假成功。
3. **STLD-N03 / P2 / local分支不止图片。** `api/staticResource.ts fetchResourceImage`和`views/component/login/Handler.vue queryCategoryStatus`均用handleErrorLocally=true且未启loading；原优先早退应完整保持。Design以图片描述该分支是主要来源，但不等于唯一调用方。无需为了措辞改源码或原冻结件；实施报告按准确共享调用边界说明。
4. **STLD-N04 / P3 / 取消与零计数的采样上限。** STL07只标ERR_CANCELED且没有固定完整message；runner应写明标准可执行shape，不从该case推全cancelMap路径。零计数/空key不在冻结8条独立执行清单，不虚报计数覆盖。真实helper静态 guard与限定修复范围足以本设计准入，不机械加case。
5. **STLD-N05 / P2 / 原run与恢复不得混写。** 原U3整run失败，savedAfter/finalDiagnostic缺失；两次真实find可证明旧保存树，但loading阻断正常选中仍有效。reload恢复前后mask和树事实可复用，不能把原run改PASS/把正常重载称修复；原800ms无成功提示的观察窗明确保留。
6. **STLD-N06 / P2 / 独立层级与最后绑定。** 本次只有设计审查；生产源码未变、未RED、runner未执行。修复后需unit原case和真实U3两层，不能以stub callback GREEN或后续报告hash代替真实full chain，不关AC09/P1/Goal。原38义务、49/完整0/49、真实权限BLOCKED/NOT_RUN、C2V-005及耗尽预算保持。

范围判断：同路由save abort造成界面不可继续的最小cleanup是原U3必要修复，现有证据足以推进，不需另造Scope Delta或请人类重新批准该已授权局部工作。全局所有权key、全部HTTP错误契约或后端事务故障若拟纳入，应先作为候选Scope Delta反馈；当前不自动写成must-have、不因还能更严格而卡住该安全最小切片。

## 实施顺序、回滚与修后准入预测

1. 构造并冻结AST runner/各输入摘要；消费绑定本Design/Cases/before/本review/实际topology的精确Builder Context/admission后，执行真实before callback+helper，确认STL01/02/07为指定语义RED而不是执行错误。此时仍未修源码，保留最初失败。
2. 仅在service.ts无response分支增加loading条件的既有tryHideLoading调用，保留原Promise.reject(error)，不移动local早退或timeout/have-response处理。不改Design/Cases/before，不格式化整个文件/安装依赖。
3. 同冻结runner/cases做8条GREEN和source/runner定向lint，核当前源码与before的精确diff。若新增失败，保留并按本单元累计预算处理；不顺带修HTTP500/路由owner，也不重开C2。
4. 同原U3新运行号复验：真500 query/正常保存恰1次受控abort/无成功提示/编辑树与clip保持，loading正常释放；无需reload、删DOM或force点击即可正常退出、重开选中，真实find旧bubble200/本型200新结果/空clip。后端abort前无送达只证明客户端失败，不宣称后端回滚。原失败、正常reload恢复和新修复后成功各自保留。
5. 单元GREEN与该正常UI链均成立后，才申请本最小patch的独立实施/运行验收；本设计的有界通过不预填结果，也不另发一轮仅审本报告的review。

回滚只涉及这几行源差异及本次测试入口：先核对当前service SHA/精确patch，按本单元受审delta恢复，无需数据库迁移/资源清理/依赖回滚；不得用全文件git checkout覆盖同文件后来其它合法变更。service.ts.before仅是冻结基线，不是无条件覆盖当前源码的命令授权。

**修后准入预测：** 指定3个baseline计数反例应闭合，5个既有边界保持；真实U3正常选择不再被该loading滞留拦截，保存失败仍reject而不提示成功。该预测以实际证据为准，不等于所有Axios错误/并发/权限/生产Profile已验。若新运行仍滞留，必须保留结果并检查另一个pageLoading来源或key，不以unit GREEN强行关闭U3。

## 已查无问题与未检原因

已查未见设计阻断：15处/14唯一绑定输入；before/current完全相同；原driver单route/单abort/原响应窗口、完整编辑descriptor/clip/session保留、两find旧保存树、原mask拦截及正常reload后读回；正常toolbar→保存API→同Axios loading登记/早退→helper/Store→layout消费链；8条case预期/并发单减/非loading/缺config/local/标准取消/原400；AST提取真实目标与可信RED判定；最小写域、错误身份、无reset/重试、预算和原权限/Goal边界。

未检：未运行RED/GREEN/TS转译/lint/构建/产品UI/HTTP/DB，没有新的driver或source patch可验；未instrument原浏览器callback/config/count；未重算整包30行CSV/全部地图视觉与资源，原query只在本设计作为真实未mock前提，不重给地图验收；未验真实并发HTTP/路由变化/所有取消来源、timeout/413/500/所有错误、后端事务、完整权限/所有入口/Profile、最终Dashboard/KB/closeout/Stop Gate。原因分别为只读设计范围、缺该层原件和明确排除范围，不是默认通过。

同类残余保持：计数变化不等请求所有权；callback提取不等完整Axios初始化；route abort不等后端失败；截图不等loadingMap；800ms无toast不等所有时间无toast；reload恢复不等产品修复；新Axios单元与C2地图销毁阻塞分开。项目无Session registry工具，不声称程序化注册表校验。

## 输入摘要与写前保全

| 卡输入（相对工作区路径） | SHA-256 |
| --- | --- |
| `Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/Goal.final.json` | `4db931a6764a8c48345e7e8358e579550a9bc98594bf1654647716d72b9678c4` |
| `Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/MVP-20261027/save-transport-loading-cleanup-r001/Design-r001.md` | `e9047dc2bee80dd14f8d5a18cc1a28fa96600368df366933895763fc4861dc8b` |
| `Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/MVP-20261027/save-transport-loading-cleanup-r001/Cases-r001.json` | `d3112965209eb76c692fdfb8ec419797f00dc285db1bb0a62128969ed2ebc0a7` |
| `Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/MVP-20261027/save-transport-loading-cleanup-r001/service.ts.before` | `5651f057658c8dd25adbcc73c7625f06834074069e6a5342cd92beb07f7d1f7c` |
| `Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/MVP-20261027/evidence/SaveFailure-events-r001.json` | `9c6fa0a5591c6d67a20f657cb7e22aff33607e9da5a9b0f8270cb156c29a36a1` |
| `Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/MVP-20261027/evidence/SaveFailure-recovery-r001.json` | `142dcf427dd24f692be8c8ae849529a82997dd6369084513b7cb39ad0651c711` |
| `Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/MVP-20261027/runtime-state-tools/observe-save-failure-r001.js` | `8acfa223b8c0238febd42f4b9544959545f7be6c028ba4d36e1141b7a192d030` |
| `Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/MVP-20261027/reviews/MvpAcceptanceReadinessReview-r002.md` | `d3f97246db43f9dc705829d94ede73891694b13f21f7f3a9f4a03d748574fbe7` |
| `Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/planning/Topology-actual-r582.json` | `a020197c6813bc6f794a9c259a5721c83d196374caf746fbffbbe605d3e77c8e` |
| `core/core-frontend/src/config/axios/service.ts` | `5651f057658c8dd25adbcc73c7625f06834074069e6a5342cd92beb07f7d1f7c` |
| `core/core-frontend/src/utils/loading.ts` | `9997c7f2579794219995b04116205eed3ac52c8d47c57e2d71551298b504ffe8` |
| `core/core-frontend/src/store/modules/request.ts` | `bbbfda668be24fb736758658fa865695441de1887b1707415ffeb75207c5f3f8` |
| `core/core-frontend/src/components/dashboard/DbToolbar.vue` | `bbe3a90657b648b1c8b66ea12ac2a9f14a565396f2982572b538fe5048277b1d` |
| `core/core-frontend/src/api/visualization/dataVisualization.ts` | `dc0a75b7a4abf308a41473de710c7d137b294c8b4915fe94f859744541cd4082` |

| 按调用链追加只读输入 | SHA-256 |
| --- | --- |
| `core/core-frontend/src/config/axios/index.ts` | `ca376ed57a3e04de177eb37883d8bf61bba6d7a9925f4a85a30b9ba99c4d3038` |
| `core/core-frontend/src/utils/canvasUtils.ts` | `f9c68f5c96a716ed451206ef6efcbda27158cc828b578920ed5a15167bbc8282` |
| `core/core-frontend/src/views/dashboard/index.vue` | `75c0550afc403cf06ab0ce62cf459dc22d1676842293f73e575bc351b333dddd` |
| `core/core-frontend/src/api/staticResource.ts` | `dbc897f851ce19a40e91e8f2ae4c5bd982a28ea4b8a84edad33e33ae125b8787` |
| `core/core-frontend/src/views/component/login/Handler.vue` | `d2320fe55b28a20510209bb80466dbaec55af9a9e0afdefd59e45b9991f16bad` |
| `core/core-frontend/src/store/modules/permission.ts` | `ef0ba7f93df7ea2d680885275cbdad11e3fd249fe1799f984a33faaf89c060c5` |
| `core/core-frontend/src/permission.ts` | `4eb7df67800cfbe0e577d6d4fec67be5f24ce178c8119d35552842f3d791f46b` |
| `Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/MVP-20261027/evidence/SaveFailure-after-abort-r001.png` | `e2e96743ada35512ab93685e27c5622f1d77ddb170a8258184c7e1136245012c` |

写前上述卡输入及追加源码/图片均保留原字节；只新增本中文报告，不改变原失败/恢复/设计/用例/源码或执行状态。
