# G2 Stage Lifecycle Ownership Design 独立评审 r001

## 双 verdict

- **Design Freeze Validity：`NEEDS_REVISION`。** 以实例为单位管理 G2 scope、逆序清理、迟到/卸载后释放、空结果显式建模的方向符合当前真实 `ChartComponentG2Plot.vue` 生命周期，也没有把 ownership helper 冒充成产品 Paste/Store 事务。但预构建 RED 方案未裁定为可执行且可信的唯一流程；Cases 虽列出 18 个身份，尚未冻结且主要是自然语言期望，缺少足以直接驱动 runner 的输入、事件期望与组件集成案例；`undefined` 被无条件归为空结果，autoRefresh/resize 队列和适配器安装中途失败的所有权缺口也未被案例充分覆盖。
- **Bounded Ownership Builder Entry：`BLOCKED / NOT_READY`。** 阻塞原因是本交付物自己的 ERBE 准入材料尚不完整：缺少确定的可信生产 RED、冻结且可执行的 Cases，以及可复核的 runner/真实组件接线验证计划。此 verdict **不是**因为真实 source-read 权限环境缺失；本单元不读取权限、不操作 clipboard、不实现 query 或 Store 事务，可在补齐本单元准入证据后独立进入有界 Builder。此单元通过也不能解除产品 source-read、stage/query/Store 事务或完整 S02 的其他阻塞。
- **轮次与范围：** 本交付物 `S02-F01-G2-STAGE-LIFECYCLE-OWNERSHIP` 第 **1/3** 轮。Goal 原分母为 10 AC、26 must-have、16 项产品义务，`Scope Delta: none`；用户授权先交付界面 MVP、随后补复杂场景，完整验收不减。本轮只评审 G2 实例 ownership helper 与现有活动 G2 full-render/autoRefresh/unmount 接线，不重开已达 3/3 的 Chart Filter Product Integration r003，也不替代其余 Goal 单元。
- **声明上限：** 本报告不证明 helper 已实现或运行，不证明浏览器 G2、tooltip/legend/resize、产品 UI、权限、Copy/Paste、query staging、Store 一次性提交、MVP 验收或完整 Goal 达成。

## 审查基线与方法

Review Card `S02-F01-G2-OWNERSHIP-DESIGN-REVIEW-r001` 的 canonical SHA-256 为 `e302c2a68d7c6e15ff20e35b3c548cd7a0a640741a89eb1a9bfb09f54b05835a`，`lane_task_card.py validate` 通过。Context Bootstrap 为 `ContextBootstrap-G2-OWNERSHIP-DESIGN-REVIEW-r001.json`，16 项 required-read、`skipped_reads=[]`，校验命令退出码为 0；`output_ref` 与 Card 写入范围一致。Topology 为 `Topology-actual-r381.json`，绑定本轮 review task。

Design SHA-256：`92724e39eddb9d4b8ee27d70f26376f264678bc47730f3c152db72fbc3aca313`；Cases SHA-256：`8a43df1f6c54f31705570acf99d88ce60c254992d9a45f765e4c19636fbe7198`。Goal SHA-256：`28c94d3c35d4ce0a891ce77ecc915932d67f88ef813f3d2815dc0dce11f91b64`。

静态沿真实 full render 的 `drawChart → 公共 G2 hooks → render → afterRender → slider/legend adapter → linkage replay`、已有 `g2RenderQueue/g2RenderVersion`、局部 `updateData`、ResizeObserver 的 forceFit 队列、onBeforeUnmount 及 line renderer 返回实例前所创建的 carousel/legend/event 状态核对。Cases 中 G2OWN-001..018 均存在；另有 5 条 integration obligations 和 not-proven 列表。本轮按 Card 只读要求没有修改 Design、Cases、Goal、源码，也没有运行构建、单元 runner、数据库、产品 UI 或浏览器。

## 已检查且方向成立的内容

