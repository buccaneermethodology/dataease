# Chart 候选独立静态语义复核 v1

- reviewed_at: 2026-10-14T02:32:05.786398+00:00
- snapshot_id: SP001-chart-candidate-29144373ba0a
- as_of_state: 候选包静态提取阶段，尚非正式KB/全Goal收尾。
- candidate_sha256: 29144373ba0a94868a31b2182061f3b7eb0abb87d561c76b64fe9b6b48891536
- reviewer: access_extract（未编写chart候选；本轮不修改任何候选）
- verdict: REQUEST_CHANGES（需修正两项事实关系/证据范围后复核；非运行阻断）

## 范围与取证

已读原始意图v1/v2、Goal、contract-v1、lane card/prompt、chart候选及gaps。目标是源码相符的初稿知识，门槛为静态核实；不要求构建、数据库或浏览器运行。卡摘要验证通过。本报告仅覆盖chart领域独立复核，不替代全KB最终状态绑定。

候选分母47事实、70关系、34来源文件、5能力（3核心＋2导航）。亲读关键样本33/47事实，对应21/34来源文件；CHART-007/008/009另读部分过滤/钻取分支作为主链核对，不计入33条完整关键样本。33条含CHART-040引用范围不足这一反例，不能把“已读”计为“已通过”。查看全部70关系，并针对已读样本核对适用范围，发现两条跨入口错链。未声称全47事实逐行穷尽复核。

关键样本：CHART-001、CHART-003、CHART-004、CHART-006、CHART-010、CHART-011、CHART-012、CHART-013、CHART-014、CHART-015、CHART-018、CHART-025、CHART-026、CHART-027、CHART-028、CHART-029、CHART-030、CHART-031、CHART-032、CHART-033、CHART-034、CHART-035、CHART-036、CHART-037、CHART-038、CHART-039、CHART-040、CHART-041、CHART-042、CHART-044、CHART-045、CHART-046、CHART-047。

## 必须修正

### C1：仪表板与大屏入口关系交叉误挂

- 影响：F05.contract.trigger含CHART-027及CHART-R030（F05→CHART-027）；F06.contract.trigger含CHART-026及CHART-R048（F06→CHART-026）。
- 独立证据：`core/core-frontend/src/views/dashboard/index.vue:206-225`把busiFlag设为dashboard/dashboard-copy；`core/core-frontend/src/views/data-visualization/index.vue:316-334`设为dataV/dataV-copy，223-237是大屏组件拖入。
- 判断：CHART-026、027事实本身正确，但共享canvasUtils/后端不能推出两个专属前端入口互为触发。现有CAPABILITY_REALIZED_BY关系会错误影响导航和变更传播。
- 修正：F05移除027入口引用与R030，F06移除026入口引用与R048；保留各自入口及共享029以后事实。无需改产品，也不删除F05/F06能力分母。

### C2：CHART-040复制联动/外部参数的证据范围不完整

- 影响：CHART-040以及F05/F06的状态/数据契约，关系CHART-R043、R062。
- 原引用：CoreVisualizationManage.java:647-682、785-822。785-822可证主表/图表复制、调用removeCoreLinkAndOuterParams与跳转目标复制，尚不包含联动及外部参数的实际复制语句。
- 独立补读：同文件825-858复制跳转，861-896复制联动及字段，900-918复制外部参数目标，922-937复制外部参数详情。事实描述与实现方向一致，但当前范围无法支持其全部子断言。
- 修正：由Builder补齐相应最小证据区间（或拆分事实），保留内容而不降为Gap；同步read-log及依赖关系。此为可访问核心持久化链，不能以运行未验证替代补证。

## 逐能力结论

