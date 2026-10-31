# P2/S046 原生动态日期完整规则复制设计输入

P1已实际独立有界接纳12AC/49指定基本配置，原Goal要求继续P2原26。当前切片对应AC-F01-Q012/Q015及AC-S02-02/03/04；只准备图表→图表同dataset的原生动态日期规则完整保留与既有准备采用链复用，原26均不因本切片关闭。真实权限来源BLOCKED，当前不使用standalone或DEV代验真实鉴权。

这是新明确有界原生源事实设计，不重开旧Authority Materials/Chart Payload等已耗尽整包第4轮。先定位当前真实FilterTree→chart RowAuth/FilterFiled→TimeDialog/DynamicTimeForViewFilter→API DTO→CustomWhere2Str链，列全部相关callers。不是用纯guard的抽象model推产品schema。每个rule字段/枚举/default/Date或字符串转换/用于display或计算/空值/持久化值及后端解释须给source path+line+SHA。TimeDialog around默认注释和实际枚举/后端可能不同，按真实执行链辨析，不抄注释当oracle，不改既有日期计算策略。

最小设计目标：不把动态规则物化成当前结果，完整独立复制原树/规则，候选query/预览准备成功再采用，失败/非法/未知结构整次拒绝并保原clip/目标；沿现有MVP Editor/service与权限port，不开新的Store/UI/双host框架，不修改backend日期算法。原系统参数/查询组件/跨context/权限/容量等其它P2责任保留，不因本切片未覆盖而删掉。

请先判断可定位的原生year/month/date/datetime相对规则和arbitraryTime精确值域；以可证current native语义形成最小完整可执行slice与案例，确实未知的规则/epoch/timezone/Date-wire输入标blocked_oracle和最短源观察方案，不自行加业务限制或默认策略，不把全部更严建议变must-have。若源事实足够，给候选Design/机器Cases、逐AC轴/正反例/深拷贝及独立查询oracle/纯逻辑→Vue真实入口→实际UI/query/save/reopen验证方案与精确写域；设计仅candidate，待独立审查/正式admission方可Builder。

只读源及已存在证据，禁止UI/HTTP/DB、运行测试/构建/安装、产品源码/旧合同/旧报告修改。允许输出本目录Design-r001.md、Cases-r001.json、SourceTrace-r001.json、ValidationHandoff-r001.md。Case含原case identity/shape/value域/前提/明确oracle/evidence ceiling/无法判定项，不用case名称或mock result冒充验证。所有问题一次列全，声明已核/未核/同类残余及下一准入条件。本新设计交付物review最多3轮，当前尚0轮。
