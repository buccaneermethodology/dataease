# 单选查询配置重建设计独立语义审查 r001

- 审查者：独立语义审查 lane `/root/s02_goal_review`；仅新增本报告。
- 审查对象：`QuerySingleSelectRebuildDesign-r001.md`，SHA256 `6142d2605d596585d8dfb4859a6ffbfefdf0defe2ac9fc0cf1f5da12ed30c7a6`；`QuerySingleSelectRebuildFixtures-r001.json`，SHA256 `5260dce73536698f463d118075c4c6ad58b2e50af24707ba34b8af08f3651490`。
- Design Freeze Validity：`PASS_WITH_BOUNDS_FOR_QSINGLE_REBUILD_001`（仅普通单选 JSON 候选重建设计有界通过）。
- Implementation Entry Readiness：`READY_FOR_BOUNDED_ADMISSION`（可准备有界实施准入），**不是 ADMITTED**。无必须先修订的设计阻断项。

## 边界与源码核对

支持域继承 QPAD r003 已审普通 VARCHAR/deType=0、无默认/必填/参数/活动日期/树的限定，仅扩展为所有条件 multiple=false 的独立单选函数。混合单多选、数值型及复杂默认不进入该域。产品完整适配及权限遗留不阻断此纯函数，但也不能由其结果关闭。

已核对 `core/core-frontend/src/custom-component/v-query/options.ts:6–65`：单选初始化 defaultValue/selectValue 为 undefined，mapValue/defaultMapValue 为数组；optionValueSource 初始为0，因此本切片限定为1是选定支持域，不是所有新建配置的通用默认。`Select.vue:171–179` 清除单选为 undefined，同时 mapValue=[] 并以数组回填级联；`:248–280` 保留标量选择、数组映射及默认首项关闭语义。`Component.vue:369–380` 可从默认映射首项/默认值恢复选择；`:674–683` 和 `:769–771` 的 mapValue 写入有条件，不能声称 reset 无条件清空映射。设计主动清空运行态是本重建合同，不是对全部 reset 行为的等价承诺。

`core/core-frontend/src/utils/canvasUtils.ts:843–864` 对组件数据执行 JSON.stringify。对象 undefined 属性落为缺键，故本输入是已序列化 JSON 配置，不能直接接受含 Date/undefined 的内存初始化对象。defaultValue 必须缺键；selectValue 可缺键或字符串（包括空字符串），输出必须删除该键。null、数组及数字不是缺键的别名。级联节点仍保留两个空数组字段，不套用条件的删键规则。

## 十个完整 fixture 核对

逐项解析完整 input/expected，并相对001递归核对变化；两个成功 expected 另按文档字段规则独立重建后作完整结构相等核对，均一致。此核对是 oracle 审查，不是拟实现函数运行或 GREEN。

| 用例尾号 | 输入要点 | 预期与判断 |
| --- | --- | --- |
| 001 | 两条件有字符串运行选择及映射，完整新计划/目标目录 | 成功：q1/q2→q12/q22、chart-A→chart-B、n1/n2→n12/n22；复合 datasetId 对应；条件选择缺键、映射清空、节点数组清空；其他字段完整保留 |
| 002 | 两条件 selectValue 缺键、映射及节点数组已空 | 成功，完整输出与001相同；缺键语义一致 |
| 003 | selectValue=[] | UNSUPPORTED_SHAPE，合法 JSON 越支持域 |
| 004 | defaultValueCheck=true | UNSUPPORTED_SHAPE |
| 005 | 未知 unknownReference 字段 | UNSUPPORTED_FIELD |
| 006 | 第二条件计划 fieldId 与源不符 | PLAN_MISMATCH |
| 007 | 目标目录缺 city | TARGET_UNRESOLVED |
| 008 | defaultValue=null | UNSUPPORTED_SHAPE，已知但禁止出现的键，不误报未知键 |
| 009 | defaultValueFirstItem=true | UNSUPPORTED_SHAPE |
| 010 | 非空 parameters 且条件计划为空 | UNSUPPORTED_SHAPE，支持域错误优先于计划错误 |

优先级 `INVALID_INPUT → UNSUPPORTED_FIELD → UNSUPPORTED_SHAPE → PLAN_MISMATCH → TARGET_UNRESOLVED` 可执行。必须全局分阶段检查，不能按条件遍历先遇先返导致优先级倒置。继承 r003 的完整计划、源关联、唯一新ID、目录和复合引用校验，不能只复制fixture里的两个条件。

## 实施入口与证据上限

允许准备的唯一实现入口为 `rebuildSingleSelectConfig(input: unknown)`，新增设计指定的单选源码和测试；不改多选函数、不通过切换 multiple 包装多选来伪造支持，不接入UI、保存、权限或自动调用QPIPE。QPAD r003 的既有通过结论保持其自身范围。

实施前另行绑定本审查摘要、新 lane card、Context 与 execution admission；本报告不声称复验了未提供给本审查的单选 review card。单元验证应保留10例精确 expected，补充合同已要求的 own-key、空字符串、混合 multiple、非JSON输入（显式 undefined/Date/循环/非JSON对象）、全局优先级、深不变/不共享引用及 JSON 往返断言；JSON fixture 文件本身无法表达 undefined/循环。以上是实现验证义务，不要求为这些纯函数断言重开产品级设计。

真实 RED/GREEN 必须绑定同一冻结样例，之后由独立 Validation 判断落地包；本报告只证明设计及oracle在声明窄域内一致，不证明代码已实现、运行正确、来源配置真实、权限成立或保存/撤销效果。不得追认旧QPREP时序证据。

原 Goal.final.json、10项 Goal AC、F01及Q066/Q067的16项产品义务不变。QPADR-03完整适配仍开放，真实权限保持 BLOCKED/NOT_RUN；本报告不是 S02/F01/Goal 完成或任何产品支持全覆盖声明。
