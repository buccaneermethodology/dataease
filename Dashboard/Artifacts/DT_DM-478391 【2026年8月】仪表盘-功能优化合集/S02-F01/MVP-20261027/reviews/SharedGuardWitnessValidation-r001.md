# 原U2真实日期与共享guard见证：独立验证 r001

**总体裁决：PARTIAL / NEEDS_WITNESS_REVISION（部分见证可直接吸收，类别拒绝的隔离前提需有限补强）。新增产品实现阻断0；新增见证阻断1，编号GWV-001。** 新runner独立复跑20/20、semanticFailures=0、executionErrors=0，定向lint exit0，这些真实执行结果保留；但两个query类别case在type改变后同时使fieldsReady=false，当前断言不能排除以目录未就绪造成假阴性。因此20项GREEN不能自动等于类别guard被独立隔离证明。

本包首次独立审查**1/3**，不重开原Slice A/C1/C2已满3/3的实现，也不把这里的test witness缺口当产品bug或虚构RED→修复。真实日期正例、17个pure输入、bar正常receiver对照可以先按以下层级复用；只对GWV-001作同包有界r002补强，不机械追加其它运行或review。

- reviewed_at：`2026-10-30T22:13:39.476766+00:00`；reviewer/source：`/root/bubble_ready_validator_resumed`，未编写本20案runner/Golden/BDD/driver或本次采集，未代修。
- snapshot_id：`S02-SHARED-GUARD-WITNESS-VALIDATION-r001`；as_of_state：card绑定Topology-r590、原r001冻结runner/20Cases、真实日期r003及两控制失败、恢复和全部下列输入。
- card canonical SHA：`a5c25a57611dab312c99bafefed210e883464acea2e5470e5479e60103bf61d5`；接收端validate/render实际exit0并完整消费execution_command。39处引用、38唯一输入SHA入场/写前一致。
- 唯一仓库写入本报告，写前不存在。未操作浏览器/HTTP/DB、修改产品源码/runner/原Cases/Golden/BDD/旧证据或状态，未安装/构建/启动服务/提交/推送。实际只读执行新20案runner及定向lint，另外离线复算CSV/JSON/摘要，view_image查看一张原PNG。

## 原合同与可吸收分层

原AC-MVP-F01-02/04、原UI06/05要求真实RowAuth基本整树与静态日期可复制，unsupported结构和不可验证dataset/字段/type/operator及图表↔query错类别整次拒绝。S039准备r002的U2明确只补真正缺的共享见证，不是全结构/全部operator/49负向组合。完整38义务（P1=12/P2=26）、49类型/完整0/49、真实权限BLOCKED/NOT_RUN、插件unknown均不变。

| 本交付层 | 独立结论 |
| --- | --- |
| 真实RowAuth静态日期→bubble源copy→symbolic目标paste、正常保存/重开及语义恢复 | **PASS_WITH_BOUNDS**：当前完整runtime树保真与JSON语义/顶层结果/正常显式保存重开成立；序列化默认键变化、旧symbolic details错误、未截图的所有symbolic视觉不自动通过 |
| 17个真实service pure输入 | **PASS_WITH_BOUNDS**：native descriptor重建正例+16个精确合成负例，整次拒绝/旧clip/session/输入保持；不是正常UI负例或真实HTTP0 |
| bar真实Vue/composable/emitter control | **PASS_WITH_BOUNDS**：目录正常ready、copy成功、可用receiver实际派发1次；provider边界明确 |
| VQuery/v-query两错DTO类别case | **实际观测到拒绝/receiver0，但不足隔离类别guard**；GWV-001待修见证前提，不填这项独立证明PASS |

这是verification-only新增执行见证；未改原UiIntegrationCases、原15case runner或产品实现，没有需要伪造可信RED的新增产品行为。

## 真实日期正链、CSV与请求结果

