# 请求等待中正常切目标运行证据独立验证 r001

**结论：PASS_WITH_BOUNDS（本次正常切目标短链的原目标保旧有界通过），新增行为阻断0。** 实际pending请求期间通过正常tile入口选择另一ID，原请求随后真实完成；重选area后完整过滤树、已导出的clipboard/session和canvas保持。只覆盖此运行的观察面，不等于全部Store零写、全部失效场景或原operation内部生命周期终态通过。输出后unknown设置未留独立读回，不计已验恢复。

本轮是该**新运行交付第1/3轮**，不是角色在途报告追加、不是Slice A/C1/C2实现第四轮。无需机械补齐2/3、3/3或为隐藏Store/清理另采样。

- reviewer/source：`/root/local_basemap_reviewer`，独立于driver、运行采集、CSV及产品代码作者。
- reviewed_at：`2026-10-30T20:37:47.755307+00:00`；snapshot_id：`S02-INFLIGHT-TARGET-SWITCH-VALIDATION-r001`；as_of_state：本卡、Context/admission/r579与以下真实原件。
- Card canonical SHA：`b564ef08d8a6f6fbf68575251583e5283fefaad3ff9d4ff3c12bc66f0fe405f4`。接收端validate/render均exit0，消费确定性render execution_command；未编造同名已冻结prompt比对。
- 10项卡输入、Context12个内层SHA入场/写前逐项匹配；context_bootstrap validate、execution_admission实际检查均exit0。
- 唯一持久输出为本报告，写前不存在。未修改源码、driver、旧证据、Goal、Dashboard或KB；未操作UI/DB、安装、构建、启动服务、提交或推送。本lane未重演浏览器。

## 原始验收归属与实际范围

Goal的`AC-MVP-F01-07`明确要求operation/target输入复核和切目标失效。本包是该AC的一个共享正常UI运行见证；准备审查r001第67行也要求回接原切target证据、确缺时补共享短链。

**编号不能混用：** 冻结`UiIntegrationCases-r002.json`中的`MVP-UI-07`是49类型source/target共同接线分母；真正与本次动作对应的是`MVP-UI-09-TARGET`，属于busy和局部失效复核。Context的目标、AC-MVP-F01-07与输出路径正确，但“复用原UI07失效语义”及多处required-read reason/applicability沿用“UI04/DEV角色拒绝”是旧投影文字，不能因此把本次算作49型接线或权限验收。

本包只在本机admin和DEV三项allow下使用原source500，向area200启动paste并在query pending时选择另一tile，再回原target核保旧。没有在本包验证busy重复入口、编辑/卸载、unknown identity、preview已ready后切换、所有类型/入口、后端撤权或全局响应竞态。原38项（P1=12、P2=26）、49内置类型和完整0/49、真实权限未验、C2V-005及旧预算不变。

## 时序、请求与正常目标选择

冻结driver SHA=`62a8ee9d40fef73503c46e20751aa5fa29080ac5408a45897873ca4b7c1c25b6`；ToolFreeze/admission时间20:29:13.973217Z，早于run开始20:29:29.228Z；driver起止与当前摘要相同。没有fulfill/abort、请求/响应覆写或直接Store操作；route只等release后无参数continue。

| UTC时点（2026-10-30） | 原件中的事实 |
| --- | --- |
| 20:29:29.228Z | 运行开始，监听非认证API/request及匹配response |
| 20:29:30.382Z | request监听记录一次getData |
| 20:29:30.383Z | matching area500请求被route暂停；之后读取pending诊断 |
| 20:29:30.777Z | 两条字段目录请求明确指向另一ID `7521402539875504128` |
| 20:29:30.822Z | driver正常select另一tile结束并留下other诊断/otherSelectedAt |
| 20:29:30.823Z | 原route continue |
| 20:29:30.850Z | 匹配请求的真实HTTP响应事件，status200 |
| 20:29:31.938Z | 重新选择原area，目录请求指向`7520752064427724800` |
| 20:29:32.416Z | 后诊断、后PNG、监听结束与文件落盘 |

pending/other/after诊断本身没有各自独立capture时间字段，表中只使用实际记录时间；不是从mtime估算。

正常选择的证据链是driver的`#enlarge-inner-shape-ID`入口→该tile父overlay正常click（不存在则tile.click）→目录API确实请求另一ID→other诊断→原请求continue。source为`7520741153101058048`，原area target为`7520752064427724800`，resource为`1312476889213964288`，dataset为`1312472054565572608`。

另一ID是driver意图中的richtext tile；**r.other没有chartId/type字段，两张PNG也只截area，不能单凭其tree200证明另一图表的实际type或DOM身份全集**。本结论是正常选择了与原target不同的ID，结合真实目录请求佐证，不用图标题或相同threshold错配类型，也不升级成richtext渲染验收。

