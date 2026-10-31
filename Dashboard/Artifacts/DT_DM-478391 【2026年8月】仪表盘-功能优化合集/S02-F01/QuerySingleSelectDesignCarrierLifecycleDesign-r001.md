# 普通文本单选 design carrier 生命周期来源边界 r001

**结论：NOT_READY_FOR_PRODUCT_BUILDER。** 本轮已把可以定位的捕获/更新/保存边界与不能由源码裁定的旧来源/历史策略分开；不重复已有 QCARRIER/QE2E，不授权实现。完整 Fixtures 已先落盘：10 条完整时序见证、2 条显式 `filter=[]` 的消费者 oracle，以及准确引用的14条既有 QCARRIER 边界（不复制其oracle库）。所有时序都是候选合同见证，未执行产品，旧历史未决项输出 null 仅代表不能确定结果。

接收端 card canonical `3b600d7c69a299d1125eff8dfc327cac6491b0e6e6f5fb6caed390f851aca399` validate/render退出0；Context校验退出0，绑定输入无漂移。父流程随后明确准入设计，故卡内“准入后”分支生效。只新增本文和同名 Fixtures，不修改卡、Context、代码、旧证据或台账。

## 可裁定的来源链与捕获位置

路径前缀 `core/core-frontend/src/`。

- `utils/canvasUtils.ts:643–656` 将后端 componentData JSON.parse，调用 historyAdaptor，然后进入回调；`661–680` 的 initCanvasData 在非 onlyPreview 模式先 setComponentData，再调用页面回调。`dvMain.ts:521–523` 的 setter直接保存同一引用，没有独立design载体。
- 按条件扩读的 `pages/panel/ViewWrapper.vue:116–125` 先取得 canvasDataResult，随后 addOuterParamsFilter；`pages/panel/DashboardPreview.vue:90–115` 也在回调中执行外参；`views/data-visualization/PreviewCanvas.vue:134–167` 先加载、可等待枚举同步、再加跳转/外参。`components/data-visualization/canvas/DePreview.vue:460–464` 支持后续消息重复外参更新。这些入口证明存在本次外参之前的边界，不证明所有持久JSON都代表未经旧运行污染的设计。
- 因而可固定的时间不变量是：**若输入来源已可信，必须在该输入第一次暴露给Store/页面/运行写入前同步深拷贝捕获**。最靠前的共同候选位置是 initCanvasDataPrepare 在 historyAdaptor完成后、callBack之前；不能等到addOuterParamsFilter执行后提取。该位置仍需证明历史适配结果的来源权威，不能只凭函数名授予可信标记。onlyPreview、移动适配及后续消息不能靠重新从当前对象捕获覆盖已有carrier。
- `dvMain.ts:1246–1338` 遍历直接组件、Group、DeTabs，`1437–1495` 外参可同时改变default/select/map/check等；`1687–1712` 的联动路径也会改默认。**runtime-only指独立运行根，而非禁止运行根拥有default字段**：现有首次查询仍可能读取runtime.defaultMapValue，因此外参兼容写可保留在运行副本，但绝不能写入独立design。只阻断select/map以外的运行写入会改变现有首次过滤语义，本轮不建议这样做。

上述扩读文件及其SHA完整记录在Fixtures source_refs，触发为Context的 source_consumer_or_lifecycle_gap；没有继续开展全形态入口调查。

## 配置更新权与提交边界

`Select.vue:248–273` 的 isConfig 分支更新默认，非配置分支更新运行select/map；`172–179` 的清除也区分配置态。`QueryConditionConfiguration.vue:1591–1629` validate/默认收尾后，先清空propValue，再nextTick回写cascade和完整conditions、记录snapshot，下一tick发预览。取消不应发布新carrier。

可固定规则：草稿选择不是持久设计更新；仅已确认的完整配置候选才能发布新design revision；失败/取消保持旧carrier。捕获不得落在propValue=[]的中间窗口，也不能用运行对象当前default推断是用户确认。正确候选点为两个槽完成写入后、snapshot/preview之前，且carrier与配置必须同commit发布。现有nextTick流程尚不提供这一原子发布保证；本轮不指定未经审核的Store结构或修改顺序。

`Component.vue:674–683` reset从默认恢复运行，`useFilter.ts:140–149` 首次取默认映射、后续取当前映射。这些只确认运行消费者，不能授予其更新design的权力。设计字段全表沿QCARRIER，移除select/map，保留明确默认；普通样式/其他组件从最新运行根保留。未证明所有设计编辑入口均覆盖，故不能宣称产品合同全冻结。

## revision及保存边界

