# 当前DEV eligible图表分母独立验证 r001

- reviewed_at：`2026-10-31T00:56:21.876979+00:00`；snapshot_id：`S02-CURRENT-ELIGIBLE-INVENTORY-r001`。
- Reviewer：`/root/local_basemap_reviewer`；本有界交付首轮，一次查全。接收端卡validate/render均exit0，canonical SHA `605af49e9cb8b8085eae0eb2a1660e764422e2aa239c690838af96e994930ae9`。
- as_of_state：受审运行观察时间为 `2026-10-31T00:51:48.450Z`，app记录`xpackValid=false / xpackValidLoaded=true`；当前工作区源码及既有P1 TypeDecisions字节如下表绑定。此刻父Agent正在更正范围权威时间线；旧Goal字节仅为卡绑定历史上下文，本件不审定新22项Goal/TSP或授权范围变更。
- **verdict：PASS_FOR_CURRENT_DEV_ELIGIBLE_49_ONLY（仅当前DEV已观察可用集合49的分母核对有界通过）。installed插件总数仍UNKNOWN；GTR-001的环境分母疑问得到限定，插件兼容机制/后续installed核验责任不整项关闭。**

本验证核对当前基本MVP应覆盖的类型身份与环境上限，不重新执行49型产品验收。只读文件/结构与摘要，唯一写入本报告；未访问浏览器或65070、未请求HTTP、未改产品/服务/DB、未构建/安装/运行产品测试。主要风险是把当前palette无插件等同于安装数0，或把49基本配置接纳升格为49完整产品类型通过。

## 结论与GTR-001明确判定

当前提供的DEV观察、当前CHART_TYPE_CONFIGS、当前自动注册源码子类、SupportedCharts及TypeDecisions的身份集合一致：**49个唯一render/type，46 antv＋3 custom**；47显示＋2隐藏。没有发现这组当前证据中“具体应支持但被遗漏”的第50型或漏验身份，缺失集合为空。可以把本观察快照中基本MVP的eligible分母准确限定为这49型，表述为“当前DEV、所列49个内建身份的指定基本配置”。

这不等于查清所有安装插件、所有租户/授权环境或历史已保存插件图表；也不把未知类型永久排除。“全部支持图表”的一般承诺仍要求在实际可用集合改变、xpack门开启或发现已保存可用插件时重新枚举稳定render/type、过滤能力并追加分母。当前不能写“installed=0”“不存在插件”或无环境限定的“产品所有图表均通过”。

原GTR-001两部分分开处置：当前DEV eligible集合的基本MVP对账可继续；**按插件身份硬拒绝的兼容规则仍是后续未闭合项**。不得把本报告当作已修复该机制或证明所有插件不支持过滤。后续由S037/S041按既有责任跟踪installed/type/能力，不为未知环境强加当前开发新插件框架。

## 独立核对方法与结果

1. 接收端复算全部9个base refs，零漂移；source_goal单独与卡绑定字节核对。读取ScopeAuthority chronology更正仅确定本报告不沿用错误“更早消息最新”结论，未把Agent审计副本充作人类批准来源。
2. 从chart.ts的CHART_TYPE_CONFIGS段读取49对render/value，与提供的palette49对render/type及静态inventory逐项集合比对，均唯一、差集为空；TypeDecisions49个type与同一集合相同，并均为`accepted_for_p1_basic_configuration`。custom三型是indicator、rich-text、picture-group。后两型在palette中hidden但仍有注册/已有P1行，不因菜单隐藏排除。
3. 按panel/index.ts:22–30的实际glob独立展开**61个**TS文件，逐文件查exported class及继承；49个导出图表子类与inventory的(path,class)集合一致。逐类构造函数默认name/super实参保留同一type；AntVAbstractChartView→AbstractChartView给antv render，直接custom类给CUSTOM，未发现render/type碰撞。未执行构造函数；当前运行可达依据是既有P1独立行及本palette记录，不把静态构造推成新运行验收。
4. 对TypeDecisions中41行带configuration.source的raw JSON pointer另行读回，摘要均相符，必要时解析request中的JSON字符串，全部wire render/type匹配本型。其余8行（flow-map、gauge、heat-map、indicator、liquid、picture-group、rich-text、symbolic-map）采用不同证据结构；本次按既有独立判定、source/target条目及身份集合核对，未把没有该pointer写成补跑成功，更未重新验收每行query/save/reopen或全物理HTTP计数。
5. xpack与插件分类加载链独立见下；pluginQuery失败保留为失败，未被重试或改写成空集合。当前没有具体插件身份、过滤能力或已保存可用插件证据，因此也没有可据以追加当前49的已证漏项。

