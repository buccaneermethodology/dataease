# QPC saved-owner 产品入口分层设计增量 r004

状态：`CANDIDATE_FOR_FINAL_INDEPENDENT_REVIEW`（本设计交付物第3/3轮）。本增量在 r003 基础上处理入口设计 Review r003 的全部 findings，按本设计交付物第3/3轮进行最终独立复核；不替代完整 F01 Design Freeze，不修改 Goal、产品源码、Cases、权限实现或既有测试。

## 权威、分母与限制

`Goal.final.json` 是原始范围与验收权威：10 项 Goal AC、26 项 must-have、16 项产品义务，`Scope Delta: none`。S01 F01 仍为 `CONDITIONAL`。真实权限模块来源、公开授权契约和隔离多用户环境仍不可用；只读查看/复制/粘贴限制、撤权与恢复保持 `BLOCKED / NOT_RUN`。Authority Materials 主包仍为第 3/3 轮 `NEEDS_REVISION`（AM-09）；其审后更正 `PASS_WITH_BOUNDS` 不改变该结论。本设计不扩展或缩小原始分母，也不关闭任何 AC。

## 新的已核对来源事实

1. **正常加载是多次 Store setter。** `initCanvasData` 在非预览分支顺序发布 component、style、dvInfo、view，再执行 callback；当前源码没有将它们封装为一个原子发布动作。源代码顺序不能证明 watchers/render 不会观察中间态，也不能证明迟到的旧响应已受 load-generation 门控。[Store Producer Trace r003](QueryProductCommitStoreProducerTrace-r003.md)
2. **缓存恢复有独立生产路径。** 对话框只把选择通过事件交给 Dashboard；父层深拷贝本地缓存，再调用 `snapshotPublish` 依次发布画布和资源状态。该链路未调用 saved-owner helper，也没有在静态链路中观察到用户/组织身份签名。缓存内容与授权主体、消费资格是不同事实。
3. **copy/template/create 分支不可合并推断。** copy 走 `findCopyResource`；template 与 blank create 均先初始化新画布，只有 template 分支随后装入模板 component/style/view/appData；blank create 不装入模板数据。它们不能因 Store 形状相似而继承“已保存原资源编辑”的 owner 能力。
4. **QSSDH lifecycle gate 不是 owner 或授权。** VQuery 注入 gate 并在字段变更入口检查；Select 的受支持 observation-request 分支会在响应期复核对象/请求身份，legacy/no-observation 分支不作同一响应期复验。该 gate 管理查询生命周期，不建立 saved-owner context、认证主体或资源授权。旧响应安全仍须按真实产品状态迁移分别验证。
5. **saved-owner 的实际 Store producer 仍未观察到。** 在当前 checkout 的 `core/core-frontend/src` 文本搜索中，`createSavedCanvasOwnerLifecycle` 只命中 helper 定义，无调用点。此结论不外推至其他工作树、生成代码或运行时动态引用。Trace r003 Review 记录的非阻断追溯项 NQPC-TRACE-006/007 保留在该 trace 的 claim ceiling 内；本增量不回改已审查产物。

## 入口合同增量

