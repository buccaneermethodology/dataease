# 数据领域独立语义复核 v1

- reviewed_at: 2026-10-14T02:32:30.597519+00:00
- snapshot_id: SP001-data-candidate-5bc9735817c8
- as_of_state: 候选提取包、正式 KB 准入前；不是最终收尾审查。
- reviewed artifact: Dashboard/Artifacts/SP-001/extraction/data/candidate.json
- SHA-256: `5bc9735817c8b2aaf4a4a12ac71c74d9a7acecf2284a89ca5181d364d579bcbb`
- reviewer: chart_extract 接收 semantic-data 验证卡后独立审阅；未编写或修改 data 候选。
- verdict: REPAIR_REQUIRED（需要修正后再核实，当前不作完整语义通过声明）。

## 范围与抽样分母

本轮检查 F01 数据源、F02 文件/API 接入、F03 数据集三项核心能力的静态契约。已阅读全文候选的 74 条事实、3 项能力契约与 87 条关系；其中亲读来源核实 35/74 条事实，涉及 24/46 个被引用源码文件。核心能力逐项覆盖为 3/3，非核心能力分母为 0。其他事实未被这份报告逐条语义认证。全部事实来源 SHA 重算无漂移，但这不代替语义核实。

读取目标、合同、用户目录更正、验证卡及渲染提示；卡预期摘要复验通过。仅写本报告，未改候选、产品、测试、数据库或调用外部服务，未运行测试/构建。目标要求静态首版，运行正确、全数据库兼容与实际权限身份测试均不在本轮声明中。

## 逐能力结论

| 能力 | 核实结果与关键边界 | 结论 |
| --- | --- | --- |
| F01 创建和管理数据源 | save 正 ID 转 update，配置解码、Excel 文件检查、类型准入、审计与 innerSave 真实存在；连接异常可置 Error 后继续保存，不能把连接成功当保存必需条件。update 保留原 pid。Factory 内置/插件路由与新建排除 h2 是不同入口契约。接口权限被正确限定为注解声明。 | 主链有源码支持；须补精确引用 B01，并完成权限措辞一致性检查。 |
| F02 文件/API 接入 | 本地 Excel 全量临时表替换的异常重新抛出，API extractedData catch 记录 Error 后继续，二者差异被正确保留。API 游标停止条件与文件路径归属/符号链接规则有源码支持。HTTP 请求前启动总时限、按实际读取累计字节与提前 close 中止均有实现。 | 主链有源码支持；远程任务保存引用范围缺失，修复 B01。传输校验配置与已传输字节校验建议按 N02 区分。 |
| F03 建立和管理数据集 | 事务 save、字段不能为空、ID 不等于 pid、表清理只在保留 ID 非空时执行均可核实。编辑预览 false/true 与已保存预览 true/false 的 checkPermission/encode 区别真实存在；Provider/JDBC、prepared 参数与预览输出结构明确。 | 须修复 B02 权限条件省略；B01 补树值异常引用与迁移成功状态引用。 |

## 必须修正

### B01：若干事实的精确引用截掉了所声称的接口或状态变化

这些不是发现产品错误，而是知识准入证据边界错误。整文件 SHA 匹配不能替代断言引用行覆盖。

- DATA-002 引用 `sdk/api/api-base/src/main/java/io/dataease/api/ds/DatasourceApi.java:45-142`，但 save 的 POST、输入和输出声明在 41-43。修正为从 41 开始或增加独立证据。影响 DATA-R002、DATA-R017。
- DATA-017 引用 `core/core-backend/src/main/java/io/dataease/datasource/server/DatasourceServer.java:324-405`，远程 Excel 的 `setTaskStatus`、`insert`、`addSchedule` 在 406-408，当前范围不能支持“远程 Excel 保存同步任务”。扩展至 408。影响 DATA-R024。
- DATA-035 的 `DatasetDataServer.java:44-91` 截在树值异常的 `LogUtil.error`；树值接口 `return null` 在 92。扩展至 94；不能只用其他枚举方法返回 null 推及树值方法。影响 DATA-R044。
- DATA-040 的 `InitSqlListener.java:21-102` 截在耗时设置，`setSuccess(true)` 与 `saveAndFlush` 在 103-104。扩展至 104。影响 DATA-R014、DATA-R032、DATA-R049。

