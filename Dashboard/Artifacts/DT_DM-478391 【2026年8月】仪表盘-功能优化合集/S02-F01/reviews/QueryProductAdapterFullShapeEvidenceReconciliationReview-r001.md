# R4 全形态设计证据增量对账独立评审 r001

## 结论

**`PASS_WITH_FINDINGS / BOUNDED_RECONCILIATION_ONLY`。** 对账文档准确保留了 R4FS-001..005 的 OPEN/BLOCKED 状态、Goal 原始分母和产品验收边界，可作为当前有界对账记录使用。发现两项评审 finding：41 项候选的来源清单有两条摘要过期；对账没有呈现其所引用的 Source Trace Review r003 中仍 OPEN 的三个子 finding。后一遗漏要求后续引用明确限定该 trace 的准确性和覆盖范围，但不改变本对账的总处置，也不要求重开已满轮次的交付物。

本结论不表示完整设计冻结、Builder 准入、产品行为或 Goal AC 通过。Goal 10 项 AC、26 项 must-have、16 项产品义务和 `Scope Delta: none` 保持不变；16 项产品义务仍 `NOT_RUN`。S01 F01 为 `CONDITIONAL`，真实多用户权限环境为 `BLOCKED / NOT_RUN`；只读访问拒绝、撤权及恢复未验证。

## 评审范围与核验

本评审只判断 `QueryProductAdapterFullShapeEvidenceReconciliation-r001.md` 的逐项处置、证据引用和 claim ceiling；未修改该文档、Goal、Design、Cases、Sessions 或产品源码。Lane Card `S02-F01-R4-FULL-SHAPE-EVIDENCE-RECONCILIATION-REVIEW-r001` 的 canonical SHA-256 为 `6fe7332200a1c9941faf4358eddcb5cb8617d08396f34f9d9210f0293bf148bd`，脚本复验 `pass`。Context Bootstrap SHA-256 为 `799e45318effc1dc7437a3aa844802405ac4b2a893182d75583ccf47af7e71af`，required-read 摘要复验通过，`skipped_reads=[]`。

复算结果：41 项局部候选 ID 唯一，分类为 16 `LOCAL_VALIDATOR_ACCEPTS`、6 `LOCAL_VALIDATOR_REJECTS`、13 `SOURCE_STAGE_OBSERVATION`、6 `NOT_READY`；全部为 `NOT_RUN`、`frozen_for_builder=false`、`product_legality=NOT_READY`。FullShape 原始 32 项 Cases 仍为 candidate，均未冻结/运行，不能支持完整执行覆盖。现有 harness/component 证据被对账文档限制在其明确的局部输入与观察范围内，没有被提升为产品或 Goal 验收。

已核对 FullShape Design Review r001、41 项组合候选及其独立 Review、SH-SELECT-TEXT 的 Source Trace r003 及 Review r003、相关 Harness Validation、ST-SRC-006 Validation、QOBS Delta Validation r004、Authority Current State Assessment r001、Goal 和当前 Sessions。权限状态仅按绑定材料核验，未运行产品或权限测试。

## Findings

| ID / 严重度 | 发现 | 影响与处置 |
|---|---|---|
| R4ER-001 / P2 | **41 项候选的 source manifest 有两条摘要漂移。** `QueryProductAdapterSelectTextSourceLegalCombinationsCases-r001.json` 的 19 项 `source_manifest` 中，`reviews/QueryProductAdapterSelectTextSourceHarness-Validation-r001.md` 绑定摘要为 `68fb2f20220df9bf5f857008395fa26076d9ba2b5d1224e33698aa3baf2972bb`，当前文件为 `f3a268ae44b5ec7b567333e8825704a53324e4e1aef38e7deab3a7592cbfc496`；`Sessions.md` 绑定摘要为 `ff9c8079d4cfadebbd6d6b8eee261e0561b2425e824460c182c573aee331f69f`，当前文件为 `5dd977cfe56bfd6f39057d96e72ea91d78bb426983a6e477ec445d8022c5253c`。 | 该候选内嵌来源清单不能证明这两份当前内容与生成候选时的来源字节一致。当前评审 Context 对这两份文件绑定的是现有摘要，且其现有内容支持对账中的局部范围/数量主张；因此不推翻 41 项计数、R4 finding disposition 或本评审结论。后续若将该候选作为来源权威，应重新绑定来源清单或明确使用当前 Context 读取的版本，不能静默把旧摘要当作当前摘要。 |
| R4ER-002 / P2（含 P3 子项） | **对账没有记录被引用的 Source Trace Review r003 中仍开放的局部 findings。** 该 Review 明确保留 `SSTR-R3-001`（P2：source 切换与 dataset 切换触发条件混淆）、`SSTR-R3-002`（P2：同步 `return` 不能证明用户取消分支或取消副作用）、`SSTR-R3-003`（P3：候选版本标题及部分行号范围未对齐）。对账在 R4FS-002 下称 r003 已完成有界源码追踪，并概述了部分创建、确认、运行 consumer 与保存 owner 静态定位，但未呈现上述限制。 | 对账没有直接宣称三个 finding 已关闭，且仍把全链标为 OPEN；总体结论成立。但对账中有关 source trace 的概述不应被下游解读为相关触发语义已准确或该 trace 整体无问题。建议在未来新增的对账版本中列出 SSTR finding ID 及其边界，保留 source trace 仅为部分路径定位的证据。此 finding 不授权重开 Source Trace Review r003 或修改其历史记录。 |

## R4FS 逐项处置

- **R4FS-001：OPEN，局部补充。** 41 行覆盖 Select-Text 当前局部 validator/source 观察；每行 `product_legality=NOT_READY`，不能冻结完整产品 shape/axis 合法组合分母。对账结论准确。
- **R4FS-002：OPEN，局部补充。** 已有部分 producer、configuration、runtime consumer、saved-owner 路径证据，但未形成逐 shape 的 producer→config→consumer→save/load/history 全链。须结合 R4ER-002 限定被引用 trace 的局部语句准确性。对账仍未声称完整链闭合。
- **R4FS-003：OPEN，局部执行证据。** 22 项 validator harness、ST-SRC 各局部 harness 和 QOBS PA-001..009 的证据不覆盖数值、时间、树、级联、参数及持久化完整产品语义；32 项 FullShape cases 未冻结/未运行，16 项产品义务 `NOT_RUN`。对账没有把局部 GREEN 提升为全形态验收。
- **R4FS-004：OPEN。** 身份字段和条件动作尚未形成所有 shapes、阶段与 owner 的路径化合同及互斥 oracle。局部 QPC saved-owner 设计不能替代全矩阵闭合。对账结论准确。
- **R4FS-005：BLOCKED / NOT_RUN。** S01 F01 仍 `CONDITIONAL`，真实权限隔离环境仍阻塞；只读拒绝、撤权和恢复未验证。对账结论准确。

## 范围与后续建议

本对账正确保留 10/26/16、`Scope Delta: none`、产品义务 `NOT_RUN`，也正确禁止把局部静态/harness/component 结果当作产品接线、权限行为、保存恢复或 Goal AC 通过。可继续不依赖 S01/真实权限的独立设计和有自身准入的离线工作；产品 UI/Store/source-read/target-commit 与真实权限验收仍不准入。

建议新版本对账若继续推进，只修订其自身引用与 finding 呈现，不重开轮次已满的 FullShape Review 或 Authority Materials 主包。此 Review 仅审有界对账，不构成后续 Builder admission、产品验证或 Goal closeout。
