# QSINGLE-DEFAULT-COPY-001 独立验证 r001

## 双结论

**候选包：`PASS_WITH_BOUNDS_FOR_QSINGLE_DEFAULT_COPY_001`（有界通过）。** 当前实现对冻结的 12 个 identity 及 3 项防御检查共 15/15 通过；同一 runner 的 RED 在断言层 15/15 失败、GREEN 15/15 通过；独立复跑与定向 ESLint 均通过。值字段透传、身份字段重生、深复制和失败原子性符合本切片合同。

**原 Goal：`NOT_CONFORMANT_AS_GOAL_COMPLETION`（不能作为 Goal 完成）。** 原始 Goal 的 10 项 Goal AC 和 16 项产品义务仍完整；Goal JSON 的 26 项 must-have 均为 pending。该候选是未接入产品的纯函数，不能证明枚举有效、copy/paste、查询行为、即时预览、保存重开或权限。

审查卡 canonical digest `70c9fcce1de044a706b2175fc70a6457437632f3de8cde104f6b972c18f3e04d` 复验通过；Context Bootstrap r001 校验通过；Topology 基线 r071。仅新增本报告。

## 范围、输入摘要与受影响文件

对照 Goal `DE-S02-F01`、Design Review `PASS_WITH_BOUNDS_FOR_QSINGLE_DEFAULT_COPY_001`、冻结 Design/Fixtures r003、Builder Card/Context/Admission、RED/GREEN/lint 日志及 Builder 执行证据。冻结 fixture SHA-256 为 `3afaf76708fade4e62c5feda62066dec58d78c8ec9b98e9a18fea994820ca90e`。

本切片实际产品源码与测试为：

- `core/core-frontend/src/custom-component/filter-copy/query-single-select-default-copy.ts`，SHA-256 `364e1bfe27d0013b3fb2ecdc22105e54aedf07cdbe0a5ce731fbf1fdff497b44`。
- `core/core-frontend/tests/filter-copy-query-reference/query-single-select-default-copy.test.ts`，runner SHA-256 `2006fb73cde3b657a0b9487614c1ee7d183178a430aa668a8bc2f6df2b954015`。

限定路径检查发现这两个文件为本候选的新增实现/测试；既有无默认模块 `query-single-select-rebuild.ts` 与其测试仍分别为 SHA-256 `6927e86476fd457e1e2a0dadc2299aeccef6b4945d53df230788f05adc1f8e3f` 和 `ce7bd18063134e60533780fc2c7c43023a9ad1e127f6ab6957874ccf0b127f71`，未被改动。定向检索未发现生产源码对新函数的调用；本模块尚未接 UI、Store、`useFilter`、枚举服务或产品 copy/paste 入口。全仓有其它 S02 未提交材料；它们不是本切片的写入或验证范围，也不纳入本结论。

## 独立复跑与证据复核

在 `core/core-frontend` 独立执行：

- `node tests/filter-copy-query-reference/query-single-select-default-copy.test.ts`：12/12 冻结 identity 与 `deep-freeze-and-output-detachment`、`all-source-values-remain-deep-equal-except-identities`、`deterministic-output-and-json-round-trip` 三项防御检查全部通过；汇总 15/15、0 failures。runner 输出的源码/runner SHA 与当前文件一致。Node 发出 package module-type 性能提示，不影响断言结果。
- `./node_modules/.bin/eslint src/custom-component/filter-copy/query-single-select-default-copy.ts tests/filter-copy-query-reference/query-single-select-default-copy.test.ts`：退出码 0。

Builder RED 与 GREEN 使用同一 runner 和 12 个固定 identity。RED 设置 runner 明确支持的 `QSINGLE_DEFAULT_COPY_FORCE_UNIMPLEMENTED=1`，12 项 oracle 及 3 项防御断言在断言层失败，汇总 15 failures、exit 1；stderr 显示 oracle 与 `UNIMPLEMENTED` 返回值不符，并非解析/加载失败。GREEN 退出码 0，15/15；其 source SHA、runner SHA 与当前实现及 runner 相符。独立复跑重新验证了 GREEN 行为；没有把 Builder 自报作为独立验证替代品。

## 冻结合同逐项核验

