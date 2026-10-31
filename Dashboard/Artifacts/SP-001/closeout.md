# DataEase 初始知识库交付与收尾

## 交付范围与结果入口

[原始请求](planning/raw-user-intent-v1.txt)、[目录更正及执行授权](planning/raw-user-intent-v2.txt)和[修正 Goal](goal.md)共同界定本次范围。交付位于根目录 [kb/](../../../kb/README.md)，执行中间件集中在本 SP。产品全景 docs/Dashboard 仅作为参考，不作为正式知识证据。

本文件是冻结交付候选正文，不预判最终验收。唯一最终独立结论见 [最终审阅](reviews/final-review.md)，Goal 终态见 [结果绑定](evidence/final-result.json)与[终态回执](stop-gate/receipt-final.json)。早期 CONTINUE（继续）回执是历史时点，不替代终态回执。

交付包含4份知识JSON、227条源码/配置/规范事实、23项能力、307条关系、159个来源文件的切片证据，以及JSON合同、确定性生成/校验/影响工具和Markdown阅读投影。四个领域的静态关系图从显式关系生成，不将聚合节点或条件边解释为每次必经控制流。

## 原始范围对账

[义务台账](evidence/obligation-ledger.json)逐项映射AC01–AC08和原Goal必需交付；[覆盖清单](evidence/coverage-v2.json)保留K00–K11及F01–F18，追加F19–F23，不通过改名删除分母。核心6类落到10项core能力；其他13项为navigation（导航深度），不冒充实现深挖。

[来源盘点](evidence/source-inventory-v2.json)覆盖7070个可见文件，区分源码文本、资产、参考和敏感排除。文件清点不等于语义阅读；阅读记录、正式事实证据和无阅读记录分别列出。6个潜在敏感文件只记录元数据，不读正文。[文档处置](evidence/document-disposition-v1.json)明确历史测试结果、旧全景、需求草案和翻译副本不自动准入。

[范围差异审计](evidence/scope-delta-audit.json)记录用户确认的静态门槛、XPack公共边界、目录分离。K10交付影响关系与工具，K11仅保存在本SP的[缺口登记](evidence/gap-register-v2.json)。不将未核实核心内容以Gap替代已承诺提取；运行与不可见专有实现仍按授权边界排除。

## 实现变更与实际验证

Implementation Delta（实现变更）适用于新增KB生产工具与schema，不涉及产品实现变化。之前没有本任务知识生产链；现在validate拒绝错误仓库/revision、失效摘要、非法来源、重复ID和悬空引用；render先校验再生成；check-render检测投影漂移；impact在来源变更时返回保守的事实/关系/能力闭包。它们不能判断断言语义正确或自动重新认证知识。

- [正式工具13场景结果](evidence/kb-tool-tests-formal.json)：固定正反例、确定性、影响查询和不冒充运行测试声明。
- [实际包检查](evidence/formal-package-checks.json)：正式JSON结构、引用和摘要，生成两次一致、落地文件匹配、阅读链接、四份关系图。
- [来源基线复查](evidence/source-baseline-check-v2.json)：有摘要的产品与参考来源未改变；[差异检查](evidence/diff-check.json)记录git diff --check实际结果。
- [影响查询样例](evidence/impact-example.json)：定位ChartDataServer变更的保守重审范围，不声明所有受影响对象都需要改代码。
- [来源与工具绑定](evidence/provenance-manifest.json)：仓库、commit、来源、工具/schema、Skill和prompt摘要；无可靠模型版本事件记录处保留null。

源码基线为24ffb4c08a7532af26e8cd3966e5e42726a40af4，分支未切换。没有构建/启动DataEase、安装依赖、运行产品测试、访问数据库、获取XPack、提交、推送或部署。产品测试仅作为已有资产读取；普通Maven配置跳过测试的事实不写成测试通过。

## 独立复核与返工

Design由root协调；分域Builder为data_extract、chart_extract、access_extract及root架构域；各域由非作者交叉复核，架构/工具由pre_review复核；关系与最终包由未参与编写的closure_review复核。委派卡和prompt保存在planning，实际输出保存在reviews。无静默接管，无以自检替代独立审阅。

独立领域结果见[数据](reviews/data-semantic-v2.md)、[图表](reviews/chart-semantic-v2.md)、[访问权限](reviews/access-semantic-v2.md)、[架构扩展](reviews/base-semantic-v3.md)。报告列出真实样本和未覆盖项，不声称227事实均获同等深度双重阅读。

返工保留原报告和v1–v7不可变候选：补足数据证据行区间和行权限条件；移除仪表板/大屏错误关系；补嵌入握手、导出脱敏与分页边界；纠正脱敏组首项与插件缓存条件；补静态资源访问、最近操作和参数入口；将测试资产从“实现”关系中分离。关系[首轮报告](reviews/relations-review-v1.md)发现导出重载与密码签发的合并节点误导，v7拆成精确方法节点，复验见[关系复验](reviews/relations-review-v2.md)。失败历史不删除。

## 状态对账与下游顺序

[Stage Plan](stage-plan.md)、[Sessions](../../Sessions.md)与[手工对账](evidence/reconciliation.json)使用同一SP归属和声明上限。本项目没有Session registry/reconcile/validate工具，不声称程序化台账校验。

冻结顺序：交付、Dashboard、本文及对账齐备 → [候选清单](evidence/candidate-manifest.json)绑定完整tracked/untracked内容 → 唯一独立最终审阅 → 下游结果/状态绑定 → Stop Gate → 只读读回。最终报告、结果wrapper、回执与观察追加记录是预先指定的下游槽位，不能倒填PASS或改写已审正文。最终审阅有阻断时修复新快照并复审。

Closeout language verdict: PASS（中文标题和状态解释通过，实际工具结果见[语言检查](evidence/closeout-language.txt)；不是Goal验收结论）。

## 使用限制与后续

本KB可用于指定基线的开发导航、代码定位和有界影响分析；不证明运行正确、全数据库兼容、安全认证、授权版本矩阵或生产就绪。XPack未检出，仅保留公共契约和核心调用；通用鉴权定义不可见处不推测来源。分页末页、缓存刷新/并发、迁移幂等和完整UI保存重开仍需后续隔离验证。

新增开发任务先用kb/tools/kb.py impact定位来源影响，再阅读当前代码并更新JSON证据，必要时独立复核，最后render/check-render。HEAD或来源摘要变化会使validate拒绝旧绑定；重新核实后才能更新基线，不自动改摘要掩盖变化。版本声明差异、扩展授权及外部运行条件见缺口登记，可在后续对应任务中向维护者确认。本次不自动创建新Session、Goal或发布任务。