原件没有单独保存held时刻的完整request副本，因此本lane没有作两份held/wire独立字节相同的断言。可核的是：匹配函数限定原target/area/threshold500；源码continue无override参数；唯一wire留下完整真实request和body；pending.request导出投影及wire.customFilter与copied.clipboard.tree一致。这足以支持本包“正常继续真实请求”的边界，不扩称未采集header或所有传输字段的双快照验证。

## 原HTTP与CSV复算

唯一wire为HTTP200、业务code0；request/response都指向target `7520752064427724800`、type=area、dataset=`1312472054565572608`。xAxis为shop `1793083721149`，yAxis为amount `1793083721146`，filter为copied500完整树。

从绑定CSV独立应用amount>500与树内六店枚举，按shop求和，逐组等于真实tableRow：

| shop | raw response与CSV |
| --- | ---: |
| 果元店 | 2670 |
| 南都店 | 1284 |
| 乐园店 | 563 |
| 水围店 | 576 |
| 合计 | 5093 |

这是一份可采用但应因目标失效而丢弃的真实新结果，不是空响应或人为业务错误。它与旧area200的五店画布不同，不能因为查询HTTP成功就称采用成功。

## 完整投影、导出状态与两张PNG

source.source与copied.clipboard的tree/ownKeys/undefinedPaths完整相等。before/pending/after的原target descriptor完整相等，仍为AND amount>200与嵌套OR六店；13个递归ownKeys节点重算相同、undefinedPaths=[]。copied/before/pending/other/after的完整clipboard相同；before/pending/other/after session均identityEpoch21/editSessionId21/revision25，三权限均allow。本次变的是正常选择目标，未伴随copy更新revision或角色拒绝来掩盖目标变化。

原件的queryObservation必须逐时点如实记：

| 时点 | 实际导出 |
| --- | --- |
| before | null |
| pending | target=原area、operationId1、logicalGetDataCalls1、outcome=pending |
| other | null |
| after重选原area | target=原area、operationId1、logicalGetDataCalls1、outcome=failure、reason=paste_stale |

**不从other的null推导失败。** 本文件after确有上述failure读回，所以可以记录这个实际导出观察；但它不是原operation全部内部生命周期的审计，after.responseData也没有保存成这次raw响应的完整data，不把它误写成“诊断完整收到结果再失败”。真实HTTP完成由独立wire证明，after导出失败与原目标保旧分别成立。

两张PNG均已view_image直接查看，原文件为406×287，SHA及原字节完全相同：`0c5072224fbeebd0389edcd1829b639a4c88244dd837e6b9b21f171cd2105021`。可见旧area五店图及3218/1284/563/1141/555，未变为新500结果的四店图。只证明这两时点目标canvas的可见像素，不证明全编辑器DOM、图外tooltip、实例对象、dirty、所有缓存/Store或未来迟到回调均不变。

源码只读关联说明：composable/receiver在选中目标、canonical view/element和编辑上下文变化时核isCurrent；wrapper失效分支可返回paste_stale。这是既有接线与本运行现象的可定位关系，不重新给已结束实现发独立准入或声称全部setter监控。

## 监听窗口、末尾状态与全部发现

记录到9条非认证API metadata：8条目录请求（source/原target/另一ID/重选target各两条）和1条getData。该安装窗口内仅1个匹配query/真实wire，没有`dataVisualization/updateCanvas|save|saveCanvas`三已知保存端点，saveRequests=[]；不是“全部API为0”或“任意服务端写入已全面审计”。页面初始监听前、监听结束后、非匹配旧响应/资源响应不由本包覆盖；本driver没有pageerror/runtime错误全集记录，不能借别包的空数组宣布此处全部无错。

**末尾unknown不在已保存输出内。** driver的finally先unroute、等待已有response Promise、解除监听、填写finishedAt并写events文件，随后才执行统一权限控件selectOption('unknown')，没有再导出诊断/截图。故最后可独立核的after权限仍三allow；本lane不声称三unknown已恢复、clip清空、正常退出或持久化回滚，也不把这个未观察动作变成机械追加采样要求。

全部发现一次列明：

