# ST-SRC-007 Saved Canvas Owner 源码归属追踪 r001

## 目标与边界

此追踪将现有实现的局部职责与可运行测试映射到真实入口。它是源码路径证据，不替代独立语义 Validation、浏览器/API 行为、后端保存、权限验证或用户验收。原 Goal 的 10/26/16 分母及 `Scope Delta: none`不变。

## 保存链路归属

1. `components/data-visualization/DvToolbar.vue:311-317` 注册 `save` 事件并卸载时移除；`utils/DeShortcutKey.ts:255`、页面入口可发出该事件。
2. 保存按钮处理走 `saveCanvasWithCheck`，成功前置后进入 `utils/canvasUtils.ts:845-930` 的 `canvasSaveWithParams`。managed session 分支构造 capture input，调用 `dvMainStore.captureQuerySingleSelectSave`；按 capture 指示做命名检查、`validateQuerySingleSelectSaveTarget`、`markQuerySingleSelectSaveSent`，然后选择 `saveCanvas/updateCanvas` API；请求成功后重新计算 current intent 并 `settleQuerySingleSelectSave`，再更新 dvInfo、重置 snapshot 计数并 callback。异常按请求是否已发出写为 `unknown` 或 `definitely_not_written`。
3. lifecycle facade 位于 `store/modules/data-visualization/dvMain.ts:531-583`，转发到 `custom-component/filter-copy/query-single-select-session.ts` 中的 owner。Owner `captureSaveIntent` / target check / sent / settle 在该文件约 `572-650`，管理 token、revision/epoch、target identity、请求并发与 unknown outcome。该模型定义了门控语义，但本地 helper runner 不能证明远端 API 或后端是否成功保存。

## 编辑确认与历史归属

- 编辑确认写入：`custom-component/v-query/QueryConditionConfiguration.vue:1606-1670` 以当前 lifecycle revision 准备 confirmation，再调用 `commitQuerySingleSelectConfirmation`；成功路径发布 root/snapshot 并经 `nextTick` 发出 rerender/query 事件，失败时 invalidate 并阻止 legacy direct-write 回退。
- 快照追加：`store/modules/data-visualization/snapshot.ts:213-230` 生成新 snapshot、推进 index，之后调用 `recordQuerySingleSelectManifest(newSnapshot, true)`。manifest owner 在 `query-single-select-session.ts:453-482`，保存当前 document epoch 的 design carrier 与 snapshot 对应关系。
- Undo/Redo：`snapshot.ts:98-105` 选择目标索引，`:106-142` managed session 先调用 `prepareQuerySingleSelectHistory`，再以 callbacks 原子移动 index、发布 snapshot/selection/events；非 managed 路径保留普通快照行为。lifecycle owner 的 manifest/history restore 在 `query-single-select-session.ts:485-570`，manifest 缺失会 invalidate 并返回可回退快照；commit 出错会 invalidate 并重新抛出。
- 前端重新打开的资源加载入口由页面/应用更上层决定；这里查看到的 saved-owner harness 明确不执行重开，不将现有 history snapshot 等同于持久化重开。

## 可运行证据与缺口

`tests/filter-copy-query-saved-canvas-owner/saved-canvas-owner.test.mjs --mode green` 当前工作树 GREEN 40/40；它静态检查 saved owner 边界并测试 lifecycle helper 局部行为，内嵌 session regression 通过。runner 明确设置 `source_read=false`、`paste_commit=false`、`reopen_allowed=false`、`authorization_claim=none`。这与源码路径可定位性不矛盾：runner 的执行场景没有从真实保存链读取源对象，也没有证明粘贴事务或 API round trip。

仍未观察/未验证：实际保存点击到 API 的 browser flow、response/error 的接口一致性、后端元数据/内容回读、保存后重新打开、reload、跨用户资源访问，以及权限撤销/恢复。S01 F01 `CONDITIONAL`；真实多用户权限 `BLOCKED / NOT_RUN`；不可由 standalone admin 或 runner 替代。

## 判定

源码 owner 路由已足以明确后续集成验证需要覆盖 `Toolbar event → canvasSaveWithParams → lifecycle owner → API → reopened resource`，以及 `recordSnapshot → manifest → undo/redo publication` 两条链。当前结果只支持局部测试和源码归属追踪，ST-SRC-007 不得标为产品验收通过。
