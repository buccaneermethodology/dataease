# 技术依赖调查台账 r003

保留原14项分母；本版替代r002作为当前调查入口。逐项调查完成候选，待独立复核；产品实现/验收依赖仍保留。历史r002不改写。

## ISS-AC-01 30分钟精确边界

后续责任：S02设计负责人。

**源码结论（OBSERVED）**：原组件复制使用Pinia `copyData`，`copyDataInfo`只存深拷贝组件与index；`paste`没有创建时间、期限或身份键检查（A01）。原FilterTree提供编辑/确认，而不是专门共享过滤剪贴板。因此当前原组件复制机制不能提供F01的1800秒等号oracle。

**实际检索**：在 `src/store/modules/data-visualization/copy.ts`、`views/chart/components/editor/filter/`、`custom-component/v-query/` 搜索 `1800|30 * 60|expires|expire|TextEncoder|Blob|1024|1048576|1000000`；无F01专用过期判定命中。另在整个前端src搜索 `copyData = null`、copyStore清理，只有初始化等命中；不将有限关键词搜索提升为全产品无清理机制。

**可固定的工程边界**：既有实现不决定等号，1799/1801秒仍承接S00；恰1800秒应由S02实现契约显式采用一种比较，并绑定统一时钟与创建时刻、不在读取/刷新续期。此处不擅自选择 `>=` 或 `>`。owner=S02设计者；复核步骤是在批准设计中检查比较式、用可控时钟分别验证1799、1800、1801秒及多次粘贴/标签刷新，拒绝时目标和预览均不变。当前结论为“实现oracle缺失，已定位不应复用的原组件复制路径”，不是泛称待调查。

来源：[DependencyFollowup-A.md](DependencyFollowup-A.md)。

## ISS-AC-02 MB字节计量

后续责任：S02/S04契约设计负责人。

**源码结论（OBSERVED）**：`ExportTaskFileTarget.size()`使用`Files.size`取得落盘文件字节数；`readFileSize()`按1024进位并四舍五入两位，单位文本为Kb/Mb/Gb。大于1MiB才用Mb，恰1MiB会显示1024.00Kb（A11）。`updateExportTaskSuccess`在workbook写出关闭后读取该值（A12:632–650、708–715），它是最终文件展示大小，不是写入过程中100MB熔断。F01原复制对象尚无UTF-8序列化字节计数（A01）。

**实际检索**：导出manage/server及ChartDataServer中搜索 `timeout|retry|Interrupted|cancel|104857600|100000000|1800`，仅重试、取消及数值格式单位常量等命中，未发现本导出链100MB限制；不得把格式化的100000000倍率当文件大小阈值。源码还有view/dataset行数默认100000（A14），不是500000新要求已实现。

**影响与处置**：当前“显示Mb按1024”可明确，不能据此把S00写成MiB。owner=S02/S04契约设计者：F01固定序列化对象范围、UTF-8编码与测量点；F03固定原始byte阈值及流式累计测量点；同时明确50MB提示与100MB拒绝的独立阈值。复核步骤保留999999/1000000/1000001以及1048575/1048576/1048577字节两组候选，待契约选择后执行适用组；不得以显示四舍五入字符串作判定。本轮未执行容量实验。

来源：[DependencyFollowup-A.md](DependencyFollowup-A.md)。

## ISS-AC-03 性能与移动端验收条件

后续责任：各Slice验收负责人。

已有证据：PreflightA-tools.json记录macOS 26.0/aarch64、JDK21.0.12.1、Maven3.9.11、项目Node v23.11.0工具清单；B2c使用本机回环7070→8100→3307/dataeasev3与Redis6379、standalone/admin、单浏览器串行交互，5001行确定性合成fixture；本轮临时viewport1280×900已恢复。没有采集浏览器引擎精确版本、CPU/内存规格、浏览器硬件计时、并发负载、冷暖缓存分组或采样分布。不能由截图、端口或操作总耗时推断3秒/2秒达到。

