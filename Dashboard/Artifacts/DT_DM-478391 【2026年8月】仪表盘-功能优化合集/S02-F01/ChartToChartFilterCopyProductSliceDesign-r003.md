# 普通图表过滤配置跨图表复制：可体验 MVP 设计 r003

## 交付物身份与结论边界

- Artifact ID：`S02-F01-chart-to-chart-filter-copy-product-slice`，r003（本交付物第 3/3 轮候选）；处理独立 Review r002 的 CTC-002..005、007..009、011..016。
- Goal authority：`Goal.final.json` 及已应用的 `S02-GR-P004`。仅调整先交付 MVP 的顺序；原 10 项 Goal AC、26 项 must-have、16 项产品义务、最终完成谓词和 `Scope Delta: none` 完整保留。
- 唯一 MVP 行为：在同一已打开的 DataEase 仪表板编辑页，从同数据集普通柱图复制一个静态文本枚举过滤树，粘贴到空的普通折线图，观察目标真实查询/渲染结果，正常保存并重新打开核对。
- 本文件与 Cases r003 尚未冻结；当前不是 Builder admission、可信 RED、功能验收或权限验收。
- 即使 MVP 功能路径通过，claim ceiling 也仅为 `MVP_FUNCTIONAL_PATH_VALIDATED`。不关闭完整 Q004–Q015、query→query、其它图表/表/透视表、非空目标确认、ORIG-02、真实权限/撤权矩阵或 S02 Goal。

## S01 条件及全量分母

按 P004 允许此窄片在 S01 F01 `CONDITIONAL` 时推进。Builder admission 必须绑定当前 S01 Entry Packet 的版本/digest、逐项 Slice AC/Gap 对照和不依赖项证据，不修改或抢占 S01。`AC-F01-ORIG-02` 及其他依赖 S01 条件的验收继续 pending。实施或验证中如实际触及旧组件复制/改类型链路，停止该改动并先满足对应 S01 条件。

原始 denominator 固定为 10 Goal AC、26 must-have、16 产品义务，`Scope Delta: none`。阶段范围、未运行项和权限阻塞不得改写为已完成或隐式 non-goal。

## 源码路径与操作时权限门槛

1. **源/目标载入：** 只用当前编辑器已载入的图表配置和字段目录，不读取 RowAuth 临时事件对象。主画布读取必须已通过现有 `DataVisualizationApi.findById` 的 READ 访问门槛；管理该画布的修改必须走现有 MANAGE 保护路径。
2. **每次复制/粘贴前重新授权：** 对已保存仪表板，调用现有 `/dataVisualization/findNameById` 以当前身份重验 READ；再调用现有 `/dataVisualization/checkCanvasChange`，其 API 注解要求 `resourceId:manage`，且实现校验当前 `contentId`。源复制和目标粘贴均在成功后才允许本地载荷读取/目标树修改。拒绝、接口错误或身份缺失时 fail closed，不以 `editMode` 或隐藏按钮替代。
3. **同数据集检查：** 本地 `tableId` 严格相等后，调用 `/chart/checkSameDataSet/{sourceViewId}/{targetViewId}` 一次；非肯定、异常、超时或畸形结果拒绝。该接口只用于相同数据集判定，不充当授权门槛。
4. **数据集取数：** 实际目标预览走既有 `calcData` → `ChartDataManage` 权限流程，由服务端在取数时检查数据集 READ 并应用列/行权限。权限拒绝不得显示成功或保存提示。当前本机权限模块与真实隔离运行环境仍未提供，因此任何真实只读、源读取、撤权/恢复和身份场景保持 `BLOCKED / NOT_RUN`；静态接口/annotation 只能证明声明路径，不能证明 XPack 实际拒绝行为。
5. **目标保存：** 不新增或绕过保存 API；显式保存走现有 `canvasSave`/`updateCanvas`，后端 `updateCanvas` 再要求仪表板 MANAGE。保存拒绝/失败按原错误路径显示，不能声明耐久成功。
6. **权限边界：** 不新增权限服务或默认放行。若实际目标没有当前 `contentId`、是未保存画布、授权预检不能可靠证明 MANAGE，或 permission endpoint 不可用，则当前操作拒绝；不降级为 UI-only 检查。真实多用户环境只用于后续验收与证据，不以 standalone/admin/mock 替代。

## 同页临时载荷与时间边界

- MVP clipboard 仅存于编辑页运行时的模块内存；不写系统剪贴板、localStorage、sessionStorage、IndexedDB、URL 或服务器。复制与粘贴限定同一已打开编辑页、同一 tab。
- 使用 `performance.now()` 单调经过时间记录创建时刻并校验 30 分钟 TTL；不使用 `Date.now()` 计算年龄。恰 `1,800,000ms` 起过期。墙钟回拨不影响年龄判定。页面 reload/navigation/close、`visibilitychange` 切到 hidden、`pagehide`、新 tab、logout、uid/oid 变化、过期、畸形状态或 MANAGE 预检失败均清除/拒绝载荷；不得跨刷新或跨 tab 恢复旧载荷。
- 浏览器页面生命周期无法继续可靠观测单调时间（例如运行上下文销毁）时，内存自然消失，fail closed。时钟边界由可注入的 monotonic clock 在契约测试中验证：0、1,799,999 接受；1,800,000、1,800,001 拒绝；过期后改变墙钟不能复活载荷。
- 同浏览器跨 tab 内部共享仍是原 Goal 规定的最终能力，明确留给后续 Slice；本阶段没有 Scope Delta，MVP 通过不代表跨 tab 已实现。
- payload projection 固定 `{schemaVersion:1,logic,items}`，由 `JSON.stringify` 后使用 `TextEncoder` 计 UTF-8 字节；叶子最多 50，字节数 `<=1,000,000` 允许。配置拒绝不清除先前仍有效的同页载荷。边界用纯合同测试正交验证，不伪装成产品 E2E。

