# C2稳定刷新后有限释放：Builder独立验证交接 r001

交付时点：2026-10-30T23:09:31.504252+00:00。这是Builder候选与自检，不是独立验收报告。原C2整包3/3 BLOCKED、新设计3/3已耗尽及原ubo历史保持；本次由新正式Builder卡/BuildPlan/admission明确安排有限实现，不是整包第四轮，也不以此前静态设计review替代实施授权。

## 阅读入口与冻结

- BuildEvidence-r001.json SHA `db76ea34a477de9d0a6e7fdd35376f5b60bd9e78938342f63d50b827ecb41ff3`：完整源增量、RED/GREEN、初次失败、回归结果及声明上限。
- DeliveryManifest-r001.json SHA `5ce98abc738611572182fcf150be2ea04cf5838927747977806d72040512e16a`：本次文件清单及摘要；BuildEvidence与Handoff不互相绑定以免循环，下游验证卡再绑定最终两件。
- Builder卡canonical SHA `9030977936a86f398441007daa0d4efd3ea95ce137c06e7370bdcffc0b7c3682`；接收端validate/render、Context/admission分别exit0后才写harness。实现后source是原准入的预期before→after漂移，不拿修后旧receipt重验失败倒判原未准入；新验证应绑定after。
- 当前Design/Cases-r003与设计review、原报告/Goal、旧maps/G2 runner均未修改。50个唯一case/冻结期望不变，Cases SHA `47c22e3cf68d2f26fd4902c781adf52d95a24f6cc118041f54fc7a23900811fa`。

## 精确源码增量

只改 `core/core-frontend/src/views/chart/components/views/components/ChartComponentG2Plot.vue`，原文件已有其它任务修改，本次从保全preimage上最小叠加，不按HEAD覆盖。before SHA `cbe650ca9424b73c6ec25e618289ffef5346f6f3ecd7edcdd4d374b09aaa47f5`；current/after SHA `9d2f6852f1d419064f9d9b434ddefb72dce6919f24f14fe0f1f858fb775bd71a`。SourceDelta-r001.patch与SourceDelta-ChartComponentG2Plot.after均已保存。

1. 新增组件局部releaseCurrentChart：保存myChart到局部，同步myChart=null，再对局部调用destroy；不捕获改变原错误。
2. prepare handle非active分支与onBeforeUnmount原cleanup边界调用该helper。
3. releaseMapPreparation仅同实例时先myChart=null再cancel准备桥。

activeG2Scope原dispose分支、普通renderG2其它destroy、map类/ready桥/G2 ownership helper、query/Store/权限/保存均未改。没有覆盖异步draw跨unmount之后才写myChart的残余；没有做全renderer生命周期重构。

## 可信RED与全部harness失败历史

源码仍完整等before时，先建立新harness；四个诊断attempt均有各自freeze、两runner文件字节备份、stdout/stderr/exit。前三次不算RED：

| 记录 | 结果 | 诊断与处置 |
| --- | --- | --- |
| attempt-r001 | 50执行/42语义失败/8执行错误 | G2 double library误用大写G2，实际enum为g2；源码未动 |
| attempt-r002 | 50执行/42语义失败/8执行错误 | 修枚举后仍paste_render_failed；未当RED |
| attempt-r003 | 50执行/42语义失败/8执行错误 | 补具名nonthrow辅助doubles仍未解决；继续诊断，不把该补充声称已修根因 |
| 实际读回 | view.type=bar，response.type=map | 继承map fixture的response_assignments覆盖view；只修harness response.type/id |
| attempt-r004 | 50执行/4pass/46语义失败/0执行错误 | 真bar/line owner与map全部到达；尚未改生产源 |

初次新文件lint为51错误（49格式+2空double方法），输出保留；只格式化新文件、让空double显式return undefined，未格式化生产周边。之后PrePatchLint0。

