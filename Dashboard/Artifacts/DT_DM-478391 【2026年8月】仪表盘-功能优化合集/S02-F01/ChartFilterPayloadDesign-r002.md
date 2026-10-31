# 图表过滤树载荷准备器设计 r002

## 交付物身份与范围

- Artifact ID：`S02-F01-chart-filter-payload-design`，第 2/3 轮。
- 归属：DE-S02-F01 / S02.3 图表→图表适配器候选。
- 目标：设计一个 detached、纯 TypeScript helper，把普通 JSON chart `customFilter` 树复制成不含 truthy 叶节点临时 `field` 的深度隔离载荷。
- 非目标：不接菜单、按钮、Pinia/画布 Store、跨标签存储、权限接口、身份/时钟/TTL、source-read/target-commit、dataset 相等判断、确认/预览、保存/重开；不改变 `FilterTree.vue`、`editor/index.vue` 或既有过滤路径。

## Authority 与当前代码事实

- Goal `AC-F01-Q004/Q006/Q007/Q012/Q015` 及 S00 `REQ-004/006/007/012/015` 是产品要求 authority：同类图表、同数据集、完整保留过滤语义，缺失承载能力时整次拒绝，目标已有条件时先确认。helper 不实现这些产品级前置或事务。
- `FilterTree.vue` 的 `changeFilter()` 接收 `{ logic, items, errorMessage }`；有错误时立即返回；否则调用 `dfsTreeDelete(items)` 后 emit `{ logic, items }`。
- `dfsTreeDelete()` 先按 `ele.subTree && ele.subTree.items && ele.subTree.items.length` 判断递归；否则只在 `ele.field` truthy 时删除本节点的 `field`。因此 r002 选择**复现 truthy 删除行为**：假值、null 与缺省均保留/无操作。这是来源行为，不规范化属性存在性。
- `RowAuth.vue` 的 `dfsSubmit()` 产生根 `logic/items`；组节点以 `subTree:{logic,items}` 表达。其叶节点 carrier 包括 `enumValue`、`fieldId`、`timeValue`、`filterType`、`filterTypeTime`、`dynamicTimeSetting`、`term`、`timeType`、`value`、`type`、`subTree:null`。Case `TC-CFP-009` 绑定该 producer 形状，不将静态形状提升为产品运行验收。
- `editor/index.vue` 的 `changeFilterData()` 编辑态目标会 `cloneDeep(customFilter)`。当前调用路径具有编辑器、快照、预览和保存副作用；本 helper 不触发这些入口。
- 以上是当前 checkout 静态来源映射，不是运行、权限或完整代码审计证据。

## 候选纯函数合同

目标文件候选：`core/core-frontend/src/custom-component/filter-copy/chart-filter-payload.ts`。

输入/输出：`prepareChartFilterPayload(input)` 接受 unknown，返回且只返回 `{ok:true,payload}` 或 `{ok:false,reason}`；reason 仅为 `INVALID_ROOT` 或 `UNSUPPORTED_VALUE`，不面向终端用户。失败对象不得包含 `payload` 或部分树。

结构谓词与递归规则：

1. 输入必须为由 `null`、boolean、string、有限 number、无空洞数组和普通记录组成的有限 JSON 树；拒绝 undefined、function、symbol、bigint、NaN/Infinity、稀疏数组、Date/Map/Set/类实例及循环引用。对象必须为普通记录（`Object.prototype` 或 null prototype），只读取 own enumerable string-key 数据属性；symbol key、accessor 与读取抛错均失败。冻结 Cases 通过显式 builder 操作构造 undefined/cycle，不在 JSON 内使用会与业务数据冲突的 marker。
2. 根必须是普通记录，含 `logic`（精确字符串 `and` 或 `or`）和数组 `items`。额外 JSON 字段允许且原样保留；空 `items` 合法。
3. 每个 item 必须为普通记录。缺失或 null `subTree` 表示叶节点；object `subTree` 必须含 `logic`（`and`/`or`）和数组 `items`。其他 `subTree` 类型或缺字段为 `INVALID_ROOT`。组节点以 `subTree.items.length > 0` 定义，按递归复制规则处理子节点并保留组节点全部字段。
4. 空 `subTree.items` 不构成组；按现有来源实现视为叶节点，仍保留 `subTree` 内容。仅当叶节点自身的 `field` 属性值 truthy 时删除该属性；false、0、空字符串、null 与缺省保持各自原样。组节点从不因叶规则删除 `field`。
5. 所有其他 JSON 字段，包括深层业务同名 `field`、过滤条件和动态规则，均原值递归保留。成功 payload 与输入深度隔离；函数不得修改输入。
6. 结构错误返回 `INVALID_ROOT`；不受支持值、循环、访问器或克隆失败返回 `UNSUPPORTED_VALUE`。任一失败均无部分输出。实现必须捕获遍历/复制失败并返回联合结果，不泄漏异常。

