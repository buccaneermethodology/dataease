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
const sceneBefore = process.argv.includes('--scene-before')
const sceneTypes = process.argv.includes('--scene-types')
const repairBefore = process.argv.includes('--repair-before') || sceneBefore
const repairTypes = process.argv.includes('--repair-types') || sceneTypes
const repairManifest =
  process.argv
    .find(arg => arg.startsWith('--repair-manifest='))
    ?.slice('--repair-manifest='.length) ??
  (sceneBefore || sceneTypes
    ? path.join(artifact, 'c2-scene-before-r001/manifest.json')
    : undefined)
if (repairBefore || repairTypes) {
  assert.ok(repairManifest, '--repair-manifest=<写前保全manifest绝对路径> 必需')
  for (const item of JSON.parse(await fs.readFile(repairManifest, 'utf8'))) {
    if (!item.source.startsWith('core/core-frontend/src/')) continue
    const bytes = await fs.readFile(item.snapshot)
    assert.equal(createHash('sha256').update(bytes).digest('hex'), item.sha256)
    snapshots.set(path.resolve(root, '../..', item.source), bytes.toString())
  }
}
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
if (typesOnly || repairTypes) {
  const card = JSON.parse(
    await fs.readFile(
      path.join(artifact, '../planning/s02-mvp-c2-maps-builder-r001-card.json'),
      'utf8'
    )
  )
  const names = (
    repairTypes
      ? [
          'core/core-frontend/src/views/chart/components/js/panel/charts/map/filter-paste-ready.ts',
          'core/core-frontend/src/views/chart/components/views/components/ChartComponentG2Plot.vue'
        ]
      : card.write_scope
  )
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

// SDK方法原样提取；WebGL、source和底层layer/scene设施为受控替身。
const EventEmitter = require('@antv/event-emitter').default
const sdkDir = path.join(root, 'node_modules/@antv/l7plot/dist/esm')
const sdkMethods = (relative, className, names) => {
  const filename = path.join(sdkDir, relative)
  const source = require('node:fs').readFileSync(filename, 'utf8')
  const ast = ts.createSourceFile(filename, source, ts.ScriptTarget.Latest, true)
  const declaration = ast.statements.find(s => ts.isClassDeclaration(s) && s.name.text === className)
  return names.map(name => {
    const method = declaration.members.find(m => name === 'constructor' ? ts.isConstructorDeclaration(m) : m.name?.getText(ast) === name)
    assert.ok(method, `SDK_METHOD_MISSING:${className}.${name}`)
    return method.getText(ast)
  }).join('\n')
}
const constants = require('@antv/l7plot/dist/lib/core/map/constants.js')
const { LayerGroup } = require('@antv/l7plot/dist/lib/core/layer/layer-group.js')
const sdkMapMethods = sdkMethods('core/map/index.js', 'Map', ['constructor','on','off','once','proxyEventHander','destroy'])
const sdkPlotMethods = sdkMethods('core/plot/index.js', 'Plot', ['constructor','addToScene','attachToScene','initSource','render','onSceneLoaded','onLayersLoaded'])
const SDKMap = vm.runInNewContext(`(class SDKMap extends EventEmitter { ${sdkMapMethods}\ngetDefaultOptions(){return {}} })`, {
  EventEmitter, LayerGroup, ...constants, deepAssign: lodash.merge
})
const SDKPlot = vm.runInNewContext(`(class SDKPlot extends SDKMap { ${sdkPlotMethods} })`, {
  SDKMap, Element: class {}, getTheme: () => ({})
})
// 确认实际super具名off/通配符/once及委托事件语义。
const emitterProbe = new EventEmitter()
let namedCalls = 0
emitterProbe.on('loaded', () => namedCalls++)
emitterProbe.on('*', () => { throw new Error('wildcard should be removed') })
emitterProbe.off('*'); emitterProbe.emit('loaded'); assert.equal(namedCalls, 1)
emitterProbe.off('loaded'); emitterProbe.emit('loaded'); assert.equal(namedCalls, 1)
let onceCalls = 0
emitterProbe.once('once', () => onceCalls++); emitterProbe.emit('once'); emitterProbe.emit('once'); assert.equal(onceCalls, 1)
const proxyProbe = new SDKMap({})
assert.equal(proxyProbe.scene, undefined)
assert.throws(() => proxyProbe.on('destroy', () => undefined), /undefined/)
proxyProbe.dotLayer = new EventEmitter()
let clickCalls = 0
const clickProbe = () => clickCalls++
proxyProbe.on('dotLayer:click', clickProbe); proxyProbe.dotLayer.emit('click'); proxyProbe.off('dotLayer:click', clickProbe); proxyProbe.dotLayer.emit('click'); assert.equal(clickCalls, 1)

async function load(fixtureId, fault, options = {}) {
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
      trace.push("dom.append:" + child.tag)
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
      this.sceneService = { loaded: this.loaded }
      this.layers = []
      scenes.push(this)
      this.map = new Events()
      Object.assign(this.map, {
        getContainer: () => host,
        getCanvasContainer: () => host,
        _canvasContainer: { lastElementChild: { style: {} } },
        keyboard: { disable: () => trace.push('post.keyboard') },
        fitBounds: () => trace.push('post.fitBounds'),
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

  Plot.prototype.destroy = function () {
    this.destroyCount++
    trace.push("plot.destroy")
    this.scene.destroy()
  }
  class Dot extends SDKPlot {
    constructor(options) {
      super(options)
      this.destroyCount = 0
      assert.equal(this.scene, undefined, 'OPTIONS_ONLY_MUST_NOT_HAVE_SCENE')
      dots.push(this)
    }
    on(name, callback, once) {
      try { return super.on(name, callback, once) }
      catch (error) {
        trace.push({ event: 'sdk.subscribe.failure', name, scenePresent: !!this.scene, message: error.message })
        throw error
      }
    }
    registerResources() { trace.push('sdk.registerResources') }
    createSource() { return { data: { dataArray: lodash.cloneDeep(this.options.source?.data || []) } } }
    initLayersEvent() {}
    createLayers() {
      const dot = this
      class ControlledLayer extends EventEmitter {
        constructor(name) { super(); this.name = name }
        addTo(scene) {
          scene.addLayer(this)
          if (fault.startsWith('sync')) this.emit('inited')
        }
        on(name, cb, once) {
          if (name === 'click') trace.push('post.click')
          return super.on(name, cb, once)
        }
        destroy() { trace.push('controlled.layer.destroy') }
      }
      this.dotLayer = new ControlledLayer('dotLayer')
      this.labelLayer = new ControlledLayer('labelLayer')
      return new LayerGroup([this.dotLayer, this.labelLayer])
    }
    initComponents() {
      trace.push('sdk.initComponents')
      this.tooltip = { hideTooltip: noop, destroy: () => trace.push('sdk.tooltip.destroy') }
    }
    emit(name, ...args) {
      super.emit(name, ...args)
      if (name === 'loaded') {
        trace.push('sdk.loaded')
        if (fault === 'sync-error' || fault === 'same-turn-error') this.emit('error', new Error('fixture:dot_error'))
        if (fault === 'sync-cancel') { current = false; trace.push('fault.cancel') }
        if (fault === 'microtask-error') queueMicrotask(() => this.emit('error', new Error('fixture:dot_error')))
      }
    }
    destroy() {
      this.destroyCount++
      trace.push('dot.destroy')
      return super.destroy()
    }
    removeScaleControl() {}
    removeZoomControl() {}
    removeLayerMenuControl() {}
    removeLegendControl() {}
  }
  const instance = null
  let callbackFault = fault === 'callback' || fault === 'sync-callback'
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
    enqueueResize: (id, task) => task(),
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
  armed = true
  let mounted = true
  return {
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


let passed = 0, failed = 0, execution = 0
const records = []
const impacted = ['bubble-map-polygon','map-point','bubble-map-point']
const faults = ['normal','sync-normal','callback','sync-callback','sync-error','sync-cancel','dot-error','scene-error','scene-destroy','timeout','unmount','late-loaded','duplicate-loaded','same-turn-error','microtask-error','metadata-error','dispose-replay']
for (const id of impacted) {
  for (const fault of faults) {
    let s
    try {
      s = await load(id, fault)
      let settled = false, output
      const pending = s.prepare().then(value => { settled = true; output = value })
      await sleep(5)
      assert.equal(s.error(), null, 'MOUNT_ERROR')
      assert.equal(s.plots.length, 1, 'REAL_PRODUCT_PLOT_REQUIRED')
      assert.equal(s.dots.length, 1, 'REAL_PRODUCT_DOT_REQUIRED')
      assert.equal(settled, false, 'NO_READY_BEFORE_VIEW')
      const dot = s.dots[0]
      s.plots[0].emit('loaded')
      // 本断言在旧源上准确暴露errors(Dot)对未挂载scene注册destroy的业务失败。
      assert.ok(dot.scene, 'PRE_ATTACH_DESTROY_PROXY_ABORTED')
      if (!fault.startsWith('sync')) {
        assert.equal(dot.loaded, false)
        assert.equal(settled, false, 'NO_READY_BEFORE_DOT_LAYERS')
        if (['timeout','unmount','late-loaded'].includes(fault)) {
          if (fault !== 'timeout') s.unmount()
        } else if (fault === 'dot-error') dot.emit('error', new Error('fixture:dot_error'))
        else if (fault === 'scene-error') s.scenes[0].emit('error', new Error('fixture:scene_error'))
        else if (fault === 'scene-destroy') s.scenes[0].emit('destroy')
        else {
          dot.layerGroup.layers[0].emit('inited')
          assert.equal(dot.loaded, false, 'ALL_LAYERS_REQUIRED')
          dot.layerGroup.layers[1].emit('inited')
        }
      }
      await pending
      const success = ['normal','sync-normal','duplicate-loaded','metadata-error','dispose-replay'].includes(fault)
      assert.equal(output.ok, success, 'DOT_READY_OUTCOME:' + fault)
      if (success) {
        assert.equal(dot.loaded, true)
        assert.equal(s.trace.filter(x => x === 'callback').length, 1)
        assert.ok(s.trace.includes('post.keyboard'))
        assert.ok(s.trace.includes('post.click'))
        if (id.includes('point')) assert.ok(s.trace.includes('post.fitBounds'))
        assert.equal(JSON.stringify(s.host.querySelectorAll('text').map(x => x.textContent)), JSON.stringify(fixtures.fixtures[id].expected.label_names))
        if (fault === 'duplicate-loaded') {
          dot.onLayersLoaded()
          assert.equal(s.trace.filter(x => x === 'callback').length, 1, 'DUPLICATE_CALLBACK')
        }
        if (fault === 'metadata-error') {
          dot.emit('error', new Error('fixture:post_handle_error'))
          assert.throws(() => output.handle.metadata, /paste_map_cancelled/)
        } else assert.ok(output.handle.metadata)
        output.handle.dispose(); output.handle.dispose()
      }
      if (fault.startsWith('sync') && !success) {
        const pivot = s.trace.findIndex(x => x === (fault === 'sync-cancel' ? 'fault.cancel' : fault === 'sync-callback' ? 'callback' : 'dot.destroy'))
        assert.ok(pivot >= 0)
        assert.equal(s.trace.slice(pivot + 1).some(x => typeof x === 'string' && (x.startsWith('post.') || x.startsWith('dom.append:'))), false, 'CLOSED_THEN_SIDE_EFFECT')
      }
      const callbacks = s.trace.filter(x => x === 'callback').length
      for (const layer of dot.layerGroup.layers) layer.emit('inited')
      dot.onLayersLoaded()
      assert.equal(s.trace.filter(x => x === 'callback').length, callbacks, 'LATE_CALLBACK')
      assert.equal(dot.destroyCount, 1, 'DOT_HANDLE_CLEANUP_ONCE')
      assert.equal(s.plots[0].destroyCount, 1, 'VIEW_HANDLE_CLEANUP_ONCE')
      assert.equal((dot.getEvents().loaded || []).length, 0, 'PRECISE_LOADED_OFF')
      assert.equal((dot.getEvents().error || []).length, 0, 'PRECISE_ERROR_OFF')
      assert.equal(s.effects.length, 0)
      passed++; records.push({id,fault,verdict:'PASS'})
    } catch (error) {
      const assertion = error?.name === 'AssertionError'
      if (assertion) failed++; else execution++
      records.push({id,fault,verdict:assertion?'SEMANTIC_FAIL':'EXECUTION_ERROR',message:String(error.message),trace:s?.trace})
    } finally { s?.unmount() }
  }
}
// 七类地图中未受Dot修改影响的四类，真实组件/地图类基础回归。
for (const id of ['map-flow','map-heat','map-symbolic','map-polygon']) {
  let s
  try {
    s = await load(id,'normal')
    const pending = s.prepare()
    await sleep(5)
    for (const layer of s.layers) layer.emit('inited')
    for (const plot of s.plots) plot.emit('loaded')
    const result = await pending
    assert.equal(result.ok, true)
    result.handle.dispose()
    assert.equal(s.effects.length, 0)
    passed++; records.push({id,fault:'normal-regression',verdict:'PASS'})
  } catch (error) {
    const assertion=error?.name === 'AssertionError'
    if(assertion) failed++; else execution++
    records.push({id,verdict:assertion?'SEMANTIC_FAIL':'EXECUTION_ERROR',message:String(error.message)})
  } finally { s?.unmount() }
}
// 无Dot顶层add发射的契约证据，独立于早期代理异常，不冒充旧源timeout实测。
for (const filename of ['bubble-map.ts','point-fallback.ts']) {
 const file=path.join(root,'src/views/chart/components/js/panel/charts/map',filename)
 const source=snapshots.get(file) ?? await fs.readFile(file,'utf8')
 const hasImpossibleWait=/filterPaste\.wait\(dotLayer, 'add'/.test(source)
 if(hasImpossibleWait) failed++; else passed++
 records.push({id:filename,fault:'static-sdk-contract-no-top-level-add',verdict:hasImpossibleWait?'SEMANTIC_FAIL':'PASS'})
}
console.log(JSON.stringify({passed,failed,execution,caseCount:records.length,library:'@antv/l7plot 0.5.11',evidence:'实际Map/Plot构造与事件/加载方法、LayerGroup/EventEmitter；source、layers、scene与GPU为受控替身；计时缩放，不证明30/31秒墙钟竞争',records},null,2))
process.exitCode=execution?2:failed?1:0
