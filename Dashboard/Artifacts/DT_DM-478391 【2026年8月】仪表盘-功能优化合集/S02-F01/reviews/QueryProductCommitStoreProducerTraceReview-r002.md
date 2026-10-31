# QPC Saved Canvas Store Producer 源追踪 r002 独立审查

- 评审轮次：本交付物第 2/3 轮
- 审查类型：只读 Semantic / Source Review
- 交付物：`QueryProductCommitStoreProducerTrace-r002.md`
- 结论：**`NEEDS_REVISION`**
- 结论边界：本结论只针对 r002 trace 的来源映射和静态 claim 精度；不批准产品 UI/Store/source-read/target-commit，不关闭任何 Goal AC、must-have 或产品义务。

## 入口与完整性核验

Lane Task Card `S02-QPC-STORE-PRODUCER-TRACE-r002` 通过 `lane_task_card.py validate`，SHA-256 为 `fa8fa8b03da3649d738fcd7b569d7d2ec05fae8d5da5c862913047d33fcc7b94`。Context Bootstrap 通过 `context_bootstrap.py validate`；逐项核对 25 项 required read set，发现 0 项摘要漂移。Context 摘要 `069bb37b3835bedbe884d5a398953b08372f43a8f163631109e9a432d73e1bdd` 与 Card 绑定值一致。r002 Admission 绑定 Goal、r006 contract、Context、Design Review 和 r326 topology；按指定 action/target 执行 `execution_admission.py` 校验成功。

独立核验了 r002 trace 全部源码链接所指行段、当前 `Select.vue` 对应实现、saved-owner helper 全前端指定搜索、Goal.final、S02 Sessions、PermissionEnvironment 及 QPC r006 Review。未启动产品、未运行测试、未访问数据库或权限接口。

## Findings

### BLOCK-QPC-TRACE-003 — 异步 lifecycle gate 的覆盖范围描述过宽

**级别：** Blocking（需修订 trace 后才能通过本轮来源精度审查）

**依据：** Trace 第 29 行称 `Select.vue` “在字段变更和异步回调前检查该 gate”。当前 `Select.vue:358-362` 在字段变更入口调用 `queryLifecycleAllowed()`；但异步 `.then/.catch` 中的 gate 复验位于 `if (observationRequest && ...)` 分支（`Select.vue:365-380, 449-458`），而 `observationRequest` 可为 `null`：`captureObservationRequest` 仅在 `observationSupported(selectValue.value)` 为真时创建请求（`Select.vue:759-773`；支持条件见 `Select.vue:743-757`）。在不符合该观察能力条件的模式下，旧有枚举回调走 legacy 分支，不执行 `observationRequestIsCurrent` 的 gate 复验。

**影响：** 当前句子容易被下游设计理解成 `Select.vue` 所有字段枚举异步回调都被 `query-lifecycle-allowed` 约束。它实际只保证调用入口统一检查；异步响应的 lifecycle/source/identity 复验针对捕获到 observation request 的受支持单选场景。该区别与目标 owner 生产者及生命周期 fencing 的设计判断有关。

**建议：** 改为精确区分：字段变更入口检查 gate；对 `observationRequest` 非空的受支持观察请求，异步回调通过 `observationRequestIsCurrent` 复验 gate、config raw identity、condition ID、source generation 和 request input；legacy/no-observation 分支不应据此声称有相同的响应期 gate。异步核对成功/失败状态也建议注明仅在请求仍 current 时分别定为 valid/invalid 或 unverified；失效请求会被忽略/由失效逻辑收尾。保持这是静态代码路径描述，不推导运行时竞态结论。

## 非阻断改进项

### NQPC-TRACE-004 — 补充 S01 当前状态可使权威边界更明确

Trace 第 7 行准确写明 S01 与 S02 的状态独立，但没有给出当前 S01 F01 `CONDITIONAL` 的状态。现有 `Sessions.md` 与 QPC r006 都确认 S01 F01 仍为 `CONDITIONAL`；列明该状态会降低下游把“独立”误读成“前置已解除”的可能。建议在不改变边界的前提下补为“ S01 F01 仍 `CONDITIONAL`，与本 trace 的范围独立”。此项不单独阻断 trace 通过。

## 逐项来源与 claim 核对

- Trace 第 11–15 行的 Dashboard 路由/缓存/template/copy 路径、`initCanvasDataPrepare` 解析和 Store setter 发布顺序与当前 `dashboard/index.vue:227–319`、`canvasUtils.ts:597–682` 对应；setter 多步不构成原子发布，trace 将运行时 watcher/render 可见性留为 unknown，边界恰当。
- Trace 第 17 行中 `dvMain` 的独立状态轴与 setter 行号对应当前 `dvMain.ts:121–160,392–394,526–528,785–788`。
- Trace 第 19–21 行缓存恢复、对话框事件、模板与 copy-as-new 的静态映射对应 `dashboard/index.vue:189–225,292–319`、`snapshot.ts:139–147`、`CanvasCacheDialog.vue:50–62`。没有将本地缓存描述成身份/授权证据。
- Trace 第 23 行搜索命令为 `rg -n "createSavedCanvasOwnerLifecycle" core/core-frontend/src`；本轮复跑唯一命中是 `query-single-select-saved-canvas-owner.ts:99` 的工厂定义。第 23、44 行已把结论限定在当前 checkout 的 `core/core-frontend/src` 文本范围，并排除其它工作树、生成代码、运行时动态引用，r001 的复现性问题已解决。
- Trace 第 25、27 行 `DeCanvas` props 消费、Q-VQuery lifecycle 注入以及 `dvMain` 中 `toRaw` 的来源引用均与相应行段一致。它们不能证明 saved-owner producer 或认证授权主体。
- Trace 第 29 行关于 Select observation request 的 raw config、condition、generation、request input、迟到值后二次核对、卸载清理等具体分支与链接源码总体相符；唯一需阻断修订的是 gate 回调覆盖范围表述，见 BLOCK finding。该段仍明确不声称网络竞态或产品运行行为，claim ceiling 合适。
- Trace 第 34–40 行准确记录 r001 finding 处置及 r002 读集刷新。摘要一致只证明本地字节绑定，不证明来源来自 HEAD/维护者权威快照；trace 明确保留此边界。
- Trace 第 44–55 行的未知项与后续准入边界未把 helper、QSSDH session、generation、resource ID 或 raw 引用混同为真实身份/权限，也未将 source trace 提升为产品入口批准。

## Goal、S01 与权限边界

Goal 分母保持 10 项 AC、26 项 must-have、16 项产品义务，`Scope Delta: none`；trace 不关闭任何义务。S01 与本 trace 的设计工作范围独立，S01 F01 仍 `CONDITIONAL`。真实权限模块和隔离多用户环境仍不可用；只读用户限制、撤权及基准恢复验收继续 `BLOCKED / NOT_RUN`。trace 没有以 standalone/admin 替代真实权限，也没有声称产品 UI/Store/source-read/target-commit 准入。

## 独立 verdict

- **Context/Card/读集：** `PASS`，结构和全部 25 项摘要绑定有效，Admission 绑定与指定目标匹配。
- **静态来源映射：** 大部分引用与断言准确，负向搜索边界清楚。
- **Trace 语义精度：** `NEEDS_REVISION`，需修正异步 lifecycle gate 的覆盖范围表述后复审。
- **产品 Design Freeze / Implementation Entry：** 本报告不批准产品设计冻结或实现准入；依据 QPC r006，产品 UI/Store/source-read/target-commit 仍未获准。
