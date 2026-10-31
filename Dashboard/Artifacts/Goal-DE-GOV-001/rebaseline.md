# Validation Rebaseline — DE-GOV-001

首次独立验证使用 full baseline。复核期间发现 `context-bootstrap.json` 与早期准入快照把用户请求改写成了摘要，未保留逐字 authority。现已把当前 Context Bootstrap 的 `raw_user_intent.text` 校正为本轮用户消息原文，并将 `admission-context-baseline.json` 保留为安装前实际使用的历史快照，避免倒改准入证据。早期快照中的摘要不再作为 authority 使用；原始请求逐字文本见当前 Context Bootstrap 和 `authority-correction.md`。

该 authority 投影差异不改变任务范围、AC、执行拓扑或已安装文件，但要求重新验证上下文、卡片摘要、原文映射和最终 closeout。验证模式保持 full baseline；禁止把旧 card 的摘要或历史 admission 解释为已绑定修订后的 Context Bootstrap。
