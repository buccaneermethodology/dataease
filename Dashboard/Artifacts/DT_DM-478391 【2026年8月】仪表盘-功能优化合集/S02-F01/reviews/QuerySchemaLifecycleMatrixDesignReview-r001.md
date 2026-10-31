# Query Schema Lifecycle Matrix Design Review r001

- Review card: `S02-QUERY-ADAPTER-FIELD-LIFECYCLE-DESIGN-REVIEW-r001`
- Card SHA-256: `bd71df0bbf7865f27568a2e2d337e8a815264b8d29448b8727eba9c4edfc9d0a`
- Context SHA-256: `e59c1401c3117b2c5c32b4050ea3abc1fef22184634d6e97619e8bff4d3d7095`
- Goal SHA-256: `f562da2eb14b84dc8083e138dd2eb8718a58041f01d08163eddf5fb2c71daef0`
- Review mode: independent semantic review, full baseline
- Write scope: this review report only

## Verdicts

- **Design Freeze Validity: PASS WITH FINDINGS（仅限源码发现候选；不构成完整字段合同冻结）**。候选明确标出未冻结字段全集、历史兼容和运行时提交边界，未把静态设计提升为产品证据。下列 P1/P2 finding 关闭前，不得把本矩阵用于冻结白名单或实现产品适配器。
- **Implementation Entry Readiness: FAIL（当前不可进入产品适配器实现）**。矩阵仍有已知源字段没有逐字段动作，多个关键 oracle 仍有策略分叉；源码也未证明粘贴入口、实际状态发布和失败回滚。可继续做只读发现与候选修订，当前不得据此启动产品 Builder。
- **Overall Verdict: BLOCKED_FOR_FREEZE_AND_BUILDER**。本 verdict 只约束本矩阵及其候选切片，不关闭父 Goal 的门槛，也不签发 Builder admission。

## Baseline and scope

Card、Goal、Context digest 均与卡片绑定一致；Context required read set 的 24 项文件在本次复验时均匹配所 pin 的摘要。复核覆盖卡片指定的生命周期矩阵、fixtures、Product Adapter Design r002、Schema Discovery r002、Gap Reconciliation r001、Adapter Design r007、Shape Matrix r002，并定位相应前端源码。

父 Goal 的原分母保持为 10 项 Goal AC、26 项 must-have、16 项产品义务。Goal 声明完整完成需要所有要求、独立验收和最终 Gate 成立；当前 16 项产品义务仍未验收。真实 XPack 权限来源和隔离多用户环境不可用，故只读用户不可查看/复制/粘贴及授权撤销/恢复继续 `BLOCKED / NOT_RUN`。不以 standalone、admin、mock 或本次静态审查替代这些验收。Scope Delta audit 也记录批准的 Scope Delta 为 0、26 个 ledger 项为 pending、16 项产品义务为 NOT_RUN（`ScopeDeltaAudit-r001.md:3-6,8-58`）。

## Findings

### QSLR-01 — P1：已知初始字段没有生命周期动作，矩阵不能成为可执行字段合同

**证据。** `options.ts:8-65` 的 `infoFormat()` 默认对象包括 `showError`（11）、`auto`（47）；`attributes` 又含 `resultMode`（92，已在矩阵第25行分类）。矩阵第21-44行没有为 `showError`、`auto` 指定 KEEP/REBIND/RESET/REMOVE/REJECT，也没有把它们明确列为 shape-specific unknown/reject。矩阵第46行承认字段并集未完整证明，但遗漏的已知键没有逐项进入 unknown 状态。相比之下，Schema Discovery r002 将它们明确列在默认对象字段并集/调查入口中（该文件“新增源码直接证据”及“初始字段并集”段）。

**影响。** 未来按矩阵实现的过滤粘贴可能静默丢弃或透传这些配置，违反整份配置完整承载、未知字段失败关闭及动态/显示规则兼容边界；因此字段级白名单不能冻结。

**最小处置。** 扩充矩阵，逐字段补源码证据、语义、候选动作及目标不支持 oracle；若本轮不能确认语义，标为 `unknown → reject before write` 并在 fixture 增加含该键的正/负例。随后重新做独立审查。不要将其改成“产品永久不支持”。

**Disposition:** OPEN; blocks full matrix freeze and product-adapter implementation entry.

### QSLR-02 — P1：字段候选有明确 unknown 边界，但缺少可直接执行的最小子合同与准入梯级

