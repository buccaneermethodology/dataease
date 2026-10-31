# P1逐类型运行证据最小补列计划 r001

这是设计输入，**没有新执行UI、HTTP、DB或产品实现，也没有新增验收通过**。原38义务（P1=12、P2=26）/49内置类型、完整0/49、真实权限BLOCKED/NOT_RUN、插件installed unknown均保持。当前计划不重开任何旧评审预算。

先复用证据再采样。已有81份paste数学投影、四类mix新时点8侧数学已独立通过；已有正常Save/leave/reopen标记不等“从未执行”。缺少原始after或重开数据时，只补该列。`save_find_HTTP_chain=unknown`是证据层次说明，**不是新追加每type强制重抓HTTP的AC**。需要新UI时顺手录齐已有响应可减少返工，不为列的名字扩大产品要求。

## 已有整画布可直接候选补列

| 原始包 | save / find | 除包目标外可复用内容 | 限制 |
| --- | --- | --- | --- |
| picture r004 | wire1 / wire2；退出16:15:19.048Z，panel editor0 | indicator500完整树保存/读回相等，wire3真实query=5093；richtext200整树相等，wire5真实query首组果元店3218；source symbolic500与picture500整树也保存读回相等 | 保存view的type按canvasViewInfo，picture query DTO出现table-info不自动变table-info产品target证据；空的unused picture不当基本树通过 |
| gauge r001 | wire2 / wire3；真实panel editor0 | 整画布richtext200、symbolic500、picture500的保存/读回树相等，wire5/6/7为对应重开query | gauge自己的6761→5093合法量程已独立通过；其它view按其数据/字段层次补列，不能只凭请求存在全通过 |
| liquid r001 | wire2 / wire3；真实panel editor0 | 同上，wire5/6/7均有原始重开query | liquid量程局部已过，当前target最终liquid500，不称恢复indicator |
| symbolic新clone r002 | 本轮2find/2symbolic，延续同clone/jar原save | 正常panel退出editor0、重开整树/clip空，三组代表与CSV正确 | 8110已停止；只复用该包新源码结论，不能拼原8100数据或称本轮新save |

上述整画布比较是本设计lane读原始JSON后的**候选列复用**，JSON内保留每个view、wire pointer及indicator/richtext必要值投影，其余原行仍留在源文件，不修改原矩阵，不冒充新独立验收。richtext200返回的是one_group第一组3218，不能误写全量6761。

`gauge/liquid/picture-group/symbolic-map`不需要为本次缺列再做type采样。`bar/bubble-map/flow-map/heat-map/map/table-info`先展开已有独立包并补矩阵，不能因原CGS矩阵写other_package_not_reviewed就认定失败或要求重跑。line的base wrapper已有真实query与结果，但树为省略投影，优先定位full原件再决定。

## 本次最少新见证安排

当前CGS缺列清单留下 **37个“一种基本配置”候选type**，外加indicator/richtext **2个仅树原件短采样候选**。这不是37次固定必跑的新must-have：原件找到即从待采样列删除；line先查base。它也不是49×全部负向或2401配对。一个type只选下表一种合法配置，原额外变体未知保持，不倒填也不作为本次全变体重跑前置。

- `area-stack/bar-stack/bar-stack-horizontal`优先复用C单系列shop+sum(amount)，可选堆叠轴空。不能因G另有series/city就强迫重做所有variant，不能用C的保存反向声称G配置已验。
- 37候选主要补source/clip/adopted target三份完整原件和重开结果；其中已有完整reopenTree的16型不重判旧树失败，新case如因捕获原件确需UI就一并录齐。没有旧after原件，不能重建成旧时点“真值”。
- indicator500和richtext200已有新raw保存/重开数据，只在三对象原件确实缺失时短采样；使用相同type/tree/合法轴可复用旧持久化列。新配置不一致时，保留为新时点树证据，不能不保存却声称该新配置已持久化。

## 可直接冻结observer的具体UI输入

