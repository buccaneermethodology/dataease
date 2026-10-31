# S02 F01 权威材料准备包 r002

## 用途和声明边界

本包把 DG-02 Review r003 尚未关闭的 authority 缺口，和当前工作树中能直接核实的源码事实，整理成可交付给维护者填写/提供的材料清单。它是**材料请求与接收模板**，不是身份、权限、fencing、时钟或产品语义的权威本身。

S02 原分母仍为 10 项 Goal AC、26 项 must-have、16 项产品义务，`Scope Delta: none`。真实权限验收仍 `BLOCKED / NOT_RUN`；产品 Builder 尚未准入。用户已授权在确认可用的隔离权限实例后建立并保留测试账号；该授权不补足权限实现来源，也不允许把密码或 Token 写入本包。

DG-02 设计交付物已完成其自身 3/3 轮评审；该上限只约束 DG-02 交付物，不约束本材料包或整个 S02。当前材料包为独立交付物第 2/3 轮（r001 review 已完成）。不得改名重置本包轮次；新证据到达后按受影响交付物独立记录轮次。

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

本次源码快照基线：主仓库 HEAD `1e84e7438462e5d6fc371358da3bdad7d24a5c1a`。其中 `pure-guards.ts` 是未跟踪工作树文件；本包对它仅作工作树局部观察，不将其说成 HEAD 已包含内容。其余源码摘要与 required-read 摘要见同目录 [准备 Context Bootstrap](planning/ContextBootstrap-AuthorityMaterialsPreparation-r001.json)。

## 待提供的权威材料

请由对应维护者/系统 owner 提供以下来源或填写同目录 [intake 模板 r002](planning/AuthorityMaterialIntakeTemplate-r002.json)。允许提供私有仓库受限位置、受控构建产物或安全配置 locator；不需要、也不要在聊天或 Dashboard 中粘贴密码、Token、私钥或真实业务数据。

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

### D. 既有业务 oracle 与真正待决规则

以下 Goal 已冻结要求不得重开为待维护者裁定；只请求可定位来源或实现细节。仅真正没有权威来源的结果保持 `UNKNOWN`：

**已冻结要求：**复制失败时保留上一次有效复制树（Goal business_rules）；身份/会话失效后旧内容不可消费或恢复（Goal Q009）；拒绝不得改变目标配置、产生成功提示或触发分析查询；成功路径保留 Goal 规定的即时预览；读取、刷新和重试不得续期载荷；真实权限拒绝必须在服务端发生。保留内容与消费资格是两个独立谓词：旧树可以被保留，但失效身份无权消费。

**只需提供来源/执行边界，不重开产品政策：**存储失败/部分写入的原子边界、拒绝时分项计数口径、旧树持久化位置及身份重验入口。

**真正待决、需对应 owner 给出 authority：**同会话 A/B 竞争的排序/赢家；迟到响应、重放和重复 commit 的拒绝或幂等结果及服务端支持；TIME-01B 的逻辑预览次数（底层网络/API 请求数单列）；概览行与细化场景的执行映射。不得由作者或实现者臆造。

### E. S01 F01 入口状态材料

仅提供 S02 当前切片所依赖的 S01 F01 进入条件，不要求 S01 所有功能进入终态。请给出：Entry Packet 当前版本及 digest；F01 相关条件的独立 Review/Validation 与当前 Stop Gate receipt；每项未满足条件、唯一责任 owner、证据与预期满足点；对应源码 revision 与子模块 gitlink revision。若状态仍为 `CONDITIONAL`，保留具体条件，不把空列表解释为“无条件”。

## 隔离环境交付边界

取得权限模块后，先确认真实装载方式和专用隔离数据库/组织/资源，再启动实例。现有 `127.0.0.1:7070`、backend `8100`、`dataeasev3` 与 standalone `admin` 不能替代此环境。

准备环境清单至少包含：隔离实例安全 locator、启动/停止方式、前后端 revision、权限模块 commit/digest、Profile 与实际加载 Bean 证据、独立数据库/组织/资源证明、端口、重置/恢复步骤、编辑者/只读者/管理员角色矩阵、基准授权快照、撤销后恢复流程、环境证据 refs。凭据仅记录安全凭据存储 locator（不得写入凭据 URL、连接串或秘密）。账号可按用户已授权的范围建立并长期保留；会话按正常策略到期；不得创建永久 Token。是否已创建 Token 是待观察事实，未核实前填 `null`。

