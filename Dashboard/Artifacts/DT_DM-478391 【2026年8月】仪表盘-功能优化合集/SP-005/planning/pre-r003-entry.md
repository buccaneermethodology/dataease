# S02–S09 技术进入资料包（调查中，未获实施批准）

本机既有链路已取得局部运行见证；完整独立审查与Gate尚未完成，调查终态见最终审查和回执。本包提供候选入口，不是最终设计、不授权开发。原156题、171 AC、19 fixture、14 issue全部保留。切片进入仍为CONDITIONAL（有条件）或BLOCKED（真实环境依赖），不自动授权实施。

## S02 / F01

- 状态：CONDITIONAL；相关既有链路有局部运行证据，产品AC未整体验收，仍需Slice设计审查及实施授权。
- 真实/候选入口：FilterTree.vue → editor/index.vue customFilter → ChartViewManege；专用复制入口仍需确认。
- 原AC：AC-F01-Q004, AC-F01-Q005, AC-F01-Q006, AC-F01-Q007, AC-F01-Q008, AC-F01-Q009, AC-F01-Q010, AC-F01-Q011, AC-F01-Q012, AC-F01-Q013, AC-F01-Q014, AC-F01-Q015, AC-F01-ORIG-01, AC-F01-ORIG-02。
- Fixture：FX-COPY；依赖：ISS-AC-01, ISS-AC-02。
- 主要风险：跨标签身份/TTL、目标树原子替换和容量口径。
- 测试入口：RuntimeEvidenceLedger.json 的 RT-F01；逐项检查见TestabilityMatrix-r012.json，未定位项见ACGapLedger.json。
- 进入条件：复用B2c局部证据并覆盖该Slice原AC和已登记gap；具备真实权限/设备的相关场景仍须补测；完成独立审查；后续Slice另冻结设计并取得实施授权。

## S03 / F02

- 状态：BLOCKED；指定App/真设备不可用，运行未证。此依赖已延期出S01完成条件，仍是F02实际验收进入条件。
- 真实/候选入口：router/mobile.ts → views/mobile/panel/Mobile.vue → ComponentWrapper；指定App独立表格入口未证。
- 原AC：AC-F02-Q016, AC-F02-Q017, AC-F02-Q018, AC-F02-Q019, AC-F02-Q020, AC-F02-Q021, AC-F02-Q022, AC-F02-Q023, AC-F02-Q024, AC-F02-Q025, AC-F02-Q026, AC-F02-Q027, AC-F02-ORIG-01。
- Fixture：FX-MOBILE；依赖：ISS-AC-03。
- 主要风险：指定App/真实设备缺失，方向与返回状态未证。
- 测试入口：RuntimeEvidenceLedger.json 的 RT-F02；逐项检查见TestabilityMatrix-r012.json，未定位项见ACGapLedger.json。
- 进入条件：复用B2c局部证据并覆盖该Slice原AC和已登记gap；具备真实权限/设备的相关场景仍须补测；完成独立审查；后续Slice另冻结设计并取得实施授权。

## S04 / F03

- 状态：CONDITIONAL；相关既有链路有局部运行证据，产品AC未整体验收，仍需Slice设计审查及实施授权。
- 真实/候选入口：UserViewEnlarge.vue/util.ts → ChartDataServer → ExportCenterManage/ExportCenterDownLoadManage。
- 原AC：AC-F03-Q028, AC-F03-Q029, AC-F03-Q030, AC-F03-Q031, AC-F03-Q032, AC-F03-Q033, AC-F03-Q034, AC-F03-Q035, AC-F03-Q036, AC-F03-Q037, AC-F03-Q038, AC-F03-Q039, AC-F03-Q040, AC-F03-Q041, AC-F03-Q042, AC-F03-Q043, AC-F03-Q044, AC-F03-Q045, AC-F03-Q046, AC-F03-Q047, AC-F03-Q048, AC-F03-Q049, AC-F03-ORIG-01, AC-F03-ORIG-02。
- Fixture：FX-EXPORT, FX-FORMAT；依赖：ISS-AC-02, ISS-AC-04, ISS-AC-05, ISS-AC-06。
- 主要风险：历史文件行列权限、永久保留与清理、取消记录和全格式内容。
- 测试入口：RuntimeEvidenceLedger.json 的 RT-F03；逐项检查见TestabilityMatrix-r012.json，未定位项见ACGapLedger.json。
- 进入条件：复用B2c局部证据并覆盖该Slice原AC和已登记gap；具备真实权限/设备的相关场景仍须补测；完成独立审查；后续Slice另冻结设计并取得实施授权。

