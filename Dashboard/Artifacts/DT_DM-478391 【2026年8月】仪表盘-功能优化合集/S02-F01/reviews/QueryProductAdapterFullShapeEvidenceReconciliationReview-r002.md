# R4 全形态设计证据增量对账独立评审 r002

## 结论

**`PASS_WITH_FINDINGS / BOUNDED_RECONCILIATION_ONLY`。** r002 对前轮 R4ER-001/002 的处置准确：它没有宣称修复 41 项候选的原始 manifest，而是给出两份当前文件摘要并保留来源字节差异；也逐项披露 SSTR-R3-001..003 为 OPEN，限制了其对触发 oracle、取消行为和路径追溯的证明力。R4FS-001..004 仍为 OPEN，R4FS-005 仍为 BLOCKED / NOT_RUN；Goal 10/26/16、`Scope Delta: none` 及真实权限边界均保留。

发现一项非阻断的来源新鲜度遗留，以及一项后续 SH-SELECT-NUM 范围表述需要保持为局部路线的问题。两者均不改变本版有界对账可用性，但 FullShape 原始 Cases 的旧 manifest 不得作为后续 NUM 设计的当前源码绑定；NUM 切片的完成也不能代替 config confirmation 与 save/load/history 的完整链路证据。

本 Review 不表示 Design Freeze、Builder 准入、产品行为或 Goal AC 通过，也不要求重开任何已经达到 3/3 的交付物。

## 评审范围与输入绑定

只复核 `QueryProductAdapterFullShapeEvidenceReconciliation-r002.md` 对 R4ER-001/002 的增量处置、当前来源摘要、SSTR-R3 finding 摘要、R4FS/Goal/权限状态和 SH-SELECT-NUM 后续边界。没有修改被审文档、Goal、Cases、Sessions、源码或其他状态。

Lane Card `S02-F01-R4-FULL-SHAPE-EVIDENCE-RECONCILIATION-REVIEW-r002` canonical SHA-256 为 `a71a14e5d3e2b3db7ef451247f37d72a860e1d7d17b2b909314c5926ba489d69`，复验 `pass`。Context Bootstrap SHA-256 为 `93652757a8a0eaf89ee576b313f40e8b18b48f1b9a73c36946402635d26f1fea`，验证通过，`skipped_reads=[]`。被审 r002 SHA-256 为 `ab193b6c03828c4fb6bca0d677c16e3747eee7b3c76e040727b7e3e18d7e0bde`；前轮 Review r001 SHA-256 为 `bd629410276739343562c04704952244e11cb88c88f6dadc4425ee66ea0164cf`。

本轮重算 r002 表列的当前摘要：Harness Validation r001 为 `f3a268ae44b5ec7b567333e8825704a53324e4e1aef38e7deab3a7592cbfc496`，Sessions.md 为 `5dd977cfe56bfd6f39057d96e72ea91d78bb426983a6e477ec445d8022c5253c`；均与 r002 表一致。Source Trace Review r003 当前摘要为 `c8d47a0e6561ec2a09193515d9ae81254db1a25bd23a3f405d42d811bbc10b6d`，与本轮 Context 绑定一致。

## Findings

