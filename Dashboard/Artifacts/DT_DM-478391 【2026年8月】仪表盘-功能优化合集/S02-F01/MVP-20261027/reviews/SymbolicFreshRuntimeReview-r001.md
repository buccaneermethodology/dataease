# 符号地图新源码临时运行环境计划独立审查 r001

- reviewed_at：2026-10-30T04:50:53.162385+00:00；reviewer/source：`/root/local_basemap_reviewer`；snapshot_id：`S02-SYMBOLIC-FRESH-RUNTIME-REVIEW-r001`。
- as_of_state：Plan-r001、SourceBuild-r001、局部H2独立验证与Topology-r524已落；**新schema/私密运行目录/新Java实例尚未实施**。本环境设计第 **1/3轮**，与源码实现、底图或C2预算分离。
- 接收端卡canonical SHA `04227978f55173443b672caece6f49e5027f770a61160f6f0a6f0f62bf5ba238`；本地validate exit0/PASS。Goal+12 base refs共13项摘要匹配，写报告前复验未漂移。
- 本lane只读方案、源码、构建产物及jar bytecode，仅写本报告。没有查看私密凭据/外置配置原值，没有执行DB/浏览器/启动/清理操作，没有修改source或原8100/7070。

## 双裁决与安全下一步

**Design Freeze Validity：PASS WITH FINDINGS（隔离目标和证据边界合理，但r001存在两项具体隔离缺口）。Implementation Entry Readiness：分阶段；独立文件/副本准备可按精确准入继续，按r001直接启动新实例 FAIL。Overall Verdict：BLOCKED（仅阻断当前计划的启动入口）。**

不能据r001的“新YAML+新schema+零任务+24小时Quartz延迟”直接判定实例隔离完成。两个已确认缺口是：ConfigUtils绕过Spring按原user.home读固定文件；启动监听器不等调度任务就为所有数据库源和默认引擎初始化连接。两者均有局部、只影响任务副本的修正路径，不需要改产品框架或再次请求同一已授权本机验证的许可。

本次完整检查后只有B1/B2为启动阻断，其余N项是执行前置与声明限制。可先修订并冻结r002、准备私密目录/配置和受守卫的clone转换；不要因本报告让原8100回滚、改全局HOME、改用户账号授权或开始真实权限工作。原38义务、49类型分母及真实权限BLOCKED/NOT_RUN保持。

## 全部阻断发现

### SFR-R1-B1｜P1：Spring新配置不能独立覆盖ConfigUtils的固定home配置读取

**依据**：`ConfigUtils.java:15–29`直接读取`System.getProperty("user.home")/opt/dataease3.0/config/application.yml`，只在该文件里取key及base-path替换，不读取Spring Environment。`StaticResourceConstants.getHomeData()`、ExcelUtils、VisualizationExcelUtils均使用它。尤其`EhCacheStartListener.java:14–15`会据此再次设置JVM的dataease.path.ehcache，覆盖计划预先给出的同名-D属性。

**影响/反例**：仅用spring.config.additional-location指向新YAML、同时传-Ddataease.path.ehcache=新目录，仍可能由initializer读取原home固定文件，覆盖回原实例cache；静态资源根、Excel/report路径也可能回到旧配置或/opt默认值，违背r001:17“不共享旧缓存/可写目录”。新cwd不能修正绝对home配置来源。

**最小修正**：只对新Java子进程设置`-Duser.home=<任务私密home>`；在其固定`opt/dataease3.0/config/application.yml`下创建本次私密配置，并让Spring显式加载**同一份文件**。在任何应用类/initializer加载前落实；不改shell HOME、用户真实home或原实例文件。用明确绝对目录或ConfigUtils实际支持的base-path展开，逐项核Spring与ConfigUtils两类读取结果。固定配置缺失、解析失败/回退默认、路径未落在任务根内则拒绝启动。两个read model必须一致，不能仅检查新YAML存在。

**状态**：r001未包含该步骤，启动阻断。根Agent已提出新Java-Duser.home候选；本报告认可方向，不把未落地候选当作已执行修复。

### SFR-R1-B2｜P1：零任务与Quartz延迟不能阻止未授权分析源/引擎的启动连接

**依据**：`DataSourceInitStartListener.java:40–48`在ApplicationReady时先initSimpleEngine，再initConnectionPool；`CalciteProvider.java:2072–2108`会遍历core_datasource中除folder/API/Excel/ExcelRemote之外的**全部数据源**，并额外加入engineManage.deEngine，对它们建池/构建schema。这个过程不受core_datasource_task=0、startup-ready=0或Quartz延迟保护。

