# Query Schema Lifecycle Matrix Design Review r002

- Review card: `S02-QUERY-ADAPTER-FIELD-LIFECYCLE-DESIGN-REVIEW-r002`
- Card SHA-256: `b33d313cf6f15dcda8ea307fb9797752fa9409e755f90121e0100857c832777f`
- Context SHA-256: `96dd36c08ef593a2e739eccd0f361e68fc6a33d8be380b0204d81c85832660e7`
- Goal SHA-256: `f562da2eb14b84dc8083e138dd2eb8718a58041f01d08163eddf5fb2c71daef0`
- Review mode: Delta Review against r001
- Write scope: this review report only

## Verdicts

- **Design Freeze Validity: PASS WITH FINDINGS（仅确认 r002 字段清单及边界增量；不冻结完整产品 schema）**。r002 关闭了 r001 的逐键清单缺口，并把动态 unknown 的执行结果统一为写入前拒绝；但默认值摘要与 fixtures 的副作用断言仍有小范围不一致，完整多形态 schema 仍是显式 unknown。
- **Implementation Entry Readiness: FAIL（不能据此启动产品 Builder）**。QSLR-02 被 r002 正确保留为未关闭项；矩阵仍不是具有完整输入/输出和运行提交 oracle 的精确子合同。
- **Overall Verdict: BLOCKED**（限于完整设计冻结及产品 Builder）。本审查不签发 admission。

## Baseline and coverage verification

卡片校验通过；卡片、Context 与 Goal 摘要均匹配。Context required read set 全部匹配，其中 r001 独立报告、r002 矩阵和 fixtures、`options.ts`、`Select.vue` 均未漂移。复验了父 Goal 分母及本卡指定字段和异步选择源码。

对 `options.ts:8-65` 的新建对象和 `options.ts:80-137` 的 `attributes` 逐键核对后，r002 fixture 的 `known_default_field_inventory` 有 64 个唯一顶层字段路径，和源码两处的 64 个唯一字段路径完全相同；`name` 为新建对象的简写属性，亦已列入。`attributes.timeRange` 的 12 个直接子键与 `nested_time_range_field_inventory` 一一匹配，均有候选动作。矩阵中的分组行仍可读出逐字段动作，包含 `showError`、`auto`、参数边界和所有 `attributes` 字段。动态 `checkedFieldsMap*` 后缀、参数对象内部字段及未识别历史键明确为 `UNKNOWN_SCHEMA_OR_KEY → REJECT before write`，不把当前可见清单说成完整历史 schema。

父 Goal 的 10 项 AC、26 项 must-have、16 项产品义务及零个批准 Scope Delta 均保持。真实权限来源和隔离多用户环境不可用；只读用户不可查看/复制/粘贴及撤权/恢复仍为 `BLOCKED / NOT_RUN`。本 Delta Review 不提升任何产品验收或 Goal 状态。

## r001 finding disposition

| Finding | Delta verdict | Evidence and boundary |
|---|---|---|
| QSLR-01 — known field inventory | **CLOSED for the declared options.ts inventory** | r002 fixture 的 64 个唯一字段与源码新建/default + attributes 集合一致，且嵌套 `timeRange` 12 键全覆盖。`showError`、`auto`、`valueSource`、参数和旧树未知键均明确写前拒绝。该结论仅是清单覆盖，不证明合法 shape 或历史版本完整。 |
| QSLR-02 — precise sub-contract / builder ladder | **OPEN by design** | r002 明示仍是广域发现矩阵，要求未来单独选择唯一 shape、完整 input/output、目标能力、ID 映射和提交 oracle。此保留避免把不完整字段形态永久拒绝后冒称 Goal 完成；当前 Builder 仍不准入。 |
| QSLR-03 — enum default absent from target | **PARTIALLY CLOSED; one stale statement remains** | QSL-007 已唯一规定保留默认意图、运行值重置、候选展示无效、解决前阻止确认且目标/历史/预览/查询不变；QSL-015 与用户裁定分开，精确规定迟到 C 只核对一次、结束 loading、仍缺时保留并显示无效。`Select.vue:356-377,846-871` 与 QSL-015 的成功响应路径吻合。但矩阵第39行仍称策略“按未决策略显式显示无效或拒绝确认”，与 r002 顶部决策和 QSL-007 的确定 oracle 冲突。 |
| QSLR-04 — unknown key result | **PARTIALLY CLOSED; case-level side-effect oracle is incomplete** | QSL-008 已固定 `REJECT` 和 `UNKNOWN_SCHEMA_OR_KEY`，并断言目标值、cascade、history cursor、preview count、query count不变；QSL-014 也固定 unknown、REJECT 和无目标 mutation。统一政策及矩阵第61行列出 snapshot count 等副作用，但 QSL-008 缺 `snapshot_count_unchanged` 和 preview identity 断言，QSL-014 仅写 `target_mutation:false`，没有历史、快照、预览和查询不变断言。因此不能说两例已完整证明 QSLR-04 所要求的整组零副作用 oracle。 |

