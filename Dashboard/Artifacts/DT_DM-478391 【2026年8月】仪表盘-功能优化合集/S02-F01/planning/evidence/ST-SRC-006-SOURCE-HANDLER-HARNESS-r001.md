# ST-SRC-006 Source Handler Harness Builder 证据 r001

## 结果

Builder candidate 已实现。冻结的 6 个 case / 8 个 variant 在新建的 AST harness 中逐项执行真实源码 initializer，GREEN 为 8/8 exact snapshot。控制 RED 仅在运行时内存中把首个 variant 的期望 `selectValue` 改为哨兵值；同一 `case_id/variant_id` 在完整快照断言处失败，退出码 1。冻结文件未被改写，恢复原 fixture bytes 后 GREEN 通过。

## 执行与检查

- `node tests/filter-copy-query-select-text-source/source-handler-harness.mjs --mode=red`：预期失败；`ST-SRC-006-RUNTIME-FIRST/SINGLE-ROOT` 完整快照的 `selectValue` 差异被断言捕获。
- `node tests/filter-copy-query-select-text-source/source-handler-harness.mjs --mode=green`：通过，`8/8 exact frozen local source-handler snapshots`。
- `./node_modules/.bin/prettier --write tests/filter-copy-query-select-text-source/source-handler-harness.mjs`：仅格式化本次新建文件。
- `./node_modules/.bin/eslint tests/filter-copy-query-select-text-source/source-handler-harness.mjs`：通过。
- `git diff --check -- tests/filter-copy-query-select-text-source/source-handler-harness.mjs`：通过。

## 覆盖边界

仅覆盖合同列出的 `Select.vue`、`QueryConditionConfiguration.vue`、`Component.vue` initializer 在隔离状态与注入依赖下的局部行为。未覆盖 Vue mount、provide/inject 产品接线、真实 query emitter 订阅、300ms 枚举请求与异步竞态、API/Store、保存/重开/history 或用户权限。尤其不构成任何 Goal AC 的产品验收。

独立 Validation 尚未执行。Goal 原分母仍为 10 AC、26 must-have、16 产品义务，`Scope Delta: none`；S01 F01 仍 `CONDITIONAL`，真实多用户权限环境仍 `BLOCKED / NOT_RUN`。

## 身份摘要

- Frozen Contract SHA-256：`4a1597dbd33ca71791df5584ec4ad1883b8eb956db67f0394763c697803d5329`
- Frozen Cases SHA-256：`31fda7840facd8a8db3852ec1810d34f79d8b6b12d94878118fdcc405c6e6685`
- Design Review r003 SHA-256：`2cb9d1913a9197e134234b60649bb0e1729260731ef837a4deffd4b7599a01f2`
- Builder runner：`core/core-frontend/tests/filter-copy-query-select-text-source/source-handler-harness.mjs`
