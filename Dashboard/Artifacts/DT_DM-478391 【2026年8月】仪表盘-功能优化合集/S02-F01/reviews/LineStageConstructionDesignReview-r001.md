# 普通折线构造阶段所有权设计独立审查 r001

## 三项裁定

- **合同冻结：`NEEDS_REVISION`（需修订）。** 资源所有权、异常与错误通道的设计方向可实现；但 LSC-042/045 的精确释放轨迹遗漏真实 start 产生的 timer，部分 owner/queue 案例的启动与 cooldown 初态不完整。当前 55 Cases 不能整体冻结为唯一执行 oracle。
- **真实 module RED runner 准备：`CONDITIONAL_ENTRY`（有条件入口）。** 可在修复下列两项、冻结 Cases 身份并取得只限新增 runner/具名 doubles 的精确 Card/Context/admission 后准备；当前不应把候选 55 例直接记为已冻结或可信 RED。若先做模块导入/编译诊断，须保持诊断身份，不写生产源码、不算合同 RED。
- **生产 source Builder：`NOT_READY`（尚未具备准入条件）。** 没有已独立确认的真实模块 RED，也没有本生产变更对应的精确 admission；本 Review 不授予修改 line/Carousel 的生产入口。

这是新交付物 `S02-F01-LINE-STAGE-CONSTRUCTION-OWNERSHIP` 第 **1/3** 轮完整审查。两项修订均属于当前候选 oracle/fixture 的有限修正，不需要另建架构或重开旧 r003；修订合并后一次复核即可。原 10 Goal AC / 26 must-have / 16 产品义务保持；本报告不证明实现、MVP、stage/query/Store、保存重开、真实权限或 Goal 完成。

## 身份、输入与检查方式

Reviewer/source：`/root/g2_closeout_reviewer`，不是本 Design/Cases 的作者，也未改被审源码或测试。曾撰写前一个独立工程收尾报告；该既有报告在这里仅作已验证边界输入，不能替代本新设计的独立判断。本轮唯一仓库写入为本报告。

接收端 canonical Card `923abc2b6a711121dc93b03634c7aa94541ad6a984f1dbe2145e61fa3e2fcce7` 验证 pass；Context `0c26024951835a800b44dea55321d8d95dfd859f99998dfeaa2b7ebfc257d876` 验证退出 0，18 项 required-read 摘要全匹配；Cases 内额外列出的 20 项 source_refs 也逐项匹配，无 source drift。

| 冻结前输入 | 实际 SHA-256 |
|---|---|
| [Design r001](../LineStageConstructionDesign-r001.md) | `a4b257f36ca9fbcfbd7d25aa1f68a7a6941d8b856613ccadc60090baccbb6b90` |
| [Cases r001](../LineStageConstructionCases-r001.json) | `570fa5a5d533fe2865c21b3d3714372cf018e5059444994aee63c2d3d8b12443` |
| cases 数组 canonical（UTF-8、sort_keys、紧凑 JSON） | `0c442afccad98e7b6faf263f600a9c0eb9fa9f4902bce563d94f89e915732db0` |

读取 Goal/先 MVP 授权、既有 ownership Design/Cases/独立收尾、真实 Line/Carousel/common、area、extremum、G2 基类和全部 new/destroy/static 调用点。JSON 解析成功；LSC-001..055 连续且唯一，55 项 cleanup_counts 与各自完整 trace 的次数逐项一致，chart_destroy_count 与 trace 一致。该结构检查没有替代后述源码语义检查。

额外做了一次**不落文件的诊断**：用已安装 esbuild 在内存转换完整当前 Carousel.ts，以显式 DOM/Chart/Observer/timer doubles 执行真实 constructor/start；没有摘录方法、改生产函数、安装依赖或启动服务。它只核实下列 timer 源码路径，非正式 runner、非 RED，也不计入 55 例验收。

## 全部阻断发现

### LSCD-001 / P2 / OPEN：柱图及含柱组合图的 start timer 未进入精确 oracle

