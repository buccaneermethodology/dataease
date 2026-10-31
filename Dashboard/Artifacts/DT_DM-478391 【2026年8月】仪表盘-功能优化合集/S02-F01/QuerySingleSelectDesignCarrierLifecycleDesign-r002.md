# 普通文本单选设计载体来源与生命周期 r002

**结论：NOT_READY_FOR_PRODUCT_LIFECYCLE_ADMISSION。** 可以固定新建会话内来源、候选持有方式及保存捕获的不变量；当前源码尚未提供同commit发布、历史失活或同commit保存接线，不能将离线模型与枚举观察组件通过升级为产品生命周期准入。本轮没有生成Builder。

接收端card canonical `0012a1415bd59f1381263fa5380d68cf3cb28a5bd98a88782054780b207883f8` validate/render退出0；Context validate退出0，required-read摘要无漂移。仅新增本r002及Fixtures-r002，保留旧证据。

## 当前来源事实和可受理子集

本轮复核当前绑定的dvMain、snapshot、配置确认、Component/Select、useFilter、canvasSave实际源码；条件扩读仅dashboard新建与DeCanvas直接创建链。

`views/dashboard/index.vue`无resourceId且opt=create的分支中，只有非template路径可作为本新会话的创建入口；`dvMain.createInit:1868–1913`清空组件根。`DeCanvas.handleNewFromCanvasMain:97–118`从组件列表生成id并addComponent，随后排布局与快照缓存。空VQuery的propValue=''不能送QCARRIER当完整设计。旧文档删空、模板、缓存、后端加载均不因根为空获得新建来源。

普通文本单选仍限定已有QCARRIER单条件/空cascade域，首次完整确认才产生设计载体；后续只有同session、同组件、明确配置确认能更新。配置草稿、用户运行选择、外参、枚举响应、样式编辑不取得设计更新权。新状态的origin字符串只是见证标签，不能证明上述受控调用链。

## 持有与持久化边界：只冻结不泄漏来源元数据的候选

复用CREATE-003候选：dvMain实例关联私有会话；`WeakMap<toRaw(component), Capsule>`持有设计，内存documentEpoch与组件raw身份共同约束。Capsule含componentId、revision、commitId和深度独立design。get必须绑定当前唯一对象，不只按ID复用；来源只能由受控新建/确认创建。

**不把Capsule挂到可枚举component root或state对象中。** `canvasUtils.ts:845–864`会深拷贝并JSON.stringify整个组件根，没有carrier字段排除；`snapshot.ts:196–220`深拷贝全根，还把newSnapshot写入wsCache。因此“给root加carrier属性”会扩大已有保存/缓存暴露面。Fixtures013是明确禁止方案的静态反例，不表示已实施或已发现真实敏感数据泄露。

历史元信息采用内存 `WeakMap<rawSnapshotRecord, Manifest>` 候选，关联实际追加的历史对象；不加进会被wsCache保存的newSnapshot普通属性。此选择的必要代价是：重开/缓存反序列化没有来源证明，新能力不自动恢复；保存后的design字段即使是A，也不能被认定恢复了原始carrier权威。Fixtures011允许普通载荷加载，但promotion=NOT_READY，不能借本安全子集关闭完整保存重开义务。

上述是明确候选设计选择，当前代码不存在这些会话/Capsule/Manifest接线；也不改变原配置JSON的既有权限保护。真实权限保持BLOCKED/NOT_RUN，私有WeakMap不是权限验收。

## 同commit发布与版本规则

首次确认候选先JSON规范化并调用现有QCARRIER生成独立design/runtime；按当前最新root保留外层样式，只替换propValue/cascade，预绑定新raw与Capsule，再同步单槽发布。首个成功确认为revision1/commit1，后续明确确认D为revision2/commit2；revision是会话单调提交序号，commitId与该revision同次分配。取消、校验失败及准备失败无发布/无revision/无新增快照或预览；运行/外参不递增设计revision。

当前 `QueryConditionConfiguration.vue:1591–1629`仍先propValue=[]，nextTick后分槽写入并标记缓存，再下一tick发reRenderAll/queryData。这不是上述同步发布，Component props/旧引用也没有整体载体事务证明。**LC2-PUBLISH-01：产品同commit发布和消费者门控仍NOT_READY。** 不得把pure model的ok/state当Vue观察原子性，不让Builder自行决定调度与引用更新。

本轮读取的QOBS标签独立验证仅证明PA-001..005受控Select组件时序与EL-001/002独立Element展示各自的窄行为；它明确不是两者产品集成、保存/权限或carrier生命周期。因此不把此前枚举问题重复当作未修复，也不据此消除本发布缺口。

## snapshot、undo/redo与缺carrier失活

