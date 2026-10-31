# 普通Select离线配置重建独立审查 r003

## 双结论

**Design Freeze Validity：PASS_WITH_BOUNDS_FOR_QPAD_REBUILD_001。** 相比八项概念探针，本包已给出可判定的普通Select窄域、71键字段矩阵、完整源/计划/目标目录、完整候选输出和六项确定oracle。可以冻结此有限离线重建合同；不等于完整产品适配设计冻结。

**Implementation Entry Readiness：READY_FOR_BOUNDED_ADMISSION，尚非ADMITTED。** 无需等待真实权限环境即可准备这个离线纯函数的实施准入。必须先建立新Builder卡、匹配Context及target-bound admission并绑定本版设计/fixture/报告；本次父任务直接授权静态审查，没有新review卡摘要可宣称通过。

审查者 `/root/s02_goal_review`。仅新增本报告，不改被审文件或产品。设计与fixture来源为r003，源码对照沿当前options、配置面板、Select、QueryCascade及既有QPIPE契约。

## 范围与源码语义

设计:7、fixture:1508–1515限定JSON态displayType='0'、多选、远程枚举、无默认/required、VARCHAR/deType0，固定参数/树/日期活动字段为空或基准值；额外键/缺键拒绝。该范围可判定，不能解释成所有普通Select或历史配置均支持。

options.ts:6–65和80–136提供初始字段及attributes，配置面板:1769–1783补treeDatasetId/timeRange.relativeToCurrentRange，1836后的引用Map初始化支持本例字段来源。基准timeRange含后续补全项，不只是初始attributes对象。JSON日期占位为字符串且不求值，本例没有把Date实例或当前时钟当复制来源。

无默认多选以空数组表示选择，Select配置/运行写入及Component重置语义支持清运行selectValue/mapValue的方向。本合同另明确defaultValue/defaultMapValue必须已空，而非从未知历史运行值推断真实默认。KEEP字段按固定域逐项限制，所以不意味着可无条件保留所有同名字段。dataset.fields为空、showError等固定基准同样是窄域限制，不证明所有真实编辑对象天然符合。

级联输出三段dataset/query/field保留dataset与末字段，仅替换query ID；独立fieldId为空，placeholder保留，运行select/current重置。QueryCascade仅清独立fieldId的语义得到保持。本重建器输出currentSelectValue=[]，与QCR移除该键的独立合同不同，但这里有精确完整schema与初始化约定，不应错误复用QCR输出而丢必需键。

## 精确输出及六项oracle

独立只读Python按矩阵重建正例：71个condition字段覆盖集合完全相同，按plan替换id/关联键及级联身份、清运行值，其完整对象与fixture.expected逐字段相等；cases[0]内完整input/expected与顶层基准一致。此为候选算术/结构核对，未执行拟实现函数或产品。

| identity | 判定 |
|---|---|
| TC-QPAD-REBUILD-001 | 完整正例输出一致，条件和节点新ID、三段引用及目标关联均对齐，无源运行选择残留。 |
| 002 | defaultValueCheck=true越出固定域，UNSUPPORTED_SHAPE正确；不代表产品禁止默认值。 |
| 003 | unknownReference额外键，UNSUPPORTED_FIELD正确，不静默裁掉引用。 |
| 004 | plan第二条件字段不匹配源city，PLAN_MISMATCH正确。 |
| 005 | 目标目录缺city，TARGET_UNRESOLVED正确。 |
| 006 | 非空parameters越域优先于plan条件数量错误，UNSUPPORTED_SHAPE正确。 |

六项从真实完整基准派生，已不再使用概念字符串充当结构。失败优先级全局分阶段、阶段内数组顺序清楚；不得在逐条件构造时提前返回后类错误。成功全部新建，失败无value或部分对象、输入/plan/目录不改。

## 必须保持的实施解释与验证

- `INVALID_INPUT`中的嵌套形状指JSON类型/容器不合法；合法对象缺/多键按下一阶段`UNSUPPORTED_FIELD`。计划的JSON类型安全先查，具体精确结构/长度/身份按`PLAN_MISMATCH`，保持006预期。
- plan不是只按索引拷贝：源条件、源复合串、plan条件/节点应建立对应关系，链conditionId必须指向对应的新condition，而非同dataset/field就放行。每个targetRef字段应与对应源checkedFieldsMap字段一致，并按目录核对dataset及字段存在。不得因目标另有该字段就接受伪造plan。
- 调用方承诺plan来自针对同source版本的QPIPE；本函数结构/身份复核不能证明该来源，不能用“接收plan”宣称新模块独立验证了环、权限、来源版本或全产品合法性。
- 新condition/node ID各自唯一且不复用源各自ID，不能混淆两个命名域。多source→同target只在同条件字段一致时折叠，冲突PLAN_MISMATCH；额外未选Map键在本合同为越域，而非沿QPROJ忽略规则静默删除。
- 基本ID的非空要求不包括明确为空的sortId、独立node.fieldId等固定哨兵；失败类别与六项oracle按上述支持约束解释。严格ISO UTC解析不得引入当前时钟。

这些解释落实设计已有约束，没有新增业务规则。测试除六identity外，应覆盖深冻结/深拷贝、同字段重复条件导致索引错配、源ID复用、node错绑、同target字段冲突、非法JSON与错误优先级；不修改冻结六项预期。未发现阻断该有限合同的P0/P1/P2。

## 准入写范围与后续门槛

新Builder仅可写：

- `core/core-frontend/src/custom-component/filter-copy/query-ordinary-select-rebuild.ts`
- `core/core-frontend/tests/filter-copy-query-reference/query-ordinary-select-rebuild.test.ts`

执行证据路径另由新卡精确绑定；保留原始RED源码/runner/fixture摘要及stdout/stderr/exit code，确保失败来自可执行断言，再同identity GREEN、定向lint和独立Validation。不修改上游模块、UI/Store/copy、设计/fixtures、Goal；缺依赖不静默安装。

QPADR-03仅在这个有限离线形态获得可实施合同，完整适配缺口仍OPEN。历史缺省、默认/单选、树/参数/时间/范围、真实来源/目录授权、预览和保存重开依旧未覆盖；r007候选设计不重开，真实权限BLOCKED/NOT_RUN。原10项Goal AC及14项F01+Q066/Q067共16产品义务完整保留，不得由本切片成功外推F01、S02或Goal完成。
