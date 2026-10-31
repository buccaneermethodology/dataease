import assert from 'node:assert/strict'
import { createHash } from 'node:crypto'
import { readFileSync } from 'node:fs'
import { build } from 'esbuild'
import { fileURLToPath } from 'node:url'
import path from 'node:path'

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../../..')
const featureRoot = path.join(
  repoRoot,
  'Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01'
)
const fixturesPath = path.join(featureRoot, 'QuerySingleSelectCreateLifecycleFixtures-r001.json')
const contractPath = path.join(
  featureRoot,
  'QuerySingleSelectCreateLifecyclePureModelContract-r001.json'
)
const sourcePath = path.join(
  repoRoot,
  'core/core-frontend/src/custom-component/filter-copy/query-single-select-created-lifecycle.ts'
)
const carrierPath = path.join(
  repoRoot,
  'core/core-frontend/src/custom-component/filter-copy/query-single-select-carrier.ts'
)
const fixture = JSON.parse(readFileSync(fixturesPath, 'utf8'))
const contract = JSON.parse(readFileSync(contractPath, 'utf8'))
const sourceText = readFileSync(sourcePath, 'utf8')
const sourceSha256 = createHash('sha256').update(sourceText).digest('hex')

const canonical = (value: unknown): string => {
  if (Array.isArray(value)) return `[${value.map(canonical).join(',')}]`
  if (value && typeof value === 'object') {
    const record = value as Record<string, unknown>
    return `{${Object.keys(record)
      .sort()
      .map(key => `${JSON.stringify(key)}:${canonical(record[key])}`)
      .join(',')}}`
  }
  return JSON.stringify(value)
}

const clone = <T>(value: T): T => JSON.parse(JSON.stringify(value)) as T
const deepFreeze = <T>(value: T): T => {
  if (value && typeof value === 'object' && !Object.isFrozen(value)) {
    Object.freeze(value)
    Object.values(value as Record<string, unknown>).forEach(deepFreeze)
  }
  return value
}
const objectGraph = (value: unknown, output = new Set<object>()): Set<object> => {
  if (value && typeof value === 'object' && !output.has(value)) {
    output.add(value)
    Object.values(value as Record<string, unknown>).forEach(child => objectGraph(child, output))
  }
  return output
}
const hasSharedObjects = (left: unknown, right: unknown) => {
  const leftObjects = objectGraph(left)
  const rightObjects = objectGraph(right)
  return Array.from(leftObjects).some(value => rightObjects.has(value))
}

const resolveObjects = (value: unknown): unknown => {
  if (Array.isArray(value)) return value.map(resolveObjects)
  if (value && typeof value === 'object') {
    const record = value as Record<string, unknown>
    const keys = Object.keys(record)
    if (keys.length === 1 && typeof record.$object === 'string') {
      const objectId = record.$object
      const source = fixture.objects[objectId]
      assert.notEqual(source, undefined, `missing object ${objectId}`)
      const observed = createHash('sha256').update(canonical(source)).digest('hex')
      assert.equal(observed, objectId, `object digest ${objectId}`)
      return resolveObjects(clone(source))
    }
    return Object.fromEntries(keys.map(key => [key, resolveObjects(record[key])]))
  }
  return value
}

