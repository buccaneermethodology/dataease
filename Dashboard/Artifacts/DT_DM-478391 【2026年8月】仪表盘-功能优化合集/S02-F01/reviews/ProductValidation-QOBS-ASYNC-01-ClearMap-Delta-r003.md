# QOBS PA-008/PA-009 最终 Runner 独立 Delta Validation r003

- 日期：2026-10-20
- 范围：只读复核最终组件 runner PA-008/009 的请求输入绑定、旧初始请求的成功/失败交错与 loading 断言；重跑组件 runner、纯模型 runner、Select 定向 ESLint 和 diff-check。
- Verdict：**PASS_WITH_BOUNDS**。PA-008/009 均绑定旧 `f-name` 与新 `f-name-next` 请求；运行通过。旧成功与旧失败响应后观察到 loading=true，新请求成功完成后 loading=false。未发现本轮产品实现缺陷。

## 前序 finding disposition

- r001 `F-PA-008` options 快照引用别名：已在后续增量用 `snapshotOptions` 对每个 option 作浅复制；r002 已独立核对，本轮未回退。
- r002 新 query 输入未断言：PA-008 和 PA-009 现分别断言 `requests[0].input.queryId === 'f-name'`、`requests[1].input.queryId === 'f-name-next'`，该测试证据缺口关闭。

## PA-008/009 逐项结论

- PA-008 先挂载组件等待初始 request，再把 reactive `config.field.id` 改成 `f-name-next` 并等待 debounce。runner 断言正好两次请求且 queryId 顺序正确，旧成功响应后 loading 仍为 true、options 仍空；新响应 resolve 后 loading false 且 options 为 `A,B`。输入来源和当前产品 watcher 链一致，执行可达。
- PA-009 使用同样的新旧字段输入，拒绝旧初始请求后断言 loading 仍为 true，再 resolve 新请求并断言 loading=false、options 为 `A,B`。runner通过，源代码旧请求 stale catch/finally 不会拥有新 active request。
- 断言健壮性边界（P3）：PA-009 在 reject 旧请求之前没有单独断言新请求的 loading 已为 true；请求数量和 queryId 已证明新请求已发起，且 reject 后的 loading=true 通过，但作为“旧失败没有关闭此前 loading”的直接 oracle，建议在 reject 前补一条 loading=true。PA-008 成功路径具备该前置断言。
- `Select.vue` runner 动态读取当前工作树 SFC，编译后运行；异步纯模型 9/9 不是 Vue 组件行为替代。实际 Element Select 与 API 为 stub。

## 执行记录

- `node tests/filter-copy-query-observation-component/check.mjs`：PASS，`PA-001..009`。
- `node tests/filter-copy-query-reference/query-single-select-observation-async.test.ts`：PASS，9/9。
- `./node_modules/.bin/eslint src/custom-component/v-query/Select.vue`：PASS。
- `git diff --check -- core/core-frontend/src/custom-component/v-query/Select.vue`：PASS。
- 检查后生成的 `.qobs-observation-component-test.mjs` 临时 bundle 已清理。

## SHA-256

- `core/core-frontend/src/custom-component/v-query/Select.vue`：`30efd4a571a8146a68c8a57e64dfee93208670db4155b8f9257a4553efcfcac8`
- `core/core-frontend/tests/filter-copy-query-observation-component/check.mjs`：`480b099eaddcdaab666eab5d6ceef0872c6f07b8ec52dfe0fcb9feb870b9c38e`
- `core/core-frontend/tests/filter-copy-query-reference/query-single-select-observation-async.test.ts`：`bc1cad8262ecb36f8975094dd302dfcae95bb0a4dac2f317e5d6c531b1d7af80`
- `QuerySingleSelectObservationResolutionFixtures-r004.json`：`acb43b7b421d00201fa1f06545d51351c551ddf3eedcf894d067cf9b6ff5d215`

未覆盖真实 Element Plus / 浏览器、服务端、持久化、权限与撤权场景。本报告仅对最终 runner 增量作 verdict，不代表 S02 Goal 完成。
