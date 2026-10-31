import assert from 'node:assert/strict'
import fs from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import vm from 'node:vm'
import ts from 'typescript'
import { parse, compileScript } from '@vue/compiler-sfc'
import { build } from 'esbuild'
const root = fileURLToPath(new URL('../../', import.meta.url))
const file = path.join(root, 'src/views/chart/components/views/index.vue')
const source = await fs.readFile(file, 'utf8')
const { descriptor, errors } = parse(source, { filename: file })
assert.deepEqual(errors, [])
compileScript(descriptor, { id: 'c1-real-wrapper' })

if (process.argv.includes('--baseline')) {
  // 装载完整真实 SFC 后，从 TS AST 取未改写的旧入口执行体；没有复制控制流。
  const ast = ts.createSourceFile(
    file + '.ts',
    descriptor.scriptSetup.content,
    ts.ScriptTarget.Latest,
    true
  )
  let initializer
  for (const node of ast.statements)
    if (ts.isVariableStatement(node)) {
      for (const declaration of node.declarationList.declarations) {
        if (declaration.name.getText(ast) === 'calcData')
          initializer = declaration.initializer.getText(ast)
      }
    }
  assert.ok(initializer)
  const writes = []
  const activity = { invalidations: 0 }
  const run = vm.runInNewContext('(' + initializer + ')', {
    dvMainStore: { setLastViewRequestInfo: (...args) => writes.push(args) },
    chartComponent: {
      value: {
        calcData: () => {
          throw new Error('controlled renderer failure')
        }
      }
    },
    view: { value: { isPlugin: false } },
    isAutoRefreshing: { value: false },
    loading: { value: false },
    invalidatePaste: () => {
      activity.invalidations++
    }
  })
  assert.throws(
    () => run({ id: 'target', chartExtRequest: { user: 'witness', filter: [] } }),
    /controlled renderer failure/
  )
  console.log(
    JSON.stringify({
      actual_entry_loaded: true,
      execution_errors: 0,
      fingerprint: 'C1-OLD-ENTRY-PUBLISHES-BEFORE-READY',
      expected_metadata_writes: 0,
      actual_metadata_writes: writes.length,
      claim: '旧入口语义观察；不是完整冻结MVP案例运行或真实后端故障'
    })
  )
  assert.equal(writes.length, 0, 'C1-OLD-ENTRY-PUBLISHES-BEFORE-READY')
}
console.log('C1 wrapper SFC compilation passed')

