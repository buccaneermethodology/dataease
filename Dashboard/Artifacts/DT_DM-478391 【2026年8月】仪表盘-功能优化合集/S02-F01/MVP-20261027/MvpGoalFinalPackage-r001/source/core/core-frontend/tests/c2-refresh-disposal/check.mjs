import assert from 'node:assert/strict'
import fs from 'node:fs/promises'
import path from 'node:path'
import { createHash } from 'node:crypto'
import { fileURLToPath } from 'node:url'
import { load, sleep, root, artifact } from './harness.mjs'

const sha = bytes => createHash('sha256').update(bytes).digest('hex')
const contractPath = path.resolve(artifact, '../planning/C2RefreshDisposalCases-r003.json')
const caseBytes = await fs.readFile(contractPath)
assert.equal(sha(caseBytes), '47c22e3cf68d2f26fd4902c781adf52d95a24f6cc118041f54fc7a23900811fa')
const contract = JSON.parse(caseBytes)
const cases = [...contract.cases, ...contract.additional_control_cases]
assert.equal(cases.length, 50)
assert.equal(new Set(cases.map(c => c.case_id)).size, 50)
const sourcePath = path.join(
  root,
  'src/views/chart/components/views/components/ChartComponentG2Plot.vue'
)
const sourceBefore = sha(await fs.readFile(sourcePath))
const report = {
  schema_version: 'c2_finite_disposal_execution_v1',
  layer: '真实SFC+真实map/ready/G2-scope路径；SDK/DOM/Store/provider有界doubles',
  started_at: new Date().toISOString(),
  contract_sha256: sha(caseBytes),
  source_sha256: sourceBefore,
  runner_sha256: sha(await fs.readFile(fileURLToPath(import.meta.url))),
  harness_sha256: sha(await fs.readFile(new URL('./harness.mjs', import.meta.url))),
  contract_valid: true,
  executed: 0,
  passed: 0,
  semantic_failures: 0,
  execution_errors: 0,
  cases: []
}
const complete = s => {
  if (s.layers.length) for (const layer of s.layers) layer.emit('inited')
  else {
    for (const plot of s.plots) plot.emit('loaded')
    for (const dot of s.dots) {
      dot.emit('add')
      dot.emit('loaded')
    }
  }
}
const compactSamples = (s, primary, current) =>
  [
    ...s.sdkSamples.map(x => ({ ...x, seam: 'SDK-body' })),
    ...s.wrapperSamples.map(x => ({ ...x, seam: x.label }))
  ].map(x => ({
    identity:
      x.object === primary
        ? 'old-primary'
        : x.object === current
        ? 'current-object'
        : 'other-primary',
    seam: x.seam,
    current_ref_null: x.current === null,
    active_scope_null: x.activeScope === null
  }))
