# G2 普通 line 组件接线独立验证 r001

## 裁定

**结论：`PASS_WITH_BOUNDS`。** 当前普通 G2 line 的真实 SFC 控制流通过冻结组件合同：C01–C06 为 6/6 pass、0 assertion failure、0 execution error；R013 八项补充输入为 8/8 pass；真实 helper 的冻结 23-case 合同为 23/23 pass。定向 ESLint 通过。当前组件候选可作为普通 line 生命周期接线单元进入后续验证/集成流程。

结论仅覆盖普通 line SFC 的返回实例所有权、生命周期、清理错误、empty 输入与 legacy 隔离。它不等于真实 G2 浏览器验收、Copy/Paste MVP、query/Store 原子提交、权限验收、保存重开或完整 S02 Goal 完成。G2OWN-027 的 renderer/installer 返回句柄前 partial allocation 遗留仍开放；真实多用户权限环境仍为 `BLOCKED / NOT_RUN`。

本报告是该 Validation 交付物 r001；未重开 Design r003，也未修改 Goal、Design、Cases、生产代码、runner 或原始运行证据。

## 验证身份与输入

验证卡 `G2-OWNERSHIP-COMPONENT-VALIDATION-r001` 的 SHA-256 为 `beb8d5ee6718ee010bb13ebf71f112a8ac2999a51146df196069aac7c89dcc30`，`lane_task_card.py validate` 返回 pass。Context Bootstrap `G2-OWNERSHIP-COMPONENT-VALIDATION-r001` 校验退出码 0，17 项必读，`skipped_reads=[]`。卡片授权的唯一仓库写入目标为本报告。

| 绑定输入 | SHA-256 / 结果 |
| --- | --- |
| `Goal.final.json` | `28c94d3c35d4ce0a891ce77ecc915932d67f88ef813f3d2815dc0dce11f91b64` |
| Design r003 | `ab6aa597e06199bc947ff82f1b16f2955fe22e9e7210ac5bc2301e2b92295761` |
| Component Cases r003 原字节 | `b8844f51bed1f0574215210003ad1d59831c75635f9b0b6ed091baf3b78bbfe7` |
| 当前 `ChartComponentG2Plot.vue` | `f3bf70c99bf5bcf1ebbe56e5d1caa4bd94660927a1a1785f756859cd9317503c`；执行前后相同 |
| 当前真实 `g2-render-attempt.ts` | `7ff0a6d2ad931260241a4fc78970a99dc14f78c25bf71234f272a6fc837a90a2` |
| 当前 `component-check.mjs` | `4cf0933a2a6fed90df9146c010e656237367c9e763b4424a19197626c19e7e53` |
| Helper runner `check.mjs` | `0155a4e0e0a9dac40046c044b21410d4121b1177542604d48fb5e43a1d01d21f` |
| Component case canonical identity | `b12fff5f0142dab756ec8881f9b2e2dcdfe9fb36044f9553669955dafc811426` |

Component runner从磁盘读取真实 SFC 和真实 helper；使用 `@vue/compiler-sfc` 3.5.44 编译 SFC，以 Babel AST 锚定唯一 setup/return，仅在返回点前插入只读 snapshot getter，再以 esbuild 0.25.12 执行。实际 Vue 版本为 3.5.35。G2、API/Store、DOM、observer 与 timer 是具名 doubles；测试不复制 `renderG2`、不以源码字符串判通过，也不 mock helper。

## 运行结果

运行时间：2026-10-27 01:08 UTC 前完成本轮复验。命令均在 `core/core-frontend` 执行。

| 命令 | 结果 |
| --- | --- |
| `node tests/g2-render-ownership/component-check.mjs --mode green` | exit 0；SFC 编译成功；6 cases、6 pass、0 failures、0 execution errors；R013 8/8；`green_rule_satisfied=true` |
| `node tests/g2-render-ownership/check.mjs --mode green` | exit 0；真实生产 helper 被导入；23 cases、23 pass、0 failures、0 execution errors |
| `./node_modules/.bin/eslint src/views/chart/components/views/components/ChartComponentG2Plot.vue src/views/chart/components/views/components/g2-render-attempt.ts tests/g2-render-ownership/component-check.mjs` | exit 0，无输出 |

Component runner identities：实际编译 bundle `a60921e9b68d1b6317d2b54c8fa3b8ef43f7216f91d65fa963e9d8b995e37086`；helper 编译结果 `45cbac5b7facc88314fe911f47f8b2d64961107c2472cb34fe25af42d50c3c7e`；源码前后摘要相同。AST seam 为 1 个 setup 锚点和 1 个 return 锚点，变换只在 return 前插入 getter，保留原脚本字节顺序。

Helper runner 仍绑定 Cases r002 的原字节摘要 `f4348c739094943db73872ebc974d9b5048186d627c5022df2fa9c33d5fd2bba`；独立核对 Cases r002 与 r003 的 23 个 helper `cases` canonical 内容完全相同（23 条）。组件 runner 则直接消费 r003 原字节与 C01–C06。两条结果的合同 identity 因版本化文件不同而有别，未把该差异误报成实现失败。

