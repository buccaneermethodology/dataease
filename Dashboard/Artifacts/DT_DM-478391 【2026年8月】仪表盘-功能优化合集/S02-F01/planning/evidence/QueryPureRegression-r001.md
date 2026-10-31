# S02 已落地查询纯逻辑回归复跑 r001

记录时间：2026-10-20；工作树为当前共享 checkout。执行目录：`core/core-frontend`。

## 执行范围

运行命令：

```sh
rg --files tests/filter-copy-query-reference tests/filter-copy-query-target-component-map tests/filter-copy-query-tree-relation-rebinding tests/filter-copy-query-cascade-identity-rebinding | rg '\\.test\\.ts$' | while IFS= read -r f; do node --experimental-strip-types "$f" || exit $?; done
```

发现并执行 16 个现存 `.test.ts` runner：QMAP、QOBS async、QPAD rebuild、QSSDH text select、QPIPE、QTARGET rebuild、QVALUE、QPROJ、QSSDH lifecycle、QCARRIER、QSINGLE rebuild、QPAYLOAD、QSINGLE default-copy、QCREATE lifecycle、QPREP、QE2E。全部退出码为 0；逐项 runner 报告的断言合计 352 项通过，另有 lifecycle runner 输出 PASS（该 runner 未打印数值计数）。Node 对 package 未声明 `type=module` 的提示为性能提示，不影响结果。

## 证据边界

这些是当前已落地的纯逻辑、重建、payload 与生命周期测试复跑；没有运行 Vue 浏览器交互、真实网络/后端、保存重开、多用户鉴权或权限撤销测试，也没有测试 r001 所述的复制粘贴产品提交事务。故它们不关闭产品 UI/Store 接线、Goal AC、权限验收或 S02 Goal。真实权限实现及隔离多用户环境仍不可用，权限相关用例继续 `BLOCKED / NOT_RUN`。完整分母仍为 10 项 Goal AC、26 项 must-have、16 项产品义务，`Scope Delta: none`。
