# Chart Filter Copy Product Integration Design 独立评审 r001

## 双 verdict

- **Design Freeze：`NEEDS_REVISION`。** 本设计保留了 Goal 原分母并明确事务失败/成功边界，但产品 Copy/Paste 入口及真实过滤树 payload、staged G2 渲染隔离与发布接口、source-read 权限检查路径尚未具体到可实现/可验收的产品合同；案例也未完整绑定响应 tuple、query dispatch 与 clipboard 生命周期边界。
- **Product Builder Entry：`NOT_READY`。** 本轮只审查设计冻结和 Builder 入场，不运行可信 RED/GREEN、构建或 UI。尚无证明候选 adapter 可安全接入实际 renderer，也无精确权限 oracle 和真实权限实例；不得启动真实产品 Builder 或用 mock/standalone/admin 替代。
- **轮次：** `S02-F01-chart-filter-copy-product-integration` 第 **1/3** 轮。本上限属于此交付物，不限制 S02 其他独立交付物；不得重开已满 3/3 轮的旧交付物。
- **声明上限：** 只审查此新产品接线候选 r001 的合同、30 个案例和静态源码接线可行性；不证明 UI、权限、保存重开运行行为或完整 F01/S02 Goal。

## 审查基线与方法

Lane card canonical SHA-256 为 `579885a3b6ef979268ccb19499de1ec12a0693090eb3ddc76e83d38a10e1219a`，确定性校验 `pass`。本轮专用 ContextBootstrap 共 **25 项**必读摘要，摘要全部与当前文件一致，`skipped_reads=[]`；无 source drift。被审 Design SHA-256：`3c467085491dd8376cde9d1fac7361b16fc0956caaee64f5456356eda0769fb5`；Cases SHA-256：`eb508382ab94cb87e4a4afd9c3949ebad5e996076578298c2eb8c2c79e5bf6e7`。

逐项检查了 30 个 Cases 的 `initial_state`/`expected_state`：两者都恰好覆盖统一的 23 个 `observable_state_fields`，没有缺字段或额外字段。BAR-1、LINE-1、LINE-2 都有共享图表状态 fixture；LINE-2 切换用例不再依赖隐式合成。静态核对范围包括 FilterTree/editor、views query/calc 路径、ChartComponentG2Plot、getData、ChartDataManage.calcData、Store/snapshot 以及旧 r003 reviews。

未构建、未启动应用、未操作浏览器/UI、未调用 API/权限服务或数据库；这些动作超出本 review card。真实 XPack 权限环境按已有权威记录仍为 `BLOCKED / NOT_RUN`，不能以当前 standalone/admin 或替补权限实现验收只读用户、source-read、dataset READ 撤权及恢复。

## 历史 findings 吸收状态

| 历史发现 | 本候选状态 | 本轮判断 |
|---|---|---|
| Chart→Chart r003：失败必须完整保留旧目标/预览；每次粘贴前重验 dataset READ；source-read 与只读用户需真实授权 oracle | Design 明确先 staging、失败不发布，并保留权限验证阻塞；但实际接线及精确 source-read 路径仍未证明 | **部分吸收**；由 CFPI-002/003 继续跟踪，不改写旧 verdict |
| Chart→Chart r003：完整树/payload、真实 happy path、保存重开、MVP 范围及后续分层 | Design 规定 bar→line 同 dataset、空目标和保存后重开，保留 10 AC/26 must-have/16 产品义务、`Scope Delta: none`；本 Cases 没有完整合法树输入 | **范围与耐久语义已吸收；payload fixture 未闭合**，见 CFPI-001 |
| Chart→Chart r003：clipboard 身份、生命周期、TTL/容量 | Design 声明 uid/oid 隔离、30 分钟、50 leaves、1MB、登出/换用户清理；当前案例仅显式覆盖 expiredClipboard，未覆盖精确容量及身份生命周期 | **合同已吸收，验证覆盖未吸收**，见 CFPI-006 |
| Transaction r003：状态 projection、query 计数、LINE-2 fixture、variants 及预览刷新/重载歧义 | 完整 23 字段投影、独立 LINE-2 fixture、uid/oid/content/revision 独立案例，以及 `previewRefresh(noPageReload)` 均已加入 | **大部分吸收**；query dispatch 与响应 tuple 覆盖仍不完整，见 CFPI-004/005 |

