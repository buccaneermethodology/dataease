# map / bubble-map 缺列补证独立验证 r001

**结论：PASS_WITH_BOUNDS（两份新基本配置运行证据有界通过），新增行为阻断0。** map r003的200→500与bubble-map r001的500→200均有完整复制、采用、显式保存、真实panel退出、find、目标重开新数据及图像。两次map地区控件定位失败和probe原迹保留；新成功不当作产品修复，不抹旧map19处严格descriptor差异、C2/ubo或其它地图视觉/生命周期限制。

这是**两基本配置新runtime包首轮1/3**，不重开地图实现、地图修复或C2已耗尽3/3预算，不要求机械凑后两轮。原38项（P1=12、P2=26）、49类型分母及完整0/49、真实权限未验、插件installed unknown均不变。

- reviewed_at：`2026-10-30T20:47:52.120679+00:00`；reviewer/source：`/root/local_basemap_reviewer`，独立于本批driver、运行采集、CSV和地图源码作者。
- snapshot_id：`S02-MAP-BUBBLE-COLUMNS-VALIDATION-r001`；as_of_state：卡绑定r579、两成功包、两失败包、probe与原既有列复用矩阵。
- Card canonical SHA：`5569004af186646d0a3c03a937a0249cf6a97bbda2c1bf6a1d5c91ccf333af6a`。接收端validate/render均exit0并消费execution_command；19项卡引用入场及写前SHA匹配。
- 唯一持久输出为本报告，写前不存在。未操作UI/DB、修改源码/driver/旧证据/合同/矩阵/状态，未安装、构建、启动服务、提交或推送。本lane未重跑浏览器。

## 原范围、实际配置与列的区别

冻结原合同允许按合法基本配置补确缺列；本批针对旧map/bubble重开新rows及物理保存链等原件缺失，不能凭这次基本链宣称所有负向、地图资源和完整类型验收。`ReusedTypeColumnsValidation-r001.md`已独立保留旧map重开descriptor19差异与重开结果未捕获；本报告只判断**本次新时点/输入**，旧矩阵不改。

共同resource=`1312476889213964288`，dataset=`1312472054565572608`，专用target=`7520752064427724800`。source500=`7520741153101058048`，source200=`7521402539875504128`。

两型实际三个目标请求均为中国`customAttr.map={id:'156',level:'country'}`；xAxis为province `1793083721150 / f_34400541625c365a / deType0 / groupType d`，yAxis为amount `1793083721146 / f_279128a5b9f8601b / deType2 / groupType q / summary=sum`；未用轴为空。不是经纬度点配置、不是用标题“指标卡”或area模板标签推断type。

- map r003：初始已保存table-info200，正常切map并配置省/金额和中国；baseline200→copy symbolic500→candidate500→保存重开map500。
- bubble-map r001：初始已保存map500，正常切bubble-map并配置同省/金额/中国；baseline500→copy richtext200→candidate200→保存重开bubble-map200。

## 两次定位失败、probe与纠正后的正常控制

| 原件 | 已观察失败/动作 | 保存与恢复 |
| --- | --- | --- |
| MapMissingColumns r001 | configuration时`.el-tree-node__label`内精确中国等待8秒超时 | status=FAILED_OBSERVATION_PRESERVED；save0；正常panel editor0，raw恢复find目标table-info200 |
| MapMissingColumns r002 | 改用全页exact中国，但未展开根节点，等待8秒超时 | 同样save0、panel0；raw恢复find目标table-info200 |
| MapRegionProbe r001 | 抓当前selectorHtml后主动抛REGION_PROBE_ONLY_NO_SAVE | 这是控制诊断，不是产品RED；save0、panel0，raw恢复find目标table-info200 |

三者driver起止SHA均等当前对应原driver；未发生updateCanvas，恢复diagnostic仍200且completed=true；恢复find原件各在wire[0]，实际type=table-info。该恢复只证明所列原类型/树及已读回状态，不扩称liquid或隐藏配置逐字回滚。

probe的完整HTML直接显示**ed前缀**及`ed-tree-node[data-key="000"]`、`aria-expanded="false"`，根标签为“世界村”，自定义根disabled。probe沿用el选择器所得dropdowns/treeLabels为空，不能把这个空数组解释成没有地区数据。它支持旧控制定位不符/根未展开的诊断。

