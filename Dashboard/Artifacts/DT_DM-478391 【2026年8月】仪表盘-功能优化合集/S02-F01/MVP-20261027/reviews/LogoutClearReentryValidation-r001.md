# U4正常退出清空与重入独立验证 r001

- reviewer/source：`/root/local_basemap_reviewer`；reviewed_at：`2026-10-30T22:49:30.566393+00:00`。
- snapshot_id：`S02-LOGOUT-CLEAR-REENTRY-VALIDATION-r001`。
- as_of_state：Goal.final当前SHA `4db931a6764a8c48345e7e8358e579550a9bc98594bf1654647716d72b9678c4`、UiIntegrationCases-r002 SHA `e365ef111582ef84f20f26e6136854409b7fc66bb0931cae40a9df5318036d55`，绑定LogoutClear原控制失败r001/r002、各恢复/读回、成功r003与独立reentry-r001；运行Topology-r592/r593/r594及当前绑定源码，具体摘要见Read Manifest。
- 卡canonical SHA：`5606ec1b18d706572f8f26efcb43beb8516523966bd5675236cd571e528ea381`；接收端validate/render均exit0，完整消费rendered execution_command和ValidationHandoff。
- **结论：PASS_WITH_BOUNDS（本U4正常前端logout清空及重入空clipboard链有界通过）。** 新增产品阻断0；发现1项验收编号映射错误，必须按下文治理吸收，不把本链计为Goal AC09保存要求已验。
- 本交付物独立审查累计第 **1/3** 轮。运行文件r001/r002/r003是保留控制失败及恢复后的运行编号，不重置独立审查预算。C2 3/3 BLOCKED、C1等既有耗尽预算不重开。
- 唯一写入本报告；本lane未重跑UI、未调用logout/清空/认证、未改源码/driver/原件/共享状态，未安装、构建、测试或操作DB。

## 原始要求与验收映射发现

原Goal `AC-MVP-F01-10` 要求30分钟单调elapsed TTL、reload/退出编辑/logout或身份变化清空、data refresh不清空不延寿、不跨context持久化；本U4只补正常logout与重入空剪贴板的局部链。

**映射发现：validation card acceptance_criteria_ids误写 `AC-MVP-F01-09`，四个运行Context均为 `AC-MVP-F01-10`，且Goal明确把logout/reload清空放在AC10；Goal AC09是显式保存与失败不伪称持久化。** 交接中的“UI09身份边界”对应UiIntegrationCases `MVP-UI-09` 的身份轴，不能把UI09编号直接解释为Goal AC09。主Agent已确认治理吸收修正为“Goal AC10 / UI09身份轴”，保留原卡及本轮SHA绑定；本lane不修改旧件、不因此重跑UI。本报告提供运行事实，不能用错误AC指针声称保存AC09完成。

本次也不是UI09的全部deferred query/旧operation禁止publish子案复测；不能把正常logout时空剪贴板推成整个busy、stale、receiver或身份撤权矩阵通过。原P1 12 + P2 26 = **38**义务、49类型分母、完整 **0/49** 保持，真实权限BLOCKED/NOT_RUN、插件installed unknown、C2V-005/旧ubo等残余不升级；局部链不等S039/P1/Goal完成。

## 入场、摘要与冻结

30个卡绑定refs全部当前匹配。四个Context required refs分别15/17/19/20项，逐项摘要匹配且九域完整；四次Context schema校验均exit0。四个admission各5项refs匹配，execution_admission复验均exit0。原件与补读源码摘要在末尾按路径去重，绑定层完整列出；项目无Session registry工具，不声称程序化注册表校验。

| 运行 | freeze / admission UTC | 实际运行 UTC | driver SHA |
| --- | --- | --- | --- |
| clear r001 | 22:26:45.021818 | 22:27:05.747→05.900 | 5d072a040ecfc854b9a534784953432097f3f7719f1202ab55271d87eee6f2dc |
| clear r002 | 22:32:24.092474 | 22:32:39.590→22:33:09.975 | f0bdd911fbfdfb4d479784de68ef9699ff72ff63f486282629c089559a1cff96 |
| clear r003 | 22:37:59.053703 | 22:38:11.195→11.644 | 3a9e92a626bd33c3f2bb7101ebb692770c777584fe4c6c18c5ea16787cccd4fb |
| reentry r001 | 22:42:15.070241 | 22:44:16.280→18.011 | 5dfe2b2fa1446639156e028ce08d70ec835b2032aca06ab2cc3c2c90eada237b |

