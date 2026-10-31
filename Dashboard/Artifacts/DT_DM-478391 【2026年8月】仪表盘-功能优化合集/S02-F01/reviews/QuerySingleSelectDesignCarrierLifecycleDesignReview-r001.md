# design carrier 生命周期独立语义审查 r001

## 双结论

- **Design Freeze Validity：PASS_WITH_BOUNDS_FOR_SOURCE_LIFECYCLE_ANALYSIS**。来源链、保存隔离不变量和候选时序可作为后续设计输入；不是完整产品生命周期实现合同已冻结。
- **Implementation Entry Readiness：NOT_READY_FOR_CURRENT_PRODUCT_TARGET**。本稿未给出载体持有者、精确发布action和新路径历史失效规则，因此当前尚无可直接交Builder的产品target。原因是02C及子集自身一致性缺口，**不是02A/02B永久阻断所有Builder**。
- 存在可进一步冻结的安全子集：仅新建文档中的新建VQuery，经用户完整配置确认建立新的设计基准；仅对已受管组件的后续明确设计确认更新。它不必恢复旧历史原意，也不必等待真实权限。但须先补下面列出的很小、具体的子合同，不能将“安全方向”当已准入。

## 接收与证据

父流程授权后复验review card canonical `400338cecba4da42034ca5c36d256bf25abd9b028aca51e6dacfe0325239cec2`，SP010 validate pass、exit=0；Context validate退出0，全部引用摘要一致。绑定Topology-109与QE2E/QCARRIER验证边界；不把dispatch或既有离线PASS当生命周期实现证据。仅写本报告。

## 02A/B/C逐项裁定

| 项目 | 成立依据 | 实际阻断范围 |
| --- | --- | --- |
| 02A 加载来源 | 外参可改默认并被当前保存序列化，旧持久JSON未必能恢复原A/D | 阻断“自动把任意旧加载对象认定历史原设计”；不阻断新建组件的明确用户确认形成新设计基准。旧文档中确认可定义新的基准，但不得谎称恢复旧意图，且须单独冻结更新边界 |
| 02B 无carrier历史 | snapshot undo/redo恢复全根，既有记录没有carrier元数据 | 阻断无依据恢复旧carrier以及未处理历史回退却继续使用过期carrier；不要求先迁移所有历史才能开始新建子集。新建文档也可undo，因此子集仍须携带同次快照carrier，或在缺元数据回退时明确使新增能力失效且保留原undo/原保存 |
| 02C 发布/更新覆盖 | 确认先清propValue，再nextTick写两槽/记录snapshot；未给出载体action与可观察一致性机制 | 对任何会生效的新产品carrier更新均为直接前置。可只冻结一个新建/受管组件确认入口，无需先覆盖所有旧形态；但该入口必须给出原子可观察状态、revision、失败与撤销处理，不能让Builder自行设计 |

因此作者“本稿不能直接派产品Builder”在当前合同层面成立；若将标题读成“旧历史未解决就不能实现任何新路径”，则过强，以上表格为本审查的限定解释。

## 真实源码核对

canvasUtils.ts:643–657解析后调用historyAdaptor再回调；661–680在非onlyPreview模式先将组件交Store，再页面回调，确有本次外参前的捕获候选时点。该时点不能自动认证历史来源。dvMain setter保存引用，外参/联动可改运行默认字段；runtime-only应是独立对象归属，不是禁止其default字段更新。

DeCanvas.vue:97–108从组件列表新建、分配id、addComponent，为新建路径提供可定位入口；初始VQuery propValue为空，不能把空控件直接送单条件QCARRIER当设计成功。应等完整配置确认后建立基准。

QueryConditionConfiguration.vue:1591–1629确认先validate及默认收尾，1606清propValue，下一tick写cascade及propValue，随后snapshot、再下一tick预览。仅追加一个carrier setter并不能证明多个观察者看不到不一致，必须冻结发布机制；也不能捕获1606空窗。取消不发布新设计是合理约束。

