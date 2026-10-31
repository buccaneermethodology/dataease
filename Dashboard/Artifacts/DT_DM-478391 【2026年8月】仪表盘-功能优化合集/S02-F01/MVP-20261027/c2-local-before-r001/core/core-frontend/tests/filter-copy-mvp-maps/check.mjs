import assert from 'node:assert/strict'
import fs from 'node:fs/promises'
import path from 'node:path'
import vm from 'node:vm'
import { fileURLToPath } from 'node:url'
import { createRequire } from 'node:module'
import { createHash } from 'node:crypto'
import { parse, compileScript } from '@vue/compiler-sfc'
import ts from 'typescript'
import * as Vue from 'vue'
import * as lodash from 'lodash-es'
const root = fileURLToPath(new URL('../../', import.meta.url))
const require = createRequire(import.meta.url)
const artifacts = path.resolve(root, '../../Dashboard/Artifacts')
const owner = (await fs.readdir(artifacts)).find(n => n.startsWith('DT_DM-478391'))
const artifact = path.join(artifacts, owner, 'S02-F01/MVP-20261027')
const fixtures = JSON.parse(
  await fs.readFile(path.join(artifact, 'UiC234ConcreteFixtures-r001.json'), 'utf8')
)
const files = { g2: 'src/views/chart/components/views/components/ChartComponentG2Plot.vue' }
const mapClasses = {
  'flow-map': ['flow-map', 'FlowMap'],
  'heat-map': ['heat-map', 'HeatMap'],
  'symbolic-map': ['symbolic-map', 'SymbolicMap'],
  map: ['map', 'Map'],
  'bubble-map': ['bubble-map', 'BubbleMap']
}
const snapshots = new Map()
const before = process.argv.includes('--before')
const typesOnly = process.argv.includes('--types')
if (before || typesOnly) {
  const manifest = JSON.parse(
    await fs.readFile(path.join(artifact, 'c234-before-r001/manifest.json'), 'utf8')
  )
  for (const item of manifest) {
    const filename = path.resolve(root, '../..', item.source)
    const bytes = await fs.readFile(path.resolve(root, '../..', item.snapshot))
    assert.equal(createHash('sha256').update(bytes).digest('hex'), item.sha256)
    snapshots.set(filename, bytes.toString())
  }
}
const sleep = ms => new Promise(r => setTimeout(r, ms))
const noop = () => undefined
if (typesOnly) {
  const card = JSON.parse(
    await fs.readFile(
      path.join(artifact, '../planning/s02-mvp-c2-maps-builder-r001-card.json'),
      'utf8'
    )
  )
  const names = card.write_scope
    .filter(name => name.startsWith('core/core-frontend/src/'))
    .map(name => path.resolve(root, '../..', name))
  const config = ts.readConfigFile(path.join(root, 'tsconfig.json'), ts.sys.readFile)
  const parsed = ts.parseJsonConfigFileContent(config.config, ts.sys, root)
  const check = old => {
    const virtual = new Map()
    for (const name of names) {
      if (old && !snapshots.has(name)) continue
      const source = old ? snapshots.get(name) : require('node:fs').readFileSync(name, 'utf8')
      virtual.set(
        name.endsWith('.vue') ? name + '.scope.ts' : name,
        name.endsWith('.vue')
          ? compileScript(parse(source).descriptor, { id: 'map-type-check' }).content
          : source
      )
    }
    const options = { ...parsed.options, allowJs: true }
    const host = ts.createCompilerHost(options),
      read = host.readFile,
      exists = host.fileExists
    host.readFile = name =>
      virtual.get(name) ?? (old ? snapshots.get(name) : undefined) ?? read(name)
    host.fileExists = name => virtual.has(name) || exists(name)
    const program = ts.createProgram(
      [...virtual.keys(), ...parsed.fileNames.filter(n => n.endsWith('.d.ts'))],
      options,
      host
    )
    return ts
      .getPreEmitDiagnostics(program)
      .filter(d => d.file && virtual.has(d.file.fileName))
      .map(d => ({
        file: path.basename(d.file.fileName),
        code: d.code,
        message: ts.flattenDiagnosticMessageText(d.messageText, ' ')
      }))
  }
  const old = check(true),
    current = check(false),
    counts = new Map(),
    key = d => d.file + '|' + d.code + '|' + d.message
  for (const d of old) counts.set(key(d), (counts.get(key(d)) || 0) + 1)
  const added = current.filter(d => {
    const n = counts.get(key(d)) || 0
    if (n) {
      counts.set(key(d), n - 1)
      return false
    }
    return true
  })
  console.log(
    JSON.stringify({
      before: old.length,
      current: current.length,
      added,
      claim: '仅本C2写域的真实TS语义诊断差异，非全项目通过'
    })
  )
  process.exit(added.length ? 1 : 0)
}
async function load(fixtureId, fault) {
  const kind = 'g2'
  const fixture = fixtures.fixtures[fixtureId]
  const geo = lodash.cloneDeep(
    fixtures.geojson[fixture.geo_ref?.split('/').at(-1)] || fixtures.geojson.polygon
  )
  const effects = [],
    trace = [],
    nodes = new Map()
  let current = true
  let armed = false
  let releaseDraw
  let drawOptions
  class Node {
    constructor(tag = 'div', text = '') {
      this.tag = tag
      this.text = text
      this.children = []
      this.parent = null
      this.props = {}
      this.style = {}
      this.isRoot = false
    }
    get textContent() {
      return this.text + this.children.map(n => n.textContent).join('')
    }
    set textContent(value) {
      this.text = value
      this.children = []
    }
    appendChild(child) {
      child.remove()
      child.parent = this
      this.children.push(child)
      return child
    }
    setAttribute(key, value) {
      this.props[key] = value
    }
    getAttribute(key) {
      return this.props[key]
    }
    get classList() {
      return {
        add: value => {
          this.props.class = ((this.props.class || '') + ' ' + value).trim()
        }
      }
    }
    querySelectorAll(selector) {
      return this.children
        .flatMap(n => [
          n.tag === selector || n.props.class?.split(' ').includes(selector.slice(1)) ? n : null,
          ...n.querySelectorAll(selector)
        ])
        .filter(Boolean)
    }
    getBBox() {
      return { x: 0, y: 0, width: this.textContent.length * 8, height: 14 }
    }
    get isConnected() {
      return this.isRoot || !!this.parent?.isConnected
    }

    get clientWidth() {
      return 640
    }
    get clientHeight() {
      return 360
    }
    get offsetWidth() {
      return 640
    }
    get offsetHeight() {
      return 360
    }
    getBoundingClientRect() {
      return { width: 640, height: 360, x: 0, y: 0 }
    }
    querySelector(selector) {
      return (
        this.children.find(n => n.props.class?.split(' ').includes(selector.slice(1))) ||
        this.children.map(n => n.querySelector(selector)).find(Boolean)
      )
    }
    closest() {
      return null
    }
    remove() {
      if (this.parent) this.parent.children = this.parent.children.filter(n => n !== this)
      this.parent = null
    }
  }
  const renderer = Vue.createRenderer({
    createElement: tag => new Node(tag),
    createText: text => new Node('#text', text),
    createComment: text => new Node('#comment', text),
    setText: (n, text) => {
      n.text = text
    },
    setElementText: (n, text) => {
      if (armed && fault === 'vue') throw new Error('fixture:vue')
      n.text = text
      n.children = []
    },
    insert: (n, parent, anchor) => {
      n.remove()
      n.parent = parent
      const i = parent.children.indexOf(anchor)
      parent.children.splice(i < 0 ? parent.children.length : i, 0, n)
    },
    remove: n => n.remove(),
    parentNode: n => n.parent,
    nextSibling: n => n.parent?.children[n.parent.children.indexOf(n) + 1],
    patchProp: (n, key, old, value) => {
      n.props[key] = value
      if (key === 'id') nodes.set(value, n)
    }
  })
  const store = Vue.reactive({
    dvInfo: { type: 'dashboard' },
    canvasStyleData: {
      dashboard: {},
      component: { seniorStyleSetting: { pagerColor: '#ffffff', pagerSize: 14 } }
    },
    nowPanelTrackInfo: {},
    nowPanelJumpInfo: {},
    mobileInPc: false,
    inMobile: false,
    embeddedCallBack: 'no'
  })
  for (const name of [
    'setViewDataDetails',
    'setViewOriginData',
    'setViewInstanceInfo',
    'setPureCanvasViewDataInfo',
    'setViewPageInfo'
  ])
    store[name] = (...args) => effects.push([name, ...args])
  const layers = [],
    plots = [],
    dots = [],
    scenes = []
  let host
  class Events {
    constructor() {
      this.events = new Map()
      this.destroyed = false
    }
    on(key, callback) {
      const a = this.events.get(key) || []
      a.push({ callback, once: false })
      this.events.set(key, a)
      return this
    }
    once(key, callback) {
      const a = this.events.get(key) || []
      a.push({ callback, once: true })
      this.events.set(key, a)
      return this
    }
    off(key, callback) {
      this.events.set(
        key,
        (this.events.get(key) || []).filter(x => x.callback !== callback)
      )
      return this
    }
    emit(key, ...args) {
      for (const x of [...(this.events.get(key) || [])]) {
        if (x.once) this.off(key, x.callback)
        x.callback(...args)
      }
    }
    destroy() {
      this.destroyed = true
      this.emit('destroy')
      trace.push('destroy')
      this.events.clear()
    }
  }
  class Layer extends Events {
    constructor(options = {}) {
      super()
      this.options = options
      layers.push(this)
    }
    source(data, options = {}) {
      this.sourceOption = { data: lodash.cloneDeep(data), ...lodash.cloneDeep(options) }
      return this
    }
  }
  for (const key of [
    'size',
    'shape',
    'color',
    'style',
    'active',
    'animate',
    'select',
    'filter',
    'scale',
    'texture'
  ])
    Layer.prototype[key] = function (...args) {
      this[key + 'Args'] = args
      return this
    }
  class Scene extends Events {
    constructor() {
      super()
      this.loaded = fault !== 'scene-wait'
      this.layers = []
      scenes.push(this)
      this.map = new Events()
      Object.assign(this.map, {
        getContainer: () => host,
        getCanvasContainer: () => host,
        _canvasContainer: { lastElementChild: { style: {} } },
        keyboard: { disable: noop },
        fitBounds: noop,
        getZoom: () => 7,
        getCenter: () => ({ lng: 113.5, lat: 22.5 })
      })
    }
    addLayer(layer) {
      trace.push('addLayer')
      this.layers.push(layer)
    }
    getLayers() {
      return this.layers
    }
    lngLatToContainer([lng, lat]) {
      return { x: 80 + (lng - 112.5) * 240, y: 300 - (lat - 21.5) * 100 }
    }
    getMapService() {
      return this.map
    }
  }
  class Plot extends Events {
    constructor(container, options) {
      super()
      this.options = options
      this.source = { data: { dataArray: lodash.cloneDeep(options.source?.data || []) } }
      this.scene = new Scene()
      this.currentDistrictData = lodash.cloneDeep(geo)
      this.tooltip = { hideTooltip: noop }
      plots.push(this)
    }
  }
  class Dot extends Events {
    constructor(options) {
      super()
      this.options = options
      this.tooltip = { hideTooltip: noop }
      dots.push(this)
    }
    addToScene(scene) {
      trace.push('dot.addToScene')
      this.scene = scene
      this.addHadListeners =
        (this.events.get('add') || []).length > 0 && (this.events.get('loaded') || []).length > 0
      return this
    }
  }
  const instance = null
  let callbackFault = fault === 'callback'
  const completedCallback = () => {
    trace.push('callback')
    if (callbackFault) {
      callbackFault = false
      throw new Error('fixture:map_callback')
    }
  }
  const mapStore = {
    mapKeyLoaded: true,
    mapKey: { mapType: 'amap', key: '', securityCode: '' },
    mapCache: { 156: geo }
  }
  const helper = {
    installG2AssistLineVisibility: () => noop,
    installG2TiledLegendStateAdapter: () => noop,
    installG2SliderAdapter: () => noop,
    installG2SideLegendPaginationAdapter: () => noop,
    replayG2TiledLegendSelection: noop
  }
  const carousel = {
    getInstanceByContainerId: () => null,
    destroyByContainer: noop,
    dequeueResize: noop
  }
  const cache = new Map()
  function moduleAt(filename) {
    if (cache.has(filename)) return cache.get(filename)
    const source = snapshots.get(filename) ?? require('node:fs').readFileSync(filename, 'utf8')
    const contents = filename.endsWith('.vue')
      ? compileScript(parse(source).descriptor, { id: 'renderer-witness', inlineTemplate: true })
          .content
      : source
    const code = ts.transpileModule(contents.replaceAll('import.meta.env.DEV', 'false'), {
      compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 }
    }).outputText
    const m = { exports: {} }
    cache.set(filename, m.exports)
    const importModule = spec => {
      if (spec === 'vue') return Vue
      if (spec === 'lodash-es') return lodash
      if (spec === 'pinia')
        return {
          storeToRefs: object =>
            Object.fromEntries(Object.entries(object).map(([key]) => [key, Vue.toRef(object, key)]))
        }
      if (spec.endsWith('/js/panel'))
        return {
          default: {
            getChartView: (render, type) => {
              const n = mapClasses[type]
              if (!n) throw new Error('fixture:unknown-map-type')
              return new (moduleAt(
                path.join(root, 'src/views/chart/components/js/panel/charts/map/' + n[0] + '.ts')
              )[n[1]])()
            }
          },
          __esModule: true
        }
      if (spec.endsWith('/useI18n')) return { useI18n: () => ({ t: value => value }) }
      if (spec.endsWith('/dvMain')) return { dvMainStoreWithOut: () => store }
      if (spec.endsWith('/modules/map')) return { useMapStoreWithOut: () => mapStore }
      if (spec.endsWith('/modules/app')) return { useAppStoreWithOut: () => ({}) }
      if (spec.endsWith('/useEmitt'))
        return {
          useEmitt: () => ({ emitter: { emit: (...args) => effects.push(['emit', ...args]) } })
        }
      if (spec.endsWith('/api/chart'))
        return {
          getData: async () => {
            if (!before) throw new Error('fixture:unexpected-query')
            return lodash.cloneDeep(response)
          }
        }
      if (spec.endsWith('/api/map'))
        return {
          getCustomGeoArea: () => {
            throw new Error('fixture:unexpected-custom-geo-query')
          }
        }
      if (spec.endsWith('/sysParameter'))
        return {
          queryMapKeyApi: () => {
            throw new Error('fixture:unexpected-key-query')
          }
        }
      if (spec.endsWith('/utils/utils'))
        return { deepCopy: lodash.cloneDeep, isMobile: () => false, isISOMobile: () => false }
      if (spec.endsWith('/canvasUtils'))
        return { isDashboard: () => true, isTabCanvas: () => false, trackBarStyleCheck: noop }
      if (spec.endsWith('/canvasStyle')) return { recursionTransObj: noop }
      if (spec.endsWith('/js/formatter') || spec === '../../../formatter')
        return { valueFormatter: value => String(value) }
      if (spec.endsWith('/js/util'))
        return {
          parseJson: value => (typeof value === 'string' ? JSON.parse(value) : value),
          flow:
            (...steps) =>
            (chart, options, context, thisArg) =>
              steps.reduce((o, f) => f.call(thisArg, chart, o, context), options),
          hexColorToRGBA: value => value,
          getGeoJsonFile: async id => {
            if (id !== '156') throw new Error('fixture:unexpected-geo-id')
            trace.push('getGeoJsonFile')
            return lodash.cloneDeep(geo)
          }
        }
      if (spec.endsWith('/common_antv'))
        return {
          getMapCenter: () => [113.5, 22.5],
          getMapStyle: () => 'normal',
          getMapScene: async () => new Scene(),
          mapRendering: noop,
          mapRendered: completedCallback,
          qqMapRendered: completedCallback,
          configL7Zoom: noop,
          configL7PlotZoom: noop,
          configL7Label: () => ({ field: '_DE_LABEL_' }),
          configL7Tooltip: () => ({ showComponent: false }),
          configL7Style: () => ({}),
          configL7Legend: () => ({}),
          handleGeoJson: noop,
          bindMapHoverTooltipRefresh: noop,
          configEmptyDataStyle: noop
        }
      if (spec.endsWith('/tooltip-carousel'))
        return { configCarouselTooltip: noop, escapeTooltipHtml: value => value }
      if (spec === '@antv/l7-scene') return { Scene }
      if (spec === '@antv/l7-layers' || spec === '@antv/l7')
        return {
          LineLayer: Layer,
          PointLayer: Layer,
          HeatmapLayer: Layer,
          LayerPopup: class {},
          Popup: class {}
        }
      if (spec === '@antv/l7plot' || spec === '@antv/l7plot/dist/esm/plots/choropleth')
        return { Dot, Choropleth: Plot }
      if (spec.endsWith('/G2TooltipCarousel')) return { default: carousel, __esModule: true }
      if (spec === './chart-refresh-mock') return { createChartRefreshMock: () => undefined }
      if (spec.endsWith('.vue')) return { default: { render: () => null }, __esModule: true }
      if (
        spec.includes('g2-assist-line') ||
        spec.includes('g2-legend') ||
        spec.endsWith('/barUtil')
      )
        return helper
      if (spec.endsWith('/impl/g2')) return { G2ChartView: class {} }
      const resolved = spec.startsWith('@/')
        ? path.join(root, 'src', spec.slice(2))
        : spec.startsWith('.')
        ? path.resolve(path.dirname(filename), spec)
        : null
      if (resolved) {
        const full = path.extname(resolved)
          ? resolved
          : require('node:fs').existsSync(resolved + '/index.ts')
          ? resolved + '/index.ts'
          : resolved + '.ts'
        if (require('node:fs').existsSync(full)) return moduleAt(full)
      }
      return {}
    }
    vm.runInNewContext(`(function(require,module,exports){${code}\n})`, {
      console: { ...console, error: (...args) => trace.push(['error', ...args]) },
      setTimeout: (fn, ms) => setTimeout(fn, ms >= 10000 ? 80 : ms >= 300 ? 0 : ms),
      clearTimeout,
      requestAnimationFrame: fn => setTimeout(fn, 0),
      cancelAnimationFrame: clearTimeout,
      window: { AMap: {} },
      document: {
        getElementById: id => nodes.get(id),
        createElementNS: (ns, tag) => new Node(tag)
      },
      SVGSVGElement: class {},
      ResizeObserver: class {
        observe() {
          return undefined
        }
        disconnect() {
          return undefined
        }
      },
      IntersectionObserver: class {
        observe() {
          return undefined
        }
        disconnect() {
          return undefined
        }
      },
      Node
    })(importModule, m, m.exports)
    return m.exports
  }
  const component = moduleAt(path.join(root, files[kind])).default
  const base = moduleAt(
    path.join(root, 'src/views/chart/components/editor/util/chart.ts')
  ).BASE_VIEW_CONFIG
  const view = lodash.cloneDeep(base)
  for (const [key, value] of Object.entries(fixture.view_assignments))
    lodash.set(view, key, lodash.cloneDeep(value))
  const response = lodash.cloneDeep(view)
  response.data = lodash.cloneDeep(fixture.response_data)
  for (const [key, value] of Object.entries(fixture.response_assignments))
    lodash.set(response, key, lodash.cloneDeep(value))
  const element = lodash.cloneDeep(fixture.element)
  const binding = { current: Vue.shallowRef({ phase: 'candidate', view, element }) }
  host = new Node()
  host.isRoot = true
  let vueError = null
  const app = renderer.createApp(component, {
    view,
    element,
    suffixId: 'candidate-1',
    pasteBinding: binding
  })
  app.config.errorHandler = error => {
    vueError = error
  }
  app.config.warnHandler = noop
  app.provide('chartExtRequest', Vue.shallowRef({}))
  const proxy = app.mount(host)
  armed = true
  let mounted = true
  return {
    proxy,
    layers,
    plots,
    dots,
    scenes,
    mapStore,
    view,
    response,
    binding,
    instance,
    trace,
    effects,
    host,
    drawOptions: () => drawOptions,
    releaseDraw: () => releaseDraw?.(),
    error: () => vueError,
    invalidate: () => {
      current = false
    },
    prepare: () =>
      !before && proxy.prepareFilterPaste
        ? proxy.prepareFilterPaste(
            { kind: 'queried', request: view, response },
            binding,
            () => current
          )
        : (async () => {
            const info = mapClasses[response.type]
            const chart = new (moduleAt(
              path.join(root, 'src/views/chart/components/js/panel/charts/map/' + info[0] + '.ts')
            )[info[1]])()
            const instance = await chart.drawChart({
              chart: response,
              chartObj: undefined,
              container: 'container-canvas-' + view.id + '-candidate-1',
              areaId: '156',
              action: noop
            })
            instance?.render?.()
            return { ok: true }
          })(),
    unmount: () => {
      if (mounted) {
        mounted = false
        app.unmount()
      }
    }
  }
}

