# S02 C2：稳定刷新后有限释放

权威合同：`Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/planning/C2RefreshDisposalCases-r003.json`（SHA `47c22e3cf68d2f26fd4902c781adf52d95a24f6cc118041f54fc7a23900811fa`）。原 AC-MVP-F01-11/12 的局部生命周期见证；完整38义务及49类型分母不减。

给定真实组件已完成一次prepare并采用，且本case要求的普通刷新已稳定完成，当前组件拥有已知wrapper；当调用handle.dispose与child unmount（两种顺序，含重复调用）；则在对外destroy入口前组件当前引用已经为null，同一主要SDK身份只按冻结合同释放一次，第二入口不重试，最终引用为空。

给定当前destroy入口同步抛固定同realm sentinel；当unmount先发生，则保留原cleanup告警一次，后handle不抛/不重试；当handle先发生，则原sentinel向调用者抛出，后unmount不再重试。active G2 scope按其原Error[]/告警通道运行，两顺序都不向handle外抛SDK sentinel。入口调用次数不是底层SDK/GPU释放成功证明。

见证由 `core/core-frontend/tests/c2-refresh-disposal/check.mjs` 执行50案：原28地图正常、14地图throw、8真实G2 bar legacy/line active。真实SFC/地图及scope控制路径，SDK/DOM/Store/provider有界double；getter只在harness内存变换中，产品expose不变。

Builder状态：同冻结案例可信RED 4/50通过、46语义失败、0执行错误；最小修复后GREEN 50/50、0语义/执行错误。独立验收见后续独立报告，不由此卡自行判定通过。原C2整包3/3 BLOCKED、新设计3/3历史及旧ubo不改；不宣称P1/Goal或完整0/49已提升。

未观察：真实浏览器/SDK/GPU、异步draw跨unmount晚到、strict桥主SDK throw、完整普通非paste生命周期、权限/保存与全类型覆盖。旧回归基线差异及原harness失败均保留在实施包，不把执行错误当RED。