| ID / 严重度 | 发现 | 影响与处置 |
|---|---|---|
| R4R2-001 / P3 | **FullShape 32-case 文件自己的 source manifest 仍有未披露的旧摘要。** `QueryProductAdapterFullShapeCases-r001.json` 的 manifest 中，`Sessions.md` 绑定 `a244e45d9a425ac4903c0b94ca4401fc13876452ef306801d56db80f850ddb1c`，当前摘要为 `5dd977cfe56bfd6f39057d96e72ea91d78bb426983a6e477ec445d8022c5253c`；`Select.vue` 绑定 `eadbdba2b61aaeaf7abc58f83e75e82595c4a0812ceb1ac971f6739e4e4212a2`，当前摘要为 `30efd4a571a8146a68c8a57e64dfee93208670db4155b8f9257a4553efcfcac8`。 | 这不反驳“32 项仍 candidate、未冻结/未运行”的状态，也不属于 r001 R4ER-001 指出的 41 项 manifest 本身。它意味着 FullShape Cases manifest 不能证明这两份现有来源字节的身份。r002 已要求 SH-SELECT-NUM 从当前源码建立独立 Context/Card，故此差异可由该切片重新绑定；后续不得将 FullShape Cases 的旧摘要当作当前源码身份或追认旧输入。 |
| R4R2-002 / P3 | **SH-SELECT-NUM 路线是有界起点，但没有明确列出完整生命周期缺口。** 路线列出 producer、validator、运行 consumer 和保存 owner；R4FS-002 的原目标链还包括 config confirmation 与 save/load/history。 | r002 并未声称该数值切片可关闭 R4FS-002，且明确保持 R4FS-002 OPEN，因此没有越权或错误关闭。不过后续 Session 的完成条件应明确：本切片只交付局部来源图；尚未覆盖的配置确认、保存/回读/重开及 history/undo 要么在同一来源包中补证，要么作为清晰后续项保留 OPEN。不能把“识别保存 owner”写成端到端保存恢复验证。 |

## 前轮 finding 处置复核

- **R4ER-001：准确处置，原 41 项 source manifest 仍旧。** r002 如实列出 19 项 manifest 中两处过期摘要，且将当前 Harness Validation 与 Sessions 摘要限定为“本次对账直接读取”的来源，不声称它们修复或回填旧 JSON。两份 SHA-256 当前均匹配实际字节。该表述没有把当前字节与候选生成时字节混为一谈。
- **R4ER-002：准确处置，SSTR findings 均保持 OPEN。** Source Trace Review r003 的当前正文逐条保留：SSTR-R3-001 是 source 切换与 dataset 切换触发条件混淆；SSTR-R3-002 的同步 `return` 不证明取消分支、取消副作用或临时状态恢复；SSTR-R3-003 是候选标题及局部引用范围的版本/语句终点偏差。r002 的摘要与来源一致，并明确禁止将其用作行为 oracle、取消验收或精确行范围/版本身份证据。没有重开或改写原 3/3 Review。

## 全形态状态、分母与后续边界

- **R4FS-001：OPEN。** 41 项 Select-Text 候选的 `product_legality` 全为 `NOT_READY`；不构成产品合法组合分母。
- **R4FS-002：OPEN。** 部分来源定位不证明逐 shape 全链、config confirmation、真实保存/回读/重开或 history。
- **R4FS-003：OPEN。** 全形态 32 项 Cases 仍未冻结、未运行；局部 harness/source-handler/component 证据不能推广为产品验收。
- **R4FS-004：OPEN。** 全 shapes、阶段和 owner 的身份路径合同及互斥动作 oracle 未闭合。
- **R4FS-005：BLOCKED / NOT_RUN。** S01 F01 仍 `CONDITIONAL`，无已确认真实权限隔离环境；只读拒绝、撤权及恢复仍未验证。

Goal 原始分母保持 10 项 AC、26 项 must-have、16 项产品义务，`Scope Delta: none`；产品义务状态仍 `NOT_RUN`。r002 对产品 UI/Store/source-read/target-commit 和真实权限验收的限制准确。其 SH-SELECT-NUM 路线明确为候选来源取证，不沿用 Select-Text oracle、不冻结合法组合，并要求后续离线 harness 另具合同、可信 RED、审查和精确准入；这没有越权扩大到产品实现。

建议在 SH-SELECT-NUM 的 Context/Card 中从当前源码重新绑定完整读集，并把“本切片覆盖”与“仍缺的生命周期证据”分别列明。当前 r002 可以作为有界对账继续使用；FullShape 完整设计、产品准入和 Goal 验收继续未完成。
