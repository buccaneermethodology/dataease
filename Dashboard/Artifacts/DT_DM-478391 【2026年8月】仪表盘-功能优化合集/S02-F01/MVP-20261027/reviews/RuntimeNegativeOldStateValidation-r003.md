# 负向证据旧状态补充最终第三轮独立审查

- reviewed_at：`2026-10-30T15:09:11.134504+00:00`。
- snapshot_id：`S02-RUNTIME-NEGATIVE-OLDSTATE-VALIDATION-r003`；as_of_state：冻结RuntimeNegative首轮、PNG第二轮，加本次indicator受控abort的old-state补证；不是Goal最终收尾。
- reviewer/source：独立Validator `/root/bubble_ready_validator_resumed`；Builder `/root`。
- 轮次：同一原负向交付物累计 **最终第3/3轮**（首轮r001→PNG r002→本r003），预算已用尽；不重置、不重开C2、**不开第4轮**。driver r001失败/r002恢复是同case执行尝试，不是新审查预算。
- verdict：**RNV-N03在本次单indicator受控网络abort的18类已捕获前后投影有界通过；新增证据矛盾阻断0。原整包PARTIAL继续，不能关闭完整old-state oracle、八场景全验、SDK destroy或其它组件维度。**

本次真实旧目标为用户正常编辑的200树/6761，唯一候选为复制500树/预期5093。它不是“请求前后都看同一500”空对照。独立复算涵盖9,002,180字节JSON全部18投影、descriptor、snapshot raw、原始网络请求/失败/响应、实际原PNG及CSV；没有运行产品UI、故障注入、DB操作、测试、构建或修改产品/共享Dashboard。

## 原范围、输入与方法

只补原RNV-N03的这一indicator场景；原38义务（P1=12/P2=26）、49内置类型完整分母、**0/49完整验收**、真实权限 **BLOCKED/NOT_RUN**、插件installed **unknown**全部保持。原RNV-F01旧图缺失/旧时点、其它负向和地图残余不追认、不删除。本卡对应AC06/08/09/12，主要落在MVP-UI-08/09的失败候选与旧状态保持投影，不能把这次network分支推成其它失效轴通过。

card canonical SHA `00935fbba5c1f5fb74d354600ba200ee4e9588caa2c1b3fe481e402f6255ae02`，接收及写前SP010 lane_task_card.py validate均pass/exit0；render stdout与已落盘prompt均消费，执行内容一致。machine mode=full_baseline，**23项Goal/refs原字节SHA均独立匹配**。

