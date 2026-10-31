# B1 联网构建结果与恢复方案

已按用户授权执行 `mvn -f core/core-backend/pom.xml package -Pstandalone -Dmaven.test.skip=true`。Maven 运行7分钟，退出码1；Spring Boot父POM及公共依赖下载成功，但以下3.2.0依赖在fit2cloud-public和Central均无法解析：api-base、api-permissions、api-sync。失败发生于依赖解析，未进入编译、打包或测试。原始末段见 B1-online-output-tail.txt（仅末段，不是完整日志）。

产品源码、SDK与POM无差异；git diff --check通过。未启动产品、未写数据库。Goal保持进行中，不能声明S01完成。

## 下一步：本地SDK构建安装（待确认）

在仓库根目录执行：

```sh
mvn -B -f pom.xml install -Dmaven.test.skip=true
```

根聚合仅包含SDK；会构建当前源码的SDK/API/扩展契约模块及父POM，下载其当前声明依赖，生成target和flattened POM，并安装至本机Maven缓存。不会构建XPack实现，不发布远端，不clean，不修改源码/依赖版本，不启动服务或写数据库。成功后执行：

```sh
mvn -B -f core/core-backend/pom.xml package -Pstandalone -Dmaven.test.skip=true
```

SDK自身声明 dataease-license-sdk:3.2.0，本机未缓存，能否从配置仓库取得尚未验证；若不可取得，将报告具体缺失，不替换版本、不复制XPack实现或旧Jar内容。后续仍须核对生成产物与源码关系，再形成启动/运行验证方案。

需要确认的原因：此前 B1 具体方案明确排除 SDK install；本次联网授权对应该方案的依赖下载与后端package，不能隐含覆盖这一新增本地安装步骤。
