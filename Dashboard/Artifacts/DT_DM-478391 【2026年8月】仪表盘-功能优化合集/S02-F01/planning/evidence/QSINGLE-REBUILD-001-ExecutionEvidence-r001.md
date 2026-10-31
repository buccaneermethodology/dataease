# QSINGLE-REBUILD-001 Builder 执行证据 r001

## 结果边界

本候选仅实现无默认普通 VARCHAR 单选配置的离线重建纯函数。没有接入或调用 QPAD 多选函数，也未修改 UI、Store、产品入口、网络、权限、保存、预览或数据库路径。该 Builder 结果不代表独立 Validation、产品行为或 S02 Goal 完成；真实权限仍未验证。

## 实际写入

- 新增 `core/core-frontend/src/custom-component/filter-copy/query-single-select-rebuild.ts`。
- 新增 `core/core-frontend/tests/filter-copy-query-reference/query-single-select-rebuild.test.ts`。
- 新增本目录下 QSINGLE 专属 RED、GREEN、定向 lint stdout/stderr/exit code 与本执行报告。
- 冻结的 10 个 fixture identity、设计、review、Goal、多选模块及其它切片未修改。

## 验证证据

- RED 与 GREEN 均执行 `node tests/filter-copy-query-reference/query-single-select-rebuild.test.ts`（工作目录 `core/core-frontend`）。最终 runner SHA256 相同：`ce7bd18063134e60533780fc2c7c43023a9ad1e127f6ab6957874ccf0b127f71`。RED 在实现缺失时使用可执行 `UNIMPLEMENTED` fallback，10 个冻结 identity 与 5 组防御断言均在 assertion 层失败，`0/15`、exit `1`，不是模块解析错误。RED 时生产源码指纹为 `<missing>`（runner记录 SHA256 `769b8995b8bf4407c89e906d67601a46266d34922a63ab1754440eecb0657aab`）。
- 恢复实现后同 runner GREEN `15/15`、exit `0`。六个合同维度已覆盖在十个冻结 identity 中；额外断言检查 own-key 删除、空字符串输入语义、非 JSON/undefined/Date/循环/函数/非有限数拒绝、错误优先级、深冻结与无共享引用、JSON 往返。
- 定向 ESLint 命令：`./node_modules/.bin/eslint src/custom-component/filter-copy/query-single-select-rebuild.ts tests/filter-copy-query-reference/query-single-select-rebuild.test.ts`，exit `0`。
- 最终生产源码 SHA256：`6927e86476fd457e1e2a0dadc2299aeccef6b4945d53df230788f05adc1f8e3f`。冻结 fixture SHA256：`5260dce73536698f463d118075c4c6ad58b2e50af24707ba34b8af08f3651490`。

stdout、stderr、exit code 分别保存在本目录 `QSINGLE-REBUILD-001-{red,green,lint}.*.txt`。这是有限单选离线候选的 Builder 证据；独立 Validation 和完整 Goal 义务仍待后续处理。
