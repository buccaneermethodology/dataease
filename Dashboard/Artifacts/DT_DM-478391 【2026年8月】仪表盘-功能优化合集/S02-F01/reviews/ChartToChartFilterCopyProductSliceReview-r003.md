# 普通图表过滤复制 MVP 独立最终评审 r003

## 双 verdict

- **Design Freeze Validity：`NEEDS_REVISION`。** r003 已解决保存重开树不一致、正负结构域冲突、墙钟回拨、同数据集 API 结果分类、精确 1MB 构造和 stale contentId oracle，并如实将主路径标为不可执行的产品 UI 场景规格。但仍有两项与原始验收直接相关的设计缺口：异步查询失败后保留新目标树违反 Q014 的“失败不修改”，且没有证明失败/迟到响应时旧预览不会与新条件混显；每次粘贴未在目标 mutation 前重新检查 dataset READ，现有 dashboard READ/MANAGE 不能替代该检查，也未说明只读用户如何不能读取过滤配置。
- **MVP Implementation Entry Readiness：`NOT_READY_FOR_BUILDER`。** 本报告不构成 Builder admission。除上述设计 blocker 外，Cases 仍有需补齐的可判定性/覆盖项；真实产品 fixture、可信同身份 RED、准确 S01 Entry Packet digest 与逐项 AC/Gap 映射、实际 topology/action/target admission 尚未绑定。真实权限环境保持 `BLOCKED / NOT_RUN`。
- **轮次：** 本设计与 Cases 交付物第 **3/3** 轮，本报告是最终一轮；不建议第 4 轮或把本报告转成增量修订轮。
- **声明上限：** 只评估当前工作树中 Design/Cases 的静态语义冻结适格性和候选 Builder 准入；不证明产品代码、UI、浏览器、权限、数据、保存/重开或 Goal AC 已验证。

## 审查基线与方法

Card `S02-F01-CHART-TO-CHART-PRODUCT-SLICE-REVIEW-r003` 按 SHA-256 `8f2a93f87e74b6d08bc64abf2eb9775186a09976d98a2fcd34b7dcb464e46111` 校验通过。Context Bootstrap SHA-256 `1fc2fd0451c3b82c05d79eee3b21f58accff0c209969b05c2646c861230a3fd9` 结构校验 exit 0，42/42 required-read 摘要匹配，无缺失或漂移。当前 Topology 是 `Topology-actual-r372.json`；本轮只读，没有运行应用、测试、数据库或权限行为，也没有修改 Design、Cases、Goal、源码、Dashboard 状态或 topology。

被审 Design SHA-256：`61e7f4dbbf063089b96971db129abb713b3e72e30ab2fb7053c64daff9527329`；Cases SHA-256：`67a5d5fb35d34f5937a31c920625a14bdbedf6c6a671e4d4211fb22defa17e2e`；Review r002 SHA-256：`1a48575b4040c58e4e267490fc45bff944d459958b9e08642eef35168068a6ff`；Goal SHA-256：`28c94d3c35d4ce0a891ce77ecc915932d67f88ef813f3d2815dc0dce11f91b64`。

核对依据包括 Goal/P004、r002 CTC findings、S01 Entry Packet、F01 Contract/AC、权限环境说明、Chart Filter Tree 生命周期追踪及 Review、QPC r006 及 Review、前后端 READ/MANAGE/dataset READ/API/save/query 源码。源码仅作为静态来源；没有将单用户 standalone、管理员或 mock 当作权限 oracle。

## r002 findings 全量 disposition

