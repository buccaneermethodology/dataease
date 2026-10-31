# C1 矩阵热力图主数据修复独立验证 r003

**裁决：PASS_WITH_BOUNDS（本次主数据判空修复有界通过）；新增行为阻断 0。** 当前 G2 修复、七个冻结用例及原真实矩阵证据相互吻合。独立发现的 runner 换行问题已核定一个仅格式变化的完整候选，可按下文固定槽位原样落盘；审阅时工作区 runner 尚未替换，不能把候选的 lint 通过写成当前旧 runner lint 通过。本报告不裁定完整 C1、C2、P1、38 项或 49 类型完成。

本轮为 **C1 实现交付累计第 3/3 轮，预算用尽**。原 r001、tooltip r002 决定保留；不重开设计审查，不另起“主数据三轮”或第四轮。`C1V-001` 已由 r002 有界关闭，`C1V-002` 原撤销保持；本次没有据缺少真实 Store 语义的替身翻案。C2 原第 3/3 轮 `BLOCKED / C2V-005` 保持。

- reviewer/source：`/root/local_basemap_reviewer`，独立于本补丁、Cases、runner 和运行 observer 的作者；此前日期 UI helper 属只读技术准备，不是本修复 Builder。
- reviewed_at：`2026-10-30T19:17:54.484779+00:00`；snapshot_id：`S02-C1-THEATMAP-PRIMARY-DATA-VALIDATION-r003`。
- as_of_state：Topology r577、卡绑定的 40 个输入，以及本轮追加的格式候选；受审 G2 SHA 为 `cbe650ca9424b73c6ec25e618289ffef5346f6f3ecd7edcdd4d374b09aaa47f5`，工作区 runner 为 `5fd3c041b5e97edab22cd119f85083af9dcdd205d8138aa722ec924d96c6977a`。
- Card canonical SHA：`ea2196238e68cb2ccb84a824e68fcba3e0d956c1dbff2e52e1bbc52d757d971f`。接收端 validate/render 均 exit 0；render 与冻结 prompt 逐字一致。40 项绑定摘要入场及写报告前全部匹配。
- 唯一持久输出为本报告，写前不存在。未改源码、测试、Cases、旧报告或状态，未操作 UI/DB、安装、构建、启动应用、提交或推送。本报告是有界候选审查，不是 Goal 最终 closeout 或 Stop Gate。

## 原合同、根因与增量

原意图仍是先完成开发权限测试桩下的界面 MVP，完整验收分母不减。Goal 和 phase crosswalk 保留 38 项（P1=12、P2=26）；49 内置类型完整验收仍 0/49，真实权限 `BLOCKED/NOT_RUN`，插件 installed unknown。`MVP-UI-10` 的真实准备后采用、失败保旧和合法空态没有被新数据结构替换；冻结七案只是已观察反例及兼容检查，不是新增业务合同。

源码链直接确认：`TableHeatmapHandler.java:46–49` 向 `transChartData` 传空指标列表；`ChartDataBuild.java:780–835` 只在指标循环中构造辅助 `dataList`，因此矩阵合法行存在时辅助 `data=[]` 可以成立。真实 `t-heatmap.ts:373–399` 消费 `tableRow`，非数组直接不返回实例；其有效行过滤保留数值 0。旧 strict 分支看辅助数组空即采用 NoData，确实错过真实矩阵。

从两份原 preimage 逐字重建 unified diff，与绑定 root patch **完全一致**：

| 对象 | 本轮实际变化 |
| --- | --- |
| G2 SFC | 仅非 ownedLine 的普通 strict G2 判空处选择 `t-heatmap ? tableRow : data`，随后仍只对数组且 length=0 认定合法空态 |
| renderer runner | 加明确的矩阵非数组拒绝 double，并加载原冻结 T01–T07；仍挂载真实完整 SFC |
| 新 BDD card | 原 `MVP-UI-10`、七案、doubles 与非产品验收边界的中文投影 |

将当前 G2 上述唯一替换还原后，整个文件字节等于 preimage；ownedLine 整块逐字相同，其 SHA 为 `9815ad912cfe65fcd3e55d7e5c0a7796f152bdaf7d1da91206c86162da689707`。因此同文件内 G2Plot、C2 和其余事件/清理/准备控制流均未被本补丁改动；没有把工作树其它已有差异归成本次。未修改后端、DTO、查询或真实权限。

## 独立重放与失败沿革

以下命令均在 `/Users/xiaomei/Documents/projects/dataease/core/core-frontend` 执行，无 `--fix`：

