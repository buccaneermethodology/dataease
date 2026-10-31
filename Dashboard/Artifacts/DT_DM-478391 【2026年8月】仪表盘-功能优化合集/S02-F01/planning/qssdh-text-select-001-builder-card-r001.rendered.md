Lane Task Card: Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/planning/qssdh-text-select-001-builder-card-r001.json
Card SHA-256: 425c129b0e8c50fad9162dd1bcadfec90443c0305c9dbd8ae3db181c70f2b2d8
Verify: python3 .codex/skills/sge-governed-checkpoints-sp010/scripts/lane_task_card.py validate Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/planning/qssdh-text-select-001-builder-card-r001.json --repo . --expected-card-sha256 425c129b0e8c50fad9162dd1bcadfec90443c0305c9dbd8ae3db181c70f2b2d8
Lane: builder | Session: S02.1 | Role: builder
Mode: full_baseline
Working directory: .
Execute: 先按r006 fixtures编写唯一同身份runner，确认16个identity、统一失败字段集和完整oracle；在缺少生产实现时通过UNIMPLEMENTED返回产生可信断言级RED。随后新增纯函数和opaque nominal type declarations，输入只接收已由上游验证的VerifiedDesignValueSnapshot/VerifiedDesignBinding，绝不创建producer/factory或runtime认证承诺。实现固定校验顺序、valueState白名单、无部分输出、源不变与零副作用；同一runner GREEN，另用tsc编译期验证plain JSON调用被拒绝，定向ESLint。不得改冻结设计/fixtures或接产品入口。