| Read Manifest绑定文件 | SHA-256 |
| --- | --- |
| `Goal.final.json` | `4db931a6764a8c48345e7e8358e579550a9bc98594bf1654647716d72b9678c4` |
| `RuntimeNegativeValidation-r001.md` | `4a9c1fdce21e7110617d27456d9db1c24fd3bc239606c9d7ee22666165dd1825` |
| `RuntimeNegativePngValidation-r002.md` | `f8a915f5cd5954adafb3e513ff119cc1a444f0b700f2fb01968abd84aec524a6` |
| `UiIntegrationCases-r002.json` | `e365ef111582ef84f20f26e6136854409b7fc66bb0931cae40a9df5318036d55` |
| `RuntimeOldStateObservationPlan-r001.json` | `476554e61e8f9ccd0129cbfe98514751c106408208e5838a62bb3cad9bdb8e4c` |
| `RuntimeOldStateToolFreeze-r001.json` | `23b4fa2f37ee75817986e6eb1bae2c0828504f930be301be9ada54f7771e2058` |
| `RuntimeOldStateToolFreeze-r002.json` | `77e7e3433634a0550edfa28db0de503271f65df0d3f35b4d95611389144dbd2a` |
| `RuntimeIndicatorOldState-events-r001.json` | `dd14949d5986f845fd80af089ef5b7e95ba82eb15f396db8a38c201a7f86a13a` |
| `RuntimeIndicatorOldState-events-r002.json` | `76a35e2202d06d56d217926df97005b0e66eebcbb1cb6f2fc7b8547850745aa0` |
| `RuntimeIndicatorOldState-r002.json` | `025dab12802b8c26d4ab4bc56d76db3c0a365f9e84de017a557888695153e895` |
| `RuntimeIndicatorOldState-invocation-r002.jsonl` | `a0d9a524349574cf4f0acbef7e813b116b1a021bcb694e88d37c187eaaef668b` |
| `RuntimeIndicatorOldState-before-r002.png` | `5c023fd0fef6a18ba6d661ebdab6752015159614214316adcd825b570db42a30` |
| `RuntimeIndicatorOldState-after-r002.png` | `5c023fd0fef6a18ba6d661ebdab6752015159614214316adcd825b570db42a30` |
| `capture-active-indicator-r001.js` | `9a1c298a802cb47934640afc287f5618df09fade96732335a3f3ea09cc0cc06e` |
| `observe-indicator-abort-r002.js` | `a9df5f9e66da89b5ee339b5e98bf1e418e3a9a66174e95c6a086b12c5bd2982b` |
| `runtime-indicator-oldstate-execution-admission-r002.json` | `e5d1617d30ad4dc315d1084e3f6ddcb5c8e769507a9ea57314f50ae36ce2b374` |
| `TeaMaterialExtended-r001.csv` | `abc8bed0862129d58724bcefff2563862e48d1ea057365ae8d5d2c853e64472b` |
| `index.vue` | `dd88f2ac4f7c5e35f0b07822c72cae0764a3bad11be4a19f23a86d9fb9de3c7b` |
| `dvMain.ts` | `2ca7f626c2c31f3c6e5db547cae600cfcf30cf26ed64d8f183a33943751752a2` |
| `snapshot.ts` | `5ffd11d4740efbd8570e31c42cffb8870a879eaf309bb4f31b00e40cc57c2e30` |
| `DeIndicator.vue` | `9429ff118457c38616ceb801d9d89b2f70a034b72c948b9c155805e6db60150b` |
| `dataVisualization.ts` | `dc0a75b7a4abf308a41473de710c7d137b294c8b4915fe94f859744541cd4082` |
| `Topology-actual-r550.json` | `3e6d224e60aa1c1bfbfed6533803840642696968647713d8b72abb0d50a62afc` |

补读两版driver精确diff、freeze图的8条引用、admission的5条依赖及ContextBootstrap原始意图/本轮目标/写排除、MVP-UI-08/09、Store/API/SFC对应精确调用处。以上依赖摘要匹配。复用已读SGE validation/delta/baseline规则及卡forbidden_claims声明边界。只对本次局部oracle作裁决，不审最终KB/Dashboard/full diff/Stop Gate。

临时只读复算脚本 `/private/tmp/validate-indicator-oldstate-r003.py`，SHA `d861f282c4cfcc5296f728275ef584ca60c1157a2e52a470b1f8c788b3753d9a`。脚本载入全包、独立比较和重建结构，不调用Builder helper作为expected；233项读取/结构/相等性断言均成立，是证据复算而非233个产品测试。大包没有cat到输出。

本报告写前不存在；本轮只新增指定review，未暂存或提交，既有工作区修改及冻结输入不变。

## 冻结、初始失败和同case恢复

14:42:05.051804Z冻结r001 reader/driver/plan/contract。第一次14:44:12.546—14:44:32.340Z记录selection TimeoutError：寻找target父级 `.de-drag-top` 超时；finally恢复时同selector再次超时。该包只有source_copied和discarded_exit，无已执行candidate_abort或完整before/after，不算产品RED或产品恢复失败。

14:46:09.810224Z冻结r002，reader和case identity不变。独立driver diff只有：目标title存在则点，否则tile相对70/80点击；r002输出/invocation/PNG版本路径及自读hash路径相应变化。没有改expected、oracle、目标/候选阈值或生产源码。旧失败原字节及引用继续保留。

invocation-r002两行实际started/finished为14:46:48.818Z/14:47:03.662Z；前后reader SHA均9a1c298a…cc06e、driver均a9df5f9e…2982b，finished.failure=null且output SHA与9MB原包匹配。工具冻结早于执行，前后工具hash未漂移；这不自动证明产品通过，下面继续用原包核验。

## 独立期望、真实前态与候选失败

CSV以完整六店集合独立计算：amount>200命中14行、合6761；amount>500命中8行、合5093。与plan、实际旧数据/恢复数据一致，未用UI当前值生成expected。