本次调查结论：功能见证可复现，性能环境尚未成为统一验收基线；App/真设备项按ScopeDelta-r001延期，其余性能条件仍由后续Slice验收设计负责人补齐，不计通过。

可执行建议（尚非冻结标准）：每个Slice在运行前记录产品/Provider/数据库/浏览器版本、CPU/RAM、数据规模、表达式深度、冷/暖缓存、并发、网络；以用户动作开始至数据呈现稳定为端到端计时，另记录请求开始/结束区分后端与渲染；固定预热及重复次数并报告原始样本、错误率和分位数。以S00已经确认的3秒/2秒作相应功能目标，绝不把它改成查询杀死阈值。由测试负责人在Slice设计审查确认具体负载与统计口径后执行。真实设备须记录App/OS/机型和方向/返回流程，不以桌面viewport替代。

来源：[DependencyFollowup-C.md](DependencyFollowup-C.md)。

## ISS-AC-04 导出类型与图片容量

后续责任：S04导出设计/测试负责人。

**源码枚举（OBSERVED）**：当前主前端显式`category: table`包含四项，而非三项：`table-info`明细表、`table-normal`汇总表、`table-pivot`透视表、`t-heatmap`热力表（A04）。注册器同时扫描`charts/table/*.ts`和`charts/g2/**/*.ts`（A05），热力表在g2/table目录构造`t-heatmap`（A06），后端有对应`@Component TableHeatmapHandler/type=t-heatmap`（A07）。故S01表型分母必须包含热力表；XPack/插件动态扩展未知，四项是当前主仓库内建枚举，不声称覆盖不可见扩展。

**格式与调用（OBSERVED）**：现有普通/原始明细链输出`.xlsx`（A09/A10），透视格式化Excel入口另调用`exportPivotExcel`（A08:389–398）。图片入口`htmlToImage`调用`toPng(viewContainer)`，默认1280×720、下拉最大2560×1600；加载时覆盖容器宽高（A08）。该路径对当前渲染容器截图，并未在此方法逐页拉取所有行列。最大下拉尺寸是选项，不是经验证的最大安全图片容量。

**实际检索**：枚举前端table目录、g2目录及后端impl/table，并检索表型注册；在UserViewEnlarge、imgUtils、图表util及exportCenter搜索`csv|CSV|toPng|toJpeg|toBlob|32767|16384|canvas.*limit`，此链见PNG，未见CSV及显式图片容量拒绝。未搜索其他业务导出器，因此不作全产品无CSV结论。

**明确后续**：owner=S04调查/设计者；把热力表加入XLSX/CSV/图片矩阵，与普通/明细/透视分别检查表头、聚合/条件样式、隐藏列、分页及完整数据。图片上限目前UNKNOWN，必须在指定浏览器/内存/设备，以合成宽高和行列递增矩阵验证，记录像素宽高、总像素、编码后bytes、失败模式；只有实测边界及安全余量才形成上限。B2c只证明明细表5行XLSX服务端文件吻合（A19/A20），不证明浏览器下载或热力表/图片/CSV。

来源：[DependencyFollowup-A.md](DependencyFollowup-A.md)。

## ISS-AC-05 异步导出机制及重试计时

后续责任：S04导出设计负责人。

**当前切换明确（OBSERVED）**：ChartDataServer根据分享linkToken/是否BI/嵌入模式走同步，否则addTask（A10:254–387）；这里不是按行数阈值自动切换。`ExportCenterDownLoadManage`以配置默认core=10/max=10创建ScheduledThreadPoolExecutor、keepAlive=600秒，submit任务（A12:101–113、159–164）。源码未给单用户并发上限或独立排队上限；ScheduledThreadPoolExecutor语义不能以setMaximumPoolSize推定有效并发扩容。部署配置值未读，不把默认值说成实际部署值。

