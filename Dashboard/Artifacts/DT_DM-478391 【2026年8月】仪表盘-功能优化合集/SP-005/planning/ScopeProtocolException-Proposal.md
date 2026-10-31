# 本次来源协议例外提案（未批准）

## 已有授权

用户“同意这个scope delta”已在用户拥有的原始会话定位，并按turn、role和完整消息SHA-256匹配。详见scope-approval-source.json和scope-provenance-check.json。该授权仅延期真实权限实例与指定移动App/真设备验证，不削减其余范围或分母。

## 工具不兼容

goal_patch.py扫描同turn消息时先遇到图片项并拒绝；即使独立定位批准原文，该自然语言消息也不含其专用SGE_GOAL_PATCH_APPROVAL_V1 token。该任务原Goal采用Markdown与Stop Gate固定authority root，并非goal_contract_v1机器payload；不通过临时重写Goal身份或伪造receipt来适配。

## 建议的唯一例外

仅本轮S01 ScopeDelta-r001，允许以已经核验的原始用户消息、精确hash/turn和独立review作为批准来源，免除goal_patch专用token与canonical payload转换。保留原Goal及固定authority root，通过Stop Gate原有scope_delta/approval绑定表达差异；不更改通用脚本、不放松任何运行、权限、最终独立审查或完成证据要求。下一次任务不自动沿用。

本提案不重复请求业务scope delta批准；如需启用，仅请求用户批准以上一次性机器协议例外。在此之前保持Goal未完成。
