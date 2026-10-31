# S02 新范围 Goal 与 TSP 独立审查 r001

## 结论与当前准入

本交付物第 **1/3 轮**；独立 Reviewer 为 `/root/g2_closeout_reviewer`。审阅时点 `2026-10-27T03:29:44Z`，快照 `S02-MVP-GOAL-TSP-REVIEW-r001a`，HEAD `1e84e7438462e5d6fc371358da3bdad7d24a5c1a`。本报告只审新范围候选及其实施入口，不验收产品，不重开旧资源、事务或 query 交付物的审查预算。

- **范围与 Goal/TSP 冻结有效性：`PASS_WITH_FINDINGS`（有界通过，附两项需跟踪发现）。** 人类原文确实授权改变当前 S02 完成边界；当前22项、旧26项身份与原文、六个非当前前置的后续 Session、全部图表要求、权限桩声明边界均保全。没有发现必须重启旧通用工程或再次向人类索取相同授权的理由。下述 GTR-001 不允许插件永久排除或未知分母被当作完成，但不阻断已明确的内建图表 S036 起步。
- **实施入口就绪性：`CONDITIONAL_ENTRY`（完成控制面绑定后可直接进入当前 UI 切片）。** 当前包不是执行 admission；审阅时新 native authority-root 与 completion-predicate 尚未落地。root 可据本报告按本轮相同字节吸收七文件与清单，切换到新人类请求的 canonical 基线，再绑定新 root/predicate、当前 UI 切片的最小可执行合同/案例/独立 oracle、实际 topology 和精确 Card/Context/admission。不得把本报告或旧设计当作已经存在的源码写入许可。
- **能否切 canonical：可以。** 保留旧 Goal、旧 root/predicate、历史失败和预算的原始证据；新 active 入口指向新基线，8项批准差异必须与直接用户来源绑定。`r005` 只证明 operations 可重放，不是 protected `goal_patch resolve` 成功。新 root 的终态分母必须是当前22项，并明确区分16项 `approved_deferred` 与验收通过；GTR-001/002进入对应当前/后续跟踪。
- **能否立即 UI build：可以在上述必要绑定完成后直接做 S036，不等待 S041–046、55例资源、29例双 host 或通用取消框架。** 不能仅凭目前七文件立即越过 admission 写源码；也不要求先取得未来22项的全部运行结果，才能开始第一条真实界面路径。插件核验与每类型扩展在 S037/S038完成，不应阻塞独立的内建共用按钮、内存会话和真实双条件捕获工作。

## 绑定输入与独立复核

[新卡片](../../planning/s02-mvp-goal-tsp-review-r001a-card.json) canonical SHA `bc68de9c240b2d18a3d7c71028ca0a954813274dca91e53ccac542fe457e8670`；[Context](../../planning/ContextBootstrap-S02-MVP-GOAL-TSP-REVIEW-r001a.json) 字节 SHA `45601b7b12b1533e747804fe189f339ca1d7c045256d6ac208c1295ba99c91a0`；actual topology r423。已独立运行 lane-card validate，结果 pass；逐文件重算 Context 全14项 required-read 摘要，全部一致。旧 r001 中 TSP/NextUiTask 漂移已由 r001a 正式替换，未基于漂移卡作结论，不累计新轮。

