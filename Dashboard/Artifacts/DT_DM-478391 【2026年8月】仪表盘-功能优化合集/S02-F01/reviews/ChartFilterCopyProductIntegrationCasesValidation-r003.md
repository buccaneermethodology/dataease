# ChartFilterCopyProductIntegrationCases r003 独立验证报告

## 裁定

`NEEDS_REVISION / NOT_READY_FOR_PRODUCT_BUILDER_OR_RUNTIME_ACCEPTANCE`。JSON 结构、59 个案例身份、23 项状态投影及大部分请求账本字段可解析且一致；CPI-041..052 的 12 组响应 tuple 单字段变异成立。仍有 7 处 query ledger 终态不符合自身 oracle，RowAuth payload fixture 与字段合同矛盾，另有身份状态及真实权限标注缺口。文件明确 `frozen_for_builder:false`；仓库中未发现消费该 Cases 的运行器，不能称为已执行案例或产品运行证据。

真实权限用例继续 `BLOCKED / NOT_RUN`。本次只做静态独立检查，没有启动应用、测试数据库或权限环境。

## 检查范围与通过维度

- 检查对象：`ChartFilterCopyProductIntegrationCases-r003.json`，SHA-256 `5ea63ce04b3d099beb902e688abf1db48b1056e1b26df96a5fd8806fd8cfc90d`；对照 `ChartFilterCopyProductIntegrationDesign-r003.md`（`6e1f68da44ace340ebdad6b37c85ceee1c5eaf73aa173f9e881c675128628a70`）及当前 `RowAuth.vue`（`ebef31245e8525d82e6c82dbe4e83c313b74f1d9af8bae5e7d76b788eba0e775`）。
- JSON 可解析；案例 ID 为连续且唯一的 `CPI-001`..`CPI-059`，`scope_delta` 为 `none`，全部 59 个 `fixture_ref` 指向存在的 `shared_chart_fixtures`。
- `observable_state_fields` 正好 23 项。全部 59 个案例的 `initial_state` 和 `expected_state` 均逐项、无多余地投影这 23 项；initial query count 均为 0，expected query count 均等于该案例 ledger 长度。
- 40 条 `query_dispatches` 分布于 34 个案例；每案例 sequence 从 1 连续递增、request_id 在 ledger 内唯一。dispatch 事件数、request_id、payload digest 与 ledger 相符；未见悬空 dispatch 或请求引用。
- CPI-041..052 按 capture_fields 声明的 12 项逐一覆盖（含 requestId）；每个 response tuple 仅变异对应的一项，其他 11 项相同，字段集合一致。24 个摘要均与紧凑 UTF-8、按键名排序的 canonical JSON SHA-256 相符。
- preview/page lifecycle 有对应 ledger：CPI-001 将 Paste 与页面内 preview refresh 分开；CPI-028 包含未保存重载后的 chart mount query（三条 dispatch）；CPI-029 包含保存重开后的 mount query（两条 dispatch）。这些是案例预期，未在浏览器执行。
- 跨标签场景 CPI-056..059 描述 SharedWorker 同会话交付、uid/oid 隔离及 logout 清除；共享传输 fixture 明确禁止 localStorage、sessionStorage、IndexedDB、URL、Cookie、OS clipboard 和服务端持久化。这些仍只是静态场景。
- `rg` 在前端 tests/src 中未发现对 r003 Cases 的消费方；设计文件也声明案例未经执行。无法证明此 JSON 目前可由现有 runner 自动执行。

## 发现

### F-01 — 高：query request terminal outcome 缺失或重复

`case_oracle_rule` 要求每个 ledger request_id 恰有一个 `queryDispatched` 和一个 terminal outcome，terminal 集合为 `queryResolved/queryRejected/queryCancelled/queryLateIgnored`。逐项扫描发现：

- **CPI-001 `cpi-001-paste-1`：**有 `queryDispatched`，后续为 `stageQuerySuccess`、`stageRenderSuccess`、`commit`，没有集合中的终态事件。另一个 preview-refresh 请求有 `queryResolved`。若 stageQuerySuccess 表示 query 成功，需明确它与 request terminal 的关系，或为 Paste query 添加 `queryResolved`。
- **CPI-021..CPI-026 各自的 paste request：**同一 request 同时出现 `queryResolved` 与 `queryLateIgnored`。这违反“且仅一个 terminal”的明确规则。若需分别表达网络响应成功和应用层因目标/身份变化忽略，应将其中一个改成非终态响应事件名，并在 oracle 中分别定义 transport outcome 和 publish disposition。

