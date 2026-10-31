# 既有类型运行结果证据独立验证 r002

- reviewed_at：`2026-10-30T17:32:33.043757+00:00`。
- snapshot_id：`S02-RUNTIME-TYPE-EVIDENCE-VALIDATION-r002`；as_of_state：卡r002b绑定Topology-r570及本报告输入清单。卡canonical SHA-256 `1b5e4d687251eaaa17c49c0cf6800bce6b9311a9ab845b4f494ba53555bce13b`。
- verdict：**PARTIAL_EVIDENCE_RECOMPUTED（结果层独立复算通过，完整验收仍不具备）**；本原始类型证据交付累计第 **2/3** 轮。因新增5类inventory按full_baseline重建；不重开任何实现、C/G/S原证据或已耗尽旧预算。
- 新增五类结果数学差异0，新增产品阻断0。严格保存形状有一项明确不匹配：map事件5→11；原样记录，不归一化或升级成未经合同判定的产品缺陷。

**bar、line、table-info、map、bubble-map 五类各自实际结果均可核，可与既有44类形成49/49“结果层候选”新投影。完整类型仍0/49，P1 12+P2 26=38义务、真实权限BLOCKED/NOT_RUN、插件installed unknown不变。** table-info是14行shop多重集，并无amount/ID列；“49结果层”不能改称49个金额聚合、49完整类型或P1已通过。

## 基线、原件和方法

接收端validate/render均退出0。18个唯一卡输入（19处引用含重复Goal）逐项原字节SHA匹配；r001矩阵原16输入与3个追加输入、progress-r010的8个报告引用也重算摘要一致。原CGS的逐事件数学与历史裁决复用其冻结独立报告，不重开实施包。新矩阵仅更改五个type行及输入/汇总元数据，另外44行逐对象比较与r001相同；旧文件原字节未改。

本lane只读取卡给定原件、CSV及必要native非认证任务窗口中 `function_call name=js` 的 `arguments.code` 与相同call_id的文本输出。未读取login/密码/headers，不导出整段会话或图片base64到交付物。源码、UI、DB、应用HTTP、安装、构建和测试均未操作。写前两输出均不存在；HEAD `1e84e7438462e5d6fc371358da3bdad7d24a5c1a`；保留工作区既有改动，只新增本报告与矩阵。范围外Goal终态、Dashboard/KB、完整diff、Session registry与Stop Gate不由本lane处理。

矩阵：`evidence/RuntimeTypeEvidenceMatrix-r002.json`，SHA-256 `e52404a6f422d1f2897c7febb5c5baccc6315d8646e719156696b8b1134337a9`。它包含49唯一type、五类逐列结论、原r001冻结统计、native调用/输出行SHA与call_id、逐组expected、map形状差异、保留历史和最小动作。

独立复算脚本 `/tmp/review_runtime_type_r002.py` SHA-256 `80e688a7f9ecd12de57be52364730fd9e998b3b45c407f1ada62986a8089cd41`，结果 `/tmp/review_runtime_type_r002.result.json` SHA-256 `ca0cbd2a3f5ea961ee0c7410c9eb4ecea041ee7be939f7ede4f89a2596055087`，最终退出0。临时文件不作为唯一长期证据；全部必要结论和定位已入两份授权输出。探索性诊断打印初次对pending中的null request/response取属性失败，补齐null分支后复算；这是审阅辅助程序的处理前提，不计产品失败，不把最终退出0说成首次无失败。

