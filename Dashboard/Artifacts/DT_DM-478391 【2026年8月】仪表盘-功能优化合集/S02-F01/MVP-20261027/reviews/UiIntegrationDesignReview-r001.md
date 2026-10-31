# 新 UI 设计独立审查 r001：A 切片准入与当前全部发现

## 本报告的时点和冻结边界

本交付物独立审查第 **1/3 轮**，Reviewer `/root/g2_closeout_reviewer`；审阅时点 `2026-10-27T03:53:07Z`。按root明确分段指令，本报告先固定已经查完的 A 独立准入和截至此时全部发现，**随后字节冻结**；C剩余核查将由控制面发同轮补充报告卡承接，不改写本报告，不计为第二轮。本报告不是整个A/B/C/D设计已审完或产品验收通过。

## 分切片裁定

| 切片 | 设计/入口裁定 | 精确边界 |
|---|---|---|
| A：真实Editor按钮、copy、权限桩、session、基础兼容拒绝 | **PASS_WITH_BOUNDS；可立即独立Builder** | 当前真实通用Editor接点、完整DB双条件只读复制、内存深克隆、三态桩/identity、TTL及清理、失败保旧clip、同dataset字段/结构拒绝和prod关闭；paste准备端未就绪时显式禁用/不可用，不发候选query、不写target、不提示粘贴成功。A不依赖B/C或全部49类型运行。 |
| B：真实query prepare/outcome和单操作失效 | **PASS_WITH_BOUNDS，允许独立准备实现** | 只做真实getData严格outcome、clone request/完整context和局部operation/target重验；未准备预览不得发布target树/数据/画面。各renderer适配必须读实际参数分支，不声称已完成候选render。按B自身Card/Context/admission执行，A不需等它。 |
| C：逐renderer候选准备、同节点提升与发布 | **本报告尚未给整包冻结/实现准入** | 已定位下述C相关缺口，剩余具体ready/激活语义仍在本第1轮检查；root另发同轮补充输出卡。不能将此栏解释为C通过，更不能把它反向当A阻断。 |
| D：真实刷新、保存离开重开与完整验收 | **可准备oracle/观测；端到端执行依赖对应B/C成功路径** | 独立SQL oracle和持久树已有输入，仍无copy/paste/query/save-reopen产品通过证据。每eligible type当前义务保留，family代表不替其余type验收。 |

**A入口的必要控制动作：** root冻结并消费本报告、当前Design/Cases/DB fixture/首RED、已落的新canonical/native root、实际源码基线和topology，发只含A路径/action的精确execution admission后即可开始。无需再次询问人类授权，无需等待B/C补充报告。A建议写域为新`mvp-chart-filter-copy.ts`、Editor index、三语言locale、必要轻量identity/cache失效通知及精确DEV类型声明；不含views wrapper、api getData或任何renderer实现。受审Cases/DB fixture/原旧工程均只读。仅新增按钮与copy不改target，因此不存在以未接准备端悄悄应用条件的许可。

## 输入复验与首 RED 的独立判断

[Card](../../planning/s02-mvp-ui-design-review-r001-card.json) canonical SHA `245ef346f303ede3e206035d3ec0b075e9cb0bc3af4981f6a7ad00f858ebf846`；[Context](../../planning/ContextBootstrap-S02-MVP-UI-DESIGN-REVIEW-r001.json)字节 SHA `972432b7a7ca04adb74f06c4c02bc45ce3b17dda3b8f4d6f69a9db3e4252dd21`。接收端lane-card validate通过，全部29项required-read真实字节摘要匹配。新Goal.final字节`9368cbbd96fd81b44006d72ec9bcdd94b60fbb69812c3f31c65e366bf1956e53`与此前审阅候选相同；CanonicalAdoption/native root/predicate已读，当前22与历史16 approved_deferred边界没有变化。

受审[Design](../UiIntegrationDesign-r001.md) SHA `36a3250e2e3ea3024d89302f36eaa5320c060127e801b59f397cea29dea1cd7e`；[Cases](../UiIntegrationCases-r001.json) SHA `cdc9eb077f3651c2fa0f810de08f7ec85a1ba7a2ec3a5f66661cd90859f8750e`。15个case ID唯一，所有status仍NOT_RUN；Design中的“尚未执行”是其写作时点，随后追加真实首RED不能倒改历史正文来伪造同时性。

追加读取[UiContractFreeze](../UiContractFreeze-r001.json)，字节SHA `3a4571163d016987bb1eaf0cd4354f73c96f23d4bcb5c8828ed3f01af83a38d4`，其8项绑定均重算一致。包含：

