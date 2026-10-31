# 本地测试底图环境方案独立审查 r001

- reviewed_at：2026-10-29T10:59:48.621922+00:00；reviewer：`/root/resource_environment_reviewer`。
- 本环境交付物设计审查第 **1/3** 轮，与Bubble、C234、图片各自预算分离。
- 卡canonical SHA `143425e3879ed7a0cd702b143b3f7205733a647fbf6956dfab9d3e50de24d775`；接收端验证exit0/PASS，Goal+4 base refs共5项摘要入口及写前复验一致。
- 用户批准“允许准备并配置本地测试底图”已由任务与计划明确承载，本报告不重复要求相同授权。以下阻断是实际实现与回退方案不一致，不是因缺用户许可而暂停。

## 双裁决与最小可行入口

**Design Freeze Validity：PASS WITH FINDINGS。Implementation Entry Readiness：分阶段裁决；文件准备PASS，持久配置BLOCKED。Overall Verdict：BLOCKED（当前完整环境配置方案尚不可直接保存）。**

同源MapLibre v8内联经纬网格方案适配现有customTile/vector路径，可在相应精确写入准入下新增并自检唯一fixture文件，不需要商业key、外部地理数据或替换renderer。**持久保存前需解决两个阻断：空原配置无法从同UI恢复；custom查询投影隐藏原始字段，不能凭UI空就认定无配置会被覆盖。** 它们不阻止继续准备/读取网格文件等独立工作。

## 已核实的保存范围

前端`saveMapKeyApi`实际POST `/sysParameter/saveOnlineMap`；UI自定义分支提交完整mapEditor并将key/securityCode置空。后端`SysParameterManage.saveOnlineMap`是事务操作：

- 写`customTile.map.`下11个字段：serviceType、tileUrl、styleUrl、tileScheme、tileSize、tileMinZoom、tileMaxZoom、tileAttribution、styleAttribution、tileAttributionEnabled、styleAttributionEnabled。
- 另外清空`customTile.map.key`与`customTile.map.securityCode`。
- 最后写全局`map.mapType=customTile`。
- **不写**高德`map.key/securityCode`、天地图`tianditu.map.*`、腾讯`qq.map.*`凭据；不能把“全局切换”误解为“所有供应商凭据均被覆写”。

`saveMapSetting`按pkey查找/新建CoreSysSetting，并保存非null字符串；空字符串会真实写入，不会被JpaUpdateNonNullAspect当null忽略。CoreSysSetting实体没有本图表/Session限定，管理查询也没有这些条件，故这是**整个当前隔离实例的在线地图配置**，不是只影响flow/heat/symbolic三个测试组件。其他已打开客户端或其它入口可能继续缓存旧mapStore，需在执行说明与后续读回中如实区分。

## 全部阻断发现

### LBM-R1-B1｜P1：计划承诺的空配置UI回退不可执行

计划以“gaode空key且custom为空”为可直接保存情形，并说恢复只通过同一UI。实际`OnlineMap.vue:284`：非custom的canSave为`!!mapEditor.key`，原gaode空key时保存按钮禁用，无法把全局类型保存回原空高德状态。custom分支则要求合法styleUrl或tileUrl；也不能把新custom恢复为原空配置。切换下拉框只查询、不会持久切回全局mapType。

后端非custom路径允许显式空字符串并更新全局类型，但这只是源码能力，**不代表所承诺的UI回退已经存在**；不得伪造临时key绕UI，也不能把浏览器表单显示gaode当作数据库已恢复。

**修正要求**：保存前明确一个当前确实可执行、精确到受影响键、可读回核验的回退步骤，并与已有用户授权和写域一致。若采用现有正常后端API完成UI不可表达的空态恢复，应在新计划写清认证入口、payload、全局mapType恢复、空/缺失/默认字段语义和校验；不绕鉴权、不改产品UI、不直接删除数据库行。若要求字节/行级完全恢复且API做不到，则采用另有明确准入的私密原始备份/恢复手段，或保持该配置入口未执行。不能继续承诺“只通过同UI完整恢复”。

### LBM-R1-B2｜P1：UI空字段不能证明被覆盖的custom原始配置为空

`SysParameterManage.queryOnlineMap:109–112`会先将legacy custom key JSON展开到custom字段，然后**无条件把返回的key/securityCode清空**；前端normalizeOnlineMapConfig也再次清空。查询还会跳过空白字符串并补默认字段，不能反映原始键是否缺失/原始空值。保存custom又会覆盖11字段、清空上述2个原始字段。

所以“切到custom看key/securityCode为空→没有秘密或旧配置→只存无秘密前态”是不充分的。UI展现相同并不代表底层原值相同；原始custom key可能保存legacy配置，securityCode也被隐藏。即使保全有效styleUrl，也未必保全被清空的原始载体。

**修正要求**：在配置写入前，完成对所有将覆盖的14个键（13个custom字段+全局mapType）及其存在/缺失状态的精确私密保全，或用可信只读检查确认原始custom确实为空且保存的回退语义足够。秘密保存在明确本机私密目录，文件0600/目录0700，证据只写路径、摘要、字段存在/空的布尔结果，不输出原始URL/token。不要读取无关配置或其他供应商秘密。若已有custom配置，应有可复现恢复方式；不能只记截图或经过normalize的UI投影后声称完整保全。保全失败则该保存入口停写，其他独立工作继续。

