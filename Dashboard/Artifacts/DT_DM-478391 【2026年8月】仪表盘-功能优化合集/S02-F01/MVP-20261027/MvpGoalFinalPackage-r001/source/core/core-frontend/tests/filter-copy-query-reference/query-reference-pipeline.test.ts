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
const fixturePath = path.join(featureRoot, 'QueryReferencePipelineFixtures-r001.json')
const pipelinePath = path.join(
  repoRoot,
  'core/core-frontend/src/custom-component/filter-copy/query-reference-pipeline.ts'
)
const sourcePaths = [
  path.join(
    repoRoot,
    'core/core-frontend/src/custom-component/filter-copy/query-schema-projection.ts'
  ),
  path.join(
    repoRoot,
    'core/core-frontend/src/custom-component/filter-copy/query-target-component-map.ts'
  ),
  path.join(repoRoot, 'core/core-frontend/src/custom-component/filter-copy/query-reference-plan.ts')
]
const fixtureText = readFileSync(fixturePath, 'utf8')
const fixture = JSON.parse(fixtureText)
const cases = fixture.cases
const runnerText = readFileSync(fileURLToPath(import.meta.url), 'utf8')
const sha256 = (text: string) => createHash('sha256').update(text).digest('hex')
const sourceDigest = (file: string) =>
  sha256(existsSync(file) ? readFileSync(file, 'utf8') : '<missing>')
const fixtureSha = sha256(fixtureText)
const runnerSha = sha256(runnerText)

assert.deepEqual(
  cases.map((item: { id: string }) => item.id),
  Array.from({ length: 6 }, (_, index) => `TC-QPIPE-${String(index + 1).padStart(3, '0')}`)
)

const clone = (value: unknown) => JSON.parse(JSON.stringify(value))
const deepFreeze = <T>(value: T): T => {
  if (value !== null && typeof value === 'object' && !Object.isFrozen(value)) {
    Object.freeze(value)
    Object.values(value as Record<string, unknown>).forEach(item => deepFreeze(item))
  }
  return value
}
const inputFor = (item: any) => {
  const input = clone(
    item.input || cases.find((candidate: any) => candidate.id === item.base).input
  )
  for (const [key, value] of Object.entries(item.replace || {})) input[key] = clone(value)
  if (item.patch?.['cascade[0][1].datasetId']) {
    input.cascade[0][1].datasetId = item.patch['cascade[0][1].datasetId']
  }
  if (item.append_chain) {
    input.cascade.push(clone(item.append_chain))
    input.maps.nodeMap = { ...input.maps.nodeMap, ...item.extend_nodeMap }
  }
  return input
}

let prepareQueryReferencePipeline: ((input: unknown) => unknown) | undefined
const actualCalls: string[] = []
let bundleError: Error | undefined
if (existsSync(pipelinePath)) {
  try {
    const instrument = (filePath: string, exportName: string, label: string) => ({
      name: `spy-${label}`,
      setup(buildApi: any) {
        buildApi.onLoad({ filter: new RegExp(`${path.basename(filePath)}$`) }, async () => {
          const source = readFileSync(filePath, 'utf8').replace(
            new RegExp(`export const ${exportName}\\s*=`),
            `const ${exportName}Impl =`
          )
          return {
            contents: `${source}\nexport const ${exportName} = (...args: Parameters<typeof ${exportName}Impl>) => { (globalThis as any).__calls.push('${label}'); return ${exportName}Impl(...args) }`,
            loader: 'ts'
          }
        })
      }
    })
    const bundle = await build({
      stdin: {
        contents: `export { prepareQueryReferencePipeline } from './src/custom-component/filter-copy/query-reference-pipeline.ts'`,
        resolveDir: path.join(repoRoot, 'core/core-frontend')
      },
      bundle: true,
      write: false,
      format: 'cjs',
      platform: 'node',
      plugins: [
        instrument(sourcePaths[0], 'projectQueryReferenceInput', 'QPROJ'),
        instrument(sourcePaths[1], 'resolveTargetComponentMap', 'QMAP'),
        instrument(sourcePaths[2], 'prepareQueryReferences', 'QPREP')
      ]
    })
    const context: any = { module: { exports: {} }, exports: {}, __calls: actualCalls }
    vm.runInNewContext(bundle.outputFiles[0].text, context)
    prepareQueryReferencePipeline = context.module.exports.prepareQueryReferencePipeline
  } catch (error) {
    bundleError = error as Error
  }
}

let failures = 0
for (const item of cases) {
  try {
    assert.equal(
      typeof prepareQueryReferencePipeline,
      'function',
      bundleError
        ? `implementation unavailable: ${bundleError.message}`
        : 'implementation unavailable'
    )
    const input = deepFreeze(inputFor(item))
    const before = clone(input)
    actualCalls.length = 0
    const result: any = prepareQueryReferencePipeline!(input)
    assert.deepEqual(JSON.parse(JSON.stringify(result)), item.expected, item.id)
    assert.deepEqual(actualCalls, item.expected_calls, `${item.id} actual call sequence`)
    assert.deepEqual(clone(input), before, `${item.id} input mutated`)
    if (!item.expected.ok) {
      assert.equal(Object.hasOwn(result, 'value'), false, `${item.id} leaked partial value`)
      assert.equal(
        Object.hasOwn(result, 'componentMap'),
        false,
        `${item.id} leaked partial component map`
      )
    }
    console.log(`PASS ${item.id}`)
  } catch (error) {
    failures += 1
    console.error(`FAIL ${item.id}: ${(error as Error).message}`)
  }
}

console.log(`SOURCE_QPROJ_SHA256 ${sourceDigest(sourcePaths[0])}`)
console.log(`SOURCE_QMAP_SHA256 ${sourceDigest(sourcePaths[1])}`)
console.log(`SOURCE_QPREP_SHA256 ${sourceDigest(sourcePaths[2])}`)
console.log(`PIPELINE_SHA256 ${sourceDigest(pipelinePath)}`)
console.log(`FIXTURE_SHA256 ${fixtureSha}`)
console.log(`RUNNER_SHA256 ${runnerSha}`)
console.log(`RESULT ${cases.length - failures}/${cases.length} passed; ${failures} failed`)
assert.equal(failures, 0, 'query reference pipeline cases failed')
