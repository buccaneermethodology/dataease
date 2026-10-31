# 权威材料审查后更正记录 r002

## 对象与轮次

- 主材料包 canonical ID：`S02-F01-authority-materials-package`；主包独立评审已达 **3/3**，最终报告仍为 `NEEDS_REVISION`。r002 是后续定向更正证据，不是主包第4轮、重开或总评翻转。
- 本记录的父更正：[`AuthorityMaterialsPostReviewCorrection-r001.md`](AuthorityMaterialsPostReviewCorrection-r001.md)，correction自身审查 r001 为 `NEEDS_REVISION`。本 r002 把三个finding逐项处置；其中不能复原的历史原始字节明确保留为证据缺口。
- 主包 r003目标和intake模板不在本次修改范围；本轮不修改其字节、Goal、S01或产品源码。

## 绑定快照与变更记录

| 对象/事实 | 摘要与来源 | 可证明内容 |
|---|---|---|
| 主包更正前 MD | `d6620e24426d18879c2e9326509f6793df85133d2e8b6d002c379f341ad97571`；来自[主包Review r003](reviews/AuthorityMaterialsRequestReview-r003.md)，该报告SHA-256 `b64f0917b1951b07f7469e943955f1478ee73040af3bc9f642587f8b75069e94` | 绑定到第3轮报告记录的更正前摘要；原始MD字节未在本次绑定仓库读集中找到，不能据此重建完整历史diff |
| 主包更正前 intake JSON | `87f37de2856e1e13a536f1e87c06d440ec80bba83f88c7cacb7e25fd58bab733`；来源同上 | 同上；没有宣称持有原字节 |
| 主包当前 MD（截至correction review r001） | `d935b17e5d092f03deed5509a8890de1f050abfc33f069a9ce770f5d172467dc`；来自[更正独立Review r001](reviews/AuthorityMaterialsPostReviewCorrectionReview-r001.md)，SHA-256 `1a6a91b52c64cb06576f6cea66e2065738e7978221464ca063945bd9e1fdf584` | 该review实际绑定的当前MD字节摘要 |
| 主包当前 intake JSON（截至correction review r001） | `71bbf7714ee131c60874914857327471f0379fd200348b2a4f9ecfb10fa60249`；来源同上 | 该review实际绑定的当前JSON字节摘要 |
| correction r001 | `f2ebd7025be7429bc31151bcfa3f57108883e7a5ed3ec985f37531759095a9db` | 第一次更正记录字节，保持历史 |
| correction review Context r001 | `398f32f321e7e923d77153a152f62d03c16fd8f5405272d3fe40a559483496a9`；[Context](planning/ContextBootstrap-AuthorityMaterialsPostReviewCorrectionReview-r001.json) | 绑定更正r001评审输入，不是主包新鲜全包评审 |
| correction r002 本身 | 由后续correction review r002 Context/报告绑定 | 本文不自引用自身摘要 |

**重要限制：** 当前可核验链是“旧摘要由主包第3轮报告记载 → 更正后摘要由correction独立review r001实算绑定”。原始更正前字节未找到，因此没有逐字节old/new diff；不得宣称“完整diff已复核”或用哈希冒充原始字节。主包只得到下列条款级定向修正证据，整体结论继续 `NEEDS_REVISION`。

## CORR-01：条款级更正与证据范围

截至 correction review r001 实际绑定的更正后字节，静态确认以下现状：

1. `AuthorityMaterialIntakeTemplate-r003.json` 的 `successful_path_preserves_required_immediate_preview.source_ref` 指向 `Goal.final.json#/must_have_ledger/20/requirement`，命中 `AC-F01-Q014`，并有“成功立即预览新条件”的原文。
2. `rejected_operation_does_not_mutate_target_or_emit_success.source_refs` 组合指向同一Q014条款和 `Goal.final.json#/sections/business_rules`，覆盖失败不提示/目标不变与不查询。
3. 当前包全量前后差异仍不可复核，因为更正前原始MD/JSON未绑定；以上只覆盖可定位的当前具体断言。

主包Review r003的 `NEEDS_REVISION` 不变。本记录不把原AM-09改写成“全包source lineage已通过”。

## CORR-02：快照导航

- `ContextBootstrap-AuthorityMaterialsReview-r003.json` 是主包第3轮 **更正前输入** 的历史快照，其目标MD/JSON摘要为上表更正前hash。不得继续称其为correction后的当前快照。
- correction r001评审的当前输入快照是[ContextBootstrap-AuthorityMaterialsPostReviewCorrectionReview-r001.json](planning/ContextBootstrap-AuthorityMaterialsPostReviewCorrectionReview-r001.json)，SHA-256 `398f32f321e7e923d77153a152f62d03c16fd8f5405272d3fe40a559483496a9`；其绑定更正r001评审时的更正后MD/JSON bytes（上表摘要）。
- 本r002及其新复核使用新建的Context Bootstrap r002；该复核摘要将由独立Review r002报告绑定。历史Context均保留，绝不覆写追认。

## CORR-03：Goal义务与工程落点分层

- 产品结果authority：`Goal.final.json#/must_have_ledger/22/requirement`（`AC-F01-ORIG-01`），规定只读用户不能查看/复制/粘贴且不能只隐藏按钮冒充鉴权通过。该条约束用户可见结果，不逐字规定权限实现层。
- 工程实现规则：[`AGENTS.md`第5节“数据查询、图表与权限”](../../../../AGENTS.md#5-数据查询图表与权限) 明确“前端隐藏菜单或按钮不等于鉴权。后端必须检查实际资源、操作和访问身份”。因此“服务端强制检查”是由工程规范支持的实现约束/解释，不是AC-F01-ORIG-01逐字原文。
- `sdk/api/api-permissions`中的API只作为契约/源码来源；本地standalone替补、admin或mock均不能证明真实权限实现或拒绝行为。permission environment继续`BLOCKED / NOT_RUN`。
- 主包r003 intake字段的当前Goal source pointer仍只指向AC条目；它不因本更正记录的解释而被修改或冒称已经包含第二个source ref。

## 结果与未决事项

correction r001审查的Q014 pointer、预览锚点与待决规则同步均由审查报告给出静态支持；CORR-02/03通过补充历史/当前快照分层及明确组合来源处置。CORR-01只被限定为可核验条款级证据，完整原始字节diff仍不可复核。主材料包继续为第3/3轮 `NEEDS_REVISION`；真实authority、隔离多用户权限、S01 F01条件与产品Builder门槛没有变化。此更正不是Goal完成证据。
