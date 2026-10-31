# Area Paste Failure Design / Cases 独立语义与准入审查 r001

## 审查身份与轮次

- **审查类型：** 独立 Semantic Review，第 1/3 轮；本报告不修改 Design、Cases、Context 或产品源码。
- **审查范围：** `AreaPasteFailureDesign-r001.md`、`AreaPasteFailureCases-r001.json`、`ContextBootstrap-S02-MVP-AREA-FAILURE-r001.json`；只读核对当前 Goal、阶段 Crosswalk、MVP UI Integration Design/Cases、真实 area 失败见证、当前运行进度、Topology、相关生产 SFC/renderer 入口及受控 runner。
- **独立性：** 本审查由未编辑上述本轮 Design/Cases/Context 或源码的独立审查 lane 执行；作者/Builder 不提供自评作为审查证据。
- **必查输入摘要（SHA-256）：**
  - Design：`93508a3c2c08813e0f5153ce9ca242e1ac74044df6fd5e8bd14e86c2d6e3d7b7`
  - Cases：`8603311523fd651df76e4691117a4c0053e1a66aa7f622afbf7732bee0de317b`
  - Context：`c8bdbdce7b124ddca72410cc9d8926eaa4d159afeecd27f50cd2e461eede33c5`
  - 当前 Goal：`4db931a6764a8c48345e7e8358e579550a9bc98594bf1654647716d72b9678c4`
  - 阶段 Crosswalk：`e0a5d2aee17d9d11354d32de02b68debc4b0e7d6cc20b9b0899c55c400e284cf`
  - 实际 area 失败见证：`918bcea2b15f729c4f595abcfe7d3e9700d43fa4f0c0d9c211995e5d9ec40bf8`
  - UiIntegration Design/Cases：`ea2f947c370b554b8f9510d39924e1455c28705088bf4739df78c4725a034468` / `e365ef111582ef84f20f26e6136854409b7fc66bb0931cae40a9df5318036d55`
  - `context_bootstrap.py validate`：通过。Context required_read_set 的当前文件摘要逐项匹配。

## 双重结论

- **Design Freeze Validity：PASS WITH FINDINGS。** 设计把 area 失败限于有界诊断/修复，保留 P1→P2 次序、38 项分母、area eligible 身份和真实权限未验证边界；没有声称已有修复或 Goal 完成。发现的主要问题在冻结 Cases 的可执行 oracle 与 Context 的 Builder 写范围，需要在 Builder admission 前修正。
- **Implementation Entry Readiness：FAIL（暂不准入产品 Builder）。** 当前 Context 明确允许 Builder 写入 Design 与 Cases，违反 frozen contract/cases 不由 Builder 改写的治理不变量；此外真实失败复现的差异指纹和失败原子性状态投影尚不足以防止“用合成故障制造可信 RED”。修复这些项并对最终摘要签发精确 admission 后，可开始受限 harness 实施；生产源码修改仍须满足真实案例的同身份 RED。
- **总体：BLOCKED。** 可以继续独立修订本交付物及准备 runner；不能以当前 Context/Cases 启动会修改产品源码的 Builder，也不能把受控 runner 结果当作真实浏览器或 G2 SDK 验收。

## 发现（一次列齐本轮发现）

### F-AREA-REV-001（P1）：Context 将冻结的 Design/Cases 纳入 Builder 写范围

- **依据：** Context 第 14–20 行将 `AreaPasteFailureDesign-r001.md` 与 `AreaPasteFailureCases-r001.json` 和两个源码目标一并放入 `boundaries.write_scope`。SP-010 kernel 的 execution invariant 3 要求 Builder write scope 排除 frozen assets；同一 Context 的 `task_profile=implementation`，且 Cases 有固定 `case_set_id` / `goal_sha256` 与 `red_green_rule`。
- **影响：** Builder 可以通过调整合同、放宽 oracle 或改动病例来让实现变绿，破坏同身份 RED/GREEN 与独立审查；也可能使原 review 绑定摘要失效。Context 即使通过结构 validator，也不因此成为准入通过。
- **要求：** 新建修订后的 Builder Context/精确 admission：将已冻结 Design/Cases 改为只读 `required_read_set`，从 Builder `write_scope` 移除；源码与专用 runner 保持最小明确写域。若 Design/Cases 必须变化，走独立修订及相应 review，不允许 Builder 同 lane 修改。

### F-AREA-REV-002（P1）：真实 RED 的失败指纹尚不能排除 harness 注入的同名失败