真实r003窗口21:44:22.295Z—21:44:43.447Z，driver起止/当前SHA均`d67ac44520e396855cc1572811338e1f93c8ab0b08a6e6740c7db06f988cde94`。driver走正常过滤入口：date字段→大于→按语义name“时间”锁定嵌套弹框→年月日→填2024-03-15→确认两层，得到真实原生date字段`1793083721147`、term=gt、filterTypeTime=dateValue、timeType=date、value=`2024/03/15`；另一完整OR子组保留六店的实际顺序。不是脚本改Store/JSON来冒充UI输出。

resource=`1312476889213964288`；实际复制源为bubble-map `7520752064427724800`，目标为symbolic-map `7520741153101058048`（driver变量名source/target沿原fixture身份，不能据变量名颠倒实际copy方向）；dataset=`1312472054565572608`。

运行前oracle.created_at=21:38:27.172309Z，早于所有3个控制/成功run；CSV SHA=`abc8bed0862129d58724bcefff2563862e48d1ea057365ae8d5d2c853e64472b`。独立按实际日粒度gt2024-03-15且shop在六店筛选，命中ID：`3,5,7,11,12,13,15,16,18,19,20,27`，共12，SUM(amount)=5337。没有从待测响应倒填oracle。

| 分组 | 12条日期结果金额 | symbolic实际坐标/city | count |
| --- | ---: | --- | ---: |
| 江苏省 | 2223 | latitude32.0603 / longitude118.7969 / 南京市 | 5 |
| 浙江省 | 1454 | 30.2741 / 120.1551 / 杭州市 | 3 |
| 广东省 | 1660 | 22.5434 / 114.0579 / 深圳市 | 4 |

已逐省/逐坐标复算，金额、组数与symbolic的`*`计数均对应，非只比较总和。bubble辅助data的field/value与tableRow对应；symbolic仅表中顶层group金额/count/city/坐标可吸收，不扩大details。

| wire index / 时间UTC | 实际动作 | 已核结果 |
| --- | --- | --- |
| 5 / 21:44:28.359 | bubble正常更新静态日期baseline | 3省2223/1454/1660，总5337 |
| 6 / 21:44:29.966 | symbolic候选query | 3坐标金额/count如上；HTTP200/code0 |
| 7 / 21:44:30.668 | 正常工具栏显式updateCanvas日期保存 | 资源正确、两图type/完整日期树正确，HTTP200/code0 |
| 8 / 21:44:31.414 | 正常panel退出后findById | 两图日期基本条件/树语义持久化，HTTP200/code0 |
| 9 / 21:44:31.809 与11 / 21:44:31.817 | 重开bubble与symbolic新query | 同12条日期oracle、三省/三坐标金额及count；不是复用candidate结果 |
| 13 / 21:44:36.167 | 正常编辑symbolic回amount>500并更新 | 8命中、3坐标1982/1243/1868，count3/2/3，总5093 |
| 14 / 21:44:39.404 | 正常编辑bubble回amount>200并更新 | 14命中、三省2676/2217/1868，总6761 |
| 15 / 21:44:40.473 | 正常工具栏另一次updateCanvas恢复 | 源symbolic500/目标bubble200及type正确，HTTP200/code0 |
| 16 / 21:44:41.238 | 恢复保存后panel退出并新find | 旧amount基本语义/type确已读回 |
| 17 / 21:44:41.645 与18 / 21:44:41.652 | 恢复后bubble200/symbolic500新query | 上述14条6761和8条5093逐组相符 |

全run103条非认证API metadata、21条business wire（16 getData、3 find、2 updateCanvas），已查全部wire均HTTP200/code0，非匹配资源请求没有被冒称全部成功。候选窗口为api半开区间`[32,33)`，恰一条symbolic getData，datePasted.qobs逻辑1/success；配置更新/重开/恢复的请求另列，不混为paste二次查询。dateCopied和datePasted的已导出clipboard整体相等。

