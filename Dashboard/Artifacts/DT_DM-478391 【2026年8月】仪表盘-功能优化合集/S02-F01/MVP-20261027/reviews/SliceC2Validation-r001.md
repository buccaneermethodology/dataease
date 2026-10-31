# C2 地图独立验证 r001

**结论：BLOCKED（有两个当前局部实现阻断，不能准入 C2 成功采用）。** 原 maps 49 项与 renderer 24 项回归通过，但额外独立时序检查发现“已失败并销毁的候选仍报成功”和“采用后正常刷新新实例漏销毁”。这是本 C2 实现交付第 **1/3 轮**，不是重开已经用完的第3/3轮 UI 设计审查。

- reviewed_at：2026-10-27T06:39:08.618358+00:00
- reviewer：`/root/chart_preview_state_trace`；C2 map classes/ready bridge/地图 runner 作者为 `/root/line_construction_builder`。
- snapshot_id：`S02-MVP-C2-INDEPENDENT-VALIDATION-r001`；as_of_state：Topology r449，root/B 最终冻结 ACK 后的当前字节，G2 SFC 为 `c806b8375062aa423ea9301721cf9a3445b2a845d704e026a67c07e51acf1805`。
- 卡片 canonical SHA：`be81db699a03dec231e071e1b74cafb16aae2294d189bf90bffc0f76aaebd2e2`；实际 card/context 验证 exit0，10 个 required-read 原字节 SHA 全部匹配。本文是唯一写入；未修改源码、runner、冻结输入或旧报告。
- 独立性说明：本 reviewer 未编写 C2 地图模块或 maps runner，曾编写 C4 共享 wrapper，因此本轮独立结论仅限 C2 地图实现与其真实 SFC 链；wrapper 只核 C2 接口兼容，不自验 C4，也不将自身 C4 绿测计作独立证据。

## 当前任务与证据上限

原始目标仍是权限测试桩下全部受支持图表基本多条件复制粘贴界面 MVP，当前22项、15主case及49内建 type 保留。C2 模块候选负责五地图真实类/七fixture的必要事件就绪、失败/迟到隔离、基础设施前置拒绝和局部清理；不是通用资源框架，也不是全49种图表验收。本轮读取原 Goal、MVP authority、r002 Design/Cases、C234 fixture与第三轮review、Builder 两份报告和实际完整 C2 diff/runner，按实际当前源码取证。Scope Delta: none。

## 阻断发现

### C2V-001 / P1：ready 已 resolve 后的已知 SDK error/destroy 可使已释放实例仍返回成功

**位置**：`filter-paste-ready.ts:74-93`、`ChartComponentG2Plot.vue:1564-1568`，以及 prepare 后续返回 handle 的边界。

最后一个必需事件令 `done()` resolve ready Promise；同一同步事件轮中 SDK 再发 error/destroy 时，`fail()` 虽设置 closed 并释放 scene/plot，但 settled 已为 true，不能把此前 fulfilled Promise 改成 rejected。SFC `await ready.ready` 后只检查外部 `pasteIsCurrent()`，没有核当前桥已 closed/实例已失败，因此仍 resolve render 并返回 `ok:true`。

**真实重现**：未改磁盘 runner或生产，只在内存复用现 maps runner 的原 load()、实际完整 SFC/地图类/ready桥，必要事件到齐后立即、在 await prepare 完成之前 emit error 或 destroy。七fixture×两事件共14变体全部返回 `ok:true`；L7三fixture sceneDestroyed=true，四L7Plot fixture plotDestroyed=true；sharedWrites=0（仍在当前一次 paste 采用前）。这不是采用后一般异步故障，也不依赖真实 WebGL 才成立。

| fixture 范围 | 注入点 | 实际 | 预期 |
| --- | --- | --- | --- |
| map-flow / map-heat / map-symbolic | 最后 layer inited 后，同一同步段 error/destroy | ok:true，scene 已 destroy | prepare 拒绝，不提供可采用 handle |
| map-polygon | plot loaded 后，同一同步段 error/destroy | ok:true，plot 已 destroy | 同上 |
| bubble-map-polygon / map-point / bubble-map-point | 最后 Dot add/loaded 后，同一同步段 error/destroy | ok:true，plot 已 destroy | 同上 |

