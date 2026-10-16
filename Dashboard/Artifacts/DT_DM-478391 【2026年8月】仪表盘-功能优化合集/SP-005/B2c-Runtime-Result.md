# B2c 本机合成场景运行结果

## 范围与证据上限

沿用用户批准的 [B2c方案](RuntimeEvidencePlan-B2c-fixtures.md)，在本机 standalone、admin、隔离 dataeasev3 中执行。后端构建见 [构建报告](B1-Build-Verified.md)，测试跳过；本报告为实际 UI/服务端产物见证，不是171条产品 AC验收。替补权限不证明真实权限。两项延期见 [范围差异](ScopeDelta-r001.md)。

## 实际结果

| 场景 | 观察与依据 | 边界 |
|---|---|---|
| F01 既有过滤/持久化 | 明细表从1000切全部5001；id≤5更新后为1..5，保存后新预览仍5行；[截图](B2c-filter-new-preview.png) | 未验证目标复制粘贴/复杂过滤树 |
| F03 Excel导出 | 异步任务SUCCESS；服务端xlsx 6行含表头、2列，id1..5及E00001..E00005与独立fixture一致；[文件核对](B2c-export-file-check.json)、[任务截图](B2c-export-task-success.png) | 等待直接下载事件超时，浏览器下载未证；非权限/脱敏验证 |
| F04 既有查询链 | region选华东后查询=300，清除后查询=650；[300](B2c-query-region300.png)、[650](B2c-query-clear650.png) | 未证明级联或完整选项过滤树 |
| F05 实际样式渲染 | id>3红色背景，4/5命中，1..3不变，保存重开保持；[截图](B2c-style-reopened.png) | 文本也呈红色；不宣称全部透视列格式语义通过 |
| F06 同类字段多选拖拽 | category与enum_text用Meta多选，一次拖入region行维度形成三字段，一次撤销恢复region；[拖入DOM](B2c-multidrag-dom.txt)、[撤销DOM](B2c-multidrag-undo-dom.txt) | 跨角色选择会清空另一组；未覆盖容量/全部目标区域 |
| F07 枚举多选清空 | E00002+E00003查询=500；清空、确定再查询=650；[多选](B2c-enum-multi500.png)、[清空](B2c-enum-clear650.png) | 5001条fixture不等于已验证5000/5001截断、搜索或全部三类选择器 |
| F08 汇总/表达式 | 华东300、华南300、华北50，总计650；自定义1+1更新图表数据后2；切透视表总计650；[表达式](B2c-custom-total-render.png)、[透视](B2c-pivot-total.png) | 确认后一度显示“-”，刷新后才2；单维度小计禁用，未覆盖层级/10槽位 |

独立数据oracle见 [fixture oracle](B2c-fixture-oracle.json)。样式、query、多拖case在相应操作前另存文件；其它细化观察沿用原方案与确定性fixture，不追补虚假的事前冻结时间。运行成功仅指表中局部行为观察，不把所在功能全部 AC 标为 PASS。

## 清理与副作用

本轮创建源、数据集、看板、图表、查询组件、导出任务和5001行合成表。通过产品UI删除导出任务、看板、数据集与数据源；按owner标记核对后DROP唯一合成表。只读SQL核对资源计数均0，服务端导出文件不存在，7070/8100无监听。前后端仅停止本轮进程，MySQL/Redis保留。见 [对象记录](B2c-created-objects.json)、[清理结果](B2c-cleanup-result.json)、[UI清理截图](B2c-cleanup-source.png)。初始化/迁移、日志、审计和缓存的既有副作用未回滚；不声称环境恢复为逐字节原状。
