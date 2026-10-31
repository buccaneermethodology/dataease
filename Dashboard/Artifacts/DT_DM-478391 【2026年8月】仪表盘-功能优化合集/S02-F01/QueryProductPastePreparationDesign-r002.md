# 查询过滤粘贴纯准备合同 r002

状态：`DESIGN_CANDIDATE_REVIEW_REQUIRED`。本版将范围限定为一个 detached 纯准备与复验 helper：它接收完整源 VQuery、已由上游生成的显式 `referencePlan`、目标组件目录和完整目标根，复用 QTARGET 生成 design/runtime 候选，核验目标默认枚举证据，并在确认前复验绑定。它不作映射决策、不提交产品状态、不连接 UI、不触发预览、查询、快照或保存，也不关闭任何完整 Goal AC。

## Authority 与范围

权威 Goal 为 `Goal.final.json`。分母保持 10 项 Goal AC、26 项 must-have、16 项产品义务，`Scope Delta: none`；S01 继续独立收尾。本切片只处理普通文本单选、`multiple=false`、`optionValueSource=1`、`defaultValueCheck=true`、`defaultValueFirstItem=false`、一个 `propValue` 条件和空 `cascade`。不支持的 schema、字段或依赖变化均失败关闭，不将窄支持域当作永久删减其他 Goal 义务。

真实权限模块和隔离多用户测试环境当前不可用。只读用户不可查看/复制/粘贴、目标编辑权、撤权及恢复验收继续 `BLOCKED / NOT_RUN`。本 helper 不接受权限布尔值、UI `editMode` 或字符串标签作为授权证明，不认证来源身份；不得接入产品 UI，也不得宣称 `canCommit`。

## API 与确定性处理

新增候选模块：`core/core-frontend/src/custom-component/filter-copy/query-product-paste-preparation.ts`。

`prepareQueryProductPaste(input)` 只接受 exact-key 输入：`{schemaVersion, source, target, referencePlan, sourceComponents, targetComponents, targetEnumEvidence}`。版本固定为 `s02.query-paste-preparation/1`。

- `source` 为 `{componentId, sourceRoot}`；`sourceRoot` 是完整、JSON 安全的 VQuery 根，条件带默认 A 和运行 B。组件 ID 与条件 ID 是独立身份域。
- `referencePlan` 是上游明确生成的完整 QPREP 计划。helper 不从目录推导计划或选择目标；不得把给定计划描述成 helper 已认证的映射。helper 将它和 `targetComponents` 原样交给 QTARGET，依赖 QTARGET 做计划与目标引用的确定性校验。目录必须是 QMAP/QTARGET 接受的精确结构。任何映射选择责任都留在后续产品 adapter 设计中。
- `target` 为 `{componentId, expectedRevision, expectedSignature, componentData}`。`componentData` 是完整目标顶层根；目标 VQuery ID 在根中唯一，目标节点的 `component` 和 `innerType` 均为 `VQuery`。`expectedSignature` 为对完整根使用递归对象键排序、保持数组顺序、UTF-8、无空格 JSON 后计算的 SHA-256。确认复验时重新计算完整根签名并同时比较 revision。
- 准备顺序固定为 `ENVELOPE → SOURCE → PLAN → TARGET → DEFAULT_ENUM → CANDIDATE_BINDING`。阶段内按数组原序返回首错。先验证根形状、目标 ID 唯一性和版本签名，再调用 QTARGET；其失败保留原 stage/reason，映射错误不改写为 helper 自行推导的原因。
- 目标候选以完整 `componentData` 深拷贝生成：只对 ID 精确匹配的目标 VQuery 替换 `propValue`、`cascade`。design 根使用 QTARGET 的 `design`；runtime 根使用 QTARGET 的 `runtime`。其他顶层组件、目标布局字段及输入对象均保持深等值且无共享可变引用。

`targetEnumEvidence` 精确为 `{status, targetComponentId, targetRevision, identityGeneration, requestInput, requestKey, values, complete}`。`requestInput` 精确为 `{queryId, displayId, sort, sortId, resultMode, searchText, filter}`。除 `resultMode` 外，它须与 QTARGET design 条件按 Select.vue 的实际枚举请求规则一致：query/display ID 来自字段与 displayId，customSort 归一为 `asc`/空 sortId，其余过滤条件保持实际请求值。用于证明“缺省值不存在”的专用核对请求可将 `resultMode` 设为 1；这不是复制后查询组件的运行模式。`requestKey` 是对 `{identityGeneration, targetComponentId, targetRevision, requestInput}` 采用上述 canonical JSON 算法计算的 SHA-256。`values` 是从已解析响应逐行规范化的 `{label, value}` 数组；这只是枚举事实，不是用户身份或授权凭证。

