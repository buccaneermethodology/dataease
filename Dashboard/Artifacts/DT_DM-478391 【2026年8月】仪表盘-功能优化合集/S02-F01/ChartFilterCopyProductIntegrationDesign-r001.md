# 图表过滤复制粘贴产品接线设计 r001

## 身份、Goal 边界与与旧交付物的区别

- Artifact ID：`S02-F01-chart-filter-copy-product-integration`，r001，独立产品实现切片。
- 产品范围：普通柱状图 → 同一数据集普通折线图、目标 `customFilter` 为空；覆盖真实编辑器入口、内部剪贴板、候选 query/render、目标预览发布、canvas 保存和重开。
- 原 S02 分母保持 10 Goal AC、26 must-have、16 产品义务，`Scope Delta: none`。本切片只是 Goal 的一个实现 slice，不把全 Goal 缩成此范围。
- 这不是对已满 3/3 轮的 `chart-to-chart-filter-copy-product-slice` 或事务合同 r003 的改名重审：旧交付物分别审查 MVP 入场与抽象事务 reducer；本交付物设计并实现实际 Vue/editor/chart component 接线和浏览器 Happy path，并吸收旧 Review 明确记录的未决 oracle。旧 verdict 和 finding 原样保留，不能由本切片将其改写为通过。
- 本设计仍是候选，不是 implementation admission。真实只读权限、source-read、dataset READ、撤权恢复以及无 XPack 的权限环境不以本地 admin/standalone/mock 替代，均保留 `BLOCKED / NOT_RUN`。

## 原始要求与有界验收

直接权威：`Goal.final.json#/must_have_ledger/20/requirement`（Q014）要求成功后目标预览立即显示新条件；取消/失败时不显示成功反馈、目标和预览保持原状；条件只有正常保存后重开才保留。`Goal.final.json#/must_have_ledger/15/requirement`（Q009）要求身份、数据权和编辑权每次重验，取数服从服务端数据权限链。

这份产品 slice 仅允许 chart→chart 同 dataset 的空目标；不扩成 query→query、chart↔query、非空目标、跨 tab clipboard 或完整权限验收。产品界面 Happy path 中“刷新”专指图表数据/预览刷新，不重载浏览器页、不离开编辑器；持久性只在显式保存后离开并重新打开时检查。未保存浏览器重载不得保留条件。

## 源码接线点与候选实现

- 源条件从当前编辑器已加载的图表 `view.customFilter` 读取；`FilterTree.vue` 是编辑入口；Copy 只能由现有编辑授权路径可达。内部剪贴板按 uid/oid 会话隔离，30 分钟、不续期、最多 50 terminal leaves、UTF-8 payload ≤1 MB；登出/换用户清除，绝不写 OS clipboard、localStorage 或服务端。
- 目标粘贴从当前普通折线图 `view` 与其空 `customFilter` 开始；目标与来源 dataset id 必须在 canonical identity 校验后相等。不得把 dashboard MANAGE、图表可见或按钮隐藏当 dataset/source-read 权限证据。权限服务/现有路径无法精确复验时拒绝并保持现态。
- 真实 query 必须使用克隆的目标 chart request 加候选 T 和本次当前 chartExtRequest，经现有 `getData()`/服务端 `ChartDataManage.calcData()` 路径执行；服务端 dataset READ 拒绝时不改编辑 view、图表数据/错误、Store、renderer 或 snapshot。query attempt 和 preview update 分开计数。
- 当前 `queryData()` 会写 `chartExtRequest`、last request info、loading 与 chart component 数据/错误；它不能直接充当 stage API。实现需要在 `views/index.vue` 与 `ChartComponentG2Plot.vue` 增加有界 staged adapter：只接收完整 cloned chart+response；候选绘制使用与目标相同尺寸/renderer 的隔离 detached container，不触及活动 `myChart`/DOM/Store。stage query 或 stage render 失败时销毁临时资源并返回失败。完成活动 target、uid/oid/contentId、target revision、tree digest 和 response tuple 二次校验后，才在一个同步提交区更新 `view.customFilter`、发布已验证响应/渲染、记录恰一次 snapshot 并显示一次成功提示；不自动保存。
- 临时 renderer 必须在提交前可完整销毁且不能影响活动实例；若 chart-view handler 无法在 detached container 安全绘制，产品 Builder 必须 fail closed，不允许改走“先改 view 再 calcData”。
- 打开 `ChartPasteTransactionalPreviewDesignReview-r003` 所记录的不准入项仍作为反例约束：完整状态和 query attempt 必须用统一字段投影；LINE-2 切换案例含完整独立 fixture；身份 variants 是可执行参数化案例；预览刷新与保存后重开分开定义。