最终RunnerFreeze-r001后正式RED/GREEN使用完全相同runner/harness：check.mjs SHA `1f4f0663d4a5a4028a25068fcf9bed4ad2609ccf5aa4e480f0af0b9dd2edfb44`，harness.mjs SHA `0f4871ba291d9e624472f102366cb228f65e0485e57bfd393af13a809b930d81`。正式RED为50执行、4通过、46语义失败、0执行错误，exit1；原C2-RD-001至007七个计数反例全部实际失败，同时有同步引用未null与throw后其它入口重试等指纹，不预填总失败数。仅之后才改一个SFC；同50 case_id与每case摘要GREEN为50通过、0语义/0执行错误、exit0。文件RED-r001/GREEN-r001保留完整观察与退出码。

harness复用旧maps环境初稿但位于新目录，真实Vue compiler编译磁盘SFC script/template；Babel AST唯一定位expose对象，仅插入只读getter，产品expose未变。真实map/ready/L7Wrapper/g2-render-attempt模块路径调度，SDK/DOM/Store/API/provider有界double。地图严格区分旧strict主SDK、wrapper入口、普通current及其SDK body；同realm sentinel在新current入口计数/同步getter采样后抛、不delegate。G2 bar/line先读回实际myChart与scope owner，只有scope.dispose返回值外层wrapper观察，不替代真实control flow。所有其它cleanup double不抛。

query/Store发布/canonical view及element变化均按本50固定fixture观察0，不能扩大为全产品副作用结论；内部layer/dot不混主SDK分母。destroy入口1/body0不等于SDK/GPU成功释放，strict主SDK throw只有原桥catch静态边界，本50案未执行该throw variant。

## 原回归结果与基线限制

所有命令在core/core-frontend执行，未安装依赖/启动服务/浏览器/DB/提交。

| 检查 | 实际结果 |
| --- | --- |
| 新50案 | 同冻结RED4/46/0 → GREEN50/0/0 |
| 旧maps317 | 写前保全SFC与当前各308pass/9语义fail/0执行；records数组逐项严格相等，未新增回归；不能写317全绿 |
| 旧G2 component | 写前保全SFC临时shadow与当前同为6案+R013共7执行错误，UNDECLARED_MODULE_DOUBLE: map/filter-paste-ready；旧runner未改，不能写通过 |
| G2 helper | 23/23，0断言/执行错误 |
| G2重入cleanup | 10/10，0断言/执行错误 |
| renderer | 31通过、0语义/执行错误 |
| tooltip | 10通过、0失败/执行错误 |
| paste/wrapper | 21通过 |
| 局部真实TS语义差异 | before11/current11/added[]，exit0；不是全项目ts:check通过 |
| 定向source+两个新runner lint | exit0，stdout/stderr空 |
| git diff --check（本次路径） | exit0 |

maps九个基线失败为bubble-map-polygon、map-point、bubble-map-point的normal/callback/scene-wait，各false≠true，原同一runner前后完全相同。旧G2 component baseline临时目录用同runner、SFC.before、真实helper和依赖软链，未替workspace源，已删除临时目录。原失败不通过补旧runner或改期望掩盖。G2 helper/reentrant stdout是JSONL，renderer/paste是文本及末尾JSON；日志扩展名不是整个文件单JSON可解析声明。

## BDD、交付边界与独立验证建议

新 `tests/c2-refresh-disposal/README.md` 与 `tests/bdd/readable_cards/s02-c2-refresh-disposal.md` 已写明真实层次、50冻结case、错误通道与未验。完整38义务/49分母、完整0/49、真实权限NOT_RUN/BLOCKED、旧ubo、P1/Goal未提升；Builder没有写Goal、原独立报告或共享状态。

请独立验证一次查全：当前源码相对保全before的精确diff，真实SFC getter与旧strict/current身份分层是否符合全部50冻结case，G2实际bar/line owner及同realm sentinel错误通道、正式RED可信度与GREEN同身份、初次harness失败、回归前后基线差异、全部声明与文件摘要。不要将当前50GREEN自动写成原C2整包、真实SDK/GPU、浏览器可达性或P1通过；也不要将旧maps九项与旧G2 loader基线失败改写成已通过。

若复跑写前RED，使用临时shadow或只读source覆盖机制，不替正在共享运行的workspace源码；冻结Cases不许修改。接收端为此新有限实现单独验证，原设计3/3和旧实现3/3历史保持。本文不预判独立verdict。
