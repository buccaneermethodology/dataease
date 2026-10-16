# DataEase S01 — 代码连接点调查与技术影响分析 Loop Goal（Final r001 · 执行边界定稿）

> Goal ID：DE-F01F08-S01-INVESTIGATION-r001。Stage Plan：SP-005；Session：DE-EXEC-S025。
> 本轮用户授权审查、定稿、登记并执行 S01；关键运行证据为必要完成条件。先调查，具体环境和操作须经用户确认后执行。产品需求仍为 reviewed/proposed，不提升 Frozen，不授权 S02–S09 开发。

## 1. 循环目标

在固定 DataEase V3 源码快照与经审查的 S00 需求基线上，逐项识别 F01–F08 的真实入口、调用/数据流、配置与持久化、权限和测试路径；通过关键现有行为的可复现运行见证校准静态判断，形成影响、风险、技术依赖、验证方案及 S02–S09 进入资料包。

成功是技术调查及必要运行见证完成，不是八项新功能实现。OBSERVED（直接证据）、INFERRED（推断）、UNKNOWN（缺证）必须分开，静态 OBSERVED 不等于运行 OBSERVED。

## 2. 权威、输入与前置条件

### 权威与当前状态

结构参照 ../SP-004/LoopGoal_Final_r001.md，当前状态读取 ../SP-004/Resume-r004/ReviewFindings-final.md 及 receipt-final.json，不复制 S00 定稿当时已过时的输入缺口。S00 最新独立结论：Requirements Baseline Validity = VALID_WITH_CONDITIONS；S01 Entry Readiness = CONDITIONAL。本次直接用户请求提供 S01 授权。

用户明确决策及追加裁定优先；S00 的 V1.0、156项完整问答/裁定、规则覆盖和验收映射承载业务语义。KYM 原始稿/对齐表、TCO、开发计划为各自范围内参考，不自动升级候选或改写需求。新出现不可消解冲突登记并请求用户裁定，不重新询问已有决定。

### 必需输入与分母

精确路径与摘要见 planning/input-manifest.json。读取 S00 r004 InputManifest、DecisionLedger、RequirementCoverageMatrix、KYMAlignmentMatrix、AcceptanceMapping/Criteria、FixtureSpec、AcceptanceIssues、ScopeDelta、DecisionSupplement、S01EntryPacket、最终审查及终态回执。保持 156 问答、171 AC、19组 fixture、14项 AcceptanceIssues 的逐项追溯；不得因目标功能未实现删除 AC。

固定主仓库 HEAD/分支、工作树/index状态及实际读取文件摘要；源码含本地差异或忽略文件时绑定工作树字节，不将其冒称 HEAD 版本。子模块独立记录 commit/status；先核对 Git toplevel，未初始化不得把主仓库 HEAD 当子模块版本。当前 de-xpack 未独立初始化，主仓库 gitlink 为 9242ff482dc33c5e4c80e7fca5c3bf72c741c478，仅为期望指针，不证明本地专有实现可读；不自动初始化。保留用户现有修改。参考模型漂移不直接改变已固定的 S00 authority。

## 3. 范围与非目标

范围：八项功能的 UI/移动/嵌入入口、状态与事件、API、后端和 Provider、序列化/保存/重开、权限/脱敏/导出、异常路径、现有测试与构建、复用与技术改动碰撞、关键现有行为运行证据、测试可行性与候选切片。

非目标：产品需求重裁定、Q157跨功能业务冲突检测、新增/修改生产功能、数据库迁移、环境搭建/安装、发布、推送/PR、未经批准的服务与真实业务数据操作。可以记录共用组件的技术改动碰撞，不扩成业务规则冲突审查。

源码/输入只读；允许在本批次写调查文档、运行证据清单和经确认的隔离验证材料，以及 Dashboard 执行索引。任何产品测试、服务启动、浏览器连接、缓存/日志/测试数据写入均先列环境及副作用并获用户确认。不得为取证修复产品功能。XPack 不公开实现；必要证据只记录公共契约、边界与本地可复核定位。

