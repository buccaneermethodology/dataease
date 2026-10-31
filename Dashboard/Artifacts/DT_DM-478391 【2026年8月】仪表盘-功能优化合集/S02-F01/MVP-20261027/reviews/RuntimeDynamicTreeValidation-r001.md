# 合法动态日期复制禁用局部证据独立审查 r001

- reviewed_at：`2026-10-30T07:14:17.291450+00:00`。
- snapshot_id：`S02-RUNTIME-DYNAMIC-TREE-VALIDATION-r001`；as_of_state：绑定RuntimeDynamicTreeRejection-r001证据与Topology-actual-r544，完整MVP-UI-06未验收。
- reviewer：独立Validator `/root/bubble_ready_validator_resumed`；Builder `/root`；本证据交付物累计 **第1/3轮**，不重置其它交付物预算。
- verdict：**正常UI生成的date/今年活动动态条件、复制入口disabled/unsupported_tree、旧完整500剪贴板不变、限定copy/edit窗口未观察getData请求，以及退出后保存snapshot完整500树/amount轴读回的局部证据有界通过；新增阻断0。**

本轮独立读取并重算已有事件和HTTP响应，未操作UI、运行应用/测试/构建、写DB或改源码/共享Dashboard。独立日志复核不是独立runtime。未强制点击禁用copy，不声明实际copy调用后的拒绝、完整复杂结构矩阵或真实权限通过。

## 范围、合同与输入绑定

原始委派限定本S02正常FilterTree UI把静态source临时改为合法动态日期，核专用复制入口禁用、旧clip保留、不save，正常退出丢弃并读回。独立真实30min context不在本包，不读取、不触碰，也不借其状态补TTL结论。

原38义务（P1=12/P2=26）、49内置类型完整分母保留，**0/49完整验收**、真实权限 **BLOCKED/NOT_RUN**、插件installed **unknown**不变。直接追溯：AC-MVP-F01-02的复杂结构明确拒绝及AC-MVP-F01-03的有效clip保留→MVP-UI-06局部；入口状态辅助关联AC11。原MVP-UI-06全部静态/复杂案例不因本样本关闭。

card canonical SHA `4747240e0ab9b2dd9e83a566ced1adb1f5444de8d3500a239b201d8a4fb32417`，接收及写前SP010 lane_task_card.py validate均pass/exit0；接收端renderer stdout完整消费，exit0。卡mode为full_baseline，所有Goal/refs原字节摘要逐项匹配。

| 绑定输入 | SHA-256 |
| --- | --- |
| `Goal.final.json` | `4db931a6764a8c48345e7e8358e579550a9bc98594bf1654647716d72b9678c4` |
| `RuntimeDynamicTreeRejection-r001.json` | `4caab9e64ce2e3b59d35e1c422f08112ee90644aea2d40a125e6458b5b91ecab` |
| `RuntimeDynamicTreeRejection-events-r001.json` | `dae62b0eb451b7b71fd947b991a1308856e5db82843aa51d36a1bdd375426212` |
| `UiIntegrationCases-r002.json` | `e365ef111582ef84f20f26e6136854409b7fc66bb0931cae40a9df5318036d55` |
| `runtime-dynamic-tree-admission-r001.json` | `74eef3bd165ba333ede85cdc0d87e33c96f4dd8f13aef04c801ba14cc69bda1a` |
| `Topology-actual-r544.json` | `e9cd4fd50173533f00201e09e691d712ca96621cb6f5473d6c34a6b8106220f0` |

Read Manifest：卡全部执行要求及声明上限、摘要全部字段、raw四事件/requestsDuringCopyEdit/restore/driverFailures、findById完整request/body、admission/topology与其ContextBootstrap的原始意图/本轮目标/写排除、Goal AC02/03及MVP-UI-06；复用已读SGE kernel/validation/baseline规则和forbidden_claims文档的证据边界。admission的goal/completion_contract/context/design_review/topology五条依赖SHA均匹配。

当前源码只读交叉核对：

- `core/core-frontend/src/custom-component/filter-copy/mvp-chart-filter-copy.ts`：`9f4eca86173318b7b964648d216fd7a6c153b41abce9eda12f8f6e9fc6944b82`。
- `core/core-frontend/src/views/chart/components/editor/filter/useChartFilterCopyMvp.ts`：`658027b89e327a6bfa65481f7fd5f43a19b048c15427cd16207f8048773204a8`。
- `core/core-frontend/src/views/chart/components/editor/index.vue`：`0a9b782b8b72f3f6ac95148187d49e09a8d24f1610ea43b18e9e7002db06d5ee`。
- `core/core-frontend/src/views/chart/components/editor/filter/auth-tree-chart/RowAuth.vue`：`ebef31245e8525d82e6c82dbe4e83c313b74f1d9af8bae5e7d76b788eba0e775`。
- `core/core-frontend/src/views/chart/components/editor/filter/TimeDialog.vue`：`5ca966f4db04bfac192325832fdb5ff36f9a03dcbfbf27a6c223a3c7a8f42dea`。