let passed = 0,
  failed = 0,
  execution = 0
const records = []
for (const id of [
  'map-flow',
  'map-heat',
  'map-symbolic',
  'map-polygon',
  'bubble-map-polygon',
  'map-point',
  'bubble-map-point'
])
  for (const fault of ['normal', 'callback', 'timeout', 'scene-wait', 'error', 'discard']) {
    let s
    try {
      s = await load(id, fault)
      let settled = false
      let output
      const pending = s.prepare().then(
        value => {
          settled = true
          output = value
        },
        error => {
          settled = true
          output = { error }
        }
      )
      await sleep(15)
      if (output?.error) throw output.error
      const expected = fixtures.fixtures[id].expected
      if (before) {
        const errors = s.trace.filter(item => Array.isArray(item) && item[0] === 'error')
        if (errors.length)
          throw new Error('fixture:old-map-body-error ' + String(errors[0][2]?.stack || errors[0]))
        if (expected.configList_length && s.layers.length !== expected.configList_length)
          throw new Error('fixture:layers-not-created ' + s.layers.length)
        if (!expected.configList_length && s.plots.length !== 1)
          throw new Error('fixture:plot-not-created ' + s.plots.length)
      }
      assert.equal(settled, false, 'MAP_READY_BEFORE_REQUIRED_EVENTS')
      if (fault === 'timeout' || fault === 'discard') {
        if (fault === 'discard') s.unmount()
        await pending
        assert.equal(output.ok, false)
        const count = s.trace.filter(x => x === 'callback').length
        for (const layer of s.layers) layer.emit('inited')
        for (const plot of s.plots) plot.emit('loaded')
        for (const dot of s.dots) {
          dot.emit('add')
          dot.emit('loaded')
        }
        assert.equal(
          s.trace.filter(x => x === 'callback').length,
          count,
          '迟到ready不得执行旧callback'
        )
      } else if (fault === 'error') {
        ;(s.layers[0] || s.plots[0]).emit('error', new Error('fixture:sdk_error'))
        await pending
        assert.equal(output.ok, false)
      } else {
        if (fault === 'scene-wait' && s.layers.length) {
          assert.equal(s.scenes[0].layers.length, 0)
          s.scenes[0].loaded = true
          s.scenes[0].emit('loaded')
        }
        if (s.layers.length) {
          for (let i = 0; i < s.layers.length; i++) {
            s.layers[i].emit('inited')
            await Vue.nextTick()
            if (i < s.layers.length - 1 && fault === 'normal')
              assert.equal(settled, false, 'MAP_READY_BEFORE_LAST_LAYER')
          }
        }
        for (const p of s.plots) p.emit('loaded')
        if (s.dots.length) {
          await Vue.nextTick()
          if (fault !== 'callback') assert.equal(settled, false, 'MAP_READY_BEFORE_DOT_EVENTS')
          for (const d of s.dots) {
            if (fault !== 'callback' || d.scene) assert.equal(d.addHadListeners, true)
            d.emit('add')
            d.emit('loaded')
          }
        }
        await pending
        assert.equal(output.ok, fault !== 'callback')
        if (output.ok) {
          if (id === 'map-symbolic')
            assert.equal(
              JSON.stringify(s.layers[1].sourceOption.data.map(x => x.textLayerContent)),
              JSON.stringify(fixtures.fixtures[id].expected.textLayerContent)
            )
          if (id.includes('polygon') || id.includes('point'))
            assert.equal(
              JSON.stringify(s.host.querySelectorAll('text').map(x => x.textContent)),
              JSON.stringify(fixtures.fixtures[id].expected.label_names)
            )
          output.handle.dispose()
        }
      }
      assert.equal(s.effects.length, 0)
      passed++
      records.push({ id, fault, verdict: 'PASS', layers: s.layers.length, dots: s.dots.length })
    } catch (error) {
      if (error instanceof assert.AssertionError) {
        failed++
        records.push({
          id,
          fault,
          verdict: 'SEMANTIC_FAIL',
          message: error.message,
          layers: s?.layers.length,
          plots: s?.plots.length
        })
      } else {
        execution++
        records.push({ id, fault, verdict: 'EXECUTION_ERROR', message: error.stack })
      }
    } finally {
      s?.unmount()
    }
  }
