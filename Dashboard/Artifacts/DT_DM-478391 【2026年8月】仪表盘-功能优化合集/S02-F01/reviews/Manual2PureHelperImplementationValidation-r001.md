# Manual2 纯 Helper 实现独立验证 r001

**Verdict：partial（部分通过）**。冻结窄合同内的纯 helper 与 runner 独立复跑通过；Builder 必需证据附件缺失，故本 lane 整体不能判为 pass。此结果只支持纯 helper 候选的局部行为符合性，不代表产品接线、真实来源认证、权限、保存/历史或完整 S02 Goal 验收。

## 1. 任务理解

本实现尝试新增单参数 `prepareManual2ValueState(valueState)`，从精确值态投影构造脱离输入的 carrier/runtime，统一拒绝不符合冻结子合同的数据；配套 runner 用冻结的 28 个 case identity 和 P2 防御性检查验证行为。它没有接入 UI、Store、API、source auth、权限、保存或历史链路。局部值态测试通过因此不能证明实际仪表盘功能或真实用户权限行为已满足原 Goal。

## 2. Read Manifest

- 权威与治理：用户消息中的继续执行授权、工作区 `AGENTS.md`、`.codex/skills/sge-governed-checkpoints-sp010/SKILL.md` 及 `references/recipes/validation.md`、`references/checklists.md`。
- 原目标和验收：`Goal.final.json`、`UserIntent.md`、`CoverageMatrix.json`、`PermissionEnvironment.md`、`Sessions.md`、`PreparationStatus.md`；保留原分母 10 Goal AC / 26 must-have / 16 产品义务，Scope Delta 为 none。
- 冻结规格：Manual2 Contract、Cases、合同 Review、Freeze、Builder Card 与 Context Bootstrap。
- 实现与门禁：纯 helper、runner、验证 Card/Context Bootstrap、两份 execution admission、Topology r256/r257；并检查产品适配器设计 Review、相关产品调用点及本工作区差异。
- 缺失：Builder Card 明确要求的 `planning/evidence/Manual2PureHelperBuilderEvidence-r001.md` 不存在。Topology r256 仅有结构化 source-missing RED 记录，没有该次 RED 的原始 stdout/退出码附件。本轮没有重演历史 RED；不能将其作为本轮观察到的原始命令证据。
- 本报告只写入验证 Card 授权的目标。未改源码、runner、合同、Cases、Goal 或权限环境。

## 3. 证据完整性

| 证据面 | 结论 |
| --- | --- |
| 原始 Goal / CoverageMatrix / Scope Delta | 已检查；原始分母和 none 范围差异保持。 |
| 窄合同与冻结 28 case identity | 已检查；未发现实现或 runner 替换冻结输入。 |
| GREEN 行为证据 | 本轮复跑 33 项均通过。 |
| RED 原始命令证据 | 缺少历史 stdout/退出码附件；结构化 Topology 记录与 runner 的 source-missing 分支只能支持历史摘要，不能证明本轮重演。 |
| execution admission / 文件摘要 | 验证目标、上下文摘要及 admission 绑定通过；helper 和 runner 摘要与 Topology r257 一致。 |
| Builder 必需输出 | 缺少 `Manual2PureHelperBuilderEvidence-r001.md`，属于 mandatory evidence gap。 |
| 独立 Validation Handoff | 当前验证 Card/Bootstrap 已提供；未将其视作 Builder 证据或验证结论本身。 |
| Dashboard / KB / closeout | 本 lane 只评纯 helper，不做 S02 最终收尾；KB 不适用。完整 Goal 及 closeout 证据未验收。 |

## 4. Blocking Findings

