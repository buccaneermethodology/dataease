# S02-F01 局部候选回归执行记录 r001

## 执行范围

日期：2026-10-21。当前工作树 `core/core-frontend` 中执行既有 query-reference detached/helper 套件及相关 carrier/target/relation/saved-owner harness。此次是本地执行记录，不是独立 Validation、产品验收或 Goal completion evidence。

## 结果

- `for f in tests/filter-copy-query-reference/*.test.ts; do node "$f" || exit $?; done`：17/17 文件退出码 0；覆盖的 runner 按各自冻结 case identity 执行。
- `node tests/filter-copy-pure/check.mjs`：17 个纯合同 identity 通过。
- `node tests/filter-copy-query-cascade-identity-rebinding/rebind.test.mjs`：6 个冻结身份及 11 个防护检查通过。
- `node tests/filter-copy-query-target-component-map/query-target-component-map.test.ts`：6/6 通过。
- `node tests/filter-copy-query-tree-relation-rebinding/rebind.test.mjs`：8 个冻结身份及 7 个防护检查通过。
- `node tests/filter-copy-query-saved-canvas-owner/saved-canvas-owner.test.mjs --mode green`：40 个 `SCPO2/3/4` case 通过，无执行错误或行为差异。
- `node tests/filter-copy-query-saved-canvas-owner-producer/saved-owner-producer-repair.test.mjs --mode green`：14/14，0 mismatch/0 execution error；当前源码摘要 `7c78975a04af8d621e06f4ea0e112a025be3207a20ea1b8eb5388914b25352a4`。
- 同一修复 harness `--mode red`：exit 2、0 mismatch。按该 runner oracle，这表示当前修复实现没有预期缺陷，**不是有效 RED**；不能代替历史修复前 RED。

## 差异与限制

- 首次直接调用两个 saved-owner `.mjs` runner 时省略必需的 `--mode`，只得到使用错误；随后按 harness CLI 正确重跑。
- 额外执行旧 `saved-owner-producer.test.mjs --mode green` 时报告 1 个 mismatch：QPC-PROD-007 实际 `owner_invalidated`、fixture 期望 `target_ambiguous`。与修复版 runner 的 14/14 GREEN 结果并存；旧 runner/fixture 是否仍是受维护合同、或应与修复合同更新，尚未裁定。未修改任一 runner、Cases 或实现。
- 所有结果只覆盖 detached/helper/local harness。没有触及真实权限环境、产品菜单/Store/source-read/target-commit、保存重开 UI 或 Goal AC。真实只读拒绝和撤权/恢复仍 `BLOCKED / NOT_RUN`。
- 个别 `.test.ts` 只报告 exit 0、没有汇总行；套件计数按独立文件退出码统计，不把它们扩写成特定业务断言覆盖。
