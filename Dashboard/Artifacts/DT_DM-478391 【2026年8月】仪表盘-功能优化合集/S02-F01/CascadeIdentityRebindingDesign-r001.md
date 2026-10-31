# 查询级联身份重绑纯函数设计候选 r001

状态：有限离线子模块设计候选，不等于完整查询配置适配器，也不授予产品入口、Store/UI、权限、保存或发布准入。它细化 QPADR-01 的已审源码问题，为后续产品适配提供一个不依赖权限环境的可验证 building block。Goal 的10项 AC、16项产品义务完整保留；树/参数/时间/范围字段闭包仍由产品适配整体设计负责。

## 源码合同与范围

`QueryCascade.vue` 中级联节点由 `addCascadeItem` 建立为 `{datasetId:'', fieldId:'', placeholder:..., id:guid()}`；UI选择的 `datasetId` 是 `${datasetId}--${queryId}--${fieldId}`。`setPlaceholder` 对同数据集后继仅清空节点的独立 `fieldId` 并设置placeholder，不修改 `datasetId` 的三段编码；`setCascadeArrBack` 克隆整树并将 `selectValue` 设为空数组。`Select.vue` 将 `currentSelectValue` 写作运行态回填。因此本设计把 node id、复合引用和独立字段引用分开处理，并移除运行选择。

输入严格为非空二维级联组，每组1–2个节点（QueryCascade UI最多两层）；节点仅允许已观察键：必需 `id,datasetId,fieldId,placeholder`，可选 `selectValue,currentSelectValue`。缺必需键、类型错误、额外未知键、空组、超过两层、非数组运行值或格式不完整均整次拒绝，避免未分类字段被静默复制。该拒绝仅限本纯函数输入域，不得被扩展成拒绝所有产品查询配置。

调用方提供完整 `queryIdMap` 与 `nodeIdMap`，本函数不生成ID、不读取Store/权限/目录、不调用网络/时钟/随机源。映射均须为非空字符串、覆盖所有使用ID且目标ID域内唯一。每个 `datasetId` 按恰三段解析；第一段dataset和第三段field保持精确不变，只替换第二段query ID。不按名称映射；数据集/字段访问能力由外层调用方与QMAP/QPIPE合同负责，QPREP负责节点/条件引用闭包及循环判定。

## 确定输出与失败优先级

成功输出保持原分组及顺序；每节点严格输出 `{id: nodeIdMap[old.id], datasetId: dataset--queryIdMap[oldQueryId]--fieldId, fieldId: old.fieldId, placeholder: old.placeholder, selectValue: []}`，不输出 `currentSelectValue`。同数据集后继的独立 `fieldId` 必须已经为空，编码复合串末字段仍须非空且逐字保留；跨数据集后继的独立 `fieldId` 原样保留。绝不从placeholder、名称或相邻节点推断任何ID。输出数组/节点均深度新建；失败无partial value且输入不变。

失败优先级：`INVALID_INPUT`（容器、节点键/类型、额外键、分组长度）→ `INVALID_ID`（空或含`--`的node/query/dataset/field）→ `INVALID_COMPOSITE_REFERENCE`（不是恰三段）→ `MISSING_NODE_ID` → `MISSING_QUERY_ID` → `DUPLICATE_TARGET_ID` → `INVALID_PLACEHOLDER_STATE`。按输入遍历遇到的首错返回固定reason。

## 用例、写范围与证据界限

[Fixtures](CascadeIdentityRebindingFixtures-r001.json)给出6个源码派生合成identity及精确输入/输出或reason：同数据集后继保留复合字段、跨数据集后继保留独立字段、缺ID映射、目标ID冲突、复合末字段为空、未分类额外字段拒绝。均未运行；独立设计复核通过并冻结后才可建可信RED/GREEN。

候选写范围仅新增 `core/core-frontend/src/custom-component/filter-copy/query-cascade-identity-rebinding.ts` 与独立测试文件。不修改QPIPE/QPROJ/QMAP/QPREP、QueryCascade或产品copy入口。不得据此宣称完整查询适配、权限、保存/undo、即时预览或跨标签生命周期已实现。
