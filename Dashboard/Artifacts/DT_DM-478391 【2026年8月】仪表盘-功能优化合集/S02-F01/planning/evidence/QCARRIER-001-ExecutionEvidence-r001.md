# QCARRIER-001 执行证据 r001

- 时间：2026-10-18T08:49:39+00:00
- 结论：Builder candidate；独立 Validation 已派发，当前不宣称该切片通过。
- 边界：仅新增普通文本单选完整 carrier 离线纯函数与测试；不接产品入口、UI、Store、网络或权限。
- 实施修正：当 `defaultValueCheck=true` 且 `defaultValue` 键缺失时，在通用形状验证前按冻结设计返回 `UNSUPPORTED_FIELD`；补充对应回归断言。
- RED：`QCARRIER_FORCE_UNIMPLEMENTED=1 node --experimental-strip-types tests/filter-copy-query-reference/query-single-select-carrier.test.ts`，同 runner digest `63ed520ab13696cbb7fd76e303fecf54e3f4be77e276ef1ef6ac8cde4eb484e8`，1/22 断言通过、21 项按预期失败，退出码 1；stderr 仅含预期 assertion diff 与 Node 模块类型提示。
- GREEN：同 runner 正常运行，22/22 通过、0失败，退出码 0；fixture digest `03613abf4395405162baa736a7592dcaa1bc5be706b7b56960cd96860d93e371`，runner digest `63ed520ab13696cbb7fd76e303fecf54e3f4be77e276ef1ef6ac8cde4eb484e8`，源码 digest `5b625f68bf56393a39d3d5a721a20e7ac35d4598f8938d34a90064c3ed72d59d`。
- 定向 ESLint：实现与测试文件，退出码 0。
- `git diff --check`：通过。
- 源码：`core/core-frontend/src/custom-component/filter-copy/query-single-select-carrier.ts`；测试：`core/core-frontend/tests/filter-copy-query-reference/query-single-select-carrier.test.ts`。
- 可复核日志：`planning/evidence/QCARRIER-001-red-r002.*`、`green-r002.*`、`lint-r002.*`。
- 限制：离线单元行为不证明产品复制粘贴端到端、持久化、跨浏览器或权限语义。Goal原始10项AC与16项产品义务均保留；只读用户、权限撤销/恢复为 `BLOCKED / NOT_RUN`，不以standalone替代。