**任务上下文与状态明确（OBSERVED）**：addTask生成ID、userId、PENDING、exportTime、params序列化，然后调用startPanelViewTask/startDataVViewTask（A13:253–270）。startViewTask在调用线程捕获uid/proxyOid/clientIp，在执行线程恢复，finally清除IPUtils和V3UserUtil（A12:551–650）；不是“后台身份未传”。任务入库在执行线程开始后，随后IN_PROGRESS，写workbook关闭后SUCCESS，异常FAILED。PENDING对象在排队期间是否已可查询不能假定成立，需另做排队运行见证。

**分页一致性结论（OBSERVED/INFERRED）**：table-info/table-normal及dataset导出设置pageSize（默认50000），第一次取totalPage，逐页改变goPage再次findExcelData；首个请求对象在任务启动时继续使用，数据查询在执行时发生（A12:578–630）。此循环本身未见快照事务或稳定游标，不能宣称动态源分批无重复遗漏；此为实现设计待验证风险，不是已复现缺陷。

**重试/取消实际边界（OBSERVED）**：retry仅允许本人的FAILED任务，改PENDING、进度0、重置exportTime、删除旧目录再startViewTask（A13:136–150）；该方法没有次数、间隔或可恢复错误分类。导出任务循环检索未见30分钟截止或跨重试总计。管理器deleteTask对自己`Running_Task`执行cancel，而异步submit/future登记在另一类ExportCenterDownLoadManage的独立同名Map（A12:113、649；A13:90、374–381）；本次未找到二者共享Map，因此不能把delete路径的cancel语句当作已证实能停止实际任务。

**后续owner与复核**：S04设计者负责冻结计时点（提交/入队/开始/结束/各次重试），明确30分钟是否含排队与重试总计；测试者在获准隔离环境构造池饱和、FAILED重试、执行中取消、源插入/删除、权限身份两用户。必须核对任务状态、后续SQL是否停止、临时文件清理和唯一交付；不新增用户并发业务上限。B2c已有异步SUCCESS和正确服务端文件仅校准最短成功链，不能关闭这些边界。

来源：[DependencyFollowup-A.md](DependencyFollowup-A.md)。

## ISS-AC-06 任务历史及审计保留策略

后续责任：S04设计及治理/审计负责人。

**已确认现行源码政策（OBSERVED）**：CoreDataInit提供`basic.exportFileLiveTime=30`默认种子（A16）；CleanScheduler以`0 0 0 * * ?`每日调用exportCenterManage.cleanLog（A15）；cleanLog用配置天数算阈值，删除过期文件目录并删除任务记录（A13:314–328）。这是文件和任务记录共同清理的实现，不只是未调用辅助方法。实际运行配置可被修改，本轮未读取，不能声称用户部署一定30天。

人工deleteTask也同时删目录和任务（A13:369–385），所以“永久保留文件但人工仅删文件、任务历史保留另定”需要明确改造。导出发起wrapper存在`@DeLog(EXPORT,PANEL/SCREEN)`（A12:524–531）；ExportCenterApi与Server的delete/retry路径未见相应DeLog注解（A18及静态server读取），不代表全局AOP绝无日志。`basic.logLiveTime`是SDK公共常量（A17），主仓库检索仅常量与SystemSettingUtils键白名单；不能将其推为具体日志期限或XPack落地政策。

**后续owner与步骤**：S04设计者明确解除文件TTL时任务清理如何独立；治理/审计owner核对可用的XPack公共政策或维护者提供的日志保留约定，确需新增策略时提交具体选项。测试者获准后创建合成任务、删除及取消分别核对文件/任务/审计三种对象。当前已足够给出清理改动面，审计期限仍UNKNOWN；不自行规定永久审计或新增天数。

来源：[DependencyFollowup-A.md](DependencyFollowup-A.md)。

## ISS-AC-07 沿用现有语义的oracle

后续责任：S05/S08设计及Provider验收负责人。

**已查明的实现（OBSERVED/static_read）**：E25/E26两个请求DTO的resultMode默认0；E07中getFieldEnum及getFieldEnumObj在该分支构建limit 1000查询，非0分支不加此limit。该结论不泛化所有选择器，也不等于S00的5000规则已实现。对象枚举searchText非空时选query字段（一个ID）或第二个display字段，构造like条件；E08将like值包为`'%值%'`，字符串由Utils.transValue处理。大小写及数据库通配行为仍由实际方言/排序规则决定，不能把前端includes当数据库oracle。

