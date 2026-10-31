# area 新入口r008运行补列独立验证 r002

- reviewed_at：`2026-10-30T19:54:25.725601+00:00`；reviewer/source：`/root/bubble_ready_validator_resumed`。
- snapshot_id：`S02-AREA-MISSING-COLUMNS-VALIDATION-r002`；mode=`full_baseline`，因新源码/Context/readset重建；as_of_state为卡绑定r008、当前Context/admission、原r001独立报告与C1已释放依赖。
- **原area补列交付累计第2/3轮**。旧r007首轮PARTIAL与原Context缺陷保留；新r008只对新入口/新运行裁决，不追认旧准入，不重开旧area实现、设计、C1或C2预算。
- canonical card SHA：`e8f5dc0d39c26ba2a9b802f5d7c99c3549a81b794b5722439765d33923ff0cf1`；接收端复验validate exit0、消费同名prompt，写前再次核卡内和内层摘要均无漂移。
- 唯一写入本报告，写前不存在。未执行产品UI/HTTP/DB/构建/安装/产品测试，未修改源码、driver、Context、admission、旧证据或Dashboard，未访问认证信息/XPack实现。

## 裁决及独立性边界

**PASS_WITH_BOUNDS（r008当前正确绑定入口和本次area正常运行证据有界通过），新增阻断0；保留2项非阻断说明及旧历史。** 新Context已不再出现原F-A01的四处引用缺口；此结论只适用19:45的新入口，旧r007仍是“运行事实有界通过、原准入缺陷未追认”的历史PARTIAL，原报告不改写。

独立复算 **168项证据断言，167满足、1处全量yAxis配置相等不满足**；该处为save→find省略axisType/seriesId，详见NB01。初组137项有1处差异，另31项轴、字段目录、历史保全与依赖绑定均满足。没有删键归一化后改称全绿；计数不是产品验收通过率。

本Reviewer编写过**未执行的r001通用observer候选**，因此**本报告不对该工具设计或自身旧实现作独立验收**。复用另一独立lane的`AreaMissingColumnsValidation-r001.md`（SHA `44d2160bf8bf65c3839ce6bde0f910986e8197a3d61089a84d697eb98940646c`）已释放的area运行协议与其历史限制；当前新r008由root修改、执行、采集，本lane从CSV、原HTTP request/body、实际PNG和内层引用直接另行复算，不依赖observer的success/unchanged/treeEquals布尔。

当前独立性足以支持上述**运行原件的只读独立复核层**；不支持“observer已被其作者独立审过”、Reviewer亲跑第二次独立runtime、整个采集基础可信性审计或产品最终验收。原r001的PARTIAL不因本报告被替换为PASS。

原分母仍为 **38义务（P1=12、P2=26）、49内置类型、完整0/49**；真实权限`BLOCKED/NOT_RUN`、插件installed unknown；C2V-005/旧ubo/runtime及其它已冻结残余不升、不合并因果。

## 原AC、当前入口和历史准入分离

本轮仅补AC-MVP-F01-01的area正常source/target基本多条件树列，以及AC-MVP-F01-09显式保存后退出重开整树/结果列；不关闭其它类型、负向、未保存/保存失败、全部结构/变体或真实权限。

卡16处引用、15个唯一文件均SHA匹配。新Context **12个required_read_set**逐项真实path+revision匹配，含固定Goal.final、Cases-r002、Plan-r001、原area独立报告、DesignReview-r002、C1独立3/3报告、格式落盘证明、r008 driver/freeze、Topology-r578及当前G2/composable源码。admission **5个依赖**全部匹配，action=builder/status=approved，target=`local://127.0.0.1:7070/dataeasev3/S02_MVP_Runtime_20261027`。

freeze、Context记录和admission均19:45:27.873191Z，早于本次19:45:35.132Z开始，19:45:44.887Z结束；freeze/start/end/current driver SHA均`797539152d5c07aab9bc2c9d1cbb134b1f0097ddaf0cd3d208e9c6b93dbe8683`。这证明当前文件绑定稳定，不冒充全部浏览器bundle/后端二进制身份。

