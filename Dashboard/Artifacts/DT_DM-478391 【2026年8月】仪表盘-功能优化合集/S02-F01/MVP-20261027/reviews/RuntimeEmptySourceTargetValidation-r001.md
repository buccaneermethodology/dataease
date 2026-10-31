# 空源／空目标运行证据独立审查 r001

- reviewed_at：2026-10-30T07:31:07.405065+00:00
- snapshot_id：`S02-RUNTIME-EMPTY-SOURCE-TARGET-VALIDATION-r001`
- as_of_state：冻结的 `Topology-actual-r545.json` 与下列输入；本轮为此新运行证据包第 1/3 轮。
- verdict：`PARTIAL`（部分事实已独立复算；真实 UI 操作来历、确认框观察窗口及未保存声明尚缺可独立追溯的原始记录）。不表示实现失败，也不表示 MVP-UI-02/11 全案通过。
- lane card canonical SHA-256：`6f3bc821b412261caed25856ccf67725555bcc84ee26b14bd2f1a72958b27e03`。

本任务审查一次局部运行：先有有效 500 阈值剪贴板，再将当前过滤树清空，观察复制禁用；向该空目标粘贴并查询，最后退出和重开。只读审查绑定文件，在 `/tmp` 独立复算，仅新增本报告；没有操作 UI、数据库、服务或源码。地图旧证据 3/3 与 C2 预算保持原状。

## 输入与方法

以下 7 项 SHA-256 均与卡绑定逐一相同；输出路径在审查开始时不存在。

| 输入 | SHA-256 |
| --- | --- |
| `Goal.final.json` | `4db931a6764a8c48345e7e8358e579550a9bc98594bf1654647716d72b9678c4` |
| `RuntimeEmptySourceTarget-r001.json` | `dc98acba5edf33693850e7ae17768f99ada3bb2c3c21204988c857a75dfabac4` |
| `RuntimeEmptySourceTarget-events-r001.json` | `cc64b75eaf19ddc1acb7dcabe396e754227e27bd984178e4677799f5cda59aee` |
| `UiIntegrationCases-r002.json` | `e365ef111582ef84f20f26e6136854409b7fc66bb0931cae40a9df5318036d55` |
| `runtime-empty-source-target-admission-r001.json` | `05512a113c73813d5b667625f569e44e8033377fe5351c1b25243eb66bc6ca1f` |
| `Topology-actual-r545.json` | `d2db719ea23b2f8432c84fc4c1cee301ef7486b40e48629bb4bb2caf74cd7fe4` |
| `TeaMaterialExtended-r001.csv` | `abc8bed0862129d58724bcefff2563862e48d1ea057365ae8d5d2c853e64472b` |

项目 `lane_task_card.py validate` 与 `execution_admission.py` 对原 action=`builder`、原 canonical target 的只读复验均退出 0。admission 的五类引用摘要也通过工具复验。此结果只证明卡和准入引用一致，不证明运行行为。

独立 checker：`/tmp/review_empty_source_target_r001.py`，SHA-256 `065fd66d0d04516a5a3bb526654cd96218e727718446ce92576514e5808b244c`；结果 `/tmp/review_empty_source_target_r001.result.json`，SHA-256 `a23a785cc487823fc1dbd70e9f4f6e658c3583f4d321967edfdefb27aba0851d`。执行命令 `python3 /tmp/review_empty_source_target_r001.py` 最终退出 0；未调用会改写 producer summary 的脚本。临时文件不承担长期证据保管，关键复算结果列于下文。过滤树比较保留类型、null、空串、缺失与数组顺序；`ownKeys` 逐节点重建比对，未删字段或归一化。

## 全部发现

### F1〔P2，证据声明阻断〕缺确认框 DOM observer 的覆盖来历

`events[2]`（`empty_target_paste_settled`，07:14:33.904Z）只有 `dialogs: []`。整个文件没有 observer 安装结果、启动／停止时间、监听根／匹配选择器或 mutation 回调记录。因此可确认“已提交的 dialogs 数组为空”，不能独立确认它覆盖了 paste 前至 settle 的整个操作窗口，也不能排除短暂显示后消失。summary 的 `empty_target_overwrite_dialogs_observed: []` 与数组一致，但“操作窗口 observer 未见确认框”尚未形成独立证据。此项只阻断 AC-MVP-F01-06 空目标直接准备的窗口级声明，不否定候选请求和成功状态。

修复输入：若现有工具日志已保留安装与操作窗口，追加可绑定的脱敏原始记录即可；否则将当前声明明确限定为最终空数组快照。不能通过补写文字把未记录窗口变成已观察。

### F2〔P2，证据声明阻断〕真实 UI 删除及首次失败／恢复仅留状态和叙述

有效树 mark 为 07:11:33.978Z，空树 mark 为 07:14:01.539Z；期间没有 group/leaf 删除的实际动作、selector、结果与时间记录。`driverFailures[0]` 只有“非 hover 点击超时，OR hover 后恢复”的一句文字，无初始 timeout 原文、动作结果或恢复后的对应步骤。因此最终空树、禁用状态和剪贴板保留可采信为快照事实，“由正常 UI 删除 group/leaf 达成”及 driver 失败／恢复的机制尚不可独立追溯。原始首次失败没有被本审查抹去，但其诊断颗粒度不足。

修复输入：补绑已有浏览器工具执行日志，分别保留初次失败与恢复，不覆盖旧事件文件。本报告不要求重新执行 UI。

### F3〔P2，证据声明阻断〕现有抓包不能证明全程未 save

