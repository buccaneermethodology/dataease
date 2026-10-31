# Chart Filter Copy Product Integration Design 独立评审 r003

## 双 verdict

- **Design Freeze：`NEEDS_REVISION`。** r003 显著补齐了请求/响应错配矩阵、跨标签 `SharedWorker` 方案、G2 stage host 身份及 mount query 计数，但仍有未闭合的序列化形状、渲染器生命周期/提交副作用、活动状态独立 revalidation、请求终态账本、字节上限权威口径、Worker 时钟与会话生命周期、重复粘贴目标和空数据图表合同。此为本交付物第 **3/3** 轮；不得另开 r004，后续处理应形成新的明确交付物或由 Goal owner 按治理流程裁定。
- **Product Builder Entry：`BLOCKED / NOT_READY`。** 当前 Copy 的 source READ 没有已授权的实时权限 oracle；真实多用户权限环境与权限实现来源仍 `BLOCKED / NOT_RUN`。设计要求 fail closed 的方向正确，但未形成可验证的产品接线契约；不得以 standalone、admin 或 mock 替代，也不得把当前静态案例解释为权限通过。
- **范围与声明上限：** 本报告只审查 `ChartFilterCopyProductIntegrationDesign-r003.md` 与 `ChartFilterCopyProductIntegrationCases-r003.json`、绑定上下文及本轮允许的静态源码。Goal 仍为 10 项 AC、26 项 must-have、16 项产品义务，`Scope Delta: none`。不证明 UI、权限、保存重开运行行为、产品验收或完整 S02 Goal。

## 审查基线与方法

Review Card：`S02-F01-CHART-FILTER-COPY-PRODUCT-INTEGRATION-DESIGN-REVIEW-r003`；canonical SHA-256：`5093fa48c6bd07ba3194296f9d7207cd1482b9fa90ed385b1d5fa7079edd1f18`。Card 校验与渲染通过，写入范围及 required output 均为本报告。实际 topology 为 `Topology-actual-r379.json`，SHA-256：`7f662d4284a7dc9ad6a9344fc9e09e8f6d7e2f2dc52c301a49bbe600c92a5f84`，绑定本轮 task。

Context Bootstrap SHA-256：`15e512d8d9f114c4d01b7d79bf7f15a7dd83ffcd8231f2e64000a4f9957933b5`；34 项 required-read 全部完成、无 skipped reads，校验通过。**治理元数据残余：** Context 的 `output_ref` 仍指向 r002 报告；Card 的 `write_scope`、`required_outputs` 与父任务要求指向 r003。本轮按 Card 写入 r003，并在此保留该不一致记录，未修改 Context。

被审 Design SHA-256：`6e1f68da44ace340ebdad6b37c85ceee1c5eaf73aa173f9e881c675128628a70`；Cases SHA-256：`5ea63ce04b3d099beb902e688abf1db48b1056e1b26df96a5fd8806fd8cfc90d`。Cases 共 **59 项**。静态复核确认：每项均投影统一的 23 个 observable state 字段；每案 `query_dispatches` 长度与 `expected_state.query_attempt_count` 相等；CPI-041..052 的捕获/响应字段单项错配与 canonical digest 重算匹配；CPI-028/029 已列 mount/reopen 查询。上述结构核验不证明运行事件实际发生、关联正确或产品行为通过。

按 Card 只读审查要求，没有修改 Design、Cases、Goal 或源码；没有运行产品 UI、浏览器、权限服务、数据库、构建或可信 RED/GREEN。

## r002 Findings 吸收状态

