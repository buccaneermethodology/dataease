# ST-SRC-001 infoFormat 局部 harness Builder 证据 r001

- 时间：2026-10-20T19:37:02.587872+00:00
- Contract：`QueryProductAdapterSelectTextSourceHarnessContract-r001.json`；冻结 `ST-SRC-001/CREATE`，源 Cases r003、设计 Review r003 与 Delta Validation r002。
- Execution admission：`planning/execution-admission-st-src-001-infoformat-harness-builder-r001.json`，builder target 仅为新增 runner 与本证据。Context、Lane Card 与 admission 均已通过各自确定性校验。
- Runner：`core/core-frontend/tests/filter-copy-query-select-text-source/info-format-harness.mjs`，SHA-256 `e5ad9536160635ca287010eec42db161cd62ef11f3d5b02353fea144fe25323d`。仅解析 TypeScript AST 并提取 `infoFormat` initializer；未导入/求值 `options.ts` 模块，不运行 `attributes` 初始化，不触及产品源码。

## 执行结果

- 可信负向控制：对同一 runner 临时将结果 `id` 变异为 `mutant`，同一 `ST-SRC-001/CREATE` 精确返回快照断言如预期失败；未保存临时变异，finally 恢复原字节，恢复前后 SHA-256 相同。
- 恢复后的 GREEN：`node tests/filter-copy-query-select-text-source/info-format-harness.mjs` 通过，完整局部返回快照、输入不变、Date=2、guid=1、`defaultValueFirstItem` 所有权断言通过。
- 定向 ESLint：`./node_modules/.bin/eslint tests/filter-copy-query-select-text-source/info-format-harness.mjs` 通过。
- 负向验证仅为 harness 的输出变异检测，不是针对产品源码的 RED；产品源码未变。

## 声明上限

只说明 AST 提取的当前 `infoFormat` initializer 在冻结 CREATE 输入下符合局部返回 oracle。没有执行 SFC/UI/Store/API、网络、真实权限、保存/重开/历史行为；不关闭 Goal AC，不证明产品验收或 Goal 完成。ST-SRC-006/007 仍未就绪，S01 F01 仍 `CONDITIONAL`，真实多用户权限仍 `BLOCKED / NOT_RUN`。
