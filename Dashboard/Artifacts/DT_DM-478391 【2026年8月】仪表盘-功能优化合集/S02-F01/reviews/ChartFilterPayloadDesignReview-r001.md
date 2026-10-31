# 图表过滤树载荷准备器独立语义审查 r001

## 双结论

- **Design Freeze Validity：`NEEDS_REVISION`。** 这是一个边界清晰的图表 `customFilter` 纯数据 helper 候选，字段保留/叶节点处理的基本结构与当前 `FilterTree.vue` 流程相符；但对 truthy `field` 的剥离规则与来源代码不一致，根/节点形状错误的拒绝边界不够精确，cases 对循环引用、unsupported values 和深度隔离的 oracle 不完整。因此本交付物尚不能作为冻结合同及完整冻结用例。
- **Implementation Entry Readiness：`NOT_READY_FOR_IMPLEMENTATION`。** 先修复本报告 P1 findings 并由本轮后续设计交付物明确响应；随后仍须按 Goal 与 SP-010 建立匹配的当前 Context、card、可信 RED 和 exact-target admission。任何产品接线仍受 S01 F01 Entry Packet、真实权限/隔离环境及相应 admission 限制。本审查不授予 Builder 准入。

## 审查范围与基线

本轮只读审查 `ChartFilterPayloadDesign-r001.md`、`ChartFilterPayloadCases-r001.json`、正式 Goal/S00 相关来源、当前 `FilterTree.vue`/`RowAuth.vue` 源码及既有 query adapter 评审边界。未修改设计、cases、产品代码或 Goal；未运行 runner、产品构建、浏览器、数据库或权限验收。

审查对象摘要：

| 对象 | SHA-256 |
|---|---|
| `ChartFilterPayloadDesign-r001.md` | `dd6aceefc1efbe0970aa62d8a2d241ef3277f68fb75fec8b5efb0b6748f752be` |
| `ChartFilterPayloadCases-r001.json` | `fe44f521fcb9b68cd57b9ad256ad55cd55dc1738c8df1f3bbdfe7a3fcd7bc8c2` |

依据包括：

- `core/core-frontend/src/views/chart/components/editor/filter/FilterTree.vue:31-57`：校验后对 items 调用 `dfsTreeDelete`，再发出 `{logic, items}` 并记录 snapshot；`dfsTreeDelete` 只在 `subTree.items.length` 为真时递归，否则仅在 `ele.field` truthy 时删除 `field`。
- `core/core-frontend/src/views/chart/components/editor/filter/auth-tree-chart/RowAuth.vue:35-41,159-195,197-249`：当前树初始化会把 truthy `subTree` 作为组合节点；提交时有非空 child 才产生 `{type:'tree', subTree:{logic,items}}`，叶节点产生 `enumValue/fieldId/timeValue/filterType/filterTypeTime/dynamicTimeSetting/term/timeType/value/type/subTree` 等承载字段。实际导入路径是 `auth-tree-chart/RowAuth.vue`。
- S00/S02-S09 Entry Packet `.../SP-005/S02-S09_EntryPacket.md:5-13`：S02/F01 为 `CONDITIONAL`，Slice 设计和独立审查后仍需相关进入条件；权限/设备场景未齐仍须补测，Entry Packet 不授权开发。
- Goal `.../S02-F01/LoopGoal_Final_r001.md:5,11,21-27,31,55-61`：原 Goal 仍要求 chart→chart 与 query→query 完整链路、真实权限和独立验收；Goal 的分母不由本窄 helper 替换。
- 权限环境材料 `.../S02-F01/PermissionEnvironment.md:3-22`：当前真实权限实现及隔离环境未就绪，AC 保持 `NOT_RUN`；不得以 standalone/admin/mock 替代。
- 已有 query adapter 审查 `.../reviews/QueryProductAdapterDesignReview-r004.md:3-8,18-30`：完整 query adapter、Pinia/UI 接线、事务提交等分别有独立未决边界；图表 payload helper 不能被解释为 query adapter 的合同或准入。

## 全量 Findings

### CFP-001 / P1 / OPEN：叶节点 `field` 剥离语义超出了源码实际条件