| 历史发现 | r003 状态 | 本轮裁定 |
|---|---|---|
| CFPI-001：RowAuth serializer 与嵌套树 fixture 不一致 | 部分修复 | wrapper 补 `dynamicTimeSetting`，但三个叶节点仍缺该字段；精确 JSON/规范化序列化口径仍不闭合。OPEN。 |
| CFPI-002：stage host 与 G2 renderer 接线/生命周期不完整 | 部分修复 | `hostId` 已改为字符串身份；共享活动 renderer hooks、实例 disposer、resize/卸载与 render queue 交接、commit 副作用仍为拟议抽取，未证安全。OPEN。 |
| CFPI-003：Copy source READ 实时权限 oracle 缺失 | 未关闭，权限阻塞 | Cases 标记 `BLOCKED / NOT_RUN` 符合边界；真实权限实现/隔离环境仍不可用。OPEN，Builder 阻塞。 |
| CFPI-004：响应绑定缺少逐字段变异 | 大体修复，残余未关闭 | CPI-041..052 对 request/target/tree/query/error/store/render capture tuple 的单字段错配及摘要已核对通过；缺少当前活动状态变化时的独立 revalidation 逐字段案例。OPEN。 |
| CFPI-005：dispatch 与 terminal outcome ledger 未闭合 | 未关闭 | 59 项 dispatch 数量结构上匹配，但 CPI-001 的一条 query dispatch 缺 terminal；CPI-021..026 各一请求被同时标记 `queryResolved` 和 `queryLateIgnored` 两个 terminal，按“每个 dispatch 恰有一个终态”违反 oracle。合计 7 项异常。OPEN。 |
| CFPI-006：TTL/容量/大小合同和权威口径 | 部分修复 | SharedWorker/拷贝案例覆盖已有；Goal 的工程提案为 1,000,000 bytes，Design/Cases 仍为 1,048,576 bytes，且 Goal 将提案标为未最终冻结。ISS-AC-02 未裁定；CPI-033 同时测 50 leaves 与 byte ceiling，维度耦合。OPEN。 |
| CFPI-007：同用户跨标签共享 | 部分修复 | 改为 SharedWorker，补 CPI-056..059，传递机制方向已存在；`createdAtMonotonic` 的产生者/跨 browsing context 时钟比较未定义，且缺 sessionEpoch mismatch、Worker 初始化失败/不可用案例。末 tab 关闭即 Worker 终止清空，与 Goal 的 30 分钟有效期关系未裁定。OPEN。 |
| CFPI-008：重载/重开 mount query 计数缺失 | 已修复（静态 ledger） | CPI-028/029 已把 reload/reopen mount query 纳入 dispatch/计数。仍只证明案例账本结构，未证明运行行为。 |

## 全量 Findings

### CFPI-001 / P2 / OPEN：RowAuth 叶节点 fixture 仍不是精确 serializer payload

**证据：** r003 给 tree wrapper 加入 `dynamicTimeSetting`，但其三个叶节点仍缺此属性。`RowAuth.vue` 的提交序列化会为树节点输出 `dynamicTimeSetting`（可能为空对象或序列化为 `undefined`，具体 JSON 语义需结合实际 stringify/规范化规则冻结）。因此 fixture 仍无法支持“逐字节/JSON 相等”的声明，或清晰地区分语义相等与序列化相等。

**需完成：** 逐项对齐 wrapper 和全部叶节点 serializer 输出；明确 `undefined`、空对象、字段缺失在实际 payload 规范化中的规则，并为比对 oracle 固定规范化步骤。不能只校准组 wrapper。

### CFPI-002 / P1 / OPEN：stage renderer 完整生命周期及发布副作用尚未形成可实现合同

**证据：** `hostId` 作为字符串身份缓解了 HTMLElement 直接作为 key 的问题，但 Design 对共享活动 renderer hooks、stage 实例 disposer 和交接的描述仍为拟议抽取。`ChartComponentG2Plot.vue` 当前活动路径负责 tooltip、主题字体、tiled legend、assist-line、slider/pagination、linkage 等 hooks，并以活动容器和 `myChart` 管理 resize；`line.ts` 的 draw 路径本身也可能触发 legend state、tooltip carousel、assist-line 等资源。Design 尚未逐项证明 stage 的 hooks 如何安装、解绑、处理 resize、在 host switch 时重新绑定，以及如何和活动组件的异步 render queue、卸载与 disposer 竞争安全地交接。

