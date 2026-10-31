# SH-SELECT-NUM consumer / persistence trace 独立评审 r001

## 结论

**`PASS_WITH_FINDINGS / STATIC_CONSUMER_AND_PERSISTENCE_TRACE_ONLY`；可作为有界静态导航继续使用，尚不是 numeric consumer contract 或产品验收证据。** 候选准确指出 Select Number 当前值从组件状态进入前端 `chartExtRequest.filter` 的主路径，以及普通保存、受管理保存和加载时的前端 JSON 入口；保存/加载、后端数值解释、权限和 Goal 验收的边界也表达得当。没有发现足以否定该候选作为静态路径索引的错误断言。

仍有三项改进项：`useFilter` 的 filter 旁路及 operator 分支未完整列出；数值 `0` 和空值路径虽被提示有差异，但没有记录可直接复核的筛选门控；一个关键源码定位使用 `316-...`，无法作为精确行范围引用。它们不改变候选明示的 claim ceiling，但下游若要据此建立 numeric oracle，应先将这些控制流事实纳入来源图。

原 Goal 分母保持 10 项 AC、26 项 must-have、16 项产品义务，`Scope Delta: none`。S01 F01 仍为 `CONDITIONAL`；真实多用户权限环境仍 `BLOCKED / NOT_RUN`。R4FS-001..004 仍 OPEN，R4FS-005 仍 `BLOCKED / NOT_RUN`。本 Review 不证明查询、数字类型契约、保存重载、权限或任何 Goal AC 已通过。

## 评审绑定与摘要

Lane Card `sh-select-num-consumer-persistence-trace-review-card-r001.json` canonical SHA-256：`813270e3f941015311f3a642769354838355d66f2d4cd87be38d67481b7b3621`；`lane_task_card.py validate` 返回 `pass`，renderer prompt 与 Card execution command 一致。Context Bootstrap SHA-256：`ade09c15c4a9b5981d87d5103012b9230078ef0997f0c7b4f08673409c1ac141`；Context 验证通过，21 项 required-read 均存在且摘要匹配，`skipped_reads=[]`。候选 SHA-256：`3f3c4c88d0a4c714002292b63d4579ccd048cb5302928721e460fe9d04eac357`。当前工作树的关键源码摘要与 Context 相符：`Component.vue` `152703881a926e747e4e42f7c593a1558708efa73a3138cdb823cc519b01d081`；`useFilter.ts` `d2db975ae988218a921a5e3a76869e1a66d234eeebeedb1bfcf71e847e90416a`；chart view `index.vue` `2b0b1794737e35331a59569cd516078da898435e3f9c3db31d0287847240b1bd`；`canvasUtils.ts` `f9c68f5c96a716ed451206ef6efcbda27158cc828b578920ed5a15167bbc8282`；`dataVisualization.ts` `dc0a75b7a4abf308a41473de710c7d137b294c8b4915fe94f859744541cd4082`。

## Findings

| ID / 严重性 | Finding | 影响与建议 |
|---|---|---|
| SNCP-R1-001 / P2 | **`useFilter` 的筛选构造并非只有选中值这一条路径，候选没有列出独立筛选及 operator 覆写。** 候选第 14 行描述经 `forMatterValue()` 后构造 `{filterId, componentId, fieldId, operator, value, parameters, isTree}`，但 `searchQuery()` 在所选值处理前还会因 `optionFilter` 单独 push 一个 `operator: 'in'` filter（`useFilter.ts:373-395`）。主 filter 的 operator 由 `getOperator()` 决定；普通 displayType 2/5 分支默认为 `'in'`（`279-300`），字段 ID 含 `|DE|` 时又会依 `multiple` 覆写成 `'in'` 或 `'eq'`（`593-604`）。 | 作为“值进入 query filter”的主路径没有错，但读者可能误以为过滤项全部由 `selectValue/mapValue` 导出，或 operator 固定。建议补充 optionFilter 旁路、type 2/5 默认 operator 及字段 ID 覆写的静态事实，并保留这些组合的合法性及服务端语义未知。 |
| SNCP-R1-002 / P2 | **数值 0 的 consumer 筛选行为只被概括为“分支可能不同”，未记载值门控及分支实际结果。** `getValueByDefaultValueCheckOrFirstLoad()` 映射来源的后续分支用 `selectValue?.length` 决定选 `mapValue` 还是 `selectValue`，随后 `|| ''` 会把数值 0 归为空值（`useFilter.ts:141-150`）；普通来源的运行分支用 `selectValue ? selectValue : ...`，同样不会返回 0（`152-155`）。相反，first-load 勾选默认值时可直接返回 `defaultValue`；后续筛选门控接受 Number 类型，因此 0 会被格式化为 `[0]`（`467-493`、`forMatterValue()` `48-60`）。筛选门控是 `selectValue?.length`、Number/Date 类型或 displayType 8；其他空字符串/空数组通常不会进入主 filter（`481-508`）。 | 这正是 numeric shape 后续需要追踪的分支差异。建议把这组静态表达式及路径逐项列入来源索引，不替产品 owner 判定其是否预期，也不据此推导合法 numeric schema 或缺陷。 |
| SNCP-R1-003 / P3 | **源码定位不精确。** 候选第 14 行将 consumer 引用写作 `useFilter.ts:115-156,316-...`，省略号无法定位选值分支、filter emission gate、operator 和字段映射位置。 | 该路径可从候选的其他字段和 Context 复核，但引用不便复查。建议用精确范围 `316-605`，并按职责拆分 `373-395`、`467-605` 等范围。 |

