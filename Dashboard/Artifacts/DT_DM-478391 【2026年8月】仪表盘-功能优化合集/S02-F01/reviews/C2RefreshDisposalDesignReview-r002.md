# C2 普通刷新完成后清理交接修订设计独立审查 r002

- reviewed_at：2026-10-30T16:17:54.086728+00:00。
- snapshot_id：`S02-C2-REFRESH-DISPOSAL-DESIGN-REVIEW-r002`。
- as_of_state：冻结输入与Topology-r557；本新设计交付物第2/3轮，不是原C2实现第4轮。
- card canonical SHA-256：`e8efd68203be0b4c5a6a4ede8986284042d5568effb38cda77dc2aac3673e983`。

**当前结论：BLOCKED（设计/案例尚不能冻结；本轮不进入RED或生产Builder）。** r002已明确真实SFC同步getter、正常刷新后wrapper throw、共享非activeG2Scope影响面及异步残余；但新增G2对照的条件化错误oracle、地图throw的分层计数仍不闭合。查完全部输入和50案后一次列出两项P1，不因首个发现早退。

| Gate | Verdict | 含义 |
| --- | --- | --- |
| Boundary Review | `PASS_WITH_LIMITATIONS` | 候选问题方向及普通刷新完成前提可辨，原结论/分母保留；共享卸载改造仍只是候选，不是当前MVP必要变更或实现授权 |
| Design Freeze Validity | `FAIL` | F-R2-001/002的case oracle存在矛盾或未定层次，不能冻结后交给Builder自行解释 |
| Implementation Entry Readiness | `BLOCKED` | 当前设计未冻结，且父Agent最新指示本轮不实施候选；本报告不签发RED或生产写入准入 |

原`SliceC2Validation-r003`的BLOCKED、原实现三轮预算耗尽均不变。组件double重复destroy与真实symbolic离开后的ubo异常没有因果绑定，不能据旧静态finding自动扩大成当前MVP必要改造。完整38义务／49类型与真实权限未验状态保持；本lane不替父Agent收束Goal。

## 输入与审查方法

接收端card validate/render均退出0。12处绑定引用含重复Goal，对应11个唯一文件，逐项摘要相同：

| 输入 | SHA-256 |
| --- | --- |
| `Goal.final.json` | `4db931a6764a8c48345e7e8358e579550a9bc98594bf1654647716d72b9678c4` |
| `C2RefreshDisposalDesign-r002.md` | `6c0ce2b3363fa7edafef6cd7cdd9437a61094340321051d368d7717a4197932e` |
| `C2RefreshDisposalCases-r002.json` | `ba29847e34cb1675ccada49fa3c04d95d552508276849577f13a0e8726ece1a3` |
| `C2RefreshDisposalDesignReview-r001.md` | `157ac5b247701cc1f3c1440e06de951a73262ae09e2285363493c026e3efb1e8` |
| `SliceC2Validation-r003.md` | `17e6566b99fe25194bf957abaf58c95e4398df4d1edf5aee6aec9e3470575ee6` |
| `ChartComponentG2Plot.vue` | `5ca0da498a294f82b3bb869dc2bcfa71a968b96f0b6ef98f9438cf150755daaa` |
| `g2-render-attempt.ts` | `7ff0a6d2ad931260241a4fc78970a99dc14f78c25bf71234f272a6fc837a90a2` |
| `filter-paste-ready.ts` | `71ee524fe26eba795c9d34ed70ea124b4132f198940b287fc2f77e99054b9dcb` |
| `l7.ts` | `94f1e0e47f05b09588bc71818ece4bb284f412fa0afb333b2614e513dd611414` |
| `check.mjs` | `c2d4d18c37e328faa0611d7ea0dee90a6117fcab29dcb957e96048b67a01522b` |
| `Topology-actual-r557.json` | `acda5be407424572b2ba3c8cd9b1a81c8258d6ba6473e47eb81b4aebc7f6a994` |

