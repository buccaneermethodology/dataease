import assert from 'node:assert/strict'
import fs from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { createHash } from 'node:crypto'
import { parse, compileScript, compileTemplate } from '@vue/compiler-sfc'
import { build } from 'esbuild'
import ts from 'typescript'
import * as lodash from 'lodash-es'
const root = fileURLToPath(new URL('../../', import.meta.url))
const repo = path.resolve(root, '../..')
const owners = await fs.readdir(path.join(repo, 'Dashboard/Artifacts'))
const artifacts = path.join(
  repo,
  'Dashboard/Artifacts',
  owners.find(name => name.startsWith('DT_DM-478391')),
  'S02-F01/MVP-20261027'
)
const fixture = JSON.parse(
  await fs.readFile(path.join(artifacts, 'UiC234ConcreteFixtures-r001.json'), 'utf8')
)
const baseline = process.argv.includes('--baseline')
const relative = 'src/custom-component/picture-group/Component.vue'
let bytes = await fs.readFile(path.join(root, relative), 'utf8')
if (baseline) {
  bytes = await fs.readFile(path.join(artifacts, 'picture-resource-ready-before-r001/Component.vue'), 'utf8')
  assert.equal(createHash('sha256').update(bytes).digest('hex'), 'acd9737cec09583f9a959e2782bbdab4fe503f4c4d35db07ca57e913f4a84f32')
}
const parsed = parse(bytes, { filename: relative })
assert.deepEqual(parsed.errors, [])
const script = compileScript(parsed.descriptor, {
  id: 'picture-real',
  inlineTemplate: true
}).content.replace('__expose({', '__expose({ __testState: state, __testSetImage: value => pictureImage.value = value, __testSetRoot: value => pictureRoot.value = value,')
// 仅添加测试状态访问口，候选准备逻辑保持生产源码原样。
let attrSource = await fs.readFile(
  path.join(root, 'src/custom-component/picture-group/Attr.vue'),
  'utf8'
)
const attr = parse(attrSource, { filename: 'Attr.vue' }).descriptor
const attrScript = compileScript(attr, { id: 'picture-attr' }).content
const attrTemplate = compileTemplate({
  source: attr.template.content,
  id: 'picture-attr',
  filename: 'Attr.vue'
})
assert.deepEqual(attrTemplate.errors, [])
const table = await fs.readFile(
  path.join(root, 'src/views/chart/components/js/panel/common/common_table.ts'),
  'utf8'
)
const ast = ts.createSourceFile('table.ts', table, ts.ScriptTarget.Latest, true)
const mapping = ast.statements
  .find(node => ts.isFunctionDeclaration(node) && node.name?.text === 'mappingColorCustom')
  .getText(ast)
