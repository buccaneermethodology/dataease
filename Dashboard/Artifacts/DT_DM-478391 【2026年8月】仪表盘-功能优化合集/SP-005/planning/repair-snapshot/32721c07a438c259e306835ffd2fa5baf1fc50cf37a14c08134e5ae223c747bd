# 本机测试环境恢复记录

记录时间：2026-10-16T01:45:28.473815+00:00

用户请求：请你看看如何恢复环境。沿用已有本机测试环境启动及 B2c 授权；本记录是原 S01 的恢复步骤，不新开 Goal。

## 已执行与实证

- MySQL 原实例二进制 /opt/homebrew/opt/mysql@8.4/bin/mysqld，原数据目录 /Users/xiaomei/opt/dataease3.0/mysql，仍使用本机3307；未初始化新库、未切换到默认MySQL9.5。
- 日志显示 XA crash recovery finished、ready for connections。此前日志没有正常关闭记录；无法据此确定进程被终止的具体原因。
- 既有应用账号只读查询：版本8.4.11、当前库dataeasev3、72张表。
- Redis 8.10.2 在127.0.0.1:6379恢复，PING=PONG。使用新的专用临时目录/private/tmp/dataease-sp005-redis-recovery，关闭RDB/AOF；这是测试缓存重建，不声明旧缓存恢复。
- 前端既有PID9283继续监听127.0.0.1:7070。
- 后端使用已批准B2a同一命令与原Jar，PID11393，监听127.0.0.1:8100；日志Started CoreApplication in 5.416 seconds。
- Jar SHA256：0e9840bea80caefc3d353a7b62d203505c280396923f91001769f62d7c3e66e5。
- 浏览器进入管理员工作台，成功读取资源数量。模板市场外网超时和外部帮助页异常仍存在，不影响本轮本机合成取数。
- 补测透视表首次重开显示数据源连接无效；在原S01_SP005_PivotRepair_Source点击校验，返回校验成功。未改连接参数或密码。
- 再次打开原看板并刷新，图表取数与条件渲染恢复：华东300/华南300红色，华北50白色，总计650红色。规则和数据来自原保存对象，没有重新设置条件。
- 截图：B2c-F05-pivot-reopened-recovery.png。桌面测试临时视口已reset。

## 当前交接状态

MySQL PID11210（exec session70503）、Redis PID11224（67062）、后端PID11393（32690）与前端PID9283当前保留运行，供原Goal继续补测和清理。后端日志/private/tmp/dataease-sp005-environment-recovery-backend.log。

第二批合成资源仍在，尚未清理；不得把第一批cleanup结果套用到第二批。F05重开运行证据已补，但尚待归档并独立复核。依赖台账合并、最终review与Goal协议闭合仍未完成。本记录不构成Goal完成或产品整体验收。