旧 Chart→Chart r003 与事务合同 r003 均保持其原报告、原 verdict 和 3/3 轮次。本候选有独立 artifact ID，是新的产品集成 slice，不是旧交付物改名或自动修复旧 verdict。

## 全量 findings

### CFPI-001 / P1 / OPEN：Copy/Paste 产品入口与真实源过滤树 payload 未冻结

**证据：** Design「源码接线点与候选实现」「Cases 与用户可见验证」；Cases `shared_chart_fixtures` 只记录来源 `tree_digest=source-tree-T`、目标状态 digest 和类型。Copy/Paste 事件使用抽象 `copy(source=BAR-1)`、`paste(target=LINE-1,gate=pass)`，没有实际可交互控件/菜单/键盘入口、事件归属和点击后的可观察反馈，也没有一棵可用于校验复制完整性的真实合法 `customFilter` 树（包含嵌套关系、fieldId/类型、操作符和值）。

当前 `FilterTree.vue` 只有新增/确认/取消对话框与 `filter-data` 输出（`core/core-frontend/src/views/chart/components/editor/filter/FilterTree.vue:7-45,83-103`）；`editor/index.vue` 中已有的 copy 入口针对 chart fields，不是 customFilter。故设计要求真实 editor Copy/Paste，但源码没有该产品入口可直接复用的证据；只有 tree digest 也不能证明复制 payload 或目标树结构相同。

**最小修复：** 明确 Copy/Paste 控件和产品操作所在组件、可见/启用条件、事件到 adapter 的路径、成功/拒绝提示；在共享 fixture 放入完整 source `customFilter` 结构与预期目标结构，至少覆盖简单合法条件及一个嵌套 AND/OR/多叶形式，并定义深拷贝/无来源变更 oracle。若本 slice 仅做简单单条件，应明确限制且不移除 Goal 的完整树义务。

### CFPI-002 / P1 / OPEN：detached G2 stage 与活动 renderer/Store/snapshot 原子发布仍是概念要求

**证据：** Design 要求 staged adapter 在 detached container 绘制，与活动 `myChart`/DOM/Store 隔离，并在复验后同步发布目标 view、响应/渲染、snapshot 和提示；但没有冻结可调用接口、renderer instance 创建/销毁所有权、detached DOM 尺寸/生命周期、stage 成功如何转换为活动 DOM、发布时若 DOM/Store/snapshot 部分操作抛错如何回滚。

当前 G2 渲染路径持有组件级 `myChart`，共用 render queue/版本号；活动重绘会先销毁当前实例，再对活动 `containerId` 调用 `drawChart`（`ChartComponentG2Plot.vue:691-755`）。查询组件也会写 `isError`、`errMsg`、`chartData`、drill state、Store 原始数据，并进入 `renderChart`（`:539-620`）；`views/index.vue` 的 `queryData/calcData` 更新 last request info、`chartExtRequest`、loading 再调 chart component（`:665-712`）。这条现有路径不能直接作为 detached transaction；当前源码也未证明可在隐藏/脱离 DOM 的目标尺寸上调用 handler 而不触及全局资源。

**最小修复：** 在设计中给出精确 staged adapter contract 和所有权图，说明 detached chartView 如何获得与目标相同的有效尺寸/配置、如何独立 query/render/dispose，以及成功后怎样一次发布并在任何发布失败时恢复完整 P0/P1。提供被调用 handler 的能力边界证据；若不能安全 stage，明确此产品路径 fail closed，不允许退化为先修改活动 `view.customFilter` 再 `calcData`。此 finding 是入 Builder 前的接线设计 blocker，不要求凭静态 review 证明运行成功。

### CFPI-003 / P1 / OPEN：source-read 授权检查没有绑定到具体 API/拒绝 oracle

