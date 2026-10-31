# SH-SELECT-TEXT 来源阶段追踪候选 r002

状态：`candidate / design-only`；`frozen_for_builder=false`。本切片只追踪 `displayType="0"` 文本选择组件中 option source 的可见来源阶段，供 R4-001/002/004 继续收敛。它不定义所有合法组合、不声明字段完整 schema，也不授权产品接线。

保留原 Goal 分母 **10 项 AC / 26 项 must-have / 16 项产品义务**，`Scope Delta: none`。产品义务仍按原状态记录；S01 Entry Packet 对 S02/F01 的状态为 `CONDITIONAL`，真实多用户权限环境为 `BLOCKED / NOT_RUN`。

修订依据：独立来源追踪复核 r001/r002 共列出的三个源码定位 finding：默认属性应定位至 `options.ts:135`，dataset/cascade 清理应定位 `confirmIdChange` 实现，确认前校验应包含 `confirmClick` 调用点。本版逐项补齐精确路径并拆分阶段描述；不改产品代码、用例状态或准入结论。

## 可复核的源码阶段

|阶段 | 源码证据 | 能证明的行为 | 证据边界 |
|---|---|---|---|
|新条件创建 | `options.ts:6-66` 的 `infoFormat`；扩展属性定义 `options.ts:80-137`（`defaultValueFirstItem=false` 位于 :135）；配置页补全/重置路径 `QueryConditionConfiguration.vue:1844-1872` | `infoFormat` 可见初始 `optionValueSource=0`、`displayType="0"`、`multiple=false`、`defaultValueCheck=false`，并从传入组件/字段填写 dataset 与 field 标识；该对象本身未写入 `defaultValueFirstItem`。另有扩展属性默认值 `defaultValueFirstItem=false`，配置页 `parameterCompletion`/`setToDefault` 会对缺值字段应用/重置属性 | 创建helper初值、属性定义与配置页补全是不同阶段；未证明所有创建者、历史对象或保存时 schema 均经过同一路径 |
|数据集/字段配置 | `QueryConditionConfiguration.vue:977-985` 的 `confirmIdChange` 与 `:987-1018` 的 `handleDatasetChange`；`:1024-1041` 的 `handleValueSourceChange`；`:3224-3245` 的 source 单选及 dataset tree 入口 | source 选为 1 且已有 dataset 时会清空 `field.id/displayId/sortId` 后调用 `getOptions`；source=1 且 dataset 缺失时会尝试从 `checkedFieldsMap` 与 `fields` 找出 dataset/display 字段；dataset 变更前可能要求确认并清理级联关系 | `confirmIdChange` 在用户确认后设置新 dataset、调用 `clearCascadeArrDataset` 并进入 `handleDatasetChange`；后者含确认请求/取消返回分支，直接变更分支清空 field/display/sort 后取选项。三段状态改变属于配置阶段；不能推导出所有 source×multiple×default 组合合法，也不能把按字段 ID 的自动回填当作任意目标映射规则 |
|确认前校验 | `QueryConditionConfiguration.vue:1450-1477`、`:1558-1585`，以及 `:1592-1594` 的 `confirmClick` 调用点 | source=1 且适用的非时间/树形 display type 缺 `field.id` 时阻止；source=2 的非树组件在 `valueSource` 无非空值时阻止；数字选择还对默认值作单独校验 | `confirmClick` 在继续应用配置前调用 `validate()`，返回真即退出。该局部调用不能独立证明最终确认、持久化、错误提示、全组件条件及历史数据行为 |
|运行期默认/首项 | `Select.vue:131-133`、`:476-560`、`:1047-1059` | 首项禁用/默认行为依赖 `defaultValueFirstItem && optionValueSource===1`；默认勾选、首项写回与运行值初始化会读写 `selectValue`、`defaultValue` 及级联值 | 此处有配置/运行交叉写入，必须按阶段取证；不能将 `defaultValue*` 前缀视为静态设计凭据 |
|异步枚举 | `Select.vue:303-334`、`:368-456`、`:468-510`、`:531-558` | 存在异步 options 获取、旧值与新 options 对比、首项与级联处理的多个分支；部分分支会更新运行/默认字段 | 不在本切片重判 QOBS-ASYNC-01；用户裁定及已审候选的边界仍只适用于其窄切片，未证明完整配置链 |
|保存/重开/历史 | 本切片未定位到足够的完整 owner 链 | 无 | `NOT_READY`；需单独追踪保存捕获、画布恢复、历史/撤销/重做及持久化来源 |

