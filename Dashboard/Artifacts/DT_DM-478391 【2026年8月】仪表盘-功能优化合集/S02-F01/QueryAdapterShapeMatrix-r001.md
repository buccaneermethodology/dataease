# 查询参数、树与动态日期形态补证

状态：QAR3-02定向设计候选，非设计冻结或产品验收。card摘要2c0c6a610000056a9da207dddd36af9f4e078e14219daba790d80014623b01aa已复验通过。仅新增本文件及QueryAdapterShapeFixtures-r001.json，写前不存在；旧设计/合同/Goal/源码/测试均不改。

## 参数：真实DTO字段和值域

SqlVariableDetails.java:10–30（sdk/extensions/extensions-view/src/main/java/io/dataease/extensions/view/dto）定义全部14个字段：variableName、alias、type、deType、details、defaultValue、defaultValueScope、id、datasetTableId、datasetGroupId、required、operator、value、datasetFullName（枚举内部type不计DTO字段）。以JSON对象实际键为准，不把枚举实现字段混入接口。defaultValueScope为EDIT/ALLSCOPE；id为String，两个dataset ID由字段注解序列化字符串。

core/core-backend/src/main/java/io/dataease/dataset/manage/DatasetGroupManage.java:564–595从数据集表sqlVariableDetails恢复，补datasetGroupId/TableId/FullName，生成ID为tableId+'|DE|'+variableName，deType按type[0]转化。故ID不能人为写p1来冒充完整实例。FieldUtils.java:11–13列出DATETIME时间族。

前端AddSql.vue:569–579（views/visualized/data/dataset/form）新变量默认TEXT及EDIT；util.ts:74–85明确日期类型路径['DATETIME-YEAR-MONTH-DAY','YYYY-MM-DD']。本包用这一受支持值域替换旧占位['date','date']。QueryConditionConfiguration.vue:632–637及913–920把该路径第二项映射为date/daterange；useFilter.ts:525–555按Arr/End从parametersArr取两端完整对象。

JSON参数例提供两个DTO所有字段（nullable字段显式null）、完整引用表和目标转换对象，参数ID不变、组件键chart-A→chart-B、type/默认规则不变。它是源码派生合成响应，不是实际接口返回；展示/宿主全部可选字段不在“消费相关配置”中，不声称可脱离宿主挂载。target必须以同ID核验其真实参数定义；参数同名但表ID不同不能替代。数据源最终SQL参数替换及权限仍未运行，不能据DTO形状宣布端到端通过。

## 树：设计绑定、默认与初始化分开

前端QueryConditionConfiguration.vue:1992–2019确认treeCheckedList是每层checkedFields/Map；2318–2347区分oldTreeLoad历史补全。useFilter.ts:323–332按层收集实际图表字段。因此完整复制应保留层次绑定，重写图表ID键，字段ID不变。

Tree.vue:134–152 init在defaultValueCheck=true时把defaultValue深拷贝到selectValue/treeValue，nextTick记录oldId与multiple，并在无上游FirstItem等待时调用getTreeOption。244–250的dfs消费后端id/text/children并生成value/label；355–363请求fieldIds/resultMode/filter。这允许用合成node-city而非擅自规定后端路径ID编码；JSON显式提供对应合成树响应及精确默认值。

Tree.vue:108–130的ID/字段监听有清默认副作用。本包成功时序以r005拟新增门控hydrate为前提：一次装入完整配置→同步本地oldId/default→再发一次枚举请求；不能把这一提案说成现有普通watch顺序保证。若沿现状裸赋值触发清空，则正例不能通过，仍须实施阶段故障/时序验证。正常用户更改树字段仍保持既有清理语义，不全球禁用监听。枚举空/错误、默认失效与级联FirstItem等待分支需后续覆盖，本最小无级联例不覆盖这些分支。

## 日期：首次消费入口与条件性精确结果

首次查询不是父Component挂载即resetData。hooks/web/useFilter.ts:398–407明确要求timeType=dynamic、displayType 1/7、firstLoad且defaultValueCheck；单日期调用getDynamicRange，随后把第一个epoch转Date写defaultValue/selectValue。Time.vue:175–180的init只是读取默认，148–172用户修改会format再toLocaleString，涉及浏览器locale；不能混为同一路径。

time-format.ts:31–33 getToday取dayjs().startOf(day)，93起getDynamicRange中today分支（约158起）对date返回起点和起点+86400000-1000。本包固定UTC与2026-10-16T12:34:56Z，手算区间为2026-10-16T00:00:00Z至23:59:59Z，JSON给精确epoch。首次赋值Date均为当日00:00，不是把结束时刻写selectValue。复制持久规则仍是today；目标稍后执行应重算，而不是复制源Date结果。

此结果依赖dayjs当前时钟与new Date斜杠字符串本地解析：是条件性源码推导，未执行浏览器。不能外推DST日、其他时区、locale存储恢复。最小剩余oracle为指定浏览器版本+UTC+固定时钟直接运行原函数及firstLoad调用，观察epoch和Date；DST/locale另列适用回归。不要求用户重新裁定日期语义，也不永久拒绝合法动态日期。

## 已验证与上限

已验证card摘要、JSON解析、参数DTO键集合、typed目标键转换、树默认/字段保持以及UTC epoch算术；所有样本显式标源码派生合成，产品/权限测试NOT_RUN。参数生成和值域、树绑定及无级联初始化、首次动态日期重算均增加了可定位证据。未证明实际宿主全配置挂载、真实getSqlParams响应、Vue监听时序及数据库/权限行为。DG-03及原16项产品义务保持，由独立审查裁定可接收部分。
