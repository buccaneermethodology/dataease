# SH-SELECT-NUM consumer / persistence trace 独立评审 r002

## 结论

**`PASS_WITH_FINDINGS / STATIC_CONSUMER_AND_PERSISTENCE_TRACE_ONLY`；SNCP-R1-001..003 均已准确处置，r002 可作为有界静态来源索引继续使用。** 候选补入 `optionFilter` 旁路及 operator 规则，具体列出普通运行值中 `0`/空字符串的分支结果与主筛选门控，并把 `useFilter` 的引用改为精确行范围。复核源码后，这些修订与当前实现一致，没有发现新的候选路径或持久化断言错误。

本轮唯一新 finding 是 Review Context 中 `Topology-actual-r354.json` 的摘要已漂移；其余 required-read 摘要匹配，候选、Goal、源追踪、主要源码和 r001 Review 均可复核。该漂移降低本次 dispatch topology 的快照可复现性，但当前实际 Topology 仍标记本 review 为 `pre_review` 且引用同一候选及 Context；不影响此静态来源图内容结论。后续 topology 记录应以当前摘要更新或解释漂移，不能报告为全量摘要匹配。

Goal 分母仍为 10 项 AC、26 项 must-have、16 项产品义务，`Scope Delta: none`。S01 F01 仍 `CONDITIONAL`；真实多用户权限仍 `BLOCKED / NOT_RUN`。R4FS-001..004 仍 OPEN，R4FS-005 仍 `BLOCKED / NOT_RUN`。本 Review 不证明产品查询、numeric schema、后端持久化、保存重载、权限或 Goal AC 已通过。

## 评审绑定与 read-set 状态

Lane Card canonical SHA-256 `8ac2ddcbaf2ef421590292de95ce0524cee515b16a0a25fe40a26319f4f45451`，`lane_task_card.py validate` 返回 `pass`，renderer 输出的 execution command 与 Card 一致。Review Context 文件 SHA-256 `ac6899df40d1fe4875b13875ba3fc063e8a89281213247009d38df0311fa7510`；Context 结构校验退出码为 0，声明 28 项 required-read、`skipped_reads=[]`。逐项重算后 27 项摘要匹配、1 项漂移：

| 路径 | Context 中摘要 | 当前摘要 | 处理 |
|---|---|---|---|
| `Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/planning/Topology-actual-r354.json` | `8a6e84bd74c5364d39e219f2f3c70defa3c69ff92c535cebc857de5cd0a26ac6` | `abb7aeae6fac0db95125e767a93d5b5fd633203788a3be959f0ad4bf578710b5` | 记录为 topology 摘要漂移；不把它写成全量 read-set 摘要通过。 |

r002 候选 SHA-256 `891bdaa1629ed48a1999f40e19e15e50b81c4d21d21d053682efa7f54d7e9bcb`；r001 Review SHA-256 `3d36895994116d49bd4440be37e1a12c40a13a1765ba9b534c90b2559bd03db4`。Goal SHA、目标源码及相关来源记录的 required-read 摘要均匹配。r002 候选 Context 声明 22 项 required-read、`skipped_reads=[]`，人工逐项复算均匹配。当前源码的主要 consumer/save/load 行与候选引用一致。

## r001 findings disposition

| 前轮 Finding | Disposition | 复核结果 |
|---|---|---|
| SNCP-R1-001 / P2：遗漏 `optionFilter` 和 operator 分支 | **已完整处置** | r002 第 18-20 行补充独立 `optionFilter` push、普通选择默认 `in` 及 `|DE|`/`multiple` 覆写。`useFilter.ts:373-395,270-301,593-604` 支持这些表达。候选也保留服务端解释和合法组合未知。 |
| SNCP-R1-002 / P2：`0`、空值的 consumer 结果只作泛化提示 | **已完整处置** | 第 24-27 行区分映射来源、普通来源运行值、first-load 默认值和主筛选门控；与 `useFilter.ts:141-155,467-508` 及 `forMatterValue():48-60` 的表达式一致。候选没有把差异推导为缺陷或合法 schema。 |
| SNCP-R1-003 / P3：`316-...` 非精确行引用 | **已完整处置** | 已改为 `searchQuery` 主筛选路径 `467-605`，并将旁路、operator 和特殊字段覆写拆出为精确范围；各范围可复核。 |

