# SH-SELECT-TEXT 局部 validator harness Builder 证据 r001

## 范围

本地 runner 从 QueryConditionConfiguration.vue 的 script AST 中提取 duplicateRemoval、setParams、validateConditionType 与 validate initializer，在不导入/求值整个 Vue 模块、不 mount、不访问 UI/API/Store/网络/权限/持久化的环境中，执行 22 个局部 validator case。执行输入副本恢复 condition 与 conditions[0] 共享对象身份；对包括 returnValue、messages、defaultValue/selectValue 清理副作用在内的完整局部快照作深比较。

合同：QueryProductAdapterSelectTextLocalValidatorHarnessContract-r001.json；runner：core/core-frontend/tests/filter-copy-query-select-text-source/validator-harness.mjs。原始候选 Cases 仍为 candidate，原文件未修改。ST-SRC 13 个来源观察未由本 runner 重新执行；6 个 NOT_READY 项未进入合同。所有这些项仍保持原状态。

## 实际执行

工作目录 `core/core-frontend`：

- `node tests/filter-copy-query-select-text-source/validator-harness.mjs`：通过，22/22，同 identity 完整快照一致。
- 临时 runner 副本将 LC-0-0-0 的预期 returnValue 反转：按预期在 `complete snapshot` 断言失败；临时副本随后删除。该 RED 只证明局部断言会捕获该返回值偏差。
- `./node_modules/.bin/eslint tests/filter-copy-query-select-text-source/validator-harness.mjs`：通过。
- `git diff --check -- tests/filter-copy-query-select-text-source/validator-harness.mjs`：通过。

一次初始 lint 报告了新 runner 一处格式问题，已在本次 write scope 内手工调整；修订后的定向 lint 通过。未使用自动格式化。

## 边界及剩余验证

本证据只表示已提取的当前 validator 对 22 个局部输入执行出声明快照；分类仍是 `LOCAL_VALIDATOR_ACCEPTS/REJECTS`，不能解释为产品合法性、真实数据集/字段/权限可用或任何 Goal AC 通过。真实权限环境仍 BLOCKED / NOT_RUN；S01 F01 仍 CONDITIONAL；Goal 分母继续 10 项 AC / 26 项 must-have / 16 项产品义务，Scope Delta none。

该文件是 Builder 证据，不是独立 Validation。下一步由独立只读 Validation lane 复核合同、source AST 提取、22 个 identity、负向控制、完整 diff 与 claim ceiling；验证完成前不晋升该局部包结论，更不关闭 Goal。
