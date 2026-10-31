# SOURCE-LIFECYCLE r003 独立语义复审

## 双结论

- **Design Freeze Validity：PASS_WITH_BOUNDS（有界通过）**。会话来源、私有 Capsule/Manifest、同步准备与门控发布、完整保存捕获和成功回包保守规则已形成可实现的候选设计；不能把“13条保存用例”压缩为保存时序合同已全闭合。LC3-F01..03 是下述精确剩余项。
- **Implementation Entry Readiness：READY_FOR_MINIMUM_PREPARATION_SLICE（仅最小准备模块可进入实施设计/准入）；完整产品生命周期激活 NOT_READY。** 可立即由父流程为无现场写入的准备/捕获模块形成独立 Builder card、冻结用例与 admission；不要求为此重做来源研究。此审查本身不签发 execution admission，不授权修改其他文件。
- 实际产品、Vue/Store、网络持久化与权限验收均未执行。本轮不是 Goal 完成判断；10 AC、26 must-have、16 产品义务分母不变。真实权限继续 BLOCKED / NOT_RUN，普通 JSON 重开继续 unmanaged。

## 接收绑定与检查

接收端 card canonical SHA-256 `faa3813f2b08c079bbebdd1d18417852ec5c41f8f5fe439a2d557abc94c13dad` 已验证；Context schema validate exit 0，raw SHA-256 `31e6b17b25c296988bab392ea910a9203b79025031b946b191439510d7a62ca2` 与派发一致；card base refs 无漂移。派发所据 Topology r142 SHA-256 `dd85732163cf3bfe4b5e85fff4e0dc4f1b99bf9949eba7bf4fe8cff89d79212b`，本轮派发由 r143 记录。

审查对象：

| 文件 | raw SHA-256 |
| --- | --- |
| QuerySingleSelectDesignCarrierLifecycleDesign-r003.md | fa3d8fa314324dfb4f9ffc5ba5d1ceb8bcc71b7a67a388d37bf6b940476564e8 |
| QuerySingleSelectDesignCarrierLifecycleFixtures-r003.json | b5b8a968a54799a1a8feaf66b687b19876264577c7660471b1dc86b483acf038 |

递归展开全部 `$object`，21/21 个内容寻址对象 canonical SHA 一致；13 个 save_cases 的 15 个 completeRequests 均已重新计算完整 payload 除 contentId/checkVersion 的 intentDigest，15/15 一致。payload 保留 componentData/canvasStyleData JSON 字符串以及 canvasViewInfo/appData、dvInfo、watermarkInfo 等字段，不以 query 槽摘要替代完整意图。上述是 fixture 一致性检查，不是产品执行。

## 前轮 finding 裁定

| 前轮项 | 本轮裁定 | 依据与剩余边界 |
| --- | --- | --- |
| LC2-F01：009 确认事件计数错误 | CLOSED | TC-QSOURCE-R2-009 保留 identity，later_confirm_and_style_edit 对应 confirmEventPairs=1；LC3-SAVE-03 同为1，捕获A/550与后来D/580分离。 |
| LC2-F02：保存 payload/身份/dirty 不完整 | PARTIALLY_CLOSED | 完整捕获、方法/目标/检查参数、create绑定、模式变化、重复/旧epoch回包规则和两种重叠顺序已明确；样式专属回包 witness 仍缺，失败终结语义仍有 LC3-F01/F03。 |
| LC2-F03：发布/历史动作与观察缺失 | PARTIALLY_CLOSED | 成功发布、有效/缺Manifest恢复、setter异常和prepare失败、实际历史对象绑定均有观察；发布自身失败分支仍只有规则文字，见 LC3-F02。 |

未把“未实现”本身当作永久阻断。未要求服务器CAS才能实现本地来源或准备模块；也未用旧历史来源认证缺口阻断新建会话的无副作用准备工作。

## 剩余 findings 与最小修订

### LC3-F01（P2）：样式专属成功回包没有被独立覆盖

Design 称 case02 证明“只样式编辑、query revision不变”时保持 dirty，但 LC3-SAVE-02 仅有 capture→edit，edit 同时改宽度、名称、view和app，终态仍在 checking，requests=0。它确实证明捕获不被后续编辑改写，却没有走到错误可能发生的成功回包清 dirty。SAVE03 同时增加 query revision；SAVE07/08 又可仅靠 overlap 条件保留 dirty；因此错误实现“只看query revision清dirty”仍可通过现有相关用例。

最小修订：保留02原identity与捕获断言，另补一个单请求完整轨迹：capture A/550→仅 width580（query revision/commit不变，editGeneration递增）→checks_pass_send→success。完整终态应为当前width580、pending空、ack推进、dirty=true、dirtyClears=0，完整发送payload仍A/550。无需扩展成全编辑器组合测试。该项阻断保存回包激活，不阻断同步捕获模块。

### LC3-F02（P2）：publish 异常边界尚无完整观察 oracle

LC3-PUBLISH-01 只有成功轨迹。Design 已正确区分发布前失败完全不变与发布中异常失活并传播；HISTORY03/04 不能代替 commitConfirmation 自身的失败轨迹，因为后者有预绑新Capsule、单槽root替换、curComponent重绑与确认事件消费。

