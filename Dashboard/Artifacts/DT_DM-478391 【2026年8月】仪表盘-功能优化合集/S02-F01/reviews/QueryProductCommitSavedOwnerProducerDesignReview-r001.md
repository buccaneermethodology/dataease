# QPC saved-owner Store producer 设计 r001 独立语义复核

## 双结论

**Design Freeze Validity：`PASS_WITH_BOUNDS`，仅限 source-backed producer 边界与能力分类。** 候选正确区分了当前源码事实、提议的唯一 producer 边界和未证实的运行时性质；正常编辑、缓存恢复、copy-as-new、template/create 与 preview 的能力分类没有把相似 Store 数据结构当作相同生命周期。此结论不冻结完整产品事务合同，也不表示 producer 已实现或运行验证。

**Implementation Entry Readiness：`NOT_READY_FOR_PRODUCT_UI_STORE`。** 不批准产品 UI/Store 接线、source-read、target-commit 或权限测试。下一步仅可形成 owner producer 的本地 Store contract/Cases 与精准验证准入材料；真实主体/组织 provider、权限契约及隔离多用户环境未就绪前，读取来源配置和提交目标继续阻塞。

## 复核基础与权威

卡片按指定 SHA-256 `cc282aa4049acc18f56445f3c619135a58b87a9f893fb65c134ad022584e570e` 验证通过。ContextBootstrap 校验通过；21 项 required read 的摘要均与绑定值匹配，`skipped_reads=[])。已读取渲染 prompt，以及设计、Store Producer Trace r001、QPC r005/Cases r005、r006 与其独立复核、owner helper 合同/验证、Goal、PermissionEnvironment、Sessions 和 PreparationStatus。

`Goal.final.json` 是目标与验收权威；分母保持 10 项 AC、26 项 must-have、16 项产品义务，`Scope Delta: none`，S01 独立。QPC Cases r005 是事务状态模型的合同 truth carrier；r006 是边界决定/前序 review；Producer Trace r001 是当前 checkout 的静态源映射；owner helper 源码和 SAVED-CANVAS-OWNER source Validation r002 只覆盖 detached helper 的有限行为。它们不能彼此替代，也不能证明实际 Store producer、用户/组织身份、权限、产品读写、保存重开或运行时效果。

## Boundary Review

### Store producer 来源映射

Producer Trace 引用的主路径与绑定源码相符：

- `dashboard/index.vue` 读取 route/embedded 参数并先调用 `checkPer`；资源加载成功后由 `initLocalCanvasData` 设置 data-ready 并调用 `onInitReady`。
- `canvasUtils.ts` 的正常资源加载先将 API 响应映射为 `dvInfo`、解析组件根/样式/视图，再依次执行 `setComponentData`、`setCanvasStyle`、`updateCurDvInfo`、`setCanvasViewInfo`。这不是一个源码可证的原子 Store action。
- 缓存恢复由 `CanvasCacheDialog` 发事件，Dashboard 读取本地缓存并 `deepCopy`，再经 `snapshotPublish` 依次写入 dvInfo、componentData、样式、视图及相关状态。
- `opt=copy` 使用 `findCopyResource` 路径；template 新建先 `createInit` 再写入模板状态；二者不等于编辑原已保存资源。
- Dashboard unmount 会失效 QSSDH session。源码中没有 saved-owner lifecycle 的产品调用点，也没有发现用户/组织变化驱动该 helper 的实际 producer。

因此，设计把“多 setter 的当前事实”与“未来 Store action 的单一发布边界提议”分开是准确的。候选也没有声称 Pinia 多赋值天然原子，而是要求后续检验 watcher/render 可见性。静态赋值顺序不能证明中间状态不会被观察；API 异步响应是否受 load-generation 门控、Vue raw/代理身份是否稳定、缓存恢复后对象和组件实例的身份关系都未运行观察，仍须保留为未验证项。

### 分支能力与身份/授权轴

设计的分支表与 Trace 一致，边界清楚：

| 分支 | 当前结论 | 复核意见 |
|---|---|---|
| 已保存资源正常编辑 | 加载完成且资源 ID 符合编辑模式后才可成为 producer 候选 | 静态发布链已映射，但实际 Store action、原子可见性与运行时 owner 未实现/未验证 |
| 本地 cache restore | 新发布完成后可建立新 owner generation 的候选 | 只确认当前编辑画布/root 身份；cache 的资源匹配、对象身份和主体授权必须各自复验，owner 不赋予查看权 |
| copy-as-new | 当前合同不支持 | 源资源与新目标资源 ID 的映射没有证据；不得把源 ID 当作目标 owner |
| template / blank create | 不属于 saved-resource owner | 与已保存资源编辑分离；不把模板根或空白创建纳入该 producer |
| preview / onlyPreview / embed | 不在此目标范围 | 不因 Store 相同而推断入口或权限覆盖 |
| 加载失败、ID mismatch、未发布 root、目标不唯一 | 拒绝且失效 | 不 mint owner，不读 source config，不产生目标副作用 |

候选正确区分 resource/route/dvInfo ID、canvas instance/load generation、root/raw target 引用、owner generation/token、QSSDH epoch/revision/commitId、当前 principal/organization、授权结果。这些是不同身份轴。Owner snapshot 只能绑定当前 Store 对象与代次，不是登录主体或权限票据；`auth_context_changed` 也不能替代实际身份 provider 事件。主体与组织改变、撤权必须由真实 provider 触发失效并在读源与确认提交前分别重新授权。

### 失效语义与成功/拒绝 oracle

候选列出的失效触发覆盖新资源加载、cache restore、模式切换、unmount、响应 ID 不符/发布失败、root/目标删除或替换、用户/组织/会话切换，并要求旧异步响应不能重新发布或恢复旧 owner。它同时诚实记录：当前源码没有主体切换和 load-generation 门控证据；此处是必须实现/验证的合同要求，不是已实现行为。

未来 Builder oracle 的观察面划分正确：成功时分别记录主体/组织和 source/target 权限、完整根与 raw target、selection、snapshot-cache 调用、dirty、物理 history append、preview dispatch、真实 downstream request、保存响应与普通重开回读；写前拒绝时逐项比较 root/config/cascade/selection、快照/历史、preview/query 和 save 请求；撤权后恢复基准授权，并确保旧 owner/剪贴内容不跨身份复用。不得把缓存调用等同于 history，不得把 preview dispatch 或 fixture 的 chart 数等同于真实请求数。

但这些目前是下一阶段的 oracle 要求，并非 producer 专属可运行 Cases：QPC Cases r005 中的事务模型/成功模型仍受真实权限和 owner producer 未绑定限制。下一 Session 应将各分支转成冻结的初态/终态和拒绝优先级，明确 publisher 部分失败、旧响应竞态、cache restore 和主体变化的精确观察点；此处没有足够证据把这些 oracle 标记为已经验证。

### Scope Delta、claim ceiling 与误用风险

Scope Delta 为 `none`。Goal 10 AC、26 must-have、16 产品义务和 S01 独立关系保持不变；copy-as-new、cache restore、template、preview/embed 和其他入口未被移出 Goal，只是该 producer candidate 的边界。

本 review 的 claim ceiling 是源映射及候选 producer 边界复核。它不证明 Store producer 已落地、saved-canvas filter copy 可用、只读拒绝/撤权有效、source-read/target-commit 安全或任何 Goal AC 完成。真实权限模块来源、公开权限契约和隔离多用户环境仍缺；PermissionEnvironment 状态保持 `BLOCKED / NOT_RUN`。standalone、mock、静态 `checkPer` 映射或管理员身份都不能替代。

未来代理最容易发生的误读包括：

1. 将 “eligible after publish/restore” 或 “producer design pass” 压缩成已支持 saved-canvas copy。缓解：状态须带 `design-boundary-only`，并保留无产品 producer/无 UI/Store 准入说明。
2. 将 owner generation、资源 ID 或 root/raw identity 当成主体认证或授权结果。缓解：授权轴保持独立；source-read、target-edit 在各自操作时重新取真实权限。
3. 将 cache restore 当作同用户可信读取，或把缓存中的 source ID 当作目标资源 ID。缓解：cache 只作为一条画布加载来源；资源匹配、主体授权、新 root generation 分开验证。
4. 将多个 Store setter 的静态次序理解为原子发布，忽略异步旧响应覆盖新画布。缓解：后续合同冻结 load generation、发布时点及部分失败 oracle，并验证 watcher/render/旧响应。
5. 把 QPC-014 或 copy-as-new 的当前不支持分类变成永久拒绝。缓解：保持原 Goal 分母，另行设计正确的目标资源与 owner 身份合同。
6. 将 review 通过理解为产品 Builder 或权限验收准入。缓解：实现 readiness 单列为 `NOT_READY_FOR_PRODUCT_UI_STORE`，权限仍 `BLOCKED / NOT_RUN`。

术语压缩测试：单看 “owner producer design 已通过” 可能被误读成 producer landed 或 saved canvas feature supported。当前结论必须写成“producer 边界设计有界通过；producer 未实现；产品入口未准入”，不能只写“saved owner 已支持”或“integration ready”。

## Evolution / Implementation-Entry Review

### 最小安全切片

此文件可冻结的最小切片是：依据静态源码区分各加载来源，并定义未来 owner producer 只在完整编辑态 Store context 发布后 mint 当前画布身份；owner 不携带设计配置、不授予源读取或目标提交。它不是 Builder 单独可执行的实施合同。

产品环境仍阻塞时，允许的下一片工作为 producer-local contract 与 Cases 设计，绑定 exact source facts、成功/拒绝终态、错误优先级、load generation、cache source、principal/provider 未知项和可见性风险。实施进入需再建立 Card/Context/Design Review、同身份可信 RED、独立验证要求和精确 action-target admission；当前审查不签发这些准入。

### 实现梯级与后续 Session

1. 已完成：只读静态 Store Producer Trace 与当前 producer design candidate。
2. 本轮有界通过后：建立独立的 producer contract/Cases，分别覆盖 normal edit、cache restore、stale/failed response、resource ID mismatch、copy/template/create/preview 排除、目标身份失效和主体/组织改变。明确授权结果不由 owner mint。
3. 对合同进行新的独立设计复核；只有冻结的本地 producer 边界、成功/拒绝 oracle 和可信验证计划均可复现，才讨论 producer-local builder admission。此审查不代替 admission。
4. 真实权限来源、公开调用契约和隔离多用户实例准备完成后，再创建 source-read、target-commit/UI 接线的独立 contracts、cases、admission 与验证矩阵；在此之前保持禁入。
5. 后续逐步执行产品入口、真实多用户允许/拒绝/撤权与恢复、预览/查询、保存重开/历史回归及独立 Goal 验收；均未由当前 review 关闭。

Producer action 若进入实现，应限制为加载完成状态的单一身份发布/失效边界；不要把权限检查、source read、复制准备、目标 commit、snapshot/history、preview 和保存编排全塞进 owner producer。设计目前将 owner identity 与授权/业务副作用分开，未见现有 God Object 或 half-schema DSL；后续如把所有身份、权限与事务状态继续堆入同一对象，应作为新的语义/复杂度 finding 复核。

## 最终边界

本报告只给出 QPC saved-owner producer 设计候选的有界独立语义裁定。Design Freeze Validity 为 `PASS_WITH_BOUNDS`；Implementation Entry Readiness 为 `NOT_READY_FOR_PRODUCT_UI_STORE`。产品读取、提交与真实权限验证均未准入；权限验收仍 `BLOCKED / NOT_RUN`。没有关闭任何 Goal AC、must-have、产品义务或 S02 Goal。
