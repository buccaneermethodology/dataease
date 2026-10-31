# C2 稳定刷新后有限释放回归

本套是 Builder 自检，独立验收另行执行。原 C2 整包终轮 BLOCKED 和已用尽的设计三轮保留；不以新测试包重启整包验收，也不提升 P1、Goal 或完整49类型覆盖。

在 `core/core-frontend`、依赖已就绪时执行：

```sh
node tests/c2-refresh-disposal/check.mjs
./node_modules/.bin/eslint src/views/chart/components/views/components/ChartComponentG2Plot.vue tests/c2-refresh-disposal/check.mjs tests/c2-refresh-disposal/harness.mjs
```

合同直接读取 `Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/planning/C2RefreshDisposalCases-r003.json`，强校验 SHA `47c22e3cf68d2f26fd4902c781adf52d95a24f6cc118041f54fc7a23900811fa`，50个唯一 case ID。原28地图正常ID/计数、14地图throw、8真实G2 bar legacy/line active对照的期望均来自冻结合同，不由实现改写。

`harness.mjs` 复用原 maps runner 的 Vue 自定义 renderer/SDK provider 环境初稿，但在新文件独立维护；旧 runner 字节未改。磁盘实际 SFC 经真实 Vue compiler 编译 script/template，Babel AST唯一定位expose对象，仅在内存插入只读 myChart/activeG2Scope 等快照getter。实际 map 类、ready桥、L7 wrapper与G2 ownership helper沿真实模块分派执行；DOM、AntV SDK、API/Store及其它辅助设施是具名 doubles，不证明真实浏览器/SDK/GPU。

每案全新组件，实际prepare成功并activate；按case规定完成普通刷新且读回不同稳定current。旧strict主scene/plot、current wrapper入口与保存的SDK body分层计数；同步销毁入口采样同一SFC getter，内部layer/dot不计主SDK分母。throw seam先计入口、采样，再抛与模块同Error realm的同一sentinel，不delegate SDK body；因此入口1/body0不能称资源释放成功。G2先读回真实bar/line owner，active scope的dispose返回Error[]由外层wrapper只读记录，其余cleanup doubles不抛；错误按原handle/unmount通道保留。

写前原SFC得到可信 RED：50执行、4通过、46语义失败、0执行错误，原7重复计数反例全部出现；仅最小单SFC修复后，同一冻结runner/Cases得到50通过、0语义/执行错误。此前三次harness执行错误与第四次诊断运行，以及初次新文件lint失败均在实施包中原样保留，不能算可信RED。最终RED/GREEN使用同一runner摘要。

实施包：`Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/MVP-20261027/c2-refresh-disposal-r001/`。其中旧G2 component runner在写前和写后均因缺失map-ready module double无法装载，不能写成回归通过；其余结果、旧maps前后逐项对照与类型基线差异见BuildEvidence与ValidationHandoff。

范围不含draw跨卸载后才resolve、原ubo根因、真实child卸载可达性、strict主SDK throw、普通非paste完整生命周期、全部HTTP/Store/query行为、真实权限、保存/重开或49类型完整验收。query/Store发布与canonical view/element改变为本固定fixture观察0；不是全产品副作用证明。
