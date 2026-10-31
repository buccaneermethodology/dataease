# G2 helper runner 有界修复报告 r001

## 结论与声明边界

本次仅修正终审 G2OWN-R012 与独立验证 G2OWN-RV-001 / RV-002 的测试工具缺口。逐通道 oracle 与双 attempt 错误优先级已经修改，并形成新的同 stub RED 候选；独立 delta Validation 仍待执行。没有实现 helper，没有修改组件、冻结 Design/Cases/Goal，也没有证明 helper GREEN、MVP 或 S02 Goal 完成。

## 准入与身份

接收端复验 Card canonical SHA `27c48f1d0b9e4907b5922a80ffb68a71eb8ebc55a6391132bd85d79a1cdd24a2` 及 Context 通过，并在首次修改前消费 `g2-ownership-runner-repair-r001-admission-0.json`（runner）与 `-admission-1.json`（evidence）的精确 `builder` action/target。Builder 为 `/root/g2_ownership_red`；不是独立 Validator。

修复前 runner SHA：`a704b1dc7e961d35919d40056bf037346be7015eeaa7d23f230481a1e218a5a4`。
修复后 runner SHA：`0155a4e0e0a9dac40046c044b21410d4121b1177542604d48fb5e43a1d01d21f`。
生产 stub SHA 保持：`ee4a86b213973ae00345fe079000454085c72af8c48a2725cdda454c1b8fb3ed`。

## 逐项处置

| Finding | 原因及本次纠正 | 验证及残余 |
| --- | --- | --- |
| R012 / RV-001 | 原 oracle 将不同通道错误合并去重，通知正确可以掩盖返回值错误。移除此验收集合；result、failure、每次 operation 与每个 notification 分别校验数组类型、长度、对象引用、顺序与调用次数。ready 返回时点固定快照，后续 operation 错误不并入 earlier ready 结果。 | 15 个 oracle 正向控制及其定向坏通道全部按预期接受/拒绝；不是生产 GREEN。待独立 delta Validation。 |
| RV-002 | 原 017 首抛 A 的 stub，在 B 已失败时仍可能分类为断言。现在收齐 A/B 后先传播任一未知执行错误，仅所有实际失败调用均为精确 stub 时保留 NOT_IMPLEMENTED 投影。 | A=stub/B=TypeError 与反向两例均执行两个调用并分类 EXECUTION_ERROR，原 TypeError 引用保留；双 stub 正控制保留冻结 fingerprint。待独立 delta Validation。 |

逐 operation 非空返回归属直接来自既有 arrange 与错误合同：013 第 4 次操作 dispose 返回 `[bad]`；018 第 2 次操作 dispose 返回 `[destroy]`；022 第 2 次操作 replace 返回 `[bad]`，其它 operation 返回 `[]`。020 result 为 `[setup]`，021 failure 为 `[setup]`，023 result 为 `[setup, notify]`。通知通道只匹配冻结事件中的 `notify:`，不将通知抛出的 notify 错误重新通知；未增加新的产品 Cases 或变更 expected。

## 新 RED 原始证据

命令（`core/core-frontend`）：`node tests/g2-render-ownership/check.mjs --mode red`。
调用开始 `2026-10-27T00:36:12.006422+00:00`，结束 `2026-10-27T00:36:12.037928+00:00`（UTC，实际调用记录）。

| 项目 | 结果 |
| --- | --- |
| contract_valid / production_module_imported | true / true |
| helper cases / assertion failures / execution errors | 23 / 23 / 0 |
| 首 fingerprint | G2OWN-001: NOT_IMPLEMENTED |
| exitcode / stderr | 1（预期断言级非零）/ 0 字节 |

原始输出：`G2OWN-RED-r002.stdout.txt`、`.stderr.txt`、`.exitcode.txt`；摘要与运行身份：`G2OWN-RED-r002.identity.json`。Cases r002/r003 的 23 个 helper 对象 canonical 完全一致，原 r001 日志与 identity 保持原字节。

## 可复演负例与同类残余检查

命令（`core/core-frontend`）：`node tests/g2-render-ownership/check.mjs --self-test-oracle`。
本次诊断调用 `2026-10-27T00:36:12.038001+00:00` 至 `2026-10-27T00:36:12.064575+00:00`（UTC），exitcode=0，stderr=0 字节。17 个负例全部按预期拒绝，15 个相应通道正向 transcript 被接受，双 stub 正控制通过。原始诊断 stdout/stderr/exitcode 及摘要持久保存于 identity 的 `negative_witness_execution`。

该入口直接使用 runner 的实际 oracle / runCase / classifier，构造的仅是通道观察 transcript 和双 reject 边界桩，没有复制或实现生产 helper。负例检查的是测试工具能否拒绝缺陷，不是生产功能通过。每个通道负例先通过完整观察值控制，再只破坏指定通道，要求错误信息明确指向该通道。

| 负例 | 身份 | 拒绝原因 / 分类 |
| --- | --- | --- |
| 020_result_missing_setup | G2OWN-020 | result.cleanupErrors |
| 021_failure_missing_setup | G2OWN-021 | failure.cleanupErrors |
| 022_replace_return_missing_bad | G2OWN-022 | operation[1] |
| 023_result_missing_setup_keeps_notify | G2OWN-023 | result.cleanupErrors |
| 020_result_duplicate_setup | G2OWN-020 | result.cleanupErrors |
| 021_failure_duplicate_setup | G2OWN-021 | failure.cleanupErrors |
| 020_result_cloned_error | G2OWN-020 | result.cleanupErrors |
| 023_result_error_order_reversed | G2OWN-023 | result.cleanupErrors |
| 013_manual_dispose_missing_bad | G2OWN-013 | operation[3] |
| 018_dispose_missing_destroy | G2OWN-018 | operation[1] |
| 018_repeat_dispose_returns_error | G2OWN-018 | operation[2] |
| 020_notification_missing_error | G2OWN-020 | notification[0] |
| 020_notification_duplicate_callback | G2OWN-020 | notification: |
| 022_result_contaminated_by_operation | G2OWN-022 | result.cleanupErrors |
| 015_remove_unexpected_error | G2OWN-015 | operation[1] |
| 017_A_stub_B_TypeError | G2OWN-017 | EXECUTION_ERROR |
| 017_A_TypeError_B_stub | G2OWN-017 | EXECUTION_ERROR |

## 已检查与未覆盖

Node 语法检查和限定 runner 的 `git diff --check` 通过。生产 stub、ChartComponentG2Plot、Design r003、Cases r002/r003、Goal 及原 r001 证据没有修改。没有安装依赖、启动产品/数据库、运行真实 G2 浏览器或权限测试，没有提交或推送。

仍需独立 delta Validator 复核新的 runner/逐通道负例/原始 RED 后签发 helper source 准入；后续 helper 23/23 GREEN、真实 SFC RED/GREEN、浏览器及完整 MVP/Goal 验收均未由本报告完成。G2OWN-027 和真实权限 BLOCKED / NOT_RUN 保持原状态。
