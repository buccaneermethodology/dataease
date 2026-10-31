# 普通图表过滤配置跨图表复制：可体验 MVP 设计 r002

## 本交付物身份与判定边界

- Artifact ID：`S02-F01-chart-to-chart-filter-copy-product-slice`，第 2 轮；依据独立 Review r001 的 CTC-001..010 和用户明确授权的 MVP 阶段顺序修订。
- Goal authority：当前 `Goal.final.json`（已应用 S02-GR-P004）。该 Patch 仅改实施顺序：先交付实际 UI 的同数据集普通柱图→普通折线图空目标 MVP；原始 10 项 Goal AC、26 项 must-have、16 项产品义务及最终完成谓词完整保留，`Scope Delta: none`。
- MVP 的单一可体验路径：用户在来源柱图编辑器内创建一个文本字段的静态枚举条件 → 通过专用按钮复制 → 打开同数据集普通折线图且其 `customFilter` 为空 → 粘贴 → 看到目标条件完整回显且图表数据按条件变化 → 使用现有仪表板“保存” → 关闭并重开，条件仍在。
- MVP 声明上限：只有产品界面/本地兼容路径和正常保存重开被独立验证后，可报告 `MVP_FUNCTIONAL_PATH_VALIDATED`。这不关闭全量 AC-F01-Q004/Q006/Q007/Q014/Q015、权限角色/撤权验收、其他图表组合、query组件、表/透视表、完整过滤结构、ORIG-02 或 S02 Goal。
- 完整最终分母仍是 Goal.final 中原 10/26/16，不以阶段路径重分类、删除或宣称通过任何不在本合同内的项目。

## S01 条件处理与用户授权

Goal 原进入条款要求绑定 S01 F01 Entry Packet、独立审查与终态证据摘要。用户现明确授权先做可体验 MVP；Goal Patch S02-GR-P004 记录了最小调整：**本 Slice 不依赖 S01 F01 终态即可进行窄化实施，但仍绑定当前 CONDITIONAL Entry Packet，复用所给局部证据并完成本 Slice AC/Gap 覆盖与独立审查**。不改、不抢占 S01。

逐项边界：

- 当前 Entry Packet 状态继续是 `CONDITIONAL`；不伪称 S01 已完成或把旧包当终态。
- 首个 MVP 的 bar→line 路径不依赖 S01 的旧组件复制/改类型流程。AC-F01-ORIG-02 仍为单独未验证兼容项；若设计或代码触及既有复制/改类型路径，先停止该改动或等待对应 S01 证据。
- 真实只读角色、来源读取权限、撤权/恢复及目标保存权的多用户行为仍受权限环境缺失限制，保持 `BLOCKED / NOT_RUN`。这阻止相关安全验收和完整 Goal 完成，不阻止在既有产品编辑入口内做普通功能路径。
- MVP Builder admission 必须附本 Goal Patch、当前 S01 Entry Packet SHA、该 Entry Packet 与本 Slice 的逐项 AC/Gap 对照、设计/案例/可信 RED SHA、实际 branch/HEAD/worktree 摘要和 action/target 精确 admission。

## 真实调用路径和既有访问边界

