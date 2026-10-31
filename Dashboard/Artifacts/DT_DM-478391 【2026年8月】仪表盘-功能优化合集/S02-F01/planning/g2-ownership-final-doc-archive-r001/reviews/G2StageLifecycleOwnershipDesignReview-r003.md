# G2 渲染实例所有权设计独立评审 r003

## 双 verdict

- **Helper ownership 合同冻结：`VALID_WITH_CONDITIONS`。** r003 已具体定义返回实例的 ownership、显式 empty、stale/current 身份、cleanup 顺序、原错误保留及 cleanup 错误通道。r001/r002 的合同类 findings 已处置；23 个 helper case 数据与 r002 canonical 完全相同。可准备有界 helper 实现，但必须先修正下述 runner 返回通道 oracle、更新 runner 摘要、重跑精确 stub RED，并通过独立 RED Validation；之后还需新的精确 helper source admission。当前 RED candidate 本身不是该 Validator。
- **普通 line SFC 接线合同：`VALID_WITH_CONDITIONS`；当前组件 Builder `BLOCKED / NOT_READY`。** r003 把接线范围精确限于 `chart.type === 'line' && chartView.library === ChartLibraryType.G2`，并规定其它 G2 类型继续走 legacy 路径；C01–C06 有实际 SFC AST 只读观察 seam、交错时序和兼容矩阵的设计。当前 `component-check.mjs` 尚不存在，组件 RED 与独立 Validation 均未完成，因此不能开始真实组件接线。完成专用 harness、可信 baseline RED、独立验证和精确组件 admission 后，无须重开本交付物设计轮次。
- **完整 stage / 权限 / S02 Goal：`NOT_PROVEN`。** G2OWN-027 仍开放并归属后续 stage owner；本单元不证明部分分配清理、stage/query/Store 原子提交、Copy/Paste、真实权限、MVP 或 Goal 完成。原 Goal 的 10 AC、26 must-have、16 项产品义务及 `Scope Delta: none` 均未缩减。

## 审查基线与证据

本报告是 `S02-F01-G2-STAGE-LIFECYCLE-OWNERSHIP` 第 3/3 轮终审；不创建 r004。Lane Card SHA-256 `3b025b8748ff73dac336a8bba7d7e1cf5c4ca884beba7c93b8d605de7f09cfa7`，`lane_task_card.py validate` 为 pass。Context Bootstrap 指定 read-only profile、24 项必读、`skipped_reads=[]`；校验通过，唯一写入目标为本报告。

绑定输入：Design r003 SHA-256 `ab6aa597e06199bc947ff82f1b16f2955fe22e9e7210ac5bc2301e2b92295761`；Cases r003 SHA-256 `b8844f51bed1f0574215210003ad1d59831c75635f9b0b6ed091baf3b78bbfe7`；Goal SHA-256 `28c94d3c35d4ce0a891ce77ecc915932d67f88ef813f3d2815dc0dce11f91b64`。Cases r003 中 23 个 helper case 与 r002 的 data objects 按排序键 canonical JSON 完全相同，计算摘要均为 `cc85113d5c8bd395cc8773f8361f3a5b83fcec1d5cbc93751705c2507d273e80`；C01–C06 是单独的组件案例，不改变该 helper identity。

RED candidate identity 报告 23/23 helper cases 执行、23 个精确 `G2_RENDER_ATTEMPT_NOT_IMPLEMENTED` 合同断言失败、0 execution errors，首 fingerprint 为 `G2OWN-001: NOT_IMPLEMENTED`；stderr 为空、退出码为 1，符合候选 RED 规则。此证据只说明 stub RED candidate。r003 仍声明 `independent_validation: PENDING`；本 Review 不代替该 lane，也不把 RED 结果当作实现验证。

静态对照了实际 `ChartComponentG2Plot.vue` 的 render queue、full-render、autoRefresh、resize 和 unmount 路径，以及 line、area、mix-dual-line、bidirectional-bar renderer。未改动 Design、Cases、Goal、源码、runner 或 RED 日志。

## r001/r002 历史发现处置

