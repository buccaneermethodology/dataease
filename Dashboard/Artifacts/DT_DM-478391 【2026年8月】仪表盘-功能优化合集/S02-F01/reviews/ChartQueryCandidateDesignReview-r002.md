# 候选图表查询工程设计独立审查 r002

## 本轮裁定与范围迁出

本交付物第 **2/3** 轮独立审查。**当前 Design/Cases 整包 Freeze 为 NEEDS_REVISION（需精确修订）**：候选取消等待与配置身份方案已闭合首轮架构缺口，68子案大体可执行；但三个legacy取消兼容结果与真实service错误链不符，须保留为本query交付物的未决合同问题。不是要求重做架构或继续扩大硬化范围。

**stub + runner bootstrap：有界方案可行，当前不授新准入。** 合法failed/query sentinel及helper无adapter早结算规则已明确；未来迁入独立Session时还须绑定修正后的唯一oracle、真实模块runner和精确admission。**生产source readiness：NOT_READY（未具备准入）**，尚无正式可信RED、独立RED Validation与逐target admission，本报告不授予源码写入。

审查进行中，父Orchestrator转交已核实的人类最新范围调整：源chat `01a16109-aa34-78a0-8f47-f48aebb7e396`，userMessage `01a17b46-fa6c-7713-8511-a16644a2f999`；通用异步等待/候选query取消框架与双host/资源治理移至另Session，不再是当前S02 MVP前置；当前工作转为所有受支持图表的基本过滤复制粘贴，明确开发权限桩。该provenance由父代理通过read_thread核实后转交，本lane没有把自己的记录充作新的人类授权。

本报告据此在只读边界立即收束：保留已检查发现、通过域和未检原因，不再扩审、不修改被审r002或原Goal/Cases、不把迁出当验收通过，也不阻塞当前S02新范围继续执行。主代理另行保全原范围并形成可审阅TSP Scope Delta和新Session。本报告中的10 Goal AC/26 must-have/16产品义务是**被审快照的历史分母**，没有在本报告删改或据新范围自行宣布完成；开发权限桩不能在本query历史证据中升级为真实权限验收。

## 独立性、输入与复验

Reviewer/source为 `/root/line_sibling_host_design`，不是query Design/Cases/runner作者。本lane此前编写过另一双host Design，但本轮仅审query，未审自己的双host或已冻结LSC。

- canonical Card `3883615c90b5084bd4105d3917d3a755145331839d60316159372c9cc6106690`复验pass。
- Context字节SHA-256 `b812560ed61705df81004c260d1c7c0c07c6253e5ec17f3ec5ab7ffb3d378f9a`；24项绑定输入摘要匹配。Cases的25项source_binding也逐项重算无漂移。摘要匹配只证明绑定，不替代语义阅读或运行。
- [Design r002](../ChartQueryCandidateDesign-r002.md) SHA-256 `26d03eeb9464b30f1af9ec96e3fa0f3cc0cee8086a695a4dd951bc404da20f2b`。
- [Cases r002](../ChartQueryCandidateCases-r002.json) SHA-256 `e04c51c6115ad22cae2d76d596fe48492d07de6ff03eaa6fcecc3efe40c62260`；fixtures/cases/terminal_rule canonical SHA-256重算为 `d10c879c8baaa661c0fa79d09cd010b4bea2fe45fdaa02ddb0ed83ead78c1800`，与声明一致。
- [首轮报告](ChartQueryCandidateDesignReview-r001.md) SHA-256 `fa241bc446bcd69dc8b0b197ff70ae5658d9334cb6d8e711360ce09b12c9eebe`。

本轮以新reviewer进行full-baseline判断，完整读取首轮报告、r002 Design和28主/68具名子案，重新跟踪真实api/chart.ts→axios/index→service→refresh/login/requestStore、hmac/HmacTool/CalculateFields及已安装Axios CancelToken/CanceledError/AxiosError/mergeConfig/dispatch/toSafeFlatObject/Headers；没有仅复述首轮结论。旧r001候选用于谱系与差异定位，不再次逐案裁定旧版本。相关SFC/Store/Trace只约束query不发布活动状态的边界，未将它们扩成另一工程Review。

只执行JSON/摘要/计数结构检查、独立fixture HMAC重算，以及真实CancelToken对象加现有service字面表达式的无请求诊断；**没有调用request/getData/service/HTTP/数据库/权限接口，没有执行68-case正式套件或构建**。

## 首轮发现处置

| 首轮项 | 本轮结论 | 证据上限 |
|---|---|---|
| QCCD-001：取消真实refresh后原retry永pending，候选不能结算 | CLOSED（设计合同层） | candidate专有CancelToken gate与真实configHandler/securityConfig Promise.race；局部try/catch清理；取消通知先发生再解绑；upstream两出口消费。024明确retry pending/cached1/globalfalse时candidate仍64微步内aborted，不偷偷改refresh |
| QCCD-002：表驱动、兼容和per-request oracle不足 | 大部分修复，剩余未关闭 | 28主/68子案均给具体输入和per-request/network计数；legacy取消最终错误仍不符真实链，见唯一阻断QCCD-R2-001 |
| QCCD-N001：非法not-implemented union与无adapter RED timeout | CLOSED（helper bootstrap合同层） | failed/query +明确Error sentinel合法；QCC001首fingerprint固定；无bundle以断言失败处理，不能TypeError；stub先结算不等不存在adapter。raw API负例的baseline调度仍须runner显式实现，见非阻断提示 |

