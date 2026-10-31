# 筛选粘贴 MVP：C1V-001 tooltip 修复检查

在 `core/core-frontend`、已有依赖可用时执行：

```sh
node tests/filter-copy-mvp-tooltip/check.mjs --before
node tests/filter-copy-mvp-tooltip/check.mjs
node tests/filter-copy-mvp-tooltip/check.mjs --types
```

`--before` 校验并读取 `MVP-20261027/c1-tooltip-before-r001/manifest.json` 冻结字节；预期 exit 1，8 项语义失败、1 项 legacy 成功、0 执行错误。当前版本预期 exit 0，10/10。active 同实例恢复项只适用于新实现，其余九项在前后两版使用相同检查身份。

检查加载完整真实 barUtil、common_antv、G2TooltipCarousel、新 interaction helper 与 utils/deepCopy 模块；VM 仅对 DOM/G2 宿主、布局测量、时间队列和不相关 provider 设置明确替身，没有提取/改写真实 listener 函数体。guard 经真实 deepCopy 两次与 spread 后交给 shared API；不是把 guard 直接放在未复制对象上即认定链路可用。

覆盖 candidate wrapper 局部挂载、tooltip show、axis label/title、discard 晚到、carousel enable、legacy hover/axis、active 后 discard 的已排定 axis timer 与 hover RAF，以及同一实例提升后 hover/axis 可用。预置旧 hover；快照检查 body 子节点、旧实例事件、document listener、外部 DOM style/attrs/dataset，候选本 container 内允许局部变化。旧 hover 自身初始 RAF 先排空，避免将合法旧任务误判为候选越界。

`--types` 使用当前 tsconfig、真实 TypeScript 及 Vue compileScript，将四个既有生产文件冻结前后语义诊断按 file/code/message 多重集对照，并检查新 helper 全量诊断。基线与当前均有既有诊断；84→84、新增 0 不能称全项目类型通过。

这是 Builder 自检。DOM、真实 G2/L7 SDK 渲染、真实浏览器导航、权限/数据库查询、保存重开、完整图表类型分母与独立 Validation 均未由本检查证明。
