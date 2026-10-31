# F05–F08 静态连接点调查

本报告为 DE-EXEC-S025 的 connections_b 文档 Builder 输出；不是独立验证或S01完成。所有产品测试、服务、数据库和浏览器操作均 **NOT_RUN**。源码固定为主仓库 HEAD `a11d4f1278e12c2bea0d9d4000537d7d8f868f0e`，实际证据以伴随 `connections_b-claims.json` 的工作树文件 SHA-256 为准。de-xpack 未初始化，未读取或复制专有源码。下列 OBSERVED 仅表示直接静态证据，INFERRED 是候选影响推断，UNKNOWN 保留待证。没有把静态候选字段当实际支持。

## F05 透视表按列格式

| 固定字段 | 调查结果 |
|---|---|
| Function ID | F05 |
| S00 Requirement/Decision/AC IDs | Q070–Q090 / DEC-070–090 / AC-F05-Q070–Q090；BR-F05-001–010；ISS-AC-03、08；FX-STYLE/FORMAT/LABEL/ENUM。完整分母保留于S00 r004 AcceptanceMapping。 |
| UI Entry | 真正条件样式入口为高级配置 Threshold.vue→TableThresholdEdit.vue；不是TableCellSelector。initFields取透视xAxis/xAxisExt/yAxis，target=self/custom。维度格式菜单另在DimensionItem且限定普通/明细表。B05-01/02/05/06。 |
| State/Data Flow | 条件副本thresholdArr→onTableThresholdChange→Threshold.tableThresholdArr→确定检查→thresholdForm；渲染drawChart→getPivotConditions，依据sourceField/targetFieldId和cell scope映射文字/背景；meta另用formatterCfg格式化数值。已有跨字段分支不等于任意字段组合实测支持。B05-01–04。 |
| API/Backend | 条件绘制在前端；元数据复用图表保存。当前TableThresholdEdit已读imports/条件配置中没有枚举API，来源切换需新增/接入；不能用查询组件API存在证明此页已完成。图表实际查询、导出与权限由公共图表链承接，导出最终格式一致性UNKNOWN。 |
| Persistence | senior.threshold.tableThreshold与轴formatterCfg进入公共JSON保存/恢复B-COM-01；Threshold面板副本与确认分离。仪表板正式保存/重开、历史规则升级、取消多次预览恢复未运行。initFields遇无效字段会把fieldId设null，现状兼容风险不能掩盖。 |
| Permission Boundary | 前端样式不是鉴权；新增枚举来源必须带数据集/行列权限；自定义目标只能在已有图表字段中定位。save注解不足判定鉴权，XPack及真实身份待证。 |
| Existing Tests | 已静态枚举tests、core/core-frontend/tests及core/core-backend/src/test候选路径，未发现专门F05条件样式命名测试；tests/table-image/verify-url.mjs只涉及图片URL，不替代样式验收。运行NOT_RUN。 |
| Evidence Anchors | B05-01–06、B-COM-01/02；文件摘要及符号见claims。 |
| Reuse Options | 复用已有条件字段、跨字段目标、作用域解析、S2条件映射和数值formatter；Q072来源切换、Q079七属性、Q087预览是明确新增，不能因复用裁定缩减。 |
| Change Surface | TableThresholdEdit/Threshold、common_table/tableConditionScope、formatter/导出、规则schema及保存校验；七属性需逐项区分通用格式与条件覆盖。 |
| Unknowns | 字段×目标×布局支持矩阵、冲突属性粒度、20条历史识别、来源切换权限与真实值/系统标签区分、自动重绘清旧样式、10001行异步与2秒绘制；已读组件未见独立来源切换/预览按钮与冲突判定，属于局部NOT_FOUND，非全产品不存在。 |
| Risk | 高：历史规则被初始化变更、总计作用域和明细新规则混用、跨字段汇总值误用；中：格式化污染原值或导出类型、渲染阻塞。先保留旧配置fixture，真实S2渲染+保存重开+导出验证。 |
| Recommended Slice | 候选S06：先复现真实条件字段/跨字段支持和缺陷，再冻结历史兼容及冲突合同，接入两个枚举来源、七属性、显式预览。进入仍CONDITIONAL，需授权运行及独立review。 |

## F06 多字段拖拽

