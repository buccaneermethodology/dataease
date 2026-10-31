# 已保存画布单选查询 owner 生命周期设计 r003

状态：`DESIGN_CANDIDATE_REVIEW_REQUIRED`。本版本回应 r002 的 SCO2-01..03；仅冻结 detached helper 候选合同与对象图 oracle，不接 Store、UI、来源配置读取、剪贴板、提交、预览、查询、保存或权限实现。独立复审后才可申请另一个精确 helper implementation contract/admission。

## 目标、父 Goal 与声明上限

为将来已加载、非模板、原地编辑的已保存仪表盘提供进程内 owner 生命周期候选。owner 只证明 helper 私有记录的对象引用仍与闭包 getter 当前返回的上下文一致；不证明这个 getter 来自真实 Store，不证明用户/组织身份或权限。

原 Goal 分母完整保留：10 项 Goal AC、26 项 must-have、16 项产品义务，`Scope Delta: none`。模板、copy-as-new、嵌套组件、完整复制/粘贴、来源配置读取、目标提交、真实授权、多用户拒绝与撤权验证仍属父 Goal，不因本设计排除或完成。S01 继续独立收尾。

## 唯一的 root/component 对象模型

`root` 是当前应用的顶层 `componentData` 数组本身，使用 `toRaw(componentData)` 得到的数组对象；它不是包含 `components` 字段的包装对象。数组每一项是顶层组件对象；目标身份是该项经过同一 `toRaw(item)` 规范化后的对象引用。owner 不接受另一份 `topLevelComponents` 投影，也不从 JSON 或 `{raw: ...}` 字段重建身份。

```ts
type ComponentRaw = object & { id: string; type: string }
type LiveContext = {
  loadState: 'loading' | 'ready'
  operation: 'edit' | 'create' | 'copy' | 'template'
  resourceId: string | null
  routeResourceId: string | null
  dvInfoId: string | null
  isTemplate: boolean
  copyMode: boolean
  canvasInstance: object
  root: readonly ComponentRaw[] // exact raw top-level componentData array object
}

type OwnerError =
  | 'SESSION_ALREADY_ACTIVE' | 'CANVAS_NOT_READY' | 'COPY_IS_NEW_RESOURCE'
  | 'TEMPLATE_NOT_SUPPORTED' | 'OPERATION_NOT_SUPPORTED' | 'INVALID_RESOURCE_ID'
  | 'RESOURCE_ID_MISMATCH' | 'RESOURCE_IDENTITY_CHANGED'
  | 'LIVE_CANVAS_IDENTITY_REQUIRED' | 'OWNER_HANDLE_INVALID' | 'OWNER_INVALIDATED'
  | 'CANVAS_INSTANCE_CHANGED' | 'ROOT_REPLACED' | 'REGISTERED_TARGET_CHANGED'
  | 'DUPLICATE_OR_INVALID_TARGET_ID' | 'NO_QUERY_TARGET' | 'TARGET_NOT_VQUERY'
  | 'STALE_COMPONENT_IDENTITY' | 'REGISTRATION_TOKEN_INVALID'

type OwnerValidity =
  | { valid: true; state: 'open'; generation: number; registrationIds: string[] }
  | { valid: false; state: 'invalidated'; reason: OwnerError; generation: number; registrationIds: [] }
  | { valid: false; state: 'unknown'; reason: 'OWNER_HANDLE_INVALID'; generation: null; registrationIds: [] }

type RegistrationResult =
  | { ok: true; state: 'accepted_for_identity_only'; token: object; generation: number }
  | { ok: false; state: 'open' | 'invalidated' | 'unknown'; error: OwnerError; generation: number | null }

type RegistrationValidity =
  | { valid: true; state: 'open'; targetId: string; generation: number }
  | { valid: false; state: 'invalidated' | 'unknown'; error: OwnerError; generation: number | null }

createSavedCanvasOwnerLifecycle({ getCurrentContext }): {
  beginLoadedResourceSession(): { ok: true; owner: SavedCanvasOwner } | { ok: false; error: OwnerError }
  registerTarget(owner: SavedCanvasOwner, targetId: string, targetRaw: object): RegistrationResult
  validate(owner: SavedCanvasOwner): OwnerValidity
  validateRegistration(owner: SavedCanvasOwner, token: object): RegistrationValidity
  invalidate(owner: SavedCanvasOwner, reason: InvalidationReason): void
}
```

