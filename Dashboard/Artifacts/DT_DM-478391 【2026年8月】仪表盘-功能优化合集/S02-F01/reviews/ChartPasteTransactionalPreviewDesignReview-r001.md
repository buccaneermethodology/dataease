# 图表过滤粘贴事务式预览/提交合同独立评审 r001

## 双 verdict

- **Design Freeze Validity：`NEEDS_REVISION`。** 候选合同正确把 query 与可见预览区分，并将事务暂存失败定义为保留 P0；但 Cases 未覆盖当前图表组件的 error/request 状态副作用，也没有把“query 成功但预览发布/渲染失败”定义成可判定终态。目标 revision/tree 在等待期间发生外部变化时，CTPT-009 还要求回到原 P0，可能覆盖并发编辑，和“只忽略本次陈旧事务”的意图不一致。
- **纯状态模型 Builder Entry：`NOT_READY`。** 当前可实现纯决策逻辑的隔离边界，不必等待真实权限环境；但 r001 Cases 尚不能冻结错误态和并发变更的 oracle。真实产品粘贴/Copy、授权接线、staged renderer 和 UI 入口仍不得进入 Builder；真实权限继续 `BLOCKED / NOT_RUN`。
- **轮次：** 本独立交付物 `S02-F01-chart-paste-transactional-preview-contract` r001 第 **1/3** 轮。该上限仅属于本交付物，不限制 S02 Goal 或其他交付物。
- **声明上限：** 仅评审事务合同静态冻结适格性和纯模型 Builder 入场；不证明产品调用、图表渲染、权限、UI、保存重开或 Goal 完成。

## 审查基线

Card `S02-F01-CHART-PASTE-TRANSACTIONAL-PREVIEW-DESIGN-REVIEW-r001` 的 canonical SHA-256 `fcdc01f0612ed1522798b52a2270b133e2ec720d7d8ef3e78ed3652a2acd803e` 校验通过，且已读取 renderer 输出；Context SHA-256 `3db8de8dfa716ce290113a6762ff11e401719f1464328ed6576ac15db0064552` 结构校验 exit 0，required read set 无漂移；Topology `Topology-actual-r373.json` SHA-256 `9412bffcb0b5a1d8d43ac881589ae13ef17616ea58d7cbea69a141a8dc24a80b` 绑定本任务。审查使用 rendered Context；扩读仅限当前调用点和 Goal 精确条款，没有构建、启动、执行测试或产品/权限操作。

被审 Design SHA-256：`e38f0fef537799af82ad2292256481d47661464f95a416140193be6e28d21648`；Cases SHA-256：`6acd9ca5bc6dd1bad314a26ed267941a46ef571cf3348c4b8fe141270b608ad0`；Goal SHA-256：`28c94d3c35d4ce0a891ce77ecc915932d67f88ef813f3d2815dc0dce11f91b64`；Chart→Chart r003 Review SHA-256：`21000696bf62b6be2755e264c69ac7c905e7fc2818a764d867ff63c49a67b1b1`。权限环境仍没有确认加载真实权限实现的隔离实例或可用角色账号。Authority Materials 是不同交付物，其 AM-09 来源精确性 finding 仍 OPEN，本报告不将其解释为通过。

## 权威和范围核对

Goal `AC-F01-Q009` 明确要求每次粘贴重验身份、数据集访问和目标编辑权限，拒绝时不改目标。`AC-F01-Q014` 明确成功后立即预览并显示成功反馈；取消/失败不刷新、不修改、目标和预览保持原状，且不新增自动保存。Design 引用的 Goal pointers 与要求相符；该新合同独立于 Chart→Chart r003，不重开或改写其终轮结论。

Design 保留 Goal 10 项 AC、26 项 must-have、16 项产品义务和 `Scope Delta: none`，也如实保留 S01 F01 `CONDITIONAL`、ORIG-02 pending 与真实权限 `BLOCKED / NOT_RUN`。纯模型被限定为不读剪贴板、不发 HTTP、不改图表/快照、不显示消息、不提供授权结果、不冒充 renderer；纯模型通过不能支持产品级 claim。

## Findings

### CTPR-001 / P1 / OPEN：Cases 未覆盖现有查询调用在失败/暂存期间污染 chart request 与 error state 的路径

**位置：** Design「Stage query」「可验证状态与失败原子性」；Cases CTPT-001/005/006；当前 `views/index.vue` 的 `calcData-<id>` listener 和 `calcData()`；`ChartComponentG2Plot.vue::calcData()`。

