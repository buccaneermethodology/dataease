# ST-SRC-002..005 局部 Handler Harness 独立 Validation r001

## 结论

**PASS WITH BOUNDS（有界通过）。** 在本地受控 handler harness 范围内，冻结合同与 Cases r002 的 12 个变体身份、输入/expected 快照及请求/Promise 状态保持一致；从当前 `QueryConditionConfiguration.vue` AST 提取的 handler 在本次独立重跑中 12/12 通过，定向 ESLint 通过，diff-check 未报告空白错误。验证只覆盖 ST-SRC-002..005 的局部处理器，不证明 Vue/SFC 集成、真实 UI/API/Store、权限、保存恢复或 Goal AC 验收。

**阻断项：** 本次局部 harness 没有发现阻断正确性问题。真实多用户权限仍 `BLOCKED / NOT_RUN`，S01 F01 仍 `CONDITIONAL`；这些阻止相应产品验收，不影响本报告对隔离 harness 的有界结论。初次失败的原始终端输出和失败版本未归档，修复历史只能按 Topology 摘要引用，不能独立重演其初始失败。

## 输入、身份与读集复核

- Lane Card canonical SHA-256 `691549fa9c59f5333cdd48e3931f7b2017d5a3e2543cc40ec1c386a04b5eb9b7`，`lane_task_card.py validate` 返回 `pass`。
- Context Bootstrap 原始 SHA-256 `6b3c8b634ac893efb13e55e5447b8117f0209d189e1271a96aa709c0ed8ebac6`，与 Card 的 context ref 一致；`context_bootstrap.py validate` 成功。
- Context required-read set 共 9 项，逐项重算均与绑定 SHA-256 相符：Goal、Harness Contract、Cases r002、Design Review r002、harness 文件、Vue 源码、Topology r286、权限环境及 S01 EntryPacket；`skipped_reads` 为空。
- 原始 Goal 摘要 `f562da2e…1daef0` 匹配；`must_have_ledger` 含 26 项。Goal 与 Contract/Cases 保留 10 项 Goal AC、26 项 must-have、16 项产品义务和 `Scope Delta: none`。Contract 只纳入 ST-SRC-002..005；001、006、007 明确排除。
- Contract 已标记 `frozen_for_local_harness_only` / `frozen_for_builder: true`，绑定当前 Goal、Cases r002 和独立 Design Review 的摘要。该冻结只授权所列局部 harness，不扩大到产品代码接线。

## 实际源码提取与当前差异

Harness 用 TypeScript AST 从真实 `.vue` `<script>` 中提取 `duplicateRemoval`、`getOptions`、`multipleChange`、`handleDatasetChange`、`handleValueSourceChange`、`handleCurrentChange`、`confirmIdChange`、`clearCascadeArrDataset`、`validate`、`confirmValueSource`、`cancelValueSource` 的 initializer，再转译并在隔离依赖下运行。复核了 `handleDatasetChange`、`handleValueSourceChange`、`getOptions`、`confirmIdChange`、`validate` 和 `confirmValueSource` 的关键入口/写入路径；ST-SRC-005 的 `conditions[0] === condition` identity 由 fixture 明示，并符合源码通过 `conditions.value.find(...)` 后赋给 `curComponent.value` 的对象引用路径。

`QueryConditionConfiguration.vue` 在工作树相对 HEAD 有既存修改：增加 `toRaw` import，并修改 `confirmClick` 的 lifecycle/commit 逻辑。该差异不是本 lane 的 Builder 产物，Context 绑定的当前文件摘要与实际一致。将 harness 的 11 个抽取函数表达式与 HEAD 对应 AST initializer 比较，全部 `UNCHANGED`；本次 harness 不抽取或运行 `confirmClick`。因此本结论只适用于这些未变的局部 handler，不覆盖当前工作树中的其他组件改动。

## Case、快照与 Promise 状态

逐项比较 Contract 与 Cases r002 中 included case 的 variant、`before`、步骤、`expected_after` 和 assertions，12 个变体全部一致；没有重算或覆盖原始 oracle。执行清单：

