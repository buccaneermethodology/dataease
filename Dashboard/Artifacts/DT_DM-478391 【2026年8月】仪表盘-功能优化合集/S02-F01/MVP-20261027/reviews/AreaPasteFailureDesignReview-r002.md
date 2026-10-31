# Area Paste Failure Design / Cases 独立语义与准入审查 r002

## 审查身份与轮次

- **审查类型：** 独立 Semantic Review，第 2/3 轮；本轮只写本报告，不修改 Design、Cases、Context 或源码。
- **审查对象：** `AreaPasteFailureDesign-r002.md`、`AreaPasteFailureCases-r002.json`、`ContextBootstrap-S02-MVP-AREA-FAILURE-REVIEW-r002.json`；同时逐项对照 r001 的五项 findings、Goal、Phase Crosswalk、MVP UI Integration Design/Cases、真实 area 运行见证、现有 SFC/harness 读集及其摘要。
- **独立性：** 本审查未参与 r002 的编辑，未修改任何输入文件或产品代码。为完成本次审查，直接读取了 Context 未列入 required_read_set 的两份 r002 审查对象与 r001 review；这些手动读取不修复 Context 自身的输入绑定缺口。
- **必查输入摘要（SHA-256）：**
  - Design r002：`19786abfda64f68ad1b84ed7cb617c92425c855a6df0f641e4d2bcb64762cb92`
  - Cases r002：`2d76c76a855ae356e7863709aaa5be3b7b5dfcae6cc68cbb07bbf0dd80e996ec`
  - Review Context r002：`5f17c7f0d7442a1619dff277d8c1ef71e6930ca0fce5a7091d0aebcb7d9b6d87`
  - r001 Review：`70d33ac9296dd7c96d4e6331f9dd8f9e6c3a49063eded731610cb51d6cd468dc`
  - Goal：`4db931a6764a8c48345e7e8358e579550a9bc98594bf1654647716d72b9678c4`
  - Phase Crosswalk：`e0a5d2aee17d9d11354d32de02b68debc4b0e7d6cc20b9b0899c55c400e284cf`
  - 真实 area 见证：`918bcea2b15f729c4f595abcfe7d3e9700d43fa4f0c0d9c211995e5d9ec40bf8`
- **机器检查：** `context_bootstrap.py validate` 返回有效；Context 中实际列出的 required-read 文件摘要均与当前字节相符。结构有效不证明 required-read 集完整。

## 双重结论

- **Design Freeze Validity：PASS WITH FINDINGS。** r002 加强了全分母、真实 RED 约束、状态投影、保存重开边界与 canary 隐私约束，且不冒称根因已知或 area 已通过。仍有 Context 输入绑定、stale 情形状态基线、历史见证观测分类及诊断 allowlist 可执行性缺口。
- **Implementation Entry Readiness：WEAK。** 当前可安全开始的只有只读生产阶段探针与 runner 装载/取证准备；冻结 REAL-001 仍明示 `blocked_until_sanitized_production_fingerprint_is_observed`。不能开始产品源码 Builder，不能把注入故障算作真实 RED。另需先修正 Context required_read_set 并修订残余 oracle。
- **总体：BLOCKED（产品源码 Builder）。** 可以继续受控只读探针；达到完整可信 RED、修订 findings、独立复核并绑定精确 admission 后再实施。Review Context 自身不可当作完整的目标输入包。

## r001 五项 Finding 逐项 disposition

1. **F-AREA-REV-001（P1，Builder write_scope 含冻结 Design/Cases）：已关闭。** Review Context `boundaries.write_scope=[]`；Design r002 第 11 行也明确冻结后 Design/Cases 只读、修改需新修订及独立审查。
2. **F-AREA-REV-002（P1，RED 易被同名注入故障伪造）：设计层已关闭，可信 RED 尚未发生。** Cases r002 第 27–39、62 行禁止注入 REAL-001、要求生产 SFC 路径及脱敏阶段指纹，并将案例状态明确设为 fingerprint 观察前 blocked。ATOMIC-002 独占注入。符合“不将模拟失败称 RED”的要求；下一步仍必须实际取得生产指纹。
3. **F-AREA-REV-003（P1，失败原子性无字段化旧态投影）：主要修复，仍有 stale 基线残余。** Cases r002 第 74–121 行给出字段、观测点和不落盘规则，足以定义普通拒绝情形的投影；但 STALE-004 在目标被编辑/切类型后，未说明比较基线是该用户操作后的最新态还是 paste 前状态，见 F-AREA-REV-202。
4. **F-AREA-REV-004（P2，READY-003 将保存重开放入 runner 但无持久化 oracle）：已关闭。** Cases r002 第 47–49 行明确 runner 只验证 ready/采用并不 claim persistence；真实 save/leave/reopen 是独立隔离 UI evidence。Design r002 第 16、31 行与之相同。
5. **F-AREA-REV-005（P2，隐私测试无 canary/全 sink）：部分关闭。** Cases r002 第 58–59 行增加唯一 canaries、可达 sink 捕获及 NOT_APPLICABLE 分支；但没有列出严格 allowlist 的确切键和值，因此暂不能由冻结病例机械判定输出形状，见 F-AREA-REV-204。

