# 剪贴板同一次复制重复粘贴局部证据独立审查 r002

- reviewed_at：2026-10-30T16:57:37.377670+00:00。
- snapshot_id：`S02-CLIPBOARD-LIFECYCLE-REPEAT-VALIDATION-r002`。
- as_of_state：Topology-r565与以下冻结输入；原生命周期交付物累计第2/3轮，继承r001已验证边界，不重置预算。
- verdict：`PASS_WITH_LIMITATIONS`（本次liquid共享重复case有界通过，新增阻断0）。一次copy后两次成功、已导出clip投影不消费／不续期、正常退出重开为空的观察可复用；不等于完整生命周期、所有类型或真实权限通过。
- card canonical SHA-256：`1a84fa41ff74149f68262974e71d64990c57a6f55196d57b38095edb8169ab1c`。

本轮仅独立读取raw/driver/admission并用CSV复算，没有重跑UI、启动应用、写数据库、修改源码或旧证据；仅新增本报告。原38项义务、49类型、真实权限BLOCKED/NOT_RUN、插件installed unknown及原r001报告均保持。

## 输入、冻结与方法

card validate/render、原action=builder及canonical target的execution_admission只读复验均退出0；五类准入引用摘要一致。12处引用含重复Goal，对应11个唯一文件，摘要逐项匹配：

| 输入 | SHA-256 |
| --- | --- |
| `Goal.final.json` | `4db931a6764a8c48345e7e8358e579550a9bc98594bf1654647716d72b9678c4` |
| `TSP.md` | `ae03f58a18373d41a139f8831101e3294b9c80e7252ad48cefb779a4a878acae` |
| `RuntimeClipboardLifecycleValidation-r001.md` | `d17d88e226155dea10c744b146cef9ca7d33b500c93e526865f26e2d1f1ca65b` |
| `RuntimeRepeatedPastePlan-r001.json` | `f07973a276656eff3f7826f01378848d4755c563b8feb7bcc8edb9b6fac3e113` |
| `RuntimeRepeatedPasteToolFreeze-r001.json` | `0563ccd6ec9b2e9b40adde82b2341432aefa31916f1d0f58f6d09f33d4bf4e02` |
| `RuntimeRepeatedPaste-events-r001.json` | `ca62507c276c9011e0f607a3310c6aa2d6848e39cfba403a9b66439b1e546126` |
| `RuntimeRepeatedPaste-r001.json` | `bb69fbb42d4fc6e1be349daf9f3a405f6eed2eeb0ae4117e3cff361f9ae234ea` |
| `observe-repeated-paste-r001.js` | `2babb25273b087e1bf3ff217c9c51ff114dcb44cdf28dd91b1711a12f54f4632` |
| `runtime-repeated-paste-admission-r001.json` | `f18ef3bd104b80969abc24dae1a4285281db42757b0fd07458100906b8a0fddc` |
| `TeaMaterialExtended-r001.csv` | `abc8bed0862129d58724bcefff2563862e48d1ea057365ae8d5d2c853e64472b` |
| `Topology-actual-r565.json` | `7eb4c59cc7b323b5d7bda74e6ed59f6fe25908fb06dc659a79d44b2f75d5ae8d` |

原执行admission绑定前置r564，本审查绑定随后r565，不混合执行与审查phase。计划／ToolFreeze为16:47:54.761591Z，早于events.startedAt=16:47:58.618Z；当前driver与二者SHA均为 `2babb25273b087e1bf3ff217c9c51ff114dcb44cdf28dd91b1711a12f54f4632`。原driver有且仅有一次显式copy点击，随后for循环两次paste及覆盖确认；无显式Save或Store/clip直接赋值。没有console/pageerror/实例采样，也没有事件内的driver开始／结束摘要attestation，见N2。

独立脚本 `/tmp/review_repeated_paste_r002.py` SHA-256 `1a0c774f6a89321f62139400e979122a81df72b39b819c1e016ebe33176e9bbd`；结果 `/tmp/review_repeated_paste_r002.result.json` SHA-256 `4e8d9717be071bcc913bda66009d7880bf9eab0b149a42c91b880dfb4a06f6e0`；执行 `python3 /tmp/review_repeated_paste_r002.py` 退出0。没有运行producer摘要脚本，也没有依据complete_clip_equal等布尔下结论。

