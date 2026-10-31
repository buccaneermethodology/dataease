# 图表过滤树载荷准备器独立语义审查 r002

## 双结论

- **Design Freeze Validity：NEEDS_REVISION。** r002 已实质修复上一轮 CFP-001/003/005/006 的主要合同问题：truthy field 条件、runtime cycle/undefined builder、可观察断言和 Design/Cases 摘要绑定均有明确表达；manifest 中两个声明摘要也与本轮重算一致。仍有结构 predicate 的案例覆盖缺口、producer 字段来源误引、unsupported 值域测试不足及 JavaScript plain-record/代理对象边界不完整，故不将其判为冻结设计。
- **Implementation Entry Readiness：NOT_READY_FOR_IMPLEMENTATION。** 本审查不授予 Builder 准入。P1 问题关闭、合同与 Cases 形成新摘要后，仍需为 exact runner/test/helper targets 建立并验证当前 Context、Builder card 和 execution admission。产品接线还须满足 Goal 的 S01 前置及实际权限/隔离环境要求；standalone/admin/mock 不构成权限证据。

## 范围、快照与复核方法

本轮审查完整读取 Design r002、Cases r002、Manifest r002、前轮审查 CFP-001..007、当前 FilterTree.vue/RowAuth.vue、Goal、S00/S01 Entry Packet 与权限材料，并做了摘要绑定复算及 JSON 解析。未修改候选、源码、fixtures 或 Goal；未执行 helper runner、产品构建、浏览器、数据库及权限验收。

本轮精确 SHA-256（UTF-8 原始文件字节）：

| 文件 | SHA-256 |
|---|---|
| ChartFilterPayloadDesign-r002.md | a4d63dedd8d7374ea41fb20de26bde82dcf980a46ca810b3068e7a466e4fb396 |
| ChartFilterPayloadCases-r002.json | 786df92f04c9c88b2702deb3ad23e7e094884340ec6865125b4d95152235206b |
| ChartFilterPayloadManifest-r002.json | e8ee96be4a6c939eb2ef4e796992f8a43e39c019a7ab4d3028d64cd27e61a2a8 |

Manifest 一致性结果：Cases design_sha256 与 Design 实际 SHA 相同；Manifest 中 Design 与 Cases 两条路径均与文件存在位置一致，且各自声明 SHA 与重算 SHA 相同。Manifest 不自包含自身 SHA；Design 明确要求由未来 Build Context/Admission 锁定 Manifest 摘要，这是非循环绑定顺序。当前尚无该 Context/Admission，故只能确认材料内部摘要一致，不能声称它已被执行入口消费或冻结。

当前源码依据：FilterTree.vue:47-57 按 ele?.subTree?.items?.length 非零递归，否则只有 ele.field truthy 才删除；FilterTree.vue:59-68 依据 fieldId 将 computed field metadata 写入叶节点；RowAuth.vue:197-249 生成组与叶载体，叶对象列出 enumValue/fieldId/timeValue/filterType/filterTypeTime/dynamicTimeSetting/term/timeType/value/type/subTree，本段未输出 field 属性。

## 上轮 CFP-001..007 逐项处置

