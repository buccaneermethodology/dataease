# 符号地图代表明细过滤设计独立审查 r001

- 审阅时间：2026-10-30T04:08:33.699686+00:00；reviewer/source：`/root/local_basemap_reviewer`；Session：`DE-EXEC-S038`。
- 本后端交付物独立设计审查 **第 1/3 轮**；不重计底图、Bubble 或已耗尽的 C2 审查预算。
- 接收端本地 `lane_task_card.py validate`：canonical SHA `f8ed99eb5e77667328eb305ac481fdc17c48699ac4a7e9264e1a549e77f10783`，exit 0 / PASS。Goal + 12 base refs 共 **13 项** SHA 全部匹配；写报告前再次复验未漂移。
- 本 lane 按项目 SGE Semantic Review recipe，检查 Boundary 与 Implementation Entry；仅写本报告，未改生产或测试源码、未编译 Java、未连接 DB/供应商、未操作 UI、未读取凭据。对冻结合成数据进行了内存独立复算，不能把它称为 Handler RED/GREEN。

## 双裁决

**Design Freeze Validity：PASS WITH FINDINGS（局部修复设计有界通过，保留见证完善项）。Implementation Entry Readiness：分阶段；测试见证准备 PASS，生产源码修改尚未准入（缺可信 RED、冻结见证与精确 write admission）。Overall Verdict：PASS WITH P1 FOLLOW-UP。**

原始故障、修复方向及生产写域成立：在 `SymbolicMapHandler` 新建明细 `sqlMeta2` 后、Table2SQLObj/Field2SQLObj 前，复制现有的轴变换前 `sqlMeta1`，保留三个 WHERE 片段及三个 dialect map。可以开始构建和冻结局部回归见证。以下 F1/F2 应在可信 RED 建立前落实，不要求扩成全局 SQL 改造或先修 L7；本报告没有授予生产写入，也没有预判 RED、GREEN 或未来 UI 成功。

38 项义务、49 个内置类型的原分母完整保留；本切片只能为相关过滤正确性提供有界证据，不能提升完整类型、真实权限、MVP 或 Goal 完成。设计引用 AC-MVP-F01-08/-09/-12；卡 -06/-08/-12 是关联而非全部完成声明，尤其 -09 保存重开仍需加载新后端后另验。

## 已核实的触发与根因链

1. 冻结事件 #35 `symbolic_target500_after_paste` 的真实响应包含三个顶层金额 1982、1243、1868，details 代表 ID 为 3、2、1；对应代表店名果元店、蓝墨店、欢果店。结合已有独立报告 CMV-N02，后两者不满足六店过滤，而代表 amount 已被覆盖为顶层聚合。这证明顶层正确不能推出明细身份正确；本 lane 没有重新读取原 CSV 或重新发起 runtime。
2. `ChartDataManage.java:485–503` 在创建 SQLMeta 后设置 customWheres、extWheres、whereTrees 与相应 dialect 映射，再传给 Handler。正常内置 symbolic 入口尚未写入聚合轴。
3. `SymbolicMapHandler.java:70–71` 已在轴变换前复制到 sqlMeta1；:72–82 的聚合查询使用原 sqlMeta，因此已有过滤。:97–102 的明细新 SQLMeta 只建 table/fields，随后使用 SQLProvider 的非聚合 overload；没有过滤就不会重新从 view 补出过滤。
4. `SQLProvider.java:39–76` 仅合并 meta 中现存的 custom/ext/row 三片段；`Provider.java:147–157,212–239` 非跨源才做 dialect/table/calc placeholder 替换，跨源直接返回已内联的 SQL。修复必须同时继承片段与映射，不能只抄 WHERE 文本。
5. `ChartDataBuild.java:2012` 的 transSymbolicMapNormalWithDetail 先按 xAxis 坐标/分组键归并明细，再选第一条代表，并将气泡度量替换为聚合值。每组一个代表是现有输出规则；本修复不改为全量明细、不把 amount 改回该代表的原始金额，也不规定无 ORDER BY 时代表必须为某个固定 ID。

## 全部发现与处置要求

### SDF-R1-F1｜P1 非阻断设计、可信见证前必须落实：≤1 不能证明代表未丢失

**依据**：Design:24 与 Cases.invariants 写“代表 ID 属于匹配集合；长度≤1”。对空 details 列表，长度与全称成员断言都可以真空通过；Provider 明细 ID 集合正确也不能单独证明 ChartDataBuild 最终正确把每组代表放入响应。

**最小反例**：两组聚合和 Provider 明细集合都正确，但最终每组 details=[]；只检查 `size <= 1` 和“遍历现有代表均在集合”会通过，与当前“每组返回第一条代表”的目标不符。