## Findings and minimum disposition

### QSLR2-01 — P2：默认值摘要仍允许互斥处理策略

**Evidence:** `QuerySchemaLifecycleMatrix-r002.md:9` 与 fixture QSL-007（`QuerySchemaLifecycleMatrixFixtures-r002.json:245-267`）已确定“保留无效候选并阻止确认”；但矩阵第39行仍写“选项缺失按未决策略显式显示无效或拒绝确认”。

**Impact:** 读者若只读生命周期表而未读顶部增量说明，会按两种不同 UX / 提交语义实现同一字段，弱化维护者已裁定政策。

**Minimum action:** 将第39行改成与 QSL-007 完全一致的单一规则：保留意图、展示 invalid、未解决不得确认，且目标配置与副作用不变。迟到枚举 C 继续只由 QSL-015 表述，保持两个触发条件分离。然后对该文本差异做一次轻量 Delta Review。

**Disposition:** OPEN; blocks exact default-value policy freeze, not inventory coverage.

### QSLR2-02 — P2：QSL-008/014 逐例副作用 oracle 未覆盖统一政策的全部不变项

**Evidence:** fixture 的 `unknown_key_policy.unchanged_on_reject` 声明目标 propValue、cascade、history cursor、snapshot count、preview count、query count不变；QSL-008 expected 未列 snapshot count 或 preview identity；QSL-014 expected 仅列 `target_mutation:false`。矩阵第130、140行要求失败时目标、历史、预览及查询均保持不变，QSLR-04 增量说明也要求 fixture 断言这些副作用。

**Impact:** 全局政策虽清楚，单个测试输入仍不能区分“只拒绝目标写入”与“错误追加历史/改变预览/触发查询”的实现，无法作为完整负例 oracle。

**Minimum action:** 在 QSL-008 和 QSL-014 的 expected 中逐项断言 `target_propValue/cascade`、history cursor、snapshot count、preview identity/count、query count 不变；保留 `UNKNOWN_SCHEMA_OR_KEY` 的诊断与写前拒绝。改后复验 fixture JSON 及策略一致性，再决定 QSLR-04 是否可关闭。

**Disposition:** OPEN; blocks deterministic complete unknown-key negative oracle.

## Late C decision and source correspondence

用户裁定的 late-response C 与“复制默认值在目标枚举缺失”属于不同事件。QSL-015 锁定原始请求仍有效、初次成功枚举缺 C、用户选择 C、只发一次验证请求；验证返回结束 loading，C 存在则刷新并有效，不存在则保留选择并显示无效；观察本身不发查询。源码 `Select.vue:249-287` 在选择改变时更新 runtime generation；`356-377` 在初始响应仍当前且选择已变化时，仅在 C 缺失的分支调用 `beginObservationVerification`；`846-871` 对验证响应判定 C 并通过 `setObservationState` 设置 valid/invalid/unverified、结束 loading，不因观察调用查询。该源码对照仅为静态一致性检查，不宣称本轮重新运行产品行为或替代其独立 Validation。

QSL-007 则针对配置迁移：默认值属于用户配置意图，目标枚举没有该值时保留为 invalid candidate，阻止确认，修复前目标状态及历史/预览/查询无变化。此例的预期目前足以表达独立政策；矩阵第39行需按 QSLR2-01 清掉旧的未决分叉。

## Remaining boundary

r002 对候选字段清单的逐键覆盖和 unknown 写前拒绝边界达到本次 Delta 的接受范围；`timeRange` 子键也已完整列出。QSLR-02 的精确子合同、运行提交、保存重开、权限、安全和历史兼容仍未闭合。当前可声明的仅是“r002 字段 Inventory 增量通过逐键复核并带两项 P2 finding”；不得声明完整 schema 冻结、产品实现/验收、权限通过或 S02 完成。不得签发 Builder admission。