| 输入（相对于工作区） | SHA-256 |
| --- | --- |
| `Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/Goal.final.json` | `4db931a6764a8c48345e7e8358e579550a9bc98594bf1654647716d72b9678c4` |
| `Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/MVP-20261027/TSP.md` | `ae03f58a18373d41a139f8831101e3294b9c80e7252ad48cefb779a4a878acae` |
| `Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/MVP-20261027/reviews/MvpAcceptanceReadinessReview-r001.md` | `fba3b6ad368e085b787cd9a69497f5fb51163397559d718f7596dd014a06d9af` |
| `Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/MVP-20261027/reviews/RuntimeTypeEvidenceValidation-r001.md` | `aa856f3cca2bd7df70d8cc448ab7766d056f02ee14f995c3fffa7ddb7b6f9944` |
| `Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/MVP-20261027/evidence/RuntimeTypeEvidenceMatrix-r001.json` | `7fea5b5cefad88e8b4c26dc85b1a721ca1c07bb5c8a15f7d0dd9a8f1cc99d468` |
| `Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/MVP-20261027/evidence/RuntimeUiProgress-r010.json` | `3d3eaf73687b54b55c95b294fcdb5e0b4fbc633b7f79674302200e94030a03fe` |
| `Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/MVP-20261027/runtime-fixtures/TeaMaterialExtended-r001.csv` | `abc8bed0862129d58724bcefff2563862e48d1ea057365ae8d5d2c853e64472b` |
| `Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/MVP-20261027/RuntimeMissingColumnsPlan-r001.json` | `1c80cfa3da6a2a319d200f1cea356176eccd5cc0389546013d52ff204ac5c8cc` |
| `Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/planning/Topology-actual-r570.json` | `a889e42695960066a8cf40978a6bbe6c6a3ada970e1ccc5bc1916b51a35e30b6` |
| `Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/MVP-20261027/evidence/RuntimeIndicatorToBarPaste-r001.json` | `64810d7f917a6e9b96225f65e8136dcd76e25650d61b8cde225ba96bf401b24e` |
| `Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/MVP-20261027/evidence/RuntimeBarToIndicatorPaste-r001.json` | `a3caa21159286e0cbc9986f9df3d5e9e2487c6a6048fe5c271fe8ca57d88b001` |
| `Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/MVP-20261027/evidence/RuntimeIndicatorToLinePaste-r001.json` | `7392171cd284c6191c20b622cf7667bddb3af732d72c5800b126fe825e83c2f7` |
| `Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/MVP-20261027/evidence/RuntimeIndicatorToTablePaste-r001.json` | `ea4ceb758dd9b8233c335dd25551478a04c237f5e7c6beb461843f63dc519a55` |
| `Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/MVP-20261027/evidence/RuntimeTableToIndicatorPasteReopen-r001.json` | `006406670f70943ea6027bd8a238d58b531fee3b73264ee97c3cc7f041f042b6` |
| `Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/MVP-20261027/evidence/RuntimeMapBatch-r001.json` | `5e378d780c027c78e3bf4d12946e3ef94e30afea25379ead391c2873078e14b3` |
| `Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/MVP-20261027/evidence/RuntimeMapBatch-events-r001.jsonl` | `2319b3bb3becf8105c1a50cfd5a3f8de275b2f4e8256630253b1c6f1fbe29d2c` |
| `Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/MVP-20261027/evidence/RuntimeBubbleRepair-r002.json` | `f39041602a95be36b7df24102aaf7b8b3c9ade39c8bf1a7e1d1f863dca20d58c` |
| `Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/MVP-20261027/evidence/RuntimeBubbleRepair-events-r002.jsonl` | `6e1d5ffc49a3a7318bec17fd5dd02880b9235dd08c4405f17e7adca914d8a84b` |

native原路径：`/Users/xiaomei/.codex/sessions/2026/10/15/rollout-2026-10-15T19-02-35-01a14272-6279-7601-bc9b-b7def784b978.jsonl`。以下是所核实际操作及原始输出定位；逐条call_id和原行摘要见矩阵 `native_read_manifest`，不把wrapper人工写入命令当浏览器执行原件。

| 类型 | 原始调用行→对应输出行 |
| --- | --- |
| bar | 85861→85864复制原件；85938→85941 pending；85945→85948成功（目录中段截断）；85954→85957保存；85961→85964 panel；86003→86006重开诊断；86186→86189本型source复制 |
| line | 86584→86587 source复制；86605→86608 pending；86612→86615成功完整诊断；86619→86622保存；86649→86652实际panel；86656→86659重入；86705→86708重开筛选UI |
| table-info | 86977/86984粘贴/确认；87012→87015原始14行尾段；87019→87022原始解析投影；87047→87050完整诊断；87358→87361后续成功；87372→87375保存；87379→87382 panel；87400→87403重开诊断 |