initialExit21:44:22.364、dateExit21:44:31.252、restoreExit21:44:41.055Z都实际panel/index且editorCount0，driver同时等diagnostic与back icon hidden；不是只改hash后推断已离开。最后savedAfter为真bubble-map200、sourceView真symbolic-map500；finalDiagnostic clipboard=null、三role均unknown、fieldsReady=true；身份session实际为epoch13/editSession13/revision2。没有从epoch差推断全部导航次数。

## 原生descriptor与JSON边界：严格保留差异

`StaticDateNativeGolden-r001.json`恰为raw `/dateCopied/clipboard`的tree/ownKeys/undefinedPaths加原tableId投影；不是新authority。Golden的19条fields恰等已释放Plan.field_catalog字典按顺序投影为`{name,...metadata}`列表，实际source是Plan，**不是raw导出的内部clip.fields**。

nativeDate.source、dateCopied.source、copied.clipboard、datePasted.source的完整descriptor严格相等；13个递归Object.keys投影节点及顺序均自洽。shop叶有一个实际own undefined：`$.items.1.subTree.items.0.timeValue`，JSON树省略该键，ownKeys保留，undefinedPaths恰记录一处。独立核每个JSON已存在键的顺序=ownKeys扣除实际undefined路径后的顺序，缺键集合恰等undefinedPaths；没有把undefined/missing/null归并。

新runner按ownKeys顺序Object.defineProperty重建native对象；数组index按实际投影重建。GW01在真实service复制后重新导出的descriptor与Golden严格一致，target guard可接受。这里的ownKeys来自产品`Object.keys`投影，证明实际导出的可枚举字符串键/顺序；不声称任意symbol、不可枚举键和属性descriptor都被动态采样。

实际候选query、两图日期save请求的完整customFilter JSON等native tree的实际JSON投影；前传输runtime的一个own undefined由JSON正常省略，该边界单列。**日期find/reopen不是原native树字节全同。** 两图同样出现21处JSON键/值差异，逐类全部为：

- 第一date叶及group各一个timeValue从空串变missing（2）；
- 第一date叶和group的dynamicTimeSetting由空对象补六个null键（12）；
- 三个节点补field/valueType null（6）；
- group fieldId由空串变null（1）。

此外重开descriptor.undefinedPaths=[]，与runtime原own undefined不同；键顺序亦经正常序列化/DTO重建变化。没有通过过滤默认键制造严格相等。所有有效field/operator/date值、根AND/子OR/六店和值顺序不丢，实际新query/独立数据一致，因此这里只接受原AC的**基本条件语义与保存重开结果**，不宣称任意缺键/undefined/null/空串的持久化严格保真，旧map19形状mismatch也不由本包关闭。

语义恢复也不是逐字节恢复：savedBefore与savedAfter两个customFilter的JSON差异均只在amount叶timeType由year变date；金额型字段的ID/operator/500或200/六店语义不变，复算结果正确。新driver明确该恢复上限；不能把timeType变化藏掉后写原完整树byte恢复，更不能扩成所有view/style/axis/隐藏Store均已恢复。

## 原两控制失败与恢复不追认

| 原run | 实际失败与计数 | 后恢复边界 |
| --- | --- | --- |
| r001，21:39:36.211—47.825Z | readonly combobox input被“默认条件”占位span截获，8秒click超时；保存请求0，未到日期完成/正式paste | recovery21:40:56.302标注正常取消未提交编辑；after/final读回amount200、clip空。actual normal-cancel动作原生capsule不在本读集，不能只凭kind描述把全部操作时序补造出来 |
| r002，21:41:55.233—21:42:08.169Z | 等last()隐藏时locator先指“时间”后漂移到仍可见“添加过滤”父框，8秒timeout；保存请求0 | recovery21:43:41.789标注取消父编辑，final读回amount200/clip空/三unknown；同样只独立核该记录及后状态，不追认run成功 |

