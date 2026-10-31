# 技术依赖补查 B：ISS-AC-07/08/09/10/14/15

本轮仅文档补查；卡片摘要 `11f989cf0fe2c08fb14dc23a9e669ab0bc75e554e94ad56aab2441bed6336756` 与专用 admission 已验证。主仓库HEAD仍为 `a11d4f1278e12c2bea0d9d4000537d7d8f868f0e`；以下绑定当前工作树摘要。本轮没有启动服务、测试、连接数据或修改产品。B2c是既有运行证据的读取，不是本lane重新执行或独立复验。

## ISS-AC-07：枚举与既有语义

**已查明的实现（OBSERVED/static_read）**：E25/E26两个请求DTO的resultMode默认0；E07中getFieldEnum及getFieldEnumObj在该分支构建limit 1000查询，非0分支不加此limit。该结论不泛化所有选择器，也不等于S00的5000规则已实现。对象枚举searchText非空时选query字段（一个ID）或第二个display字段，构造like条件；E08将like值包为`'%值%'`，字符串由Utils.transValue处理。大小写及数据库通配行为仍由实际方言/排序规则决定，不能把前端includes当数据库oracle。

E07读取数据后移除包含blank字符串的行，再去重；因此NULL、空串和纯空白不能在此路径简单视为正常可选值。过滤树E09的本地搜索是JavaScript includes；批量addFields只按换行split、trim、跳过空行，以Set去重并追加checklist，没有在该函数调用服务器做逐值存在性校验。它不是六分隔CSV引号解析器，也不是带类型/权限逐项校验的F07最终输入协议。三入口不得共用一个“已支持”结论。

**缺口处置**：实际HTTP请求容量无此DTO级长度约束，不能据此报告无限；容器/代理请求限制尚未固定。Owner为S01环境调查与S08设计：固定目标Provider/排序规则后以Abc/abc、百分号/下划线、NULL/空串/空格、高精度数值和日期/布尔向量记录响应；读取部署层请求限制再设计容量边界。保留ISS-AC-07为部分已解决，剩余是具体Provider/type/请求上限oracle，不再把当前1000、换行解析、blank过滤列为未知。

## ISS-AC-08：F05现有支持与历史配置

E11的initFields确实收集透视行/列/指标，目标custom由targetFieldId指定；E13把字段ID解析到目标列并区分明细/汇总scope，提供实际渲染分支而非仅候选数组。E13的sortTableTargetRules明确“后配置优先”：同字段按conditionIndex逆序，跨字段按fieldIndex逆序。这是当前行为，与Q076–078要求确定冲突拒绝保存不同，不能写为冲突机制已完成。E12保存检查字段/条件/作用域/数值后复制到thresholdForm；已读范围未见20条计数、规则版本或新旧冲突豁免标记。

历史缺字段处理有具体风险：E11初始化会把失效来源fieldId、失效目标targetFieldId设null并发changeThreshold；这不是“无效原配置原样保留”的证明。B2c R01仅证明明细id>3背景命中4/5且保存重开仍在，不是透视字段全矩阵、跨字段、总计及历史>20验证。

**后续owner/步骤**：S06设计与S01运行复核分别负责历史fixture合同与现状oracle。建立旧配置（同属性重叠、>20、字段删除、同ID改名）读取前后JSON差异；在真实透视行/列/指标和目标custom四组合记录S2结果。禁止为了测试自动删除旧规则。Q072来源、Q079七属性、Q087预览仍是明确需求，不被保守复用范围取消。

## ISS-AC-09：区域容量与拖拽撤销

**容量现在可作精确局部结论**：E02/E03重写axisConfig，普通表xAxis/yAxis及透视xAxis/xAxisExt/yAxis均未设置limit；E04管理器直接返回注册实例，没有合并默认轴配置；E05基类构造器也不合并。E01 addAxis直接解构该axisSpec并比较`数组长度 > limit`。在这五区域limit为undefined时该比较为false，故**当前所追踪的addAxis容量分支不施加数值上限**。不是K=5，也不是产品所有资源无限。父类其他图表yAxis的limit=1不会自动合并进子类覆盖对象。未检到其它axisConfig defaults/merge赋值。

E01按groupType做角色拒绝，重复以字段ID识别；原生drop克隆选中项逐项插入，成功游标前移。选择集合区分维度/指标，跨角色选择清另组。不能由这些实现推出跨区移动源删+目标入原子性。