根Agent补充的无秘密只读事实是：core_datasource有**mysql×2**，只有固定S02 source `985188400292302848`明确属于允许fixture，另一mysql不能认定为允许；core_de_engine另有**mysql×1**，其目标因configuration需解密而仍UNKNOWN。本lane未访问DB或解密，保持上述来源归属和未知。按r001全量复制再启动，会把额外连接目标一起带入，越过“仅现有S02 fixture SELECT”的边界。

**最小修正边界**：启动前在本任务新schema中冻结、守卫并处理实际会被pool选中的datasource和engine；不能只移除额外datasource而保留目标UNKNOWN的engine。允许以下有界候选之一，但需在r002选定、写清精确变更和验证：

1. 新clone只保留固定fixture source，私密重建/重写它和默认engine的配置，使实际JDBC全部落到clone的本机数据库；物理fixture表已随dump复制时核30行/19字段/ID及数据一致。不能宣称其他分析源已克隆。
2. 根Agent最后提出的更小协议候选：仅新clone清空两条core_datasource、唯一core_de_engine，并只移除de_template_version中`version=985188400292302848`的Demo种子标记，让已有initLocalDataSource按新Spring datasource重建同ID Demo，再由initSimpleEngine建立clone-local engine。`EngineManage.java:142–177`确实会在无非H2 engine时从新Spring连接生成默认engine；initLocalDataSource还同时检查固定source与种子标记，不能只删source或只删标记后假定必定重建。

**r002必须冻结的守卫**：原库只读；新schema先确认由本任务创建且DATABASE/端口匹配；记录上述新clone行的存在/ID/类型/原ciphertext或私密备份摘要；确认计数和唯一性后只执行已选候选的精确SQL，不走可能联动外部分析源的通用删除API。Demo重建方案的变更对象是明确的新clone准备，不删除物理fixture、dataset/field/chart行或原库；预期启动写入及clone元数据差异必须登记。启动后私密核Spring metadata、被选中的fixture source、engine三条实际连接的库身份，并核固定fixture和数据集身份；任一仍指原库/未知额外目标时停止新实例，不让UI查询继续。

**若采用解密/重加密候选**：不要仅改host/port/dataBase就宣称完成。`Mysql.getJdbc()`在urlType非hostName时优先用jdbcUrl；Configuration.convertJdbcUrl也可从旧jdbcUrl覆盖host/用户名/数据库，useSSH可另起隧道。需显式控制urlType/jdbcUrl/useSSH/driver/额外参数等会改变实际目标的项，私密验证最终Jdbc getter及连接身份。EncryptUtils.aesDecrypt在失败时可能原样返回输入，必须解析/类型校验成功才允许重写；秘密及AES key只在内存，不进argv/日志/报告。无需为实施隔离而公开原连接配置。

**状态**：按当前r001启动仍阻断；两个候选均未执行。推荐下一版优先选一个最小且可观测的方案，避免在执行中临时切换。上述仅新clone操作属于既有本机验证范围内的准备，不要求新增人类许可，也不允许泛化为原库清洗。

## 非阻断发现与执行条件

### SFR-R1-N1｜P2：路径清单应显式补font，并处理CoreApplication的相对tmp目录

r001:17列举多个path但没显式列`dataease.path.font`；FontManage/FontSettingsManage各自@Value默认`/opt/dataease3.0/data/font/`，不会自动随dataease.path.data改变。应在r002实际生成的私密YAML中明确补上font，同时保留已有substitule/share-secret/static-resource/report/excel/exportData/driver/custom-drivers/i18n/ehcache等项；不能用“等所有路径”替代实际有效值核验。

`CoreApplication.main:21`无条件将java.io.tmpdir设为字符串`null`，因此另传-Djava.io.tmpdir可能被覆盖；新cwd位于任务0700目录可以把这类相对路径限制在任务根内，但启动器应明确检查/准备该相对临时目录及日志/文件实际落点。不为本次验证修改产品源码。所有准备路径拒绝符号链接逃逸；共享只读jar与公开驱动文件如需复用，应明确只读身份和摘要，不能偷换回旧可写路径。

### SFR-R1-N2｜P1执行前置、当前非新增设计阻断：watchdog须实际有界终止并回收自己的子进程

24小时延迟是依赖正常生命周期的dispatch保护，不是进程租约。新launcher应从创建Java子进程时开始按单调elapsed限制≤3600秒；在超时、错误或主动结束时finally终止自己持有的Popen子PID/任务进程组，短宽限后kill并wait/reap，再确认8110释放。不得用pkill/java端口模糊匹配，也不得把旧PID81808写成终止目标。原8100 PID/监听仅前后只读核对；父进程控制脚本与child身份、jar SHA应有证据，不能只写计划文字就声称硬上限已实现。

需覆盖父launcher正常退出/异常/TERM的清理路径，并保证运行看护不依赖聊天工具一直阻塞。无法建立有效watchdog时不启动。库和私密目录保留是有意收尾，不等于留Java运行24小时。

