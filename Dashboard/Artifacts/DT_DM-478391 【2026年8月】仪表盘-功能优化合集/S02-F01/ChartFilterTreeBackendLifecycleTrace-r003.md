# Chart customFilter 编辑、计算、SQL 转换与持久化静态来源追踪 r002

## 交付物身份与边界

- Goal：`DE-S02-F01`；关联 S02.3（完整过滤树粘贴/计算）及 S02.4（保存重开）。
- 类型：当前工作树的静态调用链追踪，不是实现设计、运行证据或产品验收。
- 修订：处理独立 Review r001 的 F-CFT-001（联动树覆盖通道）和 F-CFT-002（Snapshot 保存范围）；未修改产品源码。
- 范围：图表编辑器 `view.customFilter` 从变更、计算请求、后端过滤树转换到图表保存/读取的代码路径；另区分 `chartExtRequest.filter` 与 `customFilter`。
- 不包含：查询组件 v-query schema、跨类别/同数据集/身份权限策略、复制源读取、目标确认与原子提交、即时预览/成功提示策略、数据库运行验证、权限验收、历史迁移与产品端到端测试。
- 原 Goal 分母保持 10 项 AC、26 项 must-have、16 项产品义务，`Scope Delta: none`。S01 F01 仍 `CONDITIONAL`；真实多用户权限验收仍 `BLOCKED / NOT_RUN`。

## 静态调用链

### 编辑器变更与取数触发分开

1. `core/core-frontend/src/views/chart/components/editor/index.vue:1594-1600` 的 `changeFilterData(customFilter)` 只将 `cloneDeep(customFilter)` 赋给 `view.value.customFilter`；打开树编辑时将当前值深拷贝后传给 `filterTree.init()`。该函数本身不调用 `calcData()`、不发 `calcData-{id}` 事件，也不保存。
2. 同文件 `:1024-1048` 的独立 `calcData(view)` 路径校验刷新周期；非移动编辑器发 `calcData-{view.id}` 并记录 `renderChart` 快照，再记录 `calcData` 快照。静态上这是另一个函数/调用路径，不能把 `changeFilterData()` 的赋值直接写成已触发取数或即时预览。
3. `core/core-frontend/src/views/chart/components/views/index.vue:885-897` 监听对应 `calcData-{id}`，下一帧生成 `chartExtRequest = filter(false)`，再调用组件取数；`:664-682` 的 `queryData()` 则把 `view.value` 深拷贝到请求参数并附加 `chartExtRequest`。实际调用时序/编辑器用户操作后的视觉预览效果需运行证据确认。

### 请求模型及两个过滤通道

4. `core/core-frontend/src/api/chart.ts:78-100` 的 `getData(data)` 将图表对象 POST 到 `/chartData/getData`；请求数据来自整个 `copyData`。`sdk/api/api-base/.../ChartDataApi.java:25-30` 将该端点绑定到 `ChartViewDTO` 请求体；`sdk/extensions/extensions-view/.../ChartViewDTO.java:14-31` 继承 `ChartViewBaseDTO` 并额外声明 `chartExtRequest`。
5. `chartExtRequest.filter` 是 `ChartExtRequest` 的组件/外部动态过滤列表；其元素 DTO (`ChartExtFilterDTO`) 与 `ChartViewDTO.customFilter` 是不同字段、不同数据通道。当前查询组件过滤对象不可据此当成图表静态自定义过滤树。
6. `core/core-backend/.../ChartDataServer.java:88-99` 非模板请求先 `DatasetUtils.viewDecode(chartViewDTO)`，再传给 `ChartDataManage.calcData()`；模板数据走 `extendDataManage.getChartDataInfo()`，不是这里追踪的 SQL 编译路径。
7. `ChartDataManage.java:157-173` 从 `view.getChartExtRequest()` 取动态请求对象并补全/注入当前用户，再检查关联图表。`:228-309` 处理 `chartExtRequest.filter`。`:311-320` 遍历 `linkageFilters`：`filterType == 3` 时将该 DTO 的 `customFilter` 赋给单一 `customLinkageFilter`，其他 linkage 项才进入 `filters`；多条 `filterType == 3` 项逐条赋值，最后一次赋值留下。`:322-329` 的 outer/web 参数再进入 `filters`。`:333-367` 对 `filters` 逐项分流：`fieldId` 包含 `DE` 的数据集参数分支在匹配到 SQL variable 时补充 `request.parameters`，不在此处加入 `extFilterList`；其他字段先通过数据集字段查找，再要求数据集与当前 view 相同，且若提供 `viewIds` 则需包含当前 view，满足时才加入 `extFilterList`。因此普通动态过滤项也不是无条件全部进入 `extFilterList`；动态普通项与自定义树覆盖是不同通道。当前静态路径没有给出多个 `filterType == 3` 项的上游约束或合并策略，保留为 `UNKNOWN / NOT_DECIDED`。

