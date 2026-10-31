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
    resolve(featureRoot, 'QueryProductAdapterSelectTextSourceHandlerHarnessContract-r001.json'),
    'utf8'
  )
)
const vuePath = resolve(
  frontendRoot,
  'src/custom-component/v-query/QueryConditionConfiguration.vue'
)
const source = readFileSync(vuePath, 'utf8')
const script = source.match(/<script[^>]*>([\s\S]*?)<\/script>/)?.[1]
assert.ok(script, 'Vue script block must exist')
const sourceFile = ts.createSourceFile(
  vuePath,
  script,
  ts.ScriptTarget.Latest,
  true,
  ts.ScriptKind.TS
)

const getInitializer = name => {
  for (const statement of sourceFile.statements) {
    if (!ts.isVariableStatement(statement)) continue
    for (const declaration of statement.declarationList.declarations) {
      if (
        ts.isIdentifier(declaration.name) &&
        declaration.name.text === name &&
        declaration.initializer
      ) {
        return declaration.initializer.getText(sourceFile)
      }
    }
  }
  throw new Error(`source handler not found: ${name}`)
}

const handlerNames = [
  'duplicateRemoval',
  'getOptions',
  'multipleChange',
  'handleDatasetChange',
  'handleValueSourceChange',
  'handleCurrentChange',
  'confirmIdChange',
  'clearCascadeArrDataset',
  'validate',
  'confirmValueSource',
  'cancelValueSource'
]
const extracted = handlerNames
  .map(name => {
    const declaration = `const ${name} = ${getInitializer(name)}`
    return ts.transpileModule(declaration, {
      compilerOptions: { target: ts.ScriptTarget.ES2022 }
    }).outputText
  })
  .join('\n')

const makeHarness = initial => {
  const state = structuredClone(initial)
  const requests = []
  const pendingRequests = []
  let confirmationRecord = null
  let confirmationResolve
  let confirmResolve
  const deps = {
    requests,
    pendingRequests,
    listFieldsWithPermissions(id, condition) {
      let resolve
      const promise = new Promise(yes => {
        resolve = yes
      })
      const record = {
        dependency: 'listFieldsWithPermissions',
        args: [id],
        promise: `P${requests.length + 1}`,
        state: 'pending'
      }
      requests.push(record)
      pendingRequests.push({
        record,
        resolve(data) {
          record.state = 'fulfilled'
          resolve({ data })
        },
        condition
      })
      return promise
    },
    confirm(messageKey, options) {
      confirmationRecord = {
        messageKey,
        options: structuredClone(options),
        promise: 'C1',
        state: 'pending'
      }
      state.confirmation = confirmationRecord
      const promise = new Promise(resolve => {
        confirmationResolve = resolve
      })
      confirmResolve = () => {
        confirmationRecord.state = 'fulfilled'
        confirmationResolve()
      }
      return promise
    },
    resolveConfirmation() {
      confirmResolve()
    },
    cancelConfirmationSignal() {
      confirmationRecord.state = 'cancelled_signal_without_js_rejection'
    },
    error(key) {
      state.messages.push({ kind: 'error', key })
    }
  }
  const instantiate = new Function(
    'state',
    'deps',
    `
      const curComponent = { value: state.condition }
      const conditions = { value: state.conditions || [state.condition] }
      const fields = { value: state.fields }
      const valueSource = { value: state.manualBuffer || [] }
      const manual = { value: { hide() {} } }
      const ElMessage = { error: deps.error }
      const ElMessageBox = { confirm: deps.confirm }
      const listFieldsWithPermissions = deps.listFieldsWithPermissions
      const cloneDeep = value => structuredClone(value)
      const t = key => key
      let cascadeArr = state.cascadeArr
      let newDatasetId = state.newDatasetId
      let oldDatasetId = state.oldDatasetId
      ${extracted}
      return {
        handleDatasetChange,
        handleValueSourceChange,
        handleCurrentChange,
        validate,
        confirmValueSource,
        resolveConfirmation() { deps.resolveConfirmation() },
        cancelConfirmationSignal() { deps.cancelConfirmationSignal() },
        resolveRequest(index, data) { deps.pendingRequests[index].resolve(data) },
        requests: deps.requests,
        cascade() { return cascadeArr },
        datasetIds() { return { newDatasetId, oldDatasetId } },
        state
      }
    `
  )
  const harness = instantiate(state, deps)
  return harness
}

const fixtureValue = value => {
  if (Array.isArray(value)) return value.map(fixtureValue)
  if (value && typeof value === 'object') {
    if (Object.keys(value).length === 1 && value.$js === 'undefined') return undefined
    if (Object.keys(value).length === 1 && value.$date) return new Date(value.$date)
    return Object.fromEntries(Object.entries(value).map(([key, item]) => [key, fixtureValue(item)]))
  }
  return value
}

const cloneForCompare = value => {
  if (value instanceof Date) return { $date: value.toISOString() }
  if (Array.isArray(value)) return value.map(cloneForCompare)
  if (value && typeof value === 'object') {
    return Object.fromEntries(
      Object.entries(value).map(([key, item]) => [
        key,
        item === undefined ? { $js: 'undefined' } : cloneForCompare(item)
      ])
    )
  }
  return value
}

const flush = async () => {
  await Promise.resolve()
  await Promise.resolve()
}