| Finding | r003 处置 | 本轮结论 |
|---|---|---|
| CTC-001 S01 条件与 MVP 先后 | **有界关闭。** Goal Patch P004 明确允许窄 MVP 在 S01 F01 `CONDITIONAL` 时推进；r003 保留 10/26/16 分母、`Scope Delta: none`、ORIG-02 pending，并要求后续 admission 绑定当前 Entry Packet、逐项 AC/Gap 与不依赖项证据。 | 不代表当前已有该 Packet digest、逐项映射或 S01 终态。它们是 Builder admission 的必需输入。 |
| CTC-002 source/target 权限门槛 | **部分解决。** `/dataVisualization/findNameById` 对应 SDK 的 `findResourceName` 有 READ `@DePermit`，后端也执行资源 READ；`checkCanvasChange` 有 MANAGE `@DePermit` 并校验 `contentId`。前端缺少 `findResourceName` wrapper，但补充一个薄 API wrapper 属接线，不需要新增后端权限能力。 | dashboard READ/MANAGE 不等于 dataset READ，也未证明只读查看者不能读取过滤配置；见 R3-001。实现不能复用 `checkCanvasChangePre` 的 `Repeat` 确认后继续行为，必须只接受精确 `Success`。 |
| CTC-003 payload/目标 schema | **基本解决，剩余测试细节。** r003 固定字段投影、AND/OR 双叶树、精确 fieldId/type、JSON 独立副本，并限定重开比较完整树。 | NEG-003 的 source/target type mismatch 仍未给出两个实际 `deType` 值，见 R3-003。 |
| CTC-004 异步预览失败 | **未解决。** 设计对 query reject/timeout/stale 明确保留新树、不回滚；F01 Q014 则要求失败时目标和预览保持原状。Cases NEG-007 还没有规定如何从失败结果证明不混显旧预览。 | P1 blocker，见 R3-002。 |
| CTC-005 TTL/容量合同 | **有界解决。** MVP 使用同页模块内存与 `performance.now()` 单调年龄，0/1,799,999 接受、1,800,000/1,800,001 拒绝；墙钟回拨不影响同一页面上下文。 | 只支持单页单 tab；最终 Goal 的跨 tab 能力仍在原分母并留待后续 slice，不得称 Goal TTL/跨 tab 已完成。 |
| CTC-006 图表组合范围 | **有界关闭。** 普通 bar→普通 line、同 dataset、空目标，其他组合后置但未移出 Goal。 | 可作为候选 MVP 支持矩阵。 |
| CTC-007 同数据集 API 失败结果 | **大体解决。** NEG-002 已分列 NO、HTTP reject、timeout、malformed、empty，并要求独立运行与 fail closed。 | malformed/empty 仍是类别级输入，没有具体响应对象，但拒绝 oracle 一致；非主要冻结 blocker。 |
| CTC-008 存储/身份/source-read | **部分解决。** 改为模块内存后 localStorage quota/security 场景不再适用；uid/oid、logout、reload/navigation、close 有变体。 | source-read/dataset 权限前置仍缺失，归 R3-001；hidden/pagehide 生命周期虽列在合同中，NEG-004 未分别断言清除载荷，属 R3-004。 |
| CTC-009 保存重开 oracle | **关闭。** E2E 保存后重开树与源、应用目标、query payload 同为两个叶的嵌套 OR 树；明确不把 `deType` 混入过滤树。 | 合同对象一致，尚无实际持久化证据。 |
| CTC-010 MVP 阶段与顺序 | **有界关闭。** P004、r003 Design/Cases 保持 MVP 顺序与后续 slices。 | 不改变完整 Goal 完成条件。 |
| CTC-011 保存重开对象不同 | **关闭。** 统一为同一完整过滤树，比较完整字段、分组、运算符和值。 | 运行等价仍待产品 E2E。 |
| CTC-012 正向/负向结构矛盾 | **关闭。** NEG-003 明确接纳两叶 OR 正向形状，不再将合法多叶/嵌套组列为拒绝项。 | 负向 type mismatch 的具体值仍需按 R3-003补全。 |
| CTC-013 每次操作权限和 dataset access | **未解决。** Dashboard READ/MANAGE 的 endpoint 现已定位，但 dataset READ 只在 `calcData` → `ChartDataManage.calcData()` 取数时检查；它发生在本地替换树和 snapshot 后，不能满足 Q009 每次粘贴在修改前重验数据集访问。source dashboard READ 也没有针对读取 `customFilter` 的专门门槛或只读查看者保密证明。 | P1 blocker，见 R3-001；真实权限仍 `BLOCKED / NOT_RUN`。 |
| CTC-014 墙钟回拨复活 | **关闭于本 MVP。** 页面同上下文的 monotonic 时间与 hidden/pagehide 清除消除墙钟回拨复活路径。 | 不推断未来跨 tab 共享时钟实现。 |
| CTC-015 负例可执行形状 | **部分解决。** API、身份/TTL、query/save/permission 案例均已有 setup/actions/variants/oracles；新增精确 UTF-8 1,000,000/1,000,001 字节构造算法，并给 stale contentId 单独变体、规定 `Success` 才继续，`Repeat` 拒绝。 | 仍有 type mismatch 值不具体、Q013 的 1001 枚举正例缺失、NEG-006 对接受/拒绝的 clipboard 期望未分开、NEG-004 未断言 hidden/pagehide 清空；见 R3-003/004。 |
| CTC-016 产品 E2E 准备不足 | **标签问题已解决；环境问题仍在。** Case 明确 `kind=product-ui-scenario-specification`、`executable=false`，并列出产品 ID/route/rows/cleanup 等运行绑定条件。 | 诚实的场景规格不是可执行 E2E、可信 RED/GREEN 或运行证据；真实 fixture 尚未绑定，阻断 Implementation Entry，但本身不否定其设计文档身份。 |

