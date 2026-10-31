# 查询过滤粘贴纯准备合同 r001

状态：`DESIGN_CANDIDATE_REVIEW_REQUIRED`。本合同冻结一个可单独实现与测试的纯准备切片：从已绑定的普通文本单选源、目标画布与目标图表目录，复用现有 QTARGET 重建器生成完整、脱离引用的目标根候选，并在用户确认前复验候选绑定。它不提交产品状态，不连接 UI，不触发预览、查询、快照或保存。它不关闭复制粘贴产品链路或任何完整 Goal AC。

## Goal、范围与边界

authority 为 [Goal.final.json](Goal.final.json)，完整分母保持 10 项 Goal AC、26 项 must-have、16 项产品义务，`Scope Delta: none`。S01 不变。只读用户保密、真实数据权限、目标编辑权、撤权及恢复验收继续 `BLOCKED / NOT_RUN`；真实权限模块和隔离多用户环境无可用授权来源。

本切片支持一个来源条件：普通文本单选、`multiple=false`、`optionValueSource=1`、`defaultValueCheck=true`、`defaultValueFirstItem=false`、单个 `propValue` 条件、`cascade=[]`。源默认为目标完整设计输入；源运行选择可为 B，目标默认可为 A。现有 QCARRIER/QTARGET 算法负责条件字段规则和运行态重建，本切片只绑定产品两端、映射目录和完整根候选。非该形态、未知字段/版本、无法唯一映射、不能证明默认值有效、依赖变更均失败关闭；这些失败不永久移除其他合法形态的 Goal 义务。

无用户可见入口，也不读取系统剪贴板。函数不接受授权布尔值、UI editMode 或“已经准备好”的标签作为权限证明；无授权字段是刻意边界。当前设计不准许把函数接到产品 UI。

## 唯一候选 API

新增候选模块：`core/core-frontend/src/custom-component/filter-copy/query-product-paste-preparation.ts`。

`prepareQueryProductPaste(input)` 接受 exact-key JSON：`{schemaVersion, source, target, referencePlan, sourceComponents, targetComponents, targetEnumEvidence}`。

- `schemaVersion` 固定为 `s02.query-paste-preparation/1`。
- `source` 精确为 `{componentId, sourceRoot}`；root 含完整单条件 `propValue` 与空 `cascade`，可同时携带默认 A 与当前运行 B。QTARGET/QCARRIER 从该真实完整对象产生独立 design/runtime 输出；产品层不自行删除或推导值字段。条件 ID 与 VQuery 组件 ID 属不同身份域。
- `target` 精确为 `{componentId, expectedRevision, expectedSignature, componentData}`。`componentData` 是完整顶层根；目标 VQuery ID 必须全根唯一、组件/innerType 都为 `VQuery`。多个其他 VQuery 可保留；只替换 ID 精确匹配的目标，不以“第一个 VQuery”代替身份。revision 是调用方当前编辑代次；signature 是按 JSON 对象键排序、保留数组顺序的 UTF-8 JSON SHA-256。签名覆盖完整 `componentData`，包括目标现有设计、布局和所有其他组件。
- `referencePlan` 是已有 QPREP 精确结构；计划的每个 `targetRef` 必须与源 checkedFields 按顺序一一对应。`sourceComponents` / `targetComponents` 使用 QMAP 已冻结目录结构；目标映射由现有 QMAP 唯一候选算法产生，不按显示名称猜测、不新增人工映射产品字段。新条件 ID 必须不与目标完整根中任何现有查询条件 ID 冲突；VQuery 组件 ID、图表 ID、条件 ID 分别校验，不能混用。
- `targetEnumEvidence` 精确为 `{status, datasetId, fieldId, queryId, displayId, sortId, sort, resultMode, searchText, filter, optionFilter, requestKey, values, complete}`。它来自调用方实际目标枚举请求的已解析快照；纯函数不发网络请求。`requestKey` 是这些请求字段及当前身份代际的规范签名，必须与目标引用解析出的枚举请求一致。产品 API 对 `resultMode=0` 限制1000行；只有真实完整结果模式（`resultMode=1`）才可由调用方标记 `complete=true`。若默认显示值 A 及 `defaultMapValue` 中每个 field ID 均在 `values:[{label,value}]` 中精确出现可通过存在性判断；若任一缺失且 `complete=false`，返回 `ENUM_UNCERTAIN`，不得将截断或搜索结果缺项当不存在。若 `complete=true` 且任一缺失，返回 `DEFAULT_NOT_FOUND`。请求失败、未绑定字段、请求身份变化均返回 `ENUM_UNVERIFIED`。该数据输入是功能验证事实，不是身份/授权凭证；fixture 不证明当前权限实现或实际请求结果。

函数依次调用现有 query-reference pipeline 与 `rebuildSingleSelectTarget`；不得复制或重写 QPROJ/QMAP/QPREP/QCARRIER/QTARGET 规则。pipeline 从源引用和目标完整目录唯一计算映射；QTARGET 产出完整 `{design,runtime}` 条件根。准备后对完整目标根只替换目标 VQuery 的 `propValue` 和 `cascade`，其余目标字段及非目标节点深等值保留。目标 `propValue` 使用 design；运行副本独立保存在返回候选的 `runtimeTargetRoot`，用于后续产品适配接入，不写入持久 design root。