工作区保留大量既有修改；本报告写前不存在，本轮仅新增指定review，不暂存、不提交、不改旧输入与其它报告。最终closeout/KB/Dashboard/full diff/reconciliation及Stop Gate均不是本轮判定面。

## 全部样本与结构复算

raw共有4事件，时间严格递增，recordingStopped=true。三个source加两个非空clip，共 **5份树描述**：从tree逐节点重建ownKeys，按undefinedPaths补回序列化未携带的undefined属性后，与每层记录键集合一致；没有把missing/null/undefined合并比较。

| 事件（UTC） | 独立复核结果与上限 |
| --- | --- |
| copy_valid500 07:02:50.538Z | source与clip的tree/ownKeys/undefinedPaths完整相等；500和嵌套or六店枚举，field:null/valueType:null及六null动态占位全部保留；clip.tableId=1312472054565572608、createdAt=1563027.300000012、revision2；session5/5/revision2；fieldsReady=true、copy/pasteReason=null |
| dynamic_date_source_disabled 07:06:01.227Z | 首叶fieldId=1793083721147（正常UI date）、term=eq、filterTypeTime=dynamicDate、timeValue=今年、relativeToCurrent=thisYear；copyDisabled=true、fieldsReady=true；copyReason/pasteReason均unsupported_tree；整个旧clip及session与初始完全相等；requests=[] |
| discarded_exit 07:07:20.986Z | URL `#/panel/index?dvId=1312476889213964288` 且editorCount0，支持正常实际离开编辑器，不是仅hash导航推测 |
| restored_static500 07:07:24.307Z | URL为同资源dashboard，source完整descriptor与copy_valid500相等；clipboard=null、pasteReason=clipboard_empty、fieldsReady=true、dialogs0；session7/7/revision2，仅为本采样时点 |

复制到动态采样墙钟相隔190.689秒，仅是时序关系，不当单调TTL证据。clip完整相同包含原500树、ownKeys/undefined、tableId、createdAt、revision；非仅阈值或摘要相同。

### 动态日期的原生结构与正常归一化

活动动态叶记录：filterType=logic，fieldId为date字段，term=eq、value空串、timeType=year，dynamicTimeSetting为relativeToCurrent:thisYear、timeGranularity:year、timeNum:0、relativeToCurrentType:year、around:b、arbitraryTime:"2026/10/30 00:05:23"，timeValue为“今年”。它是本次正常UI产生的动态表达，不是只有空value的畸形静态比较。

TimeDialog的year粒度原生提供thisYear/今年；RowAuth的getTimeValue同样映射，动态日期要求非空timeValue。真实UI生成的对象与该正常模型一致，未以手工制造缺字段/畸形树代替动态负向样本。**这只确认合法编辑形态与MVP禁止复制的边界，不证明后台动态日期查询语义**，本次没有提交查询。

源首叶由amount>500切为date今年，field/valueType null键经编辑器归一化移除；group的fieldId从null变空串、field/valueType移除、dynamicTimeSetting从六null变空对象、新增timeValue空串；嵌套枚举leaf移除field/valueType、timeValue为undefined（ownKeys存在，undefinedPaths=`$.items.1.subTree.items.0.timeValue`）。嵌套or和六店枚举继续在源树中。

这些是source编辑态变化，不是clip发生损失；旧clip保留原六null动态占位和null键、没有新增timeValue。不能为了说明拒绝而忽略source归一化，也不能从此一例推广所有复杂结构均有相同序列化行为。

页面文本同时记录“存在不支持的过滤结构或动态条件”和之前copy成功留下的“过滤条件已复制”。后者不能解释为动态树已成功复制，也不能由旧成功文案推导一次新copy调用；诊断和disabled记录明确对应当前unsupported_tree。

### 请求观察与未执行调用

本包与前一个response observer样本区分：卡明确这里是 **主page request observer**；`requestsDuringCopyEdit=[]`，动态事件局部requests也为空。可以说限定copy/edit观察窗口未记录getData请求，不能把它写成整个恢复阶段无请求。恢复findById及重开数据加载在该窗口之外。

