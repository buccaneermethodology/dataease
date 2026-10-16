# B2a 本机启动结果

记录时间：2026-10-15T10:19:00.604596+00:00。用户已批准 RuntimeEvidencePlan-B2-startup.md。

- 启动前：8100无监听；本机元数据库与Redis配置沿用A预检。1个数据源经数据库内解密分类确认host为loopback，不输出配置或密钥。第一次AES-256分类不适用；按实际16字节密钥改用AES-128后，JSON有效与本机目标计数均为1。
- 两个Quartz任务：CheckDsStatusJob；ClusterQuartzJobBean数据包含schedular/updateStopJobStatus标记，与源码定时任务匹配。标记分类不是完整序列化对象审计。数据源任务0、导出任务0、运行触发器0；示例对象ID之外对象计数0，不据此声明示例内容从未修改。
- 按批准命令启动当前B1 Jar，PID 76215；日志报告6.015秒启动成功；lsof证实仅127.0.0.1:8100监听；GET / HTTP 200。
- 日志显示InitSqlListener找到group 2的3个SqlBlock，group 1/3无SqlBlock警告；不把这些日志等同每条迁移实际执行或全库升级验证。观察到系统core_api_traffic清理DELETE；启动初始化、调度、数据库、缓存及日志写入已获授权，未逐行审计写入差异。
- 未发现本轮日志ERROR级记录或APPLICATION FAILED；存在BeanPostProcessor、Cglib代理、open-in-view、SpringDoc等警告，不能据启动成功宣称无风险。
- 完成检查后向本轮PID发送SIGTERM，执行会话exit 143；再次检查8100无监听。未停止MySQL/Redis。
- 原始日志仅本机/private/tmp/dataease-sp005-b2a-startup.log；Dashboard保留筛选片段，不复制业务配置或凭据。

证据：B2a-local-target-check-r002.json、B2a-encoding-check.json、B2a-target-classification.json、B2a-startup-excerpts.txt。仅证明本机后端启动与HTTP连通。10条产品运行见证仍NOT_RUN；未登录、未创建fixture、未导出、未启动前端或验证移动设备。
