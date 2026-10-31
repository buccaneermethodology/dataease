# Chart customFilter 后端生命周期来源追踪 r003 独立最终审查

## 轮次与最终结论

**第 3/3 轮。Verdict：`PASS_WITH_FINDINGS`，仅限当前 checkout 的有界静态来源追踪。** r001 的 `F-CFT-001`、`F-CFT-002` 和 r002 的 `F-CFT-003` 均已在候选 r003 中得到准确处置；本轮全量复核未发现调用链主体或 claim ceiling 的新实质错误。仍有 1 项 P3 文档身份标注问题：r003 路径内标题仍标为 r002，且修订摘要未列本轮对 F-CFT-003 的更新。

此为该交付物最后一轮评审，不发起第 4 轮。Verdict 允许将候选用作当前 checkout 有界静态来源索引，但调用方引用时必须以 r003 路径和摘要识别内容，保留下述版本标注问题。它不准入产品 Builder，不改变 S02 Goal/Contract 的接受状态或既有 Builder gate。

本报告只判断 `view.customFilter` 的编辑、取数请求、后端过滤树转换与 DTO/记录静态映射。原 Goal 分母保持 10 项 AC、26 项 must-have、16 项产品义务，`Scope Delta: none`；S01 F01 仍 `CONDITIONAL`，真实多用户权限验收仍 `BLOCKED / NOT_RUN`。本报告不证明运行行为、预览、SQL/数据库结果、持久化提交、保存重开、权限、任一 AC 通过或 S02 完成。

## 审查基线

- Review Card：`S02-F01-CHART-FILTER-TREE-BACKEND-LIFECYCLE-TRACE-REVIEW-r003`，canonical SHA-256 `4f95ccccb2ac748d96b13d5aabbf26828960d913b3a3686af942ed4a791dd1ad`；`lane_task_card.py validate` 结果为 `pass`。
- Context Bootstrap SHA-256：`12898a348046b546b15ffd592702059d8197bc7ad83ebd126870fb811db5d0c3`；`context_bootstrap.py validate` 通过，31 项 required-read 摘要匹配，`skipped_reads=[]`。Context 包含 r001/r002 候选及评审、本轮候选和绑定源码；拓扑基线为 `Topology-actual-r360.json`。
- 候选 `ChartFilterTreeBackendLifecycleTrace-r003.md` SHA-256：`2b725d67e6f0eda7b0a30e687326c811deb95f68ef7ea9b7df05c024580d1221`。
- 工作树存在开始前已有变更。本轮只写入本报告；没有修改候选、源码、测试、Goal 或 Contract/Cases，也未运行产品或权限验证。

## 既有 Findings 全量处置

| Finding | 最终处置 | 复核依据与边界 |
|---|---|---|
| `F-CFT-001`（r001）：`filterType == 3` linkage 内嵌树被第 7 点混同于普通过滤列表，且多项/类别约束不明 | **已处理，可关闭。** 候选第 7–8 点区分单一 `customLinkageFilter` 与普通 `filters`，说明后续非空时覆盖 `view.customFilter`；多项输入保留 `UNKNOWN / NOT_DECIDED`，并指出该段代码无显式类别条件。 | `ChartDataManage.java:311–329,333–367,447–454`：满足。静态代码只说明后写赋值，不证明上游不可能保证单项，也不定义业务优先级。 |
| `F-CFT-002`（r001）：保存映射未限定 Snapshot 范围 | **已处理，可关闭。** 候选第 11–12 点限定 `save()` 写 Snapshot 记录，并分别说明按 `resourceTable` 读取普通记录或 Snapshot。 | `ChartViewManege.java:92–107,139–155,519–575`：满足。仍仅为静态映射，不证明数据库事务提交或保存重开等价。 |
| `F-CFT-003`（r002）：并非所有普通 linkage/outer/web 项都会进入 `extFilterList` | **已处理，可关闭。** 候选第 7 点说明 `DE` 数据集参数分支只在匹配 SQL variable 时补充 `request.parameters`，非该分支字段须满足数据集与 view 限定才加入 `extFilterList`。 | `ChartDataManage.java:333–367`：满足。该表述未将运行值、所有外部参数来源或最终 SQL 语义扩展为已知。 |

