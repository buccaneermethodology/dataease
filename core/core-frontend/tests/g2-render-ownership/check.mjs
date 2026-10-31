import assert from 'node:assert/strict'
import { createHash } from 'node:crypto'
import { readFile } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import path from 'node:path'
import { build } from 'esbuild'

const frontendRoot = fileURLToPath(new URL('../../', import.meta.url))
const repoRoot = path.resolve(frontendRoot, '../..')
const artifactRoot = path.join(
  repoRoot,
  'Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01'
)
const casesPath = path.join(artifactRoot, 'G2StageLifecycleOwnershipCases-r002.json')
const sourcePath = path.join(
  frontendRoot,
  'src/views/chart/components/views/components/g2-render-attempt.ts'
)
const casesSha256 = 'f4348c739094943db73872ebc974d9b5048186d627c5022df2fa9c33d5fd2bba'
const hash = value => createHash('sha256').update(value).digest('hex')
const canonical = value => {
  if (Array.isArray(value)) return `[${value.map(canonical).join(',')}]`
  if (value && typeof value === 'object') {
    return `{${Object.keys(value).sort().map(key => `${JSON.stringify(key)}:${canonical(value[key])}`).join(',')}}`
  }
  return JSON.stringify(value)
}
const modeArg = process.argv.indexOf('--mode')
const mode = modeArg < 0 ? 'green' : process.argv[modeArg + 1]
const records = []
const summary = {
  mode,
  contract_valid: false,
  production_module_imported: false,
  helper_cases_executed: 0,
  passed: 0,
  assertion_failures: 0,
  execution_errors: 0,
  first_fingerprint: null,
  component_cases: 'NOT_RUN: helper-only RED preparation excludes component changes'
}

function deferred() {
  let resolve
  const promise = new Promise(done => { resolve = done })
  return { promise, resolve }
}

async function bounded(promise, phase) {
  let timer
  try {
    return await Promise.race([
      promise,
      new Promise((_, reject) => {
        timer = setTimeout(() => reject(new Error(`Execution timeout: ${phase}`)), 3000)
      })
    ])
  } finally {
    clearTimeout(timer)
  }
}

function validateCases(contract) {
  assert.equal(contract.schema_version, 's02_g2_ownership_cases_v1')
  assert.equal(contract.frozen_for_builder, true)
  assert.equal(contract.cases.length, 23)
  const scenarios = [
    'success', 'stale_start', 'stale_after_create', 'stale_after_setup',
    'stale_after_render', 'stale_after_afterRender', 'explicit_empty',
    'create_reject', 'setup_throw', 'render_reject', 'after_reject',
    'dispose_twice', 'cleanup_throws', 'replace', 'remove_reentrant',
    'register_closed', 'scope_isolation', 'destroy_throws',
    'unexpected_undefined', 'stale_cleanup_error', 'failure_cleanup_error',
    'replace_cleanup_error', 'notify_throws'
  ]
  contract.cases.forEach((item, index) => {
    assert.equal(item.id, `G2OWN-${String(index + 1).padStart(3, '0')}`)
    assert.equal(item.scenario, scenarios[index])
    assert.equal(item.red_fingerprint, `${item.id}: NOT_IMPLEMENTED`)
    assert.equal(item.runner_ref, 'core/core-frontend/tests/g2-render-ownership/check.mjs')
    assert.ok(item.arrange && item.oracle)
    assert.ok(Array.isArray(item.oracle.events))
    assert.ok(Array.isArray(item.oracle.cleanup_error_ids))
    assert.ok(Array.isArray(item.oracle.extra))
    assert.ok(['ready', 'stale', 'empty', 'failure'].includes(item.oracle.outcome))
    assert.equal(
      item.oracle.event_comparison,
      item.oracle.event_projection
        ? 'exact_order_after_explicit_prefix_projection'
        : 'exact_order'
    )
  })
}