snapshot.ts:97–135 undo/redo移动历史指针、恢复所选完整根并经多setter发布。不能以保存overlay规则保留最新样式来替换全根撤销，也不能认为“只做新建”就不会触发这些函数。canvasSave当前先捕获并序列化根、后异步名称检查/发送，设计要求同一捕获时点overlay并在回包校验完整payload而非仅设计revision合理；本轮未执行保存或浏览器。

## 完整时序与消费者oracle

核对十条完整state/events/expected，不将候选状态字段当已有Store schema：001/002同样外参X后carrier分别保持A/D、保存分别A/D且样式150/其他文本保留；003确认D使carrier和runtime同升revision2；004运行C不改carrier/revision；005版本错、006来源未证均保持完整现场且不发新增overlay请求；007只在额外可信见证前提下补carrier、不回放根；008明确null/NOT_READY而非执行结果；009发送捕获样式150、现场后续160和dirty保留；010取消与旧state一致。未发现这些候选之间互相矛盾。

两消费者已显式filter=[]，expected_appended_filter与expected_filter_after_call分开，关闭上轮OBS-01口径缺口。14条QCARRIER以精确路径/摘要/数量引用，不复制或替换旧oracle。此轮是静态与结构审查，不声明执行了searchQuery、Store或新状态机。

重要上限：001/002初始state已经有carrier，003也是已受管更新；它们**尚未给出新建空文档/空控件→首次确认→首次快照的完整建立流程**。origin仅假设标签，007也是假设性证据输入，不能靠这些case直接获得生产来源认证。

## 最小可执行下一步（限定子合同，不再全域调查）

冻结“新建文档、单个新建普通单选、首次配置确认及受管更新”的具体产品target，至少明确：

1. carrier物理持有者、文档/组件键、创建/销毁时机与revision/commit分配；新建入口从DeCanvas创建到confirmClick完整候选确认，空控件尚不激活。来源是受控事件而不是调用方origin字符串。
2. 将完整配置与carrier作为同一可观察提交发布的精确action和观察门控；取消/校验失败不发布，已有预览/快照次数不变。冻结具体文件/action，不能只说“在snapshot前捕获”。
3. 本子集新快照如何携带同revision carrier；若遇旧/缺carrier历史或未覆盖编辑，保留原undo和保存，明确使新增design-overlay能力失效，禁止拿旧carrier覆盖新根。该失效策略若被采用须给完整oracle，不能默认为已批准产品政策。
4. 新增从空文档首次确认A、运行/外参X、确认D、取消、undo/redo、保存捕获后样式变动的完整时序；与本稿001–010衔接。只对该子集判断原子发布与无丢编辑，不要求先解决所有历史迁移。

完成此小合同并独立审核后即可生成准确Builder card/admission；既有纯模块可直接复用，不再实现A/B副本helper。当前报告不授权修改产品，也没有把旧历史义务移出完整Goal。

## Findings与声明边界

- 当前产品准入阻断：02C未冻结实施机制，以及新建子集首次建立/历史失效oracle尚缺；可在上述单一路径补齐。
- 02A/02B：保留针对旧来源/历史的限制，不升级为全Builder禁止。
- 设计分析本身无须为这些明确OPEN伪造结果；可有界接受，不能写成完整生命周期合同已完成。

原10项Goal AC、26项must-have、16项产品义务保持；真实权限BLOCKED/NOT_RUN，S01不变。QE2E有界PASS及缺可信RED限制、QCARRIER当时包级绑定限制均不被本报告升级。DG-03、产品保存/预览/历史及Goal仍未完成。

## 被审摘要

- `QuerySingleSelectDesignCarrierLifecycleDesign-r001.md`：`43c60b0528b4d1c5e9819ef86934846170036d85d10ca0b79b19de0d4c808a22`。

- `QuerySingleSelectDesignCarrierLifecycleFixtures-r001.json`：`56b8c0525c4c35df2512db37fab0a77c47470896234ea1b1198880f7f19ec790`。
