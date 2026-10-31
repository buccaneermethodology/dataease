# QVALUE-001 独立验证 r001

## 1. 任务理解

QVALUE-001 把调用方显式提供的九键普通单选状态投影拆为七键 `design` 与九键 `runtime`：保留默认值 A 与默认编码数组，丢弃源运行值 B，并在 runtime 中从默认值重新生成选择值。当前候选是离线纯函数，没有产品接入。

本轮验证可说明该实现对冻结的十个 case 及指定防御检查符合其窄合同；不能证明完整查询配置提取、组件/UI/Store、保存/重开、目标枚举有效性或任何真实权限行为。S02 的10项 Goal AC、16项产品义务均仍未关闭；只读用户限制、撤权与恢复仍为 `BLOCKED / NOT_RUN`。因此不把本结论写成 S02 或产品功能通过。

## 2. Read Manifest / Evidence Completeness

- 已读取用户提供的项目 `AGENTS.md`、`.codex/skills/sge-governed-checkpoints-sp010/SKILL.md`、独立 Validation recipe、Validation Agent 固定 Prompt、Context Efficient Validation protocol；运行 `guardrail_checklist.py --mode validation-agent`，通过。
- 验证卡 `planning/qvalue-001-validation-card-r001.json` 按 expected SHA-256 `b045975893a124ac47adb04825f990c3b2a496d9a9dcf722443bc951e86068c0` 复验，exit 0；ContextBootstrap `ContextBootstrap-QVALUE-001-validation-r001.json` 结构校验通过，profile 为 validation、mode 为 full_baseline，read/write boundary 与任务相符。
- 读取原始 S02 Goal 草稿、`Goal.final.json`、`CoverageMatrix.json`、S02-F01 `Sessions.md`、`PreparationStatus.md`、`DevelopmentHandoff.md`、`planning/SGC-and-Scope.md`、`DesignGapReconciliation-r001.md`，以及根 Dashboard 的 README、Big Ideas、Sessions、Decisions。`Goal.final.json` 保留26项 must-have，均为 pending；CoverageMatrix 存在并列出10个 Goal AC ID、16行产品/兼容义务，16行均为 `NOT_RUN`。因此它承担 Original Plan Coverage Matrix 的分母映射作用；未发现单独命名为 OPCM 的第二份矩阵。
- 读取 `QuerySingleSelectValueStateDesign-r001.md`、十个冻结输入/期望、`QuerySingleSelectValueStateDesignReview-r002.md`、QVALUE Builder card r003、Builder Context r003、target-bound admission、Topology r075、QVALUE execution evidence 及 RED/GREEN/lint 的 stdout、stderr、exitcode。
- 实际源码和 runner 均为当前新文件（Git 状态 `??`），与 Builder card 的两个文件写范围一致；没有对应的 tracked diff 可供对比。本报告逐字检查了两个文件全部内容，并复验实际 SHA：fixtures `06e21cbd6523b06e6e9c7c1ef1577e11e0d6e09bee27c7ccd46770e339f03553`，源码 `2a2b681c63906cb6a8e92882b2382bbe9621fde36defb2a039e6b2d028be5422`，runner `e079807871ce2fb12663bd0b229935e9f5442b436787f9563fafd54e43448b8b`。
- `planning/SGC-and-Scope.md` 明确写明无删除/延期出分母，Goal 的 `approved_scope_delta_registry` 为空；但未发现独立、逐项的 Scope Delta audit artifact。QVALUE 专属 Validation Handoff、closeout-language verdict 和 QVALUE Agent Log 也未找到。根 Dashboard 没有独立的 `Stage_Plans.md` 或 `Current_State.md`；SP-006 由 Sessions 表维护。缺少正式 closeout gate 不妨碍本报告评价窄候选，但必须在 Goal closeout 前补齐；它不能由本报告替代。
- Topology r075 记录了 QVALUE 设计/Builder/admission，但没有本次独立 Validation 的实际输出；该快照早于本轮验证。须由控制面 append-only 记录本验证结果及后续修复/复验，不能把 r075 当作本次验证拓扑绑定。

## 3. 阻断发现

