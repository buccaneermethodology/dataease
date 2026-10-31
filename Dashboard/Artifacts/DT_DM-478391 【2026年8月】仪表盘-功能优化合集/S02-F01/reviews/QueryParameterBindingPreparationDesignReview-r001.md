# 查询参数引用准备器独立设计审查 r001

## 第 1/3 轮与双结论

**Design Freeze：NOT_READY（离线纯子合同仍缺明确输入域、失败优先级与完整 oracle）。Implementation Entry：NOT_READY（目前不能申请本 helper 的实现准入）。** 完整产品接线继续未准入，真实权限 BLOCKED / NOT_RUN；S01 F01 是可读 Entry Packet 中的 CONDITIONAL，不能说文件不可用，也不能提升 READY。

纯显式映射准备器可以成为合理的小切片；未知映射生产者、真实权限和 S01 条件不必无差别阻断这个无产品接线的纯函数设计。当前阻断来自子合同本身的歧义/未覆盖项，而不是要求先解决整个 R4-04。保持 10 Goal AC、26 must-have、16 产品义务，Scope Delta none；不关闭任何 AC/R4-04。

## 输入与审查入口

已复算设计 card canonical digest `30a481cba0b97e5cb813f7a42c53d1b339d78e56a2eb666f6dd364ca7da31432`，validate 通过，随后带 expected digest 复验并读取 renderer。委派未单独提供预期 digest，故该值为本轮实算/工具确认值，不伪称来自上游独立固定值。Context/设计/fixture 及 13/13 required-read 写前摘要一致，未发现源码漂移。

卡片及 Context 描述的是设计产出 lane，write_scope 不含 review；本轮审查及唯一写入权限来自父任务明确独立审查委派，未借设计卡片修改候选。Context 诚实记录候选先于 card/context 验证落盘，不追认该顺序；本报告不消费它作为产品 Builder admission。

审查覆盖 Goal、Design、DesignGaps、QueryProductAdapterDesign/Fixtures r004、当前设计/10 fixtures、SqlVariableDetails、参数生成/消费、QPIPE、PermissionEnvironment 与 S01 Packet。大体积前序 fixture 按结构、R4-04 字段矩阵及相关 gap/参数内容核对，不宣称所有无关形态运行验证。DesignGaps.json 本身只有 DG-01..06；R4-04 的实际载体是 QueryProductAdapterFixtures-r004.json.open_gaps，不能混称同一 ID 空间。

## 源码关键事实

- SqlVariableDetails.java:10–28 确为列出的 14 字段；id 为 String，datasetTableId/groupId 为 Long 并字符串序列化。type 是 List<String>，details/defaultValue 是 String，deType 为 int，required 为 boolean，defaultValueScope 为 EDIT/ALLSCOPE 枚举。字段名列表正确，当前 fixture 并非这些字段完整实例。
- QueryConditionConfiguration.vue:688–695 的普通选择写 `curComponent.parameters`，用 `!!variableName` 筛参数；不是写 parametersArr。599–632 的时间/数值双端才写按 componentId 分区的 parametersArr，也筛 variableName。
- 667–677 duplicateRemoval 按输入目录中的第一次同 id 对象保留；双端列表来自 fields 展平/过滤后的目录顺序，不是由 Start/End Map 排列。
- useFilter.ts:516–523 普通分支从 parameters 按 ID 精确找；525–590 范围分支按 Arr/Start/End Map 选择端点并分配 result[0]/[1]，从 parametersArr 按 ID 查 DTO。端点语义不是 parametersArr 数组位置编码。593–594 等 |DE| 条件影响 operator，不能当参数身份验证器。
- QPIPE 仍是普通 QPROJ→QMAP→QPREP，未提供参数 source→target 映射 authority。前序 R4-04 要求完整 DTO、六个 range Maps、混合字段/参数和 searchQuery 输出，此 helper 只是其中一部分。

## 完整 findings inventory

### PBP-R1-01 / P1 / blocking：普通分支和范围端点的输出职责混淆

位置：设计“从…生成新组件 parametersArr”“有界输入输出合同”，PBP-001/002/003。

依据：普通选择实际写 parameters，消费也读 parameters；range 的起止依赖六个 Maps，列表顺序则是目录顺序。设计将 sourceParameterIds 称为“按消费顺序”，PBP-002 的 start/end 排序只能证明调用方数组顺序保留，不能证明端点重绑正确。

影响：Builder 可把这个列表当通用单双端参数适配结果，遗漏 scalar parameters 或 range Maps，仍用 fixture 通过宣称端点正确。

建议：明确模块是通用 ID→描述对象列表投影，还是仅 parametersArr；说明各下游承接位置。若不处理 Maps，显式列为输入生产者/集成层责任；顺序为本纯模块选定的输出规则而非源码消费事实。保留端点方向为后续未证，不扩大本轮实现。

Disposition：OPEN，需澄清子合同语义。

### PBP-R1-02 / P2 / blocking：输入有效域和稳定失败优先级未定义

位置：设计“空/非法参数…单一稳定 reason”，Fixtures 全部 cases。

