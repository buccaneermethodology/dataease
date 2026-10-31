# Query Product Adapter 全形态设计独立语义复核 r001

## 双结论

**Design Freeze Validity：`PASS_WITH_FINDINGS / FULL_R4_FREEZE_NOT_READY`。** 这份候选文档诚实标明 `candidate`、`frozen_for_builder=false`，保留 `Scope Delta: none`、10 项 Goal AC、26 项 must-have、16 项产品义务及 16 项 `NOT_RUN`；12 个 shape、71 个 field、R4-01..09 与 32 个 Cases 均被列出，未知和历史缺省没有被写成永久 unsupported。其边界表达可作为继续设计的依据，但合法形态组合、生产调用链、字段身份/阶段规则与可执行 fixture/oracle 尚未收敛，不能据此冻结完整 F01 设计，AC-S02-02 与 AC-S02-03 均保持 pending。

**Implementation Entry Readiness：`NOT_READY_FOR_PRODUCT_UI_STORE / TARGET_COMMIT`。** 当前材料不能单独指导安全的产品接线。所有 32 个 Cases 均为 `oracle_status=NOT_READY`、`execution_status=NOT_RUN`、`fixture_payload=null`、`frozen_for_builder=false`；设计还未绑定完整目标目录、产品保存/预览 owner、真实的权限重验路径与发布原子边界。S01 F01 Packet 仍 `NOT_AVAILABLE`，真实多用户权限环境仍 `BLOCKED / NOT_RUN`。可继续不读写产品配置的来源取证和 fixture/oracle 设计；不得以 standalone、admin、mock 替代权限验证。

## 复核范围与基线

本复核只写本报告；未修改 Goal、Design、Cases、CoverageMatrix、AC 来源或产品源码。Lane Card `S02-F01-R4-FULL-SHAPE-DESIGN-REVIEW-r001` 校验通过，规范化摘要为 `785da856d6313cd03ff0af5739527be455ef6b53f40b9955c624d2ec406791bc`；Context Bootstrap 校验通过，27 项 required-read 均存在且摘要匹配，`skipped_reads=[]`。独立查看了候选设计、Cases JSON、Crosswalk Review r003、Design r004、CoverageMatrix/Goal 结构和当前 V3 查询组件；另核验 SP-010 Semantic Review 双结论、Frame-First、架构审查、误读测试和实现准入要求。

静态结构核对结果：Goal AC 10 项唯一、must-have 26 项唯一、产品义务 16 项唯一；候选有 12 个形态行、71 个字段行、9 个 R4 disposition 和 32 个 case。16 项产品义务都至少映射到一个业务或 `FS-BASE-*` case，没有 AC 漏映射或未知 AC；字段行均有来源与状态，但这些检查只证明登记/结构一致，不证明 schema 完整或行为正确。JSON 中 32/32 项均是候选、未冻结、未运行、无执行证据；`execution_evidence=[]`。

当前源代码显示的形态差异支持设计保留分型与阶段边界的做法。例如 `Select.vue` 的 `clearCascadeSelectValue` 会分别写 `selectValue`、`mapValue`，在配置入口还会写 `defaultValue`/`defaultMapValue`；`setDefaultValueFirstItem` 在配置与运行分支有不同副作用，`defaultValueFirstItem` 并不能单凭前缀归为静态配置或运行缓存（`core/core-frontend/src/custom-component/v-query/Select.vue:174-181,476-560`）。仅凭列出的组件局部代码不能冻结持久 schema、历史缺省或全部 consumer；候选也将创建工厂、保存/恢复和实际消费路径列为待取证项。

## 全形态、字段与义务映射判断

12 个 shape/axis 被清晰列为 7 种查询条件形态和 5 个正交关注面，并明确“五阶段均列出不代表阶段完整，也不代表所有轴的笛卡尔积合法”。这是有用的防过度概括边界。候选表同时逐项保留 select 数值类型、文本 F/S 语义、数值范围端点、时间时区/粒度、动态时间边界、树路径编码、跨 dataset 级联、参数 DTO、选项来源及历史 carrier 的未决项；当前表格不能被当成可执行的完整合法组合表。

