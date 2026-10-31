# 地图测试数据准备方案独立审查 r001

- 审查轮次：本地图 fixture 准备交付物第 1/3 轮；图片代码与 C234 已用完的评审预算不重开、不重置。
- 审查者：独立 semantic_review lane `map_fixture_reviewer`。
- 审查时间：2026-10-29T07:54:46.387420+00:00。
- 绑定卡：`S02-MVP-MAP-FIXTURE-REVIEW-r001`，canonical SHA-256 `14fe005e7566d8ac13ba91edff92621bff9e9d39d3e0b39f8aaee3d9f887f6dd`。入口及写报告前复验均 PASS，Goal 与八个 base refs 无摘要漂移。
- 基线 commit：`1e84e7438462e5d6fc371358da3bdad7d24a5c1a`。工作区已有大量修改；本 lane 不更改源码、浏览器、数据集、服务或外置资源路径，只新增本报告。写前确认本报告不存在，父目录不是符号链接。
- 使用项目 SGE kernel、semantic-review recipe、Frame-First/Protocol v2 和写前保全要求。报告是方案审查，不是最终 Validation 或 Goal 收口。

## 审查结论

**Overall Verdict：PASS（仅地图 fixture 准备方案的有界可执行性通过）。**

**Design Freeze Validity：PASS。Implementation Entry Readiness：PASS。** 没有发现需要重新设计才能开始的阻断项。允许进入已授权目标的 execution admission 与即时预检；本报告不替代外置目录写权限、实际执行许可、输入漂移校验或运行验证。

方案的两条最小动作链与当前源码相符：将仓库原始 GeoJSON 放入资源回退目录；在同一个隔离数据集把四个原坐标字段转换为维度。无需拼接坐标、转文本、降精度、复制字段或改产品源码。这里只批准准备路线，尚不能声称文件已复制、字段已转换、fixture 运行可用或地图通过。

## 已检查证据与无问题维度

| 检查面 | 实际检查和结论 |
|---|---|
| 原始目的与范围 | 已读 Goal 的 mission、must-have、P1/P2 与 claim policy；38 条总分母、49 类型分母和真实权限边界不变。卡列 AC-MVP-F01-06/08/12 只是本次准备关联，不表示这些 AC 已满足。 |
| 来源与资源真实性 | 两个源文件均能解析为 FeatureCollection；000 有 225 个 Feature，156 有 35 个 Feature，几何类型为 Polygon/MultiPolygon。SHA 分别为 `8892e9ace47c9f52b81458ba87d170fba39c6fafd23efede971cce2a766dfa83`、`99adfeded5223848bbe37a0a12f8023e11ee12161c7800521c27db42fdeac275`，与方案一致。资源来自主仓库 mapFiles，没有复制 XPack 实现。 |
| 文件布局与读取路径 | Dockerfile 第 9 行把 mapFiles 放入 map-origin；DeMvcConfig 第 31–36 行先读 map，后读 map-origin；StaticResourceConstants 第 21–24、48 行从 data 根派生两个目录。方案只新增两个 map-origin 文件，不写 map/geo 覆盖目录、不重启，符合实际回退机制。 |
| 字段基线出处 | MapFieldBaseline 的 19 项 metadata 与 RuntimePictureResource-events-r002.jsonl 第 4 行 diagnostic/queryObservation/responseData/sourceFields 及 fields 投影逐项完全一致；四个坐标 ID、name、dataeaseName、datasetGroupId、DECIMAL、deType=3、groupType=q 均与计划一致。该基线是历史诊断，执行前仍要重读当前值。 |
| 正常 UI 入口 | 数据集 form/index.vue 的 handleFieldMore translate 分支调用 dqTrans；第 463–466 行仅翻转 groupType。指标菜单明确提供“转换为维度”。datasetPreview 只刷新 columns/tableData，不替换 allfields，因此按计划刷新数据不会在这段代码中重置角色。 |
| 保留身份与保存链 | 已存在 nodeInfo.id 的 datasetSave 进入 editeSave，避免新建路径的 resetAllfieldsId。editeSave 提交 nodeInfo、union 和全部 allFields；后端 DatasetGroupManage.saveField 对已有 ID 保留 dataeaseName/fieldShortName，再按原 ID 保存。没有从这条链发现为了角色转换而必须重建字段/数据集的要求。 |
| 坐标 oracle | 实读冻结 CSV（UTF-8 BOM）：19 列、30 行、30 个不同 id；四列独立，值均在合法经纬度范围。原始字节 SHA 为 `abc8bed0862129d58724bcefff2563862e48d1ea057365ae8d5d2c853e64472b`。值含 114.0579/118.7969/120.1551 与 22.5434/30.2741/32.0603，不能用整数、字符串拼接或城市名代替。 |
| 地图字段契约 | 对照 flow-map、heat-map、symbolic-map 的轴和解析字段：flow 起终点各需独立经纬度，symbolic parser 取 xAxis[0/1] 的字段名；本次四字段 q→d 与此准备目的相容。没有据此重新评审地图候选代码或判其运行正确。 |
| 不覆盖与恢复范围 | 目标不存在才创建；已存在只比较，相异停止。未保存取消、已保存只恢复本次四字段角色，不覆盖其他字段/数据；新文件失败时保留记录不删无关文件，边界合理。 |
| 声明与治理 | 准备、文件可读、HTTP 成功、真实地图绘制、复制粘贴、查询、保存重开是不同证据层。方案没有把前几层提升为地图通过，也没有修改原始权限或终态谓词。Dashboard 继续是执行记忆，未提升为产品 KB/Coverage。 |

## 全部发现及处置