**证据。** 矩阵第46、69-75行保留完整多形态 schema、参数、时间/数值/树、历史迁移、映射 authority 和产品入口为 unknown；第67行要求继续复核 Pinia/action、嵌套路径、保存/撤销及回调异常。QSL-012 仍标 `design_candidate_requires_runtime_validation`，其 `authorized` 是占位符，且 `vue_runtime_atomicity` 明言未证明。Gap Reconciliation r001“完整查询适配器的未决合同”第1-5项也要求按完整形态补齐 schema/身份/事务 oracle。矩阵提供了下一轮调查方向，但没有确定下一子合同的唯一输入 shape、完整目标输出、执行边界和成功/失败判定集。

**影响。** Builder 若只拿到矩阵，仍需自行选择字段子集、推断目标形态及构造提交边界；容易重启广泛设计、遗漏合法查询控件，或把单选 helper/静态推导扩大成产品适配器。

**最小处置。** 下一设计 Session 先以一个源码可达且维护者允许的单一 shape 为界，列出完整输入与输出 `propValue/cascade`、每字段动作、完整身份映射、可重放 positive/negative fixtures、零副作用失败状态及单次成功预览 oracle；标注不覆盖的合法形态仍是父 Goal 未关闭义务。完成独立审查后，才可单独判断该切片是否具备精确 Builder admission。当前无 admission。

**Disposition:** OPEN; blocks Builder entry. This is an implementation-entry gap, not evidence that every future product shape is impossible.

### QSLR-03 — P2：目标枚举缺少源默认值时的行为在候选中仍为二选一

**证据。** 矩阵第27行允许“显式显示无效或拒绝确认”，没有定唯一行为。QSL-007 的状态为 `policy_pending`，同时要求 `target_display: invalid` 和 `confirmation: reject until user resolves or target contract defines an explicit resolution`。这没有区分“候选编辑态展示无效但禁止提交”和“对话框/粘贴整体立即拒绝”，也没有规定目标旧树、历史、预览/查询是否保持不变。

**影响。** 两种策略可产生不同用户流程和目标持久态；实现者不能从当前 fixture 判定哪种行为符合维护者意图，无法构成稳定 oracle。

**最小处置。** 维护者或权威产品合同选定单一策略。若采用可修复候选态，明确 invalid 只在未提交候选展示，未消解前确认被拒绝，原目标、历史、预览和查询零变化；若整体拒绝，则明确诊断位置和同样的零副作用预期。将决定映射到原 AC，再更新 fixture 并复审。

**Disposition:** OPEN; blocks default-value behavior freeze, not source discovery.

### QSLR-04 — P2：unknown key 的结果枚举不一致

**证据。** 矩阵第44行对未知/历史键使用确定动作 `REJECT`；QSL-008 的 expected 却为 `REJECT_OR_UNKNOWN_BEFORE_WRITE`，另将兼容策略留为 `unknown`。QSL-014 又要求 matrix status 为 unknown、任意 drop/pass-through 均禁止。`QueryAdapterDesign-r007.md` 与 Gap Reconciliation r001要求未知形态 fail closed，但它们没有把 unknown 的证据状态和执行结果统一成一个 fixture oracle。

**影响。** “unknown”是证据/设计状态，“reject before write”是执行决定；把两者并列为允许结果会让同一输入在实现时有不同 outcome，也无法精确验证是否误写。

**最小处置。** 区分字段知识状态与转换结果：未登记 schema/key 一律报告 `UNKNOWN_SCHEMA_OR_KEY` 并在写入前 `REJECT`；fixture 断言目标 `propValue/cascade`、历史游标、预览 ID 和查询计数全不变。若某版本兼容规则获证，再通过版本化矩阵明确处置，不回填猜测。

**Disposition:** OPEN; blocks deterministic unknown-field oracle.

## Bounded semantic assessment

矩阵对动作分类的方向是合理的：配置意图和运行选择分开；组件、条件、dataset/query/field、级联节点与映射 key 的身份域区分开；级联复合引用按 ID 段解析，禁止 JSON 全文字符串替换及名称回退；缺映射、环、断边、目标 revision 漂移应整次拒绝。矩阵第21-44行和 fixtures QSL-001/003/004/005/006/010/011对此有候选 oracle。已有整组件复制 `copy.ts:50-66,123-145` 虽递归收集组件和 VQuery condition ID，再对 JSON 字符串做 ID 替换，但不能证明查询过滤 payload 的字段闭包或安全重绑；候选正确地未将它当作适配器契约。

