# gauge / liquid 合法量程运行证据独立验证 r001

- reviewed_at：2026-10-30T16:39:53.321305+00:00
- snapshot_id：`S02-NUMERIC-RANGE-EVIDENCE-VALIDATION-r001`
- as_of_state：卡绑定的两型正式运行窗口及下列冻结输入；不是当前全产品终态。
- reviewer：独立 Validator `/root/bubble_ready_validator_resumed`；Builder 为 `/root`。
- 模式与预算：full_baseline；本量程新运行证据首次第 **1/3** 轮。不是 S039 准备报告重审，也不重开 C2、图片或原负向包已耗尽的评审。
- verdict：**BOUNDED_PASS（两型固定合法量程的局部运行证据有界通过）**。新增阻断 **0**；不是完整类型、AC、P1、Session 或 Goal 通过。

本包验证的是：在专用 fixture 中，通过正常 UI 把 gauge / liquid 设为可区分结果的固定合法量程后，复制条件把真实查询结果从 6761 改为 5093，画面、保存、退出和重开保持一致。主要风险是把这一局部正链扩大为全部类型验收，或把合法配置的新观察说成旧饱和问题的源码修复。本报告不作这些提升。

## 审阅范围与冻结输入

任务卡 canonical SHA-256：`e05f8acfcd0fc41deecc35fde5c10e47f98c147af4f977dbc56f0e3c0306971e`。接收端与写前均使用项目 SP010 `lane_task_card.py validate` 复验，并消费 `render` 输出；22 处引用、21 个唯一文件全部重新计算 SHA 匹配。Goal 的完整原始分母不变：**38 项义务（P1=12、P2=26）、49 内置类型，完整验收仍 0/49**。真实权限仍 `BLOCKED/NOT_RUN`；插件 installed / loaded / eligible 仍 unknown，不能从未取得结果推成 0。

绑定的 AC 为 `AC-MVP-F01-01/08/09`，只贡献其中两型量程正链的证据。读集覆盖 Goal、TSP、预先计划、admission 及五条依赖、实际 topology、冻结 driver、原始事件、CSV、实际公式源码和六张原 PNG；另复用 S039 准备报告 E3 与其 handoff 作为原缺口和禁止提升边界。不存在本轮新增产品源码、共享 Dashboard 或稳定 KB 规则，因此本报告不是全源码 diff / 最终 closeout 的独立验收。

下表为任务卡绑定的完整唯一文件清单；`MVP-20261027` 内路径以下相对该目录书写，其余保留仓库路径。