输入边界是 helper 安全复制合同，不是产品 schema；未知 JSON 字段被保留，不代表产品接受未知字段。真实产品仍必须在外层完成完整 schema、身份、权限、类型、数据集与目标能力验证。

## 冻结 Cases 与可观察 oracle

候选 Cases：`ChartFilterPayloadCases-r002.json`。测试执行器须：先以结构化克隆或专用可靠深拷贝保存输入基线；按每 case `runtime_setup` 执行操作；调用被测函数；验证 expected 及 assertions。runtime 操作是有序、显式的路径写入/引用链接，不做隐式 marker 替换；JSON fixture 内的 `$fixture` 字样永远只是普通业务值。

- `input_deep_equal_snapshot`：调用返回后将原输入与 runtime_setup 完成后的快照深比较。
- `output_to_input_detached`、`input_to_output_detached`：按 case 给定变异路径对一侧写入唯一 sentinel，断言另一侧保持原值；每个变异须使用独立的新执行实例，避免相互污染。
- `failure_has_exact_keys`：失败结果对象精确只含 `ok`、`reason`，且无 `payload`；`no_partial_payload` 是此判据别名，不是任意真值标签。
- `preserves_exact_payload`：将返回 payload 与完整 expected 深比较，验证所有字段逐值保留/删除。

固定用例包括 truthy/falsey field、完整 RowAuth 叶 carrier、嵌套组/空组、深层同名业务键、空合法树、坏 root 与后代、undefined 与 cycle。Case JSON 及本设计通过 SHA-256 manifest 双向绑定；runner 和后续 RED/GREEN 必须使用同一 manifest 身份。

## 变更响应 CFP-001..007

- CFP-001：采用源码 truthy `field` 删除，冻结 truthy/falsey/null/缺省用例。
- CFP-002：定义 root/node/group/leaf 谓词、额外键政策、空树、畸形后代的 reason。
- CFP-003：Cases 增加明确 runtime back-edge 操作构造 cycle。
- CFP-004：定义 JSON 值域与 runtime 操作语义；无 sentinel 冲突，合同外主机对象拒绝。
- CFP-005：规定深拷贝、输入不变及失败无部分 payload 的可观察 oracle。
- CFP-006：Design 与 Cases 以 `ChartFilterPayloadManifest-r002.json` 中精确路径与摘要绑定；manifest 本身由 Build Context/Admission 锁定摘要。
- CFP-007：新增逐字段对应 `RowAuth.vue` producer 的完整叶 carrier witness。

## 冻结前置、边界与声明上限

本 r002 及 Cases 仍是**候选**，不表示冻结、可信 RED 或实现准入。先由独立 Reviewer 对两份文件及 manifest 完整读集审查；若通过，再为精确 runner/test/helper targets 生成 Context、Builder card、execution admission，验证后才能写入。该 helper 的最高声明为“detached JSON-shaped 图表过滤载荷 helper 对冻结用例的行为通过”。禁止外推为图表适配器完成、产品 copy/paste、Store/UI、产品 source-read/target-commit、权限、保存重开或 Goal AC 通过。

S01 F01 Entry Packet 仍 `CONDITIONAL`；真实权限模块/隔离实例不可用。只读用户禁止查看/复制/粘贴及权限撤销/恢复保持 `BLOCKED / NOT_RUN`，不以 standalone/admin/mock 代替。原 Goal 10 项 AC、26 项 must-have、16 项产品义务和 `Scope Delta: none` 完整保留。
