import assert from 'node:assert/strict'
import { build } from 'esbuild'
import { createHash } from 'node:crypto'
import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import path from 'node:path'

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../../..')
const featureRoot = path.join(
  repoRoot,
  'Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01'
)
const fixturePath = path.join(featureRoot, 'QueryProductRebuildFixtures-r008.json')
const sourcePath = path.join(
  repoRoot,
  'core/core-frontend/src/custom-component/filter-copy/query-single-select-target-rebuild.ts'
)
const fixture = JSON.parse(readFileSync(fixturePath, 'utf8'))
const sourceText = readFileSync(sourcePath, 'utf8')
const sourceSha256 = createHash('sha256').update(sourceText).digest('hex')
const expectedIds = Array.from(
  { length: 16 },
  (_, index) => `TC-QTARGET-REBUILD-${String(index + 1).padStart(3, '0')}`
)
assert.deepEqual(
  fixture.cases.map((item: { id: string }) => item.id),
  expectedIds
)

const bundle = await build({
  stdin: {
    contents:
      "export { rebuildSingleSelectTarget } from './src/custom-component/filter-copy/query-single-select-target-rebuild.ts'",
    resolveDir: path.join(repoRoot, 'core/core-frontend')
  },
  bundle: true,
  write: false,
  format: 'esm',
  platform: 'node'
})
const module = await import(
  `data:text/javascript;base64,${Buffer.from(bundle.outputFiles[0].text).toString('base64')}`
)
const rebuild = module.rebuildSingleSelectTarget as (input: unknown) => unknown
const clone = <T>(value: T): T => JSON.parse(JSON.stringify(value)) as T
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
for (const item of fixture.cases) {
  const input = clone(item.input)
  const before = clone(input)
  const result = rebuild(input)
  assert.deepEqual(result, item.expected, item.id)
  assert.deepEqual(input, before, `${item.id}: input unchanged`)
  if (item.expected.ok === false) assert.equal('value' in (result as object), false)
  checks += 1
}

const successInput = clone(fixture.cases[0].input)
deepFreeze(successInput)
const success = rebuild(successInput) as {
  ok: boolean
  value?: { design: unknown; runtime: unknown }
}
assert.equal(success.ok, true)
if (success.value) {
  const inputObjects = collectObjects(successInput)
  const designObjects = collectObjects(success.value.design)
  const runtimeObjects = collectObjects(success.value.runtime)
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
}
checks += 1

let getterCalls = 0
const accessorInput = clone(fixture.cases[0].input) as Record<string, any>
Object.defineProperty(accessorInput.source.propValue[0], 'selectValue', {
  enumerable: true,
  get() {
    getterCalls += 1
    return 'B'
  }
})
assert.deepEqual(rebuild(accessorInput), { ok: false, stage: 'ENVELOPE', reason: 'INVALID_INPUT' })
assert.equal(getterCalls, 0)
checks += 1

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
  assert.deepEqual(rebuild(value), { ok: false, stage: 'ENVELOPE', reason: 'INVALID_INPUT' })
}
checks += invalidValues.length

const runtimeMutation = clone(fixture.cases[0].input)
;(runtimeMutation.source.propValue[0] as Record<string, unknown>).selectValue = 'Z'
;(runtimeMutation.source.propValue[0] as Record<string, unknown>).mapValue = ['Z-code']
assert.deepEqual(rebuild(runtimeMutation), fixture.cases[0].expected)
checks += 1

console.log(`PASS ${checks} checks; source_sha256=${sourceSha256}`)
