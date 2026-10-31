# 查询过滤粘贴纯准备 r002 独立语义审查

## 双结论

- **Design Freeze Validity：NEEDS_REVISION（需要有限修订）**。
- **Implementation Entry Readiness：NOT_READY（本版尚不能建立 Builder 准入）**。阻断来自本纯helper自身的确定性合同矛盾，不是要求它先完成真实权限或产品提交。

r002已正确切开上游映射决策、纯准备、产品提交及真实授权；独立resultMode=1核对请求不会更改候选resultMode=0，这一方向与公开源码一致。下述三项blocking修复后可重新审查仅helper与runner的最小准入，不要求扩容owner或接入UI。

原分母10 Goal AC、26 must-have、16产品义务不变；S01状态未改；权限BLOCKED / NOT_RUN保持。用户C裁定仍为只追加一次核对、结束loading、仍缺保留无效选择，不与配置默认A的确认门槛合并。

## 接收、输入绑定与核对

SP-010 card validate/render均exit 0，canonical digest `0ec583b6e4ffcdc66ee79a9c1fa57df208539196bbeb46c4d5be34b54a37875b`。Context validate exit 0，raw SHA `4240bee49d3127704c50065b027946681f753b5c15c529c2c13c5f4a8ac2199b`。19项required-read摘要复算一致。

- Design-r002 SHA `21fae3ffe0c8b538749a5039132cb08c705eaacfcdfd1d9f48eb8e11744e1d82`。
- Fixtures-r002 SHA `eb1b77e38a49fa43d5889dee8dd41b2ecdad2691d36e0cd05ca7397d20427fb5`。
- 绑定拓扑r169 SHA `23f2563650a47d080873de08b4c693a200a25bc44e104fe574a455740a04b1f5`，只记录已有回归重跑和未决产品合同，不视作本helper实现或验证。

实际完成只读结构核对：18条case；基础目标根signature、resultMode0 requestKey、QPP-004 resultMode1 requestKey复算一致；QPP-001两个完整候选根逐值等于基础根仅替换QTARGET `TC-QTARGET-REBUILD-001`对应design/runtime部分。该检查仅验证给定合成值，不是执行拟实现helper，也不是产品或权限测试。读取QTARGET真实实现/runner、Select、EnumValueRequest和DatasetDataManage的相关路径，未运行构建或测试。

## Blocking findings

### QPPR2-01 / P1：保留了推导映射时代的拒绝oracle，与显式计划及QTARGET冲突

**证据：** Design:18明确helper不选择目标，给定referencePlan与targetComponents交真实QTARGET；QTARGET r008允许未使用的合法目录项。QPP-007只追加合法chart-C条目，计划仍明确指向chart-B，却预期 `MAPPING/TARGET_AMBIGUOUS`。QPP-006空目录预期 `MAPPING/TARGET_UNRESOLVED`，而真实QTARGET返回 `DIRECTORY/TARGET_UNRESOLVED`；Design:20又要求保留原stage/reason。

**影响：** 按r002文字正确复用QTARGET的实现会失败；为使用例通过反而必须添加与上游责任边界冲突的映射选择/歧义规则。这不是更严格校验，而是两套不相容的合同。

**最小disposition：** QPP-007改为显式计划仍可唯一解析时成功，或另建真实重复componentId目录负例（QTARGET的DIRECTORY拒绝），不得把额外合法项叫歧义。QPP-006统一为真实DIRECTORY结果，或在唯一明确的stage映射表中声明包装映射；此时删除“原stage原样保留”的冲突文字。保留原case identity并记录语义修订，不修改QTARGET既有合同。

### QPPR2-02 / P1：整体首错顺序与调用位置仍不确定，复验API未完全冻结

**证据：** Design:20写 `ENVELOPE→SOURCE→PLAN→TARGET→DEFAULT_ENUM→CANDIDATE_BINDING`，同时要求目标形状/唯一性/签名检查先于QTARGET；PLAN校验又交给QTARGET。因此“计划错误＋目标签名错误”究竟PLAN先错或TARGET先错无法同时满足。QPP-002/015期待SOURCE，而依赖原始失败stage为QCARRIER。当前current参数仅由base_revalidation_input展示，Design:29未固定其exact-key/type、非法current与无效handle双错顺序及成功返回形状；18条case没有未变化的正常复验成功oracle。sourceComponents输入被要求并绑定，但其校验责任/错误stage未定义，current也不带它。

**影响：** Builder必须自行决定阶段包装、是否重复调用依赖、current字段规则及source目录角色；不同实现可得不同可观察拒绝结果。句柄WeakMap是合理机制，但冻结句柄不自动保证返回candidate不会污染内部缓存。