map r003改为正常click根000的ed展开图标，再在当前area-tree-select内点击role option精确“中国”；bubble先读aria-expanded，必要时正常展开再选中国。成功请求读回map156/country且六PNG出现实际中国轮廓，支持本次选择操作。改的是观察driver的正常UI定位，未修改产品源码、后端或地图返回值。旧两次失败、probe和后续成功分开保存，不能写成首跑成功，也不能把locator恢复算产品修复。

## 六个目标查询逐CSV核对

从CSV原始记录应用实际完整AND/OR过滤树，再以province分组SUM(amount)，逐组与tableRow比较，另核renderer消费的辅助`data`的field/value、dimensionList省字段和quotaList金额字段。三个省份、数量与每个值均严格一致，非仅合计通过。

| 条件 | CSV命中ID | 江苏省 | 浙江省 | 广东省 | 合计 |
| --- | --- | ---: | ---: | ---: | ---: |
| 200 | 3,5,11,12,13,14,15,16,17,18,20,21,23,25（14条） | 2676 | 2217 | 1868 | 6761 |
| 500 | 3,5,11,13,16,18,21,25（8条） | 1982 | 1243 | 1868 | 5093 |

每次结果tableRow=3组、辅助data=3项，值/字段关系均对应上述三省。相同行数不能掩盖数据变化：江苏与浙江确变、广东不变。

| 包 / 时点 | wire索引 / sequence | 实际type / threshold | 独立结果 |
| --- | --- | --- | --- |
| map baseline | 0 / 10 | map / 200 | 3省6761逐组相符 |
| map candidate | 1 / 17 | map / 500 | 3省5093逐组相符 |
| map reopen | 5 / 36 | map / 500 | 新请求新rows，仍逐组5093 |
| bubble baseline | 0 / 9 | bubble-map / 500 | 3省5093逐组相符 |
| bubble candidate | 1 / 16 | bubble-map / 200 | 3省6761逐组相符 |
| bubble reopen | 5 / 35 | bubble-map / 200 | 新请求新rows，仍逐组6761 |

六次均HTTP200/business code0，request/response实际target、dataset、type一致。重开结果确有该type的新请求及完整response，不从qobs=null、别型结果或hash补造新rows。

## 完整复制、采用、保存和真正重开

两型逐项独立核得：

- sourceBeforeCopy.source、copied.clipboard、after.source、reopened.source、采用后本型source及再次copy的clipboard完整tree/ownKeys/undefinedPaths相同。递归13个ownKeys节点重新枚举一致，undefinedPaths=[]。baseline/before完整descriptor相同；采用前后threshold确实改变。
- 粘贴后完整clipboard保持；再次正常copy本型后revision增加，证明本型源导出另有原件。此层限于实际导出的descriptor及clip元信息，不声称内部fields全集或未导出Store。
- 每型candidate窗口各1条真实target HTTP，另有logicalGetDataCalls=1、outcome=success；diagnostic responseData完整等raw响应data。map窗口[17,18)、bubble窗口[16,17)，配置请求不混进formal候选计数。
- 每型updateCanvas恰1次，响应业务码0；save wire[2]，find wire[3]，目标type/完整过滤树均正确。map正常panel退出20:40:12.603Z、bubble20:41:03.062Z，二者editorCount=0；不是仅瞬间goto后假定退出。
- 重新find同resource后，实际query按上表重新取得本型新rows；reopened fieldsReady=true、clipboard=null。正常保存/退出/find/query和图像一起支持本次持久化链。

保存/重开轴对象有一项明确差异：**两型yAxis[0]在save请求中有axisType='yAxis'、seriesId='1793083721146-yAxis'，find中省去两键**。深层diff无其它轴差异；除该两键外所有轴字段相同，map156/country相同，过滤树完整相同。不能写成“完整轴对象逐字一致”，也不把非契约前端键差异当本次数据失败。本lane最初按全轴对象逐字相同的过强辅助断言失败，随后逐键列出差异；没有通过隐藏差异制造全同结论。

