# F01 设计覆盖追溯候选 r001

状态：`CANDIDATE_FOR_INDEPENDENT_SEMANTIC_REVIEW`。本文件用于 AC-S02-02 的来源到设计/测试入口追溯；不修改 Goal、CoverageMatrix、AC、Fixture 或产品状态。

## 范围与结论上限

本次逐项追溯 16 项冻结产品义务：14 项 F01 AC 加 `AC-F04-Q066/Q067` 两项 F01 对 F04 查询组件的既有关联约束。每行保留源 AC、可定位的 Q/REQ/BR/DEC/Issue、现有设计入口和登记的测试/fixture。`TC-AC-*` 测试 ID 登记在 `CoverageMatrix.json` 的 `test_ids` 字段；AC 验收谓词、fixture 规格、可执行测试资产和运行/验收证据分别追溯，不相互替代。

本追溯只判断“是否有可定位设计/测试入口”及“哪些具体内容仍缺证据”。它不证明设计语义正确、不证明 16 项产品义务通过，也不构成 AC-S02-02 的关闭决定；完整判断需独立 Semantic Review。产品权限、保存回显、运行测试和 S01 F01 前置继续保留原状态。

| 产品 AC | 来源链 (Q / REQ / BR / DEC / Issue) | 现有设计入口 | 测试登记 | 当前设计/证据缺口 | 产品执行状态 |
|---|---|---|---|---|---|
| `AC-F01-Q004` | Q004 / REQ-004 / BR-F01-001 / DEC-004 / 无登记Issue | CompatibilityMatrix.md §AC-F01-Q004; QueryTargetComponentMapDesign-r001.md; QueryProductAdapterDesign-r004.md | `TC-AC-F01-Q004` / FX-COPY | 类别兼容与目标不变规则已有设计入口；对应完整产品行为仍待执行验收。 | `NOT_RUN` |
| `AC-F01-Q005` | Q005 / REQ-005 / BR-F01-002 / DEC-005 / 无登记Issue | CompatibilityMatrix.md §AC-F01-Q005; QuerySingleSelectDesignCarrierLifecycleDesign-r004.md | `TC-AC-F01-Q005` / FX-COPY | 跨标签共享/刷新不续期需要真实共享存储与身份生命周期；纯owner helper未证明此项。 | `NOT_RUN` |
| `AC-F01-Q006` | Q006 / REQ-006 / BR-F01-003 / DEC-006 / 无登记Issue | CompatibilityMatrix.md §AC-F01-Q006; CascadeIdentityRebindingDesign-r001.md; QueryTargetComponentMapDesign-r001.md | `TC-AC-F01-Q006` / FX-COPY | 数据集/字段ID同名异ID拒绝须在目标映射与真实产品路径验收。 | `NOT_RUN` |
| `AC-F01-Q007` | Q007 / REQ-007 / BR-F01-003 / DEC-007 / 无登记Issue | CompatibilityMatrix.md §AC-F01-Q007; QueryProductCommitDesign-r005.md; QueryProductCommitSavedOwnerProductEntranceDesign-r001.md | `TC-AC-F01-Q007` / FX-COPY | 确认/取消、旧目标不变、完整原子提交和预览刷新仍待产品入口接线与验证。 | `NOT_RUN` |
| `AC-F01-Q008` | Q008 / REQ-008 / BR-F01-004 / DEC-008 / ISS-AC-01 | CompatibilityMatrix.md §AC-F01-Q008; PureSubcontracts-r002.json; QuerySingleSelectDesignCarrierLifecycleDesign-r004.md | `TC-AC-F01-Q008` / FX-COPY | ISS-AC-01精确1800秒边界仍需在产品入口验收；detached TTL子合同不证明共享剪贴板生命周期。 | `NOT_RUN` |
| `AC-F01-Q009` | Q009 / REQ-009 / BR-F01-004 / DEC-009 / 无登记Issue | CompatibilityMatrix.md §AC-F01-Q009; QueryProductCommitSavedOwnerProductEntranceDesign-r001.md; PermissionEnvironment.md | `TC-AC-F01-Q009` / FX-COPY | 真实身份、数据集访问/目标编辑授权及撤权后拒绝均需隔离多用户环境；当前BLOCKED。 | `NOT_RUN` |
| `AC-F01-Q010` | Q010 / REQ-010 / BR-F01-002 / DEC-010 / 无登记Issue | CompatibilityMatrix.md §AC-F01-Q010; QuerySingleSelectDesignCarrierLifecycleDesign-r004.md | `TC-AC-F01-Q010` / FX-COPY | 系统剪贴板不读写和DataEase内部跨标签共享需实际运行验证。 | `NOT_RUN` |
| `AC-F01-Q011` | Q011 / REQ-011 / BR-F01-005 / DEC-011 / 无登记Issue | CompatibilityMatrix.md §AC-F01-Q011; QuerySingleSelectDefaultRebuildDesign-r003.md; QueryProductPastePreparationDesign-r006.md | `TC-AC-F01-Q011` / FX-COPY | 空源禁用、旧复制保留及既有删除/清空回归均未运行。 | `NOT_RUN` |
| `AC-F01-Q012` | Q012 / REQ-012 / BR-F01-005 / DEC-012 / 无登记Issue | CompatibilityMatrix.md §AC-F01-Q012; QuerySchemaProjectionDesign-r001.md; QueryTreeRelationRebindingDesign-r001.md; QueryProductCommitDesign-r005.md | `TC-AC-F01-Q012` / FX-COPY | 动态规则、完整结构、查询零刷新失败路径仍需冻结Cases与产品行为验证。 | `NOT_RUN` |
| `AC-F01-Q013` | Q013 / REQ-013 / BR-F01-006 / DEC-013 / ISS-AC-02 | CompatibilityMatrix.md §AC-F01-Q013; PureSubcontracts-r002.json | `TC-AC-F01-Q013` / FX-COPY | ISS-AC-02字节口径待环境/合同实测；PureSubcontracts-r002只冻结设计边界。 | `NOT_RUN` |
| `AC-F01-Q014` | Q014 / REQ-014 / BR-F01-007 / DEC-014 / 无登记Issue | CompatibilityMatrix.md §AC-F01-Q014; QueryProductCommitDesign-r005.md; QueryProductCommitSavedOwnerProductEntranceDesign-r001.md | `TC-AC-F01-Q014` / FX-COPY | P0/P1/P2保存失败/成功重开观察和原保存路径未在本次验证。 | `NOT_RUN` |
| `AC-F01-Q015` | Q015 / REQ-015 / BR-F01-001 / DEC-015 / 无登记Issue | CompatibilityMatrix.md §AC-F01-Q015; QueryProductAdapterDesign-r004.md; QuerySchemaProjectionDesign-r001.md | `TC-AC-F01-Q015` / FX-COPY | 完整支持字段白名单和无法承载时整次拒绝待接口级验证。 | `NOT_RUN` |
| `AC-F01-ORIG-01` | 无Q映射（原始验收） / 无独立REQ记录 / 无BR映射 / 无DEC映射 / 无登记Issue | CompatibilityMatrix.md §AC-F01-ORIG-01; PermissionEnvironment.md; QueryProductCommitSavedOwnerProductEntranceDesign-r001.md | `TC-AC-F01-ORIG-01` / FX-COPY | 真实只读用户查看/复制/粘贴拒绝与后端直连授权均未验证；权限模块/隔离账号不可用。 | `NOT_RUN` |
| `AC-F01-ORIG-02` | 无Q映射（原始验收） / 无独立REQ记录 / 无BR映射 / 无DEC映射 / ISS-AC-12 | CompatibilityMatrix.md §AC-F01-ORIG-02; Design.md §来源与重基线; 当前 S01 F01 Entry Packet：`NOT_AVAILABLE`（现有 SP-004/Resume-r004/S01EntryPacket.md 为历史条件候选，不是当前终态资料包） | `TC-AC-F01-ORIG-02` / FX-COPY | 历史入口和回归证据须绑定当前S01 F01 Entry Packet与独立终态；该资料包及终态摘要仍待S01收尾提供，不以历史候选或调查终态替代。 | `NOT_RUN` |
| `AC-F04-Q066` | Q066 / REQ-066 / BR-F01-008, BR-F04-011 / DEC-066 / 无登记Issue | CompatibilityMatrix.md §AC-F04-Q066; CascadeIdentityRebindingDesign-r001.md; QueryTreeRelationRebindingDesign-r001.md; QueryProductAdapterDesign-r004.md | `TC-AC-F04-Q066` / FX-CASCADE | 完整查询字段承载、级联闭包/环与整次拒绝需产品实现及运行验证；不得删边/删字段降级。 | `NOT_RUN` |
| `AC-F04-Q067` | Q067 / REQ-067 / BR-F01-008, BR-F04-011 / DEC-067 / 无登记Issue | CompatibilityMatrix.md §AC-F04-Q067; QueryTreeRelationRebindingDesign-r001.md; QueryProductAdapterDesign-r004.md; QueryProductCommitDesign-r005.md | `TC-AC-F04-Q067` / FX-CASCADE | 独立副本跨仪表板修改/保存重开仍需真实产品验证；引用设计不表示已隔离。 | `NOT_RUN` |

