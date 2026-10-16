# S00 同步 KYM / TCO 独立语义审查

- reviewed_at: 2026-10-15T08:29:18.287517+00:00
- snapshot_id: S00-KYM-R006-TCO-R002
- as_of_state: KYM r006 / TCO r002 / coverage-kym-r006-r002，候选未批准。
- verdict: **REPAIR_REQUIRED（需修复后增量复核）**。
- Design Freeze Validity: **INVALID_FOR_FINAL_CANDIDATE（当前候选不宜作为最终语义基线）**。
- Implementation Entry Readiness: **NOT_AUTHORIZED（本任务不授权 S01 或产品实现）**。

任务是将已完成的 S00 文档成果及两次用户裁定同步到候选 KYM/TCO；不是重新执行 S00、调查产品代码或证明运行实现。用户已授权普通 CLI，缺 supported-host 不构成本次阻塞。审查卡 validate/render 均通过，expected canonical digest 为 `d30009f4ec54fb8b02c4fc690502f05997a86ef503f76f6f34f0fee94c6b2177`。

## 当前候选的阻塞发现

1. **R01：来源行未承载结论。** KYM `s00_f06_cross_chart` 指向 `decisionledger-beac0e26392a.json:3636`，该行只有 Q103 ID；“不同图表之间批量移动不纳入”在第 3648 行 confirmation。修订时绑定包含确认正文的范围，并同步 placement ledger。主代理亦独立发现此项，本文核实成立。
2. **R02：混合条款整体 superseded 导致未替代内容退出当前语义。** `req_f06_open_02` 被整条置为 past/superseded，关联问题 resolved，但新 `s00_f06_cross_chart` 只解决跨图表移动，未保留原“批量拖放最大选中数未裁定”。目标区域容量规则不是最大选中数。另 `req_f08_source_note_13` 被整体 superseded，新复用决定只解决辅助能力范围，当前 statement 中丢失无/求和/平均/最大/最小/计数/自定义下拉选项；S00 `acceptancecriteria-e07eba2e0434.md:1177` 明确保留该规则。应拆分部分 supersession，或补当前原子陈述与适当未决条目；历史文本可见不等于当前规则保留。同步对应 TCO 投影与 coverage。
3. **R03：共同范围决定被跨功能整体投影。** TCO F07/F08 均把 `s00_reuse_scope` 全文作为 mandatory invariant 和 requirement；F07 因而含公式辅助能力，F08 含枚举一键清除。两节点 scope 描述虽正确，mandatory 条款及 coverage notes 仍错配。应保留共同裁定来源、按 F07/F08 分别形成精确功能切片，再同步 projection ledger、mandatory IDs 和 coverage evidence。不能用总体裁定的存在替代节点级语义匹配。
4. **R04：最终收尾声明超出引用证据时点。** `s00_completed` 声称“独立审查和最终收尾”，但仅引用 `dashboardreconciliation-912070d136d0.md:1–28`；该报告明确尚需主流程执行 wrapper / Stop Gate / readback，不能证明最终收尾。真实收尾可能已有，但本候选未引用支持它的证据。补最终有效 receipt / closeout 的精确来源，或将陈述限于已独立审查的文档交付；保留 S01 未授权和未 Frozen 边界。

这些均是当前同步任务内可修复问题，不需要用户重新裁定已批准范围，也不要求扩大产品调查。

## 已通过的边界与核验

- candidate-manifest 的 10 个绑定文件摘要全部匹配；KYM r005→r006 的 Profile 定义原样保留。TCO W0–W4 requirement 分母仍为 **2 / 5 / 5 / 4 / 10 = 26**；W0 保持 S00 + S01，未声称退出。
- TCO 保留 18 节点、13 个 M1，coverage requirement 共 177 条；13 个 coverage records 均 design_only / contract_defined，未升级运行覆盖。运行实现 Met 0/26、Gap 26/26 与当前状态边界一致。
- 两次用户裁定已正确进入 KYM：每表最多 10 条，小计/总计分别计数；D07/D08 仅复用已有能力、缺失不新增并记录差异，Unknown 不当缺失或已实现。F05 例外、F08 右侧行汇总、14 项技术依赖及原建议边界保留。
- r005→r006 差异、r001→r002 新节点约束、projection ledger、source placement、coverage 新要求与引用已读取；没有重做 156 题完整审查，也未执行产品代码调查。
- evidence-snapshot-map 的全部源与快照字节一致。CLI 包目录及 artifact index 存在；package-result 保留 candidate_not_approved / approval not_requested。CLI 包通过和审计通过不替代本语义审查，不证明产品测试。
- Closeout、intake、package-result 及 reader 入口边界已读取；当前报告不能给该候选最终 accept。普通 CLI 未被误称 supported-host 管线完成。

## 修复与复核入口

保留 r006 / r002 及本报告作为历史证据；由 Builder 生成新修订、同步来源定位、当前原子语义、节点投影及包。下一轮只复核 R01–R04 修复及其受影响的 Profile / coverage / closeout 摘要，不重复已通过的 S00 全量工作。最终包和 Closeout 发生变化后须重新冻结摘要；最终声明继续维持候选、无产品运行验收、无 S01 授权。
