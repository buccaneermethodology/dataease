# B 切片：图表 API 严格 outcome 候选 r001

## 准入、改动与声明上限

接收端复验 Card canonical `7d2bf60b23ce04ce753518f1cffa278fc81f5a8576d404ac0f3900ef8aea391d`、Context 及4个精确target admission均退出0，12项required-read原字节摘要匹配。消费本轮独立 Review 对 B query/outcome 准备的 `PASS_WITH_BOUNDS`，只写已授权4文件：API chart.ts、focused runner、README、本证据。主控已有 API 写前保全 `baseline-source-r001/04-chart.ts`，原 SHA `6dbe0684c95f0c2be625a7a0094db894a0d431f003c8d7613145279dc3f218a7`，未改它或冻结资产。

实际 API 新增 `ChartDataOutcomeOptions`、`ChartDataOutcome<T>` 及 `getData<T>(data: object, {reportOutcome:true})` overload。结果为 `{ok:true,value:T}` 或 `{ok:false,error:IResponse<unknown>}`；实现沿原 `res.code===0` 分支完成既有全部解码后，返回原DTO引用；非0仍做既有失败解码，返回原envelope引用，保留code/msg。网络异常原样reject，没有catch替换或新增axios。

严格调用只克隆输入后删除 clone.data，stock-line仅在请求clone写降序，调用方全部输入及两个过滤条件不变。默认不传第二参数保留历史 `Promise<IResponse>` 签名、DTO/envelope返回、解码及原 `delete data.data` 顺序。没有修改其它API、wrapper、renderer、Editor、全局错误处理或权限来源，不发布目标状态。

以上是 Builder 实现/模块验证候选；不是独立Validation，不证明真实后端query、权限、候选ready、目标发布、保存重开或MVP完成。

## 实际 RED → GREEN

先在未改生产 API 时对真实getData传第二参数：旧默认三例通过，严格六例均因 ok 缺失/原入参data被删除而业务断言失败，**9例全执行、0执行错误、exit1**。首API-001实际为 `expected.ok=true; actual.ok=undefined`，不是缺模块或编译错误。

初次loader诊断曾返回错误CJS default对象，产生 `import_axios.default.post is not a function`（7 execution errors、2被assert.rejects包住的诊断断言）；没有当RED。随后纠正具名request seam，并让未知rejection原样上抛分类EXECUTION_ERROR，再得到上述有效业务RED。保留这段诊断事实，不以它证明合同违约。

runner定向格式化后，为绑定最终相同runner字节，使用只读 `--api-source` 对主控保全的完整写前API再次重放RED；随后默认加载当前真实API执行GREEN。两次最终runner SHA与案例身份一致；旧源码由主控保全文件读取，未反向改写工作区生产文件。

- 最终RED：9执行、3 PASS、6 ASSERTION_FAILURE、0 EXECUTION_ERROR、真实子进程exit1。
- 最终GREEN：9执行、9 PASS、0 ASSERTION_FAILURE、0 EXECUTION_ERROR、exit0。
- 真实 `CalculateFields.ts` 完整模块装载并执行，6次成功路径/5次业务失败路径透明调用记录、真实Base64变换及左右字段解码均验证。网络只stub原envelope/reject，未实际请求后端。
- `case_identity_sha256` 是9项id/name的索引摘要；整个runner原字节SHA另绑定所有具体输入/断言和控制流，不用索引摘要冒充完整测试代码身份。

