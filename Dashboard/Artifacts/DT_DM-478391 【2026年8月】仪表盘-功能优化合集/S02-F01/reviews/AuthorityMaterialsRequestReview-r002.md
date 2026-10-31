# 权威材料准备包独立语义评审 r002

## 第 2/3 轮结论

同一 authority-materials-package 交付物的第 **2/3 轮**；文件修订号不重置预算。**材料包就绪性：NEEDS_REVISION（需有界修订）**。原 10 项中 7 项关闭、AM-06 未关闭、AM-08 与 AM-Q02 部分解决；新增 1 项 blocking（AM-09）与 1 项 non-blocking（AM-10）。没有因首个 blocker 提前返回。

这些结论仅适用于材料请求/接收模板。完整设计冻结、权限行为、产品实现准入及 Goal 验收均不由本报告确认。identity/fencing/time authority 仍未知，真实权限 BLOCKED / NOT_RUN；10 项 Goal AC、26 项 must-have、16 项产品义务和 Scope Delta none 不变。

## 输入、校验与限制

卡片 `planning/authority-materials-review-card-r002.json` canonical SHA-256 `a7e8d8db0c28b29d9208d4d117be8c272fe34198999097ef10029dcc7f2cc651` validate 通过，已读取 renderer。Context Bootstrap SHA-256 `8767c945db91cc489b353cb16578eee95b2d7db9d5c74de75dc2a4ce95bf0eb0`。本轮覆盖绑定完整读集、原始意图/Goal、三份 DG-02 review、r004、权限环境/S01、r001 全量 findings、目标包/JSON、源码引用与工作区；大文件按有关调用/执行记录核对，不将其解释为整仓审计。没有将卡片 schema 通过替代语义审查。

写前 required-read **28/28 条目摘要一致（26 个唯一文件，Goal 与 r004 各重复一次）**；卡片全部直接绑定亦一致。源码与前轮绑定相同。HEAD `1e84e7438462e5d6fc371358da3bdad7d24a5c1a`，未初始化 de-xpack gitlink `9242ff482dc33c5e4c80e7fca5c3bf72c741c478`；现有大量工作区修改保持原状。无安装、构建、服务启动、运行行为测试或私有源码读取。只写本报告。

下文 MD=`AuthorityMaterialsRequest-r002.md`，JSON=`planning/AuthorityMaterialIntakeTemplate-r002.json`，行号均为绑定版本。

## 原 10 项 disposition 全量对账

| ID | 本轮 disposition | 证据与剩余影响 |
| --- | --- | --- |
| AM-01 / P1 | CLOSED（文档要求修复） | MD:57–61、JSON:58–86 已分开冻结的失败保留与消费资格，不重开失败保留政策。来源引用质量另见 AM-09，关闭不代表实现通过。 |
| AM-02 / P2 | CLOSED（请求覆盖修复） | MD:83–101 与 JSON:178–278 已列齐 11 个场景；统一目标/保存态/消费资格/提示/四类 delta，通知/存储/时间异常均显式列出。请求表与接收槽位联合使用可定位需求；未知 evidence 不被预填通过。 |
| AM-03 / P2 | CLOSED（条目结构修复） | JSON:131–162 提供 evidence ID、kind、owner、locator、version/digest、获取方式、支持/不支持范围、场景/predicate、脱敏及 contract/runtime 分类槽位；不再混用 source_or_owner。空白示例不是已取得证据。 |
| AM-04 / P2 | CLOSED | JSON:110,116–117 将事实 null 与禁止政策分离；127–128 条件清单 NOT_PROVIDED/null，未知不冒充否定事实或零条件。 |
| AM-05 / P1 | CLOSED | MD:9,79、JSON:167–175 按 artifact 独立 2/3，禁止改名重置；没有把 DG-02 上限套整个 S02。跨记录 artifact ID 一致性见 AM-10。 |
| AM-06 / P2 | OPEN / non-blocking | MD:45–46 仍原样要求 fencing token 与签名契约；MD:92 虽写等价 fencing，未解除前文强制措辞。建议统一为具体 token/版本或可核验等价机制，以及有版本的 owner 认可记录，避免无意强制新签名体系。 |
| AM-07 / P2 | CLOSED（模板准备层） | MD:73、JSON:96–117 已补启停、端口、重置/恢复、角色矩阵和 refs，明确禁止凭据 URL/连接串、正常会话过期、禁止永久 Token。S01 保护继续受 Goal.continuation 约束；尚无实际环境安全验证。 |
| AM-08 / P3 | PARTIALLY_ADDRESSED / non-blocking | MD:28 已有正确准备 Context 链接；尚未明确其写前 Sessions 与当前审查快照区别，也未链接当前审查 Context。正式输入匹配，不构成当前摘要漂移。建议标“历史准备快照”并提供当前快照入口。 |
| AM-Q01 / P2 | CLOSED（问题已澄清） | MD:67、JSON:119–129 明确只限当前 S02 切片依赖的 S01 F01 条件，不要求 S01 全功能终态；CONDITIONAL 保留具体条件。 |
| AM-Q02 / P3 | PARTIALLY_ADDRESSED / question | MD:57–63 区分既定与未决；但 MD:63/JSON:92 把概览/细化映射列作未知维护者决策，MD:101 又明确概览索引、细化场景来源。建议删除待决列表中的重复项或准确限定仍未确定的 Cases 顺序；逻辑预览次数还应引用既有 Design 候选并标其未冻结层级，不假装已验收。 |