**吸收B2c（runtime_observation，来源R01–R04）**：在现有region行维度上Meta选择category和enum_text，一次拖入形成三字段，一次撤销回region。它证明该同类双字段/透视行区场景能复用既有撤销，不应继续报告“完全没有撤销见证”。E06 undo/redo回放整体component snapshot；不推广为任何批次都恰好一个历史单元。其它四区域、部分失败、无效取消保选及跨区移动仍需分别见证。

**Owner/步骤**：S07设计以“此链没有数值容量分支”作为当前基线，不杜撰K；若未来确需新增上限另走需求/设计。S01运行者按同fixture对普通两区/透视另两区、重复/角色拒绝、取消拖放、跨区失败各保存前后配置与请求次数。原子性只对具体源删目标入操作验收。

## ISS-AC-10：数值与资源保护

E20把计算字段交给Utils.calcFieldRegex，E19递归解析引用，深度计数大于100抛循环引用错误；这只是字段引用递归保护，不是表达式复杂度完整防护。已读路径不是独立函数白名单/聚合嵌套验证器：不得声称SQL注入防护已充分。E17 getData每次构造SQL并Provider.fetchResultField，nullToBlank把返回null转空串；E03 CUSTOM对空串/undefined展示“-”，对null返回null。合法除零是否异常或NULL由Provider决定，当前不能承诺所有方言单格隔离。

资源阈值已找到：E22数据源Configuration.queryTimeout默认30；E21非跨源路径把配置queryTimeout传给Statement/PreparedStatement并setQueryTimeout。是可配置的JDBC查询超时（秒），不是F08三秒验收指标。跨源fetchResultField可见分支直接prepareStatement/executeQuery，此局部未显式setQueryTimeout，连接池/Calcite其它层限制未确认。不能把普通源30秒泛化全部引擎。

**Owner/步骤**：S09引擎设计验证函数/聚合合法性和空值传播；S01运行选择当前Provider，用手算加权/NULL/零除/CASE等fixture记录返回值、是否整请求失败及单元格显示，再测取消/晚响应。资源保护需分别读取隔离数据源有效queryTimeout及跨源连接设置，不为查询生产配置读取凭据。

## ISS-AC-14：10槽位、旧配置与并发

E14存在row/col各calcTotals/calcSubTotals.cfg四组；setupTotalCfg按当前yAxis重建数组，保留同dataeaseName的aggregation/originName，缺配置默认SUM，已不在yAxis的槽位不再回填。E23/E24是普通List与字段DTO，没有10条注解；E17 getCustomFields只处理当前指标且aggregation=CUSTOM的条目；E18保存JSON至snapshot repository，所读save方法未见跨四组计数/锁/版本检查。

因此当前明确结论是：**该UI→DTO→Handler→save连接链未实施D11每表最多10条自定义公式计数校验**。有四组数组不等于已满足10条；指标数、小计层次数、公式文本去重都不是D11分母。已有setupTotalCfg按轴重建与D11历史超限保留要求有兼容风险。不能自行截断为10或把相同文本合并。未声称整个应用不存在通用并发机制；本链没有发现专用槽位并发约束。

**Owner/步骤**：S09技术合同须在设计中区分右侧目标的总计/小计各占一条、无效/停用仍保存项的工程状态、删除释放、9/10/11以及历史11条。两会话并发保存需后端集中计数与版本策略设计后验证；当前没有实现可运行证明，不用模拟自造一个已存在上限。

## ISS-AC-15：D07/D08逐项复用裁定

| 能力 | 当前证据结论 | 缺口/处置 |
|---|---|---|
| D07查询组件清全部已选 | 静态已有PC clearable及移动onClear清selectValue（E10）；B2c查询多选清空恢复650（R01） | 仅该现有场景，非5000边界与三入口全覆盖 |
| D07图表过滤树清全部已选 | E09 clearAll清checklist/checkboxlist，模板“已添加”旁按钮调用 | 静态已有；待现有入口一次UI见证 |
| D07条件样式清全部已选 | E11已读未见枚举列表/清选择入口 | 局部NOT_FOUND；不把UNKNOWN扩大成全产品不存在，不新增D07入口 |
| D08字段列表/点选 | E15字段列表点击插入[name]，已有 | 仅复用；实际候选权限由后端另外验 |
| D08函数提示 | E15从getFunction读列表，弹层含name/func/desc并点击插入 | 已有函数说明/手动插入；不是键入自动补全 |
| D08自动补全 | E16 basicSetup存在，但E15未传sqlMode，也未见自定义completion source | UNKNOWN：通用编辑器默认不等于公式语义补全；缺失不新增 |
| D08语法高亮 | E16只有sqlMode=true才加载sql()；E15无参调用 | 专门SQL语法扩展在本入口NOT_FOUND；字段占位色块不是SQL语法高亮 |
| D08跨透视表模板 | 已读E14/E15未见模板读写/套用API，相关目录模板检索只有Vue template标记 | 本入口NOT_FOUND，不能以函数列表代替模板；按裁定不新增 |

