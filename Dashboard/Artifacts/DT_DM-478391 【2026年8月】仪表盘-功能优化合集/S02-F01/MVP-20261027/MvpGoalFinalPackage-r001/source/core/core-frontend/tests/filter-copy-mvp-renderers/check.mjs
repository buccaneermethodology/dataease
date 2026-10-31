import assert from 'node:assert/strict'
import fs from 'node:fs/promises'
import path from 'node:path'
import vm from 'node:vm'
import { fileURLToPath } from 'node:url'
import { createHash } from 'node:crypto'
import { createRequire } from 'node:module'
import { parse, compileScript } from '@vue/compiler-sfc'
import ts from 'typescript'
import * as Vue from 'vue'
import * as lodash from 'lodash-es'

// 真实完整 SFC + Vue render/flush；图表库、DOM host、Store 是显式替身。
const root = fileURLToPath(new URL('../../', import.meta.url))
const require = createRequire(import.meta.url)
const files = {
  g2: 'src/views/chart/components/views/components/ChartComponentG2Plot.vue',
  s2: 'src/views/chart/components/views/components/ChartComponentS2.vue',
  indicator: 'src/custom-component/indicator/DeIndicator.vue'
}
const baseline = process.argv.includes('--baseline')
const before = process.argv.includes('--before')
const typesOnly = process.argv.includes('--types')
const snapshots = new Map()
if (before || typesOnly) {
  const artifacts = path.resolve(root, '../../Dashboard/Artifacts')
  const owner = (await fs.readdir(artifacts)).find(name => name.startsWith('DT_DM-478391'))
  const manifest = JSON.parse(
    await fs.readFile(
      path.join(artifacts, owner, 'S02-F01/MVP-20261027/c1-before-r001/manifest.json'),
      'utf8'
    )
  )
  for (const file of Object.values(files)) {
    const entry = manifest.find(item => item.source === `core/core-frontend/${file}`)
    const bytes = await fs.readFile(path.resolve(root, '../..', entry.snapshot))
    assert.equal(createHash('sha256').update(bytes).digest('hex'), entry.sha256)
    snapshots.set(path.join(root, file), bytes.toString())
  }
}
if (typesOnly) {
  const config = ts.readConfigFile(path.join(root, 'tsconfig.json'), ts.sys.readFile)
  const parsed = ts.parseJsonConfigFileContent(config.config, ts.sys, root)
  const checkTypes = useBefore => {
    const virtual = new Map(
      Object.values(files).map(name => {
        const filename = path.join(root, name)
        const source = useBefore
          ? snapshots.get(filename)
          : require('node:fs').readFileSync(filename, 'utf8')
        return [
          filename + '.scope.ts',
          compileScript(parse(source).descriptor, { id: 'scope-check' }).content
        ]
      })
    )
    const options = { ...parsed.options, allowJs: true }
    const host = ts.createCompilerHost(options)
    const read = host.readFile,
      exists = host.fileExists
    host.readFile = name => virtual.get(name) ?? read(name)
    host.fileExists = name => virtual.has(name) || exists(name)
    const program = ts.createProgram(
      [...virtual.keys(), ...parsed.fileNames.filter(name => name.endsWith('.d.ts'))],
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
  const old = checkTypes(true),
    current = checkTypes(false)
  const counts = new Map()
  const key = d => `${d.file}|${d.code}|${d.message}`
  for (const d of old) counts.set(key(d), (counts.get(key(d)) || 0) + 1)
  const added = current.filter(d => {
    const count = counts.get(key(d)) || 0
    if (!count) return true
    counts.set(key(d), count - 1)
    return false
  })
  console.log(
    JSON.stringify({
      scope: '真实compileScript+tsconfig+声明，仅三虚拟SFC语义诊断multiset对照，非全项目类型通过',
      before: old.length,
      current: current.length,
      added
    })
  )
  process.exit(added.length ? 1 : 0)
}
let pass = 0
let fail = 0
let execution = 0
const records = []
const unhandled = []
process.on('unhandledRejection', error => unhandled.push(String(error)))
const sleep = ms => new Promise(resolve => setTimeout(resolve, ms))
const noop = () => undefined
const hash = bytes => createHash('sha256').update(bytes).digest('hex')

async function load(kind, fault) {
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
    get isConnected() {
      return this.isRoot || !!this.parent?.isConnected
    }
    get textContent() {
      return this.text + this.children.map(n => n.textContent).join('')
    }
    get clientWidth() {
      return 400
    }
    get clientHeight() {
      return 250
    }
    get offsetWidth() {
      return 400
    }
    get offsetHeight() {
      return 250
    }
    getBoundingClientRect() {
      return { width: 400, height: 250, x: 0, y: 0 }
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
  const listeners = new Map()
  const instance = {
    options: value => value || {},
    getContext: () => ({}),
    destroy: () => trace.push('destroy'),
    on: (key, callback) => {
      listeners.set(key, callback)
    },
    off: key => listeners.delete(key),
    emit: noop,
    facet: { timer: { stop: noop }, cancelScrollFrame: noop },
    render: async () => {
      trace.push('render')
      if (fault === 'render') throw new Error('fixture:render')
      if (fault === 'layout-late') setTimeout(() => listeners.get('layout')?.(), 10)
      else if (fault !== 'layout') listeners.get('layout')?.()
      if (fault === 'render-late') await sleep(10)
    },
    getCanvasElement: () => null
  }
  const chartView = {
    library: 'G2',
    drawChart: options => {
      drawOptions = options
      trace.push('draw')
      // 与实际矩阵drawChart的tableRow非数组拒绝一致；图库仍为显式替身。
      if (options.chart.type === 't-heatmap' && !Array.isArray(options.chart.data?.tableRow))
        return undefined
      if (fault === 'draw') throw new Error('fixture:draw')
      if (fault === 'draw-late')
        return new Promise(resolve => {
          releaseDraw = () => resolve(instance)
        })
      return instance
    },
    afterRender: async () => {
      trace.push('afterRender')
      if (fault === 'afterRender') throw new Error('fixture:afterRender')
    },
    applyThemeFont: noop,
    optimizeLargeData: noop
  }
  const helper = {
    installG2AssistLineVisibility: () => noop,
    installG2TiledLegendStateAdapter: () => noop,
    installG2SliderAdapter: () => noop,
    installG2SideLegendPaginationAdapter: () => noop,
    applyG2TiledLegend: value => value,
    replayG2TiledLegendSelection: noop,
    configAxisTitleOverflowTooltip: noop,
    listenerTooltipShow: noop,
    configEmptyDataStyle: noop
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
      if (spec.endsWith('/editor/util/chart') || spec === '../../editor/util/chart')
        return moduleAt(path.join(root, 'src/views/chart/components/editor/util/chart.ts'))
      if (spec === './g2-render-attempt')
        return moduleAt(path.resolve(path.dirname(filename), 'g2-render-attempt.ts'))
      if (spec.endsWith('/js/panel'))
        return { default: { getChartView: () => chartView }, __esModule: true }
      if (spec.endsWith('/panel/types'))
        return { ChartLibraryType: { G2: 'G2', L7: 'L7', L7_PLOT: 'L7_PLOT' } }
      if (spec.endsWith('/G2TooltipCarousel')) return { default: carousel, __esModule: true }
      if (spec.endsWith('/dvMain')) return { dvMainStoreWithOut: () => store }
      if (spec.endsWith('/app')) return { useAppStoreWithOut: () => ({}) }
      if (spec.endsWith('/useI18n')) return { useI18n: () => ({ t: value => value }) }
      if (spec.endsWith('/useEmitt'))
        return {
          useEmitt: () => ({ emitter: { emit: (...args) => effects.push(['emit', ...args]) } })
        }
      if (spec.endsWith('/utils/utils'))
        return { deepCopy: lodash.cloneDeep, isMobile: () => false, isISOMobile: () => false }
      if (spec.endsWith('/canvasUtils'))
        return { isDashboard: () => true, isTabCanvas: () => false, trackBarStyleCheck: noop }
      if (spec.endsWith('/canvasStyle')) return { recursionTransObj: noop }
      if (spec.endsWith('/js/util'))
        return { parseJson: value => (typeof value === 'string' ? JSON.parse(value) : value) }
      if (spec.endsWith('/js/formatter')) return { valueFormatter: value => value }
      if (spec === '@antv/s2') return { S2Event: { LAYOUT_AFTER_RENDER: 'layout' } }
      if (spec.endsWith('/api/chart'))
        return {
          getData: async input => {
            effects.push(['query', input])
            return input
          }
        }
      if (spec.endsWith('.vue')) return { default: { render: () => null }, __esModule: true }
      if (spec === './chart-refresh-mock') return { createChartRefreshMock: () => undefined }
      if (Object.keys(helper).some(key => contents.includes(key))) return helper
      return {}
    }
    vm.runInNewContext(`(function(require,module,exports){${code}\n})`, {
      console: { ...console, error: (...args) => trace.push(['error', ...args]) },
      setTimeout: (fn, ms) => setTimeout(fn, ms >= 10000 ? 700 : ms === 300 ? 0 : ms),
      clearTimeout,
      document: { getElementById: id => nodes.get(id) },
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
  const view = lodash.defaultsDeep(
    {
      id: 'target',
      type: kind === 's2' ? 'table-info' : kind === 'indicator' ? 'indicator' : 'bar',
      render: kind === 'indicator' ? 'custom' : 'antv',
      tableId: 'dataset',
      yAxis: [{ id: 'value', name: 'amount' }],
      drillFields: [],
      chartExtRequest: {},
      data:
        kind === 'indicator'
          ? { series: [{ data: [6761] }] }
          : { data: [{ amount: 6761 }], fields: [], tableRow: [] }
    },
    lodash.cloneDeep(base)
  )
  const element = { id: 'element', actionSelection: {} }
  const binding = { current: Vue.shallowRef({ phase: 'candidate', view, element }) }
  const host = new Node()
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
    view,
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
      proxy.prepareFilterPaste
        ? proxy.prepareFilterPaste(
            { kind: 'queried', request: view, response: view },
            binding,
            () => current
          )
        : proxy.renderChart(view),
    unmount: () => {
      if (mounted) {
        mounted = false
        app.unmount()
      }
    }
  }
}

async function check(id, kind, fault, fn) {
  let state
  try {
    state = await load(kind, fault)
    await fn(state)
    pass++
    records.push({ id, verdict: 'PASS', trace: state.trace })
    console.log('PASS', id)
  } catch (error) {
    if (error instanceof assert.AssertionError) {
      fail++
      records.push({ id, verdict: 'SEMANTIC_FAIL', message: error.message, trace: state?.trace })
      console.log('SEMANTIC_FAIL', id, error.message)
    } else {
      execution++
      console.log('EXECUTION_ERROR', id, error.stack)
    }
  } finally {
    state?.unmount()
  }
}
for (const fault of ['draw', 'render', 'afterRender'])
  await check(`MVP-UI-10-G2-${fault.toUpperCase()}`, 'g2', fault, async s => {
    const result = await s.prepare()
    assert.equal(result?.ok, false, '真实G2失败必须显式返回失败')
    assert.ok(s.trace.includes(fault))
    assert.equal(s.effects.length, 0)
  })
await check('MVP-UI-10-S2-RENDER', 's2', 'render', async s => {
  const result = await s.prepare()
  assert.equal(result?.ok, false, '真实S2 render拒绝不得成为ready')
  assert.ok(s.trace.includes('render'))
  assert.equal(s.effects.length, 0)
})
await check('MVP-UI-10-S2-LAYOUT', 's2', 'layout', async s => {
  const result = await s.prepare()
  assert.equal(result?.ok, false, 'fulfilled但无layout不得ready')
  assert.ok(s.trace.includes('render'))
  assert.equal(s.effects.length, 0)
})
if (!baseline) {
  for (const kind of Object.keys(files))
    await check(`MVP-UI-11-${kind.toUpperCase()}-READY`, kind, null, async s => {
      const result = await s.prepare()
      assert.equal(result.ok, true, `${s.error()?.stack || ''}; DOM=${s.host.textContent}`)
      assert.equal(result.handle.key, 'candidate-1')
      assert.equal(result.handle.binding, s.binding)
      assert.equal(s.effects.length, 0)
      if (kind === 'indicator')
        assert.equal(s.host.querySelector('.indicator-value').textContent, '6761')
      else assert.equal(result.handle.instance, s.instance)
      const oldNode = s.host.children[0]
      assert.notEqual(s.proxy, result.handle.instance)
      const canonical = lodash.cloneDeep(s.view)
      canonical.yAxis[0].name = 'new-name'
      s.binding.current.value = {
        phase: 'active',
        view: canonical,
        element: { id: 'canonical', actionSelection: {} }
      }
      await Vue.nextTick()
      assert.equal(result.handle.binding.current.value.view, canonical)
      assert.equal(s.host.children[0], oldNode, 'promotion保留真实Vue同node')
      if (kind === 'indicator')
        assert.equal(s.host.querySelector('.indicator-name').textContent, 'new-name')
      else {
        await s.proxy.renderChart(canonical)
        assert.equal(s.drawOptions().chart.yAxis[0].name, 'new-name', '后续render消费canonical配置')
      }
      result.handle.dispose()
      result.handle.dispose()
    })
  for (const order of ['layout-late', 'render-late'])
    await check(`MVP-UI-10-S2-${order}`, 's2', order, async s => {
      const result = await s.prepare()
      assert.equal(result.ok, true)
      assert.deepEqual(s.trace.slice(0, 2), ['draw', 'render'])
      assert.equal(s.effects.length, 0)
      result.handle.dispose()
    })
  for (const fault of ['draw', 'render', 'afterRender', null])
    await check(`MVP-UI-10-G2-LINE-${fault || 'READY'}`, 'g2', fault, async s => {
      s.view.type = 'line'
      const result = await s.prepare()
      assert.equal(result.ok, !fault)
      assert.ok(s.trace.includes(fault || 'afterRender'))
      assert.equal(s.effects.length, 0)
      if (result.ok) result.handle.dispose()
    })
  for (const kind of ['g2', 's2'])
    for (const drill of [true, false])
      await check(`MVP-UI-11-METADATA-${kind}-${drill}`, kind, null, async s => {
        s.view.drill = drill
        s.view.drillFilters = drill ? [{ fieldId: 'drill-field' }] : []
        if (kind === 's2') {
          s.view.customAttr.basicStyle.tablePageStyle = 'general'
          s.view.chartExtRequest.pageSize = 40
        }
        const result = await s.prepare()
        assert.equal(result.ok, true)
        const metadata = result.handle.metadata
        assert.equal(metadata.kind, kind)
        assert.equal(metadata.drillFilters.length, drill ? 1 : 0)
        assert.equal(kind === 'g2' ? metadata.publishOrigin : metadata.publishPure, !drill)
        if (kind === 's2') assert.equal(metadata.pageInfo.pageSize, 40)
        assert.equal(s.effects.length, 0)
        result.handle.dispose()
      })
  await check('MVP-UI-10-S2-UNMOUNT-WAIT', 's2', 'layout', async s => {
    const waiting = s.prepare()
    while (!s.trace.includes('render')) await sleep(5)
    s.unmount()
    assert.equal((await waiting).ok, false)
    assert.equal(s.effects.length, 0)
  })
  await check('MVP-UI-10-G2-LATE-DRAW', 'g2', 'draw-late', async s => {
    const waiting = s.prepare()
    while (!s.trace.includes('draw')) await sleep(5)
    s.invalidate()
    s.releaseDraw()
    assert.equal((await waiting).ok, false)
    assert.ok(s.trace.includes('destroy'))
    assert.ok(!s.trace.includes('render'))
    assert.equal(s.effects.length, 0)
  })
  await check('MVP-UI-10-INDICATOR-ERROR', 'indicator', 'vue', async s => {
    assert.equal((await s.prepare()).ok, false)
    assert.ok(s.error())
    assert.equal(s.effects.length, 0)
  })
  for (const kind of Object.keys(files))
    await check(`MVP-UI-08-DTO-${kind}-EMPTY`, kind, null, async s => {
      s.view.data = kind === 'indicator' ? { series: [] } : null
      const result = await s.prepare()
      assert.equal(result.ok, true)
      assert.equal(s.effects.length, 0)
      if (kind === 'indicator')
        assert.equal(s.host.querySelector('.indicator-value').textContent, '-')
      if (kind === 'g2')
        assert.equal(
          s.trace.filter(item => item === 'draw').length,
          0,
          '合法空DTO必须进入原空态，无库实例'
        )
      if (kind === 's2') assert.equal(s.drawOptions().chart.data.data.length, 0)
      result.handle.dispose()
    })
}
if (!baseline && !before) {
  const artifacts = path.resolve(root, '../../Dashboard/Artifacts')
  const owner = (await fs.readdir(artifacts)).find(name => name.startsWith('DT_DM-478391'))
  const primaryCases = JSON.parse(
    await fs.readFile(
      path.join(artifacts, owner, 'S02-F01/MVP-20261027/THeatmapPrimaryDataCases-r001.json'),
      'utf8'
    )
  )
  for (const test of primaryCases.cases)
    await check(test.id, 'g2', null, async s => {
      s.view.type = test.type
      s.view.data = lodash.cloneDeep(test.response_data)
      const result = await s.prepare()
      assert.equal(result.ok, test.expect_ready, 'PRIMARY_ROWS_READY:' + test.id)
      assert.equal(
        s.trace.includes('draw'),
        test.expect_draw_attempt,
        'PRIMARY_ROWS_DRAW:' + test.id
      )
      assert.equal(s.effects.length, 0)
      if (result.ok) result.handle.dispose()
    })
}
for (const [kind, name] of Object.entries(files))
  console.log(
    'SOURCE',
    kind,
    hash(snapshots.get(path.join(root, name)) ?? (await fs.readFile(path.join(root, name))))
  )
await sleep(20)
console.log(
  JSON.stringify({ pass, semantic_failures: fail, execution_errors: execution, unhandled, records })
)
process.exitCode = fail || execution ? 1 : 0
