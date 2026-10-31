# 八个负向局部场景运行证据独立审查 r001

- reviewed_at：2026-10-30T04:05:14.383301+00:00；reviewer/source：`/root/bubble_ready_validator_resumed`，非本批浏览器执行者。
- snapshot_id：`S02-RUNTIME-NEGATIVE-VALIDATION-r001`；as_of_state：root已冻结43行原始事件、八场景PARTIAL摘要、实际updateCanvas/findById载荷及一张最终稳定图；本lane仅审阅与独立复算，未操作UI/DB/源码。
- 本证据交付物 **第1/3轮**；坐标地图、底图工具与C234等既有预算均不重开。
- 接收端和写前card canonical SHA `00601c6d72740cf3f53f0636ee0c75f2351163ee190857a1c2c10fb950f3c5ce`，validate exit0/PASS；Goal+10项base refs共11项摘要均一致。

## 裁决

**证据一致性：有界成立；运行结果：继续保持PARTIAL_WITH_FINDINGS。两项像素保留检查仍未解决。新增证据矛盾阻断：0；不能将本批写成八场景全部通过或八项原AC完成。**

本lane独立重算八场景全部checks，结果与RuntimeNegative-r001逐字段相同：稳定取消、浏览器注入业务失败/网络中断、DEV未知/拒绝、busy第二次入口与DEV撤回后成功HTTP不采用、用户编辑300后成功HTTP不覆盖，以及故障后的单对成功/保存/重开均有相应局部证据。网络失败和edit300场景的indicator PNG hash确实不等，只有摘要且原图未保存，因此**文本/tree未变与像素画面保留必须分开**。

没有独立运行产品，只是对Builder真实浏览器记录做独立审阅、逐时点复算和原始载荷比较。注入不是后端真实业务/网络故障，DEV三态/撤回不是实际鉴权。49/49仍只是此前累计双侧局部观察；完整类型0/49、38义务（P1=12/P2=26）、真实鉴权BLOCKED/NOT_RUN和插件installed unknown均保持。

## 读取清单与证据冻结

完整读取当前卡/render prompt、Goal与已读原验收边界、UiIntegrationCases-r002、C234最终设计审查、43行负向事件、PARTIAL摘要、两条persistence wire原始requestBody/responseBody、最终PNG、坐标地图r003及独立review、admission和Topology-r517。复用之前已确认的diagnostic采集源码语义，明确ownKeys/undefined与逻辑query计数的边界。

| 核心文件 | SHA-256 |
|---|---|
| RuntimeNegative-events-r001.jsonl | `1112c9c7ca34711eb86fcffd853a3a783c35ab4b961cb7a97216f52609141ceb` |
| RuntimeNegative-r001.json | `8b66d7cf2d73127dbcc8897436151681fc922327a1cb6718fa992319d2bb0910` |
| RuntimeNegative-persistence-wire-r001.json | `fd7c92056824d77e08ae3df73070e73e457ba27308277af31bf3c5481e07fa94` |
| RuntimeNegative-final-stable-r001.png | `682769f276cc907e7cd0c8cc480a2b4489a49c66561fdb02aa719f6e990315d2` |

独立复算脚本 `/tmp/check-runtime-negative-validator-r001.py` SHA `72da6b3cd441f68da3ff70c31df3cc56b42bdd206b5f3bff0a9c8daa71d7e97a`；结果 `/tmp/check-runtime-negative-validator-r001-results.json` SHA `f07e629debf34431519b426eefebe8c5ae7d8dbef3ad92a0395c2b553307e29d`。只读取冻结文件、写tmp结果；没有调用API或被测helper来反推expected。

按行号而非event名唯一索引：dev_permission_before/after、held_query_intercepted在不同场景重用event名，不能用同名覆盖历史。43条at有序；66份source/clipboard的tree/ownKeys/undefinedPaths描述内部全部一致。未把undefined对象键在JSON里省略误判为字段丢失，成功/失败比较均保留完整descriptor，不只检查amount首leaf。

## 八场景逐项核验

下列#号为jsonl一基行号，结果只覆盖所列状态投影与窗口。

