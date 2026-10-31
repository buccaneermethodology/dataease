# 普通折线双 host 设计独立复核 r002

## 裁定与范围

**当前执行路由已由新的人类范围调整覆盖：通用异步/双host/stage/资源治理迁出当前S02，另归后续Session，不再是当前MVP前置。** 本lane在调整到达前已完成下述29例检查和本轮发现；收到调整后仅保全和补记迁出，没有扩审、启动Builder或继续第三轮。以下Freeze/runner/source裁定是本交付物的保留工程审查状态，不能继续用它阻断当前基本复制粘贴MVP。

**同一交付物第2/3轮。架构、默认兼容和真实callback门控已有界可实现；完整机器合同冻结仍为`NEEDS_REVISION`（三项有限oracle修订），runner-only准备为`CONDITIONAL_ENTRY`，生产Builder为`NOT_READY`。** 本轮没有发现需要再扩大源码或业务范围的新架构阻断；不能把下面三个可直接修订的fixture矛盾留给runner私下解释。

首RED的typed生产mode和单host基线投影已可用于真实行为测试；其技术路线不再受旧C01冲突阻断。若将来恢复该迁出交付物，正式RED仍须在修订/冻结Cases、精确runner-only admission后执行；这些是保留的技术条件，不是当前下一动作。当前没有生产实现及独立可信RED，也未完成Line/Carousel前置串行重绑，不能发生产准入。

Reviewer/source仍为`/root/line_stage_construction_design`，非双host作者。本轮只新增本报告，没有修改被审Design/Cases、旧报告、生产源码或runner；不重审LSC。父Goal的10/26/16、旧r003全部残余及真实权限BLOCKED/NOT_RUN保持。

## 绑定与实际核对

Card canonical `a8311e0bfe55499ea9149b81e370a1979273c14b893b097b4baf5d6928478af6`验证pass；Context `0d883cbabdc8aecc8607fcbc1a704114b5a39114ea028ad845c451c5c93f64a5`结构验证exit0，27项required输入摘要全部匹配；Cases内25项source_manifest另重算匹配。

| 被审输入 | SHA-256 |
| --- | --- |
| [Design r002](../LineSiblingHostRenderDesign-r002.md) | `04624ab2b99d65c43c8e8f7fba7a8fe0beef2522b782e163b4fce058e944cd19` |
| [Cases r002](../LineSiblingHostRenderCases-r002.json) | `d83568a9a37bb02ac76487fb447bda274cd02053b8e975a5332496ca0384ab8a` |
| cases数组canonical（sort_keys、UTF-8、紧凑JSON） | `6a8994b0aaa3721833d501bab8e50462e4e65638f9ec7837c9542d273d7646ef` |

完整核对29例事件、fixture、全部initial/expected及phase_oracles，对照实际SFC调度、shared hover、dimension factory、tiled和pagination闭包。29例各32字段、C2独立32字段齐备；29组id/scenario与r001一致。结构检查以外，逐例语义裁定见下表。

做了一次**纯内存诊断**：以已安装esbuild转换完整当前`g2-legend-tile.ts`，实际执行applyG2TiledLegend、renderTiledLegend、installG2TiledLegendStateAdapter；common_antv.toLinearGradient、DOM/Observer/Chart事件是具名边界double，没有复制被测函数、万能Proxy或生产改写。实际观察一次布局sync=4个button写；活动click=8个写、emit=1、selected=['b']。它确认既有健康闭包的两次sync；不证明未来guard实现，不是正式RED或29例通过。

## 首轮五项处置

| 首轮finding | 当前裁定 |
| --- | --- |
| LSHR-001 默认重绘/C01互斥 | **设计层CLOSED。** 第四参typed mode在curView等写前分流，prepare真实委派；默认三参/autoRefresh false仍先销旧；001的RED legacy单host投影与GREEN全32字段/双slot分开冻结。未改旧C01语义。下文R2-001是该修订后遗漏的Case文字矛盾。 |
| LSHR-002 dimension slider旁路 | **设计层CLOSED。** guard经Line配置上下文到真实factory；valuechange/apply/RAF/setState/updater/update前后重复check，guard模式只在活动valuechange后惰性绑定document pointerup，dispose不受guard阻止。默认无guard行为保持。 |
| LSHR-003 tiled/pagination晚闭包 | **设计层CLOSED。** guard在selected、click、sync的实际写前；允许alive stage布局，用户filter须interactive；patchedGoTo在original前gate，finished/microtask/update后重查。018的活动8写经真实模块诊断支持。 |
| LSHR-004 外部P1/seam资源账 | **资源与证据分层已修；target单轴仍PARTIAL。** 014真实默认P1替换、N→O释放、draw2/current A账成立；011/012明示module port，不冒充SFC私有P1；009仍同时改id和filter，见R2-002。 |
| LSHR-005 hover/多组件计数 | **设计层CLOSED。** 026全程X.hide=1、pre0/post1/retire增量0可实现；015给C2完整32字段、各组件draw分开；host_count明确排除legacy/其它组件。 |