71 字段的 KEEP/REBIND/RESET/REMOVE/NOT_READY 分类体现了“可信设计原件、运行副本、目标引用和未知来源”之间的重要区别。尤其是“仅排除新 carrier，不改输入对象”“未知键阻止整次发布”“RESET 不是统一赋空值”“多动作行是条件分支”等约束，边界合理。冻结前仍须把身份字段写成带容器和阶段的路径：如 `component.id`、`condition.id`、`cascadeNode.id` 不应只共用 `id` 标签；并将 `defaultValue`、`defaultMapValue`、`optionFilter` 等混合字段的动作细化为可判定的来源/shape 条件。否则后续实现者可能把候选的条件动作压成统一字段白名单。

16 项产品义务的登记覆盖成立，且候选保持了 F01 原义务、关联 Q066/Q067、S01 依赖和真实权限边界。需要强调：有 `FS-BASE-*` 行只是把义务保留在候选分母中，不能计作完整 oracle、覆盖完成或验证通过。Crosswalk Review r003 的 DCX-003（全形态合同未闭合）、DCX-004（Cases 未冻结）和 DCX-005（Entry Packet/权限环境缺失）仍适用于本轮，当前候选没有提供证据解除它们。

## Findings 与处置

| ID / 严重性 | 发现与证据 | 对判断的影响 | 修复/处置 |
|---|---|---|---|
| `R4FS-001 / P1` | **合法 shape/axis 组合的分母未定义。** shape 行列出了多个轴，Cases `FS-002` 又要求“全部选择组合”，但 fixture 均为空，且设计声明并非轴的全笛卡尔积都合法。其他时间、树、参数与 cascade 也有同类合法组合待生产路径证明。 | 无法判断测试是在覆盖全部真实支持形态，还是在把不存在/不合法组合扩成验收义务；也不能冻结 schema 与测试分母。 | 以真实创建工厂和消费路径列出合法组合、历史合法组合、非法组合及各自的拒绝 oracle；把 `all combinations` 收敛为可追溯清单，不凭轴推导组合。 |
| `R4FS-002 / P1` | **完整字段语义的来源链仍不完整。** 71 行大多绑定在 7 个局部查询组件，部分来源只有宽范围或模块级引用；创建工厂、画布保存/恢复与嵌套遍历、实际查询消费链、参数 DTO/时间工具和最终写入 owner 尚未形成可复核的端到端映射。候选本身也承认这些路径未取证。 | 字段责任矩阵可以作为候选索引，不能证明“完整 schema”，也不能说明任意字段在创建、配置、运行、保存、恢复中何时变化。 | 对每个 shape 建立 `producer → config confirmation → runtime consumer → save/load → history/undo` 的源码路径和版本/阶段证据；将源路径补进独立 read-set 后再审。 |
| `R4FS-003 / P1` | **Cases 当前不可执行且无完整 oracle。** 32 项全部 `fixture_payload=null`、`oracle_status=NOT_READY`、`NOT_RUN`，无 evidence；日期未提供确定 timezone/DST/月末/闰日预期，树无完整编码与命中 ID，参数无完整 DTO，副作用计数/保存重开也没有可运行 fixture。 | 16 项登记关系成立，但 AC-S02-02 的“映射到完整测试且无关键未决项”尚不成立；候选不能提供可信 RED/GREEN 或验证依据。 | 为每项需覆盖的原义务生成确定性输入、预期完整输出/拒绝、零副作用断言和所需运行环境；保持同一 case identity，先独立复核合同，再申请冻结。 |
| `R4FS-004 / P1` | **身份字段和条件动作还不够路径化。** 例如 `id` 同时涉及条件、级联节点与目标组件身份，行内再以文字区分 REBIND/KEEP；`defaultValue` 在配置态和运行态存在不同写入行为，`optionFilter` 可能是规则也可能是运行态结果。 | 后续 builder 可能根据字段名而非对象类型/来源阶段进行全局处理，违反设计原定的无静默猜测与路径闭包规则。 | 将 field path 包含对象类型、shape、阶段及来源 owner；为每个多动作字段增加判定条件与反例 fixture，使 KEEP/REBIND/RESET/REMOVE 的互斥/条件关系可机械审查。 |
| `R4FS-005 / P1` | **产品准入外部前置仍未满足。** Review r003/DCX-005 与最新准备记录维持 S01 F01 Packet `NOT_AVAILABLE`、真实权限环境 `BLOCKED / NOT_RUN`；设计的发布、预览、副作用、撤权和跨标签重新授权尚无可验证产品 owner/环境。 | AC-S02-03 不能由本设计 review 单独关闭；禁止产品 UI/Store 或目标配置提交准入，也禁止以 standalone/admin/mock 替代权限证据。 | 保持阻塞并继续独立准备环境；Packet、独立 Review、终态摘要和隔离多用户真实权限验证到位后，刷新 context/topology，重新做目标绑定准入。 |