**处置**：在冻结局部 runner/断言时，对每个存在匹配原始行的非空聚合组要求 **details.size()==1**；代表 ID 必须属于该组同谓词匹配行，而非仅属于全表匹配 ID；代表的原始非聚合字段保持该行值，amount 等于该组聚合。对于 SDF-EMPTY 则要求顶层无组且没有代表。仍不固定无序查询的 first ID，不增加排序产品需求。

**状态/准入**：测试见证准备可继续；获得可信 RED/GREEN 前需要落实。这是把原有“每组一代表”变成非真空断言，不新增 AC，也不需扩大生产补丁。冻结 Cases 原字节应保留，见证解释可进入本轮 runner/handoff；若变更 Cases，须新版本绑定，不让 Builder静默改 golden。

### SDF-R1-F2｜P1 非阻断设计、可信见证前必须落实：固定方言与跨源 seam，避免测试替身补出正确 SQL

**依据**：SDF-DIALECT 和 SDF-CROSS 现在由布尔字段描述；Design:22 明确允许 Provider 外部边界 seam、真实 placeholder helper，但没有落地 runner。两者在生产中行为不同：非跨源依赖三个 dialect map；跨源条件表达式已内联，Provider.rebuildSQL 直接返回 SQL，不再做 placeholder 替换。

**风险**：替身若按 case.expected_ids 返回数据、根据 SQLMeta 在 fetch 时额外过滤、重新从 case 条件生成 WHERE，或在 cross 分支仍强制调用替换 helper，都可能产生合成通过，掩盖 Handler 丢过滤或运行分支错误。

**处置**：在写前源码上建立 RED 前，冻结实际 SQL 片段、别名、三个非空且可分别识别的 placeholder→expression map、seam 代码与依赖加载来源。非跨源使用真实 helper，验证 table placeholder 和三组计算字段映射得到实际可执行 SQL；Provider 收到的三组 map 内容必须正确，且执行后原输入不变。cross case 必须让 Handler 实际选择 cross 分支、使用一致的 dataset.isCross/dsMap，并执行内联 SQL；不拿同源 query 换一个布尔标签冒充跨源分支。SQL 执行结果来自 H2 当前 query，expected_ids/aggregate 只用于最终比较，不参与 fetch 或重建。

**状态/准入**：目前没有证据显示替身已经违规，也没有因此否定最小生产设计。该项是随后可信 RED 的实现前置；无需修改 ChartDataManage、SQLProvider 或供应商实现。固定 runner 若只能跑通断言替身，应标测试能力缺口而非 RED；真实供应商 dialect 转换和跨源连接仍不在 H2 证明范围。

### SDF-R1-N1｜P2 声明澄清：参数、列命名和真实权限只保留既有传递边界

既有 Field2SQLObj 明细调用把 chartParam 传 null；ChartDataManage 创建过滤时已经把相关参数展开进三个 SQL 片段/map。复制可保留这些既有展开值，但 11 例没有 chart 参数 override、DatasetDataManage 真实列名重写或真实权限服务的完整 fixture。故不可把合成片段继承写成“参数化计算字段、别名变换及全部权限行为均已验证”。局部 runner 的 mock 命名需保持固定表别名/字段契约，参数/计算字段/真实权限仍按原合同另验；不要求本补丁额外修参数体系。

**状态**：非阻断；设计 :30 已保留计算字段/方言/真实许可残余，本报告明确其证据上限。若随后真实反例证明继承片段与重建字段不相容，按设计停止相应 Builder 并提出具体 delta，不能让 seam 悄悄改写它们。

以上为本轮全部发现，没有另一个阻止局部修复方向成立的设计 blocker。尚无 RED、runner 或实现是当前阶段事实，不当作既有产品修复或测试通过。

## 已检查无问题维度

