# QE2E-001 独立语义增量复审 r003

## 双结论

- **Design Freeze Validity：PASS_WITH_BOUNDS_FOR_QE2E_001**。r002剩余两项finding已关闭，r003可作为有界组合实施合同。
- **Implementation Entry Readiness：READY_FOR_BOUNDED_ADMISSION**。可准备新Builder card/context及target-bound admission；不是已ADMITTED或实现完成，无新增隐藏前置。
- 最小实现范围：`core/core-frontend/src/custom-component/filter-copy/query-single-select-end-to-end.ts` 及 `core/core-frontend/tests/filter-copy-query-reference/query-single-select-end-to-end.test.ts`。执行证据由专属卡明确路径；不得修改父模块、旧合同、UI/Store/权限或保存链。

## 接收端与delta范围

实际SP010卡复验pass、exit=0，canonical `c046751f0bd58fa4b96118720dac38083addbd5dd58d3d1c2de92cd38bbbe56a`。write_scope唯一为本报告；Context r003校验exit=0，required_read_set实际摘要一致。未修改设计、fixtures、代码或台账。

Fixtures r003相对r002仅修改008、010 expected及fixtures_revision；001–007其余完整结果、parent fixture摘要、映射及调用协议保持。复用r002已完成的真实父模块内存组合证据：001/002的QPIPE plan与父QPAYLOAD referencePlan精确一致；001–006及008的完整结构化结果核对一致；006重复fieldIds可通过QMAP并在真实QTARGET目录检查失败。这不是未实现QE2E函数的GREEN。

## Finding disposition

- **F-QE2E-004：关闭。** 008现为propValue=[]、target.id=query-B、expectedTargetId=query-X，确有空源与目标ID错配两错。runtime_patch已移除，唯一物化input无歧义。普通JSON ENVELOPE通过后，真实QPIPE先经QPROJ拒绝，期待 `{ok:false,stage:'REFERENCE_PIPELINE',cause:{stage:'QPROJ',reason:'INVALID_INPUT'}}`，子阶段序列仅QPROJ，不调用QPAYLOAD。目标错配不应被提前校验。
- **F-QE2E-005：关闭。** 010 expected现仅ok/stage/reason，不再包含getter_calls。设计r003修订说明将计数作为旁路断言；Builder必须实际确认getter调用次数0，不能因删除返回字段而丢弃该测试义务。

原r001三个主要缺口在r002已实质修复，r003不重新打开或追认旧版本准入。设计正文保留“Fixtures r002包含展开内容”的历史描述；本轮卡及修订记录明确绑定r003，实施应消费r003，不误用旧008/010。

## Boundary / Evolution

本切片是真实QPIPE→QPAYLOAD（内部QTARGET/QCARRIER/QVALUE）的detached组合。七键输入ENVELOPE先descriptor-first递归JSON安全，再检查精确根键；合法后按冻结映射分别调用父模块。QPIPE失败只加REFERENCE_PIPELINE cause，QPAYLOAD失败保持原对象，不暴露partial，不stub业务结果。009/010/011运行构造的特殊原型/getter/循环测试与普通JSON fixture分开。

源、目录、target都不是权限或来源真实性证明；target快照不是最新Store根。输出只允许保留目标根并替换已审两槽；无环共享输入与循环必须区别，输入/设计/运行间不共享可变引用。007以001为确定基础向量验证深冻和隔离，不能让实现结果生成预期。

实施阶梯明确：新卡/Context/admission→仅两个新文件→真实RED、同identity GREEN、真实调用计数/隔离与getter断言、定向lint→独立Validation。不因已有父模块通过而免除组合验证；依赖partial不能升级为包级PASS。

“端到端”仅限离线组合链，不是产品入口至数据库、浏览器预览或保存重开。全形态、确认、权限、Store提交、保存/undo仍在后续；原10项Goal AC、26项must-have、16项产品义务完整保留，真实权限BLOCKED/NOT_RUN，S01不在本slice。无内容阻断，不声称Goal完成。

## 绑定摘要

- `QuerySingleSelectEndToEndDesign-r003.md`：`08e3b016f96bacee5e200b7c8921ec00c44a58b3a57b15d21800e1680737fe55`。

- `QuerySingleSelectEndToEndFixtures-r003.json`：`d7ed90a5e43e631dc58d603098a7ef77d9e0c34274b3328f6a523444e27da5d8`。
