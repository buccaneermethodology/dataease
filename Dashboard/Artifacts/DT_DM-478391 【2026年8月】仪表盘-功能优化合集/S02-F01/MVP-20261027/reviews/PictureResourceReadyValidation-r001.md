# 图片候选资源就绪首轮独立验证

- reviewed_at：2026-10-29T06:39:01.231929+00:00
- Session：DE-EXEC-S038；snapshot_id：S02-MVP-PICTURE-RESOURCE-READY-VALIDATION-r001。
- as_of_state：卡摘要384abc85c95ce8842b3760b17419308aba9ab983239ab048aa0669181ff9c2fc，当前Component.vue摘要077c69a92610691ab4d1bfb8b088b942a8c7d93d65a5cc46604df860f9901ea0；runner摘要40bc8481b7a51774260e3e51e6fe8d2a061100d1804ec012e73e886b0c70b250。
- 轮次：本图片资源实现Validation第1/3轮；不重开此前设计评审或其他耗尽的评审。
- 总结论：REQUEST_CHANGES（需补齐测试与追溯后复验）。代码有界正确性：PARTIAL / 静态未发现确定生产缺陷，已执行实例通过，完整冻结行为的动态正确性尚未建立。覆盖充分性：FAIL（不充分）。真实UI：NOT_RUN。

本任务核查图片候选是否等到真实资源、load和decode才就绪，并在失败、取消、过期及资源切换时拒绝晚到结果。这里只验证图片候选局部实现与测试包；38项Goal义务、49类型分母保持原样，不能据此授予MVP、权限或产品完成。没有修改生产源码、测试或冻结材料，仅写本报告。

## 实际读取与复跑证据

已实际执行lane_task_card.py validate --expected-card-sha256，exit 0、verdict pass。另逐个重算Goal与14个base_context_refs的原始字节摘要，15/15匹配。读取Goal.final.json的must_have_ledger/范围与终止规则、当前Handoff、设计r002、Cases r002、设计复审r002、Freeze r002及HarnessCorrection、冻结旧SFC/旧runner和完整局部patch；读取当前SFC、resourceImageCache.ts、resourceImages.ts、imgUtils.ts的真实转换入口与两个图片runner、paste runner。

以下均在core/core-frontend实际运行；子进程capture_output，小摘要输出，未把import/执行错误计为RED：

| 命令 | 实测结果 |
| --- | --- |
| node tests/filter-copy-mvp-picture/check-resource-ready.mjs --baseline | exit 1；9 FAIL / 9 PASS；业务指纹含PIC-RR-PENDING-PLACEHOLDER-READY、PIC-RR-FINAL-URL-NOT-RESOLVED、PIC-RR-FAILED-PLACEHOLDER-READY、PIC-RR-BAD-RESOURCE-READY、PIC-RR-CLEARED-CACHE-READY、PIC-RR-CHANGED-SRC-READY；无stderr |
| node tests/filter-copy-mvp-picture/check-resource-ready.mjs | exit 0；18 PASS / 0 FAIL；无stderr |
| node tests/filter-copy-mvp-picture/check.mjs | exit 0；4组PASS |
| node tests/filter-copy-mvp-paste/check.mjs | exit 0；20组PASS |
| ./node_modules/.bin/eslint src/custom-component/picture-group/Component.vue | exit 0 |
| git diff --check -- 局部SFC及两个runner路径 | exit 0 |

同字节runner对旧/新SFC的可信RED/GREEN成立，但可信RED只证明抓到其业务指纹，不能替代全部冻结调度覆盖。逐行对比当前SFC/旧picture runner与冻结before，实际差异与scope patch一致；新增resource runner全文已读。全工作区有大量其他修改，本轮只评估卡绑定的局部交付，不接管无关差异。

## 全部发现与处置建议

### F1（阻断，覆盖）：16个case ID出现不等于全部冻结schedule执行

runner实际报告18实例，只把PIC-RR-02/03展开为before_scan/after_scan。其余多调度多数仅一个分支，详见下表。边界断言缺失或调度未触发均不得按case名自动算通过。补齐时保留旧冻结字节与首轮结果，另建测试准备版本、重新冻结并对同字节runner复跑RED/GREEN，不要求先改生产代码。

