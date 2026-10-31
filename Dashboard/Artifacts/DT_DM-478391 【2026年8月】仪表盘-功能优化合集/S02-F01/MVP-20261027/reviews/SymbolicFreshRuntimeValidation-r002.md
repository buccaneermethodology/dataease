# symbolic 同隔离实例正常 panel 退出重开独立验证 r002

- reviewed_at：2026-10-30T16:49:19.030308+00:00；reviewer/source：`/root/bubble_ready_validator_resumed`，非环境与 UI 执行者。
- snapshot_id：`S02-SYMBOLIC-FRESH-RUNTIME-VALIDATION-r002`；parent snapshot：`SymbolicFreshRuntimeValidation-r001.md`（SHA `594ea874269931656dc8f18e3bd0afe1d70aa108b4f69bf5a8a850f9c25a5365`）。
- as_of_state：Topology-r563，PID67055 已显式停止并 reap，8110 已释放；本 lane 只读审证据及当前 OS / 文件身份，不重新启动、连库或控制 UI。
- 预算：既有新源码隔离 runtime 包 **第2/3轮 delta**；环境设计第3/3轮冻结，不重开设计，也不重开 C2、原负向包或其它已耗尽评审。
- 卡 canonical SHA：`2c186e900b5f3a1ec221459cbb038b7eef21a9e338870771670883d06ba07037`；接收端 validate / render 通过，写前20处引用、19个唯一文件全部 SHA 匹配。

## 裁决与本次贡献

**BOUNDED_PASS（同既有 clone / jar 的正常 panel 退出重开局部证据有界通过）；新增阻断0，立即要求 Builder 改产品源码0，需要新用户 authority0。**

本轮以同一个已经保存过500条件的隔离 clone 和源码构建 jar 重启8110，通过新 owned context 的真实 HTTP 核数据、复制剪贴板、正常工具栏退出到 panel（编辑器 DOM 为0）再进入，同资源完整树保持且剪贴板清空。可以吸收 S039 E5 中“新环境正常 panel 退出重开”这一具体缺口，并缩小上一轮 SFRV-N03 的当前正常退出路径缺口。

**本轮没有新 Save / updateCanvas，也没有新 paste candidate。** 保存连续性只依赖上一轮同 clone / 同 jar 已验证的保存、本轮两次真实 find 和完整树逐字段相等；不能称“本轮保存通过”，不能拼接旧8100上的保存。它不是完整 symbolic 类型、全部 AC-MVP-F01-08/09/10、P1 或 Goal 验收。原 **38项义务（P1=12、P2=26）/49内置类型**不减，完整仍 **0/49**；真实权限 `BLOCKED/NOT_RUN`，插件 installed / loaded / eligible unknown。

## Delta 输入、执行前绑定与实际权限边界

本轮完整读取卡 / render、执行差异、前轮运行验证r001与环境设计r003、三份预检、startup、事件及汇总、cleanup、tool freeze、driver / watcher、admission / context、CSV、topology和两张原图。原环境设计与运行基础按 parent review 复用，历史缺口不被本轮名称重置。