| 检查 | 本 lane 实际结果 | 上限 |
| --- | --- | --- |
| `node tests/filter-copy-mvp-renderers/check.mjs` | exit 0；31 PASS、0 semantic failure、0 execution error、unhandled=[] | 真实 SFC/编译/Vue host；图库、DOM 测量和 Store 明示 doubles |
| `node tests/filter-copy-mvp-tooltip/check.mjs` | exit 0；10 PASS、failed=0、execution=0 | 原共享模块候选隔离回归，不扩为真实鼠标/全部图库 |
| `node tests/filter-copy-mvp-paste/check.mjs` | exit 0；21 PASS | 实际 wrapper 控制流；child ports/Store doubles，非真实 query/SDK ready |
| `./node_modules/.bin/eslint src/views/chart/components/views/components/ChartComponentG2Plot.vue` | exit 0、无输出 | 当前生产 G2 文件 |
| 同时对 G2 文件及 `tests/filter-copy-mvp-renderers/check.mjs` 定向 ESLint | exit 1；仅 runner:582 的 prettier 换行错误 | 该失败实际发生并保留，不写成全绿 |
| 格式候选以原目标文件名 `--stdin --stdin-filename tests/filter-copy-mvp-renderers/check.mjs` 送 ESLint | exit 0、stdout/stderr 空 | 候选字节，尚未落盘，见固定槽位 |

另独立执行只读历史回放：在 Node 进程内仅将读取 G2 SFC 的 `fs.readFileSync`/`fs.promises.readFile` 精确重定向到 SHA 已核的 `0-ChartComponentG2Plot.vue`；动态 import **未修改的当前 runner**，Cases 仍为原冻结文件，未换断言或替换 SFC 函数。结果 exit 1，27 PASS，恰 T01/T03/T04/T05 四个语义失败，execution_errors=0、unhandled=[]；source 输出为原 preimage SHA `5ca0da498a294f82b3bb869dc2bcfa71a968b96f0b6ef98f9438cf150755daaa`。这不是编译/缺方法造成的 RED。

| 冻结案 | 当前组件结果 |
| --- | --- |
| T01：矩阵非空、辅助空 | 实际到 draw/render/afterRender，ready |
| T02：矩阵与辅助均空 | 不 draw，合法空态 ready |
| T03：矩阵空、辅助非空 | 不 draw，合法空态 ready |
| T04/T05：矩阵缺失或非数组 | 到 draw 后无实例，prepare 拒绝；未归一化为合法空态 |
| T06/T07：bar 兼容 | 仍依原辅助 data 判空；非矩阵 tableRow 不偷换其规则 |

核读原 RED freeze：Cases SHA `b62a16144bc4f2f49861541254d0ee258ba7a10335050f05ea588b642f54fb7f`、runner SHA `5fd3c041b5e97edab22cd119f85083af9dcdd205d8138aa722ec924d96c6977a` 在原 RED 和原 GREEN 相同。原 RED 27/4/0 与本 lane 回放一致，原 GREEN 31/0/0 与本 lane 当前运行一致。首候选误改 ownedLine 后仍是同四项 RED，原 patch/log 保留，r002 note 明确恢复；生产 SFC 初次 prettier 失败日志也保留，后续仅修该换行。不得表述为首次修复即成功。

本轮核读辅助脚本曾在其它 view 的 null 轴上产生 TypeError，限定真实 target 后完成上述严格比较；这是只读工具投影错误，不计产品 RED。格式证明首个无语境 scanner 在 template/regex 上得到不适用的 401 token 差异，原证明文件保留；本报告没有用该失败 checker 判等。

## 真实失败与恢复原件的独立核读

本 lane **没有重跑浏览器**。已逐张 `view_image` 查看 r003 failure 和 r004 before/after/reopened 四张原图，并直接解析原始 `wire.request`、`wire.body`、diagnostic、save/find 与 fixture CSV。不以 Builder 的 success 字段代替下列复算。

r003 的 candidate wire[1]：target `7520752064427724800`、dataset `1312472054565572608`、type `t-heatmap`、threshold=200，HTTP 成功；辅助 data 长度 0、tableRow 8 行/合计6761。该 8 行与冻结 T01 **逐对象完全相同**。diagnostic 已采用 tree200、outcome=success；失败图却明确“暂无数据”，之后等待 canvas 超时。该次没有发 save；恢复正常退出，panel editorCount=0，重开回已保存 threshold500。失败、超时和恢复分别保留，不能用 r004 覆盖旧失败。

