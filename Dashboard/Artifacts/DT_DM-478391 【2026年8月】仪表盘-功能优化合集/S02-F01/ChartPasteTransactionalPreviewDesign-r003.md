# 图表过滤粘贴事务式预览/提交合同 r003

## 交付身份与范围

- Artifact ID：`S02-F01-chart-paste-transactional-preview-contract`，r003（本交付物评审第 3 轮候选），继承 r001 的 finding 修订；独立于已完成终轮评审的 `chart-to-chart-filter-copy-product-slice` r003。
- 唯一目的：将原 Goal Q014 的“失败不修改、预览保持原状”转成可测试的候选状态合同，并判断当前调用链是否已有安全接线能力。
- 本交付物不实现产品按钮、权限服务、图表请求适配器、跨标签剪贴板或完整 F01。它只允许后续 build 一个纯事务状态模型；纯模型不能称作产品粘贴、权限或 UI 通过。
- Goal 原始分母仍为 10 项 AC、26 项 must-have、16 项产品义务，`Scope Delta: none`。本合同不改变 S01 条件或权限阻塞。
- r001 的 CTPR-001..003 已在 r002 修订。r002 Review 新增 CTPR-R2-001（成功提交后的目标树/组件错误修订与 T2 不一致）和 CTPR-R2-002（案例缺少唯一共享初始 P0 fixture）；r003 分别以完整 T2 提交状态、完整继承 CTPT-004 的保存失败状态及顶层 initial_state 修复。历史 Review 保持原样。

## 权威依据

- `Goal.final.json#/must_have_ledger/20/requirement`（`AC-F01-Q014`）：成功应用后预览 T；取消/失败不得显示成功反馈，目标与预览保持原状；只有正常保存后重开才保留。
- `Goal.final.json#/must_have_ledger/15/requirement`（`AC-F01-Q009`）：身份、数据权、编辑权每次重验；成功取数依现有服务端数据权限链。
- `reviews/ChartToChartFilterCopyProductSliceReview-r003.md` 的 R3-001/R3-002：dataset READ/source-read 必须先于本地 mutation 的安全边界不足；当前 query reject 语义违反 Q014，迟到响应 oracle 不完整。
- 不把 `AuthorityMaterialsRequestReview-r003.md` 判定为通过；AM-09 来源精确性缺口仍 open。Goal Q014 条款本身是本合同的直接权威来源。

## 现有实现事实与未知

- `editor/index.vue::changeFilterData` 立即替换 `view.customFilter`；`calcData` 派发图表请求并记录 render/calc snapshot。
- `views/index.vue` 收到编辑器事件后调用图表组件；`ChartComponentG2Plot.vue` / `ChartComponentS2.vue` 的现有计算路径会直接更新图表数据/错误态并绘制，没有给编辑器返回一个“尚未显示的暂存结果”合同。
- 服务端 `ChartDataManage.calcData()` 在取数时检查 dataset READ 并应用行列权限；它不是本地目标配置改动前的独立授权预检。
- dashboard `/findById` READ 与 `/checkCanvasChange` MANAGE/`contentId` 可用于当前资源门槛；兼容 API 的非精确 `Success`（含 `Repeat`）不能作为允许继续的结果。
- 是否存在可无副作用、每次 copy 都能复验 dataset READ 的现有 API，当前来源材料未证明；真实 XPack 权限行为仍 `BLOCKED / NOT_RUN`。不得自行新增假定 endpoint 或以 UI 显隐代替。

## 共享案例基线与候选事务状态机

所有 Cases r003 案例默认从唯一顶层 `initial_state` 开始：活动目标为 `LINE-1`；uid=`user-A`、oid=`org-A`、dashboard=`dashboard-A`、contentId=`content-v1`；target revision `7`、P0 tree/request/error/store/render revisions；组件错误为 `false/null`；snapshot/undo 计数 `4`；clipboard=`T-valid`；成功提示、保存、query 计数均为 `0`；query/renderer 为 P0；不存在 pending transaction。每个案例的 events 按顺序变更该状态，`expected` 是事件执行结束后的完整可观察状态；案例只省略与共享初态相同且未变化的字段。案例如需不同初态，必须以显式 `initial_state_overrides` 列出字段和值，不得只写自然语言前置条件。

成功 commit 将 tree、target revision、request、component error revision、store、render 同步为同一候选 T；本合同符号 `T` 表示该提交的完整状态 tuple。CTPT-007 中 `T2` 同样表示完整 tuple，不是只更新部分字段。保存失败只改变 durable-save 结果与 save attempt 计数，不回写已提交事务的目标/错误/store/render tuple。

## 候选事务状态机

符号：P0 为操作开始时目标过滤树、快照计数、已显示预览及提示状态；T 为完整合法候选树；`requestId` 是本页进程内单调递增序号，不是权限凭据。

