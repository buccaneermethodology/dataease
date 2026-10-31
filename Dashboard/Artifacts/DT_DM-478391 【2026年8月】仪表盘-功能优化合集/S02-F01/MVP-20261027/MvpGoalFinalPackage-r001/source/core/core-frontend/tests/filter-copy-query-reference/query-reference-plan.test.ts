import assert from 'node:assert/strict'
import { build } from 'esbuild'
import vm from 'node:vm'
import { createHash } from 'node:crypto'
import { existsSync, readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import path from 'node:path'

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../../..')
const featureRoot = path.join(
  repoRoot,
  'Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01'
)
const fixturePath = path.join(featureRoot, 'QueryAdapterDesignConsolidationFixtures-r001.json')
const sourcePath = path.join(
  repoRoot,
  'core/core-frontend/src/custom-component/filter-copy/query-reference-plan.ts'
)
const fixtureText = readFileSync(fixturePath, 'utf8')
const fixtures = JSON.parse(fixtureText)
const cases = fixtures.cases
const sourceBefore = existsSync(sourcePath) ? readFileSync(sourcePath, 'utf8') : '<missing>'
const sourceHash = createHash('sha256').update(sourceBefore).digest('hex')
const runnerText = readFileSync(fileURLToPath(import.meta.url), 'utf8')
const runnerHash = createHash('sha256').update(runnerText).digest('hex')

assert.equal(cases.length, 8)
assert.deepEqual(
  cases.map(item => item.id),
  Array.from({ length: 8 }, (_, index) => `TC-QPREP-${String(index + 1).padStart(3, '0')}`)
)

let prepareQueryReferences
if (existsSync(sourcePath)) {
  const bundle = await build({
    stdin: {
      contents: `export { prepareQueryReferences } from './src/custom-component/filter-copy/query-reference-plan.ts'`,
      resolveDir: path.join(repoRoot, 'core/core-frontend')
    },
    bundle: true,
    write: false,
    format: 'cjs',
    platform: 'node'
  })
  const context = { module: { exports: {} }, exports: {} }
  vm.runInNewContext(bundle.outputFiles[0].text, context)
  prepareQueryReferences = context.module.exports.prepareQueryReferences
} else {
  // Keep the runner executable without the module so RED reaches the frozen assertions.
  prepareQueryReferences = () => ({ ok: false, reason: 'UNIMPLEMENTED' })
}

const clone = value => JSON.parse(JSON.stringify(value))
const resolveInput = item => {
  const base = clone(item.input || cases.find(candidate => candidate.id === item.base).input)
  const patch = item.patch
  if (!patch) return base
  if (patch.remove_condition) {
    base.conditions = base.conditions.filter(condition => condition.id !== patch.remove_condition)
  }
  if (patch.componentMap) base.componentMap = clone(patch.componentMap)
  if (patch.conditionMap) base.conditionMap = clone(patch.conditionMap)
  if (patch.append_chain) {
    base.chains.push(clone(patch.append_chain))
    Object.assign(base.nodeMap, clone(patch.extend_nodeMap))
  }
  if (patch.chain_node_b_datasetId) base.chains[0][1].datasetId = patch.chain_node_b_datasetId
  return base
}

let failures = 0
for (const item of cases) {
  const input = resolveInput(item)
  if (item.id === 'TC-QPREP-008') deepFreeze(input)
  try {
    assert.equal(
      typeof prepareQueryReferences,
      'function',
      `${item.id}: implementation unavailable`
    )
    const result = prepareQueryReferences(input)
    const oracle = item.id === 'TC-QPREP-008' ? cases[0].expected : item.expected
    if (oracle.ok === false) {
      assert.deepEqual(JSON.parse(JSON.stringify(result)), oracle, item.id)
    } else {
      assert.equal(result.ok, true, item.id)
      assert.deepEqual(JSON.parse(JSON.stringify(result)), oracle, item.id)
      if (item.id === 'TC-QPREP-008') {
        result.value.conditions[0].targetRefs[0].fieldId = 'changed'
        assert.equal(input.conditions[0].targetRefs[0].fieldId, 'province', item.id)
      }
    }
    console.log(`PASS ${item.id}`)
  } catch (error) {
    failures += 1
    console.error(`FAIL ${item.id}: ${error.message}`)
  }
}

console.log(`SOURCE_SHA256 ${sourceHash}`)
console.log(`FIXTURE_SHA256 ${createHash('sha256').update(fixtureText).digest('hex')}`)
console.log(`RUNNER_SHA256 ${runnerHash}`)
console.log(`RESULT ${cases.length - failures}/${cases.length} passed; ${failures} failed`)
assert.equal(failures, 0, 'query-reference plan cases failed')

function deepFreeze(value) {
  if (value && typeof value === 'object' && !Object.isFrozen(value)) {
    Object.freeze(value)
    Object.values(value).forEach(deepFreeze)
  }
  return value
}
