# QPAD-REBUILD-001 独立验证 r001

## 双结论

- **候选 package verdict：`FINDING_OPEN / NOT_ACCEPTED`。** 普通 Select 离线候选与冻结六个 identity 的主 oracle、六项防御断言和定向 lint 可复现通过；但发现 `isIsoUtc` 接受不可能的日历日期，与设计规定的严格 ISO UTC 输入边界不符。该 finding 未由 Validator 修复，候选暂不建议接纳。
- **Goal conformance verdict：`GOAL_OPEN / NOT_COMPLETE`。** Goal 的10项 Goal AC、14项 F01 义务及 Q066/Q067 共16项产品义务全部保留，仍为待完成；本切片不满足 S02 完成谓词，也不代表完整 F01。

本次最多证明普通 Select 离线重建纯函数的有限结构和错误路径。没有验证产品入口/UI/Store/网络、真实来源版本、权限、保存重开、预览、树/参数/默认值/单选/动态日期或其他查询类别。真实权限验收保持 **`BLOCKED / NOT_RUN`**；未用 standalone、admin 或 mock 代替。

## Authority、分母与冻结基线

复核了 `Goal.final.json`、阅读版 `LoopGoal_Final_r001.md`、原始 `DataEase_S02_F01_Loop_Goal_Draft_r001.md`、`F01SliceContract.md` 及 `QueryProductAdapterDesign-r003.md`。Goal digest 与 Validation Card 固定摘要相同：`f562da2e…c71daef0`；设计摘要 `4c21dbcc…b67cd4e5`；fixtures 摘要 `0b0bc78a…4e5edbf`。核心依据的当前 SHA-256 与冻结值一致。

Goal ledger 共26条且状态仍为 pending：

- Goal AC：`AC-S02-01` 至 `AC-S02-10`（10项）。
- 产品义务：`AC-F01-Q004` 至 `AC-F01-Q015`（12项）、`AC-F01-ORIG-01`、`AC-F01-ORIG-02`、`AC-F04-Q066`、`AC-F04-Q067`（合计16项）。

冻结设计明确这是 `displayType='0'`、多选、无默认/required、VARCHAR/deType=0、无参数/活动日期/树等输入的有限离线切片；不接产品入口，不调用 QPIPE/元数据服务，不将引用计划作为权限凭证。Fixtures 含完整源、计划、目录、完整成功输出和六个固定 identity：001 成功；002 超域默认状态；003 未知字段；004 计划字段错配；005 目标字段缺失；006 错误优先级。设计审查结论仅是该窄域 `PASS_WITH_BOUNDS_FOR_QPAD_REBUILD_001`，不能外推为完整产品设计冻结。

## Builder 准入、证据与复跑

检查了 Builder Card、Builder Context、execution admission、准入绑定的拓扑 r045、验证 Card/Context、r003 设计审查及 Builder 执行证据。Builder admission 的 Goal、Completion Contract、Context、review、topology digest 和 target 与卡记录一致；执行证据所列实现和 runner 摘要与当前文件一致。

当前 runner 在 `core/core-frontend` 执行：

```text
node tests/filter-copy-query-reference/query-ordinary-select-rebuild.test.ts
```

独立复跑结果为六个冻结 identity 和六项防御断言共 `12/12 passed`、exit 0。输出的 runner SHA-256 为 `c13e8db5…ab432f90`，fixture 为 `0b0bc78a…4e5edbf`，实现为 `b41eb530…d4af056b`，均与当前文件及冻结/证据摘要相符。测试检查完整结果、失败 reason、输入不变、成功输出脱离源对象，以及冻结输入、ID 重用、级联错绑、同目标字段冲突、非 JSON 和错误优先级。

定向 ESLint 命令 `./node_modules/.bin/eslint src/custom-component/filter-copy/query-ordinary-select-rebuild.ts tests/filter-copy-query-reference/query-ordinary-select-rebuild.test.ts` exit 0。全量 `npm run ts:check` 的 Builder 记录为未通过，诊断是三个既有 `.vue.js` 文件触发 TS6504（未启用 `allowJs`）；这不是候选通过证据。Validator 本轮没有重跑全量 TypeScript 检查。

可信 RED 以只读方式核对持久 stdout/stderr/exit code 与最终 runner。日志显示 runner SHA 和 fixture SHA 与 GREEN 一致；缺实现分支返回 `UNIMPLEMENTED` 后，在六个冻结 case 和六个防御断言处出现断言失败，最终 `0/12 passed; 12 failed`、exit 1，而非模块解析失败。当前 runner 源码明确缺少实现时使用可执行占位结果。Validator 未移除或覆盖当前实现来重新制造 RED，因为这会违反只读验证范围。

## Finding

**F-QPAD-VAL-001 · P2 · 严格 UTC 日历日期校验不完整 · OPEN**

- **依据：** `query-ordinary-select-rebuild.ts:203-206` 的 `isIsoUtc` 先检查固定格式正则，再以 `Date.parse(value)` 是否为 NaN 判定。JavaScript 会规范化部分越界日历日；Validator 以内存 fixture 探针将 `arbitraryTime` 改成 `2026-02-30T00:00:00.000Z` 调用当前候选，结果为 `ok: true`。格式看似 ISO，但该日期并不存在。
- **影响：** 输入若包含格式正确但日历无效的日期，候选会继续构造输出，而非按有限合同拒绝；六个冻结 identity 均未覆盖该边界。
- **建议：** Builder 应在不改冻结六项 oracle 的前提下增加严格日历校验及回归断言，再以同 runner 重跑。此报告不代修。
- **处置：** 未修复；候选不接纳，交 Builder 修复后重新独立验证。

## 当前差异与边界

审查了本候选两个新增文件的完整内容、冻结 fixtures、候选对源码入口的引用情况、当前 tracked diff 清单及 `git diff --check`（通过）。未发现源码或其他模块引用该函数，符合“不接产品入口”的切片界线。当前 tracked diff 主要是7份 Dashboard/S02 台账变动；工作树还含大量其他未跟踪 S02 设计/证据文件，以及 QPIPE、级联身份、schema projection、目标映射和树关系等其他候选源码/测试。它们不属于本验证候选，本报告不替这些并行切片作验证结论，也不将整个工作树对账表述为已完成。

本报告是本卡唯一写出。未修改实现、测试、fixtures、设计、admission、Goal 或其他 Dashboard 台账。独立验证仅形成候选问题记录，不构成 S02 final validation、最终 Stop Gate、权限验证或 Goal 完成凭证。
