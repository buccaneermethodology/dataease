# 候选图表查询工程设计独立审查 r001

## 三项裁定

- **Design Freeze：`NEEDS_REVISION`（需修订）。** 候选 Symbol registry 与复用真实请求链的方向可实现，但全局取消真实 refresh 后，候选等待可能永久不结算；28 Cases 还有若干未固定的子案/兼容 oracle，不能直接作为完整冻结输入。
- **stub + runner RED bootstrap：`CONDITIONAL_ENTRY`（有条件入口）。** 可准备只读模块装载/编译诊断；正式 stub/runner 写入前须修订下述问题、冻结合法 stub sentinel 与 Cases，并取得其精确 Card/Context/admission。不得以缺模块、loader失败或未发请求的 fixture 超时冒充 RED。
- **生产 Builder：`NOT_READY`（尚未就绪）。** 当前没有正式可信 RED 和独立 RED Validation，也没有本实现对应的精确生产 admission。本 Review 不授予生产写入。

本交付物为第 **1/3** 轮独立审查，不重开旧产品/事务 r003。完整 10 Goal AC / 26 must-have / 16 产品义务与先 MVP 顺序保持；真实权限仍 BLOCKED/NOT_RUN。下面已列本轮全部发现，未在首个 blocker 停止。

## 独立性、输入与复验

Reviewer/source：`/root/g2_closeout_reviewer`，非本 Design/Builder 作者；本轮只写本报告。完整读取[Design](../ChartQueryCandidateDesign-r001.md)、[28 Cases](../ChartQueryCandidateCases-r001.json)、原始 Goal/授权/Trace、真实 api/chart.ts、request wrapper、service/refresh/hmac/HmacTool/CalculateFields 及相关 caller，并扩读 api/login.ts、request Store、已安装 Axios 的 merge/dispatch/CancelToken。

Card canonical `c603b7f43ffbf1c7574108e540dba194db7219c6f023534c03d2f3ee4150b174` 验证 pass；Context `efff74f83fa13a3d1d3bf77bf86db5242767d83c191b42ef812021421d91ced2` 验证退出 0，21 项 required-read 摘要匹配；Cases 全部 source_binding 当前也匹配。

| 输入 | 重算 SHA-256 |
|---|---|
| Design r001 | `f2569debee0f405c00846ffcbd09db05bbd8029c3f4fa416074a8ec62fb2293c` |
| Cases r001 原字节 | `8012f5be64908369282a0e1fe5ed83c5c02ba82056ca073ed616d067ac0cd852` |
| fixtures/cases/terminal_rule canonical | `63b4556d64da823395213d1a4c8b433d1bb77300de4bda9381d6ac8ff61b78e4`，与声明一致 |

## 全部阻断发现

### QCCD-001 / P1 / OPEN：global cancel 取消 refresh 后，等待中的候选没有可结算路径