- [首RED JSON](../evidence/MVP-UI-01-red-r001.json) SHA `e96bcd834a503ebf8826e6cf50bd71fe24f555fff18b143871dffed936598404`；记录MVP-UI-01，expected2/actual0，AssertionError，execution_error=null。
- [真实Editor AX](../evidence/MVP-UI-01-red-r001.ax.txt) SHA `1dcd9040b93fcd302adc140c32aa6a3fcfb436e4e6396e813e88d927d02035b5`；已读取整个AX，可见被选中基础柱图、真实数据侧栏、过滤文本与既有更新按钮，没有两个专用可访问按钮。
- [截图](../evidence/MVP-UI-01-red-r001.png) SHA `277b6c6515c61eebdc18e69fe0d1e7a727ed93c55dd83fd0794ec75c804c5a0b`；本Reviewer已查看，与AX同样显示真实Editor及无copy/paste入口。

**结论：该首RED足够A按钮实现入口，属于真实UI缺功能的可信有界见证；没有以缺module/编译错充当RED。** 本Reviewer未亲自重跑浏览器或Node assertion；实际断言执行由root材料记录，AX/截图与当前源码静态均支持其缺入口结果。data-testid数量未被执行，不能写成MVP-UI-01所有子断言已跑；GREEN时在同一case下补两个testid数量和中文可访问按钮检查即可，不需为RED先补一个不存在按钮的DOM testid断言。首RED仅覆盖按钮缺失，不证明其余14例已RED、session/guard行为已正确，亦不独立证明整页网络query总量为0。

## 当前全部已确定发现

### UIR-001 / P2 / OPEN：picture-group不走通用Editor，仅在Editor补按钮/目录无法覆盖该类型

**证据：** `views/dashboard/index.vue:146–154` 的viewEditorShow明确排除`innerType==='picture-group'`，:440的ViewEditor在该条件下不挂载；同文件otherEditorShow把图片组路由到独立Attr。`views/data-visualization/index.vue:513–522`与indexV3对应分支同样隐藏图表Editor。真实图片组入口为`custom-component/picture-group/Attr.vue`，里面是上传、轮播、threshold、PictureGroupDatasetSelect，没有通用FilterTree。Design第2/3节只明确给Editor补专用按钮、对Editor getFields skip补显式目录；这不能让图片组获得可见入口。

**影响：** 当前“49type共同Editor入口”不能据此闭合；picture-group仍在分母，不能用palette隐藏或字段目录缺失排除。**不阻A先交真实通用Editor按钮/copy**，但阻该type的入口覆盖通过。

**有限修订：** S037选择图片组真实Attr内复用同一copy/paste服务的最小可见入口，或精确修改其父路由让所需过滤区可达；字段目录通过已有`getFieldByDQ(...,{type:'table-info'})`分支校准，不能调用会清空/重写轴的onDatasetUpdate当纯校验。新增必要路径再由root增量Card/Context/admission绑定。Cases07须有实际选择图片组并证明可见入口的子案，而不只是直接mount通用Editor伪造宿主。

### UIR-002 / P2 / OPEN：C的L7/L7Plot ready仍是目标描述，尚未绑定真实可等待的完成链

**证据：** Design第5节称等待library ready/load/render信号；实际G2Plot SFC的L7/L7Plot分支只安排timer，L7Wrapper.render为void。`types/impl/l7.ts:46–78`的render仅在scene loaded后addLayer；flow-map/heat-map/symbolic-map实际以layer `inited`触发mapRendered，scene.loaded不等于图层完成。map/bubble-map以plot loaded及后续layer初始化工作完成真实配置，部分初始化仍在loaded回调中。仅await现drawChart或void render不足以证明候选完成。

**影响与有限修订：** 仅阻对应C地图候选的成功发布准入；不阻A/B、G2或其它独立工作。补一个按现存真实入口的完成/error/timeout映射、订阅时机和所需最小写路径；case10分别注入timer body、scene/layer/plot完成前后的失败，断言不提升与迟到ready不提升。不要求通用资源框架、全构造泄漏证明或旧29/55例。完整C结论由同轮补充报告给出。

### UIR-003 / P2 / OPEN：C富文本nextTick不足以证明TinyMCE已初始化并完成内容准备

**证据：** DeRichTextView.vue的template挂`@tinymce/tinymce-vue` Editor，setup注册异步`editor.on('init',...)`；onMounted再viewInit。`initCurFieldsChange:368–374`直接`tinymce.get(tinymceId).setContent(...)`，实例未ready可出错。Design富文本行目前以本地内容生成/净化/nextTick作结果oracle，未精确绑定TinyMCE init/失败与setContent后的可见内容；只await Vue nextTick不等待外部编辑器初始化。该SFC同时在viewInit注册不含suffix的`fieldSelect-${element.id}`，候选clone/唯一tinymceId不自动隔离此channel（Design风险节已承认该点，尚待具体接线）。

**影响与有限修订：** 仅阻富文本C成功提升；A不读/挂TinyMCE。补候选phase的本地channel/禁注册、实际编辑器init及内容ready/error/timeout映射；guard异步回调，不以DOM已挂载或下一tick当完成。保留resource ID，不复制新业务身份。完整C结论继续同轮核查。

## 已查无问题维度与15例当前检查

