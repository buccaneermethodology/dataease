# 普通文本单选提取子设计独立语义审查

## 审查结论

- **Design Freeze Validity：FAIL（审查包绑定失效；候选语义仍有未冻结项）**。本报告可指出候选的局部正确性与缺口，但不能作为对 r002 的有效、完整独立审查凭证：review lane card/context/rendered prompt 没有绑定 r002，且确定性 card validation 报摘要漂移。
- **Implementation Entry Readiness：FAIL / NOT_READY**。当前 Builder 必须先重新解释来源认证、字段白名单和载体边界；尚不能由当前材料安全地实现。
- **Overall：BLOCKED**。只有在审查输入重新绑定并复验后，才能形成对 r002 的独立有效结论。以下 findings 是对实际可读材料的有界审查，不修复或替代失效的审查包。

## 审查边界与材料绑定

本次以 `Goal.final.json`（SHA-256 `f562da2e…1daef0`）、`QueryProductAdapterDesign-r004.md`（`863357dd…ce2044`）、`QueryProductAdapterDesignReview-r004.md`（`49a51a77…1395f`）、Sessions r059、源码 `useFilter.ts`、`options.ts`、`QueryConditionConfiguration.vue`、`Select.vue`、实际 r002 设计（`5d043b63…2e7a3`）、实际 r002 fixtures（`39e740f7…2f54dd`）及 Topology r153（`56a066d2…5c08`）为只读证据。

确定性检查：

- `lane_task_card.py validate ...qssdh-r4-01-02-text-single-select-design-review-card-r001.json --repo . --expected-card-sha256 8b52a0a1…c2a74b7` **FAIL**：`card.base_context_refs[4].sha256` 摘要漂移；实际 r001 fixture 为 `40f29d02…749e08`，该审查卡绑定的摘要为 `a059a92b…0926ab`。
- review card-r001 的输入仍指向 Design/Fixtures r001 与 Topology r152，唯一输出目标为本文件。其 rendered prompt 也使用 r001 的来源范围，没有 r002 的绑定。
- Topology r153 声明 design card-r002 canonical SHA-256 为 `47f0cebcaefa6f5e315dd4b8f549621855353a906d60a2c67b34454586ee27b3`；当前 card-r002 文件实际摘要为 `f673e124a93019c2fc203e264cc14068a650273cd287cb32e14541acb37292c0`。该差异未在 r153 记录。
- card/context-r002 的 base refs 和 delta read set 仍列 Design/Fixtures r001，snapshot/rebaseline 仍指 Topology r152；未把实际 Design/Fixtures r002 纳入输入绑定。r002 Context validation 能输出结构化 packet，但不能修复这些语义绑定问题。

据此，r153 不能证明 review lane 已消费其声称的 r002 输入；r111 或其它先前 receipt 也不作为本审查凭证。

## Findings

### F-01（P1）审查输入和拓扑摘要未绑定 r002

**依据：** review card-r001 的 base refs/delta read set 为 r001；其当前 r001 fixture digest 已漂移，validator fail。Topology r153 所列 card-r002 摘要与当前文件不符；card/context-r002 仍绑定 r001 与 r152。

**影响：** 评审者的读取集合、任务指令、拓扑记录和实际候选不是同一输入。不能把这次输出升级为 r002 的 `PASS`、设计冻结或 Builder 准入。

**处置：** BLOCKER。由治理负责人新建/修订 review card 与 Context，使 read set 精确包含 Goal、Scope ledger/Session、r004 review、r002 Design/Fixtures、当前源码及 Topology r153；重新校验摘要并渲染 prompt，再由独立审查者复审。不得回写旧 topology 或覆盖旧候选记录。

### F-02（P1）fixture 身份仍标为 r001

**依据：** `QueryTextSingleSelectExtractionFixtures-r002.json` 顶层 `revision` 为 2，但 `design_id` 仍为 `S02-QSSDH-R4-01-02-TEXT-SELECT-EXTRACTION-r001`；Topology r153 和文件名将该对象作为 r002。

**影响：** case 集与设计版本身份矛盾，可能被旧 identity 消费、被错误关联或在 GREEN/Validation 中误当成 r001。内容修订不自动改变 identity。

**处置：** BLOCKER。修订必须创建新 revision 并一致更新 design_id、Topology 和引用者；本报告不修改 fixture。

