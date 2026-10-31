# SH-SELECT-TEXT 局部 validator harness 独立 Validation r001

## 1. 任务理解

原始 Goal `DE-S02-F01` 要完成图表与查询组件的完整过滤配置复制、同数据集兼容校验、整树粘贴、即时预览、保存重开、权限/异常/兼容回归、独立验收及 S10 移交。本轮只复核其中一个有界测试产物：对真实 Vue SFC 中 `validate` 相关函数 initializer 做 AST 提取，并对 22 个局部输入比较完整状态快照。harness 的结论仅是这些输入下局部 validator 接受/拒绝结果与候选快照相符。它不证明产品合法性、UI/API/Store 接线、真实权限、保存/历史行为、Goal AC 通过或 Goal 完成。

## 2. Read Manifest

首轮完整 baseline。指定 Context Bootstrap 校验通过；required-read set 共 14 项，逐项复算 SHA-256 全部匹配，`skipped_reads` 为空。指定 Validation Card canonical SHA-256 `788f293af6ea2972350ca9e2686234fdda396d58c84f735435b23df8cc232cbe`，`lane_task_card.py validate --expected-card-sha256` 返回 `pass`。另读取 Topology r297 与 Validation Handoff。

| 文件 | SHA-256 | 用途 |
|---|---|---|
| `AGENTS.md` | `270940a30f462f2fb0c9a8cf2bbc1dd11750513d8f063ffc376e0e0a2640466e` | scope, acceptance, implementation, validation, dependency, topology, authority, contract |
| `.codex/skills/sge-governed-checkpoints-sp010/SKILL.md` | `b3e5d00193f88608e8deb3214071444ce89fa66431daf115b35f72fedbecbe3f` | scope, acceptance, implementation, validation, dependency, topology, authority, contract |
| `Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/Goal.final.json` | `f562da2eb14b84dc8083e138dd2eb8718a58041f01d08163eddf5fb2c71daef0` | scope, acceptance, implementation, validation, dependency, topology, authority, contract |
| `Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/QueryProductAdapterSelectTextLocalValidatorHarnessContract-r001.json` | `88db63ca8b17f26f5817978464dee1b5dc09e550013899396994f91e0edadd2d` | scope, acceptance, implementation, validation, dependency, topology, authority, contract |
| `Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/QueryProductAdapterSelectTextSourceLegalCombinationsCases-r001.json` | `b60785379fcc649634677de1548ac4a8ea25f348dadc1931f31fd720cc0d42b5` | scope, acceptance, implementation, validation, dependency, topology, authority, contract |
| `Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/QueryProductAdapterSelectTextSourceLegalCombinations-r001.md` | `374ecb5b0572817951bb8e917d779066270c71e8e9ec6054e6fe8e86aee9b121` | scope, acceptance, implementation, validation, dependency, topology, authority, contract |
| `Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/reviews/QueryProductAdapterSelectTextLegalCombinationsDesignReview-r001.md` | `074bb5cc8db2d327f1a760906d35d5ed889c7a7376cf3f40814ce25f21f4faa0` | scope, acceptance, implementation, validation, dependency, topology, authority, contract |
| `Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/planning/evidence/SH-SELECT-TEXT-LOCAL-VALIDATOR-HARNESS-r001.md` | `a66dbe82f3ea95acbc73c70eeea89a07a402909b30dea1432c144e7b7c3b4207` | scope, acceptance, implementation, validation, dependency, topology, authority, contract |
| `core/core-frontend/tests/filter-copy-query-select-text-source/validator-harness.mjs` | `57134880e9850f67faca6561c36f650fec97b6adf3c28b92387171e456a751ce` | scope, acceptance, implementation, validation, dependency, topology, authority, contract |
| `core/core-frontend/src/custom-component/v-query/QueryConditionConfiguration.vue` | `0b88bcdf92d15aceae52ca2992e7a8b4165e3f5cfc3f9cb7435296d7c7e9e047` | scope, acceptance, implementation, validation, dependency, topology, authority, contract |
| `Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/PermissionEnvironment.md` | `bf1498aa23f4f864e2c5c3d999b6b1a6044849ba25a9cd7d7d85104b6f233b9d` | scope, acceptance, implementation, validation, dependency, topology, authority, contract |
| `Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/SP-005/S02-S09_EntryPacket.md` | `4598a5d74567e1e1d3de81ce263909231dc054d8102535bc0d917238c412c658` | scope, acceptance, implementation, validation, dependency, topology, authority, contract |
| `Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/planning/Topology-actual-r296.json` | `68113ba58dae0c9165e36732f8c52574fe1da03d629863638d20075558fdea6d` | scope, acceptance, implementation, validation, dependency, topology, authority, contract |
| `Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/ValidationHandoff-SH-SELECT-TEXT-LOCAL-VALIDATOR-HARNESS-r001.md` | `882d475026885a9e7ce312f8eb070b43e3ecc2ab4dd37b436947767bf315e4a0` | scope, acceptance, implementation, validation, dependency, topology, authority, contract |
| `Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/planning/Topology-actual-r297.json` | `c2431acdcaaa8e57ee59b97b3ebc280b45f7c2758da06868029801bedc4612df` | 拓扑入场快照 |
| `Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/ValidationHandoff-SH-SELECT-TEXT-LOCAL-VALIDATOR-HARNESS-r001.md` | `882d475026885a9e7ce312f8eb070b43e3ecc2ab4dd37b436947767bf315e4a0` | Validation handoff |

