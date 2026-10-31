# S02 当前工作树窄验证记录 r001

时间：2026-10-20（精确开始时间未知，不计时）

## 执行结果

- `node tests/filter-copy-query-reference/query-single-select-observation-async.test.ts`：exit 0，9/9 checks passed；覆盖迟到枚举缺少已选 C 后重试一次、核对后有效/无效状态、请求失败、旧代次/旧请求无副作用、重复settle拒绝。
- `node tests/filter-copy-query-reference/query-single-select-session.test.ts`：exit 0；runner输出 `M0 + lifecycle PASS`，核对准备/捕获、会话来源、发布/历史失败、history manifest与unknown-outcome保存守卫。
- 定向 ESLint：对 `Component.vue`、`QueryConditionConfiguration.vue`、`Select.vue`、`dvMain.ts`、`snapshot.ts`、`canvasUtils.ts`、dashboard `index.vue` 执行；exit 0，无输出。
- `npm run ts:check`：exit 2；只报告3个既有 TS6504 输入（`DeRichTextViewV3.vue.js`、两个 watermark `index.vue.js`），这些均是tsconfig `src/**/*`匹配到的 JavaScript 文件。本次没有将该全量检查记为通过，也没有证明其他环境/入口。

## 证据绑定

这些是当前checkout局部行为测试和lint，不是独立 Validation，也不是实际 Vue/浏览器/后端/权限验收。只读限制与撤权/恢复仍 `BLOCKED / NOT_RUN`；保存与历史仍需完整产品运行验证。
- `core/core-frontend/src/custom-component/v-query/Select.vue` SHA-256 `eadbdba2b61aaeaf7abc58f83e75e82595c4a0812ceb1ac971f6739e4e4212a2`
- `core/core-frontend/src/custom-component/v-query/QueryConditionConfiguration.vue` SHA-256 `0b88bcdf92d15aceae52ca2992e7a8b4165e3f5cfc3f9cb7435296d7c7e9e047`
- `core/core-frontend/tests/filter-copy-query-reference/query-single-select-observation-async.test.ts` SHA-256 `bc1cad8262ecb36f8975094dd302dfcae95bb0a4dac2f317e5d6c531b1d7af80`
- `core/core-frontend/src/custom-component/filter-copy/query-single-select-observation-async.ts` SHA-256 `1bfec813d68d02139a9c46b80eb1188437d91a6e66e740ac7531b07cf3392e7a`
- `core/core-frontend/tests/filter-copy-query-reference/query-single-select-session.test.ts` SHA-256 `2c58be150c8575636b55627fc1949f1beaf943cd5c562ad0e7be7c72825c6f03`
