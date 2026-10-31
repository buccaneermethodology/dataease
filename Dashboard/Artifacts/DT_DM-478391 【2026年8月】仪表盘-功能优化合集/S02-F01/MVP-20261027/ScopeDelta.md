# 当前 S02 MVP 范围差异与历史保全

此次新自然语言授权明确改变当前完成前置，不是仅实施顺序。来源：01a16109-aa34-78a0-8f47-f48aebb7e396 / 01a17b46-fa6c-7713-8511-a16644a2f999，原文SHA 2e0f9cb96ed8130b3787263b345e7156fc405a7abafcd4b71569c05709598061；本lane按user角色/turn/text hash独立复验。两份被同意proposal与用户第3项的“所有支持图表”以原消息为准。

旧Goal字节SHA `28c94d3c35d4ce0a891ce77ecc915932d67f88ef813f3d2815dc0dce11f91b64`；canonical `9fd9d11ba6b0d514b9bdb3527dac963221f1467d6851292fd5384b327040f672`。写前manifest与旧Goal不改。**历史原26=10通用AC+16产品；候选ledger38=10修订当前通用AC+16原文approved_deferred+12新MVP产品；当前必须22，landed0**。approved_deferred仅迁出前置，不表示旧验收通过。

## 八项范围变化

- **SD-MVP-20261027-01**：全部受支持图表基本多条件copy/paste代替原图表+query+复杂场景的当前S02完整前置。
- **SD-MVP-20261027-02**：真实权限迁S041；当前仅DEV显式allow/deny/unknown测试桩，unknown拒绝。
- **SD-MVP-20261027-03**：跨context clipboard/DG-02迁S042；当前同页同编辑会话内存与单调TTL。
- **SD-MVP-20261027-04**：通用异步/candidate-query/通用双host迁S043；当前保留单目标单paste与operation/target重查。
- **SD-MVP-20261027-05**：全面渲染资源治理迁S044；不撤销已完成G2工程。
- **SD-MVP-20261027-06**：原query组件复制/级联/独立副本迁S045。
- **SD-MVP-20261027-07**：复杂动态条件、原容量边界和完整历史AC续验迁S046。
- **SD-MVP-20261027-08**：仅可声明权限测试桩下界面MVP；原全量/真实权限/生产ready禁止追认。

## 旧26逐ID迁移

