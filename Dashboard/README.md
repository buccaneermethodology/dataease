# DataEase Repo 项目执行 Dashboard

更新时间：2026-10-13

## 当前快照

- **定位：**记录 DataEase Repo 的项目任务、决定、执行证据与下一步。
- **活动 Session：**无；最近完成 `DE-EXEC-S006` — 安装 SGE 项目级 Skill 并完善 Dashboard 维护入口。
- **当前状态：**交付和独立审阅已完成；SGE Stop Gate 最终 receipt 生成前不扩大完成声明，记录见 [Sessions](Sessions.md) 和 Goal 收尾材料。
- **下一步：**后续有明确任务时再登记；当前没有需要立即新建的候选 Session。
- **治理能力边界：**目前没有 Session registry、reconcile 或 validate 工具；本次文件结构不构成程序化注册表。

## 定位与边界

本目录是 **DataEase Repo 项目任务执行层**。每项具体任务作为 Session，归属一个长期 Big Idea 或有共同完成边界的 Stage Plan。稳定产品知识、架构规则和领域未知留在相应文档或知识库，不由执行台账充当权威来源。

本目录与[产品知识全景 Dashboard](../Docs/Dashboard/README.md)分开维护。全景 Dashboard 总结 Repo 产品、功能、使用流程、架构和知识缺口；本目录只记录执行状态与任务证据，两者不共用状态含义。

## 记录入口

- [Big Ideas](Big_Ideas.md)：长期方向、Topic / Scope / Purpose 和下一步。
- [Sessions](Sessions.md)：任务级状态、归属、证据上限、阻塞与下一步。
- [Decisions](Decisions.md)：影响多个 Session 的治理选择。
- [Artifacts](Artifacts/README.md)：按 Goal 或 Stage Plan 归档的持久任务材料。

## 维护约定

- Big Idea 和 Session 都写明 Topic、Scope、Purpose；Session 只归属一个 Big Idea 或 Stage Plan。
- 将生命周期 Status 与 Delivery State、Claim Ceiling、Authority / Blocker、Evidence、Next 分开记录。状态使用项目声明的便携值：`todo`、`doing`、`blocked`、`decision-needed`、`done`、`archived`、`cancelled`。
- 每次任务结束检查原范围是否缩小、父 Big Idea 是否改变、是否出现具体后续 Session、是否有稳定知识需要转入 canonical 文档。
- 保留历史任务证据边界；没有证据的历史细节写为未知，不补造。
- Dashboard 是执行索引，不替代用户原始意图、独立验证、产品知识文档或稳定规则的 canonical 来源。
