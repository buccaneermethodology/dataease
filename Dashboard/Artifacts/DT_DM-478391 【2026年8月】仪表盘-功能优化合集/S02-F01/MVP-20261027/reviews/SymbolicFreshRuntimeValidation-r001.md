# 符号地图新环境与实际运行证据独立验证 r001

- reviewed_at：2026-10-30T06:13:27.490919+00:00；reviewer/source：`/root/local_basemap_reviewer`，非本批环境/UI执行者。
- snapshot_id：`S02-SYMBOLIC-FRESH-RUNTIME-VALIDATION-r001`；as_of_state：Topology-r534、准备/授权/启动/UI/清理材料已冻结，新实例已停止；本lane只读审证据、独立复算和核当前OS监听，不重跑应用。
- 实现证据独立Validation **第1/3轮**；环境设计3/3已冻结，不重开设计预算。
- 卡canonical SHA `9af511927fcae2be7a4b31eebc440485b8454dd681356794d407251c804dbc01`，接收端validate/render均exit0/PASS；Goal+18 base refs共 **19项** SHA全部匹配，写报告前复验未漂移。
- 仅写本报告与允许的tmp复算材料；未读私密配置/密码/AES/dump内容，未连接DB、启动应用、执行GRANT、修改源码或冻结资产。私密路径仅核文件mode/symlink元数据。

## 裁决与本批证据上限

**本批新实例局部运行证据：PASS WITH FINDINGS（有界通过并保留缺口）。新增阻断本批局部记账的问题：0。symbolic完整类型、相关全部AC、真实权限、MVP和Goal验收：仍未通过。**

独立CSV/完整过滤树复算支持：新源码临时clone中，四次symbolic业务响应的三组顶层金额与代表身份均符合当前200/500阈值和六店条件；代表从旧的3/2/1变为本批3/5/13，后两者不再是过滤外店铺。一个indicator500→symbolic200的paste窗口有1次逻辑query及对应真实记录响应；一次updateCanvas成功后，完整hard reload的findById读回两棵过滤树与保存载荷逐字段相等，clipboard为空。

以上是**执行者采集证据的独立审阅/复算**，不是本lane独立登录、点击、保存或runtime重跑。route记录缺完整method/headers/serverAddr和冻结route源，DDL历史前后原快照缺失，metadata连接探针也不是运行中Spring Bean getter；这些缺口按下文保留。不能把有界PASS压缩成全环境协议完全证明、浏览器全无错误、原ubo已修复或完整类型完成。

Goal ledger现场重读为38项；49类型完整分母不变，0/49完整类型的既有边界不提升。真实权限仍standalone+DEV桩，其他图表/C2/稳定重开等原残余不由本批关闭。

## 独立复算、完整树和实际截图

独立检查器：`/var/folders/l1/r6bpxxvj087bgky2q98zlqvh0000gn/T/s02-fresh-evidence-independent-m_xaeb68/verify-r002.py`，SHA `a0a1bec0de3c13d4214f0050c0da879506e67bf31e870163444e115673cb211d`；结果`results.json`，SHA `943ed193385a909049fc1dc3ffbdea3631654e704f567a6ff5608ea6d7079f4f`。只读冻结CSV/JSON并写tmp，不运行会重写SymbolicFreshUi-r001.json的producer checker。

CSV独立解析为30行、19字段、30个唯一ID。用Decimal和请求中的完整递归and/or树计算，结果同时与固定六店/amount>threshold语义核对；expected不来自chart响应。

| wire序号 | 场景/阈值 | CSV命中ID | 总额 | 南京 / 杭州 / 深圳 |
|---|---|---|---:|---|
| 4 | 初始500 | 3,5,11,13,16,18,21,25 | 5093 | 1982 / 1243 / 1868 |
| 5 | 正常更新200 | 3,5,11,12,13,14,15,16,17,18,20,21,23,25 | 6761 | 2676 / 2217 / 1868 |
| 6 | paste采用500 | 3,5,11,13,16,18,21,25 | 5093 | 1982 / 1243 / 1868 |
| 12 | hard reload后500 | 3,5,11,13,16,18,21,25 | 5093 | 1982 / 1243 / 1868 |