`getCurrentContext` 是 helper 创建时捕获的闭包 getter。测试 DSL `{ "ref": "objects.root[0]" }` 只是 runner 的引用路径；runner 必须解析成真实 JS 对象，再把对象传给 API。clone 会创建不同的数组和节点对象。字符串/布尔标签不能作为身份凭证。resource ID 必须是非空、非全空白字符串；不把 JS number 转字符串，也不把 Long 转成可能丢精度的 JS number。route、loaded `dvInfo` 和 current context 的 ID 在 begin 时必须逐字一致。

适配器按同一路径将 `toRaw(componentData.value)` 作为 root，将每个顶层 `toRaw(component)` 作为数组项身份。helper 接收当前实际数组引用并对项直接遍历；不会读取 wrapper.components、单独缓存组件列表或自行解包其中某一侧。该适配器仍未实现；当前合同仅定义未来输入，不宣称产品 producer 已具备。

## 来源路径及可用性

| 当前路径 | 当前源码观察 | 将来归一值 | 本 helper slice |
| --- | --- | --- | --- |
| 已保存资源常规加载 | `initLocalCanvasData` 成功分支中，`canvasUtils` 已先发布组件数据与 `dvInfo`，再由 Dashboard 标记加载完成/调用 `onInitReady`；`onInitReady` 仅 parent `postMessage` 通知 | 适配器只可在本地加载成功且最终 `componentData`/`dvInfo` 已发布后提供 `edit` context；route `opt` 字面值不单独证明 edit | detached helper 可消费给定 context；真实 producer 仍未定义 |
| 缓存恢复 | snapshot publish 分支完成数据恢复，不经过上述加载成功回调 | 当前无可信归一值 | `NOT_SUPPORTED_BY_THIS_SLICE`；`dataInitState=true` 或 ready 字符串不足以建 owner |
| create | 新建流程与空画布初始化 | `create` | 拒绝 saved-resource owner；原创建型 owner 路径独立 |
| copy-as-new | copy 分支语义是新资源，即使共用加载回调 | `copy` | 拒绝 saved-resource owner |
| template | 模板专用路径 | `template` | 拒绝，不改变模板行为 |
| loading/失败/外部通知 | 无最终加载成功快照，或仅收到 message | loading/无 context | 不建 owner；message 不作身份凭据 |

如加载或恢复路径、root 发布顺序改变，真实适配器设计须重新核对。helper 不监听 parent message。

## begin 与共享的 current-context 复验算法

首次 `beginLoadedResourceSession()` 错误优先级固定为：已有 owner 仍 open → `SESSION_ALREADY_ACTIVE` 且不替换它；context 不存在或 not ready → `CANVAS_NOT_READY`；copyMode 或 operation=copy → `COPY_IS_NEW_RESOURCE`；isTemplate 或 operation=template → `TEMPLATE_NOT_SUPPORTED`；operation 不是 edit → `OPERATION_NOT_SUPPORTED`；resource ID 格式非法 → `INVALID_RESOURCE_ID`；三处 ID 不完全相等 → `RESOURCE_ID_MISMATCH`；缺少 canvas/root 对象引用或 root 不是数组引用 → `LIVE_CANVAS_IDENTITY_REQUIRED`。全部通过后创建新的 opaque owner epoch、generation=0、空 registrations，状态 `open`。

`registerTarget` 和 `validate` 对本工厂签发的 open handle 共用同一 `revalidateOpenOwner`，顺序固定如下；首个失败条件成为返回 reason，并以一次幂等 invalidate 转为终态：

1. current context 缺失或 loadState 不为 ready：`CANVAS_NOT_READY`。
2. copyMode 或 operation=copy：`COPY_IS_NEW_RESOURCE`。
3. isTemplate 或 operation=template：`TEMPLATE_NOT_SUPPORTED`。
4. operation 不为 edit：`OPERATION_NOT_SUPPORTED`。
5. resource ID 无效、当前 `resourceId` 与 owner 绑定值不同，或 route/dvInfo/current 三个值互不相同：`RESOURCE_IDENTITY_CHANGED`。
6. canvasInstance 引用不等：`CANVAS_INSTANCE_CHANGED`。
7. root 数组引用不等：`ROOT_REPLACED`。
8. 对现存每一条 registration，root 中必须恰有一个相同 id、类型为 VQuery 且对象引用同为 registered raw；否则 `REGISTERED_TARGET_CHANGED`。

如果 handle 不属于该工厂，`validate` 返回 `unknown / OWNER_HANDLE_INVALID / generation=null`，不影响其他 owner；已终结 handle 返回 `invalidated / OWNER_INVALIDATED` 对应的稳定终态（其终结 reason 在该 handle 内保留，generation 不再增加，registrationIds 为空）。open owner 遇到上述步骤1-8任一变化时只失效一次、generation 加1并清空全部 registrations 与 token。再次 validate/invalidate 不会再增加 generation。

