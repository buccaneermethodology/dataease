# S02-QPROJ-001 Builder 执行证据 r001

## 范围与准入

本记录仅覆盖普通查询引用窄投影的 Builder 候选，不代表完整查询 schema、copy 产品链路、F01、Q066/Q067、真实权限或 Goal 验收。

- Lane card：`planning/query-schema-projection-builder-card-r001.json`，canonical SHA-256 `b05f7fcc79eb974f78548ef463a6ca1ec7624e403c280b233639b447e6664c1d`，接收端 validate/render 通过。
- Execution admission：`planning/execution-admission-query-projection-builder-r001.json`，action `builder`、target `core/core-frontend/src/custom-component/filter-copy/query-schema-projection.ts`，复验通过。
- Context Bootstrap：`planning/ContextBootstrap-query-projection-builder-r001.json`，validate 通过。
- 只读预检：Node `v24.21.0`、本地 `esbuild` 可解析、ESLint `v7.32.0`。

## 修改

- 新增 `core/core-frontend/src/custom-component/filter-copy/query-schema-projection.ts`：按冻结阶段顺序验证普通条件与引用形态、窄域复杂引用、显式 source component/field 元数据，解析级联复合引用，并以新对象投影为 QPREP typed 输入。不会读取或输出默认值、运行态选择、Store、网络、权限或随机 ID。
- 新增 `core/core-frontend/tests/filter-copy-query-reference/query-schema-projection.test.ts`：冻结的 Node/esbuild runner，以同一份 runner 执行 6 个 identity；TC-QPROJ-006 在 projection 成功后另调用 QPREP，验证 `MISSING_CONDITION`。
- 产品实现与 runner 最终 SHA-256 分别为 `9c0d15e3ad7a383c65c2e4af6a23c2377c064d4f7b30906990536b3dd94b0285` 和 `e8ea0ca021b76140ac46119b2d28494e789aa5eaf928586020c251a516d2172c`。

## RED 与 GREEN

先写并冻结 runner，再以实现缺失状态执行：

```sh
# 工作目录：core/core-frontend
node --experimental-strip-types tests/filter-copy-query-reference/query-schema-projection.test.ts
```

RED 的分离 stdout、stderr 和退出码原文保存在 `planning/evidence/QPROJ-001-red.stdout.txt`、`planning/evidence/QPROJ-001-red.stderr.txt`、`planning/evidence/QPROJ-001-red.exitcode.txt`。退出码为 `1`；6 个 identity 均因 projection 实现不可用而失败，结果为 `0/6`。Node 另输出 MODULE_TYPELESS_PACKAGE_JSON 提示。实现前摘要保存在 `planning/evidence/QPROJ-001-red.source-runner-fixture-sha256.json`：源文件缺失（`<missing>` 摘要 `769b8995b8bf4407c89e906d67601a46266d34922a63ab1754440eecb0657aab`），runner 摘要 `e8ea0ca021b76140ac46119b2d28494e789aa5eaf928586020c251a516d2172c`，fixture 摘要 `d5ecf7a70c11108f80052605da4b016d9fb52296c800c7605d2e40208bed641d`。

RED 后未修改 runner、fixture、design、Goal 或 QPREP。GREEN 使用相同冻结 runner 和 Node 参数，从仓库根目录执行 `node --experimental-strip-types core/core-frontend/tests/filter-copy-query-reference/query-schema-projection.test.ts`。GREEN 的分离 stdout、stderr 和退出码保存在 `planning/evidence/QPROJ-001-green.stdout.txt`、`planning/evidence/QPROJ-001-green.stderr.txt`、`planning/evidence/QPROJ-001-green.exitcode.txt`。6 项均通过，退出码为 `0`；同一警告仍出现在 stderr。GREEN runner/fixture 摘要与 RED 相同。

证据重定向首次因相对路径起点错误，短暂写入 `core/core-frontend/Dashboard/...`；原始 stdout/stderr/exit code 已原样移动至本卡授权 evidence 路径，误建目录已删除，定向状态检查未发现 scope 外残留。

## ESLint

定向命令为：

```sh
./core/core-frontend/node_modules/.bin/eslint core/core-frontend/src/custom-component/filter-copy/query-schema-projection.ts core/core-frontend/tests/filter-copy-query-reference/query-schema-projection.test.ts
```

完整命令的分离输出及退出码保存在 `planning/evidence/QPROJ-001-lint.stdout.txt`、`planning/evidence/QPROJ-001-lint.stderr.txt`、`planning/evidence/QPROJ-001-lint.exitcode.txt`。两文件联合 lint 退出码为 `1`：实现文件 lint 通过，冻结的 runner 有两处 Prettier 格式诊断。实现文件单独以同一 ESLint 版本执行，退出码为 `0`。由于 RED 后卡片冻结 runner 且其摘要不得变化，本 Builder 未修改测试文件来消除格式诊断，因此联合 lint 不能报通过；需要全量 lint 通过时应先重新准入/rebaseline runner。

## 证据上限

证据只支持六个冻结 projection identity 的纯模块候选行为。它不验证产品调用、copy/UI、元数据来源可信度、访问权限、保存或真实仪表盘运行。真实多用户权限环境仍阻塞，相关 AC 保持未验证。该 Builder 不声明独立 Validation 或 Goal 完成。
