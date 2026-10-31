# QPC saved-owner 产品入口分层设计增量 r002

状态：`CANDIDATE_FOR_INDEPENDENT_REVIEW`。本增量以已审查的 Store Producer Trace r003 更新 r001 入口设计的来源映射与状态边界，不替代 r001 独立设计 Review，不修改 Goal、产品源码、Cases、权限实现或既有测试。

## 权威、分母与限制

`Goal.final.json` 是原始范围与验收权威：10 项 Goal AC、26 项 must-have、16 项产品义务，`Scope Delta: none`。S01 F01 仍为 `CONDITIONAL`。真实权限模块来源、公开授权契约和隔离多用户环境仍不可用；只读查看/复制/粘贴限制、撤权与恢复保持 `BLOCKED / NOT_RUN`。Authority Materials 主包仍为第 3/3 轮 `NEEDS_REVISION`（AM-09）；其审后更正 `PASS_WITH_BOUNDS` 不改变该结论。本设计不扩展或缩小原始分母，也不关闭任何 AC。

## 新的已核对来源事实

1. **正常加载是多次 Store setter。** `initCanvasData` 在非预览分支顺序发布 component、style、dvInfo、view，再执行 callback；当前源码没有将它们封装为一个原子发布动作。源代码顺序不能证明 watchers/render 不会观察中间态，也不能证明迟到的旧响应已受 load-generation 门控。[Store Producer Trace r003](QueryProductCommitStoreProducerTrace-r003.md)
2. **缓存恢复有独立生产路径。** 对话框只把选择通过事件交给 Dashboard；父层深拷贝本地缓存，再调用 `snapshotPublish` 依次发布画布和资源状态。该链路未调用 saved-owner helper，也没有在静态链路中观察到用户/组织身份签名。缓存内容与授权主体、消费资格是不同事实。
3. **copy/template/create 分支不可合并推断。** copy 走 `findCopyResource`；template/blank create 先初始化新画布后装入模板数据。它们不能因 Store 形状相似而继承“已保存原资源编辑”的 owner 能力。
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
| 失败与成功副作用 | 拒绝/异常须保持目标、dirty、history、preview dispatch、下游 query、save/version 不变；成功后分别观测每个副作用面。 | 设计目标，不是当前实现事实；preview dispatch、query request、history append、保存与重开不是同一 oracle。 |

## 验证阶梯和准入边界

1. 已验证 detached helper 的范围仅为注入 getter 后的 identity invalidation，不等于产品 Store producer。继续保存该层合同与局部验证作为独立基础。
2. Store producer 首先以绑定当前 read set 的设计/合同定义：加载代次、成功发布屏障、root/target raw 规范化、唯一目标、资源切换/卸载/cache restore 的失效条件。若无产品运行准入，只完成静态来源或 detached harness，并明确其不证明 Vue/Pinia 行为。
3. 产品 producer/UI/source-read/target-commit Builder 必须等 Goal 指定的 S01 F01 Entry Packet、独立审查及终态证据摘要、当前合同/Cases/可信 RED、真实权限模块或隔离实例、独立预审和精确 action/target admission 都可验证后再建立。
4. 产品 Validation 逐项覆盖 Goal 原分母和全部 AC；在真实隔离实例中使用 editor/viewer/admin，验证 source-read 与 target-commit allow/deny、撤权/恢复、目标及所有副作用 oracle。standalone/admin/mock/静态检查/detached GREEN 不得替代。

## 待独立审查的问题

- 上述来源是否准确区分正常加载、cache restore、copy、template/create 与现有 QSSDH gate。
- “不可观察中间态”是实现要求而不是现状，且 load generation、raw identity、授权主体和各类副作用被分开表述。
- NQPC-TRACE-006/007 是否作为既有审查的追溯限制保留而不重开 trace r003 或夸大其结论。
- 所有原 AC、must-have、产品义务和 S01/真实权限边界是否完整保持。

## 结论上限

本候选只更新有界产品入口设计输入，等待独立语义审查。即便通过，也只支持分层边界和后续验证阶梯；不构成完整 F01 Design Freeze、产品 Builder admission、产品行为验证、权限验收或 S02 Goal 完成。
