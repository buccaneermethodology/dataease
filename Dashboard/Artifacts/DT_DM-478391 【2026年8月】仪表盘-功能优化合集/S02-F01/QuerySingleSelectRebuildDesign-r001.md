# 单选普通 Query 离线重建设计候选 r001

状态：DESIGN_CANDIDATE_REVIEW_REQUIRED，仅可提交独立审查，未准入 Builder。切片 QSINGLE-REBUILD-001。接收端 lane card canonical digest acca23d3e49fcee8b70269ccacd3eb37cce83cea256cc93292f812cac2585714 复验 pass；Context validate 执行成功。只新增本文件与同名 Fixtures JSON，不改已接受 QPAD 文件、合同、实现与 Dashboard。原10项 AC及14项F01+Q066/Q067分母保持。

## 支持域与 JSON 语义

采用 QPAD r003 已接受的普通字段来源、无默认/必填/参数/活动日期/树、VARCHAR/deType=0域以及完整字段、引用、计划和目录校验；唯一新增单选分支 multiple=false，但并非只翻转布尔值。接口为独立 rebuildSingleSelectConfig(input:unknown)，输入 source.propValue/cascade、referencePlan、targetComponents，输出完整 JSON propValue/cascade。所有条件必须属于单选支持域；混合多选返回 UNSUPPORTED_SHAPE。不调用或修改普通多选函数，组合由未来调用方按完整域路由，当前不实现路由。

单选 defaultValue 必须缺省；selectValue 允许缺省或字符串，包含空字符串。null、数组、数字不属于这个 VARCHAR 窄域。mapValue 仍是字符串数组。defaultMapValue=[]，defaultValueCheck=false，defaultValueFirstItem=false。输入 JS undefined、Date、循环和非JSON对象仍拒绝 INVALID_INPUT；JSON缺键与显式undefined并不等同。本域不补齐历史缺字段，只有明确列出的这两个键遵守缺省规则。

## 源码证据及生命周期

路径均相对 core/core-frontend/src/：

| 来源 | 可确认事实 | 本切片决策 |
| --- | --- | --- |
| custom-component/v-query/options.ts:6–65 | 初始单选 multiple=false，defaultValue/selectValue为undefined，map/defaultMap为[] | JSON默认值键缺省有源码依据，不伪造null或[] |
| v-query/Select.vue:159–179（完整目录custom-component） | clearCascadeSelectValue单选selectValue=undefined；mapValue=[]；配置态另清defaultValue/defaultMap；级联值来自map数组 | 重建明确采用无默认、清运行选择的候选策略 |
| v-query/Select.vue:248–273 | 运行态写selectValue标量与mapValue数组；配置态写defaultValue和defaultMapValue；节点值由map回填 | 不把运行标量复制为设计默认；节点不能改为单个字符串 |
| v-query/Select.vue:276–280 | 配置类型切换将单选defaultValue设undefined，关闭首项 | 支持缺省默认；首项模式越域 |
| v-query/Component.vue:369–380 | 初始化空选择时可读defaultMapValue[0]或defaultValue | 本域两种来源均为空，不能创造选择 |
| v-query/Component.vue:674–683 | resetData无默认单选defaultValue=undefined，selectValue取默认；map仅条件性赋值 | 不声称reset总会清map；使用Select明确清级联路径作为清理oracle |
| v-query/Component.vue:769–771 | 清运行选择也是单选undefined，map存在条件性清理 | 不能从这里推断所有map字段可删除 |
| v-query/QueryConditionConfiguration.vue:1769–1783、1836–1908 | 补attributes、treeDatasetId和引用Map | 沿r003完整字段集，不额外补历史缺省 |
| utils/canvasUtils.ts:843–864 | cloneDeep后JSON.stringify保存 | undefined对象属性序列化后缺省；输出是保存形态候选，不是直接运行对象 |

表中v-query短路径均指custom-component/v-query。日期占位继续原样ISO字符串，不求值。Select清理函数是字段语义证据，不意味着已验证复制产品入口会调用它。

## 完整处理规则

JSON列出每例完整输入与完整成功输出。继承r003每个字段的固定限制/精确嵌套键、非空ID和引用/计划/目录关系。条件键集等于r003完整键集减defaultValue/selectValue，再允许可选selectValue。defaultValue虽是已知字段，但出现任何值都属于UNSUPPORTED_SHAPE；不是未知字段。除此缺键或额外键按UNSUPPORTED_FIELD。

输出删除selectValue键、保持defaultValue缺省，mapValue重生[]；id/checkedFields/checkedFieldsMap按计划重生。节点id及dataset--condition--field复合身份按计划重生，独立fieldId/placeholder保持，selectValue/currentSelectValue重生[]。其它已验证字段深拷贝。新ID不复用源ID，计划长度/顺序/数据集/字段/全部目标引用核对与r003一致；目标目录同数据集字段覆盖，禁止按展示名猜测。失败不返回value/partial且不变更任何输入；成功不共享任何输入嵌套对象。

错误依次 INVALID_INPUT → UNSUPPORTED_FIELD → UNSUPPORTED_SHAPE → PLAN_MISMATCH → TARGET_UNRESOLVED。顶层、JSON对象和基本身份非法为第一阶段；已知值类型但不在支持域（如单选selectValue数组/null）在第三阶段，不误报第一阶段。计划/目录校验和原r003相同。十例固定identity覆盖两个成功、数组单选、默认启用、未知字段、计划错配、目标缺字段、null默认、首项默认、双错优先级。必须按JSON深等比较且断言输出没有selectValue/defaultValue自有键，不能将undefined/null/[]等价比较。

## 后续实现与证据上限

候选实现路径 core/core-frontend/src/custom-component/filter-copy/query-single-select-rebuild.ts；测试 core/core-frontend/tests/filter-copy-query-reference/query-single-select-rebuild.test.ts。只有独立设计审查接受、冻结用例及新Builder卡/admission后实施；本lane不授予准入。不允许复制后偷偷扩大既有多选函数支持域，也不能先用multiple=true多选转换再翻回去掩盖单选值语义。

还需验证真实RED/GREEN、十例精确预期、深度不可变/无引用共享/JSON往返、不调用网络/随机/时钟。源码派生合成fixture只证明可描述该窄域，不证明真实编辑来源、权限、UI交互、保存重开或全Goal验收。有默认值、首项、数值型、null历史、混合形态仍是后续适配义务；本设计不永久拒绝合法产品配置。没有待猜的域内值语义，故提交可审查候选；若审查认为应支持上述域外形态，应另立边界，不由Builder自行补充。
