import fs from 'node:fs/promises'
import path from 'node:path'
import vm from 'node:vm'
import { createHash } from 'node:crypto'
import { createRequire } from 'node:module'
import { fileURLToPath } from 'node:url'
import { parse, compileScript } from '@vue/compiler-sfc'
import { parse as parseAst } from '@babel/parser'
import { transform } from 'esbuild'
import * as vue from 'vue'
import * as lodash from 'lodash-es'

// 只在内存编译磁盘 SFC；唯一变换为 AST 定位的只读 snapshot getter。
// G2/API/Store/DOM/时钟都是具名显式 doubles，不复制 renderG2，不检测 helper 字样判通过。
const frontend = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..')
const repo = path.resolve(frontend, '../..')
const sourcePath = path.join(
  frontend,
  'src/views/chart/components/views/components/ChartComponentG2Plot.vue'
)
const parent = path.join(repo, 'Dashboard/Artifacts')
const artifactDir = path.join(
  parent,
  (await fs.readdir(parent)).find(x => x.startsWith('DT_DM-478391')),
  'S02-F01'
)
const casePath = path.join(artifactDir, 'G2StageLifecycleOwnershipCases-r003.json')
const sha = text => createHash('sha256').update(text).digest('hex')
const canonical = value =>
  JSON.stringify(value, (_k, v) =>
    v && typeof v === 'object' && !Array.isArray(v)
      ? Object.fromEntries(
          Object.keys(v)
            .sort()
            .map(k => [k, v[k]])
        )
      : v
  )
const require = createRequire(import.meta.url)
const mode = process.argv.includes('--mode')
  ? process.argv[process.argv.indexOf('--mode') + 1]
  : 'red'