## 4. 工作包与退出条件

| 工作包 | 产物 | 退出条件 |
|---|---|---|
| S01.0 上下文与准入 | S01_ContextBootstrap.md、InputManifest.md、InputGapReport.md | S00状态/固定快照/权限/缺口可核对 |
| S01.1 架构与验证基线 | RepositoryArchitectureMap.md、BuildTestBaseline.md | 模块、构建副作用、测试入口与运行状态都有依据 |
| S01.2 F01–F04 调查 | FunctionConnectionMap_F01-F04.md | 各项固定字段完整，真实调用边和缺口可复核 |
| S01.3 F05–F08 调查 | FunctionConnectionMap_F05-F08.md | 同上，D07/D08逐项已有/缺失/Unknown及D11槽位调查 |
| S01.4 影响与依赖 | TechnicalImpactMatrix.md、DependencyGraph.md | 复用、改动面、技术碰撞及高风险处置有证据 |
| S01.5 验证设计与关键运行 | TestabilityMatrix.md/json、RuntimeEvidencePlan.md、RuntimeEvidenceLedger.json、SliceEntryRecommendations.md | 171 AC逐条映射；关键场景按确认环境执行，缺证不填通过 |
| S01.6 独立审查 | IndependentReviewFindings.md | 独立核查原范围、全成果、源码锚点及运行证据，finding可追溯处置 |
| S01.7 对账与收尾 | S01_Closeout.md、S02-S09_EntryPacket.md、Stop Gate receipt | 十项AC、原始must-have、最终diff及状态面全部绑定 |

上述为同一 Session 的有序工作包，非多个独立完成 Goal。预审不替代 S01.6 完整成果审查。

## 5. 功能调查与证据合同


| 功能 | 必查实现连接点 | 关键技术风险与验证关注 |
|---|---|---|
| F01 过滤器复制粘贴 | 过滤配置模型、复制入口、目标图表兼容校验、保存/回显、权限 | 字段映射、敏感条件泄露、旧配置兼容 |
| F02 移动端表格全屏 | 移动端路由/弹层、表格渲染、页面状态、横向滚动、返回 | 状态恢复、屏幕适配、空表及性能 |
| F03 表格明细导出 | 下载入口、导出 API/任务、数据查询、权限/脱敏、文件生成 | 导出与可见数据语义、排序、资源消耗、异步行为 |
| F04 查询选项过滤 | 查询组件配置、选项数据源、过滤规则、保存/加载、查询请求 | 过滤位置、权限穿透、查询性能 |
| F05 透视表按列格式 | 维度/指标元数据、格式配置 UI、序列化、渲染、枚举 | 指标列定位、格式应用与旧配置 |
| F06 多字段拖拽 | 字段选择状态、拖拽事件、维度/指标 drop handler、排序/持久化 | 批量顺序、非法目标、重复字段 |
| F07 枚举值上限 | 枚举请求、分页/截断、搜索/自定义输入、前后端限制 | 5000 边界（以 S00 为准）、大基数、输入校验 |
| F08 自定义行汇总 | 汇总配置、表达式解析/计算引擎、刷新触发、结果呈现 | 聚合语义、空值/除零、注入、计算一致性 |

每个功能必须提供以下固定字段：`Function ID`、`S00 Requirement/Decision/AC IDs`、`UI Entry`、`State/Data Flow`、`API/Backend`、`Persistence`、`Permission Boundary`、`Existing Tests`、`Evidence Anchors`、`Reuse Options`、`Change Surface`、`Unknowns`、`Risk`、`Recommended Slice`。不存在的链路明确写 `NOT_FOUND`（附搜索范围），未查证写 `UNKNOWN`，不可混用。


以下补充承接 S00 最新进入依赖；原草案历史状态不并入本定稿。

