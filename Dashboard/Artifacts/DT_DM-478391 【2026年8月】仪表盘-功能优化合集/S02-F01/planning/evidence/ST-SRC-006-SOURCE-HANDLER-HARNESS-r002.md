# ST-SRC-006 Source Handler Harness Builder Evidence r002

## 结论边界

本文件是 r001 的追加更正版本，不覆盖历史记录。只记录 ST-SRC-006 的 local source-handler harness Builder 观察，不宣称产品接线、Goal AC 或真实权限验收。

## 冻结身份与执行结果

- Contract：`ST-SRC-006-SourceHandlerHarnessContract-frozen-r001.json`，SHA-256 `4a1597dbd33ca71791df5584ec4ad1883b8eb956db67f0394763c697803d5329`。
- Cases：`ST-SRC-006-SourceHandlerHarnessCases-frozen-r001.json`，SHA-256 `31fda7840facd8a8db3852ec1810d34f79d8b6b12d94878118fdcc405c6e6685`。
- Runner：`core/core-frontend/tests/filter-copy-query-select-text-source/source-handler-harness.mjs`，SHA-256 `81fed6996bda1920b10d5119b2f871714ac06f409a25949816539abf1faa8214`。
- RED：在内存副本中修改同一 Case 的单个 expected leaf，原 identity 的精确快照断言按预期失败。
- GREEN：冻结的 6 Case / 8 variant 为 8/8。
- 定向 ESLint：通过。
- whitespace：r001 所记 `git diff --check -- <runner>` 对当时未跟踪文件无效，不能作为 runner 检查证据。此处改用 `git diff --no-index --check -- /dev/null <runner>`；输出无 whitespace 诊断，退出码 1 是 `/dev/null` 与新增文件存在差异的预期结果。

## 独立验证与限制

独立 Validator 报告 `PASS WITH BOUNDS`，报告见 [ST-SRC-006 独立 Validation r001](../../reviews/ST-SRC-006-SourceHandlerHarness-Validation-r001.md)，SHA-256 `982b77f71530c07f97c4fe6928b6452da731e2832a92de50d962d0676b6d8abb`。其 P2 finding `VAL-ST-SRC-006-001` 已由 validator 对未跟踪文件独立重查补足；本 r002 更正 Builder evidence 的命令适用性记录。

此结果只覆盖合同中的真实源码 initializer 在注入依赖下的局部快照。它不证明 Vue mount/产品接线、枚举 API 与异步竞态、Store、保存/重开/history、权限或任何 Goal AC。原始分母仍为 10 项 Goal AC、26 项 must-have、16 项产品义务，`Scope Delta: none`。S01 F01 仍 `CONDITIONAL`；真实多用户权限环境仍 `BLOCKED / NOT_RUN`。