| 冻结ID | 当前实际实例与不足 | 未执行或未建立的冻结schedule |
| --- | --- | --- |
| PIC-RR-01 | pending后imageReady，done=false成立；先pump使helper已扫描 | placeholder load/decode **before first barrier scan**未受控触发；现例是扫描后 |
| PIC-RR-02 | before_scan/after_scan两分支，成功URL含S02 MVP | final load before resourceReady gate未以明确hook及门状态独立确认；src换代复用旧decode，见F2 |
| PIC-RR-03 | before_scan/after_scan两分支均拒绝 | 这两个分支已执行；扫描前精确位置仅由promise/pump间接控制，建议增加显式扫描见证 |
| PIC-RR-04 | text/plain Blob拒绝 | ordinary completion已执行；共通零写/清理oracle未查 |
| PIC-RR-05 | 先失败，再不reset启动第二候选，requests=1 | 既有failed entry分支已执行；共通oracle未查 |
| PIC-RR-06 | helper期间unmount，随后late completion | duplicate dispose/unmount未执行；没有调用成功handle.dispose再重复dispose；cleanup中的第二次unmount不构成有断言的幂等验证 |
| PIC-RR-07 | helper期间isCurrent=false，late后拒绝 | isCurrent false during decode未执行 |
| PIC-RR-08 | fake timer整体推进10000，late后src不变 | load deferred/late已执行；跨多轮资源稳定化共用总10秒及单调deadline边界未验证，见F3 |
| PIC-RR-09 | seedUnrelated独立entry失败，当前候选成功 | distinct placeholder已用；未构建真实第二candidate root，现证据仅无关缓存entry隔离 |
| PIC-RR-10 | mode=data后load，deferred decode使pending | data路径已执行；其输入与真实imgUrlTrans端口未等价验证，见F2 |
| PIC-RR-11 | mode=external成功路径需decode | error rejects明确预期未执行；相对URL原属性/绝对src差异未执行 |
| PIC-RR-12 | empty成功、无image、requests=0 | ordinary completion已执行 |
| PIC-RR-13 | OFF成功、queries=0、queried=false | ordinary completion已执行；未对完整metadata/0共享写作本runner断言 |
| PIC-RR-14 | data模式decode reject | ordinary rejection已执行；没有另测真实cache最终decode reject分支 |
| PIC-RR-15 | 第一次decode立即resolve，其后deferred，clear后拒绝 | clear before first scan、clear between barriers with recreate均未执行；during final decode意图已改善，但仅assert calls>=1，未断言确已进入第二次candidate decode，见F2 |
| PIC-RR-16 | data模式decode期间直接换props.src，拒绝 | sourceUrl changes during helper、root/image disconnected均未执行；也未测试image/root对象被替换但仍连接 |

### F2（阻断，宿主真实性）：图片src换代没有换代加载状态，可能掩盖最终真实图片未加载

依据check-resource-ready.mjs：Node构造时仅创建一次decodeTask/complete/naturalWidth（约179-189行）；patchProp（约254-260行）只写props，src变化不重置complete、naturalWidth或decodeTask；imageReady（340行）无条件赋naturalWidth=120并resolve同一个decodeTask。

在PIC-RR-02 after_scan，先对pending placeholder调用imageReady，随后资源成功、src换成真实data URL，宿主仍保留旧complete=true、width=120和已resolve的decode。生产helper/final candidate都可消费旧resolve，而测试不在最终URL尚未load/decode时断言pending。后续再调用一次imageReady不能证明先前没提前ready。故“最终真实URL字符串正确”可过，但“最终真实像素实际load/decode完成”未被这套宿主独立证明；120x80来源字符串与自然尺寸断言也不能等同真实渲染。应让每个src代拥有自己的load/error/decode状态与deferred任务，明确区分helper decode和candidate最终decode，并在每个精确边界作pending/拒绝断言。

其他已查宿主维度：getAttribute读取原属性、src getter按base URL绝对化、isConnected递归父节点、querySelectorAll递归子节点与HTMLImageElement instanceof适配均存在；但当前输入没有实际相对URL，故原属性比较兼容性只有静态代码证据。getComputedStyle固定none，不能证明background资源；本次候选img边界不要求扩测背景。FileReader只模拟成功arrayBuffer转换，无真实浏览器解码。imgUrlTrans是显式provider替身，cache模式忽略value统一映射固定path，data模式原样返回，external模式统一返回fixture绝对URL；生产resourceImage与waitForResourceImages实际打包执行，但生产authenticatedImageUrl/identityScope与真实资源鉴权请求未执行。不要声称整条生产身份/转换接线动态通过。

