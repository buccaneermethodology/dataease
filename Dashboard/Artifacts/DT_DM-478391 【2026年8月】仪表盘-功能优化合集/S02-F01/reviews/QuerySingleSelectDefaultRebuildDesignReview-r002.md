# 显式单选默认值复制源状态设计独立准入复审 r002

## 双结论

**Design Freeze Validity：`PASS_WITH_BOUNDS_FOR_QSINGLE_DEFAULT_COPY_001`（在明确边界内通过）。** r003 已将输出态固定为复制源 JSON 配置状态，并将默认字段值作为不透明 JSON 持久数据原样保留；完整字段规则、身份重绑、失败优先级和 12 个完整 oracle 相互一致。该结论只覆盖默认值开启的普通单选离线纯函数。

**Implementation Entry Readiness：`READY_FOR_BOUNDED_ADMISSION`（可准备有界实施准入），尚非 `ADMITTED`。** 可按本报告所列精确源码和测试范围新建 Builder Card、Context 与 action/target-bound execution admission。没有本审查发现的设计阻断项；执行入口须消费并复验新准入。本报告不代表实现、产品入口、权限、预览/保存重开或 Goal 完成。

## 审查绑定与范围

审查对象：`QuerySingleSelectDefaultRebuildDesign-r003.md`（SHA-256 `d6fb3d4e78c60b2250635d6e88766ee8d7dc90d6f556630dd9bd0a49a912e5eb`）及 `QuerySingleSelectDefaultRebuildFixtures-r003.json`（SHA-256 `3afaf76708fade4e62c5feda62066dec58d78c8ec9b98e9a18fea994820ca90e`）。审查卡 canonical digest `c127a7c31840fbc3f58357719f675ab4498ed0e28aa5aa6288686b1cfa318a38` 复验通过；Context Bootstrap r002 校验通过；Topology 基线 r069。r001 独立审查 finding QSD-01/02 已逐项对照 r003 处置。仅新增本报告。

## r001 finding 处置与源码核对

**QSD-01 / G-DEFAULT-02 已关闭于当前纯函数合同范围。** r003 明确输出状态是复制瞬间的源 JSON 配置，不模拟配置确认、reset、挂载或枚举加载。已冻结的完整对象中仅 `condition.id`、`condition.checkedFields`、`condition.checkedFieldsMap`、`node.id` 和 `node.datasetId` 重生；全部其它字段 KEEP，包括条件 `defaultValue/defaultMapValue/defaultValueCheck/selectValue/mapValue` 及节点 `selectValue/currentSelectValue`。这明确保留了源快照里可能不同的默认、运行与级联值，而不冒称它们已经成为目标运行态。

该状态选择与源码边界一致：

- `Select.vue:132–150` 的映射以 `enumValueArr` 为输入，可能一对多并做去重；输入合同没有枚举响应，因此离线重建不应重算。
- `useFilter.ts:141–149` 首查在默认启用时消费已有 `defaultMapValue`，后续查询在当前 `selectValue` 非空时消费 `mapValue`。r003 明确保留两字段各自的源值，不强求相等或从一个推导另一个。
- `QueryConditionConfiguration.vue:1591–1621` 确认配置时以 `mapValue` 填级联节点；`Component.vue:674–683, 737–745` 的 reset 路径则分别处理条件映射和节点 current 值。r003 不把任一后续生命周期误称为复制函数输出。
- `canvasUtils.ts:843–865` 保存当前根的 clone 并 JSON 序列化。r003 将输入与输出限定在复制源 JSON 快照，完整保留其值字段，不声称验证这些值在目标枚举中的可用性。

**QSD-02 / G-DEFAULT-01 已被正确收窄，而不是被扩大声明。** 支持域把默认值限定为字符串、`defaultMapValue` 和 `mapValue` 限定为字符串数组，允许空、多值、重复、顺序以及彼此不一致；实现需原样 KEEP，不查验选项集合、不映射显示值、不规范化、不推断值存在。目标目录仅验证显式 dataset/field 身份及承载，不是枚举 authority。这是可测试的结构透传合同，不证明默认值有效或筛选结果正确。

## 完整字段、身份与 oracle 复核

字段矩阵覆盖完整 71 键条件对象和 6 键节点对象；成功值字段只改精确列出的身份键，删除字段集合为空。嵌套 `field`、`dataset`、`timeRange` 键及类型有精确约束，未声明字段不会被静默丢弃。`selectValue` 是唯一允许缺省的条件键；缺省在输出保持缺省，显式 `null`/`undefined`/数组拒绝。所有 KEEP 值按 JSON 深等、缺键性、数组顺序及重复保留；输入/计划/目录不变；成功输出无输入嵌套引用共享；失败只含 reason、不含 value/partial。

