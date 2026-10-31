# Big Ideas

| ID | Topic | Scope | Purpose | Status | Delivery State | Claim Ceiling | Authority / Blocker | Evidence | Next |
|---|---|---|---|---|---|---|---|---|---|
| DE-KNOW-BI01 | DataEase Repo 产品知识基线 | Repo 产品/功能、使用流程、特点、架构、开发方式，以及由此整理的未知与未解决问题；不承担任务状态跟踪 | 建立并持续维护可追溯的产品知识全景和问题清单 | doing | 已整理全景初稿、未知清单及[初始KB交付](../kb/README.md) | 当前是静态材料，不代表运行验收或完整知识覆盖 | 依据可访问的 Repo 源码、文档和明确提供的产品资料；未知内容保留为未知 | [产品知识全景](../Docs/Dashboard/README.md)、[问题清单](../Docs/Dashboard/unknowns-and-open-questions.md) | 后续有明确知识整理任务时扩充，并维护证据来源 |
| DE-EXEC-BI01 | DataEase Repo 项目执行跟踪 | 本 Repo 的任务级 Session 台账、Big Idea/Stage Plan 归属和执行状态维护；不汇总产品知识全景 | 让每项明确任务有独立记录、证据和下一步 | doing | 已建立执行台账、目录区分和两类 Big Idea 归属 | 仅对本 Dashboard 登记的任务和可见证据负责，不宣称历史任务穷尽 | 后续任务由用户提出或明确授权 | [Sessions](Sessions.md)、[Decisions](Decisions.md) | 持续按任务维护 Session，并保持产品知识与执行状态分层 |
| DE-REQ-BI01 | 仪表盘八项功能需求与验收基线 | DT_DM-478391 F01–F08 的需求、裁定与AC追溯；当前只授权S00 | 为后续调查提供同一套可审查基线 | blocked | 156题台账、覆盖与验收规格候选已落地 | 仅S00资料证据，不代表产品实现或需求冻结 | 整表公式数量待裁；完整独立审查结果见本轮入口 | [SP-004](<Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/SP-004/README.md>) | 处理裁定与独立审查；不自动执行S01 |

## Stage Plan 执行批次

| ID | 归属 | Topic | Scope | Purpose | Status | Evidence | Next |
|---|---|---|---|---|---|---|---|
| SP-001 | DE-KNOW-BI01 | DataEase 初始 KB | 全仓盘点＋核心深挖；静态证实；XPack公共契约 | 支撑后续开发理解与影响分析 | doing | [Goal](Artifacts/SP-001/goal.md)、[Stage Plan](Artifacts/SP-001/stage-plan.md) | 本地交付候选已齐；验收和Goal终态读取[结果入口](Artifacts/SP-001/README.md) |
| SP-002 | DE-KNOW-BI01 | DT_DM-478391 需求 KYM 首稿 | 以已批准需求基线为新增权威输入；基于现有 KYM r001 追加需求语义，不核定代码实现 | 让需求角色、范围、规则和未决事项可追溯地进入 KYM | doing | [Goal](Artifacts/Goal-DE-KYM-001/goal.md)、[Stage Plan](Artifacts/SP-002/stage-plan.md) | 产出 candidate r002；保持未审批并明确来源与语义审阅边界 |
| SP-003 | DE-KNOW-BI01 | DT_DM-478391 KYM r004 到 TCO 首版 | KYM r004 需求与 Repo 证据的能力分层、Coverage 提案和交互预览 | 提供可追溯的需求—能力—代码证据初始映射 | doing | [Goal](Artifacts/Goal-DE-TCO-001/goal.md)、[Stage Plan](Artifacts/SP-003/stage-plan.md) | 候选 TCO 和 Coverage，不代表 accepted state、产品验收或发布就绪 |
| SP-004 | DE-REQ-BI01 | F01–F08 S00需求核对 | S00.1–S00.7；不改代码、不做跨功能冲突检测 | 建立来源与验收合同 | blocked | [Goal与进度](<Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/SP-004/README.md>) | 原题已齐；处理公式数量裁定与独立复核 |
