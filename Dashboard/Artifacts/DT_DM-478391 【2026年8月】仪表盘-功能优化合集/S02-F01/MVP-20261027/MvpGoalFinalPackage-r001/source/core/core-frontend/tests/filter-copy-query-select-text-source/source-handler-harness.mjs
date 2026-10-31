import assert from 'node:assert/strict'
import { createHash as nodeCreateHash } from 'node:crypto'
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
    resolve(featureRoot, 'ST-SRC-006-SourceHandlerHarnessContract-frozen-r001.json'),
    'utf8'
  )
)
const cases = JSON.parse(
  readFileSync(
    resolve(featureRoot, 'ST-SRC-006-SourceHandlerHarnessCases-frozen-r001.json'),
    'utf8'
  )
)

assert.equal(contract.frozen_for_builder, true)
assert.equal(cases.frozen_for_builder, true)
assert.equal(contract.execution_status, 'NOT_RUN')
assert.equal(cases.execution_status, 'NOT_RUN')
assert.equal(contract.case_fixture_sha256, fixtureHash(cases))
assert.equal(contract.case_fixture_ref, 'ST-SRC-006-SourceHandlerHarnessCases-frozen-r001.json')

function fixtureHash(value) {
  // Hash the checked-in fixture bytes through Node's built-in crypto module.
  return nodeCreateHash('sha256')
    .update(JSON.stringify(value, null, 2) + '\n')
    .digest('hex')
}
const restore = value => {
  if (Array.isArray(value)) return value.map(restore)
  if (value && typeof value === 'object') {
    if (Object.keys(value).length === 1 && value.$undefined === true) return undefined
    return Object.fromEntries(Object.entries(value).map(([key, item]) => [key, restore(item)]))
  }
  return value
}
const snapshot = value => {
  if (Array.isArray(value)) return value.map(snapshot)
  if (value && typeof value === 'object') {
    return Object.fromEntries(
      Object.entries(value).map(([key, item]) => [
        key,
        item === undefined ? { $undefined: true } : snapshot(item)
      ])
    )
  }
  return value
}

const readScript = relative => {
  const path = resolve(frontendRoot, relative)
  const source = readFileSync(path, 'utf8')
  const script = source.match(/<script[^>]*>([\s\S]*?)<\/script>/)?.[1]
  assert.ok(script, `${relative}: script block must exist`)
  const sourceFile = ts.createSourceFile(
    path,
    script,
    ts.ScriptTarget.Latest,
    true,
    ts.ScriptKind.TS
  )
  assert.equal(sourceFile.parseDiagnostics.length, 0, `${relative}: script block must parse`)
  return sourceFile
}

const selectFile = readScript('src/custom-component/v-query/Select.vue')
const configFile = readScript('src/custom-component/v-query/QueryConditionConfiguration.vue')
const componentFile = readScript('src/custom-component/v-query/Component.vue')
const extract = (sourceFile, name) => {
  for (const statement of sourceFile.statements) {
    if (!ts.isVariableStatement(statement)) continue
    for (const declaration of statement.declarationList.declarations) {
      if (
        ts.isIdentifier(declaration.name) &&
        declaration.name.text === name &&
        declaration.initializer
      ) {
        return ts.transpileModule(
          `const ${name} = ${declaration.initializer.getText(sourceFile)}`,
          {
            compilerOptions: { target: ts.ScriptTarget.ES2022 }
          }
        ).outputText
      }
    }
  }
  throw new Error(`source initializer not found: ${name}`)
}

const extracted = [
  extract(selectFile, 'setDefaultValueFirstItem'),
  extract(selectFile, 'setDefaultMapValue'),
  extract(selectFile, 'setCascadeValueBack'),
  extract(selectFile, 'emitCascade'),
  extract(selectFile, 'emitCascadeConfig'),
  extract(configFile, 'setCascadeDefault'),
  extract(componentFile, 'isConfirmSearch').replace(
    'const isConfirmSearch =',
    'const isConfirmSearchOwner ='
  ),
  `const isConfirmSearch = (id, disabledFirstItem = false) => {
    confirmSearchCalls.push([id, disabledFirstItem])
    return isConfirmSearchOwner(id, disabledFirstItem)
  }`
].join('\n')

