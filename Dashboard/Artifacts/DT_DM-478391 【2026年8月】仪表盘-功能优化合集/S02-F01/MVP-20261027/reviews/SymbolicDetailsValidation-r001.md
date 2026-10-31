# 符号地图代表明细过滤实现独立验证 r001

- reviewed_at：2026-10-30T04:29:29.188153+00:00；reviewer/source：`/root/local_basemap_reviewer`，非本切片生产/测试 Builder。
- snapshot_id：`S02-SYMBOLIC-DETAILS-VALIDATION-r001`；as_of_state：Handoff-r001、冻结测试、精确写前/当前 Handler、RED/GREEN 和 scope diff 已落地，Topology-r522；本报告审的是局部源码与合成 H2 见证，不是整个 Session/Goal 最终收尾。
- 本后端实现独立验证 **第 1/3 轮**，不重计其他交付物或 C2 预算。
- 接收端 card canonical SHA `8323a3401c4bcb09602bf045ee790060dd197e77ea7cc30f3aa0c0efb7664719`，本地 validate exit 0/PASS；Goal+12 base refs 共13项摘要一致，写报告前复验未漂移。
- 只写本报告和允许的 tmp 验证产物；未改生产/冻结测试、未写 target/jar/SDK、未运行 Maven、未安装依赖、未启动/停止服务、未操作真实 DB/UI、未读取凭据。

## 裁决与结论

**局部实现独立验证：PASS WITH FINDINGS（有界通过，保留非阻断证据限制）；新增产品源码 blocker：0。设计原两项 P1 在本局部见证边界内关闭。真实后端/MySQL/权限/UI 修复验收：未完成。**

独立编译并复放精确写前 RED，得到 **1 PASS / 10 语义 FAIL / 0 execution error**；独立当前 GREEN 为 **11 PASS / 0 FAIL / 0 execution error**。两侧聚合 oracle 全通过，无过滤正对照通过，RED 的其余10例均暴露明细 ID/过滤元数据遗漏；GREEN 消除这些差异。双方使用相同 Cases、Java test、runner、同批依赖；七个关键生产源真实编译到新 tmp classes，fetch 实际执行收到的 H2 SQL，不按 expected 补过滤。

实际生产修改精确为一行 `BeanUtils.copyBean(sqlMeta2, sqlMeta1)` 和注释。删除这两新增行后，当前 Handler 原字节等于冻结 before（SHA `531eb7bf7424065622574986f471d5bf55010e12dd5247c8d8c3e89268d434dc`）；当前 SHA 为 `75d6020f776e2983f47daba83f7adc717e34c042e34ecdda3f7413430da5e28a`。原 table 重建、投影、聚合和代表组装未变，未发现需要扩大生产补丁的缺陷。

此结论支持“局部源码修复及合成 SQL/代表语义见证已独立通过”；不能写“旧8100服务已修复”。本卡冻结时8100仍是旧jar；本lane没有重新测量服务当前状态，后续构建/替换/启动即使另获准入，也不在本报告自动覆盖范围。38项义务、49类型分母、0/49完整类型、真实权限BLOCKED/NOT_RUN及原ubo等残余不提升。

## 独立执行与可追溯证据

独立工作根目录：`/var/folders/l1/r6bpxxvj087bgky2q98zlqvh0000gn/T/s02-symbolic-independent-validation-mu6lrepv`。RED/GREEN 分别用冻结 runner 的 `--case-file` 与独立 `--output-dir` 执行；RED 另外指定冻结 before 的 `--handler-source`，GREEN 使用当前 Handler。没有替换冻结文件或调用真实业务服务。

| 独立复放 | 写前 RED | 当前 GREEN |
|---|---|---|
| 临时执行目录 | RED/run-5ilyjojy | GREEN/run-ehem5ge1 |
| javac / java exit | 0 / 1（预期语义失败） | 0 / 0 |
| pass / semantic fail / execution error | 1 / 10 / 0 | 11 / 0 / 0 |
| manifest SHA | `73a5f1109a189cd0e42a3487597276739ef67ed7d98d1a0e2ddbc0c33f12d811` | `11898f5725085260b78c9a2d3dc82fa317dd514271c81fab2b17de0f127101c6` |
| 独立结果 wrapper SHA | `c706b4d43c5ff2a10efdf053995292bb03e5aec9f2bdeadc4dd947f8ed3a5075` | `31b9cc8e140d9fa5f6f55747843a707c210b9e6eb505cd1273e1d33dd6093147` |

