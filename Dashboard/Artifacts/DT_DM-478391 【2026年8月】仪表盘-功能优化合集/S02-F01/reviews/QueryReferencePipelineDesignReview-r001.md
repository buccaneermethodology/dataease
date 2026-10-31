# QPIPE-001 独立有界设计复核 r001

结论：**PASS_WITH_BOUNDS**。六个oracle与当前QPROJ→QMAP→QPREP接口及短路顺序一致，没有发现阻断纯组合切片设计冻结的缺陷。实施入口为READY_FOR_BOUNDED_ADMISSION，仍须新独立Builder卡和精确准入；本报告不授予产品接入权限。

审查者 `/root/s02_goal_review`。直接读取两份设计/fixture及当前QPROJ、QMAP源码，结合已审QPREP五键、闭包及环契约。只新增本报告，不改产品代码，不执行产品测试。

## 六项核对

| identity | oracle与expected_calls |
|---|---|
| 001 | QPROJ保留源引用，QMAP唯一选chart-B，QPREP重生条件/节点ID；完整期望plan正确。调用各一次，顺序QPROJ/QMAP/QPREP。 |
| 002 | 空propValue使QPROJ返回INVALID_INPUT，不能先校验null目标目录；只调用QPROJ。 |
| 003 | projection成功，空目标目录使QMAP返回MISSING_COMPONENT；仅前两阶段。 |
| 004 | 两个同dataset且完整字段覆盖目标，QMAP返回AMBIGUOUS_COMPONENT；仅前两阶段。 |
| 005 | missing三段引用可投影，目标可唯一匹配；QPREP在闭包阶段返回MISSING_CONDITION，三个阶段均调用。 |
| 006 | 补齐反向链nodeMap后前置校验成立，QPREP返回CYCLE，三个阶段均调用。 |

六项ID唯一。当前QMAP要求目录条目精确三键，输入fixture满足；组合层不应擅自削掉目录附加字段伪造合法输入。只抽取外层必要字段、componentMap内部新建为空并以QMAP结果替换的合同一致；未知外层对象安全访问仍须按设计:9处理，不能让null解构抛错掩盖QPROJ INVALID_INPUT。失败只传播stage和原reason，无部分值。

## expected_calls可验证性

设计:23、fixture:276–282将调用轨迹定义为实际行为断言，**可实现验证，但当前未验证**。测试应在生产pipeline导入边界包装真实导出函数，记录每次进入后仍调用原函数并原样返回结果；或采用等效模块加载spy。用真实模块跑返回值校验，同时断言观测数组与expected_calls严格相等，能发现失败后继续调用或重复调用。

不能由stage字符串或expected数组自行生成“实际调用记录”，也不能复制组合流程到测试函数代替执行生产pipeline。不得用stub预设成功/失败代替真实三个模块。无需为spy修改三个已实现模块或增加业务API；若既有runner不能可靠观察模块调用，Builder须先解决测试加载方式，不能将expected_calls静默降为静态审阅。此为明确验证要求，不是要求再扩一轮设计。

## 范围及剩余门槛

实现仅新增 `core/core-frontend/src/custom-component/filter-copy/query-reference-pipeline.ts` 和 `core/core-frontend/tests/filter-copy-query-reference/query-reference-pipeline.test.ts`。不改依赖模块、copy入口、UI/Store或冻结oracle。深冻结输入、输入不变、无部分结果及无外部副作用断言保留。

原10项Goal AC、14项F01及Q066/Q067共16产品义务没有被六项组合用例替代；本包不是完整过滤配置复制/粘贴。可信元数据、真实权限、复杂schema、历史来源、保存重开及产品入口仍为后续门槛。QPREP当前候选行为与其历史RED/角色/时点证据限制明确分开，组合GREEN不能追认旧包验收。

本次无阻塞finding。Design Freeze Validity仅针对六项纯组合合同；实际实现完成需可信RED、同identity GREEN、定向lint和独立Validation。未运行QPIPE、Vue、数据库或权限验证。
