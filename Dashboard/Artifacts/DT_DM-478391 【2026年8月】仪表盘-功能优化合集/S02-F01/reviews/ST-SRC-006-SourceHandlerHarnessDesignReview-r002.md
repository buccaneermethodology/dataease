# ST-SRC-006 首项默认值/级联回调局部 harness 设计复核 r002

## 结论

- **局部设计边界：PASS WITH BOUNDS。** Design 将范围限定为 AST 提取的局部源函数和隔离输入/回调；真实映射、级联回写、级联事件/配置目标和跨文件 owner 均纳入依赖。Vue/SFC wiring、API/Store、持久化、权限和 Goal AC 验收明确排除。此边界适合 local-harness-only。
- **Contract/Cases 冻结：NOT READY。** 本轮新增 Case fixture 后，6 个 case / 8 个 variant 已能具体表达大部分 oracle，但逐例 `snapshot_fields` 与 `expected` 尚不一致，不能保证 runner 对完整受限状态做精确比较。修复后需基于新摘要再做窄复核，不能据此直接启动 Builder。
- **产品及 Goal 声明：未通过也未验证。** 当前文件仍是 `candidate / NOT_FROZEN / NOT_RUN`。本报告不准入产品接线、权限、保存/重开、历史行为、任何 Goal AC 的验收或 Goal 完成。

## 复核输入与边界

本次核对对象及 SHA-256：

| Artifact | SHA-256 |
|---|---|
| `ST-SRC-006-SourceHandlerHarnessDesign-r001.md` | `e07a93485288dd94f7682f6de416f266573628b6d74cacf22d11e39dae2a5cc3` |
| `ST-SRC-006-SourceHandlerHarnessContract-candidate-r001.json` | `e43e67e7a69a4d097405b2f98441663105ba0272bbbbd4c6762a6a660833f760` |
| `ST-SRC-006-SourceHandlerHarnessCases-candidate-r001.json` | `92691728d7facc974a43e6c9496982ba551297fa179e7550c3fb7d778af5a5f1` |

本轮读取源码并作只读 oracle 检查；没有执行 runner、测试、构建、浏览器或产品。工作树相关 Vue 文件有其他未提交改动，但 `git diff -U0` 中的 hunk 未覆盖候选提取的函数体。实现前仍须重核目标函数差异来源。

## 已修复并确认的要点

- `setCascadeValueBack` 按 `item.datasetId.split('--')[1] === config.value.id` 更新匹配的**当前节点**。新 fixture 已将更新目标设为 parent；运行态只改 `currentSelectValue`，配置态改 `selectValue` 与 `currentSelectValue`。这与下游清理是不同路径。
- `setCascadeDefault` fixture 覆盖 `optionValueSource=2`、禁止的 `displayType=7` 和不匹配 id；符合 `optionValueSource===1`、`displayType` 在 `[0,2,5]` 且 id 命中时，字段按既有类型清为空数组或 `undefined`。
- Contract 增加 `emitCascadeConfig` 真实依赖和 fixture 引用；可信 RED/GREEN 约束固定为同一 `case_id`/`variant_id`，只变异 expected full-snapshot leaf，恢复原始 fixture 后同一 identity 再 GREEN。
- `CONFIRM-GUARD` 变体已经明确查询调用和返回值检查；级联首项包括 nextTick flush 前后检查点。

上述行为与当前源码目标函数相符：`Select.vue` 的 `setDefaultValueFirstItem`、`setCascadeValueBack`、`emitCascade`、`emitCascadeConfig`，`QueryConditionConfiguration.vue:setCascadeDefault` 及 `Component.vue:isConfirmSearch`。其中跨组件函数被独立提取不代表真实 provide/inject wiring。

## 冻结阻断项

机器检查 `snapshot_fields` 与 `expected` 顶层键后发现以下缺口：

| Case / variant | 缺失或多余 | 影响 |
|---|---|---|
| `RUNTIME-MULTIPLE-FIRST / MULTI-ROOT` | expected 缺 `cascade` | 声明的完整快照未对 cascade `[]` 作断言。 |
| `CASCADE-FIRST / CASCADE-ROOT` | expected 缺 `cascade` | 声明的完整快照未对 cascade `[]` 作断言。 |
| `EMPTY / NO-OPTIONS` | expected 缺 `cascade`；多出 `nextTickQueueLength` | 无法证明 tuple 原样保持；额外旧字段不属于声明的 oracle。 |
| `CONFIG-CASCADE-CLEAR / CONFIG-PARENT` | 多出未声明的 `queryCalls` | 清理 case 的观测形状不确定；应统一使用 before/after nextTick call 字段或从 expected 移除该字段。 |
| `CONFIRM-GUARD` 三个 variant | `snapshot_fields` 包含 `id`，expected 未包含 | 不能比较该调用 identity 的保留值，尤其无法证明调用转发的是原 `id`。 |

最小修订是让每个 expected 的键与其 `snapshot_fields` 完全一致；其中 cascade 空数组应显式断言，CONFIRM 的 id 应为 `parent`，无效冗余字段应删除。修订后刷新 Case/Contract 摘要并复核，不需要扩大设计范围。

## 声明上限与后续

此报告只支持设计边界判断和合同冻结缺口定位，不证明候选 harness 已实现或执行。当前用户已明确真实多用户权限环境缺少授权来源，应继续标记 `BLOCKED / NOT_RUN`；只读用户限制与权限撤销验收不得用 standalone admin 或替补权限实现代替。S01 当前状态及其尚未完成事项同样不由 ST-SRC-006 局部 harness 改变。

下一步：修正逐例 expected / snapshot_fields 一致性并刷新摘要；窄复核通过后，才可冻结合同并由获准 Builder 实施同 identity RED/GREEN harness；再按 Goal 的独立 Validation、权限阻塞、Dashboard closeout 和 Stop Gate 流程继续。Goal 原始 10 项 AC、26 项 must-have、16 项产品义务与 `Scope Delta: none` 均保持不变。
