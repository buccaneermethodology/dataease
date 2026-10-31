# Decisions

| ID | 决策 | 状态 | 依据 / 影响 |
|---|---|---|---|
| DE-EXEC-D001 | 项目执行 Dashboard 与 Repo 全景 Dashboard 分开维护；执行 Dashboard 以任务级 Session 为主 | done | 用户明确指出两者不是一回事；执行任务不自动改写全景材料 |
| DE-EXEC-D002 | 每个 Session 必须归属于一个 Big Idea 或一个 Stage Plan 执行批次 | done | 用户明确的归属要求；若阶段批次有共同完成边界，可建立 Stage Plan，否则归入长期 Big Idea |
| DE-EXEC-D003 | 初始任务按“产品知识基线”和“项目执行跟踪”两个 Big Idea 归属 | done | 产品材料维护 Repo 领域知识；执行台账维护任务状态。二者目的不同，不共用一个宽泛的执行管理主题 |
| DE-EXEC-D004 | 非平凡项目任务使用仓库内 `.codex/skills/sge-governed-checkpoints/` 作为 SGE 指引入口；Dashboard 保持执行状态定位，不转为产品知识权威 | done | 用户授权安装 Skill 并希望后续任务遵循；本次安装及 Dashboard 改造的最终状态见 `DE-EXEC-S006` |
| DE-EXEC-D005 | 在没有项目级 registry 工具时，手工维护 Big Ideas、Sessions、Decisions 页面，不声明 reconcile/validate 已通过 | done | Dashboard Governance 允许 minimal profile；项目当前没有注册表工具，避免把人工维护说成程序化校验 |
| DE-EXEC-D006 | 本地 SGE 增强写前字节保全、候选包冻结与单向收尾；review 保留 as-of 状态，当前 Goal 终态读取有效 receipt | done | 依据本轮用户授权及分析报告；不放宽 Gate、不推广 reviewer 豁免、不更新全局或其他仓库副本；见 DE-EXEC-S007 |
| DE-EXEC-D007 | SGE 收益评估每5个任务一轮，统计原分母、质量与采集成本；不把诊断案例当可比基线 | done | 用户明确指定报告节奏；长期观察状态不因 setup 完成而关闭；修改 Skill 需单独任务 |

| DE-EXEC-D008 | 初始KB位于根目录kb/；全部SP-001执行中间件留Artifacts/SP-001；产品全景Dashboard仅References | done | 用户明确目录更正；不得把执行状态、审查、临时推断放入正式知识；不改变既有全景文档 |

| DE-EXEC-D009 | SGE 收益观察改为逐任务报告 | active | 用户于2026-10-14明确更正；每个新增终态任务单独报告并展示累计趋势，量化阈值仍按协议执行；旧 setup 验收材料保留为历史快照，详见 `Dashboard/Artifacts/Goal-DE-GOV-003/amendment-v2.md` |

## SP-004：S00执行边界与原始问答缺口（2026-10-14）

本轮用户明确授权审查、定稿、登记并执行S00。Goal定稿不等于产品需求Frozen；READY不授予S01执行权。保留156项原题/选项/最终回答核验门槛，不用V1.0汇编代替。当前仅取得尾部原始问答，按原Goal第10节执行S00.1并等待资料；未批准Scope Delta。

记录入口：[SP-004](<Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/SP-004/README.md>)。此处记录执行决策，不新增产品业务规则。

## SP-004：156题输入恢复与S00候选（2026-10-14）

最新完整来源摘要 `e1e0034705a877f41f79f572453703343d6402434defee674fff02e654350099`；旧70项输入缺口经独立准入消解。156题同功能语义对账通过，原确认细节进入新版派生验收规格；不改原始输入，不以文档补全代替S00完成。当前公式整表数量上限COV-D11已裁定每表10条，小计/总计分别计数；r004独立复核结果见入口，其余新增建议/技术证据依赖保持原身份。完整review与Stop Gate结果见[本轮入口](<Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/SP-004/README.md>)。

## S00追加范围裁定与文档收尾

用户明确每表10条公式，小计/总计分别计数；D07/D08仅复用已有能力，缺失不新增并记录Scope Delta。156原题不改，171 AC/19组fixture规格独立审查通过；仅S00文档完成，基线有条件有效，S01进入建议为有条件、未获执行授权。最终审查与Stop Gate见SP-004入口。

## S00成果同步模型的执行边界