1. **来源读取/复制：** 只读取编辑器已载入的当前 `view.customFilter`；不新增源图表取数接口，不读取 RowAuth 临时事件对象。复制按钮仅在图表编辑器 `editMode === 'edit'` 且图表为本 Slice 的来源类型时出现。`editMode` 只是现有界面的交互门槛，不作为权限证明。
2. **本地复制隔离：** 内部复制 envelope 写入同源 `localStorage` 供同一浏览器跨标签访问；记录 uid/oid、来源图表 ID、tableId 与 copiedAt，不保留 token。身份缺失/变化、用户/组织不匹配、注销、过期、损坏或存储拒绝时不可消费并清理/保留旧值按下文约定。localStorage 身份标记只做隔离，不授予访问权。
3. **数据集兼容：** 先校验 source/target `tableId` 非空且严格相同，再调用既有 `checkSameDataSet(sourceViewId,targetViewId)`（`/chart/checkSameDataSet/{sourceViewId}/{targetViewId}`）。本地不一致时不发 API；请求拒绝、超时、非法响应或非肯定结果都 fail closed。此 API 仅验证同数据集，不代替 source-read、dataset-access 或 target-edit 鉴权。
4. **目标修改/查询：** 目标必须是当前编辑器的普通折线图、`editMode === 'edit'`，且其过滤树为空。只在全部同步校验成功后以完整深拷贝替换 `view.customFilter`；复用既有 `calcData(view)` 发出目标图表刷新与 snapshot 记录。不改 API 的权限实现、不触碰 RowAuth 编辑提交、不自动保存。
5. **持久化：** 用户显式点击当前仪表板保存按钮，沿用 `canvasSave` 的冲突检测、请求和失败处理。重开必须读取已保存目标组件的 `customFilter` 并与源配置深相等。MVP 不新增保存接口、不绕过现有后端访问检查。源图表和同画布其他图表保持不变。
6. **真实权限声明：** 当前核心源码可以定位编辑器状态、数据集兼容 API、图表查询事件与 canvas 保存入口，但没有可用的真实 XPack 权限实现/测试环境来独立证明来源读取与目标保存的角色检查及撤权时效。MVP 运行若在本机进行只可记为功能路径观察，必须另行验证真实角色后才可宣称权限 AC 通过；不得用 standalone/admin/mock 代替。

## 冻结的 MVP 输入与应用合同

### 支持矩阵与过滤形状

- 本 Slice 唯一支持组合：普通柱图 (`bar`) → 普通折线图 (`line`)，同一数据集，目标过滤配置为空。其他方向、同类图表、非空目标粘贴一律不暴露/拒绝；覆盖确认暂后置，不是本轮行为。
- MVP 支持 AND/OR 组合树及 1–50 个文本字段枚举叶子（每叶必须 `type:'item'`、非空 `fieldId`、`filterType:'enum'`、`term` 为 `in` 或 `not in`、非空 `enumValue`、`subTree:null`）；组合节点必须 `type:'tree'`，且具备 AND/OR 的 `subTree`。过滤项 JSON 持久形状不含 `deType`，来源/目标字段类型均从各自已加载数据集字段目录按精确 `fieldId` 查得并比较；目标目录缺字段或类型不一致拒绝，禁止根据字段名称相同推定身份。叶子完整保留 RowAuth 提交后的序列化属性，包括 `timeType`、`value`、`filterTypeTime`、`timeValue`、`dynamicTimeSetting`；不得重建或删除属性。
- 空树、空组合、未知节点形状、非文本/非枚举/动态时间、字段缺失或目标不完整承载，都在目标变更前整次拒绝；提示使用既有产品反馈机制，错误提示 `过滤条件不匹配，请重新复制`。本 Slice 不尝试转换、删字段、部分映射或复用 `ChartFilterPayloadDesign-r003` helper。
- 深拷贝边界：复制与读取均 JSON-safe；粘贴构造新对象，并与源、storage 中的树引用独立。只允许完整 equality，不做 merge。

### 载荷、TTL 与大小

- Clipboard envelope 使用 `schemaVersion=1` 并包含 uid、oid、sourceViewId、tableId、copiedAt 和过滤配置。大小只按 Goal 明确的“完整版本化过滤配置载荷”计量：固定顺序 JSON 对象 `{schemaVersion:1,logic,items}` 的 UTF-8 未压缩序列化字节数；不含 envelope 元数据。实现必须由 `JSON.stringify` 的该固定投影和 `TextEncoder` 实测，禁止用 UTF-16 `string.length`、字符数或 JSON 文本 MB 替代。
- 叶子节点上限 50，组合节点不计叶子；配置字节 `<= 1,000,000` 允许，`> 1,000,000` 拒绝；复制失败保留上一个有效剪贴内容。1–50 叶在 MVP 支持形状内；恰 50 叶与容量等值点必须分别由产品合同用例验证。
- 30 分钟 TTL 在本 Slice 冻结为 `0 <= nowMs - copiedAt < 1,800,000` 可消费，恰 `1,800,000ms` 起过期；要求 `copiedAt`、`nowMs` 均为有限安全整数且无未来时间。读取/失败/刷新/粘贴不消耗、不续期；只有新复制设置新 `copiedAt`。恰 30 分钟判定为本 Goal 已给出的 30 分钟有效期与工程规则的显式边界解释，不外推为可信服务器时间。可由本地时钟改变的风险仍需在真权限/时间 authority 到位后评估，不能宣称抗回拨。

