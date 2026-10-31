# 查询适配器版本与共同发布设计 r005

状态：增量候选；不关闭DG-03、不授予Builder、不声明设计冻结或运行验收。仅新增本文件及QueryAdapterFixtures-r005.json，写前不存在。card摘要a9074f0cdb418e019e17604382625ed0989e08ea3911806a00d373339f727b3f已复验通过。针对独立审查r003的QAR3-01/03；r004及旧review原样保留。

## 源码事实与新增设计边界

- dvMain.ts:521–523仅替换componentData，没有共同commitId或设计载体；不能把一次数组赋值等同多Store事务。
- QueryConditionConfiguration.vue:1591–1629确认分别写propValue/cascade并发快照/刷新，不是本提案的事务实现。
- canvasUtils.ts:843–864从当前componentData深拷贝并序列化；当前没有检查carrier revision。r004拟用carrier覆盖的规则必须与粘贴同步，否则覆盖新值风险成立。
- snapshot.ts:87–95只累计缓存；196–220创建快照并可能写wsCache；126–155的snapshotPublish分别设置根与curComponent，没有恢复carrier的现成逻辑。
- Tree.vue:108–151的ID监听会init，treeFieldList监听会清默认及请求枚举；仅屏蔽queryData不足。Component.vue:310–322的propValue监听会刷新oldList。以上路径必须纳入新的提交接缝，当前没有统一门控证据。

本文件中以下结构与算法均为**拟新增**，不是对现状能力的陈述。源码路径前缀均为core/core-frontend/src/；dvMain/snapshot位于store/modules/data-visualization，Tree/Component位于custom-component/v-query，canvasUtils位于utils。

## QAR3-01：版本唯一权威与粘贴更新

将成功粘贴明确列为设计载体更新事件，与配置确认、新增删除、撤销重做并列。采用单一documentQueryState.active不可变aggregate，包含documentId、revision、commitId、componentRoot、designByComponent、effectPlan。designByComponent保存每个查询组件的propValue/cascade设计副本；componentRoot是同revision待发布编辑根（运行值另作运行投影，不能回写设计根）。commitId在构造aggregate时生成，不能在根发布后另写Store。

Prepare固定baseRevision/baseCommitId及目标ID、完整候选配置；同时构造下一版根、carrier和副作用计划，深拷贝保证源/目标及运行投影不共享可变引用。revision由协调器按当前文档单调递增，目标样式保留。语义断言要求候选根中目标设计字段与designByComponent[target]一致；不成立不能提交。

发布前获取权限复验结果，最后同步区比较active仍为baseRevision/baseCommitId；期间不await。唯一线性化点是 `documentQueryState.active = preparedAggregate`。这是一个引用赋值，所有版本字段和根/设计快照从同一对象读取；不得分别写carrier、root、commitId后声称原子。若未来实现仍保留多个权威Store，就不满足本合同，须重审而非靠顺序碰巧成立。

既有dvMain.componentData作为受门控的兼容运行投影，通过setComponentData同步；它不能再作为复制和保存的设计权威。curComponent按同aggregate中的ID重定位。此调整影响既有编辑写入、撤销、保存接缝，必须清点全部查询设计写入路径接入协调器；未接入时不能宣称全量合同成立。无需重构非查询业务，但未纳入的入口必须明确记录并在设计预审解决，不静默绕过。

保存函数在发请求前一次捕获active引用S，复制S.componentRoot并用S.designByComponent覆盖查询设计字段，只允许同一个S.revision；严禁混读后续版本。异步保存成功只确认保存了S，若当前已为S+1则仍为dirty。复制再次读取active的carrier，故paste后预览/再复制/保存都指向新配置。效应降级不使carrier倒退。P0在原正常保存成功前保持；本设计不自动保存。

## QAR3-03：门控、线性化与可判定异常

门控属于协调器的每文档串行发布上下文，先关闭副作用入口，再执行active单引用替换与兼容投影hydrate。关闭发生在任何可观察新根之前。门控不是第二个设计权威，也不能决定提交是否成功；成功与否仅看active.commitId是否为候选ID。

必须拦截的现有入口：Tree的config.id与treeFieldList监听（108–130）及init/getTreeOption（134起）；Component的propValue监听（310–322）及queryData（814起）；配置确认的快照/事件（1591–1629）；snapshot recordSnapshotCache与recordSnapshot。门控期间不仅不发请求，还不允许Tree清空defaultValue/selectValue或旧异步回调回写新投影。watch只记录受影响ID+commitId，读取候选已完成默认配置；异步枚举/查询响应带捕获commitId，过期响应丢弃。

释放顺序：active已发布→兼容根与curComponent完成hydrate→Tree本地oldId/默认展示按新候选初始化（不走清空默认分支）→确认受影响消费者就绪→登记一次快照→调度一次逻辑预览。快照或通知异常可保持副作用计划pending并恢复重试，但不重新提交aggregate、不再递增revision。运行投影维护展示/枚举状态，禁止回写active的默认规则。拟新增的guard和hydrate接口需实现测试证明覆盖，不宣称Vue默认调度自动提供这些保证。

异常判定：发布前失败active仍为旧commitId，恢复旧兼容投影且不放行过滤副作用；active已为新commitId则确定已提交，即使赋值触发的观察回调随后抛错，也必须归COMMITTED_DEGRADED，carrier/root/revision均为新值。不存在“根新而commitId旧”的合法中间态。同步观察者只允许受门控读取同aggregate，不得在setter外对active嵌套字段做部分写；一旦发现这种调用违反实现合同，不能用INDETERMINATE作为产品终态。

兼容hydrate失败：active仍新，门控保持关闭，错误反馈明确“配置已应用，预览初始化失败”，协调器从同active重建投影；不展示完整成功。快照失败同样新设计不丢，标快照待恢复并阻止下一次同目标发布，避免撤销链缺口；已捕获设计保存可保持新配置，但不得把保存成功说成快照恢复。通知失败按commitId副作用ID重试，不能重复配置/快照。网络预览失败保持新编辑配置并显示错误，不伪装取消或验证失败。所有提交前拒绝仍要求零配置/预览/快照/查询变更。

## 撤销、重做与版本

现状snapshotPublish:126–155只有组件根及其他Store恢复。候选快照需附带对应设计carrier和原始commit内容；撤销通过同协调器把旧内容作为新aggregate发布，例如内容c12在revision14/commit c14恢复，绝不把revision回退到12；重做c13内容为revision15/c15。保存与再次复制读取14或15的carrier，内容与根匹配。副作用ID使用新commitId防止旧通知重复。历史快照没有carrier时，不能用可能运行污染的对象假定设计来源；需从明确未污染的保存版本或既有设计快照建立基线，再启用本功能。此兼容路径尚须证据，不能丢弃用户既有撤销记录或永久取消正常复制能力。

## fixture与验证

JSON含paste→再复制→保存、prepare失败、版本漂移、发布前/后抛错、Tree监听、快照/通知失败、undo/redo、保存回包晚于新编辑、过期枚举响应12项合成状态oracle。配置为最小示意，不是宿主可挂载数据，也不补足QAR3-02。已做JSON/唯一ID、根与carrier配置相等、revision单调及目标样式自检；未运行Vue、接口、权限或产品故障注入。

QAR3-02保持：参数需真实开源生成schema/type值域及完整响应；树需默认值编码与监听次序完整成功例；日期需子组件首次消费、固定时钟时区精确oracle。可继续静态调查，不要求维护者重复业务裁定。载入前是否已污染及历史快照来源仍须源链证明。完整设计冻结由独立审查决定，不因本次共同发布提案自动解除DG-03。
