# QVALUE-001 验证交接包 r001

## 交接目标

请对 QVALUE-001 修复后的有界纯函数候选做 Delta/Final-state 独立 Validation。原始任务仍是完成 S02 的完整过滤器复制粘贴 Goal；本轮只验证一个不依赖真实权限环境的技术切片。

## 声称范围

九键普通单选值投影被严格验证后生成七键 design 与独立九键 runtime；design 不含运行字段，runtime 从 defaultValue/defaultMapValue 重建。无环共享引用输入可接受，真实循环仍拒绝。冻结十个原始 case 保持不变，另有共享引用隔离检查。

## 产物与证据

- 实现：[query-single-select-value-state.ts](../../../../core/core-frontend/src/custom-component/filter-copy/query-single-select-value-state.ts)
- Runner：[query-single-select-value-state.test.ts](../../../../core/core-frontend/tests/filter-copy-query-reference/query-single-select-value-state.test.ts)
- 首轮独立 Validation（partial）：[QVALUE-001-Validation-r001.md](../reviews/QVALUE-001-Validation-r001.md)
- 修复执行证据：[QVALUE-001-RepairEvidence-r001.md](evidence/QVALUE-001-RepairEvidence-r001.md)
- 最终 runner 的 RED/GREEN/lint r002 原始日志：同目录 `QVALUE-001-{red,green,lint}-r002.*`
- 设计合同、Fixtures 与独立设计审查：本目录 `QuerySingleSelectValueStateDesign-r001.md`、`QuerySingleSelectValueStateFixtures-r001.json`、`reviews/QuerySingleSelectValueStateDesignReview-r002.md`。
- 原始范围对账：[ScopeDeltaAudit-r001.md](ScopeDeltaAudit-r001.md)。

## 明确非目标与限制

不验证完整查询 condition 提取、完整 carrier、产品 UI/Store/入口、ID/级联重绑、保存/历史、枚举值有效性或真实权限。原 S02 的10项 AC、26项 Goal ledger 与16项产品义务保持；权限验收 `BLOCKED / NOT_RUN`。项目全量 `npm run ts:check` 被既有 `.vue.js` 文件 TS6504 阻断；单文件 tsc 又受既有第三方声明语法解析错误影响，不把它们归因于本候选。

## 请求验证者检查

复算全部18项 runner 检查、当前 RED/GREEN 的相同 runner digest、source/fixture摘要、访问器不调用、非法 JSON/循环拒绝、缺键/额外键优先级、深冻结输入、四数组隔离及 JSON round-trip；检查 Dashboard 是否已纠正超前状态、范围对账及 claim ceiling。仅对 QVALUE-001 给有界 verdict；不得判定 S02 Goal 完成。
