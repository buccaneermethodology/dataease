# Query Product Adapter 全形态设计独立语义复核 r002

## 双结论

**Design Freeze Validity：`PASS_WITH_FINDINGS / FULL_R4_FREEZE_NOT_READY`。** r002 如实将新增 Select-Text 与 Select-Num 材料限定为局部静态来源索引，保留原始 10 项 Goal AC、26 项 must-have、16 项产品义务及 `Scope Delta: none`；R4FS-001/002 仅部分补证且仍 OPEN，R4FS-003/004 仍 OPEN，R4FS-005 仍 `BLOCKED / NOT_RUN`。没有依据冻结完整全形态设计。

**Implementation Entry Readiness：`NOT_READY_FOR_PRODUCT_UI_STORE_SOURCE_READ_TARGET_COMMIT`。** 32 个全形态 Cases 仍全部缺 fixture、精确 oracle 和执行证据；合法形态分母、逐 shape 的完整阶段链、路径化字段条件与发布/持久化 owner 未闭合。S01 Entry Packet 仍 `CONDITIONAL`，真实多用户权限环境仍 `BLOCKED / NOT_RUN`。本 Review 不准入产品 Builder；可以继续独立 Context/Card 约束下、不依赖 S01/真实权限的静态取证、设计和有界 detached building block。

## 复核范围与输入绑定

本报告是 `S02-F01-R4-FULL-SHAPE-DESIGN-REVIEW-r002` 的第 2/3 轮，只写本报告。Lane Card canonical 摘要校验通过；Context Bootstrap 摘要 `edfb5a3176504e9212b137784562fd7b29f2d1d123145af7110b34b4bf5357c3` 校验通过，24 项 required read 均满足、`skipped_reads=[]`，唯一 write scope 为本报告。关联 `receipt-r263.json` 为 valid/CONTINUE，但 `final_allowed=false`；此收据不是 Builder admission，也不代表 Goal 终态。

被审设计文件 SHA-256：`4bb9f9a64a06693ba151ea3370b5b7d7dfaf2882d36f284c14edfc2fe2231ca2`。同目录 Cases JSON SHA-256：`a68a4bf534b3986d354005d78a3cfa92c824bb52d94b17f76e4f83cb8549c226`。Goal SHA-256 与卡片绑定一致：`f562da2eb14b84dc8083e138dd2eb8718a58041f01d08163eddf5fb2c71daef0`。对照上一轮 `QueryProductAdapterFullShapeDesignReview-r001.md`、Evidence Reconciliation r002 及其独立 Review r002，并复核当前 Cases、Session 台账及 Context 中的源码绑定。

## Findings

