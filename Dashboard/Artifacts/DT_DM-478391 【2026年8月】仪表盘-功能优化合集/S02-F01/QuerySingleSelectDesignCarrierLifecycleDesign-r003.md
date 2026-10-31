# SOURCE-LIFECYCLE 最小合同修订 r003

本版按独立审查r002的LC2-F01..03形成**待独立复审的具体合同**，不是产品准入或运行通过。只修订新建非模板、顶层单个普通文本单选会话内协调；保存重开后来源认证仍独立未解，普通JSON不得认证为有证carrier。用户已裁定C迟到成功缺值只追加一次核对、核对结束关loading、仍缺显示无效，保持不变。

接收端重新按父流程纠正后的固定摘要验证：card canonical `c9d52f01045bd25b9042226598a4feaba1443c78cc4b9075dd7fcd67b2abc0a4`；Context raw `2db2a80ca8af7e349f849b75b2cbbb1b0adee32f9d9ed4f38486e012f5377722`。validate/render及Context验证exit0，required-read无漂移。先前错误Context预期未追认。只写本r003与Fixtures-r003。

## LC2-F01处置

原identity `TC-QSOURCE-R2-009`保留，确认D发生在该事件序列中，故expected.effects.confirmEventPairs修为1；revision2、发送捕获A/550及dirty=true保持。新增LC3-SAVE-03也明确此计数，避免“外部已发生”混入事件。

## LC2-F03：会话服务、发布动作与观察

候选新增服务位置为 `custom-component/filter-copy/query-single-select-session.ts`，由dvMain Store实例私有持有，不导出可伪造的origin授权接口。实例内session记录epoch、gate、单调revision/commit、tokenGeneration、documentEditGeneration；raw组件→Capsule与rawSnapshotRecord→Manifest均为私有WeakMap。不得将二者加入componentData/newSnapshot的可枚举字段，现有canvasSave与wsCache会复制这些对象。

以下函数名是本候选接线合同，不是现有实现或写授权：

| Action | 前置复验 | 同步写入/效果 | 失败 |
|---|---|---|---|
| beginSession | dashboard无resourceId、非template的createInit完成，根空 | 新epoch、rev0，旧tokens撤销 | 其他来源unmanaged，不伪造资格 |
| registerPending | DeCanvas此新建入口add成功、唯一顶层raw VQuery | pending，无carrier；保持原snapshot缓存标记 | 不登记，不自动删除原组件 |
| prepareConfirmation | 当前epoch/raw/slot唯一、expectedRevision一致；草稿来自本session | detached QCARRIER design/runtime＋当前外层KEEP投影；无现场写 | 返回明确INVALID_CANDIDATE/STALE_PREPARE，无事件 |
| commitConfirmation | 再验epoch/raw/revision/slot及设计绑定签名；样式变化允许重新读最新外层 | gate=publishing；撤销旧token；预绑定新Capsule；单槽换root；curComponent重绑；发布rev/commit；gate=open | 发布前失败完全不变；发布中异常失活能力并传播，不虚构回滚 |
| captureManifest | 只有recordSnapshot实际追加路径、最终newSnapshot对象已产生 | 在同步记录末尾关联实际raw历史对象；保存根/设计/epoch/捕获rev | 未追加就没有Manifest；不绑定临时deepCopy |
| prepareHistory | 先算targetIndex、读原记录Manifest、复制目标全根，保护现有id/pid/dataState/contentId | 全部在临时副本；此时指针未动 | 准备失败不动指针/root，不发事件 |
| commitHistory | 准备成功后关gate并撤销旧token | 指针一次；沿原setter恢复完整root/样式/view/track/jump；curComponent重绑；有效Manifest发布新rev/commit，再开gate，最后原事件 | setter异常使能力失活、传播原异常，已写普通状态不宣称回滚 |

