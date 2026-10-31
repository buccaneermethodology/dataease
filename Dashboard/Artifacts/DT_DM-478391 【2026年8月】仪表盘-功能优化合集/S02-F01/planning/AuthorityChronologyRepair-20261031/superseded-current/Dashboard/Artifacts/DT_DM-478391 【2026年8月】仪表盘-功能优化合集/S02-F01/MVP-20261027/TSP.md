# S02 权限测试桩下界面 MVP 的 TSP

**Topic**：全部受支持图表的基本过滤配置copy/paste。

**Scope**：一个完整DE-S02-F01 Goal，实施顺序为P1界面MVP→P2复杂场景验收。原10项Goal AC、26项must-have、16项产品义务均属于当前最终验收分母。P1为开发环境、同页同编辑会话、基本多条件整树、全部eligible图表、显式权限三态桩、真实UI/query/正常保存离开重开；P2补齐真实权限/只读与撤权、跨context、完整类别/身份/TTL/OS剪贴板/复杂过滤、query组件复制和其它原始产品义务。P1完成是非终态里程碑。

**Purpose**：先交付可体验、可独立验证的界面MVP，再完成完整范围；通过分阶段安排缩短首个可见结果，不缩减任何验收要求。

## 分母与输入

[当前全验收授权](../planning/MvpFirstFullAcceptanceAuthority-20261027.md)是最新决定；[既有MVP authority](../planning/MvpScopeAuthority-20261027.json)与[ScopeDelta](ScopeDelta.md)保留为历史范围迁移证据。当前Goal ledger为38项：P1 12项新增MVP AC，P2 26项原始验收（10项Goal AC+16项产品义务）；P2均为pending并属于S02完成前置。此前曾记录的approved_deferred仅表示历史迁移处置，已被最新用户授权覆盖，不得再当作最终验收豁免。

并行源码清单 [SupportedCharts.json](SupportedCharts.json) / [MD](SupportedCharts.md) 已落：静态注册49类型（G2 38、S2 3、L7 3、L7Plot 2、custom 3），palette47可见+2隐藏，49均声明filter轴；2401是静态source-target组合数，runtime_verified_types=0。当前基本能力以这49个内置注册类型作为可追溯分母，隐藏不能静默删除；picture/richtext/plugin按清单具体边界核验，插件installed数量仍unknown，不能当0或已支持。没有实际存在/支持证据的插件不伪装成已测类型；若发现应支持的installed类型，显式追加分母并补验。全支持要求不是只bar-line。清单SHA：`163edf6b7f0a03f99256d02bb10f77c993847513f953a3e4fc743d0500c8dec4`。

## P1/P2实施Session

共享Dashboard最大S035，以下S036–040为候选ID，唯一归属SP-006（父DE-EXEC-BI01），本lane未写共享索引。

| ID | Topic | Scope | Purpose | Status/当前前置 | Next |
|---|---|---|---|---|---|
| DE-EXEC-S036 | 真实Editor入口和复制 | FilterTree/Editor按钮、原生serializer、DEV三态桩/i18n/内存clipboard生命周期、真实query接点 | 立刻有可点击产品界面 | todo；true | 精确admission后执行NextUiTask，不能只交helper |
| DE-EXEC-S037 | 全支持图表兼容与准备采用 | inventory逐类型、同dataset字段校验、覆盖确认、基本query/预览准备、局部有效性 | 覆盖所有eligible类型基本路径 | todo；true，依赖S036 | 仅做当前路径所需最小接线，不重启旧通用工程 |
| DE-EXEC-S038 | 真实端到端与保存重开 | 每eligible类型source/target、完整两条件oracle、权限桩/拒绝/取消/失败/局部失效/TTL清空、真实save-load | 形成12项P1运行证据 | todo；true，依赖S036/037 | 隔离开发环境真实UI/API，不当真实权限 |
| DE-EXEC-S039 | 独立MVP验收 | 非Builder检查12项/类型分母/全diff/运行/未知 | 给明确有界独立结论 | todo；true，依赖S038 | 一次列全发现、有限delta，不改迁出旧AC状态 |
| DE-EXEC-S040 | 新基线最终对账 | ScopeDelta/六followups、新root/predicate/Gate、Dashboard四面/最终review | 正确收束受限MVP与未验移交 | todo；true，依赖S039 | 只称权限桩下MVP，禁原全量/生产ready |

DAG：`S036→S037→S038→S039→S040`。第一条实际多条件路径可先贯通作为实施见证，S037/038必须覆盖全部eligible；不能用首条路径缩分母。旧通用query/双host/资源均不在本DAG前置。

## P1验收矩阵

