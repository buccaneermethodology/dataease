# S02 查询适配器设计独立审查 r001

审查者：`/root/s02_goal_review`；时点：2026-10-16T04:19:48.460893+00:00。

## 绑定与结论

接收端按renderer命令复验canonical card摘要 `772bbc149eb3e07079aa72a06e8fe70c6ae28bdb4f6695229077e77fadce42b0`，通过。绑定QuerySchemaDiscovery-r002.md摘要 `f3cdef883e90eea8750f97c511a6a1960868296d7dc28355c0e471c89045afb9`。复核当前Goal、Design/缺口、Cases、有限子合同及交接，直接检查公开options.ts、QueryConditionConfiguration.vue、QueryCascade.vue、Select.vue、cascade-utils.ts、copy.ts和ContextMenuDetails.vue相关路径。未查看XPack专有实现，未改被审资产或产品源码。

静态发现可信度：`VALID_WITH_BOUNDS`（在声明范围内有效）。初始字段并集、动态映射存在、复合引用、默认补全与多阶段确认均有源码依据；报告正确标为候选且明确没有完整白名单。

完整查询适配器Design Freeze：`NOT_READY`（尚不能冻结）。DG-03继续保留；Q066/Q067当前仍是抽象P/C/闭包或深拷贝描述，尚未形成可实现的完整数据变换与提交合同。产品Builder `NOT_ADMITTED`；无RED/GREEN、真实权限或产品运行验证结论。

## 发现及最小解阻条件

无P0/P1。以下3项P2是当前查询适配器冻结前的具体缺口；无需为完成其设计先等待真实权限模块。

### QAR-01（P2）：mapValue分类仍未消除运行态污染风险

QuerySchemaDiscovery-r002“身份和变换边界”第4项将defaultValue、mapValue及默认映射列为条件语义候选，同时提出依据目标默认规则重派生。这一方向尚不足以指导提取：Select.vue:248–272的handleValueChange在非isConfig分支更新config.selectValue和config.mapValue，在isConfig分支同时更新defaultValue/mapValue/defaultMapValue。因此mapValue并非始终为稳定默认值；直接从查看态复制当前mapValue可能把源运行选择带到目标，与“不复制当前结果/运行快照”冲突。

最小解阻：逐复制入口冻结配置态/运行态取值来源表，明确defaultValueCheck、defaultValueFirstItem、defaultValue、defaultMapValue及mapValue的关系；为“源运行选择已改变但保存默认值未变”给出精确输入与目标默认/级联预期。继续保留selectValue/currentSelectValue分支区别；不能仅将两个cascade字段清空而丢失默认语义。

### QAR-02（P2）：初始字段并集不足以冻结全部查询配置与历史恢复

r002自己承认infoFormat/attributes仅是初始对象；QueryConditionConfiguration.vue:363–550已直接显示checkedFieldsMapArr、Start/End及Num系列的动态生成与修改，validate还按displayType/parameters/树字段分支处理。Select.vue:65、294–298、362–366、721附近读取optionFilter，它不在当前初始并集内，会影响可用候选；其来源及可复制/可重建身份尚未明确。parameterCompletion按当前attributes补缺省（其中含时间对象）不能证明历史保存形态等同当前完整模型。

最小解阻：只沿实际支持的生成→保存→恢复→消费链补一张按displayType/optionValueSource/树/参数/动态时间分类的字段表，给每项明确复制、由目标元数据重建、剥离或整次拒绝的处理；追清optionFilter来源，不能无依据认定它是持久化自过滤或无害临时字段。至少补当前普通/树/参数/动态日期及缺省历史形态的正负fixture；历史兼容以当前实际载入分支为界，不要求无证据地穷举所有过往发布版本。对已确认需支持的形态不能用长期拒绝替代Q066完整交付。

### QAR-03（P2）：引用映射与提交仍只有原则，不能据此实现完整Q066/Q067

复合datasetId--queryId--fieldId与条件id/node id确有区别；copy.ts:50–82预生成组件/查询条件映射，126–145对整个JSON字符串替换，deepCopyHelper:310–318处理条件ID。该路径复制整组件且会处理样式等状态，不提供新过滤payload的结构化闭包证明。现有confirmClick先清propValue，再nextTick写cascade/propValue，后续再次nextTick触发查询，无法直接满足失败/取消零副作用和一次可观察提交。

最小解阻：以一份实际源/目标配置定义typed引用表，分别列条件ID、级联节点ID、dataset/field ID及checkedFields等目标组件引用；固定哪些重生成、哪些保持、外部引用如何精确解析，禁止名称回退或全JSON替换。给合法完整闭包、缺引用、多义、直接/间接环及双方后续修改独立的具体fixture。明确prepare只操作候选副本，确认后如何复验目标版本/权限并一次发布配置、快照和刷新；列取消/异常时哪些对象、预览和查询必须不变。未有此契约前不解除DG-03。

## 可以冻结与接收的边界

- 可接收infoFormat与attributes的初始字段清单，不能改名为全量payload白名单。
- 可冻结业务不变量：相同dataset/field身份、字段/引用不可确认或目标承载不全整次拒绝、默认规则保留且源运行态不沿用、不复制样式/布局/结果、独立副本、旧目标确认、取消/失败不提交。
- 可接收复合引用与配置态/运行态分离的静态证据；cascade-utils明确按isConfig选择selectValue/currentSelectValue判断上游清空，不证明图完整闭包或循环校验。
- 有限17项纯比较/计数合同保持此前接收结论，它们不覆盖查询字段白名单、引用重绑定、原子提交或真实权限。

## 对范围、阻塞及现有复制的判断

r002没有把copy.ts整组件复用冒充新过滤复制，也没有据普通下拉形态删掉树、参数或动态配置；其现阶段“未冻结”表述准确。整体并未发生已批准范围缩减。下一步应形成上述具体契约而非继续重复字段存在性综述；真实权限阻塞只限制对应集成/验收，不阻塞这些只读设计与fixture准备。

Q066要求完整配置和级联依赖复制，Q067要求修改互不联动及跨仪表盘保存重开；现有P/C/complete、A/B符号case不能证明这些结果。全文保持14条F01与Q066/Q067及10条Goal AC，不能通过删除复杂形态关闭完整分母。真实只读禁止查看/复制/粘贴与权限撤销保持未验证，standalone不可替代。

## 后续审查入口

最小下一包是按QAR-01/02/03补齐的字段处理表、实际输入/输出fixture和prepare/commit事务状态契约；不要求先写产品代码、启动服务或安装依赖。对该包做有界独立复核后，再判断对应切片是否可申请admission。本报告只是设计冻结充分性判断，不是执行授权或最终产品验收。
