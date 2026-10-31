Lane Task Card: Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/planning/chart-preview-state-isolation-trace-r001-card.json
Card SHA-256: e11f3b19438765399c5a1169fb29ae6afe8b688e73a32f4db378ec6edfb49c9a
Verify: python3 .codex/skills/sge-governed-checkpoints-sp010/scripts/lane_task_card.py validate Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/planning/chart-preview-state-isolation-trace-r001-card.json --repo . --expected-card-sha256 e11f3b19438765399c5a1169fb29ae6afe8b688e73a32f4db378ec6edfb49c9a
Lane: design | Session: DE-S02-F01 | Role: design
Mode: full_baseline
Working directory: .
Execute: 先复验Card/Context，对真实SFC.calcData/renderChart、getData API、Editor.changeFilterData/刷新保存触发、dvMain details/origin方法与调用方做精确state-isolation trace。JSON每条事实保存source path/sha/可复算行号范围/精确symbol、写入前后/外部副作用/同步async关系/所有者/现有读者/能否staging及证据，未知写Unknown；MD为reader projection。特别确认calcData async本身未await getData.then链，逐项列chartData/isError/errMsg/drill/dynamicArea/country/scope/gadmName/curView/Store details/origin/emitter、callback及Promise契约，参数clone与axios拦截器副作用不能漏。找出实际可以复用的共享renderer hook/双host绑定点和最小stage API接入点，建议仅候选不扩大public contract。旧产品r003的23字段和query ledger只作对照，不当真源；不改它们。SFC/Line helper与Store若sha漂移应停止并报告重基线，不修改别人S01改动。追到真实主应用/panel/lib/移动端调用方精确列已查/未查及不确定，不做全仓泛读。一次完整返回facts/读清单/缺口/下一Design输入，控制篇幅但不省真正副作用。
