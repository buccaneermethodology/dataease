# 图表过滤粘贴事务式预览/提交合同独立评审 r003

## 双 verdict

- **Design Freeze Validity：`NEEDS_REVISION`。** r003 已处理 r001/r002 的主要状态矛盾并补回共享初态，但案例状态投影、query 计数、跨目标切换 fixture、variants 表达和 Happy path 刷新语义仍有未定义或相互冲突处，不能作为唯一可执行 oracle 冻结。
- **纯状态模型 Builder Entry：`NOT_READY`。** 纯模型范围本身清晰，且不依赖真实权限环境；但当前案例尚未唯一规定要比较的后置状态，且本交付物没有可信 RED/GREEN 与精确 execution admission 证据。不得据本报告启动 Builder。
- **轮次：** `S02-F01-chart-paste-transactional-preview-contract` 第 **3/3** 轮。本交付物评审预算已用尽；不得启动第 4 轮。用户已明确三轮上限按每个交付物计算，本结论不限制 S02 其他独立交付物的评审轮次。
- **声明上限：** 仅审查 Design/Cases r003 冻结适格性及纯模型入场条件；不证明产品接线、图表 UI/renderer、真实权限、保存重开或 Goal 完成。

## 审查基线

本轮读取了本交付物的 rendered review prompt、Design/Cases r003、r001/r002 Reviews、Goal Q009/Q014、绑定源码与权限摘要。Card canonical digest `00c058923544da8596aaa35d7291f65feddfc8e99fcfb86aaf80ed00111b453a` 校验通过；Context digest `7259e58727d5776b154788d75452e80e38a3cdafdd5b62a90756fc8e4bd55cbb` 校验成功，22 项必读摘要匹配且 `skipped_reads=[]`。被审 Design SHA-256：`c4c2b9992c711cc500f1a7503d1a59bab390fa582a32f6a3e61c41fe7ccf9785`；Cases SHA-256：`253fcd2ac3cc47e71eae53da018a40f3b25e5af8813bfc9c06a01653ef56cc38`；绑定 Topology r375 SHA-256：`e3a0973950309911797ad8a2d9f24f3dbf9d2bdb827dfa3caed23d849956f396`。

未构建、未运行测试、未启动应用、未调用 API、未操作 UI/数据库或权限服务。历史 Reviews 保持不变；本报告是本交付物第 3/3 轮最终评审记录。

## r001/r002 findings 全量 disposition

| Finding | 本轮处置 | 依据及边界 |
|---|---|---|
| CTPR-001：完整 P0、query/render 失败原子性与 publication 失败 oracle 不全 | **CLOSED（合同层）** | r003 纳入完整目标/request/error/store/render tuple、私有 stage query/render、失败隔离和单次发布边界。现有产品路径仍没有已证明的 staged response 接线能力；不构成产品准入。 |
| CTPR-002：目标外部更新时可能错误回滚至旧 P0 | **CLOSED（案例层）** | CTPT-010 先写入外部 P1，再要求迟到请求忽略并保留 P1。 |
| CTPR-003：取消阶段和完整响应绑定 tuple 不足 | **CLOSED（案例层）** | CTPT-011 覆盖多个阶段取消及取消后迟到成功；CTPT-012 定义逐字段响应错配。 |
| CTPR-R2-001：成功后的活动状态与已提交状态冲突 | **CLOSED（文本层）** | CTPT-007 的成功后 T2 tuple 与 CTPT-004 对齐；CTPT-013 继承 T tuple、只改变保存结果。 |
| CTPR-R2-002：缺少唯一共享初始 fixture | **CLOSED（文本层）** | Cases r003 增加顶层 `initial_state`，Design 说明默认基线与 override 规则。 |

上述关闭表示文档层修订到位；不代表实现、运行或产品行为通过。以下为本轮全量新发现。

## 新增 findings

### CTPR-R3-001 / P1 / OPEN：案例状态投影及 query 计数无法唯一核验

