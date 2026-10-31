# 已保存画布单选查询 owner 生命周期设计 r002

状态：`DESIGN_CANDIDATE_REVIEW_REQUIRED`。本版本只定义 detached owner helper 的引用身份与状态机，不接产品 Store、UI、来源配置读取、剪贴板、提交、预览、查询、保存或权限实现。它回应 SCO-01..03；必须独立复审后才可讨论新的 helper 实现准入。

## 目标、范围与原 Goal 分母

为将来已加载、非模板、原地编辑的已保存仪表盘提供一个短生命周期的进程内资源/画布实例绑定候选。owner 只说明 helper 持有的锚点仍与 `getCurrentContext()` 返回的当前上下文使用同一 JavaScript 对象引用；这不是对调用方、Store producer、用户、组织、查看/编辑能力或资源权限的认证。

完整 Goal 保持 10 项 AC、26 项 must-have、16 项产品义务，`Scope Delta: none`。模板、copy-as-new、嵌套组件、复制/粘贴、来源配置读取、目标提交、真实授权和真实多用户验收都仍在父 Goal 义务中，不由本设计排除或视为完成。S01 继续独立收尾。

## Detached helper 的精确接口

设计候选接口：

```ts
type LiveContext = {
  loadState: 'loading' | 'ready'
  operation: 'edit' | 'create' | 'copy' | 'template'
  resourceId: string | null
  routeResourceId: string | null
  dvInfoId: string | null
  isTemplate: boolean
  copyMode: boolean
  canvasInstance: object
  root: object
  topLevelComponents: Array<{ id: string; type: string; raw: object }>
}

type OwnerResult =
  | { ok: true; owner: SavedCanvasOwner }
  | { ok: false; error: OwnerError }

createSavedCanvasOwnerLifecycle({ getCurrentContext }): {
  beginLoadedResourceSession(): OwnerResult
  registerTarget(owner, targetId: string, targetRaw: object): RegistrationResult
  validate(owner): OwnerValidity
  invalidate(owner, reason: InvalidationReason): void
}
```

`getCurrentContext` 是闭包持有的 getter，helper 每次读取当前上下文。测试或将来的生产适配器必须通过对象引用提供 `canvasInstance`、`root` 和组件 `raw`；不得以 `root_origin`、`root_identity`、`target_raw_member` 等字符串或布尔值作为身份凭据。helper 在 begin 时把当前的 resource ID、`canvasInstance` 与 `root` 对象引用保存在私有闭包/WeakMap；注册时重新读取 current context 并要求 canvas/root 均严格 `===`。目标注册还要求 `targetRaw` 严格等于当前 root 顶层列表中恰好一个 VQuery 节点的 `raw` 引用，目标 ID 在该列表恰好出现一次。外部拿到的 owner 只能是不可伪造的 opaque handle；epoch/token 不写入持久化对象。

resource ID 采用当前 API/路由的字符串传输值，拒绝空串、空白串和非字符串；不把 JS number 转成字符串，也不把 Long 转成可能丢精度的 number。route、已加载 `dvInfo` 和 begin context 中的 ID 必须逐字相等。Vue proxy/raw 规范：适配器在构造 context 时对 root 及每个 component raw 使用同一 `toRaw` 规则一次；helper 只比较传入引用，不自行对其中一边解包或深比较。该规则目前是候选输入契约，不代表产品已接入。

## 加载路径映射及可信观察边界

归一后的 `LiveContext` 只能在适配层明确观察到数据发布完成后生成。当前源码事实与本切片支持度如下：

| 路径 | 当前可观察事实 | detached `operation` | 本切片 owner |
| --- | --- | --- | --- |
| 已保存资源常规加载 | `initLocalCanvasData` 成功路径中，`canvasUtils` 已先发布 component data 与 `dvInfo`，之后 `dashboard/index.vue` 设置完成状态/调用 `onInitReady`；`onInitReady` 本身只是 parent `postMessage` 通知 | 将来适配器只有在本地成功回调读取到最终 Store root 后才能归一为 `edit`；路由 `opt` 字面值不作为 edit 的唯一判据 | helper 可按给定 ready context 建立 detached session；产品 producer 未定义 |
| 选择恢复缓存快照 | 当前恢复分支走 snapshot publish 并完成加载，不走上述 `initLocalCanvasData` 成功回调 | 暂无认证归一值 | `NOT_SUPPORTED_BY_THIS_SLICE`，不得以 `dataInitState=true` 或 ready 字符串单独建 owner |
| 新建空画布 | create 初始化与空 root 条件 | `create` | 不进入 saved-resource helper；既有创建型 owner 不变 |
| copy-as-new | 当前 copy 分支复用加载回调，但语义为新资源 | `copy`，优先于 `edit` | 拒绝建立 saved-resource owner |
| 模板编辑 | template 分支 | `template` | 拒绝；不改变现有模板行为 |
| 页面加载中/错误/回调通知 | 未完成或只有外部通知 | `loading` / 无 ready context | 不建 owner；message 不是身份凭据 |

上表记录当前 source observation，不伪造缺失 producer。若恢复路径或资源加载最终 Store root 的同步时序变更，适配器必须重新审查；detached helper 本身不监听 `postMessage`。

