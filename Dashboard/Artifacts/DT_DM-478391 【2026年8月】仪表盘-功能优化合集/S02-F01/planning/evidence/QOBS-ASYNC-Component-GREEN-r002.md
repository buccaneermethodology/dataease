# QOBS-ASYNC Vue组件GREEN r002

- 冻结Design/Fixtures：产品adapter r004 / PA-001..005。可信RED及同一测试入口身份见[RED r001](QOBS-ASYNC-Vue-RED-r001.md)；本轮在原用例上扩展三个负例。
- `node core/core-frontend/tests/filter-copy-query-observation-component/check.mjs`：PA-001..005全通过。测试实际编译并挂载 `Select.vue`，用Vue 3 renderer和可控Promise观察调度；Select UI为受控端口stub。
- 定向ESLint：`Select.vue`、zh-CN/en/tw locale及测试文件通过。
- `NODE_OPTIONS=--max_old_space_size=8192 ./node_modules/.bin/vite build --mode base`：通过（22241 modules transformed；保留仓库现有eval/dynamic import/模块directive告警）。未执行 `build:flush`。默认Node堆的首次构建尝试OOM，按项目8GB设置重跑通过。
- `npm run ts:check -- --pretty false`：失败于3个既有 `.vue.js` 文件触发TS6504；错误输入位于 `src/custom-component/rich-text/DeRichTextViewV3.vue.js`、`src/views/pages/menu/system/watermark/index.vue.js`、`src/views/watermark/index.vue.js`，本任务未修改这些文件。
- Claim ceiling：不证明真实Element DOM/禁用标签/a11y、权限/撤权、保存、完整F01或S02验收；仍待独立实现Validation。
