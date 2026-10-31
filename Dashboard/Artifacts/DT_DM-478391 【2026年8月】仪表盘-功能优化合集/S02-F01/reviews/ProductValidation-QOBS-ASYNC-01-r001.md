# S02-F01 产品接线独立 Validation r001

- 日期：2026-10-20
- 结论：**FAIL_WITH_BOUNDED_FINDING**。本轮仅独立验证当前工作树中的 QOBS async 组件路径、空白新建 session lifecycle wiring、保存/历史失败路径和指定 QPC producer runner。发现 1 项产品行为缺陷；其它通过结果仅限相应 harness/helper。不能据此宣告 S02 Goal 完成或产品验收通过。
- 执行边界：只读审查；最小 Vue harness 临时文件已在运行后删除，没有保留测试文件或改产品代码。组件 harness 编译工作树中的真实 `Select.vue` SFC，并通过 Vue renderer 和延迟 enum Promise 驱动组件；Element Select 本身、网络与后端是 stub。

## Finding

### F-QOBS-001 — 初始枚举请求期间清空单选值会让 loading 永不收敛（P2）

- 位置：`core/core-frontend/src/custom-component/v-query/Select.vue:356-366,447-467,926-934`。
- 触发：初始 `enumValueObj()` 请求仍 pending 时，用户清空单选值。`handleValueChange()` 更新 runtime generation，但 `watch(selectValue)` 只处理 `activeObservationRequest.phase === 'verification'`。初始响应到达后，`observationRequestIsCurrent()` 因当前值不再满足 `observationSupported()` 而返回 false；then/catch 将 `observationHandled=true` 并提前退出，finally 再因该标记退出，因此 `loading` 保持 true。此时不会发第二次请求。
- 可执行复现：挂载真实 `Select.vue` → 保留第一个 enum Promise pending → `pick(undefined)` → resolve 首次枚举。观察结果：`{"loadingAfterStaleResponse":true,"requestCount":1}`。现有 `PA-001..005` 组件 harness 通过，但没有覆盖此状态序列；纯模型测试也未覆盖。
- 修复验收 oracle：初始请求 pending 时清空当前选择，应同步使该观察请求失效并结束其 loading；旧响应不得改写 options、值或 map，也不得启动核对请求。若已存在更新的请求，旧请求不得关闭新请求的 loading。相关组件测试应通过真实 SFC/Vue watcher 路径覆盖清空、旧成功响应及旧失败响应。

## 其它检查与处置

- **保存失败路径：未发现本轮可证实的缺陷。** `canvasSaveWithParams` 在请求发出前的失败标记为 `definitely_not_written`，请求发出后的异常标记为 `unknown` 并保留未知结果保护；当前 `query-single-select-session.test.ts` 覆盖未知保存结果。静态检查与 session helper 测试不能证明真实服务/数据库行为。
- **历史恢复失败：不判为实现通过原子回滚。** `commitHistory` 捕获 setter 异常后让 session 进入 `unmanaged`，但不会回滚已移动的 history pointer 或已完成的部分 Store setter。测试 `LC3-HISTORY-03` 明确断言 root 已替换、index 已移动且不派发后续事件。这是当前已编码的失败语义；是否满足完整 Goal 的失败原子性，需要按 Goal 产品验收合同单独裁定，本报告不把它记作越出本轮证据范围的新增 finding。
- **QPC producer runner 漂移：独立辅助 finding / 不阻断本次 QOBS 产品 finding。** `saved-owner-producer.test.mjs --mode green` 对 `QPC-PROD-007` 报 1 个期望漂移：fixture 期望 `target_ambiguous`，当前 source 返回 `owner_invalidated`。配套 `saved-owner-producer-repair.test.mjs --mode green` 为 0 mismatch；独立 saved-canvas-owner r004 runner 通过。该证据仅涉及 detached producer helper 与版本化 runner/fixture，不证明 Store producer 产品接线；应在 QPC 自己的验证合同中处理 runner 与 fixture 的版本/断言一致性，不据此改写本轮 QOBS 结果。

## 验证执行记录

