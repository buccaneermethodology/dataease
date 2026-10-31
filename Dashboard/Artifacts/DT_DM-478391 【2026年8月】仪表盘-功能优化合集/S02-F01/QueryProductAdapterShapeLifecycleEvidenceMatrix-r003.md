# Query Shape 生命周期源码证据矩阵 r003

修订说明：依据 r002 独立 Review 与 Delta Validation，保留已校正的时间规则/显示轴和五项横切轴；为权限 API、standalone substitute 及状态材料补充精确锚点，并将当前来源绑定声明与 r003 Context `required_read_set` 对齐。原始范围不变，Scope Delta：none。

状态：`candidate / NOT_REVIEWED`。本交付物是限定于配套 Context 明确绑定来源的当前 checkout 静态源码路径索引，不是产品 Design Freeze、产品行为验证或产品代码 Builder 准入。目标 Goal 仍为 10 项 AC、26 项 must-have、16 项产品义务，`Scope Delta: none`；产品义务仍未验收。

## 结论边界

本矩阵仅回答：对全形态设计中已列出的 shape，当前源码能定位到创建/配置、运行消费和前端画布保存/加载的哪些入口；哪些生命周期阶段仍没有充分来源。它不定义完整合法 shape 分母，不从 `displayType × multiple × valueSource × default` 的笛卡尔积推导有效组合，也不把一条 UI 分支当作完整 schema。

权威材料当前可用于有界来源收集和非依赖设计。Authority Materials 主包正式结论仍为第 3/3 轮 `NEEDS_REVISION`。审后更正仅支持“指定 Q014 来源指针已修正”；更正及其 Review 不重判/翻转主包结论。AM-08 保留非阻断导航/时态歧义。AM-Q02 原概览/细化映射问题在当前字节已澄清；赢家、迟到/重放/重复提交和预览次数仍未知。S01 F01 仍 `CONDITIONAL`；真实权限环境 `BLOCKED / NOT_RUN`。

## 全局生命周期证据

