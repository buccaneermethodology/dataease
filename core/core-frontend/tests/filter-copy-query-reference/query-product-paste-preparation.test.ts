import assert from 'node:assert/strict'
import { build } from 'esbuild'
import { createHash } from 'node:crypto'
import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import path from 'node:path'

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../../..')
const featureRoot = path.join(
  repoRoot,
  'Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01'
)
const fixturePath = path.join(featureRoot, 'QueryProductPastePreparationFixtures-r006.json')
const defaultSourcePath = path.join(
  repoRoot,
  'core/core-frontend/src/custom-component/filter-copy/query-product-paste-preparation.ts'
)
const sourcePath = process.argv[2] ? path.resolve(process.argv[2]) : defaultSourcePath
assert.ok(
  sourcePath.startsWith(
    path.join(repoRoot, 'core/core-frontend/src/custom-component/filter-copy/')
  ),
  'source override must remain inside the admitted filter-copy module directory'
)
const fixture = JSON.parse(readFileSync(fixturePath, 'utf8'))
const sourceText = readFileSync(sourcePath, 'utf8')
const sourceSha256 = createHash('sha256').update(sourceText).digest('hex')
const expectedIds = Array.from(
  { length: 31 },
  (_, index) => `QPP-${String(index + 1).padStart(3, '0')}`
)
assert.deepEqual(
  fixture.cases.map((item: { id: string }) => item.id),
  expectedIds
)

const bundle = await build({
  stdin: {
    contents: `export { prepareQueryProductPaste, revalidateQueryProductPaste } from ${JSON.stringify(
      path.relative(path.join(repoRoot, 'core/core-frontend'), sourcePath)
    )}`,
    // Keep the runner identity stable while allowing a replay script to point at a
    // temporary, source-bound semantic mutant in the same dependency directory.
    resolveDir: path.join(repoRoot, 'core/core-frontend')
  },
  bundle: true,
  write: false,
  format: 'esm',
  platform: 'node'
})
const module = await import(
  `data:text/javascript;base64,${Buffer.from(bundle.outputFiles[0].text).toString('base64')}`
)
const prepare = module.prepareQueryProductPaste as (input: unknown) => any
const revalidate = module.revalidateQueryProductPaste as (handle: unknown, current: unknown) => any
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
const requestKey = (evidence: Record<string, any>) =>
  createHash('sha256')
    .update(
      canonical({
        identityGeneration: evidence.identityGeneration,
        targetComponentId: evidence.targetComponentId,
        targetRevision: evidence.targetRevision,
        requestInput: evidence.requestInput
      })
    )
    .digest('hex')
const pointerParts = (pointer: string) =>
  pointer
    .slice(1)
    .split('/')
    .map(part => part.replace(/~1/g, '/').replace(/~0/g, '~'))
const parentAt = (root: any, pointer: string) => {
  const parts = pointerParts(pointer)
  const key = parts.pop()
  assert.notEqual(key, undefined, `invalid JSON pointer: ${pointer}`)
  let parent = root
  for (const part of parts) parent = parent[Array.isArray(parent) ? Number(part) : part]
  return { parent, key: key as string }
}
const applyPatch = (root: any, op: Record<string, any>) => {
  const { parent, key } = parentAt(root, op.path)
  if (op.op === 'add') {
    if (Array.isArray(parent)) {
      if (key === '-') parent.push(clone(op.value))
      else parent.splice(Number(key), 0, clone(op.value))
    } else parent[key] = clone(op.value)
    return
  }
  assert.ok(Object.hasOwn(parent, key), `path must exist: ${op.path}`)
  if (op.op === 'replace') {
    parent[key] = clone(op.value)
    return
  }
  assert.equal(op.op, 'remove')
  if (Array.isArray(parent)) parent.splice(Number(key), 1)
  else delete parent[key]
}
const applyRequestKeyInstruction = (root: any) => {
  if (root.targetEnumEvidence?.requestKey === 'RECOMPUTE_FROM_MUTATED_REQUEST') {
    root.targetEnumEvidence.requestKey = requestKey(root.targetEnumEvidence)
  }
}
const assertIndependentCopies = (input: unknown, candidate: unknown) => {
  const inputObjects = collectObjects(input)
  const candidateObjects = collectObjects(candidate)
  assert.equal(
    Array.from(candidateObjects).some(value => inputObjects.has(value)),
    false
  )
  if (candidate && typeof candidate === 'object') {
    const record = candidate as Record<string, unknown>
    if (record.designComponentData && record.runtimeTargetRoot) {
      const designObjects = collectObjects(record.designComponentData)
      const runtimeObjects = collectObjects(record.runtimeTargetRoot)
      assert.equal(
        Array.from(designObjects).some(value => runtimeObjects.has(value)),
        false
      )
    }
  }
}