日期均为2026-10-30；四driver freeze/start/end/current严格同SHA，freeze/admission均先于各运行。未以mtime估计耗时。

## 原控制失败与恢复：不追认早先成功

| 原件 | 独立核实事实 | 结论上限 |
| --- | --- | --- |
| LogoutClear-events-r001 | 正常copy和同模块非空绑定已完成，建辅助页时报 `Please use browser.newContext()`；status FAILED_OBSERVATION_PRESERVED，无normalLogoutClickAt/afterLogout | convenience Browser.newPage所属context不允许再建页，**未触发退出**；不是产品logout清空失败 |
| control-recovery-r001 | before.clipboard严格等r001 copied；22:29:18.027Z正常退出编辑，editorCount0；后读clip空、源树不变、session13→15、三unknown | 清理原试验clipboard的退出编辑/重入恢复，不是logout成功证明；该恢复原件无全流程driver attestation，限其记录的读回 |
| LogoutClear-events-r002 | 显式mainPage/context绑定为true，同context辅助页创建成功；goto panel等待networkidle 30000ms超时；status FAILED_OBSERVATION_PRESERVED，无normalLogoutClickAt/afterLogout | 仍未触发logout；不将networkidle超时当DOM/账户入口不可用 |
| control-readback-r002 | 22:36:58.880Z，auxRouteIsPanel、auxTopInfoVisible、sameContext、mainClipPresent均true；normalLogoutDispatched=false | DOM已就绪但退出未执行；主clip仍非空。只是读回，不伪装已完成原运行 |

r003复用已显式同context且panel/账户入口可见的辅助页，以实际topInfo/footer可见为前提，必要导航用domcontentloaded，不再拿networkidle当业务ready。原两失败、失败原因及恢复/读回原件未覆盖，后成功独立记账。

## r003同实例非空绑定与正常logout清空

目标编辑页resource `1312476889213964288`，选中target `7520752064427724800`，dataset `1312472054565572608`，源过滤为amount>200及OR六店的完整基本树。beforeCopy仍有r002的有效clip revision1；本次正常点击copy生成新clip revision2、createdAt `474591.6999999881`（页面performance时间域）。不能混用r001 convenience页或另一页面的epoch/createdAt。

观测器从实际资源记录和composable导入路径寻找已有模块候选，只允许同origin正确path、查询键t/import。动态import后必须与真实编辑诊断**非空**clipboard的完整tree/ownKeys/undefinedPaths、createdAt、revision及session严格一致，才绑定只读public getter。新模块默认空不能通过该门槛。本lane复算snapshot.clipboard还与copied.clipboard的tableId等投影全量严格相等，不仅核对value200或epoch数。

r003 modulePath为 `/src/custom-component/filter-copy/mvp-chart-filter-copy.ts`、moduleCacheQueryKeys=[]、matchedExistingNonemptyClip=true；explicitContextBinding mainPageMatches/contextMatches、auxiliaryContextMatches均true。clipboard没有传到辅助页，辅助页只走正常账户菜单“退出系统”。

| 阶段 | 独立核实读数 |
| --- | --- |
| moduleBinding.snapshot | clipboard完整等本次copied，session={identityEpoch:1,editSessionId:1,revision:2} |
| immediatelyBeforeLogout | clipboard与copied全量相同，session相同；elapsedSinceBoundCopyMs=56.80000001192093 |
| normalLogoutClickAt | 22:38:11.344Z正常点击退出；不是直接调用logout API或clear helper |
| normalLogoutObserved | 22:38:11.480Z辅助页routeIsLogin=true；退出HTTP仅记录status200 |
| afterLogout | 旧主编辑页已绑定getter读clipboard=null；session={identityEpoch:2,editSessionId:2,revision:2}；elapsedSinceBoundCopyMs=351.30000001192093 |
| afterDiagnostic | 主编辑诊断仍存在1份；clip空，session同afterLogout；三个DEV role仍allow，但copyReason/pasteReason均identity_unknown，copy/paste按钮disabled=true |

**351.3ms是自本次copy的单调elapsed，不是精确logout延迟。** 56.8ms的退出前快照仍非空、退出后351.3ms为空，均远小于TTL1800000ms；epoch与editSessionId各+1、revision不变。结合真实getter只读及源码失效动作，排除TTL自然到期与新模块默认空的混淆；没有调用invalidate/clear制造观察结果。