三个driver当前文件都等各events.driverShaStart=driverShaEnd。r003按真实select外框与时间语义name修观察driver，未改产品；这是控制恢复，不是产品RED。r003起始新find的原amount500/200基线再次明确，后续真实日期链与两save独立成立；不要求为以上恢复动作采样上限重演原控制失败。

## 20项runner：实际独立执行、provider与全部case

独立执行于core/core-frontend：

- `node tests/filter-copy-mvp-guard-witness/check.mjs`：exit0、20 passed、0 semantic failure、0 execution error；Cases SHA=`83e1b550b84366885aa1e79013c7af23e1aef20e58d30c580bbd0a00ebc2399c`。与Builder原stdout逐项ID/结果一致。
- `./node_modules/.bin/eslint tests/filter-copy-mvp-guard-witness/check.mjs`：exit0、stdout/stderr为空，无--fix。

原runner SHA=`e4306a42a37f3c22bee5499c145962b6d34a4cde5e6213f5dc6793eea071cfff`；RunnerFreeze21:58:55.654302Z绑定runner/Cases/Golden/product hashes，BuildEvidence22:04:13.543683Z记录20/0/0与lint0。原stdout自身没有独立started/finished时间字段；不从文件mtime推执行时间或补造完整原生调用attestation。本Validator当前独立复跑直接提供同字节执行层证据。

真实模块为service/composable、Vue、自有emitter/receiver和原options；没有替换被测guard逻辑。user/cache/dv/route、getFieldByDQ、i18n/confirm、registry facade为显式provider；timer provider不推进实际250ms，不测试TTL。registry由SupportedCharts49静态render:type→axis映射构造，没有启动真实插件registry或作实际注册加载验收。

| case集合（共20） | 精确输入与实际见证 |
| --- | --- |
| GW01（1） | 真native descriptor重建，复制及target校验接受，严格投影相等 |
| GW-D-source/target-absent/null/empty（6） | source或target dataset分别missing/null/空串，实际service整次拒绝；旧clip/session与被传输入保持 |
| GW-F-count/minus-string/minus-number（3） | 首叶fieldId=count、字符串-1、数字-1；实际service拒绝，不部分copy |
| GW-F-computed-missing/expression（2） | 目录不存在computed-not-in-directory；或原基本树field设sum(amount)，实际拒绝。不是所有合法计算字段禁用规则 |
| GW-O-date-like/number-like（2） | date的like及改成amount/500仍like，真实dateOptions/valueOptions不允许；整次拒绝，旧clip/session/输入保持 |
| GW-S-leaf-object/group-null/group-array（3） | 叶subTree={}；group subTree=null/[]，真实结构guard拒绝；不是仅用空组冒充三个畸形分支 |
| GW-C-control（1） | bar先有真实异步目录provider pending并resolve，fieldsReady=true、copyReason=null、copy成功；receiver真实注册后ui.copy/ui.paste派发1，受控receiver返回failure，target保持 |
| GW-C-query-upper/lower（2） | 换type为VQuery/v-query后copy/paste最终拒绝、receiver0、clip/session/target保持；但其它guard未维持放行，见GWV-001，不给隔离类别证明PASS |

前17个纯service输入中，每个负例先建立合法native clip/session，再变一个冻结输入（number-like为声明的3项相关变形），独立读clip/token/原输入对比；pure输入不会查询或写目标。它们不能证明真实UI按钮/HTTP0/全Store/真实schema迁移。源/目标dataset缺失只验证缺失值，未把任意非空ID伪造目录后称已验证dataset真实存在。

## 唯一阻断发现：GWV-001 / P2 / 类别见证的其它guard未保持可用

**这是test witness缺口，不是确认的产品类别bug。** 定位runner约220–245的`view.value.type=item.type`以及composable约177–205目录watch、约216–225 baseReason。

事实链：