这 7 个账本问题阻止当前版本通过完整 machine oracle 检查。

### F-02 — 高：RowAuth 序列化字段与共享 payload fixture / 设计合同不一致

`shared_chart_fixtures.source_chart.custom_filter` 的三个叶节点都缺少 `dynamicTimeSetting`；fixture 自述 `custom_filter_oracle` 却称 group 和 leaf 都包含该字段，设计 r003 也将它列入叶节点精确字段集。当前 `core/core-frontend/src/views/chart/components/editor/filter/auth-tree-chart/RowAuth.vue:204-245` 的 `dfsSubmit()` 在 leaf producer 中输出 `dynamicTimeSetting`。

另一个不一致是设计 r003 所列 group 精确字段集未包含 `type`，而 RowAuth group producer 与 Cases fixture 都包含 `type: "tree"`。应统一生产来源、fixture 和“精确字段集”定义；否则深比较 oracle 可能漏掉字段丢失或把正确序列化判错。

### F-03 — 中：uid/oid 切换案例的 expected identity 保留旧值

CPI-037、CPI-038 的事件分别执行 `identityChanged(uid=editor-B)` 与 `identityChanged(oid=org-B)`，并清除 clipboard，但 `expected_state.uid/oid` 仍为 `editor-A/org-A`。相邻的迟到响应 CPI-022/023 在 `bindingChanged(uid/oid=...)` 后会更新 expected state 中的身份字段。当前 CPI-037/038 无法用 23 字段状态投影验证切换后的身份与清理结果是否属于新身份；需更新预期身份或明确定义状态投影是切换前的旧会话视图。

### F-04 — 中：部分真实授权场景缺少显式 BLOCKED 标记

CPI-002、CPI-053..CPI-055 正确包含 `authority_status: "BLOCKED / NOT_RUN"` 及外部 authority 要求。CPI-003 `targetManageDenied` 与 CPI-008 `datasetReadDenied` 则给出权限拒绝/服务端拒绝预期，却没有对应的 authority 状态字段。产品设计说明 target-manage 与 dataset READ 是真实路径，但实际角色行为/真实权限环境尚未验证。应明确将这两项标为 `BLOCKED / NOT_RUN`（或 machine-readable 的未执行状态）；不能从静态 expected state 推出真实鉴权通过。

### F-05 — 低：跨标签用例没有按标签建模最终状态

CPI-056..CPI-059 以事件文本表达 tab A/B、worker 与 `clipboardAvailable`；但 23 项 observable state 没有 tab identity、recipient clipboard availability 或 worker session state，单一 `clipboard_id` 的归属也没有定义。因此 CPI-057/058 的“接收 tab 不可用”和 CPI-059 的跨 tab 清除不能仅由 `expected_state` 结构化断言；目前取决于未来 runner 如何解释事件字符串。若要保持该粒度，应给事件 DSL 与多 tab 状态 oracle 定义可执行 schema，否则把此处 claim 降为案例叙述。

## 权限与执行边界

现有证据只覆盖静态案例定义。source-read 的 CPI-002、CPI-053..055 被正确保留为未执行规范；CPI-003、CPI-008 及跨组织/跨用户场景也不构成真实权限证明。当前没有已确认的 XPack 多用户隔离环境及受限账号，故只读用户限制、权限撤销/恢复、真实 source-read/target-manage/dataset READ 与组织隔离均继续 `BLOCKED / NOT_RUN`。不可用 standalone/admin/mock 代替。

修订建议仅针对 Cases/Design 的 oracle 对齐：修复 F-01 的终态账本；统一 F-02 序列化字段；修正 CPI-037/038 身份预期；为 CPI-003/008 绑定真实权限阻塞状态；补足或收窄 F-05 的跨标签结构化 oracle。完成修订后需针对新版摘要重新审查，再单独准备受控执行器及 admission；此报告本身不授权源码 Builder，也不提升 Goal、AC-S02-07 或权限验收状态。
