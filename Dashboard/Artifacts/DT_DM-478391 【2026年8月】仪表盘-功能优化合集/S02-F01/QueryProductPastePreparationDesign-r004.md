# 查询过滤粘贴纯准备合同 r004

状态：`DESIGN_CANDIDATE_REVIEW_REQUIRED`。本版只修订 r002/r003 独立审查指出的合同问题。r003 的三个初始 finding 中，映射/阶段冲突关闭；其余finding主体已接受，r003 review 报告指出的 JSON Patch 操作及源码列投影两项 blocker 在本版修复。r002/r003 与两份审查原件均保留。尚未准入实现。

本切片定义一个 detached 纯准备与复验 helper：接收完整源 VQuery、上游生成的显式 `referencePlan`、来源和目标组件目录、完整目标根及目标枚举证据；复用 QTARGET 生成 design/runtime 候选；在确认前复验所有绑定。它不作映射决策、不提交产品状态、不连接 UI、不触发预览/查询/快照/保存、不认证身份或授权，也不关闭完整 Goal AC。

## Authority 与范围

权威 Goal 为 `Goal.final.json`。原分母保持 10 项 Goal AC、26 项 must-have、16 项产品义务，`Scope Delta: none`；S01 继续独立收尾。本窄测试域为普通文本单选、`multiple=false`、`optionValueSource=1`、`defaultValueCheck=true`、`defaultValueFirstItem=false`、一个 `propValue` 条件和空 `cascade`。其他形态继续留在父 Goal，不因本 helper 的拒绝域删减义务。

真实权限实现和隔离多用户测试环境不可用。只读用户查看/复制/粘贴、目标编辑权、撤权及恢复验收继续 `BLOCKED / NOT_RUN`。本 helper 不接受权限布尔值、UI `editMode` 或字符串标签作为授权证明，不得接产品 UI，也不得返回 `canCommit`。

## 完整输入与确定性检查

唯一入口为 `prepareQueryProductPaste(input)`。根精确键为 `{schemaVersion, source, target, referencePlan, sourceComponents, targetComponents, targetEnumEvidence}`，版本固定 `s02.query-paste-preparation/1`。所有输入必须是无 getter、无 symbol、无特殊原型、无循环/稀疏数组、无 `undefined`/非有限数的 JSON 安全值；重复/未知键失败关闭。

- `source` 精确为 `{componentId, sourceRoot}`。本 helper 不复制 QCARRIER 的校验算法：源包装结构合法后，将原始 source 根和 `referencePlan`、`targetComponents` 交给 QTARGET 一次；QTARGET 返回的 `stage/reason` 原样透传。来源 shape 错误因此为 `QCARRIER` 阶段，而非另造 `SOURCE` 映射。
- `referencePlan` 是上游明确生成的完整 QPREP 计划。helper 不从目录推导计划、不选目标、不推断歧义；将计划及 `targetComponents` 原样交给 QTARGET。存在未被计划引用的合法目录项不构成歧义。来源选择与计划生成仍属于上游 adapter 的责任。
- `sourceComponents` 是与 source 同一时点的 JSON 安全、不可变目录快照，只用于绑定输入代际和复验一致性；本切片不验证其授权、完整性、身份真实性或新鲜度。不得把它作为另一份映射依据。
- `target` 精确为 `{componentId, expectedRevision, expectedSignature, componentData}`。`componentData` 是完整目标顶层根；目标 VQuery ID 必须唯一，且节点的 `component`/`innerType` 均为 `VQuery`。先校验目标完整根、唯一性和 `expectedRevision`/`expectedSignature`，signature 使用递归对象键排序、保持数组顺序、UTF-8、无空格 JSON、SHA-256。此本地 `TARGET` 阶段先于 QTARGET；因此若本地目标签名错误同时 source/QTARGET 输入也错，唯一首错为 `TARGET/TARGET_VERSION_MISMATCH`。
- 本地目标检查成功后，恰好调用一次真实 QTARGET。其内部次序是 `ENVELOPE → QCARRIER → PLAN → DIRECTORY`，失败阶段和原因原样保留；例如计划错误先于目录缺失，空目录返回 `DIRECTORY/TARGET_UNRESOLVED`。QTARGET 成功后才进入 `DEFAULT_ENUM`。阶段总顺序固定为 `ENVELOPE → TARGET → QTARGET(ENVELOPE/QCARRIER/PLAN/DIRECTORY) → DEFAULT_ENUM → CANDIDATE_BINDING`。

候选根从完整 `componentData` 深拷贝，只替换 ID 精确匹配的目标 VQuery 的 `propValue` 与 `cascade`：design 使用 QTARGET 的 `design`，runtime 使用 `runtime`。其他组件、布局、目标根、源根、目录及输入均深等值保持，任意两个输入/输出对象无共享可变引用。

## 默认枚举证据

`targetEnumEvidence` 精确为 `{status, targetComponentId, targetRevision, identityGeneration, requestInput, requestKey, rows, complete}`。`requestInput` 精确为 `{queryId, displayId, sort, sortId, resultMode, searchText, filter}`。`rows` 是从目标枚举原始响应投影出的逐行配对事实，每行精确 `{displayValue, fieldValue}`；这只是本 helper 的输入证据格式，不是 `Select` 的 `{label,value}` 选项，也不表示 endpoint 或身份已被认证。

