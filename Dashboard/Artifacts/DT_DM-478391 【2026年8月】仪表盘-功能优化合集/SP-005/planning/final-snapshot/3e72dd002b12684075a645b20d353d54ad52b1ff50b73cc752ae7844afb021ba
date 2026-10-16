# 技术依赖补查 A：精确时间、容量、导出与原复制入口

本轮仅读取当前源码及既有B2c产物，不启动服务、不运行产品测试、不读取运行配置值、不修改产品。任务卡canonical摘要及专用admission已验证通过；只新增本文件。以下OBSERVED指静态可见事实，历史运行证据只按B2c原边界引用；没有把当前代码重新运行。六项依赖的调查已得到具体结论，但不能由此自动关闭原始验收依赖。

## ISS-AC-01：1800秒精确边界

**源码结论（OBSERVED）**：原组件复制使用Pinia `copyData`，`copyDataInfo`只存深拷贝组件与index；`paste`没有创建时间、期限或身份键检查（A01）。原FilterTree提供编辑/确认，而不是专门共享过滤剪贴板。因此当前原组件复制机制不能提供F01的1800秒等号oracle。

**实际检索**：在 `src/store/modules/data-visualization/copy.ts`、`views/chart/components/editor/filter/`、`custom-component/v-query/` 搜索 `1800|30 * 60|expires|expire|TextEncoder|Blob|1024|1048576|1000000`；无F01专用过期判定命中。另在整个前端src搜索 `copyData = null`、copyStore清理，只有初始化等命中；不将有限关键词搜索提升为全产品无清理机制。

**可固定的工程边界**：既有实现不决定等号，1799/1801秒仍承接S00；恰1800秒应由S02实现契约显式采用一种比较，并绑定统一时钟与创建时刻、不在读取/刷新续期。此处不擅自选择 `>=` 或 `>`。owner=S02设计者；复核步骤是在批准设计中检查比较式、用可控时钟分别验证1799、1800、1801秒及多次粘贴/标签刷新，拒绝时目标和预览均不变。当前结论为“实现oracle缺失，已定位不应复用的原组件复制路径”，不是泛称待调查。

## ISS-AC-02：MB字节计量

**源码结论（OBSERVED）**：`ExportTaskFileTarget.size()`使用`Files.size`取得落盘文件字节数；`readFileSize()`按1024进位并四舍五入两位，单位文本为Kb/Mb/Gb。大于1MiB才用Mb，恰1MiB会显示1024.00Kb（A11）。`updateExportTaskSuccess`在workbook写出关闭后读取该值（A12:632–650、708–715），它是最终文件展示大小，不是写入过程中100MB熔断。F01原复制对象尚无UTF-8序列化字节计数（A01）。

**实际检索**：导出manage/server及ChartDataServer中搜索 `timeout|retry|Interrupted|cancel|104857600|100000000|1800`，仅重试、取消及数值格式单位常量等命中，未发现本导出链100MB限制；不得把格式化的100000000倍率当文件大小阈值。源码还有view/dataset行数默认100000（A14），不是500000新要求已实现。

**影响与处置**：当前“显示Mb按1024”可明确，不能据此把S00写成MiB。owner=S02/S04契约设计者：F01固定序列化对象范围、UTF-8编码与测量点；F03固定原始byte阈值及流式累计测量点；同时明确50MB提示与100MB拒绝的独立阈值。复核步骤保留999999/1000000/1000001以及1048575/1048576/1048577字节两组候选，待契约选择后执行适用组；不得以显示四舍五入字符串作判定。本轮未执行容量实验。

## ISS-AC-04：所有表型、导出格式和图片容量

**源码枚举（OBSERVED）**：当前主前端显式`category: table`包含四项，而非三项：`table-info`明细表、`table-normal`汇总表、`table-pivot`透视表、`t-heatmap`热力表（A04）。注册器同时扫描`charts/table/*.ts`和`charts/g2/**/*.ts`（A05），热力表在g2/table目录构造`t-heatmap`（A06），后端有对应`@Component TableHeatmapHandler/type=t-heatmap`（A07）。故S01表型分母必须包含热力表；XPack/插件动态扩展未知，四项是当前主仓库内建枚举，不声称覆盖不可见扩展。

