# DE-GOV-002：本地 SGE 收尾流程优化

原始授权见 [用户原文](raw-user-intent.txt)，分析输入见 [报告快照](analysis-input.md)。落实报告五项建议，以六项 AC 和独立场景审阅验收；不宣称节省时长、宿主拦截或外部升级。

- AC-01：原文、完整状态清单、未跟踪文件原始字节与 admission 输入版本保全可操作。
- AC-02：review 前完整候选包预检、冻结和缺项处理清晰。
- AC-03：交付状态面→独立 review→wrapper/state→receipt→只读读回，避免自引用且不删除真实交付。
- AC-04：review as-of 时间/状态与最新 receipt 终态区分，合法状态推进不造成重写旧 review。
- AC-05：authority 路径解析预检、拒绝越界和 symlink 逃逸，保留原有 fail-closed，不宣称通用环检测。
- AC-06：只改本地 Skill 与本轮治理记录；全局 Skill 哈希不变，脚本/schema 不变；独立场景审阅及结构检查支持有限结论。

写范围仅本项目 Skill、Dashboard 当前记录与本 Goal 材料；其他仓库和全局 Skill 只读。不改旧 Goal 证据、DataEase 产品代码或 AGENTS，不提交发布。全部 AC 通过且最新 Stop Gate 有效允许 final 后完成。外部权限或原始范围出现真正冲突才请求用户决策。
