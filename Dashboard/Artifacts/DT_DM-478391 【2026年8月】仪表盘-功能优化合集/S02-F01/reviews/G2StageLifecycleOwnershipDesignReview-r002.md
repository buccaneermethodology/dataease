# G2 Stage Lifecycle Ownership Design 独立评审 r002

## 三项独立裁定

- **Design Freeze：`NEEDS_REVISION`。** r002 把 helper 的生产 RED 方案、23 个 helper case、cleanup error channel、current-scope guards 和资源所有权表显著具体化，r001 多数设计缺陷已修正。但真实组件接线范围仍有关键语义缺口：现存多个 G2 renderer 会在合法数据/轴状态下返回 `undefined`，设计只为普通 line 空数据定义显式 empty；SFC 案例也未完整给出 old/new scope 和私有活动状态的可观察手段。冻结当前设计会使合法空态在迁移后变为失败，或让组件 RED 只剩不可复核的标签。
- **可信 RED 准备 Entry：`READY_WITH_CONDITIONS / EXECUTION_ADMISSION_REQUIRED`。** 可开始独立的 helper-only RED 准备：Cases 已冻结为 23 个 helper identity；生产 helper `NOT_IMPLEMENTED` stub、固定 runner 路径/命令、精确首 fingerprint 和 execution-error 区分都已写明。准备动作不得改 `ChartComponentG2Plot.vue`；首次写入前仍须消费绑定 helper stub、runner、fixture 的有效 SP-010 execution admission。此 verdict 只表示该有界准备方案在设计层可准入，不是生产 RED 已运行、已通过 Validator 或主 Builder 已获准。
- **主 Builder Conditional Entry：`BLOCKED / NOT_READY`（满足列明前置条件后再准入）。** helper-only RED 独立验证通过仍不足以进入真实组件接线：须先冻结所有目标 G2 renderer 对 `undefined` 的合法/非法语义和适用范围，并让 4 个 SFC 案例具备能在真实 script-setup 控制流中观测 scope 发布/替换的确定测试 seam。达成后由独立 Validator 读取 RED 原始日志、Cases、runner/stub 摘要并确认身份，再签发绑定真实组件 action/target 的新 admission。未验证的浏览器渲染不在此处被冒充为通过。
- **轮次与范围：** 本交付物 `S02-F01-G2-STAGE-LIFECYCLE-OWNERSHIP` 第 **2/3** 轮。原 Goal 的 10 AC、26 must-have、16 项产品义务及 `Scope Delta: none` 保持不变；先界面 MVP、再复杂场景的用户授权只改变实施顺序，不减少验收义务。本轮不重开旧 Chart Filter Product Integration r003，也不把 ownership 单元进展升级为完整 stage、权限或 Goal 完成。

## 审查基线与方法

Review Card `S02-F01-G2-OWNERSHIP-DESIGN-REVIEW-r002` canonical SHA-256：`ec43ee6e6cb1ea37c0f0518336a660e7cf5709173732d8e7804844c48a580bec`；Card 校验与渲染通过。Context Bootstrap `ContextBootstrap-G2-OWNERSHIP-DESIGN-REVIEW-r002.json` 有 17 项 required-read、`skipped_reads=[]`，校验命令退出码为 0，`output_ref` 和 Card 写入范围都指向本报告。Topology `Topology-actual-r382.json` 绑定本轮 task。

被审 Design 为 `G2StageLifecycleOwnershipDesign-r002.md`，Cases 为 `G2StageLifecycleOwnershipCases-r002.json`。Cases `frozen_for_builder=true`，明确表示 immutable review candidate、不是 Builder approval；包含 G2OWN-001..023 共 23 个 helper 案例、G2OWN-C01..C04 四个 SFC control-flow 案例，以及有 stable owner 的 G2OWN-027 遗留项。卡片要求只写本报告。本轮未修改 Design、Cases、Goal 或源码，未运行生产 RED、runner、构建、lint、产品 UI、浏览器、数据库或权限服务。

静态复核了 r001 findings 与 r002 disposition；按 Cases identity 查看 arrange/oracle；沿 `ChartComponentG2Plot.vue` 的活动 G2 full-render、updateData/autoRefresh、generation、ResizeObserver/Carousel resize queue、unmount 及多个 `G2ChartView.drawChart` 空数据分支核对接线影响。源码抽样确认普通 line 外，bidirectional-bar、range/progress/bullet、area、treemap、radar、waterfall、stock-line、mix-group/dual-line、funnel、sankey、gauge/liquid 等实现中也存在合法条件下 `return`/返回 `undefined` 的路径；此差异对本轮显式 empty 合同有直接影响。

## r001 Findings 吸收状态

