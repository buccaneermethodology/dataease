# SH-SELECT-NUM 消费者与持久化来源追踪 r002

## 身份、修订范围与 claim ceiling

本版是独立静态来源索引 r001 的修订版，处理其独立 Review r001 的三个 findings：补入 `optionFilter` 旁路及 operator 分支、明确 numeric `0` 与空值的 consumer 门控、将源码定位改为可复核的精确范围。它不冻结 displayType 2/5 的合法形态或 numeric schema，不证明查询、后端保存、恢复、撤销/重做、权限或 Goal AC 已验收。

原 Goal 分母保持 10 项 AC、26 项 must-have、16 项产品义务，`Scope Delta: none`。S01 F01 仍为 `CONDITIONAL`；真实多用户权限环境仍 `BLOCKED / NOT_RUN`。来源文件摘要和本次 read set 以配套 Context Bootstrap r002 为准。

## 配置值进入 query filter 的静态路径

1. `core/core-frontend/src/custom-component/v-query/Select.vue:249-289` 的变更处理在运行态分别更新 `config.value.selectValue` 与 `config.value.mapValue`；配置态处理更新默认值及映射字段。字段存在于查询组件的 `element.propValue` 条目中；此静态事实本身不确认其 API 类型或持久性。
2. `core/core-frontend/src/custom-component/v-query/Component.vue:819-887` 的 `queryData()` 从查询组件条目读取 `selectValue` 做 required 检查，遍历条目收集关联图表 key，并以 `query-data-{viewId}` 发事件。数值 `0` 有专门 required 放行分支。该事件是触发入口，不是 query payload。
3. `core/core-frontend/src/views/chart/components/views/index.vue:456-480,655-690,723-731` 通过 `useFilter()` 形成 `chartExtRequest.filter`，把结果附入 chart view 参数并调用 `calcData`；该组件注册同一 view 的 `query-data-*` 监听器。此处只证明前端组装和转发关系。
4. `core/core-frontend/src/hooks/web/useFilter.ts:115-156` 选择 first-load/default 或运行值：若 `optionValueSource===1`、存在 `defaultMapValue` 或 `displayId` 且不是时间类型，first-load 取 `defaultMapValue`，后续取 `mapValue`（存在 `selectValue?.length` 时）或 `selectValue`，并以 `|| ''` 兜底；否则 first-load 取 `defaultValue`，后续取 truthy 的 `selectValue` 或空默认。`useFilter.ts:467-508` 的主筛选门控接受有 `length` 的值、Number/Date、或 displayType 8；`useFilter.ts:48-60` 对非时间值将标量包装为数组。后续在 `useFilter.ts:509-605` 目标字段映射有效时构造筛选对象 `{filterId, componentId, fieldId, operator, value, parameters, isTree}`。这是值进入前端筛选对象的静态代码路径，不给出数字精度、JSON wire type、后端解释或查询结果。

### 独立筛选与 operator 分支

- 在同一 `searchQuery()` 流程中，`useFilter.ts:373-395` 会先检查 `optionFilter`，并独立 push 一个 `operator: 'in'` 的筛选项；树形 displayType 会先转换其值并解析字段 ID。它不依赖后续 `selectValue/mapValue` 主筛选是否通过门控。因此筛选数组不一定只包含 query 组件当前选择值生成的主筛选。
- 主筛选的 operator 由 `getOperator()` 产生（`useFilter.ts:270-301`）：displayType 9 固定为 `in`，22 为 `between`，1/7 为 `between`，普通非时间选择分支默认为 `in`；时间/区间等专门分支按自身条件取值。
- 在主筛选最终 push 前，`useFilter.ts:593-604` 对目标 `fieldId` 含 `|DE|` 的情况按 `multiple` 覆写 operator：多选为 `in`，单选为 `eq`。本文只记录当前静态分支，不裁定这些组合是否合法或服务端如何解释。

### Numeric 0 与空值的 consumer 门控

