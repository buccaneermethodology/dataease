# ST-SRC-007 Saved Canvas Owner 当前工作树 GREEN 执行记录 r001

## 范围

本次仅在当前工作树读取并执行既有 saved-canvas-owner runner，帮助定位保存载体 owner 的局部测试覆盖。该 runner 声明 `authorization_claim: none`、`source_read: false`、`paste_commit: false`、`reopen_allowed: false`；它验证的是 lifecycle helper 的静态/模型契约和行为用例，不是产品保存或重开验收。

## 命令与结果

- 首次未带模式参数运行 `node tests/filter-copy-query-saved-canvas-owner/saved-canvas-owner.test.mjs`，由 runner usage guard 以断言失败：`mode must be explicit: red or green`。这是命令调用错误，不是产品 case 失败。
- 正确运行 `node tests/filter-copy-query-saved-canvas-owner/saved-canvas-owner.test.mjs --mode green`：退出码 0，40/40 个 SCPO2/SCPO3/SCPO4 cases pass，`execution_errors=[]`、`behavior_mismatches=[]`。同一运行还触发 `query-single-select-session.test.ts` 回归，状态 0，输出 lifecycle PASS。
- GREEN identity：runner SHA-256 `5539326540d67c8c352e91bee1611d7783e6f02bd961b7030510f877b600dfc4`；fixture `f209c9552d2807e628c8334d5e2164114837ec9af2a4592b1332d89715d9a822`；contract `268225f040bc1062e9e62dc071bcd43fa75542c6943300e5f49fd07fc0926d82`；源码 helper `f475e94fd51c70a6d634ff80caf0cc35d5430556bedf5e5312b8d09f1dd94130`。

## 代码 owner 线索

静态入口指向 `utils/canvasUtils.ts:845-930` 的 `canvasSaveWithParams` managed save 分支；Store owner 在 `store/modules/data-visualization/dvMain.ts:531-583` 包装 lifecycle owner；确认编辑器由 `QueryConditionConfiguration.vue:1606-1670` 预备/提交；Undo/Redo 由 `store/modules/data-visualization/snapshot.ts:106-147` 准备并提交 history；视图保存事件由 `components/data-visualization/DvToolbar.vue:311-317` 注册。

## 声明上限

40/40 是当前 helper/合同测试结果。它不证明实际 canvas API request、后端存储、保存重开、真实浏览器 UI、权限或 Goal AC 完成。当前工作树的测试及 source 都有未提交修改；这不构成独立 Validation。真实多用户权限仍 `BLOCKED / NOT_RUN`，S01 F01 仍 `CONDITIONAL`。
