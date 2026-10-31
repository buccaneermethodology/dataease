# 单选查询 detached 端到端重建组合设计 r002

状态：待独立复审。r001因组合oracle不完整、一个错误阶段判断不成立、顶层输入安全协议缺失而判定NOT_READY；r003保留r001/r002候选，采用Fixtures r003；上节合同和声明边界沿用r002。

## 输入、顺序与错误合同

唯一实现函数为 `prepareSingleSelectQueryEndToEnd(input: unknown)`，接受普通 JSON plain object，根键精确为 `propValue,cascade,maps,sourceComponents,targetComponents,target,expectedTargetId`。第一步以属性描述符遍历整个输入图，拒绝非plain原型、symbol、getter/setter、稀疏数组、循环、undefined、函数、非有限数字；读取属性值前检查描述符。顶层/任意嵌套不安全输入统一返回 `{ok:false,stage:'ENVELOPE',reason:'INVALID_INPUT'}`，根缺键或多键返回 `{ok:false,stage:'ENVELOPE',reason:'UNSUPPORTED_FIELD'}`，不得执行getter。此检查成功后才读取七个字段。

阶段顺序固定为真实 `prepareQueryReferencePipeline`，然后（仅其成功时）真实 `prepareSingleSelectQueryPayload`，其内部按既有合同真实调用QTARGET。QPIPE失败包装为 `{ok:false,stage:'REFERENCE_PIPELINE',cause:{stage,reason}}`；QPAYLOAD返回值完整透传，不重排其 `ENVELOPE/CONTAINER/QTARGET` 失败结构。传给QPIPE的是输入的propValue/cascade/maps/sourceComponents/targetComponents；传给QPAYLOAD的是输入目标根与期望ID，以及 `{source:{propValue,cascade},referencePlan:QPIPE.value,targetComponents}`。不重新映射，不改父合同，不产生partial。

## 精确支持域、oracle与边界

此切片只覆盖普通文本单选、单条件、空cascade/chains及单个VQuery目标根。成功用例用QPAYLOAD frozen case 001/002的完整source、目标根和expected作持久输入/输出基底；QPIPE条件映射固定 `q1→q-new`、source目录来自源checkedFields、目标目录来自同一父case，冻结所得QPIPE plan必须逐键等于父QPAYLOAD的完整referencePlan。Fixtures r002包含展开后的组合输入、完整成功输出、结构化失败输出、parent fixture SHA及runtime构造的非法对象检查。不得从被测组合函数运行结果生成expected。

QPIPE目录遗漏目标对应字段时会先以 `QMAP/MISSING_COMPONENT` 拒绝，不能声称会进入QTARGET。QTARGET专属失败使用重复目标fieldIds：QMAP按既有算法仍能唯一选中chart-B；随后QTARGET按既有目录合同返回 `DIRECTORY/TARGET_UNRESOLVED`。多错优先级是安全ENVELOPE → QPIPE短路 → QPAYLOAD容器/载荷错误，不先单独校验目标以改写此顺序。

成功必须完整保留目标VQuery字段，仅覆盖两个已审载荷合同指定的查询槽；输入不变；design/runtime与输入和彼此无可变别名。所有错误无value。测试导入真实组合子模块及全部真实依赖，spy只观察和透传，不stub业务输出。支持域外形态沿底层真实失败，不被本切片永久排除，也不关闭任何父Goal义务。

## 准入与声明上限

独立审查通过后，仅新增 `query-single-select-end-to-end.ts` 与配套测试/执行证据；不改QPIPE、QPAYLOAD、QTARGET、其他冻结合同、UI、Store、权限或保存链。Builder仍需专属卡、Context、摘要绑定的精确target admission、可信RED、同identity GREEN及定向lint。最大声明仅为此detached组合候选通过有界验证，不代表产品入口、真实授权、预览、保存重开、Goal验收或S02完成。Goal原10项AC、26项must-have、16项产品义务与真实权限`BLOCKED / NOT_RUN`保持不变，S01不在范围。


## r003修订记录

依据DesignReview-r002的独立finding，Fixtures r003将TC-QE2E-008物化为“QPIPE空条件错误 + VQuery expectedTargetId与目标ID不匹配”的多错输入，确认QPIPE先失败；getter调用计数改为旁路断言，不列入函数返回expected。未改变接口、父合同或支持域。
