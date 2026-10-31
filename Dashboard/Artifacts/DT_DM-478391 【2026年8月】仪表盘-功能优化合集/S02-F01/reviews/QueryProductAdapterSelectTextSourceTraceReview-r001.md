# SH-SELECT-TEXT 来源阶段追踪候选独立语义审查 r001

## 双结论

**候选文档有效性：`PASS_WITH_FINDINGS`（附带修正项）**。候选将 `displayType="0"` 文本选择器的创建、配置、确认校验、运行默认值及异步枚举分阶段追溯；ST-SRC-001..006 均保留为 `DESIGN_ONLY / NOT_RUN`，保存/重开用例 ST-SRC-007 为 `NOT_READY / NOT_RUN`。它清楚说明不定义完整 schema、不列合法组合全集、不授权产品接线。源码检查支持主要行为概述，但有三个源码引用范围没有覆盖所支持的精确行，见 findings。

**对 R4 与 Goal 的影响：`局部来源补充；完整设计及产品准入仍 NOT_READY`**。R4FS-001、R4FS-002、R4FS-004 均只能视为部分补充、未解除；其他未决项仍开放。Goal 的 10 项 AC、26 项 must-have、16 项产品义务及 `Scope Delta: none` 均保持；AC-S02-02/03 仍 pending。S01 S02/F01 Entry Packet 为 `CONDITIONAL`，真实多用户权限为 `BLOCKED / NOT_RUN`。本 Review 不批准 Builder 或产品接线。

## Read Manifest 与核验方式

- Card `planning/sh-select-text-source-trace-review-card-r001.json` canonical SHA-256：`05461d972e2f6b180e9ac3e3d74e683fad10397b98a44b4c099e718eb7b13a8e`；`lane_task_card.py validate` 与 `render` 均通过。
- Context Bootstrap `planning/ContextBootstrap-S02-F01-SH-SELECT-TEXT-SOURCE-TRACE-REVIEW-r001.json` 验证通过；12 项 required-read revision 全部匹配，无漂移。
- 按 Read Set 检查了 `AGENTS.md`、SP-010 Skill、`Goal.final.json`、`UserIntent.md`、全形态设计审查、来源阶段追踪候选、`options.ts`、`QueryConditionConfiguration.vue`、`Select.vue`、SP-005 Entry Packet、`PermissionEnvironment.md` 与 Topology r265。
- 核对了候选引用的源码片段及调用阶段；未运行产品测试或修改任何输入。本报告是唯一写入项。

## 编号 Findings

| ID / Severity | 证据与发现 | 影响 | 处置 |
|---|---|---|---|
| `SSTR-001 / P2` | 候选“新条件创建”引用 `options.ts:6-59` 与 `:74-111`，并称 `defaultValueFirstItem` 默认 false；该属性实际在 `options.ts:135`（`attributes` 对象），引用区间没有覆盖它。 | 结论可在同一文件找到，但当前行引用无法直接支撑该字段，降低审查可追溯性。 | 候选修订时将引用补为 `options.ts:80-137` 或直接引用 `:135`。不要据此推断所有创建调用者均应用该 attributes 对象。 |
| `SSTR-002 / P2` | 候选“数据集/字段配置”引用 `QueryConditionConfiguration.vue:987-1018`，称数据集变更可要求确认并清理级联关系。确认分支实际调用 `confirmIdChange`，而设置新 dataset 并执行 `clearCascadeArrDataset` 的实现位于 `:979-985`；被引区间仅覆盖调用点。 | 行为摘要与源码相符，但级联清理的关键实现未被引用范围覆盖。 | 补充 `QueryConditionConfiguration.vue:979-985`，并保留确认取消/确认后状态分别取证的候选边界。 |
| `SSTR-003 / P2` | 候选“确认前校验”引用 `QueryConditionConfiguration.vue:1450-1477`、`:1558-1585` 描述校验阻止确认；调用处 `confirmClick` 在 `:1592-1594` 执行 `if (validate()) return`，不在当前引用范围内。 | 校验规则本身有代码依据，但“确认前”这一阶段因果需引用实际调用点。 | 补充 `:1592-1594`；仍不得由此推断已覆盖所有持久化、提示或历史行为。 |