| 受审输入 | 字节 SHA-256 |
|---|---|
| [Goal.candidate.json](../Goal.candidate.json) | `9368cbbd96fd81b44006d72ec9bcdd94b60fbb69812c3f31c65e366bf1956e53` |
| [GoalScopePatch-r005.json](../GoalScopePatch-r005.json) | `5b2078856a331a78751a38392665ecb7c6d8021c4d2c56ec820a3477f6263473` |
| [TSP.md](../TSP.md) | `d72c7ca492195faed71590f38cebe87cc1de3119d86cc3e8ebaeb2a7bafafbe6` |
| [ScopeDelta.json](../ScopeDelta.json) | `865bc760d3c2f262ba2d304497c9de9866a627d98d872f5325005f4dd9fda519` |
| [ScopeDelta.md](../ScopeDelta.md) | `920b6bca3f9a3477c5e76e4584715a423115540f700b849da230bdf7cee1f9ea` |
| [FollowupSessions.json](../FollowupSessions.json) | `7e2e523223f11dd1a7aca51e96b78c645de9d1f2f268ae0791196cbfbff99bbf` |
| [NextUiTask.md](../NextUiTask.md) | `464c623506fb5258b8bbb9e373a81131ae1c1ded93a98b5f78224e66157d2588` |
| [SupportedCharts.json](../SupportedCharts.json) | `163edf6b7f0a03f99256d02bb10f77c993847513f953a3e4fc743d0500c8dec4` |
| [SupportedCharts.md](../SupportedCharts.md) | `042e6b3b215d736fd5a7740d72b9233073d24bbc78aa3223c810df2508811cb2` |

同时读取 AGENTS、项目 SGE 与 SP010 kernel、semantic/Goal recipes、写前保全规则、[新用户来源](../../planning/MvpScopeAuthority-20261027.json)、[旧 Goal](../../Goal.final.json)及精确源码。工作树有大量既有 tracked/untracked 修改；未修改、暂存或回退它们。本轮唯一写入是本报告。

独立检查包括：

1. 从来源 rollout 的 user 消息读取原文，实际第2591行文本 SHA 为 `2e0f9cb96ed8130b3787263b345e7156fc405a7abafcd4b71569c05709598061`，与 authority 完全相同；retained id `msg_01a17b46-fa6c-7713-8511-a152a2514503` 与平台 user-message 指针分开保留。两份被同意 proposal 的原文均存在；直接五点路线的文本 SHA `fc9027cb8fc461963c82e2864aaf543a3aa7172d21a4ea1e5b61b643b151d9b4` 相符。用户第3项将初始 bar→line 示例扩大为全部支持图表，不能继续用示例缩范围。
2. 旧26条 `requirement_id/original_text/original_evidence/original_status/original_text_sha256` 与旧 Goal 逐条比对，零差异、零漏项；候选38条 ID 唯一，22条 pending、16条 approved_deferred，landed为0。
3. 独立重放全部8个 operations，每个 old-value hash 匹配，结果与候选 JSON 精确结构一致。用现有 `goal_patch.goal_digest` 复算旧 canonical `9fd9d11ba6b0d514b9bdb3527dac963221f1467d6851292fd5384b327040f672`、新 canonical `a940fd9eeafb1ebdf16f9c67f5570102db1839342e29e508685709bb1c362389`，均相符；旧/新 Goal 的 `validate_goal` 均通过。未调用 protected resolve，也未生成批准 token。
4. 按实际 ChartViewManager glob 独立展开60个文件，与 inventory scan_files集合完全相同；49个 qualifying type 身份无重复。inventory全部80个 source_refs 摘要无漂移。核对注册/继承轴、palette隐藏项、Editor/FilterTree/RowAuth、真实 getData 与插件渲染入口；这是静态佐证，不是执行49个构造函数或证明浏览器支持。

## 追加输入的证据上限

root在本轮审阅期间补充 [ExistingTwoConditionPersisted-r001.json](../evidence/ExistingTwoConditionPersisted-r001.json)，独立重算字节 SHA `2832b27bb94e5d5435800ef390993b2781f97968d65fbe554f83acfca8ea9cbc` 一致；未改变七文件或14项绑定输入。该文件给出同dataset的bar、line、table-info三图已有持久化树与两个字段ID：bar为AND amount>200及OR子组shop六枚举，line/table-info为`{logic:null,items:null}`。raw_custom_filter与解析树结构相符。这可直接复用为保存边界的真实输入来源；它含后端持久化的null字段/`valueType`，不得强行等同RowAuth前传输对象或把所有null空值归一。该补充不证明copy/paste、查询oracle或保存离开重开已经通过；本Reviewer只读该证据，没有亲自执行SQL。无需因此改变本轮Goal冻结结论或另开review轮次。

## 全部发现与处置

### GTR-001 / P2 / OPEN：插件规则须从“按标志拒绝”改为“未核验时拒绝”，并闭合最终分母