**格式与调用（OBSERVED）**：现有普通/原始明细链输出`.xlsx`（A09/A10），透视格式化Excel入口另调用`exportPivotExcel`（A08:389–398）。图片入口`htmlToImage`调用`toPng(viewContainer)`，默认1280×720、下拉最大2560×1600；加载时覆盖容器宽高（A08）。该路径对当前渲染容器截图，并未在此方法逐页拉取所有行列。最大下拉尺寸是选项，不是经验证的最大安全图片容量。

**实际检索**：枚举前端table目录、g2目录及后端impl/table，并检索表型注册；在UserViewEnlarge、imgUtils、图表util及exportCenter搜索`csv|CSV|toPng|toJpeg|toBlob|32767|16384|canvas.*limit`，此链见PNG，未见CSV及显式图片容量拒绝。未搜索其他业务导出器，因此不作全产品无CSV结论。

**明确后续**：owner=S04调查/设计者；把热力表加入XLSX/CSV/图片矩阵，与普通/明细/透视分别检查表头、聚合/条件样式、隐藏列、分页及完整数据。图片上限目前UNKNOWN，必须在指定浏览器/内存/设备，以合成宽高和行列递增矩阵验证，记录像素宽高、总像素、编码后bytes、失败模式；只有实测边界及安全余量才形成上限。B2c只证明明细表5行XLSX服务端文件吻合（A19/A20），不证明浏览器下载或热力表/图片/CSV。

## ISS-AC-05：同步异步、排队、身份、重试与计时

**当前切换明确（OBSERVED）**：ChartDataServer根据分享linkToken/是否BI/嵌入模式走同步，否则addTask（A10:254–387）；这里不是按行数阈值自动切换。`ExportCenterDownLoadManage`以配置默认core=10/max=10创建ScheduledThreadPoolExecutor、keepAlive=600秒，submit任务（A12:101–113、159–164）。源码未给单用户并发上限或独立排队上限；ScheduledThreadPoolExecutor语义不能以setMaximumPoolSize推定有效并发扩容。部署配置值未读，不把默认值说成实际部署值。

**任务上下文与状态明确（OBSERVED）**：addTask生成ID、userId、PENDING、exportTime、params序列化，然后调用startPanelViewTask/startDataVViewTask（A13:253–270）。startViewTask在调用线程捕获uid/proxyOid/clientIp，在执行线程恢复，finally清除IPUtils和V3UserUtil（A12:551–650）；不是“后台身份未传”。任务入库在执行线程开始后，随后IN_PROGRESS，写workbook关闭后SUCCESS，异常FAILED。PENDING对象在排队期间是否已可查询不能假定成立，需另做排队运行见证。

**分页一致性结论（OBSERVED/INFERRED）**：table-info/table-normal及dataset导出设置pageSize（默认50000），第一次取totalPage，逐页改变goPage再次findExcelData；首个请求对象在任务启动时继续使用，数据查询在执行时发生（A12:578–630）。此循环本身未见快照事务或稳定游标，不能宣称动态源分批无重复遗漏；此为实现设计待验证风险，不是已复现缺陷。

**重试/取消实际边界（OBSERVED）**：retry仅允许本人的FAILED任务，改PENDING、进度0、重置exportTime、删除旧目录再startViewTask（A13:136–150）；该方法没有次数、间隔或可恢复错误分类。导出任务循环检索未见30分钟截止或跨重试总计。管理器deleteTask对自己`Running_Task`执行cancel，而异步submit/future登记在另一类ExportCenterDownLoadManage的独立同名Map（A12:113、649；A13:90、374–381）；本次未找到二者共享Map，因此不能把delete路径的cancel语句当作已证实能停止实际任务。

**后续owner与复核**：S04设计者负责冻结计时点（提交/入队/开始/结束/各次重试），明确30分钟是否含排队与重试总计；测试者在获准隔离环境构造池饱和、FAILED重试、执行中取消、源插入/删除、权限身份两用户。必须核对任务状态、后续SQL是否停止、临时文件清理和唯一交付；不新增用户并发业务上限。B2c已有异步SUCCESS和正确服务端文件仅校准最短成功链，不能关闭这些边界。

