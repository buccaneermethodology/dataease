# S046 原生动态日期规则复制候选设计 r001

- recorded_at：2026-10-31T00:12:30.069216+00:00；snapshot：`S046-NATIVE-DYNAMIC-DATE-DESIGN-r001`；设计审查已用 **0/3**。
- **状态：候选源事实/设计，未实施、未测试、未独立验收，Builder NOT_ADMITTED。** 本轮只新增本目录四件输出，未UI/HTTP/DB/构建/安装或改产品、旧合同/报告/状态。
- 原Goal及DesignTask为authority边界；卡canonical SHA `b3c65823fba2012bd947872a3b11958856e342bda0e83b0ddf7b37ac52a241c1`，接收端validate/render、Context-r002校验均exit0；25主refs和24内层refs已逐摘要复核。摘要/结构校验不是产品测试。
- SourceTrace-r001.json SHA `68c45c8a716376ebdb593baf8f83f4b27e223eb15356a541625c76733cad8ae4`：27条源事实、41个精确路径/行范围/文件SHA，以及全部本轮调用者与6项blocked_oracle。
- Cases-r001.json SHA `c2c1884a2e680964801751cb6f0c6fa2809846ca0ebe5c8028ff72b9dc475b97`：63个候选见证+18个blocked案例/案例族，**执行数0**。名称、expected与合成shape不充当执行证据。

## 原始目标与分母

P1已由实际独立报告在DEV权限桩和49指定基本配置范围接纳12AC，S040非终态收尾已释放P2；完整产品类型仍0/49，P2原26项pending，完整38不减，真实权限BLOCKED_NOT_RUN、插件installed未知不变。源Goal冻结旧status不被本候选重写，P1ReleasedDependency绑定最新释放证据。

本切片回接原AC-F01-Q012（完整树、动态规则而非结果、畸形内部内容整次拒绝）、Q015（普通图/表/透视表同dataset互复制通用过滤、不带轴/样式、不能承载整次拒绝），以及AC-S02-02/03/04的映射、设计冻结、完整链要求。它不重开旧Authority Materials/Chart Payload等耗尽整包，不把子切片通过当Q012/Q015或原26项整体关闭。

原`TC-Q012-01`及`TC-Q012-02/03/04`、`TC-Q015-01`保留在Cases.original_case_identity。原FX-COPY静态T确定命中{2,3,5}、P0命中{5}；其动态date列未定义，不能给动态变体硬套{2,3,5}。这保留为B05而不是改掉原oracle。

## 当前原生链：不能借pure抽象guard推schema

Editor打开cloneDeep(customFilter) → FilterTree补field供编辑 → chart RowAuth/AuthTree/FilterFiled → TimeDialog → DynamicTimeForViewFilter/time-format只作预览 → RowAuth提交原树、FilterTree去临时field、Editor cloneDeep写customFilter。关键路径见SourceTrace F01–F11；所有事实带真实source path、line和SHA。

请求沿现有api/chart.getData→Axios→ChartDataApi/Server→ChartDataManage→补字段/charReplace→CustomWhere2Str。规则在query求值，保存沿updateCanvas→saveChartViewFromVisualization→ChartViewManege.save/transDTO2Record保存DTO树JSON；读取transRecord2DTO后RowAuth重新生成display。复制必须保存规则，允许原生query按执行时当前时间求值，不能把计算结果写入clip/canonical树。相关源F12–F19/F23。

全部直接相关调用者已列在SourceTrace.caller_census：chart TimeDialog实际caller只有chart FilterFiled，DynamicTimeForViewFilter实际caller为该TimeDialog；电子表格另有同名文件，未当本图表规则。CustomWhere2Str.customWhere2sqlObj的直接caller为ChartDataManage、YoyChartHandler、TableNormalHandler，fixValue另由DefaultChartHandler同环比扩展调用。query组件Component使用getDynamicRange及monthEnd/range，是并列机制，不是当前chart规则枚举依据。旧迁移doFix设置dateValue也不能拿来标准化新动态复制。

