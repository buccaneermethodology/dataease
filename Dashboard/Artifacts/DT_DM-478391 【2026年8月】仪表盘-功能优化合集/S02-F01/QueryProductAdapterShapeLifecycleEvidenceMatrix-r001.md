# Query Shape 生命周期源码证据矩阵 r001

状态：`candidate / NOT_REVIEWED`。本交付物是当前 checkout 的静态源码路径索引，不是产品 Design Freeze、产品行为验证或 Builder 准入。目标 Goal 仍为 10 项 AC、26 项 must-have、16 项产品义务，`Scope Delta: none`；产品义务仍未验收。

## 结论边界

本矩阵仅回答：对全形态设计中已列出的 shape，当前源码能定位到创建/配置、运行消费和前端画布保存/加载的哪些入口；哪些生命周期阶段仍没有充分来源。它不定义完整合法 shape 分母，不从 `displayType × multiple × valueSource × default` 的笛卡尔积推导有效组合，也不把一条 UI 分支当作完整 schema。

权威材料当前可用于有界来源收集和非依赖设计。Authority Materials 主包正式结论仍为第 3/3 轮 `NEEDS_REVISION`。审后更正仅支持“指定 Q014 来源指针已修正”；更正及其 Review 不重判/翻转主包结论。AM-08 保留非阻断导航/时态歧义。AM-Q02 原概览/细化映射问题在当前字节已澄清；赢家、迟到/重放/重复提交和预览次数仍未知。S01 F01 仍 `CONDITIONAL`；真实权限环境 `BLOCKED / NOT_RUN`。

## 全局生命周期证据

| 阶段 | 当前可观察来源 | 可支持的事实 | 未能据此声称 |
|---|---|---|---|
| 通用初始配置 | `core/core-frontend/src/custom-component/v-query/options.ts:1-77` | `infoFormat` 提供通用缺省字段，含 `displayType: '0'`、`multiple: false`、options/default/field/parameter等成员 | 所有 shape 专属配置结构完整；创建入口只此一处；旧数据迁移规则 |
| 配置/确认 | `core/core-frontend/src/custom-component/v-query/QueryConditionConfiguration.vue`；当前已追到数值参数端点与类型切换、字段选择及相关快照记录 | 配置逻辑按 displayType 和配置状态写入字段；数值参数路径存在 start/end/array 分支 | 每个 shape 的独立确认事务、所有工厂、字段全集、产品级合法组合 |
| 运行消费 | `Select.vue`、`TextSearch.vue`、`Tree.vue`、`FilterTime.vue`、`DynamicTimeRange.vue`、`Component.vue` | 不同 shape 的运行态分属不同消费者；`Select.vue` 有 selectValue/mapValue、默认值和级联选项路径；`Component.vue` 对 required/default 和 shape 分支有运行检查 | 整体复制后的运行结果、完整查询语义、全部数值/时间序列化边界 |
| 图表消费/刷新 | `core/core-frontend/src/views/chart/components/views/index.vue`；`Component.vue` 调用 query 生命周期并发出查询事件 | 存在过滤组件到图表计算/渲染的前端连接入口 | 当前静态路径证明每次刷新次数、请求成功、相同记录 ID 或错误回滚 |
| 前端画布保存/加载 | `core/core-frontend/src/utils/canvasUtils.ts:597-660,841-1001`；`core/core-frontend/src/api/visualization/dataVisualization.ts:24-40,66-97` | 加载分支解析 `componentData` 并交给历史适配/Store；保存分支对画布数据 JSON 序列化并调用 save/update API；query 生命周期另有受管理保存分支 | 后端持久化、事务提交、字段精度/默认值兼容、真实 Save→Load 同值 |
| 快照/撤销重做 | `core/core-frontend/src/store/modules/data-visualization/snapshot.ts:83-213`；`dvMain.ts` 的组件数据更新和 query 调度路径 | 存在快照记录/发布与事件流程以及嵌套组件遍历 | 每个 shape 的历史兼容、过滤条件复制后的 undo/redo 正确性或并发/迟到结果语义 |
| 权限与身份 | 当前主仓库可见 SDK 契约及 standalone substitute；真实 xpack 权限实现和授权隔离环境不可用 | 权限检查必须保留为入口前置；S01/真实环境现状明确为条件/阻塞 | 只读用户拒绝查看/复制/粘贴、撤权/恢复、source-read/target-commit 已通过 |

