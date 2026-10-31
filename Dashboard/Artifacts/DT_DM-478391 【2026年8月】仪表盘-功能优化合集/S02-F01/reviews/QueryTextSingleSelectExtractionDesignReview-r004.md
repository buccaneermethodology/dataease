# 普通文本单选 value-state 子载体 r005 独立语义复审

## 三项结论

- **Design Freeze：PASS WITH FINDINGS（有界通过，附 P2 用例输出形状 finding）**。r005 把 revision/resource/component 三字段绑定比较写入接口和用例，并正确区分“有效但不相等”与“双方均非法”。范围与 claim ceiling 清楚，未声称 producer、产品行为或 Goal 验收。剩余 finding 是 TC-015 的 expected 对象额外带 reason，而设计要求所有运行期失败用例使用同一字段集合。该项不改变核心语义 oracle。
- **Bounded pure-helper Builder readiness：WEAK（有界候选；先归一化用例）**。不接产品的纯 helper 可只消费上游提供的 opaque 名义类型，不需要本切片同时实现真实 producer；但 Builder 前应把 TC-015 的 reason 移出 expected result，或将该诊断字段正式加入所有运行期失败结果契约，然后冻结对应 fixture identity。当前报告不等于发放 Builder admission。
- **Product integration readiness：BLOCKED**。本次源码搜索仍未找到 VerifiedDesignValueSnapshot / VerifiedDesignBinding 的真实 producer。没有已验证设计态读取边界，不能证明产品调用者获得的值被认证并绑定资源、组件及 revision；不得接 UI、Store、复制流程或宣称来源验证完成。

## 审查包与输入摘要

以更新后的 canonical card digest 21d905e301e4df566f6b1b4e8b13aaaf49b4d55a4858cb7d3cb877cd7ac4a929 重新复验：card validate/render PASS；Context validate/render PASS。更早的 digest cb5be6d… 已作废，本报告不以旧绑定作为证据。渲染指令唯一写入范围为本文件。

关键输入摘要：

- Design r005：b27de64b08d2c51b5290b421a7c7b366f9af546feaba055ee98bd9a3bfa19b00
- Fixtures r005：8d9c47e4660ce90d410bc0686d91a28d81d3ba27217d4dfbe70ba28854c9add1
- Topology r156：e51ebd43fcb54020c1635bb781c685234fda405d387fbb969fc3baba4f5e5bc0

card/context 将 r005 Design/Fixtures、相关源码、Goal/Session 与 Topology r156 纳入本轮输入。实际摘要和卡片读集相符；没有发现新的输入漂移。

## 绑定、拒绝顺序与 16 项 fixtures

Fixtures 的 design_id、revision、case_count 与实际 cases 数分别为 r005、5、16。关键绑定行为符合当前合同：

- TC-015：snapshot revision=8、expectedBinding revision=9，两者各自合法、其余身份相同，期望 SOURCE_STAGE_UNVERIFIED，且无 carrier/runtime、零副作用。
- TC-016：snapshot 与 expectedBinding revision 均为 null，期望 INVALID_INPUT，不把两个相等的非法值误判为合法匹配。
- TC-004/005：resource/component 错配由独立 expectedBinding 比较，期望 SOURCE_STAGE_UNVERIFIED。
- TC-007/008：额外/缺失键期望 UNSUPPORTED_FIELD；TC-009 不含未知键，仅 shape 越界并期望 UNSUPPORTED_SHAPE；TC-010/011/012 分别覆盖空、null、错误类型默认值。
- 普通 JSON case 是编译期类型拒绝，没有伪造运行时 status。Fixtures 的 fixtureOnlyTrustedBinding / fixtureOnlyBinding 明确是 test harness 描述符，不是生产 API 字段。

运行时失败均要求 carrier=null、runtime=null、source 不变、query/Store/snapshot 写入为 0、无部分输出。唯一不满足“同一 expected 字段集合”的是 TC-015：其 expected 对象比其它运行期失败多 reason 字段；见 F-01。

### F-01（P2）：TC-015 的诊断 reason 混入 expected result

