# 符号地图新构建临时副本运行计划 r002

本版继承r001的原Goal/构建身份/真实网络与证据边界，仅以下明确段落替换冲突内容。r001和首轮审查字节冻结；本环境设计累计第2/3轮。实际仍未创建新schema/私密运行根或新Java进程。

## 首轮全部发现处置与选定方案

**B1**：新Java子进程仅设置-Duser.home=/private/tmp/s02-symbolic-runtime-r001/home；shell HOME不变。固定配置路径为该home/opt/dataease3.0/config/application.yml，同时spring.config.additional-location显式指向同一文件。EhCacheStartListener读取固定文件后写System属性的值也必须在本任务根内。启动前用实际ConfigUtils和Spring YAML解析两条读取模型核逐项值相等/路径合法，解析失败或回落/opt/原home拒绝启动。

**B2最终选定**：仅新clone在启动前按精确ID删除两条旧datasource、唯一engine及固定Demo种子记录，再由现有DataSourceInitStartListener→EngineManage正常重建；不使用私密解密/重加密方案，不执行通用Datasource删除API。原库仍只读。新元数据库和所有分析连接均应在本机3307新schema，不能继续沿用r001允许分析源读原fixture库的例外。

已取得源只读ID事实：datasource [(985188400292302848,mysql),(1308230587517112320,mysql)]；engine [(1307768503922724864,mysql)]；Demo marker version985188400292302848恰1。原ciphertext不读取/抄公开材料；完整私密dump保存写前字节并记摘要。事实若漂移，停止而非扩大删除条件。

### 精确clone转换协议

- 源只允许3307/dataeasev3，目标固定s02_symbolic_20261029且原不存在；任务0700根原不存在。先私密全量single-transaction dump（no views/triggers/non-InnoDB前提复验），加--skip-extended-insert以便逐表数INSERT记录，与导入后逐表COUNT核对；这只证明dump快照→clone行数，不声称并发源后来仍字节相等。源DDL结构指纹前后不一致时不继续启动。dump若出现CREATE DATABASE、USE、视图/触发器/跨库可执行重定向拒绝导入；不对dump进行盲目全串替换。
- 导入连接显式固定目标库。转换脚本在一个连接事务内先核SELECT @@port=3307 AND DATABASE()='s02_symbolic_20261029'，以及该库为本任务创建的所有权manifest；确认72表、两个精确DS/唯一engine/marker与私密snapshot行相同后锁定对应行。显式if/raise守卫，不使用可被-O删除的assert。
- `SELECT id,type FROM core_datasource ORDER BY id FOR UPDATE`必须严格等于上述两元组；`SELECT id,type FROM core_de_engine ... FOR UPDATE`必须严格等于上述唯一元组；`SELECT version FROM de_template_version WHERE version='985188400292302848' FOR UPDATE`恰一。
- 仅执行：
  `DELETE FROM core_datasource WHERE id IN (985188400292302848,1308230587517112320) AND type='mysql';`（rowcount=2）
  `DELETE FROM core_de_engine WHERE id=1307768503922724864 AND type='mysql';`（rowcount=1）
  `DELETE FROM de_template_version WHERE version='985188400292302848';`（rowcount=1）
  核DS总数0/engine总数0/marker0和关键fixture表/字段/数据集/chart树摘要未变，再COMMIT；任何条件失败ROLLBACK并退出，不重试未知提交。COMMIT未确认按unknown/no-retry处理，不能假设回滚。独立读回三项0和fixture摘要再准入。
- 精确准备delta仅这2+1+1行；完整dump私密可用于重新建立**本任务新库**，不写原库。19字段ID/类型/role、dataset1312472054565572608、table7520739241744142336、dashboard1312476889213964288及实际物理fixture30行按snapshot/DQ读取核对；新增Demo/engine创建时间等是启动delta，不要求与源元数据逐字节相同。

### 启动后的实际目标核验

正常initLocalDataSource在无source和无marker时按新Spring datasource创建固定985...ID；initSimpleEngine创建clone-local engine。启动完成后须只存在一个mysql fixture datasource且ID985...、一个mysql engine；额外源0、core_datasource_task=0。私密校验三条实际连接（Spring metadata、fixture datasource、engine）的有效Jdbc getter/最终DATABASE()均为s02_symbolic_20261029、端点loopback:3307，不输出配置/密码或AES key。这里如需读取**本任务新库中刚生成的**配置，只在私密内存按现有协议处理，不读取旧额外源秘密。未知、仍指原库或jdbcUrl/useSSH等改变目标时立即停新实例，不能先开展UI业务再补核。