## 按 shape 的可追踪性

| Shape / 配置轴 | 配置与确认 | 运行消费 | 生命周期状态与关键未知 |
|---|---|---|---|
| `SH-SELECT-TEXT`，`displayType=0` | 通用配置源 `options.ts:1-77`；字段/参数配置由 QCC 管理；确认分支须按选项来源继续逐段核对 | `Select.vue` 处理 defaultValue/selectValue/mapValue、单/多选和级联；QCC/Component 有必填消费逻辑 | **局部可追踪**；`optionValueSource` 全部枚举、默认首项/手工值编码及保存后重载 schema 未冻结 |
| `SH-SELECT-NUM`，`displayType=2/5` | QCC 对数字字段与数值参数有分支；2 与 5 在选择能力与参数映射上需分别看待 | `Select.vue` 查询/回写和 `Component.vue` 必填判断；已完成 Select-Num source 与 consumer/persistence 有界索引 | **局部可追踪**；数值与字符串值、0/null/空值、两个 displayType 的合法组合、配置确认与端到端查询 oracle 未冻结 |
| `SH-TEXT`，`displayType=8` | QCC 维护 conditionType 与 F/S 条件输入；通用工厂不构成完整 schema | `TextSearch.vue` 运行文本条件，`Component.vue` required/default 分支处理 F/S | **局部可追踪**；查询 consumer 全部 operator 与 F/S 组合的完整契约、持久化 round-trip 未证明 |
| `SH-NUM-RANGE`，`displayType=22` | QCC 数值参数/范围端点映射；需保留 start/end 与参数数组的方向关系 | `Component.vue` 对 0 和缺值分支作 required 检查；筛选值最终经既有 query 链路消费 | **局部可追踪**；开闭端规则、缺端语义、保存和消费的完整类型行为未知 |
| `SH-FIXED-TIME`，`displayType=1` | QCC 与 `FilterTime.vue` 提供时间类型、固定/范围配置入口 | `FilterTime.vue` 消费固定日期与限制配置 | **局部可追踪**；时区、粒度、序列化和边界 oracle 未冻结 |
| `SH-DYNAMIC-TIME`，`displayType=7` | QCC 与 `DynamicTimeRange.vue` 有动态规则配置/回写路径 | `DynamicTimeRange.vue`/`FilterTime.vue` 结合时间格式工具消费相对区间 | **局部可追踪**；now/timezone/DST/月末规则、规则和计算值隔离及持久化恢复未验证 |
| `SH-TREE`，`displayType=9` | QCC 树字段选择和 treeCheckedList 配置入口 | `Tree.vue` 消费树层级和所选路径 | **局部可追踪**；分隔符/混深/空节点编码与结果 oracle、跨保存恢复未知 |
| `AX-CASCADE`（跨上述可选 shape） | `QueryCascade.vue` 维护级联关联；Select 的级联选项回调触达 displayType 0/2/5 | QCC/组件和 dvMain query 调度按关联 ID 传播变化 | **不能作为独立 shape 计入分母**；合法跨数据集关系、目录闭包、环/共享节点及身份重绑需独立证据 |
| `AX-PARAMETER`（跨 shape） | QCC 的参数字段映射、时间/数值端点路径 | 最终经各 shape consumer 和后续查询通路 | **不能作为独立 shape 计入分母**；完整 DTO、参数身份、`|DE|` 编码、端点方向和混合目标尚未闭合 |

## 设计输入与禁止推论

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
- 当前源码版本由配套 Context `planning/ContextBootstrap-R4-SHAPE-LIFECYCLE-EVIDENCE-MATRIX-r001.json` 的 required_read_set SHA-256 绑定；未检查的 server persistence、XPack 权限实现和测试环境不在本矩阵的证据范围内。