| 卡绑定唯一文件（MVP目录内相对路径） | SHA-256 |
| --- | --- |
| `Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/Goal.final.json` | `4db931a6764a8c48345e7e8358e579550a9bc98594bf1654647716d72b9678c4` |
| `SymbolicPanelReopenExecution-r001.json` | `84a9b7fd457677c5af3923beaad18bc1f89d1199918fb85b2a73274b828dd0fa` |
| `reviews/SymbolicFreshRuntimeValidation-r001.md` | `594ea874269931656dc8f18e3bd0afe1d70aa108b4f69bf5a8a850f9c25a5365` |
| `reviews/SymbolicFreshRuntimeReview-r003.md` | `c4a8eede37b4cdba7e45414c56a1d77a35bec99fbf4e3232b33c4bd8add8c52b` |
| `evidence/SymbolicPanelReopenPreflight-r001.json` | `6f456c29681b7fcd8a54c0c991fff595dc4bc6038845d87de76518e7d8b5927d` |
| `evidence/SymbolicPanelReopenPreflight-r002.json` | `e82f2caa06ae405212ecc359afa908bdaac6fc78a8622af170746f64d96378f3` |
| `evidence/SymbolicPanelReopenPreflight-r003.json` | `cbb224993c5c203d3a4b4ccbcb411624c4b95f5de7abf35cbed019fe2968b812` |
| `evidence/SymbolicPanelReopenStartup-r001.json` | `1e2c06a3df21d436a35a49f9b1bbffc3d2759676377466aa0da87076d059b2fc` |
| `evidence/SymbolicPanelReopen-r001.json` | `77c7e111e4c2daa97001b0b4c95180cda7ef04a2ade64c5aa59bf48354e0c8ba` |
| `evidence/SymbolicPanelReopen-events-r001.json` | `be500587f14a2ca2c1ddf38ad81b82e14093e8546e5efe9255a89bd4ac03a62f` |
| `evidence/SymbolicPanelReopenCleanup-r001.json` | `fc5991e147c33d4cedea8f3a4262270ff2cb7f098f404df8fa1b614a82bf1ce7` |
| `evidence/SymbolicPanelReopenToolFreeze-r001.json` | `f0fd535344cd9588b11454a72a8d034063654f7aa2c0460e2ca0b59ff58ba264` |
| `runtime-state-tools/observe-symbolic-panel-reopen-r001.js` | `b89f7f470d8ce88f69b7958c3a86025bd6010b629abd29b103692b03d024be7c` |
| `runtime-state-tools/watch-symbolic-reopen-r001.py` | `30e5f8eeb5540f6e0b3160994177a9a0947b945b320af7024148b813240a92a9` |
| `Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/planning/symbolic-panel-reopen-admission-r001.json` | `3f1ebe13b7213093f6f24b0258da0843f4d49cba61da6be3fbd2f0e716e83e79` |
| `runtime-fixtures/TeaMaterialExtended-r001.csv` | `abc8bed0862129d58724bcefff2563862e48d1ea057365ae8d5d2c853e64472b` |
| `Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/planning/Topology-actual-r563.json` | `b444ff186220b1915b5afd069ac1746c739611805fe662f5803c9eadcbee5b6e` |
| `evidence/SymbolicPanelReopen-before-r001.png` | `c070510c9e5e04fc0524e9538220332d300a255967d15d6a4beaa89858c4982b` |
| `evidence/SymbolicPanelReopen-after-r001.png` | `c070510c9e5e04fc0524e9538220332d300a255967d15d6a4beaa89858c4982b` |

同轮补充 / 条件扩读（未重写卡和冻结证据）：

- `evidence/SymbolicPanelReopen-NativeRouting-r001.json`：`879f64ed8e3892f86f84886fa8842a9e3320803cc6611c3addd29dcc5946db29`。
- `Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/planning/ContextBootstrap-SymbolicPanelReopen-r001.json`：`a2f6fbd0b8cd18449d4ca855fbf43bbcea34b2dde0deba863a1b2452e05a45f1`。
- `fresh-runtime-tools/watch_runtime-r001.py`：`2ae64c969cc39e7034d8c9ec9f780ece6fd7b673ee0e82c0a257db564d5cb3bf`。
- `evidence/SymbolicFreshUi-wire-r001.json`：`96d476d3210316c896100f431557a7f00b139f971c1ab3c633d8f1a9a5a7a03a`。

admission 为 approved，issued_at=`2026-10-30T16:34:14.099529+00:00`。Goal、completion_contract、context、design_review、topology 五条依赖摘要独立重算一致。其 canonical target `local://127.0.0.1:8110/s02_symbolic_20261029/start-and-identity` 仍带旧的 `start-and-identity` 尾名，**名称没有完整表达 UI 退出重开**。但本次绑定 context 的 objective、write_scope、output_ref 和执行差异明确列出“同 clone / jar 重启、新 owned context 正常 panel 退出重开、回收新PID”，地址与 schema 未变；据完整绑定内容可将本局部 UI 链纳入已声明范围。保留旧尾名为非阻断描述限制，不逆写输入，也不将其解读为其它环境或任意 UI 写授权。

