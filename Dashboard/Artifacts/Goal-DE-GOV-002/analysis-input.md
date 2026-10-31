# DataEase 安装任务问题分析与改进建议

## 本轮范围与状态

本轮按用户更正后的范围，只交付 DataEase 安装收尾问题分析、原因分类与改进方案。DataEase 现场、原始安装线程和安装副本保持只读；不修改 SGE Skill、脚本、规则、KB、Dashboard Session/Registry、全局安装副本或外部项目，不发布、不同步、不运行实现测试。

以下改进均为**未实施的候选建议**。本报告不声明任何 Skill/规则已修复、不声明 Goal 或 Session 完成，也不声称实际节省时间。此前任务包中的 Goal、Design、ERBE 与收尾序列是分析输入，不构成本轮实现授权。

## 执行摘要

日志总墙钟约 58 分 34 秒。记录显示，最显著的返工区间是“原始意图修正与 rebaseline”（15:40，26.7%），其后是“最终材料与 Gate 准备”（12:09，20.7%）以及“Gate 路径错误与收尾矛盾处理”（9:52，16.9%）。这些比例只反映里程碑区间经过的墙钟时间，不能解释为主动工作时长，也不能推导相同幅度的可节省时间。

根因不是简单的“缺一个检查器”。现场至少有三类问题：必要的独立审阅与最终证据绑定本身属于验收要求；相对路径调用错误属于执行错误，现有 Stop Gate 正确 fail closed；可改进的流程点在于权威原文/未跟踪字节基线未先冻结、最终 review 前材料仍未齐备，以及 review 时点与后续终态的表述容易混读。已有规则覆盖原始用户意图权威、digest 变化需重新验证等要求，故更准确的判断是：现场执行顺序和最终冻结步骤不足以稳定落实既有原则，而非 Skill 完全没有基线规则。

## 原因分类

| 类别 | 已核实事实 | 判断边界 |
| --- | --- | --- |
| 必要验收，不归为可省略的返工 | 原安装任务要求有独立审阅、Gate 证据与最终读回。审阅工作与主线程部分并行。 | 不得把原任务“无需追加 reviewer”的特定决定推广为后续任务的常规例外；不能把合规验证本身视为可消除的耗时。 |
| 执行错误 | Stop Gate 首次调用使用的 authority root 路径越界，receipt invalid 且 `final_allowed=false`；按正确路径调用后才进入有效绑定。 | 属调用参数问题。现有 fail-closed 行为正确；修复方式是预检解析后的路径是否处于调用方授权 root 内，不应放松可信根校验。 |
| 流程顺序缺口 | 未跟踪 README 未有写前字节副本；`raw_user_intent` 初版是摘要，之后按原意修正并触发 rebaseline；最终 review 前仍补过索引/closeout/reconciliation/binding。 | 不等于已有机制全缺失。已有规则区分原始意图与 projection，context state 可记路径/摘要；缺口是首次写入前的实际原文和字节保全，以及最终审阅前统一冻结完整候选包。 |
| 状态时点表达 | 独立 review 保留其生成时的 `CONTINUE`；后来有效 receipt 为 `GOAL_COMPLETE`。 | 这是时间推进，不证明旧 review 错误。旧审阅应保留 as-of verdict/state/time，最新终态以当前有效 receipt 与 state 读回为准。 |
| 推断性风险 | 交付、reconciliation、review 与 receipt 的引用链较复杂。 | 现场没有证据证明形成了实际摘要自引用闭环；只应作为单向依赖设计与人工/独立 Validation 检查项，不能说现有 Stop Gate 自动检测通用依赖环。 |

## 可复核的计数与时长

原始 rollout 的 completion duration 为 3,514,412ms（58:34.412）；首尾时间戳相差约 58:34.360。日志中 487 是 `item_completed` 事件数，其中 122 条为命令执行记录；这不等于 487 条或 122 条原子 shell 命令。19 个 `interacted`、7 个 `completed`、1 个 `started` 事件来自同一个 reviewer 子线程，不代表 reviewer 人数。两次 context compaction 已单独计数。

| 阶段 | 墙钟 | 总墙钟占比 | 解释 |
| --- | ---: | ---: | --- |
| 启动、基线与首轮实现至首次审阅 | 8:00 | 13.7% | 里程碑间经过时间 |
| 首轮审阅与补漏至首轮结论 | 10:05 | 17.2% | 包含审阅与等待，不能视作纯操作时长 |
| 原意修正与 rebaseline | 15:40 | 26.7% | 最大区间；与原意修正及重新核对同段发生，但不能将全段时间归因于单一原因 |
| 最终材料与 Gate 准备 | 12:09 | 20.7% | 包含证据整理、索引/绑定准备 |
| Gate 路径错误与收尾矛盾处理 | 9:52 | 16.9% | 路径修正、状态/收尾对齐及复核 |
| 绑定和最终只读读回 | 2:48 | 4.8% | 最终绑定与核验 |

reviewer 子线程累计任务时长约 33:18，与主线程墙钟区间有重叠，不能相加为总工时。阶段分布用于定位关注点，不构成节省幅度预测或因果估计。

## 改进方案

1. **首次写入前冻结原始 authority 与完整状态清单。**保存用户原文、基线 commit、完整 tracked/untracked/deleted/renamed 清单；将会被改动的未跟踪文件另存原始字节副本及路径/摘要清单。对 admission 实际绑定输入，后续修正采用新版本并显式重审，不覆盖历史输入。路径与 digest 清单不能代替原始字节备份。
2. **独立最终审阅前做材料完整性预检。**逐项核对原始 must-have/AC、scope delta、最终 diff inventory、Goal 索引、closeout 候选、Dashboard/KB 状态、reconciliation、必要 gate 结果及可访问链接。缺项先补齐，再冻结最终候选包并交独立审阅。
3. **冻结后使用单向收尾顺序。**`交付与最终状态面 → 独立 review → review wrapper/final state → Stop Gate receipt → 只读读回`。审阅对象变化时按影响重审；authority、范围、合同或 inventory 变化时 rebaseline。Gate 之后不再改写被绑定文件来补记 Gate 结果。
4. **明确审阅时点和终态来源。**review 报告记录生成时 verdict/state/time；后续当前状态只由最新有效 receipt 与其引用摘要读回决定。不要为了让旧 review 看起来等于新状态而重写历史记录。
5. **路径与循环风险按证据边界处理。**调用前验证解析后 authority 路径落在 caller root 内；越界仍应 fail closed。依赖顺序由人工/独立 Validation 检查，不声称已有工具自动识别任意语义环；不得删除真实交付或缩小范围来规避摘要漂移。

该方案以流程顺序与证据保存为主，不建议据此增加通用图运行时或放宽现有 Gate。若要实施，须重新确认范围、合同、拓扑与完整写前 inventory，并按仓库治理流程另行启动；本分析不构成启动授权。

## 证据范围与不证明事项

现场证据包括原安装任务的设计记录、rebaseline、authority correction、独立审阅、closeout、post-closeout reconciliation、Stop Gate receipts 与原始 rollout 日志。现场保持只读。对 rollout 的事件计数与阶段墙钟进行了复算。

本报告不证明主动编码时间、具体流程的反事实节省值、实际自引用闭环、宿主强制执行、外部同步状态或候选方案已经落地。Skill 规则层面只核对到本任务相关的原始意图 authority、变更触发 rebaseline、digest binding、Stop Gate fail-closed 等内容；这支持“执行顺序/冻结实践不足”的窄结论，不支持“全局 Skill 从未规定基线”的泛化结论。
