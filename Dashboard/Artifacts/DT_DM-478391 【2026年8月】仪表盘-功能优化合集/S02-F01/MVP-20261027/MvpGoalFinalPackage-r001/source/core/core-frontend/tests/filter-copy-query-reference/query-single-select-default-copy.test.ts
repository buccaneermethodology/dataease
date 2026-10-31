import assert from 'node:assert/strict'
import { build } from 'esbuild'
import { createHash } from 'node:crypto'
import { existsSync, readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import path from 'node:path'

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../../..')
const featureRoot = path.join(
  repoRoot,
  'Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01'
)
const fixturePath = path.join(featureRoot, 'QuerySingleSelectDefaultRebuildFixtures-r003.json')
const sourcePath = path.join(
  repoRoot,
  'core/core-frontend/src/custom-component/filter-copy/query-single-select-default-copy.ts'
)
const fixtureText = readFileSync(fixturePath, 'utf8')
const fixture = JSON.parse(fixtureText)
const sourceBefore = existsSync(sourcePath) ? readFileSync(sourcePath, 'utf8') : '<missing>'
const sourceHash = createHash('sha256').update(sourceBefore).digest('hex')
const runnerSha256 = createHash('sha256')
  .update(readFileSync(fileURLToPath(import.meta.url)))
  .digest('hex')
const expectedIds = Array.from(
  { length: 12 },
  (_, index) => `TC-QSINGLE-DEFAULT-COPY-${String(index + 1).padStart(3, '0')}`
)

assert.deepEqual(
  fixture.cases.map((item: { id: string }) => item.id),
  expectedIds
)

let copySingleSelectDefaultConfig: (input: unknown) => any
if (process.env.QSINGLE_DEFAULT_COPY_FORCE_UNIMPLEMENTED === '1') {
  // The same runner can exercise assertion-level RED against a deliberate missing-builder result.
  copySingleSelectDefaultConfig = () => ({ ok: false, reason: 'UNIMPLEMENTED' })
} else if (existsSync(sourcePath)) {
  const bundle = await build({
    stdin: {
      contents:
        "export { copySingleSelectDefaultConfig } from './src/custom-component/filter-copy/query-single-select-default-copy.ts'",
      resolveDir: path.join(repoRoot, 'core/core-frontend')
    },
    bundle: true,
    write: false,
    format: 'esm',
    platform: 'node'
  })
  const bundledModule = await import(
    `data:text/javascript;base64,${Buffer.from(bundle.outputFiles[0].text).toString('base64')}`
  )
  copySingleSelectDefaultConfig = bundledModule.copySingleSelectDefaultConfig
} else {
  // Keep RED executable without source so failures occur at frozen oracle assertions.
  copySingleSelectDefaultConfig = () => ({ ok: false, reason: 'UNIMPLEMENTED' })
}

const clone = <T>(value: T): T => JSON.parse(JSON.stringify(value)) as T
const asJson = (value: unknown) => JSON.parse(JSON.stringify(value))
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
const assertNoSharedObjects = (input: unknown, output: unknown) => {
  const inputObjects = collectObjects(input)
  for (const object of collectObjects(output)) {
    assert.equal(inputObjects.has(object), false, 'output must not share nested object references')
  }
}

let checks = 0
let failures = 0
const check = (name: string, action: () => void) => {
  checks += 1
  try {
    action()
    console.log(`PASS ${name}`)
  } catch (error) {
    failures += 1
    console.error(`FAIL ${name}: ${(error as Error).message}`)
  }
}

for (const item of fixture.cases) {
  check(item.id, () => {
    const input = clone(item.input)
    const before = clone(input)
    const result = copySingleSelectDefaultConfig(input)
    assert.deepEqual(asJson(result), item.expected, item.id)
    assert.deepEqual(input, before, `${item.id}: input must remain unchanged`)
    if (item.expected.ok) assertNoSharedObjects(input, result.value)
  })
}

check('deep-freeze-and-output-detachment', () => {
  const input = deepFreeze(clone(fixture.cases[0].input))
  const before = clone(input)
  const result = copySingleSelectDefaultConfig(input)
  assert.equal(result.ok, true)
  assert.deepEqual(input, before)
  assertNoSharedObjects(input, result.value)
  result.value.propValue[0].field.id = 'changed'
  assert.equal(input.source.propValue[0].field.id, 'province')
})

check('all-source-values-remain-deep-equal-except-identities', () => {
  const input = clone(fixture.cases[0].input)
  const result = copySingleSelectDefaultConfig(input)
  assert.equal(result.ok, true)
  const original = input.source.propValue[0]
  const copied = result.value.propValue[0]
  for (const key of Object.keys(original)) {
    if (['id', 'checkedFields', 'checkedFieldsMap'].includes(key)) continue
    assert.deepEqual(copied[key], original[key], `${key} must be preserved`)
  }
  const originalNode = input.source.cascade[0][0]
  const copiedNode = result.value.cascade[0][0]
  for (const key of Object.keys(originalNode)) {
    if (['id', 'datasetId'].includes(key)) continue
    assert.deepEqual(copiedNode[key], originalNode[key], `cascade ${key} must be preserved`)
  }
})

check('deterministic-output-and-json-round-trip', () => {
  const input = clone(fixture.cases[0].input)
  const first = copySingleSelectDefaultConfig(input)
  const second = copySingleSelectDefaultConfig(input)
  assert.equal(first.ok, true)
  assert.deepEqual(first, second)
  assert.deepEqual(JSON.parse(JSON.stringify(first)), first)
})

console.log(
  JSON.stringify({
    suite: 'QSINGLE-DEFAULT-COPY-001',
    runnerSha256,
    sourceSha256: sourceHash,
    checks,
    failures,
    result: failures === 0 ? 'PASS' : 'FAIL'
  })
)
if (failures > 0) process.exitCode = 1