| Finding | r002 处置 | 本轮状态 |
|---|---|---|
| CFP-001 truthy field 与来源条件不同 | Design :14,30 明确选择复现 truthy 删除；Cases 有 truthy、false、null、0、空串。 | **CLOSED_WITH_BOUNDS**：truthy 删除条件及 false/null/0/空串保留已明确并有样例；缺失 field 是无属性的 no-op，不造成合同歧义。空 subtree 的 truthy 分支列于 CFP-002。 |
| CFP-002 root/后代 shape 与失败归类不明 | Design :27-34 定义 JSON 值域、root/node/group/leaf 谓词、额外键政策、空树及失败归类。 | **PARTIAL / P1**：设计边界显著变清楚，但 Cases 对所定义多种 invalid branch 覆盖不足，且 subTree 是否必须是普通记录/拒绝数组尚有歧义。 |
| CFP-003 cycle 无运行时输入 | TC-CFP-011 用 link_reference 从 root 建立回边，预期 UNSUPPORTED_VALUE。 | **CLOSED_WITH_BOUNDS**：cycle 构造具体、路径可定位；需使用 cycle-aware snapshot/equality，见 CFP-010。 |
| CFP-004 runtime marker/非 JSON 类型协议不明 | Fixture protocol :7-12 明确 setup 顺序、RFC 6901 pointer、literal 与 undefined/cycle 构造。 | **PARTIAL / P1**：undefined 与 cycle 已可构造；Design 明列的其他拒绝类别仍无 cases，plain JavaScript object 的 proxy/property descriptor 边界未穷尽。 |
| CFP-005 隔离/无部分 payload 只有布尔标签 | Design :38-45 和 Cases :7-12 定义 snapshot、变异 probe、exact failure keys、payload 深比较。 | **CLOSED_WITH_BOUNDS**：运行步骤具备可观察意义；对循环图比较仍需 cycle-aware 定义，见 CFP-010。 |
| CFP-006 Design/Cases 无摘要绑定 | Cases 含 Design SHA，Manifest 对两文件做精确路径/SHA 双向索引。 | **CLOSED_WITH_BOUNDS**：本轮重算全部匹配；Manifest 自身摘要待 future Context/Admission 锁定，不构成当前 pair 的循环问题。 |
| CFP-007 无完整 RowAuth carrier witness | TC-CFP-009 对叶承载字段逐字段列出并断言 payload。 | **PARTIAL / P2**：RowAuth 叶 carrier 已加入，但该用例把 field 作为 "transient-field-object" 输入，并引用仅含 dfsSubmit 的 RowAuth 来源；实际 field 是 FilterTree.vue:59-68 按 fieldId 注入的 computed field object，RowAuth dfsSubmit 不生成它。 |

## 当前 Findings

### CFP-002 / P1 / OPEN：明确结构规则仍缺少足以冻结分支语义的 Cases

**位置：** Design ChartFilterPayloadDesign-r002.md:27-32,45,50；Cases ChartFilterPayloadCases-r002.json:206-288,399-427。

Design 已规定 root 为普通记录、logic 精确为 and/or、items 为数组、item 为普通记录、subTree 缺失/null 表示 leaf、object subtree 含 logic/items，结构失败映射 INVALID_ROOT，且空 items 合法。Cases 仅以 TC-CFP-006 覆盖非法 root logic、TC-CFP-007 覆盖非数组的 subtree items；没有直接覆盖 root 缺失/非数组 items、非对象 root/item、subTree 缺 logic/items、非法 subtree logic、array-valued subtree，以及成功 leaf 的 subTree 缺失。尤其没有任何成功 case 覆盖 subTree:{logic,items:[]} 且 field truthy：源码会将其按叶分支删除 field，而把任意 truthy subtree 当 group 的实现会保留它。TC-CFP-003 空 subtree 使用 field:null，不能区分这两种实现。

合同写的是 “object subTree”，未明确要求它是普通记录而非带自有 logic/items 属性的数组；这与普通记录谓词及 JSON 数组域存在歧义。成功 leaf 也没有覆盖 subTree 缺省；空 subtree 用例应同时用 truthy field 才能验证当前 FilterTree 的叶分支，而现在 TC-003 使用 null field。

**影响：** 本轮虽冻结了规则文字，cases 仍未覆盖最关键的分支条件和部分错误归类；独立 runner 不能据现有 cases 验证设计所声明的完整 shape contract。

**建议处置：** 将 subtree 限定为普通记录；补齐上述根、节点、子树的正反例，至少包含“truthy field + 空 items 的空组叶分支”和“缺失 subtree 的成功叶节点”。保持错误归类为候选 helper 内部结果，不添加产品 UI 文案。

### CFP-004 / P1 / OPEN：声明拒绝的 unsupported 集合远大于冻结运行时覆盖

**位置：** Design ChartFilterPayloadDesign-r002.md:27,32,38-45；Cases ChartFilterPayloadCases-r002.json:370-427。

合同逐项承诺拒绝 undefined/function/symbol/bigint/NaN/Infinity/sparse array/Date/Map/Set/class instance/cycle/symbol key/accessor/read throw；Cases 只运行时构造 undefined 与 cycle。固定 JSON fixtures 可以支持 runtime setup，但没有覆盖 function/symbol/bigint、非有限 number、稀疏数组、内建/类实例、symbol key 或 accessor。当前只有两类错误样本，无法证实函数对所宣称拒绝域一致地给出 UNSUPPORTED_VALUE，也无法验证避免 getter 执行的约束。

