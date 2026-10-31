# QTR-001 独立 Validation r001

## Verdict

- **QTR package：FAIL_FOR_QTR_PACKAGE。** 六项冻结identity之外的当前固定检查通过，但独立复现发现目标ID `__proto__` 会产生结构错误的成功结果；此外，同一层对象被多层复用时会漏检后续层的字段不匹配。两项违反冻结设计的有效输入域，Builder 必须修复并补充回归验证后才能重新申请验证。
- **Goal conformance：PARTIAL，S02 Goal 继续开放。** 原 Goal ledger 共 26 项：10 项 S02 AC、14 项 F01 义务、2 项 Q066/Q067；当前均为 pending。本切片不能关闭产品级链路或完整 Goal AC。
- 真实权限仍为 **BLOCKED / NOT_RUN**；只读用户限制、权限撤销/恢复未验收。QTR 未接产品入口，不证明产品查询、保存、撤销或授权行为。

## 准入、绑定和验证证据

本轮 Context Bootstrap 与 QTR Validation card 的 SP-010 校验均通过；Context required read set 的 28 项摘要全部匹配。Builder card canonical digest 为 `c2e44f14e2b47b77df0ca44dd38bca23dd494deca33ec88771682266900c7909`，Builder admission 校验通过，action 为 `builder`，target 精确绑定 `core/core-frontend/src/custom-component/filter-copy/query-tree-relation-rebinding.ts`。Admission 绑定实现前的 `Topology-actual-r039`；当前状态 `Topology-actual-r040`（SHA-256 `4d371a05f86857b23228c042a31de5d90d5d59370dd1d772a5dec6d7256ffb4f`）记录 QTR Builder candidate 完成、8 项与3项固定检查通过、独立验证已派发。Validation Context 的 required read set 未列入 r040；本报告按任务指示直接检查了该终态文件，并区分了它与准入时点 r039。

核对了原始 Goal、QTR Design/8 项 fixtures、独立 Design Review、Builder card/Context/admission、当前实现和 runner、QTR Execution Evidence、RED/GREEN/lint 原始输出与退出码。执行证据绑定的 Goal、Design、fixtures、Review、Builder card 摘要均与当前摘要一致。QTR 相关实现、runner、Design/fixtures 和本轮执行证据当前为未跟踪文件；未见这些实现文件的 tracked diff，限定范围按 Builder card 路径逐项检查。

独立重跑真实 runner：`node tests/filter-copy-query-tree-relation-rebinding/rebind.test.mjs`，输出 `PASS: 8 frozen QTR identities plus 3 defensive checks`。独立对实现和runner运行定向 ESLint，退出码为0。既有 RED 退出码1：runner对缺失实现返回 `IMPLEMENTATION_UNAVAILABLE`，8项fixture断言和3项防御断言因此失败；这是一条可执行runner上的有效初始失败。既有 GREEN 和 lint 退出码均为0，与本轮独立复跑一致。

8 项 fixtures 精确检查逐层字段保留、组件映射、缺失/多目标映射、字段不匹配、同目标去重和空层拒绝。3 项防御检查验证五层通过、忽略未使用映射键、FIELD_MISMATCH 先于后续歧义。Design Review 还要求覆盖六层拒绝和重复树字段；runner没有这两项独立回归断言，虽然实现中有对应检查代码，不能据此宣称两条边界已执行验证。

## Findings

### Blocking findings

**QTR-V01（P1）：合法字符串目标ID `__proto__` 造成字段映射丢失。** Design 规定字段和组件ID只要求非空且不含 `--`，所以 `__proto__` 符合当前允许域。输入为 `treeFieldIds:['field-A']`、一层 `checkedFields:['source-A']` / `checkedFieldsMap:{'source-A':'field-A'}`，`componentMap:{'source-A':['__proto__']}`。当前函数返回 `ok:true` 和 `checkedFields:['__proto__']`，但 `checkedFieldsMap` 是 `{}`，没有目标字段的映射条目。原因是输出映射以普通 `{}` 创建后直接以目标ID作属性赋值，`__proto__` 命中特殊原型 setter。应安全构造输出键或将该输入明确按合同拒绝，并增加回归测试；验证前不要把该目标当成成功重绑。

**QTR-V02（P2）：同一层对象被两个层级共享时，后层字段不匹配被错误接受。** 当前字段校验使用 `levels.indexOf(level)` 取得层索引；当两个数组位置引用同一对象时，后一个索引仍返回第一个位置。以 `treeFieldIds:['field-A','field-B']`、`treeCheckedList:[shared,shared]`（shared 为 `{checkedFields:['source-A'],checkedFieldsMap:{'source-A':'field-A'}}`）、映射 `source-A → target-A` 输入，函数返回成功，并为第二层输出 `target-A → field-B`，尽管输入层字段仍是 `field-A`。Design 对每一层要求映射字段严格等于该层字段，且没有排除共享对象引用。应按显式数组索引逐层校验；若产品输入域确实只接受 JSON round-trip 后的数据，也需在合同中明确限制并验证入口满足该限制。

### Non-blocking findings / follow-up

- **QTR-V03（P2）：Design Review 要求的两条防御边界没有独立测试。** 六层拒绝与重复 `treeFieldIds` 的拒绝没有对应runner断言。补充这两项边界测试后再提交下一轮验证。
- **QTR-V04（P3）：Validation Context 未绑定当前 Topology-r040。** 当前 r040 已直接读取并用于本报告终态对账；准入所绑定的 r039 是实施前快照且摘要匹配。后续 Validation Context 应把所审的实际状态面纳入 required read set。

## 声明上限与后续动作

本次不能宣称QTR package通过。修复 QTR-V01/V02，并补测 QTR-V03 后，重新执行 GREEN/lint 与独立 Validation；期间保留 QTR候选失败状态。即使QTR通过，也只证明冻结纯树关系变换，不证明真实目录、源/目标资源授权、树查询/SQL、完整 query payload、产品复制入口、保存撤销或 Goal 完成。QPREP 历史 package verdict 保持 `PARTIAL_PASS / BLOCKED_FOR_PACKAGE_ACCEPTANCE`；本次不追认、不解除该限制。