为核旧28ID保留与L7/L7Plot真实身份关系，追加只读如下资料；没有执行其中代码：

| 辅助读取 | SHA-256 |
| --- | --- |
| `Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/planning/C2RefreshDisposalCases-r001.json` | `b5a965b46d8524c9d3b27efe608de1d57e115f0ed87f594c38cded488e884242` |
| `core/core-frontend/src/views/chart/components/js/panel/types/impl/l7plot.ts` | `e63a044bbc5dca7bc07f645faf3df5684f8de8c545339f87fa0ce8978718d6cc` |
| `core/core-frontend/src/views/chart/components/js/panel/charts/map/flow-map.ts` | `cd6b2233c83fc19ab04b0a3262b44f26ff5934bad7915969586700eebfc71d1b` |
| `core/core-frontend/src/views/chart/components/js/panel/charts/map/heat-map.ts` | `1b09b6330c31e235923464b75665b814cebe0832a3b9fa3582aaf1279c60c563` |
| `core/core-frontend/src/views/chart/components/js/panel/charts/map/symbolic-map.ts` | `b5f7235ea6cc373b9fce47b0c95ce09e95f61ff45d6174d759156eb36a97c826` |
| `core/core-frontend/src/views/chart/components/js/panel/charts/map/map.ts` | `5eeb33eeff060e1a25e48eaa8d836d9e8985c63bfa2ed9d70b513244420c6c12` |
| `core/core-frontend/src/views/chart/components/js/panel/charts/map/bubble-map.ts` | `29f3d1d86d49563d4ad0bc1c385c242267000c066d5a4c13441520c7af797f04` |

已读上一设计审查F001–004、旧实现终轮C2V-005及其实际边界、r002设计/全部case、SFC prepare/dispose/unmount/renderG2/renderL7/renderL7Plot、真实G2 scope.dispose及map ready catch、L7 wrapper/实际地图draw返回值、原maps runner的编译与SDK seam。结构复算：42地图=原28正常+14throw；另8个G2对照；总50个ID唯一，原28的ID、fixture、refresh/order及原expected_counts全部保留。未跑runner、RED、编译、浏览器或SDK/GPU验证，仅新增本报告。

## 全部发现

### F-R2-001〔P1，冻结阻断〕G2八对照没有按正常／throw和清理顺序冻结准确错误oracle

位置：Cases-r002 `additional_control_cases`（约690–754行），特别是695/703/727/735行的destroy_throws=false及697/705/729/737行oracle；设计r002第24行的active错误说明也未显式条件化。

两个legacy正常case的oracle仍写“unmount cleanup reports once、handle first propagates same sentinel”；两个active正常case仍写“SDK destroy Error[] returned then console.warn once”。这不是正常destroy的源码行为。SFC约696–698行仅在errors.length>0才warn；g2-render-attempt.runCleanup成功返回[]，dispose正常无sentinel，也不会为0错误warn一次。相同oracle字符串还混写两种order的互斥传播行为，未规定本case哪一入口实际应抛、哪些记录必须为0。Builder若按destroy_throws自行解释这段文字，会在冻结后替合同补oracle。

**最小修订条件：**不改生产代码；把八案的每入口throw／error-array／warn次数、相同sentinel关联及重复清理次数明确为case自身期望，其他cleanup double固定不抛。准确条件表应为：

| owner | destroy_throws | order | 首handle的对外throw | 本轮cleanup warn |
| --- | --- | --- | --- | --- |
| legacy_no_active_scope | false | 任一 | 无 | 0 |
| legacy_no_active_scope | true | unmount→handle | 无；unmount捕获该sentinel | 1 |
| legacy_no_active_scope | true | handle→unmount | 第一次handle抛同一sentinel；unmount不再记录 | 0 |
| active_scope | false | 任一 | 无；scope.dispose返回[] | 0 |
| active_scope | true | 任一 | 无；scope.dispose的Error[]含本次destroy错误 | 1 |

