# 负向运行 PNG 补证第二轮独立审查

- reviewed_at：2026-10-30T04:29:01.823181+00:00；reviewer/source：`/root/bubble_ready_validator_resumed`。
- snapshot_id：`S02-NEGATIVE-PNG-VALIDATION-r002`；as_of_state：root已新增12张指标数字原PNG、21条事件、closing overlay DOM及settled对照；本lane实际看图并独立解码/复算，未操作浏览器、数据库或源码。
- 同一负向交付物累计 **第2/3轮**，余1轮；不是新预算。原r001报告、事件、摘要和persistence wire保持原字节，不倒填旧缺图时点。
- 接收端和写前card canonical SHA `d6749941e2fe1f18cabc5a6f88d944cafb79137178a425f1edb02740a6388138`，validate exit0/PASS；Goal+7项base refs共8项摘要一致；result所列12 PNG与旧r001传递引用摘要均一致。

## 裁决

**本批新增指定时点的指标数字裁图保留：有界通过（PASS_WITH_FINDINGS_FOR_NEW_TIMED_CROPS）。新增阻断：0。原r001历史PARTIAL保持，不改写成全部八场景通过。**

独立查看12张图，核验PNG签名/CRC/格式并解码像素，确认两项新settled对照均为原文件逐字节相等、0像素差，同时完整source descriptor、clipboard、指标数值、rect和所记录CSS相等；stale场景还直接记录真实5093响应后保留用户300条件。原network立即采样对照确为28×17共476个像素全部变化并压暗，后续重复操作直接观察到全屏closing message-box overlay，支持“采样在关闭动画期间会污染裁图”的解释。

**证据只覆盖数字span裁图**：11张6761图为28×17，最终5093图为30×17；不是整个指标卡、整画布或整个页面的画面完全保留。新样本取证补足可以正常记账，无须因旧历史无法复原永远阻断后续fresh case；但不能用新图替旧r001原件、追认旧时点因果，或升级整项AC/49类型/真实权限/38义务验收。

本报告独立的是文件审阅和复算，UI动作仍为Builder执行。49/49局部双向观察、0/49完整类型、P1 12+P2 26=38义务、真实鉴权BLOCKED/NOT_RUN、插件installed unknown全部保持。

## 输入、方法与独立结果

完整读取当前full_baseline卡与render prompt、RuntimeNegativePng摘要/21行事件、首轮全部发现及原PARTIAL摘要、PNG比较工具、admission、Topology-r522；扩核旧事件/实际persistence wire摘要未改。12图按result.images精确路径读取并逐张实际查看，没有重新截图、裁切、调色或修改PNG。

独立脚本`/tmp/check-negative-png-validator-r002.py` SHA `8f585e77afbb333cbea549276d3feba8144378d418659451e2790b1d2e768866`，结果`/tmp/check-negative-png-validator-r002-results.json` SHA `b60382a952290eebf4c2af8cd544418acccd6df9604bc4771c70bd9ab2a4b7c5`。该脚本按PNG标准自行解析chunk/CRC、合并IDAT、zlib解压和逆scanline filter，未调用Builder decoder来生成expected；同时独立比较文件bytes/SHA、像素、DOM摘要与状态。另运行已有compare_png-r001.py对三组图片交叉检查，结果一致。所有动作只读冻结输入、写tmp检查脚本/结果及本报告，无API/DB/UI操作。

| 原文件对照 | 尺寸 | 字节相等 | 像素不同数 | 独立观测 |
|---|---|---|---|---|
| network-before → network-after（早采样） | 28×17 | 否 | 476/476 | 全部RGB非增加；左上像素255/255/255变159/160/162，底色整体压暗 |
| stale-recovered-user-edit300 → stale-recovered-after（早采样） | 28×17 | 否 | 476/476 | 底色从201/201/201向254/254/254恢复；并非数字文本变成5093 |
| network-settled-before → network-settled-after | 28×17 | **是** | **0/476** | 两张原文件SHA及解码像素完全相同 |
| stale-settled-user-edit300 → stale-settled-after | 28×17 | **是** | **0/476** | 两张原文件SHA及解码像素完全相同 |

两组settled的7项checks全部独立复算为true，与result.checks逐字段一致。比较stale时使用**用户编辑后300**作为source descriptor基准；不再把编辑前200/clean强行当作应该相等的状态。

所有6761状态记录相同rect：x630.515625/y220.671875/width26.828125/height16.09375；CSS为14px / 16.1px PingFang、transform none、devicePixelRatio1，宽高字符串也相同。PNG外包像素28×17与亚像素rect向外取整一致。这里只比所记录CSS字段，未宣称所有祖先/伪元素/整个页面computed style均相等。

## 逐事件时序与DOM证据

本节#号为新21行jsonl的一基行号。

