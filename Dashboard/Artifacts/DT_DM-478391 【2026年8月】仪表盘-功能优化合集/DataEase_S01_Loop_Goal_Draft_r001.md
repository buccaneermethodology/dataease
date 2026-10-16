# DataEase S01 — 代码连接点调查与技术影响分析 Loop Goal（Draft r001）

> 状态：设计候选；非执行授权、非设计冻结、非 S02–S09 实施授权  
> 日期：2026-10-15  
> 上游：DataEase F01–F08 Development Plan Draft r001 / S00 Requirements Baseline Loop Goal Draft r001  
> 约束：当前未获得经核验的 KYM r001、F01–F08 需求 V1.0、Q001–Q156 全量裁定以及 S00 完成凭证。因此本 Goal 定义调查工作与验收契约，不假定 S00 已通过。

## 1. Goal Statement

**在冻结的 DataEase 仓库 revision 与经核对的 S00 需求基线上，以只读、可复现的代码与运行证据，识别 F01–F08 各功能的真实实现入口、调用与数据流、配置/持久化路径、权限边界、现有测试及复用机会；评估实现影响、技术风险与依赖，为 S02–S09 的 Slice Contract 和实现顺序提供有证据边界的技术输入。**

成功不等于完成八项功能的设计或实现。所有结论必须区分 `OBSERVED`（源码/运行可证）、`INFERRED`（明确推断）和 `UNKNOWN`（尚无证据）；不得把推测的调用链写成已验证事实。

## 2. Authority、前置条件与输入

### 2.1 前置门槛

1. S00 输出的 Requirements Baseline Validity = `VALID`，或 `VALID_WITH_CONDITIONS` 且条件不影响本轮调查范围；S01 Entry Readiness = `READY`，或条件已明确允许只读调查。
2. S00 的 `Input Manifest`、`Decision Ledger`、`Requirement Coverage Matrix`、`Acceptance Criteria`、`KYM Alignment Matrix` 可访问且具有版本/摘要标识。
3. 仓库地址、分支、HEAD commit、工作树状态、构建/测试环境与调查权限记录在 `S01_ContextBootstrap`；工作树原有改动不可覆盖。
4. 若 S00 未通过，只能进行**受限探索**并输出缺口，不得签发可供实现的 S01 终态凭证。

### 2.2 证据优先级

需求语义以 S00 核准的 V1.0、156 项裁定和 KYM 对齐结果为准；实现现状以指定 commit 的代码、配置、测试及可复现实验为准。原始需求可用于差异定位，不能覆盖已裁定决策。代码事实不自动证明需求正确，测试通过不自动证明业务验收。

## 3. Scope / Non-goals

**In scope**：F01–F08 的 UI 入口、前后端模块、状态与序列化、API/权限、数据查询/计算/导出、配置存储、事件流、异常路径、既有测试与构建链路；共用组件与功能内实现依赖；风险、测试可行性及候选 Slice 边界。

**Out of scope**：产品需求再裁定；新增或修改生产功能代码；数据库迁移；发布；未授权的外部服务操作；跨功能**业务冲突检测**（用户已明确暂不做）。允许记录多个功能触及同一组件形成的**技术改动碰撞风险**，但不把它扩大为跨功能规则冲突审查。

默认只读；如需执行测试、启动服务或产生本地缓存/日志，先明确环境与副作用并取得适用授权；不得修改真实业务数据。

## 4. Investigation Sessions

| ID | 工作包 | 关键活动 | 交付物 | 退出标准 |
|---|---|---|---|---|
| S01.0 | Context Bootstrap | 校验 S00 gate；固定 repo revision；登记工作树与权限、工具链 | `S01_ContextBootstrap.md`、`InputManifest.md` | 版本与权限可复核；缺口标记 |
| S01.1 | 仓库结构与运行基线 | 识别前后端模块、构建脚本、路由、API、数据库、测试设施；区分已执行与未执行验证 | `RepositoryArchitectureMap.md`、`BuildTestBaseline.md` | 每项事实附代码位置或运行记录 |
| S01.2 | F01–F04 连接点 | 逐功能从用户动作追踪 UI→状态→API→后端→存储/输出及权限 | `FunctionConnectionMap_F01-F04.md` | 每项列明入口、关键链路、未知项 |
| S01.3 | F05–F08 连接点 | 同上，重点调查透视表格式、字段拖拽、枚举、汇总计算 | `FunctionConnectionMap_F05-F08.md` | 每项列明入口、关键链路、未知项 |
| S01.4 | 复用与影响分析 | 分析现有机制可复用程度、变更边界、兼容性、接口/配置/测试影响及改动碰撞 | `TechnicalImpactMatrix.md`、`DependencyGraph.md` | 影响均有依据；风险按严重度排序 |
| S01.5 | 验证可行性与切片建议 | 将 S00 AC 映射到测试层级、fixture、执行命令；提出 S02–S09 切片调整建议 | `TestabilityMatrix.md`、`SliceEntryRecommendations.md` | AC 不可验证项有 gap/owner/处置建议 |
| S01.6 | 独立审查 | 独立核对代码证据、覆盖率、推断边界、风险及可执行性 | `IndependentReviewFindings.md` | Findings 编号且有 disposition |
| S01.7 | Final Reconciliation | 对账全部产物、问题、决策、残余风险；输出两个 verdict 与 Stop Gate | `S01_Closeout.md`、`S02-S09_EntryPacket.md` | Completion Predicate 逐项可证 |

