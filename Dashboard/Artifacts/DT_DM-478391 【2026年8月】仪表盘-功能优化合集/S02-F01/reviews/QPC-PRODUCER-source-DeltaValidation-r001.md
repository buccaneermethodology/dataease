# QPC Saved Owner Producer 修复 Delta 独立验证 r001

## Verdict

`PASS_FOR_BOUNDED_PRODUCER_SOURCE_REPAIR / PRODUCT_AND_GOAL_ACCEPTANCE_UNVERIFIED`。本轮独立检查支持 QPC-SOURCE-001 在纯 producer-local 候选中的修复：五类 root/target/provider identity 变化均使当前 owner 终态失效，扩展 runner 对冻结 Cases r004 的 14 项身份运行通过，定向严格 TypeScript 与 ESLint 通过。该结论不代表 Vue/Pinia 接线、产品运行、权限行为或任何 Goal AC 已验收。

## 身份、Context 与范围

Delta Card `S02-QPC-SAVED-OWNER-PRODUCER-delta-validation-r001` canonical SHA-256 为 `f89be4fd75a14019148a3ff6420971b96511be958417d4c1288b44fb4400e4d3`；Context 原始 SHA-256 为 `665cbf4fb7ebbc3a270bb60b8a7f919767b3588659f29149870252f45047fc39`，均与冻结引用相符。Context validate、Card validate/render 通过，required-read 摘要与声明 revision 匹配，`skipped_reads=[]`。

Goal SHA-256 为 `f562da2eb14b84dc8083e138dd2eb8718a58041f01d08163eddf5fb2c71daef0`；Contract r002 为 `005317149a1ba37ec47e4996c536efef60f51f46bea6b9151630a7f810ef35cc`；Cases r004 为 `f6f97ff89bf7a9e4a6dcc3389960ce3e8f22530dcb30042dfdcdf2018bc84f05`。未修改 Contract、Cases、Goal、原始 runner、权限环境或产品接线。Goal 分母保持 10 AC / 26 must-have / 16 product obligations，Scope Delta `none`。

## 修复与行为证据

当前 source SHA-256 `7c78975a04af8d621e06f4ea0e112a025be3207a20ea1b8eb5388914b25352a4`；扩展 runner SHA-256 `9ba31a0619ea10cfbf63d5e4d468b90817ec159c9f0e12f1dab16f29814e4a6e`。逐段检查 `validateOwner`：owner 尚为 ready 时，root 替换/缺失返回 `root_missing_or_changed`；target 缺失、重复、ID/raw reference 更换分别返回合同约定原因；provider identity generation 不同返回 `principal_or_organization_changed`。这些分支均调用同一失效路径：owner 清空、status 置为 `invalid`、generation 加一，并清理活动发布状态。对旧 owner 再验证返回 `owner_invalidated`，不会重复递增 generation。

扩展 runner 的 QPC-PROD-007 对上述五个变体各自创建独立 producer 与 owner，分别断言首次 reason、owner=null、status=`invalid`、generation 恰增一及旧 owner 后续被拒绝。修复后归档 GREEN 输出与本轮复跑均为 exit 0：14 个 case ID 顺序完整，`behavior_mismatch_count=0`、`execution_error_count=0`，QPC-PROD-014 静态边界项 1 项。复跑 stdout 的 source、Cases、Contract 摘要分别为 `7c78975a…52a4`、`f6f97ff8…84f05`、`00531714…35cc`，与当前冻结身份相符。

修复前 RED 依赖已归档的 repair RED 证据：Context 所绑定的 stdout/stderr/exitcode 摘要均与文件匹配；stdout 为 `setup_status=ok`、14 项完整、唯一行为差异归属 QPC-PROD-007（聚合报告五个 identity 变体仍保留 owner）、静态项 QPC-PROD-014、0 execution error；stderr 为空，exit code 为 1，符合预期 RED。归档 stdout 记录当时的 source SHA-256 `b27e8229ba34a5f580a4c0ee6a71a6b2f4bec1134027c61521bb362c9886df7b`。

本轮也在修复后的当前 source 上重跑 `--mode red`，结果为 0 mismatch、0 execution error、exit 2。该 runner 的 RED oracle 明确要求恰有一个 QPC-PROD-007 mismatch，因此修复后回放不再是可信 RED；本报告不把它当作 RED 通过，也没有用它替代归档修复前结果。它与当前 GREEN 结果一致地显示该差异已消失。

## 静态检查与剩余发现