| 原ID | 原文（原样） | 新处置 / 当前ID | 后续Session | 理由 |
|---|---|---|---|---|
| AC-S02-01 | Entry Packet、仓库 revision、权限及前置门槛均可复核。 | revised_current / AC-S02-01 | 当前修订通用AC | 原通用AC按新授权当前MVP边界修订；原文/证据/原pending状态保全，不再以旧全量作前置。 |
| AC-S02-02 | 所有冻结 F01 REQ/BR/DEC/AC 已映射到设计与测试，无关键未决项。 | revised_current / AC-S02-02 | 当前修订通用AC | 原通用AC按新授权当前MVP边界修订；原文/证据/原pending状态保全，不再以旧全量作前置。 |
| AC-S02-03 | Design Freeze Review 有明确结论，代码实现不越界。 | revised_current / AC-S02-03 | 当前修订通用AC | 原通用AC按新授权当前MVP边界修订；原文/证据/原pending状态保全，不再以旧全量作前置。 |
| AC-S02-04 | 复制、兼容校验、粘贴、保存和回显完整链路符合契约。 | revised_current / AC-S02-04 | 当前修订通用AC | 原通用AC按新授权当前MVP边界修订；原文/证据/原pending状态保全，不再以旧全量作前置。 |
| AC-S02-05 | 非法目标、无权限、错误输入和保存失败按契约处理。 | revised_current / AC-S02-05 | 当前修订通用AC | 原通用AC按新授权当前MVP边界修订；原文/证据/原pending状态保全，不再以旧全量作前置。 |
| AC-S02-06 | 权限、安全与历史配置兼容均有验证证据。 | revised_current / AC-S02-06 | 当前修订通用AC | 原通用AC按新授权当前MVP边界修订；原文/证据/原pending状态保全，不再以旧全量作前置。 |
| AC-S02-07 | 冻结 F01 AC 测试覆盖 100%，必需测试通过；失败/跳过/未运行不得隐藏。 | revised_current / AC-S02-07 | 当前修订通用AC | 原通用AC按新授权当前MVP边界修订；原文/证据/原pending状态保全，不再以旧全量作前置。 |
| AC-S02-08 | 既有过滤器回归通过，变更与回滚方案可追溯。 | revised_current / AC-S02-08 | 当前修订通用AC | 原通用AC按新授权当前MVP边界修订；原文/证据/原pending状态保全，不再以旧全量作前置。 |
| AC-S02-09 | 独立审查 findings 有编号、severity、依据、影响、建议及 disposition；阻塞项关闭。 | revised_current / AC-S02-09 | 当前修订通用AC | 原通用AC按新授权当前MVP边界修订；原文/证据/原pending状态保全，不再以旧全量作前置。 |
| AC-S02-10 | 完成最终对账、双 verdict 和 Stop Gate，产出可验证终态凭证。 | revised_current / AC-S02-10 | 当前修订通用AC | 原通用AC按新授权当前MVP边界修订；原文/证据/原pending状态保全，不再以旧全量作前置。 |
| AC-F01-Q004 | （可观察结果）：图表→图表及查询→查询允许；图表↔查询均拒绝且目标配置不变。 | split_current_and_approved_deferred / AC-MVP-F01-01, AC-MVP-F01-04 | DE-EXEC-S045 | 当前图表基本copy及跨类别拒绝；query全量迁后。 |
| AC-F01-Q005 | （可观察结果）：B获得同一配置；不要求跨设备/浏览器；刷新B不得制造新有效期。 | split_current_and_approved_deferred / AC-MVP-F01-03, AC-MVP-F01-10 | DE-EXEC-S042 | 同页内存留当前，跨标签B获取/跨context协议迁后。 |
| AC-F01-Q006 | （可观察结果）：仅D1通过；D2即使字段同名同类型仍拒绝；ID无法确认也拒绝。 | split_current_and_approved_deferred / AC-MVP-F01-04 | DE-EXEC-S046 | 当前严格dataset ID/字段检查；原复杂全矩阵历史AC续验。 |
| AC-F01-Q007 | （可观察结果）：确认后树完全等于T且旧条件消失；取消配置/预览不变；空目标直接应用。 | split_current_and_approved_deferred / AC-MVP-F01-02, AC-MVP-F01-06 | DE-EXEC-S046 | 基本整树/覆盖确认/取消/空目标留当前；复杂全形态续验迁后。 |
| AC-F01-Q008 | （可观察结果）：未过期可重复使用且不消耗、不续期；超过30分钟拒绝并提示重新复制；新复制替换T并重计时；恰30分钟判定见ISS-AC-01。 | split_current_and_approved_deferred / AC-MVP-F01-03, AC-MVP-F01-10 | DE-EXEC-S042 | 当前单页单调30分钟不续期；跨context时间和ISS-AC-01完整政策迁后。 |
| AC-F01-Q009 | （可观察结果）：旧内容不可恢复；每次粘贴重验身份、数据集访问及目标编辑权限，拒绝时不改目标。 | split_current_and_approved_deferred / AC-MVP-F01-05, AC-MVP-F01-10 | DE-EXEC-S041 | 当前身份清空和dev桩每次复核；真实权限/撤权/完整会话迁后。 |
| AC-F01-Q010 | （可观察结果）：DataEase共享内容可用，系统剪贴板不被覆盖；不要求操作系统粘贴快捷键。 | split_current_and_approved_deferred / AC-MVP-F01-03 | DE-EXEC-S042 | 同页内存不写OS保留；原完整共享/跨context续验迁后。 |
| AC-F01-Q011 | （可观察结果）：复制按钮禁用，不通过空复制清空目标；原有删除/清空操作仍可用。 | split_current_and_approved_deferred / AC-MVP-F01-03, AC-MVP-F01-11 | DE-EXEC-S046 | 空源禁用/原清空删除留当前；原全量AC独立续验不称已完成。 |
| AC-F01-Q012 | （可观察结果）：两者过滤命中记录ID相同；保存动态规则而非结果，样式/布局/查询结果不复制。；均校验失败并拒绝粘贴，提示“过滤条件不匹配，请重新复制”；目标旧树、已保存版本和当前预览ID{5}保持，零新过滤查询/刷新，不部分应用可解析片段；有效完整树仍命中{2,3,5}。不新增操作系统剪贴板入口 | split_current_and_approved_deferred / AC-MVP-F01-02, AC-MVP-F01-04, AC-MVP-F01-08 | DE-EXEC-S046 | 基本静态树/结果/整拒绝当前；动态表达式/完整复杂serializer矩阵迁后。 |
| AC-F01-Q013 | （可观察结果）：50且不超容量允许，51或超1MB拒绝且T保持；组合节点不计叶子，1001枚举未超两限应允许；字节口径见ISS-AC-02。 | split_current_and_approved_deferred / AC-MVP-F01-02, AC-MVP-F01-04 | DE-EXEC-S046 | 基本树不裁成单叶且不截断；原50叶/1MB/1001枚举全部边界不作当前前置，原未裁口径保留。 |
| AC-F01-Q014 | （可观察结果）：成功立即预览新条件，只有正常保存后重开保留；取消/失败不刷新、不修改；不新增自动保存。；成功显示“过滤条件已应用”并按T刷新预览；取消/失败不得显示该成功反馈，目标与预览保持原状 | split_current_and_approved_deferred / AC-MVP-F01-06, AC-MVP-F01-07, AC-MVP-F01-08, AC-MVP-F01-09 | DE-EXEC-S043 | 当前准备成功采用/失败保旧/保存重开；通用异步交错/全部renderer强证明迁后。 |
| AC-F01-Q015 | （可观察结果）：通用规则完整应用；维度/指标/排序/样式不带入；无法完整承载时整次拒绝。 | split_current_and_approved_deferred / AC-MVP-F01-01, AC-MVP-F01-02, AC-MVP-F01-04 | DE-EXEC-S046 | 全部受支持图表基本完整承载/不带轴样式当前；复杂规则全矩阵迁后。 |
| AC-F01-ORIG-01 | ：U_editor按既有编辑权可操作；U_view不可查看过滤条件、复制或粘贴，目标不变；不能只隐藏按钮当鉴权通过。 | split_current_and_approved_deferred / AC-MVP-F01-05 | DE-EXEC-S041 | 只证dev三态和现有后端鉴权不变；真实U_editor/U_view不追认。 |
| AC-F01-ORIG-02 | ：保留为历史方案线索，不据此替代F01专门过滤复制；S01检查原组件复制/改类型流程仍可用，当前不把该句升格新操作入口。 | split_current_and_approved_deferred / AC-MVP-F01-11 | DE-EXEC-S046 | 不新增组件复制入口；当前保基本UI回归，不等待S01原全量组件复制改类型关闭。 |
| AC-F04-Q066 | （可观察结果）：完整目标全量独立复制，无查询结果/样式；缺字段/承载不全/成环则整次拒绝；有旧配置需确认。 | approved_deferred / 无当前替代 | DE-EXEC-S045 | query自过滤/级联完整复制整体迁后，当前不宣称query能力。 |
| AC-F04-Q067 | （可观察结果）：互不联动，两个独立副本，跨仪表盘同样成立，不新增共享模板引用。 | approved_deferred / 无当前替代 | DE-EXEC-S045 | query独立副本/跨仪表盘整体迁后，不以图表deepclone替代。 |

