# C2 地图独立终轮增量验证 r003

**结论：BLOCKED（终轮）。** C2V-001、002的原有限反例和C2V-004 scene交接反例现已通过；本轮查全仍发现一个有限清理残余 `C2V-005/P2`：普通刷新后的当前实例先被Vue卸载清理，再调用其原handle.dispose会被第二次destroy，未满足本卡“最终unmount和handle.dispose仅一次”谓词。重复调用已证，未实测真实SDK崩溃/GPU损害，不把这两层事实混同。

本C2实现交付累计 **第3/3轮，上限已用完**。不重命名再开第四轮，不将未完项删掉或改为通过；可以继续与此阻断独立的Goal工作。本文不关闭Goal或升级真实地图/49type/MVP完成结论。

- reviewed_at：2026-10-27T08:05:29.779411+00:00（UTC）。
- reviewer：`/root/g2_closeout_reviewer`，未编写C2修复、生产源码或maps runner。曾编写C234 fixture/C3，故C3仍只核接口不自验；旧C4/DEV观测结论不扩大到C2真实地图。
- snapshot_id：`S02-MVP-C2-INDEPENDENT-FINAL-DELTA-r003`；as_of_state：卡片绑定Topology r465及下表当前字节。
- Card canonical SHA：`4f355a1d2ad4eefb9e65578ab87f1107d65eaa128990dcfa6e1cf43cc2e298fd`，实际validate exit0。
- Context原字节SHA：`3022c9b475d7d4cacbbf17a8218a979e3e4432ed51faa9d7273d7d6ba32de430`；16项required-read入场及落报告前逐项一致。
- G2最终SHA：`5ca0da498a294f82b3bb869dc2bcfa71a968b96f0b6ef98f9438cf150755daaa`。完整读取scene-before→当前diff：唯一生产delta为renderL7定时器draw前的两行strict owner释放；helper/地图classes/tooltip保持，不将其它lane的DEV wrapper增量归入C2修复。
- 本轮唯一持久写入：本报告；未修改源码/runner/fixture/旧报告/Goal/KB/状态，未安装、构建、启服务、访问DB或Git提交推送。所有额外probe在内存执行。

## 原始目标和当前证据上限

原始目标仍是权限测试桩下全部支持图表的基本多条件整树复制粘贴、真实query/正常save离开重开。当前22项、原26身份及approved-deferred、49内建type、15主ID/25子ID不变。C2有限模块负责准备事件就绪、失败保旧及已知实例/局部清理；不恢复迁出的通用晚到污染、全部旧异步启动时点或全面资源框架。

本轮复验原完整基线、两轮发现、scene局部修复、真实getMapScene函数及显式SDK协议double、返回handle/metadata/普通刷新清理和兼容回归。317是组件检查条目，不是图表type，也不证明真实地图或全MVP验收。

## 已修发现的最终处置

| ID | 独立终轮结论 |
| --- | --- |
| C2V-001/P1 | 原最后事件→同turn/微任务error/destroy反例闭合。317含原14+其余ready/handle变体、182分层微任务、21 dispose/unmount/stale元数据边界，均通过。fulfilled handle之后metadata getter仍核closed/current，不能把Promise fulfilled说成可撤回 |
| C2V-002/P2 | 原四L7Plot adopt→normal refresh→unmount或handle.dispose两分支闭合，旧/新plot恰一次；dispose→unmount保持一次。反向清理组合残余单列C2V-005，不能将本行扩大为所有顺序都通过 |
| C2V-003/P3 | 证据更正保持：symbolic仍局部shared hover注册，map/bubble/point跳过；noop seam不算真实hover解绑通过。旧报告字节未改 |
| C2V-004/P2 | **原scene交接反例闭合**。首次正常renderL7若当前仍是mapPasteInstance，先release strict桥并精确置空myChart，旧scene释放一次后正常draw新scene；后续普通刷新复用正常新scene，旧layer destroy不再关闭准备桥。12矩阵及独立多次刷新对照通过，symbolic resize策略不变 |

## 全部新发现

### C2V-005 / P2 / blocking：刷新后先unmount、后原handle.dispose会重复销毁当前实例

**位置**：`ChartComponentG2Plot.vue` 的 `prepareFilterPaste.dispose`（约1608–1626）与 `onBeforeUnmount`（约1800–1823）。wrapper child独立卸载/handle保留的静态入口见 `views/index.vue` 外层renderer条件（约1725）和wrapper teardown的 `pasteNodes.forEach(handle.dispose)`（约854）。