### SFR-R1-N3｜P2：转发应在首次导航前安装、保留请求链并在失败时关闭该入口

Axios模块求值时就有同步requestTimeOut XHR，HMAC还会同步取info；新context route必须在第一次goto前安装，不只覆盖后来的chart POST。严格按dev.ts顺序先`/api/f`去前缀，再`/api`→`/de2api`，保留方法、query编码、原始body和语言/认证/HMAC等应用头，Host/authority对齐新服务；不重签HMAC，不生成成功JSON，不复用旧fault handler或storageState。

HmacTool把/api转换成/de2api后签method/path，目标转发保留同样有效路径是必要条件。可以用真实upstream response传回浏览器，但要记录origin请求→8110实际路径→status/body摘要/服务PID及jar身份，不能把route.fulfill这个API名称本身当业务mock或相反把它当真实性证明。upstream失败不得fallback原8100；发现API绕route直达8100、重定向到未知目标或无法确认服务身份就停止该context验证。不要复制旧tab token、localStorage、内存clipboard；登录/HMAC token类响应不落公开全量抓包。

### SFR-R1-N4｜P2：clone一致性与还原应区分快照、准备delta和启动delta

single-transaction对InnoDB是合适的快照策略，表count/关键fixture比较仍需落实；避免并发DDL，并把源在dump后发生变化保留为时点差异，不能凭count相同证明全库字节相等。导入连接固定新schema，dump拒绝CREATE DATABASE/USE原库/跨库可执行对象，不在原库执行任何DDL/DML；源view/trigger=0应在实施时重核。候选B2转换后，新clone datasource/engine/Demo种子元数据会有**有意差异**，应记录，不再声称clone所有元数据与源完全相同。

启动SqlBlock、模板初始化、RSA/secret、Visualization初始化及Spring Scheduled可能写新clone/新目录，计划不能称零写。源core_export_task=0不等于export-download-task表也为空；后者定时清理只在clone则不越界，记录即可，不要求为了本测试抹掉原记录。

## 已检查无问题维度

1. **构建身份**：新jar实际SHA为`f653667d94fe3a20e9acdf2fc1bf128ef5b58c9db3181aec29ba2c363fd840e4`，与计划/SourceBuild一致；输入manifest有1760个快照条目，Handler绑定当前修复SHA。构建log明确编译482个backend源、Tests are skipped、BUILD SUCCESS；built Handler bytecode有两处BeanUtils.copyBean调用，包含新增局部复制。此为本次backend源码package，不推广成全部SDK/前端/产品验证；H2独立验证另有固定报告。
2. **Quartz实际配置**：新jar内quartz-spring-boot-starter-1.0.8.jar SHA `032779b8a219b29197d81c1a8f09e8b0ab85f9cf5607281240fce275d6513f78`。独立javap确认ConfigurationProperties prefix为`quartz`，Factory把Duration.getSeconds用于setStartupDelay，SchedulerStarter daemon线程也先按该秒数sleep再reschedule/start。PT24H=86400秒与3600秒watchdog的层次正确，不能用spring.quartz.auto-startup替代。Factory使用注入DataSource/JDBC QRTZ_表且clustered=true，故metadata datasource实际clone身份必须先正确；相同scheduler名称不会跨不同schema共享表。
3. **后台任务边界**：DataSourceInitStartListener会注册数据源状态Quartz任务，即使原任务空也可能创建clone调度记录；延迟机制成立不代表没调度元数据写入。Spring Scheduled不受Quartz延迟控制，CleanScheduler/导出download清理仅访问clone元库/独立路径时有界；运行中禁止主动同步/导出/填报等额外任务。B2专门覆盖不受延迟保护的连接初始化。
4. **缓存**：spring.cache.type=jcache与jar内ehcache配置是当前路径；RedisCacheListener/RedisCacheImpl只在cache.type=redis时启用。新配置不继承旧Redis，修复B1后独立ehcache持久目录可避免同路径锁和会话缓存串用。不能说所有线程已关；也不为规避环境问题改真实缓存实现。
5. **独立secret**：SubstituleLoginConfig从配置路径读pwd/tokenSecret，缺tokenSecret时生成并写回；只复制测试pwd、留新secret符合新standalone会话边界。ShareSecretManage也会在其独立路径生成secret。新文件0600/父目录0700与进程umask应落实，不创建永久token或把standalone升级为真实权限环境。
6. **迁移写入**：ddl-auto=none仅控制Hibernate，不禁InitSqlListener；其失败时阻断启动和记录失败version属于clone内正常行为。克隆和迁移只落新schema的目标正确，B1/B2修正后不需要原8100停机。
7. **资源与原实例**：7070前端和同源fixture可作为只读资源复用，测试context的API转发不要求改Vite配置或重启7070。新数据目录缺原图片应保持未验证/副本限制，不能占位填成功；旧8100状态不因新实例失败而回滚。
8. **收尾所有权**：固定新schema/目录存在即拒绝覆盖；任务自己的PID/context退出，clone保留不自动drop；后续清理只按创建清单，不碰未知同名资源。保留私密dump不是永久备份承诺，tmp可被系统清理。

