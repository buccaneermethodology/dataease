# SH-SELECT-TEXT 来源阶段追踪候选 r001 独立复核 r002

## 双结论

- **候选有效性：PASS WITH FINDINGS（作为有界源码来源追踪候选有效；一处源码定位需修正）。** 候选明确为 `candidate / design-only`、`frozen_for_builder=false`，没有宣称合法组合全集、完整 schema 或保存/恢复结论。ST-SRC-001..006 为 `DESIGN_ONLY / NOT_RUN`，ST-SRC-007 为 `NOT_READY / NOT_RUN`，这些状态与候选证据范围一致。
- **对完整 F01 设计/产品 Builder 的准入：NOT READY / BLOCKED。** 本候选只能支持继续来源取证和 fixture/oracle 设计；不能据此批准产品 UI/Store、source-read 或 target-commit。AC-S02-02/03 及其余产品验收不因本复核关闭。
- **分母与权威：** Goal 仍为 10 项 AC、26 项 must-have、16 项产品义务；`Scope Delta: none`。S01 F01 Entry Packet 仍为 `CONDITIONAL`；真实多用户权限环境仍为 `BLOCKED / NOT_RUN`。standalone/admin、stub 或本报告均不替代真实权限验证。

## 输入与复核边界

lane card `S02-F01-SH-SELECT-TEXT-SOURCE-TRACE-REVIEW-r002` canonical SHA-256 为 `724ddd938a4a55fbd41ebf6e160ab412ffe348c589a4a8a2379a6581336c8c0d`；`lane_task_card.py validate` 结果为 `pass`。Context Bootstrap validation 结果为 `pass`，required read set 没有跳读；其绑定 revision 与本轮文件摘要一致。审查对象 SHA-256 为 `e545f799a49d30dc836f45ad8d5e01d1b7a03e8c477922557ebf2544778bbe20`，Topology r272 SHA-256 为 `d83f1940630e9c374a68f6373c58ca28741d34d62eb74a6a9d29a22383c50ef8`。

本轮只对候选、其声明的源码路径与状态、R4FS 处置和依赖状态作静态复核；未运行 ST-SRC 行为、产品浏览器、后端、保存恢复或权限场景，未修改候选、Goal、Cases、源码和其他 Dashboard 状态。

## 来源路径与状态核对

- **新条件创建：** `options.ts:6-66` 的 `infoFormat` 可见 `optionValueSource=0`、`displayType='0'`、`defaultValueCheck=false`、`multiple=false`，并由传入信息填写 dataset/field 标识；`defaultValueFirstItem` 不在该对象中。该扩展默认属性定义于 `options.ts:80-137`，其中 `defaultValueFirstItem=false` 在第 135 行。配置页的 `parameterCompletion`（`QueryConditionConfiguration.vue:1844-1857`）会对缺值字段应用 attributes，`setToDefault`（:1860-1872）会重置这些字段；这不证明所有对象创建者/历史数据都经由同一补全路径。
- **数据集/字段配置：** `QueryConditionConfiguration.vue:987-1006` 可见 dataset 变更时清空 field/display/sort id 后调用 `getOptions`；:1024-1045 显示 source 切换且缺 dataset 时尝试经 checkedFieldsMap/fields 回填；:3224-3245 是 source 选择及 dataset tree 入口。它们证明当前源码的局部配置路径，不构成任意映射或合法组合规则。
- **确认前校验：** :1458-1483 对特定 displayType 的 dataset source 字段/default 值做校验；:1559-1577 对 source=2 的非空 valueSource，以及部分 source=1 的 field.id 做校验。候选没有把这些片段提升成完整确认、持久化或历史数据合同。
- **运行期默认与异步枚举：** `Select.vue:130-133` 将首项禁用与 defaultValueFirstItem/source=1 关联；:360-521 展示枚举响应、旧值与新 options 的比较及后续状态写入；:533-563 展示首项状态在配置/运行上下文中的不同写入；:1049-1062 展示初始化值与枚举获取调用。候选明确不重判 QOBS-ASYNC-01，也未宣称异步行为已在本轮运行。
- **保存/重开/history：** 候选承认没有定位足够的完整 owner 链，ST-SRC-007 为 `NOT_READY / NOT_RUN`；没有把保存、恢复、撤销或重做写成已证明结论。

