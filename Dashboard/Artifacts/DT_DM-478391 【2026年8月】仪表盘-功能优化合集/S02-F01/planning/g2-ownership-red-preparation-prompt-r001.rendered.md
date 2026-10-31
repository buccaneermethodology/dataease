Lane Task Card: Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/planning/g2-ownership-red-preparation-card-r001.json
Card SHA-256: 4495309d2db31b1d4c11b83eb7a43f651e162cf63770b111ee9b88bba7fca470
Verify: python3 .codex/skills/sge-governed-checkpoints-sp010/scripts/lane_task_card.py validate Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/planning/g2-ownership-red-preparation-card-r001.json --repo . --expected-card-sha256 4495309d2db31b1d4c11b83eb7a43f651e162cf63770b111ee9b88bba7fca470
Lane: builder | Session: DE-S02-F01 | Role: builder
Mode: full_baseline
Working directory: .
Execute: 先验证Card canonical digest和Context所有必读；逐一消费planning/execution-admission-g2own-red-r001-{module,runner,evidence}.json，action=builder，target必须精确匹配。只新增production helper NOT_IMPLEMENTED stub和tests/g2-render-ownership/check.mjs，读取冻结Cases r002的23helper identity并保留arrange/oracle；编译导入真实生产TS，逐个执行且只把确切error.code=G2_RENDER_ATTEMPT_NOT_IMPLEMENTED认作合同断言失败；任何其它未预期错误/compile/import为execution_error。--mode red输出23 executed/23 assertionfail/0 executionerror，首fingerprint G2OWN-001: NOT_IMPLEMENTED，保存原始stdout/stderr/exitcode和identity摘要。runner必须完整支持23个未来GREEN场景，不能短路为仅检查stub或改expected；scope/phase事件与Cases一致，运行all cases不首错返回。不改组件、不实现helper、不能把RED当实现完成。