E07读取数据后移除包含blank字符串的行，再去重；因此NULL、空串和纯空白不能在此路径简单视为正常可选值。过滤树E09的本地搜索是JavaScript includes；批量addFields只按换行split、trim、跳过空行，以Set去重并追加checklist，没有在该函数调用服务器做逐值存在性校验。它不是六分隔CSV引号解析器，也不是带类型/权限逐项校验的F07最终输入协议。三入口不得共用一个“已支持”结论。

**缺口处置**：实际HTTP请求容量无此DTO级长度约束，不能据此报告无限；容器/代理请求限制尚未固定。Owner为S01环境调查与S08设计：固定目标Provider/排序规则后以Abc/abc、百分号/下划线、NULL/空串/空格、高精度数值和日期/布尔向量记录响应；读取部署层请求限制再设计容量边界。保留ISS-AC-07为部分已解决，剩余是具体Provider/type/请求上限oracle，不再把当前1000、换行解析、blank过滤列为未知。

来源：[DependencyFollowup-B.md](DependencyFollowup-B.md)。

## ISS-AC-08 F05现有支持与历史兼容

后续责任：S06设计/测试负责人。

E11的initFields确实收集透视行/列/指标，目标custom由targetFieldId指定；E13把字段ID解析到目标列并区分明细/汇总scope，提供实际渲染分支而非仅候选数组。E13的sortTableTargetRules明确“后配置优先”：同字段按conditionIndex逆序，跨字段按fieldIndex逆序。这是当前行为，与Q076–078要求确定冲突拒绝保存不同，不能写为冲突机制已完成。E12保存检查字段/条件/作用域/数值后复制到thresholdForm；已读范围未见20条计数、规则版本或新旧冲突豁免标记。

历史缺字段处理有具体风险：E11初始化会把失效来源fieldId、失效目标targetFieldId设null并发changeThreshold；这不是“无效原配置原样保留”的证明。B2c R01仅证明明细id>3背景命中4/5且保存重开仍在，不是透视字段全矩阵、跨字段、总计及历史>20验证。

**后续owner/步骤**：S06设计与S01运行复核分别负责历史fixture合同与现状oracle。建立旧配置（同属性重叠、>20、字段删除、同ID改名）读取前后JSON差异；在真实透视行/列/指标和目标custom四组合记录S2结果。禁止为了测试自动删除旧规则。Q072来源、Q079七属性、Q087预览仍是明确需求，不被保守复用范围取消。

补充真实透视amount>100条件命中/不命中及保存重开见证；仍不覆盖跨字段、全部属性、历史>20及冲突矩阵。 证据：[环境恢复及重开](EnvironmentRecovery-r001.md)。

来源：[DependencyFollowup-B.md](DependencyFollowup-B.md)。

## ISS-AC-09 批量拖拽既有机制

后续责任：S07设计/测试负责人。

**容量现在可作精确局部结论**：E02/E03重写axisConfig，普通表xAxis/yAxis及透视xAxis/xAxisExt/yAxis均未设置limit；E04管理器直接返回注册实例，没有合并默认轴配置；E05基类构造器也不合并。E01 addAxis直接解构该axisSpec并比较`数组长度 > limit`。在这五区域limit为undefined时该比较为false，故**当前所追踪的addAxis容量分支不施加数值上限**。不是K=5，也不是产品所有资源无限。父类其他图表yAxis的limit=1不会自动合并进子类覆盖对象。未检到其它axisConfig defaults/merge赋值。

E01按groupType做角色拒绝，重复以字段ID识别；原生drop克隆选中项逐项插入，成功游标前移。选择集合区分维度/指标，跨角色选择清另组。不能由这些实现推出跨区移动源删+目标入原子性。