原r007 Context SHA仍`0eac216bd5ea649e950e3a8214b57642191caec09a502af89e23aaf3980cc0c1`，旧事件SHA仍`68176a55ab5b0dc05d91da0056387ab05da51dc2860e7195a830e7f406deb163`。直接复核原四处缺口仍在：两个错误路径不存在、driver/freeze revision不匹配。没有用全局版本替换或新Context覆盖原件：

| 原r007内部路径尾部 | 旧绑定revision | 当前实际 |
| --- | --- | --- |
| UiIntegrationCases-r007.json | e365ef111582ef84f20f26e6136854409b7fc66bb0931cae40a9df5318036d55 | 文件不存在 |
| UiIntegrationDesignReview-r007-C234.md | 5d4c26ebda1ba9847e19ea1d04caa82d26a54cee01685a167d8313aa3114f4b2 | 文件不存在 |
| observe-area-missing-columns-r007.js | 5a7ad0ee164ff6d59728d206b2a852c85fb1c7942be9674e95dc9d5de94c6984 | e60a294de8a8c55bfc68edce59acaa103fc5bb131705e2eea16020d0ec599a7d |
| AreaMissingColumnsToolFreeze-r007.json | 0c6caf3e0553943a3f0e291066710423a67661bb515fc8e08012ca236cb059f7 | 6d0fc43314fdee0d3a62c2bf382b547af854fa78e10e19beef8edfe1889727bd |

原r002—r006观察器控制失败及恢复边界继续按原独立报告保留，未重新执行或把它们计为成功/产品RED。当前只审r008，不据新成功消除旧失败。

## CSV、整树与实际area数据

CSV `TeaMaterialExtended-r001.csv` SHA `abc8bed0862129d58724bcefff2563862e48d1ea057365ae8d5d2c853e64472b`。独立用Decimal递归解释AND/OR整树：amount大于500/200，且shop在果元/南都/香橙/乐园/红叶/水围六店枚举子树中。逐组键值多重集对比，不只看总额、不假定SQL排序。

实际area/antv，xAxis仅shop字段`1793083721149`、deType0；yAxis仅amount字段`1793083721146`、deType2、summary=sum；xAxisExt/yAxisExt/extStack/extBubble/extLabel/extTooltip/drillFields均空。字段dataeaseName与CSV映射匹配，13条真实字段目录均HTTP200/code0。

身份为resource `1312476889213964288`、dataset `1312472054565572608`、target `7520752064427724800`；正常copy来源`7521402539875504128`在save原始map中的type为rich-text。原source500为`7520741153101058048`。初始目标typeControl实际“K 线图”，随后三个正式时点均“面积图”；不以旧标题“指标卡”或旧liquid stage名称判断类型。

| 阶段 | 原wire sequence | request→response UTC | 树 | CSV命中数 | shop完整分组 |
| --- | ---: | --- | --- | ---: | --- |
| baseline | 7 | 19:45:38.109→38.157 | >500 | 8 | 果元2670、南都1284、乐园563、水围576；总5093 |
| candidate | 12 | 19:45:40.594→40.617 | >200 | 14 | 果元3218、南都1284、乐园563、水围1141、香橙555；总6761 |
| reopened | 31 | 19:45:42.769→19:45:42.786 | >200 | 14 | 与candidate完整相同5组，总6761 |

500命中ID3/5/11/13/16/18/21/25；200命中3/5/11/12/13/14/15/16/17/18/20/21/23/25。正式原请求type、dataset、目标ID、轴/树一致；tableRow和真实渲染data的dimensionList/quotaList/value逐值对应CSV。candidate原responseData与qobs完整相等，qobs请求投影亦与真实request相符；数值用精确数字语义，树/descriptor不做删键或归一化。

11个diagnostic capture的16份非空source/clipboard descriptor均独立重建ownKeys并核undefinedPaths=[]；完整源tree/ownKeys/undefinedPaths在copy前后不变、clip=source。baseline目标等于paste前目标；after目标=clip且paste不改clip的tableId/createdAt/revision。第一次clip createdAt3166966.5/revision17，area本型正常再copy的createdAt3168967.800000012/revision18；这是新的source export，不误称metadata仍相同。重开source descriptor=after、clipboard=null且clipboard_empty。

