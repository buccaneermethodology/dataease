import assert from 'node:assert/strict'
import { build } from 'esbuild'
import vm from 'node:vm'
import { createHash } from 'node:crypto'
import { existsSync, readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import path from 'node:path'

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../../..')
const contractPath = path.join(
  repoRoot,
  'Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/QuerySingleSelectObservationAsyncPureModelContract-r001.json'
)
const fixturePath = path.join(
  repoRoot,
  'Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/QuerySingleSelectObservationResolutionFixtures-r004.json'
)
const modulePath = path.join(
  repoRoot,
  'core/core-frontend/src/custom-component/filter-copy/query-single-select-observation-async.ts'
)
let handleInitialEnumResponse: ((input: any) => any) | undefined
let handleVerificationEnumResponse: ((input: any) => any) | undefined
let bundleError: Error | undefined

if (existsSync(modulePath)) {
  try {
    const bundle = await build({
      stdin: {
        contents:
          "export { handleInitialEnumResponse, handleVerificationEnumResponse } from './src/custom-component/filter-copy/query-single-select-observation-async.ts'",
        resolveDir: path.join(repoRoot, 'core/core-frontend')
      },
      bundle: true,
      write: false,
      format: 'cjs',
      platform: 'node'
    })
    const context: any = { module: { exports: {} }, exports: {} }
    vm.runInNewContext(bundle.outputFiles[0].text, context)
    handleInitialEnumResponse = context.module.exports.handleInitialEnumResponse
    handleVerificationEnumResponse = context.module.exports.handleVerificationEnumResponse
  } catch (error) {
    bundleError = error as Error
  }
}

const componentRaw = Object.freeze({ component: 'query-1' })
const conditionRaw = Object.freeze({ condition: 'q1' })
const design = Object.freeze({ defaultValue: 'A', datasetId: 'ds-1' })
const state = () => ({
  identity: {
    documentEpoch: 'doc-1',
    componentRaw,
    conditionRaw,
    designRevision: 1,
    tokenGeneration: 1,
    runtimeGeneration: 2,
    requestId: 2
  },
  selectedValue: 'C',
  validity: 'pending',
  options: ['A', 'B'],
  loading: true,
  design,
  effects: {
    enumRequestsStarted: 1,
    enumResponsesSettled: 0,
    queryRefreshes: 0,
    runtimeWrites: 0
  }
})
const captured = {
  documentEpoch: 'doc-1',
  componentRaw,
  conditionRaw,
  designRevision: 1,
  tokenGeneration: 1,
  runtimeGeneration: 1,
  requestId: 2,
  selectedValue: 'A'
}
const clone = (value: any) => JSON.parse(JSON.stringify(value, (_key, item) => item))
const jsonValue = (value: any) => JSON.parse(JSON.stringify(value))
const deepFreeze = <T>(value: T): T => {
  if (value !== null && typeof value === 'object' && !Object.isFrozen(value)) {
    Object.freeze(value)
    Object.values(value as Record<string, unknown>).forEach(item => deepFreeze(item))
  }
  return value
}

const cases: Array<[string, () => void]> = [
  [
    'first_success_missing_selected_retries_once',
    () => {
      const before = state()
      const result = handleInitialEnumResponse!({
        state: deepFreeze(before),
        captured,
        response: { values: ['A', 'X'], error: null }
      })
      assert.equal(result.applied, true)
      assert.equal(result.state.selectedValue, 'C')
      assert.equal(result.state.validity, 'pending')
      assert.deepEqual(jsonValue(result.state.options), ['A', 'B'])
      assert.equal(result.state.loading, true)
      assert.deepEqual(result.state.design, design)
      assert.deepEqual(jsonValue(result.state.effects), {
        enumRequestsStarted: 2,
        enumResponsesSettled: 1,
        queryRefreshes: 0,
        runtimeWrites: 0
      })
      assert.equal(result.verificationRequest.requestId, 3)
      assert.equal(result.verificationRequest.runtimeGeneration, 2)
      assert.equal(result.verificationRequest.selectedValue, 'C')
      assert.equal(result.verificationRequest.componentRaw, componentRaw)
      assert.deepEqual(before.options, ['A', 'B'])
    }
  ],
  [
    'verification_contains_selected_marks_valid',
    () => {
      const current = state()
      current.identity.requestId = 3
      const verification = { ...captured, runtimeGeneration: 2, requestId: 3, selectedValue: 'C' }
      const result = handleVerificationEnumResponse!({
        state: deepFreeze(current),
        captured: verification,
        response: { values: ['A', 'C', 'X'], error: null }
      })
      assert.equal(result.applied, true)
      assert.equal(result.state.validity, 'valid')
      assert.equal(result.state.selectedValue, 'C')
      assert.deepEqual(jsonValue(result.state.options), ['A', 'C', 'X'])
      assert.equal(result.state.loading, false)
      assert.equal(result.state.effects.enumResponsesSettled, 1)
      assert.equal(result.state.effects.queryRefreshes, 0)
    }
  ],
  [
    'verification_missing_selected_marks_invalid_without_clearing',
    () => {
      const current = state()
      current.identity.requestId = 3
      const result = handleVerificationEnumResponse!({
        state: deepFreeze(current),
        captured: { ...captured, runtimeGeneration: 2, requestId: 3, selectedValue: 'C' },
        response: { values: ['A', 'X'], error: null }
      })
      assert.equal(result.state.validity, 'invalid')
      assert.equal(result.state.selectedValue, 'C')
      assert.deepEqual(jsonValue(result.state.options), ['A', 'X'])
      assert.equal(result.state.loading, false)
    }
  ],
  [
    'verification_failure_preserves_options_and_marks_unverified',
    () => {
      const current = state()
      current.identity.requestId = 3
      const result = handleVerificationEnumResponse!({
        state: deepFreeze(current),
        captured: { ...captured, runtimeGeneration: 2, requestId: 3, selectedValue: 'C' },
        response: { values: null, error: 'network' }
      })
      assert.equal(result.state.validity, 'unverified')
      assert.equal(result.state.selectedValue, 'C')
      assert.deepEqual(jsonValue(result.state.options), ['A', 'B'])
      assert.equal(result.state.loading, false)
      assert.equal(result.state.effects.enumRequestsStarted, 1)
    }
  ],
  [
    'runtime_generation_mismatch_with_same_request_id_is_noop',
    () => {
      const current = state()
      current.selectedValue = 'D'
      current.identity.runtimeGeneration = 3
      current.identity.requestId = 3
      const before = clone(current)
      const result = handleVerificationEnumResponse!({
        state: deepFreeze(current),
        captured: { ...captured, runtimeGeneration: 2, requestId: 3, selectedValue: 'C' },
        response: { values: ['A', 'C', 'X'], error: null }
      })
      assert.equal(result.applied, false)
      assert.deepEqual(result.state, before)
      assert.equal(result.state.loading, true)
    }
  ],
  [
    'stale_request_id_does_not_close_new_loading',
    () => {
      const current = state()
      current.selectedValue = 'D'
      current.identity.runtimeGeneration = 3
      current.identity.requestId = 4
      current.effects.enumRequestsStarted = 3
      const before = clone(current)
      const result = handleVerificationEnumResponse!({
        state: deepFreeze(current),
        captured: { ...captured, runtimeGeneration: 2, requestId: 3, selectedValue: 'C' },
        response: { values: ['A', 'C', 'X'], error: null }
      })
      assert.equal(result.applied, false)
      assert.deepEqual(result.state, before)
      assert.equal(result.state.loading, true)
      assert.equal(result.state.identity.requestId, 4)
    }
  ],
  [
    'raw_identity_uses_reference_equality',
    () => {
      const current = state()
      current.identity.requestId = 3
      const result = handleVerificationEnumResponse!({
        state: current,
        captured: {
          ...captured,
          componentRaw: { component: 'query-1' },
          runtimeGeneration: 2,
          requestId: 3,
          selectedValue: 'C'
        },
        response: { values: ['C'], error: null }
      })
      assert.equal(result.applied, false)
      assert.equal(result.state, current)
    }
  ],
  [
    'settled_verification_cannot_be_applied_twice',
    () => {
      const current = state()
      current.identity.requestId = 3
      current.loading = false
      const result = handleVerificationEnumResponse!({
        state: current,
        captured: { ...captured, runtimeGeneration: 2, requestId: 3, selectedValue: 'C' },
        response: { values: ['A', 'C'], error: null }
      })
      assert.equal(result.applied, false)
      assert.equal(result.state, current)
    }
  ],
  [
    'stale_response_does_not_mutate_input',
    () => {
      const current = deepFreeze(state())
      const before = clone(current)
      handleInitialEnumResponse!({
        state: current,
        captured: { ...captured, componentRaw: { stale: true } },
        response: { values: ['A'], error: null }
      })
      assert.deepEqual(current, before)
    }
  ]
]

let failures = 0
for (const [id, run] of cases) {
  try {
    assert.equal(
      typeof handleInitialEnumResponse,
      'function',
      bundleError
        ? `implementation unavailable: ${bundleError.message}`
        : 'implementation unavailable'
    )
    assert.equal(
      typeof handleVerificationEnumResponse,
      'function',
      'verification handler unavailable'
    )
    run()
    console.log(`PASS ${id}`)
  } catch (error) {
    failures += 1
    console.error(`FAIL ${id}: ${(error as Error).message}`)
  }
}
const sha256 = (value: string) => createHash('sha256').update(value).digest('hex')
const sourceDigest = sha256(existsSync(modulePath) ? readFileSync(modulePath, 'utf8') : '<missing>')
console.log(`SOURCE_SHA256 ${sourceDigest}`)
console.log(`CONTRACT_SHA256 ${sha256(readFileSync(contractPath, 'utf8'))}`)
console.log(`FIXTURE_SHA256 ${sha256(readFileSync(fixturePath, 'utf8'))}`)
console.log(`RUNNER_SHA256 ${sha256(readFileSync(fileURLToPath(import.meta.url), 'utf8'))}`)
console.log(`RESULT ${cases.length - failures}/${cases.length} passed; ${failures} failed`)
assert.equal(failures, 0, 'async query observation cases failed')
