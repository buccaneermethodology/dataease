# 剩余地图类型测试数据准备 r001

本材料是后续隔离测试的准备记录，不是设计冻结、Builder准入或地图运行验收。P1 12 + P2 26 = 38项及49种图表分母不变。

## 已核实的字段契约

- FlowMap.axisConfig要求起点xAxis两维、终点xAxisExt两维；不是一个拼接经纬度字符串。可选起终点名称各一维，线宽为指标。
- HeatMap.axisConfig要求xAxis两维与yAxis一指标；后端ChartDataBuild.transHeatMapChartDataAntV逐行将row[0]、row[1]转BigDecimal作为x、y。因此维度必须保留独立且可解析的经度、纬度值，不能用shop替代。
- SymbolicMap.axisConfig要求两维，前端source parser直接以xAxis[0/1].dataeaseName作为x/y。
- 已冻结TeaMaterialExtended-r001.csv已经包含longitude、latitude、end_longitude、end_latitude四列；均为合成测试地理值。当前UI目录把数字列归为指标的运行障碍尚未解决，不能据此断言产品要求将经纬度拼成单字段。

## 后续最小准备步骤

先在正常数据集UI核查数字字段是否支持在单图表中作为维度，或者新增明确的文本计算维度。若已有机制可用，优先保留同一个隔离dataset身份和既有shop/amount过滤字段ID。若需另建数据集，必须为该数据集另配源图表、目标图表与过滤树，不能跨dataset粘贴旧树。

不得改写已冻结CSV。必要时派生新fixture并记录原始SHA、转换规则和独立oracle；四个坐标分别保留，数值可解析并在合法范围。世界村404与经纬度目录是两类依赖：前者需先核对合法地图资源，不能把后者或shop替身当作修复。地图资源不可用时保留NOT_RUN或失败，继续其他MVP场景。

## 当前证据上限

本次只读核对生产源码和CSV头部。未修改数据集、产品源码或地图配置；未运行这五类地图，不增加44/49局部角色观察数或0/49完整类型通过数。