## 六字段、默认和精确枚举

以下“默认”只记录既有UI创建行为；**copy不得补默认或重算它们**。字段级源指针与SHA见F04–F12、F15–F17。

| 字段 | 当前类型/默认/实际值域 | 计算与保留 |
| --- | --- | --- |
| relativeToCurrent | TS string、DTO String；TimeDialog默认custom；每粒度下表列举 | 原样保留，不替换为当前日期 |
| timeGranularity | year/month/date/datetime；默认year | 决定规则输出粒度；不是leaf.timeType |
| timeNum | TS number，input-number默认0且仅min0，无precision/max；DTO Integer | custom参与偏移，preset忽略；常规0/1整数是见证，不是产品值域上限；fraction/清空/大数B03 |
| relativeToCurrentType | 默认year；year仅year，month为year/month，date/datetime为year/month/date | 年粒度后端直接按YEAR；保留inactive字段，不因未使用就删 |
| around | 默认b；实际picker f=前、b=后；preview和backend一致 | TimeDialog默认注释“前b/后f”反写，**不能据注释选语义**。预览组件自身默认f但实际接收config；不做静默统一 |
| arbitraryTime | 弹窗TS Date、默认new Date()，time-picker无value-format；确认truthy值转locale日期补零+空格+locale时间；DTO String | 仅custom datetime计算使用，后端直接substring(11,19)，其余分支仍完整携带但不求值；Date/ISO/locale实际wire B01 |

| timeGranularity | 原生非custom relativeToCurrent | custom单位 |
| --- | --- | --- |
| year | thisYear / lastYear | year |
| month | thisMonth / lastMonth | year / month |
| date | today / yesterday / monthBeginning / yearBeginning | year / month / date |
| datetime | today / yesterday / monthBeginning / yearBeginning | year / month / date，另取arbitraryTime位段 |

日期算子为eq/not_eq/lt/gt/le/ge/null/not_null（options.js实际列表），deType=1且filterType=logic。monthEnd/week/range/relativeToCurrentRange不是本chart弹窗的原生规则，不能因query组件的相似字段就开放。

原生leaf其它字段必须完整保留：type/fieldId/filterType/term/value/enumValue/filterTypeTime/timeType/subTree及已有null占位/own undefined。timeType来自固定日期TimeSetDialog；动态选择没有同步改它，合法例是timeType=year而dynamic.timeGranularity=date，不能强制相等。切换dateValue→dynamicDate只清term/timeValue，不清旧value；动态比较不依赖该旧value，不能再要求value非空或给它填物化结果。

`timeValue`是展示label/tooltip：RowAuth会重算；它虽然在前端提交树，却不在Java FilterTreeItem中。内存复制仍完整保留该字段，不能为了通过校验删除它；save/reopen应另比DTO规则投影及重新生成的display，不能伪称所有原始ownKeys/同一语言文案跨持久化逐字恒等。MVC的unknown字段实际行为仍B04，不用JsonUtil的ignore-unknown替代MVC证据。

null/not_null算子不会调用fixValue，正常UI可形成dynamicDate+dynamicSetting{}且timeValue空；它是可承载的原生空值叶，不应因缺少活动规则六项默认而被误拒。分组仍使用原生空占位，不允许把非空日期语义藏在group上。

## 最小完整实施切片（候选）

**已足够定义的核心**为12种preset组合（包括datetime预设的00:00:00语义）、year/month/date的custom单位×f/b，以及日期空值算子；在同dataset、真实字段目录、已释放P1身份/权限port上，整树深拷贝、兼容校验、候选query/prepare后采用、失败保旧、正常save/reopen构成一个局部完整链。数字见证取0/1以覆盖零和非零，不构造新的业务数值allowlist。候选DTO兼容检查可讨论非负普通整数，但不能把建议上界、安全整数或拒绝fraction写成“现有UI规则”；B03未释放的输入保持blocked，不宣布原生永久不支持。

