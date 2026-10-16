# B1离线构建结果

用户批准后实际执行：`mvn -o -f core/core-backend/pom.xml package -Pstandalone -Dmaven.test.skip=true`。进程退出码1，失败发生在POM解析，未进入编译/打包。原始输出见[B1-build-output.txt](B1-build-output.txt)。

原因：父POM `org.springframework.boot:spring-boot-starter-parent:3.5.15`不在本地缓存，离线无法访问项目指定仓库。已检查默认缓存目录不存在；用户settings.xml不存在，Maven全局settings未配置localRepository。没有证据表明仅为缓存来源标签冲突。

未联网下载、安装、修改版本或配置；未启动DataEase或写数据库。产品源码/SDK/POM diff为空，git diff --check通过。构建失败不算产品测试失败或通过；旧Jar仍不能作为当前源码产物。

## 后续方案

若用户批准联网依赖恢复，在同一目录执行`mvn -f core/core-backend/pom.xml package -Pstandalone -Dmaven.test.skip=true`。仅移除离线参数，保留当前依赖版本；允许Maven从当前配置仓库下载声明依赖至本地缓存。会写~/.m2及构建生成目录，不执行clean、SDK install或产品启动；遇到本地SDK缺失/版本不符、需要源码修改或新增安装时停止并提出具体方案。构建仍跳过测试，不作运行验收。

可替代方案：用户提供已缓存所需依赖的Maven仓库位置，先只读核对后继续离线。重复原命令不能消除当前缺失，不机械重试。
