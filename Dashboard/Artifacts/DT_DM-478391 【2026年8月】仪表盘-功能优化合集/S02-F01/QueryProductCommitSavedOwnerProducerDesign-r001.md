# QPC saved-owner Store producer 设计候选 r001

状态：`CANDIDATE_FOR_INDEPENDENT_REVIEW`。本设计仅定义真实 dashboard Store producer 的候选边界，承接 [QPC r006 审查](reviews/QueryProductCommitDesignDeltaReview-r006.md)批准的只读追踪和入口设计。没有产品 UI/Store、来源配置读取、目标提交或真实权限 Builder 准入。

## Authority、分母与设计目的

Goal.final 是范围与验收权威。10 项 Goal AC、26 项 must-have、16 项产品义务、`Scope Delta: none` 完整保留，S01 独立。目标是为后续审查提出：何时可以把当前已载入的 dashboard 资源、canvas root 与目标 VQuery 对象绑定为一个短期 owner 能力；何种载入分支不具备该能力；以及什么生命周期变化必须使其失效。

本设计不把 owner 视为登录主体或权限票据。资源 ID、root/raw 对象、owner generation、QSSDH epoch/revision/commitId、用户/组织身份、授权结果都是不同状态轴。Detached helper r002 只验证调用方注入当前上下文时的对象身份协议；它没有 Store producer。

## 当前 source facts 与待决边界

- dashboard route/embedded 路径读取 `resourceId/opt/createType`，在资源加载前调用本地 `checkPer`，之后 `initCanvasData` 通过 `findById` 或 `findCopyResource` 加载数据。[dashboard/index.vue:248-278](../../../../core/core-frontend/src/views/dashboard/index.vue:248) [canvasUtils.ts:597-615](../../../../core/core-frontend/src/utils/canvasUtils.ts:597)
- 正常载入解析 API 响应后，当前 Store 由多个 setter 依次发布组件根、样式、`dvInfo`、视图信息；当前没有一个完整的 owner 发布 action。[canvasUtils.ts:662-682](../../../../core/core-frontend/src/utils/canvasUtils.ts:662)
- 选择使用本地 cache 时，父 Dashboard 收到对话框事件后对缓存做 `deepCopy`，再由 `snapshotPublish` 发布 snapshot 中的 `dvInfo` 与画布状态。[CanvasCacheDialog.vue:50-62](../../../../core/core-frontend/src/components/visualization/CanvasCacheDialog.vue:50) [dashboard/index.vue:189-203](../../../../core/core-frontend/src/views/dashboard/index.vue:189) [snapshot.ts:139-147](../../../../core/core-frontend/src/store/modules/data-visualization/snapshot.ts:139)
- `opt=copy` 会转入 `dashboard-copy`/`findCopyResource` 路径；模板新建则先 `createInit` 再装入模板数据。二者都不能默认视为“编辑原已保存资源”。[dashboard/index.vue:206-225](../../../../core/core-frontend/src/views/dashboard/index.vue:206) [dashboard/index.vue:292-319](../../../../core/core-frontend/src/views/dashboard/index.vue:292)
- Dashboard 卸载时会失效 QSSDH session；当前没有 saved-owner 产品调用点，也没有主体/组织变化驱动的 owner invalidation 来源。[dashboard/index.vue:380-385](../../../../core/core-frontend/src/views/dashboard/index.vue:380)
- `checkPer` 与 `dvInfo` 不能作为满足本 Goal 权限矩阵的证明；当前未找到已授权 permission provider 的公开主体/资源/动作契约。真实权限环境不可用，故权限判定、来源读取和目标提交全部 `NOT_READY`。

详细行级证据见 [Store Producer Trace r001](QueryProductCommitStoreProducerTrace-r001.md)。上述均为静态源码事实；多 setter 中间状态、缓存对象 raw 身份、认证主体与授权结果均未在运行时观察。

## 候选能力与发布协议

建议后续以 Store action 作为唯一 producer，输入是已经完成的资源加载结果和本轮载入代次。producer 在同一同步发布边界写入资源元信息、完整 component root、view info 与 source kind，然后发布不可变 owner snapshot。调用方不得分别读取几个可变 Store 字段后自行拼 owner。实现选择 `$patch`、新 action 或其他事务机制必须经独立 source/design review 确认其 watcher/render 可见性，当前不声称 Pinia 多赋值天然原子。

`SavedCanvasOwnerContext` 的最小候选字段：

| 轴 | 候选内容 | 有效性要求 |
|---|---|---|
| 资源 | route/embedded requested ID、响应 `dvInfo.id`、owner resource ID | 三者按明确资源模式一致；copy-as-new 不得把 source ID 冒充目标资源 ID |
| 画布 | load generation、source kind、canvas instance token | 新载入、缓存恢复、资源切换或 unmount 增代；旧 token 不复活 |
| 根对象 | 当前顶层 `componentData` raw 引用和 root revision | owner 使用的 root 必须是发布完成后的当前根；保留替换与 Vue proxy 的规范化口径 |
| 目标 | root 内唯一的 component/innerType 均为 VQuery 的 raw 对象 | 目标需重新遍历当前 root 并唯一匹配；删除、重复或替换后拒绝旧 owner |
| 主体/权限 | 当前 principal、organization、resource/action authorization context | 当前没有可用 producer/contract；必须另经 permission module 取得并在读取与提交时分别校验，不能从 owner generation 推导 |