| r001 finding | r002 disposition | 本轮判断 |
|---|---|---|
| G2OWN-R001：生产 RED/受控缺陷 stub 两套说法未定 | **已修复** | 去掉“若 Skill 要求”分支，定义独立 RED 准备、production NOT_IMPLEMENTED stub、23 helper identities、准确的 runner command/fingerprint，并把主 Builder 延后到独立 Validator。仍须执行前取得精确 admission；组件 SFC RED 的可观察机制仍需补齐，见 G2OWN-R010。 |
| G2OWN-R002：18 Cases 未冻结且不可执行 | **helper 部分已修复** | 23 helper Cases 已 machine-arranged、精确事件 oracle、stable identity、runner ref 和 red fingerprint；4 个 SFC cases 有 arrange/assert，但 C01/C02 的 active scope 状态缺输入，且 C01 私有 state observation seam 未定义。 |
| G2OWN-R003：undefined 被错误当作 empty | **helper 已修复，组件适用范围未修复** | helper 对意外 undefined 抛 `G2_RENDER_INSTANCE_MISSING`，普通 line 有显式 empty discriminant；其他当前返回 undefined 的 G2 renderer 没有逐类型 empty 映射或切换旧路径合同，见 G2OWN-R009。 |
| G2OWN-R004：autoRefresh/resize/unmount 的 current identity 不清楚 | **大体修复，残余待验证** | 明确版本/scope/instance guard，C02/C03 覆盖 stale callback 和 resize queue/unmount；但自动化只写 `forceFit_started_then_unmount`，没有 full-render replace 交错或 autoRefresh/unmount 子例。已开始的 G2 库 forceFit 允许 settle，不能物理取消；这是明示边界，不宣称库内副作用被中止。 |
| G2OWN-R005：installer partial installation 可能泄漏 | **按授权记为后续 stage 遗留** | r002 把它连同 line partial allocation 记为 G2OWN-027，owner=后续 G2 stage product implementation、authority=CFPI-002。本 ownership 单元只保证已返回资源；此残余不阻断本 helper-only/returned-instance 有界实现，但继续阻断完整 stage failure cleanup。 |
| G2OWN-R006：renderer return 前创建资源可能泄漏 | **按授权记为后续 stage 遗留** | 同 G2OWN-027，未宣称修复或关闭；不能被本单元 READY 倒推为完整 renderer cleanup。 |
| G2OWN-R007：自动 dispose 错误不可观察 | **已修复** | ready/stale/empty results 携带 cleanupErrors；内部自动 dispose、replace/remove 通过唯一同步 callback 通知；failure 保留原异常身份并附 cleanup errors；G2OWN-020..023 增补路径。组件必须在手动 dispose 时观察返回值。 |
| G2OWN-R008：组件和实例资源 owner/顺序不清楚 | **大体修复** | 新增 resource→owner→replacement/unmount 表，明确 queue、timer、carousel、四个 adapter、G2 instance、observers 与非 G2 路径边界；C04 覆盖 cleanup failure 的 unmount finally。实际 SFC 路径仍待同身份测试验证。 |

## 已检查且通过的维度

- **目标、分母和范围：** MVP-first 仅改实施次序，原 10 AC、26 must-have、16 产品义务无删减；`Scope Delta` 明示为 implementation-order-only。ownership 仍只管理已返回 G2 instance 和已登记 disposer，不包括 Paste UI、hidden host、query/Store 事务或权限。
- **helper 结果类型：** `{kind:'instance'}`、`{kind:'empty'}`、意外 undefined failure 的概念已区分；普通 line 的空数据条件显式化，非空 line branch 返回 undefined 会失败，不再让缺实现静默伪装空态。
- **helper 案例：** 23 个固定 helper identity 覆盖 ready、开始/各 await 后 stale、explicit empty、create/setup/render/afterRender 错误、dispose 幂等/逆序、replace/remove 重入、关闭后登记、A/B scope 隔离、destroy/cleanup/notify 错误和意外 undefined。各案例含 arrange、event/error oracle、runner ref 和 NOT_IMPLEMENTED fingerprint，便于同 identity 验证。
- **RED 方案的 helper 半部：** 缺模块或编译失败明确是 execution error；RED 要求 23 个身份真正执行、0 execution errors、23 个目标 NOT_IMPLEMENTED 断言失败、稳定首 fingerprint。stub 只在生产 helper 模块与 helper-only runner 的 scope，不触碰活动组件；这是比 r001 更可复核的准备流程。
- **生命周期时效方向：** 统一 `isActive` 同时匹配版本、active scope、instance 和 closed；autoRefresh callback/await completion 与 resize enqueue/dequeue/forceFit 前后都有 guard。对运行中的库 `forceFit` 无法物理取消的事实有明确 claim ceiling。
- **手动 cleanup error：** helper 的自动路径、正常 dispose 和 notification throw 均纳入错误返回/通知设计，原始业务异常保持主异常引用，cleanup 继续执行。后续 implementation 必须按合同把 component full-render replace/unmount 的 `dispose()` 返回值接入可观察日志。
- **资源归属：** 组件 scheduler/queue、carousel 静态 registry、chart-scoped adapter、实例 destroy、component observers 和 L7/nonG2 instance 分属明确 owner。卡片与 Context 校验通过，且没有因真实权限缺失扩大阻塞到本单元。
- **明确遗留边界：** G2OWN-027 给 partial allocation 指派了后续 stage owner 和 CFPI-002 authority，保留 `OPEN / NOT_FIXED_BY_THIS_UNIT`；允许本 returned-resource ownership 单元在正确约束下独立发展，但不允许把遗留债务降为已关闭。

