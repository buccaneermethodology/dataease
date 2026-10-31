# 已保存画布单选查询 owner 生命周期设计 r004

状态：`DESIGN_CANDIDATE_REVIEW_REQUIRED`。本版本关闭 r003 独立审查 SCO3-01..03 及 target ID 空白、oracle字段名、外来owner返回形状的精确性问题。它只冻结 detached helper 候选合同；仍不接 Store/UI、读取来源配置、复制/粘贴、提交、预览、查询、保存或权限实现。必须经独立复审后才可申请 helper 源码/测试实现准入。

## 范围和父 Goal 分母

owner 只证明 helper 私有记录的对象引用仍等于闭包 getter 当前返回的引用；不认证 Store producer、用户、组织、资源或授权。父 Goal 分母不变：10 项 Goal AC、26 项 must-have、16 项产品义务，`Scope Delta: none`。已保存画布生产接线、模板、copy-as-new、嵌套组件、完整业务链及真实权限均仍待完成；S01 继续独立收尾。

## 对象身份与实际查询节点判据

`root` 是顶层 `componentData` 数组自身，适配器取得 `toRaw(componentData.value)`；每个数组元素是组件原始对象，经同一 `toRaw(item)` 口径比较。`LiveContext` 不另接 `topLevelComponents` 投影、wrapper.components 或 JSON clone。查询目标只在 `component === 'VQuery' && innerType === 'VQuery'` 时成立，不能使用通用 `type` 字段替代。当前 Store 也以这两个字段识别现有 Query。适配器尚未实现，合同不声称真实 producer 已存在。