此外 stage 路径绕过标准 `calcData`。commit 合同没有完整列明 `drillFilters`、`setViewDataDetails`、`setViewOriginData`、`chart-data-change` 及其他标准路径的 Store/事件副作用如何保持等价，可能造成活动 Store 与联动视图不一致。当前案例未覆盖这一完整提交副作用合同。

**需完成：** 明确 string host identity 到真实容器的唯一解析与生命周期；枚举并约束 stage 所需 hooks、清理顺序、queue/卸载/resize 冲突和唯一 disposer；逐项定义 commit 的 Store、事件、drill/origin/detail 状态副作用与失败回滚。对 sibling-host 渲染、交互、resize、重复 paste、host 切换、异步失败、组件卸载和 cleanup 提供可信 RED/GREEN。未闭合前不得进入 Builder，也不得回退为先改活动 `view.customFilter` 再 calcData。

### CFPI-003 / P1 / OPEN：Copy source READ 授权 oracle 与真实多用户验证仍阻塞

**证据：** `ResourceAuthApi` 当前没有本调用者对 source chart/dataset 实时 READ 判定的已确认路径。用户已明确当前无可确认的隔离多用户环境、权限模块授权来源或受限测试账号；须等待维护者提供授权来源/实例。Cases 诚实将真实权限检查记为 `BLOCKED / NOT_RUN`，不能据此认定验收通过。也没有验证 Copy 后撤权、重授权、组织隔离、登录会话变化等行为。

**处理要求：** Copy 在获得真实且获授权的 source READ oracle 前必须 fail closed；不猜造权限 API，不以已载入内存的 `view.customFilter`、dashboard MANAGE、standalone、admin 或 mock 替代。保持权限案例未验证、Builder 和完整权限验收阻塞。维护者提供权威权限实现来源或隔离实例后，另行补充并运行真实多用户验证。

### CFPI-004 / P2 / OPEN：活动状态独立 revalidation 还未逐字段证明

**证据：** r003 的 CPI-041..052 每个响应 tuple 仅错配一个字段，capture/response digest 按排序 canonical JSON 复算相符，修复了 r002 的响应映射矩阵问题。但要求不仅是迟到响应和响应绑定；当用户刚更新的活动状态变化时，必须单独验证下列 guard：`dashboardId`、树摘要、query 摘要、error/store/render revisions 等。现有 CPI-026 把多个变化合并成 P1，不能辨别任一单项 guard 是否生效，也不能证实重验后重新枚举/查询的边界行为。

**需完成：** 为活动状态每个 guard 制作单字段变异案例，事件 tuple 和 expected state 明示每个 revision/digest；定义失配时是否重新查询及 revalidation 终态。与响应捕获错配矩阵分开，避免一个矩阵冒充另一个。

### CFPI-005 / P2 / OPEN：7 个 dispatch 的 terminal 账本不满足一请求一终态

**证据：** 59 个案例的 dispatch 数量与 `query_attempt_count` 相等，但按案例定义“每个 dispatch 恰有一个 terminal outcome”审查事件时：

- CPI-001 的 paste query 有 `stageQuerySuccess`，另一个 dispatch 没有对应终态；
- CPI-021、CPI-022、CPI-023、CPI-024、CPI-025、CPI-026 的单个请求同时拥有 `queryResolved` 与 `queryLateIgnored` 两个终态。

所以 7 项案例不满足 ledger 自己规定的一 dispatch/一 terminal 关系；仅长度等式不足以证明每条事件闭合。

**需完成：** 每条 dispatch 以稳定 `request_id` 贯穿 dispatch、resolve/reject/cancel/late-ignore 中唯一一个终态；若 late response 与原请求已有 resolve 并非互斥，应将其中之一明确建模为非终态观察事件并修订统一 oracle。逐案重算并验证恰好一个 terminal；保留 CPI-028/029 对 mount/reopen 计数的修复。

### CFPI-006 / P1 / OPEN：容量单位口径未由 Goal authority 冻结，边界案例耦合