上述关闭没有表示代码已经实现、正式RED/GREEN已通过或产品准入成立。

## 唯一阻断发现：QCCD-R2-001 / P2 / OPEN

**legacy function-message取消在真实service中被转换为新TypeError，不能期望最终仍是原CanceledError。**

影响位置：Design“错误传播与legacy精确兼容”最后一段；Cases `QCC-020-batch-cancel`、`QCC-021-legacy-batch-only`的LIVE结果、`QCC-022-all-three`的LIVE结果。`QCC-024-real-refresh-global-cancel.expected.refresh_canceled_error`还须明确它观察的是token.reason还是最终refresh Promise rejection，二者不能混写。

真实链为：

1. service.ts的cancelRequestBatch/cancelAllRequest向legacy cancelMap回调传的是**函数message**，没有传config。
2. 已安装Axios的CancelToken把该值传给CanceledError；AxiosError用Object.defineProperty原样赋message，故token.reason.message确实为function，token.reason本身isCancel=true/code=ERR_CANCELED。
3. service错误拦截器在`!error?.response`早返之前，先执行 `error.message?.includes('timeout of')`。这里optional chaining只判断message是否null/undefined，不检查它有没有includes方法。function没有includes，表达式抛出**新的TypeError**。
4. 因而该service/request/getData最终rejection不是原token.reason，axios.isCancel为false；不能通过“message类型function”直接跳到“最终仍reject同CanceledError”。legacy保持现状与当前Cases的oracle不能同时成立。

本轮只用已安装真实Axios CancelToken生成function-message reason，再执行**同一字面表达式**，没有请求/服务调用，得到：`token_isCancel=true`、`token_message_type=function`、`TypeError: error.message?.includes is not a function`、`same_reference=false`。这支持上述可定位的静态链，不冒充正式service套件。

精确修正应保留legacy源码行为，分别冻结：token层reason仍为原CanceledError/function message；API Promise层为该新TypeError（不等于token.reason，isCancel=false），包含020、021、022全部同类。024全局取消refresh时，原refresh token.reason也仍为CanceledError/function，但refresh Promise经service到refresh.catch时是TypeError；retry仍pending、cached callback1、globalflag最终false与candidate自身aborted核心predicate**不受此区别推翻**，只是必须把两个错误观察层分开。不能为了旧oracle悄悄给legacy加字符串化或类型防护；那是额外兼容变更，不在当前被审最小合同内。

这是本轮找到的完整同类集合；candidate自己使用字符串message `CHART_QUERY_CANDIDATE_CANCELED`，不命中该function.includes错误。候选transport E_TRANSPORT及403/413、假取消E_FAKE_CANCEL也不是同一错误形状，没有据此泛化为全部取消都错误。

由于人类已迁出本工程，本lane不修被审文件、不开启r003；该finding随独立query Session迁移，不能反过来阻断当前S02基本过滤复制粘贴。

## 全量检查矩阵与无新增阻断域

| 主case及子案 | 本轮检查结果 |
|---|---|
| 001–005（5子案） | 实际等待、显式empty、输入snapshot/getData副本及response clone边界清楚。原getData先delete data再clone；helper双副本避免caller污染。响应bundle只内部共享chartData引用，未发布Store/SFC |
| 006–010（5子案） | 50002由service放行/getData原样返回，优先business而非缺data empty；普通业务90001经service先UI再reject原字符串；network/403/413分别保留candidate原error，403未await confirm，413早return有定向candidate拒绝要求；主异常与UI自身新异常分开 |
| 011（8子案） | query result undefined/null、chartData缺失/null、rows缺失/null/object/string实际payload路径已分别固定。真实CalculateFields对obj可选访问，不将这些形状提前误造为API解码错误；helper才能以response-invalid判定；缺rows不算empty |
| 012–018（10子案） | preabort0dispatch、caller与live隔离、相同chart及相同requestId两个Symbol、迟到resolve/reject消费、成功后stale、调用前stale、predicate前后抛错计数清楚；ordinary rejection不被事后stale掩盖。每alias独立terminal/settlement，不把late观察算第二terminal |
| 019（10子案） | 非line/render、顶层/嵌套plugin、三种drill/no table、缺/非法signal均是具体path/op/value；helper preflight getData0/registry0；signal按跨realm结构判定，不依赖instanceof |
| 020（6子案） | normal返回、403/413的undefined→API res.code TypeError、raw candidate缺signal与非chart marker的legacy路线均具体；batch最终错误存在QCCD-R2-001。非chart不注册candidate，但仍允许其真实legacy key |
| 021–022（2子案） | batch只旧map、global稳定快照两map、LIVE/A/B每request计数明确；候选仍不写legacy chart key。LIVE最终取消error oracle同QCCD-R2-001，不能凭aggregate计数通过掩盖 |
| 023（9子案） | ready/business/transport/caller/global清理、登记后auth getter抛错、真实HmacTool try前日期抛错、UI handler新异常、旧release不删新Symbol均具体。局部request handler try/catch必要，因为同一use的onRejected不捕获自身async throw；不能假定error.config总存在 |
| 024（4子案） | 真refresh全局取消、普通refresh失败后caller abort、candidate-only abort后真refresh晚成功、真实HMAC await期间微任务取消分开。未手调cached callback。expired为T−90001、fresh key/UTC与route明确；retry pending残余被记录。取消refresh token与最终catch错误须按本finding分层 |
| 025（2子案） | 两条link优先embed/仅embed的mobile+tw/proxy路径、normalized AxiosHeaders值与缺席头明确；不会同时要求link与embed。固定HMAC输入用Python标准hmac/hashlib独立重算，得到`clwReVzy1BluVsRB2odGzBW6OqZVxh+5K5TpS6ObJg8=`，与fixture相同；没有从生产输出生成expected或读取机器凭据 |
| 026–028（7子案） | 回包三种drill拒绝、cycle/BigInt真实JSON错误、candidate实际cancel与仅名字相似普通Error均具体；Error引用/无wrapper与生成Error类型/消息区分；不把名字CanceledError视作取消 |

