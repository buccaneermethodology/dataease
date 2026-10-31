# Goal DE-GOV-001

## 目标

将 `sge-governed-checkpoints` 完整安装为 DataEase 项目级 Skill，使后续编码代理能从仓库协作规范发现并调用它；同时把现有项目执行 Dashboard 整理为独立的 Big Ideas、Sessions、Decisions 和任务 Artifacts 入口，保留既有记录与证据边界。

## 范围

- 将用户提供的 SGE Skill 完整目录复制到 `.codex/skills/sge-governed-checkpoints/`，保留 Skill、references、recipes、schemas、scripts、fixtures、agents 与 requirements。
- 在根 `AGENTS.md` 加入项目级调用入口、Dashboard authority 边界、记录字段和 registry 能力限制。
- 将现有 Dashboard 内容拆分到 `Big_Ideas.md`、`Sessions.md` 和 `Decisions.md`，精简 README 并保留全部既有行。
- 为本任务保存 Goal、完成契约、上下文、Design 和执行准入材料。

## 非目标

不修改 DataEase 运行代码、依赖、数据库、XPack、安装器、发布/部署状态；不创建 Dashboard registry/reconcile/validate 程序；不将产品知识全景迁入执行台账；不宣称历史任务完整回溯。

## 完成规则

满足 `completion-contract.json` 的 AC-01 至 AC-06，取得独立审阅记录，核对最终差异和 Dashboard 链接，并完成 SGE closeout gate 后，才可声明本 Goal 在限定范围内完成。任何未满足项均须保留真实状态和缺失证据。
