# 图表过滤粘贴事务式预览/提交合同独立评审 r002

## 双 verdict

- **Design Freeze Validity：`NEEDS_REVISION`。** r002 已实质关闭 r001 的三个 finding：定义完整 chart P0、私有 query/stage-render 和发布准备失败语义；外部目标写入后保留 P1；逐阶段取消及逐字段 response tuple 均有案例。但新 Cases 的 CTPT-007 把“已经提交 T2”的后置状态同时写成 `P0-tree`，CTPT-013 又把已成功提交的 error revision 从 `T-error` 写回 `P0-error`；此外没有定义共享初始 fixture。因而成功提交/保存失败的纯模型仍没有唯一、可复现的 oracle。
- **纯状态模型 Builder Entry：`NOT_READY`。** r002 已足以限定模型的纯决策边界，真实权限未知不阻止纯模型；但 Cases 的成功后状态冲突和未绑定的基线状态须先修复并冻结，当前不能启动 Builder。产品 Builder 仍被 staged renderer 和真实权限/source-read 缺口阻断。
- **轮次：** 本独立交付物 `S02-F01-chart-paste-transactional-preview-contract` 第 **2/3** 轮；上限仅属于该交付物，不限制整个 S02。
- **声明上限：** 只审查候选事务合同、Cases 静态一致性及纯状态模型入场；不证明产品接线、图表 UI/renderer、真实权限、保存重开或 Goal 完成。

## 审查基线

Card `S02-F01-CHART-PASTE-TRANSACTIONAL-PREVIEW-DESIGN-REVIEW-r002` canonical SHA-256 `1e9eb77aeb1e68c9f9001898a039ae5cb5859232c49c1348588e1cd6f1e269ce` 校验通过并读取 renderer 输出。Context SHA-256 `2e87347cd38c6d10d75b849f9e5d18f83b0085e797a7270664b3932a32f59260` 验证 exit 0；Topology `Topology-actual-r374.json` SHA-256 `2aaa04fbbc6bf3089ac76e6a4b77e6d32b27285dbee11a230c9c02804cf102d9` 对应本任务。审查读取 rendered Card/Context、Design/Cases r002、r001 Review、Goal Q009/Q014、S01 Entry Packet、权限环境及已绑定前后端调用点；没有运行构建、测试、应用、数据库、API、UI 或权限行为。

被审 Design SHA-256：`0a86c3ca6f642ffb027b1b295fdbe493a4d7317a8e54e5b70bd47f1c2f9aef1d`；Cases SHA-256：`24959d618a5a2ef2f0189576820e709f412be83f4ee48e88b6bbc5c22a9405ad`；r001 Review SHA-256：`dd7c45a6ab801a8d8570012bcd50324d54dcf0a9b9f0fc76e371bbf32dc62464`；Goal SHA-256：`28c94d3c35d4ce0a891ce77ecc915932d67f88ef813f3d2815dc0dce11f91b64`。Authority Materials 为单独交付物，AM-09 仍 OPEN；该状态不覆盖 Goal Q009/Q014 的直接条款，也未被本评审判为通过。

## r001 findings 全量 disposition

| finding | r002 disposition | 依据与剩余边界 |
|---|---|---|
| CTPR-001 / P1：完整 P0、现有 chart request/error state 和 query/render publication 失败 oracle 不完整 | **CLOSED（合同层）** | Cases 增加 `chart_ext_request_digest`、组件错误、data/store/render revisions；CTPT-006 分列 query reject、业务错误、timeout、stage-render failure、publish preparation failure；Design 明确 staged response 与原图表隔离、成功才发布，并承认现有路径不支持。当前产品实现仍不满足这个前提，产品 Builder 仍 blocked。 |
| CTPR-002 / P1：外部目标改动时回到原 P0 的 oracle 可能覆盖并发写入 | **CLOSED** | CTPT-009 以现态 P1 验证身份/内容绑定变化；CTPT-010 明确同一目标外写 P1 tree/revision/request/store/render 并断言保留 P1、只忽略陈旧 response，不加本事务 snapshot。 |
| CTPR-003 / P2：缺阶段取消和完整 response tuple | **CLOSED** | CTPT-011-01..07 覆盖 Gate 前至 stage-render 后的取消以及取消后迟到成功；CTPT-012 对 request、target、uid/oid、contentId、revision/tree/request/error/store/render 各绑定字段构造单字段错配 tuple。 |

