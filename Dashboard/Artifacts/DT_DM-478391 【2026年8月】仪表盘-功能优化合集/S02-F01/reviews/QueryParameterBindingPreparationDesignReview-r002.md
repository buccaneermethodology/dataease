# 查询参数引用准备器独立设计审查 r002

## 第 2/3 轮双结论

- **Design Freeze Validity：NOT_READY**。纯列表准备器的产品边界已澄清，但 JSON-safe/unknown 输入域与相应反例仍未闭合，通用操作 oracle 的适用规则存在冲突。
- **Implementation Entry Readiness：NOT_READY**。先补齐以下两个阻断项，再冻结本版本 Contract/Cases、建立可信 RED 与独立 Builder admission。此结论不是要求先完成整个 R4-04、真实权限或整个 S01。

保持 10 Goal AC / 26 must-have / 16 产品义务，Scope Delta none；不关闭 AC、DG-03 或 R4-04。S01 F01 Packet 可读且 CONDITIONAL；真实权限 BLOCKED / NOT_RUN。authority materials package 已耗尽 3/3，本轮没有重开它的审查。

## 入口、读集与事实边界

使用项目 sge-governed-checkpoints kernel、semantic-review recipe 及写前保全规则。已消费父任务固定 expected card SHA `4e63e8db2c2a0583f89d72a6e8c4ae38fa7d900b27d74c786f38e575705d2647`，先 validate pass 再 render；非自行生成预期值。Context 的 14/14 required-read 摘要在开始及写报告前一致。已检查 git status，已有大量其他任务修改及未跟踪文件；本轮只新增本报告，写前不存在。

已读取 Goal、完整 Design/DesignGaps、产品适配设计 r004、参数设计 r002、全部 18 fixtures 和根级 oracle/domain/operation、首轮完整 8 findings、权限记录、S01 Packet；源码重读当前参数生产/消费及 QPIPE。产品适配大 fixture 按根结构、R4-04 和相关参数矩阵语义审查，不声称对所有无关形态执行运行验收。没有构建、产品测试、安装或源码修改。

源码复核：QueryConditionConfiguration.vue:688–695 写 scalar parameters；599–632 写 parametersArr[componentId] 并筛 variableName；667–677 同 ID 保留首项。useFilter.ts:516–523 按 ID 找 scalar DTO，525–590 依赖六个范围 Maps 分配端点并按 ID 查 parametersArr。SqlVariableDetails.java:10–28 有 14 字段，table/group 字符串序列化；QPIPE 不生产参数映射 authority。r002 已正确把 helper 顺序定义为源 ID 首次出现顺序，不再将其冒充端点方向。

## 首轮全部 findings disposition

| 首轮 ID | 本轮处置 | 依据与剩余边界 |
|---|---|---|
| PBP-R1-01 | CLOSED_WITH_BOUNDS | 通用 parameters 列表值，caller 分别接 scalar 或 range 容器；六 Maps、方向和查询输出明确不由 helper 保证。 |
| PBP-R1-02 | PARTIALLY_RESOLVED | reason、校验阶段、全目录重复、空列表已明确；unknown/JSON-safe 边缘域及反例仍见 R2-01。 |
| PBP-R1-03 | PARTIALLY_RESOLVED | 已有具体嵌套变异路径及无共享引用 oracle，输出不要求冻结；全局适用性矛盾见 R2-02。 |
| PBP-R1-04 | CLOSED_WITH_BOUNDS | 明确只做 opaque JSON 复制，不验证 DTO/字段分类；001 有完整14字段和未知嵌套/null，003/017 允许仅 id 记录，不能宣称参数分类或完整DTO校验。 |
| PBP-R1-05 | CLOSED_WITH_BOUNDS | 多对一与目录重复拒绝仅为 helper 局部支持域，未提升产品永久政策。 |
| PBP-R1-06 | CLOSED_WITH_BOUNDS | source提取、精确映射、目标目录归属由 caller 保证；010 的跨 table/group 合成字符串不作授权证据。 |
| PBP-R1-07 | CLOSED | 已纠正 Packet 可读、CONDITIONAL；真实权限另为 BLOCKED/NOT_RUN。 |
| PBP-R1-08 | CLOSED_FOR_DESIGN / ENTRY_PENDING | 函数签名、源码路径及测试/证据目录已明确；具体文件、执行命令、合同摘要、RED和action/target admission仍应由下一实施卡固定，当前报告不授权写代码。 |

## 本轮完整 findings

