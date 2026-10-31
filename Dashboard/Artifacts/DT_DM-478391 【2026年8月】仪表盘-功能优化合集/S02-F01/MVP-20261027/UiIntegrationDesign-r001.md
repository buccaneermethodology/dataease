# S02 权限测试桩下直接界面 MVP：接线设计 r001

状态：Design 候选，第 1/3 轮；未实现、未执行测试、未进行独立验证。只允许作为后续独立审查与精确 Builder admission 的输入，不声明产品完成。

## 1. Authority、范围与证据上限

权威为 `planning/MvpScopeAuthority-20261027.json`，SHA-256 `641dfa78e63b1d53e25c08ea5c71c4458c272399c749aa84f0dea63ab89023a4`，平台人类消息 `01a17b46-fa6c-7713-8511-a16644a2f999`。人类明确调整完成边界：开发验证权限桩、同页同编辑会话、内存 clipboard、全部受支持图表基本过滤复制粘贴、真实 query/save/reopen；复杂跨会话、真实权限、通用异步竞争和资源治理另列 Sessions。**这次是已批准 Scope Delta，不是旧范围内的排序调整。** 旧产物和结论原样保留，不重开旧 r003，不把旧工程作为本次前置。

Card `planning/s02-mvp-direct-ui-design-r001-card.json` 的 canonical SHA 为 `7c4ef4a06025465b3d52919b4a67419b9a0ec5f4a0b1ae304069c0b92df75dcc`，已复验 pass。Context `planning/ContextBootstrap-S02-MVP-DIRECT-UI-DESIGN-r001.json` 原始字节 SHA 为 `e7337b59ee47cb59a0df530ad38e4dc8ea773dae659463bf89f0d9147ee653e9`；结构校验通过，全部 required-read SHA 匹配。Context 内旧 `preservation_statement` 的“Scope Delta none”与新人类 authority 冲突；不据此否定新授权，控制面需在 Builder 前刷新该 projection、Goal/TSP、Card/Context。此 Design 不修改它们。

本设计保持：校验失败或真实查询失败不能改目标树/数据/画面；候选查询与预览成功、目标仍一致才采用。渲染 fulfilled、loading callback、成功 toast 都不是预览成功的 oracle。不能先替换条件后查，也不能用先销旧图再尝试回画来冒充失败保旧。

## 2. 图表分母和基本过滤数据

消费同目录 `SupportedCharts.json` / `.md`（本文件附 SHA）。49 个源码注册内建类型均声明 filter：38 G2、3 S2、3 L7、2 L7Plot、indicator/rich-text/picture-group 3 custom。47 palette 可见，后两项隐藏但注册，不能据此排除。49×49=2401 是静态兼容规则的分母，**不是 2401 次运行通过**。每个 type 都必须作为 source 与 target 经过真实 Editor/字段目录/完整 payload 组件验证；实际画面按 inventory 的 12 个 family 覆盖，family 代表通过不自动提升其余 type 的运行状态。插件安装清单 Unknown，未知插件明确拒绝并留记录；VQuery 是后续范围，不混进49分母。

空源包括 `{logic:null,items:null}` / `{}` / 空items，禁用copy；空target合法，不能因其持久化null形状拒绝paste。复制只读取当前 `view.customFilter` 的深克隆：`RowAuth.submit/dfsSubmit → FilterTree.changeFilter → Editor.changeFilterData` 的既有产品输出。禁止经 `dfsInit/dfsSubmit` 再 roundtrip 生成“简化协议”，禁止按目标图表轴重建树。root 的 logic/items、group 全部键与 `subTree`、leaf 全部字段都保留；不复制样式、轴配置、图表 ID、结果数据或别的 view 属性。

