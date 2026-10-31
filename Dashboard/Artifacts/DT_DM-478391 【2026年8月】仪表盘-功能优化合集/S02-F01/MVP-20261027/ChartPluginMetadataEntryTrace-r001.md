# 图表插件元数据入口追踪候选 r001

- recorded_at：`2026-10-30T15:46:13.054691+00:00`；source/researcher：`/root/bubble_ready_validator_resumed`。
- 设计候选，未独立验收、未执行probe；唯一输出为本trace与`ChartPluginInventoryProbePlan-r001.json`。
- card canonical SHA `e64df7fbe1d9908b6794a6e1bb00fe0beba68da29979a25c94f07b97bf46511c`，接收及写前validate pass，render和落盘prompt已消费；Goal+9项refs共10项摘要匹配。

**公开前端已证实两个GET元数据调用点：`/plugin/query`和`/xpackComponent/viewPlugins`。SDK只给方法后缀，允许范围内没有找到对应实现类，因此实际class prefix、运行Bean和可达性仍unknown。当前安装数继续null/unknown，不推成0。**

本轮只读取公开main/SDK源码并写两个候选；未发HTTP、未操作UI/DB、未安装/更新/卸载插件。原49内置分母、0/49完整验收、38义务（P1=12/P2=26）、真实权限BLOCKED/NOT_RUN继续。RuntimeUiProgress-r009.plugin_installed_count原为null，本轮未修改。

## 入口证据及路径置信度

| 入口 | 公开源码可确认的事实 | 尚不能确认 |
| --- | --- | --- |
| 管理页metadata | `views/menu/setting/plugin/data.ts:13`的loadPluginApi()明确GET `/plugin/query`；管理页使用res.data，flag分类含view；SDK PluginApi.query只声明GET `/query`、返回List<PluginVO> | SDK接口无class RequestMapping；公开core/SDK找不到PluginApi实现，不把预期class prefix `/plugin`说成已读到控制器事实；运行完整性/许可过滤/权限过滤未知 |
| 图表类别metadata | `viewCategoryApi.ts:17`明确GET `/xpackComponent/viewPlugins`；SDK XpackComponentApi声明 `/viewPlugins`；VO有chartValue/render等类别字段 | 实现class prefix和实际绑定未知；不是安装包列表，也未证实该HTTP实现直接调用公开factory |
| 普通API全局prefix | CorsConfig为io.dataease包下RestController增加AuthConstant.DE_API_PREFIX=`/de2api` | 这是全局规则，不补出缺失实现类前缀。`/de2api/plugin/query`及`/de2api/xpackComponent/viewPlugins`只可记组合预期，不能记当前运行可达 |
| xpackModel | RestIndexController无额外class prefix，GET `/xpackModel`；DeIndexManage公开默认返回null并允许XpackInteract替换；appStore将res.data或false缓存 | null/false、未请求或门关闭都不是installed=0；不探许可内容、不读替换实现 |
| OpenAPI | application.yml只在70–77行确认 `/v3/api-docs`；SwaggerConfig声明6-xpackbase、7-xpackpermission等扫描组 | 活跃配置/Bean/路由可达性未观察；组名称不自动证明实际URL；Springdoc控制器不由io.dataease RestController前缀规则直接推出/de2api路径 |

`core/core-frontend/src/api/plugin.ts`的loadPluginApi(key)是contentPlugin内容加载，与管理页同名loadPluginApi()不同；它和pluginStaticInfo属于禁止probe的资源入口，不能误拿内容加载API当安装metadata查询。

PluginVO允许安全投影id/name/flag/version，id有字段级ToStringSerializer；它没有type。XpackPluginsViewVO可投影chartValue→type，但id为普通Long、没有同样字段注解；运行JSON中遇到unsafe number不能String()后假称ID精确。icon/staticMap均不读取或输出，不读取js/svg资源。一个安装包与多个chart type的关系及两套VO.id是否同一身份域，公开契约未说明，禁止直接join/相加计数。

## installed、loaded与eligible必须分开

- **installed**：管理API实际返回的安装metadata记录及其当前身份可见范围；本轮未请求，total仍unknown。即使将来返回空数组，也应先写“本接口本时点返回0条”，在完整性/授权范围未证实时不能写全环境installed0。
- **advertised/catalog metadata**：viewPlugins的chartValue，或已挂载wrapper的chartConfigs里isPlugin节点。它们只说明类别metadata被接口返回/进入当前page，不证明插件renderer或后端实例加载。
- **loaded**：后端工厂、前端模块、active组件是三个层。公开PluginsChartFactory按render_type保存加载对象，getViewConfigList有功能门检查；不代表公开HTTP方法已证实绑定到它。ChartViewManager只eager注册本地四类目录、提供register/get而无公开全枚举；不能用其静态内置注册推插件总数。
- **eligible**：必须回到原支持范围和完整copy/paste/字段/权限契约。当前views receiver显式排除view.isPlugin或view.plugin.isPlugin，说明当前实现接线缺口；**不能据此删掉原应支持插件，或把eligible要求数直接定为0**。