四次均HTTP200/code0、目标chart `7520741153101058048`、dataset `1312472054565572608`。每次坐标组集合完整、无重复，每组恰1代表，ID均为南京3/杭州5/深圳13，分别果元店/南都店/果元店；ID在同组匹配行中，shop及purpose/series/quantity/province/end_city等可直接对照原始字段一致。代表amount等于组聚合而非其原行金额，保留现有输出语义；没有把单代表改说成完整明细列表。

paste窗口为wire[6,7)，queryObservation.outcome=success、logicalGetDataCalls=1；其request的id/type/render/tableId/customFilter投影与wire6相等，responseData与HTTP **body.data.data**完整相等。诊断源码observeMvpPasteResponse保存的是图表data对象，本报告没有把它冒充整份HTTP DTO；clipboard额外tableId/createdAt/revision与树描述不是同一比较层。实际比较source与clipboard的tree/ownKeys/undefinedPaths三项完整描述均相等，并确认indicator wire1的完整500过滤树就是clipboard树。目标wire5确为200，避免把已有500当paste成功。

独立检查器初始曾误将clipboard生命周期字段混入source描述比较、将诊断data对象与整DTO比较；核实际shape及源码后纠正检查器，未修改被审JSON、删除树字段或归一化预期。最终检查无失败，精确比较对象和上限如上。

### 保存与hard reload

- wire7：05:28:24.754Z，dashboard `1312476889213964288` 的updateCanvas，HTTP200/code0，保留实际request/body。
- wire8：05:29:20.715Z，同dashboard的findById，HTTP200/code0；读回canvasViewInfo解析JSON后，symbolic `7520741153101058048`、indicator `7520752064427724800` 的**完整customFilter对象**均与保存载荷相等，未删null/空串/嵌套字段，数组顺序保留。
- hard_reopened500标记05:29:23.611Z、wire[8,13)，确有新的findById与四个getData；诊断源树等于保存树，clipboard=null，revision回到0。
- reopened500的hash-only窗口[8,8)没有新请求，clipboard仍500、editSessionId仍1；原driverFailures和route_only_reopen_limit明确排除它。hard reload是另一个成立证据，不追溯改写hash-only尝试。

### 截图实际查看

两张绑定图均1280×900，已实际查看而非只核文件存在：

- hard-reopened500（SHA `f415d3818176d9b2b70ad51d7fd92a786a2e1e44d6062cd01779918e132cb322`）显示网格/部分圆、5093指标、standalone DEV测试桩与“尚未复制过滤条件”；边缘圆被裁切，不能称默认camera完整可见。
- three-points（SHA `671b477364203801353749a2985fc590e39af93be19b90fd320622893f6e3b5a`）显示网格、两个较大圆和一个小绿点，longitude/latitude/city/amount合法轴及5093指标；支持该画面三点可见，不证明颜色/大小比例、camera持久一致或所有视觉AC。

占位图片和底部大叉也可见，符合“未复制图片资产、不验收图片”的限制。截图不用于替代代表CSV核算、权限或全部渲染生命周期验证。

## 环境、授权、启动与清理核验

准备记录r004保留72张dump表的行数、19字段/固定table身份、受保护读取结果hash、2+1+1精确删除rowcounts和COMMIT confirmed；脚本只对owned新schema删除两个source、唯一engine及固定Demo marker，未走通用Datasource删除API。unicode BLOB、表名排序、binary hash三次准备失败均有独立文件保留，owned clone恢复不被伪装成首次全成功。

ReadModels报告的20项检查均true，实际helper源SHA与报告一致，使用ConfigUtils及Spring YAML同一文件；watchdog源码允许env白名单，排除了SPRING/JAVA_TOOL_OPTIONS等继承覆盖，私密user.home和同配置路径与r002相容。它证明文件双读模型，不等于全运行中Environment审计。

首次child43384无库权限退出、returncode1且reap，attempt归档runtime.log摘要与Failure-r001相同。GrantPreflight记录MySQL8.4.11/partial_revokes=false/准确CURRENT_USER，目标grant基线空；Grant记录18项数据库级权限、escaped schema、grantable=false、其他schema授权未变及实际应用连接新库。原post-GRANT检查器因未用--raw误判转义，修正只读checker后确认，没有重复GRANT；只读核源码支持这一处理路径，不冒称本lane重新查询权限表。

