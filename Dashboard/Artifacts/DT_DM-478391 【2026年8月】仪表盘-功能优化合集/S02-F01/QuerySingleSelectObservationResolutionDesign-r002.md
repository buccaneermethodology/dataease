# 普通单选观察门控与历史失活边界 r002

**整体结果：DESIGN_CANDIDATE_WITH_MAINTAINER_DECISION_FROZEN。** 本稿保留已审身份门控与缺sidecar恢复设计，并按维护者对QOBS-ASYNC-01的裁定补齐异步核对合同和完整状态用例。产品Builder仍须满足独立增量预审、S01 Entry Packet、真实权限隔离环境、可信RED和精确 execution admission；本稿本身不授权写产品代码。

接收端card canonical `427d25954b243852a4d708e5c106a3ee921ee3bf7c087096e5f521b957a070e7` validate/render通过，Context通过且绑定摘要无漂移。仅写本文与Fixtures。原Goal26项义务、S01、权限与旧证据未改。

## 事实与已审纯模型边界

DeCanvas.handleNewFromCanvasMain创建root/id后addComponent、再排nextTick布局与快照缓存；dashboard非模板create调用createInit清空根。既有CREATE-003已把这条来源限定为受控新建，不再调查旧文档。

本轮实际读取了PureModelValidation-r001与Delta Handoff：首次Validation发现fresh后额外禁止同一事件数组继续，后续修复已允许fresh→add并由独立复跑127项/定向lint确认该finding关闭。缺可信实施前RED仍保留。纯模型不接Vue，故这些证据完全不能代替下面观察门控；其最新源码摘要与本轮Context一致。

新增关键事实（前缀core/core-frontend/src）：

- `Component.vue:306–321` watch props.element.propValue更新list/oldList；`386+` queryDataForId和`814–884` queryData读取element，更新firstLoadMap后emit查询。绑定的queryData/reRenderAll不携带旧组件版本。
- `QueryConditionConfiguration.vue:1676–1688` 草稿从当前props克隆；`1591–1629` confirm在清空propValue后跨tick写槽、记录缓存，再发两事件。队列任务没有来源token。
- `Select.vue:95` config是props的ref；`342–469` enumValueObj.then/finally会读取**回调执行时**config.value。单选选值不在新选项时还会清defaultValue，随后改defaultMap/map并可能queryDataForId。它不是“只更新选项列表”的无副作用回调。
- `Select.vue:537–607` default/select/multiple与字段watch排nextTick或debounce；`745–761` init直接按默认写selectValue并排队，`804–815`挂载注册事件。仅在unmount清timer并不取消已排Promise回调；源码不证明这些回调一定触发缺陷，也不保证不会迟到。
- `QueryUtils.ts:5–17` reRenderAll会向旧条件涉及图表emit查询，故旧确认的reRenderAll与queryData均须在调用之前门控，不能只门控后者。
- `snapshot.ts:97–135`先移动历史指针，复制历史，再多setter恢复；`126–175`恢复后按id重绑curComponent，随后snapshotChange/条件snapshotChangeToView。原序列没有sidecar或能力失活屏障。

这些条件扩读只追直接写入与调用方，完整路径/SHA记录在Fixtures；未开展全形态调查。

## OBS-01：最小身份契约与门控位置

以下是候选实现规则，不是现有行为。保留上轮独立Capsule方案；新增观察token包含documentEpoch、designRevision、tokenGeneration、rawComponent、rawCondition，以及枚举请求的requestId。标签在Fixtures中仅表示真实对象身份，生产比较必须用toRaw引用；不能接受调用方字符串证明来源。

1. setCondition/Out打开受管草稿时捕获epoch/raw/revision并从carrier水合。confirm准备前、同步发布前各复验；旧prepared不复用新root。仅正常成功发布分配设计revision、替换完整root、重绑选中引用并失效旧token。
2. 所有nextTick、Promise then/finally、debounce、timer必须在**排队/发请求当时**捕获token；每个回调开始写入、清loading、改变options/local select、回填map、释放unMountSelect或emit之前复验。then通过不代表finally自动通过；finally可能发生在下一次身份更新之后。
3. Select的handleFieldIdDefaultChange和handleFieldIdChange在实际发请求时分配递增requestId，then/finally均比较最新requestId；debounce调度时先捕获原身份，真正发起前再验证。旧请求finally不得关闭新请求loading。Component的queryDataForId/queryData、确认排队reRenderAll也携带调度token；失败只丢弃该旧任务，无写入/快照/查询。不能在执行时从新props重取token再把旧任务洗成新任务。
4. 首次发布及同ID替换也须比较raw；离开文档关闭epoch。新props watch执行时可为当前新实例/对象创建新token，旧闭包保持旧token。模型仅要求旧任务失效，不强制重挂载所有VQuery。
5. 受管reader每次比较当前唯一根身份、epoch/revision及**当前完整查询runtime投影**和最后一次受控写入接受的投影，不能只比较default字段。外层样式不参与。发现未登记原地写入时先使新增能力失活、撤销旧token，再返回不可用；保留当前root与原功能，不猜测是设计还是运行，也不把旧carrier覆盖回去。
6. 合法runtime写入进入同步门：gate=writing期间reader不可用；只有明确的Select用户选择/初始化/外参入口可以在同一同步调用内更新runtime并刷新接受的投影，不改design。设计确认只能走独立发布。受控token来自闭包入口，不接受任意origin参数。外参X可以改runtime.default，因为首次查询依赖它；不是以“default改变就非法”代替来源。

第5项是兜底检测，不能授权绕过门控的查询/异步写入，也不能依赖deep watch回调顺序来保证reader安全：reader自身须同步复核，且消费者不得缓存carrier跨操作使用。当前源码直接props消费者仍必须按第2/3项接入，这一组精确target是配置confirm/setCondition、Component查询/props引用watch、Select请求/排队入口和dvMain外参入口；不需改权限/全局Store体系。

