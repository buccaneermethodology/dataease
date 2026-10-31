# QPIPE-001 独立 Validation r001

## 双结论

- **Package validation：`PASS_WITH_BOUNDS_FOR_QPIPE_001`。**QPIPE 六个冻结 identity 的有效 RED/GREEN、实现与 runner 摘要一致；独立重跑 6/6 通过，两个目标 lint 通过。runner 使用 wrapper spy 记录真实 QPROJ/QMAP/QPREP 函数调用并透传原实现，逐例比较预期调用轨迹；输入深冻结且调用前后相等，错误结果无部分产物。
- **Original Goal conformance：`NOT_CONFORMANT_AS_GOAL_COMPLETION`。**QPIPE 是原 Goal 范围内的纯组合候选，未缩小分母，但不构成完整产品交付。原 10 项 AC-S02 与 16 项产品义务仍保留，真实权限为 `BLOCKED / NOT_RUN`。

上述 package verdict 仅针对 QPIPE 组合切片。它不追认 QPREP 历史 package validation，也不证明产品入口、UI、持久化或权限。

## 接收端、准入与摘要复核

- Validation card canonical digest `8e66f224c7dc4328f07c1dfbb1b93f2f8b9dd91734880551b25f9a33e635e5c8` 接收端 validate/render 通过。
- Goal、设计、fixture、设计 review、Validation Context、生产模块、runner、Execution Evidence 与 RED 快照的摘要均与卡片绑定值一致。关键摘要：Goal `f562da2e…`；Design `7269824a…`；fixture `9e96dba7…`；review `fb87206a…`；pipeline `7066211a…`；runner `9d8042ad…`；Execution Evidence `fca684f8…`。
- 额外复验了 Builder card canonical digest `5c404d4129ca7e2ca3ab44fea9804cbbbe7870d5502324239231628e1a82e702`，接收端结果 `pass`；Builder Context `context_bootstrap.py validate` 通过；target-bound admission 以 `action=builder` 和目标 `core/core-frontend/src/custom-component/filter-copy/query-reference-pipeline.ts` 重验通过。
- Builder 写入的产品目标仅为 pipeline 模块和对应 runner；三项上游模块未被本切片修改。静态搜索未发现 pipeline 被 copy/UI/Store 产品入口调用。

## RED/GREEN 与耐久证据

RED 快照绑定 runner `9d8042ad…`、fixture `9e96dba7…` 和实现前不存在的 pipeline（缺失标记摘要 `769b8995…`）；QPROJ/QMAP/QPREP 在 RED 时均存在，摘要与当前对应源一致。分离保存的 RED stdout/stderr/exit code 摘要与 Execution Evidence 相符：六个 identity 均以 `implementation unavailable` 失败，`0/6 passed; 6 failed`，退出码 1。stderr 展示的是逐项预期断言失败及 harness 汇总，不是导入、bundle 或编译失败，因此是可执行的有效 RED。

GREEN stdout 显示六项全部 PASS，`6/6 passed; 0 failed`；其中 QPROJ/QMAP/QPREP 的实时摘要分别为 `9c0d15e3…`、`c234fc3c…`、`cad91daa…`，与已审上游实现一致；pipeline、fixture、runner 摘要与卡片一致。GREEN stderr 仅有 Node `MODULE_TYPELESS_PACKAGE_JSON` 提示，exit code 为 0。lint stdout/stderr 为空，exit code 为 0；所有原始输出文件 SHA-256 与 Execution Evidence 所列摘要一致。

## 独立运行和实现核查

在 `core/core-frontend` 独立执行：

- `node --experimental-strip-types tests/filter-copy-query-reference/query-reference-pipeline.test.ts`：退出码 0，TC-QPIPE-001–006 全部通过；打印的 QPROJ/QMAP/QPREP/pipeline/fixture/runner 摘要与绑定证据一致。
- `./node_modules/.bin/eslint src/custom-component/filter-copy/query-reference-pipeline.ts tests/filter-copy-query-reference/query-reference-pipeline.test.ts`：退出码 0，无诊断。

测试的 esbuild plugins 针对三个真实模块源将原导出重命名为实现函数，再导出一个 spy wrapper。每次 spy 先向共享 `actualCalls` 追加阶段标记，再把原参数透传给真实函数并返回其真实结果；没有 stub 或合成阶段返回值。每个 case 在执行前清空调用轨迹，之后以 `assert.deepEqual(actualCalls, expected_calls)` 对实际轨迹逐项断言。因此调用轨迹是由执行产生的记录，不是从 pipeline 的 `stage` 字段推导。

六项独立核对：001完整成功且严格为 QPROJ→QMAP→QPREP；002在 QPROJ `INVALID_INPUT` 后短路；003零目标在 QMAP `MISSING_COMPONENT` 后短路；004多目标在 QMAP `AMBIGUOUS_COMPONENT` 后短路；005投影和映射后由 QPREP 返回 `MISSING_CONDITION`；006同样走完三阶段后由 QPREP 返回 `CYCLE`。断言覆盖精确返回对象、调用顺序、每例深冻结输入及调用前后相等、错误不含 `value`/`componentMap` 部分结果。pipeline 代码按固定阶段传递原模块 reason，不实现第二套映射/闭包/环逻辑，也无 Store、网络、权限、时钟、随机 ID 或事件依赖。

## Finding、权限和原 Goal 分母

本次 QPIPE 六项纯组合合同未发现阻断实现或证据的 finding。当前纯函数组合未接入产品入口；目录真实性、目标承载与授权、真实查询 schema、持久化、保存重开和 UI 行为仍不在此包证据范围。

`Goal.final.json` 仍含 AC-S02-01–10 共 10 项、F01 Q004–Q015 与 ORIG-01/02，以及 Q066/Q067 共 16 项产品义务；均保留在原始分母中，没有由 QPIPE 组合测试替代。此前 QPREP Validation 判定因历史 RED stdout/stderr 和实现前快照缺失而为 `PARTIAL_PASS / BLOCKED_FOR_PACKAGE_ACCEPTANCE`；本次 QPIPE 的新 GREEN 通过不会倒填或追认 QPREP package 证据。

真实权限实现与隔离多用户环境仍不可用。只读用户查看/复制/粘贴限制、数据与编辑权限重验、授权撤销/恢复均保持 `BLOCKED / NOT_RUN`，不以 standalone、admin 或 mock 替代。

**可接受声明：**QPIPE-001 的六项纯组合候选经有效 RED、真实模块 spy、同 identity GREEN、输入不变/失败原子性断言及定向 ESLint 独立验证通过。不得声明 QPROJ/QMAP/QPREP package 全部通过、产品复制可用、权限通过、完整 F01 或 S02 完成。
