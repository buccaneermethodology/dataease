# S02-QPROJ-001 lint-only rebaseline 执行证据 r002

## 范围与准入

本轮只修复 QPROJ-001 测试 runner 的两处 Prettier 行格式，并用同一 6 个冻结 identity 复跑 GREEN 与定向 lint。未改生产模块、QPREP、fixture、design 或 Goal，不代表产品、权限或 Goal 完成。

- Lane card `query-schema-projection-lint-rebaseline-card-r001.json` canonical SHA-256：`47a2e49d1c13d6820157b1535f8c283fdf696416641327065156a3bb8b4b8a93`，接收端 validate/render 通过。
- Admission `execution-admission-query-projection-lint-rebaseline-r001.json`：action `builder`，target 为测试 runner，复验通过。
- Context Bootstrap `ContextBootstrap-query-projection-lint-rebaseline-r001.json` validate 通过。
- 预检：Node `v24.21.0`、本地 esbuild 可解析、ESLint `v7.32.0`。

## 仅格式修复

修改文件：`core/core-frontend/tests/filter-copy-query-reference/query-schema-projection.test.ts`。只将 `inputFor` 中一行调用与 `assert.equal` 调用换行以满足 Prettier。将当前 runner 反向还原这两处换行后，SHA-256 得到原冻结摘要 `e8ea0ca021b76140ac46119b2d28494e789aa5eaf928586020c251a516d2172c`，与 r001 RED/GREEN runner 摘要一致；因此其余字节未改变，identity、输入、断言、oracle 及执行逻辑均保持不变。新 runner SHA-256 为 `f2835aeb11d7d86f1cf585ff82e4a15f8541a93f030777a1e50c9e090f3a872b`。

## 原 RED 与本轮 GREEN

本轮保留原 r001 的 durable RED，不重跑、不覆盖。RED 原始分离输出与源码/runner/fixture 摘要仍在：

- `evidence/QPROJ-001-red.stdout.txt`
- `evidence/QPROJ-001-red.stderr.txt`
- `evidence/QPROJ-001-red.exitcode.txt`（退出码 `1`）
- `evidence/QPROJ-001-red.source-runner-fixture-sha256.json`

RED 时源文件缺失，fixture 摘要为 `d5ecf7a70c11108f80052605da4b016d9fb52296c800c7605d2e40208bed641d`，runner 为上述原冻结摘要。

从仓库根目录运行更新后的同一 runner：

```sh
node --experimental-strip-types core/core-frontend/tests/filter-copy-query-reference/query-schema-projection.test.ts
```

新 GREEN 的 stdout/stderr/exit code 分别保存在 `evidence/QPROJ-001-rebaseline-green.stdout`、`evidence/QPROJ-001-rebaseline-green.stderr`、`evidence/QPROJ-001-rebaseline-green.exitcode`。TC-QPROJ-001 至 TC-QPROJ-006 全部通过，`6/6 passed; 0 failed`，退出码 `0`。TC-QPROJ-006 仍先验证 projection 保留 `conditionId=missing`，再由 QPREP 得到 `MISSING_CONDITION`。stderr 保留 Node 的 MODULE_TYPELESS_PACKAGE_JSON 性能提示。GREEN 输出的 production module SHA-256 为 `9c0d15e3ad7a383c65c2e4af6a23c2377c064d4f7b30906990536b3dd94b0285`，fixture 与 RED 摘要相同。

## 定向 ESLint

对测试 runner 执行：

```sh
./core/core-frontend/node_modules/.bin/eslint core/core-frontend/tests/filter-copy-query-reference/query-schema-projection.test.ts
```

stdout/stderr/exit code 保存在 `evidence/QPROJ-001-rebaseline-lint.stdout`、`evidence/QPROJ-001-rebaseline-lint.stderr`、`evidence/QPROJ-001-rebaseline-lint.exitcode`。退出码为 `0`，没有诊断输出。

## 声明边界

本次只支持原 6 个普通查询引用窄投影 identity 的测试 runner 格式已修复、GREEN 与定向 lint 结果。未验证 copy 产品集成、完整查询形态、真实权限或 S02 Goal。真实多用户权限验收仍保持未验证。
