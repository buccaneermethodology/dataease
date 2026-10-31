# PureGuard 后补负向控制计划 r002

状态：`CANDIDATE_FOR_INDEPENDENT_REVIEW`。本计划是 r001 的增量修订，处置独立审查 F-01/F-02；只处置 `PureGuardValidation-r001.md` 的 PV-01：历史 RED 缺少可复核的原始执行快照。不得改写或追认历史 RED，也不处理 PV-02 Builder 身份或 PV-03 准入时间问题。

## 目标与边界

在现有 frozen contract `PureSubcontracts-r002.json` 与 17 个 frozen Case identity 不变的前提下，为同一 `check.mjs` 增加一个仅测试进程可启用的故障注入开关。注入仅针对 `TC-Q004-01`，令 `chart → chart` 的兼容决策被替换为 `reject`，随后由原有的同一 frozen assertion 产生可定位失败。无开关的 GREEN 路径继续直接调用当前生产 `pure-guards.ts`。

它是一条审后 harness 敏感性负向控制：证明 runner 能捕获所指定的一种合同违反；不是生产实现的 RED，不证明其他 16 项断言均曾失败，也不构成完整 trusted RED/GREEN、独立 Validation、Goal AC 通过或产品验收。

## 冻结输入与输出

- 不修改 Goal、PureSubcontracts、Cases、生产模块或历史报告。
- 唯一源码写入目标：`core/core-frontend/tests/filter-copy-pure/check.mjs`。
- GREEN：在 `core/core-frontend` 工作目录先显式清除 `S02_PURE_GUARD_FAULT_INJECTION`，再运行 `node tests/filter-copy-pure/check.mjs`；应全部 17 个冻结 identity 通过。
- 负向控制：`S02_PURE_GUARD_FAULT_INJECTION=TC-Q004-01 node tests/filter-copy-pure/check.mjs`，应以 assertion failure 非零退出，stderr 明确包含 `TC-Q004-01`、expected `allow` 与 injected actual `reject`。未知注入值如 `S02_PURE_GUARD_FAULT_INJECTION=unknown-case node tests/filter-copy-pure/check.mjs` 必须以非零退出、报告无效值；不把该检查计入冻结合同 Case。
- 三次运行使用同一 runner、合同、Cases、生产模块及 17 个 identity；标准 GREEN 无注入，目标负向控制只在测试进程内替换一项导出函数结果，未知值路径应拒绝启动。故障路径不写生产文件，不经 UI、Store、网络或权限。
- 原始 stdout/stderr/exit code 固定保存至 `planning/evidence/PureGuardNegativeControl-{green,injected-failure,invalid-option}.{stdout,stderr,exitcode}.txt`；命令和输入摘要汇总至 `planning/evidence/PureGuardNegativeControl-r001.md`。这些是本 Session 的证据输出，不扩大源码写入范围。

## 完成判据与处置

保存三组 stdout/stderr/exit code、runner/模块/合同/Cases 摘要和独立复核。成功只关闭 PV-01 所述“无任何可复现 oracle 敏感性反例”这一证据缺口；PV-01 原历史 RED 缺证仍保留，PV-02/PV-03 和整体 Validation `PARTIAL` 维持，除非独立 Validator 明确给出增量结论。

Goal 原始 10 项 AC、26 项 must-have、16 项产品义务及 `Scope Delta: none` 不变；S01 F01 `CONDITIONAL`，真实权限环境及相关权限验收 `BLOCKED / NOT_RUN`。本计划不授权产品入口 Builder。
