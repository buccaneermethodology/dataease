# SH-SELECT-NUM 来源阶段追踪 r003

## 交付物身份与结论边界

- Artifact ID：`S02-F01-query-product-adapter-select-num-source-trace`，第 3/3 轮；本轮是该交付物最后一轮，不限制其他 S02 交付物的评审轮次。
- 本轮根据 r002 Review 的三个 P3 finding 收窄字段 owner，并把配置确认、枚举迟到响应/验证作为未闭合来源链明确列出；不重写历史 Review。
- 本文只作当前工作树静态来源索引，不冻结 displayType 2/5 的合法 shape/组合、numeric schema 或运行 oracle；不证明保存回读、权限或产品验收。
- 原 Goal 10 项 AC、26 项 must-have、16 项产品义务与 `Scope Delta: none` 保持；16 项义务仍 `NOT_RUN`。S01 F01 仍 `CONDITIONAL`，真实多用户权限仍 `BLOCKED / NOT_RUN`。

## 既有五项来源补充

以下是静态路径事实，最终以独立 Review 重算的当前源码摘要为准。

| Finding | 来源路径 | 当前可确认事实及边界 |
|---|---|---|
| SNTR-R1-001：validator 短路与 0 值差异 | `QueryConditionConfiguration.vue:1261-1264,1468-1483,1559-1578,3492-3501` | `validate()` 使用 `some`；type 2 在来源 1 缺 `field.id` 时拒绝，`defaultValueCheck=false` 时在 1475 提前返回，不再执行后续手工 truthy 检查或通用来源字段检查。type 2 手工输入采用 `v-model.number`，default 专项检查接受数值 `0`；type 5 无相同专项分支且输入未用 `.number`。这是控制流/转换差异，不裁定产品意图或 bug。 |
| SNTR-R1-002：配置 required 与运行 required | 配置：`QueryConditionConfiguration.vue:1412-1445`；运行：`Component.vue:815-847` | 配置准入检查 `defaultValueCheck` 和配置默认值；运行查询检查 `selectValue`，显式允许数值 `0`。阶段、owner 与状态字段不同，静态检查不证明实际查询行为。 |
| SNTR-R1-003：展示值到级联值映射与字段 owner | `Select.vue:134-152,249-289,439-447,494-519,541-562` | `setDefaultMapValue()` 按 `displayId || field.id` 定位枚举行，再提取 `field.id` 行值。`handleValueChange()` 的运行态分支写 `config.value.selectValue` 和 `config.value.mapValue`，然后级联回写；配置态分支写本地 `selectValue` 及 `config.value.defaultValue/mapValue/defaultMapValue`，不在该分支写 `config.value.selectValue`，然后级联回写。另有枚举处理路径写 `mapValue/defaultMapValue`。这些路径不是统一的持久化 schema；原始类型、空值、精度和下游 consumer 未验证。 |
| SNTR-R1-004：配置态/运行态 `selectValue` owner | `Select.vue:264-296` | 运行态写 `config.value.selectValue`；配置态更新本地 `selectValue` 与 `defaultValue/mapValue/defaultMapValue`，不写配置对象的 `selectValue`。displayType 切换清理 `defaultValue` 与本地值，不等于已清除持久字段。 |
| SNTR-R1-005：手工选项单选/多选比较 | `Select.vue:1016-1041`；输入绑定：`QueryConditionConfiguration.vue:3488-3501` | 手工 option 的 `label/value` 转字符串；多选 checked 使用字符串化比较，单选 checked 与原始 `ele` 比较。只有 type 2 手工输入用 `.number`。`checked` 的完整消费链未确认，不据此宣称运行缺陷。 |

## 配置确认与保存 owner：仍未闭合