**证据：** Design 只写「Copy 只能由现有编辑授权路径可达」「权限服务/现有路径无法精确复验时拒绝」。未指出 source `customFilter` 读取时调用哪条受保护 API、如何对当前 uid/oid/源 chart/dataset 做实时 READ 检查、何种明确响应才允许复制，以及授权在复制后、粘贴前被撤销时如何阻止 payload 被读出/消费。当前过滤配置在编辑器已加载的 `view.customFilter` 中；本地存在编辑器状态并不能单独证明 source-read 授权仍有效。

**最小修复：** 将 Copy 的 source-read 与 Paste 的 target MANAGE、每次 query 的 dataset READ 分开列出具体调用链及允许/拒绝 oracle；只接受精确成功结果，任何权限/身份状态未知或服务不可用均保持原态并拒绝。真实多用户/撤权行为继续标 `BLOCKED / NOT_RUN`，等待维护者提供权限模块来源或隔离实例，不能用 standalone/mock 代替。

### CFPI-004 / P2 / OPEN：迟到响应绑定案例没有覆盖 Design capture 的全部关键字段

**证据：** Design capture 包含 `requestId, uid, oid, dashboardId, contentId, targetChartId, targetRevision, targetTreeDigest, chartExtRequestDigest, priorErrorRevision, priorStoreRevision, priorRenderRevision`。Cases 有 uid、oid、content_id、target_revision 四个独立变化案例，但没有 `dashboard_id` 变化案例，也未对 `target_tree_digest`、`chart_ext_request_digest`、prior error/store/render revision、目标 chart ID 分别制造单字段错配。多数事件只写 `stageSuccess(request=1)`，没有携带其完整 capture/response tuple，无法据当前案例证明每个字段都参与 stale-response gate。

**最小修复：** 为 capture 中每个需要参与匹配的字段增加单字段错配案例，或提供可执行参数化案例矩阵；每个成功/失败/迟到响应事件显式绑定完整 tuple，并分别证明 response 错配和活动状态在等待期间变化时均不发布、不覆盖外写状态。用例数量可参数化，但必须能逐字段独立判定。

### CFPI-005 / P2 / OPEN：query attempt 与预览刷新发请求的计数不能由事件序列唯一核验

**证据：** Cases oracle 规定“只在 query request dispatched 时计数”。CPI-001、CPI-028 的 query attempt 期望为 2，但事件只显式记一次候选 `queryAttempt(request=1)`（CPI-028 连候选 attempt 也由 `commit(T)` 暗含），`previewRefresh(noPageReload)` 没有说明是仅刷新可见层还是再次 dispatch query；CPI-017/018 在 `cancel(stage=queryPending/afterQueryBeforeRender)` 时期望为 1，却没有显式 `queryAttempt` 事件。CPI-020 的两个 paste 也期望 2 次，但只由 `request=1/2` 表达。源码实际 `queryData` 会 debounce 后进入 `calcData`、最后调用组件，预览刷新是否走这条 query 路径会影响准确计数（`views/index.vue:665-712`）。

**最小修复：** 每个案例显式列出 `queryDispatch(requestId, payloadDigest)` 与其结果；预览刷新如会取数就另列请求，如只重绘则明确无 query dispatch。取消阶段在发请求前/后分开定义，并让 expected count 等于 dispatch 事件总数。对 CPI-020 显式记录两次 dispatch。

### CFPI-006 / P2 / OPEN：clipboard 的 TTL/容量和身份清理合同没有对应验证案例

**证据：** Design 声明剪贴板 uid/oid 隔离、30 分钟且不续期、最多 50 terminal leaves、UTF-8 payload 不超过 1 MB、登出/换用户清理；Cases 中只有 `expiredClipboard`，没有恰 30 分钟边界、不续期、恰 50/51 leaves、恰 1MB/超 1MB、uid/oid 改变与登出后清理、重复 paste 是否消费/保留等案例。`identityMissing` 不能代替更换为另一有效用户或组织的隔离验证。

**最小修复：** 给当前 slice 明确这些约束哪些由已验证 helper/独立合同承担；若本产品 slice 声称实现完整 clipboard 生命周期，则在 Cases 加边界和清理 oracle。否则明确本 slice 不实现/不验这些项目，仍保留在原 Goal 分母与后续 AC backlog；不把合同文字视为测试通过。