function environment(item, instanceId = item.arrange.instance_id, sharedEvents = []) {
  const arrange = item.arrange
  const state = {
    item,
    events: sharedEvents,
    current: arrange.current !== false,
    instanceId,
    destroyCount: 0,
    scope: null,
    errors: new Map(),
    errorIds: new Map(),
    phaseGates: new Map(),
    notificationBatches: [],
    operationReturns: [],
    returnedCleanupErrors: null
  }
  const errorFor = id => {
    if (!state.errors.has(id)) {
      const error = new Error(`fixture error: ${id}`)
      state.errors.set(id, error)
      state.errorIds.set(error, id)
    }
    return state.errors.get(id)
  }
  const assertErrors = (errors, expectedIds, channel) => {
    assert.ok(Array.isArray(errors), `${channel}: cleanup channel must be an array`)
    assert.equal(errors.length, expectedIds.length, `${channel}: error count differs`)
    expectedIds.forEach((id, index) => {
      assert.equal(errors[index], errorFor(id), `${channel}: error reference/order differs at ${index}`)
    })
  }
  const cleanup = (id, key = id) => () => {
    state.events.push(`cleanup:${id}`)
    if (id === 'reentrant') {
      const errors = state.scope.removeCleanup(key)
      assert.deepEqual(errors, [], 'Removed cleanup must not run again on reentry')
    }
    if (arrange.throw_cleanup?.includes(id)) throw errorFor(id)
  }
  const instance = {
    destroy() {
      state.destroyCount++
      state.events.push(item.scenario === 'scope_isolation' ? `destroy:${instanceId}` : 'destroy')
      if (arrange.throw_destroy) throw errorFor('destroy')
    }
  }
  state.instance = instance
  state.errorFor = errorFor
  state.assertErrors = assertErrors
  state.cleanup = cleanup
  state.gateFor = phase => {
    if (!state.phaseGates.has(phase)) {
      state.phaseGates.set(phase, { entered: deferred(), release: deferred() })
    }
    return state.phaseGates.get(phase)
  }
  const pause = async phase => {
    const gate = state.gateFor(phase)
    gate.entered.resolve()
    await gate.release.promise
  }
  state.options = {
    isCurrent: () => state.current,
    initialCleanups: arrange.initial_cleanup_ids.map(id => ({ key: id, cleanup: cleanup(id) })),
    async create() {
      state.events.push('create')
      if (arrange.throw_at === 'create') throw errorFor(arrange.error_id)
      if (item.scenario === 'scope_isolation' && instanceId === 'A') await pause('create')
      if (arrange.stale_at === 'create') state.current = false
      if (arrange.create_outcome === 'empty') return { kind: 'empty' }
      if (arrange.create_outcome === 'undefined') return undefined
      return { kind: 'instance', instance }
    },
    setup(scope) {
      state.events.push('setup')
      state.scope = scope
      assert.equal(scope.instance, instance, 'setup must receive this attempt instance')
      assert.equal(scope.closed, false)
      assert.equal(scope.isCurrent(), state.current)
      if (arrange.setup_registers) assertErrors(scope.replaceCleanup(arrange.setup_registers, cleanup(arrange.setup_registers)), [], 'setup register return')
      if (arrange.stale_at === 'setup') state.current = false
      if (arrange.throw_at === 'setup') throw errorFor(arrange.error_id)
    },
    async render(scope) {
      state.events.push('render')
      assert.equal(scope, state.scope, 'render must keep the setup scope')
      assert.equal(scope.instance, instance)
      if (arrange.stale_at === 'render_deferred') await pause('render')
      if (arrange.throw_at === 'render') throw errorFor(arrange.error_id)
    },
    async afterRender(scope) {
      state.events.push('afterRender')
      assert.equal(scope, state.scope, 'afterRender must keep the setup scope')
      assert.equal(scope.instance, instance)
      if (arrange.after_registers) assertErrors(scope.replaceCleanup(arrange.after_registers, cleanup(arrange.after_registers)), [], 'afterRender register return')
      if (arrange.stale_at === 'afterRender_deferred') await pause('afterRender')
      if (arrange.throw_at === 'afterRender') throw errorFor(arrange.error_id)
    },
    onCleanupErrors(errors) {
      assert.ok(Array.isArray(errors), 'notification: cleanup channel must be an array')
      state.notificationBatches.push([...errors])
      for (const error of errors) state.events.push(`notify:${state.errorIds.get(error)}`)
      if (arrange.throw_notify) throw errorFor('notify')
    }
  }
  return state
}