| 阶段 | 当前可观察来源 | 可支持的事实 | 未能据此声称 |
|---|---|---|---|
| 通用初始配置 | `core/core-frontend/src/custom-component/v-query/options.ts:1-66` (`infoFormat`) | `infoFormat` 提供通用缺省字段，含 `displayType: '0'`、`multiple: false`、options/default/field/parameter等成员 | 所有 shape 专属配置结构完整；创建入口只此一处；旧数据迁移规则 |
| 配置/确认 | `core/core-frontend/src/custom-component/v-query/QueryConditionConfiguration.vue:363-490` (`setParametersArrNum`/`setParametersArr`/端点写入)，`1620-1710`（确认与快照记录) | 配置逻辑按 displayType 和配置状态写入字段；数值参数路径存在 start/end/array 分支 | 每个 shape 的独立确认事务、所有工厂、字段全集、产品级合法组合 |
| 运行消费 | `Select.vue:478-520,533-562`（默认值/运行值与级联回写），`TextSearch.vue:18-32,58-91,179`，`Tree.vue:95-147`，`FilterTime.vue:54-66`，`DynamicTimeRange.vue:95-155`，`Component.vue:346-420`（required/default分支） | 不同 shape 的运行态分属不同消费者；`Select.vue` 有 selectValue/mapValue、默认值和级联选项路径；`Component.vue` 对 required/default 和 shape 分支有运行检查 | 整体复制后的运行结果、完整查询语义、全部数值/时间序列化边界 |
| 图表消费/刷新 | `core/core-frontend/src/custom-component/v-query/Component.vue:387-460` (`queryDataForId`/查询事件)，`core/core-frontend/src/views/chart/components/views/index.vue:39-49,90-99`（`useFilter`与可视化Store连接入口) | 存在过滤组件到图表计算/渲染的前端连接入口 | 当前静态路径证明每次刷新次数、请求成功、相同记录 ID 或错误回滚 |
| 前端画布保存/加载 | `core/core-frontend/src/utils/canvasUtils.ts:597-660,841-1001`（加载、managed save、普通保存分支），`core/core-frontend/src/api/visualization/dataVisualization.ts:24-40,66-97` (`findById`/`findCopyResource`/`saveCanvas`/`updateCanvas`) | 加载分支解析 `componentData` 并交给历史适配/Store；保存分支对画布数据 JSON 序列化并调用 save/update API；query 生命周期另有受管理保存分支 | 后端持久化、事务提交、字段精度/默认值兼容、真实 Save→Load 同值 |
| 快照/撤销重做 | `core/core-frontend/src/store/modules/data-visualization/snapshot.ts:83-193,210-225`（快照记录与发布），`core/core-frontend/src/store/modules/data-visualization/dvMain.ts:526-600,1038-1110,1744-1822`（组件数据/嵌套与 query 调度) | 存在快照记录/发布与事件流程以及嵌套组件遍历 | 每个 shape 的历史兼容、过滤条件复制后的 undo/redo 正确性或并发/迟到结果语义 |
| 权限与身份 | `sdk/api/api-permissions/src/main/java/io/dataease/api/permissions/auth/api/AuthApi.java:21-43,62-70,88-94`（资源树、授权查询/保存契约）；`ResourceAuthApi.java:19-35`（授权用户/主体查询契约）；standalone substitute：`SubstituleLoginServer.java:19-43,47-57`（仅 admin 登录并生成 uid=1 token）、`SubstituteUserServer.java:22-51`（固定 admin 用户信息）、`SubstituleOrgServer.java:14-29`（单个超级管理员挂载项）；`AGENTS.md §5`；`PermissionEnvironment.md:3-22`；`SP-005/S02-S09_EntryPacket.md:5-13` | 权限契约有精确接口定位；standalone 替补行为局限为上述代码；环境状态/进入条件由绑定状态文档支持，真实权限实现不可用 | 不证明只读用户拒绝查看/复制/粘贴、撤权/恢复、source-read/target-commit；不得把 substitute 或 admin 结果当真实权限验证 |

## 按 shape 的可追踪性

