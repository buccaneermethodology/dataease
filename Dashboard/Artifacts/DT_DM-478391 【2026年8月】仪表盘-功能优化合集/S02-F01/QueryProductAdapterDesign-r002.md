# 查询产品适配设计候选 r002（审查处置增量）

本版本只处置独立审查 [QueryProductAdapterDesignReview-r001](reviews/QueryProductAdapterDesignReview-r001.md) 的 findings 并划清既有设计/运行证据边界；完整产品适配设计仍未冻结，产品 Builder 仍 `NOT_READY`。r001 保留为不可变审查输入，本文件和 [fixtures r002](QueryProductAdapterFixtures-r002.json) 为增量修订，不追认 QPROJ/QMAP/QPREP/QPIPE 以外的产品行为。

## 审查 finding 处置

- **QPADR-01（P2）已修正候选形状**：TC-QPAD-007 的同数据集后继节点，其独立 `fieldId` 可为空，但编码复合键末字段仍保留。r002 使用 `dataset-1--condition-new-2--field-b`；尾空复合键仅作为独立非法输入探针。node ID、condition/query ID 和三段复合键仍分别处理。该修正与 `QueryCascade.vue` 的编码及 placeholder 写入方式一致，仍是源码推导候选，不是执行 oracle。
- **QPADR-02（P2）已澄清证据层**：查询保存期间 dirty 判定、最新根局部 overlay、同步保存捕获、历史 carrier 与 undo/redo 游标/preview-only 方案沿用已审的 [QueryAdapterDesign-r007](QueryAdapterDesign-r007.md) 与对应 r007 复核结论。它们是“设计已接受、尚未实现/运行”，不能因无运行证据被重新表述为“尚无设计”；反过来，设计接受也不构成产品实现、保存集成或运行通过。r002 未发现足以推翻 r007 的新反证。
- **QPADR-03（P2）保持开放**：八项探针不足以冻结产品转换合同。TC-QPAD-001至008当前仍是调查性 identity，概念输入、文字描述或缺少的版本化白名单/完整输出不能冒充产品正负 oracle。下一设计阶段必须选择有限但真实的 adapter 范围，给出源码形态完整输入、逐字段保留/剥离/重建矩阵、完整目标 `propValue/cascade`、新 ID 规划和确定失败优先级，并重新独立审查。树、参数、时间、范围等合法分支保留完整 Goal 分母，不可通过永久拒绝来伪造完整实现。
- **QPADR-04（P3）记录为已解释的源码范围**：目录抽取显式处理 Tabs/Group 的已知组合，但不是任意深度递归；参数绑定是可跨 displayType 存在的维度，不能把 displayType=8 当成全部参数形态。r002 不新增源码修改，也不将其视为产品目录权限证明。

## 仍然不具备 Builder 准入的原因

本轮设计 review 的 NOT_READY 结论仍成立。产品适配的最小准确 schema/写入-读取路径、字段完整反向还原、可用于调用的可信 source/target 目录、目标能力拒绝 oracle 与产品入口单次安全提交仍未共同冻结。真实 XPack 权限实现和隔离多用户实例仍不可用；只读配置不可见/不可复制、授权撤销与恢复必须保持 `BLOCKED / NOT_RUN`。现有 QPIPE 等纯模块不证明这些产品条件，也不能替代本 Goal 的复制、预览、保存重开或权限链。

可继续推进源码追踪、完整候选 schema 与测试入口设计；在产生可被审查接受的精确窄切片合同之前，不写产品 adapter/UI 代码。Goal 的10项 AC、14项 F01 义务及 Q066/Q067 全部分母继续保留。

## 声明上限

`PARTIALLY_ACCEPTED_AS_SOURCE_DISCOVERY / NOT_VALID_FOR_FULL_PRODUCT_DESIGN_FREEZE`；实现准入 `NOT_READY_FOR_PRODUCT_ADAPTER`。未运行产品/权限验证，未声明 S02 完成。r002 对应八个身份的执行状态仍为 `NOT_RUN`。