| 功能 | 必须加以核查的 S00 进入依赖 |
|---|---|
| F01 | 跨标签共享、用户隔离/登出失效、字段兼容、叶子计数、1800秒精确边界与容量单位 |
| F02 | 手机/平板入口、指定App版本及方向/导航/状态保活、首屏计时 |
| F03 | 全部表格类型/导出格式、图片容量、同步异步/取消重试、永久文件与历史权限、计时和保留政策 |
| F04 | 表达式/过滤树/NULL语义、稳定字段ID、级联查询与保存 |
| F05 | 真实字段选择与渲染、跨字段语义、明细/汇总、来源切换、样式、历史规则；不以候选数组代替支持证明 |
| F06 | 多选/单拖角色转换、属性、区域容量、顺序/原子性、撤销/键盘；跨图表移动不纳入 |
| F07 | 三类选择器、匹配/类型/空值、批量容量、初始化验证、失败范围、清除已选集合入口 |
| F08 | 右侧行汇总与底层聚合、表达式与方言、指标/层级重算、安全资源保护、禁止历史结果缓存及10条槽位 |

D07/D08仅复用已有、缺失不新增，Unknown不能当缺失；分别调查清除已选、函数提示/自动补全、字段点选/列表、语法高亮、跨表模板。D11每表最多10条、小计总计分别计数；不按文本去重、不自行截断历史超限配置。Q072/Q079/Q087等明确新增需求不因复用裁定而缩减。

每个 claim 至少记录 claim_id、function_id、claim、posture、repo_revision、path、symbol/行范围、文件sha256、method（static_read/call_trace/test_run/runtime_observation）、result、limitations、impact。NOT_FOUND 必须附实际检索范围与方法，不等于全产品不存在；UNKNOWN表示尚未查证；不适用项需理由与审查。

## 6. S01 自身验收条件

| ID | Given / When / Then |
|---|---|
| AC-S01-01 | 已给S00和仓库输入；核对manifest时，版本、来源、权限、工作树和缺口明确，无静默跳过 |
| AC-S01-02 | F01–F08全部在范围内；调查后8/8有完整记录，缺节点附搜索范围/gap |
| AC-S01-03 | 检查每项链路；UI、状态、API/后端、持久化、权限、测试、变更边界均有证据或经说明的不适用 |
| AC-S01-04 | 检查关键判断；全部绑定固定快照/符号或可复现实验，推断/未知明确；关键现有行为必须有已执行运行证据，静态定位不能替代 |
| AC-S01-05 | 汇总影响；每项有复用、最小变更面、兼容/安全/性能风险及严重度与处置 |
| AC-S01-06 | 对照S00映射；171 AC全部有验证层级/fixture/入口/关联claim/执行状态或明确gap-owner-处置；14技术依赖逐项处理，19 fixture规格保留；不是要求执行171条尚未实现功能的产品验收 |
| AC-S01-07 | 输出S02–S09资料；8片均有入口、依赖、风险、测试和进入条件，建议不写成批准设计 |
| AC-S01-08 | 核对实际差异/操作；无未经授权代码/发布/迁移/业务数据变化，副作用及清理可对账 |
| AC-S01-09 | 审查完整成果；不同执行主体的独立review有severity/evidence/impact/recommendation/disposition，重大缺证或错误已修复复核 |
| AC-S01-10 | 对账收尾；原分母、残余风险、两个verdict及有效Stop Gate齐备，不能以文件齐全冒充完成 |

## 7. 质量门槛与运行见证

覆盖：8/8有真实证据或明确缺口，填写率不等于充分性。追溯：S00需求/决策/AC与连接点、影响和验证策略双向可定位。证据：关键源码判断可复核、关键运行见证实际执行，推断分栏。风险：权限、脱敏、表达式、数据一致性、兼容风险有处置，未解决blocker阻止READY。治理：不越权，独立验证不由自评替代，调查完成不提升为实施批准。运行计划须先冻结场景ID、现有行为问题、独立oracle来源、输入、预期、环境/版本、具体命令/步骤、报告位置及副作用；再申请相应操作确认。