## 非阻断发现与执行条件

1. **LBM-R1-N1：全局影响应明确。** custom保存只覆盖自身字段，但切换整个隔离实例的active provider。执行前再次核当前localhost实例、原mapType和未发生并发配置漂移；保存后从正常页面重开读取，记录当前provider与custom字段。不要覆盖保存期间别人变更，不能凭本方案把其他客户端等同测试画布。
2. **LBM-R1-N2：保全图像不得夹带秘密。** OnlineMap的key/securityCode使用普通输入框，旧URL也可能带token。前态证据以脱敏布尔/摘要为主；完整前态只进私密备份，不保存含凭据的全屏截图到Dashboard。网格配置保存后的无秘密截图可记录。计划要求“前后截图”不能覆盖其“不输出秘密”约束。
3. **LBM-R1-N3：预览可保存不等于渲染已成功。** canSave只检查配置格式；OnlineMapCustom异步fetch/渲染错误不反向禁用按钮。因此“实际看到网格且无资源错误再保存”是必要执行检查，不能以按钮启用或HTTP200替代。style-r001文件目前不存在，JSON解析/MapLibre实际渲染均尚未发生。
4. **LBM-R1-N4：同源及缓存边界。** `/s02-test-basemap/style-r001.json`在7070 Vite根路径可作为同源资源；它不自动保证8100主页面、其他base path、分享/嵌入入口也能加载。custom-online-map以styleUrl缓存Promise，新fixture文件应不可变；同URL改内容可能继续用缓存，不应覆盖已冻结不同字节。此fixture仅承诺当前本地入口，不部署。
5. **LBM-R1-N5：追踪字段沿用了Bubble身份。** 本卡topology.task_id仍为bubble-map-ready-review-r001、rebaseline_ref仍指此前r505。输入/输出槽及标题已明确是新底图第1/3，本审查不因此重计Bubble。执行admission前应绑定本环境交付的实际topology、context和target，不能复用Bubble生产准入。
6. **LBM-R1-N6：源码与运行层区分。** 本地jar的SysParameterManage类含customTile/styleUrl/tileUrl/map.mapType/normalizeAndValidateCustomMap等字面量，说明并非完全缺该能力；未反编译比对所有实际字节码或调用在线API。本报告的保存范围是当前源码静态结论，执行前后正常UI/API读回仍不可省略。

## 已检查无问题维度

- 现有OnlineMap支持customTile+vector、styleUrl、0–18缩放和styleAttribution；前后端均接受以单斜杠开头的站内资源路径，方案URL和缩放合法，署名长度足够。
- OnlineMapCustom从浏览器fetch Style JSON，校验version8/sources/layers，再创建MapLibre；不存在需要为fixture开后端代理或安装依赖的步骤。
- custom-online-map同样使用MapLibre与L7 Scene；flow/heat/symbolic调用getMapScene，customTile分支进入已有实现，候选preparedMapKey读取已加载store。配置选择属于现有支持路径，不是假key/伪造地图完成状态。
- 内联自生成GeoJSON网格，background/line层，无font/glyph/sprite/tiles或外部source URL的设计可以避免底图资源外网依赖；测试数据与真实国界分离，未虚构精确地理底图。实际文件生成后应检查只含允许的源/图层结构、有限合法坐标和无远程引用。横向经纬网格可分段采点避免±180度端点/环绕歧义，不以视觉网格作真实地理精度oracle。
- 新文件路径现不存在，计划拒绝覆盖不同内容正确。public由Vite提供，不需启动新服务；不执行构建、安装或部署。
- 保存后mapStore.setKey只更新当前页面store，离开重开在线地图及重新进入测试dashboard是必要读回；长期fixture不等价跨环境配置。
- 原38项、49类型和真实权限边界保留；底图准备成功仍不直接关闭三个地图的运行NOT_RUN，query/图层坐标/双向copy-paste/显式save-reopen各自另验。

## 阅读清单、未检查及声明上限

完整读取绑定计划、OnlineMap.vue、onlineMap.ts、custom-online-map.ts；扩读OnlineMapCustom.vue、前端sysParameter API与map store、后端SysParameterApi/OnlineMapEditor调用链、SysParameterServer、SysParameterManage读写/校验/事务、CoreSysSetting与非空合并切面、三图getMapScene入口和custom路径、Vite base设置。未读取任何实时密钥、URL或数据库值；未操作UI、未发配置POST、未创建fixture、未执行HTTP或渲染验证。

未验证真实部署版本完整行为、现有原始配置空/非空、备份与恢复可用性、其他客户端影响和地图实际画面，原因是本lane只读方案/源码并只允许写报告。没有输出凭据或修改外置配置、生产源码、数据库、已有证据。

## 准入预测

可继续准备并独立验证同源网格文件（使用自己的精确write admission）；持久配置保存须先修正B1/B2并绑定真实保全/回退、保存键范围和本环境topology，再评估下一轮。预计无需修改DataEase产品代码即可完成该环境准备，但本报告不预判现有API能做精确行级回滚。

本局部方案阻断不取消用户批准、不要求重复授权，也不要求停止其他已授权工作。完成后只允许称“本地测试底图可用并有实际验证证据”，不提升商业底图、地理准确性、真实权限、MVP或Goal完成。