**吸收B2c（runtime_observation，来源R01–R04）**：在现有region行维度上Meta选择category和enum_text，一次拖入形成三字段，一次撤销回region。它证明该同类双字段/透视行区场景能复用既有撤销，不应继续报告“完全没有撤销见证”。E06 undo/redo回放整体component snapshot；不推广为任何批次都恰好一个历史单元。其它四区域、部分失败、无效取消保选及跨区移动仍需分别见证。

**Owner/步骤**：S07设计以“此链没有数值容量分支”作为当前基线，不杜撰K；若未来确需新增上限另走需求/设计。S01运行者按同fixture对普通两区/透视另两区、重复/角色拒绝、取消拖放、跨区失败各保存前后配置与请求次数。原子性只对具体源删目标入操作验收。

来源：[DependencyFollowup-B.md](DependencyFollowup-B.md)。

## ISS-AC-10 数值与资源保护

后续责任：S09引擎设计/测试负责人。

E20把计算字段交给Utils.calcFieldRegex，E19递归解析引用，深度计数大于100抛循环引用错误；这只是字段引用递归保护，不是表达式复杂度完整防护。已读路径不是独立函数白名单/聚合嵌套验证器：不得声称SQL注入防护已充分。E17 getData每次构造SQL并Provider.fetchResultField，nullToBlank把返回null转空串；E03 CUSTOM对空串/undefined展示“-”，对null返回null。合法除零是否异常或NULL由Provider决定，当前不能承诺所有方言单格隔离。

资源阈值已找到：E22数据源Configuration.queryTimeout默认30；E21非跨源路径把配置queryTimeout传给Statement/PreparedStatement并setQueryTimeout。是可配置的JDBC查询超时（秒），不是F08三秒验收指标。跨源fetchResultField可见分支直接prepareStatement/executeQuery，此局部未显式setQueryTimeout，连接池/Calcite其它层限制未确认。不能把普通源30秒泛化全部引擎。

**Owner/步骤**：S09引擎设计验证函数/聚合合法性和空值传播；S01运行选择当前Provider，用手算加权/NULL/零除/CASE等fixture记录返回值、是否整请求失败及单元格显示，再测取消/晚响应。资源保护需分别读取隔离数据源有效queryTimeout及跨源连接设置，不为查询生产配置读取凭据。

来源：[DependencyFollowup-B.md](DependencyFollowup-B.md)。

## ISS-AC-11 30%效率目标缺少收益基线

后续责任：产品负责人/收益验收负责人。

已审来源为S00 Resume-r004/AcceptanceIssues.json的ISS-AC-11及原Goal调查边界。现有B2c见证衡量数值/呈现与交互正确性，没有用户对照任务、人群、旧流程时长及学习效应控制，不能证明约30%收益。治理观察Goal-DE-GOV-003测的是代理任务治理成本，不能代替产品使用效率。

调查处置：保留原约30%目标，状态为后续产品收益验证依赖；建议产品负责人定义相同仪表板制作任务、熟练度分层、旧/新方案、成功判据、开始结束事件及重复设计；分析负责人预先固定统计方法和失败任务计入规则。以同任务旧流程基线与新流程配对计算时长改善，并独立报告正确率；未提供基线时只列unknown，不预填收益。责任为产品负责人/验收负责人，触发条件为对应功能可用并已冻结可比任务。

来源：[DependencyFollowup-C.md](DependencyFollowup-C.md)。

## ISS-AC-12 现有节点/组件复制后改类型的回归入口

后续责任：S02回归测试负责人。

**已定位真实入口（OBSERVED）**：ComponentEditBar复制菜单触发copyComponent→copyStore.copy()→paste(false)（A02）。copy.ts选择当前组件/多选区域，深拷贝并生成ID映射，调用dvMainStore.addCopyComponent，dashboard发addDashboardItem，记录paste快照（A01）。右键ContextMenuDetails及快捷键DeShortcutKey同样调用copyStore（本轮检索定位）。这是组件复制，不是F01的同类型过滤树专门复制。