wrapper的ViewCategoryHandler受getXpackValid、pluginLoaded、view.isPlugin门控；appStore在请求前设置loaded标志、null/false又映射false，前端没加载不代表后台未安装。pluginLoaded本身逐分类覆盖result，且类别追加是局部UI实现，不能拿其单布尔当完整registry盘点oracle。此次只记录这一解释上限，不顺带实现修复。

## 正常Axios/HMAC的只读probe候选

机器可读细节见 [probePlan](</Users/xiaomei/Documents/projects/dataease/Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/MVP-20261027/ChartPluginInventoryProbePlan-r001.json>)。本轮所有步骤NOT_RUN；后续有明确执行范围时可优先使用当前已初始化主应用的**同一个**`@/config/axios`请求链：

1. 正常管理GET `/plugin/query`一次，仅内存投影白名单，不挂载安装/更新UI，不调用任何POST。
2. 正常GET `/xpackComponent/viewPlugins`一次，同样只投影id/name/type；不用带缓存/队列且无明确错误回退的loadViewCategory()刷新UI，不调用loadPluginCategory()写registry/view。
3. 可选只读现有已挂载chartConfigs的isPlugin节点，逐条投影type/name；不序列化整个节点、不读取icon/staticMap、不反射私有CHART_VIEW_MAP、不触发动态组件加载。若现有模块/变量不可取得即unknown，不为盘点新增初始化。
4. OpenAPI仅在实际正常同源路径与签名语义已证实时读取相关GET path。当前配置证据不足以释放此步骤，计划保持BLOCKED_APPLICATION_ROUTE_NOT_ESTABLISHED。

正常request经过service的configHandler、securityConfig、原有语言/分享/嵌入/代理上下文，不复制或输出凭据、不新建axios、不手写签名、不把window.AxiosDe默认等同既有拦截器。必须显式要求code0+数组形状；50002/60003等即使wrapper有特殊处理也不能当成功安装盘点。401/403/404/null/异常/门关闭一律unknown或不可达，不记0，不循环猜前缀。

**OpenAPI有两层实际障碍。** 第一，service默认只接受业务code，原生OpenAPI JSON无code会被当失败；若已有合法正常路径，可复用现有service的responseType=blob分支在内存解析JSON，只输出相关path/method，不下载或记录整份schemas/examples/安全配置。第二，dev代理`/api/f`会去前缀到后端根，而HmacTool把所有`/api...`归一为`/de2api...`，所以`/api/f/v3/api-docs`的签名路径会成为`/de2api/f/v3/api-docs`。不能据此宣称root docs已经可用，也不能改HMAC/关闭鉴权来补。正常`/api/plugin/query`则与普通/de2api API前缀模型一致，但实际controller是否存在仍待真实GET确认。

所有raw响应只在内存作schema验证和白名单投影，不读取或落盘icon/svg/staticMap/js/许可字段，不记录headers/cookies/token/完整错误msg。已知GET返回非JSONmetadata/HTML/资源载荷则停止，不eval、不显示、不下载。**不调用contentPlugin/pluginStaticInfo，即使它们是GET。**

## 阻塞、未知与最小后续

- **拓扑投影问题**：card.rebaseline_ref引用的Topology-actual-r552描述pre_runtime_empty_network_frozen/空包driver，未列本plugin只读design lane。源码事实仍可作为candidate，但不能声称本lane实际topology已绑定；后续probe须用匹配任务的入口记录，不能倒填旧快照。
- **入口实现阻塞**：不读XPack实现的边界下，公开main/SDK没有PluginApi/XpackComponentApi实现class prefix；应保持未知，可用已证实前端调用点的一次正常GET获取运行事实，不猜多个路径。
- **安装完整性阻塞**：未请求、未确认当前身份/功能门下的完整返回范围；空结果不能自动释放全局installed0。
- **类型关联阻塞**：PluginVO没有type，view VO是另一类metadata，包→类型映射及精确ID关联未证实；49不能与任一列表长度直接相加。
- **OpenAPI应用路由阻塞**：配置路径已知，当前正常同源Axios/HMAC可用的docs路由未证实；不通过猜URL或修改代理/签名扩大本轮。
- **eligible执行缺口**：当前接收器排除插件，未来若metadata发现应支持类型，应反馈具体scope/oracle差异给主Agent，不静默把这些类型移出分母。