成功确认只排原一次recordSnapshotCache和一次reRenderAll/queryData事件对；不额外append历史。排队事件绑定新epoch/raw/revision/tokenGeneration并在执行前再验；同commit事件对有一次性消费标记。旧watch/nextTick/枚举请求身份token在关gate时立即撤销，旧回调不得在执行时重新取新token洗白。现有Select的C核对策略继续由其原支持谓词/请求机制处理，不因本服务增加第二次核对；会话门控仅进一步检查旧raw/epoch/设计提交身份。

新增carrier reader必须在每次操作先验gate=open、当前slot/raw匹配、epoch/rev/commit匹配；返回detached值和消费token。不得跨操作缓存并绕过复验。旧Component props消费者仍可观察运行根变化，但不得在gate关闭时触发本受管确认/查询副作用；Component查询、配置确认的两事件、Select排队入口都消费同session门控。待gate开放后新实例/props创建新token，不重放已丢旧任务。

有效Manifest恢复：所选全根恢复，包括历史样式；不使用保存overlay的保最新样式规则。分配新单调rev/commit，而非回退当前rev为历史rev；无snapshot追加、不截断redo尾。边界undo/redo不关gate、不增rev、不发事件。`LC3-PUBLISH-01`和`LC3-HISTORY-01`逐步列出实际协调器完整投影和root，证明要求是旧/旧→unavailable→新/新，不是假定多setter天然事务。

缺Manifest/epoch不符/Manifest重建失败：在指针变化前将新增能力置unmanaged、reader不可用；仍执行原全根恢复、一次指针移动、原dirty计数与原snapshotChange及条件snapshotChangeToView。普通保存仍可用，但不使用过期design overlay。`LC3-HISTORY-02`给完整观察序列。目标snapshot本身不可复制为prepare failure，与缺Manifest分支区分。

setter异常：`LC3-HISTORY-03`明确root已替换而curComponent仍旧、指针已移动时setCanvasStyle抛错；reader保持不可用、phase=unmanaged、错误传播、原发布末尾事件0。不声称状态事务回滚或假写完整新根完成。`HISTORY-04`则准备阶段失败全不变。`SNAPSHOT-01`区分门槛不满足与实际追加，Manifest只绑定snapshotData实际对象，wsCache不含Manifest。

这些动作精确定位到dvMain、DeCanvas、QueryConditionConfiguration、Component/Select门控与snapshot；实现/测试target仍须父流程独立卡与admission，本文不授权修改它们。

## LC2-F02：完整同步捕获与请求身份

候选 `captureSave` 位于canvasSaveWithParams原异步检查之前，受管路径不先对现场调用removeGroupArea：该清理只施于捕获副本，保留现有转换结果而不使capture本身改变现场。同步函数禁止await/事件/用户回调。

捕获一次性深拷贝：最新componentData、canvasStyleData、canvasViewInfo、appData、curDvInfo所有当前字段、checkVersion；对副本执行既有清理/名称规范化，只对当前唯一受管query的propValue/cascade覆盖同commit design。由**捕获副本**决定updateCanvas/saveCanvas、targetId、optType、名称检查参数；分配唯一contentId和save sequence。构造完整canvasInfo：canvasStyleData/componentData为对应副本JSON字符串，canvasViewInfo/appData也是深副本，展开捕获dvInfo后覆盖contentId/checkVersion/watermarkInfo=null，与当前序列化顺序一致。不得await后从当前curDvInfo重选方法、名称或target。

capture token固定 `{epoch, seq, revision, commitId, editGeneration, targetId, method, contentId, intentDigest}`。intentDigest为完整捕获payload除contentId/checkVersion外的canonical JSON摘要；不只hash查询槽。所有检查和请求、回包均关联该token。Fixtures每条completeRequests给**完整payload及appCanvasNameCheck/dvNameCheck参数**，不是仅componentData。

独立documentEditGeneration覆盖任何会改变待保存内容的明确编辑：查询确认、样式、名称、画布/view/app数据、历史恢复；运行选择/外参只有在最终design-overlay持久投影不变时不增该代次。若未知写入绕过代次，发送和回包前重新同步捕获intent摘要仍可发现差异，不能只凭计数相等清dirty。生成规则尚需实现测试覆盖，不以query revision代替。

