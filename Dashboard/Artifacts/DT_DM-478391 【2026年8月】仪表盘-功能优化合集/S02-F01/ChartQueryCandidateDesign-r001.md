# 候选图表查询工程设计 r001

本稿为第 **1/3 轮工程候选**，仅服务同数据集普通 `antv/line`、无 drill 的 staged-render 后续工程。它补齐真实候选查询 Promise 与取消所有权，不实现 Copy/Paste、stage renderer 或 commit。原 10 项 Goal AC、26 项 must-have、16 项产品义务及真实权限 `BLOCKED / NOT_RUN` 保留；不重开旧产品/事务 r003。权限环境缺失不阻止本非权限工程。

Card canonical SHA：`cab64c76f09aefd2bde5e9bf2bb6952cfb41843b8be675cd9f1eccfd964c6494`，接收端 validate pass；Context validate exit 0，15 项绑定全部匹配。Trace JSON `d3f434a4f6155a86899b577cb402b1235161a746ed91596abf0223a5189d4524` 为静态索引；事实/源码 SHA 见 Cases.source_binding。父任务通知一次模型 capacity 瞬时错误；检查输出不存在后恢复同一卡片，不重开任务、不扩大范围。

## 当前问题与边界

真实 `api/chart.ts:79-116` 的 getData 删除入参 data，再 clone/编码，返回实际 request.post Promise；SFC 的 calcData 未等待该链，并在渲染前发布 data/drill/Store/events。这里不改 SFC、Store、SDK、后端、保存或 S01。新 helper 自己 await getData，调用方原对象不得被 delete/字段编码污染。

`axios/index.ts:7-41` 已转发 signal，但 service `155-164` 对所有 chartData 请求写同一 `chartData/getData/<chartId>` key。候选不能覆盖 live。仅跳过登记又会丢全局取消能力，本设计采用独立候选注册表。

全仓公共前端调用点搜索显示，当前 `cancelAllRequest()` 唯一实际调用在 `v-query/QueryConditionConfiguration.vue:1878-1887` 的 handleFastClick；未发现登出调用。`cacheUtil.clearCache` 只清资源图/缓存，不能声称它已取消候选。未来 SFC/产品 owner 必须在目标/身份失效和卸载 abort caller signal，并以 isCurrent 防迟到；此工程不改认证生命周期。无论当前调用点是什么，cancelAll 都必须覆盖候选。

## 允许实现范围

- 修改 `src/api/chart.ts` 的 getData 可选内部 options 与类型；无 options 的旧调用保留现行请求、编解码和返回语义。
- 修改 `src/config/axios/index.ts` 仅转发候选 marker；修改 service 的 config 类型、候选取消注册/清理及候选错误传播。默认/非候选路径不变。
- 新建 `src/api/chart-query-candidate.ts`，以及 `tests/chart-query-candidate/` 定向 runner/环境 fixture。无新依赖、无新 axios、无生产 test-only export。
- 本稿只写 Design/Cases；Builder 必须消费独立审阅及 execution admission。尚无 RED/GREEN 或工程验收。

## 内部 API 候选

```ts
export type ChartDataRequestOptions =
  | { signal?: AbortSignal; cancelScope?: 'legacy' }
  | { signal: AbortSignal; cancelScope: 'candidate' }

getData(data, options?: ChartDataRequestOptions): Promise<IResponse>

interface PrepareChartQueryInput {
  requestId: string
  view: ChartObj
  signal: AbortSignal // caller-owned；卸载/目标或身份变化由owner abort
  isCurrent: () => boolean
}
interface ChartQueryCandidateBundle {
  requestId: string
  viewSnapshot: ChartObj
  response: ChartObj // 独立深clone的真实getData结果，非HTTP envelope
  chartData: ChartObj['data'] // 与本bundle.response.data共享允许
}
type ChartQueryCandidateOutcome =
  | { status: 'ready' | 'empty'; bundle: ChartQueryCandidateBundle }
  | { status: 'aborted' | 'stale'; requestId: string }
  | { status: 'failed'; requestId: string
      reason: 'unsupported' | 'input' | 'query' | 'business' | 'response' | 'current-check'
      error?: unknown; response?: unknown }

prepareChartQueryCandidate(input: PrepareChartQueryInput): Promise<ChartQueryCandidateOutcome>
```

这些是内部工程契约候选，不是新的产品公共 API。requestId 是 caller 提供的非空稳定关联字符串；不同调用的取消 owner 使用独立 Symbol，不依赖 requestId 唯一性，因此重复 requestId 也不能覆盖资源。

