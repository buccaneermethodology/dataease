# 保存传输失败 loading 清理独立验证 r002

- reviewer/source：`/root/local_basemap_reviewer`；reviewed_at：`2026-10-30T21:37:13.784487+00:00`。
- 卡canonical SHA：`0b76960a010f85af3dcaef30c263e3bd3ede3fe1bf5f4fd393f9aa982eb427a0`；接收端validate/render均exit0，消费完整execution_command及ValidationHandoff-r001。
- **结论：PASS_WITH_BOUNDS。** 本新Axios清理单元的最小源码修复、冻结8例RED/GREEN、定向lint与同U3新r002真实受控失败后恢复链有界通过；新增阻断0。可接纳同路由、已取得loading引用、非handleErrorLocally提前返回的无response失败清理，不扩为全部HTTP或完整AC09。
- 本单元累计第 **2/3** 轮，设计审查为1/3；没有重开C1/C2/Slice A等已耗尽3/3预算。唯一持久输出为本报告；本lane未改workspace源码/runner/合同/旧证据、未操作UI/DB/安装/整包构建。独立复跑仅本unit、指定双文件lint及授权的临时shadow RED，临时目录已删除。

## 原始要求、发现与历史保留

原AC-MVP-F01-09及S039 U3要求正常显式save失败不能伪称持久化，当前编辑状态保留并正常读回旧保存快照。本次修复来自该既有链中新发现的全页loading滞留，并非新增保存功能，也非C2实例cleanup的同一修复。

原r001状态仍为FAILED_OBSERVATION_PRESERVED：单次浏览器abort后没有成功提示、当前500保留；虽然正常panel及新find/getData已读回旧bubble200，后续选择target仍8秒超时，原Call log反复显示 `ed-loading-mask intercepts pointer events`。原events没有savedAfter/finalDiagnostic，不能补写末态。独立看原PNG（SHA `e2e96743ada35512ab93685e27c5622f1d77ddb170a8258184c7e1136245012c`）可见全页白色遮罩与中部spinner，控件和地图在其后。

原独立reload恢复为另一时点：`21:12:46.329Z` 记录遮罩parent为dv-common-layout，`21:12:49.663Z` 读回mask0、气泡地图保存树200、clip空、三unknown。恢复完整descriptor等原保存树；该原件只证明作者标明的正常重载前后读数，无连续完整HTTP/driver attestation，不称修复成功或完整U3通过。首失败与后恢复没有被新成功覆盖。

原38义务（P1=12、P2=26）、49类型分母、完整 **0/49** 保持；真实权限BLOCKED/NOT_RUN、插件installed unknown、C2V-005/旧ubo及其它冻结残余不升级。此报告不关闭完整AC09/P1/Goal。

## 源码增量、调用链与回滚边界

逐字节比较 `service.ts.before`、`SourceDelta-service.after` 与当前service.ts，后两者完全相同；从after仅移除唯一新增行后严格等before，其它字节未变：

```ts
if (!error?.response) {
  error.config?.loading && tryHideLoading(permissionStore.getCurrentPath)
  return Promise.reject(error)
}
```

before SHA `5651f057658c8dd25adbcc73c7625f06834074069e6a5342cd92beb07f7d1f7c`，after/current SHA `7ea2e47f2e216a5dc29f74343de6213532b3d299df55ea32c81ebf0c767752e1`，patch SHA `7907aa36585e541638e9ed3a9841fa77454e0df0702da2988e0c043dd0a34c0f`。

补读实际调用链：updateCanvas仍request.post且loading:true；请求拦截器正常完成处理后通过tryShowLoading取得当前路径引用。response错误回调原无response分支早于既有清理直接reject；新增行复用真实tryHideLoading，该helper仅在key非空且count>0时reduceLoading一次，Store的reduceLoading按key减一。没有全局reset、自动重试、吞原错误、改鉴权或改保存成功逻辑。

共享影响是所有走该无response分支且loading真的请求，在当前路径释放一个已有引用；本验收以同路由取得引用为前提。跨路由key归属、请求尚未取得引用等更广生命周期未被本unit认证。回滚可精确撤销这一行；未实际执行回滚，不能称运行回滚验证。