结构校验使用产品小写 `and/or`（文中的AND/OR为显示语义），递归识别 root `{logic,items}`、`type=tree` 的 `subTree` 与 `type=item,subTree=null`；允许合法 AND/OR 嵌套、固定条件逻辑/枚举、静态日期。动态日期/动态系统参数/无法理解的字段或结构/空组整包拒绝。拒绝不是删字段后继续。leaf 既有输出键为 `enumValue,fieldId,timeValue,filterType,filterTypeTime,dynamicTimeSetting,term,timeType,value,type,subTree`；group 保留产品实际空键和空数组/对象。新建 UI 提交时 `name/deType` 不属于 canonical 输出；**已持久化产品树的 `field:null`、`valueType:null` 是已识别兼容键，必须原样复制，不能用提交白名单误拒**。已知 `dynamicTimeSetting` 六键全部null的结构属于静态占位，不当动态过滤拒绝；无 `timeValue` 的持久树也不能擅自补键。未知扩展键若不能证明语义支持，拒绝整包，原 clip 不变。

`cloneDeep` 保留 own-key 的 undefined。运行态对象比较明确区分缺键、undefined、null、空串、[]、{}。真实传输/保存另用现有 JSON 边界的观察结果作比较：JSON 对象会省略 undefined 键，这不是 clipboard 允许偷偷删键的理由。测试 fixture 必须同时记录 own-key 清单与 undefined paths；不能只 JSON.stringify 比较两次就声称保真。

`evidence/ExistingTwoConditionSample-r001.json/png` 仅证明真实 UI 显示根 AND、amount > 200、子组 OR 的 shop 枚举六店。它未捕获精确 serializer payload，**不从 AX 猜 JSON/golden**。另有 `evidence/ExistingTwoConditionPersisted-r001.json`（SHA `2832b27bb94e5d5435800ef390993b2781f97968d65fbe554f83acfca8ea9cbc`）提供只读DB真实持久样本：dataset `985189703189925888`、amount字段`1715053944937`/deType2/term gt/字符串200、shop字段`1715053944934`/deType0/六店，含上述持久化兼容键。此样本是本轮可立即执行的完整树fixture，不能称UI前传输serializer输出。Builder 在真实 FilterTree 的 filter-data/当前 customFilter 调试观察处捕获输出，记录所有 own keys/undefined paths，并从真实 query/save payload 校准；fixture 冻结由控制面/测试 lane 负责，Builder 不修改冻结 Cases。冻结前可直接 build 按钮/生命周期与 fail-closed 基础片段，不能将手写样本算最终验收。

兼容要求：source/target 的真实 dataset identity（现 tableId 的原始 ID 表示）一致且均已解析；逐 leaf 按 fieldId 在 source 和 target 的完整可选字段目录找到同一个字段并匹配 deType，保留字符串 Long，不转 Number。不按显示名配对，不只检查已选轴。字段已删、count/-1、目标不可用的图表专属计算字段、目录未加载、类型变化，全部拒绝。使用既有 `getFieldByDQ`/Editor getFields 的返回目录。picture-group 当前 watcher 特意跳过 getFields，MVP 增加仅复制粘贴校验所需的显式目录加载，不擅自删除原 skip；目录不可得需显示原因并记录该 type 未通过，不能悄悄缩分母。

## 3. UI、权限桩与 clipboard

在 Editor 原“结果过滤”区域加入两个真实 ElButton：`复制过滤条件`、`粘贴过滤条件`，含可访问名称与稳定 data-testid（`chart-filter-copy` / `chart-filter-paste`）。源空树禁 copy；无 clip/过期/不兼容/权限未知禁 paste，并给具体原因。已有过滤器按钮保持原行为。目标非空时最小确认“替换全部过滤条件”，取消无 query 无改动；首条验收优先空目标，不把覆盖确认当空目标前置。

权限 port 返回 allow / deny / unknown，分别检查读取 source 过滤条件、访问 source/target dataset、编辑 target；copy 和 paste 均检查所需权限，提交前重检。只有 `import.meta.env.DEV` 且显式 `VITE_FILTER_COPY_DEV_VALIDATION === 'true'` 才加载开发验证 adapter；默认 unknown，未显式选择 allow 不放行。开发验证面板明确标“权限测试桩”，可选 allow/deny/unknown，未知 identity 无法由 allow 旁路。生产条件恒关闭，按钮隐藏或禁用；真实 getData 服务端既有权限继续生效，桩不绕过后端。预留 port 类型给后续真实来源，不接假生产实现。

