import assert from 'node:assert/strict'
import { build } from 'esbuild'
import vm from 'node:vm'
import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import path from 'node:path'

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../../..')
const base = path.join(
  repoRoot,
  'Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01'
)
const cases = JSON.parse(readFileSync(path.join(base, 'Cases.candidate.json'), 'utf8'))
const contract = JSON.parse(readFileSync(path.join(base, 'PureSubcontracts-r002.json'), 'utf8'))
const caseById = new Map()
for (const parent of cases.cases) {
  caseById.set(parent.case_id, parent)
  for (const child of parent.subcases || []) caseById.set(child.case_id, child)
}

const bundle = await build({
  stdin: {
    contents: `export { decideCompatibility, decideDataset, isTtlValid, utf8ByteLength, countTerminalLeaves, isWithinPayloadBounds } from './src/custom-component/filter-copy/pure-guards.ts'`,
    resolveDir: path.join(repoRoot, 'core/core-frontend')
  },
  bundle: true,
  write: false,
  format: 'cjs',
  platform: 'node'
})
const context = { module: { exports: {} }, exports: {}, TextEncoder }
vm.runInNewContext(bundle.outputFiles[0].text, context)
const guards = context.module.exports

// Post-hoc harness sensitivity control. This injects a known wrong result for
// one frozen case in the test process; it does not modify production source or
// recover the historical RED evidence.
const faultInjection = process.env.S02_PURE_GUARD_FAULT_INJECTION
if (faultInjection && faultInjection !== 'TC-Q004-01') {
  throw new Error(`unsupported fault injection case: ${faultInjection}`)
}

const ids = contract.frozen_case_ids
assert.equal(ids.length, 17)
assert.equal(new Set(ids).size, ids.length)
for (const id of ids) assert.ok(caseById.has(id), `missing case identity: ${id}`)

for (const id of ids.filter(id => id.startsWith('TC-Q004-'))) {
  const { source_kind, target_kind } = caseById.get(id).inputs
  const actual = guards.decideCompatibility(source_kind, target_kind)
  const observed =
    faultInjection === 'TC-Q004-01' && id === faultInjection
      ? { ...actual, compatibility_decision: 'reject' }
      : actual
  assert.equal(
    observed.compatibility_decision,
    caseById.get(id).expected.compatibility_decision,
    id
  )
}

for (const id of ids.filter(id => id.startsWith('TC-Q006-'))) {
  const { source_dataset_id, target_dataset_id, target_metadata_status } = caseById.get(id).inputs
  assert.deepEqual(
    JSON.parse(
      JSON.stringify(
        guards.decideDataset(source_dataset_id, target_dataset_id, target_metadata_status)
      )
    ),
    Object.fromEntries(
      Object.entries(caseById.get(id).expected).filter(([key]) =>
        ['decision', 'reason'].includes(key)
      )
    ),
    id
  )
}

for (const id of ids.filter(id => id.startsWith('TC-Q008-'))) {
  const { created_at_ms, now_ms } = caseById.get(id).inputs
  assert.equal(
    guards.isTtlValid(created_at_ms, now_ms, 1800000),
    caseById.get(id).expected.valid,
    id
  )
}

for (const id of ids.filter(id => id.startsWith('TC-Q013-BYTES-'))) {
  const targetBytes = caseById.get(id).inputs.payload_utf8_fixture.target_utf8_bytes
  const payloads = ['A'.repeat(targetBytes), `猫🙂${'A'.repeat(targetBytes - 7)}`]
  for (const payload of payloads) {
    assert.equal(guards.utf8ByteLength(payload), caseById.get(id).expected.measured_utf8_bytes, id)
    assert.equal(
      guards.isWithinPayloadBounds(1, guards.utf8ByteLength(payload)),
      caseById.get(id).expected.byte_guard_allows,
      id
    )
  }
}

for (const id of ids.filter(id => id.startsWith('TC-Q013-TREE-'))) {
  const { tree } = caseById.get(id).inputs
  const leaves = guards.countTerminalLeaves(tree)
  assert.equal(leaves, caseById.get(id).expected.leaf_count, id)
  assert.equal(guards.isWithinPayloadBounds(leaves, 1), caseById.get(id).expected.guard_allows, id)
}

const enumCase = caseById.get('TC-Q013-ENUM-1001')
assert.equal(enumCase.inputs.enum_count, 1001)
const enumPayloadBytes =
  enumCase.inputs.payload_bytes === 'within_limit' ? 12 : enumCase.inputs.payload_bytes
assert.equal(
  guards.isWithinPayloadBounds(enumCase.inputs.leaf_count, enumPayloadBytes),
  enumCase.expected.decision === 'allow',
  enumCase.case_id
)

console.log(`PASS: ${ids.length} bounded pure contract identities`)
