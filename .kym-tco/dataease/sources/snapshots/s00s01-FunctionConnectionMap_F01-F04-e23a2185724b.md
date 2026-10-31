# F01–F04 代码连接点调查（静态候选）

本报告只记录当前工作树静态证据。25条claim及文件SHA-256见 `connections_a-claims.json`。OBSERVED仅表示源码直接可见，INFERRED为候选设计判断，UNKNOWN不能当不存在。运行全部NOT_RUN；没有启动服务、产品测试、连接浏览器/数据库、安装或修改产品代码。

主仓库HEAD：`a11d4f1278e12c2bea0d9d4000537d7d8f868f0e`；引用以各文件实际字节摘要为准。XPack未初始化，不推定私有实现。S00 authority为SP-004/Resume-r004，产品需求仍reviewed/proposed；本报告不提升Frozen、不宣布S01完成。

## F01 过滤器复制粘贴

- **Function ID**：F01
- **S00 Requirement/Decision/AC IDs**：源 `../SP-004/Resume-r004/AcceptanceMapping.json`，以下保留全部本功能映射（不表示逐项已验收）：
  - question_ids：Q004, Q005, Q006, Q007, Q008, Q009, Q010, Q011, Q012, Q013, Q014, Q015
  - decision_ids：DEC-004, DEC-005, DEC-006, DEC-007, DEC-008, DEC-009, DEC-010, DEC-011, DEC-012, DEC-013, DEC-014, DEC-015
  - rule_ids：BR-F01-001, BR-F01-002, BR-F01-003, BR-F01-004, BR-F01-005, BR-F01-006, BR-F01-007
  - ac_ids：AC-F01-ORIG-01, AC-F01-ORIG-02, AC-F01-Q004, AC-F01-Q005, AC-F01-Q006, AC-F01-Q007, AC-F01-Q008, AC-F01-Q009, AC-F01-Q010, AC-F01-Q011, AC-F01-Q012, AC-F01-Q013, AC-F01-Q014, AC-F01-Q015
  - fixture_ids：FX-COPY
  - issue_ids：ISS-AC-01, ISS-AC-02, ISS-AC-12

**UI Entry**：图表编辑器 index.vue:1594–1601 → FilterTree.init；FilterTree 弹窗以 RowAuth 编辑 logic/items。查询组件另一入口是 QueryConditionConfiguration，不能将两类配置互粘；本次未找到专门过滤复制/粘贴入口（限定检索见F01-A05）。

**State/Data Flow**：FilterTree.init按fieldId重建field对象 → changeFilter删除临时field → emit(filter-data) → 编辑器cloneDeep到view.customFilter → recordSnapshotCache。新需求跨标签共享、替换确认和失败零副作用不能从此链推定已有。

**API/Backend**：api/chart.ts:getData → /chartData/getData → ChartDataManage.calcData → chartHandler.customFilter → SQL取数。树模型为FilterTreeObj；共享复制内容并无已证API。

**Persistence**：ChartViewManege.save写snapshot；transDTO2Record把customFilter编码JSON，transRecord2DTO重新解析。整画布保存另外走canvasSaveWithParams及dataVisualization/updateCanvas；保存/发布快照有区分，静态链不证明重开成功。

**Permission Boundary**：calcData校验数据集READ、行列权限和分享图表关联；画布updateCanvas有manage契约。F01复制可见性、粘贴时重新验证身份及目标编辑权限、登出失效均UNKNOWN。XPack不可见，不以隐藏按钮替代后端鉴权。

**Existing Tests**：在 core/core-frontend/tests 与 core/core-backend/src/test 用 rg --no-ignore --files 枚举，见饼图、地图、字体、tooltip、SMB、MixHandler 等入口，未见本功能专门回归文件名；不等于全仓库无测试。全部 NOT_RUN。后续须先确认隔离环境，不能把类型检查或构建代替行为见证。 候选见证：同数据集两图表的现有过滤编辑→预览→保存重开；拒绝身份和行列限制。

**Reuse Options**：复用FilterTree/RowAuth、fieldId模型、cloneDeep及snapshot；原组件复制和复制图表字段均不是新过滤剪贴板的替代。

