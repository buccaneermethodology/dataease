# Access 候选独立静态语义复核 v2

- reviewed_at：2026-10-14T02:37:15.853142+00:00
- snapshot_id：SP001-access-semantic-v2
- as_of_state：当前access候选53事实、69关系；未绑定正式KB和最终收尾。
- candidate SHA-256：`02cf0116903265e0e5a69db2e96226f8e984db495551af53cea49e84c6dd690f`。
- reviewer：data_extract，未编写access候选；本轮未修改候选。
- verdict：**PASS_WITH_BOUNDS（在已声明静态范围内通过）**。上一轮B1/B2已消除，ACCESS-023精度建议已落实；可进入正式静态知识整合。此结论承接v1已读基线，仅对本轮变更及原阻断作定向复验，不是全KB最终验收，也不是53条事实全部重新审读。

## 本轮真实阅读与检查

卡access-semantic-card-v2固定摘要验证通过。亲读8条变更事实：ACCESS-023、047–053。新引用证据摘要与行界逐项重算一致；contract引用、关系evidence_fact_ids有效。这些结构检查只辅助下面的语义判断。

| 事实 | 亲读源码区间 | 结论 |
|---|---|---|
| ACCESS-023 | PermissionManage.java:78–113，承接v1:58–141 | 任一脱敏opt触发保留，但映射存get(0)，新措辞准确，不暗示精确择中规则。 |
| ACCESS-047–049 | Entrances.vue:17–80；encryption.ts:24–46/62–66 | 同源直接落Store与事件、跨源加密origin后校验、失败提示、既有Token/预览/链接早退、安装/移除监听均与实现相符。ensureDekey及加密异常在initApi Promise catch之外已明确。 |
| ACCESS-050 | ExportCenterDownLoadManage.java:392–435 | orderChecked升序、逻辑totalCount取较小值、sheet/page数量、通常页SQL偏移及单页sheet的offset0均准确；没有误称实际导出绝不超限。 |
| ACCESS-051 | 同文件:435–496/140–149/937–954，承接v1 DatasetDataManage:552–585 | prepared值通过copy复制；Provider结果传desensitizationList至buildPreviewData，再按dataeaseName读取、落Excel单元格，脱敏到文件的数据链成立。参数为空时applyPreparedParams早退，不要求每个请求一定含参数。 |
| ACCESS-052 | 同文件:498–521 | 进度、加水印、流写入、SUCCESS/FAILED与finally清理相符。 |
| ACCESS-053 | ExportCenterLimitManage.java全文件；ExportCenterUtils.java全文件；ExportCenterDownLoadManage.java:108–149 | dataset/views配置默认各100000，page.size默认50000，sheetLimit为1000000；type空白或精确view走viewLimit，否则datasetLimit。默认值不是部署实际值。 |

## 原阻断消除与核心门槛

B1已消除：F09的trigger、inputs、outputs、preconditions、state_changes、postconditions、invariants、failures、implementation、dependencies和data均引用新增握手事实；failures改为ACCESS-048，未继续拿事件发送no-op代替初始化失败。后端签发/域名校验/持久化仅有SDK契约的边界仍保留，符合XPack仅公共契约与核心调用范围。

B2已消除：F10把ACCESS-050–053挂入输入、输出、状态、后置条件、约束、实现、依赖及数据，补足导出计数/分页、prepared参数、脱敏结果写入、进度和文件完成链。核心证据不再仅是过滤前段加结束状态。

F08与F15承接v1关键样本结论，F23承接导航样本结论；本次不以增加事实数量代替语义核实。未发现新的静态准入阻断。

## 精确限制及后续事项

限额是逻辑计数而非已证实硬输出上限：通常末页SQL仍请求完整extractPageSize，单页sheet分支使用offset0。候选已精确记载，不能在生成摘要中简化成“确保最多N行”。它们属于已暴露的实现边界；是否另立产品修复须独立任务，不要求本知识库任务修改产品。

握手在读取event.data标记及加密步骤可能出现未被initApi.catch覆盖的异常；候选没有把所有初始化异常等同域名错误。跨源服务端校验的真实强度仍不能从前端成功分支推出。

本轮未执行浏览器、导出、权限、并发或测试资产；未审专有XPack；不声明运行正确、安全认证或生产就绪。v1未逐读的其余事实仍不在本轮全量认可范围，正式整合与最终收尾需要自己的最终包核验。本报告仅绑定上列候选摘要，后续变更使其不能直接作为新版本通过证据。