### PBP-R2-01 / P2 / blocking：unknown 输入和 JSON-safe 递归域尚缺可执行的失败边界

位置：设计“函数合同”；Fixtures.input_domain、failure_precedence、cases PBP-012..018。

依据：输入签名是 unknown，允许数组/普通对象的递归 JSON-safe 值，但未明确普通对象 prototype（Object.prototype/null）、对象可枚举数据属性与 getter/symbol/non-enumerable 的处理，及循环对象/稀疏数组是否属于拒绝域。映射只规定校验 own enumerable values，未明确读取必须 own enumerable，`sourceParameterIds=['toString']` 且映射 `{}` 的继承属性不可作为映射。这里不要求支持任意代理对象；应冻结支持域和域外行为，避免实现者自行猜测。

18 个 JSON cases 中没有 undefined、NaN/Infinity、Date/函数等非法 opaque 值或循环结构的运行时构造。PBP-018 的 `<runtime-only sentinel>` 是普通字符串且 expected success，不能当运行时非法值见证。没有非法 source ID/组件ID、非数组目录、未引用坏映射值、invalid_input 与重复目录并存、source顺序竞争错误等反例。现有015仅证明 ambiguous 优先于 collision，不能证明全部已声明阶段。

影响：忽略递归校验、直接 JSON 序列化丢值或用原型属性读映射的实现可能通过全部18例。失败可以变成 throw 或错误 reason，违背稳定结果合同。

建议：用简短规则冻结普通记录/递归值边界及自有键读取；为 JSON 无法表达的值添加明确 runtime factory/操作说明并绑定 case identity/expected invalid_input。补覆盖每个输入轴、至少 invalid-vs-ambiguous 及 source-first 错误竞争。无需把所有类型做笛卡尔积，也无需扩展产品 schema。保留现有18例，新增反例，不将018偷偷改称非法值覆盖。

Disposition：OPEN；延续 R1-02 的未闭合部分，不要求扩大成任意 JavaScript 对象通用安全库。

### PBP-R2-02 / P2 / blocking：全局输出变异 oracle 对失败与空结果不可执行

位置：Fixtures.oracle.applies_to / mutating_output_nested_value_leaves_input_unchanged；case_operations。

依据：oracle 声称适用于 every case unless case_operations adds more specific mutation path，而失败005..009/012..016无 parameters，011成功但 parameters为空。它们 case_operations 只列 freeze/deep_equal，没有排除全局 mutation 的规则。002/003等成功 case 也未指定默认变异路径、变异值和必须成功写入的断言。001/018提供具体路径是进步，但修改后只查输入不变，若 harness静默接受冻结输出上的失败写入，仍未观察到输出变异本身。

影响：Builder必须自行决定跳过哪些断言；一个 harness可以错误访问路径，另一个可以无声跳过，第三个可以把未成功的赋值当隔离证据，无法形成同一可复核操作合同。

建议：明确全 case 输入冻结/前后不变及精确结果检查；引用隔离用于全部成功输出可变节点；变异只用于明确列出的成功且非空case，列出新值并断言输出确实改变、输入不变；失败/空结果明确 N/A。为未冻结输入的补充运行可选，不以未定义“every case”代替适用矩阵。

Disposition：OPEN；延续 R1-03。无需要求输出冻结，设计已明确不要求。

### PBP-R2-03 / P3 / non-blocking：case ID 延续不等于冻结 identity 未变

位置：PBP-001-scalar 与版本记录。

001 在 r002 扩展为完整 DTO/未知嵌套对象，input/expected 已改变；002..010 内容不变；011..018新增。这是未冻结候选的合理修订，不构成删除分母，但后续不能仅用 PBP-001 ID 宣称与 r001 是同一 frozen case。建议下一 Contract/Cases固定 r002或后继版本字节摘要，并使 RED/GREEN 绑定该同一版本；保留历史差异说明。

Disposition：INFORMATIONAL / 后续准入约束，不单独阻断本设计。

## 18 例逐项矩阵与 oracle 上限