## S05 / F04

- 状态：CONDITIONAL；相关既有链路有局部运行证据，产品AC未整体验收，仍需Slice设计审查及实施授权。
- 真实/候选入口：QueryConditionConfiguration.vue/Select.vue → enumValueObj → DatasetDataManage → Provider；canvas持久化。
- 原AC：AC-F04-Q050, AC-F04-Q051, AC-F04-Q052, AC-F04-Q053, AC-F04-Q054, AC-F04-Q055, AC-F04-Q056, AC-F04-Q057, AC-F04-Q058, AC-F04-Q059, AC-F04-Q060, AC-F04-Q061, AC-F04-Q062, AC-F04-Q063, AC-F04-Q064, AC-F04-Q065, AC-F04-Q066, AC-F04-Q067, AC-F04-Q068, AC-F04-Q069, AC-F04-ORIG-01。
- Fixture：FX-CASCADE；依赖：ISS-AC-03, ISS-AC-07。
- 主要风险：前端集合与后端过滤语义、null错误响应、级联及持久化。
- 测试入口：RuntimeEvidenceLedger.json 的 RT-F04；逐项检查见TestabilityMatrix-r012.json，未定位项见ACGapLedger.json。
- 进入条件：复用B2c局部证据并覆盖该Slice原AC和已登记gap；具备真实权限/设备的相关场景仍须补测；完成独立审查；后续Slice另冻结设计并取得实施授权。

## S06 / F05

- 状态：CONDITIONAL；相关既有链路有局部运行证据，产品AC未整体验收，仍需Slice设计审查及实施授权。
- 真实/候选入口：TableThresholdEdit.vue/Threshold.vue → common_table.ts → table-pivot.ts。
- 原AC：AC-F05-Q070, AC-F05-Q071, AC-F05-Q072, AC-F05-Q073, AC-F05-Q074, AC-F05-Q075, AC-F05-Q076, AC-F05-Q077, AC-F05-Q078, AC-F05-Q079, AC-F05-Q080, AC-F05-Q081, AC-F05-Q082, AC-F05-Q083, AC-F05-Q084, AC-F05-Q085, AC-F05-Q086, AC-F05-Q087, AC-F05-Q088, AC-F05-Q089, AC-F05-Q090, AC-F05-ORIG-01, AC-F05-ORIG-02。
- Fixture：FX-ENUM, FX-FORMAT, FX-LABEL, FX-STYLE；依赖：ISS-AC-03, ISS-AC-08。
- 主要风险：真实条件样式渲染、缺失字段ID、冲突/数量/预览语义。
- 测试入口：RuntimeEvidenceLedger.json 的 RT-F05；逐项检查见TestabilityMatrix-r012.json，未定位项见ACGapLedger.json。
- 进入条件：复用B2c局部证据并覆盖该Slice原AC和已登记gap；具备真实权限/设备的相关场景仍须补测；完成独立审查；后续Slice另冻结设计并取得实施授权。

## S07 / F06

- 状态：CONDITIONAL；相关既有链路有局部运行证据，产品AC未整体验收，仍需Slice设计审查及实施授权。
- 真实/候选入口：editor/index.vue activeDimension/activeQuota/drop/addAxis → snapshot.ts。
- 原AC：AC-F06-Q091, AC-F06-Q092, AC-F06-Q093, AC-F06-Q094, AC-F06-Q095, AC-F06-Q096, AC-F06-Q097, AC-F06-Q098, AC-F06-Q099, AC-F06-Q100, AC-F06-Q101, AC-F06-Q102, AC-F06-Q103, AC-F06-Q104, AC-F06-Q105, AC-F06-Q106, AC-F06-Q107, AC-F06-Q108, AC-F06-ORIG-01。
- Fixture：FX-DRAG；依赖：ISS-AC-09。
- 主要风险：部分成功与移动原子性、拖动入口差异、刷新和撤销。
- 测试入口：RuntimeEvidenceLedger.json 的 RT-F06；逐项检查见TestabilityMatrix-r012.json，未定位项见ACGapLedger.json。
- 进入条件：复用B2c局部证据并覆盖该Slice原AC和已登记gap；具备真实权限/设备的相关场景仍须补测；完成独立审查；后续Slice另冻结设计并取得实施授权。

