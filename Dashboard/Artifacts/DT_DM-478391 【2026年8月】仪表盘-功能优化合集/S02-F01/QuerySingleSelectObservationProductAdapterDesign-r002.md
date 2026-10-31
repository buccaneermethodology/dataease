# 单选枚举观察产品接线设计 r002

## r001 审查finding处置

本修订回应[独立审查 r001](reviews/QuerySingleSelectObservationProductAdapterDesignReview-r001.md) 的 PA-01/02/03。r001和报告保持不变。本版进一步缩小候选支持域，明确真实身份映射、请求参数和定时器归属、产品展示草案及完整具体oracle。仍是设计候选，等待新的独立复审；不授权产品 Builder。

## 固定支持域

进入候选路径必须同时满足：`props.isConfig === false`、`config.optionValueSource === 1`、`config.multiple === false`、`config.displayFormat !== 1`、存在 `config.field.id`、`defaultValueFirstItem === false`、`required !== true`、`optionFilter` 为空，且首次枚举发出时运行值为非空字符串。除此之外（含 Flat、配置编辑器、多选、required/optionFilter/default-first-item、静态 source、无字段或空值），维持原流程。

首次请求期间，用户从捕获值A改为非空C是维护者裁定要求的核对触发条件：保留request 41身份，runtimeGeneration上升；request 41首次成功返回后允许与已变更的runtime比较，若响应缺C则捕获C及当前generation发request 42。只有核对请求42进行中时用户再从C改为D/清空，才使request 42失效为no-op；该用户事件同步递增runtimeGeneration、将旧loading置false并清理本地validity。若随后request 43已开始，则只由request 43控制loading，旧42的then/finally不能关闭它。此区分使首次A→C与核对中C→D两个世代可辨。字段/显示字段/排序/查询模式/搜索文本/级联筛选/源配置变化无论发生在哪一阶段，都由现有watch先递增sourceGeneration、关闭被替代的loading、作废旧请求，再由debounce产生新请求；不把旧响应回退到会清值的legacy then/finally。退出候选域有显式谓词与运行输入比较。此窄边界可能不覆盖required/级联空筛选等Goal其他场景，后续仍须扩展并独立验证。

## 产品身份与请求输入映射

候选采用 Select 单组件实例内的非持久状态：

| 模型身份 | 产品映射 | 捕获/失效 |
| --- | --- | --- |
| documentEpoch | 组件本地 mount generation | setup 初始化；`onBeforeUnmount` 递增，使全部 Promise/debounce 失效 |
| componentRaw / conditionRaw | `toRaw(config.value)` 的同一对象引用（本组件配置槽） | 请求发起捕获；配置对象替换或实例销毁即失效；不把 `id` 字符串当对象身份 |
| designRevision / tokenGeneration | 本地 `sourceGeneration` + `requestInputKey` | 每次 field/displayId/sort/sortId/resultMode/search/cascade filter 捕获变化递增；任何 watcher 观察到变化即使旧身份失效 |
| runtimeGeneration | 本地 `runtimeGeneration` | `handleValueChange` 同步递增；首次响应允许比较差异并转去核对，核对响应要求generation和选值都不变 |
| requestId | 本地单调 `enumRequestId` | 每个由 `handleFieldIdChange` 实际发起的普通source=1请求递增；then/finally均需等于当前值 |
| selectedValue | 发请求时的 `selectValue.value` 与首次响应处理时的当前值 | 首次若当前非空C且较请求值变化，仅保留C并核对；用户再次变化后旧核对失效 |

`enumValueObj(val)` 的初始输入在发起时完整捕获：`queryId`、`displayId`、`sort`、`sortId`、`resultMode`、`searchText`、`filter`。核对请求使用相同捕获查询输入（不是从新 config 重读），响应仍按捕获的 `displayId || queryId` 转成字符串 options；开始核对前重新比较当前 `requestInputKey`，不符则作废。当前入口不存在已持久化 document/revision 字段，因此不得伪称其为真实值；此方案只映射到本 Select 实例局部生命周期，不能覆盖跨父组件确认/undo/revision。若目标需要该保证则必须另作生命周期设计。

## 回调顺序和副作用

候选成功路径在 existing `.then()` 执行任何选项/配置写入之前校验身份；`.finally()` 也独立校验身份。初次成功有C时接受 options、标有效并关闭当前loading。初次缺C时保留旧options、C、config默认/map/cascade，不调用 queryData，增加一次 requestId 并发送相同请求输入；loading连续保持true。核对含C接受核对options并有效；不含C接受options且标无效；失败保留旧options并标未核实；终态finally仅当前请求可关闭loading，不重试。

观察临时状态不得写入 `config`/持久JSON。枚举观察分支不调用 `queryDataForId`、`setCascadeValueBack`、`releaseSelect` 或 default/map 写入口；用户主动选择仍沿既有 `handleValueChange` 查询路径，统计断言只排除观察新增查询，不排除用户交互的既有查询。

## 临时显示候选

在支持的 `el-select-v2` 单选中维护本地 `observationValidity`。当C无效或未核实，render options 在原有效 options 之外附加一个仅展示的禁用条目 `{label: i18n(C + 状态文案), value: C, disabled: true}`，使模型C有可显示标签；该条目不计入被接受的 enum options，不写 config，不可作为用户可选新选项。有效/待定或用户主动改值后移除该条目。采用临时 i18n key `v_query.observation_value_invalid`（中文“当前值不在可用选项中”，英文“Current value is unavailable”）及 `v_query.observation_value_unverified`（中文“当前值尚未核实”，英文“Current value has not been verified”），状态文本需通过 option accessible label 可被辅助技术读取。移动端与 Flat 不在支持域，保留 legacy。独立审查需确认 Element Select 的禁用标签展示能力和a11y槽位；若无法实测或可靠源证，产品 Builder 保持 NOT_READY。

## 完整oracle

[Fixtures r002](QuerySingleSelectObservationProductAdapterFixtures-r002.json) 为 10 个逐事件完整输入/输出：包括请求参数、raw引用符号、request/runtime generation、options、select/config默认/map/cascade、loading、validity、查询/请求/重试计数；覆盖核对成功、缺失、失败、首次请求失败、再次选择、同配置引用下筛选变更、同id配置对象替换、清空以及支持域外回退。RED/产品Vue验证仍未执行。

## 其余准入前置

独立审查可裁定本设计内部是否可实现；产品 Builder 仍需 S01 F01 Entry Packet、真实权限隔离环境、可信行为级RED、精确模块/测试 admission 及当前拓扑准入。S01和权限条件没有因本修订解除。Goal原10项AC、26项must-have/16项产品义务保持完整；纯模型9/9不等于Vue产品证据。