**旧map19差异没有消失。** 旧复用矩阵的`/independent_checks/comparisons/map/differences`仍保留group fieldId空串→null、timeValue的undefinedPaths、默认键/ownKeys等19处差异，其旧`exact_reopen_tree`仍mismatch。本次输入是已导出当前JSON边界的完整树，新时点descriptor严格相等；不从这份新相等反推旧输入也相等、不推断某次源码修复了旧归一化，不修改旧样本或旧结论。

## 六PNG的实际可见范围

已逐张view_image：MapMissingColumns的before/after/reopened r003，以及BubbleMapMissingColumns的before/after/reopened r001；各SHA等原stage记录。

map三图确为中国省级轮廓与区域着色，baseline200到candidate500可见省份相对色阶变化，reopened与after相符。bubble三图确有中国底图及江苏/浙江/广东附近三个气泡，500→200后相对大小变化，reopened与after相符。气泡比例/色阶可能按当前值域重算，不能因为广东原始值不变就要求其相对半径不变。本报告没有用raw数值正确代替真实图层显示；也没有从截图反算精确金额、单位、色阶公式或比例算法。

图为专用基本配置；省名拥挤、所有省界与位置/标注/交互/缩放/hover/drill完整正确性、冷缓存或外部底图资源重新取得均未由这六截图验收。标题仍“指标卡”不影响真实type识别。旧map/bubble视觉、资源和生命周期限制保持，不能把本次地图可见当作全面治理或生产就绪。

## Context、全部发现及未检范围

两个新Context的required_domains均完整覆盖authority/scope/acceptance/implementation/identity/validation/dependency/claim_ceiling/topology九域，AC01/09与基本正链/保存重开缺列一致；map14项、bubble13项内层SHA逐项匹配。各admission五类ref（Goal、Contract、Context、DesignReview、Topology）摘要匹配；两次Context validate和两次execution admission检查均exit0。map freeze/admission20:39:50.358889Z早于run20:40:05.182Z；bubble freeze/admission20:40:45.101679Z早于run20:40:55.438Z；两driver起止SHA均匹配。脚本通过不等于新源码或完整语义验收。

**新增行为blocking=0。全部非阻断观察/残余一次列明：**

1. **MBC-N01 / P2 / 历史边界**：旧map19严格形状差异仍为历史mismatch，新当前JSON输入的严格相等仅补新证据列，不修复或追认旧样本；旧bubble自复制/等待失败、旧map导航证据层等也不被抹去。
2. **MBC-N02 / P3 / 保存声明精度**：当前两型仅yAxis的axisType/seriesId被省，其它已比字段相同；不能宣称所有轴字节保持。此差异不影响已核province/amount/region和新rows/图像。
3. **MBC-N03 / P3 / 控制与模板文字**：两次定位失败和主动probe不是产品缺陷RED；后成功不算修源码。schema/declaredWriteScope/limits或area-stage保留旧模板字样，initial_target_liquid500_reported实际分别是明细表200和地图500；本报告以实际id/type/轴/HTTP/图片和恢复find为准，不据模板名称造area/liquid证据。
4. **MBC-N04 / P2 / 有界环境与未覆盖**：DEV allow是测试桩，真实多账号权限未验；pageErrors空、runtime error count1→1不能关闭旧ubo/console/resource或C2。r579是原共享checkpoint，不因其摘要正确就补造本地图lane全拓扑/全部终态；当前独立身份与限定输出由本卡/本报告定位。

已检查无新增问题：19主绑定、两Context九域/14+13ref、各admission五ref及先后、5份driver/失败恢复保全；probe ed根折叠和后正常展开；六目标请求完整身份/字段/三省CSV/辅助协议；当前完整source/clip/target/source-copy/reopen descriptor；各1次物理/逻辑候选、1次显式save、panel0/find/本型新rows/空clip；6图实际显示及原hash；旧19差异不被默认归一化掩盖。

未检及原因：本Validator未运行UI/SQL/DB/源码tests；没有新实现改动需要在此重做组件suite。未检真实身份/组织拒绝、所有后端方言、全部动态筛选/钻取/分享嵌入、负向/保存失败、undo/redo、全Store/dirty/所有SDK资源和响应竞争、其它type及所有地图视觉/外部资源恢复。原因是本批单一中国省分组基本配置与原观察边界，不是默认通过；C2原3/3 BLOCKED/C2V-005及旧ubo保持。

