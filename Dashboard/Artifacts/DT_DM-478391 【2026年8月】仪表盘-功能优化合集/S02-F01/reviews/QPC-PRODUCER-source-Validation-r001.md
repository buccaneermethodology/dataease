# QPC Saved Owner Producer Source r001 独立 Validation

## Verdict

`BLOCKED_FOR_SOURCE_CANDIDATE_ADMISSION`。strict TypeScript、定向 ESLint 与同身份 14-case GREEN 均通过，但发现一项阻断性合同违例：root/target 身份变化被拒绝时没有失效 owner。当前 GREEN oracle 未断言这一终态，因此不能据 GREEN 通过批准候选符合 Contract r002。

## Card、Context、Read Manifest 与拓扑

Lane Card `S02-QPC-SAVED-OWNER-PRODUCER-source-validation-r001` canonical SHA-256 为 `c275202a6b55feb3ab2172593ee3386869e5c3f2c1df7fa5f2369a65b8a077d7`；Context 原始 SHA-256 为 `214543e9236294c9cdb002b7149a20b3a114981d82a00054b372efd7c0551f06`，与 Card 引用相符。Context validate、Card validate/render 通过；required-read 20 项摘要逐项复算无漂移，`skipped_reads=[]`。

Topology r230 SHA-256 `892b5a0e64bd2c860609a89a3bc4e9510f668e542951ce1b65679a898c6d0007` 已读取；其范围限定为 producer-local TypeScript 模型与独立 Validation，不含 Vue/Pinia、source-read/target-commit 或权限验证。

## 输入身份与独立验证

Contract r002 SHA-256：`005317149a1ba37ec47e4996c536efef60f51f46bea6b9151630a7f810ef35cc`；Cases r004：`f6f97ff89bf7a9e4a6dcc3389960ce3e8f22530dcb30042dfdcdf2018bc84f05`；runner：`75bd0543eaf00c924d5ec4c87784fd48f3a93f651cb13b3765c3455350c01f57`；source：`a43f85e767044fe35b2a8fa0a52506a78563c7dc1e07825dee90f111d916ce68`。14 项 `case_order` 与 runner identity 按顺序完全一致：QPC-PROD-001 至 QPC-PROD-014。

在 `core/core-frontend` 独立运行 `node tests/filter-copy-query-saved-canvas-owner-producer/saved-owner-producer.test.mjs --mode green`：exit 0，`setup_status=ok`、14 项、0 behavior mismatch、1 个静态 case（`QPC-PROD-014`）、0 execution error。stdout 与持久 `QPC-PRODUCER-GREEN-r001.stdout.txt` 字节完全一致，SHA-256 为 `28b26412a9350a4dcedc71bca85e07565979a68e965fb42df47175954dc9ed0e`；独立解析 identity 与归档 stdout 一致。归档 stderr 为空、exit code 为 0。source bytes 与 Contract/Topology 绑定一致，bundle 只包含该精确 source。

定向 noEmit TypeScript 检查对 source 单文件使用 `strict=true`、`target=ES2022`、`module=ESNext`、`moduleResolution=Bundler`、`skipLibCheck=true`、`types=[]`，结果 0 diagnostics、exit 0。`./node_modules/.bin/eslint src/custom-component/filter-copy/saved-owner-producer.ts` exit 0。

## 实际 source 与静态边界

精确 source 是当前工作树中的未跟踪新文件（SHA 与 Context/Topology 一致）；`git diff` 不显示未跟踪文件，因此本审查将该文件整体按新增内容阅读。runner 和 GREEN 输出也显示为未跟踪候选/证据；本轮没有修改任何文件。

source 是无导入的独立内存模型，仅导出 `createSavedCanvasOwnerStoreProducer`。`SavedCanvasOwner` 快照包含 resource id、generation、opaque canvas token、root raw reference/revision、唯一 target id/raw reference 与 provider identity generation；未包含 principal/organization 明文、session token、source-read authorization、target-edit authorization 或 permission decision。公开 API 不含 source-read、target-commit、permission、copy/paste、preview/query/save 调用。此检查只约束 detached 模型的当前源码/API 表面。

`beginLoad` 先拒绝不支持模式/空资源 ID，再递增 generation 并清 owner；publication setters 必须按 resource metadata、component root、style、view 顺序；部分失败进入 `publication_failed` 且 owner=null；完成时校验资源、发布完整性、root、唯一 VQuery target 及 provider identity 后才 mint frozen owner。`validateOwner` 中 generation/resource、root、target cardinality/raw identity、provider identity 检查顺序与合同相关失败优先级一致；但下述终态失效行为缺失。

## Blocking Finding

### QPC-SOURCE-001 / 高：root/target 变化拒绝未使 owner 失效

Contract r002 `lifecycle.root_or_target_changed`（约第 104–106 行）规定 root 被替换、目标删除/重复/替换或 raw 引用变化时必须 `invalidate owner`。`validateOwner` 在 root 不匹配处（source 第 184–185 行）及 target 缺失/歧义/raw identity 不匹配处（第 187–191 行）只返回错误；这些分支不清除 `snapshot.owner`、不把 status 改为 `invalid`，也不推进 generation。相同 owner 随后仍可被验证为 ready，违反冻结合同的失效状态迁移。

QPC-PROD-007 runner（第 196–218 行）依次用同一个 owner 测 target missing、ambiguous、raw replacement，只断言三个拒绝 reason；它不检查 rejection 后 owner=null、status invalid 或 generation 只增加一次。候选因此可以对三个条件分别返回 reason 并继续保持同一 owner 有效，现有 GREEN 不会暴露合同违例。该 case 的当前 setup 也与所需 fail-closed 语义冲突：实现正确失效后，后两个调用应观察到 `owner_invalidated`，不能再在已终结 owner 上期待独立 target reason。