## 接收后如何继续

1. 将收到的证据登记到 intake JSON 的 `evidence_manifest`，逐项记录来源、commit/digest、owner、获取方式和脱敏状态；缺失项保持 `null` / `NOT_PROVIDED`。
2. 比对 A/B/C 的实现来源与 S02 使用路径；标出每项 authority 能支持的具体 predicate 和不能支持的场景，更新依赖映射，不改 Goal 原分母。
3. 更新 F01 完整用例表，覆盖全部未决 oracle；完成一次全范围增量复核。评审轮次按稳定交付物 ID 独立计数，任一交付物最多 3 轮；收到新证据不自动重置其轮次，也不消耗其他交付物轮次。
4. 只有实际权限实现、身份/fencing 与可信时间 evidence 满足 Goal/设计依赖后，才推进受影响的共享存储和产品 source-read/target-commit Builder。此材料包本身不提供 Builder admission。
5. 后续 reviewer/validator 必须检查整个绑定读集、全部 findings、反例和依赖，不得发现首个 blocker 即提前返回；每轮输出完整 issue inventory、逐项 disposition 与 claim ceiling。

## 场景到权威材料映射

请在 intake JSON `scenario_authority_map` 中逐项填写以下场景。每一行都需要 `status`、精确 `evidence_refs`、支持范围和不支持范围；未提供材料时使用 `NOT_PROVIDED`，不得空白即推断通过。统一观测 `target_revision`、保存态、payload 可消费状态、成功提示，以及授权/提交尝试、配置写入、分析查询、逻辑预览四类 delta。

| 场景 ID | 所需权威 / 证据 | 需支持的 predicate / 当前缺口 |
| --- | --- | --- |
| ID-01A | 身份/会话来源，服务端授权检查记录 | 跨用户、同 uid 新会话均不得恢复旧载荷；身份失效时不可消费。 |
| ID-01B | 登录/登出与恢复语义、时间 freshness 来源 | 休眠/离线/刷新后重新验证；本地缓存本身不授权。 |
| ID-02A | 同会话操作顺序或存储版本契约 | A/B 竞争赢家目前 `UNKNOWN`；提供既有合同，不能由材料包定政策。 |
| ID-02B | 请求身份绑定与旧操作提交防护证据 | g1 迟到写不得覆盖 g2；需要等价 fencing authority。 |
| ID-02C | 存储调用/错误边界与通知实现 | 通知丢失/乱序及写拒绝/quota 独立覆盖；失败保留旧树，旧树消费仍须通过当前授权。 |
| ID-03A | 权限撤销/恢复与 prepare/commit 服务端校验 | 撤权后拒绝；恢复不复活旧 prepare。检查与提交竞态边界未知。 |
| ID-03B | 编辑/只读/无数据权及组织/代理实际权限矩阵 | source-read 与 target-commit 分别验证服务端拒绝；目前环境 `NOT_AVAILABLE`。 |
| TIME-01A | 可信创建/校验时间及 TTL 契约 | 1799999/1800000/1800001 ms 数值比较与可信输入分开；读/刷新不续期。 |
| TIME-01B | 成功粘贴合同及调用追踪 | 成功预览按既有 Goal 保留；逻辑预览次数待确认，网络/API 请求另计；时间不续期。 |
| TIME-02A | 时钟来源、freshness/漂移与恢复契约 | 回拨、有效前跳、未来创建、非有限值、迟到样本、休眠恢复逐项独立；具体时间 oracle 未知。 |
| ID-04 | 登录/刷新响应、重复提交的服务端契约和运行记录 | 迟到响应不可覆盖当前身份；重放/重复 commit 拒绝或幂等结果待权威定义。 |

概览表只作入口索引，细化场景表为唯一场景 ID 与独立初态来源；执行顺序以冻结的 Cases 合同为准，不从材料表推断。

## 当前状态

权限实现来源：`NOT_PROVIDED`；真实隔离权限环境：`NOT_AVAILABLE`；身份/fencing authority：`UNKNOWN`；可信时间 authority：`UNKNOWN`；S01 F01：`CONDITIONAL`，当前仅确认与本切片相关的条件材料尚待绑定。此状态只描述当前已核对输入，不推断维护者没有其他来源。
