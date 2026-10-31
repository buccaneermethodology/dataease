# Manual2 精确值态纯 helper 合同候选 r001

状态 candidate；frozen_for_builder=false；Scope Delta none。保留10 Goal AC /26 must-have /16产品义务，全部产品义务NOT_RUN。S01 F01 Packet NOT_AVAILABLE，真实权限BLOCKED / NOT_RUN。仅合同/Cases设计，不写实现/tests，不授予Builder准入。

## QTSO-001：生产API与来源边界

唯一生产API候选：`prepareManual2ValueState(valueState: unknown): Manual2PreparationResult`，恰一个参数。输入就是精确值态投影，不接受wrapper、binding、revision、resource/component/condition ID、stage字符串、fixture标志、名义可信类型或回调。函数只验证数据域、提取设计字段并构造新运行值；不认证来源，不创建认证工厂，不读写UI/Store/网络/保存/历史。

上层必须先取得可信配置来源再调用；此前置当前仍NOT_READY。普通JSON合法投影返回OK仅表示数据符合子合同，不能证明来自保存配置或可发布。测试层不得把trusted-config-confirmed字符串变生产鉴权。M2-E07因此有明确语义变更：移除live-unknown夹具元数据后，相同合法projection必然与E01同为OK；真实上层应阻止unknown来源调用，但这不属于helper可测试的拒绝。若把stage键错误放入投影，精确schema以统一REJECTED拒绝，无认证含义。

## 精确输入与合法子域

必需键：`displayType, multiple, optionValueSource, defaultValueCheck, defaultValueFirstItem, defaultMapValue, valueSource`。可选键：`defaultValue, selectValue, mapValue`。不接受完整condition。固定displayType="0"、multiple=false、optionValueSource=2、defaultValueFirstItem=false。valueSource为非空、无重复、每项trim非空的string数组；字符串原样保留，不修剪、不排序。required/showEmpty/参数/级联等不属于此投影，前置切片界限由上层负责，helper不能据其缺失推定整个组件无这些语义。

defaultMapValue必须显式[]；缺失、null、非空一律拒绝，不擅自修复历史。optionFilter只要出现（包括[]）即拒绝，不把空数组等同缺失。defaultValue默认开时须非空且精确属于valueSource；默认关时可缺失/undefined/string，但非string拒绝；关时不写carrier。旧selectValue/mapValue只作合法旧运行态污染输入，校验后丢弃。重复值、默认不在列表等在整个产品/历史中的合法性仍NOT_READY，此处拒绝只限定安全子域。

## QTSO-002：唯一拒绝与确定顺序

所有失败返回精确 `{status:"REJECTED",carrier:null,runtime:null}`，不得增加reason、errors、部分carrier或runtime；没有SOURCE_NOT_READY/OUTSIDE_SHAPE等多种运行期状态。按以下顺序早停；顺序用于确定实现和读取边界，不在结果暴露首错码。

1. 输入必须是普通对象（prototype为Object.prototype或null），非null/array；仅own enumerable string数据属性；拒绝symbol、自定义原型、accessor、非枚举属性。不得调用getter。代理对象不属于输入域，普通JS不能可靠识别恶意Proxy；本合同不是不可信JS沙箱。

2. 精确键集合：必需displayType,multiple,optionValueSource,defaultValueCheck,defaultValueFirstItem,defaultMapValue,valueSource；可选defaultValue,selectValue,mapValue；其他一律拒绝，包括stage/binding/optionFilter。缺必需键拒绝。

3. 固定shape必须严格等于字符串0、false、数值2；defaultValueFirstItem严格false；defaultValueCheck严格boolean。

4. defaultMapValue必须严格空的普通稠密数组；valueSource必须非空普通稠密string数组，每项trim后非空且原始字符串不重复；数组无额外属性/symbol/accessor。此为有界候选，不是产品全集schema。

5. defaultValue若存在且非undefined必须string；显式undefined按缺失处理。defaultValueCheck=true时必须非空string且精确包含于valueSource；false不要求属于valueSource，但不豁免类型约束。

6. selectValue若存在仅允许string或undefined；mapValue若存在须普通稠密string数组（允许空及重复，无额外属性/symbol/accessor）。仅校验后丢弃旧运行值，不从中补设计默认。

