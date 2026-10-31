# 普通文本单选 value-state 子载体设计 r004

## 目的和边界

本设计只处理普通手工文本单选：`displayType="0"`、`multiple=false`、`optionValueSource=0`，且不含参数、远程选项、树、级联或日期语义。目标是把已保存设计态的默认 A 保留为设计意图，并阻止旧运行值 B 进入新运行态。

这是完整查询组件适配器中的 value-state 子模块，不是完整组件 extractor。组件身份、字段、数据集、条件、展示配置等静态字段仍由上层完整适配器保留和重绑；本函数只接收下述精确值态投影，绝不接收/输出完整组件对象，也不负责合并静态字段。未知键在这个精确投影上失败关闭。

## 来源认证与绑定边界

普通 JSON 中的 `sourceStage`、revision 或 component ID 都是可伪造的字段，不能作为来源证明。输入 API 只接受两个上游创建的不透明类型：`VerifiedDesignValueSnapshot` 与 `VerifiedDesignBinding`。前者来自已验证设计态读取边界并绑定保存 revision、资源身份与组件身份；后者是本次操作期望读取的来源身份。调用者不得从任意 JSON 构造这两个类型。helper逐字段比较二者的revision/resource/component identity，不匹配返回`SOURCE_STAGE_UNVERIFIED`。`prepare`只消费现成认证值，不负责认证、读取存储或创建认证值。

当前仓库证据尚未定位到可创建这两个不透明类型的已验证生产入口。因此，纯helper可按既有类型前置条件独立实现，但不得新造认证工厂或接入产品调用；真实来源是否可认证仍未知。TypeScript nominal type 是可信调用边界内的API契约，不是对恶意JavaScript/运行时反射的安全保证。普通JSON拒绝属于编译期类型约束，不得描述为运行时认证。

## 精确输入与输出

输入是 `{ snapshot: VerifiedDesignValueSnapshot, expectedBinding: VerifiedDesignBinding, valueState: TextSingleSelectValueState }`。Fixtures中的snapshot/binding对象只是测试描述；测试适配器负责构造合法的名义类型，不将fixture标志字段传入生产API。普通JSON无名义类型，仅有编译期拒绝断言，不会调用helper。`valueState` 允许的键为：

- `displayType: "0"`
- `multiple: false`
- `optionValueSource: 0`
- `defaultValueCheck: boolean`
- `defaultValueFirstItem: false`
- `defaultValue?: string`（仅默认开启时必须是非空字符串）
- `selectValue?: string` 与 `mapValue?: string[]`（只作为旧运行态污染输入，输出一律排除）

不允许任何其它键。`defaultMapValue`、字段选择器专属键、完整组件的静态字段或未知字段均不属于此投影，必须由上层适配器职责处理；误传时返回 `UNSUPPORTED_FIELD`。

成功输出 `ValueStateCarrier`，只含 `schemaVersion`、snapshot 中绑定的 revision/resource/component identity、固定 shape，以及 `defaultValueCheck/defaultValue/defaultValueFirstItem` 设计字段。输出不得含 `selectValue`、`mapValue`、options、loading、查询结果或完整静态组件字段。水合输出是 detached 新运行态：默认开启时 `selectValue=defaultValue`；关闭时 `selectValue=undefined`，且 JSON 序列化时省略。source、carrier、runtime 内数组不得共享可变引用。

完整适配器对静态字段的职责在本函数边界之外，按现有上层 adapter 的精确字段矩阵执行；本函数不接受一个全组件对象然后声称静态字段“被保留”。

## 查询值 oracle

首次过滤由既有 `useFilter(..., firstLoad=true)` 消费：启用默认 A 时，`forMatterValue` 后的最终 `filter.value` 是 `["A"]`；未启用默认时，空选择不生成过滤项，最终投影是 `[]`。水合后的后续查询使用新运行态 `selectValue`；默认 A 得到 `["A"]`，无默认值仍不生成过滤项。旧 source 的 B 不得进入任一查询路径。

这组 oracle 来自源码调用链推导，直到同一冻结用例运行通过前都不声称产品行为已验证。

## 拒绝顺序和副作用

运行期拒绝顺序固定为：两个名义类型均有效但绑定元组不等 `SOURCE_STAGE_UNVERIFIED` → 类型通过后但JSON值/身份字段非法 `INVALID_INPUT` → 精确valueState投影出现额外/缺失键 `UNSUPPORTED_FIELD` → 固定shape不匹配 `UNSUPPORTED_SHAPE` → 默认开关与值不一致 `DEFAULT_VALUE_INVALID`。普通JSON不具备名义类型，应由TypeScript编译拒绝调用；它没有运行期status。任何运行期失败均无 carrier/runtime 部分输出，source 不变，query/store/snapshot 写入为 0。

`defaultValueCheck=true` 要求 `defaultValue` 为非空字符串；false 时 carrier 不保留 defaultValue。null、空字符串、错误类型均拒绝，不回退到旧运行值。

## 最小安全实现与后续边界

允许的 Builder 范围仅是纯 helper、其同身份 runner/tests 和类型声明；不接 UI、Store、保存/重开、查询执行、网络、权限或其它 query shape。纯helper可按名义类型前置条件独立实现，但不得自造认证工厂或接入产品调用。真实生产者尚未定位时，产品接线和来源认证验收保持 BLOCKED。

Fixtures r004 需覆盖默认 A 与旧 B 分离、无默认与旧 B 清除、首次与非首次 filter 投影、普通 JSON的编译期拒绝、revision/resource/component绑定错配、额外及缺失键、错误 shape、空/错误默认、JSON 往返、输入不可变和失败无部分输出。所有运行期失败用例使用同一字段集合断言 `carrier=null`、`runtime=null` 与零副作用；编译期拒绝不伪装成运行期helper结果。

原始 Goal 10 项 AC、26 项 must-have、16 项产品义务保持不变。真实多用户权限环境仍不存在；只读查看/复制粘贴/授权撤销等验收保持 `BLOCKED / NOT_RUN`，S01 状态不变。

