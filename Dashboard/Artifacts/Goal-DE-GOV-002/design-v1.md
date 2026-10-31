# 设计与实施边界

新增一份 references/baseline-and-closeout.md，集中定义写前保全与单向收尾；在 kernel、intake、closeout、validation、goal recipe 与详细清单接入。不改脚本/schema、自动发现配置、终态 predicate 或 existing authority。仅文档规则行为变化，无新增 maintained executable gate，BDD Sync 不适用；用冻结案例验收语义。

目标映射：AC-01→intake；AC-02/03→closeout；AC-04→validation；AC-05→goal；AC-06→文件清单、外部哈希与独立 review。旧安装证据留作历史快照，Skill 更新不使其成为当前安装证明。

拓扑：Design/Builder/Closure 由根代理依序承担，本地文档规则的小范围变更无需多人同时写；独立 Validation 单独 agent，读取最终完整候选包并输出唯一审阅文件。Semantic 由同一独立 reviewer 覆盖规则语义，不另设重复 lane。single-agent exception 仅合并编辑角色，不豁免独立验收。

先创建并验证 admission，再编辑 Skill；review 前全部索引/closeout/手工 reconciliation 与 Dashboard 候选状态完成冻结。review 后只生成报告 wrapper、state、Gate receipt；受审内容变动触发 delta 或 rebaseline。