用户授权覆盖Skill的supported-host流程限制，改用普通CLI更新KYM/TCO。r007/r003继承W0–W4 Profile分母2/5/5/4/10；文档完成不提升产品运行Coverage，保持candidate_not_approved。当前材料与独立审查见[更新收尾](Artifacts/S00-KYM-TCO-Update/Closeout.md)。

## S01定稿与运行确认边界（2026-10-15）

用户授权S01审查定稿、登记和执行，并明确必须补齐关键运行证据，先调查再提交具体环境操作确认；环境参考Dashboard/debugging_env.md。S00历史已完成不重写，S01参照其Final结构并使用r004最新结论。独立预审及修订复核通过，只允许先静态调查。正式Session为DE-EXEC-S025，S024由并行模型同步任务占用。XPack未独立初始化，不冒用主仓库版本。[定稿](<Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/SP-005/LoopGoal_Final_r001.md>)。

## S01 外部验证延期与B2c结果

用户明确同意scope delta：RT-AUTH真实权限实例与RT-F02指定App/真设备验证延期出本轮完成条件，保留原需求分母及后续验证责任，不计通过。本机七功能局部链路与保存重开已取证，第一批合成对象已清理；第二批按后续用户指令暂停。详见 [范围差异](<Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/SP-005/ScopeDelta-r001.md>) 和 [运行报告](<Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/SP-005/B2c-Runtime-Result.md>)。

## S01 后续清理暂停与来源绑定

用户明确先完成依赖合并/独立复核，暂停第二批清理及新增F05归档，再完成协议、Dashboard、Gate；不是暂停整个Goal。残留及恢复责任见[ScopeDelta-r002](<Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/SP-005/ScopeDelta-r002.md>)。独立r002核实原始消息、关闭F-01/F-02。采用现有Stop Gate范围差异绑定，不改原root，不把程序PASS替代语义授权。

## S02 F01 分阶段推进与权限阻塞（2026-10-15）

本次用户授权review定稿并实施S02，先并行推进不干扰S01的准备。S01随后按其批准范围有条件收尾，其F02真设备和F05清理延期不自动成为F01阻塞。S02保留14条F01及Q066/Q067两项复制兼容约束、原10条Goal AC。用户授权自主增设账号；随后确认暂无可提供的真实权限模块来源，明确先标外部阻塞并继续设计及开发准备。只读查看/复制/粘贴限制与权限撤销保持未验证，不能用standalone替代，账号授权不重复请求。见[用户补充](<Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/planning/UserIntent-supplement-r002.md>)和[权限准备](<Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/PermissionEnvironment.md>)。这不免除原验收分母、不授权发布。


## S02 有界纯子合同及准入边界（2026-10-16）

独立设计增量复核r003允许冻结17个纯比较/计数case identity，仅限同类别比较、dataset ID/元数据谓词、显式时间差、UTF-8字节计数、抽象叶子计数与枚举数量无独立限制。合同明确排除权限、时钟可信度、共享生命周期、最终envelope serializer/parser、查询字段白名单/ID重绑定、UI提交与持久化；它只用于后续case实现，不是产品Builder准入、RED/GREEN或完整S02合同。产品Builder须先形成实际执行入口、可信RED并通过匹配action/target的execution admission。权限来源未提供时继续保留真实权限验收阻塞，不使用standalone替代。证据见[S02有限纯子合同](<Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/PureSubcontracts-r001.json>)和[独立复核r003](<Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/reviews/DesignDeltaReview-r003.md>)。


2026-10-16：有限纯子合同BCR-r001发现Q006三项元数据状态绑定缺口与过度成熟度表述；已通过Cases design-r003、PureSubcontracts-r002及投影文件修复。BCR-r002独立复核结论`ACCEPTED_WITH_BOUNDS`，BCR-01/02关闭；17个有限纯case可继续准备实际测试包，不代表可信RED/GREEN或产品准入。BCR-r002的BCR-03 P3 README旧链接已修复并记录于S02-F01/planning/BCR-03-disposition-r001.md。完整S02范围、真实权限未验证与产品Builder NOT_ADMITTED保持不变。当前合同：[PureSubcontracts-r002](<Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/PureSubcontracts-r002.json>)；审查：[BCR-r002](<Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/reviews/BoundedContractReview-r002.md>)。


## S02执行证据与查询设计更新（2026-10-16）