独立检查了全部 12 个唯一 identity：

| Identity | 复核结论 |
|---|---|
| `TC-QSINGLE-DEFAULT-COPY-001` | 双条件成功。每个 71 键输入条件的完整 expected 与 KEEP/REGENERATE 矩阵一致；默认、运行、节点配置和节点 current 刻意不同且逐值保留。每节点仅 `id`、`datasetId` 变化。 |
| `TC-QSINGLE-DEFAULT-COPY-002` | 成功覆盖缺省 `selectValue`、空默认映射及一对多/重复透传边界；缺键性保留，未编造枚举值。 |
| `TC-QSINGLE-DEFAULT-COPY-003/004` | 数组默认与动态首项落在明确支持域外，返回 `UNSUPPORTED_SHAPE`。 |
| `TC-QSINGLE-DEFAULT-COPY-005/012` | 未知键和缺失必要默认键返回 `UNSUPPORTED_FIELD`，没有将历史缺省与显式默认静默混同。 |
| `TC-QSINGLE-DEFAULT-COPY-006/007` | 计划错配与目标缺字段分别返回 `PLAN_MISMATCH`、`TARGET_UNRESOLVED`。 |
| `TC-QSINGLE-DEFAULT-COPY-008/009/010` | 无默认输入、null 运行值和非字符串映射值都拒绝；无默认域继续由既有模块负责。 |
| `TC-QSINGLE-DEFAULT-COPY-011` | 支持域错误优先于计划错配，符合全局错误阶段顺序。 |

固定优先级 `INVALID_INPUT → UNSUPPORTED_FIELD → UNSUPPORTED_SHAPE → PLAN_MISMATCH → TARGET_UNRESOLVED` 清楚；算法要求先完成各阶段的全局验证，再构造结果，避免按遇到顺序遮蔽更高优先级错误。Fixture 中两项成功 oracle 的条件字段键数分别为 71/70、预期身份差异精确为 `id/checkedFields/checkedFieldsMap`；节点差异精确为 `id/datasetId`。其余十例均有确定拒绝 reason。结构审查不是实现运行，也没有执行 RED/GREEN。

## 精确实施准入边界

新建 Builder 只能写：

- `core/core-frontend/src/custom-component/filter-copy/query-single-select-default-copy.ts`
- `core/core-frontend/tests/filter-copy-query-reference/query-single-select-default-copy.test.ts`
- Builder Card 精确列明的专属 RED/GREEN/lint 日志及 execution evidence。

冻结输入域为普通 `displayType='0'`、`multiple=false`、`optionValueSource=1`、`defaultValueCheck=true`、`defaultValueFirstItem=false`、非 required 的 VARCHAR/deType=0；源/目标 dataset 与 field 身份保持一致；无树、参数或活动日期。条件和级联必须符合 r003 的完整键、计划顺序、一一身份、字段引用闭包和目标目录约束。新实现独立于 QSINGLE 无默认模块及 QPAD，多选/无默认调用方路由不在本切片内。

RED/GREEN 应使用 r003 冻结的 12 个 identity 与精确完整 expected；另覆盖设计不便用 JSON 表达的非 JSON 输入、深冻结输入、无共享引用、稳定 JSON 往返和相同输入确定性等 invariant。测试只证明离线纯函数候选。禁止改 UI/Store/`useFilter`/枚举服务/保存逻辑、读取真实枚举、触发网络或声明真实配置存在；缺依赖不得静默安装。

最大声明仅是指定合成 JSON 支持域中的完整纯函数转换合同实现。它不证明 `defaultValue` 在目标枚举存在，不证明 `defaultMapValue` 与目标值有效，不证明产品粘贴、即时预览、首查/后续查询、真实身份权限、撤权恢复、保存重开或兼容回归。Goal 原 10 项 AC、16 项产品义务不变，真实权限继续 `BLOCKED / NOT_RUN`。

## 后续

控制面现可建立匹配上述写范围的 Builder Card、Context、实际拓扑和 execution admission；准入材料通过后即可按既有授权立即实施。随后需对 Builder 候选作独立 Validation，并继续推进产品接入与真实权限环境恢复，不得用本次设计审查代替这些 gate。