A已核源码：Editor changeFilterData仅clone赋树、FilterTree确认会另记快照，copy直接读customFilter不调用submit即可保持只读；DB树field:null/valueType:null、六null动态占位与缺timeValue必须保留，现Design已识别，不需等待前传输golden才能复制既有完整树。空source/空target边界不同；sample禁止从AX猜JSON。字段用完整目录、字符串ID与deType，禁止按轴/显示名推断。

身份路径：user.clear只删cache而不清reactive state，Design明确$onAction clear开始即invalidate；cacheUtil.clearCache另有清理路径，需轻量主动通知并每次操作重验，不能只watch uid/oid。opaque epoch不存token，DEV显式flag+三态unknown拒绝，prod关闭。editSession按资源/编辑生命周期共享，不能每次选中图表重建clip；Dashboard直接切UserView会复用Editor，选择空白/其它属性面板可能卸载Editor，因此会话清除应绑定退出资源/editMode而非把组件暂时隐藏或选择变化一概当退出。

B实际链已核：wrapper filter(false)包含查询组件、linkage/outer/web/drill/resultMode/count，report window写入仅在特定preview分支；已有calcData会提前setLastViewRequestInfo，不可直接当prepare。getData先delete入参data、再clone和解码，新增可选outcome须保默认语义、用clone防入参污染。S2分页、rich-text checkCompareCalc、picture-group重写table-info等都能沿现函数定位，不需要新axios。准备结果丢弃不改active，等C ready后才可发布。snapshot.recordSnapshotCache只在type为calcData/renderChart时登记对应刷新类别；A copy不调用它。

| Case | 当前设计核查与上限 |
|---|---|
| 01 | 真实缺按钮RED已绑定，足够A；testid及GREEN仍未跑。 |
| 02 | 完整DB fixture/deep clone/失败保旧clip可直接作为A oracle；不新增timeValue。 |
| 03 | 单调1799999/1800000/异常边界及clear路径明确，A可实现；真实行为未跑。 |
| 04 | 三态与unknown identity、publish前重验不混为真实权限通过；A只实现其copy/guard部分。 |
| 05 | 同dataset/目录/ID/deType检查方向明确；图片组宿主缺口见UIR-001。 |
| 06 | 已识别持久化兼容键、undefined与JSON边界，不允许精简重造树；复杂/静态日期具体fixture在相应用例执行前补实，不据手写对象称UI输出已验。 |
| 07 | 49ID与inventory一致、2401只为规则组合；实际宿主与逐type证据不能由family代表替代。 |
| 08 | 严格业务outcome与原默认API兼容方向成立；参数和错误分支仍需B真实模块验证。 |
| 09 | 单paste、operation/target/session/clip/TTL与本target刷新失效边界保留，未提升为通用竞态治理。 |
| 10 | 明确失败保旧及候选副作用guard；C真实ready待补，见002/003及后续同轮补充。 |
| 11 | 禁止二次query/重挂节点方向正确；C提升后canonical props/metadata具体接线继续核查。 |
| 12 | 非空确认、取消零候选query/dirty、确认后重捕获和最终重验完整；A尚未允许应用条件。 |
| 13 | DB与前传输对象分开，runtime捕获PENDING如实；不会因新增捕获回写冻结expected迁就实现。 |
| 14 | 真实刷新/正常save/leave/findById路径及独立数据oracle要求保留，未验收。新SQL证据可直接输入D。 |
| 15 | DEV两重开关/unknown拒绝与旧API/刷新默认兼容清晰，静态条件不当生产验收。 |

追加[独立SQL oracle](../evidence/TwoConditionSqlOracle-r001.json) SHA `a2b0b6834b4e53c6465cf6a60e050dfc8ccbcc037c9f233d7c9a51edb41c5506`已读和重算；样本14行amount合计6761可由文件行独立复算，含bar shop及line day聚合/实际轴。来源是root隔离环境只读SQL，不是被测图表结果。它使首条真实路径有现成数据oracle，但不证明任何产品操作通过。

## 未检查项、同类残余和下一入口

本Reviewer未运行产品、SQL、构建、测试runner或修改Design/Cases/源码，工作树原有大量修改保留。29项required-read摘要无漂移；精确代码阅读扩展到真实父Editor宿主、picture-group Attr/目录、useFilter/useEmitt、snapshot/dvMain、L7/L7Plot实际类及现装S2类型声明。S2实际render有Promise<void>及layout事件，因而不能把“API根本不存在”当阻断；其严格消费仍待实现验证。

C剩余检查：同key候选如何接回canonical view/element而不重挂、所有成功metadata/dirty与旧刷新一致、各真实ready及副作用闭合、Cases的具体可执行子案。上述结论将另写同轮补充，**本报告字节冻结，不用后续C结论改写A已通过的时点**。同类残余包括图片组在dashboard/dataV两宿主的路由、地图三个L7与两个L7Plot完成链、富文本setup/onMounted/异步eventBus回调；均按具体路径处理，不扩成全框架。

root应现在消费本报告为A发精确admission，立即让真实Editor出现专用按钮、完成copy和可观察拒绝/会话状态；首UI交付只提升A证据，不宣称S036或22项全部完成。C检查与修订可继续，不能成为A的等待前置。
