# 波次 KYM 修订合同与设计

本轮原始 authority 为 user-wave-request.md。以 r004 生成 r005；用户明确指定五个波次为 Target Profile。CLI 手工构建沿用已授授权，不声称 supported-host 执行。

## 验收

- AC-W1：保留 r004 所有原有语句、来源、未决问题和冲突，新增五个候选 Profile。
- AC-W2：W0=S00/S01；W1=S03/S07/S02；W2=S05/S06/S08；W3=S04/S09；W4=S10；目标、退出条件逐字来源绑定。
- AC-W3：Profile 属 Scope；执行顺序与任务映射属 Schedule；退出条件是将来要求，不是已通过事实。
- AC-W4：不将开发计划中与 r004 不同的候选措辞提升为需求；保留 F05 张力及全部原未决项。原无 Profile 说明保留历史语境，新增当前授权解释。
- AC-W5：CLI validate/lint/package，校验摘要与 byte-identical renderer，独立复核完整交付及 Dashboard。

## 范围与设计

新 Profile requirements 直接引用用户退出条件与任务列表，保证逐字可核。Schedule 补充 Sxx 与 Fxx 对应；具体需求仍以 r004 为准。W0/W4 是用户明确指定的阶段目标，不冒充永久产品 persona。W4 发布条件尚非运行事实，性能阈值与完整 release gate 细化仍需 S00/S01 确认。

本轮只生成 KYM；不生成 TCO、不执行实现、不修改产品代码、不关闭 TCO Session。BDD/稳定 KB 更新不适用；Dashboard 记录范围与产物。没有 Session registry 工具，不声称注册表验证。

## 上限与拓扑

仅候选，非审批、实现、运行、发布结论。主 Agent 负责设计、Builder 与收尾；独立 Agent 只读审阅并输出报告。审阅前冻结交付、检查报告和 closeout；review/state/receipt 是下游输出槽位。
