# QPREP-002 独立 Validation r001

## 双结论

- **Package validation：`PASS_WITH_BOUNDS_FOR_QPREP_002_FRESH_EVIDENCE`。** 新鲜执行包的 RED/GREEN 使用同一 runner 和冻结 fixture；RED 在八项 oracle 断言层以 `UNIMPLEMENTED` 失败，GREEN 八项通过；独立复跑及定向 lint 通过。此结论只接纳 QPREP-002 的新鲜执行证据，不改写 QPREP-001 的历史结论，也不等同产品实现验收。
- **Original Goal conformance：`NOT_CONFORMANT_AS_GOAL_COMPLETION`；Goal 仍开放。** 10项 Goal AC、14项 F01 义务及 Q066/Q067 共16项产品义务均保留，不因该纯函数候选或新证据包而完成。

本包最多证明 typed 查询引用闭包准备器的有限候选及八个冻结 identity。没有验证产品 payload/入口、UI/Store、权限、保存/undo、查询运行或完整 copy-paste 链路。真实权限验收继续 **`BLOCKED / NOT_RUN`**，未使用 standalone、admin 或 mock 替代。

## 合同、准入及范围

QPREP-002 Validation Card canonical digest `a84a437fc143d77a15f7541820ed247cb4ac34995cb54b79cacd10c3c58606d2` 经 `lane_task_card.py validate` 复算为 pass；Context Bootstrap 验证通过。Builder 卡及 admission 将写范围限定为现有 QPREP runner 与全新 QPREP-002 执行证据。冻结设计及 review 摘要分别为 `9278dfa7…c72c765`、`c761633b…a789c61`；fixtures 摘要 `08ed4a0c…d7dd915`，均与卡片/当前文件相符。

Fixtures 中八个 identity 为 `TC-QPREP-001` 至 `TC-QPREP-008`，runner 逐项按该顺序锁定：成功构造、缺少条件、组件映射多义、级联环、ID 映射非单射、组件缺失、引用身份不匹配，以及深冻结输入下成功且输出独立。Runner 使用 esbuild bundle 加载实际生产 TypeScript 模块；模块缺失时转入可执行 `UNIMPLEMENTED` 分支，避免把解析错误误报成可信 RED。

## RED/GREEN 与独立复跑

QPREP-002 RED 和 GREEN 的 runner SHA-256 均为 `03ad616e64697a4a057fe14c3df4472f5a220f799dcebec61a0dd4f54a77c95c`，fixture SHA-256 均为 `08ed4a0c6ef376230baf856dd7cb0a9b6254733c318b914dbcea959bdc7dd915`。RED 时 source 记录为 `<missing>`（其摘要 `769b8995…0657aab`）；GREEN source 摘要为 `cad91daa9e416260565519bcc705743f34726357cda35a6a8a73f423f7aeff46`，与当前生产模块相同。

持久 RED stdout/stderr/exit code 分开保存：摘要为 `0/8 passed; 8 failed`、exit 1；stderr 中八项均进入 runner 断言层，负例期望 reason 与 `UNIMPLEMENTED` 不同，正例及深冻结正例也因 `ok !== true` 失败，末尾是汇总断言 `8 !== 0`。未见模块解析失败。GREEN 摘要为 `8/8 passed; 0 failed`、exit 0；stdout 同时记录上述生产模块、fixture 和 runner 摘要。定向 ESLint 的持久 exit code 为 0，stdout/stderr 为空。

独立在 `core/core-frontend` 重新执行：

```text
node tests/filter-copy-query-reference/query-reference-plan.test.ts
```

结果为 `8/8 passed; 0 failed`、exit 0；独立 runner、fixture 与生产模块 SHA-256 均与 GREEN 日志一致。随后执行 `./node_modules/.bin/eslint tests/filter-copy-query-reference/query-reference-plan.test.ts`，exit 0。Node 输出 package 未声明 module type 的性能提示，不影响断言或退出状态。

## 差异与历史状态

按 QPREP-002 Builder Card、准入拓扑 r052 与完成拓扑 r053 核对，此执行的候选写入是 runner 加全新的 QPREP-002 evidence package。生产实现 `query-reference-plan.ts` 当前摘要仍为 `cad91daa…7aeff46`；冻结 fixture 仍为 `08ed4a0c…d7dd915`。未见该执行修改生产模块或冻结设计/fixture。

`reviews/QPREP-001-Validation-r001.md` 当前摘要仍为 `1a66d6cc…223485ee`，其既有 verdict **`PARTIAL_PASS / BLOCKED_FOR_PACKAGE_ACCEPTANCE`** 继续有效：QPREP-001 当时的 RED 持久证据缺口没有被追认、补造或由 QPREP-002 新证据倒填。QPREP-002 仅建立新的、可复核的执行包。

Goal ledger 仍为26项且全部 pending：`AC-S02-01` 至 `AC-S02-10` 共10项 Goal AC；`AC-F01-Q004` 至 `AC-F01-Q015`、`AC-F01-ORIG-01/02`、`AC-F04-Q066/067` 共16项产品义务。权限、产品链路和 Goal 完成状态均未改变。本报告是 Validation Card 唯一写出；未修改 runner、生产实现、fixture、旧 QPREP-001 报告或任何状态台账。
