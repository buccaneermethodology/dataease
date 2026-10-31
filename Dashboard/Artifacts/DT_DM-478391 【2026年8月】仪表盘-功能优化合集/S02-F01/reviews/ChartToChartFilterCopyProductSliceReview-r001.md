# 普通图表过滤配置跨图表复制产品切片独立语义评审 r001

## 双结论

- **Design Freeze Validity：`NEEDS_REVISION`。** 候选设计保留完整 Goal 分母且提出了同数据集普通图表的有界纵向切片；但当前 S01 前置被缩窄、权限再验没有绑定到可核验权威、输入/承载校验及刷新失败语义未冻结，Cases 与动作合同存在覆盖不匹配，TTL/容量边界仍是候选而非确定 oracle。
- **Implementation Entry Readiness：`NOT_READY_FOR_BUILDER`。** 本次评审不签发 Builder 准入。除设计仍需修订外，Cases 自称 `frozen_for_builder=false`、`CANDIDATE_FOR_INDEPENDENT_REVIEW`，没有本轮 Review 后的冻结合同/可信 RED，也没有绑定本轮对象、实际 topology、action 与 canonical target 的精确 execution admission。
- **轮次：** 本交付物第 1/3 轮。本结论不停止 S02，也不替代其他设计或权限验收。

## 入口、读集与审查边界

Lane Card `S02-F01-CHART-TO-CHART-PRODUCT-SLICE-REVIEW-r001` 按声明摘要 `ce2e68a46265cf51e5932769c4b0ef4d1e2ebcab23a45a78a2d6a58cbaa763fe` 复验通过；Context `ContextBootstrap-CHART-TO-CHART-PRODUCT-SLICE-REVIEW-r001.json` 结构校验通过，24/24 required-read 摘要与当前文件一致。读取了渲染提示、Design r001、Cases r001、Goal、F01 切片契约、S01 Entry Packet、ChartFilterPayload Review r003、Chart Filter Tree 生命周期 Trace/Review r003、QPC r006 Review，以及卡片列出的前端调用链。

被审 Design SHA-256：`1b6140e30bc1e5280a08799e243f1eea2d6b247c6c86597ce6fb309f690a5cb6`。Cases SHA-256：`3687a9f3074609e8a61c972919750fc5c3f6edc29716812db98d10879f483c6e`。本轮未运行产品、前端测试、浏览器、数据库或权限验证；未修改候选、源码或权限环境。报告仅写入卡片授权路径。

## 权威范围与可支持判断

Goal 保持 10 项 Goal AC、26 项 must-have、16 项产品义务及 `Scope Delta: none`。把本轮只实现 bar→line 作为顺序见证本身不构成缩小 Goal；普通表、透视表、查询组件、完整过滤形态、权限、撤销/恢复等仍属未完成范围。

S01 Entry Packet 对 S02/F01 的准确状态是 `CONDITIONAL`，条件包括复用局部证据、覆盖当前 Slice 原 AC 与已登记 Gap、独立审查，以及后续每个 Slice 另行冻结设计并获得实施授权；涉及真实权限的场景仍须补测。另有 `AC-F01-ORIG-02` 的既有组件复制/改类型兼容回归。本设计把 ORIG-02 说成唯一相关 S01 阻断且据此主张它不挡“机械 UI/预览/保存开发”，不完整：Goal 的进入规则还要求产品 Builder 绑定 S01 F01 Entry Packet、独立审查及终态证据摘要，并逐条处理影响当前 Slice 的条件。ORIG-02 单独可留作兼容回归，不可取代其余进入证据。当前证据仍为条件态，不能以本次切片评审代替终态材料。