只有 `status=resolved`、组件/版本/请求身份与候选一致、key 可重算匹配，且默认 `defaultValue` 与每个 `defaultMapValue` 均在 `values` 中精确存在时，才可完成纯准备。若缺项而 `complete=false`，返回 `ENUM_UNCERTAIN`；若缺项且 `complete=true`，返回 `DEFAULT_NOT_FOUND`。发生失败、过期请求、身份变化或 key 不匹配返回 `ENUM_UNVERIFIED`。源码 DTO 将 `resultMode=0` 定义为默认条数、`resultMode=1` 定义为全部。结果模式 0 的响应不能以未出现证明不存在；只有调用方使用结果模式 1 并能提供完整响应时才允许 `complete=true`。函数本身不发请求、不推断响应完整性。目标默认值 A 的缺失规则与用户已裁定的运行时迟到选择 C 分开：C 只重查一次，核对结束关 loading，仍缺时显示无效；不得用迟到 C 策略放行无效默认值。

成功返回 `{ok:true, handle, candidate}`。`handle` 是冻结不透明对象并登记于模块私有 `WeakMap`，绑定输入摘要、源/目标组件 ID、revision、根签名、完整目录、计划、枚举请求 key 与身份代际；复制、克隆或替换的 handle 一律拒绝。`candidate` 含完整 detached `designComponentData`、`runtimeTargetRoot` 和 `eligibility:'requires_product_authorization_and_commit_design'`，不返回 `canCommit`。

`revalidateQueryProductPaste(handle, current)` 只检查本模块发行的 handle，以及当前目标 revision、完整根签名、组件目录和枚举证据与准备时完全一致。成功只返回候选副本，仍不表示可提交；变化返回唯一 `{ok:false, stage, reason}`，不泄露部分候选。成功准备和复验都是纯操作，不写 Store，不改变选择、owner、配置草稿、history/cache、预览/query/save 计数或网络状态。

## 冻结用例与边界

机器用例为 `QueryProductPastePreparationFixtures-r002.json`。QPP-001 的目标重建 oracle 精确依赖 `QueryProductRebuildFixtures-r008.json` 中 `TC-QTARGET-REBUILD-001` 的完整输入/输出，并固定文件 SHA 与 case ID；用例中的目标根合成结果是完整 JSON，不用 `$ref` 代替执行规则。每个拒绝例只有一个首错和唯一失败阶段；source 负例使用真实 `source.sourceRoot` JSON Pointer。每例均断言目标输入根、运行根、选择、owner、history cursor/length/cache、预览、查询、保存计数未变化。

覆盖成功 A/B 分离、未支持 shape、枚举缺项但不完整/完整、枚举失败或请求 key 错误、目录无候选/多候选、目标缺失/重复/身份混淆、计划不匹配、确认时 revision/root/目录变化、伪造 handle 和双错首错优先级。枚举成功 fixture 是纯函数 oracle，不证明真实 endpoint、数据完整性或授权行为。

## 实施边界与后续

只有 r002 独立语义审查给出有界通过后，才为该目标建立新的 Builder Card、Context、可信 RED/GREEN 和绑定此模块/runner 的 execution admission。Builder 写入范围仅限上述 helper 与 `tests/filter-copy-query-reference/query-product-paste-preparation.test.ts`，不得修改 UI、Pinia、生命周期 owner、snapshot、预览、保存、权限、共享缓存或冻结输入。

本切片最多证明 detached 候选准备和依赖复验，不证明来源身份认证、目标枚举端点完整性、真实授权、Store 提交、产品 UI、owner 重绑、快照、预览/实际查询、保存重开、Goal AC 或完整 S02。产品活动入口仍需独立冻结 owner/历史/预览提交顺序与公开权限调用，并在真实隔离多用户环境验证后准入。完整 Goal 的原始分母和权限阻塞均保留。
