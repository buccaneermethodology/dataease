# Saved Canvas Owner source 独立 Validation r001

Verdict：`NEEDS_SOURCE_REPAIR`。冻结40例与创建型回归独立运行通过；源码存在确定TypeScript类型错误，不能仅以esbuild转译成功完成源码交付。产品接线依旧不获授权。

## 身份与独立运行

Card canonical SHA256 `595218a958d0533cdb73fe7346ae05fa8db35f93e3e2e0595bf253eb7eb6fe1c` validate/render通过；Context raw摘要匹配card且validate通过；required-read摘要入口/收尾均无漂移。

在core/core-frontend独立执行 `node tests/filter-copy-query-saved-canvas-owner/saved-canvas-owner.test.mjs --mode green`：exit0、stderr为空、setup ok、40/40 pass、0 execution error、0 behavior mismatch；创建型回归exit0，stdout明确M0+lifecycle PASS。原GREEN-r002与独立结果的行为/身份字段相同；嵌套创建回归stderr只有Node MODULE_TYPELESS_PACKAGE_JSON警告中的进程PID变化，不作为输出逐字相同声明。

- source SHA256：`5592e60c441c06b3fd5d27c5b714b9f541517cec71fc443fd092aa75f89509a2`
- runner SHA256：`5539326540d67c8c352e91bee1611d7783e6f02bd961b7030510f877b600dfc4`
- fixture SHA256：`f209c9552d2807e628c8334d5e2164114837ec9af2a4592b1332d89715d9a822`
- contract SHA256：`268225f040bc1062e9e62dc071bcd43fa75542c6943300e5f49fd07fc0926d82`

RED-r004 identity与独立GREEN identity完全一致，包含runner/fixture/contract、40有序ID、Node v24.21.0/esbuild0.25.12和四项创建回归依赖；这些文件bytes重新核对与绑定一致。GREEN-r001的stdout/stderr/exitcode仍保留，exit2，stderr记录018/019/027等失效reason未返回的历史失败；未被本轮GREEN覆盖。

## 源码状态机复核

五个API只操作闭包WeakMap/Map及opaque frozen handles/tokens。begin优先级、三处资源ID匹配、canvas/root引用绑定、双字段VQuery判据、重复ID与同raw重注册token复用、同root注册目标变更失效、generation只增加一次、外来owner/token、旧epoch终结均与本切片设计相符。validate第一次失效返回触发reason，其后OWNER_INVALIDATED；validateRegistration终结返回OWNER_INVALIDATED，与已冻接口边界一致。没有导入Store/UI/权限或调用业务提交。

GREEN静态结果为单一source runtime input，factory公开表面符合合同；source_read/paste_commit/create_owner_called均由检查计算为false，authorization_claim为none。这只证明所审detached模块静态边界，不证明真实加载producer或权限。

## 唯一阻断 finding

### SCSRC-01 / 中：unknown[]成员未收窄，源码有6个TS2339

OwnerRecord.root声明unknown[]，但注册与共享复验直接访问component?.id、matches[0]?.component/innerType。optional chaining只处理null/undefined，不把unknown收窄为记录。

独立使用已安装typescript API建立只包含该source的createProgram，选项noEmit=true、strict=true、target ES2022、module ESNext、moduleResolution Bundler、skipLibCheck=true、types=[]；没有生成或修改文件。实际diagnostics：

- 129:66 — Property id does not exist on type {}。
- 132:21、133:21 — component、innerType不存在。
- 218:64 — id不存在。
- 224:20、224:57 — component、innerType不存在。

均为TS2339，来自本次新source，而不是仓库其它基线文件。esbuild会移除TS类型但不执行此类类型检查，所以40例pass不能覆盖。

最小修复：使用明确记录类型守卫收窄root成员后读取字段，保持对不可信/畸形成员的拒绝语义；不要扩大any或改变fixture、runner、合同。修后按精确source admission更新源码，保留失败与本轮GREEN证据；重跑同身份GREEN/创建回归及定向noEmit检查，再独立复验。

## 声明上限

本报告不批准产品UI/Store、readDesign、source-read、copy/paste、commit、preview/query/history/save或权限接线。Goal10/26/16、Scope Delta none、S01独立、真实权限BLOCKED/NOT_RUN、QPC产品入口NOT_READY_FOR_PRODUCT_UI_STORE保持。仅写报告，未修改源码/runner/fixtures/contract或运行产品权限测试。

## Read Manifest

