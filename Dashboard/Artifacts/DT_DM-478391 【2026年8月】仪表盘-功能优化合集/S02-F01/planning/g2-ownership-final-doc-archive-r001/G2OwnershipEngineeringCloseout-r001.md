# G2 所有权工程交付与剩余目标

## 当前结论

用户授权的实施顺序已落为“先界面MVP、再复杂场景”；原10项Goal AC、26项must-have、16项产品义务及完成谓词均保留。当前落地的是普通line所需的所有权工程单元，不是产品Copy/Paste界面MVP。helper独立验证与实际SFC独立验证均为有界通过；主代理已采集真实G2浏览器证据，独立收尾结论以[收尾复核](reviews/G2OwnershipCloseoutReconciliation-r001.md)为准。

## 实现变更（Implementation Delta）

适用：存在生产行为改动。仓库未提交快照保存在[manifest](planning/g2-ownership-final-snapshot-r001/manifest.json)和[完整本单元patch](planning/g2-ownership-final-snapshot-r001/implementation.patch)，包括一项tracked修改、八项untracked新增的全部内容与SFC写前基线；不夹带工作区其它既有修改。

| 模块 | 之前 | 当前 | 原Goal影响与上限 |
| --- | --- | --- | --- |
| 新增g2-render-attempt.ts | 模块不存在，后以可信NOT_IMPLEMENTED stub建立RED | 已返回实例和已登记同步cleanup按attempt拥有；阶段current检查、逆序幂等清理、主错误引用与清理错误分通道；HV-001同key重入遗失已修 | 推进AC-S02-03/08/09的工程证据，不关闭完整AC；未处理return前partial allocation |
| ChartComponentG2Plot.vue | 新实例render前即发布；旧updateData回调可触及新活动实例；cleanup错误可中断释放 | 普通line的scope到ready才发布；version/scope/instance隔离旧回调；替换/卸载释放并观察错误，observers继续断开 | 推进Q014所需渲染生命周期前置，不证明query/Store原子提交或Copy/Paste |
| 保留边界 | 已有calcData、L7及其它G2行为 | calcData/L7函数、其它G2主路径保持基线；仅普通line接scope；显式[]与非法missing数据可区分 | 不把line验证推广至全部图表 |
| 测试/浏览器夹具 | 无本单元测试面 | 冻结helper23例、补充重入10例、实际SFC6例+8输入、无后端真实G2页 | doubles只证明控制流；浏览器只证明helper+真实G2，不是产品MVP |

源码入口：`core/core-frontend/src/views/chart/components/views/components/g2-render-attempt.ts`、`core/core-frontend/src/views/chart/components/views/components/ChartComponentG2Plot.vue`。命令均在`core/core-frontend`执行：`node tests/g2-render-ownership/check.mjs --mode green`、`node tests/g2-render-ownership/reentrant-replace-check.mjs`、`node tests/g2-render-ownership/component-check.mjs --mode green`。

## 验证与评审轮次

- [所有权Design终审r003](reviews/G2StageLifecycleOwnershipDesignReview-r003.md)：3/3；合同有条件有效，不开第4轮。
- [修正runner/可信RED独立验证r002](reviews/G2OwnershipRedValidation-r002.md)：RV-001/002关闭；17负例拒绝、15正向接受、双stub控制通过。
- [helper实现独立验证r002](reviews/G2OwnershipHelperValidation-r002.md)：第2/3轮，有界通过；HV-001关闭；原23/23及补充10/10，旧source的真实RED独立复现。
- [普通line组件实现独立验证r001](reviews/G2OwnershipComponentValidation-r001.md)：6/6及R013输入8/8通过，真实最终helper23/23，R014测试realm修复有效。
- [真实浏览器观察](planning/evidence/G2OWN-BrowserObservation-r001.md)：真实折线、图例、tooltip、760→520 resize、迟到/竞争、empty、重复及卸载；累计11创建/11销毁，canvas=0，错误为空。它是主代理观察，最终独立复核另列。
- 定向ESLint、helper严格单文件tsc、SFC编译/bundle及差异空白检查通过。浏览器夹具补充tsc因已安装旧TypeScript与依赖声明不兼容未通过，未升级依赖；不宣称整个前端ts:check或完整产品构建通过。

## 治理对账与明确例外

主代理控制面、独立Builder、独立Validator职责分开；所有Builder入口均有精确Goal/Contract/Context/Design Review/Topology/action/target admission。主代理仅手动CUA采证是单代理观察例外，不自报独立Validation。最终复核采用独立source，核对实际closeout、S02 Sessions、完整本单元diff和post-closeout摘要。

BDD Sync判定：helper/reentrant runner为unit，实际SFC脚本为具名边界double的seam，浏览器页为手动观察夹具；本单元没有把它们提升为维护型产品non-unit gate或共享验收权威，故不新增BDD策略/reader卡。Contract Delta Scan：实现已有候选所有权合同，不新增或改写canonical产品规则，KB不变。Dashboard是执行面；项目没有Session registry校验器，不声称程序化对账通过。未执行Git暂存、提交、推送或发布。

## 未完成目标与后续

产品Copy/Paste入口、内部跨标签transport、staged query/render/Store提交、显式保存重开等尚未由本工程单元实现或验收。旧产品接线r003及事务r003的全部残余继续保留；本单元只处理其中生命周期依赖的一部分，不能翻转其NEEDS_REVISION或重置评审预算。G2OWN-027的返回句柄前partial allocation仍OPEN。其它图表/查询组件/复杂边界按新顺序保留后续实施，完整AC不删减。

[真实source READ必要能力](planning/RequiredCapability-MvpSourceRead-r001.json)仍由用户明确标记缺失；standalone/admin/mock不能替代。账户设置授权继续有效，无需重新确认。产品实际成功Copy以及只读/撤权/组织隔离验收待维护者提供授权来源或隔离实例；可独立推进且已冻结准入的非权限工程工作仍可继续，不能以外部权限缺失虚称整个Goal已完成或所有设计工作都不可做。

父Goal保持未完成，全部原分母保留pending；本次有界工程结果不等于MVP、完整F01、S10就绪或Goal完成。后续入口须从实际冻结合同与旧终审findings选择，不能用新名称重启已封顶的同一交付物。