## 必须保留的跨项边界

- `REQ-004..015` 与 `DEC-004..015` 的 Q→BR/AC 对应关系来自 `AcceptanceMapping.json`；`AC-F01-ORIG-01/02` 在该映射中没有独立 Q/REQ/BR/DEC，不伪造编号，直接保留来源 AC 与其 FX/Issue 追溯。
- `AC-F04-Q066/Q067` 追溯 `REQ-066/DEC-066/DEC-067` 和 `BR-F01-008 + BR-F04-011`；它们是完整查询复制和独立副本约束，不扩大到 F04 全功能实现。
- `ISS-AC-01` 与 `ISS-AC-02` 仍 open；未决项继续挂在对应AC，不通过 crosswalk 重新解释。`ISS-AC-12` 的历史组件改类型回归入口不能由静态引用直接判为完成。
- `AC-F01-ORIG-01` 权限义务仍 `BLOCKED / NOT_RUN`；standalone/admin/mock 和源码痕迹都不作替代。Goal要求的 S01 F01 Entry Packet、独立审查与终态摘要仍单独待满足。
- `Design.md` 中早先“父流程通知S01已收尾”的记录现已明确标注为无终态回执的历史通知；按用户原始意图，S01仍在收尾，具体F01入口前置保持未满足。该通知不得解除产品Builder准入。
- 本次新增追溯不改 `CoverageMatrix.json`。16 行仍是 `NOT_RUN`、`result=null`、`evidence=[]`；10 项 Goal AC 和 26 项 must-have 状态不变，`Scope Delta: none`。

## 已读权威与复核边界

来源：[S00 AcceptanceCriteria](../SP-004/Resume-r004/AcceptanceCriteria.md)、[AcceptanceMapping](../SP-004/Resume-r004/AcceptanceMapping.json)、[DecisionLedger](../SP-004/Resume-r004/DecisionLedger.json)、[AcceptanceIssues](../SP-004/Resume-r004/AcceptanceIssues.json)、[CoverageMatrix](CoverageMatrix.json)、[Design](Design.md)、[CompatibilityMatrix](CompatibilityMatrix.md)、[TestStrategy](TestStrategy.md)、[DesignGapReconciliation r002](DesignGapReconciliation-r002.md) 与其独立 Review。具体设计文件在上表逐项链接；链接以本目录路径为基准。

本文件没有运行产品代码或测试，不更新 Goal/AC 状态。
