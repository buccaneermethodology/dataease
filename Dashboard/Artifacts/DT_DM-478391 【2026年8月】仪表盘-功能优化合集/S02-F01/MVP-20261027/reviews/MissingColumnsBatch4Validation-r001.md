# MissingColumnsBatch4 13类型新运行原件独立验证 r001

- reviewer/source：`/root/bubble_ready_validator_resumed`；reviewed_at：`2026-10-30T19:43:29.279615+00:00`。
- snapshot_id：`S02-MISSING-COLUMNS-BATCH4-VALIDATION-r001`；mode：`full_baseline`；as_of_state：卡绑定的13型运行104个原件、4个历史失败原件及Goal/合同/计划/CSV/独立报告/格式落盘等输入。
- 卡canonical SHA：`841fa11ac08e960c0bf2a7dc4aa9535488d3579be1e35b102b3272fb9d7a3be3`；接收端已复验validate exit0、消费同名prompt；写报告前全部引用摘要再次无漂移。
- **本批新运行证据首轮1/3**。C1矩阵实现累计最后3/3已由另一独立lane核完，本报告复用其结论与已审格式候选的精确落盘证明，**不重开实现第四轮**；r002/r003/r004只是运行文件修订号。
- 唯一持久输出为本报告，写前不存在。未修改源码、测试、driver、Context、admission、旧证据或Dashboard，未运行产品UI/HTTP/DB/构建/安装/测试，未访问认证信息、XPack实现或私密配置。

## 裁决与声明上限

**PASS_WITH_BOUNDS（13类型本次正常补列运行证据有界通过），新增阻断0；保留3类非阻断发现和全部旧失败/恢复。** 可吸收下列已核source复制、target采用、各型数据协议、显式save、panel0退出、find和重开空clip等列；不等于13类型全部AC、全部变体、P1或Goal通过。

独立只读复算共 **2117项证据断言：2109满足、8处全量配置相等断言不满足**。初组1807项有8处差异，补核冻结轴/字段目录/历史失败/格式落盘310项均满足；8处差异未删键归一化或改成全绿。计数包含摘要、结构、时序和数据检查，不是产品验收通过率。

本Reviewer此前参与首型area observer候选编写；本13型由root改造执行，矩阵源码由独立`/root/local_basemap_reviewer`审查。本lane独立核新CSV/原件/截图，不对自己旧observer基础作独立实现验收，也不将日志复算称为独立亲跑runtime。

原 **38项义务（P1=12、P2=26）**、49内置类型分母不变；完整类型仍 **0/49**，真实权限`BLOCKED/NOT_RUN`，插件installed unknown。C2原3/3轮`BLOCKED / C2V-005`与旧ubo/runtime等残余保持，不更新Coverage或生命周期。

## 原AC、冻结配置与逐层绑定

AC-MVP-F01-01要求全部eligible类型可作为source复制、target粘贴同dataset有效基本多条件整树；本13型属于原49的缺列补证。AC-MVP-F01-09要求显式正常保存后离开编辑器再重开，完整基本树/分组/运算符/值及结果一致。本批只核正常路径，不由此关闭保存失败、未保存、真实权限或全部类型义务。

读取冻结prompt、原Goal/AC、UiIntegrationCases-r002、RuntimeMissingColumnsPlan-r001的13型配置及原审查边界；复用RuntimeTypeEvidenceValidation-r001和准备审查r001，不重开旧设计/负向/图片/地图/Slice A预算。`MissingColumnsBatch4-r001.json` SHA `c54cbdaa57460b50a4f4f7714426f0639a5016ad8e3688efe37d2722a447fd20`仅为Builder索引，未直接信其bool。

卡 **119处引用、118个唯一文件** 全部SHA匹配。13 Context的required refs共 **142次**（前12各11，pivot10）；13 admission五依赖共 **65次**，逐层path+SHA均匹配。13份均approved/action=builder、target=`local://127.0.0.1:7070/dataeasev3/S02_MVP_Runtime_20261027`，freeze/admission均早于对应运行；driver freeze/start/end/current SHA一致。Context objective/AC01+09/write_scope与真实类型和专用fixture一致。

独立核冻结计划 **43个轴配置** 的字段id/dataeaseName/deType及显式summary，核声明清空的可选轴；mix右侧由真实right.fields排除series/city额外分组。字段目录HTTP/业务码成功，不把fieldsReady自报当完整catalog证明。正式配置链差异仅NB01。

身份：resource=`1312476889213964288`、dataset=`1312472054565572608`、target=`7520752064427724800`；source500=`7520741153101058048`，source200=`7521402539875504128`。截图原标题“指标卡”不用于识别类型，以真实getData/save/find.type与画面交叉判断。

## 独立CSV oracle与各型协议

CSV `runtime-fixtures/TeaMaterialExtended-r001.csv` SHA `abc8bed0862129d58724bcefff2563862e48d1ea057365ae8d5d2c853e64472b`。以Decimal独立递归解释AND/OR树：amount>200/500与shop属于果元店/南都店/香橙店/乐园店/红叶店/水围店的枚举子树相与，不用单叶threshold替代整树。

| threshold | 命中ID | 行数 | amount总额 | target总额 |
| --- | --- | ---: | ---: | ---: |
| 200 | 3,5,11,12,13,14,15,16,17,18,20,21,23,25 | 14 | 6761 | 8161 |
| 500 | 3,5,11,13,16,18,21,25 | 8 | 5093 | 5893 |

正式baseline/candidate/reopen逐个tableRow与渲染leaf以键值多重集核对，不假定SQL顺序。固定字段：shop1793083721149、series1793083721157、city1793083721151、amount1793083721146、open1793083721158、target1793083721162。本fixture open与amount数值相同，仍检查不同字段ID，避免数值巧合掩盖选错轴。

| 类型 | 实际协议 | baseline→candidate；candidate/reopen组数 |
| --- | --- | --- |
| bar-group | main: shop,series / sum(amount) | 200→500；main:6 |
| bar-group-stack | main: shop,series,city / sum(amount) | 500→200；main:11 |
| percentage-bar-stack | main: shop,series / sum(amount) | 200→500；main:6 |
| percentage-bar-stack-horizontal | main: shop,city / sum(amount) | 500→200；main:9 |
| box-plot | main: shop,series / median(open) | 200→500；main:6 |
| chart-mix | left: shop / sum(open)；right: shop / sum(target) | 500→200；left:5 / right:5 |
| chart-mix-group | left: shop,series / sum(open)；right: shop / sum(target) | 200→500；left:6 / right:4 |
| chart-mix-stack | left: shop,city / sum(open)；right: shop / sum(target) | 500→200；left:9 / right:5 |
| chart-mix-dual-line | left: shop,series / sum(open)；right: shop / sum(target) | 200→500；left:6 / right:4 |
| progress-bar | main: shop / sum(target,amount) | 500→200；main:5 |
| sankey | main: shop,series / sum(amount) | 200→500；main:6 |
| t-heatmap | main: shop,series / sum(amount) | 500→200；main:8 |
| table-pivot | main: shop,series / sum(amount) | 200→500；main:6 |

### 关键复算结果

shop×series amount结果如下；bar-group、percentage、sankey、矩阵、pivot按自身实际形态核对应分组，不套折线协议：

| shop / series | 500 | 200 |
| --- | ---: | ---: |
| 果元店/A | 2091 | 2091 |
| 果元店/B | 579 | 1127 |
| 南都店/A | 680 | 680 |
| 南都店/B | 604 | 604 |
| 乐园店/A | 563 | 563 |
| 水围店/A | 576 | 933 |
| 水围店/B | 无该组 | 208 |
| 香橙店/A | 无该组 | 555 |

bar-group-stack另按city拆分，500为7组、200为11组；horizontal百分比/mix-stack左侧按shop×city，500为6组、200为9组，逐组精确匹配，不仅核总额。

**box-plot按open原始样本中位数和箱线统计，不能用sum。** 三阶段tableRow/median/value逐组一致，同时核low/q1/median/q3/high/count/outlierCount/outliers；本fixture无outlier，线性插值分位均匹配：

| shop / series | median200 | median500 |
| --- | ---: | ---: |
| 果元店/A | 743 | 743 |
| 果元店/B | 337 | 579 |
| 南都店/A | 680 | 680 |
| 南都店/B | 604 | 604 |
| 乐园店/A | 563 | 563 |
| 水围店/A | 466.5 | 576 |
| 水围店/B | 208 | 无该组 |
| 香橙店/A | 277.5 | 无该组 |

例果元店/A样本546/743/802：low546、q1=644.5、median743、q3=772.5、high802。轴字段虽带summary=sum，box实际输出是分布统计，不能误算2091。中位数合计3879/3745仅是复算辅助量，不是原始总额6761/5093。

**四mix左右分别验证。** left用open：mix按shop、group/dual-line按shop×series、stack按shop×city；right均按shop求target和，不跟随left的series/city。每侧tableRow/fields/嵌套series data/quota identity都核，不只核左侧。left和为6761/5093，right和为8161/5893。

| shop | amount/open sum200 | target sum200 | amount/open sum500 | target sum500 |
| --- | ---: | ---: | ---: | ---: |
| 果元店 | 3218 | 3818 | 2670 | 3070 |
| 南都店 | 1284 | 1484 | 1284 | 1484 |
| 乐园店 | 563 | 663 | 563 | 663 |
| 水围店 | 1141 | 1441 | 576 | 676 |
| 香橙店 | 555 | 755 | 无该组 | 无该组 |

**progress-bar**按target目标、amount实际分别核两系列/tableRow。500实际/目标依店为86.97%、86.52%、84.92%、85.21%；200为84.28%、86.52%、84.92%、79.18%、73.51%，与三张原图逐项吻合。

**百分比两型**raw金额按sum，画面比例另以同shop金额为分母复算。竖型果元A/B从64.98%/35.02%变78.31%/21.69%；横型500果元南京/深圳30.04%/69.96%，200南京/杭州/深圳35.39%/6.56%/58.05%。其余南都52.96%/47.04%、乐园100%、水围81.77%/18.23%或100%、香橙100%亦相符，不把金额×100当占比。

**矩阵t-heatmap**主数据tableRow、extColor=amount sum，yAxis为空；三阶段辅助data=[]且tableRow非空，500六格/5093→200八格/6761，重开八格。baseline早期surface probe只抓到loading SVG，不能单凭该probe证明矩阵；稍后before PNG有6格，after/reopen probe为可见405×286 CANVAS。

**pivot**是真实S2的shop行、series列、amount指标。200的A列4822/B列1939/总6761，500的A列3910/B列1183/总5093；逐店行小计和缺组横杠均匹配，重开保持，不用通用G2/折线证明替代。

## 整树、请求、保存退出重开

重建 **143个diagnostic capture、208份source/clip descriptor** 的递归ownKeys，tree/ownKeys/undefinedPaths逐项匹配，undefinedPaths均空。源copy前后不变且clip等于源；baseline目标等于paste前目标；after目标等于clip，paste不改clip的tableId/createdAt/revision；正常再次copy本类型作为source，descriptor一致且revision递增；重开树等于after、clipboard=null且clipboard_empty。只限诊断真实导出范围，不声称导出内部fields全集或由JSON恢复undefined。

每型candidateWindow内目标物理getData=1、logicalGetDataCalls=1，target/type/dataset/operation及qobs请求投影一致；raw responseData完整等于qobs.responseData，再独立核CSV及渲染数据。所有wire HTTP200/业务code0，pageErrors=[]、wireCaptureFailures=[]。共享runtimeErrors均1→1，不等于console/resource全无错误。

每型恰一次显式updateCanvas保存；随后正常page.goto至panel、editorCount=0，再新find和新target query；**不是工具栏back点击**。save/find同resource、目标type/整树相等。snapshot字段实际为null且保持相等，**不把null等同绑定唯一持久版本号**。

时间均2026-10-30 UTC。wire还包含其它view重开请求，不算成candidate重复：

