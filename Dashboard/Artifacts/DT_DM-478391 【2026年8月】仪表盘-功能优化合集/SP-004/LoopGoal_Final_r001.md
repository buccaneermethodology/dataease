# DataEase S00 — 需求基线核对与验收契约建立 Loop Goal（Final r001 · 执行边界定稿）

> 状态：**S00 已获本轮用户授权；执行边界定稿**。产品需求仍为 reviewed/proposed，不是 Frozen；本稿不授予 S01 执行权。  
> 依据：`DataEase_F01-F08_Development_Plan_Draft_r001.md` 的 S00 定义。  
> 输入状态：KYM、V1.0、原始需求及开发计划均已定位；原始澄清聊天仅取得尾部五轮，Q155/Q156 完整题目与回答可用，Q01–Q154 原题证据尚不完整。详见 InputManifest.md。不得将汇编编号覆盖等同原始逐项核验。

## 1. Loop Goal

**Goal ID**：`DE-F01F08-S00-BASELINE-r001`  
**Goal Type**：Read-only requirements reconciliation / acceptance contract preparation  
**Outcome**：建立 F01–F08 的**可追溯、可审查、无隐性决策**的需求与验收基线，使后续 S01 技术调查和 S02–S09 开发分片能引用同一套经过审查的业务规则、功能决策与验收条件。

本轮只整理和审查基线；**不修改产品源码，不实现功能，不运行发布，不把 Draft 自动提升为 Frozen**。

## 2. Authority & Inputs

### 2.1 权威性层级

1. 用户明确裁定的 156 项决策（须有可定位的完整记录）。
2. 《DataEase F01–F08 完整需求规格 V1.0》：`docs/Req-Func-Optimization/DT_DM-478391 【2026年8月】仪表盘-功能优化合集（过滤器支持复制、查询条件支持过滤、表格移动端打开支持全屏、透视表…/DataEase_Requirements_V1_20261014.md`。
3. KYM 参考：`docs/Req-Func-Optimization/DataEase_KYM_Draft_r001_20261014.md`；`.kym-tco/dataease/kym/views/kym-r005.md`。
4. TCO 参考：`.kym-tco/dataease/reports/tco-r001-support/index.html`。
5. 原始需求参考：`docs/Req-Func-Optimization/DT_DM-478391 【2026年8月】仪表盘-功能优化合集（过滤器支持复制、查询条件支持过滤、表格移动端打开支持全屏、透视表…/DT_DM-478391 【2026年8月】仪表盘-功能优化合集（过滤器支持复制、查询条件支持过滤、表格移动端打开支持全屏、透视表….md`。原文与 V1.0 冲突时，以用户既有需求基线优先裁定为依据，不反向覆盖 V1.0；既有裁定来源见 InputManifest。
6. 开发计划：`Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/DataEase_F01-F08_Development_Plan_Draft_r001.md`，仅规划参考。
7. 测试环境参考：`Dashboard/debugging_env.md`；S00 不连接、不配置环境，不读取无关凭据。

输入精确摘要与来源见 InputManifest.json。上述第1项完整原始记录尚缺，不能用第2至4项替代。
**冲突规则**：已明确的用户裁定优先关系保持有效；其他无法证实的层级不自行确立。遇到矛盾、缺失、模糊或多义时登记 `DecisionNeeded`，由用户裁定；Agent 不得自行改变需求。KYM Draft 不能自动成为冻结的产品契约。

### 2.2 必需输入

- `KYM_Draft_r001.md`：完整文件、版本标识、来源。
- `Requirements_V1.0.md`：完整文件、版本标识、来源。
- `DecisionLog_156`：156 项问题、用户最终选择、问题上下文及适用 Fxx；若仅有选择字母而无题目/选项原文，视为**不可还原**。
- `Original_Requirements.md`：原始需求，用于 coverage 对账。
- `Development_Plan_Draft_r001.md`：本次 S00 范围定义。

文件未齐全时允许完成 **Input Gap Report**，但不允许宣称基线核对完成。

## 3. Scope / Non-goals

**In scope**：F01–F08 全部业务规则、决策、验收条件、边界/异常场景、KYM Target Profiles、跨文档一致性、来源追溯、未决问题、验收测试设计与最小测试数据/fixture 规格；记录已有测试夹具的证据（若可访问）。

**Out of scope**：跨功能冲突检测（用户明确暂不做）；S01 代码连接点调查；S02–S09 开发；实际创建或修改测试代码/fixture；环境搭建；发布；未经授权的需求新增或重裁定。

