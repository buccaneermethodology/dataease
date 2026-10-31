# G2 所有权生产 RED 与 runner 修复独立增量验证 r002

## 裁定与任务理解

**本验证器交付物第2/3轮。结论：`PASS_WITH_BOUNDS_FOR_RUNNER_AND_TRUSTED_RED`，即本次 runner 有界修复与新可信 RED 通过独立验证。G2OWN-RV-001、G2OWN-RV-002 在本次工具范围内关闭，设计终审 G2OWN-R012 的同根验证器前置亦已满足。未发现新增阻断。**

**Helper source 入口：`READY_FOR_NEW_EXACT_ADMISSION`。** 已有 Design r003 的 helper 合同冻结条件，加上本次逐通道 oracle、双 attempt 分类和新精确 RED 的独立证据，足以允许 Orchestrator 签发新的、只针对 `core/core-frontend/src/views/chart/components/views/components/g2-render-attempt.ts` 的 `action=builder` admission，再由独立 Builder 替换 stub 实现 helper。不需要再开设计轮次，不把当前未实现本身当作 RED blocker。此结论不等于已经签发 admission；执行前必须消费新 admission 并验证绑定摘要与实际身份/目标。

该 helper 管理 create 已返回的 G2 实例及已登记 cleanup，保证 stale/失败时清理属于本次尝试的资源。此次任务只修复和验证其测试工具，当前生产文件仍为精确 NOT_IMPLEMENTED stub；本报告不声称 helper GREEN、普通 line SFC 接线、真实 G2 浏览器、MVP、权限或 Goal 已通过。原10 Goal AC、26 must-have、16产品义务保留；MVP-first仅改变实施顺序，真实权限仍 `BLOCKED / NOT_RUN`。

## 角色、读取与证据完整性

Reviewer/source：`/root/g2_ownership_red_validator`；Producer：`/root/g2_ownership_red`，身份分离。本轮先消费 rendered prompt，再用固定 expected canonical digest `05cb26bac20b8a1e91487f843b406119986660b1bdd8a25ce1e619bf667b619c` 复验 Validation Card，结果 pass。Context `1bff24e1c4a283e536feaf86220800308ba86a4b533a72e35876a4d2cb115aa9` 结构校验退出0；18项required-read实际摘要全部匹配。

卡片 mode 为 `full_baseline`；本报告完整核对其18项读集，并沿用r001已核验的原始目标/ledger、覆盖矩阵、Scope Delta与项目规则基线。AGENTS、SP-010、Goal及Cases r002/r003摘要与上轮基线一致；本次扩读最新Design r003及独立设计终审r003，不把旧r002设计结论当成最新准入。已阅读的本次差异包括runner全文、修复报告、新RED identity/日志、两个admission；重算新identity各artifact引用17项、admission引用2项，均匹配。

原始UserIntent、Goal26项ledger、CoverageMatrix10+16分母、ScopeDeltaAudit、DevelopmentHandoff及Dashboard相关Session/状态的完整初轮核对见r001。此次未更改产品合同/验收分母/KB真源；本报告只保存执行验证事实。当前不存在全Goal终态closeout与post-closeout验收，故本报告的pass严格限runner和RED准备，不是Goal final pass。固定Validation quality guard与证据边界继续适用，没有以Producer自报替代本次重跑。

## 独立重跑结果

所有输出仅写 `/tmp/g2-ownership-red-validator-r002/`；未覆盖Producer的r001/r002原始日志、identity或修复报告。

| 独立调用 | UTC开始 | UTC结束 | exit / stderr |
|---|---|---|---|
| `self-test-oracle` | `2026-10-27T00:38:16.993511+00:00` | `2026-10-27T00:38:17.021700+00:00` | 0 / 0字节 |
| `red` | `2026-10-27T00:38:17.022084+00:00` | `2026-10-27T00:38:17.054617+00:00` | 1 / 0字节 |


