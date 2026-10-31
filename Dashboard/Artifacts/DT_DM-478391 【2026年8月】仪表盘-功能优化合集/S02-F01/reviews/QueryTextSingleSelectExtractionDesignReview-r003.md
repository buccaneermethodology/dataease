# 普通文本单选 value-state 子载体 r004 独立语义复审

## 三项结论

- **Design Freeze Validity：FAIL（缺少有效 revision 错配用例）**。r004 已解决前轮的身份比较输入与拒绝优先级冲突，source/type boundary、valueState 白名单及完整 adapter 静态字段责任也已明确。剩余缺口是合同承诺逐字段比较 revision/resource/component binding，但 14 项 fixtures 只有 resource/component 的有效错配，缺少“两个 revision 均有效但彼此不同”的反例。TC-006 是两边 revision 均为 null 的非法输入，不能证明 revision 相等性判断。
- **Pure-helper Implementation Entry：WEAK / 有界候选**。helper 的纯函数职责、opaque 输入前置条件和 valueState 输出语义已具体到可实现；缺真实 producer 不阻断一个不接产品、只消费已提供名义类型且不创建/签发该类型的 helper 候选。但必须先补 revision 错配用例并冻结新 case identity，才可按可信 RED/同身份 GREEN 准入。当前尚不满足完整 Builder admission。
- **Product Integration：BLOCKED**。源码中没有找到 `VerifiedDesignValueSnapshot` 或 `VerifiedDesignBinding` 的真实 producer。没有已验证设计态读取边界，无法证明用户产品调用提供的输入真是被认证并绑定的快照；不得接 UI、Store、复制流程或宣称认证有效。

本复审不证明实现、产品运行、权限或 Goal 验收。

## 审查输入与摘要绑定

review card canonical SHA-256 `b2423dd692d257fe9d9b41db45116ce2c8dab9d18f3e2237450d26d62b4f7899` 的 validate/render 均通过；Context Bootstrap validate/render 也通过。card/context 指向 Design/Fixtures r004 和 Topology r155，并涵盖 Goal、r004 上游设计审查、相关源码、Session 与前轮审查。关键输入摘要与实际文件一致：

- Design r004：`8876041e6d27d8a7f35b4e744c3f5274fce9b6d3d0bdeabb4e906d97060c38b5`
- Fixtures r004：`c470bf743db54515c07b63954fd017734903fa6ae4972ee5c1c5bf1cf055b13e`
- Topology r155：`b4e29262836a2e732e4bbd41a3f64bb8f65d6b9d1f4b2d057897e4e3df60f40e`

Topology r155 把 r004 记录为未准入候选，准确披露了本轮前序矛盾及 `product callsite stays blocked`。该审查包没有发现摘要或读集漂移。

## 设计与 14 项 fixtures

Fixtures 的 `design_id`、revision 和 case_count 分别与 r004、4、14 一致，实际 case 数为 14。成功用例覆盖默认 A 覆盖旧运行 B、无默认时清除旧 B、carrier JSON 往返、detached 输出；9 个运行时拒绝用例输出统一，均要求无 carrier/runtime 部分结果、source 不变及 query/Store/snapshot 写入为 0。另有 1 个普通 JSON 的编译期拒绝用例，正确标为不适用运行期结果，没有把静态类型拒绝冒充运行时认证。

r003 两个阻断已在 r004 中得到修订：

- TC-004/005 现在提供独立 `expectedBinding`，资源或组件绑定错配可逐字段比较并期望 `SOURCE_STAGE_UNVERIFIED`。
- TC-009 去掉额外未知键，仅以 `optionValueSource=1` 测 shape 越界，期望 `UNSUPPORTED_SHAPE`，与额外/缺失键优先返回 `UNSUPPORTED_FIELD` 的规则一致。

### F-01（P1）：缺少有效 revision 不匹配反例

设计和 TC-004/005 的意图都要求 helper 比较 revision/resource/component 的完整绑定元组；Fixtures 文本也称覆盖“三元绑定错配”。但当前只有 resource 与 component 的有效错配。TC-006 将 snapshot 和 expectedBinding 的 revision 同时设为 `null`，其预期是 `INVALID_INPUT`，这不覆盖 revision 8 与 revision 9 这种双方各自合法但不相等的情形。

**影响：** 当前 RED/Validation 即使完全漏掉 revision 相等性检查，也能通过其余两个错配用例。revision 绑定是防止读取或消费错误保存代次的关键约束，不能仅由代码审阅补足测试 oracle。

