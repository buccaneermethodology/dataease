# 跨数据集禁用局部真实 UI 证据独立审查 r001

- reviewed_at：`2026-10-30T06:56:39.034538+00:00`。
- snapshot_id：`S02-RUNTIME-CROSSDATASET-VALIDATION-r001`；as_of_state：绑定的RuntimeCrossDataset-r001证据包与Topology-actual-r540，完整MVP-UI-05尚未验收。
- reviewer：独立Validator `/root/bubble_ready_validator_resumed`；Builder `/root`；本交付物累计 **第1/3轮**，不重置其它包预算。
- verdict：**已知两个dataset ID不同、字段ready、粘贴入口disabled且理由dataset_incompatible、两时点树和clip不变，以及退出后保存snapshot读回符合原fixture的局部证据有界通过；新增阻断0。**

本轮仅只读独立复算Builder事件和真实findById响应，未操作UI、启动服务、写DB、改产品/测试/共享Dashboard；日志复核不是独立runtime。禁用入口未强制点击，不能称实际paste调用后被拒绝。getData响应观察器为空，不能升级为request/dispatch0。

## 原始范围与冻结输入

卡限定复制S02 source后，正常UI把本仪表板indicator临时选为本地官方Demo dataset，核ID不等/禁用，退出不保存恢复；不保存图表、不修改任何dataset、不使用或写入S01。原38义务（P1=12/P2=26）和49内置类型完整分母不变；**0/49完整验收**、真实权限 **BLOCKED/NOT_RUN**、插件installed **unknown**继续。本报告没有Scope Delta或完整case晋升。

card canonical SHA `c4fef05faa485fb47df9fb3d17631ac1a5d31c867f8b4cfc67d5c679ddd6b555`，接收及写前SP010 lane_task_card.py validate均pass/exit0；接收端成功render并完整消费stdout。卡machine mode为full_baseline，以下绑定输入全量独立重算匹配。

| 绑定输入 | 原始字节SHA-256 |
| --- | --- |
| `Goal.final.json` | `4db931a6764a8c48345e7e8358e579550a9bc98594bf1654647716d72b9678c4` |
| `RuntimeCrossDataset-r001.json` | `4a9bcdfd0b8534921f9c5effc8d42bcfb0489f9fbdfa7b0039bef0710d7287b1` |
| `RuntimeCrossDataset-events-r001.json` | `b84eb47f05221ecfc67ff89e2ec21c0cb2d57b3015f907d0ee758931901f1f89` |
| `UiIntegrationCases-r002.json` | `e365ef111582ef84f20f26e6136854409b7fc66bb0931cae40a9df5318036d55` |
| `runtime-crossdataset-admission-r001.json` | `f6e72e3625172cd9eefc6c7169a3080b1d5301d57e0e330359672b8c204786c4` |
| `Topology-actual-r540.json` | `0bedc2ea1d366894db0fcc6507f477ef8a337114c2450c1f1aff9df4e9365e8c` |

Read Manifest：卡全文及execution_command、全部摘要与raw六事件/queries/restore/driverFailures、findById的request和body（含canvasViewInfo/componentData）、admission/topology全文及其ContextBootstrap有关原始意图/目标/write_scope/禁止动作、Goal AC-MVP-F01-04、MVP-UI-05合同；复用已读项目SGE kernel/validation/baseline规则和卡forbidden_claims文档的声明边界。admission的goal/completion_contract/context/design_review/topology五条依赖摘要均匹配。

静态读取下面三个当前源码，仅核入口与guard对应：

- `core/core-frontend/src/views/chart/components/editor/index.vue`：`0a9b782b8b72f3f6ac95148187d49e09a8d24f1610ea43b18e9e7002db06d5ee`。
- `core/core-frontend/src/views/chart/components/editor/filter/useChartFilterCopyMvp.ts`：`658027b89e327a6bfa65481f7fd5f43a19b048c15427cd16207f8048773204a8`。
- `core/core-frontend/src/custom-component/filter-copy/mvp-chart-filter-copy.ts`：`9f4eca86173318b7b964648d216fd7a6c153b41abce9eda12f8f6e9fc6944b82`。

