# 树消费增量独立审查 r002

## 结论与绑定

`ACCEPTED_WITH_BOUNDS_FOR_QAS_01_02`。QAS-01在指定两层非空、无分隔符冲突、optionFilter缺省的源码派生oracle范围关闭；QAS-02定位已修正。未发现本有限包新增阻塞。该结论不等于真实树查询、数据库结果、权限或整个Goal验收，也不授予Builder准入。

审查者 `/root/s02_goal_review`。卡片expected canonical digest `bb9376d3c338d14c592861ac69e73bf8dbe3bbd306edce4390ffcd5cfc4f80d5`重新validate通过。Matrix SHA256 `04656b366beffab8f99826efcf2a835d24c7a6ee1f53ea911896b9702a046804`；fixture SHA256 `ad96b36cfa22b95ebf2f19dddd42286f09c61943548fb79a6ea7813da9890c56`。仅新增本报告。

## finding处置

| 编号 / severity | disposition | 证据与影响 |
|---|---|---|
| QAS-01 / P2 | CLOSED_AT_BOUNDED_SOURCE_ORACLE_LEVEL | Matrix:7–13、fixture:4–188将任意node-city改为真实生成算法的浙江-de-杭州，精确连接默认/运行选择到复合filter；旧node-city保留为只能产生第一层字段的反例。 |
| QAS-02 / P3 | CLOSED | Matrix:21–23、fixture:195–199修正today为time-format.ts:149–151；未变更UTC手算值或伪称浏览器通过。 |

## 独立源码核对

TreeUtils.java:18–19定义root与-de-；DatasetDataManage.java:1213–1227筛行后生成并合并节点，1231–1247累计字段值生成ID及nodeType。对本两层行，id分别为浙江、浙江-de-杭州，pid分别root、浙江，nodeType追加0/1，fixture一致。DatasetUtils.java:29–52按nodeType层号寻找父节点，支持该例父子关系。Tree.vue:244–250保留ID并设value=id，因此该默认值可与合成响应一致。

useFilter.ts:323–332给两层relationshipChartIndex和字段；127–139将默认/运行路径中的-de-解码为逗号；48–55保留数组；97–111按位置选两字段和值；300得到in；596–604生成单个isTree复合对象。fixture首次filter为fieldId=f-province,f-city、value=[浙江,杭州]，componentId=query-B，关联目标chart-B只参与匹配，角色没有混淆。firstLoad=false使用江苏/南京运行选择，初始化完成后默认与选择一致时两次结果相同。

独立Python只对上述位置映射及完整期望对象进行算术/结构核对，首次与运行变体均相等；没有执行原searchQuery、Java生成函数、Vue或SQL。node-city反例在同两层关系下只有valArr[0]，故只保留f-province，其反例oracle与源码一致。

## 边界

Matrix:17及fixture:189–193明确optionFilter缺省；空数组在当前if(optionFilter)中为真，会进入空结果读取obj.split路径。该问题作为现有边界被如实保留，不影响缺省属性的有限正例，但不能把该例推广到含空数组历史配置。含逗号/-de-、混合深度、空值及截断另需覆盖，不能以本报告授权永久拒绝合法形态。

本次补足的是生成ID到searchQuery最终结构的设计证据。Vue门控/default初始化、后端isTree SQL命中、真实权限、保存重开均未运行。参数与UTC日期沿上一报告的条件性源码结论保留；历史来源等其他设计缺口不在本次关闭范围。完整DG-03及原Goal分母不变。