**证据：** SupportedCharts.json:4833 的有序规则 `MVP-COMPAT-02` 把 `plugin flag true` 本身作为拒绝条件；:4860 的正向规则仅接受 `known built-ins`。但 :5073 又要求在实际开发页面枚举加载后的插件、逐个追加稳定 type/能力，TSP.md:13 也承诺发现应支持 installed 类型时追加分母。后者符合用户“所有支持图表”；前者若原样实现，即使插件后续被核实可承载过滤树，也仍按身份永久拒绝。当前 installed 数量 `null/UNKNOWN`，不能据此断言实际遗漏了某个现存插件，也不能把 unknown 当0。

**影响与边界：** 不影响现在49个内建类型的共用 UI 起步；影响 S037 的兼容判定和 S039/S040 能否声称“全部支持”。不能把一个本来支持过滤的 installed 插件，通过把它归入“unknown/unsupported”就移出当前分母。仅写“若发现”也不足以让最终对账跳过实际插件清点。

**建议与 disposition：** 由 S037 在其正式兼容合同冻结前精确修改为“未核实注册/过滤能力的插件拒绝；已核实应支持者进入同一能力判定和测试分母”，同步JSON/MD与清单摘要。把实际环境加载后的 installed/type inventory核验及 `MVP-SUP-UNKNOWN-03` disposition 绑定到 S038/最终predicate；确无安装也须有观察证据。无需此刻开发未知插件、搭建新插件框架或扩大专有源码范围。**阻断插件实现准入及当前全支持完成声明；不阻断新 Goal/TSP切换或S036内建UI准入。**

### GTR-002 / P3 / OPEN：历史非 AC 未决项还缺显式后续定位

**证据：** 旧 Goal 的 evidence 保留“约30%收益目标及 ISS-AC-11 基线缺口”，scope保留新增复制审计/独立加密的 `COV-D01` 未裁身份。新 Goal.candidate.json:244只写“原30%收益/完整S10就绪转后续”，FollowupSessions.json:207–240 的 S046 Scope/Purpose泛指原全量AC、未裁政策和S10，但七文件未显式列 `ISS-AC-11` 或 `COV-D01`。旧 Goal与写前快照尚在，因此不是证据已删除，也不表示本轮必须实现这些未裁建议。

**影响与建议：** 后续owner容易只按旧26条AC和已列design reports追踪，漏掉不在26条中的未决收益基线与建议。root吸收共享Dashboard或S046接收时追加精确ID、旧Goal来源、当前身份和责任归属：ISS-AC-11仍缺基线/未证明收益；COV-D01仍未裁，不自动变must-have。**非 canonical/S036阻断项，不要求人类再次裁定已有范围，也不把30%收益加入当前22项。**

本轮没有其它确定的当前阻断发现。S036后的实际实现/运行可能产生新的具体缺口，应按当前合同和真实触发处理，不预先把未知等同已通过。

## 已检查且未发现问题的维度

