# PureGuard 后补负向控制计划独立语义审查 r002

## 裁定

- **Design Freeze Validity：PASS WITH FINDINGS（设计冻结有效，附后续项）**。r002 已补齐 F-01 的未知非空开关运行检查和 F-02 的三组运行证据路径；敏感性控制仍限定在 PV-01 的单例 harness 控制。
- **Implementation Entry Readiness：PASS（可按计划进入有界实现）**。后续 Builder 可仅改 `core/core-frontend/tests/filter-copy-pure/check.mjs`，并写出计划列明的三组证据输出及汇总报告。
- **Overall Verdict：PASS（通过）**。仅有可在执行记录中直接消解的 P2 可复现性与标识清晰度建议，不构成准入阻断；Builder 仍限于 runner 与计划列明的三组证据输出。

审查类型：Boundary Review 与 Evolution / Implementation-Entry Review。只读；未运行目标测试，未修改计划、合同、Cases、Goal、runner、生产模块或历史 Validation。本报告为本轮唯一写入。

## Read Manifest 与身份绑定

Context Bootstrap `ContextBootstrap-PureGuardNegativeControlDesignReview-r002.json` 通过 `context_bootstrap.py validate`。required read set 的 10 个对象均存在，实际 SHA-256 与 packet revision 全部匹配：计划 r002 `ea73ec6a…fa445`、计划 r001 `2b95d391…909c`、上一轮报告 `d3d98a1c…167d`、Goal `f562da2e…aef0`、合同 `eeec347d…29ea`、Cases `484eaa5f…cd2da`、既有 Validation `eb599d7a…5b65`、runner `0dad1342…8af8`、生产模块 `579bfaf2…e844`、Topology r339 `13043634…7319f`。Semantic Review card `pure-guard-negative-control-design-review-card-r002.json` 校验通过，digest `69f7c9240c52d393d178944cc5cf1eda996b65f98db62b03b9d1dfd697ceb1b9`。

已核对全部 17 个 frozen Case identity、对应 Inputs/Expected/Oracle、当前 runner 断言分支和生产纯函数。目标 `TC-Q004-01` 的输入是 `chart → chart`、期望为 `allow`；当前 runner 的 Q004 循环直接调用生产 `decideCompatibility`，并以同一 Case ID 作断言消息。因此只对这一条身份的测试进程决策投影注入 `reject`，在结构上能触发同一断言。该判断是静态设计复核，不是运行结果。

## Boundary Review

r002 已修复上一轮两项：

- F-01：要求 `unknown-case` 运行以非零退出并报告无效值，且明确不计入 17 个冻结 Case。
- F-02：指定三组 stdout/stderr/exitcode 文件和汇总证据报告路径，并说明证据输出不扩大源码写入范围。

其余语义边界仍成立：

- 该控制只证明 runner 能捕获 `TC-Q004-01` 这一种 oracle 不匹配；它不是历史 RED 的恢复证据，也不是生产实现 RED、17 项全套敏感性证明或可信 RED/GREEN 配对。
- PV-01 历史可信 RED 缺证仍保留。PV-02 Builder 身份/委派问题与 PV-03 准入和执行记录时序问题不由此计划处理；原 Validation `PARTIAL_PASS / BLOCKED_FOR_PACKAGE_ACCEPTANCE` 不得被冲销。
- Goal 的 10 项 AC、26 项 must-have、16 项产品义务及 `Scope Delta: none` 不变。S01 F01 仍为 `CONDITIONAL`；真实多用户权限环境与只读/撤权验收继续 `BLOCKED / NOT_RUN`，standalone 不能替代。
- 无开关 GREEN 必须仍直接调用生产纯函数。注入只在 runner 测试进程中发生，且只能触及 `TC-Q004-01` 的一次决策投影。

### F-03 — P2：GREEN 命令未显式保证故障注入变量为空，工作目录也未写明