1. 3个component case都先mount为bar、resolve首个getFieldByDQ、fieldsReady=true、copyReason=null，注册receiver。这个正常对照有价值，不能回退为无效。
2. 对两个query case，runner接着`view.value.type='VQuery'/'v-query'`。
3. 真composable的watch `[id,tableId,type]`为flush:sync；立即把fieldsReady=false、fields=[]，再创建**新的目录provider Promise**。runner未resolve这个新pending，也未再次断言fieldsReady=true。
4. 当前真实baseReason确实先检查registry capability，再检查fieldsReady，所以当前静态路径最先返回capability_unknown；产品guard方向是正确的。可是runner只断言copyReason非null和receiver0，没断言准确reason/其余guard均放行。
5. 因而即使类别能力检查失效，这两个case也可因fields_unavailable而仍得到非null、receiver0/clip保持。bar的dispatch1发生在改变type之前，不能排除改变type本身新引入的目录失效。新Cases.forbidden明文禁止以字段未ready造成拒绝冒充类别guard，原UI05类别见证要求仍未独立隔离闭合。

**最小修正：** 保留原Cases/Golden/r001 runner/输出，另冻结同U2 r002 runner候选；type切换后resolve该轮新目录provider并等fieldsReady=true，核身份/permission、dataset/树/target兼容和receiver仍可用等其它guard放行，再断言copyReason/pasteReason准确为capability_unknown及receiver0、旧clip/session/target不变。bar正控制1继续保留。无需改产品、强开真实query UI、增加新case分母或重跑真实日期/save链；也不要只把预期改成fields_unavailable。

根因是测试未把guard独立轴维持住，两个case同一根因，计1项见证finding。父Agent已明确收到并拟在本报告落盘后提供r002候选；该后续消息只作为处置意图，当前没有读取/验收未来候选，也不回写本r001 GREEN或冻结件。累计下一轮应为同U2 2/3，不重置为新包1/3。

## 其它非阻断发现与残余一次列明

1. **GWV-N01 / P2 / 数据与视觉上限。** 当前symbolic旧环境raw details仍有非六店文本（例如蓝墨店、欢果店）与不满足date条件的2024-03-10记录；顶层金额/count正确不能关闭它。此包预先声明只核顶层，保留旧8100/details残余，不宣布全DTO正确，也不从7070 URL推断后端具体加载JAR/hash。source PNG已实际查看：419×348，中国轮廓、三气泡及控件可见；title仍“指标卡”不代表type。没有symbolic采用后/全部重开截图，不能称symbolic所有视觉通过。
2. **GWV-N02 / P2 / runtime/transport/persisted严格形状分层。** date运行三树严格相同、save JSON原样保持；find两图各有21处默认/空值键变化，重开undefinedPaths清零，amount恢复timeType year→date。不能删差异制造完全恢复，也不能借共享基本语义结果将旧map19或任意形状持久化升级通过。
3. **GWV-N03 / P2 / 目录与registry来源。** Golden.fields复用Plan19条目录，不是内部clip字段快照；registry是49静态映射facade，不是真插件注册环境。真实user/cache/identity、HTTP、DB和后端权限不由这20案通过；两query案也只是错误Chart DTO，不是实际VQuery编辑器动作。
4. **GWV-N04 / P3 / 原控制恢复来源上限。** 两原run失败/save0与后200空clip读回独立可核；“正常取消”动作是恢复kind说明，缺绑定原生动作capsule，不填补全操作时序。成功r003另有正确baseline及正常driver，故无需为该历史上限机械重演。
5. **GWV-N05 / P3 / 审阅辅助错误保留。** 初次离线CSV读取未用utf-8-sig导致BOM表头下KeyError('id')；修正解码后12行/金额复算通过。第一次把Plan.field_catalog误按list处理，实际是dict，触发TypeError；改为真实字典顺序投影后与Golden19条完全一致。二者均是Validator辅助前提错误，无产品/runner变动，不算产品RED/失败case，也不隐藏初次错误。
6. **GWV-N06 / P2 / BDD和声明同步。** 新中文reader已映射原AC02/04、UI05/06并明确provider/HTTP边界，产品原15case未修改。reader对类别案“已就绪字段”目前只由bar前态支持，GWV-001修好后才可充分支持当前类别证明；下轮按准确见证同步reader/evidence投影，不改原Goal/UiIntegrationCases或旧报告。

