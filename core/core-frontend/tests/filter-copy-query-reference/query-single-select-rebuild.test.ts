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
const fixturePath = path.join(featureRoot, 'QuerySingleSelectRebuildFixtures-r001.json')
const sourcePath = path.join(
  repoRoot,
  'core/core-frontend/src/custom-component/filter-copy/query-single-select-rebuild.ts'
)
const fixtureText = readFileSync(fixturePath, 'utf8')
const fixture = JSON.parse(fixtureText)
const sourceBefore = existsSync(sourcePath) ? readFileSync(sourcePath, 'utf8') : '<missing>'
const sourceHash = createHash('sha256').update(sourceBefore).digest('hex')
const runnerHash = createHash('sha256')
  .update(readFileSync(fileURLToPath(import.meta.url)))
  .digest('hex')
const expectedIds = Array.from(
  { length: 10 },
  (_, index) => `TC-QSINGLE-REBUILD-${String(index + 1).padStart(3, '0')}`
)

assert.deepEqual(
  fixture.cases.map((item: { id: string }) => item.id),
  expectedIds
)

let rebuildSingleSelectConfig: (input: unknown) => any
if (existsSync(sourcePath)) {
  const bundle = await build({
    stdin: {
      contents:
        "export { rebuildSingleSelectConfig } from './src/custom-component/filter-copy/query-single-select-rebuild.ts'",
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
  rebuildSingleSelectConfig = bundledModule.rebuildSingleSelectConfig
} else {
  // Keep RED executable without source so failures occur against the frozen oracle assertions.
  rebuildSingleSelectConfig = () => ({ ok: false, reason: 'UNIMPLEMENTED' })
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
const assertNoSharedObjects = (input: unknown, output: unknown) => {
  const inputObjects = collectObjects(input)
  for (const object of collectObjects(output)) {
    assert.equal(inputObjects.has(object), false, 'output must not share nested object references')
  }
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
    const result = rebuildSingleSelectConfig(input)
    assert.deepEqual(asJson(result), item.expected, item.id)
    assert.deepEqual(input, before, `${item.id}: input must remain unchanged`)
    if (item.expected.ok) {
      assertNoSharedObjects(input, result.value)
      for (const condition of result.value.propValue) {
        assert.equal(
          Object.hasOwn(condition, 'selectValue'),
          false,
          `${item.id}: selectValue own-key`
        )
        assert.equal(
          Object.hasOwn(condition, 'defaultValue'),
          false,
          `${item.id}: defaultValue own-key`
        )
      }
    }
  })
}

check('deep-freeze-and-output-detachment', () => {
  const input = deepFreeze(clone(fixture.cases[0].input))
  const before = clone(input)
  const result = rebuildSingleSelectConfig(input)
  assert.equal(result.ok, true)
  assert.deepEqual(input, before)
  assertNoSharedObjects(input, result.value)
  result.value.propValue[0].field.id = 'changed'
  assert.equal(input.source.propValue[0].field.id, 'province')
})

check('single-select-empty-string-is-preserved-as-input-only', () => {
  const input = clone(fixture.cases[0].input)
  input.source.propValue[0].selectValue = ''
  const result = rebuildSingleSelectConfig(input)
  assert.equal(result.ok, true)
  assert.equal(Object.hasOwn(result.value.propValue[0], 'selectValue'), false)
  assert.equal(input.source.propValue[0].selectValue, '')
})

check('reject-non-json-values', () => {
  const inputs: any[] = []
  const explicitUndefined: any = clone(fixture.cases[0].input)
  explicitUndefined.extra = undefined
  inputs.push(explicitUndefined)
  const dateInput: any = clone(fixture.cases[0].input)
  dateInput.date = new Date('2024-01-01T00:00:00.000Z')
  inputs.push(dateInput)
  const cyclic: any = clone(fixture.cases[0].input)
  cyclic.self = cyclic
  inputs.push(cyclic)
  const functionInput: any = clone(fixture.cases[0].input)
  functionInput.callable = () => undefined
  inputs.push(functionInput)
  const nonFinite: any = clone(fixture.cases[0].input)
  nonFinite.number = Number.POSITIVE_INFINITY
  inputs.push(nonFinite)
  for (const input of inputs) {
    assert.deepEqual(asJson(rebuildSingleSelectConfig(input)), {
      ok: false,
      reason: 'INVALID_INPUT'
    })
  }
})

check('global-error-priority', () => {
  const input: any = clone(fixture.cases[0].input)
  input.source.propValue[0].unknownReference = true
  input.source.propValue[0].multiple = true
  assert.deepEqual(asJson(rebuildSingleSelectConfig(input)), {
    ok: false,
    reason: 'UNSUPPORTED_FIELD'
  })
  input.source.propValue[0].id = ''
  assert.deepEqual(asJson(rebuildSingleSelectConfig(input)), {
    ok: false,
    reason: 'INVALID_INPUT'
  })
})

check('successful-output-json-round-trip', () => {
  const input = clone(fixture.cases[0].input)
  const result = rebuildSingleSelectConfig(input)
  assert.equal(result.ok, true)
  assert.deepEqual(JSON.parse(JSON.stringify(result.value)), result.value)
})

console.log(`SOURCE_SHA256 ${sourceHash}`)
console.log(`FIXTURE_SHA256 ${createHash('sha256').update(fixtureText).digest('hex')}`)
console.log(`RUNNER_SHA256 ${runnerHash}`)
console.log(`RESULT ${checks - failures}/${checks} passed; ${failures} failed`)
assert.equal(failures, 0, 'single-select rebuild assertions failed')