**影响**：C2 成功结果可交出已无可见实例的 handle，破坏原 Goal“准备成功才采用、失败不假成功”和 MVP-UI-10-MAP 的 error/dispose 边界。此探针未执行 wrapper publish，不能声称实测到 Store/dirty写入；但返回成功的必要条件已被直接反证。

**处置**：Builder repair；让本次候选已知失败状态在 ready resolve 之后仍能被上层成功边界复核，覆盖最后事件→prepare返回的微任务窗口；不能仅因 Promise 已 fulfilled 就丢弃后续已知失败。修复仍应局限此 paste 准备，不恢复迁出的通用异步框架。

**回归要求/同类残余**：原49条只在 ready 前注入 error，缺少本窗口。至少保留七fixture×error/destroy的本时序反例；继续核真实 handle 采用前的后续微任务窗口，不以只在第一处 await 后加一次检查替代整条成功边界。四类 Dot/plot 和三类 layer 共用桥，不能只修 flow。

### C2V-002 / P2：采用后普通地图刷新生成的新 plot 在卸载时漏销毁

**位置**：`ChartComponentG2Plot.vue:1088-1113`（普通 renderL7Plot 替换 myChart）、`:1599-1602` 与 `:1783-1785`（仅因旧 mapPasteReady 存在就清空 myChart）、`:1805`（后续销毁读取已清空引用）。

strict 地图成功采用后，mapPasteReady/cancelMapPreparation 仍指最初候选实例。之后正常 renderChart→renderL7Plot 会销毁旧 plot、建立新 plot 并赋 myChart；卸载先 cancel 原桥，只释放最初旧实例，然后因为 mapPasteReady 仍存在无条件 `myChart=null`，最终通用 `myChart?.destroy()` 看不到刷新产生的新实例。

**真实重现**：同实际 SFC loader，正常 prepare、必需事件齐→ok，设置同 binding.phase=active 模拟采用，然后调用实际 public proxy.renderChart(response)，等待原500ms调度加速执行，最后实际 Vue unmount。map-polygon、bubble-map-polygon、map-point、bubble-map-point 四fixture均创建两个 plot，卸载后 destroyed=`[true,false]`。新plot未发 loaded 也应在卸载清理；本例没有改生产清理或以替身 prepare 替代实际方法。

**影响**：一次已采用 paste 后正常数据刷新/普通编辑再卸载，当前组件持有的新 plot 不再可靠释放。这是本次新增清空引用造成的局部生命周期回归，不要求清理任意 SDK 隐含资源或实现全面资源治理。

**处置**：Builder repair；区分原 strict 桥持有实例与当前 myChart，只有已由桥确切释放的同一实例才可抑制重复 destroy；正常刷新替换的当前实例仍需走原卸载清理。handle.dispose 的相同模式也需核对，避免另一次 paste 替换时复现。

**回归要求/同类残余**：四个 L7Plot 路径均复现；普通 L7 多数沿用同 scene，没有用本例证明泄漏。应增加 adopted→normal refresh→unmount，以及 adopted→refresh→old handle dispose 的局部场景；不据未执行路径宣称无问题。

## 非阻断发现与证据差异

**C2V-003 / P3（陈述更正）**：Builder 报告称候选跳过共享 hover adapter；实际 symbolic-map.drawChart 仍调用 buildTooltip，buildTooltip 在 tooltip.show 检查之前无条件调用 `bindMapHoverTooltipRefresh`（symbolic-map.ts:484附近）。该函数会为本候选容器登记 DOM/scene监听和 WeakMap项；原函数有 scene.destroy cleanup、容器为候选唯一id，当前没有证据表明它改动旧目标，所以不列新产品阻断。应将报告范围改为“map/bubble/point显式跳过；symbolic仍沿原容器局部注册”，或由Builder在已准入域内作有理由的局部处理；不能继续称全部路径都跳过。现 runner 把该 adapter 设为 noop，49绿没有验证其真实注册/解绑。

## 已执行检查

所有命令在已冻结当前字节上由本 reviewer 实际执行；下述通过不覆盖上面的额外反例。