没有其它本轮新增产品blocking。真实权限、原38/49、C2V-005三轮BLOCKED、旧ubo等按原归属保持；不因都是“guard”或地图正例就重开耗尽实现。当前不要求增加所有operator、所有computed、所有图表/负向/2401；不替换原始predicate。

## 准入、摘要与来源检查

两个Context均实际validate exit0：StaticDatePositive-r003的19条required-read、SharedGuardWitnessBuild-r001的15条required-read全部实际revision SHA匹配，九认知域齐。两个admission的goal/contract/context/design_review/topology五类摘要匹配，按真实action=builder与各自canonical target检查exit0。

日期freeze/admission issued_at=21:44:08.845545Z，早于r003开始21:44:22.295Z；oracle更早21:38:27。guard build admission issued_at=21:55:20.699745Z，runner freeze21:58:55，Builder证据22:04:13；本报告不把后topology-r590倒填为运行前状态。源service/composable、paste/emitter与原15runner当前均等本卡冻结SHA；该新见证不是产品源修复。Source hash约束本读集，不证明所有运行加载产物或整个仓库source归属。

正常dateValue/timeType/date输出以真实driver动作和原生raw对象为准；本lane没有重新读取全部RowAuth/TimeDialog源码，不将其它报告的静态说明冒充本轮源码重审。

## 已查无问题、未查原因与修后准入预测

已查无新增问题：39/38主绑定及内层Context/admission摘要、两gate exit0和时序；3个driver起止SHA；真实native edit/copy/paste路径、完整descriptor/undefined/顺序、golden严格投影和Plan19目录出处；预先CSV12条/5337及逐省/坐标/count，8个相关日期/恢复目标query；103API/21wire、candidate物理1/logical1；两正常save与两panel/find/reopen、恢复type/amount语义/空clip/三unknown；两控制失败/save0后状态分层；20runner逐case真实执行与lint0；bar正对照、pure合成来源/不变性、provider范围、原15runner/product hash、BDD映射和无RED误称。

未查及原因：未新操作UI/HTTP/DB/构建/安装，未重算旧全包或所有49/全部operator/合法计算字段；没有真实query Editor负例、全部HTTP零请求审计、全Store/dirty/历史缓存、真实鉴权/所有身份/部署/Profile、全地图details/SDK资源/全面视觉、最终Dashboard/KB/full-diff/closeout/Stop Gate。原因是此包有界共享witness、provider明确替身、图片与原件观察面，不是默认PASS。当前两类别case隔离未通过，原因不是环境缺失而是可修的测试前提，已单列GWV-001。

同类残余：执行GREEN不等guard因果隔离；先前bar字段ready不等换type后仍ready；receiver0不等HTTP0；sample字段目录不等内部clip字段；截图不等完整树；query正确顶层不等details全正确；正常save不等默认/undefined字节保持；新成功不抹旧控制失败。各层独立保留，不能以一种证据替代另一种。

**修后准入预测：** 本轮真实日期与17pure/正常bar成果可直接吸收，无需重跑日期/两save/恢复。下一单位仅修GWV-001的r002见证前提，保原20Case身份和Golden，确保两个query输入除了类别外其余guard均可通过，再独立复核相应delta与旧20结果/BDD声明。若成立，可补原U2确缺的类别见证；不自动关闭完整AC02/04、P1或Goal，不为本报告另发review或机械凑3/3。若新测试暴露产品反例，保留实际结果另诊断，不改期望迎合实现。

## 输入最终绑定

