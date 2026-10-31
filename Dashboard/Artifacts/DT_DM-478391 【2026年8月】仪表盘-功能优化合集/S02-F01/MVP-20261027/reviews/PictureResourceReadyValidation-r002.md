# 图片资源准备第二轮独立验证

- reviewed_at：2026-10-29T06:49:13.287432+00:00。
- Session：DE-EXEC-S038；snapshot_id：S02-MVP-PICTURE-RESOURCE-READY-VALIDATION-r002。
- as_of_state：卡064dd51142352e9ec5c5e48a7d2d6d7c1cf1fc04338de547d90094c8d89855f8；SFC 077c69a92610691ab4d1bfb8b088b942a8c7d93d65a5cc46604df860f9901ea0；runner r004 8fbf791a9da338f00f11f9cf48b2b692c05b8f539afa49705c0152f7758d7df2。
- 本交付物Validation第2/3轮；原设计评审不重开。
- 总verdict：REQUEST_CHANGES（测试RED执行仍有一个阻断）。代码有界正确性：PASS_WITH_LIMITATIONS（当前局部源码静态审查与37个当前宿主实例通过，未发现确定生产缺陷）。覆盖充分性：FAIL_EXECUTION（当前GREEN覆盖已补齐，但r004 baseline有未处理异常，不能授予干净可信RED）。真实UI/真实权限：NOT_RUN。

本轮只写报告，没有修改源码、测试、旧冻结资产或Goal。38项义务与49类型分母不变；局部代码结论不代表MVP/Goal、真实浏览器、真实权限或最终closeout通过。

## 复验输入与实际执行

lane_task_card.py validate --expected-card-sha256返回exit0/pass。另逐个重算Goal及全部14个base_context_refs，15/15摘要匹配。读取新卡、首轮报告、Cases r002、Handoff r002、Freeze r004、完整r004 runner、TraceabilityErrata及BDD可读卡；生产SFC/cache/helper与首轮摘要一致，复用首轮完整局部diff、静态审查及旧picture4/paste20/lint通过证据，不重复无关Goal审计。

独立执行命令（core/core-frontend）：

| 命令 | 实测结果 |
| --- | --- |
| node tests/filter-copy-mvp-picture/check-resource-ready-r004.mjs --baseline | exit1；JSON为19 PASS / 18 FAIL，37实例、16 ID；JSON与持久RED日志一致；**stderr另有未处理TEST_FINAL_DECODE异常，execution_ok不成立** |
| node tests/filter-copy-mvp-picture/check-resource-ready-r004.mjs | exit0；37 PASS / 0 FAIL，37实例、16 ID；JSON与持久GREEN日志一致；stderr为空 |

额外定向复跑baseline的stderr核查，确认异常可重复。没有将此异常当作业务RED。业务失败指纹仍可独立观察：PIC-RR-PENDING-PLACEHOLDER-READY、PIC-RR-FINAL-URL-NOT-RESOLVED、PIC-RR-INVALID-READY、PIC-RR-REBUILT-PLACEHOLDER-READY等；但不能用这些指纹掩盖同次进程的执行异常。

## 本轮全部发现

### R2-F1（阻断，测试执行）：baseline的最终decode拒绝存在未消费Promise

位置：check-resource-ready-r004.mjs约452-465行的finalDecodeFixture与540-542行“real cache final candidate decode rejects”。cache模式decodeHook第一次返回image.decodeTask.promise，其后才返回finalDecode.promise；旧SFC没有生产helper等待，旧候选只进行第一次decode。baseline分支又跳过finalCalls===2的断言。因此该用例执行finalDecode.reject(Error('TEST_FINAL_DECODE'))时，旧SFC从未消费这个Promise，Node在输出结果JSON后以未处理拒绝终止。

实际stderr摘要：

```text
check-resource-ready-r004.mjs:541
Error: TEST_FINAL_DECODE
at ...:541:77
at async check (...:399:6)
Node.js v24.21.0
```

影响：r004 baseline exit1同时含业务断言失败与宿主执行异常；不能标记为execution_ok的可信RED。同字节GREEN 37通过仍是有效当前行为证据，首轮r002的可信RED历史不被改写；本轮r004完整RED门尚未通过。

建议：仅在测试准备版本对可能未被生产路径消费的deferred拒绝作显式观测，确保当前SFC最终decode仍真实消费并能拒绝，不吞掉被测错误、不禁用进程未处理拒绝检查、不把process异常转换成PASS。冻结新runner，同字节对旧/新SFC重跑；旧SFC应靠预期业务断言exit1、stderr无未处理异常，当前应exit0。无需为此修改生产代码。

### R2-N1（非阻断，断言隔离）

src changes during decode目前同时修改src并把complete=false/naturalWidth=0。它证明组合失效会拒绝，但无法单凭此例区分src身份检查与尺寸检查的贡献；当前生产源码明确检查src，且其他实例覆盖对象/源变化，因此不据此新增产品阻断。可在同一测试准备修正中将尺寸保持有效，单独观测src身份变化的拒绝，以提高回归定位力。

没有发现需修改生产SFC/cache/helper的确定代码缺陷。未提出冻结合同外的缓存重构或身份机制要求。

## 首轮F1–F4处置核对

### F1：冻结调度逐项核对