| ID / 严重度 | 发现与证据 | 影响与处置 |
|---|---|---|
| `R4FS-001 / P1` | **合法 shape/axis 组合的产品分母仍未定义。** 设计第 263–265、273 行把 Select-Text 41 项与 Select-Num 来源限定为局部证据；所有 Select-Text 行 `product_legality=NOT_READY`，Num 也明确保留 type 2/5 组合 UNKNOWN。 | `PARTIALLY_ADDRESSED / OPEN` 合理。局部分类不是产品支持组合清单；不得将各轴做笛卡尔积或把候选输入计作合法形态。冻结前仍需生产创建与消费路径共同支持的合法/拒绝组合和历史兼容分母。 |
| `R4FS-002 / P1` | **全生命周期来源链仍不完整。** 设计第 263–267、274 行明确说局部来源只支持部分创建/配置/校验或消费者/持久化索引，未覆盖逐 shape 的 producer、配置确认、实际运行 consumer、画布保存/回读/重开与 history/undo/redo 完整链。 | `PARTIALLY_ADDRESSED / OPEN` 合理。对账 Review r002 的 R4R2-002 也要求 NUM 路线不得把“识别保存 owner”说成端到端保存恢复验证；当前设计已保持该边界。后续按 shape 给出版本绑定的路径证据，缺口留在 OPEN。 |
| `R4FS-003 / P1` | **全形态 Cases 尚不可执行。** 当前 JSON 有 32 项，逐项均为 `fixture_payload=null`、`oracle_status=NOT_READY`、`execution_status=NOT_RUN`，且 `execution_evidence=[]`。16 项义务虽然均有映射登记，仍全为 `NOT_RUN`。 | 保持 OPEN。映射行和结构计数不能代替输入、完整结果/拒绝 oracle、零副作用断言、保存重开证据或真实权限执行，AC-S02-02 继续 pending。 |
| `R4FS-004 / P1` | **对象身份与条件字段动作仍未完整路径化。** 设计第 276 行承认 `id`、`defaultValue`、`defaultMapValue`、`optionFilter` 等字段需要按 shape、容器、阶段、owner 与条件谓词细化；新增来源材料没有关闭这些问题。 | 保持 OPEN。Builder 不能根据字段名推导全局 REBIND/RESET/REMOVE 白名单；需逐路径合同及正反例 oracle。 |
| `R4FS-005 / P1` | **S01 与真实权限前置仍阻断产品接线。** 设计第 256、277–283 行及当前 Session 状态均保留 S01 F01 `CONDITIONAL`、真实权限环境 `BLOCKED / NOT_RUN`；只读拒绝、撤权/恢复和跨标签失效未验证。 | 保持 `BLOCKED / NOT_RUN`。不得用 standalone/admin/mock 替代。保持产品 UI/Store/source-read/target-commit 不准入；只允许明确隔离且有精确 admission 的非权限 detached 子工作。 |
| `R4R2-003 / P3` | **引用的当前来源摘要已再次漂移。** 当前 `Sessions.md` SHA-256 为 `ffa662a1b204691dc3ffc2dcdff7bef79ec46e6744741b1d287f2f65f5a6f7d5`，本轮 Context 绑定此摘要；Evidence Reconciliation r002 第 19–20 行仍将 `5dd977cfe56bfd6f39057d96e72ea91d78bb426983a6e477ec445d8022c5253c` 称为本次读取的当前摘要。FullShape Cases manifest 对 Sessions 的绑定仍为旧值 `a244e45d...`，对 `Select.vue` 的绑定为 `eadbdba2...`，当前源码摘要为 `30efd4a5...`。 | 这些旧摘要不证明当前字节身份。虽然本轮仍通过 Context 直接读取并绑定了当前 Session/源码，且状态内容与设计的阻塞结论相符，但 Evidence Reconciliation r002 和原 Cases manifest 不能被当作当前字节级权威；下游新 Context/Card 应从当前源码及 Session 重建绑定。不得追认或静默修补历史包。 |
| `R4R2-004 / P3` | **r002 设计文件首行版本标题仍标为 r001。** 文件名为 `QueryProductAdapterFullShapeDesign-r002.md`，第 249 行起为 r002 增量，第 289–291 行也声明这是 r002 版本，但第 1 行仍为“设计候选 r001”。 | 版本身份有轻微歧义。后续版本修订标题，或在下一增量清楚标注累计基线/版本；不影响本轮对其内容边界的判断，也不构成产品准入。 |

## 前轮处置与新增证据判断

- R4FS-001..005 的 disposition 均与当前材料一致。尤其是 41 条 Select-Text 分类、NUM 局部路径、候选 Case 数和义务映射都没有被升级为产品合法分母、完整来源链、可执行测试或验收通过。
- Evidence Reconciliation Review r002 的 R4R2-001 在当时记录的 Sessions 当前摘要已再次过期；本轮发现 R4R2-003 是后续字节变化，不反向否定其当时对账，但限制该旧摘要的当前可引用性。R4R2-002 的全生命周期提醒已由设计第 264、274 行明确保留。
- 设计第 281–283 行把 AC-S02-02/03 留为 pending，并将进一步工作限制为静态来源补充、纯设计或另行准入的 detached building block；此表述与证据和权限/S01边界一致。
- 权威材料主包 AM-09 仍为第 3/3 轮 `NEEDS_REVISION`，审后更正结论不改变主包状态。它是独立交付物的轮次终止，不限制 S02 后续其他交付物；本轮也未把主包更正当作全形态准入。

## 后续可执行边界

设计可以作为带界限的候选底稿继续迭代，但不能冻结完整 F01。下一切片应按各自的独立交付物维护评审轮次（每个最多三轮），先更新 Context/Card 的当前字节绑定，再针对具体 shape 补齐缺失阶段/owner 与精确 fixture/oracle。静态取证或 detached helper 的实现仍须具备单独的有效设计、可信 RED、同身份 GREEN、精确 Builder admission 和明确写入范围。S01、真实权限环境、完整 Cases、完整 Design Freeze、独立 Validation 和原始 10/26/16 分母验收仍是 Goal 其余必要工作；本报告不关闭任何 Goal AC，不修改 Scope，不声称 S02 Goal 达成。
