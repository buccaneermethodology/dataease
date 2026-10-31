# C3 富文本独立验证 r001

**结论：BLOCKED（四类局部实现问题需修复，不能给 C3 成功准入）。** 现有16组组件协议检查和旧完整SFC的3个语义RED均复现，但独立追加的时序/编辑生命周期/内容比较检查反证了必要成功与隔离条件。这是本C3实现交付第 **1/3轮**，不重开已用完的UI设计第3/3轮。

- reviewed_at：2026-10-27T07:03:44.275962+00:00
- reviewer：`/root/chart_preview_state_trace`；C3作者：`/root/g2_closeout_reviewer`（fixture作者兼Builder）。
- snapshot_id：`S02-MVP-C3-INDEPENDENT-VALIDATION-r001`；as_of_state：Topology r454，root明确C3生产冻结后的当前字节。
- Card canonical SHA：`8475ca480e6f1b76469d21774a2e2b7cb33020e623a89aa2bba17ea4c2cd350e`；实际card/context验证exit0，10项required-read原字节SHA匹配。
- 独立性：本reviewer未编写C3生产SFC、runner或fixture，曾编写C4共享wrapper。只独立判断C3与其原始合同，C4仅核接口形状兼容，不用自身C4代码/绿测为独立验收。
- 唯一写入为本报告；未改源码/runner/fixture/旧证据，未安装、启动服务、查询数据库、提交或推送。

## 任务、原始范围与证据上限

原始Goal仍为同页同编辑会话、权限DEV测试桩下全部受支持图表的基本多条件整树复制粘贴，当前22项、15主case与49内建type保留。C3负责实际富文本SFC的Tiny init/content就绪、候选局部字段/内容、副作用隔离及同实例激活后的正常编辑刷新。Scope Delta: none。本轮不是通用异步/全面资源工程，也不代替真实TinyMCE资产、后端/权限、保存重开或49逐type证据。

已读原Goal、MVP authority、r002 Design/Cases、C234 fixture与第三轮review、C3 Builder报告、共享接口冻结快照；完整读取实际1194行SFC和668行runner/README及完整diff，并检查实际已安装@tinymce/tinymce-vue的init与onBeforeUnmount行为。以下finding使用实际生产控制流，追加驱动只存在内存，不修改任何冻结输入。

## 阻断发现

### C3V-001 / P1：内容就绪Promise获胜后，返回前的Editor错误/移除仍可报成功

位置：`DeRichTextView.vue:264-278`、`:970-1012`。

Error/remove handler会设置editorFailure或清除richEditor，并调用pendingPreparationFailure。但内层内容Promise一旦resolve，外层Promise.race可能已获成功；随后已知Error/remove无法改变已fulfilled结果。最终成功边界仅检查currentPaste，没有再核editorFailure、richEditor身份/初始化状态、body连接与内容有效性。

独立真实SFC探针：asyncContent模式init→真实setContent→emit SetContent→等待2个Promise微任务，确认prepare结果仍未交付，再emit Error/remove。tiny-normal/tiny-compare×两事件共4例均`resolvedBeforeError:false, ok:true`；remove例先模拟真实body断开，仍`connected:false, ok:true`。另探针0/1微任务会正确拒绝，而2/3/4微任务窗口漏判，说明不是Error seam无效。

影响：当前一次paste采用前已经错误/移除的Editor可被作为可采用handle交出，破坏“准备成功才采用、失败不假成功”。未在此probe执行wrapper publish，不能声称已实测Store/dirty写入。属于C3自己的成功边界，不依赖C4自验。

处置：Builder repair；已知失败/移除必须贯穿当前准备成功交付边界，不以race已fulfilled作为忽略失败的理由。复核后续微任务至实际采用前窗口，保留两个fixture/两事件回归；不只补某个固定await后的一次检查而留下其余窗口。

### C3V-002 / P2：Editor更换和已排队编辑回调没有按具体实例失效

位置：`:175-185`的document监听、`:274-278`的remove、`:286-308`的安装/nextTick，以及`:1050-1057`的组件级清理。

documentCleanups只在整个富文本组件dispose/unmount时清空，旧Editor的remove没有撤销其doc监听；handler只看组件richAlive/isPasteActive，不看richEditor是否仍为注册该handler的Editor。真实双击编辑走setEdit→reShow会重建Editor，因此旧doc监听与新Editor监听同时生效。另mousedown内排入nextTick的body没有存活复核，即使dispose已移除所有监听，已排队callback仍会改手柄DOM。

独立重现分两步：

