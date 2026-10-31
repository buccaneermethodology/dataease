# G2 所有权生产 RED 独立验证 r001

## 裁定与任务理解

- **当前 helper-only RED：`TRUSTED_RED`（可信）。** 独立重跑确认生产 TS 成功 bundle/import，23 个冻结 helper identity 均实际调用生产入口，23 个精确 `NOT_IMPLEMENTED` 断言级失败，0 execution errors，首 fingerprint 为 `G2OWN-001: NOT_IMPLEMENTED`。独立 stdout 与原始 RED stdout 逐字节一致；原始证据保留。
- **未来 GREEN runner 充分性：`NEEDS_REVISION`（需要有界修复）。** 发现 1 项 cleanup 多通道漏验与 1 项双 attempt 错误分类缺口。前者影响 020/021/022/023；后者可在 A 为 stub、B 为执行错误时遮蔽 B 的错误。这两项不推翻现有纯 stub RED，但旧 runner 的 GREEN 不能单独证明完整 helper 合同。
- **有界 helper 候选实现入口：`CONDITIONAL_ENTRY`（有条件可实施）。** 本报告关闭“现有 RED 是否可信”的证据缺口；不要求改变 Design/Cases。Orchestrator 可在有效独立 Design verdict 与精确新 admission 下推进 returned-instance helper 候选实现。runner 的有界修复、新摘要、新 RED 及独立 delta 复核必须在依赖其 GREEN 作验收前完成；不得让主源码 Builder 自行改 oracle，也不得把旧 GREEN 当作完整合同验证。真实组件接线仍取决于独立设计终审、组件 RED/实际控制流 seam 及组件 target admission。
- **整体包与产品：`PARTIAL / NOT_ACCEPTED`（部分证据成立，尚未验收）。** 当前生产文件是 NOT_IMPLEMENTED stub。helper 实现、SFC 集成、真实 G2 浏览器、MVP、权限和 Goal 完成均未通过本报告。完整 10 Goal AC / 26 must-have / 16 产品义务保留；MVP-first 仅改变实施顺序。权限仍 `BLOCKED / NOT_RUN`。

本单元要让一次 G2 尝试持有已返回实例及已登记 cleanup，避免迟到、失败或卸载清错另一实例。此次验证核查的是其测试准备及证据可靠性，不是复制粘贴产品行为。主要风险是“错误在某个通道被看见”被误当成“合同要求的每个错误返回通道都正确”。

## 身份、范围与读取清单

Reviewer/source 唯一身份：`/root/g2_ownership_red_validator`；Producer：`/root/g2_ownership_red`，两者不同。Validation Card `S02-F01-G2-OWNERSHIP-RED-VALIDATION-r001` canonical SHA-256 为 `0c032e2159e93e4b637d0a882d29c689cc072f0b9f76aba7e57e7946518f3173`，接收端先复验通过。Context `77dd6bd999a42995eec70170f21e6f584f09b8591f7102a68044402e3638a8fc` 结构验证通过；19 项 required-read 实际摘要全部匹配，未发现绑定输入漂移。写范围只有本报告，测试/负例输出均写 `/tmp/g2-ownership-red-validator-r001/`。

已读取 Card 全部 required-read：AGENTS、SP-010 kernel、Goal、MVP-first authority、Design r002、Cases r002/r003、Design Review r002、写前 baseline manifest、package.json、生产 helper、runner、原始 RED 三类日志与 identity、三个 execution admissions。另扩读普通项目 kernel、validation recipe、固定 Validation Prompt/guard、context protocol、forbidden-claims Review r003 的裁定与限制、Builder Context/Card、Topology r383/r384、组件写前备份、原始 UserIntent、Goal ledger、CoverageMatrix、ScopeDeltaAudit、DevelopmentHandoff、Dashboard/Sessions 与本地 Sessions 最新 r144、Dashboard/README 相关记录。

