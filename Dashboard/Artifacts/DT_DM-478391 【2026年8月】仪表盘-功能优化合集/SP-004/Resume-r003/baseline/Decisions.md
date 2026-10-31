# Decisions

| ID | 决策 | 状态 | 依据 / 影响 |
|---|---|---|---|
| DE-EXEC-D001 | 项目执行 Dashboard 与 Repo 全景 Dashboard 分开维护；执行 Dashboard 以任务级 Session 为主 | done | 用户明确指出两者不是一回事；执行任务不自动改写全景材料 |
| DE-EXEC-D002 | 每个 Session 必须归属于一个 Big Idea 或一个 Stage Plan 执行批次 | done | 用户明确的归属要求；若阶段批次有共同完成边界，可建立 Stage Plan，否则归入长期 Big Idea |
| DE-EXEC-D003 | 初始任务按“产品知识基线”和“项目执行跟踪”两个 Big Idea 归属 | done | 产品材料维护 Repo 领域知识；执行台账维护任务状态。二者目的不同，不共用一个宽泛的执行管理主题 |
| DE-EXEC-D004 | 非平凡项目任务使用仓库内 `.codex/skills/sge-governed-checkpoints/` 作为 SGE 指引入口；Dashboard 保持执行状态定位，不转为产品知识权威 | done | 用户授权安装 Skill 并希望后续任务遵循；本次安装及 Dashboard 改造的最终状态见 `DE-EXEC-S006` |
| DE-EXEC-D005 | 在没有项目级 registry 工具时，手工维护 Big Ideas、Sessions、Decisions 页面，不声明 reconcile/validate 已通过 | done | Dashboard Governance 允许 minimal profile；项目当前没有注册表工具，避免把人工维护说成程序化校验 |
| DE-EXEC-D006 | 本地 SGE 增强写前字节保全、候选包冻结与单向收尾；review 保留 as-of 状态，当前 Goal 终态读取有效 receipt | done | 依据本轮用户授权及分析报告；不放宽 Gate、不推广 reviewer 豁免、不更新全局或其他仓库副本；见 DE-EXEC-S007 |
| DE-EXEC-D007 | SGE 收益评估每5个任务一轮，统计原分母、质量与采集成本；不把诊断案例当可比基线 | done | 用户明确指定报告节奏；长期观察状态不因 setup 完成而关闭；修改 Skill 需单独任务 |

| DE-EXEC-D008 | 初始KB位于根目录kb/；全部SP-001执行中间件留Artifacts/SP-001；产品全景Dashboard仅References | done | 用户明确目录更正；不得把执行状态、审查、临时推断放入正式知识；不改变既有全景文档 |

| DE-EXEC-D009 | SGE 收益观察改为逐任务报告 | active | 用户于2026-10-14明确更正；每个新增终态任务单独报告并展示累计趋势，量化阈值仍按协议执行；旧 setup 验收材料保留为历史快照，详见 `Dashboard/Artifacts/Goal-DE-GOV-003/amendment-v2.md` |

## SP-004：S00执行边界与原始问答缺口（2026-10-14）

本轮用户明确授权审查、定稿、登记并执行S00。Goal定稿不等于产品需求Frozen；READY不授予S01执行权。保留156项原题/选项/最终回答核验门槛，不用V1.0汇编代替。当前仅取得尾部原始问答，按原Goal第10节执行S00.1并等待资料；未批准Scope Delta。

记录入口：[SP-004](<Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/SP-004/README.md>)。此处记录执行决策，不新增产品业务规则。
