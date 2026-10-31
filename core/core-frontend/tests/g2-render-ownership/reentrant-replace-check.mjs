import assert from 'node:assert/strict'
import { createHash } from 'node:crypto'
import { readFile } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import path from 'node:path'
import { build } from 'esbuild'

const root = fileURLToPath(new URL('../../', import.meta.url))
const sourcePath = path.join(root, 'src/views/chart/components/views/components/g2-render-attempt.ts')
const hash = bytes => createHash('sha256').update(bytes).digest('hex')
const fixtures = [
  { id: 'HV001-001', scenario: 'nested_replace', expect: ['old', 'inner', 'outer', 'destroy'], errors: [] },
  { id: 'HV001-002', scenario: 'inner_throws', expect: ['old', 'inner', 'outer', 'destroy'], errors: ['inner'] },
  { id: 'HV001-003', scenario: 'two_levels_and_errors', expect: ['old', 'inner', 'deep', 'outer', 'destroy'], errors: ['old', 'inner', 'deep'] },
  { id: 'HV001-004', scenario: 'inner_disposes', expect: ['old', 'inner', 'sibling', 'destroy', 'outer'], errors: [] },
  { id: 'HV001-005', scenario: 'old_disposes_control', expect: ['old', 'inner', 'sibling', 'destroy', 'outer'], errors: [] },
  { id: 'HV001-006', scenario: 'remove_control', expect: ['old', 'inner', 'destroy'], errors: [] },
  { id: 'HV001-007', scenario: 'other_key_order', expect: ['old', 'inner', 'outer', 'b', 'a', 'destroy'], errors: [] },
  { id: 'HV001-008', scenario: 'inner_and_notify_throw', expect: ['old', 'inner', 'outer', 'destroy'], errors: ['inner', 'notify'] },
  { id: 'HV001-009', scenario: 'same_function_new_registration', expect: ['old', 'inner', 'inner', 'outer', 'destroy'], errors: [] },
  { id: 'HV001-010', scenario: 'setup_nested_replace', expect: ['old', 'inner', 'outer', 'destroy'], errors: ['inner'] }
]

function sameErrors(actual, expected, label) {
  assert.ok(Array.isArray(actual), `${label}: array required`)
  assert.equal(actual.length, expected.length, `${label}: length`)
  expected.forEach((error, index) => assert.equal(actual[index], error, `${label}: reference/order ${index}`))
}

