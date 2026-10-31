# PureGuard 后补负向控制计划独立语义审查 r003

## 最终裁定

- **Design Freeze Validity：PASS WITH FINDINGS（设计冻结有效，附非阻断项）**。计划范围、测试进程故障注入和证据边界均足够明确；PV-01 单例敏感性控制可执行。
- **Implementation Entry Readiness：PASS（可进入有界实现）**。准入仅限 `core/core-frontend/tests/filter-copy-pure/check.mjs` 及计划指定的三组原始证据输出和汇总报告。
- **Overall Verdict：PASS（通过）**。剩余问题仅为文件标题版本号仍落后一版，属于 P2 标识问题，不阻断该有界实现；本报告为第 3/3 轮，后续不再启动同计划的第 4 轮复审。

本轮只读；没有运行目标测试，没有修改计划、代码、合同、Cases、Goal 或既有 Validation。本报告为本轮唯一写入。

## Read Manifest 与输入校验

Context Bootstrap `ContextBootstrap-PureGuardNegativeControlDesignReview-r003.json` 的结构校验通过。required read set 共 12 项，文件均存在，实测 SHA-256 与 packet 中 revision 一致，包含计划 r003/r002/r001、两轮既有 Review、Goal.final、PureSubcontracts、Cases、既有 PureGuard Validation、runner、生产模块和 Topology r339。Lane Task Card `pure-guard-negative-control-design-review-card-r003.json` 校验通过，digest 为 `e15f31ba1968067df468c0e0be758d7d780bbd387f901d228f94779383b566d6`。未触发 conditional read。

已复核冻结 17 个 Case identity 及目标 `TC-Q004-01` 的 input/oracle。该 Case 输入为 `chart → chart`，冻结 expected 为 `allow`；当前 runner 直接调用生产 `decideCompatibility`，并用该 Case identity 作为断言定位。故障注入若严格按计划只替换此测试进程结果为 `reject`，能够通过同一 assertion 暴露这一项不匹配。此结论是静态语义审查，不表示三种命令已运行。

## 上轮问题处置

- **上一轮 F-03（GREEN 命令环境和工作目录）：已处理。** r003 明确从 `core/core-frontend` 工作目录执行，并要求 GREEN 前显式清除 `S02_PURE_GUARD_FAULT_INJECTION`。
- **上一轮 F-04（注入组命名）：已处理。** 输出命名使用 `injected-failure`，不再把注入失败命名为 `red`。
- **第一轮 F-01（未知注入值）：已处理。** `unknown-case` 必须非零退出、报告无效值且不计入冻结 Case。
- **第一轮 F-02（输出证据位置）：已处理。** 三组 stdout/stderr/exitcode 与汇总报告路径明确，作为执行证据，不扩大源码写入范围。

## 剩余发现

### F-05 — P2：r003 文件仍使用 r002 标题

- **依据：**当前文件名为 `PureGuardNegativeControlPlan-r003.md`，首行标题仍为“PureGuard 后补负向控制计划 r002”。r002 的上一轮 F-04 已指出标题版本应与文件身份一致；本次虽将旧标题从 r001 更新为 r002，但最新 r003 文件仍然落后一版。
- **影响：**单独引用标题时会把本轮冻结计划误认为上一版，降低版本追溯精度；内容正文与 r003 文件身份、ContextBootstrap digest 本身未漂移。
- **最小处置：**在后续普通文档维护中将首行改为“PureGuard 后补负向控制计划 r003”。不涉及合同、实现、Case 或本轮审查裁定，也不要求开启第 4 轮语义复审。
- **Disposition：**非阻断 P2 文档标识项；不影响本报告的有界实现准入。

## Boundary 与实现边界

r003 保持了上一轮确认的关键边界：后补控制只证明 runner 能捕获 `TC-Q004-01` 的这一种 oracle 不匹配；不追认历史可信 RED，不证明另外 16 项都曾失败，也不构成完整 trusted RED/GREEN、产品实现、Goal AC 通过或权限验收。PV-01 历史 RED 缺证继续保留；PV-02 Builder 身份及 PV-03 准入时间问题不由该计划处理。既有 Validation `PARTIAL_PASS / BLOCKED_FOR_PACKAGE_ACCEPTANCE`、S01 `CONDITIONAL`、真实权限验收 `BLOCKED / NOT_RUN` 与原 Goal 分母均不变。

实现/执行闭环仍限定为：同一 `check.mjs`、合同、Cases、生产模块和 17 个 identity；无注入 GREEN 直接调用生产函数；指定 Case 注入 `reject` 后复用原断言；未知非空值 fail closed。保存三种运行的 stdout、stderr、exit code 和输入摘要，由独立复核者检查最终差异与运行证据。产品入口、UI、Store、网络、权限、生产模块、Goal、合同、Cases 和历史 RED/Validation 均不在本次写入范围内。目标三种运行及其证据仍待实施阶段产生，本复审不报告其通过。

## 误读测试

| 可能的后续误用 | 缓解方式 |
| --- | --- |
| 将 `injected-failure` 文件登记成历史可信 RED | 汇总报告标明这是后补测试进程注入；PV-01 的历史 RED 缺证继续保留。 |
| GREEN 命令在工作目录错误或注入变量仍导出时被误当作无注入基线 | 按 `core/core-frontend` 执行并先清除变量，实际命令写入汇总报告。 |
| 把“单例敏感性控制通过”压缩成“PV-01 已关闭”或 Goal 完成 | 报告为后补敏感性证据，只影响 PV-01 的一个有限缺口；历史缺证、PV-02/PV-03、产品与权限验收状态保持原样。 |

## 术语与终态说明

可用于单行状态的表述：“PV-01 后补单例 harness 敏感性控制计划通过最终语义审查，可进入限定 runner 实现；未验证执行结果，历史 RED 缺证、PV-02/PV-03 与包验收阻塞仍在。”标题版本号残留仅为文档标识问题，不表示目标测试已完成。
