# SOURCE-LIFECYCLE r004 独立语义复审

## 双结论

- **Design Freeze Validity：PASS_WITH_BOUNDS（限定范围内设计冻结有效）**。LC3-F01、LC3-F02、LC3-F03 均在候选合同层关闭；未发现要求继续设计返工的阻断项。
- **Implementation Entry Readiness：READY_FOR_BOUNDED_LIFECYCLE_IMPLEMENTATION（受限生命周期可进入实施准入）**。可为下述精确模块及接线目标建立 Builder card、冻结实现测试和 execution admission；不再仅限 r003 的 M0 准备函数。此结论是设计足以开始实现，**不是产品激活通过、网络验证通过或本报告已签发 admission**。
- 范围限新建非模板、顶层唯一普通文本单选的当前会话。普通 JSON 重开仍 unmanaged，真实权限仍 BLOCKED / NOT_RUN；10 AC、26 must-have、16 产品义务均保留，不声明 Goal 完成。

## 派发绑定与独立检查

接收端 lane_task_card validate exit 0，canonical SHA-256 `df749a89d8d80df3ea32ab9d1c045ee954ebc1239b9dd975f7dacd7c96e9b627`；Context validate exit 0，raw SHA-256 `bfb0ac5f0a88c3261c42d81bfafea4ea23f3f9c5fcf23c28e56c11001a3ec80c`。已读取 rendered prompt，复算 card 全部 base_context_refs，无摘要漂移。

| 输入 | raw SHA-256 |
| --- | --- |
| QuerySingleSelectDesignCarrierLifecycleDesign-r004.md | 9a5404e9a2636718dd5cdb45da545aca91af0654bee25127295cc106cbaabd73 |
| QuerySingleSelectDesignCarrierLifecycleFixtures-r004.json | a55e7db1ed99799ed3216a3096b089c869d840a525f9314dc27a1bae9e3d483c |

独立递归展开 `$object` 后，22/22 个内容寻址对象 canonical SHA 一致；16 个保存案例中的19份完整请求，intentDigest 均与完整payload排除contentId/checkVersion后的canonical SHA一致。原14条case identity完整保留；新增8组action observations中包括两项发布失败。009确认事件计数仍为1。

重新核对实际 dashboard createInit 分支：模板创建也调用createInit，故实现必须同时检查路由的非template事实，不能仅凭调用createInit赋来源资格。重新阅读 canvasSaveWithParams 现状：仍存在现场removeGroupArea、跨await读取curDvInfo、回包无条件resetStyleChangeTimes等旧行为；设计尚未落地，此审查不把候选oracle当实际源码行为。DeCanvas实际路径为 `src/views/canvas/DeCanvas.vue`。

## Findings disposition

| Finding | 裁定 | 独立理由 |
| --- | --- | --- |
| LC3-F01 样式单独编辑成功回包缺失 | CLOSED（合同层） | LC4-SAVE-14为单请求，root仅width550→580，revision1/commit c1不变，editGeneration1→2；实际事件走到success，pending空、ack1、requests1、dirty=true、dirtyClears0、确认事件0，旧完整payload仍A/550。可区分只看query revision的错误实现；SAVE02原捕获用例未被替换。 |
| LC3-F02 发布失败观察不完整 | CLOSED（合同层） | LC4-PUBLISH-02以expectedRevision0对当前1拒绝，观察状态与input逐字段相等；LC4-PUBLISH-03固定在root单槽替换后、selection赋值前抛错，root D/selection A、gate invalidated、reader unavailable、tokenGeneration2、旧rev1/c1、确认事件0、phase unmanaged，传播原异常且不回滚。预绑Capsule不能绕过失活gate消费。 |
| LC3-F03 客户端失败冒充服务端终结 | CLOSED（合同层，有明确恢复上限） | 原SAVE06明确改成有特定请求已终止且未写入证据的失败；普通HTTP/客户端错误不再自动归入。SAVE15超时转outcomeUnknown后下一更新成功，pending虽空仍保留原完整请求、dirty与uncertain，ack仅推进2；SAVE16未知create后拒绝BUSY_CREATE_OUTCOME_UNKNOWN，仅1次请求、id仍null。failure_contract禁止时间、刷新、后续成功或同会话导航静默消除未知结果。 |

前轮 LC2-F01 维持 CLOSED；LC2-F02 的完整保存捕获/身份/dirty合同与 LC2-F03 的发布/历史动作合同可在上述受限设计范围内关闭。**LC2-PERSIST 普通重开来源认证没有关闭**，也不以关闭设计finding替代任何产品验收项。

以上断言对fixture执行，未执行被审状态机代码。19个completeRequests的status为捕获记录中的checking，不据此推断最终请求仍pending；最终状态由expected.pending/outcomeUnknown明确表达，不能将历史捕获记录当当前状态。

## 精确实施范围与最小入口

父流程可以立即进入实施卡/准入，不需要再一轮泛化来源分析。最小可独立交付模块为 **M0：会话协调器与保存状态机实现**，生产目标：