1. **Builder 必需证据未落盘。** Builder Card `planning/manual2-pure-helper-builder-card-r001.json` 的 `required_outputs` 包含 `planning/evidence/Manual2PureHelperBuilderEvidence-r001.md`，该文件当前缺失。因此证据链不完整，本报告整体只能为 partial。要求 Builder 在其授权范围内补齐实际实施证据（含真实 RED/GREEN 命令、退出码、测试身份及文件摘要），再运行 delta validation；本验证 lane 不代写该附件。
2. **历史 RED 缺原始执行附件。** `planning/Topology-actual-r256.json` 记录 28 frozen IDs、3 P2、31 次 `UNIMPLEMENTED` 行为失败及 source-missing 指纹，与 `sha256("<missing>")` 相符；但没有原始 stdout/退出码。若要将可信 RED 作为 Builder 完整证据，需补充可追溯的历史原始记录或按同一冻结身份重新执行 RED；本轮 GREEN 不能倒推 RED 曾按要求执行。

## 5. Non-Blocking Findings

- Node 输出 `MODULE_TYPELESS_PACKAGE_JSON` 性能 warning；runner 未失败，warning 不改变 33 项行为结果。
- helper 的成功/拒绝只界定冻结的 manual2 子域。来源 owner、产品接线、保存/历史和合法历史状态仍是独立未决项，必须由后续有准入的产品工作处理。

## 6. Scope Narrowing / Overclaim Check

**未发现本 lane 对原 Goal 偷换分母或声称完整验收。** Goal 的 10/26/16 和 `Scope Delta: none` 均保留。纯 helper 实现范围本来就是有界子任务；产品义务仍为 NOT_RUN。只读真实权限环境为 BLOCKED/NOT_RUN，不得用 standalone admin 或该 helper 的测试代替。

## 7. Test / Gate Sufficiency

- `node tests/filter-copy-query-reference/query-single-select-manual2-pure.test.ts`：33/33 checks 通过，`contract_valid=true`、`execution_ok=true`、`behavior_failures=0`。包括 28 个冻结 case identity、3 个 P2 检查及成功/拒绝的跨调用隔离。
- `M2P-024` 的 `$js:undefined` 在 `fromFixtureJson(item.input)` 中于 helper 调用前解码，runner 不把 marker 当生产输入。
- 定向 ESLint：退出码 0。精确文件严格 TypeScript 检查（含 `--allowSyntheticDefaultImports`）：退出码 0。
- 当前 helper SHA-256：`8b2b892de636e59e0ca0ba3c7e7e752cb9edb1027244d28bfb4597fa25bcef23`；runner SHA-256：`ed61301c2a932437a4cf426f639323d96b5f11c05c5dcdb4334b2c8083b1a151`，均与 Topology r257 相符。
- 源码检查确认 helper 只由该测试 runner 引用，`src` 下无产品调用点；因此验证支持“局部纯 helper 行为通过”，不支持产品使用或端到端行为结论。
- 历史 RED 不作为本轮复跑项，且证据附件缺失，按上文列为阻断证据缺口。真实权限、source auth、保存/历史及完整 S02 验收未运行。

## 8. KB / Dashboard Truth Split

本成果和阻断属于执行状态，留在 Dashboard Artifact；没有把局部实验结果升级为 canonical KB 产品知识。当前不更新 Goal 或 Session 的最终状态，也不把 GREEN 标成产品验收。

## 9. Required Builder Repair

由 Builder 补齐 Card 要求的证据附件，明确 RED 原始记录的来源/退出码（无法恢复时按冻结身份重新运行），并给出 GREEN、lint、TypeScript 命令输出摘要及 helper/runner 摘要。之后由独立 Validator 进行 delta validation。产品接线、来源认证和真实多用户权限仍须各自获得有效设计、准入及隔离运行证据，不能以本次 helper 结果关闭。

## 10. Verdict

**partial（部分通过）**：允许记录纯 helper 与确定性 runner 的窄合同行为复跑通过；由于 Builder 必需证据附件及历史 RED 原始记录缺失，整体实现验证不完整。当前不能声明 S02-F01 完成；真实权限和产品级义务继续 BLOCKED/NOT_RUN，原 Goal 的 10/26/16 分母及 Scope Delta none 保持不变。
