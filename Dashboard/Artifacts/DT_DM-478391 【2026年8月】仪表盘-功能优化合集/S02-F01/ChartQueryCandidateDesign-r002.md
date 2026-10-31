# 候选图表查询工程设计 r002

本稿为同一 query 工程第 **2/3 轮候选修订**，依据首轮报告 QCCD-001、QCCD-002 和 QCCD-N001 一次修齐。旧 r001、Review、源码、runner、Goal、SFC、Store/S01 均不改。普通 antv/line、同数据集无 drill 的支持边界保持；10 Goal AC / 26 must-have / 16 产品义务与权限 BLOCKED/NOT_RUN、后续双host/发布/保存重开继续保留。此稿不是冻结、可信RED、生产admission或产品验收。

Card canonical `ed2199a1bb658ea35e82648c2c9212790ff10e4e83a32286773fb384c93edf25` 接收端复验 pass；Context 校验 exit0、20个绑定摘要全部匹配。完整source_binding见Cases，含真实refresh/requestStore和已安装Axios CancelToken/merge/dispatch。唯一公开前端cancelAll调用事实仍为QueryConditionConfiguration.handleFastClick，不能推断登出已有取消接线。

## 原工程范围与内部API

仍只允许后续Builder修改 api/chart.ts、axios/index.ts/service.ts最小增量、新api/chart-query-candidate.ts和定向tests。**不修改 refresh.ts/login.ts/request Store**；真实认证、签名、language/link/embed/proxy/mobile、权限响应UI/cache/router原流程保留，不能另建axios或使用handleErrorLocally跳过。

```ts
type ChartDataRequestOptions =
  | { signal?: AbortSignal; cancelScope?: 'legacy' }
  | { signal: AbortSignal; cancelScope: 'candidate' }
getData(data, options?: ChartDataRequestOptions): Promise<IResponse>

interface PrepareChartQueryInput {
  requestId: string
  view: ChartObj
  signal: AbortSignal
  isCurrent: () => boolean
}
interface ChartQueryCandidateBundle {
  requestId: string
  viewSnapshot: ChartObj
  response: ChartObj
  chartData: ChartObj['data']
}
type ChartQueryCandidateOutcome =
  | { status: 'ready' | 'empty'; bundle: ChartQueryCandidateBundle; requestId: string }
  | { status: 'aborted' | 'stale'; requestId: string }
  | { status: 'failed'; requestId: string;
      reason: 'unsupported' | 'input' | 'query' | 'business' | 'response' | 'current-check';
      error?: unknown; response?: unknown }
prepareChartQueryCandidate(input: PrepareChartQueryInput): Promise<ChartQueryCandidateOutcome>
```

r002把requestId统一置于所有结果顶层，bundle同时携带；不靠requestId唯一性管理取消资源。输入view先JSON往返snapshot，再deepClone为getData request副本；getData原有delete/data编码不污染snapshot。fulfilled结果deepClone为bundle.response，chartData只在该bundle内部共享response.data。无active、Store、emitter、callback、dirty/snapshot、lastRequest、SFC error/loading导入或写入。

支持render==='antv'、type==='line'、tableId非空；isPlugin===true或plugin.isPlugin===true、drill===true、drillFilters非空、chartExtRequest.drill非空均unsupported。缺合法signal为input；signal需aborted boolean及add/removeEventListener函数，不依赖同realm instanceof。raw getData的candidate options缺合法signal直接reject TypeError('CHART_QUERY_CANDIDATE_SIGNAL_REQUIRED')，不进入request wrapper；helper则failed/input且getData调用0。

unsupported固定Error('CHART_QUERY_CANDIDATE_UNSUPPORTED')；response形状无效固定TypeError('CHART_QUERY_CANDIDATE_RESPONSE_INVALID')；序列化和predicate的原Error不包装。response.code存在且!==0为business并携独立response、不造error；既有interceptor已reject业务message则failed/query.error保留原字符串。fulfilled仅显式data.data数组可用，length0才empty。严格顺序为当前取消→isCurrent→business→shape→drill→ready/empty。ordinary rejection不被事后stale掩盖；取消用真实axios.isCancel，或isAxiosError&&code===ERR_CANCELED，名字相似的普通Error不算取消。

## QCCD-001：候选认证与签名等待的可取消竞速

现有真实refresh rejection不调用delayExecute，cached retry可永久pending。r002**不再以“等它返回再检查token”作为唯一取消路径**。只在candidate分支新增私有awaitCandidateStep(entry, upstream)，configHandler和securityConfig两个实际等待都必须使用它，legacy继续原await。

