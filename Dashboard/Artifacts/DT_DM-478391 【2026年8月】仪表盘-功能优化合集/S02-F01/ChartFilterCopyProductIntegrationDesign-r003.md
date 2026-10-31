# 图表过滤复制粘贴产品接线设计 r003

## 身份与适用范围

Artifact ID `S02-F01-chart-filter-copy-product-integration`，本交付物第 3/3 轮评审输入。r001/r002 设计及评审保持历史记录；本版逐项吸收 r002 的 CFPI-001..008。原 S02 分母保持 10 项 Goal AC、26 项 must-have、16 项产品义务，`Scope Delta: none`。本 Slice 限普通柱状图 BAR-1 → 同数据集、空过滤树普通折线图 LINE-1；不能冒充完整 F01/S02。

真实权限环境仍按维护者指示 `BLOCKED / NOT_RUN`。当前没有已授权 XPack 权限来源、隔离多用户实例或受限账号；本文不猜造 endpoint，也不以 standalone/admin/mock 替代。

## 本版逐项修订

- **CFPI-001：** CPI 树 fixture 加齐 RowAuth 组节点序列化字段，固定完整 field-set 与字节稳定规范化。
- **CFPI-002：** Stage 使用 Vue 所有的唯一 host ID 字符串而非 HTMLElement；定义共享 renderer hook adapter、实例资源 disposer、resize/卸载/队列取消，以及双 host commit。
- **CFPI-003：** CPI-002 改成 Copy source-read deny；增加成功、撤权、恢复重验条件案例并标 `BLOCKED / NOT_RUN`。未获权限 authority 前 Copy fail-closed、Builder 不准入。
- **CFPI-004：** CPI-041..052 各变异一个 capture tuple 字段（含 requestId），案例携带完整 capture/response tuples 和摘要。
- **CFPI-005：** 每个 request 使用稳定 ID，在 ledger 与 queryDispatched、response、stage、commit、cancel 等事件中逐条相同；重载/重开 mount 的真实 query 纳入计数。
- **CFPI-006：** r002 静态 clipboard 边界覆盖保持，不扩大结论。
- **CFPI-007：** 使用仅驻留内存的 SharedWorker 作为同会话跨 tab channel；登出或身份/组织变化清除 Worker state，禁止持久化和 OS clipboard。
- **CFPI-008：** page reload/reopen 明确产生 chart mount query dispatch，分别绑定独立 request ID。

## UI 与过滤树序列化

“复制过滤条件”和“粘贴过滤条件”放在 `core/core-frontend/src/views/chart/components/editor/index.vue` 的结果过滤行。Copy 仅当 source-read gate 精确 `Success` 且源树非空时启用；Paste 仅当目标是本 Slice 空目标、内部 clipboard 有效、当前用户/组织/会话相同且 target-manage gate 精确 `Success` 时启用。控件只触发 editor adapter，不修改 FilterTree 确认行为。拒绝/失败提示不包含过滤取值；成功提示仅在 commit 完成后出现一次。

Payload 的唯一 authority 是 `RowAuth.vue:197–245` 的 `dfsSubmit` 输出 `{logic, items}`。组节点的精确字段为 `enumValue, fieldId, filterType, term, timeType, value, filterTypeTime, timeValue, dynamicTimeSetting, subTree`；叶节点为 `enumValue, fieldId, filterType, filterTypeTime, dynamicTimeSetting, term, timeType, timeValue, value, type:'item', subTree:null`。复制时移除 `field` 对象、复制所有上述字段并递归复制数组/对象。CPI fixture 加入组节点 `dynamicTimeSetting:{}`。契约采用 UTF-8 JSON 的稳定键序列规范化：比较语义树时按字段集合精确相等，计算 1MB 大小时按协议唯一序列化字节数；源树、Worker 副本、目标树之间不共享可变引用。

## 跨标签内部共享与剪贴板生命周期

每个已登录应用实例连接同源 `SharedWorker`。Worker 只在内存持有一份 `{uid, oid, sessionEpoch, createdAtMonotonic, payload, digest}`；Copy 通过 MessagePort 发送 payload；Worker 在每个接收 tab 交付前核验当前 uid/oid/sessionEpoch，并返回独立深拷贝。不同 uid、oid 或 sessionEpoch 一律不交付。Worker 不写 localStorage、sessionStorage、IndexedDB、URL、Cookie、系统剪贴板或服务端。最后一个 tab 关闭后 Worker 终止，数据随之消失；新建 tab 只能从仍存活的 SharedWorker 取到尚未过期的剪贴板。