1. **TSW-N01 / P2 / 编号和元数据投影混用**：本包可归Goal AC-MVP-F01-07及Cases MVP-UI-09-TARGET；不能归为Cases MVP-UI-07/49型通过。Context多处UI04角色reason、旧r504 parent/base与topology.recorded_at沿前包；r579实际只列角色在途及reused11的reviewer/card，没有当前切目标reviewer条目。摘要检查通过不能冒充全部语义/actual topology已准确登记。当前objective、明确允许动作、source冻结、target和输出均清楚，未越界，因此不否定当前短链事实；后续索引按准确编号引用，不重写原冻件。
2. **TSW-N02 / P2 / 导出投影上限**：other无chartId/type、held无完整request副本；只能按正常tile入口和目录API证明选了另一ID，并按无参数continue源码与真实wire判定请求正常完成。不能填造另一type/完整token全集或双快照字节证据。
3. **TSW-N03 / P2 / 原operation与全旧状态上限**：other.qobs=null不作因果推断；after实际failure/op1只作导出观察，不能据此证明内部状态机所有终态/全部Store/dirty无写。2个像素时点及投影不变不等于所有响应竞争已排除。
4. **TSW-N04 / P3 / 输出后末态未导出**：unknown动作发生在events写完后，只是冻结driver的后续动作意图；当前无独立恢复读回，不记已验末态。当前局部保旧结论无需为此重跑或开第二轮。

已查未见新增阻断：10项主输入及Context12ref字节一致、freeze/admission早于执行、driver起止一致；原目标pending、新target正常入口与目录API时序、真实唯一200/code0及CSV；source/clip、原目标13节点descriptor、同会话/clip版本、真实after诊断；2PNG摘要/原字节及画面；监听窗query/save边界；独立身份和实现预算不重开。

未检及原因：未知identity、真实多账号/组织允许拒绝、后台权限变化、preview已ready后的切换、卸载/编辑/所有context变体、全部Store/dirty/实例/缓存、全局旧响应与所有SDK事件、完整undo/redo、保存失败、所有49type/跨入口和最终Goal；原因分别是本交付精确范围、没有对应原件、导出投影边界，不是默认通过。原38/49、C2/旧ubo和Slice A/C1/C2三轮预算保持。

## 可吸收的结论与下一步

可作为Goal AC07的**一次正常切目标运行补证**吸收：原area的query pending时选择另一ID，真实query继续完成后，重选原target仍保持旧tree、已导出clip/session及canvas；原目标after诊断记录paste_stale。与原组件层/源码失效证据分别索引，不能凭此关闭整个AC07/原Cases所有失效轴、49型或P1。

本次无新增实现阻断，不要求更改源码或补第2/3、3/3；只需后续投影纠正编号及声明上限，继续原未完成义务。角色在途包的原run FAILED/后诊断恢复仍由其独立报告负责，未被本包的正常短链覆盖。

## 输入清单与最终绑定

| 卡输入 | SHA-256 |
| --- | --- |
| [Goal.final.json](</Users/xiaomei/Documents/projects/dataease/Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/Goal.final.json>) | `4db931a6764a8c48345e7e8358e579550a9bc98594bf1654647716d72b9678c4` |
| [ContextBootstrap-InFlightTargetSwitchRuntime-r001.json](</Users/xiaomei/Documents/projects/dataease/Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/planning/ContextBootstrap-InFlightTargetSwitchRuntime-r001.json>) | `b2d1399027ab9274771c182f97902112600cdfe333f87fab52560999acd8c77c` |
| [inflight-target-switch-runtime-admission-r001.json](</Users/xiaomei/Documents/projects/dataease/Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/planning/inflight-target-switch-runtime-admission-r001.json>) | `91dc7aa4c87f7552d3eccd06afe58d4c1cf3ce424171cc8a0e0b77542529da59` |
| [Topology-actual-r579.json](</Users/xiaomei/Documents/projects/dataease/Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/planning/Topology-actual-r579.json>) | `339d19038eecc081d530442e35ad3f277b1791eddabfa9eb022a2203e5088e53` |
| [observe-inflight-target-switch-r001.js](</Users/xiaomei/Documents/projects/dataease/Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/MVP-20261027/runtime-state-tools/observe-inflight-target-switch-r001.js>) | `62a8ee9d40fef73503c46e20751aa5fa29080ac5408a45897873ca4b7c1c25b6` |
| [InFlightTargetSwitchToolFreeze-r001.json](</Users/xiaomei/Documents/projects/dataease/Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/MVP-20261027/evidence/InFlightTargetSwitchToolFreeze-r001.json>) | `266475cb52c6f4c390310d33b7762d912da64b8732273c294197c52e906aba4c` |
| [InFlightTargetSwitch-events-r001.json](</Users/xiaomei/Documents/projects/dataease/Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/MVP-20261027/evidence/InFlightTargetSwitch-events-r001.json>) | `6a36cc3e6f6be06a24bba108adfd1df0db1551e5a7b1c6e2cd58b76c45b29797` |
| [UiIntegrationCases-r002.json](</Users/xiaomei/Documents/projects/dataease/Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/MVP-20261027/UiIntegrationCases-r002.json>) | `e365ef111582ef84f20f26e6136854409b7fc66bb0931cae40a9df5318036d55` |
| [MvpAcceptanceReadinessReview-r001.md](</Users/xiaomei/Documents/projects/dataease/Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/MVP-20261027/reviews/MvpAcceptanceReadinessReview-r001.md>) | `fba3b6ad368e085b787cd9a69497f5fb51163397559d718f7596dd014a06d9af` |
| [TeaMaterialExtended-r001.csv](</Users/xiaomei/Documents/projects/dataease/Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/MVP-20261027/runtime-fixtures/TeaMaterialExtended-r001.csv>) | `abc8bed0862129d58724bcefff2563862e48d1ea057365ae8d5d2c853e64472b` |