## S08 / F07

- 状态：CONDITIONAL；相关既有链路有局部运行证据，产品AC未整体验收，仍需Slice设计审查及实施授权。
- 真实/候选入口：Select.vue/FilterFiled.vue/ResultFilterEditor.vue → 枚举API → DatasetDataManage。
- 原AC：AC-F07-Q109, AC-F07-Q110, AC-F07-Q111, AC-F07-Q112, AC-F07-Q113, AC-F07-Q114, AC-F07-Q115, AC-F07-Q116, AC-F07-Q117, AC-F07-Q118, AC-F07-Q119, AC-F07-Q120, AC-F07-Q121, AC-F07-Q122, AC-F07-Q123, AC-F07-Q124, AC-F07-Q125, AC-F07-Q126, AC-F07-Q127, AC-F07-Q128, AC-F07-Q129, AC-F07-Q130, AC-F07-Q131, AC-F07-Q132, AC-F07-Q133, AC-SCOPE-D07。
- Fixture：FX-ENUM, FX-QUOTE, FX-SCOPE, FX-TYPES；依赖：ISS-AC-03, ISS-AC-07。
- 主要风险：全域搜索、输入存在性验证、截断结果误清选择、初始化失败范围。
- 测试入口：RuntimeEvidenceLedger.json 的 RT-F07；逐项检查见TestabilityMatrix-r012.json，未定位项见ACGapLedger.json。
- 进入条件：复用B2c局部证据并覆盖该Slice原AC和已登记gap；具备真实权限/设备的相关场景仍须补测；完成独立审查；后续Slice另冻结设计并取得实施授权。

## S09 / F08

- 状态：CONDITIONAL；相关既有链路有局部运行证据，产品AC未整体验收，仍需Slice设计审查及实施授权。
- 真实/候选入口：TableTotalSelector.vue/CustomAggrEdit.vue → ChartDataManage/TablePivotHandler → table-pivot.ts。
- 原AC：AC-F08-Q134, AC-F08-Q135, AC-F08-Q136, AC-F08-Q137, AC-F08-Q138, AC-F08-Q139, AC-F08-Q140, AC-F08-Q141, AC-F08-Q142, AC-F08-Q143, AC-F08-Q144, AC-F08-Q145, AC-F08-Q146, AC-F08-Q147, AC-F08-Q148, AC-F08-Q149, AC-F08-Q150, AC-F08-Q151, AC-F08-Q152, AC-F08-Q153, AC-F08-Q154, AC-F08-Q155, AC-F08-Q156, AC-F08-ORIG-01, AC-F08-D11-COUNT, AC-F08-D11-SLOTS, AC-SCOPE-D08。
- Fixture：FX-AGG, FX-EXPORT-AGG, FX-EXPR, FX-FORMULA-LIMIT, FX-HIER, FX-NULL, FX-SCOPE, FX-WEIGHT；依赖：ISS-AC-03, ISS-AC-10。
- 主要风险：底层聚合/权限制约、自动预览竞态、10槽位和异常公式。
- 测试入口：RuntimeEvidenceLedger.json 的 RT-F08；逐项检查见TestabilityMatrix-r012.json，未定位项见ACGapLedger.json。
- 进入条件：复用B2c局部证据并覆盖该Slice原AC和已登记gap；具备真实权限/设备的相关场景仍须补测；完成独立审查；后续Slice另冻结设计并取得实施授权。

## 共享改动与证据

持久化、筛选和权限链共享，按TechnicalImpactMatrix.md与DependencyGraph.md协调；避免跨功能绕过既有权限或改变JSON契约。源码索引见ClaimsLedger-r002.json（70条摘要复核），构建见BuildTestBaseline-r002.md。运行台账8项PARTIAL（七功能及保存重开），RT-F02与RT-AUTH延期且NOT_RUN；详见B2c-Runtime-Result.md及ScopeDelta-r001.md。不得将候选分片顺序解释为已批准业务依赖。
