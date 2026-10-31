# 单选枚举产品adapter r004 最小处置记录

本版仅修正 Fixtures 一致性；r003设计的支持域、同步key复核、维护者裁定的**一次核对**策略均保留。没有修改旧文件、源码、纯模型或Goal；仍是待独立复审候选，不声明Vue验收或产品Builder准入。

对应产物：[Fixtures r004](QuerySingleSelectObservationProductAdapterFixtures-r004.json)。除下列解释外，沿用[Design r003](QuerySingleSelectObservationProductAdapterDesign-r003.md)；本记录同时作为最小 disposition，不另增重复说明。

| Finding | 修复与证据 |
|---|---|
| PA-R3-01 | PA-009初态当前key与cascadeFilter均P1，capturedRequest独立固定P1。事件真实改P2；三个完整中间观察态均为实际config/input P2而generation尚1，then/finally同步比较P1≠P2均不写。随后watch失活旧loading并增source/token generation，debounce才开始42/P2。最终config也P2，不再用零计数代替来源变化。 |
| PA-R3-02 | PA-011补defaultValueCheck=true、defaultMapValue、field映射原始枚举行、运行/非remote/非first-item/已挂载前置与完整cascade。响应X后可见options为X；legacy默认赋值1、map赋值2、defaultMap赋值1、cascade helper2、queryDataForId调用1；用户选择查询0、观察新增查询/写入全0。所有计数表示源码赋值/调用，不表示真实网络次数。 |
| PA-R3-03 | PA-007 sourceGeneration终态修为2，并明确替换raw-B后一次用户选择C的来源；PA-010将A→C标为已计入初态的背景，从events移除重复选择；PA-006请求历史明确41首次＋42核对=2，新起43后=3；PA-012单独route_test_schema，只验证路由与adapterCalls，不再声称完整终态schema。 |

## PA-011必要语义澄清

`core/core-frontend/src/custom-component/v-query/Select.vue:342–416`的legacy then重建options、清**本地selectValue**与config.defaultValue，并按新enumValueArr计算map/defaultMap；427–469的finally在本例defaultValueCheck=true、isFromRemote=false时再次赋map，changeAuth使queryDataForId(q1)调用一次。`setCascadeValueBack`在isConfig=false时只改cascade.currentSelectValue，保留cascade.selectValue。

该回调路径没有直接赋`config.selectValue`；本例required=false也不触发后面的null赋值。因此r004明示回调边界的本地selectedValue为JS undefined，而configSnapshot.selectValue仍A。不能继续使用“本地/config选值总相等”的通用断言，也不能把legacy触发的查询伪称用户选择。`acceptedOptions`统一是实际options.value的value投影，不是独立隐藏缓存；另列完整visibleOptions，终态为`[{label:X,value:X,checked:false}]`。

本例事件轨迹不注入Element的用户change事件。程序更新model是否产生额外组件回调及实际页面最终效果仍需真实Vue/Element验证；本稿只冻结已阅读源码then/finally内的静态可见写入，不以假设伪造用户查询或清config.selectValue。

## 自检与范围

已解析r004，逐项检查PA-001–011初末状态包含全部30个基础schema字段；PA-011额外legacy状态分别具备完整初末值，PA-012按独立route schema。检查PA-009 P1捕获/P2真实中间及终态一致、PA-007 generation、PA-006新增请求差值1。PA-001–005及PA-008与r003逐项相同，一次核对与既有清空策略未改变。

这些是构造一致性检查，未运行Vue、网络、权限、保存或Element可访问性验收。临时标签与a11y、原始枚举行映射及真实legacy副作用仍按原验证要求独立验证。Goal10项AC、26项must-have及16项产品义务不变，真实权限BLOCKED/NOT_RUN，S01不变。