## 两次候选独立复算

r.api共31条（21 POST、10 GET），r.wire共7条。测试半开区间[4,6)拆为两个不重叠窗口：

| attempt／operationId | API区间 | 实际POST getData | 原始HTTP响应 | 独立结果 |
| --- | --- | --- | --- | --- |
| 1／1 | [4,5) | 16:47:59.314Z | wire[0] 16:47:59.362Z，200/code0 | liquid target500，amount5093 |
| 2／2 | [5,6) | 16:48:01.071Z | wire[1] 16:48:01.111Z，200/code0 | liquid target500，amount5093 |

每个窗口恰1条真实request及1条配对响应，响应时间分别在各attempt.startedAt/finishedAt内；两次operationId明确不同，第一次完成后才进入第二次。目标均为 `7520752064427724800`、type=liquid、render=antv，dataset=`1312472054565572608`。完整raw request.customFilter及qobs.request.customFilter都严格等于复制出的500树；每次qobs.outcome=success、queryPlan=queried、logicalGetDataCalls=1，且完整qobs.responseData等于对应HTTP `body.data.data`。逻辑计数只作交叉核验，不替代上述真实请求。

HTTP DTO回显的customFilter不严格等于原请求：field补全、枚举值null→空串等原差异保留，没有删字段后冒称相等；每次采用后的target source诊断仍是原clip的完整树。JSON数字5093.0与浏览器序列化5093按数值等价比较，过滤树／clip仍作严格类型与结构比较。

CSV为30行、19列、30唯一id；按完整and／or递归条件、amount>500及六店枚举，用Decimal独立得到命中3,5,11,13,16,18,21,25八行，合计5093。两次HTTP tableRow和series amount.data均为5093，未拿响应反算expected。

## 剪贴板与目标树不变

7份source、6份非空clipboard，共13份descriptor逐节点重建ownKeys相同、undefinedPaths为空；保留field:null、valueType:null、dynamicTimeSetting六null键、group/leaf类型、空串和枚举次序。各source树均为完整500树。

copied、target before、两次各自before/after六个时点的**整个已导出clip投影**完全相等，实际键为tree/ownKeys/undefinedPaths/tableId/createdAt/revision，createdAt=`9839006`、revision=8、tableId保持完整字符串。各时点独立顶层session也相等：identityEpoch=15、editSessionId=15、revision=8。第一after与第二before整个diagnostic完全相等，第二次没有重新copy或重置计时。每次成功后的target descriptor与clip三字段descriptor逐项相等。

该局部样本支持同一次复制可连续两次成功、不消费已导出clip、不更新createdAt/revision。没有用“树相同”代替整个已导出投影比较；也没有把未导出的内部字段说成已比较，详见N1。

## 退出、正常重开与其余wire

三条指定保存路径 `/api/dataVisualization/save`、`/saveCanvas`、`/updateCanvas` 在完整31条本page已观察非认证API中均为0。request监听在source选择／copy前安装，在恢复后撤销，记录范围比仅getData宽；不由旧500树前后相同反推无Save。此为本page监听窗口的三接口未见，不是所有来源、其它端点副作用或直接DB无写。

16:48:02.961Z退出URL为指定资源panel，editorCount=0；driver先等诊断DOM和back icon隐藏再重入。wire[2]在16:48:03.134Z捕获新POST findById、HTTP200/code0，请求为dashboard/main-edit/resourceTable=snapshot，resource ID=`1312476889213964288`。原始snapshot中的目标类型确为**liquid**、dataset正确、customFilter整树等clip500。这里是恢复已保存liquid500，不误称恢复indicator或恢复更早配置。

restored.clipboard=null、pasteReason=clipboard_empty、qobs=null，source仍完整500树；会话identityEpoch/editSessionId由15变17，revision仍8。实际退出、保存snapshot读回及新会话空clip共同支撑本次恢复，不是只等hash变化。

另4条getData均发生在退出之后，必须与候选分开：

| wire | 类型／阈值 | 本轮独立核对上限 |
| --- | --- | --- |
| 3 | liquid／500 | 重开自动query，5093，不是第三次paste |
| 4 | symbolic-map／500 | 顶层三坐标组1982/1243/1868、行数3/2/3合5093；details/tooltip不在本轮声明 |
| 5 | rich-text／200 | 返回果元店一组3218，属于CSV合法分组，不称全量6761或固定首组排序 |
| 6 | table-info／500 | 返回实际id25，19字段的原始／数值／日粒度投影与命中CSV记录相符，amount546；不当聚合5093或图片渲染验收 |

