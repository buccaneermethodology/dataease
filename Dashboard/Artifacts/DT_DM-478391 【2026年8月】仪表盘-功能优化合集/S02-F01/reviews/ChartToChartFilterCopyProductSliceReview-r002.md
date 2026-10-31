# 普通图表过滤复制可体验 MVP 独立全量评审 r002

## 双 verdict

- **Design Freeze Validity：`NEEDS_REVISION`。** r002 已落实阶段顺序与 bar→line 空目标范围，增加过滤结构、字段兼容、TTL/容量边界以及异步预览与保存失败语义；但正向 E2E 与负向 shape 案例互相矛盾，保存重开 oracle 不等于已粘贴树，权限动作仍缺可核验的现有授权入口，关键拒绝案例没有可执行的 setup/action/变体。
- **MVP Implementation Entry Readiness：`NOT_READY_FOR_BUILDER`。** 当前仍是候选 Design/Cases；Cases `frozen_for_builder=false`，没有可信 RED，也没有消费本轮设计摘要、实际 topology、action 与 canonical target 的精确 admission。不得把本报告当作准入。
- **实施顺序 Patch：** 用户授权的阶段顺序已由 `S02-GR-P004` 写入当前 `Goal.final.json`。该 Patch 仅调整顺序，原 10 项 Goal AC、26 项 must-have、16 项产品义务、`Scope Delta: none` 和最终完成谓词均保持。这个 MVP verdict 不等于 F01 权限通过或 S02 Goal 完成。
- **轮次：** 本交付物第 2/3 轮，不自动开启第 4 轮。

## 入口、绑定与边界

Review Card `S02-F01-CHART-TO-CHART-PRODUCT-SLICE-REVIEW-r002` 按指定 canonical digest `f2a8c88495a350af7f63d180fb95599f177a695ac9e72fc7f9ab2d3ccac7ad42` 校验 `pass`；Context 结构校验 exit 0，31/31 必需读集当前 SHA-256 一致。已读取渲染 prompt、Review r001、Design r002、Cases r002、Goal Patch S02-GR-P004 和应用后的 Goal，以及 S01 Entry Packet、F01 AC、CFP helper 终轮 Review、FilterTree/editor/chart/query/canvas-save 源码与权限边界材料。

被审 Design SHA-256：`6070199623ddca09cff620a17087533cfdaf1a23e14867daa915194435d887cd`。Cases SHA-256：`4fae56c21ed25813324c3bc270b3e1481bc94a44ec27865e1b7fcf47d0dbd9de`。Review r001 SHA-256：`df9f03f4b14e9e1ad89269a157c059e910ccd3b1dba28579722f7f628cec3d13`。本轮只做静态语义和来源核对；没有运行产品 UI、测试、数据库或权限行为，也没有修改 Design、Cases、Goal、源码或 topology。报告只写入本卡授权路径。

## CTC-001..010 处置

