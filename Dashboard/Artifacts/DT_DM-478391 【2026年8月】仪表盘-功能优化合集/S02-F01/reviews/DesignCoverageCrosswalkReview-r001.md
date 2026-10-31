# DesignCoverageCrosswalk r001 独立语义复核

## 双结论

**Design Freeze Validity：`REVISION_REQUIRED_FOR_COMPLETE_TRACEABILITY`。** 16 项产品 AC 与冻结 `CoverageMatrix` 分母一致；Q/REQ/BR/DEC/Issue 关联整体与来源映射相符，设计引用也大多可定位。但 `AC-F01-ORIG-02` 指向当前不存在的 S01 Entry Packet 路径；并且 crosswalk 将 `TC-AC-*` 误称为 Acceptance Criteria 中登记的验收 ID，实际登记表是 `CoverageMatrix.test_ids`。这两处应最小修订后再评估完整追溯有效性。本结论不关闭或整体通过 `AC-S02-02`。

**Implementation Entry Readiness：`NOT_READY_FOR_PRODUCT_UI_STORE / SOURCE_READ / TARGET_COMMIT`。** 当前 Goal 的产品 Builder 前置仍要求 S01 F01 Entry Packet、独立审查与终态证据摘要，并要求真实权限及隔离验证环境。权限来源/多用户环境不可用，相关验收继续 `BLOCKED / NOT_RUN`；本 review 不签发 Builder admission。

## 复核基线与身份

Lane Card `S02-F01-DESIGN-COVERAGE-CROSSWALK-review-r001` SHA-256 `6f1d22436e49869ab675dc7de239a67b6d7a2e8bb71cc44ce6f413cb74085285` 经 `lane_task_card.py validate` 验证通过；ContextBootstrap 校验通过。17 项 required-read 摘要全部匹配，`skipped_reads=[]`。本报告是完整基线语义复核；按卡片限制，仅写本 review，不修改 crosswalk、Goal、CoverageMatrix、需求来源或代码。

## 来源映射、设计定位与测试登记

- crosswalk 包含 16 个唯一 AC ID，与 `CoverageMatrix.json` 16 行逐一对应：14 项 F01 AC、`AC-F04-Q066/Q067` 两项关联约束。Q004–Q015、Q066/Q067 的 Q/REQ/BR/DEC/Issue 关联与 AcceptanceMapping、DecisionLedger、AcceptanceIssues 相符；原始 AC-ORIG-01/02 没有独立 Q/REQ/BR/DEC 映射，crosswalk 没有伪造这些编号；`ISS-AC-01/02/12` 也挂在对应条目。
- 表中除 `SP-005/Resume-r004/S01EntryPacket.md` 外，设计文件路径均在 S02-F01 目录中存在；`CompatibilityMatrix.md` 的对应 AC 行也可定位。所缺路径不能由 `SP-005/S02-S09_EntryPacket.md` 替代：后者标注为调查中、未获实施批准，并非当前所需的 S01 F01 终态 Entry Packet。
- `CoverageMatrix.json` 的 `test_ids` 字段登记了 16 个 `TC-AC-*`；`AcceptanceCriteria.md` 本身没有这些 TC 标识。两份来源分别登记验收谓词/Fixture 与 test ID，不应合称为“Acceptance Criteria 中登记的验收 ID”。`FX-COPY`、`FX-CASCADE` 可定位到 `SP-004/Resume-r004/FixtureSpec.md` 的规格段落，但 fixture 规格和 TC 注册都不是可执行的产品测试脚本。
- `TestStrategy.md` 明确本轮仅建立规格、未运行产品测试；CoverageMatrix 16 行均为 `NOT_RUN`、`result=null`、`evidence=[]`。因此 crosswalk 每行 `NOT_RUN` 的状态正确，不能把已有窄纯模块测试或 fixture/TC 登记提升为 16 项产品验收。

## 范围、状态与准入边界

