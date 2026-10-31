import assert from 'node:assert/strict'
import { createHash } from 'node:crypto'
import { readFile, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import vm from 'node:vm'
import { transform } from 'esbuild'
import * as lodash from 'lodash-es'

// 此 runner 只装载完整生产模块；没有复制被测方法或改写生产源码。
const frontendRoot = fileURLToPath(new URL('../../', import.meta.url))
const repoRoot = path.resolve(frontendRoot, '../..')
const artifactRoot = path.join(repoRoot, 'Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01')
const arg = (key, fallback) => {
  const i = process.argv.indexOf(key)
  return i < 0 ? fallback : process.argv[i + 1]
}
const diagnostic = process.argv.includes('--diagnostic')
const mode = arg('--mode', diagnostic ? 'diagnostic' : 'green')
let casesPath = path.resolve(arg('--cases', path.join(artifactRoot, 'LineStageConstructionCases-r003.json')))
const manifestPath = arg('--manifest', null)
const hash = value => createHash('sha256').update(value).digest('hex')
const canonical = value => Array.isArray(value) ? `[${value.map(canonical).join(',')}]`
  : value && typeof value === 'object' ? `{${Object.keys(value).sort().map(k => `${JSON.stringify(k)}:${canonical(value[k])}`).join(',')}}`
    : JSON.stringify(value)
const sourceNames = {
  line: 'src/views/chart/components/js/panel/charts/g2/line/line.ts',
  carousel: 'src/views/chart/components/js/G2TooltipCarousel.ts',
  common: 'src/views/chart/components/js/panel/charts/g2/line/common.ts'
}
const executionError = message => Object.assign(new Error(message), { code: 'LSC_EXECUTION_ERROR' })
const plain = value => JSON.parse(JSON.stringify(value))
const summary = { mode, diagnostic_only: diagnostic, contract_valid: false, production_module_imported: false,
  cases_executed: 0, passed: 0, assertion_failures: 0, execution_errors: 0, first_fingerprint: null,
  formal_red_proven: false, independent_validation: false, contract_discrepancies: 0, fixture_errors: 0 }
const records = []
let formalManifest = null
const bundles = {}
const sourceRefs = {}

function environment(item) {
  const a = item.arrange
  const s = {
    item, now: 0, nextHandle: 1, currentOwner: 'C', subject: false, faultEnabled: false,
    trace: [], acquisition: [], warnings: [], consoleErrors: [], errors: new Map(), errorIds: new Map(),
    owners: new Map(), identities: new WeakMap(), ownerMeta: new Map(), charts: new Map(), targets: new Map(),
    hosts: new Map(), wrappers: new Map(), observers: new Map(), timers: new Map(), timerHistory: [],
    frames: new Map(), scrolls: new Map(), backgrounds: new Map(), callbacks: [], fixtureErrors: [],
    firstCleanupStates: new Map(), startupChecks: [], privateNotObserved: [], startEntered: new Set(),
    constructorReturned: new Set(), reentered: false, primaryReached: false, cacheSets: [], registrationAdapters: []
  }
  s.errorFor = id => {
    if (!s.errors.has(id)) {
      const error = id === a.primary_error_ref && a.primary_error_value !== undefined
        ? plain(a.primary_error_value) : new Error(`fixture:${id}`)
      s.errors.set(id, error); s.errorIds.set(error, id)
    }
    return s.errors.get(id)
  }
  if (a.primary_error_ref) s.errorFor(a.primary_error_ref)
  for (const f of a.cleanup_faults ?? []) s.errorFor(f.error_ref)
  s.id = object => object == null ? null : s.identities.get(object) ?? null
  s.register = (object, name) => { s.identities.set(object, name); return object }
  s.note = call => { (s.subject ? s.trace : s.acquisition).push(call) }
  s.rememberOwner = (owner, forced) => {
    if (!owner) return null
    const name = forced ?? s.id(owner) ?? s.chartOwner(owner.newChart) ?? s.currentOwner
    if (!s.id(owner)) s.register(owner, name)
    s.owners.set(name, owner)
    return name
  }
  s.chartOwner = chart => s.ownerMeta.size && [...s.ownerMeta].find(([, m]) => m.g === s.id(chart))?.[0]
  s.beginSubject = () => { s.subject = true; s.faultEnabled = true }
  s.failAt = stage => {
    if (s.faultEnabled && item.fault_stage === stage) {
      s.primaryReached = true
      if (!s.startupChecks.length) s.captureStartup(`fault-boundary:${stage}`, { partial: true })
      s.beginSubject(); throw s.errorFor(a.primary_error_ref)
    }
  }
  s.primitive = (call, effect = () => {}) => {
    s.note(call)
    const fault = s.faultEnabled && (a.cleanup_faults ?? []).find(f => f.call === call)
    if (fault?.mode === 'throw_before_effect') throw s.errorFor(fault.error_ref)
    const result = effect()
    if (a.reenter?.at === call && !s.reentered && s.subject) {
      s.reentered = true
      if (a.reenter.operation === 'C.destroy') s.owners.get('C').destroy()
      else s.constructNewAndStart()
    }
    if (fault) throw s.errorFor(fault.error_ref)
    return result
  }
  const captureValue = options => typeof options === 'boolean' ? options : Boolean(options?.capture)
  class NamedTarget {
    constructor(name) {
      this.name = name; this.listeners = []; this.parentElement = null; this.offsetParent = {}; this.style = {}
      this.classList = { contains: () => false }; s.targets.set(name, this); s.register(this, name)
    }
    addEventListener(event, handler, options) {
      const capture = captureValue(options)
      if (typeof handler !== 'function') throw executionError(`Invalid handler ${this.name}/${event}`)
      s.acquisition.push(`listener.add:${this.name}:${event}:${capture}`)
      if (!this.listeners.some(x => x.event === event && x.handler === handler && x.capture === capture)) {
        this.listeners.push({ event, handler, capture, owner: s.currentOwner })
      }
      const stages = { visibilitychange: 'carousel.add:visibilitychange', mouseenter: 'carousel.add:mouseenter',
        mouseleave: 'carousel.add:mouseleave', 'de-tooltip-hover-leave': 'carousel.add:tooltipHoverLeave',
        scroll: 'carousel.ensurePageScrollListener.add' }
      s.failAt(stages[event])
    }
    removeEventListener(event, handler, options) {
      const found = this.listeners.find(x => x.event === event && x.handler === handler && x.capture === captureValue(options))
      const suffix = event === 'de-tooltip-hover-leave' ? 'hoverLeave'
        : event === 'visibilitychange' && found?.owner !== 'C' ? `visibilitychange${(found?.owner ?? s.currentOwner).slice(1)}` : event
      s.primitive(`listener.remove:${this.name}:${suffix}`, () => {
        this.listeners = this.listeners.filter(x => !(x.event === event && x.handler === handler && x.capture === captureValue(options)))
      })
    }
    dispatch(event) {
      for (const x of [...this.listeners].filter(x => x.event === event.type)) x.handler({ target: this, ...event })
    }
    getBoundingClientRect() { return { top: 100, bottom: 200, left: 100, right: 200, height: 100, width: 100 } }
    closest() { return null }
    matches() { return false }
    querySelector() { return null }
  }
  const document = new NamedTarget('D')
  document.hidden = false
  document.getElementById = key => s.hosts.get(key) ?? null
  class NamedObserver {
    constructor(callback) {
      s.failAt('carousel.IntersectionObserver.constructor')
      const owner = s.currentOwner
      const name = s.ownerMeta.get(owner)?.o ?? `O${owner.slice(1)}`
      this.name = name; this.callback = callback; this.connected = false; this.targets = []
      s.observers.set(name, this); s.register(this, name); s.acquisition.push(`observer.new:${name}`)
    }
    observe(target) {
      this.targets.push(target); this.connected = true; s.acquisition.push(`observer.observe:${this.name}:${s.id(target)}`)
      if (item.fault_stage === 'carousel.publish.owner_conflict' && this.name === 'O' && !s.reentered && s.faultEnabled) {
        s.reentered = true; s.constructNewAndStart(); s.captureStartup('owner-conflict-before-guard', { partial: true }); s.beginSubject()
      }
      s.failAt('carousel.O.observe')
    }
    disconnect() { s.primitive(`observer.disconnect:${this.name}`, () => { this.connected = false; this.targets = [] }) }
  }
  function timerMetadata(delay, synthetic) {
    if (synthetic) return { symbol: synthetic, created_by_owner: s.currentOwner, callback_source: 'explicit owned-cleanup stress registration' }
    if (delay === 40) return { symbol: s.now === 0 && [26,42,43,44,45].includes(Number(item.id.slice(-3))) ? 'TQ0' : 'TQ', created_by_owner: s.currentOwner, callback_source: 'drainStartQueue cooldown' }
    if (delay === 160 && s.inScrollEvent) return { symbol: 'TS', created_by_owner: 'global', callback_source: 'handlePageScroll idle' }
    if (delay === 160) return { symbol: 'TN', created_by_owner: s.currentOwner, callback_source: 'waitForRenderedElements first-column-frame' }
    throw executionError(`Undeclared timer allocation delay=${delay}`)
  }
  s.allocateTimer = (callback, delay, synthetic) => {
    if (!synthetic && delay === 40) {
      // 这个具名clock seam只能由真实drainStartQueue在start之后到达。
      s.constructorReturned.add(s.currentOwner); s.startEntered.add(s.currentOwner)
      s.failAt('carousel.start.enqueueStart')
    }
    const handle = s.nextHandle++
    const entry = { ...timerMetadata(delay, synthetic), handle, delay_ms: delay, due_ms: s.now + delay, callback }
    s.timers.set(handle, entry); s.timerHistory.push({ action: 'allocated', ...entry, callback: undefined })
    return handle
  }
  const setTimeout = (callback, delay = 0) => s.allocateTimer(callback, delay)
  const clearTimeout = handle => {
    const entry = s.timers.get(handle)
    if (!entry) throw executionError(`Clear unregistered timer ${handle}`)
    s.primitive(`timer.clear:${entry.symbol}`, () => { s.timers.delete(handle); s.timerHistory.push({ action: 'cleared', handle, symbol: entry.symbol, at_ms: s.now }) })
  }
  const requestAnimationFrame = callback => {
    const handle = s.nextHandle++; const entry = { handle, symbol: `F${s.frames.size + 1}`, owner: s.currentOwner, callback }
    s.frames.set(handle, entry); return handle
  }
  const cancelAnimationFrame = handle => {
    const entry = s.frames.get(handle)
    if (!entry) throw executionError(`Cancel unregistered frame ${handle}`)
    s.primitive(`frame.cancel:${entry.symbol}`, () => s.frames.delete(handle))
  }
  s.tick = now => {
    while (true) {
      const due = [...s.timers.values()].filter(x => x.due_ms <= now).sort((x,y) => x.due_ms-y.due_ms || x.handle-y.handle)[0]
      if (!due) break
      s.now = due.due_ms; s.timers.delete(due.handle); s.currentOwner = due.created_by_owner
      s.timerHistory.push({ action: 'fired', symbol: due.symbol, handle: due.handle, at_ms: s.now })
      due.callback()
    }
    s.now = now
  }
  const datum = a.data[0] ?? { field: 'x', value: 1, category: 's' }
  class NamedChart {
    constructor(options = {}) {
      s.failAt('G2Chart.constructor')
      const m = s.ownerMeta.get(s.currentOwner)
      this.name = m?.g ?? 'G'; this.owner = s.currentOwner; this.container = options.container ?? m?.key ?? 'H'
      this.handlers = new Map(); this.destroyCount = 0; this.visual = []; this._options = { encode: { x: 'field' } }
      this.children = [{ value: { encode: { x: 'field' } } }]
      const markType = ['bar','chart-mix'].includes(a.chart_type) ? 'interval' : a.chart_type === 'pie' ? 'interval' : 'point'
      this.elements = [{ markType, __data__: { data: datum }, style: {}, tagName: 'rect', getRenderBounds: () => ({ min: [0,0], max: [10,10] }) }]
      this.context = { canvas: { document: { getElementsByClassName: name => name === 'element' ? this.elements : [] }, render() {} }, views: [] }
      s.charts.set(this.name, this); s.register(this, this.name); s.acquisition.push(`chart.new:${this.name}`)
    }
    on(event, handler) {
      if (!this.handlers.has(event)) this.handlers.set(event, [])
      this.handlers.get(event).push(handler); s.acquisition.push(`chart.on:${this.name}:${event}`)
      if (this.name === 'G') { s.failAt(`G.on:${event}`); s.failAt(`line.G.on:${event}`) }
      return this
    }
    options(value) {
      if (value === undefined) return this._options
      this._options = value; if (this.name === 'G') s.failAt('line.G.options'); return this
    }
    encode() { if (this.name === 'G') s.failAt('carousel.setCarouselData'); return { x: 'field' } }
    getContainer() { if (this.name === 'G') s.failAt('carousel.getChartElement'); return s.ownerMeta.get(this.owner)?.hostObject ?? null }
    getContext() { return this.context }
    emit(event, ...args) {
      s.primitive(`chart.emit:${this.name}:${event}`, () => { this.visual.push(event); for (const h of this.handlers.get(event) ?? []) h(...args) })
      if (this.name === 'G_other' && event === 'tooltip:hide') s.failAt('carousel.checkStopOnViewChange')
      return this
    }
    setState(name) { s.primitive(`chart.setState:${this.name}:${name}`); return this }
    destroy() {
      this.destroyCount++
      s.primitive(`chart.destroy:${this.name}`, () => { this.destroyedEffect = true; this.handlers.clear() })
    }
  }
  s.makeMetadata = (owner, key = 'H', names = {}) => {
    const suffix = owner === 'C' ? '' : owner.slice(1)
    const meta = { owner, key, g: names.g ?? `G${suffix}`, h: names.h ?? `H${suffix}`,
      w: names.w ?? (owner === 'C' ? a.tooltip_wrapper : `W${suffix}`), o: names.o ?? `O${suffix}` }
    meta.hostObject = a.host === null && owner === 'C' ? null : new NamedTarget(meta.h)
    meta.wrapperObject = new NamedTarget(meta.w)
    s.hosts.set(key, meta.hostObject); s.wrappers.set(key, meta.wrapperObject); s.ownerMeta.set(owner, meta)
    return meta
  }
  s.makeChartInput = (owner, type = a.chart_type) => {
    const m = s.ownerMeta.get(owner)
    return { id: m.key, container: m.key, type, customAttr: { tooltip: { show: a.tooltip_show, carousel: { enable: a.carousel_enable, stayTime: 1, intervalTime: 1 } } }, data: { data: plain(a.data) } }
  }
  class NamedG2ChartView {
    constructor(name) { this.name = name; this.axisConfig = {} }
    configureDataRefresh() { s.failAt('line.configureDataRefresh') }
  }
  const unexpected = name => () => { throw executionError(`Undeclared use of named dependency ${name}`) }
  const util = Object.fromEntries([
    'flow','getLineConditions','getLineLabelColorByCondition','handleBreakLineMultiDimension','handleIgnoreData',
    'handleSetZeroMultiDimension','handleSetZeroSingleDimension','hexColorToRGBA','randomString','setUpGroupSeriesColor','getColorFormAlphaColor'
  ].map(name => [name, unexpected(`util.${name}`)]))
  util.parseJson = value => { s.failAt('carousel.parseJson'); return typeof value === 'string' ? JSON.parse(value) : value }
  const barUtil = {
    TOOLTIP_HOVER_LEAVE_EVENT: 'de-tooltip-hover-leave',
    listenerTooltipShow: (g) => {
      if (item.id === 'LSC-052' && s.id(g) === 'G') s.captureStartup('before-real-predecessor-destroy', { partial: true })
      g.on('tooltip:show', () => {}); if (s.id(g) === 'G') s.failAt('carousel.listenerTooltipShow')
    },
    getTooltipWrapper: key => s.wrappers.get(key) ?? null,
    getTooltipDisplayMode: () => 'carousel', getThemeContrastColor: () => '#000',
    switchTooltipWrapperHost: (chart, target) => {
      if (target === 'hover') s.primitive(`wrapper.switchHover:${chart.container}`)
      else s.acquisition.push(`wrapper.switch:${chart.container}:${target}`)
    },
    createTooltipWrapper: unexpected('bar.createTooltipWrapper'), getFieldDisplayName: unexpected('bar.getFieldDisplayName'),
    tooltipCss: '', tooltipMaxHeight: unexpected('bar.tooltipMaxHeight')
  }
  const refresh = { isInstanceDataRefreshEnabled: () => false,
    registerChartRefreshAdapter: (...args) => s.registrationAdapters.push(args[0]), tagRefreshComponentMarks: unexpected('refresh.tagRefreshComponentMarks') }
  const commonAntv = {
    ASSIST_LINE_STYLE: {}, TOOLTIP_ITEM_TPL: '', TOOLTIP_TITLE_TPL: '', configDimensionSlider: unexpected('common.configDimensionSlider'),
    getTooltipCrosshairsStyle: unexpected('common.getTooltipCrosshairsStyle'), getG2Renderer: () => ({ renderer: 'named-renderer' }),
    handleChartDashboardHidden: () => s.failAt('line.handleChartDashboardHidden')
  }
  const extremum = {
    addExtremumText: unexpected('extremum.addExtremumText'), getBarExtremumTransform: unexpected('extremum.getBarExtremumTransform'),
    extremumEvt: g => {
      s.captureCompletedLineStartup()
      if (item.fault_stage === 'line.extremumEvt.after_on_afterrender') g.on('afterrender', () => {})
      if (item.fault_stage?.startsWith('line.extremumEvt')) {
        s.captureStartup('before-late-line-failure'); s.trace.length = 0; s.beginSubject()
        s.failAt(item.fault_stage)
      }
    }
  }
  const schedule = { scheduleTooltipCarousel: () => {
    if (item.id !== 'LSC-026') return undefined
    const cancel = () => s.primitive('scroll.cancel:S', () => s.scrolls.delete('S'))
    s.register(cancel, 'S'); s.scrolls.set('S', cancel); s.acquisition.push('scroll.acquire:S'); return cancel
  } }
  const context = vm.createContext({ Error, TypeError, RangeError, Map, Set, WeakMap, WeakSet, Promise,
    Element: NamedTarget, HTMLElement: NamedTarget, document, IntersectionObserver: NamedObserver,
    setTimeout, clearTimeout, requestAnimationFrame, cancelAnimationFrame,
    Date: class extends Date { static now() { return s.now } },
    console: { warn: (...args) => { s.warnings.push(args); if (a.logger_throws) throw s.errorFor('E_LOG') }, error: (...args) => s.consoleErrors.push(args), log() {} },
    window: { setTimeout, clearTimeout, requestAnimationFrame, cancelAnimationFrame, innerWidth: 1000, innerHeight: 1000 }
  })
  const moduleCache = new Map()
  const seams = {
    '../../../types/impl/g2': { G2ChartView: NamedG2ChartView },
    '../../../types/impl/g2-data-refresh': refresh, './panel/types/impl/g2-data-refresh': refresh,
    '@/views/chart/components/js/util': util, 'lodash-es': lodash,
    '@/views/chart/components/js/formatter': { valueFormatter: unexpected('formatter.valueFormatter') },
    '@/hooks/web/useI18n': { useI18n: () => ({ t: key => key }) }, '@antv/g2': { Chart: NamedChart },
    '@/views/chart/components/editor/util/chart': { DEFAULT_YAXIS_STYLE: {} },
    '../../../common/common_antv': commonAntv, '@/views/chart/components/js/extremumUitl': extremum,
    '../bar/barUtil': barUtil, '@/views/chart/components/js/panel/charts/g2/bar/barUtil': barUtil,
    './tooltip-carousel-scroll': schedule
  }
  function load(name) {
    if (moduleCache.has(name)) return moduleCache.get(name).exports
    const module = { exports: {} }; moduleCache.set(name, module)
    const require = specifier => {
      if (specifier === './common') return load('common')
      if (specifier === '@/views/chart/components/js/G2TooltipCarousel') return load('carousel')
      if (!Object.hasOwn(seams, specifier)) throw executionError(`Unknown module ${name}: ${specifier}`)
      return seams[specifier]
    }
    for (const match of bundles[name].matchAll(/\bvar\s+([\w$]+)\s*=\s*(?:__toESM\()?require\("([^"]+)"\)/g)) {
      const dependency=require(match[2]); const variable=match[1]
      const access=new RegExp(`\\b${variable}\\.([a-zA-Z_$][\\w$]*)`,'g')
      for(const used of bundles[name].matchAll(access)) if(!Object.hasOwn(dependency,used[1])) throw executionError(`Unknown export ${match[2]}:${used[1]}`)
    }
    const wrapper = new vm.Script(`(function(require,module,exports){\n${bundles[name]}\n})`, { filename: sourceNames[name] })
    context.__lscFactory=wrapper.runInContext(context, { timeout: 3000 })
    context.__lscRequire=require; context.__lscModule=module
    try { new vm.Script('__lscFactory(__lscRequire,__lscModule,__lscModule.exports)').runInContext(context,{timeout:3000}) }
    finally { delete context.__lscFactory; delete context.__lscRequire; delete context.__lscModule }
    return module.exports
  }
  s.Carousel = load('carousel').default
  s.Line = load('line').Line
  s.load = load
  const C = s.Carousel
  // 精确 Map seam：只观察该 cache 的 set/delete；非万能 Proxy。
  const cache = C.instanceCache
  const set = cache.set
  const del = cache.delete
  cache.set = function(key, value) {
    const owner = s.rememberOwner(value)
    const result = set.call(this, key, value); s.cacheSets.push({ key, owner })
    if (owner === 'C') s.failAt('carousel.cache.set')
    return result
  }
  cache.delete = function(key) {
    const owner = this.get(key)
    return s.primitive(`cache.delete:${s.rememberOwner(owner) ?? 'none'}`, () => { const result = del.call(this, key); if (owner) s.firstCleanup(owner); return result })
  }
  const dequeue = C.dequeueStart
  C.dequeueStart = function(owner) {
    const name = s.rememberOwner(owner)
    if (s.subject && owner.isDestroyed) s.firstCleanup(owner)
    if (s.subject) s.note(`queue.remove:${name}`)
    return dequeue.call(this, owner)
  }
  for (const [method, label] of [['restoreColumnSelectionAttributes', 'chart.restoreColumnSelectionAttributes'], ['clearInteractionBackgrounds', 'chart.clearInteractionBackgrounds']]) {
    const original = C.prototype[method]
    C.prototype[method] = function(...args) {
      s.note(`${label}:${s.id(this.newChart)}`)
      return original.apply(this, args)
    }
  }
  s.timerSnapshot = () => [...s.timers.values()].map(({ callback, ...x }) => x).sort((x,y) => x.handle-y.handle)
  s.frameSnapshot = () => [...s.frames.values()].map(({ callback, ...x }) => x)
  s.ownerSnapshot = (owner, includeReturned = true) => {
    const instance = s.owners.get(owner)
    if (!instance) return null
    const m = s.ownerMeta.get(owner)
    const observedO = [...s.observers.values()].find(x => x.name === m.o)
    return {
      owner, constructed: true, start_entered: s.startEntered.has(owner), paused: instance.isPaused,
      destroyed: instance.isDestroyed, cache_key: m.key, cache_identity: s.id(C.instanceCache.get(m.key)) === owner ? owner : null,
      chart_handle: s.id(instance.newChart), dom_host: m.h, tooltip_wrapper_target: m.w,
      observer_handle: s.id(instance.intersectionObserver) ?? (observedO ? observedO.name : null),
      observer_connected: observedO?.connected ?? false, chartIsVisible: instance.chartIsVisible === undefined ? 'undefined' : instance.chartIsVisible,
      isExecuting: instance.isExecuting === undefined ? 'undefined' : instance.isExecuting,
      timers: Object.fromEntries(['interval','nextItem','hoverLeave'].map(k => [k, s.timers.get(instance.timers?.[k])?.symbol ?? null])),
      column_frame_ids: Array.from(instance.columnSelectionFrameIds ?? [], x => s.frames.get(x)?.symbol ?? x),
      cancel_scroll_ref: s.id(instance.cancelTooltipScroll), retained_background_ref: s.id(instance.carouselBackground),
      isFirstColumnFrameReady: instance.isFirstColumnFrameReady,
      ...(includeReturned ? { constructor_returned: s.constructorReturned.has(owner) } : {})
    }
  }
  s.globalSnapshot = () => ({
    startQueue_order: Array.from(C.startQueue, x => s.id(x)), startQueueTimer: s.timers.get(C.startQueueTimer)?.symbol ?? null,
    scrollEndTimer: s.timers.get(C.scrollEndTimer)?.symbol ?? null, pageScrolling: C.pageScrolling,
    resizeQueueRunning: C.resizeQueueRunning, resizeQueueTimer: C.resizeQueueTimer, resizeQueue_entries: [...C.resizeQueue.keys()],
    pageScrollListenerReady: C.pageScrollListenerReady
  })
  s.firstCleanup = instance => {
    const owner = s.rememberOwner(instance)
    if (!s.subject || s.firstCleanupStates.has(owner)) return
    // 账本名称由实现选择；通过实际资源引用检查，不填造初始状态。
    const ledgers = Object.entries(instance).filter(([k,v]) => Array.isArray(v) && /listener/i.test(k))
    s.firstCleanupStates.set(owner, {
      isDestroyed: instance.isDestroyed, pendingDataUpdateAction: instance.pendingDataUpdateAction ?? null,
      own_listener_ledger: ledgers.flatMap(([,v]) => v).map(x => s.id(x.target) ?? 'entry'),
      own_frame_ids: [...(instance.columnSelectionFrameIds ?? [])],
      own_timer_handles: instance.timers ? Object.values(instance.timers).filter(x => x != null) : null,
      own_observer_ref: s.id(instance.intersectionObserver), own_cancel_ref: s.id(instance.cancelTooltipScroll),
      own_background_ref: s.id(instance.carouselBackground), cache_contains_this: C.instanceCache.get(instance.chart?.container) === instance
    })
  }
  s.captureStartup = (label, { partial = false } = {}) => {
    const plan = a.startup_plan
    const observation = { label, now_ms: s.now, owners: [], globals: s.globalSnapshot(), timers: s.timerSnapshot(), frames: s.frameSnapshot(), callbacks: [...s.callbacks] }
    for (const expected of plan.owners_before_subject) {
      const observed = s.ownerSnapshot(expected.owner)
      if (!observed && expected.constructor_returned === false) {
        const m = s.ownerMeta.get(expected.owner)
        const o = s.observers.get(m.o)
        const acquisition = { owner: expected.owner, observer_handle: o?.name ?? null, observer_connected: o?.connected ?? false,
          chart_handle: m.g, dom_host: m.h, tooltip_wrapper_target: m.w, constructor_returned: false }
        observation.owners.push({ ...acquisition, private_fields: 'not_observed_until_allowed_cleanup_spy' })
        s.privateNotObserved.push({ label, owner: expected.owner, fields: Object.keys(expected).filter(k => !Object.hasOwn(acquisition,k)) })
        for (const k of Object.keys(acquisition)) s.check(`startup.${expected.owner}.${k}`, () => assert.deepEqual(acquisition[k], expected[k]))
      } else {
        observation.owners.push(observed)
        s.check(`startup.${expected.owner}`, () => assert.deepEqual(observed, expected))
      }
    }
    for (const [key, value] of Object.entries(plan.globals_before_subject)) s.check(`startup.global.${key}`, () => assert.deepEqual(observation.globals[key], value))
    s.check('startup.clock', () => assert.equal(s.now, plan.observation_now_ms))
    s.check('startup.timer_registry', () => assert.deepEqual(observation.timers, plan.timer_registry_before_subject))
    s.check('startup.frame_registry', () => assert.deepEqual(observation.frames.map(x => x.symbol), plan.frame_registry_before_subject))
    s.check('startup.observer_callbacks', () => assert.deepEqual(observation.callbacks, plan.observer_callbacks_delivered))
    if (plan.timer_history_exact) {
      const projected=s.timerHistory.map(entry=>{
        if(entry.action==='allocated' && entry.symbol==='TQ0') return {action:entry.action,symbol:entry.symbol,handle:entry.handle,due_ms:entry.due_ms}
        return Object.fromEntries(Object.entries(entry).filter(([,value])=>value!==undefined))
      })
      s.check('startup.timer_history_exact',()=>assert.deepEqual(projected,plan.timer_history_exact))
    }
    s.startupChecks.push(observation)
  }
  s.assertions = []
  s.check = (channel, fn) => {
    try { fn() } catch (error) {
      if (error?.code !== 'ERR_ASSERTION') throw error
      s.assertions.push({ channel, message: error.message, actual: error.actual, expected: error.expected })
    }
  }
  s.construct = (owner, key = 'H', { start = false, names = {}, type = a.chart_type } = {}) => {
    s.currentOwner = owner; const m = s.makeMetadata(owner,key,names)
    const g = new NamedChart({ container: key }); const chart = s.makeChartInput(owner,type); m.input = chart
    const c = new C(g, chart, plain(a.data)); s.register(c,owner); s.owners.set(owner,c); s.constructorReturned.add(owner)
    if (start) s.start(owner)
    return c
  }
  s.start = owner => {
    s.currentOwner = owner; s.startEntered.add(owner); s.owners.get(owner).start()
  }
  s.constructNewAndStart = () => {
    const prior = s.currentOwner; s.construct('C_new','H',{ start: true }); s.currentOwner = prior
  }
  s.visibleAnd40 = owner => {
    const m = s.ownerMeta.get(owner); const o = s.observers.get(m.o)
    if (!o?.connected) throw executionError(`Missing connected observer ${m.o}`)
    s.currentOwner = owner; o.callback([{ isIntersecting: true, intersectionRatio: 1, target: m.hostObject }])
    s.callbacks.push(`${m.o}:visible@${s.now}ms after ${owner}.start`)
    s.check('visible.queued_behind_TQ0', () => assert.deepEqual(Array.from(C.startQueue, x => s.id(x)), [owner]))
    s.tick(40)
  }
  s.injectOwned = owner => {
    const inject = a.inject_owned_resources
    if (!inject) return
    const c = s.owners.get(owner); s.currentOwner = owner
    if (inject.cancelTooltipScroll) {
      if (c.cancelTooltipScroll) throw executionError('Synthetic cancel would overwrite live resource')
      const label = inject.cancelTooltipScroll
      const cancel = () => s.primitive(`scroll.cancel:${label}`, () => s.scrolls.delete(label))
      s.register(cancel,label); s.scrolls.set(label,cancel); c.cancelTooltipScroll = cancel
    }
    for (const [i,symbol] of (inject.timers ?? []).entries()) {
      const field = ['interval','nextItem','hoverLeave'][i]
      if (c.timers[field]) throw executionError(`Synthetic timer would overwrite ${field}`)
      c.timers[field] = s.allocateTimer(() => {},1000,symbol)
    }
    if (inject.columnSelectionFrameIds) {
      if (c.columnSelectionFrameIds.length) throw executionError('Synthetic frames would overwrite live frames')
      for (const symbol of inject.columnSelectionFrameIds) {
        const handle = requestAnimationFrame(() => {}); s.frames.get(handle).symbol = symbol; c.columnSelectionFrameIds.push(handle)
      }
    }
    if (inject.carouselBackground) {
      if (c.carouselBackground) throw executionError('Synthetic background would overwrite live background')
      const symbol = inject.carouselBackground
      const b = { remove() { s.primitive(`background.remove:${symbol}`, () => s.backgrounds.delete(symbol)) } }
      s.register(b,symbol); s.backgrounds.set(symbol,b); c.carouselBackground = b
    }
  }
  s.captureCompletedLineStartup = () => {
    const c = C.instanceCache.get('H')
    if (c && s.id(c) === 'C') { s.constructorReturned.add('C'); s.startEntered.add('C') }
    if (item.id === 'LSC-026') s.visibleAnd40('C')
    if (item.id === 'LSC-041') {
      s.inScrollEvent = true; document.dispatch({ type: 'scroll' }); s.inScrollEvent = false
    }
    s.injectOwned('C')
    if (item.scenario === 'line_success' || item.scenario === 'line_inert') s.captureStartup('line-complete-before-return')
  }
  s.runLine = async () => {
    s.currentOwner = 'C'
    const m = s.ownerMeta.get('C') ?? s.makeMetadata('C')
    const chart = s.makeChartInput('C'); m.input = chart
    const line = new s.Line()
    line.setupOptions = (_chart, options) => { s.failAt('line.setupOptions'); return options }
    s.faultEnabled = true
    return line.drawChart({ chart, action() {}, container: 'H', scale: 1 })
  }
  s.invoke = action => {
    context.__lscAction=action
    try { return new vm.Script('__lscAction()').runInContext(context,{timeout:3000}) }
    finally { delete context.__lscAction }
  }
  s.document = document
  return s
}

async function exercise(s) {
  const item = s.item
  const a = item.arrange
  const n = Number(item.id.slice(-3))
  if (n === 16) {
    s.construct('C_other','H2'); s.ownerMeta.get('C_other').input.dashboardHidden = true
    s.captureStartup('other-before-checkStop'); s.acquisition.length = 0
  }
  if (n === 52) { s.construct('C_old','H'); s.acquisition.length = 0 }
  const isLine = item.target.startsWith('Line')
  if (isLine) {
    if (n === 2) s.captureStartup('empty-before-draw')
    if (n === 52) s.beginSubject()
    const returned = await s.runLine()
    return returned
  }
  if (n === 50) s.captureStartup('inert-before-construction')
  if (n === 37) {
    s.construct('C_old','H'); s.construct('C_new','H',{ start:true })
  } else if (n === 38) {
    s.construct('C_old','H',{ start:true })
  } else if (n === 40) {
    s.construct('C','H',{ start:true }); s.construct('C_other','H2')
  } else if (n === 53) {
    s.construct('C_other','H2',{ start:true }); s.construct('C','H',{ start:true })
  } else {
    s.construct('C','H',{ start: a.start_before_dispose === true })
  }
  if ([42,43,44,45].includes(n)) s.visibleAnd40('C')
  s.injectOwned('C')
  if (n === 46) s.wrappers.set('H', new (s.targets.get('W_old').constructor)('W_new'))
  if (n !== 50) s.captureStartup('direct-before-subject')
  s.trace.length = 0; for (const g of s.charts.values()) g.visual = []
  s.beginSubject(); s.currentOwner = n === 37 || n === 38 ? 'C_old' : 'C'
  if (n === 37) { s.owners.get('C_old').destroy(); s.owners.get('C_old').destroy(); return }
  if (n === 38) { s.owners.get('C_old').destroy(); return }
  if (n === 54) return s.Carousel.destroyByContainer('H',true)
  const c = s.owners.get('C')
  if (n === 50) { s.start('C'); c.destroy(); c.destroy(); return }
  if (n === 32) { c.destroy(); c.destroy(); s.Carousel.destroyByContainer('H'); s.charts.get('G').destroy(); return }
  return c.destroy()
}

function assess(s, captured) {
  const item = s.item
  const a = item.arrange
  const o = item.oracle
  const C = s.Carousel
  const n = Number(item.id.slice(-3))
  const check = s.check
  const actualDestroy = s.charts.get('G')?.destroyCount ?? 0
  // 首断言固定，不以运行错误或别的 oracle 替代 LSC-001 的 fingerprint。
  check('chart_destroy_count', () => assert.equal(actualDestroy,o.chart_destroy_count))
  if (o.outcome === 'reject') {
    check('outcome.reject', () => assert.equal(captured.ok,false))
    if (captured.ok === false) {
      if (n === 39) {
        check('owner_conflict.code', () => assert.equal(captured.error?.code,'G2_CAROUSEL_OWNER_REPLACED'))
        check('owner_conflict.class', () => assert.ok(captured.error instanceof Error))
        check('owner_conflict.no_wrapper', () => assert.equal(Object.hasOwn(captured.error,'cause') || Object.hasOwn(captured.error,'originalError') || Object.hasOwn(captured.error,'cleanupErrors'),false))
      } else check('thrown_same_ref', () => assert.equal(captured.error,s.errorFor(o.thrown_same_ref)))
    }
  } else {
    check('outcome.resolve', () => assert.equal(captured.ok,true))
    if (captured.ok) check('returned_ref', () => assert.equal(captured.value,o.outcome === 'resolve_chart' ? s.charts.get(o.returned_ref) : undefined))
  }
  check('cleanup_trace_projection', () => assert.deepEqual(s.trace,o.cleanup_trace_projection))
  const counts = Object.fromEntries([...new Set(s.trace)].map(x => [x,s.trace.filter(y => x===y).length]))
  check('cleanup_counts', () => assert.deepEqual(counts,o.cleanup_counts))
  check('warning_error_refs_exact', () => {
    assert.equal(s.warnings.length,o.warning_error_refs_exact.length)
    for (const [i,id] of o.warning_error_refs_exact.entries()) {
      assert.equal(s.warnings[i].length,2); assert.equal(s.warnings[i][0],'G2 carousel cleanup failed:'); assert.equal(s.warnings[i][1],s.errorFor(id))
    }
  })
  check('cache_owner_after', () => assert.equal(s.id(C.instanceCache.get('H')),o.cache_owner_after))
  check('queue_contains_C_after', () => assert.equal(C.startQueue.includes(s.owners.get('C')),o.queue_contains_C_after))
  check('page_scroll_listener_after', () => assert.equal(s.document.listeners.some(x => x.event==='scroll'),o.page_scroll_listener_after))
  check('timer_registry_after_subject', () => assert.deepEqual(s.timerSnapshot(),o.timer_registry_after_subject))
  check('start_queue_after_exact', () => assert.deepEqual(Array.from(C.startQueue, x => s.id(x)),o.start_queue_after_exact))
  check('frame_registry_after_subject', () => assert.deepEqual(s.frameSnapshot(),o.frame_registry_after_subject))
  check('observer_callback_count_after_subject', () => assert.equal(s.callbacks.length,o.observer_callback_count_after_subject))
  if (o.other_cache_owner_after !== undefined) check('other_cache_owner_after', () => assert.equal(s.id(C.instanceCache.get('H2')),o.other_cache_owner_after))
  for (const [key,name] of [['other_owner_state_after_exact','C_other'],['new_owner_state_after_exact','C_new']]) {
    if (o[key]) check(key, () => assert.deepEqual(s.ownerSnapshot(name,false),o[key]))
  }
  if (o.visual_by_owner_after_subject) for (const [g,events] of Object.entries(o.visual_by_owner_after_subject)) check(`visual.${g}`, () => assert.deepEqual(s.charts.get(g)?.visual,events))
  if (o.remove_from_W_new_count !== undefined) check('remove_from_W_new_count', () => assert.equal(s.trace.filter(x => x.startsWith('listener.remove:W_new:')).length,o.remove_from_W_new_count))
  if (o.old_owner_destroyed_after !== undefined) check('old_owner_destroyed_after', () => assert.equal(s.owners.get('C_old')?.isDestroyed,o.old_owner_destroyed_after))
  if (a.expected_field_state_before_first_cleanup_primitive) {
    const subject = n === 38 ? 'C_old' : 'C'
    const actual = s.firstCleanupStates.get(subject)
    check('first_cleanup_state.present', () => assert.ok(actual))
    if (actual) for (const [key,value] of Object.entries(a.expected_field_state_before_first_cleanup_primitive)) {
      const actualValue = key === 'own_timer_handles' && actual[key]?.length===0 ? null : actual[key]
      check(`first_cleanup_state.${key}`, () => assert.deepEqual(actualValue,value))
    }
  }
  // 未知 runtime throw 始终独立报 execution error；已知注入原值与预期 owner guard 是业务通道。
  const knownThrown = !captured.ok && (s.errorIds.has(captured.error) || captured.error?.code==='G2_CAROUSEL_OWNER_REPLACED')
  let runtimeError = !captured.ok && !knownThrown ? captured.error : null
  // 无host公开销毁产生的TypeError是被测兼容行为违约，不能伪装模块导入失败。
  if (n===50 && runtimeError?.name === 'TypeError' && /removeEventListener|undefined/.test(runtimeError.message)) {
    check('inert.destroy_no_typeerror', () => assert.fail(runtimeError.message)); runtimeError=null
  }
  const live = {
    listeners: [...s.targets.values()].flatMap(t => t.listeners.map(x => ({ target:t.name,event:x.event,capture:x.capture,owner:x.owner }))),
    observers: [...s.observers.values()].filter(x => x.connected).map(x=>x.name), scrolls:[...s.scrolls.keys()],
    backgrounds:[...s.backgrounds.keys()], charts:[...s.charts.values()].filter(g=>!g.destroyedEffect).map(g=>g.name)
  }
  const retainedOwners = new Set([o.cache_owner_after, o.other_cache_owner_after].filter(Boolean))
  check('unresolved.owned_listeners', () => assert.deepEqual(live.listeners.filter(x => x.event !== 'scroll' && !retainedOwners.has(x.owner)), []))
  check('unresolved.observers', () => assert.deepEqual(live.observers.filter(name => {
    const owner = [...s.ownerMeta].find(([,m]) => m.o === name)?.[0]
    return !retainedOwners.has(owner)
  }), []))
  check('unresolved.scrolls', () => assert.deepEqual(live.scrolls, []))
  check('unresolved.backgrounds', () => assert.deepEqual(live.backgrounds, []))
  if (item.scenario === 'line_success') {
    // 成功返回的C仍持有S才允许保留；本合同正常pending IO不产生S。
    check('ownership_transferred.G_live', () => assert.equal(s.charts.get('G')?.destroyedEffect, undefined))
  }
  if (o.outcome === 'reject' && item.target.startsWith('Line')) {
    const unresolvedG = s.charts.has('G') && !s.charts.get('G').destroyedEffect
    check('unresolved.G_physical', () => assert.equal(unresolvedG, n === 36))
  }
  for (const retained of retainedOwners) {
    const m = s.ownerMeta.get(retained)
    if (!m) continue
    const listeners = live.listeners.filter(x => x.owner === retained && x.event !== 'scroll')
    check(`retained.${retained}.listeners`, () => assert.deepEqual(listeners.map(x => `${x.target}:${x.event}:${x.capture}`).sort(), [
      `D:visibilitychange:false`,`${m.h}:mouseenter:false`,`${m.h}:mouseleave:false`,`${m.w}:de-tooltip-hover-leave:false`
    ].sort()))
    check(`retained.${retained}.observer_target`, () => {
      const observer=s.observers.get(m.o); assert.equal(observer?.connected,true); assert.deepEqual(observer.targets,[m.hostObject])
    })
  }
  if (o.global_timers_after) check('global_timers_after', () => assert.deepEqual(s.timerSnapshot().map(x=>x.symbol), o.global_timers_after))
  if (o.global_start_queue_after) check('global_start_queue_after', () => assert.deepEqual(Array.from(C.startQueue,x=>s.id(x)),o.global_start_queue_after))
  if (o.new_owner_timer_fields_exact) check('new_owner_timer_fields_exact', () => assert.deepEqual(s.ownerSnapshot('C_new',false)?.timers,o.new_owner_timer_fields_exact))
  if (o.new_owner_chart_events_unchanged) check('new_owner_chart_events_unchanged', () => assert.deepEqual(s.charts.get('G_new')?.visual,[]))
  if (o.visual_emit_count !== undefined) check('visual_emit_count', () => assert.equal([...s.charts.values()].reduce((v,g)=>v+g.visual.length,0),o.visual_emit_count))
  if (o.visual_after_reentry_count !== undefined) check('visual_after_reentry_count', () => {
    const boundary=s.trace.indexOf('chart.emit:G_old:tooltip:hide')
    assert.equal(s.trace.slice(boundary+1).filter(x=>x.startsWith('chart.emit:')).length,o.visual_after_reentry_count)
  })
  if (o.startup_acquisition_exact) {
    const before=s.startupChecks.find(x=>x.label==='direct-before-subject')
    const owner=before?.owners.find(x=>x.owner==='C')
    const expected=o.startup_acquisition_exact
    const actual={ now_ms:before?.now_ms,own_nextItem:owner?.timers.nextItem,
      shared_TQ_handle:before?.timers.find(x=>x.symbol==='TQ')?.handle,firstColumnFrameReady:owner?.isFirstColumnFrameReady,
      tooltip_show_count:s.acquisition.filter(x=>x==='chart.emit:G:tooltip:show').length,column_frame_ids:owner?.column_frame_ids }
    check('startup_acquisition_exact',()=>assert.deepEqual(actual,expected))
  }
  const contractDiscrepancies = []
  if (n === 46) {
    const expected=a.startup_plan.owners_before_subject.find(x=>x.owner==='C')
    if (expected.tooltip_wrapper_target!==a.tooltip_wrapper) contractDiscrepancies.push({
      code:'LSC046_FROZEN_WRAPPER_IDENTITY_CONFLICT',field:'arrange.startup_plan.owners_before_subject[C].tooltip_wrapper_target',
      startup_expected:expected.tooltip_wrapper_target,arrange_wrapper:a.tooltip_wrapper,cleanup_expected:o.cleanup_trace_projection.filter(x=>x.startsWith('listener.remove:W')),
      disposition:'frozen_assets_unchanged; no_alias_or_skipped_assertion; independent_validator_decision_required'
    })
  }
  const fixtureErrors=s.assertions.filter(x=>x.channel.startsWith('startup.')||x.channel.startsWith('visible.')).filter(x=> !(n===46 && x.channel==='startup.C'))
  const fingerprint = s.assertions.length ? (n===1 && actualDestroy!==o.chart_destroy_count
    ? `LSC-001: chart_destroy_count expected=${o.chart_destroy_count} actual=${actualDestroy}` : `${item.id}: ${s.assertions[0].channel}_mismatch`) : null
  return { status: runtimeError || fixtureErrors.length ? 'EXECUTION_ERROR' : contractDiscrepancies.length ? 'CONTRACT_DISCREPANCY' : s.assertions.length ? 'ASSERTION_FAILURE' : 'PASS',
    contract_discrepancies:contractDiscrepancies, fixture_errors:fixtureErrors,
    ...(runtimeError ? { execution_error: String(runtimeError?.stack ?? runtimeError) } : {}), fingerprint,
    assertions: s.assertions, primary_fault_reached: s.primaryReached,
    thrown_ref: captured.ok ? null : s.errorIds.get(captured.error) ?? (captured.error?.code ?? 'unknown'),
    returned_ref: captured.ok ? s.id(captured.value) : null, warning_error_refs: s.warnings.map(args => s.errorIds.get(args[1]) ?? 'unknown'),
    trace:s.trace, acquisition_trace:s.acquisition, startup_observations:s.startupChecks, first_cleanup_states:Object.fromEntries(s.firstCleanupStates),
    partial_private_fields_not_observed:s.privateNotObserved, after:{ owners:[...s.owners.keys()].map(x=>s.ownerSnapshot(x)),
      globals:s.globalSnapshot(),timers:s.timerSnapshot(),frames:s.frameSnapshot(),live_resources:live,visual:Object.fromEntries([...s.charts].map(([k,g])=>[k,g.visual])) },
    timer_history:s.timerHistory, observer_callbacks:s.callbacks, cache_publications:s.cacheSets, console_errors:s.consoleErrors.map(String),
    error_reference_policy:{ injected_errors_compared_by_reference:true,owner_conflict_reference_equality_proven:false }
  }
}

try {
  assert.ok(['diagnostic','red','green'].includes(mode),'Unknown --mode')
  const casesBytes = await readFile(casesPath)
  const contract = JSON.parse(casesBytes)
  assert.equal(contract.cases.length,55)
  assert.deepEqual(contract.cases.map(x=>x.id),Array.from({length:55},(_,i)=>`LSC-${String(i+1).padStart(3,'0')}`))
  for (const item of contract.cases) {
    assert.ok(item.arrange.startup_plan && item.oracle.cleanup_trace_projection)
    const counts = Object.fromEntries([...new Set(item.oracle.cleanup_trace_projection)].map(k=>[k,item.oracle.cleanup_trace_projection.filter(x=>x===k).length]))
    assert.deepEqual(counts,item.oracle.cleanup_counts)
  }
  summary.cases_sha256=hash(casesBytes); summary.cases_identity_sha256=hash(canonical(contract.cases))
  summary.runner_sha256=hash(await readFile(fileURLToPath(import.meta.url)))
  if (!diagnostic) {
    if (!manifestPath) throw executionError('Formal mode requires --manifest; candidate metadata is not the freeze authority')
    const manifest=JSON.parse(await readFile(path.resolve(manifestPath))); formalManifest=manifest
    if (manifest.cases?.sha256 !== summary.cases_sha256 || manifest.cases_canonical_sha256 !== summary.cases_identity_sha256) throw executionError('Manifest/Cases identity mismatch')
    for (const field of ['design','cases','independent_review','source_baseline']) {
      const ref=manifest[field]; if(!ref?.path || hash(await readFile(path.join(repoRoot,ref.path)))!==ref.sha256) throw executionError(`Frozen ${field} drift`)
    }
    assert.equal(manifest.verdict,'VALID_FOR_BOUNDED_FREEZE'); assert.equal(manifest.case_count,55)
    if (manifest.runner_sha256 && manifest.runner_sha256 !== summary.runner_sha256) throw executionError('Manifest/runner drift')
    summary.manifest_sha256=hash(await readFile(path.resolve(manifestPath)))
  }
  summary.contract_valid=true; summary.contract_structure_valid=true
  for (const [name,source] of Object.entries(sourceNames)) {
    const bytes=await readFile(path.join(frontendRoot,source)); const compiled=await transform(bytes.toString(),{loader:'ts',format:'cjs',target:'es2022',sourcefile:source})
    bundles[name]=compiled.code; sourceRefs[name]={path:source,sha256:hash(bytes),compiled_sha256:hash(compiled.code)}
  }
  summary.source_refs=sourceRefs
  if(formalManifest && mode==='red') {
    const baseline=JSON.parse(await readFile(path.join(repoRoot,formalManifest.source_baseline.path)))
    for(const ref of baseline.files) {
      assert.equal(hash(await readFile(path.join(repoRoot,ref.source))),ref.source_sha256,'RED source drift')
      assert.equal(hash(await readFile(path.join(repoRoot,ref.snapshot))),ref.snapshot_sha256,'RED baseline snapshot drift')
    }
    summary.red_source_baseline_verified=true
  }
  for (const item of contract.cases) {
    const record={id:item.id,name:item.name,case_sha256:hash(canonical(item))}
    summary.cases_executed++
    try {
      const s=environment(item); summary.production_module_imported=true
      let captured
      try { captured={ok:true,value:await s.invoke(()=>exercise(s))} } catch(error) { captured={ok:false,error} }
      Object.assign(record,assess(s,captured))
    } catch(error) { Object.assign(record,{status:'EXECUTION_ERROR',execution_error:String(error?.stack??error)}) }
    summary.contract_discrepancies += record.contract_discrepancies?.length ?? 0
    summary.fixture_errors += record.fixture_errors?.length ?? 0
    if(record.status==='PASS')summary.passed++
    else if(record.status==='ASSERTION_FAILURE'){summary.assertion_failures++;summary.first_fingerprint??=record.fingerprint}
    else if(record.status!=='CONTRACT_DISCREPANCY') summary.execution_errors++
    records.push(record); console.log(JSON.stringify({case:record}))
  }
  if(summary.contract_discrepancies) summary.contract_valid=false
  summary.red_rule_satisfied=summary.contract_valid&&summary.production_module_imported&&summary.cases_executed===55&&summary.execution_errors===0&&summary.first_fingerprint==='LSC-001: chart_destroy_count expected=1 actual=0'
  summary.formal_red_candidate_satisfied=!diagnostic&&mode==='red'&&summary.red_rule_satisfied
  summary.formal_red_proven=false // 可信RED必须由独立Validator确认，runner不能自证。
} catch(error) { summary.execution_errors++; console.error(error?.stack??error) }
console.log(JSON.stringify({summary}))
if(arg('--report',null)) await writeFile(path.resolve(arg('--report')),JSON.stringify({summary,cases:records},null,2)+'\n')
process.exitCode=summary.execution_errors?2:summary.assertion_failures||summary.contract_discrepancies?1:0
