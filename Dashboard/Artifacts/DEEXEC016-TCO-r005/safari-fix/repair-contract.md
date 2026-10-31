# Safari 本地阅读修复

用户报告“完整能力树与 Coverage 以下的内容，在safari浏览器里面打开是空白的”。本轮仅修复入口 HTML 的本地 iframe 加载。原文件字节已保全。将 CLI 原生预览原文内嵌 srcdoc，增加 base 保持原相对链接；不改模型、Coverage、已封存包和历史 receipt。验证解析后 srcdoc 内容与原预览（仅新增 base）一致、18节点和筛选脚本保留。Safari 真机交互受工具限制未实测，不能宣称已实测。旧 freeze 的入口 HTML 摘要由本修复明确 supersede，旧审阅仍仅针对旧快照。低风险单文件展示修复，采用单 Agent 定向核验，非重新审批候选模型。