r005 设计明确要求所有运行期失败用例采用同一字段集合，断言 carrier/runtime 空值与零副作用。TC-015 在相同失败 oracle 外额外加入 reason: “valid revision 8 differs from expected binding revision 9”；其它运行时拒绝用例无该字段。reason 位于 expected 结果对象内，没有定义为 fixture annotation 或非输出说明。

这会导致结构化 runner 不清楚 reason 是 helper 返回值的一部分，还是仅供读者解释的元数据。若把它当结果字段，失败结果 schema 不一致；若忽略它，runner 必须自行推断字段语义。

**最小修订建议：** 把说明移到 case 的 intent 或独立 oracle_note / rationale 字段，并保持 expected 字段集合一致；或者若 reason 确属 API 输出，就在合同中定义并为所有运行期失败冻结统一字段及值。此 finding 不改变 revision mismatch 的正确结论，但修订后应更新 fixture digest、Topology 与准入材料。

**准入影响：** 该 finding 不阻塞窄设计语义冻结，故 Design Freeze 为 PASS WITH FINDINGS；但阻塞对当前 16-case fixture 的可信 RED / same-identity GREEN 与 Builder admission，pure-helper readiness 保持 WEAK，直到字段归属和新摘要明确。它不扩大为产品接线阻塞；产品 integration 因缺真实 producer 独立保持 BLOCKED。

## 源码 oracle 与来源真实性边界

普通手工文本单选首次路径在 useFilter.ts 中读取 defaultValueCheck/defaultValue；forMatterValue 将 A 转为 [A]，有效非空结果才进入 filter.push。无默认时空选择在非空门槛处跳过，因此首次过滤投影为 []。非首次由新 runtime 的 selectValue 进入同一路径：A 得 [A]，未选择时不生成过滤项。四个成功 fixture 的首次/非首次投影与源码调用路径一致。这是静态源码推导，不是运行中的产品验收。

对 core/core-frontend/src 与 sdk 搜索未找到 VerifiedDesignValueSnapshot 或 VerifiedDesignBinding 的定义/真实 producer。r005 正确将它们留作上游 opaque 类型，并明确纯 helper 不创建认证值、nominal type 不防恶意 JS/反射。由此：

- **纯 helper**可以按该类型前置条件做独立候选，不接产品、不创建 producer、不把测试 harness 当可信生产边界。
- **产品调用**必须等待真实保存设计态读取 producer 被定位，并验证 revision/resource/component 绑定和生命周期；在此之前保持 BLOCKED。

valueState 白名单精确限定普通手工文本单选；完整组件静态身份、字段、数据集、条件与展示配置明确留给上层 adapter。helper 只处理 value-state，不声称负责保留静态字段。此责任划分与上游审查边界一致。

## Scope、claim ceiling 与下一步

本 slice 仅覆盖 displayType="0"、单选、手工选项且不含参数/远程/树/级联/日期；原始 Goal 10 项 AC、26 项 must-have、16 项产品义务均保留。真实多用户权限、只读用户查看/复制粘贴限制及撤权验收仍为 BLOCKED / NOT_RUN；S01 状态不变。

下一步仅需把 TC-015 的诊断字段移出 expected oracle，复验新版本摘要和 card/context；之后才能对纯 helper 发放精确、target-bound Builder admission，并用同身份 RED/GREEN 和独立 Validator 验证。产品集成另行等待真实 producer，不得因纯 helper candidate 通过而宣称完整 adapter、权限或 Goal 完成。

未来误用需防止：把 fixtureOnlyTrustedBinding 当产品认证；把纯 helper 候选写成完整产品支持；把 revision mismatch 单例误读为真实保存链已认证；把未验证权限压缩成已覆盖。状态应保持“纯 helper 候选/产品接线阻塞”。

## 审查范围声明

本报告只写 card 唯一目标。未修改 Design、Fixtures、源码、Goal、Sessions 或 Topology；未实现 helper，未运行浏览器/产品/数据库/权限测试，未发放 Builder admission。审查结论不代表 S02、F01、产品、权限或 S01 完成。
