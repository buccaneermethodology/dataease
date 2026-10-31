# QOBS-ASYNC Vue组件RED r001

- 测试身份：S02-QOBS-ASYNC-PRODUCT-VUE-RED-r001 / 冻结产品Fixtures PA-001、PA-002。
- 真实入口：从当前 Select.vue 运行 Vue SFC compileScript(inlineTemplate)，通过 Vue 3 createRenderer 挂载真实组件 setup/template；Element Select 和边界服务由显式端口stub代替，枚举响应使用可控 Promise。
- RED运行：node core/core-frontend/tests/filter-copy-query-observation-component/check.mjs，exit=1。
- 预期失败指纹：PA-001要求首个迟到成功响应缺少用户新选C时只启动一次核对请求；现有组件只启动首次请求，断言 late response triggers one verification request 实际1、预期2失败。编译、挂载、生命周期和异步响应均已完成。
- Claim ceiling：可信Vue组件时序RED；受控Select端口不证明Element真实DOM/禁用标签/a11y、真实权限、撤权、保存、完整F01或S02。
