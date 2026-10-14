# Authority Projection Correction — DE-GOV-001

## 原始用户请求

> [$sge-governed-checkpoints](/Users/xiaomei/.codex/skills/sge-governed-checkpoints/SKILL.md) 请安装这个skill到本项目中，以便后续的任务可以按照这个skill的要求进行，同时希望后续的Dashboard相关的skill可以更好地落实下去，目前的Dashboard目录内容太简单，只有一个README.md文件

## 修正和影响

- `context-bootstrap.json` 的 `raw_user_intent.text` 已逐字更新为上面的请求，包含 Skill 引用。
- `admission-context-baseline.json` 只保留了安装前意图摘要的语义内容；在修复时曾被重序列化，原始字节快照无法恢复。因此它目前不是可验证的原始快照。
- `execution-admission.json` 中记录的旧 SHA-256 与当前 baseline 文件不一致；当前重新运行校验会得到 `ADMISSION_CONTEXT_DIGEST_MISMATCH`。既有准入结果不能再由当前文件复验，本记录不把它描述为当前有效的准入。
- 修正只恢复 authority 投影精度，不改变 Goal 范围、AC、工作区权限或执行拓扑。
- 修正触发独立验证 full-baseline rebaseline；更新后的 Validation card 和 review 必须绑定当前上下文摘要。
- 当前可支持的声明仅为：用户原始授权在当前 Context Bootstrap 中逐字保存，SGE Skill 安装和 Dashboard 文档结果由最终文件状态及本次独立验证复核；不声明旧准入摘要当前可复验。