clipboard 属于当前页面的当前 editSession（资源 ID + 编辑模式生命周期）单例内存，不用 localStorage/sessionStorage/window跨标签广播/系统剪贴板。内容为 immutable 深克隆 tree + dataset identity + 单独字段元数据 + createdAtMonotonic + opaque identityEpoch/editSessionId/clipRevision；不保存 token、代理 secret 或用户查询结果。新复制先完整校验，成功替换旧 clip，失败保留旧 clip。

时间使用 `performance.now()`，有效条件 `0 <= now-createdAt < 1_800_000`；正好30分钟过期。时钟回退/非有限值拒绝。页面reload自然丢内存；退出编辑/资源变化/登出/身份变化清除并递增 epoch，数据刷新不清。会话 identity 从当前已解析 uid/oid、登录 session time/token 的内部比较、proxy/proxyOid 与当前缓存有效性获得，仅向 clipboard 暴露不透明 epoch；缺必需项按 unknown 拒绝，不能用admin或固定值补齐。

注意 `user.clear()` 只删cache不清响应式state，不能只watch uid/oid；在editSession服务中订阅 Pinia `$onAction` 的 clear/setUser/identity setters，在 clear 调用开始立即 invalidate；并监测身份 tuple 和 cache clear 通知。`clearCache()` 是另一路登出清理，需调用同一轻量 invalidate 通知或在每次操作比较缓存 identity，且主动清clip。页面 route/editMode dispose注销订阅。此处不修复全应用认证模型，不输出敏感值。

## 4. 最小专用接线：一次 paste 一个候选

新增小模块 `src/custom-component/filter-copy/mvp-chart-filter-copy.ts` 保存同页状态/guard/types，新增局部 `FilterPasteRenderer.vue`（建议位于 views/components）承载现原生 renderer。不得占用/重写已有 query-* helper、旧双host runner、LSC 或 g2 ownership 协议。名字是候选，精确 admission 应绑定最终路径。

Editor 与真实 views wrapper 为兄弟，不假设 inject 能跨兄弟拿 ref。沿现 emitter 新增一个**专用 request/reply**事件 `paste-chart-filter-${targetId}`：payload 包含 operationId、immutable candidateTree、context token，以及 `resolve/reject`；wrapper 在 mount 注册、unmount解除，target无接收端则有限超时以失败结案。它不落请求到共享 Store。仅注册当前编辑画布的单一 receiver，包含editSessionId校验，不能让panel/移动/预览副本同时处理同ID；已有 `calcData-*` 广播不用于此事务。busy 在发事件前设置；无receiver timeout不发query。

operation 捕获：递增 operationId、targetId、原始 target view/element 配置深克隆与完整 own-key snapshot、当前 request context snapshot、identityEpoch、editSessionId、clipRevision。一个target只允许一paste，按钮立即禁用。切target、用户重新编辑任何相关配置/过滤/参数/数据集、切资源或卸载时 invalidate。目标进行普通刷新/query/loading时拒绝启动；paste期间当前目标的普通刷新入口先使paste失效再按旧流程执行，避免同目标活动实例被候选覆盖。这个hook仅在本target paste处于busy时生效，不建设全局请求排队/取消表。最终成功后解除busy。

流程固定为：