function captureInvocation(createAttempt, state) {
  // 同步 throw 与异步 reject 均被捕获，避免并发隔离案例出现 unhandled rejection。
  return Promise.resolve().then(() => createAttempt(state.options)).then(
    result => ({ ok: true, result }),
    error => ({ ok: false, error })
  )
}

async function driveDeferred(state, settled, phase) {
  const gate = state.gateFor(phase)
  const reached = await bounded(Promise.race([
    gate.entered.promise.then(() => true),
    settled.then(() => false)
  ]), `${phase} entry`)
  if (reached) {
    state.current = false
    gate.release.resolve()
  }
  return reached
}

function requireExpectedFailure(captured, item, state) {
  if (captured.ok) {
    assert.notEqual(item.oracle.outcome, 'failure', 'Expected failure must reject')
    return
  }
  const error = captured.error
  if (error?.code === 'G2_RENDER_ATTEMPT_NOT_IMPLEMENTED') throw error
  if (error?.code !== 'G2_RENDER_ATTEMPT_FAILED' && error?.code !== 'G2_RENDER_INSTANCE_MISSING') throw error
  assert.equal(item.oracle.outcome, 'failure', 'Unexpected contract failure')
  assert.equal(error.code, item.oracle.failure_code)
  if (item.oracle.primary_error_identity) {
    const primary = state.errorFor(item.oracle.primary_error_identity)
    assert.equal(error.originalError, primary, 'Business error identity must survive cleanup')
    assert.equal(error.cause, primary, 'Failure cause must preserve original error reference')
  } else {
    assert.equal(error.originalError ?? null, null)
  }
  state.assertErrors(error.cleanupErrors, item.oracle.cleanup_error_ids, 'failure.cleanupErrors')
}

// 仅投影既有 Cases 的通道归属，不新增 expected：ready 之后的 operation 错误
// 属于该次 operation 返回值；自动清理错误属于 result/failure 返回值和通知。
function operationErrorIds(item, operationIndex) {
  const nonEmpty = {
    'G2OWN-013': { 3: ['bad'] },
    'G2OWN-018': { 1: ['destroy'] },
    'G2OWN-022': { 1: ['bad'] }
  }
  return nonEmpty[item.id]?.[operationIndex] ?? []
}

function assertResultChannel(item, state, captured) {
  if (!captured.ok) return
  const expected = item.arrange.operation ? [] : item.oracle.cleanup_error_ids
  state.assertErrors(captured.result.cleanupErrors, expected, 'result.cleanupErrors')
  // 固定返回时点的观察，不把后续 operation 的错误并入 earlier ready 结果。
  state.returnedCleanupErrors = [...captured.result.cleanupErrors]
}

function assertNotificationChannel(item, state) {
  const notifiedIds = item.oracle.events
    .filter(event => event.startsWith('notify:'))
    .map(event => event.slice('notify:'.length))
  assert.equal(state.notificationBatches.length, notifiedIds.length ? 1 : 0, 'notification: callback count differs')
  if (notifiedIds.length) state.assertErrors(state.notificationBatches[0], notifiedIds, 'notification[0]')
}

function assertOperationChannels(item, state) {
  const operations = item.arrange.operation ?? []
  assert.equal(state.operationReturns.length, operations.length, 'operation returns: call count differs')
  operations.forEach((operation, index) => {
    assert.equal(state.operationReturns[index].operation, operation)
    state.assertErrors(state.operationReturns[index].errors, operationErrorIds(item, index), `operation[${index}] ${operation}`)
  })
}

function applyOperations(state, result, operations) {
  assert.equal(result.status, 'ready', 'Scope operations require a ready result')
  assert.equal(result.scope, state.scope)
  assert.equal(result.scope.instance, state.instance)
  let disposeCalls = 0
  for (const [index, operation] of operations.entries()) {
    const [action, key, label] = operation.split(':')
    let errors
    if (action === 'add' || action === 'replace') {
      errors = result.scope.replaceCleanup(key, state.cleanup(label ?? key, key))
    } else if (action === 'remove') {
      errors = result.scope.removeCleanup(key)
    } else if (action === 'dispose') {
      errors = result.scope.dispose()
      disposeCalls++
      assert.equal(result.scope.closed, true, 'dispose must close the scope')
    } else {
      throw new Error(`Unsupported frozen operation: ${operation}`)
    }
    state.assertErrors(errors, operationErrorIds(state.item, index), `operation[${index}] ${operation}`)
    state.operationReturns.push({ operation, errors: [...errors] })
    if (action === 'dispose' && disposeCalls > 1) {
      assert.deepEqual(errors, [], 'Repeated dispose must return no errors or perform work')
    }
  }
}