7. 所有检查通过后一次性构造detached carrier/runtime；不产生中间可见结果。所有失败同一REJECTED对象形状，无reason/errors/部分输出。

对象/数组descriptor检查不得读取accessor，测试getter计数必须0。恶意Proxy不在本数据域内，不能宣称对任意JS对象安全。遇到JavaScript宿主级异常/OOM不在业务拒绝承诺内；不得用catch吞掉外部副作用。

## 成功输出与隔离

成功仅有status/carrier/runtime三个键。carrier精确为 `{schemaVersion:1,shape:{displayType:"0",multiple:false,optionValueSource:2},design:{defaultValueCheck,defaultValueFirstItem:false,valueSource,defaultValue?}}`；无身份、revision、source stage、defaultMapValue或运行值。runtime精确有 `selectValue` 与 `mapValue`：默认开selectValue=A，关闭则own selectValue=undefined，mapValue为新[]。JSON序列化时undefined键省略；carrier经JSON往返不含运行B。

valueSource新建数组，runtime.mapValue新建数组；source/carrier/runtime无共享可变对象。返回后的输出修改不得影响source，source修改不得影响已返回输出；每次调用也不得共享可变数组。输入不得被写入。成功/失败均零网络/Store/snapshot/保存/preview意图/成功提示，不接受可触发这些副作用的回调；失败无部分输出。这里只验证值态，不调用searchQuery、不声称结果集正确。

## 旧M2-E映射与确定Cases

|来源|新identity|差异|
|---|---|---|
|M2-E01|M2P-001|保留投影输入；统一输出schema，binding/stage移出API；不是同identity行为等价声明|
|M2-E02|M2P-002|保留投影输入；统一输出schema，binding/stage移出API；不是同identity行为等价声明|
|M2-E03|M2P-003|保留投影输入；统一输出schema，binding/stage移出API；不是同identity行为等价声明|
|M2-E04|M2P-004|保留投影输入；统一输出schema，binding/stage移出API；不是同identity行为等价声明|
|M2-E05|M2P-005|保留投影输入；统一输出schema，binding/stage移出API；不是同identity行为等价声明|
|M2-E06|M2P-006|保留投影输入；统一输出schema，binding/stage移出API；不是同identity行为等价声明|
|M2-E07|M2P-007,M2P-008|E07来源判断移出helper；其合法projection仍OK，误传stage额外键REJECTED|

配套JSON含28个确定输入/预期案例，全部NOT_RUN。M2P-009同时含source0、optionFilter、非空map、空默认和extra未知键，唯一输出REJECTED，先在键集合阶段停止。M2P-025..028通过明确测试recipe构造getter/hole/symbol/自定义原型，recipe不进入生产API。M2P-024以测试codec表达undefined。案例未执行，确定oracle不等于通过。

测试适配器还须对成功结果逐项验证引用隔离与跨调用隔离，对失败验证完整null输出，对getter案例验证读取计数0；这些是后续runner义务，本轮未实现runner。零副作用通过无外部依赖API及后续runner检查，不能以mock权限证明上层授权。source0 helper及其旧18case保持独立，不调用、不改写、不计入manual2。

## 来源、未决项与review双结论

依据来源候选SRC-02（QueryConditionConfiguration.vue:3224–3233）确定manual2枚举；SRC-07/08（Select.vue:130–152、252–286）区分设计/运行值及空map；SRC-10（1047–1059）确定hydrate；SRC-11/12（useFilter.ts:116–155、372–395）支持默认消费与optionFilter差异。具体摘要见Cases.source_manifest。所有输入域加严均明确为新候选子合同，不伪称现有UI严格schema。

未决项继续为QTSO-003/004/005：可信来源owner、shape2保存revision/恢复/history/undo、optionFilter生产者、合法历史残留与真实权限/命中ID；上层产品调用NOT_READY。guard/API本候选只尝试修复QTSO-001/002，仍待独立审查。

预期独立报告 `reviews/QueryTextSingleSelectManual2PureContractReview-r001.md` 应分别判断：（1）有界纯合同有效性，尤其精确输入/输出与拒绝顺序；（2）实现入口就绪性，区分纯模块的后续RED/admission与产品入口NOT_READY。本lane不写独立Review，不冻结状态、不启动Builder。
