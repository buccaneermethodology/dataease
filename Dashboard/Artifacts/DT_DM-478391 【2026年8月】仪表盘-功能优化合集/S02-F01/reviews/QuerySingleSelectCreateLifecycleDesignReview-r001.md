# CREATE-003 独立语义设计审查 r001

## 双结论

- **Design Freeze Validity：PASS_WITH_BOUNDS_FOR_CREATE_LIFECYCLE_MODEL**。受控新建来源、WeakMap身份绑定、单槽发布和快照sidecar构成具体可审查候选；17例是15个确定模型结果与2个明确未决项，不是完整产品可执行合同。
- **Implementation Entry Readiness：NOT_READY_FOR_PRODUCT_BUILDER**。当前OBS-01跨首次发布与受管更新直接可达；OBS-02限制缺sidecar恢复，但不能靠“只新建”避开同会话undo。没有已冻结且不改变行为的产品激活子集可直接准入。
- 不是否认所有后续Builder：补齐下面的具体门控/失效合同后，仍可仅做顶层新建普通单选，无需历史迁移/通用保存/全形态调查。当前不授权另写重复纯helper或将登记session本身宣称产品能力。

## 接收与复算

父流程授权后SP010卡复验pass、exit=0，canonical `10c2e7e899ed950d08e6577d1cac6b6b9299acc44a328b0ef3a964c21b0cafb3`；Context校验exit=0、全部引用摘要一致。仅写本报告。

递归展开本文件10个objects，检查引用存在、无循环，并逐项重算展开后canonical JSON SHA256，10/10一致。17个case均可解析，不存在用省略号或外部patch补足状态。对003/004/005/011/015完整前后state相等作断言；012/013/014确认root等于所选完整快照、revision恰+1、snapshots不变、不追加。其余事件按字段、revision、carrier及effects逐项核对如下。此为模型审查，不是实现测试GREEN。

| 案例 | 核对范围 |
| --- | --- |
| 001–002 | 新epoch空根rev0，无carrier；新增只pending和缓存标记，不调用QCARRIER |
| 003–005 | 添加前失败、确认失败、草稿取消完全不发布 |
| 006–007 | 首次确认rev1/一次confirm事件；实际快照按独立record事件追加，非每次confirm自动追加 |
| 008–009 | 外参X和选择C改运行root，carrier及revision保持 |
| 010–011 | 从carrier开草稿后确认D→rev2；取消/失败完全不变 |
| 012–014 | undo/redo分别新rev3/4，恢复所选全根及相应设计；回pending失活carrier，不追加快照 |
| 015 | 边界undo不改任何state/effects |
| 016–017 | 明确NOT_READY/state=null，分别缺Manifest恢复和未覆盖原地写入，不能当运行失败返回协议 |

两个消费者空filter及首次X/后续C与运行defaultMap语义一致。用$object复用值只用于文件去重，不允许实现共享可变design/runtime/历史对象。

## 源码与Frame-first

dashboard/index.vue非模板create分支在nextTick内createInit，再置dataInitState；DeCanvas在addComponent后才有合法新控件身份。空数组或同id不够证明来源。初始VQuery空propValue还不能调用单条件QCARRIER，pending阶段合理。

QueryConditionConfiguration的setCondition/setConditionOut从props.queryElement.propValue深拷贝草稿；因此受管入口必须改为从design水合，否则外参X会成为草稿默认。现有confirm仍在1606清空后nextTick分槽写入、recordSnapshotCache、下一tick emit。Component.vue的watch与queryData路径、1056/1058事件绑定及Select.vue:95的props config引用表明实际消费者不只是新增reader；替换componentData槽不自动给这些旧引用/队列任务增加epoch/revision验证。

snapshot recordSnapshot实际在门槛满足时deepCopy并存newSnapshot，再裁剪redo、清缓存；sidecar必须关联最终rawSnapshotRecord，不能关联后来deepCopy的临时对象。snapshotPublish:126以后先改dvInfo/root/样式等，之后按id更新curComponent，再发既有通知；undo先移指针，证明仅“预注册WeakMap”不能自动覆盖全部观察时点或失败恢复。

