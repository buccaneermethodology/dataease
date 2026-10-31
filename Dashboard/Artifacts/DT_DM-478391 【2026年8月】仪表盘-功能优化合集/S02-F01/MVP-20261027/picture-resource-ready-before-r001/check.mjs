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
  const manifest = JSON.parse(
    await fs.readFile(path.join(artifacts, 'c234-before-r001/manifest.json'), 'utf8')
  )
  const entry = manifest.find(item => item.source === 'core/core-frontend/' + relative)
  bytes = await fs.readFile(path.join(repo, entry.snapshot), 'utf8')
  assert.equal(createHash('sha256').update(bytes).digest('hex'), entry.sha256)
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
if (baseline) {
  const manifest = JSON.parse(
    await fs.readFile(path.join(artifacts, 'c234-before-r001/manifest.json'), 'utf8')
  )
  const entry = manifest.find(
    item => item.source === 'core/core-frontend/src/custom-component/picture-group/Attr.vue'
  )
  attrSource = await fs.readFile(path.join(repo, entry.snapshot), 'utf8')
  assert.equal(createHash('sha256').update(attrSource).digest('hex'), entry.sha256)
}
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
export const imgUrlTrans=value=>value
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
    contents: `export {default as Picture} from 'test:picture';export {default as Attr} from 'test:attr';export {env,setResponse} from 'test:providers';export {reactive,shallowRef,createRenderer,h,nextTick} from 'vue';`,
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
)
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
let passed = 0
const check = async (name, fn) => {
  await fn()
  passed++
  console.log('PASS ' + name)
}
if (baseline) {
  const f = mount('picture-on', 6761)
  f.proxy.calcData(f.item.view, () => undefined)
  await flush()
  console.log(
    JSON.stringify({
      id: 'MVP-UI-10-PICTURE',
      fingerprint: 'PICTURE-METADATA-BEFORE-LOAD-DECODE',
      actual_writes: m.env.writes.length,
      expected_writes: 0,
      loaded: false,
      decoded: false,
      old_sfc_loaded: true
    })
  )
  assert.equal(m.env.writes.length, 0, 'PICTURE-METADATA-BEFORE-LOAD-DECODE')
  f.app.unmount()
} else {
  await check(
    'MVP-UI-10-PICTURE：load后decode前保持pending/零共享写入，字段6761/200/0/null精确选图',
    async () => {
      for (const [value, color] of [
        [6761, 'green'],
        [200, 'red'],
        [0, 'red'],
        [null, 'gray']
      ]) {
        const f = mount('picture-on', value)
        let done = false
        const run = f.proxy
          .prepareFilterPaste(
            { kind: 'queried', request: f.item.view, response: f.item.response },
            f.binding,
            () => true
          )
          .then(result => {
            done = true
            return result
          })
        await flush()
        const image = f.image
        assert.ok(image)
        assert.equal(image.listenersBeforeSrc, true)
        assert.equal(image.props.src, fixture.assets[color].src)
        image.naturalWidth = 64
        image.complete = true
        image.complete = true
        image.dispatch('load')
        await flush()
        assert.equal(done, false)
        assert.equal(m.env.writes.length, 0)
        assert.equal(m.env.queries.length, 0)
        image.decodeTask.resolve()
        const result = await run
        assert.equal(result.ok, true)
        assert.equal(result.handle.metadata.queried, true)
        assert.deepEqual(result.handle.metadata.fields, f.item.response.data.fields)
        result.handle.dispose()
        f.app.unmount()
      }
    }
  )
  await check('MVP-UI-08-PICTURE：threshold OFF静态0query/0metadata，空态不伪load', async () => {
    const f = mount('picture-off', 6761)
    const run = f.proxy.prepareFilterPaste(
      { kind: 'static-picture', local: f.item.view },
      f.binding,
      () => true
    )
    await flush()
    assert.equal(f.image.props.src, fixture.assets.green.src)
    f.image.naturalWidth = 64
    f.image.complete = true
    f.image.dispatch('load')
    await flush()
    f.image.decodeTask.resolve()
    const result = await run
    assert.equal(result.ok, true)
    assert.equal(result.handle.metadata.queried, false)
    assert.equal('fields' in result.handle.metadata, false)
    assert.equal(m.env.writes.length, 0)
    assert.equal(m.env.queries.length, 0)
    result.handle.dispose()
    f.app.unmount()
    const empty = mount('picture-on', null, true)
    const ready = await empty.proxy.prepareFilterPaste(
      { kind: 'queried', request: empty.item.view, response: empty.item.response },
      empty.binding,
      () => true
    )
    assert.equal(ready.ok, true)
    assert.equal(images.length, 0)
    ready.handle.dispose()
    empty.app.unmount()
  })
  await check('MVP-UI-10-PICTURE：error/decode reject/timeout/discard-late整包失败', async () => {
    for (const kind of ['error', 'decode', 'timeout', 'discard']) {
      const f = mount('picture-on', 6761)
      let current = true
      const run = f.proxy.prepareFilterPaste(
        { kind: 'queried', request: f.item.view, response: f.item.response },
        f.binding,
        () => current
      )
      await flush()
      const image = f.image
      if (kind === 'error') image.dispatch('error')
      if (kind === 'decode') {
        image.naturalWidth = 64
        image.complete = true
        image.dispatch('load')
        image.decodeTask.reject(Error('TEST_DECODE'))
      }
      if (kind === 'timeout') {
        clock += 10000
        for (const [id, timer] of [...timers])
          if (timer.at <= clock) {
            timers.delete(id)
            timer.fn()
          }
      }
      if (kind === 'discard') {
        current = false
        f.app.unmount()
      }
      const result = await run
      assert.equal(result.ok, false)
      assert.equal(m.env.writes.length, 0)
      image.naturalWidth = 64
      image.complete = true
      image.dispatch('load')
      image.decodeTask.resolve()
      await flush()
      assert.equal(m.env.writes.length, 0)
      if (kind !== 'discard') f.app.unmount()
    }
  })
  await check(
    '真实Attr共用composable纯目录type table-info，不修改轴/dirty或发图表query',
    async () => {
      const item = input('picture-on')
      m.env.dv.curComponent = { id: item.view.id }
      m.env.dv.canvasViewInfo = { [item.view.id]: m.reactive(item.view) }
      m.env.directory.length = 0
      m.env.queries.length = 0
      const axes = lodash.cloneDeep(item.view.xAxis)
      let state
      const app = renderer.createApp({
        setup() {
          state = m.Attr.setup(m.reactive({ themes: 'light' }), { expose: () => undefined })
          return () => m.h('div')
        }
      })
      app.mount(new Node('root'))
      await flush()
      assert.equal(m.env.directory.length, 1)
      assert.equal(m.env.directory[0][2].type, 'table-info')
      assert.deepEqual(item.view.xAxis, axes)
      assert.equal(m.env.queries.length, 0)
      for (const id of ['chart-filter-copy', 'chart-filter-paste', 'chart-filter-permission'])
        assert.ok(attrTemplate.code.includes(id))
      app.unmount()
      m.env.dv.editMode = 'preview'
    }
  )
}
globalThis.setTimeout = oldSet
globalThis.clearTimeout = oldClear
console.log(
  JSON.stringify({
    passed,
    actual_picture_sfc: true,
    actual_condition_mapping: true,
    host_images_decode_store_api_doubles: true,
    real_browser_decode: false,
    independent_validation: false
  })
)