1. 校验flag、identity、clip/TTL、权限、全tree、字段目录、目标busy；非空目标先确认，再重新捕获目标。clone view/element 并仅替换 candidateView.customFilter，不碰共享 view。
2. 在 wrapper 内复用当前 `filter(false)` 构造完整 chartExtRequest，包括 query、联动、outer/web、drill、resultMode/count；提取其纯构造部分以避免 report window 写入，或仅在编辑路由调用当前无report副作用分支。若任一调用链会写Store，先延后该写入，不把 `setLastViewRequestInfo` 提前当准备步骤。
3. 按renderer构造现真实query参数并调用**同一个 `@/api/chart.getData`**，传独立clone（它会delete入参data）。G2保stock-line规则；S2保分页/pageSize；rich-text保checkCompareCalc的resultCount/mode；picture-group保type=table-info/render=antv/resultCount=1与响应type还原。不得新建axios或mock业务结果。
4. `getData`增加可选 `reportOutcome` overload，默认老返回语义不变；在现 envelope `res.code===0` 分支的解码完成后返回 `{ok:true,value:res.data}`，非0返回 `{ok:false,error}`，网络异常reject。只为新链保留权威业务成功位，不从已解包DTO猜code。其余调用不传选项不变。正常空数据属于成功DTO，按现渲染空态处理，不等同接口失败。
5. 再核 operation/target/config/context/session/clip/TTL/权限；失败直接丢DTO，无Store/条件/预览写入。成功后将DTO交下述一次性候选节点，仅消费已准备数据，**不调用它的calcData，不再发query**。
6. 候选完成显式渲染结果，且所有必要初始化都完成后，再复核同一组token。单一同步publish段采用完整tree、对应response/derived metadata（last request、details、origin/purecanvas/page/钻取等按原组件分支）、切换同一已渲染节点成为active，记录一次现有snapshot/dirty。publish前不发任何对外成功信号。不能用调用普通 Editor.calcData/renderChart 去完成publish，否则二次query/绘制破坏已准备保证。
7. 返回成功，再显示粘贴成功。discard失败/过期候选、解除busy、明确失败原因，无成功提示。普通刷新从新active ref继续按原流程；显式保存不由paste触发。

配置snapshot须包含所有会影响该目标query/渲染的view与element输入，以及wrapper filter request context，不仅customFilter；user编辑后改回也要用递增generation检出。深比较对own-key敏感，不能JSON.stringify省略undefined；MVP拒绝非支持的不可克隆值。prepare期间自身busy/preview本地状态不算目标配置编辑。

## 5. 一次性候选节点：保旧的最小必要补丁

这是每次paste的局部预览槽，不是通用host/stage/controller。旧active组件和DOM在候选结束前保持原样；候选使用尺寸等同目标的真实DOM、唯一suffixId/key与独立view/element clone，置于目标局部不可见层（visibility:hidden、pointer-events:none、inert、aria-hidden，不能display:none/零尺寸）。最多一个候选。成功时提升**同一个key/组件/DOM/图表实例**，不再次mount/render；解除不可见属性并将wrapper chartComponent ref指向它，旧active在publish后按既有unmount清理。下一次paste只增加一个新候选。可用局部keyed数组保留active/candidate节点，禁止把old render后销毁候选改为再画一次。

禁止直接挂原views wrapper当candidate：它会注册全局query、timer与其他产品入口。只复用下层原生renderer，新增 `filterPastePhase: candidate|active` / `consumePrepared(response)` 专用入口；默认active保持旧路径。候选所有业务emit、Store写、全局注册/事件、截图、resize自动重绘、自动query、轮播、tooltip共享行为都必须在这里延后或使用明确phase guard；CSS禁交互不替代软件guard。构造参数action/quadrant等传phase检查的闭包，候选回调无全局效果。对候选所需的本地afterRender仍真实执行并等待。激活需要的adapter准备也应在render结果前完成且回调仍有phase guard，不能publish后再跑可能失败的初始化并声称原子。

