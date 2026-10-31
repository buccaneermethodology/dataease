# ST-SRC-006 首项默认值/级联回调局部 harness 设计复核 r003

## 结论

- **Design：PASS WITH BOUNDS。** 接受将 ST-SRC-006 限定为 source-handler local harness；不外推到产品接线或 Goal AC。
- **Contract/Cases：可冻结为 `local harness only`。** 最新 6 个 case / 8 个 variant 的 expected 与 `snapshot_fields` 闭合，源码 owner、nextTick 和调用转发边界已明确。冻结时必须绑定本报告列出的摘要。冻结本身不等于已实现、RED/GREEN、独立 Validation 或 Goal 完成。
- **Builder 范围建议：** 仅新增专用 harness runner `core/core-frontend/tests/filter-copy-query-select-text-source/source-handler-harness.mjs`，读取冻结 Contract/Cases 并 AST 提取其列出的函数 initializer；允许同一新 runner 用内存/临时副本执行单叶 expected 变异的 RED 与原始 fixture 的同 identity GREEN。不得改产品 Vue 源码、既有 harness、冻结 Contract/Cases、依赖或通用构建脚本。若实施确需扩大上述目标，先提交新的有界设计/Contract 复核和对应 admission。
- **此报告不是 Builder execution admission。** 首次写入前仍须按 SP-010 校验绑定本 Goal、Contract、Context Bootstrap、Design/Review 与实际 topology 摘要的 execution admission；未通过不得写入。

## 复核对象

本次复核使用以下精确摘要：

| Artifact | SHA-256 |
|---|---|
| `ST-SRC-006-SourceHandlerHarnessDesign-r001.md` | `592819b81b41b1902ca2405c45673f855e5b4b9f0007c07dc02e2ef64db6350c` |
| `ST-SRC-006-SourceHandlerHarnessContract-candidate-r001.json` | `5b979d16f64600c91e1abb1a3a61082edcd6cb25f3a476277f20a975887328c9` |
| `ST-SRC-006-SourceHandlerHarnessCases-candidate-r001.json` | `55e3fd164711204a3f5c4eeec97d3b5a7f88e83fdf65b6e5b8fed23003ee2386` |

本报告 supersede `ST-SRC-006-SourceHandlerHarnessDesignReview-r001.md` 和本次复核迭代中针对旧摘要写出的 r002；r002 对应较早快照中的字段缺口，不适用于本报告列出的摘要。

## 复核证据

- Fixture JSON 可解析，共 6 个 `case_id`、8 个 `variant_id`；逐 variant 核对 `set(expected keys) == set(snapshot_fields)`，全部通过。
- 当前源码核对了 `Select.vue:setDefaultValueFirstItem`、`setDefaultMapValue`、`setCascadeValueBack`、`emitCascade`、`emitCascadeConfig`，`QueryConditionConfiguration.vue:setCascadeDefault`，以及 `Component.vue:isConfirmSearch`。Contract 行号现与 initializer 范围相符。
- `setCascadeValueBack` 按当前组件 identity 更新匹配节点：运行态只写 `currentSelectValue`，配置态同时写 `selectValue`；Cases 的 parent 目标和 config/runtime 差别符合源码。配置清理用真实 `emitCascadeConfig` 结果，并覆盖 option source、display type、id 的负条件。
- 运行态首项在非空 options 下无条件排入一次 `nextTick`；级联回调执行后清除 `isFromFromCascade`。三种 runtime fixture 的 flush 前队列长度为 1，flush 后为 0，最终 flag 为 false；空 options 与配置态不排队。`Component:isConfirmSearch` 以 fixture `componentWithSure` 执行真实 owner guard，下游 `queryDataForId` 明确是只记录调用的 stub，不声称覆盖完整查询校验或 emitter。
- 当前工作树产品文件存在其他差异；`git diff -U0` 的 hunk 未覆盖上列候选 initializer。实施前仍须由 Builder 复核目标源码摘要/来源，不能把其他工作树变化带入本地 harness 声明。

本轮只读检查文档、JSON 与源码；未执行 harness、产品、测试、构建或浏览器。JSON 形状检查仅验证 fixture 可解析、数量与键闭合，不替代后续 runner、可信 RED/GREEN 或独立 Validation。

## 冻结后允许声称的范围

若按上述范围实施、可信 RED/GREEN 通过且独立 Validation 通过，最高只能声称：本地隔离输入下，合同列出的真实 AST initializer 符合这些局部受限状态 oracle。它不证明 Vue/SFC 挂载或 provide/inject 接线、真实 cascade provider、真实 query emitter 订阅、300ms 枚举请求及其异步竞态、API/Store、保存/重开/history、用户操作或任何完整产品链路。

真实多用户权限环境仍为 `BLOCKED / NOT_RUN`。只读用户禁止查看/复制/粘贴及权限撤销验收不得由 standalone admin、替补权限实现或本地 harness 代替。Goal 原始 10 项 AC、26 项 must-have、16 项产品义务及 `Scope Delta: none` 不因本设计冻结而减少；ST-SRC-007、S01 收尾及其余未验证义务仍按各自状态推进。