| Finding | r003 处置与本轮判断 |
| --- | --- |
| R001 可信生产 RED 流程不唯一 | 已修复：固定生产 NOT_IMPLEMENTED stub、23 identities、命令、fingerprint 与 admission 边界。候选 RED 已落盘；独立 RED Validation 仍待完成。 |
| R002 Cases 未冻结且不可执行 | 已修复：helper cases 冻结，输入、顺序、实例/错误身份、cleanup、结果和 runner 引用可执行；r003 与 r002 canonical identity 一致。组件案例另列 C01–C06。 |
| R003 undefined 被折叠为空 | 已修复：helper 只接受显式 empty；普通 line 显式 `[]` 走 empty，非空 line 的意外 undefined 失败；其它 G2 undefined 保持 legacy。见 R013 的 missing-data 兼容边界。 |
| R004 async scope 与 resize/unmount 竞争 | 已修复于设计合同：固定 `{version, scope, instance}`，每个异步回调在操作前后检查身份；卸载使应用回调失效，不声称物理取消已进入库内的 Promise。C02/C03 覆盖相关交错。 |
| R005 adapter 安装 partial failure、R006 renderer return 前 partial allocation | 按用户授权记录为后续 `G2OWN-027` 遗留，由后续 G2 stage product implementation 负责，authority 为 CFPI-002。未宣称修复，不阻断仅管理已返回实例和已登记 disposer 的 helper 合同；继续阻断完整 stage failure cleanup。 |
| R007 自动 dispose cleanup errors 无出口 | 已修复于合同：ready/stale/empty 结果携带 errors，失败包装保留原错误与 cleanupErrors，自动清理通过唯一通知回调，手动 dispose 由调用者观察返回值。案例预期清理后继续执行。runner 对返回通道的检查不足，见 R012。 |
| R008 组件与实例资源 owner/顺序不清 | 已修复于设计：资源 owner 表区分 Vue 组件、container carousel、实例 scope、observers 和 legacy/L7，规定 replace/unmount 清理顺序与 finally disconnect。实际 SFC 行为尚未执行。 |
| R009 普通 line-only 与其它 G2 legacy 空态兼容 | 已修复于合同：仅普通 line 接入 owned scope；area、mix-dual-line、bidirectional-bar 等其它 G2 保持 legacy undefined 空态。C06 专门列出三类 legacy 样例。 |
| R010 SFC harness/身份与 deferred 时序不足 | 设计层已修复：指定实际 SFC 编译、AST 只读 getter、具名 doubles、真实 Vue 语义、O/N 身份与 deferred 编排；找不到唯一锚点即 execution error。Harness 尚未落盘，组件 RED 未观察，故当前不能准入组件 Builder。 |
| R011 full-render 替换 cleanup error 缺少观察 | 已修复于合同与 C05：要求旧资源错误恰一次可见、其余 cleanup/destroy 继续、新实例最终 ready，并确认替换不 disconnect observers、不重复通知。仍待组件 runner 执行。 |

## 本轮全量发现

### G2OWN-R012 / P1 / OPEN：helper runner 合并错误通道，无法分别验证冻结合同中的返回值

`core/core-frontend/tests/g2-render-ownership/check.mjs` 的 `observe()` 将错误身份累积到同一个 `observedCleanupErrors` 并去重；`assertOracle()` 只对该合并数组与 `cleanup_error_ids` 比较。它没有分别断言 `scope.dispose()`、`replaceCleanup()`/`removeCleanup()` 返回值、自动 dispose 的 `result.cleanupErrors`/`G2RenderAttemptFailure.cleanupErrors` 与 `onCleanupErrors` 回调。因而通知回调正确但返回数组为空，或 result/failure 丢失 cleanup error，仍可能通过 G2OWN-020/021/022/023 的聚合 oracle。当前 RED 只证明该 stub 会触发总体断言失败，不能证明 GREEN runner 能区分这些缺陷。

**处置及入口条件：** 这是冻结合同的验证器缺陷，不是合同含糊，也不要求改写 23 个 case identity 或重开设计轮次。先在 runner 增加逐通道断言并输出新摘要；在精确 runner admission 下重跑同一 helper stub RED，再由独立 Validator 验证新的 oracle，之后才可签发 helper source admission 和实现。不得把已有 23/23 RED 记为上述通道覆盖已经通过。

### G2OWN-R013 / P2 / OPEN：普通 line 的缺失/非数组数据与显式空数组需保留可区分证据