## 已检查且未发现新增问题的维度

- **Goal scope：** 保留 10 项 AC、26 项 must-have、16 项产品义务，`Scope Delta: none`；slice 有界为普通柱状图到同数据集普通折线图、目标过滤树为空，没有把窄 slice 冒充完整 S02。
- **失败与成功事务语义：** Design 规定 Gate/prepare/query/stage-render 失败不修改活动 P、无成功提示/snapshot/save；提交一次改变完整 T；保存失败保留已提交但标记非耐久。比旧 Chart→Chart r003 中“异步失败还保留新树”的合同更符合 Q014，仍需实际实现和验证。
- **保存/重开与刷新边界：** Design 明确预览刷新不重载页面，未保存重载恢复最后持久状态；CPI-028/029/030 分开表达未保存重载、显式保存重开、保存失败，已消除 transaction r003 的“刷新 dashboard”歧义。
- **并发/失败类别：** Cases 覆盖 dataset READ 拒绝、transport/business/timeout/malformed、stage render failure、分阶段取消、迟到响应、目标切换、外写 P1 和保存失败；这些覆盖方向正确，但不替代缺失的绑定和计数 oracle。
- **状态投影/目标 fixture：** 30 个 initial/expected state 均全量覆盖 23 字段；BAR-1/LINE-1/LINE-2 fixture 已显式存在，旧 transaction r003 的 LINE-2 基线问题已修复。
- **权限声明：** 没有把 standalone、admin 或 mock 写成真实授权验证；只读角色及撤权仍明确阻塞，符合现有权限证据边界。

## 未检查项与原因

- 未执行实际 Vue UI Copy→Paste→预览刷新→保存→离开重开；本轮为只读设计 review，Card 禁止运行产品 UI/构建/数据库，且缺少可信 Builder admission。
- 未测试真实 source-read/dataset READ/target MANAGE、只读用户查看/复制/粘贴阻止或授权撤销/恢复；当前无已确认加载 XPack 权限实现的隔离多用户实例和受限账号。维护者尚未提供权限模块授权来源或可用测试实例；依据用户指示继续将它们标为 `BLOCKED / NOT_RUN`。
- 未运行 RED/GREEN、构建或浏览器自动化；30 个 JSON 案例目前是静态合同，不作为可执行测试或产品行为证据。
- 未验证其它图表组合、query→query、跨 tab clipboard、非空目标覆盖、完整 F01/S02；这些不属于此有界产品 slice，但仍在原 Goal 分母。

## 修复后准入预测与下一步

一次性处理 CFPI-001..006 并产出新的独立 Design/Cases revision 后，预计可重新申请本**新产品集成设计交付物**的 review（不重开旧 r003）；若设计给出可核对的 staged adapter 接线、完整案例输入/响应/计数、权限路径及 clipboard 范围，则可争取 `PASS_WITH_BOUNDS`。这只是准入预测，不构成当前冻结或 Builder 授权。

在该交付物冻结之前，不应开始改动真实产品接线。修订后继续流程：先建立绑定冻结 Cases 的可信产品 RED；再以有效 admission 精确绑定 Goal、Contract/Cases、Design、当前 topology、action 与 canonical target；实施后运行同 identity GREEN，并由独立 Validator 实查 diff、浏览器 happy path 和实际失败原子性。真实权限环境仍是单独的验收阻塞；没有它就不能宣称 Q009 权限行为、F01 或 S02 Goal 达成。所有未决问题留存为 open，不从 Goal 分母中删除或降级。

## 最终裁定

本候选对 Goal 范围、失败/成功事务语义、保存重开、LINE-2 fixture 和大部分 transaction r003 finding 的修复方向正确。仍有 6 项开放 finding，其中 3 项 P1 是产品接线和权限冻结 blocker，另有 3 项 P2 使完整用例 oracle/clipboard 合同不闭合。因此本交付物第 **1/3** 轮结论为 **Design Freeze `NEEDS_REVISION`、Product Builder Entry `NOT_READY`**。本报告未运行构建/产品/权限验收；不改变 Goal 状态，也不声称 S02 完成。
