# QTARGET-REBUILD-001 Builder 执行证据 r001

状态：Builder candidate，等待独立 Validation。只覆盖单条件、普通文本单选、空 cascade 的离线纯函数；不代表产品接线、权限、保存重开或完整 Goal 通过。

## 准入与输入

- 独立设计审查：[QueryProductRebuildDesignReview-r002.md](../../reviews/QueryProductRebuildDesignReview-r002.md)，`PASS_WITH_BOUNDS_FOR_QTARGET_REBUILD_001` / `READY_FOR_BOUNDED_ADMISSION`。
- Builder card：`planning/qtarget-rebuild-001-builder-card-r001.json`，SP-010 canonical digest 校验通过。
- ContextBootstrap：`planning/ContextBootstrap-QTARGET-REBUILD-001-builder-r001.json`，校验通过。
- 两个目标文件分别消费并通过 `execution_admission_v1`：实现与同 runner 测试。
- 冻结输入为 `QueryProductRebuildDesign-r008.md` 和 `QueryProductRebuildFixtures-r008.json`，16 个固定 oracle；未修改设计和 fixtures。

## 实现与验证

新增 `query-single-select-target-rebuild.ts`，先安全检查完整 JSON envelope，再恰调用一次真实 `prepareQuerySingleSelectCarrier`，随后按 PLAN、DIRECTORY 顺序检查，成功后从 carrier 的 design/runtime 分别深拷贝，只重绑 `id`、`checkedFields`、`checkedFieldsMap` 并返回完整载体。失败不返回部分结果。

新增 `query-single-select-target-rebuild.test.ts`，从冻结 JSON 读取 16 个完整 oracle，并检查输入冻结/不变、输入和 design/runtime 对象隔离、getter 不求值、非 JSON/循环拒绝及只变运行时 B 不影响重建结果。

- esbuild 编译后的同一 runner：26 项通过，退出码 0。
- 定向 ESLint：两个新文件通过，退出码 0。
- `git diff --check`：通过。
- `tsx` 不在本地依赖中；使用已有 esbuild 临时编译并执行 runner，未安装依赖。临时编译文件已删除。
- 未保存可信 RED 证据；本轮只执行 GREEN/防御检查，独立验证须独立复跑并说明该证据限制。

## 未覆盖与边界

不接 UI、Store、权限、保存或产品 adapter。QCARRIER-001 的包级状态继续为 partial；真实多用户权限环境未具备，所有权限撤销、只读禁止查看/复制/粘贴验收仍为 `BLOCKED / NOT_RUN`。S02 原始 Goal AC、must-have 和产品义务分母保持不变，S01 不在本次改动范围。