**位置：** Cases LSC-042（3444 行起）、LSC-045（3756 行起）；Design 第 55、69 行；[Carousel.ts:715](../../../../../core/core-frontend/src/views/chart/components/js/G2TooltipCarousel.ts#L715)。

两例承诺运行真实健康 start，初次构造 `isFirstColumnFrameReady=false`；`waitForRenderedElements()` 对 bar 和 chart-mix 即使已有合法 interval 图元，也会先分配 160ms 的 `timers.nextItem`，随后 `drainStartQueue` 再取得 40ms 的 TQ。当前 Cases 只列 TQ，exact cleanup trace 不包含 nextItem 的 clear，也没有安排推进/结束该 timer 或先前首帧完成状态。若按完整实际 start 执行，正确释放会多一次 timer.clear，和冻结 oracle 冲突；删除这次释放则产生真实剩余资源。

内存真实模块诊断独立观察：line 只有 40ms TQ；bar 与 chart-mix 均为 `timers.nextItem=1`（160ms）及 `startQueueTimer=2`（40ms），证明合法数据本身不会消除首帧 timer。两个正式候选场景仍未执行。

**最小修订：** 为两例显式记录该 timer 的句柄、取得状态、释放顺序与最终 timer registry，或提供精确 fake-clock 推进步骤和推进后所有新增 timer/RAF 的完整 ledger。不能将私有首帧字段偷偷设为已完成、替换 waitForRenderedElements，或用无图元数据绕过正常路径。修订只完善兼容控制，不改变正常 start 语义。

### LSCD-002 / P2 / OPEN：共享队列与重入案例缺少决定期望值的启动/cooldown 初态

**位置：** Cases LSC-038（3034 行起）、LSC-040（3227 行起）、LSC-053（4564 行起），同类核对 LSC-037/052；Design 第 43–49、69 行；[Carousel.ts:277](../../../../../core/core-frontend/src/views/chart/components/js/G2TooltipCarousel.ts#L277)。

LSC-038 以 `tooltip:hide` 同步重入 `construct_and_start_C_new_same_H`，期望保留 `queue:C_new`；但 fixture 没给 Cold 曾进入有效 start 的状态、已有 TQ 或其它 drain blocker，也没有 fake-clock 步骤。按设计“未有效 start 不做 UI restore”，未启动 Cold 不会触发此重入；若 Cnew 在无 cooldown 的默认状态 start，生产 drain 会立即 shift 它并执行 next，产生新 TQ，而不是将它留在 queue。要得到当前 oracle 必须由 runner 另行猜测一个未记账的 Cold cooldown/阻塞状态。

LSC-040/053 也断言销毁时的 tooltip/UI restore，未像 LSC-032/042 等例显式给 `start_before_dispose`。LSC-053 虽列共享 TQ 和另一 owner，却未规定谁取得 TQ、C/Cother 谁已开始/谁正在排队、clock 是否推进；`preserve_exact`只列 TQ/Cother/pageScrollListener，没有精确 other queue 状态。因而它不能唯一验证“仅移除自己，保留其它 owner 的共享 cooldown”。LSC-037 对 `queue:C_new` 的预置方式、LSC-052 旧 owner 是否尚未 start 也应同次写清，避免测试器按场景名秘密补初态。

**最小修订：** 显式列出每个 owner 的 constructed/started/paused/destroyed/cache identity、初始 startQueue 顺序、TQ 的创建者/句柄及 clock 状态；重入新实例的 Chart/host/wrapper/observer 使用独立具名身份；断言新 owner 完整 queue/timer/cache/视觉状态。对 LSC-038 选择并固定“旧 TQ 保持，新 Cnew 排队”或“无 TQ，新 Cnew 即时启动”的一种真实流程，随之对齐 exact trace。这里不要求新增状态机；只是把已承诺的 oracle 初态完整写出。

## 已检查且无新增阻断的维度

| 维度 | 核查结论及适用边界 |
|---|---|
| Line owner 与 constructor partial cleanup | G2 handle 返回后进入 try、直接保存 Carousel、构造失败由 this 自清理、line 再 destroy G2、原业务 throw 保真，可实现。禁止按 container 再查找清理能避免误删新 owner；第三方构造尚无 handle 的内部资源明确不承诺。 |
| safe 初始化与惰性 new 语义 | 基础字段先初始化、eligibility 前后正常顺序、disabled/no-host 的 new 返回 this、start identity no-op、空账本安全，可兼容现有调用。LSC-028..031/050 有相应场景。 |
| captured target / observer | add 前登记 target/event/handler/capture 意图；W_old/W_new 身份固定；Observer 得到 handle 后 observe 才能断开；add/observe 生效后抛错的路径有案例，未把无句柄异常算可清理。 |
| 消费与重入次序 | own flags/listener/frame/timer/cancel/background/observer 可在入口同时取快照并清空，cache 以 identity摘除，再调用 queue/cancel 等外部动作。全局引用可在尾部独立释放前消费，和 own 状态在首 primitive 前为空不矛盾。Map cache detach 是本地所有权变更，首个外部 cleanup 可由 dequeueStart 定位；runner应按此阶段观察，不能把 snapshot 时点挪到释放后。 |
| cache/new owner 与共享视觉 | 每步前检查 cache 当前 owner、旧直接对象继续释放、旧 tail 不按 container 删除，足以实现 LSC-037..039 的安全意图。真实 public restoreHover 路径也必须消费“不切换新 wrapper”的既有约束；不可仅保留无条件 switch 语句。LSC-054 的正常成功路径仍保留。 |
| 全局 scroll/queue/timer | cache 非空保留共享资源，最后 owner 时先消费 ready/timer/queue再 remove/clear，原则可实现。不会把 SFC resizeQueue 当 Carousel 自己资源清除。当前问题是 LSCD-002 的输入/观测不全，并非该资源模型不可实现。 |
| 错误通道 | raw 值、原业务对象/非 Error、public void destroy 首错 throw、其余 warn、constructor/line 消费首错后 warn、G2 destroy 另通道，顺序可实现；LSC-034/035/047/048/055 对多错/同对象多 occurrence 明确，不用 Set 去重。logger 自身失败 best effort 不遮蔽原错。 |
| 尽力清理与物理残余 | consume-before-call、逐项 attempt 与多次 destroy no-op 可实现；LSC-036 清楚保留 G2 destroy throw-before-effect 的未释放资源，没有将“调用次数=1”误称物理销毁成功。 |
| 真实 module seam | 全量 TS→CJS/具名 allowlist、真实 Line/Carousel/common 控制流、仅配置/渲染库边界 double 与三个透明观察 spy，技术路线可执行。已安装 esbuild可用；未知模块/export/编译失败必须 execution_error。LSC-001 当前 setupOptions 抛错后无 catch，确有可观察 destroy=0 的预期 RED 触发点，但尚未独立取得正式 RED。 |
| 全部调用方兼容 | 实际检索确认 10 个 new 入口及 SFC/common_antv 的 destroyByContainer、G2 updateData、fullscreen/layer/de-screen/放大视图 static callers；都不消费 destroy 返回值。只改 line 与共用 Carousel 是有意范围，不提升其它 renderer 的 G2 rollback。area/bar/pie/mix 控制要按 LSCD-001 校正。 |
| 权威/预算/声明 | 10/26/16、真实权限 BLOCKED/NOT_RUN、旧 r003 的残余和 G2OWN-027 后续范围保持；新工程交付物不同于旧产品/事务重审。没有把本设计称 stage、MVP或 Goal完成。 |

## 非阻断提示、未检查及同类残余

**LSCD-N001 / NON_BLOCKING：** LSC-039 的 `E_OWNER_REPLACED`在生产 guard 内创建。runner 必须把其 code/class 及未包装观察与外部传入 E 的引用断言分开；不能把最终 caught 对象直接赋作 expected 原引用后声称证明了 constructor 内部原对象一致性。可由已授权的具名 Error 构造观察方案或独立源码检查补足，RED Validation应明确证据层；此点不要求改生产公共契约或新增运行时测试开关。

未执行正式 55-case runner（它当前未创建）、可信 RED/GREEN、生产实现、浏览器、整包 build/ts:check 或数据库/权限调用。本轮仅设计/Cases审查和小范围真实模块内存诊断；没有把诊断算 RED。未穷举任意第三方 ctor/destroy、任意无限重入或所有后续异步回调的硬中止，它们超出当前明确合同；不作为追加 blocker。

同类残余保留：其它 renderer 返回前 G2 资源、后续 installer 返回 disposer 前分配、extremum 真实算法/后续 render 回调、静态延迟 resume/closeEnlarge 任务、完整 stage host/adopt/abort、query/Store 原子提交、CFPI/CTPR 旧终审未决项、真实 source READ/只读限制/撤权/组织隔离。不得以本单元通过关闭整个 G2OWN-027 或完整 AC。

## 修复后准入预测与下一步

一次修订 LSCD-001/002 的资源 ledger、初态与 oracle，保持其余 55 场景原意、错误通道和产品分母，不需重做已有 ownership helper设计。独立复核关闭这两项后，预计可给 **合同有界有效 + runner-only 准备入口**。这里的条件是可定位的本单元输入修复，不是等待权限环境，也不是无期限追加设计。

之后按 Design 已定路线：控制面冻结 Cases/raw/canonical 身份 → 新 runner-only Card/Context/action-target admission → 真实完整模块 55 例 RED（LSC-001 精确 fingerprint，全部执行、execution errors 不冒充 RED）→ 独立 RED Validation → 对两个生产 source target 签发新精确 admission → 同 identity GREEN 与独立实现验证。当前 source、既有 helper/SFC、Goal和旧r003均不由本 Review修改。

父 Goal 继续；该非权限前置不需要再请求真实 source READ 成功授权。权限缺口仍阻断相应真实验收和完整产品完成声明，不能泛化为停止本单元的安全准备与后续有界实现。