上述关闭只说明 r001 要求已被 r002 文档覆盖，不等于模型 RED/GREEN 或产品运行验证。以下是本轮新发现。

## 新增 findings

### CTPR-R2-001 / P1 / OPEN：成功事务后的活动状态与已提交状态相互矛盾

**位置：** Cases CTPT-007、CTPT-013；对照 CTPT-004。

CTPT-007 先以 request 2 成功并执行 `commit(request=2)`，预期 `committed_tree_digest=T2-tree`、`chart_ext_request_digest=T2-request`、store/render revision 为 T2，但同时把活动 `target_tree_digest` 仍写作 `P0-tree`。按照 Design，commit 会将 T 写入活动目标；“成功提交 T2”与目标仍为 P0 不能同时成立。该案例也给成功提交后的 component error 保留 `P0-error`，而 CTPT-004 的同类成功提交结果是 `T-error`。

CTPT-013 声明 `precondition=CTPT-004 committed T`，其目标、请求、store、render 与 snapshot 使用 T 的提交值，却将 `component_error.revision` 再设为 `P0-error`。模型按这两条成功路径无法得到唯一的 post-commit 状态；若按预期字面实现，会把活动 target、成功渲染和保存失败事件拆成互不一致的状态。

**要求：** 统一成功 commit 后的完整状态 oracle。CTPT-007 应让活动 target tree/request/error/store/render revision 与 T2 一致，旧请求迟到只忽略、不改回 P0；CTPT-013 应完整复用 CTPT-004 的 T 状态，只将 durable save 结果标为失败。同步明确 snapshot 与一次 success notice 只归属于已提交的请求。

### CTPR-R2-002 / P2 / OPEN：Cases r002 没有冻结可复用的初始状态 fixture

**位置：** Cases r002 顶层；CTPT-001..013 的 `begin(binding=captured)` 与 P0 符号。

r001 有 `initial_state`；r002 删除了该 fixture，改加 `binding_fields` 和 `full_observable_state_fields` 的字段清单，但字段名不定义各测试初始值。多数案例引用 `P0-tree`、`P0-request`、`P0-error`、`P0-store`、`P0-render`、snapshot 4、notice/save 0，然而顶层没有给出统一的 P0 对象、active target、clipboard 状态或这些基线计数。CTPT-004/012 中出现完整响应 tuple 只能局部推知部分值，不能为所有案例的 `begin(binding=captured)` 提供共同、正式的初始状态；CTPT-005 还单独依赖 `clipboard_id=T-valid`。

**要求：** 加回唯一的共享 `initial_state`（或等价、具 schema 的 case fixture），定义活动目标及完整 tree/revision/request/error/store/render、clipboard、snapshot、notice、save 和 query 基线。每个案例若改变基线，显式提供操作前状态；response fixture 从该 state 构造，只差一个字段的错配测试必须能机械复现。否则同一 Case 可由不同 P0 fixture 获得不同 verdict。

## 权威、权限与调用链评估

- **Q014：** r002 的语义忠实于 Goal：取消/query/renderer/publication 失败不提交 T、不刷新可见预览、不成功提示、不保存；成功时先 query + 私有 stage render，绑定仍匹配后一次 commit 并立即发布 T 的预览。候选合同将请求是否已发送与预览是否刷新分开，没有把 query attempt 或后端错误算成功。
- **Q009：** Gate 在任何提交前重验当前身份、资源 READ、目标 MANAGE 精确 `Success`、兼容条件和 clipboard；dataset READ 由服务端 chart query 取数前检查，拒绝时 stage 失败并保持活动完整状态。静态次序可以满足“query 授权拒绝先于本地 mutation”，前提是 staged request 及 render 不写入活动图表状态。MANAGE 的撤销和 dataset READ 行为没有在真实多用户环境验证。
- **真实调用链约束：** 已绑定 `views/index.vue` 会先更新 `view.chartExtRequest`；`ChartComponentG2Plot.vue::calcData` 会先改 `isError`，业务失败写 `errMsg`，成功先写 `chartData`/Store 并发事件，后执行 render。r002 明确禁止直接复用该有副作用路径作为 stage，要求隔离 stage-query/stage-render 与单次 publish。因此 Design 描述的是未来适配合同，不是当前已有能力；产品 Builder 仍需独立的接线设计和验证。
- **source-read：** r002 没有把 dashboard READ 当作过滤配置读取权限；只读用户能否读取/复制源过滤配置尚未由可核验的真实权限路径证明，并明确要求 Copy fail closed。这是正确的未知处理，但阻断产品 Copy/完整权限验收；不阻止没有 clipboard/API/权限依赖的纯状态 reducer。
- **范围：** Goal 10 项 AC/26 项 must-have/16 项产品义务、`Scope Delta: none`、S01 F01 `CONDITIONAL` 与 ORIG-02 pending 均保留；本交付物不收窄 Goal，不重开 Chart→Chart r003。

