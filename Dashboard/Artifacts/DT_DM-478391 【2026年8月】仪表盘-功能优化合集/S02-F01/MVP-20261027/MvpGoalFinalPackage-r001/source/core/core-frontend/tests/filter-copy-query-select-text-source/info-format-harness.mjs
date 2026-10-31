import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import ts from 'typescript'

const repoRoot = resolve(process.cwd(), '../..')
const artifactRoot = resolve(
  repoRoot,
  'Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01'
)
const contract = JSON.parse(
  readFileSync(
    resolve(artifactRoot, 'QueryProductAdapterSelectTextSourceHarnessContract-r001.json'),
    'utf8'
  )
)
assert.equal(contract.frozen_for_builder, true)
assert.deepEqual(contract.included_case_ids, ['ST-SRC-001'])

const sourcePath = resolve(repoRoot, 'core/core-frontend/src/custom-component/v-query/options.ts')
const source = readFileSync(sourcePath, 'utf8')
const sourceFile = ts.createSourceFile(
  sourcePath,
  source,
  ts.ScriptTarget.Latest,
  true,
  ts.ScriptKind.TS
)
assert.equal(sourceFile.parseDiagnostics.length, 0)

const infoFormat = sourceFile.statements
  .filter(ts.isVariableStatement)
  .flatMap(statement => [...statement.declarationList.declarations])
  .find(declaration => ts.isIdentifier(declaration.name) && declaration.name.text === 'infoFormat')
assert.ok(infoFormat?.initializer && ts.isArrowFunction(infoFormat.initializer))

// Extract and compile only the selected initializer. The module and its top-level
// `attributes` initialization are never imported or evaluated.
const extractedDeclaration = `const infoFormat = ${infoFormat.initializer.getText(sourceFile)}`
const compiled = ts.transpileModule(extractedDeclaration, {
  compilerOptions: { target: ts.ScriptTarget.ES2022 }
})
const fixedTime = '2026-10-20T00:00:00.000Z'
const NativeDate = Date
let observing = false
let dateConstructorCalls = 0
let guidCalls = 0

class FixedDate extends NativeDate {
  constructor(...args) {
    super(...(args.length ? args : [fixedTime]))
    if (observing) dateConstructorCalls += 1
  }
}

const guid = () => {
  if (observing) guidCalls += 1
  return 'guid-fixed-1'
}
const createInfoFormat = new Function('Date', 'guid', `${compiled.outputText}; return infoFormat`)
const invokeInfoFormat = createInfoFormat(FixedDate, guid)
const fixture = contract.case.variants.find(item => item.variant_id === 'CREATE')
assert.ok(fixture)

const decodeFixture = value => {
  if (Array.isArray(value)) return value.map(decodeFixture)
  if (value && typeof value === 'object') {
    if (Object.keys(value).length === 1 && value.$js === 'undefined') return undefined
    if (Object.keys(value).length === 1 && value.$date) return new NativeDate(value.$date)
    return Object.fromEntries(
      Object.entries(value).map(([key, item]) => [key, decodeFixture(item)])
    )
  }
  return value
}

const normalize = value => {
  if (value instanceof NativeDate) return { $date: value.toISOString() }
  if (Array.isArray(value)) return value.map(normalize)
  if (value && typeof value === 'object') {
    return Object.fromEntries(
      Object.entries(value).map(([key, item]) => [
        key,
        item === undefined ? { $js: 'undefined' } : normalize(item)
      ])
    )
  }
  return value
}

const input = decodeFixture(fixture.before.input)
const inputBefore = structuredClone(input)
dateConstructorCalls = 0
guidCalls = 0
observing = true
const returnValue = invokeInfoFormat(input)
observing = false

assert.deepEqual(
  normalize(returnValue),
  fixture.expected_after.returnValue,
  'ST-SRC-001/CREATE return snapshot'
)
assert.deepEqual(input, inputBefore, 'ST-SRC-001/CREATE must not mutate input')
assert.equal(
  dateConstructorCalls,
  fixture.expected_after.dateConstructorCalls,
  'Date calls in synchronous infoFormat window'
)
assert.equal(
  guidCalls,
  fixture.expected_after.guidCalls,
  'guid calls in synchronous infoFormat window'
)
assert.equal(
  Object.prototype.hasOwnProperty.call(returnValue, 'defaultValueFirstItem'),
  fixture.expected_after.ownDefaultValueFirstItem,
  'defaultValueFirstItem remains owned by the later attributes stage'
)

console.log(
  'PASS ST-SRC-001/CREATE: exact return snapshot; Date=2; guid=1; input unchanged; no module evaluation'
)