| 时点/步骤 | 实际证据 |
| --- | --- |
| 初始复制14:46:49.236Z | source500完整树进入clip；后续target正常编辑200并点击更新图表数据 |
| 真实旧HTTP14:46:50.309Z | indicator请求200，HTTP200/code0，tableRow amount6761；随后before.details与native文本均为6761 |
| before14:46:58.123Z | target view完整200树，active Vue UID6662、wrapper UID6661，native connected，显示6,761/amount；用户前态已含修改，不能要求恢复成先前clean500 |
| 确认14:46:58.506Z | 正常专用paste确认“替换全部过滤条件？” |
| 唯一候选请求14:46:58.777Z | testRequest区间 **[8,9)**，仅一条POST chartData/getData，id7520752064427724800、dataset1312472054565572608、完整customFilter与旧clip.tree全量相等，首叶500 |
| 受控abort14:46:58.778Z | candidate_abort事件完整request与上条body逐项一致；对应唯一requestfailed，net::ERR_FAILED，完整body一致；不是服务器SQL故障 |
| after14:46:59.597Z | queryObservation logical1/failure/paste_failed、responseData=null；target仍完整200/6761、旧clip完整不变，18类前后投影全部相等 |

测试请求/失败索引分别8→9、0→1。全窗口另有正常setup和恢复请求，不能把测试候选1扩写成整段只有1次HTTP。after.queryObservation记录本次failure，before无queryObservation，诊断变化符合一次失败，不要求整个诊断对象假装完全不变。

**两样本稳定的证据上限：** 冻结driver在setup响应后等待6500ms、捕获baseline1，再等1000ms捕获before，比较排除at/monotonic的全部投影；不等会留baselineUnstable并停止。本包baselineSamplesEqual=true、无执行异常，与该协议相符。**但相等分支未保存baseline1完整原快照**，原包只有before；所以本Validator不能从两份独立归档baseline原数据重新比较稳定性。这里接纳已保留before的真实200/6761及before/after完整投影，不把producer布尔当两份原始基线已独立复算。

## 18类投影与描述全量检查

18字段集合与summary.exact_projection_equal_fields、raw.comparisons集合完全一致；每项由before/after原对象独立深比较，全部相等，未信任comparisons自报代替。

| 投影 | 独立结果及本分支范围 |
| --- | --- |
| identity | resource/chart/wrapperUid6661/nativeUid6662/nativeFile逐项相等 |
| view | Store实际target view完整value、ownKeys、undefined等相等；customFilter200 |
| element | wrapper实际element完整描述相等 |
| details | canvasViewDataInfo[target] present=true，完整数据/字段目录/series/tableRow等相等，amount6761 |
| origin | present=false、根undefined投影保持缺失；不是已验证真实origin内容 |
| lastRequest | present=true，实际lastViewRequestInfo完整描述相等，包括outer/web undefined |
| pure | present=false，保持缺失；不当S2 pure data通过 |
| page | pageInfo present=false，保持缺失；不当分页状态已覆盖 |
| instanceMapPresent | false→false，仅此target实例映射键缺失，不是所有实例map对象全量保持 |
| rendererState | DeIndicator实际state五键pointParam/data/loading/totalItems/trackBarStyle完整相等 |
| rendererError | isError=false、errMsg空串，完整相等 |
| nativeDom | connected=true、outerHTML/text及18个WeakMap节点ID/type/name完整相同 |
| snapshotState | snapshotStore.$state完整raw描述和全部3条snapshotData相等 |
| otherViews | 其余4个view配置完整描述相等；不推成其它组件全部缓存/渲染实例已测 |
| otherElements | 其余4个component配置完整描述相等 |
| wrapperDrill | 实际wrapper drillFilters完整描述相等 |
| chartExtRequest | 实际wrapper上下文完整描述相等，包含缺键/undefined信息 |
| observedCapabilities | globalEmitter=true、eventBus=false、sdkDestroyCalls=NOT_INSTRUMENTED均相同，保留未instrument状态 |

