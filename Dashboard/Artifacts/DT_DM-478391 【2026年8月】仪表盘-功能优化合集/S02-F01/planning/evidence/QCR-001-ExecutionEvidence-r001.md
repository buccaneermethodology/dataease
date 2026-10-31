# QCR-001 执行证据 r001

## 范围与绑定

Builder仅实现独立离线纯函数 `rebindQueryCascadeIdentities`。实现文件：`core/core-frontend/src/custom-component/filter-copy/query-cascade-identity-rebinding.ts`；测试：`core/core-frontend/tests/filter-copy-query-cascade-identity-rebinding/rebind.test.mjs`。

- Final Goal：`f562da2eb14b84dc8083e138dd2eb8718a58041f01d08163eddf5fb2c71daef0`
- 冻结设计：`fbd39a595c1efba93029132e43c6ba36aa023253b2404267bd7498825221c081`
- 冻结六用例fixtures：`ef29e826d412810da0c1bf09703586cee7465dc93a7ee5ce15e93bf68eb5b277`
- 独立设计复核：`c2ae1d676de3978494f06f6c22e2a2fe6b15d65efa77b104af908f40c5e7638a`
- Builder card canonical digest：`de905138762f53592516c113fa009163871e3ee316cfd12bcebd782d5882f2e8`
- Execution admission：`9e55ec4fab1da42a15460dae7096f407b1e44983ffc68cb6826e292d6679011c`；入口验证action=`builder`、target精确匹配实现文件。

实现仅重绑QueryCascade节点ID与复合dataset-query-field的query段；dataset与field段原样保留，清除运行选择。函数不产生ID，不读Store、UI、目录、网络、权限或时钟。

## 验证结果

| 检查 | 结果 | 证据 |
|---|---|---|
| Trusted RED | 有效失败，退出码1；模块缺失时esbuild无法解析目标导出 | `Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/planning/evidence/QCR-001-red.snapshot.json`；stdout/stderr与退出码同目录 |
| 同identity GREEN | 6/6冻结identity通过，另有11项防御检查（错误tuple长度、同dataset非空独立fieldId、空选择数组不共享，以及query/node映射source/target的空ID与含`--`ID拒绝） | `Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/planning/evidence/QCR-001-green.stdout.txt`；退出码0 |
| 定向 ESLint | 实现与测试文件通过 | `Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/planning/evidence/QCR-001-lint.exitcode.txt`；退出码0 |

GREEN逐项精确比较fixtures期望；同时检查输入不变、成功输出数组/分组/节点不复用输入对象。复核发现原实现未验证映射source ID，已按冻结合同补齐，并验证query/node映射source和target分别为空或含`--`时返回`INVALID_ID`。现存 RED 证据仍是首次实现前的有效缺模块失败快照；本轮只刷新同identity GREEN与lint。审查提醒TC-QCR-001首级空placeholder样本只验证纯变换，不代表产品级联配置合法，本实现报告不作该声明。

## 声明上限与剩余事项

当前是Builder候选，不是独立Validation。完整查询配置反向还原、树/参数/日期/数值合法配置、适配器、产品入口、身份/权限、保存/撤销/预览、历史兼容及全Goal验收均未完成。只读配置不可见、权限撤销/恢复继续`BLOCKED / NOT_RUN`。10项Goal AC与16项产品义务保持原分母；QPADR-03及Goal仍开放。
