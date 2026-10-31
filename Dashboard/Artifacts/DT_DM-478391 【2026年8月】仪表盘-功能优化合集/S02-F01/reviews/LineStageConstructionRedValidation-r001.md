# 普通折线构造阶段 RED 测试交付物独立验证 r001

## 分层裁定

**测试交付物第 1/3 轮：全 55 包 `NOT_TRUSTED_AS_COMPLETE_RED`（不能认定完整可信 RED）；Line 已返回 G2 句柄失败回收的无歧义投影 `TRUSTED_ASSERTION_RED_FOR_LINE_HANDLE_ROLLBACK`（真实断言级 RED 成立）。**

全量重放确为 55 执行、7 PASS、47 ASSERTION_FAILURE、1 CONTRACT_DISCREPANCY、0 EXECUTION_ERROR；首 fingerprint 精确。LSC-046 冻结字段冲突、039/052 的 pre-constructor private not_observed 及下述 runner 漏验仍保留，`contract_valid=false`、`formal_red_proven=false`。本报告没有把执行成功或47失败改称全55可信RED。

**范围已由新的人类授权调整：本资源治理工程待迁入独立资源治理 Session，不再作为当前 S02 界面 MVP 前置；本报告不提供新的 S02 源码准入。** 控制面核实的来源为 thread `01a16109-aa34-78a0-8f47-f48aebb7e396`、userMessage `01a17b46-fa6c-7713-8511-a16644a2f999`。这是 Goal 重定界，不是暂停令；旧证据、55分母和046未决不被改写成已通过，不重开Design第4轮。本 lane 不启动任何生产修复。

## 身份、输入与独立运行

Reviewer/source：`/root/g2_closeout_reviewer`。虽为此前独立 Design Reviewer，但没有编写/修改 runner、生产源码、Cases、Builder日志或本轮实现；本次是独立测试包 Validation，非 Design 第4轮。

Card canonical `ff862e3b57a0d90946a3e8ad01742ca5853ad342aa8862d45e961759a835464f` 验证 pass；Context `3d92782d77a4a18e81a583defa876b3c69352de5266574799a5358b8bbc50853` 验证退出 0，22 项 required-read 摘要全匹配。读取全部760行runner、完整三生产模块、冻结Design/Cases/Review/manifest、baseline全部字节及55份结果；未修改冻结输入。

在仓库根目录独立执行：

```sh
node core/core-frontend/tests/line-stage-construction/check.mjs --manifest 'Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/planning/LineStageConstructionFreeze-r001.json' --mode red --report 'Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/planning/evidence/LSC-RED-validation-r001/report.json'
```

[独立 report](../planning/evidence/LSC-RED-validation-r001/report.json)、[stdout](../planning/evidence/LSC-RED-validation-r001/stdout.jsonl)、[stderr](../planning/evidence/LSC-RED-validation-r001/stderr.txt)、[退出码](../planning/evidence/LSC-RED-validation-r001/exitcode.txt)、[实际时点/命令](../planning/evidence/LSC-RED-validation-r001/run.json)、[逐55项审计](../planning/evidence/LSC-RED-validation-r001/case-audit.json)、[摘要绑定](../planning/evidence/LSC-RED-validation-r001/bindings.json)均为本轮新输出。exit 1、stderr 0字节；report 与 Builder 原报告**逐字节相同**，SHA-256=`b882d9e4e3618260238cbf366dfe0effbd5a96442e5dc77960a46443af58d5ff`。

| 对象 | 独立重算 |
|---|---|
| runner | `bddacb2df76dee7789a18260f65c1a0eca9f966401cd6a8551f6409233b9e7d8` |
| Cases raw / canonical | `9e64b852fc50a3aeb9c4f4050d0a8a007fba3a9e8341af15a35e00bda0a7c50d` / `b18a08dc4bfc6c75462e5f0666e39c308aa8555083b0de493d4b120eeb75e97b`；55逐case canonical全匹配 |
| line source / compiled | `acacb1ae0fde128a1cb894f06ce073454da04205e9225633168e5f67cc8b4311` / `29c887fa09b259a78c83af4696ff42fa93172a02570dfefbf4db59d59d1ff07d` |
| Carousel source / compiled | `f3a1d565701da75bc027edca263e18e7e08b0096b08523d2cfcc3b0ce0860389` / `94709d2829274b139ba3670e4693407f967633bba154c9efc539239ccb6e262b` |
| common source / compiled | `9b41926e0b7765a7a7222e2a21195877a1d02d838b709ff352e9c09a25997903` / `c752aee9b725b8906d72783067c13fe4485b861ef28e18aee1ca72bf6271aa38` |
| 冻结manifest | `3f44784c2607370c99a647e80eb7ae904f5cc7add8c28bb703d20ffbc1d2a216`；三个source与写前snapshot均无漂移 |