**Change Surface**：候选最小面：图表/查询各自入口、共享内容存储及身份清理、类型/数据集/字段整树校验、叶子计数及字节大小、一次性原子应用与正常保存链。新增存储策略需单独设计，不在调查中实现。

**Unknowns**：跨标签通信策略、用户键/登出清理、1800秒精确边界和1MB口径、50叶子计数、失效fieldId、动态规则迁移均UNKNOWN；业务边界以S00 ISS-AC-01/02为权威，不自行裁定。

**Risk**：高：跨用户或失效权限泄露，必须逐粘贴拒绝验证；高：半树应用改变预览，须全树原子检查；中：旧树/撤销/保存兼容，需失败零副作用和重开见证。

**Recommended Slice**：S02候选；先补同数据集过滤的现有运行见证，再设计共享存储/全树验证与失败路径。当前CONDITIONAL，不能进入实施或宣称已支持。

**Evidence Anchors**：
- `F01-A01` OBSERVED / static_read：`core/core-frontend/src/views/chart/components/editor/filter/FilterTree.vue:27`（changeFilter/init/dfsTree）；过滤树以logic/items回传，fieldId用于重建字段对象；保存前删除临时field并记快照。 限制：仅静态源码；运行NOT_RUN；不代表目标需求完整支持
- `F01-A02` OBSERVED / call_trace：`core/core-frontend/src/views/chart/components/editor/index.vue:1594`（changeFilterData/showFilter）；编辑器将回传树cloneDeep写入view.customFilter，打开时再cloneDeep传入FilterTree。 限制：仅静态源码；运行NOT_RUN；不代表目标需求完整支持
- `F01-A03` OBSERVED / static_read：`core/core-backend/src/main/java/io/dataease/chart/manage/ChartViewManege.java:519`（transDTO2Record/transRecord2DTO）；customFilter序列化为JSON，读取解析FilterTreeObj；save方法93–109写SnapshotCoreChartView。 限制：仅静态源码；运行NOT_RUN；不代表目标需求完整支持
- `F01-A04` OBSERVED / call_trace：`core/core-backend/src/main/java/io/dataease/chart/manage/ChartDataManage.java:157`（calcData）；取数校验数据集READ，筛列权限并取得行权限树；另442调用chartHandler.customFilter，489将行权限转换SQL。 限制：仅静态源码；运行NOT_RUN；不代表目标需求完整支持
- `F01-A05` OBSERVED / static_read：`core/core-frontend/src/views/chart/components/editor/filter/FilterTree.vue:1`（whole component）；在编辑器及store/modules检索copyFilter/pasteFilter/filterClipboard/clipboard/1800/BroadcastChannel无匹配，当前树弹窗仅取消确认。 限制：NOT_FOUND只适用上述词和目录，未证明全仓库不存在；相关原组件复制不等于过滤复制。

## F02 移动端表格全屏

- **Function ID**：F02
- **S00 Requirement/Decision/AC IDs**：源 `../SP-004/Resume-r004/AcceptanceMapping.json`，以下保留全部本功能映射（不表示逐项已验收）：
  - question_ids：Q016, Q017, Q018, Q019, Q020, Q021, Q022, Q023, Q024, Q025, Q026, Q027
  - decision_ids：DEC-016, DEC-017, DEC-018, DEC-019, DEC-020, DEC-021, DEC-022, DEC-023, DEC-024, DEC-025, DEC-026, DEC-027
  - rule_ids：BR-F02-001, BR-F02-002, BR-F02-003, BR-F02-004, BR-F02-005, BR-F02-006, BR-F02-007
  - ac_ids：AC-F02-ORIG-01, AC-F02-Q016, AC-F02-Q017, AC-F02-Q018, AC-F02-Q019, AC-F02-Q020, AC-F02-Q021, AC-F02-Q022, AC-F02-Q023, AC-F02-Q024, AC-F02-Q025, AC-F02-Q026, AC-F02-Q027
  - fixture_ids：FX-MOBILE
  - issue_ids：COV-E01, ISS-AC-03

**UI Entry**：router/mobile.ts提供/panel/mobile和分享/预览路由；Mobile.vue加载DePreview。PC ComponentEditBar放大入口要求!mobileInPc && !isMobile()，因此该按钮不能直接证明移动全屏存在。