成功返回 `{ok:true, handle, candidate}`。`handle` 是模块内 WeakMap 登记的冻结不透明对象，绑定本次完整输入 fingerprint、源 ID、目标 ID/revision/signature、枚举 requestKey、QPIPE 计划与目录摘要；克隆或替换 handle 必须拒绝。`candidate` 给出完整 detached `designComponentData`、完整 detached `runtimeTargetRoot`、映射摘要及 `eligibility:'requires_product_authorization_and_commit_design'`。它绝不返回 `canCommit:true`。

`revalidateQueryProductPaste(handle,current)` 只重验候选绑定：目标 revision/signature、完整映射目录、枚举 requestKey 与确认时默认值依赖必须逐项匹配。成功只返回 `{ok:true, candidate}`，仍不授权提交；失败返回唯一 `{ok:false,stage,reason}`，不含部分候选。

## 精确失败顺序

准备阶段阶段优先级固定：`ENVELOPE → SOURCE → PLAN → MAPPING → TARGET → DEFAULT_ENUM → CANDIDATE_BINDING`。阶段内按输入数组原序返回首个错误。

| stage | reason | 唯一含义 |
|---|---|---|
| ENVELOPE | `INVALID_INPUT` / `UNSUPPORTED_FIELD` | 非安全 JSON、精确键缺失/额外或 schemaVersion 不支持 |
| SOURCE | `UNSUPPORTED_SHAPE` / `SOURCE_ID_INVALID` | 不支持的 query shape 或源 ID/完整载体无效 |
| PLAN | `PLAN_MISMATCH` | 既有 pipeline 的 source/condition/node 引用无法精确对应 |
| MAPPING | `TARGET_UNRESOLVED` / `TARGET_AMBIGUOUS` | QMAP 无同 dataset+field 集合的候选，或候选不唯一 |
| TARGET | `TARGET_NOT_UNIQUE` / `TARGET_VERSION_MISMATCH` | 目标 VQuery 缺失/重复/类型错，或声明 revision/signature 与输入根不符 |
| DEFAULT_ENUM | `ENUM_UNVERIFIED` / `ENUM_UNCERTAIN` / `DEFAULT_NOT_FOUND` | 目标默认选项无法核实、响应截断导致无法证明缺失，或完整枚举证明不存在 |
| CANDIDATE_BINDING | `HANDLE_INVALID` / `DEPENDENCY_CHANGED` | 非本模块 handle、handle 被克隆或复验依赖变化 |

成功和拒绝都为纯函数结果。函数不修改 source/target/目录/枚举输入，不写 Pinia，不变更选择、配置草稿、生命周期 owner、history/cache、预览/query、保存、共享 envelope 或网络状态。所有失败不得暴露部分 `candidate`。

## Frozen oracle 与完整输入展开

机器案例位于 [fixtures r001](QueryProductPastePreparationFixtures-r001.json)。其 `fixture_resolution` 将 QTARGET case 通过 `path + SHA-256 + exact case id` 唯一展开为完整 JSON；解析器只读取 `cases[id].input` 与 `cases[id].expected`，禁止近似匹配、缩短 ID、任选指针或只读取文字说明。目标根、源/目标组件 ID、expected revision/signature、调用事件、完整输出与零副作用状态在每个包装 fixture 中逐项给出；动态 signature 由已冻结 canonical JSON 算法重算。一个 case 只有一个首错，不使用 `or`。

必需身份：有效 A/B 分离成功、无默认成功、A 在完整枚举中缺失、A 缺于截断枚举、枚举请求失败、目标条件/组件缺失、重复目标 ID、映射缺失、映射歧义、确认期间目标 root 变化、确认期间目录变化、handle 克隆/替换、双错首错优先级、输入深冻结和所有拒绝零副作用。每个 case 均断言完整 target root、目标 runtime、非目标根节点、selection、owner、history cursor/length/cache、preview/query/save counters 均未被纯函数改变。

普通单选复用已独立验证的 TC-QTARGET-REBUILD-001 完整对象与 oracle；它仅是子程序输出，不替代本切片的 target-root 成功 oracle。晚到枚举 C 仍按用户裁定只追加一次核对，核对结束关 loading、仍缺保留无效；该运行期策略不改变默认 A 的 `DEFAULT_NOT_FOUND/ENUM_UNCERTAIN` 准备失败规则。

## 实施与声明上限

若本设计获独立审查通过，唯一实施目标为上述纯 preparation/revalidation 模块与对应 `tests/filter-copy-query-reference/query-product-paste-preparation.test.ts`。Builder 不得修改目标 UI、Pinia、生命周期 owner、snapshot、预览、保存、权限接口、共享缓存或任何冻结输入。开工前仍须新的目标绑定 Card、Context、RED/GREEN 与 `execution_admission`。

该切片最多证明 detached target preparation 与依赖复验；不证明来源真实身份、真实枚举响应路由、任何权限、UI 提交、owner 重绑、快照追加、实际查询、保存重开、Goal AC 或完整 S02。产品 UI/Store 入口要另行冻结实际 owner/历史/预览顺序与公开权限接口，并在真实隔离多用户环境验证后才能准入。真实权限阻塞不自动否决本 detached helper，也不能靠 helper 关闭权限义务。
