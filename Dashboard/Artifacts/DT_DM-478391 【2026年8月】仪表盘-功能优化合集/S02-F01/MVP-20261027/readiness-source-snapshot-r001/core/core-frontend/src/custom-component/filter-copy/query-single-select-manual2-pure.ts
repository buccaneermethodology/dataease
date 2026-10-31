export interface Manual2ValueState {
  displayType: '0'
  multiple: false
  optionValueSource: 2
  defaultValueCheck: boolean
  defaultValueFirstItem: false
  defaultMapValue: []
  valueSource: string[]
  defaultValue?: string | undefined
  selectValue?: string | undefined
  mapValue?: string[]
}

export interface Manual2ValueStateCarrier {
  schemaVersion: 1
  shape: {
    displayType: '0'
    multiple: false
    optionValueSource: 2
  }
  design: {
    defaultValueCheck: boolean
    defaultValueFirstItem: false
    valueSource: string[]
    defaultValue?: string
  }
}

export interface Manual2ValueStateRuntime {
  selectValue: string | undefined
  mapValue: string[]
}

export type Manual2PreparationResult =
  | {
      status: 'OK'
      carrier: Manual2ValueStateCarrier
      runtime: Manual2ValueStateRuntime
    }
  | {
      status: 'REJECTED'
      carrier: null
      runtime: null
    }

const REQUIRED_KEYS = [
  'displayType',
  'multiple',
  'optionValueSource',
  'defaultValueCheck',
  'defaultValueFirstItem',
  'defaultMapValue',
  'valueSource'
] as const

const OPTIONAL_KEYS = ['defaultValue', 'selectValue', 'mapValue'] as const
const ALLOWED_KEYS = new Set<string>([...REQUIRED_KEYS, ...OPTIONAL_KEYS])
const rejected = (): Manual2PreparationResult => ({
  status: 'REJECTED',
  carrier: null,
  runtime: null
})

const isOrdinaryDenseArray = (value: unknown): value is unknown[] => {
  if (!Array.isArray(value) || Object.getPrototypeOf(value) !== Array.prototype) return false

  const keys = Reflect.ownKeys(value)
  if (keys.length !== value.length + 1 || !keys.includes('length')) return false

  const lengthDescriptor = Object.getOwnPropertyDescriptor(value, 'length')
  if (!lengthDescriptor || lengthDescriptor.enumerable || !('value' in lengthDescriptor)) {
    return false
  }

  for (let index = 0; index < value.length; index += 1) {
    const descriptor = Object.getOwnPropertyDescriptor(value, String(index))
    if (!descriptor || !descriptor.enumerable || !('value' in descriptor)) return false
  }

  return true
}

const isStringArray = (value: unknown): value is string[] =>
  isOrdinaryDenseArray(value) && value.every(item => typeof item === 'string')

const readPlainDataObject = (value: unknown): Map<string, unknown> | null => {
  if (value === null || typeof value !== 'object' || Array.isArray(value)) return null
  const prototype = Object.getPrototypeOf(value)
  if (prototype !== Object.prototype && prototype !== null) return null

  const entries = new Map<string, unknown>()
  for (const key of Reflect.ownKeys(value)) {
    if (typeof key !== 'string') return null
    const descriptor = Object.getOwnPropertyDescriptor(value, key)
    if (!descriptor || !descriptor.enumerable || !('value' in descriptor)) return null
    entries.set(key, descriptor.value)
  }
  return entries
}

const hasRequiredKeys = (value: Map<string, unknown>): boolean =>
  REQUIRED_KEYS.every(key => value.has(key))

const hasExactKeys = (value: Map<string, unknown>): boolean =>
  [...value.keys()].every(key => ALLOWED_KEYS.has(key))

export const prepareManual2ValueState = (valueState: unknown): Manual2PreparationResult => {
  const fields = readPlainDataObject(valueState)
  if (!fields || !hasExactKeys(fields) || !hasRequiredKeys(fields)) return rejected()

  if (
    fields.get('displayType') !== '0' ||
    fields.get('multiple') !== false ||
    fields.get('optionValueSource') !== 2 ||
    fields.get('defaultValueFirstItem') !== false ||
    typeof fields.get('defaultValueCheck') !== 'boolean'
  ) {
    return rejected()
  }

  const defaultMapValue = fields.get('defaultMapValue')
  const valueSource = fields.get('valueSource')
  if (
    !isOrdinaryDenseArray(defaultMapValue) ||
    defaultMapValue.length !== 0 ||
    !isStringArray(valueSource) ||
    valueSource.length === 0 ||
    valueSource.some(value => value.trim().length === 0) ||
    new Set(valueSource).size !== valueSource.length
  ) {
    return rejected()
  }

  const defaultValueCheck = fields.get('defaultValueCheck') as boolean
  const hasDefaultValue = fields.has('defaultValue')
  const defaultValue = fields.get('defaultValue')
  if (
    (hasDefaultValue && defaultValue !== undefined && typeof defaultValue !== 'string') ||
    (defaultValueCheck &&
      (typeof defaultValue !== 'string' ||
        defaultValue.length === 0 ||
        !valueSource.includes(defaultValue)))
  ) {
    return rejected()
  }

  if (fields.has('selectValue')) {
    const selectValue = fields.get('selectValue')
    if (selectValue !== undefined && typeof selectValue !== 'string') return rejected()
  }
  if (fields.has('mapValue') && !isStringArray(fields.get('mapValue'))) return rejected()

  const design: Manual2ValueStateCarrier['design'] = {
    defaultValueCheck,
    defaultValueFirstItem: false,
    valueSource: [...valueSource]
  }
  if (defaultValueCheck) design.defaultValue = defaultValue as string

  const carrier: Manual2ValueStateCarrier = {
    schemaVersion: 1,
    shape: {
      displayType: '0',
      multiple: false,
      optionValueSource: 2
    },
    design
  }
  const runtime: Manual2ValueStateRuntime = {
    selectValue: defaultValueCheck ? (defaultValue as string) : undefined,
    mapValue: []
  }

  return { status: 'OK', carrier, runtime }
}