- `QueryConditionConfiguration.vue:1592-1710` 的 `confirmClick()` 先 `validate()`，随后调用 `handleDialogClick()`、处理级联/多选，再进入受管理的 single-select lifecycle 分支，或旧直写分支。
- 受管理分支调用 `prepareQuerySingleSelectConfirmation()` / `commitQuerySingleSelectConfirmation()`；成功事件发布后记录 `confirmClick` snapshot，并安排 `reRenderAll` 与 `queryData`。旧分支更新 `queryElement.value.propValue/cascade`、记录 snapshot，再触发相同两类事件。此处追踪到编辑器确认/状态提交入口，不等于持久存储写入。
- 本次局部搜索没有建立 query component 从确认后的 `propValue` 到 dashboard/canvas durable save payload、后端保存及重载 owner 的完整链路。因此“配置确认→保存/重开”仍未追踪；不能用 `validate()`、配置对象赋值或 snapshot 记录代替持久化证据。

## 枚举响应、迟到选择与验证：仍未闭合

- `Select.vue:358-380` 的 `handleFieldIdChange()` 在枚举读取前检查 `queryLifecycleAllowed()`、捕获 observation request 并置 `loading=true`。
- 普通响应路径（约 `382-447`、`478-519`）将枚举行映射为选项，按选项过滤更新所选值，并可能重算 `mapValue/defaultMapValue` 与级联值；失败传播由 catch 路径处理。
- observation 路径以 request generation/currentness 识别过期请求；迟到成功响应映射枚举行，若仍含用户选择则标记 valid，否则发起 verification；迟到失败响应标记 `unverified`。普通请求的 finally 会结束 loading 并可能恢复默认值/发出后续 query；observation-handled 分支提前返回，不走同一 finally 收尾。
- 维护者针对产品策略已裁定：缺少刚选 C 的迟到成功枚举响应时，重新请求核对 C，核对后结束 loading；若 C 不存在则显示为无效。该裁定是产品 authority；当前静态索引没有证明所有请求代际、verification 重试、loading 收尾、级联与 UI invalid 呈现已经符合该策略。本交付物不重新解释或替换该决定。
- 因此，本图只给出控制流入口与局部行为；完整异步时序、错误/重试、`C` 缺失/存在、竞态下 cascade/default/query 影响及可见 invalid 表现仍未经过绑定该裁定的产品级验证。

## 全量未决项与边界

- **Numeric / shape：** type 2/5 × single/multiple × option source × default/check × field/value metadata 的合法分母未定义；数值 `0`、负数、小数、精度/大数、字符串数字、空字符串与 `null` 的端到端 identity/序列化无 oracle。
- **消费者和生命周期：** query filter consumer / API payload 数值 schema、配置确认到 durable save、Store 保存/加载、模板/复制、保存/重开、undo/redo/历史缺省均未形成完整来源链。枚举迟到响应、verification 与级联时序/呈现亦未闭合。
- **全形态：** R4FS-001（合法组合分母）、R4FS-002（全链/生命周期）、R4FS-003（全形态 Cases/oracle）、R4FS-004（跨 shape 身份字段/条件动作）仍 OPEN；R4FS-005 仍 `BLOCKED / NOT_RUN`。
- **权限与前置：** S01 F01 `CONDITIONAL`；真实权限环境未提供。只读查看/复制/粘贴拒绝与撤权/恢复未验证，不能用 standalone/admin/mock 替代。
- **Goal：** 10 项 AC、26 项 must-have、16 项产品义务、`Scope Delta: none` 保持；16 项义务仍 `NOT_RUN`。本文不构成 Design Freeze、Builder 准入、产品行为/权限或 Goal 完成证据。

## 后续动作

本来源图已达 3/3 轮。后续可新建单独的 consumer/persistence 或迟到枚举行为交付物；必须先绑定相应 authority、完整合法分母、Contract/Cases 与匹配 Builder admission。若这些前置缺失，继续记录 `NOT_READY`，转向其他已获准且不依赖 S01/真实权限的 build 切片；不通过重命名或改 ID 重置本来源图轮次。