**事实与根因**：成功采用后普通刷新已将旧strict实例替换为正常新scene/plot。Vue child的onBeforeUnmount执行 `myChart?.destroy()`，但不清空该当前引用，也不使prepare closure中的alive失效。随后第一次调用保留的handle.dispose，alive仍true，桥只认识早已释放的旧strict实例，不会置空不同的新myChart；dispose于是再次对同一已销毁当前实例调用destroy。两者分别单独幂等不等于两条实际清理入口组合后恰一次。

**独立矩阵**（七fixture、无refresh/有refresh、两种顺序，每案全新load；完整实际SFC/地图classes，SDK为double）：

| 条件与顺序 | 结果 |
| --- | --- |
| 未普通刷新：unmount→handle.dispose | 7/7通过，严格桥持有实例destroyCount=[1] |
| 未普通刷新：handle.dispose→unmount | 7/7通过，destroyCount=[1] |
| 普通刷新：handle.dispose→unmount | 7/7通过，旧/新实例destroyCount=[1,1] |
| 普通刷新：unmount→handle.dispose | **7/7违反恰一次谓词，旧/新实例destroyCount=[1,2]** |

28条共21通过、7语义反例、0执行错误，Vue error为空、业务effects=0。随后重复同一handle.dispose或同一app.unmount未增加次数；问题发生在另一条清理入口的首次交接，非单函数反复调用。

受影响：map-flow/map-heat/map-symbolic、map-polygon/bubble-map-polygon/map-point/bubble-map-point全部同根因。真实getMapScene路径三L7已运行，四L7Plot仍实际原类/SDK seam；不是用替身prepare制造反例。

**可达性与边界**：通常父wrapper卸载会先dispose handle，再触发child卸载，这个顺序确实通过；不能把另一顺序当成同一通常流程已实际重演。当前wrapper中renderer所在外层div可因showEmpty/chartAreaShow条件独立卸载child，而pasteNodes/handle仍保留；后续wrapper teardown或旧node释放会再调用该handle.dispose。这是当前源码的有限可达路径，未在真实浏览器通过清轴/隐藏复演，不能声称已经观察到真实用户报错。

安装SceneService.destroy具有inited防重复，L7Plot Map.destroy仍会再走control/tooltip/scene清理；本probe只证明当前生产代码重复调用SDK destroy。没有真实WebGL/tooltip异常或GPU损害证据，不能写成“已崩溃”或“二次GPU释放已证”。阻断依据是本终轮卡与本局部资源交付明确要求的当前实例恰一次清理谓词未满足；不是无限加严通用资源治理。

**处置/最小修复方向**：记录为当前C2未闭合项；本lane不代修，也不启动第四轮。后续获明确安排时，使Vue卸载与handle.dispose共享同一次局部释放状态/引用清空，或在卸载后让handle不能再次释放已清理的当前实例；不以全局忽略SDK错误替代，不影响仍在准备期的metadata/error检查。应保留全部28条两个顺序对照及原317条。原先只验证dispose→unmount会漏掉本边界。

新增其它blocking/non-blocking产品finding：无。Authority questions：无。前述7条是一个共同根因的变体，不计为7个独立缺陷或新图表分母。

## 独立运行结果

命令在core/core-frontend，使用已有依赖；before manifest与快照SHA均核验。

| 实际执行 | 结果与上限 |
| --- | --- |
| `node tests/filter-copy-mvp-maps/check.mjs` | exit0：317 pass/0semantic/0execution；99原条目+182微任务+21handle+12scene+3legacy |
| 同上 `--scene-before` | exit1：307pass/10semantic fail/0execution；同一当前driver与写前生产字节，原scene反例可信RED |
| 同上 `--scene-types` | exit0：11→11、added=[]；本次两生产文件局部TS/compileScript诊断multiset |
| 同上 `--before` | exit1：0pass/42 expected semantic fail/0execution；原提前完成fingerprint |
| 同上 `--types` | exit0：29→28、added=[]；原C2写域基线对照，内存allowJs:true，非全前端类型通过 |
| renderers/check.mjs | exit0：24pass/0semantic/0execution/unhandled=[] |
| tooltip/check.mjs | exit0：10pass/0semantic/0execution；真实shared tooltip模块、host double |
| paste/check.mjs | exit0：20组；包括原13及当前独立DEV观测7组，子端口/API/Store double |
| C2 11生产+maps runner定向ESLint、G2 stylelint、完整SFC parse/script/template编译 | 均exit0，style仅既有3条规则弃用提示 |
| 独立scene多次刷新矩阵 | 12/12通过：三type×renderChart/resize×unmount或handle.dispose；10个实际重绘案各再发3次normal renderChart（共30次）复用同一正常新scene，保持alive；每条单独cleanup及dispose→unmount均恰一次 |
| 独立逆序cleanup矩阵（附录） | 28条：21pass/7semantic反例/0execution；C2V-005 |

