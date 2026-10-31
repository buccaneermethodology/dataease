# 普通Select离线配置重建候选 r003

针对QPADR-03，仅新增本文及QueryProductAdapterFixtures-r003.json，写前不存在。依据父流程本轮明确授权写这两个文件；未收到新的r003 lane card，因此不声称本修订新卡复验或自动准入。旧r001/r002及review保持原样。完整10项Goal AC和14项F01+Q066/Q067不变。

## 最小可复核切片

QPAD-REBUILD-001只重建JSON态普通Select：displayType='0'、multiple=true、optionValueSource=1、required=false、defaultValueCheck=false、无参数/活动日期/树，字段type=VARCHAR/deType=0。函数接收完整source.propValue/cascade、QPIPE引用计划和显式目标目录，输出完整候选propValue/cascade。它不操作UI/Store/权限/保存，不调用QPIPE或元数据服务，不把传入计划当权限凭证。

这是窄域离线转换，不是永久拒绝合法复杂分支；超域返回UNSUPPORTED_SHAPE供后续完整适配器路由。全部字段与类型、完整正例及6个固定case见JSON。不靠Builder自行猜默认值。

## 源码字段来源与处理

前端目录core/core-frontend/src/：v-query/options.ts:6–65构造基础字段；80–136补充attributes。QueryConditionConfiguration.vue:1769–1783补缺省及treeDatasetId/timeRange，1836–1908创建空引用Map；因此JSON明确给出这些字段，函数不在输入缺字段时复刻历史补全。

QueryConditionConfiguration.vue:1591–1629持久设计面为propValue/cascade；utils/canvasUtils.ts:843–864保存JSON序列化。输入日期占位因此取ISO字符串，原样保留且绝不按当前时钟生成。无默认多选值在源码初始化/重置路径（Component.vue:675–683、Tree不在本域）以[]表示；Select.vue:248–273区分运行选择与默认。候选仅将selectValue/mapValue重生为[]，defaultValue/defaultMapValue固定为[]，不保留源运行值。并非删除所有名含value字段。

字段矩阵按每一个condition键列KEEP/REGENERATE。此域REMOVE集合为空：未知键不静默剥离，而UNSUPPORTED_FIELD失败。KEEP不代表源可信，只代表已验证该窄域字段不改：name/visible等条件展示属性保持，未包含外层组件样式/布局。dataset.fields必须已经为空，不捏造元数据；未知非空元数据形态暂不进入此域。field.id/type/name/deType保持，目录同字段身份验证不按名称。

条件id、checkedFields、checkedFieldsMap从同位置QPIPE plan重生；保存全部源引用，不通过删Map键掩盖丢引用。对同一条件多个源图表映到同目标时，仅字段一致才可折叠checkedFields并保留一个Map键；字段冲突PLAN_MISMATCH。JSON正例每条件一个引用。各条件/节点新ID不得与源各自集合相交。

QueryCascade.vue:68–78生成dataset--query--field，151–165同数据集仅清独立fieldId，不清复合末段。输出node.id与复合query段重生，dataset和field末段原样；独立fieldId保留空、placeholder原字符串保留（不生成翻译），select/current均[]。无其他概念性字段输出。

## 错误优先级和原子性

1. INVALID_INPUT：顶层/数组/JSON类型、基本ID或嵌套对象形状非法；不接受Date实例、undefined、循环或非有限数。
2. UNSUPPORTED_FIELD：condition/node及固定嵌套对象缺键/额外键，明示不能准确重建，不补历史默认。
3. UNSUPPORTED_SHAPE：JSON fixed_fields与分支限制不满足，例如defaultValueCheck=true、非空参数或额外活动规则。
4. PLAN_MISMATCH：计划格式/长度/顺序对应、源复合引用、数据集/字段身份、新ID唯一与不重用、引用数量不符；无法确定同一条件Map时拒绝。
5. TARGET_UNRESOLVED：目标目录缺失/重复身份、dataset或字段未确认。

按上列阶段完成全量验证才构造候选，阶段内源数组顺序稳定；失败无value/partial输出，不变更源/计划/目录。成功返回全新嵌套对象，修改返回值不影响输入。计划不是仅靠索引盲信：对应的datasetId/fieldId、链引用必须同时核对，避免同长度错配。不能证明source来源版本时由调用方阻止产品提交，本函数不伪造版本校验。

## 用例与实施边界

JSON正例含两个完整条件、两层节点、完整QPIPE plan、目标目录和精确完整输出；六个identity涵盖成功、默认活动越域、未知字段、字段计划错配、目标缺字段及双错优先级。负例以明确path替换完整正例，不使用概念字符串代替输入对象。所有实例源码派生合成，未执行产品或函数。

候选只写query-ordinary-select-rebuild.ts与query-ordinary-select-rebuild.test.ts（完整路径见JSON）；不改QPIPE/QPROJ/QMAP/QPREP。独立设计审查接受且新卡/Context/admission冻结后方可实施，测试runner沿已存在纯模块模式但需真实RED/GREEN日志。当前不自审或准入。

剩余门槛明确：有默认/单选/树/参数/日期活动、历史缺省和未知字段仍是完整Goal后续义务；本窄域也未证明真实编辑配置来源、QPIPE source版本、权限、预览和保存。r007保存/历史候选继续有效，本离线切片不重开其设计、不宣称多阶段确认原子。