**最小disposition：** 用一张有限阶段表写明本层检查、真实依赖调用时点与固定stage映射；补PLAN＋TARGET、QCARRIER＋TARGET双错用例。明确sourceComponents是只绑定不可变来源快照，还是需验证/复验的目录；不再暗示未实现的认证。固定current精确结构和返回形状，补正常复验、handle复制、返回candidate被调用方修改后再次复验、current枚举/身份代际变化及无效handle＋坏current的完整oracle。内部保存独立深副本，不能共享可变candidate。无需引入新身份认证或产品提交状态。

### QPPR2-03 / P1：枚举“显示值—映射值”关联及非法完整性证据的结果尚未冻结

**证据：** Design:23–25定义 `{label,value}`，只要求defaultValue和每个defaultMapValue“均在values中精确存在”，未说明按哪列及必须同一响应关系。QPP-001使用 `{label:A,value:A-code}`，但当前Select.vue:803–815把显示字段规范化为 `{label:value,value:value}`；原默认映射另由响应字段映射逻辑计算。且该QTARGET shape的displayId等于field.id，fixture的A/A-code不能直接冒充该真实请求产生的字段关系。r002已诚实限定合成证据，因此不是要求真实endpoint运行才能冻结，而是必须明确这是一种独立证据投影。另规定resultMode0不能complete=true，却没有为这一组合冻结唯一reason；请求query/display不匹配但重算合法key、过滤/搜索改变、身份代际变更也无完整oracle。

**影响：** 容易实现成分列独立成员检查：例如A对应X-code，而另一个B对应A-code，仍错误认定A/A-code有效。或把相同字段响应投影成源码不支持的显示/原始值关系。只校验requestKey可自洽不等于请求与候选一致。

**最小disposition：** 冻结values的真实含义及投影规则，例如明确 `displayValue/rawValue` 行关联，而非借用Select选项的label/value；如仍用现有字段名，明确label/value来自哪个响应字段，要求默认显示与映射满足同一行/关系。区分纯合成QTARGET透传测试与真实可产生的请求证据；可新增defaultMapValue=A的完整源码一致成功例，不改既有QTARGET合同。补配对错置、mode0+complete=true、模式1完整缺项、候选请求参数不匹配但key合法、枚举证据变化的唯一结果。无需新增网络调用或证明真实权限。

## 已接受的有界内容与非阻断说明

- **referencePlan责任边界：文字已修正。** 上游选择与本helper验证分离，当前阻断仅为残留QPP-007及阶段oracle不一致，不要求helper自行实现映射决策。
- **独立完整性请求：方向正确。** EnumValueRequest的resultMode注释为0默认/1全部；DatasetDataManage:1055–1058仅0走limit1000，非0走无该限制路径。helper可允许专用mode1核对而保持输出condition mode0；调用方仍负责实际响应完整性，不能仅看到mode1就自动认证完整。该纯函数不需真实endpoint验证方能实施。
- **目标根和签名：基础oracle一致。** 两个候选保留其他组件/目标style；确认复验同时比较revision与重新计算完整根签名方向正确。弱引用句柄不是授权token，eligibility及禁止canCommit的声明适当。
- **私有WeakMap登记并非产品写入。** 本helper可以有模块内部不透明句柄生命周期，不因此要求Store/admission产品运行验收；需仅保持不对外部输入/业务状态产生副作用。
- **非阻断N1：** fixture schema_version仍为r001而文件revision为r002，可以作为稳定schema版本，但应一句说明以免被误当旧fixture。QPP-004重复replace values不改变终值，可顺手删除重复操作；不单独阻断。
- **无待用户裁定question。** 三项均是当前设计内部可修复问题。权限模块来源及隔离环境仍外部阻塞产品激活，但不是本detached helper的语义阻断。

## 最小后续与声明上限

仅修新版本Design/Fixtures：移除残留映射歧义规则、统一stage顺序及包装、冻结复验API与枚举配对/完整性非法分支。随后轻量独立delta复核以上三项及依赖摘要；若通过，再由父流程建仅helper/runner的Builder card、Context和execution admission。此建议不是当前准入，也不重开已有C裁定。

允许的压缩描述：**r002完整根与请求摘要一致，上游计划和mode1专用核对边界已澄清；映射负例、阶段顺序/复验合同和枚举关联仍需修订，尚未准入。** 不得称产品粘贴、鉴权、快照、预览、保存回显或S02已完成。

本轮只新增本报告，未改被审材料、源码、测试、Goal或S01，未执行安装/构建/运行时验收。