1. **Gate：** 捕获 `{uid, oid, dashboardId, contentId, targetChartId, targetRevision, priorTreeDigest, priorPreviewRevision}`。每次粘贴前重新确认身份仍一致、资源 READ、MANAGE 返回精确 `Success`、同数据集兼容结果为真、剪贴内容有效。缺失/拒绝/异常/超时/畸形响应立即拒绝，P0 不变。
2. **Prepare：** 对 T 做完整结构、字段、容量与目标支持形态校验，并构造隔离深拷贝。到此不写目标、不记 snapshot、不触发保存、不显示成功。
3. **Stage query：** 以捕获的目标图表副本和 T 构造候选请求。服务端实际 query 必须执行现有 dataset READ 与行列权限；失败不得提交本地树或可见预览。候选 query 响应不能先行覆盖图表当前显示数据或错误态。若现有图表 API 不能隔离暂存响应，该产品接线保持 blocked。
4. **Commit：** 仅当当前 `requestId` 仍是最新、目标仍 active、uid/oid/contentId 未变化、目标 revision/digest 与捕获值一致、候选 query 成功且 response 属于同一 request/target 时，在一个提交临界区写入 T、记录恰一次 undo/snapshot，并发布该响应为目标预览；随后显示现有成功提示。此操作不自动保存。
5. **Abort：** 用户取消、任何前置拒绝、query 错误/拒绝/超时、目标切换、身份变化、内容版本变化、请求被更新的粘贴取代、响应 request/target 不匹配时，丢弃候选响应并维持 P0；不改目标、不写 snapshot、不替换预览、不发成功提示、不保存、不清除仍有效的原 clipboard。错误提示只能使用已有失败提示语义。
6. **Late response：** response 仅凭 `requestId + targetChartId + captured uid/oid/contentId + targetRevision` 匹配最新未决事务才可继续；旧请求迟到时只丢弃，不得修改当前图表数据、error 状态、目标树、snapshot 或当前目标的提示。

## 与原 Chart→Chart MVP 的依赖映射及下一步产品切片

本合同是独立的新问题：原 `ChartToChartFilterCopyProductSliceReview-r003` 已用完 3/3 轮，不能重开；其范围是普通柱图到同数据集普通折线图空目标的产品切片审查。本合同只把其中两个跨切片的事务语义变成独立可执行合同，不能复审或改写旧报告：

- 对旧终审 R3-001（授权边界和 mutation 时序），本合同规定授权/兼容 Gate 先于 mutation，dataset READ 由真实 staged query 执行，失败时保留旧目标与完整可见状态。它关闭“流程顺序未定义”的合同缺口；没有关闭 source-read 真实权限、无副作用的 dataset READ 预检或 staged response 现存实现缺口。
- 对旧终审 R3-002（Q014 失败原子性和迟到响应 oracle），本合同规定候选 query/render 与当前活动 tuple 隔离，只有完整绑定匹配才原子发布；失败、取消、目标/身份/版本变化及迟到响应均不污染当前状态。CTPT 案例验证的是候选模型语义，不是现有产品已满足。
- 仍未关闭的 MVP 项包括真实身份/资源/dataset/source-read 授权、跨用户与撤权/恢复、产品层 staged query/render 接线、实际渲染、取消/错误提示、刷新后行为、Canvas 保存及重开、完整 F01 和 Goal 验收。权威材料包 AM-09 仍是 3/3 `NEEDS_REVISION`，不被本合同替代。

实际调用链锚点：Copy 源读取位于 `FilterTree.vue` 的过滤配置与菜单/操作入口；目标端 `editor/index.vue::changeFilterData/customFilter` 当前会变更目标配置并触发 `calcData`；`views/index.vue` 将编辑器事件交给当前图表；图表组件和 `src/api/chart.ts::getData()` 现行路径会更新请求/错误/数据并绘制；后端 `ChartDataManage.calcData()` 执行 dataset READ 与行列权限；前端 Store/snapshot 及 Canvas 保存路径决定撤销、预览和耐久态。静态引用不代表逐行实现核验已完成。

纯模型若通过并获精确 admission，下一项实际产品代码切片必须落在 `editor/index.vue` 到 chart component/query/render/store 的真实链路上：新增/复用可隔离的 staged-query adapter，让查询结果和渲染产物在提交前不写活动 view、component error、chart store 或 renderer；在响应身份/目标/版本绑定验证后一次发布 T 与其 staged 输出，并只记录一次 snapshot。实现前先用当前源码证明 adapter 能接入，不能只克隆 view 参数后复用会写入状态的旧 `calcData` 路径。若调用链不存在可隔离的实现点，报告具体方法/副作用并提出最小必要维护者裁定；不得用 helper 通过作为接线依据。

