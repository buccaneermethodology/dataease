# QOBS PA-009 前置 loading 断言 Delta Validation r004

- 日期：2026-10-20
- 范围：只核对 PA-009 在 reject 旧初始请求之前的 loading=true 断言及其先后顺序；重跑组件 runner、纯模型 9/9、Select 定向 ESLint 与 diff-check。不扩展测试范围，不修改源码/测试。
- Verdict：**PASS_WITH_BOUNDS**。

## r003 finding disposition

r003 的 P3 断言缺口已关闭。PA-009 顺序为：修改 field ID → 等待新请求 debounce → 断言两次请求及 queryId (`f-name`、`f-name-next`) → **断言 loading=true** → reject 旧 request 0 → tick 后再次断言 loading=true → resolve 新 request 1 → tick 后断言 loading=false 且 options 是新请求结果 `A,B`。因此旧失败到达之前新请求已经处于 loading；旧失败不关闭它；只有新请求 settle 后 loading 才结束。PA-008 成功响应路径有对应 loading pre/post 断言。

## 执行记录

- `node tests/filter-copy-query-observation-component/check.mjs`：PASS，`PA-001..009`。
- `node tests/filter-copy-query-reference/query-single-select-observation-async.test.ts`：PASS，9/9。
- `./node_modules/.bin/eslint src/custom-component/v-query/Select.vue`：PASS。
- `git diff --check -- core/core-frontend/src/custom-component/v-query/Select.vue`：PASS。

## 边界与 SHA-256

组件 runner 每次读取当前 Select.vue 并通过 Vue SFC 编译器与 Vue renderer 运行；API 和 Element Select 是 stub。未覆盖真实浏览器、真实 API/后端、持久化或权限路径。本 verdict 仅属于 PA-009 runner 断言增量；不表示 S02 Goal 或产品整体验收完成。

- `core/core-frontend/src/custom-component/v-query/Select.vue`：`30efd4a571a8146a68c8a57e64dfee93208670db4155b8f9257a4553efcfcac8`
- `core/core-frontend/tests/filter-copy-query-observation-component/check.mjs`：`48f39f6107e00002d10bbec663bb937e979512ed9ec3b5ee91c7a705ba418a0c`
- `core/core-frontend/tests/filter-copy-query-reference/query-single-select-observation-async.test.ts`：`bc1cad8262ecb36f8975094dd302dfcae95bb0a4dac2f317e5d6c531b1d7af80`
- `QuerySingleSelectObservationResolutionFixtures-r004.json`：`acb43b7b421d00201fa1f06545d51351c551ddf3eedcf894d067cf9b6ff5d215`