| 阶段 | 设计要求 | 当前状态与禁止推断 |
|---|---|---|
| 加载开始/资源切换 | 使旧 owner/token 立即失效；为每次资源加载建立单调 load generation。 | 当前 source trace 未证明已存在该产品 producer 或旧响应 generation gate。 |
| 加载完成发布 | 仅在 requested resource、响应 resource、编辑模式、root 和 view 全部一致且完成发布后，发布一个完整的 loaded-edit context。 | 现有多 setter 不是原子动作；须通过单一 Store action 或等价不可观察中间态屏障设计，并以运行态验证。 |
| Owner mint | 绑定 resource id、load generation、source kind、canvas instance、root raw 和唯一 VQuery target raw；目标必须在 root 中唯一且类型正确。 | owner 只证明对象身份和生命周期，不表示用户、组织、权限或 source-read 能力。 |
| 缓存恢复 | 校验缓存资源与当前编辑资源，再在新 root 发布后创建新 generation；恢复失败或身份不符时不得复活旧 owner。 | 本地缓存本身不签发身份或授权；实际用户/组织身份事件仍未观察。 |
| copy/template/preview/embed | 每种入口单独定义 owner 能力；无明确新目标与权限契约时拒绝继承 saved-edit owner。 | 不能从相似 Store 数据形状推断能力等价；仍在完整 Goal 分母。 |
| 来源读取/目标提交 | 来源读取前与目标提交前分别通过真实 permission provider 校验主体、组织、资源及动作；提交必须重验 owner、授权和目标 revision。 | 权限契约与环境未提供，此阶段不准入、不实现替代鉴权。 |
| 来源读取前授权拒绝 | source-read 授权未通过时，不得读取来源配置；不得产生来源配置读取结果或因该失败派发后续准备/目标提交。记录主体、组织、资源、动作、拒绝结果及来源读取计数。 | 该 oracle 只覆盖源读取授权边界，不推断此前其他合法请求；真实权限服务端拒绝仍待权限 authority 与隔离环境。 |
| 合法读源后的目标提交前拒绝 | source-read 已授权并读取来源配置后，若目标 owner、主体/授权复验、目标身份/revision、配置校验或 target-commit 授权失败，应如实保留此前合法读取事实；不得要求“从未读取来源配置”。拒绝后的新增目标副作用必须为零：目标/selection 不变，owner 编辑 `editGeneration` 不变，snapshot/cache/dirty/history 不新增变化，目标预览不派发、目标分析查询不新增、save/version 不发生。分别记录读取授权时点、提交前复验结果与拒绝后的增量计数。 | 来源读取与目标提交是两个授权时点；读取/复制准备所需请求与目标提交触发的预览/分析查询必须分开计数。授权失效时的安全生命周期失效 generation 可递增，但不得将其混同为文档编辑 `editGeneration` 或目标提交副作用。该设计 oracle 不证明当前实现已满足，也不把已发生的合法来源读取抹除。 |
| 提交过程异常 | 若提交过程中发生异常，仅在冻结合同明确规定原子回滚且验证过回滚范围时，才可要求 root/selection/owner/snapshot/cache 全部恢复。 | 目前没有足够合同与运行证据定义提交中途异常的恢复语义；不能把它并入“写前零副作用”。 |
| 提交后预览/查询失败或抑制 | 一旦目标 root/selection 已提交，随后 nextTick 预览被抑制、preview dispatch 失败或下游 query 失败，不声称提交已回滚；分别记录已提交 root/selection、owner editGeneration、snapshot/cache 调用及计数、dirty、物理 history、preview dispatch、实际 query 与保存结果。 | 提交后效果与写前拒绝分属不同 oracle。当前为设计观察要求，不是产品实现或运行结果。 |
| 提交成功 | 按合同观察目标/selection、owner、snapshot/cache、dirty、物理 history、preview dispatch、实际 query、save/version 与重开回读；不把事件调度、请求数和历史追加合并成一个结果。 | 这些观察面彼此独立；成功反馈也不替代持久化/回读证据。 |

## 验证阶梯和准入边界

1. 已验证 detached helper 的范围仅为注入 getter 后的 identity invalidation，不等于产品 Store producer。继续保存该层合同与局部验证作为独立基础。
2. Store producer 首先以绑定当前 read set 的设计/合同定义：加载代次、成功发布屏障、root/target raw 规范化、唯一目标、资源切换/卸载/cache restore 的失效条件。若无产品运行准入，只完成静态来源或 detached harness，并明确其不证明 Vue/Pinia 行为。
3. 产品 producer/UI/source-read/target-commit Builder 必须等 Goal 指定的 S01 F01 Entry Packet、独立审查及终态证据摘要、当前合同/Cases/可信 RED、真实权限模块或隔离实例、独立预审和精确 action/target admission 都可验证后再建立。
4. 产品 Validation 逐项覆盖 Goal 原分母和全部 AC；在真实隔离实例中使用 editor/viewer/admin，验证 source-read 与 target-commit allow/deny、撤权/恢复、目标及所有副作用 oracle。standalone/admin/mock/静态检查/detached GREEN 不得替代。

## r002 Review findings 处置

- `QPC-ENTRANCE-R002-01`：已拆分为写前拒绝、提交过程异常、提交后预览/查询失败或抑制、提交成功四种观察阶段。仅写前拒绝声明零目标副作用；提交过程原子回滚需要未来合同明定与证据；提交后不声称回滚，并保留已提交状态及逐项副作用观察。
- `QPC-ENTRANCE-R002-02`：已更正为 template 与 blank create 均初始化新画布，但只有 template 分支装入模板数据；blank create 不装入模板。
- 两项 finding 已处理但仍待本设计交付物自己的独立复审；不回改 r002 或其Review。

## r003 Review finding 处置

- `QPC-ENTRANCE-R003-01`：按阶段拆分为“来源读取前授权拒绝”与“合法读源后的目标提交前拒绝”。前者要求授权未通过时不得读源；后者保留已授权来源读取事实，只要求拒绝后的目标写入、owner 编辑代次、snapshot/cache/dirty/history、目标预览/查询、save/version 增量均为零。安全生命周期失效代次与文档编辑代次明确分离。
- 提交中异常及提交后预览/查询失败仍沿用独立阶段 oracle，不主张当前存在原子回滚保证。该处置待本设计交付物第3/3轮审查，不改写 r003 历史报告。

## 结论上限

本候选只更新有界产品入口设计输入，当前等待本设计交付物第3/3轮独立语义审查。即便通过，也只支持分层边界和后续验证阶梯；不构成完整 F01 Design Freeze、产品 Builder admission、产品行为验证、权限验收或 S02 Goal 完成。
