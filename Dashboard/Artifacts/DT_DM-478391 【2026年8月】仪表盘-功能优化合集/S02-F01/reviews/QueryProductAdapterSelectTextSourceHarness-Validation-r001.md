# ST-SRC-001 `infoFormat` isolated harness 独立 Validation r001

## 1. 任务理解

原始 Goal 的 mission 是完成图表和查询组件的完整过滤配置复制、同数据集兼容校验、整树粘贴、即时预览、保存/重开、权限与异常/兼容回归、独立验收和 S10 移交。本轮只独立复核该范围中的 `ST-SRC-001/CREATE` 局部 harness：它从 `options.ts` 的 TypeScript AST 中只提取 `infoFormat` 函数 initializer，在隔离作用域注入固定 Date 与 guid，再核对返回值快照和同步调用窗口计数。它声称的是这一个函数入口对冻结输入符合局部 oracle；它不证明 Vue/SFC 产品接线、复制链路、真实权限、保存/恢复或 Goal AC 验收。这个边界很重要：`infoFormat` 结果不能替代当前 Goal 要求的真实多用户产品验证。

## 2. Read Manifest

本轮是首轮完整 baseline。Context Bootstrap 的 required-read set 共 16 项，逐项核算摘要一致，`skipped_reads` 为空；Validation Card canonical digest 为 `f4ab5e766a4b47f6e28bb81e687eb7b54a1609869cbfe80cf1248145bef61e58`，`lane_task_card.py validate --expected-card-sha256` 返回 `pass`。Context Bootstrap `validate` 通过。

| 输入 | SHA-256 | 读取用途 |
|---|---|---|
| `Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/Goal.final.json` | `f562da2eb14b84dc8083e138dd2eb8718a58041f01d08163eddf5fb2c71daef0` | authority, scope, acceptance, claim_ceiling |
| `Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/QueryProductAdapterSelectTextSourceHarnessContract-r001.json` | `40816f37e536876af968d3b2c561edb41116797d5c8db659d231ef835c5e2b62` | contract, acceptance, scope |
| `Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/QueryProductAdapterSelectTextSourceCases-r003.json` | `64c2b0b03ef720de5c62353d183edf262a2db68f096d6ee1f1c0338c07eee960` | acceptance, oracle, provenance |
| `Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/reviews/QueryProductAdapterSelectTextSourceOracleDesignReview-r003.md` | `32432d6647dde7728eb9bd655f9c5caca752d0e828bcf5c22210843152d8a379` | design, independent_review |
| `Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/reviews/QueryProductAdapterSelectTextSourceOracleDesign-DeltaValidation-r002.md` | `341f42515db991a81978ab26b393e7b960001faf35a398f18005b6723e69d771` | validation, finding_history |
| `core/core-frontend/tests/filter-copy-query-select-text-source/info-format-harness.mjs` | `e5ad9536160635ca287010eec42db161cd62ef11f3d5b02353fea144fe25323d` | implementation, execution |
| `core/core-frontend/src/custom-component/v-query/options.ts` | `4be7d37dd75cf8a3759e807e1fd996194be2f35a829ad2f1306dc3a8ec061fc4` | implementation, source |
| `Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/planning/evidence/ST-SRC-001-INFOFORMAT-HARNESS-r001.md` | `3d1dfe857343d6956b6f11f7767ccf67e718f69fe80505a07e7278c7faabb2af` | execution, evidence |
| `Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/planning/Topology-actual-r289.json` | `cbb4eba1207784707f4d4bbcaf77011627e27030b66489ba8199d5b8b744e511` | topology, prior |
| `Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/planning/Topology-actual-r290.json` | `ab9aa74115d0777b8efc89538303a73212276b0f715999c15dfb244c5b262c47` | topology, admission |
| `Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/planning/Topology-actual-r291.json` | `21e1e631951343382f2797701df8ba22717a7d8b331172b835246312d3894fc7` | topology, execution |
| `Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/PermissionEnvironment.md` | `bf1498aa23f4f864e2c5c3d999b6b1a6044849ba25a9cd7d7d85104b6f233b9d` | dependency, permission |
| `Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/SP-005/S02-S09_EntryPacket.md` | `4598a5d74567e1e1d3de81ce263909231dc054d8102535bc0d917238c412c658` | dependency, S01 |
| `Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/planning/st-src-001-infoformat-harness-builder-card-r001.json` | `e4147775a5c0395213e3a0086e5493380931e28e87b71808a1396ed35fe6de51` | builder, card, provenance |
| `Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/planning/ContextBootstrap-S02-F01-ST-SRC-001-INFOFORMAT-HARNESS-r001.json` | `6cff7756e814a46a0aac17c85a4f04eb454d7df622e99fdee511a89ba0370d86` | builder, context, provenance |
| `Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/planning/execution-admission-st-src-001-infoformat-harness-builder-r001.json` | `46c1db5e66d57a0d5fc6d7fc3ba93abaece22af3c04e94900b8708996ebb7e1b` | builder, admission, provenance |

