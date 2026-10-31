# ST-SRC-001 Date Oracle 有界 Delta Validation r002

## 结论

**PASS WITH BOUNDS（有界通过）。** 候选 Design/Cases r003 已把 ST-SRC-001 的 Date 计数窗口明确限定为一次同步 `infoFormat(input)` 调用：只从 `options.ts` AST 提取 `infoFormat` initializer，不导入或执行模块主体；调用前将计数器归零并启用，函数同步返回后立即停止。对当前源码 initializer 作独立静态 AST 遍历得到 2 次 `new Date()`、1 次 `guid()`，与 r003 oracle 相符。此处是源码结构核对，不是候选测试执行。

**阻断 finding：无。** r002→r003 的变更限于 ST-SRC-001 的步骤/Date 窗口断言及对应 fixture protocol/revision note；其返回快照、其他 case、分母及依赖状态保持。该结论仅关闭 `F-ST-SRC-ORACLE-002` 在候选文档中的局部歧义，不证明 ST-SRC-001 已运行或产品验收。

## 独立入口绑定

当前没有可复用的 ST-SRC-001 专属 Delta Validation Card/Context；已新建本 lane 的独立入口：

- Card：`planning/st-src-001-date-oracle-delta-validation-card-r001.json`，canonical SHA-256 `5f6fa241132b4d4e9e567dcc4a572cfec7f0626ddbeea48ce583b2367ba77938`；`lane_task_card.py validate --expected-card-sha256 ...` 返回 `verdict: pass`。
- Context：`planning/ContextBootstrap-S02-F01-ST-SRC-001-DATE-ORACLE-DELTA-VALIDATION-r001.json`，原始 SHA-256 `ff53324f0617d2095d82701cc7c62d2f0ab57d7397220e55a8514c36a80e813e`；`context_bootstrap.py validate` 成功。
- Card 仅授权本报告为 Validation lane 输出。未创建或声称存在 Validation execution admission。

## Read Manifest

Context 的 13 项 required-read set 全部存在，独立重算 SHA-256 均匹配，`skipped_reads` 为空：

| 输入 | SHA-256 |
|---|---|
| `S02-F01/Goal.final.json` | `f562da2eb14b84dc8083e138dd2eb8718a58041f01d08163eddf5fb2c71daef0` |
| `S02-F01/QueryProductAdapterSelectTextSourceOracleDesign-r002.md` | `ac43c98289649407b53eb082a3d302f64aa39254494bbf0d4e299a9ae8fd5865` |
| `S02-F01/QueryProductAdapterSelectTextSourceCases-r002.json` | `9661f5a4689c150ee6bf07c1856bede06a80acc55ea966f6001ac326f8ae2cd0` |
| `S02-F01/reviews/QueryProductAdapterSelectTextSourceOracleDesign-DeltaValidation-r001.md` | `3c656c91d9e5e0eb39f204e488b0108371d3404de5902aef6418fc639599a4cc` |
| `S02-F01/reviews/QueryProductAdapterSelectTextSourceOracleDesignReview-r002.md` | `2224d174b2751e2de6154393f14842336945aedd0e4349eef74af18f1d5dee26` |
| `S02-F01/QueryProductAdapterSelectTextSourceOracleDesign-r003.md` | `67251797198a725662920aed1fe29a4767c94a492e76b8d32452cc547a815f9f` |
| `S02-F01/QueryProductAdapterSelectTextSourceCases-r003.json` | `64c2b0b03ef720de5c62353d183edf262a2db68f096d6ee1f1c0338c07eee960` |
| `S02-F01/reviews/QueryProductAdapterSelectTextSourceOracleDesignReview-r003.md` | `32432d6647dde7728eb9bd655f9c5caca752d0e828bcf5c22210843152d8a379` |
| `core/core-frontend/src/custom-component/v-query/options.ts` | `4be7d37dd75cf8a3759e807e1fd996194be2f35a829ad2f1306dc3a8ec061fc4` |
| `S02-F01/PermissionEnvironment.md` | `bf1498aa23f4f864e2c5c3d999b6b1a6044849ba25a9cd7d7d85104b6f233b9d` |
| `SP-005/S02-S09_EntryPacket.md` | `4598a5d74567e1e1d3de81ce263909231dc054d8102535bc0d917238c412c658` |
| `S02-F01/planning/Topology-actual-r289.json` | `cbb4eba1207784707f4d4bbcaf77011627e27030b66489ba8199d5b8b744e511` |
| `.codex/skills/sge-governed-checkpoints-sp010/schemas/execution_admission_v1.schema.json` | `c407825121d2a29df93dee804f21ef524155846edf354a7bdf2b50b2be7704df` |

