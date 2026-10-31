# 查询适配器增量独立复核 r004

## 结论与绑定

审查者 `/root/s02_goal_review`。卡片expected canonical digest `248b6840b49722282ed366a5b7ddbb9c59f5cee42e75662cc8cb41a54f525c66`重新validate通过。设计r005 SHA256 `b03a1123045d990bd329e3ccc18df6c97f523251b1d6b4b20582e1f1bbd4d4b7`；fixture r005 `9a32d11316e7d6913b6fa3a16263a1d20da7ae60f3d71f55312b8f0b5bf96c76`。

`PARTIALLY_ACCEPTED / FULL_QUERY_DESIGN_NOT_READY`。共同aggregate明确解决原先根与carrier分离的理论缺口，门控与异常已形成可审查的候选算法；但其全componentRoot保存策略遗漏既有样式/非查询写入的一致性，尚不能按当前文字冻结。QAR3-02保持OPEN。仅新增本报告，未修改设计、fixture、源码或Dashboard；未执行产品测试，不授予Builder准入、不宣布权限验收或Goal完成。

## 原项处置

| 编号 | disposition | 依据及边界 |
|---|---|---|
| QAR3-01 / P2 | 原粘贴漏更新子项CLOSED；整体PARTIALLY_CLOSED | r005:17–25明确粘贴更新、根/carrier/commitId共同发布、固定保存引用及晚回包dirty规则；fixture:9–161、361–364给出合成状态。新设计的全部根权威与既有非查询写入冲突仍须QAR4-01补齐。 |
| QAR3-03 / P2 | CLOSED_AT_CANDIDATE_DESIGN_LEVEL | r005:29–37给出先门控、单引用线性化、hydrate/初始化/快照/预览次序及前后抛错确定状态；Tree默认清空和旧响应回写均被明确禁止。此处关闭“未指定提交点和门控责任”的设计缺口，不声称实现已满足。 |
| QAR3-02 / P2 | OPEN_UNCHANGED | r005:45–47、fixture:379–383明确未补完整参数/树/日期oracle；12项合成事务状态不替代可消费配置。仍阻塞完整查询适配器冻结。 |

## 发现

### QAR4-01（P2）：全根保存权威未涵盖样式及非查询编辑，可能保存旧内容

证据：设计r005:17、23、25。active包含完整componentRoot，保存复制S.componentRoot；但第23行仅要求清点“查询设计写入路径”，明确无需重构非查询业务，既有dvMain又变为兼容运行投影。当前dvMain.ts:503–518通过curComponent原地写布局/样式，snapshot.ts:126–131还恢复完整根及其他Store。设计没有说明这些编辑如何更新active或者进入同一版本保存捕获。

影响：例如paste发布c13后，用户通过既有入口移动组件或改样式，仅兼容投影变化；按第25行保存active旧根会丢失最新编辑。即使只改查询组件样式也可能出现，不能用“过滤配置一致”替代目标非过滤属性保持。原fixture仅固定style.left=99，未覆盖后续样式编辑。

处置：OPEN，阻塞当前全根方案冻结。最小动作：明确全部持久化编辑的根版本归属；可选择统一文档根协调，或保留现有根权威并定义同版本捕获与查询设计覆盖的协调方案。无需先实现，但必须给出“粘贴→样式/非查询编辑→保存”和“prepare期间样式变更”的精确状态oracle，保证不覆盖后来的合法编辑。不要以禁用正常编辑规避要求。

### QAR4-02（P2）：undo状态fixture的副作用计划与文字合同不一致

证据：设计r005:33、41要求同协调器撤销为新commit并使用新副作用ID；fixture:248–285的undo c14却为effectPlan空数组，redo c15在335–343有快照/预览计划。未明确undo是否需要刷新，若需要由何处按c14去重执行；若有意避免撤销时追加历史快照，应区分快照游标与预览责任。

影响：Builder可能按空计划实现撤销后不刷新，或照通用发布规则额外插入快照而破坏redo链。

处置：OPEN，有限fixture一致性缺口。最小动作：明确undo/redo的history游标、是否创建快照以及一次逻辑预览计划，并使文字和fixture一致；不要求新增运行验证后才可修正设计。

## 已接收及验证上限

单一不可变aggregate避免“根新而commitId旧”合法中间态的设计成立；深拷贝、发布后降级保持新设计、保存晚响应不清除新dirty、旧异步响应按commitId丢弃均可作为候选不变量。源码复核确认dvMain.setComponentData仅数组赋值，现有snapshotPublish分多Store恢复，作者没有将新协调器冒充既有实现。

门控覆盖、Vue调度、故障注入、真实权限、历史未污染来源仍没有运行证明；设计明确标为待验证是适当边界。QAR3-02仍需沿开源生成/消费链补完整参数schema及精确结果、树默认值与监听成功路径、固定时钟时区日期oracle。原DG-03、10项Goal AC与14项F01及Q066/Q067分母保持，不以事务fixture关闭产品义务。
