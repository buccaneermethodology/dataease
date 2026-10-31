# 坐标地图稳定画面与保存重开补证独立审查 r002

- reviewed_at：2026-10-30T06:50:35.963626+00:00；reviewer/source：`/root/local_basemap_reviewer`，非本批UI执行者。
- snapshot_id：`S02-COORDINATE-MAP-STABLE-EVIDENCE-VALIDATION-r002`；as_of_state：RuntimeMapStable-r001/events、7PNG及Topology-r539已冻结。原CoordinateMapEvidenceValidation-r001和RuntimeCoordinateMap-r003保持原字节。
- 同一坐标地图证据交付物累计 **第2/3轮**，不重置已耗尽的C2实现3/3。本lane只读文件、独立CSV/JSON复算与查看截图，仅写本报告/tmp结果，没有UI/DB/source写入。
- 卡canonical SHA `ddf0dcd50d0d62f1b349f2eefa94ca7c7ca99167c70d8c91fde091d2b47c0e22`；接收端validate/render均exit0/PASS，Goal+16 base refs共 **17项** SHA匹配，写报告前复验未漂移。

## 裁决

**heat/flow稳定画面及真实保存/加载载荷的局部补证：PASS WITH P1 FOLLOW-UP（有界通过，保留一个fixture恢复缺口）。本批三查询窗口与四组过滤树记账新增blocking=0；“完整原symbolic fixture已恢复”：尚未通过。**

独立复算确认37条原始业务HTTP、13个marks、3个指定重开查询窗口与CSV一致，4组save→findById的两棵完整customFilter均相等。heat双帧字节一致且实际可见热斑；首组flow确无清楚流线，不追认；正常UI清理隐藏当前yAxisExt并重新配置终点轴后的新flow帧、再次保存/实际panel退出/重开帧均可见流线。

另发现：初始symbolic保存态的extBubble=[amount]，最终save/load和query已为空，最终顶层无amount；因此只能说symbolic类型、500过滤树及空clipboard已恢复，不能说原金额气泡fixture完全恢复。root已确认并计划另用正常UI补回并新证据保存重开；**该后续动作尚未发生，不在本报告倒填PASS**。

本报告是执行者运行证据的独立审阅/复算，不是本lane独立runtime重跑。只补首轮缺失的局部稳定画面和真实保存载荷，不重做/重计已证双向配对，不提升完整49类型、38义务、真实权限、历史ubo或Goal终态。

## 三个查询窗口的独立CSV核对

检查器`/var/folders/l1/r6bpxxvj087bgky2q98zlqvh0000gn/T/s02-map-stable-independent-lcbv7anm/verify.py`，SHA `703b668faa88f01b94235521dd775c297e22602127e59551ad6621acaa753425`；结果`results.json`，SHA `d3454d2463253906167c936768961c69628d38248f2c3c686f452448338a2b41`。独立读取冻结CSV、递归完整and/or请求树，用Decimal筛选/聚合；不从响应生成expected，不运行会改写producer summary的check-map-stable脚本。

CSV为30行×19字段、30个唯一ID。完整500+六店树命中ID 3,5,11,13,16,18,21,25，总额5093。每个窗口都验证唯一坐标组集合、对应金额、请求/响应type、chart/dataset身份、mark完整源树等于该请求customFilter、clipboard=null/dialogs=0。

| mark | 本次重开wire窗口 | 核对响应 | 结果 |
|---|---|---|---|
| heat_stable_reopened | [8,13) | 10，heat-map | 3组/5093，坐标金额完全一致 |
| flow_stable_reopened | [15,20) | 17，flow-map | 3组/5093，起终点及城市/金额一致；画面无清楚线条仍保留 |
| flow_corrected_stable_reopen | [24,29) | 27，flow-map | 3组/5093，起终点及城市/金额一致；新帧可见流线 |

| 起点 | heat金额 / flow金额 | flow终点 |
|---|---:|---|
| 深圳114.0579/22.5434 | 1868 | 杭州120.1551/30.2741 |
| 南京118.7969/32.0603 | 1982 | 深圳114.0579/22.5434 |
| 杭州120.1551/30.2741 | 1243 | 南京118.7969/32.0603 |