**位置：** Cases 顶层 `full_observable_state_fields`、`case_state_rule`；CTPT-001..013 的 `expected`。

顶层 `full_observable_state_fields` 只列目标树、revision、请求、组件错误、store 和 render 六项；而案例实际还断言 `snapshot_count`、`success_notice_count`、`save_count`、`query_count`、`clipboard_id`、`chart_query_state`、`transaction_pending`、`durable_save_state`、`active_target` 等字段。`case_state_rule` 又称“完整可观察状态”，同时规定省略 expected 字段等于其“事件后值”，没有定义哪些字段属于完整比较面，也没有规定无变化字段是否必须在 expected 显式出现。因此读者无法判断未写字段是沿用事件后的值、沿用共享初态，还是不参与比较。

query 计数也没有一致断言：CTPT-001 发生 queryPending，却未写 `query_count`；CTPT-004/005/006/008/009/010/011 等案例同样存在 query 事件但不都显式断言计数。CTPT-007/013 明确计数为 2/1，CTPT-002/003 明确为 0。这样无法统一验证“Gate/Prepare 拒绝不发 query”与失败 query attempt 的计数边界。

**要求：** 明确唯一的 `observable_state_fields` 与逐案例 oracle 规则（推荐每个 expected 都包含完整字段，或明确 omitted-as-baseline 并提供机器可识别的 schema）；纳入所有需要验证的计数、clipboard、pending 和 durability 字段；为每个包含 query 事件的案例显式断言 query attempt 计数，并区分发起请求、query 结果与可见 preview 更新。

### CTPR-R3-002 / P2 / OPEN：多目标案例缺少 LINE-2 基线，且 variants 未定义实例化语义

**位置：** CTPT-008、CTPT-009。

CTPT-008 初态沿用唯一共享 `initial_state`，其 active target 为 LINE-1；事件将 active target 切到 LINE-2，但没有 `initial_state_overrides` 为 LINE-2 提供 tree、revision、request/error/store/render 与 preview 初值。expected 却断言 `line2_tree_digest=LINE-2-tree`、`preview_revision=LINE-2-render`。这些值既非共享初态，也非事件产生，因而不能从案例本身推导。

CTPT-009 将 `variants` 数组放在 `expected` 状态对象里，并未在 `events` 或 `initial_state_overrides` 中说明如何逐个实例化 uid/oid/contentId 变化。事件只写 `currentBindingChanged(variant,currentState=P1)`，没有精确映射 variant 与当前绑定/状态字段。按普通 expected 对象读取时，`variants` 会成为状态字段，而不是可运行的数据驱动用例定义。

**要求：** 在 CTPT-008 显式给出 LINE-2 初态 fixture，或由事件完整创建 LINE-2 状态；把 CTPT-009 的 variants 移至独立测试参数字段，并明确每个变体应用后的当前 binding、活动目标和状态 oracle。保证每个变体都是可独立执行、可独立判定的案例。

### CTPR-R3-003 / P2 / OPEN：Happy path 的 dashboard 刷新可能与 Q014 耐久性边界冲突

**位置：** Design「产品接线前置与禁止推断」的 Happy path 验证入口。

Happy path 先写“刷新 dashboard 后状态仍一致”，随后才“显式保存、离开并重新打开后验证条件持久化”。若“刷新 dashboard”指浏览器重载或重新打开，前半段就要求未保存编辑在重载后保留，可能与 Goal Q014“只有正常保存后重开才保留”冲突；若指触发图表 query/预览刷新，则文案没有说明刷新不等于页面重载，实际验收人员可能执行出不同的耐久性 oracle。

**要求：** 将前一步明确为“触发图表数据/预览刷新，不重载页面”，并在保存之后才执行离开/重开；或者删除该刷新要求。若真实意图是未保存页面重载后仍保留条件，则需要新的维护者 authority 更新 Q014，不可由本合同推断。

## 已检查且未发现新增问题的维度