- **依据：** Cases `AREA-PASTE-REAL-001` 第 24–28、51 行仅将 RED expected 绑定为 `paste_render_failed`，并要求零 harness 错误；原始见证只记录 query returned、1 次逻辑 getData、`paste_render_failed` 和旧过滤树保留，没有 renderer 内部阶段或 error class。Cases `AREA-PASTE-ATOMIC-002` 已单独定义在 query 后拒绝 renderer 的合成失败。现有 `check.mjs` 的 G2 harness 将 `chartView.drawChart` 替换成 test double；它可以制造 draw/render/afterRender 故障，但该合成故障不能证明真实 area 见证的故障原因。
- **影响：** 若 AREA-PASTE-REAL-001 也通过把 test double 设为 reject 来产生相同结果，runner 将把已知注入误报为真实语义 RED；修复后同一身份的 GREEN 也无法证明修复了实际失败。当前 witness 没有栈，安全地不保存原始栈是合理的，但仍需可审计且脱敏的差异信号。
- **要求：** REAL-001 明确禁止通过 fault injection 产生 RED；使用见证中的 captured request/response 驱动真实生产 SFC 的 strict prepare/render 路径。冻结的指纹至少包括实际到达的生产阶段/调用点、allowlisted 阶段码与异常类别或对应生产返回、paste result、query 次数和候选/目标状态。注入式 renderer rejection 仅用于 ATOMIC-002。若受控适配器无法让真实生产路径重现该指纹，维持 `NOT_REPRODUCED` 并转回隔离真实 UI/G2 取证，不得报 RED。

### F-AREA-REV-003（P1）：失败原子性缺少字段化、可比较的旧状态投影

- **依据：** Cases invariants 第 15–20 行要求 tree/result/dirty/save state 保持；ATOMIC-002 第 31–34 行仅用“byte-equivalent”描述旧状态，REAL-001 依赖真实见证。实际见证的 assertions 只确认旧过滤树结构未变并记下失败，未提供完整 chart result、dirty/snapshot 与保存状态前像。
- **影响：** Runner 无法明确哪些响应式/Store 字段需要比较，也无法定义是否允许 operation/loading/诊断本身变化。只检查树相同可能漏掉图表结果或 dirty 状态已变；笼统 stringify 整个 Store 又会纳入非相关时钟/运行元数据，造成不稳定 oracle。
- **要求：** Cases 固定 `TargetStateProjection` 字段表和确定性序列化：至少 target ID/type/dataset、canonical filter tree、published chart result/data 身份或稳定摘要、dirty/snapshot revision、save/load marker 与 success feedback；分别定义 query 前、query 返回后/renderer 拒绝、stale/dispose 时的 compare 时点。将操作计数/候选私有状态与必须保持不变的 canonical state 分离。REAL-001 的历史见证缺少的字段必须标 `not_observed`，不以推断补齐；在 runner 中按当前 setup 捕获 before/after oracle。

### F-AREA-REV-004（P2）：READY-003 把 save/load 行为写入案例，但没有持久化 oracle

- **依据：** `AREA-PASTE-READY-003` 第 36–38 行预期包括“existing normal save/load path can persist it”；Design 第 30 行计划在隔离开发 UI 记录保存/重开。当前 runner/write scope 是 SFC 与测试 harness，并无持久化 fixture、保存成功标志或离开重开断言。
- **影响：** 未来 Builder 可能把 SFC/harness 中的 canonical adoption 当作已证明保存重开；或者为通过窄 renderer 案例无必要扩大持久化测试范围。
- **要求：** 将 READY-003 的 runner oracle 限于候选 ready、正确目标复核与原子发布；把真实保存、离开、重开列为后续隔离开发 UI 验证项并用单独 evidence。若保留本案例的保存语句，需说明它是后续 E2E 子步且不能由本 runner 置为通过。

### F-AREA-REV-005（P2）：隐私用例尚无显式 canary 断言，容易形成真空通过

- **依据：** `AREA-DIAGNOSTIC-PRIVACY-005` 第 46–49 行要求异常含任意 message/object fields，并限定“如新增 DEV 诊断”只能含 allowlist 字段，但没有指定注入的唯一秘密 canary，也没有列明捕获 console、事件与新增 diagnostic sink 的范围。
- **影响：** 若实现不输出诊断，或测试只观察其中一个 sink，隐私用例可在未验证实际 redaction 的情况下通过；若后续把 error object 直接附到非 console 日志，此用例也可能漏检。
- **要求：** 对可选诊断明确“不启用诊断时标为 not applicable；启用时必须运行”的分支。启用时注入互不相同的 message/stack/nested-property/request/response/row/token canary，捕获本实现可达的所有日志/事件 sink，断言输出键严格属于 allowlist、值为静态阶段码/错误类别，且任一 canary 子串不出现。

## 无问题维度与边界检查