- **复制方向及属性完整性**：项目 BeanUtils.copyBean(target,source) 内部调用 Spring copyProperties(source,target)，方向应为 copyBean(sqlMeta2,sqlMeta1)。SQLMeta 除 table/axis 外包含 custom/ext/row 字符串及三个 map，整体复制可避免手抄遗漏。当前真实内置入口的 pre-axis 副本没有聚合 yFields/yWheres/yOrders 或新增 xOrders；从聚合后的 sqlMeta 复制则不具有相同保证。
- **浅复制边界**：Dimension2SQLObj/Quota2SQLObj 为聚合创建新列表/map 后 setter 替换；Field2SQLObj 也创建新 xFields/xFieldsDialect。Table2SQLObj 创建新 SQLObj 并 setter，不就地改原 table；Provider.replaceCalcFieldPlaceHolder 创建局部 combined map，不写回输入三映射。当前调用链未发现浅拷贝导致原 filter map 被污染的路径。测试仍应比较 before/after 内容，不能要求 shared-reference 本身必定不同。
- **表别名/重建**：两次 Table2SQLObj 都用 TABLE_ALIAS_PREFIX 的固定 `t_a_0`，继承的条件与新投影在当前路径对应。非跨源 tableDialect 会按原路径重建；Field2SQLObj 仍投影完整 detailFields，避免把聚合字段误混入非聚合 SELECT。DatasetDataManage.buildFieldName 只改 FieldUtil 转出的 DTO，FieldUtil 为每个字段新建 DTO，未见它回写原 SQLMeta 三映射。
- **过滤组合**：非聚合 SQLProvider 原来就以 AND 合并三类片段；WhereTree2Str 内部自己的 OR/AND 结构由原字符串携带，复制不重新解释权限规则。无过滤的 null 片段仍为 null；不生成平行过滤协议。
- **参数与请求载体**：三个 WHERE 已在上游按现有参数规则形成；复制不重新求值。fillDatasourceRequest 在聚合/明细均保留 dsList、isCross 和复制的 tableFieldWithValues，局部新增 copy 不更改该传递。没有将此静态保留写成外部参数和供应商运行已验证。
- **代表/聚合语义**：修复没有改 ChartDataBuild、DTO、字段顺序、聚合金额、每组一代表、正常自定义排序或已有 group key。用于 SQL 漏过滤的 oracle 必须检查 Provider 实际明细集合，不能只看最终每组一个代表，因为首代表可能碰巧符合过滤。
- **边界与落点**：只改 SymbolicMapHandler 局部是当前最小路径，不依赖改 L7/C2、通用资源机制、鉴权替补、XPack、SDK 或元数据库。新增 H2 见证不授权修改 Surefire、安装依赖、搬产品二进制或热补运行 jar。
- **阶段语义**：设计 → 写前源码上的可信 RED → 冻结 identity/准入 → 局部生产修改 → 同 identity GREEN → 独立验证 → 新源码后端实际运行/UI 的阶梯明确。Java 编译或 H2 通过都不代替当前 8100 已加载新实现。

## 11 例独立数据 oracle 复算

本 lane 直接按固定 6 行、三个独立谓词（amount>threshold、shop=included、org=A）筛选并按 lon/lat 求和，不读取被测 SQL 结果生成 expected。11 个 expected_ids 与 expected_aggregate 均一致：

| case | 匹配 ID | (10,20) 金额 | (30,40) 金额 |
|---|---|---:|---:|
| SDF-000 | 1,2,3,4,5,6 | 2400 | 1700 |
| SDF-001 | 1,3,4,5,6 | 2300 | 1700 |
| SDF-002 | 2,3,4,5 | 1400 | 800 |
| SDF-003 | 3,4,5 | 1300 | 800 |
| SDF-004 | 2,3,5,6 | 700 | 1700 |
| SDF-005 | 3,5,6 | 600 | 1700 |
| SDF-006 | 2,3,5 | 700 | 800 |
| SDF-007 | 3,5 | 600 | 800 |
| SDF-EMPTY | 空 | 无组 | 无组 |
| SDF-DIALECT | 3,5 | 600 | 800 |
| SDF-CROSS | 3,5 | 600 | 800 |

8 种开关组合各不重复，空结果是第 9 例，dialect/cross 是第 10/11 例。该复算验证合同 oracle 的内部数据语义，**不是执行 Handler 的 11/11 通过**，也不证明真实 rowPermissionsTree 构建、权限 allow/deny、MySQL 或 Calcite 跨库连接。

可信 RED 预期仍为 execution_ok + aggregate_oracle_pass + 明细 ID/映射不匹配 + 无过滤正对照通过。SQL 语法错、依赖缺失、类加载旧字节、mock 未初始化不得冒充 RED。SDF-EMPTY 必须检查 Provider 原始返回集合为空，不能因最终顶层为空而漏掉实际明细全表查询。RED 时可有多项预期失败，不要求所有例子都失败或把正常对照改为失败。

## 最小下一步、准入预测和同类残余

