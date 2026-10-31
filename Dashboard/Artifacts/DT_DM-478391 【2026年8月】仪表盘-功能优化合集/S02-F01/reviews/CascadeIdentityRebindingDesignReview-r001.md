# 级联身份重绑独立设计审查 r001

## 双结论

**Design Freeze Validity：PASS_WITH_BOUNDS_FOR_QCR。** 六项有限身份变换oracle可接收；其范围是离线节点变换，不是有效产品级联配置验证。

**Implementation Entry Readiness：READY_FOR_BOUNDED_ADMISSION，尚非ADMITTED。** 可建立独立Builder卡及target-bound admission后实施，仅限 `core/core-frontend/src/custom-component/filter-copy/query-cascade-identity-rebinding.ts` 和独立测试。测试的精确文件路径须在新Builder卡明确；不得修改QueryCascade、Select、QPIPE/QPROJ/QMAP/QPREP或接产品入口。

审查者 `/root/s02_goal_review`。卡片canonical digest `3f6b6886e935deb5ea15a6ee9c2eb5c04d773e127c6472960050fd663790accf`重新validate通过；绑定Context工具validate退出0、required_read_set摘要全部匹配。设计SHA256 `fbd39a595c1efba93029132e43c6ba36aa023253b2404267bd7498825221c081`；fixture `ef29e826d412810da0c1bf09703586cee7465dc93a7ee5ce15e93bf68eb5b277`。仅新增本报告。

## 源码核对与六项oracle

QueryCascade:68–78编码dataset/query/field三段；142–165创建独立node id/fieldId并仅清同dataset后继的独立fieldId；48–58克隆并清selectValue；233的按钮在长度2时禁用。Select:158–166给selectValue/currentSelectValue写入数组或原值。设计明确只接受数组运行值，因此是有意收窄的输入域，不能宣称涵盖真实所有控件值形态。

| identity | 独立判定 |
|---|---|
| TC-QCR-001 | 两节点id及复合串第二段重绑，dataset与末字段逐字保留；独立空fieldId及placeholder保留，selectValue重置[]、currentSelectValue移除，精确输出一致。 |
| TC-QCR-002 | 跨dataset后继独立field-x保留，与复合串field-c不混同；不证明field-x有效/已授权，不违反“不修改dataset”变换规则。 |
| TC-QCR-003 | 节点映射已齐，缺query映射返回MISSING_QUERY_ID，正确。 |
| TC-QCR-004 | 两个不同旧node映射同目标，DUPLICATE_TARGET_ID，正确。 |
| TC-QCR-005 | 三段数量正确但末字段为空，INVALID_ID；不应误报分段数量错误。 |
| TC-QCR-006 | label额外键未分类，INVALID_INPUT优先，正确。 |

成功对象中新建空selectValue数组及节点/组数组应各自独立；不能共享单个可变空数组。不生成ID、不访问Store、目录、网络、权限或时间；失败不含partial value。QPREP仍负责条件闭包与环，输出不能绕过它直接粘贴。

## 实施解释与非阻塞观察

- 设计:17的INVALID_ID中“field”应按:15和六项oracle解释为复合字段及非空独立字段；独立fieldId=''是明确允许的哨兵，不得将其一律判INVALID_ID，否则所有正例都会失败。
- 错误类别按:17列出的优先级执行，同类别按输入遍历；不能对首节点立即返回后类错误而遮蔽后节点前类错误。复合串先安全分段，恰三段的空段属于INVALID_ID，非三段属于INVALID_COMPOSITE_REFERENCE。
- 映射单射分别在query/node命名域内判断，重复使用同一query引用不等于不同源ID映射冲突。未用映射项和源node重复处理若超出这六向量，应在测试防御范围与QPREP前置中明确，不能顺带改变六项冻结结果或声称完整输入空间验证完成。

**QCR-N01（P3，边界提示，非纯变换阻塞）**：fixture:20、75等首级placeholder与独立fieldId同时为空；真实QueryCascade:51–53会拒绝这种配置确认，而本函数成功只表明身份变换完成。它不能用作产品可保存的正例。后续产品fixture应使用真实首级placeholder；本六例无需因此改变纯字符串保留oracle，报告和测试名称不得称产品有效配置。

跨dataset后继独立fieldId为空/展示态是否完整等产品合法性不是本函数明确承诺；INVALID_PLACEHOLDER_STATE仅检查设计规定的同dataset后继独立fieldId必须为空。不得据该错误名宣称全部placeholder校验完成。

## 准入后验证及原分母

准入前固定独立测试路径及原始RED/GREEN证据路径；接入现有runner，不安装依赖，执行同六identity及必要防御场景、定向lint和独立Validation。当前仅静态设计审查，没有执行本模块或产品。

完整QPADR-03字段还原、可信来源、树/参数/日期/范围、保存/undo及真实权限仍为后续门槛；不阻止该明确离线纯函数准备，但不由它关闭。原10项Goal AC、14项F01及Q066/Q067共16产品义务保持，真实权限BLOCKED/NOT_RUN。无当前六项纯变换合同的阻塞finding。
