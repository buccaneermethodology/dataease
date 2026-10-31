# QPIPE-001 纯引用流程组合设计

候选；card摘要9d03c29bfd28201f00c66418ab9dc03607bcd454108e055648cac6ed43e5596e接收端验证通过。仅新增本文及QueryReferencePipelineFixtures-r001.json，写前不存在。没有修改或准入产品源码。

## 当前接口及组合合同

依据core/core-frontend/src/custom-component/filter-copy下三个实际模块：query-schema-projection.ts的projectQueryReferenceInput(input:unknown)返回{ok,value:QueryReferenceInput}或ProjectionReason；query-target-component-map.ts的resolveTargetComponentMap(input:unknown)返回componentMap或映射reason；query-reference-plan.ts的prepareQueryReferences接受精确五键conditions/chains/conditionMap/nodeMap/componentMap并返回QueryReferencePlan或既有reason。QMAP目录条目要求精确三键componentId/datasetId/fieldIds，不能把带title等真实UI对象未经整理就送入。

组合层输入为JSON声明的结构；其对unknown外部输入仅做安全取字段：非对象、maps缺失等使传给QPROJ的必要字段为undefined，交由QPROJ返回INVALID_INPUT，禁止因解构抛TypeError。不新增产品校验或额外reason。maps只接受使用conditionMap/nodeMap，内部始终新建componentMap={}，调用者多余componentMap不参与目标选择。目标目录校验严格延后QMAP阶段，不抢先覆盖QPROJ失败。其他未用字段不传播到三个模块。

执行顺序固定：

1. 用propValue、cascade、sourceComponents及新maps对象调用QPROJ；失败立即返回{ok:false,stage:'QPROJ',reason:原值}。
2. 将projection.value.conditions.flatMap(c=>c.targetRefs)原顺序传给QMAP，连同显式源/目标目录。重复引用保留交QMAP按既有合同去重。失败立即返回stage QMAP和原reason。
3. 创建新QueryReferenceInput，使用投影五键但componentMap替换为QMAP成功输出，不修改projection或调用者；调用QPREP。失败传播stage QPREP和原reason，成功返回{ok:true,value:plan.value}。

不构造第二套映射/闭包/环算法；不重命名错误、不返回partial value、不捕获内部异常并伪造业务成功。有效输入域之外的运行库异常由测试揭示，不扩大业务reason。

## 六个固定候选用例

TC-QPIPE-001给普通两条件同数据集、显式源目标目录、合法级联及ID映射的完整输入输出；002同时设置空propValue和非法target目录，应在QPROJ短路；003目标零候选；004多候选；005节点引用missing条件，QPROJ只投影、QMAP正常后QPREP报MISSING_CONDITION；006增加反向同数据集链与完整nodeMap，QPREP报CYCLE。每例调用阶段序列及exact result均在JSON。

用例为源码合同派生的合成输入，不是实际产品配置。所有case统一断言冻结输入可用、输入不变、失败无部分结果。行为测试必须导入三个当前真实模块；spy只能记录调用顺序，不得用伪造返回代替模块执行。现有query-reference测试runner模式可供后续独立Builder参考；本lane不执行测试或安装依赖。

## 写入边界与执行接续

候选实现仅新增query-reference-pipeline.ts与同目录测试体系下query-reference-pipeline.test.ts。不修改三个已实现模块、冻结设计/cases或原copy入口。独立复核接受后冻结六个case身份，新独立Builder卡及target-bound admission后执行真实RED、同identity GREEN和定向lint。当前仅设计，无Builder授权。

QPROJ窄域及QMAP显式目录限制原样继承：不支持的树/参数/跨数据集引用不会被组合层绕过；目录不是可信/授权证明。QPREP候选行为与其package证据状态分开：现有历史RED/角色/时点和部分验证限制不被组合通过追认；本包不能宣称QPREP package Validation通过。纯组合也不代表Q006产品权限、Q066/Q067完整适配、保存重开或真实UI复制。

当前未发现阻止此有界组合合同复核的接口缺口；完整产品入口/权限、元数据可信、历史来源与复杂schema继续保留。完成card复验、JSON/identity及精确输出结构自检；QPIPE运行NOT_RUN。