**证据链：** [api/login.ts:46](../../../../../core/core-frontend/src/api/login.ts#L46)经真实 request.get 发 `/login/refresh`，service 将它登记进 legacy cancelMap。Design 要求 cancelAll 保留原循环，因此它也会取消已发 refresh。[refresh.ts:61](../../../../../core/core-frontend/src/config/axios/refresh.ts#L61)的 refresh rejection 只进入 73–78 行 console/finally，**不调用 delayExecute，也不 resolve/reject 80–85 行缓存的 retry Promise**。全局取消不会使 caller signal 自动 abort。

Design 第 66/76 行只规定令 token 失效、等原 auth Promise 释放、await 返回后再检查；在这个真实路径里 await 可以永不返回。QCC-024 所述“释放 auth/signing 等待”不能直接用迟到 adapter success补救：真实 Axios 对已经取消的 refresh 会产生取消 rejection，而不是成功进入 delayExecute。候选 registry 即使删除，也不等于 helper 已获得唯一 aborted terminal。

独立内存诊断转换并运行**完整真实 refresh.ts 的 configHandler**，cache/request/user/isLink为具名 fixture 边界，refreshApi 的 Promise 用已安装真实 Axios CancelToken拒绝。20 次 microtask 后实际为：`refreshCanceled=true`、`retryState=pending`、`cachedCallbacks=1`、`de-global-refresh=false`。这只验证真实 refresh 失败出口，不是全 service RED、HTTP或权限验收。

**需完成：** 明确候选等待可被自己的取消通道结算，例如在 service 中对 auth/signing 等待与候选 CancelToken通知竞速，取消后立即/明确有限步骤 reject真实取消原因，原 Promise 两出口继续被消费且迟到不 dispatch；这不等于物理中断 refresh。如果选择修复 refresh 队列失败释放，应显式扩大允许写范围并独立约束 legacy兼容，不能暗中改 refresh.ts。QCC-024须保留真实 cancelAll 对 refresh 的取消，验证 auth retry不释放时仍有 aborted terminal、chartData dispatch=0、owner/listener清理；补 refresh普通失败与迟到释放的精确结果。不能用假 configHandler/手工调用缓存callback绕过该问题。

### QCCD-002 / P2 / OPEN：部分表驱动/兼容案例还不能独立给出唯一 oracle

本轮读完 QCC-001..028。多数单路径的状态意图清楚，但以下执行输入和结果仍由未来 runner 作者猜测：

| 案例 | 必须冻结的缺项 |
|---|---|
| 011、019、026、027 | 明确每个子案的实际 payload/path/value、终态及 getData/adapter/registry 计数。例如019写 `plugin=true`，fixture实际是 `isPlugin=false`；应明确改 isPlugin 或真实嵌套 plugin.isPlugin，不用不产生效力的任意属性。011明确 undefined/null/非数组分别位于 query result.data 还是 data.data。 |
| 020、023 | `legacy: existing behavior`与`variants: 各对应单一terminal`不是可独立比较的具体预期。固定 legacy正常返回/取消/413/403等被承诺保留的实际resolve/reject值；023逐variant列状态、reason、outcome.error/response字段、主错误ref、owner/listener终态和迟到步骤。不要把当前被测输出当自己的expected。 |
| 024、025 | 给出实际 fixture cache token/exp/time/refresh标志、link/embed互斥输入、签名key与可控时间、各网络路由deferred阶段及逐类dispatch数。`auth_cache="fixture values only"`不能唯一决定是否进入真实configHandler等待。025冻结待比较headers/签名规则，不只检查Authorization存在。 |
| 当前明确承诺但尚无具体反例 | 将request interceptor在登记后、auth/signing等待中的失败清理；重复 requestId的不同Symbol隔离；候选缺合法signal；误带marker的非chart请求保持legacy，纳入具名子案并固定实际错误/计数。这些均是当前Design显式行为，不是未来硬化范围。 |

保持28个主ID也可以，通过显式 subcases 固定；每个逻辑request的terminal单独记账，014/022的多请求不能以顶层`terminal_count=1`当全case总数。现有terminal_rule已说明per-request，应在runner数据中落实。运行时 observations 空槽可以保留，不能把未固定的oracle也留给运行时生成。

## bootstrap的非阻断提示

**QCCD-N001 / NON_BLOCKING_FOR_DESIGN_DIRECTION：** 第99行的“同API stub返回failed/not-implemented”尚未给出精确对象，而正式 outcome.reason union 没有`not-implemented`。bootstrap合同必须固定合法的status/reason/error sentinel和QCC-001的投影fingerprint，或明确只供bootstrap的类型边界，避免加`any`/改正式oracle追绿。同时规定stub没有发adapter时，所有相关用例应如何记录预期断言失败，不能等待一个根本没有发出的deferred直到timeout再称RED。可在修订/正式bootstrap Card中一次确定，不要求另造产品状态机。

## 已检查且无新增阻断的维度

| 检查域 | 结论与证据上限 |
|---|---|
| 正常Promise/状态与主因 | 真getData返回实际request.then链，独立clone可避免其delete data污染caller。每调用settleOnce、caller abort先结算、底层双出口消费、普通rejection优先于事后stale可实现。fulfilled后应按已写优先级current→business→shape→drill执行；50002不能因无data被错判empty。 |
| clone/response ownership | JSON snapshot再独立request clone、回包再deepClone，以及bundle内部chartData共享但不连active/fixture的边界清楚。没有复制编解码逻辑或偷偷调用calcData/Store。 |
| 独立Symbol registry | 同chart/requestId取消资源可用新Symbol隔离；pre-await登记、自己release/迟到幂等、稳定快照cancelAll、不读写legacy chartId key均可实现。cancelRequestBatch只旧map与global覆盖两map的语义区分正确。QCCD-001是等待结算缺口，不否定registry方向。 |
| 实际config对象链 | 当前configHandler实际修改/返回传入config；Axios会merge并在dispatch再toSafeFlatObject，不能把整个config对象引用当稳定owner身份。可用可传递的Symbol值/唯一CancelToken与局部entry闭包关联，并在返回配置/response/error.config路径重连；请求拦截器自身异常须用其局部entry清理，不能假定error一定有config。当前合同允许这样实现，不需另建Axios实例。 |
| 真实错误处理 | source的no-response/400已reject；413早return及403/网关/权限尾部会resolve undefined。candidate在完成既有UI/权限处理后定向保留原error是必要增量，不能只在尾部加一条而漏413。request fulfilled interceptor自身throw须由显式try/catch负责；注册在同一use里的onRejected不会自动捕获它自身的async throw。 |
| 主因与UI异常边界 | 现有handler可能在UI/cache/router步骤自身throw；实现/Validation应如实区分original transport error与handler新异常，不能宣称“尾部reject”覆盖了所有提前throw。此次没有把任意外部UI失败的额外强保证追加为blocker；若承诺保留每种原主因，须在QCCD-002的具体子案里明确其错误出口。 |
| real module seam | real axios/API/wrapper/service/refresh/hmac/HmacTool/CalculateFields + defaults.adapter deferred、fixture-only key/XHR及具名宿主doubles的路线可执行；AST只读registry观察可接受。缺feature应断言失败，缺模块/import/编译/未知export仍是execution_error。auth网络不能被fake service替代。 |
| HMAC/认证/headers | 原HMAC内部会吞部分签名加载错误，service并不因此获得鉴权通过；新工程应保持该实际路径。mobile/link优先embed/proxy/locale、version/linkToken/权限框等允许外溢已明确，不能称纯查询沙盒。 |
| cancelAll调用事实 | 实际唯一公共调用为QueryConditionConfiguration.vue:1878–1887的handleFastClick。cacheUtil清缓存没有取消调用；未把cancelAll函数名推断成登出事实。后续owner仍负责signal/isCurrent与身份失效。 |
| 权威与范围 | 新query工程与旧产品/事务r003交付物不同；没有修改SFC/Store/后端/SDK/权限规则，没有把permission headers fixture当真实权限。完整10/26/16及后续stage/保存重开保持。 |

## 未检查、残余与修复后准入

没有正式runner/stub/生产实现，未运行28-case RED/GREEN、浏览器/真实HTTP/数据库/权限/保存重开或整包构建。本轮只执行schema/digest/结构读取与上述refresh内存诊断；其余正常与拒绝路径尚无运行证据。已有service全局副作用、refresh失败遗留cached callback、HMAC吞错与旧legacy cancelMap不自动清理等事实，不被本报告重写成已修。

后续仍须实现并验证stage renderer/双host、query/Store原子发布、完整Copy/Paste、只读/撤权/组织隔离、S01相关回归及完整Goal，旧CFPI/CTPR/AM-09/G2OWN-027各保留其实际范围。无需重审已经冻结的LSC设计。

修复 QCCD-001 的候选取消等待合同，并按 QCCD-002固定可执行子案、QCCD-N001固定bootstrap sentinel后，预计可给有界Freeze与stub/runner-only准备入口；不要求新增架构或等待真实权限环境。随后精确admission→可import行为stub的全量RED→独立RED Validation→生产source admission→同identity GREEN/独立Validation。当前父Goal继续，权限缺口不得泛化为停止该非权限工程准备。