before/after/restored各14份describe，共 **42份descriptor**全量核验：重建value所有对象/数组路径与键集合，按undefinedPaths补回JSON省略的undefined；共43条undefined记录，aliases与nonJson总计均0，结构一致。根undefined的slot记录value:null是序列化占位，与present=false/undefinedPaths=['$']一起解释，不冒充“存在且为null”。descriptor的aliases/nonJson来自冻结reader的WeakMap/类型扫描；JSON自身无法重建实际对象别名，所以只核元数据、原采集代码及其前后一致，不把alias空数组提升为全运行域无别名。

另外7份source/clip树描述同样全量校验ownKeys/undefined；before/after完整clip还与source_copied.clipboard相等，保留tableId、createdAt、revision。正常编辑target造成的timeValue=undefined等形状原样保留，未合并missing/null/undefined来凑相等。

snapshot原值不只检查索引或摘要：snapshotIndex2、snapshotData3条、styleChangeTimes2、cacheStyleChangeTimes0、snapshotCacheTimes0、snapshotDisableTime1和完整cacheViewIdInfo列表都相等；所有snapshot内容同样比较。**这是delta不增加，不是baseline没有dirty或缓存ID**；cache中本来仍列target calc及all/source render，不能改写成所有列表为空。

## 实例、原图、总线和持久请求

实际查看两张原PNG，均为 **419×316、8-bit RGB、无交错**，可见整张目标tile的6,761/amount及边框/控制点；独立核签名/chunk CRC/zlib及文件字节，before/after逐字节相等。两文件SHA均 `5c023fd0fef6a18ba6d661ebdab6752015159614214316adcd825b570db42a30`。比第二轮28×17数字span增加了本次目标tile范围，仍不是整个canvas/page或其它组件画面验收，不用新图补回旧r001缺失图。

native DOM通过reader持有的WeakMap给真实节点赋只读观测ID，before/after的18节点19—36一致；native UID6662/wrapper6661也相同，HTML/text相同，支持两个端点保留原active实例/节点。没有instrument SDK destroy或每个瞬时生命周期调用，不能把UID/DOM端点相同当destroy调用次数0，也不覆盖全部中间竞态。

全量请求记录34条，reader driver只收主page `/api/` 且排除login/logout/auth路径。按实际API源码的 `/dataVisualization/save`、`saveCanvas`、`updateCanvas` 精确路径核，**观察窗口三类请求均0**；不是所有浏览器/所有后台数据库零写审计。所有34条包含setup、候选和恢复，不是仅取失败窗口来隐藏save。

实际wildcard emitter记录恰一条 `paste-chart-filter-7520752064427724800` 入口事件，channel=emitter；不能写“总线0”。该暴露通道未记录其它type，但未记录payload，eventBus未暴露，不能声称全部发布/刷新/所有总线都无事件。

## 实际源码读路径与恢复

wrapper的setupState提供dvMainStore/snapshotStore、chartComponent.$；reader拒绝错误chart id、非DeIndicator或非connected节点。dvMain源码确认details/origin/lastRequest/pure/instanceMap对应读写映射；snapshot.ts确认$state含cache/index/raw snapshotData；DeIndicator state/indicatorRef/错误状态为所读组件实际对象，不是另造mirror expected。

views/index.vue中候选clone后经query准备，只有ready/current复核成功才进入canonical tree、details/lastRequest、chartComponent与snapshot发布段；catch返回paste_failed。源码方向与本受控网络失败投影相符，但未从源码填候选render/destroy/global publication的未测计数。

finally按**相同routePattern和abortCandidate函数对象**await unroute，随后正常工具栏退出，14:47:00.309Z panel URL/editorCount0；14:47:00.465Z真实findById HTTP200/code0、request/response资源均1312476889213964288、resourceTable=snapshot，indicator7520752064427724800的原dataset和完整500树与clip.tree相同。恢复实际getData也有HTTP200/code0、amount5093。14:47:03.494Z恢复诊断clip空/dialogs0；restored采集为原500/5,093、字段就绪，新实例UID12687符合重开，不与失败前后UID比较混用。

routeRemoved/listenersRemoved/recordingStopped为true，结合冻结driver和后续成功HTTP支持本page精确撤销流程；本Validator未实时访问route registry。UI emitter unsubscribe使用catch吞错、listenersRemoved标志仍统一写true，故不把它当全部订阅零泄漏的独立证明；Node request/response/requestfailed/pageerror off调用在源码中明确。恢复时dialogs0只覆盖该时点，不保证未来无迟到提示。未记录draft_prompt事件，不凭driver条件分支存在就声称本次实际点击了“否”。