r004 使用同 resource `1312476889213964288`、同 target/dataset 和同 shop/series/amount 轴；driver 起止与冻结 SHA 均为 `32dc8e86ca1aed0e17d276b5e0086718e1bf8b928086ae93721d0c0954eb38ed`。源码冻结为本次受审 G2 SHA。observer 使用正常 reload/选型/拖轴/更新/copy/paste/确认/save/离开/重开，没有 response route 或直接 Store/DB 注入；DEV 权限 allow 仍只属测试桩。

| 时点 | 原始 wire / sequence | CSV 命中及分组复算 | 原始响应 |
| --- | --- | --- | --- |
| baseline500 | wire[5] / 35 | ID 3,5,11,13,16,18,21,25；6 组、5093 | data=[]，tableRow 非空 |
| candidate200 | wire[6] / 40 | ID 3,5,11,12,13,14,15,16,17,18,20,21,23,25；8 组、6761 | data=[]，tableRow 非空 |
| reopen200 | wire[10] / 59 | 与 candidate 相同14 ID、8组、6761 | data=[]，tableRow 非空 |

独立以 CSV 的 amount>threshold 与树内 shop 枚举过滤后按 `(shop,series)` 求和，三个响应每一组严格匹配，无重复组掩盖。CSV SHA 为 `abc8bed0862129d58724bcefff2563862e48d1ea057365ae8d5d2c853e64472b`。逐组结果为：

| shop/series | 500 | 200 及重开 |
| --- | ---: | ---: |
| 乐园店/A | 563 | 563 |
| 南都店/A | 680 | 680 |
| 南都店/B | 604 | 604 |
| 果元店/A | 2091 | 2091 |
| 果元店/B | 579 | 1127 |
| 水围店/A | 576 | 933 |
| 水围店/B | 无该组 | 208 |
| 香橙店/A | 无该组 | 555 |

同时实际核对：sourceBeforeCopy.source、copied.clipboard、after.source、reopened.source 和本型 sourceCopied.clipboard 的完整 tree/ownKeys/undefinedPaths 相等；递归重算四个主要 descriptor 的 13 个 ownKeys 节点均相同、undefinedPaths=[]。before/baseline 保留500、after/reopen为200。该层限于真实 diagnostic 导出的 descriptor，不能称导出内部 fields 全集或从传输 JSON重新恢复 undefined。

candidateWindow [40,41) 只有 **1 个真实 target HTTP getData**（独立于 diagnostic 的 logicalGetDataCalls=1）；raw 响应 data 与 after.queryObservation.responseData 完全相等。正常 copy 本型完成 source export。save wire[7]/sequence43 恰1次、HTTP/业务码成功；reopen find wire[8]/sequence55 的目标 type/整树和三轴与保存请求相同。正常退出 panel editorCount=0；重开 clipboard=null/clipboard_empty，fieldsReady=true；重新请求的结果再次逐组匹配。

四张图的实际结论：r003 是 NoData；r004 baseline 有6个色块，after 与 reopened 有8个色块，均非 NoData。baseline 的自动 surface probe 较早只读到 loading SVG，不能拿该 probe 单独证明矩阵；后续 PNG 直接可见矩阵。after/reopened probe 则记录可见 405×286 CANVAS，PNG 与数据共同支持本次结果。

## 本轮全部发现、残余与未检范围

**C1TPD-N01 / P3 / 非行为阻断：新增 runner 的 assert.equal 未按 prettier 折行。** 本 lane 双文件 ESLint 真实发现于 check.mjs:582；影响是 runner lint，未改变断言或运行结果。下述完整格式候选经独立核验可准入，审阅时目标文件仍旧字节。不能用生产 SFC 单文件 lint 绿掩盖它。

格式候选独立结果：唯一文本变化恰为该 assert.equal 一行折成五行，原字符串/参数/断言/Cases均不变；同文件名解析的两份 AST 均 4312 节点、parse diagnostic=0。我方序列化 AST（kind/flags/operator/leaf text、忽略位置/trivia）SHA 均为 `8cca136b65767aa2a5d7418002e89503a39f70d26ce695e238de08ea5de41415`；canonical printer SHA 均为 `4c9cbd6f3cd74330554aff870aefd1e493a381a3c8ec69308c16d665eafac84a`。序列化结构与 Builder 的 proof 不同，故不冒称 AST hash 逐字同算法；双方的等价结论及 printer SHA 一致。本 lane 自行把候选送原 filename 的 stdin lint，exit0。

