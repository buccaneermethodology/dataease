# A 切片独立验证 r001：冻结版本有界通过

## 裁定、独立性与时点

**PASS_WITH_BOUNDS（有界通过）：A 的真实 Editor 两按钮、只读复制、内存剪贴板、开发权限三态、基础结构/目录拒绝及编辑会话生命周期可以继续与 C1 集成。未发现阻断本 A 边界的生产行为问题。** 当前有两项非阻断发现，逐项见下；测试 lint 不是全绿，不因功能14/14而省略。

本报告为 **A 实现交付 Validation 第1/3轮**，Reviewer/source 为 `/root/line_construction_builder`。Reviewer 非 A 源码/runner/实施证据作者；曾负责另一个 B API 切片和 SupportedCharts 清单，本报告不自审 B，不借其结果提升 A。没有替 Builder 修复 A。

审查对象固定为 `slice-a-final-snapshot-r001` 的11个原字节文件，快照创建时点 `2026-10-27T04:38:40.467815+00:00`；manifest SHA-256为 `8102228cc1bd02308a5c8f0816059769c149c8cce09b8a451948c69b0972153b`。本报告审阅时点 `2026-10-27T04:48:33Z`。**不将随后 C1 修改过的工作区 source 称作本轮已验版本**；A 与 C1 合并后的真实 query/候选渲染/发布仍需集成验证。

本轮只写本报告，未操作 root 当前浏览器标签页、服务、DB、安装、Git暂存/提交/推送或生产源码。root 的浏览器/DB观测明确归属 root，Reviewer 仅离线读取、查看截图和独立重算。

## 输入、执行身份与复验

- 接收端 Card canonical `4e97c34ada5e533fb27f7dab647b109a668718eb0dcc0658cf9ded94aa78a5c3` 复验 pass；Context SHA `f93396b361fba8715af99cd2ae841edc63a15a43158475446c78dd885c955c34` 结构校验exit0，27项required-read原字节摘要逐一匹配。
- **运行前**11项当前文件与对应冻结snapshot逐项匹配；运行后再次检查无漂移。已完成所需工作区运行后立即通知root可以让C1改source，后续静态审查仅使用冻结bytes。
- 独立执行 `cd core/core-frontend && node tests/filter-copy-mvp/check.mjs`：**14/14 PASS，exit0**。并非复述Builder日志；实际读取生产service/composable/static options、真实Vue lifecycle和完整Editor SFC。
- 独立执行包含生产八文件及runner的focused ESLint，不带 `--fix`：exit1，仅新增runner两处 `no-empty-function`，详见 AVAL-N001；生产八文件无本次lint诊断。它没有推翻Builder原先“仅八个源码lint0”的准确范围。
- 阅读新service/composable完整代码、完整runner/README/实施证据、Editor完整SFC及原baseline→A实际差异、user/cache实际清理接点、三locale的全部差异。既有文件差异仅A导入/初始化/结果过滤区、两项主动失效调用、三语言局部namespace；未混入baseline已有修改。新增service/composable/runner按完整文件审查。
- 报告前再次重算11个冻结snapshot：全部原SHA匹配。原DB fixture SHA `2832b27bb94e5d5435800ef390993b2781f97968d65fbe554f83acfca8ea9cbc` 匹配，3条raw_custom_filter分别与解析树相等。

## 全部发现及处置

### AVAL-N001 / P3 / 非阻断：测试 renderer 两处空hook违反当前lint规则

冻结 `8-check.mjs:233` 的 `remove: () => {}`、:244 的 `patchProp: () => {}` 触发 `@typescript-eslint/no-empty-function`，独立focused lint确实exit1。两处是明确的Vue测试host hook，没有修改生产DOM行为，也没有隐藏产品异常；14例仍真实执行。

**处置：** 保留本轮冻结字节及lint失败证据，root可在下一精确小修中给测试hook写明有意义的实现/约定并复验；不能倒改本轮“八源码无错误、测试runner两错误”的时点。此项不阻A复制链或C1独立实现，不应为了它修改生产文件或重开设计预算。

### AVAL-N002 / P3 / 非阻断输入一致性建议：结构校验尚不等于完整原生数值验证

冻结service `3-mvp-chart-filter-copy.ts:79,242–262` 检查scalar/运算符/非空，但没有重复原生RowAuth的数值验证。Reviewer额外内存装载**冻结真实service**（无源码改写），将真实DB样本中deType=2、term=gt的value改为 `'not-a-number'` 或boolean true：`checkMvpFilterTree` 与 `copyMvpChartFilter` 均返回null，clip保存该值。另一个“numeric enum”探针亦被接受；它不证明该形态一定是后端无效条件，不能据此追加未经authority要求的新禁止规则。