本轮新增微任务/21handle已被当前317原意落地并由本reviewer重跑；没有把Builder自报当独立执行。额外独立scene多刷新与28逆序驱动在内存，不改当前runner/fixture/期待。首次将两个清理顺序混入12scene附加probe时立即断言2≠1，随后拆成完整28矩阵查全，不因首次失败停止或删掉反例。

## 已查无问题维度、未查及剩余项

已查未见其它当前阻断：七fixture必要事件/listener先于add、scene/plot/dot的完整ready、最后事件后同turn/微任务/handle getter检查；prepare失败/timeout/discard/late的effects0；metadata准备时固定且重复getter同对象；缺基础设施0query、无候选冷配置/全局写；唯一suffix和局部ID不写canonical；四L7Plot原owner区分；三L7strict→normal旧scene释放及后续normal复用；legacy三地图类无filterPaste默认draw/reuse；C1renderer/tooltip/paste20兼容。当前两行修复没有改五地图class、shared tooltip、helper或公共metadata契约。

未检查：真实浏览器/WebGL/供应商SDK/key/地图资产、真实地图→wrapper publish/query/dirty/权限/保存离开重开、全49type source/target、字体像素、mobile/lib、插件installed盘点。common_antv只在realScene用完整getMapScene函数，其他mapRendered/qq内部timer/hover为既有seam；SDK destroyCount不等于GPU资源实测；真实清轴导致child独立卸载的可达性仅静态分析。普通draw延迟启动前即卸载等全面旧异步时点继续保留此前迁出边界，不凭本矩阵宣称已解决。

同类残余：C2V-005七fixture已全部查出；其无普通刷新与正序cleanup对照通过，不再泛称“所有dispose都错”。当前未观察到更多C2局部失败。原1/2/4已修发现保留其通过范围；C2V-003更正不回退；各历史报告的时点/字节保全。

**未完AC/准入预测**：本卡当前实例恰一次清理谓词和MVP-UI-10/11的相应局部cleanup证据仍未闭合，`AC-S02-08`相关普通编辑/清空删除回归不能据本模块晋升；Goal中真实地图、多条件结果、正常save/reopen及全49type相关AC继续原待验状态，不由317绿提升。当前C2不能最终模块准入，不能给MVP完成结论。实现独立预算3/3已耗尽，所有阻断/未完义务应由root保留；不改名启动第四轮。DEV观测真实UI、非C2类型等与本阻断独立的工作仍可继续，不能借独立工作偷偷关闭本残余。

## Read Manifest（16项入场/写前一致）

| 路径 | SHA-256 |
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
| `Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/MVP-20261027/reviews/SliceC2Validation-r001.md` | `21e275bde342ef9aabf8e7c9d29795029566fcac77f10eb3b464e406a24b2a84` |
| `Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/MVP-20261027/evidence/C2LocalRepair-r001.md` | `6e38630e61b7f01b131f76c13a28ec303ae708716b3ba1b31e8aa69a601be561` |
| `Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/MVP-20261027/c2-local-before-r001/durable-manifest.json` | `e3c37e107e5e6d23bcf5a472987ce6b84d0693abbdba0253085b0d29564da5c7` |
| `Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/MVP-20261027/reviews/SliceC2Validation-r002.md` | `0aaa7cdba6be0ac51f93ec29a5f96643726de47fafad3ee2de091590855ee25a` |
| `Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/MVP-20261027/evidence/C2SceneRepair-r001.md` | `519a61201de239fe2afd515a2e0e1dde9f06773436144bae150b936443db019d` |
| `Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/MVP-20261027/c2-scene-before-r001/manifest.json` | `b233ab864ba2822083bb5b89936b3df4c3219a0f4ddb1b880516eed7c39b3688` |

## 最终源码与runner绑定

当前DEV wrapper/paste20属于并发独立交付的已读兼容输入，不计作C2新增生产；已安装SDK只读文件为幂等性校准依据，不纳入源码交付。

