# Query Shape 生命周期源码证据矩阵 r002 独立 Delta Validation r001

## 结论

**`PARTIAL / NEEDS_REVISION`。** r002 已完整修正 SLM-R1-001 和 SLM-R1-002：时间显示轴与固定/动态规则轴分开，FullShape 的五个 cross-shape overlays 均已列出且未加入 shape 分母。SLM-R1-003 仅部分修复：主要 UI、Store、保存/加载引用新增了行/符号锚点，但权限 API、standalone substitute 仍缺精确锚点。另有一项新 P3 追溯问题：矩阵声称其配套 Context 的 `required_read_set` SHA-256 绑定了当前源码版本，但该读集没有包含矩阵明确引用的 `dataVisualization.ts`、权限 API 和 substitute 来源。

当前矩阵仍可作为有界静态来源索引供调查使用，但不应以当前版本宣称来源读集完整 hash-bound。修复均可限定在下一矩阵版本及其 Context/card 中完成，不需要改产品源码或改变 Goal 分母。本 Validation 不证明产品 Design Freeze、Builder 准入、产品运行、真实权限验收或 S02 Goal 完成。

## 核验对象与摘要绑定

- Validation Card：`r4-shape-lifecycle-evidence-matrix-validation-card-r001.json` canonical SHA-256 `7f2ac05cd0fe5df71d9bea15019b61468bf46f04a975e6f29488ef84644adc0b`；按该摘要执行 `lane_task_card.py validate`，结果 `pass`。允许写入范围仅为本报告。
- Validation Context：`ContextBootstrap-R4-SHAPE-LIFECYCLE-EVIDENCE-MATRIX-VALIDATION-r001.json` SHA-256 `f04326eb84ef62fea3439170caaed257407913570528da15f9f5de2df94de86e`；`context_bootstrap.py validate` 成功，30 项 required-read 均可读取且摘要匹配，`skipped_reads=[]`。
- 被验证矩阵 r002：SHA-256 `f254a8fc3604cf287228de983da395c987350611e8b3124ecc99cdae9310f75b`。
- 前次 Review r001：SHA-256 `44ff18acbd4dc1cc48c59f421879ed2a7cca4c76411e93457981a6433ee4e32f`。
- 矩阵 r002 Builder Card canonical SHA-256 `abf28b28ecda625ef6995bc933586785ea4108b3c96e4dba171f9051ed69bb4b`，Card validation `pass`；其配套 Context SHA-256 `9bbaa8764a2dfaec90aa37bcd62aab37c0339c016cfcdeba64680d3b657e9f6b`，Context validation 成功，30 项 required-read、`skipped_reads=[]`。
- Validation Card 与 Builder Card 均绑定当前 `Goal.final.json` SHA-256 `f562da2eb14b84dc8083e138dd2eb8718a58041f01d08163eddf5fb2c71daef0`。Goal 与 Coverage 的分母和边界在本轮复核中未被重写或缩减。

## SLM-R1-001..003 逐项处置

| Finding | 处置 | 核验依据 |
|---|---|---|
| `SLM-R1-001 / P2` 时间轴混淆 | **关闭** | 矩阵 r002 第33–34行把 `regularOrTrends=fixed/dynamic` 作为规则轴，把 `displayType=1/7` 说明为时间/日期范围显示轴；QCC `QueryConditionConfiguration.vue:3053–3068` 与 `FilterTime.vue:58–60` 的职责区分与表述一致。两种轴组合是否受支持仍明确未知，没有从源码推出合法组合。 |
| `SLM-R1-002 / P2` overlays 遗漏 | **关闭** | r002 第36–40、44行列出且仅将 `AX-TIME-RESTRICTION`、`AX-OPTIONS`、`AX-CASCADE`、`AX-PARAMETER`、`AX-HISTORY-NESTING` 作为跨 shape overlay，不计为独立 shape；与 FullShape Design r003 的 overlay 列表一致。相关完整语义和组合仍留作未知。 |
| `SLM-R1-003 / P3` 主要来源缺精确定位 | **部分关闭** | r002 第17–22、29–40行对主要 UI/Store/画布保存加载/快照来源新增了行号与函数或模板锚点；检查到的行范围均可在对应文件定位。第23行权限来源仍只列 `AuthApi.java`、`ResourceAuthApi.java` 文件名及 substitute 目录，没有精确行或符号锚点；同一行的 `PermissionEnvironment.md` 与 `SP-005/S02-S09_EntryPacket.md` 仅用段落描述，定位粒度也弱于周边代码引用。权限部分仍不能作为已完成定位的例外关闭。 |