1. request fulfilled handler在auth/signing之前建立entry、CancelToken与cancel gate。gate由该真实token.subscribe(reason)通知reject，reason必须严格为entry.token.reason，不能以新Error替换。gate立即挂拒绝消费，避免subscribe同步通知时未处理拒绝。
2. awaitCandidateStep用真实Promise.race在Promise.resolve(upstream)与cancelGate间竞速；race从开始就给upstream两出口安装处理。cancel获胜必须在有界microtask内让request handler reject同一CanceledError，不等待upstream释放。返回成功后仍throwIfRequested/signal检查，防同拍竞争。
3. fulfilled request handler自己用局部entry的try/catch清理后rethrow；同一interceptors.use的onRejected不会捕获其自身async throw，不依赖它。configHandler调用本身的同步throw、securityConfig调用/Promise拒绝也在这层try/catch内。
4. **不能在cancelAll/abort调用后先unsubscribe gate导致通知丢失。** cancel函数先source.cancel产生token.reason，signal/map可先幂等释放；token-gate订阅必须保留到取消通知/race结束才解绑。正常response成功/错误清理也解除全部自有订阅。最终entry/token listener释放不等于第三方retry被释放。
5. gate获胜后upstream晚fulfilled/rejected只被已安装处理消费，不能恢复已退出的request continuation或dispatch。未取消的真实refresh晚成功可由其生产delayExecute自然释放retry，仍不发candidate chartData；绝不由runner手工调用cached callbacks。

QCC-024-real-refresh-global-cancel要求真实cancelAll取消/login/refresh（legacy key）与候选token。真实Axios的refresh取消rejection使retry保持pending、requestStore.cachedRequestList=1、de-global-refresh=false；caller signal仍未abort。候选必须在<=64次受控microtask内aborted、自己的registry和三类自有listener均0、chartData adapter0。迟到resolve已经取消的refresh adapter，真实Axios仍走取消rejection，不能假成功delayExecute。cached callback/原retry残余如实记为1/pending，不宣称所有资源零。

补ordinary refresh failure→retry仍pending→caller abort的子案，及候选独立abort后未取消的refresh真实晚成功的子案（自然delayExecute，cached callback归0）；签名路径用真实HMAC promise等待时排定cancelAll，覆盖同一race。签名/认证await中永不完成的Promise也不能阻止cancelGate退出，泛化waiter的实际代码可被只读seam直接观察。

## owner跨Axios配置链与全局取消

候选marker仍经getData→request wrapper→同一service；仅匹配chartData/getData+candidate的分支注册独立Map<symbol,entry>，不写legacy cancelMap。误带marker的非chart请求走原legacy逻辑。默认getData完全保留现有key/取消/response/error结果。

**不得以config对象引用作owner。** 在Axios已merge的request fulfilled handler里创建Symbol owner与唯一CancelToken；将owner值写到普通可枚举自有字符串字段__chartQueryCandidateOwner（值为Symbol），token写config.cancelToken。entry局部closure保存owner/token/release；map按owner登记。当前configHandler返回传入对象，但await后仍在返回config重接同一owner值与token。Axios mergeConfig对Symbol值、非plain CancelToken保留值/引用；dispatch的toSafeFlatObject产生新config对象时自有字段/同token仍应在。entry.cancel固定调用真实source.cancel("CHART_QUERY_CANDIDATE_CANCELED", latestOwnedConfig)，使取消reason携同一owner/token配置；response/error.config由owner字段定位，并验证entry.token===config.cancelToken后释放；迟到entry已不存在则no-op。request handler异常无config时仍由局部entry释放。测试断言merged/adapter/response/error处owner值和token相同，同时允许config对象!==；不拿对象恒等性自证。

candidate登记在auth/signing前。caller abort只取消自己token；cancelRequestBatch只遍历旧map，因此同chart live batch不动候选；cancelAll先保留旧循环，再对candidate registry稳定快照cancel，各entry取消/release幂等。相同requestId的A/B仍有不同Symbol/token，旧releaseA不能删除B。覆盖正常、business、transport、abort/global、登记后auth/signing抛错全部清理，三类自有listener明确分别为helper callerAbort、service signalAbort、service cancelGate订阅；Axios内部adapter监听和遗留refresh cached callback不混入这三个数字。

## 错误传播与legacy精确兼容

