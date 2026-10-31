# QOBS 真实 ElSelectV2 呈现复现与有限修复证据 r001

## 环境与用例

- 浏览器页面：`http://127.0.0.1:7071/tests/filter-copy-query-observation-component/element-rendering.html`
- 使用项目安装的 `element-plus-secondary` 1.2.16、真实 Vue 3 浏览器渲染与 DOM；未接后端/API。
- `EL-001/002`：modelValue 保持 C；响应将同值的选项标签从原始状态变为无效/未核实且置 disabled；检查选中标签、禁用类、有限键盘操作与焦点。

## 观察结果

- 无 key 更新：无效状态候选可见；后续未核实状态时真实选项行已变为“C — 当前值尚未核实”，已选展示仍为“C — 当前值不在可用选项中”。独立 DOM 读取确认 `modelValue=C`，该文本差异不是 props 未更新。
- 加入按观察标签状态重建 ElSelectV2，并在刷新后恢复原输入焦点：invalid 与 unverified 两例均显示对应标签；`disabled` 行保留；有限点击/键盘操作未把 C 作为新值选中；输入焦点恢复。
- 两次 PASS_WITH_BOUNDS 都观察到刷新后 `aria-expanded=false`：菜单关闭。真实 Element DOM 未提供 listbox/option role，渲染树将弹层标为 tooltip、选项为 listitem；完整屏幕阅读器兼容未通过/未测试，作为遗留限制，不隐去。

## 边界

这是浏览器中的 Element 组件候选证据与其修复机制试验，不是 `Select.vue` 修复后的集成验证、独立 Validation、权限测试、保存测试或 S02 完成证据。产品改动后的真实组件接线仍须定向复验；目标 Goal 10项 AC、26项 must-have、16项产品义务保持未关闭，真实权限验收继续 `BLOCKED / NOT_RUN`。
