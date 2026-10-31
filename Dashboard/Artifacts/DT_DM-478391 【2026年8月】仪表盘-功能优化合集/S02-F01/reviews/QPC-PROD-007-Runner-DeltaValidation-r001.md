# QPC-PROD-007 Runner Delta Validation r001

## Verdict

`PARTIAL / RUNNER_ORACLE_GAP`。本次验证只检查当前 runner 与冻结 Contract r002 / Cases r004 的一致性，以及 14-case runner GREEN；不验证 producer 实现、产品 UI/Store、权限或 S02 Goal。当前 GREEN 通过，但 runner 对 QPC-PROD-007 只断言三个首错 reason，没有断言冻结用例要求的 owner 终态为 invalid，也没有验证失效后的旧 owner 拒绝，因此不能据此判该 case 的完整 oracle 已执行。

## Snapshot 与输入身份

- `reviewed_at`: 2026-10-21 15:32 UTC
- `snapshot_id`: `S02-QPC-PROD-007-Runner-delta-validation-r001`
- `as_of_state`: Topology r348（SHA-256 `b489e952edfe7ed6ebf9fc5108cf6bcfec5304416b4ca65b156b7c7e3a54a246`）；当前 runner SHA-256 `fdbae7a394db36128f7fc60ee5a8f1a37d31ce9e6fab69e903cb313320596370`
- Context Bootstrap SHA-256 `eaaf608906bb469d7f75dda25914533db741bcccc5e40135da39fe3d97820000`；Card canonical SHA-256 `2fb6ee53f241d2b4781056aa6ea19954492baf4c8f980cd5b1aac490146e3bc1`，card 校验通过。
- Contract r002 SHA-256 `005317149a1ba37ec47e4996c536efef60f51f46bea6b9151630a7f810ef35cc`；Cases r004 SHA-256 `f6f97ff89bf7a9e4a6dcc3389960ce3e8f22530dcb30042dfdcdf2018bc84f05`。
- Bootstrap 引用的 23 项 required-read 摘要全部复算一致，缺项与 `skipped_reads` 均为 0。独立运行 `context_bootstrap.py validate` 返回 `validation_evidence_surface_missing`：该验证 Context 未包含工具要求的标准表面 `original objective`、`acceptance criteria`、`actual diff`、`final state`。这是治理包阻断项，不能把 Card pass 当成 Context pass。

## 验证证据

`node --check tests/filter-copy-query-saved-canvas-owner-producer/saved-owner-producer.test.mjs` 通过。独立运行 `node tests/filter-copy-query-saved-canvas-owner-producer/saved-owner-producer.test.mjs --mode green` 返回 exit 0：Node `v24.21.0`，14 个 case ID 与冻结 `case_order` 完全一致，0 behavior mismatch、1 static case（QPC-PROD-014）、0 execution error；runner 实际 bundle 仅含 `saved-owner-producer.ts`（SHA-256 `7c78975a04af8d621e06f4ea0e112a025be3207a20ea1b8eb5388914b25352a4`）。

QPC-PROD-007 冻结 oracle 声明 `owner: invalid`，并列出 `target_missing`、`target_ambiguous`、`target_raw_identity_changed`。当前旧 runner 为三个变体各创建一个新 producer，分别断言首错 reason，隔离断言本身成立；但未断言每次后 owner 清空/invalid、generation 只前进一次，也未再次验证旧 owner 返回 `owner_invalidated`。同目录 repair runner 增加了这些终态断言；它属于不同 runner 文件，不能把其断言覆盖计入本次被审 runner。

## Findings

### Blocking — QPC-PROD-007 oracle 只覆盖 reason，未覆盖冻结终态

当前 runner 的 QPC-PROD-007 会因三个原因字符串正确而通过，即使被测 producer 在拒绝时仍保留 ready owner。冻结 Cases r004 的 `expected.owner = invalid` 和 `revalidate_owner` 行为没有在该 runner 中得到断言。故本次 14-case GREEN 只证明 runner 已执行到其现有断言，不证明 QPC-PROD-007 的完整冻结 oracle 一致性。

### Blocking — Validation Context 未通过确定性验证

`context_bootstrap.py validate` 报 `validation_evidence_surface_missing`。Required-read 摘要无漂移不消除此 schema/gate 缺口；本报告可作为只读观察记录，不能将该 lane 标成完整 protocol-pass。

### Non-blocking — 历史 source-absent RED 中的 QPC-PROD-007 mismatch 不是 target_ambiguous 行为差异

历史 RED identity 绑定 source 不存在（`source_exists=false`、`source_sha256=null`、`bundle_inputs=[]`），exit 1，13 个 case mismatch。QPC-PROD-007 记录的是 `publish()` 初始化断言 `false !== true`，在进入三个 target 变体前即失败；没有观测到 `target_ambiguous` 返回值。故将该条历史 mismatch 称为 target-ambiguous oracle drift 或当前实现差异属于误归因。保留原 source-absent 时态和身份；当前 GREEN 不回填或重写该 RED。

## Bounded conclusion

旧 runner 的 `target_ambiguous` reason 与冻结 Cases r004 列出的 reason 一致，且每变体使用新 producer；当前没有证据支持“当前 target_ambiguous mismatch”。但旧 runner 漏掉冻结 owner-invalid 终态断言，当前 GREEN 对该义务不足。结论仅限 runner/oracle 与测试覆盖面；不证明 producer 行为、产品权限、产品接线或 Goal AC。Goal 分母与真实权限状态不由本报告更新。

## Read manifest

按 [delta-validation Card](../planning/qpc-prod-007-runner-delta-validation-card-r001.json) 的 23 项 `delta_read_set` 完成读取并复算摘要，全部命中且无漂移；原始路径清单与摘要保存在该 Card 指向的 Context Bootstrap `ContextBootstrap-QPC-PROD-007-Runner-delta-validation-r001.json`。额外读取 Topology r348、当前 runner 与 repair runner 的 QPC-PROD-007 实现段，并独立执行上述定向命令。未修改 runner、source、Contract 或 Cases。