这里只证明真实导出的descriptor投影与生命周期观察，不推断内部fields全集、所有对象深拷贝引用、TTL或全部Store语义。

## candidate、save、panel0、find、重开

39条非认证API、8条business wire，全部HTTP200/code0；wire为3条正式area query、save1/find1及其它view重开query3。未对附带其它view扩展产品验收。候选窗口`[12,13)`恰一个目标area物理getData，qobs target/operation/success/logicalGetDataCalls1对应；不把baseline或其它view重开算重复candidate。

| 事件 | 实际时点（2026-10-30 UTC） |
| --- | --- |
| 显式updateCanvas request / response | 19:45:41.983 / 19:45:42.018 |
| 正常导航panel、editorCount0 | 19:45:42.234 |
| 新findById请求 | 19:45:42.373 |
| 新目标area200 getData请求 | 19:45:42.769 |

退出实际page.goto到`#/panel/index`并等诊断/back-icon隐藏，**不是工具栏后退点击**。saveCount=1；save/find同resource，目标type=area，完整customFilter严格等于clip/after，重开request/descriptor/result保持。snapshot字段为null且相等，只核其值，不能据此声称绑定唯一持久版本号。

pageErrors=[]、wireCaptureFailures=[]，共享runtimeErrors计数1→1，不等于全部console/resource无错误。最后明确保留 **area200已显式保存**，未恢复原stock-line500、liquid500或全部hidden配置。

## 三张PNG与全部发现

三张原图均实际view_image查看，419×316、8-bit RGB，SHA/签名/CRC/zlib有效。before为4点面积2670/1284/563/576；after/reopened为5点3218/1284/563/1141/555，店名和金额可辨，未见空白/NoData。纵轴自动3000→3500、重开toast/选择框裁边不要求像素或PNG字节相等。本轮标签是可见普通金额，不继承其它批次percent标签结论。

**NB01 / 非阻断：yAxis两个UI附加键save→find省略。** baseline=candidate=save，find=reopen请求；只丢`yAxis[0].axisType="yAxis"`及`seriesId="1793083721146-yAxis"`。字段ID、summary、其它轴、customAttr/customStyle等所比配置保持，整树与结果无损。公开前端附加键/SDK typed字段边界与省略相符，本报告不重审其实现。保留1项对象相等失败，不删键归一化，不称全配置逐键/逐字节恢复，也不把持久化UI附加键升级为新must-have。

**NB02 / 非阻断：初始stage旧名。** `initial_target_liquid500_reported`仍在，但实际typeControl为“K 线图”、freeze为saved stock-line500，后续raw type=area。本报告按实际UI control/request判断，不当作liquid初态或已恢复原始状态。Topology-r578是较早pre_date_columns_runtime时点材料，不因hash匹配就称它已记载本r008最终运行；Context另明确新入口/未来独立2/3，历史文字不回写。

## 已查无问题、未查、残余与准入预测

已查未见新阻断：16处卡/17次内层引用、固定Goal/Cases/Design真实路径、driver/freeze执行摘要、当前action/target时序、字段/可选轴、13目录、CSV三阶段完整分组、原wire与qobs、16descriptor、source再copy、物理1/logical1/save1、正常panel0→find→query、空clip、3PNG和历史r007原字节/四缺口保全。C1独立3/3报告与格式固定落盘的review_ref、当前候选runner、两日志摘要已核，复用释放依赖，不重跑测试或第四轮。

未检及原因：本lane只读新原件，未独立亲跑UI/HTTP/DB，未重新审工具设计、全产品源码diff、全部浏览器bundle/后端构建身份；未测所有结构/负向/保存失败/未保存、所有变体/移动/lib/Profile/数据库或真实多身份权限，未承担最终KB/Dashboard/closeout/reconciliation/Stop Gate。原area协议释放依据为另一独立lane报告；observer作者身份限制已明示，不伪装独立工具验收。

同类残余：旧r007缺口仍是旧入口历史；本r008 required set已全量对账，无其它同类缺项。NB01是附加键显示层差异，NB02是stage名，不能由它们推断其它类型准入或所有配置恢复。旧r002—r006失败、circle trackClick、ubo/runtime、C2V-005、真实权限和完整0/49按原冻结结论保留，当前结果不关闭它们。