**区分**：本轮可以核对同一需求在多个输入文档中的陈述是否一致，但不开展 F01–F08 功能之间的冲突检测。

## 4. Work Packages / Sessions

| Session | 工作 | 产出 | 退出判据 |
|---|---|---|---|
| S00.1 Input & Authority Bootstrap | 清点输入、版本、来源、完整性；固定引用与哈希 | `InputManifest.md`、`InputGapReport.md` | 必需文件可识别；缺失项显式记录 |
| S00.2 KYM Goal Alignment | 提取目标、Target Profiles、Scope/Exclusions、Unsolved Problems | `KYMAlignmentMatrix.md` | F01–F08 均有目标映射或明确缺口 |
| S00.3 Decision Reconciliation | 逐项关联 156 项问题、选项与最终裁定；识别覆盖和冲突 | `DecisionLedger.csv` / `.md` | 156/156 均有记录；不可恢复者标缺口，不能臆造 |
| S00.4 Requirements Coverage | 原始需求 ↔ V1.0 ↔ 决策 ↔ Fxx 规则逐项对账 | `RequirementCoverageMatrix.md` | 原始关键需求 100% 有 disposition（保留/修改/排除/待裁定） |
| S00.5 Acceptance Contract | 为每项有效规则建立可测试 AC、边界、反例、fixture 规格 | `AcceptanceCriteria.md`、`FixtureSpec.md` | 所有有效规则均映射 AC 或注明不可测试原因与阻塞项 |
| S00.6 Independent Review | 独立核查来源、漏项、冲突、伪决策和测试可执行性 | `ReviewFindings.md` | 每条 finding 有 severity、evidence、impact、recommendation、disposition |
| S00.7 Reconciliation & Closeout | 处理审查发现，整理待用户裁定项，给出两个 verdict | `S00Closeout.md`、`S01EntryPacket.md` | 达成下述 Stop Gate；未达成则明确 BLOCKED |

## 5. Traceability Schema

每条需求或规则至少记录：

`RequirementID | FunctionID | SourceFile | SourceLocator | SourceVersion | OriginalStatement | DecisionID(s) | FinalRule | Status | AC_ID(s) | TestScenarioID(s) | FixtureID(s) | OpenIssueID(s)`

- ID 建议：`REQ-F01-001`、`BR-F01-001`、`DEC-001` 至 `DEC-156`、`AC-F01-001`、`TC-F01-001`、`ISS-S00-001`。
- `Status`：`confirmed` / `superseded` / `excluded` / `needs_decision` / `missing_evidence`。
- 来源定位必须精确到文件章节/标题/行号（若可用）；不允许只写“根据历史讨论”。
- 决策编号与功能编号之间可以一对多；禁止强制一对一映射。
- 验收条件采用 `Given / When / Then`，包括适用的正常、边界、异常、权限、持久化与回归场景。

## 6. Acceptance Criteria（S00 自身）

| ID | Given | When | Then |
|---|---|---|---|
| S00-AC-01 | 五类必需输入已登记 | 审核 manifest | 每份文件有来源、版本、可读性和缺失状态；缺失不被隐瞒 |
| S00-AC-02 | 156 项决策的完整题目与裁定可访问 | 执行决策映射 | `DEC-001..156` 无漏号；每条有原题/最终选择/对应规则/证据；不完整则 BLOCKED |
| S00-AC-03 | 原始需求与 V1.0 可访问 | 执行覆盖核对 | F01–F08 各项原始关键需求均被保留、修订、排除或列为待裁定，并有证据 |
| S00-AC-04 | KYM 可访问 | 执行目标对齐 | 每个 Fxx 对应 KYM 目标/边界或标明缺口，不擅自新增 Target Profile |
| S00-AC-05 | 规则清单形成 | 生成验收契约 | 每条有效业务规则关联至少一个 AC 或显式的测试设计阻塞项 |
| S00-AC-06 | 规则含边界、异常、权限约束 | 设计测试场景 | 适用场景包含正例、反例、边界与必要 fixture 规格，阈值只引用已确认基线 |
| S00-AC-07 | 独立审查已完成 | 核对 findings | 高严重度问题全部修订或明确阻塞，不存在无依据的“已解决” |
| S00-AC-08 | 用户尚未批准冻结 | 输出 Closeout | 仅标 `proposed` / `reviewed` / `blocked`，不得标 `frozen` 或授权 S01 自动执行 |
| S00-AC-09 | 已有用户范围裁定 | 检查范围 | 不开展跨功能冲突检测，不改代码，不修改原始权威文档 |

