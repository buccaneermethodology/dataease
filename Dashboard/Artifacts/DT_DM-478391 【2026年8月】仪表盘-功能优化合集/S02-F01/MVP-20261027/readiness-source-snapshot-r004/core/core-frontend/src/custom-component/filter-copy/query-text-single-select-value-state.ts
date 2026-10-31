declare const verifiedDesignValueSnapshotBrand: unique symbol
declare const verifiedDesignBindingBrand: unique symbol

/** Opaque input produced only by an independently verified design-state reader. */
export interface VerifiedDesignValueSnapshot {
  readonly [verifiedDesignValueSnapshotBrand]: true
  readonly revision: number
  readonly resourceId: string
  readonly componentId: string
}

/** Opaque expected binding supplied by the caller of an already-authenticated read. */
export interface VerifiedDesignBinding {
  readonly [verifiedDesignBindingBrand]: true
  readonly revision: number
  readonly resourceId: string
  readonly componentId: string
}

export interface TextSingleSelectValueState {
  displayType: '0'
  multiple: false
  optionValueSource: 0
  defaultValueCheck: boolean
  defaultValueFirstItem: false
  defaultValue?: string
  selectValue?: string
  mapValue?: string[]
}

export interface TextSingleSelectValueStateInput {
  snapshot: VerifiedDesignValueSnapshot
  expectedBinding: VerifiedDesignBinding
  valueState: TextSingleSelectValueState
}

export interface TextSingleSelectValueStateCarrier {
  schemaVersion: 1
  revision: number
  resourceId: string
  componentId: string
  shape: {
    displayType: '0'
    multiple: false
    optionValueSource: 0
  }
  design: {
    defaultValueCheck: boolean
    defaultValueFirstItem: false
    defaultValue?: string
  }
}

export interface TextSingleSelectValueStateRuntime {
  defaultValueCheck: boolean
  defaultValueFirstItem: false
  defaultValue?: string
  selectValue: string | undefined
}

export type TextSingleSelectValueStateStatus =
  | {
      status: 'OK'
      carrier: TextSingleSelectValueStateCarrier
      runtime: TextSingleSelectValueStateRuntime
    }
  | {
      status:
        | 'SOURCE_STAGE_UNVERIFIED'
        | 'INVALID_INPUT'
        | 'UNSUPPORTED_FIELD'
        | 'UNSUPPORTED_SHAPE'
        | 'DEFAULT_VALUE_INVALID'
      carrier: null
      runtime: null
    }

const allowedKeys = [
  'displayType',
  'multiple',
  'optionValueSource',
  'defaultValueCheck',
  'defaultValueFirstItem',
  'defaultValue',
  'selectValue',
  'mapValue'
] as const

const requiredKeys = [
  'displayType',
  'multiple',
  'optionValueSource',
  'defaultValueCheck',
  'defaultValueFirstItem'
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

const isValidIdentity = (
  value: unknown
): value is { revision: number; resourceId: string; componentId: string } => {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return false
  if (!isJsonValue(value, new WeakSet())) return false
  const identity = value as Record<string, unknown>
  return (
    Number.isSafeInteger(identity.revision) &&
    (identity.revision as number) > 0 &&
    typeof identity.resourceId === 'string' &&
    identity.resourceId.length > 0 &&
    typeof identity.componentId === 'string' &&
    identity.componentId.length > 0
  )
}

const failure = (
  status: Exclude<TextSingleSelectValueStateStatus['status'], 'OK'>
): TextSingleSelectValueStateStatus => ({
  status,
  carrier: null,
  runtime: null
})

export const prepareTextSingleSelectValueState = (
  input: TextSingleSelectValueStateInput
): TextSingleSelectValueStateStatus => {
  const { snapshot, expectedBinding } = input
  if (!isValidIdentity(snapshot) || !isValidIdentity(expectedBinding)) {
    return failure('INVALID_INPUT')
  }

  if (
    snapshot.revision !== expectedBinding.revision ||
    snapshot.resourceId !== expectedBinding.resourceId ||
    snapshot.componentId !== expectedBinding.componentId
  ) {
    return failure('SOURCE_STAGE_UNVERIFIED')
  }

  const rawValueState: unknown = input.valueState
  if (!isJsonValue(rawValueState, new WeakSet())) return failure('INVALID_INPUT')
  if (rawValueState === null || Array.isArray(rawValueState) || typeof rawValueState !== 'object') {
    return failure('INVALID_INPUT')
  }

  const valueState = rawValueState as Record<string, unknown>
  const keys = Object.keys(valueState)
  if (
    keys.some(key => !(allowedKeys as readonly string[]).includes(key)) ||
    requiredKeys.some(key => !Object.hasOwn(valueState, key))
  ) {
    return failure('UNSUPPORTED_FIELD')
  }

  if (
    valueState.displayType !== '0' ||
    valueState.multiple !== false ||
    valueState.optionValueSource !== 0 ||
    valueState.defaultValueFirstItem !== false
  ) {
    return failure('UNSUPPORTED_SHAPE')
  }

  if (
    typeof valueState.defaultValueCheck !== 'boolean' ||
    (Object.hasOwn(valueState, 'defaultValue') && typeof valueState.defaultValue !== 'string') ||
    (valueState.defaultValueCheck &&
      (typeof valueState.defaultValue !== 'string' || valueState.defaultValue.length === 0))
  ) {
    return failure('DEFAULT_VALUE_INVALID')
  }
  if (valueState.selectValue !== undefined && typeof valueState.selectValue !== 'string') {
    return failure('INVALID_INPUT')
  }
  if (
    valueState.mapValue !== undefined &&
    (!Array.isArray(valueState.mapValue) ||
      valueState.mapValue.some(item => typeof item !== 'string'))
  ) {
    return failure('INVALID_INPUT')
  }

  const design: TextSingleSelectValueStateCarrier['design'] = {
    defaultValueCheck: valueState.defaultValueCheck,
    defaultValueFirstItem: false
  }
  if (valueState.defaultValueCheck) design.defaultValue = valueState.defaultValue as string

  const carrier: TextSingleSelectValueStateCarrier = {
    schemaVersion: 1,
    revision: snapshot.revision,
    resourceId: snapshot.resourceId,
    componentId: snapshot.componentId,
    shape: { displayType: '0', multiple: false, optionValueSource: 0 },
    design
  }
  const runtime: TextSingleSelectValueStateRuntime = {
    defaultValueCheck: design.defaultValueCheck,
    defaultValueFirstItem: false,
    selectValue: design.defaultValueCheck ? design.defaultValue : undefined
  }
  if (design.defaultValueCheck) runtime.defaultValue = design.defaultValue

  return { status: 'OK', carrier, runtime }
}