## 逐项核对

- **displayType 2/5 与入口：** 候选没有将 2/5 的合法组合或数值 schema 冻结，这是正确的。查询消费者在 `searchQuery()` 中为普通选择分支调用通用 helper；type 2/5 的具体输出还受 `optionValueSource`、`defaultMapValue`、`displayId`、`multiple` 和目标字段 ID 影响。`displayType 9`、`8`、`22` 等有专门分支，不能从此普通选择分支外推。候选将类型组合及字段类型关系保留为未知，没有把 `Component.vue` 的 required 检查等同于完整查询验证；其“0 有专门 required 放行分支”与源码 `843-846` 相符。
- **筛选到 chart view：** `Component.vue:815-885` 收集关联图表 key 并发出 `query-data-{id}`；chart view 在 `725-733` 注册监听，`655-683` 创建并附加 `chartExtRequest` 后调用 `calcData()`。候选明确这只证明前端组装/转发，不等于 HTTP wire schema、后端 DTO 或 SQL 参数，claim 边界恰当。
- **保存路径：** 普通路径 `canvasUtils.ts:938-1001` 深拷贝组件数据、清理特定组件 linkage filter、JSON 序列化 `componentData` 并选择 `saveCanvas/updateCanvas`；API 包装位于 `dataVisualization.ts:66-97`。受管理路径 `canvasUtils.ts:841-934` 先进行 JSON round-trip/capture、加入 query design overlay，再执行 save intent 校验、调用同一 API 并 settle 状态。候选将其限定为前端代码路径，没有声称服务端落库成功或事务提交，描述成立。
- **加载路径：** `canvasUtils.ts:597-660` 选择 `findById` 或 `findCopyResource`，解析 `componentData` 并经过 `historyAdaptor`；API 包装位于 `dataVisualization.ts:24-40`。候选将后端持久化、历史兼容及 Save→Load 同值留为未验证，未把 `JSON.parse` 误写成往返正确性。
- **来源与历史评审：** 既有 `QueryProductAdapterSelectNumSourceTraceReview-r003` 将合法组合、数值 schema、durable persistence 和权限列为缺口；本候选延续这些界限，没有重开或覆盖既有 Review 结论。已核对引用路径的源码行与当前绑定摘要一致。

## 结论上限与后续

此交付物作为静态 consumer / 前端保存加载入口索引可继续使用，建议把三项 findings 带入后续来源图或 numeric Contract 设计。后续 numeric Contract 仍须独立定义 2/5 × single/multiple × option source/default/check × field/value metadata 的权威分母、值 identity 和 query oracle，并绑定自己的 Cases、准入与验证；不能用本静态 Review 代替这些工作。

真实多用户只读拒绝、查看/复制/粘贴限制、权限撤销/恢复仍因无经授权权限实现与隔离环境而 `BLOCKED / NOT_RUN`；不得以 standalone admin 或替补权限模块补证。本 Review 只写入本报告，不修改候选、源码、测试、Goal 或既有 Review。
