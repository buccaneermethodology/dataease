import assert from 'node:assert/strict'
import { build } from 'esbuild'
import vm from 'node:vm'
import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import path from 'node:path'

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../../..')
const s02 = path.join(
  repoRoot,
  'Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01'
)
const fixtures = JSON.parse(
  readFileSync(path.join(s02, 'CascadeIdentityRebindingFixtures-r001.json'), 'utf8')
)
const bundle = await build({
  stdin: {
    contents: `export { rebindQueryCascadeIdentities } from './src/custom-component/filter-copy/query-cascade-identity-rebinding.ts'`,
    resolveDir: path.join(repoRoot, 'core/core-frontend')
  },
  bundle: true,
  write: false,
  format: 'cjs',
  platform: 'node'
})
const context = { module: { exports: {} }, exports: {}, Object }
vm.runInNewContext(bundle.outputFiles[0].text, context)
const { rebindQueryCascadeIdentities } = context.module.exports
assert.equal(typeof rebindQueryCascadeIdentities, 'function', 'QCR implementation unavailable')

for (const item of fixtures.cases) {
  const input = structuredClone(item.input)
  const before = JSON.stringify(input)
  const result = rebindQueryCascadeIdentities(input)
  assert.deepEqual(JSON.parse(JSON.stringify(result)), item.expected, item.id)
  assert.equal(JSON.stringify(input), before, `${item.id}: input mutated`)
  if (result.ok) {
    assert.notEqual(result.value, input.cascade, `${item.id}: outer array reused`)
    for (let groupIndex = 0; groupIndex < result.value.length; groupIndex++) {
      assert.notEqual(
        result.value[groupIndex],
        input.cascade[groupIndex],
        `${item.id}: group reused`
      )
      for (let nodeIndex = 0; nodeIndex < result.value[groupIndex].length; nodeIndex++) {
        assert.notEqual(
          result.value[groupIndex][nodeIndex],
          input.cascade[groupIndex][nodeIndex],
          `${item.id}: node reused`
        )
        assert.notEqual(
          result.value[groupIndex][nodeIndex].selectValue,
          input.cascade[groupIndex][nodeIndex].selectValue,
          `${item.id}: selectValue reused`
        )
      }
    }
  }
}

const validMaps = {
  queryIdMap: { 'q-a': 'q-a-new', 'q-b': 'q-b-new' },
  nodeIdMap: { 'n-a': 'n-a-new', 'n-b': 'n-b-new' }
}
const malformedComposite = rebindQueryCascadeIdentities({
  cascade: [[{ id: 'n-a', datasetId: 'ds-a--q-a', fieldId: '', placeholder: '' }]],
  queryIdMap: { 'q-a': 'q-a-new' },
  nodeIdMap: { 'n-a': 'n-a-new' }
})
assert.deepEqual(JSON.parse(JSON.stringify(malformedComposite)), {
  ok: false,
  reason: 'INVALID_COMPOSITE_REFERENCE'
})

const invalidSameDatasetField = rebindQueryCascadeIdentities({
  cascade: [
    [
      { id: 'n-a', datasetId: 'ds-a--q-a--f-a', fieldId: '', placeholder: '' },
      { id: 'n-b', datasetId: 'ds-a--q-b--f-b', fieldId: 'unexpected', placeholder: 'configure' }
    ]
  ],
  ...validMaps
})
assert.deepEqual(JSON.parse(JSON.stringify(invalidSameDatasetField)), {
  ok: false,
  reason: 'INVALID_PLACEHOLDER_STATE'
})

const independentEmptyArrays = rebindQueryCascadeIdentities({
  cascade: [
    [
      { id: 'n-a', datasetId: 'ds-a--q-a--f-a', fieldId: '', placeholder: '' },
      { id: 'n-b', datasetId: 'ds-a--q-b--f-b', fieldId: '', placeholder: 'configure' }
    ]
  ],
  ...validMaps
})
assert.equal(independentEmptyArrays.ok, true)

for (const [queryIdMap, nodeIdMap] of [
  [{ 'q-a': 'q--invalid' }, { 'n-a': 'n-a-new' }],
  [{ 'q--invalid': 'q-a-new' }, { 'n-a': 'n-a-new' }],
  [{ '': 'q-a-new' }, { 'n-a': 'n-a-new' }],
  [{ 'q-a': '' }, { 'n-a': 'n-a-new' }],
  [{ 'q-a': 'q-a-new' }, { 'n-a': 'n--invalid' }],
  [{ 'q-a': 'q-a-new' }, { 'n--invalid': 'n-a-new' }],
  [{ 'q-a': 'q-a-new' }, { '': 'n-a-new' }],
  [{ 'q-a': 'q-a-new' }, { 'n-a': '' }]
]) {
  const invalidMappedId = rebindQueryCascadeIdentities({
    cascade: [[{ id: 'n-a', datasetId: 'ds-a--q-a--f-a', fieldId: '', placeholder: '' }]],
    queryIdMap,
    nodeIdMap
  })
  assert.deepEqual(JSON.parse(JSON.stringify(invalidMappedId)), {
    ok: false,
    reason: 'INVALID_ID'
  })
}
if (independentEmptyArrays.ok) {
  assert.notEqual(
    independentEmptyArrays.value[0][0].selectValue,
    independentEmptyArrays.value[0][1].selectValue
  )
}

console.log(`PASS: ${fixtures.cases.length} frozen QCR identities plus 11 defensive checks`)