## 全55域检查与原始结果

| 案例域 | 独立结果及声明上限 |
|---|---|
| 001–011、036、049 | 实际Line/common控制流、已返回G2、具名setup/legend/hidden/configure/options/point故障、原对象/非Error值和G.destroy失败通道可核验。001/005–011/036/049为真实回收违约；002/003/004为健康/空态/无句柄控制。详见下方窄准入。 |
| 012–024 | 构造各故障实际到达；原E身份、G未回收、取得的具体DOM/IO资源与泄漏均保留。constructor没有rollback时first-cleanup缺席被断言失败，没有填造通过。 |
| 025–027 | 025真实start到cooldown分配前故障；026真实IO+clock40得到S/TQ；027确有部分chart hook后故障，但其acquisition覆盖有LSCRV-003，不可声称全部声明hook均建立。 |
| 028–031、050 | 四种惰性健康控制通过；050真实无host destroy TypeError为产品行为违约，不是导入/执行环境错误。 |
| 032–035、047/048/051/055 | timer/cancel/frame/background、原错误与每次warning occurrence有精确引用/顺序断言；原代码早抛/缺catch导致实际失败。047 public首错ES保留但其余清理未继续；048的相同EC对象要求两次occurrence，runner没有Set去重。尚未验证未来修复GREEN。 |
| 037/038/040/053/054 | 真实constructor/start/替换/重入、独立owner、TQ创建者/queue、旧目标和全局状态均执行并核对；旧cache删除/new owner损害如实失败。restoreHover正常分支有原trace，不代表新owner下所有交互已通过。 |
| 039、052 | 039旧代码没有owner guard，产生覆盖而非预期拒绝；其`primary_fault_reached=false`不是loader错误。052旧destroy重新查当前W，W_old.remove声明故障未达，是captured-target缺陷；没有把故障移到W。构造尚未返回的private字段明确not_observed，acquisition可直接观察，两者不混用。 |
| 041、046 | 041真实scroll/TS/TQ已取得，但pageScrolling漏验见LSCRV-001。046保持冻结W/W_old矛盾，单列contract discrepancy；没有alias、删案例或改expected。 |

7项实际PASS严格为002/003/004/028/029/030/031；不把其它assertion/contract failure排出55分母。所有案例错误、trace、初态和未观察项均在逐项审计中保留。

## 全部测试包发现与修复要求

### LSCRV-001 / P2 / OPEN：LSC-041的pageScrolling终态没有断言

冻结oracle含 `page_scrolling_after=false`。runner `assess()`只把 `after.globals.pageScrolling`写日志，从未读取该oracle或比较其值。即使未来实现释放timer/listener后遗漏reset pageScrolling，这项合同也不会单独失败。不得声称“所有声明oracle已核验”。

**修复：** 在runner增补该可选终态字段的真实比较，保留Cases原字节。增加最小负控制证明只改变该观察值/独立诊断实现时会被拒绝；负控制不能当生产GREEN，也不能修改正式source。随后重新绑定runner并独立delta复验。

### LSCRV-002 / P2 / OPEN：listener ledger消费前观察会把未知存储误投影成空数组

`firstCleanup()`用 `Object.entries(instance)`筛选“属性名包含listener且值为Array”，把未匹配项flatMap成`[]`。Design没有冻结ledger一定是这种命名/Array存储；若实现用Map或别名，当前检查会在实际登记仍未消费时也报告空数组，违反“不得以缺观察默认pass”。现有source本来没有新ledger，不能因此倒推未来实现的消费状态已证明。