1. 实际SFC prepare成功、binding phase=active，真实模板onDblclick→原setEdit/reShow→Vue重建Editor，新Editor init后，doc监听3→6；旧Editor已remove=1；一次mousedown触发两次clone，Vue错误为[]。probe仅补足原host父子/移除协议及TinyVue卸载时remove，未改生产方法；已读实际@tinymce-vue Editor.js onBeforeUnmount确实调用tinymce.remove。
2. adopted状态一次mousedown排nextTick→立即handle.dispose→flush，实际结果listeners=0/editorRemoved=1，但clones=1、旧手柄display='none'。证明清监听没有取消/约束已排队body。

影响/范围：旧Editor闭包可继续操纵当前编辑手柄，或在本实例已释放后修改旧DOM。旧legacy实现也有相似文档监听弱点，本文不伪称其全部由本次新引入；但C3本次引入的局部清理和实例存活边界未覆盖真实reShow与已排队工作，当前同实例编辑兼容仍有明确缺口。修复应局限当前Editor/本组件的已知监听与回调，不扩为应用全局监听框架。

处置/同类残余：按具体Editor归属清理或屏蔽旧doc回调，remove/替换时释放；每个延后callback执行时重新核Editor身份/存活，清理克隆手柄。检查ObjectSelected→adjustResizeHandles的nextTick及reShow/editCursor同类局部延后路径，未实测者不填PASS。应保留重复编辑和dispose前排队两个反例。

### C3V-003 / P2：内容等值归一化删除可见行内空白，可能错误接受不同正文

位置：`:908-919`。

removeIndent删除任意含element children的节点下所有纯空白text node，并没有区分块间缩进、行内间隔或white-space语义。例如期望`<p><span>甲</span> <span>乙</span></p>`的文本为“甲 乙”，实际正文`<p><span>甲</span><span>乙</span></p>`为“甲乙”，归一化后却同为“甲乙”并判相等。NBSP/保留空格上下文亦是同类风险，未声称本轮已穷举。

独立探针从实际SFC的TS AST取完整未改写normalizedRichContent initializer执行；用Vue实际HTML parser建立简单node树，再以明确DOM树double提供其读写接口，结果expectedText='甲 乙'、wrongText='甲乙'、normalizedExpectedText='甲乙'、normalizerTreatsAsEqual=true。这是比较谓词的有界直接反例，不冒充浏览器Tiny serializer运行。

影响：getContent/body双检查共享同一过宽谓词，内容事件后可接受可见文字不同的body，超出Design只忽略Tiny metadata/CSS等价与块间缩进的许可。当前runner的document.createElement只比原始innerHTML、无真实children解析，所以16绿未运行归一化核心分支。

处置：Builder repair；保留可见行内空白、NBSP及white-space保留语义，只忽略证明等价的编辑metadata/序列化差异。增加一个含嵌套行内元素可见空格的负例和必要等价序列化正例；不要把错误actual改成expected以取得GREEN。

### C3V-004 / P2：采用后本地段落适配仍受已结束paste操作的isCurrent限制

位置：`:470-487`、`:927-928`；实际wrapper成功后结束pasteOperation及request的调用边界仅用于接口因果核对，不自验C4。

currentPaste捕获该次准备的外部isCurrent。真实成功采用后请求settle、pasteOperation清空，旧isCurrent正常变false；但jumpTargetAdaptor的1秒timer始终要求该旧token为true，连后续active普通renderChart/assignment也继续使用它。因此成功采用后本地p.stopPropagation适配会永久跳过。

独立真实SFC对照：prepare成功→phase=active→public renderChart→advance1000。外部current保持true时本地p.onclick='event.stopPropagation()'；模拟已结束操作令current=false后，同样正常active刷新本地p仍oldClick()，旧/无关p也保持oldClick()。此false只模拟操作终态，不模拟组件卸载；richAlive仍true，正文正常刷新。现16组canonical例一直令current=true，遗漏真实操作终态。

影响：成功paste后的当前组件失去原段落点击防冒泡适配；准备期失效检查被错误沿用为active整个生命周期的永久禁用。局部化原全局timer是正确方向，但应分开candidate操作存活与active实例存活。

处置/同类残余：Builder repair；candidate迟到仍拒绝，active合法实例按自身存活/当前Editor判断，不能依赖已结清操作。保留current=true对照、成功终态false后正常刷新可执行以及dispose后不执行三轴，不让修复重新污染旧或无关p。

## 已执行结果