新child44421于05:23:53Z启动，Startup-r002于05:24:36Z记录ready、新jar SHA `f653667d94fe3a20e9acdf2fc1bf128ef5b58c9db3181aec29ba2c363fd840e4`、startup_error_count=0。FreshConnectionIdentity源码确实对新配置/新生成source/engine使用DriverManager执行DATABASE/@@port/CURRENT_USER，检查mysql/非SSH、唯一source ID、唯一engine、task0及19字段。记录三者均新schema/3307/既有账号，engine为新ID `1313535945320042496`。**metadata项是相同配置的真实独立连接，不是运行中Spring Bean内部getter**；不把该限制隐藏。

watchdog四种sleep模拟记录stop/error/TERM/timeout均reap；本次实际cleanup记录explicit_stop、TERM=true、KILL=false、44421 reaped、returncode143，elapsed约419.976秒。模拟未实际走KILL升级或不可捕获父SIGKILL，不声明完整OS故障恢复能力。

本lane另于 **2026-10-30T05:42:34Z** 只读OS核对：8100仍由java/PID81808监听，7070仍由node/PID2967监听，8110无监听；os.kill(44421,0)返回进程不存在。私密root=0700、YAML和dump=0600且非symlink，仅查mode未读内容。OS结果`os-readback.json`位于上述tmp目录，SHA `613fc8cba81fd7d8b19425e74a182341eb14baf2eb2dabba96ec1eea46bf6b3e`。ps受沙箱限制未运行成功，未申请升级，使用lsof和PID存在性得到当前状态。当前readback不倒推出全过程原服务配置从未变化；与已有原PID身份/受限脚本一起支持本批清理边界。

新schema、授权和私密材料按计划保留，不称环境完全恢复原态，也没有自动drop/revoke。

## 全部发现、严重性与处置

### SFRV-N01｜P1协议证据缺口、对本批局部结果非阻断：历史DDL前后快照未保存

Preparation-r004明确`source_ddl_before_after_equal=null`，另有当前源CREATE定义与冻结dump相等。源码支持当前比较，但不能重建最初dump前后的历史字节；“执行过guard”的自报不是独立历史证明。保留null和ddl_evidence_limit是正确处置。本批fixture数据/业务响应可独立复算，故不否定局部修复结果；不能声称r002所有时间点协议均有完整可复验证据或全库历史字节等价。

### SFRV-N02｜P2 transport证据上限：缺method/headers/serverAddr及冻结完整route源

13条记录均有original/upstream/status/request/body，逐条URL重写与固定8110一致，但没有保存method、HMAC/auth headers、实际socket serverAddr或完整已执行route源。root确认执行源存在于原聊天tool输入，未冻结；本lane不补造、不把upstream字符串当socket独立证明。因此支持执行者采集的真实业务响应和tree核对，**不独立证明每个网络hop、完整wire字节或所有Axios/HMAC头逐字节保真**。最初glob误匹配/src/api的失败保留，不删除它后假称路由从无错误；修正pathname guard后正常业务证据单独成立。

### SFRV-N03｜P1产品残余、对本批记账非阻断：hash-only退出/重开没有生命周期完成证据

hash-only导航后clipboard及editSessionId保持、没有新请求，不能算正常离开重开或退出清空通过。hard reload确实证明本轮正常updateCanvas后的持久树读回和reload清空，但不替代所有正常导航、退出编辑、TTL、登出/身份变化或跨context清空原要求。现有资料不足以把hash-only行为定为已复现产品缺陷或已关闭；保留该路径未验证，不自动关闭AC-MVP-F01-09/-10/-12。

### SFRV-N04｜P2视觉/异常边界：本批pageErrors空不关闭历史ubo

冻结pageErrors为空、相关marks.errors为空，只支持本批采集窗口没记录到pageerror；不是全部console/resource错误都不存在。默认重载截图边缘圆裁切，随后三点图不证明camera与全部视觉oracle。图片资产缺失、原4条ubo、flow/heat稳定画面与渲染生命周期仍独立保留，不由本批无ubo观测冲销。

