import { prepareQueryReferencePipeline } from './query-reference-pipeline'
import { prepareSingleSelectQueryPayload } from './query-single-select-query-payload'

type JsonRecord = Record<string, unknown>

const ROOT_KEYS = [
  'propValue',
  'cascade',
  'maps',
  'sourceComponents',
  'targetComponents',
  'target',
  'expectedTargetId'
]

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

const hasExactKeys = (value: JsonRecord, keys: readonly string[]) => {
  const actual = Object.keys(value)
  return actual.length === keys.length && keys.every(key => Object.hasOwn(value, key))
}

const fail = (stage: string, reason: string) => ({ ok: false as const, stage, reason })

export const prepareSingleSelectQueryEndToEnd = (input: unknown) => {
  if (!isRecord(input) || !isJsonValue(input)) return fail('ENVELOPE', 'INVALID_INPUT')
  if (!hasExactKeys(input, ROOT_KEYS)) return fail('ENVELOPE', 'UNSUPPORTED_FIELD')

  const references = prepareQueryReferencePipeline({
    propValue: input.propValue,
    cascade: input.cascade,
    maps: input.maps,
    sourceComponents: input.sourceComponents,
    targetComponents: input.targetComponents
  })
  if (!references.ok) {
    return {
      ok: false as const,
      stage: 'REFERENCE_PIPELINE' as const,
      cause: { stage: references.stage, reason: references.reason }
    }
  }

  return prepareSingleSelectQueryPayload({
    target: input.target,
    expectedTargetId: input.expectedTargetId,
    rebuildInput: {
      source: { propValue: input.propValue, cascade: input.cascade },
      referencePlan: references.value,
      targetComponents: input.targetComponents
    }
  })
}
