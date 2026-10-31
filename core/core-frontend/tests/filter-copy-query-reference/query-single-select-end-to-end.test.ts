import assert from 'node:assert/strict'
import { build } from 'esbuild'
import { readFileSync, existsSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import path from 'node:path'

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../../..')
const featureRoot = path.join(
  repoRoot,
  'Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01'
)
const fixture = JSON.parse(
  readFileSync(path.join(featureRoot, 'QuerySingleSelectEndToEndFixtures-r003.json'), 'utf8')
)
const modulePath = path.join(
  repoRoot,
  'core/core-frontend/src/custom-component/filter-copy/query-single-select-end-to-end.ts'
)

assert.equal(existsSync(modulePath), true, `QE2E_IMPL_UNAVAILABLE:${modulePath}`)

const instrumentedModules = [
  {
    match: /query-schema-projection/,
    path: path.join(
      repoRoot,
      'core/core-frontend/src/custom-component/filter-copy/query-schema-projection.ts'
    ),
    exportName: 'projectQueryReferenceInput',
    label: 'QPROJ'
  },
  {
    match: /query-target-component-map/,
    path: path.join(
      repoRoot,
      'core/core-frontend/src/custom-component/filter-copy/query-target-component-map.ts'
    ),
    exportName: 'resolveTargetComponentMap',
    label: 'QMAP'
  },
  {
    match: /query-reference-plan/,
    path: path.join(
      repoRoot,
      'core/core-frontend/src/custom-component/filter-copy/query-reference-plan.ts'
    ),
    exportName: 'prepareQueryReferences',
    label: 'QPREP'
  },
  {
    match: /query-reference-pipeline/,
    path: path.join(
      repoRoot,
      'core/core-frontend/src/custom-component/filter-copy/query-reference-pipeline.ts'
    ),
    exportName: 'prepareQueryReferencePipeline',
    label: 'QPIPE'
  },
  {
    match: /query-single-select-target-rebuild/,
    path: path.join(
      repoRoot,
      'core/core-frontend/src/custom-component/filter-copy/query-single-select-target-rebuild.ts'
    ),
    exportName: 'rebuildSingleSelectTarget',
    label: 'QTARGET'
  },
  {
    match: /query-single-select-query-payload/,
    path: path.join(
      repoRoot,
      'core/core-frontend/src/custom-component/filter-copy/query-single-select-query-payload.ts'
    ),
    exportName: 'prepareSingleSelectQueryPayload',
    label: 'QPAYLOAD'
  }
]

const plugin = {
  name: 'observe-real-qe2e-call-order',
  setup(buildApi: any) {
    for (const item of instrumentedModules) {
      const namespace = `qe2e-${item.label}`
      buildApi.onResolve({ filter: item.match }, (args: any) => {
        if (args.namespace.startsWith('qe2e-')) {
          return { path: args.path, namespace: 'file' }
        }
        return { path: item.path, namespace }
      })
      buildApi.onLoad({ filter: /.*/, namespace }, () => ({
        contents: `
          import { ${item.exportName} as realFunction } from ${JSON.stringify(item.path)}
          export function ${item.exportName}(input) {
            globalThis.__qe2eCallTrace.push('${item.label}')
            return realFunction(input)
          }
        `,
        loader: 'ts'
      }))
    }
  }
}

const bundle = await build({
  stdin: {
    contents:
      "export { prepareSingleSelectQueryEndToEnd } from './src/custom-component/filter-copy/query-single-select-end-to-end.ts'\n",
    resolveDir: path.join(repoRoot, 'core/core-frontend')
  },
  bundle: true,
  write: false,
  format: 'esm',
  platform: 'node',
  plugins: [plugin]
})
const bundledModule = await import(
  `data:text/javascript;base64,${Buffer.from(bundle.outputFiles[0].text).toString('base64')}`
)
const prepare = bundledModule.prepareSingleSelectQueryEndToEnd as (input: unknown) => any
const clone = <T>(value: T): T => structuredClone(value)
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
  if (!item.input) continue
  const input = clone(item.input)
  const before = clone(input)
  ;(globalThis as any).__qe2eCallTrace = []
  const result = prepare(input)
  assert.deepEqual(result, item.expected, item.id)
  assert.deepEqual(
    (globalThis as any).__qe2eCallTrace.filter((call: string) => call !== 'QPIPE'),
    item.expected_calls,
    `${item.id}: real call order`
  )
  assert.deepEqual(input, before, `${item.id}: input unchanged`)
  if (item.expected.ok === false) {
    assert.equal('value' in result, false, `${item.id}: no partial result`)
  }
  checks += 3
}

const successCase = fixture.cases.find((item: any) => item.id === 'TC-QE2E-001')
const successInput = clone(successCase.input)
deepFreeze(successInput)
;(globalThis as any).__qe2eCallTrace = []
const success = prepare(successInput)
assert.equal(success.ok, true)
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
assert.equal(success.value.designPayload.propValue[0].selectValue, undefined)
assert.equal(success.value.runtimePayload.propValue[0].selectValue, 'A')
assert.equal(success.value.runtimePayload.propValue[0].mapValue[0], 'A-code')
checks += 7

let getterCalls = 0
const getterInput = clone(successCase.input) as Record<string, any>
Object.defineProperty(getterInput, 'propValue', {
  enumerable: true,
  get() {
    getterCalls += 1
    return []
  }
})
;(globalThis as any).__qe2eCallTrace = []
assert.deepEqual(prepare(getterInput), {
  ok: false,
  stage: 'ENVELOPE',
  reason: 'INVALID_INPUT'
})
assert.equal(getterCalls, 0)
assert.deepEqual((globalThis as any).__qe2eCallTrace, [])

const nullPrototypeInput = Object.assign(Object.create(null), clone(successCase.input))
assert.deepEqual(prepare(nullPrototypeInput), {
  ok: false,
  stage: 'ENVELOPE',
  reason: 'INVALID_INPUT'
})
const cyclicInput = clone(successCase.input)
;(cyclicInput.sourceComponents as any).push(cyclicInput.sourceComponents)
assert.deepEqual(prepare(cyclicInput), {
  ok: false,
  stage: 'ENVELOPE',
  reason: 'INVALID_INPUT'
})
checks += 5

console.log(`QE2E-001 ${checks} checks passed`)
