# QCARRIER-001 Delta 独立验证 r001

## 1. 任务理解

QCARRIER-001 从已序列化的单条件 `propValue` 与空 `cascade` 中提取普通 VARCHAR 文本单选条件，生成完整的 design/runtime 两份载体。design 保留默认设置并移除运行值；显式默认时 runtime 由默认值重新水合；无默认时保留 `selectValue` 缺键并生成空 `mapValue`。本轮另外重点核验修正规则：`defaultValueCheck=true` 且缺少 `defaultValue` 必须返回 `UNSUPPORTED_FIELD`。

本报告检查冻结的14个案例、源码与测试、r002 RED/GREEN/lint 证据及 Goal 边界。该结果不证明产品复制/粘贴入口、查询目标适配、保存回显、权限或完整 S02 Goal。

## 2. Read Manifest / Evidence Completeness

- 依据：本轮 Validation 派发消息及其指定目标；项目 `AGENTS.md`；`.codex/skills/sge-governed-checkpoints-sp010/SKILL.md`；独立 Validation、Delta Validation recipe 和固定 Validation Agent Prompt。
- 已运行 `guardrail_checklist.py --mode validation-agent`，通过。复核设计 `QuerySingleSelectCarrierDesign-r001.md`、独立审查 `QuerySingleSelectCarrierDesignReview-r002.md`、14项冻结 fixtures、Builder card、target-bound execution admission、ContextBootstrap、RED/GREEN/lint r002 日志、Builder ExecutionEvidence、Topology r080、S02-F01 Sessions/PreparationStatus、根 `Dashboard/Sessions.md`、`Goal.final.json`、CoverageMatrix 与 ScopeDeltaAudit。
- 复核目标实现 `core/core-frontend/src/custom-component/filter-copy/query-single-select-carrier.ts` 和测试 `core/core-frontend/tests/filter-copy-query-reference/query-single-select-carrier.test.ts` 全文。两者当前为未跟踪候选文件，不能与已跟踪基线做 Git tracked diff；本验证依据冻结合同、授权写范围、r002 evidence digest 和实际文件内容核验。
- Topology r080 将 Builder 记录为 `completed_candidate`，将本验证记录为 `dispatched`。r080 是验证前拓扑，不绑定本报告结果；应由控制面在后续 append-only 拓扑中登记本报告。
- 没有单独的 QCARRIER Validation Handoff 文件或本 Validation 专属 card/ContextBootstrap。派发消息提供了任务范围、目标、只读边界和输出路径，但持久交接包尚缺。项目没有独立 `Dashboard/Stage_Plans.md` / `Current_State.md`；相应用 `Dashboard/Sessions.md` 的 SP-006 行、S02-F01 `Sessions.md` 和 `PreparationStatus.md` 核对。

## 3. Blocking findings

### F-QCARRIER-VAL-001 — 缺少耐久 Validation Handoff 与本轮状态绑定（P2，阻断正式包级通过）

项目 Validation recipe 要求交接包作为验证输入，并要求验证状态与最终拓扑绑定。当前只有本轮派发消息及 Builder 的 Topology r080 `dispatched` lane；没有 QCARRIER 专属 Validation Handoff/card/ContextBootstrap，也没有包含本报告 verdict 的后验拓扑。因此本报告可记录行为复核，但完整的 governed Validation 耐久链尚未闭合。

**修复要求：** 控制面应保留 QCARRIER-001 验证交接内容（authority、验收范围、冻结 digest、read/write scope、claim ceiling），并在验证完成后追加绑定本报告的 Topology 记录。不得改写 r080。该缺口不表示当前源码行为失败，但按 SP-010 验证规则，阻止将本轮报告提升为完整 governed 包级 `pass`。

## 4. Non-blocking findings

### F-QCARRIER-VAL-002 — QVALUE 调用次数由独立验证确认，但测试未显式锁定调用计数（P3）

设计与审查要求显式默认路径调用真实 QVALUE 恰好一次、无默认路径不调用。源码第 430–443 行遵循该分支；我另用 esbuild 计数包装器包裹真实 QVALUE 实现独立调用，确认显式默认调用一次、无默认调用零次。现有 runner 使用实际导入模块并验证完整输出，但没有持久断言调用次数。

这不是当前实现行为失败，也不单独阻止候选有界结论。后续可在 Builder 测试中增加只计数、不替换返回值的断言，固定该 seam 合同。

