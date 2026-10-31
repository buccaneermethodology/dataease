# QOBS ElSelectV2 标签刷新独立验证 r001

- 任务：`S02-QOBS-ASYNC-ELEMENT-LABEL-VALIDATION-r001`
- 验证者：独立 Validation（只读复核）
- 结论：`PASS_WITH_BOUNDS`（仅限本报告的窄组件行为）
- 写入范围：本报告；未修改源码、测试、fixtures、Goal 或已有证据。

## 复核范围与绑定

按验证卡和 Context Bootstrap 复核 Goal、Design r004、Product Adapter Fixtures r004、Element Rendering Fixtures r001、设计审查、Builder RED/GREEN 与浏览器原始记录。所核 SHA 与冻结绑定一致：Goal `f562da2e…daef0`、Design `f6a67022…c709`、Adapter fixtures `c6d226e2…1a1b4`、Element fixtures `7ed327f6…04845`、`Select.vue` `89281139…5a3d`、PA runner `38781dcf…1ba35`、Element 展示页 `2c649970…98fb7`。Required-read 摘要无漂移，Context Bootstrap 的 `skipped_reads` 为空。

## 独立验证结果

- **PA-001..005：通过。** 独立运行 `cd core/core-frontend && node tests/filter-copy-query-observation-component/check.mjs`，退出码 0，输出 `PASS PA-001..005 Vue lifecycle + deferred enum response + selected-label refresh/focus cases`。runner 编译并挂载实际 `Select.vue`，使用 Vue 3 renderer、可控异步响应与受控 `ElSelectV2` stub；核对选中值、请求次序、一次核对、无效/未核实状态、disabled 展示候选、焦点恢复与相关负例。此结果不等于真实 Element UI 集成或端到端验证。
- **实现 lint：通过。** `./node_modules/.bin/eslint src/custom-component/v-query/Select.vue` 退出码 0。既有证据还记录了本轮 locale 与 runner 的定向 ESLint 通过；本轮未改这些输入。
- **EL-001/002：在真实 Element 展示 harness 内通过。** 原始浏览器记录绑定本机 `element-plus-secondary` 1.2.16、Vue 3 与 DOM。invalid 和 unverified 两例均保持 `modelValue=C`，可见标签分别为“当前值不在可用选项中”和“当前值尚未核实”；禁用行仍可见，有限点击/键盘动作未将 C 作为新值选择，刷新后焦点恢复。观察到菜单关闭（`aria-expanded=false`）；真实 DOM 未提供 `role=listbox` / `role=option`。
- **PA/EL 对照：未见合同内阻断差异。** PA 的组件时序检查与 EL 的真实 Element 呈现检查互补：前者绑定产品 `Select.vue` 但以受控 UI stub 为边界，后者验证 Element 组件实际渲染及有限交互，但不是产品 `Select.vue` 集成。按冻结合同，两项各自只支持其窄结论。

## Findings 与证据边界

- **阻断 Finding：0。** 对 QOBS-ASYNC-01、PA-001..005 以及 EL-001/002 的本轮窄候选验证，没有发现要求 Builder 修复的合同内问题。
- **非阻断限制 N-01（可访问性）：** 菜单在刷新后收起，DOM 未提供 listbox/option role。仅记录为已观察限制；不声明屏幕阅读器完全兼容，也不在本任务扩大 a11y 修复范围。
- **非阻断限制 N-02（产品集成）：** 真实 Element 浏览器用例是独立展示 harness，不是 `Select.vue` 产品接线、真实 API、权限、复制/粘贴或保存重开验证。PA runner 的 `ElSelectV2` 是受控 stub，不能弥补该限制。
- **未验证：** 真实权限隔离、只读用户查看/复制/粘贴拒绝、权限撤销、持久化及保存重开均未运行。当前权限环境仍 `BLOCKED / NOT_RUN`；不得用 standalone/admin 代替真实授权行为。

## Goal 状态与结论

此验证不改变 S02 Goal 的 10 项 AC、26 项 must-have、16 项产品义务，不关闭任何完整产品链路。S01 仍在独立收尾，S01 状态不变。故本报告只支持窄候选 `PASS_WITH_BOUNDS`，不构成 F01/S02 通过或完成凭证；完整 Goal 仍须按其 Completion Predicate、独立验收与最终 Stop Gate 对账。