- **本单元边界清楚：** helper 仅管理已知 G2 实例和 adapter cleanup；不建 hidden stage host、不查询、不读写 clipboard、不提交 Store。即使 ownership 单元最终通过，也不能折叠成 product stage 或 atomic commit 已通过。
- **真实主生命周期被正确识别：** 当前 `renderG2` 在共享串行队列中 full render 前销毁旧实例，按顺序安装主题/tooltip/large-data/tiled legend/assist hooks，等待 `render()` 与 `afterRender()`，最后安装 slider/pagination 并回放联动；autoRefresh 可走 `updateData()` 局部更新；unmount 负责使 generation 失效、清 timer/队列、释放 carousel/adapter/实例及 observers。Design 将现有四个 G2 adapter disposer 分别归到实例 scope，方向可行。
- **helper 核心规则大体具体：** `isCurrent` 在创建前及异步阶段复核；实例不在 ready 前发布；cleanup key 替换、重入 remove、逆序 dispose、dispose 幂等、cleanup/destroy 异常继续清理等均给出可实现规则。G2OWN-001..018 对 success、stale、undefined、create/setup/render/afterRender 失败、重复 dispose、cleanup 异常、替换/remove/re-enter、关闭后登记、尝试隔离及 destroy 异常有覆盖。
- **空数据与旧 UI 的处理方向合理：** line renderer 对 `!chart.data?.data?.length` 返回 `undefined`；把合法空数据表达为 `status: empty`，不误报 ready、不查询或保存，并保留现有空态 UI，避免把“没有 G2Chart 实例”当成成功实例。
- **已知声明限制有记录：** renderer 在返回 G2 实例之前创建对象后若中途抛错，helper 无法销毁未交付的句柄；Design 已承认这一边界，没有谎称当前 helper 能修复 renderer 内部的 partial-construction leak。
- **真实权限阻塞未被错误扩大：** 本单元不含 source-read、权限判断或权限数据；不得因真实多用户权限环境缺失而暂停这项 ownership helper，也不得把它的通过升级为权限或完整产品准入。

## 全量 Findings

### G2OWN-R001 / P1 / OPEN：生产 RED 的执行对象和先后顺序未定，受控缺陷 stub 不能替代目标 RED

**证据：** Design 先说缺模块只能记 `MODULE_NOT_IMPLEMENTED`、不算可信 RED；接着计划用“同一公开 API 的受控缺陷 stub”确认 18 cases 以预期 fingerprint 失败，并称其为后补 control；然后又写“若 Skill 要求可执行生产 RED”，才安排带 `NOT_IMPLEMENTED` 的生产 stub 与 admission。该语气把是否需要可信生产 RED 留给 Builder 临场解释。受控缺陷 stub 只能证明 runner 能检测该特定故障，不能证明 18 项冻结案例确实消费生产模块、在目标实现缺失时按预期失败；缺模块导致 compile/import failure 也已被正确排除。

**需修订：** 在 Builder 前指定唯一流程：契约有效、runner 成功执行同一 G2OWN identity，实际导入生产模块；生产入口为明确 `NOT_IMPLEMENTED` 的最小 stub 时，全部预期断言失败并记录稳定 fingerprint，随后同 identity GREEN。该 stub 如需写源码，必须先有绑定其 action/target 的精确 admission；这一步应作为独立的 RED 准备动作管理，不能把 admission 需求悬空在 Builder 开始之后。受控缺陷 stub 可另作 runner negative control，但单独标明不构成生产 RED。补充 runner 命令、失败 fingerprint 和结果存档位置。

### G2OWN-R002 / P1 / OPEN：18 案例尚未冻结，也不是可直接执行的细粒度 oracle

**证据：** Cases 声明 `frozen_for_builder: false`，而 Design 称其为“冻结机器 Cases”；身份表里大多只有标题和一句自然语言 `expected`。文件没有每案的 `arrange/input`、受控 deferred promise/generation 变化、事件序列、实例/cleanup identity、断言清单或 runner 引用；同一文字可被 runner 实现成不同 oracle。5 条 `integration_obligations` 是字符串型检查项，不是绑定真实组件行为的独立案例。G2OWN-017 证明 helper scope A/B 隔离，也不证明 Vue 组件全局 `activeG2Scope/myChart` 切换、autoRefresh 或 unmount 接线隔离。

**需修订：** 按 G2OWN-001..018 保留稳定身份，但为每案编码或引用明确的初始输入、Deferred 时序、调用事件、调用次数、实例 identity、cleanup 顺序/错误与最终状态；标记 cases frozen revision/digest。增加真实组件接线层面的 focused checks：full-render 调用 helper且 ready 前不发布、旧 scope 与新 scope 交接、autoRefresh 更新当前实例、unmount 在 pending create/render 后自清理并断开组件级 observers/queues、非 G2 分支无回归。标出自动 runner 与必须通过实际浏览器确认的项目。完成前不得宣称 ERBE Cases 已冻结或开始 Builder。

### G2OWN-R003 / P1 / OPEN：`create() => undefined` 被过宽地折叠为空数据

**证据：** Design 的通用 helper 把 `create` 返回 `undefined` 统一映射为 `{status:'empty'}`；真实 line `drawChart` 的确在 `chart.data.data` 为空时返回 undefined，但 helper 又接入 `ChartComponentG2Plot` 的 G2 全量渲染入口，未来同入口的任一 `drawChart` 也可能因意外未返回实例、被取消或实现错误返回 undefined。当前结果会把故障包装成合法空态，吞掉可观测异常，且 `create` API 没有携带可核验的 empty reason。