| 文件 | SHA-256 |
| --- | --- |
| `Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/Goal.final.json` | `4db931a6764a8c48345e7e8358e579550a9bc98594bf1654647716d72b9678c4` |
| `TSP.md` | `ae03f58a18373d41a139f8831101e3294b9c80e7252ad48cefb779a4a878acae` |
| `NumericRangeRuntimePlan-r001.json` | `c819410ef1fccdf387da709dd9fa3247287d480ba19bc4981509b2a48fa97d74` |
| `evidence/NumericRangeRuntime-r001.json` | `66f14a1e6f598a1cc8f60149febe4bfa5fbc7c6c897b7fd894b0d509096db503` |
| `runtime-fixtures/TeaMaterialExtended-r001.csv` | `abc8bed0862129d58724bcefff2563862e48d1ea057365ae8d5d2c853e64472b` |
| `Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/planning/numeric-range-runtime-admission-r001.json` | `89d3b6dd22ec71ed2e6d62423163c65bc962b80235d47c3fe57f05750c64df55` |
| `Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/planning/Topology-actual-r561.json` | `f693f9f8b55d674eed0dafe4bd0f7414e4d6601c08877806c59683dc507d10a7` |
| `core/core-frontend/src/views/chart/components/js/panel/charts/g2/numberic/gauge.ts` | `592a2f74afa4ce3f947eef38ccd2966b4cd99045a099c3b4b2a48e1576e425d6` |
| `core/core-frontend/src/views/chart/components/js/panel/charts/g2/numberic/liquid.ts` | `f02e15b15542293a10886529382f11d87c6f815f3ce71d61b26570f22544ae24` |
| `evidence/NumericRangeGauge-events-r001.json` | `8e336c2ac48c78565838c68629b471e8f52662c1246b97c3001818d421e70e5a` |
| `evidence/NumericRangeGaugeToolFreeze-r001.json` | `ebaf1f19d7a1b558506f2a6059cd75c36882e081a4d4e9831a0336712249f48f` |
| `runtime-state-tools/observe-numeric-gauge-r001.js` | `b1875a6f61db91ab5c353b902585a9cd77d26ec7bdba30848947edd838f092af` |
| `evidence/NumericRangeGauge-before-r001.png` | `0f9dadaddcad9c1f8d63e612a0af4b4f2d0ed1197c7e36917bf5cd846ad97309` |
| `evidence/NumericRangeGauge-after-r001.png` | `f0e3601e03818450116ab11257a3f5e0145f8ac8116bb77a1754406c248a91c6` |
| `evidence/NumericRangeGauge-reopened-r001.png` | `f0e3601e03818450116ab11257a3f5e0145f8ac8116bb77a1754406c248a91c6` |
| `evidence/NumericRangeLiquid-events-r001.json` | `c3a5e3a58d2bf04b12d5ffd37855766d5aca8585a69c7049433e95d2ed13f128` |
| `evidence/NumericRangeLiquidToolFreeze-r001.json` | `fcebbc615e32ade883c9535ddf440782820c8ff62f39eac1f4ddeaa577b98f00` |
| `runtime-state-tools/observe-numeric-liquid-r001.js` | `49f5e2439d61f994d4bff5822720403ffe14fb5f9406278ac676e4f04ca81a13` |
| `evidence/NumericRangeLiquid-before-r001.png` | `527a669d19d52e3c36b5b3824638529d323da94634da18528a33735401800975` |
| `evidence/NumericRangeLiquid-after-r001.png` | `9e324349c4eb1a2aa359d45d24900d03bb40818fdca5b5422ae0292aa671a6f4` |
| `evidence/NumericRangeLiquid-reopened-r001.png` | `29fa5f19b756fdedcb38672ea9c0723f055c77fe10823826bf217336bd3be210` |

另读 `MvpAcceptanceReadinessHandoff-r001.md` 与 `reviews/MvpAcceptanceReadinessReview-r001.md`（原 E3：每型补一条合法量程可见结果，不重做所有两向或所有负向）。本报告不改写它们。admission 状态 approved，issued_at 为 `2026-10-30T16:20:57.899769+00:00`，绑定的 Goal / Contract / Context / Design Review / topology 五条依赖摘要已独立重算一致；这证明当前输入的绑定一致性，不自动替代人类 authority 或 runtime。

## 正式 case 身份与时点

两型在同一专用 target `7520752064427724800` 上依次执行；source `7520741153101058048`、dataset `1312472054565572608`、dashboard `1312476889213964288`。标题仍“指标卡”是 fixture 的原标题，真实类型以请求、保存和 find 的 `type` 为准。

| 类型 | driver 冻结（UTC） | 正式开始（UTC） | 正式结束（UTC） |
| --- | --- | --- | --- |
| gauge | 16:24:48.048554 | 16:25:18.541 | 16:25:29.701 |
| liquid | 16:28:40.840409 | 16:28:44.954 | 16:28:56.020 |

两份 driver 摘要分别与对应 freeze 一致，冻结均早于正式开始。正式 driver 从已经通过正常 UI 配好的类型、固定量程和 200 树前态开始，并重新点“更新图表数据”取得正式 baseline HTTP。它们没有完整录制先前配置探索过程，不能倒填初始配置 slot。

先前探索诊断保留：gauge 点名称未选中，改用既有 data-id 与类型图标；样式/大小 text selector 多命中后改 role tab/button。liquid 的 radio input 被装饰 span 拦截后正常点击“固定值”label 恢复。没有以 force 点击或 Store 改值替代。它们是定位/配置探索，不作为正式 case 的产品 RED，也不覆盖旧的默认饱和观察。

## 独立复算与请求分母

本 Validator 从 CSV（UTF-8 BOM）以 Decimal 重新执行真实 AND/OR 整树，而非信任 Builder 的 `sum_equal`：`amount > threshold AND（六店 OR 条件）`。阈值 200 得 **14 行 / 6761**；阈值 500 得 **8 行 / 5093**。分母 10000 时比例分别为 **0.6761 / 0.5093**。

