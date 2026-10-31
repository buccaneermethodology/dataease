# 查询参数引用准备器设计候选 r001

状态：`candidate / NOT_REVIEWED / NOT_FROZEN`。本切片是 R4-04 的离线纯映射子合同，只从调用方提供的显式 ID 映射和目标参数目录生成新组件的 `parametersArr` 引用列表。它不选择映射、不认证目录、不读取源/目标配置、不连接产品入口，也不修改 Goal 或冻结测试资产。

## 权威与源码边界

- Goal 分母保持 10 项 AC、26 项 must-have、16 项产品义务，`Scope Delta: none`。此候选只触及 AC-F01-Q006 与 AC-F04-Q066/Q067 的参数引用闭包；不关闭任何 AC。
- `sdk/extensions/extensions-view/src/main/java/io/dataease/extensions/view/dto/SqlVariableDetails.java` 定义 DTO 字段：`variableName`、`alias`、`type`、`deType`、`details`、`defaultValue`、`defaultValueScope`、`id`、`datasetTableId`、`datasetGroupId`、`required`、`operator`、`value`、`datasetFullName`。其中 id/table/group 在序列化上具有字符串语义；前端不能把 ID 假定成安全的 JS 数值。
- `QueryConditionConfiguration.vue` 在普通过滤选中后由 `setParameters` 按 ID 收集字段参数；`setParametersTimeType`/`setParametersNumType` 从所选端点 ID 生成 `parametersArr[componentId]`。这表明该列表是按组件分区的参数描述引用，不是授权凭据。
- `useFilter.ts` 分别以精确 `id === fieldId` 取得单端和范围端的参数，范围的起止端有序，端点值不得交换或合并。`|DE|` 是当前消费者中影响 operator 的条件，不能单独证明任意字符串属于有效参数。
- 这些静态来源不能证明候选目标目录来自授权服务，也不能定义不同数据集之间的参数对应关系。身份/权限、source-read、目标提交、SQL 查询、保存重开均保持 `BLOCKED / NOT_RUN` 或未准入。

## 有界输入输出合同

准备器输入为 JSON 形状：`sourceParameterIds`（当前组件实际引用的参数 ID，按消费顺序）、`targetIdBySourceId`（调用方先前依据独立目标映射规则生成的精确 ID 映射）、`targetParameterCatalog`（调用方传入的目标 DTO 目录）及 `targetComponentId`。准备器不得从名称、alias、类型或 `|DE|` 字符串推导映射。

成功时只返回 `{ ok: true, targetComponentId, parameters }`；`parameters` 按源引用次序从目标目录中取目标 DTO，字段以目录中对应条目的完整 JSON 形状为准，不能复制源 DTO 的默认值、值或元数据，也不能只投影预先列出的字段。重复的源 ID 按现有 `duplicateRemoval` 的首次出现顺序折叠。所有输出 DTO 必须是与输入隔离的深副本；冻结输入保持不变。

失败时返回单一稳定 reason，且不返回部分列表：空/非法参数、缺少精确 ID 映射、映射目标不存在、重复目标 DTO ID、两个不同源 ID 映射到同一目标 ID均整体拒绝。后两项作为本候选的保守支持边界，尚不是产品对所有参数场景的最终业务拒绝规则。未知键、值范围、DTO schema 版本和真正的跨数据集身份映射不由本准备器判断。

## 冻结候选用例及实施边界

Fixtures r001 对普通单参数、时间双端、数值双端、重复源引用、缺映射、目标缺项、目标目录重复 ID、非一对一目标映射、输入深冻结/输出隔离分别给出完整 oracle。成功用例只检查参数引用列表及原样保留目标 DTO；不执行 `searchQuery`、Vue、API、Store、权限、SQL、保存或预览。

若独立审查结论允许实施，仅新增 `core/core-frontend/src/custom-component/filter-copy/query-parameter-binding-preparation.ts` 与其定向测试/证据；先绑定合同、Cases、同身份断言级 RED 和精确 target admission，再实现和独立 Validation。不得修改现有 `QueryConditionConfiguration.vue`、`useFilter.ts`、QPIPE/QPAD 或产品入口。该切片即使通过，也只证明显式映射下的参数引用准备，不证明 R4-04 完成或 Goal 达成。

## 明确未决

1. 目标参数目录和 source→target ID 映射的可信生产者仍未知；本模块只消费显式输入。
2. 不同源 ID 映射为同一目标参数时，当前候选选择拒绝以避免丢失引用；产品 owner 尚未确认该组合是否可合法折叠。
3. 完整 `SqlVariableDetails` DTO 的字段变更/历史版本兼容、查询参数值语义和后端行为未覆盖。
4. 真实编辑/只读/撤权环境与 S01 F01 Entry Packet 仍不可用；权限相关义务不得用该 helper 替代。
