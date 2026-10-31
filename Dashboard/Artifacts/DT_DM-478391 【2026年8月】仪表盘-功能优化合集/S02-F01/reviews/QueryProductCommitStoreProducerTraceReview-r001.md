# QPC Saved Canvas Store Producer 源追踪 r001 独立审查

- 评审轮次：本交付物第 1/3 轮
- 审查类型：只读 Semantic / Source Review
- 交付物：`QueryProductCommitStoreProducerTrace-r001.md`
- 结论：**`NEEDS_REVISION`**
- 结论边界：仅对本 trace 的静态来源映射、证据边界与上下文有效性作结论；不批准产品 UI/Store/source-read/target-commit，不关闭任何 Goal AC、must-have 或产品义务。

## 审查入口与复核范围

Lane Task Card `S02-QPC-STORE-PRODUCER-TRACE-r001` 的 SHA-256 与入口给定值一致（`f28a378c…d3a6f8`），`lane_task_card.py validate` 返回 `pass`。Context Bootstrap 结构校验通过；required read set 共 24 项。逐项核对文件摘要时发现两项与 Context 绑定值不一致：

| 读集文件 | Context 绑定摘要 | 当前摘要 |
|---|---|---|
| `S02-F01/Sessions.md` | `75afa6dbcbbd…874a1d8` | `e7b5974f89af…576ceb91` |
| `core/core-frontend/src/custom-component/v-query/Select.vue` | `eadbdba2b61a…e4212a2` | `30efd4a571a8…fcfcac8` |

其他 22 项 required read set 摘要与 Context 一致。Context 文件本身 SHA-256 为 `f317d4dc…1839b9e`，与 Card 绑定值一致。由于 Context 明确规定读集漂移时停止并重建 Context/Card，本轮不把这些当前文件视为原冻结快照，也不以当前源码差异替代原绑定版本。

静态复核覆盖 trace 全文、Goal.final、QPC r006 review、dashboard/canvas 加载与发布路径、Store setters、缓存恢复、Q-VQuery 消费者、saved-owner helper 搜索结果及权限/S01/范围边界。未启动产品、未运行测试、未访问权限接口或数据库。

## Findings

### BLOCK-QPC-TRACE-001 — 必需读集漂移，当前复核不能对 r001 作有效冻结结论

**依据：** Context Bootstrap `required_read_set` 对 `Sessions.md` 和 `Select.vue` 的预期摘要与当前 checkout 摘要不符。当前 `Select.vue` 已增加 `query-lifecycle-allowed` gate、迟到枚举观察请求、额外状态和卸载清理（例如当前行 358–380、691–780、1186–1190）；这些内容不在原 Context 绑定的 `Select.vue` 中。`Sessions.md` 也已变化，可能影响状态/依赖声明的语义刷新。

**影响：** Trace 第 25 行引用 `Component.vue` 的 lifecycle gate，并在第 34、36 行说明 lifecycle 和形态覆盖边界；它没有逐行描述 `Select.vue` 当前逻辑，但其消费路径和 QPC 设计约束依赖这一组件。源读集已变化，不能确认作者与 reviewer 依据的是同一套语义快照，也不能声称本报告已按完整冻结读集完成评审。

**处置：** 阻断 r001 的 `PASS` 或设计准入结论。先重建本任务 Context/Card，刷新 Goal/Session 状态和源码摘要；随后由 Builder 更新 trace（至少重新核对 Q-VQuery/Select 生命周期相关描述），再进行新一轮独立评审。按用户规则，本 Finding 计入本交付物第 1 轮，不是整个 Goal 的轮次上限。

### NQPC-TRACE-002 — 负向全局搜索结论缺少可复核的搜索记录

**依据：** Trace 第 23、31 行称“全前端搜索未发现” `createSavedCanvasOwnerLifecycle` 的产品调用点，但 trace 未给出搜索范围、命令或结果摘要。当前只读复核执行 `rg -n "createSavedCanvasOwnerLifecycle" core/core-frontend/src`，结果只出现 helper 定义位置 `query-single-select-saved-canvas-owner.ts:99`；这支持当前 checkout 下的否定发现，但原 trace 本身未留存复核方法，且该结果不覆盖其他工作树、生成代码或运行时动态引用。

**影响：** 否定性来源结论较难独立重现，可能被误读成全产品、所有入口均不存在。

**建议：** trace 后续修订时写明搜索根目录、精确命令和搜索边界，并将结论限定为“在当前 checkout 的 `core/core-frontend/src` 文本搜索中未发现调用点”。此项不单独阻断有界静态 trace，但应保留其证据上限。

## 其余静态事实核对

除上述漂移与搜索可复现性外，当前可核对的映射与源码一致，且 trace 对未知项保留了适当边界：

- Dashboard 路由/嵌入参数、缓存分支、copy 和 template 分支的描述与 `dashboard/index.vue` 对应行一致。
- `initCanvasDataPrepare` 选择 `findById`/`findCopyResource`、解析服务端画布数据并交给 callback 的映射与 `canvasUtils.ts:597–659` 一致；正常加载的 setter 次序与 `canvasUtils.ts:662–682` 一致。该源码顺序不证明 Vue 更新的原子性或运行态可见顺序，trace 已明确标为未知。
- Store 分别保存和替换 `componentData`、`dvInfo`、`canvasViewInfo` 的描述与 `dvMain.ts` 对应 state/setter 一致。
- 缓存恢复经 Dashboard 回调、`deepCopy` 和 `snapshotPublish` 发布的描述与 `dashboard/index.vue`、`snapshot.ts` 及 `CanvasCacheDialog.vue` 相符。trace 将未观察到身份签名限定在静态链路内，没有将其写成运行时权限结论。
- Dashboard 卸载调用 QSSDH session invalidation；trace 没有把该 session 等同于 saved-owner 生命周期或登录授权主体。
- `DeCanvas`/VQuery 消费 props 与 Store；`dvMain` 的 `toRaw` 用法不能推出已建立 saved-owner getter 或运行时 raw 身份稳定性。trace 对此保持区分。
- QPC r006 明确允许下一步进行只读 producer 追踪，并禁止由 helper、ID、generation 或 QSSDH session 推导真实身份/权限；trace 未越过 source-read、UI/Store 接线或目标提交边界。

## Goal 与治理边界

Goal 原始范围仍为 10 项 AC、26 项 must-have、16 项产品义务，`Scope Delta: none`；S01 状态独立。真实权限环境及权限模块仍未就绪，相关验收必须保持 `BLOCKED / NOT_RUN`；standalone 或管理员身份不能替代真实权限验证。此 trace 不构成 S01 Entry Packet、权限测试、产品行为验证、产品 Builder 准入或 S02 完成证据。

## 独立 verdict

- **Trace 来源映射质量：** 主要静态映射有源码支持；负向全局搜索应补足复现边界。
- **Context / 评审有效性：** `NEEDS_REVISION`，因两项必需读集摘要漂移，不能对冻结输入作 `PASS`。
- **产品 Design Freeze：** 本报告不作批准；依 QPC r006，trace 本身不改变 `NOT_READY_FOR_PRODUCT_UI_STORE`。
- **Implementation Entry Readiness：** 不准入产品 UI/Store/source-read/target-commit；该 trace 的审查不改变此结论。