**State/Data Flow**：Mobile设置inMobile/mobileInPc → initCanvasDataMobile → DePreview.restore；PC ComponentEditBar事件经ComponentWrapper转发 → DePreview.userViewEnlargeOpen → UserViewEnlarge.dialogInit，深拷贝view并可使用dvMainStore数据。移动返回当前为router.replace(/index)，不等同单表页状态恢复。

**API/Backend**：移动画布复用现有加载和图表getData查询链；本调查未识别全屏专用API，不要求为纯展示新建API。已有数据复用可候选；按原参数重查仍须符合S00。

**Persistence**：全屏开关、方向和返回状态应为会话状态；现有报告配置沿canvas保存链，UserViewEnlarge使用深拷贝临时view。独立单表页的持久化/导航保活机制UNKNOWN。

**Permission Boundary**：加载及取数仍应沿原身份/分享上下文；复用数据不能跨身份或越过getData行列限制。App宿主认证和WebView恢复未查证。

**Existing Tests**：在 core/core-frontend/tests 与 core/core-backend/src/test 用 rg --no-ignore --files 枚举，见饼图、地图、字体、tooltip、SMB、MixHandler 等入口，未见本功能专门回归文件名；不等于全仓库无测试。全部 NOT_RUN。后续须先确认隔离环境，不能把类型检查或构建代替行为见证。 候选见证：隔离手机与真实平板各普通/透视表，现有预览、横纵滚动、加载失败/空集及返回；指定App版本确认后才纳入通过证据。

**Reuse Options**：复用S2渲染、dvMainStore已载数据、DePreview、UserViewEnlarge临时视图思路；现有70vw PC弹窗不直接当移动独立页方案。

**Change Surface**：候选面：移动表格入口、单表路由/页面、方向适配宿主桥、返回状态保存/恢复、宽表滚动与窄表居中；ComponentWrapper已有移动懒加载，首屏计时需覆盖取数完成。

**Unknowns**：指定App及版本、自动横屏能力与降级、平板方向保持、宿主销毁后的保活、筛选/排序/页码/滚动位置恢复、有效首屏≤3秒均UNKNOWN。不以浏览器模拟截图替代真实App/平板。

**Risk**：高：返回丢筛选页码或错误误作空表；中：WebView方向/返回冲突、懒加载空框被误判首屏；中：大表横向滑动被报告翻页捕获。需完整设备×表型矩阵。

**Recommended Slice**：S03候选；先确定指定App/设备环境并运行既有移动表格链，之后设计独立页及导航状态。当前CONDITIONAL。

**Evidence Anchors**：
- `F02-A01` OBSERVED / static_read：`core/core-frontend/src/router/mobile.ts:27`（routes）；移动路由存在/panel、/panel/mobile、/de-link/:uuid及/preview。 限制：仅静态源码；运行NOT_RUN；不代表目标需求完整支持
- `F02-A02` OBSERVED / call_trace：`core/core-frontend/src/views/mobile/panel/Mobile.vue:35`（loadCanvasData/onBeforeMount/onClickLeft）；移动页面设置mobileInPc/inMobile，加载canvas后restore；返回使用router.replace(/index)保留from/cache参数。 限制：仅静态源码；运行NOT_RUN；不代表目标需求完整支持
- `F02-A03` OBSERVED / static_read：`core/core-frontend/src/components/visualization/ComponentEditBar.vue:1`（template/userViewEnlargeOpen）；含enlarge/details按钮的主工具栏v-if要求!mobileInPc且!isMobile()。 限制：仅静态源码；运行NOT_RUN；不代表目标需求完整支持
- `F02-A04` OBSERVED / static_read：`core/core-frontend/src/components/visualization/UserViewEnlarge.vue:1`（dialogInit/dataDetailsOpt）；现有70vw对话框可挂ComponentWrapper或S2明细表；311–359深拷贝view并从dvMainStore取已载明细。 限制：未证明指定App可用；关闭行为和页面返回不同，运行NOT_RUN。
- `F02-A05` OBSERVED / static_read：`core/core-frontend/src/components/data-visualization/canvas/ComponentWrapper.vue:487`（isMobileLazyLoadEnabled/onMounted）；移动端使用IntersectionObserver命中后懒加载组件，提前200px且加载后取消监听。 限制：仅静态源码；运行NOT_RUN；不代表目标需求完整支持

