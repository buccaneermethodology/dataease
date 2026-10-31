# MVP 过滤复制粘贴：C1 三个真实 renderer

在 `core/core-frontend` 执行（复用已安装依赖，不安装）：

```sh
node tests/filter-copy-mvp-renderers/check.mjs --baseline --before
node tests/filter-copy-mvp-renderers/check.mjs
node tests/filter-copy-mvp-renderers/check.mjs --types
```

第一条消费 `c1-before-r001/manifest.json` 中三份冻结 SFC 并核对摘要，同一 runner 的五个旧入口故障案预期 exit1、5 个语义失败、0 执行错误。原 S2 不等待 render rejection，因此额外捕获一条预期未处理拒绝；这条记录是旧生产入口现象，不是装载失败。`--baseline` 只选择这五项，当前 source 不加 `--before` 时对应五项应全绿。第二条执行 24 项当前模块检查。第三条用真实 `compileScript`、项目 tsconfig、项目声明和 TypeScript semantic diagnostics 对照冻结前后三份 SFC；只限制新增诊断，不宣称完整项目类型检查通过。

runner 读取完整真实 SFC，真实 Vue 编译 script/template，真实 Vue 自定义 renderer/响应式/nextTick、真实 lodash、真实 BASE_VIEW_CONFIG 和已有 G2 ownership helper。它没有复制 prepare 或 render 方法；基线无 prepare 时调用现有真实 `renderChart`，成功装载后才注入 draw/render/afterRender 故障。图表库实例、DOM host、Store、emitter、API、格式化与样式转换为显式 provider doubles。非关键 Vue 子组件为局部空展示替身。

24 项覆盖：bar 与 owned line 的 G2 draw/render/afterRender；G2 迟到 draw 丢弃和已知实例释放；S2 render rejection、缺 layout 超时、layout/render 两种完成顺序及卸载取消；三组件正常/空 DTO；indicator 真实 Vue 渲染错误、6761 和空态文本；G2/S2 drill metadata、S2 general 页大小；同一 Vue host node 提升、effective canonical 输入后的真实模块重绘及 indicator 名称更新。候选全过程 query/Store/业务 emitter effects 必须为零。G2/S2 额外 active 重绘与第一次 prepare 的绘制计数分开，不冒充首次 paste 第二次绘制。

时钟：保留 S2 原 lodash 500ms 防抖；VM 中 G2 300ms timer 加速为 0ms，生产 10s prepare timeout 加速为 700ms，仍晚于防抖；S2 layout/render 顺序由独立 10ms 事件控制。DOM host 是连接/尺寸/文本替身，无浏览器排版。库 double 不证明真实 G2/S2 像素、库内部 tooltip/adapter 或全49类型行为。真实 query、wrapper 发布/dirty、权限、保存/离开/重开、undo/redo 和全部类型仍需集成与独立验收。

实施证据：`Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/MVP-20261027/evidence/SliceC1Renderers-r001.md`。