| 场景 | 原始事件与实际观察 | 结论上限 |
|---|---|---|
| 1 稳定取消 | #5→#6：完整source descriptor、clipboard（含revision/创建时点）、指标文本6761、saveDisabled均相等；logical0、outcome cancelled、reason paste_cancelled；本窗口responses为空 | 稳定取消局部状态保持成立；不拿首个有dirty变化的#3/4替代 |
| 2 注入业务失败 | #7→#8→#9：本浏览器拦截一条indicator500请求，返回HTTP200/业务code500、S02_SYNTHETIC_QUERY_FAILURE；logical1/failure/paste_failed，目标200、clip、6761文本和dirty保持 | 候选业务结果拒绝局部成立；不是后端真实500/业务故障运行 |
| 3 注入网络失败 | #10→#11→#12：route.abort failed，一条拦截wire、无响应；logical1/failure/paste_failed；完整source/clip、6761文本和dirty相等，PNG hash不等 | 逻辑状态保持；像素保留未决，不能全项通过 |
| 4 DEV unknown | #13→#14：copy/paste disabled，permission_unknown，wire空；source/clip/PNG相等，saveDisabled=true | 仅DEV桩入口拒绝，不是真实身份/后端权限 |
| 5 DEV deny | #15→#16：copy/paste disabled，permission_denied，wire空；source/clip/PNG相等，saveDisabled=true | 同上；诊断中旧失败query不算本次新dispatch |
| 6 busy重复入口+DEV撤回+真实迟到HTTP | #34→#35→#36→#37：第二次尝试时pasteDisabled/heldCount1/wire1，原请求后续真实status200/code0/5093返回；目标仍200/6761、clip/dirty/PNG保持，logical1/failure/paste_stale；最终permission_denied | 拒绝迟到采用局部成立；第二次点击尝试由Builder动作记录负责，不等于Validator亲自点击或真实撤权 |
| 7 用户编辑300+真实迟到HTTP | #38→#39→#40→#41：逻辑500请求等待中，用户改树300；实际200/code0/5093抵达，完整300 descriptor、clip、6761文本继续保持；logical1/failure/paste_stale；最终saveDisabled=false，PNG hash不等 | 用户300未被旧500覆盖，用户dirty保留；像素相等仍未决 |
| 8 故障后成功与实际保存重开 | #27→#28：200变完整clip500，logical1/success，实际请求树等于采用后树、响应5093；#29正常保存，#30离开工作台，#31稳定重开500/5093、clipboard空；实际updateCanvas/findById见下 | 单对恢复成功与完整树持久链成立；不推广49类型或所有失败模式 |

独立复算得到的false集合恰为：`injected_network_error.indicator_png_equal`、`user_edit_actual_late_response.indicator_png_equal`；与summary.unresolved_checks完全一致。没有把错误oracle删除当作修复产品，也没有删掉两个真实不相等结果。

## 迟到响应时序与错误oracle处置

### verified busy与edit300确实含真实成功HTTP

- busy：#35拦截500请求02:16:01.742；#36第二次入口观察01.829，pending且只有一个held/wire；responses记实际成功01.892；#37完成记录02.007，嵌入actualHttpResponse与responses.body完全相等，目标仍200/6761、权限桩为deny、outcome为failure/paste_stale。不能把success HTTP直接当成功采用。
- edit300：#39拦截02:16:25.306；#40用户300记录02:16:26.128；实际成功HTTP26.165；#41完成记录26.289，实际响应同样为500请求的5093，目标仍完整300，outcome failure/paste_stale。诊断responseData为null不表示实际HTTP未到，原始响应与actualHttpResponse另有直接证据。

这些场景在浏览器route层持住请求，释放后真实查询完成；没有服务端dispatch开始时间证明后台在撤回/编辑前已经执行。准确结论为“逻辑操作在途后失效，随后实际成功HTTP到达仍不采用”，不能额外声称已覆盖服务端长查询中撤权或真实鉴权变更。

### preliminary记录不升级为最终verified

#17–21旧busy从02:09:23.124持有至02:09:43.756撤回采样，间隔超过20秒，诊断已是paste_timeout；不是与后续<1秒verified等价的撤回拒绝原因。#22–25旧stale也保留，但原子state字段采样没有独立时戳，root已指出可能在实际响应完成前构造快照。嵌入responses具有时间且有些早于event写入时间，**不能据此倒推所有state字段均在HTTP之后采集**；本报告以明确wait-for-HTTP的#37/#41作为迟到后状态证据，不倒填旧记录或谎称旧窗口没有任何响应。