handleErrorLocally仍最先reject，尤其loading:true的local组合未被本改动修复；冻结STL06只覆盖local且loading:false。timeout原resetLoadingMap、413早退、HTTP500等其它分支与cancelMap生命周期均未改，既有问题按设计排除，不以本次通过为其背书。零计数不减的依据为真实helper静态count>0 guard；冻结8例未包含current_count0动态fixture，未冒称该项另有运行测试。

## 入场、冻结与预期源漂移

卡34项refs全部匹配当前摘要。Build Context10项中仅service.ts绑定旧before SHA与修后current不同，其余9项匹配；其service.ts.before明确保存且摘要匹配原绑定，源码增量可无损重建。该before→after漂移为本次授权实现的预期结果，不能拿修后重验旧receipt漂移倒判原执行未准入。

Build admission issued_at `21:25:10.843728Z`，5项上层refs匹配；两个Context的schema校验均exit0。这里区分schema合法与当前源码摘要：不声称修后旧Build Context的所有当前来源仍无漂移。RunnerFreeze `21:26:43.253094Z` 绑定Cases、runner、before与helper；BuildEvidence `21:28:57.240402Z` 记录RED后最小patch及GREEN。未从mtime估算历史RED/GREEN起止或耗时，本lane独立shadow复现用于确认其语义可信度。

新Runtime Context13项required refs全部绑定修后source并逐项匹配，九域完整；新admission5项refs匹配，当前execution_admission复验exit0。新runtime freeze/admission为 `21:28:57.240402Z`，先于运行 `21:29:45.878Z` → `21:29:53.588Z`。driver freeze/start/end/current均 `4c77654cd03a6dfc7a776844507cf251d0c177bac856ff60f588eb02e917c07f`。当前源/runner/Cases/helper摘要没有漂移，未用旧before准入覆盖新runtime。项目无Session registry工具，未声称程序化注册表校验。

## 冻结runner、可信RED与独立复跑

Cases SHA `d3112965209eb76c692fdfb8ec419797f00dc285db1bb0a62128969ed2ebc0a7`；runner SHA `8fc75471db83e36833e15e59fed5818160ec6acb541524b4b1f8a580541a8a6f`；完整helper文件 SHA `9997c7f2579794219995b04116205eed3ac52c8d47c57e2d71551298b504ffe8`，均与RunnerFreeze、原RED/GREEN绑定一致。

runner通过TypeScript AST解析实际service.ts，唯一定位 `service.interceptors.response.use` 的第二个箭头函数；参数数量/类型、唯一性和parseDiagnostics均有断言。helper亦从实际loading.ts唯一提取tryHideLoading箭头原文；esbuild转译真实原文，未复制被测判断。外围Store/UI provider为有界替身，AxiosHeaders是真实类；额外权限/缓存/router依赖越界会抛执行错误。每例验证原error identity、当前及其它path计数、reduce/reset/message调用；将AssertionError与执行错误分开，防止运行错误冒充RED。

| 冻结case | 关注行为 | 原RED / 独立shadow RED | 当前原GREEN / 独立GREEN |
| --- | --- | --- | --- |
| STL01 | loading1单引用释放至0 | 指定语义失败，实际1≠0 | 通过 |
| STL02 | 两引用仅减一、其它path7不变 | 指定语义失败，实际2≠1 | 通过 |
| STL03 | loading:false不减 | 通过 | 通过 |
| STL04 | 未提供loading不减 | 通过 | 通过 |
| STL05 | 无config仍reject同error | 通过 | 通过 |
| STL06 | local分支、loading:false | 通过 | 通过 |
| STL07 | ERR_CANCELED的有loading无response错误 | 指定语义失败，实际1≠0 | 通过 |
| STL08 | 原HTTP400错误消息与reject | 通过 | 通过 |

原件RED exit1：5pass、STL01/02/07三个语义失败、executionErrors0；原件GREEN exit0：8pass、0语义/0执行错误，两stderr为空。独立复跑同样得到此结果：

- 在 `core/core-frontend` 执行 `node tests/save-transport-loading/check.mjs`：exit0，8/0/0。
- 授权临时shadow目录复用**字节相同**runner、service.ts.before、真实helper，node_modules/Dashboard软链接供现有依赖与冻结Cases；没有临时替换workspace正在运行的source。相同runner执行exit1，5pass+指定STL01/02/07语义失败+0执行错误；临时目录已删除。
- 同目录执行 `./node_modules/.bin/eslint src/config/axios/service.ts tests/save-transport-loading/check.mjs`：exit0，stdout/stderr空，未加--fix。