两包明确最终保留map500、随后bubble-map200，restoredToOriginalLiquid=false；本报告不声称恢复原liquid或隐藏属性。原计划的最终fixture恢复由root另按实际动作负责，未在这里关闭。

## 准入预测与后续

可将本包吸收为这两个**新基本配置时点**的完整正向列：正常source/target和完整descriptor、物理候选/结果、显式save/find、panel真实落地、重开本型新结果和可见地图/气泡。对旧矩阵采用新证据引用或追加时点，不逆写旧19差异、旧失败或旧非观察。

当前无新增实现阻断，不要求机械第二轮或再跑这两成功链；root可绑定该报告继续S039既有准备/原剩余义务，不预填整体P1通过。地图实现/C2已满预算不因这个新runtime报告重开；全部38、49/完整0/49、真实权限及其它未验项保持。

## 输入清单与最终绑定

| 卡输入 | SHA-256 |
| --- | --- |
| [Goal.final.json](</Users/xiaomei/Documents/projects/dataease/Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/Goal.final.json>) | `4db931a6764a8c48345e7e8358e579550a9bc98594bf1654647716d72b9678c4` |
| [ReusedTypeColumnsValidation-r001.md](</Users/xiaomei/Documents/projects/dataease/Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/MVP-20261027/reviews/ReusedTypeColumnsValidation-r001.md>) | `c0f6c507e3f44dfc5bdf5553770243bbbef8841b2d44d203f8517a928bd2fd27` |
| [ReusedTypeColumnsMatrix-r001.json](</Users/xiaomei/Documents/projects/dataease/Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/MVP-20261027/evidence/ReusedTypeColumnsMatrix-r001.json>) | `3c3c77e2f7ef1f30e7a42de01c813948b072d886eb562a7f93064639959d9060` |
| [UiIntegrationCases-r002.json](</Users/xiaomei/Documents/projects/dataease/Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/MVP-20261027/UiIntegrationCases-r002.json>) | `e365ef111582ef84f20f26e6136854409b7fc66bb0931cae40a9df5318036d55` |
| [TeaMaterialExtended-r001.csv](</Users/xiaomei/Documents/projects/dataease/Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/MVP-20261027/runtime-fixtures/TeaMaterialExtended-r001.csv>) | `abc8bed0862129d58724bcefff2563862e48d1ea057365ae8d5d2c853e64472b` |
| [Topology-actual-r579.json](</Users/xiaomei/Documents/projects/dataease/Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/planning/Topology-actual-r579.json>) | `339d19038eecc081d530442e35ad3f277b1791eddabfa9eb022a2203e5088e53` |
| [MapRegionProbe-events-r001.json](</Users/xiaomei/Documents/projects/dataease/Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/MVP-20261027/evidence/MapRegionProbe-events-r001.json>) | `f5af257bcdf8bf9443c219a691c0a10706dffa570045b3b7091cce621fc71fa6` |
| [MapMissingColumns-events-r001.json](</Users/xiaomei/Documents/projects/dataease/Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/MVP-20261027/evidence/MapMissingColumns-events-r001.json>) | `ea964f190035a28d029d53bb3a0063a9d4fef9614fb0e1857b1fb6b30556e795` |
| [MapMissingColumns-events-r002.json](</Users/xiaomei/Documents/projects/dataease/Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/MVP-20261027/evidence/MapMissingColumns-events-r002.json>) | `870ab70cf96851e8aad366c7b07252ed676ea39e315726a14171d03acf183fcb` |
| [ContextBootstrap-MapMissingColumns-r003.json](</Users/xiaomei/Documents/projects/dataease/Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/planning/ContextBootstrap-MapMissingColumns-r003.json>) | `9e687ee212c733724e985e1fa85383ad7e67421e5efe59955244e2493e8eed66` |
| [map-missing-columns-admission-r003.json](</Users/xiaomei/Documents/projects/dataease/Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/planning/map-missing-columns-admission-r003.json>) | `8ceb26faab0e912dbcfb044eb917f298be17a3475f3e80fbccb0b37497bd48da` |
| [MapMissingColumns-events-r003.json](</Users/xiaomei/Documents/projects/dataease/Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/MVP-20261027/evidence/MapMissingColumns-events-r003.json>) | `b7a62dfec9a4d7e51ee506b6e529cb3233a90656f85441ffe705da1f82fafd1a` |
| [MapMissingColumnsToolFreeze-r003.json](</Users/xiaomei/Documents/projects/dataease/Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/MVP-20261027/evidence/MapMissingColumnsToolFreeze-r003.json>) | `3e5323dce00ba84344157f72a25ec3c16708029ef34f87e21362d26be3c044d7` |
| [observe-map-missing-columns-r003.js](</Users/xiaomei/Documents/projects/dataease/Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/MVP-20261027/runtime-state-tools/observe-map-missing-columns-r003.js>) | `de9f0ea4a4b7bf62d89b6ff342e82c8215e8c82f620999980ac4929b0934f001` |
| [ContextBootstrap-BubbleMapMissingColumns-r001.json](</Users/xiaomei/Documents/projects/dataease/Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/planning/ContextBootstrap-BubbleMapMissingColumns-r001.json>) | `814998fc5aaea1b5fdcd0583e4518b30f120047017c9bdf97464e25f053a74a4` |
| [bubble-map-missing-columns-admission-r001.json](</Users/xiaomei/Documents/projects/dataease/Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/planning/bubble-map-missing-columns-admission-r001.json>) | `622d194761da7be126da0a6e32a3ae7a4deac775042fac795d90c893f701c39d` |
| [BubbleMapMissingColumns-events-r001.json](</Users/xiaomei/Documents/projects/dataease/Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/MVP-20261027/evidence/BubbleMapMissingColumns-events-r001.json>) | `5666f8a7b2a686534a41e276c16e611f8314fe7f6dc5b42c1a8383ea7a0e4ba1` |
| [BubbleMapMissingColumnsToolFreeze-r001.json](</Users/xiaomei/Documents/projects/dataease/Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/MVP-20261027/evidence/BubbleMapMissingColumnsToolFreeze-r001.json>) | `f2b0051f71ab34b3fbaf8a3dd5fec04d6dc858151d70f1bd6a0e2ed144a4c4e5` |
| [observe-bubble-map-missing-columns-r001.js](</Users/xiaomei/Documents/projects/dataease/Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/MVP-20261027/runtime-state-tools/observe-bubble-map-missing-columns-r001.js>) | `995305548efb85b594daf22c113550808f9c418d2773e94475de7af137ec6ff9` |

