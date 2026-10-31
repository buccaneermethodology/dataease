Lane Task Card: Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/planning/g2-ownership-browser-fixture-r001-card.json
Card SHA-256: 10c9069a64b50e18a0a4cf24d7774b4ebbec325b549f371902f02dc197126c66
Verify: python3 .codex/skills/sge-governed-checkpoints-sp010/scripts/lane_task_card.py validate Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/planning/g2-ownership-browser-fixture-r001-card.json --repo . --expected-card-sha256 10c9069a64b50e18a0a4cf24d7774b4ebbec325b549f371902f02dc197126c66
Lane: builder | Session: DE-S02-F01 | Role: builder
Mode: full_baseline
Working directory: .
Execute: 先复验Card/Context和fixture目录+report精确admission。实现隔离Vite测试页，host127.0.0.1 port7093 strictPort true，不启动服务由主代理执行。真正import生产createG2RenderAttempt与@antv/g2.Chart，静态虚构双系列line数据、原生legend/tooltip。提供中文可点击控件：渲染O、延迟渲染N、释放N、空数据、调整宽度、卸载、重复渲染；ready才发布活动scope，延期/卸载用真实helper行为。包装真实destroy计数/cleanup事件但调用原destroy，不mock chart。可视JSON输出每次attempt status/activeId/created/destroyed/cleanupErrors/DOM canvas数/尺寸，以及runtime错误可见文本。所有异步按钮捕获错误并显式显示，不静默忽略。需实际native legend和tooltip能手动交互，Resize调用真实changeSize或forceFit（以G2实际API为准）且scope时效检查。README明确测试页只证helper+真实G2，不能称DataEase line renderer或产品MVP。运行定向lint与Vite build到/tmp，不安装，不启动服务器；报告写待浏览器验证边界。保持helper与其它文件不变。