const bundle = await build({
  stdin: {
    contents:
      "export { transitionCreatedQueryLifecycle } from './src/custom-component/filter-copy/query-single-select-created-lifecycle.ts'; export { qcarrierCallCount } from './src/custom-component/filter-copy/query-single-select-carrier.ts'",
    resolveDir: path.join(repoRoot, 'core/core-frontend')
  },
  bundle: true,
  write: false,
  format: 'esm',
  platform: 'node',
  plugins: [
    {
      name: 'count-real-qcarrier-calls',
      setup(buildApi) {
        buildApi.onResolve({ filter: /query-single-select-carrier/ }, args => {
          if (args.namespace === 'qcarrier-counter') return { path: args.path }
          return { path: carrierPath, namespace: 'qcarrier-counter' }
        })
        buildApi.onLoad({ filter: /.*/, namespace: 'qcarrier-counter' }, () => ({
          contents: `
            import { prepareQuerySingleSelectCarrier as realPrepare } from ${JSON.stringify(
              carrierPath
            )}
            export let qcarrierCallCount = 0
            export function prepareQuerySingleSelectCarrier(input) {
              qcarrierCallCount += 1
              return realPrepare(input)
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
const transition = module.transitionCreatedQueryLifecycle as (input: unknown) => unknown
const excludedIds = new Set(contract.excluded_cases.ids as string[])
const cases = fixture.cases.filter((item: { id: string }) => !excludedIds.has(item.id))
const expectedIds = Array.from(
  { length: 15 },
  (_, index) => `TC-QCREATE-${String(index + 1).padStart(3, '0')}`
)
assert.deepEqual(
  cases.map((item: { id: string }) => item.id),
  expectedIds
)

let checks = 0
for (const item of cases) {
  const input = resolveObjects(clone(item.input)) as Record<string, unknown>
  const expectedState = resolveObjects(clone(item.expected.state))
  const before = clone(input)
  const result = transition(input) as Record<string, unknown>
  assert.deepEqual(result, { ok: true, state: expectedState }, item.id)
  assert.deepEqual(input, before, `${item.id}: input unchanged`)
  assert.equal(hasSharedObjects(input, result), false, `${item.id}: output detached from input`)
  const state = (result as { state: Record<string, unknown> }).state
  assert.equal(
    hasSharedObjects(state.root, state.carrier),
    false,
    `${item.id}: root/carrier isolated`
  )
  for (const snapshot of state.snapshots as Array<Record<string, unknown>>) {
    assert.equal(
      hasSharedObjects(snapshot.componentData, snapshot.carrier),
      false,
      `${item.id}: snapshot root/carrier isolated`
    )
    assert.equal(hasSharedObjects(state.root, snapshot), false, `${item.id}: live/history isolated`)
  }
  checks += 4 + (state.snapshots as unknown[]).length * 2
}

assert.equal(
  module.qcarrierCallCount,
  2,
  'only successful complete confirmations use real QCARRIER'
)
checks += 1

const successfulInput = resolveObjects(clone(cases[5].input)) as Record<string, unknown>
deepFreeze(successfulInput)
const success = transition(successfulInput) as { ok: boolean; state?: Record<string, unknown> }
assert.equal(success.ok, true)
assert.deepEqual(success, JSON.parse(JSON.stringify(success)))
assert.notEqual(success.state, successfulInput.state, 'state is detached from input')
assert.notEqual(success.state?.root, successfulInput.state, 'root is detached from input')
assert.equal(
  hasSharedObjects(success.state?.root, success.state?.carrier),
  false,
  'runtime root and design carrier are independent'
)
checks += 4

const negatives = contract.negative_oracles as Array<{
  id: string
  input?: unknown
  expected: unknown
  construction?: string
}>
for (const item of negatives.filter(negative => negative.id !== 'NEG-06')) {
  const input = resolveObjects(clone(item.input))
  const before = clone(input)
  assert.deepEqual(transition(input), item.expected, item.id)
  assert.deepEqual(input, before, `${item.id}: input unchanged`)
  checks += 2
}

let getterCalls = 0
const accessorInput = { state: null } as Record<string, unknown>
Object.defineProperty(accessorInput, 'events', {
  configurable: true,
  enumerable: true,
  get() {
    getterCalls += 1
    return []
  }
})
const getterExpected = negatives.find(item => item.id === 'NEG-06')?.expected
assert.deepEqual(transition(accessorInput), getterExpected, 'NEG-06')
assert.equal(getterCalls, 0, 'descriptor-first validation must not run accessors')
checks += 2

const shared = { value: 'shared' }
const sharedResult = transition({
  state: null,
  events: [{ type: 'fresh_non_template_dashboard_createInit' }]
}) as { ok: boolean; state?: Record<string, unknown> }
assert.equal(sharedResult.ok, true)
const aliasInput = { state: shared, events: [] }
assert.deepEqual(transition(aliasInput), { ok: false, error: { code: 'MODEL_INPUT_INVALID' } })
checks += 2

const createInitEvent = { type: 'fresh_non_template_dashboard_createInit' }
const addComponentEvent = resolveObjects(clone(cases[1].input)).events[0]
const batchedLifecycle = transition({
  state: null,
  events: [createInitEvent, addComponentEvent]
})
const splitCreate = transition({ state: null, events: [createInitEvent] }) as {
  ok: boolean
  state?: Record<string, unknown>
}
const splitAdd = transition({ state: splitCreate.state, events: [addComponentEvent] })
assert.deepEqual(batchedLifecycle, splitAdd, 'fresh init followed by add is batch-equivalent')
assert.equal(
  (batchedLifecycle as { state?: Record<string, unknown> }).state?.phase,
  'pending',
  'fresh init must be the first event, but need not be the only event'
)
checks += 2

console.log(`QCREATE-003 ${sourceSha256} ${checks} checks passed`)
