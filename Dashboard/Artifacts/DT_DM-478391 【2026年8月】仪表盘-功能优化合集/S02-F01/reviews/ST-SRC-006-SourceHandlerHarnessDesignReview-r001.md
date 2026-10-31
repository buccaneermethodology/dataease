# ST-SRC-006 首项默认值/级联回调 local harness 设计复核 r001

## 双结论

- **Design boundary：PASS WITH BOUNDS。** 最新候选将范围限制为 AST 抽取的局部源函数与隔离输入/回调；真实 `setDefaultMapValue`、`setCascadeValueBack`、`emitCascade`、`emitCascadeConfig` 和两个跨文件 owner 均列入依赖；明确不测 Vue/SFC wiring、API/Store、持久化或权限。该范围可以作为 local-harness-only 的设计边界。
- **Builder contract freeze：NOT READY。** 机器合同目前只有 Case IDs 和通用 oracle 文本，没有逐例 `before`、阶段检查点和 `expected_after`。现有文字不足以唯一比较完整级联对象、回调顺序和 nextTick 释放前后状态，也没有冻结同身份 RED/GREEN 的具体变体与反例。补齐可执行 fixture 后应再做窄复核/准入。
- **不构成产品接线或 Goal 验收：** 文件仍标记 `candidate / NOT_FROZEN / NOT_RUN`。本报告不批准产品 UI/Store/API、provide/inject wiring、权限、保存恢复、Goal AC 或产品验收。

## 输入与源码版本

复核对象为 `ST-SRC-006-SourceHandlerHarnessDesign-r001.md`（SHA-256 `19048f2bf2eff0b0059342d5f5349506a13a9110779b6feff5f3c3bc7b5b52fc`）与 `ST-SRC-006-SourceHandlerHarnessContract-candidate-r001.json`（SHA-256 `8c0fb575074e1bc4a1a7738974a1098a300d41daaf5ffe7ba51be10352c966e3`）。以上是本次实际复核的版本摘要。

当前工作树的 `Select.vue`、`Component.vue`、`QueryConditionConfiguration.vue` 均存在未提交差异。逐块比对 `git diff -U0` 后，候选列出的目标函数区间没有出现在差异 hunk 中：`setDefaultMapValue`、`setCascadeValueBack`、`emitCascade`、`emitCascadeConfig`、`setDefaultValueFirstItem`、`setCascadeDefault` 和 `isConfirmSearch` 当前与 HEAD 相同。工作树差异位于 observation/lifecycle gating 与 QueryConditionConfiguration 的 `confirmClick` 等其他区段；后续 Builder 仍应按设计要求保留来源说明。

本轮只读源码和文档，没有执行产品、runner、测试、构建或浏览器，也未修改候选或产品代码。

## AST 依赖和作用域核对

`Select.vue` 当前目标函数和行号如下：

| 函数 | 当前行 | 依赖/作用 |
|---|---:|---|
| `setDefaultValueFirstItem` | 533-562 | 空 options 早返；首项值写入；运行态走 map/cascade/event/nextTick；配置态走 `emitCascadeConfig` 与 `setCascadeDefault`。 |
| `setDefaultMapValue` | 134-153 | 读取 `config`、`enumValueArr`，按 display/field 值聚合并去重 map 值。 |
| `setCascadeValueBack` | 160-171 | 遍历 `cascade.value`；按当前 config identity 更新目标节点的 `currentSelectValue`，配置态另更新 `selectValue`。 |
| `emitCascade` | 184-196 | 对每个级联 tuple 从当前节点之后选择下一个节点，记录动态 `*-select` event。 |
| `emitCascadeConfig` | 198-211 | 从当前节点之后提取下游组件 ID，作为配置态级联清理目标。此函数在 r001 最初候选缺失，现已加入 Design 与 Contract；这是必要的真实局部依赖。 |
| `setCascadeDefault` | `QueryConditionConfiguration.vue:165-177` | 仅对 source、displayType 与 id 谓词命中的条件，分别清空/设空 select、default、map 与 defaultMap。 |
| `isConfirmSearch` | `Component.vue:484-487` | `componentWithSure && !disabledFirstItem` 时早返，否则转发 `queryDataForId(id)`。 |

因此最新函数清单已覆盖 `setDefaultValueFirstItem` 的本地级联 helper。允许 stub 的边界也合理：`nextTick` 只作可控调度器，emitter 只记录外部事件；`cascadeList` 可提供共享的受控 tuple 数据；`isConfirmSearch` 的 `queryDataForId` 是被排除的外部 owner 边界。但 harness 必须让所有提取函数共享同一 config/cascade/conditions 对象，并抽取真实 `emitCascadeConfig` 与 `setCascadeDefault`；若把任一上述局部 helper 换成返回预设值的 mock，就不能声称已复核映射或级联计算。