| type | api/wire | candidate窗口 | save请求→响应 | panel0 | 新find请求 | 新target query |
| --- | --- | --- | --- | --- | --- | --- |
| bar-group | 40/9 | [13,14) | 18:26:11.321→18:26:11.344 | 18:26:11.558 | 18:26:11.694 | 18:26:12.093 |
| bar-group-stack | 40/9 | [13,14) | 18:26:21.556→18:26:21.572 | 18:26:21.785 | 18:26:21.922 | 18:26:22.323 |
| percentage-bar-stack | 39/8 | [12,13) | 18:30:11.561→18:30:11.584 | 18:30:11.798 | 18:30:12.597 | 18:30:13.012 |
| percentage-bar-stack-horizontal | 39/8 | [12,13) | 18:30:22.131→18:30:22.154 | 18:30:22.371 | 18:30:22.514 | 18:30:22.905 |
| box-plot | 39/8 | [12,13) | 18:30:32.177→18:30:32.199 | 18:30:32.412 | 18:30:32.559 | 18:30:32.957 |
| chart-mix | 39/8 | [12,13) | 18:30:42.680→18:30:42.707 | 18:30:42.923 | 18:30:43.059 | 18:30:43.464 |
| chart-mix-group | 39/8 | [12,13) | 18:30:53.592→18:30:53.611 | 18:30:53.825 | 18:30:53.973 | 18:30:54.390 |
| chart-mix-stack | 39/8 | [12,13) | 18:31:04.749→18:31:04.781 | 18:31:04.997 | 18:31:05.142 | 18:31:05.546 |
| chart-mix-dual-line | 39/8 | [12,13) | 18:31:15.960→18:31:15.979 | 18:31:16.193 | 18:31:16.340 | 18:31:16.743 |
| progress-bar | 39/8 | [12,13) | 18:31:26.393→18:31:26.414 | 18:31:26.630 | 18:31:27.430 | 18:31:27.849 |
| sankey | 39/8 | [12,13) | 18:31:37.448→18:31:37.480 | 18:31:37.696 | 18:31:37.851 | 18:31:38.270 |
| t-heatmap | 67/13 | [40,41) | 18:53:01.374→18:53:01.398 | 18:53:01.608 | 18:53:01.749 | 18:53:02.146 |
| table-pivot | 39/8 | [12,13) | 19:06:36.084→19:06:36.104 | 19:06:36.319 | 19:06:36.458 | 19:06:36.857 |

总api/wire随初始reload/配置自动query不同：两bar各40/9，多数39/8，矩阵67/13；正式目标三阶段均各1。最终专用target明确保存为 **table-pivot500**；不称恢复原liquid或全部hidden配置。

## 修复前后时点与C1已审格式落盘

前11运行18:26:04.109–18:31:39.862Z，属于矩阵主数据修复前；矩阵r004为18:52:52.906–18:53:04.116Z、pivot r003为19:06:29.324–19:06:38.464Z，为修复后运行。前11不能提升为新G2全部回归，后2也不覆盖前11环境。矩阵freeze绑定受审G2 SHA；pivot freeze明确G2 delta后/S2源码不变。本lane没有逐文件验证运行构建身份。

独立C1报告`C1THeatmapPrimaryDataValidation-r003.md`在19:17:54Z产生，SHA `be82d391287f64f6c29e51f3c2660d9d695cc3131629a9d55937c2620ff80e04`，**晚于运行**，可后续独立核原件，不能回写为运行前已有该最终裁决。本批复用其C1累计3/3有界通过，不重跑其测试或开启第四轮。

19:24:54Z的格式落盘固定槽位已复核：当前runner SHA等于已审候选`b8dbb5e47463960fe5ae59bda68a2c29b56b1d90baa88dda745b885554f6bc3f`；当前G2为已审`cbe650ca9424b73c6ec25e618289ffef5346f6f3ecd7edcdd4d374b09aaa47f5`。review_ref及两log SHA匹配，原renderer日志31 PASS/无语义或执行错误、lint日志为空，与槽位记录一致。这是只读后续绑定，不冒充本lane亲跑31测试。旧RED/GREEN仍绑定格式前runner，不称新旧逐字相同。

## 历史失败与恢复

| 旧原件 | 实际失败与证据 | 独立恢复观察 |
| --- | --- | --- |
| percentage-bar-stack r001，18:26:24.419–18:26:29.396Z | baseline真实query后隐藏xAxisExt触发OPTIONAL_AXIS_REMAINS；candidate0/save0 | 18:26:27.710 panel0，重开lastsaved bar-group-stack200、clip空；r002先清可见旧轴再切型，另一次完整成功 |
| 矩阵r002，18:31:39.878–18:32:07.303Z | candidate200有真实tableRow8组/6761、aux data=[]，诊断success采用；随后等canvas20秒超时，save0 | 18:32:05.790 panel0，重开lastsaved sankey500、clip空 |
| 矩阵r003，18:35:43.659–18:36:12.520Z | 同样错误采用200；等canvas:visible20秒超时；失败PNG明确暂无数据，save0 | 18:36:10.372 panel0，重开lastsaved sankey500、clip空 |

两次矩阵candidate tableRow均再次独立CSV核8组/6761；after树200和outcome=success原迹保留。r003失败图已查看，不能称合法空态、成功运行或仅canvas selector问题。r004是主数据修复后另一次完整成功，不覆盖旧失败。r001 preflight-only及pivot旧r001/r002未执行版本不计产品样本。

## 39图与全部发现

39张before/after/reopened均已实际view_image查看，另查看矩阵历史失败图；新图均419×316、8-bit RGB，签名/CRC/zlib/SHA有效。标题、toast、选择框裁边不用于类型或截图逐字节相等判断。

- bar-group 8→6组、group-stack 7→11组，系列/城市柱变化与CSV一致，重开保持。
- 百分比竖型5→4店、横型4→5店，金额及同店占比符合复算。
- box 8→6分布组，箱体/中位/退化单样本线段可见，重开保持。
- 四mix左右轴均可见，4↔5店及系列/城市拆分、目标线与CSV一致，重开保持；不作所有鼠标/像素角度验收。
- progress 4→5条比例相符；sankey 5→4店向A/B，8→6边数据相符，重开保持，未量测流宽精确像素比例。
- 矩阵6→8格且重开8格，非NoData；pivot真实S2行列/小计/总计6761→5093且重开保持。

### NB01：四mix八处轴对象相等差异（非阻断）

四mix各yAxis/yAxisExt两个断言不满足：baseline=candidate=save，但save→find省略：

| 轴路径 | save值 | find/reopen请求 |
| --- | --- | --- |
| yAxis[0].axisType | yAxis | 缺键 |
| yAxis[0].seriesId | 1793083721158-yAxis | 缺键 |
| yAxisExt[0].axisType | yAxisExt | 缺键 |
| yAxisExt[0].seriesId | 1793083721162-yAxisExt | 缺键 |

共8个轴对象差异、16个键差异。find=reopen请求，其余字段ID/summary/结果及整树保持；四mix其它所比配置及其余9型全部所比11个字段链全量相等。公开前端LabelSelector/TooltipSelector附加两键，SDK ChartViewFieldDTO继承链不含两键，与公开typed读写边界相符；这只解释当前差异，不证明运行后端二进制身份。

原AC09的完整基本树和实际结果未受损，因此本局部不阻断；**不得声称全部配置逐键/逐字节恢复**，不删键归一化，不升级成新must-have。

### NB02：普通分组柱和矩阵继承percent格式（非阻断，限制标签声明）

bar-group/group-stack和矩阵显示如2091→209100.00%（含千分位）；真实labelFormatter.type=percent。不能解释为普通金额或店铺占比，数字结论来自raw HTTP/CSV和实际轴/格投影。百分比两型和progress自身的占比/目标比已另算，不与此混用。

四mix/pivot虽也可能保留同一labelFormatter字段，实际显示走各自协议；本报告按原图，不因字段相同推断全部乘100。保留显示限制，不直接认定本批新源码bug，也不把修改普通金额标签新增为本补列前置。

### NB03：driver/Context旧stage、schema与限制文案（非阻断）

实际case_id/type/选择器/query/save/find/finalState正确，仍保留schema_version=s02_area_missing_columns_observation_v1、“切area/仅area-stack”、AREA_*、initial_target_liquid500_reported等旧stage/notes/limits。Context forbidden_actions仍写“当前area200…”。不能按标签把实际类型/threshold记错或称恢复liquid。

Context actual topology前11r575、矩阵r576仍写C1待独立审查、pivot r577写另包；卡r578记录后来的C1裁决且phase为pre_date_columns_runtime。哈希匹配不等于这些文件在描述同一时刻或已单列本Batch4验证。后续台账按实际时间吸收，不回写冻结原件、不追认旧准入。未见这些残留导致资源/UI/DB动作范围扩大。

## 已查无问题、残余、未查与准入预测

已查未见新阻断：119处卡/207次内层引用、13 action/target准入、冻结轴与字段identity、执行SHA、HTTP、descriptor整树复制与再导出、候选物理1/logical1、save1、panel0→find→query、重开空clip、各型独立CSV/投影、39图/PNG完整性、旧失败恢复、C1已审字节及精确格式落盘。NB01–03一次完整列出，当前无需Builder代修本包。

同类残余：13个driver均检查旧area标签并按实际type解释；四mix左右轴全部查到附加键省略，其余9型所比字段未见同类差异。普通分组柱/矩阵百分号格式保持；其它类型/插件/全部显示变体不由本批推断。旧circle trackClick、ubo/runtime、C2V-005仍按原冻结结论未决，pageErrors=[]不能关闭或建立未经证明的因果。前11旧代码运行不与后2混并为全13新源码回归。

未检及原因：本lane仅只读原件，未亲跑独立浏览器/后端HTTP/DB；未重新审计通用observer、全部源码diff或构建身份；未跑全部ts:check/Profile/数据库/移动/panel/lib；未覆盖每型所有变体/全部配对/全部负向、真实多身份/组织/撤权/拒绝、插件installed census；未承担最终KB/Dashboard/full diff/post-closeout reconciliation/Stop Gate。当前其它工作区修改不归本批、不暂存/提交。

辅助核读投影曾因将null可选轴当数组、假定每份freeze都有type而TypeError/KeyError；修正检查器对实际结构的读取后完成，未改原件，不计产品失败或RED。保留正式2117/2109/8计数。

**当前即可吸收13型已核正常列，保留NB01–03、历史失败和前后代码时点；无需机械第二轮，更不能C1第四轮。** 实质证据变化或更强声明按实际delta与剩余预算处理。继续原49类型/38义务未核缺列，完整0/49、真实权限和C2状态不变。项目无Session registry/reconcile/validate工具，不声称程序化注册表校验。

## 冻结Read Manifest

卡119处/118唯一文件，重复Goal只列一次；写报告前再次重算。manifest不替代语义/运行证据。

