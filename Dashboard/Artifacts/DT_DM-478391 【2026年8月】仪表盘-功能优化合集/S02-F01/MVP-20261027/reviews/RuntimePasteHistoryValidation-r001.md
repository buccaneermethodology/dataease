# 共享正常工具栏历史运行证据独立审查 r001

- reviewed_at：`2026-10-30T17:20:12.693655Z`。
- snapshot_id：`S02-SHARED-PASTE-HISTORY-VALIDATION-r001`。
- as_of_state：本轮冻结 runtime r001；driver pre-freeze 为 2026-10-30T17:04:50.350434Z，事件窗口为 17:04:55.634Z—17:05:12.862Z；执行准入绑定 topology r567，审阅卡绑定 r568，分别保留各自 phase。
- verdict：**PASS_WITH_LIMITATIONS（有界通过，附限制）**；新增阻断发现 **0**。本结论只补 S039 / AC-MVP-F01-11 的一条共享正常工具栏 undo/redo 运行缺口，不是完整 AC11、P1 或 S02 Goal 验收。
- 本包首次独立审查 **1/3**；不重开 C4 实现、生命周期包或其它已耗尽轮次，不要求为下述非阻断观测边界机械再运行。

本任务证明专用 liquid 目标在临时 200 条件正常更新后，经真实粘贴500、正常工具栏撤销200、重做500，得到与固定 CSV 一致的新查询和可见数值。离开编辑后重开保存的 liquid500 是独立恢复段。原 AC11 仍含入口、状态、国际化和正常编辑/清空/删除/保存等要求；本报告仅对准备审查明确识别的共享历史缺口给出结论，不替换原始完成分母。

## 输入、独立性与方法

卡 canonical SHA-256：`43b15382e14e1c6c183319870d8a99ff1294e2b1ca1256d5494b203021448ff0`，接收端 validate/render 已通过；17处引用折叠为16个唯一输入，逐项 SHA-256 复核一致。原始 Goal 的 P1 12 / P2 26、完整38义务与49内置类型分母保持；真实权限仍未验证。

本 lane 直接读取原始 events 中全部9条 wire 的 request/body、38条 api、driver、正常工具栏和 snapshot 源码，递归计算完整过滤树与 CSV；没有使用 Builder 摘要的布尔值代替判定。三张原始 PNG 已直接查看。独立复算脚本最终退出0：

- `/tmp/review_paste_history_r001.py`，SHA-256 `132fe4e20710be177df1e13e7dcfc22bf82e985a40b598fa05a796d85040df1a`。
- `/tmp/review_paste_history_r001.result.json`，SHA-256 `71b1189454e09ffda67320769819ec443d18cd2d0620643f71f4956433b96dcd`。

上述 `/tmp` 文件是审阅辅助，不是新增产品交付；本报告将必要结论与可重算方法持久记录，原始输入仍是下面的绑定清单。审阅期间没有操作 UI、DB、应用 HTTP、安装、构建或测试，没有修改源码、冻结证据、Goal、Dashboard/KB。唯一仓库写入是本报告，写前确认其不存在。写前 HEAD 为 `1e84e7438462e5d6fc371358da3bdad7d24a5c1a`；工作区既有大量改动，`git status --porcelain=v1 -z -uall` 可见 4751 项记录，不归因本 lane，未暂存、回退或整理它们。