**当前相关 diff：** `validator-harness.mjs` 是该 Builder 的 untracked runner，本轮逐行复核；`QueryConditionConfiguration.vue` 有现存工作树差异，完整相关差异只包含 `toRaw` import 和 `confirmClick` 生命周期/提交路径。通过 AST 将当前 SFC 与 HEAD 的四个被提取 initializer（`duplicateRemoval`、`setParams`、`validateConditionType`、`validate`）逐一比较，全部与 HEAD 相同。`options.ts`、合同和原 Cases 均未被本轮改动。其余工作树变化不属于本 lane。

## 3. Evidence Completeness

- Goal `must_have_ledger` 共 26 项；Goal/Contract/Cases 均保留 10 项 Goal AC、26 项 must-have、16 项产品义务，Contract 与候选的 `scope_delta` 均为 `none`。
- 原始候选有 41 个唯一 Case ID，全部 `execution_status: NOT_RUN`、`product_legality: NOT_READY`。分类逐项重算为：16 `LOCAL_VALIDATOR_ACCEPTS`、6 `LOCAL_VALIDATOR_REJECTS`、13 `SOURCE_STAGE_OBSERVATION`、6 `NOT_READY`。
- 合同冻结为 `frozen_for_local_harness_only`，选取前两类共 22 项。合同 `cases` 与原 Cases 中这 22 个源对象逐对象完全相等，顺序/identity 列表也完全一致，22 个 ID 唯一。
- 13 个来源观察保持原状态：`LC-ST-001-CREATE`、`LC-ST-002-DATASET-CHANGE`、`LC-ST-002-SOURCE-SWITCH-DATASET-ALREADY-SET`、`LC-ST-003-ONE`、`LC-ST-003-MULTI-LAST`、`LC-ST-003-EMPTY`、`LC-ST-004-CONFIRM`、`LC-ST-004-CANCEL`、`LC-ST-005-MISSING`、`LC-ST-005-EMPTY`、`LC-ST-005-WHITESPACE`、`LC-ST-005-VALID`、`LC-ST-005-MANUAL-BUFFER-WHITESPACE`。6 个 `NOT_READY` 仍为 `LC-NR-ASYNC-FIRST`、`LC-NR-REQUIRED-MAP`、`LC-NR-DROP-URL`、`LC-NR-HISTORY`、`LC-NR-ENUM-TYPES`、`LC-NR-BINDINGS`，均不在 runner 合同内。
- 权限环境仍 `BLOCKED / NOT_RUN`；S01 F01 EntryPacket 仍 `CONDITIONAL`。该 runner 不使用替补权限实现或 admin 结果。

## 4. Blocking Findings

无。本轮要求的冻结输入、Case identity、提取边界、22 项快照、RED/GREEN 与工程检查均获得可复核证据，没有发现当前局部合同被违反。

## 5. Non-Blocking Findings