- `core/core-frontend/src/custom-component/filter-copy/query-single-select-session.ts`（新增）：私有Capsule/Manifest、epoch/rev/commit/gate/token、detached准备、同步保存捕获、pending/processed/outcomeUnknown、dirty判定；普通数据构造函数不能公开mint来源权威。
- 对应定向测试建议新目标 `core/core-frontend/tests/filter-copy-query-single-select-session/`；父Builder card须列出实际文件并冻结r004各identity。应执行真实模块，不复制oracle生成被测结果，不把fixture自洽检查当实现验证。

M0可独立编写并验证；若仅交付M0，报告应明确“模块已实现但产品入口尚未接线”。产品生命周期实施的**最小闭合接线包**应同时覆盖下面真实目标，避免只接确认入口却让保存/历史继续消费错误来源：

| 目标 | 必要职责 |
| --- | --- |
| `core/core-frontend/src/store/modules/data-visualization/dvMain.ts` | 实例私有owner、来源能力/dirty代次、受管root与selection协调、未知结果在同编辑会话保留。 |
| `core/core-frontend/src/views/dashboard/index.vue` | 仅无resourceId且非template的新建初始化完成后建立session；导航/卸载撤旧token。 |
| `core/core-frontend/src/views/canvas/DeCanvas.vue` | 新建add成功且唯一顶层VQuery才登记pending；不把普通导入/旧组件认证为新建。 |
| `core/core-frontend/src/custom-component/v-query/QueryConditionConfiguration.vue` | prepare/commit、门控确认事件、一次性排队与消费、失败原异常传播。 |
| `core/core-frontend/src/custom-component/v-query/Component.vue` | 每次查询消费当前门控/身份，旧引用不得重领新token。 |
| `core/core-frontend/src/custom-component/v-query/Select.vue` | 阻止旧epoch/raw/设计提交回调；保留既有C缺值追加核对一次、结束关loading、仍缺显示无效，不另发第二核对。 |
| `core/core-frontend/src/store/modules/data-visualization/snapshot.ts` | 实际追加对象绑定Manifest、prepare先于指针、多setter期间reader不可用、有效/无Manifest/异常路径及原事件。 |
| `core/core-frontend/src/utils/canvasUtils.ts` | await前完整副本捕获，固定检查参数/方法/目标；回包关联token；结果未知保留和create防重复；有条件清dirty。 |

上述列表是实施目标边界，不是允许顺带重构这些文件，也不是本审查对写入动作的授权。父流程需绑定本报告、r004输入、实际topology和具体target的admission后开始Builder。若真实调用链发现必要新增target，应记录依赖增量与对应验证，不静默扩大为所有查询类型、所有来源或权限改造。

实施顺序可M0→新建/确认门控→历史/保存闭环；中间提交不应被声明为完整活动能力。设计上的三项阻断已关闭，因此允许同一受限Builder包完成全部闭环，无需仅因历史实现尚不存在再次阻断入口。

## 必需验证与保留限制

实现验证必须区分两层：真实服务模块执行全部候选状态oracle；实际Vue/Store接线观察确认发布、旧异步回调、snapshot真实raw键、undo/redo选择引用与保存回包。detached fixture运行不能代替后者。重点保留：单次事件对、prepare无副作用、发布中异常只失活不虚构回滚、仅样式成功不清dirty、两种overlap顺序、完整请求捕获、目标模式/epoch变化、unknown update与unknown create。

普通HTTP错误在没有可靠未写入证明时应走unknown；本设计不要求新增恢复API，亦不允许Builder自行实现自动补发或猜测资源ID。unknown状态可能持续阻止清dirty或再次create，这是明示保守行为；恢复需可验证证据或另行核对流程，不能把这一限制藏成“保存成功”。同会话导航重入不得清空未知记录，需在实际owner生命周期验证；跨进程恢复/重复创建保护尚无实现承诺。

真实服务器持久化顺序、CAS/幂等、普通JSON恢复来源、原始Goal保存回显及权限/收益义务仍须各自证据。这里没有将这些降为non-goal或更换authority；受限实现只是实现阶梯。真实权限继续BLOCKED / NOT_RUN，standalone或mock不替代授权隔离验证。

私有运行来源、设计默认值与当前运行选择保持分离；历史恢复分配新单调rev/commit；序列化载体不带私有认证，普通重开不凭默认值认证。scope、truth placement与用户C政策均无变化。

## 压缩误读与收尾

允许的一行结论：**r004三项设计finding已关闭，受限生命周期可进入精确实施准入；源码、产品运行、权限和普通重开来源尚未验收。** 不得压缩为“产品已支持”“保存已通过”“Goal完成”。不再提出超出当前承诺的泛化hardening作为阻断，也未新增通用治理DSL。

仅新写本报告；未修改Design/Fixtures/源码/测试/Goal，未构建、启动应用或写数据库。此为独立pre-Builder语义审查，不是post-implementation Validation。