## Non-blocking Findings

- 同身份 GREEN、静态 TypeScript 和 ESLint 均通过；它们不覆盖上述缺失的终态断言，故只作为窄证据保留。
- principal/organization 变化在纯模型中通过 `invalidate` 显式输入模拟；不能证明事件确由真实 provider 验证或证明缓存隔离。合同已将真实 provider 与权限实现排除在本模型之外。
- `QPC-PROD-014` 只检查导出/API 和模型调用计数，不证明产品侧没有其它路径调用 source-read/target-commit。

## Builder Repair

1. 按 Contract r002 修复 `validateOwner`：root/target 身份不匹配应让当前 owner 进入终态失效，owner=null，status=`invalid`，generation 恰好递增一次；保留首次触发的具体 reason，后续旧 owner 验证返回 `owner_invalidated`。若 authority 认为合同语义需变更，应先更新合同及独立复核，不能以当前较弱 GREEN 替代。
2. 更新 QPC-PROD-007 测试 setup：对 target missing、ambiguous、raw replacement 各建立新 producer/新 owner；每个变体断言首次失败 reason 及失效后的 snapshot/status/generation，再断言旧 owner 后续验证为 `owner_invalidated`。若变更冻结 Cases，产生新 revision/身份并重新走准入；不要覆写当前 r004。
3. 重新采集候选身份与 RED/GREEN、严格类型和 lint 证据，再安排独立 Validation。此报告不授权 source/UI/Store 接线或冻结输入修改。

## 声明上限

本报告只判断纯 producer-local source、当前 14 项 runner 与窄静态检查。不能代表 Vue/Pinia 产品运行、Store 发布可见性、source-read/target-commit、真实权限/撤权或 Goal AC 验收；真实多用户权限仍为 `BLOCKED / NOT_RUN`。Goal 分母 10 AC / 26 must-have / 16 product obligations、Scope Delta none 不变。

## 完整 Read Manifest

- `AGENTS.md` — `270940a30f462f2fb0c9a8cf2bbc1dd11750513d8f063ffc376e0e0a2640466e`
- `.codex/skills/sge-governed-checkpoints-sp010/SKILL.md` — `b3e5d00193f88608e8deb3214071444ce89fa66431daf115b35f72fedbecbe3f`
- `Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/Goal.final.json` — `f562da2eb14b84dc8083e138dd2eb8718a58041f01d08163eddf5fb2c71daef0`
- `Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/LoopGoal_Final_r001.md` — `92d8a4ed6d6686ba401351bd9544800cec799c0ac754a3c612cf4cb98d6c63a9`
- `Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/QueryProductCommitSavedOwnerProducerContract-r002.json` — `005317149a1ba37ec47e4996c536efef60f51f46bea6b9151630a7f810ef35cc`
- `Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/QueryProductCommitSavedOwnerProducerCases-r004.json` — `f6f97ff89bf7a9e4a6dcc3389960ce3e8f22530dcb30042dfdcdf2018bc84f05`
- `Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/QueryProductCommitSavedOwnerProducerDesign-r001.md` — `5f98c2c913b8a080de7f796b64271963ba216433354e411cefbe29cd8bf4aa5a`
- `Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/QueryProductCommitStoreProducerTrace-r001.md` — `c48e9c04dce9e663ea36b1b0f312b45e06ff9927b15f691173704f9a5c37542b`
- `Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/reviews/QueryProductCommitSavedOwnerProducerContractReview-r002.md` — `48d647b467c6326b7953dc2ffa623f50600f949ac2986de2a54841ec35b60f2e`
- `Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/reviews/QueryProductCommitSavedOwnerProducerCasesReview-r004.md` — `404764b9e0e9628e81002aa62cdf0cfe334dfe6681f4ab43d4123d4cc188f4ba`
- `Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/reviews/QPC-PRODUCER-runner-Validation-r001.md` — `b53184f9d4086a7b1a58650bea2c5f11a18700ab1f8add27395e05c82c351d23`
- `Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/PermissionEnvironment.md` — `bf1498aa23f4f864e2c5c3d999b6b1a6044849ba25a9cd7d7d85104b6f233b9d`
- `Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/planning/Topology-actual-r229.json` — `dcdaedb7e9f590078971a499c3c968faa682bf7827fc5ae709b18d3e56a4ddaf`
- `Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/planning/Topology-actual-r230.json` — `892b5a0e64bd2c860609a89a3bc4e9510f668e542951ce1b65679a898c6d0007`
- `core/core-frontend/src/custom-component/filter-copy/saved-owner-producer.ts` — `a43f85e767044fe35b2a8fa0a52506a78563c7dc1e07825dee90f111d916ce68`
- `core/core-frontend/tests/filter-copy-query-saved-canvas-owner-producer/saved-owner-producer.test.mjs` — `75bd0543eaf00c924d5ec4c87784fd48f3a93f651cb13b3765c3455350c01f57`
- `core/core-frontend/QPC-PRODUCER-GREEN-r001.stdout.txt` — `28b26412a9350a4dcedc71bca85e07565979a68e965fb42df47175954dc9ed0e`
- `core/core-frontend/QPC-PRODUCER-GREEN-r001.stderr.txt` — `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`
- `core/core-frontend/QPC-PRODUCER-GREEN-r001.exitcode.txt` — `9a271f2a916b0b6ee6cecb2426f0b3206ef074578be55d9bc94f6f3fe3ab86aa`
- `core/core-frontend/src/custom-component/filter-copy/query-single-select-saved-canvas-owner.ts` — `f475e94fd51c70a6d634ff80caf0cc35d5430556bedf5e5312b8d09f1dd94130`