ChartFilterPayload helper 的失败语义与本切片读取已提交的 `view.customFilter` 在**调用链上可分离**：静态链路是 FilterTree 有效提交时清理 truthy 临时 `field`，编辑器将结果 clone 到 `view.customFilter`；本设计明确禁止调用该 helper，也不以 RowAuth 临时载荷作为来源。该边界足以说明本切片没有直接重用其失败 helper；但不能证明两个路径的输入语义已完全独立，因为设计仍未冻结 `customFilter` 的可接受语法、字段可承载条件和独立校验规则。不得通过新命名复刻 helper 未决语义，也不得仅凭当前 source claim 宣称载荷校验已解决。

`checkSameDataSet` 静态存在，前端 API 是 `/chart/checkSameDataSet/{sourceViewId}/{targetViewId}`。它证明不了来源读取许可、目标编辑许可、数据集访问许可或撤权后的实时权限；同一个 `tableId` 也不是权限证明。当前 uid/oid 只是本地隔离标签。Dashboard 编辑状态和既有保存路径可能提供现有产品边界，但本轮读集没有把它们定位为对每次 copy/paste、source-read、dataset access、target edit 的新鲜授权 oracle。设计必须明确调用哪种受权限服务保护的既有路径、在何时校验、如何处理缺失/陈旧/拒绝；实际角色行为仍须在真实隔离权限环境中验证，不能由静态审查或 standalone 替代。

## Findings（按优先级）

### CTC-001 / P1 / OPEN：S01 条件与 Goal Builder 前置被缩窄

**位置：** Design :9、:54。

设计将 S01 的影响主要限定为 `AC-F01-ORIG-02`，并声称该回归不阻止当前产品机械开发。但 S01 Entry Packet 的 F01 进入仍是 `CONDITIONAL`，且要求复用局部证据并覆盖本切片 AC/Gap、独立审查、另行冻结/授权；Goal `engineering_boundaries.entry` 还要求 Builder 绑定 S01 F01 Entry Packet、独立审查及终态证据摘要，并解除当前切片实际受影响的条件。ORIG-02 是额外兼容回归，不是全部 S01 依赖。

**影响：** 用户新增授权已明确首个里程碑优先做普通柱图→同数据集折线图的实际 UI 端到端 MVP，可延后覆盖确认等复杂分支；这确认了实施顺序，但未改变最终 AC/范围，也没有明确豁免 Goal 已声明的 S01 Entry Packet/终态摘要前置。当前切片尚不能据此宣告满足 Goal 的产品 Builder 入口。真实权限环境也是独立 blocker，不能与 ORIG-02 合并处理。

**要求：** 修正 S01/Goal 条件映射，逐条列当前切片的前置状态、绑定的 S01 终态证据及其 digest；明确 ORIG-02 是哪一验收项、何时验证。用户批准 MVP 里程碑不自动豁免该既有 Goal 条款。若原条件确能满足有界 Slice 进入，须引用维护者权威说明及精确准入，不从 Entry Packet 的 `CONDITIONAL` 自行推出例外。

### CTC-002 / P1 / OPEN：权限与屏幕/保存权检查缺少可执行权威绑定

**位置：** Design :23-25、:30-31、:41-42；Cases CCOPY-001..009。

F01 AC 要求只读用户不可查看过滤配置、复制或粘贴，且每次粘贴重验身份、数据集访问及目标编辑权；不能只隐藏 UI。当前设计以“当前图表编辑器可操作”“现有 Dashboard 编辑访问状态”及泛称“复用现有 screen 权限数据/API”描述，并把 uid/oid 明确排除为授权证明。没有指出相应的权限字段/API/后端拒绝结果、freshness、复制时 source-read 与 paste 时 dataset/target 权限的各自校验点；`checkSameDataSet` 不能补此缺口。正常 `canvasSave` 能保存也不证明用户有目标编辑权或撤权后不会写入。

**影响：** 未能从设计判断只读用户是否在读取已载入的 `customFilter` 前就被拒绝、权限撤销后的粘贴是否拒绝、save 是否由实际权限服务端拒绝。真实隔离验证虽然可以保持 `BLOCKED / NOT_RUN`，但设计不能把尚未命名的现有状态称作完整的权限再验合同。