| 维度 | 结论与证据上限 |
|---|---|
| 新旧authority与范围 | user明确同意测试桩/同页会话、通用异步/资源迁出、全部支持图表、五点直接路线；新scope确是完成边界调整，不能再称仅顺序变化或Scope Delta none。 |
| 原26项责任 | 10通用AC修订且旧原文保留；16产品义务原文approved_deferred保留，含Q066/067；当前映射不冒充旧全量pass。 |
| 新22项可验性 | 10修订通用AC+12产品AC覆盖原生完整多条件、同dataset/字段兼容、内存TTL、权限桩、覆盖确认、准备成功采用、局部失效、query、保存离开重开与独立验收。没有把多条件降为单叶。 |
| 基本与复杂结构 | 基本固定条件与分组/运算符/值留当前；动态/未覆盖复杂形态整包拒绝、不裁剪，旧50叶/1MB/1001枚举及复杂原AC明确迁S046。不是当前全复杂支持承诺。 |
| 内建类型分母 | 49内建/G2 38+S2 3+L7 3+L7Plot 2+custom3一致；rich-text、picture-group隐藏但保留。picture-group字段加载watch跳过被明确记录，不静态排除也不静态追认。 |
| 验证覆盖解释 | TSP当前AC12和S038要求每eligible类型真实source与target/query/save-load，权威强于inventory的family优先次序。10个非family代表仍NOT_RUN，family代表成功不能替它们通过；2401是规则组合数，不要求或冒称2401次浏览器实测。 |
| serializer与golden | 真实RowAuth leaf/group/logic链路定位准确；own undefined与JSON省略边界分开。现有AX双条件样本只证UI；补充持久化样本已给完整保存树，前传输对象/undefined和独立query数据oracle仍须取得，不从AX或被测结果反推expected。 |
| 权限与环境 | DEV显式开关、三态unknown拒绝、可见桩标签；不以standalone/admin算真实权限，不绕后端query/save鉴权，真实权限迁S041且仍未验。 |
| 失败与局部异步 | 不先改active树后query；取消/校验拒绝不query，已发后失败保dispatch记录、不提示成功、保旧状态；单目标单paste与operation/target/编辑摘要重验留当前，通用竞争迁S043。 |
| query/预览/保存入口 | getData原函数会delete传入data.data，候选明确要求预先深clone；禁止用提前改Store/drill/events的SFC.calcData作prepare。正常DbToolbar/DvToolbar/canvasUtils/saveCanvas/updateCanvas及findById链保留，不以单图测试API替代。必要局部candidate host/adapter可按实证缺口增量准入，无需旧通用全包先完成。 |
| 会话时效 | 成功copy才换内容；重复paste不消耗/续期；performance.now单调[0,1800000)有效，边界拒绝；页面reload/退出/身份变化清空；图表data refresh不清空。后者与页面reload有明确区别。 |
| Session归属与DAG | S036–040唯一SP-006/DE-EXEC-BI01，S036→037→038→039→040；S041–046候选均有唯一BelongsTo、currentCompletionPrecondition=false。共享最大S035与当前台账一致，未声称已注册或有registry程序验证。 |
| 历史lane与预算 | G2有界成果保留；LSC Design3/3、RED Validation1/3及046/runner未决；LSH2/3、QCC2/3；旧CFPI/CTPR/Authority各3/3均以durable报告移交。主迁入owner与additional owners不当作多重Session归属，没有新开第四轮。 |
| automation与声明 | 无token事实明示；native新请求路线不是伪造protected patch批准。planning、当前MVP完成、原全量/真实权限/生产ready的边界清楚；无产品KB/Coverage提升，landed仍0。 |

## 未检查项、同类残余与修复后预测

未启动浏览器、服务、构建、数据库或测试runner；本卡只授权语义审查和本报告。49个type的真实模块执行、字段目录、地图资产、插件installed、精确前传输serializer payload、真实query与save/reopen、权限三态实际行为均未独立运行。原生UI样本文件已读取，但没有把作者AX记录升格为本Reviewer亲自观察；截图不是完整树或结果oracle。没有再次运行已迁出的55/29/68用例，也未重判其历史结果。尚未产生的native root、predicate、UI contract/cases、admission无法验证有效性；这是入口待物化条件，不是要求先补未来最终验收。

同类残余已查到：插件排除措辞同时存在JSON规则02/06及MD对应两条，应一并消除永久排除解释；family代表只用于执行顺序，不能变为完成抽样替代；历史非AC未决与旧reports都应由迁入owner保留其既有证据上限，不能因新范围改名变pass。未发现第二组未列出的当前语义阻断。

修复/吸收GTR-001、给GTR-002精确后续定位后，预计不需要重做Goal架构。root现在应以本新基线创建native控制面并冻结S036当前小切片的可执行合同、oracle及写范围，发匹配admission，直接进入真实Editor UI。S036首次界面见证不等于全部22项完成；S037/038继续补全部type和插件清点，S039独立验收，S040按新predicate/Gate收束。若只完成部分类型或后端环境失败，保留partial/blocked和具体缺口，不恢复旧通用全包前置，也不删除当前应支持分母。