依据：没有空 sourceParameterIds、非法 componentId、null/非数组 catalog、非字符串 ID、映射值为空/非字符串、非对象条目等精确行为和 reason；没有同时存在缺映射/目标重复/碰撞等冲突时的优先级。重复目标 ID 是全目录拒绝还是只检查被引用目标也不明。

影响：两个实现都可通过现有 10 例而对同输入产生不同结果；“稳定 reason”不可验。

建议：冻结输入类型/空值域、自己的映射键读取规则、校验顺序和 reason 集合；给出多错误冲突例、空列表合法/拒绝结论及未引用坏目录项处理规则。仅限当前纯函数边界，不要求新增产品错误码。

Disposition：OPEN。

### PBP-R1-03 / P2 / blocking：深拷贝/冻结/不变性 oracle 并不存在

位置：设计“Fixtures…输入深冻结/输出隔离分别给出完整 oracle”；当前 10 个 fixture。

依据：没有 frozen input 操作、对象引用关系断言、输出修改后输入不变断言，也没有嵌套对象/数组的隔离 case。现有 expected JSON 值相等无法区分返回原目录对象还是深拷贝。设计只要求输入冻结保持不变，没有明确输出是否要求 deep freeze。

影响：共享对象引用实现可通过所有 JSON expected，却破坏源/目标独立副本要求。

建议：增加明确 harness 操作和断言（递归冻结输入、调用不写输入、输出与所有输入嵌套节点无共享可变引用、输出修改后输入不变）；若输出要求不可变另定义冻结语义，不能把深拷贝和 Object.freeze 混用。

Disposition：OPEN；当前不能称这一项已给完整 oracle。

### PBP-R1-04 / P2 / blocking：DTO 与 opaque JSON 记录边界不一致

位置：设计“目标 DTO 目录”“完整 JSON 形状”、Fixtures.fields 及 PBP-001..010。

依据：PBP-003 只有 id/deType，PBP-005..009 多数仅 id；没有完整 14 字段对象、defaultValueScope 枚举及 null/未知字段保留案例。源代码生成会筛 variableName，但纯模块没有参数/普通 field 区分规则。对缺字段目录若仍允许成功，就不能称完整 DTO 验证或来源等价。

影响：调用方把普通字段或不完整参数元数据传入时，当前成功结果可能被误解为完整参数 DTO 已准备。

建议：明确是 caller-trusted opaque JSON record 的保真复制（只校验 id，排除 DTO schema/混合分类），或定义实际 DTO 子合同。至少提供一个真实字段形状的完整保真 fixture、未知键/嵌套值保留断言及混合参数/field 边界例。不得用字段数组就宣称完整 DTO/历史兼容。

Disposition：OPEN。

### PBP-R1-05 / P2 / non-blocking：多对一和重复目录政策未获产品权威，仅能是局部支持域

位置：设计失败段/未决第 2 项；PBP-007/008。

依据：现有 duplicateRemoval 对相同 id 取首次，并不拒绝；候选反而拒绝重复目标 DTO 和多对一映射。设计已注明这是保守候选边界，未发现隐藏地宣称产品永久不支持。

影响：如果未来接到产品路径，可能拒绝合法重复引用，不能由此关闭 R4-04。

建议：冻结时明确 reason 表示本 helper 无歧义支持域之外、不得升格产品永久拒绝；对等同与冲突重复、同源重复与不同源多对一分别给 oracle。无需为了纯 helper 先找真实权限环境；产品策略仍保持 unknown。

Disposition：OPEN / 有界条件，不能推导全产品政策。

### PBP-R1-06 / P2 / non-blocking：映射生产者未知，但离线输入信任约定需要更精确

位置：sourceParameterIds/targetIdBySourceId/targetParameterCatalog；PBP-010。

依据：候选明确不选择或认证映射，且 PBP-010 将 table/group 从 7/13 映成 9/17，只能作为 opaque 字符串测试，不证明同数据集兼容。没有绑定证明当前组件实际参数引用由谁从 scalar/各 Maps 中提取，或目标 catalog 与 componentId 的一致性由谁保证。

影响：外部 caller 未经正确生产却用成功结果当授权/跨数据集映射凭证。

建议：列清 caller 必须提供的类型化引用和已验证目录前提，PBP-010 标明合成 opaque 样本；保留真实生产者/目录签名与兼容检查为产品接线门槛。helper 本身不做名称、alias、type、|DE| 推断是正确方向。

Disposition：OPEN / 集成边界；不把未知 producer 本身作为纯函数不准实施的唯一理由。

### PBP-R1-07 / P2 / correction：S01 Entry Packet 状态描述错误

位置：设计未决第 4 项。

依据：写“真实环境与 S01 F01 Entry Packet 仍不可用”，但读集中 SP-005/S02-S09_EntryPacket.md 存在且 S02/F01 CONDITIONAL。真实权限不可用与包不可读不同。

影响：制造不当前置并与 Context 自己的 S01 CONDITIONAL 冲突。

建议：改为包可读、相关进入条件尚未满足/绑定；不提升 READY，也不以此无差别阻断独立纯模块。

Disposition：OPEN，源码/依赖事实修正。