已查未见新阻断的维度包括：完整两文件增量、原七案身份、可信 RED→GREEN、合法空态与 missing/malformed 分离、bar 原判空规则、ownedLine/G2Plot/C2 不被改写、tooltip/paste 回归、BDD投影、真实矩阵请求/CSV/图层、descriptor、单candidate/单save、离开重开与清空clip。没有发现需要扩大本次 NoData 合同的冲突。

同类残余查找：G2目录中还存在 stock-line 对 tableRow 的消费，但其 drawChart:294–296 明确同时要求辅助 data 非空，backend 默认结果也按原指标处理；本轮没有它的同类真实反例，不能据矩阵规则泛改全部类型，也不据此声称 stock 已验证。heatmapLegend 只是矩阵辅助消费。其它未搜索到的动态别名/插件路径不假定已排除。

原件中的 schema/阶段名/limits 还沿用 area 字样，initial target 的旧标签写 liquid500，而实际 initial wire[2] 为 sankey500；本报告以真实 type、轴、request、save/find 为准。此为旧复制标签的证据限制，不把它伪装成 area 或恢复 liquid 的证明，也不改写已冻结原件。r004明确最终保留 t-heatmap200、restoredToOriginalLiquid=false。

截图仍显示百分比格式（如209100.00%），本轮未改该配置，不能用截图标签证明数值单位正确；数值结论只限 raw response/CSV 的对应字段。旧 ubo/runtime error、C2清理、百分比配置及其它既有残余保持，pageErrors=[] 不等于 console/resource/runtime 全无错误；preexisting/end runtime error count 均1，未因本次上升也不能因此宣布根因已关闭。

全量 ts:check 本 lane未重跑；已有3个 TS6504 的失败记录保留，不称全项目类型通过或已排除后续诊断。未检真实多用户权限/组织拒绝、跨数据库方言、移动/panel/lib所有入口、全部SDK事件/资源、完整undo/redo、保存失败、所有49类型和插件安装总数；原因是本次精确修复和既有证据层上限。未创建新设计评审或借旧绿色结果关闭这些义务。

## 已审候选的唯一后续落盘规则

当前产品修复可按上述边界吸收。N01的后续状态槽位由 root 执行，**本报告未声称以下动作已经发生**：

1. 从 `evidence/THeatmapPrimaryData-runner-formatted-candidate-r001.mjs` 原样复制到唯一目标 `core/core-frontend/tests/filter-copy-mvp-renderers/check.mjs`。复制前目标必须仍为原 runner SHA `5fd3c041b5e97edab22cd119f85083af9dcdd205d8138aa722ec924d96c6977a`；候选必须为 `b8dbb5e47463960fe5ae59bda68a2c29b56b1d90baa88dda745b885554f6bc3f`。不得顺带改断言、Cases、源码或其它文件。
2. 复制后重算目标 SHA 必须等于候选 SHA，再运行 renderer 原命令得31/0/0、unhandled=[]，及G2/runner双文件定向ESLint exit0。将结果写入新的独立后续原件/状态槽位，不回填本报告、旧Build、旧RED/GREEN或旧preimages。root可使用 `evidence/THeatmapPrimaryData-runner-format-landed-r001.json` 为固定结果槽位；该槽位审阅时未产生。
3. 原 runner 字节已在 before-format-r001.mjs 保留；历史 RED/GREEN仍绑定原 runner 5fd3…，不能声称格式化后的runner与旧RED逐字相同。等价候选与后续复制核验属于本第3/3已审对象的确定性落盘，不另开第四轮。
4. 任一摘要不符、测试/lint失败或拟做额外变化，当前报告不覆盖该变化；保留失败并按耗尽预算处理，只推进独立工作，不自动重审或扩大通过。

准入预测：精确复制且上述复验成功后，可关闭本轮 P3 格式项并吸收矩阵主数据修复及其局部真实链；完整 C1、C2/地图旧阻断、P1 12项、P2 26项及最终 Goal 仍须各自原验收轨迹。当前无需为该行为修复新增实现或新一轮审查。项目无 Session registry/reconcile 工具，本报告不声称程序化注册表校验。

## Read Manifest 与最终字节绑定

以下40项为卡的完整绑定输入，入场/写前均重新计算。卡本身及冻结prompt另已validate/render；补充材料在第二表。引用只证明本报告读取的字节时点，不把后续结果槽位预填通过。