**要求：** 把 source-read、copy、dataset access、target edit、save 拆为明确授权动作，标出各自既有受保护调用路径与失败 oracle；对页面预载配置和绕过 UI 的入口说明如何被保护。无法从当前可访问核心源码确认的 XPack 权限契约标记为外部待提供，不设 mock/默认放行。对应真实 allow/deny/revoke/restore 案例保留未验证并阻止权限相关验收声明。

### CTC-003 / P1 / OPEN：载荷接受语法和目标承载/字段兼容谓词未冻结

**位置：** Design :13-16、:23、:31-35、:53；Cases CCOPY-001..009。

设计要求接受“非空、结构可识别”的 `view.customFilter`，并对完整 payload 与目标承载形状作完整校验，但没有规定 root/group/leaf 的合法结构、字段 ID 与目标字段目录的关系、动态表达式/空条件/旧配置/缺失字段的处理、能否保留每一过滤属性、格式错误分类或失败提示。相同 dataset ID 与 `checkSameDataSet=true` 不能单独证明目标 chart 能承载源树。Cases 使用字符串占位符 `TREE-A` / `TREE-OLD`，没有能检验复制完整树、深拷贝独立性、字段保留、动态规则、目标不支持规则或非法内部 payload 的具体 fixture。F01 Q012 明确要求截断、缺结构、合法序列化但非过滤配置均整次拒绝；Q015 要求完整承载或整次拒绝。

**影响：** Builder 无法按唯一规则判定有效输入、目标不兼容或损坏复制内容；`source_target_independent=true` 目前没有 mutation/probe 来执行。

**要求：** 冻结本切片独立的 input/output schema 与校验顺序，不调用失败的 CFP helper、不读取临时 RowAuth `field`；用嵌套实际过滤树 fixture 覆盖动态/通用字段与深拷贝，并增加无效/不兼容拒绝用例，精确断言提示、旧目标/载荷/预览/保存均不变。明确 source fixture 中的 field 身份如何验证及 target 的完整承载判定。

### CTC-004 / P1 / OPEN：应用后的预览失败、异步结果与成功提示语义不闭合

**位置：** Design :16、:31-35、:46-48；Cases CCOPY-002..005。

先替换 `view.customFilter` 再调用 `calcData(view)`，然后显示成功提示。源码中 `calcData` 会校验 refreshTime、发出 `calcData-{view.id}`、记 snapshot 并触发下游请求；它不是一个同步的“预览完成”返回值。设计未定义本地拒绝/异常、事件没有消费者、图表 query 失败/超时、数据空结果及已提交新树后的预览失败分别算粘贴成功还是失败，是否应回滚过滤树，何时允许显示成功提示。当前“任何校验失败或异常不得部分应用”无法覆盖异步取数失败。Cases 把 `logical_preview_refreshes:1` 当 oracle，却没有定义逻辑刷新单位或与实际 query 请求次数的关系，也没有刷新失败变体。

**影响：** 可能出现树已替换但预览未更新，却仍显示成功；也可能误要求 query 请求正好一次，而实际刷新路径包含额外合法请求。Q014 的成功立即预览与失败保持旧目标/预览无法以当前 oracle 判定。

**要求：** 区分同步 apply、预览调度、请求完成及失败；定义成功反馈的时点与失败后目标状态/旧预览状态。定义一次“逻辑预览”如何观测，单列 same-dataset 校验请求和 chart-data query 计数；Cases 覆盖 refreshTime 无效、query reject/timeout、取消/拒绝及无副作用 oracle。不要把 `calcData()` 被调用等同于预览成功。

### CTC-005 / P1 / OPEN：剪贴有效期与容量边界仅有候选值，冻结用例缺关键等值点

**位置：** Design :32、:39；Cases CCOPY-007、CCOPY-008。