另按 `git status --porcelain=v1 --untracked-files=all` 盘点工作树，得到 2014 项 dirty/untracked inventory；这是本任务开始前已有的大型工作树状态，不等于本 harness 的修改。本轮核对的局部差异为：runner 是 untracked；`options.ts` 相对 HEAD 无差异，当前 `infoFormat` initializer 与 HEAD AST 文本相同；本报告与 Validation Context/Card 是本轮新增范围。其余工作树文件不属于本 lane，未作修改或纳入本结论。

## 3. Evidence Completeness

- 原始 Goal `DE-S02-F01` 的 `must_have_ledger` 有 26 项；冻结 Contract 分母为 10 项 Goal AC、26 项 must-have、16 项 product obligations，`scope_delta: none`。本次没有改写或缩小这些范围。
- ST-SRC-001 Contract 为 `frozen_for_local_harness_only`，只包含 `ST-SRC-001`；选中的 CREATE `before`、步骤和完整 `expected_after` 与 Cases r003 的同一 variant 逐对象相等。Cases r003 自身仍是 `candidate / frozen_for_builder=false`，其 case execution 保持 `NOT_RUN`；本轮验证不更新或晋升该源 fixture 状态。
- 真实权限环境仍 `BLOCKED / NOT_RUN`，S01 F01 EntryPacket 仍 `CONDITIONAL`。ST-SRC-006/007 仍 `NOT_READY / NOT_RUN`。这些不影响单函数 harness 的局部 verdict，但阻止把它提升为产品/Goal 验收。
- `execution_admission_v1.schema.json` 的 action enum 只有 `builder`、`install`、`upgrade`、`release`、`deploy`，没有 `validation`。既有 Builder admission 已按 `builder` target 通过脚本校验；它没有被当成 Validation admission。本轮未伪造 Validation admission。
- 原始 Goal ledger/全套 Session Closeout、KB truth、产品运行日志及产品级 Validation Handoff 不属于这个局部 harness 输出。它们仍是 Goal 最终收尾需要的证据，当前不能据本报告关闭 S02-F01。

## 4. Blocking Findings

无。本轮冻结输入、局部 runner、隔离执行与指定检查均取得可复核证据，未发现违反当前 ST-SRC-001 局部合同的问题。

## 5. Non-Blocking Findings

1. **局部 harness 不会晋升候选 Case 或完成产品 AC。** Cases r003 仍标记 candidate，ST-SRC-001 仍 `NOT_RUN`；本报告只验证 harness 执行器对合同中冻结副本的表现。后续应由有相应权限的产品 Validation 依据完整 Goal/Session 测试入口更新产品证据。
2. **产品前置条件保持未满足。** S01 条件和真实权限环境阻塞原样保留；禁止用 standalone/admin、mock 或此 harness 替代只读访问限制、权限撤销和恢复验收。

## 6. Scope Narrowing / Overclaim Check

未发现本轮对 Harness Contract 的范围缩窄：只验证 CREATE 一个变体，与冻结合同一致；Goal 原始 10/26/16 分母和 `Scope Delta: none` 均保留。若将本地 harness 结论表述成 AC-S02-02/03 通过、产品复制成功、权限通过或 Goal 完成，则属于超出证据的声明。

## 7. Test / Gate Sufficiency

- `node tests/filter-copy-query-select-text-source/info-format-harness.mjs`：独立重跑通过；输出 `PASS ST-SRC-001/CREATE: exact return snapshot; Date=2; guid=1; input unchanged; no module evaluation`，退出码 0。
- `./node_modules/.bin/eslint tests/filter-copy-query-select-text-source/info-format-harness.mjs`：通过，退出码 0，无诊断。
- 负向控制：在临时目录的 runner 副本中，把同一 CREATE 调用结果的 `id` 变异为 `mutant`，同一完整返回快照断言按预期失败；临时副本结束即清除。仓库中的 runner 前后 SHA-256 均为 `e5ad9536160635ca287010eec42db161cd62ef11f3d5b02353fea144fe25323d`。
- `git diff --check -- core/core-frontend/src/custom-component/v-query/options.ts`：通过。runner 是 untracked，因此另以 `git diff --no-index --check /dev/null <runner>` 检查；无空白诊断，退出码 1 是 no-index 对“文件与 /dev/null 存在差异”的预期状态。
- runner 解析 TypeScript 源文件且 parse diagnostics 为 0，按 AST 找到箭头函数 initializer，转译并仅以 `new Function` 执行提取代码。代码不导入 `options.ts`，不执行模块顶层 `useI18n()` 或 `attributes` 初始化。固定 fixture 输出深比较覆盖所有键与 `undefined` 所有权标记；另检查输入未变、Date 构造次数 2、guid 调用 1、`defaultValueFirstItem` 非自有属性。
- 上述检查足以支持本地单函数 harness 的有界结论；它们没有运行 UI、API、Store、网络、真实权限、持久化或历史恢复。

## 8. KB / Dashboard Truth Split

本轮结论属于执行验证证据，落在 S02-F01 `reviews/`；未写入 canonical KB，也未把执行状态冒充稳定产品知识。Goal/Session/Dashboard 状态未修改。

## 9. Required Builder Repair

无需 Builder 修复。

