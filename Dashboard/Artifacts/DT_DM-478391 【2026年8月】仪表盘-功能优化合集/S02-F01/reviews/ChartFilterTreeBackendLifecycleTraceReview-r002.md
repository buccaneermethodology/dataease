# Chart customFilter 后端生命周期来源追踪 r002 独立审查

## 轮次、结论与范围

**第 2/3 轮。Verdict：`PASS_WITH_FINDINGS`。** r001 的两项 findings 均已在候选 r002 中得到实质处理，且核心链路引用与声明边界仍准确。本轮发现 1 项局部过滤列表归类表述需收窄；该项 non-blocking，不影响本追踪作为有界来源索引的用途。

本审查仅判断当前 checkout 中 `view.customFilter` 编辑赋值、取数请求、后端过滤树转换及 DTO/记录映射静态来源的准确性和完整性。Goal 分母仍为 10 项 AC、26 项 must-have、16 项产品义务，`Scope Delta: none`；S01 F01 `CONDITIONAL`、真实多用户权限验收 `BLOCKED / NOT_RUN` 均不变。本报告不证明产品运行、预览、SQL/数据库结果、持久化提交、保存重开、权限或 Goal AC 通过。

## 审查基线

- Review Card：`S02-F01-CHART-FILTER-TREE-BACKEND-LIFECYCLE-TRACE-REVIEW-r002`，canonical SHA-256 `82454632d0e34b5f8ad399b23fa767927642d5a29d02047b93e7f8ac97201de3`；`lane_task_card.py validate` 结果为 `pass`。
- Context Bootstrap SHA-256：`5c79020f44ddbf6e71d4bbbaf99a648231bd149ea0ca4a65dde6c93efa696940`；`context_bootstrap.py validate` 通过，29 项 required-read 摘要匹配，`skipped_reads=[]`。其中包含 r001 评审、r002 候选和本轮要求的原始来源；结论针对当前 checkout 绑定字节。
- 候选 `ChartFilterTreeBackendLifecycleTrace-r002.md` SHA-256：`9525e081e5977703a8b7e6c3069db9e33f2ec02a08fa2a67c726c477b2fa8bdb`。
- 工作树有本任务开始前的其他修改；本轮未修改候选、源码、测试、Goal 或 Contract/Cases，唯一写入为本报告。

## r001 Findings 处置

| Finding | 处置 | 复核结论 |
|---|---|---|
| `F-CFT-001`：linkage 内嵌树与普通动态过滤分支混写；多项和类别条件未决 | **已处理。** 候选第 7–8 点分别指出 `filterType == 3` 树单独写入单一变量、其他 linkage 与 outer/web 进入 `filters`，在后续按非空树覆盖 `view.customFilter`；明确多项合并与上游约束未知，并说明该代码没有显式作图表/指标类别判定。 | 复核 `ChartDataManage.java:311–329,333–367,447–454`，以上区分与后写覆盖描述准确。以下 F-CFT-003 另对 `filters` 到 `extFilterList` 的例外作收窄。 |
| `F-CFT-002`：保存范围未标 Snapshot | **已处理。** 第 11 点限定为 `SnapshotCoreChartView` 保存映射，第 12 点说明 `getDetails()` 按 `resourceTable` 分支读取 Snapshot 或普通记录，并保留未证明数据库提交和保存重开。 | 与 `ChartViewManege.java:92–107,139–155,519–575` 相符；没有再将该 `save()` 泛化为普通主记录保存入口。 |

## Findings

### F-CFT-003 — P3，non-blocking：普通过滤项并非都进入 `extFilterList`

**位置：** 候选第 7 点：“`:333-367` 将 `filters` 中的普通 linkage/outer/web 项处理成 `extFilterList`。”

**证据：** `ChartDataManage.java:333–367` 对 `filters` 按 `request.getFieldId().contains("DE")` 分支。包含 `DE` 的数据集参数分支在可用 SQL variables 中查找并将变量加入 `request.parameters`，此分支不执行 `extFilterList.add(request)`；非 `DE` 的数据字段分支还需通过同数据集及 `viewIds` 条件才添加进 `extFilterList`。因此这段代码是对过滤项进行分流和条件性加入，不能概括为所有普通 linkage/outer/web 项都会进入该列表。

**影响：** 如后续读者将“普通项”视为全部都参加 `ExtWhere2Str` 转换，会遗漏 SQL 数据集参数及被数据集/视图约束过滤掉的项目。该边界不改变 `filterType == 3` 树覆盖 `view.customFilter` 的判断，也不影响普通字段过滤项走 `extFilterList` 的路径。

**建议处置：** 将其改为“对 `filters` 逐项分流：非 `DE` 字段过滤满足数据集/视图条件时加入 `extFilterList`；`DE` 数据集参数路径并入 `parameters`，不在此处加入 `extFilterList`”。无须在本评审中扩展追踪所有参数来源或运行值语义。

## 其它静态结论复核

- **编辑与取数：** `editor/index.vue:1594–1600` 的 `changeFilterData()` 只深拷贝赋值；独立 `calcData()` 发出取数事件的调用链及 views 监听/请求附加 `chartExtRequest` 的引用仍准确。未据此宣称编辑动作必然触发取数或即时预览。
- **模型及 API：** `ChartViewDTO` 继承 `ChartViewBaseDTO` 并增加 `chartExtRequest`；`ChartExtFilterDTO.customFilter` 与 view-level `customFilter` 是不同属性。`ChartDataServer` 的非模板 decode → `calcData()` 路径及模板数据分支范围描述准确。
- **树到 SQL：** `ChartDataManage.java:447–454,485–489` 分别选择字段树并调用 `CustomWhere2Str`、将 `extFilterList` 交给 `ExtWhere2Str`；`CustomWhere2Str.java:31–124` 的递归 tree/item 和叶字段处理概述可由源码支持。没有把该映射升格成最终 SQL、参数安全或方言运行结论。
- **Snapshot 映射：** `save()` 到 Snapshot 记录及按 `resourceTable` 的读取分支说明精确；`transDTO2Record()` 的 `customFilter` JSON 序列化与 `transRecord2DTO()` 的解析是静态映射证据，不是实际保存/重开证据。
- **范围与 claim ceiling：** 候选仍保持 10/26/16 分母、`Scope Delta: none` 和权限未验证；明确不主张复制粘贴已实现、自动预览、拒绝提示、完整 schema、持久化成功、权限通过、Goal AC 通过或 S02 完成。它也没有改变 `ChartFilterPayloadDesign-r003` 的既有 `NEEDS_REVISION` 结论或 Builder gate。

## 结论边界

修订 r002 已准确关闭 r001 的 F-CFT-001、F-CFT-002；F-CFT-003 是其余局部陈述精度问题。Verdict 保持 `PASS_WITH_FINDINGS`，仅可作为当前 checkout 的有界静态来源追踪使用。此报告不授权 Builder，也不改变真实权限验证阻塞；后续设计若依赖数据集参数过滤的完整行为，应另行追踪相应来源。
