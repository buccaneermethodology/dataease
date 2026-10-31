# M0 执行证据 r001

## 范围与声明上限

本证据只覆盖 SOURCE-LIFECYCLE r003准入的同步 detached `prepareConfirmation` / `captureSave` 纯模块及冻结 M0 cases。未连接 Store、确认/发布入口、历史、网络、dirty 清理、权限或真实保存重开；不代表完整 F01 或 S02 Goal 验收。

## RED / GREEN 与检查

- RED：`M0_FORCE_UNIMPLEMENTED=1 node tests/filter-copy-query-reference/query-single-select-session.test.ts`，退出码 1；首个断言 `M0-PREP-001` 在 `prepareConfirmation` 为 UNIMPLEMENTED 时失败（预期 ok=true，实际 false）。这是同runner行为断言级RED，不是编译失败。
- GREEN：`node tests/filter-copy-query-reference/query-single-select-session.test.ts`，退出码 0；输出 `M0 PASS: 6 contract cases; preparation, complete capture, detachment and fail-closed guards`。覆盖准备有效/陈旧候选、完整payload/overlay/名称检查参数/清理、输入隔离、canonical SHA-256与非法输入拒绝。
- ESLint：`./node_modules/.bin/eslint src/custom-component/filter-copy/query-single-select-session.ts tests/filter-copy-query-reference/query-single-select-session.test.ts`，退出码 0。
- `git diff --check`（两目标文件）：退出码 0。
- RED/GREEN 均在 core/core-frontend 下执行；Node 24.21.0 + 已安装 esbuild。运行时出现 Node 对无 type=module package 的提示，不影响退出结果。

## 绑定对象

- Contract: `QuerySingleSelectPreparationCaptureContract-r001.json` SHA-256 `256811438403033c0e3d44ed131228c3c1835f247ee18f3e9055b57c2fb7940b`
- Cases: `QuerySingleSelectPreparationCaptureCases-r001.json` SHA-256 `09e939e895afc962785f50d578b7efcf144a515d1e002aff41e549444742d12f`
- Source: `core/core-frontend/src/custom-component/filter-copy/query-single-select-session.ts` SHA-256 `8f1ac0bb695352900041f88dacaf464205c18e858c004318f8ebb0c98c92aad7`
- Test: `core/core-frontend/tests/filter-copy-query-reference/query-single-select-session.test.ts` SHA-256 `e83a481a8bd4a02ab7904a3d682ecfe35f7e290d74a63442575b9e2fbdd02fb8`
- Source admission: `planning/execution-admission-qssdh-source-lifecycle-m0-builder-source-r001.json`
- Test admission: `planning/execution-admission-qssdh-source-lifecycle-m0-builder-test-r001.json`

## 限制

独立 Validation 尚未完成。该模块接收显式传入的 overlay 候选，不创建会话来源权威；普通 JSON 重开仍未认证。LC3-F01..03阻断发布/网络保存激活，真实权限保持 `BLOCKED / NOT_RUN`，不使用 standalone 或 mock 代替。