关闭数仅指原材料包 findings：AM-01/02/03/04/05/07/Q01 共 7 项。不关闭历史 DG-02 authority findings 或 Goal AC。

## Blocking：AM-09 / P2 — 冻结要求的来源锚点无法准确解析

- 位置：JSON:58–82 的 frozen_goal_requirements.source_ref。
- 事实依据：`Goal.final.json#business_rules`、`#Q009`、`#acceptance`、`#must_haves` 不是该 JSON 的实际键路径。实际业务规则位于 `sections.business_rules`，产品 AC 在 `must_have_ledger` 中按 requirement_id 定位。JSON 位于 planning，亦未说明路径基准。MD 已正确区分既定要求，但当前 refs 没有达到材料包声称的精确可追溯来源。
- 影响：维护者/reviewer 不能按这些引用直接定位依据；自动或手工复核可能把自行撰写的断言当冻结 Goal 原文。尤其 read_refresh_retry 的“retry”概括应明确来自不续期不变量，不能假定 Goal 有该原词。
- 建议：使用仓库相对路径加实际 JSON Pointer，或明确的 requirement_id 选择规则；分别绑定 sections.business_rules、Q008/Q009/Q012/Q014/ORIG-01 等实际条目，必要时注明派生解释。已有 Goal SHA 继续保留，不修改 Goal。不是要求新增 validator。
- Disposition：OPEN / blocking，阻断“来源精确、完整可直接使用”的材料包结论；不阻止接收现有材料。

## Non-blocking 新项：AM-10 / P3 — 跨记录标识不一致

- 位置：JSON:169；审查 Context.artifact_review_budget.artifact_id；card.topology.task_id。
- 事实依据：模板用 `S02-F01-AUTHORITY-MATERIALS`，Context 用 `S02-F01-authority-materials-package`；card r002 topology.task_id 仍写 review-r001，而 Context.task_id 为 review-r002。轮次数字均明确为 2，并未发现实际重置。
- 影响：后续按 ID 汇总可能拆成两个 artifact 或误绑定上一轮；这不是材料已造假或审查无效的证明。
- 建议：控制面指定 canonical artifact ID 与显式旧 ID alias，修正后续 lane 的 task_id；不改写历史已冻结卡片。材料模板同步使用 canonical ID。
- Disposition：OPEN / non-blocking，不扩成新的业务门槛。

## 11 个场景核对

以下仅判定请求覆盖，不判定实际 authority 已具备。所有 scenario status 为 NOT_PROVIDED，owner/refs/support/unsupported 尚待填写，空值符合空白 intake 身份。来源类型/所需 predicate 在 MD 表，收到的来源 owner/digest 与支持范围通过 evidence_refs 关联 evidence_manifest。两个文件需配套交付，不把 JSON 单独当已完整填报的包。

