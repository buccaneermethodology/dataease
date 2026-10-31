# 查询窄投影设计独立复核 r001

## 双结论

**Design Freeze Validity：VALID_WITH_BOUNDS_FOR_QPROJ_001。** 六个identity及其oracle可按当前窄域冻结；未发现阻止该纯投影实现的语义缺陷。

**Implementation Entry Readiness：READY_FOR_BOUNDED_ADMISSION，尚非ADMITTED。** 可立即由控制面建立新独立Builder card和精确target-bound admission、预检现有runner并进行可信RED/GREEN及独立Validation。完整query转换、可信来源和权限的后续缺口不阻止这个不接产品入口的纯模块；本报告本身不授予执行准入。

审查者 `/root/s02_goal_review`。中断后重新校验卡片expected canonical digest `02b10c02057aa6bcfaabec217d0c4715cd950c27cbb293bb34c51bf0084aff7e`通过。设计SHA256 `89c3a54be31a09668e43da990369bb8273c0d94e0ef2765d5d8a8e9cdf113596`；fixture SHA256 `d5ecf7a70c11108f80052605da4b016d9fb52296c800c7605d2e40208bed641d`。仅新增本报告，未运行产品或修改源码。

## 源码与authority核对

- options.ts:8–65新建displayType为字符串0，optionValueSource初值数字0；QueryConditionConfiguration.vue:1184–1208级联普通分支要求数值化displayType属于0/2/5且optionValueSource严格为数字1。设计:17–19将支持域收窄为字符串0/2/5及数字1，有明确声明，不能推广为全部历史配置合法性判断。
- checkedFields是关联图表组件ID集合，checkedFieldsMap按组件ID给字段ID；不是dataset ID。配置面板:147–162从canvasViewInfo取id/tableId，后续字段目录按componentId建立关系。设计:9、19及fixture:69–78正确要求显式sourceComponents，通过唯一组件匹配获得datasetId，再校验Map字段属于fieldIds；没有偷用条件dataset.id作为所有关联图表的数据集。
- sourceComponents仅为调用方传入的元数据断言。fixture:271明确本函数不证明可信或权限；本报告不将canvasViewInfo等同权限authority，也不认为此目录是目标chart-B实际承载证据。source目录校验的是源chart-A，componentMap只是后续ID映射。目标真实字段/权限核验仍由完整适配层承担。
- QueryCascade.vue:68–78构造dataset/query/field三段复合键；142–148生成独立node.id；151–165同数据集后继可以独立fieldId为空。设计:11、23区分三段末字段与独立node.fieldId，非空独立字段/跨数据集级联明确越域拒绝，不静默丢引用；首级也只接受已声明空值形态，并未声称现有所有节点都如此。
- Select.vue:248–273确有运行mapValue与配置默认写入区别。投影不读默认/运行值，输出只是引用计划输入，不是可替换原payload的部分过滤树。

## 接口、顺序及六项oracle

直接核对query-reference-plan.ts:18–38，投影value精确包含conditions/chains/conditionMap/nodeMap/componentMap，节点与targetRefs键符合QPREP当前精确键校验。maps仅投影命名结构，映射完整性/单射、重复局部ID、节点闭包与身份、环继续由QPREP处理，不新增平行authority。新对象要求包括映射内数组，不可仅浅拷贝componentMap而共享源数组。

| identity | 裁定 |
|---|---|
| TC-QPROJ-001 | 普通两条件、同dataset三段链得到精确五键输出；源字段和关联图表身份正确，默认浙江/运行江苏均未泄入输出。 |
| TC-QPROJ-002 | cascade缺省变空chains，nodeMap多余键保留。当前QPREP只要求实际节点映射齐备，故可消费；不得把缺省与显式null混同。 |
| TC-QPROJ-003 | 空sourceComponents无法确认chart-A，SOURCE_COMPONENT_UNRESOLVED正确，不默认dataset。 |
| TC-QPROJ-004 | 201--q2仅两段，INVALID_COMPOSITE_REFERENCE正确。 |
| TC-QPROJ-005 | displayType9及非空树引用越出声明域，UNSUPPORTED_REFERENCE_SHAPE正确；不是最终产品永久拒绝树。 |
| TC-QPROJ-006 | projection应成功并输出conditionId=missing；仍有q1/q2和n1/n2完整maps，QPREP:140–165映射检查通过后发现missing闭包，返回MISSING_CONDITION。不得把该错误提前变成projection失败，也不得声称投影成功即可粘贴。 |

独立确认六个identity唯一且正好001–006。fixture:264–269明确INVALID_INPUT→UNSUPPORTED_REFERENCE_SHAPE→SOURCE_COMPONENT_UNRESOLVED→INVALID_COMPOSITE_REFERENCE；实现应按错误类别阶段优先、阶段内原数组顺序执行，不能仅逐条件提前返回后类错误而遮蔽后续条件的前类错误。现六项无相互矛盾的首错oracle。复杂引用允许的空容器须保持设计:21的类型约束，不将错误标量当空值。

## 范围与findings处置

当前未发现阻塞本切片的P0/P1/P2设计finding。准入写范围仅：

- `core/core-frontend/src/custom-component/filter-copy/query-schema-projection.ts`
- `core/core-frontend/tests/filter-copy-query-reference/query-schema-projection.test.ts`

不得修改QPREP、现有copy.ts或其他产品入口，不接Store、网络、Date、GUID/事件。现有runner预检失败不得静默安装依赖；测试应保留真实可执行RED及原始证据，同六identity GREEN，后续独立Validation再评价实现。

未知版本/隐藏复杂字段、反向payload重写、可信设计来源、真实source元数据获取及target权限/承载均为后续门槛。函数只承诺已确认普通引用形态的窄投影，不得在UI中当完整schema验证器，不能用UNSUPPORTED长期替代合法复杂形态的最终成功路径。

Goal.final.json权威与前次整合审查分母未改变：原10项Goal AC、14项F01及Q066/Q067共16产品义务全部保留。此包未宣称其中任何产品义务完成；真实身份、只读配置保密与撤权继续阻塞/未运行。最大声明是六项有界投影合同经实现和独立验证后成立，不能升级为全查询、权限、F01、S10或Goal验收。