| ID | 当前必需结果 |
|---|---|
| AC-MVP-F01-01 | 全部受支持图表基本能力：SupportedCharts每个eligible类型均能作为source复制和target粘贴相同dataset有效基本多条件树；不能仅bar→line或单叶，未知/应支持未实现类型不移除分母。 |
| AC-MVP-F01-02 | 复用真实FilterTree/RowAuth/customFilter输出，至少两个有效条件及分组/运算符/值完整独立复制；不带样式/布局/结果；unsupported复杂结构整次明确拒绝，不悄悄丢字段。 |
| AC-MVP-F01-03 | 同页面同编辑会话内存clipboard深拷贝，不写OS剪贴板；空源禁用、copy失败保留上次有效树、成功copy才替换；paste可重复不消耗不续期。 |
| AC-MVP-F01-04 | 每次paste确认实际dataset ID一致且可验证、字段ID/类型/运算符完整承载；跨dataset、ID未知、缺字段、图表↔query/不支持类别、不完整树拒绝，不部分应用。 |
| AC-MVP-F01-05 | 权限port按source-read/dataset-read/target-manage返回allow/deny/unknown；仅DEV显式开关测试桩且标识可见，unknown/deny拒绝；生产默认不启桩、不绕后端query/save鉴权。 |
| AC-MVP-F01-06 | 非空目标先确认、取消tree/data/画面不变，空目标直接准备；候选校验/query和必要基本预览准备成功且目标复验有效后才采用；失败丢弃候选，不先写active树再query。 |
| AC-MVP-F01-07 | 同目标最多一个paste在途、重复入口禁用；捕获operationId/targetId及目标编辑版本或完整摘要，回包再核；切目标/重新编辑/卸载失效，仅证明本局部paste边界。 |
| AC-MVP-F01-08 | 真实query结果与独立oracle一致，准备成功采用后提示过滤条件已应用；取消/校验拒绝不发候选query，已发后失败如实留dispatch记录、保旧画面、不提示成功。 |
| AC-MVP-F01-09 | 只走既有显式正常保存，无自动保存；保存后离开编辑器再重开完整基本树/分组/运算符/值与实际结果一致；未保存和保存失败不伪称持久化成功。 |
| AC-MVP-F01-10 | copy成功按单调elapsed计30分钟，[0,1800000ms)有效，>=1800000ms拒绝；页面reload、退出编辑、登出/身份变化清空；图表data refresh不清空且不延寿，不跨context持久化。 |
| AC-MVP-F01-11 | 真实UI可见专用copy/paste入口、进行中/禁用/不匹配/失败/成功和开发权限桩标记，使用既有Element/i18n；正常过滤编辑/清空删除/保存回归有效。 |
| AC-MVP-F01-12 | 隔离开发环境真实UI/前后端query/正常save-load覆盖每eligible类型source与target、多条件整树、dev桩三态、拒绝/取消/准备失败/局部失效/TTL清空与回归；非Builder独立验收当前12项，真实权限仍未验。 |

P1为12项新增MVP产品义务。原始10项Goal AC与16项产品义务共26项完整逐字保留并列为P2 pending；AC-S02-10作为最终终态义务，仅在完整S02关闭时landed：AC-F01-Q004..Q015、AC-F01-ORIG-01、AC-F01-ORIG-02、AC-F04-Q066、AC-F04-Q067。其原文和oracle以[CoverageMatrix](../CoverageMatrix.json)、[F01验收标准](../../SP-004/Resume-r004/AcceptanceCriteria.md)为准，不能因原先迁往后续Session而降低验收。每eligible类型至少一次source和target真实操作；未逐对实测不可声称N×N逐对浏览器通过。完整两条件分组/运算符/值和命中记录ID用独立数据oracle，不从被测输出生成expected。

## 后续Session与旧lane

[FollowupSessions](FollowupSessions.json)固定S041真实权限、S042跨context、S043通用异步/query、S044资源、S045query组件、S046复杂filter；唯一归属DE-EXEC-BI01/SP-006后续独立批次，currentCompletionPrecondition=true。ScopeDelta保留旧running reports/预算/交付，既有G2工程成果不回退，55RED/29双host/query未决不因迁出变pass或重置预算。

## 最小准备与失败界限

候选树/query request深拷贝，校验/覆盖取消不query不改旧state。query和必要基本预览准备成功且operation/target输入摘要复验后才采用；已发query后来失败保持dispatch记录、丢候选、旧tree/data/画面不变。各类型如确有渲染接点缺口，给具体type/触发/最小改动/证据和失败降级为“不采用并提示”，继续独立UI工作，不把该类型从应支持分母删除或称完成，也不恢复通用framework前置。

## 完成与立即动作

P1全部12项完成后仅记录“开发权限测试桩下界面MVP完成”里程碑并进入P2。只有P2全部26项原始义务也完成、真实多用户权限/只读拒绝/撤权恢复等完成独立验收、38项全分母与历史差异/Scope Delta/后续Session对账、完整diff/独立终审/新root-predicate-Gate通过后，才可称S02 Goal完成。自然语言授权有效，不要求用户再给token；工具兼容gap在r005明示，不冒称protected resolve通过。

独立复核当前Goal与阶段映射后，按最新Goal digest更新root/predicate，并为下一精确Builder目标重新验证admission；旧Goal digest绑定的admission不得复用。先完成P1真实UI MVP路径，再按P2原始义务继续，不以旧通用框架作为P1前置。

当前真实双条件UI样本：[ExistingTwoConditionSample-r001](evidence/ExistingTwoConditionSample-r001.json)。可见AND amount>200及OR子组shop六枚举；它仅UI观察，serializer JSON尚未取得，不能从AX猜JSON或把截图当query/save通过。S036复用此真实样本取得原生输出后冻结oracle。
