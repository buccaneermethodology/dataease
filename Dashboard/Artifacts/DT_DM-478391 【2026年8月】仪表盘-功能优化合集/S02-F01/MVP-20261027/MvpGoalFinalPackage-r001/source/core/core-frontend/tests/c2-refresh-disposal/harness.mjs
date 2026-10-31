import assert from 'node:assert/strict'
import fs from 'node:fs/promises'
import path from 'node:path'
import vm from 'node:vm'
import { fileURLToPath } from 'node:url'
import { createRequire } from 'node:module'
import { createHash } from 'node:crypto'
import { parse, compileScript } from '@vue/compiler-sfc'
import ts from 'typescript'
import { parse as parseAst } from '@babel/parser'
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
const before = false
const sleep = ms => new Promise(r => setTimeout(r, ms))
const noop = () => undefined
// getMapScene使用当前生产完整函数体，SDK/其余设施仍为明确double。
const commonFile = path.join(root, 'src/views/chart/components/js/panel/common/common_antv.ts')
const commonSource = await fs.readFile(commonFile, 'utf8')
const commonAst = ts.createSourceFile(commonFile, commonSource, ts.ScriptTarget.Latest, true)
const mapSceneFunction = commonAst.statements
  .find(s => ts.isFunctionDeclaration(s) && s.name?.text === 'getMapScene')
  .getText(commonAst)
  .replace(/^export\s+/, '')
const mapSceneCode =
  ts.transpileModule('const selected = ' + mapSceneFunction, {
    compilerOptions: { target: ts.ScriptTarget.ES2022 }
  }).outputText + '\nselected'
