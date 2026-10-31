# 权威材料准备包独立语义评审 r003

## 本交付物第 3/3 轮结论

canonical artifact ID：`S02-F01-authority-materials-package`。这是本材料包最后一轮，不是整个 S02 的轮次上限。

**材料包完整就绪性：NEEDS_REVISION（仍有一项来源精确性阻塞，不能声明全部 findings 已关闭）。** 全量 12 项历史 inventory：9 项关闭，AM-09 部分解决但仍 blocking，AM-08 部分解决且 non-blocking，AM-Q02 部分解决且为 clarification。未新增产品要求或新的独立 blocking finding。

材料包可用于有界收集来源，但不能当作精确引用全部正确的冻结依据；其评审预算已用完，不自动开启本包第 4 轮、不改名重置。此结果不停止整个 S02，不阻止已获准入且不依赖未决项的其他工作。真正权限/身份/fencing/时间证据仍 UNKNOWN / BLOCKED / NOT_RUN；不证明设计冻结、产品准入、权限或产品验收、Goal 完成。10/26/16 分母与 Scope Delta none 不变。

## 入口及证据复核

卡片 `planning/authority-materials-review-card-r003.json` canonical SHA-256 `ac723a6025c8a408aae5db917a3e6dfc91fe985b9cd63ef30d60b9a46089db3c` validate 通过并读取 renderer。Context r003 SHA-256 `6b8f8b1bb9a382ad419963de356e12250708cbf44fac8097413988cbf0f4643c`。覆盖 Context 完整绑定输入、r001/r002 全量 findings、DG-02 三轮与 r004、原始意图/Goal、S01、权限环境、源码引用与执行记录；不将大文件无关历史或无关业务视为已作全仓审计。

写前 **29/29 required-read 条目一致（27 个唯一文件）**，直接 bindings 一致。独立解析全部 6 个 Goal JSON Pointer，并比较 source hash 和具体条款，不只检查 JSON 可解析。新增候选引文触发扩读 `QueryProductAdapterFullShapeDesign-r001.md`，SHA-256 实算与模板 `55151a44c4d8ff2eed5893bda071e2c6e3d1ee69d8f0547ad2777e35d75fdc67` 一致；核对第 15、194 行的一次逻辑预览候选。该扩读只验证引文，不继承其历史 S01 NOT_AVAILABLE 等过时描述。

目标 MD SHA-256 `d6620e24426d18879c2e9326509f6793df85133d2e8b6d002c379f341ad97571`；JSON SHA-256 `87f37de2856e1e13a536f1e87c06d440ec80bba83f88c7cacb7e25fd58bab733`。本报告仅写指定路径，未修改材料、源码、Goal 或 S01，也未安装/构建/启动服务/执行产品验证。

## 12 项逐项 disposition

MD 指 AuthorityMaterialsRequest-r003.md；JSON 指 planning/AuthorityMaterialIntakeTemplate-r003.json。

| ID | 结论 | 依据及影响边界 |
| --- | --- | --- |
| AM-01 / P1 | CLOSED | MD D 段与 JSON frozen_goal_requirements 保留失败旧树、不续期与失效身份不可消费，并区分存储和授权；不再重开原失败保留政策。 |
| AM-02 / P2 | CLOSED | 11 个场景表与 intake 槽位全部保留，统一观察目标/保存态/消费资格/提示/四类 delta。请求覆盖不等于证据已取得。 |
| AM-03 / P2 | CLOSED | manifest 空白条目具备独立 owner/source/version/digest/kind/support/unsupported/predicate/scenario/redaction 字段，能填写和追溯；空白不是已有证据。 |
| AM-04 / P2 | CLOSED | 永久 Token 事实 null 与政策 PROHIBITED 分离；S01 条件 NOT_PROVIDED/null，不把未知填成 false 或空条件。 |
| AM-05 / P1 | CLOSED | MD 第 9 行及 JSON review_constraints 为本 artifact 3/3；不套全 S02、不因改名重置。 |
| AM-06 / P2 | CLOSED | MD B 段现允许 fencing token、单调版本、原子检查或 owner 可核验等价保证，不强制 cryptographic signature；契约/声明/运行证明明确分开。 |
| AM-07 / P2 | CLOSED | 启停、端口、重置、角色矩阵、恢复、环境 refs、安全 locator 与正常会话策略保留；没有索取秘密或凭据连接串。环境实际未验证。 |
| AM-08 / P3 | PARTIALLY_ADDRESSED / NON_BLOCKING | MD:28 仍只链接准备 Context，未指出其历史写前性质或链接当前审查快照；本轮正式 Context 一致，非输入漂移。 |
| AM-Q01 / P2 | CLOSED | MD E 段与 JSON S01 scope 限定本切片依赖的 F01 条件，不要求 S01 全功能终态。 |
| AM-Q02 / P3 | PARTIALLY_ADDRESSED / QUESTION | JSON 已去掉 overview 映射待决项，增加 Cases-dependent 说明及未冻结 preview candidate；但 MD:63 仍把概览/细化映射列为真正待维护者决策，与 MD:101 及 JSON 的已澄清规则不同。 |
| AM-09 / P2 | PARTIALLY_ADDRESSED / BLOCKING | 路径基准、hash、Pointer 语法已修；但所有条目统一指向 business_rules，其中即时预览及不发成功提示的完整依据并不在该目标字符串。详见下节。 |
| AM-10 / P3 | CLOSED | MD 交付物身份、JSON 顶层/review_constraints、Context budget 均使用 canonical ID，旧 ID 显式 alias；card/Context task_id 现均为 review-r003。Context topology.reason 残留 round2/3 说明文字，但结构化预算/入口均为 3，不作为预算重置或新 blocker。 |

