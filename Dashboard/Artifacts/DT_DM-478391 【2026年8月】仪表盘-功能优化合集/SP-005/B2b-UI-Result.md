# B2b 前端入口检查（部分完成）

记录时间：2026-10-15T10:29:06.075417+00:00。用户已批准B2b，授权持续有效。

按方案启动后端PID78755、前端PID78756，lsof确认分别仅监听127.0.0.1:8100/7070。Vite使用已有依赖，无安装。浏览器首次在服务启动前访问收到连接拒绝，服务启动后新页面正常转到 /#/login?redirect=/workbranch/index，显示Account Login、账号和密码输入框、Login按钮；本轮浏览器没有现成登录会话，未输入或猜测凭据。页面控制台error查询返回空列表；Vite有动态import分析警告，不等于全量前端验证通过。

已向用户请求测试账号名称及安全配置位置或自行登录。debugging_env.md提到admin及替代凭据位置，但明确不要读取这些值；未读取。F01–F08示例、筛选、编辑器、字段拖拽、枚举、阈值、汇总均未执行，10条关键运行仍NOT_RUN。

写入边界静态核对：CanvasCore.vue的linkJumpSetOpen、linkageSetOpen会先调用canvasSave，本阶段避开。initSnapshotTimer每秒调用snapshotCatchToStore，是快照入口，不能据此推断所有编辑操作都不写库。无产品源码修改。

已关闭本轮正常测试页，向上述两个PID发送SIGTERM；执行会话均结束。MySQL/Redis保留。运行日志本机 /private/tmp/dataease-sp005-b2b-backend.log 与 /private/tmp/dataease-sp005-b2b-frontend.log，不复制完整日志。下一步收到测试身份后按已批准B2b恢复，无需重复批准启动。