**需修订：** 把空态做成显式 discriminated outcome（例如 create callback 返回 `{kind:'empty'}` 或 `{kind:'instance', instance}`），或把空态判定作为由调用者提供且可测试的 predicate；普通 `undefined`/无实例应落入定义的失败路径。仅当真实 line empty predicate 成立时保留现有空 UI。Cases 分别覆盖明确 empty 与意外 undefined。

### G2OWN-R004 / P1 / OPEN：真实组件接线的 current-scope 身份及生命周期竞争未形成完整契约

**证据：** 设计写明 autoRefresh 只能替换“当前 `activeG2Scope` 的 assist disposer”，但没有完整说明在 `updateData()` await 期间发生新 generation、unmount 或当前实例替换时如何禁止旧回调再安装/替换 disposer。当前源码回调直接引用共享 `myChart`；future wiring 必须固定当前 scope instance 并在 await/回调边界核对 generation/identity。另一方面，ResizeObserver 的 forceFit task 被放入 `G2TooltipCarousel` 的共享 resize queue；`dequeueResize(containerId)` 只删除尚未开始的队列项，已出队并正在 `await forceFit()` 的任务不可取消。Unmount 同步 dispose 图表后，该 task 仍可能在旧实例上继续执行。

**需修订：** 明确所有回调捕获 scope-local `instance`，对每个 await 后、替换 disposer 前和 linkage replay 前核对 scope/current generation；unmount 需让已出队异步 resize 任务失效，并保证销毁后不再对实例调用 options/forceFit/replay。G2 cases 加 autoRefresh pending→新 render/unmount 与 resize pending/queued→unmount 的交错场景。组件内 generation 只证明当前活动 renderer 生命周期，不拓展为产品 query-stage transaction。

### G2OWN-R005 / P1 / OPEN：adapter 安装只在返回 disposer 后登记，安装中途抛错会泄漏部分资源

**证据：** 真实 `installG2TiledLegendStateAdapter` 在返回 disposer 前已经创建 `ResizeObserver`、注册多个 chart handlers 并执行 `syncSvgLayout()`；`installG2SideLegendPaginationAdapter` 也先注册多类 handlers，再改写 Navigator 方法，最后才返回 disposer。Design 仅说“adapter 返回的 disposer 登记为 scope key”。如果 installer 在副作用建立后、返回 disposer 前抛错，helper 看不到尚未返回的 disposer，setup 失败时只能清理此前登记项；新 scope 的 partial adapter 资源仍可能残留。G2OWN-009 的普通 setup throw 没有具体覆盖“installer 部分安装后 throw”。

**需修订：** 要求每个 installer 自身具有异常安全的 try/finally 回滚（安装失败时撤销已绑定 listener、ResizeObserver 与 Navigator patch 后再抛原异常），或改为先建立可调用的 rollback handle、逐步登记再安装。为至少一个具有多步副作用的现有 adapter 加部分安装后抛错的可信 RED/回归案例，并确认后续 cleanup 仍只执行一次。

### G2OWN-R006 / P1 / OPEN：`drawChart` 在返回实例前建出的资源仍可能失去所有权

**证据：** Design 主目标称迟到、卸载、渲染失败会可靠释放，但又把 `new G2Chart` 后、return 前抛错导致的泄漏留给后续 stage。当前 `Line.drawChart` 在返回前先创建 G2 实例，随后绑定 line legend state、配置 options、注册 point handler、建立 `G2TooltipCarousel`、调用 extremum 事件设置，最后才 return。若中途异常，helper 的 `create` 只看到 reject，无法 destroy 这个尚未返回的实例；按 container 清 Carousel 也不能替代销毁 G2 对象及其内部 handlers。Cases G2OWN-008 只验证无实例 destroy 的 create reject，没有记录这个真实 renderer 已部分分配资源的边界。

**需修订：** 将当前交付物的实现声明收窄为“只对 create 已返回的 instance 及显式登记资源提供所有权”，禁止据此称完整 renderer failure cleanup 已可靠；同时把 line renderer partial construction 作为有稳定 owner 的后续实现义务，明确如何在 renderer 内部失败时 destroy 实例/清 listener。对本单元允许进入 Builder 的具体目标类型及 failure claim ceiling 作出书面限定，并补一条记录当前 known leak 不被此 helper覆盖的案例/残余风险。不得让该残余被之后的 stage 集成当成已解决。

### G2OWN-R007 / P2 / OPEN：内部 stale/error 自动 dispose 的 cleanup errors 无确定出口

**证据：** `scope.dispose()` 可返回 cleanup/destroy 错误数组，G2OWN-013、018 仅测试直接 dispose 的返回值。但 helper 在 create/render/afterRender 异常或 stale 路径会自行 dispose，再 reject 原异常或返回 `{status:'stale'}`；该结果既不含 dispose errors，也没有指定 hook/日志事件。组件 catch 当前只会记录 `renderG2Plot error`，无法看到这些自动释放失败。与“原异常保持 reject”兼容并不要求静默丢弃 cleanup failure。

