# 三类坐标地图局部运行证据独立审查 r001

- reviewed_at：2026-10-30T02:02:24.111908+00:00；reviewer/source：`/root/bubble_ready_validator_resumed`，非本批UI执行者。
- snapshot_id：`S02-COORDINATE-MAP-EVIDENCE-VALIDATION-r001`；as_of_state：root已冻结flow/heat/symbolic运行事件、r003摘要及r009进度；本lane仅读取、复算和查看截图，未操作UI/DB或产品源码。
- 本证据交付物审查 **第1/3轮**；地图fixture、底图环境和bubble原有预算不重开。
- 接收端与写前card canonical SHA `31c705bad3d4fb53174b29e047ba1b6c21988025becab4f0ad931c15c2090884`，validate exit0/PASS；Goal+11项base refs共12项摘要均一致。r003另引goal/admission/event/oracle/basemap摘要也全部一致。

## 裁决与本次结论

**本批局部证据与r009累计观察声明：有界通过并保留发现（PASS_WITH_FINDINGS_FOR_LOCAL_EVIDENCE_ONLY）。新增阻断本批局部记账的发现：0。三类图表完整产品验收：仍未通过。**

52条事件、六次成功paste诊断与相应HTTP响应data、68份source/clipboard树描述及独立CSV复算彼此一致，支持三类地图分别增加source/target局部观察。r008的46类累计双角色观察加本批3类等于r009的49类，三个49元素集合均无重复且等于SupportedCharts的49个type；**只校验这次增量和既有集合算术，没有重新独立运行或逐案重审此前46类。**

`49/49`只能称“累计都有双向局部观察”，`fully_verified_builtin_types=0`必须保留。symbolic重开后的4条累计ubo错误、过滤外details，以及flow流线/重开稳定画面缺口均是真实残余；本报告没有把它们关闭。38义务（P1=12/P2=26）、49完整验收分母、真实权限BLOCKED/NOT_RUN、插件installed unknown不变。

独立发生的是**证据审阅和CSV/日志复算**，不是独立runtime重跑、正常保存复现、真实权限验证或Goal最终review。r003的`independent_validation=PENDING`在其原冻结时点成立，不能回写历史JSON；本报告只补本批证据审查结果，不替完整产品Validation。

## 读取清单与证据定位

完整读取卡/render prompt、UiIntegrationCases-r002（尤其runtime/transport比较规则与forbidden collapses）、地图fixture计划及其独立r002审查、底图计划和Runtime、Coordinate Oracle、原CSV、52行event log、r003摘要、r009进度、Topology-r515；为核增量扩读r008与SupportedCharts。查看本批全部11张RuntimeCoordinate图片并独立计算摘要。沿源码检查`describeMvpFilterTree`和queryObservation如何采集，确认它们是前端诊断投影，非独立抓包计数。

| 本轮核心输入 | SHA-256 |
|---|---|
| RuntimeCoordinateMap-events-r003.jsonl | `5366a902a8429bb13a6c23b2bb4664c17107cccbbb3e64610b9e232226fbded9` |
| RuntimeCoordinateMap-r003.json | `9cd07dd4a39bd8404eabaec76323ab7ae31f49ccc4bc25677d02aa8cec38cf47` |
| RuntimeUiProgress-r009.json | `a87ecfb722413c410d1a72350e1860983b795f362ca37acf5090da75793c773d` |
| LocalMapCoordinateOracle-r001.json | `3866d7c9d28e863952ff3889872bd8490682fa2668aa61ec26f3770ac9144801` |
| 原始19列CSV | `abc8bed0862129d58724bcefff2563862e48d1ea057365ae8d5d2c853e64472b` |

独立检查脚本为`/tmp/check-coordinate-evidence-validator-r001.py`，SHA `2b1197b5399beba96aac57fe9cfacf4b55cdac5eaf6d38c9df20874ae28ce7a7`；结果为`/tmp/check-coordinate-evidence-validator-r001-results.json`，SHA `3c2e5219ffe9ab721bbfac3e0f895878285b15879ddb2c66d8c6431e5dd9d2ee`。脚本只读取已冻结文件并写tmp检查结果；不调用chart API、浏览器或数据库。初始检查器经本lane纠正为尊重已记录undefined路径和顶层坐标投影后得到本报告结果，没有修改被审输入或以JSON归一化替换runtime完整比较。

## 独立CSV与完整树复算