| 输入路径（相对于工作区根目录） | SHA-256 |
| --- | --- |
| `Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/Goal.final.json` | `4db931a6764a8c48345e7e8358e579550a9bc98594bf1654647716d72b9678c4` |
| `Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/MVP-20261027/TSP.md` | `ae03f58a18373d41a139f8831101e3294b9c80e7252ad48cefb779a4a878acae` |
| `Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/MVP-20261027/reviews/MvpAcceptanceReadinessReview-r001.md` | `fba3b6ad368e085b787cd9a69497f5fb51163397559d718f7596dd014a06d9af` |
| `Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/MVP-20261027/RuntimePasteHistoryPlan-r001.json` | `3d40781966072806ae55a88ee9187387226b6a7a8884558649b0e580f9428966` |
| `Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/MVP-20261027/evidence/RuntimePasteHistoryToolFreeze-r001.json` | `7e142507ca489d8ef416f45fafc1b245ca9b2fa76d53635499780c04790da730` |
| `Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/MVP-20261027/evidence/RuntimePasteHistory-events-r001.json` | `5f8ccdeefc1c35505a44426452a55674ea66f4c21f14428a37e32537ea4a54d4` |
| `Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/MVP-20261027/evidence/RuntimePasteHistory-r001.json` | `2244938f52bcaee3cbe8ee71278134de648489c62a5f8cb1fa5cd7f068bba529` |
| `Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/MVP-20261027/runtime-state-tools/observe-paste-history-r001.js` | `7e98cf5028d617c0c5a78599f53c083d09ec7a72ac640ba53b76f80eb30bda20` |
| `Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/planning/runtime-paste-history-admission-r001.json` | `329826eb88c8a32482e9e0aaa1a3ca6cb9594b92a8264da80479f25bba7b7716` |
| `Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/MVP-20261027/runtime-fixtures/TeaMaterialExtended-r001.csv` | `abc8bed0862129d58724bcefff2563862e48d1ea057365ae8d5d2c853e64472b` |
| `core/core-frontend/src/components/dashboard/DbToolbar.vue` | `bbe3a90657b648b1c8b66ea12ac2a9f14a565396f2982572b538fe5048277b1d` |
| `core/core-frontend/src/store/modules/data-visualization/snapshot.ts` | `5ffd11d4740efbd8570e31c42cffb8870a879eaf309bb4f31b00e40cc57c2e30` |
| `Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/planning/Topology-actual-r568.json` | `0afef845b44399269353520d5f27bf29f4fb1e342708ee36f7ea52aed0991f00` |
| `Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/MVP-20261027/evidence/RuntimePasteHistory-after-paste-r001.png` | `7371faec4f20495fc5f498822973558ad12ea6aa924081d21df64dd6cc609dfa` |
| `Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/MVP-20261027/evidence/RuntimePasteHistory-after-undo-r001.png` | `f2b93eb8f252932989eaec52b0f9c7b9c698f46504123f8e76fa5f89050ae7e1` |
| `Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/MVP-20261027/evidence/RuntimePasteHistory-after-redo-r001.png` | `5a05475dea7036cef0592ba60d45ce306cb77450e10e6f815535e478fbcb61de` |

## 正常入口与四阶段 oracle

目标 `7520752064427724800`，type `liquid`，dataset `1312472054565572608`。driver 的 undo 定位 `.left-area .opt-area .toolbar-hover-icon` 的首个图标，执行 `await undo.click()`；redo 定位 `.opt-icon-redo`，执行 `await redo.click()`，没有直接 Store.undo/redo 调用。raw undoClass/redoClass 均不含 `toolbar-icon-disabled`。

`DbToolbar.vue` 142—153行正常 handler 调用 snapshotStore.undo/redo，579—598行的第一、第二图标分别对应 undo、redo；`snapshot.ts` 98—137行经 restoreHistorySnapshot 恢复，索引方向分别减1、加1，恢复后设置 `snapshotDisableTime = Date.now() + 3000`。这支持入口与状态机解释，不声称浏览器加载 bundle 已逐字节绑定到当前源码。

| 阶段 | 新 HTTP 时间（UTC） | 原始 wire / api index | amount阈值 | CSV选中行数 | amount合计 | 可见结果 |
| --- | --- | --- | --- | --- | --- | --- |
| baseline 正常更新 | 17:04:56.624Z | 0 / 1 | >200 | 14 | 6761 | 无 baseline PNG |
| 真实 paste | 17:04:58.955Z | 1 / 6 | >500 | 8 | 5093 | 50.93% |
| 正常 undo | 17:05:03.304Z | 2 / 8 | >200 | 14 | 6761 | 67.61% |
| 正常 redo | 17:05:06.994Z | 3 / 11 | >500 | 8 | 5093 | 50.93% |

四条均为真实 `/api/chartData/getData`，HTTP200 / code0，request.customFilter 对应各阶段 source.tree。undo click 时间 17:05:03.201Z，requestStart=7；redo click 时间 17:05:06.889Z，requestStart=10；api 区间 `[7,10)`、`[10,13)` 各只有一次 getData，其余为字段目录查询。没有把重开自动查询计入这四阶段。

CSV 共30行、19字段、30唯一 id。复算按原树递归 and/or、amount gt 和六店枚举，不只读取顶层阈值：

- 200树选中 id：`3,5,11,12,13,14,15,16,17,18,20,21,23,25`，合计6761。
- 500树选中 id：`3,5,11,13,16,18,21,25`，合计5093。