| 固定字段 | 调查结果 |
|---|---|
| Function ID | F06 |
| S00 Requirement/Decision/AC IDs | Q091–Q108 / DEC-091–108 / AC-F06-Q091–Q108；BR-F06-001–010；ISS-AC-09；FX-DRAG。 |
| UI Entry | editor/index.vue已有setActive/Ctrl/Shift、activeDimension/activeQuota、singleDragStartD/singleDragStart及原生drop；不是从零新增多选。B06-01。 |
| State/Data Flow | 选择顺序数组→拖拽克隆并携datasetId→drop逐项插入，成功项后移插入游标→addAxis按角色/重复/limit判断→calcData快照及事件。Ctrl按点击push，Shift按列表区间；跨维度/指标选择会清另一集合。B06-01–03。 |
| API/Backend | drop本身不直接新建HTTP；配置变化沿现有快照/图表取数保存链。尚未追完事件调度是否合并重复请求，不把多次recordSnapshotInfo等同多次实际HTTP。 |
| Persistence | xAxis/xAxisExt/yAxis JSON公共保存B-COM-01；每字段clone与formatter合并可见，但跨角色单字段源删+目标入原子性和失败保留尚UNKNOWN。 |
| Permission Boundary | 字段来自既有可用数据集/图表列表；拖拽校验是类型/容量，不是后端授权；取数和保存必须复核当前身份。 |
| Existing Tests | 已搜索上述tests目录，未找到专门drag命名用例；snapshot.ts存在undo/redo并非测试。候选真实编辑器五区域鼠标交互、撤销、键盘、保存重开。NOT_RUN。 |
| Evidence Anchors | B06-01–06、B-COM-01。 |
| Reuse Options | 复用选择集合、原生拖拽载荷、游标插入、类型/去重及共享snapshot；保留单拖与其他图表既有交互。 |
| Change Surface | editor/index.vue的drop/addAxis/active集合、目标区域拖拽组件及共享snapshot事件；批次结果/一次逻辑刷新和跨区移动需设计。 |
| Unknowns | 普通两区/透视三区的实际默认容量K（局部axisConfig未配置limit，不能报告无限）；单拖角色转换全路径；同区整组重排/跨区移动、失败单项原子性、撤销粒度、无效取消保选；已有singleDragEnd清两集合，需核实绑定与取消事件。 |
| Risk | 高：批量逐项处理导致丢字段、顺序逆转、容量截尾误删旧项；中：多次刷新/撤销步数与格式合并；不得把用户示例容量5当实值。 |
| Recommended Slice | 候选S07：先以单拖oracle和五区域实测固定容量/转换，再补批次成功失败明细、顺序、单项原子性和调度。非表格图表仅回归，不扩新增支持。 |

## F07 枚举值上限

| 固定字段 | 调查结果 |
|---|---|
| Function ID | F07 |
| S00 Requirement/Decision/AC IDs | Q109–Q133 / DEC-109–133 / AC-F07-Q109–Q133；BR-F07-001–011；DEC-SUP-SCOPE78(D07)，ISS-AC-03/07/15；FX-ENUM/QUOTE/TYPES。 |
| UI Entry | 三类入口分别是v-query/Select.vue、图表filter/auth-tree-chart/FilterFiled.vue及ResultFilterEditor.vue、条件样式TableThresholdEdit.vue。第三入口已读尚无枚举来源控件，不能合并为一个公共组件已覆盖。 |
| State/Data Flow | 查询组件selectValue/options通过enumValueObj/getEnumValue加载、handleValueChange传播；图表过滤树enumList与checklist分离并本地includes搜索；结果过滤器按deType 0/5取值。B07-01/03/04。 |
| API/Backend | api/dataset.ts→/datasetData/enumValueObj或enumValue→DatasetDataServer→DatasetDataManage；过滤器multFieldValuesForPermissions→DatasetFieldServer→getFieldEnum(true)。两个主枚举路径resultMode=0为1000，不是5000；对象路径searchText转like进入ExtWhere2Str再查询，其他模式无该limit。B07-02/05。 |
| Persistence | 查询组件配置与已选默认值沿组件保存，过滤条件enumValue/enumCheckField沿customFilter；具体初始化验证→整板查询栅栏及全局保存恢复链未追全，UNKNOWN。修改上限不能截断已有5001选择。 |
| Permission Boundary | getFieldEnum检查数据集READ、withPermissions时列过滤/行权限；对象路径也构造行权限和外部过滤。NULL/blank后处理、跨Provider like及脱敏最终结果须运行，不以存在检查函数证明全三入口拒绝正确。 |
| Existing Tests | 搜索未发现专用枚举测试入口；现有visualization-read-security是模拟权限提供方测试，不能证明枚举真实行列权限。三入口各以6001合成值、5000边界、两身份和逆序响应运行，NOT_RUN。 |
| Evidence Anchors | B07-01–05；B05-01用于第三入口局部缺口。 |
| Reuse Options | D07：查询PC clearable、移动onClear；图表过滤树用户点击clearAll清checklist/checkboxlist已观察到。条件样式清已选未见其枚举入口，当前UNKNOWN（不要由此增加D07能力）。后端权限/方言可复用，5000不是简单替换常量即可交付。 |
| Change Surface | 三入口搜索提交/清空/异步版本、批量解析和存在校验、5000累计容量、后端结果截断提示及初始化编排；请求DTO与Provider语义需保持。 |
| Unknowns | 引号/六分隔批量解析的三入口一致性、实际请求体容量、数值高精度日期布尔比较、Provider大小写/通配转义、初始化失败整板阻断、历史>5000保存；limit前后去重/blank过滤会影响最终条数。 |
| Risk | 高：客户端筛初始集合冒充全量搜索，失败误删选择，权限漏带，旧响应覆盖；中：无limit分支大基数资源消耗与5000误用为批次输入上限。 |
| Recommended Slice | 候选S08：固定Provider及类型oracle，再统一受权限约束的搜索/验证契约，三个UI单独接入验收；清已选仅复用当前可证明入口，缺失不新增。 |