**修复：** 明确绑定实际生产ledger的只读观察及形态，或将未能定位的该字段记录not_observed并禁止据它给消费不变量通过；不得替换生产cleanup控制流或新增生产test-only export。加入一个非空ledger拒绝/空ledger接受的观察负正控制，保留原first-cleanup时点。DOM注册表能证明最终物理残余，不能代替“外部primitive前内部引用已消费”。

### LSCRV-003 / P2 / OPEN：LSC-027具名extremum故障的取得面不足

fixture `resources_at_fault`列 `extremum:afterchangesize`和`extremum:afterrender`；真实extremum在afterrender前先登记afterchangesize。runner具名double只 `g.on('afterrender', ...)`后抛错，未建立前者，且未核验该完整取得列表。故其RED支持“返回G后部分hook失败须回收G”，不支持“两项声明hook的完整资源面已执行”。

**修复：** 按冻结fixture在真实NamedChart事件表依次登记声明的两个hook，再在afterrender后抛原E；明确核验事件/资源取得记录。无需修改真正extremum算法，也不重开Design。不能仅把`resources_at_fault`当说明文字而声称全量取得面已验。

### LSCRV-004 / OPEN_CONTRACT_DISCREPANCY：LSC-046保持未裁矛盾

[LateDiscrepancy](../planning/LineStageConstructionLateDiscrepancy-r001.json)准确：arrange和解绑oracle为W_old，startup精确快照为W；同一个真实实例无法两者同时成立。此前静态审查没有发现它，运行揭示后不能追认全55有效。保持冻结字节、3/3预算及OPEN；runner对该case的其它实际断言仍执行，但不能据此取得全55合同有效或同identity全GREEN。此项由后续合法authority路径处理，当前不裁成W/W_old任一方。

**观测限制（非新增设计blocker）：** 039/052构造返回前private字段无法从new返回值观察；现有三个透明spy没有把该盲区伪造为通过。之后真实constructor rollback到达dequeueStart时可观察消费后this，但这不补成构造前private快照。原错误引用用外部注入E比较，039内部生成Error只检查code/class/no-wrapper，未做caught自证。

除此之外，未发现复制被测drawChart/constructor/start/destroy/stop/clearTimer、万能Proxy、替换真实三模块、以编译错误当RED、无记录跳过案例、篡改冻结oracle或错误去重。require/导出allowlist、每例新VM、具体handler/capture、timer/frame唯一handle、真实IO/clock及三个原样透传spy均已检查。

## 无歧义Line证据及迁出说明

**无歧义真实RED集合：001/005/006/007/008/009/010/011/036/049；控制为002/003/004。** 前八项实到各具名故障，已返回G的destroy_count实际0、期望1；036还明确G.destroy抛错不能遮盖业务E及物理Unknown；049保留非Error token引用。这里不依赖Carousel失败清理是否正确，也不依赖046的wrapper裁定、041终态漏验或027额外hook。003会走健康Carousel，仅作健康返回/所有权不提前释放控制，不能被说成Carousel故障验证。

此前冻结Design中“保存本次Carousel直接引用，失败时按该引用清理”的义务有真实源码调用路径依据，**不等于当前runner已证明Carousel清理成功**；constructor未返回的partial资源、Carousel整体异常安全和完整55验收仍开放。这些结论仅作为未来独立资源治理Session的移交证据，不构成当前S02的新准入，也不在本报告中追加生产实现方案。

迁移时保留本报告、独立日志、三个source写前baseline、原55Cases/Design/Review/Freeze字节及046未决；新Session重新绑定其自身范围/authority/admission。LSCRV-001/002/003为待修测试交付物问题，后续不得以重编号重置既有Design3/3预算；当前S02不再等待其解决。

## 未验证与父Goal继续

未做生产源码修复、未来GREEN、真实G2浏览器、整包类型/构建、数据库、多用户权限、stage/Store/host发布、Copy/Paste或保存重开。本轮只验证真实模块测试包与有界Line失败义务；原10/26/16、权限BLOCKED/NOT_RUN、旧r003/AM-09/G2OWN-027等历史证据保持其原状态，当前Goal范围和下一步由控制面按最新人类授权重新绑定。不能据本报告称资源工程/MVP/Goal完成，也不能据全包NOT_READY推导全Goal停工。当前安全收束动作是移交上述证据，S02转向新授权的基本UI MVP；不再为本资源工程签当前S02生产admission或启动修复。
