# 树逐级引用重绑独立设计审查 r001

## 双结论与绑定

**Design Freeze Validity：PASS_WITH_BOUNDS_FOR_QTR。** 八项oracle在“所选字段已与树层字段一致”的有限纯转换域内成立，无阻断该有限设计的发现。

**Implementation Entry Readiness：READY_FOR_BOUNDED_ADMISSION，尚非ADMITTED。** 可建立独立Builder卡和精确target-bound admission后实现；只新增 `core/core-frontend/src/custom-component/filter-copy/query-tree-relation-rebinding.ts`、独立测试与卡片明确列出的QTR执行证据。测试和证据路径须在Builder卡精确指定，不修改既有模块或产品入口。

审查者 `/root/s02_goal_review`。卡片expected canonical digest `80b7c5df5b33297891d2cea3452d3aecc92f8d8caf9f2e64d885e2b628d0dd6c`接收端validate通过；Context工具validate退出0，12项required_read_set摘要全部匹配。仅新增本报告，未运行产品/权限或修改候选。

## 源码与适用域

TreeFieldDialog.vue:59发出所选对象数组，91限制新增至5层，107禁止重复选择字段。QueryConditionConfiguration.vue:1992–2019按treeFieldList更新逐层映射，2326–2341的新旧历史分支不同；useFilter.ts:323–332同时检查checkedFields选择、Map存在与层索引，再使用该层Map字段。由此1–5层及顺序保留、忽略未选Map键有直接依据。

**字段相等是本模块的窄域前置，不是所有合法树配置的不变量。** 历史oldTreeLoad分支可保留原Map字段，实际消费也未强制它等于treeFieldList层ID；本模块在不等时FIELD_MISMATCH，只说明不能按此有限同字段模型重绑，不代表产品原配置非法。后续完整适配不得永久拒绝这些分支来缩分母。

QMAP每个source要求唯一目标，允许不同source共用目标；“一对一”仅指单个source恰一个target，不是全局双射。每层已要求全部所选字段等于层字段，因此同目标冲突字段在FIELD_MISMATCH阶段已排除，无需另外发明冲突reason。同目标同字段按第一次出现去重可生成无重复checkedFields，保持确定性。

## 八项identity

| identity | 判定 |
|---|---|
| TC-QTR-001 | 两层分别保持province/city，仅chart-A→chart-B，精确输出正确。 |
| TC-QTR-002 | 同层两source→两个不同target，顺序及字段保持，正确。 |
| TC-QTR-003 | 缺当前source映射返回MISSING_COMPONENT_MAP，正确。 |
| TC-QTR-004 | 当前source有两个合法target返回AMBIGUOUS_COMPONENT_MAP，正确。 |
| TC-QTR-005 | Map字段与层字段不等，FIELD_MISMATCH优先于映射阶段，正确。 |
| TC-QTR-006 | 与002属同一行为类别、目标名称不同；oracle正确但不算新的边界覆盖。 |
| TC-QTR-007 | 两source映到同target且同field，输出首次target一次，正确。 |
| TC-QTR-008 | 空选择层先INVALID_INPUT，不落到缺映射，正确。 |

八项ID唯一。全局优先级按设计:24类别执行，类别内才按原层/数组顺序；不能逐层遇到后类错误立即返回，遮蔽后层前类错误。未选Map键、未使用componentMap条目不读取/输出，容器自身仍须符合规定。被使用目标ID非法属于INVALID_ID，不得让非法目标借“多目标”优先绕过该错误。

## 实施验证要求与观察

- 函数承诺1–5层，不能因正例仅1/2层而硬编码两层；测试在冻结8项外应覆盖5层成功、6层拒绝、重复树字段、未选陈旧Map键忽略、同目标去重及跨层首错顺序。这是验证既有设计域，不扩大产品范围。
- 设计未把“缺映射”写成必须调用QMAP，纯函数只消费显式结果；实际目录、字段能力与权限依旧由调用方证明。空/非数组被使用映射值需按输入结构及缺有效目标规则落实并记录测试，不伪造已获QMAP成功的前提。
- 输出层对象、数组与Map均独立，失败无partial value。字段和组件ID的特殊字符串应作为数据键处理，不能利用对象继承属性满足本应缺失的映射。

**QTR-N01（P3，非阻塞）**：002/006重复覆盖“两个不同目标”，不能据8个identity宣称已覆盖全部1–5层及未选择键行为；保留现identity，增加针对上述声明域的测试即可，不需修改本次oracle。

完整QPADR-03尚未因此关闭；本函数不改treeFieldList、默认/运行值、cascade、参数或保存/undo。不证明searchQuery、SQL、实际产品复制或权限。原10项Goal AC、14项F01及Q066/Q067共16产品义务保持，真实权限BLOCKED/NOT_RUN。本次仅静态审查，可信RED/GREEN、lint和独立Validation由后续实施流程完成。
