Lane Task Card: Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/planning/query-single-select-default-design-card-r002.json
Card SHA-256: e4541e52baece4e277b054e8ad05e6f3bafb588d4f82f83cd1408923de3a2d57
Verify: python3 .codex/skills/sge-governed-checkpoints-sp010/scripts/lane_task_card.py validate Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/planning/query-single-select-default-design-card-r002.json --repo . --expected-card-sha256 e4541e52baece4e277b054e8ad05e6f3bafb588d4f82f83cd1408923de3a2d57
Lane: design | Session: S02.1 | Role: design
Mode: delta
Working directory: .
Execute: 对照原Goal、已审普通Select范围、当前QSINGLE无默认候选和真实源码，只设计单选(defaultValue/defaultMapValue/defaultValueCheck)具体可观测的一种窄形态。追踪配置切换、保存/JSON序列化、Component/Select reset/运行值与查询条件消费，列明字段keep/regenerate/remove、完整输入与输出/错误优先级及深复制/原子性。不得复制已有测试expected作为产品事实，不可猜测默认值与选项映射、不用mock或standalone。仅写指定Design与fixtures；若一项业务语义需要人类决定，标OPEN/NOT_READY及具体问题。若支持域确定，准备固定identity完整fixture；明确此设计不改或缩减原Goal分母，不覆盖权限/产品/保存全链路。