主页面没有reload或reentry，主编辑诊断仍存在，已在同旧运行域读到上述清空事实；后续reentry始于22:44:16.280Z，晚于此运行完成22:38:11.644Z。不得用后来的reload空状态倒证这一步。

## 源码链与观测器边界

实际退出链为AccountOperator正常菜单点击 → await logoutApi（GET /logout） → logoutHandler → userStore.clear/$reset及其它状态清理、router登录页。userStore.clear先调用invalidateMvpFilterSession，再删除user缓存；clearCache同样显式失效会话，但不将它误画为本次AccountOperator必经函数。

辅助页与主编辑页内存模块分开；useCache默认localStorage且user key按页面前缀处理。主composable正常readIdentity比较共享缓存与user Store身份，只返回内部比较用tuple；资源编辑会话watch及250ms正常timer调用syncIdentity，身份不匹配时syncMvpFilterSession走invalidate。invalidate真实实现清clip、pasteObservation/observationToken/identity/resource，并增加identityEpoch/editSessionId；revision保持。getMvpFilterClipboard只读并返回冻结clone，默认以performance.now校验TTL，不调用失效清理；getMvpFilterSessionToken仅返回数值token。该静态链解释本次跨页logout后的自动清空，不是本轮逐函数调用trace或所有浏览器/入口的运行保证。

standalone替补SubstituleLoginServer.logout仅LogUtil.info；HTTP200和跳到login不能证明服务端Token撤销、真实权限拒绝或跨身份隔离。没有读取/发布XPack专有实现，未把替补admin当真实权限。

四个observer源码已读：无直接invalidate/clear、无改Store或localStorage/sessionStorage，无cookies/storageState/header/auth响应body获取或全局网络录制；退出响应仅status。source模块fetch只读composable导入文本，public getter只投影数值epoch、测试过滤descriptor及剪贴板metadata。全局临时观察函数的注册/删除是取证辅助槽，不改产品clip；finally尝试删除该槽。代码层确有产品内部读取身份用于同步，本报告只说明observer不直接读取/记录敏感值。

认证初始化/恢复在观察器之外，由交接说明；本包没有登录请求、凭据或连续认证过程证据，不能称该认证流程已独立验证。control恢复与readback没有完整driver冻结，故分别保持其作者说明与局部读数上限。

## 独立reentry：空clip不是其它guard掩盖

后段reentry driver明确绑定同mainPage/context，认证操作已在观察器外完成后才运行；正常reload、选择既有target。本段**允许**reload，其事实不回写旧logout段。没有copy/paste/save操作，也未试图传递旧剪贴板。

| 重入阶段 | 实际读数 |
| --- | --- |
| initial | source完整descriptor等r003 copied.source（含null/键顺序/嵌套树），value200；clip=null，fieldsReady=true；三个DEV role unknown，因此copy/pasteReason先为permission_unknown |
| allowCheck | 正常DEV selector暂设allow；clip仍null，fieldsReady=true，copyReason=null，pasteReason=clipboard_empty |
| final | 正常DEV selector回unknown；read-source/read-dataset/edit-target三unknown，clip=null、queryObservation=null，copy/pasteReason=permission_unknown |
| 页面 | 气泡地图，routeMatchesResource=true；status REENTRY_FRESH_EDITOR_EMPTY_CLIP_WITH_VALID_COPY_INPUTS |

allowCheck证明重入时copy输入及身份/字段等当前guard有效、paste具体被空clipboard挡住，不能只靠初始permission_unknown推空剪贴板功能。它没有实际点击copy或paste，故不称本段完成一次新复制/粘贴或后端拒绝请求。新运行域session为identityEpoch1/editSessionId1/revision0，不能直接与旧域epoch2比较或据此称epoch回退缺陷。

六份事件/恢复/读回中21处完整descriptor逐node自洽：ownKeys中只移除明确undefinedPaths后，严格等JSON实际键与顺序；每个undefined路径有父node、ownKeys含键、JSON省略。未清洗null/undefined或仅以金额字段比较；这里没有raw find/getData结果快照，因此本报告不新增数据查询、保存持久化或金额结果验收。

## 全部发现、未查原因、同类残余与准入预测