- `guardrail_checklist.py --mode validation-agent` 已执行；仅作为核查指引，未冒充独立验收结果。
- Goal ledger 重算为26项；CoverageMatrix 为10项 Goal AC、14+2=16项产品义务，产品行仍 `NOT_RUN`。旧 ScopeDeltaAudit 是 QVALUE 时点历史材料；本次实施顺序以当前 Goal 与 `MvpFirstAuthority-20261025.json` 为准，不把旧“零范围变化”措辞当作最新用户授权的替代。
- `Dashboard/Current_State.md`、`Dashboard/Stage_Plans.md` 不存在；采用项目实际 `Dashboard/Sessions.md` 的 SP-006 行及本地 Sessions r144，不要求凭空新建不存在的治理文件。共享 Dashboard 尚有较早的准备期摘要，当前行动以新 authority 与本轮绑定卡/准入为准；本报告不改共享 Dashboard。
- 本轮 Validation Handoff 由已验证 Card/Context、Producer identity 与原始日志组成；没有把 Producer `independent_validation=PENDING` 自报当作 verdict。全 Goal 最终 closeout、post-closeout reconciliation 不在本次交付阶段，故不作最终 pass/done。
- 稳定产品 KB 未改；此报告只落在执行证据目录。没有新产品规律需要写 canonical KB，也没有将候选/测试结果提升为产品真源。

## 独立执行与字节绑定

独立命令在 `core/core-frontend` 执行：`node tests/g2-render-ownership/check.mjs --mode red`。时间由本次调用前后 UTC 记录，不来自 mtime。

开始：`2026-10-26T04:17:50.022832+00:00`；结束：`2026-10-26T04:17:50.054406+00:00`。独立输出：`/tmp/g2-ownership-red-validator-r001/red.stdout.txt`、`red.stderr.txt`、`red.exitcode.txt`。

| 核验项 | 独立结果 |
|---|---|
| contract_valid / production_module_imported | true / true |
| helper_cases_executed | 23 |
| passed / assertion_failures / execution_errors | 0 / 23 / 0 |
| 23条 error_code | 全部 G2_RENDER_ATTEMPT_NOT_IMPLEMENTED |
| 每条 fingerprint | 全部精确 G2OWN-xxx: NOT_IMPLEMENTED |
| 首 fingerprint / red_rule_satisfied | G2OWN-001: NOT_IMPLEMENTED / true |
| 进程退出 / stderr | 1（预期断言级非零）/ 0字节 |
| stdout 与原始证据 | 逐字节相同 |
| component cases | NOT_RUN，未改活动组件 |

关键摘要：

| 对象 | SHA-256 |
|---|---|
| Cases r002 原字节 | f4348c739094943db73872ebc974d9b5048186d627c5022df2fa9c33d5fd2bba |
| helper stub | ee4a86b213973ae00345fe079000454085c72af8c48a2725cdda454c1b8fb3ed |
| runner | a704b1dc7e961d35919d40056bf037346be7015eeaa7d23f230481a1e218a5a4 |
| 实际 bundle | 657ceb163f501062163e9874071b33719442ee7677eb712d163ad9ab68048eac |
| 原始与独立 stdout | 78f4200fa8c2d8964f8c6ad565277f7f7197862039c96688ed4298ba51efd0a9 |
| 空 stderr | e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855 |
| exitcode 文件 | 4355a46b19d348dc2f57c046f8ef63d4538ebb936000f3c9ee954a27460dd865 |
| r002/r003 helper case 数组 canonical identity | cc85113d5c8bd395cc8773f8361f3a5b83fcec1d5cbc93751705c2507d273e80 |

runner 固定检查 Cases r002 原字节摘要；r003 的 23 个 helper case 与 r002 逐对象完全相同，r003新增/修改的组件合同不被本次 runner 消费。本次重算每个 case 的 sorted-key canonical SHA-256，均与原始记录一致。更换父版本不自动形成新的 helper identity，也不构成组件测试已运行。

## 23 例逐项检查

下表 RED 列每项均为实际生产调用后的精确 `NOT_IMPLEMENTED` 失败；GREEN 列表示静态核查 runner 的消费能力，不表示已运行实现通过。

