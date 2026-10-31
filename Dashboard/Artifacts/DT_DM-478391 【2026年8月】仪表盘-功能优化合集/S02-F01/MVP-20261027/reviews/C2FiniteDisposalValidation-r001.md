# C2稳定刷新后有限释放：独立验证 r001

**本有限实现delta裁决：PASS_WITH_BOUNDS（有界通过），新增阻断0。原C2V-005的精确重复销毁计数及调用前清引用协议，已由独立before→after证据在冻结50案范围内证明修复。** 独立写前shadow执行4pass/46语义fail/0执行错误，原001–007全部复现；当前执行50pass/0语义/0执行。两次逐案records分别与冻结RED/GREEN严格相同，runner/harness/Cases身份未变。

**原C2整包裁决与当前delta分开：** 原`SliceC2Validation-r003`是其时点的3/3 BLOCKED，保持原字节/原结论，不倒填成通过。此处是后续正式安排的新有限实现首轮**1/3**，不是旧整包第4轮，也不重开已耗尽的新设计3/3。当前可将“原C2V-005同一有限协议反例已由新delta修复”作为新处置证据关联旧finding；不能把它扩大为原C2整包/真实SDK/GPU/所有生命周期通过。

**S039下一步判断：可以安排原S039同交付物最后3/3整合。** 就本lane绑定输入和实际验证，未发现阻止开始最后整合的新产品或本delta证据条件；此判断仅为整合可进入，不是P1通过。整合必须绑定当前after源与各原AC最新独立输入，保留下面旧9项maps基线/7项loader执行错误的未验边界，不能默认当新增产品反例或默认PASS；若最终原predicate仍缺证据，应在整合中如实裁决，不能据本报告豁免。

- reviewed_at：`2026-10-30T23:19:18.203006+00:00`；reviewer/source：`/root/bubble_ready_validator_resumed`，未编写本产品patch、新runner/harness或运行原件。本reviewer此前评过本新设计r003，不自审产品实施；本轮只读审实现与独立复跑，未代修。
- snapshot_id：`S02-C2-FINITE-DISPOSAL-VALIDATION-r001`；as_of_state：卡绑定Topology-r597、76件DeliveryManifest、新冻结handoff、before/after4hunk、正式50案RED/GREEN与当前source。
- card canonical SHA：`75bd59a0d25502cf41f6837494639b7c8571daf69a4138a422a378bbe504f816`，接收端validate/render实际exit0且完整消费execution_command。主卡107处引用、106唯一输入全部实际SHA匹配；handoff SHA=`8909c8745570694a24d1499a40def23b107a6c4148a61bf1b6cfef03ebc13219`匹配。DeliveryManifest76件逐项SHA匹配。
- 唯一持久写入本报告。未改workspace source/runner/Cases/状态、未操作UI/HTTP/DB/安装/服务/提交/推送。实际执行当前50、临时shadow写前50、source+两新runner定向无fix lint；shadow已删除，workspace源始终after SHA不变。其它回归按原日志独立读取/复算结果，不冒称全部本lane重跑。

## 原范围、授权与历史时点

Goal.final仍原38义务（P1=12/P2=26）、49内置类型/完整0/49、真实权限NOT_RUN/BLOCKED及插件unknown，不由此晋升。原Goal Draft只是来源线索，当前authority仍Final Goal与最新原始意图；原draft的全流程/回归/独立对账完成谓词没有被按钮、组件GREEN或本delta替代。

新Design-r003静态review曾明确Implementation Entry NOT_ADMITTED，其时点没有实施授权。之后本次BuildPlan、正式Builder卡/Context/admission明确安排精确单SFC及新harness切片；这是后来独立实施安排，不倒改旧设计报告。ContractFreeze at=22:54:16.048054Z绑定原设计/Cases/review；Cases-r003 SHA=`47c22e3cf68d2f26fd4902c781adf52d95a24f6cc118041f54fc7a23900811fa`，原28正常身份/计数+14throw+8G2保持。

Builder Context14条required-read九域齐；实施后独立重算，仅原SFC required revision从before变after，恰为被批准的预期源码增量；其它13项当前匹配。before预像仍等该旧revision，不能用事后当前SFC使旧Context摘要漂移来反判当时未准入。admission action=builder、target=`repo://core/core-frontend/src/views/chart/components/views/components/ChartComponentG2Plot.vue`，issued_at=22:54:16.048054Z；goal/contract/context/design_review/topology五ref当前原字节一致。原接收端工具检查成功来自冻结handoff/实施记录，本lane未把修后旧Builder卡重新失败当历史失败，也不声称重新运行了当时的pre-execution gate。