## 全部发现及原问题处置

**新增证据矛盾阻断：0。** 主要结论与原始数据及独立CSV相符；没有通过删除差异、修改PNG/Store或改变oracle制造通过。

**RNV3-N01，非阻断：第一份稳定baseline未归档。** 可核冻结协议与执行结果，但不能独立重算两份baseline原对象相等。保留该限制，已有before/after18投影和真实旧值不作废，不为凑全绿新增第4轮。

**RNV3-N02，原oracle残余：缺失投影不能算已覆盖内容。** origin/pure/page/instanceMap在此indicator分支没有内容，SDK destroy未instrument、eventBus未暴露；18项“相等”包括这些缺失状态，不能称18种有效内容都运行过。其它组件/分支仍未测。

**RNV3-N03，非阻断：总线与清理上限。** 一个paste入口事件必须保留，不能将其改成所有总线0。精确unroute协议/flag有证据，实时registry与UI emitter清理成功没有独立读回，不能推成全局环境清理完毕。

**RNV3-N04，原受控故障边界：** 唯一candidate经browser route.abort导致net::ERR_FAILED，非真实后端异常；前后端点投影/PNG相等不排除全部瞬时副作用/并发竞态，单indicator不代表49类型。34条API无三类保存路径只覆盖本page/本窗口。

| 原问题 | 本最终轮处置 |
| --- | --- |
| RNV-F01旧两图缺失/不等 | 本次fresh网络失败目标整tile图相同；旧缺失图和旧瞬间仍不追认，第二轮stale数字裁图边界保留 |
| RNV-N02初cancel dirty变化 | 未重做，保留原未知；不借本case解释取消 |
| RNV-N03全old-state未覆盖 | 此indicator的18个已记录投影新增有界支持；缺失分支、SDK/bus、其它组件/场景仍PARTIAL |
| RNV-N04故障/DEV权限语义 | route.abort和显式DEV允许仍为测试上下文，不是真实服务端/权限通过 |
| RNV-N05恢复清理 | 新findById/getData/UID重开及精确unroute有进展，实时registry/全部listener保证未覆盖 |
| RNV-N06地图ubo等 | 新errors=[]不修复历史ubo、明细/稳定画面等地图残余 |

问题/未知均已一次列全，没有在首问题早退。没有要求新框架或机械重跑原八场景。

## 已检查无问题、未查原因和最终准入预测

已检查无问题：卡/prompt/23 refs、freeze图/driver差异/实际invocation前后hash、原失败保留、同case恢复、独立CSV6761/5093、全9MB18投影、42descriptor/7树描述/snapshot raw、实际UID和18节点端点、两张原PNG、候选完整request/abort/失败/逻辑1、旧200/6761和clip保留、34非auth API三保存路径0、emitter原始入口事件、真实退出/find完整树/5093恢复、声明上限。

未查：独立UI/DB/API操作、第一份未保存baseline原值、SDK destroy计数、未暴露eventBus、缺失分支的真实origin/pure/page/instance内容、所有瞬时副作用/竞态、其它组件数据/实例和全页面像素、真实后端异常/权限、当前route registry/全部listener状态、原旧缺失图、完整38/49与Goal最终收尾；原因是本轮只读补指定indicator维度，所需原始观察未存在，未用静态或自报补PASS。

**最终准入预测：** 可吸收“原负向包第3/3轮，RNV-N03此indicator受控网络失败的18类已捕获旧状态投影、目标tile像素和限定持久请求窗口得到独立复算支持”。原整包继续PARTIAL，不声明全组件/全old-state/八场景全部通过。

**本交付物三轮预算已耗尽，不开第4轮，不换名或新包重置本次预算。** 现有未覆盖项按原分母保留；后续可继续不依赖这些验收结论的独立工作，或由主Agent把必要scope/oracle决策反馈给用户，不机械轮询/反复送审来制造完成。

当前不能声明完整MVP、49/49完整类型、真实权限、全部零副作用或Goal完成。本报告不是最终closeout或Stop Gate终态凭据。