| Case | 已覆盖 | 边界 |
|---|---|---|
| 001 | 完整14字段、未知嵌套/null、列表值、具体变异路径 | DTO保真样本，不是schema验证；变异断言需R2-02 |
| 002 | 目录逆序仍按caller source顺序 | 不证明range端点方向 |
| 003 | 数值标签的两个opaque记录 | 不证明数值范围/类型 |
| 004 | 同source重复折叠 | 局部规则 |
| 005 | 缺mapping | 缺原型键反例 |
| 006 | 目标不存在 | 未覆盖非法catalog类型 |
| 007 | 引用目标目录重复 | 局部拒绝 |
| 008 | 不同source多对一 | 局部拒绝 |
| 009 | 后项失败不返partial | 全局mutation不适用 |
| 010 | 完整opaque编码ID | 不证明跨数据集授权 |
| 011 | 空引用空输出 | mutation不适用 |
| 012 | 顶层null拒绝 | 非全部输入形状 |
| 013 | 未引用目录缺id拒绝 | 非全部递归非法域 |
| 014 | 空mapping值拒绝 | 非未引用坏值/继承键 |
| 015 | ambiguous优先collision | 非完整错误优先级矩阵 |
| 016 | 未引用重复目录拒绝 | 包括空source |
| 017 | 交错重复source首次顺序 | 目录顺序不控制输出 |
| 018 | 普通字符串嵌套保留与变异路径 | sentinel仅字符串，非非法runtime对象 |

上述为静态合同审查，18例没有被宣称运行通过。001提供EDIT枚举样本，helper不校验枚举，缺ALLSCOPE样本不单独作为 blocker。混合普通字段/参数分类明确排除，不能继续强求实现分类作为本纯 helper 准入条件；实际产品混合路径仍保留R4-04未决。

## 后续入口与声明上限

一次处理 R2-01/R2-02 后可进入本交付物第3/3轮；不要启动 authority materials 第4轮。独立实现只能在设计冻结、Contract/Cases、可信RED、精确write scope与有效admission成立后进入。本 helper 可离线验证，无需真实账号；产品接线仍须独立解除相关S01、目录生产与权限门槛。报告不得压缩为“参数复制已通过”或“R4-04已完成”。父控制面继续其Loop与Stop Gate；本报告不是Goal终态凭证。

## 输入摘要

审阅时间（UTC）：2026-10-21T03:27:22.002365+00:00。HEAD：`1e84e7438462e5d6fc371358da3bdad7d24a5c1a`。

| 输入 | SHA-256 |
|---|---|
| `Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/Goal.final.json` | `f562da2eb14b84dc8083e138dd2eb8718a58041f01d08163eddf5fb2c71daef0` |
| `Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/Design.md` | `6c7f5344446bc640a334cd986e9a1a1276c39be2823433e505cd8ae1943dc117` |
| `Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/DesignGaps.json` | `0a6e1718b0cad911c479ed7faef73664d0bf9d565383d36e226df23f93ec410c` |
| `Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/QueryProductAdapterDesign-r004.md` | `863357ddfbefdf55f715d0d6e9dd8b87f8fc6e5526c5317034822c8facce2044` |
| `Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/QueryProductAdapterFixtures-r004.json` | `9acbf272bbae793d0ccdee2131261d10ba85d256f69e6dfab761510fb9943f2b` |
| `Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/QueryParameterBindingPreparationDesign-r002.md` | `e574c21c6dfed08dee6cfb64a7b0b5226c42cb146ad3fc2777251949bfa48e5f` |
| `Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/QueryParameterBindingPreparationFixtures-r002.json` | `1c9d13bd679a6bbf4455d23daf725e2d78782a751f7cd2ba0a1ee36fe8a5e862` |
| `Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/reviews/QueryParameterBindingPreparationDesignReview-r001.md` | `7e8fc821956a3f85962d752627f70689f6dfdf5f2e40f7616b4b6f13a3abb1f8` |
| `sdk/extensions/extensions-view/src/main/java/io/dataease/extensions/view/dto/SqlVariableDetails.java` | `37678b88e71861ba54c806f70815925d91d9913b58e780d644f2dd4cc4aaa6ba` |
| `core/core-frontend/src/custom-component/v-query/QueryConditionConfiguration.vue` | `0b88bcdf92d15aceae52ca2992e7a8b4165e3f5cfc3f9cb7435296d7c7e9e047` |
| `core/core-frontend/src/hooks/web/useFilter.ts` | `d2db975ae988218a921a5e3a76869e1a66d234eeebeedb1bfcf71e847e90416a` |
| `core/core-frontend/src/custom-component/filter-copy/query-reference-pipeline.ts` | `7066211a16f981cbd05df0c5e41d97f2d01b445b397c948f9ce2344ae34b9d10` |
| `Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/PermissionEnvironment.md` | `bf1498aa23f4f864e2c5c3d999b6b1a6044849ba25a9cd7d7d85104b6f233b9d` |
| `Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/SP-005/S02-S09_EntryPacket.md` | `4598a5d74567e1e1d3de81ce263909231dc054d8102535bc0d917238c412c658` |
