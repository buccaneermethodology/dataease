# 查询产品适配设计候选 r001

本文件依 `query-product-adapter-design-card-r001.json` 完成，卡片摘要 `a35eac9999553ef8a20f1bffbbd2e92dcb26ce769688f7bf23a1643b1f0840c6` 接收端复验通过。本文与同版本 fixtures 是设计候选；不写产品源码、不替换既有 copy、QPROJ/QMAP/QPREP/QPIPE 契约，也不证明权限或运行行为。

## 结论

**设计完整性：`SOURCE_GROUNDED_WITH_BLOCKERS`。产品 Builder 准入：`NOT_READY`。**现有 QPIPE 可组合窄普通查询引用；但真实查询配置不是一个已冻结、可无损投影的统一 schema。至少 displayType 0/2/5 普通控件、1/7 时间输入、8 参数、9 树形及 22 数值范围分支会写入不同字段。字段目录当前由画布组件和 canvasViewInfo 推导；级联节点又同时包含独立 node id、编码的 dataset/query/field 复合键、展示占位字段和运行值。现有确认路径分两次 tick 改写 propValue/cascade，并触发快照、重渲染与 queryData。将窄模块接入现有 UI 尚不能证明完整配置承载、引用重绑、零副作用失败或一次安全提交。

本轮已识别可精确继续调查的边界，但缺完整、版本化的字段白名单/逆向还原规则、源与目标目录的可信构造契约及单次提交入口；不得以“只支持0/2/5”关闭 Q066/Q067，也不得把拒绝其他合法分支当作最终方案。只读配置保密、每次访问权限检查、撤权和恢复依赖真实权限模块与隔离多用户环境，继续 `BLOCKED / NOT_RUN`。

## 源码证据与生命周期

| 主题 | 直接证据 | 设计含义与边界 |
|---|---|---|
| 初始配置和历史补全 | `options.ts:6–77,80–137`；`QueryConditionConfiguration.vue:1676–1685` | 新建配置含 `field/dataset`、`displayType`、`optionValueSource`、参数和映射字段；配置打开会对历史 `propValue` 逐项 `parameterCompletion`。新建默认值不能代替旧配置的历史解释。 |
| 字段组件目录 | `QueryConditionConfiguration.vue:97–163` | 现逻辑从 `componentData`、一层 DeTabs/Group 子项与 `canvasViewInfo[component.id]` 得 `tableId`，再查询字段信息。它不是通用递归树遍历，也未证明是权限完整、跨画布一致的产品目录 API。不能用组件名或 dataset 字段名替代组件身份。 |
| 引用规则与控件分支 | `QueryConditionConfiguration.vue:1185–1212, 1270–1350, 1460–1578`；`Select.vue:677–720,784–792` | `0/2/5 + optionValueSource=1` 普通级联配置使用 checkedFields 与 checkedFieldsMap；`9` 树控件由 treeFieldList/treeCheckedList 表达多字段映射；`8`、`22`、时间与参数控件有不同路径。QPROJ 仅覆盖它声明的普通窄域。 |
| 值状态 | `Select.vue:124–150,276–279,677–720`；`QueryConditionConfiguration.vue:164–176` | `defaultValue/defaultMapValue` 属于配置默认；`selectValue/mapValue/currentSelectValue` 还承载当前或级联联动状态。配置复制要保留规则和默认语义，同时不把运行时选择复制成源查询结果；缺少完整字段分类及重派生规则时不能整体 JSON 克隆后声称满足合同。 |
| 级联编码与节点身份 | `QueryCascade.vue:37–65,68–88,142–175` | 每个节点有独立 `id`；选择值编码为 `${datasetId}--${queryId}--${fieldId}`。同数据集后继会成为 placeholder 并清空 fieldId；`selectValue` 在确认时重置为空。node ID、被引用 query ID、dataset/field 三段和 placeholder 都不能混作一种引用或用名称映射。 |
| 当前提交与副作用 | `QueryConditionConfiguration.vue:1590–1629` | 先把 `propValue=[]`，后续 tick 写 cascade、propValue，再记快照，下一 tick 发 `reRenderAll` 和 `queryData`。这是真实多阶段变更路径，不构成原子提交。暂不能把它直接用作“失败零改变/单次应用”的粘贴入口。 |
| 现有组件复制 | `copy.ts:50–87,117–140` | 整组件复制会生成组件及查询条件 ID，再对 propValue/cascade JSON 字符串执行旧 ID 正则替换。它没有按过滤字段类型执行闭包/目标能力检查；且正则替换不是 typed schema 适配器。F01 专用过滤复制不得借它证明安全或改变其既有职责。 |

## 与 QPIPE 的边界

QPIPE 输入是 `propValue`、`cascade`、调用方提供的 source/target component directories，以及 condition/node ID maps。调用顺序固定为 QPROJ→QMAP→QPREP。QPROJ 当前只接受其已声明的普通查询引用范围；QMAP 根据显式 source/target directory 中的数据集 ID 和 field ID 求唯一目标组件；QPREP 检查显式 typed 引用闭包、单射、身份与环。三个模块的有限通过不证明目录可由产品安全构建，也不证明投影之外的原始配置字段已完整保留。