本新验证卡full_baseline直接绑定after source和最终handoff，当前接收端真实validate/render已过。原设计卡delta/full-baseline元数据残留及旧C2状态仍是历史边界，不被当前实施掩盖；本lane不生成Goal终态receipt或写Dashboard。

## 精确产品差异与回滚边界

before SFC SHA=`cbe650ca9424b73c6ec25e618289ffef5346f6f3ecd7edcdd4d374b09aaa47f5`；current/after SHA=`9d2f6852f1d419064f9d9b434ddefb72dce6919f24f14fe0f1f858fb775bd71a`。由保存before与当前文件重建unified diff，逐字节等SourceDelta-r001.patch，恰4hunk；当前SFC亦逐字节等SourceDelta-ChartComponentG2Plot.after。

1. 新局部releaseCurrentChart保存myChart到局部chart，先myChart=null，再chart?.destroy()，不catch/变更原错误。
2. releaseMapPreparation只在mapPasteInstance与当前同对象时先myChart=null，再cancelMapPreparation；不把普通刷新后不同新实例提前null掉。
3. prepare handle非active分支改调用releaseCurrentChart；alive仍先false，timer/adapter清理顺序与原异常传播不变。
4. onBeforeUnmount非active分支在原cleanup catch边界内调用releaseCurrentChart；activeG2Scope独立路径不改。

不是按HEAD重写整个SFC；已有矩阵等其它任务改动保留。map类/ready桥/g2-render-attempt/旧maps与旧G2 runner等已绑定源字节未动。其它未被卡绑定的全仓修改不归此unit，本报告不声称全工作区只有一个改动。

同步null消除“另一入口仍看到同一已销毁当前引用”的根因；外部destroy抛错时也不会因未执行后置null而保留引用。原handle仍向调用者抛同sentinel，unmount仍按原cleanup报告；active G2仍先清scope/myChart再由scope.dispose返回Error[]，未被通用helper替代。回滚仅此受审4hunk且需核当前source避免覆盖后来其它改动，无DB/依赖迁移，不授权整文件checkout覆盖用户修改。

## 可信RED与独立GREEN

正式RunnerFreeze23:02:52.931387Z在RED开始23:02:53.375Z之前；正式RED结束23:03:00.542Z，GREEN开始23:03:13.378Z、结束23:03:20.653Z。正式RED/GREEN均为同runner SHA=`1f4f0663d4a5a4028a25068fcf9bed4ad2609ccf5aa4e480f0af0b9dd2edfb44`、harness SHA=`0f4871ba291d9e624472f102366cb228f65e0485e57bfd393af13a809b930d81`、同Cases/同50个逐case摘要。

独立执行结果：

| 输入与命令 | node结果 | 独立复算 |
| --- | --- | --- |
| 当前workspace，`node tests/c2-refresh-disposal/check.mjs` | exit0，50执行/50pass/0semantic/0execution，stderr空 | 每case ID/observations/violations严格等冻结GREEN；各数值又按contract独立判断，没有只信passed字段 |
| 临时shadow，原样复制冻结runner/harness，只把shadow中目标SFC设为保存before，其余目录/依赖只读链接；同命令 | exit1，50执行/4pass/46semantic/0execution，stderr空 | 每case records严格等冻结RED，001–007的ORIGINAL_PRIMARY_SDK_COUNTS全失败 |
| 当前SFC+两新runner定向ESLint，无--fix | exit0，stdout/stderr空 | 与冻结lint结果一致，不等全项目ts:check/构建 |

shadow没有替workspace的文件或切分支；执行前后workspace源SHA均为after，shadow在finally删除。before执行源起止SHA均为before；current执行起止SHA均为after。独立raw结果的运行时间不同，但50个case records与各冻结原件逐项相同，必要观察已持久记录于本报告及绑定原RED/GREEN，可从同输入复算。

独立RED语义指纹分布：SFC_REFERENCE_NULL_BEFORE_EACH_DESTROY在46案出现；原7案计数错；SECOND_ENTRY_AND_REPEATS_NO_RETRY在24案；FINAL_CURRENT_REFERENCE_NULL在16案；14throw current entry错14案，另有map throw错误通道及G2错误通道错。这些是同一案可有多个违反，不将其相加当更多case/图表分母。无模块/编译/缺方法执行错误，满足可信RED要求，不预填或删掉失败。

### 初次harness失败与lint失败全部保留

