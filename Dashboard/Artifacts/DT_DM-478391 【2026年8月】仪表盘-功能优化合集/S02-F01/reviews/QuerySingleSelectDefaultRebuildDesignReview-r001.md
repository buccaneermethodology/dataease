# 显式单选默认值离线重建设计独立审查 r001

## 双结论

**Design Freeze Validity：`PARTIALLY_ACCEPTED_WITH_BOUNDS`（部分接受，边界受限）。** 源码支持一个可继续收敛的窄策略：把已持久化的 `defaultValueCheck`、`defaultValue`、`defaultMapValue` 当作不透明配置值按 JSON 值原样保留；纯函数不依据 source/target 字段目录验证选项是否真实存在，不从 `defaultValue` 重算映射，也不把显示值和筛选值互相推导。该策略只能作为待写入 Design/Fixtures 的审查建议，r002 尚未将其冻结为实现合同。

**Implementation Entry Readiness：`NOT_READY_FOR_BOUNDED_ADMISSION`（尚未达到有界实施准入）。** G-DEFAULT-02 的输出状态仍未确定，六项 fixture 的 `expected` 均为 `null`、`oracle_status` 均为 `NOT_FROZEN`。完整输入到完整输出的字段合同不存在，不能建立可信 RED/GREEN 实施包。本报告不是 Builder 准入，也不代表产品入口、权限、预览或保存重开验收。

审查对象：`QuerySingleSelectDefaultRebuildDesign-r002.md`（SHA-256 `e2c7182eeae601339082514c03ae25572e0b5b1e3a68daa036d1406157fa73b0`）及 `QuerySingleSelectDefaultRebuildFixtures-r002.json`（SHA-256 `31d02bc5579f3297a4635fca99d07be0604d606ce39bd6c4b5859545f1198b72`）。审查卡 canonical digest `4b6c73e64dd0af155764e94d9c620dd343105afdc6f32934f73c1bb71a30d73a` 已复验通过；指定 Context Bootstrap 校验通过；Topology 基线为 r067。仅写入本报告。

## 源码证据与可冻结边界

路径相对 `core/core-frontend/src/`。

| 来源 | 可确认事实 | 对窄切片的约束 |
|---|---|---|
| `custom-component/v-query/Select.vue:132–150` | `setDefaultMapValue` 依赖运行时 `enumValueArr`，按 `displayId || field.id` 查显示列，将命中行的 `field.id` 值收集并去重；一个显示值可以映射多个字段值。 | 离线 source/plan/目录没有枚举响应。不得声称能重算或验证映射；不得将 `defaultValue` 直接当作字段筛选值。 |
| `custom-component/v-query/Select.vue:248–273` | 运行交互写 `selectValue` 并重算 `mapValue`；配置交互写 `defaultValue`，并通过同一个枚举映射函数分别更新 `mapValue`、`defaultMapValue`。 | 默认配置与运行选择是不同字段。透传切片须逐字段冻结，不能复制无默认切片里“清空运行字段”的策略后顺手丢默认映射。 |
| `custom-component/v-query/Select.vue:427–468` | 默认开关开启且非远程时，组件将 `defaultValue` 设为显示选择，并根据当前选项重新计算 `mapValue`；依赖变更还可能触发查询。 | 这是枚举已加载后的运行时行为，不能伪装成离线重建可执行的逻辑，也不能用它为未经核验的目标枚举背书。 |
| `custom-component/v-query/QueryConditionConfiguration.vue:1047–1062, 1591–1621` | 确认配置会把标量默认值同步到 `selectValue`；对启用默认的级联节点，以 `mapValue` 填 `selectValue` 与 `currentSelectValue`，再保存整份 conditions/cascade。 | 配置确认态有一套明确写入，但 r002 未声明重建输出等同于确认配置之后的状态。 |
| `custom-component/v-query/Component.vue:674–683, 737–745` | reset 保留已启用的默认值、把 `selectValue` 恢复为 `defaultValue`，非空 `defaultMapValue` 被复制到 `mapValue`；节点 `currentSelectValue` 却由 `selectValue` 数组化。 | reset 状态与配置确认态的 cascade 值不同，不能仅依据 reset 为输出赋值。 |
| `hooks/web/useFilter.ts:141–154, 468–479` | 普通字段来源首查直接消费 `defaultMapValue`（启用默认时）；非首查在 `selectValue` 非空时消费 `mapValue`。 | `defaultMapValue` 是现有首查输入字段，不应无证据删除；结构透传仍不证明其中任何值在目标枚举中有效。 |
| `utils/canvasUtils.ts:843–865` | 保存时 clone 完整组件并 JSON 序列化 `componentData`，未在该段为查询默认字段重新计算映射。 | “保存态”包含多个当前状态字段，不能仅因最终会 JSON 保存就推导出应复制哪些运行态字段。 |

