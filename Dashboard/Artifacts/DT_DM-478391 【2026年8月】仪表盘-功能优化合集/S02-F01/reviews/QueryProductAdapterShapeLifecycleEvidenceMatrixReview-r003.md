# Query Shape 生命周期源码证据矩阵最终独立 Review r003

## 结论

**矩阵 r003：`PASS_WITH_BOUNDS / STATIC_SOURCE_INDEX_ONLY`。这是该矩阵交付物第 3/3 轮最终 Review，不再开启第 4 轮。** r003 已修复 r001 Review 的三个 findings，并关闭 r002 Delta Validation 提出的源码 read-set 绑定缺口。当前未发现矩阵源码引用越界、哈希不匹配、时间/shape 轴误映射、FullShape overlay 遗漏或静态事实过度推论。该矩阵可作为有界静态来源索引，为下一步独立设计和受精确合同/准入约束的离线 helper 设计提供输入；不构成产品 Design Freeze、产品 UI/Store/source-read/target-commit Builder 准入或产品验收。

本 Review 只评价矩阵 r003 当前字节。不会重开 Authority Materials、FullShape、Select-Num 或本矩阵的既有评审轮次，也不以此报告关闭任何 Goal AC。

## Review 入口、快照与 read-set

- Review Card：`planning/r4-shape-lifecycle-evidence-matrix-review-card-r003.json`，canonical SHA-256 `c68296f0981323448495281f12885b25b1601528a62942b3ab5c1faea0c7b641`；SP-010 `lane_task_card.py validate` 返回 `pass`。write_scope 与 required_outputs 均只包含本报告。
- Review Context：`planning/ContextBootstrap-R4-SHAPE-LIFECYCLE-EVIDENCE-MATRIX-REVIEW-r003.json`，SHA-256 `994bff497db1c73df208a24663c516d34ec7c391d47ef54627b292ae6521bde4`；40/40 required-read 条目的 SHA-256 与当前字节匹配，`skipped_reads=[]`。
- 被审矩阵 r003：SHA-256 `befd807c1263b234062b18705fa7d7fce0ae079ef41ab8eb0b44fa922c1a2330`。目标路径、Card、Goal 摘要与 Context 一致。
- 为核验矩阵对其 paired Builder Context 的读集声明，按矩阵引用扩读 `planning/ContextBootstrap-R4-SHAPE-LIFECYCLE-EVIDENCE-MATRIX-r003.json`。该 Context SHA-256 为 `5baefca6e82ce50391a4bacbb8aabdc34d2dbfac8a5786d34a4c06decf32c38b`，39/39 required-read 摘要匹配，`skipped_reads=[]`。矩阵引用的画布 API、权限 API、三份 substitute 源码、PermissionEnvironment 与 S02-S09 Entry Packet 均在该 Builder Context 的 read set 中。
- 独立核对矩阵中 55 组带行范围/锚点的源码和材料引用：没有缺失文件、越界行号或空范围；其逐文件 SHA 均由 paired Builder Context 绑定。静态锚点可定位不构成运行行为证据。
- 按完整基线读取 Goal、UserIntent、CoverageMatrix、Sessions、Authority 主 Review 与更正 Review、FullShape r003 与最终 Review、Select-Num source/consumer-persistence 索引及最终 Review、矩阵 r001 Review 与 r002 Delta Validation，以及 Card 指定源码。未运行产品、未改源码、Goal、矩阵、Cases、CoverageMatrix 或其他文件。

### 入口元数据备注（非阻断）

Review Card 顶层 `card_id`、Review Context `task_id` 与目标均为 r003，但 Card 内 `topology.task_id` 仍写成 `S02-F01-R4-SHAPE-LIFECYCLE-EVIDENCE-MATRIX-REVIEW-r001`。Card 结构和 canonical SHA 校验通过，目标、write_scope、read-set 和 Review Context 均明确绑定 r003；该字段是陈旧的 topology 描述，不改变本次评审对象或输出路径。将此备注留给控制面后续单独修正，不回写本轮 Card/Context，也不把 Card validator 的 pass 扩大解释为 topology 一致性证明。

