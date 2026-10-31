# 图表过滤复制粘贴产品接线设计 r002

## 身份与边界

- Artifact ID：`S02-F01-chart-filter-copy-product-integration`，本交付物第 2 版；第 1 轮评审报告保持不变。
- 产品范围仍限普通柱状图 BAR-1 → 同数据集普通折线图 LINE-1、目标过滤树为空；覆盖编辑器真实控件、内部剪贴板、隔离 query/render、一次发布、预览刷新、显式保存和离开重开。
- 原 S02 分母不变：10 项 Goal AC、26 项 must-have、16 项产品义务；`Scope Delta: none`。这是 Goal 内的一片实现范围，不代表完整 S02。
- 真实权限验收仍 `BLOCKED / NOT_RUN`。本设计没有获得授权调用的 XPack 权限来源或真实隔离多用户环境；不以 standalone、admin 或 mock 代替。

## 本版修订清单

r001 Review 的 CFPI-001..006 均已映射到本版：CFPI-001 增加具体 UI 落点与 FilterTree 序列化 fixture；CFPI-002 冻结窄域 G2 staged adapter 接口、双容器所有权和一次发布边界；CFPI-003 列出当前可见 API 能力并将缺失的实时 source-read oracle 保持为显式 blocker；CFPI-004 增加完整 capture tuple 的字段级错配矩阵；CFPI-005 将 query attempt 改为逐案例有序 `query_dispatches`；CFPI-006 增加 TTL、容量、身份清理及重复粘贴案例。详见同版 Cases r002 和评审报告。

## 产品控件、事件及载荷

控件放置在 `core/core-frontend/src/views/chart/components/editor/index.vue` 的“结果过滤”行。标题右侧新增“复制过滤条件”；仅当当前 `view.customFilter.items` 非空且 source-read gate 明确允许时启用。其旁新增“粘贴过滤条件”；仅当当前内部剪贴板存在、未过期、uid/oid 仍匹配且目标图表类型为本切片普通折线图时启用。点击 Copy/Paste 均由 editor 组件处理，不进入系统剪贴板、localStorage、sessionStorage、URL 或服务端。拒绝时保留目标和预览原状并显示拒绝提示；失败绝不显示成功提示。

Copy 从 `view.customFilter` 深拷贝 `{logic, items}`，不复制 `field` 对象。依据是 `FilterTree.vue` 的 `changeFilter` 先删除叶节点 `field` 再 emit；`RowAuth.vue` 的 `dfsSubmit` 输出根 `{logic, items}`，组节点为 `{type:'tree', subTree:{logic,items}}`，叶节点为 `{type:'item',fieldId,filterType,term,value,enumValue,timeType,timeValue,filterTypeTime,dynamicTimeSetting,subTree:null}`。Cases r002 的 BAR-1 fixture 给出完整嵌套 AND/OR 树。深拷贝后源树 digest 必须不变，粘贴后的目标 `customFilter` 必须与 clipboard canonical tree 深度相等；不得对 source 或 clipboard 共享可变对象引用。

UI 修改只允许经现有 editor 编辑上下文触发，不在 `FilterTree` 的“确认”处理中隐式复制。Copy 完成提示不泄露字段取值或筛选值；粘贴的成功提示仅在最终事务 commit 后出现一次。点击取消不会写目标、发 query 或改变 clipboard。

## 授权边界与未决 authority

三个授权检查分层：

1. **Source-read（Copy）**：需要对当前用户/组织、源 chart id、source dataset id 的实时读取许可，许可必须是明确 `Success`；`view.customFilter` 已在内存、当前编辑页可见或拥有 dashboard MANAGE 均不能单独构成重新授权结果。当前 `ResourceAuthApi` 暴露的公开方法是查询已授权用户/角色，不提供调用者实时 source READ 判定；本轮没有找到可授权使用的其他核心 API 或 XPack 权限实现。故这一 Gate 的产品调用路径及撤权 oracle 仍为 **BLOCKED / UNKNOWN**，禁止实现为默认放行或猜造 endpoint。
2. **Target-manage（Paste）**：对当前目标 dashboard/content/chart 执行现有 editor 管理权限检查；只接受精确成功。当前角色权限的真实运行行为仍未验证。
3. **Dataset READ（Query）**：只由当前 `getData()` → 服务端 `ChartDataManage.calcData()` 的实际 query 路径证明；拒绝/异常不提交任何暂存数据。

source-read 未能由维护者确认权威 API 前，产品 Copy 控件必须 disabled/拒绝，不能把本 Slice 标为可 Builder。维护者后续提供授权实现或隔离实例时，需要将 source-read allow/deny、撤权后拒绝以及恢复后重新授权纳入独立权限验收；届时不能把该证据回填成当前已验证。

## Staged query/render 接口与资源所有权

当前 `views/index.vue:queryData/calcData` 会写 `chartExtRequest`、last request info、loading；`ChartComponentG2Plot.vue:calcData` 会写错误、chartData、drill 状态及 Store，再进入 `renderChart`。产品 adapter 不调用这些副作用路径。

本 Slice 仅支持目标普通 G2 line renderer。候选 adapter 必须提供以下接口，其他图表 library/type 均拒绝：