if (!before)
  for (const id of [
    'map-flow',
    'map-heat',
    'map-symbolic',
    'map-polygon',
    'bubble-map-polygon',
    'map-point',
    'bubble-map-point'
  ]) {
    let state
    try {
      state = await load(id, 'normal')
      if (id === 'map-flow' || id === 'map-heat' || id === 'map-symbolic')
        state.mapStore.mapKeyLoaded = false
      else state.mapStore.mapCache = {}
      assert.equal(state.proxy.canPrepareFilterPaste(), false)
      const result = await state.prepare()
      assert.equal(result.ok, false)
      assert.equal(result.reason, 'map_infrastructure_unavailable')
      assert.equal(state.scenes.length, 0)
      assert.equal(state.effects.length, 0)
      passed++
      records.push({ id, fault: 'prewarm-missing', verdict: 'PASS' })
    } catch (error) {
      if (error instanceof assert.AssertionError) {
        failed++
        records.push({
          id,
          fault: 'prewarm-missing',
          verdict: 'SEMANTIC_FAIL',
          message: error.message
        })
      } else {
        execution++
        records.push({
          id,
          fault: 'prewarm-missing',
          verdict: 'EXECUTION_ERROR',
          message: error.stack
        })
      }
    } finally {
      state?.unmount()
    }
  }
console.log(JSON.stringify({ passed, failed, execution, records }, null, 2))
process.exitCode = failed || execution ? 1 : 0