function assertOracle(item, state, captured) {
  requireExpectedFailure(captured, item, state)
  const oracle = item.oracle
  if (captured.ok) {
    assert.equal(captured.result.status, oracle.outcome)
    if (state.returnedCleanupErrors === null) assertResultChannel(item, state, captured)
    state.assertErrors(state.returnedCleanupErrors, item.arrange.operation ? [] : oracle.cleanup_error_ids, 'result.cleanupErrors at return')
    if (captured.result.status === 'ready') {
      assert.equal(captured.result.scope, state.scope)
      assert.equal(captured.result.scope.instance, state.instance)
      if (!captured.result.scope.closed) assert.equal(captured.result.scope.isCurrent(), state.current)
    }
  }
  const events = oracle.event_projection
    ? state.events.filter(event => oracle.event_projection.some(prefix => event.startsWith(prefix)))
    : state.events
  assert.deepEqual(events, oracle.events, 'Frozen event oracle differs')
  assert.equal(state.destroyCount, oracle.destroy_count, 'destroy count differs')
  assertOperationChannels(item, state)
  assertNotificationChannel(item, state)
  if (oracle.primary_error_identity === null && captured.ok) assert.equal(captured.error, undefined)
  for (const extra of oracle.extra) {
    if (extra === 'G2_RENDER_INSTANCE_MISSING') {
      assert.equal(captured.error.code, extra)
    } else if (extra !== 'B_untouched') {
      throw new Error(`Unsupported frozen extra oracle: ${extra}`)
    }
  }
}

async function runCase(item, createAttempt) {
  if (item.scenario === 'scope_isolation') {
    assert.deepEqual(item.arrange.attempts, ['A:deferred', 'B:ready'])
    assert.deepEqual(item.arrange.stale, ['A'])
    const events = []
    const a = environment(item, 'A', events)
    const b = environment(item, 'B', events)
    const aSettled = captureInvocation(createAttempt, a)
    const aGate = a.gateFor('create')
    const entered = await bounded(Promise.race([
      aGate.entered.promise.then(() => true),
      aSettled.then(() => false)
    ]), 'isolation A deferred create')
    const bCaptured = await bounded(captureInvocation(createAttempt, b), 'isolation B ready')
    if (entered) {
      a.current = false
      aGate.release.resolve()
    }
    const aCaptured = await bounded(aSettled, 'isolation A stale settle')
    // 先收齐并分类 A/B；未知执行错误优先，禁止 A 的 stub 掩盖 B 的错误。
    propagateInvocationErrors([aCaptured, bCaptured])
    assert.equal(entered, true, 'A create must be pending while B becomes ready')
    assert.equal(aCaptured.result.status, 'stale')
    a.assertErrors(aCaptured.result.cleanupErrors, [], 'isolation A result.cleanupErrors')
    assert.equal(bCaptured.result.status, 'ready')
    assert.equal(bCaptured.result.scope.instance, b.instance)
    assert.equal(bCaptured.result.scope, b.scope)
    assert.equal(bCaptured.result.scope.closed, false)
    assert.equal(bCaptured.result.scope.isCurrent(), true)
    b.assertErrors(bCaptured.result.cleanupErrors, [], 'isolation B result.cleanupErrors')
    assertNotificationChannel(item, a)
    assertResultChannel(item, b, bCaptured)
    assert.deepEqual({ A: a.destroyCount, B: b.destroyCount }, item.oracle.instance_destroy_counts)
    assert.notEqual(a.scope, b.scope)
    assertOracle(item, { ...b, destroyCount: a.destroyCount + b.destroyCount }, bCaptured)
    return
  }
  const state = environment(item)
  const settled = captureInvocation(createAttempt, state)
  let deferredReached = null
  if (item.arrange.stale_at?.endsWith('_deferred')) {
    deferredReached = await driveDeferred(state, settled, item.arrange.stale_at.replace('_deferred', ''))
  }
  const captured = await bounded(settled, item.id)
  requireExpectedFailure(captured, item, state)
  assertResultChannel(item, state, captured)
  if (deferredReached !== null) assert.equal(deferredReached, true, 'Required deferred phase was not reached')
  if (item.arrange.operation) applyOperations(state, captured.result, item.arrange.operation)
  assertOracle(item, state, captured)
}

