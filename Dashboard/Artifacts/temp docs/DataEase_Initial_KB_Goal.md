# DataEase Initial KB — Goal v0.1（待审查）

**目标仓库：** https://github.com/buccaneermethodology/dataease  
**默认分支：** `dev-v3`（已通过 GitHub 读取确认）  
**状态：** Design Draft；仅提出建设目标与验收要求，不授权修改仓库。  
**源基线：** 执行前必须冻结具体 commit SHA。

## 一、目标与范围

基于仓库当前指定 revision 的**文档、源代码、构建配置、数据库脚本、测试与运行部署材料**，建立首版可追溯的知识库 KB v0.1，支持后续 AI 辅助开发、系统理解、代码定位、变更影响分析与独立验证。

KB 应回答：产品做什么；由哪些业务能力构成；这些能力如何落到前端、API、服务、数据与测试；关键运行和权限约束是什么；哪些事实已证实，哪些仍是推断或知识缺口。

**不在本 Goal 内：** 产品功能开发、重构、修复、发布、生产部署；未授权时不得推送 GitHub。执行日志、任务状态与授权记录不能冒充产品知识真源。

## 二、当前已确认事实与审查边界

已通过 GitHub 读取：仓库元数据、`README.md`、`pom.xml`、`core/pom.xml`、`LICENSE`、`docs/README.en.md`。README 将 DataEase 描述为开源 BI 工具，提供数据源连接、拖拽图表和分享；列出的技术栈包括 Vue、Element、AntV、Spring Boot、Univer、MySQL、Calcite、SeaTunnel、Docker。根 POM 声明 Java 21、Spring Boot 3.5.15、DataEase 3.2.0，包含 `sdk` 模块；`core/pom.xml` 列出 `core-frontend` 和 `core-backend`。许可证是带附加条件的 GPLv3 衍生许可，限制修改 Logo/版权信息。

**注意：尚未全量枚举和审查所有目录、代码与测试。** 上述技术栈与功能属于项目声明，不能据此直接断言实现完整或运行正确。以下各领域是拟提取框架，不是已经验证的实现清单。

## 三、KB 内容框架

| ID | 知识域 | 必备内容 | 核心产物 |
|---|---|---|---|
| K00 | Governance & Provenance | 仓库/commit 基线、知识对象模型、来源与证据、版本、更新规则、事实状态 | Source Ledger、KB Contract |
| K01 | Product & Business | 产品定位、角色、场景、功能树、术语、业务规则、端到端流程 | Product Map、Capability Map |
| K02 | Architecture | 前后端/SDK/服务/基础设施、模块职责、依赖、启动入口、关键调用链 | Architecture Map、Module Index |
| K03 | Domain & Semantic Capability | 领域实体、语义能力单元、输入输出、前后条件、状态转换、不变量、失败模式 | Domain Model、Capability Contracts |
| K04 | Data & Persistence | 数据源、数据集、字段/指标、数据库 schema、SQL/迁移、缓存、数据流、血缘 | Data Dictionary、Data Flow |
| K05 | API & Integration | HTTP API、内部接口、SDK、扩展点、鉴权、错误契约、第三方集成 | API Catalog、Integration Map |
| K06 | Frontend & UX | 页面/路由/组件、状态管理、图表/仪表板编辑、交互流程、前后端契约 | UI Map、User Journeys |
| K07 | Security & Access | 身份认证、权限、资源隔离、凭据、安全边界、审计 | Security Model、Risk Gaps |
| K08 | Build & Runtime | 构建模块、依赖、环境配置、启动部署、Docker、日志、升级与故障定位 | Runbook、Configuration Catalog |
| K09 | Quality & Verification | 测试架构、测试与功能映射、CI、覆盖范围、回归/边界场景、可验证性 | Test Map、Verification Ledger |
| K10 | Evolution & Change Impact | 扩展点、兼容约束、关键变更历史、能力到代码/测试的影响路径 | Change Impact Map |
| K11 | Gaps & Contradictions | 未知、证据不足、文档代码不一致、缺失测试、待核实推断 | Knowledge Gap Register |