CSV独立解析为30行×19列、30个唯一id；用Decimal按`amount > threshold AND shop in 六枚举`筛选和分组，不从chart响应生成expected。shop集合为果元店、南都店、香橙店、乐园店、红叶店、水围店。

| 条件 | 命中id | 总额 |
|---|---|---|
| >200 | 3,5,11,12,13,14,15,16,17,18,20,21,23,25 | 6761 |
| >500 | 3,5,11,13,16,18,21,25 | 5093 |

| 起点经度/纬度 | >200 | >500 | flow终点 |
|---|---|---|---|
| 114.0579 / 22.5434（深圳） | 1868 | 1868 | 120.1551 / 30.2741（杭州） |
| 118.7969 / 32.0603（南京） | 2676 | 1982 | 114.0579 / 22.5434（深圳） |
| 120.1551 / 30.2741（杭州） | 2217 | 1243 | 118.7969 / 32.0603（南京） |

200和500两套row_ids、sum、顶层坐标聚合与flow起终点/城市分组都与冻结oracle一致。三类forward真实queryObservation.responseData按各自fields映射dataeaseName后，flow全部起终点/城市/amount与CSV一致，heat/symbolic的顶层longitude/latitude/amount与CSV一致；三次reverse指标均为5093。symbolic额外city/count/details没有被删掉当“全响应通过”：本轮oracle仅投影上述顶层三列，details单独列为未通过。

68份source/clipboard描述全部满足JSON tree、ownKeys和undefinedPaths内部一致；不是要求每份undefinedPaths为空。11份旧200状态中两个叶子的timeValue有own-key但值为undefined，tree JSON省略相应键，日志另记路径；成功复制的500 source/clip与目标采用后没有这些旧键。正反向每次都比较**完整tree + 全路径ownKeys + undefinedPaths**，包括动态设置六个null键、field/valueType的null、子组or和完整枚举，不只比第一leaf。

## 六次配对与保存重开追溯

事件编号以下均为jsonl一基行号；所有event名唯一，事件at单调递增。

| 类型 | 正向（指标500→地图200） | 反向（地图500→指标200） | 最终save/leave/reopen |
|---|---|---|---|
| flow-map | #5 source/clip；#6旧200；#7采用500 | #8旧200；#9 source/clip；#10采用500 | #11/12保存前；#13 saveDisabled=true；#14工作台；#15/16重开 |
| heat-map | #19 source/clip；#20旧200；#21采用500 | #22旧200；#23 source/clip；#24采用500 | #25/26保存前；#27 saveDisabled=true；#28工作台；#29/30重开 |
| symbolic-map | #33 source/clip；#34旧200；#35采用500 | **#42 verified source/clip；#43旧200；#44采用500** | **#45/46保存前；#47 saveDisabled=true；#48工作台；#49/50重开** |

每类正反向source与clip完整描述相等、采用后目标与所复制source完整描述相等；旧目标均确为200，不是把已有500当粘贴成功。六次queryObservation均logicalGetDataCalls=1、queryPlan=queried、outcome=success、reason=null，dataset匹配隔离dataset。每次在其事件窗口内可按targetId+responseData找到唯一status200/code0 HTTP响应data，全对象相等。flow/heat/symbolic正向及flow/heat反向窗口各只有一条记录；symbolic verified反向窗口有5条记录，其中4条是此前01:48:23重开积累，真正5093指标响应在01:50:13.313，只有一条与本次queryObservation匹配。

### symbolic首次失败没有被算入成功

#36准备反向时指标树200，#37首次save前仍为200；#38地图为500。#39虽然saveDisabled=true，#40确实离开，仍只能证明一次500/200的保存尝试。#41明确erratum记录driver选择等待失败及草稿提示。r003指向verified reverse及symbolic_verified保存重开前缀，未拿#39冒充双向成功。#42–50之后指标/地图均为500，重开各source描述与各自最后保存前描述完全相等、clipboard均null、session从7切到9。#49对应HTTP也为两者500/5093，不把旧6761指标响应混入。

### 服务器重开、JSON与画面分层

三类均记录显式saveDisabled、离开到`#/workbranch/index`、重新出现Editor source/clipboard及新session。flow与symbolic重开窗口有相应成功getData响应，heat响应滞后在#32窗口：01:42:17.078热力500和01:42:17.086指标500，早于symbolic改类型查询，不能把#29空responses说成已无后续响应或伪造一份回填旧事件。

