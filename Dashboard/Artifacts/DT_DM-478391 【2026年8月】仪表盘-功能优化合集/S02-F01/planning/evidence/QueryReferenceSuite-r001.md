# 查询引用候选测试执行记录 r001

## 结果与边界

2026-10-21 在当前 checkout 对 `core/core-frontend/tests/filter-copy-query-reference/` 下的 17 个 `*.test.ts` 文件逐个执行 `node --experimental-strip-types <file>`：17 个进程全部退出码 0。完整标准输出保存在同目录 `QueryReferenceSuite-r001.stdout.log`。

定向 ESLint 命令 `./node_modules/.bin/eslint src/custom-component/filter-copy tests/filter-copy-query-reference` 退出码 0，无诊断。`npm run ts:check` 退出码 2，报告 3 个 TS6504：

- `src/custom-component/rich-text/DeRichTextViewV3.vue.js`
- `src/views/pages/menu/system/watermark/index.vue.js`
- `src/views/watermark/index.vue.js`

当前检查未核实这些诊断是否为历史基线。命令输出分别归档在同目录 `QueryReferenceSuite-r001.eslint.*.log` 和 `QueryReferenceSuite-r001.tscheck.*.log`。

## 执行的测试文件

1. `query-ordinary-select-rebuild.test.ts`
2. `query-product-paste-preparation.test.ts`
3. `query-reference-pipeline.test.ts`
4. `query-reference-plan.test.ts`
5. `query-schema-projection.test.ts`
6. `query-single-select-carrier.test.ts`
7. `query-single-select-created-lifecycle.test.ts`
8. `query-single-select-default-copy.test.ts`
9. `query-single-select-end-to-end.test.ts`
10. `query-single-select-manual2-pure.test.ts`
11. `query-single-select-observation-async.test.ts`
12. `query-single-select-query-payload.test.ts`
13. `query-single-select-rebuild.test.ts`
14. `query-single-select-session.test.ts`
15. `query-single-select-target-rebuild.test.ts`
16. `query-single-select-value-state.test.ts`
17. `query-text-single-select-value-state.test.ts`

## Claim ceiling

该执行记录只说明列出的本地候选/纯逻辑测试和定向 lint 在当前 checkout 的结果。它不是独立 Validation，不证明产品 UI/Store 接线、真实身份与权限、只读拒绝、权限撤销/恢复、持久化保存重开、Goal AC 通过或 S02 Goal 完成。Goal 完整分母仍为 10 项 AC、26 项 must-have、16 项产品义务，`Scope Delta: none`。S01 F01 Entry Packet 仍为 `CONDITIONAL`；真实多用户权限环境仍为 `BLOCKED / NOT_RUN`；Authority Materials 主包仍为第 3/3 轮 `NEEDS_REVISION`（AM-09）。
