# 查询组件过滤复制粘贴产品提交合同 r001

状态：`DESIGN_CANDIDATE_REVIEW_REQUIRED`。本合同仅提议一个产品提交切片，不代表产品入口已接入、权限已验证或父 Goal 可关闭。

## 目标与边界

冻结一个尚未落地且源码支持的目标产品形态：从查询组件配置弹窗读取一个普通文本单选条件，复制到另一个查询组件时整体替换其过滤树，并在用户确认后立即预览；只由正常仪表盘保存流程持久化。来源及目标均要求 `propValue` 恰含一个 `QCARRIER` 已支持的普通文本单选条件，`cascade` 为空，数据集 ID 相同；其余合法查询形态继续保留在父 Goal 分母内，后续按独立合同扩展。

不新增系统剪贴板快捷键，不复用组件复制快捷键，不调用 `QueryConditionConfiguration.vue` 的 legacy `confirmClick()` 多阶段写入分支。真实身份、数据访问和编辑权限仍必须由真实权限实现每次重新检查；本合同不把 `editMode`、UI 显隐、目录、mock 或已有 standalone 行为当授权证明。当前没有权限模块来源和隔离多用户实例，权限拒绝与只读保密行为仍 `BLOCKED / NOT_RUN`。

## 源码锚点与调用位置

- `core/core-frontend/src/custom-component/v-query/Component.vue` 的 `editeQueryConfig()` 打开配置弹窗；模板只在既有编辑态提供编辑/删除控件。
- `core/core-frontend/src/custom-component/v-query/QueryConditionConfiguration.vue` 持有 `conditions` 与模块级 `cascadeArr` 草稿；`confirmClick()` 包含 managed 与 legacy 两条不同路径。legacy 路径先清空 `propValue`，再经多次 `nextTick` 写入级联和条件、记录快照并发预览事件，因此不得作为本合同的原子粘贴提交器。
- `core/core-frontend/src/store/modules/data-visualization/dvMain.ts` 的 `componentData` / `setComponentData()` 是画布根状态入口；`snapshot.ts` 提供 `recordSnapshotCache()` 与 undo/redo 发布路径。
- `QuerySingleSelectCarrierDesignCarrierLifecycle`、`QueryProductRebuildDesign-r008` 及其已审有界子合同负责条件载体提取和目标身份重绑。本合同只消费其完整输出，不重写其 schema、字段动作或校验算法。
- 用户确认后的预览事件沿 `QueryConditionConfiguration.vue` 的 `reRenderAll`、`queryData` 事件链；数据持久化仍走既有画布保存入口，不因粘贴自动保存。

## 产品操作

1. 在查询组件配置弹窗增加显式“复制过滤配置”和“粘贴过滤配置”动作；不接管系统剪贴板。复制使用当前弹窗已确认的完整 query root，不读取未确认半成品。粘贴只接受本应用共享内容中的查询组件 envelope，跨图表/查询类型拒绝。
2. 粘贴先完成 envelope/schema、身份与目标适配准备，产生完整 `{propValue, cascade}` 候选以及目标根快照签名；任何准备失败不打开确认框、不改草稿/Store、不追加快照、不发预览或查询。
3. 若目标已有条件，显示覆盖确认。取消保持所有目标可观察状态不变。用户确认后重新读取当前用户、资源/数据集访问权、目标编辑权、目标组件唯一性、目标版本/签名及适配依赖；任何拒绝或变化均零副作用并给出失败提示。
4. 验证成功后，用一个同步 Pinia action 将目标组件的 `propValue` 与 `cascade` 一起发布到新建的完整 `componentData` 根。随后恰记一次既有快照，并以同一 commit ID 安排一次预览/查询。快照/预览调用抛错时不得报告粘贴成功；设计实现必须证明可以在任何发布前失败，且发布阶段回调不可抛错或有同步回滚。
5. 成功提示使用 Goal 冻结文案“过滤条件已应用”。之后仅当用户正常保存成功，刷新重开仍保留新过滤配置；保存失败时本地编辑态可继续查看，但服务端保存版本不得声称已变化。