**证据：** Goal 将 1MB=1,000,000 bytes 作为 engineering proposal，同时注明尚未最终冻结；Design/Cases 使用 1,048,576 bytes。不能用设计自行选择替代未定稿的 Goal 条款。CPI-033 同时改变 50 leaves 和 byte ceiling，无法单独归因容量条款通过或失败。

**需完成：** 由 Goal owner 按原 authority 对 ISS-AC-02 明确裁定并同步 Goal、Design、Cases；不得静默混用十进制/二进制 MB。把 leaf count 和 serialized UTF-8 byte ceiling 拆成独立边界案例，并明确字节数计算对象（canonical serialized payload、是否含 envelope/metadata 等）。

### CFPI-007 / P1 / OPEN：SharedWorker 时间来源、失效语义和会话隔离未闭合

**证据：** 跨标签共享机制已从无方案补为 SharedWorker，并增加 CPI-056..059，是实质修复。但 message schema 使用 `createdAtMonotonic`，未指定由 Worker 还是发送 tab 赋值；不同 browsing context 的 monotonic clock 起点不可直接互比。缺少 sessionEpoch mismatch 与 Worker unavailable/初始化失败案例。现有设计说最后一个 tab 关闭后 Worker 终止并清空，却没有裁定 Goal 所要求的 30 分钟有效期在所有 tab 关闭时是否继续；生命周期语义仍不唯一。

**需完成：** 定义唯一可信时间来源（建议由 Worker 赋值和计算 TTL），不要跨 context 比较发送 tab 的 monotonic timestamp；定义 sessionEpoch 不一致、初始化失败和 Worker 不可用时 fail-closed 行为；明确末 tab 关闭时 clipboard 是否立即失效或 30 分钟期间可重建，并由 Goal owner 确认是否符合原要求。补相应案例及身份切换/登出清理证明。

### CFPI-009 / P1 / OPEN：CPI-040 两次成功 commit 未定义第二个 paste 的目标

**证据：** CPI-040 描述两次成功 commit，但 expected state 中仍完全保留 P0，没有说明两次操作对哪个 target、是否为同一图表或其间是否切换目标。Design gate 要求 paste target 必须为空；如果两次都作用于同一 target，第二次就违反 gate，若目标不同则需明确各自状态变化。

**需完成：** 指明两个 target ID 与各自初始/最终树和 query 状态，或将该案例拆分；若测试重用 clipboard，应在第一个成功后将第二次 target 初始化为空并显式记账。保持覆盖“成功粘贴不消耗 clipboard”的原意，不允许隐含目标状态。

### CFPI-010 / P1 / OPEN：零行数据时 G2 stage render 返回值与 StageHandle 合同冲突

**证据：** `line.ts` 的普通 G2 line `drawChart` 在 `!chart.data?.data?.length` 时直接返回 `undefined`。StageHandle 却要求 `instance: G2Chart`；Design/Cases 没有零行数据下成功或空态路径，也未定义 undefined 是可接受的 empty handle、render failure 还是不可提交状态。实际绘制可空结果时这会令 stage 返回/提交合同不完备。

**需完成：** 明确并实现零行数据的显式 empty render handle/空态合同，或将 undefined 确定为失败且保证无副作用、可清理；补空数据与非空数据案例并覆盖 commit/abort。不得假定所有合法 query 都返回至少一行。

### CFPI-011 / P2 / OPEN：commit 绕过标准查询路径后的状态同步/事件清单不完整

此发现与 CFPI-002 相关但可单独验收：stage 通过直接 query/render 产生新预览，commit 却没有逐项规定标准查询链路原本更新的 drill filters、data details、origin data、Store revisions 和 `chart-data-change` 联动事件。即使图表画面可见，也无法据当前合同断定后续交互、联动、保存与撤销观察的是同一状态。

**需完成：** 建立标准 `calcData` 成功路径的副作用基线，并将 stage commit 对照到每一项；不适用项说明由何种状态替代。添加提交后状态/事件一致性和 abort 无副作用案例。不得把 DOM 成功替代数据链一致性。

## 已检查且未发现新增问题的维度

