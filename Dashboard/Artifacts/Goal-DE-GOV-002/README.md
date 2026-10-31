# 本地 SGE 优化结果入口

Owner：DE-GOV-002；Session：DE-EXEC-S007；来源：本轮用户请求与指定分析报告。范围仅本项目 Skill 和本轮执行记录。

- [原始请求](raw-user-intent.txt)、[分析输入快照](analysis-input.md)、[Goal](goal.md)、[合同与验收场景](contract.json)
- [写前清单及字节备份索引](baseline/manifest.json)、[上下文 v1](context-v1.json)、[设计 v1](design-v1.md)、[拓扑](topology-v1.json)、[准入](admission-v1.json)
- [实现差异](implementation.diff)、[检查记录](checks.json)、[冻结候选包](candidate-manifest.json)
- [收尾候选](closeout.md)、[手工一致性复核](reconciliation.json)

结果输出槽位（按顺序产生；文件存在和内容必须读回，入口本身不表示通过）：

1. 独立审阅：`review.md`，记录 review 时点、snapshot、逐项结论及场景结果。
2. 绑定结果：`stop-gate/evidence/independent_validation.json` 与 `stop-gate/loop-state.json`。
3. 当前终态：`stop-gate/receipt.json`；只有 valid、GOAL_COMPLETE、final_allowed=true 且摘要仍匹配时支持 Goal 完成。

旧 review 状态是历史时点，不随后续 receipt 更新；本索引在 review 前冻结，Gate 后不回写结果。未建立自动 registry、宿主拦截或跨仓库同步。