这里的CLOSED仅指设计修订满足原finding，不等于源码已修或运行验收。

## 本轮全部待修项

### LSHR-R2-001 / P2 / OPEN：LSH-002禁止调用renderChart，与真实prepare委派互斥

Cases第522行仍要求`prepare never calls calcData/renderChart/getData/Store methods/emitter/snapshot`。Design第80行和LSH-029又明确要求prepareLineStage直接调用真实`renderChart(...,{kind:'line-stage'})`，且这个mode不得仅为harness存在。同一个正确生产实现必须调用一次renderChart，不能同时满足该零调用断言。

**一次修正：** 把002的禁止项限定为默认renderChart的活动修改路径；明确允许且要求typed stage入口委派一次，calcData/getData/Store/snapshot/emitter仍0。计数若观测函数调用应区分mode，而不是通过跳过/排除整个renderChart spy来追绿。不修改默认旧C01或首RED。

### LSHR-R2-002 / P2 / OPEN：LSH-009的target“独立轴”仍被filter变更混淆

009 fixture同时改`props.view.id=T2`和`props.view.customFilter=FP1`，事件也同时执行两者；010另测filter。这样一个**完全漏检target id、仅检查filter**的错误readCapture仍会通过009和010，不能证明承诺的target单轴独立revalidation。Design第115/171行及fixture.changed_axis=target与实际安排不一致。

**一次修正：** 009仅改target id，保持customFilter/query/error/layout/owner等其余捕获投影不变；其expected.business_filter应保留F0，并观察真实props.id仍T2。010保持只改filter，均不回滚现场。若需要target+filter组合可作为明确补充观测，但不能替代这条单轴。无需增加产品范围或新增状态机。

### LSHR-R2-003 / P2 / OPEN：020/021/029的调度DSL仍需要runner秘密补步骤/决定调用次数

这是同一类“动作字面与可执行时序未对齐”的剩余问题，集中一次修齐：

- **020**调用默认renderChart(M)后立即进入resolve_draw_M/render/afterRender，没有推进普通300ms debounce或等待draw实际进入。真实`renderG2:760–768`仍由setTimeout后入g2RenderQueue；默认语义既已明确保持，就不能让resolve helper暗中tick。014和018已经显式给了advance步骤，020应一致。否则把deferred先resolve也不会自行执行pending timer，后续publish/await不成立。
- **021**调用默认autoRefresh后直接resolve_updateData_true，也没有推进同一300ms调度或等待updateData实际进入/默认调用settle。其sequence另残留“updateData false uses same dual-host full-render path”，应明确false走原**同活动slot、先销旧**的default full render，不能读成typed stage替换。写出advance→await_updateData_entered→resolve→await_call_settled，再尝试旧N adopt。
- **029**连续列`invoke_prepareLineStage_and_observe_delegate_to_public_renderChart_typed_stage_mode`和`prepare_ready_via_exposed_API(N)`。按当前DSL后者本身包含一次prepare调用，前者又称invoke；没有绑定“同一pending Promise/handle”，expected却只draw1/destroy[N]。若真调用两次，结果还取决于第一请求是否已进入draw及被第二次失效，不能靠runner把第一词当“只装spy”或秘密挑微任务顺序。将其写成一次prepare并保存Promise，后续只resolve该次draw/render/afterRender与观察delegate，或合并成一个含delegate spy的prepare_ready动作；若故意测两次，应完整列两次终态和资源账。

这些不要求重做整个harness；只需在尚未冻结的Case事件/fixture中给出字面唯一的调用、clock和等待点。不能把它们拖到Builder修改expected后才发现。

## 逐29例语义核对