## 新增与残余发现

### F-AREA-REV-201（P1）：Review Context 未绑定本轮被审对象和上一轮报告

- **依据：** Context 第 5–6 行明确要求审查 Design-r002/Cases-r002 并复核 r001 的五项 finding；但 `required_read_set` 实际只列 AGENTS、Skill、Goal、授权、Crosswalk、UiIntegration 两文件、运行证据/Topology 与三份生产/runner源码。没有 `AreaPasteFailureDesign-r002.md`、`AreaPasteFailureCases-r002.json`，也没有 `reviews/AreaPasteFailureDesignReview-r001.md` 的路径和摘要。Context validator 通过仅证明 schema/摘要格式，不能补上缺失输入。
- **影响：** Context 声称的审查任务不受该 Context 自身完整摘要绑定；后续 reviewer/复验者无法从 packet 确认检查的 Design/Cases 身份，也无法严格核定上一轮 finding 的关闭状态。这是审查证据可复现性和独立性问题。
- **修复要求：** 下一份只读 Review Context 把 r002 Design、Cases、r001 Review 作为 required-read 输入并绑定实际摘要；重新验证 Context。当前审查已手动检查这些文件，但该事实不将 Context 的缺口转为 closed。

### F-AREA-REV-202（P1）：STALE-004 的状态比较基线未定义，可能把用户编辑误判为污染

- **依据：** Cases 第 52–55 行的 setup 同时包含“target edit/type switch/unmount”，expected 却只说 projection 在 stale/dispose points 不变；projection 第 109–113 行只列 `stale_or_dispose`，没有定义 user action 前后何时 capture baseline。目标编辑和切类型本来会改变 projection 中的 `render_type`、filter tree、revision 等字段。
- **影响：** 若与 paste 前状态比较，会把被允许的用户编辑误当成系统污染；若在迟到响应之后才建基线，则又可能把污染吸收成新状态而真空通过。一个复合 setup 也无法分别证明 edit、type switch、unmount 三种失效路径。
- **修复要求：** 分解为至少 target-edit/type-switch 与 unmount/dispose 子案；对交互类先执行用户更改并 capture `invalidation_baseline`，再释放迟到候选，比较候选完成前后的 canonical projection 必须等于该 invalidation baseline。unmount 子案声明无目标发布面，逐项验证 no publish、handle disposed、no late callbacks/events。

### F-AREA-REV-203（P2）：历史见证把已观察身份字段误标为 `not_observed`

- **依据：** Cases `historic_projection` 第 31–33 行把 `target_id`、`target_render_type`、`dataset_identity` 标为 `not_observed`。真实见证 `RuntimeAreaPasteFailure-r001.json` 的 `queryObservation` 实际含 `targetId`，request 含 `id`、`type=area` 和 `tableId`；这些字段均可从 durable witness 读取。结果/dirty/save 状态前像仍确实未观察。
- **影响：** 把已观察事实降成 Unknown 会损失可用于复现的 identity/context，并与“not_observed 不推断”的证据纪律相反；同时可能让后续 runner 没有区分 witness 中已知身份与不应落盘的数据值。
- **修复要求：** 将上述字段标为 `observed_in_witness` / `available_not_reused` 并只存稳定脱敏引用或字段级“已观察”状态，不需复制真实 ID；保留 result/dirty/save 字段为 `not_observed`。交代敏感值为什么不进入持久报告。

### F-AREA-REV-204（P2）：Privacy-005 仍缺可执行的静态 allowlist schema

