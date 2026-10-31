# 树路径到查询过滤的增量oracle r002

仅处理QAS-01/02，card摘要882499a0b5a333a8695ab1ae1431e07d770f99800e7fcd8e95c799568732f47a复验通过。只新增本文件及QueryAdapterShapeFixtures-r002.json；旧r001及审查不改。全部输入合成、结果由源码手工推导，不是运行配置或产品测试。

## QAS-01：真实生成的两层路径

sdk/common/src/main/java/io/dataease/utils/TreeUtils.java:18–19固定root与-de-分隔符。core/core-backend/src/main/java/io/dataease/dataset/manage/DatasetDataManage.java:1213–1227过滤不合格空值行后调用buildTreeNode；1231–1247逐列累积parentPkList，id为累计值以-de-连接，nodeType另追加层号。合成provider行[浙江,杭州]按字段顺序[f-province,f-city]生成根id=浙江、子id=浙江-de-杭州，而非任意node-city。DatasetUtils.java:29–52按nodeType及层号挂children。前端Tree.vue:244–250保留id并设value=id，故选择子节点的真实值编码是浙江-de-杭州。

前端路径前缀为core/core-frontend/src/。hooks/web/useFilter.ts:127–139在displayType=9时将-de-转逗号；firstLoad=true读defaultValue，false读selectValue。323–332从treeCheckedList得到relationshipChartIndex=[0,1]及ids[0]=f-province/ids[1]=f-city。48–55对树保持数组；97–111按值位置和关系索引得到fieldId='f-province,f-city'及value=['浙江,杭州']；300选择operator=in；596–604最终push含filterId/componentId/fieldId/operator/value/parameters/isTree的对象。

**最终是一个isTree=true的复合过滤对象，携带两个字段和对应两层值，不是两个独立普通filter对象。** JSON精确列出完整searchQuery调用输入（在本分支所有消费字段齐备）、中间值及最终对象。componentId为查询组件query-B，curComponentId=chart-B用于关联匹配，两者不可混淆。parameters为空数组，未新增参数路径。

旧node-city变体没有-de-，valArr只有一项，indexArr只剩0，最终fieldId只含f-province；不能再作为两层成功证据。本修订保留该反例，并以真实生成算法的路径值替换正例。查询适配器复制不改变路径编码，只重绑组件ID，保留字段顺序和默认路径；目标初始化后selectValue同默认则首次和后续输出一致。

## 适用前提与未证明内容

本最小例无外参optionFilter，属性缺省；不能随手补optionFilter=[]。当前useFilter.ts:373的if(optionFilter)对空数组仍进入，随后97–99对空result读取obj.split会出错。这是源码边界观察，本lane不修代码，也不以此拒绝全部复杂树；未来含空数组历史形态需另行验证处置。值中含逗号、-de-、空字符串、混合深度选择及结果截断不由本两层非空例覆盖。后端进一步消费isTree复合filter的SQL效果未运行，本证据上限是searchQuery输出结构。

Tree默认初始化和字段监听可能清值，仍遵循已审设计门控候选；本包不宣称Vue执行顺序已验证。真实数据权限、两层SQL实际命中及保存重开未运行。不得将精确合成oracle替代产品验收或关闭DG-03。

## QAS-02：today定位修正

准确位置：core/core-frontend/src/custom-component/v-query/time-format.ts:149–151，case today、getToday及date/datetime结果构造。r001正文“约158起”不准确，本修订明确更正；其UTC固定时钟结果仍为条件性源码推导，不改变为浏览器运行证据。

## 本轮检查

card摘要、JSON解析、后台路径拼接、前端解码及两字段位置映射自检通过；未执行Java、Vue、searchQuery原函数或SQL。仅新增两文件，不改源码、测试、Goal、合同、Dashboard，不授予Builder或宣称设计冻结。
