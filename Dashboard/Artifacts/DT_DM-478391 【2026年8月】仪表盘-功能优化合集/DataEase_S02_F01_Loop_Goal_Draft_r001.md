# DataEase S02 — F01 过滤器复制粘贴 Loop Goal（Draft r001）

> 状态：待审查的 Goal 设计稿；不是执行授权或设计冻结。
> 上游：F01–F08 开发计划 Draft r001；S00 需求基线；S01 代码连接点调查。
> 证据限制：目前未核验 KYM Draft r001、需求 V1.0、156 项裁定和 S00/S01 完成凭证，以下不得冒充已冻结需求。

## 1. Goal Statement

在 S00 冻结 F01 业务契约、S01 确认代码连接点且获得开发授权后，以最小可回滚改动，实现从源图表复制过滤器配置、在合法目标图表校验并粘贴、应用、保存和重新加载的完整路径；通过功能、权限、安全、兼容性、异常及回归验证，完成独立审查和最终对账。

**成功不等于按钮出现或构建成功**；必须证明完整业务路径符合冻结验收契约。

## 2. Entry Gate / Authority

1. S00：F01 的 Requirement、Business Rule、Decision、Acceptance Criteria 已冻结，重大未决问题已裁定。
2. S01：F01 UI 入口、状态模型、API/后端、持久化、权限、既有测试及改动面均有代码证据；S02 Entry Readiness 为 READY，或条件明确可满足。
3. 固定仓库 revision、分支、工作树基线；保护既有未提交改动。
4. 明确 Builder、Independent Reviewer、Goal Controller 和用户授权边界。
5. 未经额外授权，不发布、不推送远端、不迁移生产数据库、不修改真实业务数据。

未满足门槛时只允许补齐证据/形成 Blocker Report，不得擅自开始功能代码开发。

## 3. Scope / Non-goals

**范围内**：源过滤器复制入口与配置载荷；目标兼容性判断；粘贴反馈；配置应用、持久化与回显；权限和敏感数据保护；相关单测、集成、E2E 与回归测试。仪表盘、报告模板等适用组合须以 S00 裁定为准。

**范围外**：F02–F08；跨功能业务冲突检测；无关架构重构；未经裁定的撤销、批量粘贴、跨数据集字段自动映射；部署与发布。

**必须先裁定**：复制配置还是当前筛选值；源/目标图表与数据集兼容规则；字段 ID/名称映射；目标已有过滤器时覆盖/合并/拒绝策略；剪贴板作用域与生命周期；敏感字段处理；取消与失败时的状态；权限与审计规则。Builder 不得自行选择产品默认行为。

## 4. Loop Sessions

| ID | 任务 | 交付物 | 退出标准 |
|---|---|---|---|
| S02.0 | Context Bootstrap、核对 S00/S01 Gate、固定版本与权限 | ContextBootstrap、InputManifest、BaselineReport | 输入和工作树可复核 |
| S02.1 | F01 Slice Contract、兼容矩阵、技术方案及 Pre-execution Review | F01SliceContract、CompatibilityMatrix、DesignReview | 关键语义无未决；Design Freeze Valid |
| S02.2 | 实现复制入口、配置提取、载荷和复制反馈 | 代码 diff、单测 | 复制正常/异常/权限路径可证 |
| S02.3 | 实现目标校验、粘贴应用及拒绝反馈 | 代码 diff、校验测试 | 合法成功；非法拒绝且不破坏目标 |
| S02.4 | UI 集成、保存/回显及适用模板场景 | 集成代码、UI/E2E 测试 | 复制→粘贴→保存→重开完整链路通过 |
| S02.5 | 安全、兼容、异常、回归与自动化验证 | TestEvidence、CoverageMatrix | 全部冻结 F01 AC 有可复现通过证据 |
| S02.6 | Independent Validation，逐项处置 findings | IndependentReviewFindings | 阻塞项关闭，独立审查可复核 |
| S02.7 | Final Reconciliation、Stop Gate、移交 S10 | Closeout、CompletionReceipt、S10Handoff | Completion Predicate 满足 |

S02.2–S02.4 可进一步拆小，但每片均需测试与证据，不将验证全部推迟到 S10。

## 5. 候选场景矩阵（须与 S00 AC 对账）

| ID | 场景 | 预期 |
|---|---|---|
| TC-F01-01 | 合法源复制 | 获得符合契约的配置载荷及反馈 |
| TC-F01-02 | 合法目标粘贴 | 过滤器正确应用 |
| TC-F01-03 | 保存后刷新/重开 | 配置与实际效果符合契约 |
| TC-F01-04 | 不兼容图表/字段/数据集 | 按规则拒绝或提示，不产生部分写入 |
| TC-F01-05 | 无权限复制/粘贴 | 前后端权限均生效 |
| TC-F01-06 | 空配置/非法载荷/失效内容 | 明确反馈，系统状态稳定 |
| TC-F01-07 | 目标已有过滤器 | 按**待冻结**的覆盖/合并/拒绝规则处理 |
| TC-F01-08 | 敏感字段/值 | 不越权泄露或传播 |
| TC-F01-09 | 网络/保存失败、重复操作 | 状态与错误处理符合契约 |
| TC-F01-10 | 既有过滤器创建、编辑、使用 | 无回归 |
| TC-F01-11 | 仪表盘/报告模板组合 | 仅覆盖 S00 纳入范围的组合 |

