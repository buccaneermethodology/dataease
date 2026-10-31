# SP-003：DT_DM-478391 KYM r004 到 TCO 首版

- Topic：DT_DM-478391 KYM r004 到 TCO 首版；Scope：以 `.kym-tco/dataease/kym/revisions/kym-r004.json` 为规范性来源，结合 DataEase Repo 代码证据，形成候选 TCO v4 模型、Coverage 提案和 HTML 预览；不改变 KYM，不创建 accepted state。
- Purpose：将 KYM 中稳定能力、F01–F08 需求以及实现证据分层映射，展示可核实的代码覆盖和证据缺口。
- 归属：DE-KNOW-BI01；状态：doing；Goal：DE-TCO-001。
- 执行材料根：`Dashboard/Artifacts/Goal-DE-TCO-001/`；TCO 候选根：`.kym-tco/dataease/tco/`。

| 阶段 | 依赖 | 产物 | 边界 |
|---|---|---|---|
| Intake / Design | 用户授权；KYM r004 candidate | Scope、输入边界、AC、Design、执行准入 | KYM 未批准；作为明确用户授权的候选输入，不继承审批状态 |
| Builder | governed entry 与 admission 通过 | TCO v4 candidate、Coverage proposal、tco-preview.html | 普通 CLI 手工构建；不冒称 supported-host；Coverage 只按可追溯 evidence 赋值 |
| Validation / Review | 三项候选产物齐备 | CLI validate/audit/package、HTML 读回、独立语义复核 | CLI 通过不代替语义审阅；不创建接受态 |
| Closure | 最终状态冻结 | 任务台账、差异与限制记录 | candidate_not_approved；不声称实现验收或发布就绪 |