| ID | 当前r004实际执行及见证 | 裁决 |
| --- | --- | --- |
| 01 | helper before hook先load/decode占位，再进入productionWait；beforeScan已断言，仍pending | 已补齐 |
| 02 | success before/after scan；before hook内完成资源并assert DOM旧src与新转换不等；after hook在资源门开前触发最终load并记录gateObserved；另有src新代独立pending断言 | 已补齐 |
| 03 | failure before/after scan；扫描前同样有转换与DOM不等见证，两分支拒绝 | 已补齐 |
| 04 | 非image Blob拒绝，共通副作用和finish清理 | 已执行 |
| 05 | 已失败cache再次准备，requests仍1；再次候选拒绝 | 已执行 |
| 06 | helper期间unmount/late；成功handle重复dispose与unmount，重复load后settle仍1 | 已补齐 |
| 07 | helper及最终decode期间分别isCurrent=false | 已补齐 |
| 08 | load deferred总timeout、late成功无src、timer不dispatch仍按deadline拒绝、decode在9999通过/10000拒绝、多资源阶段6000+3000+1000共享原timer | 已补齐 |
| 09 | 明确outsideRoot/outsideImage持有不同占位失败entry，当前root成功 | 已补齐 |
| 10 | data最终decode deferred前pending、resolve后ready | 已执行 |
| 11 | external及relative最终decode；src绝对化与getAttribute不同的断言；external error拒绝 | 已补齐 |
| 12 | empty合法成功、无img、requests0 | 已执行 |
| 13 | OFF非queried metadata，所有用例共通零query/write | 已执行 |
| 14 | data decode reject、cache最终candidate decode reject | 当前GREEN通过；baseline后者触发R2-F1 |
| 15 | clear before scan、barriers间clear/recreate均重新稳定真实URL；final decode明确进入2次、done=false后clear并拒绝 | 已补齐 |
| 16 | source变化/helper、src变化/decode、image/root各自断连、image/root各自替换但仍连接 | 已补齐；R2-N1为非阻断建议 |

上述覆盖裁决来自全文调用链与当前37实例实际执行，不按用例名称或目录自动记通过。当前冻结schedule没有剩余NOT_RUN；baseline宿主执行异常仍单独阻断RED门。

### F2：图片宿主与真实生产边界

patchProp对每个src变化重置complete=false、naturalWidth=0并创建新的deferred decode，记录generations及srcWrites。新增例先解码旧占位，再换真实URL，assert旧/新decodeTask不同、complete=false、width0、done=false，之后才驱动最终图片完成。finalDecodeFixture(cache)在当前SFC严格assert finalCalls===2，覆盖helper decode与最终candidate decode；PIC15清理发生在明确pending的最终decode阶段。首轮“旧占位完成状态被真实src复用”的误掩机制已修复。

资源helper通过薄before/after hook包装，但内部始终await productionWait(root)，实际cache-core模块仍解析生产resourceImageCache.ts；SFC只追加__testState/__testSetImage/__testSetRoot访问口，不替换业务函数。state/ref失效注入用于冻结场景。imgUrlTrans/identity/network/FileReader/DOM/decode仍是已标明替身；不会将其升级为真实authenticatedImageUrl/权限动态证据。

### F3：共通oracle与时钟

每个case的cleanup在主动handle.dispose/unmount之前，对已settled候选核listeners全空、timers0、srcWrites总数与settle时快照相等；统一noSideEffects核writes0和queries0。卸载后再次核listeners、settlements1、timers0；signal检查把本case显式clear导致的预期abort从候选自行abort中区分。case主动clear不构成候选取消共享请求，dispose/unmount不会主动abort的当前测试均通过。

performance.now与setTimeout同clock；9999/10000不dispatch timer可独立检测deadline，跨两个helper阶段推进6000/3000后assert唯一timer仍是began+10000，最后1000完成decode应拒绝。晚到src采用累计写入历史计数，能够发现写后恢复。首轮相关缺口已补齐。原生Promise自身只settle一次，settlements计数观测的是外部可见结果；结合finish静态settled guard，不将该计数夸大为内部resolve调用次数的仪表证明。

### F4：追溯Errata与BDD

新卡AC引用为06/08/12；Errata明确旧MVP-UI-10-PICTURE不等于TTL AC10、TTL仍pending、authority与原分母不变。BDD投影覆盖16个case并标本地宿主与真实UI边界。历史冻结输入未重写，摘要匹配；F4关闭。

## 已查无问题、未查与后续准入

已查无新确定问题：生产代码与首轮完全同摘要；稳定化循环、source/root/image对象与connected冻结、原属性比较、current/deadline、decode前后复验、settled清理逻辑静态证据继续有效。37个当前宿主行为实例均通过，共通零写、finish清理及候选取消不abort共享请求已实际执行。

未查：真实浏览器120x80像素与文字、正常保存离开重开、真实身份转换及多用户权限、移动/嵌入/全49类型、Goal最终Dashboard/KB/closeout绑定，均NOT_RUN或由后续lane负责；不是本报告授予完成的证据。代码有界PASS_WITH_LIMITATIONS只针对此源码/宿主边界。

同类残余：所有“可创建但某一baseline分支不消费”的deferred reject均应在第三轮测试准备时检查一次，尤其helper与最终candidate共享decodeHook的路径；不得只隐藏stderr或吞整个case失败。其他首轮F1-F4无新增同类阻断。

准入预测：修复R2-F1并冻结同字节runner，baseline执行成功且仅因预期业务指纹exit1、current37实例exit0后，可在本交付物第3/3轮对RED/GREEN及必要测试差异做定向复验，无需重开原设计或改无缺陷生产源码。R2-N1是可同次补强的非阻断建议。即使局部最终通过，真实UI与完整Goal仍须继续执行。