专用resource `1312476889213964288`，dataset `1312472054565572608`。当前报告前态：source symbolic500=`7520741153101058048`；可临时改type的target liquid500=`7520752064427724800`；richtext200=`7521402539875504128`；picture500=`7521406441329004544`。执行者仍需在case开始真实读回type/tree，计划不是新UI观察。

统一流程：

1. 用现有symbolic500正常复制作为500前态来源。按需先正常paste建立target500，单列setup窗口，不能算正式candidate。不要直接写Store/JSON或DB。
2. 选target实际tile，点`.chart-type-select`后点`[data-id="UserView&TYPE"]`，不要点相邻名称文字；打开字段tab。richtext/picture选既有组件，不强行靠隐藏palette切换。
3. 在`#pane-data .ed-row.drag-data`中按下表精确轴名定位；每轴标题`.remove-icon`清空旧字段。仅清空本type展示的轴，隐藏不存在则跳过。清空不需要的可选xAxisExt/extStack/右子类别/气泡/钻取，防止上次type轴残留。
4. 从`.field-name[title="FIELD"]`正常drag到对应轴的draggable容器。按实时DOM rect定位并滚动到可见；旧helper源x+20/y+10→rowx+100/y+50可作起点，不能固定旧屏幕坐标。多字段按追加/实际请求数组读回确认顺序，stock尤其如此。普通聚合读UI(求和)和request summary，box/raw不强制sum。
5. **点“更新图表数据”并等待该target真实响应/fieldsReady/renderer ready**。字段tab可见或字段先恢复不是数据已应用的屏障。配置探索单独留失败与恢复，正式driver先冻结。
6. 用richtext200正常copy，保存sourceBefore descriptor和copied source/clip；选target保留targetBefore。正式窗口仅包一次paste/必要覆盖确认至success，录after descriptor、operationId/targetId/request/data。T200沿用旧独立oracle，不另起数学重测任务。
7. 当前type采用后正常copy，落本type source+clip原件；旧source角色已经记录，不必每型重做所有反向配对。只补缺列。需要当前基本配置持久化证据时，显式Save一次、真实离开并重开，录完整源树/clip与实际结果。
8. 退出可用当前.back-icon→panel editor0，也可用旧leaveDashboard的“数据集”独有文案可见屏障。两者都应按实际记录，不能称旧helper只是hash。草稿恢复“否”保持为独立记录。监听网络时自然包含整个画布save/find和其它view，继续复用，避免逐type另跑相同保存。

