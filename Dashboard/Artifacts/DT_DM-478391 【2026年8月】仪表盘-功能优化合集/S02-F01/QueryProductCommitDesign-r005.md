# 查询组件过滤复制粘贴产品提交合同 r005

状态：`DESIGN_REVISION_CANDIDATE_REVIEW_REQUIRED`。本修订回应独立审查 R2-01..03；它仍未冻结完整产品 schema，也没有发放产品 UI/Store 准入。Goal 分母维持 10 项 AC、26 项 must-have、16 项产品义务，`Scope Delta: none`。

## 本次产品切片与原范围

计划切片仍是普通文本单选查询条件在两个查询组件之间复制并整体替换目标过滤树，成功后按现有流程即时预览、用户正常保存后持久化。切片的当前 owner 前置条件精确为：目标是当前 `querySingleSelectLifecycle` 所拥有的顶层 VQuery；session `phase=open`；`currentComponent` 与当前根中唯一同 ID 对象为同一个受管对象；顶层 VQuery 数量为 1；来源和目标各只有一个普通文本单选条件且 `cascade=[]`。这借用现有 `registerPendingQuerySingleSelect()` 单顶层检查作为有界运行条件。其他组件数、Group/DeTabs、树、参数、多条件、图表源和图表目标仍在父 Goal 分母内，不能被此窄切片永久拒绝或关闭。

用户已裁定迟到枚举缺少新选 C 时只再核对一次；核对结束即关闭 loading；仍缺时保留 C 并显示无效。复制来的默认值 A 缺少目标枚举时是另一条写前规则：保留无效配置意图、阻止确认与提交、目标和副作用不变，不能借用 late-C 策略提交。

## r002 独立审查 finding disposition

| Finding | r003 处置 |
|---|---|
| R2-01 carrier 输入不兼容 | QPC-009 现在明确先从 QTARGET design 载荷复制完整普通单选条件，仅在 owner carrier 输入副本补 `mapValue: []` 作为合法的设计输入。调用 `prepareQuerySingleSelectCarrier` 得到的 design 移除运行态字段；runtime 严格由当前配置默认值 `defaultValue/defaultMapValue` 生成。禁止从旧目标 runtime 继承值或任意补业务默认值。成功模型逐字段标明来源。 |
| R2-02 提交后失效被误写为零副作用 | nextTick 复核只控制后续 `reRenderAll/queryData` dispatch。复核失败时，已完成的根替换、selection、owner revision/commitId、缓存调用与两次editGeneration变化均保持；该状态记为 `COMMITTED_PREVIEW_SUPPRESSED`，不记成写前拒绝，不承诺回滚。当前实现核对 phase/epoch/revision/raw identity/allowQuery；commitId 等值核对属于 QPC 新合同要求，不宣称已由当前调用点直接检查。 |
| R2-03 本地事务状态及 cache 门槛不完整 | Cases r004 使用固定 `initial_state`、完整 `initial_state_digest` 与每例 `expected_state`，精确记录 owner、完整 outerRoot、raw identity、selection、cache/index/history、dispatch、请求扇出与持久化；canonical JSON 摘要按本地冻结规则（递归排序对象键、保留数组顺序、UTF-8、无空格）计算。`recordSnapshotCache` 调用数和 `snapshotCacheTimes` 增量分开；`dataPrepareState=false` 时调用仍为1但增量为0。 |

## r003 独立审查 R3 findings disposition

| Finding | r004 修订 |
|---|---|
| R3-01 cache 与 editGeneration 少计 | Cases r004 精确匹配源码：owner commit 先将 editGeneration +1；当 `dataPrepareState=true` 时 `recordSnapshotCache` 内的 `markQuerySingleSelectDocumentEdited` 再 +1，且 cacheTimes +1；为 false 时 cacheTimes 与该代次都不增。QPC-009/010/012 的代次增量为2，QPC-013为1。 |
| R3-02 用例状态与输入矛盾 | QPC-003 将top-level query count/raw owner身份同步到2/非目标raw；QPC-004基线为revision7并保留revision8 stale输入；QPC-006明确 C、loading、invalid、请求计数1→2；QPC-009 owner注册使用raw-target-v0；QPC-011从已提交dirty状态开始并记录saveSeq、lastAckSeq和server版本不变。每例重算完整初终态digest。 |

## QPCR finding disposition