- `AGENTS.md` — `270940a30f462f2fb0c9a8cf2bbc1dd11750513d8f063ffc376e0e0a2640466e`
- `.codex/skills/sge-governed-checkpoints-sp010/SKILL.md` — `b3e5d00193f88608e8deb3214071444ce89fa66431daf115b35f72fedbecbe3f`
- `Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/Goal.final.json` — `f562da2eb14b84dc8083e138dd2eb8718a58041f01d08163eddf5fb2c71daef0`
- `Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/QuerySingleSelectSavedCanvasOwnerImplementationContract-r003.json` — `268225f040bc1062e9e62dc071bcd43fa75542c6943300e5f49fd07fc0926d82`
- `Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/QuerySingleSelectSavedCanvasOwnerDesign-r004.md` — `f7d430ed4801b647efd44499b37d86677563e466d3e216380aba6261ab9e4d59`
- `Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/QuerySingleSelectSavedCanvasOwnerCases-r004.json` — `f209c9552d2807e628c8334d5e2164114837ec9af2a4592b1332d89715d9a822`
- `Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/reviews/QuerySingleSelectSavedCanvasOwnerImplementationContractReview-r003.md` — `5f434be1128fa5215b2bba8c5fa22bd00b5e37438836a5ecc4331b961bc00425`
- `core/core-frontend/tests/filter-copy-query-saved-canvas-owner/saved-canvas-owner.test.mjs` — `5539326540d67c8c352e91bee1611d7783e6f02bd961b7030510f877b600dfc4`
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
- `Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/reviews/SAVED-CANVAS-OWNER-RED-Validation-r003.md` — `9c6c11b02cf103eb90f03cefca91e945bd9c3cbbd1cf011d91e08245a8806350`
- `Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/planning/Topology-actual-r204.json` — `611dd33d37c90aed41390b35f3ad59124a14dedf321fa80fd99e7854da0286f2`
- `core/core-frontend/tests/filter-copy-query-saved-canvas-owner/saved-canvas-owner.test.mjs` — `5539326540d67c8c352e91bee1611d7783e6f02bd961b7030510f877b600dfc4`
- `Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/planning/evidence/SAVED-CANVAS-OWNER-RED-r004.stdout.txt` — `d14fefc41e44f479427518b01fde35549f72468e3dbfde3c582e1ad1346d524d`
- `Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/planning/evidence/SAVED-CANVAS-OWNER-RED-r004.stderr.txt` — `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`
- `Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/planning/evidence/SAVED-CANVAS-OWNER-RED-r004.exitcode.txt` — `4355a46b19d348dc2f57c046f8ef63d4538ebb936000f3c9ee954a27460dd865`
- `Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/planning/evidence/SAVED-CANVAS-OWNER-RED-r004.identity.json` — `bae7bf5c684ef454a1dd9f663eeed03b62b428c90a51b0016af4e5c5813d2642`
- `Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/planning/Topology-actual-r207.json` — `45a5003fead3c8317c853ef91e36bb734c4b1417a8e0c443660a460e1dd389d2`
- `core/core-frontend/src/custom-component/filter-copy/query-single-select-saved-canvas-owner.ts` — `5592e60c441c06b3fd5d27c5b714b9f541517cec71fc443fd092aa75f89509a2`
- `Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/reviews/SAVED-CANVAS-OWNER-RED-Validation-r004.md` — `5d288a57afeba8cfa0710676901b8fb5aee36a6f3d1693c0b8ba830ac429009c`
- `Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/planning/evidence/SAVED-CANVAS-OWNER-RED-r004.identity.json` — `bae7bf5c684ef454a1dd9f663eeed03b62b428c90a51b0016af4e5c5813d2642`
- `Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/planning/evidence/SAVED-CANVAS-OWNER-GREEN-r002.stdout.txt` — `9c65eb1a1393eb3641b4c4951562c5280091ce91936e14fb613c9d79bbce2165`
- `Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/planning/evidence/SAVED-CANVAS-OWNER-GREEN-r002.stderr.txt` — `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`
- `Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/planning/evidence/SAVED-CANVAS-OWNER-GREEN-r002.exitcode.txt` — `9a271f2a916b0b6ee6cecb2426f0b3206ef074578be55d9bc94f6f3fe3ab86aa`
- `Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/planning/evidence/SAVED-CANVAS-OWNER-GREEN-r002.identity.json` — `bae7bf5c684ef454a1dd9f663eeed03b62b428c90a51b0016af4e5c5813d2642`
- `Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/planning/evidence/SAVED-CANVAS-OWNER-GREEN-r001.stdout.txt` — `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`
- `Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/planning/evidence/SAVED-CANVAS-OWNER-GREEN-r001.stderr.txt` — `2d49dd2cc3f311a8b745708566d984ed9d20b7e3c75e449a22cb932f4df8f18f`
- `Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/planning/evidence/SAVED-CANVAS-OWNER-GREEN-r001.exitcode.txt` — `53c234e5e8472b6ac51c1ae1cab3fe06fad053beb8ebfd8977b010655bfdd3c3`
