# S02 当前工作树窄验证记录 r003

时间：2026-10-20 18:23 UTC（任务最初开始时间未知，不计时）

## 执行结果

- `node tests/filter-copy-query-observation-component/check.mjs`：exit 0。PA-001..007 通过；在当前 `Select.vue` SFC 的隔离 Vue renderer 中覆盖延迟枚举响应、选择标签与焦点、初始请求中清空后的迟到成功/失败，以及 `mapValue` 和级联 `currentSelectValue` 在清空后不被旧响应改变。网络和 Store 仍为 stub。
- `node --experimental-strip-types tests/filter-copy-query-reference/query-single-select-observation-async.test.ts`：exit 0，9/9 checks passed，覆盖迟到枚举核对重试、有效/无效/未核实、旧请求/代次、重复 settle 和输入不可变性。Node 提示 package 未声明模块类型，但测试通过。
- 对 `Select.vue` 与组件 runner 执行定向 ESLint：exit 0。
- 对这两个文件执行 `git diff --check`：exit 0。
- 先前全量 `npm run ts:check` 的失败仍未重新定性：报告列出3个 `.vue.js` 输入 TS6504，尚无独立证据确认其为基线问题；本记录不将其视为通过。

## 证据边界

本记录是当前工作树的窄执行证据，仍待独立 Delta Validation。它只证明隔离 stub 下指定组件/纯模型行为；不证明真实 API、完整页面或 Pinia Store 接线、保存重开/历史、后端、权限或任何 Goal AC 已通过。S02 分母保持10项 Goal AC、26项 must-have、16项产品义务，`Scope Delta: none`。只读用户限制、复制粘贴权限、授权撤销/恢复仍 `BLOCKED / NOT_RUN`；没有以 standalone/admin/mock 替代真实权限实现。

绑定文件 SHA-256：

- `core/core-frontend/src/custom-component/v-query/Select.vue`：`30efd4a571a8146a68c8a57e64dfee93208670db4155b8f9257a4553efcfcac8`
- `core/core-frontend/tests/filter-copy-query-observation-component/check.mjs`：`7326d108fb774cc0f10d66229b8b3727603bbc1af9b7b510425fdb9dc846b4be`
- `core/core-frontend/tests/filter-copy-query-reference/query-single-select-observation-async.test.ts`：`bc1cad8262ecb36f8975094dd302dfcae95bb0a4dac2f317e5d6c531b1d7af80`
- `core/core-frontend/src/custom-component/filter-copy/query-single-select-observation-async.ts`：`1bfec813d68d02139a9c46b80eb1188437d91a6e66e740ac7531b07cf3392e7a`