Goal/Goal 工程边界要求 ISS-AC-01/02 在 Slice Design 中明确并独立评审，字节口径为 UTF-8、完整版本化过滤配置载荷的未压缩序列化字节，且 1MB=1,000,000 bytes 等于上限允许；当前设计仍称 TTL `[0,1,800,000ms)` 为候选、ISS-AC-01 未关闭，并称容量为切片约定但 ISS-AC-02 全量边界仍 open。Cases 只有 1,801,000ms 过期和“51 叶或大于 1,000,000 bytes”合并变体，没有 `0/1,799,999/1,800,000/1,800,001ms`；也未分别检查恰 50、恰 1,000,000 bytes 允许及 1,000,001 拒绝。

测量对象也不明确：设计称“完整 JSON 复制载荷”，但 Goal 的容量条款定义为版本化过滤配置载荷，可能不包括 uid/oid、来源 ID、时间等 envelope 元数据。没有冻结编码/规范化 JSON 规则或异常数值/多字节字符串字节算法。

**影响：** 两个边界目前无法实现成唯一判断，也无法用案例证明等值行为；复制内容 envelope 不同可改变容量决定。

**要求：** 由权威裁定/确认精确边界与计量对象，明确时钟来源和取整规则；Cases 将叶数、字节数拆成正交变体，固定完整版本化载荷构造和 UTF-8 byte-length oracle。未确认前不得写入产品 Builder 合同或声称 issue 关闭。

### CTC-006 / P1 / OPEN：允许的图表类型组合宽于本轮 Case 分母

**位置：** Design :6、:23、:30；Cases 顶层 `scope` 与 CCOPY-001..009。

目标和 Cases 声明的首轮用户路径是普通柱状图 → 普通折线图；但 Copy/Paste 合同实际上对源和目标分别允许柱图或折线图，从而包括 bar→bar、line→bar、line→line。9 个 Cases 仅覆盖 bar→line。若产品 UI按合同开放四种组合，另外三种组合没有被本轮冻结用例覆盖；若本 Slice 只实现 bar→line，则动作合同、copy/paste 可见性和 Builder action target 必须一并收窄为该组合。

**要求：** 在合同与 Cases 中统一本 Slice 的 source/target type matrix；如保留四种组合，逐种覆盖可接受的图表实例、过滤编辑和目标替换语义；不把这一首轮切片扩大为完整图表类型全集。

### CTC-007 / P2 / OPEN：失败/无效粘贴案例没有覆盖 API 异常及空/缺失 dataset identity

**位置：** Design :15、:31；Cases CCOPY-005。

Design 明确任何请求失败、tableId 缺失或 API 响应非肯定都应不改目标；CCOPY-005 只有本地 ID 不同和 API `false`，没有 source/target tableId null/empty/missing、API reject/timeout、malformed response、目标/source 已删除或 stale chart ID。Cases 中前端动作字符串和 expected 字段没有对 `checkSameDataSet` call count、拒绝提示、剪贴板状态及旧 snapshot 的统一断言。需将这些拒绝原因独立化，避免多个失败组合被同一个 `false` 结果遮蔽。

### CTC-008 / P2 / OPEN：copy 写入失败与源配置无法读取的保留规则缺少案例

**位置：** Design :23-26；Cases CCOPY-001。

设计要求来源为空时不启用、无效源或 localStorage 写入失败时保留上次载荷；Cases 只覆盖空剪贴板上的成功复制，未覆盖空树、坏树、localStorage quota/security exception、用户/组织缺失、来源 ID 缺失及覆盖已有 clipboard 失败。source-read/读取拒绝也未入例。

### CTC-009 / P2 / OPEN：确认覆盖、取消与保存重开 oracle 不足以闭合全链路

**位置：** Design :33-35、:46-48；Cases CCOPY-003/004/009。

