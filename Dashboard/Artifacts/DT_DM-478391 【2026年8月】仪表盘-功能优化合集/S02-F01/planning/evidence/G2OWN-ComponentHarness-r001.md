# 普通 line 实际 SFC 组件 RED 与 Harness 候选 r001

## 交付结论与证据上限

已落地 `core/core-frontend/tests/g2-render-ownership/component-check.mjs` 并执行磁盘实际 `ChartComponentG2Plot.vue` 的 C01–C06。结果为 **6 个冻结组件 case 全部执行，1 pass、5 个合同断言失败、0 execution errors，退出 1，stderr 为空**；首 fingerprint 精确为 `G2OWN-C01: HELPER_NOT_CONNECTED`，`red_rule_satisfied=true`。这是可信 baseline RED 的 Builder 候选，**独立 Validator 尚待核验**；不能作为组件接线完成、真实 G2、权限、MVP、产品接受或完整 Goal 通过。

原组件运行前后 SHA-256 均为 `e9429bf59915e5a23d4f9d70987b126ca8b8329863be3208c625367e71f607e5`。生产 helper 仍为 NOT_IMPLEMENTED stub，摘要 `ee4a86b213973ae00345fe079000454085c72af8c48a2725cdda454c1b8fb3ed`；本 lane 未修改生产 helper、实际组件、helper runner、冻结 Goal/Design/Cases 或 Dashboard 状态。原 10 AC、26 must-have、16 产品义务、Scope Delta none 保留，G2OWN-027 后续完整 stage owner/风险保留。

## 准入与当前运行身份

消费并复验本 stem 的 Card、Context、runner admission-0、evidence admission-1，四个命令均退出 0；全部 11 项 Context required-read 的实际字节摘要重新匹配。canonical Card digest 为 `20e451fc29e818617f296c7dd2894ceb6b41bd47c98834070af4a16f657a86fa`。具体命令、checks stdout 摘要、全部输入及 raw evidence 摘要见 `G2OWN-COMPONENT-RED-r001.identity.json`。

最终原始证据运行开始 `2026-10-27T00:40:23.651270+00:00`，结束 `2026-10-27T00:40:23.837508+00:00`，均为执行时 UTC 记录，没有使用 mtime 推算。已有 node_modules 被复用，未安装依赖、未启动产品或连接数据库、未提交/推送。

在 `core/core-frontend` 执行：

```sh
node tests/g2-render-ownership/component-check.mjs --mode red
```

未来同一个 runner 使用 `--mode green` 时**不替换 frozen case 或 expected**，仍执行相同 C01–C06 oracle 和单列 R013 补充 oracle。mode 仅记录运行标签，不能把 baseline 期待错误改成 GREEN 期待成功。6/6 以及 R013 补充通过仍须独立 Validation，不能自称接受。

| 对象 | SHA-256 |
| --- | --- |
| Cases r003 原字节 | `b8844f51bed1f0574215210003ad1d59831c75635f9b0b6ed091baf3b78bbfe7` |
| C01–C06 canonical identity | `b12fff5f0142dab756ec8881f9b2e2dcdfe9fb36044f9553669955dafc811426` |
| runner | `a56ba94ff722fea2b71b4e54e747fccfc727246bc4716d7ca8627c76e8ab5233` |
| 实际 SFC 编译+seam 后 CJS | `a4b1886c5175b12a5796c05fde3ecc8e1782e3e0bce8e45ba26f89b99aafb542` |
| 原始 stdout | `f3c23942d2f028bb9de5c7e4c451f6be42cacec64a7b7f5d298870249b5a2e0e` |
| 空 stderr | `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855` |
| exitcode 文件 | `4355a46b19d348dc2f57c046f8ef63d4538ebb936000f3c9ee954a27460dd865` |

依赖实际版本：@vue/compiler-sfc 3.5.44、Vue 3.5.35、esbuild 0.25.12。编译器与 runtime 的现存安装版本不同，本运行编译/执行成功；没有据此声称所有产品构建入口兼容。

## 实际 SFC、观测 seam 与显式 doubles

每次运行重新读取磁盘 SFC，用 `@vue/compiler-sfc.parse/compileScript` 编译，`@babel/parser` 解析编译后的 TypeScript AST。只接受唯一 setup ObjectMethod 和其直接语句中唯一 `return __returned__`；任一锚点缺失/重复立即 execution_error。在该 return 前插入唯一 `Object.defineProperty` 只读 getter `__g2OwnershipSnapshot`，返回 Object.freeze 的 myChart、activeG2Scope（不存在则 null）、g2RenderVersion、chartComponentUnmounted。没有 setter，没有改既有分支、await、赋值或函数体。其余原编译脚本字节按原顺序完全保留，实际 esbuild 编译后于 vm 中执行。seam 的 offset、注入摘要与前后脚本摘要已记录在 stdout/identity。