候选发布顺序为：`invalidate previous generation → load/restore result → validate resource mode and metadata → publish complete Store context → mint owner snapshot → later action revalidates snapshot and authorization`。owner snapshot 只约束 UI/Store 当前对象的身份和代次，不携带源过滤配置、不表示可读、不表示可写。

## 加载分支分类

| 分支 | 候选分类 | owner 条件/当前缺口 |
|---|---|---|
| 已保存资源正常编辑 | `eligible_after_publish_candidate` | 仅在加载完成、requested ID 与响应 ID 完全符合编辑模式、Store root/view 已发布后候选建立；真实授权仍另行校验 |
| 用户选择恢复本地 cache | `eligible_after_restore_candidate` | cache 中资源 ID 必须与当前编辑资源一致；`snapshotPublish` 完成并重新检查 root/target 后创建新 generation；不沿用旧 raw owner |
| `opt=copy` / copy-as-new | `not_supported_by_current_contract` | `findCopyResource` 与新目标资源身份映射未证明；保存生成目标 ID 之前不把源资源 ID 当作目标 owner |
| template 新建 | `not_saved_owner` | `createInit` 后的模板根是新建候选，不是已保存资源 owner |
| 空白新建 | `not_saved_owner` | resource ID 为空，不进入 saved-canvas producer |
| preview / onlyPreview / embed | `not_in_this_target` | 此设计针对 dashboard editor 的目标 owner；其他入口须另行设计，不按同 store 类型自动覆盖 |
| 加载失败、ID 不一致、root 未发布或目标不唯一 | `reject_and_invalidate` | 不 mint owner；不读取源配置，不产生目标副作用 |

`copy-as-new` 分类是当前能力边界，不把它从 Goal 删除。它仍在完整产品义务内，须在正确的 source/target 权限和新资源 ID 契约可用后单独补齐。

## 失效与重验

1. 开始加载另一个 resource、执行 cache restore、进入 create/template/copy 模式或 Dashboard unmount 前，先使上一 generation 失效。
2. 资源响应的 ID 与当次 requested identity 不一致、发布失败、当前 root 不同、目标消失/重复/被替换时，owner 立即无效；失败路径不保留旧 token。
3. 用户/组织/会话切换必须由真实身份 provider 的可追踪事件触发失效；当前尚未定位该 provider，故该条件是准入前置，不能用 `auth_context_changed` 由调用方随意传入来冒充监听。
4. 读取来源过滤配置前与确认提交前，分别读取当前主体和授权结果并与目标 resource/action 绑定；任一授权未证、身份变化或撤权均在写前拒绝。owner snapshot 不缓存授权结论，不延长会话，不设置永久 Token。
5. 加载期间的异步响应必须绑定 request/load generation；旧响应不得重新发布 Store 或恢复 owner。当前源码未证明该竞态门控，仍需入口设计/实测。

## 后续合同与独立验证 oracle

真正的 Builder 合同必须冻结完整源/目标 resource identity、目标 root 与 selection，以及所有可观察副作用：

- 成功路径：授权主体/组织与动作明确；源与目标分别通过权限；Store 发布完成后 owner 与当前唯一 raw VQuery 身份匹配；来源读取和目标 prepare 使用同一份授权/资源快照；目标同步提交后分别记录实际 snapshot-cache 调用、dirty 状态、物理 history append、preview event、实际 downstream query requests、保存响应及普通重开回读。
- 写前拒绝路径：无权限、撤权、principal/organization 切换、资源 ID 不一致、旧 request、load generation 过期、目标替换/重复/不存在、schema/enum 不合法时，断言目标 root/config/cascade/selection、snapshot/history、preview/query counters、保存请求均不变。
- 恢复路径：撤权用例结束后回到约定基准权限；账号保留，session 正常过期；旧 owner 与旧剪贴内容不可跨身份复用。
- 观察限制：snapshot cache 方法调用、dirty/cacheTimes 变化、物理 history append、preview dispatch、下游 query request、服务端保存和重开是独立 oracle，不能彼此代替。

任何运行时、身份或权限用例都不能用 standalone admin、mock、注入 principal、静态代码映射或本 helper GREEN 代替。

## Implementation ladder 与准入结论

1. 当前只完成只读源追踪与本设计候选；不改源码、测试或权限设置。
2. 独立 Semantic Review 分别裁定 `Design Freeze Validity` 与 `Implementation Entry Readiness`。发现 source gap 时只修订设计并再次复核。
3. 若设计有界通过，仍只可冻结 owner producer 的本地 Store 合同、Cases 和真实权限依赖清单；不自动获得产品 Builder 准入。
4. 取得授权 permission module 来源或可用隔离实例、公开权限调用契约与持久测试身份后，重建完整 Goal/Contract/Cases/Context、可信 RED、实际 topology 和 action-target admission；再单独申请 source-read、target-commit 与 UI 接线。
5. 实现获准后依序做产品入口行为验证、真实多用户允许/拒绝/撤权恢复、保存/重开/历史回归及独立 Goal 验收。当前所有产品义务继续开放。

本文件仅是产品入口设计候选；不表示 design 已冻结、不表示实现可准入，也不关闭任何 Goal AC。
