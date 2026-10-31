# 字段目录兼容局部运行证据独立审查 r002

- reviewed_at：2026-10-30T16:05:48.370113+00:00。
- snapshot_id：`S02-RUNTIME-FIELD-COMPATIBILITY-VALIDATION-r002`。
- as_of_state：`Topology-actual-r555.json`、原九场景冻结证据与随后单独恢复补证；原跨dataset／字段兼容交付物累计第2/3轮。
- verdict：`PASS_WITH_LIMITATIONS`（九个受控字段目录场景及新时点恢复有界通过；原早恢复采样失败保留）。新增当前阻断0，不表示AC整体验收、真实schema迁移或权限通过。
- card canonical SHA-256：`e26318bb1bcf47730a215ba154b1d77fd8c7c09789751e9dc1c1b89e042c5b17`。

本轮独立只读复核metadata故障注入后的真实Editor入口、完整树／clip、request及观察结果；没有重跑UI、数据库、服务或构建，没有修改源码、冻结输入或r001。发现原恢复早采样后继续查完九个场景，随后同轮核验Builder追加的新时点恢复，未重置预算或把恢复成功回写旧时点。

## 输入、追溯与方法

卡validate/render与原action=builder／canonical target的execution_admission复验均退出0。卡12处输入引用（Goal重复1处）对应11个唯一文件，原字节摘要逐项相同：

| 原绑定输入 | SHA-256 |
| --- | --- |
| `Goal.final.json` | `4db931a6764a8c48345e7e8358e579550a9bc98594bf1654647716d72b9678c4` |
| `UiIntegrationCases-r002.json` | `e365ef111582ef84f20f26e6136854409b7fc66bb0931cae40a9df5318036d55` |
| `RuntimeCrossDatasetValidation-r001.md` | `78c5d23d1d096e3193c3dfd9091790207ab507cf63b67c6b24da8e796d18c45a` |
| `RuntimeFieldCompatibilityPlan-r002.json` | `26c64986151573fc94e1a817dae1bdcfec55728bbfc495050b4136d715a03c47` |
| `observe-field-compatibility-r002.js` | `fb808d28deec54ce7aaa3628057b222cd90f728645ee7c9a440f7e2fecffe088` |
| `RuntimeFieldCompatibilityToolFreeze-r002.json` | `cbedfbc0f22201250f6314f2e73d8e8c5cf64132558f5325821e448258af67e6` |
| `RuntimeFieldCompatibility-events-r002.json` | `4269ebf52264fc5e8fc106f085abd9ccbdb982fb06abee24d8a2e8e097b7eff2` |
| `RuntimeFieldCompatibility-invocation-r002.jsonl` | `47bcc29ae8438cf3b38b71e7c604700afe983605f0b14e36088fdb227df82b4d` |
| `RuntimeFieldCompatibility-r002.json` | `bf56001c905e9a18f57be4d47301fd9300917252df6afa54585e631ce76b47fa` |
| `runtime-field-compatibility-execution-admission-r002.json` | `d431442a3bc0e1618409b859508ad2f8fab7df875e3edbce429188b33ceb35e0` |
| `Topology-actual-r555.json` | `6c3d9876ae0c55a73a6eb503bc4b9600ab183a976917428291d4429d0dd5d9b6` |

admission绑定执行前r554，当前review topology为随后r555；二者phase不同，已分别核验，没有把审查前拓扑伪装为运行前拓扑。原driver/freeze/plan与invocation开始、结束的driver SHA一致，为 `fb808d28deec54ce7aaa3628057b222cd90f728645ee7c9a440f7e2fecffe088`。freeze 15:56:12.994236Z早于15:56:27.030Z start，15:56:38.095Z finished的output SHA等于原events `4269ebf52264fc5e8fc106f085abd9ccbdb982fb06abee24d8a2e8e097b7eff2`。冻结记录保留最初node --check按CJS失败、随后AsyncFunction编译通过的检查入口差异；没有将初失败抹掉或算作产品执行失败。

