# 显式默认值单选复制源状态设计 r003

状态DESIGN_CANDIDATE_REVIEW_REQUIRED。新卡6201c937506ffed7f580ad8872ab604e2d7bebe1318cd8192624048d1ea0f752及Context r003接收端复验通过。只新增本文和Fixtures-r003.json，保留r002与独立审查历史。未准入Builder，完整Goal分母及权限阻塞不变。

## 状态选择的依据与边界

原始复制粘贴目标要求复制过滤配置和规则值，不能静默丢弃或将其替换为查询结果。F01SliceContract.md的AC-F01-Q012/Q015只是该目标投影，不替代原authority。当前源码utils/canvasUtils.ts:843–864保存当前根的cloneDeep再JSON.stringify，不重置默认或运行选择；QueryConditionConfiguration.vue:1620–1623确认后把完整conditions/cascade深拷贝回源。由此选择“复制时已确认的源JSON配置状态”为本纯函数输入和输出状态，只有身份引用变化。它是一种保留源信息的转换边界，不是在多个初始化路径中替用户选择reset或挂载行为。

此函数不读取查询结果/候选项集合，不复制外层组件布局、样式或返回数据。selectValue/mapValue及级联值是该源配置载体已有字段，本函数保留其值，不声称它们是目标已验证的最终查询状态。后续产品接入必须判断哪些配置载体可进入复制协议，绑定源revision及挂载/预览消费者；本切片不能独立宣称Q012或立即预览已满足。

## G-01/G-02处置

G-01收窄为“不透明持久值透传”：defaultValue是显示标量，defaultMapValue可能为空或多值，按原样保留，不重新计算或验证枚举存在性。Select.vue:132–150的enumValueArr映射不是本函数输入；hooks/web/useFilter.ts:140–149证实firstLoad消费已存defaultMapValue，后续消费mapValue。函数不将显示值替换成映射首项，不强制两者相等，不从目标字段目录推断值有效性。

G-02固定为转换瞬间的复制源JSON状态；不是确认/reset/挂载后态。Component.vue:331–337挂载current=select，674–683与741–743 reset另有规则；Select.vue:427–468运行又重算map。这些后续动作不在本函数内模拟。故所有值字段严格KEEP，不清空、不补默认、不触发事件。不承诺应用后这些值不再由产品生命周期改变。

## 精确实现合同候选

新函数copySingleSelectDefaultConfig(input:unknown)，纯输入source.propValue/cascade、referencePlan、targetComponents；成功返回完整新propValue/cascade，失败仅ok=false/reason。独立新模块建议query-single-select-default-copy.ts，与无默认QSINGLE和多选QPAD接口同形但互不调用，避免清理后再补回值掩盖语义。

支持普通displayType='0'、multiple=false、optionValueSource=1、defaultValueCheck=true、defaultValueFirstItem=false、required=false、VARCHAR/deType=0，无树/参数/活动日期。dataset.fields=[]，displayId=field.id；字段数据集身份不变。默认值为字符串；defaultMapValue/mapValue/节点select/current为字符串数组，允许空、多值、重复和彼此不同，不归一化。selectValue可缺省或字符串。首项动态默认、null、数字字段及其他复杂合法形态另行适配，不减少Goal。

JSON含逐个condition键的action与约束、全部嵌套键、node每键规则；未列字段绝不静默丢弃。唯一REGENERATE为condition.id、checkedFields、checkedFieldsMap、node.id及datasetId三段复合身份；REMOVE为空。其它每个字段KEEP深拷贝，包括defaultValue/defaultMapValue/defaultValueCheck/defaultValueFirstItem/selectValue/mapValue/node.selectValue/currentSelectValue。固定的false/true也原样KEEP。可缺省selectValue维持缺省；缺少其它必要键拒绝。日期占位严格ISO UTC保持，不求时钟。

算法先全量校验再构造：校验JSON/顶层→精确键→支持域→计划一一对应/完整引用→目标目录。计划校验沿QPAD r003：条件、链、节点按顺序长度核对；dataset/field不变；新condition/node ID唯一且不与源各自集合相交；完整targetRefs逐源checkedFields对应，不能删引用；同目标折叠仅在字段一致时允许，冲突拒绝。目录componentId唯一，同dataset且field存在；不证明权限。之后逐condition深拷贝全部已验证KEEP字段并生成三个引用字段，逐node深拷贝四个KEEP字段并生成两身份字段，禁止全对象clone后遗漏引用审查。

## 错误和oracle

固定优先级INVALID_INPUT→UNSUPPORTED_FIELD→UNSUPPORTED_SHAPE→PLAN_MISMATCH→TARGET_UNRESOLVED。JSON非有限数/undefined/循环/非plain对象、顶层或基础身份非法归INVALID_INPUT；必要键缺少或未知键归UNSUPPORTED_FIELD；已知值域不符（默认数组、null运行值、非字符串map、动态首项等）归UNSUPPORTED_SHAPE；计划格式/顺序/身份/引用不符归PLAN_MISMATCH；目录缺失/重复/字段缺失归TARGET_UNRESOLVED。全部验证完成才输出，失败无partial且输入不变。

12个固定identity每例给完整输入与精确输出。成功例刻意让默认、运行、节点配置与节点current不同；另一个成功例覆盖缺省select和空默认映射，不制造“空映射=值无效”的规则。负例覆盖值形态、活动首项、未知/缺键、计划/目录及双错优先级。fixtures从源码形态派生但非运行导出，不是任何枚举有效性证据。必须深等比较所有KEEP字段及缺键性，断言输出对象不共享输入引用，JSON往返稳定，不能只断言改后的ID。

## 后续准入

独立审查需明确接受“透传源配置状态且不验证枚举值”的声明上限，再冻结新卡/admission和测试资产。建议实现query-single-select-default-copy.ts及tests/filter-copy-query-reference/query-single-select-default-copy.test.ts；本lane未写实现。既有无默认/多选合同不修改。仍需真实RED/GREEN及独立验证，之后才能讨论产品接入、权限、保存重开和预览；本设计不自授予Goal完成。