| 能力 | 实际核对 | 结论 |
| --- | --- | --- |
| F04 制作图表并取数 | 前端getData、模板/普通分支、当前身份与DATASET READ、行列权限、过滤/钻取抽样、SQLMeta→默认Handler→Provider→结果、G2Plot错误/渲染、Mix测试资产 | 关键主链未发现阻断性事实错误。未命中Handler并非所有未知图表拒绝、导出权限不等于取数权限的边界表达合理；不外推所有Handler。 |
| F05 组合仪表板 | dashboard编辑入口、共享保存冲突提示、SDK权限声明、草稿/主表写入、发布/恢复、消费与撤销重做 | 主链实际存在，需修C1/C2；contentId检查不冒充原子并发控制的表述正确。 |
| F06 制作大屏 | dataV入口/拖入、共享保存发布、core预览、快照刷新 | 主链实际存在，需修C1/C2；不可用仪表板专属入口补其触发。 |
| F07 模板导航 | decompression三来源与市场空值异常、getChartDataInfo缺失/解析异常 | 样本符合导航深度；解析异常仅日志后返回原view，未被误写为成功数据加载。 |
| F18 地图/AI导航 | map.ts的geo前缀与前三位路径、aiComponent.ts及AiComponentApi | 样本准确，未从目标URL声明推断模型推理能力。 |

## 证据边界与非阻断项

- JUnit MixHandlerTest只作为已有资产；已读12-77的断言和三类Handler循环，未执行，不证明真实SQL或UI。完整保存发布端到端测试未找到/未读的边界不构成本Goal运行门槛。
- F04权限提供方、具体Provider差异需由对应领域整合，不能将chart调用证据提升成全部身份/数据库正确。当前chart限制保留了这一点。
- CHART-036的saveAndFlush行为需与基础领域JPA非空合并事实关联；当前措辞描述所传字段，不应解读为空字段必然清空。
- 未增加新产品测试、未改产品、未访问XPack、未安装或运行应用。未来并发、回滚、渲染兼容是运行验证后续项，不因其未执行而拒绝静态主链。

## 亲读来源索引

以下为33个关键样本的候选引用范围；CHART-040另补读825-937如C2所述。部分广范围阅读由多段nl/sed完成，未把rg命中作为语义证据。