## AC-S02-02 / AC-S02-03

- **AC-S02-02：保持 pending。** 16 项义务均登记映射到候选 cases，但 Cases 还不是完整冻结测试；存在 32 个未就绪 oracle，且 shape 合法性和端到端来源链未闭合。登记完整不等于关键设计未决项已清零。
- **AC-S02-03：保持 pending。** 本报告提供一份独立全基线语义结论，但其结论并非“完整设计已冻结/没有关键未决”。此前 DCX-003..005 仍成立；本报告不检查全部产品实现差异，也没有实际 S01/权限行为证据。
- 本 Review 不重判其他 Goal AC；16 项产品义务仍 `NOT_RUN`，不存在本报告授权的状态提升。

## 边界与架构审查

- **真值载体与 authority：** Goal、S00 AC/映射/决策与原始用户意图是需求权威；Cases 是 witness 候选；Design 是候选实现输入；CoverageMatrix 承载登记/执行状态；Review 是独立判断。候选没有把 Dashboard 叙述宣称为产品真值，但未来不得把 `full shape` 标题、字段数或 `FS-BASE` 行读成完成度。
- **law / witness / decision 分离：** 当前 Design 同时放有候选规则、未决证据要求和失败 oracle；Cases 独立承载 fixture/oracle/执行状态，方向合理。不得将 Cases 不断扩成唯一规范 schema；稳定形态契约、可执行 fixture 和运行结果应保持不同载体，并通过 ID 引用。
- **半 schema 与复杂度：** KEEP/REBIND/RESET/REMOVE/NOT_READY 是有操作意义的标签，但其行结构仍是 Markdown/JSON 半结构描述，不具备条件谓词验证器；不要宣称“机器验证通过”。在字段规则继续增长前，先确认是否拆为小型 shape contract、source-backed witness fixture、独立执行结果，避免一个超大适配器同时承载所有形态规则、目录身份和授权/发布治理。
- **S1-S6 / L0-L6 诊断：** 主要是 `S5 可验证性不足 / L5 验证`（payload、oracle、产品环境未到位）；其次为 `S4 语义歧义 / L2 能力边界`（形态合法组合、复合身份路径和混合字段动作待定）。当前候选明确保留这些未知，尚无证据表明其已造成产品运行时语义漂移；此分类用于定位下一步证据，不是分数或运行判定。

## 最小安全下一步、实现阶梯与 Session map

**最小下一切片不是产品 Builder。** 先形成一份有边界的来源补齐切片：针对一个已经有既存子合同/生产链证据的 shape（优先 `SH-SELECT-TEXT`），只追 `options.ts`/创建配置、配置确认、非配置运行 consumer、保存恢复和可信 owner；补齐该 shape 合法组合的精确 fixture/oracle，再独立复核。该切片只做源码/合同/Cases候选，暂不读写产品配置，也不接 Store、权限或发布流程。若找不到阶段 owner，则继续报告 `NOT_READY`，不靠字段名猜测。