## 本轮新增/残留 findings

### R3-001 / P1 / OPEN：每次粘贴前未完成 dataset READ 重验，source 配置可见边界也没有证明

**位置：** Design r003 §“源码路径与操作时权限门槛”及“原子应用”；Cases NEG-009；Goal AC-F01-Q009、AC-F01-ORIG-01；`DataVisualizationApi.java`、`DataVisualizationServer.java`、`ChartDataManage.java`。

`DataVisualizationApi` 现有 `/findNameById`（Java 方法 `findResourceName`）只检查可视化资源 READ；`/checkCanvasChange` 检查仪表板 MANAGE 和当前 `contentId`。当前前端 `dataVisualization.ts` 还没有 `findResourceName` wrapper，但这是可补的薄接线，后端资源权限路径存在。`ChartDataManage.calcData()` 才检查 dataset READ，并继续应用列/行权限。r003 的 paste 顺序却在这些检查前完成目标树替换和 snapshot，再异步 dispatch `calcData`。因此被撤销 dataset READ 的会话可先改变本地目标/产生 snapshot，随后才在取数时被拒绝；这不满足 Q009“每次粘贴重验数据集访问，拒绝时不改目标”。

此外，dashboard resource READ 不是 dataset READ，也不是过滤配置单独的读取授权。r003 说已加载配置来自 dashboard READ 路径，却没有展示只读 dashboard 用户为何不能读取 `customFilter` 配置、或字段配置如何受限。真实 runtime 被如实设为 `BLOCKED / NOT_RUN`，但不能据此把设计所需的前置保护降为后端异步查询失败。

**要求：** 粘贴前在任何树/snapshot/query mutation 前，通过可复用的现有授权门槛验证当前身份、dataset READ 与 target MANAGE；任何非成功、身份缺失、过期 contentId 或 endpoint 失败都保持目标、clipboard、snapshot、query 和 save 不变。源 copy 也要明确当前已载入过滤配置的 READ/保密边界；若现有路径无法证明只读用户不能看配置，应把这条路径阻断在产品 Builder/权限验收前，不能以隐藏按钮替代。补 frontend `findResourceName` wrapper 时不得新增后端绕权。Cases 应加入 dataset 权限撤销于 paste 前的拒绝变体和 source-read/read-only 观察用例，权限执行仍标 `BLOCKED_NOT_RUN`。