提交边界也明确区分了设计要求与现状：`QueryConditionConfiguration.vue:1592-1628` 存在 managed confirmation preparation，`1633-1667` 经 callback 发布，`1680-1704` 保留先清空、nextTick 回填和之后查询的 legacy 路径。该证据支持“不可直接复用确认按钮作粘贴提交”，不能证明单同步 action 对 Vue/Pinia 观察者天然原子。矩阵要求 revalidate 后一次发布、发布前失败零副作用、异常回滚或证明 callback 不抛错、第 65 行单次快照与一次预览；这作为候选约束是合适的，运行闭包仍待真实实现验证。

身份完整性目前足以支持继续发现，但不足以冻结：fixtures 明确区分 canvas component、query condition、dataset/query/field 三段映射、cascade node 和 component key；还需对合法字段映射来源及每个 shape 的 authority 做版本化证据，不能把占位映射或合成 ID 当真实目录授权。QSL-003 复合键编码与 `QueryCascade.vue:68-88,142-165` 可见的 `dataset--query--field` 选择值及独立节点 id 相符；分隔符冲突/空值/历史形态仍须保留 unknown。

## Minimum next slice and session map

下一步仍是 **设计与源码发现**，不进入产品 Builder：

1. **Field Inventory 修订**：对 `options.ts:8-65,80-137` 的每个默认键建立可追溯矩阵条目，并沿 `QueryConditionConfiguration.vue` 保存/恢复、`Select.vue`、`Component.vue`、`useFilter.ts` 和 `QueryCascade.vue` 补足 shape-specific 动态字段。字段语义不明时标 unknown，并在写入前拒绝该候选 shape。
2. **精确子合同**：选择唯一可被源码和维护者合同支持的 shape；写出完整 input/output、全 ID 映射、目标能力断言、动作表与正负 fixture。覆盖取消、目标变化、缺省/额外键及候选失效，固定旧配置/历史/预览/查询零变化 oracle。
3. **Commit Oracle**：从真实产品入口梳理 target Store、嵌套组件、快照、undo/redo、save/reopen 的事件顺序；用同一 frozen case identity 规定 prepare/revalidate/commit 失败和成功下的完整状态向量。静态源码和 synthetic fixture 不可标成运行通过。
4. **独立审查与准入**：重新绑定候选和 Context 摘要，复验 Scope Delta/Goal 分母与权限上限；只有设计复审通过且 Goal 的 Builder 进入门槛、实际 topology 和精确 execution admission 满足时，才另行启动对应产品实现切片。真实权限环境缺失期间相应权限义务仍 `BLOCKED / NOT_RUN`。

可用于未来单行状态的安全措辞：`VQuery lifecycle candidate reviewed with findings; full schema and product implementation not admitted`。避免使用 `schema frozen`、`adapter complete`、`permissions covered`、`ready` 或 `S02 complete`。

## Future-agent misuse cases

1. **将候选动作表当作完整白名单。** 结果是遗漏 `showError`/`auto` 等源字段，或静默丢弃未知字段。缓解：关闭 QSLR-01 前只作为调查索引；版本化全字段矩阵并对未知 shape 写前拒绝。
2. **把同一 `defaultValueFirstItem` 在不同控件中的展示意图混成一个动作。** 结果是树/级联或目标枚举的首项策略被源运行值带入。缓解：以 shape 为键拆分规则，明确它来自目标默认配置而非源运行时选项；增加跨形态反例。
3. **把“单同步 action”文字视为 Vue/Pinia 原子性已经证明。** 结果是 root/cascade/历史部分发布或重复触发预览。缓解：先以实际入口梳理事件顺序，再用同一 fixture 身份验证失败零副作用及成功单次效应；测试结果单独报告。
4. **用 standalone admin 或 mock 通过权限用例。** 结果是假称只读保密和撤权恢复已验收。缓解：保持 `BLOCKED / NOT_RUN`，取得授权的真实权限模块及隔离多用户环境后另做独立身份验证。

## Claim ceiling and final boundary

本审查只判断生命周期矩阵/fixtures 的设计完整性和后续安全入口。它不证明完整 adapter 冻结、产品实现、运行时、保存重开、授权或 Goal 完成。Goal 的 10 项 AC、26 项 must-have、16 项产品义务全量保留；真实权限与只读限制、撤权/恢复保持 `BLOCKED / NOT_RUN`。未签发产品 Builder admission。当前可声明的仅是：指定卡片及输入摘要复验通过，候选矩阵完成一次带发现项的独立语义审查。