## 五类独立结果

CSV30行、19字段、30唯一id，按真实原树递归and/or、amount gt及六店枚举，用Decimal计算；金额比较完整分组映射，表格比较多重集，不依赖未承诺排序。T200选中14行，T500选中8行；原树保留所有null、空串、缺键、ownKeys与undefinedPaths，不用wrapper的精简tree替换。

| 类型／原件 | 真实条件与返回投影 | 独立CSV结果 | 层次 |
| --- | --- | --- | --- |
| bar，native85948 | T200，shop+SUM(amount)，5行 | 果元3218、南都1284、乐园563、水围1141、香橙555，合6761 | 真实应用diagnostic的request/rows；sourceFields中段截断但这两部分完整 |
| line，native86615 | T200，shop+SUM(amount)，5行 | 同上5组，合6761 | 完整应用diagnostic，实际pending→success；不是仅wrapper |
| table-info，native87015/87022/87050 | T200，只shop，14行 | 果元6、南都2、乐园1、水围3、香橙2 | 原始行尾段、解析投影与完整诊断交叉核；amountSum=null保留 |
| map，MapBatch第5行 | T500，province+SUM(amount)，3行 | 江苏1982、浙江1243、广东1868，合5093 | 完整应用diagnostic，source200→采用500 |
| bubble-map，BubbleRepair第8行 | T500，province+SUM(amount)，3行 | 同上3省，合5093 | 只取角色纠正后verified成功，不追认前四事件 |

bar/line/table-info的目标均为`7520741153101058048`，dataset `1312472054565572608`；选中类型和query.request.type分别为bar/line/table-info。画布旧标题“基础柱状图”不改变实际类型。全部五类成功诊断 logicalGetDataCalls=1、outcome=success；这是逻辑getData计数，**没有物理HTTP请求/响应/status链**，不写HTTP200、物理一次或无网络错误。table-info未选择amount/ID，因此不要求本来不存在的列，也不把shop重复行当错误。

map第6→8行、bubble第9→11行另保留本型正常copy来源到indicator的实际成功5093；它们不是新的本型target样本。bar来源正常copy有native86186→86189；line source角色复用r001。table-info反向wrapper观察继续保留，其对应原始source-copy副本未在本次必要窗口独立绑定，不能凭wrapper布尔补成完整三树，也不能因此说该历史操作未执行。

## 整树、保存与重开

本轮48次已导出descriptor自洽检查通过（含重复操作的不同观察时点，不作为48独立样本）。检查真实tree与ownKeys路径、顺序及被JSON省略的undefined键精确对应，不注入null或删键。

bar、line、map、bubble的复制时source、clipboard及采用后target三份完整tree/ownKeys/undefinedPaths投影均可直接比较并相等；request.customFilter也等于target.tree。table-info当前target与clip完整descriptor和request树相等，但原source-copy副本缺列保持unknown。这不等于引用隔离、深拷贝或内部未导出字段均已验。

| 类型 | 实际保存／离开／重开 | 完整重开原生树／clip | 本型重开结果 |
| --- | --- | --- | --- |
| bar | native保存成功，实际panel落地，再URL重开 | source descriptor严格相等；clip=null | 无新rows，unknown |
| line | native保存成功，首goto即时仍旧editor，后86649输出实际panel，再重开并打开筛选UI | 基本200/枚举UI可见，但完整重开descriptor副本缺失，unknown | 无新rows，unknown |
| table-info | native后续成功、保存toast、实际panel落地、同resource URL重开 | source descriptor严格相等；clip=null | 无新rows，unknown |
| map | 原事件有显式保存DOM、重开类型/完整diagnostic，wrapper另记录离开；未绑定独立退出DOM0 | **严格不相等**；基本谓词命中集相等；clip=null | qobs=null，无新rows，unknown |
| bubble-map | 仅用纠正后保存及verified重开；旧SPA未等待另留 | 第8→14行source descriptor严格相等；clip=null | qobs=null，无新rows，unknown |

