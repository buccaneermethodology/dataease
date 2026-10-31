Lane Task Card: Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/planning/line-stage-construction-frozen-red-r001-card.json
Card SHA-256: ecf41b7ea9c3e53d622694a787735f9be313d540a52ae6b88bc2ebe73262a84b
Verify: python3 .codex/skills/sge-governed-checkpoints-sp010/scripts/lane_task_card.py validate Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/planning/line-stage-construction-frozen-red-r001-card.json --repo . --expected-card-sha256 ecf41b7ea9c3e53d622694a787735f9be313d540a52ae6b88bc2ebe73262a84b
Lane: builder | Session: DE-S02-F01 | Role: builder
Mode: full_baseline
Working directory: .
Execute: 复验本Card/Context与本stem-admission0/1后从既有runner准备继续，不重建已写正确部分。当前Design/Cases原字节已由planning/LineStageConstructionFreeze-r001.json冻结，55Cases canonical/raw摘要以manifest为准；LSC052新partial C observer为null/false。完成完整module55Cases及全部startup_plan调度和错误通道/引用/精确次数顺序，消费冻结资产但不可修改它们。runner支持--manifest <freeze path> --mode red；所有55执行不首失败停，execution errors与assertion failures分离，首LSC001必须实际Line.drawChart setupOptions失败后chart_destroy_count expected1 actual0。任何unknown module/compile/缺导出/超时不算RED。保持真实被测控制流和fresh VM、host Error、具名边界、允许透明spy；无法观察的部分不伪造，逐项如实报告，执行错误先修harness不是改expected。保存report.json、stdout/stderr/exitcode、runner/source/case/compiled hash与evidence.md到指定新LSC-RED-r001目录，不覆盖历史诊断日志。正式RED是candidate，等待独立Validator确认，不改生产。已获得准备scope授权不需再问主代理。若确有合同无法执行冲突，继续55全量并一次列全部，不用缺模块当可信red。
