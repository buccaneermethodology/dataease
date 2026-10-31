# SDK与后端构建结果

SDK命令 `mvn -B -f pom.xml install -Dmaven.test.skip=true` 成功，12模块，耗时08:17；后端命令 `mvn -B -f core/core-backend/pom.xml package -Pstandalone -Dmaven.test.skip=true` 成功，耗时01:50，编译482个Java源文件（release 21）。日志分别见 SDK-install-output.txt、Backend-package-output.txt。

新的 CoreApplication.jar SHA256：`0e9840bea80caefc3d353a7b62d203505c280396923f91001769f62d7c3e66e5`。三个API JAR在源码target、本地Maven缓存与最终包中摘要一致，见SDK-installed-identity.json与Backend-built-identity.json。未执行clean，记录的是当前工作树的增量构建结果；未独立证明所有旧生成资源来自当前源码。尤其前端使用既有dist复制，不能证明当前前端构建或渲染成功。

产品源码/SDK/POM diff为空，git diff --check通过。日志明确Tests are skipped。服务未启动，数据库未写入；构建成功不能代替行为测试，也不能关闭S01。