本 lane 未读私密 YAML / dump / 登录内容、认证headers或导出的认证信息；未连接 DB、执行 GRANT / drop / reclone、改变原进程或产品源码。只对私密 root / YAML 检查 mode 与 symlink 元数据。原元库的正确历史边界仍是“此前准备阶段只读，无本任务业务写”；不能照旧误措辞说原库从未读过。

## 同 clone / jar 与三次预检分层

当前 jar 实读 SHA 为 `f653667d94fe3a20e9acdf2fc1bf128ef5b58c9db3181aec29ba2c363fd840e4`，与前轮及本轮 startup 一致。独立逐内容比对 jar 的 BOOT-INF/classes 与原构建 target/classes，**598个.class全一致**；BOOT-INF/lib 与任务 tools/lib，**292个.jar全一致**。这证明当前构建输入一致，不自动证明历史每时点或运行中 Bean getter。

- r001（16:34:48.869018 UTC）：NOT_READY，jar / class / lib / 私密路径等已过，producer 的 port mapping 未初始化；保留 `PRODUCER_PORT_MAPPING_NOT_INITIALIZED`。这是预检 producer 错误，不是产品运行失败。
- r002（16:35:22.229123 UTC）：NOT_READY，原8100/7070、8110free及20项配置双读模型通过，连接探针报 RuntimeError；r003保留说明为沙箱 `Operation not permitted`。不把它改说数据库拒绝或产品失败。
- r003（16:36:16.832305 UTC）：同只读探针经授权宿主执行后 READY；metadata_config_actual_connection、core_datasource、core_de_engine 均指向新 schema `s02_symbolic_20261029` / 3307，唯一 source `985188400292302848`、engine `1313535945320042496`、task=0、19字段。该 DB 身份来自绑定记录及前轮工具审查，本 lane未重连 DB；metadata 项仍是同配置真实 JDBC，**不是运行中 Spring Bean 内部 getter**。

watcher 与前轮 `watch_runtime-r001.py` 独立逐字比较，仅执行差异声明的四处 literal 槽位名称替换；还原后其余源码完全相同，原SHA `2ae64c969cc39e7034d8c9ec9f780ece6fd7b673ee0e82c0a257db564d5cb3bf`。保持 env 白名单、同私密配置、同 jar digest、loopback8110、唯一 Popen 进程组、stop / TERM / reap逻辑。root=0700、config=0600且非symlink，当前元数据核对一致；没有读取内容。900秒lease为本次执行参数，cleanup elapsed约220.775秒，未触发超时或KILL；不宣称本轮重演全部watchdog模拟。

startup记录16:39:04.329922 UTC，PID67055，started=true/error_count=0；这是启动层，正式业务证据另行核对。

## Native 路由补证及时间上限

补充 NativeRouting-r001 是**执行后提取**，不是预冻结的新route源。本 lane只在内存比对native指定原行（含换行）SHA、call_id、timestamp及允许代码的JSON转义精确substring，均匹配；没有输出或复制同cell后续登录片段。

- native第99767行 / `call_d66dc28075f74cd2b94141e57de2cfa9`，timestamp `16:37:57.659Z`：允许前缀先创建新context/page，再安装context局部route；7070的`/api/`请求固定转发8110/de2api（/api/f/按既有映射），`maxRedirects=0`、3xx拒绝，失败abort，无8100 fallback。业务记录开关初始false，白名单只有getData/findById/updateCanvas，随后首goto/login不导出。
- native第99785行 / `call_ae0871d32c914afc831b275fcefc5793`，外层timestamp `16:39:32.528Z`：正式driver调用从本地读取文件与freeze，并在执行前核SHA，不匹配即throw。driver中正式启用业务记录，finally关闭ownedcontext及page后写新slot。

两段code SHA分别为 `689c69a08890fb14e2daddfef9d2ad74fa2b49425a6c4d4eb5d69527e3662c8a` / `81213bf604113adbecec455fd5fe5ad9f704189c4e74fbe1bf87441a1e17ce68`；native整行摘要见补充JSON。本 lane已核原行和提取值，但认证片段不进入报告。