| Context内层及补充材料 | SHA-256 |
| --- | --- |
| [SliceARolePortsValidation-r003.md](</Users/xiaomei/Documents/projects/dataease/Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/MVP-20261027/reviews/SliceARolePortsValidation-r003.md>)：Context内层绑定 | `726720f12d85ec48a459d53058351d9e7580a267f3a696fa7f08587e73d58e28` |
| [RolePermissionControlsRuntimeValidation-r001.md](</Users/xiaomei/Documents/projects/dataease/Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/MVP-20261027/reviews/RolePermissionControlsRuntimeValidation-r001.md>)：Context内层绑定 | `ad6af1381e737eedc8b87001b0216a9e4f1b9db03efa53aeab52fd8dd29c2005` |
| [C1THeatmapPrimaryDataValidation-r003.md](</Users/xiaomei/Documents/projects/dataease/Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/MVP-20261027/reviews/C1THeatmapPrimaryDataValidation-r003.md>)：Context内层绑定 | `be82d391287f64f6c29e51f3c2660d9d695cc3131629a9d55937c2620ff80e04` |
| [THeatmapPrimaryData-runner-format-landed-r001.json](</Users/xiaomei/Documents/projects/dataease/Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/MVP-20261027/evidence/THeatmapPrimaryData-runner-format-landed-r001.json>)：Context内层绑定 | `fb2a000dc5880cafbe472a44da302b94a74cdac23fbd23c9fc6298625dbdd757` |
| [useChartFilterCopyMvp.ts](</Users/xiaomei/Documents/projects/dataease/core/core-frontend/src/views/chart/components/editor/filter/useChartFilterCopyMvp.ts>)：Context内层绑定 | `b760fffb47db4a8a187cc3dc996d6ddffb5f2b187038da625c5c8e0839d87e5d` |
| [index.vue](</Users/xiaomei/Documents/projects/dataease/core/core-frontend/src/views/chart/components/views/index.vue>)：Context内层绑定 | `dd88f2ac4f7c5e35f0b07822c72cae0764a3bad11be4a19f23a86d9fb9de3c7b` |
| [mvp-chart-filter-copy.ts](</Users/xiaomei/Documents/projects/dataease/core/core-frontend/src/custom-component/filter-copy/mvp-chart-filter-copy.ts>)：Context内层绑定 | `9f4eca86173318b7b964648d216fd7a6c153b41abce9eda12f8f6e9fc6944b82` |
| [InFlightTargetSwitch-before-r001.png](</Users/xiaomei/Documents/projects/dataease/Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/MVP-20261027/evidence/InFlightTargetSwitch-before-r001.png>)：实际查看前图 | `0c5072224fbeebd0389edcd1829b639a4c88244dd837e6b9b21f171cd2105021` |
| [InFlightTargetSwitch-after-r001.png](</Users/xiaomei/Documents/projects/dataease/Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/MVP-20261027/evidence/InFlightTargetSwitch-after-r001.png>)：实际查看后图 | `0c5072224fbeebd0389edcd1829b639a4c88244dd837e6b9b21f171cd2105021` |
| [MvpAcceptanceReadinessHandoff-r001.md](</Users/xiaomei/Documents/projects/dataease/Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/MVP-20261027/MvpAcceptanceReadinessHandoff-r001.md>)：原声明上限 | `663cba05b5bbe6c2e1f9abd09353fbde103638b14b6190bb25f0232e61ba5b1b` |
| [SliceC2Validation-r003.md](</Users/xiaomei/Documents/projects/dataease/Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/MVP-20261027/reviews/SliceC2Validation-r003.md>)：原C2累计3/3阻断保持 | `17e6566b99fe25194bf957abaf58c95e4398df4d1edf5aee6aec9e3470575ee6` |

写报告前后，10项主绑定、12个Context内层及补充材料摘要均一致。只新增本报告，没有回写driver、原事件、旧结论或状态。项目无Session registry/reconcile工具，不声称程序化注册表校验；本文不是Goal最终closeout或Stop Gate。
