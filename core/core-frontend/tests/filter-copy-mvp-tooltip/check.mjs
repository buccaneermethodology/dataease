import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import vm from 'node:vm'
import { fileURLToPath } from 'node:url'
import { createHash } from 'node:crypto'
import ts from 'typescript'
import { parse, compileScript } from '@vue/compiler-sfc'
import * as lodash from 'lodash-es'

const root = fileURLToPath(new URL('../../', import.meta.url))
const owner = fs
  .readdirSync(path.resolve(root, '../../Dashboard/Artifacts'))
  .find(n => n.startsWith('DT_DM-478391'))
const artifact = path.resolve(root, '../../Dashboard/Artifacts', owner, 'S02-F01/MVP-20261027')
const before = process.argv.includes('--before')
const typesOnly = process.argv.includes('--types')
const snapshots = new Map()
if (before || typesOnly)
  for (const entry of JSON.parse(
    fs.readFileSync(path.join(artifact, 'c1-tooltip-before-r001/manifest.json'))
  )) {
    const bytes = fs.readFileSync(path.resolve(root, '../..', entry.snapshot))
    assert.equal(createHash('sha256').update(bytes).digest('hex'), entry.sha256)
    snapshots.set(path.resolve(root, '../..', entry.source), bytes.toString())
  }
const sources = {
  bar: 'src/views/chart/components/js/panel/charts/g2/bar/barUtil.ts',
  common: 'src/views/chart/components/js/panel/common/common_antv.ts',
  carousel: 'src/views/chart/components/js/G2TooltipCarousel.ts',
  copy: 'src/utils/utils.ts',
  guard: 'src/views/chart/components/js/panel/common/filter-paste-interaction.ts'
}
const sfc = 'src/views/chart/components/views/components/ChartComponentG2Plot.vue'
if (typesOnly) {
  const config = ts.readConfigFile(path.join(root, 'tsconfig.json'), ts.sys.readFile)
  const parsed = ts.parseJsonConfigFileContent(config.config, ts.sys, root)
  const targets = [sources.bar, sources.common, sources.carousel, sfc]
  const checkTypes = useBefore => {
    const virtual = new Map()
    for (const name of targets) {
      const filename = path.join(root, name)
      const source = useBefore ? snapshots.get(filename) : fs.readFileSync(filename, 'utf8')
      virtual.set(
        name === sfc ? filename + '.scope.ts' : filename,
        name === sfc
          ? compileScript(parse(source).descriptor, { id: 'scope-check' }).content
          : source
      )
    }
    if (!useBefore) {
      const filename = path.join(root, sources.guard)
      virtual.set(filename, fs.readFileSync(filename, 'utf8'))
    }
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
        file: path.relative(root, d.file.fileName),
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
    JSON.stringify(
      {
        scope: '四既有生产文件+新helper语义诊断multiset对照，非全项目类型通过',
        before: old.length,
        current: current.length,
        added
      },
      null,
      2
    )
  )
  process.exit(added.length ? 1 : 0)
}
const noop = () => undefined