这也不等于强制copy调用后的dispatch0：禁用入口未被强制点击、queryObservation均为空，观察器没有给出所有页面/上下文或网络失败的完整审计。不能用“零请求”替代实际失败copy返回值、失败paste无target变更或后台鉴权验收。

### 退出后真实保存snapshot读回

有一条实际HTTP记录：07:07:21.175Z，POST `/api/dataVisualization/findById`，HTTP200、body.code0。request.id=response.data.id=`1312476889213964288`，busiFlag=dashboard、source=main-edit、**resourceTable=snapshot**。

保存snapshot的canvasViewInfo主图 `7520741153101058048` 为symbolic-map，tableId=`1312472054565572608`；customFilter与copy_valid500.source.tree逐项完整相等。extBubble恰含amount字段id=`1793083721146`、summary=sum、deType2。重开UI也读到原完整500树、clip空、dialogs0。

这是本轮新时点保存配置事实，**不追认此前跨dataset包中extBubble0的旧样本**，也不在本包审结金额轴修复或证明气泡/金额已实际渲染。旧8100未包含SymbolicMap明细修复的边界继续；保存配置和主图UI文本不能替代新8110明细证据或完整地图验收。

“不save、正常退出丢弃”是Builder行动说明，保存snapshot完整树和退出DOM0相符；本包不是全量save请求或DB写审计，不能声明全程绝对零写。dialogs0只说明07:07:24.307Z采样时无对话框，不保证未来无异步草稿提示或无限期稳定。

## 全部发现

**新增阻断：0。** 输入和admission绑定一致，动态对象符合正常UI模型，copyDisabled与unsupported_tree明确，旧clip完整保留，限定请求窗口空，保存snapshot和重开诊断支持本轮局部恢复判断。

**非阻断N1：禁用与拒绝调用层级。** 本次只证明入口禁用/理由，未强制点击。实际copy拒绝、全部失败copy保留、失败paste保target不能从此推广。

**非阻断N2：网络窗口与静态查询边界。** request观察仅主page copy/edit，不含恢复或独立TTL context；不当所有上下文dispatch0。合法动态编辑没有后端执行，本包不验动态SQL/日历语义。

**非阻断N3：恢复/配置上限。** 新snapshot有500完整树与amount轴；未保存说明没有全程写审计，恢复dialogs0仅当前时点，金额轴配置不等于实际可视渲染/明细修复。与旧缺轴/旧8100样本分别保留。

**历史driver问题及恢复分开保留：** raw记录“field popup render delayed, waited for actual visible menu”和“initial label动态 was incorrect; actual i18n option动态值 selected”。后续实际生成date/thisYear对象和禁用状态是恢复观察；不删除初始延迟/选择错误，不把第一次错误标签当产品功能失败，也不宣称第一步即成功。

**未知/问题：** 系统参数、空组、未知非兼容键、畸形subTree、静态日期合法copy/paste、完整missing/undefined/null/空串/[]/{}跨运行及JSON边界、失败paste保旧target、真实权限/所有复杂结构均未由本包覆盖。

## 已检查无问题、未查原因、残余与准入预测

已检查无问题：Goal/5refs及admission依赖摘要、全部4事件时序、5份tree/ownKeys/undefined、初始多条件全树及旧clip完整不变、活动dynamicDate/thisYear/今年、正常UI模型对应、fieldsReady/实际按钮disabled的Builder采样/unsupported理由一致、主page copy/edit请求列表空、实际退出DOM0、findById请求/响应同资源/主图/snapshot身份、完整原树和amount轴、重开clip空/dialog0、driver失败及恢复分别保留、旧8100/TTL独立context边界。

未查：独立UI重跑、强制调用禁用入口、全网络/DB审计、后台动态日期查询、所有复杂结构/字段兼容/类型/入口、真实权限和独立30分钟context；本卡只允许只读复核该局部证据，相关原始观察不在包内。未测试、未构建、不用静态代码填运行PASS。

同类残余保留完整MVP-UI-06/AC02/03、原38义务、49完整验收、真实权限、插件未知以及所有前述复杂结构和既有地图明细/画面问题；本轮不自动关闭，也不改冻结合同状态。

**准入预测：** 可绑定为“一个正常UI合法动态日期source的复制入口明确禁用，旧完整clip保留、限定copy/edit窗口未观察getData请求、退出后保存snapshot回原500树及amount轴”的局部独立复核。无需修复后才接纳这个观察，也无需为了绿色结论机械发起下一轮；继续原合同尚未覆盖项。

当前不能声明实际调用拒绝/所有复杂结构通过、独立TTL通过、真实权限、完整MVP、49/49或Goal完成。本报告不是最终closeout或Stop Gate终态凭据。