| 真实入口 | 已见问题 | 本次最小补丁和结果 oracle |
|---|---|---|
| `ChartComponentG2Plot.vue` G2 | timer+queue；draw/render/afterRender catch后resolve；普通路径先销旧；tooltip/默认值全局事件与onMounted观察器 | 新consumePrepared只改候选局部chartData/curView；新严格调用模式返回 `{ok:true}` 或 typed failure，等待timer、queue、draw、render、afterRender；候选构造不传old实例，guard action/pointClick/quadrant/default emits与shared tooltip/carousel，移延共享副作用；候选observer不触发额外render；legacy默认不变 |
| 同SFC L7Plot/L7 | async只setTimeout即返回，timer catch吞错；L7 render未await | 严格模式返回包住timer实际body的Promise；等待真实draw以及library可用ready/load/render完成信号，挂error/timeout；候选map参数仅本地，resetLoading/地图默认范围不向active发；不是setTimeout安排成功即ok |
| `ChartComponentS2.vue` | chartData/page/store提前写；debounce finally一概resolve；draw销旧，render未await | 候选独立pageInfo、normalizedData，consumePrepared不query；严格模式catch返回失败，等待S2真实render/layout完成或error，不能finally视为ok；setViewInstanceInfo/page/purecanvas/scroll activation延后；候选不挂active timer/交互 |
| `DeIndicator.vue` | calcData先写details/drill，render只改响应式样式 | consumePrepared对独立本地数据/样式渲染，await nextTick并校验目标DOM/值及Vue error；metadata延后publish，业务事件phase guard；不是有callback就ok |
| `DeRichTextView.vue` | initCurFields写canvasViewInfo.curFields、element.propValue，发initCurFields全局事件 | consumePrepared用clone element/view和本地curFields/替换映射；候选调用本地内容生成/净化/nextTick，不向真实element或eventBus发布；相同DOM提升后统一publish必要curFields/element字段；查询适配沿原checkCompareCalc，不自行简化 |
| 图片组 `picture-group/Component.vue` | 请求type重写；initCurFields写canvasViewInfo，watch/内部刷新/轮播可query | consumePrepared复用本地图片选择/threshold映射，prepare不启动内外refresh/轮播；所有element与curFields写到clone；真实图片decode/load/error（或明确合法空态）是结果oracle；成功再启用原active行为；新增onBeforeUnmount清除该组件自身timer是直接失败候选必需小补丁 |

同一library的49type复用入口，仍按inventory检查每type传入的特殊callback/transform；不能“38G2共用组件”就假定全部接线/构造副作用一样。严格错误通道只能说明失败，不能独自保护旧画面，故一次性候选节点是本设计最小必要部分。通用取消、多请求乱序、所有构造中途资源泄漏证明、全host资源图、29例LSC矩阵均不在本次；旧helper若已存在，只按实际已验证接口复用，不扩展它作为前置。

渲染ready有明确上限（建议10秒，地图30秒）与error，超时按失败保旧，timer清理并标候选作废；迟到ready不得提升。late构造返回已知实例时尽力销毁，回调都检查该候选存活。不能宣称已解决renderer内部未知资源泄漏；移出Session跟踪。若某type无法在现库找到可等待完成/error信号，列出该**具体type、实际调用、最小补丁或资产缺口**，保留未验收，不以fulfilled伪装通过、不暂停其它49项可做工作。

## 6. 保存与完整运行验收

真实仪表板：`DbToolbar.saveCanvasWithCheck/saveResource → canvasSaveWithParams → 原saveCanvas/updateCanvas → findById/initCanvasData`；大屏对应 `DvToolbar` 同链。paste成功需要通过现snapshot dirty机制把当前canvasViewInfo纳入既有保存；不新增自动保存，不用`/chart/save`代替完整仪表板保存。复制失败/查询失败/候选失败/取消确认/过期响应不得新增snapshot或dirty。保存期间busy候选不能混进canvasViewInfo；存的是active配置。

真实样本验收：现有两条件源 → copy → 空目标paste → 原子成功后预览结果 → 用户手动数据刷新 → 完整tree仍一致且结果正确 → 显式保存 → 离开该资源 → 重开。比较source运行态树与paste树的全部own-key/undefined paths；另比较实际query JSON与save/reopen JSON的规范化边界。核对两个leaf、根/子组logic、运算符、全部枚举值/值及实际结果行/聚合命中，不只截图/首条件/条数。

证据分别记录paste query=1、消费prepared额外query=0；手动刷新和重开各自按实际既有调用记录，不能武断规定整条链总计只有1次。真实后端响应、UI可见结果、保存请求/响应、重开读取是独立观察面。地图/图片网络资产缺失记BLOCKED，未知权限结果始终只算桩分支验证。

