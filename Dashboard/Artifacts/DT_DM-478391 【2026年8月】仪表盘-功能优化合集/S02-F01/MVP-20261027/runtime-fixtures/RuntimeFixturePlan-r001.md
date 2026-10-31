# 49类型真实验证数据准备

当前只有准备资产，运行分母49、通过0；不把体验01首条真实链自动写成这份新数据集的49类型通过。

CSV从隔离demo_tea_material只读30行生成。id、amount、date、purpose、shop原值保全。其余列明确是合成测试数据：按(id-1)%3轮转深圳/杭州/南京及公开城市中心坐标，end按id%3取下一城市；series按id奇偶；open=amount、close=amount+5、high=amount+10、low=amount-10、target=amount+100、quantity=id%5+1。坐标不是用户或门店真实位置。导出UTF8 BOM、19列、30行；逐行字段名与公式以CSV和source JSON为准。

独立原SQL oracle中的两个条件：amount>200 AND OR(shop六枚举)，匹配14行，金额6761，13个日期聚合。CSV保留原五列，所以这些基准仍适用；导出后独立重读CSV验证30行和6761。它不是被测API反推expected。

下一步使用产品正常UI导入CSV，命名S02_MVP_Runtime_20261027；创建独立测试仪表板，不改S01资源。实际dataset/field ID只能读取真实字段目录，新native RowAuth两条件树必须真实UI产生。普通维度类用shop/series，时间类用date，地图用province/city或经纬、flow用起终点；stock用open/close/high/low，范围用low/high，多指标用amount/target/quantity。按每类真实轴约束建立合法view，不直接把bar配置改type冒充合法图。

每type分别留下真实source复制、target粘贴、一次候选query的调度/结果、画面、显式正常保存、离开重开；family只是顺序。可在合法转换保留真实字段后按type轮转，但任何配置/资产/查询不可用都记NOT_RUN/BLOCKED，禁止删行。富文本与图片实际组件入口分别验证；图片正向须threshold=true与确定图片映射，静态OFF另列兼容。真实权限始终未验；本机admin只证明后端业务链。

插件installed未知仍null，401不是0；当前xpackModel实测data=null使产品catalog门关闭。后续须从正常认证产品目录核实安全metadata，不能读token/专有源码或永久按pluginflag排除。
