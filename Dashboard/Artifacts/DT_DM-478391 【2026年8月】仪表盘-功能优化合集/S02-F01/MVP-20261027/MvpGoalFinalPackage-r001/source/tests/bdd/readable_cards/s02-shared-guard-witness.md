# S02 原UI05/06共享guard见证

原AC：AC-MVP-F01-02/04；原case：MVP-UI-05/06。完整38项/49类型不减。

- 真实正例：Given 正常RowAuth配置日粒度大于2024/03/15及六店子组；When 真实bubble源复制、symbolic目标粘贴、正常保存离开重开；Then 原生完整树与JSON边界分层保真，固定CSV选中12行/合计5337。原控制失败与后成功分开。
- 纯guard反例：Given 上次有效内存clip及完整目录；When 缺失/null/空dataset、count/-1、不可用计算字段/表达式、两个非法operator或三畸形subTree；Then 整次拒绝，旧clip/session与输入不变。这是合成反例，不是新真实UI golden，不推广所有合法计算字段禁止。
- 组件类别反例：Given 真实Vue/composable/service/emitter和已就绪字段，bar正控制有receiver可派发1次；切换类别后重新resolve该轮目录，并确认fieldsReady和其它guard可放行；When 对组件输入VQuery或v-query错误类别；Then copy/paste拒绝且receiver0，旧clip/目标保持。registry/字段/身份为provider替身，receiver计数不等物理HTTP0，不冒充真实query编辑器或鉴权。

执行入口：core/core-frontend/tests/filter-copy-mvp-guard-witness/check-r002.mjs。Cases与真实日期golden位于S02-F01/MVP-20261027/shared-guard-witness-r001及evidence/StaticDateNativeGolden-r001.json；均为执行见证，不替代Goal authority。