const prepareBase = clone(fixture.base_input)
const preparedBase = prepare(prepareBase)
assert.equal(
  preparedBase.ok,
  true,
  'base fixture must establish a valid handle before revalidation cases'
)
assertIndependentCopies(prepareBase, preparedBase.candidate)

let checks = 0
const failures: string[] = []
for (const item of fixture.cases) {
  try {
    const isRevalidation =
      item.expected?.candidate !== undefined ||
      item.ops.some(
        (op: Record<string, string>) => op.path === '/handle' || op.path.startsWith('/current')
      )
    let actual: any
    let input: any
    let before: any
    if (!isRevalidation) {
      input = clone(fixture.base_input)
      for (const op of item.ops) applyPatch(input, op)
      applyRequestKeyInstruction(input)
      before = clone(input)
      deepFreeze(input)
      actual = prepare(input)
      assert.deepEqual(input, before, `${item.id}: prepare input unchanged`)
      if (item.expected.ok) {
        assert.equal(actual.ok, true, `${item.id}: prepare success`)
        assert.deepEqual(
          actual.candidate.designComponentData,
          item.expected.designComponentData,
          `${item.id}: design candidate`
        )
        assert.deepEqual(
          actual.candidate.runtimeTargetRoot,
          item.expected.runtimeTargetRoot,
          `${item.id}: runtime candidate`
        )
        assertIndependentCopies(input, actual.candidate)
      } else {
        assert.deepEqual(
          { ok: actual.ok, stage: actual.stage, reason: actual.reason },
          { ok: item.expected.ok, stage: item.expected.stage, reason: item.expected.reason },
          item.id
        )
        assert.equal('candidate' in actual, false, `${item.id}: failure has no candidate`)
      }
    } else {
      let handle = preparedBase.handle
      const current = clone(fixture.base_revalidation_input.current)
      let mutateReturnedCandidate = false
      for (const op of item.ops) {
        if (op.op === 'mutate_returned_candidate') mutateReturnedCandidate = true
        else if (op.op === 'revalidate_again') continue
        else if (op.path === '/handle') handle = clone(op.value)
        else if (op.path.startsWith('/current/'))
          applyPatch(current, { ...op, path: op.path.slice('/current'.length) })
        else if (op.path === '/current') applyPatch({ current }, op)
      }
      applyRequestKeyInstruction(current)
      if (mutateReturnedCandidate) {
        const target = parentAt(
          preparedBase.candidate,
          '/designComponentData/0/propValue/0/defaultValue'
        )
        target.parent[target.key] = 'POISON'
      }
      input = current
      before = clone(current)
      deepFreeze(current)
      actual = revalidate(handle, current)
      assert.deepEqual(current, before, `${item.id}: revalidation input unchanged`)
      if (item.expected.ok) {
        assert.equal(actual.ok, true, `${item.id}: revalidation success`)
        assert.deepEqual(
          actual.candidate.designComponentData,
          item.expected.candidate.designComponentData,
          `${item.id}: revalidated design candidate`
        )
        assert.deepEqual(
          actual.candidate.runtimeTargetRoot,
          item.expected.candidate.runtimeTargetRoot,
          `${item.id}: revalidated runtime candidate`
        )
        assert.equal(
          item.expected.candidate.eligibility,
          'requires_product_authorization_and_commit_design',
          `${item.id}: fixture-only eligibility boundary`
        )
        assert.equal(
          'eligibility' in actual.candidate,
          false,
          `${item.id}: helper does not authorize commit`
        )
        assertIndependentCopies(current, actual.candidate)
      } else {
        assert.deepEqual(
          { ok: actual.ok, stage: actual.stage, reason: actual.reason },
          { ok: item.expected.ok, stage: item.expected.stage, reason: item.expected.reason },
          item.id
        )
        assert.equal(
          'candidate' in actual,
          false,
          `${item.id}: revalidation failure has no candidate`
        )
      }
    }
    checks += 1
  } catch (error) {
    failures.push(`${item.id}: ${error instanceof Error ? error.message : String(error)}`)
    checks += 1
  }
}

assert.equal(checks, 31)
if (failures.length > 0) {
  console.error(
    `FAIL ${failures.length}/${checks} frozen cases; cases=${failures
      .map(item => item.slice(0, 7))
      .join(',')}`
  )
  console.error(failures.join('\n'))
  process.exitCode = 1
} else {
  console.log(`PASS ${checks} frozen cases; source_sha256=${sourceSha256}`)
}