## 7. Builder diff候选、切片和测试 seam

生产写候选（必须在独立审查后绑定精确admission，当前不授权实现）：

- 新增 `mvp-chart-filter-copy.ts`：内存clip/session/guard/三态port与局部operation状态；仅导出专用API。
- Editor index：两按钮/覆盖确认、使用真实customFilter和目录、生命周期/dirty接线、request/reply；图片组显式字段目录最小入口。
- views index：唯一编辑receiver、当前真实query context准备、getData outcome、busy失效hook、局部一次性candidate keyed nodes/active ref选择、commit metadata。候选body可以新增 `FilterPasteRenderer.vue` 仅抽取现native路由与props，不另造chart实现。
- `api/chart.ts`：getData可选严格outcome，原解码/拦截/签名/默认返回不变。
- G2/S2、indicator、rich-text、picture-group：上表明确的prepared消费/phase guard/显式ready结果；不改图表算法或后端。
- `user.ts`、`cacheUtil.ts`：如采用清理通知，仅新增轻量session invalidation，不改认证权限含义；也可在服务内用$onAction实现user分支，cacheUtil分支仍需主动通知。
- `locales/zh-CN.ts`、`en.ts`、`tw.ts`：按钮/覆盖确认/具体失败/桩模式提示。DEV类型声明仅在确有现类型缺口时精确新增。
- 既有 DbToolbar/DvToolbar/canvasUtils/snapshot 默认只读，优先复用当前dirty/snapshot，无明确缺陷不修改。不能顺带改query组件、后端/XPack、依赖、全局axios取消、旧Design/Cases/runner或其他未提交内容。

切片 A 可立即独立Builder：真实Editor两按钮、三态权限/identity/session/clip、同dataset字段/结构检查、prod关闭、只完成copy与失败分支，paste未接准备端明确不可用，不能提示成功。切片 B：真实query prepare+业务outcome与单操作失效，查询失败保旧；仍不发布未准备预览。切片 C：逐真实组件接prepared候选与错误通道，先交已接实际UI片段，再补全49type入口及family；不得以首条bar→line完成替代49范围。切片 D：真实刷新/保存/重开与完整树结果核验。切片均只提升对应证据层。

首RED：在真实Editor（实际Vite页面/真实编辑路由或最小带当前providers的SFC mount）断言结果过滤区域有上述两个可访问按钮；baseline应以明确expect可见按钮数量2、actual0失败。保留成功mount与其余既有FilterTree按钮可见证明；依赖/编译/缺新module失败不算RED。不得stub掉被断言的Editor子树。

有限Cases见同目录JSON。组件harness可用可控deferred API/renderer故障检验保旧，但真实browser链使用既有getData和隔离开发数据，不能mock业务结果来算验收。Runtime fixture捕获应在DEV只读测试seam暴露immutable tree/own-key、当前operation和query count，不暴露token，生产不可用。对5个真实renderer SFC的6组入口的严格失败与候选全局副作用必须用实际组件harness覆盖，不能只测纯helper。

## 8. 风险与准入

当前未执行任一case。UI前传输serializer own-key样本待runtime捕获（DB持久fixture已就绪）；49项运行为NOT_RUN；picture-group目录、L7真实ready、富文本内部edit组件的候选全局注册/ID需Builder/Review沿实际调用确认。若内层富文本按element.id发global事件，需新增仅渲染候选的本地channel/禁注册选项，不能改canonical resource ID；克隆对象本身不阻止同ID事件冲突。

独立Review应覆盖：新人类范围、49分母、真实序列化、全部5个SFC/6组入口、候选publish前Store/事件/计时器、strict失败与同节点提升、实际query次数/保存链。上述具体候选隔离工作不恢复通用framework；如审查发现必须扩大到通用框架，保留具体触发与当前不可用type，先实施不依赖部分并由控制面决定Scope，而非抽象阻塞整Goal。当前无需新增人类确认。