## Date 窗口复核

- **源码范围：** TypeScript parser 对当前 `options.ts` 的解析诊断为 0。`infoFormat` 是第 6 行起的 `ArrowFunction` initializer（到第 67 行）；只遍历该 initializer 的 AST，计得 2 个 `NewExpression(Date)` 和 1 个 `CallExpression(guid)`。没有导入或求值 `options.ts`、没有调用 `infoFormat`、没有运行 r003 候选测试。
- **顶层排除：** `attributes` initializer 从第 80 行起，位于 `infoFormat` initializer 之外，包含模块加载期字段默认值。r003 的 AST-only 提取边界不执行该模块初始化，因此其中 Date 调用不会混入本次窗口。
- **窗口边界：** Cases r003 的步骤及 `dateObservationWindow` 明确：调用前立即归零并开始；只包围一次 `infoFormat(input)` 同步调用；同步返回后立即停止；期望 2 次；排除模块顶层 `attributes` 初始化。边界无等待或微任务阶段，计数范围唯一。
- **值 oracle：** r003 `expected_after.dateConstructorCalls` 为 2，`guidCalls` 为 1；返回的 `arbitraryTime` 与 `arbitraryTimeRange` 都是固定 `2026-10-20T00:00:00.000Z`。本次只对 JSON 结构及源码静态结构作核对，没有用 fixed Date shim 执行函数，也没有验证 runtime return object。

## r002 → r003 范围差异

- ST-SRC-001 `CREATE` 的 `before` 与 `expected_after` 保持不变；新增步骤规定 AST initializer 提取、隔离 Date/guid 依赖和计数器启停；新增 `dateObservationWindow` 断言限定观测区间。fixture protocol 仅补充对应 Date 计数窗口定义。
- ST-SRC-002..007 的 case 对象、身份、expected 与状态未变。共有 7 个 Case ID；001..005 继续 `DETERMINATE_CANDIDATE / NOT_RUN`，006/007 继续 `NOT_READY / NOT_RUN`。
- 分母仍为 10 项 Goal AC、26 项 must-have、16 项 product obligations，`Scope Delta: none`。Goal `must_have_ledger` 为 26 项；候选 16 项产品义务仍未执行。
- S01 F01 EntryPacket 仍为 `CONDITIONAL`；真实权限环境仍 `BLOCKED / NOT_RUN`。standalone/admin、mock 或本次 AST 读取均不证明只读身份限制、权限撤销/恢复或产品行为。

## Finding 与限制

- `F-ST-SRC-ORACLE-002`：**局部文档 finding 已关闭。** 旧版计数未说明模块导入与计数启停范围；r003 通过 initializer-only AST 提取和同步调用窗口消除了该歧义。关闭范围仅为候选规格唯一性。
- **Validation admission 能力差异：** 当前 `execution_admission_v1.schema.json` 的 action enum 为 `builder`、`install`、`upgrade`、`release`、`deploy`，没有 `validation`。本报告如实记录该 schema 限制；没有伪造 Validation admission，也没有将其他 action 冒充 Validation。
- 没有运行候选测试、handler harness、产品 UI/API/Store、权限、保存或历史行为；没有修改 Design、Cases、`options.ts`、Goal、Sessions 或 Stop Gate。此 Delta Validation 不给 ST-SRC-001 颁发 Builder admission。

**Claim ceiling：** 仅确认 r003 的 ST-SRC-001 Date 观测窗口定义与当前 `infoFormat` AST 结构相符，并确认其余指定范围未漂移；不证明函数执行、返回行为、产品 UI/权限、完整 F01 验收或 Goal 完成。