经父Agent明确补入的恢复资料及本轮必要静态／独立数值读取如下。前三项为同轮追加只读输入，不冒充原卡预先绑定；恢复driver核对了父Agent预告的73e5…摘要及其运行前freeze。后三份当前源码摘要与r001记录相同，兼容guard无实现漂移；本次新增九场景仍逐项建立局部运行基线。

| 补充／静态读取 | SHA-256 |
| --- | --- |
| `Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/MVP-20261027/runtime-state-tools/recover-field-compatibility-r002.js` | `73e5a244466957501ebd2214ecd05fb439ee0c8bf280030d390a0db20f391729` |
| `Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/MVP-20261027/evidence/RuntimeFieldCompatibilityRecoveryToolFreeze-r002.json` | `f21985b89faf573ebc9f397241576b1bbd55190dfb9d969e420abeaea6d6769a` |
| `Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/MVP-20261027/evidence/RuntimeFieldCompatibility-Recovery-r002.json` | `26a063b426d18fff59f49ea176ec02f758f6978070b579e51c4f858375811f09` |
| `Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/MVP-20261027/runtime-fixtures/TeaMaterialExtended-r001.csv` | `abc8bed0862129d58724bcefff2563862e48d1ea057365ae8d5d2c853e64472b` |
| `core/core-frontend/src/views/chart/components/editor/filter/useChartFilterCopyMvp.ts` | `658027b89e327a6bfa65481f7fd5f43a19b048c15427cd16207f8048773204a8` |
| `core/core-frontend/src/custom-component/filter-copy/mvp-chart-filter-copy.ts` | `9f4eca86173318b7b964648d216fd7a6c153b41abce9eda12f8f6e9fc6944b82` |
| `core/core-frontend/src/views/chart/components/editor/index.vue` | `0a9b782b8b72f3f6ac95148187d49e09a8d24f1610ea43b18e9e7002db06d5ee` |

独立checker `/tmp/review_field_compatibility_r002.py` SHA-256 `eb756a077872bc9704f91e874757bdb2f6bc6d0dba2cccb4bee10022c3aa30fc`，结果 `/tmp/review_field_compatibility_r002.result.json` SHA-256 `cdd9b5ccc41f5d45ebc811801c45fbc943591627f1122926f95dda2456261d85`；执行 `python3 /tmp/review_field_compatibility_r002.py` 退出0。未执行producer、UI或源码测试；下列判断未使用Builder的reasonMatched/clipboardUnchanged布尔作oracle。

**正确验收追溯为 Goal AC-MVP-F01-04 → UiIntegrationCases-r002 的 MVP-UI-05“同数据集和完整字段目录兼容”。** 卡误填的AC-MVP-F01-05实际是权限port，不能据此关闭权限。冻结Cases中的MVP-UI-04才是权限三态。保留卡原字节，在本报告纠正映射；不把Goal AC编号与UI case编号混为同一编号体系。

## 九场景逐项复算

完整clip树引用amount `1793083721146`（deType=2）和shop `1793083721149`（deType=0），含嵌套and/or与六店枚举。真实字段API原投影为dimensionList=11、quotaList=9（含count/-1）。除network_abort外，每场景均有两份before/after，合计16份；独立按driver实际变换复算id/deType与数组顺序，前后每一项均相符。network_abort在fetch前abort，两次命中且无metadata是相符结果，不是缺失后被当成功。

| 场景 | 独立核查的目录／状态 | paste入口结果 | 本case getData request |
| --- | --- | --- | --- |
| loading | 两请求被gate持有时fieldsReady=false；release后原完整目录返回、ready=true | 持有时fields_unavailable／disabled；释放后reason=null／enabled | 0 |
| network_abort | 两次route.abort(failed)，fieldsReady=false | fields_unavailable／disabled | 0 |
| missing_reference | 仅amount ID删除，quota9→8，shop保留 | field_incompatible／disabled | 0 |
| same_name_different_id | amount原ID改为字符串1793083721999，deType仍2，其余project不变 | field_incompatible／disabled | 0 |
| different_type | amount原ID保持、deType2→0 | field_incompatible／disabled；copyReason另为unsupported_tree | 0 |
| duplicate_reference | amount ID/type重复，quota9→10 | field_incompatible／disabled | 0 |
| malformed_arrays | driver实际置quotaList为对象invalid:true；project把非数组记null，dimension仍11 | fieldsReady=false，fields_unavailable／disabled | 0 |
| valid_empty | 两个实际数组均为空，shape合法，因此fieldsReady=true | 引用字段不存在，field_incompatible／disabled | 0 |
| unreferenced_removed | 仅删未引用ID1793083721162，quota9→8，amount/shop ID及type仍唯一匹配 | reason=null／enabled；正常paste+覆盖确认后success | 1 |