const doubles = `
import {reactive,ref,toRef} from 'vue'
export const env=reactive({
  route:{path:'/dashboard',query:{}}, context:{filter:[]}, requests:[], writes:[], snapshots:[],
  dv:{nowPanelJumpInfo:{},publicLinkStatus:false,dvInfo:{id:'resource',type:'dashboard'},curComponent:{id:'target'},
    canvasStyleData:{dashboard:{themeColor:'light'}},mobileInPc:false,inMobile:false,editMode:'edit',firstLoadMap:[],canvasViewInfo:{} }
})
export const pending=[]
export const user=reactive({uid:'uid',oid:'oid',token:'test-session',time:1,proxyInfo:{proxy:false,proxyOid:null}})
export const useUserStoreWithOut=()=>user
export const getFieldByDQ=async()=>({dimensionList:[{id:'f1',deType:2}],quotaList:[]})
export const ElMessageBox={confirm:()=>env.confirmCancel?Promise.reject('cancel'):Promise.resolve()}
Object.assign(env.dv,{
 setLastViewRequestInfo:(id,value)=>env.writes.push({setter:'last',id,value}),
 setViewDataDetails:(id,value)=>env.writes.push({setter:'details',id,value}),
 setViewOriginData:(id,value)=>env.writes.push({setter:'origin',id,value}),
 setPureCanvasViewDataInfo:(id,value)=>env.writes.push({setter:'pure',id,value}),
 setViewPageInfo:(id,value)=>env.writes.push({setter:'page',id,value}),
 setViewInstanceInfo:(id,value)=>env.writes.push({setter:'instance',id,value}),
 getViewPageInfo:()=>({pageSize:50}),clearViewLinkage:()=>{}
})
export const getData=(input,options)=>{env.requests.push({input,options});return new Promise((resolve,reject)=>pending.push({resolve,reject}))}
export const useI18n=()=>({t:key=>key})
export const useAppStoreWithOut=()=>({getIsDataEaseBi:false,getIsIframe:false,getXpackValid:false})
export const useAppearanceStoreWithOut=()=>({fontList:[],setCurrentFont:()=>{}})
export const useEmbedded=()=>({})
export const isChartRefreshPreview=()=>false
export const useChartRefreshTimer=()=>ref(false)
export const cancelRequestBatch=()=>{}
export const hexColorToRGBA=()=>''
export const parseJson=value=>typeof value==='string'?JSON.parse(value):value
export const CHART_FONT_FAMILY_MAP={Arial:'Arial'}
export const DEFAULT_TITLE_STYLE={fontFamily:'Arial'}
export const CHART_TYPE_CONFIGS={}
export const ElIcon={};export const ElInput={};export const ElMessage={error:()=>{},warning:()=>{}}
export const useFilter=()=>env.context
export const useCache=()=>({wsCache:{get:key=>({'user.uid':'uid','user.oid':'oid','user.token':'test-session','user.time':1})[key]}})
export const dvMainStoreWithOut=()=>env.dv
export const storeToRefs=obj=>Object.fromEntries(Object.keys(obj).map(key=>[key,toRef(obj,key)]))
export const snapshotStoreWithOut=()=>({recordSnapshotCache:(...args)=>env.snapshots.push(args)})
export const normalizeExternalLinkUrl=()=>({valid:true})
export const setIdValueTrans=()=>''
export const sanitizeHtml=value=>value
export const viewFieldTimeTrans=()=>{}
export const useRoute=()=>env.route
export const isRenderChartAllPayload=()=>false
export const RENDER_CHART_ALL='renderChart-all',RENDER_CHART_ALL_ITEM_FINISH='finish',RENDER_CHART_ALL_ITEM_START='start'
export const store={}
export const ChartLibraryType={G2:'g2',S2:'s2',INDICATOR:'indicator'}
export const request={}
export const PluginComponent={}
export default {getChartView:(render,type)=>({library:type==='indicator'?'indicator':type.startsWith('table')?'s2':type==='map'?'l7':'g2',axisConfig:{},axis:['filter']})}
`
const providerPaths = new Set([
  '@/config/axios/service',
  '@/hooks/web/useI18n',
  '@/hooks/web/useChartRefreshTimer',
  '@/store/modules/user',
  '@/store/modules/appearance',
  '@/store/modules/app',
  '@/store/modules/embedded',
  '@/components/plugin',
  '@/views/chart/components/js/util.js',
  '@/views/chart/components/editor/util/chart',
  'element-plus-secondary',
  '@/hooks/web/useFilter',
  '@/hooks/web/useCache',
  '@/store/modules/data-visualization/dvMain',
  '@/views/chart/components/js/panel',
  '@/views/chart/components/js/panel/types',
  'pinia',
  '@/utils/canvasUtils',
  '@/utils/utils',
  '@/store/modules/data-visualization/snapshot',
  '@/utils/viewUtils',
  '@/config/axios',
  '@/store',
  'vue-router_2',
  './renderChartAll',
  '@/api/chart'
])
const compiled = compileScript(descriptor, { id: 'c1-actual-wrapper' }).content
const thinFile = path.join(
  root,
  'src/views/chart/components/views/components/FilterPasteRenderer.vue'
)
const thinDescriptor = parse(await fs.readFile(thinFile, 'utf8'), { filename: thinFile }).descriptor
const thinCompiled = compileScript(thinDescriptor, {
  id: 'c1-actual-thin',
  inlineTemplate: true
}).content
const childDouble = `
import {defineComponent,h,ref,nextTick} from 'vue'
import {env} from 'test:providers'
export default defineComponent({props:['pasteBinding','suffixId'],setup(props,{expose}){
 const fail=ref(false)
 expose({prepareFilterPaste:async(input,binding,isCurrent)=>{
   fail.value=!!env.childThrow
   await nextTick()
   return {ok:true,handle:{key:props.suffixId,binding,metadata:{kind:'indicator',drillFilters:[]},instance:null,dispose(){env.childDisposed=true}}}
 }})
 return ()=>{if(fail.value)throw Error('controlled child render failure');return h('div','6761')}
}})
`
const built = await build({
  stdin: {
    contents: `import Wrapper from 'test:wrapper';export {Wrapper};export {default as Thin} from 'test:thin';export * from './src/custom-component/filter-copy/mvp-chart-filter-paste.ts';export * from './src/custom-component/filter-copy/mvp-chart-filter-copy.ts';export * from './src/views/chart/components/editor/filter/useChartFilterCopyMvp.ts';export {reactive,ref,shallowRef,createRenderer,h,nextTick,watch,markRaw} from 'vue';export {env,pending} from 'test:providers';`,
    resolveDir: root
  },
  bundle: true,
  write: false,
  format: 'esm',
  platform: 'node',
  target: 'es2022',
  define: {
    'import.meta.env.DEV': 'true',
    'import.meta.env.VITE_FILTER_COPY_DEV_VALIDATION': '"true"'
  },
  plugins: [
    {
      name: 'explicit-c1-providers',
      setup(builder) {
        builder.onResolve({ filter: /.*/ }, args => {
          if (args.path === 'test:wrapper') return { path: 'wrapper', namespace: 'test' }
          if (args.path === 'test:thin') return { path: 'thin', namespace: 'test' }
          if (args.path === 'test:providers' || providerPaths.has(args.path))
            return { path: 'providers', namespace: 'test' }
          if (args.path.endsWith('.vue')) return { path: 'child', namespace: 'test' }
          if (args.path.endsWith('.svg')) return { path: 'component', namespace: 'test' }
          if (args.path.startsWith('@/'))
            return {
              path:
                path.join(root, 'src', args.path.slice(2)) + (path.extname(args.path) ? '' : '.ts')
            }
        })
        builder.onLoad({ filter: /.*/, namespace: 'test' }, args => ({
          contents:
            args.path === 'wrapper'
              ? compiled
              : args.path === 'thin'
              ? thinCompiled
              : args.path === 'providers'
              ? doubles
              : args.path === 'child'
              ? childDouble
              : 'export default {}',
          loader: 'ts',
          resolveDir: root
        }))
      }
    }
  ]
})
const m = await import(
  `data:text/javascript;base64,${Buffer.from(built.outputFiles[0].text).toString('base64')}`
)
const renderer = m.createRenderer({
  createElement: type => ({ type, children: [] }),
  insert: (node, parent) => parent.children.push(node),
  remove: node => {
    node.removed = true
  },
  createText: text => ({ text }),
  createComment: text => ({ text }),
  setText: (node, text) => {
    node.text = text
  },
  setElementText: (node, text) => {
    node.text = text
  },
  parentNode: () => null,
  nextSibling: () => null,
  patchProp: (node, key, previous, next) => {
    node.props ||= {}
    node.props[key] = next
  }
})
const originalPerformance = globalThis.performance
let now = 100
globalThis.performance = { now: () => now }
globalThis.window = { setInterval, clearInterval }
const tree = {
  logic: 'and',
  items: [
    {
      type: 'item',
      fieldId: 'f1',
      filterType: 'logic',
      term: 'gt',
      value: '200',
      enumValue: [],
      subTree: null
    }
  ]
}
const wait = async () => {
  await m.nextTick()
  await m.nextTick()
}
let count = 0
const check = async (name, test) => {
  await test()
  count++
  console.log('PASS ' + name)
}
function fixture(type = 'line') {
  m.env.requests.length = 0
  m.env.writes.length = 0
  m.env.snapshots.length = 0
  m.pending.length = 0
  m.env.dv.editMode = 'edit'
  m.env.dv.curComponent = { id: 'target' }
  m.env.context = { filter: [] }
  now = 100
  m.syncMvpFilterSession('resource', true, ['identity'])
  assert.equal(
    m.copyMvpChartFilter(
      { tableId: 'dataset', fields: [{ id: 'f1', deType: 2 }], fieldsReady: true, tree },
      true,
      'allow',
      now
    ),
    null
  )
  const view = m.reactive({
    id: 'target',
    tableId: 'dataset',
    render: 'antv',
    type,
    name: 'old',
    customFilter: { logic: null, items: null },
    calParams: [{ id: 'p', value: 'old-value' }],
    customAttr: { basicStyle: { tablePageStyle: 'general' } },
    customStyle: { text: { show: false, fontFamily: 'Arial', fontSize: 12, hPosition: 'left' } },
    drillFields: [],
    xAxis: [],
    yAxis: [],
    chartExtRequest: { old: true }
  })
  const element = m.reactive({
    id: 'target',
    linkageFilters: [],
    outerParamsFilters: [],
    webParamsFilters: []
  })
  m.env.dv.canvasViewInfo = { target: view }
  const props = m.reactive({
    view,
    element,
    showPosition: 'canvas',
    scale: 1,
    suffixId: 'common',
    fontFamily: 'Arial',
    commonParams: {},
    active: true,
    searchCount: 0,
    disabled: false,
    themes: 'light'
  })
  let state
  const signals = []
  const lifecycle = { exposed: null }
  const app = renderer.createApp({
    setup() {
      state = m.Wrapper.setup(props, {
        expose: value => {
          lifecycle.exposed = value
        },
        emit: (...args) => signals.push(args)
      })
      return () => m.h('div')
    }
  })
  app.mount({ children: [] })
  state.queryDataDebounced.cancel()
  let node, prepared, readyResolve
  const calls = { calc: 0, render: 0, dispose: 0 }
  const publicProxy = m.markRaw({
    calcData() {
      calls.calc++
    },
    renderChart() {
      calls.render++
    },
    trackMenu: []
  })
  const libraryInstance = {
    library: type.startsWith('table') ? 's2' : type === 'indicator' ? 'indicator' : 'g2'
  }
  const stop = m.watch(
    () => state.pasteNodes.value,
    nodes => {
      const candidate = nodes.find(item => item.binding.current.value.phase === 'candidate')
      if (!candidate) return
      node = candidate
      candidate.renderer = m.reactive({
        component: publicProxy,
        prepareFilterPaste: (input, binding, isCurrent) => {
          prepared = input
          return new Promise(resolve => {
            readyResolve = () =>
              resolve({
                ok: true,
                handle: {
                  key: node.key,
                  binding,
                  instance: libraryInstance,
                  metadata: type.startsWith('table')
                    ? {
                        kind: 's2',
                        drillFilters: [],
                        pageInfo: { pageSize: 50, currentPage: 1, total: 2 },
                        publishPure: true
                      }
                    : type === 'indicator'
                    ? { kind: 'indicator', drillFilters: [] }
                    : {
                        kind: 'g2',
                        drillFilters: [],
                        originData: input.response.data,
                        publishOrigin: true
                      },
                  dispose() {
                    calls.dispose++
                  }
                }
              })
          })
        }
      })
    },
    { flush: 'sync' }
  )
  const token = m.getMvpFilterSessionToken()
  let result
  const request = {
    operationId: 1,
    targetId: 'target',
    editSessionId: token.editSessionId,
    candidateTree: tree,
    isCurrent: () => m.sameMvpPasteInput(token, m.getMvpFilterSessionToken()),
    resolve: value => {
      result = value
    }
  }
  const response = () => ({
    ...JSON.parse(JSON.stringify(view)),
    data: { fields: [], data: [{ value: 6761 }] },
    calParams: [{ id: 'p', value: 'server' }],
    drillFilters: []
  })
  let closed = false
  return {
    view,
    element,
    props,
    state,
    request,
    run: () => state.receiveFilterPaste(request),
    get result() {
      return result
    },
    queryOk() {
      m.pending.at(-1).resolve({ ok: true, value: response() })
    },
    ready() {
      readyResolve()
    },
    get node() {
      return node
    },
    get prepared() {
      return prepared
    },
    publicProxy,
    libraryInstance,
    close() {
      if (closed) return
      closed = true
      stop()
      app.unmount()
      state.queryDataDebounced.cancel()
    }
  }
}
await check('own undefined 与缺键比较实测', () => {
  assert.equal(m.sameMvpPasteInput({ a: undefined }, {}), false)
  assert.equal(m.sameMvpPasteInput({ a: null }, { a: undefined }), false)
  assert.equal(m.sameMvpPasteInput({ a: undefined }, { a: undefined }), true)
  for (const value of ['keep', 0, false, '']) {
    const prepared = m.prepareMvpCommitDto(
      { calParams: [{ id: 'p', value: 'server' }] },
      { calParams: [{ id: 'p', value }] }
    )
    assert.equal(prepared.calParams[0].value, value ? value : 'server')
  }
})
await check('真实wrapper：严格业务失败/网络失败都不发布', async () => {
  for (const reject of [false, true]) {
    const f = fixture()
    const run = f.run()
    assert.equal(m.env.requests.length, 1)
    reject
      ? m.pending[0].reject(Error('network'))
      : m.pending[0].resolve({ ok: false, error: { code: 500 } })
    await run
    assert.equal(f.result.ok, false)
    assert.equal(m.env.writes.length, 0)
    assert.equal(m.env.snapshots.length, 0)
    assert.deepEqual(f.view.customFilter, { logic: null, items: null })
    assert.equal(f.state.pasteNodes.value.length, 0)
    f.close()
  }
})
await check(
  '真实wrapper：G2/S2/indicator一次query、ready前不写、同key canonical/公有proxy提升',
  async () => {
    for (const type of ['line', 'table-info', 'indicator']) {
      const f = fixture(type)
      const run = f.run()
      assert.equal(m.env.requests.length, 1)
      assert.deepEqual(m.env.requests[0].options, { reportOutcome: true })
      if (type === 'table-info') assert.equal(m.env.requests[0].input.chartExtRequest.pageSize, 50)
      f.queryOk()
      await wait()
      assert.ok(f.node)
      assert.equal(m.env.writes.length, 0)
      assert.equal(m.env.snapshots.length, 0)
      const node = f.node
      const binding = node.binding
      f.ready()
      await run
      assert.equal(f.result.ok, true)
      assert.equal(f.state.pasteNodes.value[0], node)
      assert.equal(f.state.pasteActiveKey.value, node.key)
      assert.equal(binding.current.value.phase, 'active')
      assert.equal(binding.current.value.view, f.view)
      assert.equal(binding.current.value.element, f.element)
      assert.equal(f.state.chartComponent.value, f.publicProxy)
      assert.notEqual(f.state.chartComponent.value, f.libraryInstance)
      assert.equal(m.env.requests.length, 1)
      assert.deepEqual(m.env.snapshots, [['calcData', 'target']])
      assert.deepEqual(f.view.customFilter, tree)
      const last = m.env.writes.find(x => x.setter === 'last').value
      assert.deepEqual(last, f.prepared.request.chartExtRequest)
      assert.equal(Object.hasOwn(last, 'customFilter'), false)
      assert.notEqual(last, f.state.chartExtRequest.value)
      assert.equal(f.prepared.response.calParams[0].value, 'old-value')
      const setters = m.env.writes.map(x => x.setter)
      assert.deepEqual(
        setters,
        type === 'line'
          ? ['last', 'details', 'origin']
          : type === 'table-info'
          ? ['last', 'details', 'pure', 'page', 'instance']
          : ['last', 'details']
      )
      f.close()
    }
  }
)
await check(
  '真实wrapper：配置改回/context/identity/newcopy/TTL/unmount/普通刷新均discard',
  async () => {
    for (const change of [
      f => {
        f.view.name = 'other'
        f.view.name = 'old'
      },
      () => {
        m.env.context.filter.push({ value: 'different' })
      },
      () => m.invalidateMvpFilterSession(),
      () =>
        m.copyMvpChartFilter(
          { tableId: 'dataset', fields: [{ id: 'f1', deType: 2 }], fieldsReady: true, tree },
          true,
          'allow',
          now
        ),
      () => {
        now = 1800100
      },
      f => f.close(),
      f => {
        f.state.queryData()
        f.state.queryDataDebounced.cancel()
      }
    ]) {
      const f = fixture()
      const run = f.run()
      change(f)
      f.queryOk()
      await run
      assert.equal(f.result.ok, false)
      assert.equal(m.env.writes.length, 0)
      assert.equal(m.env.snapshots.length, 0)
      assert.deepEqual(f.view.customFilter, { logic: null, items: null })
      f.close()
    }
  }
)
await check('真实wrapper：ready迟到不发布；busy第二次0query', async () => {
  const f = fixture()
  const run = f.run()
  f.queryOk()
  await wait()
  let second
  await f.state.receiveFilterPaste({
    ...f.request,
    operationId: 2,
    resolve: result => {
      second = result
    }
  })
  assert.equal(second.reason, 'paste_busy')
  assert.equal(m.env.requests.length, 1)
  f.view.name = 'changed'
  f.ready()
  await run
  assert.equal(f.result.ok, false)
  assert.equal(m.env.writes.length, 0)
  f.close()
})
await check('采用后实际公有proxy更新；未接图库普通换类型恢复旧分派', async () => {
  const f = fixture()
  const run = f.run()
  f.queryOk()
  await wait()
  f.ready()
  await run
  const nextPublic = m.markRaw({ trackMenu: ['drill'] })
  f.node.renderer.component = nextPublic
  assert.equal(f.state.chartComponent.value, nextPublic)
  f.view.type = 'map'
  assert.equal(f.state.pasteActiveKey.value, '')
  assert.equal(f.state.pasteNodes.value.length, 0)
  assert.equal(m.hasMvpPasteReceiver('target'), false)
  f.close()
})
await check('真实composable→专用emitter→wrapper：成功/查询失败和取消完整接线', async () => {
  for (const branch of ['success', 'query-error', 'cancel']) {
    const f = fixture()
    m.env.confirmCancel = branch === 'cancel'
    let ui
    const pane = m.ref({ ...JSON.parse(JSON.stringify(f.view)), id: 'source', customFilter: tree })
    m.env.dv.curComponent = { id: 'source' }
    const app = renderer.createApp({
      setup() {
        ui = m.useChartFilterCopyMvp(pane)
        return () => m.h('div')
      }
    })
    app.mount({ children: [] })
    await wait()
    ui.permission.value = 'allow'
    ui.copy()
    assert.equal(ui.status.value, 'copied')
    pane.value = f.view
    m.env.dv.curComponent = { id: 'target' }
    await wait()
    if (branch === 'cancel') f.view.customFilter = JSON.parse(JSON.stringify(tree))
    assert.equal(ui.pasteReason.value, null)
    const run = ui.paste()
    if (branch === 'cancel') {
      await run
      assert.equal(ui.status.value, 'paste_cancelled')
      assert.equal(m.env.requests.length, 0)
    } else {
      assert.equal(ui.busy.value, true)
      assert.equal(m.env.requests.length, 1)
      await ui.paste()
      assert.equal(ui.status.value, 'paste_busy')
      assert.equal(m.env.requests.length, 1)
      if (branch === 'query-error') m.pending[0].resolve({ ok: false, error: { code: 500 } })
      else {
        f.queryOk()
        await wait()
        f.ready()
      }
      await run
      assert.equal(ui.status.value, branch === 'success' ? 'pasted' : 'paste_query_failed')
      assert.equal(ui.busy.value, false)
      assert.equal(m.env.requests.length, 1)
    }
    app.unmount()
    f.close()
    m.env.dv.editMode = 'preview'
  }
})
await check('真实薄SFC父级error boundary：子render抛错即使prepare报ok也拒绝', async () => {
  for (const fail of [false, true]) {
    m.env.childThrow = fail
    m.env.childDisposed = false
    const binding = {
      current: m.shallowRef({
        phase: 'candidate',
        view: { id: 'target', render: 'custom', type: 'indicator' },
        element: { id: 'target' }
      })
    }
    const app = renderer.createApp(m.Thin, { binding, suffixId: 'unique-node' })
    const proxy = app.mount({ children: [] })
    const result = await proxy.prepareFilterPaste(
      { kind: 'queried', request: binding.current.value.view, response: {} },
      binding,
      () => true
    )
    assert.equal(result.ok, !fail)
    if (fail) assert.equal(result.reason, 'paste_render_failed')
    await wait()
    if (fail) assert.equal(m.env.childDisposed, true)
    app.unmount()
  }
})
globalThis.performance = originalPerformance
console.log(
  JSON.stringify({
    passed: count,
    actual_wrapper_script_mounted: true,
    child_ports_and_stores_doubled: true,
    real_query_or_library_ready: false,
    independent_validation: false
  })
)