### F-03（P1）`sourceStage`/revision 只是调用方提供值，不能认证来源

**依据：** 设计要求调用者证明 `sourceStage=design-config` 且 revision 与资源身份匹配；fixture 仅以普通字段 `sourceStage`、整数 `sourceRevision`、`componentId` 作为接受条件。没有定义可信签发者、不可伪造的来源句柄、可信保存快照读取边界，或如何验证 revision 与资源身份匹配。review-r004 已明确普通 JSON/字段名不能证明设计态来源。

**影响：** 任意运行态 JSON 可复制这些字段伪装成设计快照；拒绝 case 只测 `sourceStage=unknown`，未验证伪造/缺失/错配 revision 或 resource binding。当前 source-stage 结论是 unverifiable，不是已认证。

**处置：** BLOCKER。对本地纯函数切片，应输入由可信调用边界产生的 opaque provenance/binding，或显式把 API 限定为“接受上游已认证的类型化值”；需要定义并测试 revision/resource identity 错配、无来源、伪造普通 JSON均拒绝。不得把 `sourceStage` 字符串本身命名或宣传为认证凭证。

### F-04（P1）字段白名单与完整 adapter 的保留责任没有可执行的精确契约

**依据：** 设计把 `id/name/field/dataset/.../条件与静态展示配置` 概括为 KEEP，但没有给出穷尽字段名、类型、嵌套路径及未知字段判定矩阵。Fixtures 输入含 `name/field/displayId/dataset/required/visible/condition*` 等完整对象字段，expected 却只返回 value-state carrier；测试未说明这些字段是传入校验后忽略、另由调用者保留，还是完整 adapter 的输出。设计同时规定未知/额外字段 `UNSUPPORTED_FIELD`，却未列出已知字段的可接受全集。

**影响：** Builder 可能把 value-state 子载体误写成完整 extractor 并静默丢掉静态配置、身份或引用；也可能把正常源对象字段误拒绝为“额外字段”。这与 r004 要求不凭字段名称删值、完整 adapter 不丢字段的边界有关。

**处置：** BLOCKER。补齐机器可核验的输入键白名单、carrier 精确键、保留/排除/重绑矩阵、字段路径及值类型；明确子函数对完整对象的职责是校验、挑选或只读投影，以及完整静态字段由哪个已审组件承担并怎样验证无损。对所有未列键 fail closed。

### F-05（P2）首次 useFilter oracle 修正正确，但覆盖限于局部投影

**依据：** `useFilter.ts` 中普通文本单选首次取 `defaultValueCheck ? defaultValue : ''`；`forMatterValue` 将 `A` 投影为 `['A']`，随后以非空 `result` 写入 filter。无默认时 `selectValue=''` 在 `!!selectValue?.length` 门槛处不进入该路径，最终不 push 过滤项，即 `[]`。r002 TC-001/TC-006 的首次默认预期 `['A']`、TC-002 的无默认预期 `[]` 与源码路径一致。

**边界：** 这是静态源码投影，不是产品行为或实现测试。Fixtures 没有非首次 load case 来验证水合后的 `selectValue` 被 useFilter 消费，也未在 r002 中执行产品代码。

**处置：** 已修复的首次过滤值 oracle 可作为 bounded source-derived fact；需补非首次路径的精确 case，并在后续同身份验证中复用。不能据此宣称查询已运行或产品已验收。

### F-06（P2）拒绝/无部分输出原则清楚，但精确错误边界仍有空洞

**依据：** 设计列出错误优先级且声明失败不返回 carrier/runtime、source 不变、零副作用；fixtures 覆盖来源未知、空默认、字段选项来源越界。但缺少未知额外键、缺失/错配身份/revision、非法默认类型、关键 shape 键缺失以及静态字段完整保留的反例；TC-003/004/005 的 expected 没有一致声明 `partialOutputOnFailure`，无法统一机器断言全失败路径无部分输出。

**影响：** 当前 6 个 case 不能证明失败优先级、无部分输出及拒绝矩阵完整。

**处置：** 修订冻结 fixtures 时逐个拒绝类别给出同一输出字段集合和 side-effect oracle，加入上述负例；禁止以当前 JSON parse/self-assertion 替代行为测试。

## 对范围、authority 与声称上限的裁定