Builder前：控制面刷新冲突projection、冻结本Cases与DB持久fixture；真实端到端验收前补捕获UI serializer样本、独立Review dispositions及必要revision、绑定实际源码SHA和精确write paths的admission。任一必改源码被并行lane改变需重算diff/admission，不覆盖。当前工作区G2/query-*等已有大量未提交内容均为基线，不能归入本设计的实现成果。

## 源码基线（只读观察时的实际字节）

| 路径 | SHA-256 |
|---|---|
| `core/core-frontend/src/views/chart/components/editor/index.vue` | `0a8d78ffce297d941cd2d42c4240d0f266bac53926360d2bf83c6134a641f39d` |
| `core/core-frontend/src/views/chart/components/editor/filter/FilterTree.vue` | `683a69f36ea24e60d2777b02fc88adf1c39311d0f59a316516fbc6ab27c145a9` |
| `core/core-frontend/src/views/chart/components/editor/filter/auth-tree-chart/RowAuth.vue` | `ebef31245e8525d82e6c82dbe4e83c313b74f1d9af8bae5e7d76b788eba0e775` |
| `core/core-frontend/src/views/chart/components/views/index.vue` | `2b0b1794737e35331a59569cd516078da898435e3f9c3db31d0287847240b1bd` |
| `core/core-frontend/src/views/chart/components/views/components/ChartComponentG2Plot.vue` | `f3bf70c99bf5bcf1ebbe56e5d1caa4bd94660927a1a1785f756859cd9317503c` |
| `core/core-frontend/src/views/chart/components/views/components/ChartComponentS2.vue` | `43b44c57b27486cd46e101d76d4c64baac280bea3ff379e41b0294e18e5b11d4` |
| `core/core-frontend/src/custom-component/indicator/DeIndicator.vue` | `49851f35e03c1251e13c877d6c3cac4e7d10b75c8995f036aa641991e49fd831` |
| `core/core-frontend/src/custom-component/rich-text/DeRichTextView.vue` | `e542502bf21ebb65bffa6aa4fe778735bd632b5a1cde704ecb3bcfdadeec8b18` |
| `core/core-frontend/src/custom-component/picture-group/Component.vue` | `95f0e275408e5321337823bca357996cb48cca68bc039b4ed3f9211fae3a6820` |
| `core/core-frontend/src/api/chart.ts` | `6dbe0684c95f0c2be625a7a0094db894a0d431f003c8d7613145279dc3f218a7` |
| `core/core-frontend/src/store/modules/user.ts` | `b6deca80ca5e6590fdaebffe7105db62a30db2a76bdb90418d29f64267885fdc` |
| `core/core-frontend/src/utils/cacheUtil.ts` | `4a2020dc0fc272f6b4a2976f71a0df08adcc3b662baa01f1c047a555e9e3e0a7` |
| `core/core-frontend/src/components/dashboard/DbToolbar.vue` | `bbe3a90657b648b1c8b66ea12ac2a9f14a565396f2982572b538fe5048277b1d` |
| `core/core-frontend/src/components/data-visualization/DvToolbar.vue` | `ea6171a3d9d822fb9e0ec71b8f8a6004193a162d66e9bfae1606b0da7491551a` |
| `core/core-frontend/src/utils/canvasUtils.ts` | `f9c68f5c96a716ed451206ef6efcbda27158cc828b578920ed5a15167bbc8282` |
| `core/core-frontend/src/store/modules/data-visualization/snapshot.ts` | `5ffd11d4740efbd8570e31c42cffb8870a879eaf309bb4f31b00e40cc57c2e30` |

补充材料：
- `MVP-20261027/SupportedCharts.json`：`163edf6b7f0a03f99256d02bb10f77c993847513f953a3e4fc743d0500c8dec4`。
- `MVP-20261027/SupportedCharts.md`：`042e6b3b215d736fd5a7740d72b9233073d24bbc78aa3223c810df2508811cb2`。
- `MVP-20261027/evidence/ExistingTwoConditionSample-r001.json`：`082a3edf400e14ae2a64b360685aee65f1ca7cc0af8cc2694f7f16235ad89353`。
