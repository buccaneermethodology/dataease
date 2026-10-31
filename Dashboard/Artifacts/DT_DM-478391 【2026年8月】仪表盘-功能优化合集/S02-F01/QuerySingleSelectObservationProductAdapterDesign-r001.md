# 单选枚举观察产品接线设计 r001

## 结论与范围

本设计只研究普通查询单选在级联枚举请求期间，用户刚选择的 C 如何与迟到枚举结果协调；目标是在 `Select.vue` 的真实请求/回调路径调用已验证纯模型。该方案仍是设计候选，未获产品 Builder 准入。真实权限环境与 S01 Entry Packet 的缺口保持原状。

用户裁定冻结了数据策略：首次响应不含 C 时只追加一次核对请求；核对后结束 loading；C 仍不存在时保留并显示为无效。产品入口目前没有 validity 状态，故本设计提出候选呈现为“保留 C 的值 + 明确无效标记”，具体视觉形式需由语义审查确认，不允许静默清空 C 或把缺失值当有效。

## 现有源码行为

- `Select.vue:setOptions()` 在 `optionValueSource === 1` 且有字段时调用 `handleFieldIdChange()`；请求通过 `enumValueObj(val)` 发起。
- 当前 `.then()` 从响应重建 `options`。若为单选且当前 `selectValue` 不在选项中，会清空 `selectValue` 与 `config.defaultValue`，随后 `.finally()` 还会重设默认值、更新 map/cascade，并在特定分支调用 `queryDataForId()`；不能把它视为“只更新选项”。
- 当前 `.finally()` 无 requestId/对象身份复验，旧请求可能按执行时的 `config.value` 关闭 loading 或写入状态。`handleValueChange()` 会先更新运行 `selectValue`、`mapValue` 并安排查询，因此 C 可能在请求期间进入运行态。
- 普通单选的模板以 `el-select-v2` 绑定 `selectValue` 和 `options`；源码未见独立的无效状态字段或已确认的无效值视觉标记。

## 候选接线协议

1. 在每次 option-value-source=1 的异步请求发起前捕获请求代次、配置对象/条件对象身份、字段/筛选输入身份和当次选择值；请求开始递增 requestId 并设置 loading。仅支持域内的普通单选调用新路径；多选、配置编辑器、默认枚举 source=0、静态 source=2 继续原流程。
2. `.then()` 与 `.finally()` 都必须验证捕获身份和最新 requestId；失效回调不得写 options、selectValue、config 默认值/map/cascade、loading，或触发 query。核对请求期间若用户再次变更值，必须提升 runtime generation，使旧核对响应失效。
3. 首次成功枚举含当前值时接受 options 并结束 loading；不含当前值时保留选择与原已接受 options，启动且仅启动一次核对请求，loading 连续保持 true，不调用 `queryDataForId()`。
4. 核对成功时接受核对 options；包含当前值标为有效，不包含则保留值并标为无效；核对失败保留此前 options 与选择，标为未核实。三种终态都只由当前请求身份的结算路径结束 loading。
5. 除用户明确选择外，观察路径不得写设计 `defaultValue`，不得重算 cascade/map，不得因枚举核对触发过滤查询。其他既有默认值、required、empty-option、排序、远程更新及 `unMountSelect` 释放语义需逐项比较；未能在隔离分支保持原语义时缩小支持域或判 `NOT_READY`。
6. 无效显示候选为保留 C 的选中标签并在同一单选控件呈现清晰无效状态；不能只依赖选项缺失推断 UI 会展示 C。独立设计审查须确认可访问性/文案入口及不持久化该临时 validity 的边界；若需新持久化字段，则超出当前切片。

## 最小产品验证矩阵

Fixtures r001 给出 8 个场景：首次缺 C 后只发一次核对；核对含 C/缺 C/失败；用户二次选择使旧核对与旧 finally 失效；同 ID 新对象替换；成功终态/失败终态 loading 均关闭且旧响应不关闭新 loading；非支持域继续原流程。真实 Vue 挂载测试须用 deferred 请求控制完成顺序，核对请求次数、值、options、有效标记、loading、default/map/cascade 写入次数及 query emit 次数。

本轮尚无真实组件测试结果，不能把 9 项纯模型验证计为产品接线验证。必须先由独立 Semantic Review 裁定上述接线边界与无效呈现；只有审查可准入、S01/Goal 明确的前置门槛齐备并形成产品 target-bound admission 后，才能写 `Select.vue` 与 Vue 测试。真实权限测试仍需隔离的权限实例，不得由该切片替代。
