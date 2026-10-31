import assert from 'node:assert/strict'
import { build } from 'esbuild'
import vm from 'node:vm'
import { existsSync, readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import path from 'node:path'

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../../..')
const s02 = path.join(
  repoRoot,
  'Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01'
)
const fixtures = JSON.parse(
  readFileSync(path.join(s02, 'QueryTreeRelationRebindingFixtures-r001.json'), 'utf8')
)
const implementationPath = path.join(
  repoRoot,
  'core/core-frontend/src/custom-component/filter-copy/query-tree-relation-rebinding.ts'
)
let rebindQueryTreeRelations = () => ({ ok: false, reason: 'IMPLEMENTATION_UNAVAILABLE' })
if (existsSync(implementationPath)) {
  const bundle = await build({
    stdin: {
      contents: `export { rebindQueryTreeRelations } from './src/custom-component/filter-copy/query-tree-relation-rebinding.ts'`,
      resolveDir: path.join(repoRoot, 'core/core-frontend')
    },
    bundle: true,
    write: false,
    format: 'cjs',
    platform: 'node'
  })
  const context = { module: { exports: {} }, exports: {}, Object }
  vm.runInNewContext(bundle.outputFiles[0].text, context)
  rebindQueryTreeRelations = context.module.exports.rebindQueryTreeRelations
}

const failures = []
for (const item of fixtures.cases) {
  const input = structuredClone(item.input)
  const before = JSON.stringify(input)
  const result = rebindQueryTreeRelations(input)
  try {
    assert.deepEqual(JSON.parse(JSON.stringify(result)), item.expected, item.id)
    assert.equal(JSON.stringify(input), before, `${item.id}: input mutated`)
    if (result.ok) {
      assert.notEqual(result.value, input.treeCheckedList, `${item.id}: outer array reused`)
      for (let index = 0; index < result.value.length; index++) {
        assert.notEqual(
          result.value[index],
          input.treeCheckedList[index],
          `${item.id}: level reused`
        )
        assert.notEqual(
          result.value[index].checkedFields,
          input.treeCheckedList[index].checkedFields,
          `${item.id}: selected array reused`
        )
        assert.notEqual(
          result.value[index].checkedFieldsMap,
          input.treeCheckedList[index].checkedFieldsMap,
          `${item.id}: mapping reused`
        )
      }
    } else {
      assert.equal(
        Object.prototype.hasOwnProperty.call(result, 'value'),
        false,
        `${item.id}: partial result`
      )
    }
  } catch (error) {
    failures.push(`${item.id}: ${error.message}`)
  }
}

const level = (checkedFields, checkedFieldsMap) => ({ checkedFields, checkedFieldsMap })
const mapFor = ids => Object.fromEntries(ids.map(id => [id, [`${id}-target`]]))
const fiveIds = ['f-1', 'f-2', 'f-3', 'f-4', 'f-5']
const fiveLevel = rebindQueryTreeRelations({
  treeFieldIds: fiveIds,
  treeCheckedList: fiveIds.map((fieldId, index) =>
    level([`chart-${index}`], { [`chart-${index}`]: fieldId })
  ),
  componentMap: mapFor(fiveIds.map((_, index) => `chart-${index}`))
})
if (!fiveLevel.ok || fiveLevel.value.length !== 5) {
  failures.push('defensive five levels: expected all five levels to be accepted and preserved')
}

const unusedMap = rebindQueryTreeRelations({
  treeFieldIds: ['f-city'],
  treeCheckedList: [level(['chart-A'], { 'chart-A': 'f-city', stale: '' })],
  componentMap: { 'chart-A': ['chart-B'], '--unused--': ['--ignored--'] }
})
const expectedUnusedMap = {
  ok: true,
  value: [level(['chart-B'], { 'chart-B': 'f-city' })]
}
if (JSON.stringify(unusedMap) !== JSON.stringify(expectedUnusedMap)) {
  failures.push('defensive unused map entries: expected stale unselected keys to be ignored')
}

const firstErrorWins = rebindQueryTreeRelations({
  treeFieldIds: ['f-city'],
  treeCheckedList: [
    level(['chart-A', 'chart-C'], { 'chart-A': 'f-province', 'chart-C': 'f-city' })
  ],
  componentMap: { 'chart-C': ['chart-D', 'chart-E'] }
})
if (JSON.stringify(firstErrorWins) !== JSON.stringify({ ok: false, reason: 'FIELD_MISMATCH' })) {
  failures.push('defensive first error: expected FIELD_MISMATCH before later ambiguity')
}

const specialTarget = rebindQueryTreeRelations({
  treeFieldIds: ['f-city'],
  treeCheckedList: [level(['chart-A'], { 'chart-A': 'f-city' })],
  componentMap: { 'chart-A': ['__proto__'] }
})
if (
  !specialTarget.ok ||
  !Object.prototype.hasOwnProperty.call(specialTarget.value[0].checkedFieldsMap, '__proto__') ||
  specialTarget.value[0].checkedFieldsMap['__proto__'] !== 'f-city'
) {
  failures.push('defensive special target: __proto__ must remain an own mapped target key')
}

const sharedLevel = level(['chart-A'], { 'chart-A': 'f-one' })
const sharedInput = rebindQueryTreeRelations({
  treeFieldIds: ['f-one', 'f-two'],
  treeCheckedList: [sharedLevel, sharedLevel],
  componentMap: { 'chart-A': ['chart-B'] }
})
if (JSON.stringify(sharedInput) !== JSON.stringify({ ok: false, reason: 'FIELD_MISMATCH' })) {
  failures.push('defensive shared level: each array position must use its own level field ID')
}

const tooManyLevels = rebindQueryTreeRelations({
  treeFieldIds: ['f-1', 'f-2', 'f-3', 'f-4', 'f-5', 'f-6'],
  treeCheckedList: ['f-1', 'f-2', 'f-3', 'f-4', 'f-5', 'f-6'].map((fieldId, index) =>
    level([`chart-${index}`], { [`chart-${index}`]: fieldId })
  ),
  componentMap: mapFor(['chart-0', 'chart-1', 'chart-2', 'chart-3', 'chart-4', 'chart-5'])
})
if (JSON.stringify(tooManyLevels) !== JSON.stringify({ ok: false, reason: 'INVALID_INPUT' })) {
  failures.push('defensive six levels: level cap must be enforced')
}

const duplicateFieldIds = rebindQueryTreeRelations({
  treeFieldIds: ['f-city', 'f-city'],
  treeCheckedList: [
    level(['chart-A'], { 'chart-A': 'f-city' }),
    level(['chart-A'], { 'chart-A': 'f-city' })
  ],
  componentMap: { 'chart-A': ['chart-B'] }
})
if (JSON.stringify(duplicateFieldIds) !== JSON.stringify({ ok: false, reason: 'INVALID_INPUT' })) {
  failures.push('defensive duplicate field IDs: levels must refer to unique tree fields')
}

if (failures.length) {
  console.error(`FAIL: ${failures.length} checks (${fixtures.cases.length} frozen QTR identities)`)
  for (const failure of failures) console.error(failure)
  process.exitCode = 1
} else {
  console.log(`PASS: ${fixtures.cases.length} frozen QTR identities plus 7 defensive checks`)
}
