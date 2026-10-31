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