| Context内层与补充原件 | SHA-256 |
| --- | --- |
| [MvpAcceptanceReadinessReview-r001.md](</Users/xiaomei/Documents/projects/dataease/Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/MVP-20261027/reviews/MvpAcceptanceReadinessReview-r001.md>)：Context内层依赖 | `fba3b6ad368e085b787cd9a69497f5fb51163397559d718f7596dd014a06d9af` |
| [TableInfoMissingColumns-events-r002.json](</Users/xiaomei/Documents/projects/dataease/Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/MVP-20261027/evidence/TableInfoMissingColumns-events-r002.json>)：Context内层依赖 | `225481c82bf4a5578226dfc389e899a1012d40e42e3384bb8fb73306635c396c` |
| [map.ts](</Users/xiaomei/Documents/projects/dataease/core/core-frontend/src/views/chart/components/js/panel/charts/map/map.ts>)：Context内层依赖 | `5eeb33eeff060e1a25e48eaa8d836d9e8985c63bfa2ed9d70b513244420c6c12` |
| [useChartFilterCopyMvp.ts](</Users/xiaomei/Documents/projects/dataease/core/core-frontend/src/views/chart/components/editor/filter/useChartFilterCopyMvp.ts>)：Context内层依赖 | `b760fffb47db4a8a187cc3dc996d6ddffb5f2b187038da625c5c8e0839d87e5d` |
| [index.vue](</Users/xiaomei/Documents/projects/dataease/core/core-frontend/src/views/chart/components/views/index.vue>)：Context内层依赖 | `dd88f2ac4f7c5e35f0b07822c72cae0764a3bad11be4a19f23a86d9fb9de3c7b` |
| [bubble-map.ts](</Users/xiaomei/Documents/projects/dataease/core/core-frontend/src/views/chart/components/js/panel/charts/map/bubble-map.ts>)：Context内层依赖 | `29f3d1d86d49563d4ad0bc1c385c242267000c066d5a4c13441520c7af797f04` |
| [SliceC2Validation-r003.md](</Users/xiaomei/Documents/projects/dataease/Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/MVP-20261027/reviews/SliceC2Validation-r003.md>)：原C2第3/3阻断不重审 | `17e6566b99fe25194bf957abaf58c95e4398df4d1edf5aee6aec9e3470575ee6` |
| [MvpAcceptanceReadinessHandoff-r001.md](</Users/xiaomei/Documents/projects/dataease/Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/MVP-20261027/MvpAcceptanceReadinessHandoff-r001.md>)：原38/49上限 | `663cba05b5bbe6c2e1f9abd09353fbde103638b14b6190bb25f0232e61ba5b1b` |
| [observe-map-missing-columns-r001.js](</Users/xiaomei/Documents/projects/dataease/Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/MVP-20261027/runtime-state-tools/observe-map-missing-columns-r001.js>)：首次控制定位失败原driver | `f07c9b7a7775347155fed883bd5df860b55a5b544b84addc484fbe226fd2d84c` |
| [observe-map-missing-columns-r002.js](</Users/xiaomei/Documents/projects/dataease/Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/MVP-20261027/runtime-state-tools/observe-map-missing-columns-r002.js>)：第二次控制定位失败原driver | `665d451264f4f7b8785e285c0f93554c27b5b5fabe6f2d76bddf44f8f4e6236a` |
| [observe-map-region-probe-r001.js](</Users/xiaomei/Documents/projects/dataease/Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/MVP-20261027/runtime-state-tools/observe-map-region-probe-r001.js>)：DOM只读probe及恢复driver | `d71930ab5197ce525ab77ff51e109bbbda6f244bb94db8e6b637f4e7c7ad5d64` |