| Case | 独立核对结果 |
| --- | --- |
| 001 | typed mode旧JS忽略第四参的真实RED入口成立；baseline记录实际legacy节点1/slots0，不先套GREEN hosts=2；GREEN数据N、curView/query O、明确adopt后O退役，账一致。 |
| 002 | ready时O+N、B隐藏、draw1/query0正确；零renderChart断言须按R2-001修。 |
| 003 | 同N/B/canvas采用、O在发布后销毁、query/curView不发布，draw1一致；单onPointClick的具名业务输入须按fixture抑制其它合法sink，不能替换真实action。 |
| 004 | empty不分配G2、B placeholder和owner仍有寿命，adopt后只销O，null scope/myChart语义一致。 |
| 005 | 返回N后render reject可回收其已登记资源，O不变、原cause引用、draw1/destroyN合理。 |
| 006 | afterRender reject在发布前，失败不改ready，N唯一销毁合理。 |
| 007 | 四种非法rows各fresh环境，验证早于defaults/empty/host分配；完整同expected和draw0正确。 |
| 008 | M立即失效N guard但等其settle/释放后复用B，N可不开始render，条件resolve事件允许该路径；最终O+M、destroyN、draw2、上限2可实现。 |
| 009 | props是真实seam且资源O未凭空替换；target与filter混改使单轴证据不足，见R2-002。 |
| 010 | 仅filter变更、query/owner保持，stale保FP1的oracle一致。 |
| 011 | 完整controller module port单改query capture，物理O不变；P1是数据而非G2，明确不升级SFC证据，合理。 |
| 012 | 同上单改error port；active_visible保持true与没有真正切SFC v-if一致，修订正确。 |
| 013 | 真实geometry/ResizeObserver提高epoch使已ready N失效；active resize不新增draw，后adopt统一ACTIVE_CAPTURE_CHANGED可实现。epoch实际起点由harness真实初次观察记录，不写私有字段。 |
| 014 | N@B先准备、默认入口释放N再销O，P1@A真实draw，destroy=[N,O]/draw2/display/query O/curView P1一致，无资源消失。 |
| 015 | C1/C2四slot唯一、两组完整expected独立计数；C1 abort只销N、C2保O2+M/draw1合理。初始O2按明确初始化fixture建立后才计subject调用。 |
| 016 | 同N重复abort、未知/跨组件handle拒绝、adopt已abort不能复活，资源一次释放合理；真实handle以controller私有身份鉴别，不用caller token字段自证。 |
| 017 | N采用/重复采用/abort已采用都不二次销N，resize捕获B，draw1合理。 |
| 018 | 原生factory/click/filter/setSelection/sync/goTo真实闭包三阶段；stage布局4写允许；活动click8写/emit1/selected[b]经健康源诊断支持。默认M在同B销N，draw2、curView M、display/query O与旧默认一致；update/nav late尾部只收内部标志，不得新应用，合同可实现。 |
| 019 | N render pending时resize失效N但O forceFit独立，resolve N只清自己，draw1/destroyN正确。 |
| 020 | N/B resize捕获和旧forceFit late不触M、最终同B/default data O正确；默认debounce缺步骤见R2-003。 |
| 021 | default autoRefresh true更新O不draw新实例、先失效ready N，draw1/destroyN正确；clock/entry/settle及false表述见R2-003。 |
| 022 | 卸载先关guards，销O及已返回N，两个shell observers断开；late Promise只收尾，host0/live0、query局部仍O，边界一致。 |
| 023 | 一次assist原错误、其余cleanup/destroy继续、重复abort不重复释放与sink无递归符合合同。未注入sink失败时不虚列第二错误。 |
| 024 | 返回disposer前私有witness保Unknown；只销已返回N及已登记项，不能凭live列表推物理zero leak，边界明确。 |
| 025 | carousel true在Line/Carousel任何构造前拒绝，不能偷偷改输入enable=false；draw0/其它chart不变合理。 |
| 026 | stage show/axis零global应用；active N真正show会hide X一次；N retirement精准release一次，保存N show不再DOM/注册；全程other1与阶段0/1/0一致。 |
| 027 | pair属性before-effect throw在owner赋值前，保O、abort/销N、draw1；无任意恶意DOM原子性承诺，合理。 |
| 028 | 发布N之后O cleanup失败，仍adopted且原retirement error一次，不能回滚已销O，账一致。 |
| 029 | 真实template/API/capture passthrough及旧默认oracle路线合理；prepare次数/Promise绑定见R2-003，旧runner运输适配另见下述非阻断提示。 |

