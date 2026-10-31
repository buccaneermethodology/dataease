# QOBS 清空与重叠请求 Runner 独立 Delta Validation r002

- 日期：2026-10-20
- 范围：仅检查当前组件 runner 对 r001 所列 options 快照别名 finding 的修复，以及 PA-008 的“旧初始请求被新 field query 替换、旧成功响应到达时 loading 保持、新请求成功后结束 loading”序列；实跑组件 runner、纯模型 runner与 Select.vue 定向 ESLint。
- 冻结指标：Goal AC `10`、`must_have=26`、`product_obligations=16`，`Scope Delta=none`。不改变原 Goal 范围/分母，不声明 S02 完成。
- Verdict：**PASS_WITH_BOUNDS**。PA-006/007 原 finding 的修复有效；PA-008 success 交错可达且通过。保留一项 runner 输入断言补强建议和失败交错未覆盖边界。

## r001 Findings disposition

- **F-PA-008（options 快照引用别名）：已关闭。** runner 新增 `snapshotOptions(options) => options.map(option => ({ ...option }))`，在 clear 前保存 option 对象副本。当前组件 options 是浅层标量字段对象，因此浅复制可以侦测后续原地改写 label/value/checked/disabled，也可以侦测替换数组后的差异。PA-006/007 都用该快照与响应后的 options 比较。
- **r001 的初始旧请求/新请求 loading 缺口：已由 PA-008 覆盖成功响应路径。** 新 field id 触发 watcher/debounce 生成第二个请求；旧请求成功到达后断言 loading 仍为 true、options 仍空；新请求成功后断言 loading=false 且 options 为新结果。完整组件级拒绝路径尚未覆盖，见边界。

## PA-006/007 逐项验证

- harness 的 `cascadeItems` 经 `cascade-list` provider 返回，并关联 `q1`，可以走到真实组件 `setCascadeValueBack()` 的 current selection 更新。
- PA-006 在旧初始请求 pending 时设置初始 map、清空值，先断言请求数1、loading false、`mapValue=[]`、`currentSelectValue=[]`；迟到成功后再次断言这些值不变及 selection 仍空。options 前像现在是副本，比较不再受同一引用原地变更影响。
- PA-007 同样验证 clear 后及迟到拒绝后的 map/cascade selection，且断言请求数仍1、loading false、selection/options没有被失败响应覆盖。
- 二者均通过当前 Select.vue SFC 编译 + Vue renderer 测试。enum API 与 Element Select 是 stub，因此证明范围是 Vue 组件逻辑路径，不含真实服务行为。

## PA-008 输入、可达性与断言强度

runner 在 `mountSelect()` 后直接把 reactive config 的 `field.id` 从 `f-name` 改为 `f-name-next`。源码 `Select.vue` 的 field/display/sort watcher 监听 `config.field.id` 并调用 `debounceOptions(1)`；同时 request input 由 field id 构造。经过 350ms（300ms debounce 加 tick），runner 断言请求数由1变2且 loading=true，说明新请求确已发起。然后 resolve 请求0（旧请求），断言 loading仍=true、options仍空；再 resolve 请求1，断言 loading=false、options=['A','B']。该交错在当前组件 runner 中可达，实跑通过。

**P3 runner assertion gap：**PA-008 没有直接断言 `requests[0].input.queryId === 'f-name'` 与 `requests[1].input.queryId === 'f-name-next'`。当前变更输入、源码 watcher 与请求数共同支持“新 field 查询”解释，但 runner 未将请求 payload 与预期身份绑定。建议补这两项断言，以让PA-008在结构上直接证明替代请求针对新字段。此为测试证据精度建议，不是本轮观察到的产品缺陷。

## 执行记录

- `node tests/filter-copy-query-observation-component/check.mjs`：PASS，`PA-001..008`。
- `node tests/filter-copy-query-reference/query-single-select-observation-async.test.ts`：PASS，9/9；包含 pure model stale request 不关闭新 loading。
- `./node_modules/.bin/eslint src/custom-component/v-query/Select.vue`：PASS。
- `git diff --check -- core/core-frontend/src/custom-component/v-query/Select.vue`：PASS。
- runner 动态读取当前工作树 `Select.vue` 并编译；runner 自身不输出/断言源码散列。本次散列记录见下。
- 检查后组件 runner生成的临时 bundle 已清理；没有修改源码或测试文件。

## SHA-256 输入

- `core/core-frontend/src/custom-component/v-query/Select.vue`：`30efd4a571a8146a68c8a57e64dfee93208670db4155b8f9257a4553efcfcac8`
- `core/core-frontend/tests/filter-copy-query-observation-component/check.mjs`：`258ce1b4e309f30b0de030462db54a19815dc69428d6072d5cd3ef4b07364dab`
- `core/core-frontend/tests/filter-copy-query-reference/query-single-select-observation-async.test.ts`：`bc1cad8262ecb36f8975094dd302dfcae95bb0a4dac2f317e5d6c531b1d7af80`
- `QuerySingleSelectObservationResolutionFixtures-r004.json`：`acb43b7b421d00201fa1f06545d51351c551ddf3eedcf894d067cf9b6ff5d215`

剩余验证边界：PA-008 仅覆盖旧成功响应；真实 Element Plus、浏览器、网络/后端、持久化、真实权限和撤权仍未观察。本 verdict 仅限本次 QOBS 组件 runner delta。
