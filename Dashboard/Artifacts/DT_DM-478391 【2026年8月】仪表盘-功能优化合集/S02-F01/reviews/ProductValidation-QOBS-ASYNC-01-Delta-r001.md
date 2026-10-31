# QOBS-ASYNC-01 产品修复独立 Delta Validation r001

- 日期：2026-10-20
- Verdict：**F-QOBS-001 CLOSED_WITH_BOUNDS**。工作树修复覆盖了 finding 指定的初始观察请求失效路径；组件级成功/失败迟到响应验证通过。
- 边界：只读独立验证；未修改产品或 runner。组件 runner 每次直接读取当前 `Select.vue`，经 `@vue/compiler-sfc` 编译并用 Vue renderer 实际挂载；Element Select、API、网络仍是 stub。这证明 SFC watcher/Promise 路径，不等于真实浏览器/后端验收。

## Finding 关闭判断

在 `Select.vue` 的 `handleValueChange` 中，若当前 active request 是 `initial` 且新值不再满足观察资格，同步执行 `invalidateObservation()`。该函数清空 active request、结束 loading、恢复有效状态；随后旧 then/catch 因 request identity 不再匹配而仅作 stale no-op，finally 不会影响新 owner 的 loading。关键位置：`core/core-frontend/src/custom-component/v-query/Select.vue:251-265,788-795,356-377,447-467`。

运行 `node tests/filter-copy-query-observation-component/check.mjs`，结果 `PASS PA-001..007`。PA-006 覆盖清空后迟到成功：请求数仍为 1、loading false、selected value undefined、options 与响应前一致；PA-007 覆盖清空后迟到失败：请求数仍为 1、loading false、selected value 与 options 未被旧响应改变。因此“清空后发额外请求”“旧响应复活选项/值”“旧响应留下 loading”在这两条真实 SFC harness 路径均未复现。

旧请求不关闭更新请求的保护仍由当前 request identity 在组件逻辑层实现；`query-single-select-observation-async.test.ts` 的 `stale_request_id_does_not_close_new_loading` 通过。组件 runner 的 PA-006/007 是清空后无新请求场景，PA-001..005 的过期响应主要覆盖 verification 生命周期，**没有直接覆盖“旧 initial request 失效、随后新 enum request 已进入 loading、再 resolve/reject 旧请求”这一完整 Vue 组件交错序列**。因此组件级旧请求/新 loading 保持仍是待增加的独立场景；当前 model 测试不能替代该组件交错验证。

PA-006/007 代码断言捕获响应前 options 和当前选择，但没有捕获 `config.mapValue` / cascade `currentSelectValue` 在用户清空后的值并与迟到响应后的值比较。当前源码 stale 分支在任何 options/map 更新前退出，静态路径支持“旧响应不改 map”；**runner 尚未为 map/cascade 写入提供直接 oracle**。建议补一条在 clear 后快照 map/cascade，再分别 resolve/reject 旧请求并比对的组件断言。

## 本次执行

- `node tests/filter-copy-query-observation-component/check.mjs`：通过，`PA-001..007`。
- `node tests/filter-copy-query-reference/query-single-select-observation-async.test.ts`：通过，9/9；包含 pure model stale request 不关闭新 loading 用例。
- `./node_modules/.bin/eslint src/custom-component/v-query/Select.vue`：通过。
- `git diff --check -- core/core-frontend/src/custom-component/v-query/Select.vue`：通过。
- 未执行浏览器、Element Plus 原组件、真实 API/后端、持久化或权限行为；这些不在本次 delta harness 覆盖范围。

## Runner 与输入绑定

组件 runner 每次通过路径 `src/custom-component/v-query/Select.vue` 读取现有工作树源文件，调用 `parse`/`compileScript` 后立即打包并运行，不使用预构建 bundle。runner 本身不输出 source digest 或断言冻结 digest；本次验证记录执行输入散列如下，提供可复核的版本绑定：

- `core/core-frontend/src/custom-component/v-query/Select.vue` SHA-256：`30efd4a571a8146a68c8a57e64dfee93208670db4155b8f9257a4553efcfcac8`
- `core/core-frontend/tests/filter-copy-query-observation-component/check.mjs` SHA-256：`f60b7ba17a6a1e8c6d7f7f55f256eb72461cfea7700323dbfd24fd00697c0744`
- `core/core-frontend/tests/filter-copy-query-reference/query-single-select-observation-async.test.ts` SHA-256：`bc1cad8262ecb36f8975094dd302dfcae95bb0a4dac2f317e5d6c531b1d7af80`
- 纯模型报告的 source digest：`1bfec813d68d02139a9c46b80eb1188437d91a6e66e740ac7531b07cf3392e7a`
- QOBS r004 fixture digest：`acb43b7b421d00201fa1f06545d51351c551ddf3eedcf894d067cf9b6ff5d215`

该报告只关闭 F-QOBS-001 的初始清空/loading finding；不会把当前 S02 Goal、真实权限验收或产品整体验收标为完成。
