# QPP-PREPARATION-001 RED 证据修复 r002

## 范围与边界

本轮只修复原独立 Validation 的 RED 可复核缺口。保持生产 helper、QPP r006 frozen fixtures、Contract、Design 和原报告不变；runner 增加受限 source override，新增确定性脚本在同目录生成一次性语义 mutant，再调用同一个 runner。临时 mutant 在 `finally` 中删除。

没有产品 UI/Store/owner/snapshot/query/preview/save/权限接线。fixtures 的 `expected.effects` 仍描述未来产品集成要验证的状态与计数；detached helper 没有这些产品状态入口，因此本轮不把字段存在性、零值或静态边界说成运行时效果观察。该验证边界待独立 Delta Validation 复核并保留给产品集成验收。

## 输入与执行摘要

| 对象 | SHA-256 |
| --- | --- |
| Goal.final.json | `f562da2eb14b84dc8083e138dd2eb8718a58041f01d08163eddf5fb2c71daef0` |
| QPP Contract r001 | `28e7caa0f4e0e4f2ccd54717cfc7b2fd761e252548ec1ddbf03ad2fad01053ea` |
| QPP Design r006 | `e95436c10ce9ad6bf1a3540fdcb908a87e94649a42b86d4407cb12fb75dd23af` |
| QPP Fixtures r006 | `26e89c627d996fa54597e9b1ef969100adb46868e3221a4dc1648d3effcedd7c` |
| Production helper（RED/GREEN前后相同） | `5adbb83d363b260a6996709696df322e6a77d851e4bb86a391f22bb32a1093d3` |
| 同身份 runner r002 | `7a7049eb882d864631dfc2e7b6fa548acd35bf641a8bf4c0ea6d2a7cebc17533` |
| RED replay script | `5bdda2c392db772992e9056d1fa1672438225e6effeec375098950eb2c78f524` |

`node Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/planning/evidence/QPP-PREPARATION-RED-replay-r002.mjs` 以固定 helper SHA 为前置条件，在生产 helper 副本中仅注入“第二次 prepare 调用返回 TARGET/TARGET_VERSION_MISMATCH”的确定 mutant；同一 runner、同一31例执行结果为 `FAIL 1/31 frozen cases; cases=QPP-001`，runner exit 1，replay verifier exit 0。stdout/stderr/exit code 分文件保存。

移除临时 mutant 后，同一 runner 执行 `node tests/filter-copy-query-reference/query-product-paste-preparation.test.ts`，结果 `PASS 31 frozen cases`，exit 0。定向 ESLint 对 helper 与 runner exit 0，无诊断。Node 仅输出既有 `MODULE_TYPELESS_PACKAGE_JSON` 性能警告。原 `npm run ts:check` 的三个仓库既有 TS6504 仍不能作为本 helper 的类型通过证据。

## 变更与复核要求

唯一代码差异是 runner 的 source override 与对应导入路径解析；默认仍加载生产 helper。override 被限制在 `src/custom-component/filter-copy/` 下，RED 脚本核对生产 helper 精确 SHA、唯一变异锚点、预期失败身份并清理临时模块。生产 helper 与 r006 fixture 的摘要在本轮前后不变。

本记录是 Builder evidence，不是独立 Validation。下一步需由独立 Delta Validation 复核脚本可重放、RED/GREEN 同 runner 与冻结输入、变更边界和 `expected.effects` 的有限声明；QPPV-02 若继续开放，应列为产品集成验收未运行，不通过 detached 测试虚构关闭。