测试只经实际 setup 暴露的 calcData/renderChart、登记的 mounted/beforeUnmount、observer callback，以及实际 drawOptions.action / updateData 保存回调驱动。只读 getter 仅观察，不写私有状态。O 由真实 calcData→getData double→真实 renderChart→真实 renderG2 全流程完成建立，未直接写 myChart；C02/C03 的联动态由渲染器 action 事件经过实际 action/trackClick 建立，没有写 linkageActiveHistory。

所有模块 doubles 逐名字显式列在 runner 的 Map，未知 require 抛 UNDECLARED_MODULE_DOUBLE，无兜底 Proxy。真实 Vue 的 ref、shallowRef、reactive、computed、toRefs、nextTick 保留；只收集 mounted/beforeUnmount hook 供确定顺序调用。lodash-es 实际实现被复用。API 是具名队列 fixture；Store 是具名显式方法与真实 Vue refs。G2 实例 double 具名提供 destroy/render/forceFit/options/emit/getContext，可记录每次调用及实例身份。四类 adapter 分别登记实际 double 返回的 disposer，指定 assist:O 可抛同一带身份错误。DOM 与 ResizeObserver/IntersectionObserver 是最小具名 doubles；300ms timer 用显式可推进队列，carousel resize queue 可保存已出队 callback，卸载后仍可测试它。

生产 g2-render-attempt.ts 也按当前磁盘字节编译成实际模块，仅为未来实际组件 import 提供原模块 exports。当前 baseline SFC 没有调用它，RED 完全来自实际组件行为；没有实现或替换 stub，也没有依赖 stub 输出构造 C01 结论。

## C01–C06 全部结果及未来 GREEN oracle

| Case | 实际基线观察与裁定 | 同一 runner 的未来 oracle |
| --- | --- | --- |
| C01 | create:N、render:N、afterRender:N 分别真实 deferred；create resolve 后 render 已进入且未完成，myChart=N、N_published=true、O destroy=1；afterRender pending 时也已发布；最终 active_scope_instance=null。精确 HELPER_NOT_CONNECTED 断言失败。 | create 返回而 ready 前 myChart=null、N 不发布、O destroy=1；afterRender gate 完成后 myChart=N 且 active scope.instance=N。 |
| C02 | O updateData pending 后排入 N，旧 callback 第一次安装 assist:O；N ready 后旧 callback 又清/装 assist:N。旧 callback 触发的安装共 2，stale replay=0，N_cleanup_untouched=false。断言失败。 | 两次旧 callback 均不装 assist，不回放，不碰 N cleanup；N full render 最终完成。 |
| C03 | 已排队但未开始、forceFit 已开始尚未 settle 两子例均执行。卸载后 options/forceFit新调用/replay 均 0，O destroy 各 1；forceFit 已开始的库 Promise 允许正常 settle。pass。 | 完整保留两子例的 0/0/0 与 destroy=1，不能要求物理取消库 Promise。 |
| C04 | ready O 的 assist cleanup 抛错：错误身份被观察，但 O destroy=0、tiled/pagination 未清、两个 observer disconnect=0。pending N 子例另建环境执行，O/N destroy=1/1、卸载后无新发布，observers 各1。整体断言失败。 | 错误身份可见，其余 cleanup/destroy 继续；两个子例 observers 各1、timers cancelled、resize dequeued；pending N 只清理不发布。 |
| C05 | full-render 替换时 assist:O 抛错恰一次可见，O destroy=0、后续 cleanup 未执行、N 没有 ready；observers 保持连接。断言失败。 | 错误恰一次可见，剩余 cleanup 与 O destroy 继续，N ready；替换期间不 disconnect observers。 |
| C06 | area / mix-dual-line / bidirectional-bar 的 undefined legacy 子例均实际 draw=1、无新 missing 错误并完成。line [] 仍调用 draw=1，非空+undefined 未报 missing 错误；整体断言失败。 | 三个 legacy 保持完成无新增 missing 错误；line [] draw=0、无 instance/scope/错误且完成；line 非空+undefined draw=1、G2_RENDER_INSTANCE_MISSING、无发布。 |