**N1路径**：所有实际可写key逐项写新固定配置：dataease.path.data、ehcache、driver、custom-drivers、report、excel、exportData、static-resource、share-secret、font、substitule、engine、i18n，以及logging.file.path。share-secret/substitule为私密文件；i18n值按file:URL核包含关系，engine仅新私密H2文件URL（当前standalone不用它）。base-path固定de2api，所有路径用绝对task根，不靠不受支持的YAML占位。新cwd也是0700任务根，预建相对`null/`临时目录；CoreApplication会将java.io.tmpdir设成null字符串，不能承诺-D覆盖生效。拒绝任一symlink或resolve逃逸。除新源码jar和已声明公开同源style外，不复用旧可写目录；驱动缺失停并定位。

**N2进程**：launcher持有唯一Popen新Java child，独立进程组，单调计时从spawn开始最多3600秒。正常主动stop文件、异常、TERM/INT及超时都进入finally：向自有process group TERM，最多10秒，仍未退出KILL，wait/reap最多5秒并核8110释放；只用此Popen/创建identity，不按端口或java模糊杀进程。父进程在独立tool session持续看护，不依赖聊天长阻塞；SIGKILL父进程不可执行finally，属于OS能力残余，不声称覆盖不可捕获信号。若宿主环境不能建立该看护就不启动。预先对sleep模拟child走正常stop/异常/TERM/timeout路径，不启动任何实际应用。

**N3网络**：新browser context首次goto前安装唯一局部转发；原请求/api/f先去前缀，/api改/de2api，固定upstream127.0.0.1:8110，保留method/query原编码/body/语言及认证HMAC头，Host/authority对齐新服务；不复用任何旧fault handler或storageState。禁止重定向到未知目标，upstream失败直接失败/关闭context，无fallback8100。可用route.fetch(maxRedirects=0)与真实response传递，但须记录原URL→真实upstream→serverAddr/状态/非敏感body摘要并绑定PID/jar；login/HMAC/token等完整响应不落公开抓包。实际验证业务数据必须新源码真实HTTP响应，不合成JSON。

**N4对账**：严格分dump快照、clone转换delta、启动迁移/模板/RSA/secret/Scheduled delta；ddl-auto=none不等于迁移停止。原8100/PID81808/7070只读前后核对，原fixture资源无写操作。新文件/DB保留供调试，测试结束停止新PID/context，不自动drop任何库；私密临时文件可被系统清理不是永久备份。

本版关闭方案层两P1的候选，必须第二轮独立审查；通过后分阶段创建精确admission：副本准备→启动核目标→真实UI；每步只按实际证据记录。watchdog/配置读取模型和clone守卫实际执行仍待验，不以设计文字填PASS。原38/49、真实权限及C2/ubo残余全部保留。

---

## r001基线原文（上文明确替换项优先，其余保持）

# 符号地图新源码构建的临时副本运行计划 r001

目标：用新源码打包jar实际核验symbolic-map过滤后的代表明细；当前8100/PID81808和7070不重启、不改配置。原38项及49分母不减，真实权限继续BLOCKED/NOT_RUN，本副本仍standalone。

构建已在/private/tmp/s02-symbolic-backend-build-r001完整源码快照离线package成功，jar SHA f653667d94fe3a20e9acdf2fc1bf128ef5b58c9db3181aec29ba2c363fd840e4。Maven测试明确跳过；独立11case语义GREEN另负责。只加载这个实际源码构建，不改/热补旧jar。

## 独立元数据库及启动门槛

1. 新建仅本任务所有的schema `s02_symbolic_20261029`，创建前确认不存在；源只允许本机3307/dataeasev3。原库只读预检为72表/约3.6MiB，全部InnoDB，view/trigger均0，core_datasource_task/core_export_task/startup ready均0；启动前重查，漂移则停止按具体项处理，不静默清空原任务。
2. 私密目录/private/tmp/s02-symbolic-runtime-r001须原不存在，0700；mysqldump --single-transaction --skip-lock-tables --skip-add-locks --set-gtid-purged=OFF --no-tablespaces dataeasev3写0600 dump。CLI仅用既有mysql-root.cnf配置位置，不输出密码。dump必须不含CREATE DATABASE/USE原库等重定向语句；只导入新schema。复制后逐表COUNT及关键fixture原始树/19字段/30行等必要身份比较，不从mtime或仅表数判一致。若复制期间源漂移，重新评估快照一致性，不能把当前并发源读回强称同一快照。
3. MySQL创建/导入/迁移/正常UI保存仅在新schema。analytical datasource configuration可能仍指向原专用fixture库，**不宣称所有分析数据源都已克隆**；本次只做现有S02 dataset的SELECT查询，不创建/修改分析源或触发抽取。现有同步任务0，Quartz延迟，避免副本任务写原源。

