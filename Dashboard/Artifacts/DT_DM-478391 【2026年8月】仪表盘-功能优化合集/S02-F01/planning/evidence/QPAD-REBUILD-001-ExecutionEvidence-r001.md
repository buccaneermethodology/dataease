# QPAD-REBUILD-001 Builder 执行证据 r001

## 结论边界

本记录只覆盖普通 Select 离线配置重建纯函数候选。实现没有接入产品入口、UI、Store、网络、权限、保存或预览链路。Builder 结果不等于独立 Validation，不代表完整 S02 Goal 完成，也不证明真实用户权限、配置保存重开或运行时行为。真实权限验收仍为 `BLOCKED / NOT_RUN`，没有使用 standalone、admin 或 mock 替代。

## 写入范围

- 新增 `core/core-frontend/src/custom-component/filter-copy/query-ordinary-select-rebuild.ts`。
- 新增 `core/core-frontend/tests/filter-copy-query-reference/query-ordinary-select-rebuild.test.ts`。
- 保存本目录下专属 RED、GREEN、定向 lint stdout/stderr/exit code。
- 未改 Goal、设计、fixtures、review、已有产品模块或任何入口。

## 执行结果

- **RED**：用最终 runner、在实现模块不存在的状态下运行。命令为 `node tests/filter-copy-query-reference/query-ordinary-select-rebuild.test.ts`（工作目录 `core/core-frontend`），exit `1`；12 项均在可执行 oracle 断言层失败，原因是缺少实现后的 `UNIMPLEMENTED` 占位结果，不是模块解析失败。
- **GREEN**：恢复实现后用完全相同 runner 和命令重跑，exit `0`；6/6 冻结 identity 与 6/6 防御断言通过，共 12/12。覆盖输入/计划/目录深冻结、输出深拷贝、源 ID 复用、级联节点错绑、同目标字段冲突、非 JSON 输入以及错误优先级。
- **定向 ESLint**：`./node_modules/.bin/eslint src/custom-component/filter-copy/query-ordinary-select-rebuild.ts tests/filter-copy-query-reference/query-ordinary-select-rebuild.test.ts`，exit `0`。
- **TypeScript 全量检查**：`npm run ts:check` 未通过；诊断仅报告既有 include 范围内的 `DeRichTextViewV3.vue.js` 与两个 `watermark/index.vue.js` 文件的 TS6504（未启用 `allowJs`）。此项不作为实现通过证据。

最终 RED 与 GREEN 的 `RUNNER_SHA256` 均为 `c13e8db5b03c4511e538ea5e3f95580071263070343b9ba13740c062ab432f90`；fixture SHA256 均为 `0b0bc78a268f057356ae4354698949541a450f8ff18ec7b62614fe8474e5edbf`。最终实现 SHA256 为 `b41eb530d0f86a81b0df01b6ce3570b17f57da8036fec08189cc663dd4af056b`。因修正测试 harness 的跨 realm 加载方式，早先一次 RED 使用过不同 runner；它已由上述同 runner RED/GREEN 证据替代，不作为本次可信 RED。

## 后续

需要独立 Validator 只读核对本实现、冻结合同、最终差异与此处 claim ceiling；再由 Goal Controller 判断是否接纳该有限候选。普通 Select 之外的参数、树、默认值、单选、动态日期、真实权限及保存重开仍保留在 Goal 原义务分母中。
