# QPREP-001 独立 Validation r001

## 结论

- **Package validation：`PARTIAL_PASS / BLOCKED_FOR_PACKAGE_ACCEPTANCE`。**当前候选对冻结的 8 个 identity 行为通过，定向 ESLint 通过，精确写入范围符合 Builder 卡片；但可信 RED 的耐久证据不完整，不能判定 QPREP-001 测试包已满足完整准入/验收证据要求。
- **Original Goal conformance：`NOT_CONFORMANT_AS_GOAL_COMPLETION`；本切片与原 Goal 边界一致，但 Goal 整体仍未完成。**本切片没有缩减 Goal 分母，也没有声称完成 F01、Q066/Q067 或权限验收。十项 AC-S02 和十六项产品义务仍在原 Goal 合同中待证；真实多用户权限继续 `BLOCKED / NOT_RUN`。

本报告只验证 typed 查询引用闭包准备器及其当前候选，不证明产品集成、真实 query schema、Store/UI、保存/撤销、运行时、权限、F01 或 S02 完成。

## 复核清单与绑定

- 接收端卡片：`lane_task_card.py validate` 对 `query-reference-validation-card-r001.json` 及期望摘要 `604c10a2b7f1fd8b551512c696f78e22f8fa7f0ea567f830795dbb1d41ea23c3` 返回 `pass`；随后按 renderer 输出执行。
- Goal 摘要与卡片一致：`f562da2eb14b84dc8083e138dd2eb8718a58041f01d08163eddf5fb2c71daef0`。
- 整合设计摘要一致：`9278dfa7490a43bdc13f1d1fa7c9165ed578d48ca6c955b74af00f880c72c765`；其 8-case fixture 摘要一致：`08ed4a0c6ef376230baf856dd7cb0a9b6254733c318b914dbcea959bdc7dd915`；设计复核摘要与卡片一致：`c761633b315dde7463c635999dcdf34a14941c1fe56804e1148acdc2aa789c61`。
- 测试执行时生产源摘要为 `cad91daa9e416260565519bcc705743f34726357cda35a6a8a73f423f7aeff46`；runner 摘要为 `045da5c9fa9048007b613c05af5deac9835c0fa092ec5783ac959b925375e90e`。验证时 fixture 未发生改动。
- 工作树中本切片新增的两个产品文件均在 Builder 卡片允许范围内：生产模块和对应测试 runner；未见本切片修改既有文件的差异。测试直接以 esbuild bundle 实际生产 TypeScript 源，再在 Node VM 中执行。

## 独立执行结果

在 `core/core-frontend` 执行：

- `node tests/filter-copy-query-reference/query-reference-plan.test.ts`：退出码 0，TC-QPREP-001 至 TC-QPREP-008 均通过，`8/8 passed; 0 failed`。Node 输出一个 package.json 未声明 module type 的性能提示，不影响退出码或断言结果。
- `./node_modules/.bin/eslint src/custom-component/filter-copy/query-reference-plan.ts tests/filter-copy-query-reference/query-reference-plan.test.ts`：退出码 0，无 lint 诊断。

逐项核对：结构与精确键检查、非空 ID 和局部重复 ID、条件/node 映射覆盖及单射、引用条件闭包、dataset/field 身份一致、组件映射缺失/多义拒绝、级联相邻条件环拒绝、完整构造独立结果。TC-QPREP-008 深冻结输入并修改结果嵌套字段，确认输入仍为 `province`。候选实现没有 Store、UI、fetch、Date、随机 ID 或事件总线依赖；失败分支只返回 reason，不暴露部分 value。

冻结正例的映射值、字段身份、顺序与 oracle 一致；TC-QPREP-004 从既有 `a → b` 追加 `b → a` 构成环，TC-QPREP-007 改变节点 dataset 触发身份不匹配。8 个 identity 唯一且 fixture 摘要与卡片绑定相符。本范围未发现需要提交给 Builder 修复的当前 GREEN 行为缺陷。

## 阻断项与边界

**P1 — 可信 RED 证据缺口（阻断 package acceptance）。**Builder 报告执行真实 RED 命令并以退出码 1 结束，但原始结果只在工具返回的合并 `output` 中；没有分别保存 stdout/stderr，也没有可核对的 RED 时点源码/runner 快照。本 Validator 不拆分或补造历史输出，不用当前 GREEN 反推 RED 曾符合预期 fingerprint。该缺口使“可执行且按预期失败”的可信 RED gate 无法独立验证，因此 package verdict 为 partial/blocking。应由后续有准入的 Builder/控制面按新执行重新保全原始证据；新证据不得冒充本次历史日志。

**Goal 级未满足项。**`Goal.final.json` 仍保留 AC-S02-01 至 AC-S02-10，以及 AC-F01-Q004–Q015、AC-F01-ORIG-01/02、AC-F04-Q066/Q067 共 16 项产品义务。当前纯准备器只有限支持 AC-S02-02、03、07 所涉及的局部测试准备，不能将其映射为这些 Goal AC 通过。尤其 AC-S02-04/05/06/08/09/10 与全部真实产品行为仍需相应证据；AC-S02-01 也需按 Goal 入口条件对账。

真实权限环境没有已授权模块来源或具备多用户权限能力的隔离实例。只读用户禁止查看/复制/粘贴、身份与编辑权重验、权限撤销等要求必须保留为未验证；standalone/admin/mock 不构成替代。当前切片未碰权限，实现准备不能关闭此阻断。

## 可接受范围

可将当前实现与 8 个 GREEN identity 作为 QPREP-001 行为候选证据，并继续推进不依赖真实权限环境的实现切片。不得据此声明可信 RED/GREEN 包已完整通过、AC-S02-07 通过、查询复制产品链路可用、权限通过、Q066/Q067 完成或 S02 完成。
