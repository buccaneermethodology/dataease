# 普通 line 组件 RED 独立验证 r001

## 双裁定

- **组件 RED：`PASS_WITH_BOUNDS`。** 独立复跑真实磁盘 `ChartComponentG2Plot.vue`，SFC parse/compile 与实际 setup 控制流执行成功；C01–C06 六例全部执行，5 个冻结断言失败、1 个通过、0 execution errors，首 fingerprint 为 `G2OWN-C01: HELPER_NOT_CONNECTED`，`red_rule_satisfied=true`。这是普通 line SFC 接线前的可信 baseline RED，不是组件实现或产品验收通过。
- **普通 line 组件 Builder：`READY_WITH_CONDITIONS / EXECUTION_ADMISSION_REQUIRED`。** G2 ownership Design Review r003 的范围与组件案例可作为冻结实现输入。可以在新的精确 admission 下开始普通 line SFC 接线；Builder 必须只接入 `chart.type === 'line' && chartView.library === ChartLibraryType.G2`，保持其他 G2 legacy 空态；真实导入并执行生产 helper，不得 mock。R014 的 VM Error realm 测试修正必须在依赖 C04/C05 的 GREEN 判断前完成。R013 八项输入和全部 C01–C06 oracle 纳入 GREEN 门槛。
- **声明上限：** 不证明真实 G2 浏览器、网络/API 真实响应、权限、Copy/Paste、stage/query/Store 原子提交、MVP 或 S02 Goal 完成；G2OWN-027 仍是后续 stage 遗留。

## 输入摘要与执行身份

Lane Card `G2-OWNERSHIP-COMPONENT-RED-VALIDATION-r001` canonical SHA-256 为 `f97df147a38e3af78cd87758d6f144764f41d263b5e1e6f5363351d1757939e6`，`lane_task_card.py validate` 通过。Context Bootstrap 为 `validation` profile，17 项必读、`skipped_reads=[]`，校验退出码 0。唯一写入目标是本报告。

| 输入 | 本轮 SHA-256 / 身份 |
| --- | --- |
| Goal | `28c94d3c35d4ce0a891ce77ecc915932d67f88ef813f3d2815dc0dce11f91b64` |
| Design r003 | `ab6aa597e06199bc947ff82f1b16f2955fe22e9e7210ac5bc2301e2b92295761` |
| Cases r003 原字节 | `b8844f51bed1f0574215210003ad1d59831c75635f9b0b6ed091baf3b78bbfe7` |
| C01–C06 canonical identity | `b12fff5f0142dab756ec8881f9b2e2dcdfe9fb36044f9553669955dafc811426` |
| 实际 SFC `ChartComponentG2Plot.vue` | `e9429bf59915e5a23d4f9d70987b126ca8b8329863be3208c625367e71f607e5`（执行前后相同） |
| `component-check.mjs` | `a56ba94ff722fea2b71b4e54e747fccfc727246bc4716d7ca8627c76e8ab5233` |
| line renderer `line.ts` | `acacb1ae0fde128a1cb894f06ce073454da04205e9225633168e5f67cc8b4311` |

复跑命令：在 `core/core-frontend` 执行 `node tests/g2-render-ownership/component-check.mjs --mode red`。退出码 1、stderr 为空；结果为 6 cases、1 pass、5 assertion failures、0 execution errors、首 fingerprint `G2OWN-C01: HELPER_NOT_CONNECTED`。C01–C06 的逐条状态、全部 assertion 和事件保存在 stdout；原准备日志摘要与本轮复跑摘要一致。退出 1 是合同断言失败，不是编译/执行错误。

helper 生产文件在本轮并行 Builder 工作期间从准备日志记录的 `ee4a86b213973ae00345fe079000454085c72af8c48a2725cdda454c1b8fb3ed` 变化为 `d31e006939b938594ea46d4258a4b87a43cd129cbe8732ae933f26a0a652f319`；本轮 harness 将该实际文件编译成功。SFC 源文件没有 `g2-render-attempt` import，C01–C06 的观察来自实际 SFC 行为，不消费 helper 导出。因此此摘要变化是独立输入变化，不构成组件 RED 行为缺陷，也不改变 SFC baseline identity。未来 SFC 接线必须使用真实 helper 文件及其实际摘要，不得改成测试 double。

## Harness 与接线边界

Harness 每次从磁盘读取 SFC，通过 `@vue/compiler-sfc.parse/compileScript` 编译，以 Babel AST 要求唯一 setup 与唯一 `return __returned__` 锚点，只在返回前插入只读 snapshot getter，再用 esbuild 编译并执行。唯一 getter 暴露 `myChart`、`activeG2Scope`、`g2RenderVersion`、unmount 状态；不修改既有控制流，也不通过它写私有状态。未知 require 会因缺少显式 module double 失败；没有万能 Proxy、复制 `renderG2` 或源码字符串通过。