| Finding | r002 处置 | 仍需复审或外部条件 |
|---|---|---|
| QPCR-01 完整事务 oracle | Cases r004 定义 RFC 6901 JSON Pointer、上游文件摘要及唯一展开规则；可执行写前拒绝各自只有一个首错阶段。r002 的 `or`/缺字段问题由 r003 修订并由 r004 继承，须独立复审。 | 当前成功路径的真实授权输入未定义，因此成功发布模型只可作条件模型，不能标作可运行 PASS oracle。独立审查需确认展开规则与状态观察足以唯一判定。 |
| QPCR-02 owner / 多组件协调 | 本候选的可运行 owner 模型只覆盖新建且尚未保存的画布：`resourceId=null`、`isTemplate=false`、`createInitCompleted=true`、首次 `rootEmpty=true` 后插入唯一顶层 VQuery，再 `registerPending(component,1)`；使用 `readQuerySingleSelectDesign`、`prepareQuerySingleSelectConfirmation`、`commitQuerySingleSelectConfirmation` 持有的 capsule、revision、commitId 与完整根。不得直接 `setComponentData` 后保留旧 raw owner。 | 当前 lifecycle owner 的 `beginSession` 明确拒绝已有 `resourceId` 或非空初始根，故不能认证已保存画布的目标身份。新画布条件模型不能覆盖常见的已保存画布粘贴入口；该入口继续留在原 Goal 分母，必须另有获审的生命周期 owner/现存真实权限上下文支持。当前 lifecycle callbacks 会在提交期替换根、选择组件并更新 owner；所有产品调用测试仍未运行。其他画布形态继续开放。 |
| QPCR-03 快照 / 预览效果 | 计数拆成 `snapshotCacheMark`、`historyAppend`、`previewEventDispatch`、`queryDataEventDispatch`、`downstreamQueryRequest`。`recordSnapshotCache('confirmClick')` 是函数调用；只有 `dataPrepareState=true` 才会增加待缓存计数，`snapshotCatchToStore → recordSnapshot` 才可能追加历史，且还受移动端与 `snapshotDisableTime` 门槛约束。预览是一次事件调度，实际网络请求按关联图表扇出计数，不能固定为 1。 | commit 后异步预览失败不是写前拒绝，不能宣称目标回滚；应保留已发布本地状态并给失败提示/同 commit 重试语义。物理历史 append 和真实查询计数须由产品集成测试观察。 |
| QPCR-04 默认枚举门槛 | QPP candidate 必须携带同目标组件、revision、identity generation 和精确 requestKey 绑定的完整枚举证据；复制默认 A 不存在时在 `DEFAULT_ENUM/DEFAULT_NOT_FOUND` 结束，不能展示确认框。 | 当前 evidence 结构是输入数据，不是权限票据；应复核它如何由目标枚举响应产生、如何证明新鲜，并覆盖默认 A 与用户新选 C 两种不同路径。 |
| QPCR-05 候选与引用身份 | 只消费 WeakMap 发出的 QPP handle，经 `revalidate` 返回的新深拷贝候选；target component ID、完整目标根 digest、目标 revision、source/target components、枚举证据摘要均绑定。准备后任何依赖变化均需重新准备并再次确认。字段/图表映射使用 QTARGET r008 的唯一 ID 计划，不按名称回退。 | 当前 QPP handle 未证明可信 source producer、目标 owner raw identity 或授权主体。产品 adapter 必须再绑定 lifecycle epoch/revision 和当前主体。 |
| QPCR-06 真实授权契约 | 保留为实现阻塞。source 配置查看/复制、数据集访问和目标编辑三种权限必须先绑定可用公开契约；不能以 `editMode`、按钮可见性、字段目录、standalone 或 mock 推断。 | `PermissionEnvironment.md` 记录没有已授权 XPack 来源或真实多用户隔离实例。得到公开契约及合法隔离环境前，不挂载可暴露配置或可提交的 UI/Store action；真实权限验收保持 `BLOCKED / NOT_RUN`。 |

## 允许讨论的 owner-bound 协议

