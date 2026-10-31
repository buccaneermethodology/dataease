# QPP Preparation r003 独立增量语义复审

## 双结论

- **Design Freeze Validity：NEEDS_REVISION（仅余两处有限oracle修订）**。
- **Implementation Entry Readiness：NOT_READY（本版尚未准入）**。

原r002发现QPPR2-01已关闭；QPPR2-02/03的主要语义修订接受，但仍有下述各一处精确残项。不是要求完成真实权限、UI或完整产品生命周期；两处修订不需用户再裁定。

## 绑定与检查

派发途中父流程明确废止旧card摘要，并提供新绑定。本报告仅采用重验后的card canonical SHA `992acc792985368a4569f5dd9fbc99b675479b264bcf4aeca83f4bd4e039e137`。validate/render均exit 0；renderer内容已读取。Context validate exit 0，raw SHA `0524a71ce07dd39c8e36bb4e26dd426c3a0a1b1e7cd402d1142321ea352033fe`。19项required-read摘要再次核对一致。

审查对象：

| 对象 | raw SHA-256 |
| --- | --- |
| Design-r003 | 775bea17e107e0055d766705e3cdf4b2cc0a81183d2e6e33c433906e7afa27c0 |
| Fixtures-r003（30例） | 1a04a217ae8aa462ddeaf428b6262ac20706c6389be18df93e2a4cd0dd3c3456 |
| 绑定Topology-r169 | 23f2563650a47d080873de08b4c693a200a25bc44e104fe574a455740a04b1f5 |

沿用已核对且摘要未变的Goal、QTARGET源码/fixtures/runner、Select、公开枚举DTO及后端模式分支。检查完整JSON、patch路径、首错条件、基础根/request摘要和候选结构；未执行未来helper、构建、应用或网络请求。候选根继承QTARGET完整design/runtime并保留其他组件的结构成立，QPP-019/029的成功candidate与基础干净候选完全一致。

## 前轮disposition

### QPPR2-01：CLOSED（设计层关闭）

显式referencePlan是上游输入，不再由helper选择映射。QPP-006准确返回 `DIRECTORY/TARGET_UNRESOLVED`；QPP-007追加未引用的合法chart-C后仍成功，与QTARGET保留合法未使用目录项一致。依赖真实失败stage/reason原样透传，未更改QTARGET原合同。

### QPPR2-02：PARTIALLY_CLOSED（主体关闭，剩QPPR3-01）

总顺序已固定为本层ENVELOPE→TARGET→真实QTARGET内部ENVELOPE/QCARRIER/PLAN/DIRECTORY→DEFAULT_ENUM→绑定。目标版本错误先于QTARGET错误的优先级明确，QPP-022覆盖PLAN先于空DIRECTORY。sourceComponents职责明确为冻结来源快照，不承担来源或权限认证；QPP-030覆盖其变化拒绝。

revalidate精确current键已冻结；无效handle优先；QPP-019正常复验、QPP-020无效handle加漂移、QPP-028身份代际变化、QPP-029外部candidate污染后再取干净副本均有完整输出。内部WeakMap独立深副本与返回对象隔离的要求可实现。不要求复验重新调用QTARGET或认证来源。

### QPPR2-03：PARTIALLY_CLOSED（配对/完整性规则关闭，剩QPPR3-02）

不再把Select选项label/value当原始字段映射；rows明确同一响应行displayValue/fieldValue，QPP-024拒绝交叉错置。QPP-025固定mode0＋complete=true为 `ENUM_COMPLETENESS_INVALID`；QPP-004/026覆盖mode1完整缺值；QPP-027修改displayId且重算合法key仍以 `ENUM_REQUEST_MISMATCH`拒绝，区分自洽摘要与候选请求一致性。

mode1只用于独立完整性证据，不改候选condition.resultMode=0；符合EnumValueRequest的0默认/1全部及DatasetDataManage的limit分支。helper不证明响应真实或完整的上限保留，故不以缺真实endpoint验收阻断本纯函数。

