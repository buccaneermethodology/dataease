# 三角色权限控件真实UI运行证据独立验证 r001

- reviewed_at：2026-10-30T18:21:23.135740+00:00；reviewer/source：`/root/bubble_ready_validator_resumed`，非本包driver/UI采集者。
- snapshot_id：`S02-ROLE-CONTROLS-RUNTIME-EVIDENCE-VALIDATION-r001`；as_of_state：绑定的2026-10-30 18:04:06.726–18:04:09.376 UTC运行记录、十份诊断和一张原图，driver已结束。
- **新真实UI证据交付首次第1/3轮**。本轮只评这个新运行包，不重评Slice A实现；其累计3/3已结束并保持预算耗尽，不把本报告用作实现第4轮或新一套三轮。
- 卡canonical SHA：`f3bbdfac10b222ab46b50779a74d081c93bc3da1edbcadeb15f4ef50234387e1`。接收端validate/render exit0；11处引用、10个唯一文件SHA全部匹配，写前复验无漂移。

## 裁决与可吸收范围

**BOUNDED_PASS（六组开始前控件状态的真实UI证据有界通过）；新增运行证据阻断0。**

原始driver实际调用正常`selectOption`设置三项各自deny/unknown，读取diagnostic及两按钮`isDisabled()`；六组状态均与原始记录一致，未覆盖其它两项。统一旧combobox exact匹配恰1个；全allow时实际检查copy可用；mixed时deny优先；末尾恢复三项unknown。没有新的产品源码修复要求，不要求为本包未包含的动作追加运行或机械下一轮。

本包可以补充AC-MVP-F01-05 / UI04 **start阶段“控件可分别设置、原因与按钮禁用、统一控件兼容”**的真实UI证据。**没有实际copy/paste/save点击，没有准备中撤权、未知identity或真实鉴权运行**；不能自动补齐整个AC05/UI04、P1或Goal。完整仍0/49，原38义务（P1=12、P2=26）/49内置类型、真实权限`BLOCKED/NOT_RUN`、插件installed unknown保持。

本lane未操作浏览器、HTTP或DB、未运行产品测试/构建、未修改产品源码；仅独立读取运行原件、实际看图、核摘要与离线复算。不能把“独立审阅真实运行证据”称为本Validator独立runtime重跑。

## 执行身份、driver与绑定

运行driver为`observe-role-permission-controls-r001.js`，target固定`7520752064427724800`。它先reload到networkidle，拒绝意外dialog，正常点击该target，等待fieldsReady，读取initial unknown并核旧combobox exact唯一；随后才安装getData/pageerror监听并进入六组设置。

ToolFreeze.at=`2026-10-30T18:04:03.016081+00:00`，早于startedAt=`18:04:06.726Z`。当前文件SHA、freeze SHA、事件中的driverShaStart / driverShaEnd四者一致：`1835099d8b60104a72693eb64679e8e0bbfc9d07b8723e7d0b7789e5aee0607c`。结束时间18:04:09.376Z，status=`LOCAL_UI_OBSERVED_NOT_REAL_AUTH_ACCEPTANCE`，没有failure。源文件没有copy/paste/save动作、route注入或Store直接写；输出JSON与PNG以wx写入，不覆盖旧文件，finally按精确callback移除自身监听。

admission action=builder，approved，target=`local://127.0.0.1:7070/dataeasev3/S02_MVP_Runtime_20261027`，issued_at与freeze相同。Goal / UI合同 / Context / DesignReview / topology五条摘要重算一致；Context required_read_set九条revision均一致，包含当时已build的composable/Editor摘要。它支持本次本地专用fixture控件观察的输入绑定，不是新的生产权限或源码写授权。

采集发生在18:04:06–09；绑定的Slice A实现3/3报告reviewed_at为18:08:20，**本UI采集时刻早于那份报告的完成时刻**。那份实现验证没有将此UI包纳入读集，原“新控件真实UI逐维操作本轮未观察”仍是准确的原报告范围事实。本次是新提交读集的独立审证据，不写成“实现终审之后才发生这次UI运行”，不回写旧报告或替其撤销限制。

## 六组实际控件记录与十时点不变性

| 原件case索引 | 单独设置的角色 | 状态 | 其它项 | copyReason / pasteReason | 实际DOM读取 |
| --- | --- | --- | --- | --- | --- |
| 1 | `read-source` | `deny` | 其余两项均allow | `permission_denied` / `permission_denied` | disabled / disabled |
| 2 | `read-source` | `unknown` | 其余两项均allow | `permission_unknown` / `permission_unknown` | disabled / disabled |
| 3 | `read-dataset` | `deny` | 其余两项均allow | `permission_denied` / `permission_denied` | disabled / disabled |
| 4 | `read-dataset` | `unknown` | 其余两项均allow | `permission_unknown` / `permission_unknown` | disabled / disabled |
| 5 | `edit-target` | `deny` | 其余两项均allow | `permission_denied` / `permission_denied` | disabled / disabled |
| 6 | `edit-target` | `unknown` | 其余两项均allow | `permission_unknown` / `permission_unknown` | disabled / disabled |