**准入预测：可吸收r008当前正确入口和本次正常运行列，无需为本包机械第3轮或代修NB01/NB02。** 后续若改证据或提高声明按实际delta与累计剩余预算处理。不得将原r001历史PARTIAL、r007坏Context改写为当时已准入；不缩38/49，不因当前有界通过关闭Goal。项目无Session registry工具，不称程序化注册表校验。

## Read Manifest

16处卡/15唯一文件，写前再次摘要复核；重复Goal只列一次。17次Context/admission依赖另表，不以外层hash替代内层核验。

| 路径（相对仓库根） | SHA-256 |
| --- | --- |
| Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/Goal.final.json | 4db931a6764a8c48345e7e8358e579550a9bc98594bf1654647716d72b9678c4 |
| Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/MVP-20261027/UiIntegrationCases-r002.json | e365ef111582ef84f20f26e6136854409b7fc66bb0931cae40a9df5318036d55 |
| Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/MVP-20261027/runtime-fixtures/TeaMaterialExtended-r001.csv | abc8bed0862129d58724bcefff2563862e48d1ea057365ae8d5d2c853e64472b |
| Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/MVP-20261027/reviews/AreaMissingColumnsValidation-r001.md | 44d2160bf8bf65c3839ce6bde0f910986e8197a3d61089a84d697eb98940646c |
| Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/MVP-20261027/reviews/C1THeatmapPrimaryDataValidation-r003.md | be82d391287f64f6c29e51f3c2660d9d695cc3131629a9d55937c2620ff80e04 |
| Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/MVP-20261027/evidence/THeatmapPrimaryData-runner-format-landed-r001.json | fb2a000dc5880cafbe472a44da302b94a74cdac23fbd23c9fc6298625dbdd757 |
| Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/MVP-20261027/evidence/AreaMissingColumns-events-r008.json | 56bf758de5e505b8bfb486ca7e9f2978e5ecf812a18296a2eb40ae0c4c44a4c7 |
| Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/MVP-20261027/evidence/AreaMissingColumnsToolFreeze-r008.json | 368ce9d262303ae906f9a641fd2e0f34b1690ed2569f498447b5081edebb8a0d |
| Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/MVP-20261027/runtime-state-tools/observe-area-missing-columns-r008.js | 797539152d5c07aab9bc2c9d1cbb134b1f0097ddaf0cd3d208e9c6b93dbe8683 |
| Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/planning/ContextBootstrap-AreaMissingColumnsRuntime-r008.json | 5121f439c3b9caba69ab9980dbe824903c36c057e3032199b0c82ef2ac580555 |
| Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/planning/area-missing-columns-runtime-admission-r008.json | 518a84747d4a80aa7e05c42ce264fed15a9730f1c2d077f97854ee711fa77ca9 |
| Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/MVP-20261027/evidence/AreaMissingColumns-before-r008.png | 0ae627b79b9848e99042d7ac1143c881c5b396f411daae4416ce8a1ecb20fba2 |
| Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/MVP-20261027/evidence/AreaMissingColumns-after-r008.png | 2c017ec353258548e1dc871ec0fea6ad7e491c82aceda7155f0dd167d237c635 |
| Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/MVP-20261027/evidence/AreaMissingColumns-reopened-r008.png | 9371405ed7abe8db9a403b0a1680a59ce69568492ac5b04a7bd452e612165106 |
| Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/planning/Topology-actual-r578.json | 7163e3e63e80d03f77db2009cf376e6e4c5830becb2a3437676f61f05169ab2d |

### 内层依赖