| Finding | r002 disposition | 核对结果 |
|---|---|---|
| CTC-001 S01 条件被缩窄 | **已按新增授权修正，有界关闭** | Goal Patch P004 明确可在 S01 F01 仍 `CONDITIONAL` 时进入窄 MVP，要求绑定当前 Entry Packet 与本 Slice AC/Gap 映射、说明不依赖项及其证据，不改/抢占 S01。Design :13、:17-20、:63-64 与此一致。ORIG-02 及其他确实受 S01 影响的验收仍 pending。Builder admission 仍须实际包含 Packet SHA 与逐项映射，不能以本 Review 代替。 |
| CTC-002 屏幕/保存权限无权威绑定 | **仍 OPEN，部分收敛** | Design 明确 `editMode` 只是 UI 门槛，不是权限证明，并限制真实角色验收为 `BLOCKED / NOT_RUN`；但只引用泛称现有访问/保存门槛，没有定位 source-read、dataset access、target edit 在 copy/paste 时如何重新授权。单靠 `/chart/checkSameDataSet` 只校验数据集一致；正常 `canvasSave` 也不能证明当前粘贴动作的实时权限。见 CTC-013。 |
| CTC-003 payload 与目标承载 schema 未冻结 | **合同有界修订，Cases 留有 blocker** | Design :35-38 对 bar→line 的树、叶字段、字段 ID/deType 匹配、JSON-safe 深拷贝和拒绝规则已具体化；源码路径在调用链上不依赖 CFP helper。但 NEG-003 反向拒绝 positive fixture 使用的多叶嵌套树，故其 oracle 不可同时满足。 |
| CTC-004 异步预览失败语义未闭合 | **设计有界修复，案例执行形状不足** | Design :48-52 区分同步 apply、逻辑 `calcData` 调度和 query/render 结果；失败保持编辑态树但不提示成功、不保存，概念上比 r001 明确。NEG-006 只列 query reject/timeout/stale 变体，缺具体前态、动作和新旧图表结果快照，不能判定“no mixed”或错误反馈。 |
| CTC-005 TTL/容量边界候选化 | **边界文字已收敛，oracle 未锁定** | Design :42-44 规定版本化配置 projection、TextEncoder、1,000,000 bytes 等值允许和 1,800,000ms 起过期；但依赖可回拨本地时钟，且 Cases 没有实际等值 fixture/生成步骤或 TTL 边界用例。见 CTC-014/015。 |
| CTC-006 类型组合宽于案例范围 | **有界关闭** | Design :35 和 Cases `mvp_matrix` 将当前 MVP 收窄为普通 bar→ordinary line、同数据集、空目标；其他组合保留后续，不减最终 Goal 范围。 |
| CTC-007 数据集/API 异常案例不足 | **仍 OPEN** | NEG-001 覆盖本地 ID 不同；NEG-002 标题列 API reject/timeout/malformed/false，但未给这些 API 结果作为 variants、setup 或 action。设计的 fail-closed 规则清楚，案例无法逐种验证。 |
| CTC-008 copy/storage/source-read 失败案例不足 | **仍 OPEN** | NEG-003 有 corruption 字样，NEG-005 提到拒绝复制保留旧内容，但没有 localStorage quota/security 写失败的明确动作及输入；source-read 权限拒绝也没有可执行 case。用户/组织变化检查只在 NEG-004 标题出现，具体 variants 实际却是容量场景。 |
| CTC-009 保存重开 oracle 不足 | **仍 OPEN** | Design :28、:52 与 NEG-007 已增加正常保存入口、保存失败/未保存离开的声明；但 E2E-001 的 `reopened_target_tree_equals` 与 source/target/query 的期望树不相等，直接否定 durability equality。见 CTC-011。 |
| CTC-010 MVP 阶段未明确 | **有界关闭** | Goal Patch、Design :6-9、:35、:54-59、Cases MVP matrix 与 E2E-001 将当前顺序限定到实际产品界面的 bar→line 空目标纵向路径；覆盖确认、其它图表、表/透视表/查询组件及完整异常矩阵保留后续。10/26/16 与 Scope Delta none 未改变。 |

## 新增/残留阻断 findings

### CTC-011 / P1 / OPEN：E2E 保存重开期望与本次粘贴树不一致

**位置：** Cases r002 MVP-E2E-001，`:167-300` 与 `:313-333`。

来源树、目标树和 query payload 均为 `logic=and` 下一个 `type=tree` 节点，其子树 `logic=or` 并包含 `North` 与 `Central` 两个叶子。重开期望却变为单一 `FIELD_REGION in North` 叶，少了 `Central` 和 OR group，且额外出现 `deType`。这与 Design :36 声称过滤项 JSON 持久形状不含 `deType`，以及 :28、:57 要求重开目标与已应用配置相等冲突。

**影响：** 按字面执行时，即使 UI 粘贴、预览和保存均正确，MVP E2E 仍会因重开 oracle 对象不同而失败；若实现仅保留 North 又会丢失已声明的过滤语义和预览行。

**要求：** 重开 oracle 必须从同一冻结目标树推导并与保存/reload 表示的规范化规则一致；若 `deType` 是 reload 期允许的字段补充，需明确 equality 规范并保留两个叶/OR 子树，不能接受条件值减少。

### CTC-012 / P1 / OPEN：MVP 正向支持域与负向案例直接矛盾

**位置：** Design r002 :7、:35-38；Cases r002 Fixture `:34-151`、MVP-E2E-001 `:155-300`、MVP-NEG-003 `:386-409`。

Design 明确支持 AND/OR 组合及 1–50 个 enum 叶子。正向 fixture 使用两个叶子的嵌套 OR；MVP-NEG-003 标题称“文本单叶过滤树”，并把 `multi-leaf` 和 `nested group` 列为拒绝变体。用例还没有区分“源配置至少一叶”与“整树只能一叶”的谓词。

**影响：** 一个完全符合正向 E2E 的配置同时落入拒绝集合，设计合同和案例没有共同可实现的语言。无法冻结支持形状，也无法解释真实过滤语义 `North OR Central`。

**要求：** 保留实际授权 MVP 所需的嵌套静态过滤条件时，删除或细化错误负例；把拒绝变体明确为真正不受支持的 leaf/type/target，而不是当前正向合法结构。正向和负向 fixtures 应可机读比较。