const provider = `
import {reactive,toRef} from 'vue'
import {resourceImage,clearResourceImages,cacheHooks} from '@/utils/resourceImageCache'
export {cacheHooks}
export const env=reactive({writes:[],queries:[],directory:[],dv:{canvasViewInfo:{},mobileInPc:false,fullscreenFlag:false,batchOptStatus:false,dvInfo:{id:'resource'},editMode:'edit',curComponent:{id:'picture-on'}},user:{uid:'u',oid:'o',token:'synthetic',time:1,proxyInfo:{proxy:false,proxyOid:null}}})
export let response
export const setResponse=value=>{response=value}
export const dvMainStoreWithOut=()=>env.dv
export const useUserStoreWithOut=()=>env.user
export const storeToRefs=value=>Object.fromEntries(Object.keys(value).map(key=>[key,toRef(value,key)]))
export const getData=input=>{env.queries.push(input);return Promise.resolve(response)}
export const getFieldByDQ=(...args)=>{env.directory.push(args);return Promise.resolve({dimensionList:[{id:'1715053944934',deType:0}],quotaList:[{id:'1715053944937',deType:2}]})}
export const useCache=()=>({wsCache:{get:key=>({'user.uid':'u','user.oid':'o','user.token':'synthetic','user.time':1})[key]}})
export const useI18n=()=>({t:key=>key})
export const useRoute=()=>({path:'/dashboard'})
export const ElMessageBox={confirm:()=>Promise.resolve()}
export let scope='synthetic-resource-identity'
export let mode='cache'
export let pending
export let requests=0
export let signals=[]
export let expectedAborts=new Set()
export const resetResource=()=>{
 clearResourceImages();requests=0;signals=[];expectedAborts=new Set();mode='cache';scope='synthetic-resource-identity';cacheHooks.before=null;cacheHooks.after=null;cacheHooks.calls=0;cacheHooks.events=[]
 let resolve,reject
 const promise=new Promise((r,j)=>{resolve=r;reject=j})
 pending={promise,resolve,reject}
}
export const setMode=value=>{mode=value}
export const renewNetwork=()=>{let resolve,reject;const promise=new Promise((r,j)=>{resolve=r;reject=j});pending={promise,resolve,reject};return pending}
export const clearCache=()=>{signals.forEach(signal=>expectedAborts.add(signal));clearResourceImages()}
export const seedUnrelated=()=>resourceImage(scope,'/static-resource/unrelated.svg',()=>Promise.reject(Error('UNRELATED')))
export const imgUrlTrans=value=>mode==='external'?'https://fixture.invalid/test.svg':mode==='relative'?'/images/test.svg':mode==='data'?value:resourceImage(scope,'/static-resource/s02-test.svg',signal=>{signals.push(signal);requests++;return pending.promise})
export const parseJson=value=>typeof value==='string'?JSON.parse(value):value
export const deepCopy=value=>JSON.parse(JSON.stringify(value))
export default {getChartView:()=>({axis:['filter']})}
`
const providers = new Set([
  '@/utils/imgUtils',
  '@/store/modules/data-visualization/dvMain',
  '@/api/chart',
  '@/views/chart/components/js/util',
  'pinia',
  '@/utils/utils',
  '@/hooks/web/useI18n',
  '@/hooks/web/useCache',
  '@/store/modules/user',
  'vue-router_2',
  'element-plus-secondary',
  '@/views/chart/components/js/panel'
])
const cacheHarness = `
import {resourceImage,clearResourceImages,waitForResourceImages as productionWait} from 'test:cache-core'
export {resourceImage,clearResourceImages}
export const cacheHooks={before:null,after:null,calls:0,events:[]}
export const waitForResourceImages=async root=>{
 const call=++cacheHooks.calls
 cacheHooks.events.push({phase:'before',call,src:root.querySelectorAll('img')[0]?.src})
 await cacheHooks.before?.(call,root)
 await productionWait(root)
 cacheHooks.events.push({phase:'after',call,src:root.querySelectorAll('img')[0]?.src})
 await cacheHooks.after?.(call,root)
}
`
const bundle = await build({
  stdin: {
    contents: `export {default as Picture} from 'test:picture';export {default as Attr} from 'test:attr';export {env,setResponse,resetResource,setMode,clearCache,imgUrlTrans,pending,requests,signals,expectedAborts,seedUnrelated,cacheHooks,renewNetwork} from 'test:providers';export {reactive,shallowRef,createRenderer,h,nextTick} from 'vue';`,
    resolveDir: root
  },
  bundle: true,
  write: false,
  format: 'esm',
  platform: 'node',
  define: {
    'import.meta.env.DEV': 'true',
    'import.meta.env.VITE_FILTER_COPY_DEV_VALIDATION': '"true"'
  },
  plugins: [
    {
      name: 'picture-providers',
      setup(builder) {
        builder.onResolve({ filter: /.*/ }, args => {
          if (args.path === 'test:cache-core') return {path:path.join(root,'src/utils/resourceImageCache.ts')}
          if (args.path === '@/utils/resourceImageCache') return {path:'cache-harness',namespace:'test'}
          if (args.path === 'axios') return {path:path.join(root,'node_modules/axios/dist/browser/axios.cjs')}
          if (args.path === 'test:picture') return { path: 'picture', namespace: 'test' }
          if (args.path === 'test:attr') return { path: 'attr', namespace: 'test' }
          if (args.path === 'test:providers' || providers.has(args.path))
            return { path: 'providers', namespace: 'test' }
          if (args.path === '@/views/chart/components/js/panel/common/common_table')
            return { path: 'mapping', namespace: 'test' }
          if (args.path.endsWith('.vue')) return { path: 'child', namespace: 'test' }
          if (args.path.startsWith('@/'))
            return {
              path:
                path.join(root, 'src', args.path.slice(2)) + (path.extname(args.path) ? '' : '.ts')
            }
        })
        builder.onLoad({ filter: /.*/, namespace: 'test' }, args => ({
          contents:
            args.path === 'cache-harness'
              ? cacheHarness
              : args.path === 'picture'
              ? script
              : args.path === 'attr'
              ? attrScript
              : args.path === 'providers'
              ? provider
              : args.path === 'mapping'
              ? mapping
              : `import {h} from 'vue';export default {render(){return h('div',{class:'fixture-empty'})}}`,
          loader: 'ts',
          resolveDir: root
        }))
      }
    }
  ]
})
const m = await import(
  `data:text/javascript;base64,${Buffer.from(bundle.outputFiles[0].text).toString('base64')}`
).catch(error=>{console.error('HARNESS_IMPORT',error.message);process.exit(2)})
let clock = 0,
  nextTimer = 0