CCOPY-004 对取消有目标/snapshot/preview/save 的零副作用期望，方向正确；CCOPY-003 只断言目标树和逻辑刷新次数，没有精确列出旧树整棵被替换、一次确认、dirty/snapshot、查询和成功消息时点。CCOPY-009 表示重开后树相同，却没有明确正常保存的结果成功、保存请求失败、已保存版本 ID/目标图表 ID及 reload 所读持久化载荷；设计的“沿既有 Dashboard 保存”需明确这份 chart `customFilter` 随所属 canvas 的哪一保存对象被写出和重开回读。应证明旧图表无变更、目标树完整独立，未保存离开不制造耐久效果，并对 save failure 保留“未持久化”状态。

### CTC-010 / P2 / OPEN：新增 MVP 阶段未落入本设计/案例的规范范围

**位置：** Design :6、:19-35、:46-54；Cases CCOPY-001..009。

本轮评审新增权威明确首个里程碑应是实际 UI 端到端 MVP，优先 bar→同数据集 line、合法过滤配置复制/粘贴、预览和保存重开；覆盖确认等复杂分支可后置，必要安全前提不得移除，最终 AC/范围不变。现有 Design r001 与此优先方向大体相容，CCOPY-001/002/009 也分别有复制、空目标粘贴/预览、保存重开候选路径；但合同仍把四种 bar/line source-target 组合及“目标已有条件先确认覆盖”都列入当前产品动作合同。Cases 没有一个把三步合为单一真实 UI E2E 的案例，且错误/权限/树完整性安全负例尚缺。

**影响：** 如果照当前合同实施，会把可延后的覆盖确认及额外图表组合提前带入 MVP；如果只执行用户授权的最小路径，Builder 对本轮案例是否完整满足合同又没有唯一答案。用户授权只建立阶段顺序，不是把未覆盖 AC 从最终范围移除。

**要求：** 将首个 Builder 切片明确收敛为 bar→line + 空目标这一正向产品路径，并组成一条端到端用例；覆盖确认、非空目标覆盖、其他方向/同类组合可列为后续阶段并继续保留在最终 AC backlog。MVP 仍必须保留所有安全前置：身份隔离/失效、真实 source-read 和目标/dataset 权限检查、同 dataset 双检查、完整输入与承载拒绝、TTL/容量约束、取消/失败无副作用、无系统剪贴板/自动保存、正常持久化成功才可声称重开保留。未实际具备真实权限契约/测试环境时，应继续阻止声称该 MVP 已满足安全验收。

## Cases 全量观察

| Case | 已覆盖部分 | 当前缺口 |
|---|---|---|
| CCOPY-001 | bar 来源、ID/用户标记、本地复制、系统剪贴板不变 | TREE-A 不是结构 fixture；无空/坏源、localStorage 失败、权限拒绝；“不读 source_config_api”不能代替 source-read 授权证据 |
| CCOPY-002 | bar→line 同数据集空目标、apply、calcData、无自动保存 | 无来源树实际形状/深拷贝 mutation、权限再验、请求失败、异步预览失败及刷新计数定义 |
| CCOPY-003 | 已有目标确认覆盖 | 无确认次数/提示、完整树 old removal、快照/dirty 及查询 oracle |
| CCOPY-004 | 取消无目标/snapshot/preview/save 副作用 | 缺少确认请求及剪贴板读取/写入计数；候选状态应保留 |
| CCOPY-005 | tableId 不同、API false 拒绝 | 缺失 ID、API reject/timeout、malformed response、stale/deleted resource、权限拒绝；负向调用计数 |
| CCOPY-006 | uid 或 oid 更换后本地内容不可消费 | 不证明 viewer 不能先读取/复制；没有真实角色、权限撤销、恢复、同 UID 权限降级或服务端拒绝 |
| CCOPY-007 | 过期 1,801,000ms 拒绝，不消费内容 | 0/1,799,999/1,800,000/1,800,001 精确 boundary 与重复粘贴不续期均未完整覆盖 |
| CCOPY-008 | 51 叶/超容量时保持旧 clipboard | OR 条件合并遮蔽分支；恰 50 和 1,000,000 byte 允许、51、1,000,001 拒绝分开；计量对象未冻结 |
| CCOPY-009 | 显式保存并关闭/重开后期望树相等 | 无 save success/failure 精确 oracle、持久化身份/版本、未保存退出、source chart 不变实际断言 |