原始request区间分别为 `[2,4)`、`[6,8)`、`[10,12)`、`[14,16)`、`[18,20)`、`[22,24)`、`[26,28)`、`[30,32)`、`[34,37)`。前八项没有实际点击disabled按钮；loading只在release后恢复可用。因此本轮证明入口fail closed和采样不变，**不声称已强制执行paste后被拒绝**、无Store写或所有非法调用路径均已拦截。

同名不同ID场景的原始metadata只投影id/deType；名称本身没有逐值落盘。预冻结driver使用spread仅更改id，其余属性保留，这支持受控“仅换ID”协议，不扩大为真实后端同名迁移已实测。

源码对应：composable对dimensionList/quotaList都要求Array，加载前清fields/ready，失败或malformed保持unavailable；合法空数组可ready。核心按完整字符串dataset ID及树所引用字段的ID/type核兼容，未引用字段不参与拒绝；随后checkMvpFilterTree要求引用ID唯一，因此duplicate会拒绝，且deType变化可使copy的gt运算符变unsupported_tree。上述顺序与本次各诊断一致，不按名称或轴字段推测。

## 全部发现与历史保留

### F1〔原P2观察缺陷；新时点恢复成功，不追认旧结果〕

原events.exit为15:56:36.222Z、panel URL但 **editorCount=1**；原restored.clipboard仍含旧clip，session仍7/7、pasteReason=null，qobs仍success。该restored整个对象严格等于最后afterPaste；原42条API无findById。原driver只等URL而未等旧Editor隐藏，故这份冻结记录不能证明已退出／重入或clip清空。500阈值相同不是恢复证据。原summary的restored对象也保留非空clip，不能从字段名“restored”替换事实。

后续恢复独立记录：freeze15:59:16.851505Z，driver SHA `73e5a244466957501ebd2214ecd05fb439ee0c8bf280030d390a0db20f391729`；执行15:59:29.236Z—15:59:33.186Z。该driver先等diagnostic和back-icon hidden，再重入。新exited在15:59:29.714Z，editorCount=0；15:59:29.899Z新增findById原始响应HTTP200/code0，request为指定dashboard/main-edit/snapshot、ID1312476889213964288，读回indicator dataset1312472054565572608和整棵500树均与原clip相同。新restored整source descriptor相同，clipboard=null、pasteReason=clipboard_empty、qobs=null，会话9/9，相比原7/7已改变。

新时点恢复成立；初次早采样及其诊断继续保留。恢复driver并未重跑九case，本轮仍为第2/3轮。

### F2〔非阻断追溯错误〕冻结卡的AC05不能晋升权限

Goal AC04与UI05的对应已在上文明确。该错误不妨碍在正确原authority下阅读本次字段证据，但后续台账必须使用AC04，不得凭卡将AC05权限状态提升。无需为修正历史文字重写卡或原证据。

### F3〔证据层限制〕正例未保存独立HTTP成功响应

原driver只监听request与pageerror，未订阅response。原42条API中恰1次POST getData，位于正例索引36（queryStart36、requestEnd37）；其目标indicator、dataset与整customFilter均与完整clip一致。成功后的qobs.outcome=success／logicalGetDataCalls=1，qobs.responseData.tableRow与series amount均为5093；tileText为“指标卡／5,093／amount”。独立CSV递归树+Decimal命中3,5,11,13,16,18,21,25八行，总金额5093，与qobs和画面文本相符。