## ISS-AC-06：任务历史、文件和审计保留

**已确认现行源码政策（OBSERVED）**：CoreDataInit提供`basic.exportFileLiveTime=30`默认种子（A16）；CleanScheduler以`0 0 0 * * ?`每日调用exportCenterManage.cleanLog（A15）；cleanLog用配置天数算阈值，删除过期文件目录并删除任务记录（A13:314–328）。这是文件和任务记录共同清理的实现，不只是未调用辅助方法。实际运行配置可被修改，本轮未读取，不能声称用户部署一定30天。

人工deleteTask也同时删目录和任务（A13:369–385），所以“永久保留文件但人工仅删文件、任务历史保留另定”需要明确改造。导出发起wrapper存在`@DeLog(EXPORT,PANEL/SCREEN)`（A12:524–531）；ExportCenterApi与Server的delete/retry路径未见相应DeLog注解（A18及静态server读取），不代表全局AOP绝无日志。`basic.logLiveTime`是SDK公共常量（A17），主仓库检索仅常量与SystemSettingUtils键白名单；不能将其推为具体日志期限或XPack落地政策。

**后续owner与步骤**：S04设计者明确解除文件TTL时任务清理如何独立；治理/审计owner核对可用的XPack公共政策或维护者提供的日志保留约定，确需新增策略时提交具体选项。测试者获准后创建合成任务、删除及取消分别核对文件/任务/审计三种对象。当前已足够给出清理改动面，审计期限仍UNKNOWN；不自行规定永久审计或新增天数。

## ISS-AC-12：既有复制后改类型回归入口

**已定位真实入口（OBSERVED）**：ComponentEditBar复制菜单触发copyComponent→copyStore.copy()→paste(false)（A02）。copy.ts选择当前组件/多选区域，深拷贝并生成ID映射，调用dvMainStore.addCopyComponent，dashboard发addDashboardItem，记录paste快照（A01）。右键ContextMenuDetails及快捷键DeShortcutKey同样调用copyStore（本轮检索定位）。这是组件复制，不是F01的同类型过滤树专门复制。

类型切换入口为编辑器ChartType组件的`@onTypeChange`（A03:2299），onTypeChange设置render/type、切plugin标记、按目标chartView.setupDefaultOptions重建默认值；逐轴按groupType移除不兼容项、按limit截取超限项，然后更新curComponent.innerType并calcData（A03:1079–1152）。因此复制后改类型不是无损搬运所有配置，回归应观察既有合法迁移和拒绝/移除效果。

**后续owner与步骤**：S02回归设计者：合成图表A（字段、customFilter及样式已保存）→菜单复制B→只给B切目标类型→核对A不变、B新ID、目标字段限制处理、条件保留/失效提示、一次或相应既有快照撤销、保存重开。B2c只有已运行类型切换及过滤持久化的局部证据，未运行此组合；不得用它证明F01专门复制完成。源码入口调查可判“已定位”，运行oracle仍NOT_RUN。

## 证据清单与复核边界

以下摘要绑定本次实际读取工作树文件，不用HEAD替代字节。无源码写入。原先缺失的DependencyFollowup-A.md为唯一新写入；历史报告不覆盖、不改写。枚举/拖拽/10槽位/D07/D08由另一lane负责，不在本卡六项范围内重裁。

主仓库HEAD：`a11d4f1278e12c2bea0d9d4000537d7d8f868f0e`。读取日期：2026-10-15T14:02:52.417463+00:00。

