# ST-SRC-006 Source Handler Harness 独立 Validation r001

## 验证结论

**PASS WITH BOUNDS（有界通过），附 1 项 P2 非阻断证据记账 finding。** 当前验证只支持冻结 ST-SRC-006 的 local source-handler harness。冻结身份一致，6 个 Case / 8 个 variant 的快照闭合；独立复跑 GREEN 8/8，内存单叶控制 RED 在原 identity 的精确快照断言失败；定向 ESLint 与针对未跟踪文件的有效 whitespace diff check 通过。

本 verdict 不表示 F01 产品功能或任何 Goal AC 已验收。Builder 报告中的 `git diff --check` 记账不准确；本报告明确记录影响及由独立复查补足的证据。

## 目标、范围和证据上限

目标是只读验证 Builder candidate 是否符合冻结 Contract/Cases、是否 AST 提取真实源码 initializer、是否遵守依赖注入边界、是否通过同 identity RED/GREEN 与定向检查。写入范围仅为本报告。未修复或改写 Builder runner、冻结输入、产品源码、其他 Dashboard 记录；没有运行产品、浏览器、构建或真实权限测试。

结论上限：只支持合同列出的真实 initializer 在受控本地状态和注入依赖下符合局部快照 oracle。不能证明 Vue mount 或 provide/inject 产品接线、真实级联订阅、枚举 API 与异步竞态、query emitter 订阅、API/Store、持久化、保存/重开/history、用户权限或完整产品链路；也不关闭 Goal AC。

## Context Bootstrap 与读取清单

指定 Context Bootstrap：`planning/ContextBootstrap-ST-SRC-006-source-handler-validation-r001.json`，SHA-256 `e585e4ea3d7a85b33ada68b801f1227a6f653aaa2b1e70c22573f47e921427d0`。其 14 项 `required_read_set` 均逐项重算匹配，未发生 identity drift。已读取的清单为：

1. `AGENTS.md`；`.codex/skills/sge-governed-checkpoints-sp010/SKILL.md`。
2. `Goal.final.json`、冻结 Contract、冻结 Cases、独立 Design Review r003。
3. 新 Builder runner、Builder evidence r001、Builder Context Bootstrap r001、Builder execution admission r001。
4. Topology r302（pre-builder）、r303（Builder candidate）、r304（Validation 当前拓扑）及 `Sessions.md`（r109）。

另核对 Goal 所引用的原始 Goal Draft r001（SHA-256 `118986e578d3afd19548abf45836a6f4d03cd70323b6edd4625d2c3cd468e8b9`）、S00 `AcceptanceCriteria.md`（`e07eba2e04340d2aecb97ab063bcbc4a9efe81d5026f30ea04fe1aee74f3cab0`）、`planning/UserIntent.md`、`PermissionEnvironment.md` 与当前工作树差异。Goal 内的 `must_have_ledger` 是本验证使用的原始 must-have ledger；`approved_scope_delta_registry` 为空，`Scope Delta: none`。本 lane 不改 canonical KB。

## 身份、分母与源码边界

复核摘要如下：

| Artifact | SHA-256 |
|---|---|
| Goal | `f562da2eb14b84dc8083e138dd2eb8718a58041f01d08163eddf5fb2c71daef0` |
| Frozen Contract | `4a1597dbd33ca71791df5584ec4ad1883b8eb956db67f0394763c697803d5329` |
| Frozen Cases | `31fda7840facd8a8db3852ec1810d34f79d8b6b12d94878118fdcc405c6e6685` |
| Runner | `81fed6996bda1920b10d5119b2f871714ac06f409a25949816539abf1faa8214` |

Contract/Cases 均标记 `frozen_for_builder=true`、`execution_status=NOT_RUN`；runner 断言冻结标志、Cases canonical digest 与 Contract 中 fixture SHA 一致、Case 顺序与 Contract identity 一致。独立结构检查确认共 6 case / 8 variant，且每个 variant 都满足 `set(expected keys) == set(snapshot_fields)`：

| Case ID | Variant ID |
|---|---|
| `ST-SRC-006-RUNTIME-FIRST` | `SINGLE-ROOT` |
| `ST-SRC-006-RUNTIME-MULTIPLE-FIRST` | `MULTI-ROOT` |
| `ST-SRC-006-CASCADE-FIRST` | `CASCADE-ROOT` |
| `ST-SRC-006-EMPTY` | `NO-OPTIONS` |
| `ST-SRC-006-CONFIG-CASCADE-CLEAR` | `CONFIG-PARENT` |
| `ST-SRC-006-CONFIRM-GUARD` | `CONFIRM-PREVENTS`、`FIRST-ITEM-OVERRIDE`、`NO-CONFIRM-ALLOWS` |

源 SFC 当前完整文件摘要与 Builder Context 绑定值一致，且与 pre-builder Topology r302 一致：`Select.vue` `30efd4a571a8146a68c8a57e64dfee93208670db4155b8f9257a4553efcfcac8`；`QueryConditionConfiguration.vue` `0b88bcdf92d15aceae52ca2992e7a8b4165e3f5cfc3f9cb7435296d7c7e9e047`；`Component.vue` `152703881a926e747e4e42f7c593a1558708efa73a3138cdb823cc519b01d081`。局部 initializer SHA-256（对 TypeScript AST initializer `getText()` 计算）：

