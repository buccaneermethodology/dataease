# OBS policy 独立增量审查 r002

Reviewer：/root/s02_goal_review。仅写本报告。

## 双结论

- 012A–D策略及连续状态修订：PASS_WITH_BOUNDS。
- 全部冻结oracle：NOT_READY，剩余集中于013的状态矛盾与见证隔离，不涉及维护者政策重选。
- 产品接线：NOT_AUTHORIZED。

## 复验与已关闭项

接收端card canonical SHA256 7c6d0a2f9810f7aabd25af4fe2ca5ee85359b6439dc63d6efedd0bf9afe0116a validate通过；对应Context校验退出0；全部base_context_refs无摘要漂移。

实际核查Design r003（868e4e91d8c5117205f3a66c6bfd19163690c34a2e03a573b95f8feb45f75fde）及Fixtures r003（71e5d8450dc822fd02a9eb93b3ac268c67f7be26ac1253a142a9b9d7027abffd）。16例解引用，8对象canonical SHA全部匹配。012B/C/D input.state分别与012A expected.state完整深相等；optionValues完全移除。核对capturedIdentity含epoch、两个raw身份标签、designRevision、tokenGeneration、runtimeGeneration=2、requestId=3与selectedValue=C；生产仍须真实raw引用比较，不得相信标签/布尔值作授权。

012A总请求数2、loading保持true、不接受首次options；B/C/D总请求数仍2、settled=2、loading=false、过滤查询/刷新均0。含C有效，缺C无效但保C，失败未核实且保旧options；root/carrier保护与无自动重试规则保留。旧数量/待维护者政策描述已修正。上轮QOBS-DELTA-01和03关闭，02的身份定义部分关闭。

## 仅余两项局部修订

1. **013内部运行值冲突。** 解引用后input及expected的root[0].propValue[0].selectValue仍为C、mapValue仍为[C]（复用了7ac179…对象），而selection.value/display均为D。该fixture声称用户已改选D，却把实际查询runtime留在C，不能作为完整一致的改选后状态。请生成完整D runtime根（仅运行select/map按现有规则变化，保design/default），输入/expected共享其内容身份但运行时深隔离；保留旧响应完整no-op。此处无需改变产品政策。

2. **013仍由requestId不匹配掩盖新增runtime门控。** 当前同时把latestRequest设4、旧请求设3，因此仅检查requestId的错误实现也会通过013，不能验证本次明确要求的“同raw/同design、用户再次选择”的runtimeGeneration/选值保护。保留现有“新请求loading不被旧finally关闭”场景，再补同latestRequest=3、raw/design/token未变而runtimeGeneration及选值变D的负见证，冻结旧then及finally零写入；或将013拆为这两个变体。不得以identityStillMatches=false或thenAndFinallyMustBeNoOps=true替代根据捕获/当前状态比较。这里是补足原缺口的反例，不是扩大到全异步框架。

现有013输入与expected确实完整相同，loading=true、请求3次、settled1次、所有写入计数保持；但这是新请求已启动分支的静态候选结果，并非实际then/finally已经执行。

## 边界与下一步

修复上述013两点后只需增量复核，不重开012A–D，不再次询问维护者，不扩展全域设计。该设计可作为后续纯模型API合同的输入，尚不能宣布全部oracle冻结或产品运行通过。

未运行Vue/Promise/Store/网络/权限。S01 Entry Packet、真实权限隔离环境、可信RED、独立预审、精确target-bound admission全部保留；真实权限BLOCKED / NOT_RUN；10项Goal AC、26项义务和16项产品义务不减少。本报告不授权任何产品接线target。
