# 普通文本单选 value-state 子载体 r003 独立语义复审

## 双结论

- **Design Freeze Validity：FAIL（当前 r003 fixtures 与冻结契约存在两处阻断矛盾）**。r003 的窄范围、opaque provenance 边界、静态字段责任和声称上限已比 r002 清晰；但 TC-QTEXT-REJECT-004/005 的身份拒绝无法由当前 helper 输入判定，TC-QTEXT-REJECT-009 的错误码与合同规定的拒绝顺序冲突。不能把这 14 项用例集冻结为可实现 oracle。
- **Implementation Entry Readiness：FAIL（当前用例集不可安全驱动 Builder）**。应先修复下面 F-01/F-02 并复审。缺少真实 provenance producer 本身不要求阻断一个不接产品的纯投影 helper；但 helper 不得自造/签发 `VerifiedDesignValueSnapshot`，其生产者必须作为上游前提。当前产品调用及产品集成仍 `BLOCKED`，直到真实生产者被源码定位并验证。
- **总体：BLOCKED，限这两个合同/用例问题**。未运行产品实现；源码映射结论仅为静态推导。

## 输入绑定与确定性检查

审查使用的 lane card canonical SHA-256 为 `63b41ea63120ca5e3859a6fb6d1afcb80bda1e8ee3d33b9ca16ef87d93534835`。`lane_task_card.py validate`、`render` 及 Context Bootstrap `validate`、`render` 均通过。r002 review card 和 Context 的读集明确绑定：Goal、QueryProductAdapterDesign-r004、对应 r004 独立审查、r003 Design/Fixtures、`options.ts`、`QueryConditionConfiguration.vue`、`Select.vue`、`useFilter.ts`、相关窄设计、Sessions、Topology r154 和 r001 前次审查。

当前输入实际摘要与绑定一致：

- Design r003：`cc17cda6ecccc39bcd4ebfcbd68f34468d46657fda04ed99d52804cc326e4bc5`
- Fixtures r003：`ebc0de50fd5187b3d78973913de526680dd9aea45f1cdddcc806ba8c6c129e2e`
- Topology r154：`9d3fef126b39e853ced8653b38d12ca13df67b82957b526b266d583716495a66`
- Context Bootstrap：`858b87769cb5f5c026751ca5ff220ef3493d8c672de2199ab5a0bba47b770a8b`

Topology r154 记录 r003 是未准入候选、列出前次 F-01..F-06 和上述输出摘要；本次实际 Design/Fixtures 摘要相符。该审查输入包可追溯，和前次 r001 审查输入漂移问题不同。

## 14 项用例复核

Fixture 的 `design_id` 与 r003 一致，`revision=3`、`case_count=14` 与实际 case 数一致。成功例包含默认 A 覆盖旧运行 B、关闭默认时丢弃 B、JSON 往返、输入不变；拒绝例包含未认证绑定、revision 无效、字段额外/缺失、shape 错误与默认值空/null/类型错误。失败例的输出字段一致，均要求 `carrier=null`、`runtime=null`、source 不变、查询/Store/snapshot 写入为 0、`partialOutputOnFailure=false`。

与当前源码相符的 oracle：`useFilter.ts` 普通非日期 shape 首次选择取 `defaultValueCheck ? defaultValue : ''`，`forMatterValue` 把 `A` 变为 `['A']`，非空结果才 push filter；无默认时空字符串在进入格式化/push 前被跳过，投影为 `[]`。非首次使用重建后 `selectValue`；A 投影为 `['A']`，无选择时不生成过滤项。静态源码调用链支持这些候选期望，但不证明运行行为。

### F-01（P1）：资源/组件“错配”拒绝没有可比较的 expected identity

TC-004/005 的成功输入只有 `{ snapshot, valueState }`。两个 case 分别把 snapshot 的 `resourceId` 或 `componentId` 换成其它字符串，并期望 `SOURCE_STAGE_UNVERIFIED`。设计定义的 helper 输入中没有独立的 expected resource/component identity，也没有另一个绑定凭据可供比较；`valueState` 也不含这些身份。因此 helper 无法判断 `other-resource` 或 `other-component` 是错配值，还是一个本身有效的资源/组件身份。仅凭 opaque nominal brand 只能表示生产者曾认证该 snapshot，不能从函数目前的参数推导出“与哪个期望身份不一致”。

**影响：** 这两项 oracle 要求实现者猜测不存在的绑定规则，或暗中增加参数/全局状态；同一输入合同无法完整实现和验证。

**需要的修复：** 明确身份比较的 authority 与目标值来源：例如让 helper 接收独立的 expected binding/目标身份并将其纳入签名，或删去“错配应由 helper 拒绝”的要求，改由真实上游生产者承担并另行验证。修订后同步更新两项输入、期望状态和身份 claim；不可在 Builder 中临时补接口。

### F-02（P1）：TC-009 的错误码违反冻结拒绝优先级

