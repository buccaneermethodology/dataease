# KYM 对齐矩阵（S00 / r003 候选）

原始意图覆盖F01–F08；Q01允许分阶段交付，Q02差异驱动，Q03确认决策优先。此文件是文档对齐，不是KYM重建、TCO批准或阶段验收。

## 版本与目标边界

Draft r001 [DataEase_KYM_Draft_r001_20261014.md:L57](/Users/xiaomei/Documents/projects/dataease/docs/Req-Func-Optimization/DataEase_KYM_Draft_r001_20261014.md:57) 的Target Profiles为空属于旧版语境。r005 [kym-r005.md:L129](/Users/xiaomei/Documents/projects/dataease/.kym-tco/dataease/kym/views/kym-r005.md:129) 明确增加用户指定W0–W4阶段候选；此轮只引用既有ID，不创造新TP。r005中仍保留旧“未创建Profile”文本，按其明确的当前波次/旧基线说明解释，不删除旧证据。

| 已有Target | 目标 | 功能/Session边界 | 来源 | 当前声明上限 |
|---|---|---|---|---|
| target_w0 | 需求、现状、技术风险明确 | F01–F08；S00/S01 | [kym-r005.md:L467](/Users/xiaomei/Documents/projects/dataease/.kym-tco/dataease/kym/views/kym-r005.md:467) | 阶段候选，退出条件待实现/验证；本次仅S00文档 |
| target_w1 | 建立UI与交互交付节奏 | F02/F06/F01；S03/S07/S02 | [kym-r005.md:L473](/Users/xiaomei/Documents/projects/dataease/.kym-tco/dataease/kym/views/kym-r005.md:473) | 阶段候选，退出条件待实现/验证；本次仅S00文档 |
| target_w2 | 查询、选项与透视能力可验证 | F04/F05/F07；S05/S06/S08 | [kym-r005.md:L479](/Users/xiaomei/Documents/projects/dataease/.kym-tco/dataease/kym/views/kym-r005.md:479) | 阶段候选，退出条件待实现/验证；本次仅S00文档 |
| target_w3 | 数据正确性和权限闭环 | F03/F08；S04/S09 | [kym-r005.md:L485](/Users/xiaomei/Documents/projects/dataease/.kym-tco/dataease/kym/views/kym-r005.md:485) | 阶段候选，退出条件待实现/验证；本次仅S00文档 |
| target_w4 | 可发布候选版本 | F01–F08；S10 | [kym-r005.md:L491](/Users/xiaomei/Documents/projects/dataease/.kym-tco/dataease/kym/views/kym-r005.md:491) | 阶段候选，退出条件待实现/验证；本次仅S00文档 |

## 功能—目标—边界—未决