## 剩余 blocking：AM-09 / P2

- 位置：JSON `business_semantics_authority.frozen_goal_requirements`，尤其第 80–85 行 successful_path_preserves_required_immediate_preview；第 73–78 行 rejected_operation_does_not_mutate_target_or_emit_success。
- 实算：6/6 source hash 正确，6/6 Pointer 可解析至 `/sections/business_rules`，但该字符串没有“即时预览”或“成功立即预览”的内容；模板填“粘贴成功后即时预览（以Goal原文条款为准）”不能补足被指向位置缺少该依据。拒绝行引用“取消/失败不变且不触发查询”只覆盖不变/查询，没有直接覆盖整个键名中的不发成功提示。
- 正确现有来源：`Goal.final.json#/must_have_ledger/20/requirement`（requirement_id=`AC-F01-Q014`）包含“成功立即预览新条件”及“取消/失败不得显示该成功反馈，目标与预览保持原状”。当前 Goal SHA 已绑定，可稳定定位。business_rules 对失败保留、不续期、登出/换用户不可恢复的引用确实有效；retry 已注明派生解释，改善可接受。
- 影响：指针合法不代表其内容支持全部断言；当前包仍不能宣称冻结来源精确追溯已全面完成。这不是否定即时预览要求本身，真实要求已在 Goal 中存在。
- 建议：将对应 refs 指向上述实际条目，必要时每一组合断言保留多个来源；不改 Goal，不新增业务决策。此次只记录剩余缺口，不擅自修复或自动开启第 4 轮。
- Disposition：OPEN，阻断完整来源准确性结论。

候选预览来源另作有限说明：QueryProductAdapterFullShapeDesign-r001.md 第 194 行确有“仅一次逻辑预览意图，不能要求只有一次底层网络请求”；模板 CANDIDATE_NOT_FROZEN 和 interpretation_boundary 正确。`#成功候选oracle` 指向的是段落标签而非 Markdown heading，浏览器 fragment 未必能跳转；可改用“失败原子性与副作用oracle”标题及段落标签/行定位。这属于 AM-09 的导航完善建议，不将真实候选文本说成缺失，不新增独立 blocker。

## 剩余 non-blocking 与 question

**AM-08 / P3：** MD:28 只给准备 Context。其 Sessions 是历史写前摘要；当前审查 Context 已绑定现态。影响仅是维护者容易混淆两个快照的用途。建议正文明确“历史准备快照”并给当前审查入口，不改写历史文件。Disposition：部分解决，未关闭。

**AM-Q02 / P3：** JSON.case_execution_order_authority 已澄清概览索引、细化 ID 和冻结 Cases 执行顺序；MD:63 仍将该映射列为待 owner 决策。建议文案与 JSON 同步，保持真正未知的赢家/迟到/重放/计数边界；无需重新请用户制定已有澄清。Disposition：部分解决，未关闭。这个不一致不授权修改原 DG-02 候选。

## 11 场景及材料边界全量核对

