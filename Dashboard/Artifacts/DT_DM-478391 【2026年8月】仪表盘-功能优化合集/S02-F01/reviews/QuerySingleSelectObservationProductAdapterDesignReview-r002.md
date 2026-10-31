# 单选枚举产品adapter独立审查 r002

Reviewer：/root/s02_goal_review。仅写本报告；r001保留。

## 结论

Design Revision：PARTIAL，首次A→C/核对中C→D两阶段及局部生命周期映射已澄清；Design Implementability：NOT_READY，仍有以下有限且可修复的不一致。Product Builder：NOT_AUTHORIZED，不以设计可实现性替代产品接线准入。

## 时序与绑定

最初接收card依赖出现Design漂移，已告知父流程并暂缓签发；不追认编辑中版本。父流程随后冻结版本，接收端重新验证card canonical b7966f18548740b6bda839ac223b54bb12bc2a7aa2fc1e8fa96bf3494c9aedd2通过，全部base_context_refs无漂移；Context validate通过且原始SHA256为7f9b5e6081f39455b90dc65c5755d60308bec98fd0cabb6b49e7ea13f571d14c。

本结论仅绑定Design SHA256 d32d859adb014c4d58776eece395f8c4dbc46e5e27bbd421cae5f117713e165d、Fixtures SHA256 5db11404f52539cfb5c555760d49bc40210d942839782a70817536b6b5e6e1c9。

## 已改善部分

明确非配置、source=1、非多选/Flat、非required/optionFilter/default-first-item及非空初值谓词；首次请求允许A→C并核对，核对阶段再改D由用户动作结束旧loading，旧回调no-op，新请求拥有自己的loading。请求参数捕获、临时i18n文案及不持久化方向明确。PA-005的D对应select/map一致且loading改false；PA-007补了新raw状态，PA-008定义undefined sentinel；PA-009保护新loading，PA-010补首次失败。维护者策略无需重选。

## 剩余最小findings

1. **PA-R2-01 支持谓词仍未兑现排除项。** 文案明确移动端legacy，但进入谓词及fallback没有isMobileDataV排除；实际Select.vue:970有移动端入口，共享请求逻辑。remote和unMountSelect仍可满足谓词，然而新路径禁止releaseSelect且不处理isFromRemote重置，原Select.vue:427–469对此有明确副作用。请将移动端、仍待挂载释放、远程更新等不准备承载的状态显式排除/失效，或冻结等效处理；无需一次实现全部。否则“缩小支持域”不能防止初始化/移动端回归。

2. **PA-R2-02 完整oracle声明仍不成立。** 大多数case.final缺identity/runtimeGeneration/requestId/config等字段，未定义它们是完整结果还是补丁。PA-001事件runtimeGeneration=2但final未给；PA-002从001开始却无完整状态承接。PA-007原文称同实例raw替换，却将单组件单调requestId从41重置为1而epoch不变，未定义重置规则；其新raw状态仍主要嵌在自然语言事件。PA-008一面从A发请求，一面initial_selected_encoding为undefined，final又省略config.selectValue/map与runtimeGeneration；PA-009选D却省略config，无法检查local与实际查询值一致。请采用明确完整input/expected，或明文定义确定的继承/patch展开规则及展开后完整值；清除PA-008初态矛盾，明确raw替换是否重置计数，补所有用户动作后的config状态。计数统一标明观察写入与用户写入；当前mapWrites=0但map变C/D只能在观察计数含义下成立。

3. **PA-R2-03 触发条件与实际纯模型映射还差一个分支。** Design身份表说“当前值较请求值变化”才核对，回调段却说“初次缺C”一律核对；真实handleInitialEnumResponse对任何missing selectedValue都会核对，并不要求runtime已变。请冻结“请求期间未改选、返回不含初始A”的路径，明确是否仍旧流程或调用模型，不让Builder在两个文本解释间选择。该分支和首次失败应进入完整oracle。

4. **PA-R2-04 同raw输入变化的同步门控需具体。** “现有watch先递增generation”不保证Promise回调与Vue watcher排队顺序，也未给出所有输入watch点；源码现有字段watch并不覆盖表中全部身份项。请明确then/finally写入前同步比较当前完整requestInputKey/支持谓词，或等价同步失效机制，而非仅核对可能尚未更新的generation；核对开始前比较一次不足以保护核对响应及finally。增加同raw输入已改、watch尚未执行的无写入见证即可，无需全域调查。

临时禁用展示项方案已有具体文案，可作为UI实现输入；Element Select标签/a11y的可靠源证或真实组件验证仍按Design自己的要求保留，不应由纯模型测试替代。以上findings仅针对当前窄adapter，不要求扩展父确认/undo或OBS-02生命周期。

## 剩余边界

只修上述局部合同后作增量复核，无需重新询问维护者数据政策。未运行源码、Vue、网络或权限测试，不将9项纯模型验证升级为产品验证。

S01 F01 Entry Packet、真实权限隔离环境、可信行为RED、独立预审、实际拓扑与精确module/test admission均保留；真实权限BLOCKED / NOT_RUN；Goal10项AC、26项must-have和16项产品义务不变。没有产品target获本报告授权。