## 组合状态与候选用例

当前证据只支持“代码可见分支”，不支持把状态空间压成一个已冻结的合法组合全集。下表是下一步 fixture 入口候选，不是已通过的产品 oracle：

|候选 ID | 可见条件/路径 | 需要的判定 | 状态 |
|---|---|---|---|
|ST-SRC-001|新条件默认 `displayType="0"`、`multiple=false`、source=0|创建后的对象快照与调用方是否再补字段|`DESIGN_ONLY / NOT_RUN`|
|ST-SRC-002|source=1，dataset 已选，字段待选|切换后 `field.id/displayId/sortId` 的清空及 `getOptions` 请求输入|`DESIGN_ONLY / NOT_RUN`|
|ST-SRC-003|source=1 且 dataset 缺失、`checkedFieldsMap` 有候选映射|实际 dataset/字段映射及空/多候选时的确定行为|`DESIGN_ONLY / NOT_RUN`|
|ST-SRC-004|source=1，切换 dataset 且级联路径命中|取消与确认两条路径的 dataset、cascade、field 状态|`DESIGN_ONLY / NOT_RUN`|
|ST-SRC-005|source=2，manual `valueSource` 缺失/空/全空白/含有效值|确认校验的完整边界和原值保留规则|`DESIGN_ONLY / NOT_RUN`|
|ST-SRC-006|source=1，首项默认开启/关闭并有异步 options|配置规则、运行值与运行后 `defaultValue` 写回的阶段差异|`DESIGN_ONLY / NOT_RUN`|
|ST-SRC-007|上述条件保存、刷新重开、撤销/重做|完整序列化与恢复 owner、旧记录/缺字段策略|`NOT_READY / NOT_RUN`|

`ST-SRC-001..007` 不计作 32 项全形态 Cases 的执行覆盖，不改变原 16 项产品义务。特别是 ST-SRC-002/003/004 的异步请求、ST-SRC-006 的默认回写均须由受控时钟/Promise 和目标快照给出确定 oracle；本报告没有运行这些行为。

## Finding 对照与剩余缺口

- 对 `R4FS-001`：已把 source=1 的若干配置分支从轴名称拆成具体入口，但完整合法/非法组合分母仍未定义；ST-SRC 候选不等于合法组合清单。
- 对 `R4FS-002`：补充了创建、配置确认、运行/异步枚举的当前源码位置；保存、恢复、history/undo/redo owner 仍缺。
- 对 `R4FS-004`：字段身份应使用路径与阶段，不应用裸字段名归类；本切片未冻结任一跨 shape 的统一动作。
- `R4FS-003/005` 仍开放：候选用例尚无可执行 fixture/oracle；S01 条件前置及真实权限环境均未满足。

## 准入与下一步

本候选是来源研究产物，不写产品源码或测试，不更改 Goal、Cases r001 或 CoverageMatrix。下一步应为 ST-SRC-001..006 补齐可复核输入/完整状态快照和同一执行 oracle，并继续定位保存/恢复 owner；随后独立审查。本切片不能准入产品 UI/Store、source-read、target-commit，也不能替代 S01 与真实权限验收。


## r003 引用修订与状态

- SSTR-001：`options.ts:80-137`（属性定义，精确字段 `:135`）与 `infoFormat` 创建对象 `:6-66` 分开引用；`parameterCompletion` / `setToDefault` 仍单列配置补全阶段。
- SSTR-002：引用 `QueryConditionConfiguration.vue:977-985`（`confirmIdChange` 写 dataset、清级联并重入处理）及 `:987-1018`（确认/取消与直接清理、取选项分支）。
- SSTR-003：引用校验函数及 `confirmClick` 调用点 `QueryConditionConfiguration.vue:1592-1594`。
- 仍保持 `candidate / design-only`、`frozen_for_builder=false`，所有 ST-SRC 状态和 Goal 分母不变；本次精确引用修订本身不关闭 R4FS-001/002/004、不准入产品接线，也不证明保存/权限行为。