## F03 表格明细导出

- **Function ID**：F03
- **S00 Requirement/Decision/AC IDs**：源 `../SP-004/Resume-r004/AcceptanceMapping.json`，以下保留全部本功能映射（不表示逐项已验收）：
  - question_ids：Q028, Q029, Q030, Q031, Q032, Q033, Q034, Q035, Q036, Q037, Q038, Q039, Q040, Q041, Q042, Q043, Q044, Q045, Q046, Q047, Q048, Q049
  - decision_ids：DEC-028, DEC-029, DEC-030, DEC-031, DEC-032, DEC-033, DEC-034, DEC-035, DEC-036, DEC-037, DEC-038, DEC-039, DEC-040, DEC-041, DEC-042, DEC-043, DEC-044, DEC-045, DEC-046, DEC-047, DEC-048, DEC-049
  - rule_ids：BR-F03-001, BR-F03-002, BR-F03-003, BR-F03-004, BR-F03-005, BR-F03-006, BR-F03-007, BR-F03-008, BR-F03-009, BR-F03-010, BR-F03-011, BR-F03-012, BR-F03-013, BR-F03-014, BR-F08-011
  - ac_ids：AC-F03-ORIG-01, AC-F03-ORIG-02, AC-F03-Q028, AC-F03-Q029, AC-F03-Q030, AC-F03-Q031, AC-F03-Q032, AC-F03-Q033, AC-F03-Q034, AC-F03-Q035, AC-F03-Q036, AC-F03-Q037, AC-F03-Q038, AC-F03-Q039, AC-F03-Q040, AC-F03-Q041, AC-F03-Q042, AC-F03-Q043, AC-F03-Q044, AC-F03-Q045, AC-F03-Q046, AC-F03-Q047, AC-F03-Q048, AC-F03-Q049
  - fixture_ids：FX-EXPORT, FX-FORMAT
  - issue_ids：COV-E02, ISS-AC-02, ISS-AC-04, ISS-AC-05, ISS-AC-06

**UI Entry**：UserViewEnlarge明细页提供图表Excel、原始明细与透视格式化Excel；ComponentEditBar有下载入口。必须区分表格展示数据导出与downloadType=dataset的原始数据导出。

**State/Data Flow**：downloadViewDetails取dvMainStore最后请求/图表/数据 → exportExcelDownload构造请求 → innerExportDetails或innerExportDataSetDetails；后者服务端委托前者。分享/嵌入模式决定blob同步响应或任务反馈；透视格式化Excel另走exportPivotExcel，未完整审该分支。

**API/Backend**：ChartDataServer.findExcelData重新calcData；dataset分支改table-info并拉授权原始字段；table-info/table-normal循环分页写SXSSFWorkbook，其他表型单独分支；异步走ExportCenterManage.addTask。这是已有XLSX链，不证明CSV或全量图片。

**Persistence**：导出任务及文件由ExportCenterManage管理；cleanLog有按保留天数删除文件目录和任务逻辑；deleteTask也删文件与任务。源码存在该逻辑，不代表已核对实际调度/配置。永久文件要求需要明确改动设计。

**Permission Boundary**：API分别export_view/export_detail，服务层DeLinkPermit及分享EXPORT_DATA，取数calcData有READ/行列/脱敏数据上下文。validateDownloadTask见任务票据签名/uid/时效校验，未在该方法见历史行列覆盖重验；其他拦截器及XPack尚UNKNOWN。

**Existing Tests**：在 core/core-frontend/tests 与 core/core-backend/src/test 用 rg --no-ignore --files 枚举，见饼图、地图、字体、tooltip、SMB、MixHandler 等入口，未见本功能专门回归文件名；不等于全仓库无测试。全部 NOT_RUN。后续须先确认隔离环境，不能把类型检查或构建代替行为见证。 候选见证：普通/明细/透视表全部页、排序及汇总；授权与拒绝、行列/脱敏；同步/异步和历史下载权限缩窄。必须使用合成数据。