## 插件装载gate及失败的精确含义

- UserViewGroup.vue:43–46直接使用CHART_TYPE_CONFIGS；:103–135收到分类后才以`isPlugin:true`追加条目；:201–202仅在appStore.getXpackValid为真时挂载ViewCategoryHandler。:147/:159隐藏other分类，解释49内的2隐藏项，不能因此改分母为47。
- app.ts:65–67 getter原样返回xpackValid；:76–82在await xpackModelApi**之前**设xpackValidLoaded=true，再把res.data或false写入xpackValid。故loaded=true不能独立证明请求成功、授权有效、安装完成或安装数；当前记录false只支持门关闭的实际状态，不确定关闭根因。
- api/plugin.ts:6读取/xpackModel；ViewCategoryHandler.vue:8–12调用loadViewCategory并emit；viewCategoryApi.ts:7–24读取/xpackComponent/viewPlugins，和安装盘点不是同一原始接口。
- CurrentPluginPaletteObservation记录pluginQuery `success=false / TypeError / Cannot read properties of undefined (reading 'data')`。记录没有成功响应数组、服务端安装清单或已安装计数；不能从此失败反推0。它也不包含足够证据区分未装、无授权、拦截器/传输/运行模式故障，本次不推断根因。
- views/index.vue:589–596仍按library/插件标志/prepare能力拒绝候选；useChartFilterCopyMvp.ts:212–217以实际registry及axis filter查能力。这说明“未来已核可用插件进入同一能力判定”的机制尚不能由本报告宣称完成。views/index.vue:1875–1878的插件分类门亦受xpackValid控制。

## 全部发现、处置与同类残余

| ID | 发现/证据 | 当前是否阻断49基本MVP分母 | 处置与残余 |
| --- | --- | --- | --- |
| CEI-001 | installed仍unknown；loaded提前设置，pluginQuery失败不是空结果 | 不阻断当前DEV快照49；阻断installed0或全环境全支持声明 | 将失败和unknown留在S037/S041，未来可用集合改变时重新枚举；不永久排除unknown |
| CEI-002 | 当前glob61，旧SupportedCharts.registration.scan_files60；差项仅map/filter-paste-ready.ts | 不阻断。新增类FilterPasteMapReady无AbstractChartView继承，图表子类/身份仍49 | SupportedCharts保持历史静态快照，不重写旧证据；本报告给当前61文件清单，后续刷新inventory时吸收 |
| CEI-003 | 旧MVP-COMPAT-02将plugin flag本身拒绝，当前receiver仍有插件硬门 | 不阻断这49个均非插件的指定基本配置；GTR-001机制部分不能关闭 | 未来已核应支持插件需以能力/registry审定并纳入分母，不以标志永久排除；本任务不改产品 |
| CEI-004 | 新palette观察只有时间/app/palette/pluginQuery，未含URL、构建摘要或宿主操作trace；本Reviewer禁止浏览器复演 | 本结论依卡明确提供的当前DEV观察快照，不能外推在线状态持续不变 | 保留来源上限；父Agent最终收口绑定该观察与环境/最终时点，不能写成Reviewer亲自浏览器盘点或服务端安装核验 |

没有发现当前集合重复身份、同数异型、隐藏型漏计、把legacy g2plot当当前注册、把49静态组合/2401对当新运行结果，或把完整产品0/49改成49/49的问题。本结论使用既有P1指定基本配置接纳，不改其完整产品`not_evaluated`、真实权限未验及组合未穷举上限。

