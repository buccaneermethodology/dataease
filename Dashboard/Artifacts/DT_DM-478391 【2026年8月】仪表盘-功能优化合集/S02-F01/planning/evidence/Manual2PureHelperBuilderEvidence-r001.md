# Manual2 纯 helper Builder 执行证据 r001

状态：仅记录精确值态纯 helper 与 runner 的实现候选验证。正式分母仍为 10 项 Goal AC、26 项 must-have、16 项产品义务；`Scope Delta: none`。真实权限仍 `BLOCKED / NOT_RUN`，产品来源认证与接线 `NOT_READY`。

## 准入与产物

- 纯 helper source target admission：`execution-admission-manual2-pure-helper-source-r001.json`，通过 `execution_admission.py` 对精确 target `core/core-frontend/src/custom-component/filter-copy/query-single-select-manual2-pure.ts` 校验。
- 测试 runner target admission：`execution-admission-manual2-pure-helper-test-r001.json`，精确 target `core/core-frontend/tests/filter-copy-query-reference/query-single-select-manual2-pure.test.ts`。
- helper SHA-256：`8b2b892de636e59e0ca0ba3c7e7e752cb9edb1027244d28bfb4597fa25bcef23`。
- runner SHA-256：`ed61301c2a932437a4cf426f639323d96b5f11c05c5dcdb4334b2c8083b1a151`。

## 可信 RED

控制面在 source 尚不存在时独立执行：

```text
node tests/filter-copy-query-reference/query-single-select-manual2-pure.test.ts
```

当时观察到 `contract_valid=true`、`execution_ok=true`、`execution_errors=[]`、`source.exists=false`、缺失源指纹 `769b8995b8bf4407c89e906d67601a46266d34922a63ab1754440eecb0657aab`、`status=UNIMPLEMENTED`；28 个冻结 Case 加 3 个 P2 检查全部因未实现 stub 失败，行为失败数 31，进程退出码 1。该结果记于 `Topology-actual-r256.json`。完整终端 stdout 未单独保存；此处不把摘要伪称原始日志。

## GREEN 与定向检查

控制面在最终源码与 runner 哈希下再次执行同一命令，退出码 0。runner 输出显示 `contract_valid=true`、`execution_ok=true`、28 个冻结 Case 身份均执行，3 个 P2 检查执行，成功/拒绝结果跨调用隔离断言执行，`behavior_checks=33`、`behavior_failures=0`。`M2P-024` 的 `$js: undefined` 仅由 runner 在调用 helper 前解码。

最终 runner JSON 摘要：

```json
{"suite":"MANUAL2-PURE-HELPER","contract_valid":true,"execution_ok":true,"execution_errors":[],"source":{"path":"core/core-frontend/src/custom-component/filter-copy/query-single-select-manual2-pure.ts","exists":true,"fingerprint":"8b2b892de636e59e0ca0ba3c7e7e752cb9edb1027244d28bfb4597fa25bcef23","status":"LOADED"},"frozen_case_count":28,"p2_checks":["own_defaultValue_undefined","mapValue_sparse_hole","array_extra_descriptor_symbol_accessor_getter_count_zero"],"behavior_checks":33,"behavior_failures":0}
```

- 定向 ESLint：helper 与 runner 两个文件，退出码 0。
- 严格精确 TypeScript 检查：两个文件，`--noEmit --strict --target ES2022 --lib ES2022,DOM --module ESNext --moduleResolution node --skipLibCheck --types node --allowSyntheticDefaultImports`，退出码 0。
- Node 报告 `MODULE_TYPELESS_PACKAGE_JSON` 性能提示；测试仍以退出码 0 完成。
- 输入不可变、输出对象隔离、rejected 输出跨调用隔离；P2 覆盖 own `defaultValue: undefined`、稀疏 `mapValue`、数组额外 descriptor/symbol/accessor 且 getter 调用数为 0。

## 声明边界

这些证据只支持纯 helper 与确定性 runner 的局部结果，不证明真实配置来源、产品 UI/Store 接线、保存/恢复/history/undo、真实查询命中、权限行为或任何 Goal AC 已通过。source/auth 与产品调用保持未就绪；所有产品义务继续 `NOT_RUN`。