## 最终全量复核

- **编辑到取数请求：通过。** 候选第 1–3 点区分 `changeFilterData()` 的深拷贝赋值与 `calcData()` 独立发事件，并定位 views 监听、`queryData()` 请求快照及 `chartExtRequest` 附加位置。源码行段 `editor/index.vue:1024–1048,1594–1600`、`views/index.vue:664–682,885–897` 支持这些静态陈述；不蕴含用户编辑一定触发刷新、预览或保存。
- **DTO/API 与过滤通道：通过。** `ChartViewDTO.customFilter` 与 `ChartExtFilterDTO.customFilter` 是不同字段：后者经 `ChartExtRequest.linkageFilters` 在 `filterType == 3` 分支参与 view-level 树选择；`chartExtRequest.filter` 又是独立列表。候选第 7–9 点已把三条路径分开，不再概称 linkage 全进 ext list。`ChartDataServer` 的非模板 decode/calc 路径及模板分支界线也有绑定来源支持。
- **动态筛选的条件性收集：通过。** `ChartDataManage.java:228–309` 对 `chartExtRequest.filter` 做字段与视图过滤；`:311–329` 把 `filterType != 3` linkage 与 outer/web 项汇入中间 `filters`；`:333–367` 再区分 `DE` 参数补充 `parameters` 与普通字段的 dataset/view 检查。候选没有将中间列表等同于最终 `extFilterList`，也准确将 `filterType == 3` 多项覆盖保持为来源侧未知。
- **树到 SQL 表达式：通过。** `ChartDataManage.java:447–454,485–489` 选择当前计算使用的 FilterTree 并分别调用 `CustomWhere2Str` 与 `ExtWhere2Str`；`CustomWhere2Str.java:31–124` 对树逻辑、item/tree 节点递归与叶字段引用的概述符合源码。候选清楚保留运算符取值、参数安全、最终 SQL、方言和数据库结果的验证边界。
- **Snapshot DTO/记录映射：通过。** `ChartViewManege.save()` 在 `:92–107` 写 `SnapshotCoreChartView`；`getDetails()` 在 `:139–155` 依 `resourceTable` 选择普通或 Snapshot repository；`:519–546,549–575` 对 `customFilter` 序列化/解析。候选第 11–12 点限定准确，没有声称真实落库或重开通过。
- **范围、权威和 claim ceiling：通过。** 候选保留 Goal 分母与权限状态；将查询组件 schema、跨类别/身份策略、复制提交策略、预览、历史迁移和运行验收排除在本静态追踪范围外；明确不能证明复制粘贴、权限、保存重开、AC 或 S02 完成。它也保留 `ChartFilterPayloadDesign-r003` 的 `NEEDS_REVISION` 与既有 Builder gate，不擅自把来源追踪等同于设计批准。

## 本轮唯一剩余 finding

### F-CFT-004 — P3，文档身份标注未同步到 r003

**位置：** 候选 r003 第 1 行和第 7 行。

**证据：** 卡片、Context、实际文件路径和本轮任务均把当前交付物标识为 r003，但正文标题仍是“静态来源追踪 r002”；第 7 行修订摘要只列“处理独立 Review r001 的 F-CFT-001/F-CFT-002”，没有列已处理的 r002 `F-CFT-003`。正文第 45 行又正确记录了 F-CFT-003 的处置，故这是版本标题/修订摘要不一致，不是候选内容仍遗漏该修正。

**影响：** 脱离文件路径单独摘录标题或修订记录时，可能把当前内容误认为 r002，削弱来源版本可追溯性。Card/Context/候选路径和 SHA 已唯一绑定本次内容，且静态链路本身可复核，所以不推翻本报告主体结论。

**最终处置：** 本交付物已达到第 3/3 轮上限，不创建第 4 轮。接收方如继续引用，应使用完整文件路径及候选 SHA-256 `2b725d67…` 标识，而不要仅凭正文标题引用。此 finding 保留为已知文档瑕疵；不据此授予产品实现或验收准入。