最小后续是有界执行上述两个已证实前端metadata GET，各保留时点/路径/状态/业务码/schema和白名单结果，失败立即保留unknown；安装权威总数/类型完整性仍需相应公共契约与运行证据。此建议是candidate，不是本轮已执行或接受。

## 已查无问题、未查原因及读取边界记录

已查：10绑定refs摘要、两个同名API区别、SDK字段/方法后缀、公开全局prefix、OpenAPI配置/分组、正常Axios及raw JSON分支/HMAC路径归一、前端类别加载/门控/内置registry、当前插件guard；证据足够产出候选，不能产出实际盘点。

未查：de-xpack实现、实际插件js/icon/svg/许可内容、真实HTTP/UI/DB、安装/更新/卸载、当前loaded/active实例与真实权限；均由明确边界排除。源码默认配置不能代替当前运行状态，未启用任何插件或修改任何状态。

读取范围偏差如实保留：一次rg范围过宽命中backend生成static/assets/chunk，另一次配置定位带出相邻非目标配置行；已停止该范围读取，未把生成JS或相邻非目标内容作为证据、复制到产物或继续追踪，后续仅公开src与精确springdoc片段。未读取de-xpack路径。不得把这次记录写成“从未命中过生成物”。

## 源码锚点与摘要

以下仅为公开源码，application.yml仅使用springdoc配置行；完整文件SHA用于漂移检测，不复制相邻配置内容。

