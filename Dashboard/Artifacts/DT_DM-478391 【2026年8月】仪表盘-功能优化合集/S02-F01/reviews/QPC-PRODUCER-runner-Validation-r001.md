# QPC Saved Owner Producer RED r001 独立 Validation

Verdict：`TRUSTED_RED_RUNNER_REVALIDATED / SOURCE_ADMISSION_NOT_GRANTED`。独立复跑确认 source-absent runner 的 RED 候选及 13 个行为差异、1 个静态边界分类和 0 个执行错误；不代表 producer 源实现、产品接线、权限行为或 Goal AC 通过。

## Card、Context、Prompt 与拓扑

Lane Card `S02-QPC-SAVED-OWNER-PRODUCER-runner-validation-r001` canonical SHA-256 为 `cc3e00ed915c35d693806701a989a4f1eb96a7e9f472fbb9a0e26ba3b7621b7e`，与要求值一致；Context Bootstrap 原始 SHA-256 为 `43f456b83354a5a4434a8dd163342ba1ac1bca2008863d0c594cd80ba66bb112`，与 Card 引用一致。Context validation、Card validate/render 均通过；消费渲染 prompt `qpc-producer-runner-validation-prompt-r001.rendered.md`，其摘要为 `f40d9db64ac394201abc413d8330acaeb24d7d8433454563d74bd8c0038b47e2`。Topology r228 (`2026-10-20T20:40:00Z`) 已读取；它记录该独立 read-only RED Validation 的拓扑分派，本文遵循其声明的 append-only 顺序边界。

Context 中 17 项 required-read 摘要逐项复算一致，`skipped_reads=[]`。Topology r228 另外列出的 r227 与 rendered prompt 摘要也匹配当前文件。

## 冻结输入与 source 前置条件

Contract r002 摘要为 `005317149a1ba37ec47e4996c536efef60f51f46bea6b9151630a7f810ef35cc`；Cases r004 摘要为 `f6f97ff89bf7a9e4a6dcc3389960ce3e8f22530dcb30042dfdcdf2018bc84f05`；runner 摘要为 `75bd0543eaf00c924d5ec4c87784fd48f3a93f651cb13b3765c3455350c01f57`。Cases `case_order` 与 runner 的 case id 顺序完全相同，14 项依次为 QPC-PROD-001 至 QPC-PROD-014；全部仍标记 `DESIGN_ONLY`。

runner 声明的精确 source target 是 `core/core-frontend/src/custom-component/filter-copy/saved-owner-producer.ts`，独立检查确认其不存在；RED 输出记录 `source_exists=false`、`source_sha256=null`、`bundle_inputs=[]`。本结论只针对该精确路径，不以其他候选/文件替代。

## 独立 RED 结果与身份对照

在 `core/core-frontend` 独立执行 `node tests/filter-copy-query-saved-canvas-owner-producer/saved-owner-producer.test.mjs --mode red`（再次捕获用于与归档证据逐字对比）：`setup_status=ok`、Node `v24.21.0`、14 个 case ID 均按冻结顺序执行、13 behavior mismatch、静态 case 1 项且唯一为 `QPC-PROD-014`、0 execution error、stderr 为空、退出码 1。该退出码是 RED 候选预期值。

独立 stdout 与归档 `QPC-PRODUCER-RED-r001.stdout.txt` 字节完全一致（SHA-256 `38edbc8a9a26845ca63523bf7584c909b53a8d7b5157abbc5b70dd469d3590d2`）；解析后的 identity 与归档 identity JSON 完全一致，case-classification 也逐项匹配：13 个 behavior mismatch IDs、静态 `QPC-PROD-014`、空 execution error IDs。stderr、exit code 及分类文件的摘要均与 Context/Topology 绑定值一致。

`QPC-PROD-014` 是 producer export/call 边界静态检查：owner 不携带授权决策，producer 不调用 source-read 或 target-commit。它没有运行授权 allowed/denied/unknown 场景，也不构成权限验证。RED 中 `UNIMPLEMENTED` 只属于 source-absent stub 的预期差异。