Cases r001 目前不是可信 RED/GREEN 契约：缺 runner/executable fixture protocol，也未冻结用于 harness 的具体树、storage/API/event/save stubs 与 exact event/request counters。JSON parse 或字段齐备都不能代替其可信 RED。

## 其余核对与声明上限

- **筛选树源路径：** 静态证据支持 `FilterTree.changeFilter()` 清理后发 `filter-data`，editor 将 clone 结果写入 `view.customFilter`；这条线与 CFP helper 的失败返回 oracle 分离。仍需设计自己的输入 grammar 与 target completeness oracle，不得把字符串夹具或调用链分离夸成行为正确。
- **同数据集：** 本地完整 tableId equality 加后端 endpoint 双检查是必要的候选合同；API false 的场景已有，但异常/缺失 identity/授权行为未被 Cases 覆盖。该 endpoint 不是权限检查替代品。
- **目标替换/取消：** 整树替换及取消保持原配置方向与 Q007 一致；原子性还要扩展至 `calcData` 同步失败及异步 query 失败，才能支撑 Q014。
- **保存重开：** 普通 canvas 保存与重开可以是实现途径，但静态调用链不证明持久化写入、错误处理或重开结果；不得从调用 `canvasSave()` 宣称保存通过。
- **scope：** bar→line 可作为首轮增量而不关闭其它 Goal AC。须保存原分母与未实现项，不得将本Slice PASS 写成完整 Q004/Q006/Q007/Q014/Q015、权限或 S02 通过。
- **真实权限：** 当前材料支持 `BLOCKED / NOT_RUN`，不支持只读用户、撤权/恢复、数据访问或目标保存权限通过；standalone、admin、mock、UI 隐藏和静态 permission 名称均不是该验收的替代品。

## 定稿建议与 Builder Gate

**与已授权阶段的兼容判断：** 高层顺序兼容，且 r001 已含 bar→line 空目标应用/预览和正常保存重开的候选切片；但 r001 还没有把 MVP 与后续复杂覆盖行为分层。按新授权可将非空目标覆盖确认和其他图表组合移至后续里程碑，不能移除身份、权限、数据集、完整输入、TTL/容量、失败原子性及保存持久化等安全/正确性前提。

Design r001 不冻结；本轮应一次性处理 CTC-001..010 的发现，重点是恢复完整 S01/Goal 前置、绑定各权限动作的受保护 oracle、冻结 payload/target schema、定义预览失败语义、把 MVP 与后续覆盖分层、封闭 ISS-AC-01/02 边界。Cases 需重做成一条可执行端到端正向路径加正交安全拒绝用例，明确哪些最终 AC 暂未进入 MVP；再建立可信 RED 并独立审查。

**Design Freeze Validity：`NEEDS_REVISION`。MVP Implementation Entry Readiness：`BLOCKED_PENDING_EVIDENCE / NOT_READY_FOR_BUILDER`。** 用户已授权“先做 MVP”这一阶段顺序，但当前仍不能进入精确 Builder admission：被审候选未冻结、S01/Goal 前置证据未绑定、权限动作无可核验授权 oracle、ISS-AC-01/02 边界未定、可信 RED 与本轮后精确 action/target admission 缺失。用户阶段授权不等同于上述证据或安全前置。继续只做不依赖这些前置的设计/静态准备；不得将任何规划或离线结果冒充真实权限验证、完整 AC 通过或 S02 Goal 完成。
