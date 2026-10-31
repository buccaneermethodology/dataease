Lane Task Card: Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/planning/g2-ownership-component-red-validation-r001-card.json
Card SHA-256: f97df147a38e3af78cd87758d6f144764f41d263b5e1e6f5363351d1757939e6
Verify: python3 .codex/skills/sge-governed-checkpoints-sp010/scripts/lane_task_card.py validate Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/planning/g2-ownership-component-red-validation-r001-card.json --repo . --expected-card-sha256 f97df147a38e3af78cd87758d6f144764f41d263b5e1e6f5363351d1757939e6
Lane: validation | Session: DE-S02-F01 | Role: validation
Mode: full_baseline
Working directory: .
Execute: 复验Card/Context。重新执行node tests/g2-render-ownership/component-check.mjs --mode red，输出/tmp。核对compileScript/AST唯一只读getter，不改setup控制流、无函数复制/万能Proxy；baseline真正驱动磁盘SFC的calcData/renderChart/mount/unmount。逐条完整检查C01-C06 deferred、O/N身份、keys/cleanup/errors/replay/observers oracle及R013 8输入；真实行为5断言失败/1通过/0执行错误、首C01 HELPER_NOT_CONNECTED。不能只相信producer自报。helper source现在另一独立Builder开始实现，当前原SFC RED不import helper，不能把无关helper文件变化混入组件RED准入阻断；要核对未来接线时helper import不被mock。一次列全问题、已检查域、未检与准入预测。只写报告，不改代码。