#9的driver等待过字符串`failed`而实际产品字段是`failure`，导致等待超时。原始业务code500与最终failure/paste_failed仍存在；这是driver等待前提错误，不是该业务拒绝没发生，也不证明后端耗时55秒。root记录已明确route移除。

### dirty相等oracle已经正确修正

user_edit的比较基准应是**用户刚编辑后的300状态**，不是编辑前200/clean。#38 saveDisabled=true，#40立即编辑后仍true，#41在异步toolbar收敛后false；不能要求整个期间与编辑前相等。以#40→#41核完整tree/clip/指标文本，另明确#41保存按钮已启用，即saveDisabled=false，符合用户修改应留下未保存状态的方向。

summary.initial_checker_findings保留旧`save_disabled_unchanged=false`，checker_correction只撤销该错误相等要求，仍要求after实际dirty；没有用这个修正删除PNG unequal。#28成功后的saveDisabled=true同样是早采样，不能据此证明成功未置dirty或已经正常dirty；后面的真实save响应和稳定重开承担相应证据。

## 实际updateCanvas/findById完整树核验

persistence wire为两条原始记录，含method/url/status及requestBody/responseBody，未捕获headers/cookies。

1. `POST /api/dataVisualization/updateCanvas`响应时点02:12:31.499，status200/code0。解析requestBody的canvasViewInfo，分别取得symbolic-map `7520741153101058048`与indicator `7520752064427724800`完整customFilter。
2. `POST /api/dataVisualization/findById`时点02:14:00.133，status200/code0；请求resource id、保存请求resource id和find响应data.id完全相同，为本隔离dashboard。
3. 两图保存请求customFilter与find响应对应树逐JSON语义完全相等，均500且完整子组/枚举/null/空串结构保留；source地图保存/查回树还等于#2实际copy source500树。指标的成功query wire请求树=#28采用后tree=保存请求树=find查回树=#31重开tree，比较完整树，不从截图反推。
4. updateCanvas响应data.id本身为null，且canvasViewInfo为空；没有拿该响应空投影做“资源ID/完整树相等”。code0确认保存接口返回成功，实际资源和树对照由保存请求+find请求/响应负责。
5. #30为正常工作台URL，#31稳定指标5,093、source500、clipboard=null、saveDisabled=true；与实际find返回结合支持该次正常保存/离开重开。

这里只核两图完整filter树；未据此宣称其它三图、所有非过滤配置/Store投影/实例生命周期或全部49类型的保存链均已验证。两条wire只负责#27–31首次故障后恢复；后来的#33–42恢复基线没有补录这份原始wire，不能冒充有第二组同等原始载荷。

## 全部发现、残余与影响

### RNV-F01｜P1证据缺口：两场景PNG不等且原图未保存，画面保留仍未决

- network #10→#12：`9d573c8b…f42cf9` → `00ef9128…c6a35e`，不相等。
- user_edit verified #40→#41：`bed1e75b…699e2cb` → `21ab535d…1d467a5`，不相等。

日志只保留这些PNG摘要，没有相应前后原PNG。可以确认字节不等，不能复原差异区域，也不能判定为目标值改变、选中边框/弹层/光标、异步绘制或其它原因。后来stable PNG或同文本都不能补证这些时点的像素保持。它阻挡对应“旧画面完全保留”义务验收，**不等于已经确认产品发生可见数据破坏**。summary保持PARTIAL正确；本lane不把它改成PASS或退为无影响。

### RNV-N02｜P2：初始cancel的dirty变化原因未解决

#3 saveDisabled=true→#4 false，tree/clip/6761文本相等；responses混有早于本次取消数分钟的历史请求。不能将整个响应数组当cancel新query，也不能仅凭dirty变化断定取消有副作用。#5/6在稳定前态完整投影相等、0query并取消，能证明该稳定样本；不能“修正”或删除#3/4异常观察，也不把一次稳定取消推广所有确认竞态/前置异步状态。

### RNV-N03｜P2：只证明已捕获的状态投影，未涵盖原old-state oracle全部维度