修复后重新核实事实引用和受影响关系即可；无需为这类引用修正运行产品。

### B02：DATA-032 的行权限条件必须显式保留 checkPermission

现文“checkPermission=true 时过滤列权限并在无列权限时拒绝，有用户时加载行权限”后半句可能解释为只要 uid 非空就加载行权限。实际 `DatasetDataManage.java:265-268` 是 `uid != null && checkPermission`，编辑预览入口明确传 false（`DatasetDataServer.java:27-28`）。这影响核心权限理解，且与 DATA-031 的入口差异相邻，不能依赖读者自行补全条件。

建议明确写成：“仅 checkPermission=true 才过滤列权限；行权限还要求 uid 非空，即 uid!=null && checkPermission。”影响 F03.permissions/implementation 及 DATA-R041；不要求修改产品。

## 非阻断建议与已保留的边界

- N01：F01.preconditions 包含 DATA-007（连接校验成功路径），但 DATA-003 明确连接错误不阻止保存。建议在契约映射或读者投影明确这是连接验证的条件/过程，不是创建成功的必要前置条件。
- N02：DATA-050 “先校验传输大小/时限”在入口 438-439 实际是配置范围校验；真实响应/累计字节与时限在 RemoteTransfer/HttpClientUtil，已有 DATA-053/054 支持。建议改为“先校验大小/时限配置合法性”，避免读成下载前知道实际大小。
- N03：DATA-059 的“getTables 刷新写入”应另附 DatasourceServer 对应行；其当前 DatasetCacheManage 引用仅支持本类无删除方法与缓存未命中回源。负面搜索结论应保留检索范围及未知扩展边界，不将“未找到”升级为全运行环境绝无失效机制。本轮在 core/core-backend/src/main 与 sdk/common/src/main 对两个常量和实际 cache 名重新检索，结果只含配置、常量与读写调用，未见显式删除。
- DATA-042/043/057/058 正确区分 JCache 动态建缓存、已有缓存配置和 Redis 每键 TTL。预建 dataset cache 的 expiry none 与 8 小时调用参数同时存在；不可向全部缓存外推 8 小时或 1 分钟实际 TTL。
- DATA-039 保留非空合并失败回退原对象及非完整 PATCH/并发控制边界；未把 Repository save(null) 当显式清空。
- DATA-036/037 区分跨源 Calcite 与 JDBC 连接释放，不将“结果集/语句 finally 尝试关闭”等同每个执行资源和异常路径都已实际验证。
- 本报告未独立读取 DATA-072/073/074 测试资产，未对其用例清单作逐条背书；候选正确声明未运行。真实数据库、FTP/SMB、UI 与权限身份运行验证属于本轮声明范围外，不应据此要求临时启动产品。

## 关系核对

87 条关系均为 CAPABILITY_REALIZED_BY，端点与 evidence_fact_ids 对应候选事实；结构重算不等于 87 条都已单独语义审阅。抽样涉及的事实与 F01/F02/F03 主题相关，未发现需要删除的跨能力错误连边。上述 B01/B02 影响的关系必须跟随修复再审，不能保留事实不完整却单独给关系通过。

## 实际重读清单

以下为本轮完整读取所列证据范围的事实（不是 rg 命中清单）；额外读取的修正邻接行见 B01。首批工具输出截断的 DATA-023/028/031/032/033/039 已随后单独完整重读。