## C01–C06 与 R013 核查

| 案例 | 观察与裁定 |
| --- | --- |
| C01：ready 前发布 | 旧实例 O 在替换时销毁一次；新实例 N 在 render/afterRender pending 期间 `myChart=null` 且未发布；ready 后 `myChart` 与 active scope 指向 N。通过。 |
| C02：autoRefresh 跨代 | O 的迟到 callback 未安装旧 assist、未 replay，也未触碰 N 的 cleanup。通过。 |
| C03：resize/unmount | queued resize 在卸载后没有 options/forceFit/replay；已开始的库 Promise 可 settle，但应用层不再操作/回放；两个 observer、timer 和队列均清理。通过。 |
| C04：unmount cleanup failure | `assist:O` 的 `cleanup-assist-O` 错误可观察；其余 cleanup、O destroy、resize/intersection observer disconnect、timer/queue 清理均继续。pending N 卸载后未发布并销毁。通过。 |
| C05：full-render 替换 cleanup failure | 同一 cleanup 错误恰好观察一次；O 的剩余清理与 destroy 继续，N 最终 ready，替换期间 observer 保持连接。通过。 |
| C06：empty/legacy 矩阵 | area、mix-dual-line、bidirectional-bar 仍调用 legacy draw 并正常结束，没有新 missing-instance 错误；line `[]` 跳过 draw；line 非空但 renderer 返回 undefined 时报告 `G2_RENDER_INSTANCE_MISSING` 且不发布。通过。 |

R013 的八项输入均经实际组件 `calcData → renderChart → drawChart` 测试边界传递：response.data 缺失、null、缺行字段、data.data 为 null/object/0/[]/[{value:1}]。前六种 malformed/missing 输入与非空 fixture 均进入原 renderer，并按冻结 oracle 对 undefined 返回报告 missing-instance；明确数组空值不调用 draw、不报错。全部 callback settle，八项通过。该证据证明组件接线对这些输入的控制流，不证明后端真实数据分布或真实 line renderer 在生产数据上的频率。

R014 的 VM realm 问题已经修复：component runner 执行 helper VM 时显式传入 host `Error` 构造器；C04/C05 的原 Error identity 均通过，没有放宽错误 oracle。C05 的计数显示 cleanup error 仅观察一次。

## 兼容边界、变更审查与差异

当前实现只将 `chart.type === 'line' && chartView.library === G2` 纳入 owned helper 路径。旧 G2 类型继续 legacy 分支；L7 路径未变。将当前 SFC 与 frozen prebuild baseline 中相同范围逐段比对：`calcData`（2503 字符）、`renderL7Plot`（1109 字符）、`renderL7`（513 字符）均完全一致。Component runner 的唯一代码差异是将 host `Error` 注入 helper VM，以消除测试 realm 制造的假错误；冻结 Cases、产品 oracle 与 helper source 未被本 Validation 修改。

历史 GREEN identity `G2OWN-COMPONENT-GREEN-r001.identity.json` 绑定旧 helper 摘要 `d31e006939b938594ea46d4258a4b87a43cd129cbe8732ae933f26a0a652f319`，与本次实际 helper 摘要 `7ff0a6d2...` 不同。因此历史运行记录不作为当前 helper 版本的验证凭据；本报告独立重跑已绑定当前 SFC、helper、runner 和 r003 Cases 摘要。旧日志和 identity 保留原样。

## 全部发现与未验证域

本轮未发现阻断当前有界组件合同的缺陷。R014 已由 runner 的 realm 注入修复并通过 C04/C05 验证；没有弱化 oracle。未将 helper 返回句柄前的 partial allocation、stage/query/Store 原子提交或权限验收等范围外义务记为本组件单元的新缺陷，也没有关闭它们。

已检查：冻结 Goal 与 claim ceiling、当前代码和证据摘要、SFC 实际 compile/执行、C01–C06 全量断言、R013 八项输入、helper 真实实现 23-case 合同、R014 错误身份、cleanup 顺序/错误继续清理、legacy 空态、L7/calcData 边界、runner 定向 lint、历史 helper 摘要漂移。

未检查及原因：

- 真实 G2/Tooltip/legend/browser 绘制未运行；本验证卡使用明确 doubles，证据范围是 SFC 生命周期控制流。
- Copy/Paste MVP、查询组件粘贴、保存重开、stage/query/Store 原子发布未执行；这些不属于此组件 Validation 的合同输入。
- 多用户权限、只读限制和撤权未执行；当前隔离权限环境及受限账号仍不可用，保留为 Goal 未验证项。
- G2OWN-027 的 renderer/adapter 在返回句柄前分配后失败的回收未验证；Design r003 明确将其留给后续 G2 stage owner。
- 全量产品 build、数据库及端到端验收未执行；不是本卡可用的证据，也未以本次 GREEN 替代。

本报告是执行验证证据，不是 Goal closeout 或 `GOAL_COMPLETE`。后续仍须按 S02 原始 AC/must-have/产品义务分母继续推进，并在相应层取得独立验证；不得以本组件 pass 提升完整 Goal 状态。
