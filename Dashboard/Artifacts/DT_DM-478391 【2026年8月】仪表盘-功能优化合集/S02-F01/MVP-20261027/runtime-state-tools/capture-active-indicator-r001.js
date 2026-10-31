(() => {
  const id = '7520752064427724800'
  const root = document.getElementById('enlarge-inner-shape-' + id)
  if (!root) throw new Error('OLDSTATE_TARGET_DOM_MISSING')
  let owner
  const seen = new Set()
  for (const node of [root, ...root.querySelectorAll('*')]) {
    let vm = node.__vueParentComponent
    while (vm && !seen.has(vm.uid)) {
      seen.add(vm.uid)
      if ((vm.type?.__file || '').endsWith('/chart/components/views/index.vue')) owner = vm
      vm = vm.parent
    }
  }
  if (!owner) throw new Error('OLDSTATE_WRAPPER_MISSING')
  const st = owner.setupState, dv = st.dvMainStore, snap = st.snapshotStore
  const active = st.chartComponent?.$
  const dom = active?.setupState?.indicatorRef || active?.vnode?.el
  if (!dv || !snap || String(st.view?.id) !== id || !active || !dom?.isConnected || dom.nodeType !== 1)
    throw new Error('OLDSTATE_ACTIVE_IDENTITY_REFUSED')
  if (!(active.type?.__file || '').endsWith('/indicator/DeIndicator.vue'))
    throw new Error('OLDSTATE_NOT_INDICATOR')
  const describe = value => {
    const ownKeys = {}, undefinedPaths = [], aliases = [], nonJson = [], refs = new WeakMap()
    const walk = (v, path) => {
      if (v === undefined) { undefinedPaths.push(path); return }
      if (typeof v === 'number' && !Number.isFinite(v)) nonJson.push({ path, type: String(v) })
      if (typeof v === 'function' || typeof v === 'symbol' || typeof v === 'bigint') nonJson.push({ path, type: typeof v })
      if (v && typeof v === 'object') {
        if (refs.has(v)) { aliases.push({ path, original: refs.get(v) }); return }
        refs.set(v, path)
        ownKeys[path] = Object.keys(v)
        for (const key of Object.keys(v)) {
          if (/^(authorization|cookie|set-cookie|password|pwd|token|tokenSecret|privateKey|aesKey|access_token|refresh_token)$/i.test(key) && v[key])
            throw new Error('OLDSTATE_SENSITIVE_KEY_REFUSED')
          walk(v[key], path + '.' + key)
        }
      }
    }
    walk(value, '$')
    return { value: value === undefined ? null : JSON.parse(JSON.stringify(value)), ownKeys, undefinedPaths, aliases, nonJson }
  }
  const slot = (map, key) => ({ present: Object.prototype.hasOwnProperty.call(map || {}, key), descriptor: describe(map?.[key]) })
  window.__s02OldDomIds ||= new WeakMap()
  window.__s02OldDomSequence ||= 0
  const nodes = [], walker = document.createTreeWalker(dom, NodeFilter.SHOW_ALL)
  let n = dom
  while (n) {
    if (!window.__s02OldDomIds.has(n)) window.__s02OldDomIds.set(n, ++window.__s02OldDomSequence)
    nodes.push({ id: window.__s02OldDomIds.get(n), type: n.nodeType, name: n.nodeName })
    n = walker.nextNode()
  }
  return {
    at: new Date().toISOString(), monotonic: performance.now(),
    identity: { resourceId: String(dv.dvInfo.id), chartId: id, wrapperUid: owner.uid, nativeUid: active.uid, nativeFile: active.type.__file },
    view: describe(dv.canvasViewInfo[id]), element: describe(st.element),
    details: slot(dv.canvasViewDataInfo, id), origin: slot(dv.canvasViewOriginDataInfo, id),
    lastRequest: slot(dv.lastViewRequestInfo, id), pure: slot(dv.pureCanvasViewDataInfo, id),
    page: slot(dv.canvasViewInfo[id], 'pageInfo'), instanceMapPresent: Object.prototype.hasOwnProperty.call(dv.canvasViewInstanceInfo, id),
    rendererState: describe(active.setupState.state), rendererError: describe({ isError: active.setupState.isError, errMsg: active.setupState.errMsg }),
    nativeDom: { connected: dom.isConnected, nodes, html: dom.outerHTML, text: dom.innerText },
    snapshotState: describe(snap.$state),
    otherViews: describe(Object.fromEntries(Object.entries(dv.canvasViewInfo).filter(([key]) => key !== id))),
    otherElements: describe((dv.componentData || []).filter(x => String(x.id) !== id)),
    wrapperDrill: describe(st.state?.drillFilters), chartExtRequest: describe(st.chartExtRequest),
    observedCapabilities: { globalEmitter: typeof st.emitter?.on === 'function', eventBus: typeof st.eventBus?.on === 'function', sdkDestroyCalls: 'NOT_INSTRUMENTED' }
  }
})()