旧flow窗口CSV正确不能推出流线已正确渲染。重开窗口响应确在各自findById之后、对应mark之前，不仅从历史前缀中随意挑一份同type响应。未将3个窗口说成3次新的paste或新增双向覆盖；本批切类型/轴编辑产生的其他query也不冒称“每操作只有1物理HTTP”。

## 四组保存、实际退出和重开

四对均同dashboard `1312476889213964288`、HTTP200/code0；主chart `7520741153101058048`与indicator `7520752064427724800`的完整customFilter对象直接比较相等，保留所有null/空串/嵌套字段和数组顺序，没有规范化或删键。主type在保存与加载中也匹配。

| save→load | 主type | 两树相等 | 当前upper yAxisExt（保存/加载） |
|---|---|---|---|
| 7→8 | heat-map | 均true | target / target |
| 14→15 | flow-map（首组） | 均true | target / target |
| 23→24 | flow-map（修正后） | 均true | 空 / 空 |
| 31→32 | symbolic-map | 均true | 空 / 空；extBubble也为空，见F1 |

heat_actual_exit、flow_actual_exit、flow_corrected_actual_exit分别记录06:22:12.982Z、06:27:04.921Z、06:35:04.316Z，均是`#/panel/index?dvId=...`且editorCount=0。随后各稳定mark的editSessionId为3/5/7、clipboard为空、dialogs=0，配合新findById/getData，较首轮只有保存按钮或过早截图的证据明显增强。它支持这些具体退出/重开路径，不泛化TTL、登出/身份切换或所有页面生命周期。

最终symbolic硬重载mark为06:36:52.079Z，wireEnd=37，type symbolic-map、树500、clipboard=null、dialogs=0；第32条findById与36条getData成立。这个结论与extBubble金额指标缺失并列，不互相抵消。

## 7张PNG实际核验

7个文件均418×316。已核全部字节/摘要；heat A/B和首flow A/B各自完全相同，因此实际查看了5个不同图像内容，没有把重复字节当新增视觉场景。

- **heat A/B**：SHA同为`79668e1f7e6b61860b3337e25b120f03c6974421956950ed3f30ed357aab8198`。网格和热斑可见、两帧像素一致。画面有两处主要热斑，上方邻近坐标可能重叠；不据此声称三个聚合组必须视觉上分成三个独立热点，也不由两帧相等证明全部renderer生命周期。
- **首flow A/B**：SHA同为`187d4a3da8c9ce1a69e235351e8d443a4650a1fd7b07e48bdcfd130ee7bf3442`。只见南京/杭州/深圳点与标签，没有清楚流线。原失败不能被后图追认。
- **flow-cleared-hidden A**：SHA `ebd34529fb1a306bc6c3a5983bc65b1528dc329241ca5d3761b7ea4ff00345c9`，实际可见连接城市的蓝色流线/动画段。
- **flow-corrected-reopen A/B**：SHA分别`b6ce6b435a7aad6b50419d370ae4f15c4e7a0da6864c193b8cb2cc86305855ad`、`eddbec95e5721cbaca00c4b58b5e0f15394af1147ddd74b235a2c88ba5265be7`，两张均有流线，亮色段位置不同，符合动态画面，不要求像heat一样字节相等。

截图是目标chart局部裁切，不提供整个页面/所有资源的正确性。数据方向/坐标以CSV和HTTP核对为主，未建立颜色、线宽、动画速度/相位或camera精确持久oracle。

## 隐藏轴、大小写alias与因果上限

当前flow-map.ts的axis列表不提供yAxisExt编辑槽，但lineConfig会读取`chart.yAxisExt`作为lineColorField；存在该字段时走`.color(lineColorField)`，为空才用默认/渐变色。首flow响应的当前yAxisExt仍是target，但tableRow实际只有起终点/城市/amount，没有target列。该静态路径与无清楚线条一致，不能称SQL聚合错误。

具体观察不能把lower与upper合并：