独立 manifest 两侧分别与仓库 durable evidence 的 manifest **字节摘要一致**；逐案解析后的完整 result（包括生成 SQL、预期/实际 ID、聚合与全部 checks）也分别相等。不能据此说所有 stdout 字节相同：Java Map 序列化顺序会改变 stdout 字节，而完整 JSON 对象比较一致。原始 stdout/stderr 均保留，不用归一化结果替换冻结原件。

Java 为 OpenJDK **21.0.12.1**；每侧从当前已存在 CoreApplication.jar 提取 **292** 个已有库，编译 Handler、SQLProvider、Field2SQLObj、Table2SQLObj、Dimension2SQLObj、Quota2SQLObj、ChartDataBuild 七个实际源文件，并编译同一冻结测试。临时新 classes 在 classpath 最前，没有以旧 Handler 冒充当前实现。

编译 stderr 有注解处理、deprecated/unchecked 提示，运行 stderr 有 Mockito self-attach 提示；两者 exit 均按上表正常，不能写 stderr 为空。独立 run.stderr SHA 为 `0f13ab32070e70931b9c7e2e7799286ce5806d92df6ec48b44675d082c0728c7`，compile.stderr SHA 为 `7f5c9c455d4248d5746221ce285fcf50fcafc871823b046499b5f24c4fc92a77`。

### 同 JVM 来源绑定与补充断言

为补核 classpath 的实际来源，本 lane 仅在 tmp 创建来源探针；`bound-green.stdout` 在**同一 JVM**记录14个关键类的 CodeSource/字节摘要后，再调用原冻结 runner main，仍为11/0/0。该文件 SHA：`17586bdd87f26486a64df90fa88b389f6c506c27efc2c1047cad2f3589b61aca`。

- 七个重新编译生产类来自独立 GREEN 的新 classes。
- Provider、SQLMeta 来自提取的 extensions-datasource-3.2.0.jar；BeanUtils 来自 common-3.2.0.jar；FieldUtil 来自 extensions-view-3.2.0.jar。
- Utils、GroupChartHandler、DefaultChartHandler 来自既有 target/classes；是已声明支持依赖，没有冒称它们全部本轮重编译。
- 实测 Provider class SHA `d7a74ff140f148b36773d2ed2a05f3c00ef7ba3ef50036a3e6202436714e504c`，SQLMeta `6bebca9884af61ad9a424c0fb93ca3ada77cc6e20106bc40961a5e0dd569423e`，BeanUtils `0abba75123ec29121167d45af53ee4ac210137276ae99d0247a56014adc5e99a`。目录来源与关键字节见完整探针记录；不借这些摘要倒推历史支持类必定未变。

另在 tmp 复制测试源，**只增加代表 shop/org 必须与选中原始行相同的断言**；不修改冻结测试/生产字节，复用已编译当前生产类，额外11例仍全部通过。补充源 SHA `8cd4b8ab92654caad3a9d1a06e619a3a22756fb228dcb22afa0a5c580799e34c`，`supplemental.stdout` SHA `6cbb02b5a9a3eed81cafbf84cf1a46515d375254f46a5a3de94272edc9e3d29e`。该补充运行与原同 identity GREEN 分开记录，不替换原结果。

## 原设计 P1 处置及逐例核验

| 设计发现 | 本次独立检查 | 处置 |
|---|---|---|
| SDF-R1-F1：≤1 真空通过 | test:157 要求每个非空输出组恰1代表，:160–163检查代表ID属于匹配集合、坐标属于同组、amount为聚合；:168用顶层组集合与预期比较，空case不得输出组；独立补测shop/org原值 | **局部关闭**，不固定无序查询的 first ID，不改全量明细语义 |
| SDF-R1-F2：dialect/cross/seam 掩盖 | test:103–119使用901/902/903三独立占位与map；:95–96两个dsMap条目让实际Handler进入cross；:130 cross直接return SQL；非cross调用真实Provider table/calc helper；:138只执行所收SQL | **局部关闭**；不声称外部方言连接或真实跨库已通过 |
| SDF-R1-N1：参数/命名/真实权限 | 命名仍为声明no-op；三类WHERE是合成输入，真实参数/权限构造未运行 | **边界保留**，不由H2覆盖原始复杂合同 |