## 搜索边界与交接

本轮实际搜索主前端chart/js/panel及editor中的axisConfig/limit/merge/defaults、条件编辑器20/conflict/version/preview、TableTotalSelector与Table DTO/Handler的10/size/limit、DatasetDataManage搜索/截断以及engine/trans、engine/utils和CalciteProvider超时。未读XPack私有实现，未接触凭据。产品源码工作树该范围git status未显示修改；已有B2c记录按原上限继承。

结论是六项依赖的**静态事实已细化、局部运行证据已吸收**；剩余均列明具体owner和步骤。不能据此关闭全S01或把未来S06–S09需求标为已实现。导出全表型、图片容量及MB单位不属于本卡分配的六项依赖，交由负责ISS-AC-02/04/05的lane，避免重复或越界定论。

## 固定证据索引

下列SHA-256绑定本次读取字节；行号为定位区间，后续漂移必须重新定位。

| ID | 路径与行号/符号范围 | SHA-256 |
|---|---|---|
| E01 | `core/core-frontend/src/views/chart/components/editor/index.vue`：353–355、643–696、762–899、1941–2103 | `0a8d78ffce297d941cd2d42c4240d0f266bac53926360d2bf83c6134a641f39d` |
| E02 | `core/core-frontend/src/views/chart/components/js/panel/charts/table/table-normal.ts`：98–108 | `871c996326fcd319596fd3d09d0f029f3d8c3125f388011f1d316f8a8d75c4ab` |
| E03 | `core/core-frontend/src/views/chart/components/js/panel/charts/table/table-pivot.ts`：215–229、1079–1135 | `9a8950d42b449438cbf104784cc435bc892b1e7aa7a18c4f1c9b0272b3b7c95a` |
| E04 | `core/core-frontend/src/views/chart/components/js/panel/index.ts`：4–39 | `4cc0f5c25718d030c4b6b5e1607b8fa4cae0c80142c4a464087ab411c9cb7ac5` |
| E05 | `core/core-frontend/src/views/chart/components/js/panel/types/index.ts`：27–64 | `31bcaf1e0ba29e9d6fac2c7a370247c25fdb533b40e6ee176cc2882021fd8376` |
| E06 | `core/core-frontend/src/store/modules/data-visualization/snapshot.ts`：87–126 | `c2f225df687f0aa606419684a73dd03a9b9e19b04f4ed532dbfb9c6261f78157` |
| E07 | `core/core-backend/src/main/java/io/dataease/dataset/manage/DatasetDataManage.java`：715–835、853–1095 | `5552c9b9f28e531ed2946c2501169decc27a7820b3eb47eb50388adad9f12f7d` |
| E08 | `core/core-backend/src/main/java/io/dataease/engine/trans/ExtWhere2Str.java`：208–230、381–422 | `1b4b73d7be0b4d05e852eba3bc149d9a64ef83998faf7327537f04baaa69b16e` |
| E09 | `core/core-frontend/src/views/chart/components/editor/filter/auth-tree-chart/FilterFiled.vue`：75–76、367–373、431–442、704–709 | `772a4ba9b0702a26891e7a9c290ea9be875d0807598ec15497e64924df8fa0e0` |
| E10 | `core/core-frontend/src/custom-component/v-query/Select.vue`：278–400、889–972 | `0aef2907019552e4b00a2762cd69fc60b8a13d6b3941a3e5b9b19a5667125bb4` |
| E11 | `core/core-frontend/src/views/chart/components/editor/editor-senior/components/dialog/TableThresholdEdit.vue`：238–360 | `058e56d0cc1977f9d23695a940830c74e2fc7861d41167bef4bcd62ae6c86cf7` |
| E12 | `core/core-frontend/src/views/chart/components/editor/editor-senior/components/Threshold.vue`：177–282 | `cd115fb4dd57b927992136242304eecc848fa41e3f2dca081335bc6c78a75a5c` |
| E13 | `core/core-frontend/src/views/chart/components/js/panel/common/common_table.ts`：936–1070、1183–1191 | `71268df9a19aea83ec285083797cc18ad16f19e4648438ea9ab8c29486480d1a` |
| E14 | `core/core-frontend/src/views/chart/components/editor/editor-style/components/table/TableTotalSelector.vue`：139–300、484–582 | `458ef02a7315d3fa09eab94eda6f69758974801b96745efb039ac5d5ade9a019` |
| E15 | `core/core-frontend/src/views/chart/components/editor/editor-style/components/table/CustomAggrEdit.vue`：77–103、156–184、319、397–410 | `2fba53718d3a31ced75315d5d4bd877277236edbb4d7d56552e4a0d156b05193` |
| E16 | `core/core-frontend/src/views/visualized/data/dataset/form/CodeMirror.vue`：27–142 | `6c40e47263c0811955fd69086b1c43ab8f077ed496d9da79710733ad9663baef` |
| E17 | `core/core-backend/src/main/java/io/dataease/chart/charts/impl/table/TablePivotHandler.java`：80–270、318–366 | `09d4a2cd7397cfb9f6ffa1bc19363e431dc11d127d6857d9c66fa945c518f617` |
| E18 | `core/core-backend/src/main/java/io/dataease/chart/manage/ChartViewManege.java`：93–108、519–571 | `82e680456f5490e2ffb6a3cb858fd2debe635f500d61242205443b83d931598c` |
| E19 | `core/core-backend/src/main/java/io/dataease/engine/utils/Utils.java`：51–146 | `0c01c74a2c4e1ebd03c0889d9191735cde7b8a9d1e82fa4b8e38f6a7cba08bc9` |
| E20 | `core/core-backend/src/main/java/io/dataease/engine/trans/Quota2SQLObj.java`：27–138 | `253df13277f96d9bdce368edd774a8ca803716b7feb369bf7ac169b777e56ce3` |
| E21 | `core/core-backend/src/main/java/io/dataease/datasource/provider/CalciteProvider.java`：287–330、807–820、2028–2066 | `11fa8f5df93fbd41a870439aad76869a2a8796fe4774ec73a8b84b8b74eb435e` |
| E22 | `sdk/extensions/extensions-datasource/src/main/java/io/dataease/extensions/datasource/vo/Configuration.java`：41 | `e2d18b47a8fd667e755657ec7acabc9ddda4c42dce5a38fe3e94df3653764975` |
| E23 | `sdk/extensions/extensions-view/src/main/java/io/dataease/extensions/view/dto/TableCalcTotal.java`：1–11 | `f74252ad08e537be2144235e0fb12fca168da8f77fb8c7e7dd2dc43f202e009d` |
| E24 | `sdk/extensions/extensions-view/src/main/java/io/dataease/extensions/view/dto/TableCalcTotalCfg.java`：1–14 | `aa6f61e4556a9c8579db429fc230ed676775d4b0878977d8241ad2b552551ef6` |
| E25 | `sdk/api/api-base/src/main/java/io/dataease/api/dataset/dto/MultFieldValuesRequest.java`：1–17 | `93e31dc3d40bd656ea0fbd7b5b112ce6f715a4f4b59382fb56dc7294c37cbfc8` |
| E26 | `sdk/api/api-base/src/main/java/io/dataease/api/dataset/dto/EnumValueRequest.java`：1–20 | `5e710393ee609c76b1ddcd3bc62902779092aa3d3e58d2308cd155abfdd9c8ba` |
| R01 | `Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/SP-005/B2c-Runtime-Result.md`：实际结果及范围 | `20976fe2bfd430087b8b6ea2463aa1c33b71486c80aeedc9f4bf3f13b8ed0cfc` |
| R02 | `Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/SP-005/B2c-multidrag-case.json`：完整 | `6f1b27feab5508ec253cd5f8041961ab3b35bc5451b8f711e5078859c5fd7ad2` |
| R03 | `Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/SP-005/B2c-multidrag-dom.txt`：完整 | `444254b2b494133121c649dcdf4f117ea306ca39dd35084d569b20de6dc20bcc` |
| R04 | `Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/SP-005/B2c-multidrag-undo-dom.txt`：完整 | `d042bcb42f30b727ff55f8402d8844046c8673dcc447a0ce3499d4e0e125a540` |
