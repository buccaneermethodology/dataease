# CREATE-003 纯模型独立 Validation r001

## 双 verdict

**CREATE-003 纯模型候选：`NOT_CONFORMANT_TO_PURE_MODEL_CONTRACT`。** 固定的 15 个完整状态 oracle、6 个负例、输入不变与对象图隔离断言均通过，确认成功 confirm 调用真实 QCARRIER 恰两次，且源码不读取 Fixtures；但发现一个合同未授权的拒绝路径，详见 `F-CREATE-003-VAL-001`。因此整体候选不能判为通过，需 Builder 处理 finding 后再独立验证。

**原 S02 Goal：`NOT_CONFORMANT_AS_GOAL_COMPLETION`。** 本纯模型候选与 Goal 完成是不同层级；原始 10 项 Goal AC、26 项 must-have 和 16 项产品/兼容义务未关闭、未缩减。OBS-01/02 保持开放；真实多用户权限验收继续 `BLOCKED / NOT_RUN`，未用 standalone、admin 或 mock 替代。

## 准入与证据绑定

Card 经 SP-010 `lane_task_card.py validate` 复验通过，canonical SHA-256 `011d7c4f80716dfaf12f5735a8f752855b4f44bcf2a2ffd73139fb53a9f7fac7`。Context Bootstrap 验证通过，SHA-256 `d0ecff940a5253144d9a9e46965f82ceea0ccfa293d338b929c41c602dc5f249`；11 项 required-read revision 全匹配，`skipped_reads=[]`。Stop Gate `receipt-r066` 状态为 valid / `CONTINUE` / `final_allowed=false`，其 186 个引用摘要均匹配。

合同、Fixtures、Design、Design Review、PureModel Contract Review 与 Topology r115 的文件摘要与当前文件一致。Contracts 中 10 个内容寻址对象均独立复算匹配；17 条原始 fixture 中 TC-QCREATE-001..015 是本 API 的完整状态 oracle，TC-QCREATE-016/017 按合同排除，不计入实现覆盖。

实现 `query-single-select-created-lifecycle.ts` SHA-256：`cf24043ba598efdf95cfad5c3413006b62bb85707b8891f965584a323924ebc1`；runner SHA-256：`566617e944ea207bfcea2d348183a49f8f2975e61be12712888b46671b4418eb`。两个文件为本候选新增未跟踪文件，无已跟踪 Git 基线可供普通 diff 比较；本次直接审阅完整源码及 runner，并将当前 SHA 与 Context、Topology r115 对照。

## 独立复跑

在 `core/core-frontend` 执行：

- `node tests/filter-copy-query-reference/query-single-select-created-lifecycle.test.ts`：`QCREATE-003 ... 125 checks passed`，退出码 0。覆盖 15 个状态转换的完整 expected state、输入不变、结果对象与输入隔离、root/carrier/历史快照互相隔离、全部 6 个负 oracle 与成功调用 QCARRIER 次数。
- 定向 ESLint（实现和 runner）：退出码 0。
- `npm run ts:check`：未通过，输出 3 个既有 TS6504，分别位于 `DeRichTextViewV3.vue.js`、`views/pages/menu/system/watermark/index.vue.js`、`views/watermark/index.vue.js`。它们与 Builder/Topology 中记录的已知检查阻塞一致；此次没有 TS6504 指向 CREATE-003 实现或 runner。全量 TypeScript 检查仍不能判绿。

Runner 的 QCARRIER 计数器包装真实 `prepareQuerySingleSelectCarrier`，其成功调用数恰为 2。源码只导入真实 QCARRIER 模块，没有 Fixture/expected 表或 caseId 分支。纯模型运行证据不代表产品接线行为。

## Finding

**`F-CREATE-003-VAL-001`（P2，事件序列被额外限制）**：PureModel Contract 对 `fresh_non_template_dashboard_createInit` 的前置条件是 `state=null` 且该事件“为序列首个事件”；API 接收事件数组，未声明 fresh 后必须结束序列。实现 `query-single-select-created-lifecycle.ts:553` 却在 fresh 后对 `events.length > 1` 返回 `INVALID_TRANSITION`。

独立复现：一次调用 `{state:null, events:[fresh, handleNewFromCanvasMain(component)]}` 返回 `INVALID_TRANSITION`；将同一序列拆为 fresh 调用、再将其状态传给 handleNew 调用，则成功生成合同定义的 `pending` 状态。合同只约束 fresh 为首事件，故该额外单事件限制与合同可观察行为不一致。建议 Builder 按合同支持后续事件并补充批量序列 oracle；若设计意图确实只能单事件初始化，应先修订并独立审核合同，不能由实现自行收窄。

此外，实施前没有取得可信、同身份的断言级 RED。该限制来自 Builder 记录；本验证不追认实施后构造或其他 runner 失败为 RED，也不据此声称 RED/GREEN 闭环。

## 声明上限

本结论只覆盖冻结纯模型 API、15 个状态 oracle、6 项负例及本报告发现的序列边界；不证明产品生命周期接线、真实预览/保存/Undo、持久化、权限或 Goal 完成。真实权限仍 `BLOCKED / NOT_RUN`，OBS-01/02 未解决，原始 10 项 Goal AC 与 16 项产品义务保持开放。此 Validation lane 只写本报告；Builder finding 的修复和状态升级由控制面另行派发与记录。
