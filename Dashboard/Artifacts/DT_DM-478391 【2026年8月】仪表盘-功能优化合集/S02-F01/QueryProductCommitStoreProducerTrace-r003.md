# QPC Saved Canvas Store Producer 源追踪 r003

状态：只读静态源追踪候选，第 3 轮修订版，待独立复审。它处置 [r001/r002 独立审查](reviews/QueryProductCommitStoreProducerTraceReview-r001.md) 的读集漂移、负向搜索边界和异步 gate 覆盖范围问题。执行边界来自 [QPC r006 独立语义复核](reviews/QueryProductCommitDesignDeltaReview-r006.md)：只追踪真实 Store context producer 与入口，不读取来源过滤配置、不接产品 UI/Store、不提交目标、不调用运行环境或权限接口。

## 权威范围与证据上限

Goal 原始分母仍为 10 项 AC、26 项 must-have、16 项产品义务，`Scope Delta: none`；S01 F01 仍为 `CONDITIONAL`，且与本静态追踪保持独立。真实权限模块和隔离多用户环境不可用，权限验收 `BLOCKED / NOT_RUN`。本文件只记录当前 checkout 的静态源映射。源码能说明调用关系和赋值顺序，不能证明 Vue 运行时对象身份、权限行为、产品保存/回显或异步竞态结果。

## 已证实的 source facts

1. **Dashboard 入口从路由/嵌入状态选择资源和分支。** `dashboard/index.vue` 的 `onMounted` 读取 `resourceId/pid/opt/createType/templateParams`；`opt=copy` 时权限检查的资源 ID 被置空，随后把 route/embedded 值放入组件 `state`。资源存在时，若本地 `DE-DV-CATCH-{resourceId}` 存在则打开缓存决策弹窗，否则调用 `initLocalCanvasData`；模板新建分支调用 `createInit`，再装入模板数据。[dashboard/index.vue:227-278](../../../../core/core-frontend/src/views/dashboard/index.vue:227)

2. **已保存资源的服务响应由 `canvasUtils` 解析并生成 Store 输入。** `initCanvasDataPrepare` 根据 `busiFlag` 选择 `findById` 或 `findCopyResource`，收到响应后将服务端资源字段映射到 `dvInfo`，解析 `componentData` 与 `canvasStyleData`，取出 `canvasViewInfo`，执行 `historyAdaptor`，再把这些值交给 callback。[canvasUtils.ts:597-659](../../../../core/core-frontend/src/utils/canvasUtils.ts:597)

3. **正常加载的 Store 发布是多个独立 setter。** `initCanvasData` 在 `onlyPreview` 为 false 时依次调用 `setComponentData`、`setCanvasStyle`、`updateCurDvInfo`、`setCanvasViewInfo`，随后异步刷新 linkage 与 jump info；callback 在这些同步 setter 之后执行。[canvasUtils.ts:662-682](../../../../core/core-frontend/src/utils/canvasUtils.ts:662) 当前源码没有把四项发布包装为单一事务，也没有由该发布过程直接创建 saved-canvas owner token。

4. **Store 保留的是多条彼此独立的状态轴。** `dvMain` 将 `componentData`、`dvInfo`、`canvasViewInfo` 分别存放在 Store state 中；`setComponentData` 与 `setCanvasViewInfo` 直接替换对应值，`updateCurDvInfo` 直接替换 `dvInfo` 并更新主题。[dvMain.ts:121-160](../../../../core/core-frontend/src/store/modules/data-visualization/dvMain.ts:121) [dvMain.ts:392-394](../../../../core/core-frontend/src/store/modules/data-visualization/dvMain.ts:392) [dvMain.ts:526-528](../../../../core/core-frontend/src/store/modules/data-visualization/dvMain.ts:526) [dvMain.ts:785-788](../../../../core/core-frontend/src/store/modules/data-visualization/dvMain.ts:785)