| Case | 实际 arrange / GREEN oracle 消费 | RED / 发现 |
|---|---|---|
| 001 success | create→setup→render→afterRender 精确事件；ready scope/instance 身份 | 精确失败；通过域 |
| 002 stale_start | current=false；零 create/阶段事件、零 destroy、stale | 精确失败；通过域 |
| 003 stale_after_create | create使current失效；只 destroy 一次；不 setup | 精确失败；通过域 |
| 004 stale_after_setup | setup登记cleanup后失效；cleanup→destroy | 精确失败；通过域 |
| 005 stale_after_render | 真实deferred门，入 render 后切 stale；无afterRender | 精确失败；通过域 |
| 006 stale_after_afterRender | afterRender真实deferred；after→setup逆序cleanup、destroy | 精确失败；通过域 |
| 007 explicit_empty | 显式empty；initial cleanup一次，无实例/后续阶段 | 精确失败；通过域 |
| 008 create_reject | create失败；initial cleanup；primary/cause引用一致 | 精确失败；通过域 |
| 009 setup_throw | setup登记后throw；cleanup/destroy；原错误身份 | 精确失败；通过域 |
| 010 render_reject | render reject；cleanup/destroy；原错误身份 | 精确失败；通过域 |
| 011 after_reject | after登记后reject；逆序cleanup/destroy；原错误身份 | 精确失败；通过域 |
| 012 dispose_twice | 逆序b/a/destroy；closed；第二次返回[] | 精确失败；通过域 |
| 013 cleanup_throws | bad抛错不阻断其它cleanup/destroy；错误引用可见 | 精确失败；通过域 |
| 014 replace | 旧项立即清一次；新项dispose清一次 | 精确失败；通过域 |
| 015 remove_reentrant | 删除先于回调，重入remove返回[] | 精确失败；通过域 |
| 016 register_closed | 关闭后登记立即清；二次dispose不再工作 | 精确失败；通过域 |
| 017 scope_isolation | A create pending时B ready，随后A stale；A/B destroy=1/0；B scope/instance/current/closed | 精确失败；双调用分类缺口见RV-002 |
| 018 destroy_throws | destroy错误可见；二次dispose[]，destroy一次 | 精确失败；通过域 |
| 019 unexpected_undefined | failure code精确missing-instance；无伪empty | 精确失败；通过域 |
| 020 stale_cleanup_error | stale、cleanup/destroy/notify顺序及错误引用 | 精确失败；result通道漏验见RV-001 |
| 021 failure_cleanup_error | primary/cause保持；cleanup/destroy/notify顺序 | 精确失败；failure通道漏验见RV-001 |
| 022 replace_cleanup_error | old bad→notify→new cleanup→destroy | 精确失败；replace返回通道漏验见RV-001 |
| 023 notify_throws | 通知throw不改stale outcome；notify错误保留 | 精确失败；result遗漏原cleanup可被通知掩盖，见RV-001 |

执行没有在探测到 stub 后跳过整个 case loop。`runCase` 正常调用 `captureInvocation`，005/006/020/023 的deferred driver在stub提前settle时安全结束；017仍先后调用 A/B 并处理两个Promise后报告失败。stub本身不进入用户回调是预期的未实现状态，不能称生命周期内部各阶段已实际通过。23 case identities 包含24次helper调用（017有两次）。

## 全部发现与最小修复

### G2OWN-RV-001 / P1 / OPEN：跨通道合并去重掩盖合同要求的 cleanup 错误返回

**影响层：** 阻止把当前 runner 冻结为完整 helper GREEN 验收；不否定现有 RED 的精确失败事实，不要求重写 Design/Cases。

**依据：** Design r002 第42行分别要求 ready/stale/empty结果携带cleanupErrors、failure携带cleanupErrors、replace/remove返回Error[]，自动路径还同步通知。`check.mjs:118-123` 将所有通道的错误身份合并去重；`240`、`262-263`、`275`消费failure、operation、result时只写入同一集合，`287`只比较该集合；虽然保存了 `notificationBatches` 和 `operationReturns`，没有逐通道比较。

