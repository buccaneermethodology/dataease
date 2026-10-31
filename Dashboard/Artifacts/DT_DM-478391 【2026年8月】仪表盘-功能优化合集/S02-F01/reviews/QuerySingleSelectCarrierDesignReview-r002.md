# QCARRIER-001 独立语义审查 r002

## 双verdict与准入target

- Design Freeze Validity：`PASS_WITH_BOUNDS_FOR_QCARRIER_001`，完整单条件普通文本单选JSON载体提取/运行水合合同有界通过。
- Implementation Entry Readiness：`READY_FOR_BOUNDED_ADMISSION`，无未解决设计阻断；不是已ADMITTED或实现通过。
- 可准入范围：仅新增 `core/core-frontend/src/custom-component/filter-copy/query-single-select-carrier.ts` 和 `core/core-frontend/tests/filter-copy-query-reference/query-single-select-carrier.test.ts`，消费真实QVALUE实现；输入仅本合同完整单条件propValue与空cascade，输出完整design/runtime两载体。
- 不准入范围：修改QVALUE、COPY/QPAD/无默认模块，目标映射或ID重绑，UI/Store、权限、网络、保存、历史以及完整产品adapter注册。

## 接收端卡与Context

SP010 semantic-review recipe已消费。实际复验 `planning/QCARRIER-001-design-review-card-r002.json`，canonical digest `97a388efc9ab0bca2b49518de93946596904fc2323ea5ed5be9d298c3f2d7043`，verdict=pass、exit=0；lane=design_semantic、role=semantic，唯一write_scope为本报告。4个base_context_refs摘要逐项一致。专属Context经SP010校验exit=0，8个required_read_set摘要逐项一致；其中Goal原摘要及QVALUE设计/独立Validation引用均已绑定。

另外复核原设计卡8个源码/上下文引用摘要仍一致，避免只因设计文档未变就假定源码未变。两份冻结输入摘要：设计 `17f8f65d876b5f8eda0493b209687bf007e634743dc517363efe82a7c4f7ae32`；fixtures `03613abf4395405162baa736a7592dcaa1bc5be706b7b56960cd96860d93e371`。

r001 finding `QCARRIER-REVIEW-01 / REVIEW_CARD_ROLE_WRITE_SCOPE_MISMATCH` 在本轮由新semantic卡与正确write_scope解决。原r001不覆盖、不倒推其时点已具备有效卡，也不追认任何先前Builder。

## Boundary Review

权威仍为原Goal；fixtures是候选行为oracle，测试不是产品真源。来源是配置确认后序列化JSON，可带当前运行选择；本函数不自行认证来源，不接受整个Vue组件或任意历史配置。完整对象指本限定形态的propValue/cascade，不意味着全产品schema或稳定保存carrier完成。

设计剥离selectValue/mapValue且保留显式默认A；运行B不进入design。显式runtime从A及A-code恢复，不强制显示值等于编码。无默认要求defaultValue缺键、defaultMapValue=[]；design无default/select/map，runtime仅补map=[]而select仍缺键。源select可缺键/空串，null不等价；默认空串或无默认遗留default键拒绝本窄域，不推导永久业务拒绝。

源码依据成立：Select.vue配置与运行写入分开，132–150的枚举映射允许显示值/编码不同；Component.vue:674–683以默认恢复且非空映射复制，Select.vue:172–179清选择时清map；canvasUtils.ts:843–864序列化令undefined对象键消失；useFilter.ts:141–149区分首次默认映射与后续map消费。这些是局部源码语义证据，不是浏览器/真实过滤结果验收。

条件name等KEEP属于同源值分离，不据此裁定跨组件样式复制策略。身份、字段及目标关联保留；不声明其目录有效或权限成立。复杂shape仍保留原Goal义务。

## 14个完整oracle及错误

14个唯一identity均有完整input/expected。六个成功001/002/003/004/005/013已在本轮再次按完整载体字段变换独立构造，完整结构相等：默认A运行B、无默认B、显式空运行串、两模式缺select键、源JSON往返均一致。不是调用拟实现函数所得GREEN。

八个失败逐项成立：006默认空串、007运行null、009多选、010显式空映射、012非空级联、014无默认遗留defaultValue均SHAPE；008未知键、011缺name为FIELD。失败仅ok/reason，不产部分对象或清空源级联。

全局优先INVALID_INPUT→UNSUPPORTED_FIELD→UNSUPPORTED_SHAPE；defaultValue为已知条件键，false模式出现走SHAPE、true模式缺少走FIELD。JSON合法性、属性描述符检查先于读值；getter不得执行。深不变、三方嵌套对象完全不共享、design自有键缺失、JSON往返、错误叠加仍需实现测试，不能用JSON深等替代引用隔离证据。

## Evolution / Implementation-Entry Review

QVALUE仅有九键值投影；本切片补完整条件、无默认分流、缺键/空运行值。显式分支经外层完整校验后规范化工作投影，以默认值作为内核当前值输入，恰一次真实QVALUE调用；这不伪造源B证据。无默认不调用QVALUE。spy可计数但不得替换结果。

COPY重绑引用并透传源运行值，无默认REBUILD处理目标映射，QCARRIER同源原ID的设计/运行分离与二者职责不同；不通过修改旧模块抹平差异。最小实施阶梯是绑定本报告的新Builder card/context/target-bound admission→两个指定文件真实RED/GREEN和lint→独立Validation。无需新增设计前置或等待真实权限。

下一产品层工作仍为全形态source提取、引用目录/闭包、提交发布、保存/旧历史和真实权限。不得将本函数成功注册为全产品可用，也不得把未知合法shape失败变成完成全适配的理由。单行误读测试：可说“QCARRIER设计有界通过，可准备纯模块准入”；不可说“查询复制已支持完整carrier/已集成/Goal完成”。

## Findings与范围

当前阻断findings：无。原卡角色问题本轮解决；引用隔离/getter/真实内核调用是设计已要求的后续验证义务，不新增隐藏前置。

只新增本报告，未改被审材料/源码/Goal。真实权限NOT_RUN、完整adapter NOT_READY、原10项Goal AC与16项产品义务保持；R4-01全域和DG-03未关闭。本报告不证明实现、产品运行、UI/Store、保存或历史效果。
