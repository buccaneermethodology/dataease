# QTARGET-REBUILD-001 设计独立语义审查 r002

## 双结论

- **Design Freeze Validity：PASS_WITH_BOUNDS_FOR_QTARGET_REBUILD_001**。r008对单条件普通文本单选、空级联的目标完整design/runtime重建合同可冻结为有界实施输入。
- **Implementation Entry Readiness：READY_FOR_BOUNDED_ADMISSION**。无内容层阻断；父流程绑定新Builder card/context及target-bound execution admission后，可进入下述仅两个新文件的实施。不是Builder已经准入、实现已通过或产品已集成。
- 准入target：`core/core-frontend/src/custom-component/filter-copy/query-single-select-target-rebuild.ts` 与 `core/core-frontend/tests/filter-copy-query-reference/query-single-select-target-rebuild.test.ts`。
- 不准入：改写QVALUE/QCARRIER/COPY/QPREP、UI/Store/保存/权限/产品adapter注册、全形态扩域或复用旧RED为本模块RED。

## 接收端及审查基线

实际复验SP010卡 `planning/QTARGET-REBUILD-001-design-review-card-r003.json`，canonical `bcce5db56dde4c51c192de215b20087109f998bedc6c630fd824cb5d3a9e9568`，verdict=pass、exit=0；write_scope与required_outputs均唯一指向本r002报告。35个base_context_refs摘要一致；ContextBootstrap r003校验exit=0，34个required_read_set摘要一致。原Goal摘要保持不变。

本轮先尝试了不存在的guardrail mode semantic-reviewer，退出2；依据CLI支持列表改用 `--mode semantic`，退出0并消费清单。该首次命令错误未被记为通过，不构成内容缺口。

r001卡的Sessions摘要漂移、r002卡仍写r001路径的问题由r003重baseline修复；旧卡/Context不覆盖。之前只读核对可复用，因为本轮引用摘要全部相符；最终判断绑定r003，本报告不追认旧卡可用或先前Builder。

冻结设计 `QueryProductRebuildDesign-r008.md` SHA256 `89ec61d05223f113af04bfdf4be27b43b65dc00d52ab14ff9ebd3e1536ce22ee`；fixtures SHA256 `82fd0a80b0df95feac231661c6307476f1270d96752851d9636b3f8bb1dabd42`。

## Boundary / 语义架构

source是完整单条件propValue/cascade JSON，不是九键投影或外部validated标记。referencePlan是明确输入的引用计划，不等同目录授权；targetComponents是离线目录，不证明来源、新鲜性或访问权限。目标condition ID、chart ID、dataset/field身份各属不同域，不进行全局字符串替换。

本层只组合QCARRIER值状态处理与目标引用重绑。REJECT仍按窄合同，不能用复杂shape的失败关闭其产品义务；它不取得整个产品schema权威，也不把执行fixture升格canonical产品规则。没有新增通用规则DSL或平行默认值语义。

71个target_field_matrix键与source_contract.condition_fields全集精确一致。REBIND仅id/checkedFields/checkedFieldsMap；其余KEEP必须取各自QCARRIER输出，不可重新覆盖source的运行B。design移除selectValue/mapValue，runtime按内核恢复默认A/A-code或无默认缺select且map=[]；无默认defaultValue继续缺键。未知/缺字段委托QCARRIER拒绝，不补历史默认。两个cascade新建空数组，但非空源级联/计划chains必须先失败，不能删掉伪成功。

## 引用闭包与目录

新condition ID不得等于源condition ID；允许chart目标与源chart同ID，不混淆身份域。计划恰一条件、空chains，dataset/field与源一致，每个targetRef匹配同dataset/field且数量等源checkedFields，按源顺序解释对应关系。源关联本身由QCARRIER精确校验。

相同字段多源→同目标可首次顺序去重；不能提前减少targetRefs数量掩盖未映射引用。多目标保留第一次出现顺序，Map保持字段。目录所有项都校验精确形状及componentId唯一，所用目标必须同dataset且包含field；未用合法项不复制进输出。目录不负责自动选目标，不能取首个重复ID绕过歧义。

## 16个完整oracle

001–004已独立从完整source构造design/runtime，再逐份替换三个REBIND字段，完整expected逐项相等；此为oracle审查，不是拟实现函数GREEN。

