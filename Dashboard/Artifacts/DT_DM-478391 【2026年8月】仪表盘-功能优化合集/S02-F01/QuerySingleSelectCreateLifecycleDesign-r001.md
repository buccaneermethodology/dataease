# 新建普通文本单选首次创建与受管更新生命周期 r001

**结论：NOT_READY_FOR_PRODUCT_BUILDER。** 已完成新建来源、具体候选发布机制、快照动作和完整时序模型；仍有两个精确观察/失效缺口，不能让Builder自行补设计。本稿只交一次独立审查裁定，不扩展旧历史迁移、通用保存或全形态入口。

接收端card canonical `8617eceef97102e64c8e10f508aae97dfc3b81995c28f9e6f956d06dcebf2763` validate/render成功，Context通过且所有绑定输入无漂移。父流程已明确准入设计。只写本文与Fixtures；未改源码、Goal、旧证据、S01或权限状态。

## 1. 子集来源与首次carrier创建

精确受理范围：`views/dashboard/index.vue:273–320` 的无resourceId、opt=create且非template分支，调用 `dvMain.createInit('dashboard',...)` 后根为空。`dvMain.ts:1868–1913` createInit清componentData/canvasViewInfo。不能仅以“当前数组为空”认定来源；旧文档删空、模板、缓存恢复、加载、嵌入与大屏均不由此条件取得资格。

`views/canvas/DeCanvas.vue:97–118` 的handleNewFromCanvasMain生成组件/id并addComponent，随后布局和快照缓存标记；`component-list.ts:320–344` 的新VQuery是propValue=''。所以新建后只登记pending对象，不调用QCARRIER、没有design carrier。仅限定主画布顶层单个普通单选，嵌套/多条件/树/参数等未被本合同支持，不删除原功能。

建议物理归属（明确为本轮候选实现选择）：新增 `custom-component/filter-copy/query-single-select-created-lifecycle.ts`，由dvMain Store实例持有一个私有session。session用内存documentEpoch区别新文档生命周期，维护单调revision allocator及 `WeakMap<rawComponent, Capsule>`。Capsule含epoch、componentId、revision/commitId、独立design和pending/managed状态；必须以Vue `toRaw`对象身份索引，不能只按复用的id索引。组件root不新增可序列化carrier字段，避免现有canvasSave自然把新元信息写出去。

精确候选actions：

- `beginCreatedQuerySession()`：只在上述非模板新建调用链受控触发，createInit完成后建立新epoch；旧session退出/加载时关闭。调用者字符串origin不授予资格。
- `registerCreatedQuery(component)`：仅DeCanvas此创建分支在addComponent成功后登记pending。构造/添加前取消失败不登记。删除后reader因当前根不存在该对象返回不可用；旧对象由WeakMap自然失去可达性，跨epoch不可复活。
- `prepareCreatedQueryConfirmation(component, completeCandidate, expectedRevision)`：从私有pending/managed登记校验来源；完整JSON候选交现有QCARRIER取得design/runtime，保留当前root其他属性。不得重写QCARRIER/QE2E，不新增A/B纯转换helper。
- `publishCreatedQueryConfirmation(prepared)`：同步复核epoch、当前唯一顶层对象身份和revision；预注册新对象Capsule后，一次替换componentData中目标槽。旧root与新root各自只对应自己的Capsule；不先清propValue，不分开发布propValue/cascade/carrier。新revision只在成功发布时分配；失败/取消无新revision。prepared无权修改Store或排队重试覆盖新对象。

Capsule由本地受控创建/确认路径产生，外部提供同样字段不能伪造资格。首个完整确认A得到revision1；后续受管确认D得到revision2。这不表示已有代码具有这些actions。

## 2. 确认输入、可观察发布与尚未冻结的门控

真实 `QueryConditionConfiguration.vue:1676–1688` setCondition/setConditionOut目前从props.queryElement.propValue克隆草稿；1591–1629确认先validate及默认收尾，再清空propValue，nextTick写两槽并记录snapshot缓存，下一tick发reRenderAll/queryData。普通用户Select非配置写运行值，配置写默认；运行外参还会改runtime默认，因此**受管组件打开草稿必须从carrier.design重新水合**，不能把外参X当待编辑原设计A。pending空控件仍走原建条件流程。

候选受管confirm分支在validate/默认收尾后生成完整候选，走prepare/publish，禁止复用1606空窗口；成功后只保留原一次recordSnapshotCache('confirmClick')与原一次reRenderAll/queryData事件对。取消、validate失败保持已有root/carrier/计数，不删除已创建空控件；原非受管分支不由本稿改写。

新增reader只能通过 `readCreatedQuery(currentComponent)` 取得同对象的carrier，禁止缓存“按id取最后carrier”。同步槽替换支持reader看到旧/旧或新/新，WeakMap注册早于新对象可见；组件选中引用更新后再安排下一tick事件。

**QCREATE-OBS-01（阻断）：** 上述机制尚未证明已有Component/Select持有的prop引用、同步watch及其他原地默认写入在替换瞬间与随后tick内全部受到身份门控。具体反例：旧子组件保存旧queryElement引用，槽已换新root后又调用confirm/queryData；或未覆盖编辑直接改当前propValue但原Capsule仍在。单纯WeakMap对象身份不能识别后者，字段名比较也不能区分合法外参默认X与未经受管设计更新D。需要独立审查决定最小具体观察门控/失效入口，不能让Builder猜测“所有写入已覆盖”。本轮不继续搜索全工程、不把候选同步替换冒称Vue原子验收。

