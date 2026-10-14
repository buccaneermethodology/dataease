# 源码定位与变更影响入口

下表仅列已形成事实证据的源码，不是全仓已读清单。代码变更后使用 impact 查找保守闭包。

| 源文件 | 直接支持的事实 |
|---|---|
| [.github/workflows/desktop_build.yml](../../.github/workflows/desktop_build.yml) | BASE-039 |
| [Dockerfile](../../Dockerfile) | BASE-014 |
| [LICENSE](../../LICENSE) | BASE-015 |
| [core/core-backend/pom.xml](../../core/core-backend/pom.xml) | ACCESS-029, BASE-011, BASE-012, BASE-013 |
| [core/core-backend/src/main/java/io/dataease/CoreApplication.java](../../core/core-backend/src/main/java/io/dataease/CoreApplication.java) | BASE-005 |
| [core/core-backend/src/main/java/io/dataease/chart/charts/ChartHandlerManager.java](../../core/core-backend/src/main/java/io/dataease/chart/charts/ChartHandlerManager.java) | CHART-005 |
| [core/core-backend/src/main/java/io/dataease/chart/charts/impl/DefaultChartHandler.java](../../core/core-backend/src/main/java/io/dataease/chart/charts/impl/DefaultChartHandler.java) | CHART-013, CHART-014, CHART-015 |
| [core/core-backend/src/main/java/io/dataease/chart/charts/impl/ExtQuotaChartHandler.java](../../core/core-backend/src/main/java/io/dataease/chart/charts/impl/ExtQuotaChartHandler.java) | CHART-023 |
| [core/core-backend/src/main/java/io/dataease/chart/charts/impl/GroupChartHandler.java](../../core/core-backend/src/main/java/io/dataease/chart/charts/impl/GroupChartHandler.java) | CHART-023 |
| [core/core-backend/src/main/java/io/dataease/chart/charts/impl/YoyChartHandler.java](../../core/core-backend/src/main/java/io/dataease/chart/charts/impl/YoyChartHandler.java) | CHART-024 |
| [core/core-backend/src/main/java/io/dataease/chart/charts/impl/mix/MixHandler.java](../../core/core-backend/src/main/java/io/dataease/chart/charts/impl/mix/MixHandler.java) | CHART-021 |
| [core/core-backend/src/main/java/io/dataease/chart/charts/impl/pie/PieHandler.java](../../core/core-backend/src/main/java/io/dataease/chart/charts/impl/pie/PieHandler.java) | CHART-019 |
| [core/core-backend/src/main/java/io/dataease/chart/charts/impl/table/TableInfoHandler.java](../../core/core-backend/src/main/java/io/dataease/chart/charts/impl/table/TableInfoHandler.java) | CHART-020 |
| [core/core-backend/src/main/java/io/dataease/chart/charts/impl/table/TablePivotHandler.java](../../core/core-backend/src/main/java/io/dataease/chart/charts/impl/table/TablePivotHandler.java) | CHART-022 |
| [core/core-backend/src/main/java/io/dataease/chart/manage/ChartDataManage.java](../../core/core-backend/src/main/java/io/dataease/chart/manage/ChartDataManage.java) | CHART-004, CHART-006, CHART-007, CHART-008, CHART-009, CHART-010, CHART-011, CHART-012, CHART-037 |
| [core/core-backend/src/main/java/io/dataease/chart/manage/ChartViewManege.java](../../core/core-backend/src/main/java/io/dataease/chart/manage/ChartViewManege.java) | CHART-037 |
| [core/core-backend/src/main/java/io/dataease/chart/server/ChartDataServer.java](../../core/core-backend/src/main/java/io/dataease/chart/server/ChartDataServer.java) | ACCESS-017, CHART-003 |
| [core/core-backend/src/main/java/io/dataease/chart/utils/ChartDataBuild.java](../../core/core-backend/src/main/java/io/dataease/chart/utils/ChartDataBuild.java) | ACCESS-041 |
| [core/core-backend/src/main/java/io/dataease/config/DeMvcConfig.java](../../core/core-backend/src/main/java/io/dataease/config/DeMvcConfig.java) | ACCESS-043, BASE-049 |
| [core/core-backend/src/main/java/io/dataease/config/JpaUpdateNonNullAspect.java](../../core/core-backend/src/main/java/io/dataease/config/JpaUpdateNonNullAspect.java) | DATA-039 |
| [core/core-backend/src/main/java/io/dataease/config/StaticResourceSecurityInterceptor.java](../../core/core-backend/src/main/java/io/dataease/config/StaticResourceSecurityInterceptor.java) | BASE-050 |
| [core/core-backend/src/main/java/io/dataease/dataset/manage/DatasetCacheManage.java](../../core/core-backend/src/main/java/io/dataease/dataset/manage/DatasetCacheManage.java) | DATA-041, DATA-059 |
| [core/core-backend/src/main/java/io/dataease/dataset/manage/DatasetDataManage.java](../../core/core-backend/src/main/java/io/dataease/dataset/manage/DatasetDataManage.java) | ACCESS-041, DATA-032, DATA-033, DATA-034 |
| [core/core-backend/src/main/java/io/dataease/dataset/manage/DatasetGroupManage.java](../../core/core-backend/src/main/java/io/dataease/dataset/manage/DatasetGroupManage.java) | DATA-028, DATA-029, DATA-031 |
| [core/core-backend/src/main/java/io/dataease/dataset/manage/DatasetTableManage.java](../../core/core-backend/src/main/java/io/dataease/dataset/manage/DatasetTableManage.java) | DATA-030 |
| [core/core-backend/src/main/java/io/dataease/dataset/manage/PermissionManage.java](../../core/core-backend/src/main/java/io/dataease/dataset/manage/PermissionManage.java) | ACCESS-023, ACCESS-024, ACCESS-039, ACCESS-040 |
| [core/core-backend/src/main/java/io/dataease/dataset/server/DatasetDataServer.java](../../core/core-backend/src/main/java/io/dataease/dataset/server/DatasetDataServer.java) | DATA-031, DATA-035 |
| [core/core-backend/src/main/java/io/dataease/dataset/server/DatasetTreeServer.java](../../core/core-backend/src/main/java/io/dataease/dataset/server/DatasetTreeServer.java) | DATA-027 |
| [core/core-backend/src/main/java/io/dataease/datasource/dao/auto/repository/CoreDatasourceRepository.java](../../core/core-backend/src/main/java/io/dataease/datasource/dao/auto/repository/CoreDatasourceRepository.java) | DATA-012 |
| [core/core-backend/src/main/java/io/dataease/datasource/manage/DataSourceManage.java](../../core/core-backend/src/main/java/io/dataease/datasource/manage/DataSourceManage.java) | DATA-004 |
| [core/core-backend/src/main/java/io/dataease/datasource/manage/DatasourceSyncManage.java](../../core/core-backend/src/main/java/io/dataease/datasource/manage/DatasourceSyncManage.java) | DATA-018, DATA-019, DATA-020, DATA-021 |
| [core/core-backend/src/main/java/io/dataease/datasource/provider/ApiUtils.java](../../core/core-backend/src/main/java/io/dataease/datasource/provider/ApiUtils.java) | DATA-022, DATA-023, DATA-024, DATA-052 |
| [core/core-backend/src/main/java/io/dataease/datasource/provider/CalciteProvider.java](../../core/core-backend/src/main/java/io/dataease/datasource/provider/CalciteProvider.java) | DATA-007, DATA-036, DATA-037, DATA-062 |
| [core/core-backend/src/main/java/io/dataease/datasource/provider/DmEngineProvider.java](../../core/core-backend/src/main/java/io/dataease/datasource/provider/DmEngineProvider.java) | DATA-069 |
| [core/core-backend/src/main/java/io/dataease/datasource/provider/EsProvider.java](../../core/core-backend/src/main/java/io/dataease/datasource/provider/EsProvider.java) | DATA-063 |
| [core/core-backend/src/main/java/io/dataease/datasource/provider/ExcelFileGuard.java](../../core/core-backend/src/main/java/io/dataease/datasource/provider/ExcelFileGuard.java) | DATA-044, DATA-045 |
| [core/core-backend/src/main/java/io/dataease/datasource/provider/ExcelUtils.java](../../core/core-backend/src/main/java/io/dataease/datasource/provider/ExcelUtils.java) | DATA-014, DATA-047, DATA-048, DATA-049, DATA-050, DATA-051 |
| [core/core-backend/src/main/java/io/dataease/datasource/provider/H2EngineProvider.java](../../core/core-backend/src/main/java/io/dataease/datasource/provider/H2EngineProvider.java) | DATA-067 |
| [core/core-backend/src/main/java/io/dataease/datasource/provider/KingbaseEngineProvider.java](../../core/core-backend/src/main/java/io/dataease/datasource/provider/KingbaseEngineProvider.java) | DATA-071 |
| [core/core-backend/src/main/java/io/dataease/datasource/provider/MysqlEngineProvider.java](../../core/core-backend/src/main/java/io/dataease/datasource/provider/MysqlEngineProvider.java) | DATA-065 |
| [core/core-backend/src/main/java/io/dataease/datasource/provider/OracleEngineProvider.java](../../core/core-backend/src/main/java/io/dataease/datasource/provider/OracleEngineProvider.java) | DATA-068 |
| [core/core-backend/src/main/java/io/dataease/datasource/provider/PgEngineProvider.java](../../core/core-backend/src/main/java/io/dataease/datasource/provider/PgEngineProvider.java) | DATA-066 |
| [core/core-backend/src/main/java/io/dataease/datasource/provider/ProviderUtil.java](../../core/core-backend/src/main/java/io/dataease/datasource/provider/ProviderUtil.java) | DATA-064 |
| [core/core-backend/src/main/java/io/dataease/datasource/provider/SqlServerEngineProvider.java](../../core/core-backend/src/main/java/io/dataease/datasource/provider/SqlServerEngineProvider.java) | DATA-070 |
| [core/core-backend/src/main/java/io/dataease/datasource/provider/StarRocksEngineProvider.java](../../core/core-backend/src/main/java/io/dataease/datasource/provider/StarRocksEngineProvider.java) | DATA-071 |
| [core/core-backend/src/main/java/io/dataease/datasource/server/DatasourceServer.java](../../core/core-backend/src/main/java/io/dataease/datasource/server/DatasourceServer.java) | DATA-003, DATA-005, DATA-008, DATA-009, DATA-010, DATA-013, DATA-015, DATA-016, DATA-017, DATA-046, DATA-061 |
| [core/core-backend/src/main/java/io/dataease/engine/trans/Quota2SQLObj.java](../../core/core-backend/src/main/java/io/dataease/engine/trans/Quota2SQLObj.java) | CHART-016 |
| [core/core-backend/src/main/java/io/dataease/exportCenter/manage/ExportCenterDownLoadManage.java](../../core/core-backend/src/main/java/io/dataease/exportCenter/manage/ExportCenterDownLoadManage.java) | ACCESS-019, ACCESS-038, ACCESS-050, ACCESS-051, ACCESS-052, ACCESS-053 |
| [core/core-backend/src/main/java/io/dataease/exportCenter/manage/ExportCenterLimitManage.java](../../core/core-backend/src/main/java/io/dataease/exportCenter/manage/ExportCenterLimitManage.java) | ACCESS-053 |
| [core/core-backend/src/main/java/io/dataease/exportCenter/manage/ExportCenterManage.java](../../core/core-backend/src/main/java/io/dataease/exportCenter/manage/ExportCenterManage.java) | ACCESS-018, ACCESS-020, ACCESS-021, ACCESS-022, ACCESS-037, ACCESS-054, ACCESS-055 |
| [core/core-backend/src/main/java/io/dataease/exportCenter/manage/ExportTaskFileTarget.java](../../core/core-backend/src/main/java/io/dataease/exportCenter/manage/ExportTaskFileTarget.java) | ACCESS-038 |
| [core/core-backend/src/main/java/io/dataease/exportCenter/util/ExportCenterUtils.java](../../core/core-backend/src/main/java/io/dataease/exportCenter/util/ExportCenterUtils.java) | ACCESS-053 |
| [core/core-backend/src/main/java/io/dataease/font/server/FontServer.java](../../core/core-backend/src/main/java/io/dataease/font/server/FontServer.java) | BASE-032 |
| [core/core-backend/src/main/java/io/dataease/listener/InitSqlListener.java](../../core/core-backend/src/main/java/io/dataease/listener/InitSqlListener.java) | DATA-040 |
| [core/core-backend/src/main/java/io/dataease/menu/server/MenuServer.java](../../core/core-backend/src/main/java/io/dataease/menu/server/MenuServer.java) | BASE-016 |
| [core/core-backend/src/main/java/io/dataease/msgCenter/MsgCenterServer.java](../../core/core-backend/src/main/java/io/dataease/msgCenter/MsgCenterServer.java) | BASE-035 |
| [core/core-backend/src/main/java/io/dataease/operation/manage/CoreOptRecentManage.java](../../core/core-backend/src/main/java/io/dataease/operation/manage/CoreOptRecentManage.java) | BASE-040 |
| [core/core-backend/src/main/java/io/dataease/share/interceptor/DeLinkAop.java](../../core/core-backend/src/main/java/io/dataease/share/interceptor/DeLinkAop.java) | ACCESS-010 |
| [core/core-backend/src/main/java/io/dataease/share/interceptor/LinkInterceptor.java](../../core/core-backend/src/main/java/io/dataease/share/interceptor/LinkInterceptor.java) | ACCESS-009 |
| [core/core-backend/src/main/java/io/dataease/share/interceptor/ShareQueryScopeAop.java](../../core/core-backend/src/main/java/io/dataease/share/interceptor/ShareQueryScopeAop.java) | ACCESS-042 |
| [core/core-backend/src/main/java/io/dataease/share/manage/LinkTokenValidationManage.java](../../core/core-backend/src/main/java/io/dataease/share/manage/LinkTokenValidationManage.java) | ACCESS-008 |
| [core/core-backend/src/main/java/io/dataease/share/manage/ShareAuthorizationManage.java](../../core/core-backend/src/main/java/io/dataease/share/manage/ShareAuthorizationManage.java) | ACCESS-001, ACCESS-002 |
| [core/core-backend/src/main/java/io/dataease/share/manage/ShareTicketManage.java](../../core/core-backend/src/main/java/io/dataease/share/manage/ShareTicketManage.java) | ACCESS-003, ACCESS-004 |
| [core/core-backend/src/main/java/io/dataease/share/manage/ShareVisitorPermissionManage.java](../../core/core-backend/src/main/java/io/dataease/share/manage/ShareVisitorPermissionManage.java) | ACCESS-011 |
| [core/core-backend/src/main/java/io/dataease/share/manage/XpackShareManage.java](../../core/core-backend/src/main/java/io/dataease/share/manage/XpackShareManage.java) | ACCESS-005, ACCESS-006, ACCESS-032, ACCESS-033, ACCESS-056 |
| [core/core-backend/src/main/java/io/dataease/share/util/LinkTokenUtil.java](../../core/core-backend/src/main/java/io/dataease/share/util/LinkTokenUtil.java) | ACCESS-007 |
| [core/core-backend/src/main/java/io/dataease/substitute/permissions/login/SubstituleLoginServer.java](../../core/core-backend/src/main/java/io/dataease/substitute/permissions/login/SubstituleLoginServer.java) | ACCESS-026 |
| [core/core-backend/src/main/java/io/dataease/system/server/SysParameterServer.java](../../core/core-backend/src/main/java/io/dataease/system/server/SysParameterServer.java) | BASE-041 |
| [core/core-backend/src/main/java/io/dataease/visualization/manage/CoreVisualizationExportManage.java](../../core/core-backend/src/main/java/io/dataease/visualization/manage/CoreVisualizationExportManage.java) | ACCESS-046 |
| [core/core-backend/src/main/java/io/dataease/visualization/manage/CoreVisualizationManage.java](../../core/core-backend/src/main/java/io/dataease/visualization/manage/CoreVisualizationManage.java) | CHART-034, CHART-036, CHART-039, CHART-040 |
| [core/core-backend/src/main/java/io/dataease/visualization/manage/VisualizationTemplateExtendDataManage.java](../../core/core-backend/src/main/java/io/dataease/visualization/manage/VisualizationTemplateExtendDataManage.java) | CHART-045 |
| [core/core-backend/src/main/java/io/dataease/visualization/server/DataVisualizationServer.java](../../core/core-backend/src/main/java/io/dataease/visualization/server/DataVisualizationServer.java) | ACCESS-043, CHART-031, CHART-033, CHART-035, CHART-038, CHART-039, CHART-044 |
| [core/core-backend/src/main/java/io/dataease/visualization/server/StaticResourceContentGuard.java](../../core/core-backend/src/main/java/io/dataease/visualization/server/StaticResourceContentGuard.java) | BASE-050 |
| [core/core-backend/src/main/java/io/dataease/visualization/server/StaticResourceServer.java](../../core/core-backend/src/main/java/io/dataease/visualization/server/StaticResourceServer.java) | BASE-033, BASE-034 |
| [core/core-backend/src/main/resources/ehcache/ehcache.xml](../../core/core-backend/src/main/resources/ehcache/ehcache.xml) | DATA-058 |
| [core/core-backend/src/test/java/io/dataease/chart/charts/impl/mix/MixHandlerTest.java](../../core/core-backend/src/test/java/io/dataease/chart/charts/impl/mix/MixHandlerTest.java) | CHART-025 |
| [core/core-backend/src/test/java/io/dataease/datasource/provider/SmbFileDownloaderRegression.java](../../core/core-backend/src/test/java/io/dataease/datasource/provider/SmbFileDownloaderRegression.java) | DATA-074 |
| [core/core-frontend/config/dev.ts](../../core/core-frontend/config/dev.ts) | BASE-008 |
| [core/core-frontend/config/lib.ts](../../core/core-frontend/config/lib.ts) | BASE-007 |
| [core/core-frontend/config/pagesConfig.ts](../../core/core-frontend/config/pagesConfig.ts) | BASE-006 |
| [core/core-frontend/package.json](../../core/core-frontend/package.json) | BASE-009 |
| [core/core-frontend/pom.xml](../../core/core-frontend/pom.xml) | BASE-010 |
| [core/core-frontend/src/api/aiComponent.ts](../../core/core-frontend/src/api/aiComponent.ts) | CHART-047 |
| [core/core-frontend/src/api/chart.ts](../../core/core-frontend/src/api/chart.ts) | ACCESS-030, CHART-001 |
| [core/core-frontend/src/api/dataset.ts](../../core/core-frontend/src/api/dataset.ts) | DATA-025 |
| [core/core-frontend/src/api/datasource.ts](../../core/core-frontend/src/api/datasource.ts) | DATA-001 |
| [core/core-frontend/src/api/map.ts](../../core/core-frontend/src/api/map.ts) | CHART-046 |
| [core/core-frontend/src/api/plugin.ts](../../core/core-frontend/src/api/plugin.ts) | BASE-029 |
| [core/core-frontend/src/api/sync/syncTask.ts](../../core/core-frontend/src/api/sync/syncTask.ts) | BASE-024 |
| [core/core-frontend/src/api/template.ts](../../core/core-frontend/src/api/template.ts) | CHART-043 |
| [core/core-frontend/src/api/user.ts](../../core/core-frontend/src/api/user.ts) | ACCESS-027 |
| [core/core-frontend/src/components/data-visualization/canvas/LinkOptBar.vue](../../core/core-frontend/src/components/data-visualization/canvas/LinkOptBar.vue) | ACCESS-034 |
| [core/core-frontend/src/components/plugin/src/PluginComponent.vue](../../core/core-frontend/src/components/plugin/src/PluginComponent.vue) | BASE-027, BASE-028 |
| [core/core-frontend/src/config/axios/service.ts](../../core/core-frontend/src/config/axios/service.ts) | ACCESS-012 |
| [core/core-frontend/src/permission.ts](../../core/core-frontend/src/permission.ts) | ACCESS-028 |
| [core/core-frontend/src/router/establish.ts](../../core/core-frontend/src/router/establish.ts) | BASE-017 |
| [core/core-frontend/src/store/modules/data-visualization/snapshot.ts](../../core/core-frontend/src/store/modules/data-visualization/snapshot.ts) | CHART-041, CHART-042 |
| [core/core-frontend/src/store/modules/embedded.ts](../../core/core-frontend/src/store/modules/embedded.ts) | ACCESS-014 |
| [core/core-frontend/src/store/modules/permission.ts](../../core/core-frontend/src/store/modules/permission.ts) | BASE-018 |
| [core/core-frontend/src/utils/canvasUtils.ts](../../core/core-frontend/src/utils/canvasUtils.ts) | CHART-029, CHART-030, CHART-031 |
| [core/core-frontend/src/utils/encryption.ts](../../core/core-frontend/src/utils/encryption.ts) | ACCESS-048 |
| [core/core-frontend/src/utils/imgUtils.ts](../../core/core-frontend/src/utils/imgUtils.ts) | ACCESS-035 |
| [core/core-frontend/src/utils/resourceImageCache.ts](../../core/core-frontend/src/utils/resourceImageCache.ts) | ACCESS-036 |
| [core/core-frontend/src/utils/utils.ts](../../core/core-frontend/src/utils/utils.ts) | ACCESS-034 |
| [core/core-frontend/src/views/chart/components/views/components/ChartComponentG2Plot.vue](../../core/core-frontend/src/views/chart/components/views/components/ChartComponentG2Plot.vue) | CHART-018 |
| [core/core-frontend/src/views/chart/components/views/index.vue](../../core/core-frontend/src/views/chart/components/views/index.vue) | CHART-042 |
| [core/core-frontend/src/views/component/embedded-iframe/EmbeddedIntractive.ts](../../core/core-frontend/src/views/component/embedded-iframe/EmbeddedIntractive.ts) | ACCESS-016 |
| [core/core-frontend/src/views/component/embedded-iframe/Entrances.vue](../../core/core-frontend/src/views/component/embedded-iframe/Entrances.vue) | ACCESS-047, ACCESS-048, ACCESS-049 |
| [core/core-frontend/src/views/component/embedded-iframe/embedded.ts](../../core/core-frontend/src/views/component/embedded-iframe/embedded.ts) | ACCESS-015 |
| [core/core-frontend/src/views/dashboard/DashboardPreviewShow.vue](../../core/core-frontend/src/views/dashboard/DashboardPreviewShow.vue) | CHART-028 |
| [core/core-frontend/src/views/dashboard/index.vue](../../core/core-frontend/src/views/dashboard/index.vue) | CHART-026 |
| [core/core-frontend/src/views/data-visualization/PreviewCanvas.vue](../../core/core-frontend/src/views/data-visualization/PreviewCanvas.vue) | ACCESS-034 |
| [core/core-frontend/src/views/data-visualization/PreviewShow.vue](../../core/core-frontend/src/views/data-visualization/PreviewShow.vue) | ACCESS-035, CHART-028 |
| [core/core-frontend/src/views/data-visualization/index.vue](../../core/core-frontend/src/views/data-visualization/index.vue) | CHART-027 |
| [core/core-frontend/src/views/pages/menu/data/data-filling/manage/index.vue](../../core/core-frontend/src/views/pages/menu/data/data-filling/manage/index.vue) | BASE-022 |
| [core/core-frontend/src/views/pages/menu/spreadsheet/index.vue](../../core/core-frontend/src/views/pages/menu/spreadsheet/index.vue) | BASE-020 |
| [core/core-frontend/src/views/pages/menu/system/report/index.vue](../../core/core-frontend/src/views/pages/menu/system/report/index.vue) | BASE-026 |
| [core/core-frontend/src/views/sqlbot/index.vue](../../core/core-frontend/src/views/sqlbot/index.vue) | BASE-030, BASE-031 |
| [core/core-frontend/tests/pie-label-overflow/check.py](../../core/core-frontend/tests/pie-label-overflow/check.py) | BASE-038 |
| [core/pom.xml](../../core/pom.xml) | BASE-002 |
| [pom.xml](../../pom.xml) | BASE-001, BASE-004 |
| [sdk/api/api-base/src/main/java/io/dataease/api/ai/AiComponentApi.java](../../sdk/api/api-base/src/main/java/io/dataease/api/ai/AiComponentApi.java) | CHART-047 |
| [sdk/api/api-base/src/main/java/io/dataease/api/chart/ChartDataApi.java](../../sdk/api/api-base/src/main/java/io/dataease/api/chart/ChartDataApi.java) | ACCESS-030, CHART-002 |
| [sdk/api/api-base/src/main/java/io/dataease/api/dataset/DatasetDataApi.java](../../sdk/api/api-base/src/main/java/io/dataease/api/dataset/DatasetDataApi.java) | DATA-035 |
| [sdk/api/api-base/src/main/java/io/dataease/api/dataset/DatasetTreeApi.java](../../sdk/api/api-base/src/main/java/io/dataease/api/dataset/DatasetTreeApi.java) | DATA-026 |
| [sdk/api/api-base/src/main/java/io/dataease/api/ds/DatasourceApi.java](../../sdk/api/api-base/src/main/java/io/dataease/api/ds/DatasourceApi.java) | DATA-002 |
| [sdk/api/api-base/src/main/java/io/dataease/api/exportCenter/ExportCenterApi.java](../../sdk/api/api-base/src/main/java/io/dataease/api/exportCenter/ExportCenterApi.java) | ACCESS-031 |
| [sdk/api/api-base/src/main/java/io/dataease/api/report/ReportApi.java](../../sdk/api/api-base/src/main/java/io/dataease/api/report/ReportApi.java) | BASE-025 |
| [sdk/api/api-base/src/main/java/io/dataease/api/spreadsheet/SpreadsheetApi.java](../../sdk/api/api-base/src/main/java/io/dataease/api/spreadsheet/SpreadsheetApi.java) | BASE-019 |
| [sdk/api/api-base/src/main/java/io/dataease/api/template/TemplateManageApi.java](../../sdk/api/api-base/src/main/java/io/dataease/api/template/TemplateManageApi.java) | CHART-043 |
| [sdk/api/api-base/src/main/java/io/dataease/api/visualization/DataVisualizationApi.java](../../sdk/api/api-base/src/main/java/io/dataease/api/visualization/DataVisualizationApi.java) | CHART-032 |
| [sdk/api/api-base/src/main/java/io/dataease/api/xpack/dataFilling/DataFillingApi.java](../../sdk/api/api-base/src/main/java/io/dataease/api/xpack/dataFilling/DataFillingApi.java) | BASE-021 |
| [sdk/api/api-permissions/src/main/java/io/dataease/api/permissions/auth/api/InteractiveAuthApi.java](../../sdk/api/api-permissions/src/main/java/io/dataease/api/permissions/auth/api/InteractiveAuthApi.java) | ACCESS-025 |
| [sdk/api/api-permissions/src/main/java/io/dataease/api/permissions/embedded/api/EmbeddedApi.java](../../sdk/api/api-permissions/src/main/java/io/dataease/api/permissions/embedded/api/EmbeddedApi.java) | ACCESS-013 |
| [sdk/api/api-permissions/src/main/java/io/dataease/api/permissions/user/api/UserApi.java](../../sdk/api/api-permissions/src/main/java/io/dataease/api/permissions/user/api/UserApi.java) | ACCESS-027 |
| [sdk/api/api-sync/src/main/java/io/dataease/api/sync/task/api/TaskApi.java](../../sdk/api/api-sync/src/main/java/io/dataease/api/sync/task/api/TaskApi.java) | BASE-023 |
| [sdk/common/src/main/java/io/dataease/cache/impl/DefaultCacheImpl.java](../../sdk/common/src/main/java/io/dataease/cache/impl/DefaultCacheImpl.java) | DATA-042, DATA-058 |
| [sdk/common/src/main/java/io/dataease/cache/impl/RedisCacheImpl.java](../../sdk/common/src/main/java/io/dataease/cache/impl/RedisCacheImpl.java) | DATA-043 |
| [sdk/common/src/main/java/io/dataease/constant/AuthEnum.java](../../sdk/common/src/main/java/io/dataease/constant/AuthEnum.java) | BASE-046 |
| [sdk/common/src/main/java/io/dataease/constant/AuthResourceEnum.java](../../sdk/common/src/main/java/io/dataease/constant/AuthResourceEnum.java) | BASE-048 |
| [sdk/common/src/main/java/io/dataease/constant/BusiResourceEnum.java](../../sdk/common/src/main/java/io/dataease/constant/BusiResourceEnum.java) | BASE-047 |
| [sdk/common/src/main/java/io/dataease/dao/auto/entity/CoreChartView.java](../../sdk/common/src/main/java/io/dataease/dao/auto/entity/CoreChartView.java) | BASE-044 |
| [sdk/common/src/main/java/io/dataease/dao/auto/entity/CoreDatasetGroup.java](../../sdk/common/src/main/java/io/dataease/dao/auto/entity/CoreDatasetGroup.java) | BASE-043, DATA-038 |
| [sdk/common/src/main/java/io/dataease/dao/auto/entity/CoreDatasetTable.java](../../sdk/common/src/main/java/io/dataease/dao/auto/entity/CoreDatasetTable.java) | DATA-038 |
| [sdk/common/src/main/java/io/dataease/dao/auto/entity/CoreDatasetTableField.java](../../sdk/common/src/main/java/io/dataease/dao/auto/entity/CoreDatasetTableField.java) | DATA-038 |
| [sdk/common/src/main/java/io/dataease/dao/auto/entity/CoreDatasource.java](../../sdk/common/src/main/java/io/dataease/dao/auto/entity/CoreDatasource.java) | BASE-042, DATA-011 |
| [sdk/common/src/main/java/io/dataease/dao/auto/entity/DataVisualizationInfo.java](../../sdk/common/src/main/java/io/dataease/dao/auto/entity/DataVisualizationInfo.java) | BASE-045 |
| [sdk/common/src/main/java/io/dataease/utils/CacheUtils.java](../../sdk/common/src/main/java/io/dataease/utils/CacheUtils.java) | DATA-057 |
| [sdk/common/src/main/java/io/dataease/utils/FileUtils.java](../../sdk/common/src/main/java/io/dataease/utils/FileUtils.java) | ACCESS-038 |
| [sdk/common/src/main/java/io/dataease/utils/HttpClientUtil.java](../../sdk/common/src/main/java/io/dataease/utils/HttpClientUtil.java) | DATA-053, DATA-055, DATA-056 |
| [sdk/common/src/main/java/io/dataease/utils/RemoteTransfer.java](../../sdk/common/src/main/java/io/dataease/utils/RemoteTransfer.java) | DATA-054 |
| [sdk/extensions/extensions-datasource/src/main/java/io/dataease/extensions/datasource/factory/ProviderFactory.java](../../sdk/extensions/extensions-datasource/src/main/java/io/dataease/extensions/datasource/factory/ProviderFactory.java) | DATA-006 |
| [sdk/extensions/extensions-datasource/src/main/java/io/dataease/extensions/datasource/vo/DatasourceConfiguration.java](../../sdk/extensions/extensions-datasource/src/main/java/io/dataease/extensions/datasource/vo/DatasourceConfiguration.java) | DATA-060 |
| [sdk/extensions/extensions-view/src/main/java/io/dataease/extensions/view/dto/ChartViewDTO.java](../../sdk/extensions/extensions-view/src/main/java/io/dataease/extensions/view/dto/ChartViewDTO.java) | CHART-017 |
| [sdk/pom.xml](../../sdk/pom.xml) | BASE-003 |
| [tests/excel-file-access/Regression.java](../../tests/excel-file-access/Regression.java) | DATA-072 |
| [tests/remote-response/Regression.java](../../tests/remote-response/Regression.java) | DATA-073 |
| [tests/static-resource-security/Regression.java](../../tests/static-resource-security/Regression.java) | ACCESS-045, BASE-037 |
| [tests/visualization-read-security/Regression.java](../../tests/visualization-read-security/Regression.java) | ACCESS-044, BASE-036 |
