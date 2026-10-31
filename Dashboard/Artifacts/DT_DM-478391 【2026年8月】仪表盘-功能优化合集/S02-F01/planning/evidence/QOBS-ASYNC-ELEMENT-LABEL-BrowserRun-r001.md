# QOBS ElSelectV2 浏览器运行原始观察 r001

- 日期：2026-10-18（本轮恢复执行；本地 Vite 测试服务端口 7071）。
- 地址：`http://127.0.0.1:7071/tests/filter-copy-query-observation-component/element-rendering.html`。
- 依赖：本机已安装 `element-plus-secondary` 1.2.16；使用真实 Vue 3 浏览器渲染，无后端/API。
- 页面 `#result` 返回 `PASS_WITH_BOUNDS`，EL-001 invalid 与 EL-002 unverified 两例均观测到：C 标签可见、`role=combobox`、`aria-haspopup=listbox`、刷新后输入焦点恢复、禁用行 class 存在、有限点击与键盘不会把 C 作为新值选中。
- 两例刷新后 `aria-expanded=false`；DOM 未提供 `role=listbox` / `role=option`。这是当前实现的可观察限制，不据此声明屏幕阅读器兼容。
- 本记录绑定的是 Element 独立展示页，不是 `Select.vue` 的产品接线验证，也不是独立 Validation；保留只读用户限制、撤权、保存重开、完整 F01/S02 均未验证。