30 分钟以 monotonic time 计、访问/重验/重复粘贴不续期；到期清理。50 个 terminal leaves、UTF-8 payload ≤1,048,576 bytes；超限 Copy 失败且保留先前有效 payload。任何 tab 登出、用户/组织切换、sessionEpoch 更新都向 Worker 广播 clear 并立即清空 session state；成功 Paste 不消费有效 payload。CPI-031..040 保留 TTL/容量/清理/重复粘贴边界，CPI-056..059 测试跨标签同身份交付、跨用户/组织拒绝和跨 tab logout 清除。

支持能力边界：若目标部署不支持 SharedWorker 或 worker 初始化失败，则跨标签 Copy/Paste 关闭并解释当前浏览器不支持；不得静默退化为单标签、localStorage 或 OS clipboard。后续是否增加兼容 transport 须单独设计与验证，不改变当前 Goal 的跨标签义务。

## source-read、target-manage 与 dataset READ

三种授权分别处理，不互相替代：

1. **source-read（Copy）**：必须对当前 uid/oid、源 chart、source dataset 实时重新授权，精确 `Success` 方可读取/广播 payload。`view.customFilter` 已在前端、能打开 dashboard 或有 MANAGE 都不是授权 oracle。当前 `ResourceAuthApi` 没有调用者实时 source READ API；权限实现的合法来源也不可用。因此这是 `BLOCKED / UNKNOWN`。Copy 控件在此状态保持 disabled，任何未知/错误/撤权均拒绝读取和广播。
2. **target-manage（Paste）**：按当前产品已有 editor 管理路径检查具体目标 dashboard/content/chart；只接受明确成功。实际角色行为未验。
3. **dataset READ（Query）**：使用现存 `getData()` → 服务端 `ChartDataManage.calcData()` 路径实际执行；服务端拒绝或失败不提交 stage。

CPI-002 为 Copy 时 source-read deny 且断言 `sourcePayloadRead=false`、clipboard 不变；CPI-053..055 分别表达 allow、打开后撤权 deny、恢复后必须 fresh check。三案例都带 `authority_status=BLOCKED / NOT_RUN` 与真实 oracle 要求；它们是未执行的测试规范，不能转成 pass。未获维护者授权来源前不实现未知权限 API，也不将产品 Builder Entry 标为 READY。

## G2 staged query/render 与生命周期合同

现有活动路径 `views/index.vue:queryData/calcData` 写 query state/last request/loading；`ChartComponentG2Plot.vue:calcData` 写 error/chartData/drill/Store 并进入活动 `renderChart`。Candidate stage 不走该副作用路径。

Stage adapter 只支持普通 G2 line；不支持类型必须拒绝。Vue 在图表组件中以响应式列表创建每个 renderer host，节点由 Vue 创建和销毁，ID 唯一。传给 `G2ChartView.drawChart` 的是 `hostId:string`，绝不传 HTMLElement；每个 instance 绑定自身 hostId。活动 host 和 stage host 同尺寸同定位，stage 初始 `visibility:hidden; pointer-events:none`，不会以 `display:none` 造成 0 尺寸。

```ts
type StageHandle = {
  requestId: string
  hostId: string
  instance: G2Chart
  response: ChartDataResponse
  disposers: Array<() => void>
  dispose(): void
}

stagePaste(capture, clonedTarget): Promise<StageHandle>
commitPaste(stage, revalidateCurrentState): void
abortPaste(stage): void
```

`stagePaste` 用 `getData(clonedTarget)` 发起 query；响应只传给 detached renderer，不触碰活动 component state、Store、events、snapshot、loading/error。它调用普通 line 的 `G2ChartView.drawChart({container:hostId,...})`。Stage 和 active 必须共用一个接收 instance/host/chart 的 renderer lifecycle installer，分别为 instance 安装并登记 cleanup：line legend binding、tooltip carousel（缓存键使用 hostId）、G2 assist line、tiled legend/selection、slider 与 legend pagination，以及所有现有 G2 交互/主题 hooks。任何无法按实例隔离或释放的全局 hook 都禁止在 stage 上安装，此时 stage 失败并保持旧预览。

