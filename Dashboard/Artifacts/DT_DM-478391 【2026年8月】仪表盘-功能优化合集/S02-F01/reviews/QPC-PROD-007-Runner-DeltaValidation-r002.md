# QPC-PROD-007 Runner Delta Validation r002

## Verdict

`PASS_WITH_BOUNDS`。本轮独立复验确认 r001 的两个阻断已修复：QPC-PROD-007 runner 现在验证每个变体的首错原因、owner 失效与清空、generation 恰增一次，以及旧 owner 后续被拒绝；Validation Context 通过确定性校验。14-case GREEN 通过。本结论只覆盖 runner 对冻结 oracle 的断言覆盖及当前 GREEN，不证明 producer、产品 UI/Store、真实权限或 S02 Goal 验收。

## Snapshot 与身份

- `reviewed_at`: 2026-10-21 15:36 UTC
- `snapshot_id`: `S02-QPC-PROD-007-Runner-delta-validation-r002`
- `as_of_state`: Topology r350，SHA-256 `7ec5a94777061c6e6662848d9c702b4bc51619f558af717d403333beecb09eaa`
- Context SHA-256 `3a0475b7f39fd590471af0098578dae95cdc6df7fef5470a10e7419651d9e74a`；Context deterministic validate exit 0。Required-read 共 25 项，全部存在且 SHA-256 相符，`skipped_reads=[]`；Validation evidence surfaces 包含 `original objective`、`acceptance criteria`、`actual diff`、`final state`。
- Card canonical SHA-256 `77ab70d1e854b845f5a9b7a95c59cff294daf2dbf677fb553a19fe87573c929b`，lane-card validate 为 `pass`。
- Contract r002 SHA-256 `005317149a1ba37ec47e4996c536efef60f51f46bea6b9151630a7f810ef35cc`；Cases r004 SHA-256 `f6f97ff89bf7a9e4a6dcc3389960ce3e8f22530dcb30042dfdcdf2018bc84f05`；runner SHA-256 `9a059744ca93c0a510548f0bf8221a431e0dd25fca458f86dbd300f4b5f3c2a5`；当前 producer source SHA-256 `7c78975a04af8d621e06f4ea0e112a025be3207a20ea1b8eb5388914b25352a4`。

## 独立复验

`node --check tests/filter-copy-query-saved-canvas-owner-producer/saved-owner-producer.test.mjs` 通过。独立执行 `node tests/filter-copy-query-saved-canvas-owner-producer/saved-owner-producer.test.mjs --mode green` 返回 exit 0，Node `v24.21.0`：14 个 case ID 与冻结 `case_order` 完全一致；0 behavior mismatch、1 static case（QPC-PROD-014）、0 execution error；bundle 仅包含 `saved-owner-producer.ts`。Contract/Cases 摘要与冻结身份相符。

QPC-PROD-007 的冻结期望为 owner `invalid`，原因依次是 `target_missing`、`target_ambiguous`、`target_raw_identity_changed`，source-read 与 target-commit 计数为 0。当前 runner 的三个变体分别创建新 producer，并分别断言：对应 reason；snapshot 为 `status=invalid`、`owner=null`、generation 比失效前恰增一次；对旧 owner 再验证返回 `owner_invalidated`；随后 generation 不再增加；调用计数匹配冻结值。该断言覆盖冻结 Case 007 的本地 runner oracle。

## r001 Findings 复核

1. **Runner oracle gap — 已处置。** 当前 runner 增加了 owner invalid/清空、generation 恰增一次、旧 owner 再验证拒绝及计数断言；上述 14-case GREEN 执行通过。
2. **Context evidence-surface gate — 已处置。** r002 Context 补齐四个必需表面，独立 deterministic validate exit 0；25/25 read refs 一致且无 skipped read。
3. **历史 source-absent RED 的 target_ambiguous 误归因 — 保持时态边界。** 历史 RED identity 记录 source 不存在、无 source bundle；QPC-PROD-007 在 publish 初始化断言 `false !== true` 即失败，未到达 target-ambiguous 变体。该记录仍是 source-absent 历史 RED，本轮没有重跑或改写；当前 GREEN 不充当 RED。

## 边界与残余限制

GREEN 证明 runner 执行并通过了其当前断言。Case 中的 call counts 是此 detached runner 的测试字段；本报告不将它们解释为产品运行时遥测或权限拦截证据。Cases r004 仍为 `DESIGN_ONLY`。不据此声称 producer 行为验收、Vue/Store 接线、source-read/target-commit 产品路径、权限或 S02 Goal 完成；真实多用户权限仍依原权威记录为 `BLOCKED / NOT_RUN`，Goal 分母和 `Scope Delta: none` 不变。

## Read manifest

完整 25 项路径及绑定摘要见 [r002 Context Bootstrap](../planning/ContextBootstrap-QPC-PROD-007-Runner-delta-validation-r002.json)；本轮逐项重算均一致。另读取并比对 r001 Validation、Topology r350、冻结 Contract/Cases、当前 runner/source 与历史 source-absent RED identity；只执行了定向语法检查与 GREEN，没有运行 RED。未修改 runner、source、Contract 或 Cases。