主要追溯为 **AC-MVP-F01-04 → MVP-UI-05**（每次paste核实际dataset ID及完整字段兼容）；入口禁用/理由关联AC-MVP-F01-11。本卡列通用06/08/12，报告补直接crosswalk，保留原条款，不修改冻结卡。

工作区存在大量既有修改；本报告写前不存在，本轮仅新增指定review，不暂存或提交。最终closeout/KB/Dashboard/full diff/reconciliation不在本轮判定面，不能由本局部review替代。

## 全部事件与独立复算

raw共6事件，时间严格递增，recordingStopped=true。五份source、四份非空clipboard，共 **9份完整描述**：从tree重建所有对象/数组ownKeys，与记录逐节点逐键相同；undefinedPaths均为空。完整树包含amount>500、嵌套or六店枚举、field:null/valueType:null、dynamicTimeSetting六null键，未用单阈值或摘要代替全树。

| 事件（UTC） | 复算事实与边界 |
| --- | --- |
| source_copy 06:42:47.963Z | 完整source与clip tree/ownKeys/undefinedPaths相等；clip.tableId为字符串1312472054565572608，createdAt=360458.3000000119、revision1；session1/1/revision1，fieldsReady=true，copy/pasteReason均null |
| target_before_dataset_change 06:42:48.121Z | 目标过滤树诊断与初始500树完整相等；clip/session不变，fieldsReady=true。此事件没有单列目标tableId，不能假装得到一份前置目标dataset HTTP读数 |
| cross_dataset_disabled_before 06:47:17.797Z | 目标DOM选择树key记录为字符串985189053949415424、名称“茶饮订单明细”；字段ready、pasteDisabled=true、pasteReason=dataset_incompatible；copyReason=field_incompatible；wireCount0 |
| cross_dataset_disabled_after 06:47:19.309Z | 同一目标dataset ID，间隔 **1.512秒**；整个diagnostic与before完全相等，包含source、clip、session、fieldsReady和理由；pasteDisabled=true、wireCount0 |
| discarded_exit 06:48:26.531Z | URL为 `#/panel/index?dvId=1312476889213964288`，editorCount0，支撑实际退出而非仅hash文本替换 |
| target_restored 06:48:30.332Z | datasetName回S02_MVP_Runtime_20261027，source完整500描述与初始相等；clipboard=null、pasteReason=clipboard_empty、fieldsReady=true、dialogs0；session3/3/revision1，仅代表该采样时点 |

四个离开前事件的整个clip全量相同，createdAt/revision不变；source描述也完整相同。两次目标dataset ID `985189053949415424` 与clip `1312472054565572608` 按完整字符串比较确实不同，未转换为可能失真的JS数值。fieldsReady只证明诊断就绪，不证明该目标的所有字段ID/type/operator均已独立核全。

这里diagnostic的source是所选图表当前过滤树描述，不等于原source图表身份。目标临时换dataset后仍带旧树，copyReason=field_incompatible与之相符；pasteReason先命中dataset_incompatible。不能把这一组合扩写成缺字段负向case、全目录兼容矩阵或部分应用后回滚已经实测。

### 网络观测和保存snapshot读回

`queries=[]`、两次wireCount均0，卡明确该收集器是 **response observer**。只能说相应观察窗口未记录到getData响应；未记录的在途、失败、被取消或窗口外请求无法排除，也没有独立request列表、dispatch计数和force paste调用。因此不能写query/request/dispatch0或“实际调用拒绝且无HTTP”。选dataset的正常取数也不能计为paste候选查询。

另有一条实际恢复响应：

- at `06:48:26.738Z`，POST `/api/dataVisualization/findById`，HTTP200、body.code0。
- request.id及response.data.id均为 `1312476889213964288`；请求busiFlag=dashboard、source=main-edit、**resourceTable=snapshot**。
- response.canvasViewInfo的indicator `7520752064427724800`，tableId为 `1312472054565572608`，customFilter与target_before_dataset_change.source.tree逐项完整相等。componentData亦包含此indicator组件。

ContextBootstrap明确临时target为本S02 indicator；在该fixture背景下，响应支持目标原dataset及完整树的保存snapshot读回。前置事件没有单列目标tableId，故“恢复原dataset”并不是两份独立前后持久HTTP数据全量对账；是新snapshot ID与既有fixture/clip来源ID相符，并且完整filter有明确前置树比较。

