# 权威材料准备包独立语义评审 r001

## 轮次、结论与边界

本交付物第 **1/3 轮**，artifact 为 AuthorityMaterialsRequest-r001.md 与 planning/AuthorityMaterialIntakeTemplate-r001.json。历史 DG-02 三轮不是整个 S02 的评审上限，也不消耗本材料包的轮次。按当前用户澄清及正式 lane 执行。

**材料包完整性与直接使用就绪性：NEEDS_REVISION（需修订）**。共 5 项 blocking、3 项 non-blocking、2 项 questions。blocking 指不能声明该材料包完整可直接交付，不代表不得收集已有材料。**完整设计冻结/产品实现准入：本报告不提供；identity/fencing/time 与真实权限证据仍 UNKNOWN / BLOCKED / NOT_RUN。** 保留 10 项 Goal AC、26 项 must-have、16 项产品义务，Scope Delta none，不关闭任何 AC。

## 入口、读集与工作区

已 validate 并读取 renderer：`planning/authority-materials-review-card-r001.json` canonical SHA-256 `4c5132b8985be5e9c9d346189cb923081345f766cd87ff1f1a76231c3eb36bac`。绑定审查 Context Bootstrap SHA-256 `bb7ad9345f515864e66dc9a80810e5787350e75e361ba72a120206eb263995e0`。正式 full_baseline 汇总此前本轮读取及本次重读，覆盖原始意图/草稿、Goal、全部三份 DG-02 review（r003 全文）、候选 r004、环境、S01 包、治理与所有被引源码；没有因首个 blocker 提前结束。大文件 Sessions 与 DatasourceServer 按相关执行记录/被引调用上下文核对，不宣称完成其无关历史或全部业务代码审计。完整文件摘要全部校验。

准备 Context 的 Sessions 摘要是写前基线；当前 r116 追加后不再匹配旧摘要。正式审查 Context 已绑定当前 `0b2c0ab23029bdb83455630ab36b9928ab8d5691606c6967999e7b16005e0af9`，写报告前 **25/25** required-read 摘要匹配，无正式审查基线漂移。不能将旧准备摘要当最终状态凭证。

已检查 git status：工作树有既存产品、技能与大量 Dashboard 修改/未跟踪材料，本 lane 未暂存、回退或改动它们。主仓库 HEAD `1e84e7438462e5d6fc371358da3bdad7d24a5c1a`；de-xpack 未初始化 gitlink `9242ff482dc33c5e4c80e7fca5c3bf72c741c478`；pure-guards.ts 未跟踪，与包中限定一致。未安装、构建、启动服务、运行产品行为测试或访问私有实现。仅新增本报告。

下文 MD 指 `AuthorityMaterialsRequest-r001.md`，JSON 指 `planning/AuthorityMaterialIntakeTemplate-r001.json`；位置为当前绑定版本行号。

## Blocking findings

### AM-01 / P1：将已确定的失败保留约束重新当作可选业务问题

- 位置：MD:57–63；JSON:60。
- 事实依据：D3 将复制失败、超时、撤权等混为“上一份有效树是否持续可用”。Goal.sections.business_rules 已规定“复制失败保留上次有效树”；Q009 又要求身份失效后旧内容不可恢复。Review r003 明确要保留既有约束。
- 影响：维护者可能给出删除有效旧树的答案而被当新 authority；或将存储保留误作撤权后可消费，改变原合同。
- 建议：预填既有要求及来源，分开内容保留与当前授权可消费；只请求失败/部分写入原子边界及实际失效机制，不重开原业务选择。
- Disposition：OPEN，修订材料包；不改 Goal。

### AM-02 / P2：缺少完整场景到材料请求的映射

- 位置：MD A–D、JSON identity/fencing/time/business sections。
- 事实依据：r004 有 11 行细化场景；包没有逐项绑定。通知丢失/乱序、storage 拒绝/quota、未来创建值/非有限值、时间样本迟到及 freshness、保存态/提示/查询增量未形成可直接填写的对应请求；“完整用例表”不能替代明确请求。
- 影响：维护者可填完现有字段，却仍遗漏已知反例，无法客观判断材料齐备。
- 建议：增加场景 ID、待支持 predicate、所需来源类型、证据 refs、支持/不支持范围与缺失状态的映射；不扩大产品义务。下节列全覆盖核对。
- Disposition：OPEN，补映射而非伪造 oracle。

### AM-03 / P2：证据条目没有可填写结构且来源/owner 混为一项

