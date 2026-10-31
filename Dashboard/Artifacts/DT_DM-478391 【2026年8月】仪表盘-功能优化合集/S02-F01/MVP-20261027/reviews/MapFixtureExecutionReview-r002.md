# 地图测试数据地理语义类型方案独立审查 r002

- 本交付物累计第 **2/3 轮**；不是新建预算。图片与 C234 已耗尽评审不重开。
- Reviewer：`/root/map_fixture_reviewer`；审查时间：2026-10-29T08:40:18.537761+00:00。
- 卡 `MAP-FIXTURE-REVIEW-R002` canonical SHA `c0cb7e1b2d75768fe7076c0aac94cd3a9da21a804a162cff15288632ffe68de4`，入口及写报告前验证均 PASS；绑定 Goal 与六项输入无漂移。
- 唯一输出为本报告，写前不存在。工作区已有修改保持不动；未操作 UI、产品源码、数据、服务或外置目录。沿用已读项目 SGE 的 semantic-review / Frame-First / Protocol v2 与写前保全规则。

## 双重结论与范围

**Design Freeze Validity：PASS WITH FINDINGS（边界成立，存在以下可明确解释的计划表述问题）。Implementation Entry Readiness：PASS。Overall Verdict：PASS（仅正常 UI 四字段地理语义设置的有界执行路线）。**

阻断发现 0；不需要重新设计。执行者必须消费有效 admission 并以当前已保存的四字段 `groupType=d、deType=3、deExtractType=3、type=DECIMAL` 为前态，按方案指定省略号菜单逐项设置 location。下述 F-02/F-03 是这一路线的明确约束，不能把历史字段表当批量写入载荷或把“物理 SQL 不改”理解成运行查询 SQL 字节不变。

本报告不证明类型修改已经执行，不证明当前运行包等于源码，不证明地图绘制/复制粘贴通过，不增加 44/49 局部观察或 0/49 完整通过数量；38 项 Goal、49 类型、真实权限边界保持。

## 上轮遗漏与本轮重新检查

r001 检查了坐标独立性、轴数量和 groupType 转换，却没有继续检查实际编辑器 `dragCheckMapType`，因而漏掉地图坐标还必须 `deType=5` 的入口限制。这是审查覆盖遗漏，不能归因于用户新加需求。上一轮“可解除坐标在指标目录中的准备障碍”仅覆盖角色准备，不能推出“已能拖入地图坐标轴”。不改写 r001 历史报告；本轮补查实际入口及后端值链，消耗同交付物第二轮预算。

## 已检查与无问题维度