custom datetime及Date/ISO/locale线格式不是non-goal：12个单位×方向×0/1案例显式保留blocked_oracle，待B01/B02/B04正常观察后补定oracle。没有将它们从Q012/Q015或原26义务中排除。仅核心可以进入独立设计审查，未解决的语义不得用默认值/统一UTC/固定ISO/任意舍入策略代替。未来若只准入核心，必须在新的精确card/admission写清能力上限及残余，不能把测试见证集合变成产品唯一合法值集合。

建议写域与职责：

1. `core/core-frontend/src/custom-component/filter-copy/mvp-chart-filter-copy.ts`：在现有checkMvpFilterTree内区分固定日期、原生dynamicDate、空值算子。活动动态规则按当前native枚举/字段类型与枝干校验；保持未知字段/未知结构整次拒绝。保留既有基本规则与失败不替换clip语义。可用同文件局部validator，先不新建跨项目schema框架。
2. `core/core-frontend/src/views/chart/components/views/index.vue`：在既有receiver、候选query之前，补一次现有`sameMvpPasteInput(request.candidateTree, clip.tree)`完整相等检查，失配用既有unsupported_tree拒绝。本候选不重写prepare/adopt/ready/所有权或Store。正常composable本来发cloneDeep(clip.tree)，这是原Q012内部畸形内容反例所需的最小绑定，不新增OS或serialized导入入口。
3. `core/core-frontend/src/locales/{zh-CN,en,tw}.ts`：保留既有unsupported_tree内部reason，候选对齐该key的文案；zh为原Q012要求的“过滤条件不匹配，请重新复制”，其余语言对应含义。当前显示入口已有，无新错误包装或通知框架。这一具体文案差异F26需独立审查确认，不默改P1其它reason。
4. 新`core/core-frontend/tests/filter-copy-native-dynamic-date/`及`tests/bdd/readable_cards/s02-native-dynamic-date.md`：绑定本轮审后Cases；真实service→真实Vue入口→另行真实运行分层，不改旧冻结Case/旧runner期待。原service共享写域后续与容量切片由root串行重绑，避免同时改。

只读依赖而非默认产品写域：FilterTree/RowAuth/FilterFiled/TimeDialog/预览组件、getData/API/DTO、CustomWhere2Str/Utils、权限实现、所有renderer/ready/G2scope、保存算法。**不修改原生日期计算策略，不加入后端clock参数/新Store/新UI或双host框架，不从pure抽象树直接继承native schema/容量envelope。** 如实施发现必须改这些依赖，应先报告触发、影响与推荐Scope Delta，不能悄悄扩写域。

核心伪代码约束仅是设计：

```text
normal tree traversal/field capability checks retained
if leaf.dynamicDate:
  require actual date field and native date operator
  if nullness operator: preserve inert native metadata, no rule evaluation/default fill
  else: validate current native active rule shape/branch; do not require stale leaf.value
  copy full original known structure; no now/dayjs/Date normalization
else: retain released basic/dateValue behavior
on receiver: candidateTree must equal validated authoritative clip.tree before query
then reuse existing query -> prepared renderer -> final token check -> adopt original rule
```

## 两项范围差异反馈（待审建议，不增加原must-have）

| 候选 | 触发 | 原Q012/Q015依据 | 影响 | 建议 | 未验面 |
| --- | --- | --- | --- | --- | --- |
| SD-NDD-01 | F27：receiver使用内存request.candidateTree，已有clip/session校验但未比对完整树 | 原Q012完整结构/异常内容整次拒绝且零新query，Q015不能承载不部分应用 | views/index.vue成为本轮新增必读及未来候选写域；只在query前一处绑定，不改正常prepare/adopt | 独立审查是否采用现有sameMvpPasteInput比对请求树与已校验clip；正式card必须扩入当前路径/行/SHA，不能继续称service-only | 这里只约束内存对象。没有serialized/OS入口，不能当最终envelope decoder，更不能称TC-Q012-02/03/04三类serialized异常全验；原入口与decoder绑定为B06 |
| SD-NDD-02 | F26：unsupported_tree当前文案与原精确提示不同 | 原Q012明确“过滤条件不匹配，请重新复制” | zh/en/tw既有key文案及所有复用该reason的基本/动态拒绝展示都会受影响；reason/API不变 | 候选只对齐已有reason/key和既有paragraph显示，独立审查确认必要性/兼容性；不新建错误体系 | 尚未实际UI验证不同失败原因/语言及展示；不把文案候选当原拒绝行为已实现 |