### K03：语义能力单元的最小要求

每个 Capability 至少描述：`id`、名称、业务目标、触发条件、输入、输出、前置条件、状态变化、后置条件、不变量、异常/失败分支、权限约束、实现入口、依赖模块、数据对象、测试证据、未知边界。候选能力可从数据源连接、数据集建模、查询、图表生成、仪表板编排、分享、权限管理等场景开始发现，但**须通过代码核实后才认定为 implemented**。

### K00/K11：证据与不确定性规则

每条事实保留 `source_repo`、`source_revision`、`source_path`、行号/符号、`evidence_type`、`status`、`confidence`、`last_verified_at`。建议状态：`documented`（仅文档声明）、`implemented`（代码证实）、`tested`（测试证实）、`inferred`（推断）、`unknown`（未知）、`conflicted`（冲突）。不同状态不能自动互相升级。未找到证据时必须记录 Gap，不得编造事实填补。

## 四、知识关系模型

至少支持以下可追溯关系：

- `PRODUCT_HAS_CAPABILITY`：产品 → 能力。
- `CAPABILITY_REALIZED_BY`：能力 → 代码模块/实现入口。
- `MODULE_DEPENDS_ON`：模块 → 模块。
- `API_EXPOSES_CAPABILITY`：API → 能力。
- `UI_CALLS_API`：页面/组件 → API。
- `CAPABILITY_READS_WRITES_DATA`：能力 → 数据对象。
- `IMPLEMENTATION_COVERED_BY_TEST`：实现 → 测试。
- `FACT_SUPPORTED_BY_EVIDENCE`：事实 → 文档/代码/测试证据。
- `CHANGE_IMPACTS`：变更 → 受影响对象。
- `GAP_BLOCKS_CLAIM`：缺口 → 无法成立的结论。

关系不得仅凭命名相似建立；无法证实的关系须显式标记为推断。

## 五、建议的物理组织（Doc-as-Data）

采用 **JSON canonical truth → 确定性 Markdown/图谱投影**；执行状态单独存放。目录为拟议目标，不表示仓库中已存在：

```text
kb/
  README.md
  schema/
    entity.schema.json
    relation.schema.json
    evidence.schema.json
    gap.schema.json
  data/
    governance/
    product/
    architecture/
    domain/
    data/
    interfaces/
    frontend/
    security/
    operations/
    quality/
    evolution/
    evidence/
    gaps/
  generated/
    overview.md
    capability-map.md
    architecture.md
    module-index.md
    data-flow.md
    api-index.md
    change-impact.md
    gaps.md
  tools/
```

`kb/data` 是知识真源；`kb/generated` 仅为可再生投影，不允许手工修改投影后反向覆盖真源。工作流状态、审查记录、运行日志可放在独立 `Dashboard/` 或 execution-state 区域，不与产品事实混用。工具与 Schema 设计可参考 `doc-system-kb-builder` 的理念，但不得未经核对即宣称兼容该 Skill 的现有合同。

## 六、建设阶段与验收门槛

### P0 — Baseline & Full Inventory

冻结 `dev-v3` 的具体 commit；全量盘点文件、目录、模块、文档、配置、数据库脚本、测试、CI 与依赖。记录已读、未读、排除、不可访问文件；识别生成物、第三方代码、二进制及敏感信息，严禁把秘密写入 KB。

**Gate：** 提交 Source Inventory、Coverage Ledger、revision 和排除清单；不能把部分读取描述为全量理解。

### P1 — Product & Architecture Discovery

从文档建立产品/业务声明，从代码独立建立模块、入口、依赖、运行架构，交叉比对并记录冲突。

**Gate：** 核心产品能力和架构对象有证据链接；文档声明与实现证据明确分层。

### P2 — Semantic Extraction & Mapping

按业务场景而非文件清单提取语义能力；建立能力 → UI/API → Service → Data → Test 的映射，梳理关键正常/异常路径与状态变化。

