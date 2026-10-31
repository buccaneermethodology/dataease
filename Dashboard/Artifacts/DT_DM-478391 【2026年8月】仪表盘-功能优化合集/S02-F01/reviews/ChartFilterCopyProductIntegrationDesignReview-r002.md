# Chart Filter Copy Product Integration Design 独立评审 r002

## 双 verdict

- **Design Freeze：`NEEDS_REVISION`。** r002 吸收了上一轮大部分要求，补入 UI 落点、嵌套过滤树、staged G2 接口、clipboard 边界和响应字段矩阵方向；但过滤树 fixture 仍与 serializer 不完全一致，G2 sibling host 生命周期/现有 renderer hooks 未闭合，source-read 实时授权 oracle 缺失，响应与 dispatch 事件未形成可复核的逐请求证据，Goal 明确要求的跨标签共享没有可行传递机制，保存/重开请求计数也不完整。
- **Product Builder Entry：`BLOCKED / NOT_READY`。** 当前 source-read 权限门明确未知且必须 fail closed；此外 staged G2 路径尚无可实现的行为合同与可信 RED。真实权限环境按维护者指示继续 `BLOCKED / NOT_RUN`，不得用 standalone、admin 或 mock 替代。
- **轮次：** `S02-F01-chart-filter-copy-product-integration` 第 **2/3** 轮。本上限按每个交付物分别计算，不限制 S02 其他独立交付物；旧的 Chart→Chart r003 与 transaction r003 不在本轮内，且不得重开。
- **声明上限：** 审查本交付物 Design/Cases r002、绑定 Context 与当前静态源码；不证明 UI、权限、保存重开运行行为或完整 F01/S02 Goal。

## 审查基线与方法

Review Card canonical SHA-256：`5b0bcdc41dd5b65833fdbb2dccffca9e44269b687cbef227384752c34b13f8b1`，`lane_task_card.py validate` 为 `pass`。本轮 ContextBootstrap 有 **31 项 required-read**、2 项 conditional-read；31 项当前摘要全部匹配，`skipped_reads=[]`，`context_bootstrap.py validate` 成功。被审 Design SHA-256：`8048c6ddc3bf7f97e44f0676ec0b63c5ed0e56357392e8858f8e966b277aaae5`；Cases SHA-256：`e9442d28d86ca9cdf84ca5b6a25486a31f94f0f8b80584706f00c2f9f6e6e87c`；Goal 摘要 SHA-256：`28c94d3c35d4ce0a891ce77ecc915932d67f88ef813f3d2815dc0dce11f91b64`。

沿 FilterTree/RowAuth、G2 line renderer、G2TooltipCarousel、ChartComponentG2Plot resize/legend/tooltip hooks、ResourceAuthApi 和 dashboard query/save/reopen 路径进行了静态核对。Cases r002 共 **40 项**；每个案例的 `initial_state` 和 `expected_state` 均恰好覆盖统一的 23 个状态字段。逐项计算 `len(query_dispatches) == expected_state.query_attempt_count`，40 项全部成立；该结构一致性不证明事件与运行时请求结果正确关联。

没有运行产品 UI、浏览器、权限服务、数据库、构建或可信 RED/GREEN。报告只写入本文件，未改 Design、Cases、Goal 或源码。

## r001 Findings 吸收状态