- **Authority 与 Goal：** Cases Goal 摘要绑定当前 Goal；复核 38 项分母为 P1 12 + P2 原始 26，phase crosswalk 对应项无变化。Area 仍在 P1 eligible 分母；没有把“先 MVP”改写成缩减或豁免完整验收。
- **真实证据边界：** 原始 area 见证明确是一次 query 返回后的 `paste_render_failed`，旧树保持，且未保存 area；设计没有把它说成根因已确定、area 已通过或浏览器修复完成。readonly-view warning 被正确保留为无因果证据的独立观察。
- **失败处理与权限：** candidate readiness 前不得发布 canonical state；失败/stale 保旧、清理 candidate；未将开发权限测试桩提升为真实授权，也未改只读用户/撤权验收。
- **Scope 与 Claim Ceiling：** 设计定位 renderer strict prepare/render 的局部根因，外部写域要求重新审查；清楚排除49类型全过、P1完成、真实 G2/浏览器及 Goal 完成。未发现把截图、Map unit 数量或静态推断当运行通过的表述。
- **实现路径：** Design 给出从 orchestration 到实际 G2 area ChartView 的追踪路径、根因明确后最小修改、同身份 RED/GREEN、防御验证和后续真实 UI 重跑顺序；将 SFC/harness 与 full Goal 的声明层分开。

## 未检查项及原因

- 未运行 runner、浏览器、query、数据库或保存/重开流程：本轮为只读独立设计审查，且真实区分 production cause 与 harness setup 必须在 Builder 取得当前精确 admission 后执行。
- 未验证真实 G2 SDK、area 图表修复或真实权限：本轮没有实现；原始见证也没有内部调用栈或已保存 area 配置。真实权限隔离环境仍不可用，继续 `BLOCKED / NOT_RUN`。
- 未复核其余48类与 49 类型矩阵的运行：超出 Area 有界案例，必须在 P1 全类型验收另行完成，不由本设计替代。
- 未对本轮以外的既有产品设计重新开评审；仅按其摘要/摘要绑定检查本设计的输入依赖。

## 最小修订路径、后续会话图与准入预测

1. **Review 修订（仍属于本 Design/Cases 的第 2/3 轮候选）：** 处理 F-AREA-REV-001..005；保持 P1/P2=12/26、38项全分母、area eligible、原始失败见证和真实权限限制。冻结修订版 Design/Cases 后，由新的 Context 将其作为只读输入并重新绑定摘要。
2. **RED runner-only：** 新 Builder 只改受控 renderer harness；先用真实 captured area request/response + 当前 production SFC strict 路径重现脱敏失败指纹，执行/装载错误为 0。不得用显式 fault injection 充当 REAL-001 的 RED。若无法重现，立即停下修复主张并回到隔离真实 UI/G2 取证。
3. **精确源码准入：** 只有可信同身份 RED、设计复核接受、当前 Goal/Context/Design/Cases/Topology 摘要均一致且 admission target 精确到源文件之后，才允许对明确的 `ChartComponentG2Plot.vue` 根因作最小修复；如根因需改其它路径，先做最小影响/Scope Delta 复核和新准入。
4. **GREEN 与实 UI 验证：** 同一 runner/identity 执行 GREEN、防御失败/stale/隐私测试、定向 lint/受影响 suites；再在隔离开发 UI 确认真实 area query、ready、采用，另行完成保存/离开/重开证据。此单元仍只关闭 area 有界失败，不代表其它类型或 Goal 完成。

**修复后准入预测：** 若 Context 移除对冻结材料的写权，RED 指纹确由 production path 而非模拟错误触发，failure projection 可执行且隐私测试带 canary，F-001..005 均有 disposition/验证，Design Freeze 可达到 `PASS`；重新绑定的 Context/Topology 与 runner-only admission 可先允许测试 harness 切片。产品源码 Builder 仍需等待可信 RED 独立确认；真实 UI 保存重开、49类型覆盖及真实权限验收仍按 Goal 单独保留。

## 未来误读情境与防护

1. **误读：** “真实 UI witness + runner 的同名 `paste_render_failed` 等于真实 RED。”**防护：** 固定阶段/调用点的脱敏指纹，REAL-001 不注入失败；注入只用于独立 ATOMIC-002。
2. **误读：** “目标树没变说明旧 target 完全没被污染。”**防护：** 使用字段化 TargetStateProjection 同时比较 result/data、dirty/snapshot、保存状态和成功反馈。
3. **误读：** “renderer ready 且过滤树被采用说明 area 保存重开与 P1 已通过。”**防护：** 将 E2E 保存重开写入独立真实 UI evidence；本 runner 声明上限始终是有界 candidate。
4. **误读：** “P1 当前处理 area，因此可把权限 mock 视为只读访问证明。”**防护：** 保留真实权限 `BLOCKED / NOT_RUN`，Mock 仅为开发拒绝路径测试。

**结论用途：** 本报告只给 Design/Cases 的第 1/3 轮审查判断；它不是 runner RED、Builder admission、独立产品 Validation、区域验收或 S02 终态凭证。