建议实现阶梯：

1. 完成逐 shape 的 producer/consumer/save-load 源码证据与合法组合目录，路径化 71 字段及来源阶段。
2. 将 fixture/oracle 按真实场景拆分；先收敛一个可独立验证的纯离线 adapter contract，加入可信 RED 预期与失败零副作用断言，再独立审查并冻结该子范围。
3. 对非权限依赖的 detached building block 申请准确的 Builder admission，只实现被冻结的子合同；RED/GREEN 使用相同 fixture identity，验证独立于 Builder。
4. 等真实权限环境与 S01 F01 Packet/Review/终态摘要齐备后，另行冻结跨身份、目标权限、撤权、保存/预览和目标提交合同，刷新 topology 并请求产品入口准入。
5. 完成全形态产品接线后，对完整 10/26/16 原分母做 independent Validation、最终状态复核和 closeout；本报告不代表该阶段完成。

**下一 Session map：** `R4-SH-SELECT-TEXT-SOURCE-ORACLE`（候选）只补齐文本选择器来源 owner、合法配置组合、跨阶段 fixture 与确定 oracle；结束条件是来源/组合表有路径证据、fixture 可执行、失败与副作用边界可审，并仍把未审形态标为未就绪。之后按依赖再分别推进 NUM/TEXT/RANGE、TIME、TREE/CASCADE/PARAMETER、SAVE/HISTORY；跨入产品 UI/Store 前单独要求 S01/权限准入。该 map 不缩减现有原分母，`Scope Delta: none`。

## 术语压缩风险与未来误用

- **压缩误读：** `full-shape`、`mapped`、`candidate`、`PASS_WITH_FINDINGS` 若单独出现在 Dashboard 摘要，可能被误读为完整设计通过或 Cases 覆盖完成。摘要应写成“全形态候选已登记；设计未冻结，32 项 oracle 未就绪/未运行”。“16 项义务有映射”必须附加“不等于完整测试或验收”。
- **未来误用场景 1：** Builder 看到 12 个 shape 和 71 行 field matrix 后直接把动作标签做成全局白名单。**防护：**保留逐 shape/阶段/来源条件，先冻结一个精确 shape 子合同；未知输入继续整次拒绝。
- **未来误用场景 2：** 测试作者把 `FS-002` 的轴组合全部当作正式支持组合，或只挑简单组合后声称全形态覆盖。**防护：**先由生产创建/消费路径界定合法组合分母，fixture 列出每一组合并覆盖拒绝组合，不从轴做笛卡尔积推导。
- **未来误用场景 3：** 产品接线者以 standalone/admin 或 mock 权限替代用户可见内容保护和撤权。**防护：**保持真实权限 `BLOCKED / NOT_RUN`，取得隔离权限实例和持久测试账号后执行多身份、直接接口拒绝、撤权和跨标签失效验证。
- **未来误用场景 4：** 把 `FS-BASE-*` 的义务登记、静态 JSON 计数或本 Review 的 `PASS_WITH_FINDINGS` 当成目标验收通过。**防护：**结果仍写 `NOT_RUN`，把 Review 结论限定在设计候选和独立语义判断。

## 范围与复核结论

分母保持 Goal AC 10 项、must-have 26 项、产品义务 16 项；`Scope Delta: none`。本 Review 只判断当前全形态设计/Cases候选是否适合冻结或作为产品实现入口，不宣称实现、运行行为、权限行为、AC 通过或 Goal 完成。下一步先补齐来源链、合法组合和一个最小 shape fixture/oracle，再进行独立复审；S01 与真实权限环境未就绪时，产品 UI/Store/目标提交继续不准入。