| 历史发现 | r002 状态 | 本轮判断 |
|---|---|---|
| CFPI-001：产品入口与合法完整 payload 未冻结 | 部分修复 | 增加编辑器“结果过滤”落点和嵌套 AND/OR fixture；但 tree wrapper 缺少 serializer 实际输出的 `dynamicTimeSetting: {}`，fixture 不能声称与提交 payload 完全 JSON 相等。继续见 CFPI-001。 |
| CFPI-002：staged G2 query/render 与活动 renderer 原子发布只有概念要求 | 部分修复 | 增加 `stagePaste/commitPaste/abortPaste` 接口、双 host 和 rollback capsule；但 HTMLElement container 与 `chart.container.indexOf(...)` 的现存使用不兼容风险明确，且活动图表的公共 tooltip/legend/resize/observer hooks、活动组件卸载与 render queue 归属未闭合。继续见 CFPI-002。 |
| CFPI-003：source-read 权限 API/拒绝 oracle 不明确 | 开放且阻塞 | 设计诚实指出 `ResourceAuthApi` 没有当前调用者实时 source READ 判定；但没有可授权使用的调用路径，且 Cases 的 CPI-002 是 paste gate 拒绝，不能证明 Copy source-read deny。继续见 CFPI-003。 |
| CFPI-004：响应绑定字段级覆盖不足 | 部分修复 | `response_binding_contract` 列出捕获/响应字段并要求单字段变异，但未把矩阵展开成可执行案例；`requestId` 被参数化矩阵排除，实际事件仍主要使用 ordinal `request=1`。继续见 CFPI-004。 |
| CFPI-005：query attempt 与预览刷新 dispatch 不能逐请求核验 | 部分修复 | 40 项 dispatch 数与预期计数相等，ledger 包含稳定 request_id；但结果事件未映射到稳定 id，且预览刷新、页面重载/重开实际触发的请求结果/dispatch 没有完整覆盖。继续见 CFPI-005、CFPI-008。 |
| CFPI-006：clipboard TTL、容量和清理合同无测试 | 可关闭 | CPI-031..040 覆盖恰 30 分钟/不续期、50/51 leaves、1MB/超限、uid/oid/logout 清理及重复粘贴；这些仍是静态合同，不是产品测试。 |

## 全量 Findings

### CFPI-001 / P2 / OPEN：嵌套 tree fixture 未逐字段匹配 RowAuth serializer

**证据：** Design 声明 source `customFilter` 与 RowAuth 提交形状深度相等。`RowAuth.vue:197–215` 的组节点序列化会输出 `enumValue`、`fieldId`、`filterType`、`term`、`timeType`、`value`、`filterTypeTime`、`timeValue`、`dynamicTimeSetting: {}` 和 `subTree`；Cases r002 的 BAR-1 嵌套组节点缺少 `dynamicTimeSetting`。因此 fixture 能表达树的业务逻辑，但不是其宣称的精确 serializer payload，目标 JSON-equality oracle 会因非业务差异产生歧义。

**最小修复：** 在组节点 fixture 中加入 serializer 产生的 `dynamicTimeSetting: {}`（并对其余字段逐项校准），或将 oracle 明确为规范化后的语义相等并给出规范化规则。此项不需要扩大产品范围。

### CFPI-002 / P1 / OPEN：G2 sibling-host 生命周期与活动渲染路径未闭合

**证据：** Design 将 `HTMLElement host` 传给 `G2ChartView.drawChart({container: stageHost, ...})`。普通 line 的 `line.ts:138–150` 将 `container` 传入 `new G2Chart`，并创建 legend state、tooltip carousel、assist-line 等图表资源。`G2TooltipCarousel.ts:132,135` 对 `chart.container` 调用字符串 `.indexOf('viewDialog')`，并以 container 作为缓存键；当 container 是 HTMLElement 时存在直接类型/运行时不兼容。即使容器被适配为字符串，当前公共活动 renderer 仍在 `ChartComponentG2Plot.vue:750–805` 安装 tooltip、主题字体、tiled legend、assist-line、slider/pagination、linkage 等行为；`1269–1332` 的 resize observer 只观察当前活动容器并通过共享 `myChart` 调整实例。设计的 `stagePaste` 直接 `drawChart` 且禁止调用活动 `renderChart`，没有定义这些 hook 在 stage 实例如何安装、如何在 host 切换后重新绑定 resize/交互/卸载，也没有说明活动组件的 render queue 在 stage pending 期间重绘或卸载时如何协调。rollback capsule 对同步 Store/DOM 失败有描述，但未证明 browser DOM host 切换与 Vue DOM 所有权可原子提交。