| 检查 | 实际结果 | 证明上限 |
| --- | --- | --- |
| richtext/check.mjs | exit0；16 PASS/0 semantic/0 execution | 完整真实SFC与Tiny协议double |
| richtext/check.mjs --baseline --before | exit1；0 PASS/3 semantic/0 execution | 旧完整SFC成功编译挂载，FONT/PARAGRAPH/CHANNEL三指定指纹；非缺新方法/编译错 |
| richtext/check.mjs --types | exit0；before1/current1/added=[] | 实际compileScript、原tsconfig options加内存allowJs:true局部诊断multiset；不改tsconfig、不称全项目类型通过 |
| SFC+runner定向ESLint | exit0 | lint |
| SFC定向stylelint | exit0，仅3条现有规则弃用提示 | style语法 |
| SFC parse/compileScript inlineTemplate + compileTemplate | exit0，无errors | 当前完整Vue编译 |
| 定向git diff --check | exit0 | 空白检查 |
| 独立Error/remove窗口 | 4反例：prepare未返回时失败仍ok；remove body断开仍ok | C3V-001 |
| 独立旧Editor/排队mousedown | 监听3→6/一次2clone；dispose后仍1clone | C3V-002 |
| 独立实际归一化initializer | 可见inline空格不同被判相同 | C3V-003，DOM树double |
| 独立采用后操作终态timer对照 | operationTerminal=true/current返回false时合法active本地p不再适配 | C3V-004 |

## 已查无新增问题的维度

- init未到前不setContent/不ready；先监听SetContent/LoadContent再setContent，同步/异步两种协议序通过。getContent与body均比较、connected和尺寸有检查；错误/资产错误/timeout/unmount早期拒绝成立，不把这些绿测外推到C3V-001窗口。
- 准备独立clone response，严格fields/sourceFields/tableRow形态检查，复用原initCurFields/formatter/assignment；metadata.fields与drill独立clone、kind/innerType/render与冻结接口兼容。候选没有curFields/element/Store写，没有二次query，正常/compare字段6761/店名与空值fixture通过。
- candidate不触全局appearance选择、不接公开fieldSelect；仅自身tinymceId的vertical channel且phase guard，旧/无关p保持原样。initCurFields(false)不提前发独立eventBus业务通知；激活只同步轻量channel/交互安装，不二次setContent/query，现同实例canonical文本更新例成立。
- richEditor===editor保护init/remove/error的旧实例晚到，不把旧init提升为当前ready；timeout/unmount waiters有拒绝，stopContent在finally移除，重复handle.dispose幂等。上述保护不覆盖C3V-002 document handler与其nextTick，报告分开陈述。
- legacy无binding实际query一次/details一次、正常字段替换/字体选择保持；全局p选择已收敛当前body/root。没有更改共享API/Tiny插件实现、权限或保存契约。

## 未检查与剩余责任

真实TinyMCE skin/language/plugin资产、真实浏览器HTML净化/serializer/布局、后端query与权限、保存/离开/重开、真实移动/嵌入、全49逐type与installed插件保持NOT_RUN；这些由root/后续非作者验收补证。现Editor/connected body/Store/DOM为协议double，未把SDK入口全部stub成prepare；真实生产SFC控制流、字段映射/formatter运行。阈值mappingColorCustom在现fixture threshold=false是unexpected-call stub，本轮不声称富文本阈值已验。未为全量类型基线安装依赖或改变规则。

旧源码全局p/font/channel的3个RED已复核，不代表全部旧准备故障。旧数字0的truthy占位等原业务语义未在本任务擅改；未将一般后续query乱序、任意全局资源泄漏改为本轮前置。

## 修后准入预测

当前需Builder按C3V-001..004逐项修复并记录处置；在同一实现累计第2/3轮独立delta验证重放原16/旧3RED/局部types与新反例，不重置预算。可预测修后有界C3模块准入，但真实Tiny/后端/保存及22项/49type仍不能被组件GREEN回填。每项关闭须有具体源码/行为证据，不能只以lint通过或“已处理”自报代替。

## 字节绑定

以下3项运行前后均与Builder冻结报告一致；10必读当前字节重算一致。新微任务/host/DOM树探针只存在内存，磁盘runner未变。

| 文件 | SHA-256 |
| --- | --- |
| `core/core-frontend/src/custom-component/rich-text/DeRichTextView.vue` | `4122e4684425e211e09b3975ae3a4deba6d3d8031cabe25712b860c5ef465322` |
| `core/core-frontend/tests/filter-copy-mvp-richtext/check.mjs` | `12d290a096250c9f823ae3fd45cd6356433a72c795be982da0641da36031766d` |
| `core/core-frontend/tests/filter-copy-mvp-richtext/README.md` | `e97bc39ac8e593025e178ef63ac00fe6984ebaeb739564c2b2f4c20d0f657a89` |