const timers = new Map()
const oldPerformance = globalThis.performance
Object.defineProperty(globalThis,'performance',{value:{now:()=>clock},configurable:true})
const oldSet = globalThis.setTimeout,
  oldClear = globalThis.clearTimeout
globalThis.setTimeout = (fn, delay) => {
  const id = ++nextTimer
  timers.set(id, { fn, at: clock + delay })
  return id
}
globalThis.clearTimeout = id => timers.delete(id)
globalThis.window = { setInterval, clearInterval }
const deferred = () => {
  let resolve, reject
  const promise = new Promise((r, j) => {
    resolve = r
    reject = j
  })
  // 只观察未消费的拒绝；原promise仍reject，实际await者仍必须处理失败。
  promise.catch(() => undefined)
  return { promise, resolve, reject }
}
let images = []
class Node {
  constructor(tag, text = '') {
    this.tag = tag
    this.text = text
    this.children = []
    this.props = {}
    this.parent = null
    this.listeners = new Map()
    this.complete = false
    this.naturalWidth = 0
    this.decodeTask = deferred()
    this.decodeCalls = 0
    this.generations = []
    this.srcWrites = []
    this.decodeHook = null
    this.scanHook = null
    if (tag === 'img') images.push(this)
  }
  get src() {
    const value = this.props.src || ''
    return value ? new URL(value, 'http://fixture.local/').href : ''
  }
  getAttribute(name) { return this.props[name] ?? null }
  querySelectorAll(selector) {
    this.scanHook?.(selector)
    return this.children.flatMap(node => [
      ...(selector === '*' || selector === node.tag ? [node] : []),
      ...node.querySelectorAll(selector)
    ])
  }
  get isConnected() {
    return this.tag === 'root' || !!this.parent?.isConnected
  }
  addEventListener(name, listener) {
    if (!this.listeners.has(name)) this.listeners.set(name, new Set())
    this.listeners.get(name).add(listener)
  }
  removeEventListener(name, listener) {
    this.listeners.get(name)?.delete(listener)
  }
  decode() {
    this.decodeCalls++
    return this.decodeHook ? this.decodeHook() : this.decodeTask.promise
  }
  dispatch(name) {
    for (const listener of this.listeners.get(name) || []) listener()
  }
  remove() {
    if (this.parent) this.parent.children = this.parent.children.filter(item => item !== this)
    this.parent = null
  }
}
globalThis.HTMLImageElement = class {
  static [Symbol.hasInstance](value) { return value?.tag === 'img' }
}
globalThis.getComputedStyle = () => ({ backgroundImage: 'none' })
globalThis.FileReader = class {
  readAsDataURL(blob) {
    blob.arrayBuffer().then(bytes => {
      this.result = 'data:' + blob.type + ';base64,' + Buffer.from(bytes).toString('base64')
      this.onload?.()
    }, error => { this.error = error; this.onerror?.() })
  }
}
const renderer = m.createRenderer({
  createElement: tag => new Node(tag),
  createText: text => new Node('#text', text),
  createComment: text => new Node('#comment', text),
  insert: (node, parent, anchor) => {
    node.remove()
    node.parent = parent
    const index = parent.children.indexOf(anchor)
    parent.children.splice(index < 0 ? parent.children.length : index, 0, node)
  },
  remove: node => node.remove(),
  parentNode: node => node.parent,
  nextSibling: node => node.parent?.children[node.parent.children.indexOf(node) + 1],
  setText: (node, text) => {
    node.text = text
  },
  setElementText: (node, text) => {
    node.text = text
  },
  patchProp: (node, key, old, value) => {
    if (node.tag === 'img' && key === 'src' && value) {
      node.srcWrites.push({at:clock,value})
      if(old !== value){
        node.complete=false;node.naturalWidth=0;node.decodeTask=deferred()
        node.generations.push({src:value,decodeTask:node.decodeTask})
      }
      node.listenersBeforeSrc =
        !!node.listeners.get('load')?.size && !!node.listeners.get('error')?.size
    }
    node.props[key] = value
  }
})
const flush = async () => {
  await m.nextTick()
  await m.nextTick()
  await Promise.resolve()
}
function input(id = 'picture-on', value = 6761, empty = false) {
  const f = fixture.fixtures[id]
  const view = {
    customAttr: { basicStyle: {}, label: {}, tooltip: {} },
    customStyle: { legend: {} },
    senior: { threshold: {} }
  }
  for (const [key, v] of Object.entries(f.view_assignments))
    lodash.set(view, key, lodash.cloneDeep(v))
  if (empty)
    view.senior.threshold.tableThreshold[0].conditions =
      view.senior.threshold.tableThreshold[0].conditions.filter(item => item.term !== 'default')
  const response = {
    ...lodash.cloneDeep(view),
    data: lodash.cloneDeep(f.response_data),
    totalItems: 1,
    calParams: []
  }
  response.data.tableRow[0].f_amount = value
  return { view, element: lodash.cloneDeep(f.element), response }
}
function mount(id, value, empty = false) {
  images = []
  const item = input(id, value, empty)
  m.env.writes.length = 0
  m.env.queries.length = 0
  m.env.dv.canvasViewInfo = { [item.view.id]: lodash.cloneDeep(item.view) }
  m.env.dv.setViewDataDetails = (...args) => m.env.writes.push(args)
  m.setResponse(item.response)
  const binding = {
    current: m.shallowRef({
      phase: 'candidate',
      view: m.reactive(item.view),
      element: m.reactive(item.element)
    })
  }
  const app = renderer.createApp(m.Picture, {
    pasteBinding: binding,
    suffixId: 'picture-candidate',
    view: binding.current.value.view,
    element: binding.current.value.element,
    showPosition: 'canvas'
  })
  const proxy = app.mount(new Node('root'))
  return {
    app,
    proxy,
    binding,
    item,
    get image() {
      return images.at(-1)
    }
  }
}


