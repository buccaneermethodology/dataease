# Decisions

| ID | 决策 | 状态 | 依据 / 影响 |
|---|---|---|---|
| DE-EXEC-D001 | 项目执行 Dashboard 与 Repo 全景 Dashboard 分开维护；执行 Dashboard 以任务级 Session 为主 | done | 用户明确指出两者不是一回事；执行任务不自动改写全景材料 |
| DE-EXEC-D002 | 每个 Session 必须归属于一个 Big Idea 或一个 Stage Plan 执行批次 | done | 用户明确的归属要求；若阶段批次有共同完成边界，可建立 Stage Plan，否则归入长期 Big Idea |
| DE-EXEC-D003 | 初始任务按“产品知识基线”和“项目执行跟踪”两个 Big Idea 归属 | done | 产品材料维护 Repo 领域知识；执行台账维护任务状态。二者目的不同，不共用一个宽泛的执行管理主题 |
| DE-EXEC-D004 | 非平凡项目任务使用仓库内 `.codex/skills/sge-governed-checkpoints/` 作为 SGE 指引入口；Dashboard 保持执行状态定位，不转为产品知识权威 | done | 用户授权安装 Skill 并希望后续任务遵循；本次安装及 Dashboard 改造的最终状态见 `DE-EXEC-S006` |
| DE-EXEC-D005 | 在没有项目级 registry 工具时，手工维护 Big Ideas、Sessions、Decisions 页面，不声明 reconcile/validate 已通过 | done | Dashboard Governance 允许 minimal profile；项目当前没有注册表工具，避免把人工维护说成程序化校验 |
| DE-EXEC-D006 | 本地 SGE 增强写前字节保全、候选包冻结与单向收尾；review 保留 as-of 状态，当前 Goal 终态读取有效 receipt | done | 依据本轮用户授权及分析报告；不放宽 Gate、不推广 reviewer 豁免、不更新全局或其他仓库副本；见 DE-EXEC-S007 |