## 来源阶段及状态判断

- **创建：** `options.ts:6-59` 中 `infoFormat` 可见 `optionValueSource=0`、`displayType="0"`、`multiple=false`、`defaultValueCheck=false`；输入中的 `id` 写入 `field.id`、`displayId`，`datasetId` 写入 `dataset.id`。`attributes.defaultValueFirstItem=false` 在 `:135`。候选把它限定为可见 helper/default object，且要求继续核对调用方，未把它升格为所有保存对象的 schema。
- **配置：** `QueryConditionConfiguration.vue:987-1006` 可见 dataset 修改时清除 `field.id/displayId/sortId` 并调用 `getOptions`；`1024-1045` 可见 source=1 且 dataset 缺失时按 `checkedFieldsMap` 与 `fields` 回填候选 dataset/display/field 标识。候选将多候选与自动映射结果列为待判事项，没有宣称确定的完整映射规则。
- **确认：** `1450-1477` 及 `1558-1577` 可见针对不同 display/source 条件的校验；`1592-1594` 显示 `confirmClick` 在继续确认前调用 `validate`。这些局部条件不是完整组件 schema，也不证明最终保存结果。
- **运行与异步 options：** `Select.vue:130-133` 的首项禁用条件为 `defaultValueFirstItem && optionValueSource === 1`；`303-334` 与 `356-519` 展示异步 options 与运行/默认值处理；`531-560` 在配置态与非配置态存在不同首项写入路径；`1047-1059` 初始化从默认配置写入 `selectValue` 并触发 options 获取。候选明确区分配置与运行阶段，没有仅凭字段名前缀定性。
- **保存/重开/history：** Read Set 中源码并未提供完整保存捕获、画布恢复、history/undo/redo owner。候选将 ST-SRC-007 保持 `NOT_READY / NOT_RUN`，结论与证据边界相符。

状态逐项复核：ST-SRC-001..006 为 `DESIGN_ONLY / NOT_RUN`；ST-SRC-007 为 `NOT_READY / NOT_RUN`。候选明确它们不计入 32 项全形态 Cases 的执行覆盖，没有测试通过或 fixture oracle 已冻结的说法。

## R4FS 处置与 Goal 边界

- **R4FS-001：部分取证，未解决。** 候选给出 source=1 的若干具体配置入口，但明确合法配置组合分母仍未知，ST-SRC fixture 不是合法组合清单。
- **R4FS-002：阶段定位有补充，未解决。** 创建、配置、确认和运行/枚举阶段增加了当前源码位置；保存、恢复、历史及完整消费 owner 仍缺。
- **R4FS-004：处置原则已写明，未解决。** 候选说明身份应用路径与阶段表达、不用裸字段名归类，也明确未冻结跨 shape 的统一动作；本候选没有交付完整 path-keyed 字段映射，故不能标记该 finding 已关闭。
- 候选另将 R4FS-003/005 留作未决项，与 fixtures/oracle 未就绪、S01 和权限前置未满足的材料一致。
- `Goal.final.json` ledger 共 26 项，其中 10 项 `AC-S02-*`、16 项 F01 义务；当前分母没有减少，AC-S02-02/03 均 pending。SP-005 `S02 / F01` 标为 `CONDITIONAL`；`PermissionEnvironment.md` 明确未找到真实权限实例，standalone/admin 不可替代真实权限验收，保持 `BLOCKED / NOT_RUN`。

## 最终处置

候选可作为继续来源取证与 fixture/oracle 设计的局部材料，建议修正上述三处引用后保留 candidate 状态。它未定义完整合法 shape 组合或完整 schema，未完成保存/恢复链追踪，未运行 ST-SRC fixtures，也未关闭 R4FS-001/002/004。原 AC 分母与 `Scope Delta: none` 保持；S01 条件与真实权限阻塞未解除；不构成完整设计冻结、产品接线准入、权限验证或 S02 Goal 验收。