### CTC-013 / P1 / OPEN：每次粘贴权限复验仍未对齐 Goal 的数据/编辑权要求

**位置：** Design r002 :22-29、:48；Cases MVP-NEG-008 `:476-488`；Goal F01 Q009/ORIG-01。

Design 正确声明 `editMode` 不能证明权限，也不把 `checkSameDataSet` 当授权检查；但尚未说明本地读取已加载来源 `customFilter` 的 source-read 受哪个有效访问门槛保护，也没有指出每次粘贴重新验证 dataset access 与 target edit 权的真实机制。NEG-008 只检查 preview 时隐藏 UI、普通 `canvasSave` 被服务端拒绝、不得直接写后端；它没有验证只读身份在配置读取/复制/粘贴前被拒绝，也没有撤权后同一会话的 target mutation 被阻止。用户授权不允许删去这些安全要求；Patch 允许真实权限验收保持 blocked，但要求既有访问控制不绕过。

**影响：** MVP 可以把真实权限测试与功能路径验证分开报告，但在没有可靠路径可执行 Goal 的“每次重验”规则时，不能把普通 UI 可见/可粘贴说成满足安全前置。已有数据已在浏览器中时，服务端拒绝后续保存也不能撤回用户此前看到/复制的数据。

**要求：** 指出当前实际入口/已有后端门槛对 source-read、dataset access、target edit 的具体保护时点与拒绝结果；标明 copy/paste 是否会只使用已授权的既有编辑态数据、如何处理 session 中撤权。真实 XPack 权限/隔离环境仍为 `BLOCKED / NOT_RUN`，不得以该静态映射宣称通过；如果源码里不存在可安全复用的能力，则在 Builder admission 前明确该 MVP 路径被阻断，不得 fallback 到 UI-only 检查。

### CTC-014 / P1 / OPEN：30 分钟 TTL 用可回拨墙钟仍可能让过期剪贴内容复活

**位置：** Design r002 :25、:42-44；Cases MVP-NEG-004 `:411-428`。

Design 明确说本地时间不抗回拨，但规定 `nowMs - copiedAt < 1,800,000` 即可消费。若内容曾超过 30 分钟过期，随后系统时钟回拨到一个仍晚于 `copiedAt` 且小于 30 分钟的位置，同一 localStorage 内容会重新满足有效谓词。有限安全整数和拒绝未来时间不能检测这类回拨。Goal 要求旧剪贴内容过期后不能继续消费；这是安全约束而非可删的通用异常边界。

**影响：** 候选实现的“恰 30 分钟起过期”对单调前进的墙钟有效，对重设本机时钟的场景并不封闭；设计目前承认无 anti-rollback，却同时允许把它用作 30-minute expiry。

**要求：** 使用可以跨刷新/跨标签且对回拨 fail closed 的时间/版本机制，或明示安全上如何检测时钟倒退并永久使当前载荷失效；为 copy→过期→回拨→重试加入 oracle。可信时间来源仍未知时，将此作为 MVP 安全前置待解决项，不能声称 TTL 完整实现。

### CTC-015 / P1 / OPEN：关键负例身份/TTL/API 用例错位且无 boundary fixtures

**位置：** Cases MVP-NEG-002/003/004/005 `:362-443`。

- NEG-002 标题列 same-dataset API `reject/timeout/malformed/false`，实际 `variants` 却是空树、字段缺失、类型错误、动态时间及坏 JSON；没有构造各类 API 返回/异常，也无 `actions`。
- NEG-003 又重复字段/结构拒绝，但把 MVP 正向合法的 multi-leaf/group 判为非法，见 CTC-012。
- NEG-004 标题称身份、组织与 TTL 失效，实际 variants 只有容量边界，没有 uid/oid 不匹配、登出/回归、复制年龄/过期或回拨输入。
- NEG-005 标题为容量边界，重复列 NEG-004 的叶数/字节数；恰 50 与 1,000,000 bytes 只以自然语言命名，没有构造算法能保证 payload 合法且字节恰等于目标值，也没有独立操作说明“50叶但小于容量”与“容量等值但叶数低于上限”的正交点。
- NEG-006/007/008 有负例标题和 variants，但均缺具体 `setup` 与 actions，无法确定在哪个用户/组织、图表/权限状态、现有树和 request baseline 下观测其 expected。

**影响：** Case IDs 看起来覆盖了设计合同，但具体 oracle 与命名的威胁轴不相符；当前不能由独立 Validator 复现并唯一判 pass/fail。