合同提出候选 query 必须隔离，在成功提交前不覆盖可见数据或错误态；但它没有把当前产品调用链的实际副作用纳入完整 P0 或 oracle。`calcData-<id>` listener 在请求前先写 `view.value.chartExtRequest = filter(false)`。子组件 `calcData()` 随即设置 `isError=false`；非零业务响应再写 `isError=true` / `errMsg`，成功响应先更新 `chartData`、view store 并发出 `chart-data-change`，之后才调用 `renderChart`。传输拒绝的 catch 只结束 callback，但请求前的错误状态与 chartExtRequest 已变化。因而沿用现有事件/API 做“staged query”会在查询待定或失败时改变候选 P0 的部分状态；Design 已说明需要隔离响应，却尚未给出适配器如何保证这些赋值不发生的可审查边界。

CTPT-005/006 只比较 `target_tree_digest`、snapshot、`preview_revision`、成功消息与保存计数，没有 `chartExtRequest`、`isError`、`errMsg`、当前数据/store revision 或 renderer 发布状态。它们不能验证合同自己要求的“失败时 P0 完整保持”，也不能识别业务错误码已经污染组件错误态的情形。Design/Cases 还把候选 query 成功直接作为 commit 事件，没有说明随后 `renderChart` 或预览发布失败时是否应提交 T、显示错误，或将目标/预览恢复 P0；因此“成功立即预览”在这条状态边界上仍不可判定。

**要求：** 明确定义纯模型 P0 必须比较的状态（至少目标树/版本、`chartExtRequest` 或其等价请求参数、组件错误态和可见预览 revision）；为成功计算但 renderer/publication 失败定义独立事件与 oracle。产品接线须证明 staged path 不调用会先写上述状态的现有流程，或先将完整图表状态暂存在隔离副本并仅在匹配提交时一次发布。Cases 分别断言 transport reject、业务错误响应、timeout 和 stale success 后上述状态均与“操作未发生”时一致。静态评审确认目前调用链没有此保证；这不妨碍未来纯模型实现，但阻断当前合同冻结及任何产品 Builder。

### CTPR-002 / P1 / OPEN：等待中的外部目标变更被 CTPT-009 错写成恢复到初始 P0

**位置：** Design「Commit」「Abort」「Late response」；Cases CTPT-009 的 `targetRevision=8`、`priorTreeDigest=changed` variants。

Design 捕获开始时的 `targetRevision` 与 `priorTreeDigest`，要求不匹配时 abort/ignore late，这是防止陈旧结果覆盖新状态的正确方向。但 Cases 对这些 variant 仍只给 `target_tree_digest: P0-tree`、`snapshot_count: 4`、`preview_revision: P0-preview`；没有设置目标在等待期间已被其他编辑改成的新 tree/revision/preview。若把此期望解释为回滚到操作开始的 P0，它会丢弃其他操作的有效编辑；若把 P0 解释为检测到变化时的现态，案例又没有给出该现态，不能独立复现或唯一判断是否覆盖。

这与简单身份变化应保留目标 P0、以及 active target 切换时保留 LINE-2 状态是不同 oracle：targetRevision/tree change 表示同一目标本身已被其他写入更新。

**要求：** 分离 uid/oid/contentId 变化、切换 active target 与同一目标 revision/tree 在请求中变化。对最后一种先给出外部写入后的 `currentTree/currentRevision/currentPreview`，再断言陈旧 query 只 `ignore_late`，不得提交 T、增加本事务 snapshot 或覆盖外部现态。若协议要求锁住目标而非忽略，需写出该锁的权威和释放边界；不得默认恢复开始时的 P0。

### CTPR-003 / P2 / OPEN：候选用例没有明确取消和阶段间响应身份的独立输入

**位置：** Cases CTPT-001..010。

Design 将用户取消列为 abort 条件；Cases 没有任何 cancel 事件或取消发生在 Gate、Prepare、query pending 不同阶段的用例。另有 CTPT-007 的 query success 仅给 request id，CTPT-008/009 用简写或 variant 表达 target/identity/revision 变化，没有在每条响应中稳定提供候选合同要求比较的 `requestId + targetChartId + uid/oid/contentId + targetRevision`，也没有单独的错配响应 tuple。现有用例能表达“存在一个陈旧响应”的概念，但不能检查 reducer 是否逐字段执行绑定比较，也无法覆盖用户取消后迟到成功不得复活事务。