**影响：** 拒绝域看似广而测试证据窄；实现者可能遗漏特殊键或描述符检查，仍能通过全部现有 frozen cases。

**建议处置：** 以稳定 Case ID 补覆盖有代表性的每种语义拒绝机制，至少涵盖非有限 number、稀疏数组、函数/BigInt/symbol、内建对象、symbol key、getter/accessor 与 getter 抛错；每例断言 getter 未被调用、结果精确只有 ok/reason。若某类不属于实际需要的合同域，应从输入声明中移除并说明边界，避免无依据承诺。

### CFP-007 / P2 / OPEN：RowAuth 字段映射已补齐，但 field 来源绑定错误

**位置：** Design ChartFilterPayloadDesign-r002.md:15,55；Cases ChartFilterPayloadCases-r002.json:290-367；FilterTree.vue:59-68；RowAuth.vue:217-245。

TC-CFP-009 的标准过滤字段大体与 RowAuth dfsSubmit 叶对象一致，补齐了上一轮要求的 carrier witness；但案例将临时 field 字段标为 RowAuth 的 dfsSubmit leaf fields，其源引用不成立：该方法的叶对象没有 field。现有静态来源显示，FilterTree 的 dfsTree() 才会根据 fieldId 从 computed field list 注入对象，之后 dfsTreeDelete() 才删除 truthy field；案例用字符串 "transient-field-object"，也不是该注入对象的实际结构。当前设计又将 helper 与 FilterTree product path 明确分离，因此这个 case 是字段裁剪规则的合成 witness，而非完整“RowAuth producer 输出”快照。

**影响：** reviewer/实现者会误以为临时字段由 RowAuth 直接生成，不能追溯其生命周期和删除责任；完整 carrier 的来源与 transient metadata 来源被合并。

**建议处置：** 分别引用 RowAuth.vue:232-245 说明叶 carrier，引用 FilterTree.vue:59-68 说明 transient field 注入；如果保留合成 witness，在 case/Design 中标明组合来源与 field 的结构模型，不称其为 RowAuth 单一 producer 输出。

### CFP-008 / P1 / OPEN：代理对象的执行边界未定义，不能保证 helper 对 unknown 绝对纯/无副作用

**位置：** Design ChartFilterPayloadDesign-r002.md:23,27,32-34；Cases 无 Proxy 运行时用例。

输入签名接受 unknown，条款以 Object.getPrototypeOf、own keys/属性描述符的语义来界定“普通记录”和 accessor；但 JavaScript Proxy 可对 getPrototypeOf、ownKeys、getOwnPropertyDescriptor 安装 trap。即使 getter 不会被直接调用，验证/枚举一个 Proxy 仍可能执行外部代码或发生副作用。当前拒绝列表没有排除 proxy，而运行时也没有可靠通用机制证明一个普通记录不是 Proxy。失败归一只能捕获 trap 抛错，不能撤销 trap 已产生的副作用。因此“纯 helper”最多是对受信任 JSON-shaped plain data 的函数属性；本合同不能外推到任意 hostile JavaScript object。

**影响：** “纯 helper / safe copy” 的保证仅对调用方提供的受信任 JSON-shaped data 成立；当前输入签名为 unknown，却没有将此信任假设写入合同。

**建议处置：** 明确将输入 authority 限定为调用方提供的 JSON-shaped plain data，并将 Proxy/hostile JavaScript objects 明确列为调用边界之外；实现边界不得宣称能通过通用检测识别所有 Proxy，也不得把捕获 trap 异常称作无副作用拒绝。

### CFP-009 / P2 / OPEN：JSON 保留键的复制目标语义未约束

**位置：** Design ChartFilterPayloadDesign-r002.md:27-31,34；Cases 无 __proto__/特殊键。

合同要求额外 JSON 字段全部原样保留，且输入可含普通记录；未写明复制时对 __proto__、constructor、prototype 等普通 JSON 字符串键的创建方式，也未限定输出对象原型。对 JSON.parse 得到的 own __proto__ key，如实现者用普通赋值复制，可能触发对象原型 setter 而非保留为 own data property；这也会令“unknown JSON fields preserved”与实际结果不一致。

