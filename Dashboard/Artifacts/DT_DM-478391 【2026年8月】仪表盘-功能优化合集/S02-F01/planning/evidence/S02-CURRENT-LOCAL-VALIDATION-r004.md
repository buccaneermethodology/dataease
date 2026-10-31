# S02 当前工作树窄验证记录 r004

时间：2026-10-20 18:23 UTC（任务最初开始时间未知，不计时）

## 执行结果

- `node tests/filter-copy-query-observation-component/check.mjs`：exit 0。PA-001..009 通过；直接编译并挂载当前 `Select.vue` SFC，在隔离 Vue renderer 中覆盖延迟枚举、标签/焦点、清空后迟到成功/失败保持 `mapValue` 与级联值、options 对象快照，以及字段变更启动新请求后旧初始请求成功/失败均不关闭新请求 loading 的交错。新旧请求分别核对 queryId；新请求 settle 后 loading 关闭。网络/API 和 Element Select 为 stub。
- `node --experimental-strip-types tests/filter-copy-query-reference/query-single-select-observation-async.test.ts`：exit 0，9/9 checks passed，覆盖纯模型迟到核对、valid/invalid/unverified、旧代次/旧请求、重复 settle 和输入不可变性。Node 输出 package 模块类型提示，不影响通过结果。
- 对 `Select.vue` 与组件 runner 执行定向 ESLint：exit 0。
- 对这两个文件执行 `git diff --check`：exit 0。
- `npm run ts:check` 先前 exit 2，报告3个 `.vue.js` 输入 TS6504；尚无独立基线证明其与改动无关，本记录不将其记为通过。

## 证据边界

本记录为当前工作树窄执行证据，独立 Delta Validation r003 待完成。它仅证明隔离 stub 下指定组件/纯模型行为；不证明真实 API/Element/完整 Pinia Store、保存重开/历史、后端、权限或任何 Goal AC 已通过。Goal 原分母为10项 AC、26项 must-have、16项产品义务，`Scope Delta: none`。只读查看/复制/粘贴限制及撤权/恢复仍 `BLOCKED / NOT_RUN`，没有用 standalone/admin/mock 替代真实权限实现。

绑定文件 SHA-256：

- `core/core-frontend/src/custom-component/v-query/Select.vue`：`30efd4a571a8146a68c8a57e64dfee93208670db4155b8f9257a4553efcfcac8`
- `core/core-frontend/tests/filter-copy-query-observation-component/check.mjs`：`480b099eaddcdaab666eab5d6ceef0872c6f07b8ec52dfe0fcb9feb870b9c38e`
- `core/core-frontend/tests/filter-copy-query-reference/query-single-select-observation-async.test.ts`：`bc1cad8262ecb36f8975094dd302dfcae95bb0a4dac2f317e5d6c531b1d7af80`
- `core/core-frontend/src/custom-component/filter-copy/query-single-select-observation-async.ts`：`1bfec813d68d02139a9c46b80eb1188437d91a6e66e740ac7531b07cf3392e7a`