**时间标记限制**：ToolFreeze.at=`16:39:32.677533Z`晚于外层native timestamp约149ms。该timestamp属于外层functions.exec调度，不能当作nested driver实际发送时刻；同wrapper先await创建driver/freeze，再调用write_stdin，正式events.startedAt=`16:39:38.291Z`且调用内校验freeze。支持“正式case开始前已有冻结与执行前digest校验”，**不写freeze早于外层native调用timestamp**。不为这一标记差异重跑产品或开启新评审。

新包新增method=POST与可定位native route，补强前轮N02部分缺口；仍没有持久化headers / socket serverAddr，不独立证明每个网络hop或全部Axios/HMAC头逐字节保真。该限制不妨碍下列响应数据与完整树复算，也不倒改前轮报告。

## 原始 HTTP、CSV 与完整树独立复算

独立脚本 `/private/tmp/verify-symbolic-panel-reopen-r002.py`，SHA `ae62323b08471098b692b26ef2a572ba123060606159250b0324d07641dd774f`。最终退出0，**269/269证据断言通过**，不是产品测试数量，也不是本 lane 独立runtime重跑。脚本首次将find返回的canvasViewInfo错误假定为JSON字符串而报TypeError；确认原件实际为dict后仅修正检查器读取shape，重新通过，未修改被审事件、删字段或归一化预期。初始检查器失败不作产品失败，保留该诊断。

CSV按UTF-8 BOM读取30行/19字段/30唯一ID，Decimal执行原始递归AND/OR树：amount>500 AND六店。命中ID为 **3,5,11,13,16,18,21,25**，8行，总额 **5093**。两次symbolic查询均针对chart `7520741153101058048`、dataset `1312472054565572608`，完整customFilter等于诊断copy的树。

| 坐标组 | 合法匹配代表ID / 店铺 | 独立CSV组金额 | 组行数 |
| --- | --- | ---: | ---: |
| 118.7969, 32.0603 南京 | 3 / 果元店 | 1982 | 3 |
| 120.1551, 30.2741 杭州 | 5 / 南都店 | 1243 | 2 |
| 114.0579, 22.5434 深圳 | 13 / 果元店 | 1868 | 3 |

每组集合唯一且完整、details恰1代表，代表确在过滤后的同坐标组内。按response detailFields映射逐项核id、shop、purpose、province、series、日期、quantity、open/close/high/low/target及end坐标等；details.amount和顶层amount均等于组聚合，**不是代表原行金额，也不是完整明细行列表**。没有用顶层合计替代代表过滤真实性。

本窗口 **10条业务wire：2 find + 8 getData**；其中symbolic2条，其它图6条。全部为POST、HTTP200/business code0，upstream均固定8110；没有updateCanvas，不以其它图请求认定其它型通过。

| wire序号 | 时点（UTC） | 证据 |
| --- | --- | --- |
| 0 | 16:39:38.968 | 第一次同resource/snapshot find |
| 4 | 16:39:39.639 | symbolic500，三组及代表如上 |
| exit | 16:39:41.781 | 正常.back-icon后panel URL，diagnostic与back-icon均hidden，editorCount=0 |
| 5 | 16:39:41.936 | 第二次同resource/snapshot find，在exit之后 |
| 8 | 16:39:42.363 | 重开symbolic500，三组及代表一致 |
| context close | 16:39:46.043–46.071 | owned=true，contextClosed/pageClosed=true |

两次find中symbolic和indicator `7520752064427724800` 的**完整customFilter对象**逐字段相等，数组顺序、null/空串和嵌套字段保留；并与前轮同8110包唯一updateCanvas的保存载荷完整树相等。两份新find不是旧8100拼接。

四份descriptor（before.source、copied.source、copied.clipboard、reopened.source）的tree / ownKeys / undefinedPaths完整一致，ownKeys从原树递归重建相符，undefinedPaths均为空。copy前clip=null，copy后有500树、正确tableId/revision；正常离开再进入后clip=null、pasteReason=clipboard_empty，editSessionId由1变3。不是仅hash切换后诊断仍留存的旧尝试。

