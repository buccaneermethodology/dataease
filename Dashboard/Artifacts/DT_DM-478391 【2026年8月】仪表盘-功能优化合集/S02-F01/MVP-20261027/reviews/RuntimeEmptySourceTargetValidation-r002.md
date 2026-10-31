# 空源／空目标运行证据独立审查 r002

- reviewed_at：2026-10-30T14:26:37.418111+00:00
- snapshot_id：`S02-RUNTIME-EMPTY-SOURCE-TARGET-VALIDATION-r002`。
- as_of_state：Topology-r545 与下列冻结输入；同一空源／目标交付物第 2/3 轮，r001 原字节保持不变。
- verdict：`PASS_WITH_LIMITATIONS`（仅本轮原生执行补证有界通过）。r001 的 F1/F2 本次局部来历缺口关闭；F3“所有来源全程无保存／无写”仍未证实，不能将本 verdict 解释为该强声明或 MVP-UI-02/11 全案通过。
- lane card canonical SHA-256：`d12c449125d0d58a28b8d940edb803a8f44df4a82e38b7831f4df6034e24ab98`。

本轮只核查从平台原生记录提取的 7 个工具调用／7 个输出，判断它们是否补足删除过程与 DOM observer 的实际执行来历。没有重跑 UI、服务、数据库或产品计算，没有改写原 summary/events/review，也没有重开地图旧 3/3 或 C2 预算。

## 输入与原生记录校验

卡 validate/render 均退出 0。下列 9 项摘要逐一等于卡绑定；r001 的完整树、剪贴板、HTTP／CSV 复算已读回继承，不为本次补证重复执行同一基线。

| 输入 | SHA-256 |
| --- | --- |
| `Goal.final.json` | `4db931a6764a8c48345e7e8358e579550a9bc98594bf1654647716d72b9678c4` |
| `RuntimeEmptySourceTarget-r001.json` | `dc98acba5edf33693850e7ae17768f99ada3bb2c3c21204988c857a75dfabac4` |
| `RuntimeEmptySourceTarget-events-r001.json` | `cc64b75eaf19ddc1acb7dcabe396e754227e27bd984178e4677799f5cda59aee` |
| `UiIntegrationCases-r002.json` | `e365ef111582ef84f20f26e6136854409b7fc66bb0931cae40a9df5318036d55` |
| `runtime-empty-source-target-admission-r001.json` | `05512a113c73813d5b667625f569e44e8033377fe5351c1b25243eb66bc6ca1f` |
| `Topology-actual-r545.json` | `d2db719ea23b2f8432c84fc4c1cee301ef7486b40e48629bb4bb2caf74cd7fe4` |
| `TeaMaterialExtended-r001.csv` | `abc8bed0862129d58724bcefff2563862e48d1ea057365ae8d5d2c853e64472b` |
| `RuntimeEmptySourceTargetValidation-r001.md` | `949f46b7ef144e50c59a9818b91d3678f0b7211b8fc7c035eeed1fe3aaa4cd4b` |
| `RuntimeEmptySourceTarget-NativeDriverSupplement-r002.json` | `f8f7388d997608ec1fe827b8f49610c1a4fbf328abea56a608485999057ee679` |

原生来源：`/Users/xiaomei/.codex/sessions/2026/10/15/rollout-2026-10-15T19-02-35-01a14272-6279-7601-bc9b-b7def784b978.jsonl`。仅解析 capsule 指定的 14 行，不全量导出日志或查看其他会话内容。

| 原生调用行／输出行 | call_id | 原生调用时间 UTC |
| --- | --- | --- |
| 97812 / 97815 | `call_a640f86306664c42a4100054ff47cade` | 2026-10-30T07:11:28.378Z |
| 97821 / 97823 | `call_e7072e00709a4b08ae3553809add2937` | 2026-10-30T07:12:24.878Z |
| 97832 / 97834 | `call_eb242403912643a4ace5d0e61c2f2bfb` | 2026-10-30T07:13:32.387Z |
| 97838 / 97841 | `call_79fb701dfd2c4d1997cdc50c7890e8f9` | 2026-10-30T07:13:52.460Z |
| 97845 / 97847 | `call_47f8c4b791f946089436431e3d78ed71` | 2026-10-30T07:14:25.969Z |
| 97859 / 97861 | `call_b947803b10854b64860b2219ccfb2873` | 2026-10-30T07:15:24.199Z |
| 97869 / 97871 | `call_dcc3e3379c3e45ec9ec9e9474655e83b` | 2026-10-30T07:16:21.587Z |