原handler UI/权限/cache/router/version/linkToken先照常执行；candidate在现有413早return及error handler尾部吞成undefined处定向reject原transport error。legacy保持原结果。UI handler自己throw新错误时，保留该实际新错误为helper failed/query（QCC-023-ui-new-error-cleanup），不夸称任何UI异常下都保留原transport主因。

raw legacy getData正常fulfilled=解码后的query result；403和413的service error handler fulfilled undefined，随后getData访问res.code会reject TypeError("Cannot read properties of undefined (reading 'code')")，不是原transport error。legacy batch取消则reject同config.cancelToken.reason，isCancel=true/code=ERR_CANCELED；既有cancelMap调用传函数作message，因此message类型function，不能改写成预想字符串。QCC-020给逐项完整oracle。

## QCCD-002：可直接执行的输入与计数

Cases保留28主ID，全部表驱动分支物化为具名subcase，实际数见main_case_count/subcase_count。fixture固定Date.now、UTC、token/exp/time/refresh flag、desktop/isLink/mobile、link优先embed、proxy/locale、basePath及fixture-only签名key。QCC-024用user.time=T-90001明确触发refresh；QCC-025的两条互斥header路径精确比较真实签名输入/base64和值，不只检查存在。

adapter拒绝的具名错误先附actual adapter config（response也附config/真实AxiosHeaders），保持原对象身份以模拟真实网络AxiosError；auth/sign/current/UI错误仍在其指定边界直接throw。每子案用base fixture+具体path/op/value，不用runtime输出补expected；undefined用omit，cycle/BigInt用明确构造operation。每个request按alias+owner记录helper_terminal_count/promise_settlements/getData调用，网络按chartData、login/refresh、其他adapter和bootstrap timeout/HMAC XHR分别计数。一个case可有多个helper terminal，不能顶层统一写1。response/lateIgnored不添请求。QCC-011/019/020/023/024/025/026/027均已具体化；补缺signal、非chart marker、同requestId、auth/sign异常和错误名假取消反例。

每子案fresh bundle在执行前初始化fixture，过程中不得重置cache/requestStore来抹掉残余。日志可输出fixture ID/计数/头名；不读取机器凭据。缺实际模块/loader/编译错误仍execution_error；expected只来自冻结r002。

## QCCD-N001：合法stub与无adapter RED

正式union不加not-implemented reason、不加any。bootstrap stub每次无条件返回：

```ts
const error = new Error('CHART_QUERY_CANDIDATE_NOT_IMPLEMENTED')
error.name = 'ChartQueryCandidateNotImplementedError'
return { status: 'failed', requestId: input.requestId, reason: 'query', error }
```

所有输入都同样返回这个合法failed/query；没有查询、listener、registry或production分支。QCC-001固定fingerprint：expected.status=ready；actual.status=failed、reason=query、error.name/message为上述sentinel。runner先观察helper outcome或adapter-enter；若sentinel先结算且adapter未发，立即记录status/adapter-count/bundle缺失断言失败，不等不存在的deferred、不timeout，也不改expected追绿。对缺bundle访问要形成断言，不能TypeError变execution_error。测试中的原legacy API仍走真实模块，可按各case独立观察；stub本身不含生产查询逻辑。

real-module seam仍用实际candidate/API/wrapper/service/refresh/hmac/HmacTool/CalculateFields及真实已安装Axios，只在真实service.defaults.adapter提供网络deferred，环境double为明确store/cache/router/UI/loading/locale/mobile/XHR/clock。内存AST只读追加registry和awaitCandidateStep观测export，实际控制流不复制；只能对明确命名的尚不存在candidate feature记断言失败，未知export/缺模块/import/编译问题不能伪装RED。

## handoff与准入

后续controller只把ready/empty bundle交独立renderer，仍须实际capture/current/权限重验；empty不是renderer/commit通过。controller负责目标/身份变化与卸载abort signal，helper不推导权限、不发布状态。原全局axios外溢不是可回滚沙盒。

先第2/3轮独立复核，冻结r002 identity后精确stub/runner-only admission→可信行为RED→独立RED Validation→生产source admission→同identity GREEN/独立Validation。此处未运行runner/浏览器/HTTP/数据库/权限/保存重开，不改旧Review verdict。父Goal继续。

Cases canonical identity：`d10c879c8baaa661c0fa79d09cd010b4bea2fe45fdaa02ddb0ed83ead78c1800`；主ID 28；具名子案 68。完整source SHA与输入/请求/计数在同名JSON。