实际recordSnapshotCache仅累计，满足dataPrepare/非移动/时间门槛时recordSnapshot才追加。候选Manifest必须在这次真实捕获时与全根配对，不能“确认一次就强制追加一次”，不能独立把carrier版本写进已有旧历史。

有效undo/redo候选：在指针变化前读取所选原历史对象Manifest并准备新root/Capsule；恢复完整所选历史根（含样式，不采用保存保最新样式规则）；分配新的单调revision/commit，指针移动一次，无snapshot追加、不截断redo尾。原身份字段保护、事件及dirty行为保留。边界no-op不分配commit。Fixtures006只表达此候选，不宣称当前实现。

缺/不可信Manifest：在指针移动及任何原setter前使新增carrier能力失活，旧token不可再用，随后保留原全根恢复与原事件，普通保存不被新能力禁止；不能从被外参污染的历史X逆推A/D。reader在原恢复前、中、后均不可用。Fixtures007给完整失活与恢复结果。

**LC2-HISTORY-01：当前snapshot.undo/redo先移动指针，snapshotPublish多setter恢复且按id重绑curComponent，无Manifest屏障。** 候选失活顺序尚无源码实现/实际观察验证；未知或损坏历史不通过清空历史、禁用undo或覆盖用户编辑规避。新建会话也会撤销，因此此项不是只有旧文档才需要处理。

## save capture：同一捕获点保最新根，不混新旧commit

候选新增capture只在session受管、目标唯一存在、carrier revision/commit与当前发布一致且没有未登记设计改动时工作。在同一同步任务中固定会话引用、深拷贝**当前最新**组件根及完整保存所需数据；仅在副本overlay同commit design的propValue/cascade，保留最新宽度/样式及其他组件。运行C与外参X不能写回design，绝不回放确认时旧root；失败无新增capture请求、不改变现场。它不是自动保存。

当前 `canvasSaveWithParams:843–915`先removeGroupArea，随后cloneDeep当前componentData、序列化组件和canvasStyle，但canvasViewInfo/appData作为引用进入canvasInfo；再进行可异步的名称检查并发送，回包无条件resetStyleChangeTimes。故不能声称当前函数已作“全payload独立capture”或“回包仅清已保存版本dirty”。真实调用方editor/index.vue:1677继续调用该入口。

Fixtures008：最新宽550、runtime C，候选capture输出design A且宽550不变；输入root仍C，metadata不进payload。009：capture commit1后用户确认D/宽580，发送仍为捕获的A/550，不把新carrier D拼进旧root；回包后新编辑dirty应保持。此dirty规则是r007候选方向，**当前源码无条件reset与其不同**，不能写成已实现事实。010版本不一致则新增capture不可用，不在此决定或改变原普通保存政策。

**LC2-SAVE-01：同commit overlay、其他保存字段深度捕获、回包完整payload对账尚未实现/冻结精确接线。** 要安全实现包含保存返回的子集，必须明确这里三者，不只在JSON.stringify前替换一次propValue。也不能只凭query revision相同清掉样式dirty。当前新建子集并不使保存等待期间的并发编辑不可达。

**LC2-PERSIST-01：来源元数据不持久化的候选与重开后自动受管不相容。** 本轮选择不扩大序列化字段，故只能给会话内候选；若目标要求重开后仍自动受管，需要额外有证持久来源方案，不能自动将读取的普通JSON认证为旧原意。该未就绪不会取消Goal的保存/回显义务。

## Fixtures与验证

14条包含完整本合同状态投影/事件/预期：创建pending、首次确认、失败取消、外参X、明确设计D、有效undo、缺sidecar失活、最新根capture、异步等待中编辑、commit不符、重开无来源、当前源码运行JSON保存观察、直接挂元数据暴露反例及当前确认空窗反例。后两项的null是未准入/禁止方案标记，不是产品函数返回协议。

14个完整JSON值在同文件按canonical SHA引用去重，展开不依赖外部补值；重复既有QCARRIER/QE2E的测试库未复制。source refs绑定输入及新建直接调用链。

已做JSON解析、内容寻址展开/摘要检查、取消状态相等、外参carrier不变、保存仅overlay两槽/保宽550、current root不变、恢复不追加、缺carrier不可用等构造自检。未运行Vue/Store/snapshot/保存网络/数据库，未产生新的独立Validation。QCARRIER/QE2E已有有界结论及各自历史证据限制保留，不重新追认为产品通过。

下一步仅独立审查本r002对四个具体边界的裁定，不生成Builder、不再扩大来源全域调查。Goal10项AC＋14项F01＋Q066/Q067＝26项完整保留；真实权限BLOCKED/NOT_RUN，S01不变。