| 场景 | MD 行 | 所需 authority / 观察范围 | 结论 |
| --- | --- | --- | --- |
| ID-01A | 89 | 会话/授权；跨用户及同 uid 新会话不可恢复 | 请求覆盖，未提供证据 |
| ID-01B | 90 | 登录/登出恢复与时间 freshness；本地缓存不授权 | 请求覆盖，未提供证据 |
| ID-02A | 91 | 同会话顺序/存储版本与赢家 | 明确 UNKNOWN，未臆定赢家 |
| ID-02B | 92 | 请求身份绑定与等价 fencing | 旧写不可覆盖新身份；机制未提供 |
| ID-02C | 93 | 通知丢失/乱序、写拒绝/quota 独立覆盖 | 失败保留与消费重验均保留 |
| ID-03A | 94 | 撤权恢复、prepare/commit 边界 | 不复活旧 prepare，竞态未知 |
| ID-03B | 95 | 编辑/只读/无数据权、组织/代理矩阵 | source-read/target-commit 分开，环境未有 |
| TIME-01A | 96 | 创建/校验时间、数值边界 | 比较与可信输入分开，不续期 |
| TIME-01B | 97 | 成功粘贴合同/追踪 | 成功预览与网络次数分开，时间不续期 |
| TIME-02A | 98 | 回拨/有效前跳/未来/非有限/迟到/恢复 | 独立初态类别齐全，具体 oracle 未知 |
| ID-04 | 99 | 登录/刷新迟到、重放及重复提交 | 拒绝或幂等结果待真实契约 |

MD:85 的统一观察覆盖 target_revision、已保存态、载荷可消费、提示，以及授权/提交尝试、配置写入、分析查询、逻辑预览 delta。没有再把失败零副作用写成零鉴权请求。源配置不可见仍由 Goal ORIG-01 保持；模板不是其运行证据。

## 来源与安全复核

源码表与先前已读的当前绑定版本一致：SDK 声明与加载实现不同；替补 admin/login/logout 不证明多用户权限；DB 时间当前用于 datasource/Quartz；safe-integer TTL helper 不提供可信时钟。主仓库 HEAD 与 gitlink 当前核对一致，helper 为未跟踪工作树观察。没有把运行装载、owner 契约、源码和产品行为合并成同一结论。

未见密码、Token、私钥或业务数据写入目标包。安全 locator、许可/公开边界、隔离数据库/组织/资源、角色别名、基准与恢复均保留。未知 runtime、session generation、permission version、fencing 和时钟保持 null/UNKNOWN。不得因为填写模板就启动服务、读取业务数据或宣布准入。

本轮完整 inventory：blocking AM-09；non-blocking AM-06、AM-08（部分）、AM-10；question AM-Q02（部分）；其余原项已关闭。建议在剩余第 3 轮前一次性完成这些有界澄清，不引入额外产品要求。材料包修订后也仍需真实 authority 与隔离环境证据才能推进受影响产品链。

## 完整绑定摘要