**位置：** 设计 `ChartFilterPayloadDesign-r001.md:14,27`；Cases `ChartFilterPayloadCases-r001.json:10-11,20-21`；源码 `FilterTree.vue:47-55`。

设计称“严格复用现有可观察规则”，并规定叶节点删除本层 `field`。但当前实现是 `if (ele.field) delete ele.field`，所以只有 truthy 值会被删除；当属性存在但为 `null`、`false`、`0` 或空字符串时，源码保留该属性。Cases 只使用 truthy 对象作为 `field`，没有检验此差异。若 helper 的目标是剥离属性本身，应声明这是一个刻意的新规范化语义，不应声称逐字复用当前源码；若目标是当前行为等价，则合同和用例需要遵循 truthy 条件。

**影响：** 当前实现者无法同时满足“源码语义等价”与“无条件删除属性”两种解释；对合法 JSON 输入，行为可观察地不同。

**建议处置：** 维护者先选定“按属性存在删除”或“复现 truthy 删除”这一窄合同语义，并在设计及 cases 中分别覆盖真值、假值、null 与缺省。不得借此扩成通用 schema 字段白名单。

### CFP-002 / P1 / OPEN：根与后代结构的有效/无效域、拒绝理由未闭合

**位置：** 设计 `ChartFilterPayloadDesign-r001.md:23,29-31`；Cases `ChartFilterPayloadCases-r001.json:29-32`。

合同接受 `{logic, items}` 根，但没有精确定义 `logic` 的允许类型/取值、`items` 必须为数组、根是否允许额外键，以及子节点、`subTree` 和 `subTree.items` 的有效类型。它同时承诺根形状错误、无法完整复制均失败，却只定义 `INVALID_ROOT` 与 `UNSUPPORTED_VALUE` 两个 reason；TC-CFP-005 只覆盖缺 `logic`。畸形子树如 `subTree.items` 为对象或字符串可能在递归时异常，而不一定形成约定的 `{ok:false, reason}`。真实 producer 的树节点字段集与这里的宽泛 JSON 递归输入也未明确分层。

**影响：** 失败语义及整个树的拒绝边界不能独立实现或验证；本 helper 可能把未处理异常泄露为非联合结果，或对畸形配置做出实现者自行猜测的判断。

**建议处置：** 写明最低必要的 root/node/group/leaf shape 谓词及 extra keys 处理；对根与后代错误明确归入现有 reason，不增加产品文案。加覆盖缺 `items`、非数组 `items`、非法 `logic`、非对象节点、畸形 `subTree` 和合法空树的固定 cases。保持完整 schema/权限/数据集/目标校验在后续产品边界。

### CFP-003 / P1 / OPEN：设计声明循环引用覆盖，冻结 Cases 没有循环输入

**位置：** 设计 `ChartFilterPayloadDesign-r001.md:29,35-37`；Cases `ChartFilterPayloadCases-r001.json:33-38`。

设计第 35 行称 Cases 覆盖“循环或非 JSON 值整次失败”，但六个 case 中不存在循环输入；TC-CFP-006 只在 runtime 构造 `undefined`。纯 JSON 文件不能直接表示对象环，必须有明确构造协议或专门运行时 fixture 才能作为可信的冻结测试。

**影响：** 当前案例不能证明合同显式列出的循环拒绝行为；将其标为覆盖会产生用例覆盖的虚假结论。

**建议处置：** 为 cycle 添加唯一 case identity 和明确的 runtime builder 操作（例如在指定路径建立回边），断言返回 `UNSUPPORTED_VALUE` 且不产生 partial payload；或将 cycle 从本轮 fixture 覆盖声明中移除并另设冻结 runtime case。修订后重新计算摘要，不覆盖 r001 历史对象。

### CFP-004 / P1 / OPEN：`UNSUPPORTED_VALUE` 分类与 runtime marker 解释器未定义

**位置：** 设计 `ChartFilterPayloadDesign-r001.md:23,29-31,35-37`；Cases `ChartFilterPayloadCases-r001.json:33-38`。

