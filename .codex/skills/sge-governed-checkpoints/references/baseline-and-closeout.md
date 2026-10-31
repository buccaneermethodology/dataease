# 写前保全与收尾冻结

适用于持久编辑与 governed final closeout。复用本轮已有 Goal、合同、清单和快照，不按每个检查项增设文件或 reviewer。本文规定执行顺序；语义完整性仍由人和独立 Validation 判断，检查表不自动产生验收结论。

## 写前保全

在首次改变交付对象前完成：

- 原样保存当前用户请求，包括链接、标点及约束；摘要另列为 projection。后续用户更正追加原文与影响，不覆盖先前 authority 记录。
- 记录基线 commit（无 Git 则注明）、tracked/untracked 清单及修改、删除、重命名状态，区分 index 与 worktree。Git 可用 `git status --porcelain=v1 -z -uall`、`git ls-files -z` 保存机器清单；忽略但实际要改的路径另列，不能因 ignore 漏出分母。
- 对将修改/删除/重命名的未跟踪文件保存原始字节副本、原路径及 SHA-256；已跟踪但有本地改动的文件也保存其写前内容，不能只依赖 HEAD。新文件记录原先不存在；符号链接保存链接信息，不盲目跟随到范围外。只备份受影响内容，避免搜集无关敏感文件。
- admission 引用的 Goal、合同、Context、Design、topology 输入一经绑定保持原字节。修正时创建新版本，记录 supersedes/原因/受影响 AC，按影响重审并生成新 admission；保留旧文件与失败结果。重序列化也是字节变化。

路径和摘要不能替代字节备份。已经缺失的历史字节不能用重建摘要伪装为原始快照；明确证据限制和适用验收边界。

## 审阅前齐备与冻结

最终 review 前逐项确认以下内容存在、可读、与本轮原始范围一致；可合并在已有 handoff/manifest 中：

| 检查面 | 完整条件 |
|---|---|
| 原始范围 | 原文、Goal、原 must-have/AC、OPCM、Scope Delta 及其 authority 无遗漏 |
| 实际交付 | 最终 diff inventory 包括 tracked/untracked、新增/删除/重命名，按路径绑定内容；声明范围和完整分母一致 |
| 阅读入口 | Goal 索引、必要链接、Design 与验证交接可访问；缺失材料先补齐 |
| 最终状态面 | closeout 候选正文、Dashboard/KB 的交付状态与声明边界已齐备；KB 不适用须说明 |
| 复核与检查 | 手工或工具 reconciliation、已执行的适用 gate 结果、失败记录与限制齐全；缺 registry 工具须如实说明 |
| 下游输出槽位 | 明确 review、结果 wrapper、最终 state、receipt 的输出位置与责任人；这些结果尚未产生不能伪填 PASS |

先补缺项，再冻结候选包，保存 snapshot ID、时间、文件清单与摘要，提交独立最终 review。冻结的正文可写“交付已落地；验收和 Goal 终态见固定结果入口”，不提前写已通过，也不留下必须 Gate 后回填的结果占位句。确需由结果驱动的状态字段，预先列入下游槽位并由 reviewer 审查其更新规则。

## 单向收尾与时点

顺序固定为：**交付与最终状态面、closeout/reconciliation 候选 → 独立 review → review wrapper/final state → Stop Gate receipt → 只读读回**。

1. review 绑定冻结 snapshot，记录 `reviewed_at`、`snapshot_id`、`as_of_state`、逐项 verdict 与限制。review 可以判定候选包通过而 Goal 尚未 terminal；不得预判未来 Gate 已通过。
2. Closure 将该报告的实际摘要绑定到 wrapper/state。结果槽位引用上游，受审快照不把尚未产生的 review/receipt 摘要纳入自身。用来源路径保持导航即可，不为了消除摘要关系删除真实交付或减少验收项。
3. Gate 使用调用方预先固定的 authority root 和当前实际输入；只有最新有效 receipt 明确允许 final 才作终态声明。
4. Gate 后只读核对 state、引用文件摘要和最终材料。旧 review 的 `CONTINUE` 是审阅时点事实；后来有效 `GOAL_COMPLETE` 是状态推进。不要重写旧报告来制造“同步”，也不要仅因这次合法推进重启 reviewer。
5. 已审内容、claim、交付或 AC 发生实质变化时，旧绑定不再覆盖新对象。保存新快照并按影响重审；authority、范围、合同、inventory 等改变按 delta recipe 触发 rebaseline。修复缺失交付优先于维持旧 receipt。Gate 后若确需写入受绑定文件，先失效旧结论，完成修复/适用验证，再重新绑定和运行 Gate。

独立 reviewer 检查实际候选包和依赖顺序；最终只读读回检查绑定。两者职责均保留；不将一次任务的“无需追加 reviewer”决定扩展为通用豁免。

## 路径预检与能力边界

调用 Stop Gate 前，按工具的解析基准核对 `allowed-root`、`authority-source-root` 和 `authority-root`：

- source root 与 allowed root 使用已授权位置的绝对路径；authority root 相对路径由 authority-source-root 解析，不能假定它相对于 shell 当前目录。
- 用严格解析后的路径检查存在性、普通文件类型及 root 包含关系；同时按 Gate 规则拒绝 authority 文件本身为符号链接，检查父级符号链接解析后是否逃出 root。建议向 CLI 传入已核对的绝对路径。
- authority root 内容摘要须与调用方先前固定的 expected SHA-256 一致；不得从待验 state 自动推导 trusted root，也不得为了让预检通过临时扩大 root、替换 expected digest 或放松 Gate。
- 越界、缺失或摘要不符时保留失败结果，修正实际调用参数或合法输入来源后重试；预检不能代替既有 fail-closed 验证。

依赖顺序采用人工/独立 Validation 检查。现有 Stop Gate 不因此获得任意语义依赖环检测、宿主自动拦截或自动保证快照语义完整的能力。未做测量时不声明节省比例或实际耗时下降。