`registerTarget` 在共享复验通过后再校验新目标：目标 ID 非非空字符串或 root 中同 ID 数量大于1 → `DUPLICATE_OR_INVALID_TARGET_ID`；同 ID 数为0 → `NO_QUERY_TARGET`；唯一项类型不是 VQuery → `TARGET_NOT_VQUERY`；唯一项对象引用与 `targetRaw` 不等 → `STALE_COMPONENT_IDENTITY`。这些目标级普通拒绝保持 owner open、generation 与已有 registration 不变。通过返回 opaque token，绑定 owner epoch、generation、目标 ID 与 raw 引用，结果只能说明 `accepted_for_identity_only`。同一 owner 可注册多个不同 ID 的顶层 VQuery。`validateRegistration(owner, token)` 先验证 owner handle 并运行相同 current-context 及既有目标复验；只有仍在当前 open owner registrations 中的同一 token 对象且 generation 匹配才返回 `{valid:true,state:'open',targetId,generation}`。owner已失效时返回 `{valid:false,state:'invalidated',error:'OWNER_INVALIDATED',generation}`；活跃 owner 收到未知/外部 token 则返回 `{valid:false,state:'unknown',error:'REGISTRATION_TOKEN_INVALID',generation:null}`。该检查不读取/修改组件配置。

## factory、epoch、registration token 与变异

每个成功 begin 使一个 lifecycle factory 的 `factory_epoch_count` 加1，并签发新 opaque handle；一个 open owner 期间重复 begin 返回 `SESSION_ALREADY_ACTIVE`，保留旧 handle。owner 终结后，同一 factory 可用新的 ready context 再 begin 并创建下一个 epoch；旧 handle 永远终结。loader reload 若创建新的 factory，计数从1重新开始，测试用例需显式声明计数范围。

runner 的 `setCurrentContext` 是浅合并：仅覆盖指定顶层属性，其他属性/引用保留；传入的 ref descriptor先解析为真实对象。root 数组原地替换/删除已注册项会在下次 register/validate 的共享复验第8步识别为 `REGISTERED_TARGET_CHANGED` 并清理全部 token。若仅添加无冲突的其他组件，已有目标仍恰好唯一且引用未变，registration 保持有效。目标 ID 变重复、类型改变或对象引用变化都使所有现有 registrations 一并终结。

## invalidate/authorize 行为

显式 invalidate、资源/route/dvInfo变化、canvas卸载或引用替换、root引用替换、copy/template/operation变化、已注册目标删除或替换均为终止事件。真实 auth subject/org变化也必须由未来可信 permission lifecycle 调用 invalidate；当前不存在真实事件源，撤权/身份变化仍 `BLOCKED / NOT_RUN`，不能以手工调用用例宣称通过。

owner 不返回 `authorized`、`authenticated`、`permissionGranted`。来源配置读取前仍须另行绑定真实主体、组织、来源资源与read operation的授权契约；目标提交前另验目标资源、数据集访问、目标编辑权限，并在确认时重新授权。QPC r005 对产品 UI/Store 的结论仍为 `NOT_READY_FOR_PRODUCT_UI_STORE`。

## 保持关闭的业务行为与既有创建路径

本设计不允许调用 `readDesign`、copy、paste、commit、snapshot/history、preview、query 或 save。它没有定义 saved-mode 并发编辑合并或完整根替换语义。即使 detached helper 独立复审通过，也只能另行准入纯 helper 与同身份 runner/tests；产品接线还需要真实 Store producer、授权契约及另一份精准审查/准入。既有创建型 `beginSession()` 不接入此 helper；本设计不声称其 byte-for-byte 不变，后续实现要绑定并运行原有创建型回归测试。

## Fixtures 与当前状态

[Fixtures r003](QuerySingleSelectSavedCanvasOwnerCases-r003.json) 用 `objects.root` 直接代表顶层 componentData 数组，数组项本身就是 component raw identity；ref DSL、浅合并 mutation、root replacement、同 root target replacement、Mode/route/dvInfo失效、registration清理、factory epoch与终态返回均有精确输入/输出。所有用例保持 `source_read=false`、`paste_commit=false`，且不声称权限事实。

当前状态为 `DESIGN_CANDIDATE_REVIEW_REQUIRED`：源码与测试尚无写入准入；产品 UI/Store/read/commit/save/permission 均未准入。Goal 原分母完整，真实权限验收 `BLOCKED / NOT_RUN`。