## F08 自定义行汇总

| 固定字段 | 调查结果 |
|---|---|
| Function ID | F08 |
| S00 Requirement/Decision/AC IDs | Q134–Q156 / DEC-134–156 / AC-F08-Q134–Q156；BR-F08-001–012；DEC-SUP-D11、DEC-SUP-SCOPE78(D08)；ISS-AC-03/10/14/15；FX-AGG/EXPR/WEIGHT/NULL/HIER/EXPORT-AGG/FORMULA-LIMIT。 |
| UI Entry | TableTotalSelector→CustomAggrEdit→CodeMirror；row/col四类cfg按指标组织；验证按钮与确定按钮分离，现状不是S00要求的合法表达式自动预览。B08-01/02。 |
| State/Data Flow | 表达式显示名↔ID转译；confirmEditCalc写槽位originName并发onTableTotalChange→renderChart。取数结果TablePivotHandler.calcCustomExpr→customCalc→table-pivot.customCalcFunc/getCustomCalcResult按树形/平铺层级取值。B08-01/04/06/07。 |
| API/Backend | validateCalcField有独立数据源查询，只做当前公式校验；正式CUSTOM通过Quota2SQLObj/SQLProvider/Provider按分组底层SQL查询。普通AVG按前端展示条目平均，不能等价F08加权底层聚合；不同分支/Provider仍待运行。 |
| Persistence | 四组row/col calcTotals/calcSubTotals.cfg各指标槽位；setupTotalCfg重建当前yAxis配置，可丢失不在轴中的项，历史异常需固定fixture。customAttr走JSON保存恢复；没有从此路径观察到每表10条计数/并发保存校验。 |
| Permission Boundary | 校验方法有数据集READ和行列权限；正式图表过滤/权限上下文是否完整传递到每个汇总SQL需验证。表达式允许函数/SQL注入保护在引擎深层尚UNKNOWN；不能仅凭Provider执行成功认为安全。 |
| Existing Tests | 已查tests及可见前后端测试目录未发现专门汇总表达式测试；NOT_RUN。用手算1/3、110条加权平均、三级分组、NULL/除零、无权限列、恶意表达式与执行次数作为独立oracle。 |
| Evidence Anchors | B08-01–07、B-COM-01/02。 |
| Reuse Options | 已有字段点选/列表、函数名称说明和点击插入可复用；D08自动补全UNKNOWN，CustomAggrEdit未开启sqlMode，专门SQL语法高亮局部NOT_FOUND；跨透视表公式模板在已读CustomAggrEdit/TableTotalSelector和对相关目录检索未找到，限该范围NOT_FOUND，不新增。 |
| Change Surface | 右侧汇总方向映射、独立指标/层级计算API、预览版本与取消恢复、保存校验、10条槽位规则、引擎合法性/资源保护及导出一致性。 |
| Unknowns | row/col命名不能代替右侧列实图；10条小计/总计分别计数、历史超限/无效槽位/并发控制；函数方言/非法嵌套/NULL除零；全表缓存影响、仅改一指标总计是否重新查询明细；运行结果旧缓存禁用尚未证明。 |
| Risk | 高：展示值聚合代替底层语义，缺权限/过滤的校验被当预览，整表重算、历史结果复用、非法表达式；中：多层SQL数量放大及空值被nullToBlank后丢语义。3秒是验收指标，不是强制超时。 |
| Recommended Slice | 候选S09：先实图确认右侧与底层SQLoracle，再冻结局部重算/预览/取消协议和D11计数；保留底部现状，不因已有CUSTOM就认定新要求完成。 |

## 待运行见证与交接

各功能至少一条现有主要链路：F05真实S2条件格式及跨字段，F06五区域拖放/撤销，F07枚举选择与清已选，F08当前CUSTOM计算及字段/函数辅助。再覆盖配置保存重开、两身份允许/拒绝、行列权限和导出。全部先由主代理列具体隔离环境、输入、oracle、命令、写入/清理副作用再请求用户确认；本lane没有执行授权。

ISS-AC-08/09/07/10/14/15只取得部分静态连接点；性能ISS-AC-03及真实Provider/权限实现仍开放。没有删除任何S00 AC或将UNKNOWN降格为不存在。主代理应把本报告claim映射至逐条AC；本报告不代替171项映射、最终独立审查或S01收尾。