function propagateInvocationErrors(captures) {
  const rejected = captures.filter(captured => !captured.ok)
  const knownCodes = new Set([
    'G2_RENDER_ATTEMPT_NOT_IMPLEMENTED', 'G2_RENDER_ATTEMPT_FAILED',
    'G2_RENDER_INSTANCE_MISSING', 'ERR_ASSERTION'
  ])
  const unknown = rejected.find(captured => !knownCodes.has(captured.error?.code))
  if (unknown) throw unknown.error
  const nonStub = rejected.find(captured => captured.error?.code !== 'G2_RENDER_ATTEMPT_NOT_IMPLEMENTED')
  if (nonStub) {
    if (nonStub.error?.code === 'ERR_ASSERTION') throw nonStub.error
    assert.fail(`Isolation attempt unexpectedly rejected: ${nonStub.error.code}`)
  }
  if (rejected.length) throw rejected[0].error
}

function classifyCaseError(item, error) {
  if (error?.code === 'G2_RENDER_ATTEMPT_NOT_IMPLEMENTED' || error?.code === 'ERR_ASSERTION') {
    return {
      status: 'ASSERTION_FAILURE',
      fingerprint: error?.code === 'G2_RENDER_ATTEMPT_NOT_IMPLEMENTED'
        ? item.red_fingerprint
        : `${item.id}: ORACLE_MISMATCH`,
      error_code: error.code,
      message: error.message
    }
  }
  return { status: 'EXECUTION_ERROR', message: String(error?.stack ?? error) }
}

// 诊断入口只构造 oracle 的输入 transcript；不实现或替换生产 helper，
// 不运行产品 GREEN。每个负例先验证完整通道 transcript 被接受，再删改
// 唯一目标通道，要求同一个真实 oracle 因该通道拒绝。
function channelTranscript(item) {
  const state = environment(item)
  state.current = item.oracle.outcome !== 'stale'
  state.events.push(...item.oracle.events)
  state.destroyCount = item.oracle.destroy_count
  state.scope = {
    instance: state.instance,
    closed: Boolean(item.arrange.operation?.includes('dispose')),
    isCurrent: () => state.current
  }
  state.operationReturns = (item.arrange.operation ?? []).map((operation, index) => ({
    operation,
    errors: operationErrorIds(item, index).map(state.errorFor)
  }))
  const notifiedIds = item.oracle.events.filter(event => event.startsWith('notify:'))
    .map(event => event.slice('notify:'.length))
  if (notifiedIds.length) state.notificationBatches.push(notifiedIds.map(state.errorFor))
  if (item.oracle.outcome === 'failure') {
    const primary = item.oracle.primary_error_identity
      ? state.errorFor(item.oracle.primary_error_identity)
      : undefined
    return {
      state,
      captured: {
        ok: false,
        error: Object.assign(new Error('oracle transcript'), {
          code: item.oracle.failure_code,
          originalError: primary,
          cause: primary,
          cleanupErrors: item.oracle.cleanup_error_ids.map(state.errorFor)
        })
      }
    }
  }
  return {
    state,
    captured: {
      ok: true,
      result: {
        status: item.oracle.outcome,
        scope: state.scope,
        cleanupErrors: (item.arrange.operation ? [] : item.oracle.cleanup_error_ids).map(state.errorFor)
      }
    }
  }
}

