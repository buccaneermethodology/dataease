# QVALUE-001 Builder 执行证据 r001

## 范围与结论

本轮按 `S02-QVALUE-001-builder-r003` 实现九键普通单选值投影纯函数。只新增 `query-single-select-value-state.ts` 并按格式要求调整其专属测试 runner。Builder 结论为候选通过，不代表独立 Validation、产品接线或 S02 Goal 完成。

函数验证严格九键 plain JSON 输入和固定单选分支；按 `INVALID_INPUT → UNSUPPORTED_FIELD → UNSUPPORTED_SHAPE` 返回错误；显式构造不含运行值的七键 design，并从默认值独立水合九键 runtime。输入、design、runtime 的数组彼此分离。未调用已有 COPY/无默认重建器，未接产品 UI、Store、权限、保存或历史入口。

## 冻结身份与验证

- Contract/Fixtures SHA256：`06e21cbd6523b06e6e9c7c1ef1577e11e0d6e09bee27c7ccd46770e339f03553`
- Test runner SHA256（GREEN）：`e079807871ce2fb12663bd0b229935e9f5442b436787f9563fafd54e43448b8b`
- Implementation SHA256（GREEN）：`2a2b681c63906cb6a8e92882b2382bbe9621fde36defb2a039e6b2d028be5422`
- Trusted RED：同一 runner 运行时通过测试内 `QVALUE_FORCE_UNIMPLEMENTED=1` stub，17项检查中16项按预期断言失败，退出码1；完整输出保存在 `QVALUE-001-red.*`。
- GREEN：`node tests/filter-copy-query-reference/query-single-select-value-state.test.ts`，10个冻结用例与7项防御/隔离检查全部通过，17/17、退出码0；完整输出保存在 `QVALUE-001-green.*`。
- 定向 ESLint：仅检查实现与 runner 两个文件，退出码0；完整输出保存在 `QVALUE-001-lint.*`。
- 定向检查只覆盖这两个文件；没有执行全前端构建或全量 TypeScript 检查。

RED 命令最初按前端子目录误用仓库相对证据路径，shell 未能创建输出，未启动测试；随后改用绝对证据路径完成 RED/GREEN 和 lint 留证。首轮 ESLint 检出 runner 一处 Prettier 排版，修正后最终定向 lint 通过。

## 声明上限与剩余项

该纯函数只接受调用方已提供的九键投影，不负责从完整产品 condition 提取字段、保存 carrier、ID/字段/数据集/级联重绑、完整查询形态、目标值有效性、产品 UI/Store 接线、保存/历史或权限行为。S02原10项AC及16项产品义务保持不变。真实权限隔离环境未具备；只读用户禁止查看/复制/粘贴、权限撤销与恢复仍为 `BLOCKED / NOT_RUN`，未用 standalone/admin/mock 替代。

下一步：由独立 Validation 只读审查实现、冻结 oracle、完整差异、RED/GREEN/lint证据与上述 claim ceiling，并给出有界 verdict；在此之前不将 Builder 候选写作独立通过或 Goal 完成。