**Reuse Options**：复用既有导出任务、命名、权限及分页查询、Excel类型/格式处理；不能把原始明细能力用于透视聚合要求，也不能用视口截图证明完整图片导出。

**Change Surface**：候选面：格式选择及全量图片/CSV、全部表型枚举、异步任务冻结参数与执行身份、容量/超时/取消/重试状态、文件永久保留及历史权限覆盖证明、可计算XLSX与样式。现有下载票据TTL与文件保留时长是不同概念。

**Unknowns**：除table-info/table-normal/table-pivot外实际表型覆盖、图片尺寸容量、CSV支持、后台执行身份、分页数据更新一致性、取消完成竞态、自动重试类别/次数、完整审计和管理员双权限均UNKNOWN；ISS-AC-02/04/05/06保留。

**Risk**：高：误导出原始明细、历史权限缩窄仍下载旧文件；高：永久保留与cleanLog策略冲突；高：资源消耗和半文件成功；中：排序/汇总/格式语义漂移。按允许/拒绝及500000等S00边界设计，不自行设置新阈值。

**Recommended Slice**：S04候选；先跑既有XLSX全量/权限/任务链，补枚举格式与历史文件授权设计。未证明永久保留和历史覆盖前不能READY。

**Evidence Anchors**：
- `F03-A01` OBSERVED / call_trace：`core/core-frontend/src/components/visualization/UserViewEnlarge.vue:40`（downloadViewDetails/exportAsFormattedExcel）；明细弹窗有图表Excel、原始明细及透视表格式化Excel入口；379–418取最后查询参数及view数据后调用exportExcelDownload或exportPivotExcel。 限制：仅静态源码；运行NOT_RUN；不代表目标需求完整支持
- `F03-A02` OBSERVED / call_trace：`core/core-frontend/src/views/chart/components/js/util.ts:496`（exportExcelDownload）；request.downloadType决定调用普通/原始导出API；嵌入与分享按模式分支下载blob或给任务反馈；文件名含报告、图表与时间戳。 限制：仅静态源码；运行NOT_RUN；不代表目标需求完整支持
- `F03-A03` OBSERVED / static_read：`sdk/api/api-base/src/main/java/io/dataease/api/chart/ChartDataApi.java:35`（innerExportDetails/innerExportDataSetDetails）；公开API分别带export_view和export_detail权限契约；服务端254–264另见DeLinkPermit及ShareVisitorPermissionManage.EXPORT_DATA。 限制：仅静态源码；运行NOT_RUN；不代表目标需求完整支持
- `F03-A04` OBSERVED / call_trace：`core/core-backend/src/main/java/io/dataease/chart/server/ChartDataServer.java:118`（findExcelData）；dataset下载将类型切为table-info并取数据集字段，过滤列权限，调用calcData重新查询；普通导出也走calcData。 限制：仅静态源码；运行NOT_RUN；不代表目标需求完整支持
- `F03-A05` OBSERVED / static_read：`core/core-backend/src/main/java/io/dataease/chart/server/ChartDataServer.java:256`（innerExportDetails）；分享非BI或嵌入同步分支生成SXSSFWorkbook，table-info/table-normal按总页循环，其余类型另走明细分支；否则addTask；原始导出委托此方法。 限制：仅静态源码；运行NOT_RUN；不代表目标需求完整支持
- `F03-A06` OBSERVED / static_read：`core/core-backend/src/main/java/io/dataease/exportCenter/manage/ExportCenterManage.java:314`（cleanLog）；cleanLog读取basic.exportFileLiveTime，按exportTime阈值删除目录并删除任务记录。 限制：仅静态源码；运行NOT_RUN；不代表目标需求完整支持
- `F03-A07` OBSERVED / static_read：`core/core-backend/src/main/java/io/dataease/exportCenter/manage/ExportCenterManage.java:475`（validateDownloadTask）；下载验证任务、一次性ticket、签名、用户关联、时间并删除下载票据；此方法未见对历史文件行列权限覆盖重新计算。 限制：仅此方法的静态事实，不是全产品安全漏洞结论；未审XPack。
- `F03-A08` OBSERVED / static_read：`core/core-backend/src/main/java/io/dataease/exportCenter/manage/ExportCenterManage.java:360`（getCurrentUserExportTask/deleteTask）；删除先核对任务归属，deleteTask取消匹配Future并删文件目录及任务；136–149失败任务可重试。 限制：仅静态源码；运行NOT_RUN；不代表目标需求完整支持

