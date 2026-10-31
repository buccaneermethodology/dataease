# QPROJ-001 独立 Validation r001

## 双结论

- **Package validation：`PARTIAL_PASS / BLOCKED_FOR_PACKAGE_ACCEPTANCE`（仅 runner lint 阻塞）。**六个冻结 identity 的 RED/GREEN 证据链可复核，独立重跑六项全通过，生产模块单独 ESLint 通过。测试 runner 的定向 ESLint 有两处 Prettier 诊断、退出码 1；因它是 RED 后冻结的 runner，本轮不修改它。不得将联合 lint 写成通过。此项不否定六个 identity 的行为结果，但 package 尚未达到干净的全目标 lint 状态。
- **Original Goal conformance：`NOT_CONFORMANT_AS_GOAL_COMPLETION`。**QPROJ-001 是原 Goal 范围内的有界投影准备切片，未缩减原始分母；它不实现完整查询复制产品链路。Goal 仍有 10 项 AC-S02 与 16 项产品义务待验，真实权限继续 `BLOCKED / NOT_RUN`。

本报告只覆盖 QPROJ-001 窄投影候选，不证明产品集成、完整 query schema、目标数据/权限、浏览器行为、F01、Q066/Q067 或 S02 完成。

## 接收端和输入摘要

Validation 卡 `qproj-validation-card-r001.json` 按期望 canonical digest `70189b466397c932371c0ccc0b248a8743a2137abd6ea9ed380bd82b6125e5e5` 接收端复验通过，并按 renderer 指令执行。所有被绑定摘要与文件核对一致：

- Goal：`f562da2eb14b84dc8083e138dd2eb8718a58041f01d08163eddf5fb2c71daef0`
- Design：`89c3a54be31a09668e43da990369bb8273c0d94e0ef2765d5d8a8e9cdf113596`
- Fixture：`d5ecf7a70c11108f80052605da4b016d9fb52296c800c7605d2e40208bed641d`
- Design review：`b8479c4c04058116d595c4dbc19ee981412cf3b7e2b4a116189346728a2b5dd2`
- GREEN 时生产模块：`9c0d15e3ad7a383c65c2e4af6a23c2377c064d4f7b30906990536b3dd94b0285`
- Runner：`e8ea0ca021b76140ac46119b2d28494e789aa5eaf928586020c251a516d2172c`
- Execution Evidence：`57f6e1ba4d43ce5a0b25c248d4208f5f78cd2657950d0adf59b16858875626d5`

## RED/GREEN 耐久证据

RED stdout、stderr、exit code 和源/runner/fixture 摘要分别落盘于 `planning/evidence/QPROJ-001-red.*`。实际记录显示：RED 时源文件 `exists=false`，缺失标记摘要 `769b8995b8bf4407c89e906d67601a46266d34922a63ab1754440eecb0657aab`；runner 摘要与当前冻结 runner 一致；fixture 摘要与冻结 JSON 一致。stdout 显示 `RESULT 0/6 passed; 6 failed`，stderr 的六项失败均为 `projection implementation unavailable` 后的预期断言失败，Node 进程退出码为 1。证据因此支持“模块缺失时六个 identity 可执行并按预期失败”，没有把导入/编译失败误当作 RED。Builder 执行记录的 RED 命令和这些分离输出相符。

GREEN 三个输出文件分别保存；当前 runner 与 fixture 摘要仍相同。Builder 记载的实现后源摘要与当前源一致。未发现用当前 GREEN 倒推或补造历史 RED 的情况。

## 独立执行与候选核查

独立重跑 `node --experimental-strip-types core/core-frontend/tests/filter-copy-query-reference/query-schema-projection.test.ts`：退出码 0，TC-QPROJ-001 至 TC-QPROJ-006 全部 PASS，`6/6 passed; 0 failed`。输出有 `MODULE_TYPELESS_PACKAGE_JSON` 性能提示，不影响测试退出码。输出的源、fixture、runner 摘要均与上述绑定相同。

分别对生产模块和测试 runner 执行定向 ESLint：

- `./node_modules/.bin/eslint src/custom-component/filter-copy/query-schema-projection.ts`：退出码 0，无诊断。
- `./node_modules/.bin/eslint tests/filter-copy-query-reference/query-schema-projection.test.ts`：退出码 1，`resolveInput` 一处换行格式及 `assert.equal` 一处换行格式，共两条 `prettier/prettier` 诊断；与耐久保存的联合 lint stdout 相符。

测试 runner 用 esbuild bundle 实际生产 TS 模块，而不是复制/重写被测逻辑；001–005 对完整投影结果/错误对象做深比较。006 验证投影先成功并保留 `conditionId=missing`，再独立调用 QPREP 得到 `MISSING_CONDITION`。六个 fixture identity 次序、oracle 与设计说明相符；验证前后 fixture 摘要一致。

实现按设计顺序分层检查通用输入、越界复杂引用、显式 source component/field 身份、级联复合键，并产出新的 conditions、chains 和映射对象；未读/输出 `defaultValue`、`mapValue` 等值态。静态全局搜索未发现从 `copy.ts`、UI 或 Store 调用此新模块；模块没有 Store、网络、时间、随机 ID 或权限读取。故此结果仅证明纯投影模块候选行为，不证明它已接入产品或源目录/目标授权可信。

## Findings 与边界

**P2 — 冻结 runner 的 lint 格式失败。**生产模块 lint 通过，测试 runner 两处格式规则失败。Builder 为保全 RED/GREEN 使用同一冻结 runner，没有在 RED 后改动它，符合卡片的冻结约束；因此这是剩余 package 质量问题，而不是测试身份/行为失败。若要清除此项，应以新准入/rebaseline 更新 runner 并重跑其固定 identity；本 Validator 不代为格式化。

`Goal.final.json` 中有 10 项 AC-S02、14 项 F01 AC（Q004–Q015、ORIG-01/02）及 Q066/Q067，共 26 项原始义务，当前状态均为 pending。本切片只为少数设计/测试准备条件提供局部证据，不把 AC-S02-02/03/07 或任一产品义务改判通过。未缩减产品分母。

真实多用户权限实例和权限模块来源仍不可用。只读用户不得查看/复制/粘贴、每次重验数据/编辑权限、权限撤销/恢复等要求保持 `BLOCKED / NOT_RUN`；standalone、admin 或 mock 均不替代验收。当前切片未执行任何权限验证。

## 可接受声明

可报告六项普通查询引用窄投影 identity 的 GREEN 行为和其可信 RED/GREEN 耐久证据已独立复核通过，同时注明 runner lint 未通过并阻止 package 完整验收。不得声明完整 query 复制、copy/UI 集成、真实权限、完整 F01、Q066/Q067 或 S02 已完成。