本 lane 再次独立按六行及三个谓词计算匹配集合/坐标聚合，与冻结11例一致：

| case | 独立匹配ID | 两组金额（10,20 / 30,40） | 写前 / 当前 |
|---|---|---|---|
| SDF-000 | 1,2,3,4,5,6 | 2400 / 1700 | PASS / PASS |
| SDF-001 | 1,3,4,5,6 | 2300 / 1700 | 语义FAIL / PASS |
| SDF-002 | 2,3,4,5 | 1400 / 800 | 语义FAIL / PASS |
| SDF-003 | 3,4,5 | 1300 / 800 | 语义FAIL / PASS |
| SDF-004 | 2,3,5,6 | 700 / 1700 | 语义FAIL / PASS |
| SDF-005 | 3,5,6 | 600 / 1700 | 语义FAIL / PASS |
| SDF-006 | 2,3,5 | 700 / 800 | 语义FAIL / PASS |
| SDF-007 | 3,5 | 600 / 800 | 语义FAIL / PASS |
| SDF-EMPTY | 空 | 无组 / 无组 | 语义FAIL / PASS |
| SDF-DIALECT | 3,5 | 600 / 800 | 语义FAIL / PASS |
| SDF-CROSS | 3,5 | 600 / 800 | 语义FAIL / PASS |

RED所有11例 aggregate_oracle=true；SDF-001的代表碰巧有效但明细完整ID集合/过滤元数据仍失败，说明检查没有退化成只看代表。SDF-EMPTY顶层无组却仍查询出全表明细的旧问题也由Provider层ID检查捕获。GREEN中三映射与片段继承、输入filters/maps未污染、每次两条内部SQL均成立；这**不是两次前端getData**，不能混同已有“1逻辑query”计数。

## 全部发现、严重性与处置

### SDV-N01｜P2 非阻断：支持 classes 仅冻结路径，历史 provenance 不完整

runner manifest 记录七源和292个库摘要，但 support_classes 只有目录路径，没有目录内实际依赖 class 摘要。因此“两侧 manifest 相同”本身不能保证两个历史时点 target/classes 内容相同。当前本 lane 的同 JVM 来源探针补核了实际本次加载的关键 class 字节并成功执行，足以支持本次有界复放；没有假装补出了原生产者历史字节。

后续若把该 runner 提升为独立可搬迁/长期验收入口，应绑定实际使用支持类或有版本的支持包，不能只存目录名。当前局部生产补丁没有依赖改造这些类，且独立当前执行成立，不要求为本发现修改已冻结资产或重做产品代码。

### SDV-N02｜P2 非阻断：原始字段完整性补充断言尚未进入冻结维护见证

冻结测试本身逐案检查 ID、同组、amount，但没有比较每个代表shop/org等非聚合值。本lane的独立补充已对当前六列fixture核shop/org，并全部通过；不存在本次实际字段错误证据。若以后维护回归见证，可在新版本中纳入这些断言；不能把这项未来增强写成当前已冻结test原来就包含，也不重写本次同identity证据。

### SDV-N03｜P2 非阻断交付限制：测试入口依赖本机已有打包依赖，且新测试未被Git跟踪

本轮 Java test 和 Python runner 均存在且已摘要冻结，但 `git ls-files` 证实它们尚未受跟踪；没有统一 Maven 测试入口集成。当前只声明本机明确命令下的H2验证，成立；后续若进入提交/PR，应按路径把实际测试源、runner说明及所需合同证据纳入交付，避免忽略规则导致只提交产品一行而丢测试。不能把普通 mvn test 或编译成功当作这11例已经执行。本lane未替Builder暂存/提交。

问题一次列全，未在首个限制提前结束。**Blocking：0；Builder生产修复要求：无；需要用户新authority的问题：无。** 上述是证据/维护边界，不是要求把局部补丁扩成构建、权限或通用SQL框架。