| 功能 | 用户价值/目标 | 已有Target归属 | KYM来源 | 边界 | 未决及后续证据 |
|---|---|---|---|---|---|
| F01 | 复用完整过滤配置 | target_w0（基线）；target_w1（交付）；target_w4（发布验证） | [kym-r005.md:L85](/Users/xiaomei/Documents/projects/dataease/.kym-tco/dataease/kym/views/kym-r005.md:85)；Draft业务规则相应F章节 | 同类同用户同数据集；无OS剪贴板/共享模板 | 复制机制、字段兼容与安全待证；详见CoverageIssues.json，原文逐项见RequirementCoverageMatrix.md |
| F02 | 指定App当前表格全屏 | target_w0（基线）；target_w1（交付）；target_w4（发布验证） | [kym-r005.md:L87](/Users/xiaomei/Documents/projects/dataease/.kym-tco/dataease/kym/views/kym-r005.md:87)；Draft业务规则相应F章节 | 手机/平板、普通表/透视表；无全屏多表切换 | 宿主版本/导航/方向接口及性能环境；详见CoverageIssues.json，原文逐项见RequirementCoverageMatrix.md |
| F03 | 全量展示结果完整导出 | target_w0（基线）；target_w3（交付）；target_w4（发布验证） | [kym-r005.md:L89](/Users/xiaomei/Documents/projects/dataease/.kym-tco/dataease/kym/views/kym-r005.md:89)；Draft业务规则相应F章节 | 全部表格类、三格式；权限脱敏与永久文件下载复核 | 图片容量、权限覆盖证明、异步阈值及未裁建议；详见CoverageIssues.json，原文逐项见RequirementCoverageMatrix.md |
| F04 | 候选值自身过滤与级联 | target_w0（基线）；target_w2（交付）；target_w4（发布验证） | [kym-r005.md:L91](/Users/xiaomei/Documents/projects/dataease/.kym-tco/dataease/kym/views/kym-r005.md:91)；Draft业务规则相应F章节 | 不改变数据权限/最终查询；无正则；失败不放开 | 动态表达式、字段ID、空值语义及性能环境；详见CoverageIssues.json，原文逐项见RequirementCoverageMatrix.md |
| F05 | 条件样式与枚举来源 | target_w0（基线）；target_w2（交付）；target_w4（发布验证） | [kym-r005.md:L93](/Users/xiaomei/Documents/projects/dataease/.kym-tco/dataease/kym/views/kym-r005.md:93)；Draft业务规则相应F章节 | 字段/跨字段按现有边界；新增明细样式，不改历史汇总 | 实际支持矩阵与原分母Scope Gap；草稿/审计待裁；详见CoverageIssues.json，原文逐项见RequirementCoverageMatrix.md |
| F06 | 批量添加排序与移动 | target_w0（基线）；target_w1（交付）；target_w4（发布验证） | [kym-r005.md:L95](/Users/xiaomei/Documents/projects/dataease/.kym-tco/dataease/kym/views/kym-r005.md:95)；Draft业务规则相应F章节 | 普通表/透视表；单字段原子、可部分成功、一次刷新 | 转换/区域上限/撤销能力待证；详见CoverageIssues.json，原文逐项见RequirementCoverageMatrix.md |
| F07 | 高基数枚举搜索与真实值输入 | target_w0（基线）；target_w2（交付）；target_w4（发布验证） | [kym-r005.md:L97](/Users/xiaomei/Documents/projects/dataease/.kym-tco/dataease/kym/views/kym-r005.md:97)；Draft业务规则相应F章节 | 初始/搜索/累计三种5000；不新增源数据/搜索分页 | 匹配/批量容量/性能待证，一键清除待裁；详见CoverageIssues.json，原文逐项见RequirementCoverageMatrix.md |
| F08 | 按指标自定义行小计/总计 | target_w0（基线）；target_w3（交付）；target_w4（发布验证） | [kym-r005.md:L99](/Users/xiaomei/Documents/projects/dataease/.kym-tco/dataease/kym/views/kym-r005.md:99)；Draft业务规则相应F章节 | 底层记录计算；行右侧汇总列；无任意SQL/列方向新增 | 表达式引擎/局部重算/性能待证；辅助与模板待裁；详见CoverageIssues.json，原文逐项见RequirementCoverageMatrix.md |

## 语义对齐与保留事项

- Draft与r005业务规则沿用V1.0的Q01–Q156结构；本轮以完整DecisionLedger回查，不把原Markdown自称“完整”当证明。原文逐项处置及Q定位在覆盖矩阵，未决不能因存在KYM条目而关闭。
- F05原文要求指标等字段能力；Q71只按现有能力修复的范围差异必须保留。Q72的来源切换是Q71的明确最小改造例外；Q79七种样式属性和Q87预览按钮若缺失必须补齐，原确认已确定，不列为用户重裁事项。原文字段类别范围差异与这三项已授权能力应分别记录。
- F08方向以Q146完整确认解释：行汇总是每个数据行右侧汇总列，列汇总是底部汇总行。本次不从KYM简写推断方向。Q138/Q139底层记录聚合、Q151局部重算、Q152每次重新计算都独立保留。
- Customer/最终验收方、宿主版本、性能环境仍待来源或技术证据；不创造角色或长期客户分群。W0阶段候选存在不表示S01被本轮授权。
- 未执行跨功能冲突检测，未运行产品构建、测试或服务，没有实现/验证/接受声明。

- 完整Q103已明确跨图表移动不纳入，V1 L301“跨图表批量移动未裁定”仅是摘要失真，不进入待用户问题。Q090历史冲突及汇总样式保持旧行为，新增或修改规则按新约束校验；不把所有历史超过20条情形笼统视为重新裁定。

## CoverageReview 修订说明

原始450条为来源内容登记，包含元信息、价值目标、数据项、历史检查和重复表述，不代表450条有效规则。目标收益约30%不是已测结果或已确定硬性AC。D09选填/条件性提醒不阻塞S00；D10先技术核查计时口径。Q064保存/退出规则、Q076/Q078/Q088冲突拒绝规则已裁，不重新开放；自动草稿、覆盖提示、独立一键复用等只保留未批准建议。当前必须明确的业务问题是D11整表公式数量上限；其他建议只有拟新增交付时需范围选择，D07先核实现有入口。本次修订仍待独立复验。
