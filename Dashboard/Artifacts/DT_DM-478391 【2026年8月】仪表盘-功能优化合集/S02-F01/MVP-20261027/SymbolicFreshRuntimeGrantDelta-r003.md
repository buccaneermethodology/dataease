# 新实例计划授权差异 r003

同一环境设计第3/3轮。r002方案保持，只有以下差异。首次启动因既有账号 dataease_dev@127.0.0.1 无新schema权限退出，child已reap；失败证据不改。用户已授权增加设置测试账号。

拟以已有本机管理配置执行精确 GRANT ALL PRIVILEGES ON `s02\_symbolic\_20261029`.* TO 'dataease_dev'@'127.0.0.1'; 不WITH GRANT OPTION，不全局、不改密码、不新增账号、不改原库授权。数据库名下划线按MySQL数据库授权模式转义，防同名通配。先核唯一账号、schema由本任务拥有、当前新库授权为空；执行后 information_schema.SCHEMA_PRIVILEGES严格读回指定schema模式，IS_GRANTABLE全部NO，且实际应用凭据可连接并SELECT DATABASE()=新库。未知提交不盲重试，读授权恢复。

仅授权变化；不变更新库内容。保留授权供后续开发，不自动revoke（可能影响后续使用）。重启前将首次process identity/result/log原样移至本任务私密attempt-r001目录，watchdog同字节重启且新PID；原8100/7070只读核身份。新启动仍先核三类连接才能UI。

本轮只审上述delta及r002相容性，查全问题后一次返回；方案通过不等于实施或权限验收。