## 全量新发现

### G2OWN-R009 / P1 / OPEN：line-only empty adapter 不覆盖现有其它 G2 renderer 的合法 undefined 返回

**证据：** helper 新合同将所有 `create() => undefined` 作为 `G2_RENDER_INSTANCE_MISSING` failure；组件只在 `chart.type === 'line' && chart.data.data.length === 0` 显式映射 empty。设计又把 helper 接到活动 G2 full-render 公共入口，并称其他 G2 renderer 保持旧空态规则。静态源码中存在多个非 line 既有空态分支返回 `undefined`，例如 `bidirectional-bar.ts`、`range-bar.ts`、`progress-bar.ts`、`bullet-graph.ts`、`waterfall.ts`、`stock-line.ts`、`area.ts`、`treemap.ts`、`radar.ts`、`mix-group.ts`、`mix-dual-line.ts`、`funnel.ts`、`sankey.ts`、`gauge.ts`、`liquid.ts` 等。若这些分支进入 helper，将合法无实例状态错误标记为 missing-instance failure；若不进入，则必须说明它们如何在公共 renderG2 迁移时保留完整原有行为。

**需修订：** 给活动接线目标 G2 类型定义精确支持范围；按真实类型/数据条件把合法 empty 转成显式 `{kind:'empty'}`，或把不迁移类型留在明示的 legacy branch 并证实 full-render 公共入口兼容。对非空条件下的错误 undefined 仍 fail closed。为代表性 mix、双向/特殊图表和普通图表添加 empty 与 unexpected undefined 案例；不能用 `chart.type === 'line'` 的一个判定代表所有 G2。

### G2OWN-R010 / P1 / OPEN：四个 SFC case 的 arrange 与实际私有状态观察合同不完整

**证据：** helper Cases 已足够细化，但 component case `G2OWN-C01` 需要断言 `myChart` 在 ready 前不发布、ready 后 scope/instance 匹配、旧 scope destroy 一次；其 arrange 只有 deferred create/render/afterRender，没有预设的 old scope/instance ID。`G2OWN-C02` 要断言 new scope untouched，但没有安排新 scope identity；`G2OWN-C04` 的 `cleanup_throws:true` 未指定抛错资源 ID和预期错误投影。Design 说编译并执行真实 `<script setup>`，通过 chartView/Store/observer/timer doubles 驱动，但没有给出测试如何观察私有 `myChart/activeG2Scope`、如何注入真实组件目前静态导入的依赖、如何保持 RED 与 GREEN 使用同一个 SFC/runner identity。单靠 `HELPER_NOT_CONNECTED` 字符串或源码搜索已被禁止；目前没有能复现该 baseline fingerprint 的明确行为断言与观测点。

**需修订：** 为 C01/C02/C04 增加 old/new instance/scope IDs、初始 active owner、事件序列和 cleanup error identity；说明实际 SFC control-flow runner 如何仅通过受控 module doubles/无语义 AST instrumentation 或公开可观察副作用驱动依赖并读取发布边界，不复制 `renderG2`，不以源码字符串匹配代替。固定 C01 baseline 的行为失败断言如何映射为 `G2OWN-C01: HELPER_NOT_CONNECTED`，并证明同一 runner/identity 在接线后能转为 GREEN。若这些组件案例技术上需不同 harness，应在 Case/runner contract 中显式分层。

### G2OWN-R011 / P2 / OPEN：活动 scope 的手动 dispose error 没有覆盖 full-render replace 的观测断言

