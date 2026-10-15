# 基于 r005 的 TCO 候选合同

用户授权普通 CLI 手工生成，覆盖 supported-host 限制；不声明 supported-host 执行。承接 DEEXEC-016，输入从 r004 明确升级 r005，保留五个 Profile 全部分母。KYM 决定需求，repo 静态代码仅提供结构证据，不证明运行或验收。

- AC1：按主要功能方向生成 v4 能力树，覆盖 F01–F08 与 W0–W4 门槛，保留规则投影 ledger。
- AC2：五个 Profile 每条 requirement 恰好映射一次，分母 2/5/5/4/10；映射非分组能力。
- AC3：Coverage 按 mandatory 行保守汇总，代码证据给位置与含义；未查明保留 unknown，不推断未实现；不将静态阅读提升运行。
- AC4：保留 29 未决、3 冲突，生成可筛选 HTML、比较和候选包。
- AC5：validate、reader audit、coverage audit、verify/package 实际执行，独立审阅；未配验证命令必须 not_run。

本轮不修改产品代码、不触发数据库或部署、不审批、不提交。仅主 Agent Builder，独立 reviewer read-mostly；BDD/KB 产品知识不更新，Dashboard 保持候选边界。收尾冻结完整交付与状态，独立审阅后写 state/receipt。