- 本切片把范围限定为 `displayType="0"`、单选、手工选项且无参数/远程/树/级联/日期，符合 r004 的最短路径；设计明确保留其它形态与完整 Goal 分母，未发现把窄 slice 偷换成全产品适配器的文字。
- Goal 仍是权威；r004 review 是调查与下一步建议，不授予实现准入。Goal 保持 10 项 AC、26 项 must-have、16 项产品义务。只读用户行为、复制/粘贴限制、权限撤销仍为 `BLOCKED / NOT_RUN`；没有以 standalone/admin/mock 替代。S01 继续独立收尾。
- r002 的 claim ceiling 明确排除独立审查、代码、产品、权限与 Goal 验收，这一点适当。应继续使用“r002 候选”状态，不写 `design frozen`、`implemented`、`covered` 或 `complete`。

## 两个独立 Gate 与实施路径

1. **Design Freeze Validity = FAIL。** F-01 至 F-04 未关闭前，当前候选及审查输入无法构成可追溯的冻结设计。首次 useFilter 投影局部正确，不抵消来源/字段语义和身份错误。
2. **Implementation Entry Readiness = FAIL / NOT_READY。** 以当前文件开始 Builder 会迫使 Builder 自行定义 provenance、静态字段保留和拒绝协议，违反“不在实现时补设计”的要求。
3. **Minimum safe slice（后续可准入边界）：** 一个 detached、无副作用的普通手工文本单选 value-state extraction/hydration 函数；仅接受可信上游 provenance；输入与 carrier 键精确白名单；保留默认 A、排除旧运行 B；无默认返回未选中态；默认首次 filter 投影 `['A']`、无默认首次过滤 `[]`；拒绝返回单一错误且无部分 carrier/runtime；source/Store/查询/快照保持不变。不得接 UI、Store、保存、网络、权限或其它 query shape。
4. **Implementation ladder：** 新建并验证 source/provenance 与字段合同 → 冻结同一身份用例和拒绝 oracle → 可信 RED（合同有效且执行成功，按预期 fingerprint 失败）→ 新 Builder card/context/rendered prompt 与精确 target-bound admission → 纯函数 GREEN → 同 identity 独立 Validator。任何阶段都不得修改冻结用例以迎合实现。
5. **下一 Session map：** 当前：r002 候选、r001/r002 身份及 Topology 绑定有漂移；下一项：修订候选与 fixture identity 并修审查 card/context 输入绑定；准入前证据：所有摘要复核、source provenance/type binding 裁定、完整字段矩阵、首次/非首次/拒绝用例、可信 RED；后续实现仅限上述最小切片；必须不声称完整产品适配器、权限、S02 或 S01 完成。

## 语义风险诊断与误用场景

- 主要分类：S2（版本/摘要语义漂移）、S4（来源与字段边界歧义）、S5（当前来源认证不可验证）、S6（Topology/card authority 绑定混淆）；落点为 L3/L4/L5。缓解应在 card/context、契约/fixtures 与 admission 修复，不靠报告措辞掩盖。
- 误用一：Builder 把 `sourceStage="design-config"` 当作可信证书，接受伪造运行 JSON。缓解：opaque trusted provenance/type binding 和错配负例。
- 误用二：Builder 把 value-state 子载体当完整 extractor，丢弃 name/field/dataset/condition 等静态配置。缓解：穷尽字段矩阵及明确责任边界，拒绝未知键。
- 误用三：后续 Agent 只看“r002 design review”标题，却使用仍标 r001 的 fixtures 或以 Topology r153 的错误 card digest 推断已审。缓解：修正一致的 version identity 和拓扑摘要，review card/context/rendered prompt须绑定同一实际摘要。
- 术语压缩检查：仅凭“r002”“复审”或 Session doing 状态，不得读作 Design Freeze 已完成、代码 landed、产品 covered、Goal complete。

## 本次未做事项

只读核对源码与 artifacts，并运行上述 card/context 定向检查；未改设计、fixtures、源码、Goal、Sessions 或 Topology，未实现、未运行产品/浏览器/数据库/权限测试，未发放 Builder admission。真实权限继续 `BLOCKED / NOT_RUN`。本报告只占 review card-r001 声明的唯一输出路径；因该卡输入失效，报告本身不补足有效 r002 review card/context，也不产生准入。
