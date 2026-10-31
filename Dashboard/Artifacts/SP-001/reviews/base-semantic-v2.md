# SP-001 架构与扩展导航独立复验 v2

- 审阅者：`/root/pre_review`，独立于root修正者。
- 时间：2026-10-14T02:40:06.107965+00:00
- 卡摘要：79984de5f120de4e87c9bea8968bfad60ecd0d45bf33af4d6f5695596e1681c7，接收端复验 pass。
- 对象：integrated-v3/architecture-extensions.json，摘要76318bad2ec5d2217d796ec8a3c55af5ddaeb7ed46ed54b6892db59bc10b5df2。原base候选摘要仍为2a981b434bfa458b0a4a6ce2af0109d0a51894c3afcfbdf8fc737b3de99d5cdf，未改写。
- 本轮实读：新增BASE-040–048全部9个事实切片；复读BASE-027模式分支；核对BASE-028新增引用；比较能力/关系差异，复核全部48事实来源摘要均匹配。沿用v1未改部分的逐项语义结果，不声称重复全文件通读。

## 结论

**PASS WITH FINDINGS（修正内容通过，仍有两项前轮尾项）。** F21/F22原范围恢复、测试关系修正、领域及权限术语和基础影响关系均可保留。BASE-027缓存条件措辞仍应修正后正式准入；F20静态访问面的覆盖须在全库总账对齐。不能把此报告作为全库核心链或Goal最终通过。

K01/K10按全库核心契约与本篇共同交付评价，不要求此导航篇单独成为全产品手册。实体/操作资源术语补充解决原先仅列域标签而无相关知识的主要问题；不因此认证未读取的全库核心语义或不可见企业实现。

## 前轮发现逐项复验

|发现|结果|依据与剩余动作|
|---|---|---|
|B01 插件引用|部分关闭|BASE-027已改115–158，BASE-028增加showNolic:22–25，引用缺失已修；但BASE-027仍写“其他模式读取xpackModel”，未说明缓存分支。|
|B02 F21/F22遗漏|关闭（导航深度）|恢复完整名称；F21新增BASE-040及实现关系；F22新增BASE-041及关系。保留未运行与不覆盖全部参数矩阵边界。|
|B03测试误作实现|关闭|F20.implementation只剩BASE-033/034，BASE-037转入tests；BASE-R-F20-2改为BASE-037→F20的TEST_ASSET_FOR。|
|B04域内容不足|主要修复，整包对账仍必需|BASE-042–048增加领域/操作/资源词汇；三个CHANGE_IMPACTS关系补最小影响导航。K00最终provenance/维护内容及K01完整覆盖由整包负责，本报告未认证完整性。|

## 新增事实核对

|事实|亲读来源与范围|独立判断|
|---|---|---|
|BASE-040|CoreOptRecentManage.java:26–59|recordSpreadsheet按UPDATE调用saveOpt，按用户等参数更新，0条时新建并saveAndFlush，断言成立；未运行并发/持久化验证。|
|BASE-041|SysParameterServer.java:25–98|单值/基础设置委派、超时默认60、排序默认1与嵌入导出sync及覆盖逻辑均存在，断言成立。|
|BASE-042|CoreDatasource.java:12–53|实体名、Long ID、名称/类型非空、pid、configuration转换器准确；未将注解当加密强度认证。|
|BASE-043|CoreDatasetGroup.java:11–93|folder/dataset、sql/union、mode、info、unionSql/isCross准确；这些含代码注释词汇，不证明所有分支运行支持。|
|BASE-044|CoreChartView.java:11–101|tableId/sceneId、type/render、轴、过滤与钻取字段准确；配置与查询结果区别作为实体角色说明可保留，详细数据流由核心篇支撑。|
|BASE-045|DataVisualizationInfo.java:10–129|组织/父级、布局、发布状态注释、deleteFlag/contentId准确；已注明注释不证明状态转换约束。|
|BASE-046|AuthEnum.java:1–21|操作枚举及weight准确；不据数字推断授权关系。|
|BASE-047|BusiResourceEnum.java:1–15|MENU/PANEL/SCREEN/DATASET/DATASOURCE/DATA_FILLING/SPREADSHEET编码准确。|
|BASE-048|AuthResourceEnum.java:1–18|menuId/flag与USER/ROLE/ORG/EMBEDDED/SYS_PARAM存在；没有将权限资源词汇虚构为企业岗位模型。|

## 影响关系核对

BASE-R-PLUGIN-IMPACT：加载桥内部实现改变可能影响F16，代码调用/装配证据支持保守影响关系。

BASE-R-MENU-IMPACT：generateRoutesFn2被Permission Store调用，影响菜单动态装配F22，证据支持。

BASE-R-LIB-IMPACT：lib构建入口和Vue外部依赖影响嵌入F09，作为构建配置依赖影响成立；不是运行调用边，也不证明嵌入全链完整。F09在access篇仍声明企业后端不可见，该限制不得被本关系提升。

## 尚需处理的两项尾项

1. **BASE-027，P2事实措辞修正。** 实际115–128行为是dev强制false；非dev且缓存为空才调用xpackModelApi，已有缓存则读取wsCache。将“其他模式读取xpackModel”改为明确该条件即可；否则读者可能认为每次挂载均读取后端。这是前轮已指出的未完成文本修复，不能把引用修好等同断言全修好。无需产品修改。
2. **F20原“静态资源访问”覆盖，P1总账条件。** 本篇仍名为“静态资源上传与模板资源”，limits限定两写入口。本轮额外亲读access篇ACCESS-008来源LinkTokenValidationManage:58–108，确认其含分享静态GET路径和画布归属检查，可以纳入跨篇访问边界导航。但它未被本篇F20引用，且不能替代一般静态映射/返回拦截器的入口定位。最终coverage应明确绑定已有访问事实并补一般访问入口导航，或保留相应未覆盖子项；不能因F20出现便关闭原分母。此要求是原义务，不扩大为全站安全审计。

本轮只新增本报告，不改候选或源码，不运行产品测试。未修改部分沿用v1有界通过；新事实及已修关系可用于正式知识整合，两项尾项和全库核心证据仍由最终验证独立确认。