## 旧running lane安全移交

| lane | 现态/预算 | 报告 | 迁入/安全动作 |
|---|---|---|---|
| G2 returned-instance ownership | 既有有界工程收尾通过，已实现/独立验证只按原报告范围；Design3/3保留，不重开 | Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/reviews/G2OwnershipCloseoutReconciliation-r001.md | DE-EXEC-S044；保全代码/closeout/浏览器证据，不回退、不称全renderer或MVP通过。 |
| Line/Carousel construction | 全55 NOT_TRUSTED_AS_COMPLETE_RED；7PASS/47断言失败/1合同差异/0执行错误，仅returned-G Line投影可信RED；Design3/3；RED测试包Validation1/3；LSC046和LSCRV001..003未决 | Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/reviews/LineStageConstructionRedValidation-r001.md | DE-EXEC-S044；保全55Cases/写前source/日志/报告，不启动当前S02资源Builder。 |
| Line sibling-host stage | NEEDS_REVISION、runner条件入口、source NOT_READY，无实现；2/3；LSHR-R2-001..003未决 | Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/reviews/LineSiblingHostRenderDesignReview-r002.md | DE-EXEC-S043；保全29Cases/r002审查，不继续第三轮或Builder作为当前前置。 |
| Chart query candidate | NEEDS_REVISION/NOT_READY；无正式RED/生产；legacy取消function-message TypeError oracle QCCD-R2-001开放；2/3；28主68子案identity保留 | Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/reviews/ChartQueryCandidateDesignReview-r002.md | DE-EXEC-S043；移交r001/r002/Review/raw baseline提示，不启动当前query/axios框架。 |
| 旧产品/事务/authority整体包 | 历史NEEDS_REVISION/AM-09等未决保留，新范围不翻转；各自3/3，禁止换名重置第四轮 | ['Dashboard/Artifacts/DT_DM-478391\xa0【2026年8月】仪表盘-功能优化合集/S02-F01/reviews/ChartFilterCopyProductIntegrationDesignReview-r003.md', 'Dashboard/Artifacts/DT_DM-478391\xa0【2026年8月】仪表盘-功能优化合集/S02-F01/reviews/ChartPasteTransactionalPreviewDesignReview-r003.md', 'Dashboard/Artifacts/DT_DM-478391\xa0【2026年8月】仪表盘-功能优化合集/S02-F01/reviews/AuthorityMaterialsRequestReview-r003.md'] | DE-EXEC-S046；新MVP依据明确新authority独立交付，旧发现移交而非通过。 |
| 旧query组件detached/source lanes | 各模块candidate/partial/bounded Validation和authority gap按原文保留；按各原durable报告；未知不补造/不重置 | Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/Sessions.md | DE-EXEC-S045；只迁引用，不改S01/query生产或旧冻结资产。 |

## 自动化与声明

自然语言批准已成立，不再索取同项授权。protected goal_patch只接受显式token而本消息没有，不能伪造token、改工具或声称自动resolve通过。r005是绑定旧字节/canonical与所有replacement的确定性多目标operations；新直接request作为canonical候选，经独立Review后由root绑定native root/predicate。旧root-r002/full predicate保留历史，不复用于当前新分母。

当前只允许最终22项全部证据/独立验收/Gate成立后称“权限测试桩下界面MVP”；原全量、真实权限、生产ready、完整S10就绪禁止提升。S041–046均非当前完成前置且仍未验。