for (const c of cases) {
  const r = {
    case_id: c.case_id,
    frozen_case_sha256: sha(JSON.stringify(c)),
    observations: {},
    violations: []
  }
  const check = (label, okay) => {
    if (!okay) r.violations.push(label)
  }
  let s,
    done = false
  try {
    s = await load(c.fixture, undefined, { realScene: true })
    const canonicalBefore = JSON.stringify({
      view: s.view,
      element: s.binding.current.value.element
    })
    const pending = s.prepare()
    await sleep(15)
    if (!c.owner) complete(s)
    const prepared = await pending
    if (!prepared.ok) throw new Error('HARNESS_PREPARE_NOT_READY: ' + prepared.reason)
    s.binding.current.value = { ...s.binding.current.value, phase: 'active' }
    await s.snapshot().g2RenderQueue
    await sleep(5)
    const initial = s.snapshot()
    if (!initial.myChart) throw new Error('HARNESS_CURRENT_NOT_REACHED')
    if (c.owner && (c.owner === 'active_scope') !== !!initial.activeG2Scope)
      throw new Error('HARNESS_ACTUAL_G2_OWNER_MISMATCH')
    const oldWrapper = initial.myChart
    const primary = c.owner
      ? oldWrapper
      : c.fixture.includes('polygon') || c.fixture.includes('point')
      ? oldWrapper
      : oldWrapper.getScene()
    if (!c.owner && ![...s.scenes, ...s.plots].includes(primary))
      throw new Error('HARNESS_PRIMARY_NOT_REAL_SDK_SEAM')
    const oldEntryCount = s.instrument(oldWrapper, 'old-wrapper-entry')
    s.setSampling()
    if (c.refresh) {
      await s.proxy.renderChart(s.response)
      await sleep(20)
      await s.snapshot().g2RenderQueue
      if (s.snapshot().myChart === oldWrapper || !s.snapshot().myChart)
        throw new Error('HARNESS_REFRESH_NOT_STABLE_NEW_CURRENT')
    }
    const current = s.snapshot().myChart
    const currentPrimary =
      c.owner || c.fixture.includes('polygon') || c.fixture.includes('point')
        ? current
        : current.getScene()
    const throws = !!c.throw_instance || !!c.destroy_throws
    const currentEntryCount =
      current === oldWrapper && !throws
        ? oldEntryCount
        : s.instrument(current, 'current-object-entry', throws)
    const activeScope = s.snapshot().activeG2Scope
    if (activeScope) s.observeScope(activeScope)
    let handleError, unmountError
    const handle = () => {
      try {
        prepared.handle.dispose()
      } catch (error) {
        if (error !== s.sentinel) throw error
        handleError = error
      }
    }
    const unmount = () => {
      try {
        s.unmount()
      } catch (error) {
        if (error !== s.sentinel) throw error
        unmountError = error
      }
    }
    const first = c.order === 'unmount_then_handle_dispose' ? unmount : handle
    const second = c.order === 'unmount_then_handle_dispose' ? handle : unmount
    first()
    const firstCount = currentEntryCount()
    second()
    handle()
    unmount()
    const secondCount = currentEntryCount()
    const repeatScope = activeScope ? activeScope.dispose() : []
    const samples = compactSamples(s, primary, current)
    const warns = s.warnings.filter(x => x[0] === 'G2 cleanup errors')
    const owner = c.owner
      ? initial.activeG2Scope
        ? 'active_scope'
        : 'legacy_no_active_scope'
      : 'map'
    const primaryCounts = c.refresh
      ? [primary.destroyCount, currentPrimary.destroyCount]
      : [primary.destroyCount]
    const effects = s.effects.filter(x => /^setView|^setPureCanvas|^query/.test(x[0]))
    r.observations = {
      actual_owner: owner,
      actual_fixture_type: s.response.type,
      prepared_wrapper_equals_primary: oldWrapper === primary,
      current_object_equals_primary: current === currentPrimary,
      strict_and_current_distinct: oldWrapper !== current,
      primary_sdk_counts: primaryCounts,
      old_wrapper_entry: oldEntryCount(),
      current_entry_count: currentEntryCount(),
      new_primary_sdk_body: currentPrimary.destroyCount,
      increments_after_second_entry_and_repeats: secondCount - firstCount,
      final_current_reference_null: s.snapshot().myChart === null,
      handle_throw_same_sentinel: handleError === s.sentinel,
      unmount_throw: !!unmountError,
      cleanup_warn_count: warns.length,
      cleanup_warn_sentinel_identity: warns.every(x => x[1].length === 1 && x[1][0] === s.sentinel),
      scope_dispose_error_count: s.scopeResults[0]?.length ?? 0,
      scope_error_same_sentinel:
        !c.destroy_throws || !activeScope || s.scopeResults[0]?.[0] === s.sentinel,
      scope_repeat_empty: repeatScope.length === 0,
      samples,
      side_effect_count: effects.length,
      query_count: s.effects.filter(x => x[0] === 'query').length,
      source_target_unchanged:
        JSON.stringify({ view: s.view, element: s.binding.current.value.element }) ===
        canonicalBefore
    }
    if (s.error()) throw s.error()
    check(
      'SFC_REFERENCE_NULL_BEFORE_EACH_DESTROY',
      samples.every(x => x.current_ref_null)
    )
    check('FINAL_CURRENT_REFERENCE_NULL', r.observations.final_current_reference_null)
    check('SECOND_ENTRY_AND_REPEATS_NO_RETRY', secondCount - firstCount === 0)
    check('NO_QUERY_STORE_PUBLISH', effects.length === 0)
    check('TARGET_FILTER_UNCHANGED', r.observations.source_target_unchanged)
    if (c.owner) {
      const e = c.expected
      for (const key of [
        'destroy_entry_count',
        'handle_throw_same_sentinel',
        'unmount_throw',
        'cleanup_warn_count',
        'scope_dispose_error_count'
      ]) {
        const actual = key === 'destroy_entry_count' ? currentEntryCount() : r.observations[key]
        check('G2_' + key, actual === e[key])
      }
      check(
        'G2_SCOPE_NULL_AT_DESTROY',
        samples.every(x => x.active_scope_null)
      )
      check('G2_SCOPE_ERROR_IDENTITY', r.observations.scope_error_same_sentinel)
      check('G2_WARN_ERROR_IDENTITY', r.observations.cleanup_warn_sentinel_identity)
      check('G2_SCOPE_REPEAT_EMPTY', repeatScope.length === 0)
    } else if (c.expected_layer_counts) {
      const e = c.expected_layer_counts
      check('OLD_STRICT_PRIMARY_BODY', primary.destroyCount === e.old_strict_primary_sdk_body)
      check('OLD_WRAPPER_ENTRY', oldEntryCount() === e.old_wrapper_entry)
      check('CURRENT_INTERCEPTED_ENTRY', currentEntryCount() === e.new_current_destroy_entry)
      check('NEW_PRIMARY_BODY_NO_DELEGATE', currentPrimary.destroyCount === e.new_primary_sdk_body)
      check(
        'MAP_THROW_HANDLE_CHANNEL',
        (handleError === s.sentinel) === (c.order === 'handle_dispose_then_unmount')
      )
      check('MAP_THROW_UNMOUNT_NO_ESCAPE', !unmountError)
      check(
        'MAP_THROW_WARN_CHANNEL',
        warns.length === (c.order === 'unmount_then_handle_dispose' ? 1 : 0)
      )
      check('MAP_THROW_WARN_IDENTITY', r.observations.cleanup_warn_sentinel_identity)
    } else {
      check(
        'ORIGINAL_PRIMARY_SDK_COUNTS',
        JSON.stringify(primaryCounts) === JSON.stringify(c.expected_counts)
      )
      check('NORMAL_NO_ERROR_CHANNEL', !handleError && !unmountError && warns.length === 0)
    }
    done = true
    r.status = r.violations.length ? 'semantic_failure' : 'pass'
  } catch (error) {
    r.status = 'execution_error'
    r.error = { name: error.name, message: error.message, stack: error.stack }
  } finally {
    if (!done && s) {
      try {
        s.unmount()
      } catch {
        /* 初次harness失败原样保留，另行修harness */
      }
    }
  }
  report.executed++
  if (r.status === 'pass') report.passed++
  else if (r.status === 'semantic_failure') report.semantic_failures++
  else report.execution_errors++
  report.cases.push(r)
}
report.finished_at = new Date().toISOString()
report.source_sha256_after = sha(await fs.readFile(sourcePath))
assert.equal(report.source_sha256_after, sourceBefore, 'SOURCE_CHANGED_DURING_RUN')
report.original_seven_counterexamples = report.cases.slice(0, 7).map(r => ({
  case_id: r.case_id,
  count_failed: r.violations.includes('ORIGINAL_PRIMARY_SDK_COUNTS')
}))
console.log(JSON.stringify(report, null, 2))
process.exitCode = report.execution_errors ? 2 : report.semantic_failures ? 1 : 0
