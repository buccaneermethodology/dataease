# 查询保存与历史副作用增量设计 r007

候选，不冻结设计、不授予Builder。card摘要0943d69d903c409ae4b82122a7229d1f369016d699cc1d3a96064616e3d0a8b0复验通过。仅新增本文件与QueryAdapterFixtures-r007.json，写前不存在。旧r005与review保留历史；以下明确修正其“完整旧componentRoot作为保存权威”与undo/redo快照计划。

## QAR4-01：局部设计权威与最新文档捕获

现状证据：core/core-frontend/src/store/modules/data-visualization/dvMain.ts:503–518原地改变curComponent.style；521–523替换componentData。core/core-frontend/src/utils/canvasUtils.ts:843–864从当前根cloneDeep后序列化，且保存其他画布字段。故查询提交时的旧根不能代表后来普通编辑。

**候选修订**：active仍是查询版本/commitId/carrier/效应计划的共同载体，但其中componentRoot只作为该次提交的冻结见证，不再是之后全根保存权威。普通非查询编辑继续保存在现有dvMain及相关画布Store，不要求全部改造成查询协调写入。查询设计字段由carrier权威管理，运行字段与普通样式不写回carrier。

保存时使用同步captureSave函数：不await、不发事件，在同一JS任务内固定active引用S，深拷贝当前最新componentData及保存所需canvasStyleData/canvasViewInfo等；在副本中按唯一组件ID、实际Group/DeTabs路径精确定位，仅用S.designByComponent覆盖查询propValue/cascade；保留当前所有其他字段与其他组件。不能插入已删除组件、不能按名称定位；缺失/重复ID或未协调的查询设计改动使捕获失败并报告冲突，不用旧根修补。清理linkage等既有保存转换继续施于此副本。JSON展示paste后移动/改颜色/改文本仍完整保存。

版本标识为二元：查询版本S.revision/commitId，加完整持久化捕获payload摘要（组件根、画布样式、canvasViewInfo及其他本次保存字段）。单纯queryRevision相等不能清dirty。保存返回时再次同步捕获并比较持久化payload摘要；排除仅请求用contentId等易变元信息，若新增编辑导致不同则当前仍dirty。捕获期间不得调用可能同步修改Store的回调；同步读取/克隆失败则不发请求。此方案依赖浏览器单JS执行栈，不宣称多个Store赋值天然事务化；异步请求回来不能重读新carrier拼旧根。

Prepare阶段不持有待回放的全根。提交前权限复验后，同步比较查询revision及目标存在/类型/数据集/绑定等影响兼容性的签名；仅样式、布局或其他组件普通内容变化不使过滤候选失效。此时重新克隆最新根，局部overlay候选propValue/cascade，再把见证根与新carrier一起构成aggregate发布；因此prepare期间left99→150，提交保持150。结构/绑定变更则重新prepare并确认。

发布后的兼容hydrate/恢复也禁止回放冻结旧全根：每次从当前最新根重新局部overlay该commit的查询配置；检查active仍为本commit，陈旧任务丢弃。普通编辑无需禁用；门控仅约束查询发布的同步短区段。该策略必须覆盖嵌套组件、删除/移动目标和保存路径，完整入口清单仍待实现验证。

## QAR4-02：历史游标、查询版本与效应分离

源码core/core-frontend/src/store/modules/data-visualization/snapshot.ts:97–123：有效undo/redo移动snapshotIndex并调用snapshotPublish；不直接追加新快照。126–131恢复完整根及画布；196–215的recordSnapshot会追加且截断redo尾。故恢复操作不能按普通粘贴再调用recordSnapshot，否则会破坏redo。

候选历史记录增加该记录对应的设计carrier/来源信息，与全根一起保存。**有效undo/redo恢复整个选中历史快照**（这是用户请求的撤销语义，允许回退其样式），并恢复同历史carrier；发布新的单调查询revision和commitId，指针移动一次。它不采用保存时保留最新样式的overlay，因为那会改变全根撤销语义。恢复当前身份/id/pid等既有保护字段继续遵循97–123，不将旧身份随历史恢复。

| 操作 | history pointer | 新revision/commit | history快照追加 | 预览计划 |
|---|---|---|---|---|
| undo且pointer>0 | 减1 | 是 | 否；保留redo尾 | 新commitId:preview一次 |
| undo且pointer=0 | 不变 | 否 | 否 | 无 |
| redo且pointer<last | 加1 | 是 | 否 | 新commitId:preview一次 |
| redo且pointer=last | 不变 | 否 | 否 | 无 |
| undo后新的正常编辑 | 沿现有编辑规则 | 查询编辑才更新查询版本 | 是；按既有规则截断redo尾 | 按实际编辑影响，不重复历史恢复计划 |

这里“快照”专指历史条目追加，不能与恢复全根的读取/发布混称。undo c14及redo c15均只有preview计划，**均无snapshot append效应**；修正r005 undo空计划和redo带snapshot的歧义。有效恢复失败若在发布前，pointer及根/carrier均保持；发布后预览失败pointer和新内容保持，只重试同commitId:preview，不移动指针、不追加快照。query门控仍执行Tree等消费者hydrate，历史内容与carrier共同发布；历史操作也不能让watch私自修改默认规则。

历史记录缺carrier时需从该快照的有证设计来源重建，无法证明则保持该适配缺口，不删除旧记录、不禁用普通撤销来规避。此旧历史兼容的充分性仍待补证，不能自称全部历史已支持。

## 证据与剩余边界

JSON均为合成事务fixture，精确覆盖paste→非查询编辑→保存、prepare期间样式变更、删除/多义/绑定冲突、晚保存回包、undo no-op/有效undo/redo及预览失败。已做JSON、局部overlay保持非查询对象、undo/redo无追加快照且有预览计划的自检。未运行产品/权限或Vue调度。

QAR3-02参数/树/日期shape独立复核仍保留，不以本次保存算法替代；DG-03未关闭。候选保存/历史协调需要实现清点、门控测试及独立审查，完整设计冻结不由本lane宣称。