| 路径 | SHA-256 |
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
| `core/core-frontend/src/views/chart/components/views/components/ChartComponentG2Plot.vue` | `5ca0da498a294f82b3bb869dc2bcfa71a968b96f0b6ef98f9438cf150755daaa` |
| `core/core-frontend/src/views/chart/components/js/panel/charts/map/filter-paste-ready.ts` | `71ee524fe26eba795c9d34ed70ea124b4132f198940b287fc2f77e99054b9dcb` |
| `core/core-frontend/tests/filter-copy-mvp-maps/check.mjs` | `c2d4d18c37e328faa0611d7ea0dee90a6117fcab29dcb957e96048b67a01522b` |
| `core/core-frontend/tests/filter-copy-mvp-maps/README.md` | `54c5929319bde9a510a323796583976bf76aba5d6693649c6ecc26b974a9da65` |
| `core/core-frontend/src/views/chart/components/js/panel/common/common_antv.ts` | `d1ae2347516af2cfb96667ce721c0394ab93d32ac20f8af745940d7d209da77d` |
| `core/core-frontend/src/views/chart/components/views/index.vue` | `dd88f2ac4f7c5e35f0b07822c72cae0764a3bad11be4a19f23a86d9fb9de3c7b` |
| `core/core-frontend/tests/filter-copy-mvp-paste/check.mjs` | `868b41984942796d4a6092f88b016b9333034f0a9ef88e1f178a5dec783be69a` |
| `core/core-frontend/tests/filter-copy-mvp-renderers/check.mjs` | `7d00e3274b48c6629336c083bdb9029cd82bc2202ed89bf54f949f48ea59745f` |
| `core/core-frontend/tests/filter-copy-mvp-tooltip/check.mjs` | `79545a2f255b07622c313b4237946a89bf0b87d08fa2522ef0b7a0375fbe7c65` |
| `core/core-frontend/node_modules/@antv/l7-core/lib/services/scene/SceneService.js` | `f142520ccdb2ee3621a581ca0545cc06dfc0ecbb4d5d367d7bb918d09aae6a98` |
| `core/core-frontend/node_modules/@antv/l7plot/dist/esm/core/map/index.js` | `da0a7863213fecf155772e8fe6331668b483d8aa7165638b8a1f5ba196155074` |
| `core/core-frontend/node_modules/@antv/l7plot/dist/esm/component/tooltip.js` | `b99f5486785f99246a1c00c48f3e0394e39b12fd8124fdb86ab817b815083b76` |

## 附录：28条cleanup顺序独立probe

在core/core-frontend运行 `node --input-type=module` heredoc；不写磁盘。保留当前实际loader和生产控制流，仅替换底部驱动。输出应为21通过、7重复清理反例。

```javascript
import fs from 'node:fs/promises'
const file=new URL('./tests/filter-copy-mvp-maps/check.mjs',import.meta.url)
let source=await fs.readFile(file,'utf8')
source=source.replace("const root = fileURLToPath(new URL('../../', import.meta.url))",'const root = '+JSON.stringify(process.cwd()+'/'))
source=source.replace('createRequire(import.meta.url)','createRequire('+JSON.stringify(file.href)+')')
for(const spec of ['@vue/compiler-sfc','typescript','vue','lodash-es'])
  source=source.replaceAll("from '"+spec+"'","from '"+import.meta.resolve(spec)+"'")
source=source.slice(0,source.indexOf('\nlet passed = 0,'))+`
const maps=['map-flow','map-heat','map-symbolic','map-polygon','bubble-map-polygon','map-point','bubble-map-point']
const complete=s=>{
  if(s.layers.length)for(const l of s.layers)l.emit('inited')
  else{for(const p of s.plots)p.emit('loaded');for(const d of s.dots){d.emit('add');d.emit('loaded')}}
}
let fail=0,pass=0
for(const refreshed of [false,true])
for(const order of ['unmount-dispose','dispose-unmount'])
for(const id of maps){
  const s=await load(id,'normal',{realScene:true}),pending=s.prepare()
  await sleep(15);complete(s);const r=await pending;assert.equal(r.ok,true)
  s.binding.current.value={...s.binding.current.value,phase:'active'}
  if(refreshed){await s.proxy.renderChart(s.response);await sleep(15)}
  const resources=s.plots.length?s.plots:s.scenes
  const pre=resources.map(x=>x.destroyCount)
  if(order==='unmount-dispose'){s.unmount();r.handle.dispose()}
  else{r.handle.dispose();s.unmount()}
  s.unmount();r.handle.dispose()
  const counts=resources.map(x=>x.destroyCount)
  if(counts.some(n=>n!==1))fail++;else pass++
  console.log(JSON.stringify({id,refreshed,order,pre,counts,vueError:String(s.error()||'')}))
}
console.log(JSON.stringify({pass,fail,execution:0}))
`
await import('data:text/javascript;base64,'+Buffer.from(source).toString('base64'))
```

自身SHA由写后只读重算回传root，不自指绑定。除本报告外无写入，不修改旧结论或重置轮次。
