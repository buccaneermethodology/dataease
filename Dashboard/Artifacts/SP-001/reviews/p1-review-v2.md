# SP-001 P1 独立复验 v2

- 审阅者：`/root/pre_review`，独立于工具修复者。
- 审阅时间：2026-10-14T02:28:16.981203+00:00
- 快照：SP001-object-contract-v2。
- 任务卡：p1-review-card-v2.json；摘要 `47194f8ba726f20c233bf0f1e463ac4a69512e8cdc13ad03a5edbdb384071ce9`，接收端复验 pass。
- 范围：v1 阻断修复、v2 实际工具测试、最小样例及横向投影；不验收全域候选或最终 KB。

## 独立结论

|判断|结论|含义|
|---|---|---|
|Design Freeze Validity|PASS WITH FINDINGS（通过，保留非阻断限制）|真源、来源及静态声明边界保持一致。|
|Implementation Entry Readiness|PASS（指定基线最小链入口通过）|v1 的仓库/revision 伪造准入问题已修复；可在当前 origin/HEAD 下落地已复核图表路由样例及工具。|
|Overall Verdict|PASS（限正式最小链实施）|允许后续 Builder 实施与实际落盘验证；不是 KB 完成或全域语义通过。|

## v1 阻断修复核验

kb-v2.py 的 validate 从实际仓库读取 `git rev-parse HEAD` 和 `git remote get-url origin`，逐文档比对 metadata.source_revision/source_repo；期望值不再取自待验文档。repo 比对只去末尾 `.git` 与 `/`，未扩展为任意别名信任。当前冻结上下文下正例通过，错误 repo/revision 分别被 SOURCE_REPO、SOURCE_REVISION 拒绝。此前 P1-R01 在本次最小链范围内关闭。

本次实际执行 `python3 -B Dashboard/Artifacts/SP-001/tools/test_kb_v2.py`，退出码0。脚本按卡要求在 SP/evidence 中生成并自动清除临时输入，无产品源码变更；只持久写入本报告。结果共13项全部通过：positive；dashboard；reference；stale；unknown；duplicate；dangling；output；wrong_repo；wrong_revision；deterministic；impact；no_tested_claim。独立重跑结果与既有 kb-tool-tests-v2.json 一致。

同时重新读取 v1 工具与报告摘要，确认历史字节保留：

- extraction/tools/kb.py：`36ee77208d6097587d9bc3fda97e4a2198ebb5ad37361cffd1d37e3b96ef13fb`。
- reviews/p1-review-v1.md：`7ce679500e3f8b5cc88e6a02e3db461f88d4fc5793a584f974912e0e4ab7788e`。

## 横向索引核验

独立调用实际 v2 projections([positive]) 并读取结果：

- capability-map.md 含 SAMPLE-C01，深度 navigation，指向 sample.md；保留“仅getData路由分支，不代表全图表能力验收”的适用边界。
- source-index.md 将 ChartDataServer.java 映射到 SAMPLE-001，路径指向真实源码；明确不是全仓已读清单。
- README 添加两项横向导航。内容来自 JSON 结构及来源引用，没有引入手写事实，也没有把 inventory/执行状态塞进 KB。
- 重复 projections 相等只证明纯函数投影稳定。CLI render、check-render 的实际文件创建、漂移检测仍应在后续落地时验证，本报告不提前声明它们通过。

## 非阻断限制与后续验收

1. origin/HEAD 是当前本地身份依据，不能解释为远端可信性认证。HEAD 改变后当前工具会要求重新核对文档 revision；不能为通过而批量改 revision、跳过语义重审。工作树证据摘要与提交基线的关系仍应通过既有源快照/差异记录说明。
2. 新索引使用保留输出名 capability-map.md、source-index.md，而现有 schema/validate 没有禁止同名 doc_id；后续规模扩展前应保留这些名称或检查输出键冲突，避免正常文档被横向索引覆盖。当前 sample 不碰撞，不阻断本次指定最小链。
3. 卡 topology.task_id 仍为 SP001-PRE-REVIEW，延续 v1 的身份标注小问题；下次卡使用本轮身份，不改历史卡。
4. F/K/核心轴逐项映射和全域能力复核属于 P2/P3；本轮仅继承已建立的候选分母，未把 pending_source_review 升级为实现确认。
5. 静态实现/接口类别混合枚举的语义风险继续由明确断言、scope 与独立内容复核控制；接口存在不证明功能实现，测试资产存在不证明运行通过。

下一步最小切片：使用已复核正例和 v2 工具落地正式目录，运行实际生成、check-render 和受控漂移检查，核对实际 diff 与目录边界；再逐域扩大。若来源基线、合同或工具继续改变，旧卡摘要与本报告不自动覆盖新版本。
