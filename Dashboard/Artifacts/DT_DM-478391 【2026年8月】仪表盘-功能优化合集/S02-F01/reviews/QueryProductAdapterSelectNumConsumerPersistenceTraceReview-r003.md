# SH-SELECT-NUM consumer / persistence trace 独立最终评审 r003（3/3）

## 结论

**`PASS_WITH_FINDINGS / STATIC_CONSUMER_AND_PERSISTENCE_TRACE_ONLY`。这是该独立 Review 交付物第 3/3 轮最终结论，不再开启第 4 轮。** 当前候选 r002 对 r001 三项 findings 的修订与源码相符；r002 新增的 Topology r354 digest mismatch 已在本轮 Context 中重新绑定为当前摘要并消除。没有发现新的候选源码路径错误、数值分支错误或持久化 claim 越界。

本轮留下一个非阻断的 context 元数据问题：Review Context r003 自身的 `topology.reason` 仍写着“Review r002 is dispatched...”，但该 Context 的 `task_id` 是 Review r003，当前 Topology r357 也记录 r003 已 dispatch。此处是描述串未更新，不是文件摘要漂移，也未影响实际 read set 与候选审查范围；本最终 Review 不要求再开一轮修改。

原 Goal 分母继续保持 10 项 AC、26 项 must-have、16 项产品义务，`Scope Delta: none`。S01 F01 仍为 `CONDITIONAL`；真实多用户权限仍 `BLOCKED / NOT_RUN`；R4FS-001..004 仍 OPEN，R4FS-005 仍 `BLOCKED / NOT_RUN`。本报告只判断静态来源图，不证明 numeric schema、产品运行、后端持久化、权限或 Goal AC 已通过。

## 最终轮绑定与摘要复核

- Review Card r003 canonical SHA-256：`d3b8130d8043e8016f4e2ba372a59b35fc81ddf1d0a7b6abc61a964ecaf4cfc2`；`lane_task_card.py validate` 为 `pass`，Card 规定的本轮范围与输出路径一致。
- Review Context r003 SHA-256：`4799e2d61c82465346ce8da9188f5c2b964fe766830a82249b9c43b6e252eeb1`；结构校验退出码为 0；逐项重算 33 个 required-read digest，全部匹配，`skipped_reads=[]`。
- 被审候选 r002 SHA-256：`891bdaa1629ed48a1999f40e19e15e50b81c4d21d21d053682efa7f54d7e9bcb`；Review r001 SHA-256 `3d36895994116d49bd4440be37e1a12c40a13a1765ba9b534c90b2559bd03db4`；Review r002 SHA-256 `dfd004b7c3ce1e6d3f3f6583fa4f1dd2beee57040f82cfefb08d62830c8a55a8`，均与本轮 Context 所绑定摘要一致。
- 本轮依赖的 `Topology-actual-r356.json` 当前 SHA-256 为 `6a001321ed668455cb4822e89a2a692258adcc6e7347603d27f861f2d8700bb4`，与 Context 中 revision 一致；更近的 `Topology-actual-r357.json` SHA-256 为 `db5cd12c204711908c676dae7fc0c2480fda9e36c61ce7d8bf415b24e2d59dd8`，其 `phase=pre_validation` 中记录了本次 r003 dispatch、Context SHA、Card canonical SHA 和预期报告路径。该 r357 是后续实际拓扑记录，不是 Context r003 read set 中绑定的 r356 快照。
- r002 Review 中 SNCP-R2-001 指出的 r354 digest mismatch 已关闭：Review Context r003 的 required-read 对 `Topology-actual-r354.json` 绑定当前摘要 `abb7aeae6fac0db95125e767a93d5b5fd633203788a3be959f0ad4bf578710b5`，本次 33 项复算匹配；没有将 r002 报告写成当时不存在 drift。
- 当前源码（`Select.vue`、`Component.vue`、`useFilter.ts`、chart view、`canvasUtils.ts`、`dataVisualization.ts`）均按 Context 所列 SHA 匹配。未在 read set 之外扩展全仓审计。

## 前两轮 findings 的最终 disposition

