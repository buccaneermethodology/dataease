# 普通折线构造阶段所有权设计独立复核 r002

## 裁定

**同一交付物第 2/3 轮：原 LSCD-001/002 关闭，LSCD-N001 已处置；当前完整 Cases 冻结仍需一处精确快照修正。** 没有新的架构或资源模型阻断。新增 `LSCD-R2-001 / P2` 是 LSC-052 新 partial owner 被错误标成已取得并连接 Observer，与实际故障位置及本例 oracle 冲突；不能让 runner 静默忽略该 exact 字段。

| 入口 | 当前结论 |
|---|---|
| Design Freeze Validity | **设计行为合同 `VALID_WITH_BOUNDS`（有界有效）；r002 Design/Cases 整包 `NEEDS_REVISION`（需下述一处字面修正后才能完整冻结）。** 不要求重做设计。 |
| runner-only 准备 | **`CONDITIONAL_ENTRY`（有条件入口）。** 现可在新的精确 Card/Context/admission 下准备真实模块 allowlist/编译与具名 registry 框架，不改生产源码、不把诊断记正式 RED；绑定并执行完整冻结 55 例前必须修正 LSC-052 并重算字节/identity。 |
| 两个生产 source Builder | **`NOT_READY`（尚未就绪）。** 必须先有正式真实模块 RED、独立 RED Validation 和两个 source targets 的精确 admission；本轮没有提前授予生产 READY。 |

原 10 Goal AC / 26 must-have / 16 产品义务及权限、MVP、旧 r003 残余全部保留；本报告不是产品实现、验收或 Goal 完成结论。

## 输入、独立性与复验

Reviewer/source 仍为独立 `/root/g2_closeout_reviewer`，不是 r001/r002 Design/Cases 或产品源码作者；本轮仅写本报告。读取[首轮完整基线](LineStageConstructionDesignReview-r001.md)及全部 r001→r002 变化，继承未变化认知域并对所有 55 条新增 startup/oracle 做同类核查，不只检查首个 finding。

- canonical Card `cb9971b5e1b75d94fd6960cb8a0447e037a0d407bd24ba9ead441b2434beb68c` 复验 pass；Context `c42c97044bcd5ae3cecd98f0b0cb38d4a54380a018041d75ea0b7002afa0efb9` 验证退出 0，21 项 required-read 摘要全部匹配；Cases 23 项 source_refs 摘要全匹配。
- [Design r002](../LineStageConstructionDesign-r002.md) SHA-256：`2a8e940113daf9db67dd90e2407ab71299ce57a5b483d9eb99cee40a0d869c93`。
- [Cases r002](../LineStageConstructionCases-r002.json) SHA-256：`21879ba9f72564408b782396e5c3882f440259426f92a884a531411945c9523b`；cases 数组 canonical SHA-256（UTF-8、sort_keys、紧凑 JSON）：`55ae7b92c0945a0d384487d3e3d6f62ff9685cc1a289656e966b676c028ef9cf`。
- 55 个 id/name/scenario 与 r001 逐项不变；trace/count/destroy_count 全部自洽，全部 registry 内数字 handle 唯一。外部业务/cleanup 原对象及每次 occurrence 的 warning 顺序未删减。candidate/frozen_for_builder=false 是审前元数据，不是要求再次设计的理由；有效输入应由控制面冻结 manifest 绑定原字节，不能因改状态反复重写已绑定文件。

## 原发现处置与全部检查矩阵

