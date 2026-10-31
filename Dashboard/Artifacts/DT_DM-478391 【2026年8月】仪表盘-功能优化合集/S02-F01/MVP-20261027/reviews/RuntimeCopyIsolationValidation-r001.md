# 复制隔离局部真实 UI 证据独立审查 r001

- reviewed_at：`2026-10-30T06:16:06.497081+00:00`。
- snapshot_id：`S02-RUNTIME-COPY-ISOLATION-VALIDATION-r001`；as_of_state：绑定的 RuntimeCopyIsolation-r001 Builder 证据与 Topology-actual-r537，完整 MVP-UI-02 尚未验收。
- reviewer：独立 Validator `/root/bubble_ready_validator_resumed`；Builder `/root`。
- 轮次：本证据交付物第 **1/3** 轮；与先前 MVP-UI-03 生命周期证据为不同包，**不重置任何已有交付物的累计审查预算**。
- verdict：**复制500后正常编辑源300的隔离，以及 DEV deny/unknown 入口禁用并保留旧clip，局部证据有界通过；新增阻断0。四步query0仅得到Builder计数一致性支持。完整失败copy矩阵、真实权限与完整MVP-UI-02未通过。**

本次任务只读审查六个Builder事件，核完整树与元数据、禁用状态、四步取数计数和退出丢弃后的原时点读回；未进行UI操作、DB写入、产品/测试/共享Dashboard修改，没有独立重跑runtime。独立日志复算与独立运行验收分别保留。

## 原范围与输入绑定

原 Goal **38 项义务（P1=12 / P2=26）**、**49 个内置类型**完整分母不变；**0/49 完整验收**、真实权限 **BLOCKED/NOT_RUN**、插件 installed **unknown**继续。局部接纳不构成Scope Delta，不改冻结case状态或原失败证据。

接收端与写前复验card，canonical SHA `f705c5d3df59c02164e4e3e29874f339f097929474da7225436e263071298ffb`，SP010 lane_task_card.py validate返回pass/exit0。接收端对同卡render stdout（exit0）并完整消费；磁盘 `runtime-copy-isolation-validation-r001-prompt.md` 仍不存在，没有伪称该文件已保存。

| 冻结输入 | 原始字节SHA-256（均独立匹配） |
| --- | --- |
| `Goal.final.json` | `4db931a6764a8c48345e7e8358e579550a9bc98594bf1654647716d72b9678c4` |
| `RuntimeCopyIsolation-r001.json` | `90beb32f75dc48c3029aff5e65af549a4e98c1f79207165370c2e59537f5ea20` |
| `RuntimeCopyIsolation-events-r001.json` | `dbb53b55a812b3584b201ca1b912800e93c54e57010720f8a06175041fd6cd20` |
| `UiIntegrationCases-r002.json` | `e365ef111582ef84f20f26e6136854409b7fc66bb0931cae40a9df5318036d55` |
| `runtime-copy-isolation-admission-r001.json` | `a6b5c0078ccbfa532970a39fbcd0f9b27b455387ed3227892a0fc19ff1331d38` |
| `Topology-actual-r537.json` | `7d94c31f7b6645ed3e0b7b032ff7ebb4deb8d25177c5e129f4eaa5afe95a6acc` |

Read Manifest：卡的全部execution_command和claim边界、Goal有关AC、UiIntegrationCases的MVP-UI-02、摘要全部字段、raw六事件全部诊断、admission/topology全文；复用已读项目SGE kernel/validation/baseline规则及 `SymbolicFreshRuntimePlan-r002.md` 的禁止升级边界。admission的goal/completion_contract/context/design_review/topology五条依赖摘要逐项一致。

静态交叉核对（没有执行其测试）：

- `core/core-frontend/src/views/chart/components/editor/filter/useChartFilterCopyMvp.ts`：`658027b89e327a6bfa65481f7fd5f43a19b048c15427cd16207f8048773204a8`。
- `core/core-frontend/src/custom-component/filter-copy/mvp-chart-filter-copy.ts`：`9f4eca86173318b7b964648d216fd7a6c153b41abce9eda12f8f6e9fc6944b82`。

工作区保有大量既有改动；本报告写前不存在，本轮只新增本报告，不覆盖、暂存或提交其它文件。本轮不审最终closeout/KB/Dashboard/full diff、reconciliation或Stop Gate；这些均不得由本局部review代替。

## 合同追溯与边界

主要crosswalk为 **AC-MVP-F01-03（同页内存深拷贝、失败保留有效clip）→ MVP-UI-02**；DEV入口状态关联AC-MVP-F01-11；丢弃并退出后的空clip仅关联AC-MVP-F01-10的局部路径。卡列06/08/12而未显式列03/11，记非阻断的投影不精确，本报告补齐直接映射，后续正常台账保留原义并补映射，无需改冻结card或重开本轮。