## 3. 快照、撤销/重做与revision

真实 `snapshot.ts:78–95` recordSnapshotCache只累加；196–225 recordSnapshot在dataPrepare/非移动/禁用时间条件允许时才deepCopy根、追加历史、截断redo尾并清缓存。不得把一次确认等同一次即时历史追加，不新增快照来强造每一步撤销。Fixtures显式安排recordSnapshot事件，只有满足现有条件才有记录。

候选快照元信息采用**内存sidecar WeakMap<rawSnapshotRecord, Manifest>**：实际recordSnapshot捕获root时，取本session同次Capsule投影并关联最终历史对象；普通wsCache序列化仍无此元信息，不改通用持久化schema。Manifest覆盖本子集pending/managed身份、完整design和捕获revision；普通样式和其他画布状态仍由原快照完整保存。无元信息的缓存重开不自动激活该能力。

undo/redo在deepCopy选中历史**之前**从原历史对象读取私有Manifest；复制全根后，为新raw对象重建对应Capsule，预注册后交现有snapshotPublish的setComponentData一次换根。不能把历史carrier按旧revision直接当当前活动提交：成功恢复分配新单调revision/commit，设计内容来自所选历史。历史指针仅移动一次，不调用recordSnapshotCache/recordSnapshot，不截断redo尾；有效恢复仍触发原snapshotChange及其既有条件下snapshotChangeToView，不能另加confirm queryData事件。no-op历史边界不分配revision、不发布、不产生事件。

undo到带已证pending元信息的空控件，carrier失活而pending身份保留；redo可按带元信息的已确认快照重新激活。undo到已证空文档则无组件/carrier。对象删除/移出唯一顶层位置时reader不得返回旧Capsule。模型中设计revision是session提交序号，不等于旧snapshot内捕获序号；样式/运行/实际recordSnapshot本身不递增它。

**QCREATE-OBS-02（阻断）：** 现有snapshotPublish先改多个Store字段、undo先移动指针；缺Manifest或重建失败时如何在保持原undo/原保存的同时精确失效，并使全部既有观察者不读到旧carrier，尚未冻结完整发布门控。只知道“不能继续使用旧carrier”，不足以决定具体可观察结果。因此fixture016为完整输入＋NOT_READY（state=null是未决占位，不是执行返回值）；不得据此禁用普通撤销、删历史或把原保存改成拒绝。此缺口仅针对本新能力的恢复边界，不要求迁移所有旧历史。

## 4. 运行与外参隔离

Select运行选择C只改变独立运行root的selectValue/mapValue；dvMain外参value路径允许runtime默认/运行值变X，design保持A且revision不变。`useFilter.ts:140–149`首次读runtime.defaultMap，因此外参X后的首次查询应为[X]；之后C查询为[C]。不强制运行root的default始终等于carrier，也不将design送入运行消费者。

本稿冻结的模型只含单值value外参、普通单选选择及确认。其他外参模式、联动、未覆盖编辑的实际写入仍应保留原行为且不能静默认定carrier有效，具体识别/失效依赖OBS-01，故本稿整体NOT_READY。保存接口保持原状，本轮没有新增design-overlay或持久化承诺；旧历史/保存义务仍留在完整Goal。

## Fixtures与自检

17条案例覆盖空文档、成功新增、添加前取消失败、确认失败/取消、首次A、实际快照、外参X、运行C、受管确认D、受管取消/失败、undo/redo、回空控件及边界no-op；最后两条精确表达未决。15条为完整候选模型结果，2条为NOT_READY。另有显式filter=[]的首次X/后续C消费者oracle，区分新增项与累计器最终值。

为避免重复半兆字节的同一condition及历史根，Fixtures用本文件 `objects` 字典保存10个完整JSON值；`{$object:sha256}`精确引用完整对象，按文内递归规则展开，无外部补值、无局部patch/默认推断。SHA针对展开后的canonical JSON。已自检所有引用可解析、摘要匹配且解引用结果与去重前完整17案例逐项相等；不是省略输入/输出。root/历史的外层模型是明确投影，未改动属性按KEEP；完整condition沿已有QCARRIER形态。既有QCARRIER/QE2E/source fixtures只以路径和SHA引用，不复制其库。

还检查：外参和运行不改carrier/revision；undo/redo不增加snapshotAppend，revision分别3/4；回pending无carrier；两个消费者filter=[]。未执行Vue/Store/searchQuery/浏览器/网络/数据库；这些是作者模型构造检查，不是独立验证或实现GREEN。

## 审查输入与停止边界

建议独立review只裁定两个问题：对象身份绑定＋单槽替换是否足以成为该路径的实现合同，以及最小门控/缺元信息恢复失效是否仍需补充。如果仍不足，明确否定当前target并指出具体写入/观察边界；不得因“安全新建方向存在”就将缺口交给Builder。

本轮有限读取全部落在已绑定DeCanvas、dashboard新建、组件配置、dvMain/snapshot与消费者。未触及旧历史迁移、通用保存、权限或其他功能。完整10项Goal AC＋14项F01＋Q066/Q067＝26项义务保留；QE2E/QCARRIER各自证据边界不升级，真实权限BLOCKED/NOT_RUN，S01不变。本稿未授权Builder，也未完成产品/Goal。
