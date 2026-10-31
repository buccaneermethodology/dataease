const target = '7520752064427724800', source = '7520741153101058048'
const root = globalThis.lifeArtifact
const toolDir = root.replace(/evidence\/$/, 'runtime-state-tools/')
const readerPath = toolDir + 'capture-active-indicator-r001.js'
const reader = fs.readFileSync(readerPath, 'utf8')
const crypto = await import('node:crypto')
const hash = text => crypto.createHash('sha256').update(text).digest('hex')
const output = root + 'RuntimeIndicatorOldState-events-r001.json'
const invocation = root + 'RuntimeIndicatorOldState-invocation-r001.jsonl'
if (fs.existsSync(output) || fs.existsSync(invocation)) throw Error('OLDSTATE_OUTPUT_SLOT_USED')
const startedAt = new Date().toISOString()
const ownSource = fs.readFileSync(toolDir + 'observe-indicator-abort-r001.js', 'utf8')
fs.writeFileSync(invocation, JSON.stringify({ phase: 'started', at: startedAt, readerPath, readerSha256: hash(reader), driverSha256: hash(ownSource), loginRecorded: false }) + '\n', { flag: 'wx' })
const events = [], requests = [], responses = [], failures = [], errors = []
const state = { case: 'MVP-UI-08-09-INDICATOR-ABORT-OLDSTATE-r001', startedAt, events, requests, responses, failures, errors, readerSha256: hash(reader), driverSha256: hash(ownSource), claim: '单indicator受控失败active投影，不等于全部old-state/SDK destroy计数/真实权限' }
const select = async id => {
  const tile = page.locator('#enlarge-inner-shape-' + id)
  await tile.locator('..').locator('.de-drag-top').click()
  await page.getByRole('combobox', { name: '权限测试桩' }).selectOption({ label: '允许（测试）' })
  await page.waitForFunction(() => JSON.parse(document.querySelector('[data-testid="chart-filter-copy-diagnostic"] pre').textContent).fieldsReady)
}
const diag = async () => JSON.parse(await page.getByTestId('chart-filter-copy-diagnostic').locator('pre').textContent())
const capture = () => page.evaluate(reader)
const projected = s => Object.fromEntries(Object.entries(s).filter(([k]) => !['at', 'monotonic'].includes(k)))
const requestObserver = req => {
  const u = new URL(req.url())
  if (!u.pathname.startsWith('/api/') || /\/(login|logout|auth)(\/|$)/i.test(u.pathname)) return
  const r = { at: new Date().toISOString(), method: req.method(), path: u.pathname }
  if (u.pathname.endsWith('/chartData/getData')) r.body = req.postData()
  requests.push(r)
}
const responseObserver = async response => {
  const u = new URL(response.url())
  if (/\/(chartData\/getData|dataVisualization\/findById)$/.test(u.pathname))
    responses.push({ at: new Date().toISOString(), method: response.request().method(), path: u.pathname, status: response.status(), request: response.request().postData(), body: await response.text() })
}
const failedObserver = req => { if (new URL(req.url()).pathname.endsWith('/chartData/getData')) failures.push({ at: new Date().toISOString(), path: new URL(req.url()).pathname, body: req.postData(), failure: req.failure()?.errorText }) }
const errorObserver = err => errors.push({ at: new Date().toISOString(), message: err.message })
const routePattern = '**/api/chartData/getData'
const abortCandidate = async route => {
  const req = route.request(), data = req.postDataJSON()
  if (data.id === target && data.customFilter?.items?.[0]?.value === '500') {
    events.push({ phase: 'candidate_abort', at: new Date().toISOString(), request: data })
    await route.abort('failed')
  } else await route.continue()
}
let routeInstalled = false
let failure = null
page.on('request', requestObserver)
page.on('response', responseObserver)
page.on('requestfailed', failedObserver)
page.on('pageerror', errorObserver)
try {
  await select(source)
  await page.getByRole('button', { name: '复制过滤条件', exact: true }).click()
  const copied = await diag()
  if (!copied.clipboard || copied.clipboard.tree.items[0].value !== '500') throw Error('OLDSTATE_KNOWN_COPY_PRECONDITION')
  events.push({ phase: 'source_copied', at: new Date().toISOString(), diagnostic: copied })
  await select(target)
  await page.getByText('过滤', { exact: true }).click()
  await page.getByRole('dialog').getByRole('textbox').nth(1).fill('200')
  await page.getByRole('dialog').getByRole('button', { name: '确认', exact: true }).click()
  await page.getByRole('dialog').waitFor({ state: 'hidden' })
  const setupDone = page.waitForResponse(r => new URL(r.url()).pathname.endsWith('/chartData/getData') && r.request().postDataJSON()?.id === target && r.request().postDataJSON()?.customFilter?.items?.[0]?.value === '200')
  await page.getByRole('button', { name: '更新图表数据', exact: true }).click()
  const setupHttp = await setupDone
  const setupValue = await setupHttp.json()
  if (setupValue.code !== 0) throw Error('OLDSTATE_SETUP_QUERY_FAILED')
  await page.waitForTimeout(6500)
  const baseline1 = await capture()
  await page.waitForTimeout(1000)
  const before = await capture()
  state.baselineSamplesEqual = JSON.stringify(projected(baseline1)) === JSON.stringify(projected(before))
  if (!state.baselineSamplesEqual) { state.baselineUnstable = { baseline1, before }; throw Error('OLDSTATE_BASELINE_NOT_STABLE') }
  if (before.view.value.customFilter.items[0].value !== '200' || !/6,?761/.test(before.nativeDom.text)) throw Error('OLDSTATE_200_6761_PRECONDITION')
  state.before = before
  state.beforeDiagnostic = await diag()
  state.testRequestStart = requests.length
  state.testFailureStart = failures.length
  state.emitterStart = await page.evaluate(() => {
    const shape = document.getElementById('enlarge-inner-shape-7520752064427724800')
    let wrapper
    for (const n of [shape, ...shape.querySelectorAll('*')]) { let v = n.__vueParentComponent; while (v) { if ((v.type?.__file || '').endsWith('/chart/components/views/index.vue')) wrapper = v; v = v.parent } }
    const st = wrapper.setupState
    window.__s02OldEmitterEvents = []
    window.__s02OldEmitterSubscriptions = []
    for (const key of ['emitter', 'eventBus']) {
      const bus = st[key]
      if (typeof bus?.on !== 'function' || typeof bus?.off !== 'function') continue
      const listener = type => window.__s02OldEmitterEvents.push({ at: performance.now(), channel: key, type: String(type) })
      bus.on('*', listener)
      window.__s02OldEmitterSubscriptions.push({ bus, listener })
    }
    return { at: performance.now(), channels: ['emitter', 'eventBus'].filter(k => typeof st[k]?.on === 'function') }
  })
  await page.locator('#enlarge-inner-shape-' + target).screenshot({ path: root + 'RuntimeIndicatorOldState-before-r001.png' })
  await page.route(routePattern, abortCandidate)
  routeInstalled = true
  await page.getByRole('button', { name: '粘贴过滤条件', exact: true }).click()
  state.confirmDialog = { at: new Date().toISOString(), text: await page.getByRole('dialog').innerText() }
  await page.getByRole('dialog').getByRole('button', { name: '确定', exact: true }).click()
  await page.getByRole('dialog').waitFor({ state: 'hidden' })
  await page.waitForFunction(() => ['success', 'failure'].includes(JSON.parse(document.querySelector('[data-testid="chart-filter-copy-diagnostic"] pre').textContent).queryObservation?.outcome), undefined, { timeout: 35000 })
  await page.waitForFunction(() => !Array.from(document.querySelectorAll('.ed-overlay,.ed-loading-mask')).some(e => getComputedStyle(e).display !== 'none' && getComputedStyle(e).visibility !== 'hidden' && e.getBoundingClientRect().width > 0), undefined, { timeout: 12000 })
  await page.waitForTimeout(500)
  state.after = await capture()
  state.afterDiagnostic = await diag()
  state.testRequestEnd = requests.length
  state.testFailureEnd = failures.length
  state.emitterEvents = await page.evaluate(() => window.__s02OldEmitterEvents || [])
  state.comparisons = Object.fromEntries(Object.keys(projected(before)).map(k => [k, JSON.stringify(before[k]) === JSON.stringify(state.after[k])]))
  await page.locator('#enlarge-inner-shape-' + target).screenshot({ path: root + 'RuntimeIndicatorOldState-after-r001.png' })
  state.observedOutcome = state.afterDiagnostic.queryObservation?.outcome
} catch (err) {
  failure = { type: err.name, message: err.message }
  state.executionFailure = failure
} finally {
  let routeRemoved = !routeInstalled
  if (routeInstalled) { await page.unroute(routePattern, abortCandidate); routeRemoved = true }
  await page.evaluate(() => { for (const { bus, listener } of window.__s02OldEmitterSubscriptions || []) bus.off('*', listener); window.__s02OldEmitterSubscriptions = [] }).catch(() => {})
  try {
    if (!page.url().includes('#/dashboard')) throw Error('OLDSTATE_RESTORE_ROUTE_UNAVAILABLE')
    await page.locator('.back-icon').click()
    await page.waitForTimeout(250)
    if (await page.getByRole('dialog').count()) await page.getByRole('dialog').getByRole('button', { name: '确定', exact: true }).click()
    await page.waitForURL(u => u.hash.startsWith('#/panel/index'))
    await page.locator('.back-icon').waitFor({ state: 'hidden' })
    events.push({ phase: 'discarded_exit', at: new Date().toISOString(), url: page.url(), editorCount: await page.getByTestId('chart-filter-copy-diagnostic').count() })
    await page.goto('http://127.0.0.1:7070/#/dashboard?resourceId=1312476889213964288', { waitUntil: 'networkidle' })
    await page.waitForTimeout(1800)
    if (await page.getByRole('dialog').count()) {
      events.push({ phase: 'draft_prompt', at: new Date().toISOString(), text: await page.getByRole('dialog').innerText() })
      await page.getByRole('dialog').getByRole('button', { name: '否', exact: true }).click()
      await page.getByRole('dialog').waitFor({ state: 'hidden' })
      await page.waitForTimeout(1000)
    }
    await select(target)
    events.push({ phase: 'restored', at: new Date().toISOString(), diagnostic: await diag(), dialogs: await page.getByRole('dialog').count() })
    state.restored = await capture()
  } catch (err) { state.restorationFailure = { type: err.name, message: err.message } }
  page.off('request', requestObserver)
  page.off('response', responseObserver)
  page.off('requestfailed', failedObserver)
  page.off('pageerror', errorObserver)
  state.finishedAt = new Date().toISOString()
  state.routeRemoved = routeRemoved
  state.listenersRemoved = true
  state.recordingStopped = true
  fs.writeFileSync(output, JSON.stringify(state, null, 2), { flag: 'wx' })
  fs.appendFileSync(invocation, JSON.stringify({ phase: 'finished', at: state.finishedAt, failure, readerSha256: hash(fs.readFileSync(readerPath, 'utf8')), driverSha256: hash(fs.readFileSync(toolDir + 'observe-indicator-abort-r001.js', 'utf8')), outputSha256: hash(fs.readFileSync(output, 'utf8')) }) + '\n')
}
return { observedOutcome: state.observedOutcome, comparisonFalse: Object.entries(state.comparisons || {}).filter(([, v]) => !v).map(([k]) => k), testRequests: state.testRequestEnd - state.testRequestStart, executionFailure: state.executionFailure || null, restorationFailure: state.restorationFailure || null, output }
