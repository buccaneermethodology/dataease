# DEV 查询观测扩展独立 Validation r001

**结论：PASS_WITH_BOUNDS。** 本交付物实现独立验证第 **1/3 轮**。未发现当前约束内的阻断或非阻断产品问题；可供root进行DEV真实UI/数据oracle观测。不是物理HTTP次数、真实后端结果、真实用户验收或MVP完成结论。

- reviewed_at：2026-10-27T07:50:33.149910+00:00（UTC）。
- reviewer：`/root/g2_closeout_reviewer`，未编写本次DEV观测扩展、C4源码或当前paste runner；先前验证过C4，曾编写C3，仅核其接口而不自报独立验证。
- snapshot_id：`S02-MVP-DEV-QUERY-OBSERVATION-VALIDATION-r001`；as_of_state：卡片绑定 `Topology-actual-r464.json` 与下表最终字节。
- Card canonical SHA：`763f171b4d444f94eab09afb239f5aedaf20243c9a71e484e71bac57ed4a8639`，实际validate exit0；Context原字节SHA `8d9041bd445136af0f276afdd09aff60c3e31debc38c287f7bbf4d48b2679ca9`；8项required-read入场/写前均匹配。
- 完整读取五路径before/current diff；五份写前snapshot SHA逐项核验，当前源码/runner与Builder报告最终SHA一致。唯一写入为本报告，未改源码、runner、冻结材料、旧报告、KB、Dashboard状态或Goal；未安装、构建、启服务、访问数据库或Git提交/推送。

## 原始目标、当前任务与声明边界

原始目标仍为开发环境明确三态权限桩下全部受支持图表基本多条件整树复制粘贴、真实query及正常保存离开重开。当前22项、原历史26身份与Scope Delta、49内建type、15主ID/25子ID均不变。现有DEV source/clipboard诊断不足以观察真实query结果，本次仅加最近一次paste attempt的只读内存观测，不能用它改变查询/准备/采用决策或权限。

独立核查目标为：显式DEV双开关、请求最小投影与成功response.data完整clone、一次逻辑getData计数、target/operation关联、取消/拒绝/static/失败/timeout/stale/invalidation、clone与订阅异常隔离、不持久化、不输出认证上下文，以及五路径回归。真实UI与SQL/oracle比较由root单独留证。

## 全部发现及处置

- Blocking findings：无。
- Non-blocking product findings：无。
- Questions requiring authority：无。
- Builder repair required：无。
- 旧 `C4V-001/P3` 当前README同步问题已吸收：文档明确原C1八组+C4五组=13、另7组DEV观测=20，列出具体分支与SDK/API/Store double边界；旧C4报告字节和as-of结论未回写。本结论只证明当前说明已同步，不重新授予C4真实运行验收。

## 独立执行

使用已有依赖，命令在 `core/core-frontend` 执行。

| 实际检查 | 结果 | 证明上限 |
| --- | --- | --- |
| `node tests/filter-copy-mvp-paste/check.mjs` | exit0，20组PASS | 原13组保留+7观测分组；实际wrapper/composable/helper/事件，API/renderer/Store double |
| `node tests/filter-copy-mvp/check.mjs` | exit0，14组PASS | 实际A service/composable、production编译分支、Editor编译回归 |
| 3生产文件+paste runner定向ESLint，无fix | exit0 | lint |
| wrapper定向stylelint | exit0，仅3条既有deprecated规则提示 | 样式检查 |
| wrapper实际parse+compileScript+compileTemplate（bindingMetadata） | exit0 | Vue编译，不等于浏览器交互 |
| 五写域定向 `git diff --check` | exit0 | 空白差异检查 |
| 五个before snapshot及最终文件SHA重算 | 一致 | 读入和最终字节绑定 |
| 独立补充probe（附录） | exit0，8条/0失败 | 实际wrapper/composable/observation，明确协议double；不改生产或持久runner |

未运行全前端TypeScript或build，不把Builder的helper局部类型报告升级成全项目通过。不存在本扩展的可信产品RED声明；before是写前保全，不用旧版缺新函数制造RED。

## 已查无问题维度