两项均以原条款触发，不将“还能更严格”的建议升级为新must-have。本候选完整保留原分母，正式实施写域由审后admission确定；未对产品作任何改动。

## 全部当前差异与反例

- F20：现MVP明确拒绝dynamicDate、所有非null动态setting，且普通值校验会误拒合法value=null动态叶；只删一个dynamicDate判定并不完整。
- F04/F08/F16：注释、locale字符串与后端位段语义必须按实际代码辨析；不能改成“b=前”、一律ISO或统一UTC。
- F09/F19：timeType/timeGranularity及display/value/计算规则要分层；持久化投影不等于内存全descriptor恒等。
- F27：receiver当前依赖可信上游clip/session，未比请求树；内部畸形内容受控组件反例不能靠只测pure guard声称query0。
- F26：当前unsupported_tree文案不等原Q012精确提示；已有i18n reason入口可作最小对齐。
- F23：同环比与普通表backend会基于临时深拷贝树扩展范围并把临时叶改dateValue；canonical只能采用原request.candidateTree，不能拷贝response.customFilter的临时求值树，更不能复制源轴/同环比设置。
- F25：原FX-COPY动态列/clock尚未绑定，不把静态{2,3,5}当所有动态规则结果；source与target同错也可相等，必须另有独立oracle。

以上是本轮源事实与候选差异，没有运行证据证明新行为已实现，也没有因上述静态线索宣布新产品缺陷严重度或重启旧耗尽包。

## Cases与逐层验证方案

63候选见证：12preset、24个非datetime custom（单位×方向×0/1见证）、6比较算子、2空值算子、7整树/深拷贝/shape/真实UI/原子采用/持久化见证、6图表方向、6整次拒绝反例。另18blocked案例/案例族覆盖12个custom datetime见证和Date-wire、数字域、clock/epoch/zone、DTO/save、原动态fixture及原serialized envelope入口。所有case为NOT_RUN或blocked_oracle，不能把63个命名作为63项通过。

- 纯逻辑：真实service全部合法分支与反例、独立引用、不续期/不消费、未知树整次拒绝。正式Builder前冻结新runner，当前实际service的dynamicDate拒绝应形成语义RED、execution0，不能用装载错误当RED；同case身份GREEN。旧P1基本guard回归保留。
- 真实Vue：实际FilterTree→chart RowAuth/AuthTree/FilterFiled→TimeDialog生成canonical shape，不能用手写pure对象冒充原生；真实composable/receiver/renderer准备采用。非法内部传递通过受控emitter/provider只改本次candidateTree模拟，真实clip仍C0；这仅证明内存tree失配门，三类serialized原入口仍B06；测receiver不发query、P0/预览{5}/保存版本不变，明确它是component故障见证而非正常UI可随意改内存。
- 实际UI/query：另准入专用fixture，bar/table-info/table-pivot六方向保持各自预置轴/ID可见结构。正常生成日期规则、复制、确认替换、候选请求/实际结果，目标未完整承载整次拒绝。query已发后失败必须保留真实count，不能写query0；只有前置非法拒绝0新query/刷新。
- save/reopen：另行准入普通显式保存，记录raw目标customFilter、正常离开panel、find/新query/原生过滤弹窗；rule动态字段及语义投影保持，不要求非DTO timeValue逐字保存；未保存/失败不伪称已存。

独立query oracle：先冻结实际日期行、fieldID、浏览器locale/TZ、服务器clock/zone与请求时间窗口，再由不调用product fixValue/time-format的独立日历/区间计算列expected IDs。eq/ne区间、gt/le取end、ge/lt取start必须覆盖；秒/日/月/年精度与cross/noncross差异见F17。遇clock窗口跨日期/月/年边界或无法绑定epoch单位，记blocked_oracle/未判定，不以回包反推预期或任意重试抹除首次记录。