1. **Alias 初始化缺少前置一致性断言。** runner 在 `validator-harness.mjs:83-89` 克隆 fixture 后直接令 `state.conditions[0] = condition`，恢复实际组件中的共享对象身份。独立比较确认当前全部 22 项 serialized `condition` 与 `conditions[0]` 深值相等，因此没有当前输入损失；但若未来 fixture 两者漂移，这句赋值会覆盖 `conditions[0]` 而不先报出 fixture 错误。后续可在赋值前断言两者深相等，再建立引用别名。
2. **Contract 的 `case_ids` 和执行数组关系由本轮独立复算补足。** runner 在 `validator-harness.mjs:109-119` 检查 case_count、`cases.length` 及 `case_ids` 唯一性，但没有直接断言 `cases.map(item => item.case_id)` 与 `case_ids` 同序相等。当前两者与原始 22 个所选 case 完全一致；这只是未来防止冻结输入维护时 metadata 漂移的防御性增强，不影响本次运行结果。

上述为当前测试工具的未来稳健性建议，不要求本轮 Builder 修复，不扩张合同或验收范围。

## 6. Scope Narrowing / Overclaim Check

没有发现 Contract 或 runner 将 22 个局部 validator 分类扩大成产品合法性全集；候选文档明确 `product_legality: NOT_READY`。10/26/16 分母和 `Scope Delta: none` 保持不变。若称 22/22 为用户功能验收、合法组合通过、权限通过或 Goal 完成，则超出证据。

## 7. Test / Gate Sufficiency

- `node core/core-frontend/tests/filter-copy-query-select-text-source/validator-harness.mjs`：独立重跑通过，输出 22/22 exact local validator snapshots，退出码 0。
- `./node_modules/.bin/eslint tests/filter-copy-query-select-text-source/validator-harness.mjs`（在 `core/core-frontend`）：通过，退出码 0，无诊断。
- 负向控制：在临时仓库副本中反转同一 `LC-0-0-0` 的 `expected_after.returnValue`，runner 在 `LC-0-0-0/complete snapshot` 精确断言处失败，退出码 1；临时副本已清除。真实 runner SHA-256 保持 `57134880e9850f67faca6561c36f650fec97b6adf3c28b92387171e456a751ce`。
- `git diff --check -- core/core-frontend/src/custom-component/v-query/QueryConditionConfiguration.vue`：通过。runner 未跟踪，因此对 `/dev/null` 执行 `git diff --no-index --check`；没有空白诊断，退出码 1 是 untracked 文件与 `/dev/null` 有差异的预期状态。
- runner 仅解析 SFC `<script>` 内容的 TypeScript AST，提取四个箭头函数 initializer 并分别转译，在 `new Function` 中注入 `conditions`、`fields`、`ElMessage` 和 `t`。没有导入或求值整个 Vue 模块，不 mount、不调用 UI/API/Store/网络/权限/持久化。输入 fixture 通过 `structuredClone` 隔离，并恢复 `condition`/`conditions[0]` 对象身份；每项比较包含完整局部 state 与 `returnValue` 的深快照。
- 这些检查足以支持 22 个冻结副本的局部 validator 执行结论；不覆盖候选其余 19 项，也不覆盖 Goal 产品流程。

## 8. KB / Dashboard Truth Split

本报告是局部执行验证证据，保存在 S02-F01 `reviews/`；未更改 canonical KB、Goal、Session 或原始候选 Cases，也未将局部结果写成稳定产品规则。

## 9. Required Builder Repair

无需本轮 Builder 修复。两条 non-blocking 稳健性建议可留作后续 harness hardening，不影响当前局部结论。

## 10. Verdict

**`pass-with-findings`（有界通过，附两项非阻断测试稳健性建议）。** 可声明：当前 Vue 源码中与 HEAD 相同的四个 validator initializer，在合同选择的 22 个输入下通过完整局部快照；精确同 identity RED 负控、同 identity GREEN、定向 lint 与 diff-check 均有证据。不得声明产品合法性、UI/API/Store 行为、真实权限、保存/历史行为、任何 Goal AC 验收或 Goal 完成。S01 F01 仍 `CONDITIONAL`，真实权限仍 `BLOCKED / NOT_RUN`，6 个 `NOT_READY` 与 13 个来源阶段观察保持原分母和未验证状态。
