# B2a 本机后端启动与连通验证方案（待批准）

## 已具备条件

SDK与后端package成功，产物见B1-Build-Verified.md。此前只读预检确认本机3307/dataeasev3和Redis6379可连通。用户曾回答测试环境问题“是的”，但无独立隔离证据；不能据此推断库中没有业务对象。启动前重新检查端口、配置目标、数据源/调度相关表的记录数量（仅数量，不输出业务行）；如存在无法判别的既有对象或运行任务，先停在只读检查并提交具体风险。

## 具体命令

仓库根目录执行（启动日志落本机临时目录并脱敏提取证据）：

```sh
java -jar core/core-backend/target/CoreApplication.jar --spring.config.additional-location=file:/Users/xiaomei/opt/dataease3.0/config/application.yml --spring.profiles.active=standalone --server.address=127.0.0.1 --server.port=8100 --dataease.path.data=/Users/xiaomei/opt/dataease3.0/data
```

配置仅从现有0600外置文件读取，不在命令行放凭据。监听仅127.0.0.1。现有配置将日志、cache、drivers、custom-drivers、report、excel、exportData、static-resource、share-secret路径指向/Users/xiaomei/opt/dataease3.0；data路径由命令显式指定，避免默认/opt路径。插件路径与未覆盖的固定路径出现故障时，记录后停，不建全局软链或静默修改产品配置。

## 需要明确批准的写入

本轮仅允许该本机测试环境的既有启动行为：JPA ddl-auto:update、InitSqlListener已存在的SqlBlock及版本记录、初始化加密/系统配置、缓存和运行日志文件。启动会读取已有配置并可能初始化任务调度；只读检查发现既有业务任务时不直接启动。此授权是原Goal“不迁移”边界下的本地测试环境启动例外，不是编写新迁移或修改业务需求。

启动后观察进程、HTTP响应和错误日志；验证可达性不标为F01–F08行为通过。故障退出时保留日志与数据库可能部分初始化的事实，不自动回滚DDL或删除既有对象。正常检查后停止本轮启动进程，不关闭已有MySQL/Redis。

此阶段不新建/删除用户业务对象、不执行导出、不连接外部业务数据源、不自动加载未确认的XPack实现。后续合成fixture、权限身份、前端交互和移动设备验证仍按实际入口形成具体操作；移动设备信息仍缺。