| Case | 变体 | 执行结果 | 关键异步边界 |
|---|---|---|---|
| ST-SRC-002 | DATASET-CHANGE | PASS | P1 pending checkpoint 后显式 resolve，最终 fulfilled；响应写入同一 condition.dataset.fields |
| ST-SRC-002 | SOURCE-SWITCH-DATASET-ALREADY-SET | PASS | 不发请求，保留既有 field/dataset 状态，仅执行声明的 default/select 更新 |
| ST-SRC-003 | ONE | PASS | P1 显式 resolve，fulfilled |
| ST-SRC-003 | MULTI-LAST | PASS | P1 显式 resolve，fulfilled；只验证既有循环顺序行为 |
| ST-SRC-003 | EMPTY | PASS | 空 ID 请求仍被记录并显式 resolve，fulfilled；不推断真实 API 接受性 |
| ST-SRC-004 | CONFIRM | PASS | C1 pending checkpoint 后 resolve，确认回调完成并发出 P1；P1 fulfilled |
| ST-SRC-004 | CANCEL | PASS | 仅设置 adapter cancellation signal；不 resolve/reject JavaScript Promise、不调用确认回调 |
| ST-SRC-005 | MISSING | PASS | 按冻结局部前置执行 validate，比较完整 expected |
| ST-SRC-005 | EMPTY | PASS | 按冻结局部前置执行 validate，比较完整 expected |
| ST-SRC-005 | WHITESPACE | PASS | 保留 truthy 空白值语义，比较完整 expected |
| ST-SRC-005 | VALID | PASS | 按冻结局部前置执行 validate，比较完整 expected |
| ST-SRC-005 | MANUAL-BUFFER-WHITESPACE | PASS | 执行 confirmValueSource，检查拒绝前后的局部状态 |

harness 把每个变体的最终局部状态与 `expected_after` 深比较；异步分支另比较合同里的 pending checkpoint。受控依赖记录请求 ID、参数和 pending/fulfilled 状态；没有真实网络。CANCEL 的 adapter Promise 保持未 settle，仅以合同定义的信号代表未进入 `onFulfilled` 的局部路径；真实 Element Promise rejection、全局未处理拒绝及 UI 错误处理不在本次验证内，也没有被报告为通过。

## 重跑与工程检查

- 在 `core/core-frontend` 使用 Node `v24.21.0` 重跑 `node tests/filter-copy-query-select-text-source/handler-harness.mjs`：12 个 `PASS`，汇总 `cases: 12, checks: 12`，退出码 0。
- 定向 ESLint：`node_modules/.bin/eslint tests/filter-copy-query-select-text-source/handler-harness.mjs`，退出码 0，无诊断。
- 对 harness 文件执行 no-index `git diff --check`，无空白错误输出；命令退出码 1 是因为 untracked 文件与 `/dev/null` 存在差异。对 Vue 源文件执行 `git diff --check`，退出码 0。
- `git status` 显示 harness 是 untracked，新 Vue 文件为已有 tracked 修改；本验证没有修改或暂存任何输入/Builder 文件。Topology r286 的执行摘要记录此前一次运行因字段响应映射/请求记录器不匹配失败，修正 adapter 后 12/12 通过，且不改产品源码/冻结合同。当前仓库未发现独立保存的初次失败 stdout/stderr 或失败版 harness，故历史失败原因仅接受为该拓扑记录，未声称独立复现其初始失败。

## 范围及能力差异

- Cases r002 的 001..005 局部候选不等于合法形态全集；本轮只包含 Contract 声明的 002..005。ST-SRC-001 的 Date 计数 finding、006 的异步 owner/调度目标域、007 的保存/恢复 owner 均未纳入或关闭，保持各自原状态。
- 本地 `execution_admission_v1.schema.json` 的 action enum 仅支持 `builder`、`install`、`upgrade`、`release`、`deploy`，没有 `validation` action。本报告如实记录该能力差异；不伪造 Validation admission，也不把 Builder admission 当作 Validation admission。Card/Context 及本次受托只读 lane 是本报告的任务边界。
- S01 F01 EntryPacket 为 `CONDITIONAL`；`PermissionEnvironment.md` 仍记载真实权限环境不可用、账号/隔离实例未建成，真实权限 `BLOCKED / NOT_RUN`。standalone/admin、mock 和本地 handler harness 均未被用于替代只读用户查看/复制/粘贴限制、权限撤销或恢复验收。
- 10/26/16 原分母与 `Scope Delta: none` 未变化。局部 harness 的 12/12 不能写成 Goal 通过、产品 AC 通过或真实权限通过。

**Claim ceiling：** 本报告只验证当前文件摘要绑定下，ST-SRC-002..005 的局部 handler harness 与冻结局部 oracle 一致，并记录当前独立重跑/定向检查结果；不证明 SFC 集成、产品 UI/API/Store/权限、保存/恢复、完整 F01 设计或 Goal 完成。
