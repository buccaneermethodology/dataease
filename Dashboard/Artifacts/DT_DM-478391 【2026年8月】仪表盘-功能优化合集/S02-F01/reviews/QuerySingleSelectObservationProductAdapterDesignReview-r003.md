# 单选枚举产品adapter独立审查 r003

Reviewer：/root/s02_goal_review。仅写本报告，未改设计、fixtures或实现。

## 结论

Design Semantics：PASS_WITH_BOUNDS_FOR_NARROW_ADAPTER_RULES，支持谓词与同步key复核方向已明确，维护者一次核对策略保持。Frozen Fixture / Implementability：NOT_READY，以下实际状态与源码oracle不一致须修复。Product Builder：NOT_AUTHORIZED。

## 冻结绑定与检查

接收端最终card canonical 6d9b2faa8cf94342299eae308079dfb7293dc175be15a80aafc1f49ded3b7493 validate通过；Context validate通过，SHA256 d34b22d811b50367fc479119590b86c33a23cc5ebd5ffbe7db30c9548e38bd2d；全部base_context_refs无漂移。本报告只绑定父端最终Design SHA256 9b6f04cd1cfbb8c5894fee5d8e855cf3cccfcb087c7f2329e172ab71f11ae38d、Fixtures SHA256 f4fb51e18761fb388be1776ebb813b4e030cafefee444ec744cd4a8137b4abc3，不对收到摘要之前中间读取时点追认。

独立遍历每例initial/expected及schema路径：PA-001–011 expected均含全部列明状态字段，selectedValue与configSnapshot.selectValue一致；PA-012缺全部30个schema字段，因为它实际上是fallback矩阵而非完整状态。不能将“字段存在”当行为正确。

## 通过的有限改进

支持域已排除移动端、remote及待挂载释放；then/finally每写入前同步比较真实requestInputKey和支持谓词，避免只依赖watch。明确未改选缺初值走legacy，而首次A→C才触发核对，核对期间再改值使旧响应失效。012策略在PA-001–004中总请求2、核对1、核对结束loading=false；缺C保C且invalid，失败保旧options且unverified；观察写入/查询计数0，未扩大成产品运行证据。

PA-008本轮已从初始A清空到本地及config两个{$undefined:true}，与null明确区分；runtimeGeneration 1→2，loading结束，无额外核对，default A保持。该用例的值语义不再是前轮矛盾。setDefaultMapValue真实按enumValueArr映射（Select.vue:132–150），因此mapValue=[]并非天然错误；但要在实际测试给出相应原始枚举行，不能仅从字符串options推算。

## 最小阻断修订

1. **PA-R3-01：PA-009没有形成一致的同步输入变化见证。** initial.requestInputKey已经是P2，但initial.configSnapshot.cascadeFilter仍P1，事件又称从P1变P2；expected的cascadeFilter仍P1，且缺独立capturedRequest的P1输入。测试无法区分捕获旧key和当前真实输入，可能用错误一致性获得no-op。请固定捕获key=P1、当前初态P1、事件变为P2后真实config/input投影P2，并给watch前then/finally观察断言；或明确从“已变P2、watch未跑”的中间状态开始，同时保留captured P1。不能只在expectedCallbacks填写零作为证据。

2. **PA-R3-02：PA-011不符合所称legacy原行为。** 真实Select.vue:342–381先从响应重建options；响应[X]后不会保留[A,B]，但expected.acceptedOptions仍[A,B]。:400–416清本地select/default、更新map/defaultMap并通知cascade；:427–455在defaultValueCheck为true时因changeAuth触发queryDataForId。fixture未给defaultValueCheck、defaultMapValue/原始enum行及legacy计数，却把无用户事件的userSelectionQueries从0变1；这是把legacy查询误归用户选择，不能证明保留原行为。请固定必要legacy条件、options=[X]及真实config写入/查询来源；若acceptedOptions意指独立observer缓存，则必须另列真实可见options，并明确其语义区别，不能称同一个options最终态。不要为让此例通过修改原legacy行为。

3. **PA-R3-03：其余事件与终态存在确定矛盾。** PA-007事件明说sourceGeneration递增，expected仍1；PA-010 initial已是C/generation2/userSelectionQueries1，却再次执行“user selects C”且终态计数不增，需把该句标为前置背景或移除。PA-006起点request42却已计3次请求，事件再起43后计4次；这并非必然非法历史，但与当前41→42→43示例不一致，应说明额外历史请求或用已冻结链的2→3，避免双计。PA-012应明确为独立route-test schema例外，或补完整状态，不能同时宣称所有expected同一完整state schema。

以上只修fixture和解释，不要求再次维护者决策或扩大产品范围。临时禁用标签/a11y仍需Element源码确认或真实Vue验证；实际网络返回行的显示字段/查询字段映射以及legacy副作用须由真实组件测试覆盖，不能用纯函数字符串列表替代。

## 边界

本轮没有运行Vue、网络、权限或保存验证，没有授权任何产品target。S01 F01 Entry Packet、真实权限隔离环境、可信行为RED、独立预审与精确execution admission保持；Goal10项AC、26项must-have和16项产品义务完整保留，权限BLOCKED / NOT_RUN。