## 已检查且无新增问题的维度

- **CTPR-001 到 CTPR-003** 按上表逐项处置；其中“已关闭”严格限于合同与案例文本覆盖。
- **完整失败原子性：** Gate/Prepare 拒绝、query 业务拒绝/网络拒绝/timeout、stage render 与 publication preparation 失败均列有 P0 状态；用户取消各阶段单独覆盖。
- **迟到与当前态：** request 2 成功后 request 1 迟到、active target 切换、身份/contentId 变化、同目标外写，以及 response tuple 单字段错配都有专用案例，不以原 P0 覆盖 P1。
- **纯模型职责：** Cases 顶层排除产品 UI、HTTP、权限、组件 mutation 与 rendering；模型只接受事件并作决策，不声称执行或证明被排除的动作。
- **保存与成功提示：** commit 与耐久保存分开，query/render 成功仅发一次成功提示，不自动保存；显式保存失败不会被写成持久化成功。

## 未执行/未核实项及原因

- 按 Card 只读范围未构建、运行模型测试、启动产品、访问 Browser、调用服务或修改数据库；r002 没有可信 RED/GREEN 证据。
- 当前无已确认的真实权限隔离实例和 editor/viewer/admin 角色账号；只读 source filter 保密、dataset READ 拒绝、target MANAGE 撤权/恢复均 `BLOCKED / NOT_RUN`。没有用 standalone/admin/mock 替代。
- 现有 renderer path 的静态副作用可以核对；未来 staged adapter 的隔离和原子 publish 未实现、未运行，不能证明 UI 实际上保留 P0 或立即显示 T。
- 没有覆盖此合同以外的图表组合、Query→Query、跨 tab clipboard、完整 F01 和 S02 其余验收；它们仍保留在 Goal 原分母。

## 修复后准入预测

若一并修复 CTPR-R2-001/002，且第三轮全量复核未发现其他 blocker，则本交付物的 **纯状态模型 Design/Cases** 可争取 `PASS_WITH_BOUNDS`：仅允许构建无 Vue/Pinia/HTTP/权限/renderer/save 副作用的事务 reducer，并绑定新冻结 Cases、可信 pure-model RED 与精确 execution admission。该预测不代表当前 Builder 已准入，也不放行产品集成。

产品准入仍取决于可隔离 staged query/render 与原子 publish 的真实产品路径、source-read 和 dataset READ / target MANAGE 权限的安全证据、产品 UI 可信 RED、可复现 fixture 及保存重开验证。真实权限仍 `BLOCKED / NOT_RUN`；纯模型结果最高只能 claim `TRANSACTION_MODEL_CONTRACT_IMPLEMENTED`，不代表 F01、S02 或产品权限验收完成。

## 最终裁定

r002 已关闭 r001 的三个 finding，并将完整组件 P0、renderer 阶段失败、并发外写现态、阶段取消与响应 tuple 纳入合同和 Cases；真实权限与当前 renderer 接线能力也保持正确边界。本轮发现 CTPT-007/013 成功后状态互相矛盾（CTPR-R2-001），且所有案例缺少唯一共享的 P0 初始化 fixture（CTPR-R2-002）。因此本交付物第 2/3 轮为 **Design Freeze Validity `NEEDS_REVISION`、纯状态模型 Builder Entry `NOT_READY`**。不启动第 4 轮，不把此交付物的预算套用于整个 Goal；本结论不改变 S02 Goal 状态。