**影响：** 仅靠合同不够约束实现者选择不会触发原型 setter 的安全复制方式，也缺少结果 oracle。

**建议处置：** 冻结此类键必须作为普通 own data property 保留，复制过程不得将其解释为原型修改；加入覆盖 __proto__ 字面 key 且验证对象原型不被输入改变的 case。保留 Unknown 字段，不扩建业务字段白名单。

### CFP-010 / P2 / OPEN：cycle case 的输入 snapshot/equality 尚未要求保留图结构语义

**位置：** Design ChartFilterPayloadDesign-r002.md:38-43；Cases ChartFilterPayloadCases-r002.json:399-427。

TC-CFP-011 在 runtime setup 后将整棵 root 回链至 /items/0/nested/self，并要求 input_deep_equal_snapshot。Design 允许“结构化克隆或专用可靠深拷贝”，也仅说深比较，没有明确 snapshot/equality 必须 cycle-safe、终止并区分“值形状相等”与“图边/别名关系相等”。普通 JSON.stringify 比较会抛异常；无 visited-pair 的递归比较会不终止；忽略引用边则可能漏掉输入图被改写。

**影响：** cycle case 已解决“构造不出来”，但 runner 对该 case 的输入不变 oracle 仍没有完整执行语义。

**建议处置：** 指定 cycle-safe snapshot 与 pair-tracked deep equality（或在 cycle case 显式断言输入引用拓扑未变化）；确认 setup 后 snapshot 可保留 root 回边。失败结果 exact-keys 断言仍应执行。

## Authority、结构与声明上限复核

- **Goal/S00：** 未发现 r002 将 helper 冒充完整 Goal。Goal DE-S02-F01 原始 scope 和 10 项 Goal AC、26 项 must-have、16 项产品义务、Scope Delta: none 仍完整；本 helper 的 cases 只能支持纯载荷裁剪/复制候选，不可关闭图表/查询组件兼容、dataset/field 授权、原子粘贴、预览保存或独立验收。
- **源码语义：** 设计 :14,29-32 对有效数组树准确采用 truthy field 和非空 subtree.items 递归边界；不支持值和坏结构是纯 helper 新定义的失败合同，不应误称为 FilterTree 既有异常处理。RowAuth 叶 carrier 字段基本映射准确，但 transient field 生命周期应按 CFP-007 拆分来源。
- **JSON 安全复制：** 值域、有限数、稀疏数组、普通记录、accessor 与循环的大框架已写明；proxy 输入边界与特殊 key 原样安全复制需按 CFP-008/009 补明。不得把通用 helper 的 unknown-key 保留误读成产品 schema 接受。
- **与 query adapter 的分界：** 设计只承接 chart customFilter，明确排除 query schema、Pinia/UI、权限、source-read/target-commit、保存与重开；该分界与 query adapter 既有完整 shape/runtime/save 缺口相容。不得用该 chart helper 关闭任何 query 产品合同。
- **S01/权限：** Design :59-61 保留 S01 CONDITIONAL 与真实权限模块/隔离实例不可用；只读用户禁止查看/复制/粘贴及权限撤销/恢复仍为 BLOCKED / NOT_RUN。此审查没有权限行为证据，不授权 standalone 替代或产品接线。
- **术语压缩：** “设计已冻结”“cases 全覆盖”“RowAuth 原样 producer”“helper 已实现”“权限已通过”“S02 Goal 完成”均超出本轮证据。当前最高 claim 是“r002 设计/cases/manifest 摘要自洽，CFP finding disposition 已复核，仍需修订后复审”。

## Review 状态与轮次边界

本报告是该图表载荷设计交付物第 **2/3** 轮评审，与 S02 Goal 的整体审查轮次相互独立。r002 对前轮 CFP-001..007 的响应逐项列明；本轮 findings 合计 CFP-002、004、007、008、009、010，其中 CFP-002/004/008 为剩余 P1 blocker。候选修订后，本交付物最多还有第 3/3 轮；不以拆分文件、换标题或追加 manifest 绕过此上限。当前**不得启动 Builder**，因为设计仍有 P1 未关闭，且本轮未验证任何 execution admission。
