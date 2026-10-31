import assert from 'node:assert/strict'
import { build } from 'esbuild'
import { createHash } from 'node:crypto'
import { existsSync, readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import path from 'node:path'

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../../..')
const featureRoot = path.join(
  repoRoot,
  'Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01'
)
const contractPath = path.join(featureRoot, 'QueryTextSingleSelectManual2PureContract-r001.md')
const casesPath = path.join(featureRoot, 'QueryTextSingleSelectManual2PureCases-r001.json')
const sourcePath = path.join(
  repoRoot,
  'core/core-frontend/src/custom-component/filter-copy/query-single-select-manual2-pure.ts'
)
const expectedContractSha256 = '4b930a4461fa5e91de1d57bf77b21d496705f1d909a4c22991c293976b214863'
const expectedCasesSha256 = '5497a5b8fff2761b52b0035ba7a4f9c531cfdceb3e23be622f89294c89e729a1'
const expectedCaseIds = Array.from(
  { length: 28 },
  (_, index) => `M2P-${String(index + 1).padStart(3, '0')}`
)
const sha256 = (text: string) => createHash('sha256').update(text).digest('hex')
const contractText = readFileSync(contractPath, 'utf8')
const casesText = readFileSync(casesPath, 'utf8')
const sourceExists = existsSync(sourcePath)
const sourceFingerprint = sourceExists
  ? sha256(readFileSync(sourcePath, 'utf8'))
  : sha256('<missing>')
const cases = JSON.parse(casesText)

const contractValid =
  sha256(contractText) === expectedContractSha256 &&
  sha256(casesText) === expectedCasesSha256 &&
  cases.schema_version === 'manual2_pure_value_contract_cases_candidate_v1' &&
  cases.api?.name === 'prepareManual2ValueState' &&
  cases.api?.arity === 1 &&
  cases.api?.success_status === 'OK' &&
  cases.api?.only_rejection_status === 'REJECTED' &&
  cases.cases?.length === 28 &&
  new Set(cases.cases.map((item: any) => item.case_id)).size === 28 &&
  cases.cases.every((item: any, index: number) => item.case_id === expectedCaseIds[index]) &&
  cases.cases.every((item: any) => item.execution_status === 'NOT_RUN' && item.result === null)

console.log(`contract_valid=${contractValid}`)
if (!contractValid) {
  console.error('EXECUTION_ERROR frozen contract/cases digest or structure mismatch')
  console.log(JSON.stringify({ execution_ok: false, execution_errors: ['contract_invalid'] }))
  process.exit(2)
}

let prepareManual2ValueState: (input: unknown) => any
const executionErrors: string[] = []
if (process.env.MANUAL2_PURE_FORCE_UNIMPLEMENTED === '1' || !sourceExists) {
  prepareManual2ValueState = () => ({ status: 'UNIMPLEMENTED', carrier: null, runtime: null })
} else {
  try {
    const bundle = await build({
      stdin: {
        contents:
          "export { prepareManual2ValueState } from './src/custom-component/filter-copy/query-single-select-manual2-pure.ts'",
        resolveDir: path.join(repoRoot, 'core/core-frontend')
      },
      bundle: true,
      write: false,
      format: 'esm',
      platform: 'node'
    })
    const bundledModule = await import(
      `data:text/javascript;base64,${Buffer.from(bundle.outputFiles[0].text).toString('base64')}`
    )
    if (typeof bundledModule.prepareManual2ValueState !== 'function') {
      throw new Error('prepareManual2ValueState export is missing')
    }
    prepareManual2ValueState = bundledModule.prepareManual2ValueState
  } catch (error) {
    executionErrors.push((error as Error).message)
    prepareManual2ValueState = () => ({ status: 'UNIMPLEMENTED', carrier: null, runtime: null })
  }
}

const toOracleJson = (value: unknown): unknown => {
  if (value === undefined) return { $js: 'undefined' }
  if (Array.isArray(value)) {
    return Array.from({ length: value.length }, (_, index) => toOracleJson(value[index]))
  }
  if (value && typeof value === 'object') {
    return Object.fromEntries(
      Object.entries(value as Record<string, unknown>).map(([key, item]) => [
        key,
        toOracleJson(item)
      ])
    )
  }
  return value
}
const fromFixtureJson = (value: any): any => {
  if (Array.isArray(value)) return value.map(fromFixtureJson)
  if (value && typeof value === 'object') {
    const keys = Object.keys(value)
    if (keys.length === 1 && keys[0] === '$js' && value.$js === 'undefined') return undefined
    return Object.fromEntries(keys.map(key => [key, fromFixtureJson(value[key])]))
  }
  return value
}
const collectObjects = (value: unknown, output = new Set<object>()): Set<object> => {
  if (value && typeof value === 'object' && !output.has(value)) {
    output.add(value)
    for (const child of Object.values(value as Record<string, unknown>)) {
      collectObjects(child, output)
    }
  }
  return output
}
const assertDetached = (input: unknown, output: unknown) => {
  const inputObjects = collectObjects(input)
  for (const object of collectObjects(output)) {
    assert.equal(
      inputObjects.has(object),
      false,
      'output must not share mutable objects with input'
    )
  }
}

let behaviorChecks = 0
let behaviorFailures = 0
const check = (name: string, action: () => void) => {
  behaviorChecks += 1
  try {
    action()
    console.log(`PASS ${name}`)
  } catch (error) {
    behaviorFailures += 1
    console.error(`BEHAVIOR_FAILURE ${name}: ${(error as Error).message}`)
  }
}

const successFixture = cases.cases.find((item: any) => item.expected.status === 'OK')
const disabledDefaultFixture = cases.cases.find(
  (item: any) => item.input.defaultValueCheck === false && item.expected.status === 'OK'
)

for (const item of cases.cases) {
  check(item.case_id, () => {
    const input = fromFixtureJson(item.input)
    const before = structuredClone(input)
    const result = prepareManual2ValueState(input)
    assert.deepEqual(toOracleJson(result), item.expected, item.case_id)
    assert.deepEqual(input, before, `${item.case_id}: input must remain unchanged`)
    if (item.expected.status === 'OK') assertDetached(input, result)
    else assert.deepEqual(result, { status: 'REJECTED', carrier: null, runtime: null })
  })
}

check('detached-carrier-runtime-and-cross-call-mutation-isolation', () => {
  assert.ok(successFixture, 'frozen successful case is required')
  const input = fromFixtureJson(successFixture.input)
  const before = structuredClone(input)
  const first = prepareManual2ValueState(input)
  const second = prepareManual2ValueState(input)
  assert.equal(first.status, 'OK')
  assert.equal(second.status, 'OK')
  assertDetached(input, first)
  assertDetached(input, second)
  assert.notEqual(first.carrier.design.valueSource, first.runtime.mapValue)
  assert.notEqual(second.carrier.design.valueSource, second.runtime.mapValue)
  const firstObjects = collectObjects(first)
  for (const object of collectObjects(second)) {
    assert.equal(firstObjects.has(object), false, 'calls must not share mutable output objects')
  }
  first.carrier.design.valueSource.push('MUTATION')
  first.runtime.mapValue.push('MUTATION')
  assert.deepEqual(
    second.carrier.design.valueSource,
    successFixture.expected.carrier.design.valueSource
  )
  assert.deepEqual(second.runtime.mapValue, successFixture.expected.runtime.mapValue)
  assert.deepEqual(input, before, 'mutating one result must not change the source input')
})

check('rejected-result-across-call-mutation-isolation', () => {
  const rejectedFixture = cases.cases.find((item: any) => item.expected.status === 'REJECTED')
  assert.ok(rejectedFixture, 'frozen rejected case is required')
  const input = fromFixtureJson(rejectedFixture.input)
  const first = prepareManual2ValueState(input)
  const second = prepareManual2ValueState(input)
  assert.deepEqual(first, { status: 'REJECTED', carrier: null, runtime: null })
  assert.deepEqual(second, { status: 'REJECTED', carrier: null, runtime: null })
  assert.notEqual(first, second, 'rejected calls must return distinct result objects')
  Object.assign(first, { status: 'MUTATED' })
  assert.deepEqual(second, { status: 'REJECTED', carrier: null, runtime: null })
})

check('P2-own-defaultValue-undefined-is-treated-as-absent', () => {
  assert.ok(disabledDefaultFixture, 'frozen case with default off is required')
  const input = structuredClone(disabledDefaultFixture.input)
  Object.defineProperty(input, 'defaultValue', {
    configurable: true,
    enumerable: true,
    writable: true,
    value: undefined
  })
  const result = prepareManual2ValueState(input)
  assert.equal(result.status, 'OK')
  assert.equal(Object.hasOwn(result.carrier.design, 'defaultValue'), false)
  assert.deepEqual(toOracleJson(result), disabledDefaultFixture.expected)
})

check('P2-mapValue-sparse-hole-is-rejected', () => {
  assert.ok(successFixture, 'frozen successful case is required')
  const input = structuredClone(successFixture.input)
  input.mapValue = new Array(1)
  assert.deepEqual(prepareManual2ValueState(input), {
    status: 'REJECTED',
    carrier: null,
    runtime: null
  })
})

check('P2-array-extra-own-property-symbol-and-accessor-are-rejected-without-getter-call', () => {
  assert.ok(successFixture, 'frozen successful case is required')
  const withExtraProperty = structuredClone(successFixture.input)
  Object.defineProperty(withExtraProperty.valueSource, 'extra', {
    configurable: true,
    enumerable: false,
    value: 'unexpected'
  })
  const withSymbol = structuredClone(successFixture.input)
  Object.defineProperty(withSymbol.valueSource, Symbol('unexpected'), { value: 'unexpected' })
  const withAccessor = structuredClone(successFixture.input)
  let getterCalls = 0
  Object.defineProperty(withAccessor.valueSource, '0', {
    configurable: true,
    enumerable: true,
    get() {
      getterCalls += 1
      return 'A'
    }
  })
  for (const input of [withExtraProperty, withSymbol, withAccessor]) {
    assert.deepEqual(prepareManual2ValueState(input), {
      status: 'REJECTED',
      carrier: null,
      runtime: null
    })
  }
  assert.equal(getterCalls, 0, 'array accessor getter must never execute')
})

console.log(
  JSON.stringify({
    suite: 'MANUAL2-PURE-HELPER',
    contract_valid: true,
    execution_ok: executionErrors.length === 0,
    execution_errors: executionErrors,
    source: {
      path: path.relative(repoRoot, sourcePath),
      exists: sourceExists,
      fingerprint: sourceFingerprint,
      status: sourceExists && executionErrors.length === 0 ? 'LOADED' : 'UNIMPLEMENTED'
    },
    frozen_case_ids: expectedCaseIds,
    p2_checks: [
      'own_defaultValue_undefined',
      'mapValue_sparse_hole',
      'array_extra_descriptor_symbol_accessor_getter_count_zero'
    ],
    behavior_checks: behaviorChecks,
    behavior_failures: behaviorFailures
  })
)
if (executionErrors.length > 0) process.exitCode = 2
else if (behaviorFailures > 0) process.exitCode = 1