C04 的 post_unmount_publish_count 仅比较卸载前后 N 指针是否从非 N 转为 N，不把卸载前已提前发布后残留的指针误记成“卸载后发布”。提前发布由 C01 单独证明。C06 的 empty 内部 helper status 没有额外 seam，empty 的可观察 oracle 是“不调用 drawChart、没有 instance/scope/错误、请求完成”，不伪称直接看到了 helper 私有返回值。

每个 case 的全部断言和全部事件序列均在 stdout；断言使用收集模式，失败后继续其余断言、子例和 C01–C06 全部 case。未知编译/import/执行异常与超时单列 execution_error、退出 2，不投影为 RED。预期注入的 cleanup 错误和明确 missing-instance 错误可进入合同观察，其它日志 Error/TypeError/ReferenceError 保持执行错误。真实 deferred gate 未达到、初始 O 未建立、要求的 renderer 调用未发生亦 fail closed，不用空运行冒充有效断言。每个 case 有实际 Node 时钟 1500ms 上限，防止未 settle Promise 让 runner 静默退出。

## R013 补充输入可达性与兼容差异

静态依据是当前磁盘 `ChartComponentG2Plot.vue:539` 的 calcData 直接把 `res?.data` 写入 chartData，然后 `:607` 的 renderChart 将 chartData.value 作为 drawOptions.chart.data；中间没有 rows 数组断言或缺值→[] 归一化。普通 `line/line.ts:101` 的原 drawChart 使用 `!chart.data?.data?.length` 提前返回 undefined。API `src/api/chart.ts:79` 的 getData 成功分支返回 res?.data；`utils/CalculateFields.ts:19/25` 对字段解码使用 obj?.[field]，不为数据行补数组。因此不能依据前端链宣称 missing/null/non-array 不可达。

本次补充 8 个 fixture，直接作为 getData double 的组件级响应输入，运行实际 calcData→renderChart→drawChart：response.data 缺失、response.data=null、rows 缺失、rows=null、rows={}、rows=0、rows=[]、rows=[{value:1}]。**8 个都确实到达 drawChart，draw=1，传入结构与 fixture 完全相同，请求完成**。前 7 个满足原 line 长度 guard 返回 undefined（包含 []），只有 [] 满足新设计显式 empty 谓词。非空数组与前 6 种缺失/非数组的 undefined 都应按现冻结 Design 报 missing-instance；显式 [] 应跳过 draw 且无该错误。此独立补充 oracle 不改冻结 C01–C06 identity，也不把 8 个补充例计入 6 个组件 case 分母。

当前基线的补充 oracle 为 0 pass / 8 断言失败 / 0 execution errors：它仍静默接收 undefined，且 [] 仍调用 renderer。未来同一 runner 要求这 8 个补充 oracle 通过才将 green_rule_satisfied 设为 true。该规则承接已有 Design 的明确裁定，不新增或改写冻结 Cases。

**证据限制：** 上述是输入在实际前端组件控制流中的条件可达性，不是生产 API 真实出现次数或后端必然生成这些 payload 的证据。getData/网络和 G2 renderer 是明确边界 double；没有实际后端响应、用户数据或真实 line/G2 库运行。正式产品分布仍 Unknown。组件接线后的期望错误/empty 兼容性尚未实现与独立验证，R013 不能按本 RED 自动关闭。

## 已检查维度、未检查与交接

已完成 SFC parse/compileScript/esbuild 执行、唯一 AST 锚点和只读 getter、真实 Vue 语义、实际 calcData 建立 O、分离 create/render/afterRender deferred、C02 旧回调跨代、C03 卸载两时序、C04 双子例、C05 cleanup 失败、C06 三 legacy + 两普通 line 矩阵、R013 8 类输入和独立 supplementary oracle；`node --check` 成功。全部 case 执行及零执行错误是本 Builder 的可复验事实，不替代独立审阅或验收。

未运行真实 G2/浏览器 tooltip/legend/resize、API 网络、数据库、权限、Copy/Paste UI、保存重开、隐藏 stage host、query/Store 原子提交、其它 G2 ownership、全量 ts:check/产品 build。它们超出本 RED 准备准入，不能写成通过。当前 helper stub、组件未接线，GREEN 为 false。正式接线仍须独立 Validator 核对本 runner 的全部 oracle/原始日志/实际组件摘要、批准可信 RED，然后新精确 helper/source 与组件 action-target admission；不能凭本自检直接启动未准入的生产写入。

本报告是单元 Builder handoff，不重开第 4 轮 Design Review，不替代原 r003 或全 Goal Stop Gate；持续执行与后续独立 Validation 由 Orchestrator 维持。