### SFRV-N05｜P2保全hash覆盖限制：de_template_version的NULL版本行未进入保护投影

prepare-r004.table_hashes对de_template_version使用`WHERE version <> '985188400292302848'`；SQL会同时排除version为NULL的行。且SELECT *没有ORDER BY，因此hash是本次CLI读取结果bytes，不是全库物理字节或全行顺序无关的canonical digest。本次精确DELETE只匹配固定非NULL version、无触发器前提及业务结果没有显示额外行被改；故不判定实际误删。但“所有非目标行都由该hash覆盖”强声明不成立。若以后维护此机制，需显式覆盖NULL与稳定排序，新版本处理；不重写本次冻结hash来伪造历史保全。

### SFRV-N06｜P2措辞需在下一投影澄清：准备claim不应写“未读写原元库”

Preparation-r004.claim字面为“未读写原元库/服务”，但方案和脚本确实对原schema执行只读dump、DDL/元数据读取。正确边界是“原元库只读、无本任务业务写；新库有准备和启动写；原服务进程未改”。保留原冻结JSON并由后续projection引用本更正，不为改措辞覆盖历史。该错误不证明发生原库写入，也不能拿它作“原库从未被访问”的证据。

**本轮blocking=0；需要Builder立即改产品源码项=0；需要用户新authority项=0。** 六项一次列全，未在首个缺口停止。修复当前语义应主要落在新projection/证据上限，不要求为补不存在的历史字段重启已清理的实例。

## 已检查无问题、未检查及准入预测

已查无问题：19绑定摘要；38项ledger；新固定配置/read-model与env白名单边界；精确clone元数据删除/失败恢复/授权转义与raw读回脚本；首次attempt归档hash；源码jar/新PID/三类真实独立JDBC连接及其上限；全部13条业务HTTP200/code0和URL对；四次完整过滤规则独立CSV/Decimal/同组代表/聚合/原字段；一次paste完整树与1逻辑query及data对象精确匹配；save→findById完整customFilter相等、hard reload源树与空clip；两张图实际画面；当前旧服务监听、新PID消失/8110释放；原失败和未观察没有被吞掉。

未检查：本lane没有重新运行UI/正常保存/数据库查询、权限表或运行中Spring Bean探针；没有读取私密dump/配置/log原文；没有重演watchdog KILL/父SIGKILL或全部startup migration；没有独立重审其他49类型、真实多用户/行列权限、复杂过滤/TTL/拒绝/取消、导出/分享/嵌入或Goal最终closeout。原因是本卡是只读实现证据Validation，实例已清理，缺失历史字段不能通过事后补写变成原始观测。

准入预测：可以把“symbolic代表过滤修复在新源码clone的本批真实业务响应/CSV和保存后hard reload中获得局部证据”记入执行Dashboard，并继续既定未完成AC/独立真实运行工作；不需要为相同四次成功数据凑重复测试。保留N01–N06和原完整分母；不能将本报告写成独立runtime重跑、symbolic全类型通过或完整MVP/Goal完成。后续若提升正常退出/全视觉/权限或最终状态声明，按对应原合同补真实证据，而非提升本有界PASS。

## 正向阅读清单与输出保全

完整读取本卡/render prompt、绑定Plan-r002/GrantDelta-r003/Review-r003/Topology-r534、Preparation/ReadModels/Watchdog/Failure/Grant/Startup/UI/wire/Cleanup、FreshConnectionIdentity、producer check-ui-csv、固定CSV；实际查看两张图。扩读watch_runtime、ReadConfigModels、prepare-r004、grant-exact-schema/grant-readback源码、三次准备失败、grant preflight和attempt archive；按源码核诊断responseData及clipboard形状（mvp-chart-filter-copy、useChartFilterCopyMvp、views/index调用点）。未运行producer checker或任何DB/UI脚本。

写前19项输入未漂移、输出路径原不存在；只新增本报告。独立tmp产物可被系统清理，不称永久证据库；根Agent应按本报告实际摘要绑定后续状态，保留本审阅时点和后续进展的单向关系。本报告不构成最终KB/Dashboard/full-diff/post-closeout或Stop Gate终态绑定。