PIC-RR-15当前assert calls>=1不能区别helper与最终decode；建议显式记录两种阶段和实际调用序列，进入第二次deferred才clear。现有静态时序很可能走到第二次，但缺少防止宿主以后误掩的确定断言。

### F3（阻断，oracle）：零共享写、清理与总deadline未被断言

runner创建env.writes并记录setViewDataDetails，但全文没有针对writes.length的断言。Node记录listenersBeforeSrc，但全文没有校验它；timers/listeners也没有按成功/失败/取消/timeout分支校验归零。cleanup主动unmount/clearCache不等于在finish时已正确清理。缺少resolve一次、重复dispose无副作用及late callback不再写的完整观测；late src只在06-08作了最终值比较，不能查出写后恢复。

fake setTimeout使用独立clock，生产current()使用真实performance.now()，二者没有共同控制。tickTimeout一次加10000只证明timer回调拒绝，未验证9999/10000边界、helper+稳定化重入+final decode共享同一总期限，亦未验证timer延迟执行而performance deadline已到的fail-closed。应统一可控单调时钟或给出独立实时时间验证，记录src写入次数/时点、listener/timer增减、settle计数、共享写入及不相关资源controller未被候选取消中止。不要把现有timeout用例提升为完整deadline证明。

### F4（需修复，追溯）：卡AC-MVP-F01-10映射错误

卡acceptance_criteria_ids只有AC-MVP-F01-10；Goal该条定义30分钟TTL与reload/退出/身份清空，并非图片资源就绪。当前图片修复应追溯候选准备/真实query与预览/独立验收相关原义务，例如AC-MVP-F01-06/08/12，并保留MVP-UI-10-PICTURE作为局部实现标识。建议独立Errata解释错误投影及正确映射；不改写Goal或旧冻结资产。此问题影响验收归属，不是生产代码缺陷，也不授权缩小原38项义务。

## 已检查未发现确定问题的维度

代码局部检查：当前实现冻结sourceUrl、image、root；current核alive/current、对象相同、source不变、connected、单调deadline；每个资源await后与写src前复验。等待实际生产helper且只传候选root；转换不稳定重入循环，不用固定两次barrier。resourceReady门关闭期间load不能成功；开门后主动检查complete覆盖load先到。最终decode前后核原始src、再转换结果、complete/naturalWidth与current。error、decode reject、timeout、卸载经finish一次清理listeners/timer，late异步在current/settled后不能再次成功。空图/OFF和metadata代码路径未因本次patch改变。上述是静态实现检查结论；未执行调度仍保留NOT_RUN，不据静态检查宣称其动态通过。

实际cache/helper导入没有被providers集合替换，esbuild解析实际resourceImageCache.ts；axios只定向browser入口，网络与FileReader为显式替身。既有通用cache/helper摘要与卡一致，本次局部patch没有修改它们；本报告不要求重构共享cache/helper。未发现应立即改生产代码的确定反例。

## 未检查、同类残余与准入预测

真实浏览器120x80及文字、正常保存离开重开、真实认证/多用户权限、移动/嵌入和全49类型：NOT_RUN，本lane受卡范围限制且Handoff安排在后续UI，不能据此授予产品完成。全局KB、Dashboard最终对账及Goal closeout不在本局部准入内，尚不能形成final-state binding。

同类残余主要是所有依赖图片src换代/多个decode阶段的runner分支、其他未展开的freeze schedule及未执行共通oracle；这轮已一次列明，不以补一个case名就关闭同类问题。不新增冻结合同外产品要求；背景渲染、缓存架构及真实权限机制仍是原范围/后续任务。

修复后准入预测：只修测试宿主/调度/断言与追溯Errata，按新冻结版本同字节RED/GREEN、原有picture/paste/lint复跑，并以逐schedule见证证明所有oracle，下一轮可重新裁定代码有界正确性与覆盖充分性。若忠实宿主揭示生产缺陷，再给精确触发证据与写入范围，不预先断言必须改源码。下轮为本Validation第2/3轮；即使局部通过仍需后续真实UI与完整Goal执行。
