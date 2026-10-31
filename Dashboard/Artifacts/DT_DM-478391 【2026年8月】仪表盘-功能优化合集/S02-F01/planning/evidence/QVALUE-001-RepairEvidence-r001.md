# QVALUE-001 修复执行证据 r001

## 修复范围

响应独立 Validation r001 的 F-QVALUE-VAL-001 与 F-QVALUE-VAL-003。原始 RED/GREEN r001 及 Validation r001 均保留，不改写其历史结论。此次重新使用最终 runner 追加一致摘要的 RED/GREEN r002，并把循环判断从“整个遍历已见集合”调整为“当前递归路径”，让无环共享引用图可序列化且仍拒绝真正循环。

冻结十项 Fixtures 未变。测试 runner 增加 `shared-json-references-are-accepted-and-detached`，确认同一输入数组可同时作为默认映射和运行映射，输出中的 design/runtime 数组互不共享。实现范围仍是纯函数，不接产品入口/UI/Store/权限/保存/历史。

## 当前证据

- Fixtures SHA256：`06e21cbd6523b06e6e9c7c1ef1577e11e0d6e09bee27c7ccd46770e339f03553`
- 最终 runner SHA256（RED/GREEN相同）：`5e160f512cc935d34e8107aabb2fb17e1c89e8785e322bbe9a1a79f7875ce2cd`
- 最终实现 SHA256（RED/GREEN相同）：`22d00e9c23257b316b0b64e0a52c04e6f969a480f5c6ba06bfadf2b5c89252d9`
- RED r002：显式 `QVALUE_FORCE_UNIMPLEMENTED=1`，18项检查中17项预期失败，1项确定性 JSON round-trip 检查通过，退出码1。
- GREEN r002：10个冻结用例与8项防御/隔离检查全部通过，18/18，退出码0。
- 定向 ESLint r002：仅两个目标文件，退出码0。
- 每项 stdout/stderr/exitcode 保存在本目录 `QVALUE-001-{red,green,lint}-r002.*`。

## 声明边界与后续

这组新日志提供同 runner 身份的当前 RED/GREEN 闭环，但不追认旧 r001 RED/GREEN 的身份相同。项目 `npm run ts:check` 仍被三个既有 `.vue.js` 文件触发 TS6504；单文件 tsc 被当前 `@types/d3-dispatch` 声明语法解析阻断，均不归因于本候选。需独立 Delta/Final-state Validation 复核新实现、修复证据和 Dashboard 状态后，才能给 QVALUE-001 有界结论。S02 原10项 Goal AC与16项产品义务完整保留，真实权限仍 `BLOCKED / NOT_RUN`。
