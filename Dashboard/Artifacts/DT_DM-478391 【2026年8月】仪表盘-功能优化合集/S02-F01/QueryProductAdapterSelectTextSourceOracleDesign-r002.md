# SH-SELECT-TEXT 来源 oracle 设计候选 r002

candidate / frozen_for_builder=false；Scope Delta none。

修订依据：独立复核 r001 的 `F-ST-SRC-ORACLE-001` (P2)。采用方案2：ST-SRC-004 CANCEL 只检查 handler 数据/级联状态；测试适配器以“取消信号且不调用 onFulfilled”记录非确认路径，不 reject JavaScript Promise。未捕获 rejection/Element UI错误处理留为 `NOT_RUN / UNKNOWN`，不属于本 oracle。10 Goal AC /26 must-have /16产品义务完整保留，产品义务NOT_RUN。S01 F01 Packet依本轮EntryPacket为CONDITIONAL，真实权限BLOCKED / NOT_RUN。此文件不是独立审查、Design Freeze或Builder准入。

修订版绑定 repair Card/Context；原r001卡片仅为历史候选来源，不代表r002验证状态。写前全部required-read摘要一致。候选只写本文件与配套Cases。

## 状态域和执行边界

配套JSON给每个确定局部case完整before/expected_after，不使用“其余保持”代替目标字段快照。ST-SRC-001是完整创建返回值；002..005是局部函数状态域，含条件完整对象、fields、cascade、切换缓冲、published queryElement、请求/消息/发布计数；这些不是整个Vue或Store快照。函数级harness尚未实现，允许的依赖只返回受控Promise并记录请求，禁止真实网络、权限、产品接线。本轮无任何case执行。

为避免把局部语句扩为完整UI链，ST-SRC-006完整异步状态暂列NOT_READY；仍提供固定前置与调度计划，expected_after=null。ST-SRC-007继续NOT_READY。五组局部oracle不关闭任何R4FS finding，也不构成合法组合全集。

## 逐项输入、快照与唯一oracle

### ST-SRC-001

入口：infoFormat，仅创建返回；不隐式调用parameterCompletion。状态：DETERMINATE_CANDIDATE / NOT_RUN。

源码：core/core-frontend/src/custom-component/v-query/options.ts:6-66；core/core-frontend/src/custom-component/v-query/options.ts:80-137；core/core-frontend/src/custom-component/v-query/QueryConditionConfiguration.vue:1844-1872。

子fixture：CREATE；精确输入、步骤及完整局部快照见JSON对应case。

边界/缺口：attributes补全与setToDefault是不同阶段；本case不据此推断所有创建者/历史对象。。

### ST-SRC-002

入口：必须区分handleDatasetChange与handleValueSourceChange。状态：DETERMINATE_CANDIDATE / NOT_RUN。

源码：core/core-frontend/src/custom-component/v-query/QueryConditionConfiguration.vue:987-1006；core/core-frontend/src/custom-component/v-query/QueryConditionConfiguration.vue:1024-1064；core/core-frontend/src/custom-component/v-query/QueryConditionConfiguration.vue:2017-2021。

子fixture：DATASET-CHANGE, SOURCE-SWITCH-DATASET-ALREADY-SET；精确输入、步骤及完整局部快照见JSON对应case。

边界/缺口：“source切换且dataset已选会清field并getOptions”并非1024分支行为；清字段来自987入口。本候选保留这个来源表述差异，不修改r002原件。。

### ST-SRC-003

入口：handleValueSourceChange缺dataset自动回填。状态：DETERMINATE_CANDIDATE / NOT_RUN。

源码：core/core-frontend/src/custom-component/v-query/QueryConditionConfiguration.vue:1024-1064；core/core-frontend/src/custom-component/v-query/QueryConditionConfiguration.vue:2017-2021。

子fixture：ONE, MULTI-LAST, EMPTY；精确输入、步骤及完整局部快照见JSON对应case。

边界/缺口：MULTI-LAST只是当前forEach最后非空映射及最后匹配fields项胜出的源码事实，不是业务合法映射规则；空id仍调用依赖，真实API是否接受未知。。

### ST-SRC-004

入口：handleDatasetChange确认框回调；输入已完成handleCurrentChange记录。状态：DETERMINATE_CANDIDATE / NOT_RUN。

源码：core/core-frontend/src/custom-component/v-query/QueryConditionConfiguration.vue:964-1006；core/core-frontend/src/custom-component/v-query/QueryConditionConfiguration.vue:1216-1226；core/core-frontend/src/custom-component/v-query/QueryConditionConfiguration.vue:2017-2021。

子fixture：CONFIRM, CANCEL；精确输入、步骤及完整局部快照见JSON对应case。

边界/缺口：取消局部语句没有重置newDatasetId/oldDatasetId；后续事件如何处理仍未知。Element全局拒绝处理不在读集，不能声称UI取消无未处理拒绝；测试依赖只隔离Promise，不模拟权限。。

