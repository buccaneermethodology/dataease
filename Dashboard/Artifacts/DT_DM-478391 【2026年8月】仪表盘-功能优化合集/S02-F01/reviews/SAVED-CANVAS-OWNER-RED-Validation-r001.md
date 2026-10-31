# Saved Canvas Owner RED r001 独立 Validation

Verdict：`NOT_ACCEPTED_AS_TRUSTED_RED / NEEDS_RUNNER_REPAIR`。

独立重跑得到预期表面计数，但runner没有执行合同规定的同一case解释路径，且冻结的GREEN解释器存在确定错误。不得据此发放helper源码实现准入。

## Read manifest与实际重跑

Card canonical SHA256 `47e888edbe3d814fe4bded3208dab721a5cc7644838a48b50074b1bfbe8849c3` validate/render通过，Context validate通过，Context原文摘要匹配card绑定；15项required-read摘要入口和收尾无漂移。已读取runner全文件、r004 fixtures、r003合同、原stdout/stderr/exitcode和identity manifest。精确source路径当前不存在。

独立命令：在 `core/core-frontend` 执行 `node tests/filter-copy-query-saved-canvas-owner/saved-canvas-owner.test.mjs --mode red`。实际Node v24.21.0、esbuild0.25.12；exit=1，stderr为空，setup_status=ok，40个behavior_mismatch、0个execution_error、0个static_case，case ID顺序与fixture一致，各一次。解析后的完整输出与原stdout完全相同。没有执行GREEN或创建型回归。

重新计算并匹配durable manifest：

- runner SHA256：`be6f662f038b008f7969603c7f7808656fa4f10200dd1f5bf9dcb23da89489fe`
- fixture SHA256：`f209c9552d2807e628c8334d5e2164114837ec9af2a4592b1332d89715d9a822`
- contract SHA256：`268225f040bc1062e9e62dc071bcd43fa75542c6943300e5f49fd07fc0926d82`

这说明原输出可复现，不说明它已满足语义RED合同。

## Findings

### SCRED-01 / 高：RED绕过冻结对象图/步骤解释器，且把终态错误误当首步预期

runRed单独遍历ID，每次构造getter恒为null的stub factory，只调用begin；没有解析各例context/ref或复用runCase。expectedBeginSuccess以item.expected.error/reason是否存在判断，例如018/030的预期错误来自后续validate，首步begin实际上应成功。当前UNIMPLEMENTED不等于任何错误，所以机械凑出40个mismatch；这不是对每例第一步的正确行为预期比较。RED没有机会暴露下述解释器错误，却声称setup成功。

最小修复：共用对象图/context/step解释路径，建立首步begin明确预期，首个行为不符后仅终止当前case；执行错误单列。不得直接以末态error充当首步error，也不能用恒null context替代fixture。

### SCRED-02 / 高：冻结解释器ref与mutation DSL不兼容，GREEN无法正常执行

runCase将item.objects拷贝后直接传resolveValue；resolveRef从该对象开始遍历descriptor.ref的`objects.r`第一段，访问value.objects会得到undefined。正常fixture真实引用因此不能解析。当前RED跳过它所以没有暴露。

mutateArrayItem又解构`{array,index,value}`，而冻结fixture使用`replacement`；它把已有`array:{ref:...}`再包装为`{ref:array}`，不满足ref必须字符串。removeArrayItem相同二次包装错误。这些是确定DSL执行错误，不是helper行为失败。

最小修复：明确resolver的根为{objects}或严格剥离objects前缀，保留实际数组项身份；按fixture的array descriptor/replacement原样解析；用只读preflight验证全部引用及mutation结构。修复后runner bytes改变，旧RED身份必须作废并重新取得新的可信RED。

### SCRED-03 / 高：GREEN断言及创建回归未满足已审合同

runGreen没有执行冻结创建回归命令。runCase只在末尾比较汇总字段，未逐步核对完整返回shape；source_read/paste_commit、authorization_claim等直接置常量。第二错误统一从第二次begin读取，SCPO2-021第二次register错误将得到undefined。040的generation从当前owner终态取0，而外来owner validateRegistration预期generation=null。context-preserved检查只记录runner patch后快照，不能证明每次helper调用未修改初始context。

最小修复：按合同逐API保存并断言触发回执和终态观察，错误/代次取正确结果；实现静态排除检查而非布尔常量自证；GREEN加入真实创建回归命令及依赖摘要核验。冻结runner必须确实具备合同要求的GREEN路径，不能到实现后再悄悄改runner。

## Builder repair与声明边界

先仅准入runner修复，保持fixture/contract及source absent；修复后重新独立验证RED并冻结新身份。不要写helper源码或为了让runner通过修改40例。当前证据可保留为“原RED命令可复现但语义不合格”的历史记录，不改写原始stdout/identity。

完整Goal分母10/26/16、Scope Delta none、S01独立，真实权限 `BLOCKED / NOT_RUN`、QPC产品接线 `NOT_READY_FOR_PRODUCT_UI_STORE`保持。未运行GREEN、未写runner/source/fixture；仅写本报告。不声明产品或helper通过。