```ts
type ComponentRaw = object & { id: string; component: string; innerType: string }
type InvalidationReason =
  | 'resource_changed' | 'auth_context_changed' | 'unmount' | 'duplicate_event'
  | 'canvas_replaced' | 'root_replaced' | 'mode_changed' | 'explicit'
type LiveContext = {
  loadState: 'loading' | 'ready'
  operation: 'edit' | 'create' | 'copy' | 'template'
  resourceId: string | null
  routeResourceId: string | null
  dvInfoId: string | null
  isTemplate: boolean
  copyMode: boolean
  canvasInstance: object
  root: readonly ComponentRaw[] // the exact raw componentData array object
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

`getCurrentContext` 由 helper 工厂捕获为闭包 getter。Fixtures 的 `{ "ref": "objects.root[0]" }` 只表示 runner 解析成真实 JS 对象的路径，不是传入 API 的身份字符串；clone 创建不同的 JS 数组/元素对象。resource ID 和 target ID 都必须是非空、非全空白字符串，保留原值、不 trim 改写；拒绝 number，不作精度有损转换。route、loaded `dvInfo` 与 context resource ID begin 时逐字相等。

## 加载路径来源与本切片支持范围

| 路径 | 当前源码观察 | 将来归一值 | 本 helper slice |
| --- | --- | --- | --- |
| 已保存资源常规加载 | `initLocalCanvasData` 成功路径先由 canvas loader 发布 component data 与 `dvInfo`，之后 dashboard 标记加载完成并调用 `onInitReady`；后者只是 parent `postMessage` | 适配器只能在本地成功路径、最终数组与`dvInfo`已发布后给出 `edit` | detached helper 可消费输入；真实 producer 未定义 |
| 缓存恢复 | snapshot publish 分支不经过上述 local-load success callback | 暂无认证归一值 | `NOT_SUPPORTED_BY_THIS_SLICE`，ready flag 不足以建 owner |
| create/copy/template | 分别走新建、copy-as-new、模板逻辑；copy 可能共用加载 callback | `create` / `copy` / `template` | 不进入 saved-resource mode |
| loading/失败/外部通知 | 无最终本地加载快照，或仅收到 message | `loading` / 无 context | 拒绝，不把 message 当身份凭据 |

产品适配器后续必须重读实际发布顺序；本 helper 不订阅 parent message，也不重建恢复缓存 owner。

## Begin 优先级

`beginLoadedResourceSession()` 按顺序检查：若该 factory 已有 open owner，返回 `SESSION_ALREADY_ACTIVE` 且不替换；current context 缺失或 loadState 非 ready → `CANVAS_NOT_READY`；copyMode 或 operation=copy → `COPY_IS_NEW_RESOURCE`；isTemplate 或 operation=template → `TEMPLATE_NOT_SUPPORTED`；operation 非 edit → `OPERATION_NOT_SUPPORTED`；resourceId 非字符串/空白 → `INVALID_RESOURCE_ID`；resourceId/routeResourceId/dvInfoId不逐字相等 → `RESOURCE_ID_MISMATCH`；canvasInstance缺失、root不是数组对象 → `LIVE_CANVAS_IDENTITY_REQUIRED`。通过后签发新的 opaque owner handle，generation=0、registrations为空、state=open。

## 统一 current-context 与已注册目标复验

`registerTarget`、`validate` 与 `validateRegistration` 对本工厂签发且 open 的 owner 共用 `revalidateOpenOwner`，顺序唯一：

1. context缺失或loadState非ready：`CANVAS_NOT_READY`。
2. copyMode或operation=copy：`COPY_IS_NEW_RESOURCE`。
3. isTemplate或operation=template：`TEMPLATE_NOT_SUPPORTED`。
4. operation非edit：`OPERATION_NOT_SUPPORTED`。
5. resourceId无效、current resourceId与owner绑定值不同，或route/resource/dvInfo彼此不等：`RESOURCE_IDENTITY_CHANGED`。
6. canvasInstance引用不同：`CANVAS_INSTANCE_CHANGED`。
7. root数组引用不同：`ROOT_REPLACED`。
8. 对每条已有registration，root里必须恰有一个同ID节点，且其`component`与`innerType`均为VQuery，数组项对象引用等于绑定raw；否则`REGISTERED_TARGET_CHANGED`。

open owner 遇到步骤1–8失败时立刻一次性终结：state=invalidated、generation加1、清空registrations与token。重复invalidate/validate不再加generation。其后 `validate(owner)` 返回 `{valid:false,state:'invalidated',reason:'OWNER_INVALIDATED',generation,registrationIds:[]}`。不属于该factory签发的owner返回 `{valid:false,state:'unknown',reason:'OWNER_HANDLE_INVALID',generation:null,registrationIds:[]}`。成功 validate 返回 `{valid:true,state:'open',generation,registrationIds}`。

## 目标注册与token规则

current-context复验通过后，`registerTarget` 按以下顺序检查新目标：target ID非字符串/空白或root里该ID出现超过一次 → `DUPLICATE_OR_INVALID_TARGET_ID`；出现0次 → `NO_QUERY_TARGET`；唯一节点未同时满足`component==='VQuery'`和`innerType==='VQuery'` → `TARGET_NOT_VQUERY`；唯一节点引用与targetRaw不同 → `STALE_COMPONENT_IDENTITY`。目标级普通拒绝保持owner open、generation与既有registrations不变。

不同ID的顶层查询可分别注册。相同owner对相同target ID、相同当前raw对象重复调用是幂等：返回与首次完全相同的opaque token，不新增registration、不变generation。相同ID但传入不同raw对象，若它不是当前唯一成员则返回`STALE_COMPONENT_IDENTITY`；root重复ID由上面的duplicate check拒绝。`RegistrationResult`成功值是 `{ok:true,state:'accepted_for_identity_only',token,generation}`；失败值是 `{ok:false,state,error,generation}`。

`validateRegistration(owner, token)` 先按owner与open-state执行共享复验，再检查token对象是否仍是该owner当前generation下的registered token。有效时返回 `{valid:true,state:'open',targetId,generation}`；owner已失效时返回 `{valid:false,state:'invalidated',error:'OWNER_INVALIDATED',generation}`；owner是外来handle时返回 `{valid:false,state:'unknown',error:'OWNER_HANDLE_INVALID',generation:null}`；owner open但token未知/外来/已清除时返回 `{valid:false,state:'unknown',error:'REGISTRATION_TOKEN_INVALID',generation:null}`。owner终结后全部旧token无效。该检查不读取配置或改动Store。

## Runner 与状态时序

runner使用 `objects.root` 直接表示raw `componentData` 数组，数组项本身就是组件raw对象；node type oracle严格读`component`与`innerType`。`setCurrentContext` 为顶层浅合并，未指定的字段和引用保持原样；ref值在合并前由runner解析为真实对象。数组`mutateArrayItem`会在同root替换成员；`removeArrayItem`从数组删除成员。已登记目标替换/删除/变成重复ID/非VQuery后，下次验证得到`REGISTERED_TARGET_CHANGED`，所有registration与token清空。

每个成功begin使同一factory的factory_epoch_count加1。open期间重复begin拒绝且保留当前handle；当前owner终结后，factory可用新ready context begin下一epoch；旧owner不复活。若真实reload创建新的factory，计数域从1重新开始。022/023/025的有效root均为数组；025通过已定义的`setCurrentContext`在同一factory更换canvas/root后开启第二epoch。

`validate` 的API字段叫`reason`；fixture可将其表示为`expected.reason`。`RegistrationResult`与`validateRegistration`使用`error`；fixture使用`expected.error`。这是两个不同返回合同，runner不需把一个API模拟成两个字段。

## 权限和业务操作界限

显式invalidate、资源/route/dvInfo变化、canvas卸载或替换、root变化、copy/template/operation变化、已注册目标移除/替换都终止owner。真实auth subject/org变化必须由未来可信permission lifecycle调用invalidate；当前无事件来源，撤权/身份变化保持`BLOCKED / NOT_RUN`。

owner不提供authorized/authenticated/permissionGranted。读来源配置前须由另一个已审设计验证主体、组织、source resource和read operation的真实权限；提交目标前还须验证目标资源、数据集访问、目标编辑权，并在确认时重新授权。QPC r005的产品UI/Store入口保持`NOT_READY_FOR_PRODUCT_UI_STORE`。

本设计关闭 `readDesign`、copy/paste、commit、snapshot/history、preview、query与save。没有定义saved mode下并发编辑合并或整根发布。独立审查即使批准detached helper，也只可在新的源/测试合同、可信RED及target-bound admission后写helper与同身份runner；产品接线需真实Store producer和独立权限/产品审查。既有创建型beginSession不接入；设计不声称其行为不变，后续实现须执行原有创建型回归。

## Fixtures 与当前状态

[Fixtures r004](QuerySingleSelectSavedCanvasOwnerCases-r004.json)包含40个identity cases，明确覆盖：有效root、component/innerType双字段、SCO3-01修复的三个成功begin路径、clone root替换、模式/route/dvInfo变化、目标原地替换/删除、重复注册token复用/失效、外来owner与target、cache restore未接入以及创建流程分离。全部禁止来源读取与提交。

当前候选状态：`DESIGN_CANDIDATE_REVIEW_REQUIRED`。未批准源码/测试、UI/Store、读取、提交、保存或权限工作。真实权限验收`BLOCKED / NOT_RUN`，原Goal分母完整，S01独立。
