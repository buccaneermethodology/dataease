import { rebuildSingleSelectTarget } from './query-single-select-target-rebuild'

type JsonRecord = Record<string, unknown>
type FailureStage = 'ENVELOPE' | 'CONTAINER' | 'QTARGET'
type FailureReason =
  | 'INVALID_INPUT'
  | 'UNSUPPORTED_FIELD'
  | 'INVALID_TARGET_SHAPE'
  | 'TARGET_ID_MISMATCH'
  | 'TARGET_KIND_MISMATCH'
type JsonArray = unknown[]

const REQUIRED_TARGET_KEYS = ['id', 'component', 'innerType', 'propValue']
const OPTIONAL_TARGET_KEYS = [
  'name',
  'label',
  'icon',
  'isHang',
  'freeze',
  'x',
  'y',
  'sizeX',
  'sizeY',
  'style',
  'request',
  'matrixStyle',
  'animations',
  'canvasId',
  'events',
  'carousel',
  'multiDimensional',
  'groupStyle',
  'isLock',
  'maintainRadio',
  'aspectRatio',
  'isShow',
  'dashboardHidden',
  'category',
  'dragging',
  'resizing',
  'collapseName',
  'linkage',
  'commonBackground',
  'state',
  'cascade'
]
const TARGET_KEYS = new Set([...REQUIRED_TARGET_KEYS, ...OPTIONAL_TARGET_KEYS])
const STRING_KEYS = new Set(['name', 'label', 'icon', 'canvasId', 'category', 'state'])
const BOOLEAN_KEYS = new Set([
  'isHang',
  'freeze',
  'isLock',
  'maintainRadio',
  'isShow',
  'dashboardHidden',
  'dragging',
  'resizing'
])
const NUMBER_KEYS = new Set(['x', 'y', 'sizeX', 'sizeY', 'aspectRatio'])
const ARRAY_KEYS = new Set(['animations', 'collapseName', 'cascade'])
const OBJECT_KEYS = new Set([
  'style',
  'request',
  'matrixStyle',
  'events',
  'carousel',
  'multiDimensional',
  'groupStyle',
  'linkage',
  'commonBackground'
])

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

const isId = (value: unknown): value is string =>
  typeof value === 'string' && value.length > 0 && !value.includes('--')

const cloneJson = <T>(value: T): T => {
  if (Array.isArray(value)) return value.map(item => cloneJson(item)) as T
  if (isRecord(value)) {
    const clone: JsonRecord = {}
    for (const [key, item] of Object.entries(value)) {
      Object.defineProperty(clone, key, {
        configurable: true,
        enumerable: true,
        value: cloneJson(item),
        writable: true
      })
    }
    return clone as T
  }
  return value
}

const fail = (stage: FailureStage, reason: FailureReason) => ({
  ok: false as const,
  stage,
  reason
})

const hasValidTargetMetadata = (target: JsonRecord) => {
  for (const [key, value] of Object.entries(target)) {
    if (STRING_KEYS.has(key) && typeof value !== 'string') return false
    if (BOOLEAN_KEYS.has(key) && typeof value !== 'boolean') return false
    if (NUMBER_KEYS.has(key) && (typeof value !== 'number' || !Number.isFinite(value))) return false
    if (ARRAY_KEYS.has(key) && !Array.isArray(value)) return false
    if (OBJECT_KEYS.has(key) && !isRecord(value)) return false
  }
  return true
}

const isValidTarget = (target: unknown, expectedTargetId: unknown) => {
  if (!isRecord(target)) return fail('CONTAINER', 'INVALID_TARGET_SHAPE')
  const keys = Object.keys(target)
  if (
    REQUIRED_TARGET_KEYS.some(key => !Object.hasOwn(target, key)) ||
    keys.some(key => !TARGET_KEYS.has(key))
  ) {
    return fail('CONTAINER', 'UNSUPPORTED_FIELD')
  }
  if (!isId(target.id) || !isId(expectedTargetId)) {
    return fail('CONTAINER', 'INVALID_TARGET_SHAPE')
  }
  if (target.id !== expectedTargetId) return fail('CONTAINER', 'TARGET_ID_MISMATCH')
  if (target.component !== 'VQuery' || target.innerType !== 'VQuery') {
    return fail('CONTAINER', 'TARGET_KIND_MISMATCH')
  }
  if (
    (target.propValue !== '' && !Array.isArray(target.propValue)) ||
    (Object.hasOwn(target, 'cascade') && !Array.isArray(target.cascade)) ||
    !hasValidTargetMetadata(target)
  ) {
    return fail('CONTAINER', 'INVALID_TARGET_SHAPE')
  }
  return null
}

export const prepareSingleSelectQueryPayload = (input: unknown) => {
  if (!isRecord(input) || !isJsonValue(input)) return fail('ENVELOPE', 'INVALID_INPUT')
  if (!exactKeys(input, ['target', 'expectedTargetId', 'rebuildInput'])) {
    return fail('ENVELOPE', 'UNSUPPORTED_FIELD')
  }

  const targetFailure = isValidTarget(input.target, input.expectedTargetId)
  if (targetFailure) return targetFailure

  const rebuilt = rebuildSingleSelectTarget(input.rebuildInput)
  if (!rebuilt.ok) {
    return {
      ok: false as const,
      stage: 'QTARGET' as const,
      cause: { stage: rebuilt.stage, reason: rebuilt.reason }
    }
  }

  const designPayload = cloneJson(input.target) as JsonRecord
  const runtimePayload = cloneJson(input.target) as JsonRecord
  designPayload.propValue = cloneJson(rebuilt.value.design.propValue)
  designPayload.cascade = cloneJson(rebuilt.value.design.cascade)
  runtimePayload.propValue = cloneJson(rebuilt.value.runtime.propValue)
  runtimePayload.cascade = cloneJson(rebuilt.value.runtime.cascade)

  return { ok: true as const, value: { designPayload, runtimePayload } }
}