const report = {
  schema_version: 'g2_component_execution_v1',
  mode,
  contract_valid: false,
  actual_sfc_compiled: false,
  component_cases_executed: 0,
  passed: 0,
  assertion_failures: 0,
  execution_errors: 0,
  cases: [],
  supplemental_r013: [],
  not_proven: [
    '真实G2库和浏览器',
    '权限',
    'Copy/Paste MVP',
    'stage/query/Store原子提交',
    '全Goal完成'
  ]
}
const deferred = () => {
  let resolve, reject
  const promise = new Promise((a, b) => {
    resolve = a
    reject = b
  })
  return { promise, resolve, reject }
}
const tick = async () => {
  for (let i = 0; i < 40; i++) await Promise.resolve()
}
const bounded = async (label, execute) => {
  let timer
  try {
    return await Promise.race([
      execute(),
      new Promise((_, reject) => {
        timer = setTimeout(() => reject(new Error(`HARNESS_TIMEOUT: ${label}`)), 1500)
      })
    ])
  } finally {
    clearTimeout(timer)
  }
}
let compiledCode, helperCode, contract
function walk(node, visit) {
  if (!node || typeof node !== 'object') return
  if (node.type) visit(node)
  for (const [key, value] of Object.entries(node)) {
    if (['loc', 'start', 'end'].includes(key)) continue
    if (Array.isArray(value)) value.forEach(x => walk(x, visit))
    else if (value && typeof value === 'object') walk(value, visit)
  }
}
async function compileActualSfc() {
  const sourceBytes = await fs.readFile(sourcePath),
    caseBytes = await fs.readFile(casePath)
  if (sha(caseBytes) !== 'b8844f51bed1f0574215210003ad1d59831c75635f9b0b6ed091baf3b78bbfe7')
    throw new Error('FROZEN_CASES_DIGEST_MISMATCH')
  contract = JSON.parse(caseBytes)
  if (
    canonical(contract.component_cases.map(c => c.id)) !==
    canonical(['G2OWN-C01', 'G2OWN-C02', 'G2OWN-C03', 'G2OWN-C04', 'G2OWN-C05', 'G2OWN-C06'])
  )
    throw new Error('COMPONENT_CASE_IDENTITY_MISMATCH')
  report.contract_valid = true
  const parsed = parse(sourceBytes.toString(), { filename: sourcePath })
  if (parsed.errors.length) throw new Error(`SFC_PARSE: ${parsed.errors}`)
  const script = compileScript(parsed.descriptor, { id: 'g2-ownership-actual-sfc' }).content
  const ast = parseAst(script, { sourceType: 'module', plugins: ['typescript'] }),
    methods = []
  walk(ast, n => {
    if (n.type === 'ObjectMethod' && n.key?.name === 'setup') methods.push(n)
  })
  if (methods.length !== 1) throw new Error('SETUP_AST_ANCHOR_NOT_UNIQUE')
  const returns = methods[0].body.body.filter(
    n =>
      n.type === 'ReturnStatement' &&
      n.argument?.type === 'Identifier' &&
      n.argument.name === '__returned__'
  )
  if (returns.length !== 1) throw new Error('RETURN_AST_ANCHOR_NOT_UNIQUE')
  const injection = `Object.defineProperty(__returned__, '__g2OwnershipSnapshot', {enumerable: false, configurable: false, get: () => Object.freeze({myChart, activeG2Scope: typeof activeG2Scope === 'undefined' ? null : activeG2Scope, g2RenderVersion, chartComponentUnmounted})});\n`
  const at = returns[0].start,
    instrumented = script.slice(0, at) + injection + script.slice(at)
  const output = await transform(instrumented, {
    loader: 'ts',
    format: 'cjs',
    target: 'es2022',
    define: { 'import.meta.env.DEV': 'false' },
    sourcefile: sourcePath
  })
  compiledCode = output.code
  const helperPath = path.join(path.dirname(sourcePath), 'g2-render-attempt.ts')
  const helperBytes = await fs.readFile(helperPath)
  helperCode = (
    await transform(helperBytes.toString(), {
      loader: 'ts',
      format: 'cjs',
      target: 'es2022',
      sourcefile: helperPath
    })
  ).code
  report.actual_sfc_compiled = true
  report.identity = {
    source_path: path.relative(repo, sourcePath),
    source_sha256_before: sha(sourceBytes),
    helper_source_sha256: sha(helperBytes),
    helper_compiled_sha256: sha(helperCode),
    frozen_cases_sha256: sha(caseBytes),
    component_case_identity_sha256: sha(canonical(contract.component_cases)),
    compiled_bundle_sha256: sha(compiledCode),
    runner_sha256: sha(await fs.readFile(fileURLToPath(import.meta.url))),
    compiler_sfc_version: require('@vue/compiler-sfc/package.json').version,
    vue_version: vue.version,
    esbuild_version: require('esbuild/package.json').version,
    seam: {
      setup_anchors: methods.length,
      return_anchors: returns.length,
      insertion_offset: at,
      injection_sha256: sha(injection),
      compiled_script_sha256: sha(script),
      instrumented_script_sha256: sha(instrumented),
      transformation:
        'one insertion before AST-located setup return; all original bytes preserved in order'
    }
  }
}
function environment(type = 'line') {
  const h = {
    events: [],
    logs: [],
    instances: new Map(),
    drawPlans: [],
    apiResponses: [],
    drawInputs: [],
    updatePlans: [],
    mounts: [],
    unmounts: [],
    observers: [],
    timers: new Map(),
    queue: new Map(),
    now: 0,
    nextTimer: 0,
    unmounted: false,
    cleanupsThrow: new Set(),
    savedUpdateCallbacks: []
  }
  const event = (name, id, extra = {}) =>
    h.events.push({ name, id, post_unmount: h.unmounted, ...extra })
  const cleanup = (key, instance) => {
    event('install', `${key}:${instance.id}`)
    return () => {
      event('cleanup', `${key}:${instance.id}`)
      if (h.cleanupsThrow.has(`${key}:${instance.id}`))
        throw Object.assign(new Error(`cleanup-${key}-${instance.id}`), {
          testErrorId: `cleanup-${key}-${instance.id}`
        })
    }
  }
  const container = {
    offsetWidth: 800,
    offsetHeight: 400,
    clientWidth: 800,
    clientHeight: 400,
    closest: () => null
  }
  const view = {
    id: 'v',
    tableId: 'table',
    render: 'antv',
    type,
    customAttr: { tooltip: { carousel: { enable: true } } },
    customStyle: { legend: { displayMode: 'tile' } },
    drillFields: [],
    linkageActive: true,
    chartExtRequest: {},
    fontFamily: 'inherit'
  }
  h.view = view
  const store = {
    nowPanelTrackInfo: vue.ref({ 'v#f': true }),
    nowPanelJumpInfo: vue.ref({}),
    mobileInPc: false,
    embeddedCallBack: 'no',
    inMobile: false,
    canvasStyleData: { dashboard: { themeColor: 'light' }, tScale: 1 },
    setViewDataDetails: (id, response) =>
      event('store:details', id, { response_data: response.data }),
    setViewOriginData: (id, data) => event('store:origin', id, { data }),
    addViewTrackFilter: () => event('store:track', 'v')
  }
  const chartView = {
    library: 'G2',
    drawChart: async options => {
      h.drawInputs.push(options.chart.data)
      const plan = h.drawPlans.shift()
      if (!plan) throw new Error('HARNESS_DRAW_PLAN_MISSING')
      event('draw', plan.id ?? 'undefined', { type: options.chart.type })
      h.lastAction = options.action
      if (plan.create) await plan.create.promise
      return plan.instance
    },
    updateData: async (options, callback) => {
      const plan = h.updatePlans.shift()
      if (!plan) throw new Error('HARNESS_UPDATE_PLAN_MISSING')
      h.savedUpdateCallbacks.push(callback)
      event('updateData', options.chartObj?.id)
      return await plan.promise
    },
    applyThemeFont: instance => event('theme', instance.id),
    optimizeLargeData: instance => event('optimize', instance.id),
    afterRender: async instance => {
      event('afterRender:start', instance.id)
      const p = h.instances.get(instance.id)
      if (p.after) await p.after.promise
      event('afterRender:end', instance.id)
    }
  }
  h.instance = (id, gates = {}) => {
    const instance = {
      id,
      destroy: () => event('destroy', id),
      render: async () => {
        event('render:start', id)
        if (gates.render) await gates.render.promise
        event('render:end', id)
      },
      forceFit: async () => {
        event('forceFit:start', id)
        if (gates.forceFit) await gates.forceFit.promise
        event('forceFit:end', id)
      },
      options: (...args) => {
        event('options', id, { write: !!args.length })
        return { children: [] }
      },
      emit: (name, payload) => event(`emit:${name}`, id, { payload }),
      getContext: () => ({
        canvas: {
          document: { getElementsByClassName: () => [] },
          render: () => event('canvas:render', id)
        },
        views: []
      })
    }
    const plan = { id, instance, ...gates }
    h.instances.set(id, plan)
    return plan
  }
  const no = () => undefined
  const named = new Map([
    [
      'vue',
      { ...vue, onMounted: fn => h.mounts.push(fn), onBeforeUnmount: fn => h.unmounts.push(fn) }
    ],
    ['lodash-es', lodash],
    [
      '@/views/chart/components/js/panel/types/impl/g2-assist-line',
      { installG2AssistLineVisibility: instance => cleanup('assist', instance) }
    ],
    [
      '@/views/chart/components/js/panel/types/impl/g2-legend-tile',
      {
        applyG2TiledLegend: options => options,
        installG2TiledLegendStateAdapter: instance => cleanup('tiled', instance),
        replayG2TiledLegendSelection: (_options, emit) => emit('harness:legend-replay')
      }
    ],
    [
      '@/api/chart',
      {
        getData: request => {
          event('getData', request.id)
          if (!h.apiResponses.length) throw new Error('HARNESS_API_RESPONSE_MISSING')
          return Promise.resolve(h.apiResponses.shift())
        }
      }
    ],
    [
      '@/views/chart/components/js/panel/types',
      { ChartLibraryType: { G2: 'G2', L7: 'L7', L7_PLOT: 'L7_PLOT' } }
    ],
    ['@/views/chart/components/js/panel/types/impl/g2', { isLargeDataLabelMark: () => false }],
    ['@/views/chart/components/js/panel', { default: { getChartView: () => chartView } }],
    ['@/store/modules/app', { useAppStoreWithOut: () => ({}) }],
    ['@/store/modules/data-visualization/dvMain', { dvMainStoreWithOut: () => store }],
    [
      'pinia',
      {
        storeToRefs: target =>
          Object.fromEntries(
            Object.entries(target).map(([k, v]) => [k, vue.isRef(v) ? v : vue.toRef(target, k)])
          )
      }
    ],
    [
      '@/views/chart/components/js/util',
      {
        getColorFormAlphaColor: x => x,
        hexColorToRGBA: x => x,
        parseJson: x => (typeof x === 'string' ? JSON.parse(x) : x)
      }
    ],
    ['../../editor/util/chart', { BASE_VIEW_CONFIG: {} }],
    ['@/utils/canvasStyle', { customAttrTrans: {}, customStyleTrans: {}, recursionTransObj: no }],
    ['@/utils/utils', { deepCopy: lodash.cloneDeep, isMobile: () => false }],
    ['@/utils/canvasUtils', { isDashboard: () => true, trackBarStyleCheck: no }],
    [
      '@/hooks/web/useEmitt',
      { useEmitt: () => ({ emitter: { emit: name => event(`emitter:${name}`, 'v') } }) }
    ],
    ['@/hooks/web/useI18n', { useI18n: () => ({ t: x => x }) }],
    ['@antv/l7', { ExportImage: class ExportImage {} }],
    [
      '@/views/chart/components/js/panel/common/common_antv',
      {
        configAxisTitleOverflowTooltip: no,
        configEmptyDataStyle: () => event('empty-style', 'v'),
        installG2SliderAdapter: instance => cleanup('slider', instance)
      }
    ],
    [
      '@/views/chart/components/js/panel/types/impl/g2-legend-pagination',
      { installG2SideLegendPaginationAdapter: instance => cleanup('pagination', instance) }
    ],
    ['element-plus-secondary', { ElMessage: { error: value => event('message:error', value) } }],
    [
      '@/views/chart/components/js/G2TooltipCarousel',
      {
        default: {
          getInstanceByContainerId: () => undefined,
          destroyByContainer: id => event('carousel:destroy', id),
          enqueueResize: (id, fn) => {
            event('resize:enqueue', id)
            h.queue.set(id, fn)
          },
          dequeueResize: id => {
            event('resize:dequeue', id)
            h.queue.delete(id)
          }
        }
      }
    ],
    ['@/views/chart/components/js/panel/charts/g2/bar/barUtil', { listenerTooltipShow: no }],
    [
      './chart-refresh-mock',
      {
        createChartRefreshMock: () => {
          throw new Error('DEV_MOCK_MUST_NOT_RUN')
        }
      }
    ],
    ['@/components/visualization/ViewTrackBar.vue', { default: {} }],
    ['@/views/chart/components/views/components/ChartError.vue', { default: {} }]
  ])
  const helperModule = { exports: {} }
  new vm.Script(helperCode, { filename: 'actual-g2-render-attempt.compiled.cjs' }).runInNewContext({
    module: helperModule,
    exports: helperModule.exports,
    Error
  })
  named.set('./g2-render-attempt', helperModule.exports)
  const module = { exports: {} }
  const context = vm.createContext({
    module,
    exports: module.exports,
    require: name => {
      if (!named.has(name)) throw new Error(`UNDECLARED_MODULE_DOUBLE: ${name}`)
      return { __esModule: true, ...named.get(name) }
    },
    console: {
      error: (...args) => h.logs.push({ channel: 'error', args }),
      warn: (...args) => h.logs.push({ channel: 'warn', args })
    },
    document: { getElementById: () => container },
    SVGSVGElement: class SVGSVGElement {},
    ResizeObserver: class ResizeObserver {
      constructor(fn) {
        this.fn = fn
        this.kind = 'resize'
        this.disconnected = 0
        h.observers.push(this)
      }
      observe() {
        event('observer:observe', this.kind)
      }
      disconnect() {
        this.disconnected++
        event('observer:disconnect', this.kind)
      }
    },
    IntersectionObserver: class IntersectionObserver {
      constructor(fn) {
        this.fn = fn
        this.kind = 'intersection'
        this.disconnected = 0
        h.observers.push(this)
      }
      observe() {
        event('observer:observe', this.kind)
      }
      disconnect() {
        this.disconnected++
        event('observer:disconnect', this.kind)
      }
    },
    setTimeout: (fn, delay = 0) => {
      const id = ++h.nextTimer
      h.timers.set(id, { fn, at: h.now + delay })
      return id
    },
    clearTimeout: id => {
      h.timers.delete(id)
      event('timer:clear', String(id))
    },
    requestAnimationFrame: fn => {
      event('replay:scheduled', h.snapshot?.().myChart?.id)
      fn()
      return 1
    },
    cancelAnimationFrame: no
  })
  new vm.Script(compiledCode, {
    filename: 'actual-ChartComponentG2Plot.compiled.cjs'
  }).runInContext(context)
  let exposed
  h.setup = module.exports.default.setup(
    vue.reactive({
      element: { dashboardHidden: false, actionSelection: { linkageActive: 'manual' } },
      view,
      showPosition: 'canvas',
      scale: 1,
      terminal: 'pc',
      suffixId: 'common',
      fontFamily: 'inherit',
      active: true
    }),
    {
      expose: value => {
        exposed = value
      },
      emit: name => event(`vue:${name}`, 'v')
    }
  )
  h.public = exposed
  h.snapshot = () => h.setup.__g2OwnershipSnapshot
  const descriptor = Object.getOwnPropertyDescriptor(h.setup, '__g2OwnershipSnapshot')
  if (!descriptor?.get || descriptor.set || !Object.isFrozen(h.snapshot()))
    throw new Error('SNAPSHOT_NOT_READ_ONLY')
  h.mounts.forEach(fn => fn())
  h.advance = async (ms = 300) => {
    h.now += ms
    const due = [...h.timers].filter(([, t]) => t.at <= h.now)
    for (const [id, timer] of due) if (h.timers.delete(id)) timer.fn()
    await tick()
  }
  h.request = async (
    data = { fields: [{ id: 'f' }], data: [{ field: 'a', value: 1 }] },
    auto = false
  ) => {
    h.apiResponses.push({ ...lodash.cloneDeep(view), code: 0, data, drillFilters: [] })
    let complete = false
    await h.public.calcData(
      view,
      () => {
        complete = true
        event('request:callback', 'v')
      },
      auto
    )
    await tick()
    return () => complete
  }
  h.ready = async (id = 'O') => {
    const p = h.instance(id)
    h.drawPlans.push(p)
    const done = await h.request()
    await h.advance()
    if (!done() || h.snapshot().myChart !== p.instance)
      throw new Error(`HARNESS_INITIAL_OWNER_NOT_ESTABLISHED: ${id}`)
    return p
  }
  h.activateLinkage = async () => {
    h.lastAction({
      data: {
        data: {
          field: 'a',
          name: 'f',
          value: 1,
          dimensionList: [{ id: 'f', value: 'a' }],
          quotaList: [{ id: 'q', value: 1 }]
        }
      }
    })
    await tick()
    if (!h.events.some(e => e.name === 'store:track'))
      throw new Error('HARNESS_LINKAGE_NOT_ESTABLISHED')
  }
  h.resize = async () => {
    h.observers
      .find(o => o.kind === 'resize')
      .fn([{ borderBoxSize: [{ inlineSize: 900, blockSize: 500 }] }])
    await h.advance()
    const callbacks = [...h.queue.values()]
    if (callbacks.length !== 1) throw new Error('HARNESS_RESIZE_NOT_ENQUEUED')
    return callbacks[0]
  }
  h.unmount = () => {
    h.unmounted = true
    h.unmounts.forEach(fn => fn())
  }
  h.count = (name, id) =>
    h.events.filter(e => e.name === name && (id === undefined || e.id === id)).length
  h.errorIds = () =>
    h.logs.flatMap(x =>
      x.args.flatMap(value =>
        value?.testErrorId
          ? [value.testErrorId]
          : value?.cleanupErrors?.map(e => e.testErrorId).filter(Boolean) ??
            (Array.isArray(value) ? value.map(e => e.testErrorId).filter(Boolean) : [])
      )
    )
  h.errorCodes = () =>
    h.logs.flatMap(x =>
      x.args.flatMap(value =>
        [value?.code, value?.originalError?.code, value?.cause?.code].filter(Boolean)
      )
    )
  h.cleanupStatus = () => ({
    resize_observer_disconnect_count: h.observers.find(o => o.kind === 'resize').disconnected,
    intersection_observer_disconnect_count: h.observers.find(o => o.kind === 'intersection')
      .disconnected,
    timers_cancelled: h.timers.size === 0,
    queued_resize_dequeued: h.queue.size === 0
  })
  h.checkExecution = () => {
    const unexpected = value => {
      if (Array.isArray(value)) return value.map(unexpected).find(Boolean)
      if (!value || typeof value !== 'object' || !value.message) return null
      if (value.testErrorId?.startsWith('cleanup-')) return null
      if (value.code === 'G2_RENDER_INSTANCE_MISSING') return null
      if (value.originalError?.code === 'G2_RENDER_INSTANCE_MISSING') return null
      return value
    }
    const error = h.logs
      .flatMap(x => x.args)
      .map(unexpected)
      .find(Boolean)
    if (error) throw new Error(`SFC_EXECUTION_ERROR: ${error.message}`)
  }
  return h
}
const handlers = {
  async 'G2OWN-C01'(check, o) {
    const h = environment()
    await h.ready()
    const create = deferred(),
      render = deferred(),
      after = deferred(),
      next = h.instance('N', { create, render, after })
    h.drawPlans.push(next)
    await h.request()
    await h.advance()
    check('O destroyed before N create completes', h.count('destroy', 'O') === 1)
    create.resolve()
    await tick()
    if (h.count('render:start', 'N') !== 1) throw new Error('HARNESS_N_RENDER_GATE_NOT_REACHED')
    const pending = h.snapshot()
    o.after_create_before_ready = {
      myChart: pending.myChart?.id ?? null,
      N_published: pending.myChart === next.instance,
      O_destroy_count: h.count('destroy', 'O'),
      render_started: h.count('render:start', 'N'),
      after_started: h.count('afterRender:start', 'N')
    }
    check('myChart null while N render pending', pending.myChart === null)
    check('N not published before ready', pending.myChart !== next.instance)
    render.resolve()
    await tick()
    check(
      'afterRender N really deferred',
      h.count('afterRender:start', 'N') === 1 && h.count('afterRender:end', 'N') === 0
    )
    check('N not published while afterRender pending', h.snapshot().myChart === null)
    after.resolve()
    await tick()
    const ready = h.snapshot()
    o.after_ready = {
      myChart: ready.myChart?.id ?? null,
      active_scope_instance: ready.activeG2Scope?.instance?.id ?? null,
      O_destroy_count: h.count('destroy', 'O')
    }
    check('N published after ready', ready.myChart === next.instance)
    check('active scope owns N', ready.activeG2Scope?.instance === next.instance)
    check('O destroy exactly once', h.count('destroy', 'O') === 1)
    h.checkExecution()
    o.events = h.events
  },
  async 'G2OWN-C02'(check, o) {
    const h = environment()
    await h.ready()
    await h.activateLinkage()
    const update = deferred()
    h.updatePlans.push(update)
    await h.request(undefined, true)
    await h.advance()
    if (h.savedUpdateCallbacks.length !== 1) throw new Error('HARNESS_UPDATE_NOT_STARTED')
    const callback = h.savedUpdateCallbacks[0],
      n = h.instance('N')
    h.drawPlans.push(n)
    await h.request()
    const before = h.events.length
    callback()
    await tick()
    const staleInstallBefore = h.events
      .slice(before)
      .filter(e => e.name === 'install' && e.id === 'assist:O').length
    update.resolve(true)
    await tick()
    const staleReplay = h.events
      .slice(before)
      .filter(e => e.name === 'replay:scheduled' && e.id === 'O').length
    await h.advance()
    check('N full render reaches ready', h.snapshot().myChart === n.instance)
    const after = h.events.length
    callback()
    await tick()
    const touchedN = h.events
        .slice(after)
        .some(e => ['cleanup', 'install'].includes(e.name) && e.id.endsWith(':N')),
      staleInstallAfter = h.events.slice(after).filter(e => e.name === 'install').length
    Object.assign(o, {
      stale_O_assist_install_count: staleInstallBefore + staleInstallAfter,
      stale_O_replay_count: staleReplay,
      N_cleanup_untouched: !touchedN,
      events: h.events
    })
    check(
      'old callback never installs assist after generation switch',
      o.stale_O_assist_install_count === 0
    )
    check('old update never replays after generation switch', staleReplay === 0)
    check('old callback leaves N cleanup untouched', !touchedN)
    h.checkExecution()
  },
  async 'G2OWN-C03'(check, o) {
    o.subcases = []
    for (const stage of ['queued', 'forceFit_pending']) {
      const h = environment(),
        forceFit = deferred(),
        p = h.instance('O', { forceFit })
      h.drawPlans.push(p)
      await h.request()
      await h.advance()
      await h.activateLinkage()
      const callback = await h.resize()
      let pending
      if (stage === 'forceFit_pending') {
        pending = callback()
        await tick()
        if (h.count('forceFit:start', 'O') !== 1) throw new Error('HARNESS_FORCEFIT_NOT_STARTED')
      }
      h.unmount()
      const marker = h.events.length
      if (stage === 'queued') pending = callback()
      forceFit.resolve()
      await pending
      await tick()
      const post = h.events.slice(marker),
        counts = {
          options: post.filter(e => e.name === 'options').length,
          forceFit: post.filter(e => e.name === 'forceFit:start').length,
          replay: post.filter(
            e => e.name === 'replay:scheduled' || e.name === 'emit:harness:legend-replay'
          ).length
        }
      o.subcases.push({
        stage,
        post_unmount_application_calls: counts,
        O_destroy_count: h.count('destroy', 'O'),
        cleanup: h.cleanupStatus(),
        events: h.events
      })
      check(
        `${stage}: no post-unmount application calls`,
        Object.values(counts).every(x => x === 0)
      )
      check(`${stage}: O destroyed once`, h.count('destroy', 'O') === 1)
      h.checkExecution()
    }
  },
  async 'G2OWN-C04'(check, o) {
    o.subcases = []
    for (const stage of ['ready_owner', 'pending_N']) {
      const h = environment()
      await h.ready()
      let render
      await h.resize()
      if (stage === 'ready_owner') {
        h.cleanupsThrow.add('assist:O')
        h.observers
          .find(o => o.kind === 'resize')
          .fn([{ borderBoxSize: [{ inlineSize: 1000, blockSize: 600 }] }])
      } else {
        render = deferred()
        h.drawPlans.push(h.instance('N', { render }))
        await h.request()
        await h.advance()
        if (h.count('render:start', 'N') !== 1) throw new Error('HARNESS_PENDING_N_NOT_STARTED')
      }
      const beforeUnmountInstance = h.snapshot().myChart
      h.unmount()
      const marker = h.events.length
      if (render) {
        render.resolve()
        await tick()
      }
      const status = h.cleanupStatus(),
        observed = {
          stage,
          error_observed_ids: h.errorIds(),
          O_destroy_count: h.count('destroy', 'O'),
          N_destroy_count: h.count('destroy', 'N'),
          remaining_cleanups_executed: ['slider', 'tiled', 'pagination'].every(
            key => h.count('cleanup', `${key}:O`) === 1
          ),
          post_unmount_publish_count:
            h.snapshot().myChart === h.instances.get('N')?.instance &&
            beforeUnmountInstance !== h.instances.get('N')?.instance
              ? 1
              : 0,
          cleanup: status,
          post_unmount_events: h.events.slice(marker),
          events: h.events
        }
      o.subcases.push(observed)
      check(`${stage}: O destroyed once`, observed.O_destroy_count === 1)
      for (const [key, expected] of Object.entries({
        resize_observer_disconnect_count: 1,
        intersection_observer_disconnect_count: 1,
        timers_cancelled: true,
        queued_resize_dequeued: true
      }))
        check(`${stage}: ${key}`, status[key] === expected)
      if (stage === 'ready_owner') {
        check(
          'cleanup assist error observed',
          observed.error_observed_ids.includes('cleanup-assist-O')
        )
        check('other registered cleanups continue', observed.remaining_cleanups_executed)
      } else {
        check('pending N destroyed once', observed.N_destroy_count === 1)
        check('unmounted N not published', observed.post_unmount_publish_count === 0)
      }
      h.checkExecution()
    }
  },
  async 'G2OWN-C05'(check, o) {
    const h = environment()
    await h.ready()
    h.cleanupsThrow.add('assist:O')
    const n = h.instance('N')
    h.drawPlans.push(n)
    const done = await h.request()
    await h.advance()
    Object.assign(o, {
      error_observed_ids: h.errorIds(),
      error_observation_count: h.errorIds().filter(x => x === 'cleanup-assist-O').length,
      O_destroy_count: h.count('destroy', 'O'),
      N_ready: h.snapshot().myChart === n.instance && h.count('afterRender:end', 'N') === 1,
      observer_disconnect_count: h.count('observer:disconnect'),
      remaining_O_cleanups_executed: ['slider', 'tiled', 'pagination'].every(
        key => h.count('cleanup', `${key}:O`) === 1
      ),
      request_settled: done(),
      events: h.events
    })
    check('cleanup error observed exactly once', o.error_observation_count === 1)
    check('O destroyed once despite cleanup failure', o.O_destroy_count === 1)
    check('N ready despite old cleanup failure', o.N_ready)
    check('replacement keeps observers connected', o.observer_disconnect_count === 0)
    check('remaining O cleanups continue', o.remaining_O_cleanups_executed)
    h.checkExecution()
  },
  async 'G2OWN-C06'(check, o) {
    o.subcases = []
    for (const c of contract.component_cases.find(c => c.id === 'G2OWN-C06').arrange.subcases) {
      const h = environment(c.type)
      h.drawPlans.push({ instance: undefined })
      const rows = c.rows ?? [],
        done = await h.request({ fields: [], data: rows })
      await h.advance()
      if ((c.path === 'legacy' || rows.length > 0) && h.count('draw') !== 1)
        throw new Error(`HARNESS_EXPECTED_RENDERER_NOT_REACHED: ${c.type}`)
      const observed = {
        type: c.type,
        path: c.path,
        rows,
        draw_calls: h.count('draw'),
        error_codes: h.errorCodes(),
        myChart: h.snapshot().myChart?.id ?? null,
        active_scope: !!h.snapshot().activeG2Scope,
        callback_settled: done(),
        events: h.events
      }
      o.subcases.push(observed)
      if (c.path === 'legacy') {
        check(
          `${c.type}: actual legacy draw invoked and settled`,
          observed.draw_calls === 1 && observed.callback_settled
        )
        check(
          `${c.type}: no new missing instance error`,
          !observed.error_codes.includes('G2_RENDER_INSTANCE_MISSING')
        )
      } else if (rows.length === 0) {
        check('line explicit empty skips drawChart', observed.draw_calls === c.draw_calls)
        check(
          'line empty ends without instance/scope/errors',
          observed.myChart === null &&
            !observed.active_scope &&
            observed.error_codes.length === 0 &&
            observed.callback_settled
        )
      } else {
        check(
          'nonempty line actual draw invoked and settled',
          observed.draw_calls === 1 && observed.callback_settled
        )
        check(
          'nonempty line undefined reports missing instance',
          observed.error_codes.includes('G2_RENDER_INSTANCE_MISSING')
        )
        check(
          'nonempty line undefined not published',
          observed.myChart === null && !observed.active_scope
        )
      }
      h.checkExecution()
    }
  }
}
async function supplementalR013() {
  const variants = [
    ['missing_response_data', undefined],
    ['null_response_data', null],
    ['missing_rows', { fields: [] }],
    ['null_rows', { fields: [], data: null }],
    ['object_rows', { fields: [], data: {} }],
    ['zero_rows', { fields: [], data: 0 }],
    ['explicit_empty', { fields: [], data: [] }],
    ['nonempty_rows', { fields: [], data: [{ value: 1 }] }]
  ]
  for (const [id, input] of variants) {
    const h = environment()
    h.drawPlans.push({ instance: undefined })
    h.apiResponses.push({ ...lodash.cloneDeep(h.view), code: 0, data: input, drillFilters: [] })
    let done = false
    await h.public.calcData(h.view, () => {
      done = true
    })
    await tick()
    await h.advance()
    const actual = h.drawInputs[0]
    const drawCalls = h.count('draw')
    const explicitEmpty = Array.isArray(input?.data) && input.data.length === 0
    if (
      !done ||
      drawCalls > 1 ||
      (!explicitEmpty && drawCalls !== 1) ||
      (drawCalls === 1 && canonical(actual) !== canonical(input))
    )
      throw new Error(`R013_REACHABILITY_EXECUTION_ERROR: ${id}`)
    const errorCodes = h.errorCodes()
    const violations = []
    if (explicitEmpty) {
      if (drawCalls !== 0) violations.push('explicit empty must skip drawChart')
      if (errorCodes.length) violations.push('explicit empty must not report missing instance')
    } else {
      if (drawCalls !== 1) violations.push('non-explicit-empty must call original renderer')
      if (!errorCodes.includes('G2_RENDER_INSTANCE_MISSING'))
        violations.push('undefined renderer outcome must report missing instance')
    }
    if (h.snapshot().myChart !== null || h.snapshot().activeG2Scope !== null)
      violations.push('no undefined outcome may publish an instance')
    report.supplemental_r013.push({
      id,
      input: input === undefined ? '[undefined]' : input,
      actual_draw_chart_data: drawCalls
        ? actual === undefined
          ? '[undefined]'
          : actual
        : '[drawChart not called]',
      draw_calls: drawCalls,
      structurally_equal_to_response: drawCalls ? canonical(actual) === canonical(input) : null,
      callback_settled: done,
      line_legacy_length_guard_returns_undefined: !input?.data?.length,
      explicit_empty_design_predicate: explicitEmpty,
      expected_path: explicitEmpty
        ? 'empty; no draw; no missing-instance error'
        : 'original renderer; undefined must be missing-instance error',
      error_codes: errorCodes,
      status: violations.length ? 'assertion_failure' : 'pass',
      violations
    })
    h.checkExecution()
  }
}
try {
  if (!['red', 'green'].includes(mode)) throw new Error('MODE_MUST_BE_RED_OR_GREEN')
  await compileActualSfc()
  for (const c of contract.component_cases) {
    const result = {
      id: c.id,
      scenario: c.scenario,
      frozen_case_sha256: sha(canonical(c)),
      observations: {},
      assertions: [],
      violations: []
    }
    const check = (label, pass) => {
      result.assertions.push({ label, pass: !!pass })
      if (!pass) result.violations.push(label)
    }
    try {
      await bounded(c.id, () => handlers[c.id](check, result.observations))
      result.status = result.violations.length ? 'assertion_failure' : 'pass'
      if (result.violations.length) {
        result.fingerprint =
          c.id === 'G2OWN-C01' && result.observations.after_create_before_ready?.N_published
            ? c.oracle.baseline_failure
            : `${c.id}: CONTRACT_ASSERTION_FAILED`
        report.assertion_failures++
      } else report.passed++
    } catch (error) {
      result.status = 'execution_error'
      result.error = { name: error.name, message: error.message, stack: error.stack }
      report.execution_errors++
    }
    report.component_cases_executed++
    report.cases.push(result)
  }
  await bounded('R013', supplementalR013)
  report.identity.source_sha256_after = sha(await fs.readFile(sourcePath))
  if (report.identity.source_sha256_before !== report.identity.source_sha256_after)
    throw new Error('SOURCE_CHANGED_DURING_EXECUTION')
  report.first_fingerprint = report.cases.find(c => c.fingerprint)?.fingerprint ?? null
  report.red_rule_satisfied =
    report.contract_valid &&
    report.actual_sfc_compiled &&
    report.component_cases_executed === 6 &&
    report.execution_errors === 0 &&
    report.first_fingerprint === 'G2OWN-C01: HELPER_NOT_CONNECTED'
  report.supplemental_r013_passed = report.supplemental_r013.filter(c => c.status === 'pass').length
  report.supplemental_r013_assertion_failures = report.supplemental_r013.filter(
    c => c.status === 'assertion_failure'
  ).length
  report.green_rule_satisfied =
    report.contract_valid &&
    report.actual_sfc_compiled &&
    report.component_cases_executed === 6 &&
    report.execution_errors === 0 &&
    report.passed === 6 &&
    report.supplemental_r013_passed === 8
} catch (error) {
  report.execution_errors++
  report.fatal_error = { name: error.name, message: error.message, stack: error.stack }
}
console.log(JSON.stringify(report, null, 2))
process.exitCode = report.execution_errors
  ? 2
  : report.assertion_failures || report.supplemental_r013_assertion_failures
  ? 1
  : 0