当前纯规则17向量候选的独立Validation为部分通过，不接受历史RED/Builder角色/准入时序为完整合规证据；追加对账，不改写r006/r007历史记录。查询适配器r004独立复审仅部分接受，QAR3-01载体/粘贴/保存版本同步、QAR3-02完整参数/树/日期oracle、QAR3-03确定提交点/watch门控继续开放。已授权继续不依赖真实权限环境的设计准备；产品Builder需独立指派和新鲜target-bound admission。真实多用户权限义务仍NOT_RUN，完整Goal分母不减。[状态](<Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/PreparationStatus-r003.md>)、[Validation](<Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/reviews/PureGuardValidation-r001.md>)、[查询设计审查](<Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/reviews/QueryAdapterDesignReview-r003.md>)。


### S02 查询适配器增量（2026-10-16）

QAR r004独立审查保持设计未就绪：r005候选明确保存时最新根局部覆盖、carrier同步和undo/redo行为，独立审查待定；形态补证独立审查接受参数DTO/类型及条件UTC日期oracle的源码推导范围，但发现两层树ID未穿过useFilter完整保留第二字段。已另开精确树消费设计lane。没有因此授权产品Builder或减少原Goal分母；真实权限仍NOT_RUN。详见[当前状态](<Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/PreparationStatus-r004.md>)和[形态复核](<Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/reviews/QueryAdapterShapeReview-r001.md>)。


### S02 查询设计增量 r007 / 树形态 r002（2026-10-16）

作者已补充保存时在最新文档根上局部叠加查询设计配置、并发样式/非查询编辑和undo/redo候选合同；独立审查尚未出结论。树形态r002已追到复合node ID解码及`useFilter`最终双字段过滤对象，保留旧`node-city`失效反例；独立复核待结论。两项仅源码派生设计/合成fixture，不升级成产品运行或权限证据。详见[当前状态](<Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/PreparationStatus-r005.md>)及[最新拓扑](<Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/planning/Topology-actual-r012.json>)。


### S02 查询设计窄审查r005/r002（2026-10-16）

QAR4-01/02的保存局部overlay和undo/redo合同、QAS-01/02的参数/日期源码推导及双层树最终过滤对象均获得有界独立接受。整套查询设计仍需整合复审；候选fixture不是产品运行证据，真实权限与Goal验收继续未完成。17向量切片的历史RED/角色/准入缺证也仍保留。证据见[当前状态](<Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/PreparationStatus-r006.md>)、[QAR复核](<Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/reviews/QueryAdapterDesignReview-r005.md>)和[形态复核](<Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/reviews/QueryAdapterShapeReview-r002.md>)。


### S02 QPREP-001有界实现候选（2026-10-16）

整合设计复核只对typed查询引用闭包纯准备器给出有界实现入口。独立Builder在两文件精确范围内实现候选；8项身份和定向lint经独立复跑通过，但原RED完整合并输出及RED时点快照未耐久保存，故package Validation为`PARTIAL_PASS / BLOCKED_FOR_PACKAGE_ACCEPTANCE`。保留这一证据限制，不倒填日志或把候选说成产品完成；下一步推进真实query schema接入的最小产品切片。真实多用户权限继续`BLOCKED / NOT_RUN`，原Goal分母不减。证据：[设计审查](<Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/reviews/QueryAdapterDesignConsolidationReview-r001.md>)、[Validation](<Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/reviews/QPREP-001-Validation-r001.md>)、[执行证据](<Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/planning/QPREP-001-ExecutionEvidence-r001.md>)。


### S02 QPROJ-001 实现与独立验证（2026-10-16）

独立设计审查接受普通查询引用窄投影QPROJ-001。Builder候选六个固定identity的RED/GREEN证据齐全；首次独立Validation发现测试runner两处Prettier诊断，后经格式-only rebaseline、同identity GREEN与runner lint复验通过，独立Validation r002给出PASS_WITH_BOUNDS。生产模块和QPREP未变；没有copy/UI/Store/权限调用，不能声明产品链路或Goal完成。真实多用户权限仍BLOCKED/NOT_RUN，原10项Goal AC与16项产品义务保持完整。详见[设计复核](<Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/reviews/QuerySchemaProjectionDesignReview-r001.md>)、[独立验证](<Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/reviews/QPROJ-001-Validation-r002.md>)及[当前状态](<Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/PreparationStatus-r008.md>)。


## S02 QMAP-001 纯目标映射候选（2026-10-16）

