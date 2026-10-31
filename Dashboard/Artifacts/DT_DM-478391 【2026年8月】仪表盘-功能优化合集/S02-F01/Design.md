# F01 技术设计候选

状态：独立设计复核r001及增量复核r002/r003后为 VALID_WITH_BOUNDS；有限纯比较/计数边界经r003审查、绑定缺口经BCR-r001修复并由BCR-r002复核可接收；当前边界见PureSubcontracts-r002.json。完整设计仍为候选，不是产品 Builder 准入或产品验证。源码阅读基线 HEAD 为 a11d4f1278e12c2bea0d9d4000537d7d8f868f0e；工作区已有其他任务修改，未改动或暂存。

## 来源与重基线

原 design-card 摘要 04c9226503b5f9b0de41f084e01048bf312f455957561bac287f22ee977e02cc 已再次验证通过；原草稿引用和历史字节不变。业务来源为卡片绑定的 SP-004/Resume-r004/AcceptanceCriteria.md、FixtureSpec.md、AcceptanceIssues.json。补充读取 Goal.final.json 与 planning/UserIntent-supplement-r002.md：以正式 Goal 的16条产品义务和10条Goal AC为完整分母；GLOBAL Q001–003约束来源与范围。Q066/Q067属于BR-F01-008，不扩大F04开发范围。

历史父流程曾通知“S01已收尾”，但该通知未附可复核的S01终态回执。当前用户原始意图仍为“S01还在继续收尾中”；S01 F01 Entry Packet、独立审查及终态摘要尚未绑定前，该历史通知不能解除产品Builder前置。S02可继续不干扰S01的设计和开发准备，但不得以此绕过具体准入。当前真实权限环境仍阻塞；不得用standalone/admin替代真实权限验收。

## 已读源码与影响面

| 位置 | 观察与设计用途 |
|---|---|
| core/core-frontend/src/views/chart/components/editor/filter/FilterTree.vue，changeFilter/init/dfsTreeDelete | 接收logic/items并剥离临时field对象，emit filter-data，记录changeFilter快照；编辑时挂载字段元数据。粘贴不能将field临时对象或结果带入载荷。 |
| core/core-frontend/src/views/chart/components/editor/index.vue:1594，changeFilterData；1598附近打开过滤器 | 当前深拷贝写view.customFilter；可作为图表完整树提交连接点，但刷新触发仍须实际验证。 |
| core/core-frontend/src/custom-component/v-query/QueryConditionConfiguration.vue:1261 validate、1590附近confirmClick | 查询配置不是图表customFilter；提交propValue和cascade，先清空propValue后nextTick再赋值及发queryData。不得直接把此多阶段路径当粘贴原子事务。 |
| 同上：178附近cascadeArr，1184附近级联配置，dataset/checkedFieldsMap/treeFieldList | 存在组件ID、数据集ID与字段关联；目标映射及完整支持结构尚未逐字段证明。 |
| core/core-frontend/src/views/chart/components/editor/filter/auth-tree-chart/FilterFiled.vue:23–31、218–255 | 现有filterTypeTime/dynamicTimeSetting/timeType承载动态日期规则；复制规则，不固化计算结果。表达式完整清单与时区oracle待证。 |
| core/core-frontend/src/utils/logout.ts，logoutHandler；store/modules/user.ts，clear/setUid | 现有登出和身份清理入口；须接入剪贴内容失效及跨标签身份代际，不能只在组件销毁清理。 |
| core/core-frontend/src/store/modules/data-visualization/snapshot.ts:89 | 存在calcData分支；本功能改变过滤语义须走取数通知，不以renderChart替代。 |
| core/core-backend/src/main/java/io/dataease/chart/manage/ChartViewManege.java:93，save | 当前写SnapshotCoreChartView；局部save成功不是发布及另一会话已生效证明。 |
| sdk/api/api-base/src/main/java/io/dataease/api/visualization/DataVisualizationApi.java:60–76；core/core-backend/src/main/java/io/dataease/visualization/server/DataVisualizationServer.java:288 | saveCanvas有manage权限注解，源码说明初次保存与后续snapshot路径不同。注解存在不证明真实权限实现有效。 |

以上是静态观察，不是完整调用链/运行验收。未读取或复制XPack专有实现。

## 可先审查冻结的语义与模块职责

