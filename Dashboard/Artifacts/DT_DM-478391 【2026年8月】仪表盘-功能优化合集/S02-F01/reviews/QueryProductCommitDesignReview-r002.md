# QPC r002 独立设计审查

- Design Freeze Validity：`NEEDS_REVISION`。
- Implementation Entry Readiness：`NOT_READY`；不允许产品 UI/Store 接线、来源配置暴露或目标提交。未发放 Builder admission。
- 这不是仅因外部权限缺失而拒绝冻结：下列 R2-01、R2-02、R2-03 是可在当前环境修订的本地合同问题。权限解除不是修订这些问题的前提。
- 分母维持 10 Goal AC、14 F01＋Q066/Q067＝16 产品义务、合计 26 must-have；Scope Delta none。S01 独立状态不变；真实权限 `BLOCKED / NOT_RUN`。

## 入口与证据

绑定 card：`planning/query-product-commit-design-review-card-r002.json`，canonical SHA256 `6c28d167196e64f4daa39d9265a3879e138a2d7c469401564ffb39e6fe5edb4a`；Context：`planning/ContextBootstrap-QueryProductCommit-design-review-r002.json`，raw SHA256 `2eae508bcf5c35ed61ed60aeb161be5656af7a142d5f6f819217cce6d50782b3`。入口 validate/render 与 Context validate 已通过；21 项 required-read 摘要在收尾再次逐项核对，无漂移。

只读检查设计、11 个模型用例、当前 owner/配置确认/快照源码；按 raw SHA 验证 QTARGET r008，解析 QPC-009 的 RFC6901 `/cases/0/expected/value/design`。该引用可唯一展开，无 patch 或递归引用需要解释。扩展读取 `query-single-select-carrier.ts` 用于核对 owner 实际调用输入契约。未执行构建、应用、权限探测或产品行为测试。

## 阻断 finding

### R2-01 / 高：成功候选与当前 owner preparation 输入不兼容

设计协议步骤4要求把重建的 `{propValue,cascade}` 交给 `prepareQuerySingleSelectConfirmation`。QPC-009 唯一候选却引用 QTARGET 的 `expected.value.design`：展开结果没有 `propValue[0].mapValue`。`query-single-select-session.ts:100` 无适配直接调用 carrier；`query-single-select-carrier.ts:350` 要求 mapValue 为数组，而同文件设计态输出明确删除 mapValue。因此该引用不能直接进入声称支持的 owner 成功路径。模型标记诚实，但未消除本地接口不匹配。

最小修订：冻结从 QPP 候选的设计态/运行态到 owner queryRoot 的显式转换与逐字段来源；不能随意补默认值或使用旧目标运行值。给出完整输入、owner preparation 接受的精确树及发布后的设计态/运行态，并验证默认值与当前值语义。此项不需要伪造真实授权，也不需要挂载产品入口。

### R2-02 / 高：异步失效仍被描述成整个事务零副作用

设计步骤5、6先发布根、更新 owner、调用快照缓存，再 nextTick 检查；步骤7却写“预览派发前的失效检查是零副作用拒绝”。此时已发生的根替换、selection、owner revision/commitId 与缓存不能被当成未发生。当前配置确认 `QueryConditionConfiguration.vue:1648` 后的 nextTick 只抑制后续事件；不会回滚这些变更。且设计步骤6称“现有”路径检查 commitId，当前源码实际检查 phase、epoch、revision、allows，未直接检查 commitId。

最小修订：明确这属于提交后预览取消/过期，只保证新增 dispatch 为0；列出先前提交状态保持及重试资格，并给失效发生于发布后、dispatch前的用例。将 commitId 检查标为拟新增合同或证明 epoch/revision 的等价约束，不误述现有实现。

### R2-03 / 中：引用已唯一，但完整本地事务 oracle 仍未给出

QPC-009 只有 owner 数字与 design 引用，没有 outerRoot、目标 raw 身份建立步骤、selection、snapshot cache/index/history 初态与终态。QPC-002..008 的 `all_effects_unchanged:true` 是断言意图，没有可重放基线。无法据此确认“仅目标替换”、非目标根保持、引用无共享及取消/失败前后状态。成功模型的授权占位可保持外部依赖，但本地 owner 及状态合同可以先精确冻结。

此外 snapshotCacheMark 被词汇表定义为一次函数调用，正文却把它等同实际排队。`snapshot.ts:87` 只有 dataPrepareState 为真才增加 snapshotCacheTimes；当前支持谓词没有包含该条件。应分别记录调用次数/缓存增量，或规定并验证支持前置条件。

最小修订：增加不冒充真实权限的本地条件模型完整初终态和构造序列，明确可控的 callback 与异步调度观察点；保留授权适配输入未绑定状态。定义 cache 门槛两种行为，分别记录 reRenderAll、queryData dispatch 与实际下游请求。无需把物理 history append 强制写成1。

## 其它发现与六项处置

| 原 finding | 本次处置 |
|---|---|
| QPCR-01 | 部分解决。RFC6901 展开唯一；完整本地 oracle 未解决，见 R2-03。 |
| QPCR-02 | 部分解决。唯一顶层、当前 raw owner、prepare/commit capsule 方向正确；设计态转 owner 输入缺失，见 R2-01。新建受管会话及其首次保存延续不等于任意重开已有画布可认证。 |
| QPCR-03 | 部分解决。cache/append、事件/fanout、callback异常不回滚均有改进；见 R2-02、R2-03。 |
| QPCR-04 | 规则层解决，有界保留。默认 A 缺完整枚举阻止确认，与迟到 C 核对一次后保留无效明确区分；实际枚举 producer、新鲜度与权限尚未验证。 |
| QPCR-05 | 部分解决。QPP WeakMap handle及复验方向正确；产品 adapter 的 epoch/raw主体/授权绑定尚是要求，无具体冻结结构或用例，不能宣称已落实。 |
| QPCR-06 | 外部阻塞保持。公开权限声明存在不等于可信可用 provider 已绑定；真实主体/组织/资源/操作及拒绝/撤权验收不可由 standalone、mock 或 helper 代替。 |

N1（非阻断元数据错误）：Cases `reference_resolution.qt_rebuild_fixture.success_case_ids` 把 QTARGET-005..009、011..016 列为成功，但源文件这些用例 `expected.ok=false`。当前仅 QPC-009 的 explicit pointer 实际被解析，未因此改变该引用；应修正列表，避免后续批量展开错误。

QPC-006 的迟到 C 是已存在交互中的状态转移，loading/invalid 本身会变化；`all_effects_unchanged` 应明确仅指粘贴发布/快照/额外查询等效果，不能覆盖这些交互状态。QPC-005 的阶段标签 ADAPTER/ENUM_DEFAULT 与返回 DEFAULT_ENUM 也应明确为层级或统一标签。

## 后续与声明上限

先修订 R2-01..03，形成新的设计/fixtures，再独立复核；可继续纯协议、适配和本地模型设计，不需等待真实权限环境。任何新的实现任务仍需独立限定写域与准入，当前报告不授权接线。真实授权 provider、合法隔离环境和绑定语义准备后，另行验证来源读取、数据集访问、目标编辑及撤权，不自动沿用纯准备的通过结论。

本报告只证明完成静态独立设计审查，不证明产品复制粘贴、Vue 运行、历史 append、预览请求、保存重开或 Goal 完成；不更改旧证据、设计候选或其它任务状态。
