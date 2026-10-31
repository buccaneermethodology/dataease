# QPC saved-owner 产品入口分层设计增量 r002 独立语义复核

## 双结论

**Design Freeze Validity：`NEEDS_REVISION`。** 来源更新、身份分层和准入限制总体成立，但第27行无阶段限定的“拒绝/异常全部不变”与已绑定 QPC r006 Review 的提交后效果边界冲突。该项须在冻结本增量前澄清。另有一处 blank/template 来源摘要不精确，应一并修正。本结论不改写 r001 历史 Review 或 Trace r003 的终轮结论。

**Implementation Entry Readiness：`NOT_READY_FOR_PRODUCT_UI_STORE / SOURCE_READ / TARGET_COMMIT`。** 本报告只审查设计，不授予产品 Builder admission，不证明任何产品或权限行为。10 项 Goal AC、26 项 must-have、16 项产品义务完整保留；`Scope Delta: none`。

## 绑定基线和复核方式

- 最终 review card canonical SHA-256：`844a12541b463b66d73f003017fa6089150c45aa67b4794af50bf390c872156d`，与父任务最终绑定一致；早先 card 不作为本报告基线。
- Context SHA-256：`278a60f88621b548aa7ec31a2a92bc29bae9a13ec39d4bd37ec3bd7487163a44`。19/19 required-read 摘要在写报告前全部匹配，Sessions 绑定当前 `99d7af0ca201f609a855c7c9f2813e2f4b65075130e959d949e9bc952639639e`。该 Context 为设计 lane 的上游输入；本独立报告的唯一 write scope 来自 review card 与父任务委派，不把设计 Context 作为产品 Builder 准入。
- 被审候选 SHA-256：`3501408e27f43fd19a6de270b87bf604d29f82141d092dc8c27902485d4b4f18`。
- 对照 r001 设计及 Review、Store Producer Trace r003 及 Review、QPC r006 及 Review，并定向重读 dashboard、canvasUtils、snapshot、Component 和 Select 源码。源码顺序只作静态事实，不当作 Vue 运行证明。
- 扩读 `../SP-005/S02-S09_EntryPacket.md`，SHA-256 `4598a5d74567e1e1d3de81ce263909231dc054d8102535bc0d917238c412c658`，确认 F01 为 CONDITIONAL；这是当前可读资料，不等于其条件已解除。
- 重跑 `rg -n 'createSavedCanvasOwnerLifecycle' core/core-frontend/src`，仅命中 helper 第99行定义；搜索结论只限当前 checkout 的该文本根。

## 一次列全 Findings

| ID | 严重度 / 状态 | 依据、影响及所需修订 |
|---|---|---|
| `QPC-ENTRANCE-R002-01` | `BLOCKER`，设计需修订 | 候选第27行将所有“拒绝/异常”统一要求目标、dirty、history、preview dispatch、下游 query、save/version 不变，没有标出提交边界。绑定的 QPC r006 Review“最小安全切片、演进准入与误用场景”明确指出提交后 nextTick 预览抑制不能称为写前零副作用拒绝或回滚，已提交 root、selection、owner 和 cache 调用可能保留。反例是同步提交成功后，在 nextTick 前上下文失效导致预览被抑制：此时 root 已改变，但当前笼统 oracle 会将正确抑制误判为失败或诱导未经合同定义的回滚。应分别写明写前拒绝、提交过程异常、提交后预览/查询失败的结果；写前拒绝保留零目标副作用，提交后不声称已撤销提交，并分别观察 root/selection、owner editGeneration、snapshot/cache 调用及计数、dirty、物理 history、preview dispatch、实际 query 和保存结果。提交过程若承诺原子回滚，须另有明确合同和证据；本轮不要求实现。该措辞也见于 r001，但历史通过不消除当前与 r006 的语义冲突，不回改历史报告。 |
| `QPC-ENTRANCE-R002-02` | `NON_BLOCKING`，来源措辞需纠正 | 候选第13行“template/blank create 先初始化新画布后装入模板数据”把 blank 也写成加载模板。`dashboard/index.vue:299–313` 显示两者均先 createInit，但只有 `createType === 'template'` 分支设置模板 component/style/view/appData。应改成“template 与 blank 均初始化新画布，仅 template 随后装入模板数据”。能力不继承的主要结论仍成立，此项不单独阻断分层设计，但不能原样作为精确来源事实传播。 |

## 已核对成立的边界

正常加载在 `canvasUtils.ts:667–681` 顺序调用多个 setter 后 callback；缓存恢复在 `dashboard/index.vue:189–203` 由 deepCopy 经 snapshotPublish 发布，`snapshot.ts:139–147` 仍是多个状态赋值。当前静态链路没有证明不可观察中间态或迟到响应 generation gate。候选将单一 Store action 或等价屏障写为未来要求，并要求运行验证，未宣称 action 本身就足以原子化；该边界成立。

copy 使用独立 busiFlag/findCopyResource 路径，不自动继承已保存原资源 owner。load generation、resource/canvas/root/唯一 VQuery raw 身份与主体、组织、resource/action 授权分离；source-read 和 target-commit 分别重验权限，符合分层意图。卸载、换资源、cache restore 和换主体的真实失效事件仍需后续合同和实际产品证据；当前设计不是完整实现合同，未观察到的能力不能写为已具备。

Component 提供 QSSDH gate；Select 的 observation-request 捕获与响应复验有明确支持域，legacy/no-observation 分支不具有相同响应期保证。候选没有把 gate 等同于 owner 或授权。Trace r003 的 NQPC-TRACE-006/007 仍是其非阻断追溯限制，本次不重开其3/3终轮，不将其 PASS_WITH_BOUNDS 提升为产品验证。

## 原范围、依赖和声明上限

Goal 仍是验收 authority。S01 F01 Packet 当前可读且 CONDITIONAL；不能笼统称“Packet不存在”，也不能把 CONDITIONAL 自动判为可实施。Goal entry 允许逐条解除与本切片相关的条件，不要求其他功能无差别完成。候选保留 Packet、独立审查、终态摘要及精确 action/target admission，未用本设计代替这些材料。

真实 permission provider 来源、公开契约与隔离多用户环境缺口仍阻断产品权限验收；权限为 `BLOCKED / NOT_RUN`。standalone/admin/mock、静态源码、detached GREEN 均不得替代 editor/viewer/admin 的真实 allow/deny、撤权/恢复和源读取/目标提交验证。Authority Materials 主包的 NEEDS_REVISION 不因审后更正或本报告而改变。

本轮仅新增上述两个设计 findings，不关闭任何 AC、must-have 或产品义务。允许下一步在已有授权及精确设计任务边界内澄清这两处，再做独立复核；产品接线继续不准入。本次未改候选、Goal、Cases、源码或权限配置，未运行产品、构建、数据库或权限测试。写前摘要复验通过仅证明输入字节一致，不是产品验收。