| 类别 | 路径 | SHA-256 |
| --- | --- | --- |
| Context required | Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/Goal.final.json | 4db931a6764a8c48345e7e8358e579550a9bc98594bf1654647716d72b9678c4 |
| Context required | Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/MVP-20261027/UiIntegrationCases-r002.json | e365ef111582ef84f20f26e6136854409b7fc66bb0931cae40a9df5318036d55 |
| Context required | Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/MVP-20261027/RuntimeMissingColumnsPlan-r001.json | 1c80cfa3da6a2a319d200f1cea356176eccd5cc0389546013d52ff204ac5c8cc |
| Context required | Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/MVP-20261027/reviews/AreaMissingColumnsValidation-r001.md | 44d2160bf8bf65c3839ce6bde0f910986e8197a3d61089a84d697eb98940646c |
| Context required | Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/MVP-20261027/reviews/UiIntegrationDesignReview-r002.md | 3a56a82c67fc4f68c93d9f2097c79c7a6a70a284a61f522470255a16988a8357 |
| Context required | Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/MVP-20261027/reviews/C1THeatmapPrimaryDataValidation-r003.md | be82d391287f64f6c29e51f3c2660d9d695cc3131629a9d55937c2620ff80e04 |
| Context required | Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/MVP-20261027/evidence/THeatmapPrimaryData-runner-format-landed-r001.json | fb2a000dc5880cafbe472a44da302b94a74cdac23fbd23c9fc6298625dbdd757 |
| Context required | Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/MVP-20261027/runtime-state-tools/observe-area-missing-columns-r008.js | 797539152d5c07aab9bc2c9d1cbb134b1f0097ddaf0cd3d208e9c6b93dbe8683 |
| Context required | Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/MVP-20261027/evidence/AreaMissingColumnsToolFreeze-r008.json | 368ce9d262303ae906f9a641fd2e0f34b1690ed2569f498447b5081edebb8a0d |
| Context required | Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/planning/Topology-actual-r578.json | 7163e3e63e80d03f77db2009cf376e6e4c5830becb2a3437676f61f05169ab2d |
| Context required | core/core-frontend/src/views/chart/components/views/components/ChartComponentG2Plot.vue | cbe650ca9424b73c6ec25e618289ffef5346f6f3ecd7edcdd4d374b09aaa47f5 |
| Context required | core/core-frontend/src/views/chart/components/editor/filter/useChartFilterCopyMvp.ts | b760fffb47db4a8a187cc3dc996d6ddffb5f2b187038da625c5c8e0839d87e5d |
| admission goal | Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/Goal.final.json | 4db931a6764a8c48345e7e8358e579550a9bc98594bf1654647716d72b9678c4 |
| admission completion_contract | Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/MVP-20261027/UiIntegrationCases-r002.json | e365ef111582ef84f20f26e6136854409b7fc66bb0931cae40a9df5318036d55 |
| admission context | Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/planning/ContextBootstrap-AreaMissingColumnsRuntime-r008.json | 5121f439c3b9caba69ab9980dbe824903c36c057e3032199b0c82ef2ac580555 |
| admission design_review | Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/MVP-20261027/reviews/UiIntegrationDesignReview-r002.md | 3a56a82c67fc4f68c93d9f2097c79c7a6a70a284a61f522470255a16988a8357 |
| admission topology | Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/planning/Topology-actual-r578.json | 7163e3e63e80d03f77db2009cf376e6e4c5830becb2a3437676f61f05169ab2d |

### 旧历史保全与C1后续绑定扩读

| 路径 | 实际SHA-256 |
| --- | --- |
| Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/planning/ContextBootstrap-AreaMissingColumnsRuntime-r007.json | 0eac216bd5ea649e950e3a8214b57642191caec09a502af89e23aaf3980cc0c1 |
| Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/MVP-20261027/evidence/AreaMissingColumns-events-r007.json | 68176a55ab5b0dc05d91da0056387ab05da51dc2860e7195a830e7f406deb163 |
| Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/MVP-20261027/evidence/AreaMissingColumnsToolFreeze-r007.json | 6d0fc43314fdee0d3a62c2bf382b547af854fa78e10e19beef8edfe1889727bd |
| Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/MVP-20261027/runtime-state-tools/observe-area-missing-columns-r007.js | e60a294de8a8c55bfc68edce59acaa103fc5bb131705e2eea16020d0ec599a7d |
| core/core-frontend/tests/filter-copy-mvp-renderers/check.mjs | b8dbb5e47463960fe5ae59bda68a2c29b56b1d90baa88dda745b885554f6bc3f |
| Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/MVP-20261027/evidence/THeatmapPrimaryData-format-landed-green-r001.log | aef8cd0c78fdb2f09ca262f066dd23c987323b00d019c2681d5d481f2e8f6af5 |
| Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/MVP-20261027/evidence/THeatmapPrimaryData-format-landed-eslint-r001.log | e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855 |