尚未检查真实服务端installed目录/授权/插件API成功回包、历史插件图表持久化全量清点、其他实例/授权环境、移动端/嵌入、所有variant和2401全配对；原因分别为本卡无浏览器/HTTP/DB权限、材料未给及不属于本次分母验证。没有用未检查项虚构具体第50型，也没有把unknown当已通过。

## 逐身份集合对账

每行“同”表示当前palette、当前源码palette、注册图表子类、静态inventory与既有TypeDecisions身份吻合；不表示本次新执行该型。既有判定统一为“指定基本配置接纳”，完整产品判定仍未验。

| render/type | palette显示 | 构造类 | 身份对账 | 既有基本配置判定 |
| --- | --- | --- | --- | --- |
| antv/area | show | Area | 同 | 接纳 |
| antv/area-stack | show | StackArea | 同 | 接纳 |
| antv/bar | show | Bar | 同 | 接纳 |
| antv/bar-group | show | GroupBar | 同 | 接纳 |
| antv/bar-group-stack | show | GroupStackBar | 同 | 接纳 |
| antv/bar-horizontal | show | HorizontalBar | 同 | 接纳 |
| antv/bar-range | show | RangeBar | 同 | 接纳 |
| antv/bar-stack | show | StackBar | 同 | 接纳 |
| antv/bar-stack-horizontal | show | HorizontalStackBar | 同 | 接纳 |
| antv/bidirectional-bar | show | BidirectionalHorizontalBar | 同 | 接纳 |
| antv/box-plot | show | BoxPlot | 同 | 接纳 |
| antv/bubble-map | show | BubbleMap | 同 | 接纳 |
| antv/bullet-graph | show | BulletGraph | 同 | 接纳 |
| antv/chart-mix | show | ColumnLineMix | 同 | 接纳 |
| antv/chart-mix-dual-line | show | GroupLineMix | 同 | 接纳 |
| antv/chart-mix-group | show | GroupLineMix | 同 | 接纳 |
| antv/chart-mix-stack | show | StackLineMix | 同 | 接纳 |
| antv/circle-packing | show | CirclePacking | 同 | 接纳 |
| antv/flow-map | show | FlowMap | 同 | 接纳 |
| antv/funnel | show | Funnel | 同 | 接纳 |
| antv/gauge | show | Gauge | 同 | 接纳 |
| antv/heat-map | show | HeatMap | 同 | 接纳 |
| antv/line | show | Line | 同 | 接纳 |
| antv/liquid | show | Liquid | 同 | 接纳 |
| antv/map | show | Map | 同 | 接纳 |
| antv/multi-scatter | show | MultiScatter | 同 | 接纳 |
| antv/percentage-bar-stack | show | PercentageStackBar | 同 | 接纳 |
| antv/percentage-bar-stack-horizontal | show | PercentageStackBar | 同 | 接纳 |
| antv/pie | show | Pie | 同 | 接纳 |
| antv/pie-donut | show | PieDonut | 同 | 接纳 |
| antv/pie-donut-rose | show | RoseDonut | 同 | 接纳 |
| antv/pie-rose | show | Rose | 同 | 接纳 |
| antv/progress-bar | show | ProgressBar | 同 | 接纳 |
| antv/quadrant | show | Quadrant | 同 | 接纳 |
| antv/radar | show | Radar | 同 | 接纳 |
| antv/sankey | show | G2ChartBar | 同 | 接纳 |
| antv/scatter | show | Scatter | 同 | 接纳 |
| antv/stock-line | show | StockLine | 同 | 接纳 |
| antv/symbolic-map | show | SymbolicMap | 同 | 接纳 |
| antv/t-heatmap | show | TableG2Chart | 同 | 接纳 |
| antv/table-info | show | TableInfo | 同 | 接纳 |
| antv/table-normal | show | TableNormal | 同 | 接纳 |
| antv/table-pivot | show | TablePivot | 同 | 接纳 |
| antv/treemap | show | Treemap | 同 | 接纳 |
| antv/waterfall | show | Waterfall | 同 | 接纳 |
| antv/word-cloud | show | WordCloud | 同 | 接纳 |
| custom/indicator | show | IndicatorChartView | 同 | 接纳 |
| custom/picture-group | hidden | PictureGroupView | 同 | 接纳 |
| custom/rich-text | hidden | RichTextChartView | 同 | 接纳 |

