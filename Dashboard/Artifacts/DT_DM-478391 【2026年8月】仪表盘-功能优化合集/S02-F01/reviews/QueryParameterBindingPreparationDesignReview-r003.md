# 查询参数引用准备器独立设计审查 r003

## 第 3/3 轮最终双结论

**Design Freeze Validity：NOT_READY。Implementation Entry Readiness：NOT_READY。** r003 明显补充了 runtime 反例、plain-record 原型与引用隔离操作，但剩余两个合同/见证缺口未关闭。不是因为真实权限、完整 DTO 或整个 R4-04 未完成而阻断纯 helper。

这是本设计交付物最后一轮，3/3 预算已耗尽；不自动进入第4轮，不通过更名绕过轮次。AuthorityMaterials 的3/3同样未重开。后续状态与路径由父控制面在既有授权范围内处理；本报告不授权实施本候选，也不宣布整个 S02 停止或完成。

保持 10 Goal AC / 26 must-have / 16 产品义务、Scope Delta none；S01 Packet 可读且 F01 CONDITIONAL；真实权限 BLOCKED/NOT_RUN。helper 结果不提升为产品接线、权限或 AC 验收。

## 固定入口及核对方法

接收并复验父任务固定 card SHA `d2c2550411b402434f3a98acd87be648f7c735b3349f958f7a68a5f051a1d541`，validate pass 后 render。card 全量 delta_read_set 与 Context required_read_set 对应15项；15/15摘要在审阅开始及写入前匹配。候选、前两轮报告已完整读取；此前同一审查会话已读的 Goal、Design、DesignGaps、产品适配 r004、源码、权限及 S01材料内容未变，复用其已读内容并重新核验摘要与本轮职责。产品大 fixture 的审查限于结构、参数相关字段及R4-04；不冒称所有无关形态运行验证。

HEAD仍为 `1e84e7438462e5d6fc371358da3bdad7d24a5c1a`。git status已有1867行其他工作，本轮不暂存、不覆盖。唯一新增为本报告，写前不存在；未修改候选/Goal/源码，未构建或运行产品测试。

card 与 Context.maximum_claim 残留“只对r002”，但 execution_command、输入摘要、write scope及父任务均明确r003。按明确委派审r003并记录为 PBP-R3-03，不据此扩大权限。

## 前两轮全量 disposition

| ID | r003处置 | 依据 |
|---|---|---|
| R1-01 | CLOSED_WITH_BOUNDS | scalar parameters与range parametersArr[componentId]承接清楚；端点Maps由caller/消费者负责。 |
| R1-02 | PARTIALLY_RESOLVED | 错误枚举、全目录重复、顺序已定义；反例及可枚举域残余见R3-01。 |
| R1-03 | PARTIALLY_RESOLVED | 新matrix和具体变异值齐备，但旧global oracle冲突仍在，见R3-02。 |
| R1-04 | CLOSED_WITH_BOUNDS | 14字段完整样本、null/嵌套未知值保留；明确opaque非DTO校验、非混合分类。 |
| R1-05 | CLOSED_WITH_BOUNDS | 重复/多对一仅为本helper局部拒绝规则。 |
| R1-06 | CLOSED_WITH_BOUNDS | caller提取、映射、目录归属前提清楚，010不证明授权。 |
| R1-07 | CLOSED | S01可读CONDITIONAL与真实权限阻塞正确区分。 |
| R1-08 | CLOSED_FOR_DESIGN / ENTRY_PENDING | 函数、模块、测试/证据目录已有；精确卡、RED、冻结合同及admission仍属后续门槛。 |
| R2-01 | PARTIALLY_RESOLVED | plain prototype、自有键、6 runtime反例显著补齐；R3-01剩余。 |
| R2-02 | PARTIALLY_RESOLVED | 新matrix按结果分类，001/018有replacement及真改变断言；旧oracle适用性仍冲突。 |
| R2-03 | CLOSED_WITH_BOUNDS | r003文件及v3摘要构成新审查身份；18旧case数据均与r002一致，001相对r001曾改变不得称历史同一冻结identity。 |

“CLOSED_WITH_BOUNDS”仅表示本纯设计中的问题已澄清，不等于相关产品义务关闭。

## 本轮全部 findings

### PBP-R3-01 / P2 / blocking / OPEN：输入域与失败顺序见证仍有前轮已指出的缺口

位置：Design“运行时输入域/失败优先级”；Fixtures.input_domain、failure_precedence、cases及runtime_cases。