每次先通过旧统一select设全部allow，再通过该role唯一testid的select设目标state。driver先实际读两按钮isDisabled并校验两reason及“恰2项allow”，成立后才将case写入；不是仅把常量true当作未知DOM状态。独立从原JSON核六个(role,state)唯一组合、全量permissions及reason，与该控制流相符。

其余四时点：

- initial：三项unknown，copy/paste reason均permission_unknown。
- allowed：三项allow，driver实际检查copy按钮不是disabled且copyReason=null；pasteReason=`clipboard_empty`。**没有证明paste在allallow时可用**，因为本包clip一直为空。
- mixed：read-source=unknown、read-dataset=allow、edit-target=deny，copy/paste reason均permission_denied，支持deny优先。
- final：三项unknown，copy/paste reason均permission_unknown；该末态从原件逐值核实，不只依赖“selectOption unknown”的意图。

独立离线复算完成**108/108证据断言**（包含PNG结构/CRC断言，非产品测试数量）：initial + 6cases + allowed/mixed/final，共10份诊断的**完整source descriptor、clipboard、session**分别保持相等。每份source.tree、ownKeys、undefinedPaths完整比较；对树递归重建ownKeys与记录一致，undefinedPaths均空。树仍为AND amount>500与嵌套OR六店，非只有首叶值相同。clip全程null，session始终identityEpoch=1/editSessionId=1/revision=0；fieldsReady=true，queryObservation=null。

这些不变性只涉及实际导出的树/clip/session，不等于检查了dirty、全部Store/数据缓存、DOM实例、已保存字节或所有隐藏配置。也没有用空clip证明成功copy后的深拷贝或旧有效clip保留。

## 请求与错误窗口的精确上限

`queries=[]`的监听仅捕获path结尾`/chartData/getData`的request，且在reload/networkidle、选target、initial诊断和旧combobox计数完成后才安装。它证明**后基线的本次控件设置窗口内记录到0次getData请求**，不证明reload/初始取数也是0，不证明所有API请求总数0，不是逐组都独立计时的网络窗口。原件没有独立listener-start时间，窗口边界来自冻结driver控制流；不能补造每个case的墙钟时间。

本包从未调用copy/paste/save，因此这里的0query不能当作“点击被拒绝paste后仍0query”的运行用例；不能据此证明已发query后撤权保旧或失败保存不落库。当前driver也没有监听raw updateCanvas/find/所有Store写，不能把“没有保存按钮调用”升级成独立审计了所有业务写入。

pageErrors=[]只说明同一个安装后的pageerror监听窗口没有记录，reload之前/过程中、console/resource异常及旧ubo/C2/circle/progress问题均未由此检查或关闭。

## 单张原PNG的实际可见范围

已实际查看`RolePermissionControls-r001.png`，SHA=`88418926af4a5fb5c7ecc4b67b7008c84e18dbbabc9d4087cab5ca9b9cc45c5e`，与事件screenshot.sha256相等；PNG为1280×900、8-bit RGB，签名/各chunk CRC/zlib解码有效。

图中可见专用仪表板名称、target被选中、copy/paste按钮呈禁用状态、权限拒绝原因、统一“权限测试桩”及其deny选项，源读取角色label及部分控件。截图位于mixed状态，**后两个角色控件/诊断可能在右侧滚动区域外，不能称三项全屏可见或六状态都有截图**。六组DOM禁用证据来自原driver的逐组读取和diagnostic，不由这张图代替。

当前图表类型控件显示“基础折线图”，展示title仍“指标卡”；不能因title把它归为indicator，也不能沿早先任务假定本次仍是liquid。此包只观察该target上的共享权限控件，不证明其它type或数据oracle/量程；图上数值不作为本包新query验收。

## 全部发现、未查与同类残余

**新增blocking=0。** 非阻断发现及证据限制一次列全：

1. **RCUV-N01 / P2：Context和topology的部分语义元数据残留。** Context.acceptance_criteria_ids仍为AC-MVP-F01-01/-09，本包实际是-05/UI04；Context.topology.actual_snapshot_ref指r573，而admission与card绑定r574。其reason“root校正selector并执行，前author候选仅syntax”未在本包绑定前author/校正材料；r574自身phase仍描述role实现3/3和four-type的pre-validation，未单列这个新UI证据review。摘要全部匹配并不能证明这些语义字段准确。**本包objective、task_id、真实UI04必读合同、控件边界、driver与输出路径仍明确且一致**，没有扩大到源码/DB或其它资源，因此不否定当前六组局部观察；不能把这些旧字段当作AC01/09通过或当前lane完整topology准入证明。后续projection应准确归属AC05/实际checkpoint，保留原冻结记录不逆写。
2. **RCUV-N02 / P2：无实际动作/完整旧状态写监控。** 六组selectOption与两按钮禁用已观察，但不含点击copy/paste/save、合法非空clip、未知identity或准备中撤权。10份source/clip/session保持与后基线0getData都只证明其对应投影，不能补齐全UI04或追认全Store/dirty零写。
3. **RCUV-N03 / P2：视觉和异常只覆盖单mixed图/局部监听。** 截图裁切不影响已取得的逐组DOM读取，但它不展示全部角色或六状态；pageerror空不清除旧console/resource/SDK异常。当前截图type仅为该basic-line现场，不能推广49类型。