| 路径（相对仓库根） | SHA-256 |
| --- | --- |
| Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/Goal.final.json | 4db931a6764a8c48345e7e8358e579550a9bc98594bf1654647716d72b9678c4 |
| Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/MVP-20261027/UiIntegrationCases-r002.json | e365ef111582ef84f20f26e6136854409b7fc66bb0931cae40a9df5318036d55 |
| Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/MVP-20261027/RuntimeMissingColumnsPlan-r001.json | 1c80cfa3da6a2a319d200f1cea356176eccd5cc0389546013d52ff204ac5c8cc |
| Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/MVP-20261027/runtime-fixtures/TeaMaterialExtended-r001.csv | abc8bed0862129d58724bcefff2563862e48d1ea057365ae8d5d2c853e64472b |
| Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/MVP-20261027/reviews/MvpAcceptanceReadinessReview-r001.md | fba3b6ad368e085b787cd9a69497f5fb51163397559d718f7596dd014a06d9af |
| Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/MVP-20261027/reviews/C1THeatmapPrimaryDataValidation-r003.md | be82d391287f64f6c29e51f3c2660d9d695cc3131629a9d55937c2620ff80e04 |
| Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/MVP-20261027/evidence/THeatmapPrimaryData-runner-format-landed-r001.json | fb2a000dc5880cafbe472a44da302b94a74cdac23fbd23c9fc6298625dbdd757 |
| Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/MVP-20261027/reviews/RuntimeTypeEvidenceValidation-r001.md | aa856f3cca2bd7df70d8cc448ab7766d056f02ee14f995c3fffa7ddb7b6f9944 |
| Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/MVP-20261027/evidence/MissingColumnsBatch4-r001.json | c54cbdaa57460b50a4f4f7714426f0639a5016ad8e3688efe37d2722a447fd20 |
| Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/planning/Topology-actual-r578.json | 7163e3e63e80d03f77db2009cf376e6e4c5830becb2a3437676f61f05169ab2d |
| Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/MVP-20261027/evidence/BarGroupMissingColumns-events-r001.json | 0dd23ad283792f306862856b01d5df2ef8fc68c9a18440d0e35567cc3e2aacb8 |
| Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/MVP-20261027/evidence/BarGroupMissingColumnsToolFreeze-r001.json | 8e18590be2d95f9cf42d44cff6fb98afa497ac361612ccf4651158912fc4e410 |
| Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/MVP-20261027/runtime-state-tools/observe-bar-group-missing-columns-r001.js | 5e6eed4256e8086123589b545499a351e35554860808e07bb2e141c4b4b360b1 |
| Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/planning/ContextBootstrap-BarGroupMissingColumnsRuntime-r001.json | 252d7c0f44b0a59f37828eb2c33ea5334af74b2520b9fcbfd4dfa01165bffaa7 |
| Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/planning/bar-group-missing-columns-runtime-admission-r001.json | 5b7b3895b1fd0043838fa32edfe632b221730e3e5f8d61420e9f08d8f7639cc7 |
| Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/MVP-20261027/evidence/BarGroupMissingColumns-before-r001.png | 7e0a6b449003458dd0a38bc70d03964353e94feab7c1a8a4655d57250004bd62 |
| Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/MVP-20261027/evidence/BarGroupMissingColumns-after-r001.png | b62beb88d6b35a91bdce98c29074cfcfc612bda346059c67b9996114341fef8d |
| Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/MVP-20261027/evidence/BarGroupMissingColumns-reopened-r001.png | 2c333075287840515c7d4c287486d1319c7af10991df58841da32be599670e32 |
| Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/MVP-20261027/evidence/BarGroupStackMissingColumns-events-r001.json | bffe712796a970c0f85df81b192b2a406371973363ff4f2f170f52e3413e2010 |
| Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/MVP-20261027/evidence/BarGroupStackMissingColumnsToolFreeze-r001.json | 15d125227cafe86cb694c107cb26e8747312683840dd3fe4af1356b38c3da80d |
| Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/MVP-20261027/runtime-state-tools/observe-bar-group-stack-missing-columns-r001.js | 6615ad60de2ac7b867fb9a15480cf2e993eba49996d39bdc2c78bccc6d5e0fc9 |
| Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/planning/ContextBootstrap-BarGroupStackMissingColumnsRuntime-r001.json | 97881ded72694c95cd7d101ef85e93a902191480826fc5dea846dd2cdc37cb45 |
| Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/planning/bar-group-stack-missing-columns-runtime-admission-r001.json | 9feded5421a0e680a4b748cd8999195f3fbe8e2d1c285dbaad79846ee7581722 |
| Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/MVP-20261027/evidence/BarGroupStackMissingColumns-before-r001.png | 669ee06805f590e9952176a2546a4e28f34f8b6a4bbc06430aa3ccb1d1f559ee |
| Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/MVP-20261027/evidence/BarGroupStackMissingColumns-after-r001.png | 62d86f339f415eaf0a73b6f63c2756ba9c3fa64daf425a20b19fe3249633a3a3 |
| Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/MVP-20261027/evidence/BarGroupStackMissingColumns-reopened-r001.png | 38899857190533be3b70eb1a86c22f6f71ce6f519f9a0f6a5ae158f350da2b1b |
| Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/MVP-20261027/evidence/PercentageBarStackMissingColumns-events-r002.json | ae961a898a57cb8c0ad1b517b06a584cdf53065ec412faaf8d52eb748cd07873 |
| Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/MVP-20261027/evidence/PercentageBarStackMissingColumnsToolFreeze-r002.json | 48cc608b17ee830aaf71be527d1ee20690bc3d3db95078455e387ced64636231 |
| Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/MVP-20261027/runtime-state-tools/observe-percentage-bar-stack-missing-columns-r002.js | e0f721c1fa3af5bbd7103f7f884c1d668b4ec2b063c9af41098330fb395b456c |
| Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/planning/ContextBootstrap-PercentageBarStackMissingColumnsRuntime-r002.json | 8c8a63890ea1a64aa863d707cc68c0fc3917e5fc1fac1ea3cbb1b0e861b5e750 |
| Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/planning/percentage-bar-stack-missing-columns-runtime-admission-r002.json | eeba6697620c32721ca089d35a5e0a9d4d76dd3a2532c105123943962ed4d4f8 |
| Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/MVP-20261027/evidence/PercentageBarStackMissingColumns-before-r002.png | ed86c435247311444a715c76055bb53697d1cbe7bbdc68513ccc5fe63779f397 |
| Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/MVP-20261027/evidence/PercentageBarStackMissingColumns-after-r002.png | daea272354dc055ef48248de55596b355e187b0d040198d0877a928f67916ae1 |
| Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/MVP-20261027/evidence/PercentageBarStackMissingColumns-reopened-r002.png | daea272354dc055ef48248de55596b355e187b0d040198d0877a928f67916ae1 |
| Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/MVP-20261027/evidence/PercentageBarStackHorizontalMissingColumns-events-r002.json | 9e5e3577d48fe59435197e8268bd65627d9ca7a0e3f0a0e9f5bfcf61cc4ef80b |
| Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/MVP-20261027/evidence/PercentageBarStackHorizontalMissingColumnsToolFreeze-r002.json | c575df73cc4996060150c0c3ca855bfe14ac2d4416df6da9c9007c2d8b78e015 |
| Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/MVP-20261027/runtime-state-tools/observe-percentage-bar-stack-horizontal-missing-columns-r002.js | e4040ae397a04ba53ed434ee1c308d9ca239ee36a5b69a4220a40c1a62e61f4f |
| Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/planning/ContextBootstrap-PercentageBarStackHorizontalMissingColumnsRuntime-r002.json | 240bf66e2141fb3c6996a6f88b5ba45683ab5c66d5e79874dfed42874c113295 |
| Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/planning/percentage-bar-stack-horizontal-missing-columns-runtime-admission-r002.json | 1256061f724f8a5079d0e8652d01236356562a729ff1750a9a98e0eb70951a98 |
| Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/MVP-20261027/evidence/PercentageBarStackHorizontalMissingColumns-before-r002.png | a4421be4a56367248dbdff308e5e2de912178adde68897a155ca4e133648713b |
| Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/MVP-20261027/evidence/PercentageBarStackHorizontalMissingColumns-after-r002.png | b7d128566cfe3754076d4c07517c0397215438c2015e4c2f9aacd1681627ad83 |
| Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/MVP-20261027/evidence/PercentageBarStackHorizontalMissingColumns-reopened-r002.png | 31588707629e7e6c22fba8f3e9b195a5539325da1a27c58ddb84e012a53f8648 |
| Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/MVP-20261027/evidence/BoxPlotMissingColumns-events-r002.json | c0e44c8088f56977cfbaa9d60ff58a51d9389b2aab815a3e2402706401782c4e |
| Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/MVP-20261027/evidence/BoxPlotMissingColumnsToolFreeze-r002.json | 0f22a6c42fb4be0b6cf1c446c09879e639ffbb37c65b905db3ae3d1882fb73e1 |
| Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/MVP-20261027/runtime-state-tools/observe-box-plot-missing-columns-r002.js | 081ddba6448217c1947d37039f7f867da5f81aa248f594141e7c06b59916cc2d |
| Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/planning/ContextBootstrap-BoxPlotMissingColumnsRuntime-r002.json | 3aae47090adea814db86dfc1cdbaaa10ad7fab27fd52a9e1c2f965ef897e4828 |
| Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/planning/box-plot-missing-columns-runtime-admission-r002.json | 75be216219acbfd4cb437ee296ae0eb0e46c67cf3a1e748cfdbef9f315567337 |
| Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/MVP-20261027/evidence/BoxPlotMissingColumns-before-r002.png | 6599f9e700f28c6b6dcb8991070c8d2713b41611035d8a767a74bebd34f519f5 |
| Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/MVP-20261027/evidence/BoxPlotMissingColumns-after-r002.png | aab030ea0076d2442c59bc0649f4e8b5c0463f9d3786d08afeb632296a333426 |
| Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/MVP-20261027/evidence/BoxPlotMissingColumns-reopened-r002.png | d04849cffa51d3a62e962dd13104587977a15a2c6893af40a04a062c8fd3659b |
| Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/MVP-20261027/evidence/ChartMixMissingColumns-events-r002.json | 69bb1ae0d0b1e349854c28e5420bc7c022dad186cedec62c03bd133a2a3b5a3c |
| Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/MVP-20261027/evidence/ChartMixMissingColumnsToolFreeze-r002.json | fdd938bb56ed34b22573138f4043d51f461cd5f7d119ecc201e2096c8853f1b4 |
| Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/MVP-20261027/runtime-state-tools/observe-chart-mix-missing-columns-r002.js | 43cac21190b451bc5cd0ffe460ffe7a9883b53cdf0729a607230083e1deef523 |
| Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/planning/ContextBootstrap-ChartMixMissingColumnsRuntime-r002.json | 82752be61569dc24d44f906e39cc7c72072d0944963fe5d106e5c2108d22dcdc |
| Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/planning/chart-mix-missing-columns-runtime-admission-r002.json | 21851e1d331a5a957eea1ef9efdbf473f5eec9ff44814bcbe82bee2b87b7cefa |
| Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/MVP-20261027/evidence/ChartMixMissingColumns-before-r002.png | 8b8e6c1d45cc833d5f74244be56d8bd9ee9cb6d17c692d894264eed6397f38f1 |
| Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/MVP-20261027/evidence/ChartMixMissingColumns-after-r002.png | 16a36c797b5a30445260235396e82a7f6ee3009dff1bcbdaaa5b5ef0edd23c31 |
| Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/MVP-20261027/evidence/ChartMixMissingColumns-reopened-r002.png | b1d635b93de26e399fc1deff570ce762df955004c360dc08c8cf685e13571fcb |
| Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/MVP-20261027/evidence/ChartMixGroupMissingColumns-events-r002.json | fbadb91a4c24615a92d642214fd8bad1bb47f988cbb186c21ae8a28a670662e1 |
| Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/MVP-20261027/evidence/ChartMixGroupMissingColumnsToolFreeze-r002.json | df7c3953b263d34e558bed81591de1d32518e607f05c93f6a6d32974eccec5c3 |
| Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/MVP-20261027/runtime-state-tools/observe-chart-mix-group-missing-columns-r002.js | 6360814ac6a6120f295f65dce6b9a5d7b1acd153256aa6c179c88fdf2f37258b |
| Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/planning/ContextBootstrap-ChartMixGroupMissingColumnsRuntime-r002.json | cdddd218797d59261b8a5bdc4b2a6187d8476d75337605875783e38f3d77f50f |
| Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/planning/chart-mix-group-missing-columns-runtime-admission-r002.json | 802a65c6b0afe917636e290d9b433199257122a25d37ecc8669476040df2b084 |
| Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/MVP-20261027/evidence/ChartMixGroupMissingColumns-before-r002.png | cfc09fb08a7d46b3f128365326b3b2bb1e6a6be34e3c4bbb5fbdf735e6af295a |
| Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/MVP-20261027/evidence/ChartMixGroupMissingColumns-after-r002.png | 2bbe635fdf0371b40d150a94e74dd97a527f8e1eb0f3507ef65676eb202f87e3 |
| Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/MVP-20261027/evidence/ChartMixGroupMissingColumns-reopened-r002.png | f06a24480d4aa7cea7ae9c75245c7e662f3bd1a4a33b4cae1f9b8fce4f21231c |
| Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/MVP-20261027/evidence/ChartMixStackMissingColumns-events-r002.json | ef5364df67d26ab11ed2b9ec211fe8ecfec375a7c45b3922ee4cf7c5896b7365 |
| Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/MVP-20261027/evidence/ChartMixStackMissingColumnsToolFreeze-r002.json | c593caaa203a8b51fd1572f79660e2a324156c818eef5bbeca03e4c7ffc4b0cf |
| Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/MVP-20261027/runtime-state-tools/observe-chart-mix-stack-missing-columns-r002.js | c6e7602b50f132765e6ed76da23caf77d720c19ba15d639f303165c158872fa6 |
| Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/planning/ContextBootstrap-ChartMixStackMissingColumnsRuntime-r002.json | a5515679f1ebba0aea0bcc442a9e89f539605665e4d3508cb65a1e9a5272e2dc |
| Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/planning/chart-mix-stack-missing-columns-runtime-admission-r002.json | 1bc1527a56747ec69266e16e1b09e1086f883b4f0ec4ec6ccffe4dffeae99efa |
| Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/MVP-20261027/evidence/ChartMixStackMissingColumns-before-r002.png | 75d6e7d5e0dbf4931d06cf739a476a7007f675a6788cc963f15fc6fc4d390520 |
| Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/MVP-20261027/evidence/ChartMixStackMissingColumns-after-r002.png | b14d86f6742c31ed692168c45a71df81111311778e5766d4caa9d5196cdb1a31 |
| Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/MVP-20261027/evidence/ChartMixStackMissingColumns-reopened-r002.png | 7df2b6c345554addbcefce9d18531ea1c484f4a54419c9cc155a843b2ea58ff7 |
| Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/MVP-20261027/evidence/ChartMixDualLineMissingColumns-events-r002.json | 9d44dafd9684388b84689d4775e6a58bdea99c6d482a4a7cd3213bc69d09ba2b |
| Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/MVP-20261027/evidence/ChartMixDualLineMissingColumnsToolFreeze-r002.json | 31adc70953629daa8df4bc83b68ce352a9a86577e1b91d5ab7d0f32f96da8e40 |
| Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/MVP-20261027/runtime-state-tools/observe-chart-mix-dual-line-missing-columns-r002.js | 5daf6a75f303d87b5328b36e59c046831471314493609a534f53060f71aa644b |
| Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/planning/ContextBootstrap-ChartMixDualLineMissingColumnsRuntime-r002.json | a2d3abe3d4e19104f49fe6b9fd1cb1012706aa5ae772a09885afbe044daafa36 |
| Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/planning/chart-mix-dual-line-missing-columns-runtime-admission-r002.json | fa59c1531e0786890c497937d7b844dba981cbc11a946b3c6b7e7954279ec4e5 |
| Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/MVP-20261027/evidence/ChartMixDualLineMissingColumns-before-r002.png | a0d5003e66c6dd1b9c4d363b5c3d0b2f61fbeaa6a0fe1b6be37f7a749112c3ab |
| Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/MVP-20261027/evidence/ChartMixDualLineMissingColumns-after-r002.png | 4f4652a6605f33069a2e70e247d180013cdcf4e873c115e485db31397f871c25 |
| Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/MVP-20261027/evidence/ChartMixDualLineMissingColumns-reopened-r002.png | ef7258f2b34316eff100dece32462c2dec05ec50681bda6b98056783c9f908be |
| Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/MVP-20261027/evidence/ProgressBarMissingColumns-events-r002.json | 69665907454ecb8b1f45f3745ea55b7780807252150509d518ee88a74615137b |
| Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/MVP-20261027/evidence/ProgressBarMissingColumnsToolFreeze-r002.json | 39520da148b5ec0e56581462cb7a1a2bcfdf2c9b270b149c18e999485f9f9840 |
| Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/MVP-20261027/runtime-state-tools/observe-progress-bar-missing-columns-r002.js | af01cf8a3168ac16c8e57e5bd1d8f923c97a296105d5ce232b5f6fecd094e4f3 |
| Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/planning/ContextBootstrap-ProgressBarMissingColumnsRuntime-r002.json | aa7f14f06e1df429a84128d7460a1431e1090fbee0afc5651c5536e664b1b0cb |
| Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/planning/progress-bar-missing-columns-runtime-admission-r002.json | c605315ab89717d65fbd7ac874593a9ee3c9bf5867d9e785ee198bee110b31d7 |
| Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/MVP-20261027/evidence/ProgressBarMissingColumns-before-r002.png | 01b7e4a09bd7fcdaaf2a41141b1f8a298a05e81f8ed55018069ca6747994bf8e |
| Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/MVP-20261027/evidence/ProgressBarMissingColumns-after-r002.png | 341f45791093d71a8ad202941137cd4dc4538b46676c0dba39e7ce07ec0519fb |
| Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/MVP-20261027/evidence/ProgressBarMissingColumns-reopened-r002.png | 341f45791093d71a8ad202941137cd4dc4538b46676c0dba39e7ce07ec0519fb |
| Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/MVP-20261027/evidence/SankeyMissingColumns-events-r002.json | ba51dfafc53da92d43c81d6bc5df8c90274b0acbd37ba16ac76e1756b93196b0 |
| Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/MVP-20261027/evidence/SankeyMissingColumnsToolFreeze-r002.json | 8c4a8486ef77064839ca11873a1d7d707acedf49e9e977c0475f048b3639c284 |
| Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/MVP-20261027/runtime-state-tools/observe-sankey-missing-columns-r002.js | ffa78b6944e7d034b6590fa7816a7a21b2466812d8882839757a3ca643c08869 |
| Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/planning/ContextBootstrap-SankeyMissingColumnsRuntime-r002.json | bcc9db8829303e012de2366da9caa553e21cd7ffc84501d3c5e7f33e33d6d0c5 |
| Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/planning/sankey-missing-columns-runtime-admission-r002.json | 1d23cc277fc98f0932f194cf3337e32aabfd7237c62b85c3cdb25f7f497af86d |
| Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/MVP-20261027/evidence/SankeyMissingColumns-before-r002.png | ccff2f9d5aef24af08480381b13c5e600cc6d9e460425d1133d19d85f2cc7f99 |
| Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/MVP-20261027/evidence/SankeyMissingColumns-after-r002.png | a85be23928039c80186172a1ac5c2142a26d4c5447ff44273692a11f604f5a92 |
| Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/MVP-20261027/evidence/SankeyMissingColumns-reopened-r002.png | beeefbebc656e22e1e02f685f7ec618e769a067f6f05d70703d65d09ee66974e |
| Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/MVP-20261027/evidence/THeatmapMissingColumns-events-r004.json | a562f98ffa561ea3779e3056749ecfce08e7623664862f630aec4197bd71fb48 |
| Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/MVP-20261027/evidence/THeatmapMissingColumnsToolFreeze-r004.json | a109451d732c72928655a5068ba7c49f24792e4ccfd56d699807c548d99c6501 |
| Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/MVP-20261027/runtime-state-tools/observe-t-heatmap-missing-columns-r004.js | 32dc8e86ca1aed0e17d276b5e0086718e1bf8b928086ae93721d0c0954eb38ed |
| Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/planning/ContextBootstrap-THeatmapMissingColumnsRuntime-r004.json | 8625cf02a118909049b61ce8b21fcc83d0015e5227d895182ef24757ad29bbc8 |
| Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/planning/t-heatmap-missing-columns-runtime-admission-r004.json | 9b00ce63b5f80f2c6924e6bd1345aaa581ed278ff089871817cb74317b9f1148 |
| Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/MVP-20261027/evidence/THeatmapMissingColumns-before-r004.png | 2d186bdebbbf8e6663e0ececb63e991a00f74aeaa6c7d8b8301e6cc25b872733 |
| Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/MVP-20261027/evidence/THeatmapMissingColumns-after-r004.png | 06c8cfdc19425478de880e1eabd43d03dc3ed45738206c17fd8581085a3603b6 |
| Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/MVP-20261027/evidence/THeatmapMissingColumns-reopened-r004.png | 10b498324ca36e53750ad7ee32b53099eca9303ff52b28aac9ffb78e6587ad79 |
| Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/MVP-20261027/evidence/TablePivotMissingColumns-events-r003.json | 0611dea65b139a12da535c9adc2d562e60f234800ba4e012bf063a237bc74267 |
| Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/MVP-20261027/evidence/TablePivotMissingColumnsToolFreeze-r003.json | 78bc8c8b038e8b3a427aa804b3d7fd6efc7bfb5d2225451023bcb526f022c66e |
| Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/MVP-20261027/runtime-state-tools/observe-table-pivot-missing-columns-r003.js | cff260a517b92350a4766444e469148d019908743677d532ee5572e6a0b51d41 |
| Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/planning/ContextBootstrap-TablePivotMissingColumnsRuntime-r003.json | 2d2c1dad299e51d54143f4ca6b17ee85c8eb6d5cfd6864f6f0e64f37a7f5a43a |
| Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/planning/table-pivot-missing-columns-runtime-admission-r003.json | 9634dd417d31cbc275251577e12fb449c8760c4b239c3d4eb1cdb143c3165f69 |
| Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/MVP-20261027/evidence/TablePivotMissingColumns-before-r003.png | 3e63dfe7a01a42bdca54018433ec38e46d4b99a55ed7e60c6f31459c07999505 |
| Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/MVP-20261027/evidence/TablePivotMissingColumns-after-r003.png | af37f94ec247318a5d9fa3d891260bd051ffcc05ed9bcfaa5cccee941205c929 |
| Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/MVP-20261027/evidence/TablePivotMissingColumns-reopened-r003.png | 6ea2fe7125ac4b76f41d670813b48694b345fe8f5897952c0a24514345c7a996 |
| Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/MVP-20261027/evidence/PercentageBarStackMissingColumns-events-r001.json | d4500246241e968366d2aaac6d481f10f9975fb5a4682677ec00255adb274697 |
| Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/MVP-20261027/evidence/THeatmapMissingColumns-events-r002.json | ae79cd6496cdbd13e0ceee5457d7f4d946c6728bf3fc25f2227d12cdf1601f7f |
| Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/MVP-20261027/evidence/THeatmapMissingColumns-events-r003.json | a6a850c9a64cfd9a9efe49f29f44d2a9b7730a52ede0eb1dfa35b4116d64c88d |
| Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/MVP-20261027/evidence/THeatmapMissingColumns-surface-failure-r003.png | d21d997002d5cec733c2069b2ab716281b53e84015bbf2b323c2ff880059c6ca |