| 维度 | 源码与实际执行交叉结论 |
| --- | --- |
| DEV开关关闭 | 所有begin/update/get先检查 `DEV && flag==='true'`；production或显式flag=false编译时begin/get为null、request投影getter不访问、diagnostic空串。不是只隐藏模板后仍采集数据 |
| 最小请求/敏感上下文 | request仅id/type/render/tableId/customFilter五键；不读user/token/proxy/chartExtRequest，成功响应只读取outcome.value.data、不导出envelope。原20组及独立probe分别在request context和response envelope放synthetic token/HMAC/proxy/user哨兵，观测JSON不含哨兵。未读取真实凭据，也未声称净化所有业务数据或把用户合法数据列擅自裁掉 |
| 完整data与clone | fields/data/extra、0/null/false与own undefined均克隆保留；transport对象、prepared对象、读出对象的修改互不污染。补测{}、[]、null、空集合+own undefined均原样保留。源记录是API成功data的完整值，不是前N行/选择列；诊断JSON文本依原JSON.stringify规则，own undefined在内存保留而JSON文本不显示，不能把文本当无损own-key传输 |
| 计数定义/位置 | 仅wrapper当前paste的getData调用前加1，不包Axios层、不统计重试/普通刷新；counterScope固定 `logical_getData_calls_not_physical_HTTP`。成功与业务/网络失败都保留1，static/cancel/前置拒绝0；投影getter异常时计数已经先记，不伪报0 |
| target/op与最新attempt | composable开始尝试时创建token，wrapper只复用同target/op且pending记录。终态、其它target或新attempt不复用，旧token无权写最新记录；读只按当前targetId，切图表显示null。opId是局部尝试编号，非全会话审计ID；只保最近一条 |
| 外层timeout与迟到 | 独立probe用真实ui.paste→request/reply→wrapper，只有15000ms timeout被加速为5ms。外层timeout后failure/paste_timeout/count1；随后真实deferred query完成不会改终态、不会发布；业务write/snapshot为0。不是用手工settle冒称外层超时已执行 |
| stale与session清空 | 实际wrapper输入generation变化时先settle paste_stale，保留已发1次，迟到response不回写；invalidateMvpFilterSession清记录和token，旧响应不能恢复。新attempt替代旧诊断时，旧业务仍按原tokens/ready成功，说明单独观测token不干预业务决策 |
| 异常隔离 | begin/update/get/clone在观察边界catch；notifyObservation逐订阅捕获，原20组中故障subscriber和投影getter未改变真实wrapper成功或query1。异常吞掉只属于诊断，getData/prepare原错误仍按原catch/返回传播，没有新增假业务成功 |
| 不改变业务/存储 | diff无新增await、query、渲染、权限决策或正常save调用；原query→ready→同步publish→snapshot顺序保持，只在既有边界旁记观察。原13组件组+A14回归通过；无localStorage/sessionStorage/OS clipboard/window数据出口。保留最近一条模块内记录；不是审计历史 |
| 原失败与static兼容 | strict业务失败/网络reject、prepare失败、metadata错误/过时、覆盖取消等仍按原语义；static-picture只plan记录，不伪造data/details/lastRequest或增加query；普通图表刷新不计入观测逻辑次数 |

## 独立补充8条的实际结果

1. 成功data为{}。
2. 成功data为[]。
3. 成功data为null。
4. 成功data为 `{fields:[],data:[],own:undefined}`。

上述4条均：原wrapper业务成功、逻辑count=1、responseData深等值；仅response envelope额外放置synthetic token/HMAC/proxySecret/chartExtRequest.user，观测中均不存在哨兵。这里并未声称这些任意data形状都可由真实下层renderer完成，renderer端口是ready double，检查对象是观测数据保留。

5. query在途时仅修改真实wrapper scale：得到paste_stale/count1/responseData=null；late query完成保持，业务write/snapshot=0。
6. query在途新建opId999并将其拒绝为latest-rejected：旧业务随后正常ready/成功，最新诊断仍op999/count0/responseData=null。新诊断token独立于业务token，未伪造一次新业务query。
7. query在途session invalidation：旧响应返回后观测仍null，业务write/snapshot=0。
8. 真实composable外层timeout后late响应：count1/paste_timeout终态保持、0业务write/snapshot。

补充probe首稿遗漏为“新诊断token不应改变旧业务”的成功端口送ready，出现Node未结清top-level await/exit13；修正测试驱动后完整8条exit0。该执行错误不是产品RED，生产/runner字节未修改。

## 未查、同类残余与修后准入预测