这些证据支持**正常UI重开后完整canonical树读回一致的局部观察**；本批没有单独保存HTTP原始POST body/response或findById持久metadata JSON，所以不提升为直接数据库逐字节持久证明。getData响应中的customFilter会补叶子field元数据且enum value由null变空串，与诊断pre-getData request snapshot不是逐字节相等；本lane没有偷偷归一化它们后宣称整个传输树完全相同。独立匹配的是targetId与整个responseData，并分别核canonical树与CSV结果。

源码诊断的request仅clone id/type/render/tableId/customFilter，计数在调用getData前加一；不是完整实际HTTP请求体，也不统计Axios重试/其它画布请求。r003标“1逻辑query”的表述成立，不能改成“整个页面只有1个HTTP”或“请求wire字段逐字节无变化”。

## 全部发现、已保留问题及影响

### CMV-N01｜P1产品未决、对本批局部记账非阻断：symbolic累计4条ubo异常

#49重开、#51缩放与#52冻结都携带相同4条`Cannot read properties of undefined (reading 'ubo')`累计数组。它们不是三批各4条，不能相加成12条；亦不能仅按同文案去重成1次。现有记录支持“累计4条错误”，没有stack、renderer归属或独立复现，不能据此确认由复制粘贴、重开销毁或底图单一原因造成。

r003已诚实保留，完整类型验收0保持，故不否定已记录的canonical树和query顶层结果；但渲染生命周期/重开无错误的产品验收仍未通过。后续应基于具体触发、stack/资源身份诊断，不能因截图可见三点把它关闭。

### CMV-N02｜P1产品未决、顶层oracle之外：symbolic details含不满足过滤条件的原始行身份

#35响应的三个details代表项id为3、2、1。独立CSV对应店名分别果元店、蓝墨店、欢果店，后两者不在六店枚举；同时details.amount已被替换成所属顶层聚合1982/1243/1868，并非对应CSV原行802/141/162。说明不能把details当真实匹配明细集合或把全响应都宣称符合CSV。该现象也出现在symbolic重开响应，未由本轮修复。

raw响应extTooltip=[]；不能在没有调用链证据前断定为“继承tooltip轴”或“只影响tooltip文案”。当前已证明的是顶层聚合与指标正确，而details含过滤外身份/混合聚合字段。它可能影响实际tooltip/交互数据解释，需单独诊断，不能从顶层正确推出明细或权限正确；本报告不作安全漏洞或根因断言。

### CMV-N03｜P2视觉与时点残余：flow/heat重开截图没有稳定完成图层证据

flow-initial截图明确是切换后旧场景，按r003限制排除；新flow200/500有本地网格和标签，但没有清晰可辨完整流线。flow-reopened截图近空白，只有细小点，底图和图层未稳定可见；它不能支持“流向图重开后视觉正确”。heat200/500可见热斑且边界裁切；heat-reopened截图为空白地图、指标为“－”并有保存成功toast，配合#29/30过早采样、#32才记录的后续HTTP，属于渲染完成观察不足，不能直接认定热力保存丢失或加载失败。

symbolic-verified-reopened可见局部截断圆，后续zoomout截图可见3个不同大小/颜色点；缩放记录scope为正常camera交互且未保存样式。它支持该时刻三点可见，不覆盖ubo错误、颜色/大小数值比例oracle、默认autoFit边距或保存后的camera一致性。

### CMV-N04｜P2证据方法残余：成功saveDisabled/重开树不代替完整持久链与独立runtime

saveDisabled=true、工作台URL、session变化、空clip和重开tree一起支持局部UI运行；本批缺独立原始save/findById载荷对照，未记录完整wire请求。后续正式AC验收须按UiIntegrationCases保留相应层的证据，不能复用诊断投影或本报告复算来填补。clipboard重开为空只证明这些退出/重开路径的局部清空，不等于TTL精确边界、登出/身份变化或跨上下文全验证。

### CMV-N05｜P3进度可读性：r009保留历史“尚未运行/失败”文字，需按时点理解

r009 limitations追加保留旧“坐标地图尚未运行”、bubble target失败、图片未完成等历史状态，再追加新结果，正文集合则已增加3类观察。保留旧失败是正确的，但没有每条显式历史标签时易被误读为当前矛盾状态。应在后续正常投影更新时标清“历史观察/当前处置”，不覆盖冻结原记录，也不将`target_attempt_failed_types=[]`解释为从未发生失败。该项不影响本批46+3集合算术。