当前 `line.ts` 使用 `!chart.data?.data?.length` 返回 undefined，因此空数组之外，`data`、`data.data` 缺失或其他无 length 的值也会进入旧 renderer 的 undefined 返回。Design r003 只把 `Array.isArray(data.data) && length === 0` 映射成显式 empty，其余 line 输入继续调用 renderer，undefined 则成为 `G2_RENDER_INSTANCE_MISSING`。这条规则清楚，但改变了 renderer 以前对上述输入静默空态的处理。C06 仅覆盖 `[]`、非空数组+undefined，未覆盖 missing/null/non-array 的产品输入是否可能出现。

**处置及入口条件：** 保留该行为差异为显式 P2 风险，不扩展本次冻结 Cases，也不据此阻断独立 helper 实现。组件接线前，Builder/Validator 应从 `calcData` 实际调用路径确认这些输入是否可达；如可达，需在补充兼容验证中证明期望的错误或 empty 行为，且不得改写冻结 case identity。没有该证据时，不宣称 line SFC 兼容性验收完成。

## 已检查且通过的维度

- Ownership helper 范围限定为 create 已返回实例与显式登记的 cleanup；ready 前不发布，stale/error 会释放可见资源并保留主错误身份。
- 逆序 cleanup、幂等 dispose、重入 remove、key replacement、destroy/cleanup 失败后继续清理均有冻结 helper oracle。
- R009 范围没有把其它 G2 renderer 的合法 undefined 重新解释为异常；非 line 类型沿旧分支处理。
- SFC 设计没有靠源码字符串搜索或复制 `renderG2` 控制流认定通过；观察 getter 只读，测试仍驱动实际 `<script setup>`。
- `G2OWN-027` 具有稳定后续 owner/status，不把当前返回资源所有权实现错误升级为完整 stage 已完成。
- 真实权限缺失未被用于阻断无权限依赖的 helper；但也未降低或关闭 Goal 权限义务。

## 未检查项、边界和残余

- 未执行 helper GREEN；独立 RED Validation虽有独立 lane状态输入，但此 Review 不代替其结论。R012 要求修正 runner 并产生新的 RED/Validation evidence。
- `component-check.mjs` 当前不存在；未运行 C01–C06、真实 SFC 编译 harness 或组件 RED/GREEN。故 line SFC Builder 暂不准入。
- 未运行真实 G2 浏览器 line/area、tooltip、legend、assist、resize 或 full-render 替换；这些后续按独立 Vite/现有 CUA 路径验证，当前为 NOT_RUN。
- 未验证真实权限、只读用户禁止查看/复制/粘贴、权限撤销、query staging、Store atomic commit、双 host、完整 MVP 或完整 S02 Goal。权限环境仍 BLOCKED / NOT_RUN。
- `G2OWN-027` partial allocation 未修复；同步 cleanup 不等待异步 disposer，库内已开始的 forceFit Promise 不承诺物理取消。
- R013 的 missing/null/non-array line payload 是否由正式调用链产生尚未确认。

## 有界准入预测与后续

1. **Helper 合同：** 冻结有效。允许推进 runner oracle 修正这一独立准备动作；完成 R012 修复、精确 RED 重跑和独立 Validation 后，可基于新的精确 source admission 进入 helper Builder。Builder 不得修改 Cases r003 的 identity、合同或 `G2OWN-027` disposition。
2. **普通 line SFC：** Design/Case 结构足以作为实现输入，但当前缺实际 harness 和组件 RED。先按 r003 建立 `component-check.mjs`，证明 baseline 同一 SFC/runner/case 以 C01 fingerprint 失败，再经独立 Validation 与精确组件 admission 后进入接线。验证时补充 R013 输入可达性；R010/R011 的实际错误与观察行为必须在 C01–C06 上可观察。
3. **范围上限：** 即使 helper 与普通 line 行为通过，也只形成 returned-instance ownership 和普通 line SFC 接线的实现候选；不关闭 G2OWN-027、其它 G2 ownership、query/Store atomic commit、真实权限或 S02 完整 Goal。Goal 原始分母、MVP 后续验收义务均保留。

本 Review 为本交付物第 3/3 轮的最终评审记录，不开启第 4 轮。独立 Validator 可针对 R012 验证修正后的 runner，不构成本 Design 交付物新一轮评审。