## 实际图像与清理读回

两张原PNG已实际查看，均418×316、8-bit RGB；CRC/zlib可解码，字节SHA相同（见清单）。画面有本地测试网格、大蓝圆/青圆和小绿点，说明当前前后画面一致；**上下边缘圆仍被裁切**。不据此声称默认camera完整显示三圆、颜色/大小比例或完整视觉AC通过，也不把图像一致当成query / 代表正确性的替代。

cleanup记录16:40:40.129478开始，16:40:40.264511结束，explicit_stop、TERM=true、KILL=false、PID67055已reap、returncode143、error_type=null。进程槽位版本化，未覆盖前轮attempt。当前独立lsof与PID存在性核对：8100仍PID81808、7070仍PID2967、8110无监听、os.kill(67055,0)为ProcessLookupError。当前状态不倒推出全过程旧服务配置从未变化。

owned clone、新schema授权及私密材料按前轮计划保留；本次未reclone/drop/revoke，不称完整回退原环境。pageErrors=[]只证明该pageerror监听窗口；不能关闭历史ubo、C2V-005或全部console/resource异常。

## 全部发现、未检查、同类残余与准入预测

新增blocking=0。非阻断发现与保留边界一次列全：

1. **SFRV-R2-N01：admission尾名落后于实际明确范围。** 绑定context/execution明确UI链、实际地址与schema一致，故当前局部可吸收；尾名仍start-and-identity，不能把标识本身当作完整UI授权或最终验收证明。以后新projection应准确描述，不改旧冻结输入。
2. **SFRV-R2-N02：无新Save、无新paste。** 本轮只补已保存配置的refresh/copy/正常退出重开；先前同clone/jar保存树连续性成立，不能声称本轮新增save或paste candidate成功。
3. **SFRV-R2-N03：native补证和冻结时间标记上限。** 提取是执行后，外层timestamp早于freeze约149ms；按上述执行顺序和case开始区分，不能编造更强历史时序。仍缺headers/socket事实，不提升完整transport保真。
4. **SFRV-R2-N04：裁切与错误面残余。** 两图前后相同而边缘圆裁切，pageerror空不等全错误清除；保留原N04及旧ubo/C2。

前轮SFRV-N01（历史DDL前后未保存）、N05（de_template_version NULL行未入保护hash/无序CLI bytes）、N06（“未读写原元库”措辞过强）原样保留，不因本轮未重建环境而关闭。N02仅增加method和可定位route证据，剩余头/socket边界仍在；N03的**本轮正常工具栏退出→panel→再进入**已有新证据，旧hash-only失败事实不抹掉，TTL/登出/身份变化/所有导航路径仍未由此全证明。环境设计3/3与其它模块已耗尽预算不变。

已查无问题：卡/全部绑定摘要、admission五依赖与context范围、同jar及598classes/292libs、四literal watcher差异、三预检分层保留、实际新PID/清理与旧PID监听、仅新context真实8110路由/失败无fallback、10条原始响应与method、两次symbolic逐CSV同组代表与聚合、完整descriptor、两次find及前轮save树连续性、panel editor0/clip清空/newcontext关闭、两PNG结构与实际画面。

未查及原因：本lane未登录/运行浏览器/发HTTP/连DB、重演GRANT或全部启动迁移、运行中Spring getter、watchdog KILL/父SIGKILL/系统崩溃、完整传输headers/socket、真实权限/其它49类型/复杂负向/TTL/分享嵌入/生产环境/最终KB-Dashboard-full-diff-closeout。该卡是现有运行证据的只读delta验证，历史缺项不能事后补写为原始事实；没有把未检查写为通过。

准入预测：**可以吸收S039 E5当前正常panel重开局部结果，无需为同两次正确数据机械再跑或追加确认轮。** 本轮仅2/3运行验证，不能用余下预算迫使无差异重复；若实际新增合同内修复或证据变化，再按delta决定。保留原38/49、0/49、真实权限和插件unknown，继续其它原未完成动作。本报告不是最终Goal / Stop Gate或post-closeout绑定，不替主Agent改共享状态与原历史报告。