```json
{
  "red": {
    "mode": "red",
    "tested_actual_api_source": true,
    "tested_actual_decoder_source": true,
    "network_envelopes_stubbed": true,
    "cases": 9,
    "passed": 3,
    "assertion_failures": 6,
    "execution_errors": 0,
    "api_sha256": "6dbe0684c95f0c2be625a7a0094db894a0d431f003c8d7613145279dc3f218a7",
    "api_compiled_sha256": "e878af96286e669b1004d47caf1c2d2582dd7a45e72f3e29b6c4058a6ec6e952",
    "decoder_sha256": "9cf388d58faf8aa39ee33b6ac8f0c2ac4a81a752c5d77924d9338f9176e44d8c",
    "decoder_compiled_sha256": "a92d2966881450d9af704c385a08cd00ce079099f278bd594a15fa5fa743b358",
    "runner_sha256": "68dbed66d3e09a25c21efda154f091760a5c9118ea1f4034153c356ccf10091e",
    "case_identity_sha256": "03dae6ee7ff5ba276212f25c86686771610eab9b7cb4150b3a9c271c71e14727",
    "backend_query_verified": false,
    "permission_verified": false,
    "UI_MVP_verified": false
  },
  "green": {
    "mode": "green",
    "tested_actual_api_source": true,
    "tested_actual_decoder_source": true,
    "network_envelopes_stubbed": true,
    "cases": 9,
    "passed": 9,
    "assertion_failures": 0,
    "execution_errors": 0,
    "api_sha256": "9f160c78f24bf50be80c9510529682267530dcc28d203478074af4add865c74b",
    "api_compiled_sha256": "a49c4367801e4576706410c89bd398ce8a5da575f21262ff7133404e891e2777",
    "decoder_sha256": "9cf388d58faf8aa39ee33b6ac8f0c2ac4a81a752c5d77924d9338f9176e44d8c",
    "decoder_compiled_sha256": "a92d2966881450d9af704c385a08cd00ce079099f278bd594a15fa5fa743b358",
    "runner_sha256": "68dbed66d3e09a25c21efda154f091760a5c9118ea1f4034153c356ccf10091e",
    "case_identity_sha256": "03dae6ee7ff5ba276212f25c86686771610eab9b7cb4150b3a9c271c71e14727",
    "backend_query_verified": false,
    "permission_verified": false,
    "UI_MVP_verified": false
  }
}
```

## 验证命令与结果

1. `node core/core-frontend/tests/filter-copy-mvp-api/check.mjs --mode green`：exit0，9/9。
2. `node core/core-frontend/tests/filter-copy-mvp-api/check.mjs --mode red --api-source 'Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/MVP-20261027/baseline-source-r001/04-chart.ts'`：exit1，6个真实语义断言失败，0执行错误。
3. 在前端目录 `./node_modules/.bin/eslint src/api/chart.ts tests/filter-copy-mvp-api/check.mjs`：exit0，无诊断。早先新runner有82条Prettier格式诊断，已只格式化本次新增runner并复验，未用lint --fix改其它文件。
4. 使用已安装TypeScript、当前tsconfig、当前项目declaration roots建立实际API Program，仅获取 `src/api/chart.ts` 的 syntactic + semantic diagnostics：**0**，进程exit0。它检查当前API源及重载，不声称全项目ts:check通过。
5. `git diff --check -- core/core-frontend/src/api/chart.ts`：exit0；diff仅上述getData重载/选项分支。未启动应用、安装依赖、操作DB、提交或推送。

原始成功GREEN逐例输出：

```jsonl
{"case":{"id":"API-001","name":"strict successful envelope returns original decoded DTO","status":"PASS"}}
{"case":{"id":"API-002","name":"strict fulfilled nonzero response is failure with original envelope","status":"PASS"}}
{"case":{"id":"API-003","name":"strict network rejection preserves original error and caller","status":"PASS"}}
{"case":{"id":"API-004","name":"strict stock-line sorts only request clone","status":"PASS"}}
{"case":{"id":"API-005","name":"strict string zero is not numeric envelope success","status":"PASS"}}
{"case":{"id":"API-006","name":"legacy success keeps DTO identity and delete semantics","status":"PASS"}}
{"case":{"id":"API-007","name":"legacy fulfilled failure keeps raw envelope and decode","status":"PASS"}}
{"case":{"id":"API-008","name":"legacy rejection preserves original error and old input deletion","status":"PASS"}}
{"case":{"id":"API-009","name":"strict successful empty DTO is not guessed from its own code","status":"PASS"}}
{"summary":{"mode":"green","tested_actual_api_source":true,"tested_actual_decoder_source":true,"network_envelopes_stubbed":true,"cases":9,"passed":9,"assertion_failures":0,"execution_errors":0,"api_sha256":"9f160c78f24bf50be80c9510529682267530dcc28d203478074af4add865c74b","api_compiled_sha256":"a49c4367801e4576706410c89bd398ce8a5da575f21262ff7133404e891e2777","decoder_sha256":"9cf388d58faf8aa39ee33b6ac8f0c2ac4a81a752c5d77924d9338f9176e44d8c","decoder_compiled_sha256":"a92d2966881450d9af704c385a08cd00ce079099f278bd594a15fa5fa743b358","runner_sha256":"68dbed66d3e09a25c21efda154f091760a5c9118ea1f4034153c356ccf10091e","case_identity_sha256":"03dae6ee7ff5ba276212f25c86686771610eab9b7cb4150b3a9c271c71e14727","backend_query_verified":false,"permission_verified":false,"UI_MVP_verified":false}}
```

后续 root/独立Validator可直接消费稳定API签名并重放。B的query wrapper/operation准备仍需自己的准入与真实参数/失效检查；C真实候选render/目标发布未因本API绿测获得许可。