### R3-002 / P1 / OPEN：query 失败语义违反 Q014，迟到响应的“无混显”不可判定

**位置：** Design r003 §“唯一支持形状与原子应用” query reject/timeout/stale 段；Cases MVP-NEG-007；F01 Q014。

F01 Q014 的冻结结果为：成功粘贴后按 T 刷新；取消/失败不刷新、不修改，目标与预览保持原状。Design r003 却要求 query reject/timeout/stale 时保留已替换的新目标树、不回滚；NEG-007 也接受“仅当同步 apply 成功才有新树”。这把预览请求失败从“失败、不改目标”改成了“目标已修改但查询失败”，与来源合同不一致。`no_mixed_new_tree_old_chart_result=true` 只是布尔期望，未给出旧预览 P0、新树 T、query request identity、失败/迟到时 UI 应清除/保留/恢复哪一状态的可观察 oracle。

静态调用链中 `changeFilterData()` 只赋值；`calcData()` 另发事件。图表组件对 HTTP reject 的 catch 只结束 loading；错误码路径设置 error，但未见按 paste generation 丢弃 stale 响应的合同证据。因此不能从当前代码映射推断迟到成功结果不会覆盖新目标，也不能保证旧图不会与新树混显。

**要求：** 不得自行缩窄 Q014。明确把粘贴操作作为整体定义成原子成功/失败：query 失败或该目标已变更时目标树、snapshot、预览与提示回到/保持 P0，或由人类 authority 对 Q014 作新裁定；r003 没有此类新授权。为并发/迟到响应给出可观察的 request/target identity 及完整 UI oracle，覆盖旧请求晚于新请求返回、active target 切换和 reject/timeout。当前内容不足以冻结此行为。

### R3-003 / P2 / OPEN：形状负例的类型 mismatch 没有可复现的输入值

**位置：** Cases r003 `MVP-NEG-003`。

setup 的 `source_and_target_field_catalogs` 把 `FIELD_REGION` 固定为“same text field id and same observed type”，variant 又写 `source/target type mismatch`，但没有定义哪边字段 ID/deType 如何改变。独立执行者无法从给定 setup 唯一构造该负例，也无法明确是 ID 不同还是 `deType` 不同触发拒绝。

**要求：** 为该 variant 写明两个具体字段目录与 ID/deType 值，断言只改变一种维度；若 `invalid JSON` 等其他类别也用于维护的冻结 oracle，应为其给具体输入，而不要让实现者猜测。

### R3-004 / P2 / OPEN：容量边界测试漏掉 1001 枚举正例，且 accepted/rejected clipboard 期望混写

**位置：** Cases r003 `MVP-NEG-004..006`；F01 Q013；Design r003 同页剪贴载荷合同。

NEG-006 的精确构造算法可确定获得 1,000,000 UTF-8 bytes，等值与超限以及 50/51 叶正交边界已得到补正。但原 AC Q013 还明确要求“1001 枚举未超两限应允许”；当前 variants 没有此正例。NEG-006 的初始 clipboard 是 prior valid envelope，而单一 expected 对所有 variants 声明 `reject_copy_preserves_previous_clipboard=true`，没有区分被接受的复制应以新 T 替换旧 T、更新复制时间，与拒绝复制应保留旧 T/时间。NEG-004 列出 hidden/pagehide loss conditions，但未在 actions/expected 中单独断言这两种页面事件清空载荷。

**要求：** 增加 1001 枚举且仍低于叶数/字节上限的明确接受变体；按每个变体分别断言接受后替换 T 并只在成功 copy 时记新的 `copiedAt`、拒绝后保留旧 T 和原 `copiedAt`；为 hidden/pagehide 分别指定状态变化与 paste 拒绝 oracle。