此表是**测试候选**，不能替代正式 V1.0 或凭空新增需求。

## 6. Evidence Chain

`S00 REQ/DEC/AC → S01 Code Entry → S02 Design Decision → Changed Symbol → Test → Execution Evidence → Independent Finding → Closeout`

每条关键变更登记：变更 ID、需求/决策/AC ID、修改前后 commit、文件/符号、行为影响、测试 ID、日志位置、兼容性影响和回滚方法。所有技术事实必须有源码位置或运行证据；未运行测试标为 NOT_RUN。

## 7. Quality Gates

| Gate | 通过条件 |
|---|---|
| QG-01 Contract | F01 规则与 AC 完整冻结，关键未决项已裁定 |
| QG-02 Scope | 变更仅触及经审查的必要连接点；扩展范围获批准 |
| QG-03 Functional | 所有冻结 F01 AC 通过；完整复制→粘贴→保存→回显链路通过 |
| QG-04 Security | 权限不可绕过；敏感配置受保护；非法载荷安全拒绝 |
| QG-05 Compatibility | 历史过滤器配置及原有编辑/使用行为回归通过 |
| QG-06 Test Integrity | 测试环境、命令、fixture、预期/实际、日志与 commit 可复核 |
| QG-07 Independent Review | 独立 Reviewer 检查代码与证据，阻塞 findings 关闭 |
| QG-08 Governance | 工作树和授权操作对账完整；具备回滚路径 |

性能阈值沿用 S00 已裁定标准；若缺失则先测基线并提交决策，不编造毫秒指标。要求**冻结业务规则与 AC 的测试映射覆盖率为 100%**，不以行覆盖率代替业务覆盖。

## 8. Goal Acceptance Criteria

- **AC-S02-01**：Entry Packet、仓库 revision、权限及前置门槛均可复核。
- **AC-S02-02**：所有冻结 F01 REQ/BR/DEC/AC 已映射到设计与测试，无关键未决项。
- **AC-S02-03**：Design Freeze Review 有明确结论，代码实现不越界。
- **AC-S02-04**：复制、兼容校验、粘贴、保存和回显完整链路符合契约。
- **AC-S02-05**：非法目标、无权限、错误输入和保存失败按契约处理。
- **AC-S02-06**：权限、安全与历史配置兼容均有验证证据。
- **AC-S02-07**：冻结 F01 AC 测试覆盖 100%，必需测试通过；失败/跳过/未运行不得隐藏。
- **AC-S02-08**：既有过滤器回归通过，变更与回滚方案可追溯。
- **AC-S02-09**：独立审查 findings 有编号、severity、依据、影响、建议及 disposition；阻塞项关闭。
- **AC-S02-10**：完成最终对账、双 verdict 和 Stop Gate，产出可验证终态凭证。

## 9. Completion Predicate / Verdict

`EntryValid ∧ ContractFrozen ∧ DesignReviewed ∧ ScopeRespected ∧ ImplementationComplete ∧ MandatoryACPassed ∧ SecurityAndRegressionPassed ∧ IndependentReviewAccepted ∧ FindingsReconciled ∧ EvidenceComplete ∧ AuthorityRespected ∧ CloseoutRecorded`

仅全部为真时允许 `GOAL_COMPLETE`，否则 `BLOCKED` 或 `INCOMPLETE` 并列出恢复条件。

**Verdict A — F01 Implementation Validity**：`VALID / VALID_WITH_CONDITIONS / INVALID / INSUFFICIENT_EVIDENCE`。

**Verdict B — F01 S10 Integration Entry Readiness**：`READY / CONDITIONAL / BLOCKED`。

S02 完成不等于 F01 已发布，也不等于 F01–F08 整体完成。

## 10. Required Artifacts

```text
Dashboard/Artifacts/<S02-Goal-ID>/
  ContextBootstrap.md
  InputManifest.md
  F01SliceContract.md
  CompatibilityMatrix.md
  DesignReview.md
  ChangeLedger.md
  CoverageMatrix.md
  TestEvidence.md
  IndependentReviewFindings.md
  RiskAndGapLedger.md
  S02Closeout.md
  F01CompletionReceipt.md
  S10RegressionHandoff.md
```

实际路径遵循仓库现有治理规范，以上仅为建议结构。

## 11. Pre-execution Review Checklist

Review 前重点检查：S00/S01 是否有有效 Entry Packet；F01 业务规则是否遗漏；复制/粘贴权限和敏感信息边界是否完整；兼容矩阵是否有未经授权的隐式决策；最小改动范围是否有代码证据；测试是否覆盖失败与持久化路径；独立验证与 Stop Gate 是否具备可执行性。

**当前建议状态**：`DESIGN_DRAFT / IMPLEMENTATION_ENTRY_BLOCKED_PENDING_EVIDENCE`，等待 S00/S01 凭证、F01 冻结需求和用户授权。