本批state主要为完整filter descriptor、clip、指标文本、toolbar dirty及部分PNG；没有逐项capture details/origin/purecanvas/page/lastRequest、无关组件配置、active实例/DOM身份、destroy次数、snapshot/emitter完整对照。UiIntegrationCases的零副作用全oracle不能因此关闭。DEV禁用期间queryObservation仍显示上一次失败logical1，是历史诊断残留；本次wire空与按钮状态才是no-new-query证据，不能把它算新dispatch或把计数重置0后伪造通过。

### RNV-N04｜P2：故障和权限语义必须保持受控范围

业务code500由browser-local fulfill注入、网络由route.abort、延期由route hold/release实现；未证明真实后端查询异常或网络故障触发链。unknown/deny/revoke只是DEV显式桩，实际HTTP在standalone仍成功并不构成真实权限通过。busy最终reason为paste_stale，不是后端permission_denied；只支持本地候选失效拒绝采用。重复入口观察为禁用按钮+一次held/wire，不扩为所有键盘/跨组件/多标签并发入口。

### RNV-N05｜P2：最终恢复只读事实与旧错误状态仍分开

#42 heldRoutes=0、scope声称所有custom route handler移除、indicator最终500/5093且saveDisabled=true；summary.final_restoration.actual_state与该事件逐字段一致。最终PNG确实可见5,093和保存成功提示，但仍显示“目标或编辑上下文已变化，请重试”的旧状态消息，queryObservation仍为上次paste_stale。它不是新paste失败，也不是状态消息已清理的证据。未独立访问浏览器核当前route registry，route清理仍是Builder记录，不能称Validator已实时确认环境无拦截。

### RNV-N06｜P2既有地图残余：ubo仍在，本批没有修复地图

#31 errors为5条累计ubo文案；#43新增stack记录只有1条，at为01:55:09.558，早于本批02:05开始的基线事件，栈经Buffer_GL2.setSubData/DeviceBuffer.subData。不能把它归因为某个负向操作，也不能按不同累计快照重复加计；更不能因本批指标负向成功而关闭坐标地图既有ubo、details及flow/heat稳定画面缺口。本轮不展开根因或修改地图。

以上为本轮全部发现。没有新增与PARTIAL摘要矛盾的记账阻断；RNV-F01及原未覆盖项仍阻挡对应完整AC验收。错误oracle/driver/时点更正已披露并正确限定，没有首个问题即早退。

## 已检查无问题维度

卡及全部引用摘要；43事件顺序与重复名分组；66份树描述完整性；八场景checks独立相等；两个PNG假项未被删除；稳定cancel无新查询；code500/route.abort受控失败；DEV两态禁用/无新wire；两组verified成功HTTP与不采用状态；用户300/dirty保留；故障后成功完整tree等于clip；真正updateCanvas/findById code0及相同resource/两图完整树；正常工作台离开和指标5093稳定重开；final heldRoutes0/状态摘要逐字段一致；独立runtime/真实鉴权/49完整验收未夸大。

## 未检查及原因

禁止UI/DB/源码写入，本lane未重跑任何点击、故障注入、route释放、query、保存或重开；所有原浏览器动作仍由Builder执行，不能称独立runtime。没有获得两个PNG原件、没有像素diff或实例/Store全维快照，无法把两项未决补齐。未独立检查当前外部配置或route registry，没有构建/安装/发布或修改任何源码/产品/台账。

未验证真实用户权限、后台撤权、跨数据集兼容、TTL边界、身份/资源切换、全部确认竞态、卸载/渲染失败/保存失败、多入口并发、49类型/全部配对或最终Goal收尾；这些都不是八个局部场景能够代替的。原cases历史22项表述不改变当前38分母，不能用该历史设计的迁后范围豁免最新Goal。

## 准入预测与下一步

可以吸收“八个局部场景已有运行与证据复算，当前PARTIAL；原始保存/find完整树有进展”的结论。无需为改summary凑全绿而机械重跑全部八场景，也不要求新产品框架。后续应仅针对两张缺失原PNG的画面疑点保全真实前后图与明确采样时点，结合原old-state oracle缺项做有界增量；未能取得时继续保持未决。

真实鉴权与原38义务仍全部按对应要求独立验收。49双向局部观察不变、0完整类型不变；本报告不提供MVP/Goal完成结论，也不关闭地图和其它历史残余。
