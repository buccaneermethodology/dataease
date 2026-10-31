# QOBS-ASYNC-PUREMODEL Builder 执行证据 r001

## 范围与权限

本候选只实现冻结的异步观察纯模型，不接 Vue、Pinia/Store、真实 Promise 调度、网络、保存或权限。依据为 QOBS-ASYNC-01 维护者裁定、Design r004、Fixtures r004、独立 Delta Review r003、纯模型合同及两个 target-bound admission。原 Goal 10 项 AC、26 项 must-have / 16 项产品义务均未减少或关闭。

## 执行与验证

- 实现：[query-single-select-observation-async.ts](../../../../../core/core-frontend/src/custom-component/filter-copy/query-single-select-observation-async.ts)
- Runner：[query-single-select-observation-async.test.ts](../../../../../core/core-frontend/tests/filter-copy-query-reference/query-single-select-observation-async.test.ts)
- 独立 Validation：[QOBS-ASYNC-PUREMODEL-Validation-r001.md](../../reviews/QOBS-ASYNC-PUREMODEL-Validation-r001.md)
- 同 runner 当前结果：9/9 通过；独立复跑摘要绑定源码 SHA-256 `1bfec813d68d02139a9c46b80eb1188437d91a6e66e740ac7531b07cf3392e7a`、合同 SHA-256 `e791593aef2d3e3fdc2f303d011c40914672cf63c4722ffc439974e9e15184be`、Fixtures SHA-256 `acb43b7b421d00201fa1f06545d51351c551ddf3eedcf894d067cf9b6ff5d215`、runner SHA-256 `bc1cad8262ecb36f8975094dd302dfcae95bb0a4dac2f317e5d6c531b1d7af80`。
- 定向 ESLint：实现与 runner 退出码 0（独立 Validation 复跑）。

## 证据上限与后续

保存的 RED 是实现当时模块导出不可用导致的可用性 RED（0/9），不是行为断言级 RED；不能宣称可信行为 RED/GREEN 闭环。GREEN/独立复跑证明的是该纯函数对 9 项定向断言的候选行为，不验证完整 Fixtures 状态投影，也不推导真实 Promise 调度、Vue 生命周期、并发 Store 写入或产品端 finally 行为。独立 verdict 为 `PASS_WITH_BOUNDS_FOR_QOBS_ASYNC_PUREMODEL`；S02 Goal verdict 为 `NOT_CONFORMANT_AS_GOAL_COMPLETION`。

真实权限模块和隔离多用户环境仍不可用；只读用户限制、撤权与恢复保持 `BLOCKED / NOT_RUN`，不使用 standalone/admin/mock 替代。S01 继续独立收尾。本候选不改变 S01，也不关闭任何 Goal AC。