// 执行真实SFC/cache/helper；状态访问口只用于注入冻结的内部状态失效场景。
const results=[]
let active=[]
const pump=async()=>{for(let i=0;i<30;i++)await flush()}
const expire=()=>{clock+=10000;for(const [id,t] of [...timers])if(t.at<=clock){timers.delete(id);t.fn()}}
const fixtureBlob=()=>new Blob(['<svg xmlns="http://www.w3.org/2000/svg" width="120" height="80"><text>S02 MVP</text></svg>'],{type:'image/svg+xml'})
function start({id='picture-on',empty=false,mode='cache',reset=true}={}){
 if(reset)m.resetResource();m.setMode(mode)
 const f=mount(id,empty?null:6761,empty)
 let ownedImage
 Object.defineProperty(f,'image',{get(){ownedImage??=images.at(-1);return ownedImage}})
 let current=true,done=false,result,settlements=0,srcWritesAtSettle=0
 const t={f,get done(){return done},get result(){return result},get settlements(){return settlements},get srcWritesAtSettle(){return srcWritesAtSettle},stale(){current=false}}
 t.promise=f.proxy.prepareFilterPaste(id==='picture-off'?{kind:'static-picture',local:f.item.view}:{kind:'queried',request:f.item.view,response:f.item.response},f.binding,()=>current).then(r=>{done=true;result=r;settlements++;srcWritesAtSettle=f.image?.srcWrites.length||0;return r})
 active.push(t);return t
}
const loadImage=image=>{image.complete=true;image.naturalWidth=120;image.decodeTask.resolve();image.dispatch('load')}
async function drive(t){for(let i=0;i<6&&!t.done;i++){await pump();if(t.f.image)loadImage(t.f.image)}await pump()}
const denied=t=>{assert.equal(t.done,true,'PIC-RR-NOT-SETTLED');assert.equal(t.result.ok,false,'PIC-RR-INVALID-READY')}
const ready=t=>{assert.equal(t.done,true,'PIC-RR-NOT-READY');assert.equal(t.result.ok,true,'PIC-RR-VALID-REJECTED')}
const noSideEffects=()=>{assert.equal(m.env.writes.length,0,'PIC-RR-SHARED-WRITE');assert.equal(m.env.queries.length,0,'PIC-RR-EXTRA-QUERY')}
async function cleanup(){
 let failure
 for(const t of active){
  try{
   noSideEffects()
   if(t.done){
    for(const ls of t.f.image?.listeners.values()||[])assert.equal(ls.size,0,'PIC-RR-FINISH-LISTENER-LEAK')
    assert.equal(timers.size,0,'PIC-RR-FINISH-TIMER-LEAK')
    assert.equal(t.f.image?.srcWrites.length||0,t.srcWritesAtSettle,'PIC-RR-LATE-SRC-WRITE')
   }
   if(t.f.image)assert.equal(t.f.image.listenersBeforeSrc,true,'PIC-RR-LISTENERS-AFTER-SRC')
   assert.ok(m.signals.every(signal=>!signal.aborted||m.expectedAborts.has(signal)),'PIC-RR-SHARED-REQUEST-ABORTED')
  }catch(e){failure??=e}
  t.result?.handle?.dispose();t.f.app.unmount();await pump()
  try{assert.ok(m.signals.every(signal=>!signal.aborted||m.expectedAborts.has(signal)),'PIC-RR-CANCEL-ABORTED-SHARED');assert.equal(t.settlements,1,'PIC-RR-RESOLVE-COUNT');for(const ls of t.f.image?.listeners.values()||[])assert.equal(ls.size,0,'PIC-RR-LISTENER-LEAK')}catch(e){failure??=e}
 }
 try{noSideEffects();assert.equal(timers.size,0,'PIC-RR-TIMER-LEAK')}catch(e){failure??=e}
 m.clearCache();active=[];if(failure)throw failure
}
async function check(id,schedule,fn){
 let error
 try{await fn();noSideEffects()}catch(e){error=e}
 const events=JSON.parse(JSON.stringify(m.cacheHooks.events))
 try{await cleanup()}catch(e){error??=e}
 results.push({id,schedule,status:error?'FAIL':'PASS',...(error?{fingerprint:String(error.message).split('\n')[0]}:{}),helper_events:events})
}
await check('PIC-RR-01','pending placeholder load/decode before first barrier scan',async()=>{
 const t=start();let beforeScan=false
 m.cacheHooks.before=call=>{if(call===1){loadImage(t.f.image);beforeScan=true}}
 await pump();if(baseline)loadImage(t.f.image);await pump()
 assert.ok(baseline||beforeScan,'PIC-RR-PRE-SCAN-NOT-REACHED');assert.equal(t.done,false,'PIC-RR-PENDING-PLACEHOLDER-READY')
})
for(const phase of ['before first scan','after first scan']){
 await check('PIC-RR-02','success '+phase,async()=>{
  const t=start()
  if(phase==='before first scan')m.cacheHooks.before=async call=>{if(call===1){m.pending.resolve(fixtureBlob());await pump();assert.notEqual(t.f.image.props.src,m.imgUrlTrans('fixture'),'PIC-RR-SCAN-RACE-NOT-REACHED')}}
  else{await pump();assert.ok(baseline||m.cacheHooks.calls>=1);m.pending.resolve(fixtureBlob())}
  if(baseline&&phase==='before first scan')m.pending.resolve(fixtureBlob())
  await drive(t);ready(t);assert.equal(t.f.image.props.src,m.imgUrlTrans('fixture'),'PIC-RR-FINAL-URL-NOT-RESOLVED')
  assert.ok(Buffer.from(t.f.image.props.src.split(',')[1],'base64').toString().includes('S02 MVP'),'PIC-RR-PLACEHOLDER-READY')
 })
 await check('PIC-RR-03','failure '+phase,async()=>{
  const t=start()
  if(phase==='before first scan')m.cacheHooks.before=async call=>{if(call===1){m.pending.reject(Error('TEST_HTTP_403'));await pump();assert.notEqual(t.f.image.props.src,m.imgUrlTrans('fixture'),'PIC-RR-SCAN-RACE-NOT-REACHED')}}
  else{await pump();m.pending.reject(Error('TEST_HTTP_403'))}
  if(baseline&&phase==='before first scan')m.pending.reject(Error('TEST_HTTP_403'))
  await drive(t);denied(t)
 })
}
await check('PIC-RR-02','final load before resourceReady gate',async()=>{
 const t=start();m.pending.resolve(fixtureBlob());let gateObserved=false
 m.cacheHooks.after=(_call,root)=>{const img=root.querySelectorAll('img')[0];if(img.props.src===m.imgUrlTrans('fixture')){loadImage(img);gateObserved=true}}
 await drive(t);ready(t);assert.ok(baseline||gateObserved)
})
await check('PIC-RR-04','ordinary deterministic completion',async()=>{
 const t=start();m.pending.resolve(new Blob(['not image'],{type:'text/plain'}));await drive(t);denied(t)
})
await check('PIC-RR-05','ordinary deterministic completion',async()=>{
 const first=start();m.pending.reject(Error('TEST_FAILED_CACHE'));await drive(first)
 first.f.app.unmount();await pump()
 const again=start({reset:false});await drive(again);denied(again);assert.equal(m.requests,1,'PIC-RR-FAILED-CACHE-RETRIED')
})
await check('PIC-RR-06','unmount during helper',async()=>{
 const t=start();await pump();const src=t.f.image.props.src;t.f.app.unmount();m.pending.resolve(fixtureBlob());await drive(t);denied(t);assert.equal(t.f.image.props.src,src,'PIC-RR-LATE-SRC-WRITE')
})
await check('PIC-RR-06','duplicate dispose/unmount',async()=>{
 const t=start({mode:'data'});await drive(t);ready(t);t.result.handle.dispose();t.result.handle.dispose();t.f.app.unmount();t.f.image.dispatch('load');await pump();assert.equal(t.settlements,1)
})
await check('PIC-RR-07','isCurrent false during helper',async()=>{
 const t=start();await pump();const src=t.f.image.props.src;t.stale();m.pending.resolve(fixtureBlob());await drive(t);denied(t);assert.equal(t.f.image.props.src,src)
})
async function finalDecodeFixture(mode='data',configure=()=>undefined){
 const t=start({mode});await pump();configure(t)
 const finalDecode=deferred();let finalCalls=0
 t.f.image.decodeHook=()=>{
  finalCalls++
  return mode==='cache'&&finalCalls===1?t.f.image.decodeTask.promise:finalDecode.promise
 }
 if(mode==='cache'){m.pending.resolve(fixtureBlob());await pump()}
 t.f.image.complete=true;t.f.image.naturalWidth=120;t.f.image.decodeTask.resolve()
 t.f.image.dispatch('load');await pump()
 if(!baseline)assert.equal(finalCalls,mode==='cache'?2:1,'PIC-RR-FINAL-DECODE-NOT-ENTERED')
 return {t,finalDecode,get finalCalls(){return finalCalls}}
}
await check('PIC-RR-07','isCurrent false during decode',async()=>{
 const {t,finalDecode}=await finalDecodeFixture();t.stale();finalDecode.resolve();await pump();denied(t)
})
await check('PIC-RR-08','10s total expires while load deferred',async()=>{
 const t=start();await pump();expire();await pump();denied(t)
})
await check('PIC-RR-08','late success does not change src',async()=>{
 const t=start();await pump();const src=t.f.image.props.src;expire();m.pending.resolve(fixtureBlob());await drive(t);denied(t);assert.equal(t.f.image.props.src,src)
})
await check('PIC-RR-08','absolute deadline without timer callback',async()=>{
 const t=start();await pump();clock+=10000;m.pending.resolve(fixtureBlob());await drive(t);denied(t)
})
await check('PIC-RR-09','ordinary deterministic completion',async()=>{
 const t=start();await pump();const target=t.f.image
 const outsideRoot=new Node('root'),outsideImage=new Node('img')
 outsideImage.parent=outsideRoot;outsideRoot.children.push(outsideImage);outsideImage.props.src=m.seedUnrelated()
 images=[target];await pump();m.pending.resolve(fixtureBlob());await drive(t);ready(t);outsideImage.remove()
})
for(const mode of ['data','external','relative'])await check(mode==='data'?'PIC-RR-10':'PIC-RR-11',mode+' actual load/decode required',async()=>{
 const {t,finalDecode}=await finalDecodeFixture(mode);assert.equal(t.done,false,'PIC-RR-DECODE-NOT-AWAITED');finalDecode.resolve();await pump();ready(t)
 if(mode==='relative')assert.notEqual(t.f.image.src,t.f.image.getAttribute('src'))
})
await check('PIC-RR-11','external error rejects',async()=>{
 const t=start({mode:'external'});await pump();t.f.image.dispatch('error');await pump();denied(t)
})
await check('PIC-RR-12','ordinary deterministic completion',async()=>{
 const t=start({empty:true});await pump();ready(t);assert.equal(t.f.image,undefined);assert.equal(m.requests,0)
})
await check('PIC-RR-13','ordinary deterministic completion',async()=>{
 const t=start({id:'picture-off',mode:'data'});await drive(t);ready(t);assert.equal(t.result.handle.metadata.queried,false)
})
await check('PIC-RR-14','ordinary deterministic completion',async()=>{
 const {t,finalDecode}=await finalDecodeFixture();finalDecode.reject(Error('TEST_DECODE'));await pump();denied(t)
})
await check('PIC-RR-15','clear before first scan',async()=>{
 const t=start();let cleared=false
 m.cacheHooks.before=async call=>{if(call===1){m.clearCache();m.renewNetwork();m.pending.resolve(fixtureBlob());cleared=true}}
 if(baseline)m.pending.resolve(fixtureBlob())
 await drive(t);ready(t);assert.ok(baseline||cleared);assert.equal(t.f.image.props.src,m.imgUrlTrans('fixture'),'PIC-RR-REBUILT-PLACEHOLDER-READY')
})
await check('PIC-RR-15','clear between barriers with recreate',async()=>{
 const t=start();m.pending.resolve(fixtureBlob());let cleared=false
 m.cacheHooks.after=async call=>{if(call===1){m.clearCache();m.renewNetwork();m.pending.resolve(fixtureBlob());cleared=true}}
 await drive(t);ready(t);assert.ok(baseline||cleared);assert.equal(t.f.image.props.src,m.imgUrlTrans('fixture'),'PIC-RR-REBUILT-PLACEHOLDER-READY')
})
await check('PIC-RR-15','clear during final decode',async()=>{
 const {t,finalDecode}=await finalDecodeFixture('cache');assert.equal(t.done,false,'PIC-RR-FINAL-DECODE-NOT-PENDING');m.clearCache();m.renewNetwork();finalDecode.resolve();await pump();denied(t)
})
await check('PIC-RR-16','sourceUrl changes during helper',async()=>{
 const t=start();await pump();assert.ok(t.f.proxy.__testState,'TEST_STATE_SEAM_MISSING');t.f.proxy.__testState.showUrl='https://fixture.invalid/changed.svg';m.pending.resolve(fixtureBlob());await drive(t);denied(t)
})
await check('PIC-RR-16','src attribute changes during decode',async()=>{
 const {t,finalDecode}=await finalDecodeFixture();t.f.image.props.src='https://fixture.invalid/changed.svg';assert.equal(t.f.image.complete,true);assert.equal(t.f.image.naturalWidth,120);finalDecode.resolve();await pump();denied(t)
})
for(const target of ['image','root'])await check('PIC-RR-16',target+' disconnected',async()=>{
 const {t,finalDecode}=await finalDecodeFixture();if(target==='image')t.f.image.remove();else t.f.image.parent.remove();finalDecode.resolve();await pump();denied(t)
})
await check('PIC-RR-02','new src generation remains pending until its own decode',async()=>{
 const t=start();await pump();loadImage(t.f.image);const oldTask=t.f.image.decodeTask
 m.pending.resolve(fixtureBlob());await pump()
 assert.notEqual(t.f.image.decodeTask,oldTask,'PIC-RR-DECODE-GENERATION-REUSED')
 assert.equal(t.f.image.complete,false,'PIC-RR-COMPLETE-GENERATION-REUSED')
 assert.equal(t.f.image.naturalWidth,0,'PIC-RR-WIDTH-GENERATION-REUSED')
 assert.equal(t.done,false,'PIC-RR-FINAL-PIXELS-NOT-AWAITED');await drive(t);ready(t)
})
for(const elapsed of [9999,10000])await check('PIC-RR-08','decode deadline '+elapsed+'ms without timer dispatch',async()=>{
 const {t,finalDecode}=await finalDecodeFixture();clock+=elapsed;finalDecode.resolve();await pump()
 if(elapsed===9999)ready(t);else denied(t)
})
await check('PIC-RR-08','multiple resource phases share original 10s deadline',async()=>{
 const began=clock
 const {t,finalDecode}=await finalDecodeFixture('cache',()=>{
  m.cacheHooks.after=call=>{if(call===1)clock+=6000;else if(call===2)clock+=3000}
 })
 assert.equal(clock-began,9000,'PIC-RR-PHASE-SCHEDULE-MISSED')
 assert.equal(timers.size,1);assert.equal([...timers.values()][0].at,began+10000,'PIC-RR-TIMEOUT-RESTARTED')
 clock+=1000;finalDecode.resolve();await pump();denied(t)
})
await check('PIC-RR-14','real cache final candidate decode rejects',async()=>{
 const {t,finalDecode}=await finalDecodeFixture('cache');finalDecode.reject(Error('TEST_FINAL_DECODE'));await pump();denied(t)
})
for(const target of ['image','root'])await check('PIC-RR-16',target+' replaced while still connected',async()=>{
 const {t,finalDecode}=await finalDecodeFixture()
 if(target==='image'){
  const original=t.f.image,replacement=new Node('img');replacement.parent=original.parent;replacement.parent.children.push(replacement)
  images=[original];t.f.proxy.__testSetImage(replacement)
 }else{
  const replacement=new Node('div');replacement.parent=new Node('root');replacement.parent.children.push(replacement)
  t.f.proxy.__testSetRoot(replacement)
 }
 finalDecode.resolve();await pump();denied(t)
})
globalThis.setTimeout=oldSet;globalThis.clearTimeout=oldClear
Object.defineProperty(globalThis,'performance',{value:oldPerformance,configurable:true})
console.log(JSON.stringify({results,passed:results.filter(x=>x.status==='PASS').length,failed:results.filter(x=>x.status==='FAIL').length,production_sfc_cache_helper:true,test_only_exposed_state:true,host_network_file_reader_decode_doubles:true,real_browser:false,independent_validation:false},null,2))
process.exitCode=results.some(x=>x.status==='FAIL')?1:0