async function load(fixtureId, fault, options = {}) {
  const kind = 'g2'
  const isG2 = fixtureId === 'bar' || fixtureId === 'line'
  const fixture = lodash.cloneDeep(fixtures.fixtures[isG2 ? 'map-polygon' : fixtureId])
  if (isG2) {
    fixture.view_assignments.type = fixtureId
    fixture.view_assignments.id = 'g2-' + fixtureId
    fixture.response_assignments.type = fixtureId
    fixture.response_assignments.id = 'g2-' + fixtureId
    fixture.view_assignments['customAttr.tooltip.carousel'] = { enable: false }
    fixture.response_data.data = [{ value: 1 }]
  }
  const RealmError = vm.runInNewContext('Error')
  const sentinel = new RealmError('C2_RD_DESTROY_SENTINEL')
  let snapshot = () => ({ myChart: null, activeG2Scope: null })
  let sampling = false
  const sdkSamples = [],
    wrapperSamples = [],
    warnings = [],
    scopeResults = []
  const sample = object => ({
    object,
    current: snapshot().myChart,
    activeScope: snapshot().activeG2Scope
  })
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
  const g2Instances = []
  const layers = [],
    plots = [],
    dots = [],
    scenes = []
  let host
  const resizeCallbacks = []
  class Events {
    constructor() {
      this.events = new Map()
      this.destroyed = false
      this.destroyCount = 0
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
      if (sampling && (scenes.includes(this) || plots.includes(this) || g2Instances.includes(this)))
        sdkSamples.push(sample(this))
      this.destroyCount++
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
    async removeAllLayer() {
      for (const layer of [...this.layers]) layer.destroy()
      this.layers = []
    }
    setPitch() {
      return undefined
    }
    setMapStyle() {
      return undefined
    }
    setZoomAndCenter() {
      return undefined
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
  class G2Chart extends Events {
    constructor() {
      super()
      g2Instances.push(this)
    }
    async render() {
      return undefined
    }
    async forceFit() {
      return undefined
    }
    options(value) {
      if (value) this.spec = value
      return this.spec || { children: [] }
    }
    getContext() {
      return { canvas: { document: { getElementsByClassName: () => [] }, render: noop }, views: [] }
    }
  }
  const g2View = {
    library: 'g2',
    drawChart: async () => new G2Chart(),
    afterRender: async () => undefined,
    applyThemeFont: noop,
    optimizeLargeData: noop,
    updateData: async () => false
  }
  const helper = {
    listenerTooltipShow: noop,
    applyG2TiledLegend: value => value,
    installG2AssistLineVisibility: () => noop,
    installG2TiledLegendStateAdapter: () => noop,
    installG2SliderAdapter: () => noop,
    installG2SideLegendPaginationAdapter: () => noop,
    replayG2TiledLegendSelection: noop
  }
  const carousel = {
    enqueueResize: (id, task) => task(),
    getInstanceByContainerId: () => null,
    destroyByContainer: noop,
    dequeueResize: noop
  }
  const cache = new Map()
  function moduleAt(filename) {
    if (cache.has(filename)) return cache.get(filename)
    const source = snapshots.get(filename) ?? require('node:fs').readFileSync(filename, 'utf8')
    let contents = filename.endsWith('.vue')
      ? compileScript(parse(source).descriptor, {
          id: 'finite-disposal-witness',
          inlineTemplate: true
        }).content
      : source
    if (filename === path.join(root, files.g2)) {
      const ast = parseAst(contents, { sourceType: 'module', plugins: ['typescript'] })
      const exposed = []
      const visit = node => {
        if (!node || typeof node !== 'object') return
        if (
          node.type === 'CallExpression' &&
          node.callee?.name === '__expose' &&
          node.arguments[0]?.type === 'ObjectExpression'
        )
          exposed.push(node.arguments[0])
        for (const [key, value] of Object.entries(node)) {
          if (['loc', 'start', 'end'].includes(key)) continue
          if (Array.isArray(value)) value.forEach(visit)
          else if (value && typeof value === 'object') visit(value)
        }
      }
      visit(ast)
      // 仅在AST唯一定位的实际expose对象插入只读getter，原SFC所有字节保持次序。
      if (exposed.length !== 1) throw new Error('HARNESS_EXPOSE_ANCHOR_NOT_UNIQUE')
      const at = exposed[0].start + 1
      contents =
        contents.slice(0, at) +
        'get __c2Snapshot() { return { myChart, activeG2Scope, chartComponentUnmounted, g2RenderQueue } },' +
        contents.slice(at)
    }
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
              if (type === 'bar' || type === 'line') return g2View
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
            effects.push(['query'])
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
          configAxisTitleOverflowTooltip: noop,
          installG2SliderAdapter: () => noop,
          getMapCenter: () => [113.5, 22.5],
          getMapStyle: () => 'normal',
          getMapScene: options.realScene
            ? (...args) =>
                vm.runInNewContext(mapSceneCode, {
                  CUSTOM_TILE_MAP_TYPE: 'customTile',
                  isCustomOnlineMapScene: () => false,
                  Scene,
                  mapRendering: noop,
                  mapRendered: noop,
                  getMapObject: () => ({})
                })(...args)
            : async () => new Scene(),
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
      Error: RealmError,
      console: {
        ...console,
        warn: (...args) => warnings.push(args),
        error: (...args) => trace.push(['error', ...args])
      },
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
        constructor(callback) {
          resizeCallbacks.push(callback)
        }
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
  snapshot = () => proxy.__c2Snapshot
  armed = true
  let mounted = true
  return {
    proxy,
    snapshot,
    sentinel,
    sdkSamples,
    wrapperSamples,
    warnings,
    scopeResults,
    g2Instances,
    setSampling: () => {
      sampling = true
    },
    instrument: (object, label, throws = false) => {
      const original = object.destroy
      let entries = 0
      object.destroy = function (...args) {
        entries++
        wrapperSamples.push({ ...sample(object), label })
        if (throws) throw sentinel
        return original.apply(this, args)
      }
      return () => entries
    },
    observeScope: scope => {
      const original = scope.dispose
      scope.dispose = function (...args) {
        const result = original.apply(this, args)
        scopeResults.push(result)
        return result
      }
    },
    proxy,
    resize: () => resizeCallbacks[0]([{ borderBoxSize: [{ inlineSize: 900, blockSize: 700 }] }]),
    legacyDraw: async chartObj => {
      const [file, name] = mapClasses[response.type]
      const handler = new (moduleAt(
        path.join(root, 'src/views/chart/components/js/panel/charts/map/' + file + '.ts')
      )[name])()
      const wrapper = await handler.drawChart({
        chartObj,
        container: [...nodes.keys()].find(n => n.startsWith('container-')),
        chart: { ...lodash.cloneDeep(response), data: lodash.cloneDeep(response.data) },
        action: {}
      })
      wrapper.render()
      return wrapper
    },
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

export { load, sleep, root, artifact }