独立复算脚本：`/private/tmp/verify-numeric-range-r001.py`，SHA-256 `32636c5f75974c3a3451cee156089a3242eeb50645e709a62522944667848b21`；执行退出 0，**134/134 证据断言通过**。该数字是日志、树、摘要和图片结构的复算断言数，不是 134 项产品测试，也不是本 Validator 独立重跑 runtime。

| 类型 | baseline 200 查询响应（UTC） | candidate 500 查询响应（UTC） | 重开 500 查询响应（UTC） |
| --- | --- | --- | --- |
| gauge | 16:25:18.692，6761 | 16:25:21.076，5093 | 16:25:25.236，5093 |
| liquid | 16:28:45.084，6761 | 16:28:47.426，5093 | 16:28:51.564，5093 |

每型事件有 **34 条非认证 page API 请求、8 条带响应 wire 记录、6 条 getData**：目标型 baseline / candidate / 重开各 1 条，另有重开其它图的 3 条；此外 save/updateCanvas 和 findById 各 1 条。不能把 34、8 或 6 当作 candidate 次数，也不由其它图的请求证明它们通过。

两型 candidate 窗口均为请求索引 `[5,6)`，窗口里仅目标 getData，**唯一 candidate=1**。逐条解析原始 request / response；所绑定 8 条 wire 均 HTTP 200 / business code 0。目标三次查询的 `type`、tableId、完整过滤树、tableRow 与 series 数值均和独立 CSV 结果一致。

## 完整树、保存与真实退出重开

检查了 **12 份 source / clip descriptor**，补回 `undefinedPaths` 后重建 ownKeys 键集合；不能只比较可序列化 JSON 或少数字段。before source 为 200，copied clip 为 500；after source 的整树、ownKeys、undefined 属性状态与 clip 一致，after clip 完整保留；reopened source descriptor 与 after 一致，重开 clip 为 null / `clipboard_empty`。

baseline request customAttr、candidate request customAttr、save target customAttr、find target customAttr **全量相等**。gauge 为 `gaugeMinType=fix/min=0`、`gaugeMaxType=fix/max=10000`；liquid 为 `liquidMaxType=fix/max=10000`。保存和 find 同 resource / snapshot，target 类型分别正确，完整树均等于 copied clip.tree。没有只比较 max 或单个叶子来代替完整配置和树。

| 类型 | 显式保存（UTC） | updateCanvas 响应（UTC） | 实际退出（UTC） | find 响应（UTC） |
| --- | --- | --- | --- | --- |
| gauge | 16:25:23.533 | 16:25:23.665 | 16:25:24.643 | 16:25:24.829 |
| liquid | 16:28:49.891 | 16:28:50.007 | 16:28:50.980 | 16:28:51.150 |

每型窗口只有一次 updateCanvas，时序为显式保存 ≤ save 响应 < 实际退出 < find。退出时 URL 为该 dashboard 的 panel 页面，`editorCount=0`；随后 find 和目标 getData 以及重开 PNG 共同证明保存后离开编辑器再进入的局部链。不是仅凭按钮点击或内存状态声称重开。

## 实际公式与六张原图

已按绑定源码核对，且已实际查看六张原 PNG；每张 419×316、8-bit RGB，PNG 签名、chunk CRC 和 zlib 解码均有效。完整 SHA 见输入表。

- **gauge**：`gauge.ts` 264–278 行选 fixed min/max，301–303 行以 `clampGaugePercent((data-min)/(max-min))` 得到指针比例。当前 0–10000 下为 0.6761→0.5093，均无需饱和 clamp。458–463 行按 labelFormatter 的 type 决定标签；当前 `value / thousandSeparator=true / decimalCount=0 / unit=1`，所以中心标签是 **6,761→5,093**。刻度默认百分比，不能把金额标签写成百分比字符串。
- **liquid**：`liquid.ts` 130–142 行取 series 首值和 fixed max，155 行计算 `value/max`。190–202 行在 `showQuota=false/showProportion=true` 下，按 `reserveDecimalCount=2` 格式化比例，所以显示 **67.61%→50.93%**。