|证据|路径及行范围/符号|SHA-256|
|---|---|---|
|A01|`core/core-frontend/src/store/modules/data-visualization/copy.ts`：30–35、176–233、275–280|`0586a15314c00206be53f585d598204cc481f5d6cd48e3699c681a27b8b4ce16`|
|A02|`core/core-frontend/src/components/visualization/ComponentEditBar.vue`：106–107、534–536|`470dc95228a2e6e6618e6a92d3c1056a774b892c7113c131cf79f7122b66f429`|
|A03|`core/core-frontend/src/views/chart/components/editor/index.vue`：1079–1152、2299|`0a8d78ffce297d941cd2d42c4240d0f266bac53926360d2bf83c6134a641f39d`|
|A04|`core/core-frontend/src/views/chart/components/editor/util/chart.ts`：1403–1437|`dc7e5d0cf659863e56b30fb24ac757c64e61cad8a6875e93f67bcc7aef999548`|
|A05|`core/core-frontend/src/views/chart/components/js/panel/index.ts`：21–44|`4cc0f5c25718d030c4b6b5e1607b8fa4cae0c80142c4a464087ab411c9cb7ac5`|
|A06|`core/core-frontend/src/views/chart/components/js/panel/charts/g2/table/t-heatmap.ts`：955–957|`38fbd791d675828d7cf6717c439cc34109e08a144b2bd529e4574117e7b0ff31`|
|A07|`core/core-backend/src/main/java/io/dataease/chart/charts/impl/table/TableHeatmapHandler.java`：28–34|`ba987c67b366a07b0c9ca3b7767ede81d938a52df16e4eb92b441c87d4ad0760`|
|A08|`core/core-frontend/src/components/visualization/UserViewEnlarge.vue`：248–303、379–398、428–459|`c9994fb501ee9ab5ca3619d83853c3e838bea5ff97e3eed4cbde0bcfa188c5c2`|
|A09|`core/core-frontend/src/views/chart/components/js/util.ts`：506–580|`e1face5c92466a2685bb6b27d08823c9c19159238ff9ca5406b43c21a39de797`|
|A10|`core/core-backend/src/main/java/io/dataease/chart/server/ChartDataServer.java`：118–175、254–387|`7737e2ce30c4f37324ac025b50347c2aaa8f2890ec2f5f98b41bfab19ed685fd`|
|A11|`core/core-backend/src/main/java/io/dataease/exportCenter/manage/ExportTaskFileTarget.java`：57–70|`39cbe96dff80abb86378009ce66a7f3e1182f6931f69c6018a03e1c59eac8b60`|
|A12|`core/core-backend/src/main/java/io/dataease/exportCenter/manage/ExportCenterDownLoadManage.java`：101–113、159–180、524–531、551–715|`8787f7a77140c948ff8b5f908f2d4726580725eac8972421f8f0f1219f038f33`|
|A13|`core/core-backend/src/main/java/io/dataease/exportCenter/manage/ExportCenterManage.java`：136–150、253–270、314–328、360–385|`6aedad304fe269374e78aca32b59fbd8f2910ca7cadde3d99ad7fd32c90450f8`|
|A14|`core/core-backend/src/main/java/io/dataease/exportCenter/manage/ExportCenterLimitManage.java`：10–22|`d9836d24f3f38424c376bcbd19e8dd2dd3c32498142fd7b9dc00ffc27f97cca6`|
|A15|`core/core-backend/src/main/java/io/dataease/job/schedule/CleanScheduler.java`：18–23|`bb10392e9e58f857226b8df67a38bdc009004210eb8c6b55215c9ac0d034a934`|
|A16|`core/core-backend/src/main/java/io/dataease/listener/sql/CoreDataInit.java`：191|`ea5d24489271e0465bbf3aadcdf574092fc3cd8702b7eb1b873a3735854395cf`|
|A17|`sdk/common/src/main/java/io/dataease/constant/XpackSettingConstants.java`：6|`447463479b5b917b332caf45d5eec78a363c6bf1d40677676b68318176e8fa6f`|
|A18|`sdk/api/api-base/src/main/java/io/dataease/api/exportCenter/ExportCenterApi.java`：35–56|`8e0db91b6886b23293998d3c3d799d765b15d6c882e657fb74f5b356145f3a1a`|
|A19|`Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/SP-005/B2c-Runtime-Result.md`：完整报告|`20976fe2bfd430087b8b6ea2463aa1c33b71486c80aeedc9f4bf3f13b8ed0cfc`|
|A20|`Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/SP-005/B2c-export-file-check.json`：完整结果|`5d330dc6fc0da6a114603e345b9d33edfdec69b970538d3d002f79d02b378b83`|