### 原子性与预览语义

- 用户拒绝、空/损坏/不支持载荷、身份/组织不匹配、时效/容量超限、资源 ID 缺失、数据集不同、API 错误/非肯定、目标非空、目标类型不符或字段不承载时：目标树、剪贴板、dirty/snapshot、预览、save 请求计数均不变；不显示成功提示、不触发目标图表刷新。
- 成功 apply 为一个同步操作：所有校验先完成，先构建完整独立副本，再记录 undo snapshot 并一次性替换目标 `customFilter`；随后只对目标发出一次逻辑 `calcData` 调度。`calcData` 返回 void，只证明调度，不证明查询完成。
- 功能成功反馈仅在相应目标图表 query 成功并完成当前结果渲染后出现。query 请求被拒/异常/超时/响应过期时保留已完整应用在编辑态的目标树、保持未保存状态，不提示“已应用”，显示查询失败反馈；不回滚为旧条件、不清除剪贴板、不自动重试或保存。用户可修复/重试或通过既有撤销恢复。此边界将“粘贴应用”和“预览取数结果”分开，避免错误报告预览成功；需要验证不会出现新树配旧图的混合状态。
- “一次逻辑刷新”指对目标 chartId 记录一次 `calcData` 请求事件及 snapshot calc 标记；底层网络 query 数量由现有事件/关联请求观察，不强制等于 1。`checkSameDataSet` 请求与图表数据查询分别计数。
- save 失败按既有 save error 展示，继续未保存编辑树；不得记录“保存重开成功”。关闭/重开只有已确认 save success 才用于 durable equality。

## 端到端场景与当前非目标

- Frozen Cases：`ChartToChartFilterCopyProductSliceCases-r002.json`。它包含一条实际 UI 纵向 MVP 场景，并将必要同步安全拒绝拆为独立 oracle；不会以 helper/harness 取代产品 UI 证据。
- MVP 通过条件：从 UI 配置一条共享文本字段枚举条件；专用 copy/paste 后，目标字段值、预览返回行和过滤配置与源完全一致；没有系统剪贴板写入或自动保存；显式保存成功后重开目标图表相等且源/其他图表未变。
- 对用户身份、权限、撤权、恢复、正常会话失效的角色行为保持未验证，所需真实权限隔离环境未提供。
- 非空目标覆盖确认、柱→柱/线→线/线→柱、动态时间/数值/其他字段形态、跨图表之外的过滤复制、表/透视表/查询组件复制、完整异常矩阵、S01 ORIG-02 回归列为后续 Slice；并保留原 Goal 的验收状态。

## 验证及 Builder 进入要求

- 当前 Design r002 仍是候选；该版本审查前不能修改产品代码。提交独立 Reviewer 对本设计、Cases、Goal Patch、S01 条件、权限声称、payload fixture、边界 oracle 和最终 AC 保留范围进行全量 Review，并要求一个双 verdict。
- 进入产品 Builder 还需：Frozen Cases 同一 identity；可信 RED（在产品代码未改时，至少证明当前 UI 没有这条完整功能路径/合同失败；不是纯 helper 字符串断言）；Builder 复验代码 HEAD、工作树与 Source Entry Packet 摘要；生成 action=`implement-mvp-chart-filter-copy`、canonical target 为 editor 产品入口/clipboard store 的精确 execution admission。
- 真权限环境不是 MVP 功能路径代码修改的准入依赖，但仍是权限验收和 S02 完成的阻塞项；如果实现发现必须引入新权限服务或后端未提供能力，停止相应路径并记录 blocker，不默认放行。
- Claim ceiling：独立验证成功后仅 `MVP_FUNCTIONAL_PATH_VALIDATED`。不得称 Builder 自测为独立验收，不得称完整 S02/F01 完成、权限通过、生产可用或收益目标达成。