| 必读文件 | SHA-256 |
| --- | --- |
| `AGENTS.md` | `270940a30f462f2fb0c9a8cf2bbc1dd11750513d8f063ffc376e0e0a2640466e` |
| `.codex/skills/sge-governed-checkpoints/SKILL.md` | `c4d8463bc350c44ad600c92400f783c565b2e968720bfeed1df67a49112b8933` |
| `Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/Goal.final.json` | `9368cbbd96fd81b44006d72ec9bcdd94b60fbb69812c3f31c65e366bf1956e53` |
| `Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/planning/MvpScopeAuthority-20261027.json` | `641dfa78e63b1d53e25c08ea5c71c4458c272399c749aa84f0dea63ab89023a4` |
| `Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/MVP-20261027/UiIntegrationDesign-r002.md` | `ea2f947c370b554b8f9510d39924e1455c28705088bf4739df78c4725a034468` |
| `Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/MVP-20261027/UiIntegrationCases-r002.json` | `e365ef111582ef84f20f26e6136854409b7fc66bb0931cae40a9df5318036d55` |
| `Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/MVP-20261027/UiC234ConcreteFixtures-r001.json` | `cdec6ed17380d4cc62eba495c4edd785d12178fd4758a5cfb993dd530426f4d5` |
| `Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/MVP-20261027/reviews/UiIntegrationDesignReview-r003-C234.md` | `5d4c26ebda1ba9847e19ea1d04caa82d26a54cee01685a167d8313aa3114f4b2` |
| `Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/MVP-20261027/evidence/SliceC3RichText-r001.md` | `d30f75f7851ba78484e53775d72be2e677168da8b2efa7a623186b703536d52b` |
| `Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/MVP-20261027/c34-interface-snapshot-r001.ts` | `d3ebbd6236bf832df6e3e9971841a9ee68300dfb9e31a015c1532b5dc46a3e9e` |

## 附录A：真实SFC时序/编辑探针

在core/core-frontend以 `node --input-type=module -` 执行代码。原scenario/真实SFC控制流保持；额外TinyVue卸载remove及host父子关系是明确协议补齐，可在实际已安装Editor.js核对，不替换prepare/render/assignment。

```javascript
import fs from 'node:fs'
const file=new URL('./tests/filter-copy-mvp-richtext/check.mjs',import.meta.url)
let source=fs.readFileSync(file,'utf8')
source=source.replace("const root = fileURLToPath(new URL('../../', import.meta.url))",'const root = '+JSON.stringify(process.cwd()+'/'))
source=source.replace('createRequire(import.meta.url)','createRequire('+JSON.stringify(file.href)+')')
for(const spec of ['@vue/compiler-sfc','typescript','vue','lodash-es'])
 source=source.replaceAll("from '"+spec+"'","from '"+import.meta.resolve(spec)+"'")
source=source.replace('      editors.set(props.id, editor)',"      Vue.onBeforeUnmount(() => { editor.emit('remove'); editor.remove() })\n      editors.set(props.id, editor)")
source=source.replace('    proxy,\n    editor,\n    effects,','    proxy,\n    editor,\n    host,doc,editors,\n    effects,')
source=source.replace('      parent.children.push(node)','      node.parent=parent;parent.children.push(node)')
source=source.replace('      node.removed = true','      node.removed = true;if(node.parent)node.parent.children=node.parent.children.filter(x=>x!==node);node.parent=null')
source=source.replace('    parentNode: () => null,','    parentNode: node => node.parent,')
source=source.replace('    nextSibling: () => null,','    nextSibling: node => node.parent?.children[node.parent.children.indexOf(node)+1],')
source=source.slice(0,source.indexOf('\nconst records = []'))+`
for(const event of ['Error','remove'])for(const id of ['tiny-normal','tiny-compare']){
 const s=scenario(id,{asyncContent:true});let resolved=false;let result;
 const run=s.prepare().then(x=>{result=x;resolved=true});s.init();await Vue.nextTick();await Vue.nextTick();
 s.editor.emit('SetContent');await Promise.resolve();await Promise.resolve();
 const before=resolved;if(event==='remove')s.editor.body.isConnected=false;s.editor.emit(event,{message:'independent:before-adoption'});await run;
 console.log(JSON.stringify({id,event,resolvedBeforeError:before,ok:result?.ok,connected:s.editor.body.isConnected}));s.close()
}
for(const terminal of [false,true]){
 const s=scenario();const run=s.prepare();s.init();const result=await run;
 s.binding.current.value={...s.binding.current.value,phase:'active'};await Vue.nextTick()
 if(terminal)s.stale();s.proxy.renderChart(s.view);s.advance(1000);await Vue.nextTick()
 console.log(JSON.stringify({probe:'active-paragraph',operationTerminal:terminal,paragraph:s.editor.body.localP.getAttribute('onclick'),old:s.oldP.getAttribute('onclick')}));s.close()
}
{
 const s=scenario();const run=s.prepare();s.init();await run;s.binding.current.value={...s.binding.current.value,phase:'active'};await Vue.nextTick()
 const originalListeners=s.doc.listeners.length;s.host.children[0].onDblclick();s.advance(0);
 await Vue.nextTick();await Vue.nextTick();await Vue.nextTick()
 const next=[...s.editors.values()][0];next.initialized=true;next.emit('init')
 let clones=0;const handle={style:{},cloneNode:()=>({style:{}}),parentNode:{appendChild(){clones++}}}
 for(const [name,handler]of s.doc.listeners)if(name==='mousedown')handler({target:{closest:()=>handle}})
 await Vue.nextTick();console.log(JSON.stringify({probe:'editor-remount',originalListeners,listeners:s.doc.listeners.length,oldRemoved:s.editor.removed,distinct:next!==s.editor,clones,vueErrors:s.effects.filter(x=>x[0]==='vue-error')}));s.close()
}
{
 const s=scenario();const run=s.prepare();s.init();const result=await run;s.binding.current.value={...s.binding.current.value,phase:'active'};await Vue.nextTick()
 let clones=0;const handle={style:{},cloneNode:()=>({style:{}}),parentNode:{appendChild(){clones++}}}
 for(const [name,handler]of s.doc.listeners)if(name==='mousedown')handler({target:{closest:()=>handle}})
 result.handle.dispose();await Vue.nextTick();console.log(JSON.stringify({probe:'queued-after-dispose',clones,display:handle.style.display,listeners:s.doc.listeners.length,removed:s.editor.removed}));s.close()
}
`
await import('data:text/javascript;base64,'+Buffer.from(source).toString('base64'))
```

