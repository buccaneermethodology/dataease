# S02 F01 权威材料准备包 r001

## 用途和声明边界

本包把 DG-02 Review r003 尚未关闭的 authority 缺口，和当前工作树中能直接核实的源码事实，整理成可交付给维护者填写/提供的材料清单。它是**材料请求与接收模板**，不是身份、权限、fencing、时钟或产品语义的权威本身。

S02 原分母仍为 10 项 Goal AC、26 项 must-have、16 项产品义务，`Scope Delta: none`。真实权限验收仍 `BLOCKED / NOT_RUN`；产品 Builder 尚未准入。用户已授权在确认可用的隔离权限实例后建立并保留测试账号；该授权不补足权限实现来源，也不允许把密码或 Token 写入本包。

DG-02 Review r001、r002、r003 已达到三轮上限。此包不启动第四轮、不生成 DG-02 r005 候选；r003 的 findings 只在取得新的权威来源后按既定边界继续，不靠文档推演替代缺失 authority。

## 已核实的本地来源事实

以下只是当前可访问源码在对应提交/工作树中的事实。接口定义、standalone 替补实现和纯比较函数均不能证明真实权限或协议行为。

| 来源 | 可核实事实 | 不能据此推断 |
| --- | --- | --- |
| `sdk/api/api-permissions/src/main/java/io/dataease/api/permissions/auth/api/AuthApi.java:35-70` | 定义 subject/resource permission 查询与保存 API 签名。 | XPack 的具体授权规则、撤权即时性、请求身份或提交时 fencing。 |
| `sdk/api/api-permissions/src/main/java/io/dataease/api/permissions/auth/api/InteractiveAuthApi.java:69-81` | 定义内部 `checkAuth`；默认 `checkShareAuth` 抛出 `UnsupportedOperationException`。 | 实际加载的权限实现及其读、prepare、commit 边界。 |
| `sdk/api/api-permissions/src/main/java/io/dataease/api/permissions/auth/api/ResourceAuthApi.java:26-35` | 定义已授权用户与 subject 查询签名。 | 角色继承、组织/代理权限和撤权传播语义。 |
| `core/core-backend/src/main/java/io/dataease/substitute/permissions/user/SubstituteUserServer.java:22-50` | 条件替补服务返回固定 admin 身份。 | 多用户或只读权限行为；不得用作权限验收。 |
| `core/core-backend/src/main/java/io/dataease/substitute/permissions/login/SubstituleLoginServer.java:19-58` | 条件替补登录只接受 admin，logout 仅记录日志，Token 只写 uid claim 且返回 exp=0。 | 真实登录注销、会话代际、Token 到期或服务端撤权行为。 |
| `core/core-frontend/src/store/modules/user.ts:11-23,69-82,94-140` | 前端缓存 token、uid、oid、exp、time、proxyInfo 等字段；`clear()` 删除相应本地键。 | 服务端会话撤销、跨标签一致性、fencing 或缓存失效的权威协议。 |
| `core/core-frontend/src/utils/logout.ts:12-60` | logout 清理前端 Store/cache，并可能跳转 OIDC/CAS/custom logout URL。 | 目标认证端是否撤销会话，或其它标签/请求已被 fencing。 |
| `core/core-backend/src/main/java/io/dataease/datasource/manage/DatabaseTimeManage.java:17-33` 与 `DatasourceServer.java:1382-1404` | 可从数据库 dialect 取时间戳；当前调用用于 datasource/Quartz 状态判断。 | 该数据库时间就是 S02 剪贴载荷的可信时钟或 30 分钟 TTL authority。 |
| `core/core-frontend/src/custom-component/filter-copy/pure-guards.ts:40-44` | TTL helper 对传入 `createdAtMs`、`nowMs` 作纯整数年龄比较：`0 <= age < ttl`。 | 参数来自可信时钟、刷新/休眠期间的防回拨能力，或服务端授权仍有效。 |
| `.gitmodules:1-3` 与 `git submodule status de-xpack` | 声明 `de-xpack` gitlink；当前固定 gitlink 为 `9242ff482dc33c5e4c80e7fca5c3bf72c741c478`，子模块未初始化。 | 私有实现当前可读、可构建或已加载。 |

本次源码快照基线：主仓库 HEAD `1e84e7438462e5d6fc371358da3bdad7d24a5c1a`。其中 `pure-guards.ts` 是未跟踪工作树文件；本包对它仅作工作树局部观察，不将其说成 HEAD 已包含内容。其余源码摘要与 required-read 摘要见同目录 Context Bootstrap。

## 待提供的权威材料

请由对应维护者/系统 owner 提供以下来源或填写同目录 `planning/AuthorityMaterialIntakeTemplate-r001.json`。允许提供私有仓库受限位置、受控构建产物或安全配置 locator；不需要、也不要在聊天或 Dashboard 中粘贴密码、Token、私钥或真实业务数据。

### A. 权限实现及运行加载证明