原/独立RED callback SHA均 `2dffd1a71bb11facdc6906f34923be5e0656da08f5346080179e97624b279afd`，GREEN均 `a36e15647ee2f77e1c146bb3efa0e223674ed6393ee042a447f7955d4242da1f`；两者提取helper SHA均 `08f904fcb430ab45d0f7d180824b68435c46631d5c8c9e3349a4361fe1fdbad7`。这是实际回调/helper的提取unit层，不是整个Axios初始化、真实Store所有行为或真实权限验证。

## 新U3 runtime：单abort、mask释放与编辑状态

独立读取全部11条business wire、63条API metadata及saveRoute/failed各1；所有已收到business response均HTTP200/code0，无captureFailure。query是真实未mock，唯一route仅匹配updateCanvas并abort，未改query响应。

目标 `7520752064427724800`、dataset `1312472054565572608`、resource `1312476889213964288`；源symbolic-map500 `7520741153101058048` 正常复制到已有保存bubble-map200目标。source/source-copy/afterPaste完整descriptor严格一致为500；afterPaste queryObservation success/logical1。

| 新r002事实 | 时点 / 核查结果 |
| --- | --- |
| initialExit | 21:29:46.019Z，panel/index、editorCount0 |
| 保存前find与目标query | wire0/1，旧bubble-map200及真实新rows |
| paste后目标query | wire5，21:29:49.290Z，bubble-map500/真实三省rows |
| 正常保存按钮 | beforeSave messages=[]、disabled=false；21:29:50.218Z显式点击 |
| 唯一updateCanvas | route at50.316Z，资源ID正确，payload目标bubble-map500完整树等afterPaste；一次abort_failed_before_backend_send |
| 唯一requestfailed | 50.317Z，net::ERR_FAILED；与route完整request字符串相同，无updateCanvas response |
| 等800ms后采样 | 51.120Z，loadingMaskCount0、saveSuccessVisible=false、messages=[]、saveButtonDisabled=false |
| 编辑状态 | afterFailedSave与afterPaste的source完整descriptor、clipboard、session分别严格相同，仍500 |
| 正常离开 | 51.254Z，panel/index、editorCount0 |
| 重开find与目标query | wire6/7，51.431Z与51.829Z；旧保存bubble200及新rows |
| 正常选择与末态 | savedAfter at53.575Z；无reload/force补救；final at53.588Z三unknown、clip空 |

独立实际查看新PNG（SHA `4c6add7701c589ececf7655dc358cc3315ddf5d45f8b972088ac46f36c2b0d3c`）：编辑器地图与控件清晰，无原图全页遮罩/spinner，和maskCount0一致。截图不证明内部loadingMap恰好多少，也不从气泡大小反算金额。“无保存成功提示”仅限等待800ms后的实际采样并结合原失败/源码分支，不宣称全时间窗DOM监控。浏览器发送前abort不等于后端写入失败或事务回滚；本次没有进行后端写入故障实验。

## 独立CSV、保存快照及descriptor

CSV SHA `abc8bed0862129d58724bcefff2563862e48d1ea057365ae8d5d2c853e64472b`。独立用Decimal按原AND金额阈值及OR六店语义逐行执行，按province聚合，与原r001和新r002全部目标query逐条比较：

| 条件 | 江苏 | 浙江 | 广东 | 合计 | 对应wire |
| --- | --- | --- | --- | --- | --- |
| 保存200 | 2676 | 2217 | 1868 | 6761 | 原2/7，新1/7 |
| 编辑500 | 1982 | 1243 | 1868 | 5093 | 原5，新5 |

每条目标getData均bubble-map、目标id/dataset匹配，raw tableRow与上述独立oracle严格相同；其它view响应不混入目标。新savedBefore.view与savedAfter.view**整个对象严格相等**；两次原始find对应保存树均200，savedAfter/source descriptor等savedBefore与finalDiagnostic。failed save payload是编辑500，之后读回200证明旧保存快照保持，不能把paste/query成功当作save成功。

原r00110处、新r00212处、旧recovery1处descriptor逐node自洽：去除明确undefinedPaths的own键后，ownKeys与JSON实际键及次序相同；undefined路径父对象存在、ownKeys含键、JSON不含键。未用JSON清洗忽略shape差异。新afterPaste/失败后的session均identityEpoch1/editSessionId1/revision1；恢复后identityEpoch3/editSessionId3/revision1。最终read-source/read-dataset/edit-target三unknown、clipboard=null、queryObservation=null，fieldsReady仍true；DEV允许测试桩不等于真实后端权限。