该表是静态语义核对，除已说明tiled健康诊断外，没有实际执行29例或判定GREEN。

## 已核查通过域、非阻断提示与限制

双真实同尺寸slot/ref/id/host生命周期、stage/active guard分离、query/Store不写、prepared portal/inert处理、单固定属性写后仅私有pointer的同步critical section、retirement错误不伪装abort、同host default替换、empty owner、queue等待旧attempt释放、B采用后的resize/action捕获、unmount迟到、installer已登记与未返回句柄证据上限，均未发现本轮新增架构阻断。真实浏览器仍须验证尺寸、focus/inert、原生G2交互及重复采用/卸载，不能由本静态结论提升。

**非阻断运输提示N-R2-001：旧回归runner并非可自动适配新SFC依赖。** 当前`component-check.mjs:325–417`用固定require allowlist、单个不带真实sibling/template ref的container；新静态import/helper、真实pair验证可能使原脚本出现UNDECLARED_MODULE_DOUBLE/缺DOM capability。默认C01语义已修正，不代表旧运输器天然能加载新代码。runner-only准入应明确一种可执行的兼容运输方案：保留旧Cases/所有C01等断言和原始历史字节，给新共享模块/实际template挂载提供具名loader/DOM端口，或新增有界兼容driver执行原oracle；任何运输差异单独绑定与验证，不能改断言、用旧source跑绿冒充新source通过，也不能在产品源码加入“检测测试环境”fallback。这是准备能力与证据绑定条件，未认定为当前架构必须新增业务功能。

**元数据提示N-R2-002：** 当前card.maximum_claim_ref摘要仍写“第1/3轮”，而task id/prompt/委派均明确第2/3轮。按更明确实际请求记本报告为2/3，不重置预算；下次card修正该reader文字即可，不影响已核对的write scope/原分母/无生产准入上限。

未执行正式RED/GREEN、生产build、浏览器或权限/数据库；没有正式runner/当前生产准入是原因。内存诊断仅验证真实既有tiled健康计数，不证明拟新增guard。没有对任意第三方内部、无限重入/永不settle强制取消加新blocker；前置LSC当前runner残余由其独立流程处理，本报告不重审、不借用其通过结论。

## 迁出说明与保留的后续准入预测

本lane消费主代理传达并已核实的人类范围调整。可定位来源：thread `01a16109-aa34-78a0-8f47-f48aebb7e396` / userMessage `01a17b46-fa6c-7713-8511-a16644a2f999`。主代理确认的新路由为“通用异步/双host/stage/资源治理迁出当前S02，另建后续Session，不再是MVP前置”；主代理将保全现态并按“所有受支持图表基本复制粘贴 + 明确开发权限测试桩”方向重定Goal与Session。该来源核实由主代理提供，本lane未另起外部调查或修改Goal。

执行含义：本报告、r001/r002候选及所有已有发现保留；双host交付物维持第2/3轮已审、未冻结/未实现/未验收状态，不能标completed或丢弃。本文三项有限修订及首轮已关闭的设计问题移交后续Session，不再构成当前S02 MVP前置。若恢复同一交付物，不因迁出改名重置已用轮次；是否恢复及新准入由后续明确authority决定。当前不继续第三轮、不准备正式RED、不启动本单元源码Builder。

保留的技术预测仅供未来恢复：合并窄修R2-001..003，保留29个场景、错误通道、旧C01及源码候选范围后，预计剩余第3/3轮可给完整合同有界有效与runner-only条件入口；之后仍需实际SFC行为RED、独立RED Validation、Line/Carousel前置的对应证据及串行rebind、新source admission、同identity GREEN/回归/独立验证和真实浏览器。没有将此预测执行为当前任务。

本次范围调整不表示暂停整个Goal。当前基本复制粘贴的新分母、受支持图表清单、开发权限测试桩的声明边界和后续Session归属，由主代理按新用户authority重新定稿；本报告不代其填写、缩减或宣称完成。真实权限仍未运行，测试桩不能被本报告追认为真实权限验收。旧Goal及旧r003历史证据保持，不以迁出重写历史成功或失败结论。
