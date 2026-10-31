# QTARGET-REBUILD-001 独立 Validation r001

## 1. 任务理解与结论边界

本轮独立复核 QTARGET-REBUILD-001 的离线纯函数候选：按冻结的 r008 设计及 16 项 oracle 检查单条件、普通文本单选、空 cascade 的目标重建行为，并复核输入/对象隔离、失败阶段优先级、真实 QCARRIER 调用与定向静态检查。结论只覆盖该纯函数切片，不证明 UI/Store/产品入口接线、整树粘贴、保存重开、浏览器行为、真实权限或完整 S02 Goal。

**Verdict：`partial`。** 本轮独立行为检查通过；但本任务缺少 durable Validation Handoff，Topology r089 仍将本 Validation lane 记录为 `dispatched`（且重复记录两次），没有绑定报告结果。本报告因此不能宣称 governed Validation 包已闭环。

## 2. Read Manifest / 输入完整性

复核范围包括：原始任务意图及 Validation card/ContextBootstrap；SP-010 Validation recipe、`validation-agent` guardrail；Goal.final、CoverageMatrix、ScopeDeltaAudit、S02-F01 Sessions、PreparationStatus 与 Topology r089；冻结 QueryProductRebuildDesign-r008、Fixtures-r008、独立设计审查 QueryProductRebuildDesignReview-r002；Builder card、ContextBootstrap 与 `planning/evidence/QTARGET-REBUILD-001-ExecutionEvidence-r001.md`；目标实现、同 runner 测试、真实 QCARRIER 与 QVALUE 纯函数依赖。

- Validation card：`lane_task_card.py validate` 通过，canonical digest=`1bb2ba7d1e8e07614b09e75f3ab9aebeb44f7feb9773e6fbd93ba2d83fe12d8e`；原始文件 SHA-256=`f0979dc416f432cf58cb531bbca88e21fc232556b6f272d5cf8591e96d9a6b36`。
- ContextBootstrap profile 为 `validation`，`context_bootstrap.py validate` 通过，`skipped_reads=[]`；SHA-256=`ec1bb2c313f0b96a85b16cedf0fbbc6e3c44ed659c993ddeccc552763e766ec3`。
- `guardrail_checklist.py --mode validation-agent` 已检查。card 声明唯一写入范围为本报告，claim ceiling 为 QTARGET 离线纯函数切片；本轮未改实现、测试、合同、Goal、Session 或权限结论。
- 当前实现 SHA-256=`3e46cb7e34532670c561347a9322c5692e6679df2203632ad54670d4fb311fe6`；测试 SHA-256=`74b8218ff52407d65dc4beb46d8d646b8fdbc5a7dc97b349d1c816f08a69e243`。均与 card/Builder ExecutionEvidence 所记录版本一致。
- Builder ExecutionEvidence 文件存在且与本轮目标一致；其记录 `tsx` 不可用，使用本机已有 esbuild 临时编译执行，没有安装依赖。记录还明确未保存可信 RED 证据；本轮不补造 RED。

## 3. 行为验证

- 独立运行 `node --experimental-strip-types core/core-frontend/tests/filter-copy-query-reference/query-single-select-target-rebuild.test.ts`：`PASS 26 checks`，退出码 0；runner 直接从冻结 JSON 载入 16 个完整 oracle，并验证输入不变、失败无部分结果、结果对象与输入及 design/runtime 之间隔离、accessor 不求值、非 JSON/循环输入拒绝及运行时 B 变化不污染重建结果。
- 定向 ESLint 对上述目标实现与 runner 退出码 0。运行时只出现 Node 对 package module type 的性能提示，无失败。
- 独立动态计数复核以真实 `prepareQuerySingleSelectCarrier` 为被计数调用：成功、QCARRIER/PLAN 阶段失败均恰调用一次；ENVELOPE 阶段失败调用零次。未替换其返回值。该计数复核为临时独立包装检查，不是持久测试用例。
- 16 个冻结 case 的预期 stage/reason 与合同一致；case 5、11、13 覆盖 QCARRIER 字段/形状错误；case 14 检查 PLAN 先于 DIRECTORY；case 15、16 检查 ENVELOPE 优先级。
- 实现与 runner 文件均为当前工作树未跟踪文件，因此普通 `git diff --check` 不覆盖它们。对两文件逐行检查确认无行尾空格或 Tab 尾随空白且均以换行结束；仓库 tracked 文件的 `git diff --check` 返回 0。此项不构成与 Git 基线的完整 patch 比较。

## 4. Findings

### Blocking / 需要控制面补齐

**F-QTARGET-VAL-001 — Validation 结果未耐久绑定（P2，未关闭）。** 本目录未找到 QTARGET 专属 Validation Handoff。Validation recipe 将缺少 Handoff 列为只能 `blocked/partial` 的证据缺口。Topology r089 中 `S02-QTARGET-REBUILD-001-validation-r001` 两条记录均为 `dispatched`，只引用 card、ContextBootstrap 和本报告路径，没有本轮结果状态或本报告摘要绑定。该快照不能证明本轮 Validation 已完成。

**要求：** 控制面在报告写入后追加 append-only lane 结果，引用本报告及其 SHA-256、记录 `partial` verdict，并运行相应 Stop Gate 形成新 receipt。不得改写 r089 或更早快照。此动作超出本 Validation card 的单文件写入授权，故由编排/控制面执行。

### Non-blocking / 已通过的有界行为

本轮未发现冻结 16 项行为、纯函数错误阶段/优先级或输入/输出隔离方面的新偏差。ESLint 与独立 runner 复跑通过。没有将临时调用计数包装器包装成耐久测试覆盖。

## 5. 原始 Goal、范围与权限边界

- Goal.final 保持 26 项 must-have 且全部 `pending`；CoverageMatrix 保持 10 项 Goal AC 与 16 项产品/兼容义务且全部 `NOT_RUN`。ScopeDeltaAudit 与 Goal registry 未发现批准的 Scope Delta（0 项）。本候选没有关闭 Goal AC 或产品义务。
- PreparationStatus 与相关执行记录保留真实多用户权限环境不可用的边界：只读查看/复制/粘贴限制、权限撤销与恢复继续 `BLOCKED / NOT_RUN`。本轮没有使用 standalone、admin 或 mock 代替权限验证。
- QCARRIER 包级状态继续为 `partial`；QTARGET 本报告不升级 QCARRIER 状态，不代表产品复制/粘贴链完成，也不代表 Goal、权限或 S02 通过。
- 本候选仍处于 Builder candidate/实现审阅状态；Topology r089 的 Builder lane 仍为 `admitted`，不能由执行记录或本轮绿测自行推导为已完成、已验证或已落地。

## 6. Verdict

**`partial`（纯函数行为部分通过，治理验证包未闭环）。** 26 项 runner 检查、定向 ESLint、合同与实际候选的摘要核对均通过；未发现需要 Builder 修复的行为偏差。由于 QTARGET Validation Handoff 缺失，且 Topology r089 仅记录 dispatch、没有本轮结果绑定，mandatory durable evidence 尚未完整，不能判 `pass`。

允许的最大声明：QTARGET-REBUILD-001 离线纯函数候选在上述 16 个冻结 oracle 与所列防御/隔离检查上的有界行为复跑通过。不得据此声明 UI/产品接线、权限、保存重开、Goal AC、完整 S02 或发布通过。权限验收维持 `BLOCKED / NOT_RUN`；Goal 的 26 项 must-have 维持 `pending`。