## r002 Validation findings 的全量处置

| Finding | 最终状态 | 复核证据 |
|---|---|---|
| `SLM-R1-001 / P2` 时间显示轴与固定/动态规则轴混淆 | **已关闭** | 矩阵 r003 的 SH-FIXED-TIME 和 SH-DYNAMIC-TIME 均将 `displayType=1/7` 作为时间/日期范围显示轴，并以 `timeRange.regularOrTrends=fixed/dynamic` 表示规则。QCC `3053–3068` 将 1/7 标为时间与日期范围；FilterTime `58–63` 按 `regularOrTrends` 选择动态状态和子组件。合法组合仍为未知，未由源码推导。 |
| `SLM-R1-002 / P2` FullShape cross-shape overlays 遗漏 | **已关闭** | 矩阵 r003 将五个 overlay 全部独立列为 `AX-TIME-RESTRICTION`、`AX-OPTIONS`、`AX-CASCADE`、`AX-PARAMETER`、`AX-HISTORY-NESTING`；其与 FullShape Design r003 中的列表一致，并明确不计入 shape 分母。 |
| `SLM-R1-003 / P3` 引文缺少行范围/锚点 | **已关闭** | UI、Store、canvas API 与权限契约/substitute/状态材料均补充可定位行号或符号锚点；55 组引文经逐项检查，均存在且行范围有效。 |
| `SLM-R2-001 / P3` paired Builder Context 未绑定矩阵引用的全部来源 | **已关闭** | 矩阵 r003 限定声明只适用于 paired Context `required_read_set` 中逐文件 SHA；该 Builder Context 当前39项摘要全部匹配，且矩阵明确列出的画布 API、权限 API、substitute 与状态材料均在集合内。未读/未列入文件不被暗中纳入证据。 |

以上均是矩阵来源索引的处置结论，不表示 corresponding 产品行为或验收已经通过。

## Matrix r003 的逐项来源与语义核验

### Shapes

- **`SH-SELECT-TEXT`，`displayType=0`（矩阵第33行）：** `options.ts:1–66` 的通用初始对象、QCC 字段/参数映射、Select 单/多选/默认/映射/级联路径及 Component required/default 分支定位均可复核。选项来源全集、默认首项/手工编码、保存重载 schema 继续标为未知。
- **`SH-SELECT-NUM`，`displayType=2/5`（第34行）：** QCC 的 2/5 配置路径、Select 的枚举/回写和 Component required/default 引用与绑定来源相符。Select-Num 两个有界索引仍不是合法组合分母或端到端 numeric oracle；数值/字符串、0/null/空值和 query/persistence 边界保留为未知。
- **`SH-TEXT`，`displayType=8`（第35行）：** QCC 文本条件配置、TextSearch F/S 条件及 Component required/default 位置有效；operator 全集、F/S 完整组合和 durable round-trip 没有被声称已知。
- **`SH-NUM-RANGE`，`displayType=22`（第36行）：** QCC 的参数端点路径与 Component 的 0/缺值 required 分支定位有效。矩阵只说明局部路径；开闭端、缺端、完整消费类型仍未知。
- **`SH-FIXED-TIME` / `SH-DYNAMIC-TIME`（第37–38行）：** 两行正确区分规则字段与显示字段。QCC `3053–3068`、FilterTime `54–66`、`58–63` 和 DynamicTimeRange `95–155` 支持所述配置/消费路径。displayType 与固定/动态规则的合法配对、时区/DST/月末、计算值与规则隔离及保存恢复仍未冻结或验证。
- **`SH-TREE`，`displayType=9`（第39行）：** QCC 树字段选择/回写及 Tree `95–147` 的所列路径存在；编码、混深、空节点 oracle、保存恢复继续未知。

### Cross-shape overlays

