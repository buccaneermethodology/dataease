# SOURCE-LIFECYCLE r002 独立语义审查

Reviewer：/root/s02_goal_review。只写本报告；未改产品代码、Design、Fixtures、Goal或权限环境。

## 双结论

Design Validity：PASS_WITH_BOUNDS_FOR_SOURCE_AND_LIFECYCLE_ANALYSIS。来源边界、私有载体避免序列化、历史失活、最新根保存捕获与dirty竞争的定位有源码依据；候选不变量可用于精炼合同。

Product Lifecycle Implementation Admission：NOT_READY。当前不是闭合的可执行产品生命周期合同，且没有本轮target-bound admission。原因是精确动作/完整oracle仍缺，而不是“还没写代码所以设计不可能准入”。可以通过下述有限精炼解除合同层缺口；无需重新调查所有来源或重问已冻结的枚举政策。

## 精确包与复验

实际card路径：planning/qssdh-carrier-lifecycle-design-review-card-r002.json；实际Context路径：planning/ContextBootstrap-QSSDH-SOURCE-LIFECYCLE-design-review-r002.json。最初父端给raw SHA作为canonical预期，接收端明确报digest mismatch；父端纠正后，以canonical a5c9fb8d95fb7b046eb0a6eea92b8872713a83e282b2bdce2c76456ae011ee4c重新validate通过，不追认错误预期。Context validate通过，原始SHA256 13b2d6e0180f874ee55f2e803b5ba48c3344fe02c88342da27385c8f6a79fa03一致；全部base_context_refs无漂移。

绑定Design r002 SHA256 d1d2e0c8fb5c13bd67cd025192118ea1a7add7698e62101711d96cdbb8731765；Fixtures r002 SHA256 95048b33a24d66f98652bb68c64fc7fb19b1ac068f728f9a94262e64a148778a。14例完整递归展开，14对象canonical SHA256全部匹配；状态是明确的合同投影，不是全产品状态。

## 源码与候选的区分

已核查canvasUtils.ts:843–915：removeGroupArea先作用现场，随后clone组件并序列化；canvasViewInfo/appData仍作为引用进入payload，名称检查可能await；发送方法/名称等又读取当前curDvInfo，回包更新dvInfo并无条件resetStyleChangeTimes。保存问题不只是替换两个配置槽，还涉及请求身份、其他payload字段及回包归属。

snapshot.ts:97–135当前先移动指针，多setter恢复；196–225只在门槛满足后实际追加newSnapshot并写wsCache。Manifest必须绑定实际记录对象，不是确认次数。配置确认跨tick空窗及当前消费者仍没有产品载体事务保证。当前Select已有观察相关接线，故不能复用旧“枚举尚无实现”的说法；它的局部行为也不证明dvMain/确认/历史/保存已同commit集成。

私有WeakMap与不在可枚举root挂元数据的选择合理；保存重开后缺私有来源是该选择的明确限制，不得把载荷中的A反推为有证会话。该限制不能取消原保存回显义务，也不必阻断所有会话内纯准备工作。

## 精确finding

**LC2-F01：TC-QSOURCE-R2-009的确认副作用不一致。** 输入confirmEventPairs=0，事件包含later_confirm_and_style_edit并将设计从A提交D、revision变2，但expected仍confirmEventPairs=0；002/005正常确认均增加一次。请改为1，或若事件仅表示外部已发生状态，则明确事件边界并以已更新完整状态作为输入，不能同时把确认当本序列动作又漏计。dirty保持true和发送旧capture A/550方向正确。

**LC2-F02：保存完整capture/回包仍是方向而非可执行合同。** 008/009只给captured/sentComponentData；没有完整canvasInfo、请求目标/方法/contentId、名称检查前后快照，以及回包对应保存身份与dirty判定。必须固定所有保存字段一次性深捕获和capture token，并规定只清该捕获以来未发生新编辑的dirty。至少补“仅样式编辑而query revision未变”、新确认、名称检查期间编辑、连续保存回包乱序和失败场景；完整payload/dirty oracle不可由commit一致单独替代。无需因此先写产品代码。

**LC2-F03：发布/历史仍缺最小动作表与观察合同。** 单槽发布需明确实际session持有者、prepare/commit前身份复验、当前root和curComponent重绑、同步reader屏障、旧watch/nextTick/枚举token如何失效及确认事件一次性边界；Manifest捕获需绑定实际snapshot追加对象，undo/redo应明确指针前准备、有效与缺失分支、setter异常时失活/传播而非虚构事务。006/007可作为基底，但只有末态/字符串trace不足以冻结这些真实接线步骤。可复用已审OBS候选门控，不能据纯模型推定产品原子性。

013禁止placement与014未准备原子性中的null只是分析状态，不是API返回协议。012为clone/JSON静态观察，无网络/持久化证明。以上应在合同中显式分型，避免Builder把14例全部当统一函数oracle。

## 最小闭合路径与准入边界

可以精炼成闭合可实现合同：限定非模板受控新建普通单选会话，固定一个私有session服务的API/错误/epoch/raw/revision；冻结确认与历史动作表及完整观察序列；冻结save capture全payload及独立文档编辑代次/回包token；修复009计数。将“会话内受管”与“重开后自动恢复来源”分开交付并保留后者欠项。若不要求自动恢复来源，本切片可fail-closed为unmanaged；若要求自动受管，则需另冻结可验证持久来源设计和兼容契约，不从普通JSON自动认证。

候选产品target定位为dvMain会话持有及受控创建入口、DeCanvas创建登记、QueryConditionConfiguration确认/草稿、Component/Select相关消费者、snapshot实际记录/恢复、canvasUtils保存捕获/回包及其真实调用方；具体新增服务与测试文件必须在后续卡列准确路径。该清单不是写授权，也不要求同时扩大所有旧文档/模板形态。已有CREATE纯模型及OBS证据可复用，但不能抵扣生命周期集成验证。

用户已冻结QOBS-ASYNC-01：迟到成功响应缺刚选C，只追加一次核对；核对结束关loading；仍缺则显示无效。此政策保持，不再次当作未决项，也不允许carrier/save捕获把运行C或枚举结果晋升为design。

在闭合合同独立接受后，再满足S01 F01 Entry Packet、真实权限隔离环境、可信行为RED、实际拓扑与精确target-bound admission，才可进入产品实施；当前这些未被本报告证明齐备。环境仍BLOCKED / NOT_RUN，禁止standalone替代真实权限。没有新增产品运行、数据库或保存验证。

Goal完整10项AC、26项义务及16项产品义务保持，S01不变；本报告不声明产品/Goal完成。