- 位置：MD:79–80；JSON:90–98。
- 事实依据：evidence_manifest 为空且无条目示例；required_per_item 仅 source_or_owner，允许只有 owner 无可定位材料或只有来源无责任人。缺 evidence ID、精确 locator、证据类型、predicate/场景 refs 与不支持范围。MD 要求的信息无法稳定落入模板。
- 影响：收到材料无法可靠连接 source_evidence_refs，也容易把维护者声明当运行验证。
- 建议：提供空白条目格式，分别列 owner、source locator、version/digest、retrieval method、authority scope、unsupported scope、redaction、evidence kind、scenario/predicate refs；无需新增复杂 DSL 或自动化验证器。
- Disposition：OPEN，影响直接填写与后续追溯。

### AM-04 / P2：未知事实预填为 false，空列表完整性不明确

- 位置：JSON:80、88、100。
- 事实依据：尚无实例材料却预填 permanent_token_created=false；这与 unknown_values_must_remain_null 不一致。remaining_conditions=[] 无法区分尚未收集和确认没有条件。
- 影响：空白模板可被错误汇总为已确认安全或无剩余条件。
- 建议：将不得创建永久 Token 的政策与是否创建的事实分开，后者未知保留 null；条件列表带 NOT_PROVIDED/complete 等明确完整性状态。
- Disposition：OPEN。不是断言当前已创建永久 Token。

### AM-05 / P1：评审轮次作用域与当前用户澄清不一致

- 位置：MD:9、81；JSON:103–107；Sessions r115/r116 为关联背景。
- 事实依据：包沿用 DG-02 used=3/max=3，并写 Review/论证“总轮次”上限；当前正式用户意图明确按每个交付物计算，材料包本轮是 1/3。
- 影响：可能把材料接收、包修订与后续独立验证全部误阻断，或以换文件名规避同交付物上限。
- 建议：按稳定 artifact ID 记录 round/max/scope，明确历史 DG-02 与当前材料包不同；修订同材料包继续计数，不重置。真实材料核验与其他交付物按其实际范围路由，不将上限套整个 S02。
- Disposition：OPEN；这是当前已明确的授权边界修正，不需再问用户轮次含义。

## Non-blocking findings

### AM-06 / P2：具体 token/签名措辞可能强加实现机制

- 位置：MD:45–46。
- 依据/影响：直接要求 fencing token 与“签名的维护者契约”，此前设计允许可比较版本或等价保证；未说明签名格式，可能使无独立 token 的有效实现被误判缺失。
- 建议：接受可核验的等价 fencing 保证及有版本的 owner 认可记录，区分声明契约和实际运行能力；不要求新增签名体系。
- Disposition：OPEN / non-blocking，推荐一并澄清。

### AM-07 / P2：环境模板未完整承接文字清单

- 位置：MD:73–75；JSON:66–80。
- 依据/影响：JSON 缺启动方式、端口、重置步骤、角色验证矩阵、环境 evidence refs；凭据 locator 已要求但应明确不包含凭据 URL/连接串。可能造成填写遗漏，而非现有秘密泄漏证据。
- 建议：补齐这些槽位及保护 S01 保留资源说明；保留隔离数据库/组织/资源、最小账号范围、撤权后恢复、正常会话到期和禁止永久 Token。账号别名与安全 locator 即可，不索取秘密。
- Disposition：OPEN / non-blocking；未发现本包含实际秘密。

### AM-08 / P3：Context 导航与快照层次不够精确

- 位置：MD:28。
- 依据/影响：“同目录 Context Bootstrap”没有精确链接，实际在 planning；准备快照含写前 Sessions 摘要，与交付状态不同。
- 建议：明确链接准备 Context，另引用审查/交付快照；不改写历史快照冒充当前证据。
- Disposition：OPEN / non-blocking。正式审查的当前摘要已匹配，非审查输入漂移。

## Questions（非自动 blocker）

### AM-Q01 / P2：S01 终态材料是否限定 F01 相关条件

位置 MD:67–69、JSON:82–88。Goal.entry 允许明确已满足条件的 CONDITIONAL，且禁止以其他功能验收为无差别门槛。包目前未明确终态证据的范围。请在包中限定 F01 及影响当前切片的条件/owner/证据，不要求 S01 全功能终态。本问题可由既有 Goal 澄清，不应再次索取相同用户实施授权。Disposition：OPEN clarification。

### AM-Q02 / P3：区分作者澄清、既有要求和真正待裁定规则

位置 MD:55–63、JSON business_semantics_authority。表优先级是作者澄清；成功即时预览已有 Goal 约束，一次逻辑预览有 Design 候选依据；底层请求次数和并发赢家仍待具体契约。请分别列 owner、已有来源、待确定部分，避免所有项均交外部维护者重做产品决策。Disposition：OPEN clarification；不自行冻结一次逻辑预览为已验收事实。

