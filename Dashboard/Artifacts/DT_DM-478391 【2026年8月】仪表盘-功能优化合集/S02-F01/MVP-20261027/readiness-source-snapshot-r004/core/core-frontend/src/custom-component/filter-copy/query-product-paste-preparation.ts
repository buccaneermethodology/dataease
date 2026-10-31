import CryptoJS from 'crypto-js/crypto-js'
import { rebuildSingleSelectTarget } from './query-single-select-target-rebuild'

type JsonRecord = Record<string, unknown>
type FailureStage =
  | 'ENVELOPE'
  | 'TARGET'
  | 'QCARRIER'
  | 'PLAN'
  | 'DIRECTORY'
  | 'DEFAULT_ENUM'
  | 'CANDIDATE_BINDING'
type FailureReason =
  | 'INVALID_INPUT'
  | 'UNSUPPORTED_FIELD'
  | 'TARGET_NOT_UNIQUE'
  | 'TARGET_VERSION_MISMATCH'
  | 'TARGET_UNRESOLVED'
  | 'UNSUPPORTED_SHAPE'
  | 'QVALUE_ERROR'
  | 'PLAN_MISMATCH'
  | 'ENUM_UNVERIFIED'
  | 'ENUM_REQUEST_MISMATCH'
  | 'ENUM_COMPLETENESS_INVALID'
  | 'ENUM_UNCERTAIN'
  | 'DEFAULT_NOT_FOUND'
  | 'HANDLE_INVALID'
  | 'DEPENDENCY_CHANGED'
type Failure = { ok: false; stage: FailureStage; reason: FailureReason }
type Candidate = { designComponentData: JsonRecord[]; runtimeTargetRoot: JsonRecord[] }
type IssuedHandle = {
  candidate: Candidate
  targetRevisionDigest: string
  targetComponentDataDigest: string
  targetComponentsDigest: string
  sourceComponentsDigest: string
  targetEnumEvidenceDigest: string
}

const handles = new WeakMap<object, IssuedHandle>()
const fail = (stage: FailureStage, reason: FailureReason): Failure => ({ ok: false, stage, reason })
const isRecord = (value: unknown): value is JsonRecord =>
  value !== null && typeof value === 'object' && !Array.isArray(value)

const isJsonValue = (value: unknown, stack = new WeakSet<object>()): boolean => {
  if (value === null || typeof value === 'string' || typeof value === 'boolean') return true
  if (typeof value === 'number') return Number.isFinite(value)
  if (typeof value !== 'object' || stack.has(value)) return false
  stack.add(value)
  try {
    if (Array.isArray(value)) {
      if (Object.getPrototypeOf(value) !== Array.prototype) return false
      const keys = Reflect.ownKeys(value)
      if (keys.length !== value.length + 1 || !keys.includes('length')) return false
      for (let index = 0; index < value.length; index += 1) {
        const descriptor = Object.getOwnPropertyDescriptor(value, String(index))
        if (!descriptor || !descriptor.enumerable || !('value' in descriptor)) return false
        if (!isJsonValue(descriptor.value, stack)) return false
      }
      return true
    }
    if (Object.getPrototypeOf(value) !== Object.prototype) return false
    for (const key of Reflect.ownKeys(value)) {
      if (typeof key !== 'string') return false
      const descriptor = Object.getOwnPropertyDescriptor(value, key)
      if (!descriptor || !descriptor.enumerable || !('value' in descriptor)) return false
      if (!isJsonValue(descriptor.value, stack)) return false
    }
    return true
  } finally {
    stack.delete(value)
  }
}

const exactKeys = (value: JsonRecord, keys: readonly string[]) => {
  const actual = Object.keys(value)
  return actual.length === keys.length && keys.every(key => Object.hasOwn(value, key))
}
const hasUnknownKeys = (value: JsonRecord, keys: readonly string[]) =>
  Object.keys(value).some(key => !keys.includes(key))
const isId = (value: unknown): value is string =>
  typeof value === 'string' && value.length > 0 && !value.includes('--')

const cloneJson = <T>(value: T): T => {
  if (Array.isArray(value)) return value.map(item => cloneJson(item)) as T
  if (isRecord(value)) {
    const copy: JsonRecord = {}
    Object.entries(value).forEach(([key, item]) => {
      Object.defineProperty(copy, key, {
        value: cloneJson(item),
        enumerable: true,
        configurable: true,
        writable: true
      })
    })
    return copy as T
  }
  return value
}