async function runOracleSelfTests(contract) {
  const witnesses = []
  let channelControls = 0
  const byId = id => {
    const item = contract.cases.find(item => item.id === id)
    assert.ok(item, `Missing frozen identity: ${id}`)
    return item
  }
  const channelWitness = (name, caseId, channel, mutate) => {
    const item = byId(caseId)
    const control = channelTranscript(item)
    assertOracle(item, control.state, control.captured)
    channelControls++
    const negative = channelTranscript(item)
    mutate(negative)
    let failure
    try {
      assertOracle(item, negative.state, negative.captured)
    } catch (error) {
      failure = error
    }
    assert.equal(failure?.code, 'ERR_ASSERTION', `${name}: corrupted channel was not rejected`)
    assert.ok(failure.message.includes(channel), `${name}: rejection must identify ${channel}; got ${failure.message}`)
    const witness = {
      name, case_id: caseId, control_accepted: true, mutation_rejected: true,
      classification: classifyCaseError(item, failure).status,
      rejection_channel: channel, message: failure.message
    }
    witnesses.push(witness)
    console.log(JSON.stringify({ oracle_negative_witness: witness }))
  }
  channelWitness('020_result_missing_setup', 'G2OWN-020', 'result.cleanupErrors', ({ captured }) => {
    captured.result.cleanupErrors = []
  })
  channelWitness('021_failure_missing_setup', 'G2OWN-021', 'failure.cleanupErrors', ({ captured }) => {
    captured.error.cleanupErrors = []
  })
  channelWitness('022_replace_return_missing_bad', 'G2OWN-022', 'operation[1]', ({ state }) => {
    state.operationReturns[1].errors = []
  })
  channelWitness('023_result_missing_setup_keeps_notify', 'G2OWN-023', 'result.cleanupErrors', ({ state, captured }) => {
    captured.result.cleanupErrors = [state.errorFor('notify')]
  })
  channelWitness('020_result_duplicate_setup', 'G2OWN-020', 'result.cleanupErrors', ({ state, captured }) => {
    captured.result.cleanupErrors = [state.errorFor('setup'), state.errorFor('setup')]
  })
  channelWitness('021_failure_duplicate_setup', 'G2OWN-021', 'failure.cleanupErrors', ({ state, captured }) => {
    captured.error.cleanupErrors = [state.errorFor('setup'), state.errorFor('setup')]
  })
  channelWitness('020_result_cloned_error', 'G2OWN-020', 'result.cleanupErrors', ({ captured }) => {
    captured.result.cleanupErrors = [new Error('fixture error: setup')]
  })
  channelWitness('023_result_error_order_reversed', 'G2OWN-023', 'result.cleanupErrors', ({ state, captured }) => {
    captured.result.cleanupErrors = [state.errorFor('notify'), state.errorFor('setup')]
  })
  channelWitness('013_manual_dispose_missing_bad', 'G2OWN-013', 'operation[3]', ({ state }) => {
    state.operationReturns[3].errors = []
  })
  channelWitness('018_dispose_missing_destroy', 'G2OWN-018', 'operation[1]', ({ state }) => {
    state.operationReturns[1].errors = []
  })
  channelWitness('018_repeat_dispose_returns_error', 'G2OWN-018', 'operation[2]', ({ state }) => {
    state.operationReturns[2].errors = [state.errorFor('destroy')]
  })
  channelWitness('020_notification_missing_error', 'G2OWN-020', 'notification[0]', ({ state }) => {
    state.notificationBatches[0] = []
  })
  channelWitness('020_notification_duplicate_callback', 'G2OWN-020', 'notification:', ({ state }) => {
    state.notificationBatches.push([state.errorFor('setup')])
  })
  channelWitness('022_result_contaminated_by_operation', 'G2OWN-022', 'result.cleanupErrors', ({ state, captured }) => {
    captured.result.cleanupErrors = [state.errorFor('bad')]
  })
  channelWitness('015_remove_unexpected_error', 'G2OWN-015', 'operation[1]', ({ state }) => {
    state.operationReturns[1].errors = [state.errorFor('unexpected')]
  })
  const item = byId('G2OWN-017')
  for (const unknownIndex of [1, 0]) {
    let calls = 0
    const executionError = new TypeError(`negative execution error ${unknownIndex}`)
    const stubError = Object.assign(new Error('diagnostic stub'), { code: 'G2_RENDER_ATTEMPT_NOT_IMPLEMENTED' })
    let observed
    try {
      await runCase(item, () => Promise.reject(calls++ === unknownIndex ? executionError : stubError))
    } catch (error) {
      observed = error
    }
    assert.equal(calls, 2, 'Both attempts must execute before classification')
    assert.equal(observed, executionError, 'Unknown execution error must outrank the other stub')
    const classification = classifyCaseError(item, observed).status
    assert.equal(classification, 'EXECUTION_ERROR')
    const witness = {
      name: unknownIndex ? '017_A_stub_B_TypeError' : '017_A_TypeError_B_stub',
      case_id: item.id, calls, classification,
      original_error_identity_preserved: true, stub_did_not_mask_execution_error: true
    }
    witnesses.push(witness)
    console.log(JSON.stringify({ oracle_negative_witness: witness }))
  }
  // 精确双 stub 仍保持冻结的 RED 投影；负例修复不得改变此基线。
  let calls = 0
  let exactStub
  try {
    await runCase(item, () => {
      calls++
      return Promise.reject(Object.assign(new Error('diagnostic stub'), { code: 'G2_RENDER_ATTEMPT_NOT_IMPLEMENTED' }))
    })
  } catch (error) {
    exactStub = error
  }
  assert.equal(calls, 2)
  assert.equal(classifyCaseError(item, exactStub).fingerprint, item.red_fingerprint)
  console.log(JSON.stringify({ oracle_self_test_summary: {
    diagnostic_only: true,
    negative_witnesses_rejected: witnesses.length,
    positive_channel_controls_accepted: channelControls,
    exact_dual_stub_control: 'PASS',
    helper_green_proven: false,
    production_stub_modified: false
  } }))
  summary.oracle_self_test_witnesses = witnesses.length
  summary.mode = 'oracle-self-test'
  summary.diagnostic_only = true
}