## 私密配置、文件与进程隔离

- 新0600 YAML仅从已有外置配置内存读取所需spring.datasource连接凭据，保留现有mariadb驱动/JDBC选项而把schema替换为新schema；不把原spring.data.redis等全量带入。字段值不进日志/argv/仓库。若该账号无新schema权限，停止报告，不擅自给其他账号加全局授权。
- server.address=127.0.0.1/port8110；先确认端口空闲。Spring JPA ddl-auto=none，InitSqlListener仍可能在**新schema**写迁移/配置，需记录，不宣称启动零写。
- spring.cache.type=jcache，使用jar内ehcache XML；dataease.path.ehcache及对应JVM -D属性指向新私密cache目录。dataease.path.data/exportData/report/excel/static-resource/driver/custom-drivers/i18n/share-secret/engine等所有文件可写位置及logging.file.path均指向新目录；不共享旧缓存、文件清理或日志目录。不复用旧Redis缓存。driver目录为空若运行缺驱动则停并定位，不偷偷改旧路径。
- 新私密substitule.json仅复制原测试admin的pwd字段，tokenSecret由正常启动在新文件生成；不复制旧secret，不设永久token；正常会话仍过期。这是standalone测试账号，不是具备真实多用户权限的环境。
- jar自己的Quartz starter使用 **quartz.startup-delay=PT24H**，已javap核实真实prefix为quartz且SchedulerStarter/Factory均使用该延迟；不能用spring.quartz.auto-startup=false代替自定义starter行为。新Java由一个有3600秒硬上限的本地父进程管理，到时只终止自己创建的PID；本次测试结束主动停止，不留到24小时。Spring Scheduled仍可运行，但任务空、元库/导出文件等可写路径独立；不声称全局停掉所有后台线程。
- 新实例cwd为新私密目录。新jar/端口/PID/配置摘要及关键健康状态绑定，原8100 PID/监听前后只读核对。启动日志原文留0700目录，公开证据仅脱敏摘要；不输出完整私密配置、SQL dump或令牌。

## 真实浏览器网络与验证

使用新的临时Chrome context，保持7070当前前端和既有Axios/HMAC/国际化调用链；仅该context的/api请求按原Vite规则转发到127.0.0.1:8110/de2api，/api/f按原规则去前缀。该路由只更换本地目标服务地址，真实网络响应直接返回，**不合成业务成功数据**，不得混入先前fault handler。记录实际服务端地址/响应、构建jar身份和完整query/save/findById相关树；没有任何旧页面共享token或内存剪贴板。正常登录从新私密配置读取测试pwd，仅进程内使用。

打开clone中的同一S02仪表板，等待真实地图设施/图层与指标完成。用source/target不同阈值运行实际symbolic查询，独立从冻结CSV核每个代表id属于当前匹配行、坐标同组、shop在六枚举；代表amount按既有规则保留组聚合，不当原始金额。保留正常双向source/target或必要单次重新查询及显式保存重开，重点只填本次details修复的真实运行缺口，不重跑前49类型。若前端其它静态图片因新私密data目录缺资产，记录为副本限制，不用占位图宣称图片正确。ubo/flow-heat稳定画面等原未决独立存在，不借该环境重开C2预算。

## 回滚/收尾和证据边界

任一步失败不触8100回滚；只停止新PID、移除新context局部route并关闭context。新schema和私密目录保留为本任务隔离调试材料（权限不放宽）；不自动drop未知同名库，不读写S01资源。临时材料可能被系统清理，不宣称永久备份。若后续要求清理，只凭创建所有权清单处置本任务新库/目录。

本计划是可逆本地验证环境实施输入；首轮review1/3。需要独立审查配置/任务隔离、目标身份、dump重定向、原源SELECT边界及route真实性；通过后用精确admission执行。最终证据分开：源码/H2验证、Maven打包、新实例启动、新实例UI/HTTP及独立产品验收；任何一层不能替代真实权限或Goal完成。
