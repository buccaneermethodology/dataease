# Query Shape 生命周期源码证据矩阵独立评审 r001

## 结论

**`NEEDS_REVISION / STATIC_SOURCE_INDEX_WITH_FINDINGS`。** 矩阵整体保持了有界静态来源索引的正确声明边界，没有把源码路径提升为产品运行、durable persistence、真实权限或 Goal 验收证据；但发现一处时间显示轴与固定/动态规则轴混淆，以及两项 FullShape 跨轴未进入矩阵。现有稿可供调查使用，修正上述覆盖问题后才能作为完整的 Shape 生命周期索引。此结论不授权或证明产品 Design Freeze、Builder 准入或 Goal 完成。

本 Review 仅评估矩阵 r001 当前字节是否存在遗漏、过度推论或引用错误；不重判已封顶的 Authority Materials / FullShape / Select-Num 交付物，也不修改被审对象或源码。

## 入口与绑定复核

- Review Card canonical SHA-256：`51331d5f539dd6f550fdbedd19018fd2b0fac61b94bcd5efb5ded6e766ebdd26`；`lane_task_card.py validate` 返回 `pass`，输出路径及只读范围与本次操作一致。
- Context Bootstrap SHA-256：`9ac5cd4a27eec66628c11c27e6af4e38c29eced6809d5676d726f803dd8eb332`。30/30 required-read 条目摘要匹配，`skipped_reads=[]`。目标矩阵 SHA-256：`2a8670072445707a38b4d30ff381b10baf5ca747f3c09f4d30172bdfa05b75c2`。
- Goal SHA-256：`f562da2eb14b84dc8083e138dd2eb8718a58041f01d08163eddf5fb2c71daef0`；CoverageMatrix SHA-256：`3e9b7f6683506596e6ca857020a9700a431dc98b8c0c8007c5744f3692c7f0cb`。绑定与当前文件一致。
- 对照读取了原始用户意图、Goal、CoverageMatrix、Sessions、Authority Materials 主审及审后更正链、FullShape Design r003 与 Review r003、Select-Num Source Trace r003 与 Review r003、Consumer/Persistence Trace r002 与 Review r003，以及 Card 指定的 14 个当前源码文件。逐行核对下列 finding 所引证据；没有把 read-set 外源码审计或完整运行验证算入本结论。

## Findings

| ID / 严重度 | 精确位置、证据与影响 | 处置及最小修正 |
|---|---|---|
| `SLM-R1-001 / P2` | 矩阵第31–32行把 `SH-FIXED-TIME` 记作 `displayType=1`、`SH-DYNAMIC-TIME` 记作 `displayType=7`。但绑定的 FullShape Design r003 第27–28行均把这两类规则列在 `displayType 1,7` 下；源码中 QCC 第3053–3068行将 `1` 标为时间、`7` 标为日期范围，`FilterTime.vue:58–63` 根据 `timeRange.regularOrTrends !== 'fixed'` 选择动态分支，模板第323–325行分别以 `fixed`/`dynamic` 表示规则。故 1/7 是时间控件的单时间/日期范围显示轴，不是固定/动态规则的区分。矩阵当前映射会让读者把两个独立轴合并，并可能遗漏固定日期范围或动态单日期等组合；即使合法组合分母仍明确 UNKNOWN，该逐行分类本身也不准确。 | 应分别保留固定时间和动态时间规则行，但两行都注明 `displayType=1/7` 是待 authority/合同决定的显示轴；将 fixed/dynamic 挂到 `timeRange.regularOrTrends` 等规则字段，并保留二者组合合法性未知。仅修复静态索引，不由源码自行裁定支持组合。 |
| `SLM-R1-002 / P2` | 矩阵第34–35行纳入 `AX-CASCADE`、`AX-PARAMETER`，但没有列出 FullShape Design r003 第30行的 `AX-TIME-RESTRICTION` 和第33行的 `AX-OPTIONS`。矩阵第25–35行标题含“配置轴”，第7、34–35行也将其表述为对全形态设计的生命周期来源索引；FullShape 已把时间限制（`setTimeRange`/`timeRange`）及选项来源/过滤/排序（`remote`/`optionFilter`/`firstItem`/`sortList`）列为跨 shape 轴。这两轴牵涉复制时规则与运行态缓存的区分，且无法仅由 shape 行内的零散提及替代其配置、运行消费和保存/恢复边界；目前矩阵未标明排除，形成轴覆盖缺口。 | 增补 `AX-TIME-RESTRICTION`、`AX-OPTIONS` 的有界来源与生命周期行，并明确其跨 shape overlay 属性、各阶段未知及不得推导合法分母；或在矩阵范围明确排除它们并引用 FullShape 对应行，避免当前看似不完整的轴清单被误用为完整覆盖。 |
| `SLM-R1-003 / P3` | 矩阵第16–18、20–21行及第27–35行对若干关键判断仅给出文件名或组件简称（例如 QCC 配置/确认、多个 shape consumer、`dvMain`、权限契约/substitute），没有对应的行范围或符号锚点。Context 确实为相关源码文件绑定了 SHA，因此版本身份可识别；但该矩阵自称静态来源“索引”，缺少行级定位令 reviewer 无法快速复现各 shape 的字段写入、消费与事件连接，也使第31–32行之类分类错误较难发现。 | 为主要断言补充准确行范围/函数或模板锚点；沿用 Context 的源码 SHA 作为版本绑定，不把精确行引用扩大解释成运行证据。对权限条目保持“实现/环境不可用”的限制，并只引用可支持该限制的契约或 substitute 来源。 |