## 唯一支持形状与原子应用

- 支持普通 bar→普通 line、两图 `tableId` 相同、目标过滤树为空。
- 两边需在已加载字段目录中按精确 `fieldId` 找到同一个文本类型；名称相同不能替代 ID。支持 AND/OR 组合与 1–50 个静态枚举叶子。合法叶完整保留已提交 `customFilter` 的序列化属性：`type`、`fieldId`、`filterType`、`term`、`enumValue`、`timeType`、`value`、`filterTypeTime`、`timeValue`、`dynamicTimeSetting`、`subTree`。过滤树自身不加入字段目录的 `deType` 属性。组合结构按 JSON tree 深拷贝，不能丢叶或合并。
- 空树/空组合、缺字段、不匹配字段类型、非 enum、动态时间、未知节点、坏 JSON/载荷、非法组合、其他 chart type、非空目标均在目标修改前拒绝，提示沿用 `过滤条件不匹配，请重新复制`。
- 同一正向树从配置、复制载荷、目标应用、query payload 到保存重开都保持两个叶子及其 OR 组。重开比较以完整过滤树结构和值为准；只允许比较对象边界外由服务端字段目录补充的元信息，不得忽略或删去过滤叶、分组、运算符和值。
- 粘贴顺序：permission recheck → 同数据集检查 → 目标/字段/TTL/容量/结构校验 → 构造独立完整副本 → 单次 snapshot/undo 记录并原子替换目标 `customFilter` → 调度目标 `calcData`。失败前所有目标配置、snapshot、query、save 计数保持不变。成功应用不自动保存。
- query reject/timeout/stale 响应：保留完整但未保存的目标过滤树；不报“已应用/预览成功”，通过现有错误提示告知失败，不回滚条件、不混用旧图结果、不清除有效 clipboard、不自动重试或保存。save 失败：显示既有错误并维持未保存状态。

## 产品 E2E 场景准备及当前环境

Cases r003 将主路径标为 `product-ui-scenario-specification`，不是可执行 E2E。字段 ID、dashboard/chart ID、dataset ID 和 row ID 目前是符号值；当前没有已绑定的可复现隔离产品 fixture，且本会话 browser inventory 未提供可访问的 DataEase tab。不能把这些值写成已配置或已运行证据。

要使该场景可运行，执行记录需绑定：真实非生产 DataEase 前后端/权限配置版本；已保存且允许编辑的仪表板及 source bar/empty target line IDs；同数据集的真实文本字段 ID 与实际类型；North/Central/South 固定行与结果 ID；打开该仪表板的明确路由；canvas 保存成功/重开读取步骤；环境 reset/cleanup 方式。不得在用户未保存画布中试验，也不得刷新/关闭用户当前页面来伪造 fixture。

允许先用隔离测试页/受控 harness 验证代码合同，但 harness 结果不得命名为产品 UI E2E，也不得替代真正界面体验。现有用户浏览器在任务开始时曾显示 `127.0.0.1:7070` 编辑页只是一条历史观察；当前宿主/登录态/内容状态尚未确认，不作为本次执行证据。

## Cases r003 覆盖清单

[Cases r003](ChartToChartFilterCopyProductSliceCases-r003.json) 使用唯一正向 OR 双叶树，并为每个负例提供独立 setup、动作/变体和可观测副作用。分别覆盖：数据集 ID 不同/API false、异常、超时/畸形响应；正负结构域；身份/页面生命周期；单调 TTL 边界与墙钟回拨；叶子数量/UTF-8 字节正交边界；异步预览、保存失败；每次操作的 dashboard READ/MANAGE 门槛。permission/runtime case 仍注明 `BLOCKED_NOT_RUN`。

## 实施顺序与 Builder 准入

本轮应由独立 Reviewer 对 r003 Design 与 Cases 作为一个稳定交付物做最后一次完整语义评审，并列出全量 findings，双 verdict 分别报告 Design Freeze Validity 与 Implementation Entry Readiness。

只有当本交付物第 3/3 轮 Review 对功能合同给出可冻结结论后，才启动 Builder；Builder write scope 不含本 Design、Cases、Goal、历史 reports。Builder 入场前先以原实现产生同 identity、可观察功能路径缺失的可信 RED，绑定代码 HEAD/工作树、S01 Entry Packet digest、Design/Cases digest、真实 topology，并验证 action=`implement-mvp-chart-filter-copy`、canonical target 精确包含 chart editor operation 和 page-memory clipboard 的 execution admission。不能仅以 helper 字符串断言作为 RED。

真实权限执行环境缺失不得用 mock/standalone 代替；凡无法验证的角色/撤权行为保留 `BLOCKED / NOT_RUN`。如果现有 `checkCanvasChange` 或 READ path 不能在当前真实 Editor 状态中可靠使用，则在相应操作前 fail closed 并记录最小阻塞，不添加旁路授权。

## Claim ceiling 与未决事项

- 允许：静态来源定位、单页内存剪贴板合同、受限 bar→line 候选设计、场景规格。
- 在真实浏览器/保存链、独立 Validation 都完成前，不允许声称 MVP 功能路径通过或 UI E2E 完成。
- 未验证：XPack 权限、真实角色矩阵、数据集撤权、dashboard MANAGE 撤权实时性；目前尚无已绑定真实 fixture。
- 后续 Slice：跨 tab clipboard、其他 chart 组合、非空目标确认、query 组件、表/透视表及完整 AC/回归矩阵。它们仍在 10/26/16 原分母内。
