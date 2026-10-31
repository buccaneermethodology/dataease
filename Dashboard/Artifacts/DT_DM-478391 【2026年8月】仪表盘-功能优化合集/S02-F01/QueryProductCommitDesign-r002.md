# 查询组件过滤复制粘贴产品提交合同 r002

状态：`DESIGN_REVISION_CANDIDATE_REVIEW_REQUIRED`。本修订回应 QPCR-01..06；它没有冻结完整产品 schema，也没有发放产品 UI/Store 准入。Goal 分母维持 10 项 AC、26 项 must-have、16 项产品义务，`Scope Delta: none`。

## 本次产品切片与原范围

计划切片仍是普通文本单选查询条件在两个查询组件之间复制并整体替换目标过滤树，成功后按现有流程即时预览、用户正常保存后持久化。切片的当前 owner 前置条件精确为：目标是当前 `querySingleSelectLifecycle` 所拥有的顶层 VQuery；session `phase=open`；`currentComponent` 与当前根中唯一同 ID 对象为同一个受管对象；顶层 VQuery 数量为 1；来源和目标各只有一个普通文本单选条件且 `cascade=[]`。这借用现有 `registerPendingQuerySingleSelect()` 单顶层检查作为有界运行条件。其他组件数、Group/DeTabs、树、参数、多条件、图表源和图表目标仍在父 Goal 分母内，不能被此窄切片永久拒绝或关闭。

用户已裁定迟到枚举缺少新选 C 时只再核对一次；核对结束即关闭 loading；仍缺时保留 C 并显示无效。复制来的默认值 A 缺少目标枚举时是另一条写前规则：保留无效配置意图、阻止确认与提交、目标和副作用不变，不能借用 late-C 策略提交。

## QPCR finding disposition

| Finding | r002 处置 | 仍需复审或外部条件 |
|---|---|---|
| QPCR-01 完整事务 oracle | Cases r002 定义 RFC 6901 JSON Pointer、上游文件摘要、exact pointer 和本地 patch 顺序；删除含糊 `$ref` 和 `or` 分支。每个可执行拒绝用例只有一个首错阶段。 | 当前成功路径的真实授权输入未定义，因此成功发布模型只可作条件模型，不能标作可运行 PASS oracle。独立审查需确认展开规则与状态观察足以唯一判定。 |
| QPCR-02 owner / 多组件协调 | 本候选只讨论已打开、唯一顶层 VQuery 的受管 owner；使用 `readQuerySingleSelectDesign`、`prepareQuerySingleSelectConfirmation`、`commitQuerySingleSelectConfirmation` 持有的 capsule、revision、commitId 与完整根。不得直接 `setComponentData` 后保留旧 raw owner。 | 当前 lifecycle callbacks 会在提交期替换根、选择组件并更新 owner；所有产品调用测试仍未运行。其他画布形态继续开放。 |
| QPCR-03 快照 / 预览效果 | 计数拆成 `snapshotCacheMark`、`historyAppend`、`previewEventDispatch`、`queryDataEventDispatch`、`downstreamQueryRequest`。`recordSnapshotCache('confirmClick')` 仅同步增加待缓存计数；`snapshotCatchToStore → recordSnapshot` 才可能追加历史，受 `dataPrepareState`、移动端与 `snapshotDisableTime` 门槛约束。预览是一次事件调度，实际网络请求按关联图表扇出计数，不能固定为 1。 | commit 后异步预览失败不是写前拒绝，不能宣称目标回滚；应保留已发布本地状态并给失败提示/同 commit 重试语义。物理历史 append 和真实查询计数须由产品集成测试观察。 |
| QPCR-04 默认枚举门槛 | QPP candidate 必须携带同目标组件、revision、identity generation 和精确 requestKey 绑定的完整枚举证据；复制默认 A 不存在时在 `DEFAULT_ENUM/DEFAULT_NOT_FOUND` 结束，不能展示确认框。 | 当前 evidence 结构是输入数据，不是权限票据；应复核它如何由目标枚举响应产生、如何证明新鲜，并覆盖默认 A 与用户新选 C 两种不同路径。 |
| QPCR-05 候选与引用身份 | 只消费 WeakMap 发出的 QPP handle，经 `revalidate` 返回的新深拷贝候选；target component ID、完整目标根 digest、目标 revision、source/target components、枚举证据摘要均绑定。准备后任何依赖变化均需重新准备并再次确认。字段/图表映射使用 QTARGET r008 的唯一 ID 计划，不按名称回退。 | 当前 QPP handle 未证明可信 source producer、目标 owner raw identity 或授权主体。产品 adapter 必须再绑定 lifecycle epoch/revision 和当前主体。 |
| QPCR-06 真实授权契约 | 保留为实现阻塞。source 配置查看/复制、数据集访问和目标编辑三种权限必须先绑定可用公开契约；不能以 `editMode`、按钮可见性、字段目录、standalone 或 mock 推断。 | `PermissionEnvironment.md` 记录没有已授权 XPack 来源或真实多用户隔离实例。得到公开契约及合法隔离环境前，不挂载可暴露配置或可提交的 UI/Store action；真实权限验收保持 `BLOCKED / NOT_RUN`。 |