### ST-SRC-005

入口：validate vs confirmValueSource不同入口。状态：DETERMINATE_CANDIDATE / NOT_RUN。

源码：core/core-frontend/src/custom-component/v-query/QueryConditionConfiguration.vue:1261-1283；core/core-frontend/src/custom-component/v-query/QueryConditionConfiguration.vue:1336-1456；core/core-frontend/src/custom-component/v-query/QueryConditionConfiguration.vue:1559-1578；core/core-frontend/src/custom-component/v-query/QueryConditionConfiguration.vue:1725-1748。

子fixture：MISSING, EMPTY, WHITESPACE, VALID, MANUAL-BUFFER-WHITESPACE；精确输入、步骤及完整局部快照见JSON对应case。

边界/缺口：validate使用truthy而非trim：全空白数组在这些前置下返回false；弹窗confirmValueSource会拒绝空白。拒绝前validate已清default/select；不能统一断言目标不变。未覆盖任意多条件或其他参数/required形态。。

### ST-SRC-006

入口：handleFieldIdChange + first-item timer + injected callbacks。状态：NOT_READY / NOT_RUN。

源码：core/core-frontend/src/custom-component/v-query/Select.vue:358-521；core/core-frontend/src/custom-component/v-query/Select.vue:533-563；core/core-frontend/src/custom-component/v-query/Select.vue:743-776；core/core-frontend/src/custom-component/v-query/Select.vue:160-208。

子fixture：FIRST-ITEM-ASYNC-PROPOSED；精确输入、步骤及完整局部快照见JSON对应case。

边界/缺口：存在可确定局部语句，但当前read-set未绑定isConfirmSearch/setCascadeDefault/queryDataForId等注入owner的状态与返回副作用，且Vue watch/nextTick/observation代际调度完整目标状态未冻结。若仅将回调空stub则只能得到局部model oracle，不是请求的完整目标状态；本轮不编造最终快照、不重判QOBS-ASYNC-01。需独立冻结隔离fixture边界或扩读真实owner后才能给唯一全状态oracle。。

### ST-SRC-007

入口：保存/刷新重开/undo/redo。状态：NOT_READY / NOT_RUN。

源码：本read-set无完整owner。

子fixture：无冻结fixture；精确输入、步骤及完整局部快照见JSON对应case。

边界/缺口：没有本切片完整序列化/恢复/历史owner；不给候选成功输入输出，不沿旧值态JSON往返推导真实保存行为。。

## 三个容易误读的差异

1. ST-SRC-002的清field/display/sort并请求来自handleDatasetChange；handleValueSourceChange在dataset已存在时仅重置default/select，不请求也不清字段。原来源概括不能直接作为同一个入口oracle。
2. ST-SRC-003当前代码最后非空checkedFieldsMap映射胜出，匹配fields多条时最后一条dataset胜出；没有映射仍以空id调用getOptions。这是源码观察，非允许任意目标映射的业务规则。
3. ST-SRC-005的validate先按默认关闭清空default/select，随后才检查manual valueSource。空/缺失被拒也不是全目标不变；全空白字符串是truthy，因此这个validate分支不拒，但confirmValueSource弹窗入口会trim判空并在写值前拒。

## Promise、时钟与完整快照约束

002/003使用P1控制listFieldsWithPermissions：未resolve时保留旧dataset.fields，指定响应后才替换；请求参数精确记录。004使用C1确认Promise：pending时dataset回旧值，确认才清级联并发P1；取消时保留new/old缓冲。本候选不reject JavaScript Promise，也不把派生Promise结果列入oracle；只记录测试适配器取消信号且不调用onFulfilled。真实 Promise rejection 与 Element/UI 未捕获错误处理留为 NOT_RUN / UNKNOWN。所有异步步骤均显式flush微任务，不用sleep猜测。

001固定guid返回与Date时钟，区分undefined属性和缺属性；defaultValueFirstItem不属于infoFormat返回，不能把attributes默认值偷塞到创建快照。Date/undefined编码只在测试层解释，不能变产品字段。

006计划控制enumValueObj P1、300ms timeout、nextTick和callback日志；但注入owner与watch/observation完整状态未冻结，故不输出猜测最终对象。将这些函数空stub最多证明局部表达式，不满足完整目标状态要求。本候选保留NOT_READY，后续须另冻结隔离harness目标域或扩读owner；不重判QOBS-ASYNC-01。

## 静态校验与下一步

已检查JSON解析、7个唯一ST-SRC ID、5组局部确定/2组NOT_READY、所有确定variant均含before/expected_after、10/26/16分母与摘要一致。没有执行runner、编译、UI、网络、权限、保存或历史测试。静态结构通过不验证oracle行为正确性。

下一步由独立审查复核这些局部状态域与快照，特别是入口差异、取消信号边界、manual校验副作用；006/007补证前不冻结其oracle。不得从本候选启动产品Builder或解除S01/权限阻塞。