| 场景 | 当前请求覆盖与剩余证据 |
| --- | --- |
| ID-01A | 跨用户/同 uid 新会话不可恢复；身份/授权来源未提供。 |
| ID-01B | 休眠/离线/刷新身份及时间重新验证；缓存不授权，运行来源未提供。 |
| ID-02A | 顺序/存储版本契约，赢家 UNKNOWN，未臆定策略。 |
| ID-02B | g1 迟到写不得覆盖 g2；等价 fencing 机制未提供。 |
| ID-02C | 通知丢失/乱序、写拒绝/quota 独立；旧树保留与消费校验分离。 |
| ID-03A | 撤权拒绝、恢复不复活旧 prepare；提交竞态边界 UNKNOWN。 |
| ID-03B | 编辑/只读/无数据权、组织/代理；source-read/target-commit 分开，环境未提供。 |
| TIME-01A | 数值边界与可信输入分开、读/刷新不续期；时钟契约未知。 |
| TIME-01B | Goal 即时预览与候选一次逻辑预览分层，网络次数单列；源码引文核实，实际协议/运行未验。 |
| TIME-02A | 回拨、有效前跳、未来、非有限、迟到、休眠独立请求；具体 oracle 未知。 |
| ID-04 | 登录/刷新迟到与重放/重复 commit；拒绝/幂等结果待真实契约。 |

11/11 场景均有 NOT_PROVIDED 的接收槽位，owner、evidence refs、支持/不支持范围未填；不能据空值认定通过或不适用。manifest 能区分来源与 owner、静态契约与运行证据，scope 与 digest 仍需维护者填写。统一 target_revision、已保存态、载荷消费资格、成功提示、授权/提交尝试、写入、分析查询、逻辑预览 delta 保留；成功路径没有被误要求查询为零。

秘密保护与隔离要求保留：无密码/Token/私钥/业务数据写入，禁止凭据 URL/连接串，使用安全 locator；隔离数据库/组织/资源、角色别名、基准授权及撤权恢复、正常会话到期、禁止永久 Token 均明确。既有源码事实与权限环境/S01 证据上限不变，未将接口、替补 admin、数据库时间或纯比较器当真实权限/时间能力。

## 结束边界

只将本材料包记录为第三轮评审完成且剩余 findings 明确，不能标全部关闭或全面就绪。本轮不安排第 4 轮，也不以本包预算已满停止整个 S02。控制面应保留上述剩余问题和真实 authority 阻断；在原授权范围内继续其它满足准入的工作，不能把材料包审查换成产品验收。

## 完整读集摘要

下列为 Context 的唯一文件清单；重复 Goal/r004 条目不重复展示。全文件摘要核对不等于全仓代码审计。

| 路径 | SHA-256 |
| --- | --- |
| `AGENTS.md` | `270940a30f462f2fb0c9a8cf2bbc1dd11750513d8f063ffc376e0e0a2640466e` |
| `.codex/skills/sge-governed-checkpoints-sp010/SKILL.md` | `b3e5d00193f88608e8deb3214071444ce89fa66431daf115b35f72fedbecbe3f` |
| `Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/DataEase_S02_F01_Loop_Goal_Draft_r001.md` | `118986e578d3afd19548abf45836a6f4d03cd70323b6edd4625d2c3cd468e8b9` |
| `Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/Goal.final.json` | `f562da2eb14b84dc8083e138dd2eb8718a58041f01d08163eddf5fb2c71daef0` |
| `Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/planning/UserIntent.md` | `e64919a69df515670a4bd0ce225ccffd59b3428222633e0e7183d202d73935c7` |
| `Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/AuthorityMaterialsRequest-r003.md` | `d6620e24426d18879c2e9326509f6793df85133d2e8b6d002c379f341ad97571` |
| `Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/planning/AuthorityMaterialIntakeTemplate-r003.json` | `87f37de2856e1e13a536f1e87c06d440ec80bba83f88c7cacb7e25fd58bab733` |
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
| `Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/reviews/AuthorityMaterialsRequestReview-r002.md` | `60da087334947cd8924ad0de17266d92d17e038fa824184903f399ae843d40aa` |

条件扩读：`QueryProductAdapterFullShapeDesign-r001.md`，SHA-256 `55151a44c4d8ff2eed5893bda071e2c6e3d1ee69d8f0547ad2777e35d75fdc67`。