以上各案两条入口及重复清理均不得重试当前destroy。对于跨VM创建的sentinel，须在harness中固定Error身份／realm或明确源码cleanupError的cause包装规则，不凭字符串相同当同一对象。

八control目前只有renderer/owner/destroy_throws/order/oracle，没有fixture或refresh前提、数值计数和owner实际可达断言。须至少明确如何经真实SFC调度到非line的G2 legacy与type=line的active scope，准备/采用/是否刷新及稳定完成条件，读回真实SFC myChart/activeG2Scope状态后再释放；禁止直接写入scope或只用map wrapper冒充G2。可选具体fixture由后续安排决定，但不能把“owner字符串为active”当已进入该实际分支。当前runner manager只支持mapClasses，不能直接执行这8案；新harness尚未落地本身不是缺陷，未定oracle才是本项阻断。

### F-R2-002〔P1，冻结阻断〕14个地图throw仍沿用无标签[1,1]，与不delegate的throw边界无法闭合

位置：Cases-r002 `cases[28..41]`，`C2-RD-THROW-01-*`至`C2-RD-THROW-07-*`，throw_instance约455、472…676行，expected_counts约457、474…678行；设计第22/36行已要求wrapper入口先计数再throw、分开wrapper与SDK，JSON却仍只有expected_counts=[1,1]。

若该数组沿用原28案的主要scene/plot旧新资源计数，它在新wrapper入口throw且不delegate时不应为[1,1]：旧strict主SDK释放1次，新SDK底层destroy并未进入，应为0。若把它改解释成wrapper入口计数，则L7 strict桥通常直接scene.destroy，L7Wrapper.destroy可能根本未调用，统一旧wrapper=1也不正确。只写“分别记录”而没有两层独立期望，harness无法判断何为可信RED或GREEN。

真实身份进一步要求按fixture绑定：

- flow/heat/symbolic返回L7Wrapper，strict清理由ready.addCleanup直接调用scene.destroy；旧wrapper和旧scene是不同身份。
- map/bubble的polygon/point四fixture的drawChart直接返回SDK view；myChart与主Plot是同一对象，没有额外生产L7Wrapper。不能为凑计数给它新增虚构wrapper或改变测试所有权。
- layer/dot内部清理与主要scene/plot不是同一计数分母；normal draw中的内部重建也不在本次“引用须先null”的断言窗口。

**最小修订条件：**保留原28个ID及其正常主资源基线；为14个throw明确current-object destroy拦截入口、underlying SDK method-body委托、旧strict bridge主资源三者的身份/alias和各层期望。throw seam固定为新current destroy入口“计数并采getter→抛sentinel→不delegate”；于是新current-entry=1、新SDK body=0、旧strict主SDK=1，最终myChart=null，第二入口不增加任何相关计数。旧L7Wrapper入口是否0、Plot入口与SDK对象alias如何记录，必须逐fixture显式声明，不给七fixture统一套无标签wrapper旧新=[1,1]。

正常28案的主SDK=[1]或[1,1]可保留，但各层计数及采样记录须可反证“只有最终null、销毁前仍持有引用”的错误实现。不能将throw前终止写成vendor资源已经成功释放。

## 原四发现处置与其余非阻断问题

| 原发现 | r002审查结论 |
| --- | --- |
| F001同步前置采样 | 设计方向已补足：真实SFC test-only getter，strict主要scene/plot及稳定新current入口同步读取；窗口限定teardown/首次旧strict交接，避免layer重建误报。当前未落harness，不能称采样已运行；层次计数仍受F-R2-002约束 |
| F002异常通道 | map新wrapper的两顺序方案与现有handle传播／unmount catch相符；G2 false/true oracle和计数未闭合，未满足冻结要求 |
| F003共享调用点 | 已明确选通用非activeG2Scope，承认G2 legacy及地图影响，active独立分支保留；范围说明比r001清楚。八G2对照尚受F-R2-001约束；此扩展仍为候选，没有由旧局部finding自动取得实施授权 |
| F004异步跨卸载 | 已明确排除draw在unmount后完成并重新写myChart。不能写成所有顺序、所有生命周期都已覆盖，旧残余继续 |