活动 resize observer 始终观察组件实际尺寸并只 resize 当前 `activeRendererId` 对应的 instance。host 交换不更改父容器尺寸。render queue 每次开始新活动 render、编辑目标变化或组件卸载时，先递增 generation、取消待提交 stage 并执行其 disposer；stage 完成后若 generation、target identity/revision/tree、用户/组织或 query digest 变化即 abort。活动 component unmount 时 dispose active 与全部 pending/staged instance；任何 disposer 幂等且每个 handle 只能销毁一次。Query/event listener、tooltip timer、legend adapter、assist-line adapter 均必须有实例级 cleanup。

Commit 在一个同步 JS task 中重新核验完整 capture、活动 generation 和 source/target Gate；再同步替换 activeRendererId、旧/新 host visibility、`myChart` 指针、editor `view.customFilter`、response/store revisions、单次 `calcData` snapshot 与单次成功提示。旧 instance 暂存为 rollback capsule，待下一次 paint 后再 dispose。同步步骤任何一步失败则恢复旧 host、instance、view、Store、error、snapshot 和提示计数，dispose 新 stage。异步 render 未 settle 或失败时不可 commit。若 host 交换、Vue 所有权或任一 hook 不能满足该同步边界，必须 fail closed；不许“先改 view 再活动 calcData”。

这些是待实施/验证的产品合同，不是已存在能力证明。Builder 如获后续准入，可信 RED/GREEN 必须使用真实 G2 line renderer 和浏览器环境，覆盖 target response 拒绝、hostId 容器、tooltip/legend、resize、host switch、render queue cancel、重复 paste、unmount、dispose 一次性和发布异常。

## 响应 tuple、请求账本与页面生命周期

`PasteCapture` 由 12 个字段组成：`requestId, uid, oid, dashboardId, contentId, targetChartId, targetRevision, targetTreeDigest, chartExtRequestDigest, priorErrorRevision, priorStoreRevision, priorRenderRevision`。query dispatch 与 response 逐字段相同，且 `requestId` 与本案例唯一 ID 相同；发布前逐字段与当时活动状态再比较。CPI-041..052 各仅改变一个字段，包含 requestId；其它字段全部不变。错配不发布、不覆盖并发写入，stage dispose 一次。

Cases 的有序 `query_dispatches` ledger 中每条实际 `getData()` 调用出现一次，字段为唯一 request_id、原因和 payload digest。事件必须以完全相同 request_id 对应一个 `queryDispatched` 与且仅一个 terminal outcome（resolve/reject/cancel/lateIgnored）。响应不额外计数。目标 gate 拒绝和 source Copy deny 不 dispatch。预览刷新是一次独立 query；纯重绘不 dispatch。浏览器 page reload 与 dashboard reopen 会 mount chart，mount query 也计数。CPI-028 测未保存重载的 paste + preview refresh + mount query，CPI-029 测保存后重开 paste + reopen mount query；保存本身是否发请求由实际源码和 RED/GREEN 定案，未观察前不得假设。

## 案例与验收顺序

机器案例为 `ChartFilterCopyProductIntegrationCases-r003.json`，59 项；每项 initial/expected 都投影同一 23 字段。覆盖嵌套 payload、成功与拒绝、失败原子性、取消与迟到、字段级 tuple 错配、目标切换、clipboard 边界、跨标签身份与 logout、preview refresh、page reload、保存重开及权限阻塞。案例本身未经执行，不是 runtime evidence。

允许完整产品 slice 验收的实际顺序：授权 editor 在同一 dashboard 建立同 dataset BAR source 与空普通 LINE target；有真实 source-read 成功结果后 Copy；Paste 并观察目标过滤树和折线预览同步变化；手动页面内刷新并确认树/数据一致；显式保存、离开并重新打开，确认树与 query 结果。失败路径要覆盖 source-read deny/撤权、target-manage deny、dataset READ deny、transport/timeout/malformed、取消/迟到 tuple、stage render/commit failure、外部 target update、跨标签隔离和保存失败。受限只读用户禁止查看/复制/粘贴、撤权恢复和组织隔离必须在真实隔离权限环境验证。

本版 Review 是本交付物最后一轮 3/3。若最终仍有 `NEEDS_REVISION`，不得第 4 轮重开或改名重置；保留所有 finding 与 Goal 未决项，继续其他独立、已准入且不依赖这些阻塞的 S02 工作。无论本版文档 verdict 如何，source-read 真实 oracle 仍缺失，未经单独运行权限验收，Q009权限要求、完整产品验收与 S02 Goal 均不能声明完成。