| Shape / 配置轴 | 配置与确认 | 运行消费 | 生命周期状态与关键未知 |
|---|---|---|---|
| `SH-SELECT-TEXT`，`displayType=0` | `options.ts:1-66` (`infoFormat`)；QCC 字段/参数映射 `QueryConditionConfiguration.vue:1708-1720,2097-2129` | `Select.vue:478-520,533-562` 处理 defaultValue/selectValue/mapValue、单/多选和级联；`Component.vue:346-360,370-385` 有必填/default消费逻辑 | **局部可追踪**；`optionValueSource` 全部枚举、默认首项/手工值编码及保存后重载 schema 未冻结 |
| `SH-SELECT-NUM`，`displayType=2/5` | QCC 选择器值 `QueryConditionConfiguration.vue:3035-3051`、数字输入 `3492-3500`；2 与 5 在值写入上分别处理 | `Select.vue:478-520,533-562,1085-1093` 查询/回写与级联；`Component.vue:370-385` 必填/default判断；Select-Num source 与 consumer/persistence仅为有界索引 | **局部可追踪**；数值与字符串值、0/null/空值、两个 displayType 的合法组合、配置确认与端到端查询 oracle 未冻结 |
| `SH-TEXT`，`displayType=8` | `QueryConditionConfiguration.vue:3583-3610` 的文本条件配置；通用工厂不构成完整 schema | `TextSearch.vue:18-32,58-91,179`；`Component.vue:346-360,398-406` required/default 分支 | **局部可追踪**；查询 consumer 全部 operator 与 F/S 组合的完整契约、持久化 round-trip 未证明 |
| `SH-NUM-RANGE`，`displayType=22` | `QueryConditionConfiguration.vue:363-421` 数值参数/范围端点路径；保留 start/end 与参数数组方向 | `Component.vue:361-368,408-420` 对 0/缺值分支作 required 检查 | **局部可追踪**；开闭端规则、缺端语义、保存和消费的完整类型行为未知 |
| `SH-FIXED-TIME`，规则轴 `timeRange.regularOrTrends=fixed`；`displayType=1/7` 是时间/日期范围显示轴 | `QueryConditionConfiguration.vue:3053-3068` 标示 1=时间、7=日期范围；`FilterTime.vue:54-63` 消费 intervalType 并选择子组件 | `FilterTime.vue:58-60` 以 `regularOrTrends !== fixed` 判动态 | **局部可追踪**；1/7 与固定规则的合法组合、时区、粒度、序列化和边界 oracle 未冻结 |
| `SH-DYNAMIC-TIME`，规则轴 `timeRange.regularOrTrends=dynamic`；`displayType=1/7` 是时间/日期范围显示轴 | `QueryConditionConfiguration.vue:3053-3068` 标示 1=时间、7=日期范围；`DynamicTimeRange.vue:95-155` 有动态区间回写 | `FilterTime.vue:58-63,78-175` 结合动态标志、粒度及相对区间消费 | **局部可追踪**；1/7 与动态规则的合法组合、now/timezone/DST/月末 oracle、规则与计算值隔离和持久化恢复未验证 |
| `SH-TREE`，`displayType=9` | `QueryConditionConfiguration.vue:341-350,2070-2095` 树字段选择和 `treeCheckedList` 回写 | `Tree.vue:95-147` 消费树层级和所选路径 | **局部可追踪**；分隔符/混深/空节点编码与结果 oracle、跨保存恢复未知 |
| `AX-TIME-RESTRICTION`（跨时间 shape） | `QueryConditionConfiguration.vue:1534-1552,3181-3203` 有 `setTimeRange` 过滤及时间粒度配置；`FilterTime.vue:35-66,78-175` 有 intervalType/timeRange/timeGranularity 分支 | 固定/动态规则共用时间组件和限制入口；实际 query结果边界未在本切片执行 | **跨shape轴，不计独立shape**；`setTimeRange`/`timeRange` 如何区分限制规则与默认规则、端点/时区 oracle 与保存恢复仍未知 |
| `AX-OPTIONS`（跨选择 shape） | `QueryConditionConfiguration.vue:3520-3543` 有手工选项配置；`Select.vue:304-352,390-400,722-757,848-890,1085-1093` 有optionFilter/custom sort、观察输入、异步枚举与级联重取路径 | `Select.vue:478-520,533-562` 消费枚举返回、默认/运行值与cascade map | **跨shape轴，不计独立shape**；remote/field/manual provider白名单、sortList/optionFilter完整语义、迟到响应的产品全集与保存恢复未知 |
| `AX-CASCADE`（跨上述可选 shape） | `QueryCascade.vue:47-81,142-164` 维护级联关联；`Select.vue:1085-1093` 触发级联选项重取 | `Component.vue:387-460` 与 `dvMain.ts:1744-1822` 按关联ID触发查询 | **跨shape轴，不计独立shape**；合法跨数据集关系、目录闭包、环/共享节点及身份重绑需独立证据 |
| `AX-PARAMETER`（跨 shape） | `QueryConditionConfiguration.vue:363-490,599-635` 包含字段映射、双端参数路径 | 最终经各 shape consumer 和后续查询通路；完整 DTO consumer 尚未闭合 | **跨shape轴，不计独立shape**；完整 DTO、参数身份、`|DE|` 编码、端点方向和混合目标尚未闭合 |
| `AX-HISTORY-NESTING`（跨 shape carrier） | `core/core-frontend/src/store/modules/data-visualization/dvMain.ts:72-76,526-600` 与 `core/core-frontend/src/utils/canvasUtils.ts:85-91,1417-1452` 可见 Group/DeTabs 嵌套遍历入口 | `core/core-frontend/src/store/modules/data-visualization/snapshot.ts:83-193` 有快照记录/发布；`core/core-frontend/src/utils/canvasUtils.ts:597-660,841-1001` 有前端保存加载入口 | **跨shape轴，不计独立shape**；完整目录闭包、历史缺省/迁移、并发保存与每shape undo/redo 兼容仍未知 |

