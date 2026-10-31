# Stop Gate Evidence Index

此子目录保存 DE-GOV-001 的 Goal completion rule、authority trust anchor、completion predicate、Loop state、Stop Gate receipt，以及满足该 Goal 终态谓词的 evidence 文件。

终态只有在 `stop-gate-receipt.json` 明确记录 `GOAL_COMPLETE` 且 `final_allowed=true` 时才允许声明。此 Stop Gate receipt 是仓库内可审计结果，不表示 Codex 宿主自动拦截已启用。

Machine artifacts：

- `completion-rule.md`
- `authority-correction.md` 是本 Goal authority 投影差异和历史准入摘要限制的证据
- `goal-authority.json`
- `goal-authority-root.json`
- `completion-predicate.json`
- `loop-state.json`
- `stop-gate-receipt.json`
- `attempts/` 下的无效首次路径调用和 provisional receipt 历史记录；最终声明只引用根目录的最新 receipt
- `evidence/` 下的 obligation inventory、final diff、independent validation、closeout、Dashboard、KB disposition、original plan coverage、scope delta 和 post-closeout reconciliation 证据