**需修订：** 定义成功返回、stale 返回、原始失败三类中的 cleanup error 观察方式：例如把 disposal errors 作为结果字段，或通过唯一 `onDisposeErrors` callback 上报；同时保留原业务异常为主错误。为 stale/error 自动 dispose 中 cleanup 失败的路径增加案例，断言所有后续 cleanup/destroy 都执行且错误能被调用者观测。

### G2OWN-R008 / P2 / OPEN：组件级 timer、carousel queue 与 observer 清理不够细化

**证据：** 真实 unmount 同时取消 `g2Timer`、完成 debounce schedule、清 `g2ResizeTimer`、`dequeueResize(containerId)`、destroy carousel、清 adapter、destroy instance 并 disconnect ResizeObserver/IntersectionObserver。Design 将部分职责放入 scope `initialCleanups`、部分留在 component unmount，但没有定义每项归属、执行顺序与失败隔离；尤其 resize queue 正在执行时无法由 dequeue 撤销（见 R004）。Carousel 的 static container registry、其自身 IntersectionObserver/timers 与 chart destroy 是两套资源，需要保留现有清理次序与重复调用幂等性。

**需修订：** 做一张资源→owner→cleanup 触发点映射，列出组件级与 chart-instance 级资源；定义 full-render 替换与 unmount 两条路径分别清理什么、顺序如何、哪些重复调用允许；Observer disconnect 应在图表 dispose 报错后仍通过 finally 执行。补组件生命周期案例验证 timer、carousel、queue、resize/intersection observer 与实例不会遗漏或重复清理。

## 未检查项与原因

- 未运行 18 案例 runner、构建或定向 lint；Review Card 明确为只读审查，且当前 Design/Cases 不提供已确定的 runner 命令/入口。
- 未运行实际 G2 line、tooltip、tiled/side legend、slider、assist-line、resize 与 Vue unmount 浏览器行为；这是 Card 禁止范围。后续按维护者给定环境计划，可由 CUA 浏览器打开独立 Vite 测试页进行真实 renderer 核验，不连接后端或数据库；当前未形成任何通过证据。已知本地 7070/8100 未监听、无 Playwright/Chromium cache 且不得为此安装依赖，进一步限制自动化浏览器验证。
- 未验证 Copy/Paste、hidden host、query/store 事务、source-read/真实权限或完整 MVP；它们被本交付物明确排除，产品权限仍按既有状态 `BLOCKED / NOT_RUN`。
- 未检查未来 `G2StageLifecycleOwnership` 消费者在多个真实 host/组件之间的交接；本单元只接现有活动 G2 renderer，不创建 stage host。

## 修复后准入预测

本交付物当前为第 1/3 轮，允许在本交付物自身最多三轮内收敛；不影响 S02 内其他独立交付物的各自轮次。下一版应一次完成：冻结可执行 Cases 与 stable digest/runner；绑定生产目标的可信 RED 流程及精确 admission；把 empty 与 unexpected undefined 区分；固定 autoRefresh/resize/unmount 的 scope identity 和失效顺序；保证多步 adapter installer 异常回滚；给内部自动 dispose errors 可观测出口；映射 component 与 chart scope 全部资源 owner；收窄 renderer partial-construction failure 的本单元声明并保留后续责任。

这些设计问题修复并由下一轮审查通过后，可预测进入**有界 ownership helper Builder**，限于新 helper 和 `ChartComponentG2Plot.vue` 活动 full-render/autoRefresh/unmount 接线及其 focused tests；验证顺序为可信 RED → 同 identity GREEN → 定向 lint/类型或组件编译 → 真实接线证据。只有与目标 scope 相称的测试结果可以宣称 candidate。即使如此，实际 G2 浏览器样式、stage host、query/store atomic commit、source-read 权限和完整 S02 Goal 仍分别需要自己的验证/准入，不得推导完成。

## 最终裁定

本交付物的 ownership helper 主体规则和当前 G2 活动 full-render 接线方向具备明确基础；本轮也未发现需要因 RT-AUTH 缺失而阻断这项独立单元。仍有 8 项 finding 涉及可信 RED、案例可执行性、空结果与错误的区分、生产接线竞态/adapter 部分安装、renderer 部分构造、cleanup 错误传递及资源 owner 清单。因此 r001 结论为 **Design Freeze Validity `NEEDS_REVISION`、Bounded Ownership Builder Entry `BLOCKED / NOT_READY`**。这不改变 S02 Goal 原验收分母，不解除任何产品权限/事务/整体验收阻塞，也不声明本单元已经实现。
