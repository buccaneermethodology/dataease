# 单选枚举观察产品接线设计 r003

## 修订依据与结论

本版响应[独立审查 r002](reviews/QuerySingleSelectObservationProductAdapterDesignReview-r002.md) 的 PA-R2-01..04。此前 r001/r002 及其审查均保留。r003 是待审候选，未准入产品 Builder。

## 可执行支持谓词与退出行为

只有全部成立才进入观察分支：运行态（`isConfig=false`）、单选（`multiple=false`）、普通 `el-select-v2`（`displayFormat !== 1`）、非移动端（`isMobileDataV=false`）、source=1、非远程（`isFromRemote=false`）、`disabledFirstItem=false`、required=false、optionFilter为空、`defaultValueFirstItem=false`、字段存在、请求起始选择为非空字符串、当前 `unMountSelect` 不含本条件 ID。Flat/移动端、remote、待挂载释放、配置编辑、多选、required/optionFilter/default-first-item、source 0/2、空初值/无字段均走原路径。上述任一谓词在请求等待时变假，请求即失效；若当前requestId仍是它且没有后继请求，局部旧loading结束；随后legacy/debounce入口自行接管。此候选不调用 `releaseSelect`，其域内不会有待释放条目。

只有首次请求期间运行值从捕获的A变为非空C且generation变化时，缺少C的成功响应才进入一次核对。若值未变化、首次响应缺初始A，完整旧legacy分支继续执行（不调用纯模型、不重试）；若A→C期间首次请求失败，则候选观察分支保留C/options、标记未核实、结束loading且不重试、不写默认/map/cascade、不额外查询。首次A→C后，若响应包含C则接受选项并收束为有效；若缺C则保留C及旧options并核对。核对期间再从C改为D/清空，旧核对失效并结束旧loading；未改选的当前核对响应按合同完成。新请求开始后旧then/finally不得更改任何状态。

## 身份、请求与同步失效

每个 Select setup 维护 `mountEpoch`、单调 `requestId`、`sourceGeneration`、`runtimeGeneration` 和被接受查询输入的 canonical key；`onBeforeUnmount` 递增epoch。requestId只在一个组件mount内单调递增，raw配置替换不得重置；新组件mount有新epoch。捕获 `toRaw(config.value)` 引用、当前condition槽同一raw引用、source config完整快照、查询输入 `queryId/displayId/sort/sortId/resultMode/searchText/filter`、选择值和各generation。核对复用首次捕获的查询参数，不在回调中从新props重取身份或参数。

最初 A→C 由 `handleValueChange` 同步更新runtimeGeneration；首次响应允许这一轴变化以触发核对，并比较当前值与捕获值。核对响应要求runtimeGeneration和C仍匹配。其他值变化和clear使请求失效。request输入的**每一个then和finally写入点之前**同步重新从当前配置构造 `requestInputKey`，并同时检查当前支持谓词、raw引用、epoch、sourceGeneration和requestId；Vue watch的generation仅作额外快速失效提示，不能替代本次同步比较。即使watch尚未运行，同raw字段/筛选变化也令旧回调no-op。首次响应开始核对前复验一次；核对then及finally再次独立复验。

source输入变化使当前请求失效并关闭属于旧requestId的loading；debounce实际发起时递增requestId并捕获新key。若旧请求已不可见，不能写新loading。返回值按捕获的 `displayId || queryId` 取值、过滤后映射为字符串options。观察状态留在组件内，不落入config/持久化JSON。只在观察adapter内禁止写options外的选择/default/map/cascade及release；`queryDataForId`观察新增调用为0。用户主动选择原有查询仍保留，效果计数分为`observationQueries=0`与`userSelectionQueries`。

## 临时呈现

支持域仅为非移动端普通 `el-select-v2`。invalid/unverified时，render options使用本地禁用展示条目，原enum options不变：`{label: "C — 当前值不在可用选项中"|"C — 当前值尚未核实", value:"C", disabled:true}`；有效/待定或用户改值时删除。i18n key 冻结为 `v_query.observation_value_invalid` / `v_query.observation_value_unverified`，英文分别为“Current value is unavailable”/“Current value has not been verified”。辅助文本必须进入选中option的可访问label；临时字段不写设计或运行config。Element Select 对禁用当前值是否保留标签尚需独立源码确认/真实Vue组件验证，不能据设计草案宣称实现可准入。

## Fixture 解释规则

[Fixtures r003](QuerySingleSelectObservationProductAdapterFixtures-r003.json) 对每个测试列出**完整初态**与**完整终态**，不是patch。状态schema逐项包含identity/generation/requestId、输入key、select/accepted/render options、validity/loading、受观察的config字段快照和副作用计数。JSON使用 `{"$undefined":true}` 专门编码 JS undefined，null仍表示显式null。每例以独立mount起始，除案例明确写“承接case”外不继承其他case；PA-007同一个mount内raw替换保持requestId单调。无副作用字段均给显式0。Fixtures仅是冻结oracle，未运行Vue验证。

产品接线前仍需独立审查，且须具备 S01 F01 Entry Packet、真实权限隔离环境、可信行为级RED、精确module/test admission。普通源分析与纯模型9/9都不能代替这些门槛。S01、真实权限`BLOCKED / NOT_RUN`，Goal10项AC、26项must-have及16项产品义务均不变。