TC-009 的 `valueState` 同时包含不支持的 `optionValueSource=1` shape 和额外未知键 `extra`。设计的拒绝顺序是先检查值态精确投影额外/缺失键并返回 `UNSUPPORTED_FIELD`，再检查固定 shape 并返回 `UNSUPPORTED_SHAPE`；但该 case 期望 `UNSUPPORTED_SHAPE`。

**影响：** Fixture 与设计给出不同的 oracle，Builder 无法同时满足二者；也会使“字段白名单”和“shape 越界”优先级在失败分类中不确定。

**需要的修复：** 若验证拒绝优先级，把该 case 的预期改成 `UNSUPPORTED_FIELD`；若要单独覆盖不支持的 shape，则移除 `extra` 并保留其余形态越界字段。不得修改实现来迎合冲突期望。

### 其它核对结果

- r003 明确 `valueState` 精确键和值类型、未知字段拒绝；把完整静态字段保存和重绑留给上层完整 adapter，并声明此 helper 不接收或输出完整组件对象。较 r002 的责任边界清楚。
- source provenance 由不透明 `VerifiedDesignValueSnapshot` 表示，普通 JSON 字段不能认证；设计亦明确 nominal type 不是恶意 JavaScript/反射的安全边界，helper 不负责读取存储或创建认证值。该区分是正确的。
- `rg` 在产品源码范围未找到 `VerifiedDesignValueSnapshot` 的定义或真实 producer。设计也诚实声明此缺口，未把 fixture 标记声称为真实认证。
- `fixtureOnlyTrustedBinding` 是 fixtures 中的测试辅助字段，不是可由产品 JSON 提供的认证证据。未来 runner 必须把它作为测试夹具控制信息，在 test-only harness 内构造/拒绝 opaque 输入；产品 helper 不能读取该布尔字段来决定可信度，也不能添加生产 trust factory。
- 当前 14 项已补首次/非首次过滤投影、完整失败输出与 A/B 分离；case-004/005/009 是唯一本报告认定的阻断用例矛盾。未知产品形态仍处于原范围之外，不因本 slice 而关闭。

## provenance 缺口与准入边界

纯 helper 的任务是对上游已认证类型做确定性、detached 的 value-state 投影；**认证生产者和产品调用是另一层依赖**。因此，未来在 F-01/F-02 关闭并重新冻结用例后，可以只准入一个不接 UI/Store/保存/网络/查询/权限、不创建或伪造认证输入的纯 helper 候选；测试夹具生成的 opaque 值必须严格留在 test-only harness，不能变成生产 API。其 claim ceiling 仅为“typed input precondition 下的纯变换候选”。

产品使用仍不可准入：在源码中找到真实保存设计快照的读取入口、证明它绑定 revision/resource/component identity，并验证生命周期/调用方可持续提供该 opaque 类型之前，不得把 helper 接入实际复制流程。若新建一个 producer、把 `fixtureOnlyTrustedBinding` 当认证字段，或用测试 cast 声称 runtime provenance 已验证，均越过本设计边界。

## 原范围、claim ceiling 与最小后续路径

Goal 仍为 10 项 AC、26 项 must-have、16 项产品义务；本窄 shape 不替代完整 adapter 或 Goal。只读限制、复制/粘贴限制、权限撤销等真实多用户行为继续 `BLOCKED / NOT_RUN`；standalone/admin/mock 均不能补证。S01 状态未改变。

**当前最小安全后续：** 修正 TC-004/005 的目标身份比较输入/authority，并修正 TC-009 错误码；复核 JSON/fixture identity 和上述 oracle，再冻结新用例身份。通过后可考虑仅实现纯 helper 与同身份 runner/tests；产品 adapter 使用需另等真实 producer 和独立产品验证。

**实现阶梯：** (1) 冻结 provenance 调用前提和输入白名单；(2) 修复两项冲突并重验完整 14 case；(3) 建可信 RED 和精确 Builder card/context/admission；(4) 实现 detached helper；(5) 同身份独立 Validator；(6) 单独定位 producer 后再设计产品接线合同、测试和 admission。各阶梯不得合并成“完整适配器已支持”。

**误用情景：** 维护者把 `fixtureOnlyTrustedBinding=true` 当运行时认证；Builder 猜测目标 resource/component 身份或添加隐藏参数；Dashboard 单行“review pass”被后续代理压缩成产品权限/Goal 完成。缓解分别是隔离 test-only 夹具、冻结显式 binding authority、在状态和摘要中保留“helper candidate / product use blocked”。

S2（用例/契约语义漂移）、S4（身份对照与拒绝分类歧义）、S5（真实生产者尚不可验证）为本轮相关诊断；落点主要是合同与 Validation L5，provenance 产品依赖为 runtime/integration L6。此为有界 reviewer 诊断，不是自动评分。

## 收尾边界

本报告只写 review card-r002 指定的唯一输出路径。未修改 Design、Fixtures、源码、Goal、Sessions 或 Topology；未实现 helper、未运行产品/浏览器/权限/数据库测试、未发放 Builder admission。报告的 PASS/FAIL 是本次候选设计的审查 verdict，不是 S02、F01、产品、权限或 S01 的完成状态。