7条wire的request/body均实际解析、HTTP200/code0，无请求被合并进错误候选窗口。未观察的其它API响应不由此宣称全部成功。

## 全部发现与声明限制

**新增阻断：0。** 两次真实候选请求、已导出clip投影、目标树、独立金额和退出重开未发现输入漂移或局部行为矛盾。

**N1：card“完整clip fields/epochs”超出diagnostic导出面。** 当前composable约300行的diagnostic只输出上述6键，内部clip.fields及clip自身identityEpoch/editSessionId未导出；session是另一个顶层getMvpFilterSessionToken结果。故本文严格称“完整已导出clip投影＋独立顶层session不变”，不把它们拼成完整内部clip。当前composable SHA `658027b89e327a6bfa65481f7fd5f43a19b048c15427cd16207f8048773204a8`、service SHA `9f4eca86173318b7b964648d216fd7a6c153b41abce9eda12f8f6e9fc6944b82`，与原r001静态基线相同。service的复制时fields映射、recursive freeze及getter clone可作为单独静态/纯模块证据，不充当本次隐藏字段runtime快照；本轮不为补这点修改诊断API或重跑UI。

**N2：冻结摘要不等于执行期摘要证明。** 计划／ToolFreeze当前字节一致、时间早于事件开始，本包没有原生调用capsule或driver started/finished hash字段。只确认冻结资料与当前driver匹配，不声称独立核验执行开始／结束的源码hash。原driver返回及raw相互一致也不替代缺失的宿主attestation；本局部数据核验不因此扩成执行器不可伪造证明，无需机械新一轮。

**N3：console/pageerror/实例与显示未捕获。** 原driver未订阅console或pageerror，raw无这些采样字段；不能写全程无错误。没有adoption/销毁次数、实例身份、完整Store old-state、source/target全部样式轴和liquid量程/填充显示证据，不能从两次success推这些通过。无executionFailure/restorationFailure字段只表明driver未记录这两类执行异常。

**N4：共享case不是全生命周期或全类型重复矩阵。** 直接crosswalk为AC-MVP-F01-03的“paste可重复不消耗不续期”，退出清空关联AC10；原r001刷新/退出/reload的有界结论原样保留，不自动关闭其它身份、资源、pending、TTL或真实权限义务。一次copy、两次paste与小范围恢复不会变成49型全部重复、全部负向或S039最终验收。

## 已查无问题、未查原因、同类残余与准入预测

已查无问题：11个唯一绑定输入、五类admission引用、前后拓扑phase、ToolFreeze/plan/driver摘要与时序、copy一次／循环两次／覆盖确认的冻结协议、两operation与API半开窗、完整request树／response data层、13个lossless descriptor、整个已导出clip六时点及顶层session、CSV八行5093、31条API三保存路径0、7条wire正确分段、真实panel0退出、saved liquid500 findById、session17空clip恢复，以及r001历史与本次delta的三轮预算连续。

未查：console/pageerror、实例/GPU资源、liquid视觉量程、内部未导出fields/epoch、执行期driver hash、全部schema/运算符/身份组织/代理/登出、pending operation清理、30分钟及边界、全部49类型或P1/P2完整验收。任务仅授权离线审查本共享新case；没有新增运行或全产品测试。

同类残余：导出投影相等不等于所有内部字段已实测；客户端未见三保存API不等于任意来源数据库无写；同数值/同树不能替代实例与完整Store证据；重开自动query不能算paste重复请求。原非本包的TTL、负向、地图、图片等有效结论和耗尽预算保持，不由本case重新发判。

准入预测：本报告可复用为“同一source500复制后，liquid target连续两次成功，每次1实际候选query且5093、完整已导出clip和创建时刻不变，实际退出重开空clip并读回保存liquid500”的局部共享证据。无需重跑、无需机械第3轮；剩余1/3仅对有实质新增差异的同交付物安排使用。内部不可变性按源码／已有纯模块另列层次，本报告不代替完整P1 crosswalk或最终closeout，不修改Dashboard/Goal或运行全局终态Gate。
