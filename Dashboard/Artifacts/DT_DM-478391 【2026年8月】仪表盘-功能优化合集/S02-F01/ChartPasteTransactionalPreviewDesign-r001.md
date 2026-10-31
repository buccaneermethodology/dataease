# 图表过滤粘贴事务式预览/提交合同 r001

## 交付身份与范围

- Artifact ID：`S02-F01-chart-paste-transactional-preview-contract`，r001，独立于已完成终轮评审的 `chart-to-chart-filter-copy-product-slice` r003。
- 唯一目的：将原 Goal Q014 的“失败不修改、预览保持原状”转成可测试的候选状态合同，并判断当前调用链是否已有安全接线能力。
- 本交付物不实现产品按钮、权限服务、图表请求适配器、跨标签剪贴板或完整 F01。它只允许后续 build 一个纯事务状态模型；纯模型不能称作产品粘贴、权限或 UI 通过。
- Goal 原始分母仍为 10 项 AC、26 项 must-have、16 项产品义务，`Scope Delta: none`。本合同不改变 S01 条件或权限阻塞。

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

## 候选事务状态机

符号：P0 为操作开始时目标过滤树、快照计数、已显示预览及提示状态；T 为完整合法候选树；`requestId` 是本页进程内单调递增序号，不是权限凭据。

1. **Gate：** 捕获 `{uid, oid, dashboardId, contentId, targetChartId, targetRevision, priorTreeDigest, priorPreviewRevision}`。每次粘贴前重新确认身份仍一致、资源 READ、MANAGE 返回精确 `Success`、同数据集兼容结果为真、剪贴内容有效。缺失/拒绝/异常/超时/畸形响应立即拒绝，P0 不变。
2. **Prepare：** 对 T 做完整结构、字段、容量与目标支持形态校验，并构造隔离深拷贝。到此不写目标、不记 snapshot、不触发保存、不显示成功。
3. **Stage query：** 以捕获的目标图表副本和 T 构造候选请求。服务端实际 query 必须执行现有 dataset READ 与行列权限；失败不得提交本地树或可见预览。候选 query 响应不能先行覆盖图表当前显示数据或错误态。若现有图表 API 不能隔离暂存响应，该产品接线保持 blocked。
4. **Commit：** 仅当当前 `requestId` 仍是最新、目标仍 active、uid/oid/contentId 未变化、目标 revision/digest 与捕获值一致、候选 query 成功且 response 属于同一 request/target 时，在一个提交临界区写入 T、记录恰一次 undo/snapshot，并发布该响应为目标预览；随后显示现有成功提示。此操作不自动保存。
5. **Abort：** 用户取消、任何前置拒绝、query 错误/拒绝/超时、目标切换、身份变化、内容版本变化、请求被更新的粘贴取代、响应 request/target 不匹配时，丢弃候选响应并维持 P0；不改目标、不写 snapshot、不替换预览、不发成功提示、不保存、不清除仍有效的原 clipboard。错误提示只能使用已有失败提示语义。
6. **Late response：** response 仅凭 `requestId + targetChartId + captured uid/oid/contentId + targetRevision` 匹配最新未决事务才可继续；旧请求迟到时只丢弃，不得修改当前图表数据、error 状态、目标树、snapshot 或当前目标的提示。

## 产品接线前置与禁止推断

- Gate 的 dashboard READ/MANAGE 与同数据集结果不替代 dataset READ，也不证明当前用户有权查看源过滤配置。
- source-copy 的配置读取/保密门槛仍需可核验的现有权限路径；若无法确认只读身份不能读取/复制条件，产品 Copy 必须 fail closed。
- dataset READ 如只能在 staged query 中由后端检查，则它可以早于本地 mutation，但只有在 staged response 完全隔离、失败不污染旧预览时才满足 Q014。不得先写树/快照再调用 `calcData`。
- 当前图表接口直接更新显示状态；本合同没有声称当前实现已经支持 staged response。它是实现前要求，不是既有能力。
- 上述时序及身份 tuple 是候选工程合同，须独立 Review。Reviewer 不得把静态 API/annotation 或纯模型测试推成真实权限行为。

## 可验证状态与失败原子性

| 事件 | 目标树 | snapshot/undo | 可见预览 | 成功提示 | query / save |
|---|---|---|---|---|---|
| Gate 拒绝或用户取消 | P0 | P0 | P0 | 无 | 不触发候选 query；不保存 |
| Prepare 拒绝 | P0 | P0 | P0 | 无 | 不触发候选 query；不保存 |
| Stage query 权限拒绝、业务失败、网络错误、timeout | P0 | P0 | P0 | 无 | query 可被请求但不得发布/渲染其失败态；不保存 |
| Stage query 成功且身份/目标仍匹配 | T | 恰一次提交 | 对应 T 的响应 | 恰一次成功提示 | 单一候选 query；不自动保存 |
| Stage query 成功但 response 迟到/目标或身份已变化 | P0（当前目标） | P0 | 当前目标 P0 | 无 | 丢弃响应；不保存 |
| 保存失败 | 已提交 T（未保存） | 保持 | 已成功预览 | 不回报耐久保存 | 仅显式 save 失败；不回滚已应用 T |

query 失败时“请求可能已发送”与“预览刷新”分开记录。Q014 要求的原状指用户可见目标配置、当前渲染结果及成功反馈保持 P0；不能把后端拒绝请求称为预览成功。若原始 AC 的维护者语义与该可观察区分冲突，停止产品接线并请求 authority 裁定。

## 候选 Build 边界

- 可在本设计通过独立 Review、冻结 Cases、可信 RED 和精确 execution admission 后，单独 build 一个无 Vue/Pinia/HTTP/权限依赖的纯事务决策器：输入当前事务快照/事件，输出 `stage | commit | abort | ignore_late` 与精确状态变化。
- 纯决策器不得持有/读取 clipboard、发请求、改图表状态、记 snapshot、显示消息、提供授权结果或伪造 renderer 行为。
- 必须以同 identity frozen Cases 证明 RED/GREEN；测试至少覆盖 gate/query 各类拒绝、两次请求逆序返回、active target 改变、uid/oid/contentId/revision 改变、成功单次提交和保存失败边界。
- 完成该纯模型最多 claim `TRANSACTION_MODEL_CONTRACT_IMPLEMENTED`。产品接线仍须新合同/准入、真实产品路径可信 RED、完整 UI 和保存重开验证；权限场景仍 `BLOCKED / NOT_RUN`。

## 当前结论与后续

当前文档仅是候选设计，不是冻结合同、Builder 准入或实现。其关键可行性前提（图表响应隔离与 source-read/dataset 权限安全路径）尚未由产品代码证实。下一步是按本交付物自己的评审预算做一次独立全量 Design Review；如不能冻结纯决策器边界，则记录 finding 后继续其他互不依赖的 S02 Slice，不触及产品 UI/权限路径。