## 准入预测与最终声明限制

没有需Builder修产品后才能继续当前49基本MVP分母对账的blocking finding。父Agent可据本报告将“当前DEV可用eligible49”与“installed绝对盘点unknown”分别进入最终文档、正确当前Goal/TSP和收口证据。是否完成当前22项、最终Dashboard/Gate或整体MVP，仍由其后续独立终态对账判定，本件不作该验收。

修复后准入预测：若只要求本观察快照49型指定基本配置，范围限定与unknown后续定位保持后即可进入终态对账；若要求installed全盘点/所有授权环境，则本输入不足，仍须成功清点和逐型能力/验收证据，不能借本报告越过。当前未知项保留责任，不新增未经批准must-have或通用框架前置。

## Read Manifest与复算绑定

接收卡与9个base refs为完整必读；额外源码读取用于重算实际glob、构造身份和插件gate。以下均为本次审阅时当前字节摘要；旧SupportedCharts内部source_refs本身是历史snapshot，不声称其80项全部仍为当前摘要。

| 路径 | 本次SHA256 |
| --- | --- |
| Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/planning/current-eligible-inventory-validation-r001-card.json | `671cfd561ebdc6260cf100999849c1387d3ae57f4eedde225ff63cdeeef8205b` |
| Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/Goal.final.json | `4db931a6764a8c48345e7e8358e579550a9bc98594bf1654647716d72b9678c4` |
| Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/planning/AuthorityChronologyRepair-20261031/CurrentPluginPaletteObservation-r001.json | `f561328b698b47eac95ba7388e036628d7900bc30fb530d94adee95d97ee19e6` |
| Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/MVP-20261027/SupportedCharts.json | `163edf6b7f0a03f99256d02bb10f77c993847513f953a3e4fc743d0500c8dec4` |
| Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/MVP-20261027/P1-actual-acceptance-r001/TypeDecisions-r001.json | `fe10930ea1a259310dc58ed362fc552a5af18bcc32b8e7d0925e59bf6896006d` |
| core/core-frontend/src/custom-component/component-group/UserViewGroup.vue | `0102cd2e3d0704020199acde84d66c9416b2a0275a1e9483ef776df61900c7e6` |
| core/core-frontend/src/views/chart/components/editor/util/chart.ts | `dc7e5d0cf659863e56b30fb24ac757c64e61cad8a6875e93f67bcc7aef999548` |
| core/core-frontend/src/store/modules/app.ts | `6454ff42a6ac42bb66f2aab35370059291e2caafd5229da185d193ce77576eac` |
| core/core-frontend/src/views/chart/components/js/panel/index.ts | `4cc0f5c25718d030c4b6b5e1607b8fa4cae0c80142c4a464087ab411c9cb7ac5` |
| core/core-frontend/src/views/component/plugins-handler/viewCategoryApi.ts | `6a2ab78a673f6878c1a43e75e030dd74a0adec7b33b2ea15cb95ad7ed760abe8` |
| Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/MVP-20261027/reviews/GoalTspReview-r001.md | `23765aaadabd73c16f9a912a2d2bbb47fe7b09ebea4353cb0b3fb79cf1facb57` |
| Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/planning/AuthorityChronologyRepair-20261031/AuthorityChronologyAudit-r001.md | `4766a62b78ecfa91a23835e0d5a875f018d4a5afe3738e9a541b7174f75abf40` |
| core/core-frontend/src/views/component/plugins-handler/ViewCategoryHandler.vue | `2cf0ad9bae7f74d4c3ef50896099e046ab731b3b49a65c6ad469936b7a8e87bd` |
| core/core-frontend/src/api/plugin.ts | `7446ef5e22451261fa49256954c742ff2ab51da1bfb93475ce6d2f330512ed86` |
| core/core-frontend/src/permission.ts | `4eb7df67800cfbe0e577d6d4fec67be5f24ce178c8119d35552842f3d791f46b` |
| core/core-frontend/src/components/plugin/src/PluginComponent.vue | `47661fbce5dbeac715bd7ee24854a140c357eb468e7460f9de77e14838722cfb` |
| core/core-frontend/src/views/chart/components/views/index.vue | `dd88f2ac4f7c5e35f0b07822c72cae0764a3bad11be4a19f23a86d9fb9de3c7b` |
| core/core-frontend/src/views/chart/components/editor/filter/useChartFilterCopyMvp.ts | `b760fffb47db4a8a187cc3dc996d6ddffb5f2b187038da625c5c8e0839d87e5d` |
| core/core-frontend/src/views/chart/components/js/util.ts | `e1face5c92466a2685bb6b27d08823c9c19159238ff9ca5406b43c21a39de797` |
| core/core-frontend/src/views/chart/components/js/panel/types/index.ts | `a9214afb421b3dbd8ab07c5721157ab48d97ca2e68d932e947838ab736b3581f` |
| core/core-frontend/src/views/chart/components/js/panel/types/impl/g2.ts | `9d05f16bd7ddf33b55ee0f8022d5bcc9073189f80fdda9a9712bf5544b0f71d9` |
| core/core-frontend/src/views/chart/components/js/panel/types/impl/s2.ts | `61ee6816617821007e0442386a08957a44d0c6ebf604473437f71f5ed677d5bd` |
| core/core-frontend/src/views/chart/components/js/panel/types/impl/l7.ts | `94f1e0e47f05b09588bc71818ece4bb284f412fa0afb333b2614e513dd611414` |
| core/core-frontend/src/views/chart/components/js/panel/types/impl/l7plot.ts | `e63a044bbc5dca7bc07f645faf3df5684f8de8c545339f87fa0ce8978718d6cc` |

