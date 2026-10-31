# UI 集成设计第三轮审查：C2/C3/C4 具体输入准入

结论：**PASS_WITH_BOUNDS（在下列精确语义内可实现）**。UI同一设计交付物累计第3/3轮；本轮是最后一轮设计审查，不改名重置。C1继承第2轮准入；本轮只核该轮UIR-008尚缺的C2/C3/C4具体输入。实现交付后的独立Validation仍须按该实现交付物自己的三轮上限执行。

- reviewed_at：2026-10-27T05:26:28.988419+00:00
- reviewer：/root，未编写本次fixture或r002设计。fixture作者为g2_closeout_reviewer。
- snapshot_id：S02-MVP-C234-DESIGN-REVIEW-r003；as_of_state：Topology-actual-r437。
- Card canonical SHA：94100760aa55a13a8e4d2b52e4ca1782759aa2cbc29ef1f39e90f22fcd54bde8。已运行卡片/Context验证；本轮30项必读原字节摘要逐项一致。
- fixture JSON：cdec6ed17380d4cc62eba495c4edd785d12178fd4758a5cfb993dd530426f4d5；说明：c23842fc1f7bab978b8bda7d0f7d375827ca01df5dbbcf3e9287320b5e0858c2；设计/Cases r002和执行消歧沿原冻结字节。

## 当前任务、声明和边界

当前任务是实现权限测试桩下界面MVP，包括49内建类型；不是缩成C1三个组件或用组件替身验收全部类型。原复杂责任按已核实的人类范围调整进入六后续Session，原未验证状态保留。Dashboard是执行材料；本报告不建立canonical产品事实、不提升22项AC、真实权限或最终Goal。

Design Freeze Validity为有界通过：原15主ID/25子ID及49分母未变，r002与旧报告未覆盖，缺输入已用11个明确fixture和6条原子案绑定补齐。Implementation Entry Readiness为有界通过：C2地图、C3富文本、C4图片可分开Builder，实际入口前仍须当时精确源码基线/Card/Context/admission。不是可信RED：必须先实际装载旧SFC并以语义fingerprint失败，再同ID GREEN。

## 查全结果与处置

UIR-008具体输入残余已补：flow/heat/symbolic三L7，map/bubble的polygon和point，共7地图fixture；Tiny普通/compare两fixture；picture开启/关闭两fixture。BASE克隆算法给出精确路径赋值，数组整体替换；DTO id/type/render、轴字段映射、GeoJSON、SVG src、独立old状态、事件顺序/错误/超时/late明确。当前静态执行11fixture身份、行字段、轴覆盖及四SVG解码/hash检查通过。组件SDK seam清楚，不能替换整个prepare/drawChart，也不能把缺方法/编译/资产失败计RED。

1. C2：核实际flow五layer构造、heat x/y/value、symbolic tableRow及真实buildLabel内容、map/bubble getGeoJsonFile和point-fallback字段读取；GeoJSON polygon闭环、point中心和bbox明确。监听先于add、必要callback结束再ready，scene.loaded或void render单独不足。30s超时和dispose迟到明确；预热缓存与候选写分开，不能以SDK double证明真实地图资产。
2. C3：字段dataeaseName→id/name及tableRow首行与真实initCurFields/assignment一致；正文金额6761/门店合成店A、href修正、data-mce-content移除、空值占位有具体expected。valueFormatter的value/decimal0返回6761字符串，与预期一致。init/content两事件和同步SetContent顺序明确，旧/无关p与appearance sentinel独立；公开同ID channel隔离、局部timer/存活检查保持为实施要求。
3. C4：按真实mappingColorCustom核6761→green、200/0→red、null→default gray（le显式排null）。OFF静态query0与ON query1分别记录，后者wire table-info/antv、prepared还原picture-group/custom；目录纯getFieldByDQ不触发onDatasetUpdate。真实Attr入口、decode/error/empty均有落点；静态分支不能代替过滤正向。
4. 新发现F3-01/P3：flow的expected.start_labels/end_labels只能按源字段配置数组理解；真实shape回调共享has，会对与start同名的end去重，库调用顺序可能使end显示空。Builder不得将这两数组当无条件渲染文本golden、不得为满足fixture改旧去重语义。故障ready主断言仍是5个必要layer/真实callback完成；如另测具体显示，明确记录实际回调顺序或使用不重名标签fixture增量，不借此改变冻结基本故障ID。当前不是准入阻断。
5. 新发现F3-02/P3：map/bubble synthetic data中的quotaList携带字段定义而未携带逐项value；本包tooltip关闭、showQuota=false，当前source.value和几何映射仍有确定值，足以用于当前ready故障。不能将其称完整真实后端DTO golden，未来tooltip数值覆盖须用真实DTO另证。本轮不扩大为通用图表修复。

## 已查无问题、未查与剩余责任

已查未见新增阻断：11fixture源/响应/element id一致，轴引用均可在fields解析；Tiny compare保77/all而普通强制1/custom的预期与现逻辑一致；picture默认规则排序后数值命中优先且null落默认；data SVG自包含且无外网；所有组件失败捕获旧state而不调用被测投影生成expected；同类无known缺值的描述性fixture残余。

未执行真实SFC/SDK/后端/浏览器/query/save/reopen、49逐type及插件installed盘点。理由是本轮为设计和fixture delta审查；所有运行项保持NOT_RUN。C1当前实现并发变化不在本轮审查投影内，不冒称C1已通过实现Validation。

修后准入预测：C2/C3/C4可据原r002、消歧、具体fixture及本报告进入精确Builder；先组件故障RED/GREEN，再真实业务链。当前无需要维护者裁定的新政策；不要求等待地图资产才实施C1，也不要求新通用资源框架。第三轮预算已经用完；若实现暴露剩余设计阻断，记录具体缺口，只推进独立安全工作，不能伪造第四轮或自动删AC。