已经解决：Object.prototype/null精确原型、继承属性不能满足映射；019的JSON解析后自有`__proto__`字符串键可接受；020的默认Object.prototype.toString不能作为映射。runtime005刻意设置非plain原型，预期invalid_input，不能和020的missing-map混淆。函数、NaN、循环、accessor等拒绝已声明且有独立runtime ID。

仍有冲突：mapping段只校验/读取own enumerable键；失败阶段却写“映射所有自有值”，第三阶段又写“无自有映射”，Object.hasOwn本身也不检查enumerable。若映射存在non-enumerable源键，应该missing还是使用该值，当前两段会导出不同结果；若其值非法，应该忽略还是invalid也不同。目录对unknown own enumerable数据键保留、同时拒绝accessor，未明确非枚举accessor以及symbol key的处理；稀疏数组是否拒绝仍未明说。不是要求支持这些形态，而是需要唯一拒绝/忽略边界。

见证缺口：新增runtime001只覆盖source undefined，其他runtime专注递归类型。前轮明确要求的invalid_input与duplicate catalog并存、source顺序竞争（前source缺mapping，后source缺target及其反序）、未引用坏mapping值、非法componentId/非数组catalog仍没有case。015仍仅ambiguous-vs-collision。一个将目录重复检查提前或按错误类别全局扫描的实现仍可通过全部当前cases，却违背设计阶段顺序。

影响：已声明稳定reason无法由当前冻结见证完整区分，Builder还需决定own/enumerable域语义。建议记录具体未闭合谓词；本轮不修候选、不替设计补case、不要求扩成通用JS安全库。该项延续R2-01，而非最后一轮新增产品范围。

### PBP-R3-02 / P2 / blocking / OPEN：旧global oracle与新mutation matrix同时有效

位置：Fixtures.oracle.applies_to、oracle.mutating_output_nested_value_leaves_input_unchanged、mutation_oracle_matrix及case_operations。

新matrix本身合理：成功非空只对声明path的001/018变异，replacement分别为mutated/changed且确认输出确实改变；空成功011不做嵌套变异；失败不变异。所有输入先冻结，runtime快照要求不触发accessor。

但旧oracle原样保留：`applies_to: every case unless case_operations adds more specific mutation path`，且全局mutation仍为true。失败005..009没有case_operations，012..016虽有精确失败断言也未提供mutation path；新matrix没有声明覆盖旧oracle的优先权。因此按旧节点消费会要求失败变异，按新节点消费则明确禁止。011另写vacuous也不能解决所有失败case。r003设计称此项已处置，JSON数据仍矛盾。

影响：同一冻结文件存在两套互斥执行规则；不能让Builder自行选择哪一套算authority。需要单一适用规则或明确优先权，不能只凭正确的新矩阵忽略旧字段。本轮保持未解决，不执行修订。

### PBP-R3-03 / P3 / non-blocking / RECORDED：审查包maximum_claim残留r002版本号

位置：r003 card.maximum_claim_ref.summary及Context.boundaries.maximum_claim。

输入、命令、输出均明确r003，父委派也清楚，故不把文字残留当作无法完成审查的借口；但后续证据索引不得把本报告绑定成r002复核。本报告按实际r003摘要绑定，未修改审查包或追认Builder权限。

## Runtime DSL与schema/data核对

runtime_construction_schema是命名操作协议，不是可运行JSON Schema validator；当前不宣称程序化schema验证。6项base_case均存在，op名称均在7项允许列表中；delete_own_property未使用。路径全部只用简单对象键/数组下标，没有转义token歧义；不需要eval。replacement函数只需为函数值，返回内容不影响invalid_input判断；add_cycle的self应指回path目标；define_accessor应替换path指向属性。它们可由受限harness实现，无须执行fixture源码。

仍需后续harness实现并验证的工程细节包括：每次从base.input新建独立对象、不污染base/expected；循环图用visited集合冻结和比较；accessor通过descriptor处理而非读取getter；Object.hasOwn可用性或等价实现与当前TS目标兼容；保留JSON解析得到的__proto__自有数据属性。当前未有harness运行证据，不把DSL存在称作RED/GREEN成功。这些不作为新增产品设计blocker；R3-01/R3-02已足以阻断冻结。

## 完整fixture矩阵