可以说“1次实际request、应用报告成功、qobs与tile金额符合独立oracle”；不能说本包已独立捕获getData HTTP200/code0或原始response body。新增恢复的findById HTTP200不能移植给早先getData作响应证据。

### F4〔未观察层必须保留〕malformed旧展示链异常没有console原迹

原errors=[]只来自pageerror监听；未监听console，原文件没有持久化“filter is not a function”等异常文本。本轮不补取或编造异常。静态getFields旧展示链仍可能把truthy的quota对象直接赋入state.quota，composable自己的Array guard则已在实测中禁用paste；本包不能判旧展示链全程无异常，也不能把静态风险猜测写成已抓到的运行异常。投影quotaList:null表示“非数组”，不能把实际注入对象偷偷改称null响应。

### F5〔可观测上限〕清理协议匹配，未审计route注册表

9场景全部hits=2、completedHandlers=2，无handlerFailure/case executionFailure，原顶层executionFailure也不存在；首失败不会中断其他case，9个预定case全部运行。loading显式release，所有finally再release兜底；每个handler finally增加done，原始值证明本次没有未完成held handler。

route/unroute使用同一外层matcher函数和各case同一handler引用，matcher精确限定本dataset+indicator路径；没有用通配全局unroute影响别的route。unroute调用自身却.catch吞错，原包没有逐次成功日志或live route registry读回；所以支持“同引用精确清理协议已调用、所有handler完成”，不独立证明宿主route表最终绝对为空。新恢复只能证明其采样可正常读回，不能替代route表审计。

## 已检查无问题、未查原因、同类残余与准入预测

已查无问题：11个唯一原输入、5类admission引用、topology前后phase、冻结／invocation／output摘要、全部九场景与16份metadata变换、18个handler完成、loading前后状态、全部42条请求、每case查询区间、正例整树和独立5093，以及原早采样与后续真实findById恢复的逐层区分。

共27份source/clip描述（含loading、before/afterPaste、原早采样与新恢复）重建ownKeys与undefinedPaths全匹配。所有旧clip完整等于初始clip，含tableId1312472054565572608、createdAt6747537.5、revision4，未消费或续期；各case选定target完整树等于初始500描述。没有为证明相等删除null、空串、缺失字段或打乱数组次序。diagnostic.source在case中是当前选定target的树，并非独立观察原source图表全部后态；未将其偷换为双图完整状态均已复核。

原42请求为39 POST、3 GET，三条save/saveCanvas/updateCanvas匹配0；监听在source copy前安装、原driver finally结束后移除。**新增recovery只订阅findById response**，因此0保存API的观察范围不能延伸到15:59新恢复，也不证明任意后台或直接DB无写。未save属于执行器没有显式Save及原窗口无三接口观察，不提升为全来源写入审计。

未查：真实schema变化／迁移、真实权限、未知dataset/count/-1/计算字段的树引用、全部运算符、target轴不含引用字段的独立fixture、picture-group真实Attr入口、49类型完整source/target、完整Store old-state／dirty／画面不变、强制非法paste调用、独立HTTP getData成功响应与console异常、全部外部写入来源。原始观察和受控fault范围不足，静态guard、DEV allow或qobs success均不补这些PASS。稳定知识／Dashboard／全diff／最终closeout不在本lane判定面。

同类残余：禁用未点击不能等价于运行调用拒绝；project不是完整原响应；应用诊断不是独立网络响应；URL变化不能替代Editor销毁；清理代码存在不等于registry空。当前冻结资料保留这些边界，无需为把声明变强而机械重试。

准入预测：可引用九场景的本地受控字段目录入口结果、正例request+qobs/tile数值及单独新时点恢复。F1已在新时点恢复；F2按正确AC04追溯；F3–F5按证据层限制接纳，不要求本轮改产品源码或补造历史。AC04/MVP-UI-05整体、原38义务／49类型和真实权限均保持原分母与未验部分。当前无必要机械启动第3轮；剩余预算1/3只供有实质新证据或修复的差异，不换名重置。本报告不是全Goal收束或Stop Gate终态。
