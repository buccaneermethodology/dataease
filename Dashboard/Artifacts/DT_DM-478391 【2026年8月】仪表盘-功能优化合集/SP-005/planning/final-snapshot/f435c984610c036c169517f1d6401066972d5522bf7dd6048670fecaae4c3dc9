# B阶段操作方案（待确认）

A阶段只读连接成功，不需修复MySQL认证。尚不能启动：现有Jar无法绑定当前源码，启动会写库，Redis专用性未证。

## B1：仅离线构建，不启动产品

在仓库根目录执行：

```sh
mvn -o -f core/core-backend/pom.xml package -Pstandalone -Dmaven.test.skip=true
```

使用已核验Java21/Maven与现有本地依赖；不clean、不下载、不SDK install、不调用core聚合的前端build/flush。离线依赖缺失即报告，不静默安装。核对本地SDK依赖是否对应源码，无法建立对应则产物仍不能证明整套源码版本一致。

副作用：写后端target、生成Q类、flattened POM，并由generate-resources复制现有dist到resources/static。执行前后保存差异，保留用户修改；不手改生成物。Surefire被跳过，构建成功不等于产品测试。后续前端见证使用Vite源码，不用旧dist证明当前前端。

## B2：隔离条件明确后另提启动与写入方案

候选前端使用项目Node运行Vite dev，127.0.0.1:7070代理8100；后端启动命令需在B1核对产物/Profile/依赖及外置配置所有写目录后形成。

须用户明确dataeasev3是否为允许本轮写入的专用测试库、Redis是否专用；是否允许启动时既有迁移和S01前缀合成对象创建/保存/导出/删除。原Goal排除迁移，若允许既有启动迁移必须保存为用户批准的具体环境例外，不由A授权推导。若含业务数据，不启动，另拟隔离库与Redis方案。

真实权限/移动见证仍需允许/拒绝身份和指定App/设备；XPack未初始化，不自动获取专有代码，不豁免权限维度。

当前可独立批准的具体动作仅B1；不以不完整后端启动方案请求宽泛授权。
