Lane Task Card: Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/planning/g2-ownership-component-build-r001-card.json
Card SHA-256: 3957f2531fb1c0ea2932e68f35d47084b2260fc39b0b382a921d01d4f0af6e71
Verify: python3 .codex/skills/sge-governed-checkpoints-sp010/scripts/lane_task_card.py validate Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/planning/g2-ownership-component-build-r001-card.json --repo . --expected-card-sha256 3957f2531fb1c0ea2932e68f35d47084b2260fc39b0b382a921d01d4f0af6e71
Lane: builder | Session: DE-S02-F01 | Role: builder
Mode: full_baseline
Working directory: .
Execute: 复验Card/Context和source/-runner/-evidence精确admission。先只在helper VM context注入共享host Error修R014，不改case/oracle/控制流；对原组件重跑可信同身份RED保存COMPONENT-RED-r002，检查仍6executed/5fail/1pass/0error，首C01 HELPER_NOT_CONNECTED。然后仅接线普通line && G2分支，严格Design r003的scope/instance/version捕获、ready后发布、更新/resize身份guard、旧scope error返回唯一观察、unmount所有资源继续清理+observers finally disconnect。其它G2空态/renderer顺序完整保留legacy，L7不重写；不得为测试绕过真实helper import。R013八类输入按既有r003明确empty和missing规则分别通过。冻结C01-C06 + R0138输入全GREEN，helper23GREEN仍过，定向ESLint/SFC编译/bundle检查/git diff --check。保存COMPONENT-GREEN-r001原始stdout/stderr/exitcode/identity、源码/runner/真实helper摘要和Build报告。独立Validation另走lane；不要声称界面MVP或stage完成。