| 检查 | 实际结果 | 证据边界 |
| --- | --- | --- |
| maps/check.mjs --before | exit1；0 pass / 42 expected semantic fail / 0 execution；唯一指纹 MAP_READY_BEFORE_REQUIRED_EVENTS | 核原 manifest SHA，旧真实类成功建立layer/plot再判断提前完成；不称42种不同缺陷或各故障注入都在旧版跑到 |
| maps/check.mjs | exit0；49 pass / 0 fail / 0 execution | 七fixture×六variant + 七缺设施拒绝，非49种图表 |
| renderers/check.mjs | exit0；24 pass / 0 semantic / 0 execution / unhandled=[] | C1 renderer局部回归，未自验C4 |
| maps/check.mjs --types | exit0；before29 / current28 / added=[] | 真实TS/compileScript局部diagnostic multiset；runner内存options含allowJs:true，未改tsconfig，非全前端类型通过 |
| C2 11生产路径 + maps runner 定向 ESLint | exit0 | lint |
| G2 SFC 定向 stylelint | exit0，仅3条既有规则弃用提示 | style语法 |
| C2 定向 git diff --check | exit0 | 空白差异 |
| 独立 ready后error/destroy探针 | 14/14 均不符合拒绝预期，实际返回ok:true且实例释放 | C2V-001真实生产SFC链与SDK事件double |
| 独立采用后刷新再卸载探针 | 4/4 新plot未destroy，destroyed=[true,false] | C2V-002真实public renderChart/生命周期 + SDK double |

## 已检查无新增问题的维度

- 对三L7实际5/1/2 layer在add前统一订阅必要inited与error/destroy，scene loaded仅允许add；callback body用ready.callback，现故障seam异常确实拒绝；最后layer之前保持pending。plot/Dot均在addToScene前订阅、需要add与loaded两事件；map polygon没有凭空要求Dot。
- opt-in AntVDrawOptions.filterPaste、L7Wrapper.render():void默认兼容；普通draw不被强制等待桥。legacy分支不把新桥当统一资源框架。C1 G2/S2/indicator实际renderer24回归通过。
- 准备失败/timeout/discard后既有fixture不出现共享Store/emitter业务写；迟到事件不重新执行已封闭callback。候选唯一suffix与本地chart.id用于设施selector；response/canonical id没有被该本地变更写回。metadata保持kind:g2与drill/origin标志。
- canPrepareFilterPasteMap只读现mapKeyLoaded/SDK全局与mapCache；preparedMapKey不请求配置、不写security全局；地图严格geo读取显式false，缓存不可得拒绝而非cold init。custom_目前明确unavailable、未从分母删除。共享wrappercapture前调用地图能力门的接口兼容仅静态核对，不作为reviewer自验C4。
- 初始化修复已删除helper对图库util的新增value import，局部string/object JSON语义与preparedAreaId短路保留；type imports可擦除。直接依赖边未见新增回到图库类型初始化的路径；未建立全图模块环证明，也未在浏览器重演root此前冷导航。
- 实际源代码读取 + 实际Vue SFC/template/地图类/L7Wrapper/point fallback/label-layout链运行。SDK ready不自动发出，事件顺序由测试显式驱动；fixture原字节未改，flow去重和tooltip缺value的第三轮边界保留。

## 未检查与剩余责任

本轮没有真实浏览器/WebGL、供应商SDK/脚本/key、真实地图资产、真实query/权限、wrapper publish/dirty/save-load、字体像素、49逐type source/target或插件installed盘点；这些保持 NOT_RUN，由root真实链与后续独立MVP验收补证。common_antv的真实getMapScene loaded callback、qqMapRendered内部1秒timer、真实hover拾取并未被现SDK seam覆盖；当前没有以这些未覆盖点另造确定产品缺陷，也不能把noop adapter/回调seam通过称全真实实现通过。全面资源、所有普通异步场景与跨宿主竞争不在本轮修复前置。

原 maps runner 采用宽松未知module返回空对象，但当前七fixture已成功构造规定layer/plot和执行必要算法；本轮不将缺provider/编译失败当RED。必要新时序通过原load在内存追加，不改原runner、fixture、expected或生产控制流。SDK destroy double只记录自身销毁，不证明供应商内部GPU资源全部释放；C2V-002反证的是当前代码根本未调用新plot.destroy。

