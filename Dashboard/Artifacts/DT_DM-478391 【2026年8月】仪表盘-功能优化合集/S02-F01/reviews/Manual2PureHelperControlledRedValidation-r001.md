# Manual2 纯 Helper Controlled RED 独立验证 r001

**局部 verdict：pass-with-findings（受控失败注入证据核对通过，历史 RED 限制仍在）**。指定 Card 与 Context 校验通过，15/15 required-read 摘要一致。新附件内的 stdout、stderr、退出码及摘要与同一冻结 runner 的显式 `MANUAL2_PURE_FORCE_UNIMPLEMENTED=1` 控制分支相符；正确 Builder admission 和 Topology r261 也指向该附件。此实验是当前 runner 的受控失败注入，使用的 helper 文件真实存在；它不是历史 source-missing RED，不能关闭前次历史 RED 原始 stdout/退出码缺失 finding，也不证明产品、权限或 Goal 通过。

## 验证身份与读集

- Card canonical SHA-256 `c4e5b0672c04e3a9ec897cbfc82b5e47b51e1bb403cd49b54f21ff0b454a9d3a`：Card validate 通过；render 输出的任务范围是只读核实 controlled RED evidence、runner/source、冻结合同和 admission。
- Context Bootstrap validate 通过。15 项 required-read revisions 全部匹配，未发现 drift。
- 只写入本报告，符合 Card 中唯一 `write_scope`。未修改输入、源码、runner、合同、Evidence、旧 Validation 或其他 Dashboard 文件。

## Evidence 核对

受控失败注入附件 `planning/evidence/Manual2PureHelperControlledRedEvidence-r001.md` SHA-256 为 `6fe3ebdb1f7d27ae05d5216ba235f0480f429d7c7f44cc15786e117487d767ae`，与 Context 和 `Topology-actual-r261.json` 的摘要一致。附件明确绑定：

- Goal SHA `f562da2eb14b84dc8083e138dd2eb8718a58041f01d08163eddf5fb2c71daef0`；冻结 Cases SHA `5497a5b8fff2761b52b0035ba7a4f9c531cfdceb3e23be622f89294c89e729a1`；Contract SHA `4b930a4461fa5e91de1d57bf77b21d496705f1d909a4c22991c293976b214863`。
- Runner SHA `ed61301c2a932437a4cf426f639323d96b5f11c05c5dcdb4334b2c8083b1a151`；helper SHA `8b2b892de636e59e0ca0ba3c7e7e752cb9edb1027244d28bfb4597fa25bcef23`。
- 命令 `MANUAL2_PURE_FORCE_UNIMPLEMENTED=1 node tests/filter-copy-query-reference/query-single-select-manual2-pure.test.ts`，工作目录 `core/core-frontend`；退出码 1。
- stdout/stderr 均嵌入附件。stdout 给出 `contract_valid=true`、28 个冻结 IDs、`behavior_checks=33`、`behavior_failures=33`。stderr 包含 Node 模块类型 warning 以及全部 33 项的 `UNIMPLEMENTED` 与冻结 oracle 差异。

Runner 当前源码明确将 `MANUAL2_PURE_FORCE_UNIMPLEMENTED === '1'` 映射到 `{ status: 'UNIMPLEMENTED', carrier: null, runtime: null }`，而无该 flag 且 source 存在时才加载 helper。故本次注入确实制造了预期失败；runner 仍报告 source 文件 `exists=true`、指纹为上述 helper SHA、状态 `LOADED`。我按 Evidence 中命令独立重跑，退出码 1，观察到相同 28 case identity、33 行为失败、source fingerprint、输出结构和错误差异；Node 警告中的进程号按运行变化，其余输出结构与附件记录一致。

对应 `execution-admission-manual2-pure-helper-controlled-red-r001.json` 的确定性 admission 校验通过：`action=builder`，target 精确指向上述 Evidence 文件；Goal、Cases、Context、Design Review 与 Topology r260 摘要一致。没有把 validation action 当作 Builder action。`Topology-actual-r261.json` 的执行身份、状态、结果及 Evidence/Admission/Card/Context 摘要与读到的文件一致。

## 历史 RED 与范围边界

受控 run 设置强制失败 flag，但 helper 文件存在且由当前 runner 记录为 LOADED。历史 source-missing RED 则要求 runner 在 helper 文件不存在时运行；两者不是同一次执行，也不能互相替代。当前 Evidence 已明确声明这一点，未把该控制注入称为历史原始日志。

**前次“历史 source-missing RED stdout/退出码未保存”限制仍未关闭。** 本 lane 核验的是新控制实验的输出与摘要准确性，不重建也不冒充历史日志。Goal 原分母仍为 10 AC / 26 must-have / 16 产品义务，`Scope Delta: none`；产品义务 `NOT_RUN`，真实权限 `BLOCKED/NOT_RUN`。

## Verdict

**pass-with-findings（仅限本 lane）**：Controlled failure-injection evidence 的命令、环境 flag、case IDs、stdout/stderr、exit code、Contract/Runner/Helper 摘要、Builder admission 与 Topology r261 相互一致。残余 finding 是历史 source-missing RED 原始 stdout/退出码仍缺失，且本报告不能关闭它。此结果不构成纯 helper 整体 Validation 通过、产品行为验证、权限验证或 S02 Goal 验收。