14 行的原始字节 SHA-256（含行末换行）、call_id 与 timestamp 全部相等。7 个原始 tool input SHA、从 input 中 JSON 字符串解出的 browser_chars 逐字及其 SHA 均相等，全部指向同一 PTY session 65070；7 个 tool output 对象与原生日志逐项相等。`output_sha256` 实际采用 UTF-8 的 Python `str(output列表)`，不是 canonical JSON；已识别此算法并逐项复算一致。该非通用编码不阻断本轮，因为原生整行摘要和输出内容本身均独立相符，后续引用应说明算法。

补证记录时间 14:16:20Z 晚于 07:11–07:16Z 的运行及原生日志，属于**执行后提取**；没有将提取时点说成执行前冻结，也没有重建缺失历史。持续追加原生日志按指定行绑定，未用后来变化的整文件摘要冒充历史快照。

独立 checker：`/tmp/review_empty_source_target_r002.py`，SHA-256 `22b737e1a020489ec2ae62b8d489cf6e8fc03951cb2fd955a45bc631aff483a2`；结果 `/tmp/review_empty_source_target_r002.result.json`，SHA-256 `cc035517921c7d3e527dfd5cfa855caeb8ed4d0bb7a886150edde626cbe11d58`。执行 `python3 /tmp/review_empty_source_target_r002.py` 退出 0；关键结果完整记录于本报告，不依赖临时文件长期存在。

## 首轮发现逐项结论

### F1：本次 observer 覆盖来历缺口有界关闭

实际成功执行的调用为原生行 97845，07:14:25.969Z 送入同一 browser PTY。该调用按 await 顺序：初始化空 dialogs 数组 → new MutationObserver → observe(document.body) → 单次点击“粘贴过滤条件” → 等待 queryObservation success/failure → 再等 500ms → 写 settled mark 并 disconnect observer、读取数组。没有覆盖确认按钮点击。

Observer 监听 `childList/subtree/attributes`，每次回调扫描 `[role="dialog"]`，记录 width>0 且 visibility 不是 hidden 的元素文本与 performance.now，按文本去重。原 events 的空源 mark 在 07:14:01.539Z；请求／响应在 07:14:32.732Z／07:14:32.773Z；settled mark 在 07:14:33.904Z，dialogs 仍为空。原生行 97861 的后续 poll 输出与此对应：success、requests=1、responses=1、dialogs=[]、阈值500。行 97847 只是 PTY 暂时无输出，不当作操作已完成；真正结果由后续 poll 与 durable events 共同支持。

因此现在可声明：“本次操作在点击前安装上述 observer，直到完成后延迟 500ms 并断开，未记录符合该选择器／可见性判定的 dialog；本执行器没有覆盖确认点击。”这已超出仅有最终空数组的首轮证据，F1 的本次安装／终止顺序来历得以补足。

仍不声明所有短暂确认竞态都不存在。该 observer 在 mutation 回调时扫描当前 DOM，无初始扫描、不监听 characterData；同一回调前已经插入又移除的瞬态元素、非 role=dialog 结构等不是穷尽覆盖。精确安装墙钟时间也未单独打点，成立的是原生输入与成功执行支持的前后顺序和整体时间界限。

### F2：真实 UI 删除与初失败／恢复来历关闭

行 97812 先执行真实“复制过滤条件”及打开“过滤”，输出恰 1 个 group 删除操作、2 个 leaf。行 97821 首 await 尝试点击 `.operate-icon .ed-icon`；行 97834 保留完整返回诊断：“locator.click: Timeout 8000ms exceeded”“element is not visible”。失败发生在首个 await，其后该批代码中的 leaf 删除、observer 安装和 paste 未继续执行，不能把其中计划文字算作第二次实际粘贴。

