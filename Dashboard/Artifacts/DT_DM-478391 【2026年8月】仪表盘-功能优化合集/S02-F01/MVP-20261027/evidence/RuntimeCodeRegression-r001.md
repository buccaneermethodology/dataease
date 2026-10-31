# S02 MVP 代码级回归复验 r001

- 记录时间：2026-10-28T05:39:27Z
- 范围：复验当前 checkout 中 S02 MVP 生产代码与已存在的聚焦 runner；未修改产品源码、合同、fixture 或 runner。
- 当前 Goal：38 项（P1 12 + P2 原始 26）均仍为 pending；本报告不更新任何验收状态，也不是独立 Validation。

## 执行结果

| 命令 | 结果 | 证据上限 |
|---|---|---|
| `node tests/filter-copy-mvp/check.mjs` | PASS 14/14 | 真实候选 helper/composable/Editor SFC 编译；Provider、query/save 为替身/未验证。
| `node tests/filter-copy-mvp-api/check.mjs` | PASS 9/9 | 真实 API/decoder；网络 envelope 使用替身，未证明真实后端。
| `node tests/filter-copy-mvp-paste/check.mjs` | PASS 20/20 | 实际 wrapper/composable/SFC 接线；Store、API 与下层 renderer readiness 为替身。
| `node tests/filter-copy-mvp-renderers/check.mjs` | PASS 24/24；`--types` 新增 SFC 诊断 0 | 真实生产 SFC 受控宿主；图表库、浏览器布局为替身；非全项目类型检查。
| `node tests/filter-copy-mvp-maps/check.mjs` | PASS 317/317 | 当前地图类和局部资源协议受控测试；317 条不等于 49 个图表类型，也不证明真实 SDK。
| `node tests/filter-copy-mvp-picture/check.mjs` | PASS 4/4 | 真实图片 SFC/映射；图像解码、Store/API 为替身。
| `node tests/filter-copy-mvp-richtext/check.mjs` | PASS 43/43 | 真实富文本 SFC；TinyMCE 协议及后端为替身。
| `node tests/filter-copy-mvp-tooltip/check.mjs` | PASS 10/10 | tooltip/carousel 聚焦行为；浏览器真实渲染未证明。
| 定向 ESLint（本轮涉及 14 个 Vue/TS 文件） | exit 0 | 无自动修复。
| `git diff --check` | exit 0 | 当前工作区空白差异检查。
| `npm run ts:check` | exit 2 | 仅观察到 3 个 TS6504 `.vue.js` 输入错误：`DeRichTextViewV3.vue.js`、`views/pages/menu/system/watermark/index.vue.js`、`views/watermark/index.vue.js`；本轮没有基线前后差分，不将其归因于本次 MVP 改动。

## 真实运行缺口与后续

现有 [RuntimeUiProgress-r001.json](RuntimeUiProgress-r001.json) 仍记录 `per_type_runtime_pass_count=0` / `builtin_denominator=49`。真实 area 粘贴观察 [RuntimeAreaPasteFailure-r001.json](RuntimeAreaPasteFailure-r001.json) 显示已发出 1 次逻辑 `getData`，后端响应返回，但结果为 `paste_render_failed`，目标树保持原样；失败原因仍未知，不能计为通过。浏览器 console 的 Vue readonly `view` 警告没有可用调用栈，尚未证明与 area 失败有因果关系。

下一步应继续 P1：为上述 area failure 建立绑定当前Goal/源码/运行现场的精确诊断入口，定位真实 renderer 拒绝原因后再修复，并继续真实 UI eligible 类型 source/target、query/oracle、显式保存/离开/重开。P2 的真实权限、只读拒绝、撤权/恢复、query组件与复杂过滤仍是同一 Goal 的必要验收；测试桩和本报告都不能替代。

## 本轮输入文件摘要

| 路径 | SHA-256 |
|---|---|
| `core/core-frontend/src/views/chart/components/views/index.vue` | `dd88f2ac4f7c5e35f0b07822c72cae0764a3bad11be4a19f23a86d9fb9de3c7b` |
| `core/core-frontend/src/views/chart/components/views/components/FilterPasteRenderer.vue` | `1c6708ef48bfa466c2d167fba010183792815f2dc7926ff9d163c19abb9fa985` |
| `core/core-frontend/src/views/chart/components/views/components/ChartComponentG2Plot.vue` | `5ca0da498a294f82b3bb869dc2bcfa71a968b96f0b6ef98f9438cf150755daaa` |
| `core/core-frontend/src/views/chart/components/views/components/ChartComponentS2.vue` | `50d57d96d863d407e84a6516e958ce06cd8ef144899a05642a0a3343c41bb2f2` |
| `core/core-frontend/src/views/chart/components/editor/index.vue` | `0a9b782b8b72f3f6ac95148187d49e09a8d24f1610ea43b18e9e7002db06d5ee` |
| `core/core-frontend/src/views/chart/components/editor/filter/useChartFilterCopyMvp.ts` | `658027b89e327a6bfa65481f7fd5f43a19b048c15427cd16207f8048773204a8` |
| `core/core-frontend/src/api/chart.ts` | `9f160c78f24bf50be80c9510529682267530dcc28d203478074af4add865c74b` |
| `core/core-frontend/tests/filter-copy-mvp/check.mjs` | `9409e6388d9989b2476f0b0f679cad5d60247741e82af2d5932d542b899a6989` |
| `core/core-frontend/tests/filter-copy-mvp-api/check.mjs` | `68dbed66d3e09a25c21efda154f091760a5c9118ea1f4034153c356ccf10091e` |
| `core/core-frontend/tests/filter-copy-mvp-paste/check.mjs` | `868b41984942796d4a6092f88b016b9333034f0a9ef88e1f178a5dec783be69a` |
| `core/core-frontend/tests/filter-copy-mvp-renderers/check.mjs` | `7d00e3274b48c6629336c083bdb9029cd82bc2202ed89bf54f949f48ea59745f` |
| `core/core-frontend/tests/filter-copy-mvp-maps/check.mjs` | `c2d4d18c37e328faa0611d7ea0dee90a6117fcab29dcb957e96048b67a01522b` |
| `core/core-frontend/tests/filter-copy-mvp-picture/check.mjs` | `0ca8d94665c6e0ab35b6be8274f0470786c9fb8e06a8384167becc540da1fb15` |
| `core/core-frontend/tests/filter-copy-mvp-richtext/check.mjs` | `74da80178a432155030386f9830cea8d79b94b2283f08582e72122d121332e40` |
| `core/core-frontend/tests/filter-copy-mvp-tooltip/check.mjs` | `79545a2f255b07622c313b4237946a89bf0b87d08fa2522ef0b7a0375fbe7c65` |
