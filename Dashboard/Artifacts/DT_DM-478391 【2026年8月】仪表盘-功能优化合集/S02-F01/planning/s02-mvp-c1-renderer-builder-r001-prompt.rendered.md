Lane Task Card: Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/planning/s02-mvp-c1-renderer-builder-r001-card.json
Card SHA-256: 16def03fea3f449b70a934c597513ee007364dc3483829a2d688fad77016db5c
Verify: python3 .codex/skills/sge-governed-checkpoints-sp010/scripts/lane_task_card.py validate Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/planning/s02-mvp-c1-renderer-builder-r001-card.json --repo . --expected-card-sha256 16def03fea3f449b70a934c597513ee007364dc3483829a2d688fad77016db5c
Lane: builder | Session: DE-S02-F01 | Role: builder
Mode: full_baseline
Working directory: .
Execute: 先完成A独立Validation报告；然后复验卡片与所有admission，读r002 Design/Cases+ExecutionClarifications+独立review。实施三个真实renderer SFC G2/S2/indicator prepared数据消费与strict ready。shared接口由chart_preview_state_trace Builder落地，先读三SFC真实调用链/准备可信语义RED，等root发接口摘要后接入，不自己写shared helper，不改wrapper。G2仅G2分支保持既有有界ownership和地图legacy，真实timer/queue draw/render/afterRender出错必须显式失败，candidate不得发Store/业务副作用。S2真实Promise render+LAYOUT_AFTER_RENDER两条件、本地页/normalize、candidate不setStore，indicator真实Vue error/nextTick/DOM；所有后续交互走binding current canonical。同key node promotion，public proxy不被库实例替换；返回metadata由wrapper同步发布。先成功加载真实旧SFC入口/真实render故障为语义RED，不以缺新方法/编译错为RED；frozen同ID GREEN。测试允许库double但必须执行真实SFC prepare链；报告不冒称真实画面/查询/保存。只做聚焦lint/类型检查，不安装或全量构建。测试空hook不使用空函数；按真实调用所需完善double。最快完成三renderer后发root接口与SHA，报告查全未验。必要增域先消息root。
