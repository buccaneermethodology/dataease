# PureGuard 后补负向控制计划独立语义审查 r001

## 裁定

- **Design Freeze Validity：PASS WITH FINDINGS（设计冻结有效，附后续项）**。PV-01 后补控制的范围和声明上限清楚；可以保留 frozen contract 与 17 个 Case identity，不追认历史 RED，也不替代完整 Validation 或产品验收。
- **Implementation Entry Readiness：PASS（可按计划进入有界实现）**。Builder 可直接修改唯一指定的 `check.mjs`，实现严格单值注入、逐项断言和无开关 GREEN；无须重设计。
- **Overall Verdict：PASS WITH P1 FOLLOW-UP（通过并带 P1 后续项）**。只准进入此负向控制，不得据此解除 PV-01 历史 RED 缺证、PV-02、PV-03 或 `PARTIAL_PASS / BLOCKED_FOR_PACKAGE_ACCEPTANCE`。

审查类型：Boundary Review 与 Evolution / Implementation-Entry Review。只读审查；未运行测试、未修改计划/合同/Cases/生产模块/runner。本文件为本次审查唯一写入。

## 读取与身份绑定

审查对象为 `PureGuardNegativeControlPlan-r001.md`，并对照 `PureGuardValidation-r001.md`、`PureGuardRedGreen-r001.md`、`PureSubcontracts-r002.json`、`Cases.candidate.json`、`check.mjs`、生产 `pure-guards.ts` 及 Context Bootstrap。已记录的输入摘要：计划 `2b95d391…909c`、Goal `f562da2e…aef0`、合同 `eeec347d…29ea`、Cases `484eaa5f…cd2da`、既有 Validation `eb599d7a…55b65`、runner `0dad1342…8af8`、生产模块 `579bfaf2…e844`、Topology r339 `13043634…319f`。启动 Context SHA-256 为 `395522b6…cad06`；Lane Task Card digest 为 `92ed1be9…7740e`。上述摘要为既有启动上下文所记录，未在本次审查中重新执行哈希命令。

## 边界审查

计划把故障注入限定在 `TC-Q004-01`：该冻结用例的输入是 `chart → chart`，oracle 是 `allow`。当前 runner 对 Q004 identity 调用生产 `decideCompatibility`，再以该 identity 的冻结 expected 比较决策值。因此，在该 identity 的实际值进入同一断言前，仅将该次测试进程结果替换为 `reject`，可以形成可定位的 expected `allow` / actual `reject` 失败；不必改动生产模块或其余 16 项。该结论是对计划与现有代码结构的静态审查，不是负向控制已执行的证据。

以下边界保持有效：

- 控制只说明该 runner 的这一条冻结断言对这一种不匹配会失败；它不能证明历史 RED 的内容、时间、角色或原始日志。
- GREEN 仍须由无注入开关的 runner 直接调用生产模块；RED 控制不能被表述成生产实现的 RED、17 项全覆盖敏感性证明或可信 RED/GREEN 配对。
- Goal 的原始 AC/must-have/产品义务及 `Scope Delta: none` 不变。权限真实多用户验证继续 `BLOCKED / NOT_RUN`，standalone admin 不构成替代证据。
- PV-02 Builder 身份证据和 PV-03 准入/执行时序矛盾仍属独立问题；本计划没有权限关闭它们。

未发现授权、状态轴、范围分母或声明上限上的阻断性语义缺陷。最小安全切片为：在 runner 启动时解析开关并对非空未知值 fail closed；只对目标 identity 调用生产函数后注入决策；复用原冻结 assertion；分别保存无开关 GREEN 与指定注入失败的输出及退出码；随后独立复核输出并维持原 Validation 边界。其余 identity、生产源码和产品入口均不得改动。

## 发现与处置

### F-01 — P1 后续项：fail-closed 约束需要独立的负向验收证据

- **依据：**计划要求未知注入值 fail closed，但完成判据只列出标准 GREEN 和 `TC-Q004-01` 注入失败两次运行。
- **影响：**若实现把未知值当作“无注入”，不恰当的调用仍可能得到绿色结果；仅检查源码不能证明该运行时行为。
- **建议：**在同一 Builder 切片中以一个未知非空值再运行一次，确认非零退出并明确报告无效选择；记录该退出结果。此检查是验证计划已声明的不变量，不增加 frozen identity、不改合同、不触及产品范围。
- **Disposition：**作为实现/复核的必须后续项，不阻止已冻结的有界实现入口；不得将其计入 17 个合同 Case。

### F-02 — P2：运行证据持久化位置未命名

- **依据：**计划要求保存 GREEN/负向控制 stdout、stderr、退出码及输入摘要，但只点名唯一源码写入目标 `check.mjs`，没有为输出证据指定路径或载体。
- **影响：**执行结果可能只留在临时终端输出中，之后无法按完成判据复核；也可能被误写为新增源码/合同输入。
- **建议：**执行时将两组输出和第三项未知值检查记录在本次执行报告或该 Session 的证据目录中，标注命令、退出码、runner/模块/合同/Cases 摘要及其“审后负向控制”性质；不得改写历史 RED 报告。若严格遵守源码唯一写入目标，则日志/报告作为证据输出单独定位，不改其它源码。
- **Disposition：**记录为实现交接的可修复项；不改变源码写入边界。

## Evolution / 实施入口

后续 Builder 可在一个小改动内实现：

1. 读取 `S02_PURE_GUARD_FAULT_INJECTION`；未设置/空值表示正常 GREEN，唯一有效值为 `TC-Q004-01`，其它非空值立即 fail closed。
2. 保持生产模块 bundle 与全部 frozen identity 检查不变；只在 Q004 循环中匹配该精确 identity，并在原断言前将本次决策投影替换为 `reject`。其它 identity 必须仍使用生产函数原结果。
3. 运行并保存标准 GREEN、目标负向控制、未知开关值三种结果；确认负向控制 stderr 能定位该 Case，显示 expected `allow` / actual `reject`，且两种无效状态以非零退出结束。
4. 由独立复核者只审运行证据和最终差异，确认合同/Cases/生产模块与 17 个 identity 摘要未变，再以增量证据记录 PV-01 的有限进展；不重写既有 Validation 或历史 RED。

明确禁止：将开关导入产品代码、修改任何冻结 expected、把注入失败称作生产 RED、扩大到其他 Cases、借此宣称可信 RED/GREEN、解除权限阻塞或关闭 Goal。

## 误读测试与风险场景

| 未来误用场景 | 缓解方式 |
| --- | --- |
| Dashboard 只显示“PV-01 resolved”，读者据此认定历史 RED 已恢复 | 状态写为“后补 harness 敏感性控制通过；历史 RED 原始证据仍缺失”；保留旧 Validation 结论并单独给增量证据。 |
| Builder 把任何非空开关静默忽略，之后把 GREEN 当作注入控制通过 | 未知值必须 fail closed，并实际验证一个未知值非零退出；只接受精确 Case ID。 |
| 将 `reject !== allow` 的注入断言失败解释成生产实现缺陷或 17 项全套 RED | 报告标注该错误来自测试进程故障注入，声明只覆盖 `TC-Q004-01` 的 assertion sensitivity。 |

## 术语压缩检查

本报告标题和裁定未使用 `done`、`complete`、`closed`、`ready` 等暗示 Goal/产品完成的状态。若未来 Dashboard 仅保留单行，应使用“PV-01 后补单例断言敏感性控制；历史 RED 缺证、PV-02/PV-03 和包验收阻塞仍在”，避免缩写成“PV-01 closed”。