未保存和正常退出丢弃是Builder行动说明，退出DOM0与保存snapshot结果相符；raw不是所有save请求/DB审计的清单，不能据此证明整段过程绝对零写、其它dataset或S01均经独立审计未变。dialogs0只说明06:48:30.332Z无对话框，不保证之后没有异步草稿提示，也不作无限期稳定恢复结论。

### 静态实现与本样本对应

editor/index.vue的专用粘贴el-button以 `!!filterPasteReason` 绑定disabled并显示理由；composable computed pasteReason调用checkMvpFilterTarget。后者在字段ready后按有效实际tableId且与current.clip.tableId严格相同检查，不符返回dataset_incompatible，再进入字段兼容循环。实际paste函数还会重查reason；**本次未强制调用该函数**，静态guard顺序不能替代运行拒绝验证。

保存snapshot中的symbolic-map source（7520741153101058048）extBubble为0，金额轴既有缺口明确继续。过滤树/字段目录可用于本次dataset禁用观察，但不证明源图已经可正确取数、显示金额、tooltip/气泡或完成地图验收。

## 全部发现与历史保留

**新增阻断：0。** 卡/输入/admission未漂移，两个实际ID不等、禁用/理由/ready一致、两时点完整clip及树不变，保存snapshot读回符合指定局部判断。

**非阻断N1：验收映射投影。** 直接AC04→UI05及入口AC11应在后续正常台账显式标明；无需改冻结卡、缩减原分母或重复本样本。

**非阻断N2：网络和调用层级。** response observer空列表不代表request0，禁用未点击不代表实际调用被拒绝。摘要已明确这些限制，按有界措辞接纳。

**非阻断N3：目标恢复基线/审计上限。** 前置目标tableId未直接单列；新保存snapshot完整树可比对、dataset与已知fixture相符。正常不保存/不修改dataset/S01属于行动范围，不把该包当全程零写审计或未来稳定恢复。

**非阻断N4：地图源另有配置残余。** symbolic金额轴未配置，不能用本次禁用样本为源图可视/取数背书；按既有独立修复入口处理，不混入本包验收。

raw driverFailures保留两条初始驱动失败：“wrong ed-select selector: actual dataset control is input/popover”；“official Demo branch initially collapsed; expanded exact tree node before selection”。随后记录了明确985189053949415424选择和两次禁用诊断，作为分开的恢复观察；不覆盖最初失败、不将错误selector认成产品缺陷，也不假装第一步已成功。

**未知/问题：** 未观察强制paste调用、未完整捕获request/dispatch、没有所有字段类型/运算符/未知dataset负向case、缺前置目标tableId独立读数及全段写入审计。均不由静态代码、response0或DEV身份补PASS。

## 已检查无问题、未查原因、同类残余与准入预测

已检查无问题：卡/Goal/5refs及admission依赖摘要，全部6事件时序、9份tree/ownKeys/undefined描述，完整字符串ID不等、字段ready/真实按钮disabled的Builder采样、理由一致、1.512秒两时点完整diag/clip不变、实际panel DOM0退出、findById请求/响应身份/status/code/snapshot层及目标完整树、恢复时dialogs0/clip空、初始driver失败保留、source金额轴及网络证据声明上限。

未查：UI独立重跑、强制点击禁用入口、完整网络/DB审计、官方Demo内容/实际字段目录全量核验、真实权限、所有类型/入口/兼容矩阵；卡限定只读审查局部新证据，且缺相应原始观察。未运行测试或构建。

同类残余：dataset未知/缺失、同名不同ID、字段缺失/deType变化/count/-1/计算字段、目录loading/error、合法target轴不含引用字段、picture-group实际目录路径、失败无target改变、完整MVP-UI-05/AC04、38义务、49完整验收、真实权限及插件未知全部继续；本包不关闭它们。

**准入预测：** 可以绑定“临时选定不同dataset，字段ready后粘贴入口禁用，两个采样时点完整过滤树/clip不变，退出后真实保存snapshot读回符合原fixture”的局部独立复核。无需修复后才接纳该观察；下一步继续原合同未完成项，无需机械第2/3轮。

当前不能声明实际拒绝调用/dispatch0、完整字段兼容、真实权限、完整MVP、49/49或Goal完成。本报告只提供本样本证据绑定，不是最终closeout或Stop Gate终态。