全部 liquid 响应 DTO 均记录 `customAttr.misc.liquidMaxType='fix'`、`liquidMax=10000`，所以5093/10000=50.93%、6761/10000=67.61%，与三张419×316局部截图直接观察一致。动态波纹不要求像素/文件字节相等，这些图也不是完整页面截图。

![粘贴后50.93%](/Users/xiaomei/Documents/projects/dataease/Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/MVP-20261027/evidence/RuntimePasteHistory-after-paste-r001.png)

![撤销后67.61%](/Users/xiaomei/Documents/projects/dataease/Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/MVP-20261027/evidence/RuntimePasteHistory-after-undo-r001.png)

![重做后50.93%](/Users/xiaomei/Documents/projects/dataease/Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/MVP-20261027/evidence/RuntimePasteHistory-after-redo-r001.png)

辅助静态公式核对：`views/chart/components/js/panel/charts/g2/numberic/liquid.ts` SHA-256 `f02e15b15542293a10886529382f11d87c6f815f3ce71d61b26570f22544ae24`，129—159行 value/max，约200行转换为百分比；g2plot 对应 liquid.ts 仅扩读相关公式，SHA-256 `3e0ecedc916056ae2d3038479258586653f67bb9b923704f4c99081627290d4c`。此扩读解释显示语义，不提升为实例或加载产物的证明。

## 完整 descriptor、剪贴板与历史边界

独立核对6份 source descriptor（before/copied/afterPaste/afterUndo/afterRedo/restored）及4份非空 clipboard descriptor，共10份。每份遍历真实 tree，核对 ownKeys 的路径、键顺序和 undefinedPaths：JSON 省略的 own-key 集合必须恰等于 undefinedPaths，过滤这些 undefined 键后的顺序必须等于 JSON 树键顺序。

观察到：

- before.source 与 afterUndo.source 的整个已导出 descriptor（tree、ownKeys、undefinedPaths）严格相等。
- afterPaste.source 与 afterRedo.source 严格相等；copied.source 与 afterPaste.source 严格相等；restored.source 与 copied.source 严格相等。
- copied/afterPaste/afterUndo/afterRedo 的整个已导出 clip 投影相等，字段恰为 `tree, ownKeys, undefinedPaths, tableId, createdAt, revision`；tableId 完整字符串一致，createdAt=`10858615.600000024`，revision=9。
- 四个 post-copy 顶层 session 均为 identityEpoch17 / editSessionId17 / revision9。baseline before 原本 clipboard=null、session revision8；copy 后 revision9，因此不能写整个 baseline diagnostic 与 undo 相等，也不能写 undo 把 clip 回滚为空。
- before/afterUndo 的 undefinedPaths 都是 `$.items.0.timeValue` 和 `$.items.1.subTree.items.0.timeValue`，ownKeys 保留这些键而 JSON tree 省略；copied/paste/redo/restored 没有 undefinedPaths。200树和复制来的500树还存在原生键集合差异，没有注入 null、删键或归一化。

**保留首次失败与纠正：** checker 初版错误地假定所有 undefinedPaths 为空，首先在 before/undo 断言失败。直接查原件后确认是审阅器前提过窄，改为上述“省略 own-key 精确等于 undefinedPaths”的自洽核验，保留原树和记录，最终10份通过。这是审阅方法纠正，不是产品缺陷，也不把修正后的成功覆盖成“首次无失败”。

raw qobs 在 afterUndo/afterRedo 仍是 paste operationId1 / success / logicalGetDataCalls1 / 5093，完整值与 afterPaste 相同。它只证明旧 paste 观察，不是 undo6761 的 oracle，也不是重复 paste 计数。历史结果已分别由本轮新 HTTP、source descriptor 与 PNG 证实。已导出 clip 不含内部 fields/clip epoch；内部字段不在这次完整投影相等的声明范围。

## 保存与正常退出恢复另段

raw api 共38条（28 POST、10 GET），wire 共9条（8 getData、1 findById），全部 wire HTTP200 / code0。在这一个 page 非认证 `/api/` 监听窗口内，`/api/dataVisualization/save`、`saveCanvas`、`updateCanvas` 三路径计数均为0；这只证明本客户端窗口未见这些保存请求，不等于任意来源 DB 无写。

17:05:09.029Z 正常退出至 `#/panel/index?dvId=1312476889213964288`，editorCount=0；driver 等待 diagnostic / back icon hidden 后重入。17:05:09.321Z 的 findById request 为：

```json
{"id":"1312476889213964288","busiFlag":"dashboard","source":"main-edit","resourceTable":"snapshot"}
```

