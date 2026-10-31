# Saved Canvas Owner RED r002 独立增量 Validation

Verdict：`NEEDS_RUNNER_REPAIR / NOT_ACCEPTED_FOR_SOURCE_ADMISSION`。

本轮RED行为执行本身可复现且已修复SCRED-01/02；但同一冻结runner的SCRED-03仍未关闭，不能把它当作可直接进入同身份GREEN的可信基线而准入helper源码。

## 独立重跑

在core/core-frontend执行 `node tests/filter-copy-query-saved-canvas-owner/saved-canvas-owner.test.mjs --mode red`。实际exit1、setup_status=ok、40 behavior mismatch、0 unexpected match、0 execution error、0 static case、red_candidate=true；40 ID各一次、顺序与fixture一致。stderr为空，解析后的完整输出与durable r002 stdout完全一致。精确source路径不存在；未运行GREEN或创建回归。

Node v24.21.0，esbuild0.25.12。原r002 identity与stdout内identity及独立重算一致：

- runner：8c4e6f129c896e59ef5aa84d1f9347b990901fe0d1bd39c616472b1d6641a083
- fixture：f209c9552d2807e628c8334d5e2164114837ec9af2a4592b1332d89715d9a822
- contract：268225f040bc1062e9e62dc071bcd43fa75542c6943300e5f49fd07fc0926d82
- 有序40 ID摘要（UTF-8紧凑JSON数组）：0daad717edfc070a5fa825b8fc26f1ca4edc2b1453805bb422ee36343d36394b

## Finding disposition

SCRED-01关闭：runRed复用runCase构造每例真实对象图与current context，并以expectedBegin按begin优先级确定首步oracle，不再使用case终态错误冒充begin错误。首个mismatch结束本case符合本批40例均首步begin的合同。

SCRED-02关闭：resolveRef剥离objects前缀后解析实际对象，mutateArrayItem读取replacement并直接resolve descriptor，removeArrayItem同样正确。未运行GREEN，因此此处是源码核对结论，不是其后续步骤运行通过。

SCRED-03部分修复，仍阻断冻结：创建回归spawnSync及两个强制未实现环境变量清除已加入；second_error开始覆盖第二次register，context每次显式API调用前后引用比较已加入。但是以下旧发现仍存在：

1. **040的generation仍取错回执。** actual.generation来自正常当前owner的finalState，值为0；040要求外来owner validateRegistration返回generation=null。现有owner确实由首个begin签发，所以无符合合同的helper能让该汇总断言通过。应对040使用该步完整RegistrationValidity，不从另一owner借字段。
2. **未逐步断言完整API形状。** runCase记录results后仍只比较fixture汇总expected键。没有验证每步完整discriminated shape、允许键集合及owner/token类型。GREEN返回额外授权字段等可被遗漏，而authorization_claim直接设为none。
3. **静态排除仍由常量填充。** source_read、paste_commit、create_owner_called等直接false，未实现合同要求的实际依赖/API边界验证。buildModule主动只re-export单一factory，因此Object.keys(module)不能证明原source仅有这个export。应检查原模块导出/源码依赖与实际公开返回，静态声明不得自证。
4. **回归依赖身份不完整。** GREEN只校验creation_regression_dependencies[0]，另三个冻结fixture摘要未在执行门槛核对，identity也未记录它们。应逐项核验并持久化依赖身份，避免RED/GREEN使用不同回归输入而不知。

## Repair与声明上限

仅修runner并重新采集新身份RED，保持40例/合同不变及source absent；无需写helper来暴露040这个确定的harness矛盾。当前原始r002输出保留，不改写。新runner得到独立认可后，才可另行申请exact source admission。

本次没有改runner/fixture/contract/source、没有跑GREEN/创建回归。完整10/26/16、Scope Delta none、S01独立；真实权限BLOCKED/NOT_RUN、QPC产品接线NOT_READY_FOR_PRODUCT_UI_STORE保持。仅本报告写入，不宣称helper实现或产品验收。

## Read manifest

