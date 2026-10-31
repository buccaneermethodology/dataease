# S02 矩阵热力图候选主数据判空

- 原始验收：`MVP-UI-10`，准备真实图层后才采用，失败保旧；不新增或删减38项义务。
- 维护检查：`node core/core-frontend/tests/filter-copy-mvp-renderers/check.mjs`。
- 冻结案例：S02-F01/MVP-20261027/THeatmapPrimaryDataCases-r001.json，T01–T07。

给定矩阵热力图的 `tableRow` 有合法矩阵行，而辅助 `data` 数组为空；当候选准备运行；则必须调用矩阵绘制路径，不能报告“暂无数据”并采用空画面。

给定矩阵主数据为空数组；即使辅助数据非空，仍进入合法空态。给定矩阵主数据缺失或不是数组；不得归一化为合法空态，由既有绘制/准备失败路径拒绝采用。

给定其他G2图表；继续以原 `data` 数组判空。C2清理、G2Plot、权限、查询和后端表示不变。

组件检查使用真实完整SFC及明确的图库/DOM/Store替身；T01/T03/T04/T05的可信RED与相同冻结输入GREEN分别保留。真实矩阵图层和保存重开由独立运行证据补齐，组件GREEN不替代产品验收。项目没有Session registry/reconcile工具，本卡不声称程序化注册校验。