1. `node tests/g2-render-ownership/check.mjs --self-test-oracle`：exit0，stderr0字节；17个定向负例全部被拒绝，15个完整通道正向控制接受，精确双stub正控制PASS。诊断summary明确 `production_module_imported=false`、`helper_cases_executed=0`、`helper_green_proven=false`，没有冒充生产GREEN。
2. `node tests/g2-render-ownership/check.mjs --mode red`：exit1为预期断言失败，stderr0字节；`contract_valid=true`、`production_module_imported=true`，23 executed、23 assertion failures、0 execution errors、0 passed，首fingerprint `G2OWN-001: NOT_IMPLEMENTED`，23条均是本identity精确NOT_IMPLEMENTED，`red_rule_satisfied=true`。本次stdout与Producer新r002 stdout逐字节相同。
3. 独立Validator另写 `/tmp/g2-ownership-red-validator-r002/independent-delta-probes.mjs`，从磁盘runner抽取现有实际函数，不调用Producer自测入口，复建4组完整通道正控制和原先4类坏通道；正控制全部接受，坏通道全部因对应通道被拒绝。另执行A/B两种方向的TypeError+stub，均执行2次并传播原TypeError引用、分类EXECUTION_ERROR，共6项定向探针通过。探针不实现/替换生产helper，不写仓库测试。
4. `node --check core/core-frontend/tests/g2-render-ownership/check.mjs` exit0。本报告和限定变更的空白检查通过。未运行产品构建/数据库/权限/浏览器。

### 新冻结身份

| 对象 | 独立核对 SHA-256 |
|---|---|
| 当前runner | 0155a4e0e0a9dac40046c044b21410d4121b1177542604d48fb5e43a1d01d21f |
| 原runner历史身份 | a704b1dc7e961d35919d40056bf037346be7015eeaa7d23f230481a1e218a5a4 |
| 未修改的生产stub | ee4a86b213973ae00345fe079000454085c72af8c48a2725cdda454c1b8fb3ed |
| 实际bundle | 657ceb163f501062163e9874071b33719442ee7677eb712d163ad9ab68048eac |
| 新RED stdout | e8f39a2544dab3ac06fa56b356199e2593e2c272a14baf88967e8dcb7ba2484b |
| 空stderr | e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855 |
| exitcode文本 | 4355a46b19d348dc2f57c046f8ef63d4538ebb936000f3c9ee954a27460dd865 |
| Cases r002原字节 | f4348c739094943db73872ebc974d9b5048186d627c5022df2fa9c33d5fd2bba |
| Cases r003原字节 | b8844f51bed1f0574215210003ad1d59831c75635f9b0b6ed091baf3b78bbfe7 |
| 两版23 helper数组canonical | cc85113d5c8bd395cc8773f8361f3a5b83fcec1d5cbc93751705c2507d273e80 |
| Design r003 | ab6aa597e06199bc947ff82f1b16f2955fe22e9e7210ac5bc2301e2b92295761 |
| Design独立终审r003 | c386d4ad6ab5fc55c4bfa276b8dbcee9afb85e464cc136b1cbb9e9b5871163aa |
| Goal | 28c94d3c35d4ce0a891ce77ecc915932d67f88ef813f3d2815dc0dce11f91b64 |

runner仍消费r002的冻结原字节；r002/r003的23 helper case对象完全相同，每例canonical摘要与新RED23条记录逐项一致，组件C01–C06仍独立且NOT_RUN。runner修复只加强已有合同的通道消费和错误分类，未改expected或helper identity。

## 发现全量处置

### G2OWN-RV-001 / P1 / CLOSED：逐通道返回与通知独立核验

旧问题是跨通道合并去重，导致020/021/022/023的返回数组丢失被正确通知掩盖。当前已移除该验收集合，以下为实际源码及负例验证：

| 通道 | 实际冻结消费 | 验证 |
|---|---|---|
| result | `assertResultChannel`要求数组类型、精确长度、按位原Error引用与顺序；020=[setup]，023=[setup,notify]；ready后operation场景的原始ready结果=[] | 020漏项/重复/克隆Error、023漏setup/倒序、022错误污染原ready结果均被对应result断言拒绝 |
| failure | `requireExpectedFailure`逐位检查`failure.cleanupErrors`，021=[setup]；仍核对failure_code及originalError/cause原引用 | 021漏项/重复均拒绝；没有再从通知补齐返回错误 |
| operation | `applyOperations`调用后立即检查每次返回，并保存独立快照；`assertOperationChannels`再次核对操作次数、身份与各数组 | 013 operation[3]=[bad]；018 operation[1]=[destroy]、第二次dispose=[]；022 operation[1]=[bad]；其它操作=[]。丢错误、重复dispose返回错误、remove意外错误均拒绝 |
| notification | `assertNotificationChannel`从冻结notify事件投影出通知目标，独立比较callback次数与batch数组原引用/顺序 | 缺错误与重复callback均拒绝；023的notify异常只进入返回结果，不伪造第二次通知 |