## 全部场景覆盖核对

| 场景 | 包内现有请求 | 完整性判断 |
| --- | --- | --- |
| ID-01A U→V→U | B 登录/登出/切换 | 部分；需显式不可恢复及证据引用，不只记录事件名。 |
| ID-01B 旧标签恢复 | C 休眠/离线/刷新 | 部分；身份重验与时间重验需分别绑定。 |
| ID-02A 同会话竞争 | D4 赢家规则 | 有请求；不能预填新旧意图或完成时间赢家。 |
| ID-02B 身份切换迟到 | B/D4 | 有概括；需会话绑定、迟到写入及载荷版本 predicate。 |
| ID-02C 通知/存储故障 | D3 存储失败 | 缺通知丢失/乱序及 quota 等逐例绑定，原有效树保留见 AM-01。 |
| ID-03A 撤权恢复 | A/B 撤权、prepare/commit | 覆盖主要问题；需检查/提交边界、恢复不自动复活旧请求。 |
| ID-03B viewer/无数据权/组织代理 | A/B 与角色矩阵 | 部分；明确 source-read 和 target-commit 分别拒绝，配置不可见与 UI 隐藏不同。 |
| TIME-01A 边界与重复读取 | C TTL 边界 | 部分；需预填不续期约束、区分纯比较和可信输入。 |
| TIME-01B 成功粘贴 | D2/D5 计数 | 有请求；需成功预览、时间不延长、保存态保持与拒绝零副作用分开。 |
| TIME-02A 时间异常独立初态 | C 误差/设备时间/恢复 | 部分；未来值、非有限值、有效前跳、迟到样本 freshness 与独立初态未逐项列出。 |
| ID-04 迟到/重放/重复 commit | D4 | 有请求；需证据类型、拒绝或幂等结果、版本及副作用明确。 |

跨场景共同观察项：当前身份/权限/时间绑定，载荷是否可消费，目标配置及已保存状态，成功提示，授权/提交尝试与业务写入/分析查询/逻辑预览的分项 delta。原包只覆盖其中一部分，不能以通用字段宣称 oracle 完整。

## 可保留的事实与声明

源码表的 API 签名、替补 admin/login/logout、数据库时间用途、纯 TTL 比较均与被引源码一致。纯 helper 实际还校验 safe integer；包的纯整数比较概括没有将其提升为可信时钟。HEAD、gitlink 和未跟踪 helper 边界已核。未把 SDK 接口或 profile 当已加载权限实现。

包已明确不接收密码/Token/私钥/业务数据，私有实现不应复制到公开仓库；真实运行 evidence 与 owner 契约仍需区分。来源、版本、许可与公开边界要求方向正确。未知 authority 不被填成已有能力，完整分母和产品 claim ceiling 保留。

材料包完成与权威材料取得是不同谓词；本轮只形成问题清单。后续应一次性处理全 inventory，再在本 artifact 预算内复核，不能以发现单一 blocker 为由省略其他问题，也不以清单修订完成取代真实权限/时间运行验证。

## 读集摘要清单

以下为正式 full_baseline required-read 的完整文件摘要；全文件哈希只用于输入身份，不能冒充整仓代码审计。另读取准备 Context 以核对材料来源与写前状态。

| 路径 | SHA-256 |
| --- | --- |
| `AGENTS.md` | `270940a30f462f2fb0c9a8cf2bbc1dd11750513d8f063ffc376e0e0a2640466e` |
| `.codex/skills/sge-governed-checkpoints-sp010/SKILL.md` | `b3e5d00193f88608e8deb3214071444ce89fa66431daf115b35f72fedbecbe3f` |
| `Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/DataEase_S02_F01_Loop_Goal_Draft_r001.md` | `118986e578d3afd19548abf45836a6f4d03cd70323b6edd4625d2c3cd468e8b9` |
| `Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/Goal.final.json` | `f562da2eb14b84dc8083e138dd2eb8718a58041f01d08163eddf5fb2c71daef0` |
| `Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/planning/UserIntent.md` | `e64919a69df515670a4bd0ce225ccffd59b3428222633e0e7183d202d73935c7` |
| `Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/AuthorityMaterialsRequest-r001.md` | `06388f2def961067bace8057ace287c0cd6ee1b3aca03b3a4aca3e7790d138ae` |
| `Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/planning/AuthorityMaterialIntakeTemplate-r001.json` | `8fe9cac74153f11321d63fae05a68fc5fe083b38163bf145911d128a6d308076` |
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