投影字段固定：`displayValue = String(row[displayId || field.id])`，`fieldValue = String(row[field.id])`，保留同一原始响应行的对应关系；本样例的 `displayId=province_name` 与 `field.id=province` 是不同列。先丢弃 null 行，再按 `displayValue` 去重，顺序沿首次出现顺序。禁止把两个独立值集合做笛卡尔式成员判断。源码中选项 label/value 均来自显示列；`defaultMapValue` 则通过同一原始行按显示值查回字段 ID 值。因此 `defaultValue=A` 与 `defaultMapValue=A-code` 必须同时出现在同一 `{displayValue:'A',fieldValue:'A-code'}` 行中。

除 `resultMode` 外，请求输入必须与 QTARGET design 条件按 Select.vue 的请求构造完全一致：queryId 来自 field.id；displayId 使用配置 displayId 或 field.id；sort/customSort 归一为真实请求值；sortId、searchText 与 filter 均逐值比较。请求目标组件 ID、revision、identityGeneration 必须等于当前绑定。`requestKey` 是对 `{identityGeneration,targetComponentId,targetRevision,requestInput}` 按 canonical JSON 算法重算的 SHA-256；key 仅证明投影内部一致，不认证响应来源或新鲜性。

若要求证明缺值，调用方必须提供 `resultMode=1` 的完整性响应；`complete=true` 搭配 `resultMode=0` 固定失败 `DEFAULT_ENUM/ENUM_COMPLETENESS_INVALID`。本 helper 不发请求、不判断服务端是否完整，也不把 mode=1 写入目标运行配置。status/身份/key/请求与候选不符返回各自唯一失败；缺省 display/field 配对不成立时返回 `DEFAULT_NOT_FOUND`（完整），或 `ENUM_UNCERTAIN`（不完整）。目标默认 A 缺失与用户裁定的运行时迟到选择 C 分开：C 只核对一次，核对结束即结束 loading，仍缺则保留并显示无效；不得以此策略放行无效默认值。

## 复验 API 与不透明句柄

成功准备返回 `{ok:true,handle,candidate}`。`handle` 是冻结不透明对象并只登记在模块私有 `WeakMap`；绑定 source、sourceComponents、referencePlan、targetComponents、目标根/revision/signature、枚举证据/请求 key 和 identityGeneration 的独立深副本摘要。句柄不是授权 token。

复验唯一签名为 `revalidateQueryProductPaste(handle,current)`，`current` 精确键为 `{targetRevision,targetComponentData,targetComponents,sourceComponents,targetEnumEvidence}`。该函数不重新发请求、不运行 QTARGET、不更换候选。按固定顺序检查：handle 必须由当前模块实例签发；目标 revision/根完整签名；targetComponents、sourceComponents 的完整 JSON 摘要；枚举 status、请求输入/key、rows、完整性及身份代际摘要。任何差异返回唯一 `{ok:false,stage:'CANDIDATE_BINDING',reason:'HANDLE_INVALID'|'DEPENDENCY_CHANGED'}`，不泄露候选。全部相同才返回 `{ok:true,candidate:独立深副本}`。返回的候选副本可被调用方修改，不得影响 WeakMap 内部快照或后续复验结果。

准备和复验均不修改任一输入，不写 Store，不改变 selection/owner/config/history/cache，不触发预览、query、save、事件或网络状态；失败绝不返回部分候选。

## 冻结用例与实施边界

机器用例为 `QueryProductPastePreparationFixtures-r004.json`。文件沿用稳定 fixture schema `s02_query_product_paste_preparation_fixtures_r001`，修订号由 `revision` 与 `design_ref` 表达。成功样例以 QTARGET r008 的 `TC-QTARGET-REBUILD-001` 为基底，仅将源条件 `displayId` 从 `province` 改为 `province_name`，使同一原始响应行可合法投影为显示值 A 与字段值 A-code；目标请求 `queryId=province`、`displayId=province_name`。完整变换指令、依赖摘要和输出差异在 fixture 的 `dependency_refs` 明确列出，不把旧的同字段样例冒充该投影。QPP-007 在目录额外加入未引用的合法 chart-C 后成功，计划仍唯一指向 chart-B；QPP-006 空目录按 QTARGET 精确返回 `DIRECTORY/TARGET_UNRESOLVED`。其他每个失败只有一个首错和唯一 stage/reason。

新增 oracle 覆盖：目标签名错误优先于 QCARRIER/PLAN 错误；正常复验成功；invalid handle 优先于坏 current；计划错误先于目录缺失；枚举显示/字段值配对、错置配对、mode0+complete=true、mode1 完整缺项、请求参数不匹配但 requestKey 自洽、identityGeneration 变化；返回候选被外部修改后再次复验仍返回干净副本。每个失败均断言目标输入根、运行根、选择、owner、history cursor/length/cache、preview/query/save 计数不变。

仅当此版独立语义审查接受后，父流程才可为纯 helper/runner 创建新 Builder Card、Context、可信 RED/GREEN 和精确 execution admission。实现范围仅限 `core/core-frontend/src/custom-component/filter-copy/query-product-paste-preparation.ts` 与同身份测试 runner；不改 UI、Pinia、生命周期 owner、snapshot、preview、save、权限、共享缓存或冻结输入。此 detached helper 最多证明候选准备/复验行为，不证明真实 endpoint 完整性、来源/目标身份认证、权限、Store 提交、产品 UI、保存重开、Goal AC 或完整 S02。
