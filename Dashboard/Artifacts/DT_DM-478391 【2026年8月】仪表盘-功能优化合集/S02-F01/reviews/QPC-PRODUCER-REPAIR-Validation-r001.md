# QPC Saved Owner Producer Repair 独立 Validation r001

## Verdict

**`PARTIAL / RED_NOT_VALID`。** 当前 producer-local 14-case GREEN 通过，支持有界的 owner 生命周期候选结论；本轮 RED 是 exit 2 且无 mismatch，不是可信 RED。历史 repair RED 虽记录预期 fingerprint，但未绑定当前 repair runner 摘要，不能替代当前可信 RED。该切片不获得完整 Validation PASS。

## 输入身份与读集

独立 Validator 为 `/root/qpc_repair_validator`。Contract r002 SHA-256 `005317149a1ba37ec47e4996c536efef60f51f46bea6b9151630a7f810ef35cc`、Cases r004 SHA-256 `f6f97ff89bf7a9e4a6dcc3389960ce3e8f22530dcb30042dfdcdf2018bc84f05` 与 Bootstrap / Admission / 本次执行一致；Bootstrap validate 通过，17 项 required-read 均可读取，`skipped_reads=[]`。修复前源码摘要为 `a43f85e767044fe35b2a8fa0a52506a78563c7dc1e07825dee90f111d916ce68`，当前源码摘要为 `7c78975a04af8d621e06f4ea0e112a025be3207a20ea1b8eb5388914b25352a4`；当前 repair runner SHA-256 为 `9ba31a0619ea10cfbf63d5e4d468b90817ec159c9f0e12f1dab16f29814e4a6e`。Admission 固定 runner 路径但未固定其摘要。

| Required read | SHA-256 | 当前 |
|---|---|---|
| `AGENTS.md` | `270940a30f462f2fb0c9a8cf2bbc1dd11750513d8f063ffc376e0e0a2640466e` | present |
| `.codex/skills/sge-governed-checkpoints-sp010/SKILL.md` | `b3e5d00193f88608e8deb3214071444ce89fa66431daf115b35f72fedbecbe3f` | present |
| `Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/Goal.final.json` | `f562da2eb14b84dc8083e138dd2eb8718a58041f01d08163eddf5fb2c71daef0` | present |
| `Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/QueryProductCommitSavedOwnerProducerContract-r002.json` | `005317149a1ba37ec47e4996c536efef60f51f46bea6b9151630a7f810ef35cc` | present |
| `Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/QueryProductCommitSavedOwnerProducerCases-r004.json` | `f6f97ff89bf7a9e4a6dcc3389960ce3e8f22530dcb30042dfdcdf2018bc84f05` | present |
| `Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/QueryProductCommitSavedOwnerProducerDesign-r001.md` | `5f98c2c913b8a080de7f796b64271963ba216433354e411cefbe29cd8bf4aa5a` | present |
| `Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/reviews/QueryProductCommitSavedOwnerProducerContractReview-r002.md` | `48d647b467c6326b7953dc2ffa623f50600f949ac2986de2a54841ec35b60f2e` | present |
| `Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/reviews/QueryProductCommitSavedOwnerProducerCasesReview-r004.md` | `404764b9e0e9628e81002aa62cdf0cfe334dfe6681f4ab43d4123d4cc188f4ba` | present |
| `Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/reviews/QPC-PRODUCER-source-Validation-r001.md` | `e5e69bf57b4298813d6d8e8cf153e70600c817e2ce964f4119d94f0835d1d5c2` | present |
| `Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/reviews/QPC-PRODUCER-runner-Validation-r001.md` | `b53184f9d4086a7b1a58650bea2c5f11a18700ab1f8add27395e05c82c351d23` | present |
| `Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/planning/Topology-actual-r230.json` | `892b5a0e64bd2c860609a89a3bc4e9510f668e542951ce1b65679a898c6d0007` | present |
| `Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/planning/Topology-actual-r231.json` | `6fe1d1bdcd504fd21a5b673431a138f570d81cc4b6854687602b85580c5e672d` | present |
| `core/core-frontend/src/custom-component/filter-copy/saved-owner-producer.ts` | `a43f85e767044fe35b2a8fa0a52506a78563c7dc1e07825dee90f111d916ce68` | present |
| `core/core-frontend/tests/filter-copy-query-saved-canvas-owner-producer/saved-owner-producer.test.mjs` | `75bd0543eaf00c924d5ec4c87784fd48f3a93f651cb13b3765c3455350c01f57` | present |
| `core/core-frontend/QPC-PRODUCER-GREEN-r001.stdout.txt` | `28b26412a9350a4dcedc71bca85e07565979a68e965fb42df47175954dc9ed0e` | present |
| `core/core-frontend/QPC-PRODUCER-GREEN-r001.stderr.txt` | `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855` | present |
| `core/core-frontend/QPC-PRODUCER-GREEN-r001.exitcode.txt` | `9a271f2a916b0b6ee6cecb2426f0b3206ef074578be55d9bc94f6f3fe3ab86aa` | present |

## RED / GREEN

- 当前 RED：exit 2，14/14 case 到达，0 behavior mismatch、1 static case、0 execution error。Runner 只在 QPC-PROD-007 出现预期 mismatch 时返回 exit 1；当前无 mismatch，因此本次 RED 无效。
- 当前 GREEN：exit 0，14/14 case 到达，0 mismatch、1 static case、0 execution error；输出绑定当前源码摘要 `7c78975a04af8d621e06f4ea0e112a025be3207a20ea1b8eb5388914b25352a4`。
- 定向 ESLint 通过；定向 TypeScript strict 检查为 0 diagnostics。
- 本轮实际输出摘要：RED stdout `1b022f3aec931b1a4aee57209c24145bdec790d2e5bd5467a4d47c9099e8b137`，GREEN stdout `94771a006d23c9b006ae436e114036a5941806fd716ab08f7299bbb43b0f40e9`。RED stderr 为空、exit code 2；GREEN stderr 为空、exit code 0。

## Findings 与边界

1. **阻断：缺少与当前 runner 身份绑定的可信 RED。** 历史 repair RED 是 exit 1 / QPC-PROD-007 mismatch，但没有 runner 摘要绑定；当前 RED 已绿，不能回填为同身份 RED。保留该差异，不注入人为故障或把 exit 2 解释为预期失败。
2. **非阻断：当前 runner SHA 未写入原 Admission。** 本轮对 runner 实际字节作了复算，但 admission 只固定目标路径；复用该 admission 不能单独证明 runner 身份由准入时冻结。
3. **有界实现观察：** QPC-PROD-007 对 root replacement、target missing/ambiguous/raw replacement 与 provider identity change 分别验证首次原因、owner 清空、`invalid`、generation 单增和旧 owner 后续 `owner_invalidated`；14-case GREEN 通过。只支持 detached producer 模型。

不证明 Vue/Pinia 产品接线、source-read、target-commit、保存/恢复产品链路或权限行为。只读用户查看/复制/粘贴限制、撤权/恢复仍 `BLOCKED / NOT_RUN`。S02 原分母 10 AC / 26 must-have / 16 product obligations，`Scope Delta: none`；Goal 未完成。不得使用 standalone/admin/mock 替代。

## Next

该修复候选不自报关闭；若需要再次推进，须提供能绑定 runner 与修复前源码的真实同身份 RED 来源，或将其明确转为只有 GREEN 的补充证据并经独立决策确认其用途。与此同时继续推进与真实权限、S01及已达三轮上限交付物无依赖的其他设计/build 切片；不得再审 AuthorityMaterials 主包或同一 source trace。
