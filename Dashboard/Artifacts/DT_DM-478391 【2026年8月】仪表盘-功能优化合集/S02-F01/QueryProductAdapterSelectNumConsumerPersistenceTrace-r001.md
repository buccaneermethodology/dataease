# SH-SELECT-NUM 消费者与持久化来源追踪 r001

## 身份与 claim ceiling

这是独立于 `QueryProductAdapterSelectNumSourceTrace-r003` 的后续静态来源索引，覆盖 select number 当前配置值进入查询筛选构造，以及仪表板/大屏前端保存与重新加载入口。它不冻结 displayType 2/5 的合法形态或 numeric schema，不证明任何查询、后端保存、恢复、撤销/重做、权限或 Goal AC 已验收。

原 Goal 分母保持 10 项 AC、26 项 must-have、16 项产品义务，`Scope Delta: none`。S01 F01 仍为 `CONDITIONAL`；真实多用户权限环境仍 `BLOCKED / NOT_RUN`。来源文件摘要和本次 read set 以配套 Context Bootstrap 为准。

## 配置值进入 query filter 的静态路径

1. `core/core-frontend/src/custom-component/v-query/Select.vue:249-289` 的变更处理在运行态分别更新 `config.value.selectValue` 与 `config.value.mapValue`；配置态处理更新默认值及映射字段。字段存在于查询组件的 `element.propValue` 条目中；此静态事实本身不确认其 API 类型或持久性。
2. `core/core-frontend/src/custom-component/v-query/Component.vue:819-887` 的 `queryData()` 从查询组件条目读取 `selectValue` 做 required 检查，遍历条目收集关联图表 key，并以 `query-data-{viewId}` 发事件。0 有专门 required 放行分支。该事件是触发入口，不是 query payload。
3. `core/core-frontend/src/views/chart/components/views/index.vue:456-480,655-690,723-731` 通过 `useFilter()` 形成 `chartExtRequest.filter`，把结果附入 chart view 参数并调用 `calcData`；该组件注册同一 view 的 `query-data-*` 监听器。此处只证明前端组装和转发关系。
4. `core/core-frontend/src/hooks/web/useFilter.ts:115-156,316-...` 对 query condition 选择 first-load/default 或运行值：若 `optionValueSource===1`、存在 `defaultMapValue` 或 `displayId` 且不是时间类型，first-load 取 `defaultMapValue`，后续取 `mapValue`（有 selectValue 长度时）或 `selectValue`；否则 first-load 取 `defaultValue`，后续取 `selectValue`。非时间值经 `forMatterValue()` 规范成数组；后续在目标图表字段映射存在时构造 `{filterId, componentId, fieldId, operator, value, parameters, isTree}`。这是值进入前端筛选对象的静态代码路径，不给出数字精度、JSON wire type、后端解释或查询结果。

### 仍需谨慎的值差异

- 同一 helper 对映射分支使用 `selectValue?.length` 判断是否有运行选择；普通分支使用条件表达式返回 selectValue。0、空字符串、数组/标量的结果可能因分支不同而不同；本文只记录代码表达式，不推断这是预期还是缺陷。
- 上游的 `Select.vue` 有显示值到字段 id 映射；在 `useFilter()` 中最终选取 `mapValue` 还是 `selectValue` 取决于 `optionValueSource/defaultMapValue/displayId` 条件。合法组合、value source 与后端字段类型的完整对应表仍未知。
- `chartExtRequest.filter.value` 是当前前端构造对象中的字段；该 Context 未追到 chart HTTP API 序列化、后端 DTO、SQL 参数绑定及 datasource 方言。不得把 UI 数值输入直接等同 SQL numeric。

## 前端保存与重载入口

- 普通保存分支 (`canvasUtils.ts:938-1001`) 深拷贝 `componentData`，按组件类型清理 linkageFilters，将其 `JSON.stringify` 放入 `canvasInfo.componentData`，再调用 `saveCanvas` 或 `updateCanvas`。`dataVisualization.ts:66-97` 对应 POST `/dataVisualization/saveCanvas` 与 `/dataVisualization/updateCanvas` 的前端 API 包装。
- query single-select lifecycle open 的受管理保存分支 (`canvasUtils.ts:841-934` 附近) 对 component/canvas 数据做 JSON round-trip，构造 query design overlay，再经 Store capture/validate/settle 流程选择同一 API。该分支包含 request 结果与 dirty state 处理。静态检查不验证一次实际 HTTP 保存是否写成、事务是否提交或重试行为。
- 加载入口 (`canvasUtils.ts:597-660`) 通过 `findById` 或复制场景下的 `findCopyResource` 获取 `canvasInfo`，对 `canvasInfo.componentData` 做 `JSON.parse`，再调用 `historyAdaptor` 并将解析后组件数据传入 Store。前端 API 包装位于 `dataVisualization.ts:24-40`。
- 上述链路将 `componentData` 作为 JSON 字符串字段整体序列化/解析，但本次未在后端持久化实现与历史迁移中确认 query 字段保留、精度、缺省字段、schema 版本兼容或 Save→Load 同值。因此不能据此宣称 durable persistence、round-trip 或 undo/redo 正确。

## 未闭合及后续门槛

1. numeric schema 与合法 shape 分母仍未定义，特别是 number/string/array、0/负数/小数/大数/空值及 `mapValue`、`defaultMapValue` 的类型关系。
2. query API/DTO、服务端筛选解释、SQL 参数类型和不同数据源方言尚未追踪；应以单独契约与 Cases 定义 oracle，再做匹配准入。
3. save/load 的前端 JSON 路径已静态定位，但后端 durable storage、历史兼容、保存后重载和撤销/重做仍未验证。
4. 当前本单元没有执行产品查询、发起保存请求、连接数据库或修改权限；也没有建立真实多用户读拒绝/撤权证据。
5. 不因本图关闭 R4FS-001..004，不改变 R4FS-005 `BLOCKED / NOT_RUN`，不满足或重写原 Goal must-have。
