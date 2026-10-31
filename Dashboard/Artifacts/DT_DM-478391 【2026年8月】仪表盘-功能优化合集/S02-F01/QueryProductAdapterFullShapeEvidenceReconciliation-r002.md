# R4 全形态设计证据增量对账 r002

## 结论与范围

本版回应独立评审 `QueryProductAdapterFullShapeEvidenceReconciliationReview-r001.md` 的 R4ER-001、R4ER-002。仅更新此对账记录，不修改 r001、FullShape 候选、其 Cases、Goal、产品源码或历史评审。对账仍是控制面证据，不是设计冻结、Builder 准入、产品验收或 Goal 完成。

结论仍为：R4FS-001..004 在全形态层面 OPEN，R4FS-005 为 BLOCKED / NOT_RUN。保留 Goal AC 10 项、must-have 26 项、产品义务 16 项及 `Scope Delta: none`；16 项产品义务仍为 `NOT_RUN`。S01 F01 为 `CONDITIONAL`；真实多用户权限环境为 `BLOCKED / NOT_RUN`，只读拒绝、撤权及恢复未验证。

## 对 R4ER findings 的处置

### R4ER-001：来源清单摘要漂移，未修复且已显式限定

独立评审确认 `QueryProductAdapterSelectTextSourceLegalCombinationsCases-r001.json` 内嵌的 19 项 `source_manifest` 有两项摘要过期：`reviews/QueryProductAdapterSelectTextSourceHarness-Validation-r001.md` 与 `Sessions.md`。本版**不声称修复原 JSON manifest，也不将旧摘要视为当前文件摘要**。该候选仍可用于其已审查的局部结构和分类说明，但这些过期条目不能建立内容身份或字节级来源绑定。

本次对账直接读取的当前文件以如下 SHA-256 识别：

| 当前来源 | 当前 SHA-256 | 用途与限制 |
|---|---|---|
| `reviews/QueryProductAdapterSelectTextSourceHarness-Validation-r001.md` | `f3a268ae44b5ec7b567333e8825704a53324e4e1aef38e7deab3a7592cbfc496` | 仅用于核对局部 harness 的声明边界；不回填或改写候选 manifest。 |
| `Sessions.md` | `5dd977cfe56bfd6f39057d96e72ea91d78bb426983a6e477ec445d8022c5253c` | 仅用于核对当前任务台账与局部证据范围；不代表候选生成时字节。 |

**处置：`CONTAINED_FOR_THIS_RECONCILIATION / SOURCE_MANIFEST_STILL_STALE`。** 若后续工作需要把该 JSON 候选作为字节级来源权威，必须另行修订并重新验证 manifest；不得静默将本表当成原 artifact 的修复。

### R4ER-002：Source Trace Review r003 的未决项现已逐项呈现

此处仅摘录被引评审的开放状态，便于下游保持证据边界；不改写或重开 `QueryProductAdapterSelectTextSourceTrace-r003.md` 与其第 3/3 轮 Review。

| 来源 finding | 现态 | 对本对账的约束 |
|---|---|---|
| SSTR-R3-001 / P2 | OPEN：source 切换与 dataset 切换的触发条件混淆。 | 来源追踪只能作为部分路径索引；不得据其相关句子构造触发 oracle，亦不能把 Select-Text 事件条件推广到其他 shape。 |
| SSTR-R3-002 / P2 | OPEN：确认请求后的同步 `return` 仅证明当次控制流返回，不证明用户取消分支、取消副作用或临时状态恢复。 | 不得用该追踪声称取消行为正确、零副作用或已验证。取消相关产品语义仍待独立来源证据与产品验证。 |
| SSTR-R3-003 / P3 | OPEN：候选标题及局部引用范围不完全对应文件版本/语句终点。 | 引用需回到当前绑定源码和评审原文逐项定位；此追踪不能单独证明精确行范围或版本身份。 |

**处置：`DISCLOSED_WITH_BOUNDS`。** 这解决 r001 对账中未呈现已知限制的问题，但不关闭 SSTR findings，也不使其来源 trace 成为准确、完整的行为 oracle。

## R4FS 全形态状态（保持不变）

| Finding | 现态 | 对账结论 |
|---|---|---|
| R4FS-001 合法 shape/axis 分母未定义 | OPEN | 41 项 Select-Text 局部候选仍全部 `product_legality=NOT_READY`，不是完整合法组合分母；其他 shape 与跨轴交集未确立。 |
| R4FS-002 producer→config→consumer→save/load/history 来源链不完整 | OPEN | 有局部来源路径，但受 R4ER-002/SSTR 限制；未证明逐 shape 全链、真实保存/回读/重开或 history。 |
| R4FS-003 全形态 Cases 与 oracle 未完备 | OPEN | 局部 harness、source-handler、组件交错证据仅覆盖各自范围；FullShape 32 项 Cases 未冻结/未运行，16 项产品义务仍 `NOT_RUN`。 |
| R4FS-004 身份字段/条件动作未完整路径化 | OPEN | 未形成覆盖所有 shapes、阶段与 owner 的路径化合同及互斥 oracle。 |
| R4FS-005 S01/真实权限等前置 | BLOCKED / NOT_RUN | S01 F01 仍 `CONDITIONAL`；无可用真实权限隔离环境。禁止以 standalone/admin/mock 替代。 |

41 项 Select-Text 分类、局部 harness 的实际输入、验证记录及其 claim ceiling，沿用 r001 所列具体依据；本版不升级其状态。32 项 FullShape 原始 Cases 保持 candidate、未冻结、未运行。

## 后续路线

继续推进不依赖 S01/真实权限的全形态来源取证和逐 shape 设计。下一候选为 SH-SELECT-NUM：先以独立 Context/Card 从当前源码重建数值单选/多选及 `displayType` 2、5 的 producer、validator、运行 consumer 和保存 owner 路径；不复制 Select-Text oracle，不因静态来源图而冻结合法组合。需要执行离线 harness 时，应先为该切片另行完成合同、可信 RED、设计审查和精确准入；不得触碰目标组件状态、真实权限、产品 UI/Store/source-read/target-commit 或未授权 Builder 范围。

本版只处理有界证据对账。Goal 的原始完成条件、全分母和剩余前置不变。
