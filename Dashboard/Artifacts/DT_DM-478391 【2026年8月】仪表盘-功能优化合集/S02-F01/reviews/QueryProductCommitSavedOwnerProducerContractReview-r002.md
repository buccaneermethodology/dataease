# QPC saved-owner producer Contract/Cases r002 独立增量复核

## 双结论

**Design Freeze Validity：`PASS_WITH_BOUNDS`。** r002 关闭 r001 review 的两项合同精度注意点：授权决策已明确排除 owner snapshot；多 setter 发布具有完整观察窗、部分失败终态和新 generation 权威重载恢复规则。14 个结构化案例覆盖主要成功/拒绝分支，范围与 claim ceiling 保持明确。所有案例仍为 `DESIGN_ONLY`，不构成实现或运行验证证据。

**Implementation Entry Readiness：`READY_FOR_PRODUCER_LOCAL_ADMISSION_PREPARATION_ONLY`；产品入口仍为 `NOT_READY_FOR_PRODUCT_UI_STORE`。** 可进入下一步精确 producer-local Builder admission 材料准备，不表示该准入已签发，也不授权产品 UI/Store/source-read/target-commit 或权限验收。

## 复核基线

指定 Card SHA-256 `72517cce467a6fdcd1a2108b64b3680c4f4ad84d2af7d3eda4efe38ed5d34111` 校验通过；ContextBootstrap 校验通过，15 项 required-read digest 全匹配、`skipped_reads=[]`。已读取渲染 prompt、Contract/Cases r001 与 r002、r001 独立复核、producer 设计/源追踪、PermissionEnvironment、Sessions、PreparationStatus、Topology r222/r223。JSON 文件均可解析，Contract/Cases 的 revision、contract ID、case order 与 supersedes 关系相符。

## r001 两项注意点的处置

### Authorization 不进入 owner snapshot

r002 将 `authorization.fields` 置空，并定义授权为 owner 之外的外部契约输入；`owner_snapshot_contract.excluded` 显式列出 `principal_id`、`organization_id`、session token、source-read/target-edit authorization 布尔值与 permission decision。owner 仅保留不透明 `provider_identity_generation`，供身份变化失效比较；source-read 和 target-commit 前各自从真实 provider 读取当前主体与动作授权，不把结果写回 owner。

QPC-PROD-014 进一步以允许/拒绝/未知三种外部授权状态断言 producer 侧 source-read 与 target-commit 调用均为零。该分离足以关闭 r001 字段归属歧义。后续实现应维持这一边界；P1/P2、O1/O2 只能作为 opaque generation fixture 值，不能实现为存储 principal/organization 明文或授权票据。

### 多 setter 发布观察窗与失败终态

Contract `publication_observation_window` 覆盖：

- 旧 owner 已失效后、首个 setter 前；
- 每个 Store setter 之后；
- 最后 setter 后、mint owner 前；
- 同步 publish 返回；
- 下一 Vue render/watcher turn。

成功谓词要求所有发布内容属于同一 request generation，且只在最后 setter 成功、resource metadata/root/style/view 完整后 mint owner；成功 mint 前各观察点 owner 均为空。合同同时声明这不是当前 Pinia 的原子性事实，具体可见性屏障仍须实现与独立运行验证证明。

QPC-PROD-004 对 style setter 抛错建模：记录首 setter 前、metadata/root setter 后、失败 setter 后、同步返回及下一 watcher/render turn；终态为 owner absent、generation `publication_failed`、partial Store 不可作为 owner context、source-read/target-commit 为零；恢复必须开启新 generation 并从权威资源完整重载，合同不尝试把旧 Store 快照回滚。该用例未列“mint 前”点，是因为失败发生在最后 setter 前、根本不进入 mint；这一点与生命周期一致。前一代 owner 在新 generation 开始时先失效，故失败期不能继续用旧 owner。

Case 确认了失败后不回滚 partial Store 的明确后果：局部数据可能仍在 Store，但不得被当作有效编辑态 owner context；完整 UI/watch/render 可见性和屏障行为仍属待验证项。QPC-PROD-001 覆盖成功路径的最后 setter 后/mint 前与同步返回；Contract 的通用观察窗还要求下一 watcher/render turn。精确 admission 中应将成功路径该 tick 观察点也绑定为具体验证 oracle，避免只验证同步回执。