## 最小实施阶梯与准入预测

| 阶段 | 最小动作与证据 | 准入判断 |
|---|---|---|
| A r002设计冻结 | 选定B1新Javahome及B2单一clone数据源方案；明确精确行/种子marker/路径/进程/route写域、before/after守卫与预期delta | 可在现有授权内推进，不改原冻结r001 |
| B 副本准备 | 创建所有权与不存在守卫；私密dump导新schema；关键fixture身份；同一新YAML覆盖两个配置读取模型；私密clone元数据转换 | 按该阶段精确admission执行，不等同启动通过 |
| C 实例启动 | jar摘要/端口空闲/完整路径核验/watchdog就绪；验证三类连接目标均在选定clone边界；记录启动迁移与后台状态 | **r001仍BLOCKED**；r002关闭B1/B2且实际前置齐备后才可评估 |
| D 真实修复验证 | 新context正常登录；route真实8110；symbolic不同阈值、同组匹配代表、aggregate amount；query/save/findById树和正常save-reopen | 未运行，不预判成功；只填本次details运行缺口 |
| E 收尾 | 主动stop/kill-reap新PID、关闭context/route，核原8100未改；clone保留及所有权清单 | 不回滚原库，不把后续产物倒填计划 |

根Agent最后的“clone内删两条source/唯一engine/固定Demo种子marker→正常启动重建”候选减少私密解密重写复杂度，**值得在r002优先评估**。但本轮不为尚未冻结的SQL、启动自动重建结果或新配置预填PASS。需要新版本绑定精确转换、启动后身份与fixture核验；执行中如选另一候选，须保留原方案与差异，不能悄悄混合。无需为了上述已知局部问题创建新产品框架、重开C2或再次向用户要求同一授权。

## 语义边界、阅读清单与未检查

单行压缩风险已检查：“新schema/新实例ready”不能压缩成“所有分析源已克隆”；“24h延迟”不能压缩成“无启动外连/无后台写”；“package成功”不能压缩成“新jar已运行”；“正常请求经过route”不能压缩成“真实权限通过”；“新副本验证成功”也不关闭原38/49和旧ubo/稳定画面残余。对应修复落在配置/clone准备/执行守卫，稳定产品规则仍不由Dashboard替代。

正向读取：绑定Goal、Plan-r001、SourceBuild-r001、SymbolicDetailsValidation-r001、InitSqlListener、DataSourceInitStartListener、EngineManage、CleanScheduler、dev.ts、SubstituleLoginConfig、RedisCacheListener、ehcache XML、Topology-r524；扩读ConfigUtils、StaticResourceConstants、CoreApplication/EhCacheStartListener、FontManage/FontSettingsManage配置入口、ShareSecretManage、CalciteProvider连接池入口、DatasourceServer任务/删除边界、TemplateInit/VisualizationInit与相关写入链、导出Spring定时任务、XpackTaskStarter及核心替补executor；Axios/HmacTool/CorsConfig、Mysql/Configuration/JdbcUrlSecurityPolicy、EncryptUtils；SourceBuild输入manifest/log、新jar内packaged配置的相关非秘密key与Quartz bytecode。所有源码/bytecode读取均未读取私密配置值。

未检查：实际私密配置有效值、源/clone实时DB及密钥、new schema创建/权限/dump导入/转换SQL执行、所有源实际网络连接、所有迁移与外部扩展实现、完整环境变量覆盖、watchdog实际实现/超时、route实际代码/请求/响应、新实例健康/真实UI。原因是本lane只读设计且环境尚未实施。源表/任务/engine统计来自plan及root明确补充，不冒称本laneDB独立验证。环境变量和配置优先级应在launcher中通过仅字段名/类型的受控环境与有效目标读回核验，不复制旧整份外置YAML或输出秘密。

同类残余：其他ConfigUtils调用/嵌入路径与未知扩展没有全仓运行审计；本轮聚焦现有standalone临时副本。新schema隔离不等于数据库账号权限被系统强制限制到新schema，必须靠明确目标/脚本守卫，不擅自扩大账户授权。没有把计划评审升格执行完成、独立runtime验收或Goal终态。

写前13项绑定输入未漂移、报告路径原不存在；只新增本报告。发现当前Python无PyYAML后使用标准库读取打包配置相关key并结合源码/javap完成检查，没有安装依赖，也没有让该可选解析工具缺失阻断独立工作。