- CHART-001：`core/core-frontend/src/api/chart.ts:79-115`（getData）
- CHART-003：`core/core-backend/src/main/java/io/dataease/chart/server/ChartDataServer.java:86-104`（getData）
- CHART-004：`core/core-backend/src/main/java/io/dataease/chart/manage/ChartDataManage.java:157-191`（calcData）
- CHART-006：`core/core-backend/src/main/java/io/dataease/chart/manage/ChartDataManage.java:194-222`（calcData）
- CHART-010：`core/core-backend/src/main/java/io/dataease/chart/manage/ChartDataManage.java:431-454`（calcData/过滤与空轴）
- CHART-011：`core/core-backend/src/main/java/io/dataease/chart/manage/ChartDataManage.java:455-479`（calcData/Provider选择）
- CHART-012：`core/core-backend/src/main/java/io/dataease/chart/manage/ChartDataManage.java:481-504`（calcData/SQLMeta）
- CHART-013：`core/core-backend/src/main/java/io/dataease/chart/charts/impl/DefaultChartHandler.java:81-100`（formatAxis/customFilter）
- CHART-014：`core/core-backend/src/main/java/io/dataease/chart/charts/impl/DefaultChartHandler.java:102-160`（fillDatasourceRequest/calcChartResult）
- CHART-015：`core/core-backend/src/main/java/io/dataease/chart/charts/impl/DefaultChartHandler.java:164-204`（buildChart）
- CHART-018：`core/core-frontend/src/views/chart/components/views/components/ChartComponentG2Plot.vue:539-601`（calcData）
- CHART-025：`core/core-backend/src/test/java/io/dataease/chart/charts/impl/mix/MixHandlerTest.java:12-77`（MixHandlerTest）
- CHART-026：`core/core-frontend/src/views/dashboard/index.vue:206-225`（initLocalCanvasData）
- CHART-027：`core/core-frontend/src/views/data-visualization/index.vue:316-334`（initLocalCanvasData）
- CHART-027：`core/core-frontend/src/views/data-visualization/index.vue:223-237`（handleDrop）
- CHART-028：`core/core-frontend/src/views/dashboard/DashboardPreviewShow.vue:100-113`（loadCanvasData）
- CHART-028：`core/core-frontend/src/views/data-visualization/PreviewShow.vue:78-94`（loadCanvasData）
- CHART-029：`core/core-frontend/src/utils/canvasUtils.ts:596-680`（initCanvasDataPrepare/initCanvasData）
- CHART-030：`core/core-frontend/src/utils/canvasUtils.ts:843-908`（canvasSaveWithParams）
- CHART-031：`core/core-frontend/src/utils/canvasUtils.ts:811-837`（保存前检查）
- CHART-031：`core/core-backend/src/main/java/io/dataease/visualization/server/DataVisualizationServer.java:629-687`（checkCanvasChange/updateCanvas）
- CHART-032：`sdk/api/api-base/src/main/java/io/dataease/api/visualization/DataVisualizationApi.java:40-88`（DataVisualizationApi）
- CHART-033：`core/core-backend/src/main/java/io/dataease/visualization/server/DataVisualizationServer.java:497-516`（saveCanvas）
- CHART-033：`core/core-backend/src/main/java/io/dataease/visualization/server/DataVisualizationServer.java:605-607`（saveCanvas）
- CHART-034：`core/core-backend/src/main/java/io/dataease/visualization/manage/CoreVisualizationManage.java:236-262`（innerSave/preInnerSave）
- CHART-035：`core/core-backend/src/main/java/io/dataease/visualization/server/DataVisualizationServer.java:648-687`（updateCanvas）
- CHART-036：`core/core-backend/src/main/java/io/dataease/visualization/manage/CoreVisualizationManage.java:266-290`（innerEdit）
- CHART-037：`core/core-backend/src/main/java/io/dataease/chart/manage/ChartDataManage.java:924-940`（saveChartViewFromVisualization）
- CHART-037：`core/core-backend/src/main/java/io/dataease/chart/manage/ChartViewManege.java:93-107`（save）
- CHART-038：`core/core-backend/src/main/java/io/dataease/visualization/server/DataVisualizationServer.java:180-243`（findById）
- CHART-039：`core/core-backend/src/main/java/io/dataease/visualization/server/DataVisualizationServer.java:690-722`（updatePublishStatus/recoverToPublished）
- CHART-039：`core/core-backend/src/main/java/io/dataease/visualization/manage/CoreVisualizationManage.java:1034-1052`（findDvInfo）
- CHART-040：`core/core-backend/src/main/java/io/dataease/visualization/manage/CoreVisualizationManage.java:647-682`（dvSnapshotRecover）
- CHART-040：`core/core-backend/src/main/java/io/dataease/visualization/manage/CoreVisualizationManage.java:785-822`（dvRestore）
- CHART-041：`core/core-frontend/src/store/modules/data-visualization/snapshot.ts:87-135`（recordSnapshotCache/undo/redo/snapshotPublish）
- CHART-042：`core/core-frontend/src/store/modules/data-visualization/snapshot.ts:159-223`（snapshotPublish/recordSnapshot）
- CHART-042：`core/core-frontend/src/views/chart/components/views/index.vue:864-883`（snapshotChangeToView监听）
- CHART-044：`core/core-backend/src/main/java/io/dataease/visualization/server/DataVisualizationServer.java:889-940`（decompression）
- CHART-045：`core/core-backend/src/main/java/io/dataease/visualization/manage/VisualizationTemplateExtendDataManage.java:26-41`（getChartDataInfo）
- CHART-046：`core/core-frontend/src/api/map.ts:4-56`（getGeoJson/地图请求封装）
- CHART-047：`core/core-frontend/src/api/aiComponent.ts:1-3`（findBaseParams）
- CHART-047：`sdk/api/api-base/src/main/java/io/dataease/api/ai/AiComponentApi.java:11-14`（AiComponentApi）

## 结论

当前chart候选不能直接晋升为无问题的独立静态核实包；修复C1/C2后可进行定向delta复核。未要求新增范围或运行验证，不允许用Gap关闭这两项可修正问题。本报告不代表最终KB、Dashboard或Goal完成。