## 全量范围与边界核对

### Shape 与跨轴

- `SH-SELECT-TEXT`（第27行）：配置源、Select 消费和未知项与 Select-Text 来源链及 FullShape 设计一致；默认首项/手工值、`optionValueSource` 与保存后重载仍未冻结。矩阵没有把单/多选、默认或来源轴组合推成产品分母。
- `SH-SELECT-NUM`（第28行）：2/5 分开对待，保留数值/字符串、0/null/空值、消费和持久化 oracle 未知。与 Select-Num r003 来源图及 consumer/persistence r002 最终 Review 的静态索引边界一致；迟到 C 核对路径没有被扩大成所有 2/5 组合的产品行为结论。
- `SH-TEXT`（第29行）：F/S 条件输入、required/default 分支被描述为局部路径；完整 operator、组合契约与 round-trip 未被宣称已证明。
- `SH-NUM-RANGE`（第30行）：保留 start/end/array 方向未知及 0/缺值 required 检查的局部性，没有从 UI 输入路径推出完整数值查询语义。
- `SH-FIXED-TIME` 与 `SH-DYNAMIC-TIME`（第31–32行）：动态规则计算、timezone/DST/月末与持久化恢复的未知项应保留；displayType 映射按 `SLM-R1-001` 修复。
- `SH-TREE`（第33行）：树层级/所选路径消费与编码、混深、空节点及保存恢复未知项保持清楚，未把层级关系验证推为结果 oracle。
- `AX-CASCADE` 与 `AX-PARAMETER`（第34–35行）：作为跨 shape 轴而非独立 shape、不计入形态分母的表述正确；其关系闭包/身份绑定和完整 DTO 等未知边界保留。还需处置 `SLM-R1-002` 的两个遗漏轴。

### 生命周期阶段

矩阵第13–21行区分了通用缺省配置、配置确认、shape 运行消费、图表刷新、前端画布保存/加载、快照/撤销重做及权限/身份。对保存链，JSON 序列化/解析和 API 调用只被用来支持前端数据通路；后端事务、durable save、Save→Load 同值和历史迁移仍明确未知。快照事件存在不等于每个 shape 的 undo/redo 行为通过。对权限，真实 XPack 实现与隔离实例不可用，故只读查看/复制/粘贴拒绝及撤权/恢复仍 `BLOCKED / NOT_RUN`，没有用 standalone/admin/mock 替代。

该表没有提供产品 adapter 自身 source-read、转换、target-commit 的证明；第42–43行明确限制产品 UI/Store/source-read/target-commit build，并将权限验收列为 blocked。故本 Review 不把这一外层适配器链视为矩阵声称已覆盖。后续设计/Builder 仍需独立合同、可信 RED/GREEN、精确 admission 和所需依赖证据。

### Authority、分母及最终 claim ceiling

- 矩阵第9行准确保留 Authority Materials 主包最终 3/3 `NEEDS_REVISION`，只把审后更正认作指定 Q014 指针/条款级修正，不翻转主包结论；AM-08 导航/时态歧义与 AM-Q02 已澄清的概览/细化映射边界及未决赢家、迟到/重放/重复提交/预览次数未被混为一谈。
- Goal 原始 10 项 AC、26 项 must-have、16 项产品义务及 `Scope Delta: none` 保留；关联 AC-S02-02..09 只被记作设计/来源追踪，不更新产品 Coverage 状态。CoverageMatrix 仍是产品状态权威，本 Review 不把静态索引记成 AC pass。
- S01 F01 `CONDITIONAL` 与真实权限 `BLOCKED / NOT_RUN` 保持；只读用户拒绝与撤权/恢复验收仍未验证。
- 本 Review 的结论上限是矩阵当前字节存在上述需要修订的来源分类/轴覆盖/定位问题。它不是完整支持列表、schema、产品 Design Freeze、实现准入、runtime 或权限验收，也不是 S02 Goal 完成证据。

## 最终处置

矩阵 r001 当前保留为历史候选，不在本 Review 写范围内修改。修订需作为新版本独立绑定当前 Goal、Context、FullShape/authority 和源码摘要；对该矩阵交付物按其自身轮次预算管理，不能因本 Review 覆盖或重命名而重置其他交付物轮次。其余被审交付物的既有 3/3 轮次和历史结论均不重开。