1. **授权前读取门槛。** 读取来源过滤配置之前必须由当前公开权限契约确认主体、组织、来源资源与查看操作。目标写入前必须另验数据集访问和目标编辑。当前 QPCR-06 未解除，本步骤不可实现成开放入口。
2. **准备。** 在受管 owner `phase=open` 时读取经过 owner 认可的设计态源/目标快照，绑定 lifecycle `epoch/revision`、目标组件 raw identity、画布完整根 digest、来源内容摘要、枚举 requestKey 和候选摘要。QPP/QTARGET 只做纯准备；不改 Store、草稿、快照、预览或查询。
3. **确认及复验。** 仅目标非空时显示覆盖确认。取消不变。确认后重新获取真实授权和所需目标枚举；再比较 owner epoch/revision、目标唯一性、完整根、source/target components 和候选 handle。任一检查失败在发布前返回单一 `stage/reason`，不发候选、不发布、不记缓存、不触发预览。
4. **准备生命周期 capsule。** 从唯一绑定的 QPP handle 复验得到 QPPA candidate；其 QTARGET 设计态完整载荷先按 `QuerySingleSelectCarrier` 输入约束复制到 detached `queryRoot`，并显式补 `mapValue: []`（表示未提交运行值，不代表产品默认）。`prepareQuerySingleSelectConfirmation({component,queryRoot,outerRoot,componentId,expectedRevision})` 再调用 carrier：发布的 design 删除 `selectValue/mapValue`，runtime 从同条件的 `defaultValue/defaultMapValue` 生成。目标旧 runtime 不参与生成；默认 A 必须已通过目标完整枚举。只有返回的受管 preparation 才能提交；不得从普通 JSON 重造 owner capability。
5. **同步本地发布。** 当前 owner commit 的唯一同步 callback 顺序是 `replaceRoot`、`select`、owner capsule/revision/commitId 切换、然后 `publishEvents`。具体粘贴 action 尚未实现。所有可能失败的解析、重建、枚举、权限与依赖复验必须在进入该同步段之前完成。发布 callback 内不 await、不调用网络、不调用会再次改 Store 的业务 watcher。意外 callback 异常可能发生在根已替换之后；不把它伪装成零变化拒绝，owner 必须失效，报告为提交后异常并保留可观察现状。
6. **快照调用与预览门控。** 成功发布后在 `publishEvents` 中调用一次 `recordSnapshotCache('confirmClick')`。该调用会先尝试标记受管文档 dirty；仅当 `dataPrepareState=true` 时才增加 `snapshotCacheTimes` 并再次增加 `editGeneration`，否则调用次数为1、增量为0。该计数仍不等于物理 `historyAppend`。当前路径在 `nextTick` 检查 `phase=open`、epoch、revision 和 `querySingleSelectAllows(committedComponent)`；设计候选另要求 expected commitId 仍等于提交回执。门控通过才各派发一次 `reRenderAll` 与 `queryData`。门控失败时仅抑制这两个后续事件；已提交本地状态不撤销。完整适配后需按真实映射图表观察 query fan-out。
7. **提交后故障。** nextTick 门控失败属于已提交后的预览取消/过期：目标完整根、selection、owner revision/commitId 和已发生 cache 调用保持；`reRenderAll/queryData` dispatch 为0，不得报告“目标与所有效果零变化”。重试只允许针对同一 commitId 重新执行预览门控/dispatch，不重新发布根，也不再调用 `recordSnapshotCache`。已派发后网络查询失败不回滚已经发布的本地设计。正常保存独立发生；仅保存成功且重开回读相同配置才证明持久化。

现有 `QueryConditionConfiguration.vue` 已有相近的 managed confirmation 源码路径，但该路径是配置确认，不等于过滤粘贴事务已接入。其 `recordSnapshotCache` 只排队，`snapshot.ts` 后续 cache flush 才可能执行物理 history append。r002 不将这两者合并为“恰有一个历史快照”。

## 错误优先级与 oracle 范围

写前错误顺序固定为：`SOURCE_READ_AUTH → ENVELOPE → SOURCE_SHAPE → TARGET_OWNER → TARGET_IDENTITY/REVISION → ADAPTER/ENUM_DEFAULT → USER_CANCEL → REAUTHORIZE → REVALIDATE_CANDIDATE → PREPARE_OWNER_CAPSULE`。公开错误消息仍须在权限契约可用后确定；权限拒绝不可泄漏字段或来源条件内容。每例只触发一个首错，双错误优先级单独列为独立用例。

写前拒绝/取消 oracle 对完整目标根和引用、owner epoch/revision/commitId、selection、snapshot cache/index/history、预览与查询调度、持久化请求均保持不变。成功模型要求单一根替换且仅目标 design 被替换、运行态按已审 adapter 初始化，source 与 target 无共享引用；一次 owner revision/commitId 前进、一次 snapshot cache mark、一次预览调度，不自动保存。物理 history append 及查询请求数在对应集成观察点计数，不由纯 helper fixture 冒充。