该保存快照中的目标确为 liquid500，完整 customFilter 与 copied500 树相同。重开恢复的是已保存的 liquid500，不是 indicator 或更早配置。restored clipboard=null、pasteReason=clipboard_empty、qobs=null；session 为 identityEpoch19 / editSessionId19 / revision9。

| 重开自动请求 | UTC时间 | 独立复算结果与上限 |
| --- | --- | --- |
| liquid / wire5 | 17:05:09.738Z | 500树，5093，50.93% |
| symbolic-map / wire6 | 17:05:09.741Z | 顶层三坐标分组金额与计数匹配CSV；不升级 details/tooltip |
| rich-text / wire7 | 17:05:09.744Z | 200树，实际返回的一合法分组匹配CSV；不承诺排序 |
| table-info / wire8 | 17:05:09.751Z | 500树，实际返回id25的可用字段投影逐列匹配CSV |

这些是恢复后的附带查询，不是新的 paste/undo/redo，更不由此宣称其它三类型历史回归通过。

## 全部发现、未查项与准入

本轮新增阻断0。以下均为非阻断文字或观测边界，后续引用本报告时必须保留：

1. 卡/plan 对等待周期作了3.5s泛化描述，但 driver 原件实际 baseline1600ms、afterPaste3500ms、afterUndo3500ms、afterRedo1500ms。按实际等待与 raw 历史新查询判断本次链成立，不改写原件，不补造真实 timer flush / callback 次数，也不推断每阶段都等待3.5s。
2. qobs 只保留旧 paste operation1。任何把它写成 undo/redo oracle 或多次 paste 计数的下游表述均超出本证据。
3. 只证明完整已导出 source/clip descriptor 与独立顶层 session；未导出的内部 fields/clip epoch、全部 Store 或字节序列不在声明内。基本条件语义与无损形状分层；本次 before↔undo、paste↔redo 精确相等是观察结果，不新设全部历史字节级合同。
4. pre-freeze/plan/当前 driver SHA 一致且冻结早于执行，execution_admission 已只读复验通过；没有执行期 start/end hash attestation，不能声称全执行期间驱动持续不变。console/pageerror、实例销毁与所有历史入口的完整审计未采集，不写“无异常”或“实例通过”。
5. 三保存路径0只覆盖本 page 已监听窗口；无独立 DB 无写审计。退出/重开恢复段只观察保存的 liquid500 与 clip 清空。
6. 原生200树含两处 undefined、baseline clip=null/revision8 与 copy后revision9的区别都已保留；不能归一化后宣称整个 baseline diagnostic 回滚。
7. 本轮只是一条 liquid 共享短链，不是全部49类型、S2分页、激活后所有 canonical 编辑、原C4实现、生命周期或完整AC11通过。原38义务、49类型、真实权限与已有阻塞均不由本包关闭。

**已检查无问题：** 卡16唯一绑定输入、driver预冻结先于事件、准入及phase分离、正常工具栏入口和可用状态、四阶段新查询时序、完整递归CSV/金额、10份descriptor自洽与历史成对相等、post-copy clip投影/session稳定、三张截图数值、全page三保存路径0、正常panel退出/editor0、保存快照liquid500与恢复clip空、重开附带4查询的各自有限oracle。

**未检查及原因：** 未新运行浏览器/HTTP/DB、构建或测试，任务是冻结包的独立只读审查；未查真实权限、全部图表/S2/所有历史入口、完整实例/销毁/Store/console/pageerror、所有来源DB写入、产品full diff/最终KB/Dashboard/closeout与Stop Gate，因为这些不在本卡新runtime补证范围。项目没有Session registry工具，不声称程序化注册表校验。

**同类残余：** S039准备审查中的S2分页及其它AC11共享回归、各类型剩余数据/renderer/保存列、既有C2V-005/ubo等历史问题和P2真实权限继续由各自原范围与预算处理；不借本包翻案、不把附带重开类型当历史代表。

**有限准入预测：** 当前包可以直接作为 S039 AC11“共享正常工具栏 undo/redo 一条”已补证输入，下游按以上限制准确引用即可；没有必须修复的本轮产品发现，不需要为非阻断边界重跑或机械启动第二轮。完整AC11和P1整体判定仍须合并其它原始义务证据；P1即使后来完成也只构成非终态里程碑。此报告不推进Goal终态，不生成或冒称Stop Gate通过。