只读源码支持候选方案方向，不证明同步watch已被门控、旧Vue实例一定继续回调或一定不会回调。风险应转成具体调度反例测试，不夸大为已发生线上缺陷。

## OBS-01实际阻断范围

成立且直接阻断当前首次发布/受管更新激活。WeakMap(toRaw)保证通过新reader取到同对象Capsule，但无法约束绕过reader的既有props、nextTick和事件处理，也无法识别同一raw对象上的未覆盖设计写入。首次发布也要处理选中引用和旧事件，不是仅更新第二次才有风险。

最小补充为：列受管confirm、setCondition/Out、Component查询/watch回调、Select异步写入的身份/epoch/revision校验时点；旧prepared及旧实例回调如何无副作用失效；对同一对象的合法runtime默认X与设计更新D如何由受控入口区分，并对未覆盖写入明确降级/失活。不能凭字段差异猜意图，也不能让所有runtime.default变化都清carrier破坏既有语义。补完整的旧回调晚到、重新选中/替换、未覆盖写入事件输出，替换017的null占位。

## OBS-02实际阻断范围

只直接限制无Manifest/重建失败的恢复路径，不要求迁移所有旧历史。带有效sidecar的012–015已有清楚模型方向。但新建会话也可能进入未覆盖快照/缓存恢复或其他原恢复路径，当前没有证明这些路径不可达；因此不能以“只首建”跳过。

最小补充为：在snapshot原恢复发布之前，确定会话能力的失效顺序及新root的reader结果；保留原历史指针/全根恢复/普通保存和既有事件，禁止过期carrier可见；重建失败不得造成指针已动但root/能力仍旧。冻结016完整结果及事件计数。可选择失活新增能力并继续原恢复的策略，但须由修订合同明确，而非本审查替作者实现或默认授权。

## 精确target与下一步

当前拒绝直接派发的target是候选 `core/core-frontend/src/custom-component/filter-copy/query-single-select-created-lifecycle.ts` 加其产品接线：`store/modules/data-visualization/dvMain.ts`、`views/dashboard/index.vue`、`views/canvas/DeCanvas.vue`、`custom-component/v-query/QueryConditionConfiguration.vue`、`Component.vue`/`Select.vue`相关观察路径及 `store/modules/data-visualization/snapshot.ts`。

下一轮只补上述OBS两个事件边界：写明具体handler/action、session失活入口、旧回调抑制规则及016/017完整expected，并给首建/受管更新的实际观察测试方案。无需再扩大新文档来源调查，也无需补全历史迁移。未激活的内部注册表可以技术上单独编写，但本稿没有独立冻结其API与验收，且不解决用户所需生命周期，不建议用它替代本轮产品推进。

## Findings与声明边界

设计分析有界接受，当前产品准入不通过；OBS-01/02明确OPEN而非作者把测试未运行误当阻断。缺失的是行为合同，不要求先实现才能审设计。17例中016/017不可被统计为已覆盖成功/拒绝行为，15个模型结果也不证明Vue运行或原子发布。

未改作者设计/fixtures/代码/Goal。原10项Goal AC、26项must-have与16项产品义务完整保留，权限BLOCKED/NOT_RUN；QE2E缺可信RED及QCARRIER包级证据边界不升级，S01不变，不关闭DG-03或Goal。

## 被审摘要

- `QuerySingleSelectCreateLifecycleDesign-r001.md`：`2c3cb97bce7e23f18174e2a3b45fb9eb2a73bb460cc0e0777234c5a8da77696e`。

- `QuerySingleSelectCreateLifecycleFixtures-r001.json`：`63b3627583489d5b0553a906f29e92c4f95f122e8b9a8f69c659541835c1ac4d`。