## blocked_oracle与最短正常源观察

| ID | 未定项 | 最短补证与准入边界 |
| --- | --- | --- |
| B01 | custom datetime/arbitraryTime的真实locale/Date/ISO线格式 | P-NDD-WIRE正常UI/只读query探针，见下；不改日期算法 |
| B02 | server clock/zone、epoch精度、DST及精确ID | 绑定既有运行环境/进程非敏感clock与zone证据、源日期列与精度及请求前后时间窗，再冻结独立数据oracle；不能只看浏览器预览 |
| B03 | input-number fraction/清空/大数与DTO coercion | 新准入下正常输入0/1/1.5/清空/Integer边界值，逐段记录model→确认→JSON数字型/响应，先观察不自行指定舍入/上限 |
| B04 | 实际DTO/save/reopen shape和timeValue处理 | 专用可恢复fixture、另行正常save准入；raw保存与find、旧/新descriptor、原生回显，区别未声明字段与规则 |
| B05 | 原FX-COPY date映射 | 另冻结f_date行值/anchor/zone，人工先列ID集合，再绑真实dataset；保留原静态T的2/3/5与旧5 |
| B06 | 原三类serialized内部变体的实际envelope/decoder入口 | 当前只内存clip/candidateTree，不自创新入口；待后续既定payload责任单元正式绑定最终contract与真实reader后再验原三变体，不重开旧耗尽包 |

**P-NDD-WIRE探针（仅建议，当前未执行）**：

1. root另发精确read/write-runtime card，选专用已保存fixture并保全原树/类型/保存快照；不录登录/凭据/headers/cookies/storage，也不安装或重启。
2. 正常过滤UI选日期字段→dynamicDate→datetime/custom，分别正常选择0/1、year/month/date、f/b和00:00:00/13:14:15；只在该source观察必要代表组合，不等于全产品验收。
3. 在TimeDialog尚未确认、confirmTimeSelect后、FilterTree确认后分别投影`typeof`/Date tag/valid标志（仅Date对象时epoch与ISO作事实）、完整rule tree/ownKeys/undefinedPaths、value/timeType/timeValue；浏览器navigator.language与Intl.resolvedOptions().timeZone为允许的非敏感环境字段。
4. 正常“更新图表数据”，只捕获被允许target的getData业务路径/状态/businessCode、customFilter投影、raw可见ID行和request/response时点；禁止全网录制/认证body，不能只截展示文本。实际arbitraryTime原串、其[11,19)字符与类型都保留，不清洗locale。
5. 第一probe不save；正常离开并拒绝草稿恢复，读回原已保存fixture、clip空及三unknown。save/reopen另走B04准入，不能夹带DB写入。若native UI/HTTP本身失败，原迹保留，仅回报事实；不为取证修产品。

B03可在同隔离设置中正常尝试输入，不把超范围注入Store/伪造JSON当原生行为；Date/ISO导入边界若没有正常入口，明确未观察，不新建入口来强行证明。B02若现有进程无可读非敏感clock/zone证据，保留阻塞并交环境owner，不发明时区策略或新API。

## 下一准入与收尾边界

独立设计审查一次查全SourceTrace/F01–F27、63+18案例、值域与blocked边界、receiver最小绑定及文案写域、Q012/Q015原分母和权限上限。当前review0/3，不能由本候选自动启动Builder。源事实若漂移，重绑新卡/Context而不覆盖旧输入。

可先独立接纳已可证核心的候选；真正未知值域留待最短源观察与审后合同，不要求为了“更严格”重做所有日期/所有数据源/全P2。但在宣称完整原生动态日期或完整Q012/Q015之前，必须完成未定原义务，不能以子切片关闭原26。最终Handoff索引本三件摘要，独立审查和正式实施/运行admission为后续动作。
