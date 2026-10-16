# 构建与测试基线（未运行）

| 项目 | 当前证据 | 状态/限制 |
|---|---|---|
| 前端 | package.json有dev/ts:check/build:base/distributed/lib，无统一test | NOT_RUN；Vite/vue-tsc文件存在不代表依赖完整 |
| dev代理 | config/dev.ts：7070，/api转localhost:8100/de2api，/api/f去前缀 | NOT_RUN，不证明当前监听 |
| 前端构建 | build:base/distributed后执行build:flush，其中npm i及文件生成 | 本轮不自动执行 |
| 后端 | Java21；standalone/desktop/distributed；Surefire显式skip=true | NOT_RUN，mvn test返回成功也不能推定测试运行 |
| 启动副作用 | standalone/desktop配置含ddl-auto:update；InitSqlListener为ApplicationRunner | 确认隔离库/迁移范围前不启动 |
| 既有产物 | target/classes和CoreApplication.jar存在 | 源码版本映射UNKNOWN，不以mtime认定 |
| 权限方法回归 | tests/visualization-read-security/README.md：独立Java调用并模拟权限提供方 | 本轮NOT_RUN；即使执行亦不代替真实身份端到端 |
| 浏览器测试结构 | tests/pie-label-overflow有Vite与Playwright真实渲染入口 | 仅设施参考，饼图不是S01表格证据 |
| 服务/数据 | debugging_env.md历史MySQL认证失败、需核验Redis隔离 | A阶段方案待确认，不声明当前失败或可用 |

运行记录必须单列命令、输入、环境、预期/实际、日志、执行是否成功及行为是否符合。静态读取与确定性治理脚本不属于产品测试。
