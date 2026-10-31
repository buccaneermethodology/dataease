# 符号地图代表明细过滤继承最小修复设计 r001

## authority、范围与声明边界

原Goal完整38项不变；关联AC-MVP-F01-08/-09/-12及原AC-S02-04/06/08的过滤查询正确性。触发来自真实symbolic-map复制后HTTP响应：顶层三地金额1982/1243/1868符合500阈值和六店条件，但details代表项包含id2蓝墨店/id1欢果店，均不在六店。独立证据审查CMV-N02已确认。该切片保持现有过滤规则在代表明细查询中的应用，不增加原Goal AC、不删减完整分母；不修真实权限或图库生命周期，也不把新发现自动扩展成全局框架。

## 当前源码与根因链（静态事实）

- ChartDataManage.calcData在调用Handler前构造SQLMeta，依次设置customWheres、extWheres、whereTrees及各dialect映射；这是当前图表/外部过滤/行权限SQL片段的既有传递边界。
- SymbolicMapHandler.calcChartResult在任何轴变换前已复制sqlMeta→sqlMeta1；聚合查询使用带过滤的sqlMeta。代表明细分支却new SQLMeta sqlMeta2，仅设置table和全字段投影，原sqlMeta1未使用，遗漏全部过滤片段及dialect映射。
- SQLProvider.createQuerySQL(meta,false,needOrder,false)只会加入meta现有的customWheres/extWheres/whereTrees，不会从view重新补过滤。Provider.rebuildSQL依赖相应dialect映射替换计算字段占位。
- ChartDataBuild.transSymbolicMapNormalWithDetail明确每坐标组只返回第一条代表明细，并把其气泡度量覆盖成聚合值。这是现有公开输出语义；本切片不将details改成完整明细列表，也不将amount改回原始行金额。

## 最小实现输入

在代表明细sqlMeta2创建后、原Table2SQLObj/Field2SQLObj前，用既有BeanUtils.copyBean把**轴变换前的sqlMeta1**属性复制到sqlMeta2。保留原table重建、投影、provider重建与取数、分组/排序、DTO和代表明细组装。复制保留全部既有过滤片段和dialect映射，避免手抄六字段遗漏；不复制轴变换后的聚合SQLMeta来混入聚合轴/排序/指标。Spring BeanUtils浅复制仅用于只读既有filter值与map，后续Field2SQLObj替换自己的xFields/dialect对象，不就地改变原过滤map。若测试证明存在别名冲突/输入污染，停止Builder并修订本设计，不扩大为SQL框架重构。

生产写域仅SymbolicMapHandler.java该局部；测试写域为src/test/java/io/dataease/chart/charts/impl/map/SymbolicMapFilterRegression.java及必要局部runner说明。禁止改ChartDataManage/SQLProvider/权限替补/XPack/SDK契约/图表DTO/ChartDataBuild、数据库表或持久化数据、L7代码及冻结Design/Cases。

## ERBE与验证计划

绑定Cases-r001：8种custom/ext/row片段开关组合、全空结果、三组dialect占位替换、跨数据源生成分支共11例。每例用独立固定6行合成数据和独立WHERE预期计算匹配行、坐标聚合；运行真实Handler→SQLProvider/Field2SQLObj→Provider边界。可复用本机现有打包依赖和H2内存连接，Provider的外部连接边界显式seam；执行生成的SQL，不把字符串包含断言当数据正确性。SQL重建seam仅调用真实占位替换helper而不连接外部数据源。ChartViewManage计数字段及DatasetDataManage命名边界可mock，其余Handler/SQL生成/结果组装真实执行。

先编译精确写前源码，要求execution正常且按details SQL漏过滤指纹失败，保留无过滤正对照；冻结runner/fixture/写前字节后才改生产代码，GREEN复用同一identity。测试必须验证聚合值不变、代表ID属于匹配集合、details长度仍≤1且amount仍为聚合值、原filter/map不被污染、Provider收到对应dialect映射。H2是查询逻辑见证，不代表MySQL/跨库供应商或真实行权限验收。

最小源编译使用Java21及已安装/现有jar依赖，输出仅/tmp，不手工改target或二进制。若构建环境可用，再按现有standalone流程局部编译/打包；任何前端产物move或真实服务重启必须先说明隔离范围并消费对应环境准入，不能把编译结果算runtime。现有8100在运行，Builder不热补jar、不改SDK二进制。真实UI修复后验证需要实际加载由源码构建的新后端；未实现前保留NOT_RUN。

## 风险、残余与预算

当前是设计候选，尚无新实现/RED/GREEN。本交付物设计审查第1/3轮，要求一次查全全部问题、无问题维度、未查原因、同类残余与准入预测。原C2已3/3的卸载/通用异步残余不重开、不归入本backend交付物。ubo仅正常离开复现到WebGL缓冲更新，尚不能断为该缺过滤造成；没有由本设计修复它。原SQL指标HAVING、计算字段/方言和真实多用户许可仍须按原合同分别验证，不从合成whereTrees推断真实权限。
