# 查询保存及历史设计独立复核 r005

## 结论

`ACCEPTED_WITH_BOUNDS_FOR_QAR4_01_02`：r007在候选设计层关闭QAR4-01与QAR4-02。最新根局部覆盖和历史全根恢复已明确分开，未发现该有限算法新增阻塞。此结论不等于完整查询设计冻结、Builder准入、产品/权限验收或Goal完成；此前形态、来源及历史兼容缺口继续保留。

审查者 `/root/s02_goal_review`。接收端重新validate卡片expected canonical digest `e911248a4002ea860dc89770619b9f18d0b1be98681d2e4b0555fe32e4c00806`通过。设计r007 SHA256 `bf67232e7a54d7a92e7eff866182298fe0b151f01edec5293286add96aeee47f`；fixture `4a677d83b7bd59c3bd4b744346926a910617da98e5040d87b60f0df995dc0303`。仅新增本报告。

## 逐项处置

| finding / severity | disposition | 依据与影响 |
|---|---|---|
| QAR4-01 / P2 | CLOSED_AT_CANDIDATE_DESIGN_LEVEL | r007:9–17撤销旧全根保存权威；保存捕获最新根及其他持久字段，只覆盖同一S的查询propValue/cascade。prepare提交与降级hydrate也重取最新根，避免回放left99覆盖150。fixture:5–121覆盖普通样式/文本、prepare期样式变化、删除/绑定冲突及晚回包dirty。 |
| QAR4-02 / P2 | CLOSED_AT_CANDIDATE_DESIGN_LEVEL | r007:21–35与fixture:124–242规定有效undo/redo移动一次既有游标、恢复完整历史根及carrier、新commit仅有preview、不追加快照；边界no-op不改revision或发副作用，预览失败重试不再移动游标。原undo空计划、redo误追加snapshot的歧义已消除。 |

保存与历史选择没有互相覆盖：普通保存/粘贴保留最新非过滤编辑；用户undo/redo则按所选历史记录恢复整个文档内容，允许回退当时样式。后者使用历史carrier，不能被保存用的最新根overlay替代。

## 独立核对

直接核对snapshot.ts:97–123：undo/redo先移动snapshotIndex，保留当前id/pid/dataState/contentId，再snapshotPublish；126–131恢复根和画布；196–220的recordSnapshot会新增条目、截断redo尾并受dataPrepareState/mobileInPc/snapshotDisableTime约束。r007准确描述关键行为，并把发布前失败应保留指针列为拟新增协调要求，没有误称当前函数已可原子回滚。

直接核对canvasUtils.ts:843–864及后续保存回调：当前保存从现根深拷贝，包含画布及其他字段，回包会resetStyleChangeTimes。r007:13的新完整payload比较必须接替这一无条件清dirty路径，其合同已明确“queryRevision相等不够”和易变请求字段排除。实施时应验证普通编辑发生在请求等待期仍保持dirty；这属于已明确设计的执行验证，不新增设计阻塞。

独立只读Python检查JSON：根据latestRoot逐目标覆盖carrier得到expected_save_root完全一致；有效undo/redo historyIds不变，appendSnapshot均false，各仅一个preview计划。此检查只是合成oracle结构/转换一致性，不执行生产协调器、Vue或保存接口。

## 剩余边界及最小后续

- r007:35明确旧历史缺carrier仍待有证来源重建，不能将本次关闭推为全部历史兼容通过，也不能删除旧历史或禁用普通撤销。
- 嵌套Group/DeTabs唯一定位、缺失/多义冲突、完整payload规范化以及查询写入入口清点已写入合同，当前fixture仅为有限合成示例；实施验证须覆盖这些条件和同步门控/异常恢复。
- 新提交需要按已定义规则正确接入snapshot的缓存/禁用时间，避免恢复预览意外追加历史；产品故障注入尚未运行。
- QAR3-02/QAS-01树完整消费等独立缺口不被本报告关闭；真实权限、运行环境、最终验收均保持各自证据边界。

本次无新增P0/P1/P2阻塞发现。原完整Goal与产品义务分母不变。
