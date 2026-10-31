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
const fixturePath = path.join(featureRoot, 'QueryTargetComponentMapFixtures-r001.json')
const sourcePath = path.join(
  repoRoot,
  'core/core-frontend/src/custom-component/filter-copy/query-target-component-map.ts'
)
const fixtureText = readFileSync(fixturePath, 'utf8')
const fixture = JSON.parse(fixtureText)
const cases = fixture.cases
const sourceText = existsSync(sourcePath) ? readFileSync(sourcePath, 'utf8') : '<missing>'
const runnerText = readFileSync(fileURLToPath(import.meta.url), 'utf8')
const sha256 = (text: string) => createHash('sha256').update(text).digest('hex')

assert.deepEqual(
  cases.map((item: { id: string }) => item.id),
  Array.from({ length: 6 }, (_, index) => `TC-QMAP-${String(index + 1).padStart(3, '0')}`)
)

let resolveTargetComponentMap: ((input: unknown) => unknown) | undefined
if (existsSync(sourcePath)) {
  const bundle = await build({
    stdin: {
      contents: `export { resolveTargetComponentMap } from './src/custom-component/filter-copy/query-target-component-map.ts'`,
      resolveDir: path.join(repoRoot, 'core/core-frontend')
    },
    bundle: true,
    write: false,
    format: 'cjs',
    platform: 'node'
  })
  const context = { module: { exports: {} }, exports: {} }
  vm.runInNewContext(bundle.outputFiles[0].text, context)
  resolveTargetComponentMap = context.module.exports.resolveTargetComponentMap
}

const clone = (value: unknown) => JSON.parse(JSON.stringify(value))
const inputFor = (item: any) => {
  const input = clone(
    item.input || cases.find((candidate: any) => candidate.id === item.base).input
  )
  if (item.replace) Object.assign(input, clone(item.replace))
  return input
}

let failures = 0
for (const item of cases) {
  try {
    assert.equal(
      typeof resolveTargetComponentMap,
      'function',
      `${item.id}: implementation unavailable`
    )
    const input = inputFor(item)
    const before = clone(input)
    const result = resolveTargetComponentMap(input)
    assert.deepEqual(JSON.parse(JSON.stringify(result)), item.expected, item.id)
    assert.deepEqual(input, before, `${item.id}: input mutated`)
    console.log(`PASS ${item.id}`)
  } catch (error) {
    failures += 1
    console.error(`FAIL ${item.id}: ${(error as Error).message}`)
  }
}

console.log(`SOURCE_SHA256 ${sha256(sourceText)}`)
console.log(`FIXTURE_SHA256 ${sha256(fixtureText)}`)
console.log(`RUNNER_SHA256 ${sha256(runnerText)}`)
console.log(`RESULT ${cases.length - failures}/${cases.length} passed; ${failures} failed`)
if (failures > 0) process.exitCode = 1