| 维度 | 直接证据与结论 |
|---|---|
| 当前前态 | 已读 r001 执行记录及所引 event log，事件流 SHA `d1d343fab9e4bb764645ce4c59919032c36904851e141d4afe66822c686847f6` 匹配。第 11 条 saved_metadata_query 的 sourceFields 中四指定 ID 为 d/3/3/DECIMAL，dateFormat/dateFormatType 都是 null；共 19 字段。不是本 reviewer 对实时 UI 的独立观察。 |
| 真实拖拽规则 | editor/index.vue:754–771 的 dragCheckMapType 删除 deType≠5 项并提示；第 844–848 行对 symbolic-map/heat-map 的 xAxis、flow-map 的 xAxis/xAxisExt 调用。角色 d 与语义类型 5 是两个必要条件，不能互相代替。 |
| 菜单命令 | views/visualized/data/dataset/form/FieldMore.vue 显式提供 location 与 float；传回选中的末级命令。pages/visualized/data/dataset/form/index.vue:406–416 把 location 映射为 deType=5、float 为 3，并设置 dateFormat=''，不会在此分支改 ID、type、deExtractType 或 groupType。 |
| 保存身份 | 复核既有保存链：同 nodeInfo.id 进入 editeSave，传完整 allFields；DatasetGroupManage.saveField 对已有字段 ID 保留 dataeaseName/fieldShortName；DatasetTableFieldManage.transDTO2Record 复制属性，没有把地理语义类型强制写入 deExtractType。四字段 extField=0，未进入新计算/分组字段的重设提取类型分支。 |
| 数据集预览查询 | DatasetDataManage 使用 Field2SQLObj；Field2SQLObj.getXFields 对 deExtractType=3、deType=5 落入原字段 originField 分支，不增加取整或字符拼接。deType=3 时可能使用 DEFAULT_FLOAT_FORMAT CAST，因此类型修改可能改变生成查询文本，但没有这里的原始数据写入。 |
| 图表维度查询 | Dimension2SQLObj.getXFields 对 extract=3/type=5 同样保留 originField；不进入时间转换、整数/浮点 CAST 分支。该静态分支支持“独立小数坐标可供查询”，不等于在线 Provider 已验证。 |
| 响应表示与坐标解析 | DatasetDataManage.buildPreviewData 返回源字符串；deType=3 的科学计数格式化分支在 5 时不再执行。ChartDataBuild.transTableNormal 对 5 保留字符串；heat-map 转换对 row[0]/row[1] 使用 BigDecimal。地理语义允许数字字符串表示，不能要求 JSON 类型仍为 Number；也不能据字符串不相同判断数据失真。flow/symbolic 的现有 x/y 字段解析依旧需要真实渲染验证。 |
| 独立数据 oracle | 再读原冻结 CSV，SHA `abc8bed0862129d58724bcefff2563862e48d1ea057365ae8d5d2c853e64472b` 未变；19 列、30 行、30 个唯一 id。用 Decimal 检查四列合法经纬度范围。后续按 id 和四列分别比较数值，应保留 4 位小数本值；格式补零/科学计数变化不能替代数值比对。 |
| dateFormat 持久化 | JpaUpdateNonNullAspect 合并非 null 属性，空串是非 null，允许 dateFormat 从 null 变成 ''。同菜单改回 float 仍设置 ''，不会恢复 null；方案已承认不是逐字节回退。当前四字段不是日期提取类型，所查 deType=5/3 数值路径不读取 dateFormat 做日期解析。 |
| 全局范围 | 只操作同隔离 dataset 四坐标；amount/shop 等过滤身份保持。没有新增 SQL、拼接列、复制字段、换 dataset 或改源码，原 38 项和权限要求未减少。先保存隔离仪表板恢复点、重开并清旧 clipboard 的要求合理。 |

## 全部发现与处置

1. **F-01／P1，审查覆盖遗漏，已定位：上一轮遗漏地图拖拽 deType=5 要求。** 依据为实际 editor 调用链，影响是 r001 准备不能单独完成坐标轴输入。本轮方案沿既有 UI 修正语义类型，解决入口上的缺项；运行是否真正解除阻断仍待观察。Disposition：本报告显式更正旧结论上限，不补造 r001 验收，不重置轮次。
2. **F-02／P2，计划内历史字段表与明确前态不一致。** r002 actions.fields 四项仍写 groupType=q，但 change 与首两个 admission_predicates 都明确以 r001 保存后的 d 为前态。实际 r001 事件元数据也为 d。因此不会据此认定必须回退角色再操作；这四个结构项只可作为原始身份参考，禁止作为待保存对象或当前完整 baseline。执行前留存 19 字段当前快照，若指定四项不是 d/3/3/DECIMAL 则停。Disposition：有界 UI 执行可继续；下次正常生成计划版本时应修正或标注 historical，当前冻结字节不覆盖，不为此单独开启第三轮。
3. **F-03／P2，“不改 SQL”的证据层需准确。** 后端可能从 deType3 的数值 CAST 变为 deType5 的原字段查询，不能承诺生成 SQL 逐字节不变；本方案只允许不编辑用户定义 SQL/union 业务逻辑、不写物理表数据。运行时 SQL 的合法投影变化不应当作数据损坏，也不能用“只改标签”掩盖查询表达式差异。Disposition：执行记录按 authored SQL 与生成查询分层说明；实际 30 行数值 oracle 是必要验收。
4. **F-04／P2，菜单路径不能随意替换为管理页类型编辑。** 本方案指定 handleFieldMore 的菜单路径只设置 deType/dateFormat；同文件 fieldTypeChange/fieldTypeChangeBatch 还设置 dateFormatType/deTypeArr，可能产生额外元数据变化。不要为了批量方便改用不同路径后把额外属性变化静默放入允许清单。确需换路径时先检查与记录差异；四字段之外的业务变化按方案停止。Disposition：使用已审指定菜单；deTypeArr 等纯 UI 辅助状态与持久业务元数据分开对账。
5. **F-05／P2，回退边界是恢复数值语义，不是整个数据集历史恢复。** 仅确认本次四字段中当前 deType=5 的项才执行 float，保持 groupType=d、原 ID、type=DECIMAL、deExtractType=3，dateFormat='' 残留如实记录。若字段 ID、角色或其他业务属性漂移，不能盲目回退覆盖；未保存先取消，保存失败先重开确认是否实际提交。不得为恢复 null 改 SQL、直写库或引入额外源码修复。Disposition：按计划执行，保留残余，非阻断。
6. **F-06／P2，共享数据集类型变化会影响其他消费者。** deType5 在 ChartDataBuild 以字符串维度处理，ChartDataManage 动态数值字段若使用它且 summary 非 count 会拒绝；不能推广为“对所有已有图表零影响”。本数据集隔离且只改四坐标，已保存的仪表板恢复点和新开目录核对可限定本轮风险；若发现已有指标/过滤器依赖这些坐标的数值类型，应记录具体受影响消费者并停止该冲突场景，不修改 amount/shop 或扩大产品补丁。Disposition：执行前消费者检查、保留未覆盖范围。