**最小修复：** 明确 adapter 实际接收的是容器 ID 还是 DOM 元素，并逐项绑定共享 renderer 必需的 G2 初始化与 cleanup hooks；定义 Vue host 生命周期、活动 renderer queue/卸载/resize 期间 stage 的取消与交接。为 sibling-host `drawChart` 增加隔离的可信 RED/GREEN，覆盖 tooltip/legend、resize、host 切换、异步渲染失败、重复 paste、组件卸载和 cleanup。若无法安全接入，保持 fail closed，不回退到先改活动 `view.customFilter` 再 calcData。

### CFPI-003 / P1 / OPEN：真实 source-read 授权 oracle 缺失，Copy 拒绝案例也未落入案例集

**证据：** Design 正确说明 `ResourceAuthApi` 公开接口仅提供授权用户/角色查询，没有当前调用者对指定 source chart/dataset 的实时 READ 判定；没有发现已授权的 XPack 权限实现或可信多用户隔离实例。维护者已明确无授权模块来源，要求将真实权限环境标记为阻塞并继续设计/开发，不得用 standalone 替代。Cases CPI-002 表达 `paste(gate=reject,reason=sourceReadDenied)`，它只能证明剪贴板不存在/被拒绝后的粘贴门，不是对 Copy 时源内容读取的拒绝行为；缺少 source-read allow、deny、复制后撤权、恢复后的再授权案例及真实权限 oracle。

**最小修复/阻塞处理：** 不猜造 API，不把已在内存中的 `view.customFilter` 或 dashboard MANAGE 当作实时 source READ。Copy 在取得维护者授权的权限路径前必须 disabled/拒绝；将 CPI-002 改为真实 Copy deny 场景并补 source-read lifecycle 案例，但将其标 `BLOCKED / NOT_RUN` 直到授权模块或隔离实例可用。此项保持为 Product Builder 与完整 Goal 的阻塞，不得以静态案例关闭。

### CFPI-004 / P2 / OPEN：响应绑定字段矩阵尚未落成可执行案例，requestId 未验证

**证据：** Design capture 共 12 项。Cases `response_binding_contract` 仅用文字要求“除 requestId 外”逐字段错配；40 项案例中未提供完整捕获/响应 tuple，也没有 `requestId` 错配案例。CPI-021..026 的事件分别用 `request=1`，并不证明 stage/query/response 与 ledger 的稳定 request_id 绑定；targetChartId、targetTreeDigest、chartExtRequestDigest、priorErrorRevision、priorStoreRevision、priorRenderRevision 等也未在案例事件中提供各自独立变异后的响应结果。作为静态契约的一句 parameterized instruction，不能替代可执行且能逐字段判定的案例 oracle。

**最小修复：** 将完整 tuple 编码进每一条 dispatch、response、stage success/failure 和 commit 事件，统一使用 ledger 稳定 `request_id`。为 capture 的全部字段（包括 requestId）逐项生成单字段错配案例，或提供确定性矩阵展开器及展开后的 identity 清单；验证不发布、不覆盖并发外写且 disposal 一次。

### CFPI-005 / P2 / OPEN：dispatch ledger 与实际结果事件没有按 request_id 闭合

**证据：** 静态核对确认每个案例的 query dispatch 数与 `expected_state.query_attempt_count` 一致，故 r001 中“dispatch 数量没有逐案例列出”的部分已经修复。但 CPI-001 列出 paste 与 preview-refresh 两个 dispatch，事件只有 `stageQuerySuccess(request=1)`，没有 preview-refresh 的对应结果；CPI-028 也列出两次 dispatch，却只有 `commit(T)`、`previewRefresh(noPageReload)`、`pageReloadWithoutSave`，没有两条 dispatch 的结果事件。CPI-008..013 等结果以 `request=1` 或无 request id 表达，无法把请求结果、取消、迟到响应和状态变化关联到 ledger 的 `cpi-...` 稳定 request_id。

