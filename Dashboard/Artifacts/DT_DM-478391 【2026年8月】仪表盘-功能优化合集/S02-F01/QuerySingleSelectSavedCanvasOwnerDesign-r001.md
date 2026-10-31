# 已保存画布单选查询 owner 生命周期设计 r001

状态：`DESIGN_CANDIDATE_REVIEW_REQUIRED`。本文件只定义现有已保存、非模板仪表盘完成加载后的进程内 owner 生命周期，不允许复制/粘贴入口接线。它承接 QPC r005 暴露的 owner 缺口，目标是为后续独立适配提供不依赖序列化恢复的身份边界。

## 目标与边界

允许当前应用实例为已加载的一个现存仪表盘建立短生命周期 owner，使后续目标身份可以绑定该资源实例。该 owner 只认证“当前 Store 中这一对象属于当前加载的资源实例”，不认证用户、组织、资源查看/编辑权限，也不批准来源配置读取或目标写入。权限环境与授权 producer 未就绪前，不添加可见 UI、复制/粘贴动作、`readDesign` 或提交调用。

本设计保留原 Goal 的 10 项 AC、26 项 must-have、16 项产品义务与 `Scope Delta: none`。模板编辑、copy-as-new、跨组件类型、嵌套查询组件及权限授权均不由本切片覆盖或排除在父 Goal 外。

## 当前源码边界

`createQuerySingleSelectLifecycleOwner().beginSession()` 当前拒绝非空 `resourceId`，要求 `isTemplate=false`、`createInitCompleted=true` 与 `rootEmpty=true`，且 `registerPending()` 要求 `topLevelCount===1`。`Dashboard/index.vue` 的已有资源路径在 `initLocalCanvasData()` 成功回调后触发 `onInitReady({resourceId})`；copy-as-new 仍以新建流程保存。当前 owner 没有权限 provider，也没有从序列化 JSON重建能力的合法路径。

## 候选生命周期契约

1. **仅在加载完成后开始。** 新增独立的 `beginLoadedResourceSession(context)`，不改变现有创建型 `beginSession()`。输入必须精确绑定同一个非空资源ID（router/embedded route、已加载 `dvInfo.id` 与初始化回调）以及当前应用实例的 live Store root。ID 按现有 Long/String 传输规则规范化后比较，不转换为可能丢精度的 JS number。
2. **排除歧义入口。** `loadState` 必须是 `ready`，`isTemplate=false`，`operation=edit` 且 `copyMode=false`。模板和copy-as-new不进入 saved-resource mode；原创建流程行为保持不变。加载缓存或恢复未保存快照时，只有用户完成既有恢复选择并且 Store 已发布最终 root 后才可开始；恢复对话框打开期间不发 owner。
3. **身份是进程内能力，不是保存字段。** 开始时生成新 epoch，并在 `WeakMap`/闭包中绑定资源ID、当前 canvas-instance token 与 live raw root。epoch、token或owner对象不序列化；reload只允许从新的实际加载回调建立新 epoch，普通 JSON、剪贴板或历史快照均不能重建。
4. **按目标注册而非全局唯一。** loaded mode 可以有多个顶层 VQuery。`registerPending` 必须同时核对 owner phase、当前资源ID、当前 Store root identity、目标组件原始对象身份、目标ID唯一且类型是 VQuery；只注册本次操作指定的目标。0个目标、重复ID、clone/raw身份不一致或根实例已替换时拒绝；拒绝不能产生读配置、缓存、历史、dirty、预览、查询或保存副作用。创建型 mode 继续维持原单一顶层VQuery限制。
5. **权限独立。** owner 只提供 `resource-bound / instance-bound` 生命周期事实，不输出 `authorized/authenticated/permission granted`。查看来源配置前仍需公开权限契约确认当前主体/组织/source resource/read operation；写入前另验目标资源、数据集访问与目标编辑，每次确认前重新授权。撤权、用户或组织切换必须由真实 auth/permission lifecycle 发出失效事件；当前环境没有该事件来源，因此这些生产接线继续 `BLOCKED / NOT_RUN`。
6. **提交和保存不在本切片。** 本设计不改变 `prepareConfirmation/commitConfirmation` 的完整根替换协议，也不把 created owner 当作能合并并发 Store 编辑的证明。saved mode 的 `readDesign`、复制、粘贴、commit、snapshot/history、preview、query 与 save 操作保持关闭，直到另一个设计为其定义当前根重验、目标局部替换/并发语义与真实授权绑定。
7. **失效规则。** route resource变更、canvas实例卸载/重载、模板或copy模式变化、root owner显式invalidate时立即清空当前registered target并递增token generation。auth subject/org变化需要外部真实provider通知；owner自身不推断。旧epoch、旧raw对象和旧prepared handle 永不复用。

## 测试和不变量

[Fixtures r001](QuerySingleSelectSavedCanvasOwnerCases-r001.json)冻结14个正反例：ready绑定、ID不符、空ID、加载中、template、copy-as-new、JSON clone拒绝、无Query目标、多Query中的唯一raw目标、外来raw对象、资源导航失效、auth change外部阻塞、reload epoch隔离与创建流程不变。所有例均要求 `source_read=false` 与 `paste_commit=false`；本设计不证明任何权限行为。

RED/GREEN只允许针对新的纯 owner-lifecycle mode helper及其同一fixture runner；不得连接组件copy菜单、查询配置展示、clipboard、Store提交、snapshot、preview、网络、权限mock或生产测试用户。实现仍需冻结精确source/test targets、可信RED及逐target admission，再由独立Validation复核。

## 准入判断

本候选需独立复审，尤其检查 live Store root 来源、copy/create 分流、多个Query目标注册、权限声明分离与invalidate行为。即使有界设计通过，许可范围最多是 detached lifecycle helper；不能因此准入 product UI/Store、来源读取或目标commit。