支持输入固定 `render==='antv' && type==='line'`、非插件、有非空 tableId、无活动 drill（chartExtRequest.drill、drillFilters 非空或 drill===true 均 unsupported）。不在 helper 裁定 target 为空、source READ、target MANAGE、dataset READ、剪贴板 TTL/容量或树合法性；这些仍属于产品 owner 的原合同。输入不支持返回 failed/unsupported，绝不退回 calcData。响应如带 drill 同样 unsupported，已尝试请求必须如实记录。

对 view 做 JSON 往返 snapshot，与当前 SFC 请求准备相同；cycle/BigInt 抛错返回 failed/input，原 Error 保留。snapshot 再 deep clone 为 getData 的独立 request 对象，使 getData 删除 data 不改 snapshot。bundle.response 再 deepClone getData 返回值；不持有 active/store/adapter fixture 对象引用。原 request/response 编解码仍使用生产函数，不在 helper 复制。

## 结果状态机与主因

1. 校验结构/requestId/signal 与支持边界；JSON snapshot 失败为 input。之后检查 signal 已 abort 则 aborted；isCurrent false 则 stale，throw 则 current-check。以上都不调用 getData。
2. 安装 once abort listener，再次检查 signal；调用真实 `getData(requestClone, {signal,cancelScope:'candidate'})`，必须消费底层 Promise 的 fulfilled/rejected 两出口。
3. 正常 ready/empty 只在 getData fulfilled 后判定；先检查已发生取消，再执行 isCurrent（false→stale；throw→current-check）。非对象、缺 data object、data.data 非数组为 response；code 存在且不严格等于0为 business；明确空数组为 empty，其余为 ready。不能把 undefined、吞错、callback 或缺数据当 empty。
4. getData rejection 保留原 rejection value/对象于 failed/query.error；若 signal 已 abort 或真实 axios.isCancel/ERR_CANCELED，则 aborted。不得仅凭 Error.name/message 模糊识别取消。业务码被现有 interceptor reject 成字符串时，reason=query、error 为原字符串；50002 可通过 interceptor，再由 helper判 business。
5. `settleOnce` 是每调用唯一逻辑 terminal gate；caller abort 可先返回 aborted，底层 HTTP/refresh/签名 Promise 只能随后 settle，仍须消费，迟到观察不第二次 terminal。不承诺物理撤回已发 HTTP，也不声称 aborted outcome 等于 adapter 已停。
6. global cancel 对在 adapter 中请求应由真实 axios取消 rejection归为 aborted。认证/签名等待阶段的取消先使 token 失效，待对应原有 Promise 释放后归 aborted，不虚构强制打断第三方 Promise；等待后不得派发 chartData。

优先级明确：先已终态不再变；未终态且取消→aborted；普通 rejection→failed/query（不以事后 stale 掩主错误）；fulfilled 后才校验 isCurrent，再 business/shape/drill。predicate 错误原对象保留。helper 无callback、emitter、成功toast、Store导入、dirty/snapshot、lastRequest或SFC错误/loading写入。失败/取消不清空活动旧预览。

## 真实 axios 兼容增量与候选全局取消

getData options 只允许 signal/cancelScope，内部转为 `chartQueryCancelScope:'candidate'` config；不向body加入marker，不开放 handleErrorLocally，不改变URL/headers/认证。caller-signal模式缺少合法signal时 getData拒绝（input error），不能默默产生无owner候选。

service 对 `url.endsWith('chartData/getData') && chartQueryCancelScope==='candidate'` 分支使用私有 `Map<symbol, CandidateCancellationEntry>`。非chart请求即使误带marker，也走旧逻辑；所有旧getData默认仍登记原 cancelMap。候选绝不读写或删除该 legacy chartId key。

候选 entry 含 token cancel function、owner Symbol、abort listener释放函数及幂等 release。候选 CancelToken 与 caller signal并用。**在 await configHandler/securityConfig 前登记**，然后沿用原 configHandler、securityConfig、body处理、mobile/link/embed/proxy/language和loading流程；每个await返回后和return config前检查 token/signal是否已取消，禁止全局取消后携旧身份派发 chartData。已产生的refresh/HMAC效果无法回滚。

- `cancelRequestBatch` 保持只遍历旧 cancelMap；同chartId live batch不取消候选，候选caller abort不取消live。
- `cancelAllRequest` 保留旧循环，再对候选registry取稳定快照逐个cancel/release；重复调用幂等。这里取消全部请求是其明确全局意图，不承诺取消候选却保留live。
- 候选成功、业务失败、transport失败、request interceptor throw、caller abort、global cancel都释放自己的owner/listener。删除须同时验证当前entry仍是本owner登记；迟到cleanup不得影响另一调用。新owner Symbol保证同chart/requestId并发不覆盖。
- response success/error入口在任何早return前释放候选；request interceptor try/catch对await失败释放；abort listener/global cancel也可先释放，之后settle cleanup幂等。释放本身不得掩盖原业务错误。