`assertErrors`用`assert.equal(errors[index],errorFor(id))`比较对象原引用，而不是message字符串或重新创建的同内容对象。数组长度明确比较，不能再通过去重吞重复。通知保存在独立batch，result/failure与operation各自检查，不能跨通道替代。

对013/018等同根残余一并核对，未只修020–023。ready结果在操作前检查并复制返回时点观察，后续操作不被错误并入此前ready结果；这符合既有合同的时序，不是新修改expected。原R012同根前置在此范围解除。

### G2OWN-RV-002 / P2 / CLOSED：双 attempt 未知执行错误优先

当前017先收齐A/B的结果，再调用`propagateInvocationErrors`。未知执行错误在全部reject中先查找并原引用throw，早于stub投影；已知非stub合同/断言失败也不会冒充精确NOT_IMPLEMENTED。

自测与Validator独立探针分别验证A=stub/B=TypeError、A=TypeError/B=stub，均确认两个调用完成、原TypeError引用保持、分类EXECUTION_ERROR。双stub控制确认仍精确返回017的冻结fingerprint。正式RED生产源码是同一无条件reject stub，23例/24次调用的RED保持可信。

### 新增阻断与非阻断发现

**无新增阻断。** 当前18项绑定材料、所有相关摘要、实际函数调用链和定向负例足以判定上述两项已修复。没有把未实现helper当作准备阶段缺陷，没有以当前合同外的额外并发矩阵或新产品场景阻止有界实现。

继续保留既有非阻断/后续义务：

- Design终审G2OWN-R013：line missing/null/non-array输入的实际可达性及兼容行为仍待组件阶段验证；不阻断独立helper实现，不在此改Cases。
- G2OWN-027仍`OPEN / NOT_FIXED_BY_THIS_UNIT`：create/installer返回句柄前partial allocation由后续stage owner负责；本轮无关闭证据。
- 尚无真实SFC harness/组件RED及独立验证，普通line组件接线依然`BLOCKED / NOT_READY`；本报告不扩大helper准入至组件。

## 已检查域与未检查原因

已检查：原始Goal及MVP-first边界、全部当前18项绑定输入、23稳定case identity、真实生产TS bundle/import、同mode业务oracle不换expected、case循环不中途短路、各phase/deferred及scope身份断言保留、错误返回/通知独立性、错误对象引用/数量/顺序、manual dispose与repeat dispose、remove重入、双attempt分类、全部17负例/15正向及双stub、原始/新日志、admission引用、Producer/Validator角色、写域与组件/stub/Design/Cases未改。

两个runner修复admission按实际builder action及runner/evidence target重跑通过；引用摘要匹配。此次是验证lane，不冒用Builder admission写产品源码。identity中的首次写前校验仍是Producer记录；本次独立复验确认当前admission有效及记录时序，不扩写成宿主首次写入强制执行证明。

旧r001 stdout/stderr/exitcode/identity及r001独立报告字节保留；当前活动组件仍为`e9429bf59915e5a23d4f9d70987b126ca8b8329863be3208c625367e71f607e5`，与写前baseline一致。Design r003、Cases r002/r003、Goal亦与各自冻结摘要一致。

未检查：helper真实实现/生产GREEN（当前仍stub）、C01–C06真实SFC控制流、G2浏览器、tooltip/legend/resize、MVP copy/paste与保存重开、query/Store原子提交、真实多用户权限、完整Goal closeout。这些在本轮卡外或尚未进入实现阶段，均保留未验证；诊断transcript只是验证oracle拒绝能力，不证明生产业务行为。

KB/Dashboard分层保持：本报告属于执行证据，未写canonical产品知识。共享Dashboard/Session状态吸收和Loop Stop Gate由Orchestrator后续执行；本lane不宣称Goal终态完成。

## 新精确 source admission 条件与修复后预测