顶层 `requests` 只含一条 getData；另有一条 `restore` findById，没有网络 recorder 的订阅范围、过滤条件和起止区间，也没有保存按钮动作轨迹。故“该文件没有 updateCanvas”不能推出“全程没有发送 updateCanvas”。尤其原始 500 树、成功粘贴树及重开读回树本来完全相同，即使保存过最终树，读回相同仍成立。实际退出和重新读取已有支持，但 summary.claim 中“未保存”仍是 producer 自述。

修复输入：补绑已有的完整业务写请求观察或原始动作记录；若无记录，保留未保存声明为未独立证实。不能只用相同的 500 树替代无保存证据。

没有发现上述冻结快照之间的树／剪贴板矛盾或本局部样本的顶层金额错误；本轮发现均为证据声明边界，不要求 Builder 修改产品源码。

## 已检查无问题的维度

1. 9 个非空 source／clipboard descriptor 的递归 `ownKeys` 与原始树逐项相符，`undefinedPaths` 均为空且可由完整键集合复核；保留 group/leaf、`field:null`、`valueType:null`、六个 dynamicTimeSetting null 键与枚举次序。
2. 空源 mark 的完整树确为 `{"logic":"and","items":[]}`；`copyReason=empty_source`、`copyDisabled=true`、`pasteDisabled=false`，该 mark 附带 requests 为 `[]`。这是记录中的空源 UI 状态；不扩大为已主动调用 disabled copy 或动态／权限 unknown 等其他失败路径。
3. 从有效复制、空源、paste settle 到成功反馈，整个旧 clipboard 严格相等，含 `tableId=1312472054565572608`、`createdAt=2086469.4000000358`、`revision=3`。成功后 source 的整个三字段 descriptor 严格等于旧 clip 的对应三字段，未把 source 与含额外 metadata 的 clipboard 误判为同一对象；本次成功没有消费或改写创建时刻。
4. 提交的抓包中正好 1 个实际 POST getData / HTTP 200、code=0 配对，请求文本逐字匹配响应携带的 request。请求在 07:14:32.732Z、响应在 07:14:32.773Z，均位于空源 mark 与 settled mark 之间。目标为 `7520741153101058048`、dataset 为 `1312472054565572608`；raw request.customFilter 和 qobs.request.customFilter 均严格等于 clip 完整树。逻辑计数 1 仅作交叉核对，不代替这组真实 HTTP 记录；抓包以外请求不由此证明不存在。
5. qobs.responseData 与 HTTP `body.data.data` 的完整对象一致。JSON 数字按数值比较：浏览器序列化的 1982 与 HTTP 的 1982.0 数值相同；过滤树仍作严格比较。HTTP DTO 的 customFilter 并不等于 clip：两个叶子 `field:null` 被补为字段对象，枚举叶 `value:null` 被改为空串。该差异已保留，不能删字段后宣称相等；成功后的 source 诊断仍保留原 clip。当前未将后端回显误当 adopted tree，也未把回显差异直接升级为实现缺陷。
6. CSV 独立解析为 30 行、19 字段、30 个唯一 id。按完整 and/or 递归树和字段 ID 映射，用 Decimal 计算命中 `3,5,11,13,16,18,21,25` 八行；按 longitude/latitude/city 分组：深圳 114.0579/22.5434 为 1868、3 行；南京 118.7969/32.0603 为 1982、3 行；杭州 120.1551/30.2741 为 1243、2 行；合计 5093。HTTP 顶层三行的坐标、城市、金额及 `*` 行数逐组一致。
7. `success_feedback.text` 留有“过滤条件已粘贴”与指标 5,093。07:16:27.764Z 退出 mark 的 editorCount=0；07:16:27.977Z 新 findById 请求为 dashboard / main-edit / snapshot，HTTP 200、code=0，目标完整树等于初始 500 树；07:16:31.597Z 重开诊断也等于该树，editSessionId/identityEpoch 从 7 变为 9，clipboard=null、pasteReason=clipboard_empty、qobs=null。退出与重开不是仅靠 editor 隐藏推断；“未 save”仍受 F3 限制。

## 未检查原因、同类残余与准入预测

- MVP-UI-02 原案还包括深层别名污染、动态结构／权限 unknown 的失败保留、clip 排除项；本次空源快照不关闭这些义务。
- MVP-UI-11 原案还包括持久 shape logic:null/items:null、prepare 前 old active、同 DOM/key/实例采用、setter／完整 Store metadata、snapshot calcData 一次、普通刷新、undo/redo 和各 native 入口；此包没有对应观察。`and/items:[]` 不能替代另一种空 shape。
- 只复算顶层聚合，不验证地图画面、tooltip/details 的正确性。原 HTTP details 的代表行问题仍存在于本包；8100 旧实例与 8110 新构建的明细修复证据不能互换。
- 独立 30 分钟上下文、TTL 全路径、真实权限、全部 38 义务／49 类型仍保留未验状态。没有重开地图 3/3 或 C2，也未运行全局终态 Gate、修改 Dashboard 或代父 Agent 收束 Goal。
- 同类残余：凡由“过滤后的空列表”证明从未发生动作，或由“前后状态相同”证明中间未写入，均需相同的观察覆盖检查。此轮已检查全部原始顶层数组及六个 mark，未发现另一类独立数值矛盾。
- 修复后准入预测：补齐 F1–F3 的既有原迹并绑定后，可重新评估“该一次正常 UI 空源禁用保留完整 clip／空目标无确认直接准备／一组查询成功／未保存退出”的局部声明。若无法补证，则维持本报告已证实的快照与配对 HTTP 事实。无论哪种结果，都不能自动将 MVP-UI-02/11 全案、38/49 或真实权限判通过。此包剩余审查预算 2/3。
