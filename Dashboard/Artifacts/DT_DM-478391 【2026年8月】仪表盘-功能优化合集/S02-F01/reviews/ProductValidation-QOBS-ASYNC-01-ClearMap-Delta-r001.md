# QOBS 清空时 map/cascade 迟到响应独立 Delta Validation r001

- 日期：2026-10-20
- 范围：仅复核 PA-006/PA-007 对初始枚举 pending 时清空单选值、随后迟到成功/失败响应的新增 Vue 组件断言；检查当前产品代码的失效路径；重跑指定组件 runner、纯模型 runner 与 Select.vue 定向 ESLint。
- 冻结指标保留：Goal AC `10`、`must_have=26`、`product_obligations=16`；`Scope Delta=none`。本次验证不调整范围或验收分母，不声明 S02 Goal 完成。
- Verdict：**PASS_WITH_BOUNDS**。新增 map/cascade 前后断言通过，未发现这次变更引入的产品缺陷。报告列出一项非阻断测试断言健壮性缺口。

## 逐项结论

1. **Cascade harness 连接：通过。** `check.mjs` 在 `mountSelect()` 中提供可观察的 `cascadeItems`，并通过 `cascade-list` 提供给真实 SFC；数据形状包含目标 condition `q1`。它允许 `setCascadeValueBack()` 更新 `currentSelectValue`，因此不是只比较未接线的 fixture。
2. **PA-006 清空后、迟到成功：通过。** runner 先把 `config.mapValue` 设为 `['initial-map']`，再清空并在响应前断言 loading false、请求数仍为 1、`mapValue=[]`、cascade `currentSelectValue=[]`；迟到成功后再次断言以上状态、selected value 仍为空。响应前后 options 也做比较（其快照别名限制见 Finding）。
3. **PA-007 清空后、迟到失败：通过。** 同样在清空后与 reject 后各自断言 map 与 cascade selection 为空，并在 reject 后检查请求数仍为 1、loading false、selected value 为空和 options 比较。
4. **产品失效路径：通过静态与组件行为交叉核对。** 清空由 `handleValueChange()` 同步调用 `invalidateObservation()`，清除 active request 并令 loading false；旧成功与失败都因 request identity 失配在响应处理早期退出，finally 不作旧请求状态写入。runner 使用真实 `Select.vue` SFC、Vue renderer 和延迟 Promise；API 与 Element Select 是 stub。
5. **Runner 输入绑定：通过但无自带散列断言。** runner 每次执行读取当前 `Select.vue`，调用 `parse`/`compileScript`，再将编译后的内容打包运行，没有消费预生成 bundle。本轮记下实际运行源与 runner 散列供复核；runner 本身不会在输出中自动打印/断言源散列。

## Finding 与未覆盖边界

- **F-PA-008（P3，测试质量）：options 快照使用同一引用。** PA-006/007 将 `rendered().component.props.options` 直接赋给 `optionsBeforeClearResponse/Failure`，之后用 `deepEqual` 比较。若回归代码原地修改同一个 options 数组，前后变量会共同看到修改，测试可能仍通过。建议冻结或深拷贝清空之后、响应之前的 options，再与响应后值比较。当前实现以新数组替换 options 且 stale branch 早退；本 finding 降低测试 oracle 对原地变异的灵敏度，不是已观察到的产品错误。
- 旧 initial request 被新请求替代、随后旧响应到达而新请求仍 loading 的完整 Vue 组件交错尚未覆盖；pure model 的 `stale_request_id_does_not_close_new_loading` 通过，产品身份门控也显示旧请求不会在 stale finally 关闭新的 loading，但仍建议增加组件级交错用例。
- 没有验证真实 Element Plus、浏览器、网络/后端、持久化或权限环境行为；本 harness 是实际 SFC/Vue 响应式生命周期加 UI/API stub。

## 验证结果

- `node tests/filter-copy-query-observation-component/check.mjs`：PASS，`PA-001..007`。
- `node tests/filter-copy-query-reference/query-single-select-observation-async.test.ts`：PASS，9/9；含纯模型 stale request 不关闭新 loading 场景。
- `./node_modules/.bin/eslint src/custom-component/v-query/Select.vue`：PASS。
- `git diff --check -- core/core-frontend/src/custom-component/v-query/Select.vue`：PASS。
- 组件 runner 在仓库前端根目录写临时 bundle 并于 `finally` 删除；复核后未发现 bundle 残留。本报告和既有工作树改动以外，本轮未修改源码或测试。

## SHA-256 输入绑定

- `core/core-frontend/src/custom-component/v-query/Select.vue`：`30efd4a571a8146a68c8a57e64dfee93208670db4155b8f9257a4553efcfcac8`
- `core/core-frontend/tests/filter-copy-query-observation-component/check.mjs`：`7326d108fb774cc0f10d66229b8b3727603bbc1af9b7b510425fdb9dc846b4be`
- `core/core-frontend/tests/filter-copy-query-reference/query-single-select-observation-async.test.ts`：`bc1cad8262ecb36f8975094dd302dfcae95bb0a4dac2f317e5d6c531b1d7af80`
- `QuerySingleSelectObservationResolutionFixtures-r004.json`：`acb43b7b421d00201fa1f06545d51351c551ddf3eedcf894d067cf9b6ff5d215`

本报告的 PASS 仅限上述 delta 和边界，不改变 S02 总体状态。