- 通过：`node tests/filter-copy-query-observation-component/check.mjs`（PA-001..005）。
- 通过：`node tests/filter-copy-query-reference/query-single-select-session.test.ts`（准备/提交、history partial failure、manifest 和 unknown-outcome save）。
- 通过：`node tests/filter-copy-query-reference/query-single-select-observation-async.test.ts`（纯逻辑模型 9/9；模型结果不等于组件行为）。
- 通过：`node tests/filter-copy-query-cascade-identity-rebinding/rebind.test.mjs`（6 个冻结身份 + 11 个防御检查）。
- 通过：`node tests/filter-copy-query-reference/query-single-select-created-lifecycle.test.ts`（127 checks）；`node tests/filter-copy-query-reference/query-single-select-end-to-end.test.ts`（33 checks）。
- 通过：`node tests/filter-copy-query-saved-canvas-owner/saved-canvas-owner.test.mjs --mode green`；`node tests/filter-copy-query-saved-canvas-owner-producer/saved-owner-producer-repair.test.mjs --mode green`（0 mismatches）。
- 不通过（runner/fixture mismatch）：`node tests/filter-copy-query-saved-canvas-owner-producer/saved-owner-producer.test.mjs --mode green`（仅 QPC-PROD-007 一项 mismatch，见上）。
- 通过：对 Select、QueryConditionConfiguration、dvMain、snapshot、canvasUtils、dashboard/index.vue、DeCanvas.vue 的定向 ESLint。
- 未运行：真实浏览器、真实后端/网络、持久化、权限隔离环境或只读身份/撤权场景；这些不由本轮 stub 或 standalone 环境替代。

## 检查范围与来源摘要

范围包含：`Select.vue` 异步枚举处理；`QueryConditionConfiguration.vue` managed confirmation 的 prepare/commit 与 legacy fallback 边界；`dvMain.ts` lifecycle facade（由 dashboard/DeCanvas/Component 接入）；`snapshot.ts` history 发布；`canvasUtils.ts` 保存成功/失败与 unknown outcome。未审 S02 其它产品 AC、完整 Dashboard/Artifact 分母、真实权限验收及全量浏览器流程。

关键输入摘要（SHA-256）：

- `Select.vue`：`eadbdba2b61aaeaf7abc58f83e75e82595c4a0812ceb1ac971f6739e4e4212a2`
- `query-single-select-session.ts`：`ebda5b9ac14425e9ed3a08ff489150197222f1900949b62209493341c6948189`
- `dvMain.ts`：`2ca7f626c2c31f3c6e5db547cae600cfcf30cf26ed64d8f183a33943751752a2`
- `Component.vue`：`152703881a926e747e4e42f7c593a1558708efa73a3138cdb823cc519b01d081`
- `QueryConditionConfiguration.vue`：`0b88bcdf92d15aceae52ca2992e7a8b4165e3f5cfc3f9cb7435296d7c7e9e047`
- `snapshot.ts`：`5ffd11d4740efbd8570e31c42cffb8870a879eaf309bb4f31b00e40cc57c2e30`
- `canvasUtils.ts`：`f9c68f5c96a716ed451206ef6efcbda27158cc828b578920ed5a15167bbc8282`
- `dashboard/index.vue`：`75c0550afc403cf06ab0ce62cf459dc22d1676842293f73e575bc351b333dddd`
- `DeCanvas.vue`：`6f512a5d714efe5a64746fb8f7d3d78b8e3f7bcc46d74fb362ef5948704db72e`
- `QuerySingleSelectObservationResolutionFixtures-r004.json`：`acb43b7b421d00201fa1f06545d51351c551ddf3eedcf894d067cf9b6ff5d215`
- `QueryProductCommitSavedOwnerProducerContract-r002.json`：`005317149a1ba37ec47e4996c536efef60f51f46bea6b9151630a7f810ef35cc`
- `QueryProductCommitSavedOwnerProducerCases-r004.json`：`f6f97ff89bf7a9e4a6dcc3389960ce3e8f22530dcb30042dfdcdf2018bc84f05`
- component harness / async model / QPC original runner / QPC repair runner：见验证脚本现工作树文件；本报告结论限定到运行时实际读取版本。