**最小修复：** 每个 dispatch 必须有唯一稳定 id；事件列出对应 `queryDispatched(request_id)` 和同 id 的 resolve/reject/cancel，并明确计数定义是 `getData()` 实际发起。将 preview-refresh 具体分为再次查询或纯 redraw，分别给出事件及 oracle。此项修复可与 CFPI-008 同批完成。

### CFPI-006：clipboard TTL/容量/身份生命周期合同已覆盖（静态设计层关闭）

**核对结果：** CPI-031/032 覆盖恰到期与读取/重验不续期；CPI-033/034 覆盖 50/51 leaves；CPI-035/036 覆盖 1,048,576/1,048,577 bytes；CPI-037..039 覆盖 uid、oid、logout 清理；CPI-040 覆盖成功粘贴后重复使用。案例合同方向与 Design 一致，本 finding 在本交付物的设计覆盖层关闭。执行时仍须验证 JSON UTF-8 序列化口径、失效时清理与身份会话行为；此处不构成产品行为通过。

### CFPI-007 / P1 / OPEN：Goal 要求跨标签共享，但方案明确禁止持久/外部传递且没有替代机制

**证据：** Goal `business_rules` 明确要求“同用户同浏览器跨标签内部共享”，同时排除系统剪贴板。Design 将剪贴板限定为内部状态，并明确排除 localStorage、sessionStorage、URL、服务端；但同一页面内存中的 JS 对象不能自然跨浏览器标签页共享。Design 与 Cases 未说明 BroadcastChannel、SharedWorker 或其他经过身份隔离与生命周期定义的跨标签桥接，也没有两标签 copy→paste 案例。现有 uid/oid/session 绑定仅覆盖单个 clipboard 状态，未定义标签间竞争、登出同步或多标签超时清理。

**最小修复：** 设计一个符合 Goal 安全边界且可跨标签传递的方案，定义身份/组织/登录会话校验、生命周期、退出与换用户清除、内容大小及并发替换；补两标签案例。若维护者选择将跨标签语义改为单标签，须作为 Scope Delta 提请 authority，不可由设计自行缩窄 Goal。

### CFPI-008 / P1 / OPEN：重载/重开路径会发起实际查询，但案例 ledger 没有计入

**证据：** 当前 `views/index.vue:832–836` 在图表组件 mount 时触发 `queryData()`；该链路会执行图表 `getData()`。因此 CPI-028 的 `pageReloadWithoutSave` 会恢复最后持久状态并在 mount 时再次查询，CPI-029 的 `leaveEditor` 后重新打开已保存 dashboard 也会在 mount 查询。两案 ledger 各只含 paste dispatch（CPI-028 另含一个 previewRefresh dispatch），没有单独列出页面 mount/reopen dispatch，且 `query_attempt_count` 仍只反映 ledger 当前长度。若此字段仅计用户粘贴查询，则与 Cases 对“每个 getData dispatch 均计数”的 oracle 冲突。

**最小修复：** 在 CPI-028、CPI-029 为页面重载/重开各补一个 mount query dispatch 与结果，更新预期计数和请求 id；明确保存是否会单独触发请求，并保证其行为由源码与实测确认。保留“页面不 reload 的预览刷新”与“实际离开重开”两种不同路径。

## 已检查且未发现新增问题的维度

