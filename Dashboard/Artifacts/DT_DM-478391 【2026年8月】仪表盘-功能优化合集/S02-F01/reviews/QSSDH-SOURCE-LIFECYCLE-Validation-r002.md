# SOURCE-LIFECYCLE r004 独立验证报告 r002

## 验证结论

- `reviewed_at`: 2026-10-19（America/Los_Angeles）
- `snapshot_id`: `S02-QSSDH-SOURCE-LIFECYCLE-validation-r002`
- `as_of_state`: 当前工作树中的 r004 受管新建普通单选查询生命周期候选；本报告写入前完成只读检查，唯一持久化输出为本文件。
- `verdict`: **PASS_WITH_BOUNDS（限定范围通过）**。

当前源码和冻结生命周期 runner 支持“受管新建非模板普通单选查询会话”的限定候选行为；可信同 runner RED/GREEN、受控 Vue SFC 异步枚举 harness、定向 ESLint 与差异空白检查均符合预期。该结论不扩大为普通 JSON 重开来源认证、真实服务器持久化顺序、真实权限行为、完整 F01/S02 验收或 Goal 完成。原 Goal 的范围与分母未缩减。

真实权限验收维持 **BLOCKED / NOT_RUN（阻塞／未运行）**。当前没有真实权限实现与可用的多用户权限环境；standalone/admin 或 mock 不能替代只读拒绝、权限撤销/恢复验证。

## 独立性、基线与范围

接收端验证卡 `planning/qssdh-source-lifecycle-validation-card-r002.json` 使用固定摘要 `d2ea51df2cfadf50f06c71567cb2273808d91c51a95425e262bb0883a8a10aa9` 校验通过；`planning/ContextBootstrap-QSSDH-SOURCE-LIFECYCLE-validation-r002.json` 校验通过。卡片列出的 Goal、r004 Contract/Cases/Design/Review、Builder card、实施源码、runner、异步 UI harness、package 与 TypeScript 配置均与冻结摘要一致，未发现基线漂移。

复核范围包括原 Goal 与当前候选边界、r004 生命周期合同及测试身份、实际会话协调器与 Store/页面/组件接线、受管确认失败处理、历史恢复失败行为、保存结果未知行为、异步枚举生命周期入口，以及本轮验证输出。实现合同限定来源为：新建、非模板、唯一顶层普通单选 VQuery；模板、导入/预存/重开普通 JSON、重复/嵌套/多个目标及其他选择器均不认证。权限与持久化权威不由该客户端生命周期候选创建。

## 验证证据

- **受管确认失败：** `QueryConditionConfiguration.vue` 中 prepare 失败或 commit 返回失败后失活会话并立即返回，未继续进入 legacy `propValue/cascade` 写入、快照记录或查询事件路径。成功路径仍由 commit 控制发布和查询事件；异步事件前复核 phase/epoch/revision 与目标身份。
- **历史部分失败及准备失败：** runner 对 `LC3-HISTORY-03` 断言 setter 原异常传播、部分恢复后的状态不声称回滚、既有指针保留已移动状态、不发送后续原生事件且生命周期失活；`LC3-HISTORY-04` 断言循环快照在 prepare 阶段失败时传播异常且 lifecycle state 不变。缺失 Manifest 仍按原始全树恢复路径处理并失活私有来源权威。
- **保存结果未知：** `LC4-SAVE-15` 覆盖未知 create/update 结果保持 dirty；更新请求未知后即使后续更新成功仍保留未知请求与 dirty 状态。测试不证明真实服务端已写入或未写入。
- **注入默认值：** `Select.vue` 当前使用 `inject('query-lifecycle-allowed', () => true)`，没有传入将默认回调执行为工厂的第三参数；因此无父级提供时默认值仍为可调用函数。实际父级 `Component.vue` 提供 `() => dvMainStore.querySingleSelectAllows(element.value)`。受控 UI harness 未提供该 key，可覆盖默认函数路径；这不是生产 DOM 全链路验证。
- **同 runner GREEN：** `node tests/filter-copy-query-reference/query-single-select-session.test.ts`，退出码 0。
- **同 runner RED：** `QSSDH_LIFECYCLE_FORCE_UNIMPLEMENTED=1 node tests/filter-copy-query-reference/query-single-select-session.test.ts`，退出码 1；在 `LC4-SAVE-14` 的会话创建行为断言处按预期失败，指纹为 `UNIMPLEMENTED`，不是构建/编译错误。
- **异步枚举 Vue SFC harness：** `node tests/filter-copy-query-observation-component/check.mjs`，PA-001 至 PA-005 通过。它使用受控 renderer 与依赖 stub，不证明生产 DOM、可访问性或完整产品运行。
- **定向 ESLint：** lifecycle 源码、runner 与异步枚举 harness 通过。
- **TypeScript：** `npm run ts:check` 退出码 2，仅报告既有 TS6504：`DeRichTextViewV3.vue.js`、`views/pages/menu/system/watermark/index.vue.js`、`views/watermark/index.vue.js`。这不是 TypeScript 全量通过；当前证据未显示这些输入属于本候选修改范围。
- **差异检查：** `git diff --check` 通过。此前检查显示工作树存在大量其他 tracked/untracked 改动；本轮未改写它们，也不据此把它们归属到本验证候选。

## Findings

### Blocking

- **本候选范围：无新增阻断项。** 已知受管确认失败回退问题及上述历史/SAVE 行为断言已由当前源码和 runner 覆盖。
- **上层产品验收仍受阻：** 真实权限验收继续 `BLOCKED / NOT_RUN`。缺少 XPack 权限实现和可用真实多用户环境，不能验证只读用户拒绝、权限撤销/恢复与相关授权路径。此阻塞不被本候选测试关闭。

### Non-blocking

- `npm run ts:check` 因三个已知 `.vue.js` 输入错误失败；本次只能报告为现有检查限制，不能记为类型检查通过。
- 异步枚举 harness 使用受控 renderer/stub，支持限定的组件行为观察，不覆盖生产 DOM、辅助功能或完整产品启动路径。
- lifecycle runner 执行冻结的候选状态机与边界断言，不等于真实服务端保存、数据库写入顺序或完整产品端到端验收。

### Questions

- 本轮限定候选判定无待答问题。任何扩大到普通 JSON 重开认证、跨进程恢复、服务器顺序或权限语义的工作，均需对应授权和独立证据，不能从本报告推断。

### Follow-on

- 在真实权限实现及隔离的多用户环境可用后，执行原合同要求的授权/拒绝、撤权/恢复矩阵，并按原 Goal 记录未覆盖项；目前不得改变 `BLOCKED / NOT_RUN`。
- 按 Goal 的完整 F01/S02 范围继续验证普通重开、完整复制行为、真实产品入口、持久化和其余原始 AC/must-have；不得用本候选 PASS 替代这些验收。
- 对 TypeScript 基线另行定位三个 TS6504 输入来源；本轮没有改动或清理这些文件。

## 声明上限

本报告只验证当前 r004 **受管新建非模板普通单选生命周期候选**。不证明普通 JSON 重开来源认证、真实服务器持久化顺序、权限实现或权限行为、原 Goal 完成、完整 F01/S02 验收及收益达成。权限状态仍为 **BLOCKED / NOT_RUN（阻塞／未运行）**。