`Goal.final.json` 的 26 项 must-have 包含 10 项 `AC-S02-01..10`，当前均为 `pending`；CoverageMatrix 的 16 项义务均未运行，批准 Scope Delta registry 为空。Crosswalk 明确保留 10/26/16 与 `Scope Delta: none`，且声明本文件不作 AC-S02-02 关闭决定。`AC-S02-02` 与 `AC-S02-03` 在 Goal ledger 中仍是 `pending`；本次 review 也不更新其状态。

`PermissionEnvironment.md` 记录没有可访问的真实权限模块来源/公开契约，也没有隔离多用户实例及持久测试账号。crosswalk 将只读用户禁止查看/复制/粘贴与撤权验收维持为未验证，并明确不以 standalone/admin/mock 替代，符合证据上限。

S01 边界需要按 Goal 解释：Goal 的 mission/continuation/entry 条款仍要求先绑定具体 S01 F01 Entry Packet、独立审查及终态证据摘要。crosswalk 保留了该具体前置和 ORIG-02 的历史回归边界。与此同时，被广泛引用的 `Design.md` 第 9 行写有“父流程通知S01已收尾”和“不得继续以‘S01未收尾’作为总阻塞”；这与 Goal 中“S01仍在收尾”的 authority 不一致。该通知没有附独立终态回执，不能据此解除 F01 Builder 的具体前置。crosswalk 修订时应保留此区分，不能让相互冲突的 S01 描述隐式变成 ready。

## Findings 与最小处置

| ID | 严重度/状态 | 依据与影响 | 最小修复 |
|---|---|---|---|
| `DCX-001-01` | `P2 / 可修复` | `AC-F01-ORIG-02` 行引用 `SP-005/Resume-r004/S01EntryPacket.md`，该文件当前不存在；因此这条历史入口/回归设计追溯不可按给定路径复核。附近的 `SP-005/S02-S09_EntryPacket.md` 是未获实施批准的调查候选，不能冒充目标前置。 | 将该单元改为当前真实、可定位且适用于 F01 的 S01 Packet 路径；若该 Packet 尚无终态版本，则明确记为 `NOT_AVAILABLE` 并把历史回归证据保持为待绑定，不保留失效链接。 |
| `DCX-001-02` | `P2 / 可修复` | crosswalk 第 7 行称 `TC-AC-*` 是“Acceptance Criteria 中登记的验收 ID”；实际 AC 文档未包含 TC 标识，TC 位于 `CoverageMatrix.test_ids`。表格虽正确保留 `NOT_RUN`，但来源归属描述不准确，会混淆验收谓词来源与测试注册表。 | 将该说明改为 TC ID 由 CoverageMatrix 登记；继续将 FixtureSpec 的 fixture 标识、可执行测试资产和运行/验收证据分开表述。 |
| `DCX-001-03` | `FOLLOW_UP_REQUIRED / AUTHORITY_RECONCILIATION` | 所引用 `Design.md` 第 9 行记录 S01 已收尾的未附回执通知，与 Goal 的当前 S01 收尾状态/具体 F01 Entry Packet 前置存在冲突。虽 crosswalk 保留了具体前置，但若沿用该设计文字解除 Builder 门槛会越权。 | 后续重核并澄清 Design.md 的 S01 状态来源；在权威状态与具体 Packet/Review/终态摘要绑定前继续保持 `NOT_READY`。不要求本 lane 修改 Design.md。 |

## 最终边界

本候选的 16 项范围、来源映射主体和 `NOT_RUN`/权限 claim ceiling 大体符合冻结输入；以上两处可修复追溯问题使完整 crosswalk 暂需修订，故 Design Freeze Validity 为 `REVISION_REQUIRED_FOR_COMPLETE_TRACEABILITY`。这不表示产品行为或任何 Goal AC 验收失败/通过，也不改变 10 项 Goal AC、26 项 must-have、16 项产品义务或 `Scope Delta: none`。真实权限验收仍 `BLOCKED / NOT_RUN`；S01 F01 前置仍须按 Goal 逐项提供与绑定；`AC-S02-02/03` 均保持 `pending`。