## 全部发现、未查原因与同类残余

无新增阻断本最小修复的发现；已查无问题维度包括原AC/U3范围、一次最小源码增量、冻结Cases/runner/helper身份、真实AST提取、可信RED与同8GREEN、引用并发/其它path/可选config/取消/原HTTP400、双文件lint、新runtime准入、单abort无成功、当前编辑状态、mask释放、正常导航/完整保存对象读回/新数据、clip与权限桩收尾、原失败和reload恢复分层。

未执行整包、全量ts:check、全部HTTP/所有路由/各Profile/所有图表类型/真实权限；仅一行局部修复且这些不在获准unit与U3范围内。未认证完整Axios模块初始化或请求阶段异常、local loading:true、跨路由key归属、timeout reset并发正确性、413/500响应旧分支、cancelMap全生命周期或所有console/resource/旧ubo；静态未改不等于动态通过。

同类残余是当前路径key未绑定原请求路径、local提前返回和其它既有错误分支可能仍有各自清理/错误传播行为；本修复不清空其它路径、也没有重构所有HTTP。请求真正送达服务端后失败/超时造成的提交结果未知未覆盖，不能把本次pre-send abort推广为事务回滚。BDD方面只新增unit回归，冻结UiIntegrationCases未改，新U3是原case的一次性运行见证，不宣称新增maintained非unit gate。

**准入预测：可接纳本新Axios清理单元的最小实现与同U3本次运行，使用本次独立结果关闭原“同路由无response save abort遮罩滞留阻碍正常恢复”的具体缺口；无需机械第三轮或扩为全HTTP。** 原r001 FAILED及reload仅恢复不追认；本单元累计2/3，C1/C2等旧预算和原裁决保持，完整AC09/P1/Goal、38义务/49分母与完整0/49均不升级。

## Read Manifest

卡34 refs、两个Context内层与两个admission的绑定逐层保留。Build Context中service.ts表列旧预期摘要，正文明确说明唯一实现后预期漂移；其它绑定全部按当前原件逐项匹配。补读源码仅用于说明调用链，不冒充全量审计。