| Source initializer | SHA-256 |
|---|---|
| `Select.vue:setDefaultValueFirstItem` | `44bdf4dc640088bec3e5f16b70d5e1a76586d99c784a3c0304809cf5fd9ed804` |
| `Select.vue:setDefaultMapValue` | `564c0482070a126d5b9fc4fe6957ef836454438f341948d621933d25b4a3bf1a` |
| `Select.vue:setCascadeValueBack` | `7c5ec0f3616148a53a8c70508347765a2cd5ad5c60414536e0b45ba18a16096c` |
| `Select.vue:emitCascade` | `7898add11d922da5801d451d682f03ecf223a32c4accc4d5175716cbd135e64e` |
| `Select.vue:emitCascadeConfig` | `2f1ac6c68f42f696a19e42c3b4a759dd9600a88a671a140d9fc2c3a5efc3ecb6` |
| `QueryConditionConfiguration.vue:setCascadeDefault` | `158aa817e5a13119007e41f2b14b8c8049769b93ecbf060881c0c64eec4bf2a2` |
| `Component.vue:isConfirmSearch` | `6ca08bd7ef494c201c6c291996fe010cb5ca75fcba3b502985cab7d3dc409e3f` |

Runner 分别从三个 Vue `<script>` 区块创建 TypeScript AST，检查 parse diagnostics 为零，并按 initializer 名提取真实函数后再 transpile；不执行 SFC 模块或挂载 Vue。Harness 注入 `nextTick` 可控队列、emitter 事件记录、`cloneDeep` 替身和 `queryDataForId` 调用记录 stub；真实 `Component:isConfirmSearch` owner 被提取执行，`componentWithSure` 来自 fixture。该边界与 Contract 一致，stub 不冒充 API、查询 emitter 订阅或组件树接线。

工作树存在多处与其他工作/既有任务相关的未提交改动。相关 Vue 文件已在 r302 记录相同摘要；本 Builder admission 的 write scope 只有新 runner，目标函数没有落入产品文件 diff hunk。验证未把整个共享工作树的其他变更归属给本 Builder，也未将其声明为干净。

## 独立执行结果

在 `core/core-frontend` 执行：

| 命令 | 结果 |
|---|---|
| `node tests/filter-copy-query-select-text-source/source-handler-harness.mjs --mode=red` | 退出码 1，符合预期。仅 `structuredClone(variant.expected)` 的首个 expected leaf 被替换为哨兵；冻结文件与 identity 未改。断言明确失败于 `ST-SRC-006-RUNTIME-FIRST/SINGLE-ROOT`，报告 actual `selectValue: A` 对 expected 哨兵值，命中 runner 第 278 行 exact snapshot `deepStrictEqual`。 |
| `node tests/filter-copy-query-select-text-source/source-handler-harness.mjs --mode=green` | 退出码 0，`8/8 exact frozen local source-handler snapshots`。RED 进程退出后重新启动 runner，原始 fixture bytes 经冻结 SHA 复核未变。 |
| `./node_modules/.bin/eslint tests/filter-copy-query-select-text-source/source-handler-harness.mjs` | 退出码 0，无诊断。 |
| `git diff --no-index --check -- /dev/null tests/filter-copy-query-select-text-source/source-handler-harness.mjs` | 无 whitespace 输出；因比较新文件与 `/dev/null`，Git 的预期差异退出码为 1。 |

## Finding 与处置

**VAL-ST-SRC-006-001 — P2 非阻断：Builder 的 `diff-check` 证据引用未检查未跟踪 runner。**

- **依据：** Builder evidence r001 及 Session r109 记录 `git diff --check -- tests/filter-copy-query-select-text-source/source-handler-harness.mjs` 通过；当时该 runner 为 untracked（`git status --short` 显示 `??`）。普通 `git diff --check` 不包含 untracked 文件，因此这条命令的零退出码不能证明该文件无 whitespace error。
- **影响：** 影响 Builder 对 diff-check 的证据记账，不影响 RED/GREEN 行为结论。Independent Validator 另行用 `git diff --no-index --check /dev/null <runner>` 检查，未发现 whitespace 输出，故当前 runner 的 whitespace 结论由独立证据支持。
- **Disposition：** 非阻断，`closed_by_independent_recheck`（独立复查补足）；建议维护者在后续证据记录中更正原命令的适用性。Validator 未改 Builder evidence、Session 或 runner。

无其他阻断 finding。后续可继续做本地 bounded harness 的 Dashboard/Goal evidence binding，但不得把本地 harness 结果映射成产品 AC 通过。

## 原 Goal 分母与未验证项

Goal 的 `must_have_ledger` 共有 26 项：10 项 `AC-S02-*` Goal AC 与 16 项产品义务；当前 10 项 Goal AC 状态均为 `pending`。`approved_scope_delta_registry` 为空，`Scope Delta: none`。本地 ST-SRC-006 结果没有移除、替代或关闭任何一项。

Session r109 与当前 Topology 保留 S01 F01 `CONDITIONAL`、真实多用户权限环境 `BLOCKED / NOT_RUN`。只读用户禁止查看/复制/粘贴、权限撤销、API/Store、保存/重开/history 与用户行为均未验证；不得使用 standalone admin 或替补权限实现替代真实鉴权证据。S02 原始 Goal Completion Predicate、全部必需项、独立终验、最终对账及 Stop Gate 仍未满足。

## 最终裁定

**ST-SRC-006 local harness Validation：PASS WITH BOUNDS；1 项 P2 非阻断 finding 已由独立 diff check 补足，但原 Builder 证据记账应后续更正。** 当前唯一可支持的行为结论是冻结 8 个 variant 在所列真实 AST initializer 和受控本地依赖下符合局部快照 oracle。任何产品验收、Goal AC 通过、真实权限通过或 S02 完成结论均不在此 verdict 范围内。