- 单文件 strict TypeScript `noEmit` 检查（ES2022、ESNext、Bundler、`skipLibCheck`、`types=[]`）：0 diagnostics。
- 定向 ESLint：`saved-owner-producer.ts` 与 `saved-owner-producer-repair.test.mjs` 均通过，exit 0。
- 全项目 `npm run ts:check` 未通过：报告 3 个 TS6504，涉及 `src/custom-component/rich-text/DeRichTextViewV3.vue.js`、`src/views/pages/menu/system/watermark/index.vue.js`、`src/views/watermark/index.vue.js`，均为项目 tsconfig include 范围内的 `.vue.js` 文件；定向 source 检查无诊断。此全项目失败保留为验证限制，不归因为本次 producer source。
- 未发现新的 producer-local blocker。QPC-PROD-014 仅检查这个 detached producer 的导出/API 与模型调用计数，不证明整个产品不存在其它 source-read/target-commit 路径。

## 声明边界与后续

真实权限模块及隔离多用户环境尚不可用；只读用户限制、复制/粘贴限制、权限撤销等仍为 `BLOCKED / NOT_RUN`，不使用 standalone 或 admin 替代验收。当前 producer 是无产品接线的内存模型。本报告不验收 Vue/Pinia Store 发布可见性、source-read / target-commit、产品 UI、真实权限，亦不关闭 Goal 的 10 AC / 26 must-have / 16 obligations。

下一步可在既定产品接线与权限环境边界内继续实现其他已准入 S02 工作；本 lane 的后续若要接入 Vue/Pinia 或 source-read/target-commit，需按新范围设计、准入并独立验证。

## 完整 Read Manifest

以下是本 Delta Context 的 17 项 required-read；摘要与 Context 声明一致，`skipped_reads=[]`。

| 文件 | SHA-256 |
| --- | --- |
| `AGENTS.md` | `270940a30f462f2fb0c9a8cf2bbc1dd11750513d8f063ffc376e0e0a2640466e` |
| `.codex/skills/sge-governed-checkpoints-sp010/SKILL.md` | `b3e5d00193f88608e8deb3214071444ce89fa66431daf115b35f72fedbecbe3f` |
| `Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/Goal.final.json` | `f562da2eb14b84dc8083e138dd2eb8718a58041f01d08163eddf5fb2c71daef0` |
| `Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/QueryProductCommitSavedOwnerProducerContract-r002.json` | `005317149a1ba37ec47e4996c536efef60f51f46bea6b9151630a7f810ef35cc` |
| `Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/QueryProductCommitSavedOwnerProducerCases-r004.json` | `f6f97ff89bf7a9e4a6dcc3389960ce3e8f22530dcb30042dfdcdf2018bc84f05` |
| `Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/reviews/QPC-PRODUCER-source-Validation-r001.md` | `e5e69bf57b4298813d6d8e8cf153e70600c817e2ce964f4119d94f0835d1d5c2` |
| `Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/planning/Topology-actual-r231.json` | `6fe1d1bdcd504fd21a5b673431a138f570d81cc4b6854687602b85580c5e672d` |
| `Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/planning/Topology-actual-r232.json` | `8b91a3f8ae257e40a2dccb17afdb94e245b85567373dff48ba9c97249d7463d0` |
| `core/core-frontend/src/custom-component/filter-copy/saved-owner-producer.ts` | `7c78975a04af8d621e06f4ea0e112a025be3207a20ea1b8eb5388914b25352a4` |
| `core/core-frontend/tests/filter-copy-query-saved-canvas-owner-producer/saved-owner-producer-repair.test.mjs` | `9ba31a0619ea10cfbf63d5e4d468b90817ec159c9f0e12f1dab16f29814e4a6e` |
| `core/core-frontend/QPC-PRODUCER-REPAIR-r001-RED.stdout.txt` | `fe31d15b376f78f0b04e34bac2af3be3833063dabcc5baf1cfb50d06823847d3` |
| `core/core-frontend/QPC-PRODUCER-REPAIR-r001-RED.stderr.txt` | `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855` |
| `core/core-frontend/QPC-PRODUCER-REPAIR-r001-RED.exitcode.txt` | `4355a46b19d348dc2f57c046f8ef63d4538ebb936000f3c9ee954a27460dd865` |
| `core/core-frontend/QPC-PRODUCER-REPAIR-r001-GREEN.stdout.txt` | `94771a006d23c9b006ae436e114036a5941806fd716ab08f7299bbb43b0f40e9` |
| `core/core-frontend/QPC-PRODUCER-REPAIR-r001-GREEN.stderr.txt` | `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855` |
| `core/core-frontend/QPC-PRODUCER-REPAIR-r001-GREEN.exitcode.txt` | `9a271f2a916b0b6ee6cecb2426f0b3206ef074578be55d9bc94f6f3fe3ab86aa` |
| `core/core-frontend/src/custom-component/filter-copy/query-single-select-saved-canvas-owner.ts` | `f475e94fd51c70a6d634ff80caf0cc35d5430556bedf5e5312b8d09f1dd94130` |