### PBP-R1-08 / P3 / non-blocking：实施文件范围与验证输出尚不精确

位置：设计“仅新增…与其定向测试/证据”；Context.actual_topology。

依据：实现模块路径精确，但 tests/evidence 路径、公开函数签名与测试入口未列；现 card 是设计产出且记录先写后验，不是 Builder admission。

影响：不能直接用此卡片执行实现或确认全部写入目标；不是授权丢失。

建议：在后续独立 Builder 卡片固定函数接口、测试/证据路径及合同/RED 身份，消费另一个 action/target 匹配 admission。保留先写后验 deviation，不追认。

Disposition：OPEN / 后续准入准备。

## 10 个现有 fixture 逐项核对

| Case | 当前覆盖 | 仍不能证明 |
| --- | --- | --- |
| PBP-001 | scalar 精确映射、目标值保留 | 普通 parameters 消费接线、完整 DTO |
| PBP-002 | 输入 start/end ID 列表顺序保留，反向目录 | 实际 range Maps 方向或查询结果 |
| PBP-003 | 两个数值 ID 列表 | 数值类型/范围、0/空边界、完整 DTO |
| PBP-004 | 同源重复只保留首次 | 多 ID 交错首次顺序、不同源重复目标合法性 |
| PBP-005 | 单一缺映射 reason | 多错误优先级、无继承属性误取值 |
| PBP-006 | 目标缺项 | 非法目录形态与未引用项规则 |
| PBP-007 | 被引用目标 ID 重复拒绝 | 重复字段不同/相同的产品政策 |
| PBP-008 | 多对一拒绝 | 产品不支持该组合的 authority |
| PBP-009 | 前项有效后项失败，无 partial 字段 | 失败过程中输入保持不变、不可见副作用 |
| PBP-010 | |DE| 完整字符串作为键不改写 | 参数身份合法性、跨数据集映射授权 |

成功 expected 和失败 expected 皆可作为已有 case 的值 oracle，所有 10 项完整保留；不得只删掉非法/不完整例来缩分母。深拷贝、不变性、非法输入、混合与完整保真是设计已声称或边界必需而尚缺的验证，不是要求实现全部参数产品行为。现 helper 不需要网络/DB/真实账号即可验证其纯约束，但当前约束未齐，不能以 mocks 替代产品权限验收。

## 收尾与摘要

下一步是集中修正以上全部 findings 的子合同/fixture，不由 reviewer 补设计。最小安全切片仍可保持离线纯列表准备；不得让“parametersArr 就绪”暗含六个 Maps、parameters/parametersStart/End、searchQuery、权限、SQL、保存或 S01 已完成。双结论只针对本交付物第 1 轮，未要求停止整个 S02。

| 绑定文件 | SHA-256 |
| --- | --- |
| `Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/Goal.final.json` | `f562da2eb14b84dc8083e138dd2eb8718a58041f01d08163eddf5fb2c71daef0` |
| `Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/Design.md` | `6c7f5344446bc640a334cd986e9a1a1276c39be2823433e505cd8ae1943dc117` |
| `Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/DesignGaps.json` | `0a6e1718b0cad911c479ed7faef73664d0bf9d565383d36e226df23f93ec410c` |
| `Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/QueryProductAdapterDesign-r004.md` | `863357ddfbefdf55f715d0d6e9dd8b87f8fc6e5526c5317034822c8facce2044` |
| `Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/QueryProductAdapterFixtures-r004.json` | `9acbf272bbae793d0ccdee2131261d10ba85d256f69e6dfab761510fb9943f2b` |
| `Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/QueryParameterBindingPreparationDesign-r001.md` | `4909fec678fc3b748503db9abc5b5a7935f9aaa4843fbd3ab4567fc7ae0f237b` |
| `Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/QueryParameterBindingPreparationFixtures-r001.json` | `8d2dc8fba517868e89f5f568057a02f084f97a563858abaec52ed7ffb1403768` |
| `sdk/extensions/extensions-view/src/main/java/io/dataease/extensions/view/dto/SqlVariableDetails.java` | `37678b88e71861ba54c806f70815925d91d9913b58e780d644f2dd4cc4aaa6ba` |
| `core/core-frontend/src/custom-component/v-query/QueryConditionConfiguration.vue` | `0b88bcdf92d15aceae52ca2992e7a8b4165e3f5cfc3f9cb7435296d7c7e9e047` |
| `core/core-frontend/src/hooks/web/useFilter.ts` | `d2db975ae988218a921a5e3a76869e1a66d234eeebeedb1bfcf71e847e90416a` |
| `core/core-frontend/src/custom-component/filter-copy/query-reference-pipeline.ts` | `7066211a16f981cbd05df0c5e41d97f2d01b445b397c948f9ce2344ae34b9d10` |
| `Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/PermissionEnvironment.md` | `bf1498aa23f4f864e2c5c3d999b6b1a6044849ba25a9cd7d7d85104b6f233b9d` |
| `Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/SP-005/S02-S09_EntryPacket.md` | `4598a5d74567e1e1d3de81ce263909231dc054d8102535bc0d917238c412c658` |