**Gate：** 高优先级能力具有可导航的端到端证据链；缺失环节显式标记 Gap。

### P3 — Independent Validation & Gap Review

执行 Schema 校验、引用完整性、重复实体检测、证据定位核查；对抽样能力做独立语义审查，检查遗漏、错误归属、错误推断与夸大声明。静态检查、测试运行与业务正确性必须分开评价。

**Gate：** 输出结构校验报告、独立语义复核结果、冲突和 Gap 清单；不能用结构 PASS 代替语义正确。

### P4 — KB v0.1 Candidate & Review

生成结构化 KB、导航、架构图、能力图、数据流与 Gap 报告；绑定 source revision、提取工具/配置、模型/Prompt/Skill 版本（如适用）及产物 digest。提交独立 Review；仅在另行授权后落库、合并或发布。

**Gate：** 产物可重复生成、证据可回溯、版本可比较、未知边界清楚。

## 七、优先级与初始完成定义

**Must-have：** K00、K01、K02、K03、K04、K05、K09、K11 的核心骨架及高优先级能力证据链；K06–K08 至少形成导航、关键事实与 Gap。K10 至少具备基本影响关系，详细历史演进可后续深化。

**Definition of Done（全部满足才可声明 Initial KB 完成）：**

1. 输入基线固定，Inventory 对审查范围和排除项可核对。
2. K00–K11 各领域均有明确内容或明确标注的缺口，不存在静默空白。
3. 核心业务能力能追踪到代码实现位置；无法追踪者不宣称已实现。
4. 关键接口、数据对象、模块和测试建立跨域关系；关系有证据或推断标签。
5. 所有核心知识对象通过 Schema/引用校验，投影可确定性重建。
6. 独立语义复核记录具体样本、结论、错误与未验证边界。
7. 文档与代码冲突、测试不足、未知机制进入 Gap Register。
8. 完成 KB v0.1 Candidate、Review Report、Coverage Ledger 和 provenance manifest。
9. 对“可用于后续开发”的声明限定为知识导航和有界辅助；不暗示代码质量或生产就绪已获认证。

## 八、风险与约束

- **仓库规模风险：** 先 Inventory，再分层分域抽取；避免一次性将全仓输入模型造成遗漏和上下文污染。
- **代码与文档不一致：** 两条证据轨道独立提取，冲突显式呈现。
- **语义幻觉：** 事实必须绑定源码/文档/测试定位；推断与未知不得伪装为事实。
- **大规模重复提取：** 使用 source digest 和分域增量更新，但缓存命中不能代替语义复核。
- **安全与许可证：** 不复制密钥/真实凭据；保留许可证约束，尤其 Logo 和版权条款。
- **执行边界：** 本 Goal 是只读知识建设设计；任何运行测试、写仓库或发布均须明确授权。

## 九、后续维护策略

每次代码变更按 `changed files → modules → capabilities → APIs/data/tests → KB facts` 计算影响范围；更新受影响的知识对象和证据 revision，标记旧证据失效；对变更相关能力做增量语义复核。定期检测 dangling references、证据失效、知识冲突与 Gap 收敛情况。

## 十、建议的下一步

1. 对本 Goal 做独立 Design Review，确认 KB 的范围、对象合同、证据标准和初始优先级。
2. 执行只读 P0 仓库全量盘点，补齐当前尚未审查的目录和代码结构。
3. 根据 P0 结果冻结 KB Schema 与高优先级能力列表，再启动 P1–P3。
4. 形成候选 KB v0.1，独立验证后再申请落库授权。

---

**GitHub 已读取的参考入口：**
- [Repository](https://github.com/buccaneermethodology/dataease)
- [README](https://github.com/buccaneermethodology/dataease/blob/dev-v3/README.md)
- [Root POM](https://github.com/buccaneermethodology/dataease/blob/dev-v3/pom.xml)
- [Core POM](https://github.com/buccaneermethodology/dataease/blob/dev-v3/core/pom.xml)
- [License](https://github.com/buccaneermethodology/dataease/blob/dev-v3/LICENSE)