恢复调用行 97838 按序 hover OR → 点击 group 删除 → hover 剩余 leaf → 点击 leaf 删除 → 点击“确认” → 等待过滤 dialog 隐藏 → 写 empty_source_before_paste。行 97841 的成功输出为空 and/items 树、empty_source、pasteReason=null，与原 events 的该 mark 严格对应。因而“正常 UI 删除 group/leaf 达成空树”已具有原生动作与结果双向依据；没有通过改 Store／clipboard、强制点击禁用按钮来替代操作。

首次失败与后续恢复分别保留，不能把恢复结果反写成首次成功。该失败证明当时点击目标不可见；hover 恢复与同批源码摘录共同支持 hover 相关诊断，不扩大为所有删除图标行为均已回归。

### F3：仅补足本执行器无显式 Save，原强声明继续未证实

选定的 7 个 browser_chars 没有直接点击“保存”或调用 updateCanvas。行 97869 包含 back-icon → 如有 dialog 则点击“确定” → 等待 panel URL／编辑器隐藏 → goto dashboard → 如有草稿提示则选择“否” → 正常选择图表并读取诊断。此协议与 r001 已复算的退出 mark、新 findById 和重开空 clipboard 相接。

可采信的措辞为：“本执行器选定调用中无显式 Save；正常退出后重新读取 snapshot500 树并重开空 clipboard。”退出“确定”的 dialog 文案和产品 handler 的全部副作用没有额外捕获，不能从按钮名推定所有写入均未发生。

尤其行 97812 安装的 request/response listener **只过滤 `/api/chartData/getData`**；退出阶段也只额外监听 findById。现在能解释原事件为何没有 updateCanvas，不能据此说所有来源没有保存。原始树和最终粘贴树均为同一500树，前后读回相同仍不构成无保存反证。r001 summary 的“未保存”不因后提取 capsule 自动升级为全来源无写事实；本轮没有关闭该强声明，也没有把它从原始验收要求中删除。

## 全部新增发现、无问题维度与未查原因

本轮未发现 capsule 与原生日志错配、摘要漂移、把失败批次当成功、实际第二次 paste 或凭补写文字重建原始轨迹的情况。新增的非阻断方法注意项为 output SHA 采用 Python repr，而非 canonical JSON；算法已在本报告明确。

r001 已证明的 9 个 lossless descriptor、完整旧 clip（含 tableId/createdAt/revision）、raw request 树、1 组成功 HTTP、CSV 三坐标组1868/1982/1243=5093、实际退出／findById／新 session 空 clip 继续成立。HTTP DTO 回显的 field 补全／枚举 null→空串差异原样保留；未将响应回显当 adopted tree，也未重复计算后覆盖初轮结论。

未检查的原因与残余继续与 r001 一致：完整 Store old-state、实例 adoption／销毁次数、snapshot／undo redo／普通刷新、persisted logic:null/items:null 另一种空 shape、深层别名和其他失败 copy 路径、49 类型／38 义务、真实权限及独立 TTL 上下文不在本补证观察范围。旧8100的 symbolic details 问题不因顶层金额正确关闭，8110独立新构建证据也不混用。没有触发全局 Goal 终态、产品发布或验收 promotion。

同类残余：选定调用来历足以说明本执行器如何操作，但不能穷尽同时存在的其他执行器、UI handler 副作用或未订阅网络；observer 的空结果也必须保留选择器、采样时机和可见性规则的边界。

## 后续准入预测

本轮 F1/F2 的来历修复已足以支撑该一次真实 UI 空源／空目标局部观察，补证本身无需机械进入第3轮。后续可引用 r001 的数据复算与本报告的原生动作核验，但必须同时引用 F3 的未证实边界，不能把 PASS_WITH_LIMITATIONS 投射为“完整MVP通过”或“全来源无保存”。若后续确有新的完整网络／写入证据，另按剩余 1/3 预算评估相应差异；当前不要求为耗完预算而重跑 UI。