最小修订只需两个失败 witness：提交前复验失败（全状态/事件不变）；root已替换但selection或后续发布步骤抛异常（精确列已写root、旧/新selection、gate失活、reader不可用、rev/commit是否发布、token撤销、确认事件0、原异常传播、不宣称回滚）。应固定具体抛错位置而不是泛写任意失败。该项阻断现场发布/门控激活，不阻断 prepareConfirmation。

### LC3-F03（P2）：客户端 request_failed 与服务端写入完成需要区分

Design 将请求失败一律终结 token，又以组“全部settled”后的独立成功允许清除不确定性；LC3-SAVE-06 的 request_failed 未区分确定未写入与断连/超时等结果未知。客户端失败不证明服务器不再执行：旧请求超时、随后独立请求成功、旧服务器工作最后写入，会使所谓独立成功清 dirty 的依据失效。create 的同类未知失败后解除 BUSY_CREATE，也可能再次创建。

最小修订是冻结失败分类和上限：检查前失败/已确认未写入可正常终结；已发送但写入结果未知单独保留 outcomeUnknown，不能仅凭客户端pending空认定先前工作已完成，不能自动把后续成功等同于消除该不确定性。可保守阻止相应清dirty/再次create，并明确恢复边界；不要求本轮新增服务器CAS、幂等API或自动补发。增加一条“未知失败→下一次保存/回包”完整oracle即可揭示此边界。若仅打算支持确定成功/确定失败分支，须在入口支持谓词和报告明确排除未知结果，不能把网络失败统一作确定失败。此项仅阻断保存网络状态机激活，不阻断纯捕获。

## 最小安全实施切片与后续阶梯

**M0：detached preparation/capture 产品模块，READY_FOR_MINIMUM_PREPARATION_SLICE。** 精确候选生产目标为 `core/core-frontend/src/custom-component/filter-copy/query-single-select-session.ts`，配套定向测试由父 card 显式列出。先实现同步、无外部副作用的 prepareConfirmation 候选生成与保存快照构造：从已显式传入的受管状态生成 detached QCARRIER design/runtime和KEEP投影；在副本执行 removeGroupArea/名称规范化；固定完整payload、method/target/check参数及intentDigest。任何私有来源授权记录只允许由将来的Store owner持有，导出的普通数据构造函数不得被解释为mint来源权威。

M0 不改 dvMain/DeCanvas/配置确认/Component/Select/snapshot/canvasUtils 的活动入口，不注册可消费carrier，不发送请求，不清dirty，不改变原确认事件。可接受的验证是输入不变、深复制隔离、相同commit设计覆盖、完整payload与检查参数一致、捕获后编辑不改变结果、非法/陈旧候选拒绝。覆盖现有01/02的捕获部分及003的payload分离；不声称它们全部时序均已通过。这是一段可复用产品源码准备实现，不是“产品生命周期已激活”或“用户功能完成”。父流程仍需绑定本报告摘要、实际源码目标、冻结用例和 topology 的 admission 后才能进入 Builder。

后续阶梯：

1. M1 会话owner、新建注册、确认发布与消费者门控：补LC3-F02的两条oracle后可独立审查准入；所需target包括dvMain、DeCanvas、配置确认和Component/Select，与M0模块。保留用户确定的C一次核对策略，门控不能额外触发枚举核对。
2. M2 Manifest、undo/redo：以现有HISTORY01..04/SNAPSHOT01合同实施并验证真实raw对象与多setter观察；普通历史缺Manifest降级不阻止原恢复，普通JSON不认证。M1/M2可按真实依赖一起交付，不把准备模块提前称完整产品能力。
3. M3 canvasSave接线/回包：补LC3-F01/F03，覆盖完整保存payload、目标身份、create绑定、dirty、并发和结果未知分支，再审查定向入口准入。服务器持久化与产品保存重开验收独立进行。
4. 其余Goal产品义务和真实权限仍回原分母逐项验收；本阶梯不批准Scope Delta，也不把LC2-PERSIST来源认证推迟视为已完成。

## 边界、演进与压缩误读检查

私有 WeakMap 是运行时来源记录；序列化默认A、现有普通root、缓存JSON均不具备重新认证权威。设计状态与运行选择、历史revision与当前单调revision、客户端请求结束与服务器写入终结应保持分开。reader必须每次检查gate/raw/slot/epoch/revision/commit，返回detached值，旧异步回调不得临时领取新token洗白。

“r003通过”“来源已支持”“保存已覆盖”“基础已完成”单行都可能误导。允许的压缩描述为：**r003准备/捕获合同有界通过，可为M0建立实施准入；活动生命周期及网络保存尚未准入，来源重开与权限仍未验收。** 本审查没有新增通用DSL、重写Goal或扩充治理主对象；所列三个finding均针对当前明确承诺的失败/dirty边界，有有限修复动作。

仅写本报告，未改Design、Fixtures、源码、测试、Goal或既有记录。未运行构建、应用或任何会写数据库的验证。