类型切换入口为编辑器ChartType组件的`@onTypeChange`（A03:2299），onTypeChange设置render/type、切plugin标记、按目标chartView.setupDefaultOptions重建默认值；逐轴按groupType移除不兼容项、按limit截取超限项，然后更新curComponent.innerType并calcData（A03:1079–1152）。因此复制后改类型不是无损搬运所有配置，回归应观察既有合法迁移和拒绝/移除效果。

**后续owner与步骤**：S02回归设计者：合成图表A（字段、customFilter及样式已保存）→菜单复制B→只给B切目标类型→核对A不变、B新ID、目标字段限制处理、条件保留/失效提示、一次或相应既有快照撤销、保存重开。B2c只有已运行类型切换及过滤持久化的局部证据，未运行此组合；不得用它证明F01专门复制完成。源码入口调查可判“已定位”，运行oracle仍NOT_RUN。

来源：[DependencyFollowup-A.md](DependencyFollowup-A.md)。

## ISS-AC-14 10条计数的异常/历史工程状态

后续责任：S09技术契约负责人。

E14存在row/col各calcTotals/calcSubTotals.cfg四组；setupTotalCfg按当前yAxis重建数组，保留同dataeaseName的aggregation/originName，缺配置默认SUM，已不在yAxis的槽位不再回填。E23/E24是普通List与字段DTO，没有10条注解；E17 getCustomFields只处理当前指标且aggregation=CUSTOM的条目；E18保存JSON至snapshot repository，所读save方法未见跨四组计数/锁/版本检查。

因此当前明确结论是：**该UI→DTO→Handler→save连接链未实施D11每表最多10条自定义公式计数校验**。有四组数组不等于已满足10条；指标数、小计层次数、公式文本去重都不是D11分母。已有setupTotalCfg按轴重建与D11历史超限保留要求有兼容风险。不能自行截断为10或把相同文本合并。未声称整个应用不存在通用并发机制；本链没有发现专用槽位并发约束。

**Owner/步骤**：S09技术合同须在设计中区分右侧目标的总计/小计各占一条、无效/停用仍保存项的工程状态、删除释放、9/10/11以及历史11条。两会话并发保存需后端集中计数与版本策略设计后验证；当前没有实现可运行证明，不用模拟自造一个已存在上限。

来源：[DependencyFollowup-B.md](DependencyFollowup-B.md)。

## ISS-AC-15 D07/D08已裁范围下的实现证据

后续责任：S05/S08/S09复用设计负责人。

| 能力 | 当前证据结论 | 缺口/处置 |
|---|---|---|
| D07查询组件清全部已选 | 静态已有PC clearable及移动onClear清selectValue（E10）；B2c查询多选清空恢复650（R01） | 仅该现有场景，非5000边界与三入口全覆盖 |
| D07图表过滤树清全部已选 | E09 clearAll清checklist/checkboxlist，模板“已添加”旁按钮调用 | 静态已有；待现有入口一次UI见证 |
| D07条件样式清全部已选 | E11已读未见枚举列表/清选择入口 | 局部NOT_FOUND；不把UNKNOWN扩大成全产品不存在，不新增D07入口 |
| D08字段列表/点选 | E15字段列表点击插入[name]，已有 | 仅复用；实际候选权限由后端另外验 |
| D08函数提示 | E15从getFunction读列表，弹层含name/func/desc并点击插入 | 已有函数说明/手动插入；不是键入自动补全 |
| D08自动补全 | E16 basicSetup存在，但E15未传sqlMode，也未见自定义completion source | UNKNOWN：通用编辑器默认不等于公式语义补全；缺失不新增 |
| D08语法高亮 | E16只有sqlMode=true才加载sql()；E15无参调用 | 专门SQL语法扩展在本入口NOT_FOUND；字段占位色块不是SQL语法高亮 |
| D08跨透视表模板 | 已读E14/E15未见模板读写/套用API，相关目录模板检索只有Vue template标记 | 本入口NOT_FOUND，不能以函数列表代替模板；按裁定不新增 |

来源：[DependencyFollowup-B.md](DependencyFollowup-B.md)。