1. **最小下一步**：在既定局部测试写域准备 runner 与说明，落实 F1/F2，绑定 11 例身份、源码/依赖加载来源及可复现命令；保持 frozen Design/Cases 原字节。可以使用已安装 Java21/jar/H2，源码编译输出到 tmp；不为测试成功静默安装或扩写域。
2. **生产修改前**：在精确写前源码及真实 SQL 生成/结果组装上得到可信 RED，保留无过滤正对照、失败指纹、runner/fixture/source 快照，再消费绑定该设计和精确 SymbolicMapHandler 目标的 admission。当前这些证据未产生，不能直接启动生产补丁。
3. **局部实施后**：按设计插入一次 pre-axis copy，GREEN 复用同一 case/runner 身份，检查 SQL 执行集合、最终每组代表、聚合保持、输入未污染和全 diff。测试 witness 的 seam 不能成为产品更改；独立 validator 检查原目标、实际补丁和 RED/GREEN，不能只复述 Builder 自报。
4. **运行层**：只有构建并实际加载新后端后才补 symbolic 原过滤场景的响应/代表字段与正常 save-reopen；服务重启/构建资源移动另消费环境准入。H2 pass 不关闭现有 UI 残余。

同类静态检查：map 目录只有 SymbolicMapHandler 出现这个 pre-axis sqlMeta1 + 新建 sqlMeta2 的明细分支；有限扩读 TableHeatmap/TableNormal/TableInfo 主链，没有据此确认第二个同样漏过滤位置。其他图表/导出/辅助查询没有做全仓审计，不能称同类问题清零。HAVING/计算字段、count 气泡、列权限脱敏、跨源运行、限量/排序、其他过滤上下文均保持原验收要求与未覆盖状态，不自动纳入这 11 例或擅自迁出原范围。

CMV-N01 的 ubo、flow/heat 重开稳定画面、逻辑 query 与物理 HTTP 计数、49 类完整验收仍独立存在。本修复不解释或关闭这些事项，也不重开 C2 已耗尽预算。

**准入预测**：预计无需扩大生产写域即可修复已确认的 WHERE 继承缺口。当前可推进测试见证准备；F1/F2 落实并取得可信 RED 与 write admission 后可进入局部源码修改，不需要为同一已有用户目标重复确认。若出现别名/输入污染等真实反例，保留原完整分母并按具体影响修订，不能以 H2 seam 补正后声称产品已修。

## 语义压缩与未来误用防护

- “设计通过/11例预期一致”不得压缩成“修复通过”：S3/L5；记录为设计审查和 oracle 复算，RED/GREEN/独立运行留独立槽位。
- “三类过滤继承”不得压缩成“真实权限通过”：S3/L2/L5；whereTrees 是合成片段 witness，真实身份、行列权限与拒绝路径保持待验。
- “details 正确”不得压缩成“全量原始明细/amount 是代表原始金额”：S4/L3；每组单代表、混合聚合字段是现有输出规则，修复只要求代表身份/原始非聚合字段属于匹配集合。
- “新的后端交付物第1/3轮”不得压缩成“可以重试旧 C2”：S6/L4；新卡、写域与根因属于 Symbolic 后端漏过滤，旧通用资源残余的预算和状态不变。

该计划没有把执行 Dashboard 当稳定产品规则或以临时测试 DSL 取代 SQLMeta 公共契约，修复复杂度与故障链匹配；没有发现需要批准的新 Scope Delta。

## 阅读清单、未检查与最终读回

已核：绑定 Goal、Design、Cases、CoordinateMapEvidenceValidation 全部章节、52 条 RuntimeCoordinateMap event 的解析与 symbolic #35 相关真实响应、Topology-r518；SymbolicMapHandler 完整文件、SQLMeta、BeanUtils.copyBean、ChartDataManage 过滤构造/调用入口、SQLProvider 两个 overload、Field2SQLObj、ChartDataBuild 的代表组装；扩读 Table2SQLObj、Dimension2SQLObj、Quota2SQLObj、Provider.rebuildSQL/替换 helper、CustomWhere2Str/WhereTree2Str 与 ExtWhere2Str 的映射写入点、Utils.cross/alias/mergeParam、DatasetDataManage.buildFieldName、FieldUtil.transFields、DefaultChartHandler.fillDatasourceRequest、SQL 常量及上述三类 table 主查询切片。已依据当前工作树复核，未用旧 DataEase 版本推断。

未核：尚未产生的 runner/RED/GREEN、Java 真实类加载、Maven 有效测试执行、供应商连接/方言实际执行、真实行列权限及脱敏、计算参数完整场景、全部其他查询分支/数据库、跨入口/导出/分享嵌入、UI 新后端运行、现有 ubo 根因或 Goal 收尾。原因是本轮限定只读设计/source/probe，并无已落地实现。本报告不使用前轮的环境权限接触 DB/UI，没有启动/停止应用或改 target/jar/SDK。

写前再次核实 13 项绑定输入一致，输出路径原不存在；仅新增本报告。报告输出后应由根 Agent 绑定实际摘要，后续状态和 receipt 不回写本审阅时点事实。
