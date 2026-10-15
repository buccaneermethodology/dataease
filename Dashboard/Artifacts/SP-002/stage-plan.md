# SP-002：DT_DM-478391 需求 KYM 首稿

- Topic：DT_DM-478391 需求 KYM 首稿；Scope：按 Goal DE-KYM-001 将已批准需求基线映射到现有 DataEase KYM；Purpose：形成需求角色、产品边界、规则、未决项和来源可追溯的候选修订。
- 归属：DE-KNOW-BI01；状态：doing；Goal：DE-KYM-001。
- 执行材料根：`Dashboard/Artifacts/Goal-DE-KYM-001/`；KYM 候选根：`.kym-tco/dataease/`。

| 阶段 | 依赖 | 产物 | 边界 |
|---|---|---|---|
| Intake / Design | 用户授权 | 本 Goal、合同、上下文、设计和执行准入 | 只用已批准需求 JSON 作为新增产品语义来源；旧 r001 保留 |
| Builder | entry 与 admission 校验通过 | KYM r002 draft、candidate package、reader Markdown | 使用普通 CLI；不声称 supported-host 流水线完成；不写 accepted state |
| Validation / Closeout | Builder 候选齐备 | CLI 验证、lint、audit、包/阅读版读回及范围差异记录 | 自检不得冒充独立语义审阅、代码运行或用户验收 |

## 终态边界

交付边界为候选 KYM 修订版。未完成独立语义审阅时保持 `candidate_not_approved`；不得将需求状态解释为代码实现或验收事实。