真实UI诊断区显示/可访问性、真实API data与独立SQL/oracle一致性、物理HTTP次数、Axios重试/取消/重发、WebGL/Tiny/图片、正常保存/重开及全部49type未由本lane验证。没有将root截图/保存提示当本lane运行或精确全结果。

完整response.data clone与JSON显示只在显式DEV诊断路径；真实大响应下的CPU/内存/交互性能未测。因此“未新增await且当前有限用例业务语义一致”不等于任意数据量零时延/零开销；不能把本报告当性能准入。内存观测支持实际JSON API数据，诊断JSON不是任意非JSON对象的无损序列化器；不据未在真实transport出现的BigInt/函数等虚构产品阻断。

当前有限读入域未见其它计数/归属/迟到恢复/业务干预残余。后续root可以在此冻结字节上观察真实query数据并独立比较oracle；必须同时写明逻辑调用与物理HTTP的差别。若后续修改观测代码，按本交付第2/3轮delta继续，不回写本报告或重置原C4/C2/C3预算。此报告不晋升KB/Coverage/Session或Goal终态。

## Read Manifest（入场/写前一致）

| 路径 | SHA-256 |
| --- | --- |
| `AGENTS.md` | `270940a30f462f2fb0c9a8cf2bbc1dd11750513d8f063ffc376e0e0a2640466e` |
| `Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/Goal.final.json` | `9368cbbd96fd81b44006d72ec9bcdd94b60fbb69812c3f31c65e366bf1956e53` |
| `Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/MVP-20261027/UiIntegrationDesign-r002.md` | `ea2f947c370b554b8f9510d39924e1455c28705088bf4739df78c4725a034468` |
| `Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/MVP-20261027/UiIntegrationCases-r002.json` | `e365ef111582ef84f20f26e6136854409b7fc66bb0931cae40a9df5318036d55` |
| `Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/MVP-20261027/reviews/UiIntegrationDesignReview-r003-C234.md` | `5d4c26ebda1ba9847e19ea1d04caa82d26a54cee01685a167d8313aa3114f4b2` |
| `Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/MVP-20261027/reviews/SliceC4Validation-r001.md` | `9669d41f3a7ebadaf592a4ee8d2e1dad205f5831acf4036d1e510e64501f2c3c` |
| `Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/MVP-20261027/evidence/DevQueryObservation-r001.md` | `d232c572d87029ad19b72bae8333c02a1946e8cc067ef0a3a31fd2b480473311` |
| `Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/MVP-20261027/dev-query-observation-before-r001/manifest.json` | `d7e602080af6e5666edc86c132b8085b3da20ae5fcc2fcdd1a0983a77593fc52` |

## 五路径字节绑定

| 路径 | before SHA-256 | 当前SHA-256 |
| --- | --- | --- |
| `core/core-frontend/src/custom-component/filter-copy/mvp-chart-filter-copy.ts` | `ca144eb978ba334c9ba71fc4c6c5d6cefcb4c025ecac15ff2a446f54e8c8cc79` | `9f4eca86173318b7b964648d216fd7a6c153b41abce9eda12f8f6e9fc6944b82` |
| `core/core-frontend/src/views/chart/components/editor/filter/useChartFilterCopyMvp.ts` | `e31befa9b1888db6b87f8a28f9eed3f1c7a17d13aa394c1bdfcfddb054e2ca9e` | `658027b89e327a6bfa65481f7fd5f43a19b048c15427cd16207f8048773204a8` |
| `core/core-frontend/src/views/chart/components/views/index.vue` | `7f5ce4037b3899b34b4546b53cf4f8278a09ec8fbd6501cd0b8202d42c07b5f1` | `dd88f2ac4f7c5e35f0b07822c72cae0764a3bad11be4a19f23a86d9fb9de3c7b` |
| `core/core-frontend/tests/filter-copy-mvp-paste/check.mjs` | `31ca929484c2f0d835156198166f545466a52f414d86e555c1db1e082117e416` | `868b41984942796d4a6092f88b016b9333034f0a9ef88e1f178a5dec783be69a` |
| `core/core-frontend/tests/filter-copy-mvp-paste/README.md` | `a1e9e007b3841c3323a1c47c500a2f1c4c07fdbdabee995f38650e339f5aaf3a` | `0728c4ec0886094648a27b546d9be537d70ab0d5ebbf60b5348eea32c123e84c` |

## 附录：独立8条内存probe

