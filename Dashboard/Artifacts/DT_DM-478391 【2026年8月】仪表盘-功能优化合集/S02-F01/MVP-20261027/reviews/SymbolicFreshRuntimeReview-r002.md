# 符号地图新源码临时运行环境计划独立审查 r002

- reviewed_at：2026-10-30T04:59:12.376619+00:00；reviewer/source：`/root/local_basemap_reviewer`；snapshot_id：`S02-SYMBOLIC-FRESH-RUNTIME-REVIEW-r002`；Session：`DE-EXEC-S038`。
- as_of_state：Plan-r002及Topology-r525为当前设计；r001及首轮审查原字节保留。**尚无新schema、新私密运行根或新Java实例**，本lane未操作DB/UI/环境/source。
- 同一环境方案累计 **第2/3轮**，不重计其他交付物预算。接收端card canonical SHA `6f3949523027efada0bb1404d19b0468a9691c33bafc70294f74beae6501724f`，本地validate exit0/PASS。Goal+10 base refs共11项SHA全部一致，写报告前复验未漂移。
- 仅新增本报告；未读取私密配置值、旧连接ciphertext或凭据，未执行删除/导入/启动/网络转发，也未改变原8100/7070。

## 双裁决与结论

**Design Freeze Validity：PASS WITH FINDINGS（方案边界通过，保留两项非阻断执行澄清）。Implementation Entry Readiness：PASS（分阶段，实际前置仍须fail closed）。Overall Verdict：PASS（本环境设计有界通过）。**

**首轮B1/B2在设计层关闭，新增设计blocker为0。** r002可以作为受精确admission约束的副本准备、启动核验和真实UI验证输入；不要求为了同一设计重复第三轮，也不要求新增人类授权。脚本、私密配置、事务转换、watchdog、进程和route的实际执行成功仍未发生，不能由本报告预填PASS。

r002:7–35明确替换了r001中冲突的配置与连接边界，尤其**不再允许原分析fixture库作为运行例外**。r002后附r001为历史基线；原jar身份、正常Axios/HMAC、真实数据oracle及声明上限继续继承，旧“首轮1/3”和“原分析源SELECT例外”不再是当前执行入口。

## 首轮全部发现处置

| 首轮编号 | r002处置与本次复核 | 裁决 |
|---|---|---|
| SFR-R1-B1 固定home配置绕Spring | :7仅新Java-Duser.home，固定home/opt/dataease3.0/config/application.yml与Spring显式同文件；实际ConfigUtils与Spring YAML两读模型逐项路径比较，回落/逃逸拒绝 | **设计层关闭**。新Java参数必须在类/initializer加载前生效；不是修改shell HOME |
| SFR-R1-B2 全量pool/未知engine外连 | :9–27选定clone-only精确2source+1engine+1Demo marker删除与正常重建，不再采用旧源访问例外；启动后核三条实际连接同一新schema | **设计层关闭**。两条source和唯一engine均被覆盖，未遗漏独立engine分支 |
| SFR-R1-N1 font/tmp/路径遗漏 | :29逐项font/substitule/share-secret等完整key，绝对任务根；i18n/file与engine/JDBC路径单独处理；cwd私密并预建null/；拒绝symlink/escape | **设计处置完成，实际路径待验**。不假设-Dtmpdir可覆盖CoreApplication |
| SFR-R1-N2 watchdog | :31唯一Popen/新组/单调计时，正常stop/异常/TERM/INT/timeout进入finally，TERM10秒→KILL→wait/reap5秒，模拟sleep测试；明确SIGKILL残余 | **设计处置完成，实际模拟/launcher待验**。时间边界说明见本轮N2 |
| SFR-R1-N3 真实转发/首次XHR | :33首次goto前唯一context route，/api/f优先，真实8110、保method/编码/body/认证HMAC、禁未知redirect/原8100fallback，不存公开token | **设计处置完成，真实route/HTTP待验** |
| SFR-R1-N4 快照/转换/启动delta | :15–23 dump单行INSERT计数与clone COUNT、DDL指纹、所有权/固定目标/事务行锁/精确rowcount/unknown commit不重试；:35分层对账 | **设计处置完成，实施待验**。计数证据不升级全库字节等价 |

## 精确clone转换与正常重建核查

选定删除集合唯一且有界：

- core_datasource ID `985188400292302848`、`1308230587517112320`，type均mysql，expected rowcount=2。
- core_de_engine ID `1307768503922724864`，type=mysql，expected rowcount=1。
- de_template_version中`version='985188400292302848'`恰1，expected rowcount=1。