- wire17：request/response的yaxisExt与yAxisExt均target；响应row无target。
- wire22：旧lower request yaxisExt仍target，**当前upper yAxisExt已空**；真实response两个数组均空，CSV仍相同，清理后画面有线。
- save23：lower yaxisExt仍target、upper空；load24两个数组都空；reopened getData27两个数组均空，流线持续可见。

独立比较17→22的renderer相关输入：basicStyle、misc.flowMapConfig、起终点轴、yAxis、起终点名称和完整过滤树相同；当前yAxisExt由target变空。同时extBubble从amount变空，customAttr.label.seriesLabelFormatter也发生变化，故不是整个view对象唯一变量的严格A/B实验。FlowMap.lineConfig没有读取该label formatter/extBubble，但没有浏览器内SDK最终配置/可逆ABA探针，不能给“唯一根因已正式修复”的强结论。

准确表述为：**在当前源码机制支持下，经正常UI清理当前隐藏轴并恢复终点轴后，合法fixture状态的新流线及保存重开获得实际观察。没有修改产品源码，没有修复通用类型迁移/遗留轴兼容机制。** 后续若要治理隐藏轴继承，须先提出含触发、影响、建议的具体候选，不将本次fixture操作自动升格新must-have或重开C2。

## 全部发现与处置

### CMS-R2-F1｜P1必须跟进：最终symbolic恢复漏掉原气泡金额指标

初始findById wire0和symbolic wire4：extBubble=[amount]；最终save31/load32/getData36：extBubble=[]，尽管yAxis仍带amount。SymbolicMapHandler实际用extBubble组装气泡度量，最终response.fields仅longitude/latitude/city，顶层只有count而无amount。details.amount为原行802/141/162，不能拿它与5093聚合互相替代。

因此type/filter500/clip空的恢复断言成立，但原“amount求和气泡”fixture尚未完整恢复；不能继续把最终symbolic画面当同一金额oracle，或据此修改原预期分母。这是**手动类型切换后的fixture状态差异**，不是证明filter paste偷偷改指标或新增源码bug。root已确认，将用正常UI补回气泡amount并另存新证据。需要明确补该字段、正常保存/实际重开及顶层amount恢复的观察；当前冻结事件不改，后续未发生的修正不倒填本轮通过。

**影响**：不阻断本轮三个heat/flow窗口、四组完整过滤树和新流线局部记账；阻断“完整原fixture已经恢复”的结论。Builder后续只需恢复fixture并补有界证据，不要求修改产品或重跑全部49类。

### CMS-R2-N1｜P1产品/兼容残余，对本批记账非阻断：隐藏轴未由产品机制解决

首flow从已保存配置重开仍无清楚线条，而隐藏target不在正常flow轴列表却参与渲染。临时切chart-mix才能清当前隐藏轴，是可解释的fixture校准路径；它不证明所有旧仪表板/类型转换都能安全清理遗留配置。保留首失败、有效变更和新的成功分别记账，不把失败归为非法用户操作从原历史兼容/正确性要求中删除，也不自动新增或关闭某项原产品AC。

### CMS-R2-N2｜P2：serverAddr是Vite，不能提升成后端直连/全部transport证明

37条均POST、status200/code0、URL为127.0.0.1:7070/api，serverAddr均127.0.0.1:7070；这比此前记录补了method与浏览器实际peer。它证明到Vite这一跳，不是后端8100的socket或源码jar身份。当前仍是旧8100，不包含只在8110新clone验证的symbolic明细修复；最终details仍有蓝墨/欢果过滤外身份，不能把两环境成功合并成原实例已修复。

原始request/body与本批数据规则可核，未记录headers/HMAC逐字节和后端peer，不称完整网络每跳证明。并发请求完成顺序可能与at毫秒顺序不同（如33/34），按mark窗口/类型/ID匹配，不机械按数组排序改写原始记录。

### CMS-R2-N3｜P2：短窗口无pageerror和双帧稳定不能关闭历史ubo/全视觉残余

