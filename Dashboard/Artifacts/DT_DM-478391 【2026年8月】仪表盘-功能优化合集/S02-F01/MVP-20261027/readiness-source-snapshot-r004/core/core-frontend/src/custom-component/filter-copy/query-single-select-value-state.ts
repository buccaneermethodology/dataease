export interface SingleSelectDesignValues {
  displayType: '0'
  multiple: false
  optionValueSource: 1
  defaultValueCheck: true
  defaultValueFirstItem: false
  defaultValue: string
  defaultMapValue: string[]
}

export interface SingleSelectRuntimeValues extends SingleSelectDesignValues {
  selectValue: string
  mapValue: string[]
}

export type SingleSelectValueStateResult =
  | { ok: true; value: { design: SingleSelectDesignValues; runtime: SingleSelectRuntimeValues } }
  | { ok: false; reason: 'INVALID_INPUT' | 'UNSUPPORTED_FIELD' | 'UNSUPPORTED_SHAPE' }

const inputKeys = [
  'displayType',
  'multiple',
  'optionValueSource',
  'defaultValueCheck',
  'defaultValueFirstItem',
  'defaultValue',
  'defaultMapValue',
  'selectValue',
  'mapValue'
] as const

const isJsonValue = (value: unknown, seen: WeakSet<object>): boolean => {
  if (value === null || typeof value === 'string' || typeof value === 'boolean') return true
  if (typeof value === 'number') return Number.isFinite(value)
  if (typeof value !== 'object') return false
  if (seen.has(value)) return false
  seen.add(value)

  try {
    if (Array.isArray(value)) {
      if (Object.getPrototypeOf(value) !== Array.prototype) return false
      const keys = Reflect.ownKeys(value)
      if (keys.length !== value.length + 1 || !keys.includes('length')) return false
      for (let index = 0; index < value.length; index += 1) {
        const descriptor = Object.getOwnPropertyDescriptor(value, String(index))
        if (!descriptor || !descriptor.enumerable || !('value' in descriptor)) return false
        if (!isJsonValue(descriptor.value, seen)) return false
      }
      return true
    }

    if (Object.getPrototypeOf(value) !== Object.prototype) return false
    for (const key of Reflect.ownKeys(value)) {
      if (typeof key !== 'string') return false
      const descriptor = Object.getOwnPropertyDescriptor(value, key)
      if (!descriptor || !descriptor.enumerable || !('value' in descriptor)) return false
      if (!isJsonValue(descriptor.value, seen)) return false
    }
    return true
  } finally {
    seen.delete(value)
  }
}

const isNonEmptyString = (value: unknown): value is string =>
  typeof value === 'string' && value.length > 0

const isSingleNonEmptyStringArray = (value: unknown): value is [string] =>
  Array.isArray(value) && value.length === 1 && isNonEmptyString(value[0])

const failure = (reason: 'INVALID_INPUT' | 'UNSUPPORTED_FIELD' | 'UNSUPPORTED_SHAPE') => ({
  ok: false as const,
  reason
})

export const prepareSingleSelectValueState = (input: unknown): SingleSelectValueStateResult => {
  if (!isJsonValue(input, new WeakSet())) return failure('INVALID_INPUT')
  if (input === null || Array.isArray(input) || typeof input !== 'object') {
    return failure('INVALID_INPUT')
  }

  const keys = Object.keys(input)
  if (keys.length !== inputKeys.length || inputKeys.some(key => !Object.hasOwn(input, key))) {
    return failure('UNSUPPORTED_FIELD')
  }

  const value = input as Record<(typeof inputKeys)[number], unknown>
  if (
    value.displayType !== '0' ||
    value.multiple !== false ||
    value.optionValueSource !== 1 ||
    value.defaultValueCheck !== true ||
    value.defaultValueFirstItem !== false ||
    !isNonEmptyString(value.defaultValue) ||
    !isSingleNonEmptyStringArray(value.defaultMapValue) ||
    !isNonEmptyString(value.selectValue) ||
    !isSingleNonEmptyStringArray(value.mapValue)
  ) {
    return failure('UNSUPPORTED_SHAPE')
  }

  const design: SingleSelectDesignValues = {
    displayType: value.displayType,
    multiple: value.multiple,
    optionValueSource: value.optionValueSource,
    defaultValueCheck: value.defaultValueCheck,
    defaultValueFirstItem: value.defaultValueFirstItem,
    defaultValue: value.defaultValue,
    defaultMapValue: [...value.defaultMapValue]
  }
  const runtime: SingleSelectRuntimeValues = {
    displayType: design.displayType,
    multiple: design.multiple,
    optionValueSource: design.optionValueSource,
    defaultValueCheck: design.defaultValueCheck,
    defaultValueFirstItem: design.defaultValueFirstItem,
    defaultValue: design.defaultValue,
    defaultMapValue: [...design.defaultMapValue],
    selectValue: design.defaultValue,
    mapValue: [...design.defaultMapValue]
  }

  return { ok: true, value: { design, runtime } }
}