## 新增发现

### `SLM-R2-001 / P3` 配套 Context 未 hash-bind 矩阵声称覆盖的全部来源

矩阵 r002 第61行称“当前源码版本由配套 Context … 的 required_read_set SHA-256 绑定”。但 Builder Context 的 30 项 required-read 中没有：

- 第21行引用的 `core/core-frontend/src/api/visualization/dataVisualization.ts`；
- 第23行引用的 `sdk/api/api-permissions/.../AuthApi.java`、`ResourceAuthApi.java`；
- 第23行引用的 `core/core-backend/src/main/java/io/dataease/substitute/permissions/` 下实现文件。

这些不是仅靠矩阵中可见文件名就能由 Builder Context 摘要绑定的当前字节。Validation Context 自己额外读取了 `dataVisualization.ts`，因此可以支持本次 reviewer 对当前文件的单独检查；这不能追溯补成矩阵 Builder Context 的 required-read 绑定。该差异也解释了 SLM-R1-003 的权限引用残留。第23行并列提及的 `PermissionEnvironment.md` 和 S01 Entry Packet 属于状态/前置证据而非源码；它们同样不在 Builder Context 中，矩阵没有把它们写成源码摘要，故本 Finding 的核心是第61行对源码读集完整性的过宽表述。

建议下版采取以下二者之一：将需要支撑矩阵断言的实际源码文件纳入新 Builder Context required-read 并重算摘要；或把第61行收窄为只绑定明确列入该 Context 的文件，并逐项标出未绑定来源及其限制。若保留权限来源，补充可复核的行/符号锚点。无需改动产品源码。

## 范围、权威与边界复核

- r002 第5、54行保留 Goal 10 项 AC、26 项 must-have、16 项产品义务和 `Scope Delta: none`；关联 AC-S02-02..09 仍只是设计/证据追踪，未将 Coverage Matrix 状态写成通过。
- 第11、23、50行保留 Authority Materials 主包第3/3轮 `NEEDS_REVISION`、审后更正只限 Q014 指针/条款修正、S01 F01 `CONDITIONAL` 以及真实权限环境 `BLOCKED / NOT_RUN`。没有将 standalone/admin/mock 用作权限验收替代物。
- 第21–22、47–50行区分前端序列化/API 调用、快照/事件路径与服务端 durable save、真实 Save→Load、shape undo/redo 等未证事项；没有把源码路径升级成运行或持久化证明。
- 第46、49、54行保留 shape 合法全集未知、禁止从 axes 笛卡尔积造支持分母、禁止以该矩阵授权产品 UI/Store/source-read/target-commit build 的边界。

## Builder 修复建议与结论上限

可修复的最小后续项只有两类：为第23行权限代码和文档来源增加精确锚点；使矩阵第61行的 Context 绑定声明与 Builder Context 的实际 read-set 相符。修复应作为下一版本并绑定新的矩阵、Card、Context 与 source digests；本报告不代为修改被验证对象。

因此，本轮验证结论仅为 **r002 对两项 finding 已修复、第三项部分修复，且发现一项 P3 来源绑定缺口**。它不构成 Shape 支持全集、schema、产品行为、权限/撤权验收、Builder准入或 Goal 达成证据。
