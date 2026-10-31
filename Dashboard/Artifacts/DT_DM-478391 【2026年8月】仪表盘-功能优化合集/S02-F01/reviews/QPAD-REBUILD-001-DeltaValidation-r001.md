# QPAD-REBUILD-001 Delta Validation r001

## 双结论

- **候选 package verdict：`PASS_WITH_BOUNDS_FOR_QPAD_REBUILD_001`。** 首轮 finding `F-QPAD-VAL-001` 已在当前候选中修复并由新增反例和直接探针验证；保留六个冻结 identity，当前完整 runner 14/14 通过，定向 ESLint 通过。本结论仅限离线普通 Select 重建器及相应错误边界。
- **完整 Goal conformance verdict：`GOAL_OPEN / NOT_COMPLETE`。** DE-S02-F01 的10项 Goal AC、14项 F01 义务及 Q066/Q067 共16项产品义务仍完整、状态 pending；本次不是 F01/S02 验收、最终验证或 Goal 完成。

真实权限仍为 **`BLOCKED / NOT_RUN`**。只读用户禁止查看/复制/粘贴、权限撤销与恢复等验收未验证；没有用 standalone、admin 或 mock 代替。产品入口、保存重开、预览、跨组件兼容、参数/树/默认/单选/动态日期及运行时行为也不在本候选验证范围。

## 增量基线与修复复核

Delta Card digest `cd3e6f3a5daa0c9663b2c4bf1005a353180f3aea1d83466803b14aa02431eef7` 已由 `lane_task_card.py validate` 复算为 pass；Context Bootstrap 验证通过。Goal、冻结设计、fixtures 与首轮 Validation 报告摘要匹配 Delta Card 固定值；Goal digest 为 `f562da2e…c71daef0`，设计为 `4c21dbcc…b67cd4e5`，fixtures 为 `0b0bc78a…4e5edbf`，首轮报告为 `c6d29927…c14f0b50`。

对照首轮 `F-QPAD-VAL-001`：此前 `isIsoUtc` 只使用格式正则与 `Date.parse` 可解析性，导致 `2026-02-30T00:00:00.000Z` 被接受。当前 `query-ordinary-select-rebuild.ts:203-207` 在固定格式和有限解析结果基础上，还要求 `new Date(value).toISOString() === value`，从而拒绝会被日期规范化的输入。Runner 保留六个冻结测试，并新增 `reject-impossible-calendar-date` 与 `accept-valid-leap-day` 两项防御断言；没有改冻结 fixture 或其六项 oracle。

候选实现 SHA-256 为 `fb1da352181a36858fe1eeaaca80d2883063f7d8600dcafd5bc45bfd1bf91a7e`，runner 为 `4c708185bb969e7998149c536474c1c96c5603e7aaca6c19a9b018fae3b499ae`，fixture 仍为 `0b0bc78a…4e5edbf`，与本轮证据绑定值一致。复核了修复实现、完整 runner、修复证据及目标候选文件；修复只涉及日期验证与两项防御覆盖，未发现新的候选差异或新 finding。

## 独立验证

在 `core/core-frontend` 独立运行：

```text
node tests/filter-copy-query-reference/query-ordinary-select-rebuild.test.ts
```

结果：六个冻结 identity 加八项防御断言 `14/14 passed; 0 failed`，exit 0。随后对实现和 runner 执行定向 ESLint，exit 0。

另以内存 fixture 直接调用当前实现核验日期边界：

- `2026-02-30T00:00:00.000Z` → `{ ok: false, reason: "UNSUPPORTED_SHAPE" }`。
- `2024-02-29T00:00:00.000Z` → `ok: true`，并保留该合法闰日值。

修复 RED/GREEN 使用相同 runner SHA 与冻结 fixture SHA。持久 RED 摘要为 `0/14 passed; 14 failed`、exit 1，失败经可执行断言产生；持久 GREEN 为 `14/14 passed`、exit 0。独立复跑的 GREEN 与上述摘要一致。修复执行证据还记录定向 ESLint exit 0。此结论不将候选测试视为产品集成或权限证据。

## Goal 分母与未完成边界

重新核对 Goal ledger：共26条且状态均为 pending，其中 `AC-S02-01` 至 `AC-S02-10` 为10项 Goal AC；`AC-F01-Q004` 至 `AC-F01-Q015`、`AC-F01-ORIG-01/02`、`AC-F04-Q066/067` 为16项产品义务。没有删除、降级或替代任何原义务。本切片只对 AC-S02-02、AC-S02-03、AC-F04-Q066 和 AC-F04-Q067 提供有限的离线结构候选证据，不关闭这些条目或其他 Goal AC。

本报告是 Delta Card 唯一写出。未改实现、runner、fixtures、设计、旧报告、权限状态或其他状态台账。首轮日期 finding 在本候选范围内可关闭；Goal 仍开放，须继续其余实现、真实权限隔离验证、端到端验收、独立最终审查及 Stop Gate。
