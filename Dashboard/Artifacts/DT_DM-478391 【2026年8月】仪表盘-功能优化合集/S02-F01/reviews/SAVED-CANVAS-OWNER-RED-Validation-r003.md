# Saved Canvas Owner RED r003 独立 Delta Validation

Verdict：`NEEDS_RUNNER_REPAIR / NOT_ACCEPTED_FOR_SOURCE_ADMISSION`。仅剩SCRED-03的完整API类型/联合分支断言未闭合；其余三项修复可接受。

## 独立执行和身份

Card canonical SHA256 `67e3d3f34e156b821fec8e74f1b3b862f9dc929151694d194409f32d1ff31c57` validate/render通过；Context摘要匹配card、validate通过。所有required-read摘要入口/收尾无漂移。

在core/core-frontend独立运行 `node tests/filter-copy-query-saved-canvas-owner/saved-canvas-owner.test.mjs --mode red`：exit1，setup ok，40 behavior mismatch、0 unexpected match、0 execution error、0 static case，red_candidate=true，stderr为空。40 IDs各一次且顺序与fixture一致。解析输出与原r003 stdout完全相同，独立identity与原identity一致。精确source仍不存在。未执行GREEN或创建回归。

重算匹配：runner `de75caa200bbb9e8ff64cec9be5f0b65f69f72e9bbc0a0d4d4dfaf5f3f873875`；fixture `f209c9552d2807e628c8334d5e2164114837ec9af2a4592b1332d89715d9a822`；contract `268225f040bc1062e9e62dc071bcd43fa75542c6943300e5f49fd07fc0926d82`。Node v24.21.0/esbuild0.25.12。四项创建回归依赖均从当前bytes重算并匹配identity及合同。
有序ID SHA256（紧凑UTF-8 JSON数组）：`0daad717edfc070a5fa825b8fc26f1ca4edc2b1453805bb422ee36343d36394b`。

## SCRED处置

SCRED-01/02保持关闭：RED使用共用runCase、真实fixture对象图和首步begin优先级；ref前缀及mutation DSL正确。

SCRED-03：

- 040 generation已优先取最后validateRegistration原始回执，外来owner得到null，不再误取正常owner的0。关闭。
- 静态边界现由真实entryPoint模块导出、esbuild metafile单source依赖及源码调用/权限表面检查计算，不再仅填fixture常量。关闭于有界静态检查，不宣称正则能证明任意动态代码安全；未来独立源码Validation仍必要。
- 四项创建回归依赖由creationRegressionDependencies逐项核验，setup/GREEN均调用且identity持久化完整列表。关闭；GREEN本身未运行。
- 每步调用已新增assertApiShape，extra keys与部分owner/token检查有改善，但完整类型与分支约束仍未实现，见下项。

### SCRED-03-T / 中：assertApiShape只验证多数key集合，没有验证字段值类型及联合分支

register成功分支未断言state='accepted_for_identity_only'和generation为有效非负整数；失败分支未断言state集合、generation与unknown分支的null关系。validate/validateRegistration只按valid===true选择key列表，失败分支甚至未断言valid必须严格false；state、reason/error、registrationIds元素、targetId及generation类型未检查。owner/token的typeof object检查也会接受数组。

例如039的两个register结果generation写成字符串、其它字段正确，当前assertApiShape仍接受；最终generation来自validateRegistration而非register，因此该逐步错误可能不被汇总oracle发现。validate返回valid=0而非false也可穿过key检查，违反已冻结返回合同。这正是要求逐API完整字段key/type断言的原因，不是新增产品范围。

最小修复：在assertApiShape对每个成功/失败分支检查字面state、布尔discriminant、有限非负整数generation或规定的null、字符串error/reason/targetId、字符串数组registrationIds；owner/token须非null非数组object。对额外终态观察回执同样调用该checker。保留已有trigger/terminal分离和040来源修复，不改变40例/合同。

## 后续和声明边界

仅修runner后重新采集RED身份，不写helper源码，不修改fixture/contract。当前RED操作输出可以保留为真实可复现记录，但完整冻结runner尚不满足已审合同，不能据此进入source admission。未运行GREEN/创建回归、未改任何代码，仅写本报告。

完整Goal10/26/16、Scope Delta none、S01独立、真实权限BLOCKED/NOT_RUN和QPC产品接线NOT_READY_FOR_PRODUCT_UI_STORE保持。不把RED通过表面计数当作产品或helper验收。

## 完整Read Manifest

- `AGENTS.md` — `270940a30f462f2fb0c9a8cf2bbc1dd11750513d8f063ffc376e0e0a2640466e`
- `.codex/skills/sge-governed-checkpoints-sp010/SKILL.md` — `b3e5d00193f88608e8deb3214071444ce89fa66431daf115b35f72fedbecbe3f`
- `Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/Goal.final.json` — `f562da2eb14b84dc8083e138dd2eb8718a58041f01d08163eddf5fb2c71daef0`
- `Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/QuerySingleSelectSavedCanvasOwnerImplementationContract-r003.json` — `268225f040bc1062e9e62dc071bcd43fa75542c6943300e5f49fd07fc0926d82`
- `Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/QuerySingleSelectSavedCanvasOwnerDesign-r004.md` — `f7d430ed4801b647efd44499b37d86677563e466d3e216380aba6261ab9e4d59`
- `Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/QuerySingleSelectSavedCanvasOwnerCases-r004.json` — `f209c9552d2807e628c8334d5e2164114837ec9af2a4592b1332d89715d9a822`
- `Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/reviews/QuerySingleSelectSavedCanvasOwnerImplementationContractReview-r003.md` — `5f434be1128fa5215b2bba8c5fa22bd00b5e37438836a5ecc4331b961bc00425`
- `core/core-frontend/tests/filter-copy-query-saved-canvas-owner/saved-canvas-owner.test.mjs` — `de75caa200bbb9e8ff64cec9be5f0b65f69f72e9bbc0a0d4d4dfaf5f3f873875`
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
- `Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/reviews/SAVED-CANVAS-OWNER-RED-Validation-r002.md` — `08064ccf5d8bd108b423780bda480e00fdb26d93abf9282f9747f04065b43899`
- `Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/planning/evidence/SAVED-CANVAS-OWNER-RED-r003.stdout.txt` — `0816590917d5688a2aea04b81bfedc357d241e20116575c9340c466af026175d`
- `Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/planning/evidence/SAVED-CANVAS-OWNER-RED-r003.stderr.txt` — `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`
- `Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/planning/evidence/SAVED-CANVAS-OWNER-RED-r003.exitcode.txt` — `4355a46b19d348dc2f57c046f8ef63d4538ebb936000f3c9ee954a27460dd865`
- `Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/planning/evidence/SAVED-CANVAS-OWNER-RED-r003.identity.json` — `6d6daaa01ca3f389a0b4198145dea76b1b1c1bc210c5a7411e4cb92339dfc37a`
- `Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/planning/Topology-actual-r201.json` — `ffec229d4a35160dd4540ccc1e392ad8a2ee54180cb1bd924c08d5a31e0f7949`