5. **缓存恢复通过对话框回调选择并经快照重新发布资源与画布状态。** `CanvasCacheDialog` 仅将用户选择通过 `doUseCache` 事件发给父 Dashboard，不自行读取或发布画布；Dashboard 对本地缓存做 `deepCopy` 后调用 `snapshotPublish`；`snapshotPublish` 再次依次发布 `dvInfo`、`componentData`、样式、视图信息及关联状态。[dashboard/index.vue:189-203](../../../../core/core-frontend/src/views/dashboard/index.vue:189) [snapshot.ts:139-147](../../../../core/core-frontend/src/store/modules/data-visualization/snapshot.ts:139) [CanvasCacheDialog.vue:50-62](../../../../core/core-frontend/src/components/visualization/CanvasCacheDialog.vue:50) 缓存来源是本地 `wsCache` 键；此路径没有调用 owner helper，也未在静态链路中看到登录/组织身份签名。

6. **模板和复制是不同加载形态。** `opt=copy` 进入 `initCanvasData` 时使用 `dashboard-copy` 的 `busiFlag`，最终选择 `findCopyResource`；模板新建则先 `createInit`，再分别写入模板的 `componentData`、`canvasStyleData`、`canvasViewInfo` 和 `appData`。[dashboard/index.vue:206-225](../../../../core/core-frontend/src/views/dashboard/index.vue:206) [dashboard/index.vue:292-319](../../../../core/core-frontend/src/views/dashboard/index.vue:292) 这些路径不能因资源结构相似就默认等同于已保存原资源编辑。

7. **页面卸载会终止现有 QSSDH session，但没有 saved-owner 生命周期调用。** Dashboard `onUnmounted` 调用 `invalidateQuerySingleSelectSession()` 并解绑浏览器事件。[dashboard/index.vue:380-385](../../../../core/core-frontend/src/views/dashboard/index.vue:380) 在当前 checkout 下，`rg -n "createSavedCanvasOwnerLifecycle" core/core-frontend/src` 仅命中 `query-single-select-saved-canvas-owner.ts:99` 的 helper 定义，没有发现调用点。该负向搜索仅覆盖 `core/core-frontend/src` 的文本内容，不覆盖其他工作树、生成代码或运行时动态引用；因此没有观察到 helper 在 loaded dashboard 上注册上下文、在资源切换/用户切换时失效，或把实际主体绑定进 owner。

8. **Canvas 与 VQuery 消费 Store/props，不是 owner context producer。** `DeCanvas` 从 props 接收 `componentData`、`canvasViewInfo` 并传给 `canvas-core`；VQuery 组件以其 `element` prop 和 Pinia `dvMainStore` 工作，提供 `query-lifecycle-allowed` 调用既有 QSSDH lifecycle。[DeCanvas.vue:56-64](../../../../core/core-frontend/src/views/canvas/DeCanvas.vue:56) [DeCanvas.vue:331-344](../../../../core/core-frontend/src/views/canvas/DeCanvas.vue:331) [Component.vue:66-73](../../../../core/core-frontend/src/custom-component/v-query/Component.vue:66) 该 gate 只检查 QSSDH lifecycle，不提供 saved-resource owner 或授权主体。

9. **原始对象规范化只出现在 QSSDH lifecycle 适配，不等于 Store producer raw identity。** `dvMain` 在注册 pending、检查 query allowance、准备确认、读取 design 等 QSSDH 方法中对组件参数执行 `toRaw`。[dvMain.ts:530-555](../../../../core/core-frontend/src/store/modules/data-visualization/dvMain.ts:530) 此事实没有建立 saved-owner helper 的 current-context getter，也不证明 canvas root/raw 引用会在实际 producer 和产品调用间保持一致。

10. **Q-VQuery 消费者当前还受 query lifecycle gate 与单选异步观察状态机约束。** `Component.vue` 向子组件注入 `query-lifecycle-allowed`，由 `dvMainStore.querySingleSelectAllows(element.value)` 决定是否允许查询生命周期动作。[Component.vue:69-72](../../../../core/core-frontend/src/custom-component/v-query/Component.vue:69) `Select.vue` 的字段变更入口先检查该 gate；对进入受支持的异步枚举观察分支的请求，响应回调再用 config raw identity、condition ID、generation 与 request input key 判断该观察响应是否仍有效。未建立 observation request 的 legacy/no-observation 分支不执行同一套响应期复验，不能将 gate 表述为覆盖所有枚举回调。[Select.vue:106,358-380,759-783](../../../../core/core-frontend/src/custom-component/v-query/Select.vue:106) 对晚到成功枚举若当前选值未包含在响应中，会启动一次 verification；完成后将当前值记为 valid 或 invalid，失败则为 unverified，结束 loading。[Select.vue:848-872](../../../../core/core-frontend/src/custom-component/v-query/Select.vue:848) 卸载会递增 observation source generation、清空活动请求并结束 loading。[Select.vue:1186-1190](../../../../core/core-frontend/src/custom-component/v-query/Select.vue:1186) 这是当前 Vue 代码的静态调用/分支事实，不证明网络请求竞态、组件运行结果或 saved-owner Store producer 存在；也不取代 QPC r006 对目标默认值、提交和真实权限的独立合同。