## 原子状态与响应绑定

统一活动状态 `P` 至少包含：active target、uid/oid/dashboard/contentId、target revision、tree digest、chartExtRequest digest、component error+revision、chart data/store revision、render revision、snapshot count、clipboard id、success notice count、save attempt/result、query attempt/result、visible preview revision、pending transaction。测试中每个 Cases `expected_state` 必须列出完整字段，不用“省略代表沿用/变化”推断。

每次事务 capture `{requestId, uid, oid, dashboardId, contentId, targetChartId, targetRevision, targetTreeDigest, chartExtRequestDigest, priorErrorRevision, priorStoreRevision, priorRenderRevision}`。候选响应必须逐字段匹配 capture 和本事务 requestId；Commit 前再与活动状态核对。query attempt 只在 request 发出时 +1，response 成功/失败不额外计数；visible preview revision 只在活动 commit 时变化；detached render 不计活动 preview 更新。迟到、错配、取消或目标切换只丢弃事务并释放 stage 资源。

Gate、prepare、query、detached render 任一步失败，活动 P 完整保持，clipboard 保留；无成功提示、无 snapshot、无保存。成功 commit 一次更新为完整 T、snapshot +1、success notice +1、save attempt 不变。保存失败不回滚已提交但未保存的 T，只增加 save attempt 且标记 durable failure；只有保存成功后实际重新打开才标记 durable success。

## Cases 与用户可见验证

唯一机器可读案例在 `ChartFilterCopyProductIntegrationCases-r001.json`：统一 `observable_state_fields` 覆盖目标、身份、canvas digest、error/store/render、snapshot、clipboard、notice、query attempt/result、visible preview、保存/耐久状态和 decision。每条案例含完整 initial_state 与包含全部投影字段的 expected_state；身份变化和取消的各个变体分别有独立 case ID。Cases 顶层共享 chart fixture 同时定义 BAR-1、LINE-1 与 LINE-2 的完整数据集/类型/版本/tree/state digest，因此 active target 切换不依赖隐式生成状态。覆盖正常 Copy→Paste、Gate/source/target/dataset 拒绝、query 拒绝/异常、stage render 失败、逐阶段取消、请求迟到、活动目标切换、身份/版本变化、外写、query 计数、刷新与 save/reopen 边界、保存失败。

实际 UI Happy path：使用可交互编辑账号，在同 dashboard 中建立普通柱状图源及同 dataset、空 customFilter 的普通折线图目标；配置一个简单合法条件并 Copy；目标执行 Paste；观察过滤树和折线预览同时更新；触发图表数据刷新（不重载页面）并确认仍一致；显式保存；离开编辑页后重新打开并确认条件仍在且查询结果正确。失败 path 至少验证 dataset READ 拒绝/transport failure、取消、target switch/迟到响应和保存失败。

受限/只读账号的拒绝、source-read 保密、权限撤销/恢复及不同组织隔离必须在维护者提供真实隔离权限环境后另行执行；当前状态 `BLOCKED / NOT_RUN`，不得以此 UI Happy path 或候选代码冒充通过。

## Build/Validation 边界和准入预测

评审若准许本设计，Builder target 限于真实产品接线文件、定向组件/集成测试和本 slice 的 UI fixture；冻结 Design/Cases 不得被 Builder 修改。先建立同 identity 可信 RED，绑定全部冻结案例和本 slice 用户目标；通过精确 execution admission 后才改代码。GREEN 必须通过同 identity frozen Cases，并至少运行针对源配置、目标组件、query stage、detached render、Store/snapshot/保存路径的定向测试。随后由独立 Validator 实查代码差异、RED/GREEN、实际浏览器 Copy→Paste→preview refresh→save/reopen。

这最多能证明此 chart→chart 产品 slice 的具体行为。真实权限验收仍 `BLOCKED / NOT_RUN`，其他 Goal must-have 仍需逐项完成；不能因此将 Goal AC 状态或 S02 整体置为完成。
