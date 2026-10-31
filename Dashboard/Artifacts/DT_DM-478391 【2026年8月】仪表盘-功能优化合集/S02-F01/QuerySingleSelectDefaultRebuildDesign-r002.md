# 显式默认值单选 Query 离线重建设计调查 r002

结论：NOT_READY（不能直接冻结实现合同）。卡 e4541e52baece4e277b054e8ad05e6f3bafb588d4f82f83cd1408923de3a2d57 接收端 validate=pass；ContextBootstrap r002 validate成功。只新增本文与Fixtures-r002.json。r001未写文件；不修改QSINGLE已接受无默认域，也不减少Goal分母。此结论不是“默认值必须依赖真实权限才能开发”，而是当前完整输出语义尚未唯一。

## 已确定的源码事实

所有路径基于core/core-frontend/src/。

| 来源 | 确认内容 |
| --- | --- |
| custom-component/v-query/options.ts:6–65 | 初始单选defaultValue/selectValue为undefined，默认开关false，两个map数组为空；无法据此推导有默认的重建策略 |
| custom-component/v-query/Select.vue:132–150 | setDefaultMapValue按enumValueArr中displayId或field.id匹配显示值，收集field.id值并去重。一个单选显示值不保证只对应一个筛选值 |
| 同文件:345–357 | enumValueArr来自enumValueObj响应，不在source、引用计划或字段目录中 |
| 同文件:248–273 | 配置交互写defaultValue、mapValue和defaultMapValue；运行交互只写selectValue/mapValue，不写默认配置 |
| 同文件:427–468 | 开启默认且非remote时恢复显示默认，重新计算mapValue；特定路径比较新旧映射并重新查询，最后回填级联 |
| custom-component/v-query/QueryConditionConfiguration.vue:1047–1062 | multipleChange在确认时将标量defaultValue赋给单选selectValue；切换多选类型才主动重置默认 |
| 同文件:1591–1625 | confirmClick先清propValue，nextTick内用mapValue写有默认条件的节点select/current，然后回写完整配置；不是原子操作 |
| custom-component/v-query/Component.vue:674–683、741–743 | reset保留活动defaultValue，selectValue恢复该标量，非空defaultMapValue赋给mapValue；节点current却按selectValue数组化写入 |
| hooks/web/useFilter.ts:140–149、469–481 | 字段来源普通Select在firstLoad消费defaultMapValue，之后selectValue非空时消费mapValue。保存的defaultMapValue是实际首查输入，不能无证据清空或改成[defaultValue] |
| utils/canvasUtils.ts:843–864 | 当前根cloneDeep后JSON.stringify；保存本身不重算枚举映射 |

因此不能把defaultValue视作实际筛选值，也不能仅将无默认切片的开关翻true后继续清两个map和级联。

## 最小缺口

G-DEFAULT-01：当前输入只有完整配置、计划与字段目录，缺少枚举响应。源码证明“保留已存defaultMapValue供首查”是一种现存消费行为，但不证明跨组件复制应原样信任它还是重新解析并核验。若明确切片仅保留持久默认配置，可不依赖枚举/权限服务；该选择必须在独立审查中明确，不能将结构一致性称为默认选择有效性。另一方案是增加明确枚举快照，不过它扩大接口且不能伪装当前字段目录已有能力。

G-DEFAULT-02：完整输出状态时点未唯一。配置确认把mapValue写节点select/current；reset把显示selectValue数组写节点current；运行加载还会重新映射。无默认域全部为空时这些差异隐去，有默认时不可忽略。需固定复制入口输出是持久配置候选还是某初始化路径后的状态，再逐字段冻结KEEP/REGENERATE/REMOVE。不能把删除selectValue、清map/current或直接回填defaultMapValue任意一种写成源码唯一要求。

最小下一步是独立设计审查选择“持久默认配置透传，不验证枚举存在性”的明确边界，并绑定真实初始化消费入口；如果此边界被接受，再给出完整成功对象与每个失败枚举。当前不需要请求用户提供权限环境，不以环境缺失掩盖设计缺口。

## 候选字段边界与诊断fixture

已确定必须保留defaultValue/defaultMapValue/defaultValueCheck的语义，不能用运行选择覆盖；ID、checkedFields/Map与复合级联身份仍可沿已审引用重绑定规则。selectValue、mapValue和节点select/current的输出值保持OPEN，不给伪精确成功输出。不改变现有无默认实现和失败规则。

Fixtures包含6个固定identity的完整诊断输入：非空映射、空映射、显示/字段同值、一对多、首项默认、当前选择缺省。expected=null只表示未冻结oracle，绝不是函数应返回null或用例通过。所有实例为合成诊断值，不把“默认显示值/实际筛选值”当真实枚举证据。未指定新的失败优先级，因为支持域/输出时点未冻结；不得据此开始Builder或编写自证测试。

未来冻结必须覆盖输入深度不变、成功无嵌套引用共享、失败无partial/value、JSON往返、确定性，以及各条件和节点身份一致。当前仅JSON/诊断结构自检，不是函数或独立验证；真实权限、产品预览、保存重开均未验证，原10项AC和16项产品义务保持。