QMAP-001设计经独立复核为`VALID_WITH_BOUNDS_FOR_QMAP_001`；旧设计Context残留QPROJ实现写范围，已新建专属QMAP Context并经卡片、准入校验后才实施。可信RED在实现源缺失时由真实runner执行，六项同identity GREEN与定向ESLint经独立Validation为`PASS_WITH_BOUNDS`。该候选只在显式源/目标目录上按精确dataset/field覆盖生成componentMap，不证明目录可信、授权、产品可承载或UI/copy入口。S01终态允许S02以CONDITIONAL_DESIGN_ONLY进入，不代表S01延期权限已通过。原10项Goal AC、16项产品义务及真实权限`BLOCKED / NOT_RUN`继续保留。详见[设计复核](<Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/reviews/QueryTargetComponentMapDesignReview-r001.md>)、[执行证据](<Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/planning/QMAP-001-ExecutionEvidence-r001.md>)与[独立Validation](<Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/reviews/QMAP-001-Validation-r001.md>)。


## S02-QPIPE-001 纯查询引用流程组合（2026-10-16）

独立设计复核及独立Validation分别给出`PASS_WITH_BOUNDS`与`PASS_WITH_BOUNDS_FOR_QPIPE_001`。真实QPROJ/QMAP/QPREP模块按固定顺序组合；可信RED六项、同identity GREEN 6/6及定向ESLint通过，spy仅包装并记录真实函数调用。该结果不接产品copy/UI/Store/权限/保存入口，不追认QPREP历史package证据。完整Goal分母和真实权限`BLOCKED / NOT_RUN`不变。证据见[S02 QPIPE Validation](<Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/reviews/QPIPE-001-Validation-r001.md>)与[执行证据](<Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/planning/evidence/QPIPE-001-ExecutionEvidence-r001.md>)。

## 2026-10-20：S02 Select 异步枚举竞态局部增量验证有界通过

Select.vue 当前异步枚举切片的 PA-001..009 组件runner、纯模型9/9、定向ESLint与diff-check通过；独立 Delta Validation r004 为 `PASS_WITH_BOUNDS`，仅适用于隔离 API/Element/Store stub 下的异步状态交错，并关闭了此前 options 快照、queryId 与 loading 前置断言的测试发现。未验证真实浏览器、后端、保存历史或权限，任何 S02 Goal AC 和16项产品义务均不因此关闭。10项AC/26项must-have/16项义务及 `Scope Delta: none` 保持；只读限制、撤权/恢复仍 `BLOCKED / NOT_RUN`，S01 F01 前置仍 `CONDITIONAL`。全量 TypeScript 检查 TS6504 基线归因未解决。依据：[独立 Delta Validation r004](<Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/reviews/ProductValidation-QOBS-ASYNC-01-ClearMap-Delta-r004.md>)、[窄验证 r005](<Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/planning/evidence/S02-CURRENT-LOCAL-VALIDATION-r005.md>)。

## 2026-10-21：TCO任务推进与能力状态分层

用户同意在稳定M1下呈现可验收推进项。本次r004保留原Target分母与阈值，单独记录S00/S01前后状态、证据、owner及下一步；项目进展账本不冒充CLI保留Coverage状态，不将任务完成率等同功能完成率。事实截止S01有条件收尾，S02进行中不计入。持续使用已授权普通CLI，不声明external-run宿主管线通过。详见[本次合同](Artifacts/S00-S01-TCO-Update/TaskContract.md)。

## S02 新人类范围重定界（2026-10-27）

当前按已核实的人类范围调整执行**权限测试桩下界面MVP**：全部受支持图表、同页同编辑会话、基本多条件整树、真实查询、准备成功再采用、显式保存离开重开。当前22项必须验收；旧26条原文/原16产品义务完整保全，迁出项未验证且不作当前完成前置。六后续Session负责真实权限、跨context、通用异步、通用资源、查询组件复制和复杂过滤。旧范围/Scope Delta none/权限前置等历史状态由本节替代，历史审查、失败和预算不改判。

新权威平台用户消息01a17b46-fa6c-7713-8511-a16644a2f999已由独立Reviewer复验；[来源](<Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/MVP-20261027/../planning/MvpScopeAuthority-20261027.json>)，[独立审查](<Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/MVP-20261027/reviews/GoalTspReview-r001.md>)。相同字节Goal吸收，r005仅重放，不声称protected resolve成功、不造token。S036–040与S041–046已手工登记；旧root/predicate为历史，不用于新完成判定。GTR-001/002按Session跟踪，无真实权限/全量功能通过或Coverage提升。