原生 `RowAuth.vue:errorDetected` 对deType2/3使用 `parseFloat(value)` 的NaN检查，前两个畸形输入不属于本轮已经捕获的真实UI可提交样本。**本项不冒充真实UI漏洞复现，不阻A只读复制已验证的基本树，更不证明允许发布错误目标。** 当前A paste始终不可用；后续扩大输入来源或接B/C时，可按原生验证语义补数值负例，明确不支持值整包拒绝、原clip不变。不要把“基本结构已检查”扩称所有字段值语义已验证。

该补充探针首次因snapshot目录无法解析lodash而执行失败；显式指定已安装前端node_modules解析路径后才执行成功。此诊断恢复没有当作产品RED、没有安装依赖，也没有改变14例结果。

**阻断发现：0。** 上述两项之外，未发现新的本A范围生产阻断。没有替Builder改码，也没有将未检查/后续硬化包装成无期限阻断。

## 测试真实性与已检查无问题维度

| 维度 | 独立结果及证据上限 |
|---|---|
| runner来源与doubles | esbuild `write:false` 从真实service/composable文件bundle；lodash和原生dataset/options.js为真实依赖，Vue及compiler-sfc实际运行。user/cache/dv/route/字段API/图表manager为列明provider doubles，没有复制生产service或替换其校验。能力double对除unknown-plugin外统一给filter，**不能证明49类型真实注册或入口**。 |
| 完整树复制 | 从当前tree直接cloneDeep并freeze，不经RowAuth再序列化、不用JSON roundtrip。真实DB两leaf、根and/子or、amount gt字符串200及六个shop枚举保留；field:null/valueType:null、六null动态占位、缺timeValue、own undefined分别验证。返回defensive clone，不让调用者改内部clip。 |
| 支持/拒绝 | unknown扩展key、active dynamicDate/sysParams、空组、无效subTree等整包拒绝；拒绝在替换clip前返回，旧clip保留。空源 `{}` / null占位 / 空items拒绝，空target同三形态允许；不把这两者混为一谈。未将本有限形态称全部业务值验证。 |
| 字段与ID | 独立字段请求解析完整dimension/quota目录，目录未就绪/请求失败/重复引用字段/缺失deType等fail closed。使用原ID严格比较，不转数字Long、不按显示名或已选axis匹配；源目标dataset及树实际引用字段deType匹配，未引用目录增项不误拒。 |
| 三态和生产关闭 | permission默认unknown；deny/unknown理由清楚，只有显式DEV+字符串flag=true及已知identity才能允许copy。生产define=false的实际composable编译分支已在14例执行：visible/enabled=false，allow也不能copy，字段目录请求0。不是实际production build/deploy验收。 |
| 身份及凭据边界 | 内部比较缓存和真实user tuple，含uid/oid/token/time/proxy关系，缺项拒绝；clip/诊断仅tree/字段元数据/opaque epochs/revision/时间，不输出token/proxySecret。user.clear和clearCache在删缓存前直接invalidate，静态source接点确实存在；不是删除reactive state才能生效。真实Pinia认证/退出UI未由provider-double测试动态证明。 |
| TTL | performance.now，0<=age<1800000；到点、回退、NaN拒绝，不由读取、选图或普通刷新续期。真实UI观察也支持revision/createdAt保持，但不据两个观测的墙钟差推断精确耗时。 |
| 资源编辑会话 | detached effectScope只有一个模块级owner，真实route/editMode退出stop；同路由换resource使clip失效，后续退出仍被监听。Editor临时卸载不清clip；局部订阅/250ms timer/目录代次按卸载注销；定时器不因旧Editor路由变化重建已离开的会话。未发现本实现必然累积的watch/timer泄漏；未声称HMR或所有外部登录路径均验。 |
| 异步目录 | 每次id/tableId/type变化递增代次并置fieldsReady=false，晚到response只可在代次匹配时采用；unmount增代次，防止旧请求回填。没有在A里引入真实paste query或通用资源调度。 |
| Editor与i18n | 完整SFC script/template经真实compiler-sfc编译，无错误；复制/粘贴两testid、可访问中文文案、禁用理由、明确权限测试桩/只读诊断与原openTreeFilter共存。三locale局部键完整；新service不顶层捕获翻译函数。 |
| A粘贴边界 | pasteReason最终为preparation_unavailable或前置具体拒绝，按钮禁用；即使直接调用A paste也只更新本地status，无query、树/Store/dirty写入或成功信号。它没有实现query/候选render/目标发布。 |

14组的实际结果涵盖：持久树保真、own undefined/不可变、空源/空目标、结构拒绝保旧、原ID/目录/deType、权限与DEV、TTL、session失效；以及真实Vue composable目录等待/陈旧响应、源目标切换/临时卸载、cache未知身份/能力、同路由resource退出、production编译关闭、完整Editor SFC编译。全部通过不等于对应原15个产品case全部PASS。