## 结构化案例与 oracle

14 个案例均有 `setup`、`actions`、`observation_points`、`expected`、`forbidden_calls` 和 `DESIGN_ONLY` 状态，覆盖结果如下：

| Case | 本轮检查结果 |
|---|---|
| QPC-PROD-001 | 当前 generation、saved-edit、R1/R1、完整发布后才 mint；owner/resource/root target 一致，禁止任何读取、提交或下游副作用 |
| QPC-PROD-002 | response ID mismatch 在任何发布前拒绝；Store mutations 为0，owner absent |
| QPC-PROD-003 | generation 4 的迟到响应不能覆盖 generation 5/R2 当前 Store；stale response mutations 为0 |
| QPC-PROD-004 | 多 setter 中途异常的观察窗、失败终态、owner null、无权限/读写副作用及新 generation 全量重载恢复均已明示 |
| QPC-PROD-005/006 | 同资源 cache restore 创建新 owner generation；异资源 cache 在发布前拒绝并保留 Store digest |
| QPC-PROD-007 | target missing、duplicate、raw replacement 分别对应 invalid/reason，读取和提交调用为0 |
| QPC-PROD-008/009 | 真实 provider principal/org 变化分别失效 owner；authorization decision 不进入 owner |
| QPC-PROD-010/011/012 | copy-as-new、template/blank create、preview/onlyPreview/embed 被明确排除，不把 source identity 冒充 destination |
| QPC-PROD-013 | unmount/mode exit 失效 owner，generation 只前进一次 |
| QPC-PROD-014 | 任意外部授权状态下 producer 都不执行 source-read/target-commit，授权判断留在外部 |

成功与拒绝 oracle 已针对 producer 身份发布范围明确，不把 owner mint 当作产品操作通过。拒绝路径具有 owner 状态、拒绝 reason/precedence、Store 变化和 forbidden calls 观察项；成功/拒绝均与 source-read、target-commit、permission、preview、query、save 分离。用例仍不是 executable tests：`execution_ok=null`、evidence refs 为空，Case 状态不得升级。

## Goal、分支与权限边界

Contract authority 继续指向 Goal.final：10 AC、26 must-have、16 product obligations、`Scope Delta: none`；S01 独立。正常已保存编辑与匹配资源 cache restore 是本 producer-local 候选；copy-as-new、template、blank create、preview/embed、source config 读取、copy/paste、目标提交、permission 判定、撤权恢复、preview/query/save/history 均明确排除。排除只限定此 producer contract，不删 Goal 义务。

真实 permission module 来源、公开授权 API、主体/组织 provider 与隔离多用户环境仍不可用。授权/拒绝/撤权以及产品 watcher/render 可见性继续 `BLOCKED / NOT_RUN`。standalone、管理员身份、mock、静态 `checkPer` 或 opaque generation 不可替代真实权限事实。当前合同通过不证明 producer 已实现，不证明加载原子性、不证明保存重开或任何 Goal AC。

## 精确准入准备边界

该增量足以进入**精确 producer-local admission 准备**，不等于执行准入。下一步准入材料应绑定本合同/Cases 摘要、具体 action-target 写域、同一 runner 的可信 RED/GREEN 计划、失败时 owner-null/partial Store 隔离和新 generation 权威 reload、Case 001 的 next watcher/render 观察，以及独立 Validation 范围。实际 Store 可见性屏障必须实证，不能引用静态 setter 顺序代替。

若未来扩展至产品 UI/Store/source-read/target-commit，需另建合同、Context、准入及真实权限验证矩阵；须取得授权模块/公开契约/隔离多用户环境并单独复核。此审查没有批准这些后续工作。

## 最终边界

Design Freeze Validity 为 `PASS_WITH_BOUNDS`。Implementation Entry Readiness 仅为 `READY_FOR_PRODUCER_LOCAL_ADMISSION_PREPARATION_ONLY`；产品 UI/Store/source-read/target-commit 仍 `NOT_READY`。Contract/Cases 仍是候选，producer 尚未实现；权限仍 `BLOCKED / NOT_RUN`。原 Goal 10/26/16 分母、`Scope Delta: none` 与 S01 独立状态保持不变。