本次 Cases r004 为合同候选，不是产品测试完成证据。QTARGET 引用必须按冻结摘要和 pointer 展开后再断言；未绑定真实 permission provider 的成功模型处于 `NOT_RUN`，不准用伪造授权结构补齐成功输入。

## Builder 门槛与 claim ceiling

本修订需独立审查明确处理六个 QPCR finding，且 owner/快照/预览协议和用例能从当前源码逐步复现，才考虑一个新的 bounded product action Builder。即使独立设计通过，公开授权契约缺失仍阻止任何可暴露来源过滤配置或可发布目标的 UI/Store action。权限模块与隔离环境准备后，另行补主体/组织/资源/操作绑定和真实拒绝/撤权测试。

此设计候选不表示过滤复制已支持、默认枚举已完整验证、历史/预览/保存已验收，也不关闭完整 schema、图表复制、跨标签、TTL/容量、真实权限、10项 Goal AC、16项产品义务或 S10 移交。


## r004 本地完整事务 oracle

`QueryProductCommitCases-r004.json` 为可展开的条件模型。每例明确绑定完整 `initial_state` 或其 content-addressed 精确复用引用，及完整 `expected_state`；预期根使用明确 RFC6901 pointer 和固定转换，不允许缺省、名称回退或隐式 patch。状态面包含：owner phase/epoch/revision/commitId/当前 raw 对象、完整 outerRoot 与非目标对象、selection、snapshot 的 dataPrepareState/cacheTimes/index/history IDs/cache view queues、事件派发次数、下游查询请求计数和持久化调用/版本。拒绝发生在提交前时，这些面逐项完全等于初态；异步失效发生在提交后时，使用独立终态谓词，只要求不派发新预览，保留已经提交的局部状态。

`recordSnapshotCache` 的 oracle 同时断言调用次数、dirty 结果和 cacheTimes 增量；物理 history append 仍由 flush/门槛决定，并只在观察层记录。当前测试夹具中的 linked chart 数量只是效果计数模型，不作为实际产品查询请求数证据。QPC-009 的授权字段继续为 `BLOCKED_EXTERNAL`，因此条件成功转移不是可运行成功用例。

## r004 修订边界

现有 owner 只证明新建空画布条件模型可准备提交，不支持从序列化保存内容重造能力，也不支持把已保存画布误当作受管 owner。已保存画布的 Goal 覆盖继续开放；不能将当前唯一 VQuery 条件解释为对该分母的永久排除。


本版本仅修正状态oracle，不修改源代码、测试或产品入口，不签发 Builder admission。下轮独立审查评估 r004 对 R3-01/R3-02 的状态修正，并确认 R2-01/R2-02 仍关闭、oracle 是否可唯一展开及 Scope/Goal/权限边界是否保持。即使本地设计冻结通过，QPCR-06 仍使来源查看/复制或可提交 UI/Store 激活保持阻塞；只有真实授权公开契约和合法隔离环境可用后，才能启动对应产品入口与多用户验证。


## r005 修订边界

本候选仅回应 QPC r004 独立审查 R4-01..03，并将迟到枚举的终态请求计数显式化；不修改产品源码或测试，不签发 UI/Store 准入。

- QPC-004 将观察窗口固定在并发 owner commit 已完成、旧 prepared revision=7 的确认拒绝之前。初态与终态都记录当前 revision=8、commitId=commit-8、editGeneration=8；确认拒绝不抹掉此前的并发变化。
- QPC-009 输入、初始化 trace 与初始 owner 统一使用同一个 raw-target-v0 对象身份。正常 nextTick 门控仍有效，故完整终态的 reRenderAll/queryData dispatch 均为1，与局部 previewEventDispatch 一致。
- QPC-012 以 commit 后 open owner 为初态，nextTick invalidate 后终态明确为 unmanaged、currentComponentRef=null、tokenGeneration=2；已提交根、selection、dirty 与 editGeneration=2 保留，预览 dispatch 为0。
- QPC-006 明确唯一一次 recheck 发生在转移中，terminal state 的后续请求数为0；核对后结束 loading，仍缺 C 时显示 invalid 并保留 C。

本轮逐例重算全部 28 个初态/终态 canonical digest。目标独立审查需确认 R4-01..03 已关闭、其他用例未漂移、完整 Scope 和权限阻塞保持。即使审查通过，缺少真实授权契约和隔离环境仍禁止可暴露来源配置或可提交 UI/Store action。