## Finding

### F-ST-SRC-001（P2）：扩展默认属性引用范围错位，且需区分补全路径与对象初值

**证据：** 候选“新条件创建”行把 `options.ts:74-111` 标为扩展默认属性来源，并在该来源旁陈述 `defaultValueFirstItem=false`。当前 `options.ts:74-111` 实际是 `addQueryCriteriaConfig` 的字段及 `attributes` 对象前段；`defaultValueFirstItem` 位于 `options.ts:135`。同时 `infoFormat` 只到 :66，未写入该字段。配置页的应用点是 `parameterCompletion` 和 `setToDefault`（:1844-1872）。
  
**影响：** 读者无法从候选引用范围直接定位该默认值，也可能把扩展属性误读成所有新对象的无条件初值。该问题是可追溯性/表述边界问题；源码可见的属性值本身为 false，未发现足以推翻候选来源阶段结论的行为反证。
  
**处置：** OPEN，候选维护者下一修订应将引用改为 `options.ts:80-137`（标注精确字段在 :135），另列补全调用路径，并把“infoFormat 新对象字段”与“配置页补全/重置属性”分开陈述。无需改产品源码；修订后可进行窄范围复核。

## R4FS 与候选治理处置

- **R4FS-001：仍开放。** 候选把可见配置分支拆成 ST-SRC-001..006 的来源阶段调查入口，但明确说它们不是完整合法组合分母。轴/分支存在不能证明组合合法；此处置没有缩小或关闭 R4FS-001。
- **R4FS-002：部分来源路径得到更具体定位，整体仍开放。** 创建、配置、确认、运行/异步枚举的当前源码位置有帮助，但保存/加载、历史/撤销重做与完整 producer-to-consumer owner 未闭合。候选未声称完整 schema，符合上轮结论边界。
- **R4FS-004：处置方向成立但不关闭。** 候选要求字段身份按路径与阶段观察，拒绝裸字段名推断统一动作；本切片未冻结跨 shape 的 KEEP/REBIND/RESET/REMOVE 动作，也未提供可执行 oracle。
- **R4FS-003/005 与准入：** 候选明确 ST-SRC 用例未运行、权限及 S01 条件仍存在。Topology r272 中 PA-001..009 与 async pure model 的 PASS 限于隔离网络/API/Element stub；其 claim ceiling 明确不涵盖真实 API/Store 接线、权限、保存恢复或 Goal 完成，不能计为 ST-SRC 用例执行或权限验收。

## 最小下一步与防误用

1. 先修正 F-ST-SRC-001 的来源定位及属性应用措辞。
2. 将 ST-SRC-001..006 逐项补成确定输入、完整目标状态快照和单一可复核 oracle；异步项绑定受控 Promise/时钟；继续追踪保存/恢复/history owner 后再设计 ST-SRC-007。保持所有项的 `NOT_RUN`，直至对应行为真实执行。
3. 对完整合法组合、schema、字段动作、权限和跨入口产品行为继续保留原 Goal 分母与独立准入，不从本来源切片推导闭环。

未来摘要若只写“source trace reviewed”或“default behavior covered”，容易被压缩误读为产品行为已实现/验证。应表述为“来源阶段候选通过有界复核（1 项引用 finding 开放）；ST-SRC 设计候选未运行；产品 Builder 不准入；S01 条件与真实权限阻塞保留”。

可能的误用包括：Builder 把局部源码分支当全部合法组合；把 attributes 默认值当作所有创建/恢复对象的统一合同；把隔离 stub runner 的 PASS 当作 ST-SRC 或权限通过。防护是保留分母、将创建与补全阶段拆开，并让运行证据与静态来源调查分栏记录。

**最终声明：** 本报告是独立静态复核，不是产品 Validation、完整 F01 设计冻结、权限结果、AC 通过或 Goal 完成证据。当前只能接受该候选作为带一项 finding 的来源调查输入；不得据此准入产品 Builder。