### 142个Context与65个admission内层引用

| 所属文件 | 类别 | 路径 | SHA-256 |
| --- | --- | --- | --- |
| ContextBootstrap-BarGroupMissingColumnsRuntime-r001.json | Context | Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/Goal.final.json | 4db931a6764a8c48345e7e8358e579550a9bc98594bf1654647716d72b9678c4 |
| ContextBootstrap-BarGroupMissingColumnsRuntime-r001.json | Context | Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/MVP-20261027/UiIntegrationCases-r002.json | e365ef111582ef84f20f26e6136854409b7fc66bb0931cae40a9df5318036d55 |
| ContextBootstrap-BarGroupMissingColumnsRuntime-r001.json | Context | Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/MVP-20261027/reviews/UiIntegrationDesignReview-r003-C234.md | 5d4c26ebda1ba9847e19ea1d04caa82d26a54cee01685a167d8313aa3114f4b2 |
| ContextBootstrap-BarGroupMissingColumnsRuntime-r001.json | Context | Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/MVP-20261027/reviews/MvpAcceptanceReadinessReview-r001.md | fba3b6ad368e085b787cd9a69497f5fb51163397559d718f7596dd014a06d9af |
| ContextBootstrap-BarGroupMissingColumnsRuntime-r001.json | Context | Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/MVP-20261027/RuntimeMissingColumnsPlan-r001.json | 1c80cfa3da6a2a319d200f1cea356176eccd5cc0389546013d52ff204ac5c8cc |
| ContextBootstrap-BarGroupMissingColumnsRuntime-r001.json | Context | Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/MVP-20261027/runtime-state-tools/observe-bar-group-missing-columns-r001.js | 5e6eed4256e8086123589b545499a351e35554860808e07bb2e141c4b4b360b1 |
| ContextBootstrap-BarGroupMissingColumnsRuntime-r001.json | Context | Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/MVP-20261027/evidence/BarGroupMissingColumnsToolFreeze-r001.json | 8e18590be2d95f9cf42d44cff6fb98afa497ac361612ccf4651158912fc4e410 |
| ContextBootstrap-BarGroupMissingColumnsRuntime-r001.json | Context | Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/planning/Topology-actual-r575.json | 7f80e4009b189984ed709bfd5adcc397a4c868e0da8e8fcbaa27c166cb64c3c1 |
| ContextBootstrap-BarGroupMissingColumnsRuntime-r001.json | Context | Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/MVP-20261027/reviews/SliceARolePortsValidation-r003.md | 726720f12d85ec48a459d53058351d9e7580a267f3a696fa7f08587e73d58e28 |
| ContextBootstrap-BarGroupMissingColumnsRuntime-r001.json | Context | core/core-frontend/src/views/chart/components/editor/filter/useChartFilterCopyMvp.ts | b760fffb47db4a8a187cc3dc996d6ddffb5f2b187038da625c5c8e0839d87e5d |
| ContextBootstrap-BarGroupMissingColumnsRuntime-r001.json | Context | core/core-frontend/src/views/chart/components/editor/index.vue | 9c64555a38982216c1688012fdf7fa02433fce3b25553bd6e4ab9dffd12381fd |
| bar-group-missing-columns-runtime-admission-r001.json | goal | Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/Goal.final.json | 4db931a6764a8c48345e7e8358e579550a9bc98594bf1654647716d72b9678c4 |
| bar-group-missing-columns-runtime-admission-r001.json | completion_contract | Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/MVP-20261027/UiIntegrationCases-r002.json | e365ef111582ef84f20f26e6136854409b7fc66bb0931cae40a9df5318036d55 |
| bar-group-missing-columns-runtime-admission-r001.json | context | Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/planning/ContextBootstrap-BarGroupMissingColumnsRuntime-r001.json | 252d7c0f44b0a59f37828eb2c33ea5334af74b2520b9fcbfd4dfa01165bffaa7 |
| bar-group-missing-columns-runtime-admission-r001.json | design_review | Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/MVP-20261027/reviews/UiIntegrationDesignReview-r003-C234.md | 5d4c26ebda1ba9847e19ea1d04caa82d26a54cee01685a167d8313aa3114f4b2 |
| bar-group-missing-columns-runtime-admission-r001.json | topology | Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/planning/Topology-actual-r575.json | 7f80e4009b189984ed709bfd5adcc397a4c868e0da8e8fcbaa27c166cb64c3c1 |
| ContextBootstrap-BarGroupStackMissingColumnsRuntime-r001.json | Context | Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/Goal.final.json | 4db931a6764a8c48345e7e8358e579550a9bc98594bf1654647716d72b9678c4 |
| ContextBootstrap-BarGroupStackMissingColumnsRuntime-r001.json | Context | Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/MVP-20261027/UiIntegrationCases-r002.json | e365ef111582ef84f20f26e6136854409b7fc66bb0931cae40a9df5318036d55 |
| ContextBootstrap-BarGroupStackMissingColumnsRuntime-r001.json | Context | Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/MVP-20261027/reviews/UiIntegrationDesignReview-r003-C234.md | 5d4c26ebda1ba9847e19ea1d04caa82d26a54cee01685a167d8313aa3114f4b2 |
| ContextBootstrap-BarGroupStackMissingColumnsRuntime-r001.json | Context | Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/MVP-20261027/reviews/MvpAcceptanceReadinessReview-r001.md | fba3b6ad368e085b787cd9a69497f5fb51163397559d718f7596dd014a06d9af |
| ContextBootstrap-BarGroupStackMissingColumnsRuntime-r001.json | Context | Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/MVP-20261027/RuntimeMissingColumnsPlan-r001.json | 1c80cfa3da6a2a319d200f1cea356176eccd5cc0389546013d52ff204ac5c8cc |
| ContextBootstrap-BarGroupStackMissingColumnsRuntime-r001.json | Context | Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/MVP-20261027/runtime-state-tools/observe-bar-group-stack-missing-columns-r001.js | 6615ad60de2ac7b867fb9a15480cf2e993eba49996d39bdc2c78bccc6d5e0fc9 |
| ContextBootstrap-BarGroupStackMissingColumnsRuntime-r001.json | Context | Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/MVP-20261027/evidence/BarGroupStackMissingColumnsToolFreeze-r001.json | 15d125227cafe86cb694c107cb26e8747312683840dd3fe4af1356b38c3da80d |
| ContextBootstrap-BarGroupStackMissingColumnsRuntime-r001.json | Context | Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/planning/Topology-actual-r575.json | 7f80e4009b189984ed709bfd5adcc397a4c868e0da8e8fcbaa27c166cb64c3c1 |
| ContextBootstrap-BarGroupStackMissingColumnsRuntime-r001.json | Context | Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/MVP-20261027/reviews/SliceARolePortsValidation-r003.md | 726720f12d85ec48a459d53058351d9e7580a267f3a696fa7f08587e73d58e28 |
| ContextBootstrap-BarGroupStackMissingColumnsRuntime-r001.json | Context | core/core-frontend/src/views/chart/components/editor/filter/useChartFilterCopyMvp.ts | b760fffb47db4a8a187cc3dc996d6ddffb5f2b187038da625c5c8e0839d87e5d |
| ContextBootstrap-BarGroupStackMissingColumnsRuntime-r001.json | Context | core/core-frontend/src/views/chart/components/editor/index.vue | 9c64555a38982216c1688012fdf7fa02433fce3b25553bd6e4ab9dffd12381fd |
| bar-group-stack-missing-columns-runtime-admission-r001.json | goal | Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/Goal.final.json | 4db931a6764a8c48345e7e8358e579550a9bc98594bf1654647716d72b9678c4 |
| bar-group-stack-missing-columns-runtime-admission-r001.json | completion_contract | Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/MVP-20261027/UiIntegrationCases-r002.json | e365ef111582ef84f20f26e6136854409b7fc66bb0931cae40a9df5318036d55 |
| bar-group-stack-missing-columns-runtime-admission-r001.json | context | Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/planning/ContextBootstrap-BarGroupStackMissingColumnsRuntime-r001.json | 97881ded72694c95cd7d101ef85e93a902191480826fc5dea846dd2cdc37cb45 |
| bar-group-stack-missing-columns-runtime-admission-r001.json | design_review | Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/MVP-20261027/reviews/UiIntegrationDesignReview-r003-C234.md | 5d4c26ebda1ba9847e19ea1d04caa82d26a54cee01685a167d8313aa3114f4b2 |
| bar-group-stack-missing-columns-runtime-admission-r001.json | topology | Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/planning/Topology-actual-r575.json | 7f80e4009b189984ed709bfd5adcc397a4c868e0da8e8fcbaa27c166cb64c3c1 |
| ContextBootstrap-PercentageBarStackMissingColumnsRuntime-r002.json | Context | Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/Goal.final.json | 4db931a6764a8c48345e7e8358e579550a9bc98594bf1654647716d72b9678c4 |
| ContextBootstrap-PercentageBarStackMissingColumnsRuntime-r002.json | Context | Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/MVP-20261027/UiIntegrationCases-r002.json | e365ef111582ef84f20f26e6136854409b7fc66bb0931cae40a9df5318036d55 |
| ContextBootstrap-PercentageBarStackMissingColumnsRuntime-r002.json | Context | Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/MVP-20261027/reviews/UiIntegrationDesignReview-r003-C234.md | 5d4c26ebda1ba9847e19ea1d04caa82d26a54cee01685a167d8313aa3114f4b2 |
| ContextBootstrap-PercentageBarStackMissingColumnsRuntime-r002.json | Context | Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/MVP-20261027/reviews/MvpAcceptanceReadinessReview-r001.md | fba3b6ad368e085b787cd9a69497f5fb51163397559d718f7596dd014a06d9af |
| ContextBootstrap-PercentageBarStackMissingColumnsRuntime-r002.json | Context | Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/MVP-20261027/RuntimeMissingColumnsPlan-r001.json | 1c80cfa3da6a2a319d200f1cea356176eccd5cc0389546013d52ff204ac5c8cc |
| ContextBootstrap-PercentageBarStackMissingColumnsRuntime-r002.json | Context | /Users/xiaomei/Documents/projects/dataease/Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/MVP-20261027/runtime-state-tools/observe-percentage-bar-stack-missing-columns-r002.js | e0f721c1fa3af5bbd7103f7f884c1d668b4ec2b063c9af41098330fb395b456c |
| ContextBootstrap-PercentageBarStackMissingColumnsRuntime-r002.json | Context | Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/MVP-20261027/evidence/PercentageBarStackMissingColumnsToolFreeze-r002.json | 48cc608b17ee830aaf71be527d1ee20690bc3d3db95078455e387ced64636231 |
| ContextBootstrap-PercentageBarStackMissingColumnsRuntime-r002.json | Context | Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/planning/Topology-actual-r575.json | 7f80e4009b189984ed709bfd5adcc397a4c868e0da8e8fcbaa27c166cb64c3c1 |
| ContextBootstrap-PercentageBarStackMissingColumnsRuntime-r002.json | Context | Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/MVP-20261027/reviews/SliceARolePortsValidation-r003.md | 726720f12d85ec48a459d53058351d9e7580a267f3a696fa7f08587e73d58e28 |
| ContextBootstrap-PercentageBarStackMissingColumnsRuntime-r002.json | Context | core/core-frontend/src/views/chart/components/editor/filter/useChartFilterCopyMvp.ts | b760fffb47db4a8a187cc3dc996d6ddffb5f2b187038da625c5c8e0839d87e5d |
| ContextBootstrap-PercentageBarStackMissingColumnsRuntime-r002.json | Context | core/core-frontend/src/views/chart/components/editor/index.vue | 9c64555a38982216c1688012fdf7fa02433fce3b25553bd6e4ab9dffd12381fd |
| percentage-bar-stack-missing-columns-runtime-admission-r002.json | goal | Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/Goal.final.json | 4db931a6764a8c48345e7e8358e579550a9bc98594bf1654647716d72b9678c4 |
| percentage-bar-stack-missing-columns-runtime-admission-r002.json | completion_contract | Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/MVP-20261027/UiIntegrationCases-r002.json | e365ef111582ef84f20f26e6136854409b7fc66bb0931cae40a9df5318036d55 |
| percentage-bar-stack-missing-columns-runtime-admission-r002.json | context | Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/planning/ContextBootstrap-PercentageBarStackMissingColumnsRuntime-r002.json | 8c8a63890ea1a64aa863d707cc68c0fc3917e5fc1fac1ea3cbb1b0e861b5e750 |
| percentage-bar-stack-missing-columns-runtime-admission-r002.json | design_review | Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/MVP-20261027/reviews/UiIntegrationDesignReview-r003-C234.md | 5d4c26ebda1ba9847e19ea1d04caa82d26a54cee01685a167d8313aa3114f4b2 |
| percentage-bar-stack-missing-columns-runtime-admission-r002.json | topology | Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/planning/Topology-actual-r575.json | 7f80e4009b189984ed709bfd5adcc397a4c868e0da8e8fcbaa27c166cb64c3c1 |
| ContextBootstrap-PercentageBarStackHorizontalMissingColumnsRuntime-r002.json | Context | Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/Goal.final.json | 4db931a6764a8c48345e7e8358e579550a9bc98594bf1654647716d72b9678c4 |
| ContextBootstrap-PercentageBarStackHorizontalMissingColumnsRuntime-r002.json | Context | Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/MVP-20261027/UiIntegrationCases-r002.json | e365ef111582ef84f20f26e6136854409b7fc66bb0931cae40a9df5318036d55 |
| ContextBootstrap-PercentageBarStackHorizontalMissingColumnsRuntime-r002.json | Context | Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/MVP-20261027/reviews/UiIntegrationDesignReview-r003-C234.md | 5d4c26ebda1ba9847e19ea1d04caa82d26a54cee01685a167d8313aa3114f4b2 |
| ContextBootstrap-PercentageBarStackHorizontalMissingColumnsRuntime-r002.json | Context | Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/MVP-20261027/reviews/MvpAcceptanceReadinessReview-r001.md | fba3b6ad368e085b787cd9a69497f5fb51163397559d718f7596dd014a06d9af |
| ContextBootstrap-PercentageBarStackHorizontalMissingColumnsRuntime-r002.json | Context | Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/MVP-20261027/RuntimeMissingColumnsPlan-r001.json | 1c80cfa3da6a2a319d200f1cea356176eccd5cc0389546013d52ff204ac5c8cc |
| ContextBootstrap-PercentageBarStackHorizontalMissingColumnsRuntime-r002.json | Context | /Users/xiaomei/Documents/projects/dataease/Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/MVP-20261027/runtime-state-tools/observe-percentage-bar-stack-horizontal-missing-columns-r002.js | e4040ae397a04ba53ed434ee1c308d9ca239ee36a5b69a4220a40c1a62e61f4f |
| ContextBootstrap-PercentageBarStackHorizontalMissingColumnsRuntime-r002.json | Context | Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/MVP-20261027/evidence/PercentageBarStackHorizontalMissingColumnsToolFreeze-r002.json | c575df73cc4996060150c0c3ca855bfe14ac2d4416df6da9c9007c2d8b78e015 |
| ContextBootstrap-PercentageBarStackHorizontalMissingColumnsRuntime-r002.json | Context | Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/planning/Topology-actual-r575.json | 7f80e4009b189984ed709bfd5adcc397a4c868e0da8e8fcbaa27c166cb64c3c1 |
| ContextBootstrap-PercentageBarStackHorizontalMissingColumnsRuntime-r002.json | Context | Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/MVP-20261027/reviews/SliceARolePortsValidation-r003.md | 726720f12d85ec48a459d53058351d9e7580a267f3a696fa7f08587e73d58e28 |
| ContextBootstrap-PercentageBarStackHorizontalMissingColumnsRuntime-r002.json | Context | core/core-frontend/src/views/chart/components/editor/filter/useChartFilterCopyMvp.ts | b760fffb47db4a8a187cc3dc996d6ddffb5f2b187038da625c5c8e0839d87e5d |
| ContextBootstrap-PercentageBarStackHorizontalMissingColumnsRuntime-r002.json | Context | core/core-frontend/src/views/chart/components/editor/index.vue | 9c64555a38982216c1688012fdf7fa02433fce3b25553bd6e4ab9dffd12381fd |
| percentage-bar-stack-horizontal-missing-columns-runtime-admission-r002.json | goal | Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/Goal.final.json | 4db931a6764a8c48345e7e8358e579550a9bc98594bf1654647716d72b9678c4 |
| percentage-bar-stack-horizontal-missing-columns-runtime-admission-r002.json | completion_contract | Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/MVP-20261027/UiIntegrationCases-r002.json | e365ef111582ef84f20f26e6136854409b7fc66bb0931cae40a9df5318036d55 |
| percentage-bar-stack-horizontal-missing-columns-runtime-admission-r002.json | context | Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/planning/ContextBootstrap-PercentageBarStackHorizontalMissingColumnsRuntime-r002.json | 240bf66e2141fb3c6996a6f88b5ba45683ab5c66d5e79874dfed42874c113295 |
| percentage-bar-stack-horizontal-missing-columns-runtime-admission-r002.json | design_review | Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/MVP-20261027/reviews/UiIntegrationDesignReview-r003-C234.md | 5d4c26ebda1ba9847e19ea1d04caa82d26a54cee01685a167d8313aa3114f4b2 |
| percentage-bar-stack-horizontal-missing-columns-runtime-admission-r002.json | topology | Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/planning/Topology-actual-r575.json | 7f80e4009b189984ed709bfd5adcc397a4c868e0da8e8fcbaa27c166cb64c3c1 |
| ContextBootstrap-BoxPlotMissingColumnsRuntime-r002.json | Context | Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/Goal.final.json | 4db931a6764a8c48345e7e8358e579550a9bc98594bf1654647716d72b9678c4 |
| ContextBootstrap-BoxPlotMissingColumnsRuntime-r002.json | Context | Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/MVP-20261027/UiIntegrationCases-r002.json | e365ef111582ef84f20f26e6136854409b7fc66bb0931cae40a9df5318036d55 |
| ContextBootstrap-BoxPlotMissingColumnsRuntime-r002.json | Context | Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/MVP-20261027/reviews/UiIntegrationDesignReview-r003-C234.md | 5d4c26ebda1ba9847e19ea1d04caa82d26a54cee01685a167d8313aa3114f4b2 |
| ContextBootstrap-BoxPlotMissingColumnsRuntime-r002.json | Context | Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/MVP-20261027/reviews/MvpAcceptanceReadinessReview-r001.md | fba3b6ad368e085b787cd9a69497f5fb51163397559d718f7596dd014a06d9af |
| ContextBootstrap-BoxPlotMissingColumnsRuntime-r002.json | Context | Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/MVP-20261027/RuntimeMissingColumnsPlan-r001.json | 1c80cfa3da6a2a319d200f1cea356176eccd5cc0389546013d52ff204ac5c8cc |
| ContextBootstrap-BoxPlotMissingColumnsRuntime-r002.json | Context | /Users/xiaomei/Documents/projects/dataease/Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/MVP-20261027/runtime-state-tools/observe-box-plot-missing-columns-r002.js | 081ddba6448217c1947d37039f7f867da5f81aa248f594141e7c06b59916cc2d |
| ContextBootstrap-BoxPlotMissingColumnsRuntime-r002.json | Context | Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/MVP-20261027/evidence/BoxPlotMissingColumnsToolFreeze-r002.json | 0f22a6c42fb4be0b6cf1c446c09879e639ffbb37c65b905db3ae3d1882fb73e1 |
| ContextBootstrap-BoxPlotMissingColumnsRuntime-r002.json | Context | Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/planning/Topology-actual-r575.json | 7f80e4009b189984ed709bfd5adcc397a4c868e0da8e8fcbaa27c166cb64c3c1 |
| ContextBootstrap-BoxPlotMissingColumnsRuntime-r002.json | Context | Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/MVP-20261027/reviews/SliceARolePortsValidation-r003.md | 726720f12d85ec48a459d53058351d9e7580a267f3a696fa7f08587e73d58e28 |
| ContextBootstrap-BoxPlotMissingColumnsRuntime-r002.json | Context | core/core-frontend/src/views/chart/components/editor/filter/useChartFilterCopyMvp.ts | b760fffb47db4a8a187cc3dc996d6ddffb5f2b187038da625c5c8e0839d87e5d |
| ContextBootstrap-BoxPlotMissingColumnsRuntime-r002.json | Context | core/core-frontend/src/views/chart/components/editor/index.vue | 9c64555a38982216c1688012fdf7fa02433fce3b25553bd6e4ab9dffd12381fd |
| box-plot-missing-columns-runtime-admission-r002.json | goal | Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/Goal.final.json | 4db931a6764a8c48345e7e8358e579550a9bc98594bf1654647716d72b9678c4 |
| box-plot-missing-columns-runtime-admission-r002.json | completion_contract | Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/MVP-20261027/UiIntegrationCases-r002.json | e365ef111582ef84f20f26e6136854409b7fc66bb0931cae40a9df5318036d55 |
| box-plot-missing-columns-runtime-admission-r002.json | context | Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/planning/ContextBootstrap-BoxPlotMissingColumnsRuntime-r002.json | 3aae47090adea814db86dfc1cdbaaa10ad7fab27fd52a9e1c2f965ef897e4828 |
| box-plot-missing-columns-runtime-admission-r002.json | design_review | Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/MVP-20261027/reviews/UiIntegrationDesignReview-r003-C234.md | 5d4c26ebda1ba9847e19ea1d04caa82d26a54cee01685a167d8313aa3114f4b2 |
| box-plot-missing-columns-runtime-admission-r002.json | topology | Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/planning/Topology-actual-r575.json | 7f80e4009b189984ed709bfd5adcc397a4c868e0da8e8fcbaa27c166cb64c3c1 |
| ContextBootstrap-ChartMixMissingColumnsRuntime-r002.json | Context | Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/Goal.final.json | 4db931a6764a8c48345e7e8358e579550a9bc98594bf1654647716d72b9678c4 |
| ContextBootstrap-ChartMixMissingColumnsRuntime-r002.json | Context | Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/MVP-20261027/UiIntegrationCases-r002.json | e365ef111582ef84f20f26e6136854409b7fc66bb0931cae40a9df5318036d55 |
| ContextBootstrap-ChartMixMissingColumnsRuntime-r002.json | Context | Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/MVP-20261027/reviews/UiIntegrationDesignReview-r003-C234.md | 5d4c26ebda1ba9847e19ea1d04caa82d26a54cee01685a167d8313aa3114f4b2 |
| ContextBootstrap-ChartMixMissingColumnsRuntime-r002.json | Context | Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/MVP-20261027/reviews/MvpAcceptanceReadinessReview-r001.md | fba3b6ad368e085b787cd9a69497f5fb51163397559d718f7596dd014a06d9af |
| ContextBootstrap-ChartMixMissingColumnsRuntime-r002.json | Context | Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/MVP-20261027/RuntimeMissingColumnsPlan-r001.json | 1c80cfa3da6a2a319d200f1cea356176eccd5cc0389546013d52ff204ac5c8cc |
| ContextBootstrap-ChartMixMissingColumnsRuntime-r002.json | Context | /Users/xiaomei/Documents/projects/dataease/Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/MVP-20261027/runtime-state-tools/observe-chart-mix-missing-columns-r002.js | 43cac21190b451bc5cd0ffe460ffe7a9883b53cdf0729a607230083e1deef523 |
| ContextBootstrap-ChartMixMissingColumnsRuntime-r002.json | Context | Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/MVP-20261027/evidence/ChartMixMissingColumnsToolFreeze-r002.json | fdd938bb56ed34b22573138f4043d51f461cd5f7d119ecc201e2096c8853f1b4 |
| ContextBootstrap-ChartMixMissingColumnsRuntime-r002.json | Context | Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/planning/Topology-actual-r575.json | 7f80e4009b189984ed709bfd5adcc397a4c868e0da8e8fcbaa27c166cb64c3c1 |
| ContextBootstrap-ChartMixMissingColumnsRuntime-r002.json | Context | Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/MVP-20261027/reviews/SliceARolePortsValidation-r003.md | 726720f12d85ec48a459d53058351d9e7580a267f3a696fa7f08587e73d58e28 |
| ContextBootstrap-ChartMixMissingColumnsRuntime-r002.json | Context | core/core-frontend/src/views/chart/components/editor/filter/useChartFilterCopyMvp.ts | b760fffb47db4a8a187cc3dc996d6ddffb5f2b187038da625c5c8e0839d87e5d |
| ContextBootstrap-ChartMixMissingColumnsRuntime-r002.json | Context | core/core-frontend/src/views/chart/components/editor/index.vue | 9c64555a38982216c1688012fdf7fa02433fce3b25553bd6e4ab9dffd12381fd |
| chart-mix-missing-columns-runtime-admission-r002.json | goal | Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/Goal.final.json | 4db931a6764a8c48345e7e8358e579550a9bc98594bf1654647716d72b9678c4 |
| chart-mix-missing-columns-runtime-admission-r002.json | completion_contract | Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/MVP-20261027/UiIntegrationCases-r002.json | e365ef111582ef84f20f26e6136854409b7fc66bb0931cae40a9df5318036d55 |
| chart-mix-missing-columns-runtime-admission-r002.json | context | Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/planning/ContextBootstrap-ChartMixMissingColumnsRuntime-r002.json | 82752be61569dc24d44f906e39cc7c72072d0944963fe5d106e5c2108d22dcdc |
| chart-mix-missing-columns-runtime-admission-r002.json | design_review | Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/MVP-20261027/reviews/UiIntegrationDesignReview-r003-C234.md | 5d4c26ebda1ba9847e19ea1d04caa82d26a54cee01685a167d8313aa3114f4b2 |
| chart-mix-missing-columns-runtime-admission-r002.json | topology | Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/planning/Topology-actual-r575.json | 7f80e4009b189984ed709bfd5adcc397a4c868e0da8e8fcbaa27c166cb64c3c1 |
| ContextBootstrap-ChartMixGroupMissingColumnsRuntime-r002.json | Context | Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/Goal.final.json | 4db931a6764a8c48345e7e8358e579550a9bc98594bf1654647716d72b9678c4 |
| ContextBootstrap-ChartMixGroupMissingColumnsRuntime-r002.json | Context | Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/MVP-20261027/UiIntegrationCases-r002.json | e365ef111582ef84f20f26e6136854409b7fc66bb0931cae40a9df5318036d55 |
| ContextBootstrap-ChartMixGroupMissingColumnsRuntime-r002.json | Context | Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/MVP-20261027/reviews/UiIntegrationDesignReview-r003-C234.md | 5d4c26ebda1ba9847e19ea1d04caa82d26a54cee01685a167d8313aa3114f4b2 |
| ContextBootstrap-ChartMixGroupMissingColumnsRuntime-r002.json | Context | Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/MVP-20261027/reviews/MvpAcceptanceReadinessReview-r001.md | fba3b6ad368e085b787cd9a69497f5fb51163397559d718f7596dd014a06d9af |
| ContextBootstrap-ChartMixGroupMissingColumnsRuntime-r002.json | Context | Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/MVP-20261027/RuntimeMissingColumnsPlan-r001.json | 1c80cfa3da6a2a319d200f1cea356176eccd5cc0389546013d52ff204ac5c8cc |
| ContextBootstrap-ChartMixGroupMissingColumnsRuntime-r002.json | Context | /Users/xiaomei/Documents/projects/dataease/Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/MVP-20261027/runtime-state-tools/observe-chart-mix-group-missing-columns-r002.js | 6360814ac6a6120f295f65dce6b9a5d7b1acd153256aa6c179c88fdf2f37258b |
| ContextBootstrap-ChartMixGroupMissingColumnsRuntime-r002.json | Context | Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/MVP-20261027/evidence/ChartMixGroupMissingColumnsToolFreeze-r002.json | df7c3953b263d34e558bed81591de1d32518e607f05c93f6a6d32974eccec5c3 |
| ContextBootstrap-ChartMixGroupMissingColumnsRuntime-r002.json | Context | Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/planning/Topology-actual-r575.json | 7f80e4009b189984ed709bfd5adcc397a4c868e0da8e8fcbaa27c166cb64c3c1 |
| ContextBootstrap-ChartMixGroupMissingColumnsRuntime-r002.json | Context | Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/MVP-20261027/reviews/SliceARolePortsValidation-r003.md | 726720f12d85ec48a459d53058351d9e7580a267f3a696fa7f08587e73d58e28 |
| ContextBootstrap-ChartMixGroupMissingColumnsRuntime-r002.json | Context | core/core-frontend/src/views/chart/components/editor/filter/useChartFilterCopyMvp.ts | b760fffb47db4a8a187cc3dc996d6ddffb5f2b187038da625c5c8e0839d87e5d |
| ContextBootstrap-ChartMixGroupMissingColumnsRuntime-r002.json | Context | core/core-frontend/src/views/chart/components/editor/index.vue | 9c64555a38982216c1688012fdf7fa02433fce3b25553bd6e4ab9dffd12381fd |
| chart-mix-group-missing-columns-runtime-admission-r002.json | goal | Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/Goal.final.json | 4db931a6764a8c48345e7e8358e579550a9bc98594bf1654647716d72b9678c4 |
| chart-mix-group-missing-columns-runtime-admission-r002.json | completion_contract | Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/MVP-20261027/UiIntegrationCases-r002.json | e365ef111582ef84f20f26e6136854409b7fc66bb0931cae40a9df5318036d55 |
| chart-mix-group-missing-columns-runtime-admission-r002.json | context | Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/planning/ContextBootstrap-ChartMixGroupMissingColumnsRuntime-r002.json | cdddd218797d59261b8a5bdc4b2a6187d8476d75337605875783e38f3d77f50f |
| chart-mix-group-missing-columns-runtime-admission-r002.json | design_review | Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/MVP-20261027/reviews/UiIntegrationDesignReview-r003-C234.md | 5d4c26ebda1ba9847e19ea1d04caa82d26a54cee01685a167d8313aa3114f4b2 |
| chart-mix-group-missing-columns-runtime-admission-r002.json | topology | Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/planning/Topology-actual-r575.json | 7f80e4009b189984ed709bfd5adcc397a4c868e0da8e8fcbaa27c166cb64c3c1 |
| ContextBootstrap-ChartMixStackMissingColumnsRuntime-r002.json | Context | Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/Goal.final.json | 4db931a6764a8c48345e7e8358e579550a9bc98594bf1654647716d72b9678c4 |
| ContextBootstrap-ChartMixStackMissingColumnsRuntime-r002.json | Context | Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/MVP-20261027/UiIntegrationCases-r002.json | e365ef111582ef84f20f26e6136854409b7fc66bb0931cae40a9df5318036d55 |
| ContextBootstrap-ChartMixStackMissingColumnsRuntime-r002.json | Context | Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/MVP-20261027/reviews/UiIntegrationDesignReview-r003-C234.md | 5d4c26ebda1ba9847e19ea1d04caa82d26a54cee01685a167d8313aa3114f4b2 |
| ContextBootstrap-ChartMixStackMissingColumnsRuntime-r002.json | Context | Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/MVP-20261027/reviews/MvpAcceptanceReadinessReview-r001.md | fba3b6ad368e085b787cd9a69497f5fb51163397559d718f7596dd014a06d9af |
| ContextBootstrap-ChartMixStackMissingColumnsRuntime-r002.json | Context | Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/MVP-20261027/RuntimeMissingColumnsPlan-r001.json | 1c80cfa3da6a2a319d200f1cea356176eccd5cc0389546013d52ff204ac5c8cc |
| ContextBootstrap-ChartMixStackMissingColumnsRuntime-r002.json | Context | /Users/xiaomei/Documents/projects/dataease/Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/MVP-20261027/runtime-state-tools/observe-chart-mix-stack-missing-columns-r002.js | c6e7602b50f132765e6ed76da23caf77d720c19ba15d639f303165c158872fa6 |
| ContextBootstrap-ChartMixStackMissingColumnsRuntime-r002.json | Context | Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/MVP-20261027/evidence/ChartMixStackMissingColumnsToolFreeze-r002.json | c593caaa203a8b51fd1572f79660e2a324156c818eef5bbeca03e4c7ffc4b0cf |
| ContextBootstrap-ChartMixStackMissingColumnsRuntime-r002.json | Context | Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/planning/Topology-actual-r575.json | 7f80e4009b189984ed709bfd5adcc397a4c868e0da8e8fcbaa27c166cb64c3c1 |
| ContextBootstrap-ChartMixStackMissingColumnsRuntime-r002.json | Context | Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/MVP-20261027/reviews/SliceARolePortsValidation-r003.md | 726720f12d85ec48a459d53058351d9e7580a267f3a696fa7f08587e73d58e28 |
| ContextBootstrap-ChartMixStackMissingColumnsRuntime-r002.json | Context | core/core-frontend/src/views/chart/components/editor/filter/useChartFilterCopyMvp.ts | b760fffb47db4a8a187cc3dc996d6ddffb5f2b187038da625c5c8e0839d87e5d |
| ContextBootstrap-ChartMixStackMissingColumnsRuntime-r002.json | Context | core/core-frontend/src/views/chart/components/editor/index.vue | 9c64555a38982216c1688012fdf7fa02433fce3b25553bd6e4ab9dffd12381fd |
| chart-mix-stack-missing-columns-runtime-admission-r002.json | goal | Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/Goal.final.json | 4db931a6764a8c48345e7e8358e579550a9bc98594bf1654647716d72b9678c4 |
| chart-mix-stack-missing-columns-runtime-admission-r002.json | completion_contract | Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/MVP-20261027/UiIntegrationCases-r002.json | e365ef111582ef84f20f26e6136854409b7fc66bb0931cae40a9df5318036d55 |
| chart-mix-stack-missing-columns-runtime-admission-r002.json | context | Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/planning/ContextBootstrap-ChartMixStackMissingColumnsRuntime-r002.json | a5515679f1ebba0aea0bcc442a9e89f539605665e4d3508cb65a1e9a5272e2dc |
| chart-mix-stack-missing-columns-runtime-admission-r002.json | design_review | Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/MVP-20261027/reviews/UiIntegrationDesignReview-r003-C234.md | 5d4c26ebda1ba9847e19ea1d04caa82d26a54cee01685a167d8313aa3114f4b2 |
| chart-mix-stack-missing-columns-runtime-admission-r002.json | topology | Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/planning/Topology-actual-r575.json | 7f80e4009b189984ed709bfd5adcc397a4c868e0da8e8fcbaa27c166cb64c3c1 |
| ContextBootstrap-ChartMixDualLineMissingColumnsRuntime-r002.json | Context | Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/Goal.final.json | 4db931a6764a8c48345e7e8358e579550a9bc98594bf1654647716d72b9678c4 |
| ContextBootstrap-ChartMixDualLineMissingColumnsRuntime-r002.json | Context | Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/MVP-20261027/UiIntegrationCases-r002.json | e365ef111582ef84f20f26e6136854409b7fc66bb0931cae40a9df5318036d55 |
| ContextBootstrap-ChartMixDualLineMissingColumnsRuntime-r002.json | Context | Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/MVP-20261027/reviews/UiIntegrationDesignReview-r003-C234.md | 5d4c26ebda1ba9847e19ea1d04caa82d26a54cee01685a167d8313aa3114f4b2 |
| ContextBootstrap-ChartMixDualLineMissingColumnsRuntime-r002.json | Context | Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/MVP-20261027/reviews/MvpAcceptanceReadinessReview-r001.md | fba3b6ad368e085b787cd9a69497f5fb51163397559d718f7596dd014a06d9af |
| ContextBootstrap-ChartMixDualLineMissingColumnsRuntime-r002.json | Context | Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/MVP-20261027/RuntimeMissingColumnsPlan-r001.json | 1c80cfa3da6a2a319d200f1cea356176eccd5cc0389546013d52ff204ac5c8cc |
| ContextBootstrap-ChartMixDualLineMissingColumnsRuntime-r002.json | Context | /Users/xiaomei/Documents/projects/dataease/Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/MVP-20261027/runtime-state-tools/observe-chart-mix-dual-line-missing-columns-r002.js | 5daf6a75f303d87b5328b36e59c046831471314493609a534f53060f71aa644b |
| ContextBootstrap-ChartMixDualLineMissingColumnsRuntime-r002.json | Context | Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/MVP-20261027/evidence/ChartMixDualLineMissingColumnsToolFreeze-r002.json | 31adc70953629daa8df4bc83b68ce352a9a86577e1b91d5ab7d0f32f96da8e40 |
| ContextBootstrap-ChartMixDualLineMissingColumnsRuntime-r002.json | Context | Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/planning/Topology-actual-r575.json | 7f80e4009b189984ed709bfd5adcc397a4c868e0da8e8fcbaa27c166cb64c3c1 |
| ContextBootstrap-ChartMixDualLineMissingColumnsRuntime-r002.json | Context | Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/MVP-20261027/reviews/SliceARolePortsValidation-r003.md | 726720f12d85ec48a459d53058351d9e7580a267f3a696fa7f08587e73d58e28 |
| ContextBootstrap-ChartMixDualLineMissingColumnsRuntime-r002.json | Context | core/core-frontend/src/views/chart/components/editor/filter/useChartFilterCopyMvp.ts | b760fffb47db4a8a187cc3dc996d6ddffb5f2b187038da625c5c8e0839d87e5d |
| ContextBootstrap-ChartMixDualLineMissingColumnsRuntime-r002.json | Context | core/core-frontend/src/views/chart/components/editor/index.vue | 9c64555a38982216c1688012fdf7fa02433fce3b25553bd6e4ab9dffd12381fd |
| chart-mix-dual-line-missing-columns-runtime-admission-r002.json | goal | Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/Goal.final.json | 4db931a6764a8c48345e7e8358e579550a9bc98594bf1654647716d72b9678c4 |
| chart-mix-dual-line-missing-columns-runtime-admission-r002.json | completion_contract | Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/MVP-20261027/UiIntegrationCases-r002.json | e365ef111582ef84f20f26e6136854409b7fc66bb0931cae40a9df5318036d55 |
| chart-mix-dual-line-missing-columns-runtime-admission-r002.json | context | Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/planning/ContextBootstrap-ChartMixDualLineMissingColumnsRuntime-r002.json | a2d3abe3d4e19104f49fe6b9fd1cb1012706aa5ae772a09885afbe044daafa36 |
| chart-mix-dual-line-missing-columns-runtime-admission-r002.json | design_review | Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/MVP-20261027/reviews/UiIntegrationDesignReview-r003-C234.md | 5d4c26ebda1ba9847e19ea1d04caa82d26a54cee01685a167d8313aa3114f4b2 |
| chart-mix-dual-line-missing-columns-runtime-admission-r002.json | topology | Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/planning/Topology-actual-r575.json | 7f80e4009b189984ed709bfd5adcc397a4c868e0da8e8fcbaa27c166cb64c3c1 |
| ContextBootstrap-ProgressBarMissingColumnsRuntime-r002.json | Context | Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/Goal.final.json | 4db931a6764a8c48345e7e8358e579550a9bc98594bf1654647716d72b9678c4 |
| ContextBootstrap-ProgressBarMissingColumnsRuntime-r002.json | Context | Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/MVP-20261027/UiIntegrationCases-r002.json | e365ef111582ef84f20f26e6136854409b7fc66bb0931cae40a9df5318036d55 |
| ContextBootstrap-ProgressBarMissingColumnsRuntime-r002.json | Context | Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/MVP-20261027/reviews/UiIntegrationDesignReview-r003-C234.md | 5d4c26ebda1ba9847e19ea1d04caa82d26a54cee01685a167d8313aa3114f4b2 |
| ContextBootstrap-ProgressBarMissingColumnsRuntime-r002.json | Context | Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/MVP-20261027/reviews/MvpAcceptanceReadinessReview-r001.md | fba3b6ad368e085b787cd9a69497f5fb51163397559d718f7596dd014a06d9af |
| ContextBootstrap-ProgressBarMissingColumnsRuntime-r002.json | Context | Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/MVP-20261027/RuntimeMissingColumnsPlan-r001.json | 1c80cfa3da6a2a319d200f1cea356176eccd5cc0389546013d52ff204ac5c8cc |
| ContextBootstrap-ProgressBarMissingColumnsRuntime-r002.json | Context | /Users/xiaomei/Documents/projects/dataease/Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/MVP-20261027/runtime-state-tools/observe-progress-bar-missing-columns-r002.js | af01cf8a3168ac16c8e57e5bd1d8f923c97a296105d5ce232b5f6fecd094e4f3 |
| ContextBootstrap-ProgressBarMissingColumnsRuntime-r002.json | Context | Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/MVP-20261027/evidence/ProgressBarMissingColumnsToolFreeze-r002.json | 39520da148b5ec0e56581462cb7a1a2bcfdf2c9b270b149c18e999485f9f9840 |
| ContextBootstrap-ProgressBarMissingColumnsRuntime-r002.json | Context | Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/planning/Topology-actual-r575.json | 7f80e4009b189984ed709bfd5adcc397a4c868e0da8e8fcbaa27c166cb64c3c1 |
| ContextBootstrap-ProgressBarMissingColumnsRuntime-r002.json | Context | Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/MVP-20261027/reviews/SliceARolePortsValidation-r003.md | 726720f12d85ec48a459d53058351d9e7580a267f3a696fa7f08587e73d58e28 |
| ContextBootstrap-ProgressBarMissingColumnsRuntime-r002.json | Context | core/core-frontend/src/views/chart/components/editor/filter/useChartFilterCopyMvp.ts | b760fffb47db4a8a187cc3dc996d6ddffb5f2b187038da625c5c8e0839d87e5d |
| ContextBootstrap-ProgressBarMissingColumnsRuntime-r002.json | Context | core/core-frontend/src/views/chart/components/editor/index.vue | 9c64555a38982216c1688012fdf7fa02433fce3b25553bd6e4ab9dffd12381fd |
| progress-bar-missing-columns-runtime-admission-r002.json | goal | Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/Goal.final.json | 4db931a6764a8c48345e7e8358e579550a9bc98594bf1654647716d72b9678c4 |
| progress-bar-missing-columns-runtime-admission-r002.json | completion_contract | Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/MVP-20261027/UiIntegrationCases-r002.json | e365ef111582ef84f20f26e6136854409b7fc66bb0931cae40a9df5318036d55 |
| progress-bar-missing-columns-runtime-admission-r002.json | context | Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/planning/ContextBootstrap-ProgressBarMissingColumnsRuntime-r002.json | aa7f14f06e1df429a84128d7460a1431e1090fbee0afc5651c5536e664b1b0cb |
| progress-bar-missing-columns-runtime-admission-r002.json | design_review | Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/MVP-20261027/reviews/UiIntegrationDesignReview-r003-C234.md | 5d4c26ebda1ba9847e19ea1d04caa82d26a54cee01685a167d8313aa3114f4b2 |
| progress-bar-missing-columns-runtime-admission-r002.json | topology | Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/planning/Topology-actual-r575.json | 7f80e4009b189984ed709bfd5adcc397a4c868e0da8e8fcbaa27c166cb64c3c1 |
| ContextBootstrap-SankeyMissingColumnsRuntime-r002.json | Context | Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/Goal.final.json | 4db931a6764a8c48345e7e8358e579550a9bc98594bf1654647716d72b9678c4 |
| ContextBootstrap-SankeyMissingColumnsRuntime-r002.json | Context | Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/MVP-20261027/UiIntegrationCases-r002.json | e365ef111582ef84f20f26e6136854409b7fc66bb0931cae40a9df5318036d55 |
| ContextBootstrap-SankeyMissingColumnsRuntime-r002.json | Context | Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/MVP-20261027/reviews/UiIntegrationDesignReview-r003-C234.md | 5d4c26ebda1ba9847e19ea1d04caa82d26a54cee01685a167d8313aa3114f4b2 |
| ContextBootstrap-SankeyMissingColumnsRuntime-r002.json | Context | Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/MVP-20261027/reviews/MvpAcceptanceReadinessReview-r001.md | fba3b6ad368e085b787cd9a69497f5fb51163397559d718f7596dd014a06d9af |
| ContextBootstrap-SankeyMissingColumnsRuntime-r002.json | Context | Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/MVP-20261027/RuntimeMissingColumnsPlan-r001.json | 1c80cfa3da6a2a319d200f1cea356176eccd5cc0389546013d52ff204ac5c8cc |
| ContextBootstrap-SankeyMissingColumnsRuntime-r002.json | Context | /Users/xiaomei/Documents/projects/dataease/Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/MVP-20261027/runtime-state-tools/observe-sankey-missing-columns-r002.js | ffa78b6944e7d034b6590fa7816a7a21b2466812d8882839757a3ca643c08869 |
| ContextBootstrap-SankeyMissingColumnsRuntime-r002.json | Context | Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/MVP-20261027/evidence/SankeyMissingColumnsToolFreeze-r002.json | 8c4a8486ef77064839ca11873a1d7d707acedf49e9e977c0475f048b3639c284 |
| ContextBootstrap-SankeyMissingColumnsRuntime-r002.json | Context | Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/planning/Topology-actual-r575.json | 7f80e4009b189984ed709bfd5adcc397a4c868e0da8e8fcbaa27c166cb64c3c1 |
| ContextBootstrap-SankeyMissingColumnsRuntime-r002.json | Context | Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/MVP-20261027/reviews/SliceARolePortsValidation-r003.md | 726720f12d85ec48a459d53058351d9e7580a267f3a696fa7f08587e73d58e28 |
| ContextBootstrap-SankeyMissingColumnsRuntime-r002.json | Context | core/core-frontend/src/views/chart/components/editor/filter/useChartFilterCopyMvp.ts | b760fffb47db4a8a187cc3dc996d6ddffb5f2b187038da625c5c8e0839d87e5d |
| ContextBootstrap-SankeyMissingColumnsRuntime-r002.json | Context | core/core-frontend/src/views/chart/components/editor/index.vue | 9c64555a38982216c1688012fdf7fa02433fce3b25553bd6e4ab9dffd12381fd |
| sankey-missing-columns-runtime-admission-r002.json | goal | Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/Goal.final.json | 4db931a6764a8c48345e7e8358e579550a9bc98594bf1654647716d72b9678c4 |
| sankey-missing-columns-runtime-admission-r002.json | completion_contract | Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/MVP-20261027/UiIntegrationCases-r002.json | e365ef111582ef84f20f26e6136854409b7fc66bb0931cae40a9df5318036d55 |
| sankey-missing-columns-runtime-admission-r002.json | context | Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/planning/ContextBootstrap-SankeyMissingColumnsRuntime-r002.json | bcc9db8829303e012de2366da9caa553e21cd7ffc84501d3c5e7f33e33d6d0c5 |
| sankey-missing-columns-runtime-admission-r002.json | design_review | Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/MVP-20261027/reviews/UiIntegrationDesignReview-r003-C234.md | 5d4c26ebda1ba9847e19ea1d04caa82d26a54cee01685a167d8313aa3114f4b2 |
| sankey-missing-columns-runtime-admission-r002.json | topology | Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/planning/Topology-actual-r575.json | 7f80e4009b189984ed709bfd5adcc397a4c868e0da8e8fcbaa27c166cb64c3c1 |
| ContextBootstrap-THeatmapMissingColumnsRuntime-r004.json | Context | Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/Goal.final.json | 4db931a6764a8c48345e7e8358e579550a9bc98594bf1654647716d72b9678c4 |
| ContextBootstrap-THeatmapMissingColumnsRuntime-r004.json | Context | Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/MVP-20261027/UiIntegrationCases-r002.json | e365ef111582ef84f20f26e6136854409b7fc66bb0931cae40a9df5318036d55 |
| ContextBootstrap-THeatmapMissingColumnsRuntime-r004.json | Context | Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/MVP-20261027/THeatmapPrimaryDataCases-r001.json | b62a16144bc4f2f49861541254d0ee258ba7a10335050f05ea588b642f54fb7f |
| ContextBootstrap-THeatmapMissingColumnsRuntime-r004.json | Context | Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/MVP-20261027/THeatmapPrimaryDataImplementationNote-r002.md | 933379c55cd505182f2027a921cb39c743047b4a3dead8c08bb3facdea4ab374 |
| ContextBootstrap-THeatmapMissingColumnsRuntime-r004.json | Context | Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/MVP-20261027/reviews/UiIntegrationDesignReview-r002.md | 3a56a82c67fc4f68c93d9f2097c79c7a6a70a284a61f522470255a16988a8357 |
| ContextBootstrap-THeatmapMissingColumnsRuntime-r004.json | Context | Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/MVP-20261027/reviews/C1TooltipDeltaValidation-r002.md | 9855e9235caa362ae7cd951c9a546f3d23e8f530a9acefedb3dcc383d548537d |
| ContextBootstrap-THeatmapMissingColumnsRuntime-r004.json | Context | Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/MVP-20261027/RuntimeMissingColumnsPlan-r001.json | 1c80cfa3da6a2a319d200f1cea356176eccd5cc0389546013d52ff204ac5c8cc |
| ContextBootstrap-THeatmapMissingColumnsRuntime-r004.json | Context | Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/MVP-20261027/runtime-state-tools/observe-t-heatmap-missing-columns-r004.js | 32dc8e86ca1aed0e17d276b5e0086718e1bf8b928086ae93721d0c0954eb38ed |
| ContextBootstrap-THeatmapMissingColumnsRuntime-r004.json | Context | Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/MVP-20261027/evidence/THeatmapMissingColumnsToolFreeze-r004.json | a109451d732c72928655a5068ba7c49f24792e4ccfd56d699807c548d99c6501 |
| ContextBootstrap-THeatmapMissingColumnsRuntime-r004.json | Context | Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/planning/Topology-actual-r576.json | 1f47967d259645449e07bbd94fe973ba9263b53b365c82db5c3c1b5de2792a84 |
| ContextBootstrap-THeatmapMissingColumnsRuntime-r004.json | Context | core/core-frontend/src/views/chart/components/views/components/ChartComponentG2Plot.vue | cbe650ca9424b73c6ec25e618289ffef5346f6f3ecd7edcdd4d374b09aaa47f5 |
| t-heatmap-missing-columns-runtime-admission-r004.json | goal | Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/Goal.final.json | 4db931a6764a8c48345e7e8358e579550a9bc98594bf1654647716d72b9678c4 |
| t-heatmap-missing-columns-runtime-admission-r004.json | completion_contract | Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/MVP-20261027/UiIntegrationCases-r002.json | e365ef111582ef84f20f26e6136854409b7fc66bb0931cae40a9df5318036d55 |
| t-heatmap-missing-columns-runtime-admission-r004.json | context | Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/planning/ContextBootstrap-THeatmapMissingColumnsRuntime-r004.json | 8625cf02a118909049b61ce8b21fcc83d0015e5227d895182ef24757ad29bbc8 |
| t-heatmap-missing-columns-runtime-admission-r004.json | design_review | Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/MVP-20261027/reviews/UiIntegrationDesignReview-r002.md | 3a56a82c67fc4f68c93d9f2097c79c7a6a70a284a61f522470255a16988a8357 |
| t-heatmap-missing-columns-runtime-admission-r004.json | topology | Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/planning/Topology-actual-r576.json | 1f47967d259645449e07bbd94fe973ba9263b53b365c82db5c3c1b5de2792a84 |
| ContextBootstrap-TablePivotMissingColumnsRuntime-r003.json | Context | Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/Goal.final.json | 4db931a6764a8c48345e7e8358e579550a9bc98594bf1654647716d72b9678c4 |
| ContextBootstrap-TablePivotMissingColumnsRuntime-r003.json | Context | Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/MVP-20261027/UiIntegrationCases-r002.json | e365ef111582ef84f20f26e6136854409b7fc66bb0931cae40a9df5318036d55 |
| ContextBootstrap-TablePivotMissingColumnsRuntime-r003.json | Context | Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/MVP-20261027/RuntimeMissingColumnsPlan-r001.json | 1c80cfa3da6a2a319d200f1cea356176eccd5cc0389546013d52ff204ac5c8cc |
| ContextBootstrap-TablePivotMissingColumnsRuntime-r003.json | Context | Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/MVP-20261027/reviews/UiIntegrationDesignReview-r002.md | 3a56a82c67fc4f68c93d9f2097c79c7a6a70a284a61f522470255a16988a8357 |
| ContextBootstrap-TablePivotMissingColumnsRuntime-r003.json | Context | Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/MVP-20261027/evidence/THeatmapPrimaryDataBuild-r001.json | eef0fb43e9d7ae396a6274b8cce06ba48382c47f4ed2d563023dfb226ba4d15d |
| ContextBootstrap-TablePivotMissingColumnsRuntime-r003.json | Context | Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/MVP-20261027/runtime-state-tools/observe-table-pivot-missing-columns-r003.js | cff260a517b92350a4766444e469148d019908743677d532ee5572e6a0b51d41 |
| ContextBootstrap-TablePivotMissingColumnsRuntime-r003.json | Context | Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/MVP-20261027/evidence/TablePivotMissingColumnsToolFreeze-r003.json | 78bc8c8b038e8b3a427aa804b3d7fd6efc7bfb5d2225451023bcb526f022c66e |
| ContextBootstrap-TablePivotMissingColumnsRuntime-r003.json | Context | Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/planning/Topology-actual-r577.json | de4fdeb4384a2480716a7f163af1d701d21ab9bcdde26952a839951297c1df1e |
| ContextBootstrap-TablePivotMissingColumnsRuntime-r003.json | Context | core/core-frontend/src/views/chart/components/views/components/ChartComponentS2.vue | 50d57d96d863d407e84a6516e958ce06cd8ef144899a05642a0a3343c41bb2f2 |
| ContextBootstrap-TablePivotMissingColumnsRuntime-r003.json | Context | core/core-frontend/src/views/chart/components/views/components/ChartComponentG2Plot.vue | cbe650ca9424b73c6ec25e618289ffef5346f6f3ecd7edcdd4d374b09aaa47f5 |
| table-pivot-missing-columns-runtime-admission-r003.json | goal | Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/Goal.final.json | 4db931a6764a8c48345e7e8358e579550a9bc98594bf1654647716d72b9678c4 |
| table-pivot-missing-columns-runtime-admission-r003.json | completion_contract | Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/MVP-20261027/UiIntegrationCases-r002.json | e365ef111582ef84f20f26e6136854409b7fc66bb0931cae40a9df5318036d55 |
| table-pivot-missing-columns-runtime-admission-r003.json | context | Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/planning/ContextBootstrap-TablePivotMissingColumnsRuntime-r003.json | 2d2c1dad299e51d54143f4ca6b17ee85c8eb6d5cfd6864f6f0e64f37a7f5a43a |
| table-pivot-missing-columns-runtime-admission-r003.json | design_review | Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/MVP-20261027/reviews/UiIntegrationDesignReview-r002.md | 3a56a82c67fc4f68c93d9f2097c79c7a6a70a284a61f522470255a16988a8357 |
| table-pivot-missing-columns-runtime-admission-r003.json | topology | Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/planning/Topology-actual-r577.json | de4fdeb4384a2480716a7f163af1d701d21ab9bcdde26952a839951297c1df1e |