## 范围、边界及准入裁定

1. **S01 与 Goal 分母：** r003 保留 S01 F01 `CONDITIONAL`、ORIG-02 pending、10 项 Goal AC / 26 项 must-have / 16 项产品义务和 `Scope Delta: none`；未把后续图表/查询组件/权限/跨 tab/异常矩阵转为 non-goal。Builder admission 仍需当前 Entry Packet digest、逐项 Slice AC/Gap 映射和不依赖证据，本轮没有替它们生成或认定通过。
2. **跨 tab 与单调 TTL：** 单页内存加 `performance.now()`、hidden/pagehide 清除可以支撑此 MVP 的同页时限，不可证明最终 Goal 的跨 tab 共用 clipboard 或跨上下文 TTL。将跨 tab 明确留给后续 slice 与 `Scope Delta: none` 一致，但未来实现仍需单独冻结共享生命周期/时钟合同并覆盖“不刷新 B 重新计时”。
3. **同数据集/API与stale contentId：** 本地 dataset ID 不相同则不调兼容 API；符合时调用一次并要求肯定结果。NEG-009 新增 stale contentId variant，精确规定只有 `checkCanvasChange` 返回 `Success` 才继续，`Repeat`、reject、timeout、malformed 一律拒绝。它比旧的通用描述更可判定。实现须直接执行严格判定；现有 `checkCanvasChangePre` 在 `Repeat` 后可通过用户确认继续，不适合作为此 fail-closed 授权门。
4. **产品 E2E 与 RED：** MVP-E2E-001 正确标为 `product-ui-scenario-specification` / `executable=false`。它仍未绑定真实非生产 dashboard/dataset/chart/field/rows、route、cleanup/reset、保存后回读环境；不能当 E2E 执行结果、可信 RED/GREEN 或 Builder admission。可以准备受控合同测试，但不得替代 P004 所要求的实际产品 UI体验。
5. **真实权限：** 用户明确授权设置账号，但权限实现来源仍未取得，`PermissionEnvironment.md` 记录隔离实例和账号未建；没有只读拒绝、权限撤销/恢复、源读取权或 target MANAGE 的真实运行证明。所有此类状态继续为 `BLOCKED / NOT_RUN`，不以 standalone/admin/mock 代替。

## 已检查且当前没有新增 blocker 的维度

- **权威与范围保真：** Goal.final 与 P004 的阶段授权一致；10/26/16、`Scope Delta: none`、完整 F01 与 S02 完成谓词均保留。MVP 的排期例外没有被写成 Goal 完成或范围缩减。
- **S01 边界：** S01 Entry Packet 当前仍 `CONDITIONAL`；设计允许已授权窄 slice 先行，并保留 ORIG-02 及受 S01 影响验收 pending。实际 Packet digest 与逐项 AC/Gap 映射尚未产生，故只在 Builder admission 前检查，不误称本轮已完成。
- **正向树和保存重开：** source、applied target、query payload、reopened target 都是同一 AND-root / OR-group / North+Central 双叶树；`deType` 不被混入 customFilter projection；唯一正向结构与负向结构集合不再直接矛盾。
- **MVP 类型范围：** ordinary bar→ordinary line、同一 dataset、空目标被明确固定；其他图表、query、表/透视表、非空确认及完整 F01 回归都保留在后续 slice 和原始 denominator。
- **同 dataset 与 dashboard 内容版本：** 本地 dataset ID mismatch 时不调兼容 API；匹配时要求一次肯定响应。NEG-009 的 stale `contentId` 明确只有精确 `Success` 可继续，`Repeat`/错误拒绝；这是接口结果 oracle，不等同于真实 XPack 授权行为。
- **剪贴内容生命周期边界：** 同页内存、uid/oid、logout、reload/navigation/close、TTL、hidden/pagehide、无持久存储和无 OS clipboard 的声明保持窄；单调时间解决当前同上下文墙钟回拨，不声称 cross-tab 完成。
- **权限 API 来源与接线：** SDK READ endpoint 和 MANAGE `checkCanvasChange` endpoint 在源码存在，后端注解/实现锚点明确。`findResourceName` 缺前端 wrapper 是允许的薄接线，不需创造新后端授权接口；严格调用时须自行拒绝 `Repeat`，不复用会确认后继续的 `checkCanvasChangePre`。
- **场景规格与 claims：** E2E 被明确标记为非 executable scenario specification；环境、fixture、Browser UI、真实权限和保存重开没有被描述为运行通过。`BLOCKED / NOT_RUN` 与 claim ceiling 没有被收窄或抬高。

