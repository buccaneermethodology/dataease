# C2 普通刷新后逆序清理交接设计 r001

状态：设计候选，待独立语义审查；不构成实现准入或 AC 验收。

## Authority 与边界

本设计按当前 Goal `DE-S02-F01`（SHA-256 `4db931a6764a8c48345e7e8358e579550a9bc98594bf1654647716d72b9678c4`）执行：先完成界面 MVP，再补齐复杂场景，完整 38 项验收义务不删减。Stop Gate r207 的下一工作单元明确为本修复设计。C2 实现交付原三轮审查预算已用尽；本设计是新的窄修复设计交付物，不重开 C2 原 Review，也不据此重置原预算。

只处理终轮发现 C2V-005：成功采用地图候选、普通刷新产生新当前实例后，Vue child 先卸载销毁当前实例，稍后保留的原 handle 再 dispose，造成同一当前实例第二次收到 `destroy()`。逆序 `handle.dispose → unmount` 和未刷新对照已通过。范围限定在 `ChartComponentG2Plot.vue` 中组件卸载与候选 handle 对当前 `myChart` 的所有权交接。

不扩展通用异步取消、跨组件资源注册表、SDK/GPU 内部释放证明、地图功能、新权限路径或全图表资源治理；不修改 Goal、既有报告、冻结 317 条 runner 分母、地图类实现、tooltip 或 wrapper 发布契约。真实 SDK 崩溃/GPU 损害、真实浏览器中的独立卸载可达性仍未观察。

## 当前源码边界与不变量

`prepareFilterPaste` 的局部 `dispose` 受 `alive` 保护，并会销毁当前 `myChart`；普通刷新可以将当前实例从准备期实例替换为正常新实例。`onBeforeUnmount` 先设 `chartComponentUnmounted` 并释放准备期地图，但在普通新实例分支直接 `myChart?.destroy()`，没有同步清空当前引用。若卸载先于原 handle，后续 handle 仍可进入其首次 dispose 并再次销毁该引用。

修复必须维持以下不变量：

1. 对同一个当前图表实例，SFC 卸载和候选 handle 清理无论先后顺序，生产代码至多调用一次 `destroy()`。
2. 普通刷新前的旧实例与刷新后的当前实例身份分开；成功释放旧实例不能丢失、替换或提前销毁当前实例。
3. 重复 `unmount`/`handle.dispose` 不增加调用次数；两条清理入口间的第一次交接也必须幂等。
4. 释放当前引用须在调用外部 `destroy()` 前同步完成，以覆盖 destroy 抛错时第二入口不再重复尝试；异常传播/报告语义沿现有边界，不吞掉错误。
5. 不修改候选准备、metadata、查询、Store 发布、权限判断或已采用配置的事务行为。

## 候选实现方向

在组件局部提供“取出并释放当前实例”的单一操作：同步保存当前 `myChart`、先将 `myChart` 置空，再对保存实例调用 `destroy()`；候选 handle 的现有非 `activeG2Scope` 分支与 `onBeforeUnmount` 的现有非 `activeG2Scope` 分支共同调用它。继续保留各调用点当前的 timeout、ready bridge、G2 清理与异常处理顺序。若实现读取证明该操作会跨越 G2 或其它图表的既有所有权，必须收窄目标路径并更新设计，不可顺手推广。

该方向是待审查候选，不是预先批准的源码补丁。独立审查须检查 `myChart` 所有写入/替换点、destroy 错误通道、`activeG2Scope` 分支、卸载同步边界及所有调用者。

## 冻结测试与推进门槛

使用 `C2RefreshDisposalCases-r001.json` 的 28 项矩阵：7 个地图 fixture × 普通刷新前/后 × `unmount → handle.dispose` / `handle.dispose → unmount`。每例为独立加载；断言旧/新实例各自恰一次、重复清理不增计数、当前引用已清空、无额外业务副作用。保留未刷新和正序对照；预期 RED 指纹为刷新后的 `unmount → handle.dispose` 七项当前实例 `destroyCount=2`，不是执行错误。

设计审查 PASS 后才可冻结合同与案例身份，准备同一 runner identity 的真实组件模块 RED；可信 RED 接受后，按新的 exact source/test execution admission 实施最小修复。Builder 不得改写冻结合同或案例。GREEN 必须复用相同 28 案身份，再跑完整既有地图 317 基线、renderer、tooltip、paste 回归与定向 lint/类型检查；随后由非 Builder 独立验证完整差异和所有发现。C2 第 3/3 轮结论仍为 BLOCKED，只有新的修复交付获得独立验证，才可更新该有限 blocker 的处置；Goal 的 38 项仍须逐项完整验收。

## Claim ceiling 与未决项

当前可声明：源代码解释与待审设计候选。不可声明修复完成、C2 准入、49 类型通过、浏览器可达性已复现、SDK 内部资源安全或 Goal 完成。设计审查中若发现共享所有权边界不清，保留 blocker 并补证，不以更广泛抽象绕过。