## begin、register 与错误优先级

`beginLoadedResourceSession()` 按固定顺序判断：已有活动 session → `SESSION_ALREADY_ACTIVE`（保留现状）；无 current context 或 `loadState !== ready` → `CANVAS_NOT_READY`；`copyMode` 或 `operation === copy` → `COPY_IS_NEW_RESOURCE`；template 标志或 operation → `TEMPLATE_NOT_SUPPORTED`；operation 非 edit → `OPERATION_NOT_SUPPORTED`；资源 ID 缺失/格式错误 → `INVALID_RESOURCE_ID`；三处 ID 不一致 → `RESOURCE_ID_MISMATCH`；缺失 canvas/root 对象引用 → `LIVE_CANVAS_IDENTITY_REQUIRED`；通过则创建新 epoch、空 registration map、token generation 0，状态为 `open`。这里的 `open` 只表示 detached helper session open。

`registerTarget()` 按固定顺序处理：handle 非本工厂签发或非当前 open epoch → `OWNER_HANDLE_INVALID`；当前 context 缺失或 `loadState !== ready` → 先将 owner 终结为 `invalidated` 并递增 generation、清空 registrations，再返回 `CANVAS_NOT_READY`；resource ID 或 `canvasInstance` 变更 → 先将 owner 终结为 `invalidated` 并递增 generation、清空 registrations，再返回 `CANVAS_INSTANCE_CHANGED`；root 引用变化，同样先终结再返回 `ROOT_REPLACED`；target ID 缺失/重复（重复判定先于类型和对象检查）→ `DUPLICATE_OR_INVALID_TARGET_ID`；目标 ID 为零个顶层节点 → `NO_QUERY_TARGET`；唯一节点类型非 VQuery → `TARGET_NOT_VQUERY`；传入 raw 与唯一节点 raw 不同 → `STALE_COMPONENT_IDENTITY`；通过则以 registration token 绑定本 epoch、generation、目标 ID 与对象引用，结果仅为 `accepted_for_identity_only`。一个 open owner 可注册多个不同 ID 的顶层 VQuery。

常规拒绝不改变仍 open 的 owner 或既有 registrations。当前上下文已变更时的拒绝会终结 owner，避免保留 stale capability。重复 begin 不覆盖现有 owner。registration token 只在 owner open、generation 匹配且 current root/context 仍同引用时有效；invalidate、root/canvas/resource 变化、显式销毁均递增 generation、清空所有 registrations 并将 owner 标记为 `invalidated`。终结 handle 永不恢复；reload 必须通过一个新鲜 live context/new helper epoch 再 begin。owner 只可 `open → invalidated`，没有恢复或 reopen 转移。

## 失效与授权边界

route resource 变化、canvas 卸载/重载（包括 current context 消失或退回 loading）、模板/copy mode 变化、root replacement 与显式 invalidate 都应使当前 owner 失效。任何真实 auth subject/org 变化也必须由将来的可信权限 lifecycle 触发 invalidate；当前无真实事件源，所以撤权/身份变化仍为 `BLOCKED / NOT_RUN`，不以测试回调证明真实授权。

owner 不提供 `authorized`、`authenticated`、`permissionGranted` 等状态。读取来源配置前要有独立、经复审的真实授权契约，绑定 subject、org、source resource 和 read operation；目标变更提交前还需校验目标资源、数据集访问、目标编辑权限，并在确认时重新授权。QPC r005 的产品 UI/Store 接线仍 `NOT_READY_FOR_PRODUCT_UI_STORE`。

## 保持关闭的行为

本设计不允许通过 owner 调用 `readDesign`、复制、粘贴、commit、snapshot/history、preview、query 或 save。它没有定义 saved-mode 的目标局部替换、并发 Store 编辑合并或完整根替换语义。owner readiness 即使被独立审查批准，也只可能支持一个纯 detached helper；必须另有精确 Contract/Cases、可信 RED、绑定 admission 与独立 Validation 后，才能写 helper 源码/测试。产品接线还需要真实 producer、permission contract 与另一个精确审查/准入。

## 用例和回归声明

[Fixtures r002](QuerySingleSelectSavedCanvasOwnerCases-r002.json)以 `object_graph` 与 `ref` DSL 描述 runner 要构造的实际对象关系：runner 将引用解析为 JS 对象；clone 必须构造全新对象。DSL 中的字符串是“对象图路径”，不是身份主张。Fixtures 覆盖 begin/registration/终态、拒绝优先级、恢复缓存、copy/template/create 分流、引用替换、重复调用与 reload epoch。纯 JSON fixture 不能证明真实 Store producer 或权限。

旧创建型 `beginSession()` 的具体行为仍由既有源码与既有测试负责；此设计不声称行为 byte-for-byte 不变。实现前需冻结相关现有测试身份并执行回归，不能借新 helper 把 saved mode 接入创建入口。

## 当前准入状态

独立复审前：`DESIGN_CANDIDATE_REVIEW_REQUIRED`，无 helper 源码/测试准入，无产品 UI/Store/read/commit/permission 准入。原 Goal 分母不变；真实权限验收 `BLOCKED / NOT_RUN`。