## F04 查询选项过滤

- **Function ID**：F04
- **S00 Requirement/Decision/AC IDs**：源 `../SP-004/Resume-r004/AcceptanceMapping.json`，以下保留全部本功能映射（不表示逐项已验收）：
  - question_ids：Q050, Q051, Q052, Q053, Q054, Q055, Q056, Q057, Q058, Q059, Q060, Q061, Q062, Q063, Q064, Q065, Q066, Q067, Q068, Q069
  - decision_ids：DEC-050, DEC-051, DEC-052, DEC-053, DEC-054, DEC-055, DEC-056, DEC-057, DEC-058, DEC-059, DEC-060, DEC-061, DEC-062, DEC-063, DEC-064, DEC-065, DEC-066, DEC-067, DEC-068, DEC-069
  - rule_ids：BR-F01-008, BR-F04-001, BR-F04-002, BR-F04-003, BR-F04-004, BR-F04-005, BR-F04-006, BR-F04-007, BR-F04-008, BR-F04-009, BR-F04-010, BR-F04-011, BR-F07-006
  - ac_ids：AC-F04-ORIG-01, AC-F04-Q050, AC-F04-Q051, AC-F04-Q052, AC-F04-Q053, AC-F04-Q054, AC-F04-Q055, AC-F04-Q056, AC-F04-Q057, AC-F04-Q058, AC-F04-Q059, AC-F04-Q060, AC-F04-Q061, AC-F04-Q062, AC-F04-Q063, AC-F04-Q064, AC-F04-Q065, AC-F04-Q066, AC-F04-Q067, AC-F04-Q068, AC-F04-Q069
  - fixture_ids：FX-CASCADE
  - issue_ids：ISS-AC-03, ISS-AC-07

**UI Entry**：QueryConditionConfiguration配置查询字段与级联；Select.vue为实际候选项展示入口，Tree.vue另有optionFilter路径（仅检索定位，未完整追踪）。

**State/Data Flow**：确认时conditions/cascade深拷贝到queryElement并记snapshot/reRenderAll/queryData；Select按上游选择构造in过滤后请求枚举，再在前端按optionFilter集合筛选。已有规则不是完整新表达式过滤树证明。

**API/Backend**：api/dataset.ts enumValueObj → DatasetDataServer.getFieldEnumObj → DatasetDataManage.getFieldEnumObj → ExtWhere2Str/WhereTree2Str → Provider.rebuildSQL/fetchResultField；query/display/sort字段ID分别解析，搜索使用like，resultMode=0目前LIMIT1000。

**Persistence**：queryElement.propValue/cascade属于componentData，canvasSaveWithParams序列化并走saveCanvas/updateCanvas；后端updateCanvas复制请求并innerEdit。字段改名/删除/类型变化的历史规则兼容尚待运行。

**Permission Boundary**：枚举后端核对数据集READ，过滤列权限、行权限并有脱敏处理定位；配置保存API要求manage。只前端optionFilter不能构成访问控制；完整分享/嵌入上下文仍待见证。

**Existing Tests**：在 core/core-frontend/tests 与 core/core-backend/src/test 用 rg --no-ignore --files 枚举，见饼图、地图、字体、tooltip、SMB、MixHandler 等入口，未见本功能专门回归文件名；不等于全仓库无测试。全部 NOT_RUN。后续须先确认隔离环境，不能把类型检查或构建代替行为见证。 候选见证：已有集合过滤+级联求交；不选择不影响报告；合法空集与错误；保存前另一会话不变、保存重开；字段改名和类型变化。

**Reuse Options**：复用稳定fieldId、查询条件配置和快照、枚举请求、级联条件与Provider方言；图表FilterTree可作为模型参考，但不能未经适配直接等同查询选项规则。

