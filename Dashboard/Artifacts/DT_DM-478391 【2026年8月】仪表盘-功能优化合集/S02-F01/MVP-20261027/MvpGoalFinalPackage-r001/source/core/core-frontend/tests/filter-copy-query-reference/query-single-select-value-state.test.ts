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
const fixturePath = path.join(featureRoot, 'QuerySingleSelectValueStateFixtures-r001.json')
const sourcePath = path.join(
  repoRoot,
  'core/core-frontend/src/custom-component/filter-copy/query-single-select-value-state.ts'
)
const fixtureText = readFileSync(fixturePath, 'utf8')
const fixture = JSON.parse(fixtureText)
const sourceBefore = existsSync(sourcePath) ? readFileSync(sourcePath, 'utf8') : '<missing>'
const sourceHash = createHash('sha256').update(sourceBefore).digest('hex')
const runnerSha256 = createHash('sha256')
  .update(readFileSync(fileURLToPath(import.meta.url)))
  .digest('hex')
const expectedIds = Array.from(
  { length: 10 },
  (_, index) => `TC-QVALUE-${String(index + 1).padStart(3, '0')}`
)

assert.deepEqual(
  fixture.cases.map((item: { id: string }) => item.id),
  expectedIds
)

let prepareSingleSelectValueState: (input: unknown) => any
if (process.env.QVALUE_FORCE_UNIMPLEMENTED === '1') {
  prepareSingleSelectValueState = () => ({ ok: false, reason: 'UNIMPLEMENTED' })
} else if (existsSync(sourcePath)) {
  const bundle = await build({
    stdin: {
      contents:
        "export { prepareSingleSelectValueState } from './src/custom-component/filter-copy/query-single-select-value-state.ts'",
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
  prepareSingleSelectValueState = bundledModule.prepareSingleSelectValueState
} else {
  prepareSingleSelectValueState = () => ({ ok: false, reason: 'UNIMPLEMENTED' })
}

const clone = <T>(value: T): T => JSON.parse(JSON.stringify(value)) as T
const asJson = (value: unknown) => JSON.parse(JSON.stringify(value))
const deepFreeze = <T>(value: T): T => {
  if (value && typeof value === 'object' && !Object.isFrozen(value)) {
    Object.freeze(value)
    Object.values(value as Record<string, unknown>).forEach(deepFreeze)
  }
  return value
}
const collectObjects = (value: unknown, output = new Set<object>()) => {
  if (value && typeof value === 'object' && !output.has(value)) {
    output.add(value)
    Object.values(value as Record<string, unknown>).forEach(child => collectObjects(child, output))
  }
  return output
}

let checks = 0
let failures = 0
const check = (name: string, action: () => void) => {
  checks += 1
  try {
    action()
    console.log(`PASS ${name}`)
  } catch (error) {
    failures += 1
    console.error(`FAIL ${name}: ${(error as Error).message}`)
  }
}

for (const item of fixture.cases) {
  check(item.id, () => {
    const input = clone(item.input)
    const before = clone(input)
    const result = prepareSingleSelectValueState(input)
    assert.deepEqual(asJson(result), item.expected, item.id)
    assert.deepEqual(input, before, `${item.id}: input must remain unchanged`)
  })
}

check('accessors-are-rejected-without-invocation', () => {
  let getterCalls = 0
  const input = { ...fixture.cases[0].input }
  Object.defineProperty(input, 'selectValue', {
    enumerable: true,
    get() {
      getterCalls += 1
      return 'B'
    }
  })
  assert.deepEqual(prepareSingleSelectValueState(input), { ok: false, reason: 'INVALID_INPUT' })
  assert.equal(getterCalls, 0)
})

check('non-json-values-are-rejected', () => {
  const invalidValues: unknown[] = [
    undefined,
    Number.NaN,
    Number.POSITIVE_INFINITY,
    new Date('2026-01-01T00:00:00.000Z'),
    () => 'not-json',
    Symbol('not-json')
  ]
  const cyclic: Record<string, unknown> = {}
  cyclic.self = cyclic
  invalidValues.push(cyclic)
  for (const value of invalidValues) {
    assert.deepEqual(prepareSingleSelectValueState(value), { ok: false, reason: 'INVALID_INPUT' })
  }
})

check('missing-key-precedes-shape-error', () => {
  const input = clone(fixture.cases[0].input)
  delete input.selectValue
  input.multiple = true
  assert.deepEqual(prepareSingleSelectValueState(input), {
    ok: false,
    reason: 'UNSUPPORTED_FIELD'
  })
})

check('extra-key-precedes-shape-error', () => {
  const input = { ...clone(fixture.cases[0].input), extra: true, multiple: true }
  assert.deepEqual(prepareSingleSelectValueState(input), {
    ok: false,
    reason: 'UNSUPPORTED_FIELD'
  })
})

check('empty-string-is-not-a-valid-single-value', () => {
  const input = { ...clone(fixture.cases[0].input), defaultValue: '' }
  assert.deepEqual(prepareSingleSelectValueState(input), {
    ok: false,
    reason: 'UNSUPPORTED_SHAPE'
  })
})

check('deep-freeze-input-and-detach-all-arrays', () => {
  const input = deepFreeze(clone(fixture.cases[0].input))
  const before = clone(input)
  const result = prepareSingleSelectValueState(input)
  assert.equal(result.ok, true)
  assert.deepEqual(input, before)
  const { design, runtime } = result.value
  assert.equal(Object.hasOwn(design, 'selectValue'), false)
  assert.equal(Object.hasOwn(design, 'mapValue'), false)
  assert.notEqual(design.defaultMapValue, input.defaultMapValue)
  assert.notEqual(runtime.defaultMapValue, design.defaultMapValue)
  assert.notEqual(runtime.mapValue, runtime.defaultMapValue)
  assert.notEqual(runtime.mapValue, input.mapValue)
  runtime.mapValue[0] = 'changed'
  assert.equal(runtime.defaultMapValue[0], 'A-code')
  assert.equal(design.defaultMapValue[0], 'A-code')
  assert.equal(input.mapValue[0], 'B-code')
})

check('shared-json-references-are-accepted-and-detached', () => {
  const input = clone(fixture.cases[0].input)
  const sharedMap = ['A-code']
  input.defaultMapValue = sharedMap
  input.mapValue = sharedMap
  const result = prepareSingleSelectValueState(input)
  assert.equal(result.ok, true)
  if (!result.ok) return
  assert.notEqual(result.value.design.defaultMapValue, sharedMap)
  assert.notEqual(result.value.runtime.defaultMapValue, sharedMap)
  assert.notEqual(result.value.runtime.mapValue, sharedMap)
  assert.notEqual(result.value.runtime.defaultMapValue, result.value.runtime.mapValue)
  assert.deepEqual(JSON.parse(JSON.stringify(result)), result)
})

check('deterministic-and-json-round-trip', () => {
  const input = clone(fixture.cases[0].input)
  const first = prepareSingleSelectValueState(input)
  const second = prepareSingleSelectValueState(input)
  assert.deepEqual(first, second)
  assert.deepEqual(JSON.parse(JSON.stringify(first)), first)
})

console.log(
  JSON.stringify({
    suite: 'QVALUE-001',
    fixtureSha256: createHash('sha256').update(fixtureText).digest('hex'),
    runnerSha256,
    sourceSha256: sourceHash,
    checks,
    failures,
    result: failures === 0 ? 'PASS' : 'FAIL'
  })
)
if (failures > 0) process.exitCode = 1