**证据：** r002 已规定普通 ready 后调用 `scope.dispose()` 由调用者读取返回错误、helper 不重复 callback；资源表要求 full-render replacement 和 unmount 都 dispose 当前 scope。C04 只覆盖 unmount cleanup failure，且 assertion 聚焦 timer/schedule、carousel/queue、observer finally、pending instance disposal；没有验证 full-render replacement 时 old scope cleanup error 是否被组件接收/记录并继续创建新 attempt，也没有校验其日志/observable error identity。因此 helper 端错误输出虽然修复，真实接线仍可能把 `dispose()` 返回值丢弃。

**需修订：** 在 C04 或独立组件 case 中分别覆盖 full-render replace 与 unmount 两条 ready-scope cleanup-error 路径；断言旧 cleanup error 可观察、剩余 cleanup/destroy 继续、observer 和下一代 attempt 不被旧错误阻断，且不会重复 callback。

## 未检查项与原因

- 没有执行 23 helper RED、4 个组件 RED、任何 GREEN、定向 lint、SFC 编译或构建；Card 是只读设计审查，不能把固定命令和规则写成已执行证据。
- 未运行实际 G2 浏览器 line、area/mix/特殊图表、tooltip/legend/slider/assist、resize、full-render 替换和 unmount。已知环境没有 Playwright/Chromium cache，且不允许为本审查安装；后续可按既定计划通过已有 CUA 浏览器打开独立 Vite 测试页，不连接后端/数据库。该 browser plan 是未来验证路径，不是当前通过。
- 没有验证 `forceFit` 已在 G2 library 内部启动后的物理终止行为；Design 明确只能保证 settle 后没有应用侧后续 options/forceFit/replay 调用。本轮只审阅其声明，不将其扩写为 cancel guarantee。
- 未验证 G2OWN-027 的 line drawChart/adapter 在 return/disposer 返回前 partial allocation；该义务由后续 stage product implementation 负责，当前仍 OPEN。此遗留不阻断本单元 returned-resource helper RED preparation；它继续阻止完整 stage failure cleanup 与相关产品验收。
- 未检查 Copy/Paste、source READ、真实权限、query staging、Store commit 或完整 S02；它们明确不是本单元证据域。真实权限仍 `BLOCKED / NOT_RUN`，本 Review 不扩大或解除该阻塞。

## 准入预测与下一步

1. **可单独开展 RED 准备：** 新建并验证精确 execution admission，将 action/target 限于 helper NOT_IMPLEMENTED stub、`check.mjs` 和 frozen helper fixtures；不改组件。运行 fixed command，只有 contract valid、23 helper cases executed、23 expected NOT_IMPLEMENTED assertion failures、0 execution errors 和 exact first fingerprint 均成立才可冻结可信 RED evidence。对缺模块、构建/import failure 或不同错误一律记 execution error，不算 RED。RED 准备完成后由独立 Validator 检查原始 stdout/stderr/exitcode、stub/runner/Cases 摘要与稳定身份。
2. **主 Builder 暂不开始真实 SFC 接线：** 在新一版实现输入中解决 G2OWN-R009（支持所有目标类型的 empty mapping 或把范围明示限定），细化 G2OWN-C01..C04 的 arrange/oracle 与 SFC 私有状态观测机制，补 full-render replacement cleanup-error case。经 Design Freeze 与 independent RED Validator 通过后，再为 helper替换 stub及 `ChartComponentG2Plot.vue` 接线签发新的精确 source/component admission；Builder 不得改 Cases、runner oracle 或 G2OWN-027 disposition。
3. **完成后的 claim 仍有边界：** 23/23 helper GREEN 加 4/4真实SFC control-flow GREEN、ESLint/SFC编译和真实 G2浏览器核验按证据分别报告。即使 returned-resource helper candidate 通过，仍不证明 G2OWN-027 partial-allocation、双 host stage、query/Store atomic commit、source-read 权限或完整 S02。

## 最终裁定

r002 已修复 r001 中生产 RED 流程、helper Cases 冻结与 oracle、显式 undefined failure、当前 scope guards、cleanup error channel、资源归属表等主要问题；r001 的 adapter/renderer return 前 partial allocation 被明确保留给后续 stage owner，并不会被本单元冒充已解决，也不作为 returned-instance helper RED preparation 的 blocker。新的 G2OWN-R009..R011 仍影响真实 G2 全量渲染兼容、组件 Case 可复核性和 cleanup error 接线。故本轮结论为 **Design Freeze `NEEDS_REVISION`；RED Preparation Entry `READY_WITH_CONDITIONS / EXECUTION_ADMISSION_REQUIRED`；Main Builder Entry `BLOCKED / NOT_READY`，修复并通过独立 RED 验证后再 conditional admission**。不修改 Goal 原验收分母，不声明 runtime、stage、权限或完整 S02 Goal 达成。