**建议处置：** 在实施准入前新增一个独立用例，snapshot 与 expectedBinding 的 revision 均为有效值但不同，期望 `SOURCE_STAGE_UNVERIFIED`、无部分输出和零副作用；同步更新 design/fixture 版本、case_count、Topology 和 card/context 后复验摘要。保留已有 14 个 case identity，不覆盖或改写冻结历史。

### Source producer 与测试描述的边界

在 `core/core-frontend/src` 与 `sdk` 搜索未发现 `VerifiedDesignValueSnapshot` / `VerifiedDesignBinding` 的定义或生产者。r004 正确将两者描述为不透明输入，并明确 `prepare` 不负责认证、存储读取或创建类型；fixtures 的 `fixtureOnlyTrustedBinding` / `fixtureOnlyBinding` 是测试描述符，test harness 才把它们转成名义类型，不能复制到生产 API 或作为信任布尔值。TypeScript nominal typing 只构成可信模块调用边界的 API 契约，不抵御恶意 JS、类型断言或运行时反射；设计对此有适当限定。

这允许纯 helper 将“传入的是上游已认证类型”作为调用前置条件，测试 harness 仅为单元测试构造类型化值，但 helper 自身不能成为信任工厂。产品使用必须等真实 producer、身份绑定和调用生命周期经过独立核实。

## 源码投影与字段责任

- `useFilter.ts` 的普通非日期路径：首次选择从 `defaultValueCheck/defaultValue` 得值，`forMatterValue` 将 `A` 包成 `['A']`；空选择在非空门槛处被跳过，因此无默认首次投影为 `[]`。非首次选择消费新运行态 `selectValue`，A 对应 `['A']`，未选择时不产生过滤项。与 fixtures 的首次/非首次 oracle 相符，但当前仍是静态源码推导。
- `Select.vue` 与 `QueryConditionConfiguration.vue` 中 `defaultValue`、`selectValue`、`mapValue` 会在配置交互、重置及选项变化时分别更新；由此仅凭运行中的组件 JSON 不能认证保存设计态快照。r004 保留了这一来源边界。
- `valueState` 的允许键及值类型现已列举；静态字段及身份重绑明确留给上层 adapter，本 helper 不处理完整组件，避免“只返回 value-state carrier 却声称保留静态字段”的误读。
- 首次和非首次 filter oracle都没有执行产品行为测试。Fixtures 的零查询/零写入是纯 helper 的预期副作用边界，不是浏览器、Store、保存或权限验收。

## Scope、claim ceiling 与后续路径

r004 的 shape 限于普通手工文本单选，不扩大为完整 query adapter；原 Goal 10 项 AC、26 项 must-have、16 项产品义务仍完整保留。只读查看、复制/粘贴限制及撤权等真实多用户权限验收继续 `BLOCKED / NOT_RUN`；standalone/admin/mock 不作替代。S01 状态不变。

**最小后续：** 先新增有效 revision mismatch fixture 并冻结新版本；之后可准入仅包含类型声明、detached pure helper、test-only opaque-value harness 和同身份 runner/tests 的实现切片。不得在该 Builder 中定义真实认证生产者、改 UI/Store/保存/查询或接产品消费者。产品集成另立 Session：定位真实保存设计快照读取边界，证明其认证并绑定 revision/resource/component，再单独形成合同、测试与 admission。

**误用风险及控制：** 后续 Builder 不得把 fixture 标志当生产信任字段；不得在 helper 内自行签发 Verified 类型；不得因 resource/component 两种错配用例通过就声称 revision binding 已覆盖；也不得把纯 helper 的 `active/implemented` 状态压缩成产品 adapter、权限或 Goal 完成。状态应写为“pure helper candidate”，产品接线明确 `BLOCKED`。

语义诊断限于 S5（revision 绑定验证缺例）与 S6（测试夹具信任描述和真实 producer authority 边界）；落点为 L5 Validation 及 L6 Runtime/Product Integration。此为有限诊断，不作评分。

## 收尾边界

本报告只写 review card-r003 指定的唯一输出路径。未改 Design、Fixtures、源码、Goal、Sessions 或 Topology；未实现 helper、未运行产品/浏览器/权限/数据库测试、未发放 Builder admission。独立设计复审不得写成 S02、F01、产品、权限或 S01 已完成。
