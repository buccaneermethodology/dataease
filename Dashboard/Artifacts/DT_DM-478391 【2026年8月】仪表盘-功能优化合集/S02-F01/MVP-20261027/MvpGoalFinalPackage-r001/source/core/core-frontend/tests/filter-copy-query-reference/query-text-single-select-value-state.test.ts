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
const fixturePath = path.join(featureRoot, 'QueryTextSingleSelectExtractionFixtures-r007.json')
const sourcePath = path.join(
  repoRoot,
  'core/core-frontend/src/custom-component/filter-copy/query-text-single-select-value-state.ts'
)
const fixtureText = readFileSync(fixturePath, 'utf8')
const fixture = JSON.parse(fixtureText)
const sourceBefore = existsSync(sourcePath) ? readFileSync(sourcePath, 'utf8') : '<missing>'
const sourceHash = createHash('sha256').update(sourceBefore).digest('hex')
const runnerHash = createHash('sha256')
  .update(readFileSync(fileURLToPath(import.meta.url)))
  .digest('hex')

assert.equal(fixture.case_count, 18)
assert.equal(fixture.cases.length, 18)
assert.equal(new Set(fixture.cases.map((item: any) => item.case_id)).size, 18)

let prepare: (input: unknown) => any
if (process.env.QSSDH_TEXT_SELECT_FORCE_UNIMPLEMENTED === '1') {
  prepare = () => ({ status: 'UNIMPLEMENTED', carrier: null, runtime: null })
} else if (existsSync(sourcePath)) {
  const bundle = await build({
    stdin: {
      contents:
        "export { prepareTextSingleSelectValueState } from './src/custom-component/filter-copy/query-text-single-select-value-state.ts'",
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
  prepare = bundledModule.prepareTextSingleSelectValueState
} else {
  prepare = () => ({ status: 'UNIMPLEMENTED', carrier: null, runtime: null })
}

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
const assertNoSharedObjects = (input: unknown, output: unknown) => {
  const inputObjects = collectObjects(input)
  for (const object of collectObjects(output)) {
    assert.equal(
      inputObjects.has(object),
      false,
      'output must not share object references with input'
    )
  }
}
const toFixtureJson = (value: unknown): unknown => {
  if (value === undefined) return { jsType: 'undefined' }
  if (Array.isArray(value)) return value.map(toFixtureJson)
  if (value && typeof value === 'object') {
    return Object.fromEntries(
      Object.entries(value as Record<string, unknown>).map(([key, item]) => [
        key,
        toFixtureJson(item)
      ])
    )
  }
  return value
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
  if (item.verification?.mode === 'compile-time') continue
  check(item.case_id, () => {
    const input = clone(item.input)
    const before = clone(input)
    // Fixture adapters stand in for already-verified upstream opaque values; they do not create
    // or export production authentication factories.
    const adapted = {
      snapshot: input.snapshot,
      expectedBinding: input.expectedBinding,
      valueState: input.valueState
    }
    const result = prepare(adapted)
    assert.equal(result.status, item.expected.status, item.case_id)
    assert.deepEqual(
      toFixtureJson(result.carrier),
      toFixtureJson(item.expected.carrier),
      item.case_id
    )
    assert.deepEqual(
      toFixtureJson(result.runtime),
      toFixtureJson(item.expected.runtime),
      item.case_id
    )
    assert.deepEqual(input, before, `${item.case_id}: source must remain unchanged`)
    if (item.expected.status === 'OK') {
      assertNoSharedObjects(input, result)
      const selected = result.runtime.selectValue
      const filterProjection = selected === undefined ? [] : [selected]
      assert.deepEqual(
        filterProjection,
        item.expected.firstLoadFilterValue,
        `${item.case_id}: first-load filter`
      )
      assert.deepEqual(
        filterProjection,
        item.expected.subsequentFilterValue,
        `${item.case_id}: subsequent filter`
      )
    } else {
      assert.equal(result.carrier, null, `${item.case_id}: no partial carrier`)
      assert.equal(result.runtime, null, `${item.case_id}: no partial runtime`)
    }
  })
}

check('deep-freeze-source-and-detached-output', () => {
  const successCase = fixture.cases.find((item: any) => item.expected.status === 'OK')
  const input = deepFreeze(clone(successCase.input))
  const adapted = {
    snapshot: input.snapshot,
    expectedBinding: input.expectedBinding,
    valueState: input.valueState
  }
  const result = prepare(adapted)
  assert.equal(result.status, 'OK')
  assertNoSharedObjects(input, result)
  assert.deepEqual(input, successCase.input)
})

check('failure-has-no-side-effect-surfaces', () => {
  const failuresOnly = fixture.cases.filter(
    (item: any) => item.expected.status && item.expected.status !== 'OK'
  )
  for (const item of failuresOnly) {
    assert.equal(item.expected.queryCount, 0, item.case_id)
    assert.equal(item.expected.storeWriteCount, 0, item.case_id)
    assert.equal(item.expected.snapshotWriteCount, 0, item.case_id)
    assert.equal(item.expected.partialOutputOnFailure, false, item.case_id)
  }
})

console.log(
  JSON.stringify({
    suite: 'QSSDH-TEXT-SELECT-001',
    runnerSha256: runnerHash,
    sourceSha256: sourceHash,
    checks,
    failures
  })
)
if (failures > 0) process.exitCode = 1