## 当前来源与 claim 核查

- `Select.vue:249-289` 将运行态选择回写到 `config.value.selectValue/mapValue`，配置态写默认与映射字段；`Component.vue:819-887` 做 required 校验、收集关联图表并发事件。候选未把事件当 payload，也把 0 放行限制在 required 检查，准确。
- `useFilter.ts:115-156` 的普通选择 helper、`467-508` 的值门控、`48-60` 的非时间标量包装、`509-605` 的主筛选构造与 r002 描述相符。映射来源的运行值数值 0 会经 `|| ''` 归空；普通运行值路径也以 truthiness 归空；主筛选门控允许来自未被前述分支转空的 Number/Date 值。此为静态路径事实，不表示实际 UI 产生这些值或产品预期如此。
- `optionFilter` 独立 push 仍位于关联目标图表条件内，且不依赖主选值是否通过门控。候选所写“独立于后续主筛选门控”准确；没有声称它脱离整个关联查找流程。
- `index.vue:456-480,655-690,723-731` 显示 `useFilter()` 产物进入前端 `chartExtRequest.filter`，再作为 view 参数交给 `calcData`。候选没有将其等同 HTTP 序列化、后端 DTO、SQL 绑定或查询结果。
- 普通保存 (`canvasUtils.ts:938-1001`) 与受管理保存 (`841-934`) 的 JSON 深拷贝/round-trip、payload 及 API 选择描述有界；加载 (`597-660`) 的 `findById/findCopyResource`、`JSON.parse` 和 `historyAdaptor` 路径也准确。`dataVisualization.ts:24-40,66-97` 只证明前端 API 包装，不能证明持久化已提交。后端保存、历史迁移、保存重开同值及 undo/redo 仍被候选列为未验证，边界适当。
- 候选继续明确不冻结 displayType 2/5 的合法 shape 或 numeric schema；不改变 Goal 分母、R4FS 状态、S01 条件状态和权限阻塞。没有把本静态索引升级为设计冻结、Builder 准入或 Goal 完成证据。

## 新 finding

| ID / 严重性 | Finding | Disposition |
|---|---|---|
| SNCP-R2-001 / P3 | **Review Context 的实际 Topology 摘要漂移。** `ContextBootstrap-SH-SELECT-NUM-CONSUMER-PERSISTENCE-TRACE-REVIEW-r002.json` 绑定 `Topology-actual-r354.json` 摘要 `8a6e84...`，当前文件摘要为 `abb7ae...`。Context 结构校验通过并不消除这个逐文件 digest mismatch。 | 本次以当前 Topology 可见的 `task_id=...REVIEW-r002`、`phase=pre_review` 和 candidate/Context 引用继续限定审查；未以此声称摘要完全匹配。建议在本轮执行记录中追加当前摘要并说明差异，后续轮次绑定最新 topology。此项是 Context/Topology 快照可复现性问题，不是候选代码路径错误，也不改变本报告的静态结论。 |

## 结论上限与下一步

r002 在其声明范围内吸收了 r001 三项 findings，可用于后续静态来源导航。若需要继续改写候选，应由作者决定是否单独补全 Context/Topology 摘要对账；不要通过修订号重置本 review 的轮次。后续 numeric Contract 仍需另行冻结权威分母、合法组合、值 identity、wire/backend oracle 和 Cases，再匹配 admission 与验证。

真实多用户只读拒绝、查看/复制/粘贴限制及权限撤销/恢复仍因无经授权的权限实现和隔离环境而 `BLOCKED / NOT_RUN`；不得用 standalone 替代。本报告仅对静态来源索引进行 Review，不代表产品或 Goal 验收。