## 修后准入预测与轮次

当前 BLOCKED，C2V-001/P1和C2V-002/P2均需Builder精确修复后进入第2/3轮delta验证；C2V-003为报告/证据边界更正，不独立阻断。修复应保留原49/24回归和本轮14+4反例，并复核其它同类微任务/当前实例边界。若这些问题闭合，可预测有界模块准入，仍不能替代真实地图、query/save重开或22项/49类型最终验收。不得把本轮失败改为通过或重置累计三轮。

## 当前冻结字节与读入清单

以下13项在独立运行前后重算一致；G2采用C1 tooltip最终冻结版本，ready helper采用初始化有限修复版本，其余与原C2候选报告一致。

| 文件 | SHA-256 |
| --- | --- |
| `core/core-frontend/src/views/chart/components/js/panel/types/index.ts` | `a9214afb421b3dbd8ab07c5721157ab48d97ca2e68d932e947838ab736b3581f` |
| `core/core-frontend/src/views/chart/components/js/panel/types/impl/l7.ts` | `94f1e0e47f05b09588bc71818ece4bb284f412fa0afb333b2614e513dd611414` |
| `core/core-frontend/src/views/chart/components/js/panel/types/impl/l7plot.ts` | `e63a044bbc5dca7bc07f645faf3df5684f8de8c545339f87fa0ce8978718d6cc` |
| `core/core-frontend/src/views/chart/components/js/panel/charts/map/flow-map.ts` | `cd6b2233c83fc19ab04b0a3262b44f26ff5934bad7915969586700eebfc71d1b` |
| `core/core-frontend/src/views/chart/components/js/panel/charts/map/heat-map.ts` | `1b09b6330c31e235923464b75665b814cebe0832a3b9fa3582aaf1279c60c563` |
| `core/core-frontend/src/views/chart/components/js/panel/charts/map/symbolic-map.ts` | `b5f7235ea6cc373b9fce47b0c95ce09e95f61ff45d6174d759156eb36a97c826` |
| `core/core-frontend/src/views/chart/components/js/panel/charts/map/map.ts` | `5eeb33eeff060e1a25e48eaa8d836d9e8985c63bfa2ed9d70b513244420c6c12` |
| `core/core-frontend/src/views/chart/components/js/panel/charts/map/bubble-map.ts` | `fbd6c86d1dd60f2120e2e5f84d8bde25dbf598c774a2bcb7ffe4e55d24ed38cd` |
| `core/core-frontend/src/views/chart/components/js/panel/charts/map/point-fallback.ts` | `98f6b5c08ef91d909f1483fd707998a3dc9edf71da3ca350a54a3d9ddff07a79` |
| `core/core-frontend/src/views/chart/components/views/components/ChartComponentG2Plot.vue` | `c806b8375062aa423ea9301721cf9a3445b2a845d704e026a67c07e51acf1805` |
| `core/core-frontend/src/views/chart/components/js/panel/charts/map/filter-paste-ready.ts` | `71ee524fe26eba795c9d34ed70ea124b4132f198940b287fc2f77e99054b9dcb` |
| `core/core-frontend/tests/filter-copy-mvp-maps/check.mjs` | `62a7e464c593e70b73da1881087faff877fe117dc70a6fc5e60c8d03d5569747` |
| `core/core-frontend/tests/filter-copy-mvp-maps/README.md` | `0b186a96ad4db74707914cde5865278c19b8d32b1dd1ec760c8c726b304ec465` |

10项必读上下文逐项原字节SHA：