### 公开解释与后续落盘实际字节

只作NB01解释和既有3/3已审候选落盘绑定，不当本lane亲跑产品/测试或实现第四轮。

| 路径 | SHA-256 |
| --- | --- |
| core/core-frontend/src/views/chart/components/editor/editor-style/components/LabelSelector.vue | aee27a2bb636d1581b686dececc7f1446489bae1390d8a558d2276b70fa569b1 |
| core/core-frontend/src/views/chart/components/editor/editor-style/components/TooltipSelector.vue | 2e17ef442ae9ba1f32581e58fe939fe8357e75ca2724feff6ec398a30b2f1c1f |
| sdk/extensions/extensions-view/src/main/java/io/dataease/extensions/view/dto/ChartViewFieldDTO.java | 719a8da60b02a7dd0b1dcc9e4580367d3693a7263452cb7d5192c51fa14dc8cf |
| sdk/extensions/extensions-view/src/main/java/io/dataease/extensions/view/dto/ChartViewFieldBaseDTO.java | c482bb69b96029e5341bdfd08a3c9750097c22ca194f8ed9ea1d65a634150616 |
| sdk/extensions/extensions-datasource/src/main/java/io/dataease/extensions/datasource/dto/DatasetTableFieldDTO.java | a868069e681f53bf5d7bbfbd2439cce160f3f845015165d8313c0441f7073572 |
| core/core-frontend/src/views/chart/components/views/components/ChartComponentG2Plot.vue | cbe650ca9424b73c6ec25e618289ffef5346f6f3ecd7edcdd4d374b09aaa47f5 |
| core/core-frontend/tests/filter-copy-mvp-renderers/check.mjs | b8dbb5e47463960fe5ae59bda68a2c29b56b1d90baa88dda745b885554f6bc3f |
| Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/MVP-20261027/evidence/THeatmapPrimaryData-format-landed-green-r001.log | aef8cd0c78fdb2f09ca262f066dd23c987323b00d019c2681d5d481f2e8f6af5 |
| Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/MVP-20261027/evidence/THeatmapPrimaryData-format-landed-eslint-r001.log | e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855 |