r002先在同一连接确认`@@port=3307`、DATABASE固定`s02_symbolic_20261029`和任务创建manifest，核私密snapshot一致，锁定全source/engine集合及目标marker；只在精确集合相同后删除，检查总数0和fixture摘要不变才COMMIT。显式if/raise不受Python -O影响，rowcount、重复/额外行、备份/所有权不符、unknown commit均fail closed；独立读回三项0后才允许下一阶段。原schema和全局数据库权限没有被纳入写域；不使用可能联动引擎数据的通用Datasource删除API。

当前源码`EngineManage.initLocalDataSource()`先检查固定ID+createTime Example及Demo version标记；**source和marker同时为空**且非desktop时，确会从当前Spring datasource生成同ID Demo，调用innerSave写clone元数据，再写Demo标记。`initSimpleEngine()`先调用上述方法，随后若无非H2 engine，会用同一Spring URL解析结果创建默认engine；它的新Snowflake ID/时间是允许的启动delta，不要求等于已删除旧engine行。

`DataSourceInitStartListener`先initSimpleEngine再initConnectionPool，因此删除所有旧source/engine后，该pool没有原额外连接配置可复用。`CalciteProvider.initConnectionPool`仍会选全部数据库源与engine；r002没有虚构“它已被禁用”，而是将会被选中的元数据改为任务新库内的正常生成结果。启动后严格核只存在固定Demo mysql、一个mysql engine、额外源0/task0，并私密验证Spring metadata/fixture/engine三者最终DATABASE和loopback:3307；未知或原库目标立即停新进程，且UI业务在核验通过前不开始。

物理fixture表、dataset `1312472054565572608`、table `7520739241744142336`、dashboard `1312476889213964288`、19字段ID/类型/role、30行数据及chart树均独立于这四行准备删除。旧连接配置无需解密；正常启动新生成配置的私密读取仅用于目标核验。若实际新Spring URL解析/权限/正常重建失败，记录失败并停受影响入口，不手工伪造就绪、不扩大删除集合、不退回旧源。

## 本轮全部发现与执行澄清

### SFR-R2-N1｜P2 非阻断：文件双解析不等于Spring全部高优先级配置已排除

r002的同文件ConfigUtils/Spring YAML解析能关闭首轮固定路径分歧，但Spring实际Environment还可受环境变量、系统属性、命令行及其他location覆盖。当前没有证据显示存在恶意/意外覆盖，不因此新增设计阻断；执行launcher仍应控制会重定向spring.datasource、cache、quartz、path或配置location的继承项，并对有效配置/最终目标做计划中的核验。只记录字段名/类型/是否匹配，不输出值或复制整份旧外置配置。

ConfigUtils的silent fallback必须按r002检测；`dataease.path.engine`是JDBC文件URL、i18n可能带file:，包含关系应解析其实际路径，不能直接把URL字符串当普通文件名判断。只解析YAML成功不等于可启动，startup identity核验也不能替代启动前的明确新Spring datasource指向。

### SFR-R2-N2｜P2 非阻断：记录3600秒清理触发与实际退出宽限

r002在spawn起单调计时≤3600秒触发finally，随后TERM最多10秒、KILL后wait/reap最多5秒。执行证据应分别记录触发时点、TERM/KILL与退出/reap，不能把带宽限的模型写成“进程必然在恰3600秒前已回收”。这仍远小于24小时Quartz延迟，没有推翻看护设计；若需要严格总存活上限3600秒，launcher可把清理宽限计入该预算。不能因SIGKILL父进程不可捕获而假称finally覆盖所有OS故障。

**本轮新增blocking=0，新增必须修改产品源码项=0，需新增人类authority项=0。** 两项澄清可在脚本和执行记录落实，不要求重写已冻结r002或机械再开第三轮。脚本若实质改变目标、删行集合、自动重建路径或保密边界，则按真实delta重新绑定与评估。

## 已检查无问题维度