## 5. 八项功能调查契约

| 功能 | 必查实现连接点 | 关键技术风险与验证关注 |
|---|---|---|
| F01 过滤器复制粘贴 | 过滤配置模型、复制入口、目标图表兼容校验、保存/回显、权限 | 字段映射、敏感条件泄露、旧配置兼容 |
| F02 移动端表格全屏 | 移动端路由/弹层、表格渲染、页面状态、横向滚动、返回 | 状态恢复、屏幕适配、空表及性能 |
| F03 表格明细导出 | 下载入口、导出 API/任务、数据查询、权限/脱敏、文件生成 | 导出与可见数据语义、排序、资源消耗、异步行为 |
| F04 查询选项过滤 | 查询组件配置、选项数据源、过滤规则、保存/加载、查询请求 | 过滤位置、权限穿透、查询性能 |
| F05 透视表按列格式 | 维度/指标元数据、格式配置 UI、序列化、渲染、枚举 | 指标列定位、格式应用与旧配置 |
| F06 多字段拖拽 | 字段选择状态、拖拽事件、维度/指标 drop handler、排序/持久化 | 批量顺序、非法目标、重复字段 |
| F07 枚举值上限 | 枚举请求、分页/截断、搜索/自定义输入、前后端限制 | 5000 边界（以 S00 为准）、大基数、输入校验 |
| F08 自定义行汇总 | 汇总配置、表达式解析/计算引擎、刷新触发、结果呈现 | 聚合语义、空值/除零、注入、计算一致性 |

每个功能必须提供以下固定字段：`Function ID`、`S00 Requirement/Decision/AC IDs`、`UI Entry`、`State/Data Flow`、`API/Backend`、`Persistence`、`Permission Boundary`、`Existing Tests`、`Evidence Anchors`、`Reuse Options`、`Change Surface`、`Unknowns`、`Risk`、`Recommended Slice`。不存在的链路明确写 `NOT_FOUND`（附搜索范围），未查证写 `UNKNOWN`，不可混用。

## 6. Evidence Contract

每条关键断言最少包含：

```yaml
claim_id: S01-CLM-0001
function_id: F01
claim: "..."
posture: OBSERVED | INFERRED | UNKNOWN
repo_revision: "<commit>"
evidence:
  - path: "<repo-relative-path>"
    symbol_or_range: "<symbol/lines>"
    method: "static_read | call_trace | test_run | runtime_observation"
    result: "<observation>"
limitations: "<evidence boundary>"
impact: "<technical implication>"
```

动态行为须附执行命令、环境、输入、期望/实际结果与日志/测试报告位置。静态定位不能冒充运行验证；未执行的测试必须显式标为 `NOT_RUN`。

## 7. Acceptance Criteria（S01 自身）

| ID | 可验证条件 |
|---|---|
| AC-S01-01 | S00 输入与 repo revision 已固定，来源与权限明确；阻塞条件没有被静默忽略 |
| AC-S01-02 | F01–F08 八项各有完整连接点调查记录；无法定位的节点有检索范围及 gap |
| AC-S01-03 | 每项至少覆盖 UI、数据/状态、后端/API（若适用）、持久化（若适用）、权限、测试与变更边界；不适用需说明理由 |
| AC-S01-04 | 所有关键技术判断可追溯到指定 revision 的文件/符号或可复现实验；推断/未知明确标识 |
| AC-S01-05 | 形成影响矩阵，列出复用路径、最小改动建议、兼容/安全/性能风险及严重度 |
| AC-S01-06 | S00 验收项映射到候选验证方法；缺失测试设施或数据夹具单列阻塞项 |
| AC-S01-07 | S02–S09 每片有实现入口建议、技术依赖、风险、测试建议和 Entry 条件，不把建议写成已批准设计 |
| AC-S01-08 | 未进行未经授权的生产代码修改、发布、迁移或业务数据变更；调查副作用可对账 |
| AC-S01-09 | 独立审查 findings 均有 severity、evidence、impact、recommendation、disposition；重大问题有明确处置 |
| AC-S01-10 | Closeout 完成覆盖对账、残余风险清单、两个 verdict 与 Stop Gate；无证据不得宣称 GOAL_COMPLETE |