因此，G-DEFAULT-01 可通过把默认三字段定义成**不透明的持久配置值**收窄：对支持域内已存在的 `defaultValueCheck`、`defaultValue` 和 `defaultMapValue` 逐项保留 JSON 值（包括空映射及一对多数组），不改写、不规范化、不查验其枚举成员、不宣称映射正确。任何跨 dataset/field 的重算或目标有效性结论都不在此候选范围。该结论只界定可行策略，不能替代设计和 fixtures 的冻结，也不允许把源目录当成枚举 authority。

## 阻断 finding

### QSD-01（P1，实施阻断）：G-DEFAULT-02 未冻结完整输出时点与运行态字段

r002 明确记录 `selectValue`、`mapValue` 及 cascade 节点 `selectValue/currentSelectValue` 的写入路径不一致，却没有选定输出是待确认的配置候选、确认后的配置态还是运行初始化态。源码分别显示确认配置按 `mapValue` 回填节点、reset 按显示 `selectValue` 回填节点；首查和后续查询消费的字段也不同。把三种状态任选其一写入“完整成功输出”会新增未经授权的产品语义。

六项诊断 fixture 的完整输入可以帮助发现状态差异，但每项 `expected=null` 且标记 `NOT_FROZEN`。因此无法验证完整 `propValue/cascade`、字段的 KEEP/REGENERATE/REMOVE、成功输出与输入隔离或实际错误 oracle。该缺口直接阻止实现准入。

**最小修订建议：** Design r003 先界定本函数的唯一输出类型和消费时点；逐字段冻结 `defaultValueCheck/defaultValue/defaultMapValue` 的不透明透传规则，并单独明确 `selectValue/mapValue`、cascade 节点两个选择字段及其余完整配置字段如何处理。选择输出态后，为至少一个支持域内成功用例补完整 expected，并为每个拒绝类别补确定 reason；现有六个诊断输入若仍缺少唯一 oracle，应继续标记为设计诊断而不要混作 frozen case。禁止以审查者意见代替产品作者作此选择。

### QSD-02（P2，声明边界）：透传不能升级为目标默认值有效性

即使冻结 raw pass-through，source/target 目录与字段身份也没有枚举内容，`Select.vue` 的映射依赖独立枚举响应。设计、测试和未来报告必须明确“不验证默认显示值是否存在、不验证 defaultMapValue 是否仍匹配目标枚举、不保证首次加载/预览筛选结果正确”。若目标字段身份不完全相同，还需把该情形排除在透传域外或提供另一份经审查的重算合同；不能仅靠名称相同接受。

## Fixture 与兼容审查

六个固定 identity 分别探查非空/空 `defaultMapValue`、显示值与字段值相同、一对多映射、首项默认、当前选择缺失。它们暴露了重要边界，但 `expected=null` 是“无 oracle”，不是函数输出或成功用例。输入中“实际筛选值”“默认显示值”等内容均为合成诊断占位，不能证明它们在产品枚举中存在或彼此映射。

兼容边界应继续保持：r001 无默认域不重开、不改变；本窄候选不处理远程枚举、树/参数/动态范围、required/optionFilter 失败路径或跨字段映射；不得修改 UI/Store、`useFilter`、枚举接口、保存及权限行为。需要通过配置初始化后的消费者测试时，必须另行准入，不得把纯函数 fixture 写成端到端证据。

Goal 的 10 项 AC、14 项 F01 义务及 Q066/Q067 共 16 项产品义务完整保留。真实多用户权限环境缺失，查看/复制/粘贴限制、撤权与恢复继续 `BLOCKED / NOT_RUN`；不得使用 standalone/admin/mock 代替。此审查不改变任何 Goal 状态。

## 复核结论与后续入口

当前可以接受的只有一个受限设计方向：**默认配置三字段原值透传，映射视为 opaque persisted data，不做枚举存在性验证或映射重算**。当前 r002 仍因输出时点和完整 oracle 未冻结而 `NOT_READY`。设计作者应按 QSD-01 明确输出态并更新冻结用例，再提交新卡、Context 和摘要供独立增量复审；在此之前不得实施该切片。实现和真实权限/产品验收必须分别报告，不能把本报告结论升级为 Goal 完成。
