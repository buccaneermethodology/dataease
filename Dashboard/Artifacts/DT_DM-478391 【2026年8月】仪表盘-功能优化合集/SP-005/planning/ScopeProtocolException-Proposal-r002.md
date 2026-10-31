# S01 本轮批准来源协议例外提案

## 已经成立的人类决定

1. ScopeDelta-r001：真实权限实例、指定App/真设备延期，不计通过。原始用户消息已由独立review核实。
2. ScopeDelta-r002：用户指定先完成依赖合并及复核，暂停第二批清理和新增F05归档，再完成协议、Dashboard、Gate。原始消息来源见cleanup-pause-source.json；不是重新请求这两个决定。

## 唯一请求的例外

仅本轮S01，允许已定位的真实用户消息（原rollout、role=user、turn、完整文本SHA）及独立review作为上述差异的批准来源，免除goal_patch专用token和goal_contract_v1 canonical转换。采用现有stop_gate的scope_deltas与approval_receipts进行显式绑定，保留原Goal、completion rule/predicate、固定authority root及其pin原字节。

不修改通用脚本，不伪造平台receipt，不把scope记录称为平台签发批准；不放松独立审阅或证据约束，不把暂停/未验证项目计通过。例外不自动适用于未来Goal。

## 为什么还需这个决定

项目Skill写明“goal_patch.py 默认验证 Codex 的 user-message provenance…缺少可验证 receipt 时保持 blocked”。原Goal为Markdown，当前解析器又先遇同turn图片并拒绝，已有自然语言批准也没有专用token。Stop Gate的摘要绑定本身并不等价于goal_patch的来源校验。人类一次性例外可明确消除此协议不兼容；此提案尚未批准。
