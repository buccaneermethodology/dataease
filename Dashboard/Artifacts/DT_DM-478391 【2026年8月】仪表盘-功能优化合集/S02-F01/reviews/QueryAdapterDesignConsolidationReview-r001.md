# 查询适配器整合设计独立复核 r001

审查者 `/root/s02_goal_review`。卡片expected canonical digest `53942870b85d9e83443f5aa7d8968aed77de06451257c7186c272a1051620601`接收端重新validate通过。整合设计SHA256 `9278dfa7490a43bdc13f1d1fa7c9165ed578d48ca6c955b74af00f880c72c765`；fixture SHA256 `08ed4a0c6ef376230baf856dd7cb0a9b6254733c318b914dbcea959bdc7dd915`。仅新增本报告，不修改被审材料或产品。

## 双结论

**Design Freeze Validity：VALID_WITH_BOUNDS_FOR_S02_QPREP_001。** 可冻结本typed纯准备器8个identity及对应输入/oracle。整合资料正确保留先前有限审查边界，不代表完整query adapter或AC-S02-02/03全量完成。

**Implementation Entry Readiness：READY_FOR_BOUNDED_ADMISSION；尚非ADMITTED。** 未发现阻止该纯准备器实现的语义缺陷。控制面可立即冻结切片、预检现有TS runner并建立新独立Builder card与精确target-bound admission，按真实RED→实现→同identity GREEN→独立Validation推进；本报告不是执行准入凭证。无需为不影响此模块的产品集成缺口再开设计扩展轮，也无需重复请求已有实施授权。

## 8个identity及oracle核对

| identity | 独立判断 |
|---|---|
| TC-QPREP-001 | 完整成功输入/输出一致：a/b和n1/n2按显式映射改名，chart-A→chart-B；dataset/field和数组顺序保留，仅返回conditions/chains。 |
| TC-QPREP-002 | 删除b但链仍引用b，映射本身保留；应在闭包阶段返回MISSING_CONDITION。该例也明确“映射完整”不等于禁止多余键，否则会与冻结oracle冲突。 |
| TC-QPREP-003 | chart-A有两个候选，前置校验均合法，AMBIGUOUS_COMPONENT正确。 |
| TC-QPREP-004 | 新增b→a链且补全新node映射，与原a→b构成有向环；CYCLE正确。 |
| TC-QPREP-005 | conditionMap两源同目标，先于图校验返回NON_INJECTIVE_ID_MAP。 |
| TC-QPREP-006 | componentMap空，对已引用chart-A返回MISSING_COMPONENT，不返回部分value。 |
| TC-QPREP-007 | b节点dataset改202，与b条件201不等，REFERENCE_IDENTITY_MISMATCH正确。 |
| TC-QPREP-008 | 继承001成功输出，深冻结输入可执行；修改输出嵌套targetRefs不改变输入，验证独立副本及无外部副作用。此项为程序性断言，不是另一份静态对象快照。 |

fixture:55–74校验顺序从结构/唯一ID、映射完整与单射、闭包、节点身份、唯一component映射到环，最后全量构造输出；失败只有ok/reason。002、004不会被其他已定义前置错误遮蔽。结构防御可补测试但不得改这8个expected或调换首错类顺序。condition与node属于分别单射的typed命名空间，不把全局跨类别ID唯一性额外塞入该合同。

本模块只验证显式typed引用及caller给定映射；targetRefs携带的dataset/field保留不意味着查证真实目标元数据或权限。节点身份比较已明确，完整产品字段承载仍由后续适配器/元数据入口负责，不从模块名推导额外产品承诺。

## 写范围与分母

Builder候选写范围精确为：

- `core/core-frontend/src/custom-component/filter-copy/query-reference-plan.ts`
- `core/core-frontend/tests/filter-copy-query-reference/query-reference-plan.test.ts`

不修改既有pure-guards、17项冻结合同，不接UI、Store、fetch、Date、随机ID或事件总线；typed中间模型不是产品payload。测试入口缺依赖不安装，应在已有能力内解决入口或报告实际阻塞。冻结/admission/原始执行证据由控制面按其写范围另行记录，不隐含扩大Builder权限。

独立脚本确认8个identity唯一且正好001–008；product_denominator含14项F01及Q066/Q067共16项，goal_denominator含AC-S02-01至10共10项；所有source_refs摘要与当前文件一致。对照LoopGoal_Final_r001:65–92，分母没有删除、降级或用8个纯用例替代。

## findings及处置

未发现阻塞当前纯准备器切片的P0/P1/P2语义问题。既有发现按边界处置：

| 事项 | disposition / 最小后续 |
|---|---|
| 历史17case的RED/角色/时序缺证 | 保持原PARTIAL_PASS及包验收阻塞；ExecutionEvidenceReconciliation:7–17没有倒填历史。新模块必须新独立Builder/准入及可追溯RED，不借旧GREEN追认。 |
| 未污染设计来源、旧carrier、真实query转换 | 集成前门槛；本模块显式typed输入无需读取运行Store，不阻止当前实现。 |
| 树特殊值/空optionFilter、Vue门控、保存与undo | 各自集成和运行验证门槛；本模块不执行这些路径，不扩展当前合同。 |
| 真实身份/权限/只读配置保密及撤权 | 继续BLOCKED/NOT_RUN；纯准备器不得接通产品入口或宣称权限通过。无需启动7070/8100或使用admin模拟替代。 |

当前最大声明仅为“8项typed闭包准备合同经实现和独立验证后成立”。不能由此关闭Q066/Q067、F01、全Goal、S10或AC-S02-07完整覆盖。当前仅做静态语义与结构/摘要核对，未运行产品或本次尚未实现模块。