const canonicalJson = (value: unknown): string => {
  if (Array.isArray(value)) return `[${value.map(item => canonicalJson(item)).join(',')}]`
  if (isRecord(value)) {
    return `{${Object.keys(value)
      .sort()
      .map(key => `${JSON.stringify(key)}:${canonicalJson(value[key])}`)
      .join(',')}}`
  }
  return JSON.stringify(value)
}
const digest = (value: unknown) => CryptoJS.SHA256(canonicalJson(value)).toString(CryptoJS.enc.Hex)
const revisionDigest = (value: unknown) => digest(value)

const makeCandidate = (target: JsonRecord, rebuilt: JsonRecord): Candidate | undefined => {
  const targetId = target.componentId
  const componentData = target.componentData as JsonRecord[]
  const designComponentData = cloneJson(componentData)
  const runtimeTargetRoot = cloneJson(componentData)
  const designTarget = designComponentData.find(component => component.id === targetId)
  const runtimeTarget = runtimeTargetRoot.find(component => component.id === targetId)
  const rebuiltValue = rebuilt.value as JsonRecord
  const designValue = rebuiltValue.design as JsonRecord
  const runtimeValue = rebuiltValue.runtime as JsonRecord
  if (!designTarget || !runtimeTarget) return undefined
  designTarget.propValue = cloneJson(designValue.propValue)
  designTarget.cascade = cloneJson(designValue.cascade)
  runtimeTarget.propValue = cloneJson(runtimeValue.propValue)
  runtimeTarget.cascade = cloneJson(runtimeValue.cascade)
  return { designComponentData, runtimeTargetRoot }
}

const targetFailure = (input: JsonRecord): Failure | undefined => {
  const target = input.target
  if (!isRecord(target)) return fail('TARGET', 'TARGET_NOT_UNIQUE')
  if (
    hasUnknownKeys(target, [
      'componentId',
      'expectedRevision',
      'expectedSignature',
      'componentData'
    ])
  ) {
    return fail('TARGET', 'TARGET_VERSION_MISMATCH')
  }
  if (
    !exactKeys(target, ['componentId', 'expectedRevision', 'expectedSignature', 'componentData']) ||
    !isId(target.componentId) ||
    !Array.isArray(target.componentData) ||
    target.componentData.some(component => !isRecord(component))
  ) {
    return fail('TARGET', 'TARGET_NOT_UNIQUE')
  }
  const matches = (target.componentData as JsonRecord[]).filter(
    component => component.id === target.componentId
  )
  if (
    matches.length !== 1 ||
    matches[0].component !== 'VQuery' ||
    matches[0].innerType !== 'VQuery'
  ) {
    return fail('TARGET', 'TARGET_NOT_UNIQUE')
  }
  if (
    (typeof target.expectedRevision !== 'string' && typeof target.expectedRevision !== 'number') ||
    (typeof target.expectedRevision === 'number' && !Number.isFinite(target.expectedRevision)) ||
    typeof target.expectedSignature !== 'string' ||
    !/^[a-f0-9]{64}$/.test(target.expectedSignature) ||
    target.expectedSignature !== revisionDigest(target.componentData)
  ) {
    return fail('TARGET', 'TARGET_VERSION_MISMATCH')
  }
  return undefined
}

const expectedRequestInput = (condition: JsonRecord, resultMode: number) => {
  const field = condition.field
  if (!isRecord(field) || typeof field.id !== 'string') return undefined
  const sort = condition.sort === 'customSort' ? 'asc' : condition.sort
  return {
    queryId: field.id,
    displayId: condition.displayId || field.id,
    sort,
    sortId: condition.sort === 'customSort' ? '' : condition.sortId,
    resultMode,
    searchText: '',
    filter: []
  }
}

