const evidence = globalThis.lifeArtifact, source = '7520741153101058048', target = '7520752064427724800'
const file = evidence + 'RuntimeEmptyTargetNetwork-events-r003.json'
const invoke = evidence + 'RuntimeEmptyTargetNetwork-invocation-r003.jsonl'
if (fs.existsSync(file) || fs.existsSync(invoke)) throw Error('EMPTY_FINAL_SLOT_USED')
const crypto = await import('node:crypto')
const hash = x => crypto.createHash('sha256').update(x).digest('hex')
const driverFile = evidence.replace(/evidence\/$/, 'runtime-state-tools/') + 'observe-empty-target-network-r003.js'
const driverSha256 = hash(fs.readFileSync(driverFile, 'utf8'))
const result = { startedAt: new Date().toISOString(), driverSha256, events: [], apiRequests: [], queryResponses: [], errors: [] }
fs.writeFileSync(invoke, JSON.stringify({ phase: 'started', at: result.startedAt, driverSha256, loginRecorded: false }) + '\n', { flag: 'wx' })
const diag = async () => JSON.parse(await page.getByTestId('chart-filter-copy-diagnostic').locator('pre').textContent())
const select = async id => {
  const tile = page.locator('#enlarge-inner-shape-' + id), title = tile.locator('..').locator('.de-drag-top')
  if (await title.count()) await title.click()
  else await tile.click({ position: { x: 70, y: 80 } })
  await page.getByRole('combobox', { name: '权限测试桩' }).selectOption({ label: '允许（测试）' })
  await page.waitForFunction(() => JSON.parse(document.querySelector('[data-testid="chart-filter-copy-diagnostic"] pre').textContent).fieldsReady)
}
const onRequest = req => {
  const u = new URL(req.url())
  if (!u.pathname.startsWith('/api/') || /\/(login|logout|auth)(\/|$)/i.test(u.pathname)) return
  const item = { at: new Date().toISOString(), method: req.method(), path: u.pathname }
  if (u.pathname.endsWith('/chartData/getData')) item.body = req.postData()
  result.apiRequests.push(item)
}
const onResponse = async response => {
  const path = new URL(response.url()).pathname
  if (/\/(chartData\/getData|dataVisualization\/findById)$/.test(path)) result.queryResponses.push({ at: new Date().toISOString(), method: response.request().method(), path, status: response.status(), request: response.request().postData(), body: await response.text() })
}
const onError = e => result.errors.push({ at: new Date().toISOString(), message: e.message })
page.on('request', onRequest)
page.on('response', onResponse)
page.on('pageerror', onError)
try {
  await select(source)
  await page.getByRole('button', { name: '复制过滤条件', exact: true }).click()
  const copied = await diag()
  if (copied.clipboard?.tree.items[0]?.value !== '500') throw Error('EMPTY_FINAL_SOURCE_PRECONDITION')
  result.events.push({ phase: 'source_copied', at: new Date().toISOString(), diagnostic: copied })
  await select(target)
  await page.getByText('过滤', { exact: true }).click()
  await page.getByRole('dialog').getByText('OR', { exact: true }).hover()
  await page.getByRole('dialog').locator('.operate-icon .ed-icon').click()
  await page.getByRole('dialog').locator('.filed').first().hover()
  await page.getByRole('dialog').locator('.filed .font12').click()
  await page.getByRole('dialog').getByRole('button', { name: '确认', exact: true }).click()
  await page.getByRole('dialog').waitFor({ state: 'hidden' })
  const empty = await diag()
  if (empty.copyReason !== 'empty_source' || empty.pasteReason !== null) throw Error('EMPTY_FINAL_EMPTY_PRECONDITION')
  result.events.push({ phase: 'target_empty', at: new Date().toISOString(), diagnostic: empty, copyDisabled: await page.getByRole('button', { name: '复制过滤条件', exact: true }).isDisabled() })
  result.testRequestStart = result.apiRequests.length
  result.domObserverStart = await page.evaluate(() => {
    const state = { installedAt: new Date().toISOString(), installedMonotonic: performance.now(), selector: '[role="dialog"]', visibleRule: 'rect.width>0 && visibility!=hidden', seen: [] }
    window.__s02EmptyFinalObservation = state
    const sample = () => { for (const node of document.querySelectorAll(state.selector)) if (node.getBoundingClientRect().width > 0 && getComputedStyle(node).visibility !== 'hidden') { const text = node.innerText; if (!state.seen.some(x => x.text === text)) state.seen.push({ at: new Date().toISOString(), monotonic: performance.now(), text }) } }
    sample()
    window.__s02EmptyFinalObserver = new MutationObserver(sample)
    window.__s02EmptyFinalObserver.observe(document.body, { childList: true, subtree: true, attributes: true })
    return { ...state }
  })
  await page.getByRole('button', { name: '粘贴过滤条件', exact: true }).click()
  await page.waitForFunction(() => ['success', 'failure'].includes(JSON.parse(document.querySelector('[data-testid="chart-filter-copy-diagnostic"] pre').textContent).queryObservation?.outcome), undefined, { timeout: 35000 })
  result.events.push({ phase: 'paste_settled', at: new Date().toISOString(), diagnostic: await diag() })
  await page.waitForTimeout(6500)
  result.events.push({ phase: 'after_snapshot_window', at: new Date().toISOString(), diagnostic: await diag() })
  result.domObserverEnd = await page.evaluate(() => { window.__s02EmptyFinalObserver.disconnect(); return { ...window.__s02EmptyFinalObservation, stoppedAt: new Date().toISOString(), stoppedMonotonic: performance.now() } })
  result.testRequestEnd = result.apiRequests.length
} catch (e) { result.executionFailure = { type: e.name, message: e.message } }
finally {
  await page.evaluate(() => window.__s02EmptyFinalObserver?.disconnect()).catch(() => {})
  try {
    await page.locator('.back-icon').click()
    await page.waitForTimeout(250)
    if (await page.getByRole('dialog').count()) await page.getByRole('dialog').getByRole('button', { name: '确定', exact: true }).click()
    await page.waitForURL(u => u.hash.startsWith('#/panel/index'))
    await page.locator('.back-icon').waitFor({ state: 'hidden' })
    result.events.push({ phase: 'discarded_exit', at: new Date().toISOString(), url: page.url(), editorCount: await page.getByTestId('chart-filter-copy-diagnostic').count() })
    await page.goto('http://127.0.0.1:7070/#/dashboard?resourceId=1312476889213964288', { waitUntil: 'networkidle' })
    await page.waitForTimeout(1800)
    if (await page.getByRole('dialog').count()) { result.events.push({ phase: 'draft_prompt', at: new Date().toISOString(), text: await page.getByRole('dialog').innerText() }); await page.getByRole('dialog').getByRole('button', { name: '否', exact: true }).click(); await page.getByRole('dialog').waitFor({ state: 'hidden' }); await page.waitForTimeout(1000) }
    await select(target)
    result.events.push({ phase: 'restored', at: new Date().toISOString(), diagnostic: await diag(), dialogs: await page.getByRole('dialog').count() })
  } catch (e) { result.restorationFailure = { type: e.name, message: e.message } }
  page.off('request', onRequest); page.off('response', onResponse); page.off('pageerror', onError)
  result.finishedAt = new Date().toISOString(); result.recordingStopped = true
  fs.writeFileSync(file, JSON.stringify(result, null, 2), { flag: 'wx' })
  fs.appendFileSync(invoke, JSON.stringify({ phase: 'finished', at: result.finishedAt, driverSha256: hash(fs.readFileSync(driverFile, 'utf8')), outputSha256: hash(fs.readFileSync(file, 'utf8')), executionFailure: result.executionFailure || null }) + '\n')
}
const tests = result.apiRequests.slice(result.testRequestStart, result.testRequestEnd)
return { executionFailure: result.executionFailure || null, restorationFailure: result.restorationFailure || null, outcome: result.events.find(x => x.phase === 'after_snapshot_window')?.diagnostic.queryObservation?.outcome, candidateQueryRequests: tests.filter(x => x.path.endsWith('/chartData/getData')).length, allPageSaveRequests: result.apiRequests.filter(x => /\/dataVisualization\/(save|saveCanvas|updateCanvas)$/.test(x.path)).length, dialogs: result.domObserverEnd?.seen, output: file }
