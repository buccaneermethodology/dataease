# QOBS Async Pure Model 独立 Validation r001

## 双结论

**候选实现：`PASS_WITH_BOUNDS_FOR_QOBS_ASYNC_PUREMODEL`。** 当前 runner 的 9/9 行为用例通过，定向 ESLint 通过。实现符合本纯模型合同中的异步响应身份与计数边界：初次枚举缺少当前选择时只发出一次核对请求并保留用户选择、设计与旧 options；核对成功/失败分别更新 validity/options/loading；runtimeGeneration 或 requestId/raw 身份过期时不写状态、不关闭 loading；不增加过滤刷新或 runtime 写入。

**证据上限：RED 仅是实现可用性 RED，不是行为断言 RED。** 保存的 RED 与 GREEN 使用相同 runner、Contract、Fixtures 摘要；RED 为 0/9，失败原因均是 `implementation unavailable`（导出不可用），没有证实冻结行为 oracle 曾对已有实现作断言级失败。本验证没有通过修改/移除 Builder 文件重跑 RED。不得将证据表述为可信行为 RED/GREEN 闭环。

**S02 Goal：`NOT_CONFORMANT_AS_GOAL_COMPLETION`。** 纯模型结果不关闭任何产品验收；原 10 项 Goal AC、16 项产品/兼容义务保持开放。真实 Vue、权限、保存及 S02 Goal 均未验证，真实权限仍 `BLOCKED / NOT_RUN`；S01 状态不变。

## 基线绑定与复跑

Validation card canonical SHA-256 `c2c1d0a69207a0cc1f5e27e21806ba7bb3528b0c54044fb7034741a686be0888` 经 `lane_task_card.py validate` 通过。Context Bootstrap SHA-256 `898117a333ed662a1a49e711245a7514138fb5928897d4cd3605a97a086a5db4` 经验证通过，12 项 required-read revision 全匹配，`skipped_reads=[]`。

合同 SHA-256 `e791593aef2d3e3fdc2f303d011c40914672cf63c4722ffc439974e9e15184be`；Design r004 `8c7636d110a0597f7ac9d1f5b613df108c46aa34ffad6830af3039deebce6005`；Fixtures r004 `acb43b7b421d00201fa1f06545d51351c551ddf3eedcf894d067cf9b6ff5d215`；独立 Delta Review r003 `cefa9f01fff8517e8b1cd0160c14f35dee82d0ed7ba3f436838ae39e97d9d0cd`。源码 SHA-256 `1bfec813d68d02139a9c46b80eb1188437d91a6e66e740ac7531b07cf3392e7a`，runner SHA-256 `bc1cad8262ecb36f8975094dd302dfcae95bb0a4dac2f317e5d6c531b1d7af80`，均与 Context 当前摘要一致。

独立执行：

- `node tests/filter-copy-query-reference/query-single-select-observation-async.test.ts`：9/9 通过，输出源码、合同、Fixtures、runner 摘要与上列一致。
- 对目标模块及 runner 执行定向 ESLint：退出码 0。
- 已复核保存的 RED stdout/stderr/exitcode 摘要。RED runner SHA 与当前相同，Contract/Fixture SHA 也匹配；其 source SHA 为实现前版本 `769b8995b8bf4407c89e906d67601a46266d34922a63ab1754440eecb0657aab`，退出码 1，9 项均报告 `implementation unavailable`。当前实现未被触碰，故未再次制造 RED。

## 用例与边界核验

runner 的 9 项候选行为检查对应 012A–D 的一次核对、含 C、缺 C、核对失败分支，013 的 runtimeGeneration-only mismatch，014 的旧 request 不得关闭新 loading，以及严格 raw 引用身份、已结算请求不可重复应用、stale 输入不变。初始缺 C 分支精确检查请求数从 1 到 2、settled 从 0 到 1，保留用户选择 C、旧 options、design，并保持 `queryRefreshes=0`、`runtimeWrites=0`；verification handler 保持真实 raw 对象的引用相等，不接受结构相同但身份不同的对象。当前 GREEN 用例通过；它是定向 pure-model runner，不是对 r004 六个完整状态投影逐字段的自动回放器。

实现为同步纯函数，只导入对象身份/副作用均受测试约束的模型数据，不导入 Vue、Pinia、Store、网络、权限或保存模块，也不按 case ID 查表或读取 Fixtures。更新分支复制外层 state、identity、options 与 effects；身份中的 raw 对象引用按合同保留。no-op 分支返回原状态引用且不修改它。以上仅是纯模型结构和单元行为，不能推导真实 Promise 调度、Vue 生命周期、并发 Store 写入或产品端 finally 行为。

## Finding 与未验证项

未发现本纯模型行为相对冻结规则的新增缺陷。非阻断证据限制是 RED 只证明当时导出不可用、没有行为级断言差异；此外 runner 以定向断言验证行为，并非逐条自动比较完整 Fixtures 状态投影。候选 verdict 因此限定在当前纯模型及 9 项测试范围。

未执行 Vue 挂载/真实 deferred 请求、Store、权限、保存、撤权、多用户或完整 S02 验收。真实权限继续 `BLOCKED / NOT_RUN`，S01 状态保持原样。任何产品接线及其验收仍须按 Goal 另行准入与验证。