## 完整输入、输出与失败优先级

产品事务输入是一个 exact-key 记录：`{sourceComponentId, targetComponentId, expectedTargetSignature, sourceRoot, targetRoot, preparedCandidate, actorContext, authorization}`。`sourceRoot` 和 `targetRoot` 均为 `{propValue:[one condition], cascade:[]}`；`preparedCandidate` 是既有目标重建器完整输出之一，不允许调用方直接传“已授权”布尔标志。`authorization` 必须是实际权限 API 对当前身份和当前资源/数据集/目标编辑操作的本次结果；缺失、过期、未绑定当前主体或目标均拒绝。准确身份字段及唯一性域沿已冻结的 `QueryProductRebuildFixtures-r008.json` 与生命周期矩阵，不按显示名称回退。

成功返回 `{ok:true, commitId, componentData, targetRoot, effects:{snapshotAppend:1, previewRequest:1, saveRequest:0}}`。完整根是原画布根的深副本，只有唯一目标 VQuery 的 `propValue` 与 `cascade` 被候选完整替换；其他组件、样式、布局、查询结果、运行选中值及其他条件均保持原值。对外发布前只保留一个目标根版本，不能先发布空数组或部分字段。

拒绝返回 `{ok:false, stage, reason}`，不含候选值。失败优先级固定：`ENVELOPE → SOURCE/TYPE → AUTHORIZATION → TARGET_IDENTITY → TARGET_VERSION → ADAPTER → USER_CANCEL → COMMIT_PRECONDITION`。同一次操作在首个失败阶段结束。复制失败不替换已有共享内容；粘贴失败/取消不更改目标组件、`componentData` 根引用、history cursor/长度、预览 identity/count、查询调用数或保存请求数。

## 写前零副作用与成功 oracle

所有拒绝及取消用例均同时断言：目标 `propValue`、`cascade`、完整 `componentData`、共享 envelope、snapshot 数量/游标、预览标识/次数、查询次数、保存请求数完全不变。必须覆盖：跨类型、不同 dataset ID、不可解析字段 ID、未识别载荷版本、重复/缺失目标组件、目标在确认期间被编辑、身份/权限被撤销、权限 API 不可用/失败、用户取消、提交前置条件改变以及 adapter 拒绝。

成功用例绑定既有完整载荷 oracle：默认值 A 与当前运行选择 B 时，目标设计配置保留 A，目标运行配置按已审合同初始化；动态规则保持规则；source 与 target 完全断开引用；未复制样式/布局/结果。确认后只发生一次整根发布、一次快照和一次预览；不自动保存。保存成功、重开与撤销/重做分别走既有画布路径验证。所有权限相关用例在真实权限实例可用前维持 `NOT_RUN`，不得由注入 deny/pass 函数的单元测试替代。

## 实施范围、先决条件与声明上限

若独立设计审查准入，本切片允许实现一个产品级同步事务 action、配置弹窗上的显式动作和必要测试；不改动既有 QSL/QPAD/QPREP/QCR/QTR 冻结合同。Builder 写入范围只含相关 query store/action、配置弹窗接线、测试及本切片执行证据。开工前必须绑定新的 Builder card、Context、当前 topology、该设计与 fixtures 摘要，并通过 `execution_admission` 对应 action/target 检查。

产品 Builder 仍需使用真实授权 API；如果当前可用公开契约无法表达“当前主体对数据集的查看权 + 目标仪表盘编辑权”，立即停止 UI 接线并保留 `BLOCKED`，不得用只读按钮隐藏或 mock 继续。环境未就绪时可以验证纯拒绝分支和无副作用事务，不得声称权限、保存回显、浏览器多标签或 Goal AC 通过。

本切片通过最多证明一个普通文本单选、空级联查询目标的同步提交协调；不关闭完整 query schema、图表适配、跨标签共享、TTL/容量、持久化回显、真实权限、原 10 项 Goal AC、16 项产品义务或 S10 就绪性。