### F-QVALUE-VAL-001 — RED 与 GREEN 的 runner 身份不同，旧 RED 的同 runner 声明未获证据支持（P2）

落盘 RED 汇总 `QVALUE-001-red.stdout.txt` 记录 runner SHA-256 `d13e3525eca5790d78cf06d9775539ac07ea1f9bf689ef6a712e52b5c07932a1`；GREEN 记录 `e079807871ce2fb12663bd0b229935e9f5442b436787f9563fafd54e43448b8b`。`QVALUE-001-ExecutionEvidence-r001.md` 称二者“同一 runner”，同时只说明 RED 后修过一处 Prettier 排版；RED 前的 runner 源文件或可审查的格式-only diff 未留存，因此不能独立证明差异仅为格式。冻结 fixtures 的 hash 相同，两个日志都显示17项检查，但这不足以证明 runner 身份相同。

验证者用当前 GREEN runner 和 `QVALUE_FORCE_UNIMPLEMENTED=1` 独立执行同一测试，确认断言层16/17失败、1项与实现无关的确定性检查通过、exit 1；当前 runner 加实际实现重跑为17/17、exit 0。故当前合同的 RED/GREEN 行为成立，但耐久 Builder 包中的“历史 RED 与 GREEN 同 runner”证据链仍不完整。建议保持旧证据不变，按当前 runner 重新追加 RED 及完整输出/退出码，并重新核对当前 GREEN/lint；或者提供可校验的旧 runner 内容及只含格式差异的证据，再对账执行说明。在该证据修复前，不能给候选包正式 pass。

### F-QVALUE-VAL-002 — 执行 Dashboard 的独立通过状态超前（P2）

根 `Dashboard/Sessions.md:51` 的 DE-EXEC-S027 写有“新单选默认值候选独立PASS_WITH_BOUNDS”，但目前该状态对应的 QVALUE 验证报告尚不存在，本报告也只能给 `partial`。该行同列的 QSINGLE-DEFAULT-COPY-001 已另有独立报告，故“新单选默认值候选”应与 QVALUE 区分；其 Evidence 仍链接旧 QSINGLE 的 Design/Validation 和 Topology r072。需要控制面将 S027 改为当前可证状态、补齐 QVALUE 专属引用，并使下游 `PreparationStatus.md` / Topology 与本轮 verdict 一致。此发现针对执行状态准确性，不表示源码行为失败。

## 4. 非阻断发现

### F-QVALUE-VAL-003 — 无环共享引用对象图按循环拒绝，输入边界未明确（P3）

`query-single-select-value-state.ts:32-57` 用单次遍历 `WeakSet` 标记所有已见对象但不在递归返回后移除；因此同一数组同时用于 `defaultMapValue` 和 `mapValue` 时，第二次遇到该数组会在第36行作为循环拒绝。验证者直接调用确认：该输入可成功 `JSON.stringify`，但函数返回 `INVALID_INPUT`。Design 仅要求拒绝循环/非 JSON 输入，没有明确约定“拒绝任何别名共享”，而当前十个 fixture 都经 JSON parse/clone，不覆盖别名图。

建议由 Builder 明确产品上游只传 JSON round-trip 后的树形值并把无别名约束写入输入合同和负例；若允许可序列化别名输入，则将循环检测改为仅跟踪当前递归栈，另加回归。此项不影响已冻结十个 fixture 的精确结果，也不单独阻止窄合同的技术结果。

### F-QVALUE-VAL-004 — 正式审计载体及终态绑定尚不完整（P2，阻断“正式接纳/Goal 收尾”）

CoverageMatrix 作为原始分母矩阵存在，且 `SGC-and-Scope.md` 及 Goal registry 显示没有已批准的范围削减；但没有独立逐项 Scope Delta audit。缺少 QVALUE Validation Handoff，closeout-language gate 尚未运行，Topology r075 未绑定本次 Validation，且无对应 Agent Log。以上文件不能由 RED/GREEN、Builder 执行说明或本报告自述替代。当前 QVALUE 仍可作为“技术行为经独立复核、证据包部分完整”的候选继续修复；正式收尾前需追加 Scope Delta 对账、handoff、语言 gate、final Dashboard/topology/diff reconciliation。

## 5. Scope narrowing / overclaim 检查