const validateEnumEvidence = (
  evidenceValue: unknown,
  target: JsonRecord,
  condition: JsonRecord
): Failure | undefined => {
  const evidenceKeys = [
    'status',
    'targetComponentId',
    'targetRevision',
    'identityGeneration',
    'requestInput',
    'requestKey',
    'rows',
    'complete'
  ]
  if (!isRecord(evidenceValue)) return fail('DEFAULT_ENUM', 'ENUM_UNVERIFIED')
  if (hasUnknownKeys(evidenceValue, evidenceKeys) || !exactKeys(evidenceValue, evidenceKeys)) {
    return fail('DEFAULT_ENUM', 'ENUM_UNVERIFIED')
  }
  const evidence = evidenceValue
  if (
    evidence.status !== 'resolved' ||
    evidence.targetComponentId !== target.componentId ||
    evidence.targetRevision !== target.expectedRevision ||
    typeof evidence.identityGeneration !== 'number' ||
    !Number.isInteger(evidence.identityGeneration) ||
    evidence.identityGeneration < 0 ||
    typeof evidence.requestKey !== 'string' ||
    !/^[a-f0-9]{64}$/.test(evidence.requestKey) ||
    !Array.isArray(evidence.rows) ||
    typeof evidence.complete !== 'boolean'
  ) {
    return fail('DEFAULT_ENUM', 'ENUM_UNVERIFIED')
  }
  const requestInput = evidence.requestInput
  const requestKeys = [
    'queryId',
    'displayId',
    'sort',
    'sortId',
    'resultMode',
    'searchText',
    'filter'
  ]
  if (!isRecord(requestInput) || !exactKeys(requestInput, requestKeys)) {
    return fail('DEFAULT_ENUM', 'ENUM_UNVERIFIED')
  }
  const resultMode = requestInput.resultMode
  if (resultMode !== 0 && resultMode !== 1) return fail('DEFAULT_ENUM', 'ENUM_UNVERIFIED')
  const expectedRequest = expectedRequestInput(condition, resultMode)
  if (!expectedRequest) return fail('DEFAULT_ENUM', 'ENUM_UNVERIFIED')
  const keyInput = {
    identityGeneration: evidence.identityGeneration,
    targetComponentId: evidence.targetComponentId,
    targetRevision: evidence.targetRevision,
    requestInput
  }
  if (evidence.requestKey !== digest(keyInput)) return fail('DEFAULT_ENUM', 'ENUM_UNVERIFIED')
  if (canonicalJson(requestInput) !== canonicalJson(expectedRequest)) {
    return fail('DEFAULT_ENUM', 'ENUM_REQUEST_MISMATCH')
  }
  if (evidence.complete && resultMode !== 1) {
    return fail('DEFAULT_ENUM', 'ENUM_COMPLETENESS_INVALID')
  }

  const rowPairs: { displayValue: string; fieldValue: string }[] = []
  for (const row of evidence.rows) {
    if (row === null) continue
    if (
      !isRecord(row) ||
      !exactKeys(row, ['displayValue', 'fieldValue']) ||
      typeof row.displayValue !== 'string' ||
      typeof row.fieldValue !== 'string'
    ) {
      return fail('DEFAULT_ENUM', 'ENUM_UNVERIFIED')
    }
    rowPairs.push({ displayValue: row.displayValue, fieldValue: row.fieldValue })
  }
  const seen = new Set<string>()
  const uniqueRows = rowPairs.filter(row => {
    if (seen.has(row.displayValue)) return false
    seen.add(row.displayValue)
    return true
  })
  const defaultValue = condition.defaultValue
  const defaultMapValue = condition.defaultMapValue
  if (
    typeof defaultValue !== 'string' ||
    !Array.isArray(defaultMapValue) ||
    defaultMapValue.length !== 1
  ) {
    return fail('DEFAULT_ENUM', 'ENUM_UNVERIFIED')
  }
  const pairedDefault = uniqueRows.find(row => row.displayValue === defaultValue)
  if (!pairedDefault || pairedDefault.fieldValue !== defaultMapValue[0]) {
    return fail('DEFAULT_ENUM', evidence.complete ? 'DEFAULT_NOT_FOUND' : 'ENUM_UNCERTAIN')
  }
  return undefined
}