以上为本轮全部发现；没有新增阻断r009局部观察记账的证据冲突。P1产品未决仍阻挡对应完整产品验收，不能被此有界PASS抹掉。

## 截图检查与独立摘要

全部截图均实际查看；初始图排除、稳定性限制及不同type证据没有混用。以下文件在本包`evidence/`，仅绑定当前字节，不从mtime推断运行时点。

| 文件 | SHA-256 |
|---|---|
| RuntimeCoordinate-flow-initial-r003.png | `0a669b6aea14b2ffaf74243e0ecddbaa751d3bc883a6d354024277f3e8864832` |
| RuntimeCoordinate-flow-reopened-r003.png | `089551b15e683b720f29789472cca76b743aa42f70e44c784523caf573e81978` |
| RuntimeCoordinate-flow200-r003.png | `f9fbe54402efffc452ffb21f811662c63bb7216e110c64e01c71b8c5efaac4d2` |
| RuntimeCoordinate-flow500-r003.png | `7db61044eaabe7e881e26e82df9277d090a68a7d0fd0e092757644a383608f2f` |
| RuntimeCoordinate-heat-reopened-r003.png | `d9c068374ba11e76514e57a17d23ab9c9258a7efd7a0e0b02e2156b691c77ded` |
| RuntimeCoordinate-heat200-r003.png | `3c39a81bb66a6da3ce05d85eaacace3067df9be096b120a3f6e40049b5ac3199` |
| RuntimeCoordinate-heat500-r003.png | `55ab4cf4a4a34ad6cc013dfe03480b1093a4fa88a53a52cb4f9eebbf7a7b2f68` |
| RuntimeCoordinate-symbolic-verified-reopened-r003.png | `3e4a5607857a08e67b2418d12361615a42298f95cf23538729421dbd210c5145` |
| RuntimeCoordinate-symbolic-zoomout-r003.png | `1dbddde201244e79b219667f84eb11e4711fe0091e202295cef646f9cbb1667b` |
| RuntimeCoordinate-symbolic200-r003.png | `28133407ae85c84580a17f1d86a9fdfc4d170e6b566e82d3071a61e1b4260f0a` |
| RuntimeCoordinate-symbolic500-r003.png | `15ef0e8370c2c8044c1896ec76617706f22b02253db0ccc0fd073d1cedb5a6db` |

## 已检查无问题及未检查项

已检查无问题：12项卡输入及r003附加ref摘要；CSV身份/行列/Decimal分组；两套200/500预期；68描述内部一致性；六次source→clip→target完整树相等；request逻辑投影和唯一匹配responseData；逻辑query1与物理HTTP分层；保存前/重开canonical树与clip空；symbolic首次失败排除；driver/draft更正、四条累计异常不重计；r008→r009三类增量及49元素集合；完整类型0和38总义务未提升。

未检查：本lane没有登录、点击、拖拽、修改字段/画布、发API查询、正常保存或数据库读写；不能称独立runtime。没有重新审查前46类全部原证据，也未重新证明字段地理语义修改前后30行保真（该fixture既有证据另负责）。没有检验所有49×49配对、真实权限、多用户、插件installed数量、TTL/拒绝/取消/失败/局部失效、导出/分享/嵌入/移动端或最终Goal closeout。没有复现ubo、修复details查询或补flow视觉/heat稳定重开；当前卡是证据审查，不授权这些产品/环境改动。

底图工具已有非阻断项不重开；底图正确配置也不代替三类图表全部语义。工作区其他产品修改不在本报告审查范围，未执行构建/安装/发布或触碰S01。只有指定报告为仓库输出，独立复算脚本/结果在tmp。

## 准入预测与下一步

r009可以继续以“49类均有双向局部观察，0类完成全量验收”汇报；本批无需重复已经有完整树/query/顶层oracle证据的六次配对来凑数量。下一工作优先填原P1负向及尚缺独立真实运行证据，并对ubo、details和flow/heat稳定画面按具体问题推进。证据不足处保持未观察，不提前定根因或通过。

若要提升到完整类型或对应AC通过，必须补足该AC原要求、当前可观察缺口和独立验证；特别是稳定重开渲染、明细/tooltip语义及异常处置不能仅靠已有局部成功推导。所有38义务、49完整分母和真实权限要求仍在，当前不具备MVP/Goal终态条件。