1. 分离纯载荷验证器、共享内容存储适配器、图表适配器、查询组件适配器和鉴权适配器。两个组件类别使用显式kind判别，禁止互转；数据集及字段采用ID精确匹配，无法确认即整次拒绝，不按名称自动映射。
2. 剪贴内容建议为版本化内部envelope：版本、kind、源资源/组件标识、数据集标识、身份代际、创建/失效时间及完整过滤配置。字段白名单从两个适配器的实际类型确定；不携带token、样式、布局、数据结果、临时字段对象。具体查询配置字段清单未冻结，见DG-03。
3. 复制流程先在独立对象上提取和验证完整配置、叶子数、序列化容量，全部通过后一次替换旧剪贴内容。空源禁用；失败保留旧内容。深拷贝隔离源与目标；系统剪贴板不读写。
4. 粘贴采用prepare/commit：读取不可变载荷，结构校验、时效/身份校验、当前数据权与目标编辑权、全部字段/运算符/目标能力和依赖图校验全部成功后生成候选树。目标有旧配置时确认；确认期间身份、目标版本或权限变化则重验，不提交陈旧候选。取消/失败零目标变更、零新过滤查询、无成功提示。合法提交一次替换整个配置，记录现有快照并触发一次逻辑预览，提示“过滤条件已应用”。异常载荷提示“过滤条件不匹配，请重新复制”。不先写可解析片段再回滚。
5. 图表适配器保留logic/items/subTree树及动态规则，剥离临时元数据；普通图/普通表/透视表通用规则可互拷，目标不能承载任一节点即拒绝。查询适配器必须同时处理自过滤与级联依赖完整副本；先构建目标引用闭包再检测直接/间接环。缺字段、引用无法解析或承载不全拒绝，禁止删失效边后声称成功。查询组件内部ID重绑定规则尚未证实，不能由Builder自由发明。
6. 共享机制建议同源DataEase内部存储+跨标签通知；通知只是失效提示，粘贴必须重读共享状态和当前身份。登出/切换用户先废止旧代际并移除内容，旧标签不可把缓存写回；U→V→U不能恢复。刷新不得重置创建时间。具体可靠代际权威及并发协议待DG-02审查，客户端uid相等不构成授权。
7. 每次复制需源编辑/数据访问资格，每次粘贴需当前身份、数据访问及目标编辑资格；服务端保存和数据请求继续强制既有权限。只读用户禁止查看过滤配置，不只是隐藏按钮。若现有读取接口向只读者返回完整配置，应列为实际接口缺口并设计权限过滤，不能由UI遮盖。当前无法证明此项，也不批准绕过权限的产品路径。
8. 粘贴只改变编辑态和即时预览，沿原保存/快照/发布流程持久化；不新增自动保存。P0已保存、P1预览、P2编辑确认分别观测；保存失败另一会话仍P0，正常保存重开为P2。撤销沿既有机制验证，不新增独立撤销体系。

## GR-03工程边界提案

独立复核r002/r003认可以下有限纯子合同的比较/计数边界，不授予身份、时钟、serializer、UI或持久化实现准入。完整envelope与可信时钟仍属未决，若后续证据与来源冲突先报告，不由Builder自行裁定。

- TTL有限比较子合同冻结有效区间0≤age<1800000毫秒，age=1800000过期；测试1799999/1800000/1800001。跨标签/刷新以同一不可变createdAt/expiresAt为准，不因读、粘贴或刷新续期。建议采用可校验服务端时钟/到期凭据；纯客户端Date.now无法抵抗离线回拨，不能宣称满足可靠30分钟。无法取得时间、非有限值、未来创建时间或检测到回拨均拒绝本次使用并要求重新复制；是否需要新增服务端时间接口、刷新后如何确认回拨由DG-02冻结，当前不声称已有实现。测试回拨、前跳、异常值、休眠恢复与刷新，记录计时来源。
- 有限字节计数子合同冻结上限为十进制1000000字节，等于允许；测999999/1000000/1000001字节。计量对象为最终版本化envelope全部字段的UTF-8未压缩JSON序列化原始字节，包括身份/时间/资源标识、键名、结构、过滤规则与枚举值，不是只测叶子值，也不是存储转义层/压缩结果。复制构造完整envelope后序列化一次，TextEncoder计算字节并保存同一字节串；粘贴先对原始串检查容量再解析和完整schema校验。中文/emoji多字节用例与ASCII分别构造精确边界，不以字符数代替字节。
- 50/51叶子独立验证，组合节点不计；1001枚举在数量/容量均合法时允许，不增加枚举条数上限。资源保护不得悄悄变成新业务树深上限。此容量口径仅F01，不推广导出F03。

## 切片、验证及冻结边界

| 切片 | 当前可做的开发准备 | 实施前必须补齐 |
|---|---|---|
| A 纯规则与有限计数/比较子合同 | 17个case identity及其有限输入/oracle绑定及TTL/UTF-8/叶子边界见PureSubcontracts-r002.json；旧r001仅留作审查历史。不依赖真实账号 | 将纯子合同绑定到实际可运行实现入口并形成可信RED、卡片与admission；最终envelope/完整树schema仍未冻结 |
| B 共享内容生命周期 | 设计多标签、U/V/U、刷新、过期和并发旧标签用例 | 代际权威/时钟来源协议；真实身份路径能力，不能以mock证明权限 |
| C 图表粘贴 | 制定customFilter整树替换、确认取消、快照/预览观察点 | 实际刷新/保存调用链与权限前置，独立预审和准入 |
| D 查询组件粘贴 | 制定级联闭包、环、缺引用、深拷贝与跨仪表盘用例 | 查询字段完整schema、引用映射、原子提交连接点；不扩建F04规则引擎 |
| E 持久化与兼容 | 固定P0/P1/P2、保存失败/重开/另一会话测试计划 | 真实保存发布路径与历史fixture；权限相关场景仍阻塞 |

所有运行用例当前NOT_RUN（未运行）。FX-COPY树T命中{2,3,5}、旧树命中{5}；畸形JSON、缺节点、非过滤对象均拒绝且旧树/P0/预览保持。固定动态规则及同一时钟/时区比较，不能编造函数。保持既有复制组件/改类型回归。16项产品义务映射见CompatibilityMatrix.md；全局收益约30%/ISS-AC-11、复制审计/独立加密COV-D01保持原状态并移交，不通过功能测试关闭。

当前可冻结业务不变量和测试分母；完整实现schema、查询引用、可信时钟/身份协议、权限接口证据不能标已冻结。有限纯子合同边界当前见PureSubcontracts-r002.json（旧r001保留为审查历史）；其他缺口见DesignGaps.json。Builder不得自行裁定尚未审查的缺口。回滚以本功能新增入口/适配器的有界代码回退为候选，不改历史配置、数据库或S01材料。任何源Goal/AC/源码/协议变化需记录差异并重基线。