QVALUE Design、Fixtures 与实现均限于九键普通单选值投影；输出只定义 design/runtime 状态，不把默认显示值等同字段编码，不调用枚举，也未触碰产品入口、既有 COPY、无默认重建器或权限。原始 Goal 与16项产品义务在 Goal ledger / CoverageMatrix 中均保留。当前 Builder 执行证据声明上限清楚，没有把纯函数候选说成产品或 Goal 完成。

根 Sessions 对独立 `PASS_WITH_BOUNDS` 的提前记载属于例外，见 F-QVALUE-VAL-002；需更正。真实权限未被 standalone/admin/mock 替代。

## 6. 测试 / Gate 充分性

- 验证者以独立 harness 逐项比较10个冻结 identity 的完整 expected，并检查输入不变；另独立复核访问器不触发、非 JSON 值/循环拒绝、字段错误优先于形态错误、空字符串拒绝、深冻结输入和 design/runtime/input 数组隔离，共17项全部通过。
- 当前 GREEN runner 独立重跑：17/17、0 failure、exit 0；runner/source/fixture 摘要与当前文件吻合。当前 runner 的显式 unimplemented stub 独立 RED：16项冻结 oracle 断言失败、1项确定性断言通过，exit 1。两次均有 Node 的 module-type 性能提示，不影响断言。
- 定向 ESLint：`./node_modules/.bin/eslint src/custom-component/filter-copy/query-single-select-value-state.ts tests/filter-copy-query-reference/query-single-select-value-state.test.ts`，exit 0。无全前端 build 或本地产品/权限验证。
- 另据 Orchestrator 在本轮开始后提供的检查结果，`npm run ts:check` 被三处既有 `.vue.js` 文件触发 TS6504 阻断；单文件 `tsc` 又被现有 `@types/d3-dispatch/index.d.ts` 语法解析错误阻断。此为候选范围外的仓库/依赖基线限制，验证者未独立复跑；不归因于本次两个文件，也不纳入本候选 GREEN 结论。
- 技术用例覆盖足以支持冻结范围的行为复核，但历史 RED runner 摘要不匹配、正式审计载体缺项，使耐久包暂不能判 pass。未知的真实枚举、产品入口、保存回显及权限路径仍为 NOT_RUN，符合本候选 claim ceiling。

## 7. KB / Dashboard Truth Split

稳定产品规则仍归 `kb/` 与需求基线；本候选合同、测试、执行状态与 review 属于 `Dashboard/Artifacts/.../S02-F01/`。没有发现将候选提升成 KB 产品能力的改动。Dashboard 的 S027 独立通过表述需依 F-QVALUE-VAL-002 校正。

## 8. Required Builder / 控制面修复

1. 由 Builder/控制面依 F-QVALUE-VAL-001 追加使用当前 runner 的断言级 RED 和 stdout/stderr/exitcode，重新核对 GREEN/lint，并更新执行证据；保留历史日志，不覆盖。
2. 明确别名输入的规范：支持则修正 seen 检测并补测试；不支持则把无共享引用约束写入合同并补拒绝用例。此项为非阻断合同澄清。
3. 由 Dashboard/Topology 控制面修正 S027 的提前通过状态，登记当前 Validation verdict；随后追加 Validation Handoff、Scope Delta 对账及最终 closeout-language / 状态 reconciliation。验证者未修改 Builder、证据、Dashboard 或 Topology。

## 9. Verdict

**`partial`（部分通过）。** 技术行为层：当前实现与 runner 对冻结十个 case 及七项防御/隔离检查 17/17 相符，当前 runner 的独立 RED 也按预期在断言层失败。证据包层：旧 RED/GREEN runner digest 不一致，原始“同 runner”声明尚未被耐久证据复核；执行 Dashboard 另有提前通过记载，且 formal Scope Delta audit、Validation Handoff、Topology 后验证绑定和 closeout reconciliation 未完成。因此本轮只允许报告 QVALUE-001 的有界技术复核部分通过，不允许把候选正式标为 `PASS_WITH_BOUNDS`，更不允许声明 S02 Goal、产品链路或真实权限验收通过。修复后需对更新包做 delta/final-state Validation。