产品 Happy path 的实际验证入口为目标 MVP：登录真实权限实例，在同一 dashboard 打开普通柱图源与同 dataset、空过滤树的普通折线目标；执行 Copy → Paste，观察目标过滤树和目标预览同时按 T 更新；刷新 dashboard 后状态仍一致；显式保存、离开并重新打开后验证条件持久化。另需在相同实际入口验证取消、query/dataset READ 拒绝、目标切换/迟到响应及保存失败保持规则。真实权限环境未取得前，所有依赖受限/只读账号和撤权的验收保持 `BLOCKED / NOT_RUN`。

## 产品接线前置与禁止推断

- Gate 的 dashboard READ/MANAGE 与同数据集结果不替代 dataset READ，也不证明当前用户有权查看源过滤配置。
- source-copy 的配置读取/保密门槛仍需可核验的现有权限路径；若无法确认只读身份不能读取/复制条件，产品 Copy 必须 fail closed。
- dataset READ 如只能在 staged query 中由后端检查，则它可以早于本地 mutation，但只有在 staged response 完全隔离、失败不污染旧预览时才满足 Q014。不得先写树/快照再调用 `calcData`。
- 当前图表接口直接更新显示状态；本合同没有声称当前实现已经支持 staged response。它是实现前要求，不是既有能力。
- 因而产品适配器需提供独立的 stage-query/stage-render 返回值与原子 publish 边界；单纯克隆 view 参数但仍复用会写 `view.chartExtRequest`、`isError`、`chartData`、Store 或直接 render 的现有路径不满足合同。若不能构造隔离层，保持产品 Builder blocked。
- 上述时序及身份 tuple 是候选工程合同，须独立 Review。Reviewer 不得把静态 API/annotation 或纯模型测试推成真实权限行为。

## 可验证状态与失败原子性

| 事件 | 活动目标/版本 | request/error/data/store | 可见 renderer | snapshot/undo | 成功提示 / 保存 |
|---|---|---|---|---|---|
| Gate/Prepare 拒绝或取消 | 当前现态不变 | P0 tuple 不变 | P0 | P0 | 无成功提示；不保存、不发 query（Gate/Prepare阶段） |
| query pending | P0 | P0；pending 状态仅在协调器 | P0 | P0 | 无成功提示；不保存 |
| dataset READ拒绝、业务错误、transport reject、timeout | P0 | P0；错误只存在于私有事务结果 | P0 | P0 | 无成功提示；不保存；query attempt 单独计数 |
| stage render/publication preparation失败 | P0 | P0 | P0 | P0 | 无成功提示；不保存 |
| query + stage render成功且完整绑定仍匹配 | T / 单次更新 | 对应 T 的 request/state 一次发布 | 对应 T 的 staged 输出 | 恰一次提交 | 恰一次成功提示；不自动保存 |
| 同目标外部改为 P1 后本事务迟到 | 保留 P1 | 保留 P1 tuple | 保留 P1 | 不加本事务 snapshot | 无本事务成功提示；不保存 |
| 切 active target / 身份或响应 tuple 变化 | 当前活动目标现态不变 | 当前活动 tuple 不变 | 当前现态 | 不加本事务 snapshot | 无本事务成功提示；不保存 |
| 提交后的显式保存失败 | T（未保存） | 成功态不冒充耐久态 | T preview | 保持已提交 snapshot | 保存失败，不宣称重开保留 |

失败的 query request 可以已经发到服务端，但不得将请求发出、后端错误码、暂存图表或 loading 状态称为可见 preview refresh。Q014 的“目标与预览保持原状”要求当前活动目标的完整 P0/P1 状态不被候选事务修改。

## 候选 Build 边界

- 可在本设计通过独立 Review、冻结 Cases、可信 RED 和精确 execution admission 后，单独 build 一个无 Vue/Pinia/HTTP/权限依赖的纯事务决策器：输入当前事务快照/事件，输出 `stage | commit | abort | ignore_late` 与精确状态变化。
- 纯决策器不得持有/读取 clipboard、发请求、改图表状态、记 snapshot、显示消息、提供授权结果或伪造 renderer 行为。
- 必须以同 identity frozen Cases 证明 RED/GREEN；测试至少覆盖 gate/query 各类拒绝、两次请求逆序返回、active target 改变、uid/oid/contentId/revision 改变、成功单次提交和保存失败边界。
- 完成该纯模型最多 claim `TRANSACTION_MODEL_CONTRACT_IMPLEMENTED`。产品接线仍须新合同/准入、真实产品路径可信 RED、完整 UI 和保存重开验证；权限场景仍 `BLOCKED / NOT_RUN`。

## 当前结论与后续

r002 是新候选修订，不覆盖 r001 Review。当前仍不是冻结合同、Builder 准入或实现。关键可行性前提（图表完整状态隔离与 source-read/dataset 权限安全路径）尚未由产品代码证实。由独立 Reviewer 对 r003 做全量复审（本交付物最多 3 轮）；仅纯决策器可能准入，产品 UI/权限路径保持 blocked。