## 7. Quality Gates

- **Completeness**：F01–F08 均覆盖；156 项决策完整性为 156/156（不等于 156 项都能映射成功）；原始需求关键条目均有 disposition。
- **Evidence**：每个已确认规则和裁定有来源定位；推断、建议与已裁定事实严格分栏。
- **Consistency**：同一 Fxx 内术语、规则、异常路径一致；跨文件不一致必须显式记录。**不执行跨功能冲突检测**。
- **Testability**：AC 可观察、可判定；对尚无环境或数据的场景输出 fixture 规格，不声称测试已执行。
- **Change Control**：不静默修改原始需求或 156 项决策；建议改动以独立 change proposal 呈现。
- **Independence**：由不同于基线整理执行者的独立 reviewer 审查并保存可复核报告；自检不能冒充独立审查。Goal 预审不替代 S00.6 对完整交付的审查。

## 8. Review & Verdict

独立审查逐项输出：`Finding ID / Severity / Evidence / Impact / Recommendation / Disposition (accept | accept_with_revision | reject | needs_evidence)`。

分别给出：

1. **Requirements Baseline Validity**：`VALID / VALID_WITH_CONDITIONS / INVALID / INSUFFICIENT_EVIDENCE`。
2. **S01 Entry Readiness**：`READY / CONDITIONAL / BLOCKED`。

只有必需输入齐全、关键来源和 156 项决策可核验、无阻塞未决问题、审查 findings 处理完毕，才可建议 `READY`。**READY 只是进入 S01 的建议，不是执行授权。**

## 9. Stop Gate & Completion Predicate

**Success** 当且仅当：

- 输入 manifest 完整且必需资料可访问；
- 156 项决策逐项核对完成；
- F01–F08 的 KYM / V1.0 / 原始需求覆盖对账完成；
- 所有有效规则有 AC 和测试设计追溯；
- 独立审查完成，阻塞性 finding 为零；
- 形成可复核的 S01 Entry Packet 与 Closeout；
- 用户对需要裁定的事项作出明确决策（如有）。

**Blocked**：缺失完整 KYM/V1.0/决策上下文；发现无法由证据消解的关键矛盾；缺失独立审查。此时交付 gap/finding 报告，不得伪报完成。

**Stop**：达到 Success 后停止，不自动启动 S01；Blocked 时进入可恢复的待补资料或待裁定状态，Goal 不标完成；资料补齐后重验 S00.1，再按 S00.2–S00.7 续跑；不得无限重复扫描或自动扩大范围。

## 10. Builder Entry Conditions

- 先验证资料可读性；若缺失，只执行 S00.1 并请求资料，禁止推断 156 个字母选择的含义。
- 使用只读权限读取仓库/文档；产物写入独立的 S00 工作目录，禁止覆盖权威输入。
- 所有输出保留版本、时间、输入摘要及可复核来源。
- 不得以“已有开发计划”代替需求证据。
- 本轮用户已明确授权执行本 Loop Goal，不重复索取 S00 授权；用户另行授权后方可进入 S01。

## 11. 建议目录

```text
所有过程Artifacts均放入这个目录下：Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集
至少应该包含如下建议的artifacts：
/SP-004/
  LoopGoal_Draft_r001.md
  InputManifest.md
  InputGapReport.md
  KYMAlignmentMatrix.md
  DecisionLedger.md
  RequirementCoverageMatrix.md
  AcceptanceCriteria.md
  FixtureSpec.md
  ReviewFindings.md
  S00Closeout.md
  S01EntryPacket.md
```

## 12. 当前已知待解决问题

1. Goal 执行边界定稿：本文件，base SHA-256 `8478760f3587f35836bdb868c49dfa8c5c6127c4fe24420beb9255829d53c255`，应用补丁见 GoalPatch.json。原草案保留不覆盖。
2. Stage Plan：SP-004；Big Idea：DE-REQ-BI01；S00.1–S00.7 对应 DE-EXEC-S017–S023。
3. DecisionNeeded：补齐 Q01–Q154 原题/选项/回答，或用户明确批准调整该项验收门槛；未获回复前保留原完成分母。

> **当前判定**：`Requirements Baseline Validity = INSUFFICIENT_EVIDENCE`；`S01 Entry Readiness = BLOCKED`。这是基于输入证据的状态；S00 执行进展见本目录 README，不代表 Goal 已完成。