1. **本次工具修复无需再返工。** 可冻结runner `0155a4e0...`与本报告、新RED identity；旧r001证据继续保留。两个已关闭finding不再作为helper实施阻塞。
2. **可立即准备并消费新的helper source admission。** 绑定当前Goal、Design r003/独立终审、Cases、当前Context、实际独立Builder topology，以及本报告/新RED证据；action=builder，canonical target仅为`core/core-frontend/src/views/chart/components/views/components/g2-render-attempt.ts`。当前stub摘要必须仍为`ee4a86b2...`。缺少/过期/任一引用漂移或目标扩大时fail closed并重建绑定。
3. **Builder只替换stub实现已冻结helper合同。** 不改runner、Design、Cases、Goal、旧日志或组件；若要新增测试/组件接线，按该专属写域另行准入。现有修复admission不能当作helper实现授权复用。
4. **实现验收独立进行。** 使用同一冻结runner和23 case identity跑GREEN；独立Validator核对生产代码、完整差异、23/23真实GREEN、必要定向检查及未覆盖项。自测诊断控制、可信RED或本入口许可不替代该验收。
5. **组件与完整产品层保留门槛。** 按已终审Design r003建立真实SFC harness、可信baseline RED与独立验证后，再签发组件target admission；之后真实浏览器/MVP/保存重开/权限按各自证据验证。不得借本报告重开Design第4轮或关闭G2OWN-027、原10/26/16分母。

**最终结论：runner修复通过、生产RED可信，具备新helper source精确admission的证据条件；helper实际实现与GREEN尚待独立Builder/Validator执行，普通line组件、MVP、权限及完整Goal未被本报告验收。**

## 当前绑定输入复核

| 输入 | SHA-256 |
|---|---|
| `AGENTS.md` | `270940a30f462f2fb0c9a8cf2bbc1dd11750513d8f063ffc376e0e0a2640466e`，匹配 |
| `.codex/skills/sge-governed-checkpoints-sp010/SKILL.md` | `b3e5d00193f88608e8deb3214071444ce89fa66431daf115b35f72fedbecbe3f`，匹配 |
| `Goal.final.json` | `28c94d3c35d4ce0a891ce77ecc915932d67f88ef813f3d2815dc0dce11f91b64`，匹配 |
| `planning/MvpFirstAuthority-20261025.json` | `a5b00d1678a7543e654c1b9eb07e77fe36f6810ab025f473d59ccd64b5979342`，匹配 |
| `G2StageLifecycleOwnershipDesign-r003.md` | `ab6aa597e06199bc947ff82f1b16f2955fe22e9e7210ac5bc2301e2b92295761`，匹配 |
| `G2StageLifecycleOwnershipCases-r003.json` | `b8844f51bed1f0574215210003ad1d59831c75635f9b0b6ed091baf3b78bbfe7`，匹配 |
| `G2StageLifecycleOwnershipCases-r002.json` | `f4348c739094943db73872ebc974d9b5048186d627c5022df2fa9c33d5fd2bba`，匹配 |
| `reviews/G2StageLifecycleOwnershipDesignReview-r003.md` | `c386d4ad6ab5fc55c4bfa276b8dbcee9afb85e464cc136b1cbb9e9b5871163aa`，匹配 |
| `reviews/G2OwnershipRedValidation-r001.md` | `81e6de5d6c67a55821559eb9d3091833b46d003fd1d4e81005ccb53ad4a3d3f2`，匹配 |
| `core/core-frontend/tests/g2-render-ownership/check.mjs` | `0155a4e0e0a9dac40046c044b21410d4121b1177542604d48fb5e43a1d01d21f`，匹配 |
| `core/core-frontend/src/views/chart/components/views/components/g2-render-attempt.ts` | `ee4a86b213973ae00345fe079000454085c72af8c48a2725cdda454c1b8fb3ed`，匹配 |
| `planning/evidence/G2OWN-RED-r002.stdout.txt` | `e8f39a2544dab3ac06fa56b356199e2593e2c272a14baf88967e8dcb7ba2484b`，匹配 |
| `planning/evidence/G2OWN-RED-r002.stderr.txt` | `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`，匹配 |
| `planning/evidence/G2OWN-RED-r002.exitcode.txt` | `4355a46b19d348dc2f57c046f8ef63d4538ebb936000f3c9ee954a27460dd865`，匹配 |
| `planning/evidence/G2OWN-RED-r002.identity.json` | `c2bdaf2ada822f8232379101d27c160aa66bd6f64d5fda641d0a1fc1ea767e4d`，匹配 |
| `planning/evidence/G2OWN-RunnerRepair-r001.md` | `2bae9bf46e1002e6e4214294ded1e300e0462a225095744f39e29f72528ff26d`，匹配 |
| `planning/g2-ownership-runner-repair-r001-admission-0.json` | `97ec8d9ad8c30a8c5d8c4f06e26f684af848e9fd1d577369d09ce872a2d4a070`，匹配 |
| `planning/g2-ownership-runner-repair-r001-admission-1.json` | `21d5a1fa4842d493dcf0d1349418f77e9be784bea90efe3066cca0334d90a2b2`，匹配 |