## 8. Quality Gates

- **Coverage Gate**：8/8 功能有调查记录；关键连接点有 `OBSERVED` 证据或显式缺口；不能以表格填写率替代证据充分性。
- **Traceability Gate**：S00 需求/决策/AC ↔ 技术连接点 ↔ 影响 ↔ 验证策略可双向定位；不确定输入标注条件。
- **Evidence Gate**：关键代码结论可复核，版本固定；运行观察与静态推断分离。
- **Risk Gate**：高风险权限、脱敏、表达式计算、数据一致性与兼容性必须有处置建议；未解决 blocker 阻止 READY。
- **Governance Gate**：无越权改动；独立验证不以 Builder 自评替代；不把 S01 调查完成提升为产品实施批准。

## 9. Review, Verdict & Completion Predicate

独立 Reviewer 输出稳定编号 findings，字段：`ID / severity / affected AC / evidence / impact / recommendation / disposition (accept | accept_with_revision | reject | needs_evidence)`。

分别裁定：

1. **Technical Investigation Validity**：`VALID / VALID_WITH_CONDITIONS / INVALID / INSUFFICIENT_EVIDENCE`。
2. **S02–S09 Implementation Entry Readiness**：`READY / CONDITIONAL / BLOCKED`（允许按功能分别裁定；整体 READY 不自动替代逐片门槛）。

`GOAL_COMPLETE` 的必要条件：AC-S01-01 至 AC-S01-10 全部通过；无未处置 blocker；所有 findings 已 disposition；完成产物与证据清单对账；独立审查结论有效；Stop Gate 产生可核验 terminal receipt。`VALID_WITH_CONDITIONS` 不可伪装成无条件 READY；若 S00 缺失或核心证据不足，终态只能是 `BLOCKED / INSUFFICIENT_EVIDENCE` 或继续调查。

## 10. Loop Execution Protocol

```text
User Authority / Scope
  ↓
S00 Gate + Repo Context Bootstrap
  ↓
S01.1–S01.5 Evidence-based Investigation
  ↓
Self-check against AC + Gap Ledger
  ↓
Independent Review
  ↓
Findings Disposition
  ├─ unresolved → revise / collect evidence → re-review affected claims
  └─ resolved
       ↓
Final Reconciliation + Closeout
       ↓
Stop Gate + Terminal Receipt
       ↓
GOAL_COMPLETE (only if Completion Predicate true)
```

每次循环更新 `CycleLedger`：当前 Session、已验证 AC、阻塞项、下一步动作、证据位置、revision；重复验证优先覆盖受影响链路，除非变更影响了共同前提，不要求无差别重复全部调查。发生权限越界、仓库 revision 漂移、S00 基线变化或证据失效时暂停并重新 bootstrap/reconcile。

## 11. S02–S09 Entry Packet

对每个功能独立交付：①冻结的需求/AC 引用；②已验证入口与关键调用链；③候选最小变更面；④需要先冻结的接口/数据契约；⑤依赖及技术碰撞风险；⑥测试设施、fixture 与基线；⑦未决技术问题和建议责任方；⑧风险与回滚建议；⑨ `READY/CONDITIONAL/BLOCKED` 及依据。

S01 只提出建议，不授权后续 Builder 开发。若需进入 S02–S09，必须另行完成相应 Slice Goal 的设计审查与实施授权。

## 12. 待确认事项（不阻止 Goal 草案审查）

- S00 是否已产生有效终态凭证？两份指定基线文件与 156 项裁定的准确路径、版本及权威性是什么？
- DataEase 目标 repo 的固定 commit、工作树状态和本轮允许的运行操作是什么？
- 是否允许启动本地服务、运行测试并产生本地测试数据？是否存在隔离的测试数据库？
- 是否已有正式的安全、性能、兼容性与 CI 质量门槛？
- 独立 Reviewer 的执行主体和 findings 存储位置由谁指定？

> **设计结论**：此 r001 可用于 pre-execution review。只有输入、权限与 S00 Gate 满足后，才能冻结为可执行 Loop Goal；不能仅凭此草案启动实现。