**要求：** 增加各个 transaction phase 的 cancel case，以及取消后旧 request 成功迟到的 case；为匹配响应与每类错配响应给出完整 tuple 和当前 active binding，并明确不会提交、不会新增 snapshot/成功提示、P0 观察面不变。若计划将 variant 作为 typed enum 而非原始响应对象，应在 Cases schema/测试接口说明其具体判定值。

## 已检查且未发现新增 blocker 的维度

- **Q014 失败语义：** 核心规定尊重“取消/失败不刷新、不修改、保留旧目标和预览”。将后端 query attempt 与用户可见 preview refresh 分开，且没有宣称发出请求即成功；候选失败不保存、不提示成功。AM-09 的来源精确性未决不改变 Goal Q014 这一直接 authority。
- **授权顺序的静态可行性边界：** Gate 把身份、dashboard READ、target MANAGE 精确 `Success`、同数据集兼容与剪贴内容有效放在 Prepare/Stage 前；dataset READ 由服务端 `/chartData/getData` 计算数据前执行，候选设计在该结果返回前不本地提交，原则上可把服务端拒绝挡在本地 mutation 之前。Design 正确指出 dashboard READ/MANAGE 不等同 dataset READ，也没有把 `Repeat` 当授权成功。
- **纯模型边界：** 决策模型本身不读取 clipboard、不发请求、不写图表状态或 snapshot、不展示消息、不执行授权、不保存；状态模型结果不得抬升为产品集成或权限证据。
- **保存边界与正常提交：** 提交成功只记一次 snapshot/undo、发布相应预览和一次现有成功反馈，不自动保存；显式保存失败不会把耐久成功伪装为已应用状态。CTPT-004/010 对这条分层有基本覆盖。
- **范围与 claims：** 保留当前 Goal denominator、`Scope Delta: none`、S01 条件和真实权限未知，不把本新交付物声称为完整 F01/MVP/Goal 验收。

## 未执行与证据上限

- 本轮按只读 Card 未构建、启动、执行单元测试、打开 UI、调用 API 或写入数据库；因此候选状态转移没有 RED/GREEN 证据，图表 query/render/save 的运行时状态未验证。
- 真实 XPack/多用户授权实例和 editor/viewer/admin 测试身份未确认。目标 MANAGE 撤销、dataset READ 拒绝、只读用户对 source filter 配置的读取/复制边界均为 `BLOCKED / NOT_RUN`；不以 standalone、admin 或 mock 代替。
- 静态代码只能确认现有 query/render 链的赋值顺序，不能证明未来的隔离 renderer 或产品适配器不可污染；当前 Browser 产品 fixture、source/target chart、数据行、reset/cleanup 和真实保存后重开环境未绑定。
- 没有评审本 Slice 之外 Query→Query、非空目标确认、其他图表类型、跨 tab clipboard 或完整 F01 全矩阵；这些范围仍留在 Goal 原分母，不因此记为不适用。

## 修复后准入预测

若 r002/新版本一并补全 CTPR-001 的完整 P0 与 query-versus-render 结果合同、给出隔离 staged response 的精确接口边界，修复 CTPR-002 的并发外写 oracle，并将取消及完整 response binding 纳入 Cases，独立复评后本**纯状态模型合同**可争取 `PASS_WITH_BOUNDS`，范围仅限决策器，无 Vue/Pinia/HTTP/权限/renderer/save 副作用。对应 Builder 仍需冻结同 identity Cases、可信 pure-model RED 与 action/target 精确绑定的 execution admission。

这项预测不解除产品 Builder 阻断。source-read/只读配置保密、dataset READ/target MANAGE 实际授权顺序、staged chartData/error/render 隔离、产品路径可信 RED、实际 fixture 与保存重开证据均须后续独立解决和验证。真实权限矩阵继续 `BLOCKED / NOT_RUN`；任何纯模型实现只可 claim `TRANSACTION_MODEL_CONTRACT_IMPLEMENTED`，不代表 F01 或 S02 完成。

## 最终裁定

该 r001 新交付物正确将 Goal 失败原子性推进为事务候选，并保留授权和运行证据边界，但 Cases 目前不能观察实际调用链中的请求/错误状态副作用，且目标并发更新案例可能要求错误回滚外部写入。取消与完整请求绑定案例也未齐。因此本交付物第 1/3 轮结论为 **Design Freeze Validity `NEEDS_REVISION`、纯状态模型 Builder Entry `NOT_READY`**。本结论只适用于 `S02-F01-chart-paste-transactional-preview-contract` r001，不重开 Chart→Chart r003，不扩大整个 S02 的评审轮次限制，也不改变 S02 Goal 状态。