在core/core-frontend以 `node --input-type=module` 执行；只从当前runner取实际loader/fixture和生产模块，在内存替换底部测试驱动。没有改磁盘runner或业务控制流。

```javascript
import fs from 'node:fs/promises'
let source=await fs.readFile('tests/filter-copy-mvp-paste/check.mjs','utf8')
source=source.replace(/^import (.+) from '([^']+)'$/gm,(_,binding,name)=>{
  if(binding.startsWith('* as '))return `const ${binding.slice(5)}=await import('${name}')`
  if(binding.startsWith('{'))return `const ${binding.replace(/\bas\b/g,':')}=await import('${name}')`
  return `const ${binding}=(await import('${name}')).default`
})
source=source.replace("const root = fileURLToPath(new URL('../../', import.meta.url))",'const root=process.cwd()+"/"')
source=source.slice(0,source.indexOf("await check('own undefined"))+`
let extra=0
for(const data of [{},[],null,{fields:[],data:[],own:undefined}]){
  const f=fixture(),run=f.run()
  m.pending[0].resolve({ok:true,value:{...lodash.cloneDeep(f.view),data,
    token:'PRIVATE_TOKEN',HMAC:'PRIVATE_HMAC',proxySecret:'PRIVATE_PROXY',chartExtRequest:{user:'PRIVATE_USER'}}})
  await wait();f.ready();await run
  const o=m.getMvpPasteObservation('target')
  assert.equal(f.result.ok,true);assert.equal(o.logicalGetDataCalls,1);assert.deepEqual(o.responseData,data)
  assert.equal(JSON.stringify(o).includes('PRIVATE_'),false);extra++;f.close()
}
for(const variant of ['stale','new-attempt','invalidate']){
  const f=fixture(),run=f.run()
  if(variant==='stale')f.props.scale=2
  if(variant==='new-attempt'){
    const n=m.beginMvpPasteObservation('target',999)
    m.settleMvpPasteObservation(n,{ok:false,reason:'latest-rejected'})
  }
  if(variant==='invalidate')m.invalidateMvpFilterSession()
  f.queryOk();await wait();if(variant==='new-attempt')f.ready();await run
  const o=m.getMvpPasteObservation('target')
  if(variant==='stale'){
    assert.equal(o.reason,'paste_stale');assert.equal(o.logicalGetDataCalls,1);assert.equal(o.responseData,null)
  }
  if(variant==='new-attempt'){
    assert.equal(o.operationId,999);assert.equal(o.logicalGetDataCalls,0)
    assert.equal(o.reason,'latest-rejected');assert.equal(o.responseData,null);assert.equal(f.result.ok,true)
  }else{assert.equal(m.env.writes.length,0);assert.equal(m.env.snapshots.length,0)}
  if(variant==='invalidate')assert.equal(o,null)
  extra++;f.close()
}
{
  const f=fixture();let ui
  const pane=m.ref({...lodash.cloneDeep(f.view),id:'source',customFilter:tree})
  m.env.dv.curComponent={id:'source'}
  const app=renderer.createApp({setup(){ui=m.useChartFilterCopyMvp(pane);return()=>m.h('div')}})
  app.mount({children:[]});await wait()
  ui.permission.value='allow';ui.copy();pane.value=f.view;m.env.dv.curComponent={id:'target'};await wait()
  const oldTimer=globalThis.setTimeout
  globalThis.setTimeout=(fn,delay,...args)=>oldTimer(fn,delay===15000?5:delay,...args)
  await ui.paste();globalThis.setTimeout=oldTimer
  const o=m.getMvpPasteObservation('target')
  assert.equal(ui.status.value,'paste_timeout');assert.equal(o.reason,'paste_timeout')
  assert.equal(o.logicalGetDataCalls,1);assert.equal(o.outcome,'failure')
  f.queryOk();await wait();assert.deepEqual(m.getMvpPasteObservation('target'),o)
  assert.equal(m.env.writes.length,0);assert.equal(m.env.snapshots.length,0);extra++
  app.unmount();f.close();m.env.dv.editMode='preview'
}
console.log(JSON.stringify({extra,failures:0,realWrapperAndComposable:true,providersDoubled:true}))
globalThis.performance=originalPerformance
`
const AsyncFunction=Object.getPrototypeOf(async function(){}).constructor
await new AsyncFunction(source)()
```

自身摘要由写后只读重算回传root，不作自指SHA。
