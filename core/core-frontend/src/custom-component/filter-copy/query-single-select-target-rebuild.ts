import { prepareQuerySingleSelectCarrier } from './query-single-select-carrier'

type FailureStage = 'ENVELOPE' | 'QCARRIER' | 'PLAN' | 'DIRECTORY'
type FailureReason =
  | 'INVALID_INPUT'
  | 'UNSUPPORTED_FIELD'
  | 'UNSUPPORTED_SHAPE'
  | 'QVALUE_ERROR'
  | 'PLAN_MISMATCH'
  | 'TARGET_UNRESOLVED'
type JsonRecord = Record<string, unknown>

const fail = (stage: FailureStage, reason: FailureReason) => ({ ok: false as const, stage, reason })
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
      for (let i = 0; i < value.length; i += 1) {
        const descriptor = Object.getOwnPropertyDescriptor(value, String(i))
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
const isId = (value: unknown): value is string =>
  typeof value === 'string' && value.length > 0 && !value.includes('--')
const cloneJson = <T>(value: T): T => {
  if (Array.isArray(value)) return value.map(item => cloneJson(item)) as T
  if (isRecord(value)) {
    const copy: JsonRecord = {}
    Object.entries(value).forEach(([key, item]) => (copy[key] = cloneJson(item)))
    return copy as T
  }
  return value
}

export const rebuildSingleSelectTarget = (input: unknown) => {
  if (!isRecord(input) || !isJsonValue(input)) return fail('ENVELOPE', 'INVALID_INPUT')
  if (!exactKeys(input, ['source', 'referencePlan', 'targetComponents'])) {
    return fail('ENVELOPE', 'UNSUPPORTED_FIELD')
  }

  const carrier = prepareQuerySingleSelectCarrier(
    input.source as Parameters<typeof prepareQuerySingleSelectCarrier>[0]
  )
  if (!carrier.ok) return fail('QCARRIER', carrier.reason as FailureReason)

  const source = input.source as { propValue: JsonRecord[] }
  const sourceCondition = source.propValue[0]
  const plan = input.referencePlan
  if (!isRecord(plan) || !exactKeys(plan, ['conditions', 'chains']))
    return fail('PLAN', 'PLAN_MISMATCH')
  if (
    !Array.isArray(plan.conditions) ||
    plan.conditions.length !== 1 ||
    !Array.isArray(plan.chains) ||
    plan.chains.length !== 0
  ) {
    return fail('PLAN', 'PLAN_MISMATCH')
  }
  const condition = plan.conditions[0]
  if (
    !isRecord(condition) ||
    !exactKeys(condition, ['id', 'datasetId', 'fieldId', 'targetRefs']) ||
    !isId(condition.id) ||
    condition.id === sourceCondition.id ||
    !isId(condition.datasetId) ||
    !isId(condition.fieldId) ||
    !Array.isArray(condition.targetRefs)
  )
    return fail('PLAN', 'PLAN_MISMATCH')

  const sourceField = sourceCondition.field as JsonRecord
  const sourceDataset = sourceCondition.dataset as JsonRecord
  const sourceFields = sourceCondition.checkedFields as string[]
  if (
    condition.datasetId !== sourceDataset.id ||
    condition.fieldId !== sourceField.id ||
    condition.targetRefs.length !== sourceFields.length
  ) {
    return fail('PLAN', 'PLAN_MISMATCH')
  }
  const targetRefs: { componentId: string; datasetId: string; fieldId: string }[] = []
  for (const ref of condition.targetRefs) {
    if (
      !isRecord(ref) ||
      !exactKeys(ref, ['componentId', 'datasetId', 'fieldId']) ||
      !isId(ref.componentId) ||
      !isId(ref.datasetId) ||
      !isId(ref.fieldId) ||
      ref.datasetId !== sourceDataset.id ||
      ref.fieldId !== sourceField.id
    ) {
      return fail('PLAN', 'PLAN_MISMATCH')
    }
    targetRefs.push({
      componentId: ref.componentId,
      datasetId: ref.datasetId,
      fieldId: ref.fieldId
    })
  }

  const directory = input.targetComponents
  if (!Array.isArray(directory) || directory.length === 0)
    return fail('DIRECTORY', 'TARGET_UNRESOLVED')
  const byId = new Map<string, JsonRecord>()
  for (const item of directory) {
    if (
      !isRecord(item) ||
      !exactKeys(item, ['componentId', 'datasetId', 'fieldIds']) ||
      !isId(item.componentId) ||
      !isId(item.datasetId) ||
      !Array.isArray(item.fieldIds) ||
      !item.fieldIds.every(isId) ||
      new Set(item.fieldIds).size !== item.fieldIds.length ||
      byId.has(item.componentId)
    ) {
      return fail('DIRECTORY', 'TARGET_UNRESOLVED')
    }
    byId.set(item.componentId, item)
  }
  const mappedIds: string[] = []
  for (const ref of targetRefs) {
    const target = byId.get(ref.componentId)
    if (
      !target ||
      target.datasetId !== ref.datasetId ||
      !(target.fieldIds as string[]).includes(ref.fieldId)
    ) {
      return fail('DIRECTORY', 'TARGET_UNRESOLVED')
    }
    if (!mappedIds.includes(ref.componentId)) mappedIds.push(ref.componentId)
  }

  const rebind = (conditionValue: JsonRecord): JsonRecord => {
    const output = cloneJson(conditionValue)
    output.id = condition.id
    output.checkedFields = [...mappedIds]
    output.checkedFieldsMap = Object.fromEntries(mappedIds.map(id => [id, sourceField.id]))
    return output
  }
  return {
    ok: true as const,
    value: {
      design: { propValue: [rebind(carrier.value.design.propValue[0])], cascade: [] as [] },
      runtime: { propValue: [rebind(carrier.value.runtime.propValue[0])], cascade: [] as [] }
    }
  }
}
