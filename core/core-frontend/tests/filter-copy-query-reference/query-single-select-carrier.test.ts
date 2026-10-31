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
const fixturePath = path.join(featureRoot, 'QuerySingleSelectCarrierFixtures-r001.json')
const sourcePath = path.join(
  repoRoot,
  'core/core-frontend/src/custom-component/filter-copy/query-single-select-carrier.ts'
)
const fixtureText = readFileSync(fixturePath, 'utf8')
const fixture = JSON.parse(fixtureText)
const sourceBefore = existsSync(sourcePath) ? readFileSync(sourcePath, 'utf8') : '<missing>'
const sourceHash = createHash('sha256').update(sourceBefore).digest('hex')
const runnerSha256 = createHash('sha256')
  .update(readFileSync(fileURLToPath(import.meta.url)))
  .digest('hex')
const expectedIds = Array.from(
  { length: 14 },
  (_, index) => `TC-QCARRIER-${String(index + 1).padStart(3, '0')}`
)

assert.deepEqual(
  fixture.cases.map((item: { id: string }) => item.id),
  expectedIds
)

let prepareQuerySingleSelectCarrier: (input: unknown) => any
if (process.env.QCARRIER_FORCE_UNIMPLEMENTED === '1') {
  prepareQuerySingleSelectCarrier = () => ({ ok: false, reason: 'UNIMPLEMENTED' })
} else if (existsSync(sourcePath)) {
  const bundle = await build({
    stdin: {
      contents:
        "export { prepareQuerySingleSelectCarrier } from './src/custom-component/filter-copy/query-single-select-carrier.ts'",
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
  prepareQuerySingleSelectCarrier = bundledModule.prepareQuerySingleSelectCarrier
} else {
  prepareQuerySingleSelectCarrier = () => ({ ok: false, reason: 'UNIMPLEMENTED' })
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
    const result = prepareQuerySingleSelectCarrier(input)
    assert.deepEqual(asJson(result), item.expected, item.id)
    assert.deepEqual(input, before, `${item.id}: input must remain unchanged`)
  })
}

check('accessors-are-rejected-without-invocation', () => {
  let getterCalls = 0
  const input = clone(fixture.cases[0].input)
  Object.defineProperty(input.propValue[0], 'selectValue', {
    enumerable: true,
    get() {
      getterCalls += 1
      return 'B'
    }
  })
  assert.deepEqual(prepareQuerySingleSelectCarrier(input), { ok: false, reason: 'INVALID_INPUT' })
  assert.equal(getterCalls, 0)
})

check('non-json-and-cyclic-inputs-are-rejected', () => {
  const invalidValues: unknown[] = [
    undefined,
    Number.NaN,
    Number.POSITIVE_INFINITY,
    new Date(),
    () => 1,
    Symbol('x')
  ]
  const cyclic: Record<string, unknown> = {}
  cyclic.self = cyclic
  invalidValues.push(cyclic)
  for (const value of invalidValues) {
    assert.deepEqual(prepareQuerySingleSelectCarrier(value), { ok: false, reason: 'INVALID_INPUT' })
  }
})

check('missing-field-precedes-shape-error', () => {
  const input = clone(fixture.cases[0].input)
  delete input.propValue[0].displayId
  input.propValue[0].multiple = true
  assert.deepEqual(prepareQuerySingleSelectCarrier(input), {
    ok: false,
    reason: 'UNSUPPORTED_FIELD'
  })
})

check('checked-default-without-default-value-is-unsupported-field', () => {
  const input = clone(fixture.cases[0].input)
  input.propValue[0].defaultValueCheck = true
  delete input.propValue[0].defaultValue
  assert.deepEqual(prepareQuerySingleSelectCarrier(input), {
    ok: false,
    reason: 'UNSUPPORTED_FIELD'
  })
})

check('alias-input-is-accepted-and-all-output-is-detached', () => {
  const input = clone(fixture.cases[0].input)
  input.propValue[0].mapValue = input.propValue[0].defaultMapValue
  const before = clone(input)
  const result = prepareQuerySingleSelectCarrier(input)
  assert.equal(result.ok, true)
  if (!result.ok) return
  assert.deepEqual(input, before)
  const inputObjects = collectObjects(input)
  const designObjects = collectObjects(result.value.design)
  const runtimeObjects = collectObjects(result.value.runtime)
  assert.equal(
    Array.from(designObjects).some(value => runtimeObjects.has(value)),
    false
  )
  assert.equal(
    Array.from(designObjects).some(value => inputObjects.has(value)),
    false
  )
  assert.equal(
    Array.from(runtimeObjects).some(value => inputObjects.has(value)),
    false
  )
})

check('runtime-only-source-changes-do-not-change-carriers', () => {
  const firstInput = clone(fixture.cases[0].input)
  const secondInput = clone(firstInput)
  secondInput.propValue[0].selectValue = 'Z'
  secondInput.propValue[0].mapValue = ['Z-code']
  assert.deepEqual(
    prepareQuerySingleSelectCarrier(firstInput),
    prepareQuerySingleSelectCarrier(secondInput)
  )
})

check('no-default-runtime-keeps-select-absent-and-map-empty', () => {
  const input = clone(fixture.cases[1].input)
  const result = prepareQuerySingleSelectCarrier(input)
  assert.equal(result.ok, true)
  if (!result.ok) return
  assert.equal(Object.hasOwn(result.value.design.propValue[0], 'selectValue'), false)
  assert.equal(Object.hasOwn(result.value.runtime.propValue[0], 'selectValue'), false)
  assert.deepEqual(result.value.runtime.propValue[0].mapValue, [])
})

check('deep-frozen-input-and-json-round-trip', () => {
  const input = deepFreeze(clone(fixture.cases[0].input))
  const before = clone(input)
  const result = prepareQuerySingleSelectCarrier(input)
  assert.equal(result.ok, true)
  assert.deepEqual(input, before)
  assert.deepEqual(asJson(result), result)
})

console.log(
  JSON.stringify({
    suite: 'QCARRIER-001',
    fixtureSha256: createHash('sha256').update(fixtureText).digest('hex'),
    runnerSha256,
    sourceSha256: sourceHash,
    checks,
    failures,
    result: failures === 0 ? 'PASS' : 'FAIL'
  })
)
if (failures > 0) process.exitCode = 1