**Change Surface**：候选面：自身表达式树/类型检查、服务端候选查询交集、失效规则保留与字段绑定、环路检测及路径、非法与空集区分、加载错误态、保存隔离；与F01复制及F07枚举上限共享改动点。

**Unknowns**：动态函数清单、时区与NULL/空字符串oracle、完整过滤树深度和方言、级联成环校验、失效项逐级清除、服务错误包装和原合法预览保留UNKNOWN。DatasetDataServer捕获错误返回null使错误/空集区分尤其需要验证。

**Risk**：高：前端过滤绕过或错误当合法空集；高：非法配置覆盖已保存规则；中：循环/深级联请求膨胀；中：ID映射和字符串null语义错误。保持Q072等其他功能新增需求边界，本lane不重裁D07/D08。

**Recommended Slice**：S05候选；先确定现有NULL/级联/保存运行基线及ISS-AC-07语义，再设计表达式过滤契约。当前CONDITIONAL。

**Evidence Anchors**：
- `F04-A01` OBSERVED / static_read：`core/core-frontend/src/custom-component/v-query/Select.vue:281`（handleFieldIdDefaultChange/handleFieldIdChange）；枚举结果到前端后按optionFilter集合筛选；默认值分支显式排除null，对象分支先字符串化；213–244构造上游级联in条件。 限制：仅静态源码；运行NOT_RUN；不代表目标需求完整支持
- `F04-A02` OBSERVED / call_trace：`core/core-frontend/src/api/dataset.ts:114`（enumValueObj）；enumValueObj调用/datasetData/enumValueObj；DatasetDataServer.getFieldEnumObj再交DatasetDataManage。 限制：仅静态源码；运行NOT_RUN；不代表目标需求完整支持
- `F04-A03` OBSERVED / call_trace：`core/core-backend/src/main/java/io/dataease/dataset/manage/DatasetDataManage.java:853`（getFieldEnumObj）；queryId/displayId/sortId解析真实字段并校验数据集READ及行列权限；request.filter进入ExtWhere2Str，搜索生成like，Provider重建SQL并取数；resultMode=0限制1000。 限制：仅静态源码；运行NOT_RUN；不代表目标需求完整支持
- `F04-A04` OBSERVED / static_read：`core/core-backend/src/main/java/io/dataease/dataset/server/DatasetDataServer.java:56`（getFieldEnum/getFieldEnumObj）；枚举服务捕获异常记录日志后返回null。 限制：仅静态源码；运行NOT_RUN；不代表目标需求完整支持
- `F04-A05` OBSERVED / static_read：`core/core-frontend/src/custom-component/v-query/QueryConditionConfiguration.vue:1591`（confirmClick）；确认校验后把conditions及cascade深拷贝写queryElement，记录快照并触发reRenderAll/queryData。 限制：仅静态源码；运行NOT_RUN；不代表目标需求完整支持
- `F04-A06` OBSERVED / call_trace：`core/core-frontend/src/utils/canvasUtils.ts:843`（canvasSaveWithParams）；克隆componentData并JSON.stringify随canvasViewInfo发送saveCanvas或updateCanvas。 限制：仅静态源码；运行NOT_RUN；不代表目标需求完整支持
- `F04-A07` OBSERVED / static_read：`core/core-backend/src/main/java/io/dataease/visualization/server/DataVisualizationServer.java:651`（updateCanvas）；updateCanvas复制请求到DataVisualizationInfo并innerEdit；SDK DataVisualizationApi:75–78要求id:manage。 限制：仅静态源码；运行NOT_RUN；不代表目标需求完整支持

## 进入下一轮的运行问题

这些是待主代理编入具体环境方案的候选问题，不是执行授权：F01过滤编辑/保存与身份拒绝；F02指定App手机和平板普通/透视表的浏览、返回和方向；F03全量XLSX、异步/同步、行列脱敏与历史下载拒绝；F04级联交集、错误与空集、保存隔离及NULL基线。完整171 AC逐项执行状态由主代理总表记录，本报告给出其中72条本功能映射与关联claim，不缩减总分母。

已识别但未追完链路继续保留UNKNOWN，不能以本候选表完整填写判定证据充分。独立review与运行见证均尚待提供。