- DATA-002：`sdk/api/api-base/src/main/java/io/dataease/api/ds/DatasourceApi.java:45-142`
- DATA-003：`core/core-backend/src/main/java/io/dataease/datasource/server/DatasourceServer.java:296-324`
- DATA-004：`core/core-backend/src/main/java/io/dataease/datasource/manage/DataSourceManage.java:128-171`
- DATA-006：`sdk/extensions/extensions-datasource/src/main/java/io/dataease/extensions/datasource/factory/ProviderFactory.java:23-48`
- DATA-009：`core/core-backend/src/main/java/io/dataease/datasource/server/DatasourceServer.java:425-451`
- DATA-013：`core/core-backend/src/main/java/io/dataease/datasource/server/DatasourceServer.java:1014-1037`
- DATA-017：`core/core-backend/src/main/java/io/dataease/datasource/server/DatasourceServer.java:324-405`
- DATA-020：`core/core-backend/src/main/java/io/dataease/datasource/manage/DatasourceSyncManage.java:55-98`
- DATA-021：`core/core-backend/src/main/java/io/dataease/datasource/manage/DatasourceSyncManage.java:141-175`
- DATA-023：`core/core-backend/src/main/java/io/dataease/datasource/provider/ApiUtils.java:113-173`
- DATA-026：`sdk/api/api-base/src/main/java/io/dataease/api/dataset/DatasetTreeApi.java:30-108`
- DATA-028：`core/core-backend/src/main/java/io/dataease/dataset/manage/DatasetGroupManage.java:99-167`
- DATA-030：`core/core-backend/src/main/java/io/dataease/dataset/manage/DatasetTableManage.java:25-72`
- DATA-031：`core/core-backend/src/main/java/io/dataease/dataset/server/DatasetDataServer.java:25-28`；`core/core-backend/src/main/java/io/dataease/dataset/manage/DatasetGroupManage.java:496-540`
- DATA-032：`core/core-backend/src/main/java/io/dataease/dataset/manage/DatasetDataManage.java:229-276`
- DATA-033：`core/core-backend/src/main/java/io/dataease/dataset/manage/DatasetDataManage.java:268-316`
- DATA-035：`core/core-backend/src/main/java/io/dataease/dataset/server/DatasetDataServer.java:44-91`；`sdk/api/api-base/src/main/java/io/dataease/api/dataset/DatasetDataApi.java:27-35`
- DATA-036：`core/core-backend/src/main/java/io/dataease/datasource/provider/CalciteProvider.java:287-336`
- DATA-037：`core/core-backend/src/main/java/io/dataease/datasource/provider/CalciteProvider.java:680-746`
- DATA-039：`core/core-backend/src/main/java/io/dataease/config/JpaUpdateNonNullAspect.java:36-134`
- DATA-040：`core/core-backend/src/main/java/io/dataease/listener/InitSqlListener.java:21-102`
- DATA-041：`core/core-backend/src/main/java/io/dataease/dataset/manage/DatasetCacheManage.java:24-95`
- DATA-042：`sdk/common/src/main/java/io/dataease/cache/impl/DefaultCacheImpl.java:19-98`
- DATA-043：`sdk/common/src/main/java/io/dataease/cache/impl/RedisCacheImpl.java:19-69`
- DATA-044：`core/core-backend/src/main/java/io/dataease/datasource/provider/ExcelFileGuard.java:18-64`
- DATA-045：`core/core-backend/src/main/java/io/dataease/datasource/provider/ExcelFileGuard.java:66-93`
- DATA-046：`core/core-backend/src/main/java/io/dataease/datasource/server/DatasourceServer.java:1194-1211`
- DATA-050：`core/core-backend/src/main/java/io/dataease/datasource/provider/ExcelUtils.java:437-468`
- DATA-051：`core/core-backend/src/main/java/io/dataease/datasource/provider/ExcelUtils.java:470-496`
- DATA-053：`sdk/common/src/main/java/io/dataease/utils/HttpClientUtil.java:394-432`
- DATA-054：`sdk/common/src/main/java/io/dataease/utils/RemoteTransfer.java:30-105`
- DATA-057：`sdk/common/src/main/java/io/dataease/utils/CacheUtils.java:28-88`
- DATA-058：`core/core-backend/src/main/resources/ehcache/ehcache.xml:13-21`；`core/core-backend/src/main/resources/ehcache/ehcache.xml:147-156`；`sdk/common/src/main/java/io/dataease/cache/impl/DefaultCacheImpl.java:30-43`
- DATA-059：`core/core-backend/src/main/java/io/dataease/dataset/manage/DatasetCacheManage.java:24-95`
- DATA-061：`core/core-backend/src/main/java/io/dataease/datasource/server/DatasourceServer.java:1213-1224`

## 交接

Builder 仅修正候选措辞/引用；独立 Validator 再查以上差异。当前报告是 data 候选的局部独立语义审阅，未绑定最终 KB、Dashboard、完整最终 diff 或 post-closeout，因此不能充当全 Goal 最终 pass。