| 项目/检查域 | 独立结果 |
|---|---|
| LSCD-001 / LSC-042、045 | **CLOSED（合同层）。** 新时序为真实 start→IO callback→仅 clock40；t40 的 TN handle2/due200 与 TQ handle3/due80 明确，先 clear TN、末尾 clear TQ，最终 registry 空；没有私设 firstColumnFrameReady 或绕过真实 wait。 |
| 真实模块诊断 | 内存转换并执行磁盘完整当前 Carousel，以具名 DOM/Chart/Observer/clock doubles 真实调用 constructor/start/捕获的 IO callback，再推进40。bar/chart-mix 实际恰为 TN(2,160ms,due200)+TQ(3,40ms,due80)；line/area/pie 仅 TQ(2,40ms,due80)。全部 queue 空，可见性 true；bar/mix 首帧字段由生产方法自然置 true。与 r002 修订一致。此为诊断，不是55例或RED。 |
| LSCD-002 / LSC-037、038 | **CLOSED（合同层）。** 037 明确真实 replacement 已销毁 Cold，随后旧引用 destroy 两次完全 no-op；038 固定 Cold 已 start 的 TQ handle1/due40，旧 hide 回调才造 Cnew，Cnew 被旧共享 cooldown 阻塞而 queue=[Cnew]。独立 G/H/W/O、own timer/frame/cancel、视觉与新 owner 完整状态均明确。尾部不得删 cache/TQ 或继续共享视觉。 |
| LSCD-002 / LSC-040、053 | **CLOSED（合同层）。** 040 由 C 先 start 取得共享 TQ，Cother 只构造；053 由 Cother 先 start，C 后 start 被阻塞入队，销毁 C 后只移除自己且原 TQ/other 均不变。创建者、clock、queue 顺序、owner flags 与 retained oracle 一致。 |
| LSC-016、039、052 同类 | 016 明确 other 未 start，业务 dashboardHidden 触发真实 public stop；039 partial C 已 observe 时重入新 owner，符合其已有 O 的阶段；052 明确旧 owner 未 start、零 timer，但新增 partial C 的 Observer 快照有 LSCD-R2-001。 |
| LSCD-N001 / 039 生成错误 | **CLOSED（证据边界）。** 只动态校验 code/class/同 realm Error/no-wrapper，`reference_equality_proven=false`；不以 expected=caught 自证内部原引用。生产原样 throw 留给独立源码检查；外部注入原对象仍按引用断言。 |
| 025、026、041 可达性 | 025 改为实际 cooldown timer 注册 before-effect throw，未虚构已返回 handle；026 由真实可见 IO+clock40取得 S/新 TQ 后再由具名 extremum 边界抛错；041 通过真实 document scroll handler取得 TS，再依序清 TS/TQ。没有替换生产 next/start 等方法。 |
| synthetic cleanup stress | 明确只有注入资源案例可先用具名 registry分配 S/TI/TN/TH/F/B 后赋声明字段，禁止覆盖 live 资源；它们与真实健康首帧取得分开。资源消费在首外部 primitive 前完成、公共首错/后续 warning/原业务异常、throw-before-effect物理残余、global owner guard等首轮已审行为合同保持。 |
| scope/兼容/权限 | 无生产源码或公共签名修改；真实模块 seam、3 个透明 spy、所有调用方兼容、非 line 控制及完整原分母沿首轮基线保留。真实 source READ/只读/撤权/组织隔离仍 BLOCKED/NOT_RUN，不影响本工程准备。 |

## 新增唯一阻断：LSCD-R2-001 / P2 / OPEN

**位置：** `cases[id=LSC-052].arrange.startup_plan.owners_before_subject[owner=C]`。

本例步骤明确新 partial C 在 constructor 替换旧 owner 时失败，尚未进入新 C.init/start；Design 也保留 `listenerTooltipShow → destroy predecessor → setData/eligibility → init` 顺序。[当前源码](../../../../../core/core-frontend/src/views/chart/components/js/G2TooltipCarousel.ts#L91)的 Observer 取得位于 init→addEventListeners，必然晚于 predecessor destroy。

但该 partial C 的精确 pre-subject owner 快照写 `observer_handle="O"`、`observer_connected=true`、`constructor_returned=false`。其 cleanup oracle 又只断开 O_old、不包含 O，并要求本次 this 的空账本。因此不能同时满足“只经真实构造建立快照”“精确已连接 O”和“没有 O需释放”。如果 runner 按声明先核验 startup snapshot，正式执行会因不可能的初态失败；若跳过字段则偷偷降低了测试合同。

**精确修正：** 仅将 LSC-052 新 partial C 的 `observer_handle`标为 null/未取得，`observer_connected=false`；若 `dom_host`表示查找夹具目标可保留 H，但不得解释为已捕获 chartElement。旧 C_old 的 O_old/connected=true保持；保留首轮修订的全部步骤、trace、warnings和其它55例意图。LSC-039 的 partial C 发生在 observe 后，O/connected=true正确，不能批量把所有 partial constructor 的 O 清掉。

同类审计还核对了 037 的 destroyed old owner 已断开、其新owner仍连接；016/040/053的 retained owner仍连接。未发现其它“未取得却声明已连接”Observer快照。此处是新增 exact 快照字面错误，不要求更换资源模型、改生产代码或扩大范围。

## 未检查、残余与修复后路线

尚无正式 runner、可信 RED/GREEN或生产实现，因此没有运行55例验收、浏览器/整包构建/数据库/真实权限，也未声称所有故障释放已成功。内存诊断只支持当前源码的正常启动时序；不能验证未来实现的 destroy/rollback。第三方无句柄、后续 installer、静态延迟回调、完整 stage host/adopt-abort、query/Store事务、Copy/Paste/保存重开和旧 CFPI/CTPR/AM-09 仍开放，不关闭整个 G2OWN-027 或完整 AC。

**修复后准入预测：** 完成 LSCD-R2-001 单处精确更正并绑定新摘要后，预计可给完整有界 Freeze 和 runner-only准备；仅需最终短增量复验，不需新架构设计或扩大阅读范围。控制面可以继续独立的模块编译/loader准备，不能用当前错误快照作为有效正式RED。

随后固定 manifest/Cases身份 → runner-only admission → 全55例真实模块RED及精确LSC-001 fingerprint、execution error分离 → 独立RED Validation → 两个生产target精确admission → 同identity GREEN及独立实现验证。不得把剩余第3/3轮预算重置，也不得提前把生产Builder标READY。父Goal继续，权限缺口不能成为停止本单元安全准备的理由。