- 可授权读取的权限模块仓库/本地安装包位置、目标 V3 分支或版本、精确 commit/digest、许可证与可公开范围。
- 实际 POM/模块装配和部署 Profile，运行时实际加载的 Bean/实现类证据；说明替补实现为何被排除。只设置 `distributed` Profile 不足以证明实现存在。
- 真实身份、组织、角色、资源授权的实现入口；查询和提交各自在哪一层校验，拒绝码/响应是什么。
- 权限撤销后，已有会话、已准备的操作和正在提交的操作分别怎样处理；恢复授权是否使旧载荷/旧请求重新有效。

### B. 身份、会话代际与 fencing authority

- 真实 principal 字段定义：用户、组织、代理身份、会话/Token 标识；哪些字段是稳定身份，哪些版本/代际由服务端签发。
- 登录、登出、换用户、换组织、代理上下文改变、权限撤销/恢复、Token 续期时，哪些版本递增/失效；不发生变化的情形也需明确。
- source-read、prepare、target-commit 各自验证的身份/权限快照，以及检查与提交之间如何防止撤权竞态；fencing token 的生成方、作用域、比较时点和 stale 处理结果。
- 证据需来自实际权限模块或签名的维护者契约，并带版本/commit；不能把候选 ID-01..04 场景本身作为 authority。

### C. 可信时间与 30 分钟 TTL authority

- S02 载荷创建和校验分别使用哪一权威时钟：服务端 wall clock、数据库时钟或其它实现；是否有单调时钟/抗回拨约束。
- 允许的时间误差/漂移、载荷 freshness、创建时间和到期时间绑定方式；TTL 边界 `1799999/1800000/1800001 ms` 的期望结果。
- 页面休眠、浏览器恢复、设备时间变化、离线后恢复、刷新后验证的权威行为；失败时旧有效剪贴树如何保留。
- DB 当前时间查询的现有用处不能自动作为本功能的时间协议；必须提供具体调用链或由 owner 明确的契约。

### D. r003 已明确的业务 oracle

以下是需要权威确认或提供已存在来源的决策点，不由实现者自行选择：

1. 原概览表和补充场景表的关系：哪些行是说明性概览，哪些行是唯一执行用例/初始化顺序。
2. 计数分别记录：授权/提交尝试、成功的配置写入、分析查询、逻辑预览。服务端拒绝可能有一次请求，但不能产生业务写入/查询；禁止把“零副作用”偷换成“零鉴权请求”。
3. 复制失败、超时、撤权、乱序、存储失败时，上一份有效复制树是否持续可用；覆盖必须有明确原子边界。
4. 同会话 A/B 竞争时的赢家/排序规则；登录或刷新迟到、重放和重复 commit 的拒绝或幂等结果，以及是否存在服务端 nonce/幂等键。
5. TIME-01B 成功流程中逻辑预览次数的权威期望值；与底层网络/API 请求次数分开定义。

### E. S01 F01 入口状态材料

- S01 F01 Entry Packet 的当前版本及完整材料摘要。
- 独立终态 Review/Validation 报告与 Stop Gate receipt（若仍为 `CONDITIONAL`，明确未满足项和唯一责任 owner）。
- 对应 DataEase 源码 revision / 子模块 gitlink revision，便于确认 S02 依赖是否改变。

## 隔离环境交付边界

取得权限模块后，先确认真实装载方式和专用隔离数据库/组织/资源，再启动实例。现有 `127.0.0.1:7070`、backend `8100`、`dataeasev3` 与 standalone `admin` 不能替代此环境。

准备环境清单至少包含：隔离实例地址/启动方式、后端与前端版本、权限模块 commit、数据库独立性、组织和固定测试资源、端口、重置/恢复步骤、编辑者与只读者角色验证矩阵。测试账号可按用户已授权的范围建立并长期保留；只在材料中记录角色、账号别名和安全凭据 locator，不记录秘密。权限撤销用例结束后恢复约定基准权限；不创建永久 Token。

## 接收后如何继续

1. 将收到的证据登记到 intake JSON 的 `evidence_manifest`，逐项记录来源、commit/digest、owner、获取方式和脱敏状态；缺失项保持 `null` / `NOT_PROVIDED`。
2. 比对 A/B/C 的实现来源与 S02 使用路径；标出每项 authority 能支持的具体 predicate 和不能支持的场景，更新依赖映射，不改 Goal 原分母。
3. 更新 F01 完整用例表，覆盖全部未决 oracle；完成一次全范围增量复核。Review/论证总轮次仍受三轮上限约束，不能因材料到达自动开启第四轮。
4. 只有实际权限实现、身份/fencing 与可信时间 evidence 满足 Goal/设计依赖后，才推进受影响的共享存储和产品 source-read/target-commit Builder。此材料包本身不提供 Builder admission。
5. 后续 reviewer/validator 必须检查整个绑定读集、全部 findings、反例和依赖，不得发现首个 blocker 即提前返回；每轮输出完整 issue inventory、逐项 disposition 与 claim ceiling。

## 当前状态

权限实现来源：`NOT_PROVIDED`；真实隔离权限环境：`NOT_AVAILABLE`；身份/fencing authority：`UNKNOWN`；可信时间 authority：`UNKNOWN`；S01 F01：`CONDITIONAL`。此状态只描述当前已核对输入，不推断维护者没有其他来源。
