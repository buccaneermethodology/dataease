# QPAYLOAD-001 Builder 执行证据 r001

状态：Builder candidate，等待独立 Validation。范围仅为单个 detached VQuery 根的双槽组合纯函数，不代表产品粘贴/保存接线、权限或 Goal 完成。

## 准入与冻结输入

- 独立设计审查：[QuerySingleSelectQueryPayloadDesignReview-r001.md](../../reviews/QuerySingleSelectQueryPayloadDesignReview-r001.md)，结论 `PASS_WITH_BOUNDS_FOR_QPAYLOAD_001` / `READY_FOR_BOUNDED_ADMISSION`。
- Builder card：`planning/qpayload-001-builder-card-r001.json`；ContextBootstrap 与 card 均经 SP-010 校验通过。
- 实现与 runner 测试分别通过 `execution_admission_v1`，目标分别绑定到本轮两个新文件。
- 冻结输入：[设计](../../QuerySingleSelectQueryPayloadDesign-r001.md)、[14项完整 oracle](../../QuerySingleSelectQueryPayloadFixtures-r001.json)；未修改设计或 fixtures。

## 实现及验证

- 新增 `query-single-select-query-payload.ts`：先递归校验 JSON envelope 和单个 VQuery 容器，再恰调用真实 `rebuildSingleSelectTarget`；容器/身份/类型错误先行返回。成功后分别深拷贝目标根，只替换 `propValue` 与 `cascade`，保留目标允许字段和值及缺省性；拒绝未知根键，不返回部分结果。
- 新增 `query-single-select-query-payload.test.ts`：逐项执行14个冻结 oracle；esbuild runner 使用只包裹并计数的 spy，仍运行真实 QTARGET 实现；测试确认只有4个通过容器检查的输入调用内核。
- 同 runner 执行结果：28 项固定/防御检查通过，退出码0。覆盖冻结输入、目标/双输出不共享对象、设计与运行槽不串扰、JSON往返、访问器不执行、循环/symbol/稀疏数组拒绝及安全复制 `__proto__` 自有键。
- 定向 ESLint：两个新文件通过，退出码0；`git diff --check`通过。
- 未建立可信 RED 证据；实现过程中首次 runner 失败暴露了调用结果层级误读，修正后测试通过。该首次失败不是冻结行为断言产生的合格RED，不作为可信RED声明。

## 未验证与边界

不接 UI、Store、画布、网络、预览、权限或保存/重开；detached 输出不能作为后续变化的 Store 快照回放。未知根字段和元数据业务有效性未证明。QTARGET Validation r002 仍为 `partial`，其状态不由本切片提升。真实多用户权限环境不可用，禁止只读/复制/粘贴与撤权/恢复验收继续 `BLOCKED / NOT_RUN`；S01 不在本轮范围，S02 原始10项 AC、26项 must-have及16项产品义务保持。