errors=[]只代表本批采集范围没有pageerror，不能抵消首轮累计4次ubo；没有console/resource全部通道或GPU对象身份重放。heat双帧相同、修正flow两帧可见支持本局部稳定性，不覆盖所有尺寸、缩放、重复刷新、卸载、相位或数据颜色映射。保留原C2三轮预算，不以本批正常配置成功声称通用生命周期修复。

本轮一次列全发现，**局部证据blocking=0；完整fixture恢复必须跟进F1；没有要求本lane修产品或取得新用户许可。** 该后续小恢复可在剩余同一交付物轮次按delta补证，不能换名重置预算或反复重跑已成立配对凑覆盖。

## 首轮发现的累计处置

| 首轮发现 | 本轮变化 | 保留边界 |
|---|---|---|
| CMV-N01 ubo | 本批0新pageerror | 历史4条及根因未关闭 |
| CMV-N02 symbolic过滤外details | 本批仍走旧8100，最终过滤外身份仍见 | 仅8110独立clone另有修复证据；不吸收到原服务 |
| CMV-N03 flow/heat重开画面不足 | heat有稳定实际热斑；首flow失败保留，校正fixture后流线/实际退出重开新证据成立 | 局部画面缺口推进，不等于全部类型视觉AC |
| CMV-N04 保存载荷/独立runtime缺口 | 新增4组真实updateCanvas/findById完整过滤树及panel退出DOM0 | 本lane仍非独立runtime重跑，完整headers/backend peer未测 |
| CMV-N05 进度历史文字 | 不改旧r003/r009，本报告作为新时点补证 | root后续projection应明确历史与当前，尤其F1不能写已全恢复 |

## 已检查无问题、未检查及准入预测

已查无问题：17项摘要、admission精确action/target和其refs只读重验exit0；37HTTP方法/状态/业务code和Vite peer；CSV身份/完整树递归语义/三窗口唯一坐标组/起终点城市/5093；4对同dashboard/主type及两棵完整过滤树；实际panel退出editorCount0、新session/空clip/dialog0；大小写axis差异和保存读回；7PNG摘要、5个不同内容的实际画面；全部5条driver恢复及其失败未被删；原38/49与真实权限边界保持。

driverFailures包括草稿提示拒绝后重立baseline、类型文字未选中改data-id、首次拖拽内层/遮挡失败、首flow隐藏轴问题、实际切回flow后重复右轴移除的错误假设；均保留，不包装为从无失败。recordingStopped=true，本lane没有重新运行会写summary的producer checker。

未检查：本lane没有点击/拖拽/保存、DB查询、独立runtime重跑或后端实际peer/jar探针；没有验证全部类型/所有原AC、真实权限、TTL/撤权/拒绝/取消、完整跨入口或渲染资源生命周期；没有测量所有视觉定量oracle。完整初始view恢复未通过，明确F1。仅绑定当前flow源码供机制定位，没有审整个dirty工作区diff或声称相对HEAD零修改；本批没有源码修改由执行边界/Topology声明，不能推广为仓库无既有改动。

准入预测：heat/校正后的flow局部稳定重开及保存载荷可以推进执行记录；保留F1并补正常UI恢复金额气泡，未来证据仅负责该delta。不得追认首flow、取消旧错误、将旧8100当已修复新jar或把本轮补证重算一遍双向配对。无需为已证明的三个数据窗口/四对过滤树重做全流程；仍按原38义务、49类型完整验收和未完成项继续。

## 阅读清单与冻结

完整读取卡/实际render prompt、首轮review及旧RuntimeCoordinateMap-r003声明、当前summary与5MB原始events、固定CSV、producer checker、admission/Topology-r539、flow-map.ts；对17项摘要及admission嵌套refs复验；7PNG逐个读字节、5个唯一图像实际查看。只在tmp新建独立复算脚本/结果，未写产品、DB、UI或已有证据。

写报告前17项绑定输入未漂移、输出原不存在；只新增本报告。后续补证/状态应单向引用本报告摘要，不回写本审阅时点，也不冒充Goal最终closeout/KB-Dashboard/full-diff/Stop Gate终态绑定。
