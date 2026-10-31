# S02 权限隔离环境与账号方案

## 当前事实与阻塞

用户已授权新增/设置账号；未发现可用真实权限实例。现有7070/8100/dataeasev3为standalone/admin，不能用来证明只读拒绝或权限撤销。

`git submodule status`显示de-xpack未初始化，固定gitlink为9242ff482dc33c5e4c80e7fca5c3bf72c741c478；`git -C de-xpack status`会回落主仓库，不能据此声称子仓库可用。Maven仅找到api-permissions的SDK jar/pom，没有权限实现或distributed jar。主源码SubstituteUserServer为ConditionalOnMissingBean替补且返回admin。

指定来源.gitmodules为git@github.com:dataease/de-xpack.git。默认沙箱DNS失败后已恢复网络只读检查，SSH返回Repository not found；GitHub连接器读取dev-v3/pom.xml同样404。没有拉取源码、更新子模块指针、创建账号或启动/部署服务。当前阻塞是模块访问，不是账号授权。

## 可执行准备顺序

1. 取得可访问的授权模块来源（正确SSH别名/仓库，或已授权安装包路径），核对V3版本与SDK公共契约；保持专有源码独立，不复制到开源目录或公开文档。
2. 依据实际模块POM/加载方式决定Profile；不能仅启用distributed就认定权限实现存在。核对profile替补排除、配置、许可证与依赖，形成实际安装/启动admission。
3. 使用专属开发数据库、组织与测试资源，避免覆盖S01保留对象；端口在启动前查占用。账号仅限该隔离环境。
4. 建立s02_editor、s02_viewer及可调整授权的管理员（可复用真实实例现有管理员）；生成随机凭据并仅保存于本机安全配置/密码管理器，报告仅记录locator与账号角色，禁止凭据进入Dashboard。
5. 基准：editor拥有固定报告编辑和D1访问；viewer仅报告查看且不可读过滤配置；管理员调整/撤销并在测试后恢复基准。可增无数据权身份覆盖拒绝。
6. 记录基准授权快照及撤销/恢复结果。账号持续保留，登录会话正常到期，不设永久Token；跨标签退出/换用户再登录不得恢复旧剪贴内容。

## 声明边界

上述为待执行方案，账号/部署状态NOT_CREATED / NOT_STARTED（未创建/未启动）。权限AC仍NOT_RUN。未获模块前不绕过权限、不改替补实现伪造多用户。
