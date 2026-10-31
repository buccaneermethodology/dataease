# B API 实现独立验证 r001

## 裁定与允许的下游消费

本API实现交付的独立Validation第 **1/3轮**，Validator `/root/g2_closeout_reviewer`；审阅时点`2026-10-27T04:19:09Z`，snapshot `S02-MVP-SLICE-B-API-VALIDATION-r001`。这不是UI设计第2轮，不重置UI设计或旧交付物预算。

**实现有效性：`PASS_WITH_FINDINGS`（API模块有界通过，1项非阻断文档发现）。下游入口：可由独立准入的真实query prepare消费本API。** 新strict调用在真实原API与真实CalculateFields模块内有预期outcome，原单参数调用保留已有返回/编码/入参删除语义；没有发现当前模块的功能阻断。下游须用明确判别式`outcome.ok === true`，并处理Promise rejection；不能从DTO的code或fulfilled推断成功。具体query参数/operation失效与renderer候选仍需各自合同、admission和验证。

这里只证明绑定的API/解码器和网络测试桩边界。**不证明真实后端query、签名/刷新/取消/权限、任何图表候选ready/目标发布、保存重开或MVP通过。** 未启动产品、服务、DB、安装、构建或修复源码；本次唯一持久写入是本报告。

## 绑定与完整差异

[Card](../../planning/s02-mvp-slice-b-api-validation-r001-card.json) canonical SHA `72d692dafe3d5632136c848997ef9817442c682191f2e4e2892c543ea92f04f4` 接收端validate通过；[Context](../../planning/ContextBootstrap-S02-MVP-SLICE-B-API-VALIDATION-r001.json)字节SHA `bc44a91522b756e6120f89b1491b00281309158d0f5f5513858ca1f1eb296133`，14项required-read逐项重算一致，actual topology r429。已消费原用户范围、新canonical Goal、Design/Cases、独立UI入口Review、Builder证据、写前manifest和原API字节。源码A并行改Editor等不在本验证不变输入内。

| 实际交付/依赖 | SHA-256 / 状态 |
|---|---|
| [当前API](../../../../../../core/core-frontend/src/api/chart.ts) | `9f160c78f24bf50be80c9510529682267530dcc28d203478074af4add865c74b`；已跟踪、本次修改 |
| [完整原API字节](../baseline-source-r001/04-chart.ts) | `6dbe0684c95f0c2be625a7a0094db894a0d431f003c8d7613145279dc3f218a7`；只读写前保全 |
| [focused runner](../../../../../../core/core-frontend/tests/filter-copy-mvp-api/check.mjs) | `68dbed66d3e09a25c21efda154f091760a5c9118ea1f4034153c356ccf10091e`；未跟踪新增文件，已全文检查，未因git diff遗漏 |
| [README](../../../../../../core/core-frontend/tests/filter-copy-mvp-api/README.md) | `e9fb4406e484f109fea33e6c5a6614a06a71cfbf0c6de7fcf94be563224acabb`；未跟踪新增文件，已全文检查 |
| [Builder证据](../evidence/SliceBApiOutcome-r001.md) | `6c9f20ca5a32fe9c39084f27d46a47c53c4cb2deeeee67acd77aa1f9e369613d`；只作待复验声明，不冒充本独立结论 |
| [真实解码模块](../../../../../../core/core-frontend/src/utils/CalculateFields.ts) | `9cf388d58faf8aa39ee33b6ac8f0c2ac4a81a752c5d77924d9338f9176e44d8c`；本次未改 |

逐字节API diff相对写前保全和当前git diff一致，只增加options/outcome类型、两个overload、strict分支clone后删data、解码完成后的outcome包装；其它API、stock-line逻辑、解码调用序列均未改。未把A、旧query/G2工程或全工作树差异归入B。Builder授权4文件（API、runner、README、其证据）已全部读取检查；测试新文件不能仅依git diff判断不存在。

## 独立执行与可信 RED

已先阅读全文runner，确认它只读源码并stdout输出，不生成结果文件。随后独立执行：

```sh
node core/core-frontend/tests/filter-copy-mvp-api/check.mjs --mode green
node core/core-frontend/tests/filter-copy-mvp-api/check.mjs --mode red --api-source 'Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/MVP-20261027/baseline-source-r001/04-chart.ts'
```

| 重放 | 全部执行 | PASS | 断言失败 | 执行错误 | 子进程exit |
|---|---:|---:|---:|---:|---:|
| 当前API GREEN | 9 | 9 | 0 | 0 | 0 |
| 原字节API RED | 9 | 3 | 6 | 0 | 1 |

两个重放的runner SHA相同，9个id/name索引`case_identity_sha256=03dae6ee7ff5ba276212f25c86686771610eab9b7cb4150b3a9c271c71e14727`；索引摘要本身不证明输入/断言未变，完整runner原字节绑定另行覆盖它们。RED首fingerprint为API-001 `expected.ok=true / actual.ok=undefined`；API-002/004/005/009同样缺strict outcome，API-003真实原函数删除调用方data导致完整入参断言失败。API-006/007/008保留兼容分支通过。这是同一runner完整实际旧源下的语义RED，非缺module/编译/loader错误；RED的非零exit是预期断言失败。

实际内存编译字节也与Builder声明相符：current API `a49c4367801e4576706410c89bd398ce8a5da575f21262ff7133404e891e2777`，baseline API `e878af96286e669b1004d47caf1c2d2582dd7a45e72f3e29b6c4058a6ec6e952`，decoder `a92d2966881450d9af704c385a08cd00ce079099f278bd594a15fa5fa743b358`。未反向覆盖工作区API来造RED。

