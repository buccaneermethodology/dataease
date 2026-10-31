# r004 D11补充决定与原Goal完成边界独立审查

**D11数量规则及新增AC/fixture语义通过；完整候选accept_with_revision。Requirements Baseline Validity = VALID_WITH_CONDITIONS；S01 Entry Readiness = BLOCKED。原Goal第9节Success尚未满足。**

原D11阻塞已由用户明确答复消解，不得重复询问。当前尚需明确的是D07/D08原功能范围如何进入本轮完成边界，不能把“可继续编制文档”替换为“原Goal已成功”。

## 绑定与证据

- review-card.json先validate PASS、后render；canonical SHA256 `ae305af8db97afa43f5b98c2a10c88238259241c49ca355ca58f7cc235060322`。
- final-candidate-manifest.json SHA256 `9ad98b9a6d8dc729375824adb6645924d72c346ee8bfd4cfdf3add035de33075`，34文件实际摘要全部匹配。
- user-decision.md SHA256 `517481948fd78df9ba27e4e8264cf50620c095add5dd62c0b07911083de72aff`，记录当前线程直接答复“保留每表最多10条，小计与总计表达式分别计数”，有具体工具答复定位。此次新增权威采用full_baseline重新判断完成边界；未变部分沿用r003完整审查与final增量审查。
- conversation-source.md、DecisionLedger.json/csv与r003原字节一致；AcceptanceMapping前167条与已审r003一致。原156题/617选项/156答案/86组合BR不被追加规则覆盖。169 AC、19 fixture、450内容记录之外单列1追加决定/1追加规则。
- 本轮直接审查D11补充文件、AC、fixture、映射、CoverageIssues、AcceptanceIssues、Closeout/Entry/DecisionNeeded及Dashboard，阅读V1 L354–356、L398–413、L436–459及原Goal第5–9节。未运行产品、未改候选。

## Findings与修复清单

| ID | Severity | Evidence / Impact | Recommendation / Disposition |
|---|---|---|---|
| R4-01 | medium | CoverageIssues.json的D11主体已resolved，但review_revision.required_user_question_now仍为[D11]，issue_status_counts仍DecisionNeeded=9且未含resolved。机器和读者会误把已答事项再当未答。 | 修复汇总为实际8个DecisionNeeded、1个resolved、1个ConditionalNonBlocking、4个EvidenceNeeded；删除当前必问中的D11，依本报告将D07/D08范围问题列为完成前需处理，不改其他建议成必问。同步CoverageIssues摘要、AcceptanceMapping引用及manifest；accept_with_revision。 |
| R4-02 | medium | Dashboard/README.md L7仍“当前待整表公式数量裁定”；Big_Ideas.md L7/L16仍数量待裁。Sessions/Decisions及r004已确认D11，当前状态互相冲突。 | 更新这两份Dashboard的当前事实：D11已决定，剩余范围裁定/收尾复核未完成；保留历史r003记录，不改历史报告。重新冻结受影响摘要；accept_with_revision。 |
| R4-03 | high（Goal成功阻塞） | V1 L356明确一键清除新增入口待裁，L400/L413明确公式辅助/跨表模板新增范围未裁，L447–448再次保留，L459要求明确既有复用/新增授权/不纳入。原Goal第9节要求“用户对需要裁定的事项作出明确决策（如有）”及阻塞性finding为零。现有D07/D08只有Agent建议先调查、resolution=null；用户此次只回答D11。 | 必须由用户明确D07/D08范围政策，或明确同意将它们交后续调查再裁并允许S00以条件边界收尾。未答前保持BLOCKED；不得根据requires_user_decision_now=false等Agent派生字段制造业务authority。needs_evidence。 |

R4-01/R4-02是主流程可直接修复的文档问题，不转嫁用户。R4-03不是要求S00擅自开展代码调查；它要求选择原范围的处置政策。技术调查可决定“已有还是缺失”，不能代替用户决定“缺失时是否要新增”。

## D11专项判定

DEC-SUP-D11/BR-F08-SUP-D11的派生规则合理：同表跨指标合计、小计/总计两个配置槽位分别计数、相同文本不去重；Q145的多层小计共用一套不按展示单元格累加；默认非自定义汇总不计；Q155单表达式复杂度边界未被改变。

AC-F08-D11-COUNT与FX-FORMULA-LIMIT以4×2+1=9、补1=10、再加1=11检验允许/拒绝，拒绝时保持已有10条及保存状态；SLOTS验证原槽位修改不增加、实际删除释放、跨表独立、取消/保存重开。600→200与COUNT=3的数值oracle来自FX-AGG，正确。两个新增AC均有来源和fixture，ORIG-L632从待裁改为确认保留并精确追溯，未伪造第157题。

ISS-AC-14保留历史超10、无效/停用槽位、并发写入机制等工程状态，不自动删历史或引入新策略。它不阻塞正常数量规格，可在获授权的后续技术设计明确；若调查发现需改变用户可见规则再提请裁定。D11本身：**accept / 原RF-03已关闭**。历史r003 pending是当时事实，不改写。

## D01–D08及技术依赖的最终分类