attempt-r001/002/003各50执行、0pass、42semantic、8execution，exit2，均不是可信RED；各run source起止都还是before。第一次library double大写G2与真实enum g2不符；第二/三次仍paste_render_failed，第三次补辅助double并没有解决根因；实际response_assignments把G2 view对应response又覆盖成map，第四次修harness response.type/id才达到4/46/0。attempt-r004为诊断运行，未冒充正式冻结RED。

四份freeze、check/harness字节备份、stdout/stderr/exit齐全；原check各attempt SHA保持，harness修复逐次保留。初lint51错误（49格式+2空double方法），限定新文件格式与显式return undefined，未格式化产品周边；其失败日志及后PrePatchLint0保留。后来正式RED/GREEN不抹这些首发执行失败，也不把它们算产品缺陷。

## 真实SFC、getter、owner与错误对象核验

完整读取新check/harness及产品4hunk与上下文。harness先真实Vue compiler编译当前SFC script/template，再用Babel AST唯一定位`__expose`对象，只在内存添加只读myChart/activeG2Scope/chartComponentUnmounted/g2RenderQueue快照getter，原控制流未重写；额外import.meta.env.DEV=false是明确测试环境选择，产品expose未改。不是手抄release helper来证明自己。

每案fresh load，prepareFilterPaste实际成功、binding phase切active，等待真实g2RenderQueue及规定调度。需refresh案沿SFC普通renderChart，再读回different stable current；不是直接给myChart赋值。地图类、ready桥、L7Wrapper和g2-render-attempt为磁盘真实模块；DOM/SDK/Store/API/图表manager适配为明确double。G2 chartView适配返回g2 library与SDK形状实例，实际SFC由response.type=bar/line进入legacy/active owner，再以getter核owner；这证明SFC所有权分支，不是生产Bar/Line类全部图形功能或真实chart registry。

所有模块VM注入同一个RealmError构造器；sentinel由该构造器创建。current destroy拦截先计入口/同步读同一getter，再抛这个同对象、不delegate，scope.dispose仅外层wrapper记录真实返回并原样返回。active Error[]与warn分别用对象identity核验，非只比较错误文本；legacy直抛与unmount捕获保持不同通道。其它cleanup double固定不抛，不以额外告警污染预期。

每案从真实Store provider及API seam记录副作用，canonical view/element完整JSON前后比较；当前fixture query/所监控Store发布/target投影改变均0。它不是全Store/全部事件、所有真实网络或数据库零写审计。sample数组是SDK和wrapper采样集合，证明每个同步入口读到null，不冒称合并数组具有完整墙钟事件排序。

## 冻结50案的当前独立结论

| 组 | 数量与结果 | 精确可证明范围 |
| --- | --- | --- |
| 原28正常 | 7fixture×无/有refresh×两顺序，全部通过 | 无refresh主SDK[1]；稳定refresh旧/新[1,1]；调用前getter null、最终null、第二入口及重复不重试，正常错误通道0 |
| 地图throw | 7fixture×两顺序=14，全部通过 | 旧strict主SDK1；L7旧wrapper entry0，四Plot alias旧entry1；新current entry1/body0；same sentinel按handle/unmount通道传递，第二入口不重试 |
| G2对照 | bar legacy/line active×正常/throw×两顺序=8，全部通过 | 实际owner/fixture类型准确；legacy正常warn0、throw unmount先warn1/handle先外抛warn0；active正常Error[]空/warn0，throw两顺序Error[]同sentinel1/warn1而handle不外抛 |

L7的current object与primary SDK是不同wrapper/scene，Plot的current对象与primary alias同一；独立观测这些身份关系而不是看case label。throw current entry1但SDK body0明确保留，不能称底层资源已释放；内部layer/dot不混主要SDK分母。G2 retained scope再次dispose返回[]，实际第二组件入口若已无scope不伪造另一scope调用。

**原C2V-005处置：当前finite协议已修复，旧报告历史不翻写。** 这个判断有同一before实际7计数反例→同一after7通过及全部50配套同步/throw/非地图对照支持，不是单独GREEN或设计承诺。它只解决已准备/普通刷新稳定完成后这两入口的引用交接，不证明所有异步时点或真实SDK后果。

## 旧回归与基线：不默认失败为新bug，也不默认PASS

已独立读取原各命令完整日志/exit并按真实格式复算：JSONL、文本末尾JSON与单JSON分别处理，不因扩展名.stdout.json就把整个文本假称可单JSON解析。