try {
  assert.ok(mode === 'red' || mode === 'green', '--mode must be red or green')
  const bytes = await readFile(casesPath)
  assert.equal(hash(bytes), casesSha256, 'Frozen Cases digest drift')
  const contract = JSON.parse(bytes)
  validateCases(contract)
  summary.contract_valid = true
  if (process.argv.includes('--self-test-oracle')) {
    await runOracleSelfTests(contract)
  } else {
  const bundled = await build({
    entryPoints: [sourcePath],
    bundle: true,
    write: false,
    platform: 'node',
    format: 'esm',
    target: 'node18',
    logLevel: 'silent'
  })
  const module = await import(`data:text/javascript;base64,${Buffer.from(bundled.outputFiles[0].text).toString('base64')}`)
  assert.equal(typeof module.createG2RenderAttempt, 'function')
  summary.production_module_imported = true
  summary.cases_sha256 = hash(bytes)
  summary.source_sha256 = hash(await readFile(sourcePath))
  summary.runner_sha256 = hash(await readFile(fileURLToPath(import.meta.url)))
  summary.bundle_sha256 = hash(bundled.outputFiles[0].text)
  for (const item of contract.cases) {
    summary.helper_cases_executed++
    const record = { id: item.id, scenario: item.scenario, case_sha256: hash(canonical(item)) }
    try {
      await runCase(item, module.createG2RenderAttempt)
      record.status = 'PASS'
      summary.passed++
    } catch (error) {
      Object.assign(record, classifyCaseError(item, error))
      if (record.status === 'ASSERTION_FAILURE') {
        summary.assertion_failures++
        summary.first_fingerprint ??= record.fingerprint
      } else {
        summary.execution_errors++
      }
    }
    records.push(record)
    console.log(JSON.stringify({ case: record }))
  }
  summary.red_rule_satisfied = summary.contract_valid && summary.production_module_imported &&
    summary.helper_cases_executed === contract.red_rule.helper_executed &&
    summary.assertion_failures === contract.red_rule.assertion_failures &&
    summary.execution_errors === contract.red_rule.execution_errors &&
    summary.first_fingerprint === contract.red_rule.first_fingerprint &&
    records.every(record => record.fingerprint === `${record.id}: NOT_IMPLEMENTED`)
  }
} catch (error) {
  summary.execution_errors++
  console.error(error?.stack ?? error)
}
console.log(JSON.stringify({ summary }))
process.exitCode = summary.execution_errors > 0 ? 2 : summary.assertion_failures > 0 ? 1 : 0