export const prepareQueryProductPaste = (inputValue: unknown) => {
  if (!isRecord(inputValue) || !isJsonValue(inputValue)) return fail('ENVELOPE', 'INVALID_INPUT')
  const input = inputValue
  const envelopeKeys = [
    'schemaVersion',
    'source',
    'target',
    'referencePlan',
    'sourceComponents',
    'targetComponents',
    'targetEnumEvidence'
  ]
  if (hasUnknownKeys(input, envelopeKeys)) return fail('ENVELOPE', 'UNSUPPORTED_FIELD')
  if (!exactKeys(input, envelopeKeys) || input.schemaVersion !== 's02.query-paste-preparation/1') {
    return fail('ENVELOPE', 'INVALID_INPUT')
  }
  if (!Array.isArray(input.sourceComponents)) return fail('ENVELOPE', 'INVALID_INPUT')
  if (!Array.isArray(input.targetComponents)) return fail('ENVELOPE', 'INVALID_INPUT')

  const targetError = targetFailure(input)
  if (targetError) return targetError
  const target = input.target as JsonRecord
  const source = input.source
  if (
    !isRecord(source) ||
    !exactKeys(source, ['componentId', 'sourceRoot']) ||
    !isId(source.componentId) ||
    !isRecord(source.sourceRoot)
  ) {
    return fail(
      'QCARRIER',
      isRecord(source) && hasUnknownKeys(source, ['componentId', 'sourceRoot'])
        ? 'UNSUPPORTED_FIELD'
        : 'INVALID_INPUT'
    )
  }
  const sourceRoot = source.sourceRoot
  const sourceConditions = sourceRoot.propValue
  if (
    !Array.isArray(sourceConditions) ||
    sourceConditions.length !== 1 ||
    !isRecord(sourceConditions[0])
  ) {
    return fail('QCARRIER', 'UNSUPPORTED_SHAPE')
  }

  const rebuilt = rebuildSingleSelectTarget({
    source: sourceRoot,
    referencePlan: input.referencePlan,
    targetComponents: input.targetComponents
  })
  if (!rebuilt.ok) {
    const stage =
      rebuilt.stage === 'ENVELOPE' || rebuilt.stage === 'QCARRIER' ? 'QCARRIER' : rebuilt.stage
    return fail(stage as FailureStage, rebuilt.reason as FailureReason)
  }
  const rebuiltValue = rebuilt.value as JsonRecord
  const designValue = rebuiltValue.design as JsonRecord
  const designConditions = designValue.propValue as JsonRecord[]
  const enumError = validateEnumEvidence(input.targetEnumEvidence, target, designConditions[0])
  if (enumError) return enumError

  const candidate = makeCandidate(target, rebuilt as unknown as JsonRecord)
  if (!candidate) return fail('TARGET', 'TARGET_NOT_UNIQUE')
  const evidence = input.targetEnumEvidence as JsonRecord
  const handle = Object.freeze(Object.create(null)) as object
  handles.set(handle, {
    candidate: cloneJson(candidate),
    targetRevisionDigest: revisionDigest(target.expectedRevision),
    targetComponentDataDigest: revisionDigest(target.componentData),
    targetComponentsDigest: revisionDigest(input.targetComponents),
    sourceComponentsDigest: revisionDigest(input.sourceComponents),
    targetEnumEvidenceDigest: revisionDigest(evidence)
  })
  return { ok: true as const, handle, candidate }
}

export const revalidateQueryProductPaste = (handle: unknown, currentValue: unknown) => {
  const issued = handle !== null && typeof handle === 'object' ? handles.get(handle) : undefined
  if (!issued) return fail('CANDIDATE_BINDING', 'HANDLE_INVALID')
  if (!isRecord(currentValue) || !isJsonValue(currentValue)) {
    return fail('CANDIDATE_BINDING', 'DEPENDENCY_CHANGED')
  }
  const current = currentValue
  const currentKeys = [
    'targetRevision',
    'targetComponentData',
    'targetComponents',
    'sourceComponents',
    'targetEnumEvidence'
  ]
  if (!exactKeys(current, currentKeys)) return fail('CANDIDATE_BINDING', 'DEPENDENCY_CHANGED')
  if (
    revisionDigest(current.targetRevision) !== issued.targetRevisionDigest ||
    revisionDigest(current.targetComponentData) !== issued.targetComponentDataDigest ||
    revisionDigest(current.targetComponents) !== issued.targetComponentsDigest ||
    revisionDigest(current.sourceComponents) !== issued.sourceComponentsDigest ||
    revisionDigest(current.targetEnumEvidence) !== issued.targetEnumEvidenceDigest
  ) {
    return fail('CANDIDATE_BINDING', 'DEPENDENCY_CHANGED')
  }
  return { ok: true as const, candidate: cloneJson(issued.candidate) }
}