## 设计输入与禁止推论

FullShape 的跨形态维度按独立 overlay 列为 `AX-TIME-RESTRICTION`、`AX-OPTIONS`、`AX-CASCADE`、`AX-PARAMETER`、`AX-HISTORY-NESTING`；前两者和 History/Nesting 仅有界静态定位，未被视作 shape 支持分母。

1. shape 行是已有设计中的证据组织键，不是维护者确认的支持列表；未列出的组合不得默认为 unsupported，也不得由 axes 组合生成案例分母。
2. 配置对象被某处读写，只能支持该路径的静态存在；JSON 整体序列化/解析只能支持前端数据通路存在，不能证明服务端 durable save、历史兼容或 undo/redo。
3. `selectValue`、`mapValue`、`defaultValue`、参数映射、动态时间规则和运行计算值必须分阶段辨认。复制/迁移实现不得从被运行态污染的对象推断可信设计来源。
4. 当前可继续的是独立静态设计与有单独合同、可信 RED/GREEN、精确 admission 的离线 helper；本矩阵不授权产品 UI/Store/source-read/target-commit build。
5. 任何涉及只读用户拒绝、撤权、会话代际/fencing、可信时间的案例，在真实权限实现和隔离实例可用前均为 `BLOCKED / NOT_RUN`；不得用 standalone/admin/mock 替代。

## AC 与分母

本文件关联 AC-S02-02..09 的设计/证据追踪，不能将其记为通过。Goal 原始 10 项 AC、26 项 must-have、16 项产品义务完整保留，`Scope Delta: none`；本切片不更新 CoverageMatrix 的产品状态。

## 输入证据

- `reviews/AuthorityMaterialsRequestReview-r003.md` 与 `reviews/AuthorityMaterialsPostReviewCorrectionReview-r002.md`。
- `QueryProductAdapterFullShapeDesign-r003.md` 与 `reviews/QueryProductAdapterFullShapeDesignReview-r003.md`。
- `QueryProductAdapterSelectNumSourceTrace-r003.md`、其 Review r003、`QueryProductAdapterSelectNumConsumerPersistenceTrace-r002.md` 与其 Review r003。
- 本矩阵所引的当前工作树源码及状态文档，仅以配套 Context `planning/ContextBootstrap-R4-SHAPE-LIFECYCLE-EVIDENCE-MATRIX-r003.json` 的 `required_read_set` 中逐文件记录的 SHA-256 为绑定范围；该读集现包含本矩阵明确引用的 `dataVisualization.ts`、`AuthApi.java`、`ResourceAuthApi.java`、三份 standalone substitute 源码、`PermissionEnvironment.md` 与 S02/F01 Entry Packet。未列入该读集的文件不受本声明绑定。未检查的服务端持久化实现、XPack 权限实现和隔离运行环境不在本矩阵证据范围内。


## 前轮 Review 与 Delta Validation 处置

- `SLM-R1-001 / P2`：已修复。固定/动态规则绑定 `regularOrTrends`，`displayType=1/7` 明确为时间/日期范围显示轴；合法组合仍未知。
- `SLM-R1-002 / P2`：已修复。五项 cross-shape overlay 均单独列出且不计入 shape 分母。
- `SLM-R1-003 / P3`：本版补齐。主要来源均有可定位行号/符号锚点；权限契约和 substitute 锚点见上表。
- `SLM-R2-001 / P3`：本版修复。矩阵第61行（本版对应绑定边界）只声明与 r003 Context `required_read_set` 中逐文件 SHA 相符的来源；明确未纳入/未审查的 XPack 权限与服务端持久化来源不被绑定。新 Context required-read 纳入本矩阵引用的 API、substitute、画布 API 和状态文件。
