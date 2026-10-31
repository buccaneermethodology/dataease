# 图表过滤树载荷准备器设计 r001

## 交付物身份与范围

- Artifact ID：`S02-F01-chart-filter-payload-design`，第 1 轮设计。
- 归属：DE-S02-F01 / S02.3 图表→图表适配器候选。
- 目标：设计一个 detached、纯 TypeScript helper，把现有 `customFilter` JSON 树转换成不含临时叶节点 `field` 元数据的深度隔离载荷；让递归保留/剥离规则可以用冻结用例独立验证。
- 非目标：不接菜单、按钮、Pinia/画布 Store、跨标签存储、权限接口、身份/时钟/TTL、source-read/target-commit、dataset 相等判断、确认/预览、保存/重开，不改变 `FilterTree.vue`、`editor/index.vue` 或任何已有过滤路径。

## Authority 与当前代码事实

- Goal `AC-F01-Q004/Q006/Q007/Q012/Q015` 及 S00 的 `REQ-004/006/007/012/015` 是产品要求 authority：只允许同类图表、同数据集、完整保留过滤语义，缺失承载能力时整次拒绝，目标已有条件时先确认。此 helper 不实现这些产品级前置或事务。
- `FilterTree.vue` 的 `changeFilter()` 接收 `{ logic, items, errorMessage }`；有错误时立即返回；否则调用 `dfsTreeDelete(items)` 后 emit `{ logic, items }`。
- 同文件 `dfsTreeDelete()` 对有非空 `subTree.items` 的节点递归，否则删除该节点的 `field` 属性；因此该候选严格复用现有可观察规则，不另推导字段白名单。
- `RowAuth.vue` 的 `dfsSubmit()` 生成顶层 `logic/items`；组节点以 `subTree:{logic,items}` 表达，叶节点携带 `fieldId`、运算符/值、枚举、时间类型与动态时间设置。
- `editor/index.vue` 的 `changeFilterData()` 对编辑态目标值执行 `cloneDeep(customFilter)`。现有过滤逻辑具有编辑器、快照、预览和保存副作用，本 helper 不得直接触发这些入口。
- 以上为当前 checkout 的静态来源映射，不是运行、权限或完整代码审计证据。

## 候选纯函数合同

目标文件候选：`core/core-frontend/src/custom-component/filter-copy/chart-filter-payload.ts`。

输入为普通、JSON-compatible 的 chart `customFilter` 根对象 `{ logic, items }`。输出为结果联合类型：`{ok:true,payload}` 或 `{ok:false,reason}`。成功结果必须满足：

1. 根 `logic` 和 `items` 保持输入值；每个节点的所有 JSON 数据字段都保留，含 `fieldId`、value、enum、时间和动态规则。
2. 有非空 `subTree.items` 的节点递归复制其所有后代，且不作为叶节点删除 `field`。
3. 叶节点（按当前 `FilterTree.vue` 条件：没有非空 `subTree.items`）只在该节点层删除临时 `field`；同名深层业务键不得被递归全局删掉。
4. 返回值与输入及所有可变后代深度隔离；调用过程不得修改输入。
5. 根形状错误、非 JSON 值、循环引用或无法完整复制的输入整体返回失败；不得返回局部树或静默删除未知字段。

候选失败 reason 仅区分 `INVALID_ROOT` 与 `UNSUPPORTED_VALUE`，不向用户显示，也不是产品错误文案。输入不受信任时仍须由后续产品流程完成完整 schema、身份、权限、类型、数据集和目标能力验证。

## 冻结验证范围与明确排除

冻结 Cases：`ChartFilterPayloadCases-r001.json`。用例覆盖：普通叶节点剥离临时 `field`；嵌套 AND/OR 树及动态规则深拷贝；只剥离节点本地的临时 field、不剥离任意嵌套同名业务字段；输入不变和 output isolation；畸形 root/循环或非 JSON 值整次失败、零部分输出。

可信 RED 必须在实现缺失时由同一 runner 执行相同冻结 case identity，并因缺少被测导出/预期 mismatch 失败；随后 GREEN 复用冻结用例身份。此合同不证明 Vue reactive proxy 可直接输入、不构成产品 `customFilter` source-read、Dataset/field 授权、图表种类兼容、跨标签剪贴板、整次目标提交或 Goal AC 通过。候选实现与测试只能按各自确切准入 target 落盘。

## Claim ceiling 与后续

最高声明为“detached chart payload helper 对冻结 JSON-shaped cases 的行为通过”。禁止将其称为图表适配器完成或产品复制/粘贴通过。下一步：完成本设计和冻结 Cases 的独立语义审查；若通过，再建立 runner、可信 RED、当前 Context、card 和 exact target admission，之后才写 helper/test。S01 F01 Entry Packet、真实权限模块/隔离环境、权限撤销与恢复继续保持原状态；Goal 完整范围不变，`Scope Delta: none`。
