import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import ts from 'typescript'

const testDir = dirname(fileURLToPath(import.meta.url))
const frontendRoot = resolve(testDir, '../..')
const repoRoot = resolve(frontendRoot, '../..')
const featureRoot = resolve(
  repoRoot,
  'Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01'
)
const contract = JSON.parse(
  readFileSync(
    resolve(featureRoot, 'QueryProductAdapterSelectTextLocalValidatorHarnessContract-r001.json'),
    'utf8'
  )
)
const vuePath = resolve(
  frontendRoot,
  'src/custom-component/v-query/QueryConditionConfiguration.vue'
)
const vueSource = readFileSync(vuePath, 'utf8')
const script = vueSource.match(/<script[^>]*>([\s\S]*?)<\/script>/)?.[1]
assert.ok(script, 'Vue script block must exist')
const sourceFile = ts.createSourceFile(
  vuePath,
  script,
  ts.ScriptTarget.Latest,
  true,
  ts.ScriptKind.TS
)
assert.equal(sourceFile.parseDiagnostics.length, 0, 'Vue script block must parse')

const extractInitializer = name => {
  for (const statement of sourceFile.statements) {
    if (!ts.isVariableStatement(statement)) continue
    for (const declaration of statement.declarationList.declarations) {
      if (
        ts.isIdentifier(declaration.name) &&
        declaration.name.text === name &&
        declaration.initializer
      ) {
        const declarationText = `const ${name} = ${declaration.initializer.getText(sourceFile)}`
        return ts.transpileModule(declarationText, {
          compilerOptions: { target: ts.ScriptTarget.ES2022 }
        }).outputText
      }
    }
  }
  throw new Error(`source initializer not found: ${name}`)
}

const extracted = ['duplicateRemoval', 'setParams', 'validateConditionType', 'validate']
  .map(extractInitializer)
  .join('\n')

const restore = value => {
  if (Array.isArray(value)) return value.map(restore)
  if (value && typeof value === 'object') {
    if (Object.keys(value).length === 1 && value.$js === 'undefined') return undefined
    if (Object.keys(value).length === 1 && value.$date) return new Date(value.$date)
    return Object.fromEntries(Object.entries(value).map(([key, item]) => [key, restore(item)]))
  }
  return value
}

const snapshot = value => {
  if (value instanceof Date) return { $date: value.toISOString() }
  if (Array.isArray(value)) return value.map(snapshot)
  if (value && typeof value === 'object') {
    return Object.fromEntries(
      Object.entries(value).map(([key, item]) => [
        key,
        item === undefined ? { $js: 'undefined' } : snapshot(item)
      ])
    )
  }
  return value
}

const instantiate = initial => {
  const state = structuredClone(initial)
  const messages = state.messages
  const condition = state.condition
  assert.ok(Array.isArray(state.conditions) && state.conditions.length === 1)
  state.conditions[0] = condition
  const deps = {
    error(key) {
      messages.push({ kind: 'error', key })
    }
  }
  const run = new Function(
    'state',
    'deps',
    `
      const conditions = { value: state.conditions }
      const fields = { value: state.fields }
      const ElMessage = { error: deps.error }
      const t = key => key
      ${extracted}
      return { validate, state }
    `
  )
  return run(state, deps)
}

assert.equal(contract.status, 'frozen_for_local_harness_only')
assert.equal(contract.frozen_for_builder, true)
assert.equal(contract.case_count, 22)
assert.equal(contract.cases.length, contract.case_count)
assert.equal(new Set(contract.case_ids).size, contract.case_ids.length)

for (const item of contract.cases) {
  const harness = instantiate(restore(item.input))
  const returnValue = harness.validate()
  const actual = snapshot({ ...harness.state, returnValue })
  assert.deepEqual(actual, item.expected_after, `${item.case_id}/complete snapshot`)
}

console.log(
  `PASS ${contract.contract_id}: ${contract.case_count}/${contract.case_count} exact local validator snapshots; no Vue module evaluation or product wiring`
)