## 已检查无问题维度、同类残余与未检查

**已检查无问题**：全部绑定摘要和freeze嵌套refs；before/current精确差异与scope patch；复制方向；pre-axis状态避免聚合轴/排序污染；现有Table2SQLObj固定别名及重建；Field2SQLObj新建自身投影map，Provider helper不就地改三filter maps；11例独立oracle、无过滤/空集/三片段全部组合、真实占位替换、cross内联SQL执行、恰一同组代表、聚合amount和额外原字段保持、原input未污染；H2只执行所收SQL而不使用expected修正；生产者与独立结果完整JSON一致；七源与支持类来源分层；warnings保留；目标git diff --check exit0。

实际builder admission与test-freeze admission已按各自精确action/target独立只读重验，均exit0，Goal/合同/context/design/topology摘要有效。该重验支持当前材料绑定合法，不伪称本lane亲眼观察了历史每个写前工具消费时刻。没有把未来源码构建admission当成本轮H2证据。

**同类残余**：上一轮有限静态检查未在map目录发现第二个同模式明细新SQLMeta漏继承点，不把它提升全仓清零。指标HAVING、真实参数override、计算/分组字段、列名重写、供应商方言、无序代表选择、count气泡、分页/限量、导出/分享/嵌入、多用户行列权限/脱敏、原ubo与flow/heat稳定重开仍各按原合同核验，不从本补丁推断修复。原C2三轮预算保持耗尽，不将新后端切片作为重开入口。

**未检查及原因**：没有完整Maven构建/测试入口或所有SDK源码重编译，没有启动Spring、真实MySQL/跨供应商/权限与拒绝路径，没有验证新后端实际加载、原CMV-N02场景修复后的HTTP/UI/正常save-reopen，没有审整个dirty工作区其他任务的产品修改、49类型全部AC或Goal最终closeout。原因是卡限制只读source并允许tmp/H2；这些运行及最终证据尚非本快照交付。独立origins补充仅证明本次实际加载字节，不等于所有历史target/classes源码等价或生产发行验证。

## 后续准入预测与声明上限

该最小补丁可作为已独立通过的局部源码候选继续进入已授权的源码构建与隔离运行验证，不需要再修改产品修复行或重复要求相同人类授权。构建/资源移动/实际服务加载必须使用自己的绑定准入；若后续改变源码、依赖、claim或运行目标，应按影响补验，不能把本报告自动绑定未来产物。

下一有意义证据是：实际加载由源码构建的新后端后，用既有六店/阈值条件确认顶层金额不变、三个details代表属于匹配组、amount仍为聚合，再补正常保存重开与独立相应运行验收。当前8100旧jar的已有响应不会被本H2结果追溯修正；旧ubo仍不能归因或关闭。

本报告不是S038/Goal最终审阅，没有实际最终closeout/完整KB-Dashboard/full-diff/post-closeout reconciliation及允许终态的最新receipt，故不作final-state binding或Goal完成声明。所有38义务、49类型原分母保留。只有本局部H2/源码层的独立验证为有界通过。

## 正向阅读清单与输出保全

已读：本地SGE kernel/validation recipe和写前边界（沿用本lane已读）；卡/render prompt、Goal范围与原分母、Design/Cases/DesignReview、TestFreeze及before、当前Handler、完整测试Java与runner、Handoff、RED/GREEN JSON/manifest/stdout/stderr、scope patch、Topology-r522；沿既有读链复核SQLProvider/Field2SQLObj/Table2SQLObj/Dimension2SQLObj/Quota2SQLObj/ChartDataBuild、Provider helper、SQLMeta/BeanUtils及相关调用边界。补读两个历史精确admission并验证其refs；看到后续source-build admission但未将其结果纳入本轮结论。未修改已有Dashboard/KB/证据/产品文件。

输出前确认13个绑定输入未漂移，required output原不存在；只新增本报告。临时重放和补充源完整保留在上述tmp目录，目录可能被系统清理；仓库已有原始RED/GREEN及其日志/manifest仍是durable evidence。报告应由根Agent按实际摘要绑定，下游状态不能回写本审阅时点事实。