runner加载的是整个实际chart.ts和整个CalculateFields.ts，经esbuild内存转换、每例独立VM/moduleCache执行；lodash-es、js-base64是真实已安装库，解码导出只透明记录调用后调用真实函数。request.post是明确网络envelope/reject测试桩；其它非本模块UI依赖仅阻断意外调用。未知模块或非预期异常分类EXECUTION_ERROR，不因assertOriginalRejection而伪装PASS/业务RED；当前两轮确为0执行错误。Builder早先loader诊断失败未复现或充当RED，本验证仅认可上述最后相同runner的重放。

## 九例逐项及已查无问题维度

| Case | 独立确认 |
|---|---|
| API-001 | code为数值0后完成全部真实解码才ok=true，value保原DTO引用；request仅1次、clone去data、字段名真实Base64编码、完整两条件传递，调用方对象不变。 |
| API-002 | fulfilled的50002为ok=false，保原envelope引用/code/msg及原错误解码；strict调用方不变。 |
| API-003 | strict的原Error引用reject不替换，不删调用方data，request1次。 |
| API-004 | stock-line仅请求副本xAxis降序，调用方仍asc且完整不变；真实成功解码相同。 |
| API-005 | 字符串"0"不当数值0成功，模块fulfilled边界返回failure并走原错误解码。实际axios对此类code如何reject属另层，未当真实服务通过。 |
| API-006 | 原默认成功返回原DTO，不加ok包装，仍删除原调用方data；请求排序与所有既有解码不变。 |
| API-007 | 原默认fulfilled业务失败返回原envelope，无ok包装，保原delete和错误解码。 |
| API-008 | 默认网络异常原引用reject，保原输入data删除副作用。 |
| API-009 | 外层code=0、DTO内部code=50002且数据为空仍按外层成功，value原引用；不从DTO自身code猜结果。 |

成功路径6次透明decoder调用、失败路径5次，与原函数顺序相符；已检查各axis、data.fields/sourceFields及left/right.fields真实转换结果。API类型保留单参数`Promise<IResponse>`重载，strict泛型返回`Promise<ChartDataOutcome<T>>`；没有扩大整个API返回any或关闭类型检查。真实五个getData产品调用方为G2Plot、S2、indicator、rich-text、picture-group，均单参数；import/alias搜索未见旧调用意外传第二参数或map回调复用。其它同名getData属于浏览器剪贴板/局部函数，与此API无关。

另独立运行前端目录定向ESLint（src/api/chart.ts及runner），exit0无诊断；`git diff --check -- core/core-frontend/src/api/chart.ts` exit0。使用已安装TypeScript、实际tsconfig/declaration roots建立noEmit Program，API自身语法+语义诊断0；内存虚拟调用检查默认返回、strict泛型和显式判别式均可通过。该虚拟文件未写入工作区，不是全项目ts:check；README普通布尔分支发现见下节。

## 全部发现

### BAPI-V001 / P3 / OPEN / NON_BLOCKING：README示例的false分支在当前TS配置不收窄

README使用`if (outcome.ok) ... else outcome.error`；当前tsconfig的strictNullChecks=false。独立使用同项目编译选项的内存虚拟消费模块复现TS2339：`Property 'error' does not exist on type 'ChartDataOutcome<Dto>'`，只在该else访问处报错；API自身和同文件`if (outcome.ok === true) ... else outcome.error`均无此诊断。

**影响/建议：** 这是下游可复制示例不兼容，非运行态outcome错误或现有五个单参数调用回归。README改用`outcome.ok === true`（或`=== false`）明确判别，未来queryprepare沿此写法即可；无需为此修改全项目strictNullChecks、生产API或再做框架设计。Validator未替Builder修文档。本项不阻当前API被下游消费；后续修订保留这份历史绑定。

本轮未发现其它当前API阻断或需修源码的问题。未把当前合同外异常输入、通用鉴权/取消框架或renderer问题增列本模块阻断。

## 限制、同类残余及下一步

网络测试桩刻意停在`@/config/axios`模块导出边界，未执行真实axios/service拦截器、HMAC、刷新重试、取消映射、后端DTO/权限或数据库。静态核对真实service会放行code0与50002，其它业务code可直接reject，所以下游应处理所有rejection，不能只处理network Error或以为所有失败都会包装为ok=false。string-zero测试是模块边界能力，不是完整网络链事实。

本测试两条件是用于检测传递完整性的模块fixture，不是RowAuth前传输golden；未覆盖产品serializer own-key/undefined、真实query独立SQL结果、49type request adapters、候选ready、Store发布/失败保旧、真实保存重开。它们继续按B wrapper/C/D和当前22项执行，不能用9/9提升为相应AC全部通过。未执行全工程构建或全项目TS检查；当前只读局部检查已足以支持本API增量的有界结论。

同类残余检查已覆盖默认成功/失败/reject三路、strict成功/失败/reject、stock-line与所有原解码位置、全部实际产品调用点、未跟踪测试交付和Builder宣称；唯一发现是相同布尔union在宽松TS配置下的README消费方式，未来消费时一并使用显式判别式。原实现无需修复；修正文档后预计无须重做API或增加测试轮。root可绑定本报告下发真实queryprepare的精确入口，继续实际参数/失效与C局部候选工作，不重复向人类索取相同授权、不提前发布目标状态。
