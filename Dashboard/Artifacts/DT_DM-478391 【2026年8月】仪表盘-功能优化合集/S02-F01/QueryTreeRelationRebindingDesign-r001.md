# 树筛选逐级引用重绑设计候选 r001

状态：精确纯函数合同候选，待独立设计复核；不授权Builder。该切片解决 QPADR-03 的一个真实子形态：树字段层级及每层 `treeCheckedList` 中的组件引用在目标目录完成 QMAP 后如何重建。它不等于完整查询配置适配器，也不减少 Goal 的 10 项 AC、16 项产品义务。

## 源码依据与功能边界

- `core/core-frontend/src/custom-component/v-query/TreeFieldDialog.vue` 的 `saveTree` 输出选中字段对象数组；对话框上限为5层。
- `QueryConditionConfiguration.vue:1991-2013` 保存 `treeFieldList`，并按每层生成 `{checkedFields, checkedFieldsMap}`；`2327-2341` 在关系编辑时按 `treeFieldList` 逐层初始化列表；`1300-1310` 保存前逐层要求已选组件和字段映射完整。
- 树查询调用在 `useFilter.ts:323-332` 按 `treeCheckedList` 的层顺序读取 `relationshipChartIndex` 与字段映射；字段 ID 和层序必须保持一致。
- QMAP 纯模块以精确数据集/字段ID解析源组件到目标组件，结果是源组件ID到目标组件ID数组；本函数消费该结果，不重新做目录搜索、不作权限判断。

仅变换 `treeCheckedList` 中每层的组件 ID：保留 `treeFieldIds` 的层顺序并验证每个所选映射字段恰好等于该层 tree field ID；保留字段 ID 原值；将源组件映射到恰好一个目标组件。成功输出严格为每层 `{checkedFields, checkedFieldsMap}`。允许多个源组件映射到同一目标组件，仅当映射的字段 ID相同，此时在目标列表中首次出现位置去重；若同一层重复目标键携带不同字段，按字段冲突拒绝。无权变更 `treeFieldList`、查询条件ID、默认值、运行值、cascade、参数、时间/范围属性、Store、UI、网络或产品提交。

## 接口和全输入域

`rebindQueryTreeRelations(input: unknown): {ok:true,value: TreeCheckedLevel[]} | {ok:false,reason: ...}`，其中输入只能含 `treeFieldIds:string[]`、`treeCheckedList:TreeCheckedLevel[]`、`componentMap:Record<string,string[]>`。字段/组件 ID 必须为非空字符串且不含 `--`。级数为1–5，`treeFieldIds.length === treeCheckedList.length`，层字段ID不得重复。每级只允许 `checkedFields` 和 `checkedFieldsMap` 两键；`checkedFields` 必须非空且源组件ID唯一，`checkedFieldsMap` 必须为普通对象；每个当前 `checkedFields` 都必须有对应的有效字段映射。未选择组件的多余映射不参与输出，因为当前查询以 `checkedFields` 判定是否连接；不会把它们带入目标配置。这样不把旧的未选择关系当活引用，同时不拒绝源码允许的空/陈旧旁路映射。

`componentMap` 只要求覆盖当前层用到的源组件；每个被用源组件映射必须恰有一个非空有效目标ID。缺失映射返回 `MISSING_COMPONENT_MAP`；多目标返回 `AMBIGUOUS_COMPONENT_MAP`。映射后的目标组件重复时因同一层所有有效关系都指向同一 `treeFieldIds[level]`，按首次出现位置去重。即使源值完整，若该层 `checkedFieldsMap[sourceComponentId] !== treeFieldIds[level]`，返回 `FIELD_MISMATCH`，避免错误层映射。未使用 componentMap 项不读取、不写出。

## 确定输出、错误优先级和不变量

对每层按 `checkedFields` 原顺序执行：读取该source的唯一目标ID；将目标ID加入新 `checkedFields`（第一次出现时）；以该目标ID为键写入同一 `treeFieldIds[level]`。成功值保持原层序，所有数组、对象均新建；失败只返回 reason、无 partial value，输入不变。

全局失败优先级：`INVALID_INPUT`（根对象、键、数组/层数、集合不匹配、空层或额外字段）→ `INVALID_ID`（字段、组件或被使用的目标ID非法）→ `FIELD_MISMATCH` → `MISSING_COMPONENT_MAP` → `AMBIGUOUS_COMPONENT_MAP` 。每级按原数组次序遇首错。Fixture 对8个identity给出精确输出或错误结果。

## 使用顺序、写范围与声明上限

预期组合顺序为：调用方先取得当前产品目录及授权结果 → QMAP 精确映射 → 本函数将关系表改写为目标组件ID → 完整 query reconstructor 另外映射条件、树字段、默认值及运行态，并一次性构造完整 `propValue/cascade`。本函数不能独立用于粘贴，也不能把它的返回值替换整份查询配置。目标字段存在/可访问及授权均由真实调用方证明；合成 fixture 不验证这些事实。

若设计复核通过，Builder 写范围只包括新增 `core/core-frontend/src/custom-component/filter-copy/query-tree-relation-rebinding.ts`、对应独立测试及其QTR证据；不改 QPROJ/QMAP/QPREP/QPIPE/QCR、`QueryConditionConfiguration.vue`、`Tree.vue`、`copy.ts`、Goal/Fixtures或数据库。RED须保证runner可执行且8个冻结断言按预期失败，不得把模块解析错误当RED；GREEN按同一identity复验并定向lint后交独立Validation。

本切片不证明真实树数据查询、searchQuery/SQL命中、权限、完整query payload、保存/undo、产品入口或完整Goal。复杂树合法分支继续保留；本函数允许1–5层并按层循环，不以设计用例仅含两层而硬限为两层。当前真实权限环境仍 `BLOCKED / NOT_RUN`。