既有 response/error 的 toast、权限框、缓存、linkToken、版本确认、router/login/reload **全部先照常执行**。仅候选在目前会吞成 undefined 的 transport error 分支（413和error-handler尾部）改为 `Promise.reject(originalError)`；其他路径保持现状。这样 candidate保留真实主因且不会把权限拒绝变empty；默认legacy413/403等语义不变。不设置handleErrorLocally，不跳过权限handler，不清改后端权限判定。业务response既有reject message保留，不擅自创建权限oracle。

## stage renderer handoff

后续controller await本helper；仅 ready/empty 且其自身捕获tuple/当前目标/权限gate仍有效才可传 bundle.response/chartData 给独立renderer。empty 是显式零行候选，不保证 renderer支持/commit成功；aborted/stale/failed永不进入renderer。controller创建并保有AbortController，在重复prepare/目标变化/卸载/身份失效abort旧signal，isCurrent基于真实owner generation/capture实现；本helper不读Store或推导权限。此工程不修改SFC，也不实现发布tree/data/drill/details/origin/lastRequest/events/host交换。

## 稳定 Cases 与实际模块 RED seam

同名Cases含 **28 项**，完整身份摘要为 `63b4556d64da823395213d1a4c8b433d1bb77300de4bda9381d6ac8ff61b78e4`；摘要对象和算法写在case_identity，非自引用。这是候选首版，独立review冻结后不由Builder改oracle。每个case有唯一轴/输入事件/结果/副作用与主错误断言；表驱动子案分别记录结果。真实权限仍NOT_RUN，fixture permission headers只验证保留处理路径。

runner拟定 `node tests/chart-query-candidate/check.mjs --mode red|green`，在已有前端依赖上运行。使用真实axios、api/chart.ts、request wrapper、service/refresh/hmac/HmacTool及CalculateFields模块，通过内存bundle装载；唯一网络边界为真实service.defaults.adapter上的受控deferred。记录adapter实际调用和config，不用假service、假getData、复制handler或万能Proxy。

环境doubles仅限明确cache/store/router/UI/loading/locale/mobile/浏览器XHR边界；给每个stub明确实现与调用日志，保留生产认证/签名/response handler。auth refresh使用真实configHandler与真实request链，adapter另识别login/refresh；HMAC可用fixture-only key与真实签名路径，绝不读机器凭据。timeout/HMAC XHR也单列，不计chartData dispatch。

registry清理用AST精确定位service实际私有registry，在**内存bundle**追加只读测试export；源码不加入test-only API，不能复制登记/清理逻辑。baseline缺该feature时导出undefined并使相关断言失败，不能因导入不存在把RED包装为通过。保存bundle入口、源码hash、stub清单和提取锚；若无法真实装载则execution error，不能改成字符串搜索验收。

首RED bootstrap必须另获精确admission：新增同API可import helper stub（返回failed/not-implemented）及最小类型声明/runner，不实现query逻辑；旧API/runtime仍真源。首失败应为 QCC-001 期望ready实际not-implemented、execution_errors=0；legacy已通过项如实记。缺模块、语法/编译失败、loader/stub错误不是真RED。GREEN复用同Cases身份；生产实现不得用expected表/测试case id驱动输出。失败assertion、execution error、主错误与cleanup错误分开记录。

重点准入用例：legacy兼容、同chart候选/live/双candidate隔离、cancelAll覆盖、registry所有终态清理、auth等待取消后不dispatch、正常await、empty/undefined/business/transport/权限处理、stale/abort迟到无第二terminal。权限headers与adapter是测试doubles，只能证明该模块控制流。没有真实HTTP数、浏览器、权限、Copy/Paste或MVP验收声明。

## 计数、验证与下一步

逻辑 helper attempt、getData调用、adapter dispatch、response观察、lateIgnored处置、helper terminal 分表。每helper调用恰一个terminal；preabort/unsupported/stale-before无getData；已发请求后来失败仍保留已发记录；resolve与lateIgnored不得各算一个请求。保存/refresh/HMAC/timeout与chartData分开。产品最终计数语义仍交下一产品Design，不修改旧ledger/Goal/AC。

当前只完成本稿/Cases及绑定SHA/结构自检，RED/GREEN/独立Review均未运行。下一步独立review本新工程第1/3轮，修订冻结后给RED bootstrap和Builder精确admission；实现只在允许模块，独立Validation检查真实模块seam及完整diff。SFC/Store publication、双host、权限、保存重开和完整Goal继续pending。
