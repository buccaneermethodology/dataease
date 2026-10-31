Lane Task Card: Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/planning/cascade-identity-rebinding-design-card-r001.json
Card SHA-256: f4ff1c7aadd53a9ffc8820a8364c57cc04f8dbf65c84aa140ad4fc0cbcb0bae5
Verify: python3 .codex/skills/sge-governed-checkpoints-sp010/scripts/lane_task_card.py validate Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/planning/cascade-identity-rebinding-design-card-r001.json --repo . --expected-card-sha256 f4ff1c7aadd53a9ffc8820a8364c57cc04f8dbf65c84aa140ad4fc0cbcb0bae5
Lane: design | Session: S02.1 | Role: design
Mode: delta
Working directory: .
Execute: 核对QueryCascade/Select真实源码与QueryProductAdapterDesignReview-r002边界，审查级联node identity、三段dataset-query-field编码、同/异dataset后继fieldId、运行态剥离、严格schema、映射完整性/单射、错误优先级及6个精确case。确定该pure slice是否准确、有用且可独立实现；不得把它升级为完整适配或产品行为；写范围仅限两个设计文件。