**要求：** 按 failure axis 拆分并使每例具备真实 setup、动作、stub/产品输入和逐项 expected/forbidden delta。单独写出 TTL 0/1,799,999/1,800,000/1,800,001ms 和回拨场景；容量用确定性 fixture 构造文本/序列化投影；分离叶数边界和字节边界；API false/exception/timeout/malformed response 各自独立。保留必要安全负例。

### CTC-016 / P2 / OPEN：被称为 UI E2E 的 Case 尚无可复现产品数据/页面准备合同

**位置：** Cases 顶层 Fixture 与 MVP-E2E-001 `:24-165`；Design :56-57。

正向 fixture 给了字段、虚构资源 ID 与预期行 ID，动作列也有产品 UI 顺序；但没有定义怎样准备真正可在本产品打开的 dashboard、源 bar、目标空 line、授权数据集/字段和三行数据，也没有固定当前工作树中可执行的页面路由、定位控件、chart query response oracle 或 canvas 保存目标。现在更像 E2E 规格草案，而不是可由下一步 Builder/Validator 直接执行的 UI test package。

**影响：** 无法验证 `FIELD_REGION` 的实际 `deType`、字段目录、条件弹窗生成出的持久 JSON、preview 结果行与 reload 表示之间确实对应；“kind=product-ui-e2e”不赋予可执行能力。

**要求：** 在可用且授权的隔离功能环境中，提供可复现且非权限替代品的产品 fixture 配置与清理方式、页面/控件入口、保存资源 ID 和 reload 检查步骤。若当前只能描述动作，先把 case 诚实标为“产品 E2E scenario specification”，待实际环境准备后再立可信 RED/验证；不能把静态 JSON 输出写成 E2E 运行证据。

## 各主题裁定

- **Goal Patch/S01：** 用户指令和 Patch P004 对阶段先后有明确授权，并写入当前 Goal。实施可在 S01 F01 `CONDITIONAL` 下开始的例外有明确范围：bar→line 空目标 MVP；要求绑定 Packet、逐项说明 AC/Gap 依赖；ORIG-02 和其他受 S01 条件影响项继续 pending。当前报告不把 S01 conditional 等同于全局禁止 Builder，也不把 patch 等同于 S01 完成。
- **完整范围：** 10/26/16 及 `Scope Delta: none` 保持；其余图表组合、query→query、表/透视表、非空覆盖、完整过滤形态及权限矩阵进入后续 Slice 不减少最终 AC。
- **CFP helper 独立性：** MVP 限定读取已提交 `view.customFilter`，复制/校验 JSON-safe 静态树，不调用 `prepareChartFilterPayload`，不使用 RowAuth 临时事件载荷。故在这份限定 schema 下，产品入口与 CFP helper 的失败返回/graph-oracle 语义在调用链上独立；不支持据此复活 CFP helper、继承其失败合同或声称完整 filter 域已通过。
- **产品路径：** FilterTree 提交清理、editor 写入 `view.customFilter`、同 dataset API、`calcData` 调度和 canvas 保存入口均有静态来源可查。它们仍不能证明实际 UI、异步响应、保存重开结果或权限行为。
- **真实权限：** 用户、组织和本地 clipboard identity 不等于授权。真实只读禁止查看/复制/粘贴、来源读取权、目标编辑权、撤权/恢复仍是 `BLOCKED / NOT_RUN`；不以 standalone/admin/mock 替代。MVP 的任何成功功能路径报告只能止于产品功能验证，不得越权宣称权限或 Goal 完成。

## 最终处置与下一入口

Design r002 比 r001 将 S01 顺序、MVP 支持矩阵、静态过滤结构、跨图表同数据集校验、异常失败关闭、预览失败和保存失败边界显著具体化。CTC-001、006、010 有界解决；CTC-003/004/005/007/008/009 仍有上述剩余项，CTC-002 未关闭；新增 CTC-011..016 需随本交付物第 3/3 轮一次性处理，避免再按单 finding 停轮。

**Design Freeze Validity：`NEEDS_REVISION`。MVP Implementation Entry：`NOT_READY_FOR_BUILDER`。** 不能进入精确 Builder admission。建议第 3 轮首先修正 positive/reopen/negative 的树 identity，使正负支持域唯一；补齐权限动作实际复验路径与安全 claim ceiling；重建可执行、正交的 TTL/容量/API/异步/保存负例，并提供可复现的 UI 数据准备协议；随后由独立 Reviewer 全量复核。真实权限测试仍留在其独立环境阻塞线上，不能因功能 MVP 的阶段授权提前宣称权限、F01 或 S02 通过。