| 原检查 | 冻结结果与本轮判断 |
| --- | --- |
| 旧maps317 before/after | 两stdout**字节完全相同**，317条records逐项严格相同：308 PASS、9 SEMANTIC_FAIL、0execution。只能称本delta未新增该runner回归，不能称317全绿 |
| 旧G2 component before/after | 各6个case+补充R013共7 execution error；都是UNDECLARED_MODULE_DOUBLE: map/filter-paste-ready，源码before/after与相同runner/helper身份明确。未完成相应行为断言，不是7个已确认产品失败，也不是回归通过 |
| G2 helper/reentrant | 原JSONL末尾summary分别23/23、10/10，0断言/执行；真实helper字节未改。此lane读取复核，未重跑 |
| renderer/tooltip/paste | 原结果分别31/0/0、10通过、21通过；原guard/ready/provider边界保持。此lane读取复核，未将Builder结果冒称本Validator再次执行 |
| 局部真实TS | before11/current11/added[]，exit0；仅C2写域诊断差异，不是全项目类型通过 |
| 定向lint | 原exit0，本lane独立同source/两runner lint exit0 |
| git diff --check | Builder记录本次路径exit0；本lane另独立重建精确4hunk，无源码外代修 |

九maps基线具体为bubble-map-polygon、map-point、bubble-map-point的normal/callback/scene-wait各一，均false!==true，before同样存在。当前没有把这些反例的根因归给本4hunk，也没有以“旧基线”宣称它们是假阳性或产品已经正常。旧G2 loader缺double是执行前提失败，没有产品行为oracle结果；不修改旧runner补成绿来隐藏历史。

对于完整AC-S02-07/08或最终P1，整合者须结合原predicate、对应已独立真实/组件证据以及这些旧runner的实际层次作准确disposition。**这些现存记录不妨碍开始S039最后整合，但不能在其最终结论里省略。** 若某原must-have确只剩这些失败/未执行而无有效证据，最终准入仍应partial/blocked；若有同predicate有效替代见证，应明确引用而不改旧报告。不由本delta报告预先裁定全部整体回归PASS。

## 全部发现、未查与同类残余

新增blocking=0，当前不要求Builder继续改本patch、冻结case或原runner。以下非阻断上限/残余一次列明：

1. **CFD-N01 / P2 / 已知排除的异步交错。** 仍不处理draw在unmount后resolve并重新写myChart、普通非paste全部生命周期、其它adapter清理失败/所有renderer跨type；本50都以准备或普通刷新已稳定完成为前提，不能说所有时序已清理。
2. **CFD-N02 / P2 / 原真实环境未验。** child独立卸载真实浏览器可达性、原ubo根因、真实AntV/供应商SDK/GPU成功释放未验；strict主SDK同步throw仍只有ready catch静态边界，本50无此运行variant。entry/body分层数字不等资源释放成功。
3. **CFD-N03 / P2 / 旧回归基线的证据上限。** 旧maps9语义失败、旧G2component7执行错误都保留，前后相同只证明未新增该runner差异；不能用当前50消除所有其它场景义务，也不能把旧错误自动归成新产品bug。本delta协议对照及G2 owner覆盖补其当前窄切片，完整历史回归另按原范围。
4. **CFD-N04 / P2 / harness真实与替身界限。** 真实SFC/地图/ready/ownership控制路径与实际getter已执行；SDK/DOM/Store/API/图表manager/部分辅助模块明确double，未声明模块还有空对象fallback。不能推完整模块初始化/真实registry/生产Bar-Line图库/全部事件/全Store或HTTP。当前有限释放路径必要调用都已可执行且RED/GREEN精确，未发现它们被复制helper或抹异常替代。
5. **CFD-N05 / P3 / 原准入与after绑定。** pre-builder Context的受准入SFC revision事后按预期漂移，before预像和before→afterpatch可复核；不重复验证旧卡失败倒判历史。当前独立卡/manifest绑定after；hash证明绑定不是独立业务完成。早期三harness失败、第四诊断与初lint失败均原样保留。
6. **CFD-N06 / P2 / 范围与状态。** 原C2整包3/3 BLOCKED时点不改，原38/49、真实权限、插件unknown、完整0/49和P1/Goal未提升。新有限修复的有效处置应作为追加证据，不修改旧verdict或把新独立预算当原实现第四轮。

已检查无新增问题：107/106绑定、76manifest、Goal原predicate/正式BuildPlan/admission安排、before/after4hunk及受保护source；冻结50身份和每case摘要；实际AST getter/VM Error身份/真实SFC owner/两层alias/counter、prepare与stable refresh、同步null/throw通道/重复不重试；独立shadowRED与currentGREEN每case严格等原records、七计数反例闭合；旧maps317前后逐项/字节相同、旧G2两边同loader缺失、日志真实格式及诊断delta；当前独立lint；全部失败保全/BDD/README层级与不扩大范围。

