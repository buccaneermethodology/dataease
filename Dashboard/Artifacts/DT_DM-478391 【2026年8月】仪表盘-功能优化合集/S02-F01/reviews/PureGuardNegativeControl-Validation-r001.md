# PureGuard 后补负向控制独立 Validation r001

## 裁定

`PASS_WITH_BOUNDS_FOR_ONE_POST_HOC_HARNESS_SENSITIVITY_CONTROL`。冻结上下文摘要全部匹配；当前 runner 的无注入 GREEN 与定向 ESLint 通过；指定故障注入由同一 `TC-Q004-01` 断言捕获，未知注入值被拒绝。此结论仅确认一项后补 harness 敏感性控制，不追认历史 RED，也不代表完整 Validation、AC-S02-07、产品或 Goal 通过。

## 独立复核

- Context Bootstrap required read set 10 项均存在，实测 SHA-256 与绑定 revision 一致：Goal `f562da2e…1daef0`、PureSubcontracts `eeec347d…3eb29ea`、Cases `484eaa5f…fcd2da`、r003计划 `4cfc94f5…f707e`、设计审查 `aa220ab6…eb44d`、既有 PureGuard Validation `eb599d7a…55b65`、原始执行摘要 `ee8fa5a8…42b7fa`、当前 runner `907fba4a…028f`、生产模块 `579bfafa…de844`、Topology `10d70ac2…187e9`。
- PureSubcontracts 固定 17 个唯一 identity，`TC-Q004-01` 在其中。当前 runner 将指定 Case 的进程内结果替换为 `reject`，但保留冻结 expected `allow`，复用相同断言；未知非空值在进入用例前抛错。实现不写生产源文件。
- 在 `core/core-frontend` 独立执行 `env -u S02_PURE_GUARD_FAULT_INJECTION node tests/filter-copy-pure/check.mjs`，exit 0，输出 `PASS: 17 bounded pure contract identities`。`./node_modules/.bin/eslint tests/filter-copy-pure/check.mjs` exit 0，无诊断。
- 分别以 `S02_PURE_GUARD_FAULT_INJECTION=TC-Q004-01` 和 `...=unknown-case` 在同目录重新运行，输出只捕获到 `/tmp`，未覆盖持久化原始快照。前者 exit 1，stderr 定位 `TC-Q004-01`，actual `reject` / expected `allow`；后者 exit 1，stderr 为 `unsupported fault injection case: unknown-case`。artifact 中原有三组输出摘要与 exit code 仍分别为 GREEN 0、injected-failure 1、invalid-option 1；持久化的两个负向 stderr 文件未被本次运行改写。
- 对 runner、计划及终轮审查执行范围内 `git diff --check` 无空白诊断；runner 当前是新文件，因此无 Git tracked diff 可对照。未修改该 runner、生产模块、合同、Cases、Goal 或原 Validation。

## 证据上限与未决项

这条控制只支持“runner 能捕获 `TC-Q004-01` 的这一种冻结断言不匹配，且拒绝未知注入参数”。它不证明其它 16 项曾经有过可信 RED，也不弥补历史执行快照和来源缺失。既有 `PureGuardValidation-r001.md` 中 PV-01 的历史 RED 缺证、PV-02 Builder 身份、PV-03 准入时序仍未解决；本报告不提升整体 Validation `PARTIAL_PASS / BLOCKED_FOR_PACKAGE_ACCEPTANCE`。

真实多用户权限环境目前不可用；只读用户限制、授权撤销及相关权限 AC 继续 `BLOCKED / NOT_RUN`，不以 standalone 替代权限实现。原 Goal 的验收分母与 Scope Delta 不变。r003 计划标题仍残留 r002 是已知 P2 元数据发现，不影响这项受限验证，但应在普通文档维护中修正。