### 独立补充的真实RowAuth样本消费

root新增的真实 `UiRowAuthOutput-r001.json` 已读取（SHA `a5b648d9e2d2c9b57eae05e430ad11152864004f6c6d4d5fbf5e726abc92f276`）；不把旧材料的“尚未捕获”写成当前事实。Reviewer按其独立记录的undefinedPaths恢复两个own undefined，再将观察值交冻结真实service；完整深比较及两条undefinedPaths均通过。此为**冻结service消费实际观察样本的模块补查**，不是我的浏览器重放，也不是重新定义/修改冻结golden。

## root真实UI证据的独立核对

阅读首UI GREEN完整AX、JSON并查看首GREEN/首次copy/目标切换三张原PNG，未驱动root标签。AX中确有唯一一处“复制过滤条件”和“粘贴过滤条件”可访问按钮，均在结果过滤区域；未启flag时disabled及理由正确。截图与AX一致。它支持MVP-UI-01入口GREEN；不证明网络query/save行为。

逐字段重算9个source/clipboard observation：JSON投影对象路径、ownKeys（扣除明确undefined位置后）与JSON实际键顺序一致，undefined位置在ownKeys中确实存在。并执行以下独立比较，不只相信文件中的assertions布尔值：

| 材料 | 独立重算结果 |
|---|---|
| UiClipboardCapture-r001 | source树等于DB持久树；clip/source的完整tree、ownKeys、undefinedPaths逐项相等；两leaf、根and、子or、六店完整。 |
| UiPermissionStub-r001 | deny/unknown按钮禁用并返回对应理由；allow使copy可用，paste仍未就绪。三态中的原clip revision=1/createdAt保持，未授予真实后端权限。 |
| UiTargetSwitch-r001 | 目标line为空占位树；copy理由empty_source；原clip完整树/ownKeys/undefined、revision/createdAt与首次copy一致。未发生粘贴。 |
| UiRefreshKeepsClipboard-r001 | 更新目标line数据后clip完整树与revision/createdAt保持；未量测全页请求总量，不由此断言粘贴query次数或保存已验。 |
| UiRowAuthOutput-r001 | 真实既有FilterTree保持原值确认后，leaf own timeValue=undefined两路径明确；root/group/leaf新输出与旧DB树形态分开，未误把JSON缺键当运行态丢键。没有保存源DB。 |
| UiFreshSerializerCopy-r001 | source=上述RowAuth观察值；clip的完整JSON、ownKeys、undefinedPaths与source一致；revision1→2，createdAt严格增加。两个own undefined仍在，六店/amount200/根and/子or保持。 |

`UiFreshSerializerCopy-r001.json` SHA为 `973d36574e11ee1448f99cb5627acb67e30789d3354f940e84b14e560e79cd47`。新两个文件是在初始Context之后按root明确补充读取的delta证据，未把它们冒充初始27项的一部分，也未改历史PENDING记录。观测归属root；本Reviewer只重算、查看截图及补充模块消费。

## 未检查、同类残余与准入预测

- 本轮没有独立操控真实UI、真实登录退出、多账号/组织、真实权限服务、后端/DBquery、候选render、目标publish、保存离开重开、跨标签或所有49type入口；原因是A明确边界及read-mostly独立lane，相关B/C/D或后续Session继续承担。原生UI新两条件样本已出现，**全部静态日期/复杂分组/所有值形态仍未验**。
- provider-double lifecycle已执行，但实际user.clear/cache.clear actions及各宿主退出菜单只做源码接点检查；测试中cache清理用显式service invalidate，并未动态装载Pinia认证store。没有把它写成真实退出验收。
- picture-group真实Attr入口及字段适配、插件安装与能力Unknown、每type source/target组件覆盖仍保留；本报告不关闭UIR-001或将“通用Editor已出现按钮”扩为49类型入口PASS。
- 完整TypeScript检查的既有TS6504三文件边界沿Builder日志保留，本轮未无故重跑；未把模块编译或生产分支测试冒充全项目类型/构建/部署通过。
- 新A通用树guard对畸形值的补充建议及两个测试hook lint列为非阻断；后续若修，单独snapshot/delta验证，不回写本轮原字节。
- C1收到本轮“14例运行及before/after hash无漂移”通知后可修改source；**C1及A+C1当前工作区不是本报告的已验对象**。B API、C1 emitter/query准备、C真实renderer/candidate发布仍按各自独立证据和精确admission推进。

**修复/后续准入预测：** A 的有界复制结果可以继续集成；测试lint小修预计可定向消除，数值负例按后续输入兼容需要补齐。不能因此提前给完整paste/query/render/save或49类型验收PASS，也不重置本A实现Validation第1/3轮或UI设计第2/3轮预算。本结论不是Goal终态或完整Session closeout。