**N1：旧ready桥throw“对照”的表述尚需避免误读。** 设计第22行称严格桥资源throw“仅作为旧通道对照”，但这50案中无明确strict-primary-destroy-throws case，原maps runner也未定义这种destroy throw注入。当前只能确认FilterPasteMapReady.release/addCleanup保留既有catch的静态语义；不能在未来执行报告里把它算作已通过的throw对照。若原意只是“不改既有catch”，标明静态边界即可；如果另行要求运行对照，必须有可定位case和准确oracle。此项不要求本轮扩充实现或追加测试。

**N2：卡maximum_claim_ref仍称第1/3轮。** 其execution_command、snapshot和父Agent明确当前为同一新设计第2/3轮；本报告据此记2/3，不重置历史，也未改冻结卡。

**N3：设计方向不能替代产品必要性。** 旧C2V-005证明double层重复调用，不证明真实浏览器可达性、ubo根因、GPU损害或当前真实保存重开最小缺口必须先作共享卸载改造。父Agent最新优先级已明确本轮不实施候选；本报告不把语义设计修订转成生产行动要求。

## 已查无问题、未查原因与同类残余

已查无问题：authority原Goal及AC文本、11唯一绑定文件摘要、r001四项发现逐一响应、旧实现终轮C2V-005的有限边界、50ID唯一与原28身份/计数保留、普通刷新完成/稳定替换前提、局部先取出引用再置空方向、准备期先清myChart再cancel bridge的匹配条件、非active与active所有权分离、实际SFC getter方案、normal-current throw与ready内部catch区分、query/Store/publication无副作用的候选约束、no-refresh/两顺序对照、RED不得预填失败总数及execution_errors=0的要求。

SFC真实两入口错误边界已核：handle.dispose先alive=false，非active当前destroy错误向外传播；unmount的cleanup catch转reportG2CleanupErrors；active dispose先activeG2Scope/myChart=null再scope.dispose。g2 scope先closed=true，清理登记并执行，destroy错误经runCleanup进入Error[]；errors为空不warn。scope会幂等返回[]，但未运行本设计新case，不能将静态逻辑写成新GREEN。

未查：50案执行、harness transform是否真的采当前SFC且无影响控制流、RED失败指纹、最小生产diff与GREEN、真实SDK/GPU、child独立卸载浏览器复演、真实权限、全49类型、完整Store/交互/保存回归。任务只授权设计/源码只读审查，当前oracle尚不能冻结；没有运行构建、安装或测试。未来source/harness变化不能继承本次静态审核为自动通过。

同类残余：draw跨unmount完成后仍可能重写myChart并再次清理；普通非paste地图生命周期、SDK内部layers真实资源释放和旧ubo问题未观察。只观测destroy入口计数不等于底层body已执行；底层body被调用也不等于vendor/GPU释放成功。实际getter和层次化身份/错误oracle是反证这些偷换的必要条件。

## 本轮准入结论

两项P1合并列出了全部已查的准确修订位置及最小条件；当前Design Freeze Validity=FAIL，Implementation Entry Readiness=BLOCKED。这里只交付审查结果，**不安排本轮第三次执行、RED、Builder或生产代码变更**。如后续独立安排继续设计，应保留上述全部发现和同一交付物剩余1/3预算；原C2实现3/3与r003 BLOCKED不能借新名字翻转。

父Agent可以按其最新优先级继续与本候选无依赖的S039能力矩阵和真实保存重开缺口；这不关闭本设计或C2V-005。本lane未改Dashboard/Goal，未签发执行admission，也不运行全局终态Gate。
