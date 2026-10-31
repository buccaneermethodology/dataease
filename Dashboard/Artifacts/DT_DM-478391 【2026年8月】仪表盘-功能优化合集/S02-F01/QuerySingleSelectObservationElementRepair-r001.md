# ElSelectV2 选中状态标签刷新修复设计 r001

## 目的与依据

在既有 QOBS-ASYNC-01 冻结语义下，使同一单选值 C 从可用状态更新为“无效/尚未核实”时，真实 `ElSelectV2` 的已选标签也同步更新。业务语义、支持域、枚举请求次数和权限范围均不变。

依据为 [adapter 设计与 fixtures r004](QuerySingleSelectObservationProductAdapterDesign-r004.md)、[独立审查 r004](reviews/QuerySingleSelectObservationProductAdapterDesignReview-r004.md) 和本轮真实浏览器复现。审查已把真实 Element 展示/a11y列为下一验证门槛；本修复仅响应选中标签在状态刷新时未更新的问题。

## 复现与有限实现

- 真实 Element 渲染器在未重建组件且 modelValue 仍为 C 时，会缓存旧的 selected label。浏览器测试中，无效到未核实切换后，选项行已有新标签，但已选显示仍是旧标签或裸 `C`。
- 在最终观察状态切换时，仅为普通单选 `ElSelectV2` 更新 key，触发其读取新 `options` 和 `modelValue`；若更新前输入框持有焦点，待 Vue 完成重建后对新控件恢复焦点。
- 状态刷新会关闭打开的下拉菜单；焦点恢复后控件保持关闭，避免把响应刷新误作用户选择或重新请求。交互与请求逻辑不变。

## 允许与禁止

写入仅限 `Select.vue` 与对应窄组件/浏览器测试。不得改枚举查询、配置保存、过滤器复制粘贴协议、权限实现或用户裁定语义。真实下拉菜单缺少 `role=listbox`/`role=option` 的观察作为既有 Element a11y 限制记录；本轮不声称屏幕阅读器全量符合。

## 验证与声明上限

浏览器验证必须使用项目已安装的真实 `element-plus-secondary`，检查 C 的无效/未核实标签、禁用项、键盘无法重新选择 C，以及刷新后输入焦点恢复。另以现有 Vue renderer 用例确保 adapter 的请求数、状态与旧响应保护不回退。该范围不证明真实 `Select.vue` 在应用全链路、权限、保存/重开或 Goal AC 上通过；修复仍需独立 Validation。