**阻断发现：0。以下 4 项是执行时必须落实的非阻断注意事项，不要求新增一套方案或开启已用完的代码审查。**

1. **F-01／P2：全量保存需要检查完整身份，数量不是保持不变的充分证据。** form/index.vue:386 提交完整 union/allFields；DatasetGroupManage.save:149–152 保存后清理不在列表中的表/字段。19 字段和 30 行相同仍可能发生字段替换、坐标互换或非目标元数据变化。方案已要求“ID/类型匹配、其他字段保留、SQL 不改”，执行记录应具体落实：保存前与重开后比较全部 19 字段的 ID/name/type/deType/dataeaseName/datasetGroupId/groupType，唯一允许的业务差异为四个指定 groupType q→d；核对同 dataset 和既有 SQL/union 语义，按 id 对照 CSV 四列坐标及行集合。后端正常更新 lastUpdateTime/updateBy 或重新编码 SQL 不应误判为修改业务 SQL。正常 UI 诊断若无法取得关键证据，则保留未验证，不能只凭字段数宣称保持不变。**Disposition：执行证据落实，非设计阻断。**
2. **F-02／P2：不覆盖要落实到写入原语与路径，而非先 exists 后普通覆盖复制。** 目标不存在与复制之间可能变化，父目录也可能为符号链接。执行者应在已批准 canonical 目标内核对父目录及目标类型，使用排他创建/不覆盖方式，写后核对字节 SHA；已存在同 SHA 可记录“已有相同资源”，不同 SHA 停止。部分写入失败要准确标为本次未完整文件，不能误认已具备资源；保留失败记录符合现方案。**Disposition：执行入口约束。**
3. **F-03／P2：保存失败或回退时先重读当前角色，不能盲目重复切换。** dqTrans 是 toggle；若保存响应丢失、部分 UI 操作未完成或后来字段有漂移，对四项无条件再点转换会把原本 q 的字段变成 d。按计划“转换回指标”应具体解释为：先确认同 dataset/同四个 ID，仅对确认为本次已变成 d 的字段执行 UI 回转，重开核验；身份/其他属性漂移时停止，不覆盖他人修改。**Disposition：按既有恢复边界执行，非新增范围。**
4. **F-04／P2：两份原始资源和本地目录恢复都不是当前最终响应内容的证明。** map 优先于 map-origin；已有覆盖文件、缓存、资源权限或运行包配置仍可能改变实际结果。本 lane 没有查看外置路径。执行后需正常应用请求核对实际资源、再做真实绘制；000/156 不证明省市下钻资源齐全，也不证明五种地图已通过。**Disposition：保留运行限制，不扩大本次两文件分母。**

## 未检查、原因与同类残余

- 未操作浏览器、保存或回退数据集、请求运行服务、读取/写入外置目录；分派明确禁止。当前目标是否存在、父目录类型、实际运行 data 根、在线数据是否仍等于基线均未观察，必须由执行前检查确定。已有 ResourceEnvironmentRepair 记录只能作为历史线索，不代替即时核验。
- 未运行构建、安装依赖、连接数据库或执行迁移。本任务不改源码，无需以产品编译替代 fixture 准备核验。
- 未审查 XPack 实现、真实多用户权限或生产环境；这些不在本轮范围且不能由开发权限桩证明。
- 未运行地图绘制、五类地图整树复制粘贴、查询 oracle、保存离开重开、下钻/移动/嵌入；同类残余包括覆盖文件优先级、地图子区域资源、坐标轴顺序与聚合行为。继续原运行验收分母，不推高 44/49 局部角色观察数或 0/49 完整类型通过数。
- MapFixturePreparation-r001.md 是此前探索记录，仍提文本计算维度等可选路线；当前受审 ExecutionPlan 已选择同 dataset 原字段 q→d，应以该明确动作约束执行，不把历史备选当获准扩张。
- 卡中 rebaseline_ref 指向 r502 的上一资源环境审查拓扑，不描述本 reviewer 身份。此处记录真实 lane 与输出，父控制面应在既有 append-only topology 后续快照登记本次执行，不改写 r502，也不把前一 reviewer 记作本轮 reviewer。
- CSV 首次按普通 UTF-8 读取首列得到 BOM 前缀，读取检查报 KeyError；随后明确用 utf-8-sig 重读，19 列、30 唯一 id 与坐标范围检查通过。未修改 CSV，未隐藏失败。

## 准入预测与下一步

最小执行顺序：消费有效且绑定此方案的 execution admission → 即时复验资源根/目标路径/源 SHA 和同 dataset 19 字段基线 → 排他创建两份资源并读回摘要 → 仅操作指定四字段转换为维度 → 刷新核对按 id 的 30 行独立坐标 oracle → 正常保存离开重开并比较字段业务属性 → 留存准备结果。任何目标/身份漂移停止对应动作，不把本报告作为放宽写范围的授权。

预计上述步骤通过后可解除“缺少两份基础地图资源”和“坐标在指标目录中”的准备障碍；是否实际解除地图运行阻断仍须后续真实 UI 验证。下一单元继续原 S02/F01 地图 source-copy/target-paste、完整树、独立 query oracle 与保存重开；真实权限与完整 38 条 Goal 保持各自待验。

未来引用本报告只能压缩为：**“地图 fixture 准备方案第 1/3 轮 PASS，执行与地图运行验收尚未完成。”** 不能写成“地图通过”“49 类已完成”或“权限已验证”。误用控制分别是：资源 SHA/HTTP 成功不替代绘制；字段转换不替代复制粘贴与查询结果；开发桩与方案审查不替代真实权限、独立最终验证或 Stop Gate。