| 原图 | 实际可见结果 |
| --- | --- |
| NumericRangeGauge-before-r001.png | 中心 6,761，指针约在 67.61% 量程位置 |
| NumericRangeGauge-after-r001.png | 中心 5,093，指针约在 50.93% 位置 |
| NumericRangeGauge-reopened-r001.png | 仍为 5,093 及对应位置；与 after 字节相等 |
| NumericRangeLiquid-before-r001.png | 67.61%，对应较高液位 |
| NumericRangeLiquid-after-r001.png | 50.93%，液位相应降低，非饱和 |
| NumericRangeLiquid-reopened-r001.png | 仍为 50.93% 和相应液位；水波相位不同，字节不与 after 相等 |

liquid 是动画，字节不等不构成本合同失败；本报告也没有用像素估计精确指针角度、波高误差或证明整页视觉无问题。图像所示变化与真实查询、保存配置和实际公式相符。

## 全部发现、未查与同类残余

**阻断发现：0。** 当前冻结局部包未发现合同内新增失败。

非阻断边界 / 需要主 Agent 保留的状态：

1. **NRV-N01：fixture 未完整恢复。** 最后保存状态是专用 target 的 `liquid / amount>500 / fixed max=10000`，尚未恢复 indicator。计划允许恢复 indicator500 或明确保留专用 numeric fixture；本包已明确记录后者，不构成本局部证据阻断，但不能宣称完整 rollback，也不能覆盖随后其它任务的新观察。
2. **NRV-N02：初始配置探索不属于正式 driver 全程轨迹。** 正式冻结从已配置前态开始；上述探索失败保留为诊断，没有倒填为正式 case 成功，也没有据此声称产品 RED。
3. **NRV-N03：错误面覆盖有限。** 正式 page 窗口 `pageErrors=[]`，未记录 executionFailure；这只说明该监听面，不能推为 console / ubo / 全 SDK 资源或全环境均无错误，不能借此关闭既有 C2V-005。

已查无问题的维度：卡与依赖摘要、driver 预冻结、fixture 身份、CSV 完整树独立 oracle、候选请求计数、三阶段真实响应、完整 descriptor 与 undefined/ownKeys、全量 customAttr、save/find 整树与资源一致性、实际 panel 退出、剪贴板清空、六图与实际公式的局部显示语义。

未检查及原因：本 Validator 未重新控制浏览器、发 HTTP、读写 DB 或运行产品测试；职责是独立读取既有运行证据并复算。未查真实非管理员允许/拒绝与组织/分享/嵌入等权限路径、插件安装总数、其它类型、跨入口、生产环境、完整源码 diff 和 final closeout；这些未被本局部卡授权或提供完整运行输入，分别保持原 blocked / unknown / 未观察状态。没有读取 XPack 实现、认证数据或私密配置。

同类残余 / 后续项：非零 min、动态 max、其它满值/单位、边界与非法配置、重复更新/缩放、不同尺寸或长文案、移动端/嵌入、负向保旧与其它 49 类型完整义务不在本次量程正链包内；不将它们新增为本局部准入阻断，也不默认已由本包覆盖。原负向包及 C2 等历史未决保持各自裁决和已消耗预算，本轮不启动第 4 轮。

## 准入预测与可吸收结论

本包无需 Builder 修复即可作为 **S039 E3“两型各一条合法量程可见结果”** 的新时点证据吸收：两型均有 baseline→candidate→保存退出重开、独立 oracle 和显示语义支持，该具体量程显示缺口可释放。旧默认饱和观察仍保留；本次通过正常配置扩大可区分范围，**不是源码修复**，不能倒写旧 case。

本轮不机械追加下一轮。只有本包输入或声明发生实质变化时，再依据新差异决定是否需要后续验证。当前仍不得提升 `AC-MVP-F01-01/08/09` 全通过、完整 P1/38 项、任何完整类型或 Goal 完成；完整类型保持 **0/49**，真实权限 `BLOCKED/NOT_RUN`，插件 installed unknown。主 Agent 应在原台账中只吸收本具体 E3 结果并继续原未完成动作，不改写本报告的时点与范围。