1. **早采样与driver故障保留。** #1 network before04:08:30.106，#2注入04:08:30.417，#3 after04:08:30.543得到压暗图；#4 stale before04:09:05.651后，#5明确旧hold handler复用冻结writer导致控制器退出。恢复为新临时浏览器后，#6–10重新建立200前态、等待500请求、用户编辑300、实际5093响应到达，两个立即裁图仍不等；这些不足样本没有被删掉。
2. **network settled。** #12 before04:15:53.526为source200/6761；#13在04:15:53.862记录closing DOM；#14 after04:15:54.275为source200/6761、logical1/failure/paste_failed，source/clip/rect/CSS和原PNG均与#12相等。本次前后saveDisabled均false，属于既有未保存状态保持，不是证明本case从clean到dirty的状态转换。
3. **实际closing节点。** #13总共16条overlay摘要中，15条display none；唯一可见者为`ed-overlay is-message-box fade-in-linear-leave-active fade-in-linear-leave-to`，display block、background rgba(0,0,0,0.5)、opacity1，rect覆盖1280×900视口。不是仅凭“可能有遮罩”猜一个不存在的DOM。
4. **stale settled。** #15 before04:17:29.517为200；#16 held500请求04:17:29.829；#17在04:17:31.443记录用户完整300，指标仍6761，原图已是白底稳定图；#18实际status200/code0响应04:17:31.481，tableRow为amount5093；#19 after04:17:31.585仍保完整300/6761，logical1/failure/paste_stale、source/clip/rect/CSS和#17原PNG相同。这里响应确实在用户编辑之后、最后采样之前，未把HTTP成功当采用成功。
5. **恢复。** #20 final_restored500为04:19:33.898，indicator5093/source500/saveDisabled=true、heldRoutes0；对应30×17原PNG也确为5093。result.restoration与该事件逐字段相同。queryObservation仍保留旧paste_stale，不能读成最终restore又发生一次新paste失败，也不能说错误状态已清空。

“等待所有visible overlay消失”是Builder对settled采样步骤的说明；raw记录直接冻结的是#13可见closing节点和随后无压暗裁图，未另存after时刻的全overlay DOM清单。证据可以支持这些指定数字裁图已恢复，不应进一步声称Validator独立确认整页所有overlay在每个时刻都不存在。

## 首轮全部发现的本轮处置

| 首轮发现 | 本轮处置 | 保留边界 |
|---|---|---|
| RNV-F01 两PNG不等/原图缺失 | **新增新时点局部补证成立**：12原PNG归档、两个settled对照相等，早采样差异可见并有closing DOM支持 | r001原文件链未恢复，旧瞬间仍不能追认；只有数字裁图，整卡/页面及全部old-state oracle仍未完整 |
| RNV-N02 初cancel dirty变化 | **保留** | 本轮未重做取消，不把遮罩发现泛化成解释cancel dirty |
| RNV-N03 old-state oracle不完整 | **部分补充像素投影，整体保留** | 无details/origin/purecanvas/page/lastRequest、无关组件、实例/DOM身份、destroy、snapshot/emitter全量对照 |
| RNV-N04 注入/DEV边界 | **保留** | 网络为局部route故障、延期为浏览器hold/release，不是真实服务端异常或鉴权；真实HTTP成功只证明实际响应存在 |
| RNV-N05 最终恢复/清理自报 | **新时点结果保留** | #20/30×17图支持indicator500；heldRoutes0和route清理仍为Builder记录，未独立访问当前浏览器registry；不是新的save/find原始链 |
| RNV-N06 地图ubo等残余 | **保留** | 新临时浏览器errors=[]不是原浏览器旧错误已修复；details/flow/heat等旧缺口不因补数字图关闭 |

旧r001全体checks与PARTIAL字节未改，旧事件SHA仍为`1112c9c7ca34711eb86fcffd853a3a783c35ab4b961cb7a97216f52609141ceb`。本轮不要求重跑原八场景来凑全绿，也不把两个有界新样本自动升为八项AC通过。

## 本轮全部发现与证据上限

### RNV2-N01｜P2非阻断：closing overlay解释有直接新证据，旧瞬间因果仍有限

network早图确为整个28×17压暗、stale早图在淡出过程中恢复，后续同类操作又捕获实际closing节点，稳定样本完全相同；这支持把新观察的暂态差异与关闭动画采样区分。#13 DOM位于04:15的后续重复操作，不与#3的04:08截图同一原子采样，更不是r001 02:08/02:16旧图。不能把它写成“旧两次差异的唯一根因已确证”或据此声明产品没有任何画面缺陷。旧hash与某张新图相同也不补回旧采集时点/进程来源链。

后续无需为不可复原历史机械追加无限review；保留历史未知，同时使用本轮已绑定fresh样本做局部进展即可。

### RNV2-N02｜P2非阻断：原PNG是数字小裁图，整图零副作用尚未证明

12张均为数字span裁图，rect/CSS也来自该span。byte equality足以证明对应裁图逐字节相同，不能覆盖指标名、整个card布局、其他画布元素、地图WebGL、祖先遮罩/交互或Store资源身份。报告和后续进度应使用“指定时点指标数字裁图一致”，避免压缩成“整个旧画面已完整保留”。这一限制是现有AC原old-state分母，不新增产品框架。

