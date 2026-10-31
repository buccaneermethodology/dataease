# 普通单选设计值提取与运行副本水合合同 r001

结论：READY_FOR_INDEPENDENT_DESIGN_REVIEW（可立即独立审查的极窄纯合同，非Builder自准入）。生产源码足以区分默认A与运行B。本切片QVALUE-001只处理九键值投影，不声称完整查询carrier或产品schema已完成，不等待权限或全形态。

## 确定源码与状态

core/core-frontend/src/custom-component/v-query/Select.vue:248–273：非配置分支写selectValue和mapValue；配置分支写defaultValue/defaultMapValue。故运行选择B不替代设计默认A。Component.vue:674–683的resetData：活动默认保留，selectValue取defaultValue，非空defaultMapValue复制到mapValue。hooks/web/useFilter.ts:140–149首次查询消费defaultMapValue，之后有选择时消费mapValue。因此新runtime恢复A和A-code与该已有reset局部赋值语义一致，不模拟挂载时序或发查询。

Select.vue:132–150以enumValueArr把显示默认映成字段编码；本函数保留已经给定的defaultMapValue，不假设A=A-code、不查枚举、不证明目标值有效。只接受非空单元素默认映射，避免reset对空映射不赋值的历史分支。首项默认、动态日期、多个映射、无默认与空值均不在本极窄合同，仍是完整Goal后续义务。

## 接口与完整对象

prepareSingleSelectValueState(input:unknown)返回{ok:true,value:{design,runtime}}或{ok:false,reason}。input是显式九键投影而非完整condition：displayType/multiple/optionValueSource/defaultValueCheck/defaultValueFirstItem/defaultValue/defaultMapValue/selectValue/mapValue。前五分别固定为'0'/false/1/true/false；两标量为非空字符串，两map数组各恰一个非空字符串。全部必要键必须有；额外id等也拒绝，不偷偷从完整condition剥字段后冒充完成extract。

输入默认A/defaultMap=[A-code]、运行B/map=[B-code]。design完整七键为固定分支五键加defaultValue=A/defaultMapValue=[A-code]；它无selectValue/mapValue。runtime完整九键恢复selectValue=A/mapValue=[A-code]，其它七键与design深等但数组独立。没有身份重绑/目标映射/cascade；这些仍由独立上游提取与完整适配设计承担。函数名字中的design仅表示值子载体，不能直接替代产品保存carrier。

算法显式验证九键及分支→按七个字段构造design→独立按七字段构造runtime并从默认补两个运行字段。禁止调用已有default-copy或先复制完整条件再删未知字段。已有COPY保留B且重绑引用；本函数剥离B并从A水合，没有重复其能力。

错误优先级INVALID_INPUT（非普通JSON对象/非法JSON值，拒绝访问器、非plain对象、循环、undefined、非有限数）→UNSUPPORTED_FIELD（精确键缺少/多出）→UNSUPPORTED_SHAPE（固定分支、字符串或单元素数组限制不符）。阶段全量完成才构造；失败无value/partial，输入不变。接口不接受函数/Date或特殊原型，不触发getter取值；采用属性描述符检查后读值。JSON缺省与undefined/null不等价。

## 冻结候选用例与不变量

Fixtures十个固定identity均有完整input/expected：A/B、默认显示C但编码仍A-code、源运行Z不影响输出；多选、首项、空默认map、null默认、多运行map、额外键、非对象拒绝。自有键断言确保design没有运行字段。成功必须有input、design、runtime三方数组完全隔离，runtime.map与自身defaultMap也不能共享；仅JSON深等不够，需修改每个输出数组并检查另外两方，深冻输入可调用。

后续Builder只能新增core/core-frontend/src/custom-component/filter-copy/query-single-select-value-state.ts和core/core-frontend/tests/filter-copy-query-reference/query-single-select-value-state.test.ts；不改已有COPY/无默认/QPAD或产品代码。独立设计审查接受后父流程生成Builder card/admission，再真实RED/GREEN和定向lint；本设计不写实现、不自行冻结审查结论。

## 治理与剩余范围

按父流程明确授权建立专属卡/Context。SP010首次Context因conditional_read_set空失败，r002因缺双mode失败，r003因dependency域未覆盖失败，均保留；修正r004的Context和卡验证成功，卡canonical digest为5b131b0cc018febbcd83cc7d5bffa1ffafc4691ec05729f2d2a1aabae03d0ed5，render已消费。仅两个设计文件是当前设计lane写scope；卡/Context为父流程明确授权的前置编制。没有实际拓扑或Builder准入声称。

本轮只解决R4-01中有证的九键默认/运行分离，不关闭R4-01全域或DG-03；不复制样式/结果、不碰权限/UI/Store/产品接线。10项Goal AC及16项产品义务、全形态/保存/历史/权限状态保持。JSON自检仅为设计构造，不是产品运行或独立验收。
