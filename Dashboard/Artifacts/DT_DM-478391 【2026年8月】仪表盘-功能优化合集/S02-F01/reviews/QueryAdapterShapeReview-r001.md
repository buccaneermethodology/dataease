# 查询形态补证独立审查 r001

## 裁定与绑定

审查者 `/root/s02_goal_review`。卡片expected canonical digest `029701c78791e8e3da06c394a5f587f926d634549f9b076830656c142c52e3d7`重新validate通过。Matrix摘要 `5e307afd225d09ca512f5d9443a8e171400aa66b02d844e5682fabdb010c9a17`，fixture摘要 `6b5cdaa318e7e60850b602311bcc45687cde15356293c97a34de171cc18be052`。

`PARTIALLY_ACCEPTED / QAR3-02_PARTIALLY_CLOSED`。参数DTO/类型路径与条件性UTC日期oracle可接收为源码派生设计证据；树正例仅达到显示/初始化层，其ID未满足下游多层过滤消费，不能关闭完整形态缺口。未运行产品或接口，不授予Builder准入，不声明权限或Goal验收。仅新增本报告。

## 分项处置

| 项目 | disposition | 独立核对结果 |
|---|---|---|
| 参数DTO和值域 | CLOSED_AT_SOURCE_DERIVED_DESIGN_LEVEL | SqlVariableDetails.java:11–27的14字段、枚举EDIT/ALLSCOPE及ID序列化与对象相符；DatasetGroupManage.java:581–594支持tableId与variableName组合ID及类型转换；util.ts:74–85支持DATETIME-YEAR-MONTH-DAY/ YYYY-MM-DD，配置面板typeTimeMap支持date/daterange。新例已替换旧date/date占位，不应继续以该旧缺口阻塞。 |
| 参数目标投影 | ACCEPTED_WITH_PRECONDITION | fixture:161–289组件键重绑与参数ID保留一致。target真实同ID元数据被明确列为前置，未当实际API响应。useFilter.ts:525–555确实按两端ID从parametersArr选择完整对象；尚无最终SQL或产品运行结论。 |
| 树绑定与初始化 | PARTIALLY_CLOSED | treeCheckedList双层重绑、默认赋给select/treeValue、oldId与请求字段均符合配置面板及Tree:134–152、355–363。门控时序明确为候选，未冒充Vue现状。下游过滤oracle不成立，见QAS-01。 |
| 日期today | CLOSED_AT_CONDITIONAL_SOURCE_ORACLE_LEVEL | time-format.ts:31–33、149–151在固定UTC下给当日零点与+86400000−1000；useFilter:398–407在对应firstLoad分支把起点转Date。独立UTC历法核算起点1792108800000，终点1792195199000，fixture数值一致。浏览器解析、真实调用与DST/locale仍NOT_RUN，不能由此升级运行证据。 |

## 发现

### QAS-01（P2）：合成树ID只满足渲染，不能代表两层过滤成功

依据：Matrix:17–21；fixture:300–440，尤其defaultValue=node-city、两层treeFieldList/treeCheckedList。Tree.dfs:244–250确实将任意id变成value，但实际查询useFilter.ts:126–138会把-de-分隔改成逗号；97–110的getFieldId随后按值的位置选择relationshipChartIndex及字段；511–514把结果写入过滤条件。

对本例按源码推导：默认值node-city不含两层路径，转换仍为单段node-city；relationshipChartIndex为[0,1]，有效indexArr只剩[0]，最终fieldId为f-province，value为[node-city]，f-city层丢失。它不能证明浙江/杭州完整两层过滤；“ID均合成”诚实声明不解决消费契约错误。这里没有运行JavaScript或产品，结论为明确代码路径的静态推导。

影响：若将该fixture冻结为完整成功oracle，Builder可通过显示默认值/对象相等测试却输出错误图表过滤。

处置：OPEN，承接QAR3-02树默认值编码/完整消费缺口。最小动作：沿getFieldTree真实开源生成实现核实节点ID编码，给同一源/目标形态的合法响应、默认值及最终searchQuery过滤对象，明确两层字段和值均保留；无需先访问生产或真实权限。现有初始化片段可保留为明确的显示层测试，但不得标完整查询正例。

### QAS-02（P3）：日期源码定位偏差

依据：Matrix:27称today约158起；实际today分支是time-format.ts:149–151，158处是yesterday末尾。fixture引用93–165覆盖正确分支，所以不影响上述日期推导。

处置：非阻塞文档修正；下一修订将精确定位改为149–151，不改历史冻结文件。

## 范围与后续

作者正确区分源码派生合成、条件手算与产品运行。参数/日期新增材料已提供可复核设计依据，不应仅因尚无浏览器实测而要求其先完成实现才能继续设计；运行验证仍是后续独立门槛。树oldTreeLoad既有分支结论沿前审保留，本包无新增完整历史分支消费例。无P0/P1。

完整查询设计仍受QAS-01及此前QAR4-01/02等独立缺口约束，本报告不重新裁定其他包。DG-03与完整产品分母保持；真实权限、宿主挂载、Vue门控、实际响应和数据库执行均未在本次验证。