独立对完整成功 oracle 重算字段差异：两个成功 case 每个 condition 都逐字段深等，只有 `id`、`checkedFields`、`checkedFieldsMap` 按 plan 重生；每个 cascade node 只有 `id` 与三段 `datasetId` 重生。`defaultValue`、`defaultMapValue`、`defaultValueCheck`、`defaultValueFirstItem`、`selectValue`、`mapValue` 及 node `selectValue/currentSelectValue` 均按源值原样保留，包括缺省键、空数组、多值和不同的默认/运行/级联选择。Fixture 正例所列完整嵌套对象与这些规则吻合。

12 个冻结 identity 均按 fixture expected 通过：

| Identity | 独立核对结果 |
|---|---|
| `TC-QSINGLE-DEFAULT-COPY-001/002` | 成功；完整对象 comparison 通过，覆盖 71/70 键条件、缺省 `selectValue`、空默认映射，以及默认值与运行/节点值不同。 |
| `TC-QSINGLE-DEFAULT-COPY-003/004/008/009/010` | 按固定支持域拒绝数组默认、首项默认、无默认路由、null 运行值和非字符串映射；reason 为 `UNSUPPORTED_SHAPE`。 |
| `TC-QSINGLE-DEFAULT-COPY-005/012` | 未知键与必要默认字段缺失拒绝为 `UNSUPPORTED_FIELD`。 |
| `TC-QSINGLE-DEFAULT-COPY-006/007` | 引用计划错配及目标缺字段分别拒绝为 `PLAN_MISMATCH`、`TARGET_UNRESOLVED`。 |
| `TC-QSINGLE-DEFAULT-COPY-011` | 同时包含支持域错误和计划错误，按冻结全局阶段优先返回 `UNSUPPORTED_SHAPE`。 |

实现顺序先完成输入 JSON/身份检查，再全局做精确字段检查、支持域检查、计划/闭包校验、目标目录校验，最后才创建输出，符合 `INVALID_INPUT → UNSUPPORTED_FIELD → UNSUPPORTED_SHAPE → PLAN_MISMATCH → TARGET_UNRESOLVED` 的冻结优先级。目标目录逐项校验 dataset 与字段存在；条件映射严格对应源 `checkedFields` 顺序和值。级联节点按同位置的源条件身份校验，输出只重生规定的身份字段。

测试确认输入深冻结后仍可运行、源对象不变、成功输出没有与输入共用的嵌套引用、失败输出不带 value/partial，重复调用确定且 JSON round-trip 稳定。代码不读取枚举、时钟、网络或随机数。以上是纯函数合同证据，不能推导存储/执行端行为。

## Finding：Topology 摘要索引 SHA 不一致

`F-QSDF-VAL-001`（P2，非行为性证据索引不一致）：Topology r071 的 Builder 输出字段记录实现 SHA `364e1bfe7c341c4cf95b5ab3fa30b4557f34cbe07ad93b5805ae50b93e497b44`；当前源码、Builder 执行证据、Validation Context 与独立 runner 均一致绑定到 `364e1bfe27d0013b3fb2ecdc22105e54aedf07cdbe0a5ce731fbf1fdff497b44`。这是拓扑摘要展开错误，不是源码漂移：当前文件确切 hash 与 RED/GREEN 记录相符，且独立复跑通过。该索引差异不改变本候选行为 verdict；由控制面在新的 append-only Topology 中记录更正和处置，不改写 r071，也不由本验证 lane 修复。

## 声明上限与未验证项

本包仅证明指定合成 JSON 支持域中离线纯函数的结构转换及拒绝规则成立。虽然函数原样透传默认值和已存映射，但不验证 `defaultValue` 是否存在于目标枚举，也不验证 `defaultMapValue` 是否仍匹配目标实际数据。未运行真实枚举、UI/Store、生产适配、查询预览、正常保存/重开、数据库、权限或多用户路径。只读用户查看/复制/粘贴限制、权限撤销与恢复继续 `BLOCKED / NOT_RUN`，不得以 standalone/admin/mock 代替。

因此本次候选有界通过不关闭任何原始 Goal AC 或产品义务，不证明完整 F01、S02 Goal 或 S10 准备完成。后续需单独准入产品接入及真实隔离权限环境验证，并对产品端状态和枚举语义另作独立审查。