```ts
type PasteCapture = {
  requestId: string
  uid: string
  oid: string
  dashboardId: string
  contentId: string
  targetChartId: string
  targetRevision: number
  targetTreeDigest: string
  chartExtRequestDigest: string
  priorErrorRevision: string
  priorStoreRevision: string
  priorRenderRevision: string
}

type G2Stage = {
  capture: PasteCapture
  host: HTMLElement
  instance: G2Chart
  response: ChartDataResponse
  dispose(): void
}

stagePaste(capture, clonedTargetWithCandidateTree): Promise<G2Stage>
commitPaste(stage, revalidateCurrentState): void
abortPaste(stage): void
```

`stagePaste` 在当前图表组件的活动容器中创建唯一的 sibling host：与活动 host 同宽高，绝对定位覆盖但 `visibility:hidden; pointer-events:none`，仍保留布局尺寸。它直接调用 `getData(clonedTargetWithCandidateTree)`，响应不经过组件 `calcData`。随后仅用目标普通 line 的 `G2ChartView.drawChart({container:stageHost,...})` 创建独立 G2 实例；不得调用活动组件 `renderChart`、共享 `myChart`、`dvMainStore`、snapshot、事件总线或通知函数。成功 stage 由 `G2Stage` 单独拥有；任一失败/取消/过期必须 `instance.destroy()`、移除 sibling host 并释放监听器。

`commitPaste` 在同一 JS task 内再次核对完整 capture tuple、当前用户/组织、剪贴板有效性、目标 chart identity/revision/tree digest、query config、响应 request id 和已通过的 Gate。然后以不可观察的同步提交区完成：切换 stage host 可见/active host 标记；令活动 chart instance 指向 stage instance；更新 editor `view.customFilter`、`chartData`、last request/store revisions；只记一次 `calcData` snapshot 并显示一次成功提示。未按“保存”不落盘。先保留旧 instance、host、view/store/error/snapshot 投影作为 rollback capsule；任何同步发布步骤抛错时恢复整份旧投影、重新显示旧 host、销毁 stage，并不发成功提示。只有所有步成功，才异步销毁旧 instance/host。

如无法确认 G2 instance/事件监听器在 sibling host 切换后继续响应 resize、tooltip、legend、dispose，或出现 stage handler 的 Store/global 副作用，Builder 必须 fail closed；不得退化为先改 `view.customFilter` 再调用活动 `calcData()`。验证必须覆盖发布前后活动 chart 的 resize、交互、卸载与重复 paste 生命周期；静态接口定义不是安全 stage 证明。

## 响应绑定与计数 oracle

Request 和 response 必须携带完全相同的 `PasteCapture` 字段，逐字段精确相等；publish 前再逐字段比较当前活动状态。Cases r002 为 capture 中每一个字段安排单字段变异，其余字段保持相同；此外在 pending 时分别改变目标、目标 revision/tree、query config、error/store/render revision，期望拒绝发布并保留并发外写。错配 response 也必须拒绝并清理 stage。

query attempt 不从 `paste`、`commit`、成功/失败响应或 snapshot 推断。每个案例的 `query_dispatches` 按真实请求 dispatch 次序列出 request id、原因和 payload digest；其长度必须等于 `expected_state.query_attempt_count`。每一条 dispatch 对应一次 `getData()` 发起，失败响应仍计一次；source/target/dataset gate 拒绝、取消（dispatch 前）、stage render、commit 与重绘本身不增加计数。用户点“刷新预览”明确发起一个单独 `getData()`，页面不 reload；仅普通重绘则必须没有 dispatch。保存后离开/重开不计作粘贴 query，保存自身不触发隐式重复 query。

## 剪贴板生命周期

内部剪贴板按 uid+oid+登录会话绑定，创建后 30 分钟到期，读取、重新校验或重复粘贴都不续期；到期时清除并拒绝。最多 50 个 terminal leaf，UTF-8 序列化不超过 1,048,576 bytes；超过任一上限 Copy 失败且保留之前有效剪贴板不变。登出、uid 改变、oid 改变立即清除。成功粘贴不消费剪贴板，允许同会话再次 paste，但每次都重新校验权限、dataset 身份并单独 query。失败和取消不清空仍有效剪贴板。Cases r002 CPI-031..040 覆盖 TTL 边界/不续期、50/51 leaf、1MB/超限、uid/oid/logout 清理和重复 paste。

## 案例、范围与验证边界

机器案例为 `ChartFilterCopyProductIntegrationCases-r002.json`，40 项；每项 initial/expected 均必须完整投影统一 observable 字段。保留 BAR-1、LINE-1、LINE-2 完整 fixture。Cases 仍是设计 oracle，未被执行，不代表实现通过。

实际产品成功路径应为：授权 editor 在同 dashboard 建立同 dataset 的普通 BAR 源和空 customFilter 普通 LINE 目标；在结果过滤行 Copy 完整嵌套树；Paste 后观察目标树与折线图预览同时更新；手动刷新预览（无页面重载）后结果仍匹配；显式保存，离开编辑页再重开并确认树与 query 正确。失败路径至少包括 source-read deny/unknown、target manage deny、dataset READ deny、transport/timeout/malformed、取消、迟到 tuple 错配、stage render 与同步 publish 异常、目标切换、clipboard boundary 及保存失败。

真实只读用户拒绝、source-read/data READ、撤权恢复、组织隔离继续 `BLOCKED / NOT_RUN`。本版不宣称 Design Freeze 或 Builder 准入；source-read 权威接口仍缺失，G2 staged 实例生命周期仍须 RED/GREEN 和实际 UI 验证。必须先完成此版独立 Review，再按其裁定新建精确 RED 和 execution admission；未经准入不改产品接线。任何实现只覆盖本 Slice，不关闭 Goal 其他 AC/义务。