| type | 最少动作类别 | 轴名、字段与ID（每型一种基本配置） |
| --- | --- | --- |
| `area` | 一基本配置补列 | 类别轴 / 维度：shop(1793083721149)；值轴 / 指标：amount(1793083721146) |
| `area-stack` | 一基本配置补列 | 类别轴 / 维度：shop(1793083721149)；值轴 / 指标：amount(1793083721146) |
| `bar-group` | 一基本配置补列 | 类别轴 / 维度：shop(1793083721149)；子类别 / 维度：series(1793083721157)；值轴 / 指标：amount(1793083721146) |
| `bar-group-stack` | 一基本配置补列 | 类别轴 / 维度：shop(1793083721149)；子类别 / 维度：series(1793083721157)；堆叠项 / 维度：city(1793083721151)；值轴 / 指标：amount(1793083721146) |
| `bar-horizontal` | 一基本配置补列 | 类别轴 / 维度：shop(1793083721149)；值轴 / 指标：amount(1793083721146) |
| `bar-range` | 一基本配置补列 | 类别轴 / 维度：date(1793083721147)；开始值 / 时间维度或指标：amount(1793083721146)；结束值 / 时间维度或指标：target(1793083721162) |
| `bar-stack` | 一基本配置补列 | 类别轴 / 维度：shop(1793083721149)；值轴 / 指标：amount(1793083721146) |
| `bar-stack-horizontal` | 一基本配置补列 | 类别轴 / 维度：shop(1793083721149)；值轴 / 指标：amount(1793083721146) |
| `bidirectional-bar` | 一基本配置补列 | 类别轴 / 维度：date(1793083721147)；值轴 / 指标：amount(1793083721146)；副轴值 / 指标：target(1793083721162) |
| `box-plot` | 一基本配置补列 | 类别轴 / 维度：shop(1793083721149)；子类别 / 维度：series(1793083721157)；值轴 / 指标：open(1793083721158) |
| `bullet-graph` | 一基本配置补列 | 类别 / 维度：date(1793083721147)；实际值 / 指标：open(1793083721158)；目标值 / 指标：target(1793083721162) |
| `chart-mix` | 一基本配置补列 | 类别轴 / 维度：shop(1793083721149)；左值轴 / 柱指标：open(1793083721158)；右值轴 / 线指标：target(1793083721162) |
| `chart-mix-dual-line` | 一基本配置补列 | 类别轴 / 维度：shop(1793083721149)；左子类别 / 维度：series(1793083721157)；左值轴 / 柱指标：open(1793083721158)；右值轴 / 线指标：target(1793083721162) |
| `chart-mix-group` | 一基本配置补列 | 类别轴 / 维度：shop(1793083721149)；子类别 / 维度：series(1793083721157)；左值轴 / 柱指标：open(1793083721158)；右值轴 / 线指标：target(1793083721162) |
| `chart-mix-stack` | 一基本配置补列 | 类别轴 / 维度：shop(1793083721149)；堆叠项 / 维度：city(1793083721151)；左值轴 / 柱指标：open(1793083721158)；右值轴 / 线指标：target(1793083721162) |
| `circle-packing` | 一基本配置补列 | 圆形名称 / 维度：shop(1793083721149)；圆形大小 / 指标：amount(1793083721146) |
| `funnel` | 一基本配置补列 | 漏斗分层 / 维度：shop(1793083721149)；漏斗层宽 / 指标：amount(1793083721146) |
| `indicator` | 仅树原件短采样 | 指标：amount(1793083721146) |
| `line` | 先查base原件，缺才补 | 类别轴 / 维度：shop(1793083721149)；值轴 / 指标：amount(1793083721146) |
| `multi-scatter` | 一基本配置补列 | 颜色 / 维度：shop(1793083721149)；横轴 / 时间维度或指标：date(1793083721147)；纵轴 / 指标：amount(1793083721146)；明暗 / 指标：amount(1793083721146) |
| `percentage-bar-stack` | 一基本配置补列 | 类别轴 / 维度：shop(1793083721149)；堆叠项 / 维度：series(1793083721157)；值轴 / 指标：amount(1793083721146) |
| `percentage-bar-stack-horizontal` | 一基本配置补列 | 类别轴 / 维度：shop(1793083721149)；堆叠项 / 维度：city(1793083721151)；值轴 / 指标：amount(1793083721146) |
| `pie` | 一基本配置补列 | 扇区标签 / 维度：shop(1793083721149)；扇区角度 / 指标：amount(1793083721146) |
| `pie-donut` | 一基本配置补列 | 扇区标签 / 维度：shop(1793083721149)；扇区角度 / 指标：amount(1793083721146) |
| `pie-donut-rose` | 一基本配置补列 | 扇区标签 / 维度：shop(1793083721149)；扇区角度 / 指标：amount(1793083721146) |
| `pie-rose` | 一基本配置补列 | 扇区标签 / 维度：shop(1793083721149)；扇区角度 / 指标：amount(1793083721146) |
| `progress-bar` | 一基本配置补列 | 类别 / 维度：shop(1793083721149)；目标值 / 指标：target(1793083721162)；实际值 / 指标：amount(1793083721146) |
| `quadrant` | 一基本配置补列 | 类别 / 维度：date(1793083721147)；横轴 / 指标：amount(1793083721146)；纵轴 / 指标：amount(1793083721146) |
| `radar` | 一基本配置补列 | 分支标签 / 维度：shop(1793083721149)；分支长度 / 指标：amount(1793083721146) |
| `rich-text` | 仅树原件短采样 | 维度：shop(1793083721149)；指标：amount(1793083721146) |
| `sankey` | 一基本配置补列 | 源 / 维度：shop(1793083721149)；目的 / 维度：series(1793083721157)；数据 / 指标：amount(1793083721146) |
| `scatter` | 一基本配置补列 | 类别轴 / 维度：shop(1793083721149)；值轴 / 指标：amount(1793083721146) |
| `stock-line` | 一基本配置补列 | 日期 / 维度：date(1793083721147)；开盘价-收盘价-最低价-最高价 / 指标：open(1793083721158),close(1793083721159),low(1793083721161),high(1793083721160) |
| `t-heatmap` | 一基本配置补列 | 横轴 / 维度：shop(1793083721149)；纵轴 / 维度：series(1793083721157)；颜色 / 维度或指标：amount(1793083721146) |
| `table-normal` | 一基本配置补列 | 数据列 / 维度：shop(1793083721149)；数据列 / 指标：amount(1793083721146) |
| `table-pivot` | 一基本配置补列 | 数据行 / 维度：shop(1793083721149)；数据列 / 维度：series(1793083721157)；数据列 / 指标：amount(1793083721146) |
| `treemap` | 一基本配置补列 | 色块标签 / 维度：shop(1793083721149)；色块大小 / 指标：amount(1793083721146) |
| `waterfall` | 一基本配置补列 | 类别轴 / 维度：shop(1793083721149)；值轴 / 指标：amount(1793083721146) |
| `word-cloud` | 一基本配置补列 | 词标签 / 维度：shop(1793083721149)；词大小 / 指标：amount(1793083721146) |