合计28主、68子案逐项读取；唯一subcase id集合及canonical identity匹配，aggregate helper_terminal_count/getData_invocations均与requests数组之和一致。这里的通过表示合同可定位/静态一致域，未执行网络或正式套件。

**跨Axios owner与gate可实现性：** candidate在request fulfilled中、auth/signing前登记；owner为可枚举字符串字段的Symbol值，CancelToken是独立非plain对象。已安装mergeConfig对Symbol scalar及CancelToken引用保留，dispatchRequest的toSafeFlatObject会复制own字符串字段值；不依赖config对象恒等。真实configHandler和HmacTool修改/返回config/headers，不改变owner/token合同；返回后重接、response/error.config再验证owner+token、无config异常用局部entry释放方向清楚。CancelToken.subscribe对已取消token同步调用listener；合同先给gate挂拒绝消费、不可先unsubscribe而吞掉通知，能够承接该真实行为。原upstream Promise被race双出口消费；永pending的原retry不必settle才能让gate获胜。此为实现可行性，不能倒推已经零泄漏。

**响应副作用边界：** 既有权限提示、version/linkToken、cache/router/刷新认证可能外溢，不被称为纯query沙盒。403/413 candidate拒绝原transport与legacy UI兼容要求分开；ElMessageBox.confirm自身throw E_UI优先作为实际新error，有对应子案，没有增加“不论UI错误都必须原transport”的虚假强保证。

## 非阻断runner提示及未检查原因

`QCC-020-raw-candidate-no-signal`在未来实现应0dispatch并拒绝，但bootstrap阶段真实旧getData忽略第二参，会意外进入adapter；它不是helper sentinel路径。未来runner必须对这种**意外adapter**立即记录计数/行为断言失败并按固定fixture释放/消费原Promise，或明确给同等有限收束调度，不能仅复用“helper sentinel先返回则不等adapter”规则后等待一个本来期望不会发生的raw结果直到timeout。当前尚无runner，此项记录为bootstrap实现检查点，不新增产品设计阻断，也不允许修改正式expected追绿。

未执行：正式stub/runner全68子案RED/GREEN、真实service端到端诊断、浏览器/HTTP/权限、保存重开及整包构建。原因一是没有本件正式runner/生产admission，二是人类最新指令已将通用框架迁出并要求本轮立即收束，不再扩审。对未检查的任意第三方内部异常、全部transport适配器、所有UI异常或新S02开发权限桩路线不作通过/失败推断。

query后续仍有真实认证/签名/取消运行证据、owner/listener释放和late路径；原refresh cached retry残余没有被“candidate自有listener0”洗掉。产品层stage/业务树/Store发布、跨标签、原权限/只读/撤权/组织隔离、保存重开和旧CFPI/CTPR/AM-09等保持各自历史未决身份。它们迁出或后续处理均不等于验收完成。

## 迁出后准入预测

在新的独立query Session中精确修正QCCD-R2-001全部同类错误层oracle、固定上述raw baseline调度后，预计可以有限增量复验，不需重做取消架构或增加未来硬化要求。本交付物预算仍是2/3，不能迁出后重置预算。之后才是冻结manifest/同identity Cases→精确stub/runner admission→真实模块行为RED且execution_errors=0→独立RED Validation→生产各target admission→GREEN/独立验证。

**这条预测只属于迁出query交付物。当前S02按人类新范围继续，不等待本query框架，不从本报告获得query/axios源码准入，也不将历史合同通过域当作新的MVP完成证据。**