Card canonical SHA256 `9f719e4cc206e8a0483266cf6a7234e85b07ddc2b467d2ddb3fdf07040c402cf` validate/render通过；Context raw摘要匹配card，Context validate通过。以下20项required-read摘要入口/收尾无漂移；另读取Topology-r200作为当前派发状态（Context仍绑定r199），不改写其authority：

- `AGENTS.md` — `270940a30f462f2fb0c9a8cf2bbc1dd11750513d8f063ffc376e0e0a2640466e`
- `.codex/skills/sge-governed-checkpoints-sp010/SKILL.md` — `b3e5d00193f88608e8deb3214071444ce89fa66431daf115b35f72fedbecbe3f`
- `Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/Goal.final.json` — `f562da2eb14b84dc8083e138dd2eb8718a58041f01d08163eddf5fb2c71daef0`
- `Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/QuerySingleSelectSavedCanvasOwnerImplementationContract-r003.json` — `268225f040bc1062e9e62dc071bcd43fa75542c6943300e5f49fd07fc0926d82`
- `Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/QuerySingleSelectSavedCanvasOwnerDesign-r004.md` — `f7d430ed4801b647efd44499b37d86677563e466d3e216380aba6261ab9e4d59`
- `Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/QuerySingleSelectSavedCanvasOwnerCases-r004.json` — `f209c9552d2807e628c8334d5e2164114837ec9af2a4592b1332d89715d9a822`
- `Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/reviews/QuerySingleSelectSavedCanvasOwnerImplementationContractReview-r003.md` — `5f434be1128fa5215b2bba8c5fa22bd00b5e37438836a5ecc4331b961bc00425`
- `core/core-frontend/tests/filter-copy-query-saved-canvas-owner/saved-canvas-owner.test.mjs` — `8c4e6f129c896e59ef5aa84d1f9347b990901fe0d1bd39c616472b1d6641a083`
- `core/core-frontend/tests/filter-copy-query-reference/query-single-select-session.test.ts` — `2c58be150c8575636b55627fc1949f1beaf943cd5c562ad0e7be7c72825c6f03`
- `Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/PermissionEnvironment.md` — `bf1498aa23f4f864e2c5c3d999b6b1a6044849ba25a9cd7d7d85104b6f233b9d`
- `Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/planning/Topology-actual-r199.json` — `90f968acef2d75f61215db7d7fd8e2f90cb1ea4b3d80f1d63efd26fba6c1a932`
- `Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/planning/evidence/SAVED-CANVAS-OWNER-RED-r001.stdout.txt` — `3caae840607c9d7ddbe8ef15fcb6ce8988ffbea49bd89ff9683cd26fb7793f36`
- `Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/planning/evidence/SAVED-CANVAS-OWNER-RED-r001.stderr.txt` — `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`
- `Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/planning/evidence/SAVED-CANVAS-OWNER-RED-r001.exitcode.txt` — `4355a46b19d348dc2f57c046f8ef63d4538ebb936000f3c9ee954a27460dd865`
- `Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/planning/evidence/SAVED-CANVAS-OWNER-RED-r001.identity.json` — `3c8ee0f7e5639209529f3ab2669e6e94fa271942089e007aeddea51ee7c013b8`
- `Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/planning/evidence/SAVED-CANVAS-OWNER-RED-r002.stdout.txt` — `42ece40963b55aad47ac93aba9ba13c147181f334b72b03f6feeff3f2a6beda5`
- `Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/planning/evidence/SAVED-CANVAS-OWNER-RED-r002.stderr.txt` — `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`
- `Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/planning/evidence/SAVED-CANVAS-OWNER-RED-r002.exitcode.txt` — `4355a46b19d348dc2f57c046f8ef63d4538ebb936000f3c9ee954a27460dd865`
- `Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/planning/evidence/SAVED-CANVAS-OWNER-RED-r002.identity.json` — `f34be0f28ea1180b29c69777c5ff2f6af7d61c99daa38d1e90273e6b20d08d9f`
- `Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/reviews/SAVED-CANVAS-OWNER-RED-Validation-r001.md` — `f77f46bdd78cd017224faa0ec5d2ffca7e3833da6ab1e0a7c88e0828ef13b43b`