| 卡输入索引与文件 | SHA-256 |
| --- | --- |
| 0: [Goal.final.json](</Users/xiaomei/Documents/projects/dataease/Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/Goal.final.json>) | `4db931a6764a8c48345e7e8358e579550a9bc98594bf1654647716d72b9678c4` |
| 1: [FullAcceptancePhaseCrosswalk-r001.json](</Users/xiaomei/Documents/projects/dataease/Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/MVP-20261027/FullAcceptancePhaseCrosswalk-r001.json>) | `e0a5d2aee17d9d11354d32de02b68debc4b0e7d6cc20b9b0899c55c400e284cf` |
| 2: [UiIntegrationCases-r002.json](</Users/xiaomei/Documents/projects/dataease/Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/MVP-20261027/UiIntegrationCases-r002.json>) | `e365ef111582ef84f20f26e6136854409b7fc66bb0931cae40a9df5318036d55` |
| 3: [UiIntegrationDesignReview-r002.md](</Users/xiaomei/Documents/projects/dataease/Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/MVP-20261027/reviews/UiIntegrationDesignReview-r002.md>) | `3a56a82c67fc4f68c93d9f2097c79c7a6a70a284a61f522470255a16988a8357` |
| 4: [SliceC1Validation-r001.md](</Users/xiaomei/Documents/projects/dataease/Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/MVP-20261027/reviews/SliceC1Validation-r001.md>) | `173489a590f017e2e11f725969d1c85b36ed0424429b4325966c842e554c7eef` |
| 5: [C1TooltipDeltaValidation-r002.md](</Users/xiaomei/Documents/projects/dataease/Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/MVP-20261027/reviews/C1TooltipDeltaValidation-r002.md>) | `9855e9235caa362ae7cd951c9a546f3d23e8f530a9acefedb3dcc383d548537d` |
| 6: [SliceARolePortsValidation-r003.md](</Users/xiaomei/Documents/projects/dataease/Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/MVP-20261027/reviews/SliceARolePortsValidation-r003.md>) | `726720f12d85ec48a459d53058351d9e7580a267f3a696fa7f08587e73d58e28` |
| 7: [THeatmapPrimaryDataCases-r001.json](</Users/xiaomei/Documents/projects/dataease/Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/MVP-20261027/THeatmapPrimaryDataCases-r001.json>) | `b62a16144bc4f2f49861541254d0ee258ba7a10335050f05ea588b642f54fb7f` |
| 8: [THeatmapPrimaryDataImplementationNote-r001.md](</Users/xiaomei/Documents/projects/dataease/Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/MVP-20261027/THeatmapPrimaryDataImplementationNote-r001.md>) | `03653be57b5f8fed66a38aff125ee2bcbcd575ac4d034faf3f8b259eec463103` |
| 9: [THeatmapPrimaryDataImplementationNote-r002.md](</Users/xiaomei/Documents/projects/dataease/Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/MVP-20261027/THeatmapPrimaryDataImplementationNote-r002.md>) | `933379c55cd505182f2027a921cb39c743047b4a3dead8c08bb3facdea4ab374` |
| 10: [manifest.json](</Users/xiaomei/Documents/projects/dataease/Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/MVP-20261027/t-heatmap-primary-data-preimages-r001/manifest.json>) | `f0f0b68614a8b6249fedde4f131ea2954937a8651878314218b685a212de2788` |
| 11: [THeatmapPrimaryDataBuild-r001.json](</Users/xiaomei/Documents/projects/dataease/Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/MVP-20261027/evidence/THeatmapPrimaryDataBuild-r001.json>) | `eef0fb43e9d7ae396a6274b8cce06ba48382c47f4ed2d563023dfb226ba4d15d` |
| 12: [THeatmapPrimaryData-root-delta-r001.patch](</Users/xiaomei/Documents/projects/dataease/Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/MVP-20261027/evidence/THeatmapPrimaryData-root-delta-r001.patch>) | `af3887e7ef6ac991d61f6d7c3d8494a56de65dc669cfb86981520adb9d235073` |
| 13: [THeatmapPrimaryData-RED-freeze-r001.json](</Users/xiaomei/Documents/projects/dataease/Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/MVP-20261027/evidence/THeatmapPrimaryData-RED-freeze-r001.json>) | `38586f796ce1c24fd2db0797c85d9661a81e398627cb1ad141a602ed4b4e50dd` |
| 14: [THeatmapPrimaryData-RED-r001.log](</Users/xiaomei/Documents/projects/dataease/Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/MVP-20261027/evidence/THeatmapPrimaryData-RED-r001.log>) | `9d56f768331e04c7fd440bd506c8724a62facbf247cb5ba994a668ace3e01af8` |
| 15: [THeatmapPrimaryData-first-candidate-still-RED-r001.log](</Users/xiaomei/Documents/projects/dataease/Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/MVP-20261027/evidence/THeatmapPrimaryData-first-candidate-still-RED-r001.log>) | `181031fc8161f543dac6bba266c4fb9d4fd240800d79f77937c0953850433e7d` |
| 16: [THeatmapPrimaryData-first-candidate-unwired-r001.patch](</Users/xiaomei/Documents/projects/dataease/Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/MVP-20261027/evidence/THeatmapPrimaryData-first-candidate-unwired-r001.patch>) | `dbab5bfdad2993b706767c6a266755887d9e6f492bbb33cfa96e8edc77814b3e` |
| 17: [THeatmapMissingColumns-events-r003.json](</Users/xiaomei/Documents/projects/dataease/Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/MVP-20261027/evidence/THeatmapMissingColumns-events-r003.json>) | `a6a850c9a64cfd9a9efe49f29f44d2a9b7730a52ede0eb1dfa35b4116d64c88d` |
| 18: [THeatmapMissingColumns-surface-failure-r003.png](</Users/xiaomei/Documents/projects/dataease/Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/MVP-20261027/evidence/THeatmapMissingColumns-surface-failure-r003.png>) | `d21d997002d5cec733c2069b2ab716281b53e84015bbf2b323c2ff880059c6ca` |
| 19: [THeatmapMissingColumns-events-r004.json](</Users/xiaomei/Documents/projects/dataease/Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/MVP-20261027/evidence/THeatmapMissingColumns-events-r004.json>) | `a562f98ffa561ea3779e3056749ecfce08e7623664862f630aec4197bd71fb48` |
| 20: [THeatmapMissingColumnsToolFreeze-r004.json](</Users/xiaomei/Documents/projects/dataease/Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/MVP-20261027/evidence/THeatmapMissingColumnsToolFreeze-r004.json>) | `a109451d732c72928655a5068ba7c49f24792e4ccfd56d699807c548d99c6501` |
| 21: [ContextBootstrap-THeatmapMissingColumnsRuntime-r004.json](</Users/xiaomei/Documents/projects/dataease/Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/planning/ContextBootstrap-THeatmapMissingColumnsRuntime-r004.json>) | `8625cf02a118909049b61ce8b21fcc83d0015e5227d895182ef24757ad29bbc8` |
| 22: [t-heatmap-missing-columns-runtime-admission-r004.json](</Users/xiaomei/Documents/projects/dataease/Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/planning/t-heatmap-missing-columns-runtime-admission-r004.json>) | `9b00ce63b5f80f2c6924e6bd1345aaa581ed278ff089871817cb74317b9f1148` |
| 23: [observe-t-heatmap-missing-columns-r004.js](</Users/xiaomei/Documents/projects/dataease/Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/MVP-20261027/runtime-state-tools/observe-t-heatmap-missing-columns-r004.js>) | `32dc8e86ca1aed0e17d276b5e0086718e1bf8b928086ae93721d0c0954eb38ed` |
| 24: [THeatmapMissingColumns-before-r004.png](</Users/xiaomei/Documents/projects/dataease/Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/MVP-20261027/evidence/THeatmapMissingColumns-before-r004.png>) | `2d186bdebbbf8e6663e0ececb63e991a00f74aeaa6c7d8b8301e6cc25b872733` |
| 25: [THeatmapMissingColumns-after-r004.png](</Users/xiaomei/Documents/projects/dataease/Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/MVP-20261027/evidence/THeatmapMissingColumns-after-r004.png>) | `06c8cfdc19425478de880e1eabd43d03dc3ed45738206c17fd8581085a3603b6` |
| 26: [THeatmapMissingColumns-reopened-r004.png](</Users/xiaomei/Documents/projects/dataease/Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/MVP-20261027/evidence/THeatmapMissingColumns-reopened-r004.png>) | `10b498324ca36e53750ad7ee32b53099eca9303ff52b28aac9ffb78e6587ad79` |
| 27: [s02-t-heatmap-primary-data.md](</Users/xiaomei/Documents/projects/dataease/tests/bdd/readable_cards/s02-t-heatmap-primary-data.md>) | `ee8583ead541a4d73c1f27d8213774085c24a96aff85d3df918596aaac82b161` |
| 28: [t-heatmap.ts](</Users/xiaomei/Documents/projects/dataease/core/core-frontend/src/views/chart/components/js/panel/charts/g2/table/t-heatmap.ts>) | `38fbd791d675828d7cf6717c439cc34109e08a144b2bd529e4574117e7b0ff31` |
| 29: [TableHeatmapHandler.java](</Users/xiaomei/Documents/projects/dataease/core/core-backend/src/main/java/io/dataease/chart/charts/impl/table/TableHeatmapHandler.java>) | `ba987c67b366a07b0c9ca3b7767ede81d938a52df16e4eb92b441c87d4ad0760` |
| 30: [Topology-actual-r577.json](</Users/xiaomei/Documents/projects/dataease/Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/planning/Topology-actual-r577.json>) | `de4fdeb4384a2480716a7f163af1d701d21ab9bcdde26952a839951297c1df1e` |
| 31: [THeatmapPrimaryData-GREEN-r001.log](</Users/xiaomei/Documents/projects/dataease/Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/MVP-20261027/evidence/THeatmapPrimaryData-GREEN-r001.log>) | `aef8cd0c78fdb2f09ca262f066dd23c987323b00d019c2681d5d481f2e8f6af5` |
| 32: [THeatmapPrimaryData-tooltip-regression-r001.log](</Users/xiaomei/Documents/projects/dataease/Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/MVP-20261027/evidence/THeatmapPrimaryData-tooltip-regression-r001.log>) | `063f3d9aff51a1982bb18170220a43c3c09e4f39df4464f1a6db1a0bff696adf` |
| 33: [THeatmapPrimaryData-paste-regression-r001.log](</Users/xiaomei/Documents/projects/dataease/Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/MVP-20261027/evidence/THeatmapPrimaryData-paste-regression-r001.log>) | `5796ce8aa1f953b0a06db0f9e5850fb3420e1e3844594304cb3ee09d84f150c0` |
| 34: [THeatmapPrimaryData-eslint-initial-r001.log](</Users/xiaomei/Documents/projects/dataease/Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/MVP-20261027/evidence/THeatmapPrimaryData-eslint-initial-r001.log>) | `41a56e7cf3dc3f5fd2240b5fdaa1a3bcdbc20da134d8ce7f099490e39f88a875` |
| 35: [THeatmapPrimaryData-eslint-final-r001.log](</Users/xiaomei/Documents/projects/dataease/Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/MVP-20261027/evidence/THeatmapPrimaryData-eslint-final-r001.log>) | `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855` |
| 36: [ChartComponentG2Plot.vue](</Users/xiaomei/Documents/projects/dataease/core/core-frontend/src/views/chart/components/views/components/ChartComponentG2Plot.vue>) | `cbe650ca9424b73c6ec25e618289ffef5346f6f3ecd7edcdd4d374b09aaa47f5` |
| 37: [check.mjs](</Users/xiaomei/Documents/projects/dataease/core/core-frontend/tests/filter-copy-mvp-renderers/check.mjs>) | `5fd3c041b5e97edab22cd119f85083af9dcdd205d8138aa722ec924d96c6977a` |
| 38: [0-ChartComponentG2Plot.vue](</Users/xiaomei/Documents/projects/dataease/Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/MVP-20261027/t-heatmap-primary-data-preimages-r001/0-ChartComponentG2Plot.vue>) | `5ca0da498a294f82b3bb869dc2bcfa71a968b96f0b6ef98f9438cf150755daaa` |
| 39: [1-check.mjs](</Users/xiaomei/Documents/projects/dataease/Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/MVP-20261027/t-heatmap-primary-data-preimages-r001/1-check.mjs>) | `7d00e3274b48c6629336c083bdb9029cd82bc2202ed89bf54f949f48ea59745f` |