已检查无问题：11处主引用/Context九ref/admission五ref摘要；freeze/start/end/current driver一致和先后；正常selectOption及实际disabled读取；6角色状态独立/其余2allow；旧exact combobox唯一；allallow copy可用和mixed deny优先；末尾全unknown；10份整树descriptor/ownKeys/undefined/clip/session不变；请求监听真实起止范围与0getData；PNG结构/摘要和实际mixed可见画面；本lane与root采集者分离、未将当前证据冒充源码第四轮。

未检查及原因：本Validator未重新开浏览器/UI/HTTP/DB或运行测试；未检查实际copy/paste/save、准备中撤权、未知identity、非空clip保旧、全部canonical/dirty/缓存/实例、全部3locale的浏览器显示、真实账号权限与后端允许/拒绝、49类型或完整P1/Goal终态。原因是该新交付明确只含start阶段控件观察，这些既没有本次原件，也不应被临时加成该局部包的新运行前置。

原Slice A实现3/3结论、最初失败/恢复历史及其预算全部保留。该实现无需本报告再复跑15/21或再作源码语义审查；本轮也不评价/修复已结束实现的findings。真实权限、旧C2V-005/ubo与其它未完成AC保持原边界。

## 可准入范围与下一步

可以把本包记为：**三角色独立deny/unknown的真实select控件与开始前按钮禁用、统一控件兼容、后基线无新增getData，以及安全导出投影不变**。它为AC05补入一段真实UI证据，不是整个AC05完成，也不将原实现review的“本轮未观察”改写成错误。

不要求本包凑余下2/3、3/3或追加不存在的动作。主Agent可把局部结果与原实现/组件层证据分别索引，继续原未完成义务；若需要更强的实际paste/撤权/身份声明，必须指向相应既有或后续真实证据，不能从本包推断。不得借新证据包之名重开已结束Slice A实现3/3或对其第四轮改码。

## 主输入清单

| 文件 | SHA-256 |
| --- | --- |
| `Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/Goal.final.json` | `4db931a6764a8c48345e7e8358e579550a9bc98594bf1654647716d72b9678c4` |
| `Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/MVP-20261027/UiIntegrationCases-r002.json` | `e365ef111582ef84f20f26e6136854409b7fc66bb0931cae40a9df5318036d55` |
| `Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/MVP-20261027/reviews/SliceARolePortsValidation-r003.md` | `726720f12d85ec48a459d53058351d9e7580a267f3a696fa7f08587e73d58e28` |
| `Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/MVP-20261027/evidence/RolePermissionControls-events-r001.json` | `c7d6ac0762e764ad1ab37a5acb686108feba610c48215b40f3740942f5bdc8ea` |
| `Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/MVP-20261027/evidence/RolePermissionControls-r001.png` | `88418926af4a5fb5c7ecc4b67b7008c84e18dbbabc9d4087cab5ca9b9cc45c5e` |
| `Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/MVP-20261027/runtime-state-tools/observe-role-permission-controls-r001.js` | `1835099d8b60104a72693eb64679e8e0bbfc9d07b8723e7d0b7789e5aee0607c` |
| `Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/MVP-20261027/evidence/RolePermissionControlsToolFreeze-r001.json` | `d3f6223e6b797005e1b88e6450301fb5d22e34150bcfc4259317bba3e7cfd33a` |
| `Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/planning/ContextBootstrap-RolePermissionControlsRuntime-r001.json` | `79cfedb3bc8e0b0b89bcd5b28a0fbfd4e13666b0dc9cd4bcf3dfe6169baeb34e` |
| `Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/planning/role-permission-controls-runtime-admission-r001.json` | `45e0594805c3c4af623daa4d47706d3708c8d2f12ce95120c0387f29a9de2ab9` |
| `Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/planning/Topology-actual-r574.json` | `ae94415311da84c84989f93cb16c26d6db7fcdc0052498d7b49718a0b2f352e5` |

写前主输入及Context/admission引用未漂移，输出原不存在；仅新增本报告。未修改共享Dashboard/旧review/Build、源码、合同或冻结原件。本文不构成最终KB/full-diff/post-closeout或Stop Gate终态绑定。