- **依据：** Design 第 12–13、17 行和 Cases 第 28、59、115–119 行使用 `allowlisted failure-stage`、`static keys`、`static stage/error categories` 等名称，却没有列出确切诊断键名、允许的阶段码和错误类别集合，或引用一个冻结 enum/schema。
- **影响：** Canary 能证明特定秘密值未泄露，但无法断言输出是否包含额外非敏感/敏感属性，也不能机械验证 stage/error 值是否来自封闭集合。r001 Finding 005 因此只部分关闭。
- **修复要求：** 在 Cases 中列出最小封闭对象 schema/枚举（例如固定 `stage_code`、`error_class_code` 与版本字段的允许/可选集合）；若不生成诊断则标 NOT_APPLICABLE。捕获 sink 后校验 exact allowed key/value set 与 canary absence，不记录实际 canary。

## 无问题维度

- **38 项分母与排序：** 当前 Goal ledger 为 38 项且全 pending；Crosswalk 仍是 P1=12、P2=26、total=38，digest 绑定当前 Goal。r002 只处理 P1 四项 AC 的已观测 area 失败，没有迁出 Area、删减 P2、改变完成规则或把 MVP 说成终态。
- **权限边界：** Design 第 7 行维持真实多用户权限/撤权 `BLOCKED / NOT_RUN`，测试桩不替代真实鉴权。未见 admin/standalone 权限替代。
- **RED 边界：** REAL-001 禁止 injected failure；要求 production SFC 调用和阶段证据；确实无法获得时返回 BLOCKED_ORACLE，而非把失败包装成 RED。见证已明确没有内部阶段、异常类别及结果/dirty/save 前像，没有虚构这些数据。
- **状态投影与数据最小化：** 新字段 projection 覆盖身份、类型、dataset、filter tree、结果身份、dirty/snapshot、save/load marker 和反馈计数；运行时在内存比较，持久 evidence 只记录 per-field status；无业务行或整个 Store dump。
- **保存隔离与 claim ceiling：** runner 不声称保存/离开/重开；产品证据单独由隔离 UI 提供。设计明确不证明 G2 SDK/真实浏览器、其余 48 类型、全 49 类型、P1 MVP、权限或 S02 完成。
- **读集摘要：** Context 已列引用的当前内容摘要全部匹配；required-read set 没有摘要漂移。缺陷是 required-read 遗漏审查对象，而非现有条目 hash 不一致。

## 未检查项及原因

- 未运行 runner、实际 UI、query、数据库、保存重开或用户权限：本轮受命为只读评审；RED 要先有无注入的真实生产阶段指纹，源码修改仍未获这份审查的实施准入。
- 未复验 49 类型矩阵与全部 Goal oracle：不属 Area 单一失败 Design/Cases 的执行面，既有 P1 全类型验收另行承担。
- 未判定实际 renderer 根因：现有运行见证只证明 query returned 后 `paste_render_failed` 与原树保持；没有 renderer stage/error class，且 readonly-view warning 无因果链。不得从源码形态猜根因。
- 未检查真实权限测试环境：当前仍无经确认的多用户隔离实例，相关真实鉴权验收继续 `BLOCKED / NOT_RUN`。

## 最小后续路径与修复后准入预测

1. 新修订 Context：纳入 Design-r002、Cases-r002、r001 review 的准确摘要；write_scope 继续为空；结构验证后让第 3/3 轮复核完整输入包。
2. 修订 Cases：分解 stale 基线、纠正历史 witness 身份字段状态、冻结 privacy allowlist。Goal hash、case identity、Design ref 和所有被引用摘要随修订重新绑定。
3. 只读诊断/受控 adapter 准备：不可注入 REAL-001；获取来自真实生产 SFC path 的脱敏 stage/error fingerprint 和零 setup/execution error。若取不到则保持 BLOCKED_ORACLE，回隔离 UI/G2 继续取证。
4. 独立复核通过后，才创建 runner-only RED admission；生产源码 Builder 继续等待可信同身份 RED、精确 source admission 与无写冲突的当前 Context/Topology。获得 RED 后再做最小修复、同身份 GREEN 与独立验证。真实保存重开和其余类型运行分别验证。

**修复后准入预测：** 若 Context 的 required-read 覆盖审查资产、STALE-004 的 invalidation baseline 可逐用例判定、historical projection 与 durable witness 一致、隐私 allowlist 闭合，Design Freeze 可达 `PASS`。REAL-001 若仍无阶段指纹，Implementation Entry 仍只能允许只读诊断，不允许 source Builder；只有可信生产路径 RED 及新精确 admission 才可实施源码变更。即便 Area candidate 最终通过，也不能升级为 49 类型、真实权限、P1 或 S02 Goal 完成。

**审查记录：** 本报告为 AreaPasteFailureDesign/Cases 的第 2/3 轮；它不代表 RED、源码准入、产品运行通过、真实权限验证或 Goal 终态。