| 本轮补充读取 | SHA-256 |
| --- | --- |
| [THeatmapPrimaryData-runner-before-format-r001.mjs](</Users/xiaomei/Documents/projects/dataease/Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/MVP-20261027/evidence/THeatmapPrimaryData-runner-before-format-r001.mjs>) | `5fd3c041b5e97edab22cd119f85083af9dcdd205d8138aa722ec924d96c6977a` |
| [THeatmapPrimaryData-runner-formatted-candidate-r001.mjs](</Users/xiaomei/Documents/projects/dataease/Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/MVP-20261027/evidence/THeatmapPrimaryData-runner-formatted-candidate-r001.mjs>) | `b8dbb5e47463960fe5ae59bda68a2c29b56b1d90baa88dda745b885554f6bc3f` |
| [THeatmapPrimaryData-runner-format-proof-r001.json](</Users/xiaomei/Documents/projects/dataease/Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/MVP-20261027/evidence/THeatmapPrimaryData-runner-format-proof-r001.json>) | `9278e8ba9f21e3e33c86597f90428d7e73443e48533009653cb8114bbcfac94d` |
| [THeatmapPrimaryData-runner-format-only-r001.patch](</Users/xiaomei/Documents/projects/dataease/Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/MVP-20261027/evidence/THeatmapPrimaryData-runner-format-only-r001.patch>) | `cbfb5cd1c1e598b04898b2cae4c37cb5ebdb4928385482fefe244ce445f2c32b` |
| [TeaMaterialExtended-r001.csv](</Users/xiaomei/Documents/projects/dataease/Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/MVP-20261027/runtime-fixtures/TeaMaterialExtended-r001.csv>) | `abc8bed0862129d58724bcefff2563862e48d1ea057365ae8d5d2c853e64472b` |
| [MvpAcceptanceReadinessHandoff-r001.md](</Users/xiaomei/Documents/projects/dataease/Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/MVP-20261027/MvpAcceptanceReadinessHandoff-r001.md>) | `663cba05b5bbe6c2e1f9abd09353fbde103638b14b6190bb25f0232e61ba5b1b` |
| [SliceC2Validation-r003.md](</Users/xiaomei/Documents/projects/dataease/Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/MVP-20261027/reviews/SliceC2Validation-r003.md>) | `17e6566b99fe25194bf957abaf58c95e4398df4d1edf5aee6aec9e3470575ee6` |
| [observe-t-heatmap-missing-columns-r003.js](</Users/xiaomei/Documents/projects/dataease/Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/MVP-20261027/runtime-state-tools/observe-t-heatmap-missing-columns-r003.js>) | `30050d0f72a804c0f081335dddaf72126356f5cd7f50feb307de24632ad1b290` |
| [ChartDataBuild.java](</Users/xiaomei/Documents/projects/dataease/core/core-backend/src/main/java/io/dataease/chart/utils/ChartDataBuild.java>) | `c1ec97c855182d9745e055c235edae17d709f6f11c83048639da0ba512a8562d` |
| [DefaultChartHandler.java](</Users/xiaomei/Documents/projects/dataease/core/core-backend/src/main/java/io/dataease/chart/charts/impl/DefaultChartHandler.java>) | `17f1afdf01433003416790fc2e19bb3bb88dc23ee164782e04147fdb19b919a5` |
| [ChartHandlerManager.java](</Users/xiaomei/Documents/projects/dataease/core/core-backend/src/main/java/io/dataease/chart/charts/ChartHandlerManager.java>) | `358ab8083fb36c713b5004f969b695a2afdabb19e617c5536d3ab7a9d543e201` |
| [check.mjs](</Users/xiaomei/Documents/projects/dataease/core/core-frontend/tests/filter-copy-mvp-tooltip/check.mjs>) | `79545a2f255b07622c313b4237946a89bf0b87d08fa2522ef0b7a0375fbe7c65` |
| [check.mjs](</Users/xiaomei/Documents/projects/dataease/core/core-frontend/tests/filter-copy-mvp-paste/check.mjs>) | `53aa8180f2f64db19e17848876ec5c548afbe598bd748cb3ea97754a87561065` |
| [ChartComponentS2.vue](</Users/xiaomei/Documents/projects/dataease/core/core-frontend/src/views/chart/components/views/components/ChartComponentS2.vue>) | `50d57d96d863d407e84a6516e958ce06cd8ef144899a05642a0a3343c41bb2f2` |
| [DeIndicator.vue](</Users/xiaomei/Documents/projects/dataease/core/core-frontend/src/custom-component/indicator/DeIndicator.vue>) | `9429ff118457c38616ceb801d9d89b2f70a034b72c948b9c155805e6db60150b` |
| [stock-line.ts](</Users/xiaomei/Documents/projects/dataease/core/core-frontend/src/views/chart/components/js/panel/charts/g2/bar/stock-line.ts>) | `fbbc31c1f88c5a7999940d7ed798542d0e158d0eaddedd40de1d848e8322a413` |

写报告前40项及补充材料均与上述摘要相同；本报告只绑定当前旧runner及已审格式候选，不把尚未发生的复制、复验或Goal终态纳入已完成事实。