## 剩余blocking findings

### QPPR3-01 / P2：QPP-021补丁不能按声明的JSON Pointer操作确定执行

**证据：** QPP-021第二个操作为 `replace /source/sourceRoot/propValue/0/unsupported = true`，基础condition没有unsupported键。fixture_resolution只声明JSON Pointer ops，没有给replace不存在键时upsert的特殊规则。标准JSON Patch replace要求目标键存在。

**影响：** 严格runner在构造输入阶段即失败，而不是进入helper并观察TARGET优先；若Builder自行采用upsert，又引入未冻结操作语义。不能用构造失败冒充可信业务RED。

**最小修正：** 仅将该操作改为 `add`，保留QPP-021 identity及期望TARGET错误。或者给统一操作语义，但为一个新增键无须引入新DSL。复核全部patch均可应用即可，无需扩展测试域。

### QPPR3-02 / P2：基础成功oracle仍与本版明确的同行字段投影矛盾

**证据：** 基础条件field.id=province、displayId=province，请求queryId/displayId也都为province。Design“默认枚举证据”规定displayValue=`String(row[displayId || field.id])`，fieldValue=`String(row[field.id])`。两表达式读取同一个属性，必相等；但QPP-001/023基础rows为 `{displayValue:'A',fieldValue:'A-code'}`。这不能由该投影生成。QTARGET原fixture允许这种合成默认/映射值，证明其透传/重绑合同，不证明真实枚举行存在。

**影响：** 当前成功链把两个分别可测的合同混为一个源码一致的witness；即使不认证endpoint真实性，也不能声称它满足本版规定的投影关系。未解决此点会继续将纯QTARGET合成值误读为产品可产生的准备成功输入。

**最小修正二选一：**

1. 为QPP采用当前shape实际可生成的同字段A/A配对：显式派生完整source默认映射和对应QTARGET调用输入/输出，保留原QTARGET r008不变，并给完整候选oracle；或
2. 明确把A/A-code保留为仅测试给定配对事实的合成单元witness，声明不满足本shape真实投影，另新增一个完整A/A源码一致成功witness；对helper究竟验证投影关系还是仅消费不认证的配对事实写出明确支持边界。

无需改动QCARRIER/QTARGET、实现不同display字段新shape，亦无需启动真实枚举服务。QPP-024交叉配对拒绝作为纯合成关系测试仍有独立价值。

## Non-blocking记录

- QPP-015现仅有一个source shape改动，expected QCARRIER/UNSUPPORTED_SHAPE正确；标题仍写“双错”应改称源shape拒绝，不再用它声称双错覆盖。真正目标优先的双错由修正后的QPP-021承担。
- QPP-004重复替换rows不影响终值，可清理但不阻断。
- card maximum_claim_ref.summary仍提r002；实际card identity、execution、read refs、write scope明确r003。按本次明确派发审查r003，不据此扩大声明，可在下次card中修正笔误。
- 以内部WeakMap保存不透明句柄是允许的内部状态，不等于写业务Store；“纯准备”在此指对产品外部状态零副作用，不要求彻底无内部记忆。

## 最小后续与不变边界

仅修以上两处oracle及必要描述，保留旧证据，重新绑定摘要后可作定向Delta复核；不要重做全域来源研究或扩容owner。通过后才由父流程建立仅helper/runner的新Builder card、Context与精确execution admission。本报告不签发准入，也不授权UI/Store、快照、预览、查询或保存写入。

原10/26/16分母、S01独立状态与权限BLOCKED / NOT_RUN保持。用户C一次核对策略保持，配置默认值验证不借此放行。未关闭完整QPCR产品事务问题、来源认证、真实授权、保存重开或任何Goal完成条件。

本轮只写本报告，未修改候选、代码、测试、Goal或旧审查。
