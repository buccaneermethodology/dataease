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
const fixturePath = path.join(featureRoot, 'QueryProductAdapterFixtures-r003.json')
const sourcePath = path.join(
  repoRoot,
  'core/core-frontend/src/custom-component/filter-copy/query-ordinary-select-rebuild.ts'
)
const fixtureText = readFileSync(fixturePath, 'utf8')
const fixture = JSON.parse(fixtureText)
const sourceBefore = existsSync(sourcePath) ? readFileSync(sourcePath, 'utf8') : '<missing>'
const sourceHash = createHash('sha256').update(sourceBefore).digest('hex')
const runnerText = readFileSync(fileURLToPath(import.meta.url), 'utf8')
const runnerHash = createHash('sha256').update(runnerText).digest('hex')
const expectedIds = Array.from(
  { length: 6 },
  (_, index) => `TC-QPAD-REBUILD-${String(index + 1).padStart(3, '0')}`
)

assert.deepEqual(
  fixture.cases.map((item: { id: string }) => item.id),
  expectedIds
)

let rebuildOrdinarySelectConfig: (input: unknown) => unknown
if (existsSync(sourcePath)) {
  const bundle = await build({
    stdin: {
      contents:
        "export { rebuildOrdinarySelectConfig } from './src/custom-component/filter-copy/query-ordinary-select-rebuild.ts'",
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
  rebuildOrdinarySelectConfig = bundledModule.rebuildOrdinarySelectConfig
} else {
  // Keep RED executable when the implementation is absent: oracle assertions fail below.
  rebuildOrdinarySelectConfig = () => ({ ok: false, reason: 'UNIMPLEMENTED' })
}

const clone = <T>(value: T): T => JSON.parse(JSON.stringify(value)) as T
const deepFreeze = <T>(value: T): T => {
  if (value && typeof value === 'object' && !Object.isFrozen(value)) {
    Object.freeze(value)
    Object.values(value as Record<string, unknown>).forEach(deepFreeze)
  }
  return value
}
const setPath = (root: Record<string, any>, pathValue: string, value: unknown) => {
  const parts = pathValue.replace(/\[(\d+)\]/g, '.$1').split('.')
  const key = parts.pop() as string
  const parent = parts.reduce((current, part) => current[part], root)
  parent[key] = value
}
const resolveInput = (item: any) => {
  const base = clone(
    item.input || fixture.cases.find((candidate: any) => candidate.id === item.base).input
  )
  for (const [pathValue, value] of Object.entries(item.patch || {})) {
    setPath(base, pathValue, value)
  }
  return base
}
const asJson = (value: unknown) => JSON.parse(JSON.stringify(value))

let failures = 0
for (const item of fixture.cases) {
  try {
    const input = resolveInput(item)
    const before = clone(input)
    const result = rebuildOrdinarySelectConfig(input)
    assert.deepEqual(asJson(result), item.expected, item.id)
    assert.deepEqual(input, before, `${item.id}: input must remain unchanged`)
    if (item.expected.ok) {
      const value = (result as { value: { propValue: unknown[]; cascade: unknown[][] } }).value
      assert.notEqual(value.propValue, input.source.propValue, `${item.id}: propValue detached`)
      assert.notEqual(value.cascade, input.source.cascade, `${item.id}: cascade detached`)
    }
    console.log(`PASS ${item.id}`)
  } catch (error) {
    failures += 1
    console.error(`FAIL ${item.id}: ${(error as Error).message}`)
  }
}

const defense = (name: string, action: () => void) => {
  try {
    action()
    console.log(`PASS DEFENSE ${name}`)
  } catch (error) {
    failures += 1
    console.error(`FAIL DEFENSE ${name}: ${(error as Error).message}`)
  }
}

defense('deep-frozen-input-plan-and-target', () => {
  const input = deepFreeze(clone(fixture.input))
  const original = clone(input)
  const result = rebuildOrdinarySelectConfig(input) as any
  assert.equal(result.ok, true)
  assert.deepEqual(input, original)
  result.value.propValue[0].field.id = 'mutated'
  assert.equal(input.source.propValue[0].field.id, 'province')
})

defense('reject-reused-source-condition-id', () => {
  const input = clone(fixture.input)
  input.referencePlan.conditions[0].id = input.source.propValue[0].id
  assert.deepEqual(asJson(rebuildOrdinarySelectConfig(input)), {
    ok: false,
    reason: 'PLAN_MISMATCH'
  })
})

defense('reject-node-condition-misbinding', () => {
  const input = clone(fixture.input)
  input.referencePlan.chains[0][0].conditionId = input.referencePlan.conditions[1].id
  assert.deepEqual(asJson(rebuildOrdinarySelectConfig(input)), {
    ok: false,
    reason: 'PLAN_MISMATCH'
  })
})

defense('reject-same-target-field-conflict', () => {
  const input = clone(fixture.input)
  input.source.propValue[0].checkedFields = ['chart-A', 'chart-B']
  input.source.propValue[0].checkedFieldsMap = { 'chart-A': 'province', 'chart-B': 'city' }
  input.referencePlan.conditions[0].targetRefs.push({
    componentId: 'chart-B',
    datasetId: '201',
    fieldId: 'city'
  })
  assert.deepEqual(asJson(rebuildOrdinarySelectConfig(input)), {
    ok: false,
    reason: 'PLAN_MISMATCH'
  })
})

defense('reject-non-json-input', () => {
  const input: any = clone(fixture.input)
  input.source.propValue[0].nonFinite = Number.POSITIVE_INFINITY
  assert.deepEqual(asJson(rebuildOrdinarySelectConfig(input)), {
    ok: false,
    reason: 'INVALID_INPUT'
  })
  const cyclic: any = clone(fixture.input)
  cyclic.loop = cyclic
  assert.deepEqual(asJson(rebuildOrdinarySelectConfig(cyclic)), {
    ok: false,
    reason: 'INVALID_INPUT'
  })
})

defense('error-priority-invalid-before-unsupported-field', () => {
  const input: any = clone(fixture.input)
  input.source.propValue[0].unknown = true
  input.source.propValue[0].id = ''
  assert.deepEqual(asJson(rebuildOrdinarySelectConfig(input)), {
    ok: false,
    reason: 'INVALID_INPUT'
  })
})

defense('reject-impossible-calendar-date', () => {
  const input = clone(fixture.input)
  input.source.propValue[0].arbitraryTime = '2026-02-30T00:00:00.000Z'
  assert.deepEqual(asJson(rebuildOrdinarySelectConfig(input)), {
    ok: false,
    reason: 'UNSUPPORTED_SHAPE'
  })
})

defense('accept-valid-leap-day', () => {
  const input = clone(fixture.input)
  input.source.propValue[0].arbitraryTime = '2024-02-29T00:00:00.000Z'
  input.source.propValue[0].arbitraryTimeRange = '2024-02-29T00:00:00.000Z'
  const result = rebuildOrdinarySelectConfig(input) as any
  assert.equal(result.ok, true)
  assert.equal(result.value.propValue[0].arbitraryTime, '2024-02-29T00:00:00.000Z')
})

console.log(`SOURCE_SHA256 ${sourceHash}`)
console.log(`FIXTURE_SHA256 ${createHash('sha256').update(fixtureText).digest('hex')}`)
console.log(`RUNNER_SHA256 ${runnerHash}`)
console.log(
  `RESULT ${fixture.cases.length + 8 - failures}/${
    fixture.cases.length + 8
  } passed; ${failures} failed`
)
assert.equal(failures, 0, 'ordinary select rebuild cases failed')