未检查及原因：未运行UI/HTTP/DB/服务/安装、没有真实SDK/GPU/移动嵌入/分享导出/全部权限/方言/49型验收；未重播所有旧回归命令，已读原完整记录与before/after差异，当前核心50+shadowRED+lint已独立执行，无需为本有限切片机械重放全部旧大包。未验async跨卸载或全Store/事件、真实全部地图交互、最终KB/Dashboard/full-diff/post-closeout/Stop Gate。原因是本有限验证范围、provider与明确未验面，不是默认PASS。

同类残余：最终null不等前置null（此次同步getter已实测）；仅entry1不等SDK body1；body1不等GPU正确；静态可达不等真实复现；旧基线无变化不等旧行为正确；新有限协议修复不等整包通过；before执行错误不等可信RED。当前没有发现其它同根因的稳定两入口失败，不能据此声称全系统清理缺陷清零。

## 对S039最后整合的具体交接

本delta当前可被安排为有限C2V-005处置证据；不需要为本报告另发review或机械凑本包后两轮。S039最后整合可在父Agent既有授权内继续，执行前只需绑定正确最新输入，不由本lane新增产品工作：

- 当前SFC已从准备r002的cbe650…变为9d2f…，整合快照/输入卡必须绑定after和本独立报告，不能继续说旧64源全数未变。
- 将原C2报告中有限C2V-005历史BLOCKED与当前新delta“同一协议反例已修复”分别链接，保原3/3历史/新首轮边界。不要回写旧verdict，也不要把旧C2其它未验面顺带关闭。
- 读取实际U1–U4最终独立材料及原12AC/shared case crosswalk；本lane未据父消息替它们重新验收，也不自行替S039出P1结论。
- 对maps9/旧G2loader7在完整predicate层有明确声明/证据归属；不能隐去、默认成产品新反例或默认通过。它们是最后整合必须知道的限制，不是当前有限delta新增阻断。

就本已核包而言，**没有额外当前条件要求在S039开始前先重跑全部地图/修旧loader/补真实SDK或再审本报告**。若发卡前发现source/案例/runner/Goal摘要漂移，应重绑实际差异；若最终整合发现原AC必需证据仍不足，则按其原完成谓词判断，不把开始整合等同验收已完成。S039剩余3/3预算不因本独立包重置，完整38与最终Goal/Stop Gate仍另按原规则。

## 输入最终绑定

当前卡为完整Read Manifest，107处/106唯一输入的SHA已实际重算；下表列关键锚点，完整逐文件路径与摘要以已复验卡和DeliveryManifest76件为可重算索引，不另复制/修改冻结清单。

| 输入 | SHA-256 |
| --- | --- |
| Goal.final.json | 4db931a6764a8c48345e7e8358e579550a9bc98594bf1654647716d72b9678c4 |
| C2RefreshDisposalCases-r003.json | 47c22e3cf68d2f26fd4902c781adf52d95a24f6cc118041f54fc7a23900811fa |
| C2RefreshDisposalDesignReview-r003.md | 00332febb3d1ef074a14b3574812bf6bbd8bf9e273614ce60235015fea4dba38 |
| ChartComponentG2Plot.vue.before | cbe650ca9424b73c6ec25e618289ffef5346f6f3ecd7edcdd4d374b09aaa47f5 |
| 当前SFC/after快照 | 9d2f6852f1d419064f9d9b434ddefb72dce6919f24f14fe0f1f858fb775bd71a |
| SourceDelta-r001.patch | ee479926384e240058c427717c88a37d062e687e5d7d3fbe5dce081ae3aadfee |
| 新check.mjs | 1f4f0663d4a5a4028a25068fcf9bed4ad2609ccf5aa4e480f0af0b9dd2edfb44 |
| 新harness.mjs | 0f4871ba291d9e624472f102366cb228f65e0485e57bfd393af13a809b930d81 |
| RED-r001.stdout.json | 6a972c8506ae69d4ca6f667b79d8238cd92af7de6565304ff4e382f534b090ea |
| GREEN-r001.stdout.json | cb06990187ca302307c55875038a81d66f7dbb6e7d2f67cd7a95d134b98e625a |
| DeliveryManifest-r001.json | 5ce98abc738611572182fcf150be2ea04cf5838927747977806d72040512e16a |
| ValidationHandoff-r001.md | 8909c8745570694a24d1499a40def23b107a6c4148a61bf1b6cfef03ebc13219 |

写前卡/manifest全部无漂移；只新增本独立报告，未改变原证据、共享状态或源码。项目无Session registry工具，不声称程序化注册表校验，本lane不运行Goal终态Gate。
