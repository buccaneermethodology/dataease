# S01进入资料包 r004

S01 Entry Readiness = BLOCKED（Builder候选，等待独立审查）；没有S01执行授权。D11已由user-decision.md决定，不再以数量待裁阻塞。D07/D08与技术oracle需获授权后调查，原范围不删减；独立审查若判定尚需业务决定则据实BLOCKED。

当前资料：DecisionSupplement、原字节DecisionLedger与conversation-source、InputManifest、KYMAlignmentMatrix、RequirementCoverageMatrix、CoverageIssues、DecisionNeeded、169 AC/19 fixture及AcceptanceMapping/Issues。原156Q与86BR之外单列追加1决定/1规则。整合阅读入口DataEase_Q001-Q156_Questions_Decisions_Acceptance_r004.md包含完整原问答及当前派生附件；历史引用与r004当前结论分别标注。

## 待授权后技术调查清单

1. F01：内部跨标签共享、用户隔离/登出失效、字段兼容与叶子计数，边界计时及容量单位。
2. F02：指定App的版本、导航/方向/状态保活能力；手机和平板交互矩阵及首屏有效数据计时。
3. F03：全表格类型/格式、图片上限、同步异步切换/取消/重试、永久文件管理及历史文件权限覆盖证明、响应/执行计时。
4. F04：既有表达式/过滤树/NULL语义、字段ID稳定性、级联查询与保存路径。
5. F05：实际字段选择与渲染支持（不能只看候选数组）、跨字段语义、明细与汇总识别、来源切换和样式属性缺口、历史规则兼容。
6. F06：现有多选、拖拽、转换、区域数量上限、移动原子性及撤销/键盘回归。
7. F07：匹配/类型/空值、批量容量与三类选择器、初始化验证和失败范围；已有一键清除入口。
8. F08：表达式引擎与函数/方言、右侧汇总列底层聚合、按指标/层级局部重算、禁止历史结果缓存与安全资源保护。
9. 所有性能指标：补齐环境/数据规模/复杂度/观测方法后才能执行判定；不能把功能fixture当性能基线。

未在S00查产品实现、执行构建、连接服务或创建真实fixture。此包不授予以上动作权限；不包含Q157跨功能冲突检测，不修改原始需求或任意扩大XPack公开边界。

## D11技术调查补充

每表10条已定，小计总计分别计数；查实际配置槽位、保存校验、历史异常配置与并发保持上限的机制，不擅自增加复杂度业务上限，不自动删除旧配置。正常边界见FX-FORMULA-LIMIT，异常状态见ISS-AC-14。


## 当前范围裁定阻塞（r004独立审查后的修订）

COV-D11已解决。COV-D07一键清除已选值、COV-D08函数提示/自动补全、字段点选、语法高亮及跨表模板复用的最终范围仍需用户决定。V1.0 L356/L400/L413及L447–459保留了这些待裁事项；原Goal第9节要求必要裁定完成。可继续编制文档不等于Goal Success。已向用户询问全部纳入、仅复用既有并记范围差异、或明确允许S00条件收尾且S01调查后再裁；未答复不采用默认方案。当前S01 Entry Readiness = BLOCKED；Requirements Baseline Validity = VALID_WITH_CONDITIONS。最终有效独立复核见ReviewFindings-final.md；终态见receipt-final.json。