因此：

1. 020 通知含setup，但 `stale.cleanupErrors=[]`，仍符合合并集合；
2. 021 通知含setup，但 `failure.cleanupErrors=[]`，仍符合合并集合；primary/cause检查不能弥补cleanup数组缺失；
3. 022 replace已通知bad，但 `replaceCleanup()`返回[]，集合仍含bad；
4. 023 通知已观察setup，结果数组只带notify错误而漏setup，集合仍等于[setup,notify]。

`/tmp/g2-ownership-red-validator-r001/oracle-channel-witness.mjs` 抽取现有environment/assertOracle原函数，以上述负例观察值调用，四类均被原oracle接受，另确认重复同一Error的返回数组也被去重投影接受。这是oracle层负例验证，不是生产实现或产品GREEN；没有写仓库测试或实现。

**最小修复：** 由获得专属runner修复卡/target admission的独立Builder，仅补现有23 case的通道断言：020结果数组精确[setup]；021 failure数组精确[setup]且保持primary/cause；022相应replace operation返回数组精确[bad]，其它操作精确空数组；023结果数组精确[setup,notify]。继续按现有事件oracle检查通知顺序/次数，通道内比较错误引用与顺序，不使用跨通道去重替代。普通dispose的013/018及重复dispose也分别核对相应返回数组，避免同根漏验残留。不修改Cases expected、identity或Design；新runner摘要另记，保留旧RED与旧报告。

精确notify事件已能拒绝额外非空重复通知；本报告没有把“重复通知未检查”作为新阻塞，也不要求合同未规定的新通知协议。

### G2OWN-RV-002 / P2 / OPEN：双 attempt 的首个 stub 失败会遮蔽另一调用的执行错误

**影响层：** runner未来RED错误分类完整性；不推翻本次源码为同一无条件stub、A/B均精确reject的已核验事实。

**依据：** `check.mjs:318` 在检查B结果前先抛A的NOT_IMPLEMENTED；`319`才检查B，外层`380-388`会把先抛的A记为断言级失败。所有Promise均被捕获，避免了unhandled rejection，但“捕获了错误”不等于“把全部执行错误纳入execution_errors”。

`/tmp/g2-ownership-red-validator-r001/dual-attempt-classification-witness.mjs` 调用现有runCase，A输入NOT_IMPLEMENTED、B输入TypeError；确认两个调用都执行，而传播码仍为NOT_IMPLEMENTED。此负例不改生产文件，原始RED中B实际来自同一精确stub，故没有把该假设负例误记成已发生的生产execution error。

**最小修复：** 对该case的A/B两条结果先完成分类；任一未知执行错误优先使本case为execution error，只有全部实际失败调用均是预期stub码时才投影为NOT_IMPLEMENTED。成功/合同失败的GREEN路径继续按原stale/ready及scope oracle检查。加混合A/B负例验证分类，保持23冻结case identity与原RED记录；runner修复后另存新RED并独立delta复核。

## 已检查且没有新增阻塞的域