let checks = 0
const cases = contract.cases.flatMap(item =>
  item.variants.map(variant => ({ caseId: item.case_id, ...variant }))
)
assert.equal(contract.frozen_for_builder, true)
assert.deepEqual(contract.included_case_ids, [
  'ST-SRC-002',
  'ST-SRC-003',
  'ST-SRC-004',
  'ST-SRC-005'
])

for (const item of cases) {
  const initial = fixtureValue(item.before)
  if (item.caseId === 'ST-SRC-005' && initial.conditions) initial.conditions[0] = initial.condition
  const harness = makeHarness(initial)
  const startPromiseCount = harness.requests.length

  if (item.caseId === 'ST-SRC-002' && item.variant_id === 'DATASET-CHANGE') {
    harness.handleDatasetChange()
    assert.equal(harness.requests.length, startPromiseCount + 1)
    assert.deepEqual(
      cloneForCompare({
        condition: harness.state.condition,
        fields: harness.state.fields,
        cascadeArr: harness.cascade(),
        newDatasetId: harness.datasetIds().newDatasetId,
        oldDatasetId: harness.datasetIds().oldDatasetId,
        queryElement: harness.state.queryElement,
        requests: harness.requests,
        messages: harness.state.messages,
        confirmation: harness.state.confirmation,
        publishCount: harness.state.publishCount,
        snapshotCount: harness.state.snapshotCount,
        queryCount: harness.state.queryCount,
        saveCount: harness.state.saveCount
      }),
      item.assertions.pending_checkpoint,
      `${item.caseId}/${item.variant_id}/pending`
    )
    harness.resolveRequest(0, item.assertions.response.data)
    await flush()
  } else if (item.caseId === 'ST-SRC-002') {
    harness.handleValueSourceChange()
  } else if (item.caseId === 'ST-SRC-003') {
    harness.handleValueSourceChange()
    if (harness.requests.length) {
      harness.resolveRequest(0, item.assertions.response.data)
      await flush()
    }
  } else if (item.caseId === 'ST-SRC-004' && item.variant_id === 'CONFIRM') {
    harness.handleCurrentChange({ id: initial.newDatasetId })
    harness.handleDatasetChange()
    assert.deepEqual(
      cloneForCompare({
        condition: harness.state.condition,
        fields: harness.state.fields,
        cascadeArr: harness.cascade(),
        newDatasetId: harness.datasetIds().newDatasetId,
        oldDatasetId: harness.datasetIds().oldDatasetId,
        queryElement: harness.state.queryElement,
        requests: harness.requests,
        messages: harness.state.messages,
        confirmation: harness.state.confirmation,
        publishCount: harness.state.publishCount,
        snapshotCount: harness.state.snapshotCount,
        queryCount: harness.state.queryCount,
        saveCount: harness.state.saveCount
      }),
      item.assertions.pending_checkpoint,
      `${item.caseId}/${item.variant_id}/pending`
    )
    harness.resolveConfirmation()
    await flush()
    if (harness.requests.length) {
      harness.resolveRequest(0, item.assertions.response.data)
      await flush()
    }
  } else if (item.caseId === 'ST-SRC-004') {
    harness.handleCurrentChange({ id: initial.newDatasetId })
    harness.handleDatasetChange()
    assert.deepEqual(
      cloneForCompare({
        condition: harness.state.condition,
        fields: harness.state.fields,
        cascadeArr: harness.cascade(),
        newDatasetId: harness.datasetIds().newDatasetId,
        oldDatasetId: harness.datasetIds().oldDatasetId,
        queryElement: harness.state.queryElement,
        requests: harness.requests,
        messages: harness.state.messages,
        confirmation: harness.state.confirmation,
        publishCount: harness.state.publishCount,
        snapshotCount: harness.state.snapshotCount,
        queryCount: harness.state.queryCount,
        saveCount: harness.state.saveCount
      }),
      item.assertions.pending_checkpoint,
      `${item.caseId}/${item.variant_id}/pending`
    )
    harness.cancelConfirmationSignal()
  } else if (item.caseId === 'ST-SRC-005' && item.variant_id === 'MANUAL-BUFFER-WHITESPACE') {
    harness.confirmValueSource()
  } else if (item.caseId === 'ST-SRC-005') {
    harness.state.returnValue = harness.validate()
  }

  const actual = {
    condition: harness.state.condition,
    fields: harness.state.fields,
    cascadeArr: harness.cascade(),
    newDatasetId: harness.datasetIds().newDatasetId,
    oldDatasetId: harness.datasetIds().oldDatasetId,
    queryElement: harness.state.queryElement,
    requests: harness.requests,
    messages: harness.state.messages,
    confirmation: harness.state.confirmation,
    publishCount: harness.state.publishCount,
    snapshotCount: harness.state.snapshotCount,
    queryCount: harness.state.queryCount,
    saveCount: harness.state.saveCount
  }
  if (harness.state.conditions) {
    actual.conditions = harness.state.conditions
    actual.returnValue = harness.state.returnValue
  }
  if (harness.state.manualBuffer) actual.manualBuffer = harness.state.manualBuffer
  assert.deepEqual(
    cloneForCompare(actual),
    item.expected_after,
    `${item.caseId}/${item.variant_id}`
  )
  checks += 1
  console.log(`PASS ${item.caseId}/${item.variant_id}`)
}

console.log(
  JSON.stringify({ suite: 'ST-SRC-002-005-HANDLER-HARNESS', cases: cases.length, checks })
)
