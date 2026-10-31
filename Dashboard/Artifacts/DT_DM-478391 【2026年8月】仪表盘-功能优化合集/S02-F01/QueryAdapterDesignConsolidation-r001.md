# 查询适配器当前设计整合候选

本轮最后一份整合设计输入，供一次独立复核后立即选择有界实施切片。card摘要74b273a003c8516afa6fb5569d65ddcd8c68bb49e5e88689e2d7e94133a81a0f复验通过。仅新增本文及同名Fixtures JSON，写前不存在；不改旧资料、不启动产品实现、不自授予准入、不再自行开新设计轮。

## 当前统一合同及证据等级

1. **来源/默认规则**：Select.vue:248–273证明mapValue同时含运行态；dvMain.ts:1437–1501外参还会改默认。复制需读取拟新增版本化设计carrier，不能从运行Store删除optionFilter后宣称恢复默认。载入hook和历史纯净来源仍需补证；载体候选不冒充现有能力。
2. **typed引用**：条件ID、级联node ID重生，dataset/field ID保持；目标组件绑定必须唯一显式，不按名称或同数据集任意选择。QueryCascade.vue:74–78、142–165支持复合键与独立node ID区别。完整源/目标候选见r004组合fixture；它仍是合成，非宿主实际挂载证据。缺闭包/多义/环整次拒绝，深拷贝双方独立。
3. **参数/日期/树形态**：Shape-r001追到SqlVariableDetails14字段、DatasetGroupManage:564–595生成tableId|DE|variableName、日期类型实际值域；UTC日期为固定条件的源码推导。Shape-r002树值必须来自真实编码浙江-de-杭州，useFilter.ts:97–139、323–332、596–604产生一个fieldId=f-province,f-city且value=[浙江,杭州]的isTree复合filter。today准确定位time-format.ts:149–151。任意node-city仅显示，不作两层消费正例。
4. **历史缺省**：QueryConditionConfiguration.vue:1769–1783补attributes；2318–2347按oldTreeLoad区分树绑定恢复。不得new Date猜旧语义、不得把缺carrier旧快照当可信设计；历史兼容仍保留。合法复杂形态不能永久拒绝来缩分母。
5. **提交**：prepare不写Store、不发查询/快照；确认后重验query版本、身份/兼容签名。共同aggregate单引用发布绑定carrier、query revision、commitId和见证根；发布前失败零副作用，发布后错误是已提交降级，不能谎报未变。Tree监听、过期异步响应及快照/预览必须门控，现状不具备保证。该算法为候选，相关有限设计缺口已被独立接收，不是运行证明。
6. **保存/普通编辑**：以r007为当前规则，撤销r005旧全根保存权威。同步捕获最新文档根及同一carrier，仅overlay查询propValue/cascade，保留后续样式/布局/非查询编辑；prepare或降级hydrate不得回放旧根。晚回包用完整持久化payload比较，不仅看queryRevision。
7. **undo/redo**：恢复选定完整历史根和对应carrier，产生新query revision/commitId，不新增历史条目；有效undo/redo均只有一次preview计划，边界no-op无版本或副作用。不得把保存overlay套到全根撤销。旧carrier缺失历史仍待证明。
8. **权限/反馈**：源/目标权限按原AC，真实只读配置保密/撤权仍阻塞；standalone/admin不可替代。取消/校验失败保持目标和预览、零新查询；成功才显示应用提示，正常保存后重开持久化。新增审计/加密不擅自升格。

上述前端路径均在core/core-frontend/src下，具体源码行和完整fixture以JSON绑定的各版本材料为准，不重新解释已冻原文。reviews/QueryAdapterDesignReview-r005仅在候选设计层接受QAR4-01/02；QueryAdapterShapeReview-r002仅在两层非空、无分隔符冲突、optionFilter缺省范围接受QAS-01/02。不能推广空数组optionFilter、混合深度、空值、DST、实际SQL或权限。

## 原义务不缩减

14项F01（Q004–Q015及ORIG-01/02）加Q066/Q067仍为16项，10项Goal AC仍完整。Q004/006/015对应类别/精确身份/完整承载；Q005/008/009/010对应共享、时效、身份及内部剪贴机制；Q007/011/012/013对应完整树、空源、动态规则和容量；Q014对应预览/保存重开；ORIG-01真实权限，ORIG-02历史复制改类型；Q066/Q067查询完整独立副本。GLOBAL来源/范围不丢项持续适用。AC-S02-02/03设计完整与独立冻结尚不能由本作者宣称通过。全部映射分母见JSON，未以纯准备器替代产品交付。

## 复核后第一个可立即实施切片

选择**S02-QPREP-001：typed查询引用闭包纯准备器**。仅处理显式typed输入和调用方给定ID映射，不碰真实权限、浏览器时钟、当前query schema、Store或UI。它可独立承接已接受的“唯一身份、完整闭包、不成环、独立副本”不变量，避免全适配器仍未明的运行来源和历史/形态影响。

拟新增实现：core/core-frontend/src/custom-component/filter-copy/query-reference-plan.ts；拟新增测试：core/core-frontend/tests/filter-copy-query-reference/query-reference-plan.test.ts。除此无Builder写范围，不修改现有pure-guards.ts或17项冻结子合同。函数/typed域/校验顺序/输出/错误码与8个固定case身份见JSON，正例给完整输入输出，负例给精确patch及reason；失败不得返回部分value。该typed中间模型不是产品payload schema；无元数据或权限承诺。

TC-QPREP-001成功映射；002缺条件闭包；003多义组件；004环；005新ID碰撞；006缺外部绑定；007引用数据/字段身份不匹配；008输入不可变和输出独立。对于多错误按JSON校验顺序返回首类错误；测试补更多输入防御不改变这8个验收identity。实现不得访问全局store、fetch、Date、随机ID或事件总线。源码连接依据是QueryCascade复合引用与查询配置checkedFields/Map结构，当前纯模块不接入它们，避免未经冻结schema转换。

一次独立复核接受后，主控制器冻结这个切片合同/cases并创建新独立Builder card与target-bound admission，预检既有TS runner（缺依赖不安装）；先记录真实可执行RED及原始stdout/stderr/源码摘要，再最小实现并同identity GREEN，定向lint及独立验证。若runner不可用应修正执行入口或报告实际阻塞，不伪造RED。纯模块测试不需要启动7070/8100或账号。

原17case的当前GREEN/lint有限证据保留，但ExecutionEvidenceReconciliation-r001记载历史RED及角色/时点缺口，不能追认为新切片准入。新纯准备器完成只可声明8项闭包准备合同成立，不能声明Q066/Q067、全F01、权限或产品可用。全查询适配器未ready不阻止这一独立切片按新准入实施。

## 剩余门槛和本轮检查

集成前仍须确认未污染设计来源、完整query转换与历史carrier、嵌套目标/全payload捕获、实际Vue门控/保存/撤销、树特殊值与空optionFilter、真实权限。它们留在完整Goal验收，不进入本纯准备器成功声明，也不再为当前有界切片追加设计轮。

本轮只做card摘要、来源摘要、JSON解析及case唯一性/正例身份一致性自检；产品执行NOT_RUN。此文件是整合候选，后续动作明确为独立复核→合规准入→有界实现，而非作者再次自行设计或自报冻结。
