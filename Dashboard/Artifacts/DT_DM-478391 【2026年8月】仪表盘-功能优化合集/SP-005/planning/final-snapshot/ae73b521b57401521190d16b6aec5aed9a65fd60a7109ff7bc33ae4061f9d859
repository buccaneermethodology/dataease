# A阶段只读预检结果

用户已批准A阶段，结果不是产品运行验收。工具/监听见PreflightA-tools.json；连接见PreflightA-connections-r002.json；Jar身份见PreflightA-artifact-identity.json。

- Java 21.0.12.1、Maven 3.9.11、项目Node 23.11.0可用。
- 本机MySQL3307、Redis6379监听；7070和8100未监听，未启动服务。
- 外置配置使用jdbc:mariadb连接本机3307/dataeasev3，应用用户dataease_dev。通过匿名管道安全传凭据执行SELECT 1、DATABASE、VERSION和表名列表成功；服务器8.4.11。未读取业务行、未改授权/schema/数据。
- Redis认证成功、PONG，版本8.10.2；仅证明本机可连接，不证明实例专用。
- 首次Redis连接受沙箱限制，经用户已授权范围的执行升级后成功。初版只识别mysql scheme未连接数据库，修正解析mariadb后成功；未更换配置或凭据。
- 现有Jar摘要已固定，但无git/build身份元数据，源码对应UNKNOWN。Jar只见api-permissions库不能证明或否认外置插件权限。

## 未满足的运行进入条件

与当前源码对应的构建产物；开发库可写和Redis隔离确认；真实测试身份及移动App/设备；B阶段具体操作授权。启动会触发ddl-auto:update及InitSqlListener，A没有授权这些写入。当前产品测试仍NOT_RUN。