- 生产入口真实bundle/import，不使用另一个模型或hardcoded“检测stub即全红”短路；缺模块、bundle/import、timeout及未知错误沿execution-error路径处理（双调用分类例外已单列）。红/绿使用同一case对象与相同业务oracle，mode不交换expected。
- Cases schema/freeze、23 stable IDs、scenario顺序、runner_ref、red fingerprints、event_projection与event_comparison一致；每条arrange/expected字段均核对。显式投影是冻结合同的一部分，没有擅自把投影外事件补成新硬要求。
- ready/stale/empty/failure、await后失效、错误主引用、幂等/重入/关闭后登记、已返回实例destroy计数及A/B实际独立身份都有对应断言。017对B的instance/scope、closed=false、current=true及destroy=0、无cleanup错误均有检查，未将其当作仅“存在B”标签。
- 原始identity各artifact引用逐字节摘要全部匹配；r002/r003 helper identities一致；原始stdout中23条case摘要独立重算一致。不存在以父文档revision变化偷换helper expected的情况。
- 三个RED准备admission均用实际`action=builder`及精确target重跑脚本通过，Goal/contract/context/review/topology摘要匹配；限定stub、runner、evidence，未授权活动组件接线。Producer card canonical digest `4495309d2db31b1d4c11b83eb7a43f651e162cf63770b111ee9b88bba7fca470`复验通过。Topology保存的是文件raw SHA，而Card工具显示canonical SHA，两者不可混同；已分别核对，不把格式差异误报为漂移。
- baseline记录于03:51:45Z，admissions/Producer topology于03:58:23Z签发，Producer记录运行于04:06:52Z，本Validator独立运行于04:17:50Z。时序与准入后运行一致；不从文件mtime推断首次写入。identity的“首次写前已验证”是Producer声明，本次未读取平台级首次写入事件，不能独立升级为首次写入宿主强制执行证明。
- 活动`ChartComponentG2Plot.vue`当前字节与写前备份/manifest/identity均一致，SHA-256为`e9429bf59915e5a23d4f9d70987b126ca8b8329863be3208c625367e71f607e5`。不存在本次helper-only准备修改组件的证据。
- 没有缩减原分母、提升权限通过、改写旧3/3 Review或G2OWN-027遗留。执行Dashboard与canonical KB未混用。

## 未检查、非阻断边界与声明限制

- 未执行主helper GREEN：生产文件仍是stub；本轮只审查未来runner并做oracle/分类负例验证。没有把“静态上存在断言”写成实现通过。
- 未执行SFC/组件Cases、真实G2库或浏览器、tooltip/legend/resize、MVP复制粘贴、保存重开、query/Store原子发布、网络、数据库、真实多用户权限；本卡明确只做helper-only RED，权限继续`BLOCKED / NOT_RUN`。
- 本次没有重新编译SFC、跑全量ts:check、安装依赖或启动服务；这些既不能证明当前stub的业务实现，也不属于本次独立RED复验所需最小动作。当前production bundle成功是语法/导入证据，绝非产品构建/验收。
- G2OWN-027（renderer/installer返回句柄前partial allocation）仍`OPEN / NOT_FIXED_BY_THIS_UNIT`，由后续完整stage产品实施负责，不新增为本returned-resource helper候选的阻塞，也不将其关闭。
- 更广泛并发交错、异步cleanup、库内forceFit物理取消、冻结投影以外事件等不追加为当前case合同硬要求。实现独立Validation仍需读真实代码以核对合同不变量，23例通过不能代替该审阅。
- 本报告是终审设计lane之外的独立RED Validation；没有替代设计r003的最终结论，也没有开启旧事务/产品接线交付物第4轮。没有全Goal最终closeout与post-closeout证据，不能声明Goal完成。

## 修复后准入与验收预测

1. 现有RED证据可作为真实未实现基线保留，独立裁定为可信；不得覆盖或补写旧r001记录。
2. 为runner有界修复建立新卡/准入，按RV-001/RV-002补既有合同断言与分类；Design/Cases不变。生产stub仍在时保存新runner的新RED、摘要与负例结果；由独立delta Validation确认23精确失败、0执行错误、identity不变及两个缺口关闭。
3. 若独立最终Design允许helper候选、当前Goal/context/topology已绑定并有精确source admission，可推进helper实现；runner修复与候选代码实施的角色/写域明确分开。新runner的RED与delta复核须在其GREEN被依赖作验收之前成立。旧runner不能独立支持完整合同通过。
4. 实现后至少用修复冻结runner跑23/23同identity GREEN、定向检查，并由独立Validator读取实际代码/完整差异/最终证据。组件接线另以其真实SFC RED/GREEN、设计条件及组件admission准入；随后实际G2浏览器和MVP端到端按各自证据层验证。
5. 修复预期只解除测试验收工具的两个有界缺口；不会自动提升MVP、16产品义务、权限或S02 Goal状态。原10/26/16及真实权限`BLOCKED / NOT_RUN`继续保留。