| Finding | 最终状态 | 证据与判断 |
|---|---|---|
| SNCP-R1-001 / P2：遗漏 `optionFilter` 旁路及 operator 分支 | **已关闭** | r002 第 18-20 行增加 `useFilter.ts:373-395` 独立 `optionFilter` 筛选、`getOperator()` 普通选择默认 `in` 和 `fieldId` 含 `|DE|` 时按 `multiple` 覆写。源码与引用相符；候选未将服务端解释或合法组合升级为已知。 |
| SNCP-R1-002 / P2：`0` 与空值的消费门控未具体展开 | **已关闭** | r002 第 24-27 行区分 map-source 与普通 source 运行值 truthiness、first-load default 路径及主筛选的 Number/Date、length、displayType 8 门控；与 `useFilter.ts:141-155,467-508` 及 `forMatterValue():48-60` 相符。结论明确限于表达式，不推断产品预期或缺陷。 |
| SNCP-R1-003 / P3：源码范围 `316-...` 不可复核 | **已关闭** | r002 改为 `useFilter.ts:467-605`，并细分 `373-395`、`270-301`、`593-604` 等准确区间。 |
| SNCP-R2-001 / P3：Review Context 绑定的 Topology r354 摘要漂移 | **已关闭** | 本轮 Context 重绑当前 r354 bytes，33 项 required-read 全匹配；最新 r357 也记录了本次 review dispatch 和其 Context/Card 身份。 |

## 最终静态来源复核

- `Select.vue:249-289` 的运行态写 `selectValue/mapValue` 与配置态写默认/映射字段描述准确；`Component.vue:819-887` 的关联图表 key 收集、required 检查和 `query-data-*` 触发也没有被误称为 query payload 或完整查询验证。
- `useFilter.ts` 的一般选择值 helper、主筛选门控、非时间标量数组包装、独立 `optionFilter` 及 operator 特殊分支均有精确定位。type 2/5 仍没有被宣布为同一完整合法 schema，也没有从当前消费分支推定 2/5 的产品差异结论。
- chart view 中 `useFilter()` 的输出成为前端 `chartExtRequest.filter` 并交给 `calcData` 的描述准确；HTTP wire、后端 DTO、SQL 参数绑定和 datasource 方言仍未追踪。
- 普通保存、受管理保存和加载路径的前端 JSON 操作及 API 包装引用准确。JSON stringify/parse 只证明前端路径，不证明服务端持久化、事务提交、保存后同值重载、历史迁移或 undo/redo。
- r002 的 Numeric 0 描述区分了运行态 truthy 分支和可保留数字类型的 first-load/default 分支，没有断言 0 是合法选项、没有断言 0 应被过滤，也没有创建产品 oracle。
- 权限环境与 Goal 边界沿用 Context/Goal：standalone 不作为权限替补；查看/复制/粘贴读拒绝和撤权/恢复仍 `BLOCKED / NOT_RUN`。Goal 分母与 `Scope Delta: none` 未改变。

## 本轮唯一 finding

| ID / 严重性 | Finding | 影响及处理 |
|---|---|---|
| SNCP-R3-001 / P3 | **Review Context r003 的 `topology.reason` 描述仍指向 r002 dispatch。** Context 的 `task_id` 明确为 `S02-F01-SH-SELECT-NUM-CONSUMER-PERSISTENCE-TRACE-REVIEW-r003`，但其 `topology.reason` 写为 “Review r002 is dispatched against the post-log-refresh topology r356”。r357 已记录本次独立最终 Review r003 dispatch。 | 属 context 内一处 stale descriptive string；Context digest、Card digest、required-read 和实际 topology lineage 均可复核。它不影响候选 source trace 的真实性或范围，作为 P3 元数据 finding 保留，不阻断本静态结论。本轮已达 3/3，不再开第四轮。 |

## 最终结论上限

SH-SELECT-NUM consumer/persistence r002 可作为**有界静态来源索引**供后续工作引用；前四项 Review findings 已闭合，唯一遗留问题是上述非阻断 Context 描述串。不得把本结论当作 numeric Contract/合法 shape 冻结、query runtime 验收、后端 durable persistence、保存重载、权限验收、Builder admission 或 Goal 完成。

真实多用户只读拒绝、查看/复制/粘贴限制和权限撤销/恢复仍因缺少经授权权限实现与隔离实例而 `BLOCKED / NOT_RUN`。这份 r003 是该 Review 交付物第 3/3 轮最终报告；不修改候选、源码、测试、Goal、Contract 或 Cases。