候选接入原则：产品适配必须先产生完整的、独立副本的配置候选；只对其 typed 引用部分调用 QPIPE；再将已验证的新 condition/node/component IDs 和字段引用回写到版本化白名单载荷。任一字段或引用不能被识别、目标不唯一/不可承载、版本未知时整次拒绝，不能裁掉复杂引用或复用已有 ID。提交前还需确认用户身份、源/目标能力、query 文档版本及候选未过期；确认期间变更要重验。以上是待复核的设计约束，当前没有可安全调用的单次 commit API。

## 值得继续冻结的范围

1. **静态分类表可继续作为调查产物。**明确配置字段、默认值、运行值、重算值、引用值、展示/历史值和版本字段；对 displayType、optionValueSource、树/参数/数值范围和条件默认值分别列出来源与规则。没有证据的字段标为 unknown，不默认可丢弃或可复制。
2. **目录候选须受调用方显式注入。**QPIPE 纯模块不得自行访问 Store 或 API。真正产品调用方需从当前画布及嵌套 Group/DeTabs 完整收集组件 ID，再经现有授权的数据/字段查询确认 datasetId 与 fieldIds；目前现有 `dfsComponentData` 并非任意嵌套递归，也尚未给出目标权限证明，不能直接提升为可信目录。
3. **提交协议单独设计。**prepare 不写 Store、不发 queryData、不记快照；commit 应在一个受控入口原子发布 query root 和引用 carrier，单次记录快照/预览计划。当前 `confirmClick` 不是该接口，必须基于 Vue 响应与快照链另行冻结并实测。
4. **持久化/撤销策略保持未决。**需要定义复制候选在保存失败、重开、undo/redo、旧快照、历史版本无 carrier、异步 query 回包时如何绑定最新 query root，避免以旧根覆盖样式/布局等并发编辑。现有证据不足以批准一种投影/overlay 算法。
5. **权限不能由前端目录推定。**source/target directory 仅可作为候选元数据；查看配置、读取字段、粘贴与保存均须复用实际访问和编辑权限。缺真实 XPack 权限实现与隔离账号时，不接入可暴露配置的 UI，不把按钮隐藏作为访问控制。

## 可执行设计用例候选

`QueryProductAdapterFixtures-r001.json` 记录 8 个设计期 identity。它们均为源码形态推导的候选 oracle，不是已冻结产品案例或执行结果：普通远程控件完整转换、treeFieldList/treeCheckedList 闭包、参数/数值范围分支、配置默认与运行态分离、同数据集同字段的唯一目标、同名异 ID/重复目标拒绝、级联 placeholder 的 node/query/dataset/field 身份重绑，以及确认期间文档版本变化。当前能够建立的只有有限模块单测；identity 5–8 的运行时 authority 或 commit oracle 缺证，必须标 `NOT_RUN / DESIGN_GAP`。

## Builder 阻塞与所需证据

| 缺口 | 阻塞的产品行为 | 最小解锁证据 |
|---|---|---|
| QPAD-01 完整字段/schema 白名单 | F01 通用配置完整副本；历史和复杂控件兼容 | 每个持久字段的源码定义/写入/读取映射；普通、树、参数、时间和数值分支的可信版本 fixture；默认/当前值剥离与重建规则独立评审。 |
| QPAD-02 可信 source/target component directory | 精确数据集/字段校验、目标唯一性与完整承载 | 完整嵌套画布收集规则、目标字段加载与权限 API 证据；无目标、重复、同名异 ID、未授权/撤权的可复现测试环境。 |
| QPAD-03 内部 ID 重绑及 carrier | query/node/condition 与 component 引用闭包 | typed 全树闭包规范，包括树控件、复合 dataset-query-field、同数据集 placeholder、多 query 条件和历史 ID；完整新 ID 规划及 collision oracle。 |
| QPAD-04 单次安全 commit 和保存/撤销 | 取消/错误零副作用、确认后整树覆盖、即时预览、正常保存重开、undo/redo | 新增调用点的状态机/事务边界、snapshot/queryData 精确次数、query root 并发版本规则、旧载荷与晚回包规则的独立设计评审。 |
| QPAD-05 真实权限环境 | 只读不可查看/复制/粘贴、撤权后拒绝并恢复基线 | 维护者提供授权模块来源或隔离多用户实例；editor/viewer/admin 测试账号及安全凭据 locator；直接接口与 UI 联合拒绝/恢复证据。 |

故该设计候选**不请求产品 Builder 准入**。下一步仍是补足 QPAD-01/02/04 的公开源码证据和可追溯 fixture，形成更完整的 query adapter 设计复核；权限项等待维护者授权来源/隔离环境。Goal 保持完整分母与进行中状态。