**最终双结论：当前RED可信；未来完整helper验收尚不足，先修runner并独立delta复核再依赖其GREEN。有界实现可在独立设计与精确admission成立后推进，最终Validation仍待实现及完整证据。当前不能声明helper/MVP/Goal完成。**

## 绑定输入摘要附录

| required-read | SHA-256复核 |
|---|---|
| `AGENTS.md` | `270940a30f462f2fb0c9a8cf2bbc1dd11750513d8f063ffc376e0e0a2640466e`，匹配 |
| `.codex/skills/sge-governed-checkpoints-sp010/SKILL.md` | `b3e5d00193f88608e8deb3214071444ce89fa66431daf115b35f72fedbecbe3f`，匹配 |
| `Goal.final.json` | `28c94d3c35d4ce0a891ce77ecc915932d67f88ef813f3d2815dc0dce11f91b64`，匹配 |
| `planning/MvpFirstAuthority-20261025.json` | `a5b00d1678a7543e654c1b9eb07e77fe36f6810ab025f473d59ccd64b5979342`，匹配 |
| `G2StageLifecycleOwnershipDesign-r002.md` | `7b522c8eed3ec21265f83631608da7ecac5626b9774a97b5a6ef6e437461e79b`，匹配 |
| `G2StageLifecycleOwnershipCases-r002.json` | `f4348c739094943db73872ebc974d9b5048186d627c5022df2fa9c33d5fd2bba`，匹配 |
| `reviews/G2StageLifecycleOwnershipDesignReview-r002.md` | `440657cc73f05352840a3b2a5506594befd2b392f1cee1c77dcc2d41ffb48b6e`，匹配 |
| `planning/g2-ownership-prebuild-baseline-r001/manifest.json` | `3056a0e3c2d25ae22c4972cec4f6f3aa084d201de434c289b7c5bbed7335048d`，匹配 |
| `core/core-frontend/package.json` | `7e425e59824c20ab5005950cab568fce090e9cd45ecc89e5e9968aa7b537344a`，匹配 |
| `G2StageLifecycleOwnershipCases-r003.json` | `b8844f51bed1f0574215210003ad1d59831c75635f9b0b6ed091baf3b78bbfe7`，匹配 |
| `core/core-frontend/src/views/chart/components/views/components/g2-render-attempt.ts` | `ee4a86b213973ae00345fe079000454085c72af8c48a2725cdda454c1b8fb3ed`，匹配 |
| `core/core-frontend/tests/g2-render-ownership/check.mjs` | `a704b1dc7e961d35919d40056bf037346be7015eeaa7d23f230481a1e218a5a4`，匹配 |
| `planning/evidence/G2OWN-RED-r001.stdout.txt` | `78f4200fa8c2d8964f8c6ad565277f7f7197862039c96688ed4298ba51efd0a9`，匹配 |
| `planning/evidence/G2OWN-RED-r001.stderr.txt` | `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`，匹配 |
| `planning/evidence/G2OWN-RED-r001.exitcode.txt` | `4355a46b19d348dc2f57c046f8ef63d4538ebb936000f3c9ee954a27460dd865`，匹配 |
| `planning/evidence/G2OWN-RED-r001.identity.json` | `7b0b12c6cc457c13d63aeab2ec03350501f6f77299d3f04fcba8132790db35fb`，匹配 |
| `planning/execution-admission-g2own-red-r001-module.json` | `90a9a468c8c6e52c34cccdba9e99ede0e8f6a505b9991e6fb7d53b9282bd9206`，匹配 |
| `planning/execution-admission-g2own-red-r001-runner.json` | `37419c226945b652fca0dd3fa99f6f30dc69e5ace4f4062a977936dba2dda89f`，匹配 |
| `planning/execution-admission-g2own-red-r001-evidence.json` | `08067fe1e87a93d895ae16230e5f35499fb998854f20a64fb84df9c546aaf916`，匹配 |