function environment() {
  const events = [],
    timers = new Map()
  let serial = 0
  class Node {
    constructor(tag = 'div') {
      this.tagName = tag
      this.children = []
      this.parentElement = null
      this.dataset = {}
      this.attrs = {}
      this.style = {
        setProperty: (key, value) => {
          this.style[key] = value
        },
        removeProperty: key => {
          delete this.style[key]
        }
      }
      this.listeners = new Map()
      this.textContent = ''
    }
    get id() {
      return this.attrs.id || ''
    }
    set id(value) {
      this.attrs.id = value
    }
    get className() {
      return this.attrs.class || ''
    }
    set className(value) {
      this.attrs.class = value
    }
    get classList() {
      return {
        contains: value => this.className.split(' ').includes(value),
        add: value => {
          this.className += ' ' + value
        }
      }
    }
    get isConnected() {
      return this === body || !!this.parentElement?.isConnected
    }
    get clientWidth() {
      return 640
    }
    get clientHeight() {
      return 360
    }
    get offsetWidth() {
      return 120
    }
    get offsetHeight() {
      return 30
    }
    get scrollWidth() {
      return 100
    }
    appendChild(node) {
      node.remove()
      this.children.push(node)
      node.parentElement = this
      return node
    }
    remove() {
      if (this.parentElement)
        this.parentElement.children = this.parentElement.children.filter(n => n !== this)
      this.parentElement = null
    }
    contains(node) {
      return this === node || this.children.some(n => n.contains(node))
    }
    querySelectorAll(selector) {
      return this.children
        .flatMap(n => [
          selector
            .split(',')
            .some(s =>
              s.trim().startsWith('.')
                ? n.classList.contains(s.trim().slice(1))
                : n.tagName === s.trim()
            )
            ? n
            : null,
          ...n.querySelectorAll(selector)
        ])
        .filter(Boolean)
    }
    querySelector(selector) {
      return this.querySelectorAll(selector)[0] || null
    }
    getElementsByClassName(name) {
      return this.querySelectorAll('.' + name)
    }
    setAttribute(key, value) {
      this.attrs[key] = value
    }
    removeAttribute(key) {
      delete this.attrs[key]
      if (key.startsWith('data-'))
        delete this.dataset[key.slice(5).replace(/-([a-z])/g, (_, c) => c.toUpperCase())]
    }
    addEventListener(key, fn) {
      const list = this.listeners.get(key) || []
      list.push(fn)
      this.listeners.set(key, list)
    }
    removeEventListener(key, fn) {
      this.listeners.set(
        key,
        (this.listeners.get(key) || []).filter(x => x !== fn)
      )
    }
    dispatchEvent(event) {
      for (const fn of this.listeners.get(event.type) || []) fn(event)
    }
    getBoundingClientRect() {
      return { x: 0, y: 0, left: 0, top: 0, right: 640, bottom: 360, width: 120, height: 30 }
    }
  }
  const body = new Node('body')
  const document = {
    body,
    documentElement: { clientWidth: 1000, clientHeight: 700 },
    hidden: false,
    createElement: tag => new Node(tag),
    getElementById: id => {
      const find = n => (n.id === id ? n : n.children.map(find).find(Boolean))
      return find(body)
    },
    querySelectorAll: selector => body.querySelectorAll(selector),
    addEventListener: (key, fn) => events.push(['add', key, fn]),
    removeEventListener: (key, fn) => events.push(['remove', key, fn])
  }
  const setTimeout = fn => {
    const id = ++serial
    timers.set(id, fn)
    return id
  }
  const clearTimeout = id => timers.delete(id)
  const window = {
    navigator: { userAgent: 'Synthetic' },
    innerWidth: 1000,
    innerHeight: 700,
    getComputedStyle: () => ({ transform: 'none' }),
    setTimeout,
    clearTimeout,
    requestAnimationFrame: setTimeout,
    cancelAnimationFrame: clearTimeout
  }
  class Chart {
    constructor() {
      this.events = new Map()
      this.log = []
      this.children = []
    }
    on(key, fn) {
      const a = this.events.get(key) || []
      a.push(fn)
      this.events.set(key, a)
    }
    emit(key, payload) {
      this.log.push(key)
      for (const fn of this.events.get(key) || []) fn(payload)
    }
    options() {
      return { axis: { y: { dataeaseAxisTitleSafeMargin: true } } }
    }
  }
  const modules = new Map()
  const declared = new Set(Object.values(sources).map(n => path.join(root, n)))
  function load(filename) {
    if (modules.has(filename)) return modules.get(filename).exports
    const source = snapshots.get(filename) ?? fs.readFileSync(filename, 'utf8')
    const code = ts.transpileModule(source, {
      compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 }
    }).outputText
    const module = { exports: {} }
    modules.set(filename, module)
    const require = spec => {
      const resolved = spec.startsWith('@/')
        ? path.join(root, 'src', spec.slice(2))
        : spec.startsWith('.')
        ? path.resolve(path.dirname(filename), spec)
        : null
      const actual = resolved && (path.extname(resolved) ? resolved : resolved + '.ts')
      if (actual && declared.has(actual) && fs.existsSync(actual)) return load(actual)
      if (spec === 'lodash-es') return lodash
      if (spec === 'lodash-es/isEmpty') return { default: lodash.isEmpty, __esModule: true }
      if (spec.endsWith('/useI18n')) return { useI18n: () => ({ t: value => value }) }
      if (spec.endsWith('/useCache')) return { useCache: () => ({ wsCache: { get: noop } }) }
      if (spec.endsWith('/useEmitt')) return { useEmitt: () => ({ emitter: { emit: noop } }) }
      if (spec.endsWith('/js/util') || spec === '../../util')
        return { parseJson: value => (typeof value === 'string' ? JSON.parse(value) : value) }
      if (spec === '@antv/g2')
        return {
          Chart,
          register: noop,
          ChartEvent: { POINTER_MOVE: 'pointermove', POINTER_OUT: 'pointerout' }
        }
      if (spec === '@antv/l7') return { Zoom: class {} }
      if (spec === '@antv/g') return { Text: class {} }
      if (spec.endsWith('/modules/link')) return { useLinkStoreWithOut: () => ({}) }
      if (spec.endsWith('/g2-data-refresh')) return { isInstanceDataRefreshEnabled: () => false }
      if (spec.endsWith('/tooltip-carousel-scroll')) return { scheduleTooltipCarousel: () => noop }
      return {}
    }
    vm.runInNewContext(`(function(require,module,exports){${code}\n})`, {
      document,
      window,
      navigator: window.navigator,
      setTimeout,
      clearTimeout,
      requestAnimationFrame: setTimeout,
      cancelAnimationFrame: clearTimeout,
      console,
      CustomEvent: class {
        constructor(type) {
          this.type = type
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
      ResizeObserver: class {
        observe() {
          return undefined
        }
        disconnect() {
          return undefined
        }
      }
    })(require, module, module.exports)
    return module.exports
  }
  const bar = load(path.join(root, sources.bar)),
    common = load(path.join(root, sources.common)),
    Carousel = load(path.join(root, sources.carousel)).default,
    copy = load(path.join(root, sources.copy)).deepCopy
  let phase = 'candidate',
    alive = true
  const create = (id, guarded = true) => {
    const node = new Node()
    node.id = id
    body.appendChild(node)
    const chart = {
      id,
      container: id,
      type: 'bar',
      customAttr: { tooltip: { show: true, carousel: { enable: false } } },
      customStyle: { xAxis: { show: true, axisLabel: { show: true, lengthLimit: 3 } } }
    }
    if (guarded) chart.__deFilterPasteInteraction = () => alive && phase === 'active'
    return { chart: copy({ ...copy(chart) }), instance: new Chart(), node }
  }
  const tooltip = wrapper => {
    const node = new Node()
    node.className = 'g2-tooltip'
    node.style.visibility = 'hidden'
    wrapper.appendChild(node)
    return node
  }
  const event = {
    client: { x: 100, y: 100 },
    target: {
      attributes: {
        text: 'lon...',
        originValue: 'long original',
        dataeaseOriginalText: 'long title'
      },
      parsedStyle: { isOverflowing: true }
    }
  }
  const old = create('old', false)
  const oldWrapper = bar.createTooltipWrapper(old.chart)
  const oldTip = tooltip(oldWrapper)
  bar.listenerTooltipShow(old.instance, old.chart)
  old.instance.emit('tooltip:show', event)
  for (let i = 0; i < 3 && timers.size; i++) {
    const pending = [...timers.values()]
    timers.clear()
    pending.forEach(fn => fn())
  }
  const capture = () =>
    JSON.stringify({
      body: body.children.map(n => n.id),
      oldVisibility: oldTip.style.visibility,
      oldEvents: old.instance.log,
      documentEvents: events.map(([op, key]) => [op, key]),
      externalDom: body.children
        .filter(n => n.id !== 'candidate')
        .map(n => ({
          id: n.id,
          attrs: n.attrs,
          style: n.style,
          children: n.children.map(c => ({ attrs: c.attrs, dataset: c.dataset, style: c.style }))
        }))
    })
  return {
    bar,
    common,
    Carousel,
    copy,
    body,
    events,
    create,
    tooltip,
    event,
    capture,
    activate: () => {
      phase = 'active'
    },
    discard: () => {
      alive = false
    },
    flush: () => {
      for (let i = 0; i < 5 && timers.size; i++) {
        const pending = [...timers.values()]
        timers.clear()
        pending.forEach(fn => fn())
      }
    },
    Node
  }
}

let passed = 0,
  failed = 0,
  execution = 0
const records = []
const check = async (id, fn) => {
  try {
    await fn(environment())
    passed++
    records.push({ id, verdict: 'PASS' })
  } catch (error) {
    if (error instanceof assert.AssertionError) {
      failed++
      records.push({ id, verdict: 'SEMANTIC_FAIL', message: error.message })
    } else {
      execution++
      records.push({ id, verdict: 'EXECUTION_ERROR', message: error.stack })
    }
  }
}
await check('C1V001-CANDIDATE-MOUNT', e => {
  const c = e.create('candidate'),
    old = e.capture()
  const wrapper = e.bar.createTooltipWrapper(c.chart)
  assert.equal(e.capture(), old)
  assert.equal(wrapper.parentElement, c.node)
})
await check('C1V001-CANDIDATE-SHOW', e => {
  const c = e.create('candidate')
  const wrapper = e.bar.createTooltipWrapper(c.chart)
  const tip = e.tooltip(wrapper)
  e.bar.listenerTooltipShow(c.instance, c.chart)
  const old = e.capture()
  c.instance.emit('tooltip:show', e.event)
  assert.equal(e.capture(), old)
  assert.equal(tip.style.visibility, 'hidden')
})
await check('C1V001-AXIS-LABEL', e => {
  const c = e.create('candidate')
  e.common.configAxisLengthLimit(c.chart, c.instance)
  const old = e.capture()
  c.instance.emit('axis-label-item:pointermove', e.event)
  assert.equal(e.capture(), old)
})
await check('C1V001-AXIS-TITLE', e => {
  const c = e.create('candidate')
  e.common.configAxisTitleOverflowTooltip(c.chart, c.instance)
  const old = e.capture()
  c.instance.emit('axis-title:pointermove', e.event)
  assert.equal(e.capture(), old)
})
await check('C1V001-DISCARD-LATE', e => {
  const c = e.create('candidate')
  const wrapper = e.bar.createTooltipWrapper(c.chart)
  e.tooltip(wrapper)
  new e.Carousel(c.instance, c.chart, []).start()
  e.common.configAxisLengthLimit(c.chart, c.instance)
  e.discard()
  const old = e.capture()
  c.instance.emit('tooltip:show', e.event)
  c.instance.emit('axis-label-item:pointermove', e.event)
  c.instance.emit('axis-label-item:pointerout', e.event)
  e.flush()
  assert.equal(e.capture(), old)
})
await check('C1V001-CAROUSEL-ENABLED-CANDIDATE', e => {
  const c = e.create('candidate')
  c.chart.customAttr.tooltip.carousel = { enable: true, stayTime: 1, intervalTime: 1 }
  const old = e.capture()
  new e.Carousel(c.instance, c.chart, []).start()
  assert.equal(e.capture(), old)
})
await check('C1V001-LEGACY-HOVER-AXIS', e => {
  const c = e.create('legacy', false)
  const wrapper = e.bar.createTooltipWrapper(c.chart)
  const tip = e.tooltip(wrapper)
  e.bar.listenerTooltipShow(c.instance, c.chart)
  c.instance.emit('tooltip:show', e.event)
  assert.equal(wrapper.parentElement, e.body)
  assert.equal(tip.style.visibility, 'visible')
  e.common.configAxisLengthLimit(c.chart, c.instance)
  c.instance.emit('axis-label-item:pointermove', e.event)
  assert.ok(e.body.children.some(n => n.id === 'G2-TOOLTIP-WRAPPER'))
})
await check('C1V001-DISCARD-PENDING-AXIS-TIMER', e => {
  const c = e.create('candidate')
  e.common.configAxisLengthLimit(c.chart, c.instance)
  e.activate()
  c.instance.emit('axis-label-item:pointermove', e.event)
  c.instance.emit('axis-label-item:pointerout', e.event)
  e.discard()
  const old = e.capture()
  e.flush()
  assert.equal(e.capture(), old)
})
await check('C1V001-DISCARD-PENDING-HOVER-RAF', e => {
  const c = e.create('candidate')
  const wrapper = e.bar.createTooltipWrapper(c.chart)
  e.tooltip(wrapper)
  e.bar.listenerTooltipShow(c.instance, c.chart)
  e.activate()
  c.instance.emit('tooltip:show', e.event)
  e.discard()
  const old = e.capture()
  e.flush()
  assert.equal(e.capture(), old)
})
if (!before)
  await check('C1V001-ACTIVE-SAME-INSTANCE-HOVER', e => {
    const c = e.create('candidate')
    const wrapper = e.bar.createTooltipWrapper(c.chart)
    const tip = e.tooltip(wrapper)
    new e.Carousel(c.instance, c.chart, []).start()
    e.activate()
    c.instance.emit('tooltip:show', e.event)
    assert.equal(wrapper.parentElement, e.body)
    assert.equal(tip.style.visibility, 'visible')
    e.common.configAxisLengthLimit(c.chart, c.instance)
    c.instance.emit('axis-label-item:pointermove', e.event)
    assert.ok(e.body.children.some(n => n.id === 'G2-TOOLTIP-WRAPPER'))
  })
console.log(JSON.stringify({ passed, failed, execution, records }, null, 2))
process.exitCode = failed || execution ? 1 : 0