名称检查使用捕获参数。期间同文档编辑允许继续，仍发送捕获版本；检查失败/名称重复则该token终结、无保存请求、dirty不清。发送前必须复验epoch及目标身份/method/optType；若导航或改变保存模式则STALE_TARGET，不能把旧payload发给新资源。仅改名称/样式不会换target，也不篡改已检查名称；这些编辑留待下次正常保存。

首次create未settled时第二次保存返回BUSY_CREATE，不再发第二个create、不丢当前编辑、不自动重试；已有资源update允许多个正常保存，但按下面保守规则处理竞态。首次create成功只能向仍同epoch、原未绑定资源的新建会话绑定返回ID，不向其他文档绑定；这是身份元信息更新，和是否清dirty分开。其后保存走正常update。create后有编辑时绑定新ID但dirty保持，不能再次创建副本。

## 回包、失败与乱序dirty规则

每个epoch维护pending token集合、已处理token集合、lastAckSeq、saveOrderUncertain；seq单调且不复用。非pending、重复或旧epoch回调不改业务状态/dirty，不调用普通成功回调。请求失败只终结自身token并报告原错误，不更新lastAck/contentId，不清dirty。

成功先终结自身token；仅有效同epoch更新ack序号上限。**清dirty须全部满足**：无其他未settled保存；该token非重叠组或是此前组全部settled后的独立保存；当前editGeneration等于捕获代次；当前完整intentDigest与捕获一致；目标身份仍匹配。首次create的返回ID是已核绑定身份，仅在当前比较时正规化为捕获的新建身份，不把服务器ID差异当用户编辑。否则不清dirty；已有新编辑也不把捕获contentId/旧状态写回其当前版本。不得无条件resetStyleChangeTimes。

两个update请求并发即将重叠组所有token标记overlap。客户端**无法由回包顺序推断服务器写入顺序**，故无论回包2→1还是1→2，本组均保持dirty并标saveOrderUncertain，不冒称较新payload已稳定持久化。待组全部settled后，用户下一次普通保存捕获当前内容；若该次不重叠且期间无新编辑，成功才清dirty/不确定标记。没有自动保存、自动补发或服务器CAS保证。这样不因乱序误报已保存，但不宣称解决服务端并发覆盖；相应限制需独立审查认可。

`LC3-SAVE-01..13`给完整初态/事件/终态与请求：同步捕获；名称检查期间样式/名称/view/app修改；确认D计数与旧payload；无编辑清dirty；检查失败；网络失败；两种并发回包顺序；后续独立保存消除不确定；跨epoch；BUSY_CREATE；目标模式变化；首次create绑定ID。只样式编辑query revision不变的case02保持dirty，不能以commit相等替代文档代次。

## 分型与剩余边界

原14条identity保留并标case_kind：候选状态oracle、当前clone/JSON静态观察、分析未决/禁止placement各自分开。原011/013/014的null不是统一API返回，不能拿来当实现成功/失败测试。新增save_cases是完整合成文档请求合同；action_observations是协调器字段与实际根的完整观察投影，不伪称全Store每个字段都展示。

本修订按finding提供了可复审的动作和oracle，但LC2-F01..03的独立关闭结论由Reviewer给出，作者不自授予准入。LC2-PERSIST来源认证仍未解：私有载体不持久化，重开普通JSON仅unmanaged，绝不由默认A认证为原设计。本切片不删除Goal的保存回显、权限或收益义务。

构造检查包括：内容寻址摘要、009确认计数1、完整payload可解析且深副本、捕获A/550与后来D/580分离、只样式/乱序/失败dirty不清、无变化独立成功才清、Manifest键和setter失败观察。未运行Vue、Store、网络、数据库或产品验收。S01不变，真实权限BLOCKED/NOT_RUN；10项Goal AC、26项义务及16项产品义务保持。接下来仅交独立复审，不生成Builder。