- **Q014 事务语义：** Design 将 query attempt 与可见 preview update 分开；取消、Gate/Prepare/query/render/publication 失败保持活动 P0/P1、无成功提示且不保存；匹配成功后一次性发布 T；保存失败不冒充耐久成功。CTPT-007/013 的 T2/T post-commit tuple 已与 CTPT-004 对齐。
- **Q009 权限顺序：** 设计要求每次 Gate 重验身份、资源 READ、MANAGE 精确 `Success`、兼容性与 clipboard，dataset READ 仍由服务端实际 query 执行；没有把 dashboard 权限当作 source-read/dataset READ，也没有把 `Repeat` 当允许。
- **并发与迟到响应：** CTPT-007 覆盖请求逆序返回，CTPT-010 覆盖同目标外部 P1 写入；CTPT-011/012 覆盖取消和逐字段响应绑定错配。剩余问题是多目标基线和 oracle 编码，不是这些边界完全缺席。
- **纯模型执行边界：** 不持有/读取 clipboard、不发请求、不改组件/Store/renderer、不记 snapshot、不显示消息、不授权、不保存；文档没有将 reducer 语义提升为产品实现。
- **范围与声明：** 保留 10 项 AC、26 项 must-have、16 项产品义务和 `Scope Delta: none`；不重开 Chart→Chart r003，不缩小 F01/S02 原分母。

## 未验证项、阻塞及原因

- 本轮没有运行纯模型 RED/GREEN、构建或产品运行，因此 r003 案例目前仅通过静态读取评审，不能证明可执行。
- 当前仍没有经确认的真实权限隔离实例及受限账号；source-read、dataset READ、target MANAGE 撤权/恢复及只读用户禁止查看/复制/粘贴等验收保持 `BLOCKED / NOT_RUN`。不以 standalone、admin 或 mock 替代。
- 现有 `editor/index.vue` → `views/index.vue` → chart component / `src/api/chart.ts` 调用链存在活动请求、错误、数据、Store 与 render 副作用；Design 要求未来 staged adapter 隔离这些写入。静态合同未证明该 adapter 已存在或可直接接线。
- 没有验证真实 dashboard 刷新、保存、离开重开和 renderer 行为；没有把候选用例范围外的 Query→Query、非空目标、其他图表类型、跨 tab clipboard 或完整 F01 判为完成。

## 修复后路径与准入预测

本交付物已到 3/3，不再重开本合同评审。维护者如继续该路线，应把未决项记录为后续实现/裁定任务，并在新的、独立且有明确边界的交付物中定义执行契约；不能把新轮次伪装成本合同第 4 轮。修复 R3-001/002 并澄清 R3-003 后，纯 reducer 候选可由新的独立交付物承接；准入仍需稳定的案例 schema、可信 RED/GREEN、action/target 精确绑定与 execution admission。不得据此声明本交付物已冻结或 Builder 已获准。

真实产品 Builder 还需独立证明 staged query/render 与原子 publish 可在真实调用链隔离活动状态，并提供 source-read、dataset READ、target MANAGE 的权威路径与真实多用户权限证据。权限环境在维护者提供授权来源或可用隔离实例前仍 `BLOCKED / NOT_RUN`。本合同不完成产品 F01 或 S02 Goal。

## 最终裁定

r003 已关闭 r001 的三项和 r002 的两项历史 finding（限合同文本层），并正确保持权限、产品调用链与 Goal 声明边界。本轮仍发现：案例完整可观察状态/query 计数定义不一致（P1）、多目标与 variants fixture 不完整（P2）、Happy path“刷新 dashboard”可能混淆预览刷新与未保存重载（P2）。因此本交付物第 **3/3** 轮结论为 **Design Freeze Validity `NEEDS_REVISION`、纯状态模型 Builder Entry `NOT_READY`**。评审预算已耗尽；报告记录未决问题，不授权修改本交付物或启动 Builder，也不改变整个 S02 Goal 的状态。