## 主要 oracle 边界

设计提出的受限快照方向正确，但机器合同尚未落成可比较对象：

- 运行态单选/多选至少要分别给出 `options[0]`、selection、config 值、map/defaultMap、`enumValueArr` 和 config identity；多选需说明各数组的复制关系及不共享引用断言。
- cascade 输入需包含目标节点和非目标节点、单条与多条 tuple、后继节点；完整断言所有 tuple 节点的 `selectValue/currentSelectValue`，不能只写“target fields”。运行态还应断言 `emitCascade` 的动态 event 名、数量、顺序以及发射前的同步字段状态。
- `nextTick` 必须分成同步调用后、flush 前和 flush 后检查：前一 checkpoint 中调用队列含预期 callback 且 `isConfirmSearch` 尚未调用；释放队列后 callback 恰调一次、参数准确，并验证 `isFromFromCascade` 的复位顺序。不能用实际墙钟 sleep 替代。
- 配置态 fixture 需覆盖 `emitCascadeConfig` 真正返回的后继 ID，再由真实 `setCascadeDefault` 检查合格和不合格条件；合格条件命中时四个字段按原值类型变成 `[]` 或 `undefined`，未命中条件及其他字段保持原值。
- `isConfirmSearch` 至少需要 `componentWithSure=true/disabledFirstItem=false` 的阻断分支，以及允许查询的分支；后者记录 `queryDataForId(id)` 一次，前者断言零次。否则 “守卫阻止/允许” 没有唯一输入输出。

这些要求是本地函数合同，不要求挂载 Vue 或验证 provider wiring。

## 建议的最小 RED/GREEN case 集合

沿用当前六个 Case identity，并让 RED 与 GREEN 使用完全相同的输入和 case identity：

1. `ST-SRC-006-RUNTIME-FIRST`：单选首项，提供有辨识度的 enum/map 与级联链；断言所有目标状态、emit 顺序，以及 nextTick 前后 callback 顺序。
2. `ST-SRC-006-RUNTIME-MULTIPLE-FIRST`：多选首项变成单元素数组；检查 select/config/map/defaultMap 的数组内容和复制隔离。
3. `ST-SRC-006-CASCADE-FIRST`：设置 cascade 来源标志；验证 `isConfirmSearch(id, false)` 在 nextTick 后调用，随后标志复位。将 callback 日志与 flag 状态一起记录，确定顺序。
4. `ST-SRC-006-EMPTY`：空 options 时局部对象、tuple、事件、回调和 nextTick 队列全部保持不变。
5. `ST-SRC-006-CONFIG-CASCADE-CLEAR`：使用真实 `emitCascadeConfig` 产生下游 IDs，并用真实 `setCascadeDefault` 覆盖命中/未命中，以及数组/标量字段清理。
6. `ST-SRC-006-CONFIRM-GUARD`：至少两个变体覆盖阻止和允许转发，完整记录返回/调用结果。

可信 RED 应能由同一套 fixture 捕获局部错误，例如故意跳过一个真实 helper、让 event 顺序错位、inline 执行 nextTick、翻转 cascade flag 或破坏 guard；恢复原始 AST 函数后，以相同 Case ID/输入得到 GREEN。具体 RED 生成方式、各 fixture 的 frozen identity 与 expected snapshots 应写入 machine-readable Cases/Contract，不在本报告中伪造已运行证据。

## 最小修订与后续边界

在 Builder contract 可冻结前，至少需要将六个 Case IDs 展开为逐例输入、完整 before/expected 状态，以及 nextTick flush 前后的检查点；`CONFIRM-GUARD` 明确两个分支；`CONFIG-CASCADE-CLEAR` 明确真实 `emitCascadeConfig` 产出的 ID 和 owner 清理条件；同时记录 RED/GREEN 同 identity 规则。Design 中“含三个 Select 本地 helper”现与清单的四个 helper 不一致，应改为四个，属于文案一致性修正，不单独构成行为阻断。

设计 boundary 可保持 local harness only。完成上述合同快照后，再进行只针对 ST-SRC-006 的独立设计/合同复核；不得扩展到完整 `handleFieldIdChange`、300ms timer、Vue watcher/DOM、真实级联接线、查询订阅、Store/API、保存/history 或权限。Goal 原始 10 AC / 26 must-have / 16 产品义务及 `Scope Delta: none` 不因本地 harness 改变。

**Claim ceiling：** 本报告只核对当前候选的源函数边界和冻结准备度；不证明 harness 已实现或执行，不证明产品级联、权限、任何 Goal AC 或 Goal 完成。