已查无问题维度：30主refs/四Context与admission/冻结起止、正常账户退出入口、两个原控制失败及恢复分层、同context/同旧主页面/实际非空同模块绑定、完整descriptor与metadata、非TTL窗口、epoch增加且clip空、旧页identity_unknown与按钮disable、清空先于reload、重入有效copy输入与clipboard_empty、最终三unknown、observer无直接清空或敏感信息采集、standalone后端上限。

发现1项治理AC编号映射错误，主Agent已确认按Goal AC10 / UI09身份轴吸收，保留原卡；未发现阻断本具体前端链的新增产品问题。原r001辅助页控制错误、r002networkidle控制错误均非成功且保持；不能把控制恢复或DOM读回算logout验收。

未核真实多用户/组织/权限允许与拒绝、后端Token撤权、登录过程、插件/XPack、全部跨context/移动/嵌入/SSO入口、UI09全部deferred query旧operation/receiver、整个AC10 TTL/刷新矩阵或全量console/resource；这些不在本次只读局部logout/reentry证据范围。没有源码修复需求，不为更严格形式额外重跑。

同类残余：若仅import一个新模块读默认空、只在reload后看空clip、只读permission_unknown、把networkidle当账户ready、把自copy elapsed写成logout延迟，均可能产生误判；本轮通过已有绑定/时序/allowCheck限界。真实后端鉴权仍需独立环境与原允许/拒绝合同，不能由standalone正常logout替代。

**准入预测：治理吸收修正AC映射后，可将本U4“正常前端logout清空旧编辑clipboard、正常重入clip空且copy输入有效”的具体链有界接纳，无需机械第二轮。** 不追认原控制失败，不把clear/reentry成功推为AC09保存、UI09全身份stale、完整AC10/S039/P1/Goal通过，不重开C2/其它耗尽预算，完整0/49等原状态保持。

## Read Manifest

以下按路径去重；来源列保留卡、全部Context与admission的逐层绑定，所有摘要当前匹配。补读源码只证明所述链和边界，不冒充全量行为审计。