| 卡输入（工作区相对路径） | SHA-256 |
| --- | --- |
| `Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/Goal.final.json` | `4db931a6764a8c48345e7e8358e579550a9bc98594bf1654647716d72b9678c4` |
| `Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/MVP-20261027/UiIntegrationCases-r002.json` | `e365ef111582ef84f20f26e6136854409b7fc66bb0931cae40a9df5318036d55` |
| `Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/MVP-20261027/reviews/MvpAcceptanceReadinessReview-r002.md` | `d3f97246db43f9dc705829d94ede73891694b13f21f7f3a9f4a03d748574fbe7` |
| `Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/MVP-20261027/shared-guard-witness-r001/ValidationHandoff-r001.md` | `aa6d6717644d4c13fa0174f34ff7d8237987ac9a17e9c7c64f9479ecd436ab48` |
| `Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/MVP-20261027/shared-guard-witness-r001/Design-r001.md` | `afc3971642b9552168e36c021fb251fb7531bfea6bf7559c38c453037ac92ca2` |
| `Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/MVP-20261027/shared-guard-witness-r001/Cases-r001.json` | `83e1b550b84366885aa1e79013c7af23e1aef20e58d30c580bbd0a00ebc2399c` |
| `Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/MVP-20261027/shared-guard-witness-r001/RunnerFreeze-r001.json` | `db3c63bf60e6f97e09cf3072e457a0b3c777fa0adc2af4c39641147b9a2d963e` |
| `Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/MVP-20261027/shared-guard-witness-r001/Verification.stdout.json` | `2a7a63581ab1140ec1cdf15c410fac1bb26a546523af01bffe5af1531841bfcb` |
| `Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/MVP-20261027/shared-guard-witness-r001/Verification.stderr.txt` | `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855` |
| `Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/MVP-20261027/shared-guard-witness-r001/Verification.exitcode.txt` | `9a271f2a916b0b6ee6cecb2426f0b3206ef074578be55d9bc94f6f3fe3ab86aa` |
| `Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/MVP-20261027/shared-guard-witness-r001/Lint.stdout.txt` | `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855` |
| `Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/MVP-20261027/shared-guard-witness-r001/Lint.stderr.txt` | `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855` |
| `Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/MVP-20261027/shared-guard-witness-r001/Lint.exitcode.txt` | `9a271f2a916b0b6ee6cecb2426f0b3206ef074578be55d9bc94f6f3fe3ab86aa` |
| `Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/MVP-20261027/shared-guard-witness-r001/BuildEvidence-r001.json` | `c07f1658ef636ee304c8743ca3a9d02c80720995fbeaf79e95fe5fa2bfcf80a0` |
| `Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/MVP-20261027/evidence/StaticDateNativeGolden-r001.json` | `79d0a89e754452fe760632548dadb05b641d9536d63903ef268dfab7e577e3ee` |
| `Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/MVP-20261027/evidence/StaticDatePositiveOracle-r001.json` | `881422ff6a2ca9631f6f4bea070458c8b3251e5b0d8150323539ab6ec6769565` |
| `Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/MVP-20261027/evidence/StaticDatePositive-events-r001.json` | `f3b8ef88862fdc06a310925926a191eb92339f34602056d9ab0aa7510b460bbf` |
| `Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/MVP-20261027/evidence/StaticDatePositive-events-r002.json` | `3258d15b6698d50bc9375921ec0f6f78e9eb746e8ed9d2d984ac43c75c575f2a` |
| `Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/MVP-20261027/evidence/StaticDatePositive-events-r003.json` | `4e099f587126a3ad09e3d1cfc43554bd507aa16d46d2905f1ef0cb506fcb06fe` |
| `Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/MVP-20261027/evidence/StaticDatePositive-control-recovery-r001.json` | `076b69b256cb34dc09b9a9830ce18c7fc04d0b9244f7d1fc74686397c2c6697f` |
| `Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/MVP-20261027/evidence/StaticDatePositive-control-recovery-r002.json` | `f2eb3558582f0b855cef69ce4b234b14a779c8322701a731b9a3e43aaa40f321` |
| `Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/MVP-20261027/evidence/StaticDatePositiveToolFreeze-r003.json` | `3b28aa1925c9d7626697481c5c85574d661a5ad31fee7a58deb789cf29d34229` |
| `Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/MVP-20261027/runtime-state-tools/observe-static-date-positive-r003.js` | `d67ac44520e396855cc1572811338e1f93c8ab0b08a6e6740c7db06f988cde94` |
| `Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/planning/ContextBootstrap-StaticDatePositive-r003.json` | `de3c843bcfd7abbf57602b6f94df1f6335b1aecdd7c739b7e80e411e20deabf3` |
| `Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/planning/static-date-positive-admission-r003.json` | `b9202910a2ff1e6b08cde4f89bd2e9a6f755985fb1f65b3ec30829ee68478902` |
| `Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/planning/ContextBootstrap-SharedGuardWitnessBuild-r001.json` | `a096376559d9e5216c60f1e3ee0ca32b0465b2fcc4f1a5d3587af1e6594e1897` |
| `Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/planning/shared-guard-witness-build-admission-r001.json` | `e09b949b150658d8314707f0dd4cb65441083ffaee87cc3dc6898981bbaf7e98` |
| `Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/MVP-20261027/runtime-fixtures/TeaMaterialExtended-r001.csv` | `abc8bed0862129d58724bcefff2563862e48d1ea057365ae8d5d2c853e64472b` |
| `Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/MVP-20261027/RuntimeMissingColumnsPlan-r001.json` | `1c80cfa3da6a2a319d200f1cea356176eccd5cc0389546013d52ff204ac5c8cc` |
| `Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/MVP-20261027/SupportedCharts.json` | `163edf6b7f0a03f99256d02bb10f77c993847513f953a3e4fc743d0500c8dec4` |
| `Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/planning/Topology-actual-r590.json` | `d284e791039c04343aae5e050786ea59968d13c872fe03377210dc6c095569f2` |
| `core/core-frontend/tests/filter-copy-mvp-guard-witness/check.mjs` | `e4306a42a37f3c22bee5499c145962b6d34a4cde5e6213f5dc6793eea071cfff` |
| `core/core-frontend/tests/filter-copy-mvp/check.mjs` | `50c03f6373fb5bec8eadb3ac5d1c580568b62a9d26960ec33e0a5d07548d5694` |
| `core/core-frontend/src/custom-component/filter-copy/mvp-chart-filter-copy.ts` | `9f4eca86173318b7b964648d216fd7a6c153b41abce9eda12f8f6e9fc6944b82` |
| `core/core-frontend/src/custom-component/filter-copy/mvp-chart-filter-paste.ts` | `d3ebbd6236bf832df6e3e9971841a9ee68300dfb9e31a015c1532b5dc46a3e9e` |
| `core/core-frontend/src/views/chart/components/editor/filter/useChartFilterCopyMvp.ts` | `b760fffb47db4a8a187cc3dc996d6ddffb5f2b187038da625c5c8e0839d87e5d` |
| `core/core-frontend/src/views/chart/components/js/panel/index.ts` | `4cc0f5c25718d030c4b6b5e1607b8fa4cae0c80142c4a464087ab411c9cb7ac5` |
| `tests/bdd/readable_cards/s02-shared-guard-witness.md` | `432f984f16382a927fec4697c2faa7705970667ef36822bc4448fe1137776c52` |

额外读取3个旧driver（r001/r002/r003）与events.driverShaStart/End逐一一致；原source PNG SHA为`a9d2c37503027d47181d512a7c8c4ab85e9312d5e0f5978e3396cb58dff19e30`，与events一致。内层Context/admission路径摘要按上文逐项重算，不将它们冒充新的历史执行attestation。

写前主输入无漂移；当前只新增本报告。项目没有Session registry工具，不声称程序化注册表校验；本lane不更新Dashboard/KB或运行Goal终态Gate。