契约把非 JSON 值和无法复制的值归为 `UNSUPPORTED_VALUE`，但未给出判定域与构造语义。Case 的 `input_builder` 只有一段自然语言：将 `{"$fixture":"undefined"}` 替换成 JavaScript undefined；未指定是深度递归替换还是只替换单一 marker、marker 若作为普通业务 JSON 数据出现如何转义、如何构造 function/symbol/BigInt/NaN/Infinity/稀疏数组/Date 等值，以及执行复制时捕获异常的结果。虽然只需覆盖合同实际支持域，不必穷举所有 ECMAScript 对象，但当前写法不是确定的、可复用的 fixture protocol。

**影响：** 相同冻结 case 可能被不同 runner 构造成不同输入；case identity 相同不保证行为 oracle 相同。无法确认 `UNSUPPORTED_VALUE` 是否包括序列化丢失/改写的值。

**建议处置：** 将输入限制写为精确定义的 plain JSON tree 加明确的禁止值集合；定义 marker 的编码/escape 及构造时机、输出断言和异常归一结果。标记无法测试的 host object 为合同外，不推导成产品接受或拒绝规则。

### CFP-005 / P2 / OPEN：深度隔离及无部分输出的 oracle 只以标签表达

**位置：** 设计 `ChartFilterPayloadDesign-r001.md:28-29,35-37`；Cases 六个 `expected` 中 `input_unchanged`、`output_deeply_detached` 与 `no_partial_payload` 字段。

Cases 将这些属性记为布尔值，但没有规定如何观察它们。例如 `output_deeply_detached=true` 没有指明要对输出嵌套数组/对象执行变异并断言输入不变，还是反向变异输入检查输出；`input_unchanged=true` 没有冻结比较基准/断言方式；`no_partial_payload=true` 没有说明是否要求失败结果仅含 `ok/reason` 且不得含 `payload`。因此它们现在是用例意图标签，不是自足的结果 oracle。

**影响：** 后续 runner 可以在不真正检测引用隔离或失败不泄漏 payload 的情况下让所有 case 通过。

**建议处置：** 在 Cases schema/runner 约定中定义确定性观察动作与断言；至少在深嵌套可变对象上对 input→output 与 output→input 分别变异，并明确失败对象键集合/无 payload 判据。保持纯 helper 测试不触发 Store、snapshot 或产品副作用。

### CFP-006 / P2 / OPEN：设计与 Cases 缺少冻结对象间的摘要绑定

**位置：** 设计 `ChartFilterPayloadDesign-r001.md:5,35-37`；Cases `ChartFilterPayloadCases-r001.json:2-6`。

两份材料有独立 artifact id、轮次与 `contract_ref`，名称/标题引用可对上；但设计未记录 Cases 摘要，Cases 的合同引用只指向文件名/标题，未绑定所审设计字节摘要。当前审查已计算两个对象 SHA-256（见上表），可定位本轮快照，却不能防止后续同名替换导致 case contract 关系漂移。

**影响：** `frozen case identity` 只有 case ID 与轮次，未同时绑定其解释合同版本；后续 RED/GREEN 可能各自引用同名、不同内容的 pair。

**建议处置：** 若下一阶段要将这对文件用于冻结 RED/GREEN，在执行入口的 Context/admission 或专用 manifest 中同时绑定两者的摘要和精确相对路径，并校验 `contract_ref` 指向的版本。不要仅因本 finding 把历史 r001 文件改写成“已冻结”。

### CFP-007 / P2 / OPEN：实际 producer 的叶节点完整字段没有进入 cases 样本

**位置：** 设计 `ChartFilterPayloadDesign-r001.md:15,25,35`；Cases `ChartFilterPayloadCases-r001.json:9-26`；`RowAuth.vue:197-249`。

合同称保留节点所有 JSON 数据字段，包含过滤语义；但当前成功叶节点例子分散且简化，未有一个 fixture 同时呈现当前 producer 实际输出的完整叶节点 carrier（如 `enumValue`、`fieldId`、`timeValue`、`filterType`、`filterTypeTime`、`dynamicTimeSetting`、`term`、`timeType`、`value`、`type`、`subTree:null`）并逐字段验证除约定的 `field` 之外均保留。TC-CFP-002 带动态日期但缺其他字段；TC-CFP-004 带 enum/dynamic setting 但也不是完整 leaf。合同自然允许通用复制而非业务白名单，因此这里是 producer-shape witness 缺口，不要求本 helper承担 query adapter 或产品 schema 验证。

