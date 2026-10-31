# QVALUE-001 独立设计语义审查 r002

- Design Freeze Validity：`PASS_WITH_BOUNDS_FOR_QVALUE_001`（普通单选值子载体分离合同有界通过）。
- Implementation Entry Readiness：`READY_FOR_BOUNDED_ADMISSION`（可立即准备有界实施准入，非已ADMITTED）。无必须先修订的设计阻断项。
- 可准入 target：新增 `core/core-frontend/src/custom-component/filter-copy/query-single-select-value-state.ts` 与 `core/core-frontend/tests/filter-copy-query-reference/query-single-select-value-state.test.ts`，实现 `prepareSingleSelectValueState(input: unknown)`，严格限定九键投影与本合同固定分支。
- 不准入 target：完整条件提取、产品carrier、UI/Store接线、权限、保存/历史、身份重绑、目标映射、级联，以及修改既有COPY/QPAD/无默认函数。

## 源码与边界

`Select.vue:248–273`分别写运行selectValue/mapValue和配置defaultValue/defaultMapValue；`:132–150`用显示字段查枚举再得到field.id编码，支持默认显示A与映射A-code不必相等。`Component.vue:674–683`在defaultValueCheck=true时保留默认、select取默认，非空defaultMap复制为map。本切片限定单元素非空映射，避开不赋值空映射分支。`useFilter.ts:141–149`首次取默认映射，后续存在选择时取mapValue。该证据支持局部纯状态变换，不证明挂载、查询、目标枚举有效性或全部产品行为。

design七键剥离源运行B，runtime九键从默认A独立构造；默认C而编码A-code仍保留，是不执行枚举推断的合同，不是假称C与编码一定有效。输入必须是调用方显式准备的九键投影，额外id也拒绝；上游如何合法投影完整条件仍未解决。函数不冒充完整extract或保存carrier。

与既有COPY能力不同：COPY保留源JSON运行值并重绑引用；本切片不接受身份/引用且丢弃B。与无默认重建不重叠：本切片必须defaultValueCheck=true且默认/运行值非空。因此不应包装调用既有函数。

## 十个完整oracle

已解析十个完整input/expected。001默认A/运行B、002默认C/映射A-code、003仅源运行改Z的三个成功输出，分别按七字段提取及独立水合算法重建并作完整相等核对，均一致。此为oracle审查，不是实现运行GREEN。

004多选、005首项默认、006空默认映射、007默认null、008多元素运行映射均正确期待UNSUPPORTED_SHAPE；009额外id正确期待UNSUPPORTED_FIELD；010输入null正确期待INVALID_INPUT。失败无value或部分输出。design需自有键断言确认selectValue/mapValue缺键，而非值等于undefined。

错误全局顺序INVALID_INPUT→UNSUPPORTED_FIELD→UNSUPPORTED_SHAPE明确，必须先完成JSON/属性描述符检查再读取值，不能触发getter；显式undefined、非有限数、循环、Date等由实现测试构造，JSON文件无法承载这些输入。缺键与合法JSON的null分别落字段阶段与形态阶段，不合并为默认值。

## 实施与验证要求

父流程绑定新Builder card、Context与execution admission后可直接开始，不需等待权限或完整adapter冻结。本审查已消费父流程renderer输出，复验本review专属卡成功；这仍不等于Builder准入。

保留十个冻结identity与expected，真实RED/GREEN、定向lint和独立Validation。补充合同已要求的非JSON/访问器不调用、缺键、空字符串、错误优先级、deep-freeze输入、JSON往返与数组引用隔离断言。input两个数组、design.defaultMapValue、runtime.defaultMapValue与runtime.mapValue应各自隔离；逐一修改输出验证无串改，不能仅比较JSON。运行时冻结或只读类型不替代独立数组构造。

当前仅接受R4-01中此九键值投影；R4-01全域、DG-03、全部形态与产品接线仍开放。10项Goal AC和16项产品义务不变，真实权限NOT_RUN。本审查不关闭S02/F01/Goal，不追认历史QPREP证据，不声称完整产品支持。

## 审查对象

- `QuerySingleSelectValueStateDesign-r001.md` SHA256：`f85af9bad61d62ea44edbcd4332bef61d5b56ad123b2c3249f9b681a486a50d2`。

- `QuerySingleSelectValueStateFixtures-r001.json` SHA256：`06e21cbd6523b06e6e9c7c1ef1577e11e0d6e09bee27c7ccd46770e339f03553`。

## 本轮卡绑定、重审与findings

本次按 full_baseline 接收卡 `planning/qvalue-001-design-review-card-r002.json`，通过SP010 lane_task_card.py接收端校验，canonical digest为 `07ee920d732a99718e20a765ed0ed3d1dce86cec7d43982d2f5d0d52d9dbcb65`，verdict=pass、exit=0。专属 `ContextBootstrap-QVALUE-001-design-review-r002.json` 经SP010 context_bootstrap.py验证exit=0。全部13个base_context_refs文件内容摘要与卡逐项相符，Goal摘要保持 `f562da2eb14b84dc8083e138dd2eb8718a58041f01d08163eddf5fb2c71daef0`。

重新按input容器、精确九键、固定分支、字符串/单元素数组及七键提取/九键水合规则核对10个唯一identity，全部完整expected一致。该独立核对仅评价设计oracle。已复核default-copy的defaultValueCheck=true及源值保留，与无默认重建的false、删除selectValue及清mapValue分支；QVALUE不承担两者的身份/级联映射，九键外直接拒绝，支持域和输出用途明确。

- 阻断findings：无。
- 非阻断实施注意：数组不共享、getter不执行及非JSON输入无法由静态JSON深等充分证明，设计已明确要求运行时测试；沿既定RED/GREEN与独立Validation履行，不另增前置设计任务。
- 证据边界finding：原r001未绑定本review专属卡。本r002记录卡到位后的本次复核，不倒推r001具备当时不存在的卡校验，也不追认任何先前Builder执行。

本轮唯一写入为本报告r002。准入结论仍为 READY_FOR_BOUNDED_ADMISSION；不增加隐藏前置、不扩大目标，父流程完成既定Builder card/context/admission后即可实施两个指定文件。