- 映射来源后续路径在 `useFilter.ts:141-150` 使用 `selectValue?.length` 选择 `mapValue` 或 `selectValue`，随后 `|| ''` 兜底。若运行值为数值 `0`，它没有 `length`，路径选择 `selectValue` 后由 `|| ''` 变为空字符串；空字符串也保持空。
- 普通来源后续路径在 `useFilter.ts:152-155` 使用 `selectValue ? selectValue : ...`，数值 `0` 与空字符串均落入空默认。与之不同，first-load 且 default check 生效时会返回 `defaultValue` 或 `defaultMapValue`，其值是否为数值 0 取决于当前配置内容。
- `useFilter.ts:481-508` 的主筛选门控会接收 Number/Date；因此若 Number `0` 来自某条未被上述 helper 转为空字符串的路径，`forMatterValue()` 会得到 `[0]`。`selectValue?.length` 非空、displayType 8 也可进入主筛选；其他没有 length 的空字符串/空数组通常不满足该门控。`optionFilter` 已在 `373-395` 独立处理，不受本段主筛选门控约束。
- 上述仅说明现有静态表达式及分支结果。本文不判断 0 被视作“未选择”是否为预期，不定义数值合法域，不据此认定产品缺陷或产品 oracle。

### 仍需谨慎的值差异

- `Select.vue` 有显示值到字段 ID 的映射；在 `useFilter()` 中最终选取 `mapValue` 还是 `selectValue` 取决于 `optionValueSource/defaultMapValue/displayId` 条件。合法组合、value source 与后端字段类型的完整对应表仍未知。
- `chartExtRequest.filter.value` 是当前前端构造对象中的字段；本 Context 未追到 chart HTTP API 序列化、后端 DTO、SQL 参数绑定及 datasource 方言。不得把 UI 数值输入直接等同 SQL numeric。

## 前端保存与重载入口

- 普通保存分支 (`core/core-frontend/src/utils/canvasUtils.ts:938-1001`) 深拷贝 `componentData`，按组件类型清理 linkageFilters，将其 `JSON.stringify` 放入 `canvasInfo.componentData`，再调用 `saveCanvas` 或 `updateCanvas`。`core/core-frontend/src/api/visualization/dataVisualization.ts:66-97` 对应 POST `/dataVisualization/saveCanvas` 与 `/dataVisualization/updateCanvas` 的前端 API 包装。
- query single-select lifecycle open 的受管理保存分支 (`canvasUtils.ts:841-934`) 对 component/canvas 数据做 JSON round-trip，构造 query design overlay，再经 Store capture/validate/settle 流程选择同一 API。该分支包含 request 结果与 dirty state 处理。静态检查不验证一次实际 HTTP 保存是否写成、事务是否提交或重试行为。
- 加载入口 (`canvasUtils.ts:597-660`) 通过 `findById` 或复制场景下的 `findCopyResource` 获取 `canvasInfo`，对 `canvasInfo.componentData` 做 `JSON.parse`，再调用 `historyAdaptor` 并将解析后组件数据传入 Store。前端 API 包装位于 `dataVisualization.ts:24-40`。
- 上述链路将 `componentData` 作为 JSON 字符串字段整体序列化/解析，但本次未在后端持久化实现与历史迁移中确认 query 字段保留、精度、缺省字段、schema 版本兼容或 Save→Load 同值。因此不能据此宣称 durable persistence、round-trip 或 undo/redo 正确。

## 未闭合及后续门槛

1. numeric schema 与合法 shape 分母仍未定义，特别是 number/string/array、0/负数/小数/大数/空值及 `mapValue`、`defaultMapValue` 的类型关系。
2. query API/DTO、服务端筛选解释、SQL 参数类型和不同数据源方言尚未追踪；应以单独契约与 Cases 定义 oracle，再做匹配准入。
3. save/load 的前端 JSON 路径已静态定位，但后端 durable storage、历史兼容、保存后重载和撤销/重做仍未验证。
4. 当前本单元没有执行产品查询、发起保存请求、连接数据库或修改权限；也没有建立真实多用户读拒绝/撤权证据。
5. 不因本图关闭 R4FS-001..004，不改变 R4FS-005 `BLOCKED / NOT_RUN`，不满足或重写原 Goal must-have。