async function execute(fixture, createAttempt) {
  const events = []
  const counts = new Map()
  const errors = Object.fromEntries(['old', 'inner', 'deep', 'notify'].map(id => [id, new Error(id)]))
  const batches = []
  const nestedReturns = []
  let scope
  let replacementErrors
  const record = name => {
    events.push(name)
    counts.set(name, (counts.get(name) ?? 0) + 1)
  }
  const nestedRegister = (key, cleanup) => {
    const returned = scope.replaceCleanup(key, cleanup)
    nestedReturns.push(returned)
    sameErrors(returned, [], 'nested registration')
  }
  const inner = () => {
    record('inner')
    if (fixture.scenario === 'two_levels_and_errors') {
      nestedRegister('key', () => { record('deep'); throw errors.deep })
    }
    if (fixture.scenario === 'same_function_new_registration' && counts.get('inner') === 1) {
      nestedRegister('key', inner)
    }
    if (fixture.scenario === 'inner_disposes') sameErrors(scope.dispose(), [], 'reentrant dispose')
    if (fixture.errors.includes('inner')) throw errors.inner
  }
  const old = () => {
    record('old')
    nestedRegister('key', inner)
    if (fixture.scenario === 'old_disposes_control') sameErrors(scope.dispose(), [], 'old reentrant dispose')
    if (fixture.errors.includes('old')) throw errors.old
  }
  const outer = () => record('outer')
  const installAndReplace = currentScope => {
    scope = currentScope
    if (fixture.scenario.includes('disposes')) nestedRegister('sibling', () => record('sibling'))
    if (fixture.scenario === 'other_key_order') nestedRegister('a', () => record('a'))
    nestedRegister('key', old)
    if (fixture.scenario === 'other_key_order') nestedRegister('b', () => record('b'))
    replacementErrors = fixture.scenario === 'remove_control'
      ? scope.removeCleanup('key')
      : scope.replaceCleanup('key', outer)
  }
  const result = await createAttempt({
    create: () => ({ kind: 'instance', instance: { destroy: () => record('destroy') } }),
    isCurrent: () => true,
    setup(currentScope) {
      if (fixture.scenario === 'setup_nested_replace') installAndReplace(currentScope)
    },
    render() {},
    afterRender() {},
    onCleanupErrors(cleanupErrors) {
      batches.push([...cleanupErrors])
      if (fixture.errors.includes('notify')) throw errors.notify
    }
  })
  assert.equal(result.status, 'ready')
  if (fixture.scenario !== 'setup_nested_replace') installAndReplace(result.scope)
  const expectedErrors = fixture.errors.map(id => errors[id])
  sameErrors(replacementErrors, expectedErrors, 'outer replace/remove return')
  sameErrors(result.cleanupErrors, fixture.scenario === 'setup_nested_replace' ? expectedErrors : [], 'attempt result return')
  const notified = fixture.errors.filter(id => id !== 'notify').map(id => errors[id])
  assert.equal(batches.length, notified.length ? 1 : 0, 'notification count')
  if (notified.length) sameErrors(batches[0], notified, 'notification error identity/order')
  sameErrors(result.scope.dispose(), [], 'final dispose')
  sameErrors(result.scope.dispose(), [], 'repeat dispose')
  assert.equal(result.scope.closed, true)
  assert.deepEqual(events, fixture.expect, 'no registered cleanup may be silently overwritten')
  assert.equal(counts.get('inner'), fixture.scenario === 'same_function_new_registration' ? 2 : 1, 'inner cleanup count')
  if (fixture.scenario !== 'remove_control') assert.equal(counts.get('outer'), 1, 'outer cleanup count')
  assert.equal(counts.get('destroy'), 1, 'destroy count')
  if (fixture.scenario === 'two_levels_and_errors') assert.equal(counts.get('deep'), 1)
  return { events, nested_calls: nestedReturns.length, replacement_error_ids: fixture.errors }
}

const summary = { scenarios: fixtures.length, executed: 0, passed: 0, assertion_failures: 0, execution_errors: 0, production_module_imported: false }
try {
  const bundle = await build({ entryPoints: [sourcePath], bundle: true, write: false, platform: 'node', format: 'esm', target: 'node18', logLevel: 'silent' })
  const module = await import(`data:text/javascript;base64,${Buffer.from(bundle.outputFiles[0].text).toString('base64')}`)
  assert.equal(typeof module.createG2RenderAttempt, 'function')
  summary.production_module_imported = true
  summary.source_sha256 = hash(await readFile(sourcePath))
  summary.runner_sha256 = hash(await readFile(fileURLToPath(import.meta.url)))
  summary.fixture_identity_sha256 = hash(JSON.stringify(fixtures))
  for (const fixture of fixtures) {
    summary.executed++
    const row = { id: fixture.id, scenario: fixture.scenario, fixture_sha256: hash(JSON.stringify(fixture)) }
    try {
      row.observed = await execute(fixture, module.createG2RenderAttempt)
      row.status = 'PASS'
      summary.passed++
    } catch (error) {
      if (error?.code === 'ERR_ASSERTION') {
        row.status = 'ASSERTION_FAILURE'
        row.fingerprint = `${fixture.id}: REENTRANT_CLEANUP_CONTRACT`
        row.message = error.message
        summary.assertion_failures++
      } else {
        row.status = 'EXECUTION_ERROR'
        row.message = String(error?.stack ?? error)
        summary.execution_errors++
      }
    }
    console.log(JSON.stringify({ case: row }))
  }
} catch (error) {
  summary.execution_errors++
  console.error(error?.stack ?? error)
}
console.log(JSON.stringify({ summary }))
process.exitCode = summary.execution_errors ? 2 : summary.assertion_failures ? 1 : 0
