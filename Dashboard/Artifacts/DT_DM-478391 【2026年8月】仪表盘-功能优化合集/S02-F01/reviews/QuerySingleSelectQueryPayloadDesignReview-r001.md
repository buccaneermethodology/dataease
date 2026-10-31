# QPAYLOAD-001 独立语义设计审查 r001

## 双结论与target

- Design Freeze Validity：**PASS_WITH_BOUNDS_FOR_QPAYLOAD_001**，单个VQuery离线快照双槽组合合同有界通过。
- Implementation Entry Readiness：**READY_FOR_BOUNDED_ADMISSION**，无设计阻断；父流程绑定新Builder card/context及精确admission后可开始，不等于已ADMITTED。
- 仅两个新文件：`core/core-frontend/src/custom-component/filter-copy/query-single-select-query-payload.ts`、`core/core-frontend/tests/filter-copy-query-reference/query-single-select-query-payload.test.ts`。
- 不修改依赖，不接产品、权限、Store、保存、预览或网络，不执行目标events/request。

## 卡与证据绑定

接收端SP010 lane_task_card.py复验pass、exit=0，canonical `d24da8b7a7635e8b9442233178dde3c032fa553c9a7c9ec760e7807241eda1ee`。唯一write_scope为本报告，27个base_context_refs摘要一致。Context SHA256 `1026ca135de21ac48e45d62ccca3da46cc39b6e258bbb5587cf7994ec0068c19`，SP010校验exit=0，required_read_set摘要逐项一致。按已消费的SP010 semantic recipe执行Frame-first、Boundary与Evolution检查。

## Frame-first / Boundary

payload在此只指单个detached VQuery根，不是HTTP查询参数、searchQuery过滤列表或整个画布保存根。target来自调用时目标快照，rebuildInput只提供过滤配置；因此KEEP目标style/request等不等于复制源样式。容器query-B与引用chart-B不同命名域，expectedTargetId只核本快照，不能证明文档唯一ID或当前Store版本。

源码定向核对component-list.ts:250–290、320–345、699–704：commonAttr及VQuery定义形成实际根，propValue初始空串、无cascade，混入背景/state；DeCanvas.vue:97–108另赋id且可能令y=undefined，序列化后缺省。因此元数据可缺省且必须保留缺省性。配置确认路径只写propValue/cascade，保存JSON依据不授权本helper调用保存。根不是虚构payload.data.query结构。

35个field_matrix键与required+optional完整一致。只有propValue/cascade为REPLACE，其余允许键KEEP目标自身值；REMOVE为空，未知根键REJECT。嵌套元数据仅JSON安全和给定顶层类型验证，KEEP不声称业务有效。旧槽作为不透明JSON数组整体替换，不等同已获用户覆盖确认，尤其旧cascade不能保留残片。

## 14个完整oracle

001–003按完整rebuildInput先独立推导QTARGET两载体，再分别深拷贝target并只覆盖两槽，完整expected均相等；不是运行拟实现函数所得GREEN。

| 用例 | 核对 |
| --- | --- |
| 001 | 新target空propValue且cascade缺省，结果引入两槽，其他字段完整保持 |
| 002 | 旧条件/级联整体替换，目标宽度777保持，无默认runtime缺select |
| 003 | groupStyle值保持，仅此不证明嵌套定位 |
| 004 | expectedTargetId不等→CONTAINER/TARGET_ID_MISMATCH |
| 005/006 | component或innerType冲突→CONTAINER/TARGET_KIND_MISMATCH |
| 007 | 未知futureQueryBinding→CONTAINER/UNSUPPORTED_FIELD |
| 008/009 | propValue=null或cascade={}→CONTAINER/INVALID_TARGET_SHAPE |
| 010 | 缺propValue→CONTAINER/UNSUPPORTED_FIELD |
| 011 | 真实QTARGET计划字段错→QTARGET cause保留PLAN/PLAN_MISMATCH |
| 012 | 目标ID与计划双错→先目标ID错误，零内核调用 |
| 013 | 根额外键→ENVELOPE/UNSUPPORTED_FIELD |
| 014 | 非对象根→ENVELOPE/INVALID_INPUT |

所有失败已核完整输入与基准差异，均不含value或partial。JSON有效的target null/数组应进入CONTAINER形态错误；Date/访问器等非法JSON先ENVELOPE。对象成立后键检查先于id值，id基础形状→id相等→双VQuery标志→槽/元数据类型→真实QTARGET。JSON failure_order第三行同时提及id基础检查，但第四行括号及正文明确键检查优先，应按该明确顺序实现，不能机械按行号将非法id抢在未知键前。

## 真实依赖、隔离及Evolution

当前QTARGET源码摘要与卡及设计绑定一致，真实输出完整design/runtime并仅重绑condition三个字段；本层不得从调用方接收伪造ok结果、调用QPIPE重新选目标或重写其默认值算法。容器合法后恰一次真实rebuildSingleSelectTarget(rebuildInput)，失败cause保留原stage/reason；容器失败不得调用。依赖内部QCARRIER/QVALUE仍执行真实路径，spy只计数。

QTARGET既有Validation partial不被本审查或父流程Stop Gate倒推为包级PASS。本次只接受固定源码的纯组合设计，不解决依赖包后验绑定或产品资格；新模块仍须独立验证真实组合行为。

全量JSON递归安全检查先于读取属性，拒绝getter/symbol/稀疏数组/循环/undefined/非有限数/特殊对象。普通自有__proto__键不能被克隆为原型修改。两次target深拷贝以及两份重建槽深拷贝须彻底隔离style/request/events/background/条件/cascade；即使输入无环共享对象也须拆开输出。静态oracle相等不证明对象不共享，须deep-freeze、逐输出突变、getter未调用、JSON往返及真实内核计数测试。

最小实施阶梯明确：新Builder准入→两个新文件真实RED/GREEN、定向lint→独立Validation。无新增隐藏前置，不需要等待全部形态或真实权限。后续提交必须重新捕获最新目标并复验身份/版本/权限/覆盖确认；detached payload不能直接回放覆盖后续普通编辑。

## Findings与声明边界

阻断findings：无。错误顺序阅读注意及引用隔离属于已有明确合同执行要求，不要求修改冻结设计。不得将“payload helper ready”压缩为“产品粘贴/保存已集成”；未知合法根键、元数据业务有效性、Group/DeTabs定位、全部shape、保存/undo和权限仍为后续义务。

仅新增本报告；未改设计/fixtures/源码/Goal。原10项Goal AC与16项产品义务完整保留，真实权限BLOCKED/NOT_RUN，完整产品adapter与Goal未完成。

## 冻结对象摘要

- `QuerySingleSelectQueryPayloadDesign-r001.md`：`9f994c32313fdf83d537464ea303068d6b34e27bf70b3e04564ce1595e397060`。

- `QuerySingleSelectQueryPayloadFixtures-r001.json`：`a5acada23685066b57bf54f1ced0c70ea92f43b32cd8eacd95b34b60d19f09eb`。