测试经真实 setup 返回的 `calcData`/`renderChart`、登记的生命周期和 observer callbacks 驱动控制流。O 是通过 `calcData → getData fixture → renderChart → renderG2` 建立；deferred create/render/afterRender、resize queue、旧 autoRefresh callback 和卸载均按实例 ID 观察。DOM、Store/API、timer、G2 chart 与 adapter 是具名 doubles，所以测试证明的是组件接线控制流，不是真实 G2 或权限。

## C01–C06 逐条验证

| Case | 本轮 baseline 观察 | 冻结 GREEN oracle / 裁定 |
| --- | --- | --- |
| C01 新实例 ready 前不发布 | create:N resolve 后 render 与 afterRender 分别处于 deferred；此时实际 `myChart=N`，O 已 destroy 一次；最终 active scope 没有 N。4 条断言失败，fingerprint 精确为 `G2OWN-C01: HELPER_NOT_CONNECTED`。 | render 和 afterRender pending 时 `myChart=null`、N 未发布、O destroy 一次；两段 gate 均 resolve 后 `myChart=N` 且 active scope 持有 N。断言可观察且同一 SFC/runner/case 可转绿。 |
| C02 autoRefresh 旧 callback 跨代 | O 的 `updateData` pending 时排入 N，旧 callback 在 N ready 前后各被触发；观察到旧回调安装 assist 两次，且会触碰 N cleanup；未发生 stale replay。2 条断言失败。 | 旧 callback 两次均不得安装/替换 assist、不得 replay、不得改动 N cleanup；N full render 仍 ready。真实触发来自保存的 updateData callback。 |
| C03 resize 与 unmount | 已入队未开始、forceFit 已开始未 settle 两个子例均执行；卸载后的新 options/forceFit/replay 调用均为 0，O destroy 一次；已开始的库 Promise 正常 settle。通过。 | 保持以上 oracle；不要求物理取消 G2 库内部 Promise。 |
| C04 unmount cleanup failure | ready O 的 assist cleanup 抛错；baseline 记录错误，但 O destroy 和其余清理未完成，两个 observer 未 disconnect。pending N 子例另行执行并清理 O/N，未在卸载后发布。整体 4 条断言失败。 | assist 错误身份保留且可观察；其余 cleanup、destroy、observer disconnect、timer/queue 清理继续；pending N settle 后只清理，不发布。当前 GREEN 的错误身份断言另受 R014 harness realm 问题影响。 |
| C05 full-render 替换 cleanup failure | assist 错误出现一次；O destroy/其余 cleanup 未完成、N 未 ready，observer 未断开。3 条断言失败。 | cleanup error 恰一次可见，其余 O cleanup/destroy 继续，N ready，替换期间 observer 保持连接。错误身份断言受 R014 harness realm 问题影响。 |
| C06 empty 兼容矩阵 | area、mix-dual-line、bidirectional-bar 的 undefined 均走 legacy，调用 renderer 后完成且无新增 missing-instance 错误；line `[]` 仍调用 renderer；普通 line 非空+undefined 未报 missing-instance。2 条断言失败。 | 三个其他 G2 类型保持 legacy；普通 line 显式 `[]` 不调用 drawChart、不发布实例/Scope/错误并完成；普通 line 非空+undefined 报 `G2_RENDER_INSTANCE_MISSING` 且不发布。 |

C03 是唯一 baseline pass。其他 G2 的三个 legacy 样例有明确正向兼容验证；line 的特殊 empty predicate 不应扩散到 area、mix 或 bidirectional-bar。

## R013 八项输入与可达性

补充函数从真实 SFC `calcData` 入参开始，经实际 chartData 更新、`renderChart` 至 `chartView.drawChart` double，记录传入结构与 response fixture 完全相同。八项均实际达到 drawChart 一次且请求 callback 完成；本轮 baseline 八项均断言失败、0 execution error。这些是前端组件调用链中的可达性证据，不证明后端真实响应的发生频率。line renderer 源码的旧 guard 是 `!chart.data?.data?.length`，因此以下值在当前 renderer 会返回 undefined；RED runner 用显式 renderer double 观察组件处理分支。

