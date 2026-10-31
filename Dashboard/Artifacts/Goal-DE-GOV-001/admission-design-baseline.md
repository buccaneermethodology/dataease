# Design Review — Goal DE-GOV-001

## Authority 与目标

- Authority：用户 2026-10-13 明确要求将 `sge-governed-checkpoints` 安装到本项目，并改善后续 Dashboard Skill 的落地条件。
- 原始范围：项目级 Skill、未来调用入口、执行 Dashboard 的可维护结构。
- 非目标：DataEase 运行实现、依赖安装、registry 开发、产品全景知识迁移、发布/提交/推送。

## 设计

1. 完整复制 source Skill tree 到 `.codex/skills/sge-governed-checkpoints/`，不改写其脚本或 references。
2. 在 `AGENTS.md` 增加项目级路由和 Dashboard authority 规则，作为未来任务的可见入口。
3. 将已有 `Dashboard/README.md` 内容拆分为 `Big_Ideas.md`、`Sessions.md`、`Decisions.md`；README 保持定位、当前快照与导航。
4. 按 Goal 批次保存本任务验收和审查材料，Dashboard 仍只是执行记忆。
5. 不引入 `Session_Index.md` 或 archive manifest，因为当前没有项目 registry 工具；人工表格不能冒充派生索引或 reconcile 结果。

## 风险与控制

- **历史内容丢失或改义：**对照原 README 的 2 个 Big Idea、5 个 Session、3 个 Decision，逐项保留。
- **复制不完整：**对 source/target 普通文件路径与 SHA-256 做全量比对。
- **入口仅安装未发现：**在根 `AGENTS.md` 明确触发场景和脚本位置。
- **验证过度声明：**不运行 DataEase 构建、数据库或 runtime；报告没有 registry validator。
- **Skill 依赖：**保留 `requirements.txt`，不执行 pip install。

## 验证计划

- 执行 SGE context packet 和 execution admission 校验。
- 完成后逐文件比对 Skill 包、Dashboard ID 对照、Markdown 链接/路径核查、`git diff --check`。
- 独立 reviewer 对照 AC 和最终 diff，留下审阅记录。
