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
const fixturePath = path.join(featureRoot, 'QuerySchemaProjectionFixtures-r001.json')
const projectionPath = path.join(
  repoRoot,
  'core/core-frontend/src/custom-component/filter-copy/query-schema-projection.ts'
)
const qprepPath = path.join(
  repoRoot,
  'core/core-frontend/src/custom-component/filter-copy/query-reference-plan.ts'
)
const fixtureText = readFileSync(fixturePath, 'utf8')
const fixture = JSON.parse(fixtureText)
const cases = fixture.cases
const sourceText = existsSync(projectionPath) ? readFileSync(projectionPath, 'utf8') : '<missing>'
const runnerText = readFileSync(fileURLToPath(import.meta.url), 'utf8')
const sha256 = (text: string) => createHash('sha256').update(text).digest('hex')
const sourceSha = sha256(sourceText)
const fixtureSha = sha256(fixtureText)
const runnerSha = sha256(runnerText)

assert.deepEqual(
  cases.map((item: { id: string }) => item.id),
  Array.from({ length: 6 }, (_, index) => `TC-QPROJ-${String(index + 1).padStart(3, '0')}`)
)

let projectQueryReferenceInput: ((input: unknown) => unknown) | undefined
let prepareQueryReferences: ((input: unknown) => unknown) | undefined
if (existsSync(projectionPath) && existsSync(qprepPath)) {
  const bundle = await build({
    stdin: {
      contents: `export { projectQueryReferenceInput } from './src/custom-component/filter-copy/query-schema-projection.ts'; export { prepareQueryReferences } from './src/custom-component/filter-copy/query-reference-plan.ts'`,
      resolveDir: path.join(repoRoot, 'core/core-frontend')
    },
    bundle: true,
    write: false,
    format: 'cjs',
    platform: 'node'
  })
  const context = { module: { exports: {} }, exports: {} }
  vm.runInNewContext(bundle.outputFiles[0].text, context)
  projectQueryReferenceInput = context.module.exports.projectQueryReferenceInput
  prepareQueryReferences = context.module.exports.prepareQueryReferences
}

const clone = (value: unknown) => JSON.parse(JSON.stringify(value))
const inputFor = (item: any) => {
  const input = clone(
    item.input || cases.find((candidate: any) => candidate.id === item.base).input
  )
  const patch = item.patch || {}
  if (patch.remove_property) delete input[patch.remove_property]
  if (patch.sourceComponents) input.sourceComponents = clone(patch.sourceComponents)
  if (patch['cascade[0][1].datasetId']) {
    input.cascade[0][1].datasetId = patch['cascade[0][1].datasetId']
  }
  if (patch['propValue[1].displayType']) {
    input.propValue[1].displayType = patch['propValue[1].displayType']
  }
  if (patch['propValue[1].treeFieldList']) {
    input.propValue[1].treeFieldList = clone(patch['propValue[1].treeFieldList'])
  }
  return input
}

let failures = 0
for (const item of cases) {
  try {
    assert.equal(
      typeof projectQueryReferenceInput,
      'function',
      'projection implementation unavailable'
    )
    const input = inputFor(item)
    const result: any = projectQueryReferenceInput(input)
    if (item.id === 'TC-QPROJ-006') {
      assert.equal(result.ok, true, item.id)
      assert.equal(result.value.chains[0][1].conditionId, 'missing', item.id)
      assert.equal(typeof prepareQueryReferences, 'function', 'QPREP implementation unavailable')
      assert.deepEqual(
        JSON.parse(JSON.stringify(prepareQueryReferences(result.value))),
        { ok: false, reason: 'MISSING_CONDITION' },
        item.id
      )
    } else {
      assert.deepEqual(JSON.parse(JSON.stringify(result)), item.expected, item.id)
    }
    console.log(`PASS ${item.id}`)
  } catch (error) {
    failures += 1
    console.error(`FAIL ${item.id}: ${(error as Error).message}`)
  }
}

console.log(`SOURCE_SHA256 ${sourceSha}`)
console.log(`FIXTURE_SHA256 ${fixtureSha}`)
console.log(`RUNNER_SHA256 ${runnerSha}`)
console.log(`RESULT ${cases.length - failures}/${cases.length} passed; ${failures} failed`)
assert.equal(failures, 0, 'query schema projection cases failed')