## r001 独立审查处置

- `BLOCK-QPC-TRACE-001`：已针对当前工作树重建 r003 Context/Card/Admission。原 Context 绑定的 `Sessions.md` 与 `Select.vue` 摘要只作为历史 r001 输入记录；r003 重新采集全部读集摘要，并补入 r001 Review。
- `NQPC-TRACE-002`：负向搜索现记录精确命令、搜索根和唯一命中；结论限当前 checkout 的 `core/core-frontend/src` 文本搜索，不外推到其他工作树、生成代码或动态引用。
- 修订没有改写 r001 trace、Review r001、Goal、产品源码、设计合同或权限实现；没有运行应用、数据库、网络或权限路径。

## 当前读集锚点

本版本以 `ContextBootstrap-QPC-store-producer-trace-r003.json` 绑定的当前 checkout 摘要为准；特别是 `Sessions.md` 与 `Select.vue` 已刷新至本轮采集的现态摘要。哈希仅用于字节身份，不证明文件来自 HEAD 或其他权威快照。

## 未知与未观察项

- **Saved owner 的真实 getter/source：** 当前 checkout 在 `core/core-frontend/src` 对 `createSavedCanvasOwnerLifecycle` 的文本搜索仅命中 helper 定义，无调用点；owner 的 `getCurrentContext` 仍为外部注入能力。不能声称存在有效 Store producer。
- **加载完成的原子可见时点：** setter 顺序可静态确认，但不是一个原子发布动作；未在应用运行态观察 watchers、组件 render、事件处理能否看到中间状态。
- **重开和缓存恢复对象口径：** API reload 会重新 `JSON.parse` 产生数据对象；local cache 先 `deepCopy` 再 snapshot publish。两条路径是否保留/替换 Vue raw 对象身份、如何与 canvas 组件实例对应，未运行验证。
- **资源切换/退出/主体切换：** 当前源码确认 dashboard 卸载使 QSSDH session 失效，`Select.vue` 卸载时使其本地异步观察请求失效；这两者均不是 saved-owner producer。未发现 saved-owner 的资源切换、登录用户/组织切换失效 producer。认证 Store、跨标签登录/组织事件也不在当前 owner helper 路径中。
- **身份与授权绑定：** `dvInfo.id`、`componentData` 引用、QSSDH epoch/revision、浏览器认证主体及权限凭证是不同域。当前读集未证明产品层将其安全绑定；权限必须由实际权限模块和隔离多用户测试另行证明。
- **组件形态覆盖：** 主 Dashboard、copy、template、cache restore、移动布局与多画布/嵌入入口的生命周期互通尚未由运行验证覆盖。

## 后续设计入口与准入边界

下一份产品入口设计可以基于上述 producer facts，具体裁定：如何定义 loaded-edit owner 的唯一发布点；资源/画布/root 的代际与 `toRaw` 对象身份如何形成同一快照；模板、copy-as-new、缓存恢复与正常重开的能力分类；页面卸载、资源切换及主体/组织变化如何失效；Store 多 setter 的中途状态如何避免被提交入口观察；授权主体从何处取得并如何再次校验。设计必须把组件根、目标选择、快照调用、物理历史追加、下游查询请求及保存/重开回读分成独立 oracle。

在公开权限契约、隔离多用户环境和新一轮完整 Builder 准入具备前，source-read、暴露可复制 UI、目标提交、真实权限判断都保持不准入。本静态追踪不关闭任何 Goal AC、must-have 或产品义务。