1. 继承的新jar身份没有漂移，现场只读SHA仍为`f653667d94fe3a20e9acdf2fc1bf128ef5b58c9db3181aec29ba2c363fd840e4`。源码package、独立H2、临时启动、真实HTTP/UI、产品验收仍是分层证据，Maven跳过测试没有被改称执行测试。
2. ConfigUtils与EhCacheStartListener真实实现均未改变；新Java私密user.home及同一固定文件能在当前机制内解决路径读取，不需要改产品或真实用户home。font、相对null临时路径、cache、logs、secret和engine/i18n URL均进入明确边界。
3. 新schema和根目录不存在才创建、dump无重定向、72表InnoDB/no view/trigger条件、DDL指纹和关键fixture核验，是适当的副本入口。--skip-extended-insert配合dump→clone行数对照有清楚的证据上限；实施计数器仍须按真实SQL记录解析，不能用任意文本子串计数冒充行数。
4. 精确删除先锁集合和核rowcount，再事务内后验与独立读回；不修改物理fixture、不删除原库、unknown commit不重试，允许只在有所有权的新库失败后诊断/重建，不擅自drop未知同名库。
5. 正常重建目标来自新Spring datasource，消除了保留旧jdbcUrl/useSSH/未知engine配置的分支；正常初始化元数据差异明确登记，不能再要求clone source/engine与原库所有字段一致。
6. 自定义Quartz仍用真实quartz.startup-delay=PT24H，Factory和Starter两路径的已核bytecode保持适用；watchdog与独立元库/文件范围共同控制，不把Spring Scheduled或启动pool当成Quartz已禁止。
7. 新context保留Axios/HMAC/i18n，真实8110转发在首次导航前安装；不共享storage/token/clipboard，不混旧fault handler，upstream失败不fallback旧8100。实际网络真实性需要执行证据，r002未提前宣称已通过。
8. 正常停止新PID/context、原8100/7070只读前后核、保留owned新库及私密文件，恢复边界明确。新目录缺图片或驱动时保留限制/停相应入口，不用占位或旧路径补成功。
9. r001历史段落与r002优先替换规则足以解释冲突，未发现借旧文本保留访问原fixture源的授权例外、重置轮次、缩减38/49、扩成真实权限或重开C2。

## 分阶段准入与下一步

| 阶段 | 当前准入 | 实际完成前所需证据 |
|---|---|---|
| 私密文件/launcher准备 | **设计PASS**，须对应精确admission | 新根不存在/权限/无symlink、双read-model逐项路径、受控新Java参数、sleep模拟stop/异常/TERM/timeout、日志脱敏 |
| dump/导入/四行clone转换 | **设计PASS**，须固定源/新schema所有权及该阶段admission | dump/DDL/行数/fixture身份、精确集合与rowcount、事务结果及独立读回；unknown不重试 |
| 新Java启动与身份核验 | **设计PASS，执行结果未观察** | 新jar/PID/端口、有效新配置、watchdog在岗、正常Demo/engine重建、三类连接全在clone、迁移/任务/文件delta |
| 实际symbolic验证 | **设计PASS，依赖启动核验实际通过** | 正常登录和真实upstream链、同组匹配代表/aggregate amount独立CSV oracle、相关query/save/findById与显式保存重开；异常及原残余保留 |
| 退出与留存 | **设计PASS，结果未观察** | 自有child stop/kill/reap、8110释放、route/context关闭、原服务前后身份、私密owned材料保留清单 |

最小下一步是落实并验证文件/launcher，再按精确DB admission完成副本准备；不是把本设计PASS直接填入“副本已创建/新服务已启动/真实地图已修复”。无需重新构建未变化产品修复来凑验证次数；新源码jar已核身份，但新进程实际加载证据仍要记录。

## 未检查、同类残余和声明上限

未检查：实时源/新库及权限、实际dump/转换SQL脚本、私密配置内容/有效Environment、launcher/sleep模拟和实际进程、真实route/网络响应/新UI、所有启动migration/插件外部实现。原因是本lane只读设计且这些交付物尚未执行。当前固定ID事实来自r002持久记录和root此前只读观察，本lane未访问DB，不把其标作独立实时复查。

同类残余保留：原8100旧行为、原ubo/C2预算、flow/heat稳定重开、真实多用户/行列权限、参数/计算字段/跨源运行、未完成类型/AC、未知插件等原合同内容。本环境最多推进本次symbolic details真实验证，不关闭全部38项或49类型完整验收；新clone元数据准备不是生产迁移或原库备份恢复演练。

术语压缩测试：“方案通过”仅指设计准入；“三类连接都clone”必须有实际身份读回；“四行删除成功”是事务结果而非启动重建成功；“真实HTTP”也不是全UI/权限通过。没有新的Scope Delta，不向用户索取重复授权。

## 阅读清单与输出保全

完整读取本卡/render prompt、Plan-r002全文（含历史基线）、绑定r001计划/审查、SourceBuild、Topology-r525；复核当前Goal原范围和11项摘要；重读EngineManage正常Demo/engine创建条件与ID、DataSourceManage.innerSave边界、DataSourceInitStartListener/CalciteProvider初始化顺序、ConfigUtils/EhCacheStartListener/CoreApplication。首轮已读的Quartz bytecode、路径/缓存/secret/调度/Axios/HMAC边界在其源码与依赖未改变的范围内复用，不冒称本轮又执行了应用。

写前11项绑定输入一致、输出路径原不存在、运行根仍不存在；只新增本报告。随后root应按实际报告摘要绑定，下游执行状态不回填本审阅时点结论。
