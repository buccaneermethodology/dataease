# QOBS-ASYNC Vue组件GREEN r001

- RED/GREEN使用同一测试文件身份 `core/core-frontend/tests/filter-copy-query-observation-component/check.mjs` 与冻结产品Fixtures r004。
- PA-001..005 同一套真实 `Select.vue` + Vue 3 scheduler + 受控 Select 端口测试通过：一次核对；C有效；C仍缺时保留并呈现禁用无效项；核对失败呈现未核实项并关闭loading；核对过程中改选D后迟到响应不改状态。
- 定向 ESLint：Select.vue 与组件测试通过。
- `npm run ts:check -- --pretty false` 未通过：当前 `tsconfig` include 命中3个既有 `src/**/*.vue.js` 文件，报 TS6504（allowJs 未开启）。这些文件非本次改动，未清理或修改。
- Claim ceiling：不证明真实 Element DOM/a11y、权限/撤权、保存、全量过滤复制链路、F01/S02验收。
