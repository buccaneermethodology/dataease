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
}).content
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
import {resourceImage,clearResourceImages} from '@/utils/resourceImageCache'
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
export const resetResource=()=>{
 clearResourceImages();requests=0;mode='cache';scope='synthetic-resource-identity'
 let resolve,reject
 const promise=new Promise((r,j)=>{resolve=r;reject=j})
 pending={promise,resolve,reject}
}
export const setMode=value=>{mode=value}
export const clearCache=()=>clearResourceImages()
export const seedUnrelated=()=>resourceImage(scope,'/static-resource/unrelated.svg',()=>Promise.reject(Error('UNRELATED')))
export const imgUrlTrans=value=>mode==='external'?'https://fixture.invalid/test.svg':mode==='data'?value:resourceImage(scope,'/static-resource/s02-test.svg',()=>{requests++;return pending.promise})
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
const bundle = await build({
  stdin: {
    contents: `export {default as Picture} from 'test:picture';export {default as Attr} from 'test:attr';export {env,setResponse,resetResource,setMode,clearCache,imgUrlTrans,pending,requests,seedUnrelated} from 'test:providers';export {reactive,shallowRef,createRenderer,h,nextTick} from 'vue';`,
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
            args.path === 'picture'
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
    if (tag === 'img') images.push(this)
  }
  get src() {
    const value = this.props.src || ''
    return value ? new URL(value, 'http://fixture.local/').href : ''
  }
  getAttribute(name) { return this.props[name] ?? null }
  querySelectorAll(selector) {
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
    return this.decodeTask.promise
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

// 实际SFC/cache/helper；网络、FileReader及图片DOM/decode为明确替身。
const results = []
const pump = async () => { for (let i=0;i<30;i++) await flush() }
const tickTimeout = () => {
  clock += 10000
  for (const [id,timer] of [...timers]) if(timer.at<=clock){timers.delete(id);timer.fn()}
}
const blob = () => new Blob(['<svg xmlns="http://www.w3.org/2000/svg" width="120" height="80"><text>S02 MVP</text></svg>'],{type:'image/svg+xml'})
function start(id='picture-on',empty=false,reset=true) {
  if(reset)m.resetResource()
  const f=mount(id,empty?null:6761,empty)
  let current=true,done=false,result
  const promise=f.proxy.prepareFilterPaste(
    id==='picture-off'?{kind:'static-picture',local:f.item.view}:{kind:'queried',request:f.item.view,response:f.item.response},
    f.binding,()=>current
  ).then(value=>{done=true;result=value;return value})
  return {f,promise,get done(){return done},get result(){return result},stale(){current=false}}
}
const imageReady = image => { if(!image)return;image.complete=true;image.naturalWidth=120;image.decodeTask.resolve();image.dispatch('load') }
async function cleanup(t){t.f.app.unmount();await pump();m.clearCache()}
async function check(id,variant,fn){
 try {await fn();results.push({id,variant,status:'PASS'})}
 catch(error){results.push({id,variant,status:'FAIL',fingerprint:String(error.message)})}
}
await check('PIC-RR-01','decodable pending placeholder',async()=>{
 const t=start();await pump();imageReady(t.f.image);await pump()
 try{assert.equal(t.done,false,'PIC-RR-PENDING-PLACEHOLDER-READY')}finally{await cleanup(t)}
})
for(const schedule of ['before_scan','after_scan']) {
 await check('PIC-RR-02',schedule,async()=>{
  const t=start();if(schedule==='before_scan')m.pending.resolve(blob())
  await pump();const initial=t.f.image.props.src;imageReady(t.f.image)
  if(schedule==='after_scan')m.pending.resolve(blob())
  await pump();imageReady(t.f.image);await pump()
  try{
   assert.equal(t.done,true,'PIC-RR-SUCCESS-NOT-READY')
   assert.equal(t.result.ok,true,'PIC-RR-SUCCESS-REJECTED')
   assert.equal(t.f.image.props.src,m.imgUrlTrans('fixture'),'PIC-RR-FINAL-URL-NOT-RESOLVED')
   assert.ok(Buffer.from(t.f.image.props.src.split(',')[1],'base64').toString().includes('S02 MVP'),'PIC-RR-PLACEHOLDER-COMMITTED')
  }finally{await cleanup(t)}
 })
 await check('PIC-RR-03',schedule,async()=>{
  const t=start();if(schedule==='before_scan')m.pending.reject(Error('TEST_HTTP_403'))
  await pump();imageReady(t.f.image)
  if(schedule==='after_scan')m.pending.reject(Error('TEST_HTTP_403'))
  await pump();imageReady(t.f.image);await pump()
  try{assert.equal(t.done,true);assert.equal(t.result.ok,false,'PIC-RR-FAILED-PLACEHOLDER-READY')}
  finally{await cleanup(t)}
 })
}
for(const [id,variant] of [['PIC-RR-04','non-image'],['PIC-RR-05','failed-cache']]) {
 await check(id,variant,async()=>{
  const t=start();await pump()
  if(id==='PIC-RR-04')m.pending.resolve(new Blob(['not image'],{type:'text/plain'}))
  else m.pending.reject(Error('TEST_FAILED_CACHE'))
  await pump();imageReady(t.f.image);await pump()
  try{
   assert.equal(t.done,true);assert.equal(t.result.ok,false,'PIC-RR-BAD-RESOURCE-READY')
   if(id==='PIC-RR-05'){
    t.f.app.unmount();const again=start('picture-on',false,false);await pump();imageReady(again.f.image);await pump()
    try{assert.equal(again.done,true);assert.equal(again.result.ok,false,'PIC-RR-CACHED-FAILURE-READY');assert.equal(m.requests,1)}finally{await cleanup(again)}
   }
  }finally{await cleanup(t)}
 })
}
for(const [id,kind] of [['PIC-RR-06','dispose'],['PIC-RR-07','stale'],['PIC-RR-08','timeout']]) {
 await check(id,kind+' late completion',async()=>{
  const t=start();await pump();const prior=t.f.image.props.src
  if(kind==='dispose')t.f.app.unmount()
  if(kind==='stale')t.stale()
  if(kind==='timeout')tickTimeout()
  m.pending.resolve(blob());await pump();imageReady(t.f.image);await pump()
  if(!t.done){tickTimeout();await pump()}
  try{assert.equal(t.result.ok,false,'PIC-RR-LATE-READY');assert.equal(t.f.image.props.src,prior,'PIC-RR-LATE-SRC-WRITE')}
  finally{await cleanup(t)}
 })
}
await check('PIC-RR-09','unrelated failed root',async()=>{
 const t=start();m.seedUnrelated();await pump();m.pending.resolve(blob());await pump();imageReady(t.f.image);await pump()
 try{assert.equal(t.done,true);assert.equal(t.result.ok,true,'PIC-RR-UNRELATED-BLOCKS')}finally{await cleanup(t)}
})
for(const [id,mode] of [['PIC-RR-10','data'],['PIC-RR-11','external']]) {
 await check(id,mode+' waits for decode',async()=>{
  const t=start();m.setMode(mode==='external'?'external':'data');await pump()
  t.f.image.complete=true;t.f.image.naturalWidth=120;t.f.image.dispatch('load');await pump()
  try{assert.equal(t.done,false,'PIC-RR-DECODE-NOT-AWAITED');t.f.image.decodeTask.resolve();await pump();assert.equal(t.result.ok,true)}
  finally{await cleanup(t)}
 })
}
await check('PIC-RR-12','empty',async()=>{
 const t=start('picture-on',true);await pump()
 try{assert.equal(t.result.ok,true);assert.equal(t.f.image,undefined);assert.equal(m.requests,0)}finally{await cleanup(t)}
})
await check('PIC-RR-13','OFF zero query',async()=>{
 const t=start('picture-off');m.setMode('data');await pump();imageReady(t.f.image);await pump()
 try{assert.equal(t.result.ok,true);assert.equal(m.env.queries.length,0);assert.equal(t.result.handle.metadata.queried,false)}finally{await cleanup(t)}
})
await check('PIC-RR-14','decode rejects',async()=>{
 const t=start();m.setMode('data');await pump();t.f.image.complete=true;t.f.image.naturalWidth=120
 t.f.image.dispatch('load');await pump();t.f.image.decodeTask.reject(Error('TEST_DECODE'));await pump()
 try{assert.equal(t.result.ok,false)}finally{await cleanup(t)}
})
await check('PIC-RR-15','cache clear during decode',async()=>{
 const t=start();await pump();let calls=0
 t.f.image.decode=()=>{calls++;return calls===1?Promise.resolve():t.f.image.decodeTask.promise}
 m.pending.resolve(blob());await pump();t.f.image.complete=true;t.f.image.naturalWidth=120
 t.f.image.dispatch('load');await pump();assert.ok(calls>=1)
 m.clearCache();t.f.image.decodeTask.resolve();await pump()
 try{assert.equal(t.done,true);assert.equal(t.result.ok,false,'PIC-RR-CLEARED-CACHE-READY')}finally{await cleanup(t)}
})
await check('PIC-RR-16','src changes during decode',async()=>{
 const t=start();m.setMode('data');await pump();t.f.image.complete=true;t.f.image.naturalWidth=120
 t.f.image.dispatch('load');await pump();t.f.image.props.src='https://fixture.invalid/other.svg'
 t.f.image.decodeTask.resolve();await pump()
 try{assert.equal(t.result.ok,false,'PIC-RR-CHANGED-SRC-READY')}finally{await cleanup(t)}
})
globalThis.setTimeout=oldSet;globalThis.clearTimeout=oldClear
console.log(JSON.stringify({results,passed:results.filter(x=>x.status==='PASS').length,failed:results.filter(x=>x.status==='FAIL').length,production_sfc_cache_helper:true,host_network_file_reader_decode_doubles:true,real_browser:false,independent_validation:false},null,2))
process.exitCode=results.some(x=>x.status==='FAIL')?1:0