| 实际查看的PNG | SHA-256 |
| --- | --- |
| [MapMissingColumns-before-r003.png](</Users/xiaomei/Documents/projects/dataease/Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/MVP-20261027/evidence/MapMissingColumns-before-r003.png>) | `b367fdb3cea7112531b6fc112ec62ef31568a891e91bac413a96405236f1cfa7` |
| [MapMissingColumns-after-r003.png](</Users/xiaomei/Documents/projects/dataease/Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/MVP-20261027/evidence/MapMissingColumns-after-r003.png>) | `d7d2ad40f7a165f433564465007fbc47b7de0930898ddedc62a800155b2d1894` |
| [MapMissingColumns-reopened-r003.png](</Users/xiaomei/Documents/projects/dataease/Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/MVP-20261027/evidence/MapMissingColumns-reopened-r003.png>) | `3942aa99f83f5a0762062b34f68bfa733d7b87924dc82a411a355bc74c8819f0` |
| [BubbleMapMissingColumns-before-r001.png](</Users/xiaomei/Documents/projects/dataease/Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/MVP-20261027/evidence/BubbleMapMissingColumns-before-r001.png>) | `99cd0f9d394efa699d223dccadc4676af5e53b3b4b4b614efd5e781e1c4bda75` |
| [BubbleMapMissingColumns-after-r001.png](</Users/xiaomei/Documents/projects/dataease/Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/MVP-20261027/evidence/BubbleMapMissingColumns-after-r001.png>) | `094b1c35be7b71c4b894c6e7c4cc17ebeeac9157cdfe08439de11c0db46ad3b0` |
| [BubbleMapMissingColumns-reopened-r001.png](</Users/xiaomei/Documents/projects/dataease/Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/MVP-20261027/evidence/BubbleMapMissingColumns-reopened-r001.png>) | `9bca419e54bd6336461255b304bb13852bab946fbccbbd0ee923a487019de743` |

写前/写后主绑定、两Context内层及补充材料均匹配上述摘要；只新增本报告。未修改既有矩阵、失败/恢复原件、Dashboard/KB或Goal终态；项目无Session registry/reconcile工具，不声明程序化注册表校验。本文不构成Goal最终closeout/Stop Gate。