| 来源 | 原件路径 | SHA-256 |
| --- | --- | --- |
| 卡输入 | `Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/Goal.final.json` | `4db931a6764a8c48345e7e8358e579550a9bc98594bf1654647716d72b9678c4` |
| 卡输入 | `Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/MVP-20261027/save-transport-loading-cleanup-r001/ValidationHandoff-r001.md` | `999309919b3a51b1789f7b572f5168ca451f3206ae5441dd6314ef650802da78` |
| 卡输入 | `Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/MVP-20261027/save-transport-loading-cleanup-r001/Design-r001.md` | `e9047dc2bee80dd14f8d5a18cc1a28fa96600368df366933895763fc4861dc8b` |
| 卡输入 | `Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/MVP-20261027/save-transport-loading-cleanup-r001/Cases-r001.json` | `d3112965209eb76c692fdfb8ec419797f00dc285db1bb0a62128969ed2ebc0a7` |
| 卡输入 | `Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/MVP-20261027/save-transport-loading-cleanup-r001/service.ts.before` | `5651f057658c8dd25adbcc73c7625f06834074069e6a5342cd92beb07f7d1f7c` |
| 卡输入 | `Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/MVP-20261027/save-transport-loading-cleanup-r001/SourceDelta-service.after` | `7ea2e47f2e216a5dc29f74343de6213532b3d299df55ea32c81ebf0c767752e1` |
| 卡输入 | `Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/MVP-20261027/save-transport-loading-cleanup-r001/SourceDelta-r001.patch` | `7907aa36585e541638e9ed3a9841fa77454e0df0702da2988e0c043dd0a34c0f` |
| 卡输入 | `Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/MVP-20261027/save-transport-loading-cleanup-r001/RunnerFreeze-r001.json` | `5a6eec19c1c6e837322f9b94b8ae55274b7f40d38fbbd63892d3a263ffff477c` |
| 卡输入 | `Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/MVP-20261027/save-transport-loading-cleanup-r001/RED.stdout.json` | `ba8917625a89e27a9039f22b1f3fe1f22c7a5a9ae8f5c952e9a0e3dfca55a6c3` |
| 卡输入 | `Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/MVP-20261027/save-transport-loading-cleanup-r001/RED.stderr.txt` | `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855` |
| 卡输入 | `Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/MVP-20261027/save-transport-loading-cleanup-r001/RED.exitcode.txt` | `4355a46b19d348dc2f57c046f8ef63d4538ebb936000f3c9ee954a27460dd865` |
| 卡输入 | `Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/MVP-20261027/save-transport-loading-cleanup-r001/GREEN.stdout.json` | `5a36604f961d584df8426e774056dce4c9a9aa7157f424c4eb03fd4e0c5f5ae7` |
| 卡输入 | `Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/MVP-20261027/save-transport-loading-cleanup-r001/GREEN.stderr.txt` | `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855` |
| 卡输入 | `Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/MVP-20261027/save-transport-loading-cleanup-r001/GREEN.exitcode.txt` | `9a271f2a916b0b6ee6cecb2426f0b3206ef074578be55d9bc94f6f3fe3ab86aa` |
| 卡输入 | `Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/MVP-20261027/save-transport-loading-cleanup-r001/Lint.stdout.txt` | `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855` |
| 卡输入 | `Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/MVP-20261027/save-transport-loading-cleanup-r001/Lint.stderr.txt` | `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855` |
| 卡输入 | `Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/MVP-20261027/save-transport-loading-cleanup-r001/Lint.exitcode.txt` | `9a271f2a916b0b6ee6cecb2426f0b3206ef074578be55d9bc94f6f3fe3ab86aa` |
| 卡输入 | `Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/MVP-20261027/save-transport-loading-cleanup-r001/BuildEvidence-r001.json` | `06c3d24a1ed47c068ab37463156b9880e6b3826211b27eeb589ce6c996ab700e` |
| 卡输入 | `Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/MVP-20261027/reviews/SaveTransportLoadingDesignReview-r001.md` | `fdc38c3a96e82c6df98051bf5951428696b8c2d37a5652a770a399c3d48dbae7` |
| 卡输入 | `Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/MVP-20261027/reviews/MvpAcceptanceReadinessReview-r002.md` | `d3f97246db43f9dc705829d94ede73891694b13f21f7f3a9f4a03d748574fbe7` |
| 卡输入 | `Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/MVP-20261027/evidence/SaveFailure-events-r001.json` | `9c6fa0a5591c6d67a20f657cb7e22aff33607e9da5a9b0f8270cb156c29a36a1` |
| 卡输入 | `Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/MVP-20261027/evidence/SaveFailure-recovery-r001.json` | `142dcf427dd24f692be8c8ae849529a82997dd6369084513b7cb39ad0651c711` |
| 卡输入 | `Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/MVP-20261027/evidence/SaveFailure-events-r002.json` | `b66ddb637556b32cb0e7ca166a73e0b77c6127e0806c71c9943fe16166435958` |
| 卡输入 | `Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/MVP-20261027/evidence/SaveFailureToolFreeze-r002.json` | `741cb67837c4c3f2f911b98799b1aca48ed8c7d9d035884c33a386b259cdc45e` |
| 卡输入 | `Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/MVP-20261027/runtime-state-tools/observe-save-failure-r002.js` | `4c77654cd03a6dfc7a776844507cf251d0c177bac856ff60f588eb02e917c07f` |
| 卡输入 | `Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/planning/ContextBootstrap-SaveTransportLoadingBuild-r001.json` | `bd2ec6de721fd172a768b4fb8167faa1e9318557fced3c27ed45a420fa0d2fff` |
| 卡输入 | `Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/planning/save-transport-loading-build-admission-r001.json` | `a59a3223e5ded1f08dae54242093623e5cde21615221433982564685b3c3e09e` |
| 卡输入 | `Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/planning/ContextBootstrap-SaveFailureRuntime-r002.json` | `0fd065f93ba8999ff6a07394def3530ad6108dacfd322c47b18c38a8155a05d9` |
| 卡输入 | `Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/planning/save-failure-runtime-admission-r002.json` | `9b2c69d9bd2089133ae5bd5e6508a7438b6cf12c0a508bc5ceadea3e8555e386` |
| 卡输入 | `Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/planning/Topology-actual-r585.json` | `97f549878ef5ace675b6a8df2c6ed5c6bd1000d829afa2d985b4666612305d99` |
| 卡输入 | `Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/MVP-20261027/runtime-fixtures/TeaMaterialExtended-r001.csv` | `abc8bed0862129d58724bcefff2563862e48d1ea057365ae8d5d2c853e64472b` |
| 卡输入 | `core/core-frontend/src/config/axios/service.ts` | `7ea2e47f2e216a5dc29f74343de6213532b3d299df55ea32c81ebf0c767752e1` |
| 卡输入 | `core/core-frontend/src/utils/loading.ts` | `9997c7f2579794219995b04116205eed3ac52c8d47c57e2d71551298b504ffe8` |
| 卡输入 | `core/core-frontend/tests/save-transport-loading/check.mjs` | `8fc75471db83e36833e15e59fed5818160ec6acb541524b4b1f8a580541a8a6f` |
| Build Context | `Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/Goal.final.json` | `4db931a6764a8c48345e7e8358e579550a9bc98594bf1654647716d72b9678c4` |
| Build Context | `Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/MVP-20261027/reviews/SaveTransportLoadingDesignReview-r001.md` | `fdc38c3a96e82c6df98051bf5951428696b8c2d37a5652a770a399c3d48dbae7` |
| Build Context | `Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/MVP-20261027/save-transport-loading-cleanup-r001/Cases-r001.json` | `d3112965209eb76c692fdfb8ec419797f00dc285db1bb0a62128969ed2ebc0a7` |
| Build Context | `Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/MVP-20261027/save-transport-loading-cleanup-r001/Design-r001.md` | `e9047dc2bee80dd14f8d5a18cc1a28fa96600368df366933895763fc4861dc8b` |
| Build Context | `Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/MVP-20261027/save-transport-loading-cleanup-r001/service.ts.before` | `5651f057658c8dd25adbcc73c7625f06834074069e6a5342cd92beb07f7d1f7c` |
| Build Context（预期before→after漂移；表列绑定预像） | `core/core-frontend/src/config/axios/service.ts` | `5651f057658c8dd25adbcc73c7625f06834074069e6a5342cd92beb07f7d1f7c` |
| Build Context | `core/core-frontend/src/utils/loading.ts` | `9997c7f2579794219995b04116205eed3ac52c8d47c57e2d71551298b504ffe8` |
| Build Context | `Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/MVP-20261027/evidence/SaveFailure-events-r001.json` | `9c6fa0a5591c6d67a20f657cb7e22aff33607e9da5a9b0f8270cb156c29a36a1` |
| Build Context | `Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/MVP-20261027/evidence/SaveFailure-recovery-r001.json` | `142dcf427dd24f692be8c8ae849529a82997dd6369084513b7cb39ad0651c711` |
| Build Context | `Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/planning/Topology-actual-r583.json` | `31fe878f8c744b48d76d4b2ec2806cec5ef41c5460663cc637d81609d31f1fef` |
| Runtime Context | `Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/Goal.final.json` | `4db931a6764a8c48345e7e8358e579550a9bc98594bf1654647716d72b9678c4` |
| Runtime Context | `Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/MVP-20261027/UiIntegrationCases-r002.json` | `e365ef111582ef84f20f26e6136854409b7fc66bb0931cae40a9df5318036d55` |
| Runtime Context | `Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/MVP-20261027/reviews/SaveTransportLoadingDesignReview-r001.md` | `fdc38c3a96e82c6df98051bf5951428696b8c2d37a5652a770a399c3d48dbae7` |
| Runtime Context | `Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/MVP-20261027/save-transport-loading-cleanup-r001/Cases-r001.json` | `d3112965209eb76c692fdfb8ec419797f00dc285db1bb0a62128969ed2ebc0a7` |
| Runtime Context | `Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/MVP-20261027/save-transport-loading-cleanup-r001/BuildEvidence-r001.json` | `06c3d24a1ed47c068ab37463156b9880e6b3826211b27eeb589ce6c996ab700e` |
| Runtime Context | `Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/MVP-20261027/save-transport-loading-cleanup-r001/RunnerFreeze-r001.json` | `5a6eec19c1c6e837322f9b94b8ae55274b7f40d38fbbd63892d3a263ffff477c` |
| Runtime Context | `core/core-frontend/src/config/axios/service.ts` | `7ea2e47f2e216a5dc29f74343de6213532b3d299df55ea32c81ebf0c767752e1` |
| Runtime Context | `core/core-frontend/src/utils/loading.ts` | `9997c7f2579794219995b04116205eed3ac52c8d47c57e2d71551298b504ffe8` |
| Runtime Context | `Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/MVP-20261027/evidence/SaveFailure-events-r001.json` | `9c6fa0a5591c6d67a20f657cb7e22aff33607e9da5a9b0f8270cb156c29a36a1` |
| Runtime Context | `Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/MVP-20261027/evidence/SaveFailure-recovery-r001.json` | `142dcf427dd24f692be8c8ae849529a82997dd6369084513b7cb39ad0651c711` |
| Runtime Context | `Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/planning/Topology-actual-r584.json` | `0fc394a24223948f1d28e5582be9eb13f23a3e8e69efd84c81e90219b649b095` |
| Runtime Context | `Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/MVP-20261027/runtime-state-tools/observe-save-failure-r002.js` | `4c77654cd03a6dfc7a776844507cf251d0c177bac856ff60f588eb02e917c07f` |
| Runtime Context | `Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/MVP-20261027/evidence/SaveFailureToolFreeze-r002.json` | `741cb67837c4c3f2f911b98799b1aca48ed8c7d9d035884c33a386b259cdc45e` |
| save-transport-loading-build-admission-r001.json goal | `Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/Goal.final.json` | `4db931a6764a8c48345e7e8358e579550a9bc98594bf1654647716d72b9678c4` |
| save-transport-loading-build-admission-r001.json completion_contract | `Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/MVP-20261027/save-transport-loading-cleanup-r001/Cases-r001.json` | `d3112965209eb76c692fdfb8ec419797f00dc285db1bb0a62128969ed2ebc0a7` |
| save-transport-loading-build-admission-r001.json context | `Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/planning/ContextBootstrap-SaveTransportLoadingBuild-r001.json` | `bd2ec6de721fd172a768b4fb8167faa1e9318557fced3c27ed45a420fa0d2fff` |
| save-transport-loading-build-admission-r001.json design_review | `Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/MVP-20261027/reviews/SaveTransportLoadingDesignReview-r001.md` | `fdc38c3a96e82c6df98051bf5951428696b8c2d37a5652a770a399c3d48dbae7` |
| save-transport-loading-build-admission-r001.json topology | `Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/planning/Topology-actual-r583.json` | `31fe878f8c744b48d76d4b2ec2806cec5ef41c5460663cc637d81609d31f1fef` |
| save-failure-runtime-admission-r002.json goal | `Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/Goal.final.json` | `4db931a6764a8c48345e7e8358e579550a9bc98594bf1654647716d72b9678c4` |
| save-failure-runtime-admission-r002.json completion_contract | `Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/MVP-20261027/UiIntegrationCases-r002.json` | `e365ef111582ef84f20f26e6136854409b7fc66bb0931cae40a9df5318036d55` |
| save-failure-runtime-admission-r002.json context | `Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/planning/ContextBootstrap-SaveFailureRuntime-r002.json` | `0fd065f93ba8999ff6a07394def3530ad6108dacfd322c47b18c38a8155a05d9` |
| save-failure-runtime-admission-r002.json design_review | `Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/MVP-20261027/reviews/SaveTransportLoadingDesignReview-r001.md` | `fdc38c3a96e82c6df98051bf5951428696b8c2d37a5652a770a399c3d48dbae7` |
| save-failure-runtime-admission-r002.json topology | `Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/planning/Topology-actual-r584.json` | `0fc394a24223948f1d28e5582be9eb13f23a3e8e69efd84c81e90219b649b095` |
| 实际查看PNG | `Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/MVP-20261027/evidence/SaveFailure-after-abort-r001.png` | `e2e96743ada35512ab93685e27c5622f1d77ddb170a8258184c7e1136245012c` |
| 实际查看PNG | `Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/MVP-20261027/evidence/SaveFailure-after-abort-r002.png` | `4c6add7701c589ececf7655dc358cc3315ddf5d45f8b972088ac46f36c2b0d3c` |
| 补读调用链 | `core/core-frontend/src/api/visualization/dataVisualization.ts` | `dc0a75b7a4abf308a41473de710c7d137b294c8b4915fe94f859744541cd4082` |
| 补读调用链 | `core/core-frontend/src/store/modules/request.ts` | `bbbfda668be24fb736758658fa865695441de1887b1707415ffeb75207c5f3f8` |