MVP-UI-02还要求切target、空源/动态结构/权限unknown的真实失败copy、旧clip不变且无target变更及其他完整属性检查。本批DEV deny/unknown未强制点击禁用copy入口，不能将 computed reason、按钮disabled或静态guard当成已经调用copy并被拒绝，不能将DEV桩当真实权限。

## 全量复算与结果

raw含6事件，时间严格递增，recordingStopped=true。五份source、四份非空clipboard共 **9份描述**全部复核：从序列化tree重建对象/数组路径和键集合，合并undefinedPaths后与ownKeys逐节点相符；undefined不被误当JSON中不存在。初次copy的source/clip完整tree、ownKeys和undefinedPaths逐项相同，clip没有额外timeValue。

| 事件（UTC） | 独立复核事实 | 结论上限 |
| --- | --- | --- |
| copy500，05:41:10.898Z | source/clip完整500树；tableId=1312472054565572608，createdAt=231162.20000004768，revision1；session=identityEpoch1/editSession1/revision1；fieldsReady=true；copyReason/pasteReason=null；queryCount0 | 复制后的初始观测基线 |
| source_edited300，05:41:12.183Z | 源首叶value为300，发生下述编辑器结构归一化；整个clip与copy500完全相等（tree、ownKeys、undefinedPaths、tableId、createdAt、revision），session不变；queryCount0 | 本次正常源编辑未污染已复制树，有界通过 |
| deny_disabled，05:41:12.198Z | copyDisabled=true，copyReason与pasteReason均permission_denied；源仍为完整300编辑态描述；整个clip/session与copy500相等；queryCount0 | DEV deny入口禁用且未丢旧clip；未观察实际copy拒绝调用 |
| unknown_disabled，05:41:12.215Z | copyDisabled=true，copyReason与pasteReason均permission_unknown；源300描述未再变化；整个clip/session仍与copy500相等；queryCount0 | DEV unknown同上，不是真实权限通过 |
| discarded_exit，05:41:45.555Z | URL为 `#/panel/index?dvId=1312476889213964288`、editorCount=0 | 支持此次实际退出，未直接读取退出瞬间clip |
| restored500，05:41:47.973Z | 整个source descriptor与copy500相同，clipboard=null、pasteReason=clipboard_empty；session=3/3/revision1 | 仅05:41:47.973Z原时点源500/clip空读回；存在后报异步恢复对话框，不能称稳定恢复或证明DB从未写入 |

### 正常源编辑的完整差异

源编辑不是仅把500改成300：两个leaf的field/valueType null键从序列化tree移除，并各新增timeValue=undefined（ownKeys存在，undefinedPaths明确记录）；group的fieldId由null变空串、field/valueType移除、dynamicTimeSetting由六null键变空对象、新增timeValue空串，若干属性顺序也变化。嵌套and/or、六店枚举等其余树语义仍在。

这组差异发生在source编辑态，本报告不把它当copy改变持久原树。**旧clip四次完整相等**，仍保留原500、field:null/valueType:null、dynamicTimeSetting全部六个null键、原group/leaf/enum/and/or、且无timeValue，正是本次隔离观察。不能为了证明隔离忽略source形状变化，也不能把恢复500的读回直接宣称完整编辑保存回归通过。

四次非空clip的导出诊断字段仅tree/ownKeys/undefinedPaths/tableId/createdAt/revision，没有style/axis/results/token/proxySecret键；这是该诊断投影的可见事实。实现实际clip还保留fields、identityEpoch/editSessionId，不能将诊断缺键当成完整堆内存排除证明。

### 四步无query的证据层

copy500、source_edited300、deny_disabled、unknown_disabled各自queryCount=0，raw汇总queryCountDuringFourActions=0，与摘要0一致；这四步均没有queryObservation。raw没有逐请求列表、起止网络拦截器或独立网络完整性凭据，所以本轮**只独立核对Builder计数的一致性**，不宣称从HTTP全量日志重新证明零请求，也不覆盖退出/重开阶段的取数。局部报告不得扩写成“所有copy拒绝和所有失败路径零HTTP”。

### 静态调用链对应

composable的copyReason由baseReason或树guard计算，copy函数另经baseReason和copyMvpChartFilter；因此禁用时的computed reason不能冒充执行copy后的返回结果。内存服务copyMvpChartFilter在permission/fields/dataset/tree/now guard通过后才cloneDeep(source.tree)、递增revision并替换clip；这与本批旧clip不变和复制隔离方向一致。静态顺序不替代空源、动态结构、不完整树等实际失败执行，也不能补出真实权限行为。

