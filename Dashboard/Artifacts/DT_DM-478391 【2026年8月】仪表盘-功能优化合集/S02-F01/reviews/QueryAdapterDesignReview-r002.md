# S02 查询适配器设计独立复核 r002

审查者：`/root/s02_goal_review`；时点：2026-10-16T04:38:15.778134+00:00。

## 绑定与总体结论

接收端执行lane_task_card validate，canonical摘要 `4449e5b8d3a9ee1e27f8ed7b50ac0e8d667f9033391c098d3803c31064f77d88` 通过。当前设计摘要 `b736872a76e6ea07600fa3477bbd8c5d329511a918960329d6aeeb07377a6c33`，fixture摘要 `5d55055d875e1d60312bd25e0e91c8f1ef4eb8df91e4efb4a5de6eb9a4035ad6`。直接读取绑定源码的外参注入、序列化保存/恢复、默认映射、配置恢复、树及参数消费、级联节点和重置路径；对照原QAR-01/02/03与完整Goal分母。未修改被审资产或产品代码，未运行产品测试。

设计补证：`PARTIALLY_ACCEPTED`（部分可接收）。比r002字段清单新增了有据的来源污染分析、字段处置及具体typed引用片段；不是重复静态目录。但三项完整最小解阻仍未全部满足。

完整查询适配器冻结：`NOT_READY`（尚不能冻结）；DG-03仍应保留。产品Builder `NOT_ADMITTED`。17项纯比较合同既有有限结论不受影响，不能代替查询适配器、权限或持久化验证。

## 各项处置

| 原项 | 可接受部分 | 仍阻塞及最小动作 |
|---|---|---|
| QAR-01 | mapValue非稳定默认已纠正；外参会修改optionFilter/defaultValue的真实来源已找到；F01展示默认华东/运行华南的区别及目标E映射，方向正确 | 尚无未污染设计副本的实际取得路径。找出一个确定复制入口及其权威状态载体，证明运行注入前后仍能取得默认规则；不能以“无快照就拒绝”替代全部合法配置复制。 |
| QAR-02 | 动态Map/参数/树/日期/历史处置表增加；E07/E08支持“运行注入可能进入序列化对象”，未把optionFilter误当稳定自过滤 | 参数内部schema、treeCheckedList、日期编码、混合字段明确unknown；F04/F05仅身份投影，F06无日期oracle。选当前实际支持形态各给一份可完整消费配置及精确转换结果，继续未知项调查而不把fragment当全量合同。 |
| QAR-03 | condition/node/external-component/dataset/field ID分离正确；typed重写优于全JSON替换；闭包缺失、多义、环及双向独立性均保留 | 跨仪表盘外部绑定如何唯一获得、实际Store替换接缝、快照/通知异常状态仍未定义到可实现程度。补目标定位/绑定来源和原子发布状态机及实际调用连接点后再冻结。 |

## 发现

无P0/P1；以下P2属于当前设计冻结缺口，不阻塞继续只读设计准备。

### QAR2-01（P2）：权威设计副本尚未落到实际载体

dvMain.ts:1437–1501确实注入optionFilter，filter模式可能重写defaultValue；其他模式还重写defaultMapValue/timeType/defaultValueCheck。canvasUtils.ts:843–864对componentData深拷贝并序列化，未见VQuery过滤上述字段。故单纯删除optionFilter无法还原设计默认，r003识别准确。F02的clean_design_fragment仍由fixture外部提供，无法证明当前系统实际有该副本；该fragment本身含运行mapValue/selectValue，名称“clean”也只能理解为默认未被外参改写，不能当全对象纯净。

最小动作：固定一个真实编辑来源入口、原始载入/未保存编辑/外参注入之间的数据所有权和版本关系，给出取得不可变默认配置的具体函数/状态路径；若需新载体，应写出候选实现与兼容/生命周期合同，不要求它已在代码中存在。设计冻结不能要求先完成产品运行，但也不能把不存在的可信源作为无限期前置。

### QAR2-02（P2）：E09把重置路径写成挂载恢复，影响默认及日期oracle

Component.vue:330–338是onBeforeMount，仅将cascade.currentSelectValue设为selectValue；660–747则位于658行resetData函数，由1033行重置按钮调用，包含清空propValue/nextTick、默认恢复和动态日期计算。r003“生成、保存、恢复、消费链”将两段合述为“挂载…重置默认并重算动态时间”，时序归因不准确。不能据此认定每次粘贴/挂载必经同一日期及默认重算。

最小动作：将挂载、用户重置、配置确认、预览消费分成明确路径；为F03/F06标定实际使用函数和调用时点。拟新增适配器可复用相关求值语义，但不得直接调用有Store清空/事件副作用的resetData作为prepare。无需扩大为产品行为修复。

### QAR2-03（P2）：具体片段仍不足以证明完整引用及提交合同

C1是单条链的typed引用片段，没有完整conditions与外部绑定输入；node fieldId为空在同dataset配置经QueryCascade.setPlaceholder后可成立，但当前fragment不含该placeholder派生，不能当直接可保存结构。F05 parametersArr仅id且expected只投影部分字段，不能证明参数定义完整保留。transaction仅有不变量和“一次替换”提案，缺同步watch、快照异常、通知失败的具体状态转移与恢复责任；文档已诚实承认。

最小动作：组合一份完整源/目标候选及绑定映射，明确placeholder/独立fieldId、parametersArr与default映射的重建；为提交前失败、确认版本漂移、发布成功但快照/通知异常分别给精确结果和责任。同步一次引用替换可作为设计手段，不必等运行后才写契约；但必须先解释何种状态算提交成功及哪些失败必须零变更。提交后预览网络失败可与校验拒绝区分，须保留错误反馈和已提交状态，不能将其宣称完整预览成功。

## 已验证的设计依据与有限冻结建议

Select.setDefaultMapValue按displayId/field.id映射，optionValueSource!=1返回空数组；F01的华东→E映射与该逻辑相符。Select配置/运行分支的map/defaultMap写入区别、useFilter对参数Arr及端点的使用、Tree对optionFilter和级联过滤的消费，均支持新增处理表的调查方向。history补全在副本完成、不能用new Date悄悄更改历史语义的要求合理。

可接收为后续合同不变量：禁止源运行快照冒充默认规则；dataset/field精确身份；组件引用结构化重绑且唯一；闭包缺失/环/不承载整次拒绝；目标非过滤属性保持；取消及prepare失败零副作用；双向无共享引用。尚不能把全部字段表、F01–F07和C1–C6冻结为完整查询实现oracle。fixture明确标合成片段、非运行导出、NOT_RUN，是正确证据上限。

## 后续最小包与范围

下一包只需：实际设计状态来源/候选载体合同；修正E09时序并给完整形态fixture；目标绑定和prepare/commit异常状态矩阵及连接点。无需重复审查17项纯函数、重做全库扫描，或等待真实权限模块才能推进这些设计。

只读配置保密、撤权与真实身份仍保留环境阻塞；不能用模拟授权关闭。原10项Goal AC、14条F01及Q066/Q067共16项产品义务未缩减，复杂形态未解除的缺口不能以长期拒绝替代成功路径。此次审查不授权写产品、不声明可信RED/GREEN、产品验证或S02完成。