const makeHarness = before => {
  const state = structuredClone(before)
  const cascadeEvents = []
  const confirmSearchCalls = []
  const queryDataForIdCalls = []
  const nextTickQueue = []
  const config = { value: state.config }
  const props = state.props
  const selectValue = { value: state.selectValue }
  const options = { value: state.options }
  const cascade = { value: state.cascade }
  const conditions = { value: state.conditions }
  let enumValueArr = state.enumValueArr
  let isFromFromCascade = state.isFromFromCascade
  const componentWithSure = { value: state.componentWithSure }
  const emitter = { emit: name => cascadeEvents.push(name) }
  const run = new Function(
    'state',
    'config',
    'props',
    'selectValue',
    'options',
    'cascade',
    'conditions',
    'enumValueArr',
    'isFromFromCascade',
    'componentWithSure',
    'cascadeEvents',
    'confirmSearchCalls',
    'queryDataForIdCalls',
    'nextTickQueue',
    'emitter',
    `
      const cloneDeep = value => structuredClone(value)
      const useEmitt = () => ({ emitter })
      const nextTick = callback => nextTickQueue.push(callback)
      const queryDataForId = id => queryDataForIdCalls.push(id)
      const callConfirmSearch = (id, disabledFirstItem = false) => isConfirmSearch(id, disabledFirstItem)
      ${extracted}
      return {
        setDefaultValueFirstItem,
        emitCascadeConfig,
        callConfirmSearch,
        flushNextTick() {
          while (nextTickQueue.length) nextTickQueue.shift()()
        },
        values() {
          return {
            config: config.value,
            selectValue: selectValue.value,
            cascade: cascade.value,
            conditions: conditions.value,
            isFromFromCascade
          }
        }
      }
    `
  )
  const harness = run(
    state,
    config,
    props,
    selectValue,
    options,
    cascade,
    conditions,
    enumValueArr,
    isFromFromCascade,
    componentWithSure,
    cascadeEvents,
    confirmSearchCalls,
    queryDataForIdCalls,
    nextTickQueue,
    emitter
  )
  return { harness, state, cascadeEvents, confirmSearchCalls, queryDataForIdCalls, nextTickQueue }
}

const project = (expected, actual) => {
  const output = {}
  for (const key of Object.keys(expected)) output[key] = actual[key]
  return snapshot(output)
}

const mode = process.argv[2] ?? '--mode=green'
assert.ok(
  ['--mode=green', '--mode=red'].includes(mode),
  'usage: node source-handler-harness.mjs --mode=green|--mode=red'
)
assert.equal(contract.design_id, cases.design_id)
assert.equal(contract.case_ids.length, cases.cases.length)
assert.equal(new Set(contract.case_ids).size, contract.case_ids.length)
assert.deepEqual(
  cases.cases.map(item => item.case_id),
  contract.case_ids
)

let checks = 0
for (const testCase of cases.cases) {
  for (const variant of testCase.variants) {
    const expected = structuredClone(variant.expected)
    if (mode === '--mode=red' && checks === 0) expected.selectValue = '__ST-SRC-006_EXPECTED_RED__'
    let actual

    if (testCase.case_id === 'ST-SRC-006-CONFIRM-GUARD') {
      const { harness, confirmSearchCalls, queryDataForIdCalls } = makeHarness({
        id: variant.before.id,
        componentWithSure: variant.before.componentWithSure,
        disabledFirstItem: variant.before.disabledFirstItem,
        config: {},
        props: {},
        selectValue: undefined,
        options: [],
        enumValueArr: [],
        cascade: [],
        conditions: [],
        isFromFromCascade: false
      })
      const returnValue = harness.callConfirmSearch(
        variant.before.id,
        variant.before.disabledFirstItem
      )
      actual = {
        id: variant.before.id,
        componentWithSure: variant.before.componentWithSure,
        disabledFirstItem: variant.before.disabledFirstItem,
        returnValue,
        queryDataForIdCalls
      }
      assert.deepEqual(
        project(expected, actual),
        expected,
        `${testCase.case_id}/${variant.variant_id}`
      )
      checks += 1
      continue
    }

    const instance = makeHarness(restore(variant.before))
    const { harness, cascadeEvents, confirmSearchCalls, queryDataForIdCalls, nextTickQueue } =
      instance
    harness.setDefaultValueFirstItem()
    const nextTickQueueLengthBeforeFlush = nextTickQueue.length
    const confirmSearchCallsBeforeNextTick = structuredClone(confirmSearchCalls)
    harness.flushNextTick()
    const nextTickQueueLengthAfterFlush = nextTickQueue.length
    const confirmSearchCallsAfterNextTick = structuredClone(confirmSearchCalls)
    actual = {
      ...harness.values(),
      cascadeEvents,
      nextTickQueueLengthBeforeFlush,
      nextTickQueueLengthAfterFlush,
      isFromFromCascadeAfterFlush: harness.values().isFromFromCascade,
      confirmSearchCallsBeforeNextTick,
      confirmSearchCallsAfterNextTick,
      queryDataForIdCalls,
      componentWithSure: variant.before.componentWithSure
    }
    delete actual.isFromFromCascade
    assert.deepEqual(
      project(expected, actual),
      expected,
      `${testCase.case_id}/${variant.variant_id}`
    )
    checks += 1
  }
}

if (mode === '--mode=red') throw new Error('controlled expected-leaf mutation unexpectedly passed')
console.log(
  `PASS ${contract.design_id}: ${checks}/${checks} exact frozen local source-handler snapshots; no Vue mount or product wiring`
)
