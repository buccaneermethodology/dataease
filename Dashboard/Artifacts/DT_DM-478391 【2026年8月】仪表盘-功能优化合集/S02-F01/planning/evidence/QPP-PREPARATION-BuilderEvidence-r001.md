# QPP-PREPARATION-001 Builder 执行证据 r001

## 范围与声明

本记录绑定 `QueryProductPastePreparationContract-r001.json`、`QueryProductPastePreparationFixtures-r006.json` 与 `QueryProductPastePreparationDesignReview-r006.md`。实现仅新增 detached 纯准备/复验 helper 及同身份 fixture runner；原 Goal 分母保持 10 项 Goal AC、26 项 must-have、16 项产品义务，`Scope Delta: none`。不表示产品接线、权限行为、保存重开或 S02 完成。

## 冻结输入与摘要

| 对象 | SHA-256 |
| --- | --- |
| Goal.final.json | `f562da2eb14b84dc8083e138dd2eb8718a58041f01d08163eddf5fb2c71daef0` |
| Completion Contract r001 | `28e7caa0f4e0e4f2ccd54717cfc7b2fd761e252548ec1ddbf03ad2fad01053ea` |
| Design r006 | `e95436c10ce9ad6bf1a3540fdcb908a87e94649a42b86d4407cb12fb75dd23af` |
| Independent Design Review r006 | `f8b3625a4f601ba7e5e5896ea2732cb48836bf224b609f92c3c63e1ad859ceaa` |
| Frozen Fixtures r006 | `26e89c627d996fa54597e9b1ef969100adb46868e3221a4dc1648d3effcedd7c` |
| Final runner | `b17e798c6a1d55f9120e4cf8081bebda6225e121716f4678de741cf30bc07ab4` |
| Final implementation | `5adbb83d363b260a6996709696df322e6a77d851e4bb86a391f22bb32a1093d3` |

## RED / GREEN

- RED：使用同一 runner、同一 31 个冻结 case。临时语义 mutant 在第二次准备调用返回错误的 `TARGET/TARGET_VERSION_MISMATCH`，首个基线调用仍建立有效句柄；结果 `FAIL 1/31 frozen cases; cases=QPP-001`，退出码 1。RED mutant 源码 SHA-256：`3367cc333d4b805468dd0b50edc8ba203d6a79abb28880c90cb3a76b1b6b1020`。stdout 摘要原文：`FAIL 1/31 frozen cases; cases=QPP-001`、`QPP-001: prepare success`、`false !== true`。stderr 为 Node `MODULE_TYPELESS_PACKAGE_JSON` 警告，提示该 `.ts` runner 未声明 package module type，随后按 ES module 重新解析；无其他 stderr。
- GREEN：恢复最终实现并运行同一 runner，结果 `PASS 31 frozen cases`，退出码 0。运行源码 SHA 与最终实现一致：`5adbb83d363b260a6996709696df322e6a77d851e4bb86a391f22bb32a1093d3`。stderr 同样只有上述 Node module-type 性能警告。
- 早先一次 RED 探针因 stub 未能建立 runner 所需的有效基线，在 fixture 执行前触发 runner 前置断言；该次不作为 RED 证据，也未改变冻结文件。随后使用上列语义 mutant 完成有效 RED。

## 定向质量检查

- `prettier --write` 仅格式化准入内的 helper 与 runner；格式化后已重跑 RED/GREEN。
- `eslint src/custom-component/filter-copy/query-product-paste-preparation.ts tests/filter-copy-query-reference/query-product-paste-preparation.test.ts`：退出码 0。
- `npm run ts:check`：未通过。失败仅报告仓库既有三个 `.vue.js` 文件被 `src/**/*` 匹配并触发 TS6504：`src/custom-component/rich-text/DeRichTextViewV3.vue.js`、`src/views/pages/menu/system/watermark/index.vue.js`、`src/views/watermark/index.vue.js`。这不能解释为本 helper 类型检查通过或失败。
- `git diff --check`（限 helper 与 runner）：退出码 0。

## 证据上限与后续

本记录是 Builder 自检证据，不是独立 Validation。下一步由独立 Validation 检查最终实现、runner、冻结输入摘要及完整差异；通过前不把该候选标记为独立有界通过。产品适配/提交、UI/Store/预览/查询/保存以及完整 Goal 验收仍开放。真实权限实现和隔离多用户测试环境仍不可用；只读用户限制、权限撤销与恢复保持 `BLOCKED / NOT_RUN`，不得用 standalone/admin 或 mock 替代。