- **范围与权威：** Goal 分母保持 10 AC、26 must-have、16 产品义务，Scope Delta 为 none；本交付物仍是普通 BAR-1 → 同数据集普通 LINE-1 的有界接线候选，不声称覆盖全部图表/查询组件或完整 Goal。
- **迟到响应 tuple：** CPI-041..052 每案只错配一个捕获字段，canonical digest 重算匹配；本维度的响应 tuple 机械一致性通过，但不代表 CFPI-004 所述活动状态变化 revalidation 已覆盖。
- **统一状态投影与 dispatch 数：** 59 项都投影相同 23 字段，dispatch 数与 `query_attempt_count` 相等；仅终态事件配对仍由 CFPI-005 阻断。
- **保存/重开 ledger：** CPI-028/029 已记录 mount query，r002 的缺项修复；运行时实际 getData 次数未测。
- **权限声明边界：** 案例保留 `BLOCKED / NOT_RUN`，没有用 standalone/admin/mock 冒充多用户权限证据；此正确声明不解除权限阻塞。
- **部分交互与失败原子性方向：** 设计仍要求 gate/prepare/query/stage failure 不发布活动树、不提示成功、不保存快照；成功 commit 一次。因生命周期、副作用与真实行为未证，这仅是合同意图。
- **跨标签方案存在性：** SharedWorker 与双标签案例现已存在，修复了 r002 “无机制”问题；时钟、会话与末 tab 生命周期尚有残余，不能据此关闭 Goal 义务。

## 未检查项与原因

- 未执行浏览器 Copy→Paste→预览→显式保存→离开/重开；Card 限定只读设计审查，禁止运行 UI、构建或数据库。
- 未运行可信 RED/GREEN，也未做 stage host、G2 hooks/resize、异步取消与 cleanup 的产品级行为验证；设计和案例不等于已实现证据。
- 未验证 source READ、target MANAGE、dataset READ、只读用户查看/复制/粘贴限制、撤权与恢复、组织隔离或真实登录会话；维护者确认没有授权权限模块来源或隔离多用户实例，故保留 `BLOCKED / NOT_RUN`。
- 未对 Goal owner 的 1MB 工程提案作 authority 裁定；此项不是审查者可代替决定的范围。
- Context `output_ref` 与 Review Card 输出路径不一致；本轮依 Card 写入，未修改治理上下文。

## 修复后准入预测与后续边界

本轮已达到每交付物第 3/3 评审上限，**不得再开本交付物第 4 轮**。先按全量 findings 修订未来的实施输入，拆分新的可审交付物并在其 own card/context 中绑定具体 revision：serializer 规范化、staged G2 lifecycle/副作用、活动状态 revalidation、每请求唯一终态、Goal 对 ISS-AC-02 的 authority 裁定、SharedWorker 时间/会话/末 tab 生命周期、CPI-040 两目标与空数据 handle。因轮次上限，后续无需把这些更正冒充本轮未见版本的审查结论；如需准入评估，应建立新的明确交付物和独立治理路径，不得通过改写本报告 verdict 或重编号绕过上限。

即便上述设计问题处理完成，`CFPI-003` 所要求的真实 source READ oracle 与隔离多用户验证仍必须等维护者提供授权来源或可用实例；在此之前 Product Builder Entry 与真实权限验收保持 blocked。任何 Builder 写入前还必须单独通过 SP-010 execution admission，绑定 Goal、Completion Contract、Context、冻结 Design/Cases、当前 topology、action 与 canonical target；本次设计评审本身不提供 Builder 授权。

## 最终裁定

本轮确认 r003 对响应绑定、跨标签方案和 mount query ledger 有明确进展，部分修复项可按静态结构核验；但以上 CFPI-001..007、CFPI-009..011 仍有影响实现正确性的合同缺口，CFPI-005 还存在 7 个终态账本异常。故第 **3/3** 轮结论为 **Design Freeze `NEEDS_REVISION`、Product Builder Entry `BLOCKED / NOT_READY`**。真实权限未运行，源码/行为/浏览器/构建未验证；没有扩大或缩小 Goal 分母，不声明 S02 Goal 达成。
