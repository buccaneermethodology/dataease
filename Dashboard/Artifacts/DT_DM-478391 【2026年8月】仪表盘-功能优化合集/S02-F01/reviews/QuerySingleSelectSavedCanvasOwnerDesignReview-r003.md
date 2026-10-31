# 已保存画布 owner r003 独立增量复审

Design Freeze Validity：`NEEDS_REVISION`。

Detached Helper Implementation Readiness：`NOT_READY`。不批准源码、测试、权限或产品接线。

## 入口及证据

读取rendered prompt，card canonical SHA256 `11858dcc2d280f515f717f0a15a5f6af8613ea240ef4671ae7cc6ce84021881b`复验通过；validate/render及Context validate均exit0，Context raw摘要匹配card绑定，全部required-read摘要入口/收尾无漂移。已完整读取设计与37例，逐例审查动作/预期；独立解析全部101个ref descriptor，路径均可在各例对象图解析。这是静态路径检查，不是helper执行通过。

沿当前dvMain.ts:533及query-single-select-session.ts的真实组件判据复核；继承已验证的dashboard加载/恢复/copy/create/template/onInitReady观察，不将其替代真实producer。仅写本报告，未运行产品或测试。

## 前轮发现处置

- SCO2-01关闭：SCPO2-010现在先切current root到clone数组，再register，ROOT_REPLACED与generation1符合顺序。
- SCO2-02部分关闭：root数组及成员本身作为raw identity、取消topLevelComponents投影已明确；但组件类型字段仍不对应真实root，见SCO3-02。
- SCO2-03主要算法缺口关闭：共享复验明确load/mode/三处ID/canvas/root/已注册目标顺序，route和dvInfo单独变化及同root替换/删除有用例；OwnerValidity/RegistrationResult/RegistrationValidity与失活幂等已定义。剩余精确性见SCO3-03。

## 最小阻断 findings

### SCO3-01 / 高：SCPO2-022、023、025仍使用非数组root，无法到达所期待的成功生命周期

022、023的objects.r仍是{}；025的r1/r2仍是{}。三例ready/edit/合法资源通过前置检查后，begin按r003规则应返回LIVE_CANVAS_IDENTITY_REQUIRED，无owner。它们却分别期待显式失活、auth失活及两个epoch成功创建。因此原有oracle未跟随root数组合同迁移。025还沿用replaceFactoryContext，r003新DSL仅明确setCurrentContext及factory计数规则，不能默认该旧动作等价于同factory上下文更新。

最小修订：需要成功begin的root改为数组；025统一使用已定义的同factory setCurrentContext，或完整定义替换操作和计数域。保留早期错误用例004..009中的非数组root作为较低优先级错误是允许的，不必机械全部修改。

### SCO3-02 / 高：声称直接使用真实componentData成员，却以type字段判VQuery

设计ComponentRaw={id,type}，所有查询fixture成员使用type:'VQuery'；当前dvMain.ts:533判断的是 `component==='VQuery' && innerType==='VQuery'`，session的isQueryComponent亦如此。r003又明确不允许投影或wrapper，故helper直接消费真实root时不能按type识别目标；为通过fixture写出的helper可能拒绝真实组件或接受仅伪造type的其它组件。

最小修订：在合同和fixtures使用当前源码的component/innerType双字段判据；补一项二者不一致或仅type=VQuery的拒绝用例。不能通过克隆/添加字段破坏原数组项身份来适配。

### SCO3-03 / 中：同一目标重复注册的token替换规则仍未唯一化

合同允许多目标、opaque token必须仍在registrations中，但未定义同一owner对同一ID/raw重复register是复用token、替换旧token还是保留多个token。三种行为都能满足现有37例，却给validateRegistration(oldToken)不同结果。成员身份生命周期合同必须明确这一普通可发生操作。

最小修订：选择并冻结重复注册规则，添加重复register后验证旧/新token的精确用例。补一句validateRegistration对外来owner返回unknown/OWNER_HANDLE_INVALID的完整结构；当前“先验证owner handle”方向明确，但不能令实现者猜字段是reason还是error。

## 非阻断精确性

SCPO3-035使用全空白targetId，预期INVALID；正文只写非空字符串且有“非非空”笔误，建议明确与resourceId相同的拒绝全空白规则。OwnerValidity用reason，fixtures的validate错误常用error；runner应明确这是oracle归一字段而不是要求返回两种结构。101个ref路径可解析不证明这些返回字段约定已运行验证。

## 边界和后续

修订上述最小项再复审；不因真实权限外部阻塞而阻止本地设计修正。当前可认可的是共享复验与终结方向，不是detached helper准入。加载producer、proxy/raw真实归一、缓存恢复支持仍须另审；source_read/paste_commit保持false，不提供readDesign、业务提交、snapshot、preview或save。

完整10 Goal AC、14 F01＋Q066/Q067＝16产品义务、合计26 must-have，Scope Delta none、S01独立保持。真实权限 `BLOCKED / NOT_RUN`；QPC产品接线 `NOT_READY_FOR_PRODUCT_UI_STORE`。已保存画布真实owner/权限/产品入口义务不因此完成。本报告仅独立设计复审，无其他文件修改。