## 后报事实与稳定恢复边界（本轮交付前补充）

主 Agent 在本报告首次交付后提醒：`restored500` 是早采样，随后异步出现“存在未保存的修改，立即恢复？”对话框。**因此05:41:47.973Z的500/clip空只代表该时点投影，不能称为稳定恢复或证明恢复提示未出现。** 冻结raw原事件保留，复制500→源编辑300→DEV deny/unknown四步的隔离和计数结论不因此改变。

主 Agent 报告已正常点击“否”，等待dialog隐藏、再等1.2s及字段ready，产生补充 `evidence/RuntimeCopyIsolation-RestoreCorrection-r002.json`，所报SHA `85d0b1c889fa5532c5efa66ad865df8914d1767ca80d012782ed0142b63341b2`。该文件**不在本卡绑定输入内，本轮没有读取或独立复算**；它是待独立审补充，不能从消息直接升级为通过。本报告没有覆盖或改写原事件。

本次收紧发生在r001交付整理期间，未新增审查轮次、未把新r002混入r001已核输入。先前交付整理版本SHA `963aaf3a91a3326506fa0c904fe44de5dd502db736474184b347e66b8fe2dba0` 的字节已保存在任务临时备份；最终绑定应使用本报告本次修订后的实际摘要，不使用先前摘要。

## 全部发现

**新增阻断0。** 输入与admission绑定未漂移，初始500树与clip完整描述相符，源编辑后clip不变，DEV按钮状态与reason一致，退出/重开原时点读回与摘要一致（稳定恢复未验收）。

**非阻断N1：验收ID投影。** 主要映射03→UI-02，入口11及退出10为局部；卡的通用06/08/12不能取代直接映射。主Agent后续正常投影补齐即可，不改冻结卡。

**非阻断N2：零query只具计数层证据。** 保留四步Builder计数0，禁止升级为独立网络全量零请求。若完整验收要依赖该谓词，再补相应观测，不为本次有界结论强制重复UI。

**非阻断N3：磁盘prompt缺失。** 本轮renderer stdout已成功消费，卡及必要输入齐备；后续正常交付可补保存，不能倒写旧文件存在性。

**非阻断N5：早恢复采样。** 原时点读回不能支撑稳定恢复；补充r002待独立审，未混入本轮。四步复制隔离仍可有界接纳。

**非阻断N4：“深拷贝”与“失败保留”结论粒度。** 深拷贝仅观察本次源编辑的树分离；两DEV禁用样本只覆盖入口状态和旧clip保留。未强制点击、未调用失败路径，不把它们算为失败copy矩阵通过。本批summary已有相应限制，接受其有界措辞。

**未知/问题：** 没有实际禁用copy调用结果，没有空源/动态结构/不完整树的全部失败、target切换/变更观测，没有真实读/拒绝权限或组织代理身份；退出不保存是Builder行动说明，raw支持panel DOM0与恢复500，未附DB审计或save请求全清单。均保持未观察，不新增需求或外推。

## 已检查无问题、未查原因、同类残余和准入预测

已检查无问题：卡/输入/admission摘要、全六事件时序、9份tree+ownKeys+undefined描述、初始copy完整属性保真、源编辑完整差异、四次clip全量与创建时间/revision/session不变、DEV禁用/reason一致性、四步query计数一致性、实际panel退出/编辑器DOM0与source500/clip空的原时点读回、summary声明边界及当前静态入口对应。

未查：真实runtime复跑、DB操作/审计、完整网络捕获、真实权限/组织/代理、多类型和其它入口、完整MVP-UI-02失败矩阵；原因是本卡限定只读审查已运行局部样本，现有包没有这些独立观测。未运行测试或构建，不把静态源码/诊断桩升级成这些结果。

同类残余：空源/动态/不完整树等失败copy、成功替换/重复paste/不消耗不续期、切target与target无变更、真实30分钟与身份清理、38义务、49完整验收、真实权限、插件未知以及各地图/明细等既有残余都保留；此前生命周期review和其它review不重写、不重置预算。

**准入预测：** 可绑定为“本次正常源编辑后旧clip完整500不受污染、DEV deny/unknown入口禁用且保留旧clip、四步Builder计数0、退出丢弃后的原时点500/clip空（稳定恢复待审）”的独立证据复核；不需修复后才接纳这组局部观察。主Agent继续原合同未完成项，后续新增证据按影响审查。

当前不能声明完整MVP-UI-02/AC-MVP-F01-03、完整失败矩阵、真实权限、49/49或Goal完成；缺失证据和边界如上。本报告不是最终收尾或Stop Gate终态凭据。