## 未检查及同类残余

- 禁止操作 UI/数据/服务，本轮没有在线读取字段、点击菜单、预览、保存、回退或验证渲染；r001 事件是历史执行证据，不被本报告升级为实时独立验收。
- 未核对当前后端运行 jar 与源码逐类一致，未查询实际 Provider/物理表或所有数据库方言。因此数值保真结论只限已读分支的静态预期，运行中须按 CSV 检查全部 30 行、四列与其他 15 字段身份。
- 未运行源码测试或构建，本轮只评方案且禁止产生相应写入；未读取凭据，未修改全局过滤/权限逻辑。
- dateFormatType、precision/scale、originName、datasetTableId、extField 等已能从历史完整元数据看到，应纳入本轮前后业务属性比较，不能只复用早期七字段投影。四字段允许 deType 和 dateFormat 变化；其他业务属性变化需停止分析。
- 地图资源回退、缓存、坐标顺序、聚合、空值、实际 L7 渲染、过滤树粘贴与保存重开仍分别未验；类型入口放行不证明最终地图正确。真实权限、跨上下文及其他原始 AC 继续原分母。
- 此轮卡 topology 仍以 r505 的原运行阶段为参考；父控制面应追加本轮 reviewer 与结果绑定，不改写历史 r505。

## 准入预测与后续动作

在有效 admission 与即时身份检查通过后，最小闭环是：保存当前隔离仪表板恢复点 → 读取同 dataset 全部 19 字段和 30 行前态 → 四个指定字段分别选择“更改类型→地理位置” → 预览逐 id 比四列 Decimal 值和全部行 → 正常保存、离开、重开 → 对照 19 字段完整业务属性，唯一预期持久差异为四项 deType 3→5 和 dateFormat null→'' → 重开图表目录、清理旧 clipboard → 重新拖入坐标并观察查询与绘制。

以上预计能解除已定位的地图坐标拖拽类型限制；如果仍失败，记录实际错误并定位剩余原因，不重复设置、不把失败算通过。后续按原计划完成同 dataset source-copy/target-paste、完整过滤树、独立 query oracle 与保存重开；本轮不替代最终独立验证。

安全压缩引用为：**“地图 fixture 第 2/3 轮方案通过，需按当前 d/3/DECIMAL 前态经指定 UI 设地理类型；值保真与地图运行仍待验证。”** 不可写成“坐标已无损转换”“地图通过”或“MVP 完成”。