| 文件 | SHA-256 |
| --- | --- |
| `AGENTS.md` | `270940a30f462f2fb0c9a8cf2bbc1dd11750513d8f063ffc376e0e0a2640466e` |
| `.codex/skills/sge-governed-checkpoints/SKILL.md` | `c4d8463bc350c44ad600c92400f783c565b2e968720bfeed1df67a49112b8933` |
| `Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/Goal.final.json` | `9368cbbd96fd81b44006d72ec9bcdd94b60fbb69812c3f31c65e366bf1956e53` |
| `Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/planning/MvpScopeAuthority-20261027.json` | `641dfa78e63b1d53e25c08ea5c71c4458c272399c749aa84f0dea63ab89023a4` |
| `Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/MVP-20261027/UiIntegrationDesign-r002.md` | `ea2f947c370b554b8f9510d39924e1455c28705088bf4739df78c4725a034468` |
| `Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/MVP-20261027/UiIntegrationCases-r002.json` | `e365ef111582ef84f20f26e6136854409b7fc66bb0931cae40a9df5318036d55` |
| `Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/MVP-20261027/UiC234ConcreteFixtures-r001.json` | `cdec6ed17380d4cc62eba495c4edd785d12178fd4758a5cfb993dd530426f4d5` |
| `Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/MVP-20261027/reviews/UiIntegrationDesignReview-r003-C234.md` | `5d4c26ebda1ba9847e19ea1d04caa82d26a54cee01685a167d8313aa3114f4b2` |
| `Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/MVP-20261027/evidence/SliceC2Maps-r001.md` | `96b9cff00d14666e584f9a8b6e8581355691de06e45ee1f238ad58796c7dcbfa` |
| `Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/MVP-20261027/evidence/C2InitializationRepair-r001.md` | `bccdd2501549ff5c2c36bdb27cca48d4d0005b7b08b8f54ef19fbf6a8be518ef` |

## 附录：独立内存探针复现方法

在core/core-frontend运行下列Node脚本。它读取原runner，在内存保留其load()与真实模块加载器、仅替换底部测试驱动；不改磁盘源码、runner或fixture。和原runner相同，SDK/host/Store/设施seam为显式double。

```javascript
import fs from 'node:fs/promises'
const file = new URL('./tests/filter-copy-mvp-maps/check.mjs', import.meta.url)
let source = await fs.readFile(file, 'utf8')
source = source.replace(
  "const root = fileURLToPath(new URL('../../', import.meta.url))",
  'const root = ' + JSON.stringify(process.cwd() + '/')
)
source = source.replace('createRequire(import.meta.url)', 'createRequire(' + JSON.stringify(file.href) + ')')
for (const spec of ['@vue/compiler-sfc', 'typescript', 'vue', 'lodash-es'])
  source = source.replaceAll("from '" + spec + "'", "from '" + import.meta.resolve(spec) + "'")
source = source.slice(0, source.indexOf('\nlet passed = 0,')) + `
for (const event of ['error','destroy'])
for (const id of ['map-flow','map-heat','map-symbolic','map-polygon','bubble-map-polygon','map-point','bubble-map-point']) {
 const s=await load(id,'normal');let result;
 const pending=s.prepare().then(value=>{result=value});await sleep(15)
 if(s.layers.length)for(const layer of s.layers)layer.emit('inited')
 else {for(const plot of s.plots)plot.emit('loaded');for(const dot of s.dots){dot.emit('add');dot.emit('loaded')}}
 ;(s.layers[0]||s.plots[0]).emit(event,new Error('independent:after-final-event-before-adoption'))
 await pending
 console.log(JSON.stringify({id,event,ok:result?.ok,sceneDestroyed:s.scenes[0]?.destroyed,plotDestroyed:s.plots[0]?.destroyed,sharedWrites:s.effects.length}))
 result?.handle?.dispose();s.unmount()
}
for(const id of ['map-polygon','bubble-map-polygon','map-point','bubble-map-point']) {
 const s=await load(id,'normal');let result;
 const pending=s.prepare().then(value=>{result=value});await sleep(15)
 for(const plot of s.plots)plot.emit('loaded');for(const dot of s.dots){dot.emit('add');dot.emit('loaded')}await pending
 s.binding.current.value={...s.binding.current.value,phase:'active'}
 await s.proxy.renderChart(s.response);await sleep(15);s.unmount()
 console.log(JSON.stringify({id,probe:'normal-refresh-then-unmount',initialOK:result?.ok,plots:s.plots.length,destroyed:s.plots.map(x=>x.destroyed)}))
}
`
await import('data:text/javascript;base64,' + Buffer.from(source).toString('base64'))
```