- **范围与权威：** Goal 仍保留 10 项 AC、26 项 must-have、16 项产品义务，`Scope Delta: none`；Design 限于普通 BAR-1 → 同数据集空过滤树普通 LINE-1 的 Slice，未声称覆盖完整 S02。Goal 明确的查询组件/其他图表类型、非空目标、权限、安全和兼容场景仍待后续 Slice/验收。
- **产品 UI 候选落点：** 结果过滤行的 Copy/Paste 控件放在 editor 组件而非 `FilterTree` 确认回调，成功提示限定在 commit 后，拒绝/取消保持原状态；该位置是可核对候选设计，不证明已实现。
- **过滤树深拷贝语义：** FilterTree `changeFilter` 会移除叶 `field` 对象再 emit `{logic,items}`；RowAuth 序列化项以 `fieldId` 承载字段身份。复制不携带可变 field 引用的方向正确，只有 fixture 字段差异仍待修正。
- **失败原子性合同：** Design 规定 gate、prepare、query、stage render 失败不发布活动树/预览，不发成功提示/snapshot/save；成功只提交一次；保存失败不宣称耐久。合同层方向未发现把失败降格成部分成功的表述，真实产品路径仍未验证。
- **State 与 fixture：** 40 个案例的 23 字段投影、BAR/LINE 双 target fixture，以及 dispatch count 等式结构检查通过；LINE-2 切换不再依赖运行时合成 fixture。
- **权限声明边界：** 文档没有把 standalone/admin/mock 写成真实权限证据，真实只读用户拒绝、source-read/dataset READ、撤权/恢复和组织隔离仍保持未验证。
- **Clipboard 设计覆盖：** TTL、不续期、容量、身份清理和重复 paste 覆盖已补齐，详见 CFPI-006。

## 未检查项与原因

- 未运行 Copy→Paste→预览刷新→显式保存→离开重开 UI 流程；本轮 Card 明确限定只读设计评审，禁止运行产品 UI、构建或数据库。
- 未验证 source READ、target MANAGE、dataset READ、只读用户隐藏/拒绝、撤权与恢复；没有获授权的 XPack 权限来源、隔离多用户实例或受限测试账号。按维护者要求保留 `BLOCKED / NOT_RUN`。
- 未运行可信 RED/GREEN；静态 Cases、pure helper 和接口草图不证明 sibling host renderer 行为或实际权限拒绝。
- 未验证跨标签实现，因 Design/Cases 没有传递机制或用例；也未验证保存重开触发的 getData 次数。
- 本轮是第 2/3 轮；修订后该交付物尚有最多一轮 review。该轮次上限不妨碍 S02 其他独立交付物继续评审/实现，但须遵守各自 artifact 的轮次与准入。

## 下一步与准入预测

先一次性修订 CFPI-001、002、004、005、007、008，并将 CFPI-003 保持为明确的权限实现阻塞；再对同一交付物申请第 3/3 轮完整 Review。预期至少需要：精确过滤树 fixture；G2 sibling-host lifecycle 与公共 hooks 接线；完整 request/response/capture 可执行错配矩阵；每个 `getData()` dispatch 的唯一 id 及结果；跨标签状态方案与双标签案例；重载/重开查询计数。若权限 oracle 仍未知，Review 可裁定设计在授权路径被明确 fail-closed 的范围内是否可冻结，但 Product Builder Entry 和权限验收仍须保持 blocked；未取得真实权限模块/隔离实例前，不能宣称 Q009 权限行为或完整 Goal 达成。

本报告不为产品 Builder 授权。继续实现必须另行消费有效的执行准入，精确绑定 Goal、Completion Contract、Context、冻结 Design/Cases、当前 topology、action 和 canonical target；满足准入后建立可信 RED，再在同 identity 下 GREEN 并由独立 Validator 实查产品入口与行为。任何权限依赖不得以 standalone/mock 绕过。

## 最终裁定

r002 对 r001 的主要设计方向作了实质补充，Cases 的统一状态投影、dispatch 计数长度以及 clipboard 静态边界均有可复核进展。但上述 CFPI-001..005、007..008 仍有可修复合同缺口，CFPI-003 为不可由本地静态设计自行消解的权限阻塞。因此本交付物第 **2/3** 轮结果为 **Design Freeze `NEEDS_REVISION`、Product Builder Entry `BLOCKED / NOT_READY`**。未运行构建、产品或权限验收；未改变 Goal 分母与权限阻塞，不声称 S02 已完成。