这些真实save/leave/reopen协议可定位时保留“已执行”，缺完整raw副本只影响对应列。列表资源disabled而用既有editor URL重开，不等于列表点击重开；本轮不新增“必须列表点击”要求。其它indicator可见6761/5093不能代替本型重开结果。save/find物理HTTP列unknown也不自动增加逐type抓包AC。

**map严格差异原样保留：** 第5行保存前分组fieldId为空串，第11行重开为null；保存前两处timeValue在undefinedPaths中，重开后该列表为空，另有field/valueType、dynamicTimeSetting默认键和ownKeys形状差异。精确路径见矩阵 `/r002_checks/reopen/map/differences`。两份树各自递归应用CSV都选中 `3,5,11,13,16,18,21,25`、总5093，基本过滤语义在本fixture相同。矩阵严格列status=failed只表示此原生形状比较不相等，不能写严格回放通过；是否触及原产品合同由原AC09/原生形状合同继续判定，本报告不擅自增设字节级要求或直接宣布产品缺陷已成立。

## 全部发现及限制

1. **人工投影与原件分开。** 五份早期bar/line/table wrapper及反向wrapper的精简tree省去默认键、assertions是人工写入；本次有native原件的列才升级。原生实际运行可定位，不降成“未执行”。bar原生输出中sourceFields约2655 tokens被截断，但source、clip、request、tableRow完整；只核这些保留部分，不声称整个responseData字节齐全。
2. **结果全部匹配，完整验收没有随之升级。** 5类结果层通过，无新数学阻断；table-info仅shop多重集。49候选由44既有报告边界加本轮5类构成，另包坐标地图和图片仅引用原独立报告，不在本轮翻案；CGS其余44行不改变原状态或已有问题。
3. **map严格重开差异已确认，结果层与原生形状分层。** 不用语义相等关闭严格列；也不把此差异自动升级为未经原合同判断的新必跑或产品阻断。
4. **不追认旧失败或错误角色。** MapBatch第13行旧bubble paste_render_failed尽管query500三省正确，target仍200，不能计成功。BubbleRepair第1—4行实际bubble200自复制，第5行erratum后才用6/8/9/11；第13行导航未等工作台，后14/15才是verified重开。MapBatch第3行source已500但qobs仍旧indicator6761，不当新查询；正常500数据用第5/8行。line pending→success、table准备/菜单选择及paste_busy等中间状态不抹去，不机械当新增缺陷。
5. **未覆盖列保持unknown。** 物理query/save/find链、line完整重开descriptor、五类本型重开新rows、table-info source-copy完整副本、全配置/渲染/交互/实例销毁/console/pageerror/真实权限未在本包证明。unknown不等于未执行或失败，不追加49×负向、2401配对或每型重采数值要求。

**已检查无问题：** 18卡绑定输入、原r001输入和r010引用摘要；5类数据实际来源与目标type/dataset；30×19 CSV基本身份；bar/line5组金额、table14行shop多重集、map/bubble3省金额；source/clip/target有原件的整树及48descriptor自洽；bar/table/bubble严格重开相等、四型raw clip空、line真实save/panel/reopen；bubble错误角色与旧失败/恢复分开；44旧行保持。

**未检查与原因：** 本lane是只读既有runtime证据扩展，没有新跑UI/DB/HTTP/构建/测试，未做截图直接视觉审查、地图地理精度/tooltip/details/全资源生命周期、全产品diff/最终closeout；它们非本卡结果层补列范围。旧实现/C2V-005/ubo/CGS交互残余与真实权限继续在各自原边界和预算内，不因结果正确关闭。

**同类残余与最小动作：** 五类已核结果不重采；缺列优先找已存在的完整source-copy/reopen原件，确缺时只补原AC所需基本配置列。line不重做5组数值或整条保存；table不为amount/ID缺席加字段；map保留严格差异等待原合同判定。跨包49是结果层候选，完整49/38/真实权限以及最后状态绑定仍需原独立验收，不创建新Scope Delta或更改完成分母。

**准入预测：** 本报告与matrix-r002可直接用于更新结果层候选到49，并缩减已有数值的重复采样；无需为上述非阻断观测限制机械消耗第3轮。它不允许完整AC01/08/09/12、P1或S02完成声明，不承担Goal最终收尾。