## 结论边界

没有运行 GREEN、产品 UI/Store、source-read/target-commit 或权限路径；没有修改 runner、cases、contract、source、原始证据。只验证 runner RED 与静态分类，不准入 producer source 编写/产品接线，不改变 Goal 10/26/16、Scope Delta none 的分母。真实多用户权限仍是 `BLOCKED / NOT_RUN`；Goal 和产品 AC 均未由本报告验收。

## 完整 Read Manifest

- `AGENTS.md` — `270940a30f462f2fb0c9a8cf2bbc1dd11750513d8f063ffc376e0e0a2640466e`
- `.codex/skills/sge-governed-checkpoints-sp010/SKILL.md` — `b3e5d00193f88608e8deb3214071444ce89fa66431daf115b35f72fedbecbe3f`
- `Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/Goal.final.json` — `f562da2eb14b84dc8083e138dd2eb8718a58041f01d08163eddf5fb2c71daef0`
- `Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/QueryProductCommitSavedOwnerProducerContract-r002.json` — `005317149a1ba37ec47e4996c536efef60f51f46bea6b9151630a7f810ef35cc`
- `Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/QueryProductCommitSavedOwnerProducerCases-r004.json` — `f6f97ff89bf7a9e4a6dcc3389960ce3e8f22530dcb30042dfdcdf2018bc84f05`
- `Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/reviews/QueryProductCommitSavedOwnerProducerContractReview-r002.md` — `48d647b467c6326b7953dc2ffa623f50600f949ac2986de2a54841ec35b60f2e`
- `Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/reviews/QueryProductCommitSavedOwnerProducerCasesReview-r004.md` — `404764b9e0e9628e81002aa62cdf0cfe334dfe6681f4ab43d4123d4cc188f4ba`
- `Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/planning/ContextBootstrap-QPC-producer-runner-builder-r001.json` — `34ff8122d5b85c1149493c17a44ea74c3fc51c4f32d59d6bf1f2fa72fd678f2f`
- `Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/planning/qpc-producer-runner-builder-card-r001.json` — `77a39ad2e66fa6dd8523776014b43648ac701453d213dbcf4963853a2439e5c7`
- `Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/planning/execution-admission-qpc-producer-runner-builder-r001.json` — `e8bf39cbfef78d25b240d8764ed975d63ae225afd07b2f5c0d8ba2ddc491e4bc`
- `Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/planning/Topology-actual-r226.json` — `cb41d03e33698a8548a6e95ca4dbaef552d3a5f5c07aae778c8fa3d8a4b8fabc`
- `core/core-frontend/tests/filter-copy-query-saved-canvas-owner-producer/saved-owner-producer.test.mjs` — `75bd0543eaf00c924d5ec4c87784fd48f3a93f651cb13b3765c3455350c01f57`
- `Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/planning/evidence/QPC-PRODUCER-RED-r001.stdout.txt` — `38edbc8a9a26845ca63523bf7584c909b53a8d7b5157abbc5b70dd469d3590d2`
- `Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/planning/evidence/QPC-PRODUCER-RED-r001.stderr.txt` — `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`
- `Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/planning/evidence/QPC-PRODUCER-RED-r001.exitcode.txt` — `4355a46b19d348dc2f57c046f8ef63d4538ebb936000f3c9ee954a27460dd865`
- `Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/planning/evidence/QPC-PRODUCER-RED-r001.identity.json` — `2b91cbc154eb9dbd8efad5b71f375a36cad8454be6922afc2e00f6129bd14679`
- `Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/planning/evidence/QPC-PRODUCER-RED-r001.case-classification.json` — `d11fac4e47e55b3fecc077902fa189db3cae98556b9a16a4c004a66a3a10ffca`
- `Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/PermissionEnvironment.md` — `bf1498aa23f4f864e2c5c3d999b6b1a6044849ba25a9cd7d7d85104b6f233b9d`