| id | 入口 | SHA-256 |
| --- | --- | --- |
| `management_client` | [data.ts](/Users/xiaomei/Documents/projects/dataease/core/core-frontend/src/views/menu/setting/plugin/data.ts:13) | `16d750681efcb48da1efc9567eab3a374bac0a0e88864c6a3cb87cb6067bbd95` |
| `plugin_api` | [PluginApi.java](/Users/xiaomei/Documents/projects/dataease/sdk/api/api-base/src/main/java/io/dataease/api/xpack/plugin/PluginApi.java:18) | `b37faeaec3b8443c668649baf82b7b1d74bcdf7eb6453f45a2870c8b8a807af8` |
| `plugin_vo` | [PluginVO.java](/Users/xiaomei/Documents/projects/dataease/sdk/api/api-base/src/main/java/io/dataease/api/xpack/plugin/vo/PluginVO.java:20) | `779dd83e89168b98e7c92d5abe999c0994242fe795176f1fb1d62a058ca8e9ee` |
| `view_client` | [viewCategoryApi.ts](/Users/xiaomei/Documents/projects/dataease/core/core-frontend/src/views/component/plugins-handler/viewCategoryApi.ts:7) | `6a2ab78a673f6878c1a43e75e030dd74a0adec7b33b2ea15cb95ad7ed760abe8` |
| `view_api` | [XpackComponentApi.java](/Users/xiaomei/Documents/projects/dataease/sdk/api/api-base/src/main/java/io/dataease/api/xpack/component/XpackComponentApi.java:20) | `786a1193f48797d5a5c1c6e2b78961a9c577a7501d2b8e2fc523146ce49d9b5b` |
| `view_vo` | [XpackPluginsViewVO.java](/Users/xiaomei/Documents/projects/dataease/sdk/extensions/extensions-view/src/main/java/io/dataease/extensions/view/vo/XpackPluginsViewVO.java:14) | `9d81b9881fbc834af00c1094d6c3ee944af8c14fad690c13f6b98a0c107047c6` |
| `backend_loaded_factory` | [PluginsChartFactory.java](/Users/xiaomei/Documents/projects/dataease/sdk/extensions/extensions-view/src/main/java/io/dataease/extensions/view/factory/PluginsChartFactory.java:17) | `29da74b0c823afa5eaa0b6d88ed29aae8634ef4d4ed1b1dc4462047eefce91f5` |
| `controller_prefix` | [CorsConfig.java](/Users/xiaomei/Documents/projects/dataease/sdk/common/src/main/java/io/dataease/auth/interceptor/CorsConfig.java:30) | `342b726370e92b82d5b6803c04096581b7a6b27cb39ed7c16e42a71b5a2858ed` |
| `api_prefix_constant` | [AuthConstant.java](/Users/xiaomei/Documents/projects/dataease/sdk/common/src/main/java/io/dataease/constant/AuthConstant.java:14) | `55ee29fdd2629cc48f0fd8d5a72287e6959b92e2e7cbe9e80e399f03838a9fa9` |
| `openapi_config` | [application.yml](/Users/xiaomei/Documents/projects/dataease/core/core-backend/src/main/resources/application.yml:70) | `048d8ce4943011224b33b698ff11c0e74e568ee08ba15232f3a78255f63e6d73` |
| `openapi_groups` | [SwaggerConfig.java](/Users/xiaomei/Documents/projects/dataease/sdk/common/src/main/java/io/dataease/doc/SwaggerConfig.java:53) | `09cfdfe488050fff3d7c51ea9240b44948642c9ea66f74c096246555019daf01` |
| `registry` | [index.ts](/Users/xiaomei/Documents/projects/dataease/core/core-frontend/src/views/chart/components/js/panel/index.ts:4) | `4cc0f5c25718d030c4b6b5e1607b8fa4cae0c80142c4a464087ab411c9cb7ac5` |
| `type_shape` | [index.ts](/Users/xiaomei/Documents/projects/dataease/core/core-frontend/src/views/chart/components/js/panel/types/index.ts:29) | `a9214afb421b3dbd8ab07c5721157ab48d97ca2e68d932e947838ab736b3581f` |
| `category_merge` | [index.vue](/Users/xiaomei/Documents/projects/dataease/core/core-frontend/src/views/chart/components/views/index.vue:1552) | `dd88f2ac4f7c5e35f0b07822c72cae0764a3bad11be4a19f23a86d9fb9de3c7b` |
| `category_gate` | [index.vue](/Users/xiaomei/Documents/projects/dataease/core/core-frontend/src/views/chart/components/views/index.vue:1874) | `dd88f2ac4f7c5e35f0b07822c72cae0764a3bad11be4a19f23a86d9fb9de3c7b` |
| `plugin_eligibility_guard` | [index.vue](/Users/xiaomei/Documents/projects/dataease/core/core-frontend/src/views/chart/components/views/index.vue:589) | `dd88f2ac4f7c5e35f0b07822c72cae0764a3bad11be4a19f23a86d9fb9de3c7b` |
| `app_gate` | [app.ts](/Users/xiaomei/Documents/projects/dataease/core/core-frontend/src/store/modules/app.ts:76) | `6454ff42a6ac42bb66f2aab35370059291e2caafd5229da185d193ce77576eac` |
| `model_null_default` | [DeIndexManage.java](/Users/xiaomei/Documents/projects/dataease/core/core-backend/src/main/java/io/dataease/home/manage/DeIndexManage.java:7) | `c19466a04b27d7fd25ee5e2c242939d5325806c88d79fa7b22fef60ed810b2f4` |
| `model_controller` | [RestIndexController.java](/Users/xiaomei/Documents/projects/dataease/core/core-backend/src/main/java/io/dataease/home/RestIndexController.java:42) | `e5c9a73015036c8d9f3fcf96471a071495ba7e5a26f3f25c55e0e47a217ff429` |
| `bridge` | [PluginComponent.vue](/Users/xiaomei/Documents/projects/dataease/core/core-frontend/src/components/plugin/src/PluginComponent.vue:116) | `47661fbce5dbeac715bd7ee24854a140c357eb468e7460f9de77e14838722cfb` |
| `request_wrapper` | [index.ts](/Users/xiaomei/Documents/projects/dataease/core/core-frontend/src/config/axios/index.ts:7) | `ca376ed57a3e04de177eb37883d8bf61bba6d7a9925f4a85a30b9ba99c4d3038` |
| `request_service` | [service.ts](/Users/xiaomei/Documents/projects/dataease/core/core-frontend/src/config/axios/service.ts:109) | `5651f057658c8dd25adbcc73c7625f06834074069e6a5342cd92beb07f7d1f7c` |
| `raw_json_handling` | [service.ts](/Users/xiaomei/Documents/projects/dataease/core/core-frontend/src/config/axios/service.ts:186) | `5651f057658c8dd25adbcc73c7625f06834074069e6a5342cd92beb07f7d1f7c` |
| `signing_path` | [HmacTool.ts](/Users/xiaomei/Documents/projects/dataease/core/core-frontend/src/views/tools/HmacTool.ts:96) | `2b0498fb26969ce4bf7da82b59b550a2853718452024a0ba2de2637b5fc831fe` |
| `dev_proxy` | [dev.ts](/Users/xiaomei/Documents/projects/dataease/core/core-frontend/config/dev.ts:3) | `155016a0562e33ec82ec4985816fbf40773568ba2468d7b386a8a7a606fcdb2d` |

候选设计交付到此；所有实际盘点数与运行可达性保持unknown。没有独立验收、MVP或Goal完成结论，也不重开原负向三轮预算。