- **`AX-TIME-RESTRICTION`（第40行）：** QCC 时间限制/粒度分支及 FilterTime 时间范围配置引用可定位。限制规则与默认规则的完整区分、端点时区 oracle 和保存恢复仍明确未知。
- **`AX-OPTIONS`（第41行）：** 手工值、optionFilter、custom sort、枚举/观察与异步选项路径可定位。remote/field/manual 完整白名单、`sortList` 和 `optionFilter` 全语义、迟到响应适用全集和恢复行为仍未知。
- **`AX-CASCADE`（第42行）：** QueryCascade 关系路径、Select 级联重取、Component 查询事件和 dvMain 调度引用有效；跨数据集合法关系、闭包、环/共享节点与身份重绑没有被推出。
- **`AX-PARAMETER`（第43行）：** QCC 字段映射/端点来源可定位；完整 DTO consumer、参数身份、`|DE|` 编码、端点方向和混合目标保持未知。
- **`AX-HISTORY-NESTING`（第44行）：** Group/DeTabs 遍历、快照发布与画布保存加载路径均能从所列源码定位；嵌套闭包、缺省/迁移、并发保存和逐 shape undo/redo 兼容没有被声称通过。

以上 overlays 明确属于跨 shape 的独立配置/载体轴，不计为独立 shape；矩阵禁止从轴笛卡尔积推导合法 shape 支持集合，未列组合既不默认支持，也不默认不支持。

### 生命周期、权限和状态 claim

矩阵第15–21行把通用配置、配置确认、运行消费、图表刷新、前端画布保存/加载、快照/撤销重做及权限/身份分开。矩阵给出的 API JSON 解析/序列化、Store 快照与查询事件仅证明所引前端路径存在；服务端持久化事务、耐久性、真实 Save→Load 同值、历史迁移、每 shape undo/redo 与每次刷新结果仍未证明。素材行没有把文件名或 API path 冒充这些行为证据。

权限行引用 AuthApi/ResourceAuthApi 契约、三份 standalone substitute 源码、PermissionEnvironment 与 S02-S09 Entry Packet；矩阵准确区分契约、仅 admin 的 substitute 行为、环境状态与 Slice 进入条件。真实 XPack 权限实现和隔离实例不可用，因此只读查看/复制/粘贴拒绝、撤权/恢复、source-read/target-commit 均继续 `BLOCKED / NOT_RUN`；没有用 standalone/admin/mock 替代权限验收。

### Authority、Goal 分母及结论上限

- Authority Materials 主包仍为 3/3 `NEEDS_REVISION`；审后更正只支持指定 Q014 指针/条款级修正，不翻转主包结论。AM-08 导航/时态歧义仍是 non-blocking；AM-Q02 概览/细化映射当前字节已澄清，而同会话赢家、迟到/重放/重复 commit 结果及预览次数仍未取得完整 authority。
- Goal 保持 **10 项 AC、26 项 must-have、16 项产品义务和 `Scope Delta: none`**。矩阵关联 AC-S02-02..09 只做设计/证据追踪；16 项产品义务未验收，本 Review 不改 CoverageMatrix 状态。
- S01 F01 仍 `CONDITIONAL`；真实权限环境仍 `BLOCKED / NOT_RUN`。不把 S01 已有局部证据视为 S02 权限场景通过。
- 本轮只允许把矩阵作为 bounded static source index 用于后续独立设计准备。任何后续产品实现仍需完整合同/案例、可信 RED/GREEN、独立 Review/Validation 和匹配当前 topology 的精确 execution admission；权限依赖未解除时，不准入依赖真实权限的产品用例。

## 最终处置

矩阵 r003 可用于后续设计的来源定位工作，claim ceiling 仍是静态源码索引。作为第 3/3 轮最终 Review，不再重开本矩阵的第 4 轮；后续若需修订内容，应作为新交付物/明确版本变更并另行治理，不以改名重置轮次，也不得覆盖本报告。该结论不关闭 S02 Goal，且不是产品实现准入或验收。
