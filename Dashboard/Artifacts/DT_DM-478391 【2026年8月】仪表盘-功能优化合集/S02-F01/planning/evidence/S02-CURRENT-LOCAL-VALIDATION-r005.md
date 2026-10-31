# S02 当前工作树窄验证记录 r005

时间：2026-10-20 18:23 UTC（任务最初开始时间未知，不计时）

## 执行结果

- `node tests/filter-copy-query-observation-component/check.mjs`：exit 0。PA-001..009 全部通过。当前 `Select.vue` SFC 在隔离 Vue renderer 中验证异步枚举、迟到成功/失败、清空后 `mapValue`/cascade 保持、options 快照，以及字段变化触发新请求时旧成功/失败响应都不能关闭新请求 loading；逐项核对 queryId，只有新请求 settle 才关闭 loading。
- `node --experimental-strip-types tests/filter-copy-query-reference/query-single-select-observation-async.test.ts`：exit 0，9/9 checks passed。包含迟到核对、valid/invalid/unverified、旧代次/请求、重复 settle 和输入不变性。Node 给出 package 模块类型提示，不影响结果。
- 对 `Select.vue` 与组件 runner 执行定向 ESLint：exit 0。
- 对这两个文件执行 `git diff --check`：exit 0。
- `npm run ts:check` 先前 exit 2，报告3个 `.vue.js` 输入 TS6504；尚无独立基线证明其与本次改动无关，本记录不将其记为通过。

## 独立复核与边界

[独立 Delta Validation r004](../../reviews/ProductValidation-QOBS-ASYNC-01-ClearMap-Delta-r004.md) 结论为 `PASS_WITH_BOUNDS`：PA-009 前置 loading 断言已复核，r003 的 P3 已关闭。该报告仅限指定组件/纯模型局部行为，不证明真实浏览器/Element、API/完整 Pinia Store、后端、权限、保存/重开/历史或任何 Goal AC 已通过。

Goal 原分母保持10项 AC、26项 must-have、16项产品义务，`Scope Delta: none`。只读查看/复制/粘贴限制、撤权/恢复仍 `BLOCKED / NOT_RUN`；不以 standalone/admin/mock 替代真实权限实现。

绑定文件 SHA-256：

- `core/core-frontend/src/custom-component/v-query/Select.vue`：`30efd4a571a8146a68c8a57e64dfee93208670db4155b8f9257a4553efcfcac8`
- `core/core-frontend/tests/filter-copy-query-observation-component/check.mjs`：`48f39f6107e00002d10bbec663bb937e979512ed9ec3b5ee91c7a705ba418a0c`
- `core/core-frontend/tests/filter-copy-query-reference/query-single-select-observation-async.test.ts`：`bc1cad8262ecb36f8975094dd302dfcae95bb0a4dac2f317e5d6c531b1d7af80`
- `core/core-frontend/src/custom-component/filter-copy/query-single-select-observation-async.ts`：`1bfec813d68d02139a9c46b80eb1188437d91a6e66e740ac7531b07cf3392e7a`
- 独立 Delta Validation r004：`3dff5f7cbd9581e1b80221042783efb0189cdd2f20bf3fa7b8c0883097335716`