## 附录B：实际归一化函数反例

```javascript
import fs from 'node:fs'
import vm from 'node:vm'
import ts from 'typescript'
import {parse} from '@vue/compiler-sfc'
import {baseParse} from '@vue/compiler-dom'
const filename='src/custom-component/rich-text/DeRichTextView.vue'
const ast=ts.createSourceFile(filename+'.ts',parse(fs.readFileSync(filename,'utf8')).descriptor.scriptSetup.content,ts.ScriptTarget.Latest,true)
let code
for(const stmt of ast.statements)if(ts.isVariableStatement(stmt))
 for(const d of stmt.declarationList.declarations)if(d.name.getText(ast)==='normalizedRichContent')code=d.initializer.getText(ast)
class Node {
 constructor(tag='',text=''){this.tag=tag;this.data=text;this.nodeType=tag?1:3;this.childNodes=[];this.attributes=[]}
 get children(){return this.childNodes.filter(x=>x.nodeType===1)}
 get textContent(){return this.nodeType===3?this.data:this.childNodes.map(x=>x.textContent).join('')}
 set innerHTML(html){const convert=a=>{const node=new Node(a.type===1?a.tag:'',a.type===2?a.content:'');node.childNodes=(a.children||[]).map(convert);for(const child of node.childNodes)child.parentNode=node;return node};this.childNodes=baseParse(html).children.map(convert);for(const child of this.childNodes)child.parentNode=this}
 querySelectorAll(selector){const all=this.children.flatMap(x=>[x,...x.querySelectorAll('*')]);return selector==='*'?all:[]}
 hasAttribute(){return false}
 removeChild(child){this.childNodes=this.childNodes.filter(x=>x!==child)}
 isEqualNode(other){const form=n=>({tag:n.tag,text:n.data,children:n.childNodes.map(form)});return JSON.stringify(form(this))===JSON.stringify(form(other))}
}
const js=ts.transpileModule('const run='+code,{compilerOptions:{target:ts.ScriptTarget.ES2022}}).outputText+';run'
const run=vm.runInNewContext(js,{document:{createElement:()=>new Node('div')}})
const expected='<p><span>甲</span> <span>乙</span></p>',wrong='<p><span>甲</span><span>乙</span></p>'
const expectedRoot=new Node('div');expectedRoot.innerHTML=expected;const wrongRoot=new Node('div');wrongRoot.innerHTML=wrong
console.log(JSON.stringify({expectedText:expectedRoot.textContent,wrongText:wrongRoot.textContent,normalizedExpectedText:run(expected).textContent,normalizerTreatsAsEqual:run(expected).isEqualNode(run(wrong)),domTreeDouble:true}))
```