### QOBS-ASYNC-01：已冻结的维护者语义

维护者已直接裁定“重新请求核对 C”。权威记录见[MaintainerDecision-QOBS-ASYNC-01-r001](MaintainerDecision-QOBS-ASYNC-01-r001.md)，完整调度oracle见[Fixtures r002](QuerySingleSelectObservationResolutionFixtures-r002.json)。

当同raw、同设计revision、最新requestId仍匹配的成功枚举响应不包含用户已选择的C时：

1. 首次响应不得清除/覆盖C、改写设计配置、接受新options或触发过滤查询；保留此前已接受options。
2. 立即发出一次且仅一次额外枚举请求核对C。总计两个枚举请求，不触发额外过滤刷新；核对期间loading保持true。
3. 核对成功且含C：接受核对options，C继续显示为有效；成功但仍不含C：接受核对options，C继续显示并标记无效。两者均不清除C或写回设计配置。
4. 核对失败：保留C与此前options，将有效性标记为未核实；结束loading且不自动重试。仅成功核对结果可断定C不存在。
5. 核对响应同样复验对象/raw/designRevision/token/request身份；过期任务不得写入。Carrier与设计revision不变。

验证范围包含异步时序合同，不代表已在Vue/Product运行时执行。用户再次选择、对象替换或其他identity变化仍由OBS-01既有token门控拒绝旧响应。以上策略精确落实维护者选择，不扩大为通用重试框架。

## OBS-02：缺sidecar先失活、再原恢复

候选发布过程明确分成准备、屏障、原恢复、开放四步，只有恢复原功能成功的路径承诺下述完整结果：

1. 先计算目标index并读取原历史对象sidecar，再复制/校验供恢复的完整历史内容；不提前移动指针。sidecar有效性检查在临时数据上完成，不能修改当前root或登记有效carrier。边界undo/redo立即no-op，连token也不失效。
2. 缺sidecar、epoch不符或其重建失败时，**在移动指针和任何原setter之前**同步撤销本session全部新能力token，phase=invalidated，carrier reader永久不可用，直到新的明确受控会话。该失活不清root、不删快照、不禁止普通保存。
3. 正常执行原全根恢复与身份保护字段规则、curComponent重绑、一次指针移动及原styleChangeTimes/disableTime规则；保留原snapshotChange一次及仅在原cache条件满足时snapshotChangeToView一次。不得追加snapshot，不加入confirm预览。无sidecar时整个过程及之后reader都不可用，旧carrier绝不能短暂复活。
4. 有效sidecar时，先准备新root对应Capsule；进入restoring屏障并撤销旧token，reader在所有setter/选中引用重绑期间不可用。原root/样式/视图/track/jump及选中引用完成后，发布新单调设计revision的Capsule，再开放reader，最后发原事件。观察到的合法carrier只有旧root/旧carrier、unavailable、新root/新carrier三种。

恢复目标本身无法复制或原setter抛异常不是“sidecar缺失”：前置准备失败不得移动指针；发布开始后异常保持新增能力失活并传播实际错误，不声称原多Store具有回滚事务，也不自动回滚已经发生的普通状态。该异常分支不在本稿成功恢复oracle内，需后续实现验证实际失败面；不能以尝试恢复产生了完整最终结果来宣称通过。

这是一项明确候选失效政策：保留原撤销/普通保存，放弃无证的新能力，非旧历史迁移。需独立Review认可后才能绑定产品target；本稿没有修改snapshot代码。

## 完整fixtures与验证要求

15条调度oracle（r002保留001–011并将012细化为四个完成分支）包含完整状态投影、事件token及预期状态。001合法C；002旧确认tick；003同ID不同raw；004过期request finally；005跨epoch；006外参X保design；007未登记写入失活但保用户root；008缺sidecar、009坏sidecar均失活后原恢复；010有效sidecar中途reader不可用/末态rev3；011边界no-op；012A–D分别覆盖一次额外核对、核对含C、核对缺C及核对失败。

008–010额外列出读者在指针前、root setter后、emit前的可观察结果。Fixtures里的queryEmits/事件计数是本调度合同投影，不是实际SQL/网络次数；普通保存标记只意味着未改变原入口，不表示保存内容验收。8个完整JSON对象按内容SHA在同文件复用，所有引用可独立递归展开，非省略或外部补值。

构造自检：12条可解析；8对象解引用摘要匹配并与去重前完整cases相等；旧任务案例完整state不变；runtime C/X carrier不变；缺/坏sidecar无carrier且指针正确、原事件各一次/无snapshot追加；有效恢复设计revision3且中途读不可用。未执行Vue/Store/Promise真实调度或权限。

后续独立验证至少需要真实Vue挂载与可控deferred枚举请求：旧then/finally跨组件替换、同ID重建、旧nextTick确认、当前用户选择早于响应；在恢复各setter边界安排同步reader，核验无sidecar失活顺序及有效sidecar屏障；同时验证原undo全根/redo尾/事件次数。不能只调用已通过纯模型替代这些观察。

## 声明上限与后续

本轮把OBS-01从笼统“可能有旧引用”缩到真实Promise/default写入路径，提出完整可审门控；OBS-02给出了具体保留原功能的失活顺序。QOBS-ASYNC-01已由维护者裁定；产品Builder仍需独立增量预审及Goal列明的其他实际准入门槛。当前12例不是产品GREEN，CREATE纯模型127项也不能覆盖这些路径。Goal10项AC＋14项F01＋Q066/Q067＝26项不变，真实权限BLOCKED/NOT_RUN，S01不变。