| R013 输入 | 到达 drawChart | 与响应结构一致 | 当前实际线渲染长度 guard | 冻结 GREEN 期望 |
| --- | ---: | ---: | --- | --- |
| `response.data` 缺失 | 1 | 是 | 返回 undefined | 按原 renderer 调用；undefined 报 missing-instance；不发布 |
| `response.data = null` | 1 | 是 | 返回 undefined | 同上 |
| `data` 对象缺 `data` 行字段 | 1 | 是 | 返回 undefined | 同上 |
| `data.data = null` | 1 | 是 | 返回 undefined | 同上 |
| `data.data = {}` | 1 | 是 | 返回 undefined | 同上 |
| `data.data = 0` | 1 | 是 | 返回 undefined | 同上 |
| `data.data = []` | 1 | 是 | 返回 undefined | 明确 empty；跳过 drawChart、不报 missing-instance、不发布 |
| `data.data = [{value:1}]` | 1 | 是 | 返回实例前可继续 | 按正常 renderer 实例路径；supplementary fixture 返回 undefined 时应报 missing-instance 且不发布 |

前七种无有效 length 的值与 explicit `[]` 在旧 renderer 中都会触发 undefined，但新合同只将真实数组空值视作 empty；其余 malformed/missing 输入应依冻结合同暴露 missing instance。R013 八项当前都失败，GREEN 需八项全通过。真实 renderer 本体未由这些补充案例执行，用户数据分布保持 unknown。

## G2OWN-R014 / P1 / OPEN：helper 与组件分属 VM realm，C04/C05 的 GREEN 错误身份会被 harness 制造为假失败

`component-check.mjs` 在一个新 VM context 中执行 helper 编译模块：`new vm.Script(helperCode).runInNewContext({ module, exports })`。fixture cleanup 返回的函数及其 Error 在 host realm 创建。helper 当前 `cleanupError()` 使用 `error instanceof Error`；跨 realm 时 host Error 在 helper VM 中不是该 VM 的 `Error`，会被包装为新 Error，原始 `testErrorId` 只在 `cause` 上。C04/C05 的 `h.errorIds()` 只检查错误本身/`cleanupErrors` 数组里的 `testErrorId`，且 `onCleanupErrors` 的 fixture observe 以原对象身份校验；于是同一浏览器 realm 不会发生的差异可导致 GREEN 错误身份断言失败。

**性质与最小修复：** 这是测试 VM realm 不一致，不是产品 helper 合同缺陷。产品 bundle 中组件与 helper 处于同一 realm，生产 cleanup Error 应被原样保留。GREEN 前在 runner 将 host `Error` 构造器传入 helper VM context（或令 helper 与组件共用 realm），并断言 C04/C05 原 fixture Error identity/testErrorId 原样可见。不得通过放宽产品错误身份 oracle、忽略错误或接受包装值来“修复”测试。此 runner 修正不影响本轮真实 SFC baseline RED 的五失败/一通过结论。

## 未检查项与精确准入条件

未运行未来 GREEN、真实 G2 浏览器、网络/API、数据库、权限、Copy/Paste、保存重开、双 host stage、query/Store 原子提交、完整产品 build 或 Goal Closeout。未检查 G2OWN-027 的 partial allocation 修复；该项仍由后续 stage owner 负责。helper 生产实现处于并行工作，本轮只记录它的摘要及是否被 harness 实际导入，不据其变动推断 SFC RED 结果。

组件 Builder 可在以下边界内由 Orchestrator 签发新的精确 admission 后开始，不需要重开本单元 Design Review：

1. Admission 绑定当前 `ChartComponentG2Plot.vue`、组件 runner、Goal、Design r003、Cases r003、本报告及实际工作拓扑摘要；写入目标仅限批准的 SFC 接线与 `component-check.mjs` realm 修正。
2. SFC 接线仅限普通 G2 line；helper import 必须解析到真实 `g2-render-attempt.ts` 编译产物。不得用 mock helper、复制实现、修改 frozen C01–C06 或弱化其 oracle。
3. 将 helper VM 的 `Error` constructor realm 对齐后，用同一 runner执行完整 GREEN；C01–C06 必须 6/6 通过，R013 必须 8/8 通过，0 execution errors。每次记录 SFC、helper、runner、Cases、编译器身份；若 helper 摘要变化，先做输入 rebind/复验，不把摘要漂移称为行为失败。
4. 定向 lint、SFC compile 与实际 browser/G2 验证分层报告。即使本 SFC lane GREEN，也只证明普通 line ownership 接线候选，不证明真实 G2 浏览器、stage/query/Store、权限或 Goal 验收。

本报告仅验证 component baseline RED 与普通 line 组件 Builder 入口，不重开 Design 第 4 轮，不关闭完整 S02 Goal。