## 未执行/未核实项与原因

- 本轮没有产品 Browser tab、已绑定可复现 dashboard/dataset/charts/rows/route 或 reset/cleanup；按照 Card 限制没有打开/刷新用户页面。因此 MVP-E2E-001 未执行，不能当成可信 RED/GREEN。
- 当前没有已确认加载真实权限实现的隔离实例与 editor/viewer/admin 测试身份；按照用户和 Card 要求未以 standalone、admin 或 mock 替代。只读用户配置保密、source-read、dataset READ 撤权、target MANAGE 撤权/恢复均 `BLOCKED / NOT_RUN`。
- 没有执行查询/保存/重开运行实验、构建或数据库操作。查询迟到响应和保存后读取的 UI 行为只能用静态源码与候选 oracle 评估，不能据此宣称 runtime 通过。
- 不在本 Review 范围内完整重审 Query→Query、表/透视表、跨 tab 最终状态机、其他 slice 的完整 schema/AC、产品部署与发布；它们仍受原 Goal denominator/后续审查约束，不会被本 verdict 承认为已完成。

## 修复后准入预测（非当前授权）

若以新版本一次性修正 R3-001/R3-002，使 dataset READ/source-read 检查发生在任何本地 mutation 之前、Q014 失败保持 P0 且 stale response 可唯一判定，并按 R3-003/R3-004补齐 Cases 的实际输入/clipboard 状态 oracle，再由独立 Review 复核无新 blocker，则**预期** Design 可争取 `PASS_WITH_BOUNDS`，范围仅限候选 bar→line 空目标合同。该预测不是当前 Design Freeze 或修复批准。

即便 Design 获得该结论，Builder 仍须先有同 identity 的真实产品路径可信 RED、当前 S01 Entry Packet digest 与逐项 AC/Gap 依赖证据、与最新 Design/Cases/topology/action/canonical target 精确绑定的有效 admission。若 source-read 或 dataset READ 在现有环境中无法被安全前置验证，产品路径应继续 fail closed，Builder 不得用 UI-only/mock 放行。权限矩阵/撤权验收及完整 Goal 仍保持未完成；任何 MVP 运行结果只能按它实际覆盖的功能证据报告。

## 最终裁定

r003 已有效修复 CTC-009/011/012/014，并补齐精确 byte fixture 与 stale contentId 响应；CTC-001/005/006/010 在明确边界下关闭；CTC-002/003/007/008/015/016 部分收敛，按表中保留限制。R3-001 与 R3-002 直接违反或未实现当前 Goal/F01 权限、失败原子性约束；R3-003/004 仍使部分冻结案例不能唯一复现。因此本交付物的最终 **Design Freeze Validity 为 `NEEDS_REVISION`**，**Implementation Entry Readiness 为 `NOT_READY_FOR_BUILDER`**。第三轮已用尽，不启动第四轮；后续若要修改，须作为新版本/新交付物建立新的审查身份与准入，不能改写本报告所绑定的 r003。

本审查不改变完整 S02 Goal 状态。真实权限和产品 UI 行为未验证，S01 F01 仍有条件，任何 MVP 设计结论不得写成产品通过、F01 完成或 S02 Goal 达成。
