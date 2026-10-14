# Design Review — Goal DE-GOV-001

## C0 Authority Consumed

- Authority：用户 2026-10-13 明确要求将 `sge-governed-checkpoints` 安装到本项目，并改善后续 Dashboard Skill 的落地条件。
- 原始范围：项目级 Skill、未来调用入口、执行 Dashboard 的可维护结构。
- 完成规则：`goal.md` 和 `completion-contract.json`，SHA-256 由 execution admission 固定。

## Plain-Language Objective

把 SGE 的完整 Skill 文件包放进仓库并加入清晰的项目调用入口；把现有执行 Dashboard 从单一长 README 分成便于定位和维护的核心页面，同时保留原有任务记录。

## Scope and Non-Goals

- In scope：复制完整 Skill tree；更新根 `AGENTS.md`；将 Big Ideas、Sessions、Decisions 拆页；增加 Goal artifact batch、当前任务证据与入口。
- Out of scope：DataEase 运行实现、依赖安装、registry 工具开发、产品知识迁移、XPack、构建、数据库操作、发布/提交/推送。

## Current Architecture Read

- 仓库根 `AGENTS.md` 是项目开发与协作规则入口。
- 项目当前没有 `.codex/skills/`，可由本任务新增完整 package。
- `Dashboard/README.md` 起初为 untracked 文件，集中包含 2 个 Big Ideas、5 个 Sessions、3 个 Decisions；没有 `Sessions.md`、注册表或校验器。
- `Docs/Dashboard/` 承载产品全景，不能与本项目执行台账混作一个 authority surface。

## Proposed Module, Data, API, and Contract Design

- 无运行时模块、数据库字段、HTTP API 或持久化 schema 变更。
- 项目级 Skill 文件位置：`.codex/skills/sge-governed-checkpoints/`，内容对源目录逐文件保持 SHA-256 一致。
- 项目工作路由置于根 `AGENTS.md`；执行记录分为 `Dashboard/README.md`、`Big_Ideas.md`、`Sessions.md`、`Decisions.md`。
- Goal 任务材料按 owner 放入 `Dashboard/Artifacts/Goal-DE-GOV-001/`；没有 registry 时不创建派生索引或伪装自动校验。

## Implementation Slices and Ownership

- Design：本文件、Goal 和 Contract 已冻结本次边界。
- Builder：单一执行者按 AC-01..AC-05 完成文件安装与 Dashboard 文档；不修改冻结的 Goal/AC。
- Validation：独立 reviewer 对最终完整 diff、原始目标、安装清单与 AC-01..AC-06 进行只读验证。
- Closure：整理 closeout、更新 Session 状态、做 post-closeout 文件/引用复核。

## Test and Gate Plan

- Context packet、execution admission、lane task card 使用 SGE deterministic validators。
- 对比 Skill source/target 所有普通文件路径和 SHA-256；逐项核对旧 Dashboard row IDs。
- 校验 JSON 解析、Dashboard Markdown 本地链接、最终 diff whitespace 和 closeout language。
- 不运行 DataEase 构建、数据库、runtime、安装器或依赖安装。

## Risks and Escalation Triggers

- **历史内容丢失或改义：**以编辑前读取的行清单复核 2 个 Big Idea、5 个 Session、3 个 Decision；原 README 未跟踪，故无 HEAD 字节快照，声明保留限制。
- **复制不完整：**对 source/target 普通文件路径与 SHA-256 做全量比对。
- **入口仅安装未发现：**在根 `AGENTS.md` 明确触发场景和脚本位置。
- **验证过度声明：**不运行 DataEase 构建、数据库或 runtime；报告没有 registry validator。
- **Skill 依赖：**保留 `requirements.txt`，不执行 pip install。
- **必要能力变化：**若发现 registry/schema/runtime 有改动需求，停止并重做范围、AC 和准入，不顺手扩展。

## Builder Handoff

- 仅写 `.codex/skills/sge-governed-checkpoints/**`、根 `AGENTS.md` 和 `Dashboard/**`。
- 不写运行时代码、依赖、数据库、子模块、生成物、远端或发布目标。
- 不修改本 Goal 的 frozen scope/AC；若需要缩小或更换权威，记录 Scope Delta 并阻止完整完成声明。

## Validation Focus

独立 reviewer 必须同时读取原始用户意图、项目规则、最终 tracked/untracked diff、源/目标 Skill package、legacy inventory 和最终 Dashboard/closeout 状态。检查遗漏、改义、链接失效、包不完整及 claim ceiling；read-mostly，不能替 Builder 修复。

## Design Delta Policy

实现偏离本设计时在 closeout 中逐项记录原因、受影响 AC、证据和需追加的 review；不能用设计更新追溯掩盖实际差异。没有偏离时明确写 `无行为或数据契约变化，遵循本文档方案`。

## Artifact Path

- 本文件：`Dashboard/Artifacts/Goal-DE-GOV-001/design-review.md`
- 批次索引：`Dashboard/Artifacts/Goal-DE-GOV-001/README.md`