关键运行最低覆盖：每个功能至少一个可达的现有主要链路；以及按适用性独立覆盖服务端允许/拒绝和行列权限/脱敏导出、配置保存重开、移动全屏/返回状态、F05真实渲染、F06拖放与撤销、F07枚举查询/选择、F08现有汇总/表达式计算。不要求伪造未实现新功能的成功见证；确实缺入口时由源码检索和独立review确认不存在，再以关联既有链路的运行结果支撑改动建议。不能把UNKNOWN豁免为不适用。

生产数据禁止；优先隔离的合成fixture。执行成功不等于行为通过；运行观察揭示缺陷也是有效调查证据，但必须复现、定位、记录影响并阻止受影响切片READY。涉及性能指标须另固定设备/数据量/网络/Provider/计时方式；未测不宣称达到3秒/2秒或效率收益。

## 8. 独立审查与双判定

Goal预审先给 Design Freeze Validity 与 Investigation Entry Readiness；完整成果再给：

1. Technical Investigation Validity = VALID / VALID_WITH_CONDITIONS / INVALID / INSUFFICIENT_EVIDENCE。
2. S02–S09 Implementation Entry Readiness = READY / CONDITIONAL / BLOCKED，逐片列明且整体不能强于任一必要片。

运行授权尚待确认可以允许静态阶段进入，不能允许运行执行或S01完成。调查证据充分但存在未来实施依赖可为 VALID_WITH_CONDITIONS；缺关键运行证据必须 INSUFFICIENT_EVIDENCE。READY也只是技术进入建议，仍须各 Slice 设计审查和用户实施授权。

## 9. Stop Gate 与完成谓词

Success 当且仅当：必需资料可读且快照固定；8/8功能完成连接点与影响调查；171 AC、19 fixture及14依赖完整追溯；关键运行计划已批准且所有必要见证实际执行、可复现并经独立审查；十项S01 AC全部满足；阻塞性finding为零；最终Closeout/Entry Packet/Dashboard/diff对账并由有效终态receipt绑定。

缺输入、关键证据、必要运行环境/授权、独立审查，或存在需人类裁定的矛盾时保持未完成。先做不依赖阻塞的已授权工作；到达授权边界提交具体方案，不能用gap报告收口为Success。失败结果经证实可构成调查发现，不能伪报产品通过。

达到Success停止，不自动实施S02–S09。每个工作包/恢复/final前按SGE运行Stop Gate；CONTINUE继续下一动作，PAUSE_ALLOWED仅用于真实授权/阻断，只有GOAL_COMPLETE且final_allowed才宣布完成。临时工具故障先恢复；没有下一入口由执行者补齐，不把可修复文档问题交给用户。

## 10. 执行准入与变更控制

先固定manifest/context/design/topology并验证admission；源码只读和文档写入范围明确。运行阶段另有用户确认记录和与实际环境/命令匹配的admission。不得把本次整体执行授权替代用户明确要求的运行方案确认。

主代理负责调查/文档与收尾，独立reviewer负责预审及最终验证；按SGE卡片先校验再渲染，独立上下文，不把自评算独立审查。源码或输入摘要漂移须rebaseline，已冻结文件另起版本；原范围减少/替换必须记录Scope Delta和用户authority。

## 11. 目录与状态记录

全部产物位于本SP-005目录；planning保留原文、草案字节、输入、review/contract/context/topology/admission；工作包产物按第4节；CycleLedger记录当前步骤、已验证AC、阻塞、下一动作、证据和revision。Dashboard四面只登记执行状态，不以此成为产品知识权威。Stable KB若无新规则则明确不适用；不改KYM/TCO候选。

## 12. 当前状态和下一步

原草案保持原字节。当前已核对S00最终Goal、r004审查/进入包/回执；独立预审见 planning/GoalPreReview.md；编号冲突已改用DE-EXEC-S025，子模块证据边界及自包含字段已修订。Final差异处置复核见 planning/GoalFinalReview.md（独立输出槽位，不预先推定通过）。当前运行确认尚未提供，下一步是静态连接点调查和具体运行方案，不询问抽象的重复授权。