## 5. Scope narrowing / overclaim 检查

- 原始 Goal 的 `must_have_ledger` 有26项，全部仍为 `pending`。CoverageMatrix 保留10项 Goal AC和16项产品/兼容义务；ScopeDeltaAudit 记录已批准 Scope Delta 为0、16项产品义务仍为 `NOT_RUN`。
- QCARRIER 只新增设计合同规定的完整单条件纯函数，不改变 Goal 分母，不扩张为产品 adapter，也未借 standalone/admin/mock 代替权限证据。
- 只读用户查看/复制/粘贴限制、身份切换、权限撤销与恢复继续 `BLOCKED / NOT_RUN`；S02 Goal 未完成。

## 6. 测试 / gate 充分性

- 当前候选 digest 与耐久证据相符：源码 SHA-256 `5b625f68bf56393a39d3d5a721a20e7ac35d4598f8938d34a90064c3ed72d59d`；runner SHA-256 `63ed520ab13696cbb7fd76e303fecf54e3f4be77e276ef1ef6ac8cde4eb484e8`；14项 fixtures SHA-256 `03613abf4395405162baa736a7592dcaa1bc5be706b7b56960cd96860d93e371`。与 `green-r002.stdout.txt` 的摘要一致。
- 独立复跑 r002 同一 runner：22 项 GREEN 全通过、退出码0；显式未实现 RED 为21项预期失败、另1项运行值变更不影响载体的确定性断言通过，退出码1；两个目标文件定向 ESLint 退出码0。Node 仅输出模块类型性能提示，不影响断言。
- 独立重点检查 `defaultValueCheck=true` 缺失 `defaultValue` 在 shape 校验之前返回 `UNSUPPORTED_FIELD`，对应 runner 防御检查通过；冻结案例 TC-QCARRIER-011 覆盖其他必要字段缺失优先级，TC-QCARRIER-014 覆盖无默认时遗留 `defaultValue` 的 `UNSUPPORTED_SHAPE`。其他测试覆盖访问器不调用、非 JSON / 循环拒绝、共享引用接受与输出全隔离、运行值变化不影响 design/runtime、无默认 runtime 输出及冻结输入不变。
- 额外用真实 QVALUE 实现作计数包装检查：显式默认分支成功并调用一次；无默认分支成功且调用次数不增加。未替换 QVALUE 返回值。
- `git diff --check` 对 Builder 记录为通过；本验证仅新增报告，并会单独运行 `git diff --check` 检查本报告。
- 未运行全量前端类型检查、构建、浏览器/产品运行、数据库或权限测试；这些均不属于该纯函数切片的已通过证据。

## 7. KB / Dashboard truth split 检查

QCARRIER 是 Dashboard 下的候选设计、测试和执行证据，没有被提升为 `kb/` 中的稳定产品能力。根 DE-EXEC-S027 仍处于进行中，原 Goal 和权限限制继续可见。S02-F01 Sessions r024 记录候选与验证待回填，Topology r080 记录验证派发；完成本报告后需追加本轮验证结果，不能把验证前快照冒充最终绑定。

## 8. Required Builder repair

- **本轮代码/测试无需修复。** 新增的 default 缺键优先级修正与冻结合同一致；本轮复跑和独立调用均支持该结论。
- 控制面补齐 QCARRIER 专属耐久 Validation Handoff / Validation 状态绑定并更新后验 Topology。可选在未来测试中固化 QVALUE 调用次数断言。
- 继续维持 Goal 原始10项 AC、26项 ledger 与16项产品义务；真实多用户权限环境可用前，权限验收仍为 `BLOCKED / NOT_RUN`。

## 9. Verdict

**`partial`（部分通过）。** 行为层面，QCARRIER-001 冻结范围内的14个案例与8项防御/隔离检查共22项通过，RED/GREEN r002 同 runner 身份与摘要一致，定向 ESLint 通过；新增的 `defaultValueCheck=true` 且 `defaultValue` 缺键分类也符合合同。该证据支持后续把它作为有界纯函数候选使用。

但专属 Validation Handoff 与本轮后验 Topology 绑定缺失，完整 governed 验证包尚未闭环，因此本报告不授予完整包级 `pass`。无论本候选状态如何，它都不代表产品入口、保存回显、真实权限或 S02 Goal 完成；权限验收明确保持 `NOT_RUN`。