| 用例 | 核对结论 |
| --- | --- |
| 001 | 默认A/运行B→新目标，design无B、runtime恢复A及A-code |
| 002 | 无默认，目标default/select缺键、runtime map=[] |
| 003 | 两源同字段映同目标，按首次位置去重，保持完整两载体 |
| 004 | 多源独立目标顺序保持 |
| 005 | 源额外字段→QCARRIER/UNSUPPORTED_FIELD |
| 006 | 计划字段错配→PLAN/PLAN_MISMATCH |
| 007 | 复用源条件ID→PLAN/PLAN_MISMATCH |
| 008 | 丢目标引用→PLAN/PLAN_MISMATCH |
| 009 | 目录缺所用字段→DIRECTORY/TARGET_UNRESOLVED |
| 010 | 非空plan chains→PLAN/PLAN_MISMATCH，不清空伪成功 |
| 011 | 源默认空串→QCARRIER/UNSUPPORTED_SHAPE |
| 012 | 重复目录componentId→DIRECTORY/TARGET_UNRESOLVED |
| 013 | 源形态、计划、目录多错→先QCARRIER |
| 014 | 计划、目录双错→先PLAN |
| 015 | 根额外键→ENVELOPE/UNSUPPORTED_FIELD |
| 016 | 非对象→ENVELOPE/INVALID_INPUT |

12个失败均经完整输入相对001差异核对；stage/reason与设计一致，失败不返回value/partial。ENVELOPE对整个输入JSON安全检查先于任何下游，故plan内部undefined/getter等先INVALID_INPUT；合法JSON但计划键缺陷必须在QCARRIER之后。这一层顺序与子模块内部优先级分开，不强行全局改写QCARRIER错误。

## 真实依赖与partial边界

当前QCARRIER源码摘要与卡相同；其429–447行显式默认路径真实调用prepareSingleSelectValueState，450–465行分别构造design/runtime并清运行字段，无默认不调用QVALUE。QTARGET合同要求根合法后恰一次真实QCARRIER，禁止mock替代、复制其校验逻辑或用COPY透传B；本层失败只加stage且保留原reason。QCARRIER先成功也不能在PLAN/DIRECTORY失败时泄露中间候选。

QVALUE Validation-r002为有界PASS。QCARRIER Validation-r002仍明确partial：行为22项及真实QVALUE调用计数通过，耐久输入已补齐，但其报告时点的后验控制面绑定未闭环。此限制不表示纯函数行为失败，也不禁止以固定源码作为本有界组合依赖；本报告仅接受这种行为证据与源码边界，不把QCARRIER整体包改判PASS，不关闭其finding或追认原r001终态。目标模块仍须独立证明组合行为。

## Evolution / 实施阶梯与防误用

本合同给出可立即实现的正向入口：三键输入→ENVELOPE→真实QCARRIER→完整PLAN→完整DIRECTORY→两载体独立重绑。Builder无需重新决定字段策略。唯一下一步是两个新文件真实RED/GREEN、定向lint及独立Validation；spy只能计数并执行真实依赖，不能替换返回结果。

必须覆盖deep-freeze输入、source/plan/目录不变、design/runtime及输入间任一可变对象不共享、两份checkedFieldsMap与cascade独立、运行B变化不影响输出、JSON往返保留缺键、失败无value及多错顺序。非JSON/getter/循环/稀疏数组由运行测试构造；静态JSON不能证明它们。以上是现有合同验证义务，不新增设计前置。

误用场景：将“目标重建ready”压缩为“查询复制支持完成”，或将离线目录当权限，或把该空级联切片注册为全适配器。防范为仅绑定两个文件、保留窄函数契约及独立验证claim ceiling。后续全形态、真实目录/权限、提交预览、保存历史仍在完整Goal。

## Findings / 最终边界

当前设计内容阻断findings：无。旧审查卡两项问题已由r003消除，不倒推旧卡成功。QCARRIER partial保持为依赖声明限制，不作为本纯函数设计的隐藏禁止条件。

只新增本报告，未修设计/fixtures/源码/Goal。10项Goal AC与16项产品义务保持原分母；真实权限BLOCKED/NOT_RUN、完整adapter未准入。R4-01全域、DG-03、S02/F01/Goal均未关闭，本报告不证明产品运行、部署或生产可用。