源码另核：indicator的实际轴名是“指标”；t-heatmap的“颜色 / 维度或指标”对应内部`extColor`，不是`yAxis`。

完整机器配置、要清空的可选轴及每轴字段id/summary见配套JSON `rows[].configuration`。现有sourceFields中共19字段，JSON `field_catalog`包含原名、fieldId、dataeaseName、deType，observer无需猜字段。

日期与特殊型必须保留语义：date按既有日粒度expected，不用完整timestamp代替按日分组。box-plot的tableRow为shop+series分组open中位数，不是sum；multi-scatter按原raw行比较。stock最终request yAxis必须按open/close/low/high语义次序，旧native多次drag的发起顺序不能直接当最终数组。mix分别读取responseData.left/right：plain左shop、group/dual左shop+series、stack左shop+city；左open，右shop+target，不把左右合成一份或只看总数。

两棵标准树仍为AND amount>200/500 + 嵌套OR六店；T20014行/6761，T5008行/5093。source/tree/clip比较保留完整字段、null/空串/缺失、分组和数组顺序，记录ownKeys/undefinedPaths；生命周期字段tableId/createdAt/revision单独核，不误混入source tree descriptor。不要复用先前检查器曾发生的DTO/data或dict/JSON字符串层次误判。

## 正常离开原helper的精确证据

native文件：`/Users/xiaomei/.codex/sessions/2026/10/15/rollout-2026-10-15T19-02-35-01a14272-6279-7601-bc9b-b7def784b978.jsonl`。以下仅选任务允许的非认证function_call name=js、arguments.code；不读login/headers。行摘要包含换行，持续append全文件不作为不可变hash。