| 路径 | SHA-256 |
| --- | --- |
| `AGENTS.md` | `270940a30f462f2fb0c9a8cf2bbc1dd11750513d8f063ffc376e0e0a2640466e` |
| `.codex/skills/sge-governed-checkpoints-sp010/SKILL.md` | `b3e5d00193f88608e8deb3214071444ce89fa66431daf115b35f72fedbecbe3f` |
| `Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/DataEase_S02_F01_Loop_Goal_Draft_r001.md` | `118986e578d3afd19548abf45836a6f4d03cd70323b6edd4625d2c3cd468e8b9` |
| `Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/Goal.final.json` | `f562da2eb14b84dc8083e138dd2eb8718a58041f01d08163eddf5fb2c71daef0` |
| `Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/planning/UserIntent.md` | `e64919a69df515670a4bd0ce225ccffd59b3428222633e0e7183d202d73935c7` |
| `Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/AuthorityMaterialsRequest-r002.md` | `e9079a018755f75c75f13e3042a2fe657214aeac8a899b17d1a452201b5ac404` |
| `Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/planning/AuthorityMaterialIntakeTemplate-r002.json` | `b5e15a68ea03deca34cb52717b57fe08ac29f4d76bdc546fdfbdf920cdca9b41` |
| `Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/DG-02-IdentityGeneration-TrustedTime-Design-candidate-r004.md` | `e3eafb37c88a1c4d92bbdb815da35d5ea8602cd54ed252ec472ab6361cf25ae6` |
| `Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/reviews/DG-02-IdentityGeneration-TrustedTime-DesignReview-r001.md` | `7ced2c1db1df264da65f2eebd2dae76199db39125ac57139708df093c74eeba5` |
| `Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/reviews/DG-02-IdentityGeneration-TrustedTime-DesignReview-r002.md` | `b8d967916e6d24e9539f3781e4b182e52a3028847b27dd8b847db90b98668a18` |
| `Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/reviews/DG-02-IdentityGeneration-TrustedTime-DesignReview-r003.md` | `d1e8578f22d6958cd3ddde03bdf7dfd621658318a4a7e47f39e4efa769476050` |
| `Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/PermissionEnvironment.md` | `bf1498aa23f4f864e2c5c3d999b6b1a6044849ba25a9cd7d7d85104b6f233b9d` |
| `Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/SP-005/S02-S09_EntryPacket.md` | `4598a5d74567e1e1d3de81ce263909231dc054d8102535bc0d917238c412c658` |
| `Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/Sessions.md` | `0b2c0ab23029bdb83455630ab36b9928ab8d5691606c6967999e7b16005e0af9` |
| `sdk/api/api-permissions/src/main/java/io/dataease/api/permissions/auth/api/AuthApi.java` | `f51dd4cdd76b28c4e9618eb06aba08a42c2b1db916568aa6d343098aabd5d06d` |
| `sdk/api/api-permissions/src/main/java/io/dataease/api/permissions/auth/api/InteractiveAuthApi.java` | `4689e9ec1eaf1c9573462de71e4290a2b0e0ce464094fff21f2da36cf01fe63d` |
| `sdk/api/api-permissions/src/main/java/io/dataease/api/permissions/auth/api/ResourceAuthApi.java` | `4555a5fcd67e83f7f27fcc4cc6b1fc512c039cfdf41d71de4a68ea666dfec06c` |
| `core/core-backend/src/main/java/io/dataease/substitute/permissions/user/SubstituteUserServer.java` | `d1ad0833e7b8e1c8604cc8f26bb9fb9fff80c22836441513f89ed60d04b49d1a` |
| `core/core-backend/src/main/java/io/dataease/substitute/permissions/login/SubstituleLoginServer.java` | `88bc3cd9e72697e72726f25dfde3adaae9d2331ffc8902356a316fd08c383ad4` |
| `core/core-frontend/src/store/modules/user.ts` | `b6deca80ca5e6590fdaebffe7105db62a30db2a76bdb90418d29f64267885fdc` |
| `core/core-frontend/src/utils/logout.ts` | `878cb98f412c6c9263d615aaa59a1b7eb6aeaa18c41259f09861a517897d3434` |
| `core/core-backend/src/main/java/io/dataease/datasource/manage/DatabaseTimeManage.java` | `87cc563d477754329cc530e948a3cf491a7812698c8bcf0fd6f915bfd99ecdd8` |
| `core/core-backend/src/main/java/io/dataease/datasource/server/DatasourceServer.java` | `3138ce6d1ba7cc7a103cda25aa98b45f9510b00a0835d8bb255541a2c3dd5a3c` |
| `core/core-frontend/src/custom-component/filter-copy/pure-guards.ts` | `579bfaf261b3d9a2325554f2e21f6ac44c7bd3a66f611661d97bcd05188de844` |
| `.gitmodules` | `720091481e34953421f42c136418c8c59852e77a4225cbab6974678554e63ca4` |
| `Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/reviews/AuthorityMaterialsRequestReview-r001.md` | `e05392a506d3b44b967c305206785e6fe1a7030071c0b2ba4244d9e3ca1e5bf2` |