- **依据：**第 15 行给出裸命令 `node tests/filter-copy-pure/check.mjs`，第 16 行给出目标注入命令；但没有指定从 `core/core-frontend` 执行，也没有在 GREEN 命令中显式清除 `S02_PURE_GUARD_FAULT_INJECTION`。runner 会继承进程环境。
- **影响：**若调用方 shell 已导出该变量，所谓“标准 GREEN”可能仍处在注入状态；相对脚本路径也要求调用者猜测当前目录。这会降低两组对照运行可重复性。
- **最小处置：**在执行记录中注明工作目录 `core/core-frontend`，并明确 GREEN 运行前变量必须 unset；更稳妥的是用清除该变量的命令运行 GREEN，再分别设置目标值与 `unknown-case`。不需改合同、Cases 或生产源码。若 Builder 选择修订计划，保留可直接复制的完整命令。
- **Disposition：**非阻断的可复现性建议；实施前在命令记录中固定工作目录并清除变量即可，不改变准入与冻结 Case 分母。

### F-04 — P2：文件名中的 `red` 及标题版本号存在误读风险

- **依据：**文件名为 `PureGuardNegativeControlPlan-r002.md`，正文标题及状态描述却写“计划 r001”；同时注入运行的原始输出文件使用 `...-red...`。
- **影响：**证据文件名中的 `red` 可能被脱离汇总报告后理解为可信生产 RED；标题 `r001` 与 r002 文件身份不一致，也会降低引用精度。计划正文虽明确否认这些含义，但单行/文件名压缩后仍有歧义。
- **建议：**后续计划修订将标题与文件版本对齐；将注入组文件名标为 `injected-failure`，并在汇总报告继续声明其不是历史/生产 RED。若执行目录由本版计划冻结，重命名应在运行前同步计划与输出路径。
- **Disposition：**P2 非阻断的标识清晰度修正；实现可继续，但生成证据时应避免单独把文件名 `red` 当成状态结论。

## Evolution / Implementation-Entry Review

最小执行闭环保持简单：在 `check.mjs` 启动时严格解析开关；无注入运行生产函数，精确匹配 `TC-Q004-01` 时才注入 `reject`，未识别的非空值 fail closed；三种运行均由同一 runner、合同、Cases 和生产模块执行；保存完整原始输出、退出码及输入摘要；独立复核最终差异和日志。三组运行应分别证明：GREEN 全部 17 identity 通过；负向控制从原断言以非零退出且输出定位 expected `allow` / actual `reject`；未知值拒绝启动且非零退出。

允许范围仅为 `check.mjs` 与计划中列明的三组证据文件及汇总报告。禁止改生产 `pure-guards.ts`、Goal、合同、Cases、旧 RED/Validation；禁止接入 UI、Store、网络或权限路径；禁止将这次后补控制宣称为产品实现或权限验证。目标三次执行都尚未在本审查中运行。

## 误读测试与残余风险

| 可能的后续误用 | 缓解方式 |
| --- | --- |
| 只看输出文件名 `...-red...`，将其登记为可信 RED | 以 `injected-failure` 命名；汇总报告写明“测试进程注入”，历史 RED 缺证保持。 |
| GREEN shell 已导出故障注入变量，错误地把注入运行当成基线 | 固定工作目录并显式清除变量；记录实际命令与环境选择。 |
| Dashboard 压缩为“PV-01 已关闭”，读者误以为历史缺证解决 | 使用“后补单例断言敏感性证据已生成；历史 RED 仍缺证”之类完整状态，不用 `PV-01 closed`。 |

## 术语压缩检查

本报告不将负向控制称作 RED，也不把设计/计划通过称为产品验收或 Goal 完成。适合单行引用的表述是：“PV-01 后补单例 harness 敏感性控制计划可实施；未验证运行结果，历史 RED 缺证、PV-02/PV-03 和包验收阻塞仍在。”