### RNV2-N03｜P2执行证据：恢复浏览器后的记录不能拼成不中断的原运行

#5及result.driver_recovery明确保留冻结writer导致旧controller退出、两次沙箱Chrome启动SIGABRT/EPERM、通过已有授权使用新临时profile恢复。r001未覆盖；新session与新PNG是新的执行样本。Builder关于崩溃原因/启动失败/授权恢复的说明属于其执行记录，本lane没有重启Chrome或独立检查原进程日志，不能推广成产品崩溃或产品性能数据。

### RNV2-N04｜P3证据精度：逻辑1失败与网络层观测仍分开

settled两case的logicalGetDataCalls=1/failure来自真实前端诊断；stale有单独成功HTTP事件，network新settled没有独立第二份wire/route.abort明细事件。现有同批network注入记录及Builder步骤足以支持受控场景的有限复算，但不能把计数宣称为所有物理HTTP/重试数量，也不应把局部network模拟升级为服务器真实故障验证。

本轮没有其余阻断。所有原残余和本轮限定已一次列全；没有在首个旧问题处早退，也没有为提高结论而修改图片、旧日志或生产代码。

## 原PNG摘要绑定

全部路径位于本包`evidence/`。12个文件虽有相同内容摘要，仍按不同事件命名分别保留，不把同内容误计为12个独立用例。

| 文件 | SHA-256 |
|---|---|
| RuntimeNegativePng-final-restored500-r002.png | `6787c2a207846f28ca4189adb3ddcbd82c3039aa69671d867aa9907f39e82500` |
| RuntimeNegativePng-network-after-r002.png | `00ef912838881072e4cfa48e60a354be551ea762b0adab5e999a81f708c6a35e` |
| RuntimeNegativePng-network-before-r002.png | `9d573c8b4e58647fc3d366603d21774b34e122bb296351cac232acd816f42cf9` |
| RuntimeNegativePng-network-settled-after-r002.png | `9d573c8b4e58647fc3d366603d21774b34e122bb296351cac232acd816f42cf9` |
| RuntimeNegativePng-network-settled-before-r002.png | `9d573c8b4e58647fc3d366603d21774b34e122bb296351cac232acd816f42cf9` |
| RuntimeNegativePng-stale-before-r002.png | `9d573c8b4e58647fc3d366603d21774b34e122bb296351cac232acd816f42cf9` |
| RuntimeNegativePng-stale-recovered-after-r002.png | `21ab535d06dab615d887325bedccbaf52797e6e375be5d3844d52ea8b1d467a5` |
| RuntimeNegativePng-stale-recovered-before-r002.png | `9d573c8b4e58647fc3d366603d21774b34e122bb296351cac232acd816f42cf9` |
| RuntimeNegativePng-stale-recovered-user-edit300-r002.png | `bed1e75bfc9ef28ba23f5c5cc5ba1ca750d2bd5dd1caf9b297973c371699e2cb` |
| RuntimeNegativePng-stale-settled-after-r002.png | `9d573c8b4e58647fc3d366603d21774b34e122bb296351cac232acd816f42cf9` |
| RuntimeNegativePng-stale-settled-before-r002.png | `9d573c8b4e58647fc3d366603d21774b34e122bb296351cac232acd816f42cf9` |
| RuntimeNegativePng-stale-settled-user-edit300-r002.png | `9d573c8b4e58647fc3d366603d21774b34e122bb296351cac232acd816f42cf9` |

## 已检查无问题与未检查原因

已检查：卡/8项输入/12 PNG/旧r001引用摘要；PNG签名、CRC、8-bit无交错RGB格式与尺寸；全部实际图像；独立和既有decoder一致；早图476像素差与稳定0差；两组source/clip/indicator/rect/CSS/逻辑失败check；actualHTTP5093→保300时序；closing DOM可见节点；driver恢复不覆盖旧输入；最终500状态/图与restoration相等；原38/49/真实鉴权边界不提高。

未检查：没有独立UI动作、故障注入、HTTP请求、保存、重开、数据库操作或当前route/overlay实时检查；没有原r001两张截图，不能复原它们；没有全图/页面像素、Store全量metadata/实例生命周期、真实网络和权限或全部49类型/38义务验收。没有重新运行原八个场景或新建产品框架，原因是本轮限定补图证据。没有构建、安装、部署或源码/测试/共享Dashboard修改；唯一仓库输出是本报告，独立脚本/结果在tmp。

## 准入预测与下一步

可以吸收“负向补图第2/3轮，新两个指定稳定时点的数字裁图与局部状态一致”的有界结果；历史r001 PARTIAL和未覆盖维度仍按原时点保留。若后续做整项AC验收，针对尚缺的整图/Store/资源投影及原负向矩阵补证即可，不需要机械重跑已有成功样本或借新交付物重置轮次。

地图details修复是独立交付物，本报告不评价其实现，也不把8100运行包等同新源码。真实权限、0完整类型和38义务继续原范围，当前没有MVP/Goal终态结论。
