# QPC r003 独立设计审查

Design Freeze Validity：`NEEDS_REVISION`。

Implementation Entry Readiness：`NOT_READY`。不允许产品 UI/Store 接线、来源配置暴露或目标提交，不发放 Builder admission。

本轮剩余阻断是本地 oracle 与源码/自身输入不一致，可以先修订，不以真实权限缺失为借口无限阻断纯合同推进。QPCR-06 仍是独立外部入口门槛。

## 证据与检查

Card canonical SHA256：`92ad6c651cadf53f7481f2c8d98c588bfdd9715bfb85e27dd110ce400ab80bdb`；Context raw SHA256：`020b41103b167680148cc0525ade4e426acf797e1d570b9ce692ecbc677b3737`。card validate/render 与 Context validate 均 exit 0；读取 renderer 指令并按唯一报告写域执行。12 项 required-read 摘要入口及收尾复验无漂移。

14 个 case 的 initial/expected 共 28 个 canonical SHA256 独立重算全部一致。QPC-009 上游 raw SHA 验证成功，RFC6901 `/cases/0/expected/value/design` 唯一展开；复制后仅添加 `propValue[0].mapValue=[]`，与嵌入 query_root_input 逐字段完全一致。该 shape 修订符合当前 carrier 的 mapValue 数组输入约束；默认 runtime 从 defaultValue/defaultMapValue 生成，不从旧目标 Y 继承。本轮为静态独立审查及 JSON 摘要/展开检查，未执行产品、构建或真实权限测试。

## 原 finding 处置

| Finding | 结论 |
|---|---|
| R2-01 | 该项输入 shape 缺口已关闭：固定适配与完整 queryRoot 均提供，删除设计态运行字段及从默认值生成 runtime 规则与 carrier 一致。尚不表示 QPP→产品授权 producer 已绑定。 |
| R2-02 | 文字及阶段分类已关闭：COMMITTED_PREVIEW_SUPPRESSED 保留已发布状态，只抑制后续 dispatch；commitId 核对明确为新合同。QPC-012 的计数仍受下述 R3-01 影响。 |
| R2-03 | 未关闭：完整字段与摘要已经补齐，但多个具体值与输入/源码冲突，见 R3-01、R3-02。摘要一致不能验证语义。 |

## 阻断发现

### R3-01 / 高：实际成功路径的 editGeneration 被少算一次

`query-single-select-session.ts:424` commit 先使 editGeneration 从0到1；随后 publishEvents 调 `recordSnapshotCache`。当 dataPrepareState=true，`snapshot.ts:87` 调用 `markQuerySingleSelectDocumentEdited`，对应 session `markDocumentEdited():565` 再加1。因此 QPC-009 的完整 expected_state.owner.editGeneration 应反映2，当前写1。QPC-010/012 沿同一次缓存调用后失活，仍继承该错误。QPC-013 dataPrepareState=false 时保留1的方向正确。

设计步骤6说缓存调用“先尝试标记 dirty；仅当 dataPrepareState=true 才增加 cacheTimes”也不精确：markDocumentEdited 本身就在该 if 内。最小修订：分别冻结 commit增量、cache门槛内增量及失活增量，对完整状态重算摘要。缓存调用数、cacheTimes增量和history append继续分离。

### R3-02 / 高：完整状态与 case 输入/行为断言仍矛盾

- QPC-006 的 expected 要求 selected_value=C、invalid=true，描述核对后请求总数2；完整 expected_state.asyncEnum 却是 selectedValue=null、invalid=false、requestCount=0，initial 也全为空。不是同一条状态转移。应给第一次响应/核对前的真实模型初态，明确请求计数窗口，最终保留C、invalid=true、loading=false；结束之后新增请求应为0，不混同已执行的那一次核对。
- QPC-004 输入 revision_before_confirm=7、after=8，完整初终态 owner.revision 都是0。应明确观察从哪个时点开始，把并发变化与粘贴拒绝自身零新增变化分开；不能用全0基线代表7→8。
- QPC-003 input 指定 count2、不是current raw，完整 owner却count1且两个raw引用相等。需要明确定义外部被选目标与实际owner的区别或调整完整状态，不能留两种相互冲突的来源。
- QPC-009 initialization_trace 注册 raw-target-v0，完整初态及input owner却绑定 raw-target-v7；没有raw身份替换动作。QPC新合同要求精确身份绑定，不能仅视为名称无关。应使用同一身份标签或给出合法转换步骤。
- QPC-011 声称已提交状态后的正常保存失败，却复用 dirty=false/revision0/commitId=initial 的初终态，saveRequests=0。若模型覆盖实际保存请求失败，须从已提交态起算并记录请求；若只观察收到失败结果后的不变窗口，须明确窗口与前置请求。当前模型不足以证明所写行为。

这些是当前本地确定模型可修订的冲突，与真实授权 provider 是否可用无关。最小修订：逐例从自身input生成唯一初态、动作序列和终态，不再对各场景机械复用同一baseline；然后重算摘要并复审。

## 有界成立与未解决门槛

- 默认A缺完整枚举阻止确认、迟到C只核对一次后保留无效的规则仍正确；QPC-006需按规则修复具体状态。
- owner beginSession 的确只接纳新建空画布起始上下文；r003 明确保留已保存画布在原Goal分母，QPC-014没有将其当作永久不支持。这一范围说明成立。注意同一受管创建会话首次保存后的延续与“重开既有画布”不同，不能泛化为任意已保存身份都必然失效。
- 新建owner的registerPending只建立currentComponent，不自动生成已认证design capsule。协议要求的readDesign必须明确发生于哪个合法阶段；当前producer未绑定，不能据此宣称可读取任意来源设计。
- recordSnapshotCache调用、cacheTimes增量、物理history append、reRenderAll/queryData dispatch及下游fanout已概念分离；QPC-009的linked_target_ids是chart-1/chart-2，而设计映射为chart-B。既然它标注仅计数模型，不能拿固定2当真实查询oracle；集成前需将映射与观察目标统一。
- QPP handle与生命周期epoch/raw身份/当前主体的产品绑定仍是待实现合同要求，未被本次静态审查证明。
- QPCR-06：真实权限仍 `BLOCKED / NOT_RUN`。公开声明、standalone或纯helper不能替代可信provider、身份语义、来源/数据集/编辑权限及撤权验证。即便本地设计下一版通过，也不自动允许 UI/Store 激活。

N1（非阻断）：transaction_state_contract.baseline_sha256 为null，但 oracle_states.baseline_sha256 有值；当前每例完整嵌入状态且摘要正确，所以不影响本轮展开，后续应消除冗余歧义。旧r002“success_case_ids”误列已修正为001..004。

## 结论边界

保留10 Goal AC、14 F01＋Q066/Q067＝16产品义务、合计26 must-have；Scope Delta none，S01独立状态不变。修订R3-01/02后再次审查本地设计冻结；真实权限和已保存画布owner支持另有入口门槛。未修改候选、源码、测试、Goal或旧报告，本报告不证明复制粘贴产品验收、历史append、真实预览fanout、保存重开或Goal完成。
