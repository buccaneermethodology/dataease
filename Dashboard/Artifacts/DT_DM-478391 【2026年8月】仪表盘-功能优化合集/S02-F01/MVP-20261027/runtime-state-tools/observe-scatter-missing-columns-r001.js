// 仅area-stack补列；作为 AsyncFunction(page, browser, fs, runtimeErrors) 的函数体执行。
// author 阶段不运行；root 应先冻结本文件并在调用前核验摘要。
const crypto = await import('node:crypto')
const evidenceRoot = String(globalThis.lifeArtifact || '').replace(/\/+$/, '') + '/'
if (!evidenceRoot.includes('/MVP-20261027/evidence/')) throw Error('EVIDENCE_ROOT_REFUSED')
const driverPath = evidenceRoot.replace(/evidence\/$/, 'runtime-state-tools/') + 'observe-scatter-missing-columns-r001.js'
const outputPath = evidenceRoot + 'ScatterMissingColumns-events-r001.json'
const shots = Object.fromEntries(['before', 'after', 'reopened'].map(name => [name, evidenceRoot + 'ScatterMissingColumns-' + name + '-r001.png']))
for (const file of [outputPath, ...Object.values(shots)]) if (fs.existsSync(file)) throw Error('SLOT_USED:' + file.split('/').pop())
const hash = value => crypto.createHash('sha256').update(value).digest('hex')
const startedHash = hash(fs.readFileSync(driverPath))
const outputFd = fs.openSync(outputPath, 'wx')
const ids = { source500: '7520741153101058048', source200: '7521402539875504128', target: '7520752064427724800', dataset: '1312472054565572608', resource: '1312476889213964288' }
const r = {
  schema_version: 's02_area_missing_columns_observation_v1',
  case_id: 'S02-AREA-MISSING-COLUMNS-r001', kind: 'Builder实际观察；非独立验收',
  startedAt: new Date().toISOString(), driverPath, driverSha256Start: startedHash,
  ids, type: 'scatter', declaredWriteScope: '专用target正常UI切area/轴配置/paste/显式save；不写源码/DB/Store',
  api: [], wire: [], directories: [], stages: [], pageErrors: [],
  clipboardProjectionScope: '仅真实诊断导出的tree/ownKeys/undefinedPaths与tableId/createdAt/revision；不声称已导出内部fields全集',
  limits: ['只area-stack基本配置，不升完整49/38', 'DEV允许测试桩非真实权限', '无新route/fault/Store注入', '成功后保留area-stack500供下一批，未最终恢复liquid', 'pageerror监听不替代console/resource或旧ubo/C2裁决'],
  preexistingRuntimeErrorsCount: Array.isArray(runtimeErrors) ? runtimeErrors.length : null
}
const pending = []
const requestMeta = new WeakMap()
let phase = 'initial'
let requestSequence = 0
let finalized = false
let uiMutationStarted = false
const cleanError = error => ({ name: String(error?.name || 'Error'), message: String(error?.message || error).replace(/([?&](?:token|access_token|authorization|password)=)[^&#\s]*/gi, '$1[REDACTED]').replace(/Bearer\s+[^\s]+/gi, 'Bearer [REDACTED]') })
const requireThat = (condition, message) => { if (!condition) throw Error(message) }
const parse = text => JSON.parse(text)
const pathname = request => new URL(request.url()).pathname
const businessPath = path => /\/(chartData\/getData|dataVisualization\/(updateCanvas|findById))$/.test(path)
const nonAuthPath = path => path.startsWith('/api/') && !/\/(login|logout|auth|token|captcha|license)(\/|$)/i.test(path)
const onRequest = request => {
  const path = pathname(request)
  if (!nonAuthPath(path)) return
  const meta = { sequence: requestSequence++, phase, path, method: request.method(), at: new Date().toISOString(), apiIndex: r.api.length }
  if (businessPath(path)) {
    try {
      const q = parse(request.postData() || '{}')
      meta.id = q.id == null ? null : String(q.id)
      meta.type = q.type ?? null
    } catch (error) { meta.requestShapeError = cleanError(error) }
  }
  requestMeta.set(request, meta)
  r.api.push(meta)
}
const onResponse = response => {
  const request = response.request(), path = pathname(request)
  if (!nonAuthPath(path)) return
  const meta = requestMeta.get(request)
  if (businessPath(path)) {
    const wire = { sequence: meta?.sequence ?? null, phase: meta?.phase ?? phase, requestAt: meta?.at ?? null, at: new Date().toISOString(), path, method: request.method(), status: response.status(), request: request.postData(), body: null }
    r.wire.push(wire)
    pending.push((async () => {
      try { wire.body = await response.text() } catch (error) { wire.captureFailure = cleanError(error) }
    })())
  } else if (/\/chart\/listByDQ\/[^/]+\/[^/]+$/.test(path)) {
    const item = { sequence: meta?.sequence ?? null, phase: meta?.phase ?? phase, at: new Date().toISOString(), path, status: response.status() }
    r.directories.push(item)
    pending.push((async () => {
      try {
        const body = await response.json(), value = body?.data ?? body
        item.businessCode = body?.code ?? null
        item.fields = ['dimensionList', 'quotaList'].flatMap(key => Array.isArray(value?.[key]) ? value[key].map(field => ({ id: String(field.id), deType: field.deType })) : [])
      } catch (error) { item.captureFailure = cleanError(error) }
    })())
  }
}
const onPageError = error => r.pageErrors.push({ phase, at: new Date().toISOString(), ...cleanError(error) })
const diag = async () => parse(await page.getByTestId('chart-filter-copy-diagnostic').locator('pre').textContent())
const descriptor = value => ({ tree: value.tree, ownKeys: value.ownKeys, undefinedPaths: value.undefinedPaths })
const sameDescriptor = (a, b) => JSON.stringify(descriptor(a)) === JSON.stringify(descriptor(b))
const threshold = value => value?.source?.tree?.items?.[0]?.value
const stage = async (name, selectedRequestedId) => {
  const d = await diag()
  const item = { name, at: new Date().toISOString(), selectedRequestedId, diagnostic: d }
  const control = page.locator('.chart-type-select:visible')
  item.typeControlText = await control.count() === 1 ? await control.textContent() : null
  r.stages.push(item)
  return d
}
const select = async id => {
  const tile = page.locator('#enlarge-inner-shape-' + id)
  await tile.waitFor({ state: 'visible', timeout: 15000 })
  const overlay = tile.locator('..').locator('.de-drag-top')
  if (await overlay.count() === 1 && await overlay.isVisible()) await overlay.click()
  else await tile.click({ position: { x: id === ids.source200 ? 8 : 100, y: id === ids.source200 ? 8 : 20 } })
  await page.getByRole('combobox', { name: '权限测试桩', exact: true }).selectOption({ label: '允许（测试）' })
  await page.waitForFunction(() => {
    const element = document.querySelector('[data-testid="chart-filter-copy-diagnostic"] pre')
    return element && JSON.parse(element.textContent).fieldsReady === true
  }, undefined, { timeout: 20000 })
}
const assertTree = (d, expected) => {
  requireThat(threshold(d) === expected && d.source.tree.logic === 'and' && d.source.tree.items.length === 2 && d.source.tree.items[1].subTree?.logic === 'or', 'UNEXPECTED_TREE_' + expected)
  requireThat(d.source.tree.items[0].fieldId === '1793083721146' && d.source.tree.items[0].term === 'gt', 'AMOUNT_LEAF_MISMATCH')
  const shop = d.source.tree.items[1].subTree.items
  requireThat(shop.length === 1 && shop[0].fieldId === '1793083721149' && JSON.stringify(shop[0].enumValue) === JSON.stringify(['果元店', '南都店', '香橙店', '乐园店', '红叶店', '水围店']), 'SHOP_GROUP_MISMATCH')
}
const rowFor = label => page.locator('#pane-data .ed-row.drag-data').filter({ has: page.getByText(label, { exact: true }) })
const clearAxis = async (label, required = false) => {
  const row = rowFor(label), count = await row.count()
  if (!count && !required) return
  requireThat(count === 1, 'AXIS_ROW_COUNT:' + label + ':' + count)
  const button = row.locator('.form-draggable-title .remove-icon')
  requireThat(await button.count() === 1, 'AXIS_CLEAR_UNAVAILABLE:' + label)
  await button.scrollIntoViewIfNeeded()
  await button.click()
  r.stages.push({ name: 'axis_cleared', phase, at: new Date().toISOString(), label })
}
const dragField = async (name, label) => {
  const field = page.locator('.right-dimension .field-name[title="' + name + '"]')
  requireThat(await field.count() === 1, 'FIELD_LOCATOR_COUNT:' + name)
  const source = field.locator('xpath=ancestor::*[@draggable="true"][1]')
  const row = rowFor(label)
  requireThat(await row.count() === 1 && await source.count() === 1, 'DRAG_ENDPOINT_UNAVAILABLE:' + name)
  const destination = row.locator('.drag-placeholder-style')
  requireThat(await destination.count() === 1, 'DRAG_DESTINATION_COUNT:' + label)
  await source.scrollIntoViewIfNeeded()
  await source.click()
  await destination.scrollIntoViewIfNeeded()
  const from = await source.boundingBox(), to = await destination.boundingBox()
  requireThat(from && to && from.width > 5 && to.width > 5, 'DRAG_RECT_UNAVAILABLE:' + name)
  r.stages.push({ name: 'normal_html_drag', at: new Date().toISOString(), fieldName: name, axisLabel: label, sourceRect: from, destinationRect: to })
  await source.dragTo(destination, { sourcePosition: { x: Math.min(20, from.width / 2), y: Math.min(10, from.height / 2) }, targetPosition: { x: Math.min(100, to.width / 2), y: Math.min(16, to.height / 2) }, timeout: 15000 })
  requireThat((await row.innerText()).includes(name), 'DRAG_FIELD_NOT_VISIBLE:' + name)
}
const matchingQuery = expected => page.waitForResponse(response => {
  if (!pathname(response.request()).endsWith('/chartData/getData')) return false
  try {
    const q = parse(response.request().postData() || '{}')
    return String(q.id) === ids.target && q.type === 'scatter' && q.customFilter?.items?.[0]?.value === expected
  } catch { return false }
}, { timeout: 35000 })
const responseOk = async response => {
  const body = await response.json()
  requireThat(response.status() === 200 && body.code === 0, 'HTTP_OR_BUSINESS_FAILURE')
  return body
}
const areaRequestValid = request => {
  const q = parse(request.postData() || '{}')
  requireThat(String(q.id) === ids.target && String(q.tableId) === ids.dataset && q.type === 'scatter', 'AREA_QUERY_IDENTITY_MISMATCH')
  requireThat(q.xAxis?.length === 1 && String(q.xAxis[0].id) === '1793083721149', 'AREA_SHOP_AXIS_MISMATCH')
  requireThat(q.yAxis?.length === 1 && String(q.yAxis[0].id) === '1793083721146' && q.yAxis[0].summary === 'sum', 'AREA_AMOUNT_SUM_AXIS_MISMATCH')
  for (const key of ['xAxisExt', 'extStack', 'yAxisExt', 'drillFields']) requireThat(!q[key]?.length, 'AREA_OPTIONAL_AXIS_REMAINS:' + key)
  return q
}
const visibleCanvas = async () => {
  const root = page.locator('#enlarge-inner-shape-' + ids.target)
  await root.locator('canvas').first().waitFor({ state: 'visible', timeout: 20000 })
  await root.locator('.ed-loading-mask').waitFor({ state: 'hidden', timeout: 20000 })
  // 短暂稳定等待只用于截图采样，不替代query/prepare成功屏障。
  await page.waitForTimeout(400)
  return root
}
const screenshot = async name => {
  const buffer = await (await visibleCanvas()).screenshot()
  fs.writeFileSync(shots[name], buffer, { flag: 'wx' })
  r.stages.push({ name: 'png_' + name, at: new Date().toISOString(), path: shots[name], sha256: hash(buffer) })
}
const leavePanel = async () => {
  await page.goto('http://127.0.0.1:7070/#/panel/index', { waitUntil: 'networkidle' })
  await page.waitForTimeout(200)
  const dialog = page.getByRole('dialog')
  if (await dialog.count()) {
    r.stages.push({ name: 'exit_prompt', at: new Date().toISOString(), text: await dialog.innerText() })
    await dialog.getByRole('button', { name: '确定', exact: true }).click()
  }
  await page.waitForURL(url => url.hash.startsWith('#/panel/index'), { timeout: 20000 })
  await page.getByTestId('chart-filter-copy-diagnostic').waitFor({ state: 'hidden' })
  await page.locator('.back-icon').waitFor({ state: 'hidden' })
  return { at: new Date().toISOString(), url: page.url(), editorCount: await page.getByTestId('chart-filter-copy-diagnostic').count() }
}
const openSaved = async () => {
  const found = page.waitForResponse(response => {
    if (!pathname(response.request()).endsWith('/dataVisualization/findById')) return false
    try { return String(parse(response.request().postData() || '{}').id) === ids.resource } catch { return false }
  }, { timeout: 30000 })
  const reopenedQuery = matchingQuery('500')
  // 提前附加拒绝handler，避免goto期间失败造成未处理Promise；await时仍抛原错误。
  found.catch(() => {})
  reopenedQuery.catch(() => {})
  await page.goto('http://127.0.0.1:7070/#/dashboard?resourceId=' + ids.resource, { waitUntil: 'networkidle' })
  const dialog = page.getByRole('dialog')
  if (await dialog.count()) {
    const text = await dialog.innerText()
    requireThat(text.includes('未保存'), 'UNEXPECTED_REOPEN_DIALOG')
    r.stages.push({ name: 'draft_prompt', at: new Date().toISOString(), text, action: '否，读取服务器保存状态' })
    await dialog.getByRole('button', { name: '否', exact: true }).click()
    await dialog.waitFor({ state: 'hidden' })
  }
  const findResponse = await found, queryResponse = await reopenedQuery
  const body = await responseOk(findResponse)
  await responseOk(queryResponse)
  areaRequestValid(queryResponse.request())
  let views = body.data.canvasViewInfo
  if (typeof views === 'string') views = parse(views)
  requireThat(views[ids.target].type === 'scatter', 'REOPEN_TYPE_NOT_AREA')
  requireThat(JSON.stringify(views[ids.target].customFilter) === JSON.stringify(r.after.source.tree), 'REOPEN_PERSISTED_TREE_MISMATCH')
  return { findAt: new Date().toISOString(), targetType: views[ids.target].type, canvasViewInfoTarget: views[ids.target] }
}
page.on('request', onRequest)
page.on('response', onResponse)
page.on('pageerror', onPageError)
try {
  requireThat(new URL(page.url()).origin === 'http://127.0.0.1:7070', 'UNEXPECTED_PAGE_ORIGIN')
  requireThat(new URL(page.url()).hash.includes('/dashboard') && new URL(page.url()).hash.includes(ids.resource), 'UNEXPECTED_RESOURCE_PAGE')
  await select(ids.source500)
  r.initialSource500 = await stage('initial_source500', ids.source500)
  assertTree(r.initialSource500, '500')
  await select(ids.source200)
  r.initialSource200 = await stage('initial_richtext200', ids.source200)
  assertTree(r.initialSource200, '200')
  await select(ids.target)
  r.initialTarget = await stage('initial_target_liquid500_reported', ids.target)
  assertTree(r.initialTarget, '200')
  phase = 'configuration'
  uiMutationStarted = true
  await page.locator('.chart-type-select').click()
  await page.locator('[data-id="UserView&scatter"]').click()
  await page.getByText('字段', { exact: true }).click()
  await clearAxis('类别轴 / 维度', true)
  await clearAxis('值轴 / 指标', true)
  for (const label of ['子类别 / 维度', '堆叠项 / 维度', '钻取 / 维度', '气泡大小 / 指标']) await clearAxis(label)
  await dragField('shop', '类别轴 / 维度')
  await dragField('amount', '值轴 / 指标')
  phase = 'baseline'
  const baselineResponse = matchingQuery('200')
  baselineResponse.catch(() => {})
  await page.getByRole('button', { name: '更新图表数据', exact: true }).click()
  const baseline = await baselineResponse
  await responseOk(baseline)
  r.baselineRequest = areaRequestValid(baseline.request())
  r.baseline = await stage('area-stack200_applied_baseline', ids.target)
  assertTree(r.baseline, '200')
  await screenshot('before')
  phase = 'copy_source500'
  await select(ids.source500)
  r.sourceBeforeCopy = await stage('symbolic500_before_copy', ids.source500)
  assertTree(r.sourceBeforeCopy, '500')
  await page.getByRole('button', { name: '复制过滤条件', exact: true }).click()
  r.copied = await stage('symbolic500_copied', ids.source500)
  requireThat(r.copied.clipboard && sameDescriptor(r.sourceBeforeCopy.source, r.copied.clipboard), 'SOURCE_CLIPBOARD_DESCRIPTOR_MISMATCH')
  requireThat(String(r.copied.clipboard.tableId) === ids.dataset, 'COPIED_DATASET_MISMATCH')
  await select(ids.target)
  r.before = await stage('area-stack200_before_candidate', ids.target)
  assertTree(r.before, '200')
  phase = 'candidate'
  r.candidateWindow = { requestStart: r.api.length, startedAt: new Date().toISOString(), previousOperationId: r.before.queryObservation?.operationId ?? null }
  const candidateResponse = matchingQuery('500')
  candidateResponse.catch(() => {})
  await page.getByRole('button', { name: '粘贴过滤条件', exact: true }).click()
  const confirm = page.getByRole('dialog')
  await confirm.waitFor({ state: 'visible', timeout: 10000 })
  requireThat((await confirm.innerText()).includes('替换全部过滤条件'), 'EXPECTED_OVERWRITE_DIALOG_MISSING')
  await confirm.getByRole('button', { name: '确定', exact: true }).click()
  await confirm.waitFor({ state: 'hidden' })
  await page.waitForFunction(({ target, previous }) => {
    const d = JSON.parse(document.querySelector('[data-testid="chart-filter-copy-diagnostic"] pre').textContent), q = d.queryObservation
    return q && q.targetId === target && q.operationId !== previous && ['success', 'failure'].includes(q.outcome)
  }, { target: ids.target, previous: r.candidateWindow.previousOperationId }, { timeout: 40000 })
  r.after = await stage('area-stack500_after_candidate', ids.target)
  requireThat(r.after.queryObservation.outcome === 'success', 'CANDIDATE_PREPARE_OR_ADOPTION_FAILED')
  const candidate = await candidateResponse
  await responseOk(candidate)
  areaRequestValid(candidate.request())
  requireThat(sameDescriptor(r.copied.clipboard, r.after.source), 'CLIPBOARD_ADOPTED_TARGET_MISMATCH')
  requireThat(sameDescriptor(r.copied.clipboard, r.after.clipboard), 'PASTE_CHANGED_CLIPBOARD_DESCRIPTOR')
  requireThat(JSON.stringify(parse(candidate.request().postData()).customFilter) === JSON.stringify(r.copied.clipboard.tree), 'CANDIDATE_TRANSPORT_TREE_MISMATCH')
  r.candidateWindow.requestEnd = r.api.length
  r.candidateWindow.endedAt = new Date().toISOString()
  r.candidateWindow.targetQueryRequests = r.api.slice(r.candidateWindow.requestStart, r.candidateWindow.requestEnd).filter(item => item.path.endsWith('/chartData/getData') && item.id === ids.target)
  requireThat(r.candidateWindow.targetQueryRequests.length === 1, 'CANDIDATE_QUERY_COUNT_NOT_ONE')
  phase = 'source_export'
  await screenshot('after')
  r.areaBeforeSourceCopy = await stage('area-stack500_before_source_copy', ids.target)
  await page.getByRole('button', { name: '复制过滤条件', exact: true }).click()
  r.areaSourceCopied = await stage('area-stack500_source_copied', ids.target)
  requireThat(sameDescriptor(r.areaBeforeSourceCopy.source, r.areaSourceCopied.clipboard), 'AREA_SOURCE_EXPORT_DESCRIPTOR_MISMATCH')
  phase = 'save'
  const saved = page.waitForResponse(response => pathname(response.request()).endsWith('/dataVisualization/updateCanvas') && response.request().method() === 'POST', { timeout: 30000 })
  saved.catch(() => {})
  r.explicitSaveAt = new Date().toISOString()
  await page.getByRole('button', { name: '保存', exact: true }).click()
  const saveResponse = await saved
  r.saveCode = (await responseOk(saveResponse)).code
  r.saveResponseAt = new Date().toISOString()
  phase = 'exit'
  r.exit = await leavePanel()
  phase = 'reopen'
  r.reopenedResponseIdentity = await openSaved()
  await select(ids.target)
  r.reopened = await stage('area-stack500_reopened', ids.target)
  requireThat(sameDescriptor(r.after.source, r.reopened.source), 'REOPEN_DESCRIPTOR_MISMATCH')
  requireThat(r.reopened.clipboard === null && r.reopened.pasteReason === 'clipboard_empty', 'REOPEN_CLIPBOARD_NOT_EMPTY')
  await screenshot('reopened')
  r.finalState = { targetType: 'scatter', threshold: '500', explicitlySaved: true, restoredToOriginalLiquid: false, note: '保留scatter500；不声称恢复原类型/隐藏属性' }
  r.status = 'LOCAL_OBSERVATION_RECORDED_NOT_INDEPENDENT_ACCEPTANCE'
} catch (error) {
  r.executionFailure = { phase, at: new Date().toISOString(), ...cleanError(error) }
  phase = 'recovery_without_save'
  r.recovery = { attempted: uiMutationStarted, saveDispatchedBeforeFailure: r.api.some(item => item.path.endsWith('/dataVisualization/updateCanvas')), note: '不重试save；正常退出并重开last saved，已save或结果未知时不能保证恢复原liquid500' }
  if (!uiMutationStarted) r.recovery.skipped = '配置动作尚未开始；不离开或重导航未确认的页面'
  if (uiMutationStarted) try {
    const cancel = page.getByRole('dialog').getByRole('button', { name: '取消', exact: true })
    if (await cancel.count() === 1 && await cancel.isVisible()) await cancel.click()
    if (await page.locator('.back-icon').count() === 1 && await page.locator('.back-icon').isVisible()) r.recovery.exit = await leavePanel()
    await page.goto('http://127.0.0.1:7070/#/dashboard?resourceId=' + ids.resource, { waitUntil: 'networkidle' })
    const dialog = page.getByRole('dialog')
    if (await dialog.count()) {
      requireThat((await dialog.innerText()).includes('未保存'), 'RECOVERY_UNEXPECTED_DIALOG')
      await dialog.getByRole('button', { name: '否', exact: true }).click()
      await dialog.waitFor({ state: 'hidden' })
    }
    await select(ids.target)
    r.recovery.diagnostic = await stage('last_saved_reopened_after_failure', ids.target)
    r.recovery.completed = true
  } catch (recoveryError) { r.recovery.failure = cleanError(recoveryError) }
  r.status = 'FAILED_OBSERVATION_PRESERVED'
} finally {
  page.off('request', onRequest)
  page.off('response', onResponse)
  page.off('pageerror', onPageError)
  await Promise.allSettled(pending)
  r.wire.sort((a, b) => (a.sequence ?? Number.MAX_SAFE_INTEGER) - (b.sequence ?? Number.MAX_SAFE_INTEGER))
  r.saveRequestCount = r.api.filter(item => item.path.endsWith('/dataVisualization/updateCanvas')).length
  r.endRuntimeErrorsCount = Array.isArray(runtimeErrors) ? runtimeErrors.length : null
  try { r.driverSha256End = hash(fs.readFileSync(driverPath)); r.driverUnchanged = r.driverSha256End === r.driverSha256Start } catch (error) { r.hashReadbackFailure = cleanError(error) }
  r.wireCaptureFailures = r.wire.filter(item => item.captureFailure || item.body === null).map(item => ({ sequence: item.sequence, path: item.path }))
  if (r.driverUnchanged !== true || r.wireCaptureFailures.length > 0 || (r.status === 'LOCAL_OBSERVATION_RECORDED_NOT_INDEPENDENT_ACCEPTANCE' && r.saveRequestCount !== 1)) {
    r.finalizationFailure = { driverUnchanged: r.driverUnchanged ?? null, saveRequestCount: r.saveRequestCount, wireCaptureFailures: r.wireCaptureFailures }
    r.status = 'FAILED_OBSERVATION_PRESERVED'
  }
  r.finishedAt = new Date().toISOString()
  try { fs.writeFileSync(outputFd, JSON.stringify(r, null, 2) + '\n'); finalized = true } finally { fs.closeSync(outputFd) }
}
return { outputPath, finalized, status: r.status, executionFailure: r.executionFailure ?? null, finalizationFailure: r.finalizationFailure ?? null, candidateQueryCount: r.candidateWindow?.targetQueryRequests?.length ?? null, saveRequestCount: r.saveRequestCount, exit: r.exit ?? null, reopenedClipboard: r.reopened?.clipboard, driverSha256Start: r.driverSha256Start, driverSha256End: r.driverSha256End, pageErrorCount: r.pageErrors.length, finalState: r.finalState ?? null }