| native行 | call_id | 原行SHA-256 | 用途 |
| --- | --- | --- | --- |
| 88716 | `call_8b52e4dfa25c49bda9d8773ba11d87a0` | `1936bb53e56ddd3c937ad41bf0c040dc441d1e28bf5abf48fb63a6a73afb480e` | leaveDashboard等待数据集独有文案可见 |
| 88744 | `call_6f1a5dc9b42843e99fb8a809d2370025` | `3b5ee67a77f9ddce6b74df92be737e89aa9e3b54e178c8f07e6342499160c258` | prepareType早版 |
| 88769 | `call_48be39c415004bdbadbd04df756820f3` | `b0cff251a970f9829f7429534fadcb0d464566b5d1c64d1d752d9518a1552cef` | prepareType读AX以刷新而非ready屏障 |
| 88959 | `call_7b3044051ccc429088a05fb350a3ae1d` | `0691ba4bbfc8ed833d224f55f0b898585fb847002b711bb0d0886dad1552ad08` | groupFinish正常保存/数据集页退出/重开；after未完整落盘 |
| 89176 | `call_b359e118deb947589d0de67dffc864e1` | `f5d9e303c02f0313d8c2bf33c397e68a3efe05a0d62cf7530d7c196ed4e2c71b` | specialFinish同正常流程；recovery_dialog保留 |
| 89183 | `call_a6a9d937b2e347c1b6c4a229ab58f445` | `2bf4987f0ed8488c98abd4e9b2ac0dbb9c06e9c882707a7e2114be176c51396e` | table-normal正常shop字段drag |
| 89202 | `call_5e4c71e986b442709c1118a265c4fd3e` | `ea13240a3fa12ae9e69b248b5e369433ff1524996a16fa1faef9a0b1c190fcc9` | t-heatmap amount颜色drag |
| 89225 | `call_1241e4b83a5b40af9d21a87fd7744b1b` | `cf2719811fbc13b64aaf8d9f48db1fd51fab64ccf582eb0dfd28f3264bec692f` | multi-scatter日期横轴/颜色shop |
| 89312 | `call_adc266db9b344783b17bc00e447da4ca` | `db66a50ee76de089798b0da8f5048d09963291263041a0f6ea61bb0ab5488a4c` | stock第一次填字段，次序后续调整 |
| 89319 | `call_99219c637c4e43f7b1f3902ceda0351a` | `6458bd340fe216dffa9d8f1aa56996eddb617c5485f53c769aca03f387b27d20` | stock次序调整；不从drag顺序假定最终数组 |
| 89324 | `call_74ea11e00b0741bbab2cc5ee72cdbe2f` | `eb8335e8015d2ba73a2025b14a7252d13904fce7627a5cfd1f8efc882e37cf1d` | stock更新/保存后续 |
| 89338 | `call_2c19d40b27464ebab280b825f1ab9251` | `89b0441c62b2c289fb5c26c0cdb3429bde28a25d9ee949ac0ae816933216c20e` | box shop类别drag |
| 89463 | `call_0d9972b0ba8d41ffa5ebe38cef443101` | `879eeda64197bee34a04e5794383f457844ac4e9c905ee6bf7b2af29098141f5` | 双轴分侧data采集及type切换 |
| 89520 | `call_dce3f90ceb0441518ee5f9dd91611714` | `6ccd3bdaae24563f8befc6f7fade0148806b199bc0991210259df5ff32578f27` | richtext维度/指标正常drag |

第88716行明确goto数据集页后等待**“请在左侧选择数据集” visible**，并读取AX；不是只改hash，也不能和近期字段列表先恢复混淆。第88959/89176的finish确实正常Save并等“保存成功”、调用leaveDashboard再重开；但落盘只有treeMatches等布尔的事件，依然缺after完整原件。真实操作发生与证据原件齐全必须分开。旧helper的AX刷新不是每type renderer ready充分条件，新observer采用上面的真实响应屏障即可，不扩成通用渲染治理。

## 恢复、保留与开工判断

执行结束以正常UI恢复source symbolic500、target liquid500/fixed max10000、richtext200、picture500。恢复声明仅覆盖**类型/完整树/必要合法轴与实际保存状态**；临时type切换会影响隐藏配置，不能说全部hidden字节逐项回退。当前计划未执行任何恢复；未恢复项应如实列出。

保留旧circle/progress click TypeError、progress准备失败后恢复、richtext空内容失败等原记录。本任务不修这些异常、不扩共享渲染治理、不借pageerror0关闭旧ubo/C2，也不启动新审查轮。真实权限和其它未覆盖义务仍是原Goal分母。

**输入已经足够root直接编写并冻结第一批observer**（建议area或table-normal先用同一协议）。不必等其它包unknown或全变体才开工；每个未知按对应列定位原件或当前case读回，真正field/type/合法轴不符才停该case并继续独立type。两个无进展单元后应诊断，不用盲点/Store猜值掩盖。计划本身不授权安装、启动新服务、改DB、推送或产品实现。