| 绑定来源 | 原件路径 | SHA-256 |
| --- | --- | --- |
| 卡; LogoutClear-r001 Context; LogoutClear-r002 Context; LogoutClear-r003 Context; LogoutReentry-r001 Context; logout-clear-admission-r001.json goal; logout-clear-admission-r002.json goal; logout-clear-admission-r003.json goal; logout-reentry-admission-r001.json goal | `Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/Goal.final.json` | `4db931a6764a8c48345e7e8358e579550a9bc98594bf1654647716d72b9678c4` |
| 卡; LogoutClear-r001 Context; LogoutClear-r002 Context; LogoutClear-r003 Context; LogoutReentry-r001 Context; logout-clear-admission-r001.json completion_contract; logout-clear-admission-r002.json completion_contract; logout-clear-admission-r003.json completion_contract; logout-reentry-admission-r001.json completion_contract | `Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/MVP-20261027/UiIntegrationCases-r002.json` | `e365ef111582ef84f20f26e6136854409b7fc66bb0931cae40a9df5318036d55` |
| 卡; LogoutClear-r001 Context; LogoutClear-r002 Context; LogoutClear-r003 Context; LogoutReentry-r001 Context; logout-clear-admission-r001.json design_review; logout-clear-admission-r002.json design_review; logout-clear-admission-r003.json design_review; logout-reentry-admission-r001.json design_review | `Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/MVP-20261027/reviews/MvpAcceptanceReadinessReview-r002.md` | `d3f97246db43f9dc705829d94ede73891694b13f21f7f3a9f4a03d748574fbe7` |
| 卡 | `Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/MVP-20261027/LogoutClearValidationHandoff-r001.md` | `dca8a333b29ddbddbc88b17585cf3fab451fff44e464798ae5f575f22d8150f1` |
| 卡; LogoutClear-r003 Context; LogoutReentry-r001 Context | `Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/MVP-20261027/evidence/LogoutClear-control-readback-r002.json` | `8c32892ccd41a91651abdb8998e2cd7f028c71f6191806adb49a6f400d37aef9` |
| 卡; LogoutClear-r002 Context; LogoutClear-r003 Context; LogoutReentry-r001 Context | `Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/MVP-20261027/evidence/LogoutClear-control-recovery-r001.json` | `0deff69ea4395ab89b9567ada2af89517a0d13335a3a813783bef38659c6ec4b` |
| 卡; LogoutClear-r002 Context; LogoutClear-r003 Context; LogoutReentry-r001 Context | `Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/MVP-20261027/evidence/LogoutClear-events-r001.json` | `79d9c5c2e1bd02803513d87a7b36c8e00b6d010f23d36c6fcdc85a9fa6928702` |
| 卡; LogoutClear-r003 Context; LogoutReentry-r001 Context | `Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/MVP-20261027/evidence/LogoutClear-events-r002.json` | `b0c322f6f801a0b05fe9c55e60e59f5180612e4ec662174b123c60e127ce0326` |
| 卡; LogoutReentry-r001 Context | `Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/MVP-20261027/evidence/LogoutClear-events-r003.json` | `c9776e8977749198caa30fbd6a67b70da3c149c212a15d85b4865d657386fccc` |
| 卡 | `Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/MVP-20261027/evidence/LogoutClear-reentry-r001.json` | `bbec369e1cc4cd0e2536ef0c29c7534a31a46e3dbc2bc3ac3f564c4cf4443573` |
| 卡; LogoutReentry-r001 Context | `Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/MVP-20261027/evidence/LogoutClearReentryToolFreeze-r001.json` | `a442807d158e7101112999f2e2212c7cab096db30de530170942f5525685d609` |
| 卡; LogoutClear-r001 Context | `Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/MVP-20261027/evidence/LogoutClearToolFreeze-r001.json` | `9330b235fdecbb157d5284b58bd97244a937d68150cf30d3e2003b8419d8bd42` |
| 卡; LogoutClear-r002 Context | `Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/MVP-20261027/evidence/LogoutClearToolFreeze-r002.json` | `f04a888bcce2884136d744cdc817aaf5f0e603aef45948887cbdf8af4d3fd095` |
| 卡; LogoutClear-r003 Context | `Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/MVP-20261027/evidence/LogoutClearToolFreeze-r003.json` | `27ad88cc4827bc0a50085bc887202fb911d8371cd2046a0e5073545283498556` |
| 卡; LogoutClear-r001 Context | `Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/MVP-20261027/runtime-state-tools/observe-logout-clear-r001.js` | `5d072a040ecfc854b9a534784953432097f3f7719f1202ab55271d87eee6f2dc` |
| 卡; LogoutClear-r002 Context | `Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/MVP-20261027/runtime-state-tools/observe-logout-clear-r002.js` | `f0bdd911fbfdfb4d479784de68ef9699ff72ff63f486282629c089559a1cff96` |
| 卡; LogoutClear-r003 Context | `Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/MVP-20261027/runtime-state-tools/observe-logout-clear-r003.js` | `3a9e92a626bd33c3f2bb7101ebb692770c777584fe4c6c18c5ea16787cccd4fb` |
| 卡; LogoutReentry-r001 Context | `Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/MVP-20261027/runtime-state-tools/observe-logout-reentry-r001.js` | `5dfe2b2fa1446639156e028ce08d70ec835b2032aca06ab2cc3c2c90eada237b` |
| 卡; logout-clear-admission-r001.json context | `Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/planning/ContextBootstrap-LogoutClear-r001.json` | `049336bcda54623373f29448726a4b471428e172b594c3ff1ae32b74195260af` |
| 卡; logout-clear-admission-r002.json context | `Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/planning/ContextBootstrap-LogoutClear-r002.json` | `cd343b24c4bcb4bb8b71479abcff8facc56ab045901338281f703b88fe4eb7b0` |
| 卡; logout-clear-admission-r003.json context | `Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/planning/ContextBootstrap-LogoutClear-r003.json` | `8cea066c39d8403d169d29b185fd2af5566e1182ccb587f4ecea9a3c3f3656df` |
| 卡; logout-reentry-admission-r001.json context | `Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/planning/ContextBootstrap-LogoutReentry-r001.json` | `df8e6a47eae2663507e1a62972401bc40e8338ba285bf5552104dff927ae3a69` |
| 卡 | `Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/planning/logout-clear-admission-r001.json` | `f9687a4f2398381962fcf9d9b60c99fe623e7d6d486a0d763f046db75f7481f4` |
| 卡 | `Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/planning/logout-clear-admission-r002.json` | `4b68dd5b5aac05373021d57c7243897f7b712fcdb1aa3b44c432e9b9ce6a0867` |
| 卡 | `Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/planning/logout-clear-admission-r003.json` | `32b421240d27108183a1d46a50849c0a95b5ba1713a2091b44a4156e44fd3ca2` |
| 卡 | `Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/planning/logout-reentry-admission-r001.json` | `9bfc990a0db1267f5c1f2c54d9b6b5f0c3afea84266c006a5f49023fe064405f` |
| 卡 | `core/core-frontend/src/utils/cacheUtil.ts` | `029bb9b5f10074dc1ca43c0e15126cbc2b4148552ca3329ebda7fb2eb67cb567` |
| 卡; LogoutClear-r001 Context; LogoutClear-r002 Context; LogoutClear-r003 Context; LogoutReentry-r001 Context | `core/core-frontend/src/store/modules/user.ts` | `f6df395cdaf628101440bc52df47c8ab952496244adcb6ccd263863e0737b159` |
| 卡; LogoutClear-r001 Context; LogoutClear-r002 Context; LogoutClear-r003 Context; LogoutReentry-r001 Context | `core/core-frontend/src/custom-component/filter-copy/mvp-chart-filter-copy.ts` | `9f4eca86173318b7b964648d216fd7a6c153b41abce9eda12f8f6e9fc6944b82` |
| 卡; LogoutClear-r001 Context; LogoutClear-r002 Context; LogoutClear-r003 Context; LogoutReentry-r001 Context | `core/core-frontend/src/views/chart/components/editor/filter/useChartFilterCopyMvp.ts` | `b760fffb47db4a8a187cc3dc996d6ddffb5f2b187038da625c5c8e0839d87e5d` |
| LogoutClear-r001 Context; LogoutClear-r002 Context; LogoutClear-r003 Context; LogoutReentry-r001 Context | `Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/MVP-20261027/reviews/SharedGuardWitnessValidation-r002.md` | `4d790b8d717992cea3dea962967568ede6f8cfd109c35e629dededda1d8acb88` |
| LogoutClear-r001 Context; LogoutClear-r002 Context; LogoutClear-r003 Context; LogoutReentry-r001 Context | `Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/MVP-20261027/reviews/SaveTransportLoadingValidation-r002.md` | `e7a393ca84f81961e3687f24e9dab06a83c30b2b3c822dc008543a14e690a30a` |
| LogoutClear-r001 Context; logout-clear-admission-r001.json topology | `Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/planning/Topology-actual-r592.json` | `3dd25a8c843c041b54a6b4124b86c43321a2c3f19f121d4e4c27eebcbaad49fe` |
| LogoutClear-r001 Context; LogoutClear-r002 Context; LogoutClear-r003 Context; LogoutReentry-r001 Context; 补读正常退出链 | `core/core-frontend/src/layout/components/AccountOperator.vue` | `ee764048c6578ab9c8fd326cabdf70774bbc72c0c18a1c9bc4a86d9406304634` |
| LogoutClear-r001 Context; LogoutClear-r002 Context; LogoutClear-r003 Context; LogoutReentry-r001 Context; 补读正常退出链 | `core/core-frontend/src/utils/logout.ts` | `878cb98f412c6c9263d615aaa59a1b7eb6aeaa18c41259f09861a517897d3434` |
| LogoutClear-r001 Context; LogoutClear-r002 Context; LogoutClear-r003 Context; LogoutReentry-r001 Context; 补读正常退出链 | `core/core-frontend/src/hooks/web/useCache.ts` | `cea005dca69db55d3e2661a3115acce2e83d2e368e3b61c73131aca94a55f647` |
| LogoutClear-r001 Context; LogoutClear-r002 Context; LogoutClear-r003 Context; LogoutReentry-r001 Context; 补读正常退出链 | `core/core-backend/src/main/java/io/dataease/substitute/permissions/login/SubstituleLoginServer.java` | `88bc3cd9e72697e72726f25dfde3adaae9d2331ffc8902356a316fd08c383ad4` |
| LogoutClear-r002 Context; logout-clear-admission-r002.json topology | `Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/planning/Topology-actual-r593.json` | `f8d4e7ccb5689f91f6c80848fd604f7bd7e39669b58c7a55a0bc6522889c635f` |
| LogoutClear-r003 Context; LogoutReentry-r001 Context; logout-clear-admission-r003.json topology; logout-reentry-admission-r001.json topology | `Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/planning/Topology-actual-r594.json` | `deea382d0641eeacef017c7afb3de2aeb3d4436cb7c2c912f0393c0dbc30fdc5` |
| 补读正常退出链 | `core/core-frontend/src/api/login.ts` | `432c731792f62849f4fb8f212fd683d4443bd881bf678bbcc8398f8d409902f2` |
