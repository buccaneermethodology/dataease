# PureGuard 后补故障注入敏感性执行记录 r001

本记录是审后敏感性负向控制，不是历史 RED、生产实现 RED 或可信 RED/GREEN 闭环。只验证 frozen identity `TC-Q004-01` 的同一断言能捕获一项进程内注入错误，并检查未知参数拒绝。

## 输入摘要

- Runner `core/core-frontend/tests/filter-copy-pure/check.mjs` SHA-256 `907fba4a3416ea6c7f00b11899dbc4007029eadf74ee5c60158cedc184ce028f`
- 生产模块 `core/core-frontend/src/custom-component/filter-copy/pure-guards.ts` SHA-256 `579bfaf261b3d9a2325554f2e21f6ac44c7bd3a66f611661d97bcd05188de844`
- Contract `Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/PureSubcontracts-r002.json` SHA-256 `eeec347d7f07fe4a2de1cc12e7ac96411679f399594b934f7ce5a85703eb29ea`
- Cases `Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/Cases.candidate.json` SHA-256 `484eaa5f834a2512e3d7eaf2fa41d7dbd9fa4ce43f970ec1292ddd4fe4fcd2da`

- 定向 ESLint：`./node_modules/.bin/eslint tests/filter-copy-pure/check.mjs` exit 0。
- 新增文件及计划摘要空白检查：10个输出文件无 whitespace 诊断；`git diff --check` exit 0。

## 运行结果

- `green`：exit `0`；stdout `PASS: 17 bounded pure contract identities`；stderr `<empty>`。原始文件为 `PureGuardNegativeControl-green.stdout.txt`、`.stderr.txt`、`.exitcode.txt`。
- `injected-failure`：exit `1`；stdout `<empty>`；stderr `node:internal/modules/run_main:107
    triggerUncaughtException(
    ^

AssertionError [ERR_ASSERTION]: TC-Q004-01

'reject' !== 'allow'

    at file:///Users/xiaomei/Documents/projects/dataease/core/core-frontend/tests/filter-copy-pure/check.mjs:55:10
    at process.processTicksAndRejections (node:internal/process/task_queues:104:5) {
  generatedMessage: false,
  code: 'ERR_ASSERTION',
  actual: 'reject',
  expected: 'allow',
  operator: 'strictEqual',
  diff: 'simple'
}

Node.js v24.21.0`。原始文件为 `PureGuardNegativeControl-injected-failure.stdout.txt`、`.stderr.txt`、`.exitcode.txt`。
- `invalid-option`：exit `1`；stdout `<empty>`；stderr `file:///Users/xiaomei/Documents/projects/dataease/core/core-frontend/tests/filter-copy-pure/check.mjs:40
  throw new Error(`unsupported fault injection case: ${faultInjection}`)
        ^

Error: unsupported fault injection case: unknown-case
    at file:///Users/xiaomei/Documents/projects/dataease/core/core-frontend/tests/filter-copy-pure/check.mjs:40:9
    at process.processTicksAndRejections (node:internal/process/task_queues:104:5)

Node.js v24.21.0`。原始文件为 `PureGuardNegativeControl-invalid-option.stdout.txt`、`.stderr.txt`、`.exitcode.txt`。

GREEN 应 exit 0 且报告 17 个 identity 通过；injected-failure 应 exit 非零并以 `TC-Q004-01` 定位 expected `allow` / injected actual `reject`；invalid-option 应 exit 非零并明确报告未知值。三者均在 `core/core-frontend` 目录运行。

本证据不关闭历史 RED 缺证、PV-02 Builder身份、PV-03 准入时序，也不提升独立Validation整体 `PARTIAL_PASS / BLOCKED_FOR_PACKAGE_ACCEPTANCE`。产品、权限、S01 与完整 Goal 均未验收。
