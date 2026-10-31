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
const fixturePath = path.join(featureRoot, 'QuerySingleSelectQueryPayloadFixtures-r001.json')
const sourcePath = path.join(
  repoRoot,
  'core/core-frontend/src/custom-component/filter-copy/query-single-select-query-payload.ts'
)
const coreModulePath = path.join(
  repoRoot,
  'core/core-frontend/src/custom-component/filter-copy/query-single-select-target-rebuild.ts'
)
const fixture = JSON.parse(readFileSync(fixturePath, 'utf8'))
const sourceText = readFileSync(sourcePath, 'utf8')
const sourceSha256 = createHash('sha256').update(sourceText).digest('hex')
const expectedIds = Array.from(
  { length: 14 },
  (_, index) => `TC-QPAYLOAD-${String(index + 1).padStart(3, '0')}`
)
assert.deepEqual(
  fixture.cases.map((item: { id: string }) => item.id),
  expectedIds
)

const bundle = await build({
  stdin: {
    contents:
      "export { prepareSingleSelectQueryPayload } from './src/custom-component/filter-copy/query-single-select-query-payload.ts'; export { qtargetCallCount } from './src/custom-component/filter-copy/query-single-select-target-rebuild.ts'",
    resolveDir: path.join(repoRoot, 'core/core-frontend')
  },
  bundle: true,
  write: false,
  format: 'esm',
  platform: 'node',
  plugins: [
    {
      name: 'count-real-qtarget-calls',
      setup(buildApi) {
        buildApi.onResolve({ filter: /query-single-select-target-rebuild/ }, args => {
          if (args.namespace === 'qtarget-counter') return { path: args.path }
          return { path: coreModulePath, namespace: 'qtarget-counter' }
        })
        buildApi.onLoad({ filter: /.*/, namespace: 'qtarget-counter' }, () => ({
          contents: `
            import { rebuildSingleSelectTarget as realRebuild } from ${JSON.stringify(
              coreModulePath
            )}
            export let qtargetCallCount = 0
            export function rebuildSingleSelectTarget(input) {
              qtargetCallCount += 1
              return realRebuild(input)
            }
          `,
          loader: 'ts'
        }))
      }
    }
  ]
})
const module = await import(
  `data:text/javascript;base64,${Buffer.from(bundle.outputFiles[0].text).toString('base64')}`
)
const prepare = module.prepareSingleSelectQueryPayload as (input: unknown) => any
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
  const result = prepare(input)
  assert.deepEqual(result, item.expected, item.id)
  assert.deepEqual(input, before, `${item.id}: input unchanged`)
  if (item.expected.ok === false) {
    assert.equal('value' in result, false, `${item.id}: no partial value`)
  }
  checks += 1
}

assert.equal(module.qtargetCallCount, 4, 'only valid containers reach the real QTARGET dependency')
checks += 1

const successInput = clone(fixture.cases[0].input)
deepFreeze(successInput)
const success = prepare(successInput)
assert.equal(success.ok, true)
assert.deepEqual(JSON.parse(JSON.stringify(success)), success)
const inputObjects = collectObjects(successInput)
const designObjects = collectObjects(success.value.designPayload)
const runtimeObjects = collectObjects(success.value.runtimePayload)
assert.equal(
  Array.from(designObjects).some(value => inputObjects.has(value)),
  false
)
assert.equal(
  Array.from(runtimeObjects).some(value => inputObjects.has(value)),
  false
)
assert.equal(
  Array.from(designObjects).some(value => runtimeObjects.has(value)),
  false
)
checks += 4

const beforeMutation = clone(success.value.runtimePayload)
success.value.designPayload.style.width = 999
success.value.designPayload.propValue[0].checkedFields.push('mutated')
assert.equal(successInput.target.style.width, 400)
assert.deepEqual(success.value.runtimePayload, beforeMutation)
checks += 2

let getterCalls = 0
const accessorInput = clone(fixture.cases[0].input) as Record<string, any>
Object.defineProperty(accessorInput.target.style, 'computed', {
  enumerable: true,
  get() {
    getterCalls += 1
    return 1
  }
})
assert.deepEqual(prepare(accessorInput), { ok: false, stage: 'ENVELOPE', reason: 'INVALID_INPUT' })
assert.equal(getterCalls, 0)
checks += 2

const cycleInput = clone(fixture.cases[0].input) as Record<string, any>
cycleInput.target.style.loop = cycleInput.target.style
assert.deepEqual(prepare(cycleInput), { ok: false, stage: 'ENVELOPE', reason: 'INVALID_INPUT' })
const symbolInput = clone(fixture.cases[0].input) as Record<string, any>
Object.defineProperty(symbolInput.target, Symbol('hidden'), { enumerable: true, value: 1 })
assert.deepEqual(prepare(symbolInput), { ok: false, stage: 'ENVELOPE', reason: 'INVALID_INPUT' })
const sparseInput = clone(fixture.cases[0].input) as Record<string, any>
sparseInput.target.cascade = new Array(1)
assert.deepEqual(prepare(sparseInput), { ok: false, stage: 'ENVELOPE', reason: 'INVALID_INPUT' })
checks += 3

const protoInput = clone(fixture.cases[0].input) as Record<string, any>
Object.defineProperty(protoInput.target.style, '__proto__', {
  configurable: true,
  enumerable: true,
  value: { safe: true },
  writable: true
})
const protoResult = prepare(protoInput)
assert.equal(protoResult.ok, true)
assert.equal(Object.getPrototypeOf(protoResult.value.designPayload.style), Object.prototype)
assert.deepEqual(
  Object.getOwnPropertyDescriptor(protoResult.value.designPayload.style, '__proto__')?.value,
  { safe: true }
)
checks += 2

console.log(`QPAYLOAD-001 ${sourceSha256} ${checks} checks passed`)
