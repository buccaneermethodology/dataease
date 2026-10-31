# Chart customFilter 后端生命周期来源追踪 r001 独立审查

## 轮次、结论与范围

**第 1/3 轮。Verdict：`PASS_WITH_FINDINGS`。** 当前工作树的静态来源追踪主体准确，可作为后续设计追踪入口；有 2 项 non-blocking finding 需在后续引用或修订中保留。没有据此准入产品 Builder，也不以本审查替代产品验证。

本审查仅判断 `view.customFilter` 的编辑赋值、取数请求、后端过滤树转换和图表 DTO/记录映射的静态来源准确性及边界。原 Goal 分母仍为 10 项 AC、26 项 must-have、16 项产品义务，`Scope Delta: none`；S01 F01 仍 `CONDITIONAL`，真实多用户权限验收仍 `BLOCKED / NOT_RUN`。本报告不证明运行时序、预览效果、SQL/数据库行为、提交成功、保存重开、权限或任何 Goal AC 通过。

## 审查基线

- Review Card：`S02-F01-CHART-FILTER-TREE-BACKEND-LIFECYCLE-TRACE-REVIEW-r001`，canonical SHA-256 `1d38e136e16da7126d92d0b3b5fe361661a073564c209a1c7d2672c6e08066e7`；`lane_task_card.py validate` 结果为 `pass`。
- Context Bootstrap SHA-256：`a75393b400acd5ccfc4a502d4e39a2176bb70014e3fcccabaabcdf2cf4ad4f83`；`context_bootstrap.py validate` 通过，`skipped_reads=[]`。27 项 required-read 摘要均由 Context 校验；结论针对当前 checkout 绑定字节。
- 候选 `ChartFilterTreeBackendLifecycleTrace-r001.md` SHA-256：`1aec8b4d6811ec21e04bc0b963e78a934c2da0e059dba7169232eff7b644dd76`。
- 工作树存在任务开始前的其他未提交/未跟踪变更；本审查没有修改候选、源码、测试、Goal 或 Contract/Cases，唯一写入为本报告。

## 逐项判断

| 审查维度 | 结论 | 边界 |
|---|---|---|
| 前端编辑赋值与取数触发区分 | `PASS` | `changeFilterData()` 赋值与 `calcData()` 发出独立取数事件的静态路径区分准确；不推导用户操作后必然刷新或即时预览。 |
| 请求模型及过滤通道 | `PASS_WITH_FINDINGS` | `ChartViewDTO.customFilter` 与 `chartExtRequest.filter` 是不同字段/通道；但 linkage 内嵌自定义树存在独立覆盖分支，候选第 7、8 点需要按 Finding 001 限定。 |
| 后端过滤树转换 | `PASS` | `ChartDataManage` 选择/处理树并分别调用 `CustomWhere2Str`、`ExtWhere2Str` 的静态入口可定位；不证明 SQL 结果、值域、安全性或方言正确。 |
| DTO/记录保存读取映射 | `PASS_WITH_BOUNDS` | JSON 序列化/解析和普通记录、snapshot 读取分支定位总体准确；保存对象实际为 snapshot 记录，适用范围按 Finding 002 表述。 |
| Claim ceiling 与 Goal/权限边界 | `PASS` | 候选明确不宣称复制粘贴实现、产品验收、即时预览、持久化成功、权限通过或 Goal 完成，也保留既有权限阻塞及设计准入边界。 |

## Findings

### F-CFT-001 — P2，non-blocking：联动树例外与覆盖行为在第 7 点被概括掉

**位置：** 候选第 7–8 点。

**证据：** `ChartDataManage.java:311–329` 迭代 `chartExtRequest.linkageFilters`：`filterType == 3` 时将 `linkageFilter.customFilter` 赋给单个 `customLinkageFilter`，其余联动项才进入 `filters`；外部参数和 web 参数随后也进入该列表。该树没有作为普通联动项进入 `extFilterList`。在 `ChartDataManage.java:447–454`，`fieldCustomFilter` 初值为 `view.customFilter`，但 `customLinkageFilter != null` 时会被覆盖。循环写入单一变量还意味着多条 `filterType == 3` 项在此代码段中呈后写覆盖；静态来源未显示“只限指标表”条件。候选第 7 点把 linkage、外部参数、web 参数概括为都形成 `extFilterList` 且独立于 view-level 树，与第 8 点的覆盖描述不完全一致；第 8 点称“指标表联动”也比本段显式判定条件更窄。

**影响：** 后续设计若将所有 linkage 视为普通动态过滤项，可能漏掉嵌入的 FilterTree 覆盖通道或误判多项语义。当前追踪不能作为 linkage 多项合并/优先级或指标表限制的权威语义。

**建议处置：** 后续引用中明确区分 `chartExtRequest.filter`、普通 linkage/outer/web filter 列表，以及 `filterType == 3` 的 `customFilter` 树覆盖分支；将多个自定义联动树的语义和生产者侧约束保留为 `UNKNOWN / NOT_DECIDED`，除非有额外权威来源。此项不否定 `view.customFilter` 与普通动态过滤的通道区分。

### F-CFT-002 — P3，non-blocking：保存路径应标明 Snapshot 记录范围

**位置：** 候选第 11–12 点“图表配置保存和读取”。

**证据：** `ChartViewManege.save()` (`:92–107`) 调用 `snapshotCoreChartViewRepository`，将 DTO 转换后写入 `SnapshotCoreChartView`；`getDetails()` (`:139–155`) 则根据 `resourceTable` 在 snapshot 与普通 `coreChartViewRepository` 间选择读取。`transDTO2Record()` 对 `customFilter` 的序列化映射只能说明该 DTO 到记录字段的静态转换。

**影响：** 若把第 11 点泛化为普通主记录保存路径，读者可能将 snapshot 保存映射误作全部图表配置的唯一持久化入口。当前证据也不能说明调用方、事务在目标环境中的提交结果或重新打开后的等价性。

**建议处置：** 将该段命名为“Snapshot 保存映射及按资源表分支读取”，并说明普通记录读取分支确实存在；继续将真实写入/提交及保存重开行为标为未验证。该 finding 不推翻 DTO/记录 JSON 字段映射本身。

## 复核依据与后续边界

- 前端：`editor/index.vue:1024–1048,1594–1600`；`views/index.vue:664–682,885–897`；`api/chart.ts:78–100`。
- 请求/后端：`ChartViewDTO`、`ChartViewBaseDTO`、`ChartExtRequest`、`ChartExtFilterDTO`；`ChartDataServer.java:88–99`；`ChartDataManage.java:157–173,228–329,447–489`。
- 过滤树与映射：`CustomWhere2Str.java:31–124`；`ChartViewManege.java:92–107,139–155,519–575`。
- 后续可以继续做有界设计工作，但不得把本静态报告当作产品运行或持久化 authority。它不修订/重开 `ChartFilterPayloadDesign-r003` 的既有 `NEEDS_REVISION` 结论，不改变 Builder gate，也不关闭真实权限验证阻塞。