| 范围 | 当前判定 |
|---|---|
| D01–D06 | 原附加检查的未批准新增建议；V1 L438明确不得自动升为强制范围。可保留proposal及触发条件，不要求本轮全部开发，也不能声称已纳入/被用户排除。已确认的导出权限/审计、保存、冲突拒绝继续有效。它们不因“存在建议”自动成为即时人类授权阻塞。 |
| D07 | 原文明确一键清除已选值，V1明确新增入口尚待裁；清空搜索框不能替代。技术Unknown可先调查，但本轮完成时采取何种范围政策仍未得到用户决定。 |
| D08 | 函数提示/自动补全、字段点选插入、语法高亮、跨透视表公式模板复用均有原文及V1未裁标记。表达式引擎、实时预览和诊断不能证明已覆盖这些能力。可逐能力选择政策，不能混同模板库与编辑器基础功能。 |
| D09 | 选填国际化/埋点及条件性外部共享提醒保持原身份，S00未执行外部共享，不新增即时裁定或责任人门槛。 |
| D10与既有AcceptanceIssues | 性能计时、环境、图片容量、Provider语义、历史/并发等工程依赖可明确登记；原S00.5和AC05允许AC或显式测试设计阻塞，不要求现在越权执行S01。 |

对D07/D08，精确问题是：“一键清除已选值；函数提示/自动补全；字段点选插入；语法高亮；跨表公式模板复用，这些原文能力按什么范围政策承接？”可选择：

1. 纳入本轮要求：已有能力复用，缺失部分补齐；分别建立验收边界。
2. 仅复用已有能力，不新增；确认这是一项范围限制，后续调查后保留缺失差异。
3. 明确不纳入本轮，保留原范围差异（可逐能力选择）。
4. 明确允许本次S00以条件基线收尾，将这些范围决定留给获授权的S01调查后再裁；这是用户批准的完成边界调整，不是Agent自动关闭原条件。

主代理已报告集中向用户询问；在无答复时本报告不选择任何方案。也不要求同一用户重复批准已决定的D11。

## S00自身AC

| ID | 判定 | 依据 |
|---|---|---|
| AC01 | PASS | 五类原输入及追加用户来源可追溯；旧输入不变。 |
| AC02 | PASS | 原156项来源和规则保持已审结果。 |
| AC03 | PASS_WITH_CONDITIONS | 450原内容有处置；D07/D08等范围未决不隐藏；汇总元数据待R4-01修复。 |
| AC04 | PASS | 既有KYM/Target映射未变。 |
| AC05 | PASS_WITH_CONDITIONS | 169AC含新增数量；技术设计依赖显式保留，不造oracle。 |
| AC06 | PASS_WITH_CONDITIONS | 19fixture含9/10/11与槽位/保存/隔离，规格不是测试结果。 |
| AC07 | PASS（显式阻塞模式） | 独立审查完成，高严重度R4-03明确阻塞；R4-01/02待修复。该条不代表零阻塞成功。 |
| AC08 | PASS | proposed/候选；Builder的CONDITIONAL待独立审查，本报告判BLOCKED；无Frozen或S01授权。 |
| AC09 | PASS（受审范围） | 未改原权威输入或产品，未做跨功能冲突检查。 |

## MH01–08及原第9节Stop Gate

| MH | 状态 | 说明 |
|---|---|---|
| MH-01 | satisfied | 原Goal定稿及分母保持。 |
| MH-02 | needs_revision | 登记/唯一归属存在，但Dashboard当前D11状态需R4-02同步。 |
| MH-03 | satisfied | 输入/来源恢复与追加决定登记。 |
| MH-04 | satisfied | 原156项已核验，不用追加决定改写历史。 |
| MH-05 | satisfied_with_conditions | 原内容与KYM覆盖存在，额外范围仍显式未决，R4-01汇总待修。 |
| MH-06 | satisfied_with_conditions | 原167+2 AC、18+1 fixture规格通过本次语义审阅；技术依赖保留。 |
| MH-07 | satisfied | r003完整/增量及本次重新判断组成独立证据。 |
| MH-08 | blocked（文档候选存在） | Closeout/Entry已交付，但原完成条件所需范围authority尚未闭合，不能以资料齐备替代Success。 |

原第9节逐谓词：输入完整、156核对、覆盖处置、AC/测试设计追溯及资料包均已达到文档证据要求；独立审查已执行，但零阻塞finding和必要人类范围决定仍未满足。故**整体Stop Gate = BLOCKED，Goal不complete**。

两个最终verdict：**Requirements Baseline Validity = VALID_WITH_CONDITIONS；S01 Entry Readiness = BLOCKED**。这是对当前范围authority的判断，不以缺S01执行授权代替就绪度，也不以技术Unknown本身强加业务阻塞。历史Coverage卡片顺序偏差继续引用r003原记录，不宣称无偏差。

下一步：修复R4-01/R4-02并重新冻结，等待D07/D08明确范围回答或用户明确批准条件完成边界，再做有界独立复核。不得在无答复时把r004 Builder的CONDITIONAL候选当已批准Goal成功。
