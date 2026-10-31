# 普通文本单选目标完整重建合同 r008

状态：DESIGN_CANDIDATE_REVIEW_REQUIRED，待独立审查，不预设通过。QTARGET-REBUILD-001将已审QCARRIER的同源design/runtime载体与显式引用计划组合，输出目标完整两份propValue/cascade；这是目标身份重绑与默认水合的组合，不重写QVALUE、QCARRIER或已有COPY。

SP010专属card/context校验通过且render消费；canonical digest 97f4e576a56c55d8feaed75239a8c00aa0300d0157cfefa446953df1e4f437ef。源码及依赖摘要绑在卡中。本次只新建r008设计/fixtures和专属卡/Context，不实现、不改旧合同。QCARRIER独立设计Review-r002有界通过；Validation-r001记录22项行为通过，但耐久Handoff/状态绑定仍阻断包级PASS，本设计不追认其治理终态。

## 完整输入与输出

输入根精确{source,referencePlan,targetComponents}。source是QCARRIER既有完整单条件JSON {propValue:[condition],cascade:[]}，可为无默认或显式默认；真实来源仍为配置确认后序列化形态，可带当前运行B。不是直接接受调用方伪造的“已验证”标记，当前源码prepareSingleSelectCarrier会实际复验其完整字段及值域。

referencePlan沿QPREP命名结构，恰conditions/chains，conditions恰一项{id,datasetId,fieldId,targetRefs}，chains必须[]。每targetRef恰componentId/datasetId/fieldId。targetComponents每项恰componentId/datasetId/fieldIds；目录是显式离线资料，不证明权限/来源或新鲜性。完整结构、ID与重复规则见JSON，不能从名称猜字段。

成功输出{ok:true,value:{design:{propValue:[完整目标条件],cascade:[]},runtime:{propValue:[完整目标条件],cascade:[]}}}。两份都是完整目标载体：design无select/map；runtime从默认A恢复A及A-code，或无默认时select缺省/map=[]。不是只给引用差异，也不是交给Builder自行拼回完整对象。

## 最新源码与兼容依据

Select.vue:248–273区分配置写defaultValue/defaultMapValue与运行写selectValue/mapValue；Component.vue:674–683重置恢复默认；当前QCARRIER末段以真实QVALUE生成runtime，再独立构造design/runtime。query-single-select-default-copy.ts重绑三个身份字段却透传运行B，因此不能用COPY替代本组合；也不能修改COPY改变其已冻结语义。现有QPREP的引用计划提供condition/targetRefs身份结构，但不提供完整配置。本函数不重算QMAP、不从目录自行选目标，严格验证给定计划与source及目录吻合。

## 字段级责任

Fixtures逐个列出完整源condition字段约束及target_field_matrix。REBIND仅id、checkedFields、checkedFieldsMap：新condition id来自计划且不同源id；targetRefs必须逐项对应source.checkedFields数量和顺序，dataset/field保持源身份；同字段多个源引用可落同目标，按首次顺序去重。目标目录中每个componentId唯一且字段覆盖。

其他字段KEEP各自QCARRIER输出并深拷贝，不能把source运行B又覆盖回来；selectValue/mapValue在design REMOVE，在runtime RESET完全沿QCARRIER已冻结规则。defaultValue无默认时仍缺键，显式默认保留A；未知/缺字段REJECT按QCARRIER契约，不在本层补默认。非空source cascade由QCARRIER拒绝，非空plan chains由PLAN拒绝；不能为了满足空输出清掉真实级联。两个cascade各新建[]。

同一条件多引用折叠仅当字段一致；本域每ref必须等source.field.id，所以不一致先PLAN_MISMATCH。不得删除targetRefs输入以掩盖未映射引用。允许目标chart与源chart同ID（同画布不同查询控件场景），只要求新conditionID不复用源conditionID；不同身份命名域不混淆。

## 算法、错误顺序与原子输出

1. ENVELOPE检查整个输入JSON安全及精确根三键。非对象/非法JSON返回INVALID_INPUT，缺/多根键UNSUPPORTED_FIELD。拒绝getter、symbol、特殊原型、稀疏数组、循环、undefined、非有限数；检查描述符先于取值。
2. 根合法后恰一次调用真实prepareSingleSelectCarrier(source)，失败返回{ok:false,stage:'QCARRIER',reason:原reason}。本步骤先于plan/directory语义判断，不复制其校验算法。
3. PLAN核对完整计划精确键、单条件/空chains、新ID、源dataset/field、每个targetRef与源引用数量。任一失败PLAN_MISMATCH。
4. DIRECTORY核对非空目录、所有条目形状、ID唯一/同dataset/field覆盖；任一失败TARGET_UNRESOLVED。未使用合法目录项可保留在输入但不复制到输出。
5. 完成全部验证后分别从QCARRIER两载体深拷贝，写入三个REBIND字段，返回完整value。中间QCARRIER成功值不能在最终失败时暴露；整个函数不修改任一输入，无partial输出、不发事件。

失败形状固定{ok:false,stage,reason}。全局ENVELOPE→QCARRIER→PLAN→DIRECTORY；各阶段一次结束，不同时报多错。非法JSON在任何子对象出现都先ENVELOPE INVALID_INPUT；JSON有效但plan结构缺陷要等QCARRIER后才判PLAN。不会把内部抛异常伪装业务成功。

## 16个固定oracle与实施验证

所有用例给完整input/expected。001显式A/B到新目标；002无默认；003多源同字段折叠；004多目标顺序；005源额外键；006字段错配；007旧条件ID；008丢引用；009目录缺字段；010添加级联；011源默认空值；012重复目录；013/014双错优先级；015根额外键；016非对象。

额外不变量必须测试：源/plan/目录深冻且不变、输出与输入及design/runtime间任一对象/数组不共享、源仅B变化不影响输出、JSON往返缺键保持、失败没有value。Spy可检查QCARRIER恰一次及失败阶段顺序，但必须执行真实内核、不替换返回值；QVALUE调用仍由内核负责。本轮只构造oracle，不执行拟实现函数。

## Builder候选与剩余范围

若独立审查接受，仅新建core/core-frontend/src/custom-component/filter-copy/query-single-select-target-rebuild.ts及core/core-frontend/tests/filter-copy-query-reference/query-single-select-target-rebuild.test.ts。父流程需新Builder card/context和精确admission；不修改任何既有纯模块，不做UI/Store/权限/保存/产品adapter注册。

本域仍单条件、普通文本单选、空级联；多条件/非空级联/树/参数/动态日期/多选全部保留后续义务，不以UNSUPPORTED_SHAPE缩减Goal。目标目录可信、源版本、真实权限、产品提交/预览/保存均未证明。QPADR-03仅本有界组合候选，不关闭完整DG-03或10+16原分母。