### 图表自定义树进入后端 SQL 表达式

8. `ChartDataManage.java:447-454` 将 `view.getCustomFilter()` 选为 `fieldCustomFilter`；若 `customLinkageFilter != null`，则用该 linkage 的 `customFilter` 覆盖 DTO 中的 view-level 树。此段判定为是否非空，不显式判断 linkage 的图表/指标类别。随后 `chartFilterTreeService.searchFieldAndSet()` 与 `charReplace()` 处理字段引用。
9. `ChartDataManage.java:485-489` 将 `fieldCustomFilter` 传给 `CustomWhere2Str.customWhere2sqlObj()`，并分别将 `extFilterList` 传给 `ExtWhere2Str.extWhere2sqlOjb()`。因此静态图表自定义过滤树与动态过滤组件在 query-to-SQL 转换中有分开的入口。
10. `core/core-backend/.../CustomWhere2Str.java:31-75` 在树非空时递归读取 `logic/items`，按 item 的 `type` 将叶传给 `transTreeItem()`、将 tree 节点递归处理，并按 `logic` 组合表达式。`:78-124` 从叶 `item.field` 读取字段类型/名称等元数据。此代码映射不证明具体过滤操作值域、参数绑定安全性、最终 SQL、数据库结果或所有方言语义；这些需独立追踪/验证。

### Snapshot 保存映射与按资源表分支读取

11. `core/core-backend/.../ChartViewManege.java:92-107` 的 `save()` 在事务中把 DTO 转换为 `SnapshotCoreChartView` 并写 `snapshotCoreChartViewRepository.saveAndFlush()`；`:519-546` 的 `transDTO2Record()` 返回该 Snapshot 记录类型，并将 `dto.customFilter` JSON 序列化存入 `record.customFilter`。这是此 `save()` 方法的 Snapshot 保存映射，不代表普通主记录保存入口。
12. 同类 `:139-155` 的 `getDetails()` 按 `resourceTable` 在 Snapshot 与普通记录 repository 之间分支，再统一调用 `transRecord2DTO()`；`:549-575` 将传入记录中的 `customFilter` JSON 解析回 `FilterTreeObj`。这是静态 DTO ↔ 记录字段映射，不证明任一实际数据库写入/事务提交、历史版本兼容、保存后重开值相同或 undo/redo。

## 可支持与不可支持的结论

- 可支持：当前代码将图表 `customFilter` 和 `chartExtRequest.filter` 作为不同字段处理；前者有独立 SQL 过滤树转换入口，并在图表 DTO/记录映射中单独 JSON 序列化与解析。
- 可支持：普通 linkage/outer/web 动态筛选项与 `filterType == 3` 的自定义 linkage 树采用不同处理分支；后者在非空时覆盖本次计算使用的 view-level 树。多个此类 linkage 项的上游约束和合并意图仍未确定。
- 可支持：追踪到的 `ChartViewManege.save()` 映射只证明写入 Snapshot 记录；`getDetails()` 另有按资源表读取普通记录或 Snapshot 的分支。
- 可支持：`changeFilterData()` 可见实现只赋值 `customFilter`，取数事件由独立 `calcData()` 路径发出；因此不能仅凭赋值函数声称已即时预览。
- 不可支持：复制粘贴已实现、变更后必定自动预览、拒绝操作不发成功提示、树 schema 已完整冻结、SQL runtime 或数据源行为正确、保存重开成功、权限保护已通过、Goal AC 通过或 S02 完成。
- Review r001/r002 disposition：F-CFT-001 已通过 `ChartDataManage.java:311-329,447-454` 补入自定义 linkage 树覆盖/普通过滤列表的区别，多项输入保持未决；F-CFT-002 已限定为 Snapshot 写入和按资源表读取分支；F-CFT-003 按 `ChartDataManage.java:333-367` 收窄为数据集参数补入 parameters、其他字段在 dataset/view 条件满足时才加入 `extFilterList`。最终处置等待本交付物独立 Review r003。
- `ChartFilterPayloadDesign-r003` 的最终 Review `NEEDS_REVISION` 和其 3/3 轮结论仍有效；本来源索引不修订或重开该设计，也不允许绕过其 Builder gate。

## 后续工作入口

先由独立 Reviewer 对本静态映射的来源精确性、字段通道区分、调用链完整性及 claim ceiling 一次性复核；最多三轮。若发现设计需要依赖即时预览、保存或权限语义，应先关闭相应 authority/design 缺口，再创建精确 Contract/Cases 和准入；本文件本身不发起 Builder。
