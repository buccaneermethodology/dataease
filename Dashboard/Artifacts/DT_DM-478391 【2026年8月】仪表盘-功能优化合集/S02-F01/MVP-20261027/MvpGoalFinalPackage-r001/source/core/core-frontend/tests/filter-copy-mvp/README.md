# 图表过滤复制 MVP Slice A 聚焦验证

在 `core/core-frontend` 执行 `node tests/filter-copy-mvp/check.mjs`。依赖复用当前已安装的 Vue、esbuild 和 compiler-sfc，不安装依赖。

Runner 装载实际生产 `mvp-chart-filter-copy.ts`、`useChartFilterCopyMvp.ts` 和产品原生静态运算符目录，消费冻结的真实 DB 持久树。验证完整树及 own undefined、六 null 静态占位、无 timeValue 的持久树、整包拒绝与保留原 clip、原始数据集/字段 ID、deType、权限三态、DEV flag、精确 TTL 与编辑会话失效。

生命周期检查用真实 Vue custom renderer mount 实际 composable；user/cache/route/字段 API/图表能力为明确 provider doubles。覆盖目录异步未就绪、陈旧响应、图表切换、临时卸载、离开编辑与身份缓存失效。该段不证明真实登录、后端请求或权限行为。另编译完整真实 Editor SFC，检查新增入口与原过滤入口共存；实际 DOM 的 RED/GREEN 由独立浏览器 lane 记录。

Slice A 的粘贴准备端尚未接入，明确禁用，不发粘贴查询、不改目标树或 dirty，不提示粘贴成功。本 runner 不替代 B/C/D 的真实 query、候选预览、刷新、保存和重开验收，也不证明 49 个类型运行通过。