**影响：** 设计对现有过滤语义“完整保留”的声称主要依赖通用递归规则，没有一条案例把它绑定到实际源载体；漏字段、重建字段或处理 `subTree:null` 的错误可能不被发现。

**建议处置：** 增加一条来源追溯到 `RowAuth.vue:232-245` 的完整 producer-shape 样本，显式断言所有除所裁定 `field` 外的字段逐值保留及嵌套独立；源代码结构证据仍不替代完整产品过滤验收。

## 合同与 Cases 一致性核对

| 合同声明 | Cases 现状 | 结果 |
|---|---|---|
| 普通叶子移除 `field`，保留其余字段 | TC-CFP-001，truthy object `field` | 部分一致；未覆盖 CFP-001 假值差异或完整 producer carrier |
| 有非空 `subTree.items` 的组合节点递归且保留组节点 `field` | TC-CFP-002 | 一致，但仅一层组合 |
| 空 `subTree.items` 按叶规则处理；深层同名业务 `field` 保留 | TC-CFP-003 | 对该样例一致 |
| 过滤字段、动态日期与 enum 深拷贝/保留 | TC-CFP-002/004 | 有限样本覆盖，不构成完整 carrier 见证 |
| malformed root 返回 `INVALID_ROOT` | TC-CFP-005 只缺 `logic` | 覆盖不足；其他 root/后代错误边界未冻结 |
| undefined/非 JSON 值/循环/无法复制整体失败 | TC-CFP-006 仅 undefined marker | **不一致：循环声明无对应 case；marker builder 尚不确定** |
| 输入不变、深度隔离、失败无局部 payload | 各 case 以布尔标签表示 | 观察/判定协议不完整 |

## 边界、Authority 与误读检查

- **原始 Goal/S00 分母：** 未发现本窄设计将 Goal scope 改写成 helper scope；完整 Goal 仍是 10 项 Goal AC、26 项 must-have、16 项产品义务，`Scope Delta: none`。本 helper 顶多支持图表 payload 深拷贝/临时字段处理的纯函数切片，不关闭 AC-S02-02/03/04/05/06/07/08 或任何完整产品 AC。
- **Chart 与 query adapter：** 设计明确只接收图表 `customFilter`，且排除 query/UI/Store/权限/提交路径，范围边界可接受。不得复用它作为 query adapter 的 schema/字段动作规则；query 侧已有不同 shape、runtime/save 历史缺口，仍按各自合同设计与准入推进。
- **S01/权限与产品接线：** 设计将权限、身份、dataset 校验、确认、source-read、target-commit 放在 helper 外，正确避免以纯函数伪造权限证据。S01 条件、真实权限环境 `NOT_RUN` 与产品接线门槛仍生效；本审查不把纯 JSON cases 当权限/撤权验证，也不授权目标提交/UI/Store 接线。
- **真值/声明上限：** Design 是候选实现输入，Cases 是候选 witness；当前没有实现、可信 RED、GREEN、独立 Validation 或产品验收。最高可接受声明仅为“完成 r001 语义审查，发现需修订项”；不得称 helper 已落地、图表适配器已完成、过滤复制已验证或 Goal 已达成。
- **单行压缩误读测试：** “payload cases complete / helper frozen / chart adapter ready / permission passed / integration covered” 均超出证据。即便未来该纯 helper 通过，也不代表 query adapter、产品复制粘贴、权限、atomic target commit、保存重开或 S02 Goal 完成。

## Review 状态

本交付物为第 1/3 轮，本报告一次列出本轮识别的全部问题；P1 findings 关闭并形成新版本后，可进入本交付物下一轮审查。依据当前源码和本轮文件摘要，不对尚未提供的修订作预判。独立审查最多按每个交付物三轮规则继续，不通过额外拆分交付物绕过既有上限。