| ID | 覆盖与结论 |
|---|---|
| 001 | 14字段与未知嵌套/null完整保真；path/replacement/输出真变异齐备。 |
| 002 | caller顺序胜过catalog顺序；不证明range端点。 |
| 003 | 数值标签opaque记录，不证明类型/范围。 |
| 004 | 同源重复折叠。 |
| 005 | missing mapping单错误。 |
| 006 | target missing单错误。 |
| 007 | 引用目标重复catalog。 |
| 008 | 多source同target局部拒绝。 |
| 009 | 后项失败无partial。 |
| 010 | 编码ID完整字符串，不证明跨数据集授权。 |
| 011 | 空成功；新matrix不变异。 |
| 012 | 顶层null拒绝。 |
| 013 | 未引用catalog缺id仍拒绝。 |
| 014 | 空映射值拒绝。 |
| 015 | ambiguous优先collision，非完整优先级。 |
| 016 | 未引用重复catalog拒绝。 |
| 017 | 交错重复保留首次顺序。 |
| 018 | 字符串sentinel为合法opaque值；变异path/replacement明确。 |
| 019 | 自有__proto__源键映射，保留为数据。 |
| 020 | 继承toString不满足映射，missing。 |
| RUNTIME-001 | source元素undefined，invalid_input。 |
| RUNTIME-002 | 嵌套function，invalid_input。 |
| RUNTIME-003 | NaN，invalid_input。 |
| RUNTIME-004 | 自循环，invalid_input。 |
| RUNTIME-005 | 非plain映射原型，invalid_input。 |
| RUNTIME-006 | 嵌套accessor，invalid_input。 |

20个JSON案例 + 6个runtime指令均已核对，未运行helper。r002的18个input/expected逐对象比较保持不变，新案例019/020及runtime族独立新增，未删分母。源码承接事实保持：普通生成/消费parameters，范围生成/消费parametersArr并依靠Maps；14字段DTO和QPIPE边界未变。无需重复要求完整混合字段分类、真实权限或全部R4-04成为纯helper的实现条件。

## 输入快照

审阅时间UTC：2026-10-21T03:30:59.566020+00:00。

| 输入 | SHA-256 |
|---|---|
| `Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/Goal.final.json` | `f562da2eb14b84dc8083e138dd2eb8718a58041f01d08163eddf5fb2c71daef0` |
| `Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/Design.md` | `6c7f5344446bc640a334cd986e9a1a1276c39be2823433e505cd8ae1943dc117` |
| `Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/DesignGaps.json` | `0a6e1718b0cad911c479ed7faef73664d0bf9d565383d36e226df23f93ec410c` |
| `Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/QueryProductAdapterDesign-r004.md` | `863357ddfbefdf55f715d0d6e9dd8b87f8fc6e5526c5317034822c8facce2044` |
| `Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/QueryProductAdapterFixtures-r004.json` | `9acbf272bbae793d0ccdee2131261d10ba85d256f69e6dfab761510fb9943f2b` |
| `Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/QueryParameterBindingPreparationDesign-r003.md` | `bc9b9be5131c52e8445e7cbf92818e3f29f48f73196475a077579e739532674f` |
| `Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/QueryParameterBindingPreparationFixtures-r003.json` | `a83121f56541a25d02c5b8fb198e4eff25a6e849dc28a4a127dc8b34d3071b04` |
| `Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/reviews/QueryParameterBindingPreparationDesignReview-r001.md` | `7e8fc821956a3f85962d752627f70689f6dfdf5f2e40f7616b4b6f13a3abb1f8` |
| `Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/reviews/QueryParameterBindingPreparationDesignReview-r002.md` | `7967e49ddaf2d59e3f87919f83ed473bb4a6707e523f5f1b29bbbe3381574ec3` |
| `sdk/extensions/extensions-view/src/main/java/io/dataease/extensions/view/dto/SqlVariableDetails.java` | `37678b88e71861ba54c806f70815925d91d9913b58e780d644f2dd4cc4aaa6ba` |
| `core/core-frontend/src/custom-component/v-query/QueryConditionConfiguration.vue` | `0b88bcdf92d15aceae52ca2992e7a8b4165e3f5cfc3f9cb7435296d7c7e9e047` |
| `core/core-frontend/src/hooks/web/useFilter.ts` | `d2db975ae988218a921a5e3a76869e1a66d234eeebeedb1bfcf71e847e90416a` |
| `core/core-frontend/src/custom-component/filter-copy/query-reference-pipeline.ts` | `7066211a16f981cbd05df0c5e41d97f2d01b445b397c948f9ce2344ae34b9d10` |
| `Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/PermissionEnvironment.md` | `bf1498aa23f4f864e2c5c3d999b6b1a6044849ba25a9cd7d7d85104b6f233b9d` |
| `Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/SP-005/S02-S09_EntryPacket.md` | `4598a5d74567e1e1d3de81ce263909231dc054d8102535bc0d917238c412c658` |