当前panel注册glob全量61文件（只读展开，未执行模块/构造函数）：

| 文件（相对panel） | 本次SHA256 |
| --- | --- |
| charts/g2/bar/bar.ts | `a66b6f5f6681759b86b639f69e29489fe18da391c25ce2eb012a350eaca0e14f` |
| charts/g2/bar/barUtil.ts | `8f6ee3ea38be94aac8e748bb10a1b194988cd408cfa2bd8619593e8fa59a02ff` |
| charts/g2/bar/bidirectional-bar.ts | `53fa36fa169dce1b5abe7267131cb152b6a053bde058018f255e9c71d825decb` |
| charts/g2/bar/bullet-graph.ts | `e42033748ec98acf0a4dc44c8b76bf3583a2d74ba2efd48298f2489fb06d76e8` |
| charts/g2/bar/group-bar.ts | `9f96ce22e42a27a127989bb788670c6bfcae87161a870209815518f5e74d35d0` |
| charts/g2/bar/group-stack-bar.ts | `437a9aadf1a3d76bbb82241940b4ed4d500eed69adce9c1a27c6b19fe2ed5f45` |
| charts/g2/bar/horizontal-bar.ts | `5a27d749f3334a5f415f3ef8d7638bc956067caf8c0e1bbaa067d3e3fee61131` |
| charts/g2/bar/percentage-stack-bar.ts | `9f428e2abd36e5061d1ddc8e2b50ac5a50cdc7215afb5310fb9dad0422d925a9` |
| charts/g2/bar/percentage-stack-helper.ts | `97030cbc5a01244c29846d3cb8f7994bdd9d7546f14d50683a0930dd30998dd8` |
| charts/g2/bar/percentage-stack-horizontal-bar.ts | `dc5fcb1e2adbcb353f65ed7bd6d2c94852074e5548a28fceb2ec2fc8a40ba007` |
| charts/g2/bar/progress-bar.ts | `ae6265dfb4b42980e44472373a6fa690c816a6a1433a55afa6b942c84981f6bc` |
| charts/g2/bar/range-bar.ts | `8b848e9567b77645d9dd6da99e4f9014fe0f1500a4faa8cd5dfcc219c2a5cdac` |
| charts/g2/bar/stack-bar.ts | `53a5afc125ecaf46f98ecb3da712c093fea5eb82a9654e9ed3b21d080fb6bde7` |
| charts/g2/bar/stack-horizontal-bar.ts | `822a48bfbaf889c74f00577c8f48123081119d49bc143082ffcb076c99cf3122` |
| charts/g2/bar/stock-line.ts | `fbbc31c1f88c5a7999940d7ed798542d0e158d0eaddedd40de1d848e8322a413` |
| charts/g2/bar/waterfall.ts | `07e1454c49d2b106fc7bd1595066abfe3b60df723b0c6e2491f3533d084f586e` |
| charts/g2/distribution/box-plot.ts | `d38e31de075fb0d19761342f0dbcf5d6a071d0384e335b8310a116674b7c73ca` |
| charts/g2/distribution/radar.ts | `9d35493ce5b8151827a571d2937324e1c35b7dd332202ca849979cdeaeff764b` |
| charts/g2/distribution/treemap.ts | `574ae8283d34d799b43b9508d3ebae7049346e3c3edc07c336ab43c3c507c0bc` |
| charts/g2/distribution/word-cloud.ts | `048a4b7e34d38a4da21dbfe0222e69afcbdf95767f88174878cfca7a0aed1712` |
| charts/g2/line/area.ts | `87e5ece6ff557495579cbb064b293d4c2e4db86c7ef3f1d4caf2533b009c269b` |
| charts/g2/line/line.ts | `acacb1ae0fde128a1cb894f06ce073454da04205e9225633168e5f67cc8b4311` |
| charts/g2/mix/mix-dual-line.ts | `c129715e801041474c80a63fdcd43f4d7146c290475d7a2f876c33f2b99603a1` |
| charts/g2/mix/mix-group.ts | `da3889119ac1faf832fad52fbee1a869ca75abc988fb7fa54a0f62534b386c1b` |
| charts/g2/mix/mix-series.ts | `d1a187386d7906d9248e492b4f7231695610285a11d0488388d3315d9235057a` |
| charts/g2/mix/mix-stack.ts | `901d4a3c663bbad18cc351367912068c9ebce98eb1fb9d2269b88238959ffe74` |
| charts/g2/mix/mix.ts | `ecff3739c94ee15f5fdd381dc686c695319da95f21fc77a95dcba780c587b46c` |
| charts/g2/mix/tooltip-category.ts | `98a068ee2138269b85531144c9f6d56602bc35a806e2c325dba83dd2efe0caf1` |
| charts/g2/numberic/gauge.ts | `592a2f74afa4ce3f947eef38ccd2966b4cd99045a099c3b4b2a48e1576e425d6` |
| charts/g2/numberic/liquid.ts | `f02e15b15542293a10886529382f11d87c6f815f3ce71d61b26570f22544ae24` |
| charts/g2/relation/circle-packing.ts | `0beb2f8f7625c50654e7a798c0906c85ab23bfd3846a52ae5db837d15b37307f` |
| charts/g2/relation/funnel.ts | `9f0a7f013fdd4a71bda9da26c6b7abe46bc686c947dd7d86df9673e3b5b3a4fa` |
| charts/g2/relation/pie/pie.ts | `b661e523b0ba8ca6354c9b94000f7de426d1df075cb6a0f26a19127a759b935c` |
| charts/g2/relation/pie/rose.ts | `17dbd2759a09040fa35d0082895c754873faf09d1fc33d0f5cbfbfd228d6014f` |
| charts/g2/relation/pie/text-overflow.ts | `14a9e39e5aaf378b865305b1a1dd198385b7155413fc28303bbc6205f6cdf7d0` |
| charts/g2/relation/quadrant-bubble.ts | `25413595a013a448ae4389f4f22c404e7c19ca50d88583573f124ed8b41fbb68` |
| charts/g2/relation/quadrant-range.ts | `603388bcebe7e6bfd80d1f38d46d9362085c787890490ef3bf2030e417f2ac70` |
| charts/g2/relation/quadrant.ts | `d4699193ea9cb4e98f3458c9663ed7a71cd43f4dad9f8666eb7b47b406476628` |
| charts/g2/relation/sankey.ts | `0a8e4d1d7876aa8670e7ae5d86b4155131cd86f742c16455485e74a4caae157e` |
| charts/g2/relation/scatter-multi.ts | `7398414d810640f456317f043f4b316a00005f78e2a6b0f58777b54e71911c05` |
| charts/g2/relation/scatter.ts | `d86162ef9601655637a45bc29f2d171dfa68a4a620bc52d6f943d0e19d628224` |
| charts/g2/table/heatmapLegend.ts | `9cb654e371e2e330b3c32a771a72e0dc5d9e2298173c3097acdc70b664dcfb58` |
| charts/g2/table/t-heatmap.ts | `38fbd791d675828d7cf6717c439cc34109e08a144b2bd529e4574117e7b0ff31` |
| charts/map/bubble-map.ts | `29f3d1d86d49563d4ad0bc1c385c242267000c066d5a4c13441520c7af797f04` |
| charts/map/custom-online-map.ts | `95911584b89e1a2eab87ad546d5faa1cdfc7861a5a7de377351b32a3286168da` |
| charts/map/filter-paste-ready.ts | `71ee524fe26eba795c9d34ed70ea124b4132f198940b287fc2f77e99054b9dcb` |
| charts/map/flow-map.ts | `cd6b2233c83fc19ab04b0a3262b44f26ff5934bad7915969586700eebfc71d1b` |
| charts/map/heat-map.ts | `1b09b6330c31e235923464b75665b814cebe0832a3b9fa3582aaf1279c60c563` |
| charts/map/label-layout.ts | `863951d9dbdb6ce0f74ff922a2629572379c1b013d5f8141ff516dbc24d1ec3f` |
| charts/map/map.ts | `5eeb33eeff060e1a25e48eaa8d836d9e8985c63bfa2ed9d70b513244420c6c12` |
| charts/map/mapLegend.ts | `681d63b92c9c9d5987bf4b8999db3b07bff466586b992ffa9f7f8ba447f4e650` |
| charts/map/point-fallback.ts | `b2a3c4614defacd6e79ca2d9faccc7513781c020e4ba16fbccfe5da3e5593e7e` |
| charts/map/symbolic-map.ts | `b5f7235ea6cc373b9fce47b0c95ce09e95f61ff45d6174d759156eb36a97c826` |
| charts/map/tooltip-carousel.ts | `a061a87a3ce6554c6fa25522cb747897fc4bfc3247f6f36a2f95ac655b7481bd` |
| charts/map/tooltip-position.ts | `10feaf166bacec185f6055eb3d2731d692635fd1986013b4fdb39bbd8bc347ca` |
| charts/others/indicator.ts | `795c928d7e8d620a3476bdbfb4901a021110b314326d9a401d01e711929c382a` |
| charts/others/picture-group.ts | `684ab8e2d145032385a641f322c078dfef41616cf72d2b743d3b7aa5c29ca4ef` |
| charts/others/rich-text.ts | `8f32cf62091ef7fd131f392fcc18ba1105cd049aacc2afaf294ffcbb12e626bf` |
| charts/table/table-info.ts | `a1bdb6d00b5d94730b1c889b3e6d50f2d4e3e83a8b81e0016af8652d5041e200` |
| charts/table/table-normal.ts | `871c996326fcd319596fd3d09d0f029f3d8c3125f388011f1d316f8a8d75c4ab` |
| charts/table/table-pivot.ts | `9a8950d42b449438cbf104784cc435bc892b1e7aa7a18c4f1c9b0272b3b7c95a` |

读取辅助脚本诊断保留：首个configuration pointer读回脚本遇request为字符串时出现AttributeError；随后按实际JSON字符串解析后41项匹配。另一次扩读脚本对部分行不存在的independent_review键出现KeyError，未据此作产品判定；该8行明确沿不同既有证据结构核对。以上均为只读解析错误，不是产品测试、RED或产品失败，未用恢复结果覆盖初始诊断。