候选时序以抽象状态 `documentId/revision/commitId/carrier/root/historyIndex` 表达，都是本稿见证字段，不是已有Store schema或新API承诺。carrier包含同文档、组件、revision、commitId和完整design；`origin`字符串仅为fixture前提，不能充当生产来源认证。

同一次可信捕获/设计确认产生独立design/runtime，运行选择、外参、样式编辑不递增设计revision。保存须同步固定当前carrier与最新根，在副本仅overlay查询propValue/cascade，其余内容保持；不同revision、缺carrier或未证来源不得偷偷从当前runtime补造design。失败不修改现场、不发本新能力请求。这里拒绝的是新增design-overlay操作，不授予全局禁止原有保存的策略。

当前 `canvasUtils.ts:843–864` 在请求前cloneDeep当前根并JSON.stringify，`873–902` 可异步检查名称，随后发送已捕获canvasInfo；`views/chart/components/editor/index.vue:1677` 是真实保存调用方。候选捕获必须放在本次序列化之前，且之后不能在旧根上拼入新的carrier。响应时不能仅以设计revision相同认定无后续普通编辑；fixture009保留后续样式160及dirty，发送捕获时的150。r007给出的完整持久化payload摘要比较方向保留为候选，本轮未实现保存应答处理。

## 完整oracle及边界

Fixtures每条含完整input.state、事件及expected，不用省略号或局部patch冒充完整状态：

1. 001/002：已证原设计A和D分别捕获，之后runtime都被外参X覆盖；保存分别A/D，后续样式150和其他文本组件保持。
2. 003：已确认完整设计A→D，独立carrier/runtime同revision2；004仅运行C，carrier/revision不变；010草稿D取消完全不变。
3. 005：carrier revision1与当前revision2不匹配，拒绝overlay，完整现场不变。
4. 006：无carrier且当前默认/运行X，无法恢复A或D，拒绝伪造来源。
5. 007：仅在额外提供同文档/组件/revision/commit的外参前完整可信见证这一**假设前提**下，重建A而保留现场X和样式150；现有产品没有提供该证明，不能据fixture判定现有历史可恢复。
6. 008：旧历史无carrier，产品恢复策略OPEN，expected.state=null标NOT_READY；保留完整选中历史与当前现场作为审查输入。它不是运行返回值，也不执行或禁用原有undo。
7. 009：同步捕获后发生普通编辑，发送冻结副本，响应不清后续dirty。

两个消费者oracle在原QSSDH-002/003完整输入上明确加 `filter=[]`，同时给 expected_appended_filter 与 expected_filter_after_call；首次A、后续C。不声称运行了searchQuery。14条QCARRIER边界以原文件路径、SHA与数量引用，不复制、不改变，不新增复杂形态拒绝政策。

## 源码无法唯一决定的OPEN；到此停止

- **QSSDH-SOURCE-02A，加载来源权威。** 当前保存会把runtime默认X持久化；之后加载前的JSON也可能已污染。即使在本次外参前捕获，仍无法逆推出历史A/D。需独立裁定“持久JSON当前声明默认可作为新的基准”是否符合原意，或提供真实可信来源证明；不能由设计作者自认历史全部可信。
- **QSSDH-SOURCE-02B，旧历史无carrier。** snapshot.ts:97–135现有undo/redo移动指针并恢复全根，无design元数据。原撤销不得被偷换成仅overlay且不退样式，也不得删除历史/丢编辑来掩盖缺口；缺来源时如何维持原操作及新增能力边界没有唯一现有答案，保留OPEN，不冻结猜测策略。
- **QSSDH-SOURCE-02C，发布与更新覆盖。** 已找到配置确认点，但carrier物理持有者、同revision原子发布及其他默认编辑/恢复的覆盖仍未形成精确产品target。不得把候选字段或origin标记当已部署权威。

这些是原QSSDH-SOURCE-01的具体拆解，不是新的无界调查需求。可裁定的先后和隔离不变量可交独立Semantic Review；不能从本稿直接派Builder。下一动作由父流程让审查者就上述三个精确决策判断最低可准入范围，保留不适用/未证域；本lane不自行选择政策、不继续搜全形态、不改代码。

## 验证与声明上限

执行了JSON解析、10条完整时序结构、001/002保存不含select且保留样式、2条消费者空filter、14条既有oracle引用摘要自检；这是作者构造检查，非独立验证。未执行Vue、Store、searchQuery、浏览器、保存网络或数据库。

QCARRIER r001/r002行为22项的有界结论及当时报出的控制面绑定限制原样保留；QE2E r001的33 checks有界PASS与缺可信RED限制原样保留。它们不提供来源认证或生命周期实现证据。Goal完整分母10项Goal AC＋14项F01＋Q066/Q067＝26项义务保持，真实权限BLOCKED/NOT_RUN，S01不变，未关闭DG-03或产品/Goal。