## 10. Verdict

**`pass-with-findings`（有界通过，附非阻断边界说明）。** 该 verdict 允许声明：当前 runner 在当前 `options.ts` initializer 和冻结 ST-SRC-001/CREATE 输入下，通过完整局部返回 oracle、Date/guid 计数、输入不可变、定向 ESLint 和可检出的负向变异控制。它不允许声明产品行为、Goal AC、真实权限或 Goal 完成；真实权限仍 `BLOCKED / NOT_RUN`，S01 F01 仍 `CONDITIONAL`，006/007 仍 `NOT_READY / NOT_RUN`。

## 追加独立复核记录（2026-10-21）

此补充保留前文作为本报告原始记录，并记录本轮按 full-baseline Card 完成的独立重跑。Card canonical SHA-256 `f4ab5e766a4b47f6e28bb81e687eb7b54a1609869cbfe80cf1248145bef61e58`，validator 与 renderer 均通过；Context SHA-256 `854dae9927bb53591ecdda838499954498632a8d0e4184b588236d3f17102fdd`，validator 通过。独立重算 Context 的 16 项 required-read revision 全部匹配，`skipped_reads=[]`。

冻结身份核对：Contract 只包含 `ST-SRC-001`，selected variant 为 `CREATE`；Cases r003 的同 Case/variant 与 Contract 嵌入副本的 `before` 输入及完整 `expected_after` 深比较相同。Contract `source_cases.sha256` 与 Cases r003 当前摘要一致。Cases r003 保持 `candidate / frozen_for_builder=false`；本轮不晋升或改写源 Cases 状态。目标源码 `options.ts` SHA-256 为 `4be7d37dd75cf8a3759e807e1fd996194be2f35a829ad2f1306dc3a8ec061fc4`，runner SHA-256 为 `e5ad9536160635ca287010eec42db161cd62ef11f3d5b02353fea144fe25323d`，均与 Context 的绑定摘要相同。`options.ts` 相对 HEAD 无差异；runner 是既有未跟踪文件。runner 解析 TypeScript AST，只转译并执行 `infoFormat` 箭头函数 initializer；没有导入/求值 `options.ts`，所以模块顶层 `useI18n()` 与 `attributes` 初始化未运行。

本轮实际验证（工作目录 `core/core-frontend`）：

- `node tests/filter-copy-query-select-text-source/info-format-harness.mjs`：退出码 0，完整 return snapshot、输入不变、Date=2、guid=1 与字段所有权断言通过。
- `./node_modules/.bin/eslint tests/filter-copy-query-select-text-source/info-format-harness.mjs`：退出码 0，无诊断。
- `git diff --check -- core/core-frontend/src/custom-component/v-query/options.ts`：退出码 0。
- 对未跟踪 runner、Contract、Cases 分别执行 `git diff --no-index --check /dev/null <path>`：均无空白诊断；退出码 1 是与 `/dev/null` 比较时文件存在差异的正常状态，不代表 whitespace failure。
- 同身份负向控制：在内存中对 runner 副本注入 `returnValue.id = 'mutant'`，仍使用原始 `ST-SRC-001/CREATE` identity、输入和 expected snapshot；冻结快照断言按预期以 `ERR_ASSERTION` 失败。仓库 runner 未改，执行前后 SHA-256 相同。此控制证明快照断言能拒绝该值变异；它不是产品源码 RED，也不证明实现前曾有可信 RED。

### 本轮 Findings inventory

- **阻断：无。** 当前冻结输入摘要、Case identity、runner/source 绑定、GREEN、定向 ESLint、差异空白检查及同 identity 负向控制均取得对应证据。
- **非阻断 `NF-ST-SRC-001-VAL-01`：副作用 oracle 未做通用动态拦截。** Runner 动态计数 Date/guid、深比较返回快照并检查输入不变，但没有通用网络/Store/权限写入拦截器；对当前 initializer 的静态审阅只见 `guid()` 与两处 `new Date()` 调用和对象构造，未见其他调用。故本报告只作当前 initializer 的窄范围声明，不把“零副作用”推广为通用隔离能力。
- **边界/后续：** 本结果不执行 SFC/UI、复制整树、Store/API、真实权限、持久化或保存/重开/Undo；Cases r003 的总体状态仍是 candidate，ST-SRC-006/007 仍 `NOT_READY`。S01 F01 仍 `CONDITIONAL`，真实多用户权限仍 `BLOCKED / NOT_RUN`。这些需要各自的产品级合同、环境与独立验证。
- **问题：无待答问题。** 当前无需 Builder 修复；若后续扩展 harness 对外部副作用的 claim，应先增加明确的可观测 oracle 与负例，再独立审查。

**复核结论：`PASS_WITH_FINDINGS_FOR_ST_SRC_001_CREATE_HARNESS`（对 ST-SRC-001/CREATE 本地 AST harness 有界通过，附一项非阻断证据边界）。** 仍保留 Goal 的 10 项 AC、26 项 must-have、16 项产品义务及 `Scope Delta: none`；本结论不代表任何 Goal AC、真实权限或 Goal 完成。