## 允许讨论的 owner-bound 协议

1. **授权前读取门槛。** 读取来源过滤配置之前必须由当前公开权限契约确认主体、组织、来源资源与查看操作。目标写入前必须另验数据集访问和目标编辑。当前 QPCR-06 未解除，本步骤不可实现成开放入口。
2. **准备。** 在受管 owner `phase=open` 时读取经过 owner 认可的设计态源/目标快照，绑定 lifecycle `epoch/revision`、目标组件 raw identity、画布完整根 digest、来源内容摘要、枚举 requestKey 和候选摘要。QPP/QTARGET 只做纯准备；不改 Store、草稿、快照、预览或查询。
3. **确认及复验。** 仅目标非空时显示覆盖确认。取消不变。确认后重新获取真实授权和所需目标枚举；再比较 owner epoch/revision、目标唯一性、完整根、source/target components 和候选 handle。任一检查失败在发布前返回单一 `stage/reason`，不发候选、不发布、不记缓存、不触发预览。
4. **准备生命周期 capsule。** 将精确重建后的完整目标 `{propValue,cascade}` 放入 `prepareQuerySingleSelectConfirmation({component,queryRoot,outerRoot,componentId,expectedRevision})`。只有返回的受管 preparation 才能交给 `commitQuerySingleSelectConfirmation`；不得从普通 JSON 重造 owner capability。
5. **同步本地发布。** 当前 owner commit 的唯一同步 callback 顺序是 `replaceRoot`、`select`、owner capsule/revision/commitId 切换、然后 `publishEvents`。具体粘贴 action 尚未实现。所有可能失败的解析、重建、枚举、权限与依赖复验必须在进入该同步段之前完成。发布 callback 内不 await、不调用网络、不调用会再次改 Store 的业务 watcher。意外 callback 异常可能发生在根已替换之后；不把它伪装成零变化拒绝，owner 必须失效，报告为提交后异常并保留可观察现状。
6. **快照排队与预览。** 发布成功后在一次 `publishEvents` 中调用一次 `recordSnapshotCache('confirmClick')`，使受管文档 dirty，并排队一个快照缓存标记；这不是当场 `historyAppend=1`。现有单选确认通过 `nextTick` 再核对 owner epoch/revision/commitId 和 `querySingleSelectAllows()`，随后各派发一次 `reRenderAll` 与 `queryData` 事件。完整适配后需按真实映射图表观察 query fan-out。
7. **提交后故障。** 预览派发前的失效检查是零副作用拒绝；已派发后网络查询失败不回滚已经发布的本地设计。对同一 commitId 的预览重试不得再发布根或重复记录快照。正常保存独立发生；仅保存成功且重开回读相同配置才证明持久化。

现有 `QueryConditionConfiguration.vue` 已有相近的 managed confirmation 源码路径，但该路径是配置确认，不等于过滤粘贴事务已接入。其 `recordSnapshotCache` 只排队，`snapshot.ts` 后续 cache flush 才可能执行物理 history append。r002 不将这两者合并为“恰有一个历史快照”。

## 错误优先级与 oracle 范围

写前错误顺序固定为：`SOURCE_READ_AUTH → ENVELOPE → SOURCE_SHAPE → TARGET_OWNER → TARGET_IDENTITY/REVISION → ADAPTER/ENUM_DEFAULT → USER_CANCEL → REAUTHORIZE → REVALIDATE_CANDIDATE → PREPARE_OWNER_CAPSULE`。公开错误消息仍须在权限契约可用后确定；权限拒绝不可泄漏字段或来源条件内容。每例只触发一个首错，双错误优先级单独列为独立用例。

写前拒绝/取消 oracle 对完整目标根和引用、owner epoch/revision/commitId、selection、snapshot cache/index/history、预览与查询调度、持久化请求均保持不变。成功模型要求单一根替换且仅目标 design 被替换、运行态按已审 adapter 初始化，source 与 target 无共享引用；一次 owner revision/commitId 前进、一次 snapshot cache mark、一次预览调度，不自动保存。物理 history append 及查询请求数在对应集成观察点计数，不由纯 helper fixture 冒充。

本次 fixtures r002 为合同候选，不是产品测试完成证据。QTARGET 引用必须按冻结摘要和 pointer 展开后再断言；未绑定真实 permission provider 的成功模型处于 `NOT_RUN`，不准用伪造授权结构补齐成功输入。

## Builder 门槛与 claim ceiling

本修订需独立审查明确处理六个 QPCR finding，且 owner/快照/预览协议和用例能从当前源码逐步复现，才考虑一个新的 bounded product action Builder。即使独立设计通过，公开授权契约缺失仍阻止任何可暴露来源过滤配置或可发布目标的 UI/Store action。权限模块与隔离环境准备后，另行补主体/组织/资源/操作绑定和真实拒绝/撤权测试。

此设计候选不表示过滤复制已支持、默认枚举已完整验证、历史/预览/保存已验收，也不关闭完整 schema、图表复制、跨标签、TTL/容量、真实权限、10项 Goal AC、16项产品义务或 S10 移交。
